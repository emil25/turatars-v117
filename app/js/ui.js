/* ============================================================
   TÚRAVAROS — UI SEGÉDFÜGGVÉNYEK (nav, toast, modal, időjárás, térkép)
   ============================================================ */
"use strict";
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const NAV = {
  to(h){ location.hash = h; },
  back(){ history.length>1 ? history.back() : NAV.to("#/vezerlopult"); }
};

/* ---------- DÁTUMOK ---------- */
const fmtDate = (iso, opts={}) => {
  if(!iso) return "dátum nélkül";
  const [y,m,d] = iso.split("-").map(Number);
  if(!m) return iso;
  const s = `${d}. ${MONTHS_HU[m-1]}`;
  return opts.year ? `${y}. ${s}` : s;
};
const fmtDateFull = iso => iso ? fmtDate(iso,{year:true}) : "—";
const dowHU = iso => { const d=new Date(iso+"T12:00:00"); return ["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"][d.getDay()]; };
const relDay = iso => { const dd=Store.dayDiff(iso);
  return dd===0?"_ma":dd===1?"holnap":dd===-1?"tegnap":dd>0?`${dd} nap múlva`:`${-dd} napja`; };

/* ---------- TOAST ---------- */
function toast(msg, ico){
  const el=document.createElement("div"); el.className="toast";
  el.innerHTML = (ico?`<span>${ico}</span>`:"")+esc(msg);
  document.getElementById("toast-root").appendChild(el);
  setTimeout(()=>{ el.style.transition="opacity .3s, transform .3s"; el.style.opacity="0"; el.style.transform="translateY(8px)"; setTimeout(()=>el.remove(),320); }, 2600);
}

/* ---------- MODAL ---------- */
function openModal({title, body, footer, onOpen}){
  closeModal();
  const back=document.createElement("div"); back.className="modal-back"; back.dataset.modal="1";
  back.innerHTML=`<div class="modal" role="dialog" aria-modal="true">
    <div class="modal-h"><h3>${title}</h3><button class="icon-btn" aria-label="Bezárás" data-close>✕</button></div>
    <div class="modal-b">${body}</div>${footer?`<div class="modal-b" style="padding-top:0">${footer}</div>`:""}</div>`;
  back.addEventListener("click", e=>{ if(e.target===back || e.target.closest("[data-close]")) closeModal(); });
  document.getElementById("modal-root").appendChild(back);
  onOpen && onOpen(back);
}
function closeModal(){ document.querySelectorAll("[data-modal]").forEach(m=>m.remove()); }
function confirmDlg(txt, yesLabel, onYes){
  openModal({ title:"Biztos vagy benne?",
    body:`<p class="muted mt0">${esc(txt)}</p>`,
    footer:`<div class="flex" style="justify-content:flex-end"><button class="btn btn-ghost btn-sm" data-close>Mégse</button><button class="btn btn-danger btn-sm" id="cfm-yes">${esc(yesLabel||"Törlés")}</button></div>`,
    onOpen: root => root.querySelector("#cfm-yes").onclick = ()=>{ closeModal(); onYes(); } });
}

/* ---------- chipjeK ---------- */
const diffChip = d => `<span class="diff diff-${DIFFS[d]||"konywu"}">${esc(d)}</span>`;
const statusChip = s => s==="teljesítve" ? `<span class="chip chip-green">✓ Teljesítve</span>`
  : s==="jelentkezve" ? `<span class="chip chip-ember">🎫 Jelentkezve</span>` : `<span class="chip chip-blue">✎ Tervezés alatt</span>`;
const tourMeta = t => `<div class="meta">
  <span>📏 <b>${t.lengthKm||"?"} km</b></span><span>⏱ <b>${t.durationH||"?"} óra</b></span>
  <span>⬆ <b>${t.ascent||"?"} m</b></span>${t.date?`<span>📅 <b>${fmtDate(t.date)}</b></span>`:""}</div>`;

/* ---------- EMBER INIT (fej, háttér név, mobil bottom-nagytáv) ---------- */
function initials(n){ return (n||"?").split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase(); }

