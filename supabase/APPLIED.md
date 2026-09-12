# V118 Supabase deployment record

# V122 application release

- Public catalog policy: only source-backed `verified` records are rendered.
- Legacy unverified catalog data remains private compatibility data and is not seeded into the public UI.
- Source review route: `#/forrasok` (authenticated, validation only; no automatic publication).

- Applied: 2026-09-09
- Supabase project ref: `reezefgcbdrcnuhcktma`
- Supabase project URL: `https://reezefgcbdrcnuhcktma.supabase.co`
- Auth: Email + Password, e-mail confirmation required
- Applied migrations:
  1. `202609080001_snapshot_storage.sql`
  2. `202609080002_snapshot_rpc.sql`
  3. `202609080003_profiles.sql`
  4. `202609120004_community_tours.sql` (V126)
- Client access: publishable key + authenticated user JWT only
- Frontend service-role key: none

The three `tt_cloud_*` tables have RLS enabled and forced. Authenticated users
can select only rows whose `user_id` equals `auth.uid()`. Direct client writes
are not granted. Snapshot writes use `tt_v54_save(snapshot, expectedVersion)`;
loads use `tt_v54_load()`.

The profile migration creates `public.tt_profiles` with RLS and the
`public.tt_profile_upsert(jsonb)` security-definer RPC. Profile reads are
limited to the owner or profiles explicitly marked discoverable.

The V126 community migration creates separate user-owned tour, review,
favorite and report tables. All four tables have RLS enabled and forced.
Public reads are limited to tours explicitly marked `visibility = 'public'`;
private rows remain owner-only. Community writes go through the authenticated
security-definer RPCs (`tt_community_tour_upsert`, visibility, review,
favorite and report operations). GPX track data is returned to other users
only when the owner sets `gpx_public = true`.

The legacy V54 local vault remains active when the public Supabase configuration
is missing or the user chooses the offline fallback before linking a cloud account.

## V127 routing proxy

The V127 planner calls the `route-proxy` Edge Function for real point-to-point
walking routes. The function forwards validated requests to HeiGIT
OpenRouteService v2 and Pelias, while the provider key remains server-side.
Before deploying the function, add an Edge Function secret named `ORS_API_KEY`
in this Supabase project. The key is never placed in the frontend bundle,
GitHub Pages artifact, or public environment variables. Without that secret the
planner deliberately shows a configuration error and does not draw a fake line.
