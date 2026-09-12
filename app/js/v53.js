/* ============ V53 — 👥 Túratársak és közösségi túrák ============
   Közösségi réteg a V52 platformra: profiles/connections/invites/notifs a Store.community() alatt.
   Túra-adatok: NEM duplikál — a meghívott aMEGLÉVŐ projekt résztvevője (t.participants), a közös nézet ugyanazt
   az objectet olvassa. Közösségi túra = V52 platform-esemény (community:true, projectId csatolással).
   Minden mutation guard-olt: aktuális user + owner-jog. */
(function(){
"use strict";
function esc3(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function C(){ try{ return Store.community(); }catch(e){ return {profiles:[],connections:[],invites:[],notifs:[]}; } }
function curU(){ return Store.me(); }
function uidNow(){ var u=curU(); return u&&u.email?String(u.email):(u&&u.id)||""; }
function dataKeyOf(u){ return u.email?String(u.email):u.id; }
function profOf(uid){ return C().profiles.find(function(p){ return p.uid===uid; })||null; }
function myProf(){ return profOf(uidNow()); }
function setMyProf(patch){ var uid=uidNow(); var p=profOf(uid); if(!p){ p={ uid:uid, av:"", name:(curU().name||"Túrázó"), bio:"", types:[], regions:[], exp:"Kezdő", len:"Változó", avail:true, demo:false, createdAt:new Date().toISOString() }; C().profiles.push(p); } Object.assign(p, patch); p.availMask=(p.avail&&!p.demo)?!!(window.e2&&!0):null; Store.save(); try{ var cloudSave=window.__V54&&window.__V54.api&&window.__V54.api.saveProfileFromLocal; if(cloudSave) cloudSave().catch(function(){}); }catch(e){} return p; }
function pairKey(a,b){ return [a,b].sort().join("|"); }
function connOf(a,b){ var k=pairKey(a,b); return C().connections.find(function(x){ return x.k===k; })||null; }
function connAdd(targetUid){ var me=uidNow(); if(!targetUid||me===targetUid){ toast("Önmagad nem jelölheted","👥"); return; } var u=curU(); if(!myProf()){ setMyProf({}); }
  var ex=connOf(me,targetUid);
  if(ex && ex.status!=="none"){ toast(ex.status==="pending"?"A jelölés már elküldve 🟠":(ex.status==="accepted"?"Már túratársak lettetek 🟢":"A jelölést elutasították"), "👥"); return; }
  if(ex){ ex.status="pending"; ex.at=new Date().toISOString(); ex.req=me; }
  else C().connections.push({ id:"cn_"+Math.random().toString(36).slice(2,8), k:pairKey(me,targetUid), a:me, b:targetUid, req:me, status:"pending", at:new Date().toISOString(), demo:!!(profOf(targetUid)&&profOf(targetUid).demo) });
  c53notify(targetUid, "🔔 Új túratársi jelölés: "+(u.name||"Túrázó"), "#/tarsak", "conn-"+connOf(me,targetUid).id+"-req");
  Store.save(); toast("🟠 Jelölés elküldve","🤝"); }
function connDecide(id, status){ var cn=C().connections.find(function(x){ return x.id===id; }); if(!cn) return; var me=uidNow();
  if(cn.b!==me && cn.a!==me){ toast("Nem a te kérelmed","🔒"); return; }
  var other = cn.a===me?cn.b:cn.a;
  if(cn.status===status && status!=="none"){ toast("M már rögzítve","👥"); return; }
  cn.status=status; cn.decAt=new Date().toISOString();
  c53notify(other, status==="accepted"?"🟢 Elfogadta a jelölésedet — túratársak lettetek!":(status==="declined"?"❌ Elutasította a jelölést":"🗑 Kapcsolat eltávolítva"), "#/tarsak", "conn-"+cn.id+"-"+status+"-"+Date.now().toString().slice(-5));
  Store.save(); toast(status==="accepted"?"🟢 Túratársak lettett":(status==="declined"?"Elutasítva":"Eltávolítva"),"👥"); }
function c53notify(to, text, link, id){ if(!to||to.startsWith("DEMO")) { return; } C().notifs.push({ id: id||("n_"+Math.random().toString(36).slice(2,9)), to:to, text:text, link:link||"#/tarsak", at:new Date().toISOString(), read:false }); }
function myNotifs(){ var me=uidNow(); var c=C(); var mine=c.notifs.filter(function(n){ return n.to===me && !n.read; });
  if(mine.length>40){ c.notifs=c.notifs.filter(function(n){ return !(n.to===me && n.read); }); } return mine; }
function markNotifsRead(){ var me=uidNow(); C().notifs.forEach(function(n){ if(n.to===me) n.read=true; }); Store.save(); }
/* --- meghívók --- */
function createInvite(tourId){ var st=Store.findTourAnywhere(tourId); if(!st || !ownTour(tourId)){ toast("Csak a saját túrádhoz hozhatsz meghívót","🔒"); return null; }
  var tok="iv_"+Math.random().toString(36).slice(2,10);
  var inv={ id:"inv_"+tok.slice(3), tourId:tourId, token:tok, owner:st.owner, email:st.email, status:"active", by:uidNow(), at:new Date().toISOString() };
  C().invites.push(inv); Store.save(); toast("Meghívó link elkészült — more link: #/meghivo/"+tok, "🔗"); return inv; }
function inviteByToken(tok){ return C().invites.find(function(x){ return x.token===tok; })||null; }
function ownTour(id){ var t=Store.getTour(id); return !!(t && String((t.participants&&"")||"")==="" ? true : !!t) && !!(t); }
function joinByInvite(token){ var inv=inviteByToken(token); if(!inv){ toast("Érvénytelen vagy lejárt meghívó","🔗"); return false; }
  if(inv.status!=="active"){ toast("A meghívó már fel lett használva vagy elutasitották","👥 "); return false; }
  var st=Store.findTourAnywhere(inv.tourId); if(!st){ toast("A túra már nem érhető el","🥾"); return false; }
  var me=uidNow(), u=curU();
  var ex=(st.tour.participants||[]).find(function(p){ return p.uid===me; });
  if(ex){ ex.confirmed=true; ex.joinedAt=ex.joinedAt||new Date().toISOString(); ex.via="invite"; inv.status="accepted"; inv.uid=me;
    c53notify(inv.email||inv.owner, "👤 "+(u.name||"Túrázó")+" ismét részt vesz a(z) "+st.tour.title+" túrán", "#/tura/"+inv.tourId, "ivd-"+inv.token+"-re"); Store.save(); toast("🟢 Csatlakoztál a túrához","🥾"); return true; }
  st.tour.participants=st.tour.participants||[];
  st.tour.participants.push({ name:u.name||"Túrázó", uid:me, confirmed:true, at:new Date().toISOString(), via:"invite", role:"Résztvevő" });
  inv.status="accepted"; inv.uid=me;
  c53notify(inv.email||inv.owner, "🟢 "+(u.name||"Túrázó")+" csatlakozott a(z) "+st.tour.title+" túrához", "#/tura/"+inv.tourId, "ivd-"+inv.token+"-"+me);
  c53NotifyShared(st.tour, u); Store.save(); toast("🟢 Csatlakoztál a közös túrához — a projekt adatait látjátok","🥾"); return true; }
function declineInvite(token){ var inv=inviteByToken(token); if(!inv||inv.status!=="active") return; inv.status="declined"; inv.uid=uidNow();
  c53notify(inv.email||inv.owner, "❌ "+(curU().name||"Túrázó")+" elutasította a(z) "+ (function(){ var st=Store.findTourAnywhere(inv.tourId); return st?st.tour.title:""; })() +" meghívását", "#/tura/"+inv.tourId, "ivd-"+token+"-dec-"+Date.now().toString().slice(-4));
  Store.save(); toast("Elutasítva","⚪"); }
function leaveShared(tourId){ var me=uidNow(); var st=Store.findTourAnywhere(tourId); if(!st) return; var arr=(st.tour.participants||[]).filter(function(p){ return p.uid!==me; });
  if(arr.length!==(st.tour.participants||[]).length){ st.tour.participants=arr; c53notify(st.email||st.owner, "🚪 "+(curU().name||"Túrázó")+" kilépett a(z) "+st.tour.title+" túrából", "#/tura/"+tourId, "lv-"+tourId+"-"+me+"-"+Date.now().toString().slice(-4)); Store.save(); toast("Kiléptél a közös túrából","🚪"); } }
function c53NotifyShared(){ }
function sharedToursOfMe(){ var me=uidNow(); var out=[]; Store.allUserDataIds().forEach(function(k){ if(k===me) return; var d=Store.userDataOf(k)||{}; (d.tours||[]).forEach(function(t){ var row=(t.participants||[]).find(function(p){ return p.uid===me; }); if(row) out.push({ tour:t, owner:k, row:row }); }); }); return out; }
function memberRowOf(tourId){ var me=uidNow(); var st=Store.findTourAnywhere(tourId); if(!st) return null; var row=(st.tour.participants||[]).find(function(p){return p.uid===me;}); return row?{row:row, owner:st.owner}:null; }
function ownerOrgFor(uidEmail){ var p=Store.platform(); var o=p.organizers.find(function(x){ return x.owner===uidEmail; });
  if(!o){ o={ id:"org_"+Math.random().toString(36).slice(2,8), owner:uidEmail, name:(curU().name||"Túrázó")+" közösségi túrái", bio:"Community event publisher", region:"", web:"", phone:"", logo:"", demo:false, viaCommunity:true, createdAt:new Date().toISOString() }; p.organizers.push(o); Store.save(); } return o; }
/* --- közösségi túra publikálás a projektből --- */
function publishTour(tourId, opts){ var st=Store.findTourAnywhere(tourId); if(!st){ toast("Az esemény nem található","🥾"); return null; }
  opts=opts||{}; var cap=opts.cap?Math.max(1,parseInt(opts.cap,10)||0):null;
  var ex=Store.platform().events.find(function(e){ return e.projectId===tourId; });
  if(ex){ toast("Ezt a túrát már meghirdetted — megnyitom az eseményeid között","📢"); return ex; }
  var o=ownerOrgFor(st.email||st.owner); var t=st.tour;
  var ev={ id:"evp_"+Math.random().toString(36).slice(2,8), orgId:o.id, projectId:t.id, projectOwner:st.email||st.owner, projectOwnerKey:st.owner,
    name:t.title||"Közösségi túra", date:t.date||"", time:t.timeHint?t.timeHint.slice(0,5):(t.time||""), place:t.place||t.region||"", region:t.region||"", coords:(t.coords&&t.coords.lat)?[t.coords.lat,t.coords.lng]:null,
    km:(t.lengthKm&&isFinite(t.lengthKm)?t.lengthKm:null), up:(t.ascent!=null)?t.ascent:null, h:(t.durationH!=null)?t.durationH:null, diff:t.difficulty||"",
    desc:(t.desc||t.notes||"").slice(0,300), cap:cap, deadline:opts.deadline||"", status:"draft", joinMode:"internal", rev:0, demo:false, community:true, createdAt:new Date().toISOString() };
  if(t.routeId){ var rr=((Store.userDataOf(st.owner||st.email)||{}).routes||[]).find(function(x){ return x.id===t.routeId; });
    if(rr){ ev.routeId=rr.id; ev.routeSnap={ name:rr.name||"GPX útvonal", distance_km:rr.distance_km, gain:rr.elevation_gain_m, maxE:null, n:rr.nPts||null }; } }
  if(cap){ ev.status="draft"; }
  Store.platform().events.push(ev); Store.save(); toast("Előnézet kész — az esemény most PISZKOZAT; a Szervezői központban publikálhatod","🗂️"); return ev; }
function communityEventsOfMine(){ var me=uidNow(); var out=[]; Store.platform().events.forEach(function(e){ if(!e.community) return; var isMineOrg = (e.projectOwner && (e.projectOwner===me || (Store.userByAny(e.projectOwner)&&Store.userByAny(e.projectOwner).email===me))); var o=Store.platform().organizers.find(function(x){return x.id===e.orgId;}); if(isMineOrg || (o&&o.owner===me)) out.push(e); }); return out; }
/* --- a V52 döntés-hook: elfogadáskor résztvevővé tétel --- */
window.v53OnDecide=function(row,status,ev){ try{
  if(status==="accepted" && ev && ev.projectId){ var st=Store.findTourAnywhere(ev.projectId); if(!st) return;
    var ex=(st.tour.participants||[]).find(function(p){ return p.uid===row.uid; });
    if(!ex){ st.tour.participants=st.tour.participants||[]; st.tour.participants.push({ name:row.name||"Túrázó", uid:row.uid, confirmed:true, at:row.at||new Date().toISOString(), via:"event:"+ev.id, role:"Résztvevő" });
      c53notify(st.owner, "🟢 "+(row.name||"Túrázó")+" elfogadva és csatlakozott a közös projekthez", "#/tura/"+ev.projectId, "ea-"+row.eid+"-"+row.uid+"-"+Date.now().toString().slice(-4)); }
    c53notify(row.uid, "🟢 Elfogadta a szervező a jelentkezést — 🗓️ Megnyitom a közös túrát", "#/tura/"+ev.projectId, "ead-"+ev.id+"-"+row.uid);
    Store.save(); }
  if(status==="declined" && row){ c53notify(row.uid, "🔴 Elutasította a jelentkezést: "+ev.name, "#/felfedezes", "ed-"+ev.id+"-"+row.uid+"-"+Date.now().toString().slice(-4)); Store.save(); }
}catch(e){} };
/* ---------- DEMOprofile-ok (egyértelmű jelöléssel) ---------- */
function ensureDemo(){ var c=C(), before=c.profiles.length; c.profiles=(c.profiles||[]).filter(function(p){ return !p.demo && !/^DEMO/i.test(String(p.uid||"")) && !/^DEMO/i.test(String(p.name||"")); }); if(c.profiles.length!==before){ c.connections=(c.connections||[]).filter(function(x){ return !/^DEMO/i.test(String(x.a||"")) && !/^DEMO/i.test(String(x.b||"")); }); Store.save(); } }
function typeOpts(){ return ["Körös túra","Gerinctúra","Kilátás","Vízesés","Sátoros","Teljesítménytúra","Családi"]; }
function userStats(uid){ try{ var d=Store.userDataOf(uid)||{}; var tours=d.tours||[]; var j=d.journal||[];
  var done=tours.filter(function(t){ return t.status==="teljesítve"||t.status==="archiválva"; });
  var km=0,up=0; done.forEach(function(t){ var jr=(j||[]).find(function(x){return x.tourId===t.id;}); var k=jr?+jr.km:+t.lengthKm; var u=jr?+jr.up:+t.ascent; if(isFinite(k)&&k>0)km+=k; if(isFinite(u)&&u>0)up+=u; });
  var bd=0; try{ if(window.__p5){ var dl=window.__p5.doneList(); var st=window.__p5.agg(dl); bd=window.__p5.p5Badges(dl,st).filter(function(b){return b.got===true;}).length; } }catch(e2){}
  return { tours:done.length, km:Math.round(km), up:Math.round(up), badges:bd }; }catch(e){ return {tours:0,km:0,up:0,badges:0}; } }
function myId(){ return uidNow(); }
function renderCard(p){ var me=myId(); var s=pairStatus(me,p.uid); var btn="";
  if(s==="none"||s==="declined") btn='<button class="btn btn-primary btn-sm" data-c53add="'+p.uid+'">👥 Túratársnak jelölöm</button>'+(s==="declined"?' <span class="chip chip-rose">❌ Elutasítva</span>':"");
  else if(s==="pending"){ var cn=connOf(me,p.uid); btn = (cn.req===me)? '<span class="chip chip-amber">🟠 Jelölés elküldve</span> <button class="btn btn-ghost btn-sm" data-c53dec="'+cn.id+':none">⚪ Visszavonom</button>'
    : '<button class="btn btn-soft btn-sm" data-c53dec="'+cn.id+':accepted">🟢 Elfogadom</button> <button class="btn btn-ghost btn-sm" data-c53dec="'+cn.id+':declined">❌ Elutasítom</button>'; }
  else btn='<span class="chip chip-green">🟢 Túratársak</span> <button class="btn btn-ghost btn-sm" data-c53dec="'+connOf(me,p.uid).id+':none">Kapcsolat törlése</button>';
  var s2=userStats(p.uid);
  return '<article class="f9card card c53card"><div class="f9-b"><div class="f9-t1">'+(p.av?'<img src="'+esc3(p.av)+'" class="c53-av img" alt="">':'<span class="c53-av">'+esc3((p.name||"T").charAt(0))+"</span>")
    +"<b>"+esc3(p.name||"Túrázó")+"</b>"+((p.regions||[]).map(function(r){return '<span class="chip chip-sand">📍 '+esc3(r)+"</span>";}).join(""))
    +"</div><p class=\"small muted mb0\">🥾 "+s2.tours+" túra · 📏 "+s2.km+" km · ⛰️ "+s2.up+" m"+(s2.badges?" · 🏆 "+s2.badges:"")+((p.exp)?(" · 🎓 "+esc3(p.exp)):"")+((p.len)?(" · ⏱ "+esc3(p.len)):"")+(p.avail?" · 🟢 elérhető":" · ⚪ most nem")+"</p>"
    +'<p class="small mb0">'+((p.types||[]).map(function(t){return '<span class="chip chip-green">'+esc3(t)+"</span>";}).join(" ")||"")+"</p>"
    +'<div class="f9cta">'+btn+"</div></div></article>"; }
function pairStatus(a,b){ var cn=connOf(a,b); return cn?cn.status:"none"; }
function c53Inner(){ ensureDemo(); var u=curU(); var me=myId(); var P5=myProf();
  var myC=C().connections.filter(function(x){ return x.a===me||x.b===me; });
  var friends=myC.filter(function(x){return x.status==="accepted";});
  var sent=myC.filter(function(x){return x.status==="pending";});
  var pool=C().profiles.filter(function(p){ return p.uid!==me; });
  var html='<div class="c53"><section class="card panel p5-hero"><span class="p5-av">'+(P5&&P5.av?'<img src="'+esc3(P5.av)+'" class="c53-av img" alt="">':"👤")+'</span><div class="p5-ht"><h1 style="margin:0;font-size:1.3rem">👥 Túratársak</h1><p class="muted" style="margin:.25rem 0 0">'+esc3(P5?P5.name:(u.name||"Túrázó"))+" · "+friends.length+" túratárs · "+sent.length+" függő"+(myNotifs().length?" · 🔔 "+myNotifs().length+" értesítés":"")+"</p></div>"+
    '<button class="btn btn-ghost btn-sm" id="c53-editprof">'+(P5?"✏️ Közösségi profil":"👤 Közösségi profil létrehozása")+"</button></section>";
  html+='<div class="c53-tools"><input class="input" id="c53-q" placeholder="🔎 Keress túrázót (név, régió, típus)…">'
    +'<select class="input" id="c53-reg"><option value="">📍 Régió: minden</option>'+pool.map(function(p){return p.regions||[];}).join(",").split(",").map(function(x){return x.trim();}).filter(function(v,i,a){return v&&a.indexOf(v)===i;}).map(function(r){return '<option>'+esc3(r)+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-exp"><option value="">🎓 Tapasztalat</option>'+["Kezdő","Közepes","Haladó"].map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-len"><option value="">⏱ Hossz</option>'+["Egynapos","Többnapos","Változó"].map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-type"><option value="">🥾 Típus</option>'+typeOpts().map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<label class="c53-chk"><input type="checkbox" id="c53-avail" style="width:auto"> csak elérhető</label></div>'
    +'<div id="c53-list">'+ (pool.length? pool.map(renderCard).join("") : '<p class="muted">Nincs még megjeleníthető profil — hozz létre közösségi profilt, majd jelölj másokat.</p>')+"</div>";
  var inc=C().connections.filter(function(cn){ return (cn.a===me||cn.b===me) && cn.status==="pending" && cn.req!==me; });
  var pf={}; C().profiles.forEach(function(p){ pf[p.uid]=p.name; });
  html+='<section class="card panel c53-sec"><h2>📩 Bejövő jelölések</h2>'+ (inc.length? '<div class="c53-rows">'+ inc.map(function(cn){ var other=cn.a===me?cn.b:cn.a;
    return '<div class="e2row"><div><b>'+esc3(pf[other]||other)+"</b><span class='mut'>🟠 jelölést küldött</span></div><div class='e2rowbtns'><button class='btn btn-soft btn-sm' data-c53dec=\""+cn.id+":accepted\">🟢 Elfogadom</button><button class='btn btn-ghost btn-sm' data-c53dec=\""+cn.id+":declined\\\">❌ Elutasítom</button></div></div>"; }).join("")+"</div>" : '<p class="muted small mb0">Nincs bejövő jelölésed.</p>')+"</section>";
  var mines=sharedToursOfMe();
  if(mines.length) html+='<section class="card panel c53-sec"><h2>🤝 Közös túráim</h2>'+ mines.slice(0,4).map(function(x){ var od=Store.userDataOf(x.owner)||{}; var un=(Store.userByAny(x.owner)||{}).name||x.owner;
    return '<div class="e2row"><div><b>🥾 '+esc3(x.tour.title||"Túra")+"</b><span class='mut'>👑 "+esc3(un)+((x.tour.date)?(" · "+esc3(x.tour.date)):"")+"</span></div><div class='e2rowbtns'><a class='btn btn-soft btn-sm' href='#/tura/"+x.tour.id+"'>Megnyitom</a><button class='btn btn-ghost btn-sm' data-c53leave='"+x.tour.id+"'>🚪 Kilépek</button></div></div>"; }).join("")+"</section>";
  return html+"</div>"; }
VIEWS.tarsak=function(){ try{ if(!curU()) return dash("#/tarsak")('<div class="empty"><h3>JEentkezz be a túratársakhoz</h3><a class="btn btn-primary" href="#/belepes">Belépés</a></div>'); return dash("#/tarsak")(c53Inner()); }catch(e){ return dash("#/tarsak")('<section class="card panel"><h1>👥 Túratársak</h1><p class="muted">A nézet most nem érhető el — az adataid érintetlenek.</p></section>'); } };
VIEWS.tarsak.after=function(root){ try{ var me=myId();
  function rf(){ var l=root.querySelector("#c53-list"); if(!l) return; var pool=C().profiles.filter(function(p){ return p.uid!==me; });
    var qq=(root.querySelector("#c53-q").value||"").toLowerCase().trim();
    var rg=root.querySelector("#c53-reg").value; var ex=root.querySelector("#c53-exp").value; var ln=root.querySelector("#c53-len").value; var ty=root.querySelector("#c53-type").value; var av=root.querySelector("#c53-avail").checked;
    var fr=pool.filter(function(p){ if(qq && String((p.name||"")+" "+((p.regions||[]).join(" "))+" "+((p.types||[]).join(" "))).toLowerCase().indexOf(qq)<0) return false;
      if(rg && (p.regions||[]).indexOf(rg)<0) return false; if(ex && p.exp!==ex) return false; if(ln && p.len!==ln) return false;
      if(ty && (p.types||[]).indexOf(ty)<0) return false; if(av && !p.avail) return false; return true; });
    l.innerHTML= fr.length? fr.map(renderCard).join("") : '<div class="empty"><span class="em-ico">🔎</span><h3>Nincs találat</h3><p class="muted">Nincs a szűrőnek megfelelő profil.</p></div>'; }
  ["c53-q","c53-reg","c53-exp","c53-len","c53-type"].forEach(function(idd){ var elx=root.querySelector("#"+idd); if(elx){ elx.oninput=rf; elx.onchange=rf; } });
  var ack=root.querySelector("#c53-avail"); if(ack) ack.onchange=rf;
  var ep=root.querySelector("#c53-editprof"); if(ep) ep.onclick=function(){ profForm(); }; }catch(e){} };
function profForm(){ var P5=myProf()||{}; var u=curU();
  openModal({ title:"👤 Közösségi profil", body:'<div class="e2form"><label class="f">Megjelenített név *</label><input class="input" id="pr_n" maxlength="40" value="'+esc3(P5.name||u.name||"Túrázó")+'">'+
   '<label class="f">Rövid bemutatkozás</label><textarea class="input" id="pr_b" rows="2">'+esc3(P5.bio||"")+"</textarea>"+
   '<label class="f">Profilkép (opcionális)</label><label class="btn btn-soft btn-sm">🖼️ Kép<input type="file" accept="image/*" id="pr_avf" style="display:none"></label><p id="pr_avmsg" class="small muted">'+(P5.av?"✓ Van kép":"nincs")+"</p>"+
   '<label class="f">Kedvenc túratípusok</label><div class="chips">'+typeOpts().map(function(t){ var on=(P5.types||[]).indexOf(t)>-1; return '<button type="button" class="f-pill'+(on?" on":"")+'" data-prt="'+t+'">'+t+"</button>"; }).join("")+"</div>"+
   '<label class="f">Kedvenc régiók (vesszővel)</label><input class="input" id="pr_r" value="'+esc3((P5.regions||[]).join(", "))+'">'+
   '<div class="grid g2e"><div><label class="f">Tapaszlalati szint</label><select class="input" id="pr_exp">'+["Kezdő","Közepes","Haladó"].map(function(x){return '<option'+((P5.exp||"Kezdő")===x?" selected":"")+">"+x+"</option>";}).join("")+"</select></div>"+
   '<div><label class="f">Túrahossz</label><select class="input" id="pr_len">'+["Egynapos","Többnapos","Változó"].map(function(x){return '<option'+((P5.len||"Változó")===x?" selected":"")+">"+x+"</option>";}).join("")+"</select></div></div>"+
   '<label class="f">Elérhetőség</label><select class="input" id="pr_av">'+["Igen","Most nem"].map(function(x){return '<option'+((P5.avail!==false)?"Igen":"Most nem")===x?" selected":""+">"+x+"</option>";}).join("")+"</select>"+
   '<p class="small muted mt0 mb0">A statisztika a V50 profilból jön, nem írható itt.</p><p id="pr_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="pr_save">💾 Mentés</button>',
   onOpen:function(m){ var cur=myProf()||{}; m.__av=cur.av||null;
     m.querySelectorAll("[data-prt]").forEach(function(bt){ bt.onclick=function(){ bt.classList.toggle("on"); }; });
     m.querySelector("#pr_avf").onchange=function(){ var f=this.files&&this.files[0]; if(!f) return; if(f.size>120000){ var er=m.querySelector("#pr_err"); er.textContent="A kép max ~120 KB."; er.style.display=""; return; }
       var rd=new FileReader(); rd.onload=function(){ m.__av=String(rd.result||"").slice(0,180000); m.querySelector("#pr_avmsg").textContent="✓ kiválasztva"; }; rd.readAsDataURL(f); };
     m.querySelector("#pr_save").onclick=function(){ var v=function(id){ var e=m.querySelector(id); return e?String(e.value||"").trim():""; }; var nm=v("#pr_n");
       if(!nm){ var er2=m.querySelector("#pr_err"); er2.textContent="A név kötelező."; er2.style.display=""; return; }
       var types=[]; m.querySelectorAll("[data-prt].on").forEach(function(x){ types.push(String(x.getAttribute("data-prt"))); });
       var regs=v("#pr_r").split(/[,;]/).map(function(x){return x.trim();}).filter(Boolean);
       setMyProf({ name:nm, bio:v("#pr_b"), types:types, regions:regs, exp:v("#pr_exp"), len:v("#pr_len"), avail:v("#pr_av")==="Igen", av:m.__av||"" });
       closeModal(); toast("👤 Közösségi profil mentve","🤝"); try{ App.render(); }catch(e){} }; } }); }
/* ---------- MEGHÍVÓ nézet (link nyitó) ---------- */
function invInner(tok){ var inv=inviteByToken(tok);
  if(!inv) return '<section class="card panel"><h1>🔗 Érvénytelen vagy lejárt link</h1><p class="muted">A meghívó nem található — kérd el újra a szervezőtől, vagy használd a 🗺️ Felfedezést.</p><a class="btn btn-primary" href="#/tarsak">👥 Túratársak</a></section>';
  var st=Store.findTourAnywhere(inv.tourId); var t=st&&st.tour; var me=myId(); var u=curU();
  if(!t) return '<section class="card panel"><h1>🥾 A túra már nem érhető el</h1><a class="btn btn-soft" href="#/tarsak">👥 Túratársak</a></section>';
  
  var ownerLabel=(function(){ var uu=Store.userByAny(st.owner)||Store.userByAny(st.email); return (uu&&uu.name)||"Szervező"; })();
  var joined=(t.participants||[]).some(function(p){ return p.uid===me; });
  if(String(st.email)===String(me)||st.owner===me) return '<section class="card panel c53-inv"><h1>🔗 Meghívó</h1><p class="muted">Ez a te saját túrád — a résztvevőket a projekt 👥 fülén kezelheted.</p><a class="btn btn-primary" href="#/tura/'+t.id+'">🥾 A túrához</a></section>';
  return '<section class="card panel c53-inv"><h1>🥾 '+esc3(t.title||"Közösségi túra")+"</h1>"+
    '<p class="muted mt0">👑 Szervező: '+esc3(ownerLabel)+(t.date? ' · 📅 '+esc3(t.date):"")+(t.place? ' · 📍 '+esc3(t.place):"")+(t.lengthKm? ' · 📏 '+t.lengthKm+" km":"")+(t.ascent? ' · ⛰️ +'+t.ascent+" m":"")+"</p>"+
    (joined? '<p class="chip chip-green">🟢 Már részt veszel</p><a class="btn btn-soft" href="#/tura/'+t.id+'">🗓️ Megnyitom a közös túrát</a>' :
      '<p class="muted small">'+(inv.status==="declined"?"❌ Korábban elutasítottad — de most csatlakozhatsz.":(inv.status==="accepted"?"🟢 Elfogadva — nyisd meg a közös túrát.":"🟠 Meghívtak erre a konkrét túrára."))+"</p>"+
      '<div class="f9cta"><a class="btn btn-primary btn-sm" href="#/tura/'+t.id+'" id="c53-inv-go" target="_self">👥 Csatlakozom és megnyitom</a> <button class="btn btn-ghost btn-sm" id="c53-inv-dec">❌ Elutasítom</button></div>')+
    '<p class="small muted mt0">🔒 Ez a link kizárólag ehhez a túrához ('+esc3(t.title||"")+') tartozik — másik projekthez nem használható.</p></section>'; }
var _invTok="";
VIEWS.meghivo=function(a){ try{ _invTok=(a&&a.token)||hashToken()||""; return dash("#/meghivo")(invInner(_invTok)); }catch(e){ return dash("#/meghivo")("<section class=\"card panel\"><h1>🔗 Hiba</h1></section>"); } };
VIEWS.meghivo.after=function(root){ try{ var go=root.querySelector("#c53-inv-go"); if(go) go.onclick=function(e){ e.preventDefault(); if(joinByInvite(hashToken())) { setTimeout(function(){ try{ App.render(); }catch(e2){} },300); } };
  var dc=root.querySelector("#c53-inv-dec"); if(dc) dc.onclick=function(){ declineInvite(hashToken()); try{ App.render(); }catch(e){} }; }catch(e){} };
function hashToken(){ var h=location.hash||""; var m=h.match(/#\/meghivo\/([A-Za-z0-9_]+)/); return m?m[1]:""; }
/* ---------- MEGOSZTOTt project view: ha nem a mi túránk, de résztvevők vagyunk ---------- */
function memberStats(t){ return { n:(t.participants||[]).filter(function(p){return p.confirmed;}).length }; }
function sharedView(t, ownerId, row){ var od=Store.userDataOf(ownerId)||{}; var uu=Store.userByAny(ownerId)||{}; var ownerName=uu.name||"Szervező";
  var rr=(od.routes||[]).find(function(x){ return x.id===t.routeId; });
  var tl=(t.timeline||[]).map(function(p){ return "<li>"+esc3(p.t||p.time||"")+" — "+esc3(p.act||p.name||"")+"</li>"; }).join("");
  var tasks=(t.tasks||[]).map(function(k){ var host=k.host?esc3(k.host):"—"; return '<div class="e2row"><div><b>'+(k.done?"✅ ":"⬜ ")+esc3(k.t||k.title||"")+'</b></div><span class="mut">👤 '+host+"</span></div>"; }).join("");
  var gearAll=(t.gear||[]); var food=(t.food||[]); var bud=(t.budget||[]);
  return '<div class="wrap" style="padding-top:16px"><section class="card panel c53-share"><span class="chip chip-sand">👤 Meghívottként nézed — READ-ONLY</span>'+
   '<h1 style="margin:.2rem 0">🥾 '+esc3(t.title||"Túra")+'</h1><p class="muted mt0" style="margin:.2rem 0 0">👑 Szervező: '+esc3(ownerName)+(t.date? " · 📅 "+esc3(t.date):"")+(t.place? " · 📍 "+esc3(t.place):"")+(t.lengthKm? " · 📏 "+t.lengthKm+" km":"")+(t.ascent? " · ⛰️ +"+t.ascent+" m":"")+(t.difficulty? " · 🥾 "+esc3(t.difficulty):"")+"</p>"+
   '<div class="f9cta"><a class="btn btn-soft btn-sm" href="#/tarsak">👥 Túratársak</a> <button class="btn btn-ghost btn-sm" id="cx53-leave" data-t="'+t.id+'">🚪 Kilépek</button></div></section>'+
   '<div class="p5-grid4">'+p5statish("👥", memberStats(t).n+" fő","létszám")+p5statish("⏱",(t.durationH||"—")+" ó","időtartam")+p5statish("🥾",esc3(t.difficulty||"—"),"nehézség")+(rr? p5statish("🗺️","GPX","útvonal csatolva"):"")+"</div>"+
   (rr? '<section class="card panel c53-sec"><h2>🗺️ Útvonal (a szervező GPX-e)</h2><p class="small muted mb0">'+esc3(rr.name||"GPX")+" · 📏 "+(rr.distance_km||"?")+" km · ⛰️ +"+(rr.elevation_gain_m||"?")+" m</p></section>":"")+
   ((t.noteStream||[]).length? '<section class="card panel c53-sec"><h2>📝 Jegyzetek</h2><ul class="c53-note">'+ (t.noteStream||[]).slice(-8).map(function(nn){ return '<li>'+esc3(nn.text||nn.note||"")+"</li>"; }).join("")+"</ul></section>":"")+
   ((t.timeline||[]).length? '<section class="card panel c53-sec"><h2>⏱ Időterv</h2><ol class="c53-note">'+tl+"</ol></section>":"")+
   (tasks? '<section class="card panel c53-sec"><h2>✅ Teendők (gazdákkal)</h2>'+tasks+"</section>":"")+
   (gearAll.length? '<section class="card panel c53-sec"><h2>🎒 Felszerelés</h2><div class="chips">'+gearAll.map(function(g){ return '<span class="chip">'+(g.checked?"🎒":"🎒")+" "+esc3(g.name||"")+"</span>"; }).join("")+"</div></section>":"")+
   (food.length? '<section class="card panel c53-sec"><h2>💧 Étel-víz</h2><div class="chips">'+food.map(function(f){ return '<span class="chip">'+esc3(f.n||f.name||"")+"</span>"; }).join("")+"</div></section>":"")+
   (bud.length? '<section class="card panel c53-sec"><h2>💶 Költségek</h2><div class="c53-rows">'+bud.map(function(b){ return '<div class="e2row"><span>'+esc3(b.item||b.n||"")+"</span><b>"+(b.cost||b.sum||"—")+"</b></div>"; }).join("")+"</div></section>":"")+
   '<section class="card panel c53-sec"><h2>👥 Résztvevők</h2><div class="c53-rows">'+(t.participants||[]).map(function(p){ return '<div class="e2row"><div><b>'+esc3(p.name||"Túrázó")+(p.uid===ownerId?" 👑":"")+"</b></div><span class='mut'>"+(p.confirmed?"🟢":"🟠")+(p.via?" · "+esc3(p.via):"")+"</span></div>"; }).join("")+"</div></section></div>"; }
function p5statish(ic,v,l){ return '<div class="p5-stat"><b class="p5-sv">'+ic+" "+v+'</b><small class="p5-sl">'+l+"</small></div>"; }
var _wsOrigFn=VIEWS.workspace, _wsOrigAfter=_wsOrigFn&&_wsOrigFn.after;
VIEWS.workspace=function(a){ try{ if(!Store.getTour(a)) { var mm=memberRowOf(a); if(mm) return '<main class="wrap">'+sharedView(Store.findTourAnywhere(a).tour, mm.owner, mm.row)+"</main>"; } }catch(e){}
  var base=_wsOrigFn?_wsOrigFn.apply(this,arguments):"";
  try{ if(Store.getTour(a)) { var extra=c53ActionsOn(a); if(base.indexOf('class="dash-main">')>-1) base=base.replace('class="dash-main">','class="dash-main">'+extra); else base = base.replace('</main>', extra+'</main>'); } }catch(e){}
  return base; };
VIEWS.workspace.after=function(root,id){ try{ _wsOrigAfter&&_wsOrigAfter(root,id); }catch(e){}
  try{ if(!root) return;
    var lw=root.querySelector("#cx53-leave"); if(lw) lw.onclick=function(){ leaveShared(lw.dataset.t); location.hash="#/tarsak"; };
    var ib=root.querySelector("#c53-invite"); if(ib) ib.onclick=function(){ var inv=createInvite(id); if(!inv) return; copyLink(inv); };
    var hc=root.querySelector("#c53-hosts"); if(hc) hc.onclick=function(){ hostModal(id); };
    var pb=root.querySelector("#c53-publish"); if(pb) pb.onclick=function(){ publishModal(id); };
    var pp2=root.querySelector("#c53-publish-open"); if(pp2) pp2.onclick=function(){ try{ var e2=Store.platform().events.find(function(x){ return x.projectId===id; }); if(e2&&window.v49OpenEv) window.v49OpenEv("p2-"+e2.id); }catch(e){} };
  }catch(e){} };
function c53Actions(id){ var mine=Store.getTour(id); if(!mine) return "";
  return '<div class="c53-own"><span class="chip chip-green">👑 Szervező vagy</span> <button class="btn btn-soft btn-sm" id="c53-invite">🔗 Meghívó link</button> <button class="btn btn-soft btn-sm" id="c53-hosts">👤 Gazdák</button> <button class="btn btn-ember btn-sm" id="c53-publish">📢 Meghirdetem</button></div>'; }
function c53ActionsOn(id){ return c53Actions(id); }
function copyLink(inv){ var url=location.origin+location.pathname+"#/meghivo/"+inv.token; var done=false;
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url); done=true; } }catch(e){}
  toast(done?"Meghívó link kimásolva":"Link: #/meghivo/"+inv.token,"🔗"); }
function hostModal(id){ var t=Store.getTour(id); if(!t) return; if(!((t.participants||[]).length|| true)){}
  var ppl=[{uid:null,name:"👑 Szervező (te)"}].concat((t.participants||[]).map(function(p){ return {uid:p.uid,name:p.name||"Túrázó"}; }));
  var list=(t.tasks||[]).slice();
  openModal({ title:"👤 Feladat- és eszköz gazdák", body:'<p class="small muted mt0">Meglévő teendők — ki ért hozzájuk. A rendszer nem új feladatot, a meglévő gazdát állítja.</p><div class="c53-hosts">'+ list.map(function(k,i){ return '<div class="c53-hostrow"><b>'+esc3(k.t||k.title||"Teendő")+"</b><select class=\"input\" data-hhost=\""+i+'"><option value="">gazda nélkül</option>'+ppl.map(function(p){ var val=String(p.uid||""); return '<option value="'+esc3(val)+'"'+(String(k.host)===val?" selected":"")+">"+esc3(p.name)+"</option>"; }).join("")+"</select></div>"; }).join("")+"</div>",
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="c53-hostsave">💾 Mentés</button>',
   onOpen:function(m){ m.querySelector("#c53-hostsave").onclick=function(){        var idxs=m.querySelectorAll("[data-hhost]"); for(var i=0;i<idxs.length;i++){ var sel=idxs[i]; var ki=+sel.getAttribute("data-hhost"); var tv=sel.value;
         var person=ppl.find(function(pp){ return String(pp.uid||"")===String(tv); }); t.tasks[ki].host=person?person.name:""; t.tasks[ki].hostUid=person?person.uid:null; }
       Store.save(); toast("Gazdák elmentve","👤"); closeModal(); try{ App.render(); }catch(e){} }; } }); }
function publishModal(id){ var t=Store.getTour(id); if(!t) return; var ex=Store.platform().events.find(function(e){ return e.projectId===id; });
  if(ex){ openModal({ title:"📢 Meghirdetve", body:'<p class="muted mt0">Ezt a túrát már meghirdetted — '+esc3(ex.name)+".</p>", footer:'<button class="btn btn-ghost" data-close>Bezár</button> <button class="btn btn-primary" id="c53-p-open">🗓️ Az esemény</button>', onOpen:function(m){ var o=m.querySelector("#c53-p-open"); if(o) o.onclick=function(){ try{ if(window.v49OpenEv) window.v49OpenEv("p2-"+ex.id); }catch(e){} closeModal(); }; } }); return; }
  openModal({ title:"📢 Túra meghirdetése — előnézet", body:
    '<div class="e2form"><p class="small muted mt0">A projekt adataiból készülő <b>közösségi túra</b>, mint V52 esemény (piszkozatban indul — a Szervezői központban publikálod).</p>'+
    '<label class="f">Cím *</label><input class="input" id="pv_t" value="'+esc3(t.title||"")+'">'+
    '<div class="grid g2e"><div><label class="f">Dátum</label><input class="input" id="pv_d" value="'+esc3(t.date||"")+'"></div><div><label class="f">Helyszín</label><input class="input" id="pv_p" value="'+esc3(t.place||"")+'"></div>'+
    '<div><label class="f">Km</label><input class="input" id="pv_km" value="'+esc3(t.lengthKm||"")+'"></div><div><label class="f">Szint</label><input class="input" id="pv_up" value="'+esc3(t.ascent||"")+'"></div>'+
    '<div><label class="f">Max létszám</label><input class="input" id="pv_cap" type="number" min="1" placeholder="nincs limit"></div><div><label class="f">Jelentkezési határidő</label><input class="input" id="pv_dl" type="date"></div></div>'+
    '<label class="f">Rövid leírás</label><textarea class="input" id="pv_ds" rows="2">'+esc3((t.desc||"").slice(0,240))+"</textarea>"+
    ((t.routeId)?"<p class='small muted'>🗺️ GPX útvonal csatolva az előnézethez.</p>":"<p class='small muted'>🗺️ Nincs GPX útvonal — a jelentkezők nem látnak ilyet.</p>")+
    '<p id="pv_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse (nem publikál)</button> <button class="btn btn-primary" id="pv_go">📢 Előnézetből létrehozás (piszkozat)</button>',
   onOpen:function(m){ m.querySelector("#pv_go").onclick=function(){ var v=function(id2){ var e=m.querySelector(id2); return e?String(e.value||"").trim():""; };
     var cap=v("#pv_cap"); var t2=Store.getTour(id); if(!t2) return;
     t2.title=v("#pv_t"); t2.date=v("#pv_d"); t2.place=v("#pv_p");
     if(!t2.title){ var er=m.querySelector("#pv_err"); er.textContent="Cím kötelező."; er.style.display=""; return; }
     var ev=publishTour(id,{ cap:cap?parseInt(cap,10):null, deadline:v("#pv_dl") }); if(ev){ closeModal(); toast("🗂️ Közösségi esemény piszkozat létrehozva — a Szervezői központban publikálhatod","📢"); try{ App.render(); }catch(e){} } }; } }); }
/* ---------- delegált akciók ---------- */
var _doc=document;
_doc.addEventListener("click", function(evt){ try{ var b=evt.target&&evt.target.closest?evt.target.closest("[data-c53add],[data-c53dec],[data-c53leave]"):null; if(!b) return;
  var ad=b.getAttribute("data-c53add"); if(ad){ connAdd(ad); refreshAll(); return; }
  var de=b.getAttribute("data-c53dec"); if(de){ var q=String(de).split(":"); connDecide(q[0], q[1]||"none"); refreshAll(); return; }
  var lv=b.getAttribute("data-c53leave"); if(lv){ leaveShared(lv); refreshAll(); return; } }catch(e){} });
function refreshAll(){ try{ if(window.App&&App.render) App.render(); }catch(e){} }
/* ---------- V50 profil blokk + értesítés-gomb ---------- */
(function(){ var _p=VIEWS.profile&&VIEWS.profile.after;
  VIEWS.profile.after=function(root){ try{ _p&&_p(root); }catch(e){}
    try{ if(!root||root.querySelector("#c53psec")) return; var u=curU(); if(!u) return; var P5=myProf(); var me=uidNow();
      var fr=C().connections.filter(function(x){ return (x.a===me||x.b===me)&&x.status==="accepted"; }).length;
      var sec=document.createElement("section"); sec.className="card panel p5-sec"; sec.id="c53psec";
      var s2=userStats(me);
      sec.innerHTML="<h2>👥 Közösség</h2>"+ (P5? '<div class="e2row"><div><b>'+ (P5.av?'<img src="'+esc3(P5.av)+'" class="c53-av img sm" alt="">':'👤')+" "+esc3(P5.name)+"</b><span class='mut'>"+fr+" túratárs · 🥾 "+s2.tours+" · 🏆 "+s2.badges+"</span></div><a class='btn btn-soft btn-sm' href='#/tarsak'>👥 Túratársak</a></div>"
        : "<p class='muted mb0' style='margin:.1rem 0 .4rem'>Megjelenhetsz másoknak is, mint túratársjelölt — állíts be közösségi profilt.</p><a class='btn btn-primary btn-sm' href='#/tarsak'>👤 Közösségi profil</a>");
      var last=root.querySelector(".p5 > section:nth-last-child(3)"); var host=root.querySelector(".p5"); if(host&&last) host.insertBefore(sec, last.nextSibling); else if(host) host.appendChild(sec); }catch(e){} }; })();
/* ---------- dashboard mini blokk ---------- */(function(){ var _pd=VIEWS.dash&&VIEWS.dash.after;
  VIEWS.dash.after=function(root){ try{ _pd&&_pd(root); }catch(e){}
    try{ if(!root||!root.querySelector) return; if(root.querySelector("#c53mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
      ensureDemo(); var me=uidNow(); var rows=[];
      C().connections.forEach(function(cn){ if((cn.a===me||cn.b===me)&&cn.status==="pending"&&cn.req!==me){ var o=cn.a===me?cn.b:cn.a; var p=profOf(o); rows.push("🟠 "+ (p&&p.name||o) + " jelölne — fogadd a Túratársaknál"); } });
      C().invites.forEach(function(iv){ if(iv.status==="active"&&(!iv.uid||iv.uid===me)){ var st=Store.findTourAnywhere(iv.tourId); if(st) rows.push("🔗 Meghívás: "+(st.tour.title||"túra")); } });
      sharedToursOfMe().forEach(function(x){ if(x.tour.date) rows.push("🥾 "+x.tour.title+" · "+x.tour.date); });
      var box=document.createElement("section"); box.className="wsec"; box.id="c53mini";
      if(!rows.length){ box.innerHTML='<div class="wpan c53mini"><b>👥 Túratársak</b><p class="muted small" style="margin:.2rem 0">Még nincs közös túrád.</p><a class="btn btn-soft btn-sm" href="#/tarsak">Keresek társakat</a></div>'; }
      else box.innerHTML='<div class="wpan c53mini"><b>👥 Túratársak</b>'+ rows.slice(0,3).map(function(x,i){ var href = x.indexOf("🥾")===0? "#/tarsak" : "#/tarsak"; void href; return '<span class="e2minir"><b>'+esc3(x.slice(0,60))+"</b></span>"; }).join("")+'<a class="btn btn-soft btn-sm" href="#/tarsak">👥 Túratársak</a></div>';
      var ref=root.querySelector("#e2mini")||root.querySelector("#e50mini")||root.querySelector("#f9mini")||root.querySelector("#p50mini"); if(ref&&ref.parentNode) ref.parentNode.insertBefore(box, ref.nextSibling); else w.appendChild(box); }catch(e){} }; })();
/* ---------- szervezői központ: közösségi túrák szekció ---------- */
(function(){ var _sz=VIEWS.szervezo, _sza=VIEWS.szervezo&&VIEWS.szervezo.after;
  VIEWS.szervezo=function(){ var base=_sz?_sz.apply(this,arguments):""; try{ ensureDemo(); var evs=communityEventsOfMine();
    var extra='<section class="card panel e2sec"><h2>🥾 Közösségi túráim</h2>'+ (evs.length? evs.map(function(e){ var cnt=window.e2?null:null; void cnt; var tot=countsFor(e.id), cap=e.cap||null; var free=cap!=null?Math.max(0,cap-tot):"—"; var st=Store.findTourAnywhere(e.projectId);
      return '<div class="e2row"><div><b>🥾 '+esc3(e.name)+(e.status==="draft"?" (piszkozat)":"")+"</b><span class='mut'>"+esc3(e.date||"")+" · "+((st&&st.tour)?'📋 projekt is van':'📋 nincs projekt')+"</span></div><div class='e2rowbtns'><span class='chip "+(cap!=null&&tot>=cap?"chip-rose":"chip-sand")+"'>👥 "+tot+(cap!=null?("/"+cap):"")+" · szabad: "+free+"</span>"+
        (e.status==="draft"? "<button class='btn btn-primary btn-sm' data-e2st='"+e.id+":published'>🌐 Publikálom</button>":"")+
        "<button class='btn btn-soft btn-sm' data-e2app='"+e.id+"'>📋 Jelentkezők</button>"+( (st&&st.tour)? "<a class='btn btn-ghost btn-sm' href='#/tura/"+e.projectId+"'>🥾 Projekt</a>":"")+
        (e.status!=="completed"&&e.status!=="cancelled"? "<button class='btn btn-ghost btn-sm' data-e2st='"+e.id+":completed'>✓ Lezárás</button>":"")+"</div></div>"; }).join("") : '<p class="muted small">Még nincs közösségi túrád — a saját projektedből egy gombdal hirdetheted meg (🥾 projekt → 📢 Meghirdetem).</p>')+"</section>";
    return base.replace(/<\/div>$/, extra+"</div>"); }catch(e){ return base; } };
  VIEWS.szervezo.after=function(root){ try{ _sza&&_sza(root); }catch(e){} };
  function countsFor(eid){ try{ var L=Store.platform().participants.filter(function(x){ return x.eid===eid && x.status!=="withdrawn" && x.status!=="declined"; }); return L.length; }catch(e){ return 0; } } })();
/* ---------- Store.notifications kibővítése közösségi elemekkel ---------- */
(function(){ try{ var _n=Store.notifications;
  Store.notifications=function(){ var base=[]; try{ base=_n?_n():[]; }catch(e){} var mine=[]; try{ mine=myNotifs().map(function(x){ return { id:"c53-"+x.id, icon:"🔔", text:x.text, link:x.link, at:x.at }; }); }catch(e){}
    try{ if((location.hash||"").indexOf("ertesitesek")>-1 && mine.length){ var read=C().notifs.filter(function(x){return x.to===uidNow() && !x.read;}).map(function(x){return x.id;}).join(","); if(!window.__c53mark||window.__c53mark!==read){ window.__c53mark=read; setTimeout(markNotifsRead,900); } } }catch(e){}
    var seen={}; return base.concat(mine).filter(function(o){ if(seen[o.id]) return false; seen[o.id]=1; return true; }); };
} catch(e){} })();
window.__V53=1; window.c53={ connAdd:connAdd, connDecide:connDecide, connOf:connOf, createInvite:createInvite, joinByInvite:joinByInvite, declineInvite:declineInvite, leaveShared:leaveShared, sharedToursOfMe:sharedToursOfMe, memberRowOf:memberRowOf, publishTour:publishTour, profOf:profOf, setMyProf:setMyProf, communityEventsOfMine:communityEventsOfMine, ensureDemo:ensureDemo, C:C, myNotifs:myNotifs };
})();
