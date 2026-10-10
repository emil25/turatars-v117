# V130 – használati javítások, 2026-10-10

Baseline: `4f88a128d8a83da98d107b72c3b8e916a927b7c6`.

## Elkészült

- A belépési és regisztrációs űrlap egy folyamatban lévő kérés alatt nem küld másodikat. A gomb láthatóan jelzi a folyamatot, hiba után ismét használható. Az Auth adapter, e-mail-megerősítés és helyi fallback változatlan.
- Az Inbox bejelentkezést igényel. A meglévő két eseménykezelő wrapper megmaradt, de a listagomb kattintása egyszer fut le. Szerkesztés és törlési megerősítés sem nyílik meg kétszer.
- A közös felugró ablak címkézett párbeszédablak: a fókusz belül marad, Escape bezárja, majd visszakerül a megnyitó elemre.
- A beállítások helyi törlése a meglévő Store-on keresztül fut. A tartós mentés megelőzi a memóriabeli cserét; tárolási hiba esetén a régi adatok maradnak. Más profil, fiók, katalógus és cloud snapshot nem törlődik. A megerősítés ezt egyértelműen elmondja.
- A régi helyi jelszómódosító nem jelezhet felhőfiók-jelszómódosítást. Cloud környezetben érthetően jelzi, hogy ez itt még nem elérhető, és semmit nem változtat.
- Új, a láblécből és fiókfelületekről elérhető használati tudnivalók: tervezés, GPS, offline korlátok, helyi/felhőmentés, másik eszköz, privát és nyilvános túrák. A regisztráció során megnyitva nem vesznek el a már kitöltött mezők.
- A régi társlista, csapatkód és szervezői eszközök helyi működése egyértelműen jelölt. Nem ígérnek nem létező többfelhasználós chatet vagy szerveres csapatregisztrációt.
- A kezdő kérdéssor magyarázatai magyarul és ellenőrizhető ígéretek nélkül jelennek meg.
- A service worker új V130 cache-nevet használ az új kiadás frissítéséhez.

## Ellenőrzés

- Typecheck és production build: PASS.
- Unit / adapter / build tesztek: 45/45 PASS, nincs kihagyott teszt.
- Célzott böngészős használati teszt: PASS, 390×844, overflow 0, pageerror 0, alkalmazás-console.error 0.
- A kiadási böngészős gate: 8/8 PASS (főoldal, navigáció, katalógus, design, események, túraközpont, használati folyamatok, V130 GPS). Az új használati teszt is kötelező deploy előtt.
- A használati teszt elkülönített helyi adatokkal és kontrollált, kizárólag tesztbeli adapterválaszokkal dolgozik. Nem küld regisztrációs levelet és nem ír az éles adatbázisba.
- A 13 katalógustúra, 3 helyszín, 9 tárolt esemény és 37 forrásolt GPX/KML útvonal byte-azonos adatszerkezete ellenőrzött. A személyes adatokhoz nem nyúltunk.

## Korlátok, nem elkészült funkciók

Ez nem teljes production-készségi tanúsítás. Az e-mail-küldés, saját domain és jelszó-visszaállító levél beállítása későbbre marad. A végleges adatkezelési és szerződéses tájékoztató, cloud fióktörlés, valamint a régi barát-/csapat-/meghívórendszer valódi többfelhasználós háttere külön feladat. A használati oldal nem helyettesíti a jogi dokumentumokat.

Supabase Auth, profil RPC, snapshot adapter, RLS, restore/rollback és GPS/GPX algoritmus nem változott. SQL, migration, szerversecret, domain és levelezőszolgáltató beállítás nem történt.

A korábbi `RELEASE_TOUR_CENTER.md` által rögzített függőségi figyelmeztetések, nagy JS-csomag és elavult legacy tesztállítások nem kerültek elrejtésre vagy javítottnak minősítésre. A teljes régi regresszió naplói a munkaterületen: `home-check/usability/legacy/`; a mai release gate és a régi tesztcsomagok eredményei külön kezelendők.

A 14 régi csomag összehasonlítása elkészült: új működési regresszió nincs. V45 25/29, V46 32/35, V47 chain 23/26, V49 27/33, V50 43/44, V51 flow 19/21, V51 negative 11/11, V52 38/52, V53 44/52; az előző kiadás hibáival. V43/V47 final/V48 régi, hiányzó DOM-elemet kereső teszthibája és a V51 crawl tízperces időtúllépése szintén megmaradt. Ezek nem PASS eredmények.

A V54 mentési ajánlat szövegének szándékos változása egy új szövegegyezési hibát jelzett. A teszt most a régi és az új magyar mondatot is felismeri; az ablak és a mentésgomb meglétét továbbra is ellenőrzi. Újrafuttatva csak a korábbi E1/E2/E3 hibák maradnak: a teszt helyi PBKDF2 trezort feltételez a jelenlegi Supabase konfiguráció mellett. Az első hibás futás naplója és a javított ellenőrzés eredménye is megmaradt (`comparison.json`, `retry-v54e2e.js.log`, `reviewed-comparison.json`).
