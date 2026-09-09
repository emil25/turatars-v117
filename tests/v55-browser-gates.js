/* V55 browser gates without creating an external account. */
const { chromium } = require('../../audit-tools/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
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
    await page.goto(process.env.TT_PREVIEW_URL || 'http://localhost:4174/#/', { waitUntil: 'networkidle' });

    const restore = await page.evaluate(async () => {
      const email = 'browser-gate@example.invalid';
      Store.signup('Browser Gate', email, 'LocalPass123!', 'Audit');
      Store.me().onboarded = true;
      const tour = Store.newTourFromDraft({ title: 'CLOUD ORIGINAL', date: '2026-12-20', place: 'Hargita', lengthKm: 11, ascent: 510 });
      const data = Store.myData();
      data.reportAck = { localReport: 'keep' };
      data.challenges = [{ id: 'ch_cloud', name: 'Cloud challenge', items: [{ l: 'Goal', done: true }] }];
      data.routes = [{ id: 'rt_cloud', name: 'Cloud GPX', distance_km: 2, track: [[46.1,25.1,700],[46.2,25.2,800]], nPts: 2, source: 'gpx-import' }];
      Store.save();
      const state = window.__V54.st();
      Object.assign(state, { email, provider: 'supabase-snapshot', remoteVersion: 1, status: 'ready' });
      const snapshot = window.__V54.build(email);
      const localBeforeFailedSave = Store.exportData();
      let failedSave = '';
      try { await window.__V54.api.save(snapshot); } catch (error) { failedSave = error && error.error || String(error); }
      const failedSaveSafe = failedSave === 'signed_out' && Store.exportData() === localBeforeFailedSave &&
        localStorage.getItem('turavaros_v1') === localBeforeFailedSave;
      data.tours[0].title = 'LOCAL CHANGED';
      data.localOnlyAfterSave = { keep: true };
      Store.save();
      const envelope = { snap: snapshot, at: new Date().toISOString(), version: 1 };
      const first = window.__V54.api.restoreApply(envelope);
      const once = Store.exportData();
      const second = window.__V54.api.restoreApply(envelope);
      return {
        activeAdapter: window.__V54.activeName(),
        credentialFree: !snapshot.user.pass && !snapshot.users && !snapshot.session && !snapshot.tokens,
        ownEmail: snapshot.linkedEmail === email && snapshot.user.email === email,
        failedSaveSafe,
        first, second,
        restoredTitle: Store.myData().tours.find(item => item.id === tour.id)?.title,
        localFieldKept: Store.myData().localOnlyAfterSave?.keep === true,
        idempotent: Store.exportData() === once,
        diskEqual: Store.exportData() === localStorage.getItem('turavaros_v1'),
        preRestoreExists: !!localStorage.getItem('turatars_v54_pre1')
      };
    });

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
    assert.equal(restore.activeAdapter, 'supabase-snapshot');
    assert.equal(restore.credentialFree, true);
    assert.equal(restore.ownEmail, true);
    assert.equal(restore.failedSaveSafe, true);
    assert.equal(restore.first.ok, true);
    assert.equal(restore.second.ok, true);
    assert.equal(restore.restoredTitle, 'CLOUD ORIGINAL');
    assert.equal(restore.localFieldKept, true);
    assert.equal(restore.idempotent, true);
    assert.equal(restore.diskEqual, true);
    assert.equal(restore.preRestoreExists, true);
    for (const item of mobile) assert.ok(item.scrollWidth <= 390, 'mobile overflow ' + JSON.stringify(item));
    assert.deepEqual(pageErrors, [], 'pageerror');
    assert.deepEqual(consoleErrors, [], 'console.error');
    console.log(JSON.stringify({ restore, mobile, pageerror: 0, consoleError: 0 }, null, 2));
    console.log('V55 BROWSER GATES: PASS');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
