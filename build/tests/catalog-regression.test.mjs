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
function app(search=null,local=storage()) {
  const handlers={};
  const view={innerHTML:'',addEventListener:(name,handler)=>handlers[name]=handler};
  const context=vm.createContext({
    localStorage:local,sessionStorage:storage(search?{tvq:JSON.stringify(search)}:{}),
    VIEWS:{},NAV:{to:href=>context.openedHref=href},
    document:{getElementById:id=>id==='view'?view:null},
    esc:value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
    diffChip:value=>`<span>${value}</span>`,fmtDateFull:value=>value,dowHU:()=>'',
    openModal:options=>context.lastModal=options,closeModal:()=>{},footer:()=>'',console
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

test('Egyeskő 60 adds one source-backed event while preserving all historical records',()=>{
  const {context:c}=app();
  const catalog=c.V122.catalog();
  assert.equal(catalog.tours.length,13);assert.equal(catalog.places.length,3);assert.equal(catalog.events.length,9);
  for(const original of c.V124.restoredEvents)
    assert.equal(JSON.stringify(catalog.events.find(e=>e.id===original.id)),JSON.stringify(original));
  const e=catalog.events.find(e=>e.id==='egyesko60-2026');
  assert.deepEqual(JSON.parse(JSON.stringify({date:e.date,endDate:e.endDate,km:e.km,up:e.up,timeLimitHours:e.timeLimitHours})),
    {date:'2026-10-09',endDate:'2026-10-11',km:59,up:2088,timeLimitHours:16});
  assert.equal(e.sourceUrl,'https://egyesko60.ro/');
  assert.equal(e.gpxUrl,'https://egyesko60.ro/assets/egyesko60-2026.gpx');
  assert.equal(e.reg,'https://forms.gle/qMf2z1w3mdaeGo8u5');
  assert.equal(e.verifiedAt,'2026-10-07');assert.equal(e.demo,false);
  assert.deepEqual(Array.from(c.V122.validate(e,'event')),[]);
  for(const field of ['h','diff','img','coords','track','gpx'])
    assert.equal(e[field],undefined,field+' must not be invented or copied');
});

test('catalog update and reload deduplicate the event without overwriting personal data',()=>{
  const {context:c}=app();
  c.Store.newTourFromDraft({title:'My existing private hike',notes:'Keep my notes'});
  const personal=JSON.stringify(c.Store.myData());
  const extra={...c.V124.verifiedEvents[0],id:'another-existing-event',name:'Existing organizer event'};
  c.V122.catalog().events.push(extra);c.Store.save();
  vm.runInContext(fs.readFileSync(path.join(root,'app/js/v124.js'),'utf8'),c);
  assert.equal(c.V122.catalog().events.filter(e=>e.id==='egyesko60-2026').length,1);
  assert.equal(JSON.stringify(c.V122.catalog().events.find(e=>e.id===extra.id)),JSON.stringify(extra));
  assert.equal(JSON.stringify(c.Store.myData()),personal);
  const {context:reloaded}=app(null,c.localStorage);
  assert.equal(reloaded.V122.catalog().events.filter(e=>e.id==='egyesko60-2026').length,1);
  assert.equal(JSON.stringify(reloaded.Store.myData()),personal);
});

test('multi-day events stay public through the last day and expire afterwards',()=>{
  const {context:c}=app();
  for(const date of ['2026-10-07','2026-10-09','2026-10-10','2026-10-11']){
    c.Store.todayISO=()=>date;
    assert.ok(c.v122PublicEvents().some(e=>e.id==='egyesko60-2026'),date);
    assert.match(c.VIEWS.events(),/Egyeskő 60/);
  }
  assert.ok(!c.v122PublicEvents().some(e=>e.id==='e18'),'Single-day event still expires normally');
  c.Store.todayISO=()=>'2026-10-12';
  assert.ok(!c.v122PublicEvents().some(e=>e.id==='egyesko60-2026'));
  assert.doesNotMatch(c.VIEWS.events(),/Egyeskő 60/);
  assert.ok(c.V122.catalog().events.some(e=>e.id==='egyesko60-2026'),'Expiry must not delete the source record');
});

test('event detail links to the original GPX and keeps the time limit distinct from duration',()=>{
  const {context:c}=app();c.Store.todayISO=()=>'2026-10-07';
  c.eventModal('egyesko60-2026');
  const html=c.lastModal.body;
  assert.match(html,/2026-10-09 – 2026-10-11/);
  assert.match(html,/Táv: <b>59 km/);assert.match(html,/Szintemelkedés: <b>2\s?088 m/);
  assert.match(html,/Szintidő: <b>16 óra/);assert.doesNotMatch(html,/Becsült idő/);
  assert.match(html,/href="https:\/\/egyesko60\.ro\/assets\/egyesko60-2026\.gpx"/);
  assert.match(html,/href="https:\/\/forms\.gle\/qMf2z1w3mdaeGo8u5"/);
  assert.match(html,/Forrás \/ Ellenőrizve/);
  assert.match(html,/GPX letöltése a szervezőtől/);
});

test('saving the catalog event creates a personal project with only known metrics and no fake track',()=>{
  const {context:c}=app();c.Store.todayISO=()=>'2026-10-07';
  const before=c.Store.myData().tours.length;
  c.Store.toggleEvent('egyesko60-2026');
  const own=c.Store.myData().tours.find(t=>t.eventRef==='egyesko60-2026');
  assert.ok(c.Store.isEventSaved('egyesko60-2026'));assert.ok(own);
  assert.equal(c.Store.myData().tours.length,before+1);
  assert.equal(own.lengthKm,59);assert.equal(own.ascent,2088);assert.equal(own.durationH,null);
  assert.equal(own.coords,null);assert.equal(own.gpx,null);
  assert.match(own.notes,/https:\/\/egyesko60\.ro\/assets\/egyesko60-2026\.gpx/);
  const {context:reloaded}=app(null,c.localStorage);
  assert.equal(JSON.stringify(reloaded.Store.myData().tours.find(t=>t.id===own.id)),JSON.stringify(own));
});
