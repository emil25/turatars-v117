import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

assert.ok(process.env.TT_PLAYWRIGHT_PATH && process.env.TT_EDGE_PATH, 'Set the existing browser paths');
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
// Fixtures are isolated local users; no Auth, profile, snapshot or community writes.
await context.route('**/*.supabase.co/**',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
const page=await context.newPage();
page.setDefaultTimeout(12000);
await page.addLocatorHandler(page.locator('#v4_later'),async button=>{await button.click();});
const errors=[],consoleErrors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
const base=process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/';
const visit=async route=>{
  await page.goto(base+'#/'+route,{waitUntil:'networkidle'});
  await page.locator('#view h1').first().waitFor({state:'visible'});
};
const catalog=()=>page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
const headerAfterScroll=async()=>{
  await page.evaluate(()=>window.scrollTo({top:500,behavior:'instant'}));
  await page.waitForFunction(()=>scrollY>300);
  const header=await page.locator('#site-header').boundingBox();
  assert.ok(header&&Math.abs(header.y)<1&&header.height>=44,'Header must stay visible at the viewport top after scrolling');
  assert.ok(await page.locator('#site-header .logo[href="#/"]').isVisible(),'Home navigation remains available');
};
const back=()=>page.locator('#view .discover-back');
const checkBack=async()=>{
  assert.equal(await back().getAttribute('href'),'#/');
  assert.match(await back().innerText(),/Vissza a főoldalra/);
  assert.ok((await back().boundingBox()).height>=44,'Back link must be touch accessible');
  await back().click();
  await page.waitForURL(/#\/$/);
  await page.locator('.home-redesign').waitFor({state:'visible'});
};
try {
  await visit('');const original=await catalog();
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:844});
    for(const route of ['','felfedezes','esemenyek','helyek','szervezoknek']) {
      await visit(route);await headerAfterScroll();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width,'No horizontal page overflow');
    }
    await visit('felfedezes');await checkBack();
    if(width===390) {
      await visit('felfedezes');await headerAfterScroll();
      await page.locator('.pub-menu summary').click();
      await page.locator('.pub-menu-links a[href="#/"]').click();
      await page.waitForURL(/#\/$/);
      await page.locator('.home-redesign').waitFor({state:'visible'});
    }
  }
  checks.push('visitor sticky header','visitor back link','mobile menu after scrolling');
  await page.evaluate(()=>{
    const r=Store.signup('Túrázó','navigation-ui@test.local','local-navigation-password','Csíkszereda');
    if(!r.ok)throw Error(r.error);
    Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');
  });
  for(const width of [1440,390]) {
    await page.setViewportSize({width,height:844});
    await visit('vezerlopult');
    assert.equal(await page.locator('#site-header').isVisible(),false,'Dashboard retains its own navigation');
    await page.locator('#view a[href="#/felfedezes"]').filter({visible:true}).first().click();
    await page.waitForURL(/#\/felfedezes/);
    await page.locator('.f9page').waitFor({state:'visible'});
    await headerAfterScroll();await checkBack();
    await visit('felfedezes');
    await page.locator('#f9diff').selectOption('Könnyű');
    assert.ok(await back().isVisible(),'Back link survives filter re-render');
    await page.locator('#f9sort').selectOption('km');
    await headerAfterScroll();await checkBack();
    await visit('felfedezes');await page.reload({waitUntil:'networkidle'});
    await page.locator('.f9page').waitFor({state:'visible'});
    await headerAfterScroll();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width,'Signed-in discover has no overflow');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>scrollY===0);
    if(process.env.TT_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.TT_SCREENSHOT_DIR,{recursive:true});
      await page.screenshot({path:path.join(process.env.TT_SCREENSHOT_DIR,'discover-'+width+'.png'),fullPage:false});
    }
    await checkBack();
  }
  checks.push('dashboard to discover','signed-in filter and sort re-render','direct route and reload','signed-in back link');
  assert.equal(await catalog(),original,'All catalog data and route metadata remain unchanged');
  assert.deepEqual(errors,[],'No page errors');assert.deepEqual(consoleErrors,[],'No application console errors');
  console.log(JSON.stringify({status:'PASS',viewports:[1440,390],checks,pageerror:0,consoleError:0}));
} finally {await browser.close();}
