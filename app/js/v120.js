/* ============================================================
   V120 — ÉLŐ TÚRA / GPS MÓD
   A meglévő Store.tours + GPX struktúrát használja; nincs külön útvonal-adatmodell.
   ============================================================ */
"use strict";

const V120_MAX_SPEED_MPS = 20;
const V120_ACCURACY_LIMIT = 120;
let v120WatchId = null;
let v120Timer = null;
let v120Map = null;
let v120MapLine = null;
let v120MapMarker = null;
let v120PlannedLine = null;
let v120PlannedStart = null;
let v120RejoinLine = null;

function v120Now(){ return Date.now(); }
function v120Point(pos){ const c=pos&&pos.coords||{}; return {lat:+c.latitude,lng:+c.longitude,timestamp:pos.timestamp||v120Now(),accuracy:c.accuracy!=null&&Number.isFinite(+c.accuracy)?+c.accuracy:null,altitude:c.altitude!=null&&Number.isFinite(+c.altitude)?+c.altitude:null}; }
function v120Distance(a,b){
  if(typeof haversine==="function") return haversine([a.lat,a.lng],[b.lat,b.lng]);
  const p=Math.PI/180,R=6371000,dLat=(b.lat-a.lat)*p,dLng=(b.lng-a.lng)*p,q=Math.sin(dLat/2)**2+Math.cos(a.lat*p)*Math.cos(b.lat*p)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(q)));
}
function v120FormatTime(ms){ const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }
function v120Live(t){ return t&&t.liveTrack&&typeof t.liveTrack==="object"?t.liveTrack:null; }
function v120ActiveMs(live,now=v120Now()){ if(!live)return 0; let out=+live.activeMs||0; if(live.status==="running"&&live.segmentStartedAt)out+=Math.max(0,now-+live.segmentStartedAt); return out; }
function v120TotalMs(live,now=v120Now()){ return !live||!live.startedAt?0:Math.max(0,(live.finishedAt||now)-live.startedAt); }
function v120Elevation(points){ let gain=0,loss=0,anchor=null; (points||[]).forEach(p=>{if(p.altitude==null)return;if(anchor==null){anchor=p.altitude;return;}const d=p.altitude-anchor;if(Math.abs(d)>=8){if(d>0)gain+=d;else loss-=d;anchor=p.altitude;}}); return {gain:Math.round(gain),loss:Math.round(loss)}; }
function v120Accept(live,point){
  if(!point||!Number.isFinite(point.lat)||!Number.isFinite(point.lng))return {ok:false,reason:"invalid"};
  if(point.accuracy!=null&&point.accuracy>V120_ACCURACY_LIMIT)return {ok:false,reason:"accuracy"};
  const points=live.points||[],prev=points[points.length-1]; if(!prev)return {ok:true,distanceM:0,speedKmh:0};
  const dt=Math.max(0,(point.timestamp-prev.timestamp)/1000),distance=v120Distance(prev,point); if(!dt)return {ok:false,reason:"timestamp"};
  const allowance=Math.max(150,V120_MAX_SPEED_MPS*dt+(point.accuracy||0)+(prev.accuracy||0)); if(distance>allowance)return {ok:false,reason:"jump",distanceM:distance};
  return {ok:true,distanceM:distance,speedKmh:distance/dt*3.6};
}
function v120GetTour(id){ return Store.getTour(String(id)); }
function v120Persist(t){ try{ Store.updateTour(t.id,{liveTrack:t.liveTrack}); return true; }catch(e){ return false; } }
function v120MapReset(){ if(v120Map){try{v120Map.remove();}catch(e){}} v120Map=null;v120MapLine=null;v120MapMarker=null;v120PlannedLine=null;v120PlannedStart=null;v120RejoinLine=null;window.__V120_MAP=null; }
function v120MapDraw(points){
  const el=document.getElementById("v120-map"), planned=Array.isArray(window.__V130_PLAN_POINTS)?window.__V130_PLAN_POINTS:[], rejoin=Array.isArray(window.__V130_REJOIN_POINTS)?window.__V130_REJOIN_POINTS:[];
  if(!el)return;
  const seed=points.length?points:planned;
  if(!seed.length)return;
  if(!v120Map&&typeof MapKit!=="undefined"&&window.L){v120Map=MapKit.make(el,{center:[seed[0].lat,seed[0].lng],zoom:16,scroll:true});if(!v120Map)return;window.__V120_MAP=v120Map;}
  if(!v120Map||!window.L)return; const line=points.map(p=>[p.lat,p.lng]);
  if(line.length){if(v120MapLine)v120MapLine.setLatLngs(line);else v120MapLine=L.polyline(line,{color:"#E07A2F",weight:5,opacity:.9}).addTo(v120Map);
    const last=points[points.length-1]; if(v120MapMarker)v120MapMarker.setLatLng([last.lat,last.lng]);else v120MapMarker=L.circleMarker([last.lat,last.lng],{radius:8,color:"#1C4A36",fillColor:"#E07A2F",fillOpacity:1}).addTo(v120Map).bindTooltip("📍 Aktuális pozíció");
  }
  const plannedLine=planned.map(p=>[p[0],p[1]]);
  if(plannedLine.length>1){if(v120PlannedLine)v120PlannedLine.setLatLngs(plannedLine);else v120PlannedLine=L.polyline(plannedLine,{color:"#1C4A36",weight:5,opacity:.75,dashArray:"10 8"}).addTo(v120Map);if(!v120PlannedStart)v120PlannedStart=L.circleMarker(plannedLine[0],{radius:7,color:"#1C4A36",fillColor:"#B9D6A7",fillOpacity:1}).addTo(v120Map).bindTooltip("🥾 Indulási pont");}
  const rejoinLine=rejoin.map(p=>[p[0],p[1]]);
  if(rejoinLine.length>1){if(v120RejoinLine)v120RejoinLine.setLatLngs(rejoinLine);else v120RejoinLine=L.polyline(rejoinLine,{color:"#3A79A8",weight:4,opacity:.9,dashArray:"5 7"}).addTo(v120Map);}
  const bounds=plannedLine.concat(rejoinLine).concat(line); if(bounds.length>1)v120Map.fitBounds(L.latLngBounds(bounds).pad(.25));else v120Map.setView(bounds[0],16);
}
function v120Stat(root,t){
  const live=v120Live(t);if(!live||!root)return;const now=v120Now(),active=v120ActiveMs(live,now),total=v120TotalMs(live,now),km=(+live.distanceM||0)/1000;
  const set=(id,text)=>{const e=root.querySelector(id);if(e)e.textContent=text;};
  set("#v120-distance",`${km.toFixed(2)} km`);set("#v120-active",v120FormatTime(active));set("#v120-total",v120FormatTime(total));set("#v120-speed",`${(+live.speedKmh||0).toFixed(1)} km/h`);set("#v120-average",`${(active>0?(+live.distanceM||0)/active*3.6:0).toFixed(1)} km/h`);set("#v120-points",String((live.points||[]).length));set("#v120-status",live.status==="running"?"Folyamatban":live.status==="paused"?"Szüneteltetve":"Befejezve");
  const p=live.points&&live.points.at(-1);set("#v120-position",p?`${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`:"Még nincs GPS-pont");set("#v120-accuracy",p&&p.accuracy!=null?`±${Math.round(p.accuracy)} m`:"—");set("#v120-elevation",`${live.elevationGain||0} m`);v120MapDraw(live.points||[]);
  const pause=root.querySelector("#v120-pause"),resume=root.querySelector("#v120-resume"),finish=root.querySelector("#v120-finish");if(pause)pause.hidden=live.status!=="running";if(resume)resume.hidden=live.status!=="paused";if(finish)finish.hidden=live.status==="finished";
}
function v120StopWatch(){if(v120WatchId!=null&&navigator.geolocation){navigator.geolocation.clearWatch(v120WatchId);v120WatchId=null;}}
function v120HandlePosition(id,pos){const t=v120GetTour(id),live=v120Live(t);if(!t||!live||live.status!=="running")return;const p=v120Point(pos),accepted=v120Accept(live,p);if(!accepted.ok)return;live.points=live.points||[];live.points.push(p);live.distanceM=(+live.distanceM||0)+(accepted.distanceM||0);live.speedKmh=accepted.speedKmh||0;const elev=v120Elevation(live.points);live.elevationGain=elev.gain;live.elevationLoss=elev.loss;live.lastPositionAt=p.timestamp;live.lastError=null;v120Persist(t);v120Stat(document.getElementById("v120-root"),t);}
function v120GeoError(err){const msg=err&&err.code===1?"A helymeghatározási engedély szükséges a túra indításához.":err&&err.code===2?"A helyzet most nem határozható meg. Ellenőrizd a GPS-t és próbáld újra.":"A GPS nem válaszol időben. Próbáld újra nyílt ég alatt.";toast(msg,"📍");}
function v120StartWatch(id){if(!navigator.geolocation){toast("Ebben a böngészőben nincs helymeghatározás.","📍");return false;}v120StopWatch();v120WatchId=navigator.geolocation.watchPosition(p=>v120HandlePosition(id,p),v120GeoError,{enableHighAccuracy:true,maximumAge:5000,timeout:15000});return true;}
function v120Begin(id){const t=v120GetTour(id);if(!t)return;window.__V120_ACTIVE_ID=t.id;try{sessionStorage.setItem("v120-active-tour",t.id);}catch(e){};if(!navigator.geolocation){toast("A túra csak valós GPS-szel indítható; ez a böngésző nem támogatja.","📍");return;}navigator.geolocation.getCurrentPosition(pos=>{const started=v120Now(),p=v120Point(pos);t.liveTrack={version:1,status:"running",startedAt:started,finishedAt:null,activeMs:0,segmentStartedAt:started,pausedAt:null,points:[],distanceM:0,speedKmh:0,elevationGain:0,elevationLoss:0,lastPositionAt:null};const accepted=v120Accept(t.liveTrack,p);if(accepted.ok){t.liveTrack.points.push(p);t.liveTrack.lastPositionAt=p.timestamp;}v120Persist(t);toast("🥾 Túra elindítva — GPS-rögzítés folyamatban","📍");NAV.to("#/tura-live/"+t.id);},v120GeoError,{enableHighAccuracy:true,maximumAge:0,timeout:15000});}
function v120Pause(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status!=="running")return;const now=v120Now();live.activeMs=v120ActiveMs(live,now);live.status="paused";live.pausedAt=now;live.segmentStartedAt=null;v120Persist(t);v120StopWatch();v120Stat(document.getElementById("v120-root"),t);}
function v120Resume(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status!=="paused")return;live.status="running";live.segmentStartedAt=v120Now();live.pausedAt=null;v120Persist(t);v120StartWatch(id);v120Stat(document.getElementById("v120-root"),t);}
function v120Finish(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status==="finished")return;const now=v120Now();live.activeMs=v120ActiveMs(live,now);live.status="finished";live.finishedAt=now;live.segmentStartedAt=null;v120StopWatch();const pts=live.points||[];if(pts.length){t.gpx={pts:pts.map(p=>({lat:p.lat,lng:p.lng,ele:p.altitude,time:new Date(p.timestamp).toISOString()})),line:pts.map(p=>[p.lat,p.lng]),elev:pts.filter(p=>p.altitude!=null).map(p=>p.altitude)};t.coords={lat:pts[0].lat,lng:pts[0].lng};}t.status="teljesítve";t.liveTrack=live;v120Persist(t);toast("📱 Helyben mentve — a Felhő-szinkronizálás külön indítható.","✅");v120MapReset();render();}
function v120LiveHTML(t){if(typeof t==="string")t=v120GetTour(t);if(!t){const active=window.__V120_ACTIVE_ID||sessionStorage.getItem("v120-active-tour");const routeId=String(location.hash||"").split("/")[2];t=v120GetTour(active||routeId);}const l=v120Live(t),finished=l&&l.status==="finished";if(!t||!l)return dash("#/turaim")(`<div class="card panel"><h2>Élő túra nem található</h2><p class="muted">A túra helyi adatait nem sikerült betölteni.</p></div>`);return dash("#/tura/"+t.id)(`<div id="v120-root" class="v120-live"><a class="small muted" href="#/tura/${t.id}" style="display:inline-block;margin-bottom:.7rem;color:var(--sky);font-weight:600">← Túra részletei</a><div class="v120-head card"><div><span class="chip ${finished?"chip-green":"chip-ember"}" id="v120-status">${finished?"Befejezve":l.status==="paused"?"Szüneteltetve":"Folyamatban"}</span><h1>🥾 ${esc(t.title)}</h1><p class="muted mb0">${finished?"Túra összesítő":"Élő GPS-rögzítés — csak valódi helyadat kerül mentésre"}</p></div><div class="small muted">📍 <span id="v120-position">${l.points&&l.points.length?`${l.points.at(-1).lat.toFixed(5)}, ${l.points.at(-1).lng.toFixed(5)}`:"Még nincs GPS-pont"}</span><br>GPS pontosság: <span id="v120-accuracy">—</span></div></div><div class="v120-map card" id="v120-map"><div class="empty"><span class="em-ico">📍</span><h3>GPS-térkép</h3><p>A rögzített útvonal itt jelenik meg.</p></div></div><div class="v120-stats grid g2 smm2"><div class="card stat-tile"><span class="st-ic">📏</span><b id="v120-distance">0.00 km</b><span>Megtett táv</span></div><div class="card stat-tile"><span class="st-ic">⏱️</span><b id="v120-active">00:00</b><span>Aktív idő</span></div><div class="card stat-tile"><span class="st-ic">⚡</span><b id="v120-speed">0.0 km/h</b><span>Aktuális sebesség</span></div><div class="card stat-tile"><span class="st-ic">📊</span><b id="v120-average">0.0 km/h</b><span>Átlagsebesség</span></div><div class="card stat-tile"><span class="st-ic">📍</span><b id="v120-points">${(l.points||[]).length}</b><span>GPS pont</span></div><div class="card stat-tile"><span class="st-ic">⛰️</span><b id="v120-elevation">${l.elevationGain||0} m</b><span>Szintemelkedés</span></div></div>${finished?`<div class="card panel v120-summary"><h2>Összesítő</h2><p class="muted">Kezdés: ${l.startedAt?new Date(l.startedAt).toLocaleString("hu-HU"):"—"}<br>Befejezés: ${l.finishedAt?new Date(l.finishedAt).toLocaleString("hu-HU"):"—"}<br>Teljes idő: <b id="v120-total">${v120FormatTime(v120TotalMs(l))}</b></p><p class="mb0">A track a túra GPX-adatában is megmaradt, a meglévő útvonal- és naplórendszer használhatja.</p></div>`:""}${!finished?`<div class="v120-controls"><button class="btn btn-soft btn-lg" id="v120-pause">⏸ Szünet</button><button class="btn btn-primary btn-lg" id="v120-resume" hidden>▶ Folytatás</button><button class="btn btn-danger btn-lg" id="v120-finish">🏁 Túra befejezése</button></div>`:`<div class="v120-controls"><a class="btn btn-primary btn-lg" href="#/tura/${t.id}">Túra részletei</a></div>`}</div>`);}
VIEWS.liveTour=v120LiveHTML;
VIEWS.liveTour.after=(root,id)=>{const t=v120GetTour(id);if(!t||!v120Live(t))return;const l=v120Live(t);v120MapReset();if(l.status==="running")v120StartWatch(id);const pause=root.querySelector("#v120-pause"),resume=root.querySelector("#v120-resume"),finish=root.querySelector("#v120-finish");if(pause)pause.onclick=()=>v120Pause(id);if(resume)resume.onclick=()=>v120Resume(id);if(finish)finish.onclick=()=>confirmDlg("A rögzített track lezáródik és összesítő készül.","Túra befejezése",()=>v120Finish(id));v120Stat(root,t);setTimeout(()=>v120MapDraw(v120Live(v120GetTour(id))?.points||[]),250);if(v120Timer)clearInterval(v120Timer);v120Timer=setInterval(()=>{const x=v120GetTour(id);if(x)v120Stat(root,x);},1000);};
const v120WorkspaceView=VIEWS.workspace;
VIEWS.workspace=(id)=>{if(!id){const routeId=String(location.hash||"").split("/")[2];if(routeId)id=routeId;}return v120WorkspaceView(id);};const v120WorkspaceAfter=VIEWS.workspace.after;
VIEWS.workspace.after=(root,id)=>{if(!id){const routeId=String(location.hash||"").split("/")[2];if(routeId)id=routeId;}v120WorkspaceAfter&&v120WorkspaceAfter(root,id);try{const t=v120GetTour(id),live=v120Live(t);if(!t)return;const host=root.querySelector(".ws-actions");if(!host||root.querySelector("#v120-start,#v120-continue"))return;if(live&&["running","paused"].includes(live.status)){const b=document.createElement("a");b.id="v120-continue";b.className="btn btn-ember btn-sm";b.href="#/tura-live/"+id;b.textContent=live.status==="paused"?"▶ Folytatás":"📍 Élő túra megnyitása";host.insertBefore(b,host.firstChild);return;}const b=document.createElement("button");b.id="v120-start";b.className="btn btn-ember btn-sm";b.textContent="🥾 Túra indítása";b.onclick=()=>v120Begin(id);host.insertBefore(b,host.firstChild);}catch(e){}};
window.addEventListener("beforeunload",e=>{try{const d=Store.myData(),active=(d&&d.tours||[]).some(t=>v120Live(t)&&["running","paused"].includes(t.liveTrack.status));if(active){e.preventDefault();e.returnValue="A túra folyamatban van — biztosan kilépsz?";return e.returnValue;}}catch(err){}});
window.__V120={haversine:v120Distance,acceptPoint:v120Accept,activeMs:v120ActiveMs,formatTime:v120FormatTime};
