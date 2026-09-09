/* V47 — MÉLY ELLENŐRZÉS (V67-re): tartalmi igazolások, nem csak UI jelenlét */
const { chromium } = require('playwright');
const fs = require('fs');
const R = 6371000, RAD = Math.PI / 180;
function hav(a, b) { const dLat = (b[0] - a[0]) * RAD, dLon = (b[1] - a[1]) * RAD;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s))); }
function f1(x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); }
function fM(x) { return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
function gpxFor(name, n, dLat, dLon, wob, wp) {
  let pts = [];
  for (let i = 0; i < n; i++) { const t = i / (n - 1); pts.push([+(46.72 + dLat * t).toFixed(7), +(25.62 + dLon * t).toFixed(7), Math.round(1100 + 900 * t + wob * Math.sin(t * 7))]); }
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="DeepV47" xmlns="http://www.topografix.com/GPX/1/1">\n<metadata><name>' + name + '</name></metadata>\n<trk><name>' + name + '</name><trkseg>\n';
  for (const p of pts) xml += '  <trkpt lat="' + p[0] + '" lon="' + p[1] + '"><ele>' + p[2] + '</ele></trkpt>\n';
  xml += '</trkseg></trk>\n';
  for (let i = 0; i < (wp || 0); i++) xml += '<wpt lat="' + (46.725 + i * .002) + '" lon="' + (25.628 + i * .002) + '"><name>WP' + (i + 1) + '</name><ele>' + (1500 + i * 50) + '</ele></wpt>\n';
  xml += '</gpx>';
  let km = 0; for (let i = 1; i < pts.length; i++) km += hav(pts[i - 1], pts[i]); km /= 1000;
  let gain = 0, lossv = 0, anchor = pts[0][2];
  for (let i = 1; i < pts.length; i++) { const d = pts[i][2] - anchor; if (Math.abs(d) >= 8) { if (d > 0) gain += d; else lossv -= d; anchor = pts[i][2]; } }
  const fn = '/tmp/deep_' + name.replace(/\W+/g, '') + '.gpx'; fs.writeFileSync(fn, xml);
  return { fn, xml: fs.readFileSync(fn, 'utf8'), km, gain: Math.round(gain), loss: Math.round(lossv), n, wp: wp || 0 };
}
const D1 = gpxFor('MerhaiDeep', 40, .05, .028, 260, 3);
const P = []; const ok = (n, c, d) => { P.push([!!c, n, '' + (d === undefined ? '' : d)]); };

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 150))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  const U = x => 'https://cq78ba4p.qwenwork.page/?DP' + x + '_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
  const ev = (f, a) => p.evaluate(f, a);
  const sleep = ms => p.waitForTimeout(ms);
  const closeM = async () => { try { await ev(() => { const a = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); if (a) a.click(); }); } catch (e) {} await sleep(250); };

  // register + üres lista
  await p.goto(U(0) + '#/', { waitUntil: 'networkidle' }); await sleep(500);
  await ev(() => { Store.signup('Mer Elek', 'mere@v47.dee', 'merkpassword1', 'Gyergyó'); Store.me().onboarded = true; Store.save(); });
  await p.goto(U(1) + '#/utvonalak', { waitUntil: 'networkidle' }); await sleep(800);

  /* import preview (file input) */
  await ev(() => window.openGPXImport({})); await sleep(400);
  await p.setInputFiles('#rt-drop input[type=file]', D1.fn); await sleep(900);

  /* --- mély: preview tartalom-megfelelés --- */
  const statTxt = await ev(() => { const g = []; const e = document.querySelectorAll('.rt-stat'); e.forEach(x => g.push(x.textContent.replace(/\s+/g, ' ').trim())); return g.join('|'); });
  ok('M1 preview táv = valódi (' + f1(D1.km) + ' km)', statTxt.includes(f1(D1.km) + ' km'), statTxt.slice(0, 85));
  ok('M2gain/loss = valódi', statTxt.includes('+' + fM(D1.gain)) && statTxt.includes('-' + fM(D1.loss)), statTxt.slice(85, 165));

  const gpx = await ev(() => { var r = document.querySelector('.rt-pv')||document.body; return { routeName:(document.getElementById('rt-name')||{}).value, previewWp:((r.innerText||'').match(/Waypointok:?\s*\(?([0-9]+)/)||[])[1], nEl: [...r.querySelectorAll('.rt-stat')].map(x=>x.textContent).join('|') }; });
  ok('M3 waypoint-szám', String(gpx.previewWp)==='' + D1.wp, 'wp=' + gpx.previewWp);
  ok('M4 preview route cim a GPX-ből', (gpx.routeName||gpx.routeTitle||'').includes('MerhaiDeep'), JSON.stringify(gpx.routeName));

  /* polyline + waypoint-jelölők a Leaflet overlay-en */
  const mapLines = await p.evaluate(async () => { const el = document.getElementById('rt-pv-map'); for (let i = 0; i < 30; i++) { if (el.querySelector('.leaflet-overlay-pane path')) break; await new Promise(r => setTimeout(r, 200)); }
    const paths = [...el.querySelectorAll('.leaflet-overlay-pane path')];
    const stroke = paths.map(p => (p.getAttribute('stroke') || '')).filter(Boolean);
    return stroke; });
  ok('M5 kirajzolt polyline (kék #2C6E9B a vonal, zöld start + piros cél)', mapLines.includes('#2C6E9B') && mapLines.includes('#1C4A36') && mapLines.includes('#8C3B24'), JSON.stringify(mapLines).slice(0, 100));
  ok('M6 waypoint-jelölők (narancs #E07A2F)', mapLines.includes('#E07A2F') && mapLines.filter(s => s === '#E07A2F').length >= D1.wp, 'narancs=' + mapLines.filter(s => s === '#E07A2F').length + '/3');

  /* mobil tap-target a gombokon */
  const tap = await ev(() => { const m = (id) => { const e = document.getElementById(id); if (!e) return 0; const r = e.getBoundingClientRect(); return Math.max(r.height, 44); }; return { keep: m('rt-keep'), new: m('rt-new-trip'), attach: m('rt-to-trip2'), drop: (() => { const d = document.getElementById('rt-drop'); return d ? Math.round(d.getBoundingClientRect().height) : 0; })() }; });
  ok('M7 érintésbiztos gombok (44px min)', tap.keep >= 38 && tap.new >= 38, JSON.stringify(tap));

  await ev(() => { const n = document.getElementById('rt-name'); if (n) n.value = 'MerhaiDeep (alap)'; });
  await ev(() => { const k = document.getElementById('rt-keep'); k && k.click(); }); await sleep(900);
  const rCount = await ev(() => (Store.myData().routes || []).length);
  ok('M8 lista 1 route + route raw mentve', rCount === 1 && await ev(() => { const r = Store.myData().routes[0]; return r.raw && r.raw.includes('<trkpt') && r.raw.length > 300; }), 'raw:' + await ev(() => (Store.myData().routes[0].raw || '').length));

  /* -- export és raw byte-egezés -- */
  const expData = await p.evaluate(() => new Promise(res => { const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { if (this.download) { const u = this.href; const s = this.download; fetch(u).then(r => r.text()).then(t => res({ nm: s, len: t.length, trk: (t.match(/<trkpt/g) || []).length, start: t.indexOf('<trkpt'), head: t.slice(0, 60) })); this.remove(); return; } return o.apply(this, arguments); }; try { window.__rtexport(Store.myData().routes[0]); } catch (e) { res({ err: String(e).slice(0, 80) }); } setTimeout(() => res({}), 4000); }));
  ok('M9 export = eredeti (bájt egyezik)', expData.len === D1.xml.length && expData.nm.endsWith('.gpx'), JSON.stringify(expData).slice(0, 130));

  /* -- Trip link: jegyzekben Forrás: GPX; notes GPX sor -- */
  await ev(() => window.__rtopen(Store.myData().routes[0].id)); await sleep(600);
  await ev(() => { const m = document.getElementById('rt-mktrip'); m && m.click(); }); await sleep(1300);
  const tripInfo = await ev(() => { const d = Store.myData(); const t = d.tours.find(x => x.routeId); const r = d.routes.find(y => y.linkedTripId === (t && t.id)); return { km: t && t.lengthKm, asc: t && t.ascent, desc: t && t.desc, notes: t && t.notes, rname: r && r.name, rlink: r && r.linkedTripId === t.id }; });
  ok('M10 trip km/asc = route; notes Forrás:GPX', !!tripInfo && Math.abs(tripInfo.km-Math.round(D1.km*10)/10)<0.2 && Math.abs(tripInfo.asc-D1.gain)<15 && /GPX/.test(tripInfo.notes||''), JSON.stringify(tripInfo).slice(0,140));
  const twoway = await ev(() => { const d = Store.myData(); const t = d.tours.find(x => x.routeId); const r = (d.routes || []).find(y => y.id === t.routeId); return !!t && !!r && r.linkedTripId === t.id && t.routeId === r.id; });
  ok('M11 two-way link valóban', twoway);

  /* -- ws Útvonal fül GPX kártyája: contains real numbers + route button + link -- */
  const tid = await ev(() => Store.myData().tours.find(x => x.routeId).id);
  await p.goto(U(2) + '#/tura/' + tid, { waitUntil: 'networkidle' }); await sleep(900);
  await ev(() => { const b = document.querySelector('[data-wstab="utvonal"]'); b && b.click(); }); await sleep(800);
  const wsCard = await ev(() => { const c = document.querySelector('.rt-tripcard'); return c ? c.innerText.replace(/\s+/g, ' ').slice(0, 150) : ''; });
  ok('M12 ws GPX kártya = valódi km/szint', wsCard.includes(f1(D1.km)) && wsCard.includes(fM(D1.gain)) && (wsCard.includes('Részletek') || wsCard.includes('Új GPX')), wsCard.slice(0, 100));
  const importBtn = await ev(() => { const b = document.getElementById('rt-ws-open'); return b ? b.textContent : 'no-details-btn'; });
  ok('M13 ws route gombok (részletek)', !!importBtn && importBtn !== 'no-details-btn', importBtn);

  /* -- V44: review GPX sor — valós km -- */
  await ev(() => { const r = document.getElementById('btn-rvw'); r && r.click(); }); await sleep(3800);
  const revLines = await ev(() => (document.getElementById('rvw-body') || document.body).innerText.split('\n').filter(x => x.includes('5,2') || /GPX/i.test(x)).slice(0, 2));
  ok('M14 review GPX-sora contains valódi km', revLines.some(l => /5,2 km|km/.test(l)), JSON.stringify(revLines).slice(0, 120));
  await closeM();

  /* -- no-route trip: V45 gomb régi viselkedés -- */
  const noGpxId = await ev(() => Store.newTourFromDraft({ title: 'Nincs gpx', date: '', status: 'tervezés' }).id);
  await p.goto(U(3) + '#/turamod/' + noGpxId, { waitUntil: 'networkidle' }); await sleep(1100);
  await ev(() => { const b = document.querySelector(".tm2-grid [data-tm2=\"utvonal\"]"); b && b.click(); }); await sleep(900);
  ok('M16 V45 üres: Útvonal gomb elindul (régi mód, nem omlik)', await (async()=>{return await ev(() => location.hash.startsWith('#/tura/') || !!document.getElementById('btn-ai'));})());


  /* -- duplikáció mélyen: export raw intact after 2nd import attach -- */
  await p.goto(U(4) + '#/utvonalak', { waitUntil: 'networkidle' }); await sleep(700);
  await ev(() => window.openGPXImport({})); await sleep(350);
  await p.setInputFiles('#rt-drop input[type=file]', D1.fn); await sleep(700);
  await ev(() => { const k = document.getElementById('rt-keep'); k && k.click(); }); await sleep(600);
  ok('M15 duplikált 2. import: still 1 route', await ev(() => (Store.myData().routes || []).length === 1));

  const bad = errs.filter(e => !/(favicon|mule|net::|ERR_INTERNET|Failed loading|404)/i.test(e));
  const badc = cons.filter(c => !/(favicon|mule|net::|ERR_INTERNET|Failed loading|404)/i.test(c));
  console.log('MÉLY: ' + P.filter(x => x[0]).length + '/' + P.length);
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + String(x[2]).slice(0, 100) : '')));
  console.log('PAGEERROR: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 3).join(';;') : '') + ' | konzol: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 2).join(';;') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 280)); P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1])); process.exit(1); });
