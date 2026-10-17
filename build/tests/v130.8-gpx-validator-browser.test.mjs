import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import('playwright');
const browserPath = process.env.TT_EDGE_PATH || process.env.V130_EDGE_PATH || chromium.executablePath();
assert.ok(path.isAbsolute(browserPath), 'Playwright Chromium must resolve to an installed executable.');
const port = Number(process.env.TT_V1308_PORT || 4176);
const base = `http://127.0.0.1:${port}/`;
const preview = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: root, env: process.env, stdio: 'ignore', windowsHide: true });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (preview.exitCode != null) throw new Error(`Vite preview exited with ${preview.exitCode}`);
    try { ready = (await fetch(base)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'Vite production preview did not become ready.');
  browser = await chromium.launch({ headless: true, executablePath: browserPath });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const pageErrors = [], appConsoleErrors = [], gpxUploads = [];
  await context.route('**/*', async route => {
    const request = route.request();
    if (request.method() === 'POST' && /<gpx|application\/gpx/i.test(request.postData() || '')) gpxUploads.push(request.url());
    if (new URL(request.url()).origin !== new URL(base).origin) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) appConsoleErrors.push(message.text());
  });

  const plannedGpx = { name: 'Megőrzendő terv', pts: [{ lat: 46.3, lng: 25.7, ele: 500 }, { lat: 46.31, lng: 25.71, ele: 510 }], line: [[46.3, 25.7], [46.31, 25.71]] };
  await page.addInitScript(({ plannedGpx }) => {
    const tour = { id: 't-v1308-planned', title: 'Tervezett GPX megőrzése', place: 'Csíkszereda', status: 'tervezés', PROJECT_STATUS: 'TERVEZETT',
      date: '', startTime: '', difficulty: '', lengthKm: 0, ascent: null, durationH: null, coords: { lat: 46.3, lng: 25.7 }, routeId: null,
      gpx: plannedGpx, routeStart: null, routeEnd: null, timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [], waypoints: [] };
    const data = { tours: [tour], routes: [], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [], goals: { km: 300, tours: 12, summits: 3 },
      notifDismiss: [], prefs: {}, aiChat: [], templates: [], terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [] };
    if (!localStorage.getItem('turavaros_v1')) localStorage.setItem('turavaros_v1', JSON.stringify({
      users: { 'u-v1308': { id: 'u-v1308', name: 'V130.8 Teszt', email: 'v1308@test.invalid', pass: 'local:test', onboarded: true } },
      data: { 'u-v1308': data }, session: 'u-v1308'
    }));
  }, { plannedGpx });
  await page.goto(base + '#/', { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => typeof window.v47parseGPX), 'function');
  assert.equal(await page.evaluate(() => typeof window.v47GPXValidationHtml), 'function');

  const valid = `<?xml version="1.0"?><gpx version="1.1" creator="V130.8" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>Érvényes tesztútvonal</name></metadata><trk><name>Érvényes tesztútvonal</name><trkseg><trkpt lat="46.3000" lon="25.7000"><ele>500</ele><time>2026-10-16T07:00:00Z</time></trkpt><trkpt lat="46.3010" lon="25.7010"><ele>512</ele><time>2026-10-16T07:10:00Z</time></trkpt><trkpt lat="46.3020" lon="25.7020"><ele>520</ele><time>2026-10-16T07:20:00Z</time></trkpt></trkseg></trk></gpx>`;
  const malformed = '<gpx><trk><trkpt lat="46" lon="25"></trk></gpx>';
  const missingCoordinates = '<gpx><trk><trkseg><trkpt lat="46" lon="25"/><trkpt lat="" lon="25.1"/><trkpt lat="46.2"/></trkseg></trk></gpx>';
  const noElevation = '<gpx><trk><trkseg><trkpt lat="46.3" lon="25.7"><time>2026-10-16T07:00:00Z</time></trkpt><trkpt lat="46.31" lon="25.71"><time>2026-10-16T07:10:00Z</time></trkpt></trkseg></trk></gpx>';
  const noTimes = '<gpx><trk><trkseg><trkpt lat="46.3" lon="25.7"><ele>500</ele></trkpt><trkpt lat="46.31" lon="25.71"><ele>520</ele></trkpt></trkseg></trk></gpx>';
  const duplicate = '<gpx><trk><trkseg><trkpt lat="46.3" lon="25.7"><ele>500</ele><time>2026-10-16T07:00:00Z</time></trkpt><trkpt lat="46.3" lon="25.7"><ele>500</ele><time>2026-10-16T07:01:00Z</time></trkpt><trkpt lat="46.31" lon="25.71"><ele>520</ele><time>2026-10-16T07:02:00Z</time></trkpt></trkseg></trk></gpx>';
  const largeJump = '<gpx><trk><trkseg><trkpt lat="46.3" lon="25.7"><ele>500</ele><time>2026-10-16T07:00:00Z</time></trkpt><trkpt lat="47.0" lon="25.7"><ele>520</ele><time>2026-10-16T07:02:00Z</time></trkpt></trkseg></trk></gpx>';
  const onePoint = '<gpx><trk><trkseg><trkpt lat="46.3" lon="25.7"/></trkseg></trk></gpx>';
  const upload = async (xml, name = 'teszt.gpx') => {
    await page.evaluate(() => window.openGPXImport({}));
    await page.locator('#rt-drop input[type=file]').setInputFiles({ name, mimeType: 'application/gpx+xml', buffer: Buffer.from(xml) });
  };

  // The shared parser classifies a complete file as ready and exposes accurate measurements.
  const good = await page.evaluate(xml => window.v47parseGPX(xml), valid);
  assert.equal(good.validation.status, 'ok');
  assert.equal(good.validation.pointCount, 3);
  assert.equal(good.validation.elevation.available, 3);
  assert.equal(good.validation.timestamps.valid, 3);
  assert.ok(good.validation.distanceKm > 0);
  await upload(valid);
  await page.locator('.rt-pv .rt-validation-ok').getByText('Rendben').waitFor();
  await page.getByText(/3 útvonalpont/).last().waitFor();
  assert.equal(await page.locator('#rt-keep').count(), 1);
  const saved = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Ellenőrzött útvonal', file: 'teszt.gpx' }), valid);
  assert.equal(saved.ok, true);
  const originalRaw = await page.evaluate(id => Store.myData().routes.find(route => route.id === id).raw, saved.route.id);
  assert.equal(originalRaw, valid, 'The exact original GPX text is preserved.');
  await page.locator('[data-modal] [data-close]').last().click().catch(() => {});

  // Invalid XML and missing coordinates are hard errors, accompanied by readable reasons and no partial route.
  const beforeErrors = await page.evaluate(() => Store.myData().routes.length);
  assert.equal((await page.evaluate(xml => window.v47parseGPX(xml), malformed)).validation.status, 'error');
  await upload(malformed, 'hibas-xml.gpx');
  await page.locator('#rt-validation-feedback .rt-validation-error strong').getByText('Hiba', { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => Store.myData().routes.length), beforeErrors);
  await page.locator('[data-modal] [data-close]').last().click();
  const invalidCoords = await page.evaluate(xml => window.v47parseGPX(xml), missingCoordinates);
  assert.equal(invalidCoords.err, 'invalidpoint');
  assert.equal(invalidCoords.validation.invalidTrackPoints, 2);
  await upload(missingCoordinates, 'hianyzo-koordinatak.gpx');
  await page.locator('#rt-validation-feedback').getByText(/2 útvonalpont koordinátája hiányzik vagy érvénytelen/).waitFor();
  assert.equal(await page.evaluate(() => Store.myData().routes.length), beforeErrors);
  await page.locator('[data-modal] [data-close]').last().click();
  assert.equal((await page.evaluate(xml => window.v47parseGPX(xml), onePoint)).err, 'shorttrack');

  // Missing elevation and timestamps remain importable but produce warnings, with no fabricated data.
  const elevationWarning = await page.evaluate(xml => window.v47parseGPX(xml), noElevation);
  assert.equal(elevationWarning.validation.status, 'warning');
  assert.equal(elevationWarning.validation.elevation.available, 0);
  assert.equal(elevationWarning.stats.hasElevationSamples, false);
  await upload(noElevation, 'magassag-nelkul.gpx');
  await page.locator('.rt-validation-warning').getByText('Figyelmeztetés').waitFor();
  await page.getByText(/Magassági adat 2 pontnál hiányzik/).waitFor();
  await page.locator('[data-modal] [data-close]').last().click();
  const timeWarning = await page.evaluate(xml => window.v47parseGPX(xml), noTimes);
  assert.equal(timeWarning.validation.timestamps.missing, 2);
  assert.ok(timeWarning.validation.warnings.some(text => text.includes('Időbélyeg 2 pontnál nincs megadva')));
  const duplicateWarning = await page.evaluate(xml => window.v47parseGPX(xml), duplicate);
  assert.equal(duplicateWarning.validation.duplicateCount, 1);
  const jumpWarning = await page.evaluate(xml => window.v47parseGPX(xml), largeJump);
  assert.equal(jumpWarning.validation.jumps.length, 1);
  assert.ok(jumpWarning.validation.warnings.some(text => text.includes('50 km-nél nagyobb ugrás')));

  // The 700 KB ceiling is enforced before reading, and duplicate fingerprints still distinguish geometry from names.
  const overLimit = '<gpx>' + ' '.repeat(700001) + '</gpx>';
  assert.equal((await page.evaluate(xml => window.v47parseGPX(xml), overLimit)).err, 'large');
  await upload(overLimit, 'tulmeretes.gpx');
  await page.getByText(/legfeljebb 700 KB-os fájlt/).waitFor();
  await page.locator('[data-modal] [data-close]').last().click();
  const first = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Azonos név' }), valid);
  const repeat = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Másik fájlnév' }), valid);
  assert.equal(repeat.duplicate, true);
  assert.equal(repeat.route.id, first.route.id);
  const otherGeometry = valid.replace('lat="46.3000" lon="25.7000"', 'lat="46.4000" lon="25.8000"');
  const distinct = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Azonos név' }), otherGeometry);
  assert.equal(distinct.duplicate, false);
  assert.notEqual(distinct.route.id, first.route.id);

  // Event GPX import presents the same warning before the event can attach it.
  await page.evaluate(() => {
    Store.platform().organizers.push({ id: 'org-v1308', owner: Store.me().email, name: 'V130.8 teszt szervező', demo: false }); Store.save(); window.e2.evForm();
  });
  await page.locator('#e2f_gpxf').setInputFiles({ name: 'magassag-nelkul.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(noElevation) });
  await page.locator('#e2f_gpxprev .rt-validation-warning').getByText('Figyelmeztetés').waitFor();
  assert.equal(await page.evaluate(() => !!document.querySelector('[data-modal]')?.__gpx?.pr?.validation), true);

  // No GPX body was posted to any server; existing V130.4 tests cover planned GPX preservation and separate GPS tracks.
  assert.deepEqual(gpxUploads, []);
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(appConsoleErrors, []);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= 390), '390 px viewport must not overflow horizontally.');
  console.log('V130.8 GPX validator browser checks: PASS (valid, malformed XML, missing coordinates/elevation/timestamps, duplicates, jump warning, short track, 700 KB cap, dedup, event importer, no upload, mobile, no pageerror/console.error)');
  await context.close();
} finally {
  if (browser) await browser.close();
  preview.kill();
}
