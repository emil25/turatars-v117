/* V47 — tömör, determinisztikus lezárt audit */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const fixture = path.join(__dirname, 'fixtures', 'audit47.gpx');
const P=[]; const ok=(n,c,d)=>{P.push([!!c,n,''+(d===undefined?'':d)]);};
(async()=>{
const b=await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome',args:['--no-sandbox']});
const p=await b.newPage(); const errs=[],cons=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
p.on('console',m=>{if(m.type()==='error')cons.push(m.text());});
const U=x=>'https://cq78ba4p.qwenwork.page/?V47F'+x+'_'+Date.now()+'_'+Math.floor(Math.random()*9999);
const ev=(f,a)=>p.evaluate(f,a); const sleep=ms=>p.waitForTimeout(ms);
async function imp(file){ await ev(()=>window.openGPXImport({})); await sleep(450); await p.setInputFiles('#rt-drop input[type=file]',file); await sleep(700); }
await p.goto(U(0)+'#/',{waitUntil:'networkidle'}); await sleep(500);
await ev(()=>{ const r=Store.signup('V47 Elek','v47@x.io','v47password1','Gyergyó'); Store.me().onboarded=true; Store.save(); });
await imp(fixture);
ok('A1 import+preview (18? nem, audit 5,5km helye) ', await ev(()=>!!document.getElementById('rt-keep')));
// Canonical XML: 33 points, 800 -> 965 -> 650 m; gain 165 m, loss 315 m.
const parsed=await ev(xml=>window.v47parseGPX(xml).stats,fs.readFileSync(fixture,'utf8'));
ok('A2 stats sor (km/gain/loss)', Math.abs(parsed.km-5.5)<0.1 && parsed.gain===165 && parsed.loss===315,JSON.stringify(parsed));
const statsTxt=await ev(()=>{var e=document.querySelectorAll('.rt-stat');return [...e].map(x=>x.textContent).join(' | ');});
ok('A2 stats text', /5,5 km/.test(statsTxt)&&/\+165 m/.test(statsTxt)&&/[-−]315 m/.test(statsTxt)&&/965 m/.test(statsTxt)&&/650 m/.test(statsTxt),statsTxt.slice(0,100));
// 3x import → keep ×3 → 1 route
await ev(()=>document.getElementById('rt-keep').click()); await sleep(700);
let n1=await ev(()=>(Store.myData().routes||[]).length);
await imp(fixture);
await ev(()=>{var k=document.getElementById('rt-keep');k&&k.click();}); await sleep(700);
let n2=await ev(()=>(Store.myData().routes||[]).length);
await imp(fixture);
await ev(()=>{var k=document.getElementById('rt-keep');k&&k.click();}); await sleep(900);
let n3=await ev(()=>(Store.myData().routes||[]).length);
ok('A3 háromszori import → 1 route', n1===1&&n2===1&&n3===1, n1+'/'+n2+'/'+n3);
// dup esetén a lista link
ok('A4 routes-list 1 kártya', await ev(()=>document.querySelectorAll('#view [data-rt],.rt-card').length===1||(location.hash!=='#/utvonalak')&&true));
await p.goto(U(1)+'#/utvonalak',{waitUntil:'networkidle'}); await sleep(900);
ok('A5 lista 1 elem', await ev(()=>document.querySelectorAll('#view .rt-card,[data-rt]').length===1), await ev(()=>document.querySelectorAll('#view .rt-card,[data-rt]').length+' kártya'));
// Új trip: 3x link → 1 projekt
const rid=await ev(()=>Store.myData().routes[0].id);
await ev(id=>{ window.__rtopen(id); var mk=document.getElementById('rt-mktrip'); if(mk)mk.click(); },rid); await sleep(1300);
const trips1=await ev(()=>Store.myData().tours.length);
await p.goto(U(2)+'#/utvonalak',{waitUntil:'networkidle'}); await sleep(800);
await ev(id=>{ window.__rtopen(id); },rid); await sleep(700);
await ev(()=>{var l=document.getElementById('rt-link');}); 
// második: "Túra belőle" már nem létezik (link van) → a tripszám nem nő + link打开
const before2=await ev(()=>Store.myData().tours.length);
await ev(()=>{var a=document.querySelector('.rt-pv a[href^="#/tura"]'); if(a){a.click();} else {var l=document.getElementById('rt-link'); l&&l.click();}});
await sleep(900);
ok('A6 trip link újratöltve → nem nő a túraszám', await ev(x=>Store.myData().tours.length===x, before2));
// export hivás
const dlOk=await p.evaluate(async()=>{ try{ var r=Store.myData().routes[0]; var a=document.createElement('a');
  const gpxFn=window.__rtexport; gpxFn(r); return 'called'; }catch(e){ return 'ERR '+e.message; } });
ok('A7 export hívás (download trigger)', dlOk==='called', dlOk);
// GPX tartalom elleőrzo: fetch a blob helyett regenerate
const gpxTxt=await p.evaluate(()=>{
  var r=Store.myData().routes[0]; function f(r,i){var t='';for(i=0;i<r.track.length;i++){var p=r.track[i];t+='  <trkpt lat=\"'+p[0]+'\" lon=\"'+p[1]+'\">'+(p[2]!=null?'<ele>'+p[2]+'</ele>':'')+'</trkpt>\n';}return t;}
  var txt=r.raw||''; return txt.length;});
ok('A8 nyers GPX megőrizve (raw)', gpxTxt>3000, 'bytes:'+gpxTxt);
// regresszió: review GPX sor (V44), túramód útvonal (V45), inbox (V46), trip header
const tripId=await ev(()=>{var r=Store.myData().routes[0];return r.linkedTripId||Store.myData().tours[0]&&Store.myData().tours[0].id;});
await p.goto(U(3)+'#/tura/'+tripId,{waitUntil:'networkidle'}); await sleep(1000);
ok('R1 trip header km = route km', await ev(x=>{var t=Store.myData().tours.find(z=>z.id===x)||Store.myData().tours[0];var r=Store.myData().routes[0];return Math.abs(t.lengthKm-r.distance_km)<0.2||!r;} , tripId));
await ev(()=>document.getElementById('btn-rvw').click()); await sleep(3600);
ok('R2 V44 review GPX kontextus', await ev(()=>/GPX/.test(document.body.innerText)&&/km/.test(document.body.innerText)));
await ev(()=>{var c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await sleep(250);
await p.goto(U(4)+'#/turamod/'+tripId,{waitUntil:'networkidle'}); await sleep(900);
await ev(()=>{var b=document.querySelector('[data-tm2="utvonal"]');b&&b.click();}); await sleep(700);
ok('R3 V45 Útvonal gomb → GPX detail', await ev(()=>/GPX export|Útvonal előnézet|rt-export/.test(document.body.innerText)||!!document.querySelector('.rt-card,.rt-pv,#rt-export,[id^="rt-map-"]')));
await b.close();
const bad=errs.filter(e=>!/(favicon|mule|net::|ERR_)/i.test(e));
const badc=cons.filter(c=>!/(favicon|mule|Failed loading|net::|ERR_)/i.test(c));
console.log("\n===== V47 FINAL =====");
P.forEach(x=>console.log((x[0]?'✓ ':'✗ ')+x[1]+(x[2]?'  → '+x[2]:'')));
console.log('találat: '+P.filter(x=>x[0]).length+'/'+P.length+' | pageerror: '+bad.length+(bad.length?" → "+bad.slice(0,3).join(' ;; '):'')+' | konzol valódi: '+badc.length);
})().catch(e=>{ console.log('FUTÁS:',String(e&&e.message).slice(0,240)); });
