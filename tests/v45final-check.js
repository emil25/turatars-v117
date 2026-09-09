const { chromium } = require('playwright');
(async()=>{ const b=await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome',args:['--no-sandbox']});
 const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,150)));
 const U=x=>'https://cq78ba4p.qwenwork.page/?FC'+x+'_'+Date.now(); const ev=(f,a)=>p.evaluate(f,a);
 await p.goto(U(0)+'#/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
 const tid=await ev(()=>{ Store.signup('FC Elek','fc@fin.hu','fcpassw123','Gyergyó'); Store.me().onboarded=true; Store.save();
  const t=Store.newTourFromDraft({title:'FC körtúra',place:'Hargita',region:'gyergyó',date:Store.addDays(Store.todayISO(),2),lengthKm:12,durationH:5,ascent:520}); t.gear=[]; t.food=[]; t.tasks=[]; Store.save(); return t.id; });
 await p.goto(U(1)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
 // V43 apply + dupla apply
 await ev(()=>document.getElementById('btn-ai').click()); await p.waitForTimeout(2800);
 await ev(()=>{const b=document.getElementById('sp-apply'); b&&b.click();}); await p.waitForTimeout(800);
 const g1=await ev(x=>{const t=Store.getTour(x);return {g:t.gear.length,dup:(()=>{const s={};let d=0;t.gear.forEach(q=>{const k=q.name.toLowerCase();if(s[k])d++;s[k]=1;});return d;})()};},tid);
 await p.goto(U(2)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 await ev(()=>document.getElementById('btn-ai').click()); await p.waitForTimeout(1800);
 await ev(()=>{const b=document.getElementById('sp-apply'); b&&b.click();}); await p.waitForTimeout(700);
 const g2=await ev(x=>{const t=Store.getTour(x);const s={};let d=0;t.gear.forEach(q=>{const k=q.name.toLowerCase();if(s[k])d++;s[k]=1;});return {g:t.gear.length,dup:d};},tid);
 console.log("V43: 1. apply "+JSON.stringify(g1)+" | 2. apply "+JSON.stringify(g2));
 // V44 review: gear-write absence + Intézem
 await p.goto(U(3)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 await ev(()=>document.getElementById('btn-rvw').click()); await p.waitForTimeout(4500);
 const beforeG=await ev(x=>Store.getTour(x).gear.length,tid);
 const clickAdd=await ev(()=>{const e=[...document.querySelectorAll('[data-rvw-jump]')].find(b=>{try{const a=JSON.parse(decodeURIComponent(b.dataset.rvwJump));return !!a.w;}catch(x){return false;}}); if(e){e.click();return true;} return false;});
 await p.waitForTimeout(800);
 const afterG=await ev(x=>Store.getTour(x).gear.length,tid);
 console.log("V44: ugrás-click:",clickAdd," gear before/after review-intézem:",beforeG,afterG," (pageerr "+errs.length+")");
 await b.close();})().catch(e=>console.log('ERR',String(e.message).slice(0,160)));
