import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.TT_EDGE_PATH });
const base = (process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/').replace(/#.*$/, '');
const pageErrors = [], consoleErrors = [];
const gpsTourId = 't-v1306-offline';

function seed({ uid, email, tour = null }) {
  if (!localStorage.getItem('turavaros_v1')) {
    const data = { tours: tour ? [tour] : [], routes: [], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
      goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: {}, aiChat: [], templates: [], terepi: [],
      reportAck: {}, challenges: null, widgets: null, inbox: [] };
    localStorage.setItem('turavaros_v1', JSON.stringify({ users: { [uid]: { id: uid, name: 'V130.6 teszt', email, pass: 'local:test', onboarded: true } }, data: { [uid]: data }, session: uid }));
    localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({ offers: { [email]: Date.now() } }));
  }
  const state = window.__v1306Gps = { watchCalls: 0, activeWatches: 0, maxActiveWatches: 0, cloudRequests: 0 };
  const point = (lat, lng, timestamp = Date.now()) => ({ coords: { latitude: lat, longitude: lng, accuracy: 6, altitude: 720 }, timestamp });
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
    getCurrentPosition(success) { success(point(46.36, 25.8)); },
    watchPosition(success) { const id = ++state.watchCalls; state.activeWatches++; state.maxActiveWatches = Math.max(state.maxActiveWatches, state.activeWatches); window.__v1306GeoSuccess = success; return id; },
    clearWatch() { state.activeWatches = Math.max(0, state.activeWatches - 1); }
  } });
}

async function openPage({ uid, email, tour = null, serviceWorkers = 'block', width = 390, height = 844 }) {
  const context = await browser.newContext({ viewport: { width, height }, acceptDownloads: true, serviceWorkers });
  await context.route('**/*.supabase.co/**', route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) consoleErrors.push(message.text()); });
  await page.addInitScript(seed, { uid, email, tour });
  return { context, page };
}

const validGpx = `<?xml version="1.0"?><gpx version="1.1" creator="V130.6 isolated integration" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>V130.6 valós tesztútvonal</name></metadata><trk><name>V130.6 valós tesztútvonal</name><trkseg><trkpt lat="46.36" lon="25.8"><ele>720</ele><time>2026-10-12T06:00:00Z</time></trkpt><trkpt lat="46.361" lon="25.801"><ele>724</ele><time>2026-10-12T06:10:00Z</time></trkpt><trkpt lat="46.362" lon="25.802"><ele>729</ele><time>2026-10-12T06:20:00Z</time></trkpt><trkpt lat="46.363" lon="25.803"><ele>731</ele><time>2026-10-12T06:30:00Z</time></trkpt></trkseg></trk></gpx>`;

