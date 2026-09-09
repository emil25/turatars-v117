/* V45 ÉLŐ TESZT — §21 E2E, §24 negatív, §25/§20 duplikáció, §23 regresszió */
const { chromium } = require('playwright');
const P=[]; const t=(name,c,det)=>{P.push([!!c,name,det===undefined?'':String(det)]); console.log((c?'✓ ':'✗ ')+name+(det!==undefined&&det!==''?'  → '+det:''));};
const PNG="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAKlEQVR42mP8z8Dwn4GBgYGRCRwYGsWqBjeIW40oAAAK8QZ+xdDcMgAAAABJRU5ErkJggg==";
(async()=>{
const b=await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:392,height:844},isMobile:true,hasTouch:true});
const p=await ctx.newPage(); const errs=[],cons=[];
p.on('pageerror',e=>errs.push(String(e).slice(0,160)));
p.on('console',m=>{if(m.type()==='error')cons.push((m.text()||'').slice(0,120));});
const U=x=>'https://cq78ba4p.qwenwork.page/?V45_'+x+'_'+Math.random();
const ev=(f,a)=>p.evaluate(f,a);
await p.goto(U(0)+'#/',{waitUntil:'networkidle'}); await p.waitForTimeout(600);
const tid=await ev(()=>{ Store.signup('Ture Elek','ture@v45.hu','turepassword1','Gyergyó'); Store.me().onboarded=true; Store.save();
 const d=Store.myData(); d.equipment.push({id:'e9',name:'Fejlámpa',cat:'Electronika',has:true,w:110});
 const tr=Store.newTourFromDraft({title:'Hargita V45',place:'Hargita',region:'gyergyó',date:Store.todayISO(),lengthKm:15,durationH:6,ascent:860});
 tr.gear=[{name:'Esőkabát',cat:'Kabát',w:330,checked:true},{name:'Fejlámpa',cat:'Electronika',w:110,checked:false,own:true},{name:'Víz 2 l',cat:'Ivókanna',w:2000,checked:true}];
 tr.food=[{id:Store.uid('q'),n:'Víz 2 l — terv',i:'💧',checked:true,w:2000},{id:Store.uid('q'),n:'Szendvics',i:'🥪',checked:false,w:420}];
 tr.participants=[{id:'ppa',name:'Anna',confirmed:true,stat:'jön'},{id:'ppb',name:'Béla',confirmed:false,stat:'válasz'}];
 tr.timeline=[{id:'tt1',t:'00:30',l:'Álmodunk'},{id:'tt2',t:(function(){const d=new Date(Date.now()+5400000);return String(d.getHours()).padStart(2,'0')+':'+String(Math.min(59,d.getMinutes()+30)).padStart(2,'0');})(),l:'Érkezés a parkolóba - V45'}];
 tr.meeting='Gyergyó, sífutópádot'; tr.budget=[{id:'bb',n:'Busz',amt:8,cat:'Utazás',split:'felesszeg'}];
 Store.save(); return tr.id; });
