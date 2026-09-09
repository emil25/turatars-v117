/* V117.1 critical gates: real Store, fault-injected storage, strict mobile widths. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({executablePath:'/opt/playwright-browsers/chromium-1209/chrome-linux64/chrome'});
  try {
    const ctx = await browser.newContext({viewport:{width:390,height:844}});
    const page = await ctx.newPage(); const errors=[], consoles=[];
    page.on('pageerror', e=>errors.push(String(e)));
    page.on('console', m=>{if(m.type()==='error')consoles.push(m.text());});
    await page.goto('https://cq78ba4p.qwenwork.page/', {waitUntil:'networkidle'});
    const safety = await page.evaluate(() => {
      const checks=[]; const check=(name,pass,detail)=>checks.push({name,pass:!!pass,detail});
      const clone=x=>JSON.parse(JSON.stringify(x));
      Store.signup('Safety V117.1','safety1171@example.invalid','safetyPass123','Audit');
      Store.me().onboarded=true; Store.me().bio='Saved biography';
      const tour=Store.newTourFromDraft({title:'ORIGINAL',date:'2026-12-20',place:'Audit',lengthKm:10,ascent:500});
      const d=Store.myData();
      d.reportAck={localReport:'2026-09-08'};
      d.challenges=[{id:'localChallenge',name:'Local challenge',extra:'keep',items:[{l:'Local goal',done:true}]}];
      d.futureField={localOnly:'keep',nested:{local:'keep'}};
      d.localOnlyField=['preserved']; Store.save();
      const v=window.__V54; v.st().email=Store.me().email;
      v.setSettings({offers:{[Store.me().email]:Date.now()}});
      const initial=Store.exportData();
      const env={at:'2026-09-08T12:00:00Z',snap:clone(v.build(Store.me().email))};
      env.snap.data.tours[0].title='RESTORED';
      env.snap.data.reportAck={remoteReport:'2026-09-09'};
      env.snap.data.challenges=[{id:'remoteChallenge',name:'Remote challenge',items:[]}];
      env.snap.data.futureField={remoteOnly:'new',nested:{remote:'new'}};
      delete env.snap.data.localOnlyField;
      const snapBefore=JSON.stringify(env);
      let r=v.api.restoreApply(env);
      const restoredData=JSON.parse(Store.exportData()).data[Store.me().id];
      check('restore succeeds',r.ok,r);
      check('reportAck retains both maps',restoredData.reportAck.localReport==='2026-09-08'&&restoredData.reportAck.remoteReport==='2026-09-09');
      check('challenges retain local progress and remote record',restoredData.challenges.length===2&&restoredData.challenges[0].items[0].done&&restoredData.challenges[1].id==='remoteChallenge');
      check('unknown Store fields survive',restoredData.localOnlyField[0]==='preserved'&&restoredData.futureField.localOnly==='keep'&&restoredData.futureField.nested.local==='keep'&&restoredData.futureField.nested.remote==='new');
      check('snapshot input immutable',JSON.stringify(env)===snapBefore);
      const once=Store.exportData(),backup=localStorage.getItem('turatars_v54_pre1');
      r=v.api.restoreApply(env);
      check('2x restore: same complete DB and original undo point',r.ok&&Store.exportData()===once&&localStorage.getItem('turatars_v54_pre1')===backup);
      check('restore disk and memory agree',Store.exportData()===localStorage.getItem('turavaros_v1'));
      check('rollback restores disk AND memory',v.api.rollback()&&Store.exportData()===initial&&localStorage.getItem('turavaros_v1')===initial);
      check('2x rollback idempotent',v.api.rollback()&&Store.exportData()===initial);
      const nativeSet=Storage.prototype.setItem;
      const unchanged=()=>Store.exportData()===initial&&localStorage.getItem('turavaros_v1')===initial;
      try {
        Storage.prototype.setItem=function(k,value){if(k==='turatars_v54_pre1')throw new DOMException('Injected quota failure','QuotaExceededError');return nativeSet.call(this,k,value);};
        r=v.api.restoreApply(env);check('failed pre-restore write blocks restore',!r.ok&&r.err==='pre_restore_failed'&&unchanged(),r);
        nativeSet.call(localStorage,'turatars_v54_pre1',JSON.stringify({ts:'2000-01-01',db:JSON.parse(initial)}));
        Storage.prototype.setItem=function(k,value){if(k==='turatars_v54_pre1')return;return nativeSet.call(this,k,value);};
        r=v.api.restoreApply(env);check('silent failed backup cannot reuse old pre1',!r.ok&&unchanged(),r);
        Storage.prototype.setItem=function(k,value){if(k==='turavaros_v1')throw new DOMException('Injected commit failure','QuotaExceededError');return nativeSet.call(this,k,value);};
        const oldBackup=localStorage.getItem('turatars_v54_pre1');
        r=v.api.restoreApply(env);check('failed final write leaves memory, disk and undo unchanged',!r.ok&&unchanged()&&localStorage.getItem('turatars_v54_pre1')===oldBackup,r);
      } finally {Storage.prototype.setItem=nativeSet;}
      const invalid=clone(env);invalid.snap.schema='invalid';r=v.api.restoreApply(invalid);
      check('bad schema preserves original DB',!r.ok&&unchanged());
      invalid.snap.schema='v54.1';invalid.snap.linkedEmail='other@example.invalid';r=v.api.restoreApply(invalid);
      check('cross-user restore refused',!r.ok&&unchanged());
      r=v.api.restoreApply(env);const rollbackBefore=Store.exportData();
      try{Storage.prototype.setItem=function(k,value){if(k==='turavaros_v1')throw new DOMException('Injected rollback failure','QuotaExceededError');return nativeSet.call(this,k,value);};
        check('failed rollback leaves both states intact',!v.api.rollback()&&Store.exportData()===rollbackBefore&&localStorage.getItem('turavaros_v1')===rollbackBefore);
      }finally{Storage.prototype.setItem=nativeSet;}
      check('rollback recovers after write failure',v.api.rollback()&&Store.exportData()===initial);
      check('local vault remains active',v.activeName()==='local-vault'&&!v.isRemote());
      return {checks,tourId:tour.id};
    });
    // Exercise the actual rollback button as well as the API.
    await page.evaluate(()=>{location.hash='#/profil';}); await page.waitForTimeout(700);
    const ui=await page.evaluate(()=>{const v=window.__V54;const expected=Store.exportData();v.api.preSave();Store.myData().tours[0].title='CHANGED BEFORE UI ROLLBACK';Store.save();document.getElementById('c54-back').click();return {expected,actual:Store.exportData(),disk:localStorage.getItem('turavaros_v1')};});
    assert.equal(ui.actual,ui.expected,'UI rollback memory');assert.equal(ui.disk,ui.expected,'UI rollback disk');
    const routeSource=fs.readFileSync(path.join(__dirname,'v51crawl.js'),'utf8');
    const routes=[...new Set([...routeSource.match(/^const ROUTES = \[(.*)\];$/m)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]))];
    routes.push('#/tura/'+safety.tourId,'#/turamod/'+safety.tourId);
    const mobile=[];
    for(const route of routes){await page.evaluate(h=>{location.hash=h;},route);await page.waitForTimeout(650);await page.evaluate(()=>document.fonts.ready);mobile.push(await page.evaluate(()=>({route:location.hash,width:innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)})));}
    await page.setViewportSize({width:1280,height:900});await page.waitForTimeout(300);
    const desktop=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,columns:getComputedStyle(document.querySelector('.tm2-grid')).gridTemplateColumns}));
    console.log(JSON.stringify({safety:safety.checks,mobile,desktop,pageerrors:errors,consoleErrors:consoles},null,2));
    for(const c of safety.checks)assert.ok(c.pass,c.name+' '+JSON.stringify(c.detail));
    for(const m of mobile)assert.ok(m.scrollWidth<=390,'Mobile overflow '+JSON.stringify(m));
    assert.ok(desktop.scrollWidth<=1280,'Desktop overflow');
    assert.equal(errors.length,0,'pageerrors');assert.equal(consoles.length,0,'own console errors');
    console.log('V117.1 SAFETY + MOBILE: PASS');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
