# Supabase bekötési terv — V117.1 frozen baseline

Állapot: ELŐKÉSZÍTÉS, 2026-09-08. Nincs létrehozott vagy bekötött Supabase projekt.
A két SQL-migráció nem futott le. Az új kliensmodul nincs importálva vagy bundle-ölve.
A működő alkalmazás és a publikus deployment változatlan.

## Megvizsgált rendszer és megőrzendő határok

Források: app/js/store.js, app/js/v54.js, ARCHITECTURE.md, DATA_MODEL.md,
STORAGE_KEYS.md, CLOUD_MIGRATION.md, API_CONTRACT.md, MIGRATION_SAFETY.md,
valamint a V117.1 stabilizálás jelentése a projekt melletti könyvtárban.

Store closure: db.users, db.data, db.session, db.platform, db.community.
Store.save szinkron módon a turavaros_v1-be ír; exportData a TELJES helyi DB-t adja.
importData előbb a tartós storage-ot írja, csak siker után cseréli a memóriát.
Az exportData ezért helyi backuphoz használható, cloud feltöltéshez közvetlenül nem:
más helyi fiókokat és djb2 jelszóhash-eket is tartalmazhat.

A V54 buildSnapshot felhasználó szerint szűr, schema=v54.1, localUserId és eredeti
rekord-ID-k változatlanok. Jelenleg localStorage-ból olvas: a memóriát előbb sikeresen
menteni kell. A snapshot.uid jelenleg uid_map:<email>, NEM Supabase UUID.
A Supabase auth.users.id csak a külső tulajdonosi oszlopba kerül.

A local vault PBKDF2 hash-t és helyi tokeneket tárol; a snapshot maga nem titkosított.
A helyi Store-jelszó, vault-jelszó és Supabase-jelszó külön hitelesítési tartomány.
A régi hash-ekből és tk_ tokenekből nem készül cloud belépés.

## Pontos adatleképezés: egyetlen üzleti modell

Az első bekötés snapshot-alapú, nem per-entity újraírás. A felhőben a
tt_cloud_snapshots.snapshot JSONB tartalmazza a meglévő snapshotot, a böngészőben
továbbra is a Store az alkalmazás runtime állapota. Nem lesz külön írható tours,
projects, routes, tasks vagy calendar adatforrás ugyanazon adatok mellé.

| Terület | Helyi forrás | Supabase-be kerülhet | Lokális marad / korlát |
|---|---|---|---|
| Auth/users/profile | db.users[u_id] | snapshot.user: id, email, name, city, onboarded, joined, bio; Auth az auth.users-ben | pass/hash és más felhasználók users sorai soha |
| Túra/project | data[u_id].tours | snapshot.data.tours teljes eredeti rekordokkal | számított readiness/stats továbbra is kliensoldali |
| Routes/GPX | data.routes | raw, track, wpts, fp/__fp, id és meta változatlanul | parser/export algoritmus nem változik; nincs Storage-kiszervezés |
| Journal | data.journal | snapshot.data.journal | tourId dedup változatlan |
| Wishlist | data.wishlist | snapshot.data.wishlist | ref/extRef változatlan |
| Equipment | data.equipment | snapshot.data.equipment | túrán belüli gear is a túrában marad |
| Tasks | tours[].tasks | beágyazva a meglévő túrában | nincs új task tábla |
| Calendar/events | tours[].date, savedEvents, platform.events | a forrásadatok és savedEvents hivatkozások | nincs calendar entitás/tábla |
| Egyéb userData | inbox, teams, templates, terepi, goals, goalList, widgets, prefs, aiChat, reports, reportAck, challenges | a meglévő teljes saját data szelet, ismeretlen mezőket is megőrizve | nem önkényes mezőlista; ismeretlen érzékeny mezőnél migrációs ellenőrzés szükséges |
| Platform | db.platform.organizers/events/participants | a buildSnapshot által kijelölt saját/releváns sorok privát mentése | teljes globális platform nem; mentés nem publikálás |
| Community | db.community.profiles/connections/invites/notifs | saját profil, saját kapcsolatok/meghívások/címzett értesítések a meglévő szűrés szerint | más tulajdonában lévő teljes projekt nincs a snapshotban |
| Notifications | community.notifs, notifDismiss, reportAck | meglévő snapshotmezőkben | számított értesítéseket nem materializáljuk új rendszerbe |
| V54 vault | turatars_v54_vault_v1 | csak a kiválasztott, validált v54.1 snapshot tartalma | accounts/salt/hash/tokens és a vault teljes egésze nem |
| Eszközállapot | db.session, theme, V54 state/settings/pre1, SW cache | nem | mind lokális; másik eszköz saját sessiont hoz létre |

