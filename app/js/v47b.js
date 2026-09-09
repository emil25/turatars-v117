/* ============ V47b — 🗺️ routes page + hook integrations (workspace, inbox, review, túra mód) ============ */
(function(){
"use strict";
function n0(v){ return v==null?0:(+v||0); }
function fKm(x){ return (Math.round(n0(x)*10)/10).toFixed(1).replace(".",",")+" km"; }
function rAll(){ var d=Store.myData(); if(!d.routes) d.routes=[]; return d.routes; }
function rGet(id){ id=String(id); return rAll().find(function(x){ return x.id===id; }); }
function escA(x){ return esc(x==null?"":String(x)); }
function routesRefresh(){ return rtRefresh(); }
window.routesRefresh=routesRefresh;
function rtRefresh(){ if(String(location.hash||"").indexOf("#/utvonalak")===0){ if(window.render) render(); else if(typeof App!=="undefined") App.render(); } }
window.rtRefresh=rtRefresh;

/* ---------- 🗺️ Saját útvonalaim oldal ---------- */
VIEWS.routes = function(){ var R=rAll();
  return dash("#/utvonalak")('<div class="dash-top"><div><h1>🗺️ Saját útvonalaim</h1>'+
    '<p class="small muted" style="margin:.15rem 0 0">Valódi GPX fájlok — távolság, szint és profil a tényleges track pontokból. Mindegyik privát.</p></div>'+
    '<button class="btn btn-primary" id="rt-import">🗺️ GPX import</button></div>'+
    (R.length? '<div class="rt-cards">'+R.map(function(r){ var trip=r.linkedTripId?Store.getTour(r.linkedTripId):null;
      return '<article class="card rt-card" data-rt="'+r.id+'">'+
        '<div class="rt-ic">🗺️</div><div class="rt-main"><b>'+escA(r.name)+'</b>'+
        '<div class="small muted">'+fKm(r.distance_km)+' · ⛰️ +'+fM0(r.elevation_gain_m)+' m'+(trip?' · 🥾 '+escA(trip.title):'')+' · 📥 '+new Date(r.created_at).toLocaleDateString("hu-HU")+'</div>'+
        '<div class="rt-row"><button class="btn btn-soft btn-sm" data-open="'+r.id+'">Megnyitás</button>'+
        (trip?'<a class="btn btn-ember btn-sm" href="#/tura/'+trip.id+'">🥾 Túra</a>':'')+'<span class="spacer"></span><button class="btn btn-ghost btn-sm" data-exp="'+r.id+'">⬇️</button><button class="btn btn-ghost btn-sm" data-del="'+r.id+'">🗑</button></div>'+
        '</div></article>'; }).join("")+'</div>'
      : '<div class="empty"><span class="em-ico">🗺️</span><h3>Még nincs importált útvonalad</h3>'+
        '<p>Húzz be egy .gpx fájlt — a távolságot, szinteket és profilt a valódi track pontokból számoljuk, semmit nem találunk ki.</p>'+
        '<button class="btn btn-primary" id="rt-import-empty">🗺️ GPX import most</button></div>')+
    '</div>'); };
function fM0(x){ return x==null?"0":String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," "); }
VIEWS.routes.after = function(root){ var R=rAll();
  var b=root.querySelector("#rt-import")||root.querySelector("#rt-import-empty");
  if(b) b.onclick=function(){ window.openGPXImport({}); };
  root.querySelectorAll("[data-open]").forEach(function(x){ x.onclick=function(){ window.__rtopen(x.dataset.open); }; });
  root.querySelectorAll("[data-exp]").forEach(function(x){ x.onclick=function(){ var r=rGet(x.dataset.exp); if(r) window.__rtexport&&window.__rtexport(r);
    else { var rr=rGet(x.dataset.exp); /* fallback */ } }; });
  root.querySelectorAll("[data-del]").forEach(function(x){ x.onclick=function(){ var r=rGet(x.dataset.del); if(!r) return;
    var t=r.linkedTripId?Store.getTour(r.linkedTripId):null;
    confirmDlg("Biztosan törlöd: "+r.name+"?"+(t?" A(t) \""+t.title+"\" túra MEGMARAD.":""),"Törlés",function(){
      var d=Store.myData(); d.routes=(d.routes||[]).filter(function(y){return y.id!==r.id;});
      (d.tours||[]).forEach(function(tt){ if(tt.routeId===r.id){ tt.routeId=null; } });
      Store.save(); toast("Útvonal törölve — a túra érintetlen","🗑"); rtRefresh(); }); }; });
  root.querySelectorAll("[data-rt]").forEach(function(c){ c.onclick=function(e){ if(e.target.closest("button,a")) return; window.__rtopen(c.dataset.rt); }; }); };

/* export reachable (v47 belső exportRoute helyett újrahasznosítunk) */
window.__rtexport=function(r){ var pts=r.track||[], seg="", i;
  for(i=0;i<pts.length;i++){ var p=pts[i]; seg+='      <trkpt lat="'+p[0]+'" lon="'+p[1]+'">'+(p[2]!=null?"<ele>"+p[2]+"</ele>":"")+(p[3]?"<time>"+p[3]+"</time>":"")+"</trkpt>\n"; }
  var txt=r.raw||("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx version=\"1.1\" creator=\"Turatars\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n  <metadata><name>"+escA(r.name)+"</name></metadata>\n<trk><name>"+escA(r.name)+"</name><trkseg>\n"+seg+"</trkseg></trk>\n</gpx>");
  var a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([txt],{type:"application/gpx+xml"}));
  a.download=String(r.name||"utvonal").replace(/[^\w]+/g,"_").slice(0,40)+".gpx"; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },700);
  toast(r.raw?"Eredeti GPX letöltve (az adat változatlan)":"Letöltve a mentett trackből","⬇️"); };

