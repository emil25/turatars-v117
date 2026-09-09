const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?G' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?G2' + Date.now() + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const out = ['html sw:' + document.documentElement.scrollWidth];
    function absOff(el) { let x = 0, y = 0, n = el; while (n) { x += n.offsetLeft || 0; y += n.offsetTop || 0; n = n.offsetParent ? n.offsetParent : null; if (n === document.body) break; } return x; }
    [...document.querySelectorAll('body *')].forEach(x => { try { const r = absOff(x); if (r + (x.offsetWidth || 0) > 395 && x.offsetWidth < 1500) out.push('O>' + x.tagName + '.' + String(x.className).slice(0, 18) + '@' + (r + x.offsetWidth)); } catch (e) { } });
    return [...new Set(out)].slice(0, 14).join(' | '); }));
  console.log(await p.evaluate(() => { const w = window.innerWidth; document.documentElement.style.overflowX = 'hidden'; const a = document.documentElement.scrollWidth; document.documentElement.style.overflowX = ''; return 'clip probe innerHTML scroll? ' + a + ' | matchMQ:' + matchMedia('(max-width:900px)').matches; }));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