DEMO flag/chip, importált események src linkje és minden ID/fingerprint változatlan.
DEMO sor privát mentése nem hoz létre valódi cloud szervezőt vagy közösségi profilt.
A felső snapshot.routes a data.routes másolata: eltérés esetén elutasítás, nem választunk
csendben egyiket. A byte-limit a szerveren JSONB szöveges UTF-8 méret, 4 400 000 bájt.
Ez konzervatívabb lehet a kliens tömör JSON-méreténél; nem azonos a régi JS string.length-gel.

## A most elkészített séma

1. auth.users: Supabase által kezelt, saját users/pass_hash tábla nélkül.
2. tt_cloud_accounts: user_id UUID, legacy_email, created_at; kizárólag identitáskötés.
3. tt_cloud_snapshots: egy aktuális v54.1 snapshot/UUID, verzió és méret.
4. tt_cloud_snapshot_revisions: változatlan verziótörténet, (user_id,version) kulcs.

Az eredeti u_ ID snapshot.localUserId és user.id marad. A cloud legacy_email kötését
nem írhatja a kliens. E-mail-változáskor a jelenlegi RPC identity_relink_required hibával
megáll; legacy community-kulcsok automatikus átírása nincs. A korábbi e-mail új
tulajdonosa nem kapja meg a korábbi cloud tulajdonos mentését.

## Community több felhasználó között — külön későbbi lépés

A privát snapshot RLS-e nem hitelesíti a benne lévő résztvevői jogokat. Feltöltés
nem adhat tagságot, nem küldhet meghívót/értesítést más felhasználónak. A működő
helyi community ettől változatlan marad; valódi cross-user működést nem állítunk.

Későbbi szerveroldali tükrözéshez a meglévő organizers, platform_events,
event_participants, community_profiles, connections, invites, notifications sorok
és projekt-hozzáférések kellenek. Ezekhez ebben a körben nincs második írható DDL.
Minden entitásra előbb egyetlen szerveroldali forrást kell kijelölni; a snapshot
akkor annak szűrt mentése lesz, nem versengő második író. A tagsági ACL technikai
jogosultságindex a meglévő participants alapján, nem új tour/task adatmodell.
Tervezett műveleti RLS-szabályok: supabase/RLS_POLICY_PLAN.md.

## Auth és inaktív kliensmodul

cloud-preparation/supabase-adapter.mjs: konfigurációellenőrző és adapter factory.
Az SDK createClient függvénye később kerül be dependency injectionnel; jelenleg
nincs új npm dependency, CDN, import, globális regisztráció vagy storage-kulcs.

- Nincs VITE_TT_SUPABASE_ENABLED=true: a factory pontosan a kapott localAdaptert adja vissza.
- Enabled + érvényes HTTPS URL + sb_publishable_ kulcs + SDK: külön adapter készíthető.
- Hibás enabled konfiguráció megáll; nem ír át Store-t és nem esik vissza csendben
  sikeres cloudnak nevezett local mentésre.
- A modul önmagában NEM kapcsolja át a V117.1 UI-t. Az import és a provider-választó
  bekötése szándékosan későbbi aktiválási feladat.
- Az adapterben signup/login/whoami/save/load/logout és explicit refresh van.
  A session csak memóriában él; nincs automatikus háttérfrissítés vagy URL-tokenfeldolgozás.
  Reload után új cloud login kell. Tartós session/callback bekötése későbbi kapu.
- Signup megerősítésre várva pending=true/token=null értéket ad. A jelenlegi V54
  finishIntent elé ennek kezelése kell; pending állapotban mentés tilos.
