const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = [], co = [];
  p.on('pageerror', e => pe.push(String(e).slice(0, 190))); p.on('console', m => co.push(m.type() + ':' + m.text().slice(0, 100)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?DB' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { Store.signup('DB Elek', 'db@v52', 'dbpasswordx1', 'X'); Store.me().onboarded = true; Store.save(); });
  await p.evaluate(() => { Store.platform().organizers.push({ id: 'org_db', owner: Store.me().email, name: 'DB Szervező', bio: '', region: 'X', web: '', phone: '', logo: '', demo: false, createdAt: new Date().toISOString() }); Store.save(); });
  await p.goto(U('1') + '#/szervezo', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  console.log('new gomb:', await p.evaluate(() => !!document.getElementById('e2-new')));
  console.log(await p.evaluate(() => { try { document.getElementById('e2-new').click(); return 'clicked'; } catch (e) { return 'ERR:' + e.message.slice(0, 140); } }));
  await p.waitForTimeout(900);
  console.log('modal:', await p.evaluate(() => !!document.querySelector('[data-modal]')), 'save:', await p.evaluate(() => !!document.getElementById('e2f_save')));
  console.log('PE:', pe.slice(0, 3));
  console.log('CO:', co.slice(-3));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 180)));
