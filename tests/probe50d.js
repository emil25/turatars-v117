const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?W' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?W2' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const out = [];
    [...document.querySelectorAll('section.wsec')].forEach(s => { const rr = s.getBoundingClientRect();
      out.push((s.id || s.dataset.w || '?') + ' sw:' + s.scrollWidth + ' cw:' + s.clientWidth + ' w:' + Math.round(rr.width) + ' r:' + Math.round(rr.right)); });
    const deep = []; [...document.querySelectorAll('#widgets *')].forEach(y => { const rr = y.getBoundingClientRect(); if (rr.right > 372) deep.push(y.tagName + '.' + String(y.className).slice(0, 18) + '@' + Math.round(rr.right)); });
    return out.join(' | ') + '\nDEEP:' + deep.slice(0, 10).join(' ; ') + '\nhtml:' + document.documentElement.scrollWidth; }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
