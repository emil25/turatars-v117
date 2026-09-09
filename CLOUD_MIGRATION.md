# CLOUD MIGRATION TERV — Supabase (NEM Implementált, Tervezés)

> **Jelen package-ben nincs Supabase kód, nincs API, nincs hamis szinkron.** A kliens
> `Store.localStorage` marad a runtime state. Ez a terv V54.2-re.

## Elvek (a handover szabályai)
1. **Egyetlen adatmodell**: a táblák a meglévő entitások 1:1 képei — ne vezetd be újra
   (`tours`,`routes`,`journal`,`wishlist`,`equipment`,`inbox`,`tasks`,`events`,
   `organizers`,`participants`,`profiles`,`connections`,`invites`,`notifications`).
2. **Minden sor user-bound**: `owner_uid text not null` (a Store users.id → vagy
   cross-reference a profiles.email-re? maradjon users-id + e-mail oszlop is). Jelen
   kliens kulcs: E-MAIL a community/platform sorokhoz; a users sor uid-je a `u_x`.
3. Kliens: `Store` ír továbbra is localStorage-ba; a sync adapter (V54 már
   felkészítette) hívja az API-t (`API_CONTRACT.md`) — **no parallel frontend state**.
4. Platform-note: QW Pages dynamic app + `--with-database` (PolarDB/Supabase). Nincs
   Supabase Auth → session/tokens a Node API-ba kerül (PBKDF2/argon2 + JWT); az anon
   kulcs SOHA nem kerül a bundlebe; RLS nincs — a szerver szűr owner_uid szerint.
5. Service-role kulcs kizárólag szerveroldalon (Page env var), frontend soha.

## Javasolt séma (idempotens DDL vázlat)
```sql
CREATE TABLE IF NOT EXISTS users (uid text primary key, email text unique not null, name text, pass_hash text, pass_salt text, algo text default 'pbkdf2', created_at timestamptz default now());
CREATE TABLE IF NOT EXISTS data_blobs (uid text primary key, data jsonb not null, version bigint not null default 1, updated_at timestamptz default now());
ALTER TABLE data_blobs ADD COLUMN IF NOT EXISTS per_table boolean default false;
-- vagy normalizált (V54.2 második lépcső):
CREATE TABLE IF NOT EXISTS tours (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS journal (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS routes (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS wishlist (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS equipment (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS inbox (id text, uid text not null, row jsonb not null, primary key(uid,id));
CREATE TABLE IF NOT EXISTS platform_events (id text primary key, owner_uid text not null, owner_email text, row jsonb not null);
CREATE TABLE IF NOT EXISTS organizers (id text primary key, owner_email text not null, row jsonb not null);
CREATE TABLE IF NOT EXISTS event_participants (id text primary key, eid text not null, uid_email text not null, row jsonb not null, unique(eid,uid_email));
CREATE TABLE IF NOT EXISTS profiles (uid_email text primary key, row jsonb not null, is_demo boolean default false);
CREATE TABLE IF NOT EXISTS connections (pair_key text primary key, a_email text, b_email text, row jsonb not null);
CREATE TABLE IF NOT EXISTS invites (id text primary key, owner_email text not null, row jsonb not null);
CREATE TABLE IF NOT EXISTS notifications (id text primary key, to_email text not null, row jsonb not null);
CREATE INDEX IF NOT EXISTS ix_part_eid ON event_participants(eid);
CREATE INDEX IF NOT EXISTS ix_notif_to ON notifications(to_email);
```
- shared projektek (V53 megosztás): a `tours.owner_uid` megmarad; tags access-list:
  `tour_members(tour_id, member_email, role, unique(tour_id,member_email))` — a kliens
  `memberRowOf` logikájával azonos.
- Verzió: `data_blobs.version` (snapshot-onként) — first-writer konfliktus: `If-Match`.

## Migrációs sorrend (V54.2)
1. Node API + users/data_blobs (snapshot blob = a V54.1 `snap` objektum — formátum-változás nélkül!)
2. kliens `RestAdapter` URL beállítás → `window.V54_CLOUD_BASE_URL` (a már létező kód)
3. normalizált per-entity táblák + incremental sync (last-write-wins + per-entity verzió)
4. konfliktus-UI (V54.2 — most TILOS építeni)
A kliensoldali `Store` és a `platform/community` kulcsnevek **változatlanok** — a felhő
csak tükröződés. A `/tmp` fixtures-ek és a `snap.schema="v54.1"` verziókapocs.

## NEM történik most (V54.2 hatásköre)
hitelesítés felhőbe helyezése, conflict resolution, multi-device realtime, service keys,
Push, fizetés — mind V54.1 hatáskörén kívül, és most NE építsd.
