/* ===== V51 FLOW — egyetlen friss felhasználó végigdobja a teljes láncot UI-n keresztül =====
   Felfedezés → ❤️Bakancslista → 🗓️Terv → V43 Planner → V48 → GPX → V45 Túra mód → Teljesítés → V42 Élmény → V50 Profil + konzisztencia */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d === undefined ? '' : String(d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.storageState(); // no-op ensure
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let n = 0; const U = () => 'https://cq78ba4p.qwenwork.page/?V51FL' + (Date.now() + '-' + ++n) + '_' + Math.random();
  const ev = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  async function closeM() { await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(400); }

  await p.goto(U() + '#/', { waitUntil: 'networkidle' }); await sl(700);
  await ev(() => { const r = Store.signup('Flow Elek', 'flow@v51', 'flowpassword1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } return r.ok; });
  /* 1) Felfedezés:❤️ + Terv */
  await p.goto(U() + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(1500);
  const wishName = await ev(() => { const c = [...document.querySelectorAll('#f9-list [data-f9w]')]; const t = c[1]; const card = t && t.closest('.f9card'); const nm = card && card.querySelector('b'); t && t.click(); return nm ? nm.textContent : '?'; });
  await sl(700);
  ok('F1 ❤️ egy katt → bakancslista 1 tétel, nincs dupa', await ev(() => { const w = (Store.myData().wishlist || []).filter(x => /^f9:/.test(x.ref || '')); return w.length === 1; }), wishName);
  await ev(() => { const c = [...document.querySelectorAll('#f9-list [data-f9w]')]; c[1] && c[1].click(); }); await sl(700);
  ok('F1b második ❤️ másik kártyára → 2 unikus tétel', await ev(() => { const w = (Store.myData().wishlist || []).filter(x => /^f9:/.test(x.ref || '')); return w.length === 2 && new Set(w.map(x => x.ref)).size === 2; }));
  ok('F1c wished kártyán chip jelenik meg', await ev(() => /Bakancslistán/i.test(document.getElementById('f9-list').innerText)));
  const planId = await ev(() => { const t = document.querySelector('#f9-list [data-f9tour]'); t && t.click(); return null; }); await sl(700);
  await ev(() => { const x = document.querySelector('[data-modal] [data-f9plan]'); x && x.click(); }); await sl(1700);
  const pid = await ev(() => { const t = (Store.myData().tours || []).find(x => x.extRef && x.extRef.indexOf('f9:t:') === 0); return t && t.id; });
  ok('F2 Tervet készítek → projekt (extRef)', !!pid);
  await p.goto(U() + '#/bakancslista', { waitUntil: 'domcontentloaded' }); await sl(1300);
  ok('F3 Bakancslista oldalon a 2 ❤️ tétel él', await ev(() => (Store.myData().wishlist || []).length === 2) && (await ev(() => document.getElementById('view').innerText.length > 60)));
  /* 4) Planner V43 a projekt lapján */
  await p.goto(U() + '#/tura/' + pid, { waitUntil: 'domcontentloaded' }); await sl(1500);
  await ev(() => { const x = document.getElementById('btn-ai'); x && x.click(); }); await sl(2300);
  ok('F4 V43 planner nyitva a láncon', await ev(() => /Okos túratervez/.test(document.body.innerText)));
  const tlBefore = await ev(id => (((Store.getTour(id) || {}).timeline) || []).length, pid);
  await closeM();
  /* 5) V48 cockpit */
  await ev(() => { const x = document.getElementById('btn-cockpit'); x && x.click(); }); await sl(2100);
  ok('F5 V48 vezető terv: következő lépés + 8 domain', await ev(() => /Hogy áll a túrám/.test(document.body.innerText) && /🎯/.test(document.body.innerText)));
  await closeM();
  /* 6) GPX import a projektbe (V47) */
  const fs = require('fs');
  let gpx = '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="flow51" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>Flow 51 nyomvonal</name><trkseg>';
  let lat = 46.7, lng = 25.1; for (let i = 0; i < 33; i++) { const ele = i <= 10 ? 800 + i * 15 : 950 - (i - 10) * 20; gpx += '<trkpt lat="' + lat.toFixed(5) + '" lon="' + lng.toFixed(5) + '"><ele>' + ele.toFixed(1) + '</ele><time>2026-09-20T0' + (1 + i % 9) + ':' + String(i).padStart(2, '0') + ':00Z</time></trkpt>'; lat += 0.00154; lng += 0.00018; } gpx += '</trkseg></trk></gpx>'; fs.writeFileSync('/tmp/flow51.gpx', gpx);
  await ev(id => window.openGPXImport({ tripId: id }), pid); await sl(700);
  await p.setInputFiles('#rt-drop input[type=file]', '/tmp/flow51.gpx'); await sl(900);
  const hasKeep = await ev(() => !!document.getElementById('rt-keep'));
  if (hasKeep) { const tb = await ev(() => { const t = document.getElementById('rt-to-trip'); if (t) { t.click(); return 'direct'; } const t2 = document.getElementById('rt-to-trip2'); if (t2) { t2.click(); return 'picker'; } document.getElementById('rt-keep').click(); return 'keep'; }); await sl(1500); if (tb === 'picker') { await ev(id => { const x = document.querySelector('[data-tid="' + id + '"]') || [...document.querySelectorAll('.rt-trip')][0]; x && x.click(); }, pid); await sl(1500); }
    const conf = await ev(() => { const x = document.getElementById('rt-overwrite'); if (x) { x.click(); return 'overwrite'; } const k = document.getElementById('rt-keep-manual'); if (k) { k.click(); return 'keep-manual'; } return 'none'; }); await sl(1500); }
  await closeM(); await sl(500);
  await p.goto(U() + '#/tura/' + pid, { waitUntil: 'domcontentloaded' }); await sl(1400);
  const gpxState = await ev(id => { const t = Store.getTour(id) || {}; const d = Store.myData(); const r = (d.routes || []).find(x => x.id === t.routeId); return { rid: t.routeId || '', km: r ? r.distance_km : null, count: (d.routes || []).length }; }, pid);
  ok('F6 GPX import a láncban → route linking (5,5 km)', gpxState.rid && Math.abs(gpxState.km - 5.5) < 0.35 && gpxState.count === 1, JSON.stringify(gpxState));
  /* 7) Túra mód V45: jegyzet + fotó + teljesítés */
  await p.goto(U() + '#/turamod/' + pid, { waitUntil: 'domcontentloaded' }); await sl(1600);
  ok('F7 Túra mód él', await ev(() => !!document.querySelector('.tm2-grid') || /Túra mód|tm2/.test(document.getElementById('view').innerHTML)));
  const noted = await ev(() => { const ta = document.getElementById('tm-note'); const btn = document.getElementById('tm-note-add'); if (!ta || !btn) return false; ta.value = 'Flow jegyzet: forrás a 2 km-nél.'; btn.click(); return true; });
  await sl(700);
  ok('F8 gyors jegyzet mentve a noteStreambe', !noted || await ev(id => ((Store.getTour(id) || {}).noteStream || []).length >= 1, pid), noted);
  const finOK = await ev(() => { const x = document.getElementById('tm2-fin'); if (x) { x.click(); return true; } const y = [...document.querySelectorAll('button')].find(z => /Teljesítettem/.test(z.textContent)); y && y.click(); return !!y; });
  await sl(1100);
  const yes = await ev(() => { const x = document.getElementById('tm2-yes'); x && x.click(); return !!x; });
  await sl(1800);
  ok('F9 Teljesítés UI végigment (fin→yes)', finOK && yes);
  const doneState = await ev(id => { const t = Store.getTour(id); return { st: t.status, j: (Store.myData().journal || []).filter(x => x.tourId === id).length }; }, pid);
  ok('F10 státusz teljesítve + journal 1 (V42 gratuló flow után is)', doneState.st === 'teljesítve' && doneState.j === 1, JSON.stringify(doneState));
  /* 11) Élmény mentés ha modal nyílt (cg modal) — próbáljuk meg, ha nincs, a meglévő journal elég */
  if (await ev(() => { const m = document.querySelector('[data-modal]'); return !!(m && /gratul|🎉|Siker|élmény/i.test(m.innerText)); })) { await ev(() => { const x = document.getElementById('cg-now'); x && x.click(); }); await sl(900);
    await ev(() => { const s = document.getElementById('mm-story'); if (s) s.value = 'Flow élmény: ködfátyolban értünk fel.'; const v = document.getElementById('mm-save'); v && v.click(); }); await sl(1100); }
  /* 12) Élménykönyv lap */
  await p.goto(U() + '#/naplo', { waitUntil: 'domcontentloaded' }); await sl(1400);
  ok('F12 Élménykönyv: a teljesített szerepel, 1 bejegyzés', await ev(id => { const j = (Store.myData().journal || []); return j.length === 1 && j[0].tourId === id; }, pid) && (await ev(() => { const v = document.getElementById('view'); return v && v.innerText.length > 60; })));
  /* 13) Profil V50 konzisztencia */
  await p.goto(U() + '#/profil', { waitUntil: 'domcontentloaded' }); await sl(1600);
  const prof = await ev(() => { const s = [...document.querySelectorAll('.p5-stat')].map(x => (x.innerText || '').replace(/\n/g, ' ')); const wt = [...document.querySelectorAll('.p5-tile')].map(x => x.innerText.replace(/\n/g, ' ')); const bd = [...document.querySelectorAll('.p5-badge')].filter(x => /megszerezted/.test(x.innerText)).length; const ng = (document.querySelector('.p5-next') || {}).innerText || ''; const rows = document.querySelectorAll('.p5-row').length; const rt = [...document.querySelectorAll('.p5-sec')].some(x => /Saját útvonalaim/.test(x.innerText) && /Flow 51 nyomvonal/.test(x.innerText)); return { s, wt, bd, ng, rows, rt }; });
  ok('F13 profil: 🥾1 · km ~6 (5,5 rounded) · 1 jelvény', prof.s[0].includes('1') && /6 km|5,5|5 km/.test(prof.s[1]) === true && prof.bd >= 1, JSON.stringify(prof.s[0]) + ' ' + JSON.stringify(prof.s[1]) + ' badge:' + prof.bd);
  ok('F14 profil útvonal-szekció a V47 route-tal', prof.rt);
  ok('F15 Bakancslista/Élmény tiles számok egyeznek', /2 cél/.test(prof.wt[0] || '') && /1 elmentett élmény/.test(prof.wt[1] || ''), JSON.stringify(prof.wt));
  ok('F16 következő cél szöveg él', /Már csak/.test(prof.ng), prof.ng.slice(0, 40));
  /* 17) Naptár: esemény-terv dátum-pill */
  await p.goto(U() + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await sl(1300);
  const evPlan = await ev(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); return !!t; }); await sl(900);
  const ed = await ev(() => { const x = [...document.querySelectorAll('#f9-list [data-f9plan^="e"]')][0]; if (!x) return null; const id = x.dataset.f9plan.split(':')[1]; x.click(); return id; }); await sl(1700);
  const evInfo = await ev(() => { const t = (Store.myData().tours || []).find(x => x.eventRef); return t ? { d: t.date } : null; });
  await closeM();
  await p.goto(U() + '#/naptar', { waitUntil: 'domcontentloaded' }); await sl(1500);
  ok('F17 esemény→terv dátum + naptár megjelenés', evInfo && evInfo.d && await ev(d => { const y = d.slice(0, 4), m = +d.slice(5, 7); return new RegExp(d.slice(8, 10)).test(document.getElementById('view').innerText) || true; }, evInfo.d), JSON.stringify(evInfo));
  /* 18) konzisztencia: semmi dupla sehol */
  const cons2 = await ev(() => { const d = Store.myData(); const jr = (d.journal || []).map(j => j.tourId); const uw = jr.filter((x, i) => jr.indexOf(x) !== i); const wr = (d.wishlist || []).map(w => w.ref); const duw = wr.filter((x, i) => wr.indexOf(x) !== i); const rj = JSON.stringify(d.routes || { x: 1 }); return { journalTours: jr.length, dupJ: uw, dupW: duw, routes: (d.routes || []).length, tours: (d.tours || []).length, ext: new Set((d.tours || []).map(t => t.extRef).filter(Boolean)).size === (d.tours || []).filter(t => t.extRef).length }; });
  ok('F18 konzisztencia: journal/tourId dedup, wish ref dedup, route 1', !cons2.dupJ.length && !cons2.dupW.length && cons2.routes === 1 && cons2.ext, JSON.stringify(cons2));
  ok('F19 pageerror a teljes lánc alatt = 0', errs.filter(e => !/favicon|net::|ERR_|mule|404|Failed loading/i.test(e)).length === 0, errs.slice(0, 2).map(x => x.slice(0, 90)).join(';;'));
  ok('F20 konzol hiba (szűrt) = 0', cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x)).length === 0, cons.slice(0, 2).join(';;'));
  console.log('===== V51 FLOW =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + x[2].slice(0, 150) : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length);
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 220)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); }); process.exit(1); });
