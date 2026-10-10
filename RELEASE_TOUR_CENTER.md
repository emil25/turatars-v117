# V130 – személyes túraközpont ellenőrzése

Kiindulás: `1f6de87`. Ellenőrzés: 2026-10-10.

## Változás

- Az áttekintés a saját folyamatban lévő túrát, következő tervet vagy naplózásra váró befejezett túrát emeli ki.
- A teendők a meglévő felkészültségi ellenőrzésből származnak. A terv, felszerelés, résztvevők, útvonal és napló közvetlenül megnyitható.
- A felhőjelzés az utolsó sikeresen mentett snapshot tartalmának SHA-256 lenyomatát és az Auth UID-t ellenőrzi. Új módosítás után mentésre váró állapot jelenik meg. Offline, helyi trezor és sikertelen mentés nem jelenthet felhős sikert.
- A mentés továbbra is a meglévő adaptert és expectedVersion értéket használja. A helyi adatok, restore, rollback és GPX algoritmus változatlanok.
- A GitHub Pages workflow publikálás előtt hét böngészős tesztcsomagot is futtat. Hiányzó böngésző vagy hibás teszt esetén nincs deploy.

## Sikeres helyi ellenőrzések

- Typecheck és production build.
- `npm test`: 42/42, kihagyott teszt nélkül. Az öt korábbi Supabase-adapterteszt a meglévő audit/handover másolatból visszakerült a kiadási tesztcsomagba, változatlan tesztlogikával.
- `npm run test:browser`: 7/7 csomag – főoldal, navigáció, katalógus, design, események, túraközpont, V130 GPS.
- 390×844: nincs vízszintes overflow; az új vezérlők legalább 44 px magasak.
- Az áttekintés felső widgetje 1280 és 1440 px szélességnél az indulási ellenőrzőlistával együtt is legfeljebb 560 px magas.
- A fenti böngészős tesztekben pageerror = 0 és alkalmazás-console.error = 0.
- A 13 katalógustúra, 3 helyszín, 9 tárolt esemény és 37 forrásolt GPX/KML útvonal változatlan. A lejárt események szűrése továbbra is megmarad.

A felhőjelzés hibatesztjei elkülönített böngészőben, kizárólag tesztadapter-válaszokkal futnak. Nem írnak az éles Supabase-be, és nem helyettesítik az élő backend RLS vagy két eszköz tesztjét. Auth konfiguráció, SQL és migration nem változott.

## Korábbi tesztek korlátai

A `TEST_MATRIX.md` V117-kori zöld eredményei nem a mai V130 állapotot írják le. A régi tesztek jelenlegi hibáit a korábbi állapottal kell összevetni; ezeket nem tekintjük PASS eredménynek. A teljes összehasonlítás helyi naplói: `home-check/tour-center/legacy/` a munkaterület gyökerében.

Az új, túl magas dashboard-kártyát jelző V46 eltérést javítottuk; a régi V46 teszt ismét 32/35 eredményt ad, pageerror = 0 és alkalmazás-konzolhiba = 0. A megmaradt három állítás már a korábbi állapotban is hibás volt.

A V47 láncteszt egy köztes újrabuildeléskor modulbetöltési hibát kapott; stabil builden megismételve 23/26, pageerror = 0, alkalmazás-konzolhiba = 0, a korábbi három hibával. A V50 első párhuzamos futása `networkidle` várakozásnál időtúllépést kapott; külön újrafuttatva 43/44, pageerror = 0, alkalmazás-konzolhiba = 0, a korábbi egy hibával. A sikertelen próbák naplói is megmaradtak.

## Külön javítandó, meglévő technikai problémák

- A régi tesztcsomagok egy része megszűnt DOM-azonosítókat, régi DEMO rekordokat, rögzített dátumokat és kizárólag helyi trezort feltételez. Ezeket az aktuális működéshez kell igazítani, az adatbiztonsági állításokat megtartva.
- A V51 régi teljes kontroll-crawl korábban is eléri a tízperces időkorlátot. A jelenlegi release gate külön ellenőrzi a nyilvános és bejelentkezett route-okat, de ez nem teszi zölddé a régi crawl tesztet.
- A production JS csomag továbbra is körülbelül 1,14 MB; a Vite méretfigyelmeztetése megmaradt. Később külön csomagméret-optimalizálás szükséges.
- Az npm audit két meglévő, közvetett fejlesztői/build függőségben jelez magas súlyosságú problémát (`nanoid`, `source-map-js`). Ezeket külön függőségfrissítéssel és regresszióval kell kezelni. Ez a módosítás nem frissítette őket; a Playwright hozzáadása nem ezeket hozta be.

Éles publikálás eredményét a commit GitHub Actions futása és az utána elvégzett live böngészős ellenőrzés igazolja.

Az első GitHub-futás (`38052527911`) helyesen blokkolta a deployt: a főoldalteszt az URL-váltás után, a regisztrációs űrlap kirajzolása előtt kérdezte le az elemek számát. A böngészős teszt most megvárja az űrlapot és a keresési eredményeket; az eredeti tartalmi állítások megmaradtak. Ez kizárólag tesztidőzítési javítás, alkalmazáskód-változás nélkül.

A második GitHub-futás (`38052927317`) a katalógusteszt hasonló időzítési hibáját találta: a mentés utáni URL-váltás már megtörtént, de a túraoldal GPS-gombja még nem jelent meg az ellenőrzés pillanatában. A teszt most a ténylegesen látható túraoldalt várja meg; a rekord-, GPS-, megőrzési és mobilállítások változatlanok.

Egy későbbi helyi teljes újrafuttatásban a főoldalteszt minden állítást teljesített és PASS eredményt írt ki, de a böngésző lezárásával együtt átlépte a háromperces csomag-időkorlátot. A teljes futást ezért FAIL-ként kezeljük; az időkorlátot és az ellenőrzéseket nem lazítottuk.
