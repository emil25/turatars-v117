const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('https://cq78ba4p.qwenwork.page/?DBG' + Date.now() + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('D', 'd@d', 'dddddddd1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await p.goto('https://cq78ba4p.qwenwork.page/?DBG2' + Date.now() + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
  console.log(await p.evaluate(() => {
    const c = document.querySelector('.f9-chips'); const st = getComputedStyle(c);
    const w = c.getBoundingClientRect();
    let a = c.parentElement, chain = '';
    const r0 = document.documentElement;
    let wide = [];
    document.querySelectorAll('section *').forEach(x => { const r = x.getBoundingClientRect(); if (r.right > 400) { let s = null, y = x; while (y && y !== document.body) { const g = getComputedStyle(y); if (g.overflowX === 'auto' || g.overflowX === 'scroll') { s = y.tagName + '.' + String(y.className).slice(0, 14); break; } y = y.parentElement; } wide.push(x.tagName + '.' + String(x.className).slice(0, 16) + '@' + Math.round(r.right) + '>{' + (s || 'NOSCROLL') + '}'); } });
    return 'chips: w=' + Math.round(w.width) + ' right=' + Math.round(w.right) + ' wrap=' + st.flexWrap + ' ovfX=' + st.overflowX + '\n' + 'html.scrollW=' + r0.scrollWidth + ' body.scrollW=' + document.body.scrollWidth + '\n' + wide.slice(0, 7).join('\n');
  }));
  await b.close();
})().catch(e => console.log('E', e.message.slice(0, 160)));
