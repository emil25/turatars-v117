# TEST Matrix — V117 BASELINE (mind mindegyik a V117/últ builds-en, frissítve)

| suite | leírás | build | eredmény |
|---|---|---|---|
| v43e2e.js | V43 planner + V42 regresszió (24+1) | V115 | **26/26**, PE0 |
| v45e2e.js | V45 Túra mód | V115 | **29/29**, PE0, konz0 |
| v46final.js | Inbox 2.0 (35) | V115 | **35/35**, PE0 (1 non-repro konténerzaj) |
| v46audit.js / v46-smoke-search-delete.js | V46 extra / edge | earlier | zöld |
| v45final-check.js | V45 spot | earlier | zöld |
| v47final.js | GPX final: import/dedup/raw export | V115 | **12/12**, PE0 |
| v47chain.js | GPX projekt-lánc | V115 | **26/26**, PE0 |
| v47deep.js | GPX deep edge | earlier | zöld |
| v48e2e.js | Vezető terv | V115 | **30/30**, PE0 |
| v49e2e.js | Túrafelfedező | V115 | **33/33**, PE0 |
| v50e2e.js | Profil/jelvények | V117 | **44/44**, PE0 |
| v51crawl.js | desktop+mobil: 26 lap, route-integritás, halott gombok, modálok, overflow | V117 | **14/14** |
| v51flow.js | V51 teljes felhasználói lánc | V117 | **21/21** |
| v51neg.js | roncsolt adat (18 lap) | V117 | **11/11**, PE0 |
| v52e2e.js | Eseményplatform (45→52 assert) | V117(+V52-es javítások után) | **52/52**, PE0 |
| v53e2e.js | Közösség/jelentkezések (52) | V117 | **52/52**, PE0 |
| smoke52.js | V52 flow gyors (K0–K9) | V117 | 10/10 |
| v54e2e.js | V54.1 fiók/snapshot/restore/A–V (24) | V117 | **24/24**, PE0, konz0 |
| sm53.js | V53 full flow (A–V+PE) | V116 | 21/21 |
| db52/db54/wk52.js, probe*/dg52*/pg52* | diagnosztika (nem.assert) | V92-117 | — |
| build/tests/build-output.test.mjs | Vite build kimenet gate | minden publish | **npm test zöld** |

## Futtatás
```
cd build && npm ci && npm test                       # build+gate
cd tests && python3 ../tools/prep_fixtures.py        # /tmp/*.gpx fixTUREK
PLAYWRIGHT_CHROME=... node v51crawl.js              # env ld. RUNBOOK
```

## Következmények (bazis)
A V117 a **bazis**: új funkció nélkül. Bármely PR-nak: crawl/flow/neg V51 + V52+V53+V54
teljes, pageerror 0, kritikus konz 0, mobile 390×844 tiszta (v51crawl mobيل része).
