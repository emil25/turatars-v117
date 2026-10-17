import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(testDir, '..', 'dist');
const workerFile = path.join(buildDir, 'sw.js');
const edgePath = process.env.TT_EDGE_PATH || process.env.V130_EDGE_PATH;
const playwrightPath = process.env.TT_PLAYWRIGHT_PATH || process.env.V130_PLAYWRIGHT_PATH;
assert.ok(edgePath && playwrightPath, 'Offline startup browser gate needs the configured Edge/Playwright paths.');
const { chromium } = await import(pathToFileURL(playwrightPath).href);
const basePath = '/turatars-v117/';
const legacyCacheName = 'turatears-v130-atlas-1';
const unrelatedCacheName = 'unrelated-test-cache-must-survive';
const mimeTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8', '.webp': 'image/webp',
};

// This isolated fixture mirrors the deployed V130 worker lifecycle for the update regression.
const legacyWorker = `
const V='turatears-v130-atlas-1';
const SHELL=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;if(u.origin===self.location.origin)e.respondWith((async()=>{const c=await caches.open(V);const net=await fetch(e.request).catch(()=>null);if(net&&net.ok){c.put(e.request,net.clone());return net;}const hit=await c.match(e.request);if(hit)return hit;if(e.request.mode==='navigate')return c.match('./index.html');return new Response('offline');})());});
`;

function seedLocalTour() {
  if (localStorage.getItem('turavaros_v1')) return;
  const tour = {
    id: 't-v1302-offline', title: 'Offline GPS próba', place: 'Csíkszereda', status: 'tervezés', projectStatus: 'TERVEZETT',
    date: '', startTime: '', difficulty: 'Közepes', lengthKm: 2, ascent: null, durationH: 1, coords: { lat: 46.36, lng: 25.8 },
    routeId: null, routeStart: null, routeEnd: null, gpx: null, timeline: [], gear: [], participants: [], cars: [], food: [],
    safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [],
  };
  const data = {
    tours: [tour], routes: [], wishlist: [], savedEvents: [], equipment: [], journal: [], teams: [],
    goals: { km: 300, tours: 12, summits: 3 }, notifDismiss: [], prefs: { weather: false, reminders: false },
    aiChat: [], templates: [], terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [],
  };
  localStorage.setItem('turavaros_v1', JSON.stringify({
    users: { 'u-v1302': { id: 'u-v1302', name: 'Offline teszt', email: 'offline-v1302@test.invalid', pass: 'local:test', onboarded: true } },
    data: { 'u-v1302': data }, session: 'u-v1302',
  }));
  const position = (lat, lng, timestamp = Date.now()) => ({ coords: { latitude: lat, longitude: lng, accuracy: 8, altitude: 1200 }, timestamp });
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: {
    getCurrentPosition(success) { success(position(46.36, 25.8)); },
    watchPosition(success) {
      window.__v1302GeoSuccess = success;
      if (!localStorage.getItem('__v1302_test_points_sent')) {
        localStorage.setItem('__v1302_test_points_sent', '1');
        success(position(46.36, 25.8, Date.now() + 10000));
        setTimeout(() => success(position(46.361, 25.801, Date.now() + 30000)), 20);
      }
      return 17;
    },
    clearWatch() {},
  } });
}

let workerMode = 'current';
const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', 'http://127.0.0.1');
  if (url.pathname === '/offline-probe.html') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('<!doctype html><title>offline probe</title><p>outside service worker scope</p>');
    return;
  }
  if (!url.pathname.startsWith(basePath)) {
    response.writeHead(404); response.end('Not found'); return;
  }
  const relativePath = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\/+/, '') || 'index.html';
  if (relativePath === 'sw.js') {
    response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(workerMode === 'legacy' ? legacyWorker : await readFile(workerFile, 'utf8'));
    return;
  }
  const file = path.resolve(buildDir, relativePath);
  if (file !== buildDir && !file.startsWith(buildDir + path.sep)) { response.writeHead(403); response.end(); return; }
  try {
    const info = await stat(file);
    const target = info.isDirectory() ? path.join(file, 'index.html') : file;
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(await readFile(target));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); response.end('Not found');
  }
});
async function listenOnBrowserSafePort() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const port = 42000 + Math.floor(Math.random() * 7000);
    try {
      await new Promise((resolve, reject) => {
        const onListening = () => { server.off('error', onError); resolve(); };
        const onError = error => { server.off('listening', onListening); reject(error); };
        server.once('listening', onListening);
        server.once('error', onError);
        server.listen(port, '127.0.0.1');
      });
      return;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error;
    }
  }
  throw new Error('Could not allocate an available browser-safe test port.');
}
await listenOnBrowserSafePort();
const origin = `http://127.0.0.1:${server.address().port}`;
const appUrl = `${origin}${basePath}`;
const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const pageErrors = [];
const ownConsoleErrors = [];