- save megköveteli a GET-ből ismert expectedVersion értéket. Verzióütközésnél
  nincs automatikus merge vagy felülírás. Azonos tartalom ismétlése no-op.
- Az adapter kizárólag a hálózati műveletet végzi, Store/restore/local vault műveletet nem.

Auth konfiguráció később: email+jelszó, kötelező email confirmation, pontos HTTPS
callback allowlist, éles SMTP, reset és lejárt session kezelés, két elkülönített user
és két eszköz tesztje. A sessionfrissítés eredménye után a hívó tokenjét is frissíteni kell.
Lejárt tokennel nem indulhat restore. Offline továbbra is a helyi Store használható.

## Régi REST adapter és dokumentációs ellentmondások

A v54.js RestAdapter (cloud-http) érintetlen. A jövőben három explicit provider:
local-vault, meglévő cloud-http, supabase-snapshot; egy mentési művelet csak egyet használ.
A két cloud konfiguráció együttes használata hibás. A REST base URL-t nem állítjuk be.
A Supabase adapter a V54 metódusneveit/envelope-ját követi, de pending Auth és
expectedVersion miatt nem cserélhető be biztonságosan változatlan account orchestration alá.
Alternatív későbbi REST bridge ugyanazokat a Supabase RPC-ket használhatja; ilyen bridge
most nem készült. A legacy /api/... URL-ek nem natív Supabase végpontok.

| Régi állítás | Előkészítésben választott, dokumentált irány |
|---|---|
| CLOUD_MIGRATION: nincs Supabase Auth/RLS, saját hash/JWT | A jelenlegi felhasználói kérés alapján Supabase Auth + kötelező RLS; régi saját users DDL nem kerül átvételre |
| owner_uid text vagy local ID/e-mail | Külső user_id UUID; belső ID/e-mail változatlan |
| API GET /me | Tényleges RestAdapter GET /api/whoami; a régi adaptert nem módosítjuk |
| API 15s timeout | Régi fetch nem valósítja meg; későbbi hálózati bridge feladata |
| Utolsó írás nyer | Optimista verzióellenőrzés, automatikus konfliktuskezelés nélkül |
| Anon kulcs titok | Az új modul csak publishable kulcsot fogad el; secret/service-role tiltott frontendben |
| Snapshot új eszközön minden shared projektet betölt | A saját snapshot ezt nem biztosítja; későbbi jogosultságszűrt projektlekérés kell |
| STORAGE_KEYS: minden restore felülírja pre1-et | V117.1 az azonos ismételt restore-nál megőrzi az eredeti undo pontot |
| Négy storage kulcs | A v54.js a turatars_v54_settings_v1 kulcsot is használja; ezt sem nevezzük át |

## Aktiválás előtti hiányzó kapuk

Nincs SQL-végrehajtási/RLS bizonyíték, Supabase projekt, SDK telepítés, Auth callback,
tartós session, V54 account híd, teljes snapshot szemantikai validáció és távoli
adatból készülő restore-jelölt preflight. Ezek nélkül a kliens nem aktiválható élesben.
Nincs automatikus sync, outbox, konfliktus-UI, törlésszinkron vagy cloud Storage migráció.
A megőrző restoreApply upsert nem tekinti törlésnek a hiányzó rekordot.

Források (hivatalos, ellenőrizve 2026-09-08):
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/functions
- https://supabase.com/docs/reference/javascript/auth
- https://supabase.com/docs/guides/auth/sessions

## Előkészítés ellenőrzési eredménye

2026-09-08: npm run build sikeres; az inaktív .mjs modul node --check ellenőrzése
sikeres. Nincs új teljes regressziós futás. SQL nem futott, RLS nincs élőben tesztelve.
A V117.1 forrásmodulok, UI/CSS, parser, Store, rebundle és függőségek git-diffje üres.
A production JS SHA-256 változatlan:
88aa9fd96f8683426e3144a11c3a51c4f5efac687cafafb7d89927d7afdb08dd.
A production CSS SHA-256 változatlan:
b7b67bc743cd8c4454203a7342d233b477a4f1ffe9864144d12732082a860702.
Új deployment nem történt; az élő V117.1 címe változatlan:
https://turatars-v55-preview.semil2005.chatgpt.site
