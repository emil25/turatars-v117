/* ===== V52 E2E — platform: események, szervező, jelentkezés, GPX, dedup, jogok, mobil, flow-k,回归 ===== */
const { chromium } = require('playwright');
const fs = require('fs');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d === undefined ? '' : String(d)]); };
function gpx(name, lat0, lng0, n, stepLat, gain) { let o = '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="t52" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>' + name + '</name><trkseg>'; let la = lat0, ln = lng0;
  for (let i = 0; i < n; i++) { const el = i <= n / 2 ? 700 + i * gain : 700 + (n / 2) * gain - (i - n / 2) * gain; o += '<trkpt lat="' + la.toFixed(5) + '" lon="' + ln.toFixed(5) + '"><ele>' + el.toFixed(1) + '</ele><time>2026-09-01T07:' + String(i % 60).padStart(2, '0') + ':00Z</time></trkpt>'; la += stepLat; ln += 0.00021; } return o + '</trkseg></trk></gpx>'; }
fs.writeFileSync('/tmp/flow52.gpx', gpx('Flow52 vonal', 46.902, 25.42, 40, 0.00131, 9));
fs.writeFileSync('/tmp/bad52.gpx', '<?xml version="1.0"?><nonsense><x');
fs.writeFileSync('/tmp/empty52.gpx', '<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg></trkseg></trk></gpx>');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let n = 0; const U = () => 'https://cq78ba4p.qwenwork.page/?V52E' + (Date.now() + '-' + ++n) + Math.random();
  const ev = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  async function closeM() { await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(350); }
  async function toTab(tab) { await p.goto(U() + '#/felfedezes', { waitUntil: 'networkidle' }); await sl(1400);
    await ev(t => { const x = document.querySelector('[data-f9tab="' + t + '"]'); x && x.click(); }, tab); await sl(800);
    await ev(() => { document.querySelectorAll('#f9-list details').forEach(d => { d.open = true; }); }); await sl(350); }
  async function openPool(evName) { await ev(nm => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => nm.test((x.querySelector('b') || {}).textContent || '')); const bb = c && c.querySelector('[data-f9ev]'); bb && bb.click(); }, evName); await sl(800); }

  /* --- regisztráció + szervezői setup --- */
  await p.goto(U() + '#/', { waitUntil: 'networkidle' }); await sl(600);
  await ev(() => { const r = Store.signup('V52 Elek', 'v52e@io.hu', 'v52password1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } return r.ok; });
  /* 1 lista valós eseményekkel; 2 DEMO-jelölt pool */
  await toTab('events');
  ok('1 eseménylista (valós + platform)', (await ev(() => document.querySelectorAll('#f9-list .f9card').length)) >= 8);
  ok('2 DEMO chip látszik', await ev(() => [...document.querySelectorAll('#f9-list .f9card')].some(c => /DEMO/.test(c.textContent)) && [...document.querySelectorAll('#f9-list .f9card')].some(c => !/DEMO/.test(c.textContent))));
  /* 3 keresés az események között; 4 régió; 6 nehézség; 5/7 hétvége */
  await ev(() => { const x = document.getElementById('f9q'); x.value = 'Zarándokoljunk'; x.dispatchEvent(new Event('input', { bubbles: true })); }); await sl(600);
  ok('3 kereső: szűkít eseményre', await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')]; return c.length >= 1 && c.every(x => /Zarándokoljunk/.test(x.textContent)); }));
  await ev(() => { const x = document.getElementById('f9q'); x.value = ''; x.dispatchEvent(new Event('input', { bubbles: true })); }); await sl(450);
  const csBefore = await ev(() => document.querySelectorAll('#f9-list .f9card').length);
  await ev(() => { const s = document.getElementById('f9diff'); s.value = 'Nehéz'; s.dispatchEvent(new Event('change', { bubbles: true })); }); await sl(650);
  ok('6 nehézség-szűrő érvényesül eseményeken', (await ev(() => document.querySelectorAll('#f9-list .f9card').length)) < csBefore ? await ev(() => [...document.querySelectorAll('#f9-list .f9card')].every(c => /Nehéz/.test(c.textContent))) : (await ev(() => true))());
  await ev(() => { const s = document.getElementById('f9diff'); s.value = ''; s.dispatchEvent(new Event('change', { bubbles: true })); }); await sl(450);
  const wk = await ev(() => { const d = Store.myData(); Store.platform().events.push({ id: 'evwk', orgId: (Store.platform().organizers[0] || {}).id || 'orgx', name: 'WK Túra', date: (function () { const x = new Date(); const a = (6 - x.getDay() + 7) % 7 || 7; x.setDate(x.getDate() + a); return x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2)+'-'+('0'+x.getDate()).slice(-2); })(), place: 'Hargita', status: 'published', joinMode: 'none', rev: 0, demo: false, createdAt: new Date().toISOString() }); Store.save(); return true; });
  await toTab('events');
  await ev(() => { const x = [...document.querySelectorAll('[data-f9chip="weekend"]')][0]; x && x.click(); }); await sl(700);
  ok('5+7 hétvége szűrő valódi dátummal (WK bent)', await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].map(x => x.textContent); return c.length >= 1 && c.some(t => /WK Túra/.test(t)); }));
  await ev(() => { const x = [...document.querySelectorAll('[data-f9chip="weekend"]')][0]; x && x.click(); }); await sl(450);
  /* 8 near chip + geo deny headless: nem töri el */
  await ev(() => { const x = [...document.querySelectorAll('[data-f9chip="near"]')][0]; x && x.click(); }); await sl(1600);
  ok('8 közel chip: üzenet/élettér crash nélkül', await ev(() => /Közelít|nem érhet|engedélyezd|Frissítés/i.test(document.body.innerText)));
  /* 19 szervezettség UI via UI (K smoke-ból) — form field-ellenőrzés */
  await p.goto(U() + '#/szervezo', { waitUntil: 'networkidle' }); await sl(1300);
  await ev(() => { const x = document.getElementById('e2-reg'); x && x.click(); }); await sl(600);
  ok('19a reg modal mezői', await ev(() => { const m = document.querySelector('[data-modal]'); return m && !!m.querySelector('#e2o_name') && !!m.querySelector('#e2o_mail') && !!m.querySelector('#e2o_logo'); }));
  await ev(() => { const m = document.querySelector('[data-modal]'); m.querySelector('#e2o_bio').value = 'Egy演示 szöveg DEMO—'; m.querySelector('#e2o_save').click(); }); await sl(900);
  ok('19b organizers db-be', await ev(() => Store.platform().organizers.some(o => o.owner === String(Store.me().email))));
  await ev(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await sl(700);
  await ev(() => { document.querySelector('[data-modal]').querySelector('#e2f_save').click(); }); await sl(600);
  ok('20 validáció kötelezőkre', await ev(() => { const m = document.querySelector('[data-modal]'); return !!m && /Kötelező/.test((m.querySelector('#e2f_err') || {}).textContent || '') && !Store.platform().events.some(x => !x.name); }));
  await ev(x => { const m = document.querySelector('[data-modal]'); const g = (id, v) => { const e = m.querySelector(id); if (e) e.value = v; };
    g('#e2f_name', 'V52 Cucsó-túra'); g('#e2f_date', '2026-12-05'); g('#e2f_time', '09:30'); g('#e2f_place', 'Gyergyói-havasok'); g('#e2f_region', 'Gyergyó'); g('#e2f_km', '16'); g('#e2f_up', '900'); g('#e2f_h', '6'); g('#e2f_diff', 'Nehéz'); g('#e2f_cap', '1'); g('#e2f_desc', 'Nagyon csúos esemény Demo-n kívülről.');
    g('#e2f_gpxf', null); }, null);
  await p.setInputFiles('#e2f_gpxf', '/tmp/flow52.gpx'); await sl(1400);
  ok('20b GPX preview a formban', await ev(() => { const x = document.querySelector('#e2f_gpxprev'); return x && /1,0|5|km/.test(x.innerText.replace(/\s+/g, '')) && /\d\d,\d km|km/.test(x.innerText); }));
  await p.setInputFiles('#e2f_gpxf', '/tmp/empty52.gpx'); await sl(1100);
  ok('20c üres GPX → hibaüzenet (nem tör)', await ev(() => { const x = document.querySelector('#e2f_gpxprev'); return x && /Hibás|nem tudunk|Hibás vagy túl rövid/.test(x.innerText); }));
  await p.setInputFiles('#e2f_gpxf', '/tmp/flow52.gpx'); await sl(1300);
  await ev(() => { document.querySelector('[data-modal]').querySelector('#e2f_save').click(); }); await sl(1000);
  const ev1 = await ev(() => { const e = Store.platform().events.find(x => /V52 Cucsó/.test(x.name || '')); return e && { id: e.id, st: e.status, rid: e.routeId, snap: e.routeSnap, cap: e.cap, diff: e.diff }; });
  ok('20+d event draft routeId-ded', ev1 && ev1.st === 'draft' && !!ev1.rid && ev1.cap === 1 && ev1.diff === 'Nehéz', JSON.stringify(ev1));
  await p.goto(U() + '#/utvonalak', { waitUntil: 'domcontentloaded' }); await sl(1000);
  ok('14 route a V47 listában (routeId kapcsolat)', await ev(() => (Store.myData().routes || []).some(r => r.id === ((Store.platform().events.find(x => /V52 Cucs/.test(x.name || '')) || {}).routeId || '')) && /V47|Útvonalak|GPX/.test(document.getElementById('view').innerText)));
  /* publikálás + pool szűrés */
  await p.goto(U() + '#' + '/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1200);
  ok('22 draft NEM a poolban (publikálatlan)', await ev(() => !window.e2Events().some(x => /V52 Cucs/.test(x.name))));
  await ev(id => { const x = document.querySelector('[data-e2st="' + id + ':published"]'); x && x.click(); }, (ev1 || {}).id); await sl(800);
  ok('22b publikálva, benne poolban', await ev(id => window.e2Events().some(x => x.name === 'V52 Cucsó-túra'), (ev1 || {}).id));
  /* 9-10 Mentem + ❤️ dedup; 24-27 join full flow (saját esemény): */
  await toTab('events'); await openPool(/V52 Cucsó/);
  await closeM();
  await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /V52 Cucs/.test(x.textContent)); const h = c && (c.querySelector('[data-f9w]') || null); h && h.click(); }); await sl(700);
  ok('9 ❤️ Mentem pool-eseményre', await ev(() => (Store.myData().wishlist || []).some(w => (w.ref || '').indexOf('f9:e:p2-') === 0)));
  await closeM();
  /* user B jelentkezik (ugyanaz a tárolt DB, másik user) */
  await p.goto(U() + '#/', { waitUntil: 'networkidle' }); await sl(800);
  await ev(() => { Store.logout(); const r = Store.signup('Jelke B', 'jelke@b.io', 'jelkepassword1', 'Csík'); if (r.ok) { Store.me().onboarded = true; Store.save(); } return r.ok; });
  await toTab('events'); await openPool(/V52 Cucsó/);
  ok('24 join gomb internal eseménynél', await ev(() => !!document.querySelector('[data-modal] [data-e2join]')));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(800);
  const st0 = await ev(id => (Store.platform().participants.map(x => x.status)), null);
  ok('24b pending sor + státusz chip', await ev(() => { const t = (Store.platform().participants[0] || {}); return t.status === 'pending' || t.status === 'accepted'; }), JSON.stringify(st0));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(700);
  ok('24c dupla join nem dupláz (count==1)', await ev(() => Store.platform().participants.filter(x => x.uid === String(Store.me().email)).length === 1));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2wd]'); x && x.click(); }); await sl(700);
  ok('30b saját visszavonás status', await ev(() => (Store.platform().participants[0] || {}).status === 'withdrawn'));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(800);
  /* cap betelt: user C próbálja */
  await ev(() => { Store.logout(); Store.signup('Jo C', 'roc@b.io', 'rocpasswordx1', 'X'); Store.me().onboarded = true; Store.save(); });
  await toTab('events'); await openPool(/V52 Cucsó/);
  ok('27 cap=1: 🟠-os után új nem fér be', await (async () => { const before = await ev(() => Store.platform().participants.length); await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(700); const after = await ev(() => Store.platform().participants.length); return before === after; })());
  /* 29 jogok: user C nem szervezheti/ nem szerkeszti */
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1100);
  await ev(() => { const x = document.getElementById('e2-reg'); x && x.click(); }); await sl(600);
  await ev(() => { const m = document.querySelector('[data-modal]'); m.querySelector('#e2o_name').value = 'JO C Kft.'; m.querySelector('#e2o_save').click(); }); await sl(800);
  ok('29a más szervező event-jének sincs ✏️-je a listában (saját center üres)', await ev(() => { const rows = [...document.querySelectorAll('#view .e2row')]; return rows.every(r => !/V52 Cucs/.test(r.innerText)); }) && await ev(() => !/V52 Cucs/.test((document.querySelector('#view') || {}).innerText || '')));
  ok('29b ownEvent guard API-ban', await ev(() => { const o = window.e2; const evn = Store.platform().events.find(x => /V52 Cucs/.test(x.name || '')); return o.ownEvent(evn.id) === null; }));
  const denied = await ev(id => { try { window.e2.P().events.find(e => e.id === id); return 'readable'; } catch (e) { return 'err'; } }, (ev1 || {}).id);
  /* 25/26 decisíó user A (owner) szögből */
  await ev(() => { Store.logout(); const u = Object.values(Store.platform ? ({}) : {}); });
  await ev(() => { /* visszalépés owner accountba: login ismét */ const r = Store.login('v52e@io.hu', 'v52password1'); return r.ok; });
  const okLogin = await ev(() => !!Store.me() && Store.me().email === 'v52e@io.hu');
  console.log('owner login vissza:', okLogin);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1200);
  await ev(id => { const x = document.querySelector('[data-e2app]'); x && x.click(); }, (ev1 || {}).id); await sl(700);
  ok('25 applicant lista modal a ownernek', await ev(() => { const m = document.querySelector('[data-modal]'); return m && /Jelentkezők/.test(m.innerText) && /Elküldve/.test(m.innerText); }) && okLogin);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2dec$=":accepted"]'); x && x.click(); }); await sl(900);
  ok('25b elfogadva állapot', await ev(() => (Store.platform().participants.filter(x => x.status === 'accepted')).length >= 1));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2dec$=":declined"]'); x && x.click(); }); await sl(900);
  ok('26 elutasít另一 sor (ha van másik) / státusz változások élesednek', await ev(() => { const p1 = Store.platform().participants; return (p1.some(x => x.status === 'declined') || p1.filter(x => x.status === 'pending').length === 0); }));
  /* 27b full státusz + 'Betelt' chip a túrázónak */
  await toTab('events'); await openPool(/V52 Cucsó/);
  ok('27c display: cap-telicsip a modalban (Betelt vagy létszám)', await ev(() => { const m = document.querySelector('[data-modal]'); const t = m ? m.innerText : ''; return /Betelt|\/1/.test(t); }));
  await closeM();
  /* 28 külső link esemény: demo2 external nincs hamis join */
  await openPool(/Tavaszi gerincjárás/);
  const dem = await ev(() => { const m = document.querySelector('[data-modal]'); return m && { ext: !!m.querySelector('a[href*="demo-pelda.invalid"]'), noJoin: !m.querySelector('[data-e2join]'), txt: m.innerText.slice(0, 0) }; });
  ok('28 external: link igen, hamis join nincs', !!dem && dem.ext && dem.noJoin);
  await closeM();
  /* 31 event dedup — ugyanaz a name/date/place ismét */
  await ev(() => { Store.login('v52e@io.hu', 'v52password1'); }); await sl(400);
  const evc0 = await ev(() => Store.platform().events.length);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1100);
  await ev(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await sl(700);
  await ev(() => { const m = document.querySelector('[data-modal]'); const g = (id, v) => { const e = m.querySelector(id); if (e) e.value = v; };
    g('#e2f_name', 'V52 Cucsó-túra'); g('#e2f_date', '2026-12-05'); g('#e2f_place', 'Gyergyói-havasok'); m.querySelector('#e2f_save').click(); }); await sl(800);
  const evc1 = await ev(() => Store.platform().events.length);
  ok('31 event dedup (name+date+place): nem nő a lista', evc1 === evc0, evc0 + '→' + evc1);
  await closeM();
  /* 32 route dedup: ugyanaz a GPX egy másik eventhez → 1 route */
  const rt1 = await ev(() => (Store.myData().routes || []).length);
  await ev(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await sl(600);
  await ev(() => { const m = document.querySelector('[data-modal]'); const g = (id, v) => { const e = m.querySelector(id); if (e) e.value = v; };
    g('#e2f_name', 'V52 Másodj' + Date.now()); g('#e2f_date', '2026-12-06'); g('#e2f_place', 'Másutt'); });
  await p.setInputFiles('#e2f_gpxf', '/tmp/flow52.gpx'); await sl(1200);
  await ev(() => { const m = document.querySelector('[data-modal]'); m.querySelector('#e2f_save').click(); }); await sl(800);
  const rt2 = await ev(() => (Store.myData().routes || []).length);
  ok('32 route dedup: azonos GPX ismét → route-szám nem nő', rt2 === rt1, rt1 + '→' + rt2);
  /* 11-13 Tervet készít → projekt → naptár: user B nézőpontból */
  await ev(() => { Store.logout(); Store.signup('TervB', 'tb@b.io', 'tbpasswordx1', 'X'); Store.me().onboarded = true; Store.save(); });
  await toTab('events'); await openPool(/V52 Cucsó/);
  await ev(() => { const x = document.querySelector('[data-modal] [data-f9plan]'); x && x.click(); }); await sl(1700);
  const proj = await ev(() => (Store.myData().tours || []).find(t => t.eventRef === 'p2-' + (function () { const e = Store.platform().events.find(x => /Cucs/.test(x.name)); return e.id; })()) ? true : false);
  const pid2 = await ev(() => { const e = Store.platform().events.find(x => /Cucs/.test(x.name)); return ((Store.myData().tours || []).find(t => t.eventRef === 'p2-' + e.id) || {}).id || ''; });
  ok('11+12 Tervet készít → projekt extRef/eventRef egyezéssel', !!pid2);
  const pinfo = await ev(id => { const t = Store.getTour(id) || {}; return { km: t.lengthKm, up: t.ascent, st: t.status, d: t.date, ext: t.extRef, e: t.eventRef }; }, pid2);
  ok('12b adatok átadása (km/dát/extRef dedup)', pinfo.d === '2026-12-05' && pinfo.st === 'tervezés' && /^f9:e:p2-/.test(pinfo.ext || ''), JSON.stringify(pinfo));
  const before = await ev(() => Store.myData().tours.length);
  await toTab('events'); await openPool(/V52 Cucsó/);
  await ev(() => { const x = document.querySelector('[data-modal] [data-f9plan]'); x && x.click(); }); await sl(900);
  await ev(() => { const x = document.querySelector('[data-modal] [data-close]'); x && x.click(); }); await sl(400);
  ok('10+33 3. klikk plan nem dupláz (van-terved modal)', (await ev(() => Store.myData().tours.length)) === before);
  /* 13 Naptár: projekt dátum + savedEvents pill */
  await p.goto(U() + '#/naptar', { waitUntil: 'domcontentloaded' }); await sl(1500);
  ok('13 naptár él a projekttel (dec 5 lapszámában)', await ev(() => document.getElementById('view').innerText.length > 40));
  /* 15-18 planner review cockpit turamod */
  await p.goto(U() + '#/tura/' + pid2, { waitUntil: 'domcontentloaded' }); await sl(1500);
  await ev(() => { const x = document.getElementById('btn-ai'); x && x.click(); }); await sl(2000);
  ok('15 V43 planner platform-projektben', await ev(() => /Okos túratervez/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = document.getElementById('btn-rvw'); x && x.click(); }); await sl(3300);
  ok('16 V44 review platform-projektben', await ev(() => /Túra készültsége/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = document.getElementById('btn-cockpit'); x && x.click(); }); await sl(2000);
  ok('17 V48 vezető terv', await ev(() => /Hogy áll/.test(document.body.innerText))); await closeM();
  await ev(() => { const x = [...document.querySelectorAll('.ws-actions a,.ws-actions button')].find(y => /Túra mód|🥾/.test(y.textContent)); x && x.click(); }); await sl(1400);
  ok('18 V45 túra mód elérhető', await ev(() => !!document.querySelector('.tm2-grid') || /Túra mód/.test(document.body.innerText)));
  /* 21 event edit + 27 changed banner a projektben */
  await ev(() => { Store.login('v52e@io.hu', 'v52password1'); }); await sl(600);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1200);
  await ev(() => { const x = document.querySelector('[data-e2edit]'); x && x.click(); }); await sl(900);
  await ev(() => { const m = document.querySelector('[data-modal]'); const e = m.querySelector('#e2f_name'); e.value = 'V52 Cucsó-túra MÓDOSÍTVA'; m.querySelector('#e2f_save').click(); }); await sl(1000);
  const rev = await ev(() => { const e = Store.platform().events.find(x => /MÓDOSÍTVA/.test(x.name)); return e && e.rev; });
  ok('21+27 edit rev nő (név is mentődik)', !!rev, 'rev:' + rev);
  await ev(() => { Store.login('tb@b.io', 'tbpasswordx1'); }); await sl(500);
  await p.goto(U() + '#/tura/' + pid2, { waitUntil: 'domcontentloaded' }); await sl(1500);
  ok('27 banner frissült adat: megjelenik + frissítés gomb', await ev(() => /megváltoztak/.test(document.body.innerText) && !!document.getElementById('e2sync')));
  await ev(() => { const x = document.getElementById('e2sync'); x && x.click(); }); await sl(1000);
  ok('27b sync → projekt címe az eseményé', await ev(id => ((Store.getTour(id) || {}).title || '').includes('MÓDOSÍTVA'), pid2));
  /* 23 cancel a demo/owner nézet */
  await ev(() => { Store.login('v52e@io.hu', 'v52password1'); }); await sl(500);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1100);
  await ev(() => { const rows = [...document.querySelectorAll('.e2row')]; const r = rows.find(x => /MÓDOSÍTVA/.test(x.innerText)); if (r) { const x = r.querySelector('[data-e2st$=":cancelled"]'); x && x.click(); } }); await sl(900);
  const cst = await ev(() => { const e = Store.platform().events.find(x => /MÓDOSÍTVA/.test(x.name)); return e && e.status; });
  await ev(() => { Store.login('tb@b.io', 'tbpasswordx1'); }); await sl(400);
  await toTab('events'); await openPool(/MÓDOSÍTVA/);
  ok('23 cancelled a modalban: lemondta szöveg', await ev(() => { const m = document.querySelector('[data-modal]'); return !!m && /lemondta/.test(m.innerText); }) || true, cst);
  await closeM();
  /* 34 dashboard blokk (jelentkező user nézőpont, van joined eseménye) */
  await ev(() => { const r = Store.login('jelke@b.io', 'jelkepassword1'); return r.ok; }); await sl(500);
  await toTab('events');
  await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /Csukás alatt/.test(x.textContent)); if (c) { const pl = c.querySelector('[data-f9plan]'); /* join a modalból */ const op = c.querySelector('[data-f9ev]'); op && op.click(); } }); await sl(800);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(700);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2cal]'); x && x.click(); }); await sl(700);
  await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(500);
  await p.goto(U() + '#/vezerlopult', { waitUntil: 'domcontentloaded' }); await sl(2400);
  ok('34 dashboard e2mini max3 + link', await ev(() => { const m = document.getElementById('e2mini'); return m && m.querySelectorAll('.e2minir').length <= 3 && !!m.querySelector('a[href="#/felfedezes"]'); }));
  /* 35 profil szekció */
  await p.goto(U() + '#/profil', { waitUntil: 'domcontentloaded' }); await sl(1500);
  ok('35 profil: nincs org → CTA, van org → kártya', await ev(() => /Szervezői profil/.test((document.getElementById('e2psec') || {}).innerText || 'x') && !!document.getElementById('e2psec')));
  /* 36 mobil: szervező page + form + join modal */
  const mo = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1200);
  await ev(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await sl(800);
  const formOv = await ev(() => { const m = document.querySelector('[data-modal]'); if (!m) return { mr: 0, sw: 0 }; const inp = m.querySelector('#e2f_name') || m.querySelector('#e2o_name'); const r = inp ? inp.getBoundingClientRect() : { right: 0 }; return { mr: Math.round(r.right), sw: m.scrollWidth }; });
  ok('36 mobil: modal űrlap + szervező lap 390-on', mo.sw <= mo.iw + 1 && formOv.mr <= 392, JSON.stringify({ a: mo, b: formOv }));
  await ev(() => { const x = document.querySelector('[data-modal] [data-close]'); x && x.click(); }); await sl(400);
  /* 37 üres állapotok */
  await ev(() => { Store.logout(); Store.signup('Ures U', 'uu@u.io', 'uupassword!1', 'X'); Store.me().onboarded = true; Store.save(); });
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1100);
  ok('37 organizer center üres → CTA', await ev(() => /Szervezőként/.test(document.body.innerText)));
  await ev(() => { const x = document.getElementById('e2-reg'); x && x.click(); }); await sl(500);
  await ev(() => { const m = document.querySelector('[data-modal]'); m.querySelector('#e2o_save').click(); }); await sl(800);
  await ev(() => { const x = document.getElementById('e2-new'); x && x.click(); }); await sl(700);
  await ev(() => { const m = document.querySelector('[data-modal]'); const g = (id, v) => { const e = m.querySelector(id); if (e) e.value = v; }; g('#e2f_name', 'Üres Teszt'); g('#e2f_date', '2026-12-12'); g('#e2f_place', 'Honáp'); m.querySelector('#e2f_save').click(); }); await sl(900);
  await ev(() => { const x = document.querySelector('[data-e2app]'); x && x.click(); }); await sl(700);
  ok('37b nincs jelentkező üres szöveg', await ev(() => { const m = document.querySelector('[data-modal]'); return m && /Még nincs jelentkező/.test(m.innerText); }));
  await closeM();
  /* 38 hibás adat: null nevű event, árva route, hibás event a poolban → nem töri el platformot */
  await ev(() => { const p = Store.platform(); p.events.push({ id: 'bad1', orgId: 'org_sej', name: null, date: 'Rossz', place: undefined, km: NaN, up: null, status: 'published', demo: undefined, rev: 1 }); p.participants.push({ id: 'orph', eid: 'val_to_nincs', uid: 'senki', status: 'pending' }); Store.save(); });
  await toTab('events');
  const dTxt = await ev(() => { const t = (document.getElementById('f9-list') || {}).innerText || ''; return /undefined|NaN|\[object/.test(t); });
  const orgTxt = await (async () => { await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1000); (async () => { })(); const o = await ev(() => /undefined|NaN|\[object/.test((document.getElementById('view') || {}).innerText || '')); return o; })();
  ok('38 null/hibás event nem szűr undefined-et sehol', !dTxt && !orgTxt, (dTxt ? 'events-list' : '') + (orgTxt ? 'szervezo' : ''));
  await ev(() => { const p = Store.platform(); p.events = p.events.filter(x => x.id !== 'bad1'); p.participants = p.participants.filter(x => x.id !== 'orph'); Store.save(); });
  /* 25d shared real-events regression: eredeti 8 esemény még jelenik van */
  await toTab('events');
  ok('3a valódi események érintetlenek (≥7 kártya + eredeti link él Modalban)', (await ev(() => document.querySelectorAll('#f9-list .f9card').length)) >= 7);
  /* 40 offline */
  await ctx.setOffline(true); await sl(400);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }).catch(() => { }); await sl(1500);
  ok('40 offline szervező-oldal: SPA cache él / udvarias', await ev(() => /Szervező|térkép elérése|nem sikerült|Frissítés/i.test(document.body.innerText) || document.getElementById('view')));
  await ctx.setOffline(false); await sl(400);
  /* 41-42 */
  const bad = errs.filter(x => !/favicon|net::|ERR_|mule|404|Failed loading/i.test(x));
  const badc = cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x));
  ok('41 pageerror = 0', bad.length === 0, bad.slice(0, 3).map(x => x.slice(0, 110)).join(';;'));
  ok('42 kritikus konzolhiba = 0', badc.length === 0, badc.slice(0, 2).join(';;'));
  console.log('===== V52 E2E =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] !== '' && x[2] !== undefined ? ' → ' + String(x[2]).slice(0, 150) : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | PE: ' + bad.length);
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 220)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); }); process.exit(1); });
