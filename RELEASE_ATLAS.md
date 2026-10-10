# V130 — Atlas választható megjelenés

Baseline: `edc2649`. Az eredeti dizájn marad az alapértelmezett, amíg az adott eszközön a felhasználó mást nem választ.

## Használat

- `?design=atlas`: Atlas előnézet az aktuális route-on, önmagában nem ment eszközbeállítást.
- `?design=classic`: eredeti megjelenés, a mentett választást is felülbírálja.
- A „Megjelenés” / „Atlas megjelenés” gombbal választható és megjegyezhető a dizájn.
- A váltás az aktuális oldalon történik, nem indít render/restore/logout műveletet. GPS-rögzítést nem állít le.

## Megvalósítás

Az `app/js/appearance.js` csak megjelenési preferenciát és dekorációt kezel. Az új `app/css/atlas.css` szabályai a `data-design="atlas"` attribútumhoz kötöttek. Az eredeti stíluslapok, render-wrapper láncok és funkciók megmaradnak.

Az Atlas világos, szürkés-fehér munkaterületet, egységes rendszerbetűt, vonalas SVG ikonokat, szerkesztett oldalsávot, dashboard-panelrácsot és kisebb, rendezett kártyákat használ. A meglévő sötét megjelenési beállítás szintén használható. Nincs új font, CDN, függőség vagy külső adatforrás.

A dekoratív ikonok eredeti DOM-szövege megmarad; az Atlas csak a megjelenítését változtatja. Inputok, szerkeszthető szöveg, térképréteg és GPS/GPX adatok változatlanok. A nyilvános katalógus és a felhasználói Store nincs másolva vagy migrálva.

## Ellenőrzések

- Typecheck és production build.
- 46 egység-/adapter-/buildteszt, köztük az Atlas production-kimenet és adatkezelési határ ellenőrzése.
- Kilenc böngészős release suite: az eredeti nyolc kapu plusz az Atlas célzott tesztje.
- Atlas: 10 nyilvános és 23 személyes/túra route; 1440, 768 és 390×844; 24 meglévő navigációs elem a mobilmenüben; túra szerkesztés és reload; klasszikus/Atlas visszaváltás; preferencia megőrzése; a preferenciatárolás hibája; sötét mód; katalógus-adatazonosság; pageerror és saját console.error.
- Az eredeti V130 GPS-böngészőteszt Atlas módban is: indítás, pause/resume, rögzítés és mentés. Aktív GPS közben két megjelenésváltás után ugyanaz a nézet és GPS-watch marad, a pontok megmaradnak. GPS-mock csak a meglévő tesztkörnyezetben.
- Adatazonosság: 13 katalógustúra, 3 helyszín, 9 tárolt esemény, 37 ismert GPX/KML útvonal. Az események nyilvános száma továbbra is a meglévő dátum/státuszszűrőt követi.
- A TEST_MATRIX régi V43–V54 suite-jai is lefutottak: mind a 14 suite ismert hibái és eredményei a korábbi baseline-nal egyeznek, új hiba nincs. A V51 crawl ugyanúgy 10 perc után timeoutot ad, a régi DOM/demo/local-trezor elvárások hibái nem tekinthetők zöldnek. Részletes helyi összevetés: `home-check/atlas/legacy/comparison.json` a repository mellett.

## Érintetlen területek

Supabase Auth/RLS, SQL/migration, cloud save/load/expectedVersion, V54 vault/rollback, Store/ID, routing, GPX parser, GPS algoritmus és katalógusadatok. Régi statikus fájl nincs törölve.
