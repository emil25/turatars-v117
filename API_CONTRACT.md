# API CONTRACT (idempotent leírás — a V54.1 RestAdapter már ezt hívja)

> NEM létező API: csak a szerződés. A kliens (v54.js) a `window.V54_CLOUD_BASE_URL`
> beállításakor EZT a felületet expected el. Base path `/api`, válaszok JSON.

## Post /auth/register (→ adapter signup: email, password(≥8), display-name optional)
```
POST /api/signup
{ "email":"a@b.c", "password":"…", "name":"Túrázó" }
200 { "token":"<opaque>", "uid":"uid_…", "email":"a@b.c" }
4xx { "error":"bad_email | weak_password | bad_password" }   // bad_password a
   // V54.1 "meglévő fiókba" signup-azzal a jelszóval = login guard (wrong pass soha nem ad tokent)
```

## POST /api/login — same as signup (ha létezik, azonos cred → token)
`4xx bad_password` | `401`

## POST /api/logout
`Authorization: Bearer <token>` → 200 (a device state törlés a kliensen történik)

## GET /me
`Bearer` → 200 `{ uid, email, name }` | `401 {error:"unauthorized"}` (`whoami`)

## POST /api/vault (save)
```
body: { "snapshot": v54.1 snap obj (v117 build snapshot) }
200 { "ok":true, "size":<bájtok> }  
413 { "error":"too_large" }  // a V54.1 guard 4.4 MB a vault local méret limitnek
```

## GET /api/vault (load)
```
200 snap envelope: { "at": iso, "size": number, "snap": {…} } | { "error":"empty" }
401 …
```

## Verzió / idempotent
- PUT/POST ugyanarra a uid → overwrite a snapshot (nincs duplikált sor: a `snaps[uid]`
  kulcsra írás). Ugyanaz a kliens-uid, ugyanaz a rekord.
- GET /me/version optional future: `{ version:int, updated_at }`
- Konfliktus: felülírás jogát az utolsó írás viszi (V54.2 plan: If-Match).

## Méretek, timeout
- snapshot-JSON limit: 4,4 MB (a 4.6 MB-mérettel tesztel: too_large path)
- timeout: 15s; a kliens hiba esetén: **local adat érintetlen** (ld. MIGRATION_SAFETY)

## Biztonsági szabályok
- token csak HTTPS; a kliens nem tárol semmilyen service key-t; nincs cross-uid
  read: a szerver a token→uid alapján szűr.
- email case-fold (kisbetűs) a joinsban; `email` a users kulcsa a snapshotokban is.
- **NINCS hamis API** — senki ne registráljon demo végpontot a package-ben!
