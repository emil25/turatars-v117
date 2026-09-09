# MIGRATION SAFETY — adatvesztés-mentes út (V54.1 → V54.2 → Supabase)

## Alapelvek (mindig)
1. **Soha ne törölj forrás-adatot mentés sikere nélkül.** V54.1: a local `turavaros_v1`
   nem változik `doSave`-nél; a pre1 snapshot minden `doLoad` (restore) ELŐTT íródik.
2. **Idempotencia**: minden kulcsonként (uid) csak 1 rekord; a 3× mentés = 1 snap (V54.1 teszt O1); a restore 2× = azonos rekordszám (teszt O2 — a merge ID-alapú).
3. **Guardolt scope**: snapshot csak a saját user recordjait tartalmazza (e-mail/uid szűrés); restore másik usere → `email_mismatch`, helyi adat ép.
4. **Rollback minden pillanatban**: `turatars_v54_pre1` → gomb vagy `window.__V54.api.rollback()` (teszt S2).
5. **Offline / cloud failure**: `too_large`, `storage_full`, network → error toast + status error chip; **local változatlan** (teszt R), a user próbálhatja újra / törölhet régi GPX raw-t.

## Lépéssor V54.2-re (Supabase API-val)
```
0) readiness: V54.1 baseline = V117 minden suite zöld. snapshot schema "v54.1".
1) API env: V54_CLOUD_BASE_URL + SUPABASE_* server-side + users/data_blobs tabla (CLOUD_MIGRATION.md)
2) Kliens: semmi UI-változás — signup/login/save/whoami már a kontrakton
3) Első éles sync (user): "☁️ Mentsük el…" → save → snapshot-ellenőrzés:
   GET me/vault → snap.schema+linkedEmail+size == local → "SZINKRONIZÁLVA"
4) Másik eszköz: login → restore-hatalom van: "Üdv újra" (vagy auto-prompt) →
   doLoad → pre1 mentés → applySnapshot (id-merge, upsertById, union) →
   Store.importData (memory+storage konzisztens, a V117-es javítás) → App.render
5) Összevetés (V54.2 előtt): a local és a remote "counts" (users/tours/routes/…/notifs)
   megegyezzenek; eltérés = stop + manual diff riport
```
## Hibamátrix
| hiba | local sorsa | UI |
|---|---|---|
| bad_password | érintetlen | chip: "A jelszó nem egyezik." |
| storage_full (local) / too_large (cloud) | érintetlen | "…törölj régi…"; DB nem íródott |
| partial API write | nem töröl, nem overwrite (write-after-ok policy) | "A helyi adataid érintetlenek" |
| corrupt snapshot (schema) | elutasít | "…érvénytelen" és local ép |
| browser crash after pre1, before apply | pre1 → rollback gomb | menthető |
## Tiltott
- `execute/UPDATE/DELETE` user-adaton éles DB-n bulk "reset" célra;
- snapshot-ba más user privát adatának írása;
- DEMO jelöletlen adat;
- ID/fingerprint formátum változtatás (CODEX_HANDOVER 7. pont).
## Ellenőrzési kötelek minden migrációs PR-ban
V43…V54 suite-zöld (TEST_MATRIX.md) + új dedicated migration E2E (dup pipeline, offline failure, two-browser restore).
## Snapshot-méret
A local snapshot a teljes user `data`-t tartalmazza (GPX raw-okkal). A 4.4MB limit a
`localSave` guard. Supabase-ön blobs → storage objektumok (qw-pages-storage), metadata a táblában.
