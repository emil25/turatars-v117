const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 160)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?PGC' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { const r = Store.signup('PG C', 'pgc@pg.io', 'pgcpasswordx1', 'X'); if (r.ok) Store.me().onboarded = true; Store.save(); });
  await p.evaluate(() => { Store.platform().organizers.push({ id: 'orgp3', owner: 'pgc@pg.io', name: 'P3', demo: false }); Store.platform().events.push({ id: 'evp3', orgId: 'orgp3', name: 'P3 Esem', date: '2026-12-07', place: 'Honap', status: 'published', joinMode: 'none', fp: 'p', rev: 0, demo: false }); Store.save(); });
  await p.goto(U('1') + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  console.log(await p.evaluate(() => { try { window.v49Plan('e', 'p2-evp3'); return 'called, tours:' + JSON.stringify((Store.myData().tours || []).map(t => t.eventRef)); } catch (e) { return 'THREW ' + e.message.slice(0, 140); } }));
  await p.waitForTimeout(700);
  console.log('after wait tours:', await p.evaluate(() => (Store.myData().tours || []).length), 'PE:', pe.slice(0, 2));
  await b.close(); process.exit(0);
})().catch(e => { console.log('H', e.message.slice(0, 140)); process.exit(0); });
