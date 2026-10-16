import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

assert.ok(process.env.TT_PLAYWRIGHT_PATH && process.env.TT_EDGE_PATH, 'V130.9 review browser test needs Playwright and the installed browser path.');
const { chromium } = await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.TT_EDGE_PATH });
const base = (process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/').replace(/#.*$/, '');
const pageErrors = [], consoleErrors = [];
const tourId = 't-v1309-review';
const routeId = 'r-v1309-review';
const start = 1790000000000;
const plannedGpx = { name: 'V130.9 tervezett nyomvonal', line: [[46.36, 25.8], [46.36, 25.8005], [46.3605, 25.801], [46.361, 25.8015], [46.3615, 25.802]], pts: [], elev: [1000, 1018] };

function seed() {
  if (localStorage.getItem('turavaros_v1')) return;
  const tourId = 't-v1309-review', routeId = 'r-v1309-review', start = 1790000000000;
  const plannedGpx = { name: 'V130.9 tervezett nyomvonal', line: [[46.36, 25.8], [46.36, 25.8005], [46.3605, 25.801], [46.361, 25.8015], [46.3615, 25.802]], pts: [], elev: [1000, 1018] };
  const points = [
    { lat: 46.36, lng: 25.8, timestamp: start, accuracy: 6, altitude: 1000 },
    { lat: 46.36, lng: 25.8005, timestamp: start + 900000, accuracy: 7, altitude: 1007 },
    { lat: 46.3605, lng: 25.801, timestamp: start + 1800000, accuracy: 6, altitude: 1018 },
    { lat: 46.361, lng: 25.8015, timestamp: start + 2700000, accuracy: 8, altitude: 1013 },
    { lat: 46.3615, lng: 25.802, timestamp: start + 3600000, accuracy: 7, altitude: 1023 },
  ];
  const tour = { id: tourId, title: 'V130.9 GPS túraértékelés', place: 'Csíkszereda', region: 'Hargita', status: 'teljesítve',
    projectStatus: 'TELJESÍTVE', date: '2026-10-10', doneAt: '2026-10-10', difficulty: 'Közepes', lengthKm: 0.2, ascent: 200,
    coords: { lat: 46.36, lng: 25.8 }, routeId, gpx: structuredClone(plannedGpx), liveTrack: { version: 1, status: 'finished', startedAt: start,
      finishedAt: start + 7200000, activeMs: 3600000, points, distanceM: 999999, maxSpeedKmh: 4.2 },
    timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [] };
  const sparse = { ...structuredClone(tour), id: 't-v1309-sparse', title: 'Hiányos GPS-adatsor', routeId: null, gpx: null,
    liveTrack: { version: 1, status: 'finished', startedAt: 'hibás idő', finishedAt: Infinity, activeMs: NaN,
      points: [{ lat: 46.36, lng: 25.8, timestamp: null, accuracy: null, altitude: null }, { lat: 46.3601, lng: 25.8001, timestamp: null, accuracy: null, altitude: null }, { lat: 95, lng: Infinity, timestamp: start, altitude: 900 }],
      summary: { distanceM: Infinity, activeMs: Infinity, elevationGainM: NaN } } };
  const route = { id: routeId, title: 'V130.9 tervezett útvonal', track: plannedGpx.line, distance_km: 0.5, elevation_gain_m: 180 };
  const data = { tours: [tour, sparse], routes: [route], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
    goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: { weather: false, reminders: false }, aiChat: [], templates: [],
    terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [] };
  localStorage.setItem('turavaros_v1', JSON.stringify({ users: { 'u-v1309': { id: 'u-v1309', name: 'V130.9 teszt', email: 'v1309@test.invalid', pass: 'local:test', onboarded: true } }, data: { 'u-v1309': data }, session: 'u-v1309' }));
  localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({ offers: { 'v1309@test.invalid': Date.now() } }));
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*.supabase.co/**', route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text()); });
  await page.addInitScript(seed);

  await page.goto(base + '#/tura-live/' + tourId, { waitUntil: 'networkidle' });
  await page.waitForFunction(id => !!Store.myData() && (Store.myData().journal || []).filter(row => row.tourId === id && row.metricSource === 'gps').length === 1, tourId);
  const plannedBefore = await page.evaluate(id => structuredClone(Store.getTour(id).gpx), tourId);
  const launch = page.locator('#v130-summary a[href="#/tura-ertekeles/' + tourId + '"]');
  await launch.waitFor();
  await launch.click();
  await page.waitForURL(new RegExp('#/tura-ertekeles/' + tourId + '$'));
  await page.locator('#v1309-review').waitFor();

  const first = await page.evaluate(id => {
    const tour = Store.getTour(id), review = window.__V130.review(tour);
    return { review, routePreserved: structuredClone(tour.gpx), title: document.querySelector('#v1309-review h1')?.textContent,
      body: document.querySelector('#v1309-review')?.innerText, hasPlanLink: !!document.querySelector('#v1309-review a[href="#/tura/' + id + '"]'),
      hasJournalLink: !!document.querySelector('#v1309-review a[href="#/naplo"]'), width: document.documentElement.scrollWidth };
  }, tourId);
  assert.equal(first.title, '📊 Túraértékelés');
  assert.ok(first.review.actual.distanceM > 100 && first.review.actual.distanceM < 300, 'Actual distance must be calculated from GPS points, not the deliberately inconsistent stored distanceM: ' + first.review.actual.distanceM);
  assert.equal(first.review.actual.elapsedMs, 7200000);
  assert.equal(first.review.actual.activeMs, 3600000);
  assert.ok(first.review.actual.averageActiveKmh > 0);
  assert.equal(first.review.actual.elevationGainM, 18, 'GPS ascent uses the existing 8 m elevation band.');
  assert.deepEqual(first.review.actual.pointCount, { total: 5, valid: 5, timestamped: 5, elevated: 5, accuracy: 5 });
  assert.equal(first.review.planned.distanceKm, 0.5);
  assert.ok(first.review.comparison.distanceDeltaKm < 0, 'Planned distance remains a separate comparison value.');
  assert.ok(first.review.comparison.routeFit && first.review.comparison.routeFit.withinTolerance === 5);
  assert.match(first.body, /GPS-pontok/);
  assert.ok(first.hasPlanLink && first.hasJournalLink);
  assert.equal(first.width, 390, 'Review fits the 390 px viewport without horizontal overflow.');
  assert.deepEqual(first.routePreserved, plannedBefore, 'Review must not alter the planned GPX.');

  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__v1309Copied = text; } } });
  });
  await page.locator('#v1309-copy-summary').click();
  await page.waitForFunction(() => !!window.__v1309Copied);
  const copied = await page.evaluate(() => window.__v1309Copied);
  assert.match(copied, /Túraértékelés/);
  assert.doesNotMatch(copied, /46\.36|25\.8|46\.3615|25\.802/);
  assert.doesNotMatch(copied, /track|nyomvonal/i);

  await page.reload({ waitUntil: 'networkidle' });
  const afterReload = await page.evaluate(id => ({ review: window.__V130.review(Store.getTour(id)), route: structuredClone(Store.getTour(id).gpx), journalRows: Store.myData().journal.filter(row => row.tourId === id).length }), tourId);
  assert.deepEqual(afterReload.review, first.review, 'Derived review values must stay stable after reload.');
  assert.deepEqual(afterReload.route, plannedBefore);
  assert.equal(afterReload.journalRows, 1);

  await page.goto(base + '#/tura/' + tourId, { waitUntil: 'networkidle' });
  await page.waitForFunction(id => !!document.querySelector('[data-v130-review-link][href="#/tura-ertekeles/' + id + '"]'), tourId);
  await page.locator('[data-v130-review-link]').click();
  await page.waitForURL(new RegExp('#/tura-ertekeles/' + tourId + '$'));
  await page.goto(base + '#/tura-live/' + tourId, { waitUntil: 'networkidle' });
  await page.waitForFunction(id => Store.myData().journal.filter(row => row.tourId === id).length === 1, tourId);
  assert.doesNotMatch(await page.locator('#view').innerText(), /inner\s*=>|\$\{inner\}/, 'The live-tour shell must render content, not expose a dashboard wrapper function as text.');
  await page.evaluate(id => window.__V120.finish(id), tourId);
  assert.equal(await page.evaluate(id => Store.myData().journal.filter(row => row.tourId === id).length, tourId), 1, 'Reopening and repeating finish cannot duplicate the GPS journal row.');

  const edgeCases = await page.evaluate(() => {
    const sparse = Store.getTour('t-v1309-sparse'), review = window.__V130.review(sparse);
    const missingElevation = window.__V130.review({ id: 'missing-elevation', title: 'Hiányzó magasság', liveTrack: { status: 'finished', startedAt: 1000, finishedAt: 2000, activeMs: 1000,
      points: [{ lat: 46, lng: 25, timestamp: 1000, altitude: null }, { lat: 46.0001, lng: 25.0001, timestamp: 2000, altitude: null }] } });
    return { sparseReview: review, missingElevation, serialized: JSON.stringify(review) };
  });
  assert.equal(edgeCases.sparseReview.actual.pointCount.valid, 2);
  assert.equal(edgeCases.sparseReview.actual.distanceM != null, true);
  assert.equal(edgeCases.sparseReview.actual.elapsedMs, null);
  assert.equal(edgeCases.sparseReview.actual.activeMs, null);
  assert.equal(edgeCases.sparseReview.actual.averageActiveKmh, null);
  assert.equal(edgeCases.sparseReview.actual.elevationGainM, null);
  assert.match(edgeCases.sparseReview.actual.completeness, /Részleges/);
  assert.match(edgeCases.sparseReview.actual.completeness, /pontossági adatok/);
  assert.equal(edgeCases.sparseReview.comparison.routeFit, null);
  assert.equal(edgeCases.missingElevation.actual.elevationGainM, null);
  assert.doesNotMatch(edgeCases.serialized, /NaN|Infinity/);
  await page.goto(base + '#/tura-ertekeles/t-v1309-sparse', { waitUntil: 'networkidle' });
  await page.locator('#v1309-review').waitFor();
  const sparseText = await page.locator('#v1309-review').innerText();
  assert.match(sparseText, /Szintemelkedés[\s\S]*Nincs adat/);
  assert.doesNotMatch(sparseText, /NaN|Infinity/);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  console.log(JSON.stringify({ status: 'PASS', checks: ['actual GPS stats', 'existing elevation band', 'planned-vs-actual separation', 'route proximity with GPS accuracy',
    'review link after finish and from workspace', 'stable after reload', 'journal idempotency', 'sparse/malformed GPS data', 'privacy-safe copied summary', 'planned GPX preserved', 'mobile 390x844'],
    pageerror: 0, consoleError: 0 }, null, 2));
  await context.close();
} finally {
  await browser.close();
}
