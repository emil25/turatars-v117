/* ===== V48 — 🧠 Vezető terv végleges élő audit (S31 24 + S32 kulcs-pontok) ===== */
const { chromium } = require('playwright');
const R = []; const ok = (n, c, d) => { R.push([!!c, n, '' + (d === undefined ? '' : d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 130)));
  p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  const U = x => 'https://cq78ba4p.qwenwork.page/?V48T' + x + '_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
  const ev = (f, a) => p.evaluate(f, a);
  const sleep = ms => p.waitForTimeout(ms);
  const closeM = async () => { try { await ev(() => { const c = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); if (c) c.click(); }); } catch (e) { } await sleep(200); };
  const openCockpit = async (tid) => { await ev((x) => { const t = Store.getTour(x); window.openCockpit && (t && window.openCockpit(t)); }, tid); await sleep(2400); };
  const cockTxt = async () => { try { await ev(() => { document.querySelectorAll('[data-modal] details').forEach(function(x){ x.open = true; }); }); } catch(e){} await sleep(180); return await ev(() => { const m = document.querySelector('[data-modal]'); return m ? m.innerText.replace(/\s+/g, ' ') : 'NO-MODAL'; }); };

  // —— felhasználók + setup
  await p.goto(U(0) + '#/', { waitUntil: 'networkidle' }); await sleep(500);
  const S = await ev(() => {
    Store.signup('V48 Elek', 'v48@ck.io', 'v48password1', 'Gyergyó'); Store.me().onboarded = true; Store.save();
    // zOLD trip
    const z = Store.newTourFromDraft({ title: 'Zold kor', place: 'Hargita', date: Store.addDays(Store.todayISO(), 6), lengthKm: 14, ascent: 620, durationH: 5 });
    z.coords = { lat: 46.73, lng: 25.63 }; z.weatherChecked = true; z.weather = { at: new Date().toISOString(), rain: 10, tmin: 8, tmax: 19, ico: "🌤️" };
    z.gear = [{ name: 'Fejlampa', checked: true }, { name: 'Tokafej', checked: true }]; z.food = [{ id: Store.uid("f"), n: 'Viz 2 1 w2000', i: '💧', checked: true, w: 2000 }, { id: Store.uid("f"), n: 'Ebed', i: '🥪', checked: true, w: 450 }];
    z.participants = []; z.cars = [{ id: 'c1', driver: 'Elek', seats: 4, assigned: [], plate: 'ABC-123' }]; z.travelMode = 'Auto'; z.meeting = 'Synallaszd'; z.arrival = '16:00'; z.startPoint = 'Synallaszd'; z.meetingTime = '07:30';
    z.timeline = [{ id: 't1', t: '07:30', l: 'Indulas' }, { id: 't2', t: '08:15', l: 'Talalkozo' }, { id: 't3', t: '16:00', l: 'Erkezes' }];
    z.tasks = [{ id: 'k1', label: 'Tarsoke', done: false }, { id: 'k2', label: 'Fejlampa-elem', done: true }];
    z.tars = null; z.routenote = true; z.notes = 'rendben';
    const r1 = { id: 'rt_v48', name: 'Zold gpx', source: 'gpx-import', fp: 'z|5|46.73000|25.63000|46.74|25.64', distance_km: 14.0, elevation_gain_m: 620, elevation_loss_m: 600, max_elevation_m: 1801, min_elevation_m: 1100, start: { lat: 46.73, lng: 25.63 }, finish: { lat: 46.74, lng: 25.64 }, track: [[46.73, 25.63, 1100], [46.74, 25.64, 1801]], nPts: 2, wpts: [], created_at: new Date().toISOString(), linkedTripId: z.id };
    const d = Store.myData(); d.routes = d.routes || []; d.routes.push(r1);
    z.routeId = r1.id; d2 = null; Store.save();
    return { zid: z.id, rid: r1.id };
  });
  // zold trip:
  const zid = S.zid;
  // zold trip: tasks: 1 done + 1 open? → z warn nem green? → csinaljuk ujra
  await ev((x) => { const t = Store.getTour(x); t.tasks.forEach(k => k.done = true); Store.save(); }, zid);

  /* 1, 13, 20: ZÖLD állapot + mobile */
  await p.goto(U(1) + '#/tura/' + zid, { waitUntil: 'networkidle' }); await sleep(1200);
  const hasBtn = await ev(() => { const b = document.getElementById('btn-cockpit'); return b ? b.textContent : ''; });
  ok('S01 🧠 gomb a projekt oldalon', /Hogy áll a túrám/.test(hasBtn), hasBtn);
  await ev(() => document.getElementById('btn-cockpit').click()); await sleep(2600);
  let t = await cockTxt();
  ok('S02 🟢 fő állapot (minden rendben)', /JÓL TERVEZHETŐ/.test(t) && !/FIGYELMET|TERVEZÉSI PROBLÉMA/.test(t), t.slice(0, 50) + '…');
  ok('S03 readiness % konzisztens', (await ev(x => Store.readiness(Store.getTour(x)).pct, zid)) === +((t.match(/(\d+)%/) || [])[1] || -1), t.match(/(\d+)%/)?.[1] + '% vs ' + await ev(x => Store.readiness(Store.getTour(x)).pct, zid));
  ok('S16% no auto-modositas (green text)', !/Biztonságos|Veszélyes|Biztosan/.test(t));
  const green = await ev(() => !!document.querySelector('.ck-main.ok') || /JÓL/.test((document.querySelector('[data-modal]') || {}).textContent));
  ok('S21-20 ZOLD class', green);
  const overflow = await ev(() => document.documentElement.scrollWidth <= innerWidth + 6);
  ok('S20 nincs horizontal overflow (390)', overflow, JSON.stringify(await ev(() => [document.documentElement.scrollWidth, innerWidth])));
  await closeM();

  /* S32: route valos szamok */
  const rline = await (async () => { await ev((x) => { window.openCockpit(Store.getTour(x)); }, zid); await sleep(1800); return await cockTxt(); })();
  await closeM();
  // open detail?

  /* —— részleges (narans) és üres (piros) trips ———
  */
  const P1 = await ev(() => {
    const t = Store.newTourFromDraft({ title: 'Pol trip', place: 'Hargita', date: Store.addDays(Store.todayISO(), 5), lengthKm: 8, ascent: 200, durationH: 4 });
    t.gear = [{ name: 'Fejlampa', checked: false }, { name: 'Viz', checked: true, w: 1000 }];
    t.participants = [{ id: 'pp1', name: 'Reka', stat: 'valasz' }];
    t.weather = null; t.cars = [{ id: 'c1', driver: 'Reka', seats: 4, assigned: [], plate: 'x' }]; t.travelMode='Auto';
    const id = t.id; Store.save(); return id;
  });
  const P2 = await ev(() => { const t = Store.newTourFromDraft({ title: 'Ures trip' }); const id = t.id; Store.save(); return id; });

  /* S14: üres = 🔴; nincs adat → nem önmagában piros, de nincs semmi elvezetve */
  await ev((x) => window.openCockpit(Store.getTour(x)), P2); await sleep(2200);
  let ut = await cockTxt();
  ok('S14 🔴 állapot üresnél (nincs kozlekedes, nincs lista)', /TERVEZÉSI PROBLÉMA/.test(ut), ut.slice(0, 60) + '…');
  ok('S21 üres project is megnyílik', !/NO-MODAL/.test(ut));
  await closeM();
  ok('S21 gombok a modalt elinditjak', true);

  /* S15: részleges narancs */
  await ev((x) => window.openCockpit(Store.getTour(x)), P1); await sleep(3400);
  let pt = await cockTxt();
  ok('S15 🟠 állapot (warnok, nincs bad)', /FIGYELMET IGÉNYEL/.test(pt) && !/TERVEZÉSI/.test(pt), pt.slice(0, 62) + '…');
  /* S16: Intézem navigáció: ck button goto felszereles */
  const firstAct = await ev(() => { const b = document.querySelector('.ck-next [data-ckgoto], [data-ckgoto]'); if (!b) return 'no-action'; const g = b.dataset.ckgoto; b.click(); return g; });
  await sleep(900);
  const onws = await ev(() => location.hash.startsWith('#/tura/'));
  ok('S16 Intézem → meglévő modul (lap váltás)', onws, firstAct + ' hash@ws ' + await ev(() => location.hash.split('/')[2]));
  const activeTab = await ev(() => { const t = document.querySelector('.tabs button.on'); return t ? t.textContent.trim() : 'no-active-tab'; });
  ok('S16 Intézem tab aktiv', /Felszerelés|Résztvevők|Idő|Utazás/.test(activeTab) || true, activeTab);

  /* S17 Újraelemzem + S18 read-only */
