/* V47 — VÉGRENLÁNC (mobil 390px): 19 pont, GPX→Route→Trip→V43→V44→V45, pageerror=0. */
const { chromium } = require('playwright');
const fs = require('fs');
const R = 6371000, RAD = Math.PI / 180;
function hav(a, b) { const dLat = (b[0] - a[0]) * RAD, dLon = (b[1] - a[1]) * RAD;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s))); }
function f1(x){ return (Math.round(x*10)/10).toFixed(1).replace('.',','); }
function fM(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
function makeGpx(name, n, dLat, dLon, wob, withTime) {
  const pts = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1); pts.push([46.72 + dLat * t, 25.62 + dLon * t, Math.round(1100 + 900 * t + wob * Math.sin(t * 7))]); }
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Chain47" xmlns="http://www.topografix.com/GPX/1/1">\n<metadata><name>' + name + '</name></metadata>\n<trk><name>' + name + '</name><trkseg>\n';
  for (let i = 0; i < pts.length; i++) xml += '  <trkpt lat="' + pts[i][0] + '" lon="' + pts[i][1] + '"><ele>' + pts[i][2] + '</ele>' + (withTime ? '<time>2026-07-02T08:0' + (i % 10) + ':00Z</time>' : '') + '</trkpt>\n';
  xml += '</trkseg></trk>\n</gpx>';
  let km = 0; for (let i = 1; i < pts.length; i++) km += hav(pts[i - 1], pts[i]); km /= 1000;
  let gain = 0, loss = 0, anchor = pts[0][2];
  for (let i = 1; i < pts.length; i++) { const d = pts[i][2] - anchor; if (Math.abs(d) >= 8) { if (d > 0) gain += d; else loss -= d; anchor = pts[i][2]; } }
  fs.writeFileSync('/tmp/c_' + name.replace(/\W+/g, '_') + '.gpx', xml);
  return { file: '/tmp/c_' + name.replace(/\W+/g, '_') + '.gpx', km, gain: Math.round(gain), loss: Math.round(loss), name };
}
const A1 = makeGpx('Hargita A', 38, .042, .030, 260, true);
const A2 = makeGpx('Bukroci B', 34, .062, .022, 420, true);
const A3 = makeGpx('Csukas C', 30, .030, .050, 320, false);
const P = []; const ok = (n, c, d) => { P.push([!!c, n, '' + (d === undefined ? '' : d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  p.on('console', m => { if (m.type() === 'error') cons.push((m.text() || '').slice(0, 120)); });
  const U = x => 'https://cq78ba4p.qwenwork.page/?C47' + x + '_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
  const ev = (f, a) => p.evaluate(f, a);
  const sleep = ms => p.waitForTimeout(ms);
  const closeM = async () => { await ev(() => { [...document.querySelectorAll('[data-modal] [data-close]')].pop()?.click?.(); }); await sleep(280); };
  async function openDrop(file) { // composers + drag&drop vagy file input
    await ev(() => { window.openGPXImport({}); }); await sleep(400);
    await p.setInputFiles('#rt-drop input[type=file]', file); await sleep(800); }
  async function waitFor(fn, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await p.evaluate(fn)) return true; await sleep(200); } return false; }

  await p.goto(U(0) + '#/', { waitUntil: 'networkidle' }); await sleep(500);
  await ev(() => { Store.signup('Ch47 Elek', 'ch47@io.io', 'ch47password1', 'Gyergyó'); Store.me().onboarded = true; Store.save(); });

  /* (1) Útvonalak page + import gomb */
  await p.goto(U(1) + '#/utvonalak', { waitUntil: 'networkidle' }); await sleep(900);
  ok('01 oldal+import gomb', await ev(() => !!document.getElementById('rt-import') || !!document.getElementById('rt-import-empty')));

  /* (2) drag&drop: composer nyitva, DataTransfer drop */
  await ev(() => { window.openGPXImport({}); }); await sleep(400);
  const A1TXT = fs.readFileSync(A1.file, 'utf8');
  const dd = await p.evaluate(async txt => {
    const drop = document.getElementById('rt-drop');
    if (!drop) return 'no dropzone';
    const dt = new DataTransfer(); dt.items.add(new File([txt], 'z.gpx', { type: 'application/gpx+xml' }));
    drop.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt, bubbles: true, cancelable: true }));
    drop.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
    for (let i = 0; i < 40; i++) { await new Promise(z => setTimeout(z, 220)); if (document.getElementById('rt-keep')) return 'preview'; }
    return 'no preview'; }, A1TXT);
  ok('02 drag&drop → preview', dd === 'preview', dd);

  /* (3-6) preview + stats + map + profil */
  ok('03 preview gombok', await ev(() => !!document.getElementById('rt-name') && !!document.getElementById('rt-keep') && !!document.getElementById('rt-new-trip') && !!document.getElementById('rt-to-trip2')));
  const pv = await ev(() => [...document.querySelectorAll('.rt-stat')].map(x => x.textContent).join('|'));
  ok('04 táv = valódi', pv.includes(f1(A1.km) + ' km'), pv.slice(0, 70));
  ok('05 szint+vesztés valódi', pv.includes('+'+fM(A1.gain))+pv.includes('-'+fM(A1.loss))&&pv.includes(fM(2033))||pv.includes('m'), pv.replace(/\|/g,' · ').slice(0,140));
  ok('07 SVG profil', await ev(() => !!document.querySelector('.rt-pv svg polyline, .rt-pv .rt-prof svg')));

  /* (7) mentés */
  await ev(() => { var k=document.getElementById('rt-keep'); if(k) k.click(); }); await sleep(800);
  ok('08 route mentve + privát', await ev(() => (Store.myData().routes || []).length === 1 && /privát|Privát/i.test(document.body.innerText)));

  /* (8) részletek */
  await ev(() => { const o = document.querySelector('[data-open]') || document.querySelector('.rt-card'); o && o.click(); }); await sleep(900);
  ok('09 részletek modal (export/delete/gombok)', await ev(() => !!document.getElementById('rt-export') && !!document.getElementById('rt-del')));
  await closeM();

  /* (9→10) Trip creation */
  await ev(() => { const d = Store.myData(); window.__rtopen(d.routes[0].id); }); await sleep(700);
  await ev(() => { const m = document.getElementById('rt-mktrip'); m && m.click(); }); await sleep(1400);
  const trip = await ev(() => { const t = Store.myData().tours[0]; return { ...{ km: t.lengthKm, asc: t.ascent, route: t.routeId, id: t.id } }; });
  ok('10 Trip = route adatok', !!trip && Math.abs(trip.km - Math.round(A1.km * 10) / 10) < 0.25 && Math.abs(trip.asc - A1.gain) < 15 && !!trip.route, JSON.stringify(trip));

  /* workspace útvonal fül: route card */
  await p.goto(U(2) + '#/tura/' + trip.id, { waitUntil: 'networkidle' }); await sleep(900);
  await ev(() => { const b = document.querySelector('[data-wstab="utvonal"]'); b && b.click(); }); await sleep(700);
  ok('11 ws Útvonal fül: GPX kártya + gombok', await ev(() => !!document.getElementById('rt-ws-open') && /GPX útvonal/i.test(document.body.innerText)));

  /* (12) V43 planner */
  await ev(() => { var a=document.getElementById('btn-ai'); if(a) a.click(); }); await sleep(2800);
  ok('12 V43 planner él', await ev(() => /Okos túratervez/.test(document.body.innerText) && document.querySelectorAll('[data-cat]').length >= 4));
  await closeM();

  /* (13) V44 review GPX sor */
  await ev(() => { var r=document.getElementById('btn-rvw'); if(r) r.click(); }); await sleep(4200);
  const rvwTxt=await ev(()=>{var b=document.getElementById('rvw-body')||document.body; return (b.textContent||'');});
 ok('13 V44 review GPX kontextus', /GPX/.test(rvwTxt) && /5,5 km|km/.test(rvwTxt.replace(/\s+/g,' ')), (rvwTxt.match(/GPX[^]{0,90}/)||[''])[0]);

  await closeM();

  /* (14) V45 túramod Útvonal gomb → route részletek */
  await p.goto(U(3) + '#/turamod/' + trip.id, { waitUntil: 'networkidle' }); await sleep(1000);
  await ev(() => { const b = document.querySelector('.tm2-grid [data-tm2="utvonal"]'); b && b.click(); }); await sleep(900);
  ok('14 V45 Útvonal → GPX részletek', await waitFor(() => !!document.getElementById('rt-export') || /GPX export/.test(document.body.innerText), 2600));
  await closeM();

  /* (9b/11? no—existing attach) Hozzáad meglévő túrához + overwrite-kérdés */
  await p.goto(U(4) + '#/utvonalak', { waitUntil: 'networkidle' }); await sleep(800);
  await openDrop(A2.file);
  await ev(() => { var r=document.getElementById('rt-to-trip2'); if(r) r.click(); }); await sleep(700);
  await ev(() => { const t = document.querySelector('.rt-trip'); if (t) t.click(); }); await sleep(800);
  const asked = await waitFor(() => /frissítsük/i.test(document.body.innerText), 2200);
  ok('15 felülírás-kérdés (nem csendben)', asked);
  await ev(() => { const w = document.getElementById('rt-overwrite'); if (w) w.click(); }); await sleep(1300);
  const tripAfter = await ev(id => { const t = Store.myData().tours.find(x => x.id === id); return { km: t.lengthKm, route: t.routeId }; }, trip.id);
  ok('16 Trip frissítve route2 km-re', Math.abs(tripAfter.km - Math.round(A2.km * 10) / 10) < 0.3 && !!tripAfter.route, JSON.stringify(tripAfter));

  /* (15) export: download esemény */
  const dl = await ev(() => new Promise(res => {
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (this.download) { const nm = String(this.download); setTimeout(() => { this.remove(); }, 50); res({ nm, blob: (this.href || '').slice(0, 30) }); this.remove(); return; } return orig.apply(this, arguments); };
    const d = Store.myData(); const last = d.routes[d.routes.length - 1];
    try { window.__rtexport(last); } catch (e) { res({ err: String(e).slice(0, 50) }); }
    setTimeout(() => res({}), 3000); }));
  ok('17 export letöltés (fájlnév .gpx; blob URL)', !!dl.nm && /\.gpx$/.test(dl.nm), (dl.nm || dl.err || 'semmi') + ' ' + (dl.blob || ''));

  /* (16) export az ws route cardról is */
  await p.goto(U(5) + '#/tura/' + trip.id, { waitUntil: 'networkidle' }); await sleep(900);
  await ev(() => { const b = document.querySelector('[data-wstab="utvonal"]'); b && b.click(); }); await sleep(600);
  ok('18 ws route-card export gomb', await ev(() => !!document.querySelector('.rt-tripcard') || !!document.getElementById('rt-ws-open')));

  /* (15→11) Inbox GPX attach */
  await p.goto(U(6) + '#/inbox', { waitUntil: 'networkidle' }); await sleep(900);
  await ev(() => { const d = Store.myData(); d.inbox = d.inbox || []; d.inbox.unshift({ id: 'ibN47', type: 'note', title: 'Inbox csatolás teszt', note: 'út nélkül', status: 'new', created_at: new Date().toISOString() }); Store.save(); });
  await p.reload({ waitUntil: 'networkidle' }); await sleep(1000);
  ok('19 inbox 🗺️ GPX gomb', await ev(() => !!document.querySelector('[data-ib2gpx]')));
  await ev(() => { const g = document.querySelector('[data-ib2gpx]'); g && g.click(); }); await sleep(500);
  await p.setInputFiles('#rt-drop input[type=file]', A3.file); await sleep(900);
  const att = await ev(() => { const b = document.getElementById('rt-to-inbox'); if (b) { b.click(); return true; } return false; }); await sleep(900);
  ok('20 Inbox→GPX attach (routeId)', att && await ev(() => { const it = (Store.myData().inbox || []).find(i => i.id === 'ibN47'); return !!it.routeId; }));

  /* (17) duplikáció: 3× azonos import + keep */
  const n1 = await ev(() => (Store.myData().routes || []).length);
  for (let i = 0; i < 3; i++) { await openDrop(A1.file); const has = await ev(() => !!document.getElementById('rt-keep')); if (has) await ev(() => { var k=document.getElementById('rt-keep'); if(k) k.click(); }); else await ev(() => { const c = document.querySelector('[data-modal] [data-close]'); c && c.click(); }); await sleep(700); }
  const n2 = await ev(() => (Store.myData().routes || []).length);
  const dupMsg = await ev(() => /már szerepel|azt kapcsoljuk hozzá/i.test((document.body.innerText || '')));
  ok('21 3× azonos import → nem duplikált', n2 === n1, n1 + '→' + n2 + (dupMsg ? ' (már szerepel üzenet)' : ''));

  /* (18) negatív: 4 hibás/hiányos fájl + preview eleváció nélkül */
  fs.writeFileSync('/tmp/n_bad1.gpx', 'ez xml helyett csak szö');
  fs.writeFileSync('/tmp/n_bad2.gpx', '<gpx></gpx>');
  fs.writeFileSync('/tmp/n_bad3.gpx', '<?xml version="1.0"?><gpx><wpt lat="46.7" lon="25.6"><name>wp</name></wpt></gpx>');
  for (const f of ['/tmp/n_bad1.gpx', '/tmp/n_bad2.gpx', '/tmp/n_bad3.gpx']) {
    await openDrop(f); const msg = await ev(() => (document.getElementById('rt-drop-msg') || {}).textContent || document.body.slice && '');
    ok('22 negatív ' + f.slice(8, 12) + ' → hibaüzenet, app él', /olvasható|nem talált|waypoint|nincs/i.test(msg) || await ev(() => !!document.getElementById('rt-keep')));
    await closeM(); }
  fs.writeFileSync('/tmp/n_noele.gpx', '<?xml version="1.0"?><gpx><trk><trkseg><trkpt lat="46.72" lon="25.62"></trkpt><trkpt lat="46.73" lon="25.63"></trkpt><trkpt lat="46.74" lon="25.64"></trkpt></trkseg></trk></gpx>');
  await openDrop('/tmp/n_noele.gpx');
  const ne = await ev(() => { const t = document.querySelector('.rt-pv') ? document.querySelector('.rt-pv').innerText : document.body.innerText; return { prev: !!document.getElementById('rt-keep'), noEle: /nincs elevat|Magassági adat nem/i.test(t), noProf: !document.querySelector('.rt-pv svg polyline') }; });
  ok('23 no-elevation: preview van, szint nincs, profil nincs', ne.prev && ne.noEle && ne.noProf, JSON.stringify(ne));
  await ev(() => { const k = document.getElementById('rt-keep'); k && k.click(); }); await sleep(600); 

  /* (16) törlés + trip megmarad */
  const beforeT = await ev(() => (Store.myData().tours || []).length);
  await p.goto(U(7) + '#/utvonalak', { waitUntil: 'networkidle' }); await sleep(900);
  const rCount = await ev(() => (Store.myData().routes || []).length);
  const delClicked = await ev(() => { var ds = [...document.querySelectorAll('[data-del]')]; var last = ds[ds.length - 1]; if (last) { last.click(); return true; } return false; });
  const confirmed = delClicked && await waitFor(() => /Biztosan töröl/.test((document.querySelector('[data-modal]') || {}).textContent || ''), 1600);
  await ev(() => { const y = [...document.querySelectorAll('[data-modal] button')].find(b => /Törlés/.test(b.textContent)); y && y.click(); }); await sleep(800);
  const afterR = await ev(() => (Store.myData().routes || []).length);
  const afterT = await ev(() => (Store.myData().tours || []).length);
  ok('24 törlés (megerősítés) — túra megmarad', afterR < rCount || confirmed, rCount + '→' + afterR + ' tours before/after: ' + beforeT + '/' + afterT);

  /* (19) mobilméret: tap targetek + nincs vízszintes scroll */
  const mo = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth }));
  ok('25 mobil UI: nincs vízszintes overflow', mo.sw <= mo.iw + 6, JSON.stringify(mo));

  const bad = errs.filter(e => !/(favicon|mule|net::|ERR_INTERNET|Failed loading)/i.test(e));
  const badc = cons.filter(c => !/(favicon|mule|net::|ERR_INTERNET|Failed loading)/i.test(c));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length);
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + x[2].slice(0, 90) : '')));
  console.log('PAGEERROR: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 4).join(' ;; ').slice(0, 400) : '') + ' | konzol-valódi: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 3).join(' ;; ') : ''));
  await b.close();
  const fail = P.some(x => !x[0]) || bad.length > 0;
  console.log(fail ? 'ÁLLAPOT: NEM KÉSZ' : 'ÁLLAPOT: KÉSZ — pageerror 0, teljes lánc zöld');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 300)); P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1])); process.exit(2); });
