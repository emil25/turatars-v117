import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

assert.ok(process.env.TT_PLAYWRIGHT_PATH && process.env.TT_EDGE_PATH, 'Set the existing Playwright and browser paths');
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
// All fixtures live only in this isolated browser. Never create an Auth account
// or write a profile, snapshot or community record to the production backend.
await context.route('**/*.supabase.co/**',route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
const page=await context.newPage();
page.setDefaultTimeout(12000);
page.setDefaultNavigationTimeout(15000);
await page.addLocatorHandler(page.locator('#v4_later'),async button=>{await button.click();});
const base=process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/';
const errors=[],consoleErrors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
const visit=async route=>{await page.goto(base+'#/'+route,{waitUntil:'domcontentloaded'});await page.locator('#view h1').first().waitFor({state:'visible'});};
const catalog=()=>page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
const resultIds=()=>page.locator('#f9-list .f9card[data-id]').evaluateAll(cards=>cards.map(c=>c.dataset.id));
const search=async(q,diff,h)=>{
  await visit('');
  await page.locator('#q-hova').fill(q);
  await page.locator('#q-nehezseg').selectOption(diff);
  await page.locator('#q-id').selectOption(h);
  await page.locator('#q-go').click();
  await page.waitForURL(/#\/felfedezes/,{waitUntil:'domcontentloaded'});
  await page.locator('#disc-results,#f9q').first().waitFor({state:'visible'});
};
const layout=async width=>{
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width,'No horizontal overflow at '+width);
  const small=await page.locator('#f9h,#f9-list .btn,[data-w="recs"] .catalog-open').evaluateAll(controls=>
    controls.filter(e=>e.getClientRects().length && e.getBoundingClientRect().height<43.5).map(e=>e.textContent));
  assert.deepEqual(small,[],'Search and recommendation controls must be at least 44px high');
};
try {
  await visit('');
  const original=await catalog();
  const counts=await page.evaluate(()=>({tours:V122.catalog().tours.length,places:V122.catalog().places.length,
    events:V122.catalog().events.length,routes:v125KnownRoutes().length}));
  assert.deepEqual(counts,{tours:13,places:3,events:9,routes:37});
  // The public search and the signed-in search must select the same real hike.
  await search('Gyilkos','Könnyű','3');
  assert.deepEqual(await page.locator('#disc-results h3').allTextContents(),['Gyilkos-tó körül']);
  checks.push('public search');
  await page.evaluate(()=>{
    const result=Store.signup('Catalog UI regression','catalog-ui@test.local','local-only-regression-password','Csíkszereda');
    if(!result.ok)throw Error(result.error);
    Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');
  });
  const privateId=await page.evaluate(()=>Store.newTourFromDraft({title:'Private regression record',place:'Csíkszereda',
    date:Store.addDays(Store.todayISO(),20),lengthKm:7,ascent:200,durationH:2}).id);
  const privateBefore=await page.evaluate(id=>JSON.stringify(Store.getTour(id)),privateId);
  await search('Gyilkos','Könnyű','3');
  assert.equal(await page.locator('#f9q').inputValue(),'Gyilkos');
  assert.equal(await page.locator('#f9diff').inputValue(),'Könnyű');
  assert.equal(await page.locator('#f9h').inputValue(),'3');
  assert.deepEqual(await resultIds(),['vh-around-red-lake']);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#f9h').inputValue(),'3');
  assert.equal(await page.locator('#f9q').inputValue(),'Gyilkos');
  assert.deepEqual(await resultIds(),['vh-around-red-lake']);
  checks.push('signed-in search and reload');
  await page.locator('#f9reg').selectOption('Csomád-hegység');
  assert.equal(await page.locator('#f9reg').inputValue(),'Csomád-hegység');
  await search('Hargita','Könnyű','5');
  assert.equal(await page.locator('#f9reg').inputValue(),'','A fresh home search clears earlier advanced filters');
  assert.deepEqual(await resultIds(),[]);
  assert.match(await page.locator('#f9-list').innerText(),/Nem találtunk ilyen túrát/);
  await page.locator('[data-f9clear]').click();
  assert.equal((await resultIds()).length,13);
  await page.locator('#f9h').selectOption('3');
  const short=await page.evaluate(()=>v122PublicTours().filter(t=>t.h!=null&&t.h<=3).map(t=>t.id));
  assert.deepEqual(await resultIds(),short);
  await search('','','24');
  assert.equal(await page.locator('#f9h').inputValue(),'24','Full-day selection is transferred as well');
  checks.push('honest empty results and time filter');

  await visit('vezerlopult');
  const recs=page.locator('[data-w="recs"] .catalog-tour-card');
  assert.ok(await recs.count()>0);
  const links=await recs.locator('h3 a').evaluateAll(a=>a.map(x=>x.getAttribute('href').split('/').pop()));
  const verified=await page.evaluate(()=>v122PublicTours().map(t=>t.id));
  assert.ok(links.every(id=>verified.includes(id)),'All personal recommendations must exist in the verified catalog');
  assert.equal(await recs.locator('.v122-source').count(),await recs.count(),'Every recommendation shows its source');
  assert.equal(await recs.locator('img,.rate').count(),0,'No unrelated stock photos or fabricated ratings');
  assert.ok(await page.locator('[data-w="recs"]').evaluate(e=>e.getBoundingClientRect().height)<=560,
    'The recommendation widget must retain its compact desktop layout');
  await layout(1440);
  await recs.locator('h3 a').first().click();
  await page.locator('#modal-root [data-modal]').waitFor();
  assert.doesNotMatch(await page.locator('#modal-root').innerText(),/Ilyen túra nem található/);
  await page.locator('#modal-root [data-close]').first().click();
  checks.push('verified recommendation cards and details');

  await visit('uj-tura');
  await page.locator('[data-kind="catalog"]').click();
  const options=await page.locator('#wz-pick option').evaluateAll(o=>o.map(x=>x.value).filter(Boolean));
  assert.deepEqual(options,verified,'The existing tour picker must use the same verified catalog');
  await page.locator('#wz-pick').selectOption('vh-around-red-lake');
  assert.equal(await page.locator('#wz-pick').inputValue(),'vh-around-red-lake');
  assert.match(await page.locator('#view').innerText(),/Gyilkos-tó körül/);
  await page.locator('#wz-date').fill('2026-12-01');
  await page.locator('#wz-go').click();
  await page.waitForURL(/#\/tura\//,{waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  const picked=await page.evaluate(()=>Store.getTour(location.hash.split('/').pop()));
  assert.equal(picked.title,'Gyilkos-tó körül');
  assert.equal(picked.lengthKm,4.2);
  assert.equal(picked.ascent,64);
  assert.equal(picked.durationH,1.5);
  checks.push('existing catalog tour picker and real field save');

  await visit('ai');
  await page.locator('#ai-in').fill('Könnyű, 3 órás családi túra');
  await page.locator('#ai-send').click();
  await page.waitForFunction(()=>!document.querySelector('#tp'));
  const aiId=await page.locator('[data-aims]').last().getAttribute('data-aims');
  assert.ok(verified.includes(aiId),'The text recommendation must use a real catalog ID');
  assert.ok(await page.locator('.ai-card-rec .v122-source').count()>0);
  await page.locator('[data-aims]').last().click();
  await page.waitForURL(/#\/tura\//,{waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>Store.myData().tours.length),3);
  assert.equal(await page.locator('#v120-start').count(),1);
  checks.push('text recommendation and existing Store save');

  await search('Gyilkos','Könnyű','3');
  await page.locator('[data-f9plan="t:vh-around-red-lake"]').click();
  await page.waitForURL(/#\/tura\//,{waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  const planId=await page.evaluate(()=>Store.myData().tours.find(t=>t.extRef==='f9:t:vh-around-red-lake').id);
  const before=await page.evaluate(()=>JSON.stringify(Store.myData().tours));
  await visit('felfedezes');
  assert.equal(await page.locator('[data-f9open]').getAttribute('data-f9open'),planId);
  assert.doesNotMatch(await page.locator('#view').innerText(),/\[object Object\]/);
  await page.locator('[data-f9open]').click();
  await page.waitForURL(new RegExp('#/tura/'+planId+'$'),{waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  assert.equal(await page.locator('#v120-start').count(),1);
  assert.equal(await page.evaluate(()=>JSON.stringify(Store.myData().tours)),before,'Opening a saved plan must not create or alter a record');
  await visit('felfedezes');
  await page.locator('[data-f9tour="vh-around-red-lake"]').click();
  assert.equal(await page.locator('#modal-root [data-f9open]').getAttribute('data-f9open'),planId);
  await page.locator('#modal-root [data-f9open]').click();
  await page.waitForURL(new RegExp('#/tura/'+planId+'$'),{waitUntil:'domcontentloaded'});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>JSON.stringify(Store.myData().tours)),before);
  checks.push('saved plan ID, detail button, no duplicates and reload');

  await page.setViewportSize({width:390,height:844});
  await search('Gyilkos','Könnyű','3');
  await layout(390);
  await page.locator('[data-f9open]').click();
  await page.waitForURL(new RegExp('#/tura/'+planId+'$'),{waitUntil:'domcontentloaded'});
  await page.locator('#v120-start').waitFor({state:'visible'});
  await layout(390);
  await visit('vezerlopult');
  await layout(390);
  checks.push('390x844 mobile controls');
  assert.equal(await catalog(),original,'All catalog records and all 37 GPX/KML sources must remain byte-for-byte unchanged');
  assert.equal(await page.evaluate(id=>JSON.stringify(Store.getTour(id)),privateId),privateBefore,'Existing private data must remain unchanged');
  const shotDir=process.env.TT_SCREENSHOT_DIR;
  if(shotDir){
    fs.mkdirSync(shotDir,{recursive:true});
    await page.screenshot({path:path.join(shotDir,'recommendations-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1440,height:1000});
    await visit('felfedezes');
    await page.screenshot({path:path.join(shotDir,'search-desktop.png'),fullPage:false});
  }
  assert.deepEqual(errors,[],'Zero page errors');
  assert.deepEqual(consoleErrors,[],'Zero application console errors');
  console.log(JSON.stringify({status:'PASS',counts,checks,viewports:[1440,390],pageerror:0,consoleError:0}));
} catch(error) {
  console.log(JSON.stringify({completed:checks,url:page.url(),errors,visible:(await page.locator('#view').innerText()).slice(0,1600)}));
  throw error;
} finally {await browser.close();}
