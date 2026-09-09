const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?H' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?H2' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { function absOff(el) { let x = 0, n = el; while (n && n.getBoundingClientRect) { x += n.offsetLeft || 0; if (String(getComputedStyle(n).position) === 'fixed') break; n = n.offsetParent; } return x; }
    let target = null; [...document.querySelectorAll('b')].forEach(x => { if (!target && absOff(x) + x.offsetWidth > 400 && x.offsetWidth < 1000) target = x; });
    if (!target) return 'nincs talék B'; const chain = []; let n = target; while (n && chain.length < 6) { const s = getComputedStyle(n); chain.push(n.tagName + '.' + String(n.className).slice(0, 16) + (n.id ? '#' + n.id : '') + ' off:' + absOff(n) + '+' + n.offsetWidth + ' ox:' + s.overflowX + ' pos:' + s.position + ' disp:' + s.display.slice(0, 10) + ' wsm:' + s.whiteSpace.slice(0, 6)); n = n.parentElement; }
    return chain.join(' >> '); }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
