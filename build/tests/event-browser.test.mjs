import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

assert.ok(process.env.TT_PLAYWRIGHT_PATH&&process.env.TT_EDGE_PATH,'Set the installed browser paths');
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
// Isolated local fixtures must not modify production Auth, profiles or snapshots.
await context.route('**/*.supabase.co/**',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
const page=await context.newPage();page.setDefaultTimeout(12000);
await page.clock.setFixedTime(new Date('2026-10-07T12:00:00+03:00'));
await page.addLocatorHandler(page.locator('#v4_later'),async button=>{await button.click();});
const errors=[],consoleErrors=[],checks=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
const base=process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/';
const eventId='egyesko60-2026',link='#/esemenyek/'+eventId;
const visit=async route=>{
  await page.goto(base+'#/'+route,{waitUntil:'networkidle'});
  await page.locator('#view h1').first().waitFor({state:'visible'});
};
const catalog=()=>page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
const checkDetail=async()=>{
  const modal=page.locator('[data-modal]');await modal.waitFor({state:'visible'});
  const text=await modal.innerText();
  assert.match(text,/Egyeskő 60/);assert.match(text,/2026.*9.*2026.*11/s);
  assert.match(text,/59 km/);assert.match(text,/2\s?088 m/);assert.match(text,/Szintidő.*16 óra/s);
  assert.doesNotMatch(text,/Becsült idő|undefined|NaN|DEMO/);
  for(const href of ['https://egyesko60.ro/','https://forms.gle/qMf2z1w3mdaeGo8u5','https://egyesko60.ro/assets/egyesko60-2026.gpx']){
    const a=modal.locator('a').filter({visible:true});
    assert.ok((await a.evaluateAll(links=>links.map(x=>x.getAttribute('href')))).includes(href),'Missing official link '+href);
  }
  const gpx=modal.locator('a[href="https://egyesko60.ro/assets/egyesko60-2026.gpx"]');
  assert.equal(await gpx.getAttribute('target'),'_blank');
  assert.equal(await gpx.getAttribute('download'),null,'Link to the organizer; no republished GPX file');
  assert.equal(await modal.locator('img').count(),0,'No unrelated or copied event photo');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=page.viewportSize().width);
  return modal;
};
try{
  await visit('');const original=await catalog();
  const counts=await page.evaluate(()=>({tours:V122.catalog().tours.length,places:V122.catalog().places.length,
    events:V122.catalog().events.length,routes:v125KnownRoutes().length}));
  assert.deepEqual(counts,{tours:13,places:3,events:9,routes:37});
  assert.equal(await page.locator('#home-events a[href="'+link+'"]').count(),1);
  checks.push('homepage event');
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:844});await visit('esemenyek');
    const card=page.locator('.events-grid article').filter({has:page.locator('h3 a[href="'+link+'"]')});
    assert.equal(await card.count(),1);
    assert.match(await card.innerText(),/2026.*9.*2026.*11/s);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=width);
    await card.locator('h3 a').click();const modal=await checkDetail();
    if(process.env.TT_SCREENSHOT_DIR){
      fs.mkdirSync(process.env.TT_SCREENSHOT_DIR,{recursive:true});
      await page.screenshot({path:path.join(process.env.TT_SCREENSHOT_DIR,'egyesko60-'+width+'.png'),fullPage:false});
    }
    await modal.locator('[data-close]').first().click();
  }
  checks.push('event list and detail','official program/registration/GPX links','390×844');
  await page.evaluate(()=>{
    const r=Store.signup('Eseményteszt','event-ui@test.local','local-event-password','Csíkszereda');
    if(!r.ok)throw Error(r.error);
    Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');
  });
  await visit('felfedezes');await page.locator('[data-f9chip="weekend"]').click();
  await page.locator('[data-f9ev="'+eventId+'"]').click();const discoverModal=await checkDetail();
  await discoverModal.locator('[data-close]').first().click();
  checks.push('weekend discovery and detail');
  await visit('esemenyek/'+eventId);const modal=await checkDetail();
  await modal.locator('#ev-save').click();
  const own=await page.evaluate(id=>Store.myData().tours.find(t=>t.eventRef===id),eventId);
  assert.ok(own);assert.equal(own.lengthKm,59);assert.equal(own.ascent,2088);assert.equal(own.durationH,null);
  assert.equal(own.gpx,null);assert.equal(own.coords,null);
  assert.match(own.notes,/egyesko60\.ro\/assets\/egyesko60-2026\.gpx/);
  await page.reload({waitUntil:'networkidle'});
  assert.deepEqual(await page.evaluate(id=>Store.myData().tours.find(t=>t.id===id),own.id),own);
  checks.push('save to personal calendar/project','reload persistence');
  await visit('felfedezes');await page.locator('[data-f9chip="weekend"]').click();
  await page.locator('[data-f9ev="'+eventId+'"]').click();await checkDetail();
  await page.locator('[data-modal] [data-f9plan="e:'+eventId+'"]').click();
  await page.waitForURL(/#\/tura\//);
  const planned=await page.evaluate(id=>Store.myData().tours.find(t=>t.extRef==='f9:e:'+id),eventId);
  assert.ok(planned);assert.equal(planned.lengthKm,59);assert.equal(planned.ascent,2088);assert.equal(planned.durationH,null);
  checks.push('discover project uses official metrics');
  for(const date of ['2026-10-10','2026-10-11']){
    await page.clock.setFixedTime(new Date(date+'T12:00:00+03:00'));await visit('');
    assert.equal(await page.locator('#home-events a[href="'+link+'"]').count(),1,'Ongoing event stays on homepage');
    await visit('esemenyek');assert.equal(await page.locator('.events-grid h3 a[href="'+link+'"]').count(),1);
  }
  await page.clock.setFixedTime(new Date('2026-10-12T12:00:00+03:00'));await visit('');
  assert.equal(await page.locator('#home-events a[href="'+link+'"]').count(),0,'Expired event is not advertised as upcoming');
  await visit('esemenyek');assert.equal(await page.locator('.events-grid h3 a[href="'+link+'"]').count(),0);
  assert.equal(await catalog(),original,'Existing catalog and 37 GPX/KML routes stay intact');
  assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
  checks.push('multi-day visibility and expiry','catalog preservation');
  console.log(JSON.stringify({status:'PASS',checks,counts,pageerror:0,consoleError:0}));
}finally{await browser.close();}
