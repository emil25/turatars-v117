import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

function app(){
  const values=new Map();let fail=false;
  const localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('Storage unavailable');values.set(k,String(v));}};
  const c=vm.createContext({localStorage,window:{}});
  for(const file of ['data','store'])vm.runInContext(fs.readFileSync(fileURLToPath(new URL('../../app/js/'+file+'.js',import.meta.url)),'utf8'),c);
  vm.runInContext('window.Store=Store',c);
  return {s:c.window.Store,values,fail:()=>fail=true};
}
test('local reset is owner-scoped and preserves account, other user and platform data',()=>{
  const {s}=app();s.signup('Other owner','other@local.test','private-test-password','');
  const otherId=s.me().id;s.newTourFromDraft({title:'Other private tour'});
  s.logout();s.signup('Current owner','owner@local.test','private-test-password','');
  const ownerId=s.me().id;s.newTourFromDraft({title:'Current private tour'});s.myData();
  const before=JSON.parse(s.exportData());assert.equal(s.eraseMyData().ok,true);
  const after=JSON.parse(s.exportData());
  assert.equal(s.myData().tours.length,0);assert.equal(s.me().id,ownerId);
  assert.deepEqual(after.users,before.users);assert.deepEqual(after.data[otherId],before.data[otherId]);
  assert.deepEqual(after.platform,before.platform);assert.deepEqual(after.community,before.community);
  assert.notDeepEqual(after.data[ownerId],before.data[ownerId]);
});
test('failed reset preserves both memory and the persisted Store',()=>{
  const {s,values,fail}=app();s.signup('Owner','owner@local.test','private-test-password','');
  s.newTourFromDraft({title:'Keep on storage failure'});s.myData();s.save();
  const before=s.exportData(),disk=[...values];fail();
  assert.ok(s.eraseMyData().err);assert.equal(s.exportData(),before);assert.deepEqual([...values],disk);
});
test('signed-out local reset is rejected without touching data',()=>{
  const {s,values}=app(),before=s.exportData(),disk=[...values];
  assert.ok(s.eraseMyData().err);assert.equal(s.exportData(),before);assert.deepEqual([...values],disk);
});
