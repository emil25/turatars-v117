/* ============================================================
   TÚRATÁRS V16 — TÚRAPROJEKT KÖZPONT (project.js)
   Időjárás-chip, dinamikus készültség, AI-terv a túrán belül,
   Inbox (linkek/események → saját túraprojekt), teendők,
   csomagolósúly-összevonás (étel a hátizsákba), Túra mód V2,
   publikus → tervezés hidak, dashboard-szabályozott rend.
   ============================================================ */
"use strict";
(function(){

const uidp = p => p + "_" + Math.random().toString(36).slice(2,9);
const num = v => Math.max(0, Math.round(+v||0));
const D = () => Store.myData();

/* ---------- 0) séma-védelem ---------- */
function ensureTourFields(t){
  if(!t.tasks) t.tasks=[];
  if(!t.noteStream) t.noteStream=[];
  return t;
}
const _origMyData = Store.myData;
Store.myData = function(){ const d=_origMyData.call(Store); if(!d) return d;
  (d.tours||[]).forEach(ensureTourFields);
  if(!d.inbox) d.inbox=[];
  return d; };

/* ---------- 1) KOCSONYAGTÁR ↔ csomagolás: súly a háti zsákban, étellel együtt ---------- */
const _origPack = Store.backpack;
Store.backpack = function(t){
  const b = _origPack.call(Store, t);
  const foodG = (t.food||[]).reduce((a,f)=>a+(+f.w||0),0);
  if(foodG>0){ b.rows = b.rows.concat([{cat:"Étel és víz", g:foodG}]).sort((x,y)=>y.g-x.g); }
  b.total += foodG; b.foodKg = foodG/1000;
  b.over = b.total>14000; b.heavy = b.total>11000;
  return b;
};

/* ---------- 2) Készültség felirat: „Még N dolog van hátra.” ---------- */
readiBar = function(t){
  const c = Store.tourCheck(t);
  const bar = `<div class="readi" id="rdi-bar">
    <div class="readi-head"><b>Felkészültség</b><span>${c.pct}%</span></div>
    <div class="readi-track"><i class="readi-fill ${c.pct>=100?"full":""}" style="width:${c.pct}%"></i></div>
    <div class="readi-note">${c.pct>=100
      ? "🟢 Indulásra kész — jó utat! 🥾"
      : `Még ${c.missing.length} dolog van hátra.`}
      <span class="readi-chips">${c.missing.slice(0,3).map(m=>`<span class="readi-chip">${esc(m.label)}</span>`).join("")}${c.missing.length>3?`<span class="readi-chip">+${c.missing.length-3} többi</span>`:""}</span>
      <button class="btn btn-soft btn-sm" id="rdi-check" style="margin-left:auto">🛃 Túra ellenőrzése</button>
    </div></div>`;
  return bar;
};

/* ---------- 3) IDŐJÁRÁS a túraprojektben (chip a fejlécben + eső → csomag) ---------- */
const WMO = [[0,"🌞"],[1,"🌤️"],[2,"⛅"],[3,"☁️"],[45,"🌫️"],[51,"🌦️"],[53,"🌦️"],[55,"🌧️"],[61,"🌧️"],[63,"🌧️"],[65,"🌧️"],[71,"🌨️"],[73,"🌨️"],[75,"❄️"],[77,"❄️"],[80,"🌦️"],[81,"🌧️"],[82,"⛈️"],[85,"🌨️"],[86,"❄️"],[95,"⛈️"],[96,"⛈️"],[99,"⛈️"]];
function wmoIco(c){ let best=WMO[0]; for(const [v,i] of WMO){ if(Math.abs(v-c)<=Math.abs(best[0]-c)) best=[v,i]; } return best[1]; }
function tourCoords(t){
  if(t.coords && +t.coords.lat) return {lat:+t.coords.lat, lng:+t.coords.lng};
  const cat = TOURS.find(x=>x.id===t.refTour || x.name===t.title || (t.place && x.start.name===t.place) || x.name===t.place);
  if(cat) return {lat:cat.start.lat, lng:cat.start.lng};
  return null;
}
async function fetchTourWeather(t){
  const c = tourCoords(t);
  let lat=c&&c.lat, lng=c&&c.lng;
  if(!lat){
    const q = (t.region||t.place||"Hargita").slice(0,40);
    try{ const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=hu`)).json();
      if(g.results&&g.results[0]){ lat=g.results[0].latitude; lng=g.results[0].longitude; } }catch(e){}
  }
  if(!lat) throw new Error("nincs koordináta");
  const day = t.date && /^\d{4}-\d\d-\d\d$/.test(t.date) ? t.date : Store.todayISO();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto&start_date=${day}&end_date=${day}`;
  const j = await (await fetch(url)).json();
  const d=j.daily||{}, cur=j.current||{};
  const w = { at:new Date().toISOString(), tempMax:num(d.temperature_2m_max&&d.temperature_2m_max[0]), tempMin:num(d.temperature_2m_min&&d.temperature_2m_min[0]),
    ico: wmoIco((d.weather_code&&d.weather_code[0])??cur.weather_code??0), rain:+(d.precipitation_probability_max&&d.precipitation_probability_max[0])||0,
    nowTemp: Math.round(cur.temperature_2m||0) };
  t.weather = w; t.weatherChecked = true;
  if(w.rain>=40){ t.weatherRain=true; if(!t.gear.some(g=>/esőkabát|kabát/i.test(g.name))) t.gear.push({name:"Esőkabát",cat:"Kabát",icon:"🧥",checked:false,own:!!(D().equipment||[]).find(e=>/kabát/i.test(e.name)),note:"AI: esőjelzés",w:350}); }
  Store.save();
  return w;
}

/* ---------- 4) AI a túraprojekten belül: generálás + „Mentés a túrába” ---------- */
function ownMatch(name){ return (D().equipment||[]).find(e=>e.name===name || e.name.toLowerCase()===String(name).toLowerCase()); }
function buildGearKit(t){
  const H=t.durationH||4, night=(t.days||1)>1, winter=/t[eé]li|hideg|h[oó]z|jég/.test(((t.tags||[]).join(" ")+(t.title||" ")).toLowerCase());
  const out=[];
  const pu=(name,cat,w,icon)=>{ const own=ownMatch(name); out.push({name:name,cat:cat,w:own?(+own.w||w):w,icon:icon,checked:false,own:!!own,note:own?"saját tár":""}); };
  pu("Fejlámpa","Electronika",90,"🔦"); pu("Térkép / telefon","Navigálás",120,"🗺️"); pu("Víz 1,5 l","Ivókanna",H>=4?3000:1500,"💧");
  pu("Uzsonna","Étel",420,"🥪"); pu("Kesztyű+sapka","Meleg",180,"🧤");
  if(H>=4) pu("Túrabot","Túrabot",450,"🦯");
  if(t.weatherRain) pu("Esőkabát","Kabát",350,"🧥");
  if(winter){ pu("Hótalp/microspike","Egyéb",320,"🧊"); pu("Termosz","Ivókanna",380,"♨️"); }
  if(night){ pu("Sátor","Sátor",2400,"⛺"); pu("Hálózsák","Hálózsák",1100,"🛌"); pu("Fejlámpa+pó elem","Electronika",120,"🔋"); }
  return out;
}
function buildTimeKit(t){
  const H=t.durationH||4; let s=/napfelkel|napkelt|h[oó]zsa/.test((t.title+"").toLowerCase())?3.5:(8+t.days*0);
  const start = s<5 ? 3 : 8; const arr=[];
  let h=start;
  arr.push({t:hhmm(h), l:"Indulás a parkolóból / találkozóponton"});
  for(let i=1;i<=Math.min(4,Math.ceil(H/1.5));i++){ h+=H/Math.min(4,Math.ceil(H/1.5)); if(h<start+H) arr.push({t:hhmm(h), l:MILE_STONES[Math.min(i-1,MILE_STONES.length-1)]}); }
  h=start+H*0.55; if(h<start+H) arr.push({t:hhmm(h), l:"Pihenő, uzsonna, kilátópont"});
  arr.push({t:hhmm(start+H+0.2), l:"Vissza a kiindulóponthoz — levegőztetés, nyújtás"});
  const seen=new Set(); return arr.filter(a=>{if(seen.has(a.l))return false;seen.add(a.l);return true;}).sort((a,b)=>a.t.localeCompare(b.t));
}
const hhmm = x => String(Math.max(0,Math.min(23,Math.floor(x)))).padStart(2,"0")+":"+String(Math.round((x%1)*60/5)*5%60).padStart(2,"0");
const MILE_STONES = ["Erdőszél — tempó beállítása","Patakpart / pihenőpont","Nyereg — légzés ellenőrzése","Gerinc — kitett szakasz","Kilátópont — fotó"];
function buildFoodKit(t){
  const H=t.durationH||4, per=Math.ceil(H/2);
  const items=[["Víz (palack)",  H>=5?2500:1500],["Uzsonna (szendvics)",420],["Gyümölcs/mogyoró",260]];
  if(t.days>1) items.push( ["Konyha-egység / bensó",700],["Főzelék-zacskó",180]);
  return items.map(([n,w])=>({id:uidp("fd"),n,i:"🥫",checked:false,w}));
}
function buildTravelKit(t){
  const first=(t.participants||[]).slice(0,4).map(p=>p.name);
  return { meeting:t.meeting||t.place||"Közös indulás", cars: t.cars.length?t.cars:[{id:uidp("car"),driver:(Store.me()||{}).name||"Te", seats:5, assigned:first, plate:""}] };
}
function buildTaskKit(t){
  const dd = t.date?Store.dayDiff(t.date):9;
  const due=[];
  due.push({t:-7,l:"Időjárás elöljáró ellenőrzése",ref:Math.max(1,dd-7)});
  due.push({t:-2,l:"Csomaglista pipálása (súlyellenőrzés)",ref:Math.max(1,dd-2)});
  due.push({t:-1,l:"Utazás / sofőr egyeztetés",ref:Math.max(0,dd-1)});
  due.push({t:0,l:"Korai kelés — a napfelkelte nem vár 🌄",ref:Math.max(0,dd)});
  return due.map(x=>({id:uidp("tk"),label:x.l,done:false,due:x.ref}));
}
function aiKitModal(t){
  const K={ idoter:buildTimeKit(t), csomag:buildGearKit(t), etel:buildFoodKit(t), utazas:buildTravelKit(t), teendok:buildTaskKit(t) };
  const SECL=[["idoter","🕐","Időterv",K.idoter.map(x=>`${x.t} — ${x.l}`) ],
    ["csomag","🎒","Csomaglista (súllyal)",K.csomag.map(x=>`${x.name} · ${g2kg(x.w)}${x.own?" · a te táradban":"✔"}`)],
    ["etel","🥪","Étel és víz",K.etel.map(x=>`${x.n} · kb. ${g2kg(x.w)}`)],
    ["utazas","🚗","Utazás és sofőrök",[K.utazas.meeting?("Találkozó: "+K.utazas.meeting):"", K.utazas.cars.map(c=>`${c.driver} sofőr — ${c.seats} hely, ${c.assigned.length} utas`).join(" · ")]],
    ["teendok","✅","Teendők",K.teendok.map(x=>`D-${x.due}: ${x.label}`)] ];
  openModal({ title:"⚡ AI terv — "+esc(t.title), body:`
    <p class="small muted mt0">Szempontok: ${t.lengthKm||"?"} km · ${t.durationH||4} ó · ${esc(t.difficulty)} · ${t.days>1?t.days+" nap":"napi"} · esőjelzés: ${t.weatherRain?"van":"nincs"} · saját tárad: ${D().equipment.filter(e=>e.has).length} eszköz</p>
    ${SECL.map(([k,ic,ttl,lines])=>`<label class="ck" style="align-items:flex-start"><input type="checkbox" data-sec="${k}" checked>
      <span><b>${ic} ${ttl}</b><br><span class="small muted">${lines.filter(Boolean).join(" · ")||"-"}</span></span></label>`).join("")}
    <button class="btn btn-primary btn-block" id="aikit-save" style="margin-top:.9rem">💾 Mentés a túrába</button>`,
    footer:`<button class="btn btn-ghost btn-block" data-close>Mégsem</button>`,
    onOpen(r){ r.querySelector("#aikit-save").onclick=()=>{
      const on=k=>!!r.querySelector(`[data-sec="${k}"]`)&&r.querySelector(`[data-sec="${k}"]`).checked;
      if(on("idoter")) t.timeline = K.idoter.map(x=>({id:uidp("tl"),t:x.t,l:x.l,ty:"ai"}));
      if(on("csomag")){ const have={}; t.gear.forEach(g=>have[g.name]=true);
        K.csomag.forEach(g=>{ if(!have[g.name]) t.gear.push(Object.assign({id:uidp("g")},g)); }); }
      if(on("etel")){ K.etel.forEach(f=>{ if(!t.food.some(x=>x.n===f.n)) t.food.push(f); }); }
      if(on("utazas")){ if(!t.meeting) t.meeting=K.utazas.meeting; if(!t.cars.length) t.cars=K.utazas.cars; }
      if(on("teendok")){ K.teendok.forEach(x=>{ if(!t.tasks.some(y=>y.label===x.label)) t.tasks.push(x); }); }
      if(t.status==="ötlet") t.status="tervezés";
      ensureTourFields(t); Store.save(); closeModal();
      toast("Az AI-terv a túrádba kerülhet ✔","⚡"); render();
    }; } });
}

/* ---------- 5) Saját felszereléstár → csomaglista picker ---------- */
function gearOwnPicker(t){
  const eq=(D().equipment||[]).filter(e=>e.has);
  const inPack={}; t.gear.forEach(g=>inPack[g.name]=true);
  const cats={}; eq.forEach(e=>{ (cats[e.cat||"Egyéb"]=cats[e.cat||"Egyéb"]||[]).push(e); });
  openModal({ title:"🎒 Válassz a saját táradból", body:`
    <p class="small muted mt0">A súlyuk automatusan belekerül a hátizsák-kalkulátorba. ${eq.filter(e=>inPack[e.name]).length} már alistában van a túrán.</p>
    <div class="own-list">
    ${Object.keys(cats).sort().map(c=>`<div class="own-cat"><div class="own-cat-h">${c} <span class="muted small">${g2kg(cats[c].reduce((a,e)=>a+(+e.w||0),0))}</span></div>
      ${cats[c].map(e=>`<label class="ck ${inPack[e.name]?"done":""}"><input type="checkbox" data-ownpk="${e.name.replace(/"/g,"'")}" data-ownw="${+e.w||600}" data-ownc="${c}" ${inPack[e.name]?"checked":""}>
        <span>${esc(e.name)} <span class="muted small">${g2kg(+e.w||600)}${e.cond?" · "+esc(e.cond):""}</span></span></label>`).join("")}</div>`).join("")}
    </div>`, footer:`<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="ownpk-ok">Hozzáad a csomaghoz</button>`,
    onOpen(r){ r.querySelector("#ownpk-ok").onclick=()=>{
      let n=0; r.querySelectorAll("[data-ownpk]").forEach(cb=>{ if(!cb.checked) return; const nm=cb.dataset.ownpk;
        if(t.gear.some(g=>g.name===nm)) return;
        t.gear.push({name:nm, cat:cb.dataset.ownc, icon:"🧰", w:+cb.dataset.ownw||600, checked:false, own:true, note:"saját tárból"}); n++; });
      Store.save(); closeModal(); if(n) toast(n+" saját cucc bekerült a csomagba — súlyostul ✔","🎒"); render(); }; } });
}
function condBadge(name){ const e=(D().equipment||[]).find(x=>x.name===name); if(!e) return "";
  return e.cond&&e.cond!=="Jó"?`<span class="cond-pill ${/Kopott|Jav/.test(e.cond)?"bad":""}">${esc(e.cond)}</span>`:""; }

/* ---------- 6) Workspace connection: időjárás, AI, teendők, picker ---------- */
const _prjWA = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id) => {
  _prjWA && _prjWA(root,id);
  const t = Store.getTour(id); if(!t || !root.querySelector(".ws-stats")) return;
  ensureTourFields(t);
  // — gombok a fejléc-action sorba
  const act = root.querySelector(".ws-actions") || root.querySelector(".ws-stats");
  function mkBtn(html,idv,cls,fn){ const b=document.createElement("button"); b.className=cls; b.innerHTML=html; b.onclick=fn; if(idv)b.id=idv; act.appendChild(b); return b; }
 ensureTourFields(t); recordRecent();
  const w=t.weather;
  mkBtn(w?`${w.ico} ${w.tempMin}–${w.tempMax}°C · esély ${w.rain}%`:"🌤️ Időjárás — ellenőrzés","btn-wx","btn btn-soft btn-sm wth-btn", async ev=>{
    const b=ev.currentTarget; const old=b.innerHTML; b.innerHTML="⏳ Mérem…";
    try{ const w2=await fetchTourWeather(t); b.innerHTML=`${w2.ico} ${w2.tempMin}–${w2.tempMax}°C · eső ${w2.rain}%`; toast(`Időjárás rögzítve — felkészültség frissült ✔ (${w2.rain}% esély, ${w2.tempMax}°C)`, w2.ico);}
    catch(e2){ b.innerHTML=old; toast("Az időjárás nem érhető el (nincs kapcsolat?)","📡"); } });
  mkBtn("🤖 Tervezd meg ezt a túrát","btn-ai","btn btn-ember btn-sm", ()=>aiKitModal(t));
  mkBtn("＋ Saját tárból","btn-pick","btn btn-soft btn-sm", ()=>gearOwnPicker(t));
  // — Teendők panel az áttekintés végére
  if(wsTab==="attekintes"){
    const grid=root.querySelector(".ws-grid");
    if(grid && !root.querySelector(".tasks-panel")){
      const open=t.tasks.filter(x=>!x.done).length;
      grid.insertAdjacentHTML("beforeend", `<div class="card panel tasks-panel"><div class="flex between wrapcol" style="margin-bottom:.35rem"><h3 style="margin:0">✅ Teendők</h3><span class="chip ${open?"chip-sand":"chip-green"}">${open?"még "+open+" feladat":"mindent pipáltál"}</span></div>
        <div id="tk-list">${t.tasks.map(x=>`<div class="ck ${x.done?"done":""}" style="display:flex;gap:.5rem;align-items:center;padding:.3rem 0"><input type="checkbox" data-tk="${x.id}" ${x.done?"checked":""}> ${esc(x.label)} ${x.due<=1?'<span class="chip chip-ember" style="font-size:.72rem">hamarosan</span>':`<span class="muted small">D-${x.due}</span>`}</div>`).join("")||'<p class="small muted">Nincs feladat — az AI terv kitöltése gomb fel tud dobni egyet.</p>'}</div>
        <div class="flex" style="gap:.45rem;margin-top:.6rem"><input class="input" id="tk-n" placeholder="Új teendő…" style="flex:1"><button class="btn btn-primary btn-sm" id="tk-add">＋</button></div></div>`);
      const rt=root;
      rt.querySelectorAll("[data-tk]").forEach(cb=>cb.onclick=()=>{ const x=t.tasks.find(y=>y.id===cb.dataset.tk); if(x){x.done=cb.checked; Store.save(); render();} });
      const add=()=>{ const v=rt.querySelector("#tk-n").value.trim(); if(!v)return; t.tasks.push({id:uidp("tk"),label:v,done:false,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); Store.save(); render(); };
      rt.querySelector("#tk-add").onclick=add; rt.querySelector("#tk-n").addEventListener("keydown",e=>{if(e.key==="Enter")add();});
    }
  }
  // — Felszerelés fülön a saját-tár jelölések + állapot badge
  if(wsTab==="felszereles"){ root.querySelectorAll(".ck input[type=checkbox]").forEach(()=>{}); }
};

/* ---------- 7) Esemény → túraprojekt egy koppintás ---------- */
function planFromEvent(e){
  const base = e.tour?tourById(e.tour):null;
  const t = Store.newTourFromDraft({ title:e.name, place:(base?base.start.name:e.place), region:(base?base.region:e.region||""),
    date:e.date||"", lengthKm:base?base.km:0, ascent:base?base.up:0, durationH:base?base.h:0,
    difficulty:base?base.diff:"Könnyű", img:base?base.img:(e.img||IMG.erdo), tags:["esemény"], eventRef:e.id,
    desc:e.desc||"", coords:base?{lat:base.start.lat,lng:base.start.lng}:null, notes:(e.src?"Forrás: "+e.src:"") });
  return t;
}
const _origEventModal = eventModal;
eventModal = function(eid){ _origEventModal(eid);
  if(!Store.me()) return;
  const ft=document.querySelector(".modal-foot"); const e=EVENTS.find(x=>x.id===eid); if(!ft||!e) return;
  if(ft.querySelector("#ev-plan")) return;
  const b=document.createElement("button"); b.className="btn btn-ember"; b.id="ev-plan"; b.style.marginRight=".5rem";
  b.innerHTML="🥾 Túraprojekt indítása ebből";
  b.onclick=()=>{ const t=planFromEvent(e); closeModal(); toast("Megnyitom a munkaterületet, ahol a tervet tovább írhatod","🧭"); NAV.to("#/tura/"+t.id); };
  ft.insertBefore(b, ft.firstChild); };
const _prjEvAfter = VIEWS.events.after;
VIEWS.events.after = (root) => { _prjEvAfter && _prjEvAfter(root);
  if(!Store.me()) return;
  root.querySelectorAll(".ecard").forEach(card=>{ const a=card.querySelector("h3 a"); if(!a) return;
    const mm=a.getAttribute("href").match(/esemenyek\/([\w-]+)/); if(!mm||card.querySelector("[data-evplan]")) return;
    const b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.dataset.evplan=mm[1];
    b.style.cssText="margin-top:.5rem;width:100%"; b.innerHTML="🥾 Tervezés — saját projektként";
    b.onclick=ev=>{ ev.stopPropagation(); const t=planFromEvent(EVENTS.find(x=>x.id===b.dataset.evplan)); toast("Túraprojekt létrehozva a naptáradban","🧭"); NAV.to("#/tura/"+t.id); };
    (card.querySelector(".eb")||card).appendChild(b); }); };

/* ---------- 8) INBOX — hirtlen mentett ötletem, hivatkozás, FB esemény ---------- */
const IB_ICON={link:"🔗",event:"📣",place:"📍",note:"📝",photo:"🖼️"};
function ibAdd(o){ const d=D(); const it=Object.assign({id:uidp("ib"),at:new Date().toISOString(),read:false},o); d.inbox.unshift(it); Store.save(); return it; }
function guessDate(str){ const yy=new Date().getFullYear(); const p2=x=>String(+x).padStart(2,"0");
  let m=str.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/); if(m) return m[1]+"-"+p2(m[2])+"-"+p2(m[3]);
  m=str.match(/(\d{1,2})\.?\s*(jan|feb|marc|apr|maj|jun|jul|aug|szep|okt|nov|dec)/i);
  if(m){ const mo={jan:1,feb:2,marc:3,apr:4,maj:5,jun:6,jul:7,aug:8,szep:9,okt:10,nov:11,dec:12}[m[2].toLowerCase().normalize("NFD").replace(/[^a-z]/g,"")]||(new Date()).getMonth()+1; return yy+"-"+p2(mo)+"-"+p2(m[1]); }
  m=str.match(/(\d{1,2})[./](\d{1,2})\./); if(m) return yy+"-"+p2(m[2])+"-"+p2(m[1]);
  return ""; }
function ibTour(it){
  const date=guessDate((it.title+" "+(it.note||"")).slice(0,140));
  const t=Store.newTourFromDraft({ title:it.title||"Inbox-ötletem", status:"ötlet", date, place:it.place||"", img:it.img||IMG.erdo, desc:it.note||"", notes:(it.url?("Forrás: "+it.url):""), tags:["inbox"] });
  it.read=true; Store.save(); NAV.to("#/tura/"+t.id);
}
function ibWish(it){ const d=D(); const ref="ib_"+it.id;
  if(d.wishlist.some(x=>x.ref===ref)){ toast("Ez már a bakancslistádon van","❤️"); return; }
  d.wishlist.push({id:uidp("w"),ref,name:it.title||it.note.slice(0,40),cat:"Inbox",place:it.place||it.url||"—",diff:"—",img:it.img||IMG.erdo,addedAt:Store.todayISO()});
  it.read=true; Store.save(); toast("Rakva a bakancslistára ❤️","❤️"); render(); }
VIEWS.inbox = () => {
  const d=D();
  return dash("#/inbox")(`
    <div class="dash-top"><div><h1>📥 Inbox</h1><div class="hello">Gyors mentőöv: link, Facebook esemény, helyszín, jegyzet, fotó — innen egy koppintás a túraprojekt.</div></div></div>
    <div class="ib-form card panel">
      <div class="flex wrapcol" style="gap:.5rem;align-items:flex-end">
        <div style="min-width:150px"><label class="f" for="ib-t">Típus</label><select class="input" id="ib-t">
          <option value="link">🔗 Link / cikk</option><option value="event">📣 Esemény (FB, site)</option><option value="place">📍 Helyszín</option><option value="note">📝 Jegyzet</option><option value="photo">🖼️ Fotó</option></select></div>
        <div style="flex:2;min-width:190px"><label class="f" for="ib-n">Cím</label><input class="input" id="ib-n" placeholder="Pl. SzATT 2026 — izzó gerinc"></div>
        <div style="flex:2;min-width:190px"><label class="f" for="ib-u">URL (opcionális)</label><input class="input" id="ib-u" placeholder="https://m.facebook.com/events/…"></div>
        <div style="flex:3;min-width:190px"><label class="f" for="ib-x">Jegyzet</label><input class="input" id="ib-x" placeholder="Dátum, találkozó, tipp…"></div>
        <button class="btn btn-primary" id="ib-save" style="margin-bottom:2px">＋ Mentés az Inboxba</button>
      </div>
      <label class="ib-photo hidden" id="ib-pwrap"><span>🖼️ Fotó csatolása</span><input type="file" id="ib-p" accept="image/*"></label>
    </div>
    <div id="ib-list"></div>`);
};
VIEWS.inbox.after = root => {
  const draw=()=>{
    const list=root.querySelector("#ib-list"); const d=D();
    list.innerHTML = d.inbox.length? d.inbox.map(it=>`
      <div class="ib-item ${it.read?"":"new"}" data-ibid="${it.id}">
        <span class="ib-ic">${IB_ICON[it.type]||"🔗"}</span>
        <div class="ib-b">
          <b>${esc(it.title||it.note||"(cím nélkül)")}</b>
          <div class="small muted">${it.note?esc(it.note).slice(0,110):""} ${it.url?`· <a href="${esc(it.url)}" target="_blank" rel="noopener">forrás ↗</a>`:""} · ${new Date(it.at).toLocaleDateString("hu-HU")}</div>
          ${it.img?`<img class="ib-img" src="${it.img}" alt="">`:""}
          <div class="ib-acts">
            <button class="btn btn-ember btn-sm" data-ib-plan="${it.id}">🧭 Túraprojekt</button>
            <button class="btn btn-soft btn-sm" data-ib-wish="${it.id}">❤️ Bakancslistára</button>
            ${it.url?`<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(it.url)}">↗ Megnyitás</a>`:""}
            <button class="btn btn-ghost btn-sm" data-ib-del="${it.id}">🗑</button></div></div></div>`).join("")
      : `<div class="empty-state card"><div class="empty em-ico">📥</div><h3>Friss, üres postaláda</h3><p class="muted">Ments ide linkeket, FB eseményeket, jegyzeteket — aztán alakítsd őket túraprojektté.</p></div>`;
    list.querySelectorAll("[data-ib-plan]").forEach(b=>b.onclick=()=>{ ibTour(D().inbox.find(x=>x.id===b.dataset.ibPlan||x.id===b.dataset.ibPlan)); });
    list.querySelectorAll("[data-ib-wish]").forEach(b=>b.onclick=()=>{ ibWish(D().inbox.find(x=>x.id===b.dataset.ibWish)); });
    list.querySelectorAll("[data-ib-del]").forEach(b=>b.onclick=()=>{ const d2=D(); d2.inbox=d2.inbox.filter(x=>x.id!=b.dataset.ibDel); Store.save(); draw(); });
  }; draw();
  const ty=root.querySelector("#ib-t"); const pwrap=root.querySelector("#ib-pwrap");
  ty.onchange=()=>{ pwrap.classList.toggle("hidden", ty.value!=="photo"); };
  root.querySelector("#ib-save").onclick=()=>{
    const v=id=>root.querySelector("#"+id).value.trim();
    const item={type:ty.value,title:v("ib-n"),url:v("ib-u"),note:v("ib-x"),place:ty.value==="place"?v("ib-n"):""};
    const f=root.querySelector("#ib-p").files&&root.querySelector("#ib-p").files[0];
    const finish=(img)=>{ if(!item.title&&!img&&!item.url&&!item.note){ toast("Írj valamit: címet, linket vagy jegyzetet","✍️"); return; }
      ibAdd(img?Object.assign(item,{img}):item);
      ["ib-n","ib-u","ib-x"].forEach(id=>root.querySelector("#"+id).value=""); root.querySelector("#ib-p").value="";
      ty.value="link"; pwrap.classList.add("hidden"); toast("Elmentve az Inboxba 📥","✓");
      const list=root.querySelector("#ib-list"); list.innerHTML="";
      const r2=root; const drawF=r2; // újra rajz
      D().inbox.length; render(); };
    if(f){ const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,700/im.width); c.width=im.width*sc|0; c.height=im.height*sc|0;
        const g=c.getContext("2d"); g.fillStyle="#000"; g.fillRect(0,0,c.width,c.height); g.setTransform(1,0,0,1,c.width/2,c.height/2);
        let rot=0; try{ const o=new Image(); rot=0; }catch(e){}
        g.rotate(rot); g.drawImage(im,-c.width/2,-c.height/2,c.width,c.height);
        try{ const d3=D(); const pc=d3.inbox.filter(x=>x.img).length; if(pc>=9){ toast("10 kép max az Inboxban — törölj párat","🗜"); return; } }catch(e){}
        finish(c.toDataURL("image/jpeg",0.62)); }; im.onerror=()=>toast("A fotó nem olvasható","🖼️"); im.src=rd.result; }; rd.readAsDataURL(f); }
    else finish(); };
};

/* ---------- 9) Widget az Inboxból + dashboard blokkrend ---------- */
const _prjLabels=WIDGETS;
WIDGETS.inbox={label:"📥 Inbox — gyors mentések"};
/* (az Inboxwidget a dashboard W-tárgyában kapott helyet — lásd upgrade.js W.inbox) */


/* ---------- 10) Túra mód V2 — gyors jegyzet + fotó (DOM) ---------- */
function tmQuickCard(t){ ensureTourFields(t); return `<div class="card panel tm-quick">
  <h3>Gyors jegyzet a pályáról</h3>
  <div class="flex" style="gap:.45rem;flex-wrap:wrap"><input class="input" id="tm-note" placeholder="Pl. forrás a 2 km-nél, jelzés festve…" style="flex:1;min-width:140px"><button class="btn btn-primary" id="tm-note-add">＋</button>
    <button class="btn btn-soft" id="tm-photo">📸 Fotó</button><input type="file" id="tm-pf" accept="image/*" class="hidden"></div>
  ${(t.noteStream||[]).slice().reverse().slice(0,6).map(n=>`<div class="tm-note"><b>${n.ts}</b> ${esc(n.text)}</div>`).join("")}
  ${(t.photos||[]).length?`<div class="tm-photos">${t.photos.slice(-4).map(p=>`<img src="${p}" alt="túra fotó">`).join("")}</div>`:""}</div>`; }
function tmWire(){
  try{
    const add=document.getElementById("tm-note-add"); if(!add) return;
    const mm=(location.hash||"").match(/turamod\/([\w-]+)/); if(!mm) return;
    const t=Store.getTour(mm[1]); if(!t) return;
    add.onclick=()=>{ const i=document.getElementById("tm-note"); const v=i.value.trim(); if(!v) return;
      ensureTourFields(t); t.noteStream.push({ts:new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}),text:v}); Store.save(); render(); };
    const pf=document.getElementById("tm-pf"); if(!pf) return;
    document.getElementById("tm-photo").onclick=()=>pf.click();
    pf.onchange=()=>{ const f=pf.files&&pf.files[0]; if(!f) return; const rd=new FileReader();
      rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,800/im.width);
        c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); const g=c.getContext("2d"); g.drawImage(im,0,0,c.width,c.height);
        ensureTourFields(t); t.photos.push(c.toDataURL("image/jpeg",0.6));
        t.noteStream.push({ts:new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}),text:"📸 fotó csatolva"});
        Store.save(); render(); toast("Fotó a túrához mentve (tömörítve)","📸"); }; im.onerror=()=>toast("A fotó nem olvasható","🖼️"); im.src=rd.result; }; rd.readAsDataURL(f); };
  }catch(e){}
}
const _prjTMA = VIEWS.tourmode.after;
try{ VIEWS.tourmode.after = function(root, id){ try{ _prjTMA && _prjTMA.apply(this, arguments);
  const mm=(location.hash||"").match(/turamod\/([\w-]+)/);
  if(mm){ const t=Store.getTour(mm[1]||id); const box=(root||document).querySelector(".tmode");
    if(t && box && !box.querySelector(".tm-quick")){ box.insertAdjacentHTML("beforeend", tmQuickCard(t)); } }
  tmWire(); }catch(e){ console.error("TMHOOK", e); } }; }catch(e){}
const _prjRender0 = render;
render = function(){ _prjRender0.apply(this, arguments);
  try{ const mm=(location.hash||"").match(/turamod\/([\w-]+)/);
    if(mm){ const tm=document.querySelector(".tmode"); if(tm){ const t=Store.getTour(mm[1]);
      if(t && !document.querySelector(".tm-quick")) tm.insertAdjacentHTML("beforeend", tmQuickCard(t)); } }
  }catch(e){}
  tmWire(); };

/* ---------- 11) sablon teendők → t.tasks + apply csatlakozás ---------- */
function allTpl(){ return TEMPLATES_DEFAULT.concat(D().templates||[]); }
if(Store.applyTemplate){ const _prjAT = Store.applyTemplate;
  Store.applyTemplate = (tid,tpid)=>{ const res=_prjAT(tid,tpid);
    try{ const t=Store.getTour(tid); const tpl=allTpl().find(x=>x.id===tpid);
      if(t&&tpl&&tpl.tasks){ ensureTourFields(t);
        tpl.tasks.forEach(x=>{ if(!t.tasks.some(y=>y.label===x)) t.tasks.push({id:uidp("tk"),label:x,done:false,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); });
        Store.save(); } }catch(e){}
    return res; }; }

/* ---------- 12) Dashboard finomítás: üres sávok eltüntetése + első lépés panel ---------- */
const _pDashA = VIEWS.dash.after;
VIEWS.dash.after = (root) => {
  try{ _pDashA && _pDashA(root); }catch(e){}
  try{
    const box = root.querySelector("#widgets"); if(!box) return;
    const d = Store.myData();
    box.querySelectorAll(".wsec").forEach(sec=>{
      const w = sec.dataset.w; const txt = (sec.textContent||"").replace(/\s+/g,"").length;
      const ctl = sec.querySelector("input,select,textarea,button:not(#rdi-check),a");
      if(txt < 16 && !ctl) sec.remove();
    });
    if(!d.tours.length && !d.journal.length){
      box.insertAdjacentHTML("afterbegin", `<section class="wsec"><div class="df-card"><div class="df-ic">&#129466;</div>
        <div class="df-b"><h3>&#220;res a túraközpontod — töltsük meg</h3>
        <p class="muted small" style="margin:.1rem 0 .2rem">Három lépés, és a tervezés, csomagolás, naptár, élménykönyv egy helyen fut.</p>
        <div class="df-steps">
          <a href="#/felfedezes"><b>1 · Válassz célt</b><span>32 útvonal · Székelyföld és Erdély</span></a>
          <a href="#/uj-tura"><b>2 · Tervezd meg</b><span>induló sablonok · 5 perc</span></a>
          <a href="#/inbox"><b>3 · Mentd az ötleteidet</b><span>FB esemény, link, fotó</span></a>
        </div></div></div></section>`);
    }
  }catch(e){}
};


/* ---------- 13) ☀️ Valódi időjárás widget (ma, profilszékszeredád fölött) ---------- */
const SUNKEY="tv.sun.v1";
async function sunToday(){ const u=Store.me(); if(!u) throw new Error("no user"); const city=(u.city||"").trim()||"Csíkszereda";
  const today=Store.todayISO(); const ck=SUNKEY+"|"+city+"|"+today;
  let cache={}; try{ cache=JSON.parse(localStorage.getItem(SUNKEY)||"{}"); }catch(e){}
  if(cache[ck]) return cache[ck];
  let lat=46.7,lng=25.0;
  try{ const g=await (await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(city.slice(0,40))+"&count=1&language=hu")).json();
    if(g.results&&g.results[0]){ lat=g.results[0].latitude; lng=g.results[0].longitude; } }catch(e){}
  const j=await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset,temperature_2m_max,precipitation_probability_max&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`)).json();
  const moonAge=(()=>{ const KNOWN=Date.UTC(2000,0,6,18,14); return ((Date.now()-KNOWN)/86400000)%29.530588853; })();
  const w={ city, sr:(j.daily.sunrise[0]||"").slice(11,16), ss:(j.daily.sunset[0]||"").slice(11,16),
    tmax:Math.round(j.daily.temperature_2m_max[0]), rain:+(j.daily.precipitation_probability_max[0]||0),
    moon:Math.round((1-Math.cos(2*Math.PI*moonAge/29.530588853))/2*100), now:Math.round(j.current.temperature_2m),
    ico:wmoIco(j.current.weather_code), wind:Math.round(j.current.wind_speed_10m) };
  Object.keys(cache).forEach(k=>{ if(!k.endsWith("|"+today)) delete cache[k]; });
  cache[ck]=w; try{ localStorage.setItem(SUNKEY, JSON.stringify(cache)); }catch(e){}
  return w; }
function sunPaint(root){ const box=root.querySelector("#sun-today-body"); if(!box) return;
  sunToday().then(w=>{ const loc=root.querySelector("#sun-loc"); if(loc) loc.textContent=esc(w.city);
    const hold = w.moon<15?"újhold":w.moon<45?"fogyó félhold":w.moon<80?"teliesebb hold":"telihold";
    box.innerHTML = `<div class="sun-flex">
      <span class="sun-now">${w.ico} <b>${w.now}°C</b><small>max ${w.tmax}° · eső ${w.rain}% · szél ${w.wind} km/h</small></span>
      <span class="sun-pair" title="napkelte">🌅 <b>${w.sr}</b></span><span class="sun-pair" title="napnyugta">🌇 <b>${w.ss}</b></span>
      <span class="sun-moon" title="hold">🌙 ${hold} · ${w.moon}%</span></div>
      <p class="small muted" style="margin:.45rem 0 0">Korai indulásnál számolj a ${w.sr} utáni fényrel — a fejlámpa akkor is kell.</p>`;
  }).catch(()=>{ box.innerHTML = '<p class="small muted mt0" style="margin:0">Az időjárás nem kérhető most (nincs kapcsolat).</p>'; }); }

/* ---------- 14) 🕝 Legutóbb megnézett gyűjtő ---------- */
function recordRecent(){ try{
  const h=location.hash||""; let ent=null;
  let m=h.match(/^#\/tura\/([\w-]+)/); if(m){ const t=Store.getTour(m[1]); if(t) ent={href:h,ico:"🥾",label:t.title}; }
  if(!ent){ m=h.match(/^#\/turak\/([\w-]+)/); if(m){ const ct=TOURS.find(x=>x.id===m[1]||x.id===m[1].split("?")[0]); if(ct) ent={href:h,ico:"⛰️",label:ct.name}; } }
  if(!ent){ m=h.match(/^#\/esemenyek\/([\w-]+)/); if(m){ const e=EVENTS.find(x=>x.id===m[1]); if(e) ent={href:h,ico:"📣",label:e.name}; } }
  if(!ent) return;
  const d=Store.myData(); if(!d.recent) d.recent=[];
  d.recent=[ent].concat(d.recent.filter(x=>x.href!==ent.href)).slice(0,6); Store.save();
}catch(e){} }
addEventListener("hashchange", recordRecent);
  setTimeout(recordRecent, 1400);

/* ---------- 15) ⬇️ GPX export a saját túrához ---------- */
function gpxEscape(x){ return String(x||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function buildGpx(t){
  const pts=[];
  if(t.coords&&+t.coords.lat) pts.push({lat:+t.coords.lat,lng:+t.coords.lng,n:t.place||t.title,ele:null});
  (t.waypoints||[]).forEach(w=>{ if(+w.lat) pts.push({lat:+w.lat,lng:+w.lng,n:w.name||"pont",ele:w.ele?+w.ele:null}); });
  const slug=(t.title||"tura").toLowerCase().replace(/[^a-z0-9]+/gi,"-").slice(0,40);
  const wpts=pts.map(p=>`  <wpt lat="${p.lat}" lon="${p.lng}">${p.ele!=null?`\n    <ele>${p.ele}</ele>`:""}\n    <name>${gpxEscape(p.n)}</name></wpt>`).join("\n");
  const trkpts=pts.length>1?`    <trkseg>\n${pts.map(p=>`      <trkpt lat="${p.lat}" lon="${p.lng}">${p.ele!=null?`<ele>${p.ele}</ele>`:""}</trkpt>`).join("\n")}\n    </trkseg>`:"";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Turatars" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${gpxEscape(t.title)}</name><desc>${gpxEscape((t.desc||"").slice(0,180))}</desc></metadata>\n${wpts}\n  <trk><name>${gpxEscape(t.title)}</name>${trkpts?"\n"+trkpts+"\n ":""}</trk>\n</gpx>`; }
function dlGpx(t){
  if(t.gpx && /^https?:/.test(t.gpx)){ window.open(t.gpx, "_blank"); toast("A katalógus GPX-et új lapon nyitottam — mentsd onnan","🗺️"); return; }
  if(!(t.coords||t.waypoints||[]).length){ toast("Ehhez a tervhez nincs útvonalpont — importálj nyomvonalat (Katalógus/Hagymás) előbb","🧭"); return ; }
  const xml=buildGpx(t); const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([xml],{type:"application/gpx+xml"})); a.download=(t.title||"tura").replace(/[^\w-]+/g,"_").slice(0,44)+".gpx";
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},600);
  toast("GPX letöltve — betöltheted Természetjáróba, Komootba","⬇️"); }

/* Gombok: GPX az Útvonal- és Áttekintés füleken, sun festés, recent mentés */
const _prj12DashA = VIEWS.dash.after;
VIEWS.dash.after = (root) => { _prj12DashA && _prj12DashA(root); recordRecent();
  try{ if(root.querySelector('[data-w="sun"]')) sunPaint(root); }catch(e){} };
const _prj12WsA = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id) => { _prj12WsA && _prj12WsA(root,id);
  try{ if(wsTab==="utvonal"||wsTab==="attekintes"){ const act=root.querySelector(".ws-actions");
    if(act && !document.getElementById("btn-gpx")){ const b=document.createElement("button"); b.className="btn btn-ghost btn-sm"; b.id="btn-gpx";
      b.innerHTML="⬇️ GPX"; b.onclick=()=>{ const t=Store.getTour(id); if(t) dlGpx(t); }; act.insertBefore(b, act.children[2]||null); } } }catch(e){} };


/* ---------- 16) V36: Túráim státuszrend + Teendők fül + 3 állapotú résztvevők + közös cucc + Ma-lista + AI-útvonal ---------- */
const TV_GROUPS=[["otlet","💡 Ötletek"],["bakancs","❤️ Bakancslistán"],["tervezes","🟡 Tervezés alatt"],["kozelgo","🔵 Közelgő"],["folyamatban","🚩 Folyamatban"],["teljesitve","🟢 Teljesítve"],["archivalva","📖 Archiválva"],["esemeny","🎫 Események"],["mind","🌐 Mind"]];
function tvBucket(t){ const d=t.date?Store.dayDiff(t.date):999;
  if(t.status==="ötlet")return"otlet"; if(t.status==="bakancs")return"bakancs";
  if(t.status==="teljesítve")return"teljesitve"; if(t.status==="archiválva")return"archivalva";
  if(t.status==="folyamatban"||(t.date&&d<=0))return"folyamatban";
  if(t.eventRef)return"esemeny";
  if(d<=7&&["tervezés","közelgő"].includes(t.status))return"kozelgo"; return "tervezes"; }
let tvTab="mind";
VIEWS.tours = () => { const d=Store.myData();
  const buck={}; d.tours.forEach(t=>{ const k=tvBucket(t); (buck[k]=buck[k]||[]).push(t); });
  Object.values(buck).forEach(a=>a.sort((x,y)=>(x.date||"9999").localeCompare(y.date||"9999")));
  const list=(tvTab==="mind"? d.tours.slice() : (buck[tvTab]||[]).slice()).sort((x,y)=>(x.date||"9999").localeCompare(y.date||"9999"));
  return dash("#/turaim")(`
    <div class="dash-top"><div><h1>Túráim 🥾</h1><div class="hello">Minden terved önálló túraprojekt — a fülek a projekt állapotát követik.</div></div>
      <a class="btn btn-primary" href="#/uj-tura">➕ Új túra</a></div>
    <div class="tabs tv36" role="tablist">${TV_GROUPS.map(([k,l])=>{ const n=k==="mind"?d.tours.length:(buck[k]||[]).length; return `<button class="${tvTab===k?"on":""}" data-tvtab="${k}">${l} ${n?`<span class="tvn">${n}</span>`:""}</button>`; }).join("")}</div>
    ${list.length?`<div class="grid" id="tour-list">${list.map(tourRow).join("")}</div>`:
     `<div class="empty"><span class="em-ico">🌲</span><h3>Ebben a szekcióban még nincs túrád</h3><p class="muted">A „Mind” fül mindent mutat; a katalógus bármely túrája egy kattintással projektté válik.</p>
     <a class="btn btn-primary" href="#/uj-tura">➕ Első túra</a> <a class="btn btn-soft" href="#/felfedezes">🗺️ Túrák a katalógusban</a></div>`}`);
};
VIEWS.tours.after = root => {
  root.querySelectorAll("[data-tvtab]").forEach(b=>b.onclick=()=>{ tvTab=b.dataset.tvtab; render(); });
  wireTourActions(root);
};

/* Teendők önálló fül (aki-osztással) + közös felszerelés */
try{ if(!WS_TABS.some(x=>x[0]==="teendok")) WS_TABS.push(["teendok","✅ Teendők"]); }catch(e){}
const _prjTab16 = wsTabHTML;
wsTabHTML = function(t,catTour){ if(wsTab==="teendok"){ ensureTourFields(t);
    const who=t.participants.map(p=>p.name);
    const open=t.tasks.filter(x=>!x.done).length;
    return `<div class="ws-grid"><div class="card panel">
      <div class="flex between wrapcol"><h3 style="margin:0">✅ Teendők — ki mit csináljon</h3>
        <span class="chip ${open?"chip-ember":"chip-green"}">${open?open+" nyitott":"minden kész ✓"}</span></div>
      <div id="tk-list">${t.tasks.map(x=>`<div class="ck ${x.done?"done":""}" style="display:flex;gap:.5rem;align-items:center;padding:.35rem 0">
          <input type="checkbox" data-tk="${x.id}" ${x.done?"checked":""}>
          <span style="flex:1">${esc(x.label)}</span>
          <select class="input who-sel" data-tkwho="${x.id}" style="width:auto;font-size:.82rem;padding:.2rem .45rem">
            <option value="">senki</option>${who.map(w=>`<option ${x.who===w?"selected":""}>${esc(w)}</option>`).join("")}</select>
          ${x.due!=null?`<span class="chip chip-sand" style="font-size:.72rem">D-${x.due}</span>`:""}</div>`).join("")||'<p class="small muted">Nincs teendő — az ⚡ AI terv fel tud dobni egy teljes listát.</p>'}</div>
      <div class="flex" style="gap:.45rem;margin-top:.8rem;flex-wrap:wrap"><input class="input" id="tk-n" placeholder="Új teendő…" style="flex:1;min-width:160px">
        <select class="input" id="tk-who" style="width:150px"><option value="">kinek?</option>${who.map(w=>`<option>${esc(w)}</option>`).join("")}</select>
        <button class="btn btn-primary btn-sm" id="tk-add">＋ Felvétel</button></div>
      ${(t.participants.length&&t.gear.length)?`<div class="divider" style="border-top:1px solid var(--line);margin:1rem 0"></div><h3>Közös felszerelés — ki visz mit</h3>
        ${t.gear.map(g=>`<label class="ck" style="align-items:center;gap:.5rem"><span style="flex:1">${esc(g.icon||"🧰")} ${esc(g.name)}</span>
          <select class="input own-sel" data-gowho="${esc(g.name)}" style="width:170px;font-size:.84rem"><option value="">—</option>${t.participants.map(p=>`<option ${g.who===p.name?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label>`).join("")}
        <p class="small muted mt0">A ki nem osztott felszerelés a Túraprojekt csomagjában van — egy emberhez rendelve nem duplication.</p>`:""}</div></div>`; }
  return _prjTab16(t,catTour); };


/* ---------- 17) V36 kötelek: résztvevő-státusz, teendő-fejlesztés, utazás-bővítés, étel-chipek, Ma-lista, AI-út ---------- */
/* ws after-lánc: tab-függő drótverás */
const _prjWA17 = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ _prjWA17 && _prjWA17(root,id);
  const t=Store.getTour(id); if(!t) return; ensureTourFields(t);
  // Résztvevők: 3 állapotú ciklus + feladatösszefoglaló
  if(wsTab==="resztvevok"){
    root.querySelectorAll("[data-pconf]").forEach(b=>{ const p=t.participants.find(x=>x.id===b.dataset.pconf); if(!p) return;
      const s=p.stat|| (p.confirmed?"jön":"válasz");
      b.textContent = s==="jön"?"✓ Jön":s==="nem"?"✕ Nem jön":"⏳ Válaszra vár";
      b.className = "btn btn-sm "+(s==="jön"?"btn-soft":s==="nem"?"btn-danger":"btn-ember");
      b.onclick = ()=>{ p.stat = s==="válasz"?"jön":s==="jön"?"nem":"válasz"; p.confirmed=p.stat==="jön"; Store.save(); render(); }; });
    const done=t.participants.filter(p=>(p.stat||"válasz")==="jön").length, no=t.participants.filter(p=>p.stat==="nem").length;
    const card=root.querySelector(".card.panel");
    if(card) card.insertAdjacentHTML("afterbegin", `<p class="small muted" style="margin:0 0 .6rem">✓ ${done} jön · ⏳ ${t.participants.length-done-no} válaszol · ✕ ${no} nem jön — a nemet mondottakat a túra napja előtt jelezheted a csoportnak.</p>`);
  }
  // Teendők tab drótozás
  if(wsTab==="teendok"){
    root.querySelectorAll("[data-tk]").forEach(cb=>cb.onclick=()=>{ const x=t.tasks.find(y=>y.id===cb.dataset.tk); if(x){x.done=cb.checked; Store.save(); render();} });
    root.querySelectorAll("[data-tkwho]").forEach(sel=>sel.onchange=()=>{ const x=t.tasks.find(y=>y.id===sel.dataset.tkwho); if(x){ x.who=sel.value||null; Store.save(); render(); } });
    const add=()=>{ const v=root.querySelector("#tk-n").value.trim(); if(!v) return; const w=root.querySelector("#tk-who");
      t.tasks.push({id:uidp("tk"),label:v,done:false,who:w&&w.value?w.value:null,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); Store.save(); render(); };
    const ab=root.querySelector("#tk-add"); if(ab) ab.onclick=add;
    const inp=root.querySelector("#tk-n"); if(inp) inp.addEventListener("keydown",e=>{if(e.key==="Enter")add();});
    root.querySelectorAll("[data-gowho]").forEach(sel=>sel.onchange=()=>{ const g=t.gear.find(y=>y.name===sel.dataset.gowho); if(g){ g.who=sel.value||null; Store.save(); toast(sel.value?sel.value+" hozza: "+g.name:g.name+" visszatett common-ba","🤝"); } });
  }
  // Utazás kiegészítő mezők
  if(wsTab==="utazas" && !document.getElementById("tr-extra")){
    const c1=root.querySelector(".card.panel");
    if(c1){ const box=document.createElement("div"); box.id="tr-extra"; box.className="card panel";
      box.innerHTML=`<h3>🧳 Indulási részletek</h3>
        <label class="f" for="tr-start">Indulási hely</label><input class="input" id="tr-start" placeholder="Pl. Csíkszereda, autóbusz-pályaudvar" value="${esc(t.startPoint||"")}">
        <div style="height:.6rem"></div>
        <label class="f" for="tr-when">Indulási idő</label><input class="input" id="tr-when" type="time" value="${esc(t.meetingTime||"")}">
        <div style="height:.6rem"></div>
        <label class="f" for="tr-mode">Közlekedési mód</label><select class="input" id="tr-mode">${["Autó","Busz","Vonat","Terepjáró","Gyalog","Bicikli"].map(m=>`<option ${t.travelMode===m?"selected":""}>${m}</option>`).join("")}</select>
        <p class="small muted mt0">Az autó + sofőrök a fenti részen maradtak — az étel/ital a Költségek → utazás tétel lehet. 💶</p>`;
      c1.parentNode.insertBefore(box, c1.nextSibling);
      const sv=()=>{ t.startPoint=box.querySelector("#tr-start").value.trim(); t.meetingTime=box.querySelector("#tr-when").value; t.travelMode=box.querySelector("#tr-mode").value; Store.save(); toast("Utazás adatok mentve ✔","🧳"); };
      box.querySelectorAll("input,select").forEach(el=>el.addEventListener("change",sv)); }
  }
  // Étel预设 chipek
  if(wsTab==="ete" && !document.getElementById("fd-chips")){
    const box=document.createElement("div"); box.id="fd-chips"; box.className="card panel";
    box.innerHTML=`<h3>Gyors felvételek</h3><div class="filter-row">${[["Reggeli","🥣"],["Ebéd","🥪"],["Snack","🍌"],["Ital","🧃"],["Víz","💧"]].map(([n,i])=>`<button class="f-pill" data-fd="${n}" data-fdi="${i}">${i} ${n}</button>`).join("")}</div>
      <p class="small muted mt0">A túra ${t.durationH||"|"} órája alapján a rendszer a fentieket minimumként javasolja.</p>`;
    const g=root.querySelector(".ws-grid"); if(g) g.appendChild(box);
    box.querySelectorAll("[data-fd]").forEach(b=>b.onclick=()=>{
      const n=b.dataset.fd, ex=t.food.find(f=>f.n===n||f.n.startsWith(n+" "));
      const f={id:uidp("fd"),n:(ex?ex.n+" +1":(n==="Víz"?"Víz 1,5 l":n)),i:b.dataset.fdi,checked:false,w:n==="Víz"?1500:(n==="Ebéd"?450:220),cat:n};
      t.food.push(f); Store.save(); render(); toast(f.n+" feltéve — csomagolósúlyban is","🥫"); });
  }
};

/* 3 állapotú display a csapat-státushoz illesztett gombok + Readiness-blokk új sorok — a fent már kezelve. */

/* AI modal kiterjesztése: útvonal-javaslat a katalógusból */
const _oldKit = aiKitModal;
aiKitModal = function(t){
  const norm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u0308]/g,"").replace(/[^a-z0-9 ]/g," ");
  const q=t.title+" "+t.place+" "+t.region;
  let m=null, best=0;
  TOURS.forEach(c=>{ const hay=norm(c.name+" "+c.start.name+" "+c.region); let sc=0;
    norm(q).split(/\s+/).forEach(w=>{ if(w.length>3&&hay.includes(w)) sc++; }); if(sc>best){best=sc;m=c;} });
  window.__aiRoute = (best>0)?m:null;
  _oldKit(t);
  setTimeout(()=>{ try{
    const save=document.getElementById("aikit-save"); const box=save&&save.closest(".modal"); if(!box||!save) return;
    if(!box.querySelector('[data-sec="utvonal"]')){
      const row=document.createElement("label"); row.className="ck"; row.style.cssText="align-items:flex-start;margin-top:.55rem";
      row.innerHTML=`<input type="checkbox" data-sec="utvonal" ${window.__aiRoute?"checked":""}>
        <span><b>🧭 Útvonal${window.__aiRoute?" — "+esc(window.__aiRoute.name):""}</b><br><span class="small muted">${window.__aiRoute?esc(window.__aiRoute.start.name)+" · "+window.__aiRoute.km+" km · "+window.__aiRoute.up+" m szint · GPX a katalógusban":"nincs jó katalógus-egyezés"}</span></span>`;
      save.parentNode.insertBefore(row, save);
    }
    if(!save.__routed){ save.__routed=1; const oc=save.onclick;
      save.onclick=(ev)=>{ const cb=box.querySelector('[data-sec="utvonal"]');
        if(cb&&cb.checked&&window.__aiRoute){ const c=window.__aiRoute;
          t.coords={lat:c.start.lat,lng:c.start.lng}; t.gpx=c.gpxUrl||null; t.refs=c.src||null;
          if(!t.lengthKm){ t.lengthKm=c.km; t.ascent=c.up; } }
        if(oc) oc.call(save,ev); }; }
  }catch(e){ console.error("AI-route",e); } },60);
};

/* „Ma mit kell tennem?” — okos quick widget: fejléc + automata lista */
const _prjDA17 = VIEWS.dash.after;
VIEWS.dash.after = function(root){ _prjDA17 && _prjDA17(root);
  try{
    const sec=root.querySelector('[data-w="quick"]'); const nx=Store.upcoming()[0];
    if(sec && !nx){ const d2=Store.myData(); const w=(d2.wishlist||[])[0];
      sec.innerHTML=`<div class="wpan"><div class="flex between"><h3>📌 Nincs közelgő túrád</h3><span class="chip chip-sand">szabad szombatok 🌲</span></div>
        ${w?`<p class="small" style="margin:.2rem 0 .5rem">A bakancslistád teteje: <b>${esc(w.name)}</b>${w.place?" — "+esc(w.place):""}</p>
        <a class="btn btn-ember btn-sm" href="#/bakancslista">🗓️ Tervezz belőle túraprojektet</a>`
        :`<p class="small" style="margin:.2rem 0 .5rem">Ilyenkor a legjobb felfedezni — az erdő nem vár:</p>
        <a class="btn btn-ember btn-sm" href="#/felfedezes">🧭 Túrák a katalógusban</a>`}
        <a class="btn btn-soft btn-sm" style="margin-left:.4rem" href="#/uj-tura">➕ Új túra</a></div>`; }
    if(sec && nx){ ensureTourFields(nx); const dd=Store.dayDiff(nx.date);
      const todos=[];
      (nx.tasks||[]).filter(x=>!x.done&&x.due<=1).slice(0,3).forEach(x=>todos.push({t:x.label,go:"teendok",who:x.who?esc(x.who)+" — ":""}));
      if(!nx.weatherChecked) todos.push({t:"Ellenőrizd az időjárást",act:"wx"});
      if((nx.gear||[]).some(g=>!g.checked)) todos.push({t:"Csomagold ki a listát (mi hiányzik)",go:"felszereles"});
      if(nx.gear.some(g=>/fejlámpa/i.test(g.name)&&!g.checked) && dd<=1) todos.push({t:"Ellenőrizd a fejlámpát (elem!)",go:"felszereles"});
      if((nx.food||[]).some(f=>!f.checked) && dd<=2) todos.push({t:"Vásárolj vizet + uzsonnát",go:"ete"});
      if((nx.participants||[]).some(p=>!p.confirmed)) todos.push({t:"Erősítsd meg a résztvevőket",go:"resztvevok"});
      const chk=todos.map((x,i)=>`<li class="q36"><button class="q36-go" data-qi="${i}" title="Ugrás">${["☐","☐","☐","☐","☐","☐"][i]}</button><span>${x.who||""}<b>${x.t}</b></span></li>`).join("");
      (sec.querySelector(".wcard")||sec).innerHTML = `<div class="flex between"><h3>📌 Ma mit kell tennem?</h3><span class="chip ${dd<=1?"chip-ember":"chip-sand"}">${dd===0?"MA van! 🥾":dd+" nap múlva: "+esc(nx.title.slice(0,18))}</span></div>
        <p class="small muted" style="margin:.15rem 0 .5rem">A(z) <b>${esc(nx.title)}</b> ${dd===0?"mára":dd+" nap múlva"} esedékes (${nx.date?fmtDateFull(nx.date):""}) — a feladatok a projekt állapotából jöttek.</p>
        <ul class="q36-list">${chk||"<li style='list-style:none' class='muted small'>Minden kulcsfontosságú pont zöld — pipáld aTeendőidet a projektben.</li>"}</ul>`;

    /* dashboard readi = igazi Felkészültség-sáv + Ellenőrzés ugró a projektbe */
    const rs=root.querySelector('[data-w="readi"]');
    if(rs){ const c=Store.tourCheck(nx);
      rs.innerHTML=`<div class="wpan"><div class="flex between"><h3>🎒 Felkészültség — ${esc(nx.title.slice(0,22))}</h3><span class="chip ${c.pct>=100?"chip-green":"chip-ember"}">${c.pct}%</span></div>
        <div class="readi-track" style="margin:.5rem 0 .3rem"><i class="readi-fill ${c.pct>=100?"full":""}" style="width:${c.pct}%"></i></div>
        <p class="small nb" style="margin:0">${c.pct>=100?"🟢 Indulásra kész — jó utat!":`Még ${c.missing.length} dolog van hátra.`} <span class="readi-chips">${c.missing.slice(0,2).map(x=>`<span class="readi-chip">${esc(x.label)}</span>`).join("")}${c.missing.length>2?`<span class="readi-chip">+${c.missing.length-2} többi</span>`:""}</span></p>
        <button class="btn btn-soft btn-sm" id="dash-rdi" style="margin-top:.6rem">🛃 Túra ellenőrzése</button>
        <a class="btn btn-ghost btn-sm" style="margin-top:.6rem" href="#/tura/${nx.id}">Munkaterület →</a></div>`;
      const rb=root.querySelector("#dash-rdi");
      if(rb) rb.onclick=()=>{ readiCheckModal(nx);
        const modal=document.querySelector("[data-modal]");
        if(modal) modal.addEventListener("click",e=>{ const j=e.target.closest("[data-jump]"); if(j){ e.preventDefault(); e.stopPropagation(); closeModal(); wsTab=j.dataset.jump; location.hash="#/tura/"+nx.id; } },true); };
    }
      sec.querySelectorAll("[data-qi]").forEach(li=>li.onclick=(e)=>{ e.stopPropagation(); const x=todos[+li.dataset.qi];
        const mm=location.hash.match(/#\/tura\/([\w-]+)/);
        if(x.act==="wx"){ fetchTourWeather(nx).then(()=>{ toast("Időjárás ellenőrizve ✔","🌤️"); render(); }).catch(()=>toast("Nincs kapcsolat","📡")); return; }
        wsTab=x.go; location.hash="#/tura/"+(mm?mm[1]:""); render(); });
    }
  }catch(e){}
};

/* Túra mód: automatikus „folyamatban” státusz a túra napján + ⚡ gomb a fejlécben */
const _tmodeA = VIEWS.tourmode.after || (r=>{});
VIEWS.tourmode.after = function(root,id){ _tmodeA(root,id);
  try{ const t=Store.getTour(id||location.hash.match(/turamod\/([\w-]+)/)?.[1]); if(!t||!t.date) return;
    if(Store.dayDiff(t.date)<=0 && ["tervezés","közelgő","jelentkezve"].includes(t.status)){ Store.setStatus(t.id,"folyamatban"); } }catch(e){} };


/* ---------- 18) V42: Teljesített túra → Élménykönyv természetes folyamat ---------- */
function richMemory(j){ if(!j) return false;
  return !!( (j.note&&j.note.trim().length>3) || (j.fav&&j.fav.trim()) || (j.lesson&&j.lesson.trim().length>3) || (j.photos||[]).length>1 || j.audio || (j.mood&&j.rating) ); }
window.memBtn = function(t){ const j=Store.myData().journal.find(x=>x.tourId===t.id);
  if(richMemory(j)) return `<button class="btn btn-soft btn-sm" data-openmem="${t.id}">✓ Élmény elmentve</button> <a class="btn btn-ghost btn-sm" href="#/naplo" title="Élménykönyv">🗂</a>`;
  return `<button class="btn btn-ember btn-sm" data-openmem="${t.id}">📖 Élmény hozzáadása</button>`; };
function openMemoryEditor(t, fresh){
  const d=Store.myData(), j=d.journal.find(x=>x.tourId===t.id)||{}; const parts=encodeURIComponent;
  const ppl=(t.participants||[]).map(p=>p.name).join(", ")||""; 
  openModal({ title:"📖 Élmény — "+esc(t.title), body:`
    <p class="small muted mt0" style="margin:0 0 .5rem">${esc(t.region||t.place||"")} · ${t.date?fmtDateFull(t.date):""} · 📏 ${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m${t.durationH?" · ⏱ "+t.durationH+" ó":""}${ppl?" · 👥 "+esc(ppl):""}${t.gpx||t.coords?" · 🧭 útvonal rögzítve":""}</p>
    <label class="f" for="mm-title">Cím</label><input class="input" id="mm-title" value="${esc(j.title||t.title)}">
    <label class="f" style="margin-top:.6rem" for="mm-story">Mesélj a túráról — nem kötelező</label><textarea class="input" id="mm-story" rows="4" placeholder="Mi volt a legjobb? ${fresh?"":"A korábbi szöveg megmarad."}">${esc(j.note||"")}</textarea>
    <label class="f" style="margin-top:.7rem">⭐ Értékeld a túrát</label>
    <div id="mm-stars" style="display:flex;gap:.2rem;font-size:1.8rem">${[1,2,3,4,5].map(i=>`<button data-s="${i}" style="background:none;border:0;cursor:pointer;color:${i<=(j.rating||5)?"var(--ember)":"#cfcabb"}" aria-label="${i}">★</button>`).join("")}</div>
    <label class="f" style="margin-top:.7rem" for="mm-fav">❤️ Kedvenc pillanatom</label><input class="input" id="mm-fav" value="${esc(j.fav||"")}" placeholder="Egy mondat, ami leginkább visszaadja.">
    <label class="f" style="margin-top:.6rem" for="mm-lesson">💡 Mit tanultam ebből a túrából?</label><input class="input" id="mm-lesson" value="${esc(j.lesson||"")}" placeholder="Pl. jövőre korábban indulunk.">
    <label class="f" style="margin-top:.7rem" for="mm-ph">📸 Fotók</label><input type="file" id="mm-ph" accept="image/*" multiple class="input" style="padding:.55em">
    ${(j.photos&&j.photos.length>1)?`<div class="tm-photos" style="margin-top:.4rem">${j.photos.slice(0,6).map(q=>`<img src="${q}" alt="emlék">`).join("")}</div>`:`<p class="small muted" style="margin-top:.3rem">${(j.photos||[]).length?"Már van egy borító-kép a túrából.":"Most még nincs fotó — fel is tölthetsz."}</p>`}
    <button class="btn btn-primary btn-block btn-lg" id="mm-save" style="margin-top:.9rem">📖 Elmentem az Élménykönyvembe</button>`,
    footer:`<button class="btn btn-ghost btn-block" data-close>${fresh?"Később mentem el":"Mégse"}</button>`,
    onOpen(r){
      let rating=j.rating||5; const stars=()=>r.querySelectorAll("[data-s]").forEach(s=>s.style.color=(+s.dataset.s)<=rating?"var(--ember)":"#cfcabb");
      r.querySelectorAll("[data-s]").forEach(s=>s.onclick=()=>{rating=+s.dataset.s;stars()}); stars();
      r.querySelector("#mm-save").onclick=()=>{ const files=[...(r.querySelector("#mm-ph").files||[])]; const old=(j.photos||[]).filter(p=>p&&(p.indexOf("data:")===0||(p.length<200&&p!==t.img)));
        const finalize=(extra)=>{ const photos=[...new Set([...(j.photos&&j.photos.length>1?j.photos:(old.length?old:[])), ...extra])].slice(0,9);
          Store.completeTour(t.id, { rating, note:r.querySelector("#mm-story").value, lesson:r.querySelector("#mm-lesson").value,
            fav:r.querySelector("#mm-fav").value, title:r.querySelector("#mm-title").value.trim()||t.title, photos,
            km:+(r.querySelector("#mm-km")||{}).value||0 }); const jj=Store.myData().journal.find(x=>x.tourId===t.id);
          jj.km=+j.km||+t.lengthKm||0; Store.save(); closeModal();
          openModal({ title:"📖 Élmény mentve", body:`<p class="muted mt0">A(z) <b>${esc(t.title)}</b> élménye az Élménykönyvedben van — a túra véglegesítve.</p>
            <div class="flex" style="gap:.5rem;justify-content:flex-end"><button class="btn btn-ghost" data-close>Kész</button><a class="btn btn-primary" href="#/naplo" data-close-onclick> Megnézem az élményt</a></div>`,
            footer:`<button class="btn btn-primary btn-block" id="mm-view">📖 Megnézem az élményt</button>`,
            onOpen(x){ const go=()=>{ closeModal(); NAV.to("#/naplo"); }; const a=x.querySelector("#mm-view"); if(a)a.onclick=go;
              const b=x.querySelector("[data-close-onclick]"); if(b)b.onclick=(e)=>{e.preventDefault();go();}; } }); };
        if(!files.length){ finalize([]); return; }
        let done=0; const acc=[];
        files.slice(0,6).forEach(f=>{ const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,900/im.width);
            c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext("2d").drawImage(im,0,0,c.width,c.height);
            acc.push(c.toDataURL("image/jpeg",0.62)); if(++done===Math.min(files.length,6)) finalize(acc); }; im.onerror=()=>{ if(++done>=files.length) finalize(acc); }; im.src=rd.result; }; rd.readAsDataURL(f); });
      }; } });
  const mmk=r2=>{};
}
function congratsToursModal(t){
  openModal({ title:"🎉 Gratulálunk!", body:`<p class="muted mt0" style="font-size:1.05rem">Teljesítetted: <b>${esc(t.title)}</b>.</p>
      <p class="muted">Szeretnéd elmenteni ezt az élményt az Élménykönyvedbe? Csillag, egy mondat, fotó — ennyi is elég.</p>`,
    footer:`<div class="flex" style="gap:.5rem;justify-content:flex-end"><button class="btn btn-ghost" id="cg-later">Később</button>
      <button class="btn btn-primary" id="cg-now">📖 Élmény hozzáadása</button></div>`,
    onOpen(r){ r.querySelector("#cg-now").onclick=()=>{ closeModal(); openMemoryEditor(t,true); };
      r.querySelector("#cg-later").onclick=()=>{ closeModal(); toast("A túra Complete maradt — élményt bármikor fűzhetsz hozzá","🎒"); render(); }; } });
}
/* gombokdrótozás a Túráim-listében + a sorok frissítési állapotai */
const _prjDA18 = VIEWS.dash.after;
VIEWS.dash.after = (root)=>{ _prjDA18 && _prjDA18(root);
  try{ const mem=root.querySelector('[data-w="memory"]');
    if(mem){ const d0=Store.myData(); const ms=d0.journal.slice().sort((a,b)=>(b.doneAt||b.date||"").localeCompare(a.doneAt||a.date||"")).slice(0,3);
      if(!d0.journal.length){ mem.innerHTML=`<div class="wpan"><h2 style="font-size:1.2rem">📖 Élménykönyv</h2>
        <p class="small" style="margin:.25rem 0 0">Még nincs elmentett élményed.</p>
        <p class="small muted" style="margin:.15rem 0 .55rem">Az első teljesített túrád után itt őrizheted meg az élményeidet.</p>
        <a class="btn btn-soft btn-sm" href="#/turaim">Teljesítettek</a> <a class="btn btn-ghost btn-sm" href="#/uj-tura">➕ Új túra</a></div>`; }
      else {  // tartalmas widget: teljes tartalom-ujraírás a kártyákkel + Összes élmény
        d0.journal.sort((a,x)=>(x.date||"").localeCompare(a.date||""));
        const top=d0.journal.slice(0,3);
        mem.innerHTML=`<div class="wpan"><h2 style="font-size:1.2rem">📖 Élménykönyv</h2>
          ${top.map(j=>`<a class="mem-mini" href="#/naplo">${j.photos&&j.photos[0]?`<img src="${j.photos[0]}" alt="">`:"🏞️"}
            <span><b>${esc((j.title||"").slice(0,26))}</b><small>${j.rating?`★${j.rating} · `:""}${j.date?fmtDate(j.date):""} · ${j.km||"?"} km${j.mood?" "+j.mood:""}</small></span></a>`).join("")}
          <div style="margin-top:.55rem"><a class="btn btn-soft btn-sm" id="mem-all" href="#/naplo">📖 Összes élmény (${d0.journal.length})</a></div></div>`; } }
  }catch(e){} };
const _prjTourA18 = VIEWS.tours.after;
VIEWS.tours.after = (root)=>{ _prjTourA18 && _prjTourA18(root);
  root.querySelectorAll("[data-openmem]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(b.dataset.openmem); if(t) openMemoryEditor(t); }); };
/* a workspace napló-fül „✓ Teljesítettem” gombja is a gratulálóba fusson */
const _prjWS18 = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id)=>{ _prjWS18 && _prjWS18(root,id); 
  root.querySelectorAll("[data-openmem-ws]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(id); if(t) openMemoryEditor(t); }); };

window.congratsToursModal = congratsToursModal; window.openMemoryEditor = openMemoryEditor;
window.__V42 = 1;


/* ---------- 19) V43: Okos túratervező (smart planner) — aiKitModal új felülírása ---------- */
const spN = x => String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g," ").replace(/[^a-z0-9 ]/g," ").trim();
function smartPlanner(t){
  const d = Store.myData(); ensureTourFields(t);
  const missing=[]; if(!t.date) missing.push("A túra időpontja nincs megadva — az idővonalhoz javasolt időpontokat készítek.");
  if(!(t.coords||t.gpx||t.waypoints) ) missing.push("Az útvonal részletei még hiányoznak.");
  if(!t.weather) missing.push("Időjárási adat jelenleg nem érhető el.");
  const K={ idoter:buildTimeKit(t), csomag:buildGearKit(t), etel:buildFoodKit(t), utazas:buildTravelKit(t), teendok:buildTaskKit(t) };
  const haveG={}, haveF={}, haveT={};
  t.gear.forEach(g=>haveG[spN(g.name)]=1); t.food.forEach(f=>haveF[spN(f.n)]=1); t.tasks.forEach(x=>haveT[spN(x.label)]=1);
  const gearRows=K.csomag.map(g=>{ const ownE=(d.equipment||[]).find(e=>spN(e.name)===spN(g.name)); return Object.assign({ownE},g); });
  const inGear=haveG;
  const routeNorm=x=>String(x||"").toLowerCase();
  let routeMatch=null; const rq=spN(t.title+" "+t.place+" "+t.region);
  let best=0; (typeof TOURS!=="undefined"?TOURS:[]).forEach(c=>{ let sc=0; spN(c.name+" "+c.start.name+" "+c.region).split(" ").forEach(w=>{ if(w.length>3 && rq.includes(w)) sc++; }); if(sc>best){best=sc;routeMatch=c;} });
  if(best<1) routeMatch=null;
  const hasTravelData = (t.cars||[]).length || t.meeting || t.startPoint;
  const budget=(t.budget||[]); const bsum=budget.reduce((a,x)=>a+(+x.amt||0),0);
  const weatherHint = t.weather && (t.weather.rain>=40) ? `<div class="alert-strip"><span>🌧️</span><div>Eső várható (${t.weather.rain}%). Érdemes esőkabátot és vízálló táskavédelmet vinni — ez most csak javaslat.</div></div>` : "";

  openModal({ title:"🤖 Okos túratervező",
    body:`<p class="muted small mt0" id="sp-status">Átnézem a túrád adatait…</p>
      ${missing.length?`<p class="small muted" style="margin:.2rem 0 .6rem">${missing.join(" ")}</p>`:""}
      ${weatherHint}
      <div id="sp-body" style="margin-top:.4rem"></div>`,
    footer:``,
    onOpen(r){
      const body=r.querySelector("#sp-body"); const stat=r.querySelector("#sp-status");
      const STEPS=["Túra adatai","Felszerelés","Étel és víz","Idővonal","Feladatok","Közlekedés"];
      let si=0; stat.innerHTML=STEPS.map((s,i)=>`<span class="sp-step ${i?"":"on"}" data-step="${i}">${i?"·":"▸"} ${s}</span>`).join(" ");
      const tick=setInterval(()=>{ si++; stat.querySelectorAll(".sp-step").forEach((el,i)=>el.classList.toggle("done",i<si)); if(si>=STEPS.length){ clearInterval(tick); renderPanel(); } },90);

      function renderPanel(){
        body.innerHTML=`
        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="idoter" checked> <b>🕐 Idővonal <span class="chip chip-sand">szerkeszthető</span></b></label>
          <div id="sp-time">${K.idoter.map((x,i)=>`<div class="sp-row" data-ti="${i}"><input class="input sp-t" type="time" value="${x.t}"><input class="input sp-l" value="${esc(x.l)}"><button class="icon-btn sp-x" data-tx="${i}" title="Eltávolítás">✕</button></div>`).join("")}</div>
          <button class="btn btn-ghost btn-sm" id="sp-tadd">＋ Időpont</button></section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="pakolas" checked> <b>🎒 Pakolás</b></label>
          ${gearRows.map((g,i)=>{ const have=!!inGear[spN(g.name)];
            return `<div class="sp-row"><span class="sp-ic">${g.icon||"🧰"}</span><span class="sp-n">${esc(g.name)}<small class="muted"> · ${g2kg(g.w)}${g.chkExtra||""}</small>${have?` <span class="chip chip-green">✓ a listában</span>`:(g.ownE?` <span class="chip chip-pine">🎒 saját: ${esc(g.ownE.name)}</span>`:` <span class="chip chip-sand">nincs a táradban</span>`)}</span>
              ${have?`<span class="muted small">—</span>`:(g.ownE?`<button class="btn btn-soft btn-sm" data-gadd="${i}" data-own="1">＋ Saját tárból</button>`:`<button class="btn btn-soft btn-sm" data-gadd="${i}">＋ Pakoláshoz</button>`)}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="etel" checked> <b>💧 Étel és víz <span class="chip chip-sand">javasolt mennyiségek</span></b></label>
          ${K.etel.map((f,i)=>{ const have=!!haveF[spN(f.n)];
            return `<div class="sp-row"><span class="sp-ic">${f.i||"🥫"}</span><span class="sp-n">${esc(f.n)}<small class="muted"> · ~${g2kg(f.w)}</small></span>${have?`<span class="chip chip-green">✓</span>`:`<button class="btn btn-soft btn-sm" data-fadd="${i}">＋ Hozzáadás</button>`}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="task" checked> <b>📋 Feladatok</b></label>
          ${["Időjárás ellenőrzése a túra előtt","Víz és élelem beszerzése","Társak visszaigazolása","Autó / utazás egyeztetése","Indulás előtti felszerelés-ellenőrzés"].map((x,i)=>{ const have=!!haveT[spN(x)];
            return `<div class="sp-row"><span class="sp-n">☐ ${esc(x)}</span>${have?`<span class="chip chip-green">✓ szerepel</span>`:`<button class="btn btn-soft btn-sm" data-tadd="${i}" data-lab="${esc(x)}">＋</button>`}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="kozlekedes" ${hasTravelData?"checked":"disabled"}> <b>🚗 Közlekedés</b></label>
          ${hasTravelData?`<p class="small mb0" style="margin:.2rem 0 .4rem">${t.meeting?("Találkozó: <b>"+esc(t.meeting)+"</b> · "):""}${(t.cars||[]).length?("Autó: "+t.cars.map(c=>esc(c.driver)).join(", ")):""}${t.startPoint?(" · Indulás: "+esc(t.startPoint)):""}</p>
          <p class="small muted mb0">Az Alkalmazás a szabad ülőhelyekre beüli a vissza nem erősített résztvevőket — sofőrt és helyszínt nem talál ki.</p>`:
          `<p class="small mb0" style="margin:.2rem 0 .4rem">🚗 A közlekedés még nincs megtervezve.</p><button class="btn btn-soft btn-sm" id="sp-travel">Tervezem →</button>`}</section>

        <section class="sp-sec"><b>💶 Költségek</b>
          ${budget.length?`<p class="small mb0" style="margin:.2rem 0">Becsült költség a beírt tételeidből: <b>${bsum} €</b> — az összegek a te adataid, nem ajánlások.</p><a class="btn btn-ghost btn-sm" href="#/tura/${t.id}" data-jump="koltseg">Költség-rovat →</a>`:`<p class="small muted mb0" style="margin:.2rem 0">Nincsenek rögzített költségeid. Árat nem találok ki — a Költségek模块ban vezethetsz.</p><button class="btn btn-ghost btn-sm" data-jump="koltseg">Költség-rovat →</button>`}</section>

        ${routeMatch&&!t.coords?`<section class="sp-sec"><b>🧭 Útvonal</b><p class="small" style="margin:.2rem 0">Katalógus-találat: <b>${esc(routeMatch.name)}</b> (${routeMatch.km} km · ⬆${routeMatch.up} m) — koordináták importálása?</p><button class="btn btn-soft btn-sm" id="sp-route">＋ Útvonal beemelése</button></section>`:(t.coords||t.gpx?`<section class="sp-sec"><b>🧭 Útvonal</b> <span class="chip chip-green">✓ beállítva</span></section>`:`<section class="sp-sec"><b>🧭 Útvonal</b> <span class="muted small">nincs katalógus-egyezés — a Térkép/Útvonal modulban adhatod meg.</span></section>`)}

        <div class="flex" style="gap:.5rem;justify-content:flex-end;margin-top:.9rem">
          <button class="btn btn-ghost" data-close>← Még átnézem</button>
          <button class="btn btn-primary" id="sp-apply">✓ Kiválasztottak alkalmazása</button></div>`;
        wire();
      }
      function wire(){
        body.querySelectorAll("#sp-time .sp-x").forEach(b=>b.onclick=()=>{ b.closest(".sp-row").remove(); });
        const ta=body.querySelector("#sp-tadd"); if(ta) ta.onclick=()=>{ const row=document.createElement("div"); row.className="sp-row";
          row.innerHTML=`<input class="input sp-t" type="time" value="12:00"><input class="input sp-l" placeholder="Jelölés"> <button class="icon-btn sp-x">✕</button>`; body.querySelector("#sp-time").appendChild(row); row.querySelector(".sp-x").onclick=()=>row.remove(); };
        body.querySelectorAll("[data-gadd]").forEach(btn=>btn.onclick=()=>{ const i=+btn.dataset.gadd; const g=gearRows[i]; if(!g||inGear[spN(g.name)]||g.__added) return;
          const ownE=g.ownE; t.gear.push({ name:g.name, cat:(ownE&&ownE.cat)||g.cat, icon:g.icon||"🧰", w:ownE?(+ownE.w||g.w):g.w, checked:false, own:!!ownE, note:ownE?"saját tár (okos terv)":"okos terv" });
          g.__added=1; inGear[spN(g.name)]=1; btn.outerHTML=`<span class="chip chip-green">✓ hozzáadva</span>`; Store.save(); });
        body.querySelectorAll("[data-fadd]").forEach(btn=>btn.onclick=()=>{ const f=K.etel[+btn.dataset.fadd]; if(!f||haveF[spN(f.n)]) return;
          t.food.push({id:uidp("fd"),n:f.n,i:f.i,checked:false,w:f.w}); haveF[spN(f.n)]=1; btn.outerHTML=`<span class="chip chip-green">✓</span>`; Store.save(); });
        body.querySelectorAll("[data-tadd]").forEach(btn=>btn.onclick=()=>{ const lab=btn.dataset.lab; if(!lab||haveT[spN(lab)]) return;
          t.tasks.push({id:uidp("tk"),label:lab,done:false,who:null,due:Math.max(1,t.date?Store.dayDiff(t.date):3)}); haveT[spN(lab)]=1; btn.outerHTML=`<span class="chip chip-green">✓</span>`; Store.save(); });
        const rt=body.querySelector("#sp-route"); if(rt) rt.onclick=()=>{ t.coords={lat:routeMatch.start.lat,lng:routeMatch.start.lng}; t.gpx=routeMatch.gpxUrl||null; Store.save(); rt.outerHTML=`<span class="chip chip-green">✓ Útvonal beemelve</span>`; toast("Útvonal importálva a katalógusból","🧭"); };
        const tr=body.querySelector("#sp-travel"); if(tr) tr.onclick=()=>{ closeModal(); wsTab="utazas"; render(); };
        body.querySelectorAll("[data-jump]").forEach(x=>x.onclick=()=>{ closeModal(); wsTab=x.dataset.jump; render(); });
        const ap=body.querySelector("#sp-apply"); if(ap) ap.onclick=()=>{
          const on=k=>{ const el=body.querySelector(`[data-cat="${k}"]`); return el&&el.checked && !el.disabled; };
          let n={};
          if(on("idoter")){ const rows=[...body.querySelectorAll("#sp-time .sp-row")]; const ex=t.timeline.map(x=>(spN(x.t)+spN(x.l)));
            rows.forEach((rw,i)=>{ const tv=rw.querySelector(".sp-t").value, lab=rw.querySelector(".sp-l").value.trim(); if(tv&&lab&&!ex.includes(spN(tv)+spN(lab))){ t.timeline.push({id:uidp("tl"),t:tv,l:lab,ty:"ai"}); }});
            t.timeline.sort((a,b)=>a.t.localeCompare(b.t)); n.idoter=t.timeline.length; }
          if(on("pakolas")){ const before=t.gear.length;
            gearRows.forEach(g=>{ const key=spN(g.name); if(inGear[key]) return; const ownE=g.ownE;
              t.gear.push({name:g.name,cat:(ownE&&ownE.cat)||g.cat,icon:g.icon||"🧰",w:ownE?(+ownE.w||g.w):g.w,checked:false,own:!!ownE,note:ownE?"saját tár (okos terv)":"okos terv"}); });
            n.pakolas=t.gear.length-before; }
          if(on("etel")){ const before=t.food.length; K.etel.forEach(f=>{ if(!haveF[spN(f.n)]){ t.food.push({id:uidp("fd"),n:f.n,i:f.i,checked:false,w:f.w}); haveF[spN(f.n)]=1; } }); n.etel=t.food.length-before; }
          if(on("task")){ const before=t.tasks.length; ["Időjárás ellenőrzése a túra előtt","Víz és élelem beszerzése","Társak visszaigazolása","Autó / utazás egyeztetése","Indulás előtti felszerelés-ellenőrzés"].forEach(lab=>{ if(!haveT[spN(lab)]){ t.tasks.push({id:uidp("tk"),label:lab,done:false,who:null,due:Math.max(1,t.date?Store.dayDiff(t.date):3)}); haveT[spN(lab)]=1; } }); n.task=t.tasks.length-before; }
          if(on("kozlekedes")){ let seats=t.cars.reduce((s,c)=>s+Math.max(0,(c.seats||4)-(c.assigned||[]).length),0);
            const un=t.participants.filter(p=>!p.confirmed&&!t.cars.some(c=>(c.assigned||[]).includes(p.name)));
            if(t.cars.length){ let ci=0; un.forEach(p=>{ while(ci<t.cars.length && (t.cars[ci].assigned||[]).length>= (t.cars[ci].seats||4)) ci++;
              if(ci<t.cars.length){ t.cars[ci].assigned=[...(t.cars[ci].assigned||[]),p.name]; n.kozlekedes=(n.kozlekedes||0)+1; } }); }
            if(!t.meeting && n.kozlekedes) {}/* nem talál ki helyszínt */ }
          if(t.status==="ötlet") t.status="tervezés";
          Store.save(); const r2=Store.readiness(t);
          closeModal(); render();
          toast(`Terv alkalmazva — idővonal:${n.idoter??"✓"} · pakolás +${n.pakolas||0} · étel +${n.etel||0} · feladat +${n.task||0}${n.kozlekedes?" · ülőhely +"+n.kozlekedes:""}. Felkészültség: ${r2.pct}%`,"🤖"); };
      }
    }});
}

aiKitModal = smartPlanner; window.smartPlanner=smartPlanner;
window.__V16PROJECT = 1;
})();
