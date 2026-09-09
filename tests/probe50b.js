const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const eps = []; p.on('pageerror', e => eps.push(String(e).slice(0, 170)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?PB50' + x + Date.now() + Math.floor(Math.random() * 9e5);
  await p.goto(U('a') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await p.evaluate(() => { for (let i = 1; i <= 4; i++) { const t = Store.newTourFromDraft({ title: 'K' + i, place: 'K' + i, lengthKm: 10, ascent: 500, region: 'Hargita', date: '2026-06-0' + i }); Store.save(); Store.completeTour(t.id, { rating: 4 }); } });
  await p.goto(U('b') + '#/vezerlopult', { waitUntil: 'networkidle' }); await p.waitForTimeout(2600);
  console.log('p50mini:', await p.evaluate(() => { const m = document.getElementById('p50mini'); return m ? m.innerText.replace(/\n/g, '·').slice(0, 90) : ((document.querySelector('#widgets') || {}).innerText || '').includes('Saját túrázásom') ? 'BENT-SZÖVEG' : (document.getElementById('widgets') ? 'widgets-létezik-nincs-block' : 'NINCS #widgets'); }));
  console.log('f9mini:', await p.evaluate(() => !!document.getElementById('f9mini')));
  console.log('overflow:', await p.evaluate(() => { const over = []; document.querySelectorAll('*').forEach(x => { try { const g = getComputedStyle(x); if (g.overflowX === 'visible' && x.scrollWidth > x.clientWidth + 2 && x.clientWidth > 250) over.push((x.tagName + '.' + String(x.className)).slice(0, 40) + ' sw:' + x.scrollWidth + ' cw:' + x.clientWidth); } catch (e) { } }); const html = document.documentElement; return 'html:' + html.scrollWidth + '|' + over.slice(-3).join(' ## '); }));
  console.log('PE:', eps.slice(0, 2));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
