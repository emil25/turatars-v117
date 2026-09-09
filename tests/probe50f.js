const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?F' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?F2' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const out = ['sw:' + document.documentElement.scrollWidth];
    [...document.querySelectorAll('*')].forEach(x => { const r = x.getBoundingClientRect(); if (r.right > 393 && r.width < 2000) out.push('R>' + x.tagName + '.' + String(x.className).slice(0, 20) + '@' + Math.round(r.right) + ' w' + Math.round(r.width)); if (r.left < -3 && r.width < 2000) out.push('L<' + x.tagName + '.' + String(x.className).slice(0, 20) + '@' + Math.round(r.left)); });
    return out.slice(0, 12).join(' | '); }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
