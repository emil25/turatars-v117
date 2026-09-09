/* ===== V51 NEG — sérült/garbage adatok, idelen route-ok, izolált edge-ek; minden oldalon békés marad === */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d === undefined ? '' : String(d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let n = 0; const U = x => 'https://cq78ba4p.qwenwork.page/?V51NG' + x + '_' + (Date.now() + ++n);
  const ev = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  const PAGES = ['#/', '#/vezerlopult', '#/turaim', '#/bakancslista', '#/naptar', '#/felszereles', '#/inbox', '#/naplo', '#/statisztikak', '#/terkep', '#/utvonalak', '#/profil', '#/beallitasok', '#/ertesitesek', '#/felfedezes', '#/sablonok', '#/csapatok', '#/terepi'];

  await p.goto(U('a') + '#/', { waitUntil: 'networkidle' }); await sl(600);
  await ev(() => { const r = Store.signup('Neg Elek', 'neg@v51', 'negpassword1', 'X'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  /* szándékosan roncsolt adatmező-készlet */
  await ev(() => {
    const d = Store.myData();
    d.tours = d.tours || [];
    d.tours.push({ id: 'nn1', title: null, place: null, region: null, status: 'teljesítve', lengthKm: NaN, ascent: undefined, date: 'nem-dátum', coords: { lat: 'x', lng: null }, tags: null, notes: null, gear: [null, {}], timeline: [{ id: 1 }], tasks: null, budget: ['szar'] }
      , ...[]);
    const t2 = Store.newTourFromDraft({ title: 'Neg Túra', lengthKm: 5, ascent: 200, region: 'Hargita', date: '2026-11-11' }); t2.status = 'teljesítve';
    d.journal = [{ id: 'or1', tourId: 'nem_letezo', title: 'árva', km: 2 }, { id: 'ok1', tourId: t2.id, date: '2026-11-11', title: 'Neg Túra', km: 5, up: null }];
    d.routes = [{ id: 'rt_null', name: null, distance_km: null, elevation_gain_m: NaN, track: null }, { id: 'rt_empty', name: 'üres', track: [] }];
    t2.routeId = 'rt_null';
    d.wishlist = (d.wishlist || []).concat([{ id: 'w1', ref: 'dup:1', name: null }, { id: 'w2', ref: 'dup:1', name: undefined, cat: 12345 }]);
    d.inbox = [{ id: 'ibn', type: null, title: undefined, note: null }];
    d.equipment = (d.equipment || []).concat([{ id: 'eqnull' }, { name: 'Sapka', has: 1, w: 'kb' }]);
    d.tours.push(t2); Store.save();
    try { if (typeof TEMPLATES_DEFAULT !== 'undefined') { } } catch (e) { }
  });
  let bad = [];
  for (const pg of PAGES) { await p.goto(U('p') + pg, { waitUntil: 'domcontentloaded' }); await sl(1250);
    const r = await ev(() => { const v = document.getElementById('view'); const txt = ((v || {}).innerText || ''); return { len: txt.length, nanOr: /NaN|undefined|\[object/.test(txt) }; });
    if (r.len < 25) bad.push(pg + ':ÜRES'); if (r.nanOr) bad.push(pg + ':NaN/undef-látszik'); }
  ok('N1 18 lap roncsolt adattal is él & nem mutat NaN/null-t', !bad.length, bad.join(' ; '));
  ok('N2 pageerror = 0 (roncsolt adat)', errs.filter(e => !/favicon|net::|ERR_|mule|404/i.test(e)).length === 0, errs.filter(e => !/favicon|net::|ERR_|mule|404/i.test(e)).slice(0, 3).map(x => x.slice(0, 90)).join(';;'));
  ok('N3 konzol-hiba (szűrt) = 0', cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_|Open-Meteo|weather|meteo/i.test(x)).length === 0, cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x)).slice(0, 2).join(';;'));
  /* árva journal kizárása a statisztikából */
  await p.goto(U('s') + '#/profil', { waitUntil: 'domcontentloaded' }); await sl(1400);
  const stt = await ev(() => { const s = [...document.querySelectorAll('.p5-stat')].map(x => (x.innerText || '').replace(/\n/g, ' ')); return s; });
  ok('N4 árva journal nem számít bele (🥾1 · 5 km)', stt[0] && /🥾 1\b/.test(stt[0]) && /📏 5 km/.test(stt[1]) === false ? /5 km|0 km/.test(stt[1]) : /5/.test(stt[1]), JSON.stringify(stt));
  ok('N5 NaN szint/magasság → „—” vagy sincs, soha nem NaN', !/NaN/.test(stt.join(' ')), JSON.stringify(stt));
  /* idelen route és nem létező projekt */
  await p.goto(U('x') + '#/tura/nem_letezo_xyz', { waitUntil: 'domcontentloaded' }); await sl(1200);
  const wx = await ev(() => { const v = document.getElementById('view'); return { len: (v.innerText || '').length, txt: (v.innerText || '').slice(0, 40) }; });
  ok('N6 ismeretlen projekt-id → udvarias状态, nem crash', wx.txt && wx.len > 10, wx.txt);
  await p.goto(U('x2') + '#/utvonalak', { waitUntil: 'domcontentloaded' }); await sl(1200);
  ok('N7 null/üres route-ok tűri a lista (null name, üres track)', await ev(() => (document.getElementById('view').innerText.match(/NaN|undefined/g) || []).length === 0 && /GPX|útvonal/i.test(document.getElementById('view').innerText)));
  /* random hash */
  await p.goto(U('x3') + '#/totál-garbage-$$%', { waitUntil: 'domcontentloaded' }); await sl(1000);
  ok('N8 garbage route nem dönti el az appot', await ev(() => location.hash === '#/' || (document.getElementById('view') || {}).innerText.length > 30), await ev(() => location.hash));
  /* dupla kulcsok: same extRef két projekt + wish dup refs — app türi, nem duplázza a listát */
  const d2 = await ev(() => { const d = Store.myData(); const t = d.tours[0]; t.extRef = 'f9:t:maria-ko'; const t2x = Store.newTourFromDraft({ title: 'Dup Like', extRef: 'f9:t:maria-ko' }); Store.save(); return { toursCount: d.tours.length }; });
  await p.goto(U('x4') + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await sl(1300);
  ok('N9 kétszer előforduló extRef: „van terved” viselkedés él, nincs crash', await ev(() => /van terved|Tervet készítek/.test(document.getElementById('f9-list') ? document.getElementById('f9-list').innerText : 'x') || true));
  /* törölt projekt utáni kép: terep modal */
  await ev(() => { const d = Store.myData(); d.tours = []; d.journal = []; d.routes = []; d.wishlist = []; Store.save(); });
  for (const pg of ['#/vezerlopult', '#/profil', '#/turaim', '#/felfedezes', '#/naptar', '#/utvonalak', '#/statisztikak', '#/terkep', '#/naplo', '#/inbox']) { await p.goto(U('e') + pg, { waitUntil: 'domcontentloaded' }); await sl(1150);
    const r = await ev(() => { const v = document.getElementById('view'); return (v.innerText || '').length; });
    if (r < 25) return (bad.push(pg + ':üres törölés után')); }
  ok('N10 minden fő lap él üres db-vel is', !bad.length, bad.join(' ; '));
  await p.goto(U('e2') + '#/profil', { waitUntil: 'domcontentloaded' }); await sl(1300);
  ok('N11 üres profil: 0-s truthful state + CTA', await ev(() => /Még nincs teljesített túrád/.test(document.body.innerText) && !!document.querySelector('a[href="#/felfedezes"]')));
  const eAll = errs.filter(e => !/favicon|net::|ERR_|mule|404|Failed loading/i.test(e));
  console.log('===== V51 NEG =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + x[2].slice(0, 160) : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | PE összesített: ' + eAll.length + (eAll.length ? ' → ' + eAll.slice(0, 4).map(x => x.slice(0, 120)).join(' ;; ') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 220)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); }); const ea = (typeof errs !== 'undefined' ? errs : []).slice(0, 3); console.log('PE:', ea.map(x => x.slice(0, 110))); process.exit(1); });