const WCODE = { 0:["Napsütéses","☀️"],1:["Napos, felhős","🌤"],2:["Napos, némi felhő","🌤"],3:["Borult","☁️"],
 45:["Ködös","🌫"],48:["Ködös","🌫"],51:["Szitálás","🌦"],53:["Enyhe eső","🌦"],55:["Esős","🌧"],
 61:["Enyhe eső","🌧"],63:["Eső","🌧"],65:["Heves eső","🌧"],66:["Fagyos eső","🌧"],67:["Jégeső","🌧"],
 71:["Enyhe hó","🌨"],73:["Havazás","🌨"],75:["Heves hó","❄️"],80:["Váltoékony zápor","🌦"],81:["Zápor","🌧"],
 82:["Heves zápor","⛈"],95:["Vihar","⛈"],96:["Vihar jéggel","⛈"],99:["Vihar jéggel","⛈"] };

const Weather = (()=>{ const cache={};
  async function get(lat,lng,dateISO){
    if(!lat||!lng) return null;
    const key=`${lat.toFixed(2)},${lng.toFixed(2)}`;
    try{
      if(!cache[key]){
        const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto&forecast_days=14`);
        if(!r.ok) throw 0; const j=await r.json(); cache[key]=j;
      }
      const j=cache[key]; let i = j.daily.time.indexOf(dateISO);
      if(i<0){ const dd = Store.dayDiff(dateISO); if(dd>=0 && dd<j.daily.time.length) i=dd; else i=0; }
      const code=j.daily.weather_code[i];
      return { day:j.daily.time[i], max:j.daily.temperature_2m_max[i], min:j.daily.temperature_2m_min[i],
        rain:j.daily.precipitation_probability_max[i]||0, label:(WCODE[code]||["—","🌡"])[0], icon:(WCODE[code]||["—","🌡"])[1] };
    }catch(e){ return null; }
  }
  return { get };
})();

/* ---------- LEAFLET TÉRKÉP ---------- */
const MapKit = {
  defaults:{ center:[46.70,24.90], zoom:6 },
  make(el, opts={}){
    if(!window.L){ el.innerHTML=`<div class="empty" style="padding:2rem">A térkép betöltése nem sikerült (nincs internetkapcsolat). A funkciók többi része továbbra is működik.</div>`; return null; }
    const m = L.map(el, { scrollWheelZoom: opts.scroll!==false, attributionControl:true }).setView(opts.center||this.defaults.center, opts.zoom!=null?opts.zoom:this.defaults.zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:"© OpenStreetmapdata"}).addTo(m);
    return m;
  },
  pin(m, lat, lng, cls, html){
    if(!m||!L) return;
    L.marker([lat,lng],{icon:L.divIcon({className:"",html:`<div class="pin-dot ${cls}" style="width:16px;height:16px"></div>`,iconSize:[16,16],iconAnchor:[8,8]})})
      .addTo(m).bindPopup(`<div class="map-pop">${html}</div>`);
  },
  fit(m, pts){ if(m&&L&&pts.length) m.fitBounds(L.latLngBounds(pts.map(p=>[p.lat,p.lng])).pad(.25)); }
};

/* ---------- KÖZÖS FEJLÉCKEZELÉS ---------- */
function renderHeader(){
  const u = Store.me();
  const h = document.getElementById("site-header");
  const route = location.hash||"#/";
  h.style.display = (typeof isDashRoute==="function" && isDashRoute(route)) ? "none" : "";
  const link=(href,label)=>`<a href="${href}" class="${route===href?"on":""}">${label}</a>`;
  h.innerHTML = `<nav class="pub-nav"><div class="wrap">
    <a class="logo" href="#/" aria-label="Túratárs — Kezdőlap">
      <img class="brand-logo" src="./icons/brand-logo.png" alt="Túratárs"></a>
    <div class="pub-links">${link("#/","Kezdőlap")}${link("#/felfedezes","Felfedezés")}${link("#/esemenyek","Események")}${link("#/helyek","Helyek")}${link("#/szervezoknek","Szervezőknek")}</div>
    <div class="pub-cta" style="margin-left:auto">
      ${u ? `<button class=" icon-btn" id="bell-btn" aria-label="Értesítések" style="position:relative">🔔${notifCount()>0?`<span style="position:absolute;top:-2px;right:-2px;background:var(--ember);color:#fff;font-size:.62rem;font-weight:700;border-radius:999px;min-width:16px;height:16px;display:grid;place-items:center">${notifCount()}</span>`:""}</button>`:""}
      ${u ? `<a class="userchip" href="#/vezerlopult">Szia, <b>${esc((u.name||"").split(" ")[0]||"útitárs")}</b> 🥾</a>`
          : `<a class="btn btn-ghost btn-sm" href="#/belepes">Bejelentkezés</a>
             <a class="btn btn-primary btn-sm" href="#/regisztracio">Regisztráció</a>`}
    </div></div></nav>`;
  const bell=document.getElementById("bell-btn");
  if(bell) bell.onclick=()=>renderNotifPanel(bell);
}
function notifCount(){ const u=Store.me(); return u ? Store.notifications().length : 0; }
function renderNotifPanel(btn){
  if(!Store.me()) return;
  const list=Store.notifications();
  openModal({ title:"Értesítéseim",
    body: list.length? `<div class="ntable">${list.map(n=>`
      <div class="nrow" data-nid="${n.id}"><span class="nic">${n.icon}</span>
        <div style="flex:1"><div>${esc(n.text)}</div>${n.link?`<a class="small" style="color:var(--sky);font-weight:600" href="${n.link}" data-close>Megnyitás →</a>`:""}</div>
        <button class="icon-btn" style="width:28px;height:28px;font-size:.7rem" data-dismiss="${n.id}" aria-label="Elvetés">✕</button></div>`).join("")}</div>`
      : `<div class="center muted" style="padding:1.5rem 0">Minden rendben — nincs figyelmeztetés.<br>🌿 Az ösvények pihennek — irányt adva!</div>` });
  document.querySelectorAll("[data-dismiss]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); Store.dismissNotif(b.dataset.dismiss); closeModal(); toast("Értesítés elvetve"); });
}
const btn_nav_open = "Megnyitás →";

/* Mobil felső sáv + alsó nav (dashboard nézetekben) */
function renderMobileNav(){
  const u=Store.me(); const root=document.getElementById("mobile-nav-root"); if(!u){ root.innerHTML=""; return; }
  const r=location.hash||"#/";
  const it=(h,ico,label,cls="")=>`<a class="mb-item ${r.startsWith(h)?"on":""} ${cls}" href="${h}"><span class="mi">${ico}</span>${label}</a>`;
  const isDash = isDashRoute(r) || r.startsWith("#/tura/");
  if(!u || (!isDash && !["#/","#/felfedezes","#/esemenyek","#/helyek"].includes(r))){ root.innerHTML=""; return; }
  root.innerHTML = `<div class="m-bottom-nav" aria-label="Mobil navigáció">
    <a class="mb-item ${r==="#/vezerlopult"||r==="#/"?"on":""}" href="#/vezerlopult"><span class="mi">🏠</span>Kezdőlap</a>
    ${it("#/felfedezes","🧭","Felfedezés")}
    <a class="mb-item plus" href="#/uj-tura"><span class="mi">+</span>Új túra</a>
    ${it("#/naptar","📅","Naptár")}
    ${it("#/profil","👤","Profil")}
  </div>`;
}

/* --- Platform badge eltüntetele (a mi UI-nkat nem érinti) --- */
function stripPlatformBadge(){ try{
  const bad=/created with|create your website|\bqwenwork\b|chatgpt\.site/i;
  document.querySelectorAll("body > *").forEach(el=>{
    if(["site-header","toast-root","modal-root","app"].includes(el.id)) return;
    const tg=el.tagName; if(tg==="SCRIPT"||tg==="STYLE"||tg==="LINK"||tg==="META"||tg==="NOSCRIPT") return;
    const txt=(el.textContent||"").slice(0,240);
    const hr=el.querySelector && el.querySelector("a") ? (el.querySelector("a").getAttribute("href")||"") : "";
    if(bad.test(txt)||bad.test(hr)){ el.style.setProperty("display","none","important"); el.setAttribute("data-badge-hidden","1"); }
  });
}catch(e){} }
new MutationObserver(()=>{ if(window.__bt) return; window.__bt=setTimeout(()=>{ window.__bt=0; stripPlatformBadge(); },250); })
  .observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("load", stripPlatformBadge);

(function(){ const boot=()=>{ try{ if(window.Store&&Store.applyTheme) Store.applyTheme(); }catch(e){} }; if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot(); })();
const DASH_ROOTS=["vezerlopult","turaim","uj-tura","tura","naptar","bakancslista","felszereles","csapatok","naplo","statisztikak","ai","terkep","ertesitesek","beallitasok","profil"];
const isDashRoute = r => DASH_ROOTS.some(x=>r.startsWith("#/"+x));
