# RLS policy és SQL felülvizsgálati terv

Állapot: a migration fájlok megírt, NEM FUTTATOTT előkészítés. Nem éles biztonsági
tanúsítás. A változatlan V117.1 deployment nem fér hozzá ezekhez a táblákhoz.

## Elkészített policy-k

| Tábla | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| tt_cloud_accounts | authenticated, auth.uid() = user_id | kliensnek nincs grant/policy |
| tt_cloud_snapshots | authenticated, auth.uid() = user_id | kliensnek nincs grant/policy |
| tt_cloud_snapshot_revisions | authenticated, auth.uid() = user_id | kliensnek nincs grant/policy |

RLS ENABLE + FORCE mindhárom táblán. anon/PUBLIC táblahozzáférés tiltott.
tt_v54_load SECURITY INVOKER, tehát a táblák RLS-e érvényesül.
tt_v54_save SECURITY DEFINER: szándékos, kizárólagos írási határ, fix üres search_path,
minden név séma szerint minősítve, nincs dinamikus SQL, nincs kliens által megadható UID.
EXECUTE csak authenticated számára, alapértelmezett PUBLIC/anon jog visszavonva.

FONTOS: a migrációt futtató postgres/tulajdonosi szerep megkerülheti az RLS-t,
FORCE RLS mellett is, ha BYPASSRLS jogosultságú. A save RPC ezért saját maga ellenőrzi
auth.uid()-t, auth.users ellenőrzött e-mailjét, a snapshot identitását és minden írást
az actor UUID-ra korlátoz. Ez nem service-role kulcsos böngészős hozzáférés.
Az RPC az RLS mellett külön felülvizsgálandó biztonsági határ, nem automatikusan RLS-védett.
Tulajdonos/GRANT változtatását migrációs review nélkül tilos elvégezni.

Az account-sor FOR UPDATE zárolása sorosítja ugyanazon user párhuzamos mentéseit.
Az aktuális snapshot + új revision egy adatbázis-tranzakcióban íródik. Hibánál rollback.
Azonos tartalom (csak ts-t mellőzve) nem készít új verziót. Eltérő tartalom és elavult
expectedVersion: 40001/version_conflict; nincs last-write-wins.
Auth-user törlés nem törli kaszkáddal a mentéseket: FK ON DELETE RESTRICT.
Automatikus revision-takarítás nincs; retention/export/account-törlés külön tervezendő.

## Későbbi valódi community műveleti terv — nincs most aktiváló DDL

| Meglévő entitás | Olvasás | Írás |
|---|---|---|
| organizer | publikus mezők publikált szervezőnél; privát mezők tulajdonos | hitelesített szervezőtulajdonos; owner UUID nem átírható |
| platform event | publikált publikus vetület; draft/hidden csak tulajdonos | szervezőtulajdonos, ellenőrzött állapotátmenetek |
| participant | saját jelentkezés vagy eseménytulajdonos | saját pending/withdrawn; accepted/declined csak szervező; unique(eid,user_id) |
| community profile | csak kifejezetten publikált opt-in profil publikus mezői | kizárólag saját; email→UUID kötés szerveroldali |
| connection | a két hitelesített fél | létrehozás kezdeményező, elfogadás/elutasítás csak címzett; eredeti pairKey dedup |
| invite | tulajdonos és jogosult címzett; token nem listázható nyilvánosan | tulajdonos hozza létre/vonja vissza; elfogadás tranzakciós, fix tour+recipient kötéssel |
| shared project | tulajdonos és igazolt résztvevő; csak engedélyezett mezők | tagság nem jelent teljes tulajdonosi jogot; meglévő V53 gazda/állapot szabályok |
| notification | kizárólag címzett | létrehozás szerver által igazolt eseményből; címzett csak read állapotot állíthat |

Egy saját privát snapshotban szereplő másik e-mail, owner vagy participant mező
soha nem jogosultsági bizonyíték. A JSONB snapshotra adott SELECT jog a teljes saját
mentést teszi olvashatóvá, ezért más user teljes adatszelete nem kerülhet bele.
Megosztott projektnél a read-vetület nem tartalmazhat más user privát notes/journal/pass
adatait. Nincs kliensoldali közvetlen full-row update egy JSONB közösségi rekordra.

## Kötelező későbbi SQL/Auth tesztek

Ezek MOST NEM futottak: izolált Supabase projekttel/DB-vel, nem mock adattárral kell.

1. Migrations 001→002, privilege/policy/function-owner katalógus ellenőrzése.
2. anon minden tábla és RPC esetén tiltott; null/lejárt JWT nem hitelesítés.
3. A/B két valódi Auth user: B sora nem látható és közvetlenül nem írható A tokenjével.
4. RPC snapshot email/id hamisítás elutasítva; megerősítetlen Auth user elutasítva.
5. Teljes Store/vault export elutasítva; credential mezők elutasítva.
6. Ugyanazon expectedVersion párhuzamos, eltérő mentéseiből pontosan egy sikerül.
7. Azonos retry nincs duplikáció; eltérő retry nem írja felül az újabb verziót.
8. Snapshot/revision atomi; túl nagy/hibás séma/routes-mismatch után nincs részleges adat.
9. E-mail-váltás és régi e-mail újraregisztrálása nem ad hozzáférést a korábbi userhez.
10. Későbbi frontend aktiváláskor V117.1 restore safety, két eszköz, offline és
    account-váltási teszt; pontosan a változtatás által érintett regressziós kapukkal.
