/* ===== V48 — 🧠 VEZETŐ TERV („Hogy áll a túrám?”) — READ-ONLY összefoglaló =====
   Nem tervez újra: a Store.readiness/tourCheck, V47 route, V44 weather, packing/food/
   companions/transport/tasks meglévő adatait olvassa. Intézem = navigáció csak. */
(function(){
"use strict";
function X(s){ return esc(s==null?"":String(s)); }
function n0(v){ return v==null?0:(+v||0); }
function fKm(x){ return (Math.round(n0(x)*10)/10).toFixed(1).replace('.',',')+" km"; }
function fM(x){ x=Math.round(n0(x)); return String(x).replace(/\B(?=(\d{3})+(?!\d))/g," "); }
function hhmm(h){ h=n0(h); if(!h) return null; var H=Math.floor(h); return {h:H, p:Math.round((h-H)*60)}; }
function routeOf(t){ try{ var fr=window.rtFmt; return (fr && t.routeId) ? fr.get(String(t.routeId)) : null; }catch(e){ return null; } }

function ckDomains(t, wxLive){
  var rows=[]; var H=n0(t.durationH), P=(t.participants||[]).length, G=t.gear||[], F=t.food||[];
  function lite(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
  var wKg=F.filter(function(f){return /viz|iv(?:o|0)/.test(lite(f.n));}).reduce(function(a,f){return a+(+f.w||0);},0)/1000;
  var d, r=routeOf(t); // ——— GYORS ÁTTEKINTÉS sorrend a spec §5 szerint
  d={k:"utvonal", ic:"🗺️", nm:"Útvonal"};
  if(r){ d.s="ok"; d.line="✓ GPX betöltve · "+fKm(r.distance_km)+(r.elevation_gain_m!=null?" · ⛰️ +"+fM(r.elevation_gain_m)+" m":"")+" · "+(r.nPts||0)+" pont"; }
  else if(t.coords||t.gpx||(t.waypoints||[]).length){ d.s="ok"; d.line="✓ Útvonal megvan (koordináták)"; d.tip="GPX importálása pontosíthatja"; d.goto="utvonal"; d.act="🗺️ GPX importálása"; }
  else { d.s="info"; d.line="ℹ️ Nincs GPX útvonal"; d.act="🗺️ GPX importálása"; d.goto="utvonal"; }
  rows.push(d);
  d={k:"felsz", ic:"🎒", nm:"Felszerelés"};
  if(!G.length){ d.s="bad"; d.line="🔴 Nincs packolási lista"; d.act="🎒 Intézem"; d.goto="felszereles"; }
  else { var packed=G.filter(function(g){return g.checked;});
    if(packed.length===G.length){ d.s="ok"; d.line="✓ "+packed.length+" / "+G.length+" bepakolva"; }
    else { d.s="warn"; d.line="🟠 "+packed.length+" / "+G.length+" bepakolva — "+(G.length-packed.length)+" nincs bejelölve";
      d.miss=G.filter(function(g){return !g.checked;}).slice(0,3).map(function(g){return g.name;});
      d.act="🎒 Intézem"; d.goto="felszereles"; } }
  rows.push(d);
  d={k:"viz", ic:"💧", nm:"Víz"};
  if(!F.length){ d.s="info"; d.line="ℹ️ Nincs megadva vízmennyiség"; d.act="💧 Megnézem"; d.goto="ete"; }
  else if(H>=3 && wKg < (H/2)*Math.max(1,P)*0.75){ d.s="warn"; d.line="🟠 "+wKg.toFixed(1).replace(".",",")+" kg tervezett — az időtartamhoz képest kevésnek tűnik"; d.act="💧 Megnézem"; d.goto="ete"; }
  else { d.s="ok"; d.line="✓ "+wKg.toFixed(1).replace(".",",")+" kg víz tervezve"; }
  rows.push(d);
  d={k:"etel", ic:"🍽️", nm:"Étel"};
  var meals=F.filter(function(f){return !/viz|iv(?:o|0)/.test(lite(f.n));});
  if(meals.length){ d.s="ok"; d.line="✓ "+meals.length+" étel tervben"; } else { d.s="info"; d.line="ℹ️ Nincs ételterv"; d.act="🍽️ Megnézem"; d.goto="ete"; }
  rows.push(d);
  d={k:"tars", ic:"👥", nm:"Társak"}; if(!P){ d.s="ok"; d.line="✓ Egyéni túra"; }
  else { var jo=t.participants.filter(function(p){return p.confirmed||p.stat==="jön";}).length;
    var no=t.participants.filter(function(p){return p.stat==="nem";}).length;
    var varr=P-jo-no;
    if(varr>0){ d.s="warn"; d.line="👥 "+P+" résztvevő · ✓ "+jo+" jön"+(varr?" · 🟠 "+varr+" nem válaszolt":"")+(no?" · ✕ "+no+" nem jön":""); d.act="👥 Intézem"; d.goto="resztvevok"; }
    else if(no>0){ d.s="warn"; d.line="👥 "+jo+" jön · "+no+" nem jön — ültetés/étel áttervezendő"; d.act="👥 Intézem"; d.goto="resztvevok"; }
    else { d.s="ok"; d.line="✓ Minden résztvevő visszaigazolta ("+jo+")"; } }
  rows.push(d);
  d={k:" kozleked".trim(), ic:"🚗", nm:"Közlekedés"};
  var meet=!!(t.meeting||t.startPoint||t.meetingTime||t.travelMode), car=(t.cars||[]).length>0;
  if(!meet&&!car){ d.s="bad"; d.line="🔴 Közlekedés nincs megtervezve"; d.act="🚗 Intézem"; d.goto="utazas"; }
  else if(meet!=car || !t.meeting || !t.arrival || (t.cars||[]).some(function(c){return !(c.assigned||[]).length;}) && P>0){ d.s="warn"; d.line="🟠 Részben tervezve — ellenőrizd a részleteket"; d.act="🚗 Intézem"; d.goto="utazas"; }
  else { d.s="ok"; d.line="✓ Közlekedés rendezve" + (P? " ("+(t.cars||[]).reduce(function(a,c){return a+(c.seats||0);},0)+" ülőhely)":""); }
  rows.push(d);
  d={k:"teendo", ic:"☑️", nm:"Teendők"}; var tk=(t.tasks||[]).filter(function(x){return !x.done;});
  if(!(t.tasks||[]).length){ d.s="info"; d.line="ℹ️ Nincs feladat rögzítve"; d.goto="teendok"; }
  else if(tk.length){ d.s="warn"; d.line="🟠 "+tk.length+" nyitott feladat"; d.miss=tk.slice(0,3).map(function(x){ return (x.who? x.who+" — ":"")+x.label; }); d.act="☑️ Intézem"; d.goto="teendok"; }
  else { d.s="ok"; d.line="✓ minden feladat kész ("+t.tasks.length+")"; }
  rows.push(d);
  d={k:"idojaras", ic:"🌦️", nm:"Időjárás"};
  if(t.weatherChecked && (wxLive||t.weather)){ var w=wxLive||t.weather; d.s="ok"; d.line="✓ "+(w.ico||"")+" "+String(w.tmin!=null?w.tmin+"–":""), (w.tempMax!=null?w.tempMax:"—")+"°"+(w.rain!=null?" · eső "+w.rain+"%":"")+(w.nowTemp!=null?" · most "+w.nowTemp+"°":""); d.line="✓ Időjárás ellenőrizve"+(w.rain!=null?" (eső "+w.rain+"%, "+(w.tmin!=null?w.tmin+"–"+w.tmax:"—")+"°)":""); }
  else if(wxLive){ d.s="warn"; d.line="🟠 "+(wxLive.ico||"🌦️")+" megvan az előrejelzés — jelöld ellenőrzöttnek a lap tetején"; d.goto="utvonal"; }
  else if(!t.weather){ d.s="info"; d.line="ℹ️ Nincs elérhető előrejelzés"; d.goto="utvonal"; }
  else { d.s="warn"; d.line="🟠 Időjárás van az adatbázisban, de nincs jóváhagyva"; d.act="🛏 Megnyitom"; d.goto="utvonal"; }
  rows.push(d);
  return rows;
}
function ckOverall(rows){ var bad=rows.filter(function(x){return x.s==="bad";}); var warn=rows.filter(function(x){return x.s==="warn";});
  if(bad.length) return {k:"bad", t:"🔴 TERVEZÉSI PROBLÉMA", sub:"Ezek nélkül a terv nem mehet tovább:"};
  if(warn.length) return {k:"warn", t:"🟠 FIGYELMET IGÉNYEL", sub:"A jelenlegi adatok alapján több pont is rendezendő."};
  return {k:"ok", t:"🟢 JÓL TERVEZHETŐ", sub:"A jelenlegi terv alapján nem találtunk fontos hiányosságot."}; }
function ckProblems(rows){ var p=[];
  rows.forEach(function(d){ if(d.s==="bad"||d.s==="warn") p.push(d); if(d.s==="ok"||d.s==="warn"||d.s==="bad"){} });
  // a weather-extra: ha van esőjelzés a packolásban... (v44 weather adatai már benne vannak az idomainben)
  return p.slice(0,5); }
function ckHead(t){ var r=Store.readiness(t), c;
  var head=["<div class=\"ck-top\"><div class=\"ck-pct\"><b>"+r.pct+"%</b><span>készültség (ugyanaz, mint a dashboard)</span></div><div class=\"ck-meta\">"];
  c=[]; if(n0(t.lengthKm)) c.push("📏 "+fKm(t.lengthKm));
  if(n0(t.ascent)) c.push("⛰️ +"+fM(t.ascent)+" m");
  var hm=hhmm(t.durationH); if(hm) c.push("🕐 "+hm.h+"ó"+(hm.p?" "+hm.p+"p":""));
  if(t.date) c.push("📅 "+X(t.date));
  head.push(c.length?("<span>"+c.join("</span><span>")+"</span>"):"<span class=\"muted\">—</span>");
  head.push("</div></div>");
  return head.join(""); }
function ckHTML(t, rows, overall, isGreen, wxHint){
  var o=[]; o.push("<div class=\"ck-wrap\">");
  o.push("<p class=\"small muted\" style=\"margin:0 0 .5rem\">A jelenlegi túraterved alapján — <b>"+X(t.title||"")+"</b></p>");
  o.push(ckHead(t));
  o.push("<div class=\"ck-main "+overall.k+"\">"+overall.t+(overall.k==="ok"?"<p class=\"small mb0\" style=\"margin:.2rem 0 0\">"+overall.sub+"</p>":"")+"</div>");
  var probs=ckProblems(rows);
  if(isGreen)
    o.push("<div class=\"ck-next green\"><b>🎯 Következő lépés</b><p class=\"mb0\" style=\"margin:.15rem 0 0\">Nincs fontos teendő — a terv vezetési szempontból kész. <span class=\"small muted\">(A ✓ jelölés csak azt fedi le, amit mi is ellenőriztünk a te adataid alapján.)</span></p></div>");
  else { var n=probs[0];
    o.push("<div class=\"ck-next\"><b>🎯 Következő lépés</b><p class=\"ck-next-l\" style=\"margin:.15rem 0 .35rem\">\""+X((n.line||"").replace(/^[✓🟠🔴ℹ️]\s*/,""))+"\"</p>"+
    (n.act?("<button class=\"btn btn-primary btn-sm\" data-ckgoto=\""+n.goto+"\" data-ckact=\""+(n.k==="utvonal"&&n.act&&n.act.indexOf("GPX")>-1?"gpx":"nav")+"\">"+X(n.act)+"</button>"):"")+
    "<span class=\"small muted\" style=\"margin-left:.5rem\">"+(probs.length>1?("további "+(probs.length-1)+" figyelendő"):"")+"</span></div>"); }
    o.push("<details class=\"ck-det\""+(overall.k==="ok"?"":" open")+"><summary><b>Túra állapota — gyors áttekintés</b></summary>"+
    "<div class=\"ck-list\">"+rows.map(function(d){
      var s={ok:"✓",warn:"🟠",bad:"🔴",info:"ℹ️"}[d.s];
      return "<div class=\"ck-row\">"+d.ic+" <b>"+d.nm+"</b> <span class=\"ck-st st-"+d.s+"\">"+s+"</span><span class=\"ck-line\">"+d.line+"</span>"+
        (d.goto && d.s!=="ok" ? "<button class=\"btn btn-ghost btn-sm\" data-ckgoto=\""+d.goto+"\" data-ckact=\""+(d.k==="utvonal"&&d.act&&d.act.indexOf("GPX")>-1?"gpx":"nav")+"\">"+(d.act||"Megnyitom")+"</button>" : (d.act&&d.s==="ok"?"":"")) +
        (d.miss&&d.miss.length?"<div class=\"ck-miss\">"+d.miss.map(X).join(" · ")+"</div>":"")+"</div>"; }).join("")+
    "</div></details>");
  if(probs.length>1) o.push("<div class=\"ck-probs\"><b>Figyelendő pontok</b>"+probs.slice(1).map(function(d){
    return "<div class=\"ck-prow "+(d.s==="bad"?"bad":"warn")+"\"><span>"+d.ic+"</span>"+X(d.line)+(d.goto?"<button class=\"btn btn-ghost btn-sm\" data-ckgoto=\""+d.goto+"\">Intézem</button>":"")+"</div>"; }).join("")+"</div>");
  o.push("<div class=\"ck-foot\"><button class=\"btn btn-soft\" id=\"ck-re\">🔄 Újraelemzem</button>"+
    (isGreen?"<a class=\"btn btn-primary\" id=\"ck-go\" href=\"#/turamod/"+ t.id +"\">🥾 Indulok</a>":"<button class=\"btn btn-ember\" id=\"ck-fix\" data-ckgoto=\""+(probs[0]&&probs[0].goto||"attekintes")+"\">🛠️ Terv javítása</button>")+
    "</div></div>");
  return o.join(""); }

async function openCockpit(t, forceLive){
  if(!t) return;
  var wxLive=null;
  if(!t.weatherChecked && (!t.weather || t.weather.at && Date.now()-new Date(t.weather.at) > 3*3600e3)) {
    try{ if(window.rvwWeatherFresh){ var w=await window.rvwWeatherFresh(t); if(w && w!=="NOLONG") wxLive=w; } }catch(e){}
  } else if(t.weather) wxLive=t.weather;
  function paint(){
    var rows=ckDomains(t, wxLive);
    var overall=ckOverall(rows); var isGreen=overall.k==="ok";
    try{ openModal({ title:"🧠 Hogy áll a túrám?",
      body:ckHTML(t, rows, overall, isGreen, wxLive), footer:"",
      onOpen:function(m){
        m.querySelectorAll("[data-ckgoto]").forEach(function(b){ b.onclick=function(e){
          var a=b.getAttribute("data-ckact");
          if(a==="gpx"){ closeModal(); try{ window.openGPXImport({tripId:t.id}); }catch(err){} return; }
          // navigáció a MEGLÉVŐ modulhoz
          var tab=b.dataset.ckgoto;
          try{ if(tab==="utvonal"||tab==="idoter"){ wsTab=tab; } else { wsTab=tab; } }catch(err){}
          closeModal(); NAV.to("#/tura/"+t.id); }; });
        var re=m.querySelector("#ck-re"); if(re) re.onclick=function(){ openCockpit(t, true); };
      }}); }catch(e){ }
  } paint();
  }
window.openCockpit=openCockpit;

/* ---------- gombok: workspace fejléc + dashboard ---------- */
var _ckWa = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ try{ _ckWa && _ckWa(root,id); }catch(e){}
  try{ var t=Store.getTour(id); if(!t||!root) return;
    var act=root.querySelector(".ws-actions");
    if(act && !root.querySelector("#btn-cockpit")){ var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="btn-cockpit";
      b.innerHTML="🧠 Hogy áll a túrám?"; b.onclick=function(){ openCockpit(t); }; act.appendChild(b); } }catch(e){} };
var _ckDa = VIEWS.dash.after;
VIEWS.dash.after = function(root){ try{ _ckDa && _ckDa(root); }catch(e){}
  try{ if(!root) return; var nx=(typeof Store!=="undefined"&&Store.upcoming)?Store.upcoming()[0]:null;
    if(!nx) return; var sec=root.querySelector('[data-w="readi"]'); if(!sec||sec.querySelector("#dash-ck")) return;
    var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="dash-ck"; b.textContent="🧠 Áttekintem";
    b.style.marginLeft=".45rem"; b.onclick=function(){ openCockpit(nx); };
    var anchor=sec.querySelector("#dash-rvw2")||sec.querySelector("#dash-rvw")||sec.querySelector("#dash-rdi")||sec.querySelector("#dash-rdi2"); if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(b, anchor.nextSibling); }catch(e){} };
window.__V48=1;
})();
