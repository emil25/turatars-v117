const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 160)));
  await p.goto('https://cq78ba4p.qwenwork.page/#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { Store.signup('KD', 'kd@kd.io', 'kdpasswordx1', 'X'); Store.me().onboarded = true; Store.save(); Store.platform().organizers.push({ id: 'orgd', owner: 'kd@kd.io', name: 'KD', demo: false }); Store.platform().events.push({ id: 'evd', orgId: 'orgd', name: 'KD Esem', date: '2026-12-10', place: 'X', status: 'published', joinMode: 'internal', fp: 'd', rev: 0, demo: false }); Store.save(); });
  await p.goto('https://cq78ba4p.qwenwork.page/?KD1' + Date.now() + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(600);
  await p.evaluate(() => { document.querySelectorAll('#f9-list details').forEach(d => d.open = true); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /KD Esem/.test(x.textContent)); const q = c && c.querySelector('[data-f9ev]'); q && q.click(); }); await p.waitForTimeout(700);
  console.log('cal btn:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); const el = m && m.querySelector('[data-e2cal]'); return el ? { attr: el.getAttribute('data-e2cal'), label: el.textContent.slice(0, 18) } : null; }));
  console.log('click raw:', await p.evaluate(() => { const el = document.querySelector('[data-modal] [data-e2cal]'); if (!el) return 'nobtn'; el.click(); return 'clicked'; }));
  await p.waitForTimeout(700);
  console.log('savedEvents:', await p.evaluate(() => JSON.stringify(Store.myData().savedEvents || null)), '| toast:', await p.evaluate(() => (document.querySelector('.toast,#toasts,.toastv') || {}).innerText || '-'));
  console.log('PE:', pe.slice(0, 2));
  await b.close(); process.exit(0);
})().catch(e => { console.log('H', e.message.slice(0, 140)); process.exit(0); });
