const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport:{width:390,height:844} })).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,150)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?PB'+x+'_'+Date.now();
  await p.goto(U(1)+'#/', { waitUntil:'networkidle' }); await p.waitForTimeout(500);
  await p.evaluate(()=>{ const r=Store.signup('B','b@b','bbbbbbbb1','X'); if(r.ok){Store.me().onboarded=true;Store.save();} });
  await p.goto(U(2)+'#/felfedezes', { waitUntil:'networkidle' }); await p.waitForTimeout(800);
  for (const tab of ['peaks','routes']) {
    await p.evaluate(t=>{ const x=document.querySelector('[data-f9tab="'+t+'"]'); x&&x.click(); }, tab); await p.waitForTimeout(600);
    console.log(tab, ':', await p.evaluate(()=>{ const l=document.getElementById('f9-list'); return l?(l.innerText||'').replace(/\n/g,' | ').slice(0,140):'NINCS f9-list'; }));
  }
  await p.evaluate(()=>{ const x=document.querySelector('[data-f9tab="tours"]'); x&&x.click(); }); await p.waitForTimeout(500);
  const n = await p.evaluate(()=>document.querySelectorAll('#f9-list [data-f9w]').length);
  const r0 = await p.evaluate(()=>{ const btns=document.querySelectorAll('#f9-list [data-f9w]'); if(!btns.length) return 'nincs gomb'; btns[0].click(); return (Store.myData().wishlist||[]).map(w=>w.ref).join(','); });
  await p.waitForTimeout(600);
  const r1 = await p.evaluate(()=>JSON.stringify((Store.myData().wishlist||[]).map(w=>w.ref)));
  console.log('hearts gombok:', n, '| azonnal:', r0, '| +600ms:', r1, '| toast:', await p.evaluate(()=>{const t=document.querySelector('.toast,[id*=toast]'); return t?t.textContent.slice(0,60):'-';}));
  console.log('PE:', errs.slice(0,3));
  await b.close();
})().catch(e=>{ console.log('HIBA', e.message.slice(0,200)); process.exit(1); });
