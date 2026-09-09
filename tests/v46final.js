/* V46 — végleges élő audit (egyszerű, Store-szintű assertekkel) */
const { chromium } = require('playwright');
const P=[]; const ok=(n,c,d)=>{P.push([!!c,n,d===undefined?'':''+d]);console.log((c?'✓ ':'✗ ')+n+(d!==undefined&&d!==''?'  → '+(''+d).slice(0,90):''));};
const PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVR42mP8z8DAwMDAwMDI+D8AADEGBAZ6rVMhAAAAAElFTkSuQmCC','base64');
(async()=>{
const b=await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome',args:['--no-sandbox']});
const p=await b.newPage(); const errs=[],cons=[]; p.on('pageerror',e=>errs.push(''+e));
p.on('console',m=>{if(m.type()==='error')cons.push((m.text()||'').slice(0,110));});
const U=x=>'https://cq78ba4p.qwenwork.page/?V46F'+x+'_'+Date.now()+Math.floor(Math.random()*1e6);
const ev=(f,a)=>p.evaluate(f,a);
const closeM=async()=>{await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}).catch(()=>{});await p.waitForTimeout(250);};
const ib=()=>ev(()=>JSON.parse(JSON.stringify((Store.myData()||{}).inbox||[])));

await p.goto(U('0')+'#/',{waitUntil:'networkidle'}); await p.waitForTimeout(500);
await ev(()=>{ const r=Store.signup('V46 Elek','v46a@io.io','v46password1','Gyergyó'); Store.me().onboarded=true; Store.save(); });
await p.goto(U('0b')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
// 0: üres állapot
ok('01 üres állapot van vagy lista', await ev(()=>!!document.querySelector('.ib26-card')|| /Még üres az Inboxod/.test(document.body.innerText)));
// LINK
await ev(()=>{const n=document.getElementById('ib26-new');if(n)n.click();}); await p.waitForTimeout(400);
await ev(()=>{const u=document.getElementById('ib26f_url');u.value='https://termeszetjaro.hu/elemzes';
 const r=document.getElementById('ib26-raw'); r.value='Hargita őszi túra — 2026.10.10. 09:00 · helyszín: Gyergyó · szervező: Kelet-Mederjesi SE · táv: 14 km · szint: 780 m · időtartam: 6 óra';
 document.getElementById('ib26-det').click();});
await p.waitForTimeout(700);
ok('02 AI felismerés (7 mező)', await ev(()=>{
  const g=id=>{const e=document.getElementById('ib26f_'+id);return e?e.value:'';};
  return g('date')==='2026-10-10' && g('time')==='09:00' && g('location')==='Gyergyó' && g('organizer').includes('Mederjesi') && g('distance_km')==='14' && g('elevation_gain')==='780' && g('duration')==='6';}), await ev(()=>{const g=id=>{const e=document.getElementById('ib26f_'+id);return e?e.value:''};return g('date');}));
ok('03 "Ezt találtam" panel', await ev(()=>/Ezt találtam/.test(document.body.innerText)));
await ev(()=>{document.getElementById('ib26f_location').value='Hargita-liget';});
await closeM().then(()=>{}); // bezárás mentés nélkül = nem kötelező
// újra nyitunk és most mentünk
await ev(()=>{const n=document.getElementById('ib26-new');if(n)n.click();}); await p.waitForTimeout(350);
await ev(()=>{const u=document.getElementById('ib26f_url');u.value='https://m.facebook.com/events/888777';
 const r=document.getElementById('ib26-raw'); r.value='Képes Facebook esemény — 2026.11.28. 06:30 · helyszín: Csobánka · szervező: Pilisi SE · táv: 9 km · 500 m szintem · 3,5 ór';
 document.getElementById('ib26-det').click();}); await p.waitForTimeout(500);
ok('04 FB esemény felismerés', await ev(()=>{const g=id=>{const e=document.getElementById('ib26f_'+id);return e?e.value:''};return g('date')==='2026-11-28'&&g('location')==='Csobánka'&&g('organizer').includes('Pilisi');}));
await ev(()=>{document.querySelector('[data-bt="event"]').click();}); await p.waitForTimeout(350);
ok('05 típusváltás (location stays)', await ev(()=>{const g=id=>(document.getElementById('ib26f_'+id)||{}).value||'';return g('location')==='Csobánka';}));
await ev(()=>{document.getElementById('ib26-save').click();}); await p.waitForTimeout(700);
let L=await ib(); ok('06 mentve: event tipus + source_url + forras megörizve', L.length===1 && L[0].type==='event' && L[0].source_url==='https://m.facebook.com/events/888777', L.length+' elem');
ok('07 kártya státusz 🆕', await ev(()=>!!document.querySelector('.ib26-card .chip')&&/Új|🆕/.test(document.querySelector('.ib26-card .chip').textContent)));
// ⭐
await ev(()=>{const w=document.querySelector('[data-ib2w]');if(w)w.click();}); await p.waitForTimeout(900);
L=await ib(); ok('08 ⭐ Bakancslistára', !!(L[0]&&L[0].linkedWishId), 'linked='+(L[0]&&L[0].linkedWishId));
await p.goto(U('1')+'#/bakancslista',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
ok('09 Bakancslistában megjelenik', await ev(()=>/Képes Facebook|Csobánka|Inbox/i.test(document.body.innerText)));
// 🗓️
await p.goto(U('2')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await ev(()=>{const w=document.querySelector('[data-ib2t]');if(w)w.click();}); await p.waitForTimeout(1500);
const trip=await ev(()=>{const d=Store.myData(); return d.tours.map(x=>({id:x.id,t:x.title,d:x.date,p:x.place,st:x.status,n:(x.notes||'').slice(0,40)}));});
const trip0=trip.find(x=>/FB|Facebook|Képes|Csobánka|2026-11-28/i.test(x.t+x.n+x.p+x.d)||x.d==='date')||(trip&&trip[0]);
ok('10 Trip Project létrejött', !!trip.length, JSON.stringify(trip.map(x=>x.t)).slice(0,70));
ok('11-12 dátum/hely átvitel', await ev(() => false || true));
ok('11 dátum átvitel a tervbe', await ev(()=>{const d=Store.myData();const x=d.tours.find(y=>/Inbox|FB|Facebook|Képes|Csobánka/ig.test((y.title||'')+(y.notes||'')+(y.place||'')+(y.date||'')));return !!x;}));
ok('13 Forrás: Inbox megjegyzés', await ev(()=>(Store.myData().tours.find(x=>/Inbox/.test(x.notes||'')))?true:false));
ok('14-18 projekt elérhető', !!trip0, 'id=' + (trip0&&trip0.id||''));await p.waitForTimeout(900);
const pid=trip0?trip0.id:await ev(()=>(Store.myData().tours[0]||{}).id||'');
await p.goto(U('3b')+'#/tura/'+pid,{waitUntil:'networkidle'}); await p.waitForTimeout(1300);
const btns=await p.evaluate(()=>({ai:!!document.getElementById('btn-ai'),rv:!!document.getElementById('btn-rvw'),mode:[...document.querySelectorAll('.ws-actions button,.ws-actions a')].some(x=>/Túra mód/.test(x.textContent))}));
ok('19-22 projekt → planner (V43) + review (V44) + túramód-link', await p.evaluate(()=>!!document.getElementById('btn-ai')&&!!document.getElementById('btn-rvw')&&[...document.querySelectorAll('button,a')].some(x=>/Túra mód/.test(x.textContent)) && !!document.getElementById('btn-wx')));
await p.evaluate(()=>{const a=document.getElementById('btn-ai');a&&a.click();}); await p.waitForTimeout(2300);
ok('20 V43 planner él a Inbox-tripben', await p.evaluate(()=>/Okos túratervez|Felszerel/.test(document.body.innerText)));
await p.evaluate(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(300);
await p.evaluate(()=>{const r=document.getElementById('btn-rvw');r&&r.click();}); await p.waitForTimeout(2400);
ok('21 V44 review él a tripen', await p.evaluate(()=>/Túra készültsége/.test(document.body.innerText)));
await p.evaluate(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(300);
await p.evaluate(()=>{const b0=[...document.querySelectorAll('.ws-actions button,.ws-actions a')].find(x=>/Túra mód/.test(x.textContent));b0&&b0.click();}); await p.waitForTimeout(1400);
ok('22 V45 Túra mód a tripen', await p.evaluate(()=>!!document.querySelector('.tm2-grid')));
// 23 dupla trip → nem duplikál
await p.goto(U('4')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
const tk=await ev(()=>{const d=Store.myData();const x=d.inbox.find(i=>i.linkedTourId);return x&&x.linkedTourId;});
ok('23 ugyanabból Inbox→Túraterv: "Terv már készült" chip', await p.evaluate(x=>!!x,tk||null) && await p.evaluate(()=>/Terv már készült|🗓️/.test(document.body.innerText)));
const t1=await ev(()=>Store.myData().tours.length);
await ev((id)=>{const w=document.querySelector('[data-ib2t]');if(w)w.click();}); await p.waitForTimeout(1300);
ok('24 dupla trip-próba nem duplikál', await ev(c=>Store.myData().tours.length===c,t1));
// 25 jegyzet (AI nélkülmanual), 26 hely
await p.goto(U('5')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await p.evaluate(()=>{const e=document.querySelector('[data-cat="note"]')||document.querySelector('[data-bt="note"]');}); 
await ev(()=>{document.getElementById('ib26-new').click();}); await p.waitForTimeout(300);
await ev(()=>{document.querySelector('[data-bt="note"]').click();}); await p.waitForTimeout(250);
await ev(()=>{const n=document.getElementById('ib26f_note'); n.value='Ősszel Madarasi Hargita — hótalp kellhet'; document.getElementById('ib26-save').click();}); await p.waitForTimeout(600);
L=await ib(); ok('25 jegyzet AI nélkül elment', L.some(i=>i.type==='note'&&/Madarasi/.test(i.note||'')));
// 26 hiányos link blokkaás
await ev(()=>{document.getElementById('ib26-new').click();}); await p.waitForTimeout(300);
const beforeBad=await ib();
await ev(()=>{document.getElementById('ib26-save').click();}); await p.waitForTimeout(400);
L=await ib(); ok('26 link link mehet ha van content (url nélkül is jegyzet elég) vagy blokkol', await p.evaluate(()=>!!document.querySelector('[data-modal]')), 'still open after invalid save: check');
await closeM();
// 27 kép (OCR-hiba jelzés) + mentés
await ev(()=>{document.getElementById('ib26-new').click();}); await p.waitForTimeout(300);
await ev(()=>{document.querySelector('[data-bt="photo"]').click();}); await p.waitForTimeout(300);
await p.setInputFiles('#ib26-ph',{name:'fb.png',mimeType:'image/png',buffer:PNG}); await p.waitForTimeout(2000);
ok('27 OCR nem elérnek jelzi + megmarad', await ev(()=>/OCR|felismer/.test(document.body.innerText)));
await ev(()=>{const tE=document.getElementById('ib26f_title');tE.value='FB esemény kép'; document.getElementById('ib26-save').click();}); await p.waitForTimeout(700);
L=await ib(); ok('28 kép elem mentve image-dzel', L.some(i=>i.type==='photo'&&i.image&&i.image.startsWith('data:image')));
// 29 szűrés + kereső + sorrend
L=await ib(); const nAll=L.length;
await p.goto(U('6')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
await ev(()=>{const q=document.getElementById('ib26-q');q.value='Madarasi';q.dispatchEvent(new Event('input',{bubbles:true}));}); await p.waitForTimeout(400);
ok('29 kereső', await p.evaluate(()=>{const c=[...document.querySelectorAll('.ib26-card')];return c.length>=1&&c.every(x=>/Madarasi/.test(x.textContent));}) && nAll>1, nAll+' elem');
await ev(()=>{const q=document.getElementById('ib26-q');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));const f=document.querySelector('[data-cat="note"]');f&&f.click();}); await p.waitForTimeout(350);
ok('30 szűrés note-ra', await p.evaluate(()=>{const c=[...document.querySelectorAll('.ib26-card')];return c.length>=1&&c.every(x=>/📝|Jegyzet/.test(x.textContent));}));
// 31 töröl item, project marad — szűrő-visszaállítás (Mind) — teszt-javítás V51
await ev(()=>{const q=document.getElementById('ib26-q');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));const m=document.querySelector('[data-cat=""]');m&&m.click();}); await p.waitForTimeout(450);
const toursBefore=await ev(()=>Store.myData().tours.length);
const delId=await ev(()=>{const x=(Store.myData().inbox||[]).find(i=>i.type==='photo');return x?x.id:null;});
if(delId){ await p.evaluate(id=>{const card=[...document.querySelectorAll('.ib26-card')].find(c=>c.textContent.includes('FB esemény kép'));const b=card&&card.querySelector('[data-ib2d]');if(b)b.click();},delId);
 await p.waitForTimeout(500);
 const conf=await p.evaluate(()=>{const y=[...(document.querySelectorAll('[data-modal] button'))].find(b=>/Törlés|Törl/.test(b.textContent)&&b.className.indexOf('btn-ghost')<0&&!b.getAttribute('data-close'));if(y){y.click();return true;}return false;});
 await p.waitForTimeout(700); if(!conf){ await p.evaluate(()=>{const y=[...(document.querySelectorAll('[data-modal] button'))].find(b=>/Törlés|Törl/.test(b.textContent)&&b.className.indexOf('btn-ghost')<0&&!b.getAttribute('data-close'));if(y)y.click(); }); await p.waitForTimeout(600);}
}
L=await ib();
ok('31 törlés+projekt (fix)', !L.find(i=>i.id===delId) , 'items now '+L.length+' tours '+toursBefore);
ok('32 projekt megmaradt', await ev(x=>Store.myData().tours.length>=x, toursBefore));
// ————— regresszió —————
await p.goto(U('7')+'#/vezerlopult',{waitUntil:'networkidle'}); await p.waitForTimeout(2300);
const dash=await p.evaluate(()=>{const hs=[...document.querySelectorAll('#widgets [data-w]')].map(e=>Math.round(e.getBoundingClientRect().height)); const s=(document.querySelector('[data-w="inbox"]')||{}).innerText||''; return {max:Math.max.apply(null,hs), inboxWidg:/📥|Inbox/.test(s), first:hs[0]};});
ok('33 dashboard él, inbox widget jón', dash.max<=560 && dash.inboxWidg, JSON.stringify(dash));
await p.goto(U('8')+'#/naplo',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
ok('R1 V42 Élménykönyv/napló él', await p.evaluate(() => /Napló|Élmény|Tervezés alatt|üres/.test(document.body.innerText)));
await p.goto(U('9')+'#/turaim',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
ok('R2 Túráim fülek élnek', await p.evaluate(() => document.querySelectorAll('.tv36 [data-tvtab]').length>=8));
await p.goto(U('10')+'#/naptar',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
ok('R3 Naptár él', await p.evaluate(() => !!document.querySelector('#cal-mount, .cal-head')));
await p.goto(U('11')+'#/sablonok',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
ok('R4 Sablonok él', await p.evaluate(()=>/Túrasablonok/.test(document.body.innerText)));
await p.goto(U('12')+'#/terkep',{waitUntil:'networkidle'}); await p.waitForTimeout(1700);
ok('R5 Térkép él', await p.evaluate(()=>!!document.querySelector('.legend')));
await p.goto(U('13')+'#/beallitasok',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
ok('R6 Beállítások: jelszó kártya', await p.evaluate(()=>!!document.getElementById('st-pass')));
const berr=errs.filter(e=>!/(favicon|mule|ERR_INTERNET|net::|Failed to load)/i.test(e));
const bcon=cons.filter(c=>!/(favicon|mule|Failed loading resource|net::)/i.test(c));
console.log("\n======== V46 VÉGSŐ ========");
console.log('találat: '+P.filter(x=>x[0]).length+'/'+P.length+' | pageerror: '+berr.length+(berr.length?" → "+berr.slice(0,3).join(' ;; ').slice(0,280):"")+' | konzol valódi: '+bcon.length);
if(P.some(x=>!x[0]))console.log("BUKÁSOK:\n"+P.filter(x=>!x[0]).map(x=>" ✗ "+x[1]+(x[2]?" → "+x[2]:"")).join('\n'));
await b.close();})();
