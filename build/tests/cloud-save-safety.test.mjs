import test from 'node:test';
import assert from 'node:assert/strict';
import {harness,existing,restored,clone} from './cloud-safety-harness.mjs';
const rejects=(promise,code)=>assert.rejects(promise,e=>e.error===code);
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function unchanged(h,cloud,local){assert.deepEqual(h.remote.snapshot,cloud);assert.equal(h.local(),local);assert.equal(h.remote.commits.length,0);}

test('A: first unknown save checks remote, does not write or acquire readiness from a version',async()=>{
  const h=await existing(),cloud=clone(h.remote.snapshot),local=h.local();
  h.api.st().remoteVersion=3; // The old bypass, including a caller-set ready flag.
  h.api.st().saveSafety='ready';
  await rejects(h.api.api.save(h.snapshot()),'restore_required');
  assert.equal(h.remote.loads,1);assert.equal(h.remote.writes.length,0);
  assert.equal(h.api.st().saveSafety,'restore_required');unchanged(h,cloud,local);
  assert.equal(await h.ui.doSave(false),false);assert.equal(h.remote.writes.length,0);
});
test('B: failed restore plus first/second retry never writes',async()=>{
  const h=await existing(),cloud=clone(h.remote.snapshot);h.store.updateTour(h.store.myData().tours[0].id,{title:'Unsaved local tour'});
  const local=h.local();h.fault.write='turatars_v54_pre1';
  assert.equal(await h.ui.doLoad(false),null);assert.equal(h.api.st().saveSafety,'error');
  for(let i=0;i<2;i++)await rejects(h.api.api.save(h.snapshot()),'restore_required');
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('C: empty local snapshot never overwrites existing cloud, including repeated UI saves',async()=>{
  const h=await existing(),cloud=clone(h.remote.snapshot);
  const db=JSON.parse(h.local());db.data[h.store.me().id]={};h.store.importData(JSON.stringify(db));const local=h.local();
  for(let i=0;i<3;i++)assert.equal(await h.ui.doSave(false),false);
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('D: verified restore, edits and subsequent saves preserve the complete records and CAS version',async()=>{
  const h=await existing();const initial=h.local();
  h.remote.snapshot.data.routes=[{id:'r-cloud',track:[[46.3,25.7],[46.31,25.71]],raw:'kept'}];h.remote.snapshot.routes=clone(h.remote.snapshot.data.routes);
  h.remote.snapshot.data.tours[0].routeId='r-cloud';
  assert.equal((await h.ui.doLoad(false)).ok,true);assert.equal(h.api.st().saveSafety,'ready');
  assert.equal(h.local(),h.values.get('turavaros_v1'));
  assert.equal(JSON.parse(h.values.get('turatars_v54_pre1')).db.data[h.store.me().id].tours[0].routeId,undefined);
  assert.notEqual(h.local(),initial);h.edit();const local=h.local();
  assert.equal(await h.ui.doSave(false),true);assert.equal(h.remote.writes[0].expected,3);
  assert.deepEqual(h.remote.snapshot.data.routes,h.snapshot().data.routes);
  assert.equal(h.remote.snapshot.data.tours[0].notes,'Checked local edit');assert.equal(h.local(),local);
  h.store.updateTour(h.store.myData().tours[0].id,{notes:'Second edit'});
  await h.api.api.save(h.snapshot());assert.equal(h.remote.writes[1].expected,4);assert.equal(h.remote.version,5);
});
test('E: changed remote version is a conflict; retries cannot overwrite it',async()=>{
  const h=await restored();h.edit();h.remote.version++;h.remote.snapshot.data.tours[0].notes='Other device edit';
  const cloud=clone(h.remote.snapshot),local=h.local();
  await rejects(h.api.api.save(h.snapshot()),'version_conflict');assert.equal(h.api.st().saveSafety,'conflict');
  await rejects(h.api.api.save(h.snapshot()),'restore_required');
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('F: network failure while checking remote never invokes the write adapter',async()=>{
  const h=await restored(),cloud=clone(h.remote.snapshot),local=h.local();
  h.remote.loadHook=async()=>{throw {error:'network'};};
  await rejects(h.api.api.save(h.snapshot()),'network');assert.equal(h.api.st().saveSafety,'error');
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('G: network failure in restore invalidates even an earlier successful baseline',async()=>{
  const h=await restored(),cloud=clone(h.remote.snapshot),local=h.local();
  h.remote.loadHook=async()=>{throw {error:'network'};};assert.equal(await h.ui.doLoad(false),null);
  h.remote.loadHook=null;
  for(let i=0;i<2;i++)await rejects(h.api.api.save(h.snapshot()),'restore_required');
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('H: reload/restart, old numeric session state and persisted ready proof cannot bypass restore',async()=>{
  const h=await restored();h.edit();const cloud=clone(h.remote.snapshot),local=h.local();
  h.values.set('turatars_v54_state',JSON.stringify(h.api.st()));
  for(let i=0;i<2;i++){
    const r=await harness({remote:h.remote,values:h.values});
    await rejects(r.api.api.save(r.snapshot()),'restore_required');assert.equal(r.remote.writes.length,0);unchanged(r,cloud,local);
  }
  const r=await harness({remote:h.remote,values:h.values});assert.equal((await r.ui.doLoad(false)).ok,true);
  r.edit();await r.api.api.save(r.snapshot());assert.equal(r.remote.commits.length,1);
});
test('I: parallel same-client writes are locked; two clients racing use atomic expectedVersion',async()=>{
  const a=await restored();const b=await harness({remote:a.remote});await b.ui.doLoad(false);
  a.edit();b.store.updateTour(b.store.myData().tours[0].id,{notes:'Other client edit'});
  let release;const wait=new Promise(r=>release=r);a.remote.saveHook=()=>wait;
  const one=a.api.api.save(a.snapshot());while(a.remote.writes.length<1)await settle();
  await rejects(a.api.api.save(a.snapshot()),'cloud_busy');assert.equal(a.remote.writes.length,1);
  const two=b.api.api.save(b.snapshot());while(a.remote.writes.length<2)await settle();
  release();const results=await Promise.allSettled([one,two]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
  assert.equal(results.find(r=>r.status==='rejected').reason.error,'version_conflict');
  assert.equal(a.remote.commits.length,1);assert.equal(a.remote.version,4);
  assert.equal(a.store.myData().tours[0].notes,'Checked local edit');assert.equal(b.store.myData().tours[0].notes,'Other client edit');
});
test('J: the first absent snapshot is created normally only after the real read boundary',async()=>{
  const h=await harness();h.store.newTourFromDraft({title:'First private cloud tour'});const snap=h.snapshot(),local=h.local();
  assert.equal(await h.ui.doSave(false),true);assert.equal(h.remote.loads,1);assert.equal(h.remote.writes[0].expected,0);
  assert.deepEqual(h.remote.snapshot,snap);assert.equal(h.local(),local);assert.equal(h.api.st().saveSafety,'ready');
});
test('remote changes between verification and commit are refused by CAS, without losing local edits',async()=>{
  const h=await restored();h.edit();const local=h.local();let competing;
  h.remote.saveHook=async()=>{h.remote.version++;h.remote.snapshot.data.tours[0].notes='Racing remote write';competing=clone(h.remote.snapshot);};
  await rejects(h.api.api.save(h.snapshot()),'version_conflict');assert.deepEqual(h.remote.snapshot,competing);
  assert.equal(h.remote.commits.length,0);assert.equal(h.local(),local);
});
test('rollback and direct restoreApply revoke save permission; explicit verified restore is required again',async()=>{
  const h=await existing();h.remote.snapshot.data.tours[0].notes='Remote value';
  await h.ui.doLoad(false);assert.equal(h.api.api.rollback(),true);
  await rejects(h.api.api.save(h.snapshot()),'restore_required');assert.equal(h.remote.writes.length,0);
  const env={snap:clone(h.remote.snapshot),version:h.remote.version};assert.equal(h.api.api.restoreApply(env).ok,true);
  await rejects(h.api.api.save(h.snapshot()),'restore_required');
  await h.ui.doLoad(false);h.edit();await h.api.api.save(h.snapshot());assert.equal(h.remote.commits.length,1);
});
test('malformed/versionless snapshots, proof storage failure and changed proof all fail closed',async()=>{
  for(const version of [null,-1,'3']){
    const h=await existing();h.remote.version=version;const local=h.local(),cloud=clone(h.remote.snapshot);
    assert.equal(await h.ui.doLoad(false),null);await rejects(h.api.api.save(h.snapshot()),'invalid_snapshot');
    assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
  }
  const h=await restored();h.fault.silent='turatars_v54_settings_v1';
  assert.equal(await h.ui.doLoad(false),null);await rejects(h.api.api.save(h.snapshot()),'restore_required');assert.equal(h.remote.writes.length,0);
  const r=await restored(),settings=JSON.parse(r.values.get('turatars_v54_settings_v1'));settings.cloudSafety.uid='other-uid';r.values.set('turatars_v54_settings_v1',JSON.stringify(settings));
  await rejects(r.api.api.save(r.snapshot()),'restore_required');assert.equal(r.remote.writes.length,0);
});
test('failed/silent Store commit leaves disk, memory and pre-restore backup unchanged',async()=>{
  for(const mode of ['write','silent']){
    const h=await existing();h.remote.snapshot.data.tours[0].notes='Remote edit';const local=h.local();
    h.values.set('turatars_v54_pre1','previous undo');h.fault[mode]='turavaros_v1';
    assert.equal(await h.ui.doLoad(false),null);assert.equal(h.local(),local);assert.equal(h.values.get('turavaros_v1'),local);
    assert.equal(h.values.get('turatars_v54_pre1'),'previous undo');
    await rejects(h.api.api.save(h.snapshot()),'restore_required');assert.equal(h.remote.writes.length,0);
  }
});
test('user switch and local editing while restore loads cannot apply another state or grant a save',async()=>{
  for(const change of ['account','local']){
    const h=await restored(),cloud=clone(h.remote.snapshot);let release;
    h.remote.loadHook=()=>new Promise(r=>release=r);const loading=h.ui.doLoad(false);while(!release)await settle();
    if(change==='account'){h.api.st().uid='other-user';h.api.st().token='other-token';}else h.edit();
    const local=h.local();release();assert.equal(await loading,null);assert.equal(h.local(),local);assert.deepEqual(h.remote.snapshot,cloud);assert.equal(h.remote.writes.length,0);
    h.remote.loadHook=null;await rejects(h.api.api.save(h.snapshot()),'restore_required');
  }
});
test('a blank/reset Store cannot overwrite nonempty cloud even after a valid earlier restore',async()=>{
  const h=await restored(),cloud=clone(h.remote.snapshot);assert.equal(h.store.eraseMyData().ok,true);const local=h.local();
  for(let i=0;i<2;i++)await rejects(h.api.api.save(h.snapshot()),'restore_required');
  assert.equal(h.remote.writes.length,0);unchanged(h,cloud,local);
});
test('canonical proof accepts JSONB key ordering; changed content with the same version is refused',async()=>{
  const h=await restored();const reverse=v=>Array.isArray(v)?v.map(reverse):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reverse(x)])):v;
  h.remote.snapshot=reverse(h.remote.snapshot);h.edit();await h.api.api.save(h.snapshot());assert.equal(h.remote.commits.length,1);
  h.remote.snapshot.data.tours[0].notes='Unexpected content at the same version';const cloud=clone(h.remote.snapshot),local=h.local();
  await rejects(h.api.api.save(h.snapshot()),'version_conflict');assert.equal(h.remote.commits.length,1);assert.equal(h.local(),local);assert.deepEqual(h.remote.snapshot,cloud);
});
test('real local vault remains available without the Supabase save gate',async()=>{
  const h=await harness();h.api.st().provider='local-vault';
  await h.api.api.authSignup(h.store.me().email,'isolated-vault-password','Audit owner');
  const snap=h.snapshot();await h.api.api.save(snap);const saved=await h.api.api.load();
  assert.deepEqual(clone(saved.snap),snap);assert.equal(h.api.activeName(),'local-vault');assert.equal(h.remote.loads,0);assert.equal(h.remote.writes.length,0);
});
test('restore merge, idempotency and failed/retried rollback preserve existing safety semantics',async()=>{
  const h=await existing(),d=h.store.myData();d.reportAck={local:'keep'};d.futureField={local:'keep'};d.challenges=[{id:'local-progress',items:[{done:true}]}];h.store.save();
  const before=h.local();h.remote.snapshot.data.reportAck={remote:'keep'};h.remote.snapshot.data.futureField={remote:'keep'};h.remote.snapshot.data.challenges=[{id:'remote-challenge'}];
  assert.equal((await h.ui.doLoad(false)).ok,true);const once=h.local(),backup=h.values.get('turatars_v54_pre1');
  const data=h.store.myData();assert.equal(data.reportAck.local,'keep');assert.equal(data.reportAck.remote,'keep');assert.equal(data.futureField.local,'keep');assert.equal(data.futureField.remote,'keep');assert.equal(data.challenges.length,2);
  assert.equal((await h.ui.doLoad(false)).ok,true);assert.equal(h.local(),once);assert.equal(h.values.get('turatars_v54_pre1'),backup);
  h.fault.write='turavaros_v1';assert.equal(h.api.api.rollback(),false);assert.equal(h.local(),once);assert.equal(h.values.get('turavaros_v1'),once);
  h.fault.write=null;assert.equal(h.api.api.rollback(),true);assert.equal(h.local(),before);assert.equal(h.values.get('turavaros_v1'),before);
});
