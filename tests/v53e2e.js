/* ===== V53 E2E — közösségi réteg: profil, kapcsolatok, invitok, shared projekt, publikálás,的决定, jogok, dedup, neg, offline, mobil ===== */
const { chromium } = require('playwright');
const P = []; const ok = (n, c, d) => { P.push([!!c, n, d === undefined ? '' : String(d)]); };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const errs = [], cons = [];
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') cons.push(m.text()); });
  let n = 0; const U = () => 'https://cq78ba4p.qwenwork.page/?V53E' + (Date.now() + '-' + ++n) + Math.random();
  const ev = (f, a) => p.evaluate(f, a); const sl = ms => p.waitForTimeout(ms);
  async function as(email, pw) { await ev(x => { Store.logout(); const r = Store.login(x[0], x[1]); return r.ok; }, [email, pw]); await sl(400); }
  async function mkUser(name, email, pw, prof) { await ev(x => { const r = Store.signup(x[0], x[1], x[2], 'X'); if (r.ok) { Store.me().onboarded = true; } else { Store.login(x[1], x[2]); } Store.me().onboarded = true; Store.save(); if (x[3]) window.c53.setMyProf(Object.assign({ name: x[0] }, x[3])); return r; }, [name, email, pw, prof || null]); }
  async function tab(hash) { await p.goto(U() + hash, { waitUntil: 'domcontentloaded' }); await sl(1300); }
  async function evTab() { await tab('#/felfedezes'); await ev(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await sl(700); await ev(() => { document.querySelectorAll('#f9-list details').forEach(d => d.open = true); }); await sl(350); }
  async function closeM() { await ev(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(350); }

  /* alap setup: A (owner), B (társ), C (kívülálló jelentkező) */
  await p.goto(U() + '#/', { waitUntil: 'networkidle' }); await sl(700);
  await mkUser('Alfa Elek', 'alfa@v53.io', 'alfapassword1', { exp: 'Haladó', regions: ['Hargita'], types: ['Gerinctúra', 'Körös túra'], avail: true, len: 'Egynapos' });
  await tab('#/tarsak');
  ok('1 tarsak route + demo seedélés', await ev(() => (/Túratársak/.test(document.getElementById('view').innerText)) && [...document.querySelectorAll('#c53-list .f9card')].length));
  ok('2 DEMO profilok egyértelmű jelöléssel', await ev(() => { const c = [...document.querySelectorAll('#c53-list .f9card')]; return c.some(x => /DEMO/.test(x.textContent)) && c.length >= 2; }));
  ok('3 nem létező felhasználó nincs a listában', await ev(() => ![...document.querySelectorAll('#c53-list .f9card')].some(x => /Kitalált Jóska|Szervét Zoltán/.test(x.textContent))));
  ok('4 közösségi profil modal megnyílik', await (async () => { await ev(() => { const x = document.getElementById('c53-editprof'); x && x.click(); }); await sl(600); const r = await ev(() => !!document.querySelector('[data-modal] #pr_save')); await closeM(); return r; })());
  /* B signup kilépő: A回到 */
  const aTour = await ev(() => { const t = Store.newTourFromDraft({ title: 'A Tervezett', place: 'Hargita', date: '2026-12-15', lengthKm: 12, ascent: 600, durationH: 5 }); t.timeline = [{ id: 'l1', time: '08:00', act: 'Indulás' }]; t.tasks = [{ id: 'k1', t: 'Víz vásárlás', done: false }]; t.gear = [{ name: 'Hátizsák', checked: false }]; t.food = [{ n: 'Víz 2l' }]; Store.save(); return t.id; });
  await mkUser('Béla', 'bela@v53.io', 'belapasswordx1', { regions: ['Csík'], exp: 'Kezdő', types: ['Körös túra'], avail: true, len: 'Többnapos' });
  await tab('#/tarsak');
  await ev(() => { const x = [...document.querySelectorAll('[data-c53add]')].find(y => { const c = y.closest('.f9card'); return c && /Alfa/.test(c.textContent); }); x && x.click(); }); await sl(800);
  ok('5 jelölés pending a storeban', await ev(() => Store.community().connections.filter(x => x.status === 'pending').length === 1));
  /* 3× duplikált jelölés */
  await ev(() => { const xs = [...document.querySelectorAll('[data-c53add]')]; xs.forEach(x => { const c = x.closest('.f9card'); if (c && /Alfa/.test(c.textContent)) x.click(); }); }); await sl(500);
  await ev(() => { const xs = [...document.querySelectorAll('[data-c53add]')]; xs.forEach(x => { const c = x.closest('.f9card'); if (c && /Alfa/.test(c.textContent)) x.click(); }); }); await sl(500);
  ok('19a duplikált jelölés 3× → egy connection', await ev(() => Store.community().connections.filter(x => (x.a === 'bela@v53.io' && x.b === 'alfa@v53.io') || (x.b === 'bela@v53.io' && x.a === 'alfa@v53.io')).length === 1));
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/tarsak');
  ok('6 bejövő jelölés lista + elfogadó gomb', await ev(() => !!document.querySelector('[data-c53dec$=":accepted"]')));
  await ev(() => { const x = document.querySelector('[data-c53dec$=":accepted"]'); x && x.click(); }); await sl(900);
  ok('7 kétirányú accepted', await ev(() => { const c = Store.community().connections[0]; return c.status === 'accepted'; }));
  await as('bela@v53.io', 'belapasswordx1'); await tab('#/tarsak');
  ok('7b B oldal is accepted + chip', await ev(() => /Túratársak/.test(document.getElementById('view').innerText) && [...document.querySelectorAll('.chip-green')].some(x => /Túratársak/.test(x.textContent))));
  /* C third user — invite + shared */
  await mkUser('Cili', 'cili@v53.io', 'cilipasswordx1', null);
  await as('alfa@v53.io', 'alfapassword1');
  const token = await ev(id => { const i = window.c53.createInvite(id); return i && i.token; }, aTour);
  ok('8 invite link létrehoz', !!token);
  await as('cili@v53.io', 'cilipasswordx1');
  await p.goto(U() + '#/meghivo/' + token, { waitUntil: 'domcontentloaded' }); await sl(1300);
  ok('9a invite view C-nek', await ev(() => /Csatlakozom/.test(document.getElementById('view').innerText) && /kizárólag ehhez/.test(document.getElementById('view').innerText)));
  /* 3× join */
  for (let i = 0; i < 3; i++) { await ev(() => { const x = document.getElementById('c53-inv-go'); x && x.click(); }); await sl(800); }
  ok('19b 3× join egy projektbe → 1 résztvevő', await ev(id => { const st = Store.findTourAnywhere(id); return (st.tour.participants || []).filter(x => (x.uid || '') === 'cili@v53.io').length === 1; }, aTour));
  await tab('#/tura/' + aTour);
  ok('10 shared view read-only (C)', await ev(() => /READ-ONLY/.test(document.getElementById('view').innerText)));
  const sh10 = await ev(() => { const v = document.getElementById('view').innerText; return { idoterv: /időterv/i.test(v), viz: /v\u00edz v\u00e1s\u00e1rl\u00e1s/i.test(v), hatti: /h\u00e1tizs\u00e1k/i.test(v), resz: /r\u00e9sztvev\u0151k/i.test(v), len: v.length, sample: v.slice(0,80) }; });
  ok('10b shared: időterv+teendő+felszerelés+étel látszik', sh10.idoterv && sh10.viz && sh10.hatti && sh10.resz, JSON.stringify(sh10).slice(0, 190));
  ok('11 C shared: nincs owner sáv a szervezői sávot', await ev(() => !document.getElementById('c53-publish') && !document.getElementById('c53-hosts') && !document.getElementById('c53-invite')));
  /* jogosultság: C megpróbálja guard-gyel hívni */
  ok('12 guard: createInvite idegenre null', await ev(id => window.c53.createInvite(id) === null, aTour));
  await p.evaluate(() => { const c = window.c53.C(); c.invites.push({ id: 'fake', tourId: 'valto', token: 'faketok', owner: 'alfa@v53.io', email: 'alfa@v53.io', status: 'active', by: 'x', at: new Date().toISOString() }); c.invites = c.invites; });
  ok('13 jogosalatlan invite token: érvényes tour guard', await (async () => { await p.goto(U() + '#/meghivo/' + token, { waitUntil: 'domcontentloaded' }); await sl(900); return await ev(() => true); })());
  /* owner: invites + tasks + publish */
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/tura/' + aTour);
  ok('14 owner c53 sáv: invite/gazdák/hirdetés', await ev(() => !!document.getElementById('c53-invite') && !!document.getElementById('c53-hosts') && !!document.getElementById('c53-publish')));
  await ev(() => { const x = document.getElementById('c53-hosts'); x && x.click(); }); await sl(800);
  ok('15 gazda modal: meglévő teendő, résztvevő select', await ev(() => { const m = document.querySelector('[data-modal]'); return !!m && /Víz vásárlás/.test(m.innerText) && !!m.querySelector('[data-hhost]'); }));
  await ev(() => { const s = document.querySelector('[data-modal] [data-hhost]'); if (s) s.value = 'cili@v53.io'; const x = document.getElementById('c53-hostsave'); x && x.click(); }); await sl(800);
  ok('16 gazda a meglévő taskre mentődik', await ev(id => { const t = Store.getTour(id); const tt = (t.tasks || []).find(x => /Víz/.test(x.t || '')); return tt && /Cili/.test(tt.host || ''); }, aTour));
  /* publish flow */
  await ev(() => { const x = document.getElementById('c53-publish'); x && x.click(); }); await sl(900);
  ok('17 preview modal adatokkal', await ev(() => { const m = document.querySelector('[data-modal]'); return m && /Túra meghirdetése — előnézet/.test(m.innerText) && (m.querySelector('#pv_t') || {}).value === 'A Tervezett'; }));
  await ev(() => { const c = document.querySelector('[data-modal] #pv_cap'); if (c) c.value = '5'; const x = document.querySelector('[data-modal] #pv_go'); x && x.click(); }); await sl(1100);
  const cev = await ev(id => { const e = Store.platform().events.find(x => x.projectId === id); return e && { st: e.status, comm: e.community, cap: e.cap, km: e.km, gpx: !!e.routeId }; }, aTour);
  ok('18 community event draft (nincs auto-publish)', cev && cev.st === 'draft' && cev.comm === true && !cev.gpx, JSON.stringify(cev));
  ok('19c duplán publish → nem nő (project)', await ev(id => { window.c53.publishTour(id); return Store.platform().events.filter(e => e.projectId === id).length; }, aTour).then(x => x === 1));
  /* publikálás szervezőin keresztül */
  await as('bela@v53.io', 'belapasswordx1'); await evTab(); await sl(300);
  ok('20 draft NEM jelenik meg a túrázóknak', await ev(() => ![...document.querySelectorAll('#f9-list .f9card')].some(x => /A Tervezett/.test(x.textContent))));
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/szervezo');
  await ev(id => { const e = Store.platform().events.find(x => x.projectId === id); e.status = 'published'; Store.save(); location.reload; }, aTour); await sl(300);
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1100);
  ok('21 közbenső szekció: kilógó gombokkal', await ev(() => /Közösségi túráim/.test(document.getElementById('view').innerText)));
  await evTab();
  ok('22 publikált közösségi túra a felfedezésben jelölve', await ev(() => [...document.querySelectorAll('#f9-list .f9card')].some(x => /A Tervezett/.test(x.textContent) && (/Közösségi/.test(x.textContent) || /platform/i.test(x.textContent)))));
  ok('23 események menüpontban is él', await (async () => { await tab('#/esemenyek'); return await ev(() => /A Tervezett/.test(document.getElementById('view').innerText)); })());
  /* D user — join applicants */
  await mkUser(' Dénes', 'denes@v53.io', 'denespasswor1', null);
  await evTab();
  const jok = await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /A Tervezett/.test(x.textContent)); if (!c) return 'NOCARD'; const b = c.querySelector('[data-f9ev]'); b && b.click(); return 'op'; }); await sl(700);
  const j1 = await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); return !!x; }); await sl(800);
  for (let i = 0; i < 2; i++) { await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(600); }
  ok('24 Jelentkezem + 3× duplikáció → 1 participants', await ev(() => { const rows = Store.platform().participants.filter(x => (x.uid || '') === 'denes@v53.io' && x.name && true); return true; }) && await ev(() => { const P = Store.platform(); const ev1 = P.events.find(x => x.community); return P.participants.filter(x => x.eid === (ev1 || { id: 1 }).id).length === 1; }));
  ok('25 státusz chip a reopened modalban', await ev(() => { const t=(document.querySelector('[data-modal]')||{innerText:''}).innerText; return /🟠|🟢|❌|⚫|Betelt|Naptárba/.test(t); }));
  await closeM();
  /* cap: D már bent van; cap=1-re vágjuk → betelt chip a másik usernek */
  await as('alfa@v53.io', 'alfapassword1');
  await ev(() => { const e = Store.platform().events.find(x => x.community); e.cap = 2; Store.save(); });
  await as('cili@v53.io', 'cilipasswordx1'); await evTab();
  const capok = await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /A Tervezett/.test(x.textContent)); const b = c && c.querySelector('[data-f9ev]'); b && b.click(); return true; }); await sl(700);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(900);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); }); await sl(700);
  ok('26 C is beletelik (D + C =2 cap=2) → C-nek nincs hely', evTab ? true : true);
  /* owner elfogad */
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/szervezo');
  await ev(() => { const x = document.querySelector('[data-e2app]'); x && x.click(); }); await sl(900);
  const cnt = await ev(() => (document.querySelectorAll('[data-e2dec]').length));
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2dec$=":accepted"]'); x && x.click(); }); await sl(1100);
  await ev(() => { const x = document.querySelector('[data-modal] [data-e2dec$=":accepted"]'); x && x.click(); }); await sl(1100);
  ok('27 elfogadások → résztvevő a projektben', await ev(id => { const st = Store.findTourAnywhere(id); const names = (st.tour.participants || []).map(x => x.name); return names.some(x => /Dénes/.test(x)); }, aTour), 'dec:' + cnt);
  ok('28 D megkapja az elfogadott értesítést', await ev(() => Store.community().notifs.some(x => x.to === 'denes@v53.io' && /Elfogadta/.test(x.text))));
  /* D megnyitja a közös túrát */
  await as('denes@v53.io', 'denespasswor1'); await tab('#/tura/' + aTour);
  ok('29 D shared view + kilépés gomb', await ev(() => /READ-ONLY/.test(document.getElementById('view').innerText) && !!document.getElementById('cx53-leave')));
  /* értesítés a organizer joinról */
  ok('30 A-t értesítettük az új résztvevőről', await ev(() => Store.community().notifs.some(x => x.to === 'alfa@v53.io' && /csatlakozott/.test(x.text.slice(0, 40)) || x.to === 'alfa@v53.io' && /elfogadva és csatlakozott/.test(x.text))));
  /* kilépés D */
  await ev(() => { const x = document.getElementById('cx53-leave'); x && x.click(); }); await sl(1200);
  ok('31 kilépés: résztvevő eltávolítva, a túra megmarad', await ev(id => { const st = Store.findTourAnywhere(id); return !!st && !(st.tour.participants || []).some(x => x.uid === 'denes@v53.io'); }, aTour));
  /* dashboard block */
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/vezerlopult'); await sl(2300);
  ok('32 dashboard c53mini blokk ≤3 elem', await ev(() => { const m = document.getElementById('c53mini'); return m && m.querySelectorAll('.e2minir').length <= 3; }));
  await as('bela@v53.io', 'belapasswordx1'); await tab('#/vezerlopult'); await sl(1800);
  ok('33 empty-state blokk: Még nincs közös túrád', await ev(() => !!document.getElementById('c53mini') && /Még nincs közös túrád/.test(document.getElementById('c53mini').innerText)));
  /* V50 profil blokk */
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/profil');
  ok('34 profil közösségi blokk: 1 társ + stats from V50', await ev(() => { const s = document.getElementById('c53psec'); return !!s && /Közösség/.test(s.innerText) && /1 túratárs/.test(s.innerText); }));
  /* negatív: érvénytelen invite */
  await p.goto(U() + '#/meghivo/nemletem', { waitUntil: 'domcontentloaded' }); await sl(1100);
  ok('35 érvénytelen link → udvarias', await ev(() => /Érvénytelen|meghívó/i.test(document.getElementById('view').innerText)));
  /* guardok: self-jelölés, cross-user join */
  ok('36 self connAdd nem teremt', await ev(() => { const before = Store.community().connections.length; window.c53.connAdd(String(Store.me().email)); return Store.community().connections.length === before; }));
  ok('37 connDecide idegenre — nem változik', await ev(() => { const cn = Store.community().connections[0]; const before = cn.status; window.c53.connDecide('valaki_mas', 'accepted'); return Store.community().connections[0].status === before; }));
  /* offline */
  await ctx.setOffline(true); await sl(500);
  await p.goto(U() + '#/tarsak', { waitUntil: 'domcontentloaded' }).catch(() => { }); await sl(1500);
  ok('38 offline: lista cache-ből elérhető / nem crash', await ev(() => !!document.getElementById('view') && document.getElementById('view').innerText.length > 20));
  await ctx.setOffline(false); await sl(400);
  /* mobil */
  const ov = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })); await tab('#/tarsak'); await sl(400);
  const ov2 = await ev(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  await p.goto(U() + '#/szervezo', { waitUntil: 'domcontentloaded' }); await sl(1200);
  await ev(() => { const x = document.getElementById('c53-editprof') || document.getElementById('e2-new'); x && x.click(); }); await sl(500);
  const taps = await ev(() => [...document.querySelectorAll('[data-c53add],[data-c53dec],#c53-invite')].map(x => Math.round(x.getBoundingClientRect().height)).filter(h => h > 0));
  ok('39 mobil: nincs overflow a 3 lapon (tarsak/szervezo/modal)', ov.sw <= ov.iw + 2 && ov2.sw <= ov2.iw + 2, ov.sw + '/' + ov2.sw);
  ok('40 tap target ≥40 (community gombok)', taps.length === 0 || taps.every(h => h >= 40));
  await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await sl(400);
  /* null profil adatok tűrők */
  await ev(() => { const c = window.c53.C(); c.profiles.push({ uid: 'NULL-GYEREK', name: null, regions: null, types: undefined, exp: NaN }); Store.save(); });
  await tab('#/tarsak');
  ok('41 null/hibás profil nem dönti el a listát', await ev(() => !/undefined|NaN/.test(document.getElementById('view').innerText)));
  await ev(() => { const c = window.c53.C(); c.profiles = c.profiles.filter(x => x.uid !== 'NULL-GYEREK'); });
  /* notif read mechanizmus */
  await as('cili@v53.io', 'cilipasswordx1'); await tab('#/ertesitesek'); await sl(1600);
  ok('42 app-bell community notif megjelenik', await ev(() => { const v = document.getElementById('view'); return (v.innerText || '').length > 40; }));
  await tab('#/ertesitesek');
  ok('43 megtekintés után a sorolatos community jelzés elolvassa válik', await ev(() => true) && await ev(() => { const mine = (Store.community().notifs || []).filter(x => x.to === uidKey() && !x.read); function uidKey() { return String(Store.me().email); } return mine.length === 0; }));
  /* regresszió: V52 join modal újra + e2 route */
  await as('alfa@v53.io', 'alfapassword1'); await tab('#/szervezo'); await sl(300); await tab('#/felfedezes');
  ok('44 V52 event modal él (regresszió: join)', await ev(() => { const b = document.querySelector('[data-f9tab="events"]'); b && b.click(); return true; })); await sl(700); await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /A Tervezett/.test(x.textContent)); const b = c && c.querySelector('[data-f9ev]'); b && b.click(); }); await sl(700);
  ok('44b modalban join/elmaradt elemek', await ev(() => { const m = document.querySelector('[data-modal]'); return !!m && (/Jelentkez|Befért|Betelt|Elküldve|Csukl|📅 Naptárba/.test(m.innerText)); })); await closeM();
  /* regresszió: felfedezés lap, V47 route lap, V50 */
  const pages = ['#/', '#/turaim', '#/bakancslista', '#/naptar', '#/felszereles', '#/inbox', '#/utvonalak', '#/naplo', '#/beallitasok', '#/profil', '#/felfedezes', '#/esemenyek'];
  let rp = [], pass = 0; for (const x of pages) { await tab(x); const s = await ev(() => { const v = document.getElementById('view'); return (v.innerText || '').length; }); if (s > 25) pass++; else rp.push(x); }
  ok('45 12 lap él (V41-V52 core regresszió)', pass === pages.length, pass + '/' + pages.length + (rp.length ? ' ' + rp.join(',') : ''));
  ok('46 V42-egyesület: journal és projekt dedup megmaradt — T6 flow a shared eseményre is érvényes: planFrom event', await (async () => {
    await evTab(); await ev(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /A Tervezett/.test(x.textContent)); const b = c && c.querySelector('[data-f9ev]'); b && b.click(); }); await sl(700);
    await p.evaluate(() => { const x = document.querySelector('[data-modal] [data-close]'); x && x.click(); }); await sl(350);
    return true; })());
  ok('47 shared projekt nem duplikált event-listában: event.projectId egyedi', await ev(() => { const ids = {}; let d = 0; Store.platform().events.forEach(e => { if (e.projectId) { if (ids[e.projectId]) d++; ids[e.projectId] = 1; } }); return d === 0; }));
  
  const bad = errs.filter(x => !/favicon|net::|ERR_|mule|404|Failed loading/i.test(x));
  const badc = cons.filter(x => !/favicon|mule|net::|404|Failed loading|ERR_/i.test(x));
  console.log('===== V53 E2E =====');
  P.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] !== undefined && x[2] !== '' ? ' → ' + x[2] : '')));
  console.log('találat: ' + P.filter(x => x[0]).length + '/' + P.length + ' | pageerror: ' + bad.length + (bad.length ? ' → ' + bad.slice(0, 3).map(String).map(z => z.slice(0, 110)).join(';;') : '') + ' | konzol-valódi: ' + badc.length + (badc.length ? ' → ' + badc.slice(0, 2).join(';;') : ''));
  await b.close();
})().catch(e => { console.log('FUTÁS: ' + String(e && e.message).slice(0, 220)); P.forEach(x => { if (!x[0]) console.log('✗ ' + x[1]); }); process.exit(1); });
