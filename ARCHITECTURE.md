# ARCHITECTURE — Túratárs (V117)

## Egységes futásréteg (nincs backend a kliens mögött)

```
┌─────────────────────────────────────────────────────────────┐
│  UI réteg (böngésző)                                        │
│  app.js: hash-router + render() + afterFn táblázat          │
│  VIEWS.{home|discover|dash|tours|workspace|calendar|…}      │
│  – minden V-modul egy (function(){})() IIFE-ben:            │
│    VIEWS.x = wrapper-láncot épít (eredetit megőrizve, `_orig`│
│    + `.after` hook-lánc; SOS ne tiltsd le a wrapper sort!)  │
│  komponensek: openModal/toast/confirmDlg (ui.js), chip/kártya│
└───────────────▲─────────────────────────────────────────────┘
                │ hívások, after-hookok
┌───────────────┴─────────────────────────────────────────────┐
│  Store (store.js closure: window.Store)                     │
│  localStorage["turavaros_v1"] → db                          │
│  ├─ db.users[u_id]        (auth: sózatlan djb2 pass! ld. V54)│
│  ├─ db.data[u_id] = userData (tours,journal,routes,wishlist,│
│  │    equipment,inbox,teams,templates,terepi,goals,widgets, │
│  │    savedEvents,notifDismiss,aiChat,bio…)  ← V41,V42,V46…│
│  ├─ db.session: u_id | null                                 │
│  ├─ db.platform = {organizers[],events[],participants[],seeded}│
│  ├─ db.community = {profiles[],connections[],invites[],notifs[],demoSeeded}│
│  └─ ensureExtras()/ensureTourFields() migrációk minden betöltéskor│
│      (project.js wrapper: myData() null-safe!)              │
└───────────────▲─────────────────────────────────────────────┘
                │ uid-kötött snapshot (schema "v54.1")
┌───────────────┴─────────────────────────────────────────────┐
│  V54.1 fiókréteg (app/js/v54.js)                            │
│  ├─ Adapter-interfész: signup/login/save/load/logout/whoami │
│  ├─ LOCAL VAULT (aktív): "turatars_v54_vault_v1"            │
│  │    accounts{email→PBKDF2(SHA-256,120k,salt) hash,uid},    │
│  │    snaps{uid→{at,size,snap}}, tokens{tk→email}           │
│  ├─ REST adapter (KÉSZ, inaktív): window.V54_CLOUD_BASE_URL  │
│  │    beállítása esetén él: /api/signup login vault logout whoami│
│  │    — a UI/adapter-váltás NEM változtat (CURRENT helyett)  │
│  ├─ Pre-restore mentés: "turatars_v54_pre1" {ts,db}          │
│  └─ Device-state: "turatars_v54_state" {token,uid,email}      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ FUTURE (NINCS implementálva — ld. CLOUD_MIGRATION.md):       │
│   Supabase (PolarDB) + Node API szerver: profiles/tours/…    │
│   A kliens Store marad a runtime state; az API a perzisz­     │
│   tencia. Jelen package-ben SENKI ne implementálja V54.2-vel.│
└──────────────────────────────────────────────────────────────┘
```

## Jelentős adaptációk
- **Bundle-build:** a 19 `app/js/*.js` fájlt a `tools/rebundle.mjs` (vagy manuálisan:
  megadott SORBAN, `window.Store=Store;…` futósort) összefűzi a `build/src/app-bundle.js`-be;
  a Vite (`build/`, main.tsx) `?raw` + `eval(src)`-el globálisként futtatja — ez adja a
  klasszikus `<script>`-szemantikát (a modul-scopos globálok megőrzése, after-láncok).
- **Routing:** hash-alapú; a `DASHY` lapok a `dash()` keretben futanak (sidebar + bottom-nav);
  a `ROUTES` kulcsai és a VIEWS kulcsai megegyeznek — új lap = ROUTES + VIEWS + afterFn.
- **ID-rendszer:** lásd 7. pont CODEX_HANDOVER; minden rekord uid-szűrt; e-mail-kulcs.
- **Module wrap lánc:** (v49→v50→v52→v53→v54) minden VIEWS-díj `_orig` referenciával, egy soha
  ne tölts ki korábbi díjat. A `Store.myData` wrapper szintén lánc.
- **Offline:** PWA shell (sw.js network-first cache, manifest) + minden funkció lokális; a V54
  offline-sáv a `online/offline` eventekre reagál (nem befolyásolja az üzletmenetet).
- **Külső CDN-k:** Leaflet (térképek), Open-Meteo (idotállás V44/V41), Unsplash (képek), Google
  Fonts — ezek ELÉRHETŐSÉGE offline nem kötelező, a terepi view hiba-üzenettel élt túl.

## Terjesztés / state
- Publikus statikus Page; build-kimenet: dist/, minden publikált verzió Vn-re számozódik
  (jelenleg V117 = éles baseline). Repo: `/mnt/pages/page-repo-…` a csomagban `build/`.
