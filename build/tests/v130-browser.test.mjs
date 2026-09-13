import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const playwrightPath = process.env.V130_PLAYWRIGHT_PATH;
const edgePath = process.env.V130_EDGE_PATH;
if (!playwrightPath || !edgePath || !fs.existsSync(playwrightPath) || !fs.existsSync(edgePath)) {
  console.log('V130 browser GPS test SKIP (set V130_PLAYWRIGHT_PATH and V130_EDGE_PATH to run locally)');
  process.exit(0);
}

const playwright = await import(pathToFileURL(playwrightPath).href);
const { chromium } = playwright.default || playwright;
const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const pageErrors = [], consoleErrors = [];
page.on('pageerror', error => pageErrors.push(String(error)));
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });

await page.addInitScript(() => {
  const tour = {
    id: 't-v130-test', title: 'V130 GPS teszt', place: 'Csíkszereda', status: 'tervezés', projectStatus: 'TERVEZETT',
    date: '', startTime: '', difficulty: 'Közepes', lengthKm: 2, ascent: null, durationH: 1, coords: { lat: 46.36, lng: 25.80 },
    routeId: 'rt-v130-test', routeStart: { lat: 46.36, lng: 25.80, label: 'Csíkszereda' }, routeEnd: { lat: 46.37, lng: 25.81, label: 'Teszt célpont' },
    gpx: null, timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [], tasks: [], budget: [],
    packList: [], projectGearIds: [], tags: []
  };
  const route = { id: 'rt-v130-test', name: 'V130 valódi útvonal', source: 'openrouteservice', distance_km: 2, elevation_gain_m: null,
    duration_s: 3600, start: { lat: 46.36, lng: 25.80, label: 'Csíkszereda' }, finish: { lat: 46.37, lng: 25.81, label: 'Teszt célpont' },
    track: [[46.36,25.80,null,null],[46.365,25.805,null,null],[46.37,25.81,null,null]], nPts: 3 };
  const data = { tours: [tour], routes: [route], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
    goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: { weather: false, reminders: false }, aiChat: [], templates: [],
    terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [] };
  localStorage.setItem('turavaros_v1', JSON.stringify({ users: { 'u-v130': { id: 'u-v130', name: 'V130 teszt', email: 'v130@test.local', pass: 'local:test', onboarded: true } }, data: { 'u-v130': data }, session: 'u-v130' }));
  localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({ offers: { 'v130@test.local': Date.now() } }));
  let first = true;
  const point = (lat, lng, timestamp = Date.now()) => ({ coords: { latitude: lat, longitude: lng, accuracy: 8, altitude: null }, timestamp });
  const geo = { getCurrentPosition(success) { success(point(46.36,25.80)); }, watchPosition(success) { window.__geoSuccess = success; if (first) { first = false; success(point(46.36,25.80)); setTimeout(() => success(point(46.361,25.801,Date.now()+30000)), 20); } return 17; }, clearWatch() {} };
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: geo });
});

try {
  await page.goto(process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/#/tura/t-v130-test', { waitUntil: 'networkidle' });
  if (await page.locator('#modal-root [data-modal]').count()) {
    const close = page.locator('#modal-root [data-close]').first();
    if (await close.count()) await close.click({ force: true });
  }
  await page.locator('#v120-start').click();
  await page.waitForURL(/#\/tura-live\/t-v130-test/);
  await page.waitForTimeout(350);
  assert.equal(await page.locator('#v120-root[data-v130-mode="1"]').count(), 1);
  assert.match(await page.locator('#v130-status').textContent(), /FOLYAMATBAN/);
  assert.ok(Number(await page.locator('#v130-points').textContent()) >= 2);
  assert.match(await page.locator('#v130-distance').textContent(), /0[,.]\d+ km/);
  assert.equal(await page.locator('#v130-summary').getAttribute('hidden'), '');

  await page.locator('#v120-pause').click();
  await page.waitForTimeout(300);
  assert.match(await page.locator('#v130-status').textContent(), /SZÜNETELTETVE/);
  await page.locator('#v120-resume').click();
  await page.waitForTimeout(300);
  assert.match(await page.locator('#v130-status').textContent(), /FOLYAMATBAN/);
  await page.evaluate(() => window.__geoSuccess({ coords: { latitude: 47.2, longitude: 26.8, accuracy: 5, altitude: null }, timestamp: Date.now() + 60000 }));
  await page.evaluate(() => window.__geoSuccess({ coords: { latitude: 47.21, longitude: 26.81, accuracy: 5, altitude: null }, timestamp: Date.now() + 90000 }));
  await page.evaluate(() => window.__geoSuccess({ coords: { latitude: 47.22, longitude: 26.82, accuracy: 5, altitude: null }, timestamp: Date.now() + 120000 }));
  await page.waitForTimeout(80);
  assert.match(await page.locator('#v121-offroute').textContent(), /Letértél/);
  assert.match(await page.locator('#v130-elevation').textContent(), /Nincs adat/);

  await page.locator('#v120-finish').click();
  await page.locator('#cfm-yes').click();
  await page.waitForTimeout(120);
  assert.match(await page.locator('#v130-status').textContent(), /TÚRA TELJESÍTVE/);
  assert.equal(await page.locator('#v130-summary').getAttribute('hidden'), null);
  assert.equal(await page.locator('#v121-gpx-export').count(), 1);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v130'].tours[0].projectStatus), 'TELJESÍTVE');
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);
  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  console.log(JSON.stringify({ pageerror: pageErrors.length, consoleError: consoleErrors.length, mobile: true }, null, 2));
  console.log('V130 browser GPS test PASS');
} finally {
  await browser.close();
}
