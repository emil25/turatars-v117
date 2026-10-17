import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { chromium } = await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.TT_EDGE_PATH });
const base = (process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/').replace(/#.*$/, '');
const pageErrors = [], consoleErrors = [];

function source(file) {
  return fs.readFileSync(path.join(root, 'app', 'js', file), 'utf8');
}

async function openTestPage(id, route, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/*.supabase.co/**', request => request.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text());
  });
  await page.addInitScript(({ id, options }) => {
    const plannedGpx = {
      name: 'Megőrzendő tervezett útvonal',
      pts: [{ lat: 46.36, lng: 25.8, ele: null, time: null }, { lat: 46.37, lng: 25.81, ele: null, time: null }],
      line: [[46.36, 25.8], [46.37, 25.81]], elev: []
    };
    const tour = {
      id, title: 'V130.3 GPS indítás ellenőrzése', place: 'Csíkszereda', status: 'tervezés', projectStatus: 'TERVEZETT',
      date: '2026-10-20', startTime: '08:00', difficulty: 'Közepes', lengthKm: 2, ascent: null, durationH: 1,
      coords: { lat: 46.36, lng: 25.8 }, routeId: 'rt-' + id,
      routeStart: { lat: 46.36, lng: 25.8, label: 'Csíkszereda' }, routeEnd: { lat: 46.37, lng: 25.81, label: 'Célpont' },
      gpx: plannedGpx, timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [],
      tasks: [], budget: [], packList: [], projectGearIds: [], tags: []
    };
    const route = { id: 'rt-' + id, name: 'Teszt útvonal', source: 'openrouteservice', track: [[46.36, 25.8, null, null], [46.37, 25.81, null, null]] };
    const data = { tours: [tour], routes: [route], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
      goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: {}, aiChat: [], templates: [],
      terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [] };
    localStorage.setItem('turavaros_v1', JSON.stringify({
      users: { 'u-v1303': { id: 'u-v1303', name: 'V130.3 Teszt', email: 'v1303@test.local', pass: 'local:test', onboarded: true } },
      data: { 'u-v1303': data }, session: 'u-v1303'
    }));
    localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({ offers: { 'v1303@test.local': Date.now() } }));
    const state = window.__gpsTest = { currentCalls: 0, watchCalls: 0, activeWatches: 0, maxActiveWatches: 0, cleared: [] };
    const point = (lat, lng, timestamp = Date.now()) => ({ coords: { latitude: lat, longitude: lng, accuracy: 8, altitude: 520 }, timestamp });
    const geo = {
      getCurrentPosition(success, error) {
        state.currentCalls++;
        if (options.denied) { error({ code: 1 }); return; }
        if (options.deferPermission) { window.__gpsResolve = success; return; }
        success(point(46.36, 25.8));
      },
      watchPosition(success) {
        const watchId = ++state.watchCalls;
        state.activeWatches++;
        state.maxActiveWatches = Math.max(state.maxActiveWatches, state.activeWatches);
        window.__geoSuccess = success;
        return watchId;
      },
      clearWatch(watchId) {
        if (!state.cleared.includes(watchId)) { state.cleared.push(watchId); state.activeWatches--; }
      }
    };
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: options.noGeolocation ? undefined : geo });
  }, { id, options });
  await page.goto(base + '#/' + route, { waitUntil: 'domcontentloaded' });
  await page.locator('#view').waitFor({ state: 'visible' });
  await page.waitForFunction(() => {
    const view = document.querySelector('#view');
    return Boolean(view && view.childElementCount > 0);
  });
  if (route === 'vezerlopult') await page.locator('button[data-center-gps]').waitFor({ state: 'visible' });
  if (route.startsWith('tura/')) await page.locator('#v120-start').waitFor({ state: 'visible' });
  await page.locator('[data-modal]').evaluateAll(elements => elements.forEach(element => element.remove()));
  return { context, page };
}

async function assertPublicEntry(page) {
  assert.equal(await page.evaluate(() => typeof window.v120Begin), 'function', 'The common V120 entry must be public in the built app.');
  assert.equal(await page.evaluate(() => window.v120Begin === window.__V120.begin), true, 'Legacy and documented entry points must be the same function.');
}

async function assertStarted(page, id) {
  await page.waitForURL(new RegExp('#/tura-live/' + id + '$'));
  await page.locator('#v120-root').waitFor();
  await page.waitForFunction(expected => window.__gpsTest.watchCalls >= expected, 1);
  assert.equal(await page.evaluate(() => Store.getTour(location.hash.split('/').at(-1)).liveTrack.status), 'running');
}

try {
  // Static wiring audit: each existing GPS launch surface delegates to the common V120 function.
  assert.match(source('v120.js'), /window\.v120Begin=v120Begin/);
  assert.match(source('v120.js'), /window\.v120Begin\(id\)/, 'The original GPS button must call the public entry.');
  assert.match(source('v129.js'), /window\.v120Begin\(t\.id\)/);
  assert.match(source('dashboard.js'), /window\.v120Begin\(b\.dataset\.centerGps\)/);
  assert.match(source('v125.js'), /window\.v120Begin\(own\.id\)/);
  assert.match(source('v127.js'), /window\.v120Begin\(t\.id\)/);
  assert.match(source('v128.js'), /window\.v120Begin\(t\.id\)/);
  assert.match(source('public.js'), /window\.v125StartCatalogTour\(t\.id\)/);

  // Original project button: a pending permission prompt absorbs repeated clicks.
  const id = 't-v1303-original';
  const original = await openTestPage(id, 'tura/' + id, { deferPermission: true });
  const page = original.page;
  await assertPublicEntry(page);
  const plannedBefore = await page.evaluate(id => structuredClone(Store.getTour(id).gpx), id);
  await page.locator('#v120-start').click();
  await page.locator('#v120-start').click();
  assert.equal(await page.evaluate(() => window.__gpsTest.currentCalls), 1, 'A repeated click must not request a second GPS start.');
  await page.evaluate(() => window.__gpsResolve({ coords: { latitude: 46.36, longitude: 25.8, accuracy: 8, altitude: 520 }, timestamp: Date.now() }));
  await assertStarted(page, id);
  assert.deepEqual(await page.evaluate(id => Store.getTour(id).gpx, id), plannedBefore, 'Starting GPS must preserve the planned GPX.');
  await page.evaluate(() => window.__geoSuccess({ coords: { latitude: 46.361, longitude: 25.801, accuracy: 8, altitude: 521 }, timestamp: Date.now() + 30000 }));
  await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 2, id);

  await page.locator('#v120-pause').click();
  await page.waitForFunction(id => Store.getTour(id).liveTrack.status === 'paused', id);
  assert.equal(await page.evaluate(() => window.__gpsTest.activeWatches), 0);
  await page.locator('#v120-resume').click();
  await page.waitForFunction(() => Store.getTour('t-v1303-original').liveTrack.status === 'running' && window.__gpsTest.watchCalls === 2);
  assert.equal(await page.evaluate(() => window.__gpsTest.maxActiveWatches), 1, 'Pause/resume must not leave parallel GPS watches.');
  await page.evaluate(() => window.__geoSuccess({ coords: { latitude: 46.362, longitude: 25.802, accuracy: 8, altitude: 522 }, timestamp: Date.now() + 60000 }));
  await page.locator('#v120-finish').click();
  await page.locator('#cfm-yes').click();
  await page.waitForFunction(() => Store.getTour('t-v1303-original').liveTrack.status === 'finished');
  const finished = await page.evaluate(id => ({ tour: Store.getTour(id), gps: window.__gpsTest }), id);
  assert.deepEqual(finished.tour.gpx, plannedBefore, 'Finishing GPS must preserve the planned GPX.');
  assert.equal(finished.tour.routeId, 'rt-' + id);
  assert.ok(finished.tour.liveTrack.points.length >= 3, 'Recorded GPS points remain in the existing liveTrack.');
  assert.equal(finished.gps.maxActiveWatches, 1);
  assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);
  await original.context.close();

  // The V129 project entry and dashboard entry both use the same public V120 start path.
  for (const [entryId, route, selector] of [
    ['t-v1303-project', 'tura/t-v1303-project', '#v129-gps-start'],
    ['t-v1303-dashboard', 'vezerlopult', 'button[data-center-gps]']
  ]) {
    const test = await openTestPage(entryId, route);
    await assertPublicEntry(test.page);
    await test.page.locator(selector).click();
    await assertStarted(test.page, entryId);
    assert.equal(await test.page.evaluate(() => window.__gpsTest.currentCalls), 1);
    if (selector === '#v129-gps-start') {
      const existingPoints = await test.page.evaluate(id => structuredClone(Store.getTour(id).liveTrack.points), entryId);
      await test.page.evaluate(id => { location.hash = '#/tura/' + id; }, entryId);
      await test.page.locator('#v129-gps-start').click();
      await test.page.waitForURL(new RegExp('#/tura-live/' + entryId + '$'));
      assert.equal(await test.page.evaluate(() => window.__gpsTest.currentCalls), 1, 'A running tour cannot be reset by another launch button.');
      assert.deepEqual(await test.page.evaluate(id => Store.getTour(id).liveTrack.points, entryId), existingPoints);
    }
    await test.context.close();
  }

  // Catalog launch helper is the target used by the visible #tm-gps control.
  const catalog = await openTestPage('t-v1303-catalog-base', '', {});
  await assertPublicEntry(catalog.page);
  const catalogId = await catalog.page.evaluate(() => window.v122PublicTours()[0].id);
  await catalog.page.evaluate(id => window.v125StartCatalogTour(id), catalogId);
  await catalog.page.waitForURL(/#\/tura-live\//);
  await catalog.page.waitForFunction(() => window.__gpsTest.watchCalls === 1);
  assert.equal(await catalog.page.evaluate(() => window.__gpsTest.currentCalls), 1);
  await catalog.context.close();

  // Permission denial and browsers without Geolocation fail safely with readable feedback.
  for (const [errorId, options, expected] of [
    ['t-v1303-denied', { denied: true }, 'A helymeghatározási engedély szükséges'],
    ['t-v1303-unavailable', { noGeolocation: true }, 'nem érhető el a helymeghatározás']
  ]) {
    const test = await openTestPage(errorId, 'tura/' + errorId, options);
    await test.page.locator('#v120-start').click();
    await test.page.getByText(expected, { exact: false }).waitFor();
    assert.equal(await test.page.evaluate(id => !!Store.getTour(id).liveTrack, errorId), false, 'GPS errors must not create a running track.');
    assert.deepEqual(pageErrors, []);
    await test.context.close();
  }

  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  console.log(JSON.stringify({ status: 'PASS', launchEntrypoints: ['original', 'V129 project', 'dashboard', 'catalog'], permissionErrors: 2,
    repeatedStartBlocked: true, sameV120Flow: true, pauseResume: true, plannedGpxPreserved: true, mobile390: true, pageerror: 0, consoleError: 0 }));
} finally {
  await browser.close();
}
