import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
// Test-only local user and adapter responses. No production account/data writes.
await context.route('**/*.supabase.co/**',r=>r.abort());
const page=await context.newPage();page.setDefaultTimeout(12000);
await page.addLocatorHandler(page.locator('#v4_later'),async b=>b.click());
const errors=[],consoleErrors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
const base=process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/';
const visit=async route=>{const target=base+'#/'+route;if(page.url()===target)await page.reload({waitUntil:'domcontentloaded'});else await page.goto(target,{waitUntil:'domcontentloaded'});await page.locator('#view h1').first().waitFor();};
const layout=async()=>{
  const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,
    small:[...document.querySelectorAll('.tour-center-focus .btn,.tour-center-journey a,.tour-center-tasks a')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<43.5).map(e=>e.textContent)}));
  assert.ok(result.scroll<=result.width,JSON.stringify(result));assert.deepEqual(result.small,[]);
};
const shot=async name=>{if(process.env.TT_SCREENSHOT_DIR){fs.mkdirSync(process.env.TT_SCREENSHOT_DIR,{recursive:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.TT_SCREENSHOT_DIR,name+'.png'),fullPage:false});}};
try{
  await visit('');
  const original=await page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
  await page.evaluate(()=>{Store.signup('Túraközpont ellenőrzés','tour-center@test.local','test-only-password','Csíkszereda');Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');});
  await visit('vezerlopult');
  await page.locator('#tour-center-focus[data-stage="empty"]').waitFor();
  assert.equal(await page.locator('#tour-center-focus a[href="#/uj-tura"]').count(),1);
  await layout();
  const id=await page.evaluate(()=>Store.newTourFromDraft({title:'Saját túrám előkészítése',place:'Csíkszereda',date:Store.addDays(Store.todayISO(),2),lengthKm:7,ascent:200,durationH:2}).id);
  await visit('vezerlopult');await page.locator('#tour-center-focus[data-stage="plan"]').waitFor();
  assert.match(await page.locator('#tour-center-focus').innerText(),/Saját túrám előkészítése/);
  assert.ok(await page.locator('.tour-center-tasks a').count()>0);
  await page.locator('#tour-center-focus [data-center-tab="felszereles"]').first().click();
  await page.waitForURL(new RegExp('#/tura/'+id));
  await page.locator('[data-wstab="felszereles"].on').waitFor();
  await page.locator('.v129-project [data-center-tab="resztvevok"]').click();
  await page.locator('[data-wstab="resztvevok"].on').waitFor();
  await page.locator('.v129-project [data-center-tab="utvonal"]').click();
  await page.locator('#gpx-in').waitFor({state:'attached'});
  await page.locator('.v129-project [data-center-tab="attekintes"]').click();
  await page.locator('#v129-pack-add').waitFor();
  await layout();await shot('project-390');
  const originalNotes=await page.evaluate(id=>Store.getTour(id).notes,id);
  await page.locator('#v129-cloud-save').click();
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='local');
  assert.equal(await page.evaluate(id=>Store.getTour(id).notes,id),originalNotes);
  assert.doesNotMatch(await page.locator('#v129-cloud-status').innerText(),/Felhőbe mentve/);

  // Drive the real save wrapper with controlled *test-only* backend responses.
  await page.evaluate(()=>{
    const s=window.__V54.st();s.uid=Store.me().id;s.token='test-session';s.email=Store.me().email;s.provider='supabase-snapshot';s.remoteVersion=0;
    window.__testSaves=[];
    window.__TT_SUPABASE_ADAPTER.save=async(token,snap,expected)=>{
      window.__testSaves.push({expected,snapshot:JSON.parse(JSON.stringify(snap))});
      if(window.__testSaveFailure)throw {error:window.__testSaveFailure};
      if(window.__testSaveWait)await new Promise(r=>window.__finishTestSave=r);
      return {ok:true,version:expected+1};
    };
  });
  await page.locator('#v129-cloud-save').click();
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='synced');
  assert.equal(await page.evaluate(()=>__V54.st().remoteVersion),1);
  await page.locator('#v129-start-time').fill('08:30');await page.locator('#v129-meta-save').click();
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='pending');
  await page.locator('#v129-cloud-save').click();
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='synced');
  assert.deepEqual(await page.evaluate(()=>__testSaves.map(x=>x.expected)),[0,1]);
  await page.evaluate(()=>{window.__testSaveFailure='version_conflict';Store.getTour(Store.myData().tours[0].id).notes='A felhőhiba mellett is megmaradó jegyzet';Store.save();});
  await page.locator('#v129-cloud-save').click();
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='pending');
  assert.equal(await page.evaluate(()=>__V54.st().remoteVersion),2);
  assert.equal(await page.evaluate(id=>Store.getTour(id).notes,id),'A felhőhiba mellett is megmaradó jegyzet');
  await context.setOffline(true);
  await page.waitForFunction(()=>document.querySelector('#v129-cloud-status')?.dataset.syncState==='offline');
  await page.locator('#v129-cloud-save').click();
  assert.equal(await page.evaluate(()=>__testSaves.length),3,'Offline must not start another request');
  await context.setOffline(false);
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('#v129-meta-save').waitFor();
  assert.equal(await page.locator('#v129-start-time').inputValue(),'08:30');
  assert.equal(await page.evaluate(id=>Store.getTour(id).notes,id),'A felhőhiba mellett is megmaradó jegyzet');
  await visit('vezerlopult');
  for(const width of [1440,1280,390]){await page.setViewportSize({width,height:844});await layout();if(width>=1280){const height=await page.locator('[data-w="hub"]').evaluate(e=>e.getBoundingClientRect().height);assert.ok(height<=560,'Dashboard focus must remain compact: '+height+' px at '+width);}await shot('dashboard-'+width);}
  await page.evaluate(id=>{const t=Store.getTour(id);t.liveTrack={status:'paused',points:[],distanceM:0};Store.save();},id);
  await visit('vezerlopult');await page.locator('#tour-center-focus[data-stage="active"]').waitFor();
  assert.equal(await page.locator('#tour-center-focus a[href="#/tura-live/'+id+'"]').count(),2);
  await page.evaluate(id=>{const t=Store.getTour(id);t.liveTrack.status='finished';t.status='teljesítve';t.doneAt=Store.todayISO();t.projectStatus='TELJESÍTVE';Store.save();},id);
  await visit('vezerlopult');await page.locator('#tour-center-focus[data-stage="journal"]').waitFor();
  await page.locator('#tour-center-focus .tour-center-actions [data-center-tab="naplo"]').click();
  await page.locator('[data-wstab="naplo"].on').waitFor();
  await page.locator('#v129-meta-save').waitFor();
  await layout();
  assert.equal(await page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()})),original);
  assert.deepEqual(errors,[],'Zero page errors');assert.deepEqual(consoleErrors,[],'Zero application console errors');
  console.log(JSON.stringify({status:'PASS',checks:['empty/future/active/completed focus','direct workspace tabs','GPS entry preserved','native GPX input preserved','cloud receipt/edit/conflict/offline/reload','mobile 390x844','catalog preservation'],pageerror:0,consoleError:0}));
}finally{await browser.close();}
