const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 160)));
  const U = x => 'https://cq78ba4p.qwenwork.page/?N' + x + Date.now();
  await p.goto(U('a') + '#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { Store.signup('NN', 'nn@nn', 'nnnnnnnn1', 'X'); Store.me().onboarded = true; const d = Store.myData(); d.routes = [{ id: 'rctl', name: 'Crawl Route', distance_km: 9.9, elevation_gain_m: 500, elevation_loss_m: 480, track: [[46.6, 25.4, 900], [46.61, 25.41, 970]], nPts: 2, created_at: new Date().toISOString(), source: 'gpx-import' }]; d.inbox = [{ id: 'ib1', type: 'note', title: 'jegy', note: 'x', at: new Date().toISOString(), created_at: new Date().toISOString(), status: 'new' }]; Store.save(); });
  async function tryModal(tag2, opener) { try { const had = await p.evaluate(o => { const el = typeof o === 'function' ? o() : (document.querySelector(o.split(',')[0].trim()) || document.querySelector(o.split(',')[1].trim())); if (!el) return 'NOEL'; el.click(); return true; }, opener); if (had !== true) { console.log(tag2, '→', had); return; } await p.waitForTimeout(1400);
      const st = await p.evaluate(() => { const m = document.querySelector('[data-modal]'); if (!m) return 'NO-MODAL'; return m.querySelectorAll('[data-close]').length ? 'HAS-CLOSE' : 'NO-CLOSE'; }); console.log(tag2, st);
      await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(500); } catch (e) { console.log(tag2, 'ERR:', e.message.slice(0, 120)); } }
  await p.goto(U('f') + '#/felfedezes', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300); await tryModal('f9', '#f9-list [data-f9tour]');
  await p.goto(U('i') + '#/inbox', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300); await tryModal('ib26-new', '#ib26-new');
  await p.goto(U('i2') + '#/inbox', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200); await tryModal('ib26-del', '[data-ib2d]');
  await p.goto(U('u') + '#/utvonalak', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1300); await tryModal('gpx', '#rt-import, #rt-import-empty');
  await tryModal('rtdet', () => { if (!window.__rtopen) return false; window.__rtopen('rctl', true); return !!document.querySelector('[data-modal]'); });
  console.log('PE:', pe.slice(0, 3));
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
