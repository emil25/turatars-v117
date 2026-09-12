/* ============ V49 — 🗺️ TÚRAFELFEDEZŐ + TÚRAESEMÉNY-GYŰJTŐ ============
   A meglévő valós katalógusra (TOURS/EVENTS) épülő appnézet a #/felfedezes útvonalon.
   CTA: 🗓️ Tervet készítek → newTourFromDraft + extRef dedup | ❤️ → wishlist ref
   | esemény→projekt eventRef-fel | route: V47 | DEMO utak jelölve. SEMMI kitalált külső adat. */
(function(){
"use strict";
var f9={ tab:"tours", q:"", region:"", diff:"", dist:"", elev:"", sort:"", weekend:false, csucs:false, loc:null, locMsg:"" };
function nz(v,k){ return (v===null||v===undefined||v==="")?(k||"—"):v; }
function esc9(x){ return esc(x==null?"":String(x)); }
function refOf(kind,id){ return "f9:"+kind+":"+id; }
function CAT_T(){ return window.v122PublicTours?window.v122PublicTours():((typeof TOURS!=="undefined")?TOURS:[]); }
function CAT_E(){ var base=window.v122PublicEvents?window.v122PublicEvents():((typeof EVENTS!=="undefined")?EVENTS:[]); try{ var ex=(window.e2Events?window.e2Events():[]).filter(function(e){return !e.demo;}); return ex&&ex.length?base.concat(ex):base; }catch(e){ return base; } }
function hasWish(ref){ var d=Store.myData(); return (d.wishlist||[]).some(function(w){return w.ref===ref;}); }
function tourByRef(ref){ var d=Store.myData(); return (d.tours||[]).find(function(t){return t.extRef===ref;}); }
function ctaFor(kind,it){
  var ref=refOf(kind,it.id); var wished=hasWish(ref); var have=tourByRef(ref);
  var heart = wished ? '<span class="chip chip-green">❤️ Bakancslistán</span>'
        : '<button class="btn btn-soft btn-sm" data-f9w="'+kind+":"+it.id+'">❤️ Bakancslistára</button>';
  var plan  = have ? '<button class="btn btn-ghost btn-sm" data-f9open="'+have+'">🗓️ van terved — megnyitom</button>'
        : '<button class="btn btn-primary btn-sm" data-f9plan="'+kind+":"+it.id+'">🗓️ Tervet készítek</button>';
  return { heart:heart, plan:plan };
}
function imgTagSafe(x,label){ try{ return imgTag(x,label); }catch(e){ return ""; } }
function card(t){
  try{ var c=ctaFor("t",t);
  return '<article class="f9card card" data-id="'+t.id+'">'+
    '<div class="img-wrap f9-img">'+imgTagSafe(t.img||IMG.erdo,t.name)+'</div>'+
    '<div class="f9-b"><div class="f9-t1"><b>'+esc9(t.name)+'</b>'+(t.rating?'<span class="chip chip-sand">⭐ '+t.rating+(t.reviews?'('+t.reviews+')':'')+'</span>':'')+'</div>'+
    '<p class="small muted mb0">'+esc9(nz(t.region,'régió nélkül'))+' · 📍 '+esc9(nz(t.start?t.start.name:null,'nincs hely'))+'</p>'+
    '<p class="small mb0" style="margin:.2rem 0 .5rem">📏 '+nz(t.km!=null?t.km+" km":null)+' · ⛰️ '+nz(t.up!=null?"+"+t.up+" m":null)+' · 🕐 '+nz(t.h!=null?t.h+" ó":null)+' · 🥾 '+nz(t.diff)+'</p><p class="tiny muted">'+(window.v123RouteLabel?window.v123RouteLabel(t):(t.gpxUrl?"GPX útvonal elérhető":"Útvonaladat még nem érhető el"))+'</p>'+(window.v122SourceLine?v122SourceLine(t):'')+
    '<div class="f9cta"><button class="btn btn-ghost btn-sm" data-f9tour="'+t.id+'">🥾 Megnézem</button>'+c.plan+c.heart+'</div></div></article>';
  }catch(e){ return ""; }
}
function ecard(e){
  try{ var c=ctaFor("e",e); var base=CAT_T().find(function(t){return t.id===e.tour;});
  var meta='📅 '+nz(e.date,e.time?e.date:null,'dátum nélkül')+(e.time?' '+e.time:'');
  if(base){ meta+=' · 📏 '+base.km+' km · ⛰️ +'+base.up+' m'; } else if(e.km!=null){ meta+=' · 📏 '+e.km+' km'+(e.up!=null?' · ⛰️ +'+e.up+' m':''); }
   return '<article class="f9card card ecard9"><div class="f9-b"><div class="f9-t1"><b>📣 '+esc9(e.name)+'</b>'+(e.cat?'<span class="chip chip-sand">'+esc9(e.cat)+'</span>':'')+'</div>'+
    '<p class="small muted mb0">'+meta+(e.place?' · 📍 '+esc9(e.place):'')+(e.diff?' · 🥾 '+esc9(e.diff):'')+(e.org?' · 👥 '+esc9(e.org):'')+'</p>'+
    '<p class="small mb0 f9-src">'+(e.src?'<a href="'+esc9(e.src)+'" target="_blank" rel="noopener nofollow">🔗 Forrás: eredeti oldal ↗</a>':'')+'</p>'+(window.v122SourceLine?v122SourceLine(e):'')+
    '<div class="f9cta"><button class="btn btn-ghost btn-sm" data-f9ev="'+e.id+'">📖 Részletek</button>'+c.plan+c.heart+'</div></div></article>';
  }catch(e2){ return ""; }
}
function peakList(){
  var seen={}, out=[];
  CAT_T().forEach(function(x){
    var p=(x.name||"").split(/[–—-]/)[0].trim(); if(!p) return; var k=p.toLowerCase();
    if(!seen[k]){ seen[k]={name:p, region:x.region||"", n:0, up:null}; out.push(seen[k]); }
    seen[k].n++; if(!seen[k].up && x.up && x.up>500) seen[k].up=x.up;
  });
  return out;
}
function pcard(h){
  return '<article class="f9card card"><div class="f9-b"><div class="f9-t1"><b>🏔️ '+esc9(h.name)+'</b></div>'+
   '<p class="small muted mb0">'+esc9(nz(h.region,'régió nélkül'))+' · '+h.n+' túra a katalógusban · '+(h.up?'⛰️ +'+h.up+' m (katalógus)':'magasság: nincs adat')+'</p>'+
   '<div class="f9cta"><button class="btn btn-primary btn-sm" data-f9peak="'+esc9(h.name)+'">🥾 Túrák itt</button></div></div></article>';
}
function kvMile(o){ return o.distance_km?((Math.round(o.distance_km*10)/10).toFixed(1).replace(".",",") + " km"):"—"; }
function rcard(o,own){
  if(own){ return '<article class="f9card card"><div class="f9-b"><div class="f9-t1"><b>🗺️ '+esc9(o.name||"Névtelen útvonal")+'</b></div>'+
   '<p class="small muted mb0">📏 '+kvMile(o)+' · ⛰️ '+(o.elevation_gain_m!=null?'+'+o.elevation_gain_m+' m':'—')+' · '+(o.created_at?new Date(o.created_at).toLocaleDateString("hu-HU")+" óta":"")+(o.linkedTripId?' · 🥾 projektedhez kapcsolt':'')+'</p>'+
   '<div class="f9cta"><button class="btn btn-soft btn-sm" data-f9route="'+o.id+'">🗺️ Részletek</button></div></div></article>'; }
  return '';
}
/* ——— szűrők, geo, lista ——— */
function nearWeek(datestr){ if(!datestr) return false; try{ var d=new Date(datestr+"T12:00:00"); var now=new Date(); var sat=new Date(now); var day=sat.getDay(); sat.setDate(sat.getDate()+((6-day+7)%7)); sat.setHours(6,0,0,0); var mon=new Date(sat); mon.setDate(sat.getDate()+2); return d>=sat && d<mon; }catch(e){ return false; } }
function tourMatch(t){
  try{ var q1=f9.q.toLowerCase().trim();
  if(q1 && (String(t.name)+" "+(t.region||"")+" "+(t.start?t.start.name:"")+" "+(t.tags||[]).join(" ")).toLowerCase().indexOf(q1)<0) return false;
  if(f9.region && (t.region||"")!==f9.region) return false;
  if(f9.diff && (t.diff||"")!==f9.diff) return false;
  if(f9.dist==="0" && !(t.km<10)) return false; if(f9.dist==="1" && !(t.km>=10&&t.km<=20)) return false; if(f9.dist==="2" && !(t.km>20)) return false;
  if(f9.elev==="0" && !(t.up<500)) return false; if(f9.elev==="1" && !(t.up>=500&&t.up<1000)) return false; if(f9.elev==="2" && !(t.up>=1000)) return false;
  if(f9.csucs && !(/csúcs|kilátó|nyereg|gerinc|tető|topica|hargita|csukás|köves|bükki|balvanyos|radna|izerea|tarnica|hasmas|stânișoara|piatra/.test((t.name+" "+(t.tags||[]).join(" ")).toLowerCase()))) return false;
  return true; }catch(e){ return false; }
}
function evMatch(e){
  try{ var q1=f9.q.toLowerCase().trim();
  if(q1 && (String(e.name)+" "+(e.place||"")+" "+(e.org||"")).toLowerCase().indexOf(q1)<0) return false;
  if(f9.diff && (e.diff||"")!==f9.diff) return false;
  if(f9.weekend && !nearWeek(e.date)) return false;
  return true; }catch(e2){ return false; }
}
function geod(a,b){ try{ var R=6371e3,p=Math.PI/180,dLa=(b[0]-a[0])*p,dLo=(b[1]-a[1])*p; var s=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(a[0]*p)*Math.cos(b[0]*p)*Math.sin(dLo/2)*Math.sin(dLo/2); return 2*R*Math.asin(Math.min(1,Math.sqrt(s))); }catch(e){ return 999999; } }
function dloc(t){ if(!t||!t.start||!f9.loc) return 999999; return geod([t.start.lat,t.start.lng],[f9.loc.lat,f9.loc.lng])/1000; }
function sortTour(arr){
  if(f9.sort==="km") return arr.slice().sort(function(a,b){return (a.km||0)-(b.km||0);});
  if(f9.sort==="up") return arr.slice().sort(function(a,b){return (a.up||0)-(b.up||0);});
  if(f9.sort==="pop") return arr.slice().sort(function(a,b){return (b.rating||0)-(a.rating||0);});
  if(f9.sort==="near") return arr.slice().sort(function(a,b){return dloc(a)-dloc(b);});
  return arr; }
function geoAsk(){
  if(!navigator.geolocation){ f9.locMsg='<span class="small muted">A helymeghatározás nem elérhető ebben a böngészőben.</span>'; f9repList(); return; }
  f9.locMsg='<span class="small muted">📍 Helymeghatározás…</span>'; f9repList();
  navigator.geolocation.getCurrentPosition(function(pos){ f9.loc={lat:pos.coords.latitude,lng:pos.coords.longitude}; f9.sort="near"; f9.locMsg='<span class="chip chip-green">📍 Közelitő hely beállítva — rendezés távolság szerint</span>'; f9rep(); },
   function(err){ f9.locMsg='<span class="small muted">A közeli túrákhoz engedélyezd a helymeghatározást.</span>'; f9repList(); }, {timeout:8000, maximumAge:600000});
}
/* ——— személyes ajánlás (szabályalapú) ——— */
function scored(){
  var d=Store.myData(); var done=d.journal||[];
  var avKm=done.length?done.reduce(function(a,j){return a+(+j.km||0);},0)/done.length:0;
  var regions={}, diffs={};
  (d.wishlist||[]).forEach(function(w){ if(w.ref&&/^f9:t:/.test(w.ref)){ var c=CAT_T().find(function(t){return "f9:t:"+t.id===w.ref;}); if(c&&c.region) regions[c.region]=1; } });
  (d.tours||[]).forEach(function(t){ if(t.difficulty) diffs[t.difficulty]=1; });
  var out=CAT_T().map(function(t){ var sc=0; var reasons=[];
    if(regions[t.region]){ sc+=2; reasons.push("A bakancslistád régiójából"); }
    if(avKm && t.km>=avKm*0.6 && t.km<=avKm*1.6){ sc+=2; reasons.push("Hasonló hosszúságú, mint a teljesítéseid"); }
    if(diffs[t.diff]){ sc+=1; reasons.push("Ugyanilyen nehézségű, mint amit jársz"); }
    if(f9.loc){ var dd=dloc(t); if(dd<50){ sc+=2; reasons.push("Közel van ("+(Math.round(dd*10)/10)+" km)"); } }
    if(t.rating) sc+=(t.rating-4)*1.2;
    return {t:t, sc:sc, reasons:reasons.slice(0,2)};
  }).sort(function(a,b){return b.sc-a.sc;});
  return out;
}
function recMini(){
  var top=scored().slice(0,3);
  if(!top.length) return "";
  return '<section class="card f9recs"><div class="f9-rec-h">🧭 Személyes ajánlás<span class="small muted"> — a te adataid alapján (szabály, nem AI)</span></div>'+
   top.map(function(s){ return '<a class="f9-recrow" data-f9rec="'+s.t.id+'"><b>🥾 '+esc9(s.t.name)+'</b><small>'+esc9(s.reasons.length?s.reasons.join(" · "):"Népszerű a katalógusban")+'</small></a>'; }).join("")+
   '<div style="margin-top:.5rem"><a class="btn btn-soft btn-sm" data-f9tab="pop">🔎 Összes ajánlás</a></div></section>';
}
function f9ListHtml(){
  try{
  if(f9.tab==="events"){ var fe=CAT_E().filter(evMatch); var top=fe.slice(0,6); var rest=fe.slice(6);
    var out='<p class="small muted" style="margin:.1rem 0 .7rem">Csak ellenőrzött, forrásmegjelölt események jelennek meg.</p>';
    if(top.length){ out+=top.map(ecard).join(""); if(rest.length) out+='<details class="f9-more"><summary>＋ '+rest.length+' további esemény</summary>'+rest.map(ecard).join("")+'</details>'; return out; }
    return '<div class="empty"><span class="em-ico">📅</span><h3>Jelenleg nincs ellenőrzött esemény.</h3><p class="muted">Ha hiteles forrásból érkezik új esemény, az ellenőrzés után jelenik meg.</p><button class="btn btn-primary" data-f9tab="tours">🥾 Túrák felfedezése</button></div>';
  }
  if(f9.tab==="peaks"){ var pk=peakList(); if(f9.q){ var q1=f9.q.toLowerCase(); pk=pk.filter(function(h){return (h.name+" "+h.region).toLowerCase().indexOf(q1)>-1;}); }
    return pk.map(pcard).join("")||'<div class="empty"><span class="em-ico">🏔️</span><h3>Nincs ilyen hegy a katalógusban.</h3><button class="btn btn-ghost" data-f9clear>🔄 Szűrők törlése</button></div>'; }
  if(f9.tab==="routes"){ var own=(Store.myData().routes||[]).slice(); var html='<h3 class="f9-sect">⭐ Saját útvonalak (V47 GPX)</h3>';
    html += own.length? own.map(function(o){return rcard(o,true);}).join("") : '<div class="empty sm"><span class="em-ico">🗺️</span><h3>Még nincs útvonal.</h3><button class="btn btn-primary" data-f9import>＋ GPX importálása</button></div>';
    html+='<h3 class="f9-sect">🌍 Ellenőrzött nyilvános útvonalak</h3>'+(CAT_T().length?CAT_T().map(function(o){return rcard({id:o.id,name:o.name,distance_km:o.km,elevation_gain_m:o.up},false);}).join(""):'<div class="empty sm"><span class="em-ico">🗺️</span><h3>Nincs ellenőrzött nyilvános útvonal.</h3><p class="muted">Saját GPX útvonalat a személyes túraközpontban importálhatsz.</p></div>');
    return html; }
  if(f9.tab==="pop"){ var arr= f9.q||f9.region||f9.diff||f9.dist||f9.elev||f9.csucs? CAT_T().filter(tourMatch) : CAT_T();
    return '<p class="small muted">Népszerűség a katalógus valódi ⭐ értékelései alapján; érték nélküli túra a lista végén.</p>'+sortTour(arr.slice().sort(function(a,b){return (b.rating||0)-(a.rating||0);}) ).slice(0,12).map(card).join(""); }
  var arr2=CAT_T().filter(tourMatch); var res=sortTour(arr2);
  var head = (f9.weekend? '<p class="small muted">📅 A hétvége-szűrés az Események fülön érvényes (a túráknak nincs fix dátumuk).</p>':"");
  var body = res.length? res.map(card).join("") : '<div class="empty"><span class="em-ico">🔎</span><h3>Nem találtunk ilyen túrát.</h3><button class="btn btn-ghost" data-f9clear>🔄 Szűrők törlése</button></div>';
  return head+body;
  }catch(e){ return '<div class="empty"><span class="em-ico">⚠️</span><h3>A lista megjelenítése most nem sikerült.</h3><button class="btn btn-ghost" data-f9tab="tours">🥾 Túrák</button></div>'; }
}
/* ——— nézet + drótozás ——— */
function f9HeadHtml(){
  var regs=CAT_T().map(function(t){return t.region;}).filter(function(v,i,a){return v&&a.indexOf(v)===i;});
  function sel(id,val,opts,all){ return '<select class="input" id="'+id+'"><option value="">'+all+'</option>'+opts.map(function(o){ return '<option value="'+esc9(o)+'"'+(val===o?' selected':'')+'>'+esc9(o)+'</option>'; }).join("")+'</select>'; }
  return '<section class="wrap f9head"><div class="f9-hero-t"><p class="eyeb">🗺️ TÚRAFELFEDEZŐ</p><h1 class="f9-h1">Mit túrázzak?</h1><p class="f9-sub">Találd meg a következő túrádat Székelyföldön és Erdélyben — egy koppintással saját terv lesz belőle.</p></div>'+
   '<div class="f9-tools"><input class="input" id="f9q" placeholder="🔎 Keress túrát, hegyet, útvonalat vagy eseményt…" value="'+esc9(f9.q)+'">'+
   sel("f9reg",f9.region,regs,"📍 Régió: mindegy")+' '+sel("f9diff",f9.diff,["Könnyű","Közepes","Nehéz"],"🥾 Nehézség")+' '+
   '<select class="input" id="f9dist"><option value="">📏 Távolság</option><option value="0"'+(f9.dist==="0"?" selected":"")+'>0–10 km</option><option value="1"'+(f9.dist==="1"?" selected":"")+'>10–20 km</option><option value="2"'+(f9.dist==="2"?" selected":"")+'>20+ km</option></select> '+
   '<select class="input" id="f9elev"><option value="">⛰️ Szint</option><option value="0"'+(f9.elev==="0"?" selected":"")+'>0–500 m</option><option value="1"'+(f9.elev==="1"?" selected":"")+'>500–1000 m</option><option value="2"'+(f9.elev==="2"?" selected":"")+'>1000+ m</option></select></div>'+
   '<div class="f9-chips" role="group">'+
    '<button class="f-pill'+(f9.loc&&f9.sort==="near"?" on":"")+'" data-f9chip="near">📍 Közel hozzám</button>'+
    '<button class="f-pill'+(f9.weekend?" on":"")+'" data-f9chip="weekend">📅 Ezen a hétvégén</button>'+
    '<button class="f-pill'+(f9.diff==="Könnyű"?" on":"")+'" data-f9chip="Könnyű">🥾 Könnyű</button>'+
    '<button class="f-pill'+(f9.diff==="Közepes"?" on":"")+'" data-f9chip="Közepes">🥾 Közepes</button>'+
    '<button class="f-pill'+(f9.diff==="Nehéz"?" on":"")+'" data-f9chip="Nehéz">🥾 Nehéz</button>'+
    '<button class="f-pill'+(f9.csucs?" on":"")+'" data-f9chip="csucs">🏔️ Csúcs</button>'+
    '<button class="f-pill'+(f9.tab==="events"&&f9.kozos?" on":"")+'" data-f9chip="kozos">👥 Közösségi</button>'+
    '<span class="f9-sortwrap">Rendezés:<select class="input" id="f9sort"><option value="">alap</option><option value="pop"'+(f9.sort==="pop"?" selected":"")+'>⭐ népszerű</option><option value="km"'+(f9.sort==="km"?" selected":"")+'>📏 legrövidebb</option><option value="up"'+(f9.sort==="up"?" selected":"")+'>⛰️ legkisebb szint</option><option value="near"'+(f9.sort==="near"?" selected":"")+'>📍 legközelebbi</option></select></span></div>'+
   (f9.locMsg?'<p class="small" style="margin:.4rem 0 0">'+f9.locMsg+'</p>':'')+
   '<div class="tabs f9-tabs" role="tablist">'+
    [["tours","🥾 Túrák"],["events","📅 Események"],["peaks","🏔️ Hegyek"],["routes","🗺️ Útvonalak"],["pop","⭐ Népszerű"]].map(function(x){ return '<button class="'+(f9.tab===x[0]?"on":"")+'" data-f9tab="'+x[0]+'">'+x[1]+'</button>'; }).join("")+
   '</div></section>';
}
function f9View(){ return f9HeadHtml()+'<div class="wrap"><div id="f9-list" class="grid f9-grid">'+f9ListHtml()+'</div>'+(f9.tab==="tours"?recMini():"")+'</div>'; }
var f9rootEl=null;
function f9rep(){ var r=document.getElementById("view"); if(!r||!f9rootEl) f9rootEl=r; r.innerHTML=f9View(); }
function f9repList(){ var l=document.getElementById("f9-list"); if(l){ l.innerHTML=f9ListHtml(); var rc=document.querySelector(".f9recs"); if(f9.tab==="tours"&&!rc){ l.insertAdjacentHTML("afterend", recMini()); } } }
/* ——— akciók ——— */
function planFrom(kind,id){
  try{ var ref=refOf(kind,id); var d=Store.myData(); var exist=(d.tours||[]).find(function(x){return x.extRef===ref;});
    if(exist){ openModal({title:"🗓️ Ehhez már van túraprojekted", body:'<p class="muted mt0">A(z) <b>'+esc9(exist.title)+'</b> projekt már fut — nem hozunk létre másikat.</p>', footer:'<button class="btn btn-ghost" data-close>Később</button> <a class="btn btn-primary" href="#/tura/'+exist.id+'">🗓️ Megnyitom</a>'}); return; }
    var n=null;
    if(kind==="t"){ var t=CAT_T().find(function(x){return x.id===id;}); if(!t) return;
      n=Store.newTourFromDraft({ title:t.name, place:(t.start?t.start.name:t.region||""), region:t.region||"", date:"", lengthKm:+t.km||0, ascent:+t.up||0, durationH:+t.h||0, difficulty:t.diff||"Közepes", img:t.img||IMG.erdo, desc:t.desc||"", coords:(t.start&&t.start.lat)?{lat:t.start.lat,lng:t.start.lng}:null, notes:"Forrás: Túrafelfedező", tags:(t.tags||[]).slice(0,6).concat(["felfedezett"]) });
    } else { var e=CAT_E().find(function(x){return x.id===id;}); if(!e) return; var base=CAT_T().find(function(t){return t.id===e.tour;});
      n=Store.newTourFromDraft({ title:e.name, place:e.place||"", region:base?(base.region||""):"", date:e.date||"", timeHint:e.time||"", lengthKm:base?(+base.km||0):0, ascent:base?(+base.up||0):0, durationH:base?(+base.h||0):0, difficulty:e.diff||(base?base.diff:null)||"Közepes", img:e.img||(base?base.img:IMG.erdo), desc:e.desc||"", coords:(base&&base.start&&base.start.lat)?{lat:base.start.lat,lng:base.start.lng}:null, notes:"Forrás: Túraesemény"+(e.src?" · "+e.src:"")+(e.org?" · "+e.org:""), tags:["esemeny"] });
      n.eventRef=e.id; n.eventCat=e.cat||""; }
    n.status="tervezés"; n.extRef=ref; Store.save();
    toast("Túraprojekt létrejött a felfedezett adatokkal — 🤖 V43 / 🧠 V48/V44 elérhető a projektben","🗓️");
    NAV.to("#/tura/"+n.id);
  }catch(e2){ toast("A tervkészítés most nem sikerült","⚠️"); }
}
function wishToggle(kind,id){
  try{ var ref=refOf(kind,id); var t=(kind==="t")?CAT_T().find(function(x){return x.id===id;}):CAT_E().find(function(x){return x.id===id;}); if(!t) return;
    var d=Store.myData(); var w={id:ref,name:t.name||ref,cat:(kind==="t"?(t.region||"Felfedezett"):(t.cat||"Esemény")),place:(t.start?t.start.name:(t.place||"")) ,diff:(t.diff||"—"),img:t.img||null}; var had=hasWish(ref);
    Store.toggleWish(w); toast(had?"Eltávolítva a bakancslistáról":"✓ Bakancslistára mentve", had?"—":"❤️"); f9repList();
  }catch(e){ toast("A mentés most nem sikerült","⚠️"); }
}
function shareF9(kind,id){
  try{ var t=(kind==="t")?CAT_T().find(function(x){return x.id===id;}):CAT_E().find(function(x){return x.id===id;}); if(!t) return;
    var txt="Túratárs javaslat: "+t.name+(t.start?" ("+t.start.name+")":(t.place?" ("+t.place+")":""))+" — https://turatars.ro/#/felfedezes";
    if(navigator.share){ navigator.share({title:"Túratárs", text:txt}).catch(function(){ try{navigator.clipboard.writeText(txt); toast("Megosztás szövege vágólapon ✔","📤");}catch(e2){} }); }
    else if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ toast("Link + szöveg a vágólapon ✔","📤"); }).catch(function(){ toast("Az eyed át a linket:","#"+location.hash); }); }
    else { toast("Másold: "+location.href.slice(0,48)+"…","📤"); }
  }catch(e){}
}
function openTourModal(id){
  try{ var t=CAT_T().find(function(x){return x.id===id;}); if(!t) return; var c=ctaFor("t",t);
   openModal({title:"🏔️ "+esc9(t.name), body:'<div class="img-wrap modimg9">'+imgTagSafe(t.img||IMG.erdo,t.name)+'</div>'+
    '<p class="small muted mt0">'+esc9(t.region)+' · 📍 '+esc9(t.start?t.start.name:"nincs hely")+'</p>'+
    '<p class="small mb0">📏 '+nz(t.km!=null?t.km+" km":null,'nincs adat')+' &middot; ⛰️ '+nz(t.up!=null?"+"+t.up+" m":null,'—')+' &middot; 🕐 '+nz(t.h!=null?t.h+" ó":null,'—')+' &middot; 🥾 '+nz(t.diff)+' &middot; ⭐ '+nz(t.rating,'nincs értékelés')+'</p>'+
    '<div id="f9map-'+t.id+'" class="modmap9"></div>'+
    '<p class="small mb0">'+esc9(t.desc||"Erről a túráról nincs leírás a katalógusban.")+'</p>'+ (t.gpxUrl?'<a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="'+esc9(t.gpxUrl)+'">⬇ GPX letöltése</a>':'<p class="small muted">🗺️ Útvonaladat még nem érhető el. A kezdőpontból saját útvonalat tervezhetsz.</p>')+(window.v123PlanningUrl&&t.start?'<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener nofollow" href="'+esc9(window.v123PlanningUrl(t))+'">🧭 Útvonal tervezése a térképen</a>':'')+
    ((t.tags||[]).length?'<p class="small muted mb0">'+t.tags.map(esc9).join(" · ")+'</p>':"")+
    '<div class="f9cta">'+c.plan+c.heart+'<button class="btn btn-ghost btn-sm" data-f9share="t:'+t.id+'">📤 Megosztás</button></div>'+
    (t.start&&t.start.lat?'<p class="tiny muted">A térképen csak a valódi kezdőpont látszik — kitalált útvonalat nem rajzolunk.</p>':""),
    footer:'<button class="btn btn-primary btn-block" data-close>Kész</button>',
    onOpen:function(m){ f9modalWire(m); var el=m.querySelector(".modmap9"); if(el&&t.start&&t.start.lat&&typeof MapKit!=="undefined"){ try{ var mp=MapKit.make(el,{center:[t.start.lat,t.start.lng],zoom:12}); MapKit.pin(mp,t.start.lat,t.start.lng,"pin-cat",esc9(t.start.name)); }catch(e){ el.innerHTML='<span class="small muted">Térkép nem érhető el — az adat így is használható.</span>'; } } } });
  }catch(e){}
}
function openEventModal(id){
  try{ var e=CAT_E().find(function(x){return x.id===id;}); if(!e) return; var c=ctaFor("e",e); var base=CAT_T().find(function(t){return t.id===e.tour;});
    openModal({title:"📣 "+esc9(e.name), body:'<p class="small muted mt0">📅 '+nz(e.date,'dátum nélkül')+(e.time?(' · 🕐 '+e.time):"")+(e.place?(' · 📍 '+esc9(e.place)):"")+(e.cat?(' · '+esc9(e.cat)):"")+'</p>'+
     '<p class="small mb0">'+(base?('📏 '+base.km+' km · ⛰️ +'+base.up+' m · 🕐 '+base.h+' ó · 🥾 '+esc9(base.diff||"—")):(e.km!=null||e.up!=null)?((e.km!=null?'📏 '+e.km+' km':'')+(e.km!=null&&e.up!=null?' · ':'')+(e.up!=null?'⛰️ +'+e.up+' m':'')+(e.h!=null?' · 🕐 '+e.h+' ó':'')+(e.diff?' · 🥾 '+esc9(e.diff):'')):"Táv/szint: nincs adat a katalógusban")+' · 👥 '+nz(e.org,'szervező nélkül')+'</p>'+ (window.v52Extra?window.v52Extra(e):'') +
     '<p class="small mb0">'+esc9(e.desc||"Rövid leírás nincs a helyi állományban.")+'</p>'+
     '<p class="small mb0">'+(e.people?("Jelentkezett: "+e.people+(e.cap?("/"+e.cap):"")):"")+'</p>'+
     '<div class="f9cta"><a class="btn btn-soft btn-sm" '+(e.src?('href="'+esc9(e.src)+'" target="_blank" rel="noopener"'):'aria-disabled="true"')+'>🔗 Eredeti oldal</a><button class="btn btn-ghost btn-sm" data-f9share="e:'+e.id+'">📤 Megosztás</button>'+c.heart+'</div>',
     footer:(c.plan?'<div class="f9cta">'+c.plan+'</div>':"")+'' ,
     onOpen:function(m){ f9modalWire(m); }});
  }catch(e2){}
}
function f9modalWire(m){
  m.addEventListener("click", function(e0){ var b=e0.target.closest?e0.target.closest("[data-f9plan],[data-f9w],[data-f9open],[data-f9share],[data-f9tour],[data-f9ev]"):null; if(!b) return;
   var pl=b.dataset.f9plan; if(pl){ var q=pl.split(":"); closeModal(); planFrom(q[0],q[1]); return; }
   var wu=b.dataset.f9w; if(wu){ var ww=wu.split(":"); wishToggle(ww[0],ww[1]); /*V51FIX*/ var hb=document.querySelector('[data-modal]'); if(hb){ var n=hb.querySelector('[data-f9w]'); if(n){ n.outerHTML='<span class="chip chip-green">❤️ Bakancslistán</span>'; } } f9repList(); return; }
   var op=b.dataset.f9open; if(op){ closeModal(); NAV.to("#/tura/"+op); return; }
   var sh=b.dataset.f9share; if(sh){ var ss=sh.split(":"); shareF9(ss[0],ss[1]); return; }
   var to=b.dataset.f9tour; if(to){ closeModal(); openTourModal(to); return; }
   var evv=b.dataset.f9ev; if(evv){ closeModal(); openEventModal(evv); return; } });
}
function f9wire(root){
  root.addEventListener("input", function(e0){ var x=e0.target; if(x.id==="f9q"){ f9.q=x.value; f9repList(); } });
  root.addEventListener("change", function(e0){ var x=e0.target; var m={f9reg:"region",f9diff:"diff",f9dist:"dist",f9elev:"elev",f9sort:"sort"}[x.id]; if(m){ f9[m]=x.value; if(m==="diff"&&f9.tab==="peaks") f9.tab="tours"; f9rep(); } });
  root.addEventListener("click", function(e0){ var b=e0.target.closest?e0.target.closest("[data-f9tab],[data-f9chip],[data-f9clear],[data-f9plan],[data-f9open],[data-f9w],[data-f9tour],[data-f9ev],[data-f9peak],[data-f9route],[data-f9import],[data-f9rec],[data-f9share]"):null; if(!b) return;
    if(b.dataset.f9tab){ f9.tab=b.dataset.f9tab; f9rep(); return; }
    var ch=b.dataset.f9chip; if(ch){ if(ch==="near"){ geoAsk(); }
      else if(ch==="weekend"){ f9.weekend=!f9.weekend; if(f9.weekend) f9.tab="events"; f9rep(); }
      else if(ch==="csucs"){ f9.csucs=!f9.csucs; if(f9.tab!=="tours"&&f9.tab!=="pop") f9.tab="tours"; f9rep(); }
      else if(ch==="kozos"){ f9.kozos=!f9.kozos; f9.tab="events"; f9rep(); }
      else { f9.diff = (f9.diff===ch)?"":ch; f9rep(); } return; }
    if(b.hasAttribute("data-f9clear")){ f9.q="";f9.region="";f9.diff="";f9.dist="";f9.elev="";f9.csucs=false;f9.weekend=false;f9.sort="";f9rep(); return; }
    var pl=b.dataset.f9plan; if(pl){ var pp=pl.split(":"); closeModal(); planFrom(pp[0],pp[1]); return; }
    var op=b.dataset.f9open; if(op){ closeModal(); NAV.to("#/tura/"+op); return; }
    var wu=b.dataset.f9w; if(wu){ var ww=wu.split(":"); wishToggle(ww[0],ww[1]); return; }
    var to=b.dataset.f9tour; if(to){ openTourModal(to); return; }
    var ev=b.dataset.f9ev; if(ev){ openEventModal(ev); return; }
    var pk=b.dataset.f9peak; if(pk){ f9.q=pk; f9.tab="tours"; f9rep(); return; }
    var rt=b.dataset.f9route; if(rt){ if(window.__rtopen) window.__rtopen(rt,true); return; }
    if(b.hasAttribute("data-f9import")){ closeModal(); if(window.openGPXImport) window.openGPXImport({}); else NAV.to("#/utvonalak"); return; }
    var rc=b.dataset.f9rec; if(rc){ openTourModal(rc); return; }
    var sh=b.dataset.f9share; if(sh){ var ss=sh.split(":"); shareF9(ss[0],ss[1]); return; } });
}
var _f9orig = VIEWS.discover, _f9origA = VIEWS.discover && VIEWS.discover.after;
VIEWS.discover = function(){ try{ if(!Store.me()) return _f9orig(); return '<main class="f9page">'+f9View()+'</main>'; }catch(e){ try{ return _f9orig(); }catch(e2){ return '<div class="wrap">A felfedezés most nem érhető el.</div>'; } } };
VIEWS.discover.after = function(root){
  try{ if(!Store.me()){ _f9origA && _f9origA(root); return; } }catch(e){}
  if(!root.__f9w){ root.__f9w=1; f9wire(root); }
};
(function(){ try{
  var _prevDash = VIEWS.dash && VIEWS.dash.after;
  VIEWS.dash = VIEWS.dash || function(){ return ""; };
  VIEWS.dash.after = function(root){ try{ _prevDash&&_prevDash(root); }catch(e){}
    try{ if(!root) return; var w=root.querySelector("#widgets"); if(!w||w.querySelector("#f9mini")) return; var top=scored().slice(0,3); if(!top.length) return;
      var box=document.createElement("section"); box.className="wsec"; box.id="f9mini";
      box.innerHTML='<div class="wpan f9mini"><b>🗺️ Fedezd fel a következő túrádat</b>'+top.map(function(s){return '<span class="f9-minirow">'+esc9(s.t.name)+' <small>'+(s.reasons[0]||"népszerű")+'</small></span>';}).join("")+'<a class="btn btn-soft btn-sm" href="#/felfedezes">🔎 Felfedezem</a></div>';
      var inbox=w.querySelector('[data-w="inbox"]'); if(inbox&&inbox.parentNode) inbox.parentNode.insertBefore(box, inbox.nextSibling); else w.appendChild(box);
    }catch(e){} };
}catch(e){} })();
window.__V49=1; window.f9State=f9; window.v49Plan=planFrom; window.v49OpenEv=openEventModal; window.v49CAT_E=CAT_E;
})();
