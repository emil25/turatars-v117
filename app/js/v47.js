/* ============ V47 — 🗺️ GPX IMPORT + ÚTVONALKEZELÉS (a Trip Project részeként) ============ */
(function(){
"use strict";

/* ---------- segédek ---------- */
function n0(v){ return v==null?0:(+v||0); }
function escA(x){ return esc(x==null?"":String(x)); }
function haversine(a,b){ var R=6371000,p=Math.PI/180,dLat=(b[0]-a[0]),dLon=(b[1]-a[1]);
  var f=function(d){return d*p/2;}; var s=Math.sin(f(dLat))*Math.sin(f(dLat))+Math.cos(a[0]*p)*Math.cos(b[0]*p)*Math.sin(f(dLon))*Math.sin(f(dLon));
  return 2*R*Math.asin(Math.min(1,Math.sqrt(s))); }
function downsample(arr,max){ if(arr.length<=max) return arr.slice(); var out=[],i,step=arr.length/(max-1);
  for(i=0;i<max-1;i++) out.push(arr[Math.floor(i*step)]); out.push(arr[arr.length-1]); return out; }

/* ---------- GPX parser (valódi XML; nem talál ki adatot) ---------- */
function parseGPX(text){
  var doc; try{ doc=new DOMParser().parseFromString(String(text||""),"application/xml"); }catch(e){ return {err:"xml"}; }
  if(!doc||doc.getElementsByTagName("parsererror").length) return {err:"xml"};
  var all=[], wpts=[], name=null;
  var trk=doc.getElementsByTagName("trk");
  if(trk.length){ var nm=trk[0].getElementsByTagName("name"); if(nm.length&&nm[0].textContent) name=nm[0].textContent.trim().slice(0,80); }
  var meta=doc.getElementsByTagName("metadata"); if(!name&&meta.length){ var mn=meta[0].getElementsByTagName("name"); if(mn.length&&mn[0].textContent) name=mn[0].textContent.trim().slice(0,80); }
  var tp=doc.getElementsByTagName("trkpt");
  for(var i=0;i<tp.length;i++){
    var lat=parseFloat(tp[i].getAttribute("lat")), lng=parseFloat(tp[i].getAttribute("lon"));
    if(isNaN(lat)||isNaN(lng)) continue;
    var ele=[], tm=[];
    try{ ele=tp[i].getElementsByTagName("ele"); tm=tp[i].getElementsByTagName("time"); }catch(e){}
    var e=ele.length?parseFloat(ele[0].textContent):null; if(isNaN(e)) e=null;
    all.push([lat,lng,e, tm.length?String(tm[0].textContent||"").trim():null]);
  }
  var wp=doc.getElementsByTagName("wpt");
  for(var j=0;j<wp.length;j++){
    var wl=parseFloat(wp[j].getAttribute("lat")), wg=parseFloat(wp[j].getAttribute("lon"));
    if(isNaN(wl)||isNaN(wg)) continue;
    var wn=wp[j].getElementsByTagName("name"), we=wp[j].getElementsByTagName("ele");
    var wel=we.length?parseFloat(we[0].textContent):null; if(isNaN(wel)) wel=null;
    wpts.push({lat:wl,lng:wg,name:(wn.length?String(wn[0].textContent||"").trim().slice(0,60):"wp"+(j+1)),ele:wel});
  }
  if(!all.length&&wpts.length) return {err:"notrack",wpts:wpts,name:name};
  if(!all.length) return {err:"notrack",wpts:wpts,name:name};
  return {pts:all,wpts:wpts,name:name};
}

/* ---------- statisztikák a track pontokból ---------- */
function routeStats(pts){
  var i,dm=0; for(i=1;i<pts.length;i++) dm+=haversine([pts[i-1][0],pts[i-1][1]],[pts[i][0],pts[i][1]]);
  var els=[]; for(i=0;i<pts.length;i++) if(pts[i][2]!=null) els.push(pts[i][2]);
  var gain=0, loss=0;
  if(els.length>1){ var anchor=els[0], BAND=8;
    for(i=1;i<els.length;i++){ var dd=els[i]-anchor; if(Math.abs(dd)>=BAND){ if(dd>0)gain+=dd; else loss-=dd; anchor=els[i]; } } }
  var mn=els.length?Math.ceil(Math.min.apply(null,els)):null, mx=els.length?Math.floor(Math.max.apply(null,els)):null;
  return { n:pts.length, km:dm/1000, gain:Math.round(gain), loss:Math.round(loss),
    max:mx, min:mn, hasEle:els.length>1,
    start:{lat:pts[0][0],lng:pts[0][1]},
    finish:{lat:pts[pts.length-1][0],lng:pts[pts.length-1][1]} };
}
function fpOf(name,st,size){ return [String(name||"").trim().toLowerCase(), st.n,
  String(st.start.lat.toFixed(5)), String(st.start.lng.toFixed(5)),
  String(st.finish.lat.toFixed(5)), String(st.finish.lng.toFixed(5)), Math.round(size/4096)].join("|"); }

/* ---------- tárolás (d.routes, query-safe) ---------- */
function rAll(){ var d=Store.myData(); if(!d.routes) d.routes=[]; return d.routes; }
function rGet(id){ id=String(id); return rAll().find(function(x){ return x.id===id; }); }
function rFindFp(fp){ return rAll().find(function(x){ return x.fp===fp; }); }
function rSave(r){ var d=Store.myData(); if(!d.routes) d.routes=[]; r.updated_at=new Date().toISOString();
  var i=d.routes.findIndex(function(y){ return y.id===r.id; });
  if(i>-1) d.routes[i]=Object.assign(d.routes[i],r); else d.routes.unshift(r);
  try{ Store.save(); }catch(e){ var raw=r.raw; delete r.raw; try{ Store.save(); }catch(e2){ if(raw)r.raw=raw; toast("A könyvtár tele — törölj régi útvonalakat","🗺️"); return false; } }
  return true; }
function rDelete(id){ var d=Store.myData(); id=String(id);
  (d.tours||[]).forEach(function(t){ if(t.routeId===id){ t.routeId=null; } });
  d.routes=(d.routes||[]).filter(function(x){ return x.id!==id; }); Store.save(); }

/* ---------- formázás ---------- */
function fKm(x){ return (Math.round(x*10)/10).toFixed(1).replace(".", ",")+" km"; }
function fM(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," "); }

/* ---------- térkép + profil ---------- */
function profileSVG(track){ var vals=[]; for(var i=0;i<track.length;i++) if(track[i][2]!=null) vals.push(track[i][2]);
  if(vals.length<3) return '<p class="small muted mt0 mb0">⛰️ Magassági profilhoz elevation kell — nem becsüljük meg.</p>';
  var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), W=560, H=110;
  var sm=downsample(vals,220), pts=sm.map(function(v,i){ var x=8+(i/(sm.length-1))*(W-16), y=H-((v-mn)/((mx-mn)||1))*(H-20)-8; return x.toFixed(1)+","+y.toFixed(1); }).join(" ");
  return '<div class="rt-prof"><svg viewBox="0 0 '+W+' '+(H+26)+'" style="width:100%;height:auto" role="img" aria-label="magassági profil">'+
    '<polygon points="'+pts+' '+(W-8)+','+(H+2)+' 8,'+(H+2)+'" fill="#E7F0E2"/>'+
    '<polyline points="'+pts+'" fill="none" stroke="#2F6B4A" stroke-width="2.5"/></svg>'+
    '<div class="small muted" style="display:flex;justify-content:space-between"><span>🟢 '+fM(mn)+' m</span><span>🔝 '+fM(mx)+' m</span><span>🏁</span></div></div>'; }
