/* V44 – §20: „Nézd át a túrámat!” — olvasó-ellenőrző modal. Nem ír a projektbe; csak Intézem-gomb után. */
(function(){
"use strict";
function ensureTourFields(t){ if(!t.tasks) t.tasks=[]; if(!t.noteStream) t.noteStream=[]; return t; }
function normC(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function rvwHas(t, rx){ return (t.gear||[]).some(function(g){ return rx.test(normC(g.name)); }); }
function rvwAddGear(t, label, rx){
  if(rvwHas(t, rx)){ toast("Ez már szerepel a csomaglistán","🎒"); return false; }
  var eq=(Store.myData().equipment||[]).find(function(e){ return rx.test(normC(e.name)); });
  t.gear.push({ name:(eq?eq.name:label), cat:(eq&&eq.cat)||"Egyéb", icon:"🧰", w:eq?(+eq.w||450):450,
    checked:false, own:!!eq, note:"Nézd át — javasolt" });
  Store.save(); return true;
}
function rvwWeatherFresh(t){
  var key=(t.date||"nodb")+"|"+((t.coords&&t.coords.lat)||0)+"|"+(t.place||t.region||"");
  window.__rvwW = window.__rvwW || {};
  var C=window.__rvwW;
  if(C[key] && C[key].at && Date.now()-C[key].at < 5*60*1000) return Promise.resolve(C[key].w);
  var lat,lng;
  if(t.__wc){ lat=t.__wc.lat; lng=t.__wc.lng; }
  else if(t.coords && +t.coords.lat){ lat=+t.coords.lat; lng=+t.coords.lng; }
  else if(t.place || t.region){
    return fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(String(t.place||t.region).slice(0,40))+"&count=1&language=hu")
      .then(function(r){return r.json();}).then(function(g){
        if(!g.results||!g.results[0]) return null;
        var c={lat:g.results[0].latitude,lng:g.results[0].longitude};
        try{ Object.defineProperty(t,"__wc",{value:c,enumerable:false,configurable:true}); }catch(e){}
        var day=(t.date&&/^\d{4}-\d\d-\d\d$/.test(t.date))?t.date:Store.todayISO();
        return fetch("https://api.open-meteo.com/v1/forecast?latitude="+c.lat+"&longitude="+c.lng+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&start_date="+day+"&end_date="+day+"&timezone=auto")
          .then(function(rr){return rr.json();}).then(function(j){ var d0=j.daily||{};
            var w={ rain:+(d0.precipitation_probability_max&&d0.precipitation_probability_max[0]||0),
              tmax:Math.round((d0.temperature_2m_max&&d0.temperature_2m_max[0])||0),
              tmin:Math.round((d0.temperature_2m_min&&d0.temperature_2m_min[0])||0),
              wind:Math.round((d0.wind_speed_10m_max&&d0.wind_speed_10m_max[0])||0),
              code:(d0.weather_code&&d0.weather_code[0])||0 };
            C[key]={at:Date.now(),w:w}; return w; }).catch(function(){ return null; });
      }).catch(function(){ return null; });
  } else return Promise.resolve(null);
  if(!lat) return Promise.resolve(null);
  var day=(t.date&&/^\d{4}-\d\d-\d\d$/.test(t.date))?t.date:null;
  if(!day) return Promise.resolve(null);
  var dd=Store.dayDiff(day);
  if(dd<-1||dd>14) return Promise.resolve("NOLONG");
  var url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max"+
    "&start_date="+day+"&end_date="+day+"&timezone=auto";
  return fetch(url).then(function(r){return r.json();}).then(function(j){
    var d=j.daily||{};
    var w={ rain:+(d.precipitation_probability_max&&d.precipitation_probability_max[0]||0),
      tmax:Math.round((d.temperature_2m_max&&d.temperature_2m_max[0])||0),
      tmin:Math.round((d.temperature_2m_min&&d.temperature_2m_min[0])||0),
      wind:Math.round((d.wind_speed_10m_max&&d.wind_speed_10m_max[0])||0),
      code:(d.weather_code&&d.weather_code[0])||0 };
    C[key]={at:Date.now(),w:w}; return w; }).catch(function(){ return null; });
}
var RVW_STEPS=["Túra adatai","Időjárás","Felszerelés","Étel és víz","Társak","Idővonal","Közlekedés"];

function tourReview(t){
  ensureTourFields(t);
  openModal({ title:"🔍 Túra ellenőrzése — "+esc(t.title),
    body:'<p class="muted small mt0" id="rvw-status"></p><div id="rvw-body" style="margin-top:.4rem"></div>',
    footer:"",
    onOpen: function(mr){
      var stat=mr.querySelector("#rvw-status"), body=mr.querySelector("#rvw-body");
      stat.innerHTML = RVW_STEPS.map(function(s,i){ return '<span class="sp-step'+(i?'':' on')+'">'+s+'</span>'; }).join(" ");
      var si=-1;
      var tick=setInterval(function(){ si++;
        stat.querySelectorAll(".sp-step").forEach(function(el,k){ el.classList.toggle("done",k<=si); });
        if(si>=RVW_STEPS.length-1){ clearInterval(tick); run(); } },85);

      function actBtn(a,item){ if(!a) return ""; var enc=encodeURIComponent(JSON.stringify(a));
        return '<button class="btn btn-soft btn-sm" data-rvw-jump="'+enc+'">'+esc(a.l)+'</button>'; }
      function rowOf(x, lvl){ return '<div class="rvw-row"><span>'+(lvl==="i"?"🔴 ":"🟠 ")+x.t+'</span>'+actBtn(x.a,x)+'</div>'; }

      function run(){
        stat.innerHTML = RVW_STEPS.map(function(s){ return '<span class="sp-step done">✓ '+s+'</span>'; }).join(" ");
        var imp=[], att=[], okL=[], info=[]; var nFix=0;
        rvwWeatherFresh(t).then(function(wxRes){
          var wx = (wxRes && wxRes!=="NOLONG") ? wxRes : (t.weather||null);
          var rd=Store.readiness(t), H=+t.durationH||0, P=(t.participants||[]).length;
          if(!wxRes && t.weather){ wx=t.weather; }
          if(wxRes==="NOLONG") info.push("ℹ️ Ehhez a dátumhoz még nincs elérhető időjárási előrejelzés.");
          if(!wxRes && wxRes!=="NOLONG") info.push("ℹ️ Időjárási adat jelenleg nem érhető el ehhez a helyszínhez.");

          if(!t.date) info.push("ℹ️ A túra időpontja nincs megadva.");
          if(t.coords||t.gpx|| (t.waypoints&&t.waypoints.length)) okL.push("🧭 Útvonal rendben"); else info.push("ℹ️ Az útvonal részletei még hiányoznak.");

          if(wx){
            var rainy=(wx.rain>=40);
            if(rainy && !rvwHas(t,/kabat|waterproof|esok/)){ imp.push({t:"Eső várható a túra idején ("+wx.rain+"%), de esőkabát nincs a pakoláson.", a:{l:"+ Pakoláshoz", g:"Esőkabát", rx:"kabat|esok"}, rx:"kabat|esok"}); nFix++; }
            else if(rainy) okL.push("🌧️ Esőre felkészültél");
            else okL.push("🌤️ Időjárás: száraznak ígérkezik ("+wx.rain+"% eső)");
            if(wx.tmin<=3 && !rvwHas(t,/meleg|polart|pulover|sapka|kesztyu|reka/)){ att.push({t:"Hideg reggel ("+wx.tmin+"°C) — meleg réteg nincs a listán.", a:{l:"+ Pakoláshoz", g:"Meleg réteg", rx:"meleg|polart|pulover"}, rx:"meleg|poly|pulover|sapka"}); nFix++; }
            if(wx.wind>=35 && (+t.ascent||0)>=450){ att.push({t:"Erős szél ("+wx.wind+" km/h) és kitett, magas útvonal — jó előre számolni vele.", a:{l:"🕐 Idővonal", w:"idoter"}}); nFix++; }
          }
          var nightStart = (t.timeline&&t.timeline.length&&t.timeline[0].t && t.timeline[0].t < "06:30");
          if(nightStart && !rvwHas(t,/fejla|lamp|hlanl/)){ att.push({t:"Sötét indulás ("+t.timeline[0].t+") — fejlámpa nem szerepel a csomaglistán.", a:{l:"+ Pakoláshoz", g:"Fejlámpa", rx:"fejl|lamp"}, rx:"fejl|lamp"}); nFix++; }

          if(!(t.gear||[]).length){ imp.push({t:"Nincs csomaglista a túrához.", a:{l:"🗺️ Tervező megNyitása", open:"kit"}}); nFix++; }
          else { var un=t.gear.filter(function(g){return !g.checked;}).length, own=t.gear.filter(function(g){return g.own;}).length;
            okL.push("🎒 "+t.gear.length+" elem a listán"+(own?" · "+own+" saját tárós":""));
            if(un){ att.push({t:un+" elem még nincs bepipálva.", a:{l:"🎒 Pakoláshoz", w:"felszereles"}}); nFix++; } else okL.push("🟢 Csomaglista kipipálva"); }
          if(t.weather && !t.weatherChecked){ att.push({t:"☀️ Az időjárást a projektben még nem jelölted ellenőrzöttnek.", a:{l:"✔ Megjelölöm", markwx:1}}); nFix++; }
          var waterKg=(t.food||[]).reduce(function(a,f){ return /viz|iv|water/i.test(normC(f.n))?a+(+f.w||0):a; },0)/1000;
          if(!(t.food||[]).length){ att.push({t:"Nincs étel/víz terv.", a:{l:"💧 Módosítom", w:"ete"}}); nFix++; }
          else if(H>=3 && P>=0 && waterKg < (H/2)*(P||1)*0.75){ att.push({t:"Víz: "+waterKg.toFixed(1)+" l tervezett — a távhoz képest kevésnek tűnik.", a:{l:"💧 Módosítom", w:"ete"}}); nFix++; }
          else okL.push("🟢 Étel és víz rendben");
          var conf=t.participants.filter(function(p){return p.confirmed||p.stat==="jön";}).length;
          var dec=t.participants.filter(function(p){return p.stat==="nem";}).length;
          if(P===0){ info.push("👥 Nincs résztvevő — egyedül mész?"); }
          else if(dec){ att.push({t:dec+" résztvevő nem jön — ültetés/étel eshet át.", a:{l:"👥 Megnézem", w:"resztvevok"}}); nFix++; }
          else if(conf<P){ att.push({t:(P-conf)+" résztvevő még nem erősítette meg.", a:{l:"👥 Megnézem", w:"resztvevok"}}); nFix++; }
          else okL.push("👥 Mindenki visszaigazolta");
          if(!(t.timeline||[]).length){ att.push({t:"Az idővonal még nincs megtervezve.", a:{l:"🕐 Tervezem", w:"idoter"}}); nFix++; }
          else if(t.timeline.length<3){ att.push({t:"Idővonal csak "+t.timeline.length+" pontból áll — érdemes kiegészíteni.", a:{l:"🕐 Tervezem", w:"idoter"}}); }
          else okL.push("🕐 Idővonal rendben");
          var hasMeet=!!(t.meeting||t.startPoint||t.meetingTime||t.travelMode), hasCar=(t.cars||[]).length>0;
          if(!hasMeet && !hasCar){ att.push({t:"A közlekedés még nincs megtervezve.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else if(hasMeet!==hasCar || (hasCar && !t.meeting) || (hasCar && !t.meetingTime)){ att.push({t:"Közlekedés részleges: találkozási pont/idő vagy autó hiányzik.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else if(P>0 && !t.cars.some(function(c){return (c.assigned||[]).length;})){ att.push({t:"Senki sincs beosztva az autókba.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else okL.push("🚗 Közlekedés rendben");
          var openT=t.tasks.filter(function(x){return !x.done;});
          if(openT.length){ var li=openT.slice(0,3).map(function(x){return "□ "+esc((x.who?x.who+" — ":"")+x.label);}).join("<br>");
            att.push({t:"Még "+openT.length+" teendő: "+li, a:{l:"📋 Feladatok", w:"teendok"}}); nFix++; }
          else if(t.tasks.length) okL.push("📋 Minden teendő kész");
          if(!(t.budget||[]).length) info.push("ℹ️ Nincsenek rögzített költségek — a Költségek fülön vezetheted.");
          var ready = imp.length===0 && att.length===0;
          var html='<div class="rvw-head"><span class="rvw-pct">'+rd.pct+'%</span><b>🥾 Túra készültsége: '+rd.pct+'%</b><span class="small muted"> · '+(nFix?nFix+" dologra még érdemes figyelned":"minden rendben")+'</span></div>';
          if(ready){ html+='<div class="alert-strip"><span>🎉</span><div>A(z) <b>'+esc(t.title)+'</b> túrád készen áll! <div class="small" style="margin-top:.3rem">'+okL.slice(0,6).map(function(o){return "🟢 "+esc(typeof o==="string"?o:o.t);}).join(" · ")+'</div></div></div><p class="small muted">Minden fontos előkészület rendben van.</p>'; }
          else{
            if(imp.length){ html+='<h3 class="rvw-h">🔴 Fontos ('+imp.length+')</h3>'+imp.map(function(x){return rowOf(x,"i");}).join(""); }
            if(att.length){ html+='<h3 class="rvw-h">🟠 Figyelj rá ('+att.length+')</h3>'+att.map(function(x){return rowOf(x,"a");}).join(""); }
            if(okL.length){ html+='<div class="rvw-okwrap"><b class="small">🟢 Rendben</b>'+okL.map(function(o){return '<p class="small" style="margin:.22rem 0">• '+esc(typeof o==="string"?o:o.t)+'</p>';}).join("")+'</div>'; }
            if(info.length){ html+='<div class="rvw-info">'+info.map(function(x){return '<p class="small muted" style="margin:.25rem 0">'+x+'</p>';}).join("")+'</div>'; }
          }
          html+='<div class="flex" style="margin-top:.8rem;justify-content:space-between;gap:.5rem"><button class="btn btn-ghost btn-sm" id="rvw-again">🔄 Újra ellenőrzöm</button><button class="btn btn-primary btn-sm" data-close>Kész</button></div>';
          body.innerHTML=html; wire();
        });
      }
      function wire(){
        body.querySelectorAll("[data-rvw-jump]").forEach(function(b){ b.onclick=function(){ var a; try{a=JSON.parse(decodeURIComponent(b.dataset.rvwJump));}catch(e){return;}
          var t2=Store.getTour(t.id); if(!t2) return;
          if(a.g){ if(rvwAddGear(t2, a.g, new RegExp(a.rx||a.g,"i"))) toast(a.g+" bekerült a csomaglistába","🎒"); }
          else if(a.markwx){ t2.weatherChecked=true; Store.save(); toast("Időjárás ellenőrzöttnek jelölve","✔"); }
          else if(a.open==="kit"){ closeModal(); var el=document.getElementById("btn-ai"); if(el) el.click(); return; }
          else if(a.w){ closeModal(); wsTab=a.w; render(); return; }
          run(); }; });
        var ag=body.querySelector("#rvw-again"); if(ag) ag.onclick=function(){ run(); };
      }
    }});
}
window.tourReview = tourReview;
window.rvwWeatherFresh = rvwWeatherFresh;

/* V43 után: workspace-gomb + dashboard bővítés */
(function(){
  var _v44wa = VIEWS.workspace.after;
  VIEWS.workspace.after = function(root,id){ _v44wa&&_v44wa(root,id);
    try{ var act=root.querySelector(".ws-actions");
      if(act && !document.getElementById("btn-rvw")){
        var b=document.createElement("button"); b.className="btn btn-primary btn-sm"; b.id="btn-rvw"; b.innerHTML="🔍 Nézd át a túrámat";
        b.onclick=function(){ var t=Store.getTour(id); if(t) tourReview(t); };
        act.appendChild(b); } }catch(e){} };
  var _v44da = VIEWS.dash.after;
  VIEWS.dash.after = function(root){ _v44da&&_v44da(root);
    try{ var rb=root.querySelector("#dash-rdi"); var nx=Store.upcoming()[0];
      if(rb && nx){ var c=Store.tourCheck(nx);
        if(c.pct>=100){ rb.outerHTML='<button class="btn btn-soft btn-sm" id="dash-rvw">🎉 Készen áll</button>'; var e2=root.querySelector("#dash-rvw"); e2.onclick=function(){tourReview(nx)}; }
        else{ var hint=document.createElement("span"); hint.className="muted small"; hint.textContent=" A következő túrád ellenőrzésre vár."; rb.parentNode.insertBefore(hint, rb.nextSibling);
          var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="dash-rvw2"; b.innerHTML="🔍"; b.title="Nézd át a túrámat"; b.onclick=function(){tourReview(nx);}; rb.parentNode.insertBefore(b, hint.nextSibling); } } }catch(e){} };
})();
window.__V44MODULE = 1;
})();