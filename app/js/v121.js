/* ============================================================
   V121 — OFFLINE GPS + GPX IMPORT/EXPORT KIEGÉSZÍTÉS
   A V120 élő tracket és a V47 útvonal/GPX modellt használja.
   ============================================================ */
(function(){
"use strict";

const V121_ACTIVE_KEY = "turatars_v121_active";
let v121Online = navigator.onLine !== false;
let v121BackupTimer = null;

function v121Live(t){ return t && t.liveTrack && typeof t.liveTrack === "object" ? t.liveTrack : null; }
function v121Tour(id){ try{ return Store.getTour(String(id)); }catch(e){ return null; } }
function v121Esc(x){ return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"); }
function v121Backup(t){
  const live=v121Live(t); if(!t||!live||!['running','paused'].includes(live.status)) return;
  try{ localStorage.setItem(V121_ACTIVE_KEY,JSON.stringify({tourId:t.id,liveTrack:live,updatedAt:Date.now()})); }catch(e){}
}
function v121ReadBackup(){ try{ const raw=localStorage.getItem(V121_ACTIVE_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
function v121Hydrate(t){
  const b=v121ReadBackup(); if(!t||!b||String(b.tourId)!==String(t.id)||!b.liveTrack) return;
  const current=v121Live(t), bt=+b.updatedAt||0, ct=current&&(+current.updatedAt||0);
  if(!current || (['running','paused'].includes(current.status) && bt>ct)){ t.liveTrack=b.liveTrack; try{ Store.save(); }catch(e){} }
}
function v121Persist(t){
  try{ if(typeof Store.updateTour==="function") Store.updateTour(t.id,{liveTrack:t.liveTrack}); else Store.save();
    t.liveTrack.updatedAt=Date.now(); v121Backup(t); return true;
  }catch(e){ v121Backup(t); return false; }
}

/* V120 minden pont után ment; itt ugyanazt a mentést egészítjük ki helyi,
   tabon kívül is megmaradó biztonsági másolattal. */
if(typeof v120Persist==="function"){
  const basePersist=v120Persist;
  v120Persist=function(t){ const ok=basePersist(t); v121Backup(t); return ok; };
}
if(typeof v120Finish==="function"){
  const baseFinish=v120Finish;
  v120Finish=function(id){ baseFinish(id); try{ const t=v121Tour(id); if(t&&v121Live(t)&&v121Live(t).status==="finished") localStorage.removeItem(V121_ACTIVE_KEY); }catch(e){} };
}
function v121ActiveBackup(id){ const t=v121Tour(id); if(t) v121Backup(t); }
window.addEventListener("pagehide",function(){ try{ const d=Store.myData(); (d.tours||[]).forEach(v121Backup); }catch(e){} });

function v121OfflineText(root){
  if(!root) return;
  const t=root.querySelector("#v121-offline"); if(!t) return;
  t.hidden=v121Online;
  if(!v121Online) t.textContent="📱 Offline – a túra helyben mentve";
}
function v121OffRoute(t,point){
  const live=v121Live(t), route=t&&t.routeId?((Store.myData().routes||[]).find(function(x){return x.id===t.routeId;})):null;
  if(!live||!point||!route||!Array.isArray(route.track)||!route.track.length) return;
  let nearest=Infinity;
  route.track.forEach(function(p){
    const q={lat:+p[0],lng:+p[1]}; if(!Number.isFinite(q.lat)||!Number.isFinite(q.lng)) return;
    const d=typeof v120Distance==="function"?v120Distance(point,q):0; if(d<nearest) nearest=d;
  });
  const tolerance=Math.max(60,+point.accuracy||30);
  if(nearest>tolerance){ live.offRouteConsecutive=(+live.offRouteConsecutive||0)+1; }
  else { live.offRouteConsecutive=0; live.offRoute=false; live.offRouteDistanceM=Math.round(nearest); }
  if((+live.offRouteConsecutive||0)>=3){ live.offRoute=true; live.offRouteDistanceM=Math.round(nearest); }
  v121Persist(t);
  const root=document.getElementById("v120-root"), el=root&&root.querySelector("#v121-offroute");
  if(el){ el.hidden=!live.offRoute; if(live.offRoute) el.textContent="⚠️ Letértél az útvonalról — térj vissza a trackhez ("+live.offRouteDistanceM+" m)"; }
}
if(typeof v120HandlePosition==="function"){
  const baseHandle=v120HandlePosition;
  v120HandlePosition=function(id,pos){ baseHandle(id,pos); const t=v121Tour(id),live=v121Live(t); if(live&&live.points&&live.points.length) v121OffRoute(t,live.points[live.points.length-1]); };
}

function v121ExportLive(t){
  const live=v121Live(t), points=(live&&live.points)||[]; if(!points.length){ toast("Nincs exportálható GPS track.","📤"); return; }
  const seg=points.map(function(p){
    return '      <trkpt lat="'+Number(p.lat).toFixed(7)+'" lon="'+Number(p.lng).toFixed(7)+'">'+
      (p.altitude!=null?'<ele>'+Number(p.altitude).toFixed(2)+'</ele>':'')+
      (p.timestamp?'<time>'+v121Esc(new Date(p.timestamp).toISOString())+'</time>':'')+
      '</trkpt>';
  }).join("\n");
  const text='<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Turatars V121" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>'+v121Esc(t.title||"Élő túra")+'</name></metadata><trk><name>'+v121Esc(t.title||"Élő túra")+'</name><trkseg>\n'+seg+'\n</trkseg></trk></gpx>';
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type:"application/gpx+xml"})); a.download=(t.title||"tura").replace(/[^\w\-]+/g,"_").slice(0,48)+".gpx"; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},700); toast("GPX export elkészült","📤");
}
window.__v121ExportLive=v121ExportLive;

function v121AttachRoute(t,r){
  if(!t||!r) return;
  t.routeId=r.id; r.linkedTripId=t.id;
  if(!t.gpx && Array.isArray(r.track)) t.gpx={pts:r.track.map(function(p){return {lat:p[0],lng:p[1],ele:p[2]==null?null:p[2],time:p[3]||null};}),line:r.track.map(function(p){return [p[0],p[1]];}),elev:r.track.map(function(p){return p[2];}).filter(function(x){return x!=null;})};
  if((!t.coords||!Number.isFinite(+t.coords.lat))&&r.start) t.coords={lat:r.start.lat,lng:r.start.lng};
  Store.save(); toast("Az útvonal a túrához kapcsolva","🗺️"); render();
}
function v121RoutePicker(root,id,t){
  if(!root||!t||t.routeId) return;
  const routes=((Store.myData().routes||[])); if(!routes.length) return;
  const host=root.querySelector(".ws-actions"); if(!host||root.querySelector("#v121-route-picker")) return;
  const b=document.createElement("button"); b.id="v121-route-picker"; b.className="btn btn-soft btn-sm"; b.textContent="🗺️ Meglévő útvonal használata"; host.appendChild(b);
  b.onclick=function(){
    openModal({title:"🗺️ Válassz útvonalat",body:'<div class="v121-route-list">'+routes.map(function(r){return '<button class="v121-route-choice" data-route="'+v121Esc(r.id)+'"><b>'+v121Esc(r.name||"Útvonal")+'</b><span>'+(Number(r.distance_km||0).toFixed(1))+" km · +"+(Math.round(r.elevation_gain_m||0))+" m · "+(r.nPts||((r.track||[]).length))+" pont</span></button>";}).join("")+'</div>',footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',onOpen:function(m){m.querySelectorAll("[data-route]").forEach(function(x){x.onclick=function(){const r=routes.find(function(q){return q.id===x.dataset.route;});if(r){closeModal();v121AttachRoute(t,r);}};});}});
  };
}

/* Élő nézet kiegészítése: offline állapot, eltérés és valódi GPS-export. */
const baseLiveAfter=VIEWS.liveTour.after;
VIEWS.liveTour.after=function(root,id){
  const t=v121Tour(id); if(t) v121Hydrate(t);
  try{ baseLiveAfter&&baseLiveAfter(root,id); }catch(e){}
  if(!root||!t) return;
  const head=root.querySelector(".v120-head");
  if(head&&!root.querySelector("#v121-offline")) head.insertAdjacentHTML("afterend",'<div id="v121-offline" class="v121-offline" role="status" hidden>📱 Offline – a túra helyben mentve</div>');
  if(head&&!root.querySelector("#v121-offroute")) head.insertAdjacentHTML("afterend",'<div id="v121-offroute" class="v121-offroute" role="alert" hidden>⚠️ Letértél az útvonalról</div>');
  v121OfflineText(root);
  const live=v121Live(t);
  if(live&&live.offRoute){const e=root.querySelector("#v121-offroute");if(e){e.hidden=false;e.textContent="⚠️ Letértél az útvonalról — térj vissza a trackhez ("+(live.offRouteDistanceM||0)+" m)";}}
  const controls=root.querySelector(".v120-controls");
  if(controls&&live&&live.status==="finished"&&!root.querySelector("#v121-gpx-export")){const b=document.createElement("button");b.id="v121-gpx-export";b.className="btn btn-soft btn-lg";b.textContent="📤 GPX export";b.onclick=function(){v121ExportLive(v121Tour(id)||t);};controls.insertBefore(b,controls.firstChild);}
  if(v121BackupTimer) clearInterval(v121BackupTimer); v121BackupTimer=setInterval(function(){const x=v121Tour(id);if(x){v121Persist(x);const r=document.getElementById("v120-root");v121OfflineText(r);}},10000);
};

/* V47 útvonal-fül: az eredeti importáló marad az elsődleges, ehhez jön a
   meglévő útvonal kiválasztása és a V121 azonosítójú import gomb. */
const baseWorkspaceAfter=VIEWS.workspace.after;
VIEWS.workspace.after=function(root,id){
  try{baseWorkspaceAfter&&baseWorkspaceAfter(root,id);}catch(e){}
  const t=v121Tour(id); if(!root||!t||typeof wsTab!=="undefined"&&String(wsTab)!=="utvonal") return;
  const actions=root.querySelector(".ws-actions"); if(actions&&!root.querySelector("#v121-gpx-import")){
    const b=document.createElement("button"); b.id="v121-gpx-import"; b.className="btn btn-soft btn-sm"; b.textContent="📂 GPX importálása"; b.onclick=function(){window.openGPXImport&&window.openGPXImport({tripId:id,replace:t.routeId||null});}; actions.appendChild(b);
  }
  v121RoutePicker(root,id,t);
};

function v121Net(){ v121Online=navigator.onLine!==false; document.querySelectorAll("#v121-offline").forEach(function(x){x.hidden=v121Online;}); }
window.addEventListener("offline",v121Net); window.addEventListener("online",v121Net);
window.__V121={exportLive:v121ExportLive,backup:v121Backup,hydrate:v121Hydrate,offline:function(){return !v121Online},offRoute:v121OffRoute};
})();
