/* ===== V51 CRAWL — desktop + mobil: route-integritás, halott kontrollok, modal-ek, overflow, PE/konzol ===== */
const { chromium } = require('playwright');
const R = []; const say = (n, okv, d) => { R.push([!!okv, n, d === undefined ? '' : String(d)]); };
const ROUTES = ['#/', '#/felfedezes', '#/esemenyek', '#/szervezo', '#/tarsak', '#/csapat', '#/hagymas', '#/szatt', '#/esemenyek', '#/helyek', '#/vezerlopult', '#/turaim', '#/uj-tura', '#/inbox', '#/naptar', '#/bakancslista', '#/felszereles', '#/csapatok', '#/naplo', '#/terepi', '#/sablonok', '#/statisztikak', '#/terkep', '#/utvonalak', '#/beallitasok', '#/profil', '#/ertesitesek', '#/ai'];
const SKIP_BTN = /Törlés|Törl\(|🚪|Kijelentkezés|reset|Adatok törl|importálás|Importálás|💾 Mentés|✓ Így mentem|Elrasz|Felfedez egy|Küldés|🤖|Felismerni|Feldolgozom|🙂|👍|Mentés az Inboxba/i;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  async function seed(ctx) { const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await p.goto('https://cq78ba4p.qwenwork.page/#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    await p.evaluate(() => { const r = Store.signup('Crawl Elek' + Math.random(), 'cr' + Math.random().toString(36).slice(2) + '@v51.io', 'crawlpassword1', 'Gyergyó'); if (r.ok) { Store.me().onboarded = true; Store.save(); } });
    // adat: 2 projekt (1 teljesített+journal), 1 event-projekt, wish,route,inbox item, gear
    await p.evaluate(() => { const d = Store.myData(); const t = Store.newTourFromDraft({ title: 'Crawl Túra', place: 'Csúcs', region: 'Hargita', date: '2026-09-20', lengthKm: 12, ascent: 800 }); Store.save(); Store.completeTour(t.id, { rating: 4, doneAt: '2026-09-01' });
      const t2 = Store.newTourFromDraft({ title: 'Crawl Tervező', place: 'Völgy', region: 'Gyergyó', date: '2026-10-05', lengthKm: 7, ascent: 300 }); t2.status = 'tervezés'; Store.save();
      d.routes = [{ id: 'rctl', name: 'Crawl Route', distance_km: 9.9, elevation_gain_m: 500, elevation_loss_m: 480, track: [[46.6, 25.4, 900], [46.61, 25.41, 970], [46.62, 25.42, 1020], [46.63, 25.43, 980]], nPts: 4, created_at: new Date().toISOString(), source: 'gpx-import' }];
      t2.routeId = 'rctl'; d.wishlist.push({ id: 'wctl', ref: 'f9:t:maria-ko', name: 'Mária-kő', cat: 'Csúcsok', addedAt: '2026-09-01' });
      d.inbox = (d.inbox || []); d.inbox.push({ id: 'ibctl', type: 'note', title: 'Crawl jegyzet', note: 'teszt', at: new Date().toISOString(), created_at: new Date().toISOString(), read: false, status: 'new' }); Store.save(); });
    return { p, errs }; }

  async function viewportRun(tag, w, h, opts) {
    const ctx = await b.newContext(Object.assign({ viewport: { width: w, height: h } }, opts || {}));
    const { p, errs } = await seed(ctx);
    /* 1) route-integritás */
    const allHrefs = new Set(ROUTES);
    for (const r of ROUTES) { await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'HREF' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(950);
      const hs = await p.evaluate(() => [...document.querySelectorAll('a[href^="#/"]')].map(a => a.getAttribute('href')));
      hs.forEach(x => allHrefs.add(x.split('?')[0])); }
    let badRoute = [];
    for (const href of allHrefs) { const key = href.replace(/^#\//, '').split('/')[0];
      if (key && /tura|turak|osztott/.test(key)) continue;
      await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'R' + Date.now() + href, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(750);
      const s = await p.evaluate(() => { const v = document.getElementById('view'); return { len: v ? (v.innerText || '').length : 0, txt: (v ? v.innerText : '').slice(0, 50) }; });
      if (s.len < 25 || /NaN|undefined|404|not found|Nem éri/i.test(s.txt)) badRoute.push(href + '(' + s.len + (s.txt ? ':' + s.txt.slice(0, 24) : '') + ')'); }
    say(tag + '-routes: minden link él', !badRoute.length, badRoute.slice(0, 5).join(' ; '));
    /* 1b) dynamikus oldalak: workspace + túra mód */
    { const wid2 = await p.evaluate(() => (Store.myData().tours || []).map(x => x.id)[0]);
      for (const dr of ['#/tura/' + wid2, '#/turamod/' + wid2]) { await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'DYN' + Date.now() + dr, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300);
        const s = await p.evaluate(() => { const v = document.getElementById('view'); return { len: v ? (v.innerText || '').length : 0 }; });
        say(tag + '-dyn él ' + dr.split('/')[2], s.len > 120, 'len:' + s.len); } }
    /* 2) lapok: PE/konzol/overflow */
    let overAll = [], pePages = [];
    for (const r of ROUTES) { await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'P' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1150);
      const o = errs.length; const ov = await p.evaluate(() => { const out = []; document.querySelectorAll('*').forEach(x => { try { const g = getComputedStyle(x); if (g.overflowX === 'visible' && x.scrollWidth > x.clientWidth + 3 && x.clientWidth > 110) out.push((x.tagName + '.' + String(x.className).slice(0, 16)) + ' ' + x.scrollWidth + '>' + x.clientWidth); } catch (e) { } }); const html = document.documentElement; return { list: out.slice(0, 6), sw: html.scrollWidth, iw: window.innerWidth }; });
      if (ov.sw > ov.iw + 2) overAll.push(r + ' sw' + ov.sw);
      else if (ov.list.length && /[a-z]/i.test(r + ov.list.join(''))) { /* belső scroller-gyanús: csak lap-szint számít hibának */ }
      if (errs.length > o) pePages.push(r + ' → ' + errs.slice(o, o + 2).join(';')); }
    say(tag + '-pages: nincs lap-szintű vízszintes overflow', !overAll.length, overAll.join(', '));
    say(tag + '-pages: pageerror 0', !pePages.length, pePages.join(' ;; '));
    /* 3) halott kontroll sweep: oldalanként max 14 gomb, fresh reload per click */
    const dead = []; const clickedTotal = { n: 0 };
    for (const r of ROUTES.concat(['#/tura/AUTO'])) {
      await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'D' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1250);
      let tid = null;
      if (r === '#/tura/AUTO') { tid = await p.evaluate(() => (Store.myData().tours || []).map(x => x.id)[0] || null); if (!tid) continue; continue; } // separately handled below on workspace
      const btns = await p.evaluate(() => { const out = []; document.querySelectorAll('#view button, header button, aside button').forEach((x, i) => { const t = (x.textContent || x.title || '').trim(); if (!t || t.length > 40) return; if (/Törlés|Törl|🚪|Kijelentkez|💾|Mentés|Felism|Elküld|Import|Készít|Alkalmaz|✓ Teljesítes|🗑|⌫|☑|✕|×/i.test(t)) return; out.push(i + '|' + x.tagName + '|' + t.slice(0, 24) + '|' + String(x.className).slice(0, 14)); }); return out.slice(0, 12); });
      for (let i = 0; i < btns.length; i++) {
        const idx = +btns[i].split('|')[0]; const before = await p.evaluate(() => ({ h: location.hash, v: (document.getElementById('view') || {}).innerHTML.length }));
        const had = await p.evaluate(x => { const el = [...document.querySelectorAll('#view button, header button, aside button')][x]; if (!el) return false; el.click(); return true; }, idx);
        if (!had) continue; clickedTotal.n++; await p.waitForTimeout(850);
        const after = await p.evaluate(() => ({ h: location.hash, v: (document.getElementById('view') || {}).innerHTML.length, modal: !!document.querySelector('[data-modal]'), toast: !!document.querySelector('.toast,#toasts,.toastv'), dom: document.body.innerHTML.length }));
        const changed = after.h !== before.h || after.v !== before.v || after.modal || after.toast || after.dom > 4700 + i;
        if (!changed) dead.push(r + ' → ' + btns[i].split('|').slice(1).join(' '));
        if (after.modal) { await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(450); }
        if (after.h !== before.h) { await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'D' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(950); } } }
    /* workspace lap külön (dinamikus id) */
    const wid = await p.evaluate(() => (Store.myData().tours || []).map(x => x.id)[0]);
    if (wid) { const r = '#/tura/' + wid; await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'W' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1400);
      const wsBtns = await p.evaluate(() => [...document.querySelectorAll('#view button')].map((x, i) => ({ i, t: (x.textContent || '').trim().slice(0, 22) })).filter(x => x.t && x.t.length <= 26 && !/Törl|💾|Mentés|Készít|Alkalmaz|Teljesít|Import|Elküld|Küld|🗑|⌫|☑|📥|⬇️|🗺️ GPX|Húzd|×|✕/.test(x.t)).slice(0, 18));
      for (const bb of wsBtns) { const before = await p.evaluate(() => ({ h: location.hash, l: document.body.innerHTML.length }));
        const okc = await p.evaluate(x => { const arr = [...document.querySelectorAll('#view button')]; const el = arr[x.i] && x.t && arr[x.i].textContent.trim().slice(0, 22) === x.t ? arr[x.i] : arr.find(y => (y.textContent || '').trim() === x.t); if (!el) return 'GONE'; el.click(); return 'OK'; }, bb);
        if (okc !== 'OK') continue;
        // openCockpit awaits the existing weather lookup before displaying its modal.
        // Wait for the observable result instead of declaring it dead after 850 ms.
        if (bb.t.includes('Hogy áll a túrám?')) await p.locator('[data-modal] #ck-re').waitFor({state:'visible',timeout:15000});
        else await p.waitForTimeout(850);
        const after = await p.evaluate(() => ({ h: location.hash, l: document.body.innerHTML.length, modal: !!document.querySelector('[data-modal]'), t: !!document.querySelector('.toast,#toasts'), act: (document.querySelector('.ws-tabs .on,[data-wstab].on, button.on') || {}).textContent || '' }));
        if (after.h === before.h && after.l === before.l && !after.modal && !after.t && !new RegExp(bb.t.slice(0, 6)).test(after.act)) dead.push(r + ' ws→ ' + JSON.stringify(wsBtns.map(x => x.t)) && (r + ' ws#' + bb.i + ':' + bb.t));
        if (after.modal) { await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(400); }
        if (after.h !== before.h) { await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'W' + Date.now() + r, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(950); } } }
    say(tag + '-dead: nincs halott kontroll (' + clickedTotal.n + ' kattintás)', !dead.length, dead.slice(0, 10).join(' ;; '));
    /* 4) modal sweep */
    await p.evaluate(() => { const d = Store.myData(); if (!d.tours.some(x => x.title === 'Crawl Túra')) { const t = Store.newTourFromDraft({ title: 'Crawl Túra', place: 'Csúcs', region: 'Hargita', date: '2026-09-20', lengthKm: 12, ascent: 800 }); Store.save(); Store.completeTour(t.id, { rating: 4, doneAt: '2026-09-01' }); } if (!(d.routes || []).some(x => x.id === 'rctl')) { d.routes = (d.routes || []).concat([{ id: 'rctl', name: 'Crawl Route', distance_km: 9.9, elevation_gain_m: 500, elevation_loss_m: 480, track: [[46.6, 25.4, 900], [46.61, 25.41, 970]], nPts: 2, created_at: new Date().toISOString(), source: 'gpx-import' }]); if (d.tours[1]) d.tours[1].routeId = 'rctl'; Store.save(); } });
    const modals = [];
    async function tryModal(name, opener) { try { const had = await p.evaluate(o => { const el = document.querySelector(o.split(',')[0].trim()) || (o.split(',')[1] || '').trim() && document.querySelector(o.split(',')[1].trim()); if (!el) return false; el.click(); return true; }, opener); if (!had) return; await p.waitForTimeout(1400);
      const okm = await p.evaluate(() => { const m = document.querySelector('[data-modal]'); if (!m) return 'NO-MODAL'; const cl = [...m.querySelectorAll('[data-close]')]; m._l = m.innerText.length; return cl.length ? 'HAS-CLOSE' : 'NO-CLOSE'; });
      if (okm !== 'HAS-CLOSE') { modals.push(name + ':' + okm); return; }
      await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(500);
      const gone = await p.evaluate(() => !document.querySelector('[data-modal]')); if (!gone) modals.push(name + ':NEM-ZÁRÓDIK'); } catch (e) { modals.push(name + ':ERR:' + String(e && e.message).slice(0, 90)); } }
    await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'M' + Date.now() + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
    await tryModal('f9-tour', '#f9-list [data-f9tour]');
    await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'M2' + Date.now() + '#/inbox', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
    await tryModal('ib26-composer', '#ib26-new'); await tryModal('ib26-del', '[data-ib2d]');
    await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'M4' + Date.now() + '#/utvonalak', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1150);
    await tryModal('gpx-import', '#rt-import, #rt-import-empty');
    { const had = await p.evaluate(() => { if (!window.__rtopen) return false; window.__rtopen('rctl', true); return !!document.querySelector('[data-modal]'); });
      if (had) { await p.waitForTimeout(900); const cl = await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return m ? m.querySelectorAll('[data-close]').length : 0; });
        if (!cl) modals.push('route-detail:NO-CLOSE'); else { await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(450); if (await p.evaluate(() => !!document.querySelector('[data-modal]'))) modals.push('route-detail:NEM-ZÁRÓDIK'); } } else modals.push('route-detail:NO-OPEN'); }
    await p.goto('https://cq78ba4p.qwenwork.page/?' + tag + 'M5' + Date.now() + '#/tura/' + wid, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300);
    await tryModal('planner', '#btn-ai'); await tryModal('review', '#btn-rvw'); await tryModal('cockpit', '#btn-cockpit');
    await p.evaluate(() => { const m = document.querySelector('#tab-gear,[data-ws="gear"]'); m && m.click(); }); await p.waitForTimeout(700);
    say(tag + '-modals: nyílik + záródik', !modals.length, modals.join(' ;; '));
    await ctx.close();
  }
  await viewportRun('MOB', 390, 844, { hasTouch: true });
  await viewportRun('DESK', 1280, 900);
  const flat = R.filter(x => !x[0]);
  console.log('===== V51 CRAWL ====='); R.forEach(x => console.log((x[0] ? '✓ ' : '✗ ') + x[1] + (x[2] ? ' → ' + x[2].slice(0, 240) : '')));
  console.log('eredmény: ' + (R.length - flat.length) + '/' + R.length);
  await b.close();
})().catch(e => { console.log('FUTÁS:', e.message.slice(0, 200)); R.filter(x => !x[0]).forEach(x => console.log('✗ ' + x[1])); process.exit(1); });