try {
  // Flow 1: import GPX -> create/open plan -> GPS -> pause/resume -> finish -> journal/stats -> reopen.
  {
    const { context, page } = await openPage({ uid: 'u-v1306-flow1', email: 'v1306-flow1@test.invalid' });
    await page.goto(base + '#/utvonalak', { waitUntil: 'networkidle' });
    await page.locator('#rt-import').click();
    await page.locator('#rt-drop input[type="file"]').setInputFiles({ name: 'v1306-utvonal.gpx', mimeType: 'application/gpx+xml', buffer: Buffer.from(validGpx) });
    await page.locator('#rt-new-trip').waitFor();
    await page.locator('#rt-name').fill('V130.6 integrációs túraterv');
    await page.locator('#rt-new-trip').click();
    await page.waitForURL(/#\/tura\//);
    const created = await page.evaluate(() => {
      const tour = Store.myData().tours.at(-1), route = Store.myData().routes.find(row => row.id === tour.routeId);
      return { tourId: tour.id, routeId: route.id, title: tour.title, routeRaw: route.raw, routeTrack: structuredClone(route.track), planTrack: structuredClone(tour.gpx?.line || []) };
    });
    assert.equal(created.title, 'V130.6 integrációs túraterv');
    assert.equal(created.routeRaw, validGpx);
    assert.equal(created.routeTrack.length, 4);

    await page.goto(base + '#/utvonalak', { waitUntil: 'networkidle' });
    await page.locator(`[data-open="${created.routeId}"]`).click();
    const routeDetail = await page.locator('[data-modal]').last().innerText();
    assert.match(routeDetail, /V130\.6 integrációs túraterv/);
    await page.locator(`[data-modal] a[href="#/tura/${created.tourId}"]`).last().click();
    await page.waitForURL(new RegExp('#/tura/' + created.tourId + '$'));
    await page.locator('#v129-gps-start').click();
    await page.waitForURL(new RegExp('#/tura-live/' + created.tourId + '$'));
    await page.waitForFunction(() => typeof window.__v1306GeoSuccess === 'function');
    const plannedBefore = await page.evaluate(id => ({ route: structuredClone(Store.myData().routes.find(r => r.id === Store.getTour(id).routeId)), gpx: structuredClone(Store.getTour(id).gpx) }), created.tourId);

    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.361, longitude: 25.801, accuracy: 6, altitude: 724 }, timestamp: Date.now() + 30000 }));
    await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 2, created.tourId);
    await page.locator('#v120-pause').click();
    await page.waitForFunction(id => Store.getTour(id).liveTrack.status === 'paused', created.tourId);
    const pausedCount = await page.evaluate(id => Store.getTour(id).liveTrack.points.length, created.tourId);
    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.362, longitude: 25.802, accuracy: 6, altitude: 729 }, timestamp: Date.now() + 45000 }));
    assert.equal(await page.evaluate(id => Store.getTour(id).liveTrack.points.length, created.tourId), pausedCount, 'GPS samples during pause must not enter the track.');
    await page.locator('#v120-resume').click();
    await page.waitForFunction(() => window.__v1306Gps.watchCalls >= 2);
    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.362, longitude: 25.802, accuracy: 6, altitude: 729 }, timestamp: Date.now() + 60000 }));
    await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 3, created.tourId);
    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.363, longitude: 25.803, accuracy: 6, altitude: 731 }, timestamp: Date.now() + 90000 }));
    await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 4, created.tourId);
    await page.locator('#v120-finish').click();
    await page.locator('#cfm-yes').click();
    await page.waitForFunction(id => Store.getTour(id).liveTrack.status === 'finished' && Store.myData().journal.some(j => j.tourId === id && j.metricSource === 'gps'), created.tourId);
    const finished = await page.evaluate(id => {
      const tour = Store.getTour(id), journal = Store.myData().journal.find(j => j.tourId === id), stats = Store.stats();
      return { tour: structuredClone(tour), journal: structuredClone(journal), stats: { tours: stats.tours, km: stats.km, h: stats.h } };
    }, created.tourId);
    assert.deepEqual(finished.tour.gpx, plannedBefore.gpx, 'GPS finish must preserve the planned GPX payload.');
    assert.equal(finished.tour.routeId, created.routeId);
    assert.ok(finished.tour.liveTrack.points.length >= 4);
    assert.ok(finished.journal.km > 0 && finished.journal.metricSource === 'gps');
    assert.ok(Math.abs(finished.journal.km - finished.tour.liveTrack.summary.distanceKm) < 0.000001);
    assert.equal(finished.stats.tours, 1);
    assert.ok(Math.abs(finished.stats.km - finished.journal.km) < 0.000001);

    await page.locator('#v130-journal').click();
    await page.locator('#mm-story').fill('Saját integrációs naplóbejegyzés.');
    await page.locator('#mm-save').click();
    await page.locator('#mm-view').click();
    await page.waitForURL(/#\/naplo$/);
    await page.locator('.mem').filter({ hasText: 'V130.6 integrációs túraterv' }).waitFor();
    assert.match(await page.locator('.mem').filter({ hasText: 'V130.6 integrációs túraterv' }).innerText(), /Saját integrációs naplóbejegyzés/);
    await page.goto(base + '#/statisztikak', { waitUntil: 'networkidle' });
    const statsAfterReload = await page.evaluate(() => ({ stats: Store.stats(), tourCount: Store.myData().tours.length, journalCount: Store.myData().journal.length }));
    assert.equal(statsAfterReload.stats.tours, 1);
    assert.ok(Math.abs(statsAfterReload.stats.km - finished.journal.km) < 0.000001);
    await page.reload({ waitUntil: 'networkidle' });
    const reopened = await page.evaluate(id => ({ tour: Store.getTour(id), route: Store.myData().routes.find(r => r.id === Store.getTour(id).routeId), journal: Store.myData().journal.find(j => j.tourId === id) }), created.tourId);
    assert.equal(reopened.route.id, created.routeId);
    assert.equal(reopened.route.raw, validGpx);
    assert.deepEqual(reopened.route.track, plannedBefore.route.track);
    assert.deepEqual(reopened.tour.gpx, plannedBefore.gpx);
    assert.equal(reopened.journal.note, 'Saját integrációs naplóbejegyzés.');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await context.close();
  }

  // Flow 2: online GPS capture -> offline reload/continue -> online return, with local data unchanged.
  {
    const tour = { id: gpsTourId, title: 'V130.6 offline GPS-túra', place: 'Csíkszereda', status: 'tervezés', projectStatus: 'TERVEZETT',
      date: '', startTime: '', difficulty: '', lengthKm: null, ascent: null, durationH: null, coords: { lat: 46.36, lng: 25.8 },
      routeId: null, gpx: null, routeStart: null, routeEnd: null, timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [], waypoints: [] };
    const { context, page } = await openPage({ uid: 'u-v1306-flow2', email: 'v1306-flow2@test.invalid', tour, serviceWorkers: 'allow' });
    await page.goto(base + '#/tura/' + gpsTourId, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.Store && window.App);
    await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration())?.active, { timeout: 15000 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 15000 });
    await page.locator('#v129-gps-start').click();
    await page.waitForURL(new RegExp('#/tura-live/' + gpsTourId + '$'));
    await page.waitForFunction(() => typeof window.__v1306GeoSuccess === 'function');
    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.361, longitude: 25.801, accuracy: 6, altitude: 724 }, timestamp: Date.now() + 30000 }));
    await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 2, gpsTourId);
    const onlineState = await page.evaluate(id => ({
      tour: structuredClone(Store.getTour(id)), user: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1306-flow2'],
      backup: JSON.parse(localStorage.getItem('turatars_v121_active'))
    }), gpsTourId);
    assert.ok(onlineState.backup?.liveTrack?.points?.length >= 2, 'V121 should keep a local active-track backup.');

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Store && window.App && document.querySelector('#v120-root'));
    await page.waitForFunction(() => typeof window.__v1306GeoSuccess === 'function');
    const offlineReload = await page.evaluate(id => ({
      tour: structuredClone(Store.getTour(id)), user: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1306-flow2'],
      backup: JSON.parse(localStorage.getItem('turatars_v121_active')),
      banner: getComputedStyle(document.querySelector('#v121-offline')).display !== 'none' && !document.querySelector('#v121-offline').hidden
    }), gpsTourId);
    assert.deepEqual(offlineReload.user, onlineState.user, 'Offline boot must not reset or replace the local user store.');
    assert.deepEqual(offlineReload.tour.liveTrack.points, onlineState.tour.liveTrack.points);
    assert.deepEqual(offlineReload.backup.liveTrack, onlineState.backup.liveTrack);
    await page.evaluate(() => window.__v1306GeoSuccess({ coords: { latitude: 46.362, longitude: 25.802, accuracy: 6, altitude: 729 }, timestamp: Date.now() + 60000 }));
    await page.waitForFunction(id => Store.getTour(id).liveTrack.points.length >= 3, gpsTourId);
    const offlineContinued = await page.evaluate(id => ({ tour: structuredClone(Store.getTour(id)), user: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1306-flow2'] }), gpsTourId);
    assert.equal(offlineContinued.tour.liveTrack.points.length, onlineState.tour.liveTrack.points.length + 1);
    assert.deepEqual(offlineContinued.tour.liveTrack.points.slice(0, onlineState.tour.liveTrack.points.length), onlineState.tour.liveTrack.points);
    assert.equal(offlineContinued.tour.liveTrack.status, 'running');

    await context.setOffline(false);
    await page.reload({ waitUntil: 'networkidle' });
    const onlineAgain = await page.evaluate(id => ({ tour: Store.getTour(id), user: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1306-flow2'] }), gpsTourId);
    assert.equal(onlineAgain.tour.liveTrack.points.length, offlineContinued.tour.liveTrack.points.length);
    assert.deepEqual(onlineAgain.user, offlineContinued.user);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await context.close();
  }

  // Flow 3: cloud restore -> successful save -> parallel CAS conflict -> network failure; all local edits remain.
  {
    const { context, page } = await openPage({ uid: 'u-v1306-flow3', email: 'v1306-flow3@test.invalid' });
    await page.goto(base + '#/', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__V54 && window.Store);
    await page.evaluate(() => {
      const email = Store.me().email;
      Store.newTourFromDraft({ title: 'Helyi terv', place: 'Csíkszereda', lengthKm: 8 });
      const snap = JSON.parse(JSON.stringify(__V54.build(email)));
      snap.data.tours[0].title = 'Felhőből visszaállított terv';
      window.__v1306Cloud = { remote: { snap, version: 9 }, loads: 0, writes: [], mode: 'normal', hold: false, release: null };
      Object.assign(__V54.st(), { uid: Store.me().id, token: 'isolated-v1306-session', email, provider: 'supabase-snapshot', remoteVersion: null, saveSafety: 'unknown' });
      window.__TT_SUPABASE_ADAPTER.load = async () => {
        const audit = window.__v1306Cloud; audit.loads++;
        if (audit.mode === 'load-error') throw { error: 'network' };
        return JSON.parse(JSON.stringify(audit.remote));
      };
      window.__TT_SUPABASE_ADAPTER.save = async (token, snapshot, expected) => {
        const audit = window.__v1306Cloud;
        audit.writes.push({ expected, snapshot: JSON.parse(JSON.stringify(snapshot)) });
        if (audit.hold) await new Promise(resolve => { audit.release = resolve; });
        if (expected !== audit.remote.version) throw { error: 'version_conflict' };
        audit.remote = { snap: JSON.parse(JSON.stringify(snapshot)), version: expected + 1 };
        return { ok: true, version: audit.remote.version };
      };
      sessionStorage.setItem('tv-prompted', '1'); location.hash = '#/profil';
    });
    await page.locator('#c54-save').waitFor();
    const cloudBefore = await page.evaluate(() => JSON.stringify(__v1306Cloud.remote));
    for (let n = 1; n <= 2; n++) {
      await page.locator('#c54-save').click();
      await page.waitForFunction(count => __v1306Cloud.loads === count && __V54.st().saveSafety === 'restore_required', n);
    }
    assert.equal(await page.evaluate(() => __v1306Cloud.writes.length), 0, 'Repeated pre-restore saves must not reach the cloud write adapter.');
    assert.equal(await page.evaluate(() => JSON.stringify(__v1306Cloud.remote)), cloudBefore);

    const localBeforeFailedRestore = await page.evaluate(() => Store.exportData());
    await page.evaluate(() => {
      window.__v1306OriginalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) { if (key === 'turatars_v54_pre1') throw new Error('Injected isolated backup failure'); return window.__v1306OriginalSetItem.call(this, key, value); };
    });
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#c54-load').click();
    await page.waitForFunction(() => __V54.st().saveSafety === 'error');
    await page.locator('#c54-save').click();
    await page.waitForFunction(() => __V54.st().saveSafety === 'restore_required');
    assert.equal(await page.evaluate(() => __v1306Cloud.writes.length), 0);
    assert.equal(await page.evaluate(() => Store.exportData()), localBeforeFailedRestore);
    await page.evaluate(() => Storage.prototype.setItem = window.__v1306OriginalSetItem);
    page.once('dialog', dialog => dialog.accept());
    await page.locator('#c54-load').click();
    await page.waitForFunction(() => __V54.st().saveSafety === 'ready');
    assert.equal(await page.evaluate(() => Store.myData().tours[0].title), 'Felhőből visszaállított terv');

    await page.evaluate(() => Store.updateTour(Store.myData().tours[0].id, { notes: 'Ellenőrzött helyi módosítás' }));
    await page.locator('#c54-save').click();
    await page.waitForFunction(() => __v1306Cloud.writes.length === 1 && __V54.st().status === 'saved');
    assert.equal(await page.evaluate(() => __v1306Cloud.writes[0].expected), 9);
    assert.equal(await page.evaluate(() => __v1306Cloud.remote.snap.data.tours[0].notes), 'Ellenőrzött helyi módosítás');

    await page.evaluate(() => {
      const audit = window.__v1306Cloud, oldVersion = audit.remote.version;
      audit.hold = true; audit.parallelDone = false;
      const snapshot = __V54.build(Store.me().email);
      window.__v1306Parallel = Promise.allSettled([__V54.api.save(snapshot), __V54.api.save(snapshot)]).then(result => { audit.parallel = result.map(x => x.status); audit.parallelDone = true; });
      audit.parallelExpected = oldVersion;
    });
    await page.waitForFunction(() => __v1306Cloud.writes.length === 2 && typeof __v1306Cloud.release === 'function');
    await page.evaluate(() => {
      const audit = window.__v1306Cloud;
      audit.remote = { snap: structuredClone(audit.remote.snap), version: audit.remote.version + 1 };
      audit.remote.snap.data.tours[0].notes = 'Másik kliens módosítása';
      audit.release(); audit.hold = false;
    });
    await page.waitForFunction(() => __v1306Cloud.parallelDone);
    const race = await page.evaluate(() => ({ remote: __v1306Cloud.remote, local: Store.myData().tours[0].notes, writes: __v1306Cloud.writes.length, statuses: __v1306Cloud.parallel }));
    assert.equal(race.writes, 2, 'Only one of the parallel calls may reach the adapter.');
    assert.equal(race.remote.snap.data.tours[0].notes, 'Másik kliens módosítása', 'A newer remote snapshot must not be overwritten.');
    assert.equal(race.local, 'Ellenőrzött helyi módosítás', 'Conflict must retain the local edit for user resolution.');
    assert.ok(race.statuses.includes('rejected') || race.statuses.includes('fulfilled'));

    await page.evaluate(() => {
      const audit = window.__v1306Cloud;
      audit.mode = 'load-error';
      window.__TT_SUPABASE_ADAPTER.load = async () => { audit.loads++; throw { error: 'network' }; };
    });
    await page.locator('#c54-save').click();
    await page.waitForFunction(() => __V54.st().status === 'error');
    const afterNetworkError = await page.evaluate(() => ({ local: Store.myData().tours[0].notes, writes: __v1306Cloud.writes.length, cloud: __v1306Cloud.remote.snap.data.tours[0].notes }));
    assert.equal(afterNetworkError.local, 'Ellenőrzött helyi módosítás');
    assert.equal(afterNetworkError.cloud, 'Másik kliens módosítása');
    assert.equal(afterNetworkError.writes, 2, 'A network failure during remote verification must not write.');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await context.close();
  }

  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(consoleErrors, [], consoleErrors.join('\n'));
  console.log(JSON.stringify({ status: 'PASS', flows: [
    'GPX import -> route detail -> planned tour -> GPS pause/resume/finish -> GPS journal and actual stats -> reload/reopen',
    'online GPS -> offline reload/continued GPS -> online return without local data loss',
    'isolated cloud restore -> verified save -> parallel optimistic-version conflict -> network error without overwrite',
  ], mobile390: true, pageerror: 0, consoleError: 0, realCloudWrites: 0 }, null, 2));
} finally {
  await browser.close();
}
