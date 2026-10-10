import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser=await chromium.launch({headless:true,executablePath:process.env.TT_EDGE_PATH});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.route('**/*.supabase.co/**',r=>['GET','HEAD'].includes(r.request().method())?r.continue():r.abort());
const page=await context.newPage(),errors=[],consoleErrors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(m.text()))consoleErrors.push(m.text());});
await page.addLocatorHandler(page.locator('#v4_later'),async b=>b.click());
const base=new URL(process.env.TT_PREVIEW_URL||'http://127.0.0.1:4175/');base.searchParams.set('design','atlas');base.hash='';
const visit=async route=>{const before=await page.locator('#view').count()?await page.locator('#view').innerHTML():null;await page.goto(base.href+'#/'+route,{waitUntil:'domcontentloaded'});await page.waitForFunction(before=>{const e=document.querySelector('#view');return e&&e.innerText.length>20&&(before===null||e.innerHTML!==before);},before);};
const data=()=>page.evaluate(()=>JSON.stringify({catalog:V122.catalog(),routes:v125KnownRoutes()}));
const layout=async name=>{
  const result=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,short:[...document.querySelectorAll('#appearance-tools button,#view .btn,#view .icon-btn')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height<43.5).map(e=>e.textContent)}));
  assert.ok(result.scroll<=result.width,name+': '+JSON.stringify(result));assert.deepEqual(result.short,[],name+': minimum control height');
};
const shot=async name=>{if(process.env.TT_SCREENSHOT_DIR){fs.mkdirSync(process.env.TT_SCREENSHOT_DIR,{recursive:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.TT_SCREENSHOT_DIR,'atlas-'+name+'.png'),fullPage:true});}};
try{
  await visit('');const original=await data();
  assert.equal(await page.evaluate(()=>TTDesign.current()),'atlas');
  assert.equal(await page.evaluate(()=>localStorage.getItem('turatars_appearance_v1')),null,'Preview link alone does not persist a preference');
  assert.match(await page.locator('h1').first().evaluate(e=>getComputedStyle(e).fontFamily),/system-ui/);
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:844});
    for(const route of ['','felfedezes','esemenyek','helyek','szervezoknek','tervezes','kozossegi','belepes','regisztracio','hasznalat']){await visit(route);await layout(route);if(['','esemenyek','szervezoknek'].includes(route))await shot((route||'home')+'-'+width);}
  }
  await page.evaluate(()=>{Store.signup('Atlas ellenőrzés','atlas@local.test','local-test-only-password','Csíkszereda');Store.me().onboarded=true;Store.save();sessionStorage.setItem('tv-prompted','1');});
  const id=await page.evaluate(()=>Store.newTourFromDraft({title:'Saját túra változatlan',place:'Csíkszereda',lengthKm:7,ascent:200,durationH:2,date:Store.addDays(Store.todayISO(),10)}).id);
  const before=await page.evaluate(()=>Store.exportData());
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:844});
    for(const route of ['vezerlopult','turaim','uj-tura','naptar','bakancslista','felszereles','naplo','statisztikak','terkep','beallitasok','profil','utvonalak','csapatok','szervezo','tarsak','inbox','hagymas','terepi','sablonok','szatt','csapat','ai','tura/'+id]){await visit(route);await layout(route);if([1440,390].includes(width)&&['vezerlopult','turaim','tura/'+id].includes(route))await shot(route.replace('/','-')+'-'+width);}
  }
  await visit('vezerlopult');
  await page.locator('[data-appearance-menu]').click();
  assert.equal(await page.locator('.atlas-route-menu a').count(),24,'All existing navigation entries remain available on mobile');
  await page.locator('.atlas-route-menu a[href="#/felszereles"]').click();
  await page.waitForURL(/#\/felszereles/);await page.locator('#view h1').waitFor();
  assert.equal(await page.locator('.atlas-route-menu').count(),0,'Navigation closes its dialog');
  await visit('vezerlopult');
  const contrast=await page.locator('.chall-card b').first().evaluate(e=>getComputedStyle(e).color);
  assert.notEqual(contrast,'rgb(255, 255, 255)','Challenge label remains readable on the light Atlas panel');
  await visit('turaim');await page.locator('[data-edit="'+id+'"]').click();await page.locator('#et-title').fill('Atlas alatt szerkesztett túra');await page.locator('#et-save').click();
  assert.equal(await page.evaluate(id=>Store.getTour(id).title,id),'Atlas alatt szerkesztett túra');
  await page.reload();await page.locator('[data-tour-id="'+id+'"]').waitFor();assert.match(await page.locator('[data-tour-id="'+id+'"]').innerText(),/Atlas alatt szerkesztett túra/);
  await visit('tura/'+id);await page.locator('#v120-start').waitFor();assert.equal(await page.locator('#v120-start').count(),1);
  const state=await page.evaluate(()=>Store.exportData());
  await page.locator('[data-appearance-toggle]').click();await page.locator('[data-appearance="classic"]').click();
  assert.equal(await page.evaluate(()=>TTDesign.current()),'classic');assert.equal(await page.evaluate(()=>Store.exportData()),state,'Switch does not write user data');
  assert.doesNotMatch(await page.locator('#view h1').first().evaluate(e=>getComputedStyle(e).fontFamily),/system-ui/);
  await page.reload();await page.locator('#v120-start').waitFor();assert.equal(await page.evaluate(()=>TTDesign.current()),'classic');
  await page.locator('[data-appearance-toggle]').click();await page.locator('[data-appearance="atlas"]').click();assert.equal(await page.evaluate(()=>Store.exportData()),state);
  // A new URL without an override uses the saved device preference.
  const noOverride=new URL(base);noOverride.searchParams.delete('design');noOverride.hash='/tura/'+id;
  await page.goto(noOverride.href);await page.locator('#v120-start').waitFor();assert.equal(await page.evaluate(()=>TTDesign.current()),'atlas');
  await page.evaluate(()=>document.documentElement.dataset.theme='dark');await layout('dark workspace');await shot('dark-workspace');
  assert.equal(await data(),original,'13 tours / 3 places / 9 events / 37 tracks retain their complete data');
  assert.equal(await page.evaluate(id=>Store.getTour(id).place,id),'Csíkszereda');
  assert.ok(before.includes('Saját túra változatlan'));
  assert.deepEqual(errors,[]);assert.deepEqual(consoleErrors,[]);
  // Default and denied-storage environments must still start in classic.
  const fresh=await browser.newContext({viewport:{width:390,height:844}});const p=await fresh.newPage();
  await p.addInitScript(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='turatars_appearance_v1')throw Error('Unavailable');return set.call(this,k,v);};});
  await p.goto(noOverride.href.split('#')[0]+'#/');await p.locator('#appearance-tools').waitFor();assert.equal(await p.evaluate(()=>TTDesign.current()),'classic');
  await p.locator('[data-appearance-toggle]').click();await p.locator('[data-appearance="atlas"]').click();assert.equal(await p.evaluate(()=>TTDesign.current()),'atlas');await fresh.close();
  console.log(JSON.stringify({status:'PASS',designs:['classic','atlas'],viewports:[1440,768,390],checks:['whole-site routes','owner tour edit/reload','GPS control retained','reversible switch','preference persists','preview does not persist','storage unavailable','complete catalog unchanged','dark mode'],pageerror:0,consoleError:0}));
}finally{await browser.close();}
