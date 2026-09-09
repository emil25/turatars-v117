const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = [], co = [];
  p.on('pageerror', e => pe.push(String(e).slice(0, 220))); p.on('console', m => co.push(m.type() + ':' + m.text().slice(0, 120)));
  await p.goto('https://cq78ba4p.qwenwork.page/#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.evaluate(() => { Store.signup('DB54', 'db54@x.io', 'db54password1', 'X'); Store.me().onboarded = true; const d = Store.myData(); const t = Store.newTourFromDraft({ title: 'DB T', place: 'H', lengthKm: 5 }); Store.save(); });
  await p.goto('https://cq78ba4p.qwenwork.page/?DB' + Date.now() + '#/profil', { waitUntil: 'networkidle' }); await p.waitForTimeout(1400);
  console.log('c54sec:', await p.evaluate(() => !!document.getElementById('c54sec')));
  await p.evaluate(() => { document.getElementById('c54-link').click(); }); await p.waitForTimeout(700);
  await p.evaluate(() => { const m = document.querySelector('[data-modal]'); m.querySelector('#v4_e').value = 'db54@x.io'; m.querySelector('#v4_p').value = 'db54jelszo12'; m.querySelector('#v4_go').click(); });
  await p.waitForTimeout(3000);
  console.log('vault:', await p.evaluate(() => { const v = JSON.parse(localStorage.getItem('turatars_v54_vault_v1') || '{}'); return JSON.stringify({ acc: Object.keys(v.accounts || {}), snapKeys: Object.keys(v.snaps || {}), schema: v.snaps && v.snaps[Object.keys(v.snaps)[0]] && v.snaps[Object.keys(v.snaps)[0]].snap && v.snaps[Object.keys(v.snaps)[0]].snap.schema, sessEmail: v.tokens && 1 }); }));
  console.log('statefile:', await p.evaluate(() => localStorage.getItem('turatars_v54_state')));
  console.log('chip:', await p.evaluate(() => ((document.getElementById('c54sec') || {}).innerText || 'NOSEC').slice(0, 80)));
  console.log('modalopen:', await p.evaluate(() => !!document.querySelector('[data-modal]')), 'PE:', pe.slice(0, 3), 'CO:', co.slice(-3));
  await b.close(); process.exit(0);
})().catch(e => { console.log('H', e.message.slice(0, 160)); process.exit(0); });
