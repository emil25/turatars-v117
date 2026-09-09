# Túratárs — V117 Codex handover csomag (önálló: forrás + build + tesztek + dokumentáció)

Olvasd el először: **CODEX_HANDOVER.md** → AGENTS.md → BASELINE_V117.md.

## Tartalom
- `app/` — runtime források: `js/` (19 modul, V41-től V54-ig), `css/` (4),
  `index.html` (legacy közvetlen script-mód), `manifest.webmanifest`, `sw.js`, `icons/`, `img/`
- `build/` — a kiadáshoz használt Vite-repo (vanilla→bundle): `src/{main.tsx, App.tsx, app-bundle.js
  (GENERÁLT, V117 byte-azonos), app-css/views.css}`, `public/`, `index.html`,
  `package.json(+lock)`, `vite.config.ts`, `tests/build-output.test.mjs`, `AGENTS.md`
  (régibb projekt-leírás), `tsconfig.json`
- `tests/` — 24 E2E + diagnosztikus (TEST_MATRIX.md), `fixtures/` (audit47/flow52 GPX-ek)
- `tools/` — `rebundle.mjs` (app/js → build/src/app-bundle.js + CSS sync),
  `prep_fixtures.py` (teszt GPX fájlok a /tmp-be)
- Dokumentumok: ARCHITECTURE, DATA_MODEL, GPX, STORAGE_KEYS, CLOUD_MIGRATION,
  API_CONTRACT, MIGRATION_SAFETY, TEST_MATRIX, RUNBOOK, AGENTS, BASELINE_V117, .env.example

## Gyors start
```sh
cd build && npm ci && npm test         # build + kimenet-gate (V117-en zöld)
cd tests && python3 ../tools/prep_fixtures.py
NODE_PATH=/usr/lib/node_modules node v51flow.js
```

## Alapvető szabályok (részletesen: AGENTS.md)
V41–V54 funkciók sérthetetlenek; párhuzamos adatmodell tilos; Supabase nem épül
(CLOUD_MIGRATION.md a terv); DEMO jelölés kötelező; mobil 390×844 overflow-mentes;
minden PR-on a teljes regresszió zöld + pageerror 0 + kritikus konzol 0.
