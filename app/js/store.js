/* ============================================================
   TÚRAVAROS — TÁROLÓ RÉTEG
   localStorage-alapú adatbázis: regisztráció, bejelentkezés,
   felhasználónként elkülönített adatok, túra-modell, értesítések,
   statisztikák és a szabályalapú AI Túratervező.
   
   ============================================================ */
"use strict";
const Store = (() => {
  const KEY = "turavaros_v1";
  let db = null;

  /* ---------- segédek ---------- */
  const uid = p => (p||"id") + "_" + Math.random().toString(36).slice(2,9);
  const hash = s => { let h=5381; for(const c of s) h=(h*33^c.charCodeAt(0))>>>0; return "h"+h.toString(36); };
  const todayISO = () => new Date().toISOString().slice(0,10);
  const addDays = (iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
  const dayDiff = iso => !iso ? 999 : Math.round((new Date(iso+"T12:00:00") - new Date(todayISO()+"T12:00:00"))/864e5);
  const count = (a,f)=>a.filter(f).length;
  function nextSatDate(){ const d=new Date(); const add=(6-d.getDay()+7)%7||7; d.setDate(d.getDate()+add); return d.toISOString().slice(0,10); }

  function load(){
    try{ db = JSON.parse(localStorage.getItem(KEY)); }catch(e){ db=null; }
    if(!db){ db = { users:{}, data:{}, session:null }; save(); }
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(db)); }

  const me = () => db.session ? db.users[db.session] : null;
  function blankUserData(){ return { tours:[], wishlist:[], savedEvents:[], equipment:[], journal:[], teams:[],
    goals:{km:300, tours:12, summits:3}, goalList:null, notifDismiss:[], prefs:{weather:true, reminders:true}, aiChat:[],
    templates:[], terepi:[], reportAck:{}, challenges:null, widgets:null }; }
  function ensureExtras(d){
    if(!d) return d;
    if(!d.templates) d.templates=[]; if(!d.terepi) d.terepi=[]; if(!d.reportAck) d.reportAck={};
    if(!d.goalList) d.goalList = [
      {id:uid("g"), icon:"🥾", label:"km túrázva idén", metric:"km", target:300, unit:"km"},
      {id:uid("g"), icon:"🏔️", label:"új csúcs", metric:"summits", target:10, unit:"db"},
      {id:uid("g"), icon:"🌄", label:"napfelkelte túra", metric:"napkelte", target:3, unit:"db"}];
    if(!d.challenges) d.challenges = (typeof CHALLENGES_DEMO!=="undefined" ? JSON.parse(JSON.stringify(CHALLENGES_DEMO)) : []);
    if(!d.inbox) d.inbox=[];
    if(!d.widgets) { d.widgets = ["hub","readi","quick","sun","inbox","recent","chall","recs","goal","cal","memory","terep","tools","tiles"]; }    if(!d.widgets.includes("recent")) { const si=d.widgets.indexOf("sun"); d.widgets.splice(si>=0?si+1:4,0,"recent"); }

    else { if(!d.widgets.includes("sun")) d.widgets.splice(1,0,"sun"); if(!d.widgets.includes("tools")) d.widgets.splice(3,0,"tools"); if(!d.widgets.includes("chall")) d.widgets.splice(1,0,"chall"); }
    { const PRI=["hub","readi","quick","sun","inbox"]; const pre=d.widgets.filter(x=>PRI.includes(x)).sort((a,b)=>PRI.indexOf(a)-PRI.indexOf(b)); d.widgets=pre.concat(d.widgets.filter(x=>!PRI.includes(x))); }
    (d.tours||[]).forEach(t=>{ (t.gear||[]).forEach(g=>{ if(!g) return; if(g.w==null) g.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[g.name]) || 900; });
      (t.food||[]).forEach(f=>{ if(f.w==null) f.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[f.n]) || 250; }); });
    (d.equipment||[]).forEach(e=>{ if(e.w==null) e.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[e.name]) || 900; });
    return d;
  }
  const myData = () => { const u=me(); if(!u) return null; db.data[u.id] ||= blankUserData(); return ensureExtras(db.data[u.id]); };
  function platform(){ if(!db.platform) db.platform={ organizers:[], events:[], participants:[] }; return db.platform; }
  function community(){ if(!db.community) db.community={ profiles:[], connections:[], invites:[], notifs:[] }; return db.community; }
  function userDataOf(uidOrKey){ if(db.data[uidOrKey]) return db.data[uidOrKey]; for(const k in db.data){} const u=userByAny(uidOrKey); return u? (db.data[u.id]||null) : null; }
  function findTourAnywhere(id){ for(const k in db.data){ const t=(db.data[k].tours||[]).find(x=>x.id===id); if(t) return {tour:t, owner:k, email:(db.users[k]&&db.users[k].email)||k, data:db.data[k]}; } return null; }
  function userByAny(q){ for(const k in db.users){ const u=db.users[k]; if(u.id===q||u.email===q) return u; } return null; }
  function allUserDataIds(){ return Object.keys(db.data); }

  /* ---------- AUTH ---------- */
  function signup(name, email, pass, city){
    email = email.trim().toLowerCase();
    if(Object.values(db.users).some(u=>u.email===email)) return {err:"Ezzel az e-mail-címmel már regisztráltak."};
    const id = uid("u");
    db.users[id] = { id, name:name.trim(), email, pass:hash(pass), city:(city||"").trim(), onboarded:false, joined:todayISO() };
    db.data[id] = blankUserData(); ensureExtras(db.data[id]);
    db.session = id; save();
    return {ok:true, user:db.users[id]};
  }
  function changePassword(oldp, newp){
    const u = me(); if(!u) return {err:"Nincs bejelentkezett felhasználó."};
    if(u.pass !== hash(oldp)) return {err:"A jelenlegi jelszó hibás."};
    if(!newp || newp.length < 8) return {err:"Az új jelszónak legalább 8 karakter hosszúnak kell lennie."};
    if(!/[0-9]/.test(newp) || !/[a-zA-Z]/.test(newp)) return {err:"Az új jelszóban legyen betű és szám is."};
    u.pass = hash(newp); save(); return {ok:true};
  }
  function login(email, pass){
    email = email.trim().toLowerCase();
    const u = Object.values(db.users).find(x=>x.email===email);
    if(!u || u.pass!==hash(pass)) return {err:"Hibás e-mail vagy jelszó."};
    db.session = u.id; save(); return {ok:true, user:u};
  }
  /* Cloud Auth után a helyi Store ugyanazt a felhasználót és adatmodellt használja.
     Ez nem új auth-rendszer: csak egy Supabase-identitás helyi projekciója, hogy
     a V117.1 funkciói offline és cloud session mellett is változatlanul fussanak. */
  function adoptCloudUser(profile){
    profile = profile || {};
    const email = String(profile.email||"").trim().toLowerCase();
    if(!email) return {err:"Hiányzó cloud e-mail-cím."};
    let u = Object.values(db.users).find(x=>x.email===email);
    if(!u){
      const id = uid("u");
      u = { id, name:String(profile.name||"Túrázó").trim()||"Túrázó", email,
        pass:"cloud:"+(profile.uid||id), city:String(profile.city||"").trim(),
        onboarded:false, joined:todayISO(), cloudUid:profile.uid||null };
      db.users[id]=u; db.data[id]=blankUserData(); ensureExtras(db.data[id]);
    } else {
      if(profile.name && (!u.name || u.name==="Túrázó")) u.name=String(profile.name).trim();
      if(profile.city && !u.city) u.city=String(profile.city).trim();
      if(profile.uid) u.cloudUid=profile.uid;
      db.data[u.id] ||= blankUserData(); ensureExtras(db.data[u.id]);
    }
    db.session=u.id; save(); return {ok:true,user:u};
  }
  function cloudProfile(){
    const u=me(); if(!u) return null;
    const email=String(u.email||"").toLowerCase();
    const p=community().profiles.find(x=>x.uid===email)||{};
    const prefs=u.prefsOnb||{};
    const hp={
      types:Array.isArray(p.types)?p.types.slice():((u.prefsOnb&&u.prefsOnb.types)||[]),
      regions:Array.isArray(p.regions)?p.regions.slice():((u.prefsOnb&&u.prefsOnb.regions)||[]),
      exp:p.exp||(prefs.exp||"Kezdő"),
      len:p.len||(prefs.len||"Változó"),
      avail:p.avail!==false,
      from:prefs.from||u.city||"",
      freq:prefs.freq||"", diff:prefs.diff||"", radius:prefs.radius||""
    };
    return { display_name:u.name||"Túrázó", avatar_url:p.av||null, bio:u.bio||p.bio||null,
      city:u.city||null, hiking_profile:hp, is_discoverable:p.isDiscoverable===true };
  }
  function adoptCloudProfile(profile){
    const u=me(); if(!u||!profile) return {err:"Nincs helyi felhasználó."};
    if(profile.display_name) u.name=String(profile.display_name).trim()||u.name;
    if(profile.city!=null) u.city=String(profile.city||"").trim();
    if(profile.bio!=null) u.bio=String(profile.bio||"");
    const hp=profile.hiking_profile&&typeof profile.hiking_profile==="object"?profile.hiking_profile:{};
    const email=String(u.email||"").toLowerCase();
    const c=community(); let p=c.profiles.find(x=>x.uid===email);
    if(!p){ p={uid:email,av:"",name:u.name||"Túrázó",bio:"",types:[],regions:[],exp:"Kezdő",len:"Változó",avail:true,demo:false,createdAt:profile.created_at||new Date().toISOString()}; c.profiles.push(p); }
    p.cloudUid=profile.user_id||p.cloudUid||null;
    if(profile.avatar_url!=null) p.av=String(profile.avatar_url||"");
    if(profile.bio!=null) p.bio=String(profile.bio||"");
    if(Array.isArray(hp.types)) p.types=hp.types.slice();
    if(Array.isArray(hp.regions)) p.regions=hp.regions.slice();
    if(hp.exp!=null) p.exp=String(hp.exp);
    if(hp.len!=null) p.len=String(hp.len);
    if(hp.avail!=null) p.avail=!!hp.avail;
    p.isDiscoverable=profile.is_discoverable===true;
    if(Object.keys(hp).length){ u.prefsOnb=Object.assign(u.prefsOnb||{},hp); }
    save(); return p;
  }
  const logout = () => { db.session=null; save(); };
  function updateProfile(patch){ const u=me(); if(!u) return; Object.assign(u,patch); save(); }
  function setPrefs(p){ const u=me(); if(!u) return; u.prefsOnb = Object.assign(u.prefsOnb||{}, p); if(p.onboarded!==undefined) u.onboarded=!!p.onboarded; save(); }

  /* ---------- TÚRA-MODELL ---------- */
  function recommendGear(tour, weatherRain){
    const mon = tour.date ? new Date(tour.date+"T12:00:00").getMonth()+1 : new Date().getMonth()+1;
    const tags = (tour.tags||[]).join(" ") + " " + (tour.eventCat||"");
    const ctx = { h:+tour.durationH||0, diff:DIFF_NUM[tour.difficulty]||2, days:+tour.days||1,
      rain:!!weatherRain, summer:[6,7,8].includes(mon), winter:[12,1,2,3].includes(mon),
      summit:["csúcs","kilátás","szikla"].some(t=>(tour.tags||[]).includes(t)),
      napkelte:/napkel|napfelk/.test(tags), éjszaka:/éjszak/.test(tags),
      kerékpár:/kerékp|bring/.test(tags), fotó:/fot/.test(tags) };
    const out = {};
    const push = it => { if(out[it.n]) return; out[it.n] = {name:it.n, cat:it.c, icon:it.i, checked:false, own:false, note:""}; };
    GEAR_BASE.forEach(push);
    GEAR_RULES.forEach(r=>{ let on=false; try{ on = new Function("ctx","with(ctx){return ("+r.if+")}")(ctx); }catch(e){}
      if(on) r.items.forEach(push); });
    const d = myData();
    if(d) for(const g of d.equipment) if(g.has && out[g.name]) out[g.name].own = true;
    return Object.values(out);
  }
  function newTourFromDraft(dr){
    const t = Object.assign({
      id: uid("t"), status: dr.status||"tervezés", createdAt: todayISO(), weatherRain:false,
      title:"", place:"", region:"", date:"", days:1, lengthKm:0, ascent:0, durationH:0,
      difficulty:"Közepes", tags:[], desc:"", img:IMG.erdo, coords:null, waypoints:[], gpx:null,
      timeline:[], gear:[], participants:[], cars:[], food:[],
      safety: SAFETY.map(s=>({n:s.n, checked:false})),
      notes:"", photos:[], eventRef:null, eventCat:"", meeting:"", weatherChecked:false, shareCode:null,
      tasks:[], noteStream:[], budget:[]
    }, dr);
    if(!t.title) t.title = t.place || "Új túra";
    if(!t.timeline.length) t.timeline = TIMELINE_TPL.map(x=>({id:uid("tl"),...x}));
    if(!t.gear.length) t.gear = recommendGear(t, dr._rain);
    if(!t.food.length) t.food = FOOD_TEMPLATE(t.durationH).map(f=>({id:uid("fd"),...f}));
    if(!t.tasks.length) t.tasks = ["Időjárás-ellenőrzés a túra napjára","Víz és uzsonna beszerzése","Résztvevők visszaigazolása","Felszerelés állapotának ellenőrzése"].map((l,i)=>({id:uid("tk"),label:l,done:false,due:Math.max(0,t.date?dayDiff(t.date):7)-i*2}));
    myData().tours.push(t); save(); return t;
  }
  function updateTour(id, patch){ const t=getTour(id); if(!t) return null; Object.assign(t,patch); save(); return t; }
  function deleteTour(id){ const d=myData(); d.tours=d.tours.filter(t=>t.id!==id); d.journal=d.journal.filter(j=>j.tourId!==id); save(); }
  const getTour = id => myData().tours.find(t=>t.id===id);

  function completeTour(id, rating, note, photos){
    const o = (rating && typeof rating==="object") ? rating : {rating, note, photos};
    const d=myData(), t=getTour(id); if(!t) return;
    t.status="teljesítve"; t.doneAt = o.doneAt || t.date || todayISO();
    const core = { tourId:id, title:(o.title||t.title||"").slice(0,88), place:t.region||t.place, date:t.doneAt,
      km:+(o.km!=null?o.km:t.lengthKm)||0, up:+t.ascent||0, h:+(o.h!=null?o.h:t.durationH)||0,
      rating:+o.rating||0, note:o.note||"", photos:(o.photos&&o.photos.length?o.photos:[t.img]).slice(0,9),
      ...(o.fav!==undefined?{fav:o.fav}:{}), ...(o.lesson?{lesson:o.lesson}:{}), updatedAt:new Date().toISOString() };
    const jx = d.journal.find(j=>j.tourId===id);
    if(jx) Object.assign(jx, core);
    else d.journal.push(Object.assign({ id:uid("j"), mood:o.mood||"", lesson:o.lesson||"",
      audio:o.audio||null, privacy:o.privacy||"privát" }, core));
    save();
  }
  function updateJournal(id, patch){ const my=myData(); const j=my.journal.find(x=>x.id===id); if(j) Object.assign(j,patch); save(); return j; }
  function rmJournal(id){ const my=myData(); my.journal=my.journal.filter(x=>x.id!==id); save(); }
  function archiveTour(id){ updateTour(id,{status:"archiválva"}); }
  function promoteWishToTour(wishId){
    const d=myData(), w=d.wishlist.find(x=>x.id===wishId); if(!w) return null;
    const t=newTourFromDraft({ title:w.name, place:w.place||w.name, date:"", difficulty:w.diff||"Közepes",
      img:w.img, coords:(w.lat?{name:w.place||w.name, lat:w.lat, lng:w.lng}:null),
      tags:[w.cat==="Csúcsok"?"csúcs":w.cat==="Vízesések"?"vízesés":w.cat==="Erdők"?"erdő":"kilátás"],
      lengthKm:"?", ascent:"?", durationH:"?" });
    w.asTourId=t.id; w.status="tervezés"; save(); return t; }
  function setWishStatus(id,st){ const w=myData().wishlist.find(x=>x.id===id); if(w){ w.status=st; save(); } }
  function setStatus(id,st){ const t=getTour(id); if(!t) return null; if(st==="tervezés"&&t.status==="ötlet"){} t.status=st; save(); return t; }

  /* ---------- KÉSZÜLTSÉG + ELLENŐRZŐ ---------- */
  function readiness(t){
    const rows=[];
    rows.push({k:"date",   label:"Dátum beállítva",           ok:!!t.date, goto:""});
    rows.push({k:"place",  label:"Helyszín kiválasztva",       ok:!!(t.place||t.region), goto:""});
    rows.push({k:"route",  label:"Útvonal elkészítve",         ok:!!(t.gpx||t.waypoints.length||t.coords), goto:"utvonal"});
    rows.push({k:"time",   label:"Időterv elkészítve",         ok:(t.timeline||[]).length>=3, goto:"idoter"});
    rows.push({k:"pack", label:"Csomagolás ellenőrizve (minden bepakolva)", ok:(t.gear||[]).filter(g=>g).length>0 && t.gear.every(g=>!g||g.checked), goto:"felszereles"});
    rows.push({k:"gear", label:"Felszerelés állapotát láttam (minden elem súlya ismert)", ok:(t.gear||[]).filter(g=>g).length>0 && t.gear.every(g=>!g||(+g.w||0)>0), goto:"felszereles"});
    rows.push({k:"food",   label:"Étel és víz megtervezve",    ok:(t.food||[]).length>0 && t.food.every(f=>f.checked), goto:"ete"});
    rows.push({k:"people", label:"Résztvevők visszaigazolva",  ok:!t.participants.length || t.participants.every(p=>p.confirmed), goto:"resztvevok"});
    rows.push({k:"travel", label:"Utazás megszervezve",        ok:!!t.meeting || t.participants.length===0 || t.cars.length>0, goto:"utazas"});
    rows.push({k:"weather",label:"Időjárás ellenőrizve",       ok:!!t.weatherChecked, goto:"utvonal"});
    rows.push({k:"notes",  label:"Fontos jegyzetek kitöltve",  ok:(t.notes||"").trim().length>=6, goto:"jegyzet"});
    const done=rows.filter(r=>r.ok).length;
    return {rows, pct:Math.round(done/rows.length*100), missing:rows.filter(r=>!r.ok)};
  }
  function tourCheck(t){ const r=readiness(t);
    const v = r.pct>=100 ? {cls:"ok", head:"🟢 A túrád indulásra készen áll!"}
      : r.pct>=70 ? {cls:"ok", head:`🟢 Majdnem indulásra kész — még ${r.missing.length} dolog hiányzik`}
      : r.pct>=40 ? {cls:"mid", head:`🟡 Jó úton jársz — ${r.missing.length} pont még nyitott`}
      : {cls:"bad", head:`🔴 A tervezés elején jársz — ${r.missing.length} pont nyitott`};
    return Object.assign({pct:r.pct, rows:r.rows, missing:r.missing}, v); }

  /* ---------- CSOMAGSÚLY / HÁTIZSÁK KALKULÁTOR ---------- */
  function backpack(t){
    const cats={}; let total=0, buy=0, own=0;
    (t.gear||[]).forEach(g=>{ if(!g) return; const w=+g.w||0; cats[g.cat||"Egyéb"]=(cats[g.cat||"Egyéb"]||0)+w;
      total+=w; if(g.own){own+=w;}else{buy+=w;} });
    const rows=Object.entries(cats).map(([cat,g])=>({cat, g})).sort((a,b)=>b.g-a.g);
    return {total, own, buy, rows, over:total>12500, heavy:total>9500};
  }

  /* ---------- TÚRASABLONOK ---------- */
  function allTemplates(){ return (typeof TEMPLATES_DEFAULT!=="undefined"?TEMPLATES_DEFAULT:[]).concat(myData().templates); }
  function templateById(id){ return allTemplates().find(x=>x.id===id)||null; }
  function isDefaultTpl(id){ return (typeof TEMPLATES_DEFAULT!=="undefined") && TEMPLATES_DEFAULT.some(x=>x.id===id); }
  function saveTemplateFromTour(tourId, name, icon){
    const t=getTour(tourId); if(!t) return null;
    const tpl={ id:uid("tp"), custom:true, icon:icon||"⭐", name:(name||t.title),
      desc:`${t.lengthKm||"?"} km · ${t.durationH||"?"} ó · ${t.difficulty||""}`,
      difficulty:t.difficulty, days:t.days||1, tags:(t.tags||[]).slice(), meeting:t.meeting||"", hours:t.durationH||3,
      gear:t.gear.map(g=>({n:g.name,c:g.cat,i:g.icon,w:g.w||900})),
      timeline:t.timeline.map(x=>({t:x.t,l:x.l,ty:x.ty})),
      food:t.food.map(f=>f.n), tasks:["Csomagolás ellenőrzése","Időjárás megnézése","Valaki tudja, merre jársz"] };
    myData().templates.push(tpl); save(); return tpl; }
  function deleteTemplate(id){ if(!myData().templates.some(x=>x.id===id)) return; const d=myData(); d.templates=d.templates.filter(x=>x.id!==id); save(); }
  function editTemplate(id, patch){ const t=myData().templates.find(x=>x.id===id); if(t) Object.assign(t,patch); save(); return t; }
  function createTemplateFromDraft(o){
    const tpl={ id:uid("tp"), custom:true, icon:o.icon||"📐", name:o.name, desc:o.desc||"",
      difficulty:o.difficulty||"Könnyű", days:o.days||1, tags:o.tags||[], meeting:"", hours:o.hours||3,
      gear:(o.gear||[]).map(n=>({n, c:"Egyéb", i:"🧰", w:WEIGHT_GUESS[n]||900})).filter(x=>n_ok(x.n)),
      timeline:(o.timeline||[]).map(x=>({t:x.t,l:x.l,ty:x.ty||"tura"})),
      food:(o.food||[]).map(n=>n).filter(n_ok), tasks:o.tasks||[] };
    myData().templates.push(tpl); save(); return tpl; }
  function n_ok(n){ return n && typeof n==="string" && n.length>1; }
  function applyTemplate(tourId, tplId){
    const t=getTour(tourId), tpl=templateById(tplId); if(!t||!tpl) return null;
    const have={}; t.gear.forEach(g=>have[g.name]=true);
    (tpl.gear||[]).forEach(g=>{ const n=typeof g==="string"?g:g.n; if(!n||have[n]) return;
      t.gear.push({name:n, cat:(typeof g==="object"&&g.c)||"Egyéb", icon:(typeof g==="object"&&g.i)||"🧰",
        checked:false, own:false, note:"sablonból", w:(typeof g==="object"&&g.w)||WEIGHT_GUESS[n]||900}); have[n]=true; });
    if(tpl.timeline&&tpl.timeline.length && !t.timeline.some(x=>x.l&&x.l!==undefined&&x.hintEdited))
      t.timeline = tpl.timeline.map(x=>({id:uid("tl"),t:x.t,l:x.l,ty:x.ty}));
    (tpl.food||[]).forEach(n=>{ if(n && !t.food.some(f=>f.n===n)) t.food.push({id:uid("fd"),n,i:"🥫",checked:false,w:WEIGHT_GUESS[n]||250}); });
    t.templateId = tpl.id; save(); return t; }

  /* ---------- TEREPRI JELENTŐK (koözösségi, a böngészőben tárolt globális lista) ---------- */
  function fieldReports(){
    if(!db.globalTerepi){ const now=Date.now();
      db.globalTerepi = (typeof TEREP_DEMO!=="undefined"?TEREP_DEMO:[]).map(r=>({...r, ts:r.date+"T"+(r.time||"12:00")+":00"})); }
    return db.globalTerepi.concat(myData() ? myData().terepi : []); }
  function addFieldReport(o){
    const d=myData(); if(!d) return null; o.id=uid("tr"); o.author=me().name; o.ts=new Date().toISOString().slice(0,16).replace("T"," ");
    d.terepi.unshift(o); save(); return o; }
  function ackFieldReport(id){ const my=myData(); my.reportAck[id]=todayISO(); save(); }
  function reportFresh(r){
    const t=new Date((r.ts||r.date+"T12:00:00").replace(" ","T")).getTime(); const hrs=(Date.now()-t)/36e5;
    if(hrs<6)  return {txt:"friss",        cls:"fresh"};
    if(hrs<72) return {txt:`${Math.round(hrs)} órája`, cls:"fresh"};
    if(hrs<24*10) return {txt:`${Math.round(hrs/24)} napja`, cls:"old", warn:true};
    return {txt:`${Math.round(hrs/24)} napja — már nem biztos, hogy aktuális`, cls:"stale", warn:true}; }
  function reportsForTour(t){ const reg=(t.region||"").toLowerCase().split(" ")[0];
    if(!reg) return []; return fieldReports().filter(r=>(r.region||"").toLowerCase().includes(reg||"") || r.tour===t.id)
      .sort((a,b)=>(b.ts||b.date).localeCompare(a.ts||a.date)); }

  /* ---------- CÉLOK + KIÍVÁSOK ---------- */
  function goalRows(){ const st=stats(), d=myData();
    const now=new Date(); const y=now.getFullYear();
    const inYear = d.journal.filter(j=>(j.date||"").startsWith(String(y)));
    const cur = { km: inYear.reduce((a,j)=>a+(+j.km||0),0)||0,
      tours: inYear.length,
      summits: inYear.reduce((a,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return a+((t&&t.tags&&t.tags.includes("csúcs"))?1:0); },0),
      napkelte: inYear.reduce((a,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return a+((t&&(t.tags||[]).includes("napkelte")||/napkel|napfelk/.test(j.title))?1:0); },0),
      wish: d.wishlist.filter(w=>inYear.some(j=>(w.asTourId||w.name||"").toLowerCase && (j.title||"").toLowerCase().includes(((w.name||"x").split(" ")[0]||"x").toLowerCase().slice(0,5)))).length,
      custom: 0 };
    return (d.goalList||[]).map(g=>({...g, current: g.metric==="custom" ? (+g.manual||0) : Math.round((cur[g.metric]||0)*10)/10,
      pct: Math.min(100, Math.round((cur[g.metric]||0)/(+g.target||1)*100)) })); }
  function addGoal(o){ const d=myData(); d.goalList.push(Object.assign({id:uid("g"),icon:"🎯",metric:"custom",manual:0,unit:""},o)); save(); }
  function rmGoal(id){ const d=myData(); d.goalList=d.goalList.filter(g=>g.id!==id); save(); }
  function goalDelta(id, n){ const g=myData().goalList.find(x=>x.id===id); if(!g) return; g.metric="custom"; g.manual=Math.max(0,(+g.manual||+g.current||0)+n); save(); }
  function toggleChallengeItem(cid, idx){ const c=myData().challenges.find(x=>x.id===cid); if(c){ c.items[idx].done=!c.items[idx].done; save(); } }
  function addChallenge(o){ const d=myData(); d.challenges.push({id:uid("ch"),icon:"🏔️",name:o.name,desc:o.desc||"",items:(o.items||[]).map(l=>({l:l.l||l,done:false}))}); save(); }
  function achievements(){ const st=stats(), d=myData();
    const sunrise = d.journal.filter(j=>{ const t=d.tours.find(x=>x.id===j.tourId); return (t&&(t.tags||[]).includes("napkelte"))||/napkel|napfelk/.test(j.title); }).length;
    return [
      {id:"a1", icon:"🥾", name:"Első 10 túra", now: st.tours, target:10},
      {id:"a2", icon:"📏", name:"100 km a bakancsban", now: Math.round(st.km), target:100},
      {id:"a3", icon:"🏔️", name:"Első 5 csúcs", now: st.summits, target:5},
      {id:"a4", icon:"🌄", name:"Első napkelte túra", now: sunrise, target:1},
      {id:"a5", icon:"⚡", name:"1000 m szint egy nap alatt", now: Math.max(0,...d.journal.map(j=>+j.up||0)), target:1000}]; }

  /* ---------- WIDGET SORREND + TEMA ---------- */
  function exportData(){ return JSON.stringify(db); }
  function importData(json){
    try{ const o=JSON.parse(json);
      if(!o || typeof o!=="object" || !o.users || !o.data) return {err:"Érvénytelen Túratárs mentés (users/data nélkül)."};
      // Theme is optional in existing Store exports; getTheme supplies its UI default.
      const next = Object.assign({users:{},data:{},session:null}, o);
      // Commit persistence before publishing the new in-memory state.
      localStorage.setItem(KEY, JSON.stringify(next)); db = next; return {ok:true};
    }catch(e){ return {err:"Nem sikerült beolvasni a fájlt."}; }
  }
  function eraseMyData(){ const u=me(); if(!u) return; db.data[u.id]=blankUserData(); save(); }
  function journalKmTotal(){ const d=myData(); if(!d) return 0; return Math.round(d.journal.reduce((a,j)=>a+(+j.km||0),0)); }
    function setWidgetOrder(arr){ myData().widgets=arr.slice(); save(); }
  function setTheme(mode){ db.theme=mode; save(); applyTheme(); }
  function getTheme(){ return db.theme||"light"; }
  function applyTheme(){ if(typeof document==="undefined") return;
    const t=db.theme||"light"; const eff = t==="auto" ? (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light") : t;
    document.documentElement.dataset.theme = eff; }

  /* ---------- BAKANCSLISTA, ESEMÉNYEK, ESZKÖZÖK, CSAPATOK ---------- */
  const inWish = w => myData().wishlist.some(x=>x.ref===w.id);
  function toggleWish(w){ const d=myData(); const i=d.wishlist.findIndex(x=>x.ref===w.id);
    if(i>=0) d.wishlist.splice(i,1);
    else d.wishlist.push({id:uid("w"), ref:w.id, name:w.name, cat:w.cat, place:w.place, diff:w.diff, img:w.img, lat:w.lat, lng:w.lng, addedAt:todayISO()});
    save(); }
  function rmWish(id){ const d=myData(); d.wishlist=d.wishlist.filter(x=>x.id!==id); save(); }
  function addWishCustom(o){ myData().wishlist.push(Object.assign({id:uid("w"), addedAt:todayISO(), custom:true},o)); save(); }

  const isEventSaved = eid => myData().savedEvents.includes(eid);
  function toggleEvent(eid){
    const d=myData(), i=d.savedEvents.indexOf(eid);
    if(i>=0){ d.savedEvents.splice(i,1); d.tours=d.tours.filter(t=>t.eventRef!==eid); save(); return; }
    d.savedEvents.push(eid);
    const ev = EVENTS.find(x=>x.id===eid), base = ev && ev.tour ? tourById(ev.tour) : null;
    const _notes=(ev&&ev.reg)?("Nevezés: "+(ev.reg||"")+(ev.time?" · "+ev.time:"")):"";
    const _tr = ev ? newTourFromDraft({ title:ev.name, place: base?base.start.name:ev.place, region: base?base.region:ev.place,
      date:ev.date, lengthKm:base?base.km:8, ascent:base?base.up:300, durationH:base?base.h:3,
      difficulty:ev.diff, tags: base?base.tags.slice():["vezetett"], img:ev.img, desc:ev.desc,
      coords: base?{...base.start}:null, eventRef:ev.id, eventCat:ev.cat, status:"jelentkezve" }) : null;
    if(_tr && _notes && !(String(_tr.notes).indexOf("Nevezés:")>=0)) _tr.notes = (_tr.notes ? _tr.notes + (String.fromCharCode(10)) : "") + _notes;
    save();
  }

  function saveEquipment(o){ const d=myData();
    if(o.id){ const g=d.equipment.find(x=>x.id===o.id); if(g) Object.assign(g,o); }
    else { o.id=uid("g"); d.equipment.push(o); }
    save(); }
  function removeEquipment(id){ const d=myData(); d.equipment=d.equipment.filter(x=>x.id!==id); save(); }

  function addTeam(name){ const d=myData(); const t={id:uid("tm"), name, desc:"", joined:true,
    members:[{id:uid("m"), name:me().name, role:"szervező"}]}; d.teams.push(t); save(); return t; }
  function joinTeam(id){ const t=myData().teams.find(x=>x.id===id);
    if(t && !t.joined){ t.joined=true; t.members.push({id:uid("m"), name:me().name, role:"tag"}); } save(); }
  function leaveTeam(id){ const t=myData().teams.find(x=>x.id===id);
    if(t){ t.joined=false; t.members=t.members.filter(m=>m.name!==me().name); } save(); }
  function teamById(id){ return myData().teams.find(t=>t.id===id); }

  /* ---------- STATISZTIKÁK ---------- */
  function stats(){
    const d = myData(); if(!d) return null;
    const done = d.journal;
    const byM={}; done.forEach(j=>{ const m=(j.date||"").slice(0,7); byM[m]=byM[m]||{km:0,tours:0,up:0};
      byM[m].km+=+j.km||0; byM[m].up+=+j.up||0; byM[m].tours++; });
    const regions={}; done.forEach(j=>{ regions[j.place]=(regions[j.place]||0)+1; });
    const diffs={"Könnyű":0,"Közepes":0,"Nehéz":0};
    done.forEach(j=>{ const t=d.tours.find(x=>x.id===j.tourId); const df=t?t.difficulty:"Közepes"; if(diffs[df]!=null)diffs[df]++; });
    const year=todayISO().slice(0,4);
    const yearKm = Object.entries(byM).filter(([m])=>m.startsWith(year)).reduce((s,[,v])=>s+v.km,0);
    const summits = done.reduce((s,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return s+((t&&t.tags&&t.tags.includes("csúcs"))?1:0); },0);
    return { km: done.reduce((s,j)=>s+(+j.km||0),0), up: done.reduce((s,j)=>s+(+j.up||0),0), h: done.reduce((s,j)=>s+(+j.h||0),0),
      tours:done.length, summits, byM, regions, diffs, year, yearKm, goals:d.goals,
      planned: d.tours.filter(t=>t.status==="tervezés"||t.status==="jelentkezve").length };
  }

  /* ---------- KÖVETKEZŐ LÉPÉS LOGIKA ---------- */
  function upcoming(){
    const d=myData(); if(!d) return [];
    return d.tours.filter(t=>(t.status==="tervezés"||t.status==="jelentkezve") && t.date && t.date>=todayISO())
      .sort((a,b)=>a.date.localeCompare(b.date));
  }
  function needs(){
    const t = upcoming()[0]; if(!t) return [];
    const n=[];
    if(!t.weatherChecked) n.push({label:"Ellenőrizd az időjárást", href:"#/tura/"+t.id});
    if(t.gear.some(g=>!g.checked)) n.push({label:`Csomagolás: ${count(t.gear,g=>!g.checked)} elem még jelöletlen`, href:"#/tura/"+t.id});
    if(t.safety.some(s=>!s.checked)) n.push({label:"Mentsd ki a biztonsági listát", href:"#/tura/"+t.id});
    if(t.participants.some(p=>!p.confirmed)) n.push({label:"Kérj megerősítést a résztvevőktől", href:"#/tura/"+t.id});
    return n.slice(0,4);
  }

  /* ---------- ÉRTESÍTÉSEK (keves, de tényleg hasznos) ---------- */
  function notifications(){
    const d=myData(); if(!d) return [];
    const out=[]; const t0 = upcoming()[0];
    if(t0){
      const dd = dayDiff(t0.date);
      if(dd>=0 && dd<=2) out.push({id:"nd-"+t0.id, icon:"📅", text:`${dd===0?"Ma":dd===1?"Holnap":"Két nap múlva"} indul a túrád: ${t0.title}.`, link:"#/tura/"+t0.id});
      if(dd>=0 && dd<=5 && t0.gear.some(g=>!g.checked))
        out.push({id:"ng-"+t0.id, icon:"🎒", text:`${count(t0.gear,g=>!g.checked)} felszerelési elem még ellenőrizetlen a(z) ${t0.title} túrádon.`, link:"#/tura/"+t0.id});
    }
    EVENTS.filter(e=>d.savedEvents.includes(e.id)).forEach(e=>{
      const dd=dayDiff(e.date);
      if(dd>=0 && dd<=7) out.push({id:"ne-"+e.id, icon:"🥾", text:`${dd===0?"Ma":dd+" nap múlva"}: ${e.name} (${e.place}).`, link:"#/esemenyek"});
      const near = d.wishlist.find(w=>(e.place||"").toLowerCase().includes((w.place||"~").toLowerCase().slice(0,4)) || (w.name||"").toLowerCase().includes((e.place||"~").toLowerCase().slice(0,4)));
      if(near && dd>0) out.push({id:"nw-"+e.id, icon:"❤️", text:`Egy esemény közel van a bakancslistádhoz: ${e.name}.`, link:"#/esemenyek"});
    });
        const soon = d.equipment.filter(g=>g.expiry && (()=>{const dd=new Date(g.expiry+"T12:00:00")-new Date(); return dd>0 && dd< 30*864e5;})());
    const lapsed = d.equipment.filter(g=>g.expiry && new Date(g.expiry+"T12:00:00") < new Date());
    for(const g of lapsed.slice(0,1)) out.push({id:"n-exp-"+g.id, icon:"⛑️", text:`Lejárt a ${g.name} „biztosítás/tagság” dátuma (${g.expiry}) — újítsd fel vagy írd át az időpontot.`, link:"#/felszereles"});
    for(const g of soon.slice(0,1)) out.push({id:"n-exp2-"+g.id, icon:"📅", text:`A ${g.name} biztosítás/tagsága ${Math.ceil((new Date(g.expiry)-new Date())/864e5)} nap múlva jár le.`, link:"#/felszereles"});
const unlogged = d.tours.find(t=>t.status==="teljesítve" && !d.journal.some(j=>j.tourId===t.id));
    if(unlogged) out.push({id:"nj-"+unlogged.id, icon:"📖", text:`A(z) ${unlogged.title} teljesítve — de még nem írtál róla a túranaplódba.`, link:"#/tura/"+unlogged.id});
    const undated = d.tours.find(t=>t.status==="tervezés" && !t.date);
    if(undated) out.push({id:"nu-"+undated.id, icon:"🗓️", text:`A(z) ${undated.title} túrához még nincs dátum. Tervezd meg, mire jó egy nap!`, link:"#/tura/"+undated.id});
    return out.filter(n=>!d.notifDismiss.includes(n.id)).slice(0,5);
  }
  const dismissNotif = id => { const d=myData(); if(!d.notifDismiss.includes(id)) d.notifDismiss.push(id); save(); };

  /* ---------- AI TÚRATÁRS (szabályalapú asszisztens) ---------- */
  function aiReply(text){
    const q = text.toLowerCase();
    const want = { diff: /könny/.test(q)?"Könnyű" : /neh[ée]z/.test(q)?"Nehéz" : /k[öo]zep/.test(q)?"Közepes" : null,
      maxH: (()=>{ const m=q.match(/(\d+(?:[.,]\d+)?)\s*(?:[óo]ra|órás|órán|[h]\b|(?:h[óo]))/); return m?parseFloat(m[1].replace(",",".")):null; })(),
      region:null, tags:[] };
    if(/napkel|napfelk/.test(q)) want.tags.push("napkelte");
    if(/cs[úu]cs|hegyre|cs[áa]cs/.test(q)) want.tags.push("csúcs");
    if(/v[íi]zes[ée]s/.test(q)) want.tags.push("vízesés");
    if(/\tt[óo]v?/.test(q)||/tavak|to/.test(q)) want.tags.push("tó");
    if(/erd/.test(q)) want.tags.push("erdő");
    if(/csal[áa]d|gyerek|kicsik/.test(q)) want.tags.push("family");
    if(/fot[óo]/.test(q)) want.tags.push("fotó");
    if(/t[öo]bbnapos|s[áa]tr/.test(q)) want.tags.push("többnapos");
    if(/ker[ée]kp|bring/.test(q)) want.tags.push("kerékpár");
    if(/[ée]jszak/.test(q)) want.tags.push("éjszaka");
    if(/kil[áa]t|panor/.test(q)) want.tags.push("kilátás");
    if(/kezd/.test(q)) want.tags.push("kezdőknek");
    for(const rg of [...new Set(TOURS.map(t=>t.region))]) if(q.includes(rg.toLowerCase().split(" ")[0])) want.region = rg;
    const score = t => { let s=(t.rating-4.5)*2;
      if(want.diff) s += t.diff===want.diff ? 3 : -2;
      if(want.maxH) s += t.h > want.maxH ? -6 : 2 + Math.max(0,(want.maxH-t.h))*0.25;
      if(want.region) s += t.region.toLowerCase().startsWith(want.region.toLowerCase().slice(0,4)) ? 2 : -1;
      want.tags.forEach(tg=>{ if(t.tags.includes(tg)) s+=2.5; });
      if(/r[öo]vid|s[ée]ta|k[öo]nnyed/.test(q) && t.km<=8) s+=1.5;
      if(/h[ée]v/.test(q) && !t.tags.includes("family")) s+=.5;
      return s; };
    const t = TOURS.slice().sort((a,b)=>score(b)-score(a))[0];
    const date = /szombat/.test(q)?nextSatDate(): addDays(todayISO(), 3);
    const steps = TIMELINE_TPL.slice(0, Math.max(4, Math.min(8, 2+Math.round((t.h||3)/1.4))));
    const gear = recommendGear({difficulty:t.diff, durationH:t.h, days:1, tags:t.tags, date}, /es[öo]|rain/.test(q)).slice(0,10);
    return { tour:t, date, why:buildWhy(t,want,q), plan:steps, gear, food:FOOD_TEMPLATE(t.h), water:waterFor(t.h) };
  }
  function buildWhy(t,want,q){
    const b=[]; b.push(`${t.diff} nehézségű, ${t.km} km, kb. ${t.h} óra`);
    if(t.tags.includes("kilátás")||t.tags.includes("csúcs")) b.push("gyönyörű panorámával");
    if(t.tags.includes("erdő")) b.push("árnyékos erdőn át");
    if(t.tags.includes("family")) b.push("gyerekbarát");
    if(want.maxH && t.h<=want.maxH) b.push(`belefér a ~${want.maxH} órába`);
    return b.join(" · ");
  }

  /* ---------- KEZDŐ + DEMÓ ADATOK ---------- */
  
  
  load();
  return { load, save, me, myData, platform, community, userDataOf, findTourAnywhere, userByAny, allUserDataIds, signup, login, adoptCloudUser, cloudProfile, adoptCloudProfile, logout, changePassword, updateProfile, setPrefs,
    newTourFromDraft, updateTour, deleteTour, getTour, completeTour, recommendGear,
    toggleWish, addWishCustom, rmWish, inWish, isEventSaved, toggleEvent,
    saveEquipment, removeEquipment, stats, notifications, dismissNotif, upcoming, needs,
    dayDiff, aiReply, uid, todayISO, addDays, nextSatDate,
    addTeam, joinTeam, leaveTeam, teamById,
    /* bump2 — új modulok API-ja */
    updateJournal, rmJournal, archiveTour, promoteWishToTour, setWishStatus, setStatus,
    readiness, tourCheck, backpack,
    allTemplates, templateById, isDefaultTpl, saveTemplateFromTour, deleteTemplate, editTemplate,
    createTemplateFromDraft, applyTemplate,
    fieldReports, addFieldReport, ackFieldReport, reportFresh, reportsForTour,
    goalRows, addGoal, rmGoal, goalDelta, toggleChallengeItem, addChallenge, achievements,
    setWidgetOrder, setTheme, getTheme, applyTheme,
    exportData, importData, eraseMyData, journalKmTotal };
})();
