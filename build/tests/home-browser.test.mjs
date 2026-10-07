import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { TT_PLAYWRIGHT_PATH, TT_EDGE_PATH } = process.env;
assert.ok(TT_PLAYWRIGHT_PATH && fs.existsSync(TT_PLAYWRIGHT_PATH), 'Set TT_PLAYWRIGHT_PATH to the installed Playwright entry point');
assert.ok(TT_EDGE_PATH && fs.existsSync(TT_EDGE_PATH), 'Set TT_EDGE_PATH to the installed browser');
const { chromium } = await import(pathToFileURL(TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: TT_EDGE_PATH });
const base = process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/';
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
// Browser fixtures must never write an Auth account, profile or snapshot to production.
await context.route('**/*.supabase.co/**', route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
const page = await context.newPage();
// Local fallback fixtures can trigger the existing optional cloud onboarding.
await page.addLocatorHandler(page.locator('#v4_later'), async button=>{await button.click();});
const errors = [], consoleErrors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => {
  if(m.type() === 'error' && !/Failed to load resource|net::ERR_/i.test(m.text())) consoleErrors.push(m.text());
});
const catalog = () => page.evaluate(() => JSON.stringify({ catalog: V122.catalog(), routes: v125KnownRoutes() }));
const checkLayout = async width => {
  const result = await page.evaluate(() => {
    const content = document.querySelector('.home-content');
    const style = getComputedStyle(content), rect = content.getBoundingClientRect();
    const left = rect.left + parseFloat(style.paddingLeft), right = rect.right - parseFloat(style.paddingRight);
    const outside = [...content.querySelectorAll(':scope > section')].filter(e=>{
      const r=e.getBoundingClientRect(); return r.left < left-1 || r.right > right+1;
    }).map(e=>e.querySelector('h2')?.textContent);
    const controls = [...document.querySelectorAll('.home-shortcuts a,.home-categories button,.home-content button,.home-content .v125-route-actions a,.home-center-features a,.home-center-actions a,.home-center-preview>a')].filter(e=>e.getClientRects().length);
    return { width: document.documentElement.scrollWidth, outside,
      heroPadding: parseFloat(getComputedStyle(document.querySelector('.hero-in')).paddingLeft),
      smallControls: controls.filter(e=>e.getBoundingClientRect().height < 43.5).map(e=>e.textContent) };
  });
  assert.ok(result.width <= width, `Horizontal overflow at ${width}: ${result.width}`);
  assert.deepEqual(result.outside, [], 'Sections must stay inside the common page container');
  assert.ok(result.heroPadding >= 16, 'Hero content must have a safe side gutter');
  assert.deepEqual(result.smallControls, [], 'Touch controls must be at least 44px high');
};

