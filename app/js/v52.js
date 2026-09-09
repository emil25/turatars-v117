/* ============ V52 — 🗺️ Erdélyi túra- és eseményplatform ============
   Új réteg a meglévő rendszerre: szervezői profil, események, jelentkezés.
   KAPCSOLÓDIK: V47 route (routeId), V49 extRef/f9:e dedup, V41 naptár (savedEvents+dato), V46 inbox, V41 projekt.
   Új adatsík kizárólag a Store.platform()-ban (events/organizers/participants) — NEM új túra/GPX/journal/stats rendszer.
   Valódi eseményt nem találunk ki; DEMO elemek jelöltek. */
(function(){
"use strict";
/* ---------- alapok ---------- */
function esc2(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function P(){ try{ return Store.platform(); }catch(e){ return {organizers:[],events:[],participants:[]}; } }
function nowISO(){ return new Date().toISOString(); }
function myU(){ return Store.me()||{}; }
function myId(){ var u=Store.me(); return u&&u.email? String(u.email): (u&&u.id)||""; }
function norm(s){ return String(s==null?"":s).toLowerCase().normalize? String(s).toLowerCase().replace(/\s+/g," ").trim():String(s||"").toLowerCase(); }
function fpOf(ev){ return norm(ev.name)+"|"+norm(ev.date)+"|"+norm(ev.place); }
function isOrg(){ var p=P(); return p.organizers.find(function(o){ return o.owner===myId(); })||null; }
function getEvent(id){ return P().events.find(function(x){ return x.id===id; })||null; }
function ownEvent(id){ var e=getEvent(id); var o=isOrg(); return (e&&o&&e.orgId===o.id)?e:null; }

/* ---------- DEMO események eltávolítása ---------- */
function ensureDemo(){
  var p=P(), changed=false, removed=new Set();
  p.events=(p.events||[]).filter(function(e){
    var demo=!!e.demo || String(e.id||"").indexOf("evp_demo")===0 || /^DEMO\s*[—–-]/i.test(String(e.name||""));
    if(demo){ removed.add(e.id); changed=true; return false; }
    return true;
  });
  p.participants=(p.participants||[]).filter(function(x){ return !removed.has(x.eid); });
  p.organizers=(p.organizers||[]).filter(function(o){
    var demo=!!o.demo || o.id==="org_demo" || /^DEMO\s*[—–-]/i.test(String(o.name||""));
    if(demo){ changed=true; return false; }
    return true;
  });
  p.seeded=true;
  if(changed) Store.save();
}

/* ---------- mapped pool a V49/CAT_E számára ---------- */
function counts(id){ var p=P(); var L=p.participants.filter(function(x){ return x.eid===id && x.status!=="withdrawn" && x.status!=="declined"; });
  return { pend:L.filter(function(x){return x.status==="pending";}).length, acc:L.filter(function(x){return x.status==="accepted";}).length, tot:L.length }; }
window.e2Events=function(){ ensureDemo(); var u=myU(); var o=isOrg(); try{
  var meEmail=u&&u.email; var mEmail=u&&u.email;
  return P().events.filter(function(e){ if(e.status==="draft") return false; if(e.status==="cancelled") return true; return e.status!=="hidden"; })
   .map(function(e){ var org=P().organizers.find(function(x){return x.id===e.orgId;}); var c=counts(e.id);
    return { id:"p2-"+e.id, name: e.name, date:e.date||"", time:e.time||"", place:e.place||"", diff:e.diff||"",
      org:(org?org.name:"")+ (e.demo?" (DEMO)":"")+ (e.community?"":(org&&!org.demo?"":"")), people:c.acc+ (e.cap?"/"+e.cap:""), km:e.km!=null?String(e.km):null, up:e.up!=null?String(e.up):null, h:e.h!=null?String(e.h):null,
      desc:(e.demo?"🧪 DEMO / szemléltető adat. ":"")+ (e.desc||""), src: e.joinMode==="external"? (e.joinUrl||null):null, p2:e.id,
      cat: e.community?"🥾 Közösségi túra":"Platform", demo:!!e.demo }; }); }catch(err){ return []; } };

/* ---------- esemény modal extrák (V49 openEventModal hívja) ---------- */
window.v52Extra=function(e){ try{ if(!e||!e.p2) return ""; var ev=getEvent(e.p2); if(!ev) return ""; var o=isOrg(); var st=myJoin(e.p2);
  var parts=[];
  if(ev.date) parts.push('<button class="btn btn-soft btn-sm" data-e2cal="'+ev.id+'">'+(savedIn(ev)?"✓ Már a naptáradban van":"📅 Naptárba")+"</button>");
  if(ev.joinMode==="internal"){ var label = !st? "👥 Jelentkezem" : st.status==="pending"?"🟠 Jelentkezés elküldve" : st.status==="accepted"?"🟢 Elfogadva" : st.status==="declined"?"🔴 Elutasítva" : "👥 Jelentkezem";
    var full = ev.cap && counts(ev.id).tot>=ev.cap && !(st&&(st.status==="pending"||st.status==="accepted"));
    parts.push(full && !st? '<span class="chip chip-rose">🔴 Betelt — nincs hely</span>' : '<button class="btn btn-ember btn-sm" data-e2join="'+ev.id+'"'+((st&&st.status!=="withdrawn")?" disabled":"")+">"+label+"</button>"+((st&&st.status!=="withdrawn")?' <button class="btn btn-ghost btn-sm" data-e2wd="'+ev.id+'">Visszavonom</button>':""));
  } else if(ev.joinMode==="external" && ev.joinUrl){ parts.push('<a class="btn btn-ember btn-sm" href="'+esc2(ev.joinUrl)+'" target="_blank" rel="noopener">🔗 Jelentkezés a szervezőnél</a><p class="small muted" style="margin:.3rem 0 0">A jelentkezést a szervező saját felületén intézed — az app nem látja a sikert.</p>'); }
  if(ev.joinMode==="none"){ parts.push('<p class="small muted" style="margin:.2rem 0 0">Ehhez az eseményhez nincs jelentkezési rendszer.</p>'); }
  if(ev.routeId){ var r=(Store.myData().routes||[]).find(function(x){return x.id===ev.routeId;});
    parts.push(r? '<button class="btn btn-soft btn-sm" data-e2route="'+ev.id+'">🗺️ Útvonal (GPX)</button>' : (ev.routeSnap? '<p class="small muted" style="margin:.2rem 0 0">🗺️ GPX útvonal: '+esc2(ev.routeSnap.name)+" · "+(ev.routeSnap.distance_km!=null?ev.routeSnap.distance_km.toFixed(1).replace(".",",")+" km":"km")+(ev.routeSnap.maxE!=null?" · ⛰️ max "+Math.round(ev.routeSnap.maxE)+" m":"")+" — a szervező saját nyomvonala (a GPX-fájlt a szervező birtokolja).</p>" : "")); }
  else parts.push('<p class="small muted" style="margin:.2rem 0 0">Ehhez az eseményhez nincs GPX útvonal.</p>');
  if(o&&ev.orgId===o.id) parts.push('<button class="btn btn-ghost btn-sm" data-e2edit="'+ev.id+'">✏️ Szerkesztés</button>');
  if(ev.status==="cancelled") parts.push('<p class="small" style="color:#b3402f;margin:.2rem 0 0">🔴 Ezt az eseményt a szervező lemondta.</p>');
  if(ev.status==="full") parts.push('<span class="chip chip-rose">🔴 Betelt</span>');
  parts.push('<p class="small muted" style="margin:.25rem 0 0">👥 '+(ev.cap? counts(ev.id).tot+" / "+ev.cap+" jelentkezett":"Nincs létszámlimit")+(ev.km!=null||ev.up!=null?"":"")+"</p>");
  return '<div class="f9cta e2x">'+parts.join("")+"</div>"; }catch(err){ return ""; } };
function rEV(id){ var e=getEvent(id); if(!e) return ""; var o=isOrg(); var st=myJoin(id); var c=counts(id); var full=e.cap&&c.tot>=e.cap; var jo="";
  if(e.joinMode==="internal"){ var label = !st? "👥 Jelentkezem" : st.status==="pending"?"🟠 Jelentkezés elküldve" : st.status==="accepted"?"🟢 Elfogadva" : st.status==="declined"?"🔴 Elutasítva" : "👥 Jelentkezem";
    jo = full && !(st&&(st.status==="pending"||st.status==="accepted")) ? '<span class="chip chip-rose">🔴 Betelt — nincs hely</span>' : '<button class="btn btn-ember btn-sm" data-e2join="'+e.id+'"'+((st&&st.status!=="withdrawn")?" disabled":"")+">"+label+"</button>"+((st&&st.status!=="withdrawn")?' <button class="btn btn-ghost btn-sm" data-e2wd="'+e.id+'">Visszavonom</button>':""); }
  else if(e.joinMode==="external"&&e.joinUrl){ jo='<a class="btn btn-ember btn-sm" href="'+esc2(e.joinUrl)+'" target="_blank" rel="noopener">🔗 Jelentkezés a szervezőnél</a>'; }
  else if(e.joinMode==="none"){ jo='<span class="small muted">Nincs jelentkezési rendszer.</span>'; }
  var cal='<button class="btn btn-soft btn-sm" data-e2cal="'+e.id+'">'+(savedIn(e)?"✓ Már a naptáradban van":"📅 Naptárba")+"</button>";
  var ed=(o&&e.orgId===o.id)?'<button class="btn btn-ghost btn-sm" data-e2edit="'+e.id+'">✏️ Szerkesztés</button>':'';
  return jo+cal+ed; }
function patchJoinBlock(eid){ var m=document.querySelector('[data-modal]'); if(!m) return; var host=m.querySelector('.e2x'); var row=host?host.previousElementSibling:null; if(!row){ }
  var act=m.querySelector('.e2x'); if(!act) return; var holder=act.querySelector('[data-e2join],[data-e2wd]'); if(!holder||!holder.parentElement) return;
  holder.parentElement.innerHTML=rEV(eid); }
function reopenEvModal(eid){ try{ if(document.querySelector("[data-modal]")){ setTimeout(function(){ try{ closeModal(); window.v49OpenEv&&window.v49OpenEv("p2-"+eid); }catch(e){} },160); } }catch(e){} }
function savedIn(ev){ var d=Store.myData(); return (d.savedEvents||[]).indexOf("p2-"+ev.id)>-1; }
function myJoin(eid){ var p=P(); return p.participants.find(function(x){ return x.eid===eid && x.uid===myId(); })||null; }

/* ---------- műveletek ---------- */
function joinEv(eid){ var ev=getEvent(eid); if(!ev||ev.status==="cancelled") { toast("Az esemény nem vár jelentkezést","🔴"); return; }
  if(ev.joinMode!=="internal"){ toast("Külső jelentkezés: a szervező linkjén intézheted","🔗"); return; }
  var ex=myJoin(eid); if(ex&&ex.status!=="withdrawn"){ toast("Már jeleztél részvételt","👥"); return; }
  if(ev.cap && counts(eid).tot>=ev.cap){ toast("🔴 Betelt — sajnos nincs több hely","👥"); return; }
  var p=P(); var row=ex; if(!row){ row={id:"pt_"+Math.random().toString(36).slice(2,8), eid:eid, uid:myId(), name:(myU().name||"Túrázó"), at:nowISO(), status:"pending"}; p.participants.push(row); }
  else { row.status="pending"; row.at=nowISO(); row.withdrewAt=null; }
  if(ev.cap && counts(eid).tot>=ev.cap){ ev.status="full"; }
  Store.save(); toast(ev.demo? "Jelentkezés rögzítve a DEMO eseményre (szemléltető)" : "🟠 Jelentkezés elküldve a szervezőnek","👥"); patchJoinBlock(eid); refreshHere(); }
function withdraw(eid){ var row=myJoin(eid); if(!row||row.status==="withdrawn") return; row.status="withdrawn"; row.wdAt=nowISO(); var ev=getEvent(eid); if(ev&&ev.status==="full") ev.status="published"; Store.save(); toast("Jelentkezés visszavonva","⚪"); patchJoinBlock(eid); refreshHere(); }
function addToCal(eid){ var ev=getEvent(eid); if(!ev||!ev.date) return; var d=Store.myData(); d.savedEvents=d.savedEvents||[]; var key="p2-"+eid; if(d.savedEvents.indexOf(key)>-1){ toast("✓ Már a naptáradban van","📅"); return; } d.savedEvents.push(key); Store.save(); toast("Hozzáadva a naptáradhoz","📅"); patchJoinBlock(eid); refreshHere(); }
function decide(pid,status){ var p=P(); var row=p.participants.find(function(x){return x.id===pid;}); if(!row) return; var ev=getEvent(row.eid); var o=isOrg(); if(!ev||!o||ev.orgId!==o.id){ toast("Nem vagy jogosult处理ni","🔒"); return; } if(status==="accepted"&&ev.cap&&counts(ev.id).acc>=ev.cap){ toast("Limit: nem fogadhatsz többet","🔴"); return; } row.status=status; row.decAt=nowISO(); Store.save(); try{ if(window.v53OnDecide) window.v53OnDecide(row,status,ev); }catch(e2){} toast(status==="accepted"?"🟢 Elfogadva":"🔴 Elutasítva","📋"); if(window.__e2appLast){ closeModal(); setTimeout(function(){ orgApplicants(window.__e2appLast); },150); } else refreshHere(); }
function evStatus(eid,st){ var ev=ownEvent(eid); if(!ev){ toast("Csak a saját eseményt módosíthatod","🔒"); return; } ev.status=st; Store.save(); toast({published:"Publikálva 🌐",draft:"Piszozatba véve",cancelled:"Lemondva 🛑",completed:"Lezárva ✓"}[st]||"Módosítva",st==="cancelled"?"🛑":"•"); refreshHere(); }
function changedBannerForTour(t){ try{ if(!t||!t.eventRef||String(t.eventRef).indexOf("p2-")!==0) return ""; var ev=getEvent(t.eventRef.slice(3)); if(!ev) return ""; var seen=t.evsRev; if(seen==null) { t.evsRev=ev.rev; Store.save(); return ""; } if(ev.rev>seen){ return '<div class="card panel e2note">⚠️ Az esemény adatai megváltoztak (frissítés '+ (ev.date||"") +'). A te tervedet nem írtuk át — <button class="btn btn-ghost btn-sm" id="e2sync">Frissítem a tervet</button></div>'; } return ""; }catch(e){ return ""; } }

function refreshHere(){ try{ if(document.querySelector("[data-modal]")) return; if(window.App&&App.render) App.render(); }catch(e){} }
/* ---------- GPX preview (V47 parser újrafelhasználása) ---------- */
function gpxStats(pr){ var tr=(pr&&pr.track)||[]; var st=(pr&&pr.stats)||{}; return { n:st.n||tr.length, km:st.km!=null?Math.round(st.km*10)/10:null, gain:st.gain!=null?st.gain:null, loss:st.loss!=null?st.loss:null, maxE:st.max!=null?st.max:(function(){ var m=null; tr.forEach(function(pt){ var e=pt&&pt[2]!=null?+pt[2]:null; if(e!=null&&isFinite(e)&&(m===null||e>m)) m=e; }); return m; })() }; }
function miniProfileSVG(track){ try{ var vals=(track||[]).map(function(pt){return pt&&pt.length>2?+pt[2]:null;}).filter(function(v){return v!=null&&!isNaN(v);}); if(vals.length<3) return '<p class="small muted">Elevation profilhoz nincs adat — nem becsüljük.</p>';
  var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), w=280, h=54; var pts=vals.map(function(v,i){ return (Math.round(i/(vals.length-1)*w))+","+(Math.round(h-(v-mn)/((mx-mn)||1)*(h-6)-3)); }).join(" ");
  return '<svg viewBox="0 0 '+w+" "+h+'" class="e2-prof" role="img" aria-label="Magassági profil"><polyline points="'+pts+'" fill="none" stroke="#1C4A36" stroke-width="2"/></svg><p class="small muted" style="margin:.15rem 0 0">⛰️ '+Math.round(mn)+"–"+Math.round(mx)+" m · 📍 "+vals.length+" pont (minta a teljes trackből)</p>"; }catch(e){ return ""; } }
function miniMapInto(el, track){ try{ if(!el) return; if(typeof MapKit==="undefined"||!window.L){ el.innerHTML='<p class="small muted">A térkép most nem elérhető — az útvonal adatai így is menthetők.</p>'; return; }
  var pts=(track||[]).filter(function(p){return p&&p[0]!=null&&p[1]!=null;}); if(pts.length<2){ el.innerHTML='<p class="small muted">Túl kevés pont a térképhez.</p>'; return; }
  var m=MapKit.make(el,{lat:pts[0][0],lng:pts[0][1]}); if(m){ window.L.polyline(pts.map(function(p){return [p[0],p[1]];}),{color:"#1C4A36",weight:3}).addTo(m); if(m.fitBounds) m.fitBounds(window.L.latLngBounds(pts.map(function(p){return [p[0],p[1]];}))); } }catch(e){ try{ el.innerHTML='<p class="small muted">Térkép-hiba — menthető az adat.</p>'; }catch(e2){} } }

/* ---------- esemény-űr (létrehozás/szerkesztés) ---------- */
function evForm(existing){ var e=existing||{}; var isEdit=!!existing;
  var F=function(k,v){ return '<input class="input" id="e2f_'+k+'" value="'+esc2(v==null?"":v)+'">'; };
  openModal({ title: isEdit?("✏️ Esemény szerkesztése — "+(e.name||"")):"＋ Új túraesemény",
   body:'<div class="e2form">'+
    '<label class="f">Esemény neve *</label>'+F("name",e.name)+
    '<div class="grid g2e"><div><label class="f">Dátum *</label><input class="input" id="e2f_date" type="date" value="'+esc2(e.date||"")+'"></div>'+
    '<div><label class="f">Kezdés</label><input class="input" id="e2f_time" type="time" value="'+esc2(e.time||"")+'"></div></div>'+
    '<label class="f">Helyszín *</label>'+F("place",e.place)+
    '<label class="f">Régió</label>'+F("region",e.region)+
    '<div class="grid g2e"><div><label class="f">Koordináta (lat,lng — opcionális)</label>'+F("coords",e.coords?e.coords.join(","):"")+'</div>'+
    '<div><label class="f">Nehézség</label><select class="input" id="e2f_diff"><option value="">—</option>'+["Könnyű","Közepes","Nehéz"].map(function(d){return "<option"+(e.diff===d?" selected":"")+">"+d+"</option>";}).join("")+"</select></div></div>"+
    '<div class="grid g2e"><div><label class="f">Táv (km)</label><input class="input" id="e2f_km" type="number" min="0" step="0.5" value="'+esc2(e.km!=null?e.km:"")+'"></div>'+
    '<div><label class="f">Szintemelkedés (m)</label><input class="input" id="e2f_up" type="number" min="0" step="10" value="'+esc2(e.up!=null?e.up:"")+'"></div></div>'+
    '<div class="grid g2e"><div><label class="f">Időtartam (óra)</label><input class="input" id="e2f_h" type="number" min="0" step="0.5" value="'+esc2(e.h!=null?e.h:"")+'"></div>'+
    '<div><label class="f">Max létszám (üres = nincs limit)</label><input class="input" id="e2f_cap" type="number" min="1" step="1" value="'+esc2(e.cap!=null?e.cap:"")+'"></div></div>'+
    '<label class="f">Leírás</label><textarea class="input" id="e2f_desc" rows="2">'+esc2(e.desc||"")+"</textarea>"+
    '<label class="f">Jelentkezési mód</label><select class="input" id="e2f_join"><option value="internal"'+(e.joinMode!=="external"&&e.joinMode!=="none"?" selected":"")+">A) Belső jelentkezés (kezeled a felületen)</option><option value=\"external\""+(e.joinMode==="external"?" selected":"")+">B) Külső link</option><option value=\"none\""+(e.joinMode==="none"?" selected":"")+">C) Nincs jelentkezés</option></select>"+
    '<div id="e2f_urlbox"'+(e.joinMode==="external"?"":' style="display:none"')+'><label class="f">Külső jelentkezési link</label><input class="input" id="e2f_url" value="'+esc2(e.joinUrl||"")+'" placeholder="https://…"></div>'+
    '<div style="height:.4rem"></div><label class="f">GPX (opcionális — V47 parser)</label><label class="btn btn-soft btn-sm">📂 GPX fájl kiválasztása<input type="file" accept=".gpx,application/gpx+xml" id="e2f_gpxf" style="display:none"></label>'+
    '<div id="e2f_gpxprev" class="e2-gpxprev">'+(e.routeSnap?('<p class="small mb0">🗺️ '+esc2(e.routeSnap.name||"útvonal")+' — 📏 '+(e.routeSnap.distance_km!=null?e.routeSnap.distance_km:"—")+' km · ⛰️ +'+(e.routeSnap.gain!=null?e.routeSnap.gain:"—")+' m · 🏔️ max '+(e.routeSnap.maxE!=null?Math.round(e.routeSnap.maxE):"—")+' m</p><div class="e2-pminimap" style="height:0"></div>'):(isEdit&&e.routeId?('<p class="small mb0">🗺️ GPX útvonal csatolva (útmutató a mentett útvonalakhoz).</p>'):""))+"</div>"+
    '<p class="small muted" style="margin:.5rem 0 0">⚠️ Valóságtartalom: csak olyan eseményt tölts fel, ami megrendezést nyer. Demó jelölés a rendszerben nem kérhető — a platform a TE eseményeidet mutatja.</p>'+
    '<p id="e2f_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="e2f_save">'+(isEdit?"💾 Mentés":"＋ Esemény létrehozása")+"</button>",
   onOpen:function(m){ var gpxData=m.__gpx=null;
     var js=m.querySelector("#e2f_join"); if(js) js.onchange=function(){ var u=m.querySelector("#e2f_urlbox"); if(u) u.style.display = js.value==="external"?"":"none"; };
     var fi=m.querySelector("#e2f_gpxf"); if(fi) fi.onchange=function(){ var f=fi.files&&fi.files[0]; if(!f) return; var rd=new FileReader();
       rd.onload=function(){ try{ var pr=(window.v47parseGPX?window.v47parseGPX(String(rd.result||"")):null); var box=m.querySelector("#e2f_gpxprev");
         if(!pr||pr.err||!pr.track||pr.track.length<3){ box.innerHTML='<p class="e2-err">⚠️ Hibás vagy túl rövid GPX — nem menthető útvonalként. ("Ehhez nem tudunk valós útvonalat rendelni.")</p>'; m.__gpx=null; return; }
         var st=gpxStats(pr); m.__gpx={ name:(f.name||"GPX").replace(/\.gpx$/i,"").slice(0,60), pr:pr, stats:st };
         box.innerHTML='<p class="small" style="margin:.2rem 0">🗺️ <b>'+esc2(m.__gpx.name)+'</b> · 📏 '+(st.km!=null?st.km.toFixed(1).replace(".",","):"—")+' km · ⛰️ +'+(st.gain!=null?Math.round(st.gain):"—")+' m · 🏔️ max '+(st.maxE!=null?Math.round(st.maxE):"—")+' m · 📍 '+st.n+' pont</p>'+miniProfileSVG(pr.track)+'<div class="e2-pminimap"></div>';
         miniMapInto(box.querySelector(".e2-pminimap"), pr.track);
       }catch(e){ m.__gpx=null; box.innerHTML='<p class="e2-err">⚠️ A GPX feldolgozása most nem sikerült.</p>'; } };
       rd.onerror=function(){ var box=m.querySelector("#e2f_gpxprev"); if(box) box.innerHTML='<p class="e2-err">⚠️ A fájl nem olvasható.</p>'; };
       rd.readAsText(f); };
     m.querySelector("#e2f_save").onclick=function(){ var g=function(k){ var el=m.querySelector("#e2f_"+k); return el?String(el.value||"").trim():""; };
       var name=g("name"), date=g("date"), place=g("place"); var err=m.querySelector("#e2f_err");
       if(!name||!date||!place){ if(err){ err.textContent="Kötelező: név, dátum, helyszín."; err.style.display=""; } return; }
       if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){ if(err){ err.textContent="A dátum formátuma YYYY-HH-NN legyen."; err.style.display=""; } return; }
       var o=isOrg(); if(!o){ toast("Előbb szervezői profil kell","🏢"); closeModal(); orgForm(); return; }
       var coords=null; var cg=g("coords"); if(cg){ var cs=cg.split(",").map(function(x){return parseFloat(x.replace(".", "."));}); if(cs.length===2&&!isNaN(cs[0])&&!isNaN(cs[1])&&Math.abs(cs[0])<=90&&Math.abs(cs[1])<=180) coords=[cs[0],cs[1]]; }
       var numOrNull=function(v){ var n=parseFloat(String(v).replace(",", ".")); return (v!==""&&!isNaN(n))?n:null; };
       var jmode=g("join")||"internal";
       var patch={ name:name, date:date, time:g("time")||"", place:place, region:g("region")||"", coords:coords,
         km:numOrNull(g("km")), up:numOrNull(g("up")), h:numOrNull(g("h")), diff:g("diff")||"", desc:g("desc")||"",
         joinMode:jmode, joinUrl:(jmode==="external"?(g("url")||""):""), cap:numOrNull(g("cap")) };
       if(isEdit){ var ev=ownEvent(existing.id); if(!ev) return; var keyCh=fpOf(patch)!==ev.fp;
         Object.assign(ev, patch); ev.rev=(ev.rev||0)+1; ev.updatedAt=nowISO();
         if(m.__gpx) attachGpx(ev, m.__gpx);
         if(keyCh){ var dup=P().events.find(function(x){ return x.id!==ev.id && x.fp===fpOf(ev); }); if(dup){ toast("Már van ilyen azonos esemény (név+dátum+helyszín) — a duplikátum elmentve összefűzés helyett jelzéssel","⚠️"); } }
       } else { var fp=fpOf(patch);
         var dupE=P().events.find(function(x){ return x.fp===fp; });
         if(dupE){ toast("Ez az esemény már létezik (név+dátum+helyszín egyezés) — megnyitom","♻️"); closeModal(); if(window.v49OpenEv&&dupE.status!=="hidden") window.v49OpenEv("p2:"+dupE.id); return; }
         var ev2={ id:"evp_"+Math.random().toString(36).slice(2,8), orgId:o.id, status:"published"==="x"?"draft":"draft", fp:fp, rev:0, createdAt:nowISO(), demo:false };
         Object.assign(ev2, patch); P().events.push(ev2);
         if(m.__gpx) attachGpx(ev2, m.__gpx);
         toast("Esemény létrehozva — most még PISZKOZAT. A listádból egy koppintással publikálhatod.","🗂️"); }
       Store.save(); closeModal(); refreshHere(); }; } }); }
function attachGpx(ev, g){ var d=Store.myData(); d.routes=d.routes||[]; var st=g.stats;
  function rfpOf(t){ try{ var tr=t||[]; if(!tr.length) return null; var f=tr[0], l=tr[tr.length-1]; return [f&&f[0],f&&f[1],f&&f[2],l&&l[0],l&&l[1],l&&l[2],tr.length].join("~"); }catch(e){ return null; } }
  var fpx=rfpOf(g.pr.track); var ex=fpx && d.routes.find(function(r){ return r.__fp===fpx; });
  if(ex){ ev.routeId=ex.id; ev.routeSnap={ name:ex.name, distance_km:ex.distance_km, gain:ex.elevation_gain_m, maxE:p52maxOf(ex.track), n:ex.nPts||null }; return; }
  var rid="rt_"+Math.random().toString(36).slice(2,8);
  var ps=(g.pr&&g.pr.stats)||{};
  d.routes.push({ id:rid, name:g.name, distance_km:st.km, elevation_gain_m:ps.hasEle?st.gain:null, elevation_loss_m:ps.hasEle?st.loss:null,
    max_elevation_m:ps.hasEle?ps.max:null, min_elevation_m:ps.hasEle?ps.min:null,
    start:ps.start||null, finish:ps.finish||null,
    track:g.pr.track, nPts:st.n, created_at:nowISO(), source:"gpx-import", raw:(g.pr.raw&&g.pr.raw.length<700000)?g.pr.raw:null, ownerEvent:ev.id, __fp:(function(t){ try{ var f=(t||[])[0], l=(t||[])[(t||[]).length-1]; return f&&l?[f[0],f[1],f[2],l[0],l[1],l[2],t.length].join("~"):null; }catch(e){ return null; } })(g.pr.track) });
  ev.routeId=rid; ev.routeSnap={ name:g.name, distance_km:st.km!=null?Math.round(st.km*10)/10:null, gain:st.gain!=null?Math.round(st.gain):null, maxE:st.maxE!=null?Math.round(st.maxE):null, n:st.n }; }
function p52maxOf(tr){ try{ var m=null; (tr||[]).forEach(function(p){ var e=p&&p.length>2?+p[2]:null; if(e!=null&&isFinite(e)&&(m===null||e>m)) m=e; }); return m; }catch(e){ return null; } }

/* ---------- szervezői regisztráció ---------- */
function orgForm(){ var o=isOrg(); if(o){ toast("Szervezői profilod már létezik","🏢"); return; }
  var u=myU();
  openModal({ title:"🏢 Szervezői profil létrehozása", body:
    '<div class="e2form"><label class="f">Szervező neve *</label><input class="input" id="e2o_name" value="'+esc2(u.name||"")+'" maxlength="60">'+
    '<label class="f">Rövid bemutatkozás</label><textarea class="input" id="e2o_bio" rows="2" maxlength="220"></textarea>'+
    '<div class="grid g2e"><div><label class="f">E-mail *</label><input class="input" id="e2o_mail" type="email" value="'+esc2(u.email||"")+'"></div>'+
    '<div><label class="f">Régió</label><input class="input" id="e2o_reg" value="'+esc2(u.city||"")+'"></div></div>'+
    '<div class="grid g2e"><div><label class="f">Weboldal/link (opcionális)</label><input class="input" id="e2o_web" placeholder="https://…"></div>'+
    '<div><label class="f">Telefon (opcionális)</label><input class="input" id="e2o_ph"></div></div>'+
    '<label class="f">Logó / profilkép (opcionális)</label><label class="btn btn-soft btn-sm">🖼️ Kép kiválasztása<input type="file" accept="image/*" id="e2o_logo" style="display:none"></label><p id="e2o_logoprev" class="small muted"></p>'+
    '<p class="small muted" style="margin:.4rem 0 0">Az adatok ebben a böngészőben tárolódnak — a szervezői fiók nem nyilvános regisztráció.</p><p id="e2o_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="e2o_save">🏢 Profil létrehozása</button>',
   onOpen:function(m){ var lg=m.querySelector("#e2o_logo"); m.__logo=null; if(lg) lg.onchange=function(){ var f=lg.files&&lg.files[0]; if(!f) return; if(f.size>140000){ m.querySelector("#e2o_err").textContent="A kép max ~140 KB — válassz kisebet."; m.querySelector("#e2o_err").style.display=""; return; }
     var rd=new FileReader(); rd.onload=function(){ m.__logo=String(rd.result||"").slice(0,200000); m.querySelector("#e2o_logoprev").textContent="✓ Kép kiválasztva"; }; rd.readAsDataURL(f); };
     m.querySelector("#e2o_save").onclick=function(){ var g=function(k){ var el=m.querySelector("#e2o_"+k); return el?String(el.value||"").trim():""; }; var nm=g("name"), mail=g("mail");
       if(!nm||!mail){ m.querySelector("#e2o_err").textContent="Név és e-mail kötelező."; m.querySelector("#e2o_err").style.display=""; return; }
       if(mail.indexOf("@")<1){ m.querySelector("#e2o_err").textContent="Az e-mail formátum hibás."; m.querySelector("#e2o_err").style.display=""; return; }
       var ur=g("web"); if(ur&&!/^https?:\/\//i.test(ur)) ur="https://"+ur.replace(/^\/+/,"");
       P().organizers.push({ id:"org_"+Math.random().toString(36).slice(2,8), owner:myId(), name:nm, bio:g("bio"), email:mail, web:ur, phone:g("ph"), region:g("reg"), logo:m.__logo||"", demo:false, createdAt:nowISO() });
       Store.save(); closeModal(); toast("🏢 Szervezői profil kész — hozd létre az első eseményt","🎉"); refreshHere(); }; } }); }
/* ---------- JELENTKEZŐK (csak saját esemény) ---------- */
function orgApplicants(eid){ window.__e2appLast=eid; var ev=ownEvent(eid); if(!ev){ toast("Csak a saját esemény jelentkezőit láthatod","🔒"); return; }
  var L=P().participants.filter(function(x){ return x.eid===eid; });
  function prect(x){
    var S={pending:"🟠 Elküldve",accepted:"🟢 Elfogadva",declined:"🔴 Elutasítva",withdrawn:"⚪ Visszavonta"}[x.status]||x.status;
    var act="";
    if(x.status==="pending") act='<span style="display:flex;gap:.35rem;flex-wrap:wrap"><button class="btn btn-soft btn-sm" data-e2dec="'+x.id+':accepted">Elfogad</button><button class="btn btn-ghost btn-sm" data-e2dec="'+x.id+':declined">Elutasít</button></span>';
    else if(x.status==="withdrawn") act='<span class="small muted">visszavonta — hely felszabadult</span>';
    else if(x.status==="declined") act='<button class="btn btn-ghost btn-sm" data-e2dec="'+x.id+':pending">Mégis elfogadom</button>';
    else if(x.status==="accepted") act="<span class='small'>✔</span>";
    return '<div class="e2prow"><b>'+esc2(x.name||"Túrázó")+'</b><span class="mut">'+S+" · "+esc2(String(x.at||"").slice(0,10))+"</span> "+act+"</div>";
  }
  var body = L.length ? ('<div class="e2plist">'+L.slice().sort(function(a,b){ return String(b.at).localeCompare(String(a.at)); }).map(prect).join("")+"</div>") : '<p class="muted">Még nincs jelentkező.</p>';
  openModal({ title:"📋 Jelentkezők — "+esc2(ev.name)+(ev.cap?(" ("+counts(eid).tot+"/"+ev.cap+")"):""), body:body,
    footer:'<button class="btn btn-ghost" data-close>Bezárás</button>',
    onOpen:function(m){ m.addEventListener("click",function(x){ var b=x.target.closest?x.target.closest("[data-e2dec]"):null; if(!b) return; var q=String(b.getAttribute("data-e2dec")).split(":"); decide(q[0],q[1]); }); } });
}

/* ---------- SZERVEZŐI KÖZPONT ---------- */
function szervezoHtml(){ ensureDemo(); var o=isOrg(); if(!o){
    return '<div class="e2org"><section class="card panel e2hero"><span class="e2-big">🏢</span><div><h1 style="margin:0">Szervezői központ</h1><p class="muted" style="margin:.3rem 0 0">Kovácsolj össze eseményeket, kezelj jelentkezéseket — a túrázók a Felfedezésben találják meg őket.</p><button class="btn btn-primary" id="e2-reg">🏢 Szervezőként csatlakozom</button></div></section>'+
     '<p class="small muted">A DEMO szemléltető eseményeket a rendszer mindenki számára jelölten mutatja — ezek nem valódi szervezések.</p></div>'; }
  var evs=P().events.filter(function(e){ return e.orgId===o.id; });
  var up=evs.filter(function(e){ return e.status!=="draft" && e.status!=="completed" && e.date>=Store.todayISO(); }).sort(function(a,b){return String(a.date).localeCompare(String(b.date));});
  let done=evs.filter(function(e){ return e.status==="completed" || (e.status!=="draft" && e.date && e.date<Store.todayISO()); });
  var drafts=evs.filter(function(e){ return e.status==="draft"; });
  function row(e, edit){ var c=counts(e.id); var chip={published:"<span class='chip chip-green'>🌐 Publikus</span>",draft:"<span class='chip chip-sand'>🗂️ Piszkozat</span>",full:"<span class='chip chip-rose'>🔴 Betelt</span>",cancelled:"<span class='chip chip-rose'>🛑 Lemondva</span>",completed:"<span class='chip chip-pine'>✓ Lezárt</span>"}[e.status]||e.status;
    var btns=[]; if(e.status==="draft") btns.push("<button class='btn btn-primary btn-sm' data-e2st='"+e.id+":published'>🌐 Publikálom</button>");
    if(e.status!=="cancelled"&&e.status!=="completed") btns.push("<button class='btn btn-ghost btn-sm' data-e2st='"+e.id+":cancelled'>🛑 Lemondás</button><button class=\"btn btn-soft btn-sm\" data-e2st='"+e.id+"'>🗂️ Piszkozat</button>");
    if(e.status==="cancelled") btns.push("<button class='btn btn-soft btn-sm' data-e2st='"+e.id+"'>🗂️ Piszkozat</button>");
    if(e.status!=="cancelled") btns.push("<button class='btn btn-soft btn-sm' data-e2st='"+e.id+":completed'>✓ Lezárás</button>");
    if(e.status!=="published"){ /* full auto */ }
    btns.push("<button class='btn btn-ember btn-sm' data-e2app='"+e.id+"'>📋 Jelentkezők ("+c.tot+")</button>");
    return '<div class="e2row"><div><b>'+ (e.demo?"🧪 ":"📅 ")+esc2(e.name)+"</b><span class='mut'>"+esc2(e.date||"—")+" · "+esc2(e.place||"") + (e.km!=null?" · "+e.km+" km":"")+"</span> "+chip+"</div><div class='e2rowbtns'>"+btns.join("")+(edit&&e.status==="published"?"":"")+ (edit?"<span class='mut small'>"+(e.cap?("👥 "+c.tot+"/"+e.cap):"—")+" · </span>":"")+"<button class='btn btn-ghost btn-sm' data-e2edit='"+e.id+"'>✏️</button>"+(e.status==="full"?" <span class='chip chip-rose'>Betelt</span>":"")+"</div></div>"; }
  var stat='<div class="e2stats"><div><b>'+evs.filter(function(e){return e.status!=="draft";}).length+"</b><small>📅 esemény</small></div><div><b>"+P().participants.filter(function(x){ return evs.some(function(e){return e.id===x.eid;}); }).length+"</b><small>👥 jelentkező</small></div><div><b>"+P().participants.filter(function(x){ return evs.some(function(e){return e.id===x.eid;}) && x.status==="accepted"; }).length+"</b><small>✓ elfogadott</small></div></div>";
  return '<div class="e2org">'+
   '<section class="card panel e2hero"><span class="e2-big">'+(o.logo?"<img src=\""+esc2(o.logo)+"\" class=\"e2-logo\" alt=\"\">":"🏢")+"</span><div><h1 style=\"margin:0\">🏢 "+esc2(o.name)+"</h1><p class=\"muted\" style=\"margin:.25rem 0 0\">"+esc2(o.bio||"")+(o.region?(" · 📍 "+esc2(o.region)):"")+(o.web?(" · 🌐 <a href=\""+esc2(o.web)+"\" target=\"_blank\" rel=\"noopener\">weboldal</a>"):"")+"</p><p class=\"small\" style=\"margin:.2rem 0 0\">📅 "+evs.filter(function(e){return !e.demo;}).length+" szervezett esemény</p></div></section>"+
   p5btnish()+
   '<section class="card panel e2sec"><h2>＋ Műveletek</h2><button class="btn btn-primary" id="e2-new">＋ Új túraesemény</button>'+stat+'</section>'+ 
   '<section class="card panel e2sec"><h2>📅 Közelgő</h2>'+(up.length? up.map(function(e){return row(e,1);}).join(""):'<p class="muted">Még nincs közelgő eseményed.</p>')+"</section>"+
   '<section class="card panel e2sec"><h2>🗂️ Piszkozatok</h2>'+(drafts.length? drafts.map(function(e){return row(e,1);}).join(""):'<p class="muted">Nincs piszkozat.</p>')+"</section>"+
   '<section class="card panel e2sec"><h2>✓ Lezárult</h2>'+(done.length? done.map(function(e){return row(e,1);}).join(""):'<p class="muted">Még nincs lezárt esemény.</p>')+"</section></div>"; }
function p5btnish(){ return ""; }
var _e2orig=null;
VIEWS.szervezo = function(){ try{ ensureDemo(); return dash("#/szervezo")( szervezoHtml() ); }catch(e){ return dash("#/szervezo")('<section class="card panel"><h1>🏢 Szervezői központ</h1><p class="muted">A központ most nem érhető el — az adataid érintetlenek.</p></section>'); } };
VIEWS.szervezo.after = function(root){ try{ var reg=root.querySelector("#e2-reg"); if(reg) reg.onclick=function(){ orgForm(); }; var nw=root.querySelector("#e2-new"); if(nw) nw.onclick=function(){ if(!isOrg()){ orgForm(); return; } evForm(null); }; }catch(e){} };

/* ---------- delegált akciók (modal + lap tartalom felett) ---------- */
document.addEventListener("click", function(ev){ var b = ev.target && ev.target.closest ? ev.target.closest("[data-e2join],[data-e2wd],[data-e2cal],[data-e2route],[data-e2edit],[data-e2st],[data-e2app],[data-e2open]") : null; if(!b) return;
  var v;
  if((v=b.getAttribute("data-e2join"))){ joinEv(v); return; }
  if((v=b.getAttribute("data-e2wd"))){ withdraw(v); return; }
  if((v=b.getAttribute("data-e2cal"))){ addToCal(v); return; }
  if((v=b.getAttribute("data-e2open"))){ try{ if(window.v49OpenEv) window.v49OpenEv("p2:"+v); }catch(e){} return; }
  if((v=b.getAttribute("data-e2route"))){ var e2=getEvent(v); if(!e2) return; if(window.__rtopen && e2.routeId && (Store.myData().routes||[]).some(function(r){return r.id===e2.routeId;})){ window.__rtopen(e2.routeId,true); } else toast("Az útvonal a szervező saját GPX-listájában él — itt az összefoglaló látható.","🗺️"); return; }
  if((v=b.getAttribute("data-e2edit"))){ var ev2=ownEvent(v); if(!ev2){ toast("Csak a saját esemény szerkeszthető","🔒"); return; } closeModal(); setTimeout(function(){ evForm(ev2); },120); return; }
  if((v=b.getAttribute("data-e2st"))){ var q=String(v).split(":"); if(!ownEvent(q[0])){ toast("Nem a te eseményed","🔒"); return; } var st=q[1]||"draft"; var e3=ownEvent(q[0]); if(st==="published"&&e3.cap&&counts(e3.id).tot>=e3.cap) st="full"; evStatus(q[0],st); return; }
  if((v=b.getAttribute("data-e2app"))){ orgApplicants(v); return; } });

/* ---------- workspace figyelmeztetés: módosult esemény ---------- */
(function(){ var _pw=VIEWS.workspace&&VIEWS.workspace.after; VIEWS.workspace.after=function(root,id){ try{ _pw&&_pw(root,id); }catch(e){}
  try{ if(!root||!location.hash.startsWith("#/tura/")) return; var t=Store.getTour(id); if(!t) return; var note=changedBannerForTour(t); if(!note) return;
    var act=root.querySelector(".ws-top,.ws-actions,section.card"); if(!act||act.querySelector(".e2note")) return; var box=document.createElement("div"); box.innerHTML=note; act.parentNode.insertBefore(box, act.nextSibling); var sb=box.querySelector("#e2sync"); if(sb) sb.onclick=function(){ var eid=String(t.eventRef).slice(3); var ev=getEvent(eid); if(!ev) return;
      if(ev.name) t.title=ev.name; t.date=ev.date||t.date; t.timeHint=ev.time||t.timeHint; t.place=ev.place||t.place; if(ev.km!=null) t.lengthKm=ev.km; if(ev.up!=null) t.ascent=ev.up; if(ev.h!=null) t.durationH=ev.h; if(ev.diff) t.difficulty=ev.diff; if(ev.coords&&ev.coords.length===2) t.coords={lat:ev.coords[0],lng:ev.coords[1],name:ev.place||t.place}; t.evsRev=ev.rev; Store.save(); toast("Terv frissítve az esemény adataival","🔄"); try{ App.render(); }catch(e2){} }; }catch(e){} }; })();

/* ---------- dashboard mini blokk ---------- */
(function(){ var _pd=VIEWS.dash&&VIEWS.dash.after; VIEWS.dash.after=function(root){ try{ _pd&&_pd(root); }catch(e){}
  try{ if(!root||!root.querySelector||root.querySelector("#e2mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
    var items=[]; try{ (Store.upcoming()||[]).forEach(function(t){ if(t.date) items.push({d:t.date, t:"🥾 "+(t.title||" túra"), sub:"saját terv"}); }); }catch(e){}
    ensureDemo(); var u=myU(); var d=Store.myData(); var joined=P().participants.filter(function(x){ return x.uid===myId() && (x.status==="pending"||x.status==="accepted"); }).map(function(x){ return x.eid; });
    P().events.forEach(function(e){ if(e.status==="published"||e.status==="full"||e.demo){ if(e.date && e.date>=Store.todayISO() && (joined.indexOf(e.id)>-1 || (d.savedEvents||[]).indexOf("p2:"+e.id)>-1)) items.push({d:e.date, t:"📅 "+e.name, sub:(e.demo?"DEMO · ":"")+(e.place||"")}); } });
    items.sort(function(a,b){ return String(a.d).localeCompare(String(b.d)); }); if(!items.length) return;
    var box=document.createElement("section"); box.className="wsec"; box.id="e2mini";
    box.innerHTML='<div class="wpan e2mini"><b>📅 Közelgő túrák és események</b>'+items.slice(0,3).map(function(i){ return '<span class="e2minir"><small>'+esc2(i.d)+"</small><b>"+esc2(i.t.slice(0,44))+"</b><s>"+esc2(i.sub)+"</s></span>"; }).join("")+
      '<a class="btn btn-soft btn-sm" href="#/felfedezes">🗺️ Összes esemény</a></div>';
    var p50=root.querySelector("#p50mini"); if(p50&&p50.parentNode) p50.parentNode.insertBefore(box, p50.nextSibling); else w.appendChild(box); }catch(e){} }; })();

/* ---------- profil V50 blokk ---------- */
(function(){ var _pp=VIEWS.profile&&VIEWS.profile.after; VIEWS.profile.after=function(root){ try{ _pp&&_pp(root); }catch(e){}
  try{ if(root.querySelector("#e2psec")) return; var o=isOrg(); var sec=document.createElement("section"); sec.className="card panel p5-sec"; sec.id="e2psec";
    if(o){ var evs=P().events.filter(function(e){ return e.orgId===o.id && e.status!=="draft"; });
      sec.innerHTML="<h2>🏢 Szervezői profil</h2><div class=\"e2row\"><div><b>"+esc2(o.name)+"</b><span class='mut'>"+evs.length+" esemény"+(o.region?(" · 📍 "+esc2(o.region)):"")+"</span></div><a class='btn btn-soft btn-sm' href='#/szervezo'>Nyitás</a></div>"; }
    else sec.innerHTML="<h2>🏢 Szervezői profil</h2><p class=\"muted\" style=\"margin:0 0 .5rem\">Szervezőként is létrehozhatsz eseményeket — saját eseménylistával és jelentkezés-kezeléssel.</p><button class='btn btn-primary btn-sm' id='e2-preg'>🏢 Szervezői profil létrehozása</button>";
    var last=root.querySelector(".p5 > section:nth-last-child(2)"); (last&&last.nextSibling&&last.parentNode|| (last=root.querySelector(".p5"))).insertBefore(sec, last?last.nextSibling:null); if(!o){ var rr=root.querySelector("#e2-preg"); if(rr) rr.onclick=function(){ orgForm(); }; } }catch(e){} }; })();

/* ---------- nyilvános Események lap bővítése ---------- */
(function(){ var _pe=VIEWS.events, _pea=VIEWS.events&&VIEWS.events.after;
  VIEWS.events=function(){ try{ var base=_pe?_pe.apply(this,arguments):""; ensureDemo(); var today=Store.todayISO();
    var up=P().events.filter(function(e){ return (e.status==="published"||e.status==="full") && e.date>=today; }).sort(function(a,b){ return String(a.date).localeCompare(String(b.date)); });
    var extra='<section class="wrap pub-section tight e2pub"><div class="sect-head"><div><span class="eyeb">PLATFORM</span><h1 class="mb0" style="font-size:1.6rem">📅 Platform események</h1></div></div>'+
      (up.length? up.map(function(e){ var org=P().organizers.find(function(x){return x.id===e.orgId;}); var full=e.cap&&counts(e.id).tot>=e.cap;
        return '<article class="card e2pcard"><b>'+(e.demo?"🧪 ":"📣 ")+esc2(e.name)+(e.demo?' <span class="chip chip-amber">DEMO</span>':"")+'</b><p class="small muted mb0">'+esc2(e.date)+(e.time?(" "+e.time):"")+(e.place?(" · 📍 "+esc2(e.place)):"")+(e.km!=null?(" · "+e.km+" km"):"")+(e.up!=null?(" · +"+e.up+" m"):"")+(full?" · 🔴 Betelt":"")+'</p><p class="small">👥 '+esc2(org?org.name:"")+(org&&org.demo?" (DEMO)":"")+'</p><div style="display:flex;gap:.45rem;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-e2open="'+e.id+'">📖 Részletek</button></div></article>'; }).join("")
       : '<p class="muted">Még nincs elérhető platform-esemény.</p>')+"</section>";
    var footerAt=base.lastIndexOf("<footer");
    return footerAt>=0 ? base.slice(0,footerAt)+extra+base.slice(footerAt) : base+extra; }catch(e){ return _pe?_pe.apply(this,arguments):""; } };
  VIEWS.events.after=function(root){ try{ _pea&&_pea(root); }catch(e){} }; })();

/* ---------- publikus export teszteknek ---------- */
window.__V52=1; window.e2={P:P,isOrg:isOrg,getEvent:getEvent,join:joinEv,withdraw:withdraw,counts:counts,orgForm:orgForm,evForm:evForm,e2Events:window.e2Events,ensureDemo:ensureDemo,ownEvent:ownEvent,szervezoHtml:szervezoHtml};
})();
