/* ============ V122 — VERIFIED PUBLIC DATA CATALOG ============
   The legacy catalog remains available to the private V41–V121 flows, but
   public pages only expose records imported with explicit provenance and a
   verified status. No placeholder or demo records are seeded here. */
(function(){
"use strict";
var REQUIRED=["source","sourceUrl","sourceLicense","attribution","importedAt","verifiedAt","dataStatus"];
function platform(){ try{return Store.platform();}catch(e){return null;} }
function catalog(){
  var p=platform(); if(!p) return {tours:[],events:[],places:[]};
  if(!p.catalog) p.catalog={schemaVersion:1,region:"Székelyföld",tours:[],events:[],places:[]};
  if(!Array.isArray(p.catalog.tours)) p.catalog.tours=[];
  if(!Array.isArray(p.catalog.events)) p.catalog.events=[];
  if(!Array.isArray(p.catalog.places)) p.catalog.places=[];
  return p.catalog;
}
function escV(x){ try{return esc(x==null?"":String(x));}catch(e){return String(x==null?"":x);} }
function valid(x){
  if(!x || x.archived===true || x.dataStatus!=="verified") return false;
  for(var i=0;i<REQUIRED.length;i++) if(x[REQUIRED[i]]==null || String(x[REQUIRED[i]]).trim()==="") return false;
  return !!String(x.sourceUrl).trim();
}
function normalizeTour(x){
  var t=Object.assign({},x||{}); t.tags=Array.isArray(t.tags)?t.tags:[];
  t.region=t.region||""; t.name=t.name||""; t.km=t.km==null?null:+t.km; t.up=t.up==null?null:+t.up;
  t.h=t.h==null?null:+t.h; t.diff=t.diff||t.difficulty||""; t.difficulty=t.difficulty||t.diff;
  t.start=t.start&&typeof t.start==="object"?t.start:null; t.elev=Array.isArray(t.elev)?t.elev:[];
  return t;
}
function normalizeEvent(x){ var e=Object.assign({},x||{}); e.name=e.name||""; e.cat=e.cat||""; e.people=Number(e.people)||0; e.cap=Number(e.cap)||0; return e; }
function tourReady(t){ var s=t&&t.start; return !!(valid(t)&&t.name&&t.region&&s&&isFinite(+s.lat)&&isFinite(+s.lng)&&isFinite(+t.km)&&isFinite(+t.up)&&isFinite(+t.h)&&t.diff); }
function eventReady(e){ return !!(valid(e)&&e.name&&e.org&&e.date&&e.place); }
function placeReady(p){ return !!(valid(p)&&p.name&&p.place); }
function publicTours(){ return catalog().tours.filter(tourReady).map(normalizeTour); }
function publicEvents(){
  var today=Store.todayISO();
  return catalog().events.filter(function(e){ return eventReady(e) && String(e.date)>=today; }).map(normalizeEvent);
}
function publicPlaces(){ return catalog().places.filter(placeReady); }
function sourceLine(x){
  if(!x||!x.sourceUrl||!x.verifiedAt) return "";
  return '<p class="small muted v122-source">Forrás / Ellenőrizve: <a href="'+escV(x.sourceUrl)+'" target="_blank" rel="noopener nofollow">'+escV(x.source||"külső forrás")+'</a> · '+escV(x.verifiedAt)+'</p>';
}
function validateRecord(x,kind){
  var miss=REQUIRED.filter(function(k){return x[k]==null||String(x[k]).trim()==="";});
  if(!x.id) miss.push("id"); if(kind==="tour" && !x.name) miss.push("name"); if(kind==="event" && !x.name) miss.push("name");
  if(x.dataStatus!=="verified" && x.dataStatus!=="needs_review") miss.push("dataStatus (verified/needs_review)");
  return miss;
}
function adminHtml(){
  var c=catalog(), n=c.tours.length+c.events.length+c.places.length;
  return '<div class="wrap pub-section tight"><section class="card panel"><span class="eyebrow">V122 · FORRÁSKEZELÉS</span><h1>Forrásalapú katalógus</h1><p class="muted">A nyilvános katalógusba csak <b>verified</b> rekord kerülhet. A régi, forrás nélkül maradt adatok nem jelennek meg nyilvánosan.</p><div class="grid g3"><div class="card"><b>'+c.tours.length+'</b><span class="small muted">importált túra</span></div><div class="card"><b>'+c.events.length+'</b><span class="small muted">importált esemény</span></div><div class="card"><b>'+n+'</b><span class="small muted">összes forrásrekord</span></div></div><p class="small muted">Kötelező mezők: '+REQUIRED.join(", ")+'</p><label class="f" for="v122-json">Ellenőrzött rekord előkészítése (JSON)</label><textarea class="input" id="v122-json" rows="10" placeholder="Nem kerül automatikusan nyilvánosságra — előbb ellenőrizd a forrást."></textarea><p id="v122-msg" class="small muted"></p><button class="btn btn-primary" id="v122-validate">Rekord ellenőrzése</button></section></div>';
}
function adminAfter(root){
  var b=root.querySelector("#v122-validate"); if(!b) return;
  b.onclick=function(){ var msg=root.querySelector("#v122-msg"), raw=root.querySelector("#v122-json").value, x;
    try{x=JSON.parse(raw);}catch(e){msg.textContent="Hibás JSON — nincs mentés."; return;}
    var kind=x.kind||"tour", miss=validateRecord(x,kind); msg.textContent=miss.length?"Hiányzó vagy hibás mezők: "+miss.join(", "):"A rekord megfelel a sémának. Mentéshez admin jóváhagyás és forrásellenőrzés szükséges.";
  };
}
window.V122={
  schemaVersion:1, region:"Székelyföld", requiredFields:REQUIRED,
  catalog:catalog, tours:publicTours, events:publicEvents, places:publicPlaces,
  sourceLine:sourceLine, validate:validateRecord,
  importSchema:{tour:REQUIRED.concat(["id","name","region","coords","distanceKm","elevationGainM","difficulty","durationHours","routeUrl","description"]),event:REQUIRED.concat(["id","name","organizer","date","place","officialUrl"])},
  hasVerifiedData:function(){return publicTours().length>0||publicEvents().length>0||publicPlaces().length>0;}
};
window.v122PublicTours=publicTours; window.v122PublicEvents=publicEvents; window.v122PublicPlaces=publicPlaces; window.v122SourceLine=sourceLine;
VIEWS.v122Admin=function(){ return Store.me()?adminHtml():'<div class="wrap pub-section"><div class="empty"><h1>Forráskezelés</h1><p>Jelentkezz be a forrásrekordok ellenőrzéséhez.</p><a class="btn btn-primary" href="#/belepes">Belépés</a></div></div>'; };
VIEWS.v122Admin.after=adminAfter;
})();