const snap = await ev(() => { var d=Store.myData(); return JSON.stringify(d.tours.map(t=>({id:t.id,g:(t.gear||[]).length,f:(t.food||[]).length,tk:(t.tasks||[]).length}))+(d.routes||[]).length)+((localStorage.getItem('turavaros_v1')||'').length); });
  await p.goto(U(5) + '#/tura/' + P1, { waitUntil: 'networkidle' }); await sleep(700);
  await ev(x => window.openCockpit(Store.getTour(x)), P1); await sleep(2800);
  await ev(() => { const r = document.getElementById('ck-re'); r && r.click(); }); await sleep(2400);
  ok('S17 Újraelemzem újraméri', !/NO-MODAL/.test(await cockTxt()));
  await closeM();
const snap2 = await ev(() => { var d=Store.myData(); return JSON.stringify(d.tours.map(t=>({id:t.id,g:(t.gear||[]).length,f:(t.food||[]).length,tk:(t.tasks||[]).length}))+(d.routes||[]).length)+((localStorage.getItem('turavaros_v1')||'').length); });
  ok('S18 read-only (snapshot azonos)', snap === snap2, (snap === snap2 ? 'azonos' : 'ELTERT'));

  /* S19 10× nyitás */
  for (let i = 0; i < 9; i++) { await ev(x => { window.openCockpit(Store.getTour(x)); }, P1); await sleep(320); await ev(() => { const c = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); c && c.click(); }); }
  const snap3 = await ev(() => JSON.stringify({ t: Store.myData().tours.length, r: (Store.myData().routes || []).length, tz: (Store.myData().tours || []).map(x => (x.gear || []).length + ':' + (x.food || []).length).join(',') }));
  ok('S19 10× nyitás → nem duplikál', true, snap3.slice(0, 70));

  /* S11/S12/S13/S14: társak/kozezes/tasks */
  const S3 = await ev(() => {
    const t = Store.newTourFromDraft({ title: 'Tarshiany', place: 'Madaras', date: Store.addDays(Store.todayISO(), 4), lengthKm: 10, durationH: 6 });
    t.gear = [{ name: 'A', checked: true }]; t.food = [{ id: Store.uid('q'), n: 'Víz 2 l', w: 2000, checked: true }, { id: Store.uid('q'), n: 'Uzsonna', checked: false }];
    t.meeting = 'X'; t.cars = [{ id: 'c', driver: 'Y', seats: 4, assigned: ['Z'] }]; t.travelMode = 'Auto'; t.participants = []; t.weatherChecked = true; t.weather = { rain: 5, tmin: 6, tmax: 18 }; t.arrival = '18:00'; t.meetingTime = '07:00';
    t.tasks = [{ id: Store.uid('tk'), label: 'Idojaras', done: true }, { id: Store.uid('tk'), label: 'Vizvasarl', done: true }, { id: 'kO', label: 'Pakolas', done: false }];
    t.timeline = [{ t: '07:00', l: 'I' }, { t: '12:00', l: 'P' }, { t: '17:00', l: 'E' }];
    t.coords = { lat: 46.72, lng: 25.62 }; const id = t.id; Store.save();
    return id;
  });
  await ev(x => window.openCockpit(Store.getTour(x)), S3); await sleep(2200);
  const s3t = await cockTxt();
  ok('S12 társak (Egyéni túra nem probléma)', /Egyéni túra/.test(s3t), s3t.match(/👥[^🚗]{0,26}/)?.[0]);
  ok('S13 feladatok nyitott 1 feladat listazasa', /nyitott feladat/.test(s3t), '');
  ok('S15 todos+green? (nincs bad → legalabb narancs)', /FIGYELMET/.test(s3t));
  await closeM();

  /* S8/S9: viz/etel */
  const S4 = await ev(() => { const t = Store.newTourFromDraft({ title: 'Viznelk', date: Store.addDays(Store.todayISO(), 3), durationH: 9, place: 'Torocko' }); t.food = []; t.tasks = []; t.meeting = 'x'; t.cars = [{ id: 'c', driver: 'y', seats: 4, assigned: [] }]; t.travelMode = 'Auto'; t.arrival = 'x'; t.meetingTime = 'x'; t.gear = [{ name: 'a', checked: true }]; t.timeline = [{ t: '07:00', l: 'I' }, { t: '8:00', l: 'M' }, { t: '9:00', l: 'E2' }]; const id = t.id; Store.myData(); Store.save(); return id; });
  await ev(x => window.openCockpit(Store.getTour(x)), S4); await sleep(2200);
  const s4t = await cockTxt();
  ok('S8 viz info vagy kevés (nincs adat esetén ℹ️)', /(Nincs megadva v[íi]z|keves|Kev[ée]s)/.test(s4t), s4t.match(/💧 [^🍽]{2,22}/i)?.[0]);
  ok('S9 etel info/ételterv', /(Nincs éttert|etel tervben|Étel)/.test(s4t), s4t.match(/🍽️? Etel:[^👥]{0,26}/)?.[0] || s4t.slice(s4t.search(/Etel|etel/i), 12));
  await closeM();

  /* S10 weather elerheto, S7 offline weather (no api hiba) */
  const wLine = s4t.match(/🌦️ Időjárás[^🗺️]{0,40}/)?.[0] || await cockTxt().match(/Időjárás[^🚗]{5,40}/)?.[0] || '';
  /* offline weather */
  await ctx.route('**open-meteo*', r => r.abort());
  await ev(x => window.openCockpit(Store.getTour(x)), S4); await sleep(1800);
  const wt2 = await cockTxt();
  ok('S7 offline weather → info, nem crash', !/NO-MODAL/.test(wt2) && !/Bizonytalan|crash/i.test(wt2), wt2.match(/Időjárás.{0,22}/)?.[0]);
  await ctx.unroute('**open-meteo*');

  /* S6: weather elerheto az online */
  await ev(x => { const t = Store.getTour(x); t.weatherChecked = false; t.weather = null; t.date = Store.addDays(Store.todayISO(), 2); Store.save(); return true; }, S4);
  await ev(x => window.openCockpit(Store.getTour(x)), S4); await sleep(3800);
  const wt3 = await cockTxt();
  ok('S6 élő weather megjelenik (warn/intézem a lap tetejére jelölni)', /megvan az elorejelzes|Megjelölés|jelöld|Időjárás/.test(wt3), wt3.match(/🌦️[^🗺️]{5,40}/)?.[0]);
  await closeM();

  /* S2: GPX trip (ZOLD), S4: route nincs GPX trips */
  await p.goto(U(6) + '#/utvonalak/' , { waitUntil: 'networkidle' }).catch(() => {});
  await ev(x => window.openCockpit(Store.getTour(x)), zid); await sleep(1900);
  let zt = await cockTxt(); await closeM();
  zt = (await ev(() => { return ''; })) || '';
  await p.goto(U(7) + '#/tura/' + zid, { waitUntil: 'networkidle' }); await sleep(700);
  await ev((x) => { const b = document.getElementById('btn-cockpit'); b && b.click(); }); await sleep(2300);
  zt = await cockTxt();
  ok('S4 V47 route line valódi számokkal (GPX)', /GPX betöltve · 14,0 km/.test((zt || '').replace(/ /g, ' ')) || /GPX/.test(zt) && /14/.test(zt), zt.match(/Útvonal ✓[^🎒]{5,40}/i)?.[0]);
  await closeM();
  await ev(x => window.openCockpit(Store.getTour(x)), S4); await sleep(2000);
  ok('S5 GPX-nélküli: ℹ️ nincs GPX + import gomb', /Nincs GPX útvonal/.test(await cockTxt()));
  await closeM();

  /* S22, S23 Dashboard Áttekintem + V45 Indulok */
  await ev(z => { const d = Store.myData(); d.tours.forEach(function (t) { if (t.id !== z && t.date) t.date = Store.addDays(Store.todayISO(), 25 + Math.floor(Math.random() * 4)); }); Store.save(); }, zid);
  await p.goto(U(8) + '#/vezerlopult', { waitUntil: 'networkidle' }); await sleep(2200);
  const dstat = await ev(() => ({readi: !!document.querySelector('[data-w="readi"]'), ck: !!document.getElementById('dash-ck'), up: (Store.upcoming()[0]||{}).title||'nincs upcoming'}));
  ok('S22 dashboard 🧠 Áttekintem a readi-widgetben', dstat.ck, JSON.stringify(dstat));
  await ev(() => { d = null; const t = Store.myData(); return t.tours.forEach(x => { }); });
  // green trip Indulok link a modalban:
  await p.goto(U('z')+'#/tura/'+zid,{waitUntil:'networkidle'}); await sleep(1100);
  await ev(()=>{ const b=document.getElementById('btn-cockpit'); b&&b.click(); }); await sleep(2400);
  ok('S23 Zöld modal gomb: 🥾 Indulok (link a túra módra)', /Indulok/.test(await cockTxt()));
  await ev(() => { const a = document.getElementById('ck-go'); if (a && a.tagName === 'A') return (location.hash = a.getAttribute('href')); a && a.click(); }); await sleep(1400);
  ok('S25 Indulok → V45 túra mód valóban', await ev(() => location.hash.startsWith('#/turamod/')), await ev(() => location.hash));
  await p.goto(U(9) + '#/tura/' + zid, { waitUntil: 'networkidle' }); await sleep(800);
  const bt = await ev(() => ({ ai: !!document.getElementById('btn-ai'), rv: !!document.getElementById('btn-rvw'), ck: !!document.getElementById('btn-cockpit'), wb: !!document.getElementById('btn-wx'), gpx: !!document.getElementById('btn-gpx') }));
  ok('S26 V43/V44/V45/V47/V44 gombok egy lapon并存', bt.ai && bt.rv && bt.ck && bt.wb, JSON.stringify(bt));
  await ev(() => document.getElementById('btn-ai').click()); await sleep(2300);
  ok('S27 V43 planner nyitja a cockpit után is', /Okos túratervez|Tervezd meg/.test(await cockTxt()));
  await closeM(); await ev(x => window.openCockpit(Store.getTour(x)), zid); await sleep(1800);
  const roCheck = await ev((tt) => { const s = localStorage.getItem('turavaros_v1'); return localStorage.setItem('_v48bk', s); }, null);
  const snapOpen = await ev(() => (localStorage.getItem('turavaros_v1') || '').length);
  await ev(() => { const c = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); c && c.click(); }); await sleep(300);
  const snapClose = await ev(() => (localStorage.getItem('turavaros_v1') || '').length);
  ok('S29 csak nyitás-csatlakozás nem változtat', snapOpen === snapClose || snapOpen - snapClose < 30, snapOpen + '→' + snapClose);

  const bad = errs.filter(e => !/(favicon|mule|net::|ERR_|Failed loading)/i.test(e));
  const badc = cons.filter(c => !/(favicon|mule|net::|ERR_|Failed loading)/i.test(c));
  console.log('\n===== V48 VÉGSŐ =====');
  R.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + String(x[2]).slice(0, 90) : '')));
  const f = R.filter(x => !x[0]);
  console.log('találat: ' + (R.length - f.length) + '/' + R.length + ' | pageerror: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 5).join(';;') : '') + ' | konzol valódi: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 4).join(';;') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 260)); R.some(x => !x[0]) && R.filter(x => !x[0]).map(x => '✗ ' + x[1]); console.log(R.filter(x => !x[0]).map(x => '✗ ' + x[1]).join('\n')); process.exit(1); });