function mapInto(el, r){ try{ if(!el) return false; var map=(typeof MapKit!=="undefined"&&MapKit.make)?MapKit.make(el,{zoom:11}):null; if(!map) return false;
  var t=r.track||[]; if(!t.length) return false; var ll=t.map(function(p){return [p[0],p[1]];});
  if(typeof L!=="undefined"){ if(ll.length>1) L.polyline(ll,{color:"#2C6E9B",weight:4,opacity:.9}).addTo(map);
    L.circleMarker(ll[0],{radius:6,color:"#1C4A36",fillColor:"#2F6B4A",fillOpacity:1}).addTo(map).bindTooltip("🟢 Start");
    L.circleMarker(ll[ll.length-1],{radius:6,color:"#8C3B24",fillColor:"#B3372A",fillOpacity:1}).addTo(map).bindTooltip("🏁 Cél");
    (r.wpts||[]).slice(0,60).forEach(function(w){ L.circleMarker([w.lat,w.lng],{radius:4,fillOpacity:1,opacity:1,color:"#E07A2F"}).addTo(map).bindTooltip(w.name||""); }); }
  return true; }catch(e){ return false; } }

/* ---------- előnézet + mentés ---------- */
function previewModal(pr,ctx){ // pr={name,stats,wpts,raw,fp,file,sizePts,track}
  var st=pr.stats;
  var html='<div class="rt-pv">'+
    '<label class="f" for="rt-name">'+escA("Útvonal neve")+'</label><input class="input" id="rt-name" value="'+escA(pr.name||"Importált útvonal").slice(0,80)+'">'+
    '<div class="rt-stats">'+
    '<span class="rt-stat">📏 <b>'+fKm(st.km)+'</b></span>'+
    '<span class="rt-stat">⛰️ <b>'+(st.hasEle?"+"+fM(st.gain)+" m":"nincs elevation")+'</b></span>'+
    '<span class="rt-stat">⬇️ <b>'+(st.hasEle?"-"+fM(st.loss)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔝 <b>'+(st.hasEle?fM(st.max)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔻 <b>'+(st.hasEle?fM(st.min)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">📍 <b>'+st.n+' pont</b></span></div>'+
    '<p class="small muted mb0">🟢 Start: '+st.start.lat.toFixed(5)+", "+st.start.lng.toFixed(5)+' &middot; 🏁 Cél: '+st.finish.lat.toFixed(5)+", "+st.finish.lng.toFixed(5)+'</p>'+
    (pr.wpts&&pr.wpts.length?'<p class="small mb0">📌 Waypointok: '+pr.wpts.length+(pr.wpts[0].name?(' — '+escA(pr.wpts.slice(0,3).map(function(w){return w.name;}).filter(Boolean).join(', '))+(pr.wpts.length>3?'…':'')):'')+'</p>':"")+
    (st.hasEle?profileSVG(downsample(pr.track,800)):"")+
    '<div class="rt-map" id="rt-pv-map"></div>'+
    '<p class="small muted" style="margin:.3rem 0 0">🔒 Privátnak jelölt útvonal — csak nálad látszik.</p>'+
    '<div class="rt-btns">'+
      '<button class="btn btn-primary" id="rt-keep">'+escA("✓ Mentés az útvonalaim közé")+'</button>'+
      (ctx&&ctx.inboxId?'<button class="btn btn-soft" id="rt-to-inbox">📥 Inbox-elemhez</button>':"")+
      (ctx&&ctx.tripId?'<button class="btn btn-ember" id="rt-to-trip">🥾 A túrához adom</button>'
        :'<button class="btn btn-ember" id="rt-new-trip">🗓️ Új túrát készítek belőle</button>'+
         '<button class="btn btn-soft" id="rt-to-trip2">📥 Hozzáad meglévő túrához</button>')+
      '<button class="btn btn-ghost" data-close>🗑️ Elvetem</button>'+
    '</div></div>';
  openModal({ title:"🗺️ Útvonal előnézet", body:html, footer:"",
    onOpen:function(m){ var nm=m.querySelector("#rt-name");
      m.querySelector("#rt-keep").onclick=function(){ var r=commitRoute(pr,nm); if(r){ closeModal(); toast((r.name||"")+" a saját útvonalaid között (privát)","🗺️"); routesRefresh(); } };
      var ni=m.querySelector("#rt-to-inbox"); if(ni) ni.onclick=function(){ var r=commitRoute(pr,nm,true); if(!r) return; var it=(Store.myData().inbox||[]).find(function(x){return x.id===ctx.inboxId;});
        if(it){ it.routeId=r.id; it.read=true; Store.save(); } closeModal(); toast("GPX hozzáadva az Inbox-elemhez 🗺️","📥"); routesRefresh(); };
      var nb=m.querySelector("#rt-new-trip"); if(nb) nb.onclick=function(){ var r=commitRoute(pr,nm,true); if(!r) return; if(r.linkedTripId&&Store.getTour(r.linkedTripId)){ closeModal(); NAV.to("#/tura/"+r.linkedTripId); toast("Ehhez az útvonalhoz már van terved","🗓️"); return; }
        var name=(nm.value.trim()||r.name); var t=Store.newTourFromDraft({title:name, place:"", region:"", date:"", status:"tervezés",
          lengthKm:r.distance_km, ascent:r.elevation_gain_m, durationH:0, coords:(r.start&&r.start.lat)?{lat:r.start.lat,lng:r.start.lng}:null,
          desc:"Importált GPX: "+fKm(r.distance_km)+(r.elevation_gain_m?" · ⛰️ +"+r.elevation_gain_m+" m":""), notes:"Forrás: GPX import", tags:["gpx"] });
        t.routeId=r.id; t.descent=r.elevation_loss_m; Store.save(); r.linkedTripId=t.id; rSave(r);
        closeModal(); toast("Túraprojekt a GPX adataival","🗓️"); NAV.to("#/tura/"+t.id); routesRefresh(); };
      var at=m.querySelector("#rt-to-trip")||m.querySelector("#rt-to-trip2"); if(at) at.onclick=function(){ var tripId=ctx&&ctx.tripId;
        var go=function(tid){ var r=commitRoute(pr,nm,true); if(!r) return; attachToTrip(r,tid); };
        if(tripId) go(tripId); else routesPickTrip(go); };
      if(typeof MapKit!=="undefined") mapInto(m.querySelector("#rt-pv-map"), pr.routeForMap||{track:pr.track,wpts:pr.wpts}); } });
}
function commitRoute(pr, nmEl, attachMode){ var name=((nmEl&&nmEl.value)||pr.name||"Importált útvonal").trim().slice(0,80)||"Importált útvonal";
  var dup=rFindFp(pr.fp); if(dup){ if(attachMode){ toast("Ez az útvonal már megvan — azt kapcsoljuk hozzá","🗺️"); return dup; }
    toast("Ez az útvonal már szerepel a saját útvonalaid között","🗺️");
    setTimeout(function(){ window.__rtopen&&window.__rtopen(dup.id,true); },400); return null; }
  var track=downsample(pr.track,6000);
  var r={ id:Store.uid("rt"), name:name, source:"gpx-import", source_file:pr.file||null, fp:pr.fp,
    distance_km:Math.round(pr.stats.km*10)/10, elevation_gain_m:pr.stats.hasEle?pr.stats.gain:null, elevation_loss_m:pr.stats.hasEle?pr.stats.loss:null,
    max_elevation_m:pr.stats.hasEle?pr.stats.max:null, min_elevation_m:pr.stats.hasEle?pr.stats.min:null,
    start:{lat:pr.stats.start.lat,lng:pr.stats.start.lng}, finish:{lat:pr.stats.finish.lat,lng:pr.stats.finish.lng},
    track:track, nPts:pr.stats.n, wpts:(pr.wpts||[]).slice(0,120), raw:(pr.raw!=null&&pr.raw.length<700000)?pr.raw:null, created_at:new Date().toISOString() };
  if(!rSave(r)) return null; window.__rtopen&&window.__rtopen(r.id,true); return r; }
function attachToTrip(r, tripId){ var trip=Store.getTour(tripId); if(!trip) return; 
  var hasManual=(n0(trip.lengthKm)>0&&trip.lengthKm!==r.distance_km)||(n0(trip.ascent)>0&&trip.ascent!==r.elevation_gain_m);
  function apply(overwrite){ trip.routeId=r.id; r.linkedTripId=tripId;
    if(overwrite){ trip.lengthKm=r.distance_km; trip.ascent=r.elevation_gain_m||0; trip.descent=r.elevation_loss_m||0;
      if((!trip.coords||!trip.coords.lat)&&r.start&&r.start.lat) trip.coords={lat:r.start.lat,lng:r.start.lng}; trip.notes=(trip.notes?trip.notes+" · ":"")+"GPX: "+r.name; }
    rSave(r); Store.save(); closeModal(); toast("GPX a túraprojekthez kapcsolva — friss a readiness","🥾"); NAV.to("#/tura/"+tripId); }
  if(hasManual){ openModal({ title:"A GPX adataival frissítsük?", body:'<p class="muted mt0">Ehhez a túrához már van kézzel megadott táv vagy szint. A GPX: <b>'+fKm(r.distance_km)+' · ⛰️ +'+(r.elevation_gain_m||0)+' m</b>. Mit tartsunk?</p>',
    footer:'<button class="btn btn-ghost" id="rt-keep-manual">Megtartom a kézit</button> <button class="btn btn-primary" id="rt-overwrite">Frissítem a GPX-sel</button>',
    onOpen:function(m){ m.querySelector("#rt-overwrite").onclick=function(){ apply(true); }; m.querySelector("#rt-keep-manual").onclick=function(){ apply(false); }; } }); }
  else apply(true); }
function routesPickTrip(cb){ var list=(Store.myData().tours||[]); if(!list.length){ toast("Nincs még túraprojekted — hozzát létre egyet","🥾"); return; }
  openModal({ title:"🥾 Válassz túraprojektet", body:'<div class="rt-trips">'+list.map(function(t){ return '<button class="rt-trip" data-tid="'+t.id+'"><b>'+escA(t.title)+'</b><span>'+(t.date?escA(t.date):"")+(t.routeId?" · 🗺️":"")+"</span></button>"; }).join("")+"</div>",
    footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',
    onOpen:function(m){ m.querySelectorAll("[data-tid]").forEach(function(b){ b.onclick=function(){ closeModal(); cb(b.dataset.tid); }; }); } }); }

/* ---------- importáló ---------- */
function openImport(ctx){ ctx=ctx||{};
  openModal({ title:"🗺️ GPX import", body:
    '<div class="rt-drop" id="rt-drop"><b>📂 GPX fájl kiválasztása</b><br>Húzd ide a <code>.gpx</code> fájlt<br><label class="btn btn-primary btn-sm" style="margin-top:.7rem"><span>📁 Válassz fájlt</span><input type="file" name="f" accept=".gpx,text/xml,application/gpx+xml" hidden></label></div>'+
    '<p class="small muted mt0 mb0" id="rt-drop-msg">Valódi GPX-t dolgozunk fel — a hiányzó adatot nem találjuk ki. Az útvonal privát marad.</p>',
    footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',
    onOpen:function(m){ var drop=m.querySelector("#rt-drop"), inp=m.querySelector("#rt-drop input[type=file]"), msg=m.querySelector("#rt-drop-msg");
      function handle(file){ if(!file) return; var rd=new FileReader();
        rd.onload=function(){ var txt=String(rd.result||"");
          if(txt.length>3500000){ msg.innerHTML='<b style="color:#8C3B24">A GPX fájl túl nagy.</b>'; return; }
          var P=parseGPX(txt);
          if(P.err==="xml"){ msg.innerHTML='<b style="color:#8C3B24">A GPX fájl nem olvasható.</b>'; return; }
          if(P.err==="notrack"||!P.pts){ if(P.wpts&&P.wpts.length){ msg.innerHTML='A fájlban nincs track — waypoint-kezelés hamarosan. Ezzel nem tudunk útvonalat generálni.'; return; } msg.innerHTML='<b style="color:#8C3B24">Nem találtunk track pontot a fájlban.</b>'; return; }
          var st=routeStats(P.pts);
          var rFor={track:P.pts,wpts:P.wpts};
          var pr={ name:P.name||file.name.replace(/\.gpx$/i,"").slice(0,80), stats:st, wpts:P.wpts, track:P.pts, raw:txt, fp:fpOf(P.name||file.name,st,txt.length), file:file.name, routeForMap:rFor };
          if(st.n<2){ msg.innerHTML="Nem elég koordináta a távolság-kiszámításhoz."; return; }
          closeModal(); if(ctx.opened) return;
          setTimeout(function(){ previewModal(pr,ctx); },120); };
        rd.readAsText(file); }
      inp.onchange=function(){ handle(inp.files[0]); };
      ["dragover","dragleave","drop"].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); }); });
      drop.ondrop=function(e){ e.preventDefault(); if(e.dataTransfer&&e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }; } }); }

