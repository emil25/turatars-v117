/* ============================================================
   V125 — VALÓDI TÚRAFELFEDEZŐ + TÚRATERVEZŐ
   A V122–V124 provenance-köteles katalógusára és a meglévő V47 GPX/
   V120 GPS/V118 cloud Store-ra épül. Külső útvonalat nem talál ki.
   ============================================================ */
(function(){
"use strict";

function v125Routes(){ return (typeof HAGYMAS_ROUTES!=="undefined"&&Array.isArray(HAGYMAS_ROUTES))?HAGYMAS_ROUTES:[]; }
function v125Type(r){ return r.t==="bringa"?"Kerékpár":r.t==="esztena"?"Esztena KML":"Gyalogos túra"; }
function v125Name(r){ return String(r.n||"").replace(/_/g," ").replace(/\s+/g," ").trim(); }
function v125Source(r){ return "Nagyhagymás Közösségek Közti Fejlesztési Társulás"; }
function v125Card(r,i,compact){
  var kind=v125Type(r), isKml=r.t==="esztena";
  return '<article class="card v125-route-card" data-v125-route="'+i+'">'+
    '<div class="v125-route-head"><span class="chip '+(isKml?'chip-sand':r.t==="bringa"?'chip-ember':'chip-green')+'">'+esc(kind)+'</span><span class="chip chip-blue">Ismert útvonal</span></div>'+
    '<h3>'+esc(v125Name(r))+'</h3><p class="small muted">📍 Nagy-Hagymás · '+(isKml?'KML forrás':'GPX elérhető')+' · Táv/szint: csak a forrásfájl betöltése után</p>'+
    '<p class="tiny muted">Forrás: '+esc(v125Source(r))+'</p>'+
    '<div class="v125-route-actions"><button class="btn btn-soft btn-sm" data-v125-known-open="'+i+'">🗺️ Megnyitás térképen</button>'+ (isKml?'':'<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="'+esc(r.url)+'">⬇ GPX</a>')+
      (compact?'':'<button class="btn btn-primary btn-sm" data-v125-known-start="'+i+'">🥾 Útvonal használata</button>')+'</div></article>';
}
function v125Section(id, compact){
  var rows=v125Routes(), first=compact?rows.slice(0,6):rows.slice(0,8), rest=rows.slice(first.length);
  if(!rows.length) return '';
  var html='<section class="pub-section v125-known" id="'+id+'"><div class="sect-head"><div><span class="eyebrow">Nagy-Hagymás · ellenőrzött forrás</span><h2 class="mb0">Ismert túraútvonalak</h2></div><a class="sect-more" href="#/hagymas">Teljes útvonalhálózat →</a></div><p class="muted small">A megjelenő GPX- és KML-linkek a Nagyhagymás KKT eredeti adatforrására mutatnak. Ismeretlen távot és szintet nem pótolunk kitalált értékkel.</p><div class="grid g3 v125-route-grid">'+first.map(function(r,i){return v125Card(r,i,compact);}).join('')+'</div>';
  if(rest.length) html+='<details class="v125-route-more"><summary>＋ '+rest.length+' további ismert útvonal</summary><div class="grid g3 v125-route-grid">'+rest.map(function(r,i){return v125Card(r,i+first.length,compact);}).join('')+'</div></details>';
  return html+'</section>';
}
function v125KnownIndex(value){ var i=Number(value); return Number.isInteger(i)&&i>=0&&i<v125Routes().length?i:-1; }
function v125LoadRoute(i, host){
  var r=v125Routes()[i]; if(!r||!host) return;
  var stats=host.querySelector('[data-v125-stats]'), mapEl=host.querySelector('[data-v125-map]');
  if(r.t==="esztena"){ if(stats) stats.textContent="KML pontforrás — GPX szint- és távadat nem érhető el."; return; }
  if(stats) stats.textContent="GPX betöltése a forrásból…";
  fetch(r.url).then(function(res){ if(!res.ok) throw new Error("GPX HTTP "+res.status); return res.text(); }).then(function(txt){
    var pts=typeof hgyParseGpx==="function"?hgyParseGpx(txt):[];
    if(pts.length<2) throw new Error("A forrás nem tartalmaz trackpontokat");
    var st=typeof hgyStats==="function"?hgyStats(pts):null;
    if(stats) stats.textContent=(st?((Math.round(st.m/10)/100).toFixed(2).replace('.',',')+' km · +'+Math.round(st.up)+' m'):pts.length+' pont')+' · '+pts.length+' GPS pont';
    if(mapEl&&typeof MapKit!=="undefined"&&window.L){
      var m=MapKit.make(mapEl,{center:[pts[0].lat,pts[0].lng],zoom:12});
      if(m){ window.L.polyline(pts.map(function(p){return [p.lat,p.lng];}),{color:'#1C4A36',weight:4}).addTo(m); if(m.fitBounds) m.fitBounds(window.L.latLngBounds(pts.map(function(p){return [p.lat,p.lng];})).pad(.15)); }
    }
  }).catch(function(){ if(stats) stats.textContent="A GPX most nem tölthető be böngészőből; a forráslinken továbbra is elérhető."; });
}
function v125OpenKnown(i){
  i=v125KnownIndex(i); var r=v125Routes()[i]; if(!r) return;
  var canStart=!!Store.me(), isKml=r.t==="esztena";
  openModal({title:'🗺️ '+esc(v125Name(r)),body:'<p class="small muted mt0"><span class="chip chip-green">Ismert útvonal</span> · '+esc(v125Type(r))+' · '+esc(v125Source(r))+'</p><div data-v125-map class="mapbox" style="height:270px;border-radius:14px;margin:.7rem 0"><div class="empty" style="padding:2rem">A valódi GPX betöltése után jelenik meg az útvonal.</div></div><p data-v125-stats class="small muted">'+(isKml?'KML pontforrás — GPX szint- és távadat nem érhető el.':'A táv és szint a forrás GPX-ből olvasható ki.')+'</p><p class="tiny muted">Nem másoljuk át a külső adatot: a térkép a forrás nyomvonalát csak megtekintésre tölti be.</p>',footer:'<div class="flex" style="gap:.5rem;justify-content:flex-end;flex-wrap:wrap">'+(canStart&&!isKml?'<button class="btn btn-primary" data-v125-modal-start>🥾 Útvonal használata / GPS</button>':'<a class="btn btn-soft" href="#/belepes">🔐 Importáláshoz belépés</a>')+'<a class="btn btn-ghost" target="_blank" rel="noopener" href="'+esc(r.url)+'">⬇ '+(isKml?'KML forrás':'GPX letöltése')+'</a><button class="btn btn-ghost" data-close>Bezárás</button></div>',onOpen:function(root){
    v125LoadRoute(i,root); var b=root.querySelector('[data-v125-modal-start]'); if(b) b.onclick=function(){ closeModal(); if(typeof hgyImport==="function") hgyImport(i,b,function(t){ if(window.v120Begin) window.v120Begin(t.id); }); };
  }});
}
function v125UseKnown(i, btn, start){
  i=v125KnownIndex(i); if(i<0) return;
  if(!Store.me()){ toast("Az útvonal személyes tervbe importálásához jelentkezz be","🔐"); NAV.to("#/belepes"); return; }
  if(typeof hgyImport==="function") hgyImport(i,btn,start?function(t){ if(window.v120Begin) window.v120Begin(t.id); }:undefined);
}
function v125BindKnown(root){
  if(!root||root.__v125KnownBound) return; root.__v125KnownBound=true;
  root.addEventListener("click",function(e){ var b=e.target.closest&&e.target.closest('[data-v125-known-open],[data-v125-known-start]'); if(!b) return; e.preventDefault(); var i=b.dataset.v125KnownOpen!=null?b.dataset.v125KnownOpen:b.dataset.v125KnownStart; if(b.dataset.v125KnownOpen!=null) v125OpenKnown(i); else v125UseKnown(i,b,true); });
}
function v125Inject(root, compact){
  if(!root||root.querySelector("#v125-known")) return;
  var node=document.createElement("div"); node.innerHTML=v125Section("v125-known",compact); var sec=node.firstElementChild; if(!sec) return;
  var foot=root.querySelector("footer"); if(foot) foot.parentNode.insertBefore(sec,foot); else root.appendChild(sec); v125BindKnown(root);
}

/* Előkészített routing adapter: csak valódi szolgáltatóval ad útvonalat. */
window.V125Routing={provider:null,plan:function(){ return Promise.resolve({ok:false,reason:"external_routing_required",message:"Útvonaltervezéshez külső routing szolgáltató szükséges. A rendszer nem rajzol kitalált útvonalat."}); },message:"Útvonaltervezéshez külső routing szolgáltató szükséges."};
window.v125KnownRoutes=function(){ return v125Routes().map(function(r,i){ return {id:"hagymas-"+i,name:v125Name(r),kind:r.t,source:v125Source(r),sourceUrl:r.url,hasGpx:r.t!=="esztena",dataStatus:"verified"}; }); };
window.v125KnownRouteCount=function(){ return v125Routes().length; };

window.v125StartCatalogTour=function(id){
  var t=window.v122PublicTours&&window.v122PublicTours().find(function(x){return x.id===id;});
  if(!t){ toast("Ez a katalógustúra már nem érhető el","⚠️"); return; }
  if(!Store.me()){ toast("A GPS indításához jelentkezz be","🔐"); NAV.to("#/belepes"); return; }
  var d=Store.myData(), ref="f9:t:"+t.id, own=(d.tours||[]).find(function(x){return x.extRef===ref;});
  if(!own){ own=Store.newTourFromDraft({title:t.name,place:t.start&&t.start.name||t.region||"",region:t.region||"",date:"",lengthKm:+t.km||0,ascent:+t.up||0,durationH:+t.h||0,difficulty:t.diff||"Közepes",img:t.img||IMG.erdo,desc:t.desc||"",coords:t.start&&t.start.lat?{lat:t.start.lat,lng:t.start.lng}:null,notes:"Forrás: "+(t.sourceUrl||t.src||"katalógus"),tags:(t.tags||[]).slice(0,8).concat(["felfedezett"])}); own.extRef=ref; Store.save(); }
  if(window.v120Begin) window.v120Begin(own.id); else NAV.to("#/tura/"+own.id);
};

/* Egyszerű tervezőfelület: ismert útvonal vagy külső routing szükséges. */
VIEWS.planner=function(){
  var rows=v125Routes(), raw=String(location.hash||"").split("?")[1]||"", qs=new URLSearchParams(raw), pre=qs.get("route")||"";
  var tours=window.v122PublicTours?window.v122PublicTours():[];
  return '<div class="wrap pub-section v125-planner"><div class="sect-head"><div><span class="eyebrow">Valódi útvonaladatok</span><h1 class="mb0">Túra tervezése</h1></div></div><p class="muted">Válassz egy ismert, forrásolt útvonalat, vagy add meg a tervezés kiinduló adatait. Külső routing nélkül nem készítünk hamis útvonalat.</p><section class="card v125-plan-card"><h2>Ismert útvonal használata</h2><div class="v125-plan-row"><select class="input" id="v125-route-select"><option value="">Válassz a 37 Nagy-Hagymás útvonalból</option>'+rows.map(function(r,i){return '<option value="'+i+'"'+(pre==="hagymas-"+i?' selected':'')+'>'+esc(v125Name(r))+' · '+esc(v125Type(r))+'</option>';}).join('')+'</select><button class="btn btn-primary" id="v125-route-use">🗺️ Megnyitás</button></div><p class="small muted">A GPX/KML a Nagyhagymás KKT eredeti forrásán marad; importáláskor a meglévő V47 Store/GPX rendszer számítja a távot és a szintet.</p></section><section class="card v125-plan-card"><h2>Útvonal két pont között</h2><div class="grid g2"><label class="f">Kezdőpont<input class="input" id="v125-start" placeholder="Település vagy koordináta"></label><label class="f">Célpont<input class="input" id="v125-end" placeholder="Település vagy koordináta"></label></div><button class="btn btn-ghost" id="v125-route-plan">🧭 Útvonaltervezés kérése</button><p id="v125-route-message" class="small muted" style="margin-top:.7rem"></p></section><p class="small muted">A későbbi OSRM, GraphHopper vagy Mapbox bekötése a <code>V125Routing</code> adapteren keresztül történhet.</p></div>'+footer();
};
VIEWS.planner.after=function(root){
  var sel=root.querySelector("#v125-route-select"), use=root.querySelector("#v125-route-use"), plan=root.querySelector("#v125-route-plan"), msg=root.querySelector("#v125-route-message");
  if(use) use.onclick=function(){ var i=v125KnownIndex(sel&&sel.value); if(i>=0) v125OpenKnown(i); else if(msg) msg.textContent="Válassz egy ismert útvonalat."; };
  if(plan) plan.onclick=function(){ V125Routing.plan({start:(root.querySelector("#v125-start")||{}).value||"",end:(root.querySelector("#v125-end")||{}).value||""}).then(function(r){ if(msg) msg.textContent=r.message; }); };
  v125BindKnown(root);
};

/* A meglévő főoldal és felfedező oldal kap egy kis, valódi útvonal-sávot. */
var _home=VIEWS.home, _homeA=VIEWS.home&&VIEWS.home.after;
VIEWS.home=function(){ var html=_home(); return html.replace(/Hova mennél\?/g,"Hová túráznál?").replace(/<footer class="pub-foot"/,v125Section("v125-home-known",true)+'<footer class="pub-foot"'); };
VIEWS.home.after=function(root){ if(_homeA) _homeA(root); v125BindKnown(root); };
var _disc=VIEWS.discover, _discA=VIEWS.discover&&VIEWS.discover.after;
VIEWS.discover=function(){ return _disc(); };
VIEWS.discover.after=function(root){ if(_discA) _discA(root); v125Inject(root,false); };
var _hgyA=VIEWS.hagymas&&VIEWS.hagymas.after; if(_hgyA) VIEWS.hagymas.after=function(root){ _hgyA(root); v125BindKnown(root); };

window.V125={version:"125",knownRouteCount:v125Routes().length,knownRoutes:window.v125KnownRoutes,openKnown:v125OpenKnown,startCatalog:window.v125StartCatalogTour};
})();
