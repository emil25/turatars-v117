-- V126 community tours: user-owned GPS tours are separate from the verified catalog.
-- No existing snapshot/catalog table is changed.
create table if not exists public.tt_community_tours (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 160),
  visibility text not null default 'private' check (visibility in ('private','public')),
  distance_km numeric(10,2),
  duration_minutes integer,
  elevation_gain_m integer,
  difficulty text,
  tour_date date,
  track jsonb not null default '[]'::jsonb check (jsonb_typeof(track) = 'array'),
  gpx_public boolean not null default false,
  source text not null default 'user_gps',
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tt_community_tours_public_idx
  on public.tt_community_tours (visibility, updated_at desc);
create index if not exists tt_community_tours_owner_idx
  on public.tt_community_tours (owner_id, updated_at desc);

alter table public.tt_community_tours enable row level security;
alter table public.tt_community_tours force row level security;

drop policy if exists community_tours_read_public_or_own on public.tt_community_tours;
create policy community_tours_read_public_or_own
  on public.tt_community_tours for select
  using (visibility = 'public' or owner_id = auth.uid());
drop policy if exists community_tours_insert_own on public.tt_community_tours;
create policy community_tours_insert_own
  on public.tt_community_tours for insert
  with check (owner_id = auth.uid());
drop policy if exists community_tours_update_own on public.tt_community_tours;
create policy community_tours_update_own
  on public.tt_community_tours for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists community_tours_delete_own on public.tt_community_tours;
create policy community_tours_delete_own
  on public.tt_community_tours for delete
  using (owner_id = auth.uid());

create table if not exists public.tt_community_reviews (
  tour_id uuid not null references public.tt_community_tours(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tour_id, reviewer_id)
);
alter table public.tt_community_reviews enable row level security;
alter table public.tt_community_reviews force row level security;
drop policy if exists community_reviews_read_public_or_own on public.tt_community_reviews;
create policy community_reviews_read_public_or_own on public.tt_community_reviews for select
  using (reviewer_id = auth.uid() or exists (
    select 1 from public.tt_community_tours t where t.id = tour_id and t.visibility = 'public'
  ));
drop policy if exists community_reviews_write_own on public.tt_community_reviews;
create policy community_reviews_write_own on public.tt_community_reviews for all
  using (reviewer_id = auth.uid()) with check (reviewer_id = auth.uid());

create table if not exists public.tt_community_favorites (
  tour_id uuid not null references public.tt_community_tours(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tour_id, user_id)
);
alter table public.tt_community_favorites enable row level security;
alter table public.tt_community_favorites force row level security;
drop policy if exists community_favorites_own on public.tt_community_favorites;
create policy community_favorites_own on public.tt_community_favorites for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists public.tt_community_reports (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tt_community_tours(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(trim(reason)) between 1 and 80),
  details text,
  created_at timestamptz not null default now()
);
alter table public.tt_community_reports enable row level security;
alter table public.tt_community_reports force row level security;
drop policy if exists community_reports_own on public.tt_community_reports;
create policy community_reports_own on public.tt_community_reports for select
  using (reporter_id = auth.uid());
drop policy if exists community_reports_insert_own on public.tt_community_reports;
create policy community_reports_insert_own on public.tt_community_reports for insert
  with check (reporter_id = auth.uid());

create or replace function public.tt_community_tour_upsert(p_tour jsonb)
returns public.tt_community_tours
language plpgsql security definer set search_path = public
as $$
declare r public.tt_community_tours;
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode = '42501'; end if;
  if p_tour is null or jsonb_typeof(p_tour) <> 'object' then raise exception 'invalid_community_tour'; end if;
  insert into public.tt_community_tours (
    id, owner_id, title, visibility, distance_km, duration_minutes,
    elevation_gain_m, difficulty, tour_date, track, gpx_public, source, provenance
  ) values (
    coalesce(nullif(p_tour->>'id','')::uuid, gen_random_uuid()),
    auth.uid(),
    trim(p_tour->>'title'),
    case when p_tour->>'visibility' = 'public' then 'public' else 'private' end,
    nullif(p_tour->>'distance_km','')::numeric,
    nullif(p_tour->>'duration_minutes','')::integer,
    nullif(p_tour->>'elevation_gain_m','')::integer,
    nullif(trim(p_tour->>'difficulty'),''),
    nullif(p_tour->>'tour_date','')::date,
    coalesce(p_tour->'track','[]'::jsonb),
    coalesce((p_tour->>'gpx_public')::boolean,false),
    coalesce(nullif(p_tour->>'source',''),'user_gps'),
    coalesce(p_tour->'provenance','{}'::jsonb)
  )
  on conflict (id) do update set
    title=excluded.title, visibility=excluded.visibility, distance_km=excluded.distance_km,
    duration_minutes=excluded.duration_minutes, elevation_gain_m=excluded.elevation_gain_m,
    difficulty=excluded.difficulty, tour_date=excluded.tour_date, track=excluded.track,
    gpx_public=excluded.gpx_public, source=excluded.source, provenance=excluded.provenance,
    updated_at=now()
  where tt_community_tours.owner_id = auth.uid()
  returning * into r;
  if r.id is null then raise exception 'community_tour_not_owned' using errcode = '42501'; end if;
  return r;
