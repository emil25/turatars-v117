import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
function storage(initial={}) {
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};
}
function app(search=null) {
  const handlers={};
  const view={innerHTML:'',addEventListener:(name,handler)=>handlers[name]=handler};
  const context=vm.createContext({
    localStorage:storage(),sessionStorage:storage(search?{tvq:JSON.stringify(search)}:{}),
    VIEWS:{},NAV:{to:href=>context.openedHref=href},
    document:{getElementById:id=>id==='view'?view:null},
    esc:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    diffChip:value=>`<span>${value}</span>`,closeModal:()=>{},console
  });
  context.window=context;
  for(const name of ['data','store','public','dashboard','v49','v122','v123','v124'])
    vm.runInContext(fs.readFileSync(path.join(root,'app/js',name+'.js'),'utf8'),context,{filename:name+'.js'});
  vm.runInContext("Store.signup('Catalog test','catalog@test.local','test-only-password','Csíkszereda'); Store.me().onboarded=true; Store.save(); window.Store=Store; window.VIEWS=VIEWS;",context);
  return {context,view,handlers};
}
const ids=html=>[...html.matchAll(/class="f9card card" data-id="([^"]+)"/g)].map(m=>m[1]);

test('personal recommendations use the verified catalog and preserve existing data',()=>{
  const {context:c}=app();
  const before=JSON.stringify(c.V122.catalog());
  const own=c.Store.newTourFromDraft({title:'My private hike',place:'My own location'});
  const privateBefore=JSON.stringify(c.Store.getTour(own.id));
  const recommendations=c.recommendFor(c.Store.me());
  const catalogIds=new Set(c.v122PublicTours().map(t=>t.id));
  assert.equal(catalogIds.size,13);
  assert.ok(recommendations.length>0);
  for(const t of recommendations){assert.ok(catalogIds.has(t.id));assert.equal(t.dataStatus,'verified');assert.ok(t.sourceUrl);}
  assert.equal(JSON.stringify(c.V122.catalog()),before);
  assert.equal(JSON.stringify(c.Store.getTour(own.id)),privateBefore);
});

test('text recommendations use real catalog records and handle an empty catalog',()=>{
  const {context:c}=app();
  const catalog=c.v122PublicTours();
  for(const query of ['Könnyű, 3 órás családi túra','Hargita közepes túra','Nehéz, egész napos túra']){
    const result=c.Store.aiReply(query);
    assert.ok(catalog.some(t=>t.id===result.tour.id));
    assert.equal(result.tour.dataStatus,'verified');
  }
  c.v122PublicTours=()=>[];
  const result=c.Store.aiReply('Könnyű túra');
  assert.equal(result.tour,null);
  assert.match(result.error,/nincs ellenőrzött túra/);
});

test('home search transfers place, difficulty and time to signed-in discovery',()=>{
  const {context:c}=app({q:'Gyilkos',diff:'Könnyű',h:'3',pending:true});
  const html=c.VIEWS.discover();
  assert.deepEqual(JSON.parse(JSON.stringify({q:c.f9State.q,diff:c.f9State.diff,h:c.f9State.h})),{q:'Gyilkos',diff:'Könnyű',h:'3'});
  assert.deepEqual(ids(html),['vh-around-red-lake']);
  assert.match(html,/id="f9h"/);
  assert.equal(JSON.parse(c.sessionStorage.getItem('tvq')).pending,false);
  c.f9State.region='Nagy-Hagymás';
  c.VIEWS.discover();
  assert.equal(c.f9State.region,'Nagy-Hagymás','Rendering must not reset later user filters');
  c.sessionStorage.setItem('tvq',JSON.stringify({q:'Hargita',diff:'Könnyű',h:'5',pending:true}));
  assert.deepEqual(ids(c.VIEWS.discover()),[],'A fresh home search must replace old filters, including an honest empty result');
  assert.equal(c.f9State.region,'');
});

test('direct discovery filters survive rendering without an initial home search',()=>{
  const {context:c}=app();
  c.VIEWS.discover();
  c.f9State.region='Csomád-hegység';
  c.sessionStorage.setItem('tvq',JSON.stringify({q:'',diff:'',h:'',pending:false}));
  c.VIEWS.discover();
  assert.equal(c.f9State.region,'Csomád-hegység');
});

test('search time filters never accept a longer tour and hydrate after reload',()=>{
  const {context:c}=app({q:'',diff:'',h:'3',pending:false});
  const expected=c.v122PublicTours().filter(t=>t.h!=null&&t.h<=3).map(t=>t.id);
  assert.deepEqual(ids(c.VIEWS.discover()),Array.from(expected));
  c.sessionStorage.setItem('tvq',JSON.stringify({q:'',diff:'',h:'24',pending:true}));
  assert.equal(ids(c.VIEWS.discover()).length,13);
});

test('existing project buttons carry its ID and open it without creating another tour',()=>{
  const {context:c,view,handlers}=app();
  const catalog=c.v122PublicTours()[0];
  const own=c.Store.newTourFromDraft({title:catalog.name,place:catalog.start.name});
  own.extRef='f9:t:'+catalog.id;
  c.Store.save();
  const html=c.VIEWS.discover();
  assert.ok(html.includes('data-f9open="'+own.id+'"'));
  assert.ok(!html.includes('[object Object]'));
  const before=JSON.stringify(c.Store.myData().tours);
  c.VIEWS.discover.after(view);
  handlers.click({target:{closest:()=>({dataset:{f9open:own.id},hasAttribute:()=>false})}});
  assert.equal(c.openedHref,'#/tura/'+own.id);
  assert.equal(JSON.stringify(c.Store.myData().tours),before);
});
