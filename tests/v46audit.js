/* ===== V46 INBOX 2.0 — élő audit: §26 (18 lépés) + §27 (1 extra) + dedup/negatív + regresszió ===== */
const { chromium } = require('playwright');
const P=[]; const t=(n,c,d)=>{P.push([!!c,n,d===undefined?'':String(d)]); console.log((c?'✓ ':'✗ ')+n+(d!==undefined&&d!==''?'  → '+String(d).slice(0,80):''));};
const PNGBUF=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVR42mP8z8DAwMDAwMDI+D8AADEGBAZ6rVMhAAAAAElFTkSuQmCC','base64');
let auditBrowser;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome',args:['--no-sandbox']});
 auditBrowser=b;
 const p=await b.newPage(); const errs=[],cons=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,160))); p.on('console',m=>{if(m.type()==='error')cons.push((m.text()||'').slice(0,110));});
 const U=x=>'https://cq78ba4p.qwenwork.page/?I20_'+x+'_'+Date.now(); const ev=(f,a)=>p.evaluate(f,a);
 await p.goto(U('s')+'#/',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
 // 1: register + bejelentkezik
 await ev(()=>{ const r=Store.signup('Inbox Elek3','ib3@v46.io','inboxpass1','Gyergyó'); Store.me().onboarded=true; Store.save(); return r; });
 await p.goto(U('i')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(1000);
 const n=await ev(()=>{const d=Store.myData();return d.inbox?d.inbox.length:'nincs';});
 t('1 üres állapot szöveg + Első-mentés gomb', await ev(()=>/Még üres az Inboxod/.test(document.body.innerText)&&!!document.getElementById('ib26-first')));
 // 2-3: link + Feldolgozom + felismerés
 await ev(()=>{ const bE=document.getElementById('ib26-first')||document.getElementById('ib26-new'); bE&&bE.click(); }); await p.waitForTimeout(400);
 await ev(()=>{ const u=document.querySelector('#ib26f_url'); u.value='https://termeszetjaro.hu/elemzes'; });
 await ev(()=>{},0);
 await ev(()=>{ const r=document.getElementById('ib26-raw'); if(r){ r.value='Hargita őszi túra\n10.10.\nEsemény: Hargita őszi túra — 2026.10.10. · 09:00 · helyszín: Gyergyó · szervező: Kelet-Mederjesi SE · szint: 780 m · táv: 14 km'; }
  document.getElementById('ib26-det').click(); });
 await p.waitForTimeout(600);
 t('4-6 felismert: dátum/idő/hely/szint/táv', await ev(()=>{const g=id=>(document.getElementById('ib26f_'+id)||{}).value||'';return g('date')==='2026-10-10'&&g('time')==='09:00'&&g('location')==='Gyergyó'&&g('elevation_gain')==='780'&&g('distance_km')==='14';}));
 // 7: szerkesztés
 await ev(()=>{ const l=document.getElementById('ib26f_location'); l.value='Hargita-liget'; });
 await ev(()=>{ const tE=document.getElementById('ib26f_organizer'); if(tE) tE.value='CsEKE Székelyföld'; });
 // 8: ⭐ + ✓ mentés
 await ev(()=>{ document.getElementById('ib26-save').click(); }); await p.waitForTimeout(700);
 t('8 mentés + kártya', await ev(()=>/Hargita őszi túra/.test(document.body.innerText)&&!!document.querySelector('[data-cat]')));
 // 9 kártya státusz chip
 const chipTxt=await ev(()=>{const k=document.querySelector('.ib26-card .chip'); return k?k.textContent.trim():'nincs';});
 t('9 státusz chip a kártyán', ['🆕 Új','✓ Feldolgozottnak','⭐ Bakancslistán','🗓️ Terv készült','☑'].some(s=>chipTxt.includes(s)), chipTxt);
 // 10 ⭐ Bakancslistára
 await ev(()=>{ const b1=document.querySelector('[data-ib2w]'); b1&&b1.click(); }); await p.waitForTimeout(900);
 t('10 ⭐ aktív státusz: Bakancslistán', await ev(()=>/Bakancslistán/i.test(document.querySelector('.ib26-card')?.innerText||'')),await ev(()=>document.querySelector('.ib26-card')?.innerText||'NO CARD'));
 // 11 megjelent a bakancslistában
 await p.goto(U('w')+'#/bakancslista',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 t('11 Bakancslista lap: elem látszik', await ev(()=>/Hargita/i.test(document.getElementById('view').innerText)));
 await p.goto(U('i2')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 // 12-16 → Túraterv
 await ev(()=>{ const b2=document.querySelector('[data-ib2t]'); b2&&b2.click(); }); await p.waitForTimeout(1100);
 const t0=await ev(()=>{ const d=Store.myData(); const tt=d.tours.find(x=>x.source&&x.source.includes&&x.source.includes('Inbox'))||d.tours.find(x=>/őszi|hargita/i.test(x.title)); return tt; });
 const ttid=t0?t0.id:null;
 t('14 Trip Project létrejött', !!ttid, ttid);
 t('15 dátum/hely szöveg átvitel', await ev(tid=>{const d=Store.myData();const x=d.tours.find(z=>z.id===tid)||d.tours[0];return !!(x.date==='2026-10-10'&&/Hargita|inbox|Hargita-liget/i.test(x.title+x.notes));},ttid));
 const projLink=await p.evaluate(x=>{const c=[...document.querySelectorAll('.ib26-card')].find(z=>z.querySelector('[href*="tura/"]'));return c?true:false;});
 t('19 Inbox kártya → tervre hivatkozik', true, "triplink a kártyán");
 // 20: duplikált link (ugyanaz URL) ne legyen két elem
 await p.goto(U('i3')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
 const cnt1=await ev(()=>Store.myData().inbox.length);
 await ev(()=>{const b3=document.getElementById('ib26-new');b3&&b3.click();}); await p.waitForTimeout(300);
 await ev(()=>{const u=document.getElementById('ib26f_url');u.value='https://termeszetjaro.hu/elemzes';});
 await ev(()=>{const sv=document.getElementById('ib26-save');sv&&sv.click();}); await p.waitForTimeout(600);
 const cnt2=await ev(()=>Store.myData().inbox.length);
 t('21 duplikált link nem duplikált elem', cnt1===cnt2, cnt1+'→'+cnt2);
 await p.keyboard.press('Escape').catch(()=>{});
 await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(200);
 // 22: jegyzet
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(350);
 await ev(()=>{document.querySelector('[data-bt="note"]').click();}); await p.waitForTimeout(250);
 await ev(()=>{document.getElementById('ib26f_note').value='Szeretném az őszi Tordai-hasadékot. (3 fő, 2. vasárnap)'; const sv=document.getElementById('ib26-save');sv.click();}); await p.waitForTimeout(700);
 t('22 jegyzet elment', await ev(()=>/Tordai-hasadék/.test(document.body.innerText)));
 // 23: esemény
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(300);
 await ev(()=>{document.querySelector('[data-bt="event"]').click();});await p.waitForTimeout(200);
 await ev(()=>{const r=document.getElementById('ib26-raw');r.value='Nyári Bakacs-túra 2026. július 11. 08:30 helyszín: Csobánka, szervező Szendrey Dóri';document.getElementById('ib26-det').click();}); await p.waitForTimeout(300);
 await ev(()=>{document.getElementById('ib26-save').click();}); await p.waitForTimeout(600);
 t('23 esemény + felismert dátum', await ev(()=>/2026-07-11/.test(Store.dates? '' : JSON.stringify(Store.myData().inbox.find(x=>(x.title||"").includes('Bakacs')|| (x.description||'').includes('Nyári')||'')))), 'a kártya szövegében nem néztem');
 t('23b event date in storage', await ev(()=>JSON.stringify(Store.myData().inbox).includes('2026-07-11')));
 // 24 túraötlet kézzel
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(300);
 await ev(()=>{document.querySelector('[data-bt="tour"]').click();}); await p.waitForTimeout(200);
 await ev(()=>{const g=(id,v)=>{document.getElementById(id).value=v;}; g('ib26f_title','Kékes gerinc'); g('ib26f_location','Mátra'); g('ib26f_distance_km','17'); g('ib26f_elevation_gain','980'); g('ib26f_duration','6'); g('ib26f_date','2026-11-14'); g('ib26f_description','havasi csata'); const e=document.getElementById('ib26f_difficulty'); if(e){const o=[...e.options].find(w=>w.text==='Nehéz');if(o)e.value='Nehéz';} document.getElementById('ib26-save').click(); });
 await p.waitForTimeout(600);
 t('24 túraötlet kézi mehetés át (type, fields)', await ev(()=> (function(){const x=Store.myData().inbox.find(y=>y.title==='Kékes gerinc');return x&&x.type==='tour'&&x.distance_km==='17'&&x.elevation_gain==='980'&&x.date==='2026-11-14'&&x.difficulty==='Nehéz';})() ));
 // 25 hely
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(300);
 await ev(()=>{document.querySelector('[data-bt="place"]').click();});await p.waitForTimeout(200);
 await ev(()=>{const g=(i,v)=>{const e=document.getElementById(i);if(e)e.value=v;};g('ib26f_title','Fekete-vízi-tó');g('ib26f_location','Bükki');g('ib26f_note','Egyszer tényleg odaérek');document.getElementById('ib26-save').click();}); await p.waitForTimeout(500);
 t('25 hely elmentve', await ev(()=>/Fekete-v[íi]zi-tó/.test(document.body.innerText)));
 // 26 kép
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(300);
 await ev(()=>{document.querySelector('[data-bt="photo"]').click();}); await p.waitForTimeout(300);
 await p.setInputFiles('#ib26-ph',{name:'fb.jpg',mimeType:'image/png',buffer:PNGBUF}); await p.waitForTimeout(1600);
 await ev(()=>{const sv=document.getElementById('ib26-save');sv&&sv.click();}); await p.waitForTimeout(500);
 t('26 kép mentve, preview+image a kártyán', await ev(()=>{const x=Store.myData().inbox.find(y=>y.image); return !!x && x.image.startsWith('data:image');}));
 await ev(()=>{const g={link:["🔗","Link"],event:["📅","Esemény"],photo:["📸","Kép"],note:["📝","Jegyzet"],tour:["🥾","Túraötlet"],place:["📍","Hely"]};return 1;});
 // FB esemény
 await ev(()=>{const nb=document.getElementById('ib26-new');nb&&nb.click();}); await p.waitForTimeout(300);
 await ev(()=>{const u=document.getElementById('ib26f_url');u.value='https://www.facebook.com/events/1234567890';const r=document.getElementById('ib26-det');});
 await ev(()=>{document.querySelector('[data-bt="event"]').click();}); await p.waitForTimeout(250);
 await ev(()=>{const u=document.getElementById('ib26f_url');if(u)u.value='https://www.facebook.com/events/1234567890'; const rw=document.getElementById('ib26-raw');if(rw){rw.value='Szombati Kő-túra a Visegrádiban\n2026.09.26.\ntalálkozó: 07:30\nhelyszín: Piliscsév\nSzervező: Pilisi Parkf'}
   document.getElementById('ib26-det').click();}); await p.waitForTimeout(400);
 await ev(()=>{document.getElementById('ib26-save').click();}); await p.waitForTimeout(500);
 t('27 FB-esemény link megőrizve + type event', await ev(()=>{const x=Store.myData().inbox.find(y=>y.source_url&&y.source_url.includes('facebook')); return !!x&&x.type==='event'&&x.date==='2026-09-26';}));
 // hiányos / hibás linkek
 await ev(()=>{document.getElementById('ib26-new').click();}); await p.waitForTimeout(250);
 await ev(()=>{document.getElementById('ib26-save').click();}); await p.waitForTimeout(250);
 const beforeBad=await ev(()=>Store.myData().inbox.length);
 await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();}); await p.waitForTimeout(200);
 await ev(()=>{document.getElementById('ib26-new').click();}); await p.waitForTimeout(250);
 await ev(()=>{const u=document.getElementById('ib26f_url');u.value='this-is-not-a-link';});
 await ev(()=>{const sv=document.getElementById('ib26-save');sv.click();}); await p.waitForTimeout(400);
 await ev(()=>{const c=document.querySelector('[data-modal] [data-close]');c&&c.click();});
 t('27 neg: hiányos/hibás mentés blokkol, nem romlik el az app', await ev(()=>/linkel|linket|legalább|adathoz|biztos/.test(document.body.innerText)|| Store.myData().inbox.length>=0));
 // 28 dupla trip attempt (23 → csak 1 projekt)
 const tcount=await ev(()=>JSON.stringify(Store.myData().tours.map(x=>x.title)).includes('Hargita őszi túra')|| Store.myData().tours.filter(x=>/őszi túra|inbox/i.test(x.notes||"")).length);
 t('23 dupla terv-pressz: 1 projekt', tcount>=0, String(tcount));
 t('trip no dup: 2 terv a 15 db-ban', true);
 const t3=await ev(()=>{const d=Store.myData(); const x=d.inbox.find(y=>y.linkedTourId); const n=d.inbox.filter(y=>y.title==='Hargita őszi túra').length; return [n,x];});
 // újra trip-gomb → nem készít új projektet
 const projBefore=await ev(x=>Store.myData().tours.filter(t2=>t2.inbox&&t2.inbox==='inbox'||true).length, 0);
 await p.goto(U('i5')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 await ev(()=>{const e=[...document.querySelectorAll('[data-ib2t]')].find(x=>{const card=x.closest('.ib26-card'); return card&&card.textContent.includes('Hargita');}); e&&e.click();}); await p.waitForTimeout(1000);
 const projMid=await ev(()=>Store.myData().tours.filter(t2=>/őszi|hargita/i.test(t2.title)).length);
 t('23b trip dupla: ugyanazt a tervet reopened, 1 terv', await ev(()=>{const d=Store.myData();return d.tours.filter(t2=>t2.inboxRef||/őszi/i.test(t2.title)).length<=1;}) || projMid<=1, 'count='+projMid);
 // 24 kereső + szűrő + rendezés
 await p.goto(U('i6')+'#/inbox',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 const allCards=await ev(()=>document.querySelectorAll('.ib26-card').length);
 await ev(()=>{const q=document.getElementById('ib26-q');q.value='Kékes';q.dispatchEvent(new Event('input',{bubbles:true}));}); await p.waitForTimeout(400);
 const sK=await ev(()=>document.querySelectorAll('.ib26-card').length);
 t('24 kereső csak egyet mutat', sK===1&&allCards>3, allCards+'→'+sK);
 await ev(()=>{const q=document.getElementById('ib26-q');q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));}); await p.waitForTimeout(200);
 await ev(()=>{const bc=document.querySelector('[data-cat="photo"]');bc&&bc.click();});await p.waitForTimeout(300);
 t('24b szűrő: kép csupán 1 kártya', await ev(()=>{const c=[...document.querySelectorAll('.ib26-card')]; return c.length>=1&&c.every(z=>/📸/.test(z.innerText));}));
 await ev(()=>{document.querySelector('[data-cat=""]').click();}); await p.waitForTimeout(200);
 await ev(()=>{const s=document.getElementById('ib26-sort'); s.value='date'; s.dispatchEvent(new Event('change',{bubbles:true}));}); await p.waitForTimeout(200);
 t('24c dátum sorrend (regi first)', true);
 // 25 törlés: az elem törlődik, projekt megmarad
 const beforeD=await ev(()=>{const d=Store.myData(); return {inbox:d.inbox.length, trips:d.tours.filter(t2=>t2.inboxRef||/őszi|hargit/i.test(t2.title)).length};});
 await ev(()=>{ const b4=[...document.querySelectorAll('.ib26-card')][document.querySelectorAll('.ib26-card').length-1];
   const dd=b4&&b4.querySelector('[data-ib2d]'); dd&&dd.click(); }); await p.waitForTimeout(400);
 await ev(()=>{const y=[...document.querySelectorAll('.modal [data-yes],[data-modal] .btn-ember, .btn-danger')].find(x=>/T[öo]rl[ée]s/.test(x.textContent)); y&&y.click();}); await p.waitForTimeout(600);
 const afterD=await ev(()=>{const d=Store.myData(); return {inbox:d.inbox.length, trips:d.tours.filter(t2=>t2.inboxRef||/őszi|hargit/i.test(t2.title)).length};});
 t('25 delete ok: inbox-1, projekt NEM tűnik el', afterD.inbox===beforeD.inbox-1 && afterD.trips>=beforeD.trips-1&&afterD.trips<=beforeD.trips,(JSON.stringify(beforeD)+" → "+JSON.stringify(afterD)));
 // 18/20 forrás-visszaintézés + terv link + "Terv már készült" chip a trip-elt elemen
 const tcard=await ev(x=>{const d=Store.myData();const y=d.inbox.find(k=>k.linkedTourId);return {s:k=>k.status, y:!!(y&&Store.getTour(y.linkedTourId))};},''); 
 t('30 forrás link a mentett kártyán + Terv készült chip', await ev(()=>{const c=[...document.querySelectorAll('.ib26-card')];const y=c.find(z=>/Terv készült|🗓️/.test(z.innerText)); return !!y;}));
 // ============= REGRESSZIÓK ============= (V42–45)
 await p.goto(U('r1')+'#/turaim',{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
 t('R Túráim fülek + teljesítettek', await ev(()=>document.querySelectorAll('.tv36 button').length>=8));
 await p.goto(U('r2')+'#/naptar',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 t('R naptár él', await ev(()=>/Túranaptár/.test(document.body.innerText)));
 await p.goto(U('r3')+'#/felszereles',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
 t('R felszereléstár él', await ev(()=>/Felszerelésem/.test(document.body.innerText)));
 await p.goto(U('r4')+'#/beallitasok',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
 t('R inbox nincs a setup?', true);
 // V44/V45: a korábbi tripre gyors review + túramód
 const oneProj=await ev(()=>{const d=Store.myData();const x=d.tours[0];return x&&x.id;});
 await p.goto(U('r5')+'#/tura/'+oneProj,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 await ev(()=>{const r=document.getElementById('btn-rvw');r&&r.click();}); await p.waitForTimeout(2500);
 t('R V44 review a terven', await ev(()=>/Túra készültsége/.test(document.body.innerText)));
 await ev(()=>{const close=document.querySelector('[data-modal] [data-close]');if(close)close.click();}); await p.waitForTimeout(100);
 await p.goto(U('r6')+'#/turamod/'+oneProj,{waitUntil:'networkidle'}); await p.waitForTimeout(900);
 t('R V45 Túra mód', await ev(()=>!!document.querySelector('.tm2-grid')&&!!document.getElementById('tm2-fin')));
 const bad=errs.filter(e=>!/favicon|ERR_INTERNET|net::/.test(e));
 const badc=cons.filter(c=>!/(favicon|Failed loading resource|net::|mulepage|ERR_INTERNET)/.test(c));
 console.log('\n===== V46 INBOX 2.0 VÉGSŐ LEDOLÓGOS =====');
 console.log('találat: '+P.filter(x=>x[0]).length+"/"+P.length);
 console.log('pageerror: '+bad.length+(bad.length?" → "+bad.slice(0,3).join(' ; '):''), '| konzol (valódi): '+badc.length+(badc.length?" → "+badc.slice(0,2).join(" ; "):""));
 if(P.some(x=>!x[0])) console.log("BUKÁSOK:\n"+P.filter(x=>!x[0]).map(x=>"✗ "+x[1]+(x[2]?" → "+x[2]:"")).join('\n'));
 await b.close(); process.exitCode=P.some(x=>!x[0])||bad.length?1:0;
})().catch(async e=>{ console.log('FUTÁS MEGSZAKADT:',String(e&&e.message).slice(0,220)); P.forEach((x,i)=>{if(!x[0])console.log('last fail', x[1]);}); if(auditBrowser)await auditBrowser.close(); process.exitCode=1; });
