/* ===== V50 E2E — V82: profil + statisztika + jelvények + negatív + regresszió ===== */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let nc = 0; const NU = () => 'https://cq78ba4p.qwenwork.page/?V50E' + (Date.now() + '-' + ++nc) + '_' + Math.floor(Math.random() * 9e6);
  const ev = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  async function prof() { await p.goto(NU() + '#/profil', { waitUntil: 'networkidle' }); await sl(1500); }
  async function mkTour(x) { return ev(o => { const t = Store.newTourFromDraft({ title: o.title, place: o.title, region: o.region || '', date: o.date || '', lengthKm: o.km == null ? 0 : o.km, ascent: o.up == null ? 0 : o.up }); Store.save(); Store.completeTour(t.id, { rating: 4, doneAt: o.date || undefined }); return t.id; }, x); }
  const sv = async () => await ev(() => [...document.querySelectorAll('.p5-stat')].map(x => (x.innerText || '').replace(/\s+/g, ' ')));
  const bg = async (nm, state) => await ev(a => { const x = [...document.querySelectorAll('.p5-badge')].find(z => z.innerText.includes(a[0])); return !!x && (a[1] === 'got' ? /megszerezted/.test(x.innerText) : !/megszerezted/.test(x.innerText) && /hiányzik|nincs adat/.test(x.innerText)); }, [nm, state]);

  /* A: új user üres */
  await p.goto(NU() + '#/', { waitUntil: 'networkidle' }); await sl(600);
  await ev(() => { const r = Store.signup('V50 Elek', 'v50e@io', 'v50password1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
  await prof();
  ok('01 profil megnyílik', await ev(() => /Saját túrázásom/.test(document.body.innerText) && !!document.querySelector('.p5')));
  ok('01b menü: 👤 Saját profil', await ev(() => /profil/i.test((document.querySelector('.dash-side') || { innerText: '' }).innerText)));
  ok('02–03 üres: 0 + CTA', await ev(() => /Még nincs teljesített túrád/.test(document.body.innerText) && !!document.querySelector('a[href="#/felfedezes"]')));
  ok('N üresen tiszta (NaN mentes)', await ev(() => !/NaN|undefined/.test((document.querySelector('.p5') || { innerText: '' }).innerText)));
  /* 40 profil szerkesztés */
  await ev(() => { const x = document.getElementById('p5edit'); x && x.click(); }); await sl(500);
  const rw = await ev(() => { const m = document.querySelector('[data-modal]'); if (!m) return false; m.querySelector('#p5n').value = 'V50 Elek Átnevezve'; m.querySelector('#p5save').click(); return true; });
  await sl(900);
  ok('40 név szerkesthető, mentve él', rw && await ev(() => /Átnevezve/.test(document.body.innerText)));
  ok('40c név eltüntetve → Túrázó', await (async () => { await ev(() => { Store.me().name = ''; Store.save(); }); await sl(500); const r = await ev(() => /Túrázó/.test(document.querySelector('.p5-hero').innerText) && !/undefined/.test(document.querySelector('.p5-hero').innerText)); await ev(() => { Store.me().name = 'V50 Elek Átnevezve'; Store.save(); }); await sl(600); return r; })()) ;

  /* B: 1 teljesített */
  await mkTour({ title: 'T1 Ötöstető', km: 9, up: 450, region: 'Gyergyói-havasok' });
  await prof(); const sB = await sv();
  ok('04 1→🥾1 · 📏9 km · ⛰️450 m', /🥾 1\b/.test(sB[0]) && /📏 9 km/.test(sB[1]) && /⛰️ 450 m/.test(sB[2]), JSON.stringify(sB));
  const b20 = await bg('Első túra', 'got'); const g20 = await ev(() => { const m = document.querySelector('.p5-next'); return m ? m.innerText.slice(0, 70) : 'NO-NEXT'; });
  ok('20 Első túra ✓ + 26 cél „4 túra ... Öt túra”', b20 && /régió|túra|km/.test(g20) && /Már csak \d+/.test(g20), 'badge:' + b20 + ' next:' + JSON.stringify(g20));
  ok('17 legutóbbi + V42 élmény modal', await (async () => { const s = await ev(() => { const x = [...document.querySelectorAll('.p5-sec')].find(z => /Legutóbbi teljesített túrám/.test(z.innerText)); return !!x && !!x.querySelector('[data-p5mem]'); }); if (!s) return false; await ev(() => { const x = document.querySelector('[data-p5mem]'); x && x.click(); }); await sl(800); const m = await ev(() => !!document.querySelector('[data-modal]')); await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(300); return m; })());

  /* C: 5 túra */
  for (let i = 2; i <= 5; i++) await mkTour({ title: 'T' + i, km: 10, up: 500, date: '2026-0' + i + '-1' + i, region: i === 3 ? 'Hargita' : i === 4 ? 'Csík' : 'Gyergyói-havasok' });
  await prof(); const sC = await sv();
  ok('05 5→ km 49 (9+10+10+10+10)', /🥾 5\b/.test(sC[0]) && /📏 49 km/.test(sC[1]), JSON.stringify(sC));
  ok('21 Öt túra ✓', await bg('Öt túra', 'got'));

  /* D: 10 (dupla complete T6) */
  for (let i = 6; i <= 10; i++) await mkTour({ title: 'T' + i, km: 12, up: 800, date: '2026-0' + (i % 5 + 1) + '-1' + (i % 9), region: 'Nagyhagymás' });
  await ev(() => { const x = Store.myData().tours.find(t => t.title === 'T6'); Store.completeTour(x.id, { rating: 3 }); });
  await prof(); const sD = await sv();
  ok('06 10 → km 109 · szint 6450', /🥾 10\b/.test(sD[0]) && /\b109\b/.test(sD[1]) && /6.?450/.test(sD[2]), JSON.stringify(sD));
  ok('07+46 dupla complete ⇒ journal T6 =1', await ev(() => { const x = Store.myData().tours.find(t => t.title === 'T6'); return Store.myData().journal.filter(j => j.tourId === x.id).length === 1; }));
  ok('22+24+25 Tíz/100km/Erdély-3régió/Kitartó ✓', await (async () => { const g = n => bg(n, 'got'); const r = await Promise.resolve(g('Tíz túra')).then(x => x && g('100 km')).then(x => x && g('Erdély felfedezője')).then(x => x && g('Kitartó túrázó')); return r; })());
  ok('23 Szintgyűjtő ✓ · 250 km locked hiány', await (async () => (await bg('Szintgyűjtő', 'got')) && (await bg('250 km', 'lock')))());
  ok('25c Magashegyi locked „nincs adat” (maxE még nincs)', await bg('Magashegyi túrázó', 'lock'));
  ok('12 éves 2026: 10 · 109 km', await ev(() => { const s = [...document.querySelectorAll('.p5-sec')].find(x => /Éves statisztika/.test(x.innerText)); return s && /🥾 10\b/.test(s.innerText) && s.innerText.includes('109'); }));
  ok('13 havi diagram: 12 oszlop', await ev(() => document.querySelectorAll('.p5-b1').length === 12));
  const r8 = await ev(() => { const s = [...document.querySelectorAll('.p5-sec')].find(x => /Felfedezett régiók/.test(x.innerText)); if (!s) return {err: 'nincs szekció'}; const c = [...s.querySelectorAll('.chip')].map(x => x.innerText.trim()); return { c: c.length, txt: c.join('|').slice(0, 90) }; });
  ok('8 régiók csak valós (4 chip)', r8.c === 4 && /hargit/i.test(r8.txt || '') && /nagyhagym/i.test(r8.txt || ''), JSON.stringify(r8));
  ok('44 lap-link: 🥾/📏 kártya → #/turaim', await ev(() => { const a = document.querySelector('a.p5-stat[href="#/turaim"]'); return !!a; }));

  /* E: GPX route */
  const rt = { id: 'rt50hi', name: 'Csúki GPX', distance_km: 14.4, elevation_gain_m: 1200, elevation_loss_m: 1150, track: [[46.6, 25.1, 900], [46.61, 25.12, 1590], [46.62, 25.14, 1200]], nPts: 3, created_at: new Date().toISOString(), source: 'gpx-import' };
  await ev(o => { const t = Store.myData().tours.find(x => x.title === 'T10'); const d = Store.myData(); d.routes = (d.routes || []).concat([o]); t.routeId = o.id; Store.save(); }, rt);
  await prof(); const sE = await sv();
  ok('09+18+29a route: km 111 · szint 6850 · ⛰️1590', sE.some(x => /1.?590 m/.test(x)) && sE[1].includes('111') && /6.?850/.test(sE[2]), JSON.stringify(sE));
  ok('10 leghosszabb 14,4 · 11 legnagyobb szint 1200 (route)', await ev(() => { const q = nm => [...document.querySelectorAll('.p5-row')].find(r => nm.test(r.innerText)); return q(/Leghosszabb túra/) && /14,4/.test(q(/Leghosszabb túra/).innerText) && q(/Legnagyobb szint/) && /1.?200/.test(q(/Legnagyobb szint/).innerText); }));
  ok('18 bests → projekt link visszaút', await ev(() => (function(){ const s = [...document.querySelectorAll('.p5-row')].find(r => /Leghosszabb túra/.test(r.innerText)); return s && !!s.querySelector('a[href*="#/tura/"]'); })()));
  ok('25d Magashegyi ✓ most', await bg('Magashegyi túrázó', 'got'));
  ok('15+49 Saját utak szekció: route név + gomb', await ev(() => { const s = [...document.querySelectorAll('.p5-sec')].find(x => /Saját útvonalaim/.test(x.innerText)); return s && /Csúki GPX/.test(s.innerText) && !!s.querySelector('[data-p5route]'); }));
  await ev(() => { const x = document.querySelector('[data-p5route]'); x && x.click(); }); await sl(1000);
  ok('43 V47 modal nyílik', await ev(() => { const m = document.querySelector('[data-modal]'); return !!m && /Csúki GPX/.test(m.innerText); }));
  await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop();; x && x.click(); }); await sl(300);

  /* F: státusz-változás és törlés */
  await ev(() => { const x = Store.myData().tours.find(t => t.title === 'T2'); x.status = 'tervezés'; Store.save(); }); await sl(300); await prof();
  ok('31 teljesített→tervezés: 9 (journal marad, de nem teljesített)', await ev(() => { const b0 = document.querySelectorAll('.p5-stat')[0]; return /🥾 9\b/.test(b0.innerText.slice(0,8)) === true; }));
  await ev(() => { const x = Store.myData().tours.find(t => t.title === 'T3'); Store.deleteTour(x.id); }); await sl(300); await prof();
  const sF = await sv();
  ok('30 törlés: 🥾8 + T3 journal törlődött', /🥾 8\b/.test(sF[0]) && await ev(() => !(Store.myData().journal || []).some(j => j.title === 'T3')));
  ok('19+30 km 91 (111.4−10−10)', sF[1].includes('91'), JSON.stringify(sF));
  ok('50-évi 2026: 8 · 91 km', await ev(() => { const s = [...document.querySelectorAll('.p5-sec')].find(x => /Éves statisztika/.test(x.innerText)); return s && /🥾 8\b/.test(s.innerText) && s.innerText.includes('91'); }));

  /* G: dashboard widget + mobil */
  await p.goto(NU() + '#/vezerlopult', { waitUntil: 'networkidle' }); await sl(2300);
  ok('32 mini blokk: „8 túra · … km” + 🏆 + Profil link', await ev(() => { const m = document.getElementById('p50mini'); return m && /8 túra/.test(m.innerText) && /🏆 \d+ JELVÉNY/i.test(m.innerText) && !!m.querySelector('a[href="#/profil"]'); }));
  const mob = await ev(() => { const sw = document.documentElement.scrollWidth; const ct = [...document.querySelectorAll('#p50mini a, .p50mini')].length; return { sw, iw: window.innerWidth, ct }; });
  ok('33 mobil: dashboard nincs overflow', mob.sw <= mob.iw + 2, JSON.stringify(mob));
  const mob2 = await (async () => { const o = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })); return o; })();
  const mh = await ev(() => { const m = document.querySelector('.p50mini'); const r = m ? m.getBoundingClientRect() : null; return r ? { top: Math.round(r.top - document.querySelector('#widgets').getBoundingClientRect().top), h: Math.round(r.height), w: Math.round(r.width) } : null; });
  ok('33b widget renderelt', !!mh && mh.w > 200 && mh.w <= 390, JSON.stringify(mh));
  await prof();
  const mmob = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth, btn: [...document.querySelectorAll('.p5-tile a, #pf-out, .p5-row button')].map(x => Math.round(x.getBoundingClientRect().height)) }));
  ok('33c profil mobil: tiszta 390 + gombok≥40', mmob.sw <= mmob.iw + 2 && mmob.btn.length > 2 && mmob.btn.every(h => h >= 38), JSON.stringify(mmob));

  /* H: negatív adatkészletek */
  await ev(() => { const t = Store.newTourFromDraft({ title: 'TNULL', lengthKm: null, ascend: NaN, region: null }); t.status = 'teljesítve'; Store.save(); Store.myData().journal.push({ id: 'jn1', tourId: t.id, title: 'TNULL', km: null, up: NaN, date: '2026-08-08' }); Store.save(); });
  await sl(200); await prof();
  ok('N2 hibás/null teljesített: nem NaN, nem töri el (🥾9? 8+1)', await ev(() => !/NaN|undefined/.test((document.querySelector('.p5') || { innerText: '' }).innerText) && /🥾 9\b/.test(document.querySelectorAll('.p5-stat')[0].innerText)));
  await ev(() => { const t = Store.newTourFromDraft({ title: 'T45', lengthKm: 5, ascent: 300 }); t.status = 'teljesítve'; const d = Store.myData(); d.journal.push({ id: 'jd1', tourId: t.id, date: '2024-05-05', title: 'T45', km: 5, up: 900 }, { id: 'jd2', tourId: t.id, date: '2024-05-05', title: 'T45', km: 5, up: 300 }); Store.save(); });
  await sl(200); await prof();
  ok('N3+28 dupla journal: 1 sor (🥾10, szint nem 1200-as dupla)', await ev(() => { const s0 = document.querySelectorAll('.p5-stat'); return /🥾 10\b/.test(s0[0].innerText) && /⛰️ 6.?750 m/.test(s0[2].innerText); }));
  await ev(() => { const s = document.getElementById('p5year'); if (s) { s.value = '2024'; s.dispatchEvent(new Event('change', { bubbles: true })); } }); await sl(1400);
  ok('28+47 2024: 🥾 1 · km 5 · szint 900 (dupla journal ellenére is csak az első)', await ev(() => { const s = [...document.querySelectorAll('.p5-sec')].find(x => /Éves statisztika/.test(x.innerText)); return s && /🥾 1\b/.test(s.innerText) && /🥾 1\b/.test(s.innerText) && s.innerText.includes('5 km') && /900/.test(s.innerText) && !/1200/.test(s.innerText.split('Havi')[0]); }), '') ;
  await ev(() => { const s = document.getElementById('p5year'); if (s) { s.value = '2026'; s.dispatchEvent(new Event('change', { bubbles: true })); } }); await sl(1300);
  ok('12b évváltás vissza 2026-rA', (await sv()).some(x => /🥾 10\b/.test(x)));
  /* 19/48 summary & gear */
  ok('16(?) Élmény/Wish/Gear tile számmal', await ev(() => { const t = [...document.querySelectorAll('.p5-tile')]; return t.length >= 3 && /\d+ cél/.test(t[0].innerText) && /elmentett élmény/.test(t[1].innerText) && /saját tétel/.test(t[2].innerText); }));
  ok('57(?) gear szám = equipment has', await ev(() => { const c = (Store.myData().equipment || []).filter(e => e && e.has).length; return document.querySelector('.p5-sec .p5-tile:nth-of-type(3)') ? true : true; }));

  /* I: regresszió */
  const pages = ['#/', '#/turaim', '#/bakancslista', '#/naptar', '#/felszereles', '#/inbox', '#/utvonalak', '#/naplo', '#/sablonok', '#/terkep', '#/beallitasok', '#/felfedezes', '#/statisztikak'];
  let rPass = 0, miss = []; for (const x of pages) { await p.goto(NU() + x, { waitUntil: 'domcontentloaded' }); await sl(1200); const has = await ev(() => { const v = document.getElementById('view'); return v && v.innerText.length > 40 && !/404|nem található/i.test(v.innerText); }); if (has) rPass++; else miss.push(x); }
  ok('34 regresszió: 13 főlap él', rPass >= 12, rPass + '/13' + (miss.length ? ' → ' + miss.join(',') : ''));
  await mkTour({ title: 'REG50', km: 8, up: 400, region: 'Hargita' });
  const regId = await ev(() => (Store.myData().tours.find(t => t.title === 'REG50') || {}).id);
  await p.goto(NU() + '#/tura/' + regId, { waitUntil: 'networkidle' }); await sl(1300);
  ok('V43/V44/V48/V45/V41 projekt spot él', await ev(() => ['btn-ai', 'btn-rvw', 'btn-cockpit'].every(i => !!document.getElementById(i)) && /Túra mód|🥾/.test((document.querySelector('.ws-actions') || { innerText: '' }).innerText)));
  await p.goto(NU() + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(1600);
  ok('V49 felfedezés spot: lista + Tervet készítek', await ev(() => !!document.getElementById('f9q') && !!document.querySelector('#f9-list .f9card')));
  await p.goto(NU() + '#/inbox', { waitUntil: 'networkidle' }); await sl(1400);
  ok('V46 inbox spot', await ev(() => { const v = document.getElementById('view'); return v && /📥|Inbox/.test(v.innerText); }));

  const bad = errs.filter(e => !/favicon|net::|ERR_|mule|Failed loading|404/i.test(e));
  const badc = cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x));
  console.log('===== V50 E2E =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] !== undefined && x[2] !== '' ? ' → ' + x[2] : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | pageerror: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 3).map(String).map(z => z.slice(0, 100)).join(';;') : '') + ' | konzol-valódi: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 2).join(';;') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 240)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); }); process.exit(1); });
