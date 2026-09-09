const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 200)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?DZ' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { Store.signup('DZ', 'dz@v52.io', 'dzpasswordx1', 'Gyergyó'); Store.me().onboarded = true; Store.save();
    Store.platform().organizers.push({ id: 'orgz', owner: Store.me().email, name: 'DZ Org', region: 'X', demo: false, createdAt: new Date().toISOString() });
    Store.platform().events.push({ id: 'evz', orgId: 'orgz', name: 'DZ Esemény', date: '2026-11-28', time: '09:00', place: 'Csík', region: 'Csík', km: 13, up: 700, h: 5, diff: 'Közepes', desc: 'd', status: 'published', joinMode: 'internal', cap: 20, fp: 'dz esemény|2026-11-28|csík', rev: 0, demo: false, createdAt: new Date().toISOString() }); Store.save(); });
  await p.goto(U('1') + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  console.log('e2Events count:', await p.evaluate(() => (window.e2Events ? window.e2Events().length : 'NOAPI')));
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(800);
  console.log('cards:', await p.evaluate(() => [...document.querySelectorAll('#f9-list .f9card')].map(c => (c.querySelector('b') || {}).textContent).slice(0, 12).join(' ~ ')));
  console.log('PE:', pe.slice(0, 3));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