window.openGPXImport = openImport;

/* ---------- részletek (lap helyett modal) ---------- */
window.v47parseGPX=function(text){ var p=parseGPX(text); if(p&&p.err) return p; var st=routeStats(p.pts); return { name:p.name, track:p.pts, wpts:p.wpts, stats:st, raw:String(text||""), fp:null }; };
window.__rtopen=function(id, replace){ var r=rGet(id); if(!r) return;
  var trip=r.linkedTripId?Store.getTour(r.linkedTripId):null;
  openModal({ title:"🗺️ "+escA(r.name), body:
    '<div class="rt-stats">'+
    '<span class="rt-stat">📏 <b>'+fKm(n0(r.distance_km))+'</b></span>'+
    '<span class="rt-stat">⛰️ <b>'+(r.elevation_gain_m!=null?"+"+fM(r.elevation_gain_m)+" m":"nincs elevation")+'</b></span>'+
    '<span class="rt-stat">⬇️ <b>'+(r.elevation_loss_m!=null?"-"+fM(r.elevation_loss_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔝 <b>'+(r.max_elevation_m!=null?fM(r.max_elevation_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔻 <b>'+(r.min_elevation_m!=null?fM(r.min_elevation_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🗓️ <b>'+new Date(r.created_at).toLocaleDateString("hu-HU")+'</b></span></div>'+
    (r.max_elevation_m!=null?profileSVG(r.track||[]):'<p class="small muted mb0">⛰️ Nincs elevációs adat</p>')+
    '<div class="rt-map" id="rt-map-'+ r.id +'"></div>'+
    (trip?'<p class="small mb0">🥾 Kapcsolódó túra: <a href="#/tura/'+trip.id+'">'+escA(trip.title)+"</a></p>":'<p class="small muted mb0">🥾 Nincs túrához kapcsolva</p>')+
    (r.wpts&&r.wpts.length?'<p class="small muted mb0">📌 Waypointok ('+r.wpts.length+'): '+r.wpts.slice(0,6).map(function(w){return escA(w.name);}).join(", ")+"</p>":"")+
    '<div class="rt-btns">'+
      (trip?'<a class="btn btn-ember" href="#/tura/'+trip.id+'">🥾 Túra megnyitása</a>':'<button class="btn btn-ember" id="rt-link">🥾 Túrához adom</button> <button class="btn btn-soft" id="rt-mktrip">🗓️ Túra belőle</button>')+
      '<button class="btn btn-soft" id="rt-export">⬇️ GPX export</button>'+
      '<button class="btn btn-ghost" id="rt-rename">✏️ Áthívtás</button>'+
      '<button class="btn btn-ghost" id="rt-del">🗑️</button>'+
    '</div>', footer:'<button class="btn btn-primary btn-block" data-close>Kész</button>',
    onOpen:function(m){ mapInto(m.querySelector(".rt-map"),r);
      m.querySelector("#rt-export").onclick=function(){ exportRoute(r); };
      m.querySelector("#rt-rename").onclick=function(){ var v=prompt("Új név:",r.name); if(v){ r.name=String(v).slice(0,80); rSave(r); toast("Áthívva a néven","✏️"); closeModal(); routesRefresh(); } };
      m.querySelector("#rt-del").onclick=function(){ confirmDlg("Biztosan törölöd az útvonalat?"+(trip?" Az ehhez kapcsolt túra (\""+trip.title+"\") MEGMARAD.":""),"Törlés",function(){ rDelete(r.id); closeModal(); toast("Útvonal törölve — a túra megmaradt","🗑"); routesRefresh(); }); };
      var lk=m.querySelector("#rt-link"); if(lk) lk.onclick=function(){ routesPickTrip(function(tid){ var rr=rGet(r.id); if(rr){ rr.linkedTripId=tid; attachToTrip(rr,tid); } }); };
      var mk=m.querySelector("#rt-mktrip"); if(mk) mk.onclick=function(){ var rr=rGet(r.id); if(!rr) return;
        if(rr.linkedTripId&&Store.getTour(rr.linkedTripId)){ closeModal(); toast("van már kapcsolódó túra","🗓️"); NAV.to("#/tura/"+rr.linkedTripId); return; }
        var t=Store.newTourFromDraft({title:rr.name, place:"", date:"", status:"tervezés", lengthKm:rr.distance_km, ascent:rr.elevation_gain_m||0,
          coords:(rr.start&&rr.start.lat)?{lat:rr.start.lat,lng:rr.start.lng}:null, desc:"GPX import: "+rr.name, notes:"Forrás: GPX import", tags:["gpx"] });
        t.routeId=rr.id; t.descent=rr.elevation_loss_m||0; Store.save(); rr.linkedTripId=t.id; rSave(rr); closeModal(); toast("Túra létrehozva a GPX-adataival","🗓️"); NAV.to("#/tura/"+t.id); routesRefresh(); }; } }); };

/* ---------- export ---------- */
function gpxFromRoute(r){
  var pts=r.track||[];
  var seg=""; for(var i=0;i<pts.length;i++){ var p=pts[i];
    seg+="      <trkpt lat=\""+p[0]+"\" lon=\""+p[1]+"\">"+(p[2]!=null?"<ele>"+p[2]+"</ele>":"")+(p[3]?"<time>"+p[3]+"</time>":"")+"</trkpt>\n"; }
  return"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx version=\"1.1\" creator=\"Turatars\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n  <metadata><name>"+escA(r.name)+"</name></metadata>\n"+
    "<trk><name>"+escA(r.name)+"</name><trkseg>\n"+seg+"</trkseg></trk>\n</gpx>\n"; }
function exportRoute(r){ var txt=r.raw||gpxFromRoute(r); var a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([txt],{type:"application/gpx+xml"})); a.download=String(r.name||"utvonal").replace(/[^\w-]+/g,"_").slice(0,40)+".gpx";
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },600); toast(r.raw?"Eredeti GPX letöltve — az adat nem változott":"A mentett trackből regenerált GPX","⬇️"); }

window.rtFmt={fKm:fKm,fM:fM,get:rGet};
window.__V47 = 1;
})();
