-- Applied to the V55 Supabase project after migration 001.
begin;
create or replace function public.tt_v54_load() returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare r public.tt_cloud_snapshots%rowtype;
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode='42501'; end if;
  select * into r from public.tt_cloud_snapshots where user_id=auth.uid();
  if not found then return jsonb_build_object('error','empty','version',0); end if;
  return jsonb_build_object('snap',r.snapshot,'at',r.updated_at,'size',r.size_bytes,'version',r.version);
end; $$;

-- Trusted, narrow write boundary: unlike the invoker read RPC, this function
-- deliberately runs as its migration owner. That role may bypass RLS.
-- Therefore caller UID and verified identity are checked explicitly below;
-- there is NO caller-supplied owner ID and all writes use auth.uid().
create or replace function public.tt_v54_save(p_snapshot jsonb, p_expected_version bigint) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid(); verified_email text; bound_email text;
  previous public.tt_cloud_snapshots%rowtype; current_version bigint := 0;
  next_version bigint; bytes integer; stamp timestamptz := now();
begin
  if actor is null then raise exception 'unauthorized' using errcode='42501'; end if;
  select lower(btrim(email)) into verified_email from auth.users
    where id=actor and email_confirmed_at is not null;
  if verified_email is null then raise exception 'email_confirmation_required' using errcode='42501'; end if;
  if p_expected_version is null or p_expected_version < 0 then
    raise exception 'expected_version_required' using errcode='22023';
  end if;
  if p_snapshot is null or jsonb_typeof(p_snapshot) is distinct from 'object'
    or (p_snapshot->>'schema') is distinct from 'v54.1'
    or jsonb_typeof(p_snapshot->'user') is distinct from 'object'
    or jsonb_typeof(p_snapshot->'data') is distinct from 'object'
    or jsonb_typeof(p_snapshot->'platform') is distinct from 'object'
    or jsonb_typeof(p_snapshot->'community') is distinct from 'object'
    or coalesce(p_snapshot->>'localUserId','') = ''
    or (p_snapshot#>>'{user,id}') is distinct from (p_snapshot->>'localUserId') then
    raise exception 'invalid_snapshot' using errcode='22023';
  end if;
  if lower(btrim(p_snapshot->>'linkedEmail')) is distinct from verified_email
    or lower(btrim(p_snapshot#>>'{user,email}')) is distinct from verified_email then
    raise exception 'email_mismatch' using errcode='42501';
  end if;
  -- Reject full Store/vault exports and credential-bearing user records.
  if p_snapshot ?| array['users','session','tokens','accounts','refresh_token','access_token']
    or (p_snapshot->'user') ?| array['pass','password','hash','salt','token'] then
    raise exception 'credentials_not_allowed' using errcode='22023';
  end if;
  if (p_snapshot ? 'routes') and
    (p_snapshot->'routes') is distinct from coalesce(p_snapshot#>'{data,routes}','[]'::jsonb) then
    raise exception 'routes_mismatch' using errcode='22023';
  end if;
  bytes := octet_length(p_snapshot::text);
  if bytes > 4400000 then raise exception 'too_large' using errcode='22023'; end if;

  insert into public.tt_cloud_accounts(user_id,legacy_email) values(actor,verified_email)
    on conflict(user_id) do nothing;
  -- Serialize writes including the first snapshot; immutable legacy email binding.
  select legacy_email into bound_email from public.tt_cloud_accounts where user_id=actor for update;
  if bound_email is distinct from verified_email then
    raise exception 'identity_relink_required' using errcode='42501';
  end if;
  select * into previous from public.tt_cloud_snapshots where user_id=actor;
  if found then current_version := previous.version; end if;
  -- Retry of identical content is a no-op. Only the envelope timestamp is ignored.
  if current_version > 0 and (previous.snapshot - 'ts') = (p_snapshot - 'ts') then
    return jsonb_build_object('ok',true,'unchanged',true,'version',current_version,
      'at',previous.updated_at,'size',previous.size_bytes);
  end if;
  if current_version <> p_expected_version then
    -- 40001 is retryable and can make PostgREST wait until its upstream timeout.
    -- P0001 returns the explicit optimistic-lock conflict immediately.
    raise exception 'version_conflict' using errcode='P0001';
  end if;
  next_version := current_version + 1;
  insert into public.tt_cloud_snapshots(user_id,snapshot,version,size_bytes,updated_at)
    values(actor,p_snapshot,next_version,bytes,stamp)
    on conflict(user_id) do update set snapshot=excluded.snapshot,version=excluded.version,
      size_bytes=excluded.size_bytes,updated_at=excluded.updated_at;
  insert into public.tt_cloud_snapshot_revisions(user_id,version,snapshot,size_bytes,created_at)
    values(actor,next_version,p_snapshot,bytes,stamp);
  return jsonb_build_object('ok',true,'version',next_version,'at',stamp,'size',bytes);
end; $$;
revoke all on function public.tt_v54_load() from public, anon;
revoke all on function public.tt_v54_save(jsonb,bigint) from public, anon;
grant execute on function public.tt_v54_load() to authenticated;
grant execute on function public.tt_v54_save(jsonb,bigint) to authenticated;
commit;
