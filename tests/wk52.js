const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 160)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?WK' + x + Date.now();
  await p.goto(U('a') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.evaluate(() => { Store.signup('WK W', 'wk@wk.io', 'wkpassword1', 'X'); Store.me().onboarded = true; Store.save(); });
  await p.evaluate(() => { const o = { id: 'orgw', owner: 'wk@wk.io', name: 'WK Sz', demo: false }; const sat = (function () { const x = new Date(); const a = (6 - x.getDay() + 7) % 7 || 7; x.setDate(x.getDate() + a); return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2); })(); Store.platform().organizers.push(o); Store.platform().events.push({ id: 'evwk2', orgId: 'orgw', name: 'WK2 Túra', date: sat, place: 'Hargita', status: 'published', joinMode: 'none', rev: 0, demo: false, createdAt: new Date().toISOString(), fp: 'wk2|' + sat + '|hargita' }); Store.save(); });
  await p.goto(U('b') + '#/felfedezes', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(700);
  await p.evaluate(() => { document.querySelectorAll('#f9-list details').forEach(d => d.open = true); }); await p.waitForTimeout(400);
  console.log('before chip: WK2 in list:', await p.evaluate(() => [...document.querySelectorAll('#f9-list .f9card')].some(c => /WK2/.test(c.textContent))), '| modal:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return m ? m.innerText.slice(0, 30).replace(/\n/g, '·') : 'none'; }));
  await p.evaluate(() => { const x = [...document.querySelectorAll('[data-f9chip="weekend"]')][0]; x && x.click(); }); await p.waitForTimeout(800);
  console.log('after chip: cards:', await p.evaluate(() => [...document.querySelectorAll('#f9-list .f9card')].map(c => (c.querySelector('b') || {}).textContent.slice(0, 20)).join(', ')), '| pe:', pe.length);
  console.log('mapped:', await p.evaluate(() => { const e2 = window.e2Events(); const x = e2.find(z => /WK2/.test(z.name)); function nw(ds){ try{ var d=new Date(ds+'T12:00:00'); var now=new Date(); var sat=new Date(now); var day=sat.getDay(); sat.setDate(sat.getDate()+((6-day+7)%7)); sat.setHours(6,0,0,0); var mon=new Date(sat); mon.setDate(sat.getDate()+2); return 'in:'+(d>=sat&&d<mon);}catch(e){return 'err';} }
    return JSON.stringify({ found: !!x, date: x && x.date, nw: x && nw(x.date), sat: (function(){ const y=new Date(); const a=(6-y.getDay()+7)%7||7; y.setDate(y.getDate()+a); return y.getFullYear()+'-'+('0'+(y.getMonth()+1)).slice(-2)+'-'+('0'+y.getDate()).slice(-2); })() }); }));
  await b.close(); process.exit(0);
})().catch(e => { console.log('H', e.message.slice(0, 160)); process.exit(0); });
