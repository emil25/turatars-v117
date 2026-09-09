const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const eps = [];
  p.on('pageerror', e => eps.push(String(e).slice(0, 200)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?P50' + x + Date.now();
  await p.goto(U('a') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(() => { const r = Store.signup('P', 'p@p', 'pppppppp1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await p.goto(U('b') + '#/profil', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  console.log('ÜRES:', await p.evaluate(() => (document.querySelector('.p5') ? (document.querySelector('.p5').innerText || '').slice(0, 240).replace(/\n/g, ' | ') : 'NINCS .p5! head=' + (document.getElementById('view') || { innerText: '' }).innerText.slice(0, 90))));
  await p.evaluate(() => { const t = Store.newTourFromDraft({ title: 'T1', place: 'T1', region: 'Gyergyói-havasok', lengthKm: 9, ascent: 450 }); Store.save(); Store.completeTour(t.id, { rating: 4 }); });
  await p.goto(U('c') + '#/profil', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  console.log('1 TÚRA:', await p.evaluate(() => [...document.querySelectorAll('.p5-stat')].map(x => (x.innerText || '').replace(/\n/g, '·')).join(' ~ ')));
  console.log('BADGES:', await p.evaluate(() => [...document.querySelectorAll('.p5-badge')].slice(0, 4).map(x => (x.innerText || '').replace(/\n/g, '/')).join(' ~ ')));
  console.log('NAV menü:', await p.evaluate(() => /Saját profil/.test((document.querySelector('.dash-side') || { innerText: '' }).innerText)));
  console.log('PE:', eps.slice(0, 3));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 200)));