try {
  await page.goto(base+'#/', { waitUntil: 'networkidle' });
  const originalCatalog = await catalog();
  const counts = await page.evaluate(() => ({ tours: V122.catalog().tours.length, places: V122.catalog().places.length,
    events: V122.catalog().events.length, known: v125KnownRoutes().length,
    demo: V122.catalog().tours.concat(V122.catalog().places,V122.catalog().events).filter(x=>x.demo).length }));
  assert.deepEqual(counts, {tours:13,places:3,events:9,known:37,demo:0});
  assert.match(await page.locator('.hero h1').innerText(), /Merre kalandozol\s+legközelebb\?/);
  assert.equal(await page.locator('.home-shortcuts a').count(), 6);
  assert.equal(await page.locator('.home-content #v125-home-known').count(), 1);
  assert.equal(await page.locator('.home-content .v126-home-community').count(), 1);
  assert.equal(await page.locator('a[href^="##"]').count(), 0);
  assert.equal(await page.locator('.home-redesign').count(),1);
  assert.equal(await page.locator('#home-tour-center').count(),1,'Personal tools must be explained in one prominent section');
  assert.deepEqual(await page.locator('.home-center-features h4').allTextContents(),[
    'Saját túraprojekt','Felkészülés indulásra','Közös túra szervezése','GPS és GPX','Saját túrázókönyv','Helyi és felhőmentés']);
  assert.equal(await page.locator('[data-home-center-main]').getAttribute('href'),'#/regisztracio');
  assert.ok((await page.locator('.home-center-features a').evaluateAll(links=>links.map(a=>a.getAttribute('href')))).every(x=>x==='#/regisztracio'));
  const position=await page.evaluate(()=>({center:document.querySelector('#home-tour-center').getBoundingClientRect().top,
    search:document.querySelector('#home-find').getBoundingClientRect().top,
    catalog:document.querySelector('.home-tour-card').getBoundingClientRect().top}));
  assert.ok(position.search<position.center&&position.center<position.catalog,'Tool showcase belongs near the search, before catalog cards');
  const screenshot=await page.request.get(new URL('./screens/tour-project.png',base).href);
  assert.equal(screenshot.status(),200,'The real application screenshot must load');
  assert.match(screenshot.headers()['content-type'],/image\/png/);
  const png=await screenshot.body();
  assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.ok(png.length>30000,'The asset must be an actual screenshot, not a placeholder');
  assert.match(await page.locator('.home-center-preview').innerText(),/Valódi alkalmazáskép/);
  assert.match(await page.locator('.home-center-note').innerText(),/helymeghatározási engedély.*internetkapcsolat/);
  assert.equal(await page.locator('.home-tour-card img,#home-events img,#weekend-grid img').count(),0,
    'Tour facts and dated events must not use unrelated repeated stock photos');
  assert.deepEqual(await page.locator('.home-place-card h3').allTextContents(),['Szent Anna-tó','Gyilkos-tó','Hargitafürdő']);
  const photoPaths = await page.locator('.home-hero-photo>img,.home-place-photo>img').evaluateAll(images=>images.map(img=>img.getAttribute('src')));
  assert.equal(photoPaths.length,4);
  assert.equal(new Set(photoPaths).size,4,'Each homepage photograph must be different');
  assert.ok(photoPaths.every(src=>src.startsWith('./photos/')),'Licensed photos must be hosted with the application');
  for(const src of photoPaths) {
    const response=await page.request.get(new URL(src,base).href);
    assert.equal(response.status(),200,`Missing photo: ${src}`);
    assert.match(response.headers()['content-type'],/image\/jpeg/);
    assert.ok((await response.body()).length>20000,'A photo must contain the actual image data');
  }
  assert.equal(await page.locator('#home-photo-credits a').count(),8,'All photos must have source and license links');
  assert.equal(await page.locator('#home-events .home-event-row').count(),await page.evaluate(()=>v122PublicEvents().slice(0,6).length));
  assert.doesNotMatch(await page.locator('.home-content').innerText(),/\bDEMO\b|function\(\)\s*\{/);
  await checkLayout(1440);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight) < 6200, 'Default homepage should be compact');
  await page.locator('.home-hero-actions a[href="#home-tour-center"]').click();
  await page.waitForFunction(()=>{const r=document.querySelector('#home-tour-center').getBoundingClientRect();return r.top>=0&&r.top<200;});
  assert.equal(await page.evaluate(()=>location.hash),'#/','Feature showcase anchor must not leave the homepage or invoke the router');
  await page.locator('[data-home-center-main]').click();
  await page.waitForURL(/#\/regisztracio/);
  assert.ok(await page.locator('#view input[type="email"]').count()>0,'Visitors must reach the real registration form');
  await page.goto(base+'#/',{waitUntil:'networkidle'});
  await page.locator('.home-hero-actions a[href="#home-find"]').click();
  await page.waitForFunction(()=>{const r=document.querySelector('#home-find').getBoundingClientRect();return r.top>=0&&r.top<200;});
  assert.equal(await page.evaluate(()=>location.hash),'#/','Homepage section links must not trigger the SPA router');
  await page.locator('.home-hero-photo a[href="#home-photo-credits"]').click();
  assert.equal(await page.locator('#home-photo-credits[open]').count(),1,'Photo attribution must be accessible from the hero');
  assert.equal(await page.evaluate(()=>location.hash),'#/');
  await page.locator('#home-photo-credits summary').click();

  for(const category of ['family','easy','sunrise','weekend']) {
    await page.locator(`[data-home-category="${category}"]`).click();
    const expected = {
      family: ['Gyilkos-tó körül','Szent Anna menedékház – Cecele'],
      easy: ['Gyilkos-tó körül','Szent Anna menedékház – Cecele','SZATT 10 km – Szent Anna-tó'],
      sunrise: [],
      weekend: ['Hargitafürdő – Erdőalja','Balánbánya – Egyeskő menedékház','Gyilkos-tó körül']
    }[category];
    assert.deepEqual(await page.locator('#weekend-grid h3').allTextContents(), expected);
    assert.equal(await page.locator(`[data-home-category="${category}"]`).getAttribute('aria-pressed'), 'true');
    if(!expected.length) assert.match(await page.locator('#weekend-grid').innerText(), /még nincs ellenőrzött túra/);
  }
  await page.locator('.home-more summary').click();
  assert.equal(await page.locator('.home-more[open]').count(), 1);
  assert.equal(await page.locator('.home-more .tcard').count(), 3);
  await page.locator('#v125-home-known summary').click();
  assert.equal(await page.locator('#v125-home-known .v125-route-card').count(), 37);
  await checkLayout(1440);
  await page.locator('#v125-home-known summary').click();
  await page.locator('.home-more summary').click();

  await page.locator('[data-home-region="Csomád-hegység"]').click();
  await page.waitForURL(/#\/felfedezes/);
  assert.ok(await page.locator('#disc-results .tcard').count()>0);
  assert.ok((await page.locator('#disc-results .region').allTextContents()).every(s=>s.includes('Csomád-hegység')));
  await page.goto(base+'#/',{waitUntil:'networkidle'});
  await page.locator('[data-home-place-search="Gyilkos-tó"]').click();
  await page.waitForURL(/#\/felfedezes/);
  assert.ok(await page.locator('#disc-results .tcard').count()>0);
  assert.ok((await page.locator('#disc-results h3').allTextContents()).every(s=>s.includes('Gyilkos-tó')));
  await page.goto(base+'#/',{waitUntil:'networkidle'});

  for(const width of [768,390,320]) {
    await page.setViewportSize({width,height:844});
    await checkLayout(width);
  }
  await page.setViewportSize({width:390,height:844});
  const shotDir = process.env.TT_SCREENSHOT_DIR;
  if(shotDir) {
    fs.mkdirSync(shotDir,{recursive:true});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(shotDir,'home-mobile.png'),fullPage:false});
    await page.locator('#home-tour-center').screenshot({path:path.join(shotDir,'tour-center-mobile.png')});
  }
  await page.locator('#q-hova').fill('Gyilkos');
  await page.locator('#q-hova').press('Enter');
  await page.waitForURL(/#\/felfedezes/);
  assert.ok(await page.locator('#disc-results .tcard').count() > 0);
  for(const title of await page.locator('#disc-results h3').allTextContents()) assert.match(title,/Gyilkos/i);
  await page.locator('#disc-results h3 a').first().click();
  assert.ok(await page.locator('#modal-root [data-modal]').count() === 1);
  await page.locator('#modal-root [data-close]').first().click();
  await page.goto(base+'#/',{waitUntil:'networkidle'});
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await catalog(),originalCatalog,'Homepage interactions/reload must not alter catalog data');

  // Isolated browser-local fallback user; no Auth account or production data is created.
  await page.evaluate(()=>{ const r=Store.signup('Home regression','home-regression@test.local','local-regression-password','Csíkszereda');
    if(!r.ok) throw new Error(r.error||'Local test setup failed'); Store.me().onboarded=true; Store.save();
    const t=Store.newTourFromDraft({title:'Homepage local regression',place:'Csíkszereda'}); window.__homeTourId=t.id; });
  for(const route of ['','felfedezes','esemenyek','helyek','tervezes','kozossegi','turaim','uj-tura','utvonalak','naplo','felszereles','naptar','beallitasok','inbox']) {
    await page.goto(base+'#/'+route,{waitUntil:'domcontentloaded'});
    await page.locator('#view').waitFor({state:'visible'});
    assert.ok((await page.locator('#view').innerText()).length>20, `Route ${route} must render`);
  }
  const id = await page.evaluate(()=>Store.myData().tours.find(x=>x.title==='Homepage local regression').id);
  await page.goto(base+'#/tura/'+id,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#v120-start').count(),1,'Existing GPS start remains available');
  await page.goto(base+'#/',{waitUntil:'networkidle'});
  await checkLayout(390);
  assert.equal(await page.locator('[data-home-center-main]').getAttribute('href'),'#/vezerlopult');
  assert.match(await page.locator('[data-home-center-main]').innerText(),/Megnyitom a túraközpontomat/);
  assert.deepEqual(await page.locator('.home-center-features a').evaluateAll(links=>links.map(a=>a.getAttribute('href'))),[
    '#/uj-tura','#/turaim','#/turaim','#/utvonalak','#/naplo','#/beallitasok']);
  await page.locator('[data-home-center-main]').click();
  await page.waitForURL(/#\/vezerlopult/);
  assert.ok(await page.locator('#view h1').count()>0,'Signed-in hikers reach their actual dashboard');
  await page.goto(base+'#/',{waitUntil:'networkidle'});
  assert.equal(await catalog(),originalCatalog);
  if(shotDir) {
    await page.setViewportSize({width:1440,height:1000});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(shotDir,'home-desktop.png'),fullPage:false});
    await page.locator('#home-tour-center').screenshot({path:path.join(shotDir,'tour-center-desktop.png')});
  }
  assert.deepEqual(errors,[],'No page errors');
  assert.deepEqual(consoleErrors,[],'No application console errors');
  console.log(JSON.stringify({status:'PASS',catalog:counts,viewports:[1440,768,390,320],categories:4,
    routeSmoke:15,toolShowcase:6,showcaseAnchors:'PASS',visitorAndMemberActions:'PASS',pageerror:errors.length,consoleError:consoleErrors.length}));
} finally { await browser.close(); }