async function newContext() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(`(${seedLocalTour.toString()})();
    window.__v1302OwnConsoleErrors = [];
    const original = console.error.bind(console);
    console.error = (...args) => { window.__v1302OwnConsoleErrors.push(args.map(String).join(' ')); original(...args); };`);
  await context.route(/^https:\/\//, route => route.abort());
  return context;
}

async function observe(page) {
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(message.text())) ownConsoleErrors.push(message.text());
  });
  page.on('dialog', dialog => dialog.accept());
  page.setDefaultTimeout(15000);
  await page.addLocatorHandler(page.locator('#v4_later'), button => button.click());
}

async function startRealLocalGps(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.Store && window.__V54);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.locator('#v120-start').click();
  await page.waitForURL(/#\/tura-live\/t-v1302-offline/);
  await page.waitForFunction(() => {
    const db = JSON.parse(localStorage.getItem('turavaros_v1'));
    return (db.data['u-v1302'].tours[0].liveTrack?.points?.length || 0) >= 3;
  });
}

try {
  // Initial online visit: real V130 GPS code writes deterministic test-only geolocation points locally.
  const firstContext = await newContext();
  const firstPage = await firstContext.newPage(); await observe(firstPage);
  await startRealLocalGps(firstPage, `${appUrl}?design=atlas#/tura/t-v1302-offline`);
  const shell = await firstPage.evaluate(async () => {
    const response = await fetch('./precache-manifest.json');
    const manifest = await response.json();
    const cache = await caches.open(manifest.cacheName);
    const required = await Promise.all(manifest.required.map(async path => {
      const request = new URL(path, location.href);
      const hit = await cache.match(request);
      return { path, cached: !!hit, type: hit?.headers.get('content-type') || null };
    }));
    return { manifest, required };
  });
  assert.match(shell.manifest.cacheName, /^turatars-v130\.2-[a-f0-9]{12}$/);
  assert.ok(shell.required.some(asset => asset.path.endsWith('.js') && asset.cached && /javascript/i.test(asset.type || '')));
  assert.ok(shell.required.some(asset => asset.path.endsWith('.css') && asset.cached && /css/i.test(asset.type || '')));
  assert.ok(shell.required.every(asset => asset.cached), 'Every required HTML/module/CSS asset must be cached after first online load.');

  const beforeOffline = await firstPage.evaluate(() => ({
    userData: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1302'],
    backup: JSON.parse(localStorage.getItem('turatars_v121_active')),
    pointCount: Store.myData().tours[0].liveTrack.points.length,
  }));
  assert.ok(beforeOffline.backup?.liveTrack?.points?.length >= 2, 'The test GPS track must have its V121 local safety backup.');

  // Offline reload is the reported production failure trigger.
  await firstContext.setOffline(true);
  await firstPage.reload({ waitUntil: 'domcontentloaded' });
  await firstPage.waitForFunction(() => window.Store && document.querySelector('#v120-root'));
  const afterOffline = await firstPage.evaluate(() => ({
    userData: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1302'],
    backup: JSON.parse(localStorage.getItem('turatars_v121_active')),
    pointCount: Store.myData().tours[0].liveTrack.points.length,
    displayedPoints: document.querySelector('#v130-points')?.textContent,
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    ownErrors: window.__v1302OwnConsoleErrors,
  }));
  assert.deepEqual(afterOffline.userData, beforeOffline.userData, 'Offline reload must preserve all local user data and the complete GPS track.');
  assert.equal(afterOffline.backup.tourId, beforeOffline.backup.tourId);
  assert.deepEqual(afterOffline.backup.liveTrack, beforeOffline.backup.liveTrack, 'Offline reload must preserve every backed-up GPS point and live-track value.');
  assert.ok(afterOffline.backup.updatedAt >= beforeOffline.backup.updatedAt);
  assert.equal(afterOffline.pointCount, beforeOffline.pointCount);
  assert.equal(Number(afterOffline.displayedPoints), beforeOffline.pointCount, 'The offline GPS screen must render the preserved point count.');
  assert.ok(afterOffline.width <= afterOffline.viewport && afterOffline.viewport === 390);
  assert.deepEqual(afterOffline.ownErrors, []);
  assert.equal(await firstPage.evaluate(() => !!window.App), true, 'The application controller must initialize offline.');

  // Closing and reopening a page offline, including the SPA main entry path, must still boot.
  await firstPage.close();
  const reopened = await firstContext.newPage(); await observe(reopened);
  await reopened.goto(`${appUrl}?design=atlas#/`, { waitUntil: 'domcontentloaded' });
  await reopened.waitForFunction(() => window.Store && window.App && document.querySelector('#site-header'));
  assert.equal(await reopened.evaluate(() => Store.myData().tours[0].liveTrack.points.length), beforeOffline.pointCount);

  // Missing optional media cannot decide whether the core app runs.
  const optionalFailure = await reopened.evaluate(async () => {
    const image = new Image();
    const failed = new Promise(resolve => { image.onerror = () => resolve(true); image.onload = () => resolve(false); });
    image.src = './photos/not-a-real-optional-test-image.jpg'; document.body.append(image);
    const imageFailed = await failed;
    return { imageFailed, appBooted: !!window.Store && !!window.App, tours: Store.myData().tours.length };
  });
  assert.deepEqual(optionalFailure, { imageFailed: true, appBooted: true, tours: 1 });
  await firstContext.setOffline(false);
  await reopened.reload({ waitUntil: 'domcontentloaded' });
  await reopened.waitForFunction(() => window.Store && window.App);
  assert.equal(await reopened.evaluate(() => navigator.onLine), true, 'Returning online restores normal app operation.');
  await firstContext.close();

  // Worker update regression: an active V130 client retains its worker/cache until it closes.
  workerMode = 'legacy';
  const updateContext = await newContext();
  const updatePage = await updateContext.newPage(); await observe(updatePage);
  await startRealLocalGps(updatePage, `${appUrl}?design=atlas#/tura/t-v1302-offline`);
  await updatePage.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 15000 });
  const legacyPresent = await updatePage.evaluate(async name => (await caches.keys()).includes(name), legacyCacheName);
  assert.equal(legacyPresent, true, 'The old release cache must exist before the update test.');
  await updatePage.evaluate(async name => {
    const cache = await caches.open(name);
    await cache.put('/unrelated-test-entry', new Response('preserve unrelated cache'));
  }, unrelatedCacheName);
  const localBeforeUpdate = await updatePage.evaluate(() => JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1302']);

  workerMode = 'current';
  await updatePage.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
  await updatePage.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const name = (await caches.keys()).find(key => key.startsWith('turatars-v130.2-'));
    if (!name) return false;
    const cache = await caches.open(name);
    const response = await cache.match(new URL('precache-manifest.json', registration.scope).href);
    if (!response) return false;
    const manifest = await response.json();
    const complete = await Promise.all(manifest.required.map(path => cache.match(new URL(path, registration.scope).href)));
    return complete.every(Boolean) && (!registration.installing || registration.installing.state === 'installed' || !!registration.waiting);
  });
  const updateState = await updatePage.evaluate(async name => ({
    waiting: !!(await navigator.serviceWorker.getRegistration()).waiting,
    activeState: (await navigator.serviceWorker.getRegistration()).active?.state,
    installingState: (await navigator.serviceWorker.getRegistration()).installing?.state,
    controller: navigator.serviceWorker.controller?.scriptURL || null,
    controllerState: navigator.serviceWorker.controller?.state || null,
    oldCache: (await caches.keys()).includes(name),
    appBooted: !!window.Store && !!document.querySelector('#v120-root'),
    pointCount: Store.myData().tours[0].liveTrack.points.length,
  }), legacyCacheName);
  assert.equal(updateState.oldCache, true, 'The old app cache must not be deleted while that app instance is active.');
  assert.equal(updateState.appBooted, true, 'Updating the worker must not interrupt the open app.');

  await updatePage.close();
  const probe = await updateContext.newPage();
  await probe.goto(`${origin}/offline-probe.html`, { waitUntil: 'domcontentloaded' });
  await probe.waitForTimeout(2500);
  const updateConditions = { basePath, cachePrefix: 'turatars-v130.2-', oldName: legacyCacheName, unrelatedName: unrelatedCacheName };
  await probe.waitForFunction(async ({ basePath, cachePrefix, oldName, unrelatedName }) => {
    const registration = await navigator.serviceWorker.getRegistration(basePath);
    const names = await caches.keys();
    const current = names.find(name => name.startsWith(cachePrefix));
    return !!(registration && !registration.waiting && registration.active?.state === 'activated' && current &&
      !names.includes(oldName) && names.includes(unrelatedName));
  }, updateConditions, { timeout: 20000 });
  const updateResult = await probe.evaluate(async ({ basePath, cachePrefix }) => {
    const registration = await navigator.serviceWorker.getRegistration(basePath);
    const names = await caches.keys();
    return { current: names.find(name => name.startsWith(cachePrefix)), names, waiting: !!registration?.waiting,
      activeState: registration?.active?.state };
  }, updateConditions);
  assert.ok(updateResult.current, 'The updated worker activates after the prior app closes.');
  assert.ok(updateResult.names.includes(unrelatedCacheName), 'Activation must leave unrelated caches untouched.');
  await updateContext.setOffline(true);
  const updatedOffline = await updateContext.newPage(); await observe(updatedOffline);
  await updatedOffline.goto(`${appUrl}?design=atlas#/tura-live/t-v1302-offline`, { waitUntil: 'domcontentloaded' });
  try {
    await updatedOffline.waitForFunction(() => window.Store && window.App && document.querySelector('#v120-root'));
  } catch (error) {
    console.error('Updated offline app did not boot:', JSON.stringify(await updatedOffline.evaluate(() => ({
      href: location.href, online: navigator.onLine, readyState: document.readyState,
      app: typeof window.App, store: typeof window.Store, root: !!document.querySelector('#v120-root'),
      text: document.body.innerText.slice(0, 600), errors: window.__v1302OwnConsoleErrors,
    })).catch(() => null)));
    throw error;
  }
  const afterUpdateOffline = await updatedOffline.evaluate(() => ({
    data: JSON.parse(localStorage.getItem('turavaros_v1')).data['u-v1302'],
    points: Store.myData().tours[0].liveTrack.points.length,
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    errors: window.__v1302OwnConsoleErrors,
  }));
  assert.deepEqual(afterUpdateOffline.data, localBeforeUpdate, 'A worker update and offline restart must retain the saved GPS track and tour data.');
  assert.equal(afterUpdateOffline.points, localBeforeUpdate.tours[0].liveTrack.points.length);
  assert.ok(afterUpdateOffline.width <= afterUpdateOffline.viewport && afterUpdateOffline.viewport === 390);
  assert.deepEqual(afterUpdateOffline.errors, []);
  assert.deepEqual(pageErrors, [], pageErrors.join('\n'));
  assert.deepEqual(ownConsoleErrors, [], ownConsoleErrors.join('\n'));
  console.log(JSON.stringify({
    status: 'PASS',
    checks: [
      'hashed HTML/JavaScript/CSS app shell cached on first online install',
      'GPS track and local data survive offline reload and offline reopen',
      'SPA main entry loads offline; missing optional media does not stop startup',
      'old worker/cache remain until the active app closes; update then activates safely',
      'only app-owned old cache is removed; unrelated cache survives',
      'online return, 390x844 mobile, pageerror 0, console.error 0',
    ],
    requiredAssets: shell.required.length,
    optionalAssets: shell.manifest.optional.length,
    cacheName: shell.manifest.cacheName,
    gpsPoints: beforeOffline.pointCount,
    pageerror: 0,
    consoleError: 0,
  }, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
