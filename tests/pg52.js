const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 180)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?PG' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { const r = Store.signup('PG', 'pg@pg.io', 'pgpasswordx1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await p.evaluate(() => { Store.platform().organizers.push({ id: 'orgp', owner: 'pg@pg.io', name: 'PG Org', demo: false }); Store.platform().events.push({ id: 'evp_pg', orgId: 'orgp', name: 'PG Esem', date: '2026-12-20', place: 'Honap', region: 'Gyergyó', km: 10, up: 500, diff: 'Közepes', status: 'published', joinMode: 'internal', fp: 'x', rev: 0, demo: false, createdAt: new Date().toISOString() }); Store.save(); });
  await p.goto(U('1') + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(600);
  await p.evaluate(() => { document.querySelectorAll('#f9-list details').forEach(d => d.open = true); }); 
  await p.waitForTimeout(400);
  const btn = await p.evaluate(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /PG Esem/.test(x.textContent)); if (!c) return 'NOCARD'; const pl = c.querySelector('[data-f9plan]'); if (!pl) return 'NOPLAN ' + c.innerHTML.slice(0, 90); return pl.getAttribute('data-f9plan'); });
  console.log('plan attrib:', btn);
  await p.evaluate(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /PG Esem/.test(x.textContent)); const pl = c && c.querySelector('[data-f9plan]'); pl && pl.click(); }); await p.waitForTimeout(1600);
  console.log('projectok:', await p.evaluate(() => (Store.myData().tours || []).map(t => t.extRef + '/' + (t.eventRef || '') + '/' + t.date).join(',')));
  console.log('PE:', pe.slice(0, 2));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 150)));
