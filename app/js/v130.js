/* ============================================================
   V130 — TÚRA MÓD
   A V120/V121 valódi GPS- és offline track-kezelését használja.
   Ez a réteg a V129 túraprojektet adja át a kültéri, mobil nézetnek.
   ============================================================ */
(function(){
"use strict";

var V130_VERSION="130", v130Timer=null;

function v130Tour(id){try{return Store.getTour(String(id));}catch(e){return null;}}
function v130Live(t){return t&&t.liveTrack&&typeof t.liveTrack==="object"?t.liveTrack:null;}
function v130Esc(v){return typeof esc==="function"?esc(v==null?"":String(v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function v130Toast(s,i){if(typeof toast==="function")toast(s,i||"🥾");}
function v130Route(t){var d=Store.myData&&Store.myData(),rs=d&&d.routes;return t&&t.routeId&&Array.isArray(rs)?rs.find(function(r){return r&&r.id===t.routeId;}):null;}
function v130PlanPoints(t){
  var r=v130Route(t), raw=r&&Array.isArray(r.track)?r.track:[];
  if(raw.length>1)return raw.map(function(p){return[+p[0],+p[1]];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
  var line=t&&t.gpx&&Array.isArray(t.gpx.line)?t.gpx.line:[];
  if(line.length>1)return line.map(function(p){return[+p[0],+p[1]];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
  return [];
}
function v130PointArray(live){return(live&&Array.isArray(live.points)?live.points:[]).map(function(p){return[+p.lat,+p.lng];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});}
function v130Km(m){return((+m||0)/1000).toFixed(2).replace(".",",")+" km";}
function v130Time(ms){return typeof v120FormatTime==="function"?v120FormatTime(ms):"00:00:00";}
function v130Elevation(live){var ps=live&&live.points||[];return ps.some(function(p){return p&&p.altitude!=null&&Number.isFinite(+p.altitude);});}
function v130Current(t){var l=v130Live(t),p=l&&l.points&&l.points.length?l.points[l.points.length-1]:null;return p||null;}

function v130Summary(root,t){
  var l=v130Live(t);if(!root||!l)return;
  if(l.status==="finished"){
    t.status="teljesítve";t.projectStatus="TELJESÍTVE";t.doneAt=t.doneAt||new Date(l.finishedAt||Date.now()).toISOString().slice(0,10);t.v130CompletedAt=l.finishedAt||Date.now();try{Store.save();}catch(e){}
  }
  var active=typeof v120ActiveMs==="function"?v120ActiveMs(l):(+l.activeMs||0),total=typeof v120TotalMs==="function"?v120TotalMs(l):Math.max(0,(l.finishedAt||Date.now())-(l.startedAt||Date.now())),actual=+l.distanceM||0,plan=v130Route(t),planned=plan&&Number.isFinite(+plan.distance_km)?+plan.distance_km*1000:(+t.lengthKm||0)*1000,hasElev=v130Elevation(l);
  function set(id,text){var e=root.querySelector(id);if(e)e.textContent=text;}
  set("#v130-distance",v130Km(actual));set("#v130-total-distance",v130Km(actual));set("#v130-total",v130Time(total));set("#v130-active",v130Time(active));set("#v130-summary-active",v130Time(active));set("#v130-average",(active>0?(actual/active*3.6):0).toFixed(1)+" km/h");set("#v130-summary-average",(active>0?(actual/active*3.6):0).toFixed(1)+" km/h");set("#v130-max",(+l.maxSpeedKmh||0).toFixed(1)+" km/h");set("#v130-planned-vs-actual",planned>0?v130Km(planned)+" → "+v130Km(actual):"Nincs tervezett távadat");set("#v130-elevation",hasElev?(Math.round(+l.elevationGain||0)+" m"):
    "Nincs adat");set("#v130-points",String((l.points||[]).length));
  var status=root.querySelector("#v130-status");if(status)status.textContent=l.status==="finished"?"TÚRA TELJESÍTVE":l.status==="paused"?"SZÜNETELTETVE":"FOLYAMATBAN";
  var summary=root.querySelector("#v130-summary");if(summary)summary.hidden=l.status!=="finished";
  var share=root.querySelector("#v130-share");if(share)share.hidden=!(navigator.share&&v130Current(t));
  if(typeof v120MapDraw==="function")v120MapDraw(l.points||[]);
}

function v130Html(t){
  var l=v130Live(t), finished=l&&l.status==="finished", plan=v130Route(t), pstart=t&&t.routeStart||plan&&plan.start, pend=t&&t.routeEnd||plan&&plan.finish;
  var wrap=typeof dash==="function"?dash("#/tura/"+t.id):"";
  return wrap+'<main id="v120-root" class="v130-mode" data-v130-mode="1" data-tour-id="'+v130Esc(t.id)+'">'+
    '<div class="v130-top"><a class="small muted" href="#/tura/'+v130Esc(t.id)+'">← Túra részletei</a><span class="v130-live-badge" id="v130-status">'+(finished?"TÚRA TELJESÍTVE":l&&l.status==="paused"?"SZÜNETELTETVE":"FOLYAMATBAN")+'</span></div>'+
    '<section class="v130-title card"><div><span class="eyebrow">TÚRA MÓD</span><h1>🥾 '+v130Esc(t.title||"Saját túra")+'</h1><p class="muted mb0">'+v130Esc((pstart&&pstart.label)||t.place||"Indulási pont")+' → '+v130Esc((pend&&pend.label)||"Célpont")+'</p></div><div class="small muted">'+(navigator.onLine===false?"📱 Offline":"☁️ Helyi GPS-rögzítés")+'</div></section>'+
    '<div id="v121-offline" class="v121-offline" role="status" hidden>📱 Offline – a túra helyben mentve</div><div id="v121-offroute" class="v121-offroute" role="alert" hidden>⚠️ Letértél a tervezett útvonalról</div>'+
    '<section class="v130-map-wrap card"><div class="v130-map-legend"><span><i class="v130-dot plan"></i> Tervezett útvonal</span><span><i class="v130-dot actual"></i> Megtett útvonal</span><span><i class="v130-dot rejoin"></i> Vissza az útvonalra</span></div><div class="v120-map" id="v120-map"><div class="empty"><span class="em-ico">🗺️</span><h3>GPS-térkép</h3><p>A tervezett útvonal és a valódi GPS-nyomvonal itt jelenik meg.</p></div></div></section>'+
    '<section class="v130-stats"><div><span>MEGTETT</span><strong id="v130-distance">0,00 km</strong></div><div><span>IDŐ</span><strong id="v130-active">00:00:00</strong></div><div><span>SEBESSÉG</span><strong id="v120-speed">0,0 km/h</strong></div><div><span>ÁTLAG</span><strong id="v130-average">0,0 km/h</strong></div><div><span>GPS PONT</span><strong id="v130-points">0</strong></div><div><span>GPS PONTOSSÁG</span><strong id="v120-accuracy">Nincs adat</strong></div></section>'+
    '<section class="v130-controls v120-controls"><button class="btn btn-soft btn-lg" id="v120-pause">⏸ SZÜNET</button><button class="btn btn-primary btn-lg" id="v120-resume" hidden>▶ FOLYTATÁS</button><button class="btn btn-danger btn-lg" id="v120-finish"'+(finished?" hidden":"")+'>✅ TÚRA BEFEJEZÉSE</button></section>'+
    '<section class="v130-actions"><button class="btn btn-ghost" id="v130-locate">📍 HOL VAGYOK?</button><button class="btn btn-ghost" id="v130-rejoin">🧭 VISSZA AZ ÚTVONALRA</button><button class="btn btn-ember" id="v130-help">🆘 SEGÍTSÉG</button><button class="btn btn-ghost" id="v130-share" hidden>📍 Hely megosztása</button></section>'+
    '<section class="v130-summary card" id="v130-summary" hidden><span class="eyebrow">TELJESÍTÉSI ÖSSZEGZÉS</span><h2>🥾 TÚRA TELJESÍTVE</h2><div class="v130-summary-grid"><div><span>Megtettem</span><b id="v130-total-distance">0,00 km</b></div><div><span>Teljes idő</span><b id="v130-total">00:00:00</b></div><div><span>Mozgásban</span><b id="v130-summary-active">00:00:00</b></div><div><span>Átlagsebesség</span><b id="v130-summary-average">0,0 km/h</b></div><div><span>Legnagyobb sebesség</span><b id="v130-max">Nincs adat</b></div><div><span>Szintemelkedés</span><b id="v130-elevation">Nincs adat</b></div></div><p class="small muted">Tervezett → tényleges táv: <b id="v130-planned-vs-actual">Nincs adat</b></p><div class="flex wrap" style="gap:.5rem"><button class="btn btn-primary" id="v130-journal">📖 Élmény mentése</button><a class="btn btn-soft" href="#/tura/'+v130Esc(t.id)+'">Vissza a túratervhez</a></div></section>'+
    '</main>';
}

function v130Coords(t){var p=v130Current(t);return p&&Number.isFinite(+p.lat)&&Number.isFinite(+p.lng)?p:null;}
function v130Copy(t){var p=v130Coords(t);if(!p){v130Toast("Még nincs elérhető GPS-pozíció.","📍");return;}var text=Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6);var done=function(){v130Toast("A koordináták a vágólapra kerültek.","📋");};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){done();});}else{var a=document.createElement("textarea");a.value=text;document.body.appendChild(a);a.select();try{document.execCommand("copy");}catch(e){}a.remove();done();}}
function v130Locate(t){var p=v130Coords(t),m=window.__V120_MAP;if(!p){v130Toast("Még nincs GPS-pozíció.","📍");return;}if(m&&m.setView)m.setView([p.lat,p.lng],Math.max(m.getZoom?m.getZoom():15,15));v130Copy(t);}
function v130Help(t){var p=v130Coords(t),text=p?Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6):"Nincs elérhető GPS-pozíció.";openModal({title:"🆘 Segítség",body:'<p class="mt0">A Túratárs nem indít automatikus segélyhívást.</p><div class="card panel"><b>Jelenlegi koordináták</b><p class="mono" id="v130-help-coords">'+v130Esc(text)+'</p><p class="small muted">Pontosság: '+(p&&p.accuracy!=null?"±"+Math.round(p.accuracy)+" m":"Nincs adat")+'</p></div>',footer:'<div class="flex wrap" style="gap:.5rem"><button class="btn btn-soft" id="v130-help-copy">📋 Koordináták másolása</button><button class="btn btn-ghost" id="v130-help-close" data-close>Bezárás</button></div>',onOpen:function(r){var b=r.querySelector("#v130-help-copy");if(b)b.onclick=function(){v130Copy(t);};}});}
function v130Share(t){var p=v130Coords(t);if(!p||!navigator.share)return;navigator.share({title:t.title||"Túra helyzete",text:"Jelenlegi túrapozíció: "+Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6),url:"https://www.openstreetmap.org/?mlat="+p.lat+"&mlon="+p.lng+"#map=16/"+p.lat+"/"+p.lng}).catch(function(){});}
function v130Rejoin(t){
  var p=v130Coords(t),plan=v130PlanPoints(t);if(!p){v130Toast("A visszaút tervezéséhez előbb kell egy GPS-pont.","📍");return;}
  if(!plan.length){v130Toast("Ehhez a túrához nincs betöltött tervezett útvonal.","🧭");return;}
  if(navigator.onLine===false){v130Toast("Offline módban az előre betöltött útvonal használható; új visszaút nem tervezhető.","📱");return;}
  var target={lat:plan[0][0],lng:plan[0][1],label:"Az útvonal kezdőpontja"};
  if(!window.V127Routing||typeof window.V127Routing.plan!=="function"){v130Toast("A valódi visszaút-tervező most nem érhető el.","🧭");return;}
  v130Toast("Valós visszaút tervezése…","🧭");window.V127Routing.plan({lat:+p.lat,lng:+p.lng,label:"Aktuális GPS-pozíció"},target,"hiking").then(function(out){var r=out&&out.routes&&out.routes[0];if(!r||!Array.isArray(r.track)||r.track.length<2)throw new Error("A szolgáltató nem adott vissza használható visszaútvonalat.");window.__V130_REJOIN_POINTS=r.track.map(function(x){return[+x[0],+x[1]];});t.liveTrack.rejoinRoute={source:"openrouteservice",createdAt:new Date().toISOString(),distanceM:r.distanceM,durationS:r.durationS};Store.save();if(typeof v120MapDraw==="function")v120MapDraw(t.liveTrack.points||[]);v130Toast("Valós visszaút készült az útvonalhoz ("+((+r.distanceM||0)/1000).toFixed(1).replace(".",",")+" km).","🧭");}).catch(function(e){v130Toast(e&&e.message?e.message:"A visszaút-tervezés nem sikerült.","🧭");});
}
function v130Journal(t){if(typeof openMemoryEditor==="function")openMemoryEditor(t,false);else NAV.to("#/naplo");}

function v130Wire(root,id){
  var t=v130Tour(id);if(!root||!t)return;
  var b=root.querySelector("#v130-locate");if(b)b.onclick=function(){v130Locate(t);};
  b=root.querySelector("#v130-help");if(b)b.onclick=function(){v130Help(t);};
  b=root.querySelector("#v130-share");if(b)b.onclick=function(){v130Share(t);};
  b=root.querySelector("#v130-rejoin");if(b)b.onclick=function(){v130Rejoin(t);};
  b=root.querySelector("#v130-journal");if(b)b.onclick=function(){v130Journal(t);};
  v130Summary(root,t);
}

/* A V120/V121 handler marad az egyetlen GPS-motor; itt csak a valós
   sebességből vezetjük le a túra mód legnagyobb sebességét. */
var baseHandle=window.v120HandlePosition;
if(typeof baseHandle==="function")window.v120HandlePosition=function(id,pos){baseHandle(id,pos);var t=v130Tour(id),l=v130Live(t);if(!l)return;l.maxSpeedKmh=Math.max(+l.maxSpeedKmh||0,+l.speedKmh||0);try{Store.save();}catch(e){}var root=document.getElementById("v120-root");if(root)v130Summary(root,t);};

var baseFinish=window.v120Finish;
if(typeof baseFinish==="function")window.v120Finish=function(id){baseFinish(id);var t=v130Tour(id),l=v130Live(t);if(!t||!l)return;t.status="teljesítve";t.projectStatus="TELJESÍTVE";t.doneAt=t.doneAt||new Date(l.finishedAt||Date.now()).toISOString().slice(0,10);t.v130CompletedAt=l.finishedAt||Date.now();try{Store.save();}catch(e){}if(typeof render==="function")render();};

var baseLive=VIEWS.liveTour,baseAfter=VIEWS.liveTour.after;
VIEWS.liveTour=function(id){var t=v130Tour(id);if(t&&window.__V129&&window.__V129.ensure){window.__V129.ensure(t);window.__V129.hydrateRoute(t);}return t?v130Html(t):baseLive(id);};
VIEWS.liveTour.after=function(root,id){
  var t=v130Tour(id),plan=v130PlanPoints(t);window.__V130_PLAN_POINTS=plan;window.__V130_REJOIN_POINTS=null;
  try{baseAfter&&baseAfter(root,id);}catch(e){}
  if(!root||!t)return;v130Wire(root,id);v130Summary(root,t);
  ["#v120-pause","#v120-resume"].forEach(function(sel){var control=root.querySelector(sel);if(!control||control.dataset.v130Wrapped)return;var prior=control.onclick;control.dataset.v130Wrapped="1";control.onclick=function(ev){if(typeof prior==="function")prior.call(this,ev);var refresh=function(){var x=v130Tour(id);if(x)v130Summary(root,x);};setTimeout(refresh,0);setTimeout(refresh,260);};});
  if(v130Timer)clearInterval(v130Timer);v130Timer=setInterval(function(){var x=v130Tour(id);if(x){v130Summary(root,x);if(x.liveTrack&&x.liveTrack.status==="finished")clearInterval(v130Timer);}},250);
};

/* A projektből induló gomb ugyanabba a V120 belépési pontba vezet. */
var wsAfter=VIEWS.workspace&&VIEWS.workspace.after;
if(wsAfter) VIEWS.workspace.after=function(root,id){wsAfter(root,id);var b=root&&root.querySelector("#v120-start");if(b)b.textContent="▶ TÚRA INDÍTÁSA";var p=root&&root.querySelector("#v129-gps-start");if(p)p.textContent="▶ TÚRA INDÍTÁSA";};

function css130(){if(document.getElementById("v130-css"))return;var s=document.createElement("style");s.id="v130-css";s.textContent='.v130-mode{max-width:980px;margin:0 auto;padding:clamp(.75rem,2vw,1.5rem) clamp(.65rem,3vw,1.25rem) 5rem;background:var(--paper)}.v130-top{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-bottom:.65rem}.v130-live-badge{font-size:.74rem;font-weight:800;letter-spacing:.1em;color:var(--leaf)}.v130-title{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:.65rem}.v130-title h1{margin:.25rem 0;font-size:clamp(1.25rem,4vw,2rem)}.v130-map-wrap{padding:.55rem;position:relative}.v130-map-wrap #v120-map{height:clamp(310px,58vh,560px);min-height:310px;border-radius:14px;overflow:hidden}.v130-map-legend{display:flex;gap:.75rem;flex-wrap:wrap;font-size:.78rem;color:var(--ink-soft);padding:.25rem .2rem .55rem}.v130-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:.2rem}.v130-dot.plan{background:var(--leaf);border:2px dashed var(--leaf)}.v130-dot.actual{background:var(--ember)}.v130-dot.rejoin{background:#3A79A8}.v130-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.55rem;margin:.7rem 0}.v130-stats>div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:.75rem .6rem;text-align:center}.v130-stats span,.v130-summary-grid span{display:block;font-size:.68rem;letter-spacing:.08em;color:var(--ink-soft);font-weight:700}.v130-stats strong{display:block;font-size:clamp(1.1rem,4vw,1.65rem);margin-top:.18rem}.v130-controls,.v130-actions{display:flex;gap:.55rem;flex-wrap:wrap;margin:.65rem 0}.v130-controls .btn{flex:1;min-height:54px}.v130-actions .btn{min-height:46px}.v130-summary{margin-top:1rem;border-left:4px solid var(--leaf)}.v130-summary h2{margin:.3rem 0 .8rem}.v130-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}.v130-summary-grid>div{padding:.55rem;background:var(--sand);border-radius:10px}.v130-summary-grid b{display:block;margin-top:.2rem}.v130-offline{margin:.5rem 0}.v130-mode .v121-offline,.v130-mode .v121-offroute{border-radius:12px;padding:.65rem .8rem;margin:.55rem 0;font-weight:700}.v130-mode .v121-offline{background:#fff3d6;color:#7a571d}.v130-mode .v121-offroute{background:#ffe2dc;color:#8c3b24}@media(max-width:600px){.v130-title{align-items:flex-start;flex-direction:column}.v130-map-wrap #v120-map{height:48vh;min-height:280px}.v130-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.v130-controls{position:sticky;bottom:.35rem;z-index:5;background:color-mix(in srgb,var(--paper) 92%,transparent);padding:.35rem 0}.v130-controls .btn{flex:1 1 45%;min-height:54px}.v130-actions .btn{flex:1 1 45%;min-height:48px}.v130-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v130-top .small{font-size:.78rem}}';document.head.appendChild(s);}
if(typeof addEventListener==="function")addEventListener("DOMContentLoaded",css130);else css130();
window.__V130={version:V130_VERSION,planPoints:v130PlanPoints,summary:v130Summary,copyCoords:v130Copy,rejoin:v130Rejoin};
})();