/* ---------- workspace Útvonal fül: GPX kártya / import gomb ---------- */
var _wA47 = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ try{ _wA47 && _wA47(root,id); }catch(e){}
  var t=Store.getTour(id); if(!t||!root) return;
  try{
    var rvw=root.querySelector("#btn-rvw"); if(rvw) rvw.onclick=function(){ try{ (window.tourReview||tourReview)(t); }catch(e){} };
    var gp=root.querySelector("#btn-wx"); if(gp && t.routeId && !gp.__rt){ /* időjárás marad */ }
    var grid=root.querySelector(".ws-grid")||root.querySelector("#view .ws-grid")||null;
    if(String(wsTab)!=="utvonal") return;
    var act=root.querySelector(".ws-actions");
    if(t.routeId && act && !root.querySelector("#rt-ws-open")){ var r=rGet(t.routeId);
      if(r){ var bo=document.createElement("button"); bo.className="btn btn-soft btn-sm"; bo.id="rt-ws-open";
        bo.innerHTML="🗺️ Részletek"; bo.onclick=function(){ window.__rtopen(r.id); }; act.appendChild(bo); } }
    if(!t.routeId && act && !root.querySelector("#rt-ws-import")){ var bi=document.createElement("button"); bi.className="btn btn-soft btn-sm";
      bi.id="rt-ws-import"; bi.innerHTML="🗺️ GPX import"; bi.onclick=function(){ window.openGPXImport({tripId:id}); }; act.appendChild(bi); }
    /* ha van route: a ⬇️ GPX export gombot útvonal-exportra váltjuk */
    var gb=root.querySelector("#btn-gpx");
    if(gb && t.routeId){ var rr=rGet(t.routeId); if(rr) gb.onclick=function(){ window.__rtexport(rr); }; }
    /* route státusz-sáv a fül végére */
    if(t.routeId && grid && !root.querySelector(".rt-tripcard")){ var r2=rGet(t.routeId);
      if(r2){ var div=document.createElement("div"); div.className="card panel rt-tripcard";
        div.innerHTML='<h3>🗺️ GPX útvonal: '+escA(r2.name)+'</h3><p class="small mb0">'+fKm(r2.distance_km)+' · ⛰️ +'+fM0(r2.elevation_gain_m)+' m · ⬇️ -'+fM0(r2.elevation_loss_m)+' m · '+((r2.track||[]).length)+' pont (tömörítve) / '+(r2.nPts||0)+' eredeti</p>'+
        '<button class="btn btn-soft btn-sm" data-rtx="re">🔄 Új GPX cseréje</button> <button class="btn btn-ghost btn-sm" data-rtx="un">🔗 Leválasztás</button>';
        grid.appendChild(div);
        div.querySelectorAll("[data-rtx]").forEach(function(bb){ bb.onclick=function(){ var a=bb.dataset.rtx;
          if(a==="re"){ window.openGPXImport({tripId:id,replace:t.routeId}); }
          else { t.routeId=null; var r3=rGet(t.routeId); if(r3){ r3.linkedTripId=null; } Store.save(); toast("Az útvonal leválasztva — a GPX megmaradt a könyvtárban","🔗"); rtRefresh(); render(); } }; }); } }
    /* V45: túra-mód Útvonal gomb → route részletek */
  }catch(e){} };

/* ---------- V44 review: GPX kontextus sor ---------- */
var _rv47=window.tourReview;
window.tourReview=function(t){ try{ _rv47&&_rv47(t); var r=t.routeId?rGet(t.routeId):null; if(!r) return;
  var tries=0, iv=setInterval(function(){ tries++; var b=document.getElementById("rvw-body");
    if(b && b.querySelector(".rvw-head")){ clearInterval(iv); if(b.querySelector(".rvw-gpx")) return; b.insertAdjacentHTML("afterbegin",
      '<div class="rvw-gpx small" style="margin:.2rem 0 .55rem">🗺️ GPX: ez egy '+fKm(r.distance_km)+(r.elevation_gain_m?'-es, +'+fM0(r.elevation_gain_m)+' m szintemelkedés':'')+' útvonal ('+(r.nPts||0)+' pont) — az számítások ezt használják.</div>'); }
    if(tries>60) clearInterval(iv); },120); }catch(e){} };

/* ---------- V45 túra mód: Útvonal gomb GPX-re ---------- */
var _tmA47 = VIEWS.tourmode.after;
VIEWS.tourmode.after = function(root,id){ try{ _tmA47&&_tmA47(root,id); }catch(e){}
  try{ var t=(id||((location.hash.match(/turamod\/([\w-]+)/)||[])[1]))&&Store.getTour(id||location.hash.match(/turamod\/([\w-]+)/)[1]); if(!t||!t.routeId||!root) return;
    var r=rGet(t.routeId); if(!r) return;
    var b=root.querySelector('[data-tm2="utvonal"]'); if(b && !b.__rt47){ b.__rt47=1; b.onclick=function(){ window.__rtopen(r.id); }; } }catch(e){} };

window.__V47B=1; })();
