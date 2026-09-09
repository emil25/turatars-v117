/* V55 targeted browser check: real Supabase adapter + existing V54 safe restore. */
const { chromium } = require('../../audit-tools/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const email = process.env.TT_UI_EMAIL;
  const password = process.env.TT_UI_PASSWORD;
  const url = process.env.TT_PREVIEW_URL || 'http://localhost:4174/';
  assert.ok(email && password, 'TT_UI_EMAIL and TT_UI_PASSWORD are required');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    args: ['--no-sandbox']
  });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const pageErrors = [], consoleErrors = [];
    page.on('pageerror', error => pageErrors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(url + '#/', { waitUntil: 'networkidle' });

    const result = await page.evaluate(async ({ email, password }) => {
      const checks = [];
      const check = (name, pass, detail = '') => checks.push({ name, pass: !!pass, detail });
      Store.signup('V55 Cloud E2E', email, 'LocalPass123!', 'Audit');
      Store.me().onboarded = true;
      const tour = Store.newTourFromDraft({ title: 'CLOUD ORIGINAL', date: '2026-12-20', place: 'Hargita', lengthKm: 11, ascent: 510 });
      const data = Store.myData();
      data.reportAck = { localReport: 'keep' };
      data.challenges = [{ id: 'ch_cloud', name: 'Cloud challenge', items: [{ l: 'Goal', done: true }] }];
      data.routes = [{ id: 'rt_cloud', name: 'Cloud GPX', distance_km: 2, track: [[46.1,25.1,700],[46.2,25.2,800]], nPts: 2, source: 'gpx-import' }];
      Store.save();

      const auth = await window.__TT_SUPABASE_ADAPTER.login(email, password);
      const state = window.__V54.st();
      Object.assign(state, { token: auth.token, uid: auth.uid, email, provider: 'supabase-snapshot', remoteVersion: 0, status: 'ready' });
      check('Supabase adapter active', window.__V54.activeName() === 'supabase-snapshot');

      const snapshot = window.__V54.build(email);
      check('snapshot only current account', snapshot.linkedEmail === email && snapshot.user.email === email);
      check('snapshot excludes credentials/store export', !snapshot.user.pass && !snapshot.users && !snapshot.session && !snapshot.tokens);
      const saved = await window.__V54.api.save(snapshot);
      check('snapshot save version 1', saved.ok && saved.version === 1, JSON.stringify(saved));
      const retry = await window.__V54.api.save({ ...snapshot, ts: new Date().toISOString() });
      check('identical retry has no duplicate version', retry.unchanged === true && retry.version === 1, JSON.stringify(retry));

      const loaded = await window.__V54.api.load();
      check('snapshot load', loaded.version === 1 && loaded.snap.data.tours[0].id === tour.id);
      Store.myData().tours[0].title = 'LOCAL CHANGED';
      Store.myData().localOnlyAfterSave = { keep: true };
      Store.save();
      const restore1 = window.__V54.api.restoreApply(loaded);
      const once = Store.exportData();
      check('cloud restore succeeds', restore1.ok && Store.myData().tours[0].title === 'CLOUD ORIGINAL', JSON.stringify(restore1));
      check('restore preserves local-only Store field', Store.myData().localOnlyAfterSave.keep === true);
      check('restore Store and localStorage agree', once === localStorage.getItem('turavaros_v1'));
      const restore2 = window.__V54.api.restoreApply(loaded);
      check('second restore idempotent', restore2.ok && Store.exportData() === once);

      const conflicting = window.__V54.build(email);
      conflicting.data.tours[0].title = 'CONFLICTING WRITE';
      const localBeforeFailure = Store.exportData();
      let conflict = '';
      try { await window.__V54.api.save(conflicting); } catch (error) { conflict = error && error.error || String(error); }
      check('expectedVersion conflict stops write', conflict === 'version_conflict', conflict);
      check('failed cloud save leaves local unchanged', Store.exportData() === localBeforeFailure && localStorage.getItem('turavaros_v1') === localBeforeFailure);
      await window.__V54.api.logoutNow();
      check('cloud logout keeps local account/data', !!Store.me() && Store.myData().tours[0].title === 'CLOUD ORIGINAL');
      return checks;
    }, { email, password });

    const routes = ['#/', '#/felfedezes', '#/esemenyek', '#/helyek', '#/profil'];
    const mobile = [];
    for (const route of routes) {
      await page.evaluate(hash => { location.hash = hash; }, route);
      await page.waitForTimeout(350);
      mobile.push(await page.evaluate(() => ({
        route: location.hash, innerWidth,
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
      })));
    }
    for (const item of result) assert.ok(item.pass, item.name + ' ' + item.detail);
    for (const item of mobile) assert.ok(item.scrollWidth <= 390, 'mobile overflow ' + JSON.stringify(item));
    assert.deepEqual(pageErrors, [], 'pageerror');
    assert.deepEqual(consoleErrors, [], 'console.error');
    console.log(JSON.stringify({ checks: result, mobile, pageerror: 0, consoleError: 0 }, null, 2));
    console.log('V55 CLOUD BROWSER: PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });

