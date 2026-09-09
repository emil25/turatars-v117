/* ============================================================
   TÚRAVAROS — DASHBOARD: shell, áttekintés, túráim, új túra, naptár
   ============================================================ */
"use strict";

/* ---------- DASHBOARD SHELL ---------- */
const SIDE = [
  ["#/vezerlopult","🏠","Áttekintés"], ["#/turaim","🥾","Túráim"], ["#/uj-tura","➕","Új túra"], ["#/inbox","📥","Inbox"],
  ["#/naptar","📅","Túranaptár"], ["#/felfedezes","🗺️","Felfedezés"], ["#/esemenyek","📅","Túraesemények"], ["#/profil","👤","Saját profil"], ["#/szervezo","🏢","Szervezői központ"], ["#/bakancslista","❤️","Bakancslista"], ["#/tarsak","👥","Túratársak"],
  ["#/felszereles","🎒","Felszerelésem"], ["#/csapatok","👥","Túracsapatok"], ["#/naplo","📖","Túranapló"], ["#/csapat","👥","Csapat állapota"], ["#/terepi","🌍","Terepi infók"], ["#/sablonok","📐","Túrasablonok"],
  ["#/statisztikak","📊","Statisztikák"], ["#/ai","🤖","AI Túratervező"], ["#/terkep","🧭","Saját térkép"], ["#/hagymas","🕹","Hagymás útvonalak"], ["#/szatt","🏔","SZATT 2026"],
  ["#/beallitasok","⚙️","Beállítások"]
];
function sideBadge(h){ try{ const d=Store.myData(); const show=(n)=>n?`<span class="badge">${n>99?"99+":n}</span>`:"";
  if(h==="#/turaim") return show(d.tours.length);
  if(h==="#/bakancslista") return show(d.wishlist.length);
  if(h==="#/inbox"){ const u=(d.inbox||[]).filter(x=>!x.read).length; return show(u); }
  if(h==="#/felszereles") return show(d.equipment.filter(x=>x.has).length);
  if(h==="#/csapatok") return show((d.teams||[]).length);
  if(h==="#/naplo") return show(d.journal.length);
  if(h==="#/utvonalak") return show((d.routes||[]).length);
  return ""; }catch(e){ return ""; } }

function dash(active){
  document.body.classList.add("in-dash");
  const u = Store.me();
  if(!u) { location.hash="#/belepes"; return ""; }
  if(!u.onboarded && location.hash!=="#/onboarding") { location.hash="#/onboarding"; return ""; }
  const n = Store.notifications().length;
  return inner => `<div class="dash">
    <aside class="dash-side" aria-label="Vezérlőpult navigáció">
      <a class="logo" href="#/" style="padding:.3rem .75rem .9rem">
        <img class="brand-logo" src="./icons/brand-logo.png" alt="Túratárs"></a>
      <div class="nav-group"><div class="ng-label">Tervezés</div>
        ${SIDE.filter(s=>["#/vezerlopult","#/turaim","#/uj-tura","#/naptar","#/felfedezes","#/esemenyek"].includes(s[0]))
          .map(([h,i,l])=>`<a class="side-link ${active===h?"on":""}" href="${h}"><span class="ico">${i}</span>${l}${sideBadge(h)}</a>`).join("")}</div>
      <div class="nav-group"><div class="ng-label">Személyes</div>
        ${SIDE.filter(s=>["#/bakancslista","#/tarsak","#/felszereles","#/csapatok","#/utvonalak","#/naplo","#/csapat","#/terepi","#/sablonok","#/terkep","#/hagymas","#/szatt"].includes(s[0]))
          .map(([h,i,l])=>`<a class="side-link ${active===h?"on":""}" href="${h}"><span class="ico">${i}</span>${l}${sideBadge(h)}</a>`).join("")}</div>
      <div class="nav-group"><div class="ng-label">Tudás és segítség</div>
        ${SIDE.filter(s=>["#/profil","#/szervezo","#/statisztikak","#/ai","#/beallitasok"].includes(s[0]))
          .map(([h,i,l])=>`<a class="side-link ${active===h?"on":""}" href="${h}"><span class="ico">${i}</span>${l}${sideBadge(h)}</a>
            ${h==="#/beallitasok"&&n?`<a class="side-link" href="#/ertesitesek"><span class="ico">🔔</span>Értesítések<span class="badge">${n}</span></a>`:""}`).join("")}
      </div>
    </aside>
    <div class="dash-main">${inner}</div></div>`;
}

/* ---------- ÁTTEKINTÉS ---------- */
VIEWS.dash = () => {
  const u = Store.me(), d = Store.myData(), st = Store.stats();
  const next = Store.upcoming()[0];
  const needs = Store.needs();
  const evNext = (EVENTS.concat(window.e2Events?window.e2Events():[])).filter(e=>d.savedEvents.includes(e.id) && (!e.date || e.date>=Store.todayISO())).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'))[0];
  const m = todayMonthStats();
  const hour = new Date().getHours();
  const greet = hour<10?"Jó reggelt":hour<18?"Szép napot":"Kellemes estét";
  const recs = recommendFor(u);
  return dash("#/vezerlopult")(`
    <div class="dash-top">
      <div><div class="hello">${greet}, ${hour<10||hour>=18?"🌙":"🌤"} · ${fmtDateFull(Store.todayISO())}</div>
        <h1>Szia, ${esc((u.name||"útitárs").split(" ")[0])}! Merre kalandozunk legközelebb? 🥾</h1></div>
      <a class="btn btn-ember" href="#/uj-tura">➕ Új túra tervezése</a>
    </div>

    ${next ? `<div class="nextbox" style="margin-bottom:20px">
      <div class="split2" style="grid-template-columns:1.3fr .7fr;gap:24px">
        <div>
          <div class="nb-label">Következő túrád · ${fmtDateFull(next.date)} (${dowHU(next.date).slice(0,3)})</div>
          <h3 style="margin-bottom:.3rem">${esc(next.title)}</h3>
          <p class="small" style="color:#c3dcc6;margin-bottom:.9rem">📍 ${esc(next.place||next.region)} · 📏 ${next.lengthKm} km · ⏱ ${next.durationH} ó · ⬆ ${next.ascent} m ${diffChip(next.difficulty)}</p>
          ${needs.length?`<b class="small" style="color:#9ec6a5;letter-spacing:.1em;text-transform:uppercase">${needs.length} teendő hátra:</b>
          <ul>${needs.map((x,i)=>`<li><span class="n">${i+1}</span><a href="${x.href}" class="nb-need">${esc(x.label)}</a>
            <span style="margin-left:auto;opacity:.7;font-size:.85rem">→</span></li>`).join("")}</ul>`
           : `<ul><li><span class="n">✓</span>Minden teendő kész — csak indulni kell! 🎉</li></ul>`}
        </div>
        <div style="position:relative">
          <div class="img-wrap" style="height:100%;min-height:150px;border-radius:16px">${imgTag(next.img,next.title)}</div>
          <a class="btn btn-primary btn-sm" style="position:absolute;bottom:10px;left:10px;background:#fff;color:var(--pine)" href="#/tura/${next.id}">Túramunkaterület megnyitása →</a>
        </div></div>
      <div id="overview-weather" style="margin-top:.9rem"></div>
    </div>`: `<div class="card panel" style="margin-bottom:20px">
      <h3>Még nincs tervezett túrád</h3><p class="muted">Induljuk el az elsőt — pár kattintás, és a rendszer összeállítja az időtervet, a felszereléslistát és az ételvízlistát.</p>
      <a class="btn btn-primary" href="#/uj-tura">➕ Első túram tervezése</a></div>`}

    <div class="grid g4 smm2" style="margin-bottom:20px">
      <div class="card stat-tile"><span class="st-ic">🥾</span><b>${d.tours.filter(t=>t.status==="tervezés"||t.status==="jelentkezve").length}</b><span>tervezett túra</span></div>
      <div class="card stat-tile"><span class="st-ic">🎫</span><b>${evNext?fmtDate(evNext.date).replace(". ",". "):"—"}</b><span>következő esemény${evNext?` · ${evNext.name.split(" ").slice(0,2).join(" ")}`:""}</span></div>
      <div class="card stat-tile"><span class="st-ic">✅</span><b>${Store.needs().length}</b><span>függőben lévő teendő</span></div>
      <div class="card stat-tile"><span class="st-ic">📏</span><b>${m.km} km</b><span>a hónap eddig (${m.tours} túra)</span></div>
    </div>

    <h2 style="font-size:1.25rem">Gyors indítás</h2>
    <div class="qa-grid" style="margin-bottom:26px">
      <a class="quickact" href="#/uj-tura"><span class="qi">🗓️</span><b>Új túra tervezése</b><span>Időterv, csomaglista, résztvevők</span></a>
      <a class="quickact" href="#/felfedezes"><span class="qi">🗺️</span><b>Túra felfedezése</b><span>${TOURS.length} útvonal a térképen</span></a>
      <a class="quickact" href="#/esemenyek"><span class="qi">🎪</span><b>Esemény keresése</b><span>Vezetett és napkelte túrák</span></a>
      <a class="quickact" href="#/bakancslista"><span class="qi">❤️</span><b>Bakancslista</b><span>${d.wishlist.length} hely vár rád</span></a>
    </div>

    <div class="grid" style="grid-template-columns:1.25fr .75fr;align-items:start">
      <div>
        <h2 style="font-size:1.25rem">Neked ajánlott túrák <span class="small muted" style="font-weight:400">a preferenciáid alapján</span></h2>
        <div class="grid g2">${recs.length?recs.map(t=>`<a class="card tcard" href="#/turak/${t.id}" style="text-decoration:none">
          <div class="img-wrap" style="height:130px">${imgTag(t.img,t.name)}<span class="rate">${t.rating}★</span></div>
          <div class="tbody"><span class="region">${esc(t.region)} · ${esc(t.diff)}</span><h3 style="font-size:1rem">${esc(t.name)}</h3>
          <div class="meta"><span>📏 ${t.km} km</span><span>⏱ ${t.h} ó</span></div></div></a>`).join(""):`
          <div class="empty" style="grid-column:1/-1"><span class="em-ico">🌿</span>Válasz az onbard kérdéseire, és személyre szabjuk az ajánlásokat.</div>`}</div>
      </div>
      <div>
        <h2 style="font-size:1.25rem">Naptár <span class="small"><a href="#/naptar" style="color:var(--sky);font-weight:600">→</a></span></h2>
        <div id="mini-cal"></div>
        ${evNext?`<div class="card panel" style="margin-top:14px"><span class="chip chip-ember">${esc(evNext.cat)}</span>
          <div style="margin-top:.5rem"><b>${esc(evNext.name)}</b></div><div class="meta"><span>📅 ${fmtDateFull(evNext.date)}</span><span>📍 ${esc(evNext.place)}</span></div></div>`:""}
        ${d.tours.some(t=>t.status==="tervezés"&&t.date<Store.todayISO())||d.tours.some(t=>t.status==="teljesítve"&&!d.journal.some(j=>j.tourId===t.id))
        ?`<div class="card panel" style="margin-top:14px;border-color:#f2d3b3;background:var(--ember-soft)">
          <b class="small warn-ic">⚠ Lejárt vagy naplózandó túrák</b>
          <p class="small" style="margin:.3rem 0 .6rem">Van múlt dátumú vagy még naplózandó túrád — nézd át a listát.
          </p><a href="#/turaim" class="btn btn-sm btn-ember" style="display:inline-block">Túráim átnézése</a></div>`:""}
      </div>
    </div>`);
};
function todayMonthStats(){
  const d=Store.myData(); const m=Store.todayISO().slice(0,7);
  const js=d.journal.filter(j=>(j.date||"").startsWith(m));
  return {km:Math.round(js.reduce((s,j)=>s+(+j.km||0),0)), tours:js.length};
}
function recommendFor(u){
  const p = (u&&u.prefsOnb)||{};
  const typeTag = {"Rövid séták":"kezdőknek","Hegyi túrák":"erdő","Csúcstúrák":"csúcs","Családi túrák":"family","Többnapos túrák":"többnapos","Fotós túrák":"kilátás"};
  const radius = { "20 km":0, "50 km":1, "100 km":2, "Mindegy":3 }[p.radius] ?? 3;
  const home = (u&&u.city)||"";
  const regionBonus = { "csíkszereda":"Csíki","csíksz":"Csíki","gyimes":"Csíki","keresztúr":"Csíki","udvarhely":"Hargita","brassó":"Hargita","sepsi":"Hargita","gyergyó":"Gyergyó","szentmiklós":"Gyergyó","kolozsvár":"Kolozs","torda":"Erdélyi-karszt","vasarhely":"Kolozs","d[ée]va":"Hunyad" };
  let rr = null; for(const k in regionBonus) if(home.toLowerCase().includes(k)) rr = regionBonus[k];
  const d = Store.myData(); const have = new Set(d.tours.map(t=>t.title));
  return TOURS.filter(t=>!have.has(t.name))
    .map(t=>({t, s:(p.types||[]).reduce((a,x)=>a+(t.tags.includes(typeTag[x])?1.5:0),0)
      + (p.diff&&t.diff===p.diff?1:0)
      + (rr&&t.region.includes(rr.split(" ")[0])?2:0)
      + (radius>=2&&t.h<=6?1:0) + (radius<=1&&t.h<=3.5?1:0) + (t.rating-4.5)*3}))
    .sort((a,b)=>b.s-a.s).slice(0,4).map(x=>x.t);
}
VIEWS.dash.after = (root) => {
  // mini naptár
  const mc = root.querySelector("#mini-cal"); if(mc) renderCalendar(mc, {mini:true});
  // teendők linkjei a workspace megfelelő fülére
  root.querySelectorAll(".nb-need").forEach(a=>a.onclick=e=>{ e.preventDefault();  });
  // időjárás a következő túrára
  const w = root.querySelector("#overview-weather");
  const t0 = Store.upcoming()[0];
  if(w && t0 && t0.coords){
    w.innerHTML = `<div class="small muted">⏳ Időjárás ellenőrzése: ${esc(t0.place)}…</div>`;
    Weather.get(t0.coords.lat,t0.coords.lng,t0.date).then(r=>{
      if(!r){ w.innerHTML=""; return; }
      const wet = r.rain>=50;
      w.innerHTML = `<div class="${wet?"alert-strip":"small"}" style="${wet?"":"color:var(--bark-soft)"}">${wet?"🌧️ <b>IDŐJÁRÁS-FIGYELMEZTETÉS:</b>":"🌤"} ${fmtDate(t0.date)} — ${esc(r.label)}, ${Math.round(r.min)}–${Math.round(r.max)} °C, esély esőre: <b>${r.rain}%</b>. ${wet?"Vigyél esőkabátot és vízálló borítást!":"Jó úton jársz."}</div>`;
    });
  } else if(w) w.innerHTML="";
};

/* ---------- TÚRÁIM ---------- */
let tourTab = "tervezés";
VIEWS.tours = () => {
  const d = Store.myData();
  const groups = { otletek: d.tours.filter(t=>t.status==="ötlet"||t.status==="bakancs"), tervezés: d.tours.filter(t=>t.status==="tervezés"), jelentkezve: d.tours.filter(t=>t.status==="jelentkezve"), teljesitve: d.tours.filter(t=>t.status==="teljesítve"||t.status==="archiválva"), "teljesítve": [] };
  const list = (groups[tourTab]||[]).slice().sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
  return dash("#/turaim")(`
    <div class="dash-top"><div><h1>Túráim 🥾</h1><div class="hello">Minden terved, munkaterületed és teljesítésed egy helyen.</div></div>
      <a class="btn btn-primary" href="#/uj-tura">➕ Új túra</a></div>
    <div class="tabs" role="tablist">
      ${Object.entries({ otletek:"💡 Ötletek / bakancslista", tervezés:"🟡 Tervezés alatt", jelentkezve:"🎫 Eseményekre jelentkezve", teljesitve:"✓ Teljesítve / archív"}).map(([k,l])=>
        `<button class="${tourTab===k?"on":""}" data-tab="${k}">${l} <span class="muted">(${groups[k].length})</span></button>`).join("")}
    </div>
    ${list.length?`<div class="grid" id="tour-list">${list.map(tourRow).join("")}</div>`:
    `<div class="empty"><span class="em-ico">${tourTab==="teljesítve"?"📖":"🌲"}</span>
      <h3>${tourTab==="tervezés"?"Nincs még tervezett túrád":tourTab==="jelentkezve"?"Nincs mentett eseményed":"Még nincs teljesített túra"}</h3>
      <p>${tourTab==="tervezés"?"Tervezz egy túrát — a többi részt a rendszer átveszi tőled.":tourTab==="jelentkezve"?"Az Események oldalon egy kattintással mentheted a saját túráid közé.":"Ha letelt egy túra, a Teljesítettem gombbal máris naplózhatod."}</p>
      <a class="btn btn-primary" href="${tourTab==="jelentkezve"?"#/esemenyek":"#/uj-tura"}">${tourTab==="jelentkezve"?"Események böngészése":"➕ Új túra"}</a></div>`}`);
};
function tourRow(t){
  const st = t.status==="teljesítve";
  return `<div class="card tour-row">
    <a class="img-wrap" style="height:92px;border-radius:12px" href="#/tura/${t.id}">${imgTag(t.img||IMG.erdo,t.title)}</a>
    <div>
      <div class="meta" style="gap:.4rem .7rem">${statusChip(t.status)}${t.difficulty?diffChip(t.difficulty):""}${t.eventCat?`<span class="chip chip-sand">${esc(t.eventCat)}</span>`:""}</div>
      <h3 style="margin:.3rem 0 .1rem;font-size:1.08rem"><a href="#/tura/${t.id}">${esc(t.title)}</a></h3>
      <div class="meta"><span style="font-size:.83rem">📍 ${esc(t.region||t.place||"nincs hely")} · 📅 ${t.date?fmtDateFull(t.date):"dátum nélkül"}</span></div>
      <div class="meta" style="font-size:.82rem"><span>📏 ${t.lengthKm||"?"} km</span><span>⏱ ${t.durationH||"?"} ó</span><span>⬆ ${t.ascent||"?"} m</span></div>
    </div>
    <div class="tr-actions">
      <a class="btn btn-soft btn-sm" href="#/tura/${t.id}">Megnyitás</a>
      ${(t.status==="ötlet"||t.status==="bakancs")?`<button class="btn btn-ember btn-sm" data-promote="${t.id}">📅 Túra tervezése</button>`:""}
      ${(t.status==="tervezés"||t.status==="jelentkezve")&&Store.dayDiff(t.date)<=3?`<a class="btn btn-primary btn-sm" href="#/turamod/${t.id}">⚡ Túra mód</a>`:""}
      ${!st?`<button class="btn btn-ghost btn-sm" data-complete="${t.id}">✓ Teljesítettem</button>`:
        `${(window.memBtn&&window.memBtn(t))||'<a class="btn btn-ghost btn-sm" href="#/naplo">📖 Napló</a>'}`}
      <button class="icon-btn" data-del="${t.id}" title="Törlés" aria-label="${esc(t.title)} törlése">🗑</button>
    </div></div>`;
}
VIEWS.tours.after = root => {
  root.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{tourTab=b.dataset.tab; render();});
  wireTourActions(root);
};
function wireTourActions(root){
  root.querySelectorAll("[data-promote]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(b.dataset.promote);
    Store.setStatus(t.id,"tervezés"); if(!t.date) t.date=Store.addDays(Store.nextSatDate(),7), Store.save(); toast("Tervezés alatt — a teendőlisták életbe léptek.","📅"); render(); });
  root.querySelectorAll("[data-complete]").forEach(b=>b.onclick=()=>{
    const t=Store.getTour(b.dataset.complete);
    openModal({ title:`${esc(t.title)} — teljesítetted? ⛰️`,
      body:`<p class="muted mt0">Ha igen, felkerül a túranaplódba a dátummal, távolsággal és képekkel — csak pár kattintás.</p>
        <label class="f">Értékelés</label><div id="rate-stars" style="font-size:1.7rem;color:var(--ember);display:flex;gap:.2rem">
        ${[1,2,3,4,5].map(i=>`<button data-star="${i}" style="background:none;border:0;cursor:pointer;color:#cfcabb" aria-label="${i} csillag">★</button>`).join("")}</div>
        <label class="f" style="margin-top:.7rem">Jegyzet</label><textarea class="input" id="j-note" placeholder="Pl. Gyönyörű idő volt. A felső rész sáros volt, de megérte."></textarea>`,
      footer:`<div class="flex" style="justify-content:flex-end;gap:.5rem"><button class="btn btn-ghost btn-sm" data-close>Mégsem</button><button class="btn btn-primary" id="do-complete">✓ Kész — naplóba</button></div>`,
      onOpen(r){ let stars=5; const draw=()=>r.querySelectorAll("[data-star]").forEach(s=>s.style.color=s.dataset.star<=stars?"var(--ember)":"#cfcabb");
        r.querySelectorAll("[data-star]").forEach(s=>s.onclick=()=>{stars=+s.dataset.star;draw()}); draw();
        r.querySelector("#do-complete").onclick=()=>{ Store.completeTour(t.id, stars, r.querySelector("#j-note").value, []);
          closeModal(); render(); if(window.congratsToursModal) congratsToursModal(t); }; }});
  });
  root.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{
    const t=Store.getTour(b.dataset.del);
    confirmDlg(`A(z) ${t.title} túra minden adata (időterv, lista, napló) törlődik.`, "Törlés", ()=>{ Store.deleteTour(t.id); toast("Túra törölve.","🗑"); render(); });
  });
}

/* ---------- TÚRANAPTÁR (havi) ---------- */
let calDate = new Date();
VIEWS.calendar = () => dash("#/naptar")(`
  <div class="dash-top"><div><h1>Túranaptár 📅</h1><div class="hello">Tervezett túráid, mentett eseményeid és teljesítéseid egy tekintetre.</div></div>
  <a class="btn btn-primary" href="#/uj-tura">➕ Új túra</a></div>
  <div class="legend"><span><i style="background:#2C6E9B"></i>Tervezett túra</span><span><i style="background:#E07A2F"></i>Esemény</span><span><i style="background:#3E8E5F"></i>Teljesített</span><span><i style="background:#C94F4F"></i>Bakancslista</span></div>
  <div id="cal-mount"></div>`);
VIEWS.calendar.after = root => renderCalendar(root.querySelector("#cal-mount"), {});

function renderCalendar(mount, opt){
  if(!mount) return;
  const d = Store.myData(); if(!d){ return; }
  const view = calDate; const y=view.getFullYear(), mo=view.getMonth();
  const first = new Date(y,mo,1); const start = (first.getDay()+6)%7; // hétfővel indul
  const daysIn = new Date(y,mo+1,0).getDate();
  const iso = (i)=>`${y}-${String(mo+1).padStart(2,"0")}-${String(i).padStart(2,"0")}`;
  const cells=[]; for(let i=1;i<=daysIn;i++) cells.push(iso(i));
  const mini = !!opt.mini;
  const monthLabel = `${MONTHS_HU[mo]} ${y}`;
  mount.innerHTML = `
    ${mini?``:`<div class="cal-head"><button class="icon-btn" id="cal-prev" aria-label="Előző hónap">←</button>
      <h2 style="text-transform:capitalize">${monthLabel}</h2>
      <button class="icon-btn" id="cal-next" aria-label="Következő hónap">→</button>
      <button class="btn btn-soft btn-sm" id="cal-today" style="margin-left:.4rem">Ma</button></div>`}
    ${mini?`<div class="between" style="margin-bottom:.4rem"><b style="text-transform:capitalize">${monthLabel}</b><span class="small"><a href="#/naptar" style="color:var(--sky);font-weight:600">Teljes naptár →</a></span></div>`:""}
    <div class="cal-grid" role="grid">${[...DOW_HU,...DOW_HU].slice(0,7).map(x=>`<div class="cal-dow">${x}</div>`).join("")}
    ${Array(start).fill("<div class='cal-cell other'></div>").join("")}
    ${cells.map(isoD=>{
      const [,,dd]=isoD.split("-"); const tnum=+dd;
      const plans = d.tours.filter(t=>t.date===isoD && t.status!=="teljesítve");
      const dones = d.tours.filter(t=>t.date===isoD && t.status==="teljesítve");
      const evs = (EVENTS.concat(window.e2Events?window.e2Events():[])).filter(e=>isoD===e.date && d.savedEvents.includes(e.id));
      const today = isoD===Store.todayISO();
      return `<div class="cal-cell ${today?"today":""}" data-date="${isoD}" title="${esc(plans[0]?plans[0].title:"")}" tabindex="0" role="button">
        <span class="dno">${tnum}</span>
        ${plans.slice(0,2).map(t=>`<span class="cal-pill cp-plan">🥾 ${esc(t.title)}</span>`).join("")}
        ${evs.slice(0,1).map(e=>`<span class="cal-pill cp-event">🎫 ${esc(e.name)}</span>`).join("")}
        ${dones.slice(0,1).map(t=>`<span class="cal-pill cp-done">✓ ${esc(t.title)}</span>`).join("")}
        ${plans.length+evs.length+dones.length>3?`<span class="more">+${plans.length+evs.length+dones.length-3} több</span>`:""}</div>`;
    }).join("")}</div>`;
  if(!mini){
    mount.querySelector("#cal-prev").onclick=()=>{ calDate=new Date(y,mo-1,1); render(); };
    mount.querySelector("#cal-next").onclick=()=>{ calDate=new Date(y,mo+1,1); render(); };
    mount.querySelector("#cal-today").onclick=()=>{ calDate=new Date(); render(); };
  }
  mount.querySelectorAll(".cal-cell[data-date]").forEach(c=>{
    c.onclick = () => {
      NAV.to(`#/uj-tura?date=${c.dataset.date}`);
    };
  });
}

/* ---------- ÚJ TÚRA — WIZARD ---------- */
const WIZ_KINDS = [
  {v:"catalog", i:"🏔️", t:"Egy konkrét túrát", d:"Kiválasztom a kínálatból (helyszín, nehézség…)"},
  {v:"suggest", i:"💡", t:"Még nem tudom — ajánlj valamit!", d:"Az AI Túratervező keres a preferenciáim alapján"},
  {v:"event", i:"🎫", t:"Egy túraeseményhez csatlakozom", d:"Vezetett, napfelkelte, családi, fotós program"},
  {v:"custom",  i:"🧭", t:"Saját útvonalat tervezek", d:"Megadom a helyszínt és a paramétereket"},
  {v:"multi",   i:"⛺", t:"Többnapos túrát tervezek", d:"Sátor vagy menedékház, napok száma: 2+"}
];
let wiz = null;
function resetWiz(date){ wiz = { kind:null, place:"", date:date||"", days:1, with:"", who:[], difficulty:"Közepes", hours:"3-5", title:"", start:"" }; }
VIEWS.newTour = (q) => {
  if(!wiz || wiz._done) resetWiz(q&&q.date);
  const step = wiz._step||"kind";
  const back = step==="kind" ? `<button class="btn btn-ghost" id="wz-cancel">← Mégse</button>` : `<button class="btn btn-ghost" id="wz-back">← Vissza</button>`;
  let body="";
  if(step==="kind"){
    body = `<h1>Mit szeretnél tervezni?</h1><p class="muted">Válassz egy módot — végigkísérünk a lépéseken.</p>
    <div class="opt-grid" style="grid-template-columns:1fr">${WIZ_KINDS.map(k=>
      `<button class="opt ${wiz.kind===k.v?"sel":""}" data-kind="${k.v}"><span class="oi">${k.i}</span><span>${k.t}<small>${k.d}</small></span></button>`).join("")}</div>`;
  }
  if(step==="form"){
    const K = WIZ_KINDS.find(k=>k.v===wiz.kind);
    body = `<h1>${K.i} ${K.t}</h1><p class="muted">Néhány adat — az időtervet, csomaglistát és a biztonsági lapot a rendszer automatikusan előkészíti.</p>
    ${wiz.kind==="event" ? eventPickerStep()
     : (wiz.kind==="suggest" && !wiz.place ? suggestStep() : catalogPickerForm((wiz.kind==="custom"||wiz.kind==="multi") && !wiz.place))}`;
  }
  if(step==="done"){ // köztes állapot — a create() átadja a workspace-nek
    body=`<div class="empty"><span class="em-ico">⏳</span><h3>Túramunkaterület létrehozása…</h3></div>`;
  }
  const html = dash("#/uj-tura")(`<div class="wiz-wrap" style="max-width:720px">
      <div class="wiz-track"><i class="${step==="kind"?"on":""}"></i><i class="${step==="form"?"on":""}"></i></div>
      ${body}
      <div class="wiz-nav" style="margin-top:1.8rem">${back}<span></span></div>
    </div>`);
  return html;
};
function eventPickerStep(){
  const list = EVENTS.filter(e=>e.date>=Store.todayISO());
  return `<div class="grid" style="gap:12px">${list.map(e=>`
    <button class="opt ${wiz.eventRef===e.id?"sel":""}" data-ev="${e.id}" style="align-items:center">
      <div class="img-wrap" style="width:64px;height:64px;border-radius:12px;flex:none">${imgTag(e.img,"")}</div>
      <span style="text-align:left">${esc(e.name)}<small>📅 ${fmtDateFull(e.date)} · ${esc(e.place)} · ${esc(e.cat)} · ${esc(e.diff)}</small></span></button>`).join("")}</div>
    <p class="small muted" style="margin-top:.7rem">Kiválasztva: <b>${wiz.eventRef?esc(EVENTS.find(e=>e.id===wiz.eventRef).name):"még nincs"}</b> — a gomb a kiválasztás után megjelenik.</p>
    ${wiz.eventRef?`<button class="btn btn-primary btn-block" id="wz-go" style="margin-top:.4rem">➜ Esemény mentése a túráimba</button>`:""}`;
}
function suggestStep(){
  const recs = recommendFor(Store.me());
  return `<p class="muted mt0">Ezt a preferenciáid és a közeledben lévő tájegységek alapján ajánljuk most. Válassz egyet, vagy kattints a <b>Tervezd át</b> gombra és az AI ír helyetted teljes tervet.</p>
    <div class="grid g2">${recs.map(t=>`<button class="opt ${wiz.sel===t.id?"sel":""}" data-sel="${t.id}" style="align-items:flex-start;flex-direction:column;gap:.3rem">
      <span class="region">${esc(t.region)} · ${esc(t.diff)}</span><span style="font-size:1rem;font-weight:700">${esc(t.name)}</span>
      <small>📏 ${t.km} km · ⏱ ${t.h} ó · ⬆ ${t.up} m · ★ ${t.rating}</small></button>`).join("")}</div>
    <div class="opt-grid"><button class="opt" data-sel="ai"><span class="oi">🤖</span><span>Egyik sem — kérdezzük az AI-t<small>Naturális nyelven fogalmazom meg, mit szeretnék</small></span></button></div>`;
}
function catalogPickerForm(free){
  return `<div class="grid g2" style="grid-template-columns:1fr 1fr">
    ${free?`
      <div><label class="f">Helyszín *</label><input class="input" id="wz-place" placeholder="Pl. Mária-kő, Hargita" value="${esc(wiz.place||"")}"></div>
      <div><label class="f">Kiinduló pont (városd)</label><input class="input" id="wz-start" placeholder="Pl. Csíkszereda, Gyergyó" value="${esc(wiz.start||Store.me().city||"")}" style="margin-top:0"></div>
    `:`
      <div style="grid-column:1/-1"><label class="f" for="wz-pick">Válassz egy ismert túrát, vagy írd be a saját helyszínedet</label>
      <select class="input" id="wz-pick"><option value="">— Kézzel írom —</option>${TOURS.map(t=>`<option value="${t.id}">${esc(t.name)} (${esc(t.region)})</option>`).join("")}</select></div>
    `}
    <div><label class="f">Dátum</label><input class="input" type="date" id="wz-date" value="${esc(wiz.date||"")}"></div>
    <div><label class="f">${wiz.kind==="multi"?"Hány napos?":"Hány napos túra?"}</label>
      <select class="input" id="wz-days">${[1,2,3,4].map(n=>`<option ${wiz.days==n?"selected":""} value="${n}">${n} nap</option>`).join("")}</select></div>
    <div><label class="f">Mennyi időd van egy napra?</label><select class="input" id="wz-hours">
      ${[["1-3","1–3 óra (rövid)"],["3-5","3–5 óra (fél napos)"],["5-8","5–8 óra (egész napos)"],["8","8 óra fölött"]].map(([v,l])=>`<option value="${v}" ${wiz.hours===v?"selected":""}>${l}</option>`).join("")}</select></div>
    <div><label class="f">Nehézség</label><select class="input" id="wz-diff">${["Könnyű","Közepes","Nehéz"].map(x=>`<option ${wiz.difficulty===x?"selected":""}>${x}</option>`).join("")}</select></div>
    <div><label class="f">Kivel mész?</label><input class="input" id="wz-with" placeholder="Pl. Réka, Zsolt, család" value="${esc(wiz.with||"")}"></div>
    <div><label class="f">Túra neve (opcionális)</label><input class="input" id="wz-title" placeholder="Pl. Őszi gerincek" value="${esc(wiz.title||"")}"></div>
  </div>
  ${!free&&wiz.place?`<div class="card" style="padding:.9rem 1.1rem;margin-top:1rem;display:flex;gap:.8rem;align-items:center;border-radius:14px">
    ${imgTag((tourById(wiz.place)||{}).img||IMG.erdo,"")}<span style="width:44px;height:44px;border-radius:12px;overflow:hidden;display:inline-block"><img src="${(tourById(wiz.place)||{}).img||IMG.erdo}" onerror="this.remove()" style="width:100%;height:100%;object-fit:cover"></span>
    <div><b>${esc((tourById(wiz.place)||{}).name||wiz.place)}</b><div class="meta"><span>${esc((tourById(wiz.place)||{}).region||"")}</span><span>📏 ${(tourById(wiz.place)||{}).km||"?"} km</span><span>⬆ ${(tourById(wiz.place)||{}).up||"?"} m</span></div></div></div>`:""}
  <button class="btn btn-ember btn-lg btn-block" id="wz-go" style="margin-top:1.2rem">🥾 Túramunkaterület létrehozása</button>
  <p class="small muted center" style="margin-top:.6rem">A rendszer automatikus időtervet, felszereléslistát és ételvíz-listát készít — mintha baráttal terveznél.</p>`;
}
VIEWS.newTour.after = root => {
  const step = wiz._step||"kind";
  const cancel = root.querySelector("#wz-cancel"); if(cancel) cancel.onclick=()=>NAV.to("#/vezerlopult");
  const back = root.querySelector("#wz-back"); if(back) back.onclick=()=>{ wiz._step = wiz._prevStep||"kind"; render(); };
  if(step==="kind"){
    root.querySelectorAll("[data-kind]").forEach(b=>b.onclick=()=>{ wiz.kind=b.dataset.kind; wiz._step="form"; render(); });
  }
  if(step==="form"){
    if(wiz.kind==="event"){
      root.querySelectorAll("[data-ev]").forEach(b=>b.onclick=()=>{ wiz.eventRef=b.dataset.ev; render(); });
      const go=root.querySelector("#wz-go"); if(go) go.onclick=()=>{
        const ev=EVENTS.find(e=>e.id===wiz.eventRef); if(!Store.isEventSaved(ev.id)) Store.toggleEvent(ev.id);
        wiz._done=true; toast("Esemény a túráid közé mentve — a naptáradban is megjelenik.","🎫"); NAV.to("#/turaim"); };
      return;
    }
    if(wiz.kind==="suggest"){
      root.querySelectorAll("[data-sel]").forEach(b=>b.onclick=()=>{
        if(b.dataset.sel==="ai"){ NAV.to("#/ai"); return; }
        wiz.sel=b.dataset.sel; wiz.place=b.dataset.sel;
        const t=tourById(b.dataset.sel); if(t){ wiz.title=t.name; wiz.difficulty=t.diff; } render(); });
      // detail: a form shows with pre-filled values when wiz.place set
      if(wiz.place) fillForm();
      return;
    }
    fillForm();
  }
  function fillForm(){
    const q=id=>root.querySelector(id);
    const bind = (id,ev,key,val)=>{ const e=q(id); if(e) e.addEventListener(ev,()=>{ e._t=true; wiz[key]=val?val(e):e.value; }); };
    bind("#wz-place","input", "place");
    bind("#wz-start","input","start");
    bind("#wz-title","input","title");
    bind("#wz-with","input","who");
    const pick=q("#wz-pick");
    if(pick) pick.onchange=()=>{ const t=tourById(pick.value); wiz.place=pick.value; wiz.title=t?t.name:wiz.title; wiz.difficulty=t?t.diff:wiz.difficulty; render(); };
    ["#wz-date","#wz-days","#wz-hours","#wz-diff"].forEach(id=>{const e=q(id); if(e) e.onchange=()=>{
      if(id==="#wz-date") wiz.date=e.value; if(id==="#wz-days") wiz.days=+e.value;
      if(id==="#wz-hours") wiz.hours=e.value; if(id==="#wz-diff") wiz.difficulty=e.value; };});
    const go=q("#wz-go"); if(go) go.onclick=()=>{
      ["#wz-place","#wz-start","#wz-date","#wz-days","#wz-hours","#wz-diff","#wz-with","#wz-title"].forEach(id=>{const e=q(id); if(e&&e.value!==undefined){
        const map={"#wz-place":"place","#wz-start":"start","#wz-date":"date","#wz-days":"days","#wz-hours":"hours","#wz-diff":"difficulty","#wz-with":"who","#wz-title":"title"};
        wiz[map[id]] = id==="#wz-days"?+e.value:e.value; }});
      createTour(); };    if(step==="kind"){ }
  }
  function createTour(){
    const isCat = wiz.place && tourById(wiz.place);
    const base = isCat ? tourById(wiz.place) : null;
    const hoursNum = { "1-3":2.5, "3-5":4.5, "5-8":6.5, "8":9 }[wiz.hours] || 4;
    const days = wiz.kind==="multi" ? Math.max(2,wiz.days) : (wiz.days||1);
    const dr = {
      title: wiz.title || base?.name || (wiz.place? wiz.place : "Új túra"),
      place: isCat? base.start.name : (wiz.place||""),
      region: isCat? base.region : "",
      date: wiz.date || "", days, lengthKm: base?base.km: (wiz.kind==="multi"?32:10),
      ascent: base?base.up:(wiz.kind==="multi"?1200:450), durationH: base?base.h:hoursNum,
      difficulty: wiz.difficulty||"Közepes", tags: wiz.kind==="multi"?["többnapos","sátor"]: base? base.tags.slice():[],
      img: base?base.img: IMG.kodos, desc: base?base.desc:"", coords: base? {...base.start}:null,
      with: wiz.who
    };
    dr.participants = (wiz.who||"").split(/,| · |\/+/).map(s=>s.trim()).filter(Boolean)
      .map(n=>({id:Store.uid("p"),name:n,confirmed:false}));
    const t = Store.newTourFromDraft(dr);
    wiz._done=true; wiz = null;
    toast("Túramunkaterület létrehozva — a teendőid listája vár! 🎒","✅");
    NAV.to("#/tura/"+t.id);
  }
};
