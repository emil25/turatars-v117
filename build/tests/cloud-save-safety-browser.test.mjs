import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
try{
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
  await context.route('**/*.supabase.co/**',r=>r.abort());
  const page=await context.newPage();page.setDefaultTimeout(12000);
  const errors=[],consoleErrors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
  page.on('dialog',d=>d.accept());
  await page.addLocatorHandler(page.locator('#v4_later'),b=>b.click());
  await page.goto((process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/')+'?design=atlas#/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__V54&&window.Store);
  await page.evaluate(()=>{
    Store.signup('Safety owner','safety@test.invalid','isolated-test-password','Csíkszereda');Store.me().onboarded=true;Store.save();
    Store.newTourFromDraft({title:'Local plan',lengthKm:8});
    const snap=JSON.parse(JSON.stringify(__V54.build(Store.me().email)));snap.data.tours[0].title='Remote plan';
    window.auditRemote={snap,version:7};sessionStorage.setItem('tv-prompted','1');
    Object.assign(__V54.st(),{uid:Store.me().id,token:'isolated-session',email:Store.me().email,provider:'supabase-snapshot',remoteVersion:7});
    location.hash='#/profil';
  });
  await page.locator('#c54-save').waitFor();
  const install=async remote=>page.evaluate(remote=>{
    if(remote)window.auditRemote=remote;
    window.auditLoads=0;window.auditWrites=[];
    Object.assign(__V54.st(),{uid:Store.me().id,token:'isolated-session',email:Store.me().email,provider:'supabase-snapshot',remoteVersion:7});
    __TT_SUPABASE_ADAPTER.load=async()=>{auditLoads++;return JSON.parse(JSON.stringify(auditRemote));};
    __TT_SUPABASE_ADAPTER.save=async(token,snap,expected)=>{
      auditWrites.push({expected,snap:JSON.parse(JSON.stringify(snap))});
      if(expected!==auditRemote.version)throw {error:'version_conflict'};
      auditRemote={snap:JSON.parse(JSON.stringify(snap)),version:expected+1};return {ok:true,version:expected+1};
    };
  },remote);
  await install(null);
  const cloudBefore=await page.evaluate(()=>JSON.stringify(auditRemote));
  for(let attempt=1;attempt<=2;attempt++){
    await page.locator('#c54-save').click();
    await page.waitForFunction(n=>auditLoads===n&&__V54.st().saveSafety==='restore_required',attempt);
  }
  assert.equal(await page.evaluate(()=>auditWrites.length),0);
  assert.equal(await page.evaluate(()=>JSON.stringify(auditRemote)),cloudBefore);
  const localBefore=await page.evaluate(()=>Store.exportData());
  await page.evaluate(()=>{
    window.auditNativeSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){if(k==='turatars_v54_pre1')throw new Error('Injected backup failure');return auditNativeSet.call(this,k,v);};
  });
  await page.locator('#c54-load').click();await page.waitForFunction(()=>__V54.st().saveSafety==='error');
  await page.locator('#c54-save').click();await page.waitForFunction(()=>__V54.st().saveSafety==='restore_required');
  assert.equal(await page.evaluate(()=>auditWrites.length),0);assert.equal(await page.evaluate(()=>Store.exportData()),localBefore);
  await page.evaluate(()=>Storage.prototype.setItem=auditNativeSet);
  await page.locator('#c54-load').click();await page.waitForFunction(()=>__V54.st().saveSafety==='ready');
  assert.equal(await page.evaluate(()=>Store.myData().tours[0].title),'Remote plan');
  await page.evaluate(()=>Store.updateTour(Store.myData().tours[0].id,{notes:'Verified browser edit'}));
  await page.locator('#c54-save').click();await page.waitForFunction(()=>auditWrites.length===1&&__V54.st().status==='saved');
  assert.equal(await page.evaluate(()=>auditWrites[0].expected),7);
  assert.equal(await page.evaluate(()=>auditRemote.snap.data.tours[0].notes),'Verified browser edit');
  const remote=await page.evaluate(()=>auditRemote);
  await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__V54&&window.Store);
  await page.locator('#c54-back').waitFor();await install(remote);
  // Public API callers have the same guard; a persisted version is not permission.
  const blocked=await page.evaluate(async()=>{try{await __V54.api.save(__V54.build(Store.me().email));return false;}catch(e){return e.error==='restore_required';}});
  assert.equal(blocked,true);assert.equal(await page.evaluate(()=>auditWrites.length),0);
  assert.equal(await page.evaluate(()=>Store.myData().tours[0].notes),'Verified browser edit');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390));
  assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
  console.log(JSON.stringify({status:'PASS',checks:['actual profile save/restore buttons','second-click protection','failed backup','verified restore/edit/save','reload public API guard','Atlas 390x844'],realCloudWrites:0,pageerror:0,consoleError:0}));
}finally{await browser.close();}
