const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); const pe = []; p.on('pageerror', e => pe.push(String(e).slice(0, 160)));
  await p.goto('https://cq78ba4p.qwenwork.page/#/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { Store.signup('M', 'm@m', 'mmmmmmmm1', 'X'); Store.me().onboarded = true; const d = Store.myData(); d.routes = [{ id: 'rctl', name: 'Crawl Route', distance_km: 9.9, elevation_gain_m: 500, elevation_loss_m: 480, track: [[46.6, 25.4, 900], [46.61, 25.41, 970]], nPts: 2, created_at: new Date().toISOString(), source: 'gpx-import' }]; Store.save(); });
  await p.goto('https://cq78ba4p.qwenwork.page/?M1' + Date.now() + '#/utvonalak', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  console.log('gpx-import nyitás:', await p.evaluate(() => { const e = document.querySelector('#rt-import,#rt-import-empty'); if (!e) return 'NO-BTN'; e.click(); return 'clicked'; }));
  await p.waitForTimeout(900);
  console.log('modal:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return m ? 'OPEN closes:' + m.querySelectorAll('[data-close]').length : 'NONE'; }));
  await p.evaluate(() => { const x = [...document.querySelectorAll('[data-modal] [data-close]')].pop(); x && x.click(); }); await p.waitForTimeout(500);
  console.log('route-detail:', await p.evaluate(() => { if (!window.__rtopen) return 'NO-API'; try { window.__rtopen('rctl', true); return 'called modal:' + !!document.querySelector('[data-modal]'); } catch (e) { return 'THREW:' + e.message.slice(0, 90); } }));
  await p.waitForTimeout(400);
  console.log('close gomb:', await p.evaluate(() => { const m = document.querySelector('[data-modal]'); return m ? m.querySelectorAll('[data-close]').length + ' db;' + (m.innerText || '').slice(0, 40).replace(/\n/g, '·') : 'NO-MODAL'; }));
  console.log('PE:', pe);
  await b.close();
})().catch(e => console.log('H', e.message.slice(0, 160)));
