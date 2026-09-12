/* ============================================================
   V126 — saját és közösségi GPS-túrák
   A catalog (V122–V125) külön marad; ez a réteg csak a felhasználó saját,
   kifejezetten publikált túráit olvassa/írja a Supabase RLS-es tábláiba.
   ============================================================ */
(function(){
"use strict";

var V126_VERSION="126";
var cache=[];
function cloud(){ return window.__V54&&window.__V54.api&&window.__V54.api.communityList?window.__V54.api:null; }
function errText(e){ return (e&&e.error)||((e&&e.message)||"A közösségi cloud jelenleg nem érhető el."); }
function escText(v){ return typeof esc==="function"?esc(v==null?"":String(v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"})[c];}); }
function ownUser(){ return Store.me&&Store.me(); }
function validUuid(v){ return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||"")); }
function trackOf(t){
  var pts=(t&&t.gpx&&Array.isArray(t.gpx.pts))?t.gpx.pts:((t&&t.liveTrack&&Array.isArray(t.liveTrack.points))?t.liveTrack.points:[]);
  return pts.map(function(p){ return {lat:+p.lat,lng:+(p.lng!=null?p.lng:p.lon),ele:p.ele==null?(p.altitude==null?null:+p.altitude):+p.ele,time:p.time||p.timestamp||null}; }).filter(function(p){return Number.isFinite(p.lat)&&Number.isFinite(p.lng);});
}
function payload(t){
  var p=trackOf(t), u=ownUser()||{};
  return {id:validUuid(t.communityCloudId)?t.communityCloudId:undefined,title:String(t.title||"Saját túra").slice(0,160),visibility:t.communityVisibility==="public"?"public":"private",distance_km:t.liveTrack&&Number.isFinite(+t.liveTrack.distanceM)?(+t.liveTrack.distanceM/1000):(+t.lengthKm||null),duration_minutes:t.liveTrack&&Number.isFinite(+t.liveTrack.activeMs)?Math.round(+t.liveTrack.activeMs/60000):(+t.durationH?Math.round(+t.durationH*60):null),elevation_gain_m:t.liveTrack&&Number.isFinite(+t.liveTrack.elevationGain)?Math.round(+t.liveTrack.elevationGain):(+t.ascent||null),difficulty:t.difficulty||null,tour_date:t.date||null,track:p,gpx_public:!!t.communityGpxPublic,source:"user_gps",provenance:{kind:"user_gps",owner_uid:u.id||null,recorded_at:t.liveTrack&&t.liveTrack.startedAt||t.createdAt||null}};
}
function localMark(t,row){
  var patch={communityCloudId:row&&row.id||t.communityCloudId,communityVisibility:row&&row.visibility||t.communityVisibility||"private",communityGpxPublic:!!(row&&row.gpx_public)};
  Store.updateTour(t.id,patch); return Store.getTour(t.id)||t;
}
function saveTourCloud(t,opts){
  opts=opts||{}; var api=cloud();
  if(!api||typeof api.communityUpsert!=="function") return Promise.reject({error:"community_cloud_unavailable"});
  var p=payload(t); if(opts.visibility) p.visibility=opts.visibility; if(opts.gpxPublic!=null) p.gpx_public=!!opts.gpxPublic;
  return api.communityUpsert(p).then(function(row){ localMark(t,row||p); return row||p; });
}
function setVisibility(t,visibility,gpxPublic){
  var api=cloud();
  if(!api||typeof api.communitySetVisibility!=="function") return Promise.reject({error:"community_cloud_unavailable"});
  if(!validUuid(t.communityCloudId)) return saveTourCloud(t,{visibility:visibility,gpxPublic:gpxPublic});
  return api.communitySetVisibility(t.communityCloudId,visibility,gpxPublic).then(function(row){localMark(t,row||{});return row;});
}
function syncSnapshot(){
  try{ if(window.__V54&&window.__V54.api&&window.__V54.api.save&&window.__V54.st&&window.__V54.st().remoteVersion!=null){ return window.__V54.api.save(window.__V54.build()).catch(function(){return null;}); } }catch(e){}
  return Promise.resolve(null);
}
function saveAction(t,button){
  if(button) button.disabled=true;
  return saveTourCloud(t).then(function(){return syncSnapshot();}).then(function(){toast("☁️ Közösségi túra mentve — alapállapotban privát.","✅"); if(button){button.textContent="☁️ Mentve a túráim közé";button.disabled=false;}}).catch(function(e){if(button)button.disabled=false;toast("A helyi túra megmaradt. Cloud mentés: "+errText(e),"⚠️");});
}
function ownControls(t){
  var pub=t.communityVisibility==="public";
  return '<div class="v126-own-controls" data-v126-own-controls="'+escText(t.id)+'"><span class="chip '+(pub?'chip-green':'chip-sand')+'">'+(pub?'Közösségi túra':'Privát')+'</span>'+
    (!validUuid(t.communityCloudId)?'<button class="btn btn-soft btn-sm" data-v126-save="'+escText(t.id)+'">☁️ Mentés a túráim közé</button>':'')+
    '<button class="btn btn-ghost btn-sm" data-v126-visibility="'+escText(t.id)+'">'+(pub?'🔒 Privátra állítás':'🌍 Nyilvánossá tétel')+'</button>'+
    (pub?'<button class="btn btn-ghost btn-sm" data-v126-gpx="'+escText(t.id)+'">GPX: '+(t.communityGpxPublic?'nyilvános':'privát')+'</button>':'')+'</div>';
}
function bindOwn(root){
  if(!root||root.__v126OwnBound)return; root.__v126OwnBound=true;
  root.querySelectorAll("[data-tour-id]").forEach(function(row){ var t=Store.getTour(row.getAttribute("data-tour-id"));if(!t||row.querySelector(".v126-own-controls"))return;var host=row.querySelector(".tr-actions")||row;host.insertAdjacentHTML("beforeend",ownControls(t)); });
  root.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-v126-save],[data-v126-visibility],[data-v126-gpx]");if(!b)return;e.preventDefault();var t=Store.getTour(b.dataset.v126Save||b.dataset.v126Visibility||b.dataset.v126Gpx);if(!t)return;
    if(b.dataset.v126Save){saveAction(t,b);return;}
    if(b.dataset.v126Gpx){var next=!t.communityGpxPublic;setVisibility(t,"public",next).then(function(){render();toast(next?"A GPX mostantól letölthető a közösségi túránál.":"A GPX ismét privát.","✅");}).catch(function(x){toast("Nem sikerült a GPX-láthatóság módosítása: "+errText(x),"⚠️");});return;}
    var nextVis=t.communityVisibility==="public"?"private":"public";
    if(nextVis==="public") openModal({title:"🌍 Túra közzététele",body:'<p class="mt0">A saját GPS-felvételed közösségi túraként megjelenik más bejelentkezett túrázóknak. A GPX alapból privát marad.</p>',footer:'<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="v126-confirm-public">Nyilvánossá tétel</button>',onOpen:function(r){r.querySelector("#v126-confirm-public").onclick=function(){closeModal();setVisibility(t,"public",false).then(function(){render();toast("Közösségi túra közzétéve.","🌍");}).catch(function(x){toast("Nem sikerült közzétenni: "+errText(x),"⚠️");});};}});
    else setVisibility(t,"private",false).then(function(){render();toast("A túra ismét privát.","🔒");}).catch(function(x){toast("Nem sikerült visszaállítani: "+errText(x),"⚠️");});
  });
}
function card(row){
  var pts=Array.isArray(row.track)?row.track:[], meta=[];
  if(row.distance_km!=null)meta.push("📏 "+Number(row.distance_km).toFixed(1)+" km");
  if(row.duration_minutes!=null)meta.push("⏱ "+Math.round(row.duration_minutes/60*10)/10+" ó");
  if(row.elevation_gain_m!=null)meta.push("⬆ "+row.elevation_gain_m+" m");
  return `<article class="card v126-community-card"><div class="meta"><span class="chip chip-green">Közösségi túra</span><span class="chip chip-blue">${escText(row.author_display_name||"Túratárs")}</span></div><h3>${escText(row.title)}</h3><div class="meta">${meta.map(function(x){return escText(x);}).join("<span> · </span>")}</div><p class="small muted">${pts.length?pts.length+" GPS pont · valós felhasználói felvétel":"A nyomvonal nem nyilvános"}</p><div class="v126-card-actions"><button class="btn btn-soft btn-sm" data-v126-open="${escText(row.id)}">🗺️ Megnyitás</button><button class="btn btn-ghost btn-sm" data-v126-fav="${escText(row.id)}">♡ Mentés</button><button class="btn btn-ghost btn-sm" data-v126-review="${escText(row.id)}">★ Értékelés</button><button class="btn btn-ghost btn-sm" data-v126-report="${escText(row.id)}">⚑ Hibát jelentek</button></div></article>`;
}
function fetchCommunity(root){
  var api=cloud(), host=root&&root.querySelector("#v126-community-list");if(!host)return;
  if(!api){host.innerHTML='<div class="empty"><span class="em-ico">☁️</span><h3>A közösségi túrákhoz cloud kapcsolat szükséges.</h3><p>Helyben rögzített túráid továbbra is a saját eszközödön maradnak.</p></div>';return;}
  host.innerHTML='<div class="empty"><span class="em-ico">⏳</span><p>Közösségi túrák betöltése…</p></div>';
  api.communityList().then(function(rows){cache=Array.isArray(rows)?rows:[];host.innerHTML=cache.length?cache.map(card).join(""):'<div class="empty"><span class="em-ico">🌲</span><h3>Még nincs nyilvános közösségi túra.</h3><p>A saját GPS-túrádat a Túráim oldalon teheted közzé.</p></div>';}).catch(function(e){host.innerHTML='<div class="empty"><span class="em-ico">☁️</span><h3>A közösségi túrák most nem tölthetők be.</h3><p class="small">'+escText(errText(e))+'</p></div>';});
}
function rowById(id){return cache.find(function(x){return String(x.id)===String(id);});}
function communityOpen(id){var row=rowById(id);if(!row)return;var pts=Array.isArray(row.track)?row.track:[];openModal({title:'🌍 '+escText(row.title),body:'<p class="small muted"><span class="chip chip-green">Közösségi túra</span> · '+escText(row.author_display_name||"Túratárs")+'</p><div class="v126-community-map" id="v126-map">'+(pts.length?'':'<div class="empty">A készítő nem tette nyilvánossá a GPX-tracket.</div>')+'</div><p class="small">'+(pts.length?pts.length+" valós GPS-pont érhető el.":"Útvonaladat nem érhető el nyilvánosan.")+'</p>',footer:'<button class="btn btn-ghost" data-close>Bezárás</button>',onOpen:function(r){if(pts.length&&window.L&&window.MapKit){var m=MapKit.make(r.querySelector("#v126-map"),{center:[pts[0].lat,pts[0].lng],zoom:12});if(m){L.polyline(pts.map(function(p){return [p.lat,p.lng];}),{color:"#1C4A36",weight:4}).addTo(m);if(m.fitBounds)m.fitBounds(L.latLngBounds(pts.map(function(p){return [p.lat,p.lng];})).pad(.15));}}}});}
function review(id){var api=cloud();if(!api||!ownUser()){toast("Értékeléshez jelentkezz be.","🔐");return;}openModal({title:"★ Közösségi túra értékelése",body:'<label class="f">Értékelés</label><select class="input" id="v126-rating"><option value="5">5 — Nagyon hasznos</option><option value="4">4 — Hasznos</option><option value="3">3 — Rendben</option><option value="2">2 — Kevésbé hasznos</option><option value="1">1 — Nem hasznos</option></select><label class="f">Rövid beszámoló (opcionális)</label><textarea class="input" id="v126-note" rows="3"></textarea>',footer:'<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="v126-review-save">Mentés</button>',onOpen:function(r){r.querySelector("#v126-review-save").onclick=function(){api.communityReview(id,+r.querySelector("#v126-rating").value,r.querySelector("#v126-note").value).then(function(){closeModal();toast("Értékelés mentve.","✅");}).catch(function(e){toast("Értékelés: "+errText(e),"⚠️");});};}});}
function bindCommunity(root){if(!root||root.__v126CommunityBound)return;root.__v126CommunityBound=true;root.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-v126-open],[data-v126-fav],[data-v126-review],[data-v126-report]");if(!b)return;var id=b.dataset.v126Open||b.dataset.v126Fav||b.dataset.v126Review||b.dataset.v126Report;if(b.dataset.v126Open)return communityOpen(id);var api=cloud();if(!api){toast("A közösségi cloud jelenleg nem érhető el.","☁️");return;}if(b.dataset.v126Fav){if(!ownUser()){toast("Mentéshez jelentkezz be.","🔐");return;}api.communityFavorite(id).then(function(active){toast(active?"Túra elmentve a kedvencek közé.":"Túra eltávolítva a kedvencekből.",active?"♡":"✓");}).catch(function(x){toast("Mentés: "+errText(x),"⚠️");});return;}if(b.dataset.v126Review)return review(id);if(b.dataset.v126Report){if(!ownUser()){toast("Jelentéshez jelentkezz be.","🔐");return;}openModal({title:"⚑ Hibát jelentek",body:'<label class="f">Ok</label><select class="input" id="v126-reason"><option>Útvonal nem járható</option><option>Hibás adat</option><option>Veszélyes szakasz</option><option>Hibás kezdőpont</option><option>Nem megfelelő GPX</option></select><label class="f">Részletek</label><textarea class="input" id="v126-report-details" rows="3"></textarea>',footer:'<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="v126-report-send">Jelentés küldése</button>',onOpen:function(r){r.querySelector("#v126-report-send").onclick=function(){api.communityReport(id,r.querySelector("#v126-reason").value,r.querySelector("#v126-report-details").value).then(function(){closeModal();toast("Köszönjük, a jelentés rögzítve.","✅");}).catch(function(x){toast("Jelentés: "+errText(x),"⚠️");});};}});}});}
VIEWS.communityTours=function(){return '<div class="wrap pub-section v126-community-page"><div class="sect-head"><div><span class="eyebrow">Közösség · saját GPS-felvételek</span><h1 class="mb0">Közösségi túrák</h1></div><a class="btn btn-primary" href="#/turaim">Saját túráim</a></div><p class="muted">Csak a készítő által nyilvánossá tett saját túrák jelennek meg itt. A forrásból származó útvonalak külön, „Ellenőrzött forrásból” jelöléssel szerepelnek.</p><div id="v126-community-list" class="grid g2"></div></div>'+footer();};
VIEWS.communityTours.after=function(root){fetchCommunity(root);bindCommunity(root);};
var _tour=VIEWS.tours,_tourA=VIEWS.tours&&VIEWS.tours.after;VIEWS.tours=function(){return _tour();};VIEWS.tours.after=function(root){if(_tourA)_tourA(root);bindOwn(root);};
var _live=VIEWS.liveTour,_liveA=VIEWS.liveTour&&VIEWS.liveTour.after;VIEWS.liveTour=function(id){return _live(id);};
/* A live view wrapper is deliberately DOM-based: it leaves the V120 render and controls intact. */
VIEWS.liveTour.after=function(root,id){if(_liveA)_liveA(root,id);var t=Store.getTour(id);if(!t||!t.liveTrack||t.liveTrack.status!=="finished")return;var host=root.querySelector(".v120-controls");if(!host||root.querySelector("[data-v126-save-live]"))return;host.insertAdjacentHTML("afterend",'<div class="card panel v126-live-save"><h3>Mentés a túráim közé</h3><p class="small muted">A rögzített GPS-track alapból privát marad.</p><button class="btn btn-soft" data-v126-save-live>☁️ Mentés a túráim közé</button></div>');root.querySelector("[data-v126-save-live]").onclick=function(){saveAction(t,this);};};
var _home=VIEWS.home,_homeA=VIEWS.home&&VIEWS.home.after;VIEWS.home=function(){var html=_home();var sec='<section class="pub-section v126-home-community"><div class="sect-head"><div><span class="eyebrow">Valódi felhasználói felvételek</span><h2 class="mb0">Túrázz másokkal</h2></div><a class="sect-more" href="#/kozossegi">Közösségi túrák →</a></div><div id="v126-home-community-list" class="grid g3"><div class="empty"><span class="em-ico">🌲</span><p>Még nincs nyilvános közösségi túra.</p></div></div></section>';return html.replace('<footer class="pub-foot"',sec+'<footer class="pub-foot"');};VIEWS.home.after=function(root){if(_homeA)_homeA(root);var host=root.querySelector("#v126-home-community-list");if(!host)return;var api=cloud();if(!api)return;api.communityList().then(function(rows){var arr=(rows||[]).filter(function(x){return x.visibility==="public";}).slice(0,3);if(arr.length)host.innerHTML=arr.map(card).join("");bindCommunity(root);}).catch(function(){});};
window.V126Community={version:V126_VERSION,saveTourCloud:saveTourCloud,setVisibility:setVisibility,load:function(){return cloud()?cloud().communityList():Promise.resolve([])} };
})();