end;
$$;

create or replace function public.tt_community_tour_set_visibility(
  p_tour_id uuid, p_visibility text, p_gpx_public boolean default false
) returns public.tt_community_tours
language plpgsql security definer set search_path = public
as $$
declare r public.tt_community_tours;
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode = '42501'; end if;
  update public.tt_community_tours set
    visibility = case when p_visibility = 'public' then 'public' else 'private' end,
    gpx_public = coalesce(p_gpx_public,false), updated_at = now()
  where id=p_tour_id and owner_id=auth.uid() returning * into r;
  if r.id is null then raise exception 'community_tour_not_owned' using errcode = '42501'; end if;
  return r;
end;
$$;

create or replace function public.tt_community_tours_list()
returns table (
  id uuid, owner_id uuid, title text, visibility text, distance_km numeric,
  duration_minutes integer, elevation_gain_m integer, difficulty text, tour_date date,
  track jsonb, gpx_public boolean, source text, provenance jsonb,
  author_display_name text, author_avatar_url text, created_at timestamptz, updated_at timestamptz
)
language sql security definer set search_path = public
as $$
  select t.id, t.owner_id, t.title, t.visibility, t.distance_km, t.duration_minutes,
    t.elevation_gain_m, t.difficulty, t.tour_date,
    case when t.gpx_public or t.owner_id = auth.uid() then t.track else '[]'::jsonb end,
    case when t.gpx_public or t.owner_id = auth.uid() then t.gpx_public else false end,
    t.source, t.provenance,
    coalesce(p.display_name,'Túratárs'), p.avatar_url, t.created_at, t.updated_at
  from public.tt_community_tours t
  left join public.tt_profiles p on p.user_id=t.owner_id
  where t.visibility='public' or t.owner_id=auth.uid()
  order by t.updated_at desc;
$$;

create or replace function public.tt_community_review_upsert(p_tour_id uuid, p_rating integer, p_note text default null)
returns public.tt_community_reviews
language plpgsql security definer set search_path = public
as $$
declare r public.tt_community_reviews;
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode='42501'; end if;
  if not exists(select 1 from public.tt_community_tours t where t.id=p_tour_id and (t.visibility='public' or t.owner_id=auth.uid())) then
    raise exception 'community_tour_not_visible' using errcode='42501';
  end if;
  insert into public.tt_community_reviews(tour_id,reviewer_id,rating,note)
  values(p_tour_id,auth.uid(),greatest(1,least(5,p_rating)),nullif(trim(p_note),''))
  on conflict(tour_id,reviewer_id) do update set rating=excluded.rating,note=excluded.note,updated_at=now()
  returning * into r;
  return r;
end;
$$;

create or replace function public.tt_community_favorite_toggle(p_tour_id uuid)
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode='42501'; end if;
  if exists(select 1 from public.tt_community_favorites where tour_id=p_tour_id and user_id=auth.uid()) then
    delete from public.tt_community_favorites where tour_id=p_tour_id and user_id=auth.uid(); return false;
  end if;
  if not exists(select 1 from public.tt_community_tours t where t.id=p_tour_id and (t.visibility='public' or t.owner_id=auth.uid())) then
    raise exception 'community_tour_not_visible' using errcode='42501';
  end if;
  insert into public.tt_community_favorites(tour_id,user_id) values(p_tour_id,auth.uid()); return true;
end;
$$;

create or replace function public.tt_community_report(p_tour_id uuid, p_reason text, p_details text default null)
returns public.tt_community_reports
language plpgsql security definer set search_path = public
as $$
declare r public.tt_community_reports;
begin
  if auth.uid() is null then raise exception 'unauthorized' using errcode='42501'; end if;
  if not exists(select 1 from public.tt_community_tours t where t.id=p_tour_id and t.visibility='public') then
    raise exception 'community_tour_not_visible' using errcode='42501';
  end if;
  insert into public.tt_community_reports(tour_id,reporter_id,reason,details)
  values(p_tour_id,auth.uid(),trim(p_reason),nullif(trim(p_details),'')) returning * into r;
  return r;
end;
$$;

revoke all on table public.tt_community_tours, public.tt_community_reviews, public.tt_community_favorites, public.tt_community_reports from anon, authenticated;
grant select on public.tt_community_tours, public.tt_community_reviews to anon, authenticated;
grant select, insert, update, delete on public.tt_community_favorites to authenticated;
grant select, insert on public.tt_community_reports to authenticated;
revoke all on function public.tt_community_tour_upsert(jsonb), public.tt_community_tour_set_visibility(uuid,text,boolean), public.tt_community_tours_list(), public.tt_community_review_upsert(uuid,integer,text), public.tt_community_favorite_toggle(uuid), public.tt_community_report(uuid,text,text) from public, anon;
grant execute on function public.tt_community_tour_upsert(jsonb), public.tt_community_tour_set_visibility(uuid,text,boolean), public.tt_community_tours_list(), public.tt_community_review_upsert(uuid,integer,text), public.tt_community_favorite_toggle(uuid), public.tt_community_report(uuid,text,text) to authenticated;
grant execute on function public.tt_community_tours_list() to anon;
