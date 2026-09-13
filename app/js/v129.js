/* ============================================================
   V129 — Saját túra projekt
   A V128 ORS útvonalát és a meglévő Store/workspace adatmodelljét használja.
   Nincs második túra-, GPX- vagy cloud-modell.
   ============================================================ */
(function(){
"use strict";
var V129_VERSION="129";
var PACK_DEFAULTS=["Víz","Étel","Telefon","Powerbank","Esőkabát","Elsősegélycsomag","Fejlámpa","Papírzsebkendő","Személyes gyógyszerek","Térkép / GPX elérhető offline"];
var STATUS={tervezett:"TERVEZETT",keszul:"KÉSZÜLŐDIK",kesz:"INDULÁSRA KÉSZ",folyamat:"FOLYAMATBAN",teljes:"TELJESÍTVE",archiv:"ARCHIVÁLT"};
function applyStatus129(t,key){
  t.projectStatus=STATUS[key]||key||STATUS.tervezett;
  if(t.projectStatus===STATUS.teljes)t.status="teljesítve";
  else if(t.projectStatus===STATUS.archiv)t.status="archiválva";
  else if(t.projectStatus===STATUS.folyamat)t.status="folyamatban";
  else if([STATUS.tervezett,STATUS.keszul,STATUS.kesz].indexOf(t.projectStatus)>=0&&t.status!=="jelentkezve")t.status="tervezés";
}
function e129(v){if(typeof esc==="function")return esc(v==null?"":String(v));return String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function uid129(p){return Store.uid?Store.uid(p||"v129"):"v129_"+Math.random().toString(36).slice(2,10);}
function toast129(s,i){if(typeof toast==="function")toast(s,i||"🥾");}
function status129(t){
  if(t.projectStatus)return t.projectStatus;
  if(t.status==="teljesítve")return STATUS.teljes;
  if(t.status==="archiválva")return STATUS.archiv;
  if(t.status==="folyamatban"||t.liveTrack&&t.liveTrack.state&&t.liveTrack.state!=="done")return STATUS.folyamat;
  if(t.status==="közelgő"||t.date&&t.status==="jelentkezve")return STATUS.kesz;
  if(t.routeId||t.gpx||t.date)return STATUS.keszul;
  return STATUS.tervezett;
}
function ensure129(t){
  if(!t)return t;
  var changed=false;
  if(!t.projectStatus){t.projectStatus=status129(t);changed=true;}
  if(t.startTime==null){t.startTime="";changed=true;}
  if(!Array.isArray(t.projectGearIds)){t.projectGearIds=[];changed=true;}
  if(!Array.isArray(t.packList)){
    t.packList=PACK_DEFAULTS.map(function(label){return{id:uid129("pk"),label:label,checked:false,custom:false};});changed=true;
  }
  if(!t.tripType&&t.routeId){var rr=route129(t);if(rr&&rr.tripType){t.tripType=rr.tripType;changed=true;}}
  (t.participants||[]).forEach(function(p){if(!p.v129Status){p.v129Status=p.confirmed?"elfogadta":"tervezett";changed=true;}});
  if(changed)Store.save();
  return t;
}
function route129(t){var d=Store.myData&&Store.myData(),rs=d&&d.routes;return t&&t.routeId&&Array.isArray(rs)?rs.find(function(r){return r&&r.id===t.routeId;}):null;}
function hydrate129(t){
  var r=route129(t);if(!t||!r)return t;
  var changed=false, track=Array.isArray(r.track)?r.track:[];
  if(!t.routeSource){t.routeSource=r.source||"openrouteservice";changed=true;}
  if(!t.routeStart&&r.start){t.routeStart={lat:+r.start.lat,lng:+r.start.lng,label:r.start.label||t.place||"Kezdőpont"};changed=true;}
  if(!t.routeEnd&&r.finish){t.routeEnd={lat:+r.finish.lat,lng:+r.finish.lng,label:r.finish.label||"Célpont"};changed=true;}
  if(!t.tripType)t.tripType=r.tripType||r.planner&&r.planner.tripType||"one-way";
  if(!t.coords&&r.start){t.coords={lat:+r.start.lat,lng:+r.start.lng};changed=true;}
  if(!t.routeDistanceM&&Number.isFinite(+r.distanceM)){t.routeDistanceM=+r.distanceM;changed=true;}
  if(!t.routeDurationS&&Number.isFinite(+r.durationS)){t.routeDurationS=+r.durationS;changed=true;}
  if(track.length>1&&(!t.gpx||!Array.isArray(t.gpx.pts)||t.gpx.pts.length<2)){
    var pts=track.map(function(p){return{lat:+p[0],lng:+p[1],ele:Number.isFinite(+p[2])?+p[2]:null,time:p[3]||null};}).filter(function(p){return Number.isFinite(p.lat)&&Number.isFinite(p.lng);});
    var line=pts.map(function(p){return[p.lat,p.lng];});
    var elev=pts.map(function(p){return p.ele;}).filter(function(v){return Number.isFinite(v);});
    t.gpx={pts:pts,line:line,elev:elev};t.waypoints=t.waypoints&&t.waypoints.length?t.waypoints:pts.filter(function(_,i){return i%Math.max(1,Math.ceil(pts.length/6))===0;}).slice(0,6);changed=true;
  }
  if(changed)Store.save();return t;
}
function readiness129(t){
  ensure129(t);var checks=[
    ["route",!!(t.routeId||t.gpx&&t.gpx.pts&&t.gpx.pts.length>1||t.coords),"Valós útvonal"],
    ["name",!!String(t.title||"").trim(),"Túranév"],
    ["date",!!t.date,"Dátum"],
    ["start",!!t.startTime,"Indulási idő"],
    ["pack",t.packList.length>0&&t.packList.every(function(x){return x.checked;}),"Csomaglista"],
    ["equipment",!(Store.myData().equipment||[]).length||t.projectGearIds.length>0,"Saját felszerelés"],
    ["people",(t.participants||[]).length>0,"Résztvevők"],
    ["travel",!!(t.startPoint||t.meeting||t.travelMode),"Utazás"]
  ];
  var ok=checks.filter(function(x){return x[1];}).length,missing=checks.filter(function(x){return !x[1];}).map(function(x){return{k:x[0],label:x[2]};});
  return{percent:Math.round(ok/checks.length*100),missing:missing,checks:checks};
}
function cloud129(){
  try{var v=window.__V54&&window.__V54.st&&window.__V54.st();
    if(!v||!v.token||v.remoteVersion==null)return Promise.reject({error:"expected_version_required"});
    return window.__V54.api.save(window.__V54.build(v.email));
  }catch(e){return Promise.reject(e);}
}
function gpx129(t){
  var pts=t&&t.gpx&&Array.isArray(t.gpx.pts)?t.gpx.pts:[];if(pts.length<2){toast129("Nincs elérhető GPX adat.","🧭");return;}
  var body=pts.map(function(p){return'<trkpt lat="'+p.lat+'" lon="'+p.lng+'">'+(Number.isFinite(+p.ele)?'<ele>'+p.ele+'</ele>':"")+(p.time?'<time>'+e129(p.time)+'</time>':"")+"</trkpt>";}).join("");
  var xml='<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="Túratárs" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>'+e129(t.title||"Túra")+'</name></metadata><trk><name>'+e129(t.title||"Túra")+'</name><trkseg>'+body+'</trkseg></trk></gpx>';
  var a=document.createElement("a"),u=URL.createObjectURL(new Blob([xml],{type:"application/gpx+xml"}));a.href=u;a.download=(t.title||"tura").replace(/[^\w-]+/g,"_").slice(0,60)+".gpx";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove();},700);
}
function chip129(t){var s=t.projectStatus||status129(t),cl=s===STATUS.teljes?"chip-green":s===STATUS.folyamat?"chip-ember":"chip-sand";return'<span class="chip '+cl+' v129-status">'+e129(s)+"</span>";}
function panel129(t){
  var r=route129(t),rd=readiness129(t),start=t.routeStart||r&&r.start,end=t.routeEnd||r&&r.finish;
  return '<section class="card panel v129-project"><div class="flex between wrapcol"><div><span class="eyebrow">SAJÁT TÚRA PROJEKT</span><h2 style="margin:.2rem 0">🥾 '+e129(t.title)+'</h2><div class="flex" style="gap:.4rem;flex-wrap:wrap">'+chip129(t)+' <span class="chip '+(t.v129CloudState==="synced"?"chip-green":"chip-sand")+'" id="v129-cloud-status">'+(t.v129CloudState==="synced"?"☁️ Felhőbe mentve":"☁️ Cloud mentés")+'</span></div></div><div class="v129-actions"><button class="btn btn-soft btn-sm" id="v129-edit-core">✏️ Szerkesztés</button><button class="btn btn-primary btn-sm" id="v129-cloud-save">☁️ Szinkron most</button></div></div>'+ 
  '<div class="v129-meta-grid"><label class="f">Dátum<input class="input" type="date" id="v129-date" value="'+e129(t.date||"")+'"></label><label class="f">Indulási idő<input class="input" type="time" id="v129-start-time" value="'+e129(t.startTime||"")+'"></label><label class="f">Projektállapot<select class="input" id="v129-state">'+Object.keys(STATUS).map(function(k){return'<option value="'+k+'" '+(STATUS[k]===t.projectStatus?"selected":"")+'>'+STATUS[k]+"</option>";}).join("")+'</select></label><button class="btn btn-soft" id="v129-meta-save">Mentés</button></div>'+
  '<div class="v129-route-summary"><span>📍 <b>'+e129(start&&start.label||t.place||"Nincs indulási pont")+'</b></span><span>→ '+e129(end&&end.label||"Nincs célpont")+'</span><span>📏 '+e129(t.lengthKm||r&&r.distance_km||"nincs adat")+' km</span><span>⏱ '+e129(t.durationH||r&&Math.round((r.duration_s||0)/360)/10||"nincs adat")+' ó</span><span>🗺️ '+e129(t.tripType==="loop"?"Körút":"Egyirányú")+'</span></div>'+
  '<div class="v129-readiness"><div class="flex between"><b>Felkészültség</b><strong>'+rd.percent+'%</strong></div><div class="progress-strip"><i style="width:'+rd.percent+'%"></i></div><div class="small muted">'+(rd.missing.length?"Még hiányzik: "+rd.missing.map(function(x){return e129(x.label);}).join(", "):"Minden alapadat készen áll.")+'</div></div>'+
  '<div class="v129-links"><button class="btn btn-ghost btn-sm" id="v129-route-open">🗺️ Útvonal megnyitása</button><button class="btn btn-ghost btn-sm" id="v129-gpx-download">📤 GPX letöltése</button><button class="btn btn-ember btn-sm" id="v129-gps-start">🥾 Indítás GPS-szel</button></div></section>';
}
function pack129(t){
  var gear=Store.myData().equipment||[];
  return '<section class="card panel v129-pack"><div class="flex between wrapcol"><div><h3>🎒 Csomaglista</h3><p class="small muted">Csak a saját túrádhoz tartozó elemeket jelöld.</p></div><span class="chip chip-sand">'+t.packList.filter(function(x){return x.checked;}).length+'/'+t.packList.length+'</span></div><div class="v129-pack-list">'+t.packList.map(function(x){return'<label class="ck '+(x.checked?"done":"")+'"><input type="checkbox" data-v129-pack="'+e129(x.id)+'" '+(x.checked?"checked":"")+'><span contenteditable="true" data-v129-label="'+e129(x.id)+'">'+e129(x.label)+'</span><button class="icon-btn" data-v129-pack-del="'+e129(x.id)+'" aria-label="Elem törlése">✕</button></label>';}).join("")+'</div><div class="flex" style="gap:.5rem;margin-top:.7rem;flex-wrap:wrap"><input class="input" id="v129-pack-new" placeholder="Új csomagelem…"><button class="btn btn-soft btn-sm" id="v129-pack-add">＋ Hozzáadás</button></div><div class="v129-own-gear"><b>🏠 Saját felszerelésem ehhez a túrához</b>'+(gear.length?gear.map(function(g){return'<label class="ck"><input type="checkbox" data-v129-gear="'+e129(g.id)+'" '+(t.projectGearIds.indexOf(g.id)>=0?"checked":"")+'> '+e129(g.name)+'</label>';}).join(""): '<p class="small muted">Még nincs saját felszerelésed. <a href="#/felszereles">Felszerelés kezelése</a></p>')+'</div></section>';
}
function edit129(t){
  openModal({title:"✏️ Túra projekt szerkesztése",body:'<label class="f">Túra neve<input class="input" id="v129-title" value="'+e129(t.title)+'"></label><label class="f">Helyszín<input class="input" id="v129-place" value="'+e129(t.place||"")+'"></label><label class="f">Leírás<textarea class="input" id="v129-desc" rows="3">'+e129(t.desc||"")+'</textarea></label><div class="grid g2"><label class="f">Dátum<input class="input" type="date" id="v129-edate" value="'+e129(t.date||"")+'"></label><label class="f">Indulási idő<input class="input" type="time" id="v129-etime" value="'+e129(t.startTime||"")+'"></label><label class="f">Nehézség<select class="input" id="v129-diff"><option '+(t.difficulty==="Könnyű"?"selected":"")+'>Könnyű</option><option '+(t.difficulty==="Közepes"?"selected":"")+'>Közepes</option><option '+(t.difficulty==="Nehéz"?"selected":"")+'>Nehéz</option></select></label><label class="f">Becsült idő (óra)<input class="input" type="number" id="v129-duration" value="'+e129(t.durationH||"")+'"></label></div>',footer:'<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="v129-edit-save">Mentés</button>',onOpen:function(root){root.querySelector("#v129-edit-save").onclick=function(){Store.updateTour(t.id,{title:root.querySelector("#v129-title").value.trim()||t.title,place:root.querySelector("#v129-place").value.trim(),desc:root.querySelector("#v129-desc").value.trim(),date:root.querySelector("#v129-edate").value,startTime:root.querySelector("#v129-etime").value,difficulty:root.querySelector("#v129-diff").value,durationH:+root.querySelector("#v129-duration").value||0});ensure129(t);closeModal();toast129("Túra projekt mentve.","✅");render();};}});
}
function duplicate129(t){
  var clone=JSON.parse(JSON.stringify(t));delete clone.id;clone.title=(t.title||"Túra")+" – másolat";clone.date="";clone.startTime="";clone.status="tervezés";clone.projectStatus=STATUS.tervezett;clone.createdAt=new Date().toISOString();clone.doneAt=null;clone.liveTrack=null;clone.shareCode=null;clone.journal=null;
  delete clone.journal;clone.packList=(t.packList||[]).map(function(x){return Object.assign({},x,{id:uid129("pk"),checked:false});});clone.projectGearIds=(t.projectGearIds||[]).slice();
  var out=Store.newTourFromDraft(clone);if(out){ensure129(out);hydrate129(out);Store.save();toast129("Túra projekt lemásolva.","📋");NAV.to("#/tura/"+out.id);}
}
function wire129(root,id){
  var t=Store.getTour(id);if(!t)return;ensure129(t);hydrate129(t);
  var save=root.querySelector("#v129-meta-save");if(save)save.onclick=function(){var s=root.querySelector("#v129-state");t.date=root.querySelector("#v129-date").value;t.startTime=root.querySelector("#v129-start-time").value;applyStatus129(t,(s&&s.value)||"tervezett");Store.save();toast129("Projektadatok mentve.","✅");render();};
  var ed=root.querySelector("#v129-edit-core");if(ed)ed.onclick=function(){edit129(t);};
  var cloud=root.querySelector("#v129-cloud-save");if(cloud)cloud.onclick=function(){cloud129().then(function(res){if(res&&res.error)throw res;t.v129CloudState="synced";Store.save();var cs=root.querySelector("#v129-cloud-status");if(cs){cs.textContent="☁️ Felhőbe mentve";cs.className="chip chip-green";}toast129("Felhőbe mentve.","☁️");}).catch(function(err){var cs=root.querySelector("#v129-cloud-status");if(cs){cs.textContent="📱 Helyben mentve";cs.className="chip chip-sand";}toast129(err&&err.error==="expected_version_required"?"A felhőben lévő adat betöltése után menthetsz új verziót.":"Helyben mentve – a felhő most nem érhető el.","📱");});};
  var ro=root.querySelector("#v129-route-open");if(ro)ro.onclick=function(){wsTab="utvonal";render();};
  var gd=root.querySelector("#v129-gpx-download");if(gd)gd.onclick=function(){gpx129(t);};
  var gs=root.querySelector("#v129-gps-start");if(gs)gs.onclick=function(){if(typeof window.v120Begin==="function")window.v120Begin(t.id);else toast129("A GPS-túra indítása nem érhető el.","📍");};
  root.querySelectorAll("[data-v129-pack]").forEach(function(cb){cb.onchange=function(){var x=t.packList.find(function(p){return p.id===cb.dataset.v129Pack;});if(x){x.checked=cb.checked;Store.save();render();}};});
  root.querySelectorAll("[data-v129-label]").forEach(function(el){el.onblur=function(){var x=t.packList.find(function(p){return p.id===el.dataset.v129Label;});if(x){x.label=el.textContent.trim()||x.label;Store.save();}};});
  root.querySelectorAll("[data-v129-pack-del]").forEach(function(b){b.onclick=function(){t.packList=t.packList.filter(function(x){return x.id!==b.dataset.v129PackDel;});Store.save();render();};});
  var add=root.querySelector("#v129-pack-add");if(add)add.onclick=function(){var i=root.querySelector("#v129-pack-new"),v=i&&i.value.trim();if(!v)return;t.packList.push({id:uid129("pk"),label:v,checked:false,custom:true});Store.save();render();};
  root.querySelectorAll("[data-v129-gear]").forEach(function(cb){cb.onchange=function(){var idg=cb.dataset.v129Gear;if(cb.checked&&t.projectGearIds.indexOf(idg)<0)t.projectGearIds.push(idg);if(!cb.checked)t.projectGearIds=t.projectGearIds.filter(function(x){return x!==idg;});Store.save();render();};});
  if(wsTab==="resztvevok")root.querySelectorAll("[data-pconf]").forEach(function(b){b.onclick=function(){var p=t.participants.find(function(x){return x.id===b.dataset.pconf;});if(!p)return;var order=["tervezett","meghívva","elfogadta","lemondta"],i=order.indexOf(p.v129Status||"tervezett");p.v129Status=order[(i+1)%order.length];p.confirmed=p.v129Status==="elfogadta";p.stat=p.v129Status;Store.save();render();};});
}
function wrapWorkspace(){
  var base=VIEWS.workspace,after=VIEWS.workspace.after;
  VIEWS.workspace=function(id){var t=Store.getTour(id);if(t){ensure129(t);hydrate129(t);}return base(id);};
  VIEWS.workspace.after=function(root,id){var t=Store.getTour(id);if(t){ensure129(t);hydrate129(t);}if(after)after(root,id);if(!t)return;var head=root.querySelector(".ws-head");if(head&&!root.querySelector(".v129-project"))head.insertAdjacentHTML("afterend",panel129(t));var body=root.querySelector("#ws-body");if(wsTab==="attekintes"&&body&&!body.querySelector(".v129-pack"))body.insertAdjacentHTML("beforeend",pack129(t));wire129(root,id);var profile=root.querySelector(".ws-grid .card h3");if(wsTab==="utvonal"&&t.gpx&&(!t.gpx.elev||!t.gpx.elev.length)){root.querySelectorAll("svg").forEach(function(svg){var card=svg.closest(".card");if(card)card.innerHTML='<h3>⛰️ Magassági profil</h3><p class="muted small mb0">Szintadat jelenleg nem érhető el.</p>';});}};
}
function wrapTours(){
  var base=VIEWS.tours,after=VIEWS.tours.after;
  VIEWS.tours=function(){return base();};
  VIEWS.tours.after=function(root){if(after)after(root);root.querySelectorAll("[data-tour-id]").forEach(function(row){var id=row.dataset.tourId,t=Store.getTour(id);if(!t)return;ensure129(t);var meta=row.querySelector(".meta");if(meta&&!meta.querySelector(".v129-status"))meta.insertAdjacentHTML("afterbegin",chip129(t));var actions=row.querySelector(".tr-actions");if(actions&&!actions.querySelector("[data-v129-duplicate]")){var b=document.createElement("button");b.className="btn btn-ghost btn-sm";b.dataset.v129Duplicate=id;b.textContent="📋 Duplikálás";b.onclick=function(){duplicate129(Store.getTour(id));};actions.appendChild(b);}});};
}
function css129(){if(document.getElementById("v129-css"))return;var s=document.createElement("style");s.id="v129-css";s.textContent='.v129-project{margin:14px 0;border-left:4px solid var(--leaf)}.v129-meta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.65rem;margin-top:1rem}.v129-route-summary{display:flex;gap:.65rem;flex-wrap:wrap;margin:.9rem 0;padding:.7rem;border-radius:12px;background:var(--sand)}.v129-readiness{max-width:620px}.v129-readiness .progress-strip{height:9px;margin:.35rem 0}.v129-links,.v129-actions{display:flex;gap:.45rem;flex-wrap:wrap}.v129-pack{margin-top:14px}.v129-pack-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.25rem}.v129-pack-list .ck{min-height:42px}.v129-own-gear{margin-top:1rem;padding-top:.7rem;border-top:1px solid var(--line)}.v129-own-gear .ck{display:inline-flex;margin:.3rem .6rem .1rem 0}@media(max-width:700px){.v129-meta-grid{grid-template-columns:1fr 1fr}.v129-pack-list{grid-template-columns:1fr}.v129-project .btn{min-height:44px}.v129-route-summary{font-size:.88rem}}';document.head.appendChild(s);}
wrapWorkspace();wrapTours();
try{var baseNew=Store.newTourFromDraft;Store.newTourFromDraft=function(dr){var t=baseNew(dr);ensure129(t);hydrate129(t);Store.save();return t;};}catch(e){}
window.__V129={version:V129_VERSION,ensure:ensure129,hydrateRoute:hydrate129,readiness:readiness129,cloudSave:cloud129};
if(typeof addEventListener==="function")addEventListener("DOMContentLoaded",css129);else if(typeof document!=="undefined")css129();
})();