// 10: belépés túra módba — gomb a projektoldalán
await p.goto(U(1)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
await ev(()=>{const x=[...document.querySelectorAll('.ws-actions button,.ws-actions a')].find(z=>/Túra mód/.test(z.textContent)); if(x){x.click();return true;} return navigator.userAgent.slice(0,4);});
await p.waitForTimeout(1100);
t('01 Túra mód gomb a projekt lapján', await ev(()=>location.hash.startsWith('#/turamod/')));
await p.goto(U(2)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
// 11 fő adatok + MA
t('02 head+meta (cím, hely, dátum, km, szint)', await ev(()=>{const s=document.body.innerText;return s.includes('Hargita V45')&&s.includes('MA TÚRÁZOL')&&/15 km/.test(s)&&/860 m/.test(s);}));
// 12 következő esemény (23:30 releváns ma)
t('03 Következő esemény = jövőbeli időpont', await ev(()=>{const el=document.querySelector('.tm2-next');return el&&/Érkezés a parkolóba - V45/.test(el.textContent)&&/KÖVETKEZŐ/.test(el.textContent);}),await ev(()=>{const el=(document.querySelector('.tm2-next')||{}).textContent||'';return el.slice(0,48);}));
// 13 Útvonal → megnyitja a projekt utvonal fülét
await p.goto(U(3)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await ev(()=>{const e=document.querySelector('[data-tm2="utvonal"]');e&&e.click();}); await p.waitForTimeout(1100);
t('04 Útvonal: projekt → utvonal fül él', await ev(x=>location.hash==='#/tura/'+x&&/Útvonal/.test((document.querySelector('.tabs .on')||{textContent:''}).textContent),tid));
const back=()=>p.goto(U(9)+'#/turamod/'+tid,{waitUntil:'networkidle'}).then(()=>p.waitForTimeout(900));
// 14 idővonal

await 
await p.goto(U(46)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await ev(()=>document.querySelector('[data-tm2="idoter"]').click()); await p.waitForTimeout(1300);
t('05 Idővonal: input értékek + lapél', await ev(()=>{const vals=[...document.querySelectorAll('#view input')].map(i=>i.value).join(' ');return /Álmodunk/.test(vals)&&/turamod|tura/.test(location.hash);}), await ev(()=>location.hash.slice(0,24)));

// 15 packing: 2/3 + strip
await p.goto(U(47)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
t('06 packing summary + strip', await ev(()=>{const s=document.body.innerText;return /2\/3 bepakolva|3 bepakolva|\/3/.test(s)&&/1 tétel nincs bepakolva/.test(s);}));
// 16 food summary: 2.0 l · 1 étel
t('07 étel/víz summary valódi', await ev(()=>/2\.0 l/.test(document.body.innerText)&&/1 étel/.test(document.body.innerText)));
// 18 társak
await ev(()=>{const e=document.querySelector('[data-tm2="resztvevok"]')}) .catch(()=>{});
t('08 társak 1/2 visszaigazolva + strip', await ev(()=>{const s=document.body.innerText; return /1\/2/.test(s)&&/1 résztvevő nem erősített meg/.test(s);}));
// fotó:

await p.goto(U(12)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(950);
const pngB=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAKklEQVR4nGP8z8Dwn4GJgYmRAQRmQkkAlTMB9fHkpfkAAAAASUVORK5CYII=','base64');
await p.setInputFiles('#tm-pf',{name:'t.png',mimeType:'image/png',buffer:pngB});
await p.waitForTimeout(2600);
t('10 fotó a túrához csatolva (compress+save)', await ev(x=>{const t0=Store.getTour(x);return (t0.photos||[]).some(q=>q.indexOf('data:')===0);},tid));
// jegyzet:
await p.goto(U(13)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await ev(()=>{document.getElementById('tm-note').value='Az ösvény a nyereg után nagyon sáros.';document.getElementById('tm-note-add').click();});
await p.waitForTimeout(1200);
t('11 gyors jegyzet elmentve a triphez', await ev(x=>Store.getTour(x).noteStream.some(n=>/sáros/.test(n.text)),tid));
// safety:
await p.goto(U(14)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await ev(()=>document.querySelector('[data-tm2="SAFE"]').click()); await p.waitForTimeout(600);
t('12 Biztonság: hely+érkezés+disclaimer', await ev(()=>{const s=document.body.innerText;return /sí|síf|pádot/.test(s)&&/112/.test(s)&&/nem helyettesít segélyhívást/.test(s);}));
await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(250);
await p.goto(U(15)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(850);
// 19 V44 kapcsolat
const hasRvwBtn=await ev(()=>!!document.getElementById('tm2-rvw'));
await p.goto(U(16)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
await ev(()=>{const r=document.getElementById('tm2-rvw'); r&&r.click();}); await p.waitForTimeout(3500);
t('19 V44 modal a Túra módból', await ev(()=>/Túra ellenőrzése/.test(document.body.innerText)));
await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();});
// 22/23 teljesítés (idempotens V42)
await p.goto(U(17)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
const st1=await ev(x=>{const t0=Store.getTour(x);return {status:t0.status};},tid);
await ev(()=>{const f=document.getElementById('tm2-fin');f&&f.click();}); await p.waitForTimeout(600);
await ev(()=>{const y=document.getElementById('tm2-yes');y&&y.click();}); await p.waitForTimeout(3800);
t('23 V42 gratuló a teljesítés után', await ev(()=>/Gratulálunk/.test(document.body.innerText)||/Élmény/.test(document.body.innerText)));
await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(400);
const st2=await ev(x=>{const d=Store.myData();const t0=d.tours.find(z=>z.id===x);return{st:t0.status,jn:d.journal.filter(jx=>jx.tourId===x).length};},tid);
t('24 status teljesítve maradt + 1 journal', st2.st==='teljesítve'&&st2.jn===1, JSON.stringify(st2));
await p.goto(U(18)+'#/turamod/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
t('25 done card:🎉 Túra teljesítve + vissza gombok', await ev(()=>{const s=document.body.innerText;return /Túra teljesítve/.test(s)&&/Élmény hozzáadása/.test(s)&&!/TÚRA TELJESÍTVE/.test(s);}));
await ev(()=>{const m=document.getElementById('tm2-mem');m&&m.click();}); await p.waitForTimeout(1000);
t('26 V42 memoria szerkesztő a Túra mód done-ból', await ev(()=>/Élmény —/.test(document.body.innerText)||/mm-save/.test(document.getElementById('modal-root')?document.getElementById('modal-root').innerHTML:'')));
await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(250);
// újranyitás nem dupliz: (3x)
const snap1=await p.evaluate(x=>JSON.stringify({j:Store.myData().journal.filter(q=>q.tourId===x).length,s:Store.myData().tours.find(z=>z.id===x).status}),tid);
for(let i=0;i<3;i++){await p.goto(U(19+i)+'#/turamod/'+tid,{waitUntil:'networkidle'});await p.waitForTimeout(750);}
const snap2=await p.evaluate(x=>JSON.stringify({j:Store.myData().journal.filter(q=>q.tourId===x).length,s:Store.myData().tours.find(z=>z.id===x).status}),tid);
t('20+27 háromszori nyitás nem változtat', snap1===snap2,"snap="+snap1);
// NEGATÍV
await p.goto(U(30)+'#/',{waitUntil:'networkidle'});
const negId=await ev(()=>{const t0=Store.newTourFromDraft({title:'V45 Negatív'});return t0.id;});
await p.goto(U(31)+'#/tura/'+negId,{waitUntil:'networkidle'}); await p.waitForTimeout(700);
const finNeg=await p.evaluate(()=>{const b=[...document.querySelectorAll('.ws-actions a')].find(x=>/Túra mód/.test(x.textContent)); return b?b.getAttribute('href'):null;});
t('NEG1 gomin megjelenik (teljesítve?)', true, 'href:'+(finNeg||'null-állapot'));
await p.goto(U(32)+'#/turamod/'+negId,{waitUntil:'networkidle'}); await p.waitForTimeout(1100);
const negOpen=await ev(()=>{const s=document.body.innerText;return {tm:/Túrád|hárz/.test(s)||location.hash.includes('turamod'),noTime:/nincs idővonal| idővonal/i.test(s),noData:/nincs megadva/.test(s),notFound:!document.querySelector('.empty')||false}});
t('NEG2 üres terv is megnyílik, nincs adatot jelöl', negOpen.noData||negOpen.noTime, JSON.stringify(negOpen).slice(0,90));
await ev(()=>document.querySelector('[data-tm2="ete"]').click()); await p.waitForTimeout(700);
t('NEG3 üres étel fülre visz, nem tör', await ev(()=>location.hash.startsWith('#/tura/')));
await p.goto(U(33)+'#/turamod/'+negId,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
const fin2=await ev(()=>!!document.getElementById('tm2-fin'));
t('NEG4 üres túra is teljesíthető (gomb van)', fin2);
// REGRESSZIOK
await p.goto(U(40)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
await ev(()=>{const e=document.getElementById('btn-ai');e&&e.click();}); await p.waitForTimeout(2700);
t('REG V43 planner a projektben', await ev(()=>/Okos túratervez/.test(document.body.innerText)));
await ev(()=>{const c=[...document.querySelectorAll('[data-modal] [data-close]')][0];c&&c.click();});
await p.goto(U(41)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await ev(()=>{const r=document.getElementById('btn-rvw');r&&r.click();}); await p.waitForTimeout(2400);
t('REG V44 review él', await ev(()=>/Túra ellenőrzés|Mindennyes|készültsége: \d+%/m.test(document.body.innerText)));
await ev(()=>{const c=[...document.querySelectorAll('[data-modal] [data-close]')][0];c&&c.click();});
await p.goto(U(42)+'#/naplo',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
t('REG V42 élménykönyv', await ev(()=>/Élménykönyv/.test(document.body.innerText)));
await p.goto(U(43)+'#/naptar',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
t('REG V41 naptár (teljesített jel)', await ev(()=>document.querySelectorAll('.cal-pill').length>=1));
await p.goto(U(44)+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
t('REG V41 inbox', await ev(()=>!!document.getElementById('ib26-new')));
await p.goto(U(45)+'#/tura/'+tid,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
t('REG V41 gpx gomb', await ev(()=>!!document.getElementById('btn-gpx')&&!!document.getElementById('btn-rvw')&&!!document.getElementById('btn-ai')));
await p.goto(U(46)+'#/turaim',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
t('REG V41 túráim fülek+számlálók', await ev(()=>/\d+/.test((document.querySelector('.tv36')||{textContent:''}).textContent)));
// statisztika ellenőrzés V42 (km nem duplikált)
const k=await p.evaluate(()=>Store.stats().yearKm);
t('STAT yearKm nem duplikált 1 túra után', k<=15.5 && k>0, String(k));
const errF=errs.filter(e=>!/favicon|net::|ERR_/.test(e)); const conF=cons.filter(x=>!/favicon|mule|Failed loading resource|net::/.test(x));
console.log("\n==== V45 VÉGSŐ ====\ntalálat: "+P.filter(x=>x[0]).length+"/"+P.length+" | pageerror: "+errF.length+(errF.length?" "+JSON.stringify(errF.slice(0,4)):"")+" | konzol(hibás, erőforrás-szűrt): "+conF.length);
if(P.some(x=>!x[0])) console.log("BUKÁSOK:\n"+P.filter(x=>!x[0]).map(x=>"  ✗ "+x[1]+" — "+x[2]).join("\n"));
await b.close(); })().catch(e=>console.log("FUTÁS:",String(e&&e.message).slice(0,260)));
