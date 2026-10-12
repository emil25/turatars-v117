import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {restored,clone} from './cloud-safety-harness.mjs';
import {fileURLToPath} from 'node:url';
const read=name=>fs.readFileSync(fileURLToPath(new URL('../../app/js/'+name+'.js',import.meta.url)),'utf8');
function app(){
  const values=new Map();const localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v))};
  const c=vm.createContext({localStorage,VIEWS:{},window:{},esc:String,statusChip:()=>'',fmtDateFull:String});
  for(const file of ['data','store','dashboard'])vm.runInContext(read(file),c);
  vm.runInContext("Store.signup('Private owner','owner@test.local','test-only-pass','Csíkszereda'); Store.me().onboarded=true; window.Store=Store;",c);
  return c;
}
test('tour center prioritizes an active track, then future/undated plans, then unlogged completion',()=>{
  const c=app(),s=c.window.Store;
  assert.equal(c.tourCenterFocus().stage,'empty');
  const done=s.newTourFromDraft({title:'Finished',status:'teljesítve',date:s.todayISO()});
  assert.equal(c.tourCenterFocus().stage,'journal');
  const draft=s.newTourFromDraft({title:'Draft',date:''});
  assert.equal(c.tourCenterFocus().tour.id,draft.id);
  const future=s.newTourFromDraft({title:'Next',date:s.addDays(s.todayISO(),2)});
  assert.equal(c.tourCenterFocus().tour.id,future.id);
  draft.liveTrack={status:'paused',points:[]};s.save();
  assert.equal(c.tourCenterFocus().tour.id,draft.id);assert.equal(c.tourCenterFocus().stage,'active');
  draft.liveTrack.status='finished';s.deleteTour(future.id);s.deleteTour(draft.id);
  s.myData().journal.push({id:'own-journal',tourId:done.id});s.save();
  assert.equal(c.tourCenterFocus().stage,'done');
});
test('rendering and linked tasks preserve data and only use the signed-in user slice',()=>{
  const c=app(),s=c.window.Store,t=s.newTourFromDraft({title:'Own private plan',date:''});
  s.myData(); // Existing Store normalizes legacy gear weights on first read.
  const before=s.exportData();const html=c.tourCenterPanel();
  assert.match(html,/Terv folytatása/);assert.match(html,/Túra indítása/);
  assert.match(html,/data-center-tab="felszereles"/);
  assert.equal(s.exportData(),before);
  s.logout();s.signup('Other owner','other@test.local','test-only-pass','');
  assert.equal(c.tourCenterFocus().tour,null);assert.doesNotMatch(c.tourCenterPanel(),/Own private plan/);
  assert.ok(t.id);
});
// Receipt regressions now run through the complete guarded V54 API and real Store.
test('a confirmed snapshot advances expectedVersion; later edits and reload cannot falsely say synced',async()=>{
  const h=await restored();await h.api.api.save(h.snapshot());
  assert.equal(h.api.st().remoteVersion,4);assert.equal(h.remote.writes[0].expected,3);
  assert.equal((await h.api.api.syncStatus()).state,'synced');assert.equal(h.api.settings().cloudReceipt.uid,h.api.st().uid);
  assert.equal((await h.api.api.syncStatus()).state,'synced');
  h.edit();assert.equal((await h.api.api.syncStatus()).state,'pending');
  await h.api.api.save(h.snapshot());assert.equal(h.remote.writes[1].expected,4);
  assert.equal((await h.api.api.syncStatus()).state,'synced');
});
test('failed/conflicting or malformed saves never issue a receipt or change the local snapshot',async()=>{
  for(const response of [{error:'version_conflict'},{ok:false},{ok:true},{ok:true,version:null},{ok:true,version:-1},null]){
    const h=await restored(),before=h.local();h.c.window.__TT_SUPABASE_ADAPTER.save=async()=>response;
    await assert.rejects(h.api.api.save(h.snapshot()));assert.equal(h.api.st().remoteVersion,3);
    assert.equal(h.api.settings().cloudReceipt,undefined);assert.equal(h.local(),before);
    assert.equal((await h.api.api.syncStatus()).state,'pending');
  }
});
test('offline/local vault and another user never report a cloud success',async()=>{
  const h=await restored();await h.api.api.save(h.snapshot());
  h.c.navigator.onLine=false;assert.equal((await h.api.api.syncStatus()).state,'offline');
  h.c.navigator.onLine=true;h.c.window.__TT_SUPABASE_ADAPTER.name='local-vault';assert.equal((await h.api.api.syncStatus()).state,'local');
  h.c.window.__TT_SUPABASE_ADAPTER.name='supabase-snapshot';h.api.st().uid='other-user';assert.equal((await h.api.api.syncStatus()).state,'pending');
});
test('concurrent edits and logout during a save cannot mark new data or a different session as synced',async()=>{
  const h=await restored();let release;h.remote.saveHook=()=>new Promise(r=>release=r);
  const saving=h.api.api.save(h.snapshot());while(!release)await new Promise(r=>setImmediate(r));
  h.edit();release();await saving;assert.equal((await h.api.api.syncStatus()).state,'pending');
  release=null;const second=h.api.api.save(h.snapshot());while(!release)await new Promise(r=>setImmediate(r));
  const receipt=clone(h.api.settings().cloudReceipt);h.api.st().uid='other-user';h.api.st().token='other-session';release();await second;
  assert.equal(h.api.st().remoteVersion,4);assert.deepEqual(clone(h.api.settings().cloudReceipt),receipt);
});
test('missing verification crypto fails closed; logout during verification never starts a write',async()=>{
  const h=await restored();h.c.self.crypto=null;
  await assert.rejects(h.api.api.save(h.snapshot()),e=>e.error==='verification_unavailable');
  assert.equal(h.remote.writes.length,0);assert.equal(h.api.settings().cloudReceipt,undefined);
  const other=await restored();let release;other.remote.loadHook=()=>new Promise(r=>release=r);
  const pending=other.api.api.save(other.snapshot());while(!release)await new Promise(r=>setImmediate(r));
  other.api.st().token=null;release();await assert.rejects(pending);assert.equal(other.remote.writes.length,0);
});
