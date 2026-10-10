import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

assert.ok(process.env.TT_PLAYWRIGHT_PATH && process.env.TT_EDGE_PATH,'Set existing Playwright and browser paths');
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
// This test owns an isolated browser-local user. It never writes to the live backend.
await context.route('**/*.supabase.co/**',route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
const page=await context.newPage();
// A local-only test user can receive the existing V54 account reminder.
// Dismiss it through its normal control, without changing the Auth/provider code.
await page.addLocatorHandler(page.locator('#v4_later'),async button=>{await button.click();});
const base=process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/';
const errors=[],consoleErrors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
const visit=async route=>{await page.goto(base+'#/'+route,{waitUntil:'domcontentloaded'});await page.locator('#view').waitFor();};
const catalog=()=>page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
const layout=async route=>{
  const result=await page.evaluate(()=>{
    const width=innerWidth;
    const intentionalScroll=e=>{
      for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){
        const s=getComputedStyle(p);if(['auto','scroll','hidden','clip'].includes(s.overflowX))return true;
      }return false;
    };
    const outside=[...document.querySelectorAll('#view :is(.card,.input,.btn,.grid,.page-heading,.sect-head,.sect-more,.tabs,.cal-grid)')]
      .filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(r.right>width+1||r.left< -1)&&!intentionalScroll(e);})
      .map(e=>e.className);
    const short=[...document.querySelectorAll('#view :is(.btn,.icon-btn,.f-pill),.pub-menu summary')]
      .filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<43.5).map(e=>e.textContent.trim());
    return {scrollWidth:document.documentElement.scrollWidth,width,outside,short};
  });
  assert.ok(result.scrollWidth<=result.width,`${route}: horizontal overflow ${JSON.stringify(result)}`);
  assert.deepEqual(result.outside,[],`${route}: content outside viewport`);
  assert.deepEqual(result.short,[],`${route}: controls smaller than 44px`);
};
const publicRoutes=['','felfedezes','esemenyek','helyek','szervezoknek','tervezes','kozossegi','belepes','regisztracio'];
const privateRoutes=['vezerlopult','turaim','uj-tura','naptar','bakancslista','felszereles','csapatok','naplo','statisztikak','ai','terkep','ertesitesek','beallitasok','profil','utvonalak','terepi','sablonok','szervezo','tarsak','inbox','hagymas','forrasok','szatt','csapat'];
let shotDir=process.env.TT_SCREENSHOT_DIR;
const shot=async name=>{if(shotDir){fs.mkdirSync(shotDir,{recursive:true});await page.screenshot({path:path.join(shotDir,name+'.png'),fullPage:true});}};
try{
  await visit('');const original=await catalog();
  const counts=await page.evaluate(()=>({tours:V122.catalog().tours.length,places:V122.catalog().places.length,events:V122.catalog().events.length,routes:v125KnownRoutes().length}));
  assert.deepEqual(counts,{tours:13,places:3,events:9,routes:37});
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:844});
    for(const route of publicRoutes){await visit(route);await layout(route);}
  }
  await visit('esemenyek');
  assert.equal(await page.locator('#view h1').count(),1,'Event page has a single heading hierarchy');
  assert.equal(await page.locator('.event-refined img,.e2pub img').count(),0,'Events must not use unrelated stock photos');
  const future=await page.evaluate(()=>v122PublicEvents().length);
  assert.equal(await page.locator('.event-refined').count(),future);
  await page.locator('[data-cat]').last().click();
  assert.equal(await page.locator('[data-cat][aria-pressed="true"]').count(),1);
  await page.locator('[data-cat=""]').click();
  await page.locator('.event-sources summary').click();
  assert.equal(await page.locator('.event-sources[open] .org-band a').count(),6,'All original organizer/source links remain');
  await page.locator('.event-sources summary').click();
  if(future){await page.locator('.event-actions a').first().click();assert.equal(await page.locator('#ev-save').count(),1);await layout('event detail');await page.locator('[data-close]').first().click();}
  await visit('helyek');
  assert.deepEqual(await page.locator('.place-card h3').allTextContents(),['Szent Anna-tó','Gyilkos-tó','Hargitafürdő']);
  const photos=await page.locator('.place-photo img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
  assert.equal(new Set(photos).size,3);assert.ok(photos.every(src=>src.startsWith('./photos/')));
  assert.equal(await page.locator('.place-credit').count(),3);
  await visit('szervezoknek');assert.equal(await page.locator('.organizer-steps li').count(),3);
  assert.equal(await page.locator('.organizer-cta a').first().getAttribute('href'),'#/regisztracio');
  await page.locator('.pub-menu summary').click();
  assert.equal(await page.locator('.pub-menu[open]').count(),1);
  await page.locator('.pub-menu-links a[href="#/esemenyek"]').click();
  await page.waitForURL(/#\/esemenyek/);await page.locator('.events-page').waitFor();
  assert.equal(await catalog(),original,'Public interactions must preserve every catalog record');

  await page.evaluate(()=>{const r=Store.signup('Design regression','design-regression@test.local','local-regression-password','Csíkszereda');if(!r.ok)throw Error(r.error);Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');});
  await visit('uj-tura');
  // Use the existing Store to prepare a private record; actual edit/save controls are exercised below.
  const id=await page.evaluate(()=>Store.newTourFromDraft({title:'Design regression hike',place:'Csíkszereda',desc:'Local UI regression',date:Store.addDays(Store.todayISO(),20),lengthKm:7,ascent:200,durationH:2}).id);
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:844});
    for(const route of [...publicRoutes.slice(0,7),...privateRoutes,'tura/'+id]){
      await visit(route);await layout(route);
      assert.ok((await page.locator('#view').innerText()).length>20,`${route}: page renders`);
      if(shotDir&&[1440,390].includes(width)&&['esemenyek','szervezoknek','felfedezes','helyek','turaim','naptar','szervezo','beallitasok'].includes(route))await shot(route+'-'+width);
    }
  }
  await visit('turaim');
  assert.equal(await page.locator('[data-tour-id="'+id+'"] .personal-cover').count(),1,'No automatic stock photo on a personal hike');
  await page.locator('[data-edit="'+id+'"]').click();
  await page.locator('#et-title').fill('Design regression edited');
  await page.locator('#et-save').click();
  assert.equal(await page.evaluate(id=>Store.getTour(id).title,id),'Design regression edited');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.match(await page.locator('[data-tour-id="'+id+'"]').innerText(),/Design regression edited/);
  await page.locator('[data-del="'+id+'"]').click();
  assert.equal(await page.locator('#cfm-yes').count(),1,'Deletion requires confirmation');
  await page.locator('[data-close]').first().click();
  assert.ok(await page.evaluate(id=>!!Store.getTour(id),id),'Cancelling deletion preserves the tour');
  await visit('tura/'+id);assert.equal(await page.locator('#v120-start').count(),1,'GPS start preserved');
  await visit('szervezo');await page.locator('#e2-reg').click();
  assert.equal(await page.locator('#e2o_save').count(),1,'Organizer profile form remains available');await layout('organizer form');
  await page.locator('[data-close]').first().click();
  await visit('felfedezes');
  assert.equal(await page.locator('#f9-list .f9card img').count(),0,'Logged-in catalog must also avoid repeated stock photos');
  assert.equal(await page.locator('#f9-list .f9card[data-id]').count(),13);
  await page.locator('#f9sort').selectOption('km');
  const distances=await page.locator('#f9-list .catalog-facts>div:first-child b').evaluateAll(items=>items.map(e=>parseFloat(e.textContent.replace(',','.'))));
  assert.equal(distances.length,13);assert.deepEqual(distances,[...distances].sort((a,b)=>a-b),'Displayed distances remain sorted');
  await page.locator('#f9diff').selectOption('Könnyű');
  assert.equal(await page.locator('#f9-list .f9card[data-id]').count(),await page.evaluate(()=>v122PublicTours().filter(t=>t.diff==='Könnyű').length));
  assert.equal(await page.locator('#v125-known').count(),1,'Known route section survives filter re-render');
  await page.locator('#v125-known summary').click();
  assert.equal(await page.locator('#v125-known .v125-route-card').count(),37);
  await layout('expanded known routes after filtering');
  await page.locator('#f9-list [data-f9tour]').first().click();
  assert.equal(await page.locator('.modimg9 img').count(),0,'Catalog detail must not claim a stock photo is a real trail image');
  await page.locator('[data-close]').first().click();
  await visit('esemenyek');if(future){await page.locator('[data-save-event]').first().click();assert.ok(await page.evaluate(()=>Store.myData().savedEvents.length>0));}
  await visit('helyek');await page.locator('[data-wish]').first().click();assert.ok(await page.evaluate(()=>Store.myData().wishlist.length>0));
  await visit('szervezoknek');assert.equal(await page.locator('.organizer-cta a').first().getAttribute('href'),'#/szervezo');
  // Existing dark mode must retain its readable page tokens as well.
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');
  await layout('dark organizer');
  assert.notEqual(await page.locator('.organizer-steps').evaluate(e=>getComputedStyle(e).color),await page.locator('.organizer-steps').evaluate(e=>getComputedStyle(e).backgroundColor));
  await page.evaluate(()=>document.documentElement.dataset.theme='light');
  assert.equal(await catalog(),original,'No catalog records or route metadata changed');
  assert.deepEqual(errors,[],'Zero page errors');assert.deepEqual(consoleErrors,[],'Zero application console errors');
  console.log(JSON.stringify({status:'PASS',counts,publicRoutes:publicRoutes.length,privateRoutes:privateRoutes.length+1,viewports:[1440,768,390],checks:['filters','event detail/save','place save','organizer CTA/form','mobile menu','tour edit/reload/delete cancellation','GPS start','dark mode','catalog identity'],pageerror:0,consoleError:0}));
}finally{await browser.close();}
