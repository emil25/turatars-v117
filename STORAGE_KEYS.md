# STORAGE KEYS — mit tartalmaz, mikor íródik/olvódik, mi törölhető

## `turavaros_v1` — AZ ALKALMAZÁS ADATAI (ez NEM törölhető tesztben éles felhasználónál; a felhasználó törölheti a Beállítások → export/import/erase útvonalon keresztül)
```
{
 users:{ "u_x":{id,name,email,pass(djb2),city,onboarded,joined,bio?} },
 data:{  "u_x":{ tours[], journal[], routes[], wishlist[], equipment[], inbox[], teams[],
                templates[], terepi[], goalList, goals, savedEvents[], notifDismiss[],
                widgets, prefs, aiChat[], reportAck, challenges? } },
 session:"u_x"|null,
 platform:{ organizers[], events[], participants[], seeded? }     // V52
 community:{ profiles[], connections[], invites[], notifs[], demoSeeded? } // V53/V54
}
```
- Írás: minden `Store.save()` (szinkron, whole-JSON). Olvasás: induláskor `load()` + minden route-váltás renderje.
- Migrációk: `ensureExtras()` (hiányzó tömbök), `ensureTourFields()` (project.js wrapperben), widget-migráció.

## `turatars_v54_vault_v1` — V54.1 HELYI TREZOR (uid-kötött mentések; titkosítás: PBKDF2-hash, az SNAPSHOT maga nem titkosított!)
`{accounts:{email→{uid,salt,hash,name,createdAt}}, snaps:{uid→{at,size,snap}}, tokens:{tk→email}}`
- Írás: signup/login (accounts, tokens), kimeneti `localSave` (snaps).
- Olvasás: `localWho`, `localSave/localLoad`, restore-ellenőrzés (`email_mismatch` guard).
- Törölhető: csak teszt-környezetben; élesben a felhasználó mentése. **Ez NEM cloud — más eszközön nem létezik.**

## `turatars_v54_state` — eszköz-session a vault-hoz `{token,uid,email}`
- Íráskor: signup/login (`sset_`), clearSess törli. Olvasás: indulási resume-IIFE.
- Törölhető: kilépéskor (a app így is működik).

## `turatars_v54_pre1` — biztonsági pillanatkép RESTORE előtt `{ts, db}`
- Írás: `applySnapshot` első lépése. Olvasás: „↩️ Előző helyi állapot vissza” gomb (+ rollback API).
- Felülíródik minden restore-nál; törölhető, de akkor nincs rollback.

## `turatars_supabase_auth_v1` — Supabase Auth session (csak cloud módban)
- A hivatalos Supabase kliens kezeli; access/refresh session az adott originhez.
- Nem Store-adat és nem service-role kulcs. Kijelentkezéskor a Supabase kliens törli.
- A meglévő V54/Store kulcsokat nem helyettesíti és nem nevezi át.

## SW cache `turatears-vNN`
- Shell: `/`, `index.html`, `manifest.webmanifest`; font-first fetch fallback.
- Törölhető (frissítésnél öntisztuló). 

## NEM törölhető soha (éles adatvesztés):
`turavaros_v1` teljes egészében (kivéve a tudós eraseMyData/importData útvonalat), a `turatars_v54_vault_v1.snaps`.

## teszt-környezet:
Minden E2E új Playwright context-ben indul → localStorage-szigetel; aa tesztek a fixtúrákat a `/tmp/*51.gpx`-re írják, ld. RUNBOOK + `tests/prep-fixtures.sh`.
