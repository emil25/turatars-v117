-- Applied to the V55 Supabase project. Keep this file as the reproducible schema source.
-- Store entities and IDs stay inside the existing v54.1 snapshot.
begin;
create table public.tt_cloud_accounts (
  user_id uuid primary key references auth.users(id) on delete restrict,
  legacy_email text not null unique check (legacy_email = lower(btrim(legacy_email))),
  created_at timestamptz not null default now()
);
create table public.tt_cloud_snapshots (
  user_id uuid primary key references public.tt_cloud_accounts(user_id) on delete restrict,
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and snapshot->>'schema' = 'v54.1'),
  version bigint not null check (version > 0),
  size_bytes integer not null check (size_bytes between 1 and 4400000),
  updated_at timestamptz not null default now()
);
create table public.tt_cloud_snapshot_revisions (
  user_id uuid not null references public.tt_cloud_accounts(user_id) on delete restrict,
  version bigint not null check (version > 0),
  snapshot jsonb not null,
  size_bytes integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, version)
);
alter table public.tt_cloud_accounts enable row level security;
alter table public.tt_cloud_accounts force row level security;
alter table public.tt_cloud_snapshots enable row level security;
alter table public.tt_cloud_snapshots force row level security;
alter table public.tt_cloud_snapshot_revisions enable row level security;
alter table public.tt_cloud_snapshot_revisions force row level security;
revoke all on public.tt_cloud_accounts, public.tt_cloud_snapshots,
  public.tt_cloud_snapshot_revisions from public, anon, authenticated;
grant select on public.tt_cloud_accounts, public.tt_cloud_snapshots,
  public.tt_cloud_snapshot_revisions to authenticated;
create policy accounts_read_own on public.tt_cloud_accounts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy snapshots_read_own on public.tt_cloud_snapshots for select to authenticated
  using ((select auth.uid()) = user_id);
create policy revisions_read_own on public.tt_cloud_snapshot_revisions for select to authenticated
  using ((select auth.uid()) = user_id);
-- No direct client INSERT/UPDATE/DELETE policies or grants.
-- Only the narrowly scoped commit RPC in migration 002 may write.
commit;
