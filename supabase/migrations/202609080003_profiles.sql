-- Supabase profile projection for the existing V117.1 Auth/Store boundary.
-- The local Store remains the offline source; this table is the cloud profile.
begin;

create table public.tt_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 80),
  avatar_url text null check (avatar_url is null or char_length(avatar_url) <= 2048),
  bio text null check (bio is null or char_length(bio) <= 2000),
  city text null check (city is null or char_length(city) <= 120),
  hiking_profile jsonb not null default '{}'::jsonb
    check (jsonb_typeof(hiking_profile) = 'object'),
  is_discoverable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tt_profiles_discoverable_idx
  on public.tt_profiles (is_discoverable, updated_at desc)
  where is_discoverable = true;

create or replace function public.tt_profiles_touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tt_profiles_touch_updated_at
before update on public.tt_profiles
for each row execute function public.tt_profiles_touch_updated_at();

alter table public.tt_profiles enable row level security;
alter table public.tt_profiles force row level security;
revoke all on public.tt_profiles from public, anon, authenticated;
grant select on public.tt_profiles to authenticated;

create policy profiles_read_own_or_discoverable
on public.tt_profiles for select to authenticated
using ((select auth.uid()) = user_id or is_discoverable = true);

create or replace function public.tt_profile_upsert(p_profile jsonb)
returns public.tt_profiles
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  actor uuid := auth.uid();
  result_row public.tt_profiles;
  profile jsonb := coalesce(p_profile, '{}'::jsonb);
begin
  if actor is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if jsonb_typeof(profile) <> 'object' then
    raise exception 'invalid_profile' using errcode = '22023';
  end if;
  if char_length(btrim(coalesce(profile->>'display_name', ''))) < 2
     or char_length(btrim(coalesce(profile->>'display_name', ''))) > 80 then
    raise exception 'invalid_profile_display_name' using errcode = '22023';
  end if;

  insert into public.tt_profiles (
    user_id, display_name, avatar_url, bio, city, hiking_profile, is_discoverable
  ) values (
    actor,
    btrim(profile->>'display_name'),
    nullif(profile->>'avatar_url', ''),
    nullif(profile->>'bio', ''),
    nullif(profile->>'city', ''),
    case when jsonb_typeof(profile->'hiking_profile') = 'object'
      then profile->'hiking_profile' else '{}'::jsonb end,
    coalesce((profile->>'is_discoverable')::boolean, false)
  )
  on conflict (user_id) do update set
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    bio = excluded.bio,
    city = excluded.city,
    hiking_profile = excluded.hiking_profile,
    is_discoverable = excluded.is_discoverable
  returning * into result_row;

  return result_row;
end;
$$;

revoke all on function public.tt_profile_upsert(jsonb) from public, anon;
grant execute on function public.tt_profile_upsert(jsonb) to authenticated;

commit;
