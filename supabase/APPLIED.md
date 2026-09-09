# V118 Supabase deployment record

- Applied: 2026-09-09
- Supabase project ref: `reezefgcbdrcnuhcktma`
- Supabase project URL: `https://reezefgcbdrcnuhcktma.supabase.co`
- Auth: Email + Password, e-mail confirmation required
- Applied migrations:
  1. `202609080001_snapshot_storage.sql`
  2. `202609080002_snapshot_rpc.sql`
- Client access: publishable key + authenticated user JWT only
- Frontend service-role key: none

The three `tt_cloud_*` tables have RLS enabled and forced. Authenticated users
can select only rows whose `user_id` equals `auth.uid()`. Direct client writes
are not granted. Snapshot writes use `tt_v54_save(snapshot, expectedVersion)`;
loads use `tt_v54_load()`.

The legacy V54 local vault remains active when the public Supabase configuration
is missing or the user chooses the offline fallback before linking a cloud account.
