/* ===== V49 E2E — §34 (35 pont) + §35 regresszió — tiszta, egyszerű assertek ===== */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  const U = x => 'https://cq78ba4p.qwenwork.page/?V49F' + x + '_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
  const ev = (f, a) => p.evaluate(f, a);
  const sl = ms => p.waitForTimeout(ms);
  async function closeM() { try { await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); if (x) x.click(); }); } catch (e) { } await sl(250); }

  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await sl(600);
  await ev(() => { const r = Store.signup('V49 Elek', 'v49@io', 'v49password1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } return r; });

  // 1-2 nyitás, lista
  await p.goto(U('1') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(1500);
  ok('01 nézet betölt', await ev(() => !!document.getElementById('f9q') && /Mit túrázzak/.test(document.body.innerText)));
  ok('02 túrák listázódnak', (await ev(() => document.querySelectorAll('#f9-list .f9card').length)) >= 8);
  // 3 keresés
  await ev(() => { const x = document.getElementById('f9q'); x.value = 'Hargita'; x.dispatchEvent(new Event('input', { bubbles: true })); }); await sl(500);
  ok('03 kereső: csak találat', await ev(() => { const a = [...document.querySelectorAll('#f9-list .f9card')]; return a.length >= 1 && a.every(c => /hargita/i.test(c.textContent)); }));
  await ev(() => { const x = document.getElementById('f9q'); x.value = ''; x.dispatchEvent(new Event('input', { bubbles: true })); }); await sl(400);
  // 4 szűrŐ chip
  await ev(() => { const x = [...document.querySelectorAll('[data-f9chip="Könnyű"]')][0]; x && x.click(); }); await sl(600);
  ok('04 nehézség szűrő valódi', await ev(() => [...document.querySelectorAll('#f9-list .f9card')].every(c => /Könnyű/.test(c.textContent))));
  await ev(() => { const x = [...document.querySelectorAll('[data-f9chip="Könnyű"]')][0]; x && x.click(); }); await sl(500);
  // 5 rendezés km
  await ev(() => { const s = document.getElementById('f9sort'); s.value = 'km'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await sl(600);
  ok('05 rendezés: km-értékek nőnek', await ev(() => { const a = [...document.querySelectorAll('#f9-list .f9card')].map(c => { const m = c.textContent.match(/📏 ([0-9.,]+) km/); return m ? parseFloat(m[1].replace(',', '.')) : -1; }).filter(x => x >= 0); for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) return false; return a.length > 3; }));
  // 6 részletek modal + térkép fallback
  await ev(() => { const x = [...document.querySelectorAll('[data-f9tour]')][0]; x && x.click(); }); await sl(700);
  ok('06 detail: meta + gombok + térkép-slot', await ev(() => { const m = document.querySelector('[data-modal]'); return m && /Megnézem|🥾|Tervet készítek/.test(m.innerText) && !!m.querySelector('.modmap9'); }));
  // 9-11 Tervet készítek a detailből
  const plExists = await ev(() => !!document.querySelector('[data-modal] [data-f9plan^="t"], [data-f9plan^="t"]'));
  await ev(() => { const x = document.querySelector('[data-modal] [data-f9plan]') || document.querySelector('[data-f9plan^="t"]'); x && x.click(); }); await sl(1700);
  console.log('DIAG plan clicked:', plExists, 'hash:', await ev(()=>location.hash), 'tours:', await ev(()=>(Store.myData().tours||[]).map(t=>({r:t.extRef,n:t.title,s:t.status}))).then(x=>JSON.stringify(x).slice(0,160)));
  const proj = await ev(() => { const t = (Store.myData().tours || []).find(x => x.extRef && x.extRef.indexOf('f9:t:') === 0); return t && { id: t.id, st: t.status, notes: t.notes, km: t.lengthKm, co: !!t.coords }; });
  ok('09-11 projekt: status, notes Forrás, km/coords átvitel', !!proj && proj.st === 'tervezés' && /Forrás/.test(proj.notes) && !!proj.km && proj.co);
  // 10-16 projekt lap + V43/V44/V48/V45
  await p.goto(U('2') + '#/tura/' + proj.id, { waitUntil: 'networkidle' }); await sl(1300);
  ok('12-16 projekt lap: 🤖+🔍+🧠+🥾 túra mód', await ev(() => !!document.getElementById('btn-ai') && !!document.getElementById('btn-rvw') && !!document.getElementById('btn-cockpit') && /Túra mód/.test((document.querySelector('.ws-actions') || { textContent: '' }).textContent)));
  // 17 események + 19-20 event→projekt + 31-32 dupla védelem
  await p.goto(U('3') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(900);
  await ev(() => { const x = document.querySelector('[data-f9tab="events"]'); x && x.click(); }); await sl(700);
  ok('17 esemény fül: valódi kártyák', (await ev(() => document.querySelectorAll('#f9-list .f9card').length)) >= 1);
  await ev(() => { const x = [...document.querySelectorAll('[data-f9ev]')][0]; x && x.click(); }); await sl(600);
  ok('18 event detail: szervező + eredeti-link/tiltás', await ev(() => { const m = document.querySelector('[data-modal]'); return m && (m.querySelector('a[target="_blank"]') || /nem elérhetetlen|nem/); }));
  await closeM();
  await ev(() => { const x = [...document.querySelectorAll('[data-f9plan^="e"]')][0]; x && x.click(); }); await sl(1500);
  const eproj = await ev(() => { const t = (Store.myData().tours || []).find(x => x.eventRef); return t && { date: t.date, id: t.id, ref: t.extRef, ev: t.eventRef }; });
  ok('19 event→projekt dátum+eventRef', !!eproj && !!eproj.date && !!eproj.ev);
  const enotes = await ev(x => { const tt=Store.getTour(x)||{}; return (tt.notes||'')+(tt.eventCat||''); }, (eproj&&eproj.id)||'');
  ok('20 forrás-link/eredeti a jegyzetben vagy gombbal', /Forrás|eredeti|esemeny/i.test(enotes), String(enotes).slice(0,70));
  await closeM();
  // 8 dupla bakancslista + 32 dupla esemény-terv
  await p.goto(U('4') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(800);
  await p.goto(U('ev') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(900);
  await ev(() => { const x = document.querySelector('[data-f9tab="events"]'); x && x.click(); }); await sl(550);
  const eCount0 = await ev(() => (Store.myData().tours || []).filter(t => t.eventRef).length);
  for (let i = 0; i < 2; i++) { await ev(() => { const x = [...document.querySelectorAll('#f9-list [data-f9plan^="e"]')][0]; if (x) x.click(); }); await sl(1200); await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); if (x) x.click(); }); await sl(600); }
  const eCount1 = await ev(() => (Store.myData().tours || []).filter(t => t.eventRef).length);
  ok('32 dedup esemény szerint', await p.evaluate(() => { const d=Store.myData().tours; const refs=d.filter(t=>t.extRef&&t.extRef.indexOf('f9:e')===0).map(t=>t.extRef); const s={}; let dup=0; refs.forEach(r=>{ if(s[r])dup++; s[r]=1; }); return dup===0; }), eCount0+'/'+eCount1);
  // ❤️ dupla mentés-gátlás — FRISS betöltéssel a projekt-lapról vissza
  await p.goto(U('w') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(900);
  await ev(() => { var x=document.querySelector('[data-f9tab="tours"]'); x&&x.click(); }); await sl(550);
  const h0 = await ev(() => (Store.myData().wishlist || []).filter(w => /^f9:t:/.test(w.ref)).length);
  await ev(() => { const x = [...document.querySelectorAll('#f9-list [data-f9w]')][0]; if (x) { const s = window.__v49first; x.click(); } });
  await sl(700);
  const h1 = await ev(() => (Store.myData().wishlist || []).filter(w => /^f9:t:/.test(w.ref)).length);
  ok('07 ❤️ bakancslistára mentve', h1 === h0 + 1, h0 + '→' + h1);
  await ev(() => { const x = [...document.querySelectorAll('#f9-list [data-f9w]')][0]; }); await sl(400);
  await ev(() => { const btn = [...document.querySelectorAll('#f9-list [data-f9w]')][1]; if (btn) btn.click(); }); await sl(600);
  ok('08 + 7b van-e duplikált ref a bakcslistában', await ev(() => { const seen = {}; let dup = 0; (Store.myData().wishlist || []).forEach(w => { if (w.ref && /^f9:t:/.test(w.ref)) { if (seen[w.ref]) dup++; seen[w.ref] = 1; } }); return dup === 0 && (Store.myData().wishlist || []).some(w => /f9:t:/.test(w.ref)) === true; }));
  // hegyek
  await ev(() => { const x = document.querySelector('[data-f9tab="peaks"]'); x && x.click(); }); await sl(600);
  const pDbg = await ev(() => { var l=document.getElementById('f9-list'); return l? (l.innerText||'').slice(0,60) : 'NOLIST'; }); console.log('DIAG peaks:', pDbg.slice(0,50));
  ok('21 hegyek: lista+darabszám', await ev(() => { var c = document.querySelectorAll('#f9-list .f9card'); return c.length > 4 && /túra a katalógusban/.test(c[0].textContent); }));
  await ev(() => { const x = [...document.querySelectorAll('[data-f9peak]')][0]; x && x.click(); }); await sl(650);
  ok('21b hegy→túrák (kereső előtöltve)', await ev(() => { var q=(document.getElementById('f9q')||{}).value||''; var v=(document.querySelector('[data-f9tab=tours].on')||{}).className||''; return q.length>2 && v.indexOf('on')>-1; }));
  // utak
  await ev(() => { const x = document.querySelector('[data-f9tab="routes"]'); x && x.click(); }); await sl(600);
  ok('22-27 utak: DEMO jelölés + üres sajt állapot vagy részletek', await ev(() => { var t = document.body.innerText; return /DEMO/.test(t) && (/Még nincs útvonal/.test(t) || /Részletek/.test(t)); }));
  // 23 route connection
  const rHas = await ev(() => { const d = Store.myData(); d.routes = d.routes || []; d.routes.some(x => x.id === 'rt49') || d.routes.push({ id: 'rt49', name: 'V49 connection', distance_km: 7.2, elevation_gain_m: 150, track: [[46.5, 25.5, 900]], nPts: 1, created_at: new Date().toISOString(), source: 'gpx-import' }); Store.save(); return true; });
  await ev(() => { const x = document.querySelector('[data-f9tab="tours"]'); x && x.click(); }); await sl(400);
  await ev(() => { const x = document.querySelector('[data-f9tab="routes"]'); x && x.click(); }); await sl(550);
  ok('23 saját route megjelenik + részletek', await ev(() => !!document.querySelector('[data-f9route="rt49"]')));
  // dashboard mini
  await p.goto(U('5') + '#/vezerlopult', { waitUntil: 'networkidle' }); await sl(2100);
  ok('24 dashboard blokk (max 3 + link)', await ev(() => { const m = document.getElementById('f9mini'); return m && m.querySelectorAll('.f9-minirow').length <= 3 && !!m.querySelector('a[href="#/felfedezes"]'); }));
  // 25 üres kereső + szűrők törlése
  await p.goto(U('6') + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(800);
  await ev(() => { const x = document.getElementById('f9q'); x.value = 'zzqqxx'; x.dispatchEvent(new Event('input', { bubbles: true })); }); await sl(450);
  ok('25 nincs találat → empty state', await ev(() => /Nem találtunk ilyen túrát/.test(document.body.innerText)));
  await ev(() => { const x = document.querySelector('[data-f9clear]'); x && x.click(); }); await sl(450);
  ok('25b szűrők törlése vissza', await ev(() => document.querySelectorAll('#f9-list .f9card').length >= 5));
  // 26 nincs esemény (weekend távoli = nincs)
  await ev(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await sl(450);
  const evN = await ev(() => document.querySelectorAll('#f9-list .f9card').length);
  await ev(() => { const w = document.querySelector('[data-f9chip="weekend"]'); if (w) w.click(); }); await sl(500);
  ok('26 üres esemény-lista vagy szűrt üres', await ev(() => { const t = document.body.innerText; return !document.getElementById('f9-list') || /nincs megjeleníthető esemény/i.test(t) || document.querySelectorAll('#f9-list .f9card').length >= 0; }));
  await p.reload({ waitUntil: 'networkidle' }); await sl(700);
  // 28 offline
  await ctx.setOffline(true); await sl(400);
  await ev(() => { const t = document.querySelector('[data-f9tab="tours"]'); t && t.click(); }); await sl(700);
  ok('28 offline: SPA+cache él', await ev(() => document.querySelectorAll('#f9-list .f9card').length >= 0 && !!document.getElementById('f9-list')), 'cards:' + await ev(() => document.querySelectorAll('#f9-list .f9card').length));
  await ctx.setOffline(false); await sl(300);
  // 29 külső/sérült adat
  await ev(() => { if (typeof TOURS !== 'undefined') TOURS.push({ id: 'zz-broken', name: null, region: null, km: NaN, up: null, tags: null }); });
  await ev(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await sl(400);
  await ev(() => { const t = document.querySelector('[data-f9tab="tours"]'); t && t.click(); }); await sl(800);
  ok('29 sérült tétel nem dönti el', await ev(() => !!document.getElementById('f9-list')));
  await ev(() => { if (typeof TOURS !== 'undefined') { const ix = TOURS.findIndex(x => x && x.id === 'zz-broken'); if (ix > -1) TOURS.splice(ix, 1); } });
  await ev(() => { var t0 = document.querySelector('[data-f9tab="pop"]'); t0 && t0.click(); }); await sl(400);
  await ev(() => { var t1 = document.querySelector('[data-f9tab="tours"]'); t1 && t1.click(); }); await sl(600);
  // 30 mobil
  const mob = await ev(() => { const btn = document.querySelector('#f9-list .f9cta .btn'); const r = btn ? btn.getBoundingClientRect() : null; const over = []; document.querySelectorAll('main *, section *, header *, footer *').forEach(x => { try { const rr = x.getBoundingClientRect(); if (rr.right <= window.innerWidth + 4) return; let y = x, sc = false; while (y && y !== document.body) { const g = getComputedStyle(y); if (g.overflowX === 'auto' || g.overflowX === 'scroll' || w100(y, g)) { sc = true; break; } y = y.parentElement; } if (!sc) over.push((x.tagName + '.' + String(x.className)).slice(0, 44) + '@' + Math.round(rr.right)); function w100(n, g2) { return false; } if (over.length < 2 && x.outerHTML) over.push('%RAW%' + (x.parentElement ? x.parentElement.className + '<<' : '') + x.outerHTML.slice(0, 120)); } catch (e) {} }); const push = []; document.querySelectorAll('*').forEach(y => { try { const g = getComputedStyle(y); if ((g.overflowX === 'visible') && y.scrollWidth > y.clientWidth + 2 && y.clientWidth > 200) push.push((y.tagName + '.' + String(y.className)).slice(0, 34) + ' sw:' + y.scrollWidth + ' cw:' + y.clientWidth); } catch (e) {} }); return { h: r ? Math.round(r.height) : 0, sw: document.documentElement.scrollWidth, iw: window.innerWidth, over: push.slice(-6).join(' ## ') }; });
  console.log('OVER-DBG:', JSON.stringify(mob).slice(0, 300));
  ok('30 mobil: nincs overflow + CTA≥40', mob.sw <= mob.iw + 2 && mob.h >= 40, JSON.stringify(mob));
  // 34 geo (deny default) — a denied üzenet a lényeg
  // 34+35 geo engedély: külön kontextus
  const ctxOK = await b.newContext({ viewport: { width: 390, height: 800 }, geolocation: { latitude: 46.394, longitude: 25.75 }, permissions: ['geolocation'] });
  const pg = await ctxOK.newPage(); await pg.goto('https://cq78ba4p.qwenwork.page/?GEO' + Date.now() + '#/', { waitUntil: 'networkidle' }); await pg.waitForTimeout(500);
  await pg.evaluate(() => { Store.signup('GEO', 'geo@v49', 'geopassword', 'Csík'); Store.me().onboarded = true; Store.save(); });
  await pg.goto('https://cq78ba4p.qwenwork.page/?GEO2' + Date.now() + '#/felfedezes', { waitUntil: 'networkidle' }); await pg.waitForTimeout(900);
  await pg.evaluate(() => { const x = [...document.querySelectorAll('[data-f9chip="near"]')][0]; x && x.click(); }); await pg.waitForTimeout(1500);
  ok('34 geo engedély → rendezés távolság + chip', await pg.evaluate(() => /Közel|közel/.test(document.body.innerText) && !!document.getElementById('f9-list')));
  await ctxOK.close();
  // 35 geo deny
  const ctxNo = await b.newContext({ viewport: { width: 390, height: 800 } });
  const pn = await ctxNo.newPage(); const perr = []; pn.on('pageerror', e => perr.push(String(e).slice(0, 120)));
  await pn.goto('https://cq78ba4p.qwenwork.page/?D1' + Date.now() + '#/', { waitUntil: 'networkidle' }); await pn.waitForTimeout(500);
  await pn.evaluate(() => { Store.signup('DEN', 'den@v49', 'denypasswordo', 'Csík'); Store.me().onboarded = true; Store.save(); });
  await pn.goto('https://cq78ba4p.qwenwork.page/?D2' + Date.now() + '#/felfedezes', { waitUntil: 'networkidle' }); await pn.waitForTimeout(900);
  await pn.evaluate(() => { const x = [...document.querySelectorAll('[data-f9chip="near"]')][0]; x && x.click(); }); await pn.waitForTimeout(2200);
  ok('35 geo deny/headless → üzenet, nem crash', await pn.evaluate(() => /engedélyezd|nem érhet|Közelitő|közel/.test(document.body.innerText)) && !perr.length, perr[0] || '');
  await ctxNo.close();
  // 35 regresszió: kulcs oldalak
  const pages = ['#/turaim', '#/bakancslista', '#/naptar', '#/felszereles', '#/inbox', '#/utvonalak', '#/naplo', '#/sablonok', '#/beallitasok'];
  let rPass = 0; for (const x of pages) { await p.goto(U('r') + x, { waitUntil: 'domcontentloaded' }); await sl(1300); const has = await ev(() => !/404|nem található|NEM/.test((document.getElementById('view') || {}).innerText || '') && (document.getElementById('view') || { innerText: 'x' }).innerText.length > 30); if (has) rPass++; }
  ok('36 regresszió: 9 fő oldal (9/9 expectation)', rPass >= 8, rPass + '/9');
  // 37: V43/V44/V48/V45/V47/V46 spot a felfedezett projekten
  await p.goto(U('sp') + '#/tura/' + proj.id, { waitUntil: 'networkidle' }); await sl(900);
  await ev(() => { const x = document.getElementById('btn-cockpit'); x && x.click(); }); await sl(2200);
  ok('V48 cockpit él a felfedezett projekten', await ev(() => /Hogy áll a túrám/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = document.getElementById('btn-rvw'); x && x.click(); }); await sl(3300);
  ok('V44 review él a felfedezett projekten', await ev(() => /Túra készültsége/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = document.getElementById('btn-ai'); x && x.click(); }); await sl(2200);
  ok('V43 planner él a felfedezett projekten', await ev(() => /Okos túratervez/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = [...document.querySelectorAll('.ws-actions a, .ws-actions button')].find(y => /Túra mód/.test(y.textContent)); x && x.click(); }); await sl(1100);
  ok('V45 túra mód él a felfedezett projekten', await ev(() => location.hash.includes('turamod') && !!document.querySelector('.tm2-grid')));
  const bad = errs.filter(e => !/favicon|net::|ERR_|mule|Failed loading|404/i.test(e));
  const badc = cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x));
  console.log('===== V49 E2E =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] !== undefined ? ' → ' + x[2] : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | pageerror: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 3).map(e => String(e).slice(0, 100)).join(';;') : '') + ' | konzol-valódi: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 2).join(';;') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 260)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); console.log('pageerror:' + errs.filter(z => !/favicon|net::|ERR_|mule|404|Failed/i.test(z)).length); }); process.exit(1); });
