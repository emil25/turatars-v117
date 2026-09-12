import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '..', 'dist');
const read = (name) => fs.readFileSync(path.join(dist, name), 'utf8');

test('production output contains the complete V126 application shell', () => {
  assert.ok(fs.existsSync(path.join(dist, 'index.html')), 'dist/index.html is missing');
  assert.ok(fs.existsSync(path.join(dist, 'manifest.webmanifest')), 'PWA manifest is missing');
  assert.ok(fs.existsSync(path.join(dist, 'sw.js')), 'service worker is missing');

  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const cssName = assets.find((name) => /^index-.*\.css$/.test(name));
  assert.ok(jsName, 'hashed JavaScript bundle is missing');
  assert.ok(cssName, 'hashed CSS bundle is missing');

  const html = read('index.html');
  assert.match(html, /\.\/assets\/index-[^"']+\.js/);
  assert.match(html, /\.\/assets\/index-[^"']+\.css/);
  assert.ok(fs.existsSync(path.join(dist, 'icons', 'icon-192.png')), '192px icon is missing');
  assert.ok(fs.existsSync(path.join(dist, 'icons', 'icon-512.png')), '512px icon is missing');
});

test('production bundle preserves the V118 Supabase auth boundary', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');

  assert.match(bundle, /reezefgcbdrcnuhcktma\.supabase\.co/);
  assert.match(bundle, /cloudAuthEnabled/);
  assert.match(bundle, /authSignup/);
  assert.match(bundle, /authLogin/);
  assert.match(bundle, /sb_publishable_/);
});

test('production bundle preserves the tour workspace controls', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');

  assert.match(bundle, /data-edit/);
  assert.match(bundle, /wz-desc/);
  assert.match(bundle, /wz-km/);
  assert.match(bundle, /Túra szerkesztése/);
  assert.match(bundle, /cfm-yes/);
});

test('PWA service worker is on the V126 cache namespace', () => {
  assert.match(read('sw.js'), /turatears-v126/);
});

test('production bundle includes the V120 live GPS tour mode', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /navigator\.geolocation/);
  assert.match(bundle, /v120Begin/);
  assert.match(bundle, /v120Accept/);
  assert.match(bundle, /v120-pause/);
  assert.match(bundle, /v120-finish/);
  assert.match(bundle, /tura-live/);
});

test('production bundle includes the V121 offline and GPX extensions', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V121_ACTIVE_KEY/);
  assert.match(bundle, /v121ExportLive/);
  assert.match(bundle, /v121-gpx-import/);
  assert.match(bundle, /v121-offroute/);
  assert.match(bundle, /v121-offline/);
  assert.match(bundle, /offRouteConsecutive/);
});

test('production bundle includes the V122 verified catalog boundary', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V122/);
  assert.match(bundle, /dataStatus/);
  assert.match(bundle, /sourceUrl/);
  assert.match(bundle, /Jelenleg nincs ellenőrzött esemény/);
  assert.doesNotMatch(bundle, /DEMO — szemléltető/);
});

test('production bundle includes only provenance-backed V123 catalog entries', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V123/);
  assert.match(bundle, /Visit Harghita/);
  assert.match(bundle, /sourceLicense/);
  assert.match(bundle, /Útvonaladat még nem érhető el/);
  assert.match(bundle, /OpenStreetMap contributors/);
  assert.match(bundle, /vh-harghita-bai-subpadure/);
  assert.doesNotMatch(bundle, /DEMO — Ősszel a Csukás alatt/);
});

test('production bundle includes the V124 verified restoration layer', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V124/);
  assert.match(bundle, /Hargitafürdő – Erdőalja/);
  assert.match(bundle, /Balánbánya – Egyeskő/);
  assert.match(bundle, /Gyilkos-tó – Kisbékás/);
  assert.match(bundle, /szatt-10/);
  assert.match(bundle, /szatt-2026-10km\.gpx/);
  assert.match(bundle, /Szent Anna-tó teljesítménytúra 2026/);
  assert.match(bundle, /Elektromos kerékpártúra a Hagymás-hegységben/);
  assert.match(bundle, /Ellenőrzés alatt/);
  assert.match(bundle, /v124PendingEvents/);
});

test('production bundle includes the V125 real route explorer and planner', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V125/);
  assert.match(bundle, /v125KnownRouteCount/);
  assert.match(bundle, /V125Routing/);
  assert.match(bundle, /external_routing_required/);
  assert.match(bundle, /Ismert útvonal/);
  assert.match(bundle, /Nagyhagymás Közösségek Közti Fejlesztési Társulás/);
  assert.match(bundle, /v125StartCatalogTour/);
  assert.match(bundle, /v125-route-select/);
});

test('production bundle keeps all 37 provenance-backed Nagyhagymás route sources', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /MTB-Panoráma/);
  assert.match(bundle, /D95_GalkutjaTerko/);
  assert.match(bundle, /Esztenak\.kml/);
  assert.match(bundle, /adinagyhagymas\.leadingsoft\.eu/);
  assert.match(bundle, /GPX elérhető/);
});

test('production bundle includes the V126 private/public community boundary', () => {
  const assets = fs.readdirSync(path.join(dist, 'assets'));
  const jsName = assets.find((name) => /^index-.*\.js$/.test(name));
  const bundle = fs.readFileSync(path.join(dist, 'assets', jsName), 'utf8');
  assert.match(bundle, /V126Community/);
  assert.match(bundle, /Közösségi túrák/);
  assert.match(bundle, /Közösségi túra/);
  assert.match(bundle, /community_tour_upsert/);
  assert.match(bundle, /community_tour_set_visibility/);
  assert.match(bundle, /community_review_upsert/);
  assert.match(bundle, /community_favorite_toggle/);
  assert.match(bundle, /community_report/);
  assert.match(bundle, /gpx_public/);
  assert.match(bundle, /Még nincs nyilvános közösségi túra/);
});
