const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?X' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?Y' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const out = [];
    [...document.querySelectorAll('section.wsec')].forEach(s => {
      if (s.scrollWidth > s.clientWidth + 2) {
        const kids = [...s.querySelectorAll('*')].filter(y => { try { return y.scrollWidth > y.clientWidth + 2 && y.clientWidth > 90; } catch (e) { return false; } }).map(y => y.tagName + '.' + String(y.className).slice(0, 20) + ' sw' + y.scrollWidth + '/cw' + y.clientWidth);
        out.push((s.id || s.innerText.split('\n')[0].slice(0, 14)) + ' :: ' + (kids.slice(0, 3).join(' / ') || 'no-deep'));
      } });
    return out.join(' ## ') || 'nincs wsec over'; }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 200)));
