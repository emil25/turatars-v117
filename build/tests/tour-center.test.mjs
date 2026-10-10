import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
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
function cloud(){
  const snap={ts:'generated',user:{id:'u-own'},data:{tours:[{id:'t-own',notes:'first'}],routes:[{id:'r-own'}]}};
  const settings={};const calls=[];
  const c=vm.createContext({TextEncoder,Uint8Array,self:{crypto:webcrypto},window:{},navigator:{onLine:true},
    sess:{uid:'u-own',token:'session',email:'owner@test.local',remoteVersion:3,status:'ready'},
    settings:()=>settings,setSettings:s=>Object.assign(settings,s),sset_:()=>{},
    curLocalEmail:()=> 'owner@test.local',buildSnapshot:()=>JSON.parse(JSON.stringify(snap)),
    isRemote:()=>c.provider.name!=='local-vault',getActive:()=>c.provider,console});
  c.provider={name:'supabase-snapshot',save:async(token,payload,expected)=>{calls.push({token,payload,expected});return {ok:true,version:expected+1};}};
  const source=read('v54');
  vm.runInContext(source.slice(source.indexOf('function hex('),source.indexOf('function pbkdf2(')),c);
  vm.runInContext(source.slice(source.indexOf('function snapshotDigest('),source.indexOf('function loadCloudProfile(')),c);
  return {c,snap,settings,calls};
}
test('a confirmed snapshot advances expectedVersion; later edits and reload cannot falsely say synced',async()=>{
  const {c,snap,settings,calls}=cloud();
  await c.saveSnapshot(snap);assert.equal(c.sess.remoteVersion,4);assert.equal(calls[0].expected,3);
  assert.equal((await c.cloudStatus()).state,'synced');assert.equal(settings.cloudReceipt.uid,'u-own');
  snap.ts='different generated time';assert.equal((await c.cloudStatus()).state,'synced');
  snap.data.tours[0].notes='edited after saving';assert.equal((await c.cloudStatus()).state,'pending');
  const reloaded=cloud();Object.assign(reloaded.settings,JSON.parse(JSON.stringify(settings)));Object.assign(reloaded.snap,JSON.parse(JSON.stringify(snap)));
  assert.equal((await reloaded.c.cloudStatus()).state,'pending');
  await c.saveSnapshot(snap);assert.equal(calls[1].expected,4);assert.equal((await c.cloudStatus()).state,'synced');
});
test('failed/conflicting or malformed saves never issue a receipt or change the local snapshot',async()=>{
  for(const response of [{error:'version_conflict'},{ok:false},{ok:true},{ok:true,version:null},{ok:true,version:-1},null]){
    const {c,snap,settings}=cloud(),before=JSON.stringify(snap);
    c.provider.save=async()=>response;
    await assert.rejects(c.saveSnapshot(snap));assert.equal(c.sess.remoteVersion,3);
    assert.equal(settings.cloudReceipt,undefined);assert.equal(JSON.stringify(snap),before);
    assert.equal((await c.cloudStatus()).state,'pending');
  }
});
test('offline/local vault and another user never report a cloud success',async()=>{
  const {c,snap}=cloud();await c.saveSnapshot(snap);
  c.navigator.onLine=false;assert.equal((await c.cloudStatus()).state,'offline');
  c.navigator.onLine=true;c.provider.name='local-vault';assert.equal((await c.cloudStatus()).state,'local');
  c.provider.name='supabase-snapshot';c.sess.uid='other-user';assert.equal((await c.cloudStatus()).state,'pending');
});
test('concurrent edits and logout during a save cannot mark new data or a different session as synced',async()=>{
  const {c,snap,settings}=cloud();let finish;
  c.provider.save=()=>new Promise(resolve=>finish=resolve);
  const saving=c.saveSnapshot(JSON.parse(JSON.stringify(snap)));
  while(!finish)await new Promise(resolve=>setImmediate(resolve));
  snap.data.tours[0].notes='edit while saving';finish({ok:true,version:4});await saving;
  assert.equal((await c.cloudStatus()).state,'pending');
  finish=null;const second=c.saveSnapshot(snap);
  while(!finish)await new Promise(resolve=>setImmediate(resolve));
  c.sess.uid='other-user';c.sess.token='other-session';finish({ok:true,version:5});await second;
  assert.equal(c.sess.remoteVersion,4);assert.equal(settings.cloudReceipt.uid,'u-own');
});

test('missing digest does not block saving, while logout before the request prevents a save',async()=>{
  const {c,snap,settings,calls}=cloud();
  c.sha256hex=()=>Promise.reject(new Error('Crypto unavailable'));
  await c.saveSnapshot(snap);
  assert.equal(calls.length,1);assert.equal(c.sess.remoteVersion,4);
  assert.equal(settings.cloudReceipt,undefined);assert.equal((await c.cloudStatus()).state,'pending');
  const other=cloud();let finish;
  other.c.sha256hex=()=>new Promise(resolve=>finish=resolve);
  const pending=other.c.saveSnapshot(other.snap);
  other.c.sess.token=null;finish('a'.repeat(64));
  await assert.rejects(pending);assert.equal(other.calls.length,0);
  assert.equal(other.c.sess.remoteVersion,3);
});
