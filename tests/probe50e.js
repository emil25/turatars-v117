const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?V' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?V2' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const s = document.querySelector('[data-w="inbox"]'); if (!s) return 'nincs inbox wsec'; const rep = ['sec sw' + s.scrollWidth + ' cw' + s.clientWidth];
    [...s.querySelectorAll('*')].forEach(y => { const rr = y.getBoundingClientRect(); const st = getComputedStyle(y); if (rr.width > 350 || (y.scrollWidth > (y.clientWidth || 0) + 2 && (y.clientWidth || 0) > 40)) rep.push(y.tagName + '.' + String(y.className).slice(0, 22) + ' w:' + Math.round(rr.width) + ' sw:' + y.scrollWidth + ' cw:' + y.clientWidth + ' ox:' + st.overflowX); });
    rep.push('TXT:' + (s.innerText || '').replace(/\n/g, '¶').slice(0, 110)); return rep.join(' | '); }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
