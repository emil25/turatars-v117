import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { chromium } = await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.TT_EDGE_PATH });
const base = (process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/').replace(/#.*$/, '');
const pageErrors = [], consoleErrors = [];
const tourId = 't-v1304-planned';
const plannedGpx = {
  name: 'Tervezett GPX, maradjon változatlan',
  pts: [{ lat: 46.36, lng: 25.8, ele: 700, time: '2026-10-12T07:00:00Z' }, { lat: 46.37, lng: 25.81, ele: 720, time: '2026-10-12T07:30:00Z' }],
  line: [[46.36, 25.8], [46.37, 25.81]], elev: [700, 720]
};
const validGpx = `<?xml version="1.0"?><gpx version="1.1" creator="test" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>Próba útvonal</name></metadata><wpt lat="46.3601" lon="25.8001"><ele>701.25</ele><name>Forrás waypoint</name></wpt><trk><name>Próba útvonal</name><trkseg><trkpt lat="46.36" lon="25.8"><ele>700.5</ele><time>2026-10-12T07:00:00Z</time></trkpt><trkpt lat="46.361" lon="25.801"><ele>712.25</ele><time>2026-10-12T07:10:00Z</time></trkpt><trkpt lat="46.362" lon="25.802"><ele>708.75</ele><time>2026-10-12T07:20:00Z</time></trkpt><trkpt lat="46.363" lon="25.803"><ele>725.5</ele><time>2026-10-12T07:30:00Z</time></trkpt></trkseg></trk></gpx>`;
const routeOnlyGpx = `<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><rte><name>Útvonalpontokból álló GPX</name><rtept lat="46.4" lon="25.8"><ele>100</ele></rtept><rtept lat="46.401" lon="25.801"/><rtept lat="46.402" lon="25.802"><ele>120</ele></rtept></rte></gpx>`;
const partialElevationGpx = `<gpx version="1.1"><trk><name>Részleges magasság</name><trkseg><trkpt lat="46.5" lon="25.5"><ele>150.5</ele></trkpt><trkpt lat="46.501" lon="25.501"/><trkpt lat="46.502" lon="25.502"/></trkseg></trk></gpx>`;
const invalidGpx = `<gpx version="1.1"><trk><trkseg><trkpt lat="46.5" lon="25.5"/><trkpt lat="not-a-latitude" lon="25.6"/></trkseg></trk></gpx>`;
const nonGpxXml = `<xml><trk><trkpt lat="46.5" lon="25.5"/><trkpt lat="46.6" lon="25.6"/></trk></xml>`;

function seed({ tourId, plannedGpx }) {
  const tour = {
    id: tourId, title: 'V130.4 tervezett túra', place: 'Csíkszereda', status: 'tervezés', projectStatus: 'TERVEZETT',
    date: '', startTime: '', difficulty: '', lengthKm: 0, ascent: null, durationH: null, coords: { lat: 46.36, lng: 25.8 },
    routeId: null, gpx: plannedGpx, routeStart: null, routeEnd: null, timeline: [], gear: [], participants: [], cars: [], food: [],
    safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [], waypoints: []
  };
  const noPlanTour = { ...tour, id: 't-v1304-no-plan', title: 'GPS felvétel tervezett útvonal nélkül', gpx: null, routeId: null };
  const data = { tours: [tour, noPlanTour], routes: [], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
    goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: {}, aiChat: [], templates: [], terepi: [],
    reportAck: {}, challenges: null, widgets: null, inbox: [] };
  // Playwright init scripts run on every navigation, including reload. Seed only
  // once so the reload assertion observes the application's persisted changes.
  if (!localStorage.getItem('turavaros_v1')) {
    localStorage.setItem('turavaros_v1', JSON.stringify({
      users: { 'u-v1304': { id: 'u-v1304', name: 'V130.4 Teszt', email: 'v1304@test.invalid', pass: 'local:test', onboarded: true } },
      data: { 'u-v1304': data }, session: 'u-v1304'
    }));
    localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({ offers: { 'v1304@test.invalid': Date.now() } }));
  }
  window.__v1304Geo = { currentCalls: 0, watchCalls: 0, watchId: 0 };
  const pos = (lat, lng, timestamp = Date.now()) => ({ coords: { latitude: lat, longitude: lng, accuracy: 5, altitude: 720 }, timestamp });
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
    getCurrentPosition(success) { window.__v1304Geo.currentCalls++; success(pos(46.36, 25.8)); },
    watchPosition(success) { window.__v1304Geo.watchCalls++; window.__v1304GeoSuccess = success; return ++window.__v1304Geo.watchId; },
    clearWatch() {}
  } });
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  await context.route('**/*.supabase.co/**', request => request.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text());
  });
  await page.addInitScript(seed, { tourId, plannedGpx });
  await page.goto(base + '#/tura/' + tourId, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => typeof window.v47parseGPX), 'function');
  assert.equal(await page.evaluate(() => typeof window.v47CommitGPX), 'function');

  // A valid GPX is stored through the existing V47 route library with exact original data and stable ID.
  const first = await page.evaluate(xml => {
    const parsed = window.v47parseGPX(xml);
    const saved = window.v47CommitGPX(parsed, { name: 'Közös útvonalnév', file: 'proba.gpx' });
    return { parsed, saved, count: Store.myData().routes.length };
  }, validGpx);
  assert.equal(first.parsed.err, undefined);
  assert.equal(first.parsed.track.length, 4);
  assert.equal(first.parsed.wpts.length, 1);
  assert.equal(first.saved.ok, true);
  assert.equal(first.saved.duplicate, false);
  assert.equal(first.count, 1);
  const routeId = first.saved.route.id;
  assert.equal(first.saved.route.nPts, 4);
  assert.equal(first.saved.route.track.length, 4);
  assert.equal(first.saved.route.source_file, 'proba.gpx');
  assert.equal(first.saved.route.raw, validGpx);
  assert.equal(first.saved.route.track[0][2], 700.5);
  assert.equal(first.saved.route.track[1][3], '2026-10-12T07:10:00Z');
  assert.deepEqual(first.saved.route.wpts, [{ lat: 46.3601, lng: 25.8001, name: 'Forrás waypoint', ele: 701.25 }]);

  // A planned ORS row with the same geometry must not hide the imported file/raw metadata.
  const collision = await page.evaluate(({ id, points, xml }) => {
    const d = Store.myData();
    d.routes.unshift({ id, name: 'Tervezett ORS útvonal', source: 'openrouteservice', track: points, nPts: points.length, raw: null });
    Store.save();
    const result = window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Másik fájlnév.gpx' });
    return { result, routes: d.routes.length };
  }, { id: 'rt-v1304-ors-same-geometry', points: first.saved.route.track, xml: validGpx });
  assert.equal(collision.result.ok, true);
  assert.equal(collision.result.duplicate, true);
  assert.equal(collision.result.route.id, routeId);
  assert.equal(collision.result.route.raw, validGpx);
  assert.equal(collision.routes, 2);

  // Reimporting the same contents does not create a second row; changing the path does.
  const repeated = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Más fájlnév' }), validGpx);
  assert.equal(repeated.ok, true);
  assert.equal(repeated.duplicate, true);
  assert.equal(repeated.route.id, routeId);
  assert.equal(await page.evaluate(() => Store.myData().routes.length), 2);
  const sameNameDifferentPath = validGpx.replace('46.36" lon="25.8', '46.46" lon="25.9');
  const distinct = await page.evaluate(xml => window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Közös útvonalnév' }), sameNameDifferentPath);
  assert.equal(distinct.ok, true);
  assert.equal(distinct.duplicate, false, 'Different geometry must remain a distinct route even when names match.');
  assert.notEqual(distinct.route.id, routeId);
  assert.equal(await page.evaluate(() => Store.myData().routes.length), 3);

  // Route-point-only GPX remains supported; absent elevation is kept unknown, never fabricated.
  const routeOnly = await page.evaluate(xml => {
    const parsed = window.v47parseGPX(xml);
    return { parsed, saved: window.v47CommitGPX(parsed, { name: 'Útvonalpontokból álló GPX' }) };
  }, routeOnlyGpx);
  assert.equal(routeOnly.parsed.err, undefined);
  assert.equal(routeOnly.parsed.track.length, 3);
  assert.equal(routeOnly.saved.ok, true);
  assert.equal(routeOnly.saved.route.nPts, 3);
  const partial = await page.evaluate(xml => {
    const parsed = window.v47parseGPX(xml);
    return { parsed, saved: window.v47CommitGPX(parsed, { name: 'Részleges magasság' }) };
  }, partialElevationGpx);
  assert.equal(partial.parsed.stats.hasElevationSamples, true);
  assert.equal(partial.parsed.stats.hasEle, false);
  assert.equal(partial.saved.route.elevation_gain_m, null);
  assert.equal(partial.saved.route.elevation_loss_m, null);
  assert.equal(partial.saved.route.min_elevation_m, 150.5);
  assert.equal(partial.saved.route.max_elevation_m, 150.5);

  // A track above the map's 6,000-point display limit keeps its exact source file;
  // the file-size boundary is rejected explicitly rather than saved lossily.
  const longTrack = await page.evaluate(() => {
    const points = Array.from({ length: 6001 }, (_, i) => `<trkpt lat="${(46.2 + i / 1000000).toFixed(6)}" lon="${(25.7 + i / 1000000).toFixed(6)}"><time>2026-10-12T07:${String(Math.floor(i / 60) % 60).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}Z</time></trkpt>`).join('');
    return `<gpx version="1.1"><trk><name>Hosszú valódi track</name><trkseg>${points}</trkseg></trk></gpx>`;
  });
  const longSaved = await page.evaluate(xml => {
    const parsed = window.v47parseGPX(xml);
    const saved = window.v47CommitGPX(parsed, { name: 'Hosszú valódi track' });
    const reread = window.v47parseGPX(saved.route.raw);
    return { parsedCount: parsed.track.length, savedCount: saved.route.nPts, displayCount: saved.route.track.length, raw: saved.route.raw, rereadCount: reread.track.length };
  }, longTrack);
  assert.equal(longSaved.parsedCount, 6001);
  assert.equal(longSaved.savedCount, 6001);
  assert.equal(longSaved.displayCount, 6000);
  assert.equal(longSaved.raw, longTrack);
  assert.equal(longSaved.rereadCount, 6001);
  const tooLarge = await page.evaluate(() => window.v47parseGPX('<gpx>' + ' '.repeat(700001) + '</gpx>'));
  assert.equal(tooLarge.err, 'large');
  assert.equal((await page.evaluate(xml => window.v47parseGPX(xml), nonGpxXml)).err, 'root');

  // A local storage write failure must not leave a partial route in the live Store.
  const failedStore = await page.evaluate(xml => {
    const before = Store.myData().routes.map(route => route.id), original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'turavaros_v1') throw new DOMException('Quota exceeded', 'QuotaExceededError');
      return original.call(this, key, value);
    };
    let result;
    try { result = window.v47CommitGPX(window.v47parseGPX(xml), { name: 'Nem menthető GPX' }); }
    finally { Storage.prototype.setItem = original; }
    return { result, before, after: Store.myData().routes.map(route => route.id) };
  }, validGpx.replace('46.36" lon="25.8', '46.56" lon="26.0'));
  assert.equal(failedStore.result.ok, false);
  assert.equal(failedStore.result.error, 'save');
  assert.deepEqual(failedStore.after, failedStore.before);

  // Reload proves route IDs, full raw GPX, points, times, elevations, and waypoints survive Store persistence.
  await page.reload({ waitUntil: 'networkidle' });
  const persisted = await page.evaluate(id => Store.myData().routes.find(route => route.id === id), routeId);
  assert.ok(persisted, JSON.stringify(await page.evaluate(() => ({
    session: JSON.parse(localStorage.getItem('turavaros_v1') || 'null')?.session,
    storedRouteIds: JSON.parse(localStorage.getItem('turavaros_v1') || 'null')?.data?.['u-v1304']?.routes?.map(route => route.id),
    storeRouteIds: Store.myData().routes.map(route => route.id),
    localStorageKeys: Object.keys(localStorage)
  }))));
  assert.equal(persisted.id, routeId);
  assert.equal(persisted.nPts, 4);
  assert.equal(persisted.raw, validGpx);
  assert.deepEqual(persisted.track, first.saved.route.track);
  assert.deepEqual(persisted.wpts, first.saved.route.wpts);

  // The actual importer reports invalid coordinates and does not create partial route rows.
  const countBeforeInvalid = await page.evaluate(() => Store.myData().routes.length);
  await page.evaluate(() => window.openGPXImport({}));
  await page.locator('#rt-drop input[type="file"]').setInputFiles({ name: 'hibas.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(invalidGpx) });
  await page.getByText(/hibás koordinátát tartalmaz/, { exact: false }).waitFor();
  assert.equal(await page.evaluate(() => Store.myData().routes.length), countBeforeInvalid);
  assert.equal(await page.locator('#rt-new-trip').count(), 0);
  await page.locator('[data-modal] [data-close]').last().click().catch(() => {});

  // Attaching an imported route keeps the existing planned GPX payload intact.
  await page.evaluate(() => window.openGPXImport({ tripId: 't-v1304-planned' }));
  await page.locator('#rt-drop input[type="file"]').setInputFiles({ name: 'proba-ujra.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(validGpx) });
  await page.locator('#rt-to-trip').waitFor();
  await page.locator('#rt-to-trip').click();
  await page.waitForFunction(id => !!Store.getTour(id).routeId, tourId);
  const linked = await page.evaluate(id => ({ tour: Store.getTour(id), route: Store.myData().routes.find(r => r.id === Store.getTour(id).routeId) }), tourId);
  assert.deepEqual(linked.tour.gpx, plannedGpx);
  assert.equal(linked.route.id, routeId, 'The repeated GPX import must attach the existing route ID.');
  assert.equal(linked.route.linkedTripId, tourId);

  // The organizer-event GPX entry point uses the same V47 route store and fingerprint.
  await page.evaluate(() => {
    Store.platform().organizers.push({ id: 'org-v1304-test', owner: Store.me().email, name: 'Helyi tesztszervező', demo: false });
    Store.save();
    window.e2.evForm();
  });
  await page.locator('#e2f_name').fill('V130.4 helyi GPX tesztesemény');
  await page.locator('#e2f_date').fill('2026-11-01');
  await page.locator('#e2f_place').fill('Csíkszereda');
  await page.locator('#e2f_gpxf').setInputFiles({ name: 'event-proba.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(validGpx) });
  await page.locator('#e2f_gpxprev').getByText(/4 pont \(minta a teljes trackből\)/).waitFor();
  await page.locator('#e2f_save').click();
  const eventRoute = await page.evaluate(() => {
    const event = Store.platform().events.find(item => item.name === 'V130.4 helyi GPX tesztesemény');
    return { event, route: event && Store.myData().routes.find(item => item.id === event.routeId) };
  });
  assert.ok(eventRoute.event);
  assert.equal(eventRoute.event.routeId, routeId);
  assert.equal(eventRoute.route.raw, validGpx);
  assert.equal(eventRoute.route.source_file, 'proba.gpx');

  // GPS recording stays in liveTrack, including when the tour had no planned GPX, and can be exported.
  await page.evaluate(() => window.v120Begin('t-v1304-no-plan'));
  await page.waitForURL(/#\/tura-live\/t-v1304-no-plan$/);
  await page.waitForFunction(() => window.__v1304Geo.watchCalls === 1);
  await page.evaluate(() => window.__v1304GeoSuccess({ coords: { latitude: 46.361, longitude: 25.801, accuracy: 5, altitude: 721 }, timestamp: Date.now() + 30000 }));
  await page.waitForFunction(() => Store.getTour('t-v1304-no-plan').liveTrack.points.length >= 2);
  await page.locator('#v120-finish').click();
  await page.locator('#cfm-yes').click();
  await page.waitForFunction(() => Store.getTour('t-v1304-no-plan').liveTrack.status === 'finished');
  const gpsSaved = await page.evaluate(() => ({ tour: Store.getTour('t-v1304-no-plan'), exportVisible: !!document.querySelector('#v121-gpx-export') }));
  assert.equal(gpsSaved.tour.gpx, null, 'A completed GPS track must not be copied into the planned GPX field.');
  assert.equal(gpsSaved.tour.routeId, null);
  assert.ok(gpsSaved.tour.liveTrack.points.length >= 2);
  assert.equal(gpsSaved.exportVisible, true);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#v121-gpx-export').click();
  const download = await downloadPromise;
  const exported = fs.readFileSync(await download.path(), 'utf8');
  const exportedPoints = await page.evaluate(xml => window.v47parseGPX(xml).track, exported);
  assert.equal(exportedPoints.length, gpsSaved.tour.liveTrack.points.length);
  assert.equal(exportedPoints[0][2], 720);
  assert.ok(exportedPoints[0][3], 'The exported recording retains timestamps.');

  // Existing KML remains an external source link and is not misparsed/imported as GPX.
  const kmlIndex = await page.evaluate(() => v125KnownRoutes().findIndex(route => route.kind === 'esztena'));
  assert.ok(kmlIndex >= 0);
  await page.evaluate(index => window.V125.openKnown(index), kmlIndex);
  await page.getByText(/KML pontforrás/, { exact: false }).waitFor();
  assert.match(await page.locator('[data-modal] a[href$="Esztenak.kml"]').getAttribute('href'), /Esztenak\.kml$/);
  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);
  console.log(JSON.stringify({ status: 'PASS', validAndDuplicateImport: true, sameNameDifferentTrack: true, plannedRouteCollisionSafe: true, eventGpxUsesCommonStore: true, storageFailureAtomic: true, rtept: true,
    stableIdReload: true, metadataPreserved: true, partialElevationUnknown: true, allPointsRetainedInOriginalForLongTracks: true,
    oversizedFilesRejectedWithoutLoss: true, invalidImportAtomic: true,
    plannedGpxPreserved: true, actualGpsTrackSeparateAndExportable: true, kmlSourceUnchanged: true,
    mobile390: true, pageerror: 0, consoleError: 0 }));
  await context.close();
} finally {
  await browser.close();
}
