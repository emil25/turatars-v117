/* ============ V50 — 👤 Saját túrázási profil + személyes statisztika + jelvények ============
   Források: d.tours (teljesítve/archiválva) + d.journal (V42) + d.routes (V47) + wishlist + equipment.
   Nem tárol párhuzamos adatot; a jelvények és statisztikák determinisztikus, render-időben számított állapotok. */
(function(){
"use strict";
function esc5(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function num(x){ var n=+x; return (x==null||x===""||!isFinite(n))?null:n; }
function p5fmtNum(n){ var v=num(n); return v==null?"—":Math.round(v).toLocaleString("hu-HU"); }
function p5kmfmt(x){ var v=num(x); return v==null?"—":(Math.round(v*10)/10).toString().replace(".",","); }
function rtf(x){ return p5kmfmt(x); }
function p5TrackMax(tr){ try{ if(!tr||!tr.length) return null; var m=null; tr.forEach(function(pt){ var e=(pt&&pt.length>2)?num(pt[2]):null; if(e!=null&&(m===null||e>m)) m=e; }); return m; }catch(e){ return null; } }
var HM=["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
var p5Y=null; /* kiválasztott év — csak UI állapot */

/* ---------- a teljesített túra-egységek (tourId dedup) ---------- */
function doneList(){
  var d=(Store.myData()||{}); var out=[]; var seen={};
  (d.tours||[]).forEach(function(t){
    if(!t||!t.id||seen[t.id]) return; if(t.status!=="teljesítve"&&t.status!=="archiválva") return; seen[t.id]=1;
    var j=null; (d.journal||[]).forEach(function(x){ if(x&&x.tourId===t.id&&!j) j=x; });
    var km=num(t.lengthKm), up=num(t.ascent), desc=num(t.descent), durH=num(t.durationH), maxE=null;
    var region=(t.region||"").trim(), place=(t.place||"").trim(), when=(j&&j.date)||t.doneAt||t.date||"";
    if(j){ var jk=num(j.km), ju=num(j.up), jh=num(j.h); if(jk!=null)km=jk; if(ju!=null)up=ju; if(jh!=null)durH=jh; if(j.date)when=j.date; }
    if(t.routeId){ var r=(d.routes||[]).find(function(x){return x&&x.id===t.routeId;});
      if(r){ var rk=num(r.distance_km), ru=num(r.elevation_gain_m), rl=num(r.elevation_loss_m), rm=p5TrackMax(r.track);
        if(rk!=null)km=rk; if(ru!=null)up=ru; if(rl!=null)desc=rl; if(rm!=null)maxE=rm; } }
    if(maxE==null&&t.elev&&t.elev.length){ var el=t.elev.map(num).filter(function(x){return x!=null;}); if(el.length)maxE=Math.max.apply(null,el); }
    out.push({ id:t.id, title:(j&&j.title)||t.title||place||"Névtelen túra", km:km, up:up, desc:desc, durH:durH, maxE:maxE,
      region:region, place:place, when:when||"", hasJournal:!!j }); });
  return out;
}
function agg(list){ var km=0,up=0,h=0,n=0,hi=null; list.forEach(function(t){ n++;
  if(t.km!=null)km+=t.km; if(t.up!=null)up+=t.up; if(t.durH!=null)h+=t.durH; if(t.maxE!=null&&(hi===null||t.maxE>hi))hi=t.maxE; });
  return {n:n,km:km,up:up,h:h,maxE:hi}; }
function years(list){ var s={}; list.forEach(function(t){ var y=(t.when||"").slice(0,4); if(y&&+y>2000&&+y<2100)s[y]=1; }); return Object.keys(s).sort().reverse(); }
function regionsOf(list){ var m={}; list.forEach(function(t){ var r=(t.region||t.place||"").trim(); if(r)m[r]=(m[r]||0)+1; }); return Object.keys(m).map(function(k){return [k,m[k]];}).sort(function(a,b){return b[1]-a[1];}); }
function byM(list,y){ var a=[]; for(var mi=1;mi<=12;mi++){ var key=y+"-"+(mi<10?"0":"")+mi; var rows=list.filter(function(t){return (t.when||"").indexOf(key)===0;}); var km=0; rows.forEach(function(t){ if(t.km!=null)km+=t.km; }); a.push({m:HM[mi-1],n:rows.length,km:Math.round(km*10)/10}); } return a; }
function bests(list){
  function pick(fn){ var b=null; list.forEach(function(t){ var v=fn(t); if(v==null)return; var bv=b?fn(b):null; if(b===null||(bv!=null&&v>bv)||(bv==null)) b=t; }); return {t:b,v:b?fn(b):null}; }
  return { high:pick(function(t){return t.maxE;}), long:pick(function(t){return t.km;}), up:pick(function(t){return t.up;}), dur:pick(function(t){return t.durH;}) }; }

/* ---------- JELVÉNYEK — számított állapot (nincs tárolás → dedup automatikus) ---------- */
var P5_BADGES=[
  {id:"p5-t1", icon:"🥾", name:"Első túra", kind:"n", need:1, unit:"túra"},
  {id:"p5-t5", icon:"🥾", name:"Öt túra", kind:"n", need:5, unit:"túra"},
  {id:"p5-t10", icon:"🏔️", name:"Tíz túra", kind:"n", need:10, unit:"túra"},
  {id:"p5-up5", icon:"⛰️", name:"Szintgyűjtő", kind:"up", need:5000, unit:"m"},
  {id:"p5-up10", icon:"⛰️", name:"Hegyi szintgyűjtő", kind:"up", need:10000, unit:"m"},
  {id:"p5-k100", icon:"📏", name:"100 km", kind:"km", need:100, unit:"km"},
  {id:"p5-k250", icon:"📏", name:"250 km", kind:"km", need:250, unit:"km"},
  {id:"p5-hi", icon:"🏔️", name:"Magashegyi túrázó", kind:"maxE", need:1500, unit:"m"},
  {id:"p5-reg", icon:"🗺️", name:"Erdély felfedezője", kind:"reg", need:3, unit:"régió"},
  {id:"p5-per", icon:"🔥", name:"Kitartó túrázó", kind:"yr", need:10, unit:"túra"}];
function valOf(kind,st,list){ if(kind==="n")return st.n; if(kind==="km")return st.km; if(kind==="up")return st.up; if(kind==="maxE")return st.maxE;
  if(kind==="reg")return regionsOf(list).length;
  if(kind==="yr"){ var b=0; years(list).forEach(function(y){ var c=list.filter(function(t){return (t.when||"").indexOf(y)===0;}).length; if(c>b)b=c; }); return b; } return 0; }
function p5Badges(list,st){ return P5_BADGES.map(function(b){
  if(!list.length) return Object.assign({},b,{got:null,now:null,miss:""});
  var v=valOf(b.kind,st,list);
  if(v==null) return Object.assign({},b,{got:false,now:null,miss:""});
  var got=v>=b.need; var dif=Math.max(0,b.need-v);
  var miss=got?"":"Még "+(b.kind==="n"||b.kind==="yr"||b.kind==="reg"? (Math.ceil(dif)+" "+b.unit) : (p5fmtNum(Math.ceil(dif))+" "+b.unit))+" hiányzik.";
  return Object.assign({},b,{got:got,now:Math.round(v*10)/10,miss:miss}); }); }
function nextGoal(bd){ var open=bd.filter(function(b){return b.got===false&&b.now!=null;});
  if(!open.length){ return bd.every(function(b){return b.got===true;})? "🎉 Szép munka! Minden jelenlegi mérföldkövet teljesítetted." : null; }
  open.sort(function(a,b){ return (a.need-a.now)-(b.need-b.now); });
  var b=open[0]; var dif=Math.ceil(b.need-b.now);
  return "Már csak "+(b.kind==="n"||b.kind==="yr"||b.kind==="reg"? dif+" "+b.unit : p5fmtNum(dif)+" "+b.unit)+" kell a(z) „"+b.name+"” jelvényhez."; }

/* ---------- kis diagram + építőelemek ---------- */
function p5Chart(list,y){ var mm=byM(list,y); var max=1; mm.forEach(function(x){ if(x.n>max)max=x.n; });
  return '<div class="p5-chart" role="img" aria-label="Havi aktivitás: túrák száma">'+ mm.map(function(x){ var h=x.n?Math.max(7,Math.round(x.n/max*44)):3;
    return '<div class="p5-b1" title="'+esc5(x.m+": "+x.n+" túra · "+p5kmfmt(x.km)+" km")+'">'+(x.n?'<b class="p5-bn">'+x.n+"</b>":"")+'<span class="p5-bv" style="height:'+h+'px"></span><small>'+esc5(x.m.slice(0,3))+".</small></div>"; }).join("")+"</div>"; }
function p5StatCard(icon,val,label,href){ var s='<b class="p5-sv">'+icon+" "+esc5(val)+'</b><small class="p5-sl">'+esc5(label)+"</small>";
  return href? '<a class="p5-stat" href="'+href+'">'+s+"</a>" : '<div class="p5-stat">'+s+"</div>"; }
function p5Sec(t,inner,act){ return '<section class="card panel p5-sec"><h2>'+t+"</h2>"+(act?'<div class="p5-act">'+act+"</div>":"")+inner+"</section>"; }
function p5Tile(icon,label,count,href,btn){ return '<div class="p5-tile"><div class="p5-tl"><b>'+icon+" "+esc5(label)+'</b><span class="mut">'+esc5(count)+"</span></div><a class=\"btn btn-soft btn-sm\" href=\""+href+"\">"+btn+"</a></div>"; }
function p5RoutesInner(){ try{ var d=Store.myData(); var rs=(d.routes||[]).slice(); if(!rs.length) return '<p class="muted small">Még nincs importált útvonal — a V47 GPX-import itt jelenik meg.</p>';
  return '<div class="p5-rlist">'+rs.slice(0,4).map(function(r){ var hi=p5TrackMax(r.track);
    return '<div class="p5-row"><b>🗺️ '+esc5(r.name||"Névtelen útvonal")+'</b><span class="mut">'+(r.distance_km!=null?rtf(r.distance_km)+" km":"km: —")+" · "+(r.elevation_gain_m!=null?"↑ "+p5fmtNum(r.elevation_gain_m)+" m":"szint: nem ismétlődik")+(hi!=null?" · ⛰️ max "+p5fmtNum(hi)+" m":"")+'</span><button class="btn btn-soft btn-sm" data-p5route="'+esc5(r.id)+'">🗺️ Megnyitom</button></div>'; }).join("")
    +(rs.length>4?'<a class="small" href="#/utvonalak">+'+(rs.length-4)+" további → Útvonalak</a>":"")+"</div>"; }catch(e){ return '<p class="muted small">Az útvonalak most nem olvashatók.</p>'; } }
function ownGearN(){ try{ return ((Store.myData()||{}).equipment||[]).filter(function(e){return e&&e.has;}).length; }catch(e){ return 0; } }

/* ---------- fő nézet ---------- */
function p5Inner(){
  var list=doneList(); var st=agg(list); var bds=p5Badges(list,st); var got=bds.filter(function(b){return b.got===true;}).length;
  var ys=years(list); var y=p5Y||ys[0]||String(new Date().getFullYear());
  var yopts=ys.slice(); if(yopts.indexOf(y)<0)yopts.unshift(y); if(!yopts.length)yopts=[String(new Date().getFullYear())];
  var ysel='<select class="input p5-ys" id="p5year" aria-label="Év kiválasztása">'+yopts.map(function(x){return '<option'+(x===y?" selected":"")+">"+esc5(x)+"</option>";}).join("")+"</select>";
  var yList=list.filter(function(t){return (t.when||"").indexOf(y)===0;}); var ya=agg(yList);
  var zero=!list.length;
  var yCard='<div class="p5-grid4">'+ (yList.length? p5StatCard("🥾",String(ya.n),"teljesített túra · "+y,"#/turaim")+p5StatCard("📏",p5kmfmt(ya.km)+" km","évi táv")+(ya.up? p5StatCard("⛰️",p5fmtNum(ya.up)+" m","évi szint"):"")+(ya.maxE!=null? p5StatCard("🏔️",p5fmtNum(ya.maxE)+" m","évi legmagasabb pont"):"") : '<p class="muted" style="margin:.5rem 0 0">Ebben az évben még nincs teljesített túrád.</p>')+"</div>";
  var b=bests(list);
  var bb='<div class="p5-rows">'+ [["🏔️","Legmagasabb pontú túra",b.high.v!=null?p5fmtNum(b.high.v)+" m":null,b.high.t],["📏","Leghosszabb túra",b.long.v!=null?rtf(b.long.v)+" km":null,b.long.t],["⛰️","Legnagyobb szint",b.up.v!=null?p5fmtNum(b.up.v)+" m":null,b.up.t],["🥾","Leghosszabb időtartam",b.dur.v!=null?p5fmtNum(Math.round(b.dur.v*60))+" perc":null,b.dur.t]].map(function(x){
      if(!list.length||x[2]==null) return '<div class="p5-row"><b>'+x[0]+" "+esc5(x[1])+'</b><span class="mut">nincs adat</span></div>';
      return '<div class="p5-row"><b>'+x[0]+" "+esc5(x[1])+'</b><span class="mut">'+esc5(x[2])+(x[3]?' · <a href="#/tura/'+esc5(x[3].id)+'">'+esc5(x[3].title.slice(0,26))+"</a>":"")+"</span></div>"; }).join("")+"</div>"
    +(list.length?"":'<p class="muted">ℹ️ Még nincs elegendő adat.</p>');
  var rg=regionsOf(list);
  var rgHtml=(rg.length? '<div class="chips">'+rg.map(function(x){return '<span class="chip chip-green">'+esc5(x[0])+" · "+x[1]+"</span>";}).join("")+"</div>"+(rg.length>=3?'<p class="small muted">Csak aProjects túráidban szereplő, ténylegesen rögzített helyszínek.</p>':'') : '<p class="muted">Csak a ténylegesen rögzített régiókat mutatjuk — ahiányzó helyszínt nem találunk ki.</p>');
  var last=list.slice().sort(function(a,x){ return (x.when||"").localeCompare(a.when||""); })[0];
  var lastHtml=last? '<div class="p5-row"><b>📖 '+esc5(last.title)+'</b><span class="mut">'+esc5(last.when||"nincs dátum")+(last.km!=null?" · "+rtf(last.km)+" km":"")+(last.up!=null?" · ↑ "+p5fmtNum(last.up)+" m":"")+'</span><button class="btn btn-soft btn-sm" data-p5mem="'+esc5(last.id)+'">'+(last.hasJournal?"📖 Élmény":"📖 Élmény hozzáadása")+"</button></div>":"";
  var sumS=[]; if(!zero){ var cy=String(new Date().getFullYear()); var nY=list.filter(function(t){return (t.when||"").indexOf(cy)===0;}).length;
    if(nY) sumS.push("Idén "+nY+" túrát teljesítetted.");
    if(b.up.t&&b.up.v!=null) sumS.push("A legtöbb szint a(z) „"+b.up.t.title.slice(0,28)+"” túrán volt (↑ "+p5fmtNum(b.up.v)+" m).");
    var rr=regionsOf(list).length; if(rr>=1) sumS.push(rr+" ismert helyszín/régió van a teljesítéseid közt."); }
  var ng=nextGoal(bds); var u=Store.me()||{}; var uname=(u.name||"").trim()||"Túrázó";
  var badges='<div class="p5-bgrid">'+bds.map(function(x){ var state=x.got===true?"got":(x.got===false?(x.now==null?"nod":"open"):"lock");
    return '<div class="p5-badge '+state+'"><span class="p5-bico">'+(x.got===true||x.got===false?x.icon:"🔒")+'</span><b>'+esc5(x.name)+"</b>"+
      (x.got===true?'<small class="ok">✓ megszerezted</small>':x.got===false?(x.miss?'<small class="mut">'+esc5(x.miss)+"</small>":'<small class="mut">nincs adat</small>'):"<small class=\"mut\">Még nincs elég adat.</small>")+"</div>"; }).join("")+"</div>";

  return '<div class="p5">'+
    '<section class="card panel p5-hero"><span class="p5-av">👤</span><div class="p5-ht"><h1 style="margin:0;font-size:1.35rem">👤 Saját túrázásom</h1>'+
      '<p class="muted" style="margin:.25rem 0 0">'+esc5(uname)+' · 🥾 Túrázó'+(u.city?" · "+esc5(u.city):"")+"</p>"+(u.bio?'<p class="small" style="margin:.3rem 0 0">'+esc5(u.bio)+"</p>":"")+"</div>"+
      '<button class="btn btn-ghost btn-sm" id="p5edit">✏️ Profil szerkesztése</button></section>'+
    (zero?'<section class="card panel p5-sec"><h2>Még nincs teljesített túrád.</h2><p class="muted">🥾 0 túra · 📏 0 km · ⛰️ 0 m — a statisztika csak a valódi teljesítésekből számol.</p><a class="btn btn-primary btn-sm" href="#/felfedezes">🗺️ Felfedezek egy túrát</a></section>':"")+
    '<div class="p5-grid4">'+ p5StatCard("🥾",String(st.n),"teljesített túra","#/turaim")+p5StatCard("📏",p5fmtNum(st.km)+" km","összes táv","#/turaim")+p5StatCard("⛰️",st.up?p5fmtNum(st.up)+" m":"—","összes szint")+p5StatCard("🏔️",st.maxE!=null?p5fmtNum(st.maxE)+" m":"nincs adat","legmagasabb pont")+"</div>"+
    p5Sec("📅 Éves statisztika "+ysel,yCard)+
    p5Sec("📊 Havi aktivitás", (yList.length? p5Chart(list,y):'<p class="muted">Ehhez az évhez nincs adat.</p>')+'<p class="small muted" style="margin:.5rem 0 0">🥾 túrák száma havonta — katt a tooltipre az km-ekért. Az adatok a V42 teljesítésekből jönnek.</p>')+
    p5Sec("🏆 Legjobb teljesítményeim",bb)+
    p5Sec("🗺️ Felfedezett régiók",rgHtml)+
    p5Sec("🗺️ Saját útvonalaim (V47)",p5RoutesInner())+
    p5Sec("❤️ Bakancslista · 📖 Élménykönyv · 🎒 Felszerelés", '<div class="p5-tiles">'+
      p5Tile("❤️","Bakancslista",((Store.myData().wishlist||[]).length)+" cél","#/bakancslista","❤️ Megnézem")+
      p5Tile("📖","Élménykönyv",((Store.myData().journal||[]).length)+" elmentett élmény","#/naplo","📖 Megnézem")+
      p5Tile("🎒","Felszerelésem",ownGearN()+" saját tétel","#/felszereles","🎒 Megnézem")+"</div>")+
    p5Sec("🧭 Túráim térképen",'<p class="muted small" style="margin:0 0 .4rem">A meglévő Saját térképre viszem a teljesített és tervezett túráid coords-jait.</p><a class="btn btn-soft btn-sm" href="#/terkep">🗺️ Megnyitom</a>')+
    (lastHtml? p5Sec("📖 Legutóbbi teljesített túrám",lastHtml):"")+
    p5Sec("🏆 Jelvények <small class=\"mut\">(motivációs mérföldkövek — nem hivatalos minősítés)</small>", badges)+
    (ng? '<section class="card panel p5-next"><b>🎯 Következő cél</b><p style="margin:.35rem 0 0">'+esc5(ng)+"</p></section>":"")+
    (got>=P5_BADGES.length&&list.length? '<section class="card panel p5-next"><b>🎉 Szép munka!</b><p style="margin:.35rem 0 0">Minden jelenlegi mérföldkövet teljesítetted.</p></section>':"")+
    p5Sec("🥾 Túrázási összegzés", sumS.length? '<p class="mt0">'+sumS.map(esc5).join("</p><p>")+"</p>" : '<p class="muted">Csak valódi adatból írunk — most nincs mit összefoglalni.</p>')+
    /* —— a korábbi fiók-blokk megőrizve (viszlátható link + kilépés) —— */
    '<section class="card panel p5-sec"><h2>👤 Fiók</h2><div class="p5-grid4">'+
      ["#/felszereles|🎒 Felszerelésem","#/bakancslista|❤️ Bakancslistám","#/naplo|📖 Túranaplóm","#/statisztikak|📊 Statisztikák","#/csapatok|👥 Túracsapatok","#/beallitasok|⚙️ Beállítások","#/ertesitesek|🔔 Értesítések ("+ (function(){try{return Store.notifications().length;}catch(e){return 0;}})()+")","#/turaim|🥾 Túráim"].map(function(pair){ var q=pair.split("|");
        return '<a class="quickact" href="'+q[0]+'" style="align-items:center;text-align:center"><b>'+esc5(q[1])+"</b></a>"; }).join("")+"</div>"+
      '<button class="btn btn-ghost btn-block" style="margin-top:12px" id="pf-out">🚪 Kijelentkezés</button></section>'+
  "</div>";
}
var _p5origAfter=VIEWS.profile&&VIEWS.profile.after;
VIEWS.profile=function(){ try{ if(!Store.me()) return ""; return dash("#/profil")(p5Inner()); }catch(e){ return dash("#/profil")('<section class="card panel"><h1>👤 Profil</h1><p class="muted">A profil most nem jeleníthető meg — az adataid érintetlenek.</p></section>'); } };
VIEWS.profile.after=function(root){ try{ _p5origAfter&&_p5origAfter(root); }catch(e){}
 try{ if(!root)return;
  var ys=root.querySelector("#p5year"); if(ys) ys.onchange=function(){ p5Y=ys.value; try{ App.render(); }catch(e){} };
  var ed=root.querySelector("#p5edit"); if(ed) ed.onclick=function(){ var u=Store.me()||{};
    openModal({ title:"✏️ Profil szerkesztése", body:'<label class="fld">Megjelenített név<input class="input" id="p5n" maxlength="40" value="'+esc5(u.name||"")+'"></label><label class="fld">Bemutatkozás (opcionális)<input class="input" id="p5b" maxlength="120" value="'+esc5(u.bio||"")+'"></label><p class="small muted">Profilképet a jelenlegi rendszer nem tárol — ezért nincs ilyen mező. Valódi név nem kötelező.</p>',
      footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="p5save">💾 Mentés</button>',
      onOpen:function(m){ var s=m.querySelector("#p5save"); if(s) s.onclick=function(){ var me=Store.me(); if(!me)return; var n=(m.querySelector("#p5n").value||"").trim(), bl=(m.querySelector("#p5b").value||"").trim();
        if(n)me.name=n; me.bio=bl; Store.save(); closeModal();
        var cloudSave=window.__V54&&window.__V54.api&&window.__V54.api.saveProfileFromLocal;
        if(cloudSave){ Promise.resolve(cloudSave()).then(function(){ toast("Profil mentve a fiókba","👤"); }).catch(function(){ toast("Profil helyben mentve; a felhőmentés nem sikerült","⚠️"); }).then(function(){ try{ App.render(); }catch(e){} }); }
        else { toast("Profil mentve","👤"); try{ App.render(); }catch(e){} }
      }; } }); };
  root.querySelectorAll("[data-p5route]").forEach(function(x){ x.onclick=function(){ try{ if(window.__rtopen) window.__rtopen(x.dataset.p5route,true); else NAV.to("#/utvonalak"); }catch(e){} }; });
  root.querySelectorAll("[data-p5mem]").forEach(function(b){ b.onclick=function(){ try{ var t=Store.getTour(b.dataset.p5mem); if(t&&window.openMemoryEditor) window.openMemoryEditor(t); else toast("A túra már nem érhető el","📖"); }catch(e){} }; });
 }catch(e){} };

/* ---------- dashboard mini-blokk ---------- */
(function(){ try{ var _prev=VIEWS.dash&&VIEWS.dash.after;
  VIEWS.dash.after=function(root){ try{ _prev&&_prev(root); }catch(e){}
    try{ if(!root||!root.querySelector) return; if(root.querySelector("#p50mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
      var list=doneList(); var st=agg(list); var bd=p5Badges(list,st); var got=bd.filter(function(b){return b.got===true;}).length;
      var box=document.createElement("section"); box.className="wsec"; box.id="p50mini";
      box.innerHTML='<div class="wpan p50mini"><b>👤 Saját túrázásom</b><span class="p50m1">'+st.n+" túra · "+p5fmtNum(st.km)+' km</span><span class="chip chip-green">🏆 '+got+" jelvény</span><a class=\"btn btn-soft btn-sm\" href=\"#/profil\">Profil</a></div>";
      var f9=root.querySelector("#f9mini"); if(f9&&f9.parentNode) f9.parentNode.insertBefore(box,f9.nextSibling); else w.appendChild(box);
    }catch(e){} }; }catch(e){} })();

window.__V50=1; window.__p5={doneList, agg, years, regionsOf, byM, bests, p5Badges, nextGoal};
})();
