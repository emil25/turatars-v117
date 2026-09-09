# AGENTS.md — Kötelező fejlesztési szabályok (Codex/agent handover)

1. **NE törölj és NE írj át V41–V54 funkcionalitást** — a wrap-láncok (`_orig`,
   `_prev.after`) megőrzendők; minden lap/modul maradjon funkcionálisan azonos.
2. **NE építs párhuzamos adatrendszert** (túra-, GPX-, journal-, naptár-, task-,
   résztvevő-, statisztika-). Minden új entitás vagy a `db.data` user-slicébe, vagy
   a meglévő `db.platform` / `db.community` struktúrába menjen uid/e-mail-kulccsal.
3. **Minden változtatás után teljes regresszió** a TEST_MATRIX.md sorrendjében;
   a green list: V43+V45+V46+V47(x2)+V48+V49+V50+V51(crawll, flow, neg)+V52+V53+V54.
   pageerror ≠ 0 VAGY kritikus konzol hiba ⇒ a PR NEM mehet be.
4. **GPX/GPS szabályok**: Haversine, 8 m elevation BAND, downsample 6000, raw
   megőrzés (<700k) és raw-prioritású export — ok nélkül NE változtasd; a `fp` és
   `__fp` ujjlenyomat-formátumok rögzítettek.
5. **ID/fingerprint formátumok** (CODEX_HANDOVER 7. pont) — `p2-<evp>` kötőjel (NE
   kettőspont), `extRef=f9:…`, wishlist `ref`, `pairKey`, event `fp`. Bontás/join
   szabály miatt változtatásuk tilos.
6. **Adatintegritás**: offline → local működik és mentődik; cloud sikertelen → local
   érintetlen (MIGRATION_SAFETY.md); restore soha nem ír más user snapjából.
7. **DEMO** adat: kizárólag egyértelmű DEMO chipjelöléssel és `demo:true` flaggel;
   soha ne állítsd, hogy hamis szervező/valós esemény/history van. Valós importált
   esemény forrás-linkje megőrzendő, át nem iható.
8. **Mobil 390×844 kötelező** minden UI-változtatásnál: nincs vízszintes overflow,
   interaktív gombok ≥44px; a chip/chip-sor scroller designja helyes, de a page nem
   tágulhat.
9. **V54 status quo**: a Supabase NEM építhető most; REST adapter csak a
   `window.V54_CLOUD_BASE_URL` beállításakor aktív; hamis cloud/UI sync, fake végpont
   TILOS. V54.2 designja: CLOUD_MIGRATION.md.
10. **Kulcsnevek**: a négy storage kulcs (STORAGE_KEYS.md) stabil; új kulcs csak
    dokumentált sorral.
11. **Build**: a Vite-pipeline a kiadási út; a `app/js` a forrás-of-record; a
    `build/src/app-bundle.js` generált — `node tools/rebundle.mjs` utána commit.
    (a package-ben a jelenlegi bundle az V117 kimenetével BYTE-azonos.)
12. **v54.js-ben**: a session/resume/restore hookok egyszer futnak (`_v54Shown` guard,
    modal-busy) — a planner/modal lopás-regresszió nem térhet vissza.
13. Ne adj hozzá új függőséget, CDN-t, fontot vagy analitikát megerősítés nélkül.
