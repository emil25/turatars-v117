# LOCAL V117.1 → SUPABASE

Állapot: előkészítési terv, semmilyen adatbázis-migráció vagy éles bekötés nem történt.
Kapcsolódó specifikáció: SUPABASE_INTEGRATION_PLAN.md, supabase/RLS_POLICY_PLAN.md.
Referencia: a működő V117.1; nem V117-re történő visszaállítás.

## 0. Jelen kör — készülő előkészítés

- Két számozott SQL fájl, default-deny RLS és szűk snapshot RPC.
- Inaktív, külön modul; nincs import a main.tsx-ben vagy rebundle listában.
- .env.example-ban csak üres publikus értékek és false aktiváló flag.
- Nincs létrehozás, db push, migration up, titokbeállítás, SDK-telepítés vagy deploy.
- A build kimenetének JS/CSS hash-e változatlan kell legyen.

## 1. Izolált cloud próbakörnyezet — későbbi feladat

Codex hozza létre/konfigurálja az engedélyezett Supabase projektet, ha ehhez megvan
a szükséges fiókhozzáférés. A felhasználónak nem kell SQL-t vagy parancsot írnia.
Ha fiókbelépés kell, csak az adott bejelentkezési lépésnél kérünk közreműködést.
E-mail Auth/confirmation/SMTP/redirect allowlist, majd a 001 és 002 migration teszt-DB-n.
RLS/RPC tesztek a policy terv szerint; hibánál nincs éles aktiválás.
A SQL fájlokat migrációs előzmény kezeli, nem ad-hoc többszöri kézi futtatás.

## 2. Kliens és account híd — későbbi feladat

Hivatalos supabase-js dependency telepítése külön integrációs változásként.
prepareCloudAdapter csak explicit import és engedélyezett publikus konfiguráció után.
A local-vault és cloud-http út változatlan fallback/opció marad.
A meglévő V54 account orchestration kapja meg a pending confirmation, refresh,
provider-session elkülönítés és expectedVersion kezelését. A jelenlegi V54 token
nem használható automatikusan Supabase tokenként. Új session storage esetén új,
dokumentált kulcs kell; a meglévő öt V54/Store kulcs egyikét sem nevezzük át.

Auth callbacknek nem szabad a #/... SPA route-ot felülírnia. A híd nem jelent új UI
tervezést, de a megerősítésre váró fiókot nem kezelheti bejelentkezettként.
Első login második eszközön mindig LOAD, és csak utána lehet SAVE;
üres helyi adatbázis nem írhatja felül a meglévő cloud mentést.

## 3. Első saját adatok feltöltése

1. Kiválasztott helyi profil és megerősített Auth-fiók összerendelése, e-mail egyezéssel.
2. Helyi exportData backup (helyben marad), Store.save sikerének ellenőrzése.
3. buildSnapshot eredeti struktúrával; teljes Store-export soha nem megy hálózatra.
4. Teljes szemantikai preflight: tömbök/rekordok/ID-k, referenciák, raw/fingerprint,
   userhatár, ismeretlen érzékeny mezők, DEMO flag, forráslinkek, JSON méret.
5. GET tt_v54_load. Empty → expectedVersion=0; létező snapshot → teljes összehasonlítás.
6. Meglévő cloud eltérésekor megállás és felhasználói döntés. Nincs csendes overwrite.
7. SAVE az ismert verzióval. Siker után GET-visszaolvasás, szemantikai JSON-egyezőség
   (objektumkulcssorrend/mentési ts nem üzleti adat), nem csak rekorddarabszám.
8. Csak igazolt roundtrip után mentett állapot. Semmit nem törlünk a local vaultból.

## 4. Visszatöltés másik eszközre

Auth → whoami → load → schema/identitás/szemantikai ellenőrzés → helyi ID-ütközésvizsgálat.
Az azonos localUserId más helyi fiókban: STOP, nem automatikus átnevezés.
A távoli snapshot nem írhatja át más helyi user platform/community rekordjait pusztán
ID-egyezés alapján; a hídnak külön tulajdonosi preflightot kell végeznie.
A validált envelope a meglévő restoreApply-nak adható; az végzi a kötelező preSave-et
és a tranzakciós Store.importData commitot. Ne hívjunk elé külön, redundáns preSave-et.
Restore után memória/storage, reportAck/challenges és ismeretlen mezők ellenőrzése.
Kétszeri restore teljes DB-egyezőséggel, nem csak darabszámmal bizonyítandó.

## 5. Offline és konfliktusok

Offline a Store/local vault helyben működik. Nincs automatikus kétirányú sync vagy
offline sor ebben az előkészítésben. Sikertelen cloud mentés nem változtat helyi adatot.
Újracsatlakozáskor új sessionellenőrzés és load, majd verziófeltételes kézi save.
Verziókonfliktus megállítja a műveletet; nincs automatikus LWW/merge.
A restoreApply upsert megőrzi a csak helyben lévő sorokat: ez nem törlésszinkron.
Cloud oldali hiányzó rekordból nem következtetünk automatikusan helyi törlésre.

## 6. Rollback — adat- és üzemmód-visszaállítás

| Hiba/fázis | Visszaállítás |
|---|---|
| SQL teszt-migráció hibás | Tranzakció rollback; éles DB-t nem érintettük |
| Cloud Auth/network/save hiba | Helyi DB/vault érintetlen, nincs sikert jelző állapot |
| preSave quota/readback hiba | Restore tilos, eredeti Store és storage marad |
| Restore commit hiba | V117.1 importData nem publikál új memóriát sikertelen storage-írás után |
| Sikeres restore visszavonása | Meglévő V54 rollback: pre1.db → importData → memória+storage együtt |
| Új cloud funkció letiltása | Explicit provider vissza local módra, publikus flag false, V117.1 app kód változatlan |
| Cloud tartalom visszaállítása | Kiválasztott saját revision új mentési verzióként, friss expectedVersion-nel; nincs DB DROP/reset |

A rollback utáni régi helyi állapot nem tölthető automatikusan a cloudra. Az új
mentési szándék külön verzióellenőrzést igényel. Auth/táblák törlése nem rollback.
Minden meglévő localStorage-kulcs és legacy ID megmarad. A régi és új origin
böngészőtára nem közös: originváltáskor export/import vagy később hiteles cloud restore kell.

## 7. Éles aktiválási kapu

Csak külön engedélyezett következő körben: tesztelt migrations + RLS + Auth + account
híd + restore preflight + két eszköz roundtrip + hibainjektálás után konfigurálható az élő
backend. A service-role key frontendben akkor sem lehet. A jelenlegi Sites preview
nem változik, új publikálás ennek az előkészítésnek nem része.
