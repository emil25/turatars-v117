const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 170)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?S53' + x + Date.now();
  await p.goto(U('0') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  // A userek profillal
  await p.evaluate(() => { Store.signup('Alek', 'a@x.io', 'aapassword1', 'Gyergyó'); Store.me().onboarded = true; Store.save(); window.c53.setMyProf({ name: 'Alek', exp: 'Haladó', regions: ['Hargita'], types: ['Gerinctúra'], avail: true }); });
  const aTour = await p.evaluate(() => { const t = Store.newTourFromDraft({ title: 'A Tervezett', place: 'Hargita', date: '2026-12-15', lengthKm: 12, ascent: 600 }); Store.save(); return t.id; });
  await p.evaluate(() => { Store.logout(); Store.signup('Béla', 'b@x.io', 'bbpasswordx1', 'Csík'); Store.me().onboarded = true; Store.save(); window.c53.setMyProf({ name: 'Béla', regions: ['Csík'] }); });
  await p.goto(U('1') + '#/tarsak', { waitUntil: 'networkidle' }); await p.waitForTimeout(1300);
  console.log('T1 lista A-val:', await p.evaluate(() => /Alek/.test(document.getElementById('view').innerText)));
  await p.evaluate(() => { const x = [...document.querySelectorAll('[data-c53add]')].find(y => true); x && x.click(); }); await p.waitForTimeout(600);
  console.log('T2 jelölés elküldve (store):', await p.evaluate(() => Store.community().connections.length === 1 && Store.community().connections[0].status === 'pending'));
  await p.evaluate(() => { Store.logout(); Store.login('a@x.io', 'aapassword1'); }); await p.waitForTimeout(300);
  await p.goto(U('2') + '#/tarsak', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  console.log('T3 bejövő + elfogadás gomb:', await p.evaluate(() => { const x = document.querySelector('[data-c53dec$=":accepted"]'); return !!x; }));
  await p.evaluate(() => { const x = document.querySelector('[data-c53dec$=":accepted"]'); x && x.click(); }); await p.waitForTimeout(900);
  console.log('T4 elfogadva kétirányú:', await p.evaluate(() => Store.community().connections[0].status === 'accepted'));
  console.log('T5 B megkapta az értesítést:', await p.evaluate(() => { Store.community(); location.hash = '#/tarsak'; const n = C5(); function C5(){ return Store.community().notifs.filter(x => x.to === 'b@x.io'); } return n.length >= 1; }), await p.evaluate(() => Store.community().notifs.filter(x => x.to === 'b@x.io').length));
  // B megkapja az értesítést a join után
  await p.evaluate(() => { Store.logout(); const r = Store.login('a@x.io', 'aapassword1'); return r; }); await p.waitForTimeout(400);
  const inv = await p.evaluate(id => { const i = window.c53.createInvite(id); return i && i.token; }, aTour);
  console.log('T6 invite:', !!inv);
  await p.evaluate(() => { Store.logout(); Store.login('b@x.io', 'bbpasswordx1'); }); await p.waitForTimeout(400);
  await p.goto(U('3') + '#/meghivo/' + inv, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1100);
  console.log('T7 invite view:', await p.evaluate(() => /Csatlakozom/.test(document.getElementById('view').innerText)));
  await p.evaluate(() => { const x = document.getElementById('c53-inv-go'); x && x.click(); }); await p.waitForTimeout(900);
  console.log('T8 join: participants', await p.evaluate(id => { const st = Store.findTourAnywhere(id); return { n: (st && st.tour.participants || []).length, t: JSON.stringify(((st && st.tour.participants || [])[0] || {}).name) }; }, aTour));
  // shared view B-nek
  await p.goto(U('4') + '#/tura/' + aTour, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  console.log('T9 shared view B:', await p.evaluate(() => /READ-ONLY/.test(document.getElementById('view').innerText) && /Alek/.test(document.getElementById('view').innerText)));
  console.log('T10 shared listák:', await p.evaluate(() => /⏱ Időterv|🎒 Felszerelés|✅|💧|👥 Résztvevők/.test(document.getElementById('view').innerText)));
  await p.evaluate(() => { Store.login('a@x.io', 'aapassword1'); }); await p.waitForTimeout(400);
  await p.goto(U('5') + '#/tura/' + aTour, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300);
  console.log('T11 owner c53 sáv:', await p.evaluate(() => !!document.getElementById('c53-invite') && !!document.getElementById('c53-publish')));
  await p.evaluate(() => { const x = document.getElementById('c53-publish'); x && x.click(); }); await p.waitForTimeout(800);
  console.log('T12 preview modal:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return !!m && /Túra meghirdetése/.test(m.innerText); }));
  await p.evaluate(() => { const x = document.querySelector('[data-modal] #pv_go'); x && x.click(); }); await p.waitForTimeout(1200);
  const ev = await p.evaluate(id => { const e = Store.platform().events.find(x => x.projectId === id); return e && { st: e.status, comm: e.community }; }, aTour);
  console.log('T13 created draft community:', JSON.stringify(ev));
  await p.evaluate(id => { const e = Store.platform().events.find(x => x.projectId === id); e.status = 'published'; Store.save(); }, aTour);
  await p.goto(U('6') + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(700);
  console.log('T14 discovery community chip:', await p.evaluate(id => { const e = Store.platform().events.find(x => x.projectId === id); return [...document.querySelectorAll('#f9-list .f9card')].some(c => (e ? c.textContent.includes(e.name.slice(0, 10)) : false)); }, aTour));
  // join C
  await p.evaluate(() => { Store.logout(); Store.signup('Cili', 'c@x.io', 'ccpasswordx1', 'X'); Store.me().onboarded = true; });
  await p.goto(U('7') + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1100);
  await p.evaluate(() => { const t = document.querySelector('[data-f9tab="events"]'); t && t.click(); }); await p.waitForTimeout(600);
  const found = await p.evaluate(() => { const c = [...document.querySelectorAll('#f9-list .f9card')].find(x => /Alek|Tervezett|community|A Tervezett/.test(x.textContent)); if (!c) return 'NOCARD?'; const b = c.querySelector('[data-f9ev]'); b && b.click(); return !!b; });
  await p.waitForTimeout(700);
  const jr = await p.evaluate(() => { const x = document.querySelector('[data-modal] [data-e2join]'); x && x.click(); return !!x; }); await p.waitForTimeout(800);
  console.log('T15 C Jelentkezem:', jr, '| applicants:', await p.evaluate(() => Store.platform().participants.length));
  await p.evaluate(() => { Store.login('a@x.io', 'aapassword1'); }); await p.waitForTimeout(400);
  // owner decide UI-n keresztül? egyszerűbb: user A login + app
  await p.goto(U('8') + '#/szervezo', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300);
  console.log('T16 közösségi szekció:', await p.evaluate(() => /Közösségi túráim/.test(document.getElementById('view').innerText)));
  await p.evaluate(() => { const b = document.querySelector('[data-e2app]'); b && b.click(); }); await p.waitForTimeout(800);
  console.log('T17 applicants modal:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return !!m && /Cili|Jelentkezők/.test(m.innerText); }));
  await p.evaluate(() => { const x = document.querySelector('[data-modal] [data-e2dec]'); x && x.click(); }); await p.waitForTimeout(1000);
  console.log('T18 elfogadás → résztvevő a projektben:', await p.evaluate(id => { const st = Store.findTourAnywhere(id); const has = (st && st.tour.participants || []).some(p => p.name === 'Cili'); return has; }, aTour));
  console.log('T19 notif C-nek:', await p.evaluate(() => Store.community().notifs.filter(x => x.to === 'c@x.io' && /Elfogadta/.test(x.text)).length >= 1));
  await p.goto(U('9') + '#/vezerlopult', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2300);
  console.log('T20 dashboard c53mini:', await p.evaluate(() => !!document.getElementById('c53mini') && /közös|Túratársak|Még nincs/.test(document.getElementById('c53mini').innerText)));
  // profil blokk
  await p.evaluate(() => { Store.logout(); Store.login('a@x.io', 'aapassword1'); }); await p.waitForTimeout(400);
  await p.goto(U('10') + '#/profil', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1400);
  console.log('T21 profil közösség blokk:', await p.evaluate(() => !!document.getElementById('c53psec') && /1 túratárs|Közösség/.test(document.getElementById('c53psec').innerText)));
  const bad = pe.filter(x => !/favicon|net::|ERR_|mule|404/i.test(x));
  console.log('PE:', bad.length, bad.slice(0, 4));
  await b.close(); process.exit(0);
})().catch(e => { console.log('H', String(e.message).slice(0, 180)); process.exit(0); });
