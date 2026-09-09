const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = [];
  p.on('pageerror', e => pe.push(String(e).slice(0, 220)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?DG' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { const r = Store.signup('DG E', 'dg@v52', 'dgpasswordxx1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await p.goto(U('1') + '#/szervezo', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.evaluate(() => { const x = document.getElementById('e2-reg'); x && x.click(); }); await p.waitForTimeout(500);
  await p.evaluate(() => { const m = document.querySelector('[data-modal]'); m && m.querySelector('#e2o_save').click(); }); await p.waitForTimeout(1000);
  console.log('after org:', await p.evaluate(() => ({ orgs: (Store.platform().organizers || []).length, newbtn: !!document.getElementById('e2-new'), hash: location.hash })));
  await p.evaluate(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await p.waitForTimeout(700);
  console.log('after new:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return { modal: !!m, save: !!(m && m.querySelector('#e2f_save')), title: m ? m.innerText.slice(0, 40) : '', ids: m ? [...m.querySelectorAll('[id]')].length : -1 }; }));
  console.log('PE:', pe.slice(0, 4));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 180)));
