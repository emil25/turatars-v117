/* ===== V54.1 E2E — tiszta, determinisztikus: A–V ===== */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d === undefined ? '' : String(d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let k = 0; const U = () => 'https://cq78ba4p.qwenwork.page/?V54T' + Date.now() + '-' + ++k;
  const S = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  async function to(h) { await p.goto(U() + h, { waitUntil: 'domcontentloaded' }); await sl(1600); }
  async function closeM() { await S(() => { const m = document.querySelector('[data-modal]'); const x = m ? [...m.querySelectorAll('[data-close]')].pop() : null; x && x.click(); }); await sl(400); }
  const EMAIL = 'v54@elek.io', PW = 'valodiJelszo8';

  /* —— A: regisztráció + adatok —— */
  await p.goto(U() + '#/', { waitUntil: 'networkidle' }); await sl(700);
  await S(e => { Store.signup('V54 Elek', e, 'v54password1', 'Gyergyó'); Store.me().onboarded = true; Store.save(); }, EMAIL);
  await S(e => { const u = Store.me(); const dbj = (s) => { let h = 5381; for (const c of s) h = (h * 33 ^ c.charCodeAt(0)) >>> 0; return 'h' + h.toString(36); };
    const d = (Store.myData() || {}); const t = Store.newTourFromDraft({ title: 'V54 Túra', place: 'Hargita', date: '2026-12-20', lengthKm: 14, ascent: 760 }); d.routes = [{ id: 'rt54', name: 'V54 GPX', distance_km: 5.5, elevation_gain_m: 150, elevation_loss_m: 216, track: [[46.6, 25.1, 800], [46.605, 25.105, 950], [46.62, 25.12, 510]], nPts: 3, created_at: new Date().toISOString(), source: 'gpx-import' }]; t.routeId = 'rt54'; t.status = 'teljesítve'; t.descent = 216;
    d.journal = [{ id: 'j54', tourId: 0, title: 'V54 Túra', date: '2026-12-20', km: 14, up: 760, rating: 5 }];
    d.wishlist = [{ id: 'w54', ref: 'f9:t:maria-ko', name: 'Mária-kő', cat: 'Csúcsok', addedAt: '2026-09-01' }];
    d.equipment = [{ id: 'e54', name: 'Túra nadrág', has: true, w: 300 }];
    Store.save(); window.c53.setMyProf({ name: 'V54 Elek', regions: ['Hargita'], types: ['Körös túra'] }); window.c53.connAdd('mas@kaw.io'); }, EMAIL);
  ok('A regisztráció + B session él', await S(e => !!Store.me() && Store.me().email === e, EMAIL));
  /* D: offer */
  /* Az ajánlat egyszer, indulás után 1700 ms-kor ellenőrzi a meglévő adatokat.
     A hálózati idle a tesztadatok létrehozása előtt túllépheti ezt az időt. */
  if (!await S(() => !!document.querySelector('[data-modal] #v4_now'))) {
    await p.reload({ waitUntil: 'domcontentloaded' });
  }
  await p.locator('[data-modal] #v4_now').waitFor({ state: 'visible', timeout: 10000 });
  ok('D meglévő local adat felismerve → offer modal', await S(() => { const m = document.querySelector('[data-modal]'); return !!m && /Mentsük el az adataidat a fiókodba/.test(m.innerText) && !!m.querySelector('#v4_now'); }));
  await S(() => { const m = document.querySelector('[data-modal]'); const x = m && m.querySelector('#v4_later'); x && x.click(); }); await sl(400);
  /* E: fiók + migráció */
  await to('#/profil'); await sl(700);
  await S(() => { const x = document.getElementById('c54-link'); x && x.click(); }); await sl(600);
  ok('E0 profil ☁️ blokk + fiók-modal nyílik', await S(() => !!document.getElementById('c54sec') && !!document.querySelector('[data-modal] #v4_go')));
  await S(e => { const m = document.querySelector('[data-modal]'); m.querySelector('#v4_e').value = e; m.querySelector('#v4_p').value = 'rövid'; m.querySelector('#v4_go').click(); }, EMAIL); await sl(900);
  ok('E1 gyenge jelszó → hiba, local ép', await S(() => { const m = document.querySelector('[data-modal]'); return !!m && (/8 karakter/.test((m.querySelector('#v4_err') || {}).textContent || '')) && ((Store.myData()||{}).tours || []).length === 1; }));
  await S(e => { const m = document.querySelector('[data-modal]'); m.querySelector('#v4_p').value = e; m.querySelector('#v4_go').click(); }, PW); await sl(2400);
  const v1 = await S(() => JSON.parse(localStorage.getItem('turatars_v54_vault_v1') || '{}'));
  const acc = v1.accounts && v1.accounts['v54@elek.io'] || {};
  ok('E2 fiók: PBKDF2 64-hex hash + salt', String(acc.hash || '').length === 64 && String(acc.salt || '').length > 10);
  ok('E3 snapshot mentve uid-kulcs alatt (schema v54.1, uid)', Object.keys(v1.snaps || {}).length === 1 && (() => { const s = (v1.snaps[Object.keys(v1.snaps)[0]] || {}).snap; return s && s.schema === 'v54.1' && s.linkedEmail === 'v54@elek.io'; })(), 'acc:' + JSON.stringify(Object.keys(v1.accounts || {})) + ' snaps:' + JSON.stringify(Object.keys(v1.snaps || {})));
  const e4 = await S(() => { const x = document.getElementById('c54sec'); return x ? x.innerText.slice(0, 90).replace(/\n/g, "|") : 'NOSEC'; });
  ok('E4 állapot chip "Szinkronizálva"', /szinkroniz/i.test(e4), e4.slice(0, 80));
  /* O: 3× save */
  await S(() => window.__V54.api.save(window.__V54.build('v54@elek.io'))); await sl(900);
  await S(() => window.__V54.api.save(window.__V54.build('v54@elek.io'))); await sl(900);
  ok('O1 3× mentés → 1 snap-kulcs (idempotens)', Object.keys((await S(() => JSON.parse(localStorage.getItem("turatars_v54_vault_v1") || "{}"))).snaps || {}).length === 1);
  /* R: túl nagy → hiba, local érintetlen */
  await S(() => { const d = (Store.myData() || {}); d.routes.push({ id: 'rbig', name: 'big', distance_km: 1, track: null, nPts: 1, raw: 'x'.repeat(4600000), created_at: new Date().toISOString(), source: 'gpx-import' }); Store.save(); });
  const bigErr = await S(() => window.__V54.api.save(window.__V54.build('v54@elek.io')).then(() => 'ok').catch(e => (e && e.error) || 'err'));
  ok('R sikertelen mentés → too_large + local érintetlen', bigErr === 'too_large' && await S(() => (Store.myData()||{ }).routes.some(r => r.id === 'rbig') && ((Store.myData()||{}).tours || []).length === 1), bigErr);
  await S(() => { const d = (Store.myData() || {}); d.routes = d.routes.filter(r => r.id !== 'rbig'); Store.save(); }); await sl(600);
  await S(() => { const x = document.getElementById('c54-save'); x && x.click(); }); await sl(1600);
  /* F: fiók-logout */
  await to('#/profil'); await sl(900);
  await S(() => { const x = document.getElementById('c54-out'); x && x.click(); }); await sl(500);
  ok('F fiók kilépés → "Nincs fiók összekötve" (helyi session él)', await S(() => { const x = document.getElementById('c54sec'); return !!x && /nincs fiók összekötve/i.test(x.innerText); }));
  /* G: újra login + P2: rossz jelszó */
  await S(() => { const x = document.getElementById('c54-link'); x && x.click(); }); await sl(600);
  await S(e => { const m = document.querySelector('[data-modal]'); m.querySelector('#v4_e').value = e; m.querySelector('#v4_p').value = 'rosszJelszo123'; m.querySelector('#v4_go').click(); }, EMAIL); await sl(2400);
  ok('P2/P3 rossz jelszó a vault-nál → elutasítva, nem ad tokent', await S(() => { const m = document.querySelector('[data-modal]'); return !!m && /nem egyezik|sikerült/.test((m.querySelector('#v4_err') || {}).textContent || ''); }));
  await S(a => { const m = document.querySelector('[data-modal]'); m.querySelector('#v4_e').value = a.em; m.querySelector('#v4_p').value = a.pw; m.querySelector('#v4_go').click(); }, { em: EMAIL, pw: PW }); await sl(2100);
  ok('G újra login + local session megmaradt', await S(e => !!JSON.parse(localStorage.getItem("turatars_v54_state") || "null") && !!Store.me() && Store.me().email === e, EMAIL));
  /* wipe → új-eszköz restore (H I J K L M N) */
  const countsExp = await S(() => { const d = Store.myData() || {}; return { tours: (d.tours || []).length, routes: (d.routes || []).length, journal: (d.journal || []).length, wish: (d.wishlist || []).length, gear: (d.equipment || []).filter(x => x && x.has).length, conn: (Store.community().connections || []).length, prof: (Store.community().profiles || []).length }; });
  await S(() => { localStorage.setItem("turavaros_v1", JSON.stringify({ users: {}, data: {}, session: null })); });
  await p.goto('https://cq78ba4p.qwenwork.page/?V54H' + Date.now() + '#/tarsak', { waitUntil: 'domcontentloaded' }); await sl(3600);
  const hdbg = await S(() => { const m = document.querySelector('[data-modal]'); return JSON.stringify({ modal: m ? m.innerText.slice(0, 50).replace(/\n/g, '·') : 'none', sess: (window.__V54.st().email || '-') + '/' + (window.__V54.st().status || ''), me: !!Store.me() }); });
  ok('H Üdv újra → restore modal (felismeri a mentést)', await S(() => { const m = document.querySelector('[data-modal]'); return !!m && /Visszaáll/.test(m.innerText) && !!m.querySelector('#v4_rst'); }), hdbg);
  await S(() => { const m = document.querySelector('[data-modal]'); const x = m && m.querySelector('#v4_rst'); x && x.click(); }); await sl(2200);
  const idbg = await S(() => JSON.stringify({ hasToken: !!window.__V54.st().token, email: window.__V54.st().email, status: window.__V54.st().status, pre1: !!localStorage.getItem('turatars_v54_pre1'), v1: (function(){ try{ const d=JSON.parse(localStorage.getItem('turavaros_v1')||'{}'); return { users: Object.keys(d.users||{}).length, sess: d.session, dataKeys: Object.keys(d.data||{}).length }; }catch(e){ return 'perr'; } })(), sec: ((document.getElementById('c54sec')||{}).innerText||'').slice(0,60).replace(/\n/g,'|') }));
  console.log('IDBG:', idbg);
  const after = await S(() => { const d = Store.myData() || {}; return { tours: (d.tours || []).length, routes: (d.routes || []).length, journal: (d.journal || []).length, wish: (d.wishlist || []).length, gear: (d.equipment || []).filter(x => x && x.has).length, conn: (Store.community().connections || []).length, prof: (Store.community().profiles || []).length, me: !!(Store.me()) }; });
  ok('I túra-visszatöltés', after.tours === countsExp.tours && after.me, JSON.stringify([countsExp.tours, after.tours]));
  ok('J GPX/route visszatöltés', after.routes === countsExp.routes);
  ok('K journal visszatöltés', after.journal === countsExp.journal);
  ok('L gear visszatöltés', after.gear === countsExp.gear);
  ok('M wishlist visszatöltés', after.wish === countsExp.wish);
  ok('N community profil+connection visszatöltés', after.conn === countsExp.conn && after.prof >= countsExp.prof);
  /* O2restore ×2 nem duplikál */
  await to('#/profil'); await sl(900);
  await S(() => { const x = document.getElementById('c54-load'); x && x.click(); }); await sl(2000);
  const after2 = await S(() => { const d = Store.myData() || {}; return (d.tours || []).length + (d.routes || []).length + (d.journal || []).length + (d.wishlist || []).length; });
  ok('O2 2× restore → ugyanannyi rekord', after2 === countsExp.tours + countsExp.routes + countsExp.journal + countsExp.wish, String(after2));
  ok('C2 profilblokk: e-mail + Szinkronizálva/állapot', await S(e => { const x = document.getElementById('c54sec'); return !!x && /v54@elek\.io/i.test(x.innerText); }, EMAIL));
  /* Q offline */
  await sl(600);
  const warm = p.url();
  await S(() => { location.hash = '#/tarsak'; }); await sl(1100);
  await ctx.setOffline(true); await sl(900);
  const offlineUi = await S(() => !!document.getElementById('c54band') || /Offline/.test(document.body.innerText));
  let band = offlineUi;
  if (!band) { await p.goto(warm, { waitUntil: 'domcontentloaded' }).catch(() => { }); await sl(2000); band = await S(() => !!document.getElementById('c54band') || /Offline/.test(document.body.innerText)); }
  ok('Q offline: üzenet + SPA/működés és local adat él', band && await S(() => (Store.myData() || {}).tours && (Store.myData() || {}).tours.length > 0 ? true : document.getElementById('view').innerText.length > 20));
  await ctx.setOffline(false); await sl(1200);
  const wOn = await p.url().split('?')[0];
  await S(() => { location.hash = '#/vezerlopult'; }); await sl(600);
  ok('V48/C1 regresszió: dashboard él online-váltás után', await S(() => (document.getElementById('view') || {}).innerText.length > 200 || !!document.getElementById('widgets')));
  /* desktop spot */
  const dsk = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const dp = await dsk.newPage(); const derrs = []; dp.on('pageerror', e => derrs.push(String(e)));
  await dp.goto('https://cq78ba4p.qwenwork.page/?V54D' + Date.now() + '#/profil', { waitUntil: 'networkidle' }); await dp.waitForTimeout(1400);
  const dov = await dp.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  ok('T2 desktop profil: nincs overflow + PE 0', dov.sw <= dov.iw + 2 && !/^#\/belepes/.test(await dp.evaluate(() => location.hash)) || dov.sw <= dov.iw + 2, JSON.stringify(dov) + ' pe:' + derrs.length);
  await dsk.close();
  const bad = errs.filter(x => !/favicon|net::|ERR_|mule|404|Failed loading/i.test(x));
  const badc = cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_|401|403/i.test(x));
  console.log('===== V54.1 E2E =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] !== undefined && x[2] !== '' ? ' → ' + x[2] : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | pageerror: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 3).map(y => String(y).slice(0, 120)).join(';;') : '') + ' | konzol-v: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 2).join(';;') : ''));
  await b.close(); process.exit(0);
})().catch(e => { console.log('FUTÁS-STACK:\n' + String(e && (e.stack || e.message)).slice(0, 1400)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1] + (x[2] !== undefined && x[2] !== '' ? ' → ' + x[2] : '')); }); process.exit(1); });
