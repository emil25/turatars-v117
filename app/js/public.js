/* ============================================================
   TÚRAVAROS — PUBLIKUS OLDALAK + AUTH + ONBOARDING
   ============================================================ */
"use strict";

/* ---------- KÖZÖS KÁRTYÁK ---------- */
function elevSpark(vals, color){
  if(!vals||!vals.length) return "";
  const mx=Math.max(...vals), pts=vals.map((v,i)=>`${(i/(vals.length-1)*100).toFixed(1)},${(24-v/mx*20).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${color||"var(--moss)"}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
}
function tourCard(t){
  return `<article class="card tcard"><a class="card-link" href="#/turak/${t.id}">
    <div class="img-wrap" style="height:168px">${imgTag(t.img,t.name)}
      <span class="chip chip-pine">${esc(t.region)}</span>
      <span class="rate">★ ${t.rating}</span></div></a>
    <div class="tbody">
      <span class="region">${esc(t.region)} · ${esc(t.difficulty||t.diff)}</span>
      <h3><a href="#/turak/${t.id}">${esc(t.name)}</a></h3>
      <div class="elevator" title="Magassági profil">${elevSpark((t.elev||[]).length?t.elev:t.elev)}</div>
      <div class="meta"><span>📏 ${t.km} km</span><span>⏱ ${t.h} ó</span><span>⬆ ${t.up} m</span></div>
      <div style="margin-top:.55rem">${diffChip(t.diff)}</div><p class="small muted" style="margin:.35rem 0 0">${window.v123RouteLabel?window.v123RouteLabel(t):((t.gpxUrl)?"GPX útvonal elérhető":"Útvonaladat még nem érhető el")}</p>${window.v122SourceLine?v122SourceLine(t):""}
    </div></article>`;
}
function ecardSmall(e){
  const [Y,Mo,Da] = (e.date||"—").split("-");
  const hav = e.date ? MONTHS_HU[+Mo-1].slice(0,2)+". " : "Hamarosan";
  const nap = e.date ? +Da : "🚲";
  return `<article class="card ecard"><div class="img-wrap" style="min-height:150px">${imgTag(e.img,e.name)}</div>
    <div class="eb">
      <div class="flex between eh-row"><span class="edate"><i>${hav}</i><b>${nap}</b></span>
        <span class="chip chip-ember">${esc(e.cat)}</span></div>
      <h3 style="margin:.25rem 0 .1rem"><a href="#/esemenyek/${e.id}">${esc(e.name)}</a></h3>
      <div class="meta"><span>📍 ${esc(e.place)}</span><span>👥 ${e.people} fő</span></div>
      <div class="eorg">Szervező: ${esc(e.org)}${e.time?` · 🕐 ${esc(e.time)}`:""}${e.src?` · <a href="${esc(e.src)}" target="_blank" rel="noopener" style="color:var(--sky);font-weight:600">hivatalos oldal ↗</a>`:""}</div>${window.v122SourceLine?v122SourceLine(e):""}
      <div class="flex" style="margin-top:.3rem"><button class="btn btn-soft btn-sm" data-save-event="${e.id}">
        ${Store.me()&&Store.isEventSaved(e.id)?"✓ A túráim között":"Mentés a saját túráim közé"}</button>${diffChip(e.diff)}</div>
    </div></article>`;
}
function handleSaveEvents(root){
  root.querySelectorAll("[data-save-event]").forEach(b=>b.onclick=()=>{
    if(!Store.me()){ toast("A mentéshez jelentkezz be vagy regisztrálj","🔐"); NAV.to("#/regisztracio"); return; }
    const on = Store.isEventSaved(b.dataset.saveEvent);
    Store.toggleEvent(b.dataset.saveEvent);
    if(!on){ const ev = v122PublicEvents().find(x=>x.id===b.dataset.saveEvent); const tr = Store.myData().tours.find(x=>x.eventRef===ev.id);
      if(tr&&(ev.reg||ev.src)&&!(tr.notes||"").includes("Nevezés:")){ tr.notes=((tr.notes||"")+(tr.notes?"\n":"")+"Nevezés: "+(ev.reg||ev.src)+(ev.time?" · "+ev.time:"")+(ev.place?" · "+ev.place:"")).trim(); Store.save(); }
      if(tr && (ev.reg||ev.src) && !(tr.notes||"").includes("Nevezés:")){ tr.notes = ((tr.notes||"") + (tr.notes?"\n":"") + "Nevezés: " + (ev.reg||ev.src) + (ev.time ? " · " + ev.time : "")).trim(); Store.save(); } }
    toast(on?"Eltávolítva a saját túráid közül.":"Hozzáadva a saját túranaptáradhoz! 🎫","✓");
    render();
  });
}

/* ================= KEZDŐLAP ================= */
const VIEWS = {};
VIEWS.home = () => {
  const upcomingEvents = v122PublicEvents().filter(e=>e.date?e.date>=Store.todayISO():false).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);
  const popular = v122PublicTours().slice().sort((a,b)=>b.reviews-a.reviews).slice(0,6);
  const weekend = v122PublicTours().filter(t=>t.h<=4.5).slice(0,3);
  const best = v122PublicPlaces().slice(0,6);
  const sunrise = v122PublicTours().filter(t=>t.tags.includes("napkelte")||t.rating>=4.8).slice(0,3);
  const family = v122PublicTours().filter(t=>t.tags.includes("family"));
  const easy = v122PublicTours().filter(t=>t.diff==="Könnyű").slice(0,6);
  const u = Store.me();
  return `
  <section class="hero"><div class="bg">${imgTag(IMG.hegylanc,"Hegyaljai gerinc")}</div>
    <div class="wrap hero-in">
      <span class="kicker">🥾 ${v122PublicTours().length} túraútvonal · ${v122PublicEvents().filter(e=>e.date>=Store.todayISO()).length} közelgő esemény · ${v122PublicPlaces().length} bakancslista-hely</span>
      <h1>Merre kalandozol <br><i>legközelebb?</i></h1>
      <p class="sub">Fedezd fel, tervezd meg és őrizd meg minden túrádat egy helyen — Székelyföld hágóitól a Fogarasokig.</p>
      <p class="hero-proof">Útvonalak, GPX, időterv, felszerelés, társak és napló — egy helyen.</p>
      <div class="searchbox" role="search" aria-label="Túrák keresése">
        <div class="sc-field"><label for="q-hova">Hova mennél?</label><input id="q-hova" placeholder="Hely, régió vagy túranév"></div>
        <div class="sc-field"><label for="q-mikor">Mikor?</label><select id="q-mikor"><option value="">Bármikor</option><option value="hk">Jövő héten</option><option value="honap">Ebben a hónapban</option><option value="og">A hegyekben</option></select></div>
        <div class="sc-field"><label for="q-nehezseg">Nehézség</label><select id="q-nehezseg"><option value="">Mindegy</option><option>Könnyű</option><option>Közepes</option><option>Nehéz</option></select></div>
        <div class="sc-field"><label for="q-id">Mennyi időd van?</label><select id="q-id"><option value="">Bármennyi</option><option value="3">max 3 óra</option><option value="5">max 5 óra</option><option value="24">egész napos / többnapos</option></select></div>
        <button class="btn btn-primary btn-lg" id="q-go">Túrák keresése</button>
      </div>
      <div class="hero-stats">
        <div class="hs"><b>${v122PublicTours().length}</b><span>túraútvonal</span></div>
        <div class="hs"><b>${v122PublicEvents().length}</b><span>vezetett esemény</span></div>
        <div class="hs"><b>${new Set(v122PublicTours().map(t=>t.region).filter(Boolean)).size}</b><span>ellenőrzött tájegység</span></div>
        <div class="hs"><b>${u?"Aktív 👋":"Ingyenes"}</b><span>a személyes túraközpont</span></div>
      </div>
    </div></section>

  <div class="wrap">
    <section class="pub-section">
      <div class="flex" style="gap:.6rem;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap">
      <div class="sect-head" style="margin:0 2rem 0 0"><div><span class="eyebrow">Naptár</span><h2 class="mb0">Közelgő túraesemények</h2></div>
        <a class="sect-more" href="#/esemenyek">Összes esemény →</a></div>
      <a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="https://www.cseke.ro/index.php/turaterv">🗓 CsEKE éves túraterv ↗</a></div>
      <div class="p-h-scroll" id="home-events"></div>
    </section>

    <div class="trail-divider"><span class="trail-blaze"></span></div>

    <section class="pub-section">
      <div class="sect-head"><div><span class="eyebrow">A közösség kedvencei</span><h2 class="mb0">Népszerű túrák</h2></div>
        <a class="sect-more" href="#/felfedezes">Összes túra →</a></div>
      <div class="grid g3">${popular.map(t=>tourCard(t)).join("")}</div>
      ${(function(){ const uj=v122PublicTours().filter(t=>t.src).slice(0,4); return uj.length?`<p class="small muted" style="margin-top:.9rem">Újonnan a kínálatban — forrással a túrakártyákon: ${uj.map(x=>`<a href="#/turak/${x.id}" style="color:var(--sky);font-weight:600">${esc(x.name.split(" (")[0])}</a>`).join(" · ")}</p>`:""; })()}
    </section>

    <section class="pub-section tight">
      <div class="sect-head"><div><span class="eyebrow">Pihizsák a hétre</span><h2 class="mb0">Hétvégi ajánlatok</h2></div></div>
      <div class="grid g3" id="weekend-grid"></div>
    </section>

    <section class="pub-section">
      <div class="sect-head"><div><span class="eyebrow">Ahol a szívöd lakik</span><h2 class="mb0">Legszebb helyek</h2></div>
        <a class="sect-more" href="#/helyek">Minden hely →</a></div>
      <div class="grid g3" id="best-places"></div>
    </section>

    <div class="trail-divider"><span class="trail-blaze"></span></div>

    <section class="pub-section">
      <div class="sect-head"><div><span class="eyebrow">Hajnalban a tetőn</span><h2 class="mb0">Napfelkelte túrák</h2></div></div>
      <div class="p-h-scroll">${sunrise.map(t=>tourCard(t)).join("")}</div>
      <div class="sect-head" style="margin-top:2.4rem"><div><span class="eyebrow">Apró lábaknak is</span><h2 class="mb0">Családi túrák</h2></div></div>
      <div class="p-h-scroll">${family.map(t=>tourCard(t)).join("")}</div>
      <div class="sect-head" style="margin-top:2.4rem"><div><span class="eyebrow">Első lépések</span><h2 class="mb0">Kezdőknek ajánlott túrák</h2></div>
        <a class="sect-more" href="#/felfedezes">Továbbiak →</a></div>
      <div class="grid g3">${easy.slice(0,3).map(t=>tourCard(t)).join("")}</div>
    </section>

    <section class="pub-section">
      <div class="band band-sand topo">
        <div class="split2">
          <div>
            <span class="eyebrow" style="color:var(--moss)">Térképes felfedezés</span>
            <h2>Az egész Erdély egy térképen</h2>
            <p class="muted">A térképen csak ellenőrzött, forrással rendelkező nyilvános adatok jelennek meg. Saját túráid és GPX-útvonalaid a személyes központban érhetők el.</p>
            <a class="btn btn-primary" href="#/felfedezes">Térképes felfedezés</a>
            <a class="btn btn-ghost" href="#/hagymas" style="margin-left:.5rem">🕹 Hagymás útvonalak</a>
          </div>
          <div class="mapbox tall" id="home-map" aria-label="Túratérkép"></div>
        </div>
      </div>
    </section>

    <section class="pub-section">
      <div class="band band-green topo">
        <div class="split2">
          <div>
            <span class="eyebrow" style="color:#9ec6a5">🤖 AI Túratervező · béta</span>
            <h2>Írd le, milyen túrát szeretnél — ő össze is rakja</h2>
            <p>Írd le a kívánt nehézséget, időtartamot és célvidéket — az AI ezekből készít tervet, időrendet, felszerelés- és ételvíz-javaslatot. A tervet egy gombbal elmentheted a munkaterületedre.</p>
            <a class="btn btn-ember btn-lg" href="#/ai">💬 Kipróbálom az AI Túratervezőt</a>
          </div>
          <div class="ai-prev" aria-hidden="true">
            <div class="bub user">Írd le a túracéljaidat és a rendelkezésre álló időt.</div>
            <div class="bub ai">A megadott szempontok alapján ellenőrzött forrásokból készít javaslatot.</div>
          </div>
        </div>
      </div>
      ${u? "" : `
      <div class="band" style="margin-top:22px;background:linear-gradient(120deg,#fff,#f2f6ef);text-align:center;border:1px solid var(--line)">
        <h2>Az ösvény itt nem ér véget — innen indul a te túraközpontod</h2>
        <p class="muted">Regisztráció után saját túráid, idoterved, felszereléslistád, naptárad, naplód és statisztikáid egy helyen.</p>
        <div class="flex center" style="justify-content:center;gap:.7rem;flex-wrap:wrap">
          <a class="btn btn-primary btn-lg" href="#/regisztracio">Ingyenes regisztráció</a>
          <a class="btn btn-ghost btn-lg" href="#/belepes">Bejelentkezés</a>
        </div>

      </div>`}
    </section>
  </div>
  ${footer()}`;
};
VIEWS.home.after = (root) => {
  root.querySelector("#home-events").innerHTML =
    v122PublicEvents().filter(e=>e.date>=Store.todayISO()).slice(0,6).map(ecardSmall).join("");
  const wday = new Date(); const wsat = Store.addDays(Store.todayISO(), (6-wday.getDay()+7)%7);
  root.querySelector("#weekend-grid").innerHTML =
    v122PublicTours().filter(t=>t.h<=3.5).slice(0,3).map(t=>tourCard(t)).join("");
  root.querySelector("#best-places").innerHTML = v122PublicPlaces().slice(0,6).map(w=>
    `<div class="hcard">${imgTag(w.img,w.name)}<div class="hb"><span class="chip chip-pine">${esc(w.cat)}</span><h3 style="margin-top:.35rem">${esc(w.name)}</h3><div class="meta"><span>${esc(w.place)}</span><span>${esc(w.diff)}</span></div></div></div>`).join("");
  handleSaveEvents(root);
  const go = root.querySelector("#q-go");
  if(go) go.onclick = () => {
    const q = encodeURIComponent(root.querySelector("#q-hova").value.trim());
    const diff = encodeURIComponent(root.querySelector("#q-nehezseg").value);
    const h = root.querySelector("#q-id").value;
    sessionStorage.setItem("tvq", JSON.stringify({q:decodeURIComponent(q), diff:decodeURIComponent(diff), h}));
    NAV.to("#/felfedezes"); };
  const map = MapKit.make(root.querySelector("#home-map"), {zoom:7});
  if(map){
    v122PublicTours().forEach(t=>MapKit.pin(map,t.start.lat,t.start.lng,"pin-cat",
      `<b><a href="#/turak/${t.id}">${esc(t.name)}</a></b><br>${esc(t.region)} · ${t.km} km · ${esc(t.diff)}`));
    v122PublicEvents().filter(e=>e.date>=Store.todayISO()).forEach(e=>{
      const base=e.tour?(v122PublicTours().find(x=>x.id===e.tour)||tourById(e.tour)):null; if(!base) return;
      MapKit.pin(map,base.start.lat+((Math.random()-.5)/9),base.start.lng+((Math.random()-.5)/9),"pin-event",
        `<b><a href="#/esemenyek/${e.id}">${esc(e.name)}</a></b><br>${fmtDate(e.date)} · ${esc(e.place)}`); });
  }
};

/* ================= LÁBLÉC ================= */
function footer(){ return `<footer class="pub-foot"><div class="wrap">
  <div><div class="fbrand">Túratárs</div>
    <p class="small" style="max-width:34ch;color:#bcd6c2">A túrázók személyes digitális központja. Tervezés · szervezés · teljesítés · dokumentálás — egy helyen, magyarul.</p></div>
  <div><h4>Felfedezés</h4><a href="#/felfedezes">Túrák</a><a href="#/esemenyek">Események</a><a href="#/helyek">Helyek</a></div>
  <div><h4>Fiók</h4><a href="#/regisztracio">Regisztráció</a><a href="#/belepes">Bejelentkezés</a><a href="##/vezerlopult">Vezérlőpult</a></div>
  <div><h4>Közösség</h4><a href="#/csapatok">Túracsoportok</a><a href="#/ai">AI Túratervező</a><a href="#/terkep">Túratérkép</a></div>
  <div class="fine"><span>© 2026 Túratárs · turatars.ro · Képek: Unsplash, Nagyhagymás KKT · Eseményforrások: CsEKE, SzATT, visitharghita.ro</span><span>Készült: 🌲 a Bakban és a Székelyföldön</span></div>
</div></footer>`; }

/* ================= FELFEDEZÉS ================= */
VIEWS.discover = () => {
  const saved = (()=>{ try{return JSON.parse(sessionStorage.getItem("tvq")||"{}")}catch(e){return {}} })();
  const typeTags = [...new Set(v122PublicTours().flatMap(t=>(t.tags||[]).filter(Boolean)))].sort();
  const routeShapes = [...new Set(v122PublicTours().map(t=>t.routeType||t.shape).filter(Boolean))].sort();
  return `<div class="wrap pub-section tight">
    <div class="sect-head"><div><span class="eyebrow">${v122PublicTours().length} útvonal · élő szűrők</span><h1 style="font-size:2rem" class="mb0">Túrák felfedezése</h1></div></div>
    <div class="searchbox" style="margin-top:0;grid-template-columns:1.4fr .8fr .8fr .8fr .9fr" id="discfilters">
      <div class="sc-field"><label for="d-q">Keresés</label><input id="d-q" value="${esc(saved.q||"")}" placeholder="Név, tájegység…"></div>
      <div class="sc-field"><label for="d-diff">Nehézség</label><select id="d-diff"><option value="">Mindegy</option><option>Könnyű</option><option>Közepes</option><option>Nehéz</option></select></div>
      <div class="sc-field"><label for="d-id">Idő</label><select id="d-id"><option value="">Bármennyi</option><option value="3">max 3 ó</option><option value="5">max 5 ó</option><option value="99">bármilyen hosszú</option></select></div>
      <div class="sc-field"><label for="d-reg">Tájegység</label><select id="d-reg"><option value="">Mindegy</option>${[...new Set(v122PublicTours().map(t=>t.region))].map(r=>`<option>${esc(r)}</option>`).join("")}</select></div>
      <div class="sc-field"><label for="d-dist">Táv</label><select id="d-dist"><option value="">Bármennyi</option><option value="0-5">0–5 km</option><option value="5-15">5–15 km</option><option value="15-30">15–30 km</option><option value="30+">30+ km</option></select></div>
      <div class="sc-field"><label for="d-up">Szint</label><select id="d-up"><option value="">Bármennyi</option><option value="0-300">0–300 m</option><option value="300-800">300–800 m</option><option value="800+">800+ m</option></select></div>
      <div class="sc-field"><label for="d-type">Típus / címke</label><select id="d-type"><option value="">Mindegy</option>${typeTags.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select></div>
      <div class="sc-field"><label for="d-gpx">GPX</label><select id="d-gpx"><option value="">Mindegy</option><option value="yes">GPX elérhető</option><option value="no">Útvonaladat nincs</option></select></div>
      ${routeShapes.length?`<div class="sc-field"><label for="d-shape">Útvonalforma</label><select id="d-shape"><option value="">Mindegy</option>${routeShapes.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select></div>`:`<div class="sc-field"><label for="d-shape">Útvonalforma</label><select id="d-shape" disabled><option>Nincs adat</option></select></div>`}
      <div class="sc-field"><label for="d-family">Kezdő / családi</label><select id="d-family"><option value="">Mindegy</option><option value="family">Családi vagy kezdő</option></select></div>
      <div class="sc-field"><label>Nézet</label><button class="input" id="d-toggle" style="cursor:pointer;text-align:left;background:transparent">🗺️ Térkép</button></div>
    </div>
    <div class="grid g3" id="disc-results" style="margin-top:22px"></div>
    <div class="mapbox hidden" id="disc-map" style="margin-top:22px;height:460px"></div>
    <div class="trail-divider"><span class="trail-blaze"></span></div>
    <p class="muted small">A találatok frissülnek, ahogy szűrsz: a térképnézet pontjaira kattintva azonnal megnyithatod a túrát.</p>
  </div>${footer()}`;
};
VIEWS.discover.after = (root)=>{
  const els = { q:root.querySelector("#d-q"), diff:root.querySelector("#d-diff"), h:root.querySelector("#d-id"), reg:root.querySelector("#d-reg"), dist:root.querySelector("#d-dist"), up:root.querySelector("#d-up"), type:root.querySelector("#d-type"), gpx:root.querySelector("#d-gpx"), shape:root.querySelector("#d-shape"), family:root.querySelector("#d-family") };
  try{ const saved=JSON.parse(sessionStorage.getItem("tvq")||"{}"); if(saved.diff)els.diff.value=saved.diff; if(saved.h)els.h.value=saved.h; }catch(e){}
  let showMap=false, discMap=null;
  const apply = () => {
    const q=els.q.value.toLowerCase().trim(), f = t =>
      (!els.diff.value || t.diff===els.diff.value) &&
      (!els.reg.value || t.region===els.reg.value) &&
      (els.h.value==="99" || !els.h.value || t.h <= +els.h.value || els.h.value==="99") &&
      (!els.dist.value || (els.dist.value==="0-5" && t.km<=5) || (els.dist.value==="5-15" && t.km>5 && t.km<=15) || (els.dist.value==="15-30" && t.km>15 && t.km<=30) || (els.dist.value==="30+" && t.km>30)) &&
      (!els.up.value || (els.up.value==="0-300" && t.up<=300) || (els.up.value==="300-800" && t.up>300 && t.up<=800) || (els.up.value==="800+" && t.up>800)) &&
      (!els.type.value || (t.tags||[]).includes(els.type.value)) &&
      (!els.gpx.value || (els.gpx.value==="yes" ? !!t.gpxUrl : !t.gpxUrl)) &&
      (!els.shape.value || els.shape.disabled || (t.routeType||t.shape)===els.shape.value) &&
      (!els.family.value || (t.tags||[]).some(x=>/family|család|kezdő/i.test(x))) &&
      (!q || (t.name+" "+t.region+" "+t.desc+" "+t.tags.join(" ")).toLowerCase().includes(q));
    const res = v122PublicTours().filter(f);
    root.querySelector("#disc-results").innerHTML = res.length ? res.map(t=>tourCard(t)).join("")
      : `<div class="empty" style="grid-column:1/-1"><span class="em-ico">🧭</span><h3>Nincs találat</h3><p>Lazíts a szűrőkön — vagy kérj tippot az AI Túratervezőtől.</p><a class="btn btn-soft btn-sm" href="#/ai">Kérj ajánlást</a></div>`;
    if(showMap){ if(discMap&&discMap.remove) discMap.remove();
      discMap = MapKit.make(root.querySelector("#disc-map"),{zoom:7});
      res.forEach(t=>{ MapKit.pin(discMap, t.start.lat, t.start.lng, "pin-cat",
        `<b><a href="#/turak/${t.id}">${esc(t.name)}</a></b><br>${esc(t.region)} · ${t.km} km · ${esc(t.diff)}`); });
    }
  };
  ["q","diff","h","reg","dist","up","type","gpx","shape","family"].forEach(k=>{ if(!els[k]) return; els[k].addEventListener("input",apply); els[k].addEventListener("change",apply); });
  root.querySelector("#d-toggle").onclick = () => { showMap=!showMap;
    els.q.closest(".searchbox").querySelector("button").textContent = showMap?"📋 Lista":"🗺️ Térkép";
    root.querySelector("#disc-results").classList.toggle("hidden",showMap);
    root.querySelector("#disc-map").classList.toggle("hidden",!showMap);
    apply(); };
  apply(); bindTourCards();
};
window.bindTourCards = ()=>{};

/* ================= ESEMÉNYEK ================= */
let evFilter = "";
VIEWS.events = () => {
  const cats = [...new Set(v122PublicEvents().map(e=>e.cat))];
  const list = v122PublicEvents().filter(e=>(!evFilter||e.cat===evFilter) && (!e.date || e.date>=Store.todayISO())).sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999"));
  return `<div class="wrap pub-section tight">
    <div class="sect-head"><div><span class="eyebrow">Túraesemény-naptár</span><h1 class="mb0" style="font-size:2rem">Események</h1></div></div>
    <p class="muted">Válaszd ki, milyen kalandot keresel, majd egy kattintással mentsd a saját túráid közé — automatikusan megjelenik a túranaptáradban és a munkaterületeden.</p>
    <div class="filter-row"><button class="f-pill ${!evFilter?"on":""}" data-cat="">Mind</button>
      ${cats.map(c=>`<button class="f-pill ${evFilter===c?"on":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
    <div class="org-band">
      <b class="small">🤝 Szervezői hálózat</b>
      <a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="https://www.cseke.ro/index.php">CsEKE főoldal</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.cseke.ro/index.php/turaterv">🗓 CsEKE éves túraterv</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.cseke.ro/index.php/beszamolok">📖 Túrabeszámolók</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://szatt.cseke.ro">🏔 Szent Anna-tó teljesítménytúra</a>
      <a class="btn btn-ghost btn-sm" href="#/hagymas">🕹 Hagymás útvonalhálózat</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://hu.wikiloc.com/nyomvonalak/turazas/romania/harghita">🌐 Wikiloc · Hargita</a>
    </div>
    <div class="grid g2">${list.map(ecardSmall).join("")}</div>
    ${list.length?"":'<div class="empty"><span class="em-ico">🗓️</span><h3>Jelenleg nincs ellenőrzött esemény.</h3><p>Hiteles forrásból érkező esemény az ellenőrzés után jelenik meg.</p></div>'}
  </div>${footer()}`;
};
VIEWS.events.after = (root)=>{
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{ evFilter=b.dataset.cat; render(); });
  handleSaveEvents(root);
};

/* ESEMÉNY RÉSZLETE (modal) */
function eventModal(eid){
  const e = v122PublicEvents().find(x=>x.id===eid); if(!e) return;
  const base = e.tour?(v122PublicTours().find(x=>x.id===e.tour)||tourById(e.tour)):null;
  openModal({ title:esc(e.name),
   body:`<div class="img-wrap" style="height:170px;border-radius:14px;margin-bottom:1rem">${imgTag(e.img,e.name)}</div>
     <div class="meta" style="margin-bottom:1rem"><span>📅 <b>${e.date?fmtDateFull(e.date):"Hamarosan — a szervező adja meg"}</b>${e.date?", "+dowHU(e.date):""}</span>
     <span>📍 ${esc(e.place)}</span><span>👥 <b>${e.people}</b>/${e.cap} résztvevő</span><span>🎒 ${esc(e.cat)}</span><span>${diffChip(e.diff)}</span></div>
     ${e.place && /Gyergy/.test(e.place) ? `<a class="tour-src" href="#/hagymas" style="margin-bottom:.4rem">🕹 🕹 A Hagymás hálózat összes útvonala itt →</a>` : ""}
     <p>${esc(e.desc)}</p>
     ${e.src?`<a class="tour-src" target="_blank" rel="noopener" href="${esc(e.src)}">🔗 Részletes program (szervező oldala)</a>`:""}
     ${base?`<div class="card" style="padding:1rem;display:flex;gap:1rem;align-items:center;border-radius:14px">
       <div class="img-wrap" style="width:64px;height:64px;border-radius:12px;flex:none">${imgTag(base.img,base.name)}</div>
       <div><b>${esc(base.name)}</b><div class="meta"><span>📏 ${base.km} km</span><span>⏱ ${base.h} ó</span><span>⬆ ${base.up} m</span></div></div></div>`:""}
     <div class="progress-strip" style="margin-top:1rem"><i style="width:${Math.round(e.people/e.cap*100)}%"></i></div>
     <p class="small muted" style="margin:.4rem 0 0">${e.people} helyfoglalás · ${e.cap-e.people} szabad hely</p>
      ${e.time?`<div class="meta" style="margin-top:.5rem"><span>🕐 <b>${esc(e.time)}</b></span></div>`:""}
      ${(e.reg||e.src)?`<div class="flex wrapcol" style="gap:.5rem;margin-top:.7rem">
        ${e.reg?`<a class="btn btn-ember btn-sm" target="_blank" rel="noopener" href="${esc(e.reg)}">📝 Nevezés / regisztráció</a>`:""}
        ${e.src?`<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(e.src)}">🔗 Hivatalos oldal / program</a>`:""}
     </div>`:""}`,
   footer:`<div class="flex" style="justify-content:flex-end;gap:.6rem;flex-wrap:wrap">
     <button class="btn btn-ghost btn-sm" data-close>Bezárás</button>
     ${e.reg?`<a class="btn btn-ember btn-sm" id="btn-event-reg" target="_blank" rel="noopener" href="${esc(e.reg)}">📝 Nevezés</a>`:""}
     <button class="btn btn-primary" id="ev-save">${Store.me()&&Store.isEventSaved(e.id)?"✓ Elmentve a túráim közé":"Mentés a saját túráim közé"}</button>`,
   onOpen: r => r.querySelector("#ev-save").onclick = () => { if(!Store.me()){ NAV.to("#/regisztracio"); return; }
     Store.toggleEvent(e.id);
     { const tr=Store.myData().tours.find(x=>x.eventRef===e.id); if(tr&&(e.reg||e.src)&&!(tr.notes||"").includes("Nevezés:")){ tr.notes=((tr.notes||"")+(tr.notes?"\n":"")+"Nevezés: "+(e.reg||e.src)+(e.time?" · "+e.time:"")).trim(); Store.save(); } }
     closeModal(); toast("Hozzáadtuk a túranaptáradhoz! 📅","✓"); render(); } });
}

/* ================= HELYEK ================= */
VIEWS.places = () => {
  const groups = WISH_CATS.map(c=>({ ...c, items: v122PublicPlaces().filter(w=>w.cat===c.name) }));
  return `<div class="wrap pub-section tight">
    <div class="sect-head"><div><span class="eyebrow">Gyűjtsd a helyeket, amiket látni akarsz</span><h1 class="mb0" style="font-size:2rem">Legszebb helyek</h1></div></div>
    ${groups.map(g=>`<h2 style="font-size:1.3rem;margin-top:2rem">${g.icon} ${g.name}</h2>
      <div class="grid g4 smm2 places-grid">${g.items.map(w=>`<div class="card" style="overflow:hidden;border-radius:16px">
        <div class="img-wrap" style="height:130px">${imgTag(w.img,w.name)}</div>
        <div style="padding:.8rem .95rem"><b style="font-family:var(--font-display);font-size:1rem">${esc(w.name)}</b>
        <div class="meta" style="margin-top:.3rem"><span>${esc(w.place)}</span><span>${esc(w.diff)}</span></div>${window.v122SourceLine?v122SourceLine(w):""}
        <div class="flex" style="margin-top:.6rem"><button class="btn btn-soft btn-sm" data-wish="${w.id}">${Store.me()&&Store.inWish(w)?"❤️ A listádban":"❤️ Mentés"}</button></div></div></div>`).join("")}</div>`).join("")}
  </div>${footer()}`;
};
VIEWS.places.after = root => {
  root.querySelectorAll("[data-wish]").forEach(b=>b.onclick=()=>{
    if(!Store.me()){ toast("A mentéshez jelentkezz be","🔐"); NAV.to("#/belepes"); return; }
    const w = v122PublicPlaces().find(x=>x.id===b.dataset.wish);
    Store.toggleWish(w); toast(Store.inWish(w)?"Felkerült a bakancslistára ❤️":"Eltávolítva","❤️"); render(); });
};

/* ================= SZERVEZŐKNEK ================= */
VIEWS.szervezoknek = () => {
  const u = Store.me();
  return `<div class="wrap pub-section organizer-public">
    <section class="band band-green organizer-public-hero">
      <span class="eyebrow" style="color:#b9d9be">🏢 Szervezőknek</span>
      <h1>Szervezz túrát a Túratársban</h1>
      <p>A meglévő túrázó fiókodból egy lépéssel szervezői központot nyithatsz. Kezeld egy helyen a túraeseményeidet, a GPX-útvonalat és a jelentkezőket.</p>
      <div class="flex" style="gap:.65rem;flex-wrap:wrap;margin-top:1.2rem">
        <a class="btn btn-ember btn-lg" href="${u?"#/szervezo":"#/regisztracio"}">${u?"Megnyitom a szervezői központot":"Szervezőként csatlakozom"} →</a>
        ${u?"":`<a class="btn btn-ghost btn-lg" style="color:#fff;border-color:rgba(255,255,255,.55)" href="#/belepes">Már van fiókom</a>`}
      </div>
    </section>
    <section class="pub-section tight organizer-public-body">
      <div class="sect-head"><div><span class="eyebrow">Ami már be van építve</span><h2 class="mb0">A túraötlettől a jelentkezőkig</h2></div></div>
      <div class="grid g3">
        <article class="card organizer-feature"><span class="e2-big">👤</span><h3>Szervezői profil</h3><p class="muted">Név, bemutatkozás, régió és kapcsolati adatok a saját szervezői központodban.</p></article>
        <article class="card organizer-feature"><span class="e2-big">🗺️</span><h3>Esemény és GPX</h3><p class="muted">Hozz létre piszkozatot, csatolj útvonalat, majd publikáld vagy zárd le az eseményt.</p></article>
        <article class="card organizer-feature"><span class="e2-big">👥</span><h3>Jelentkezők kezelése</h3><p class="muted">Lásd a jelentkezőket, kezeld a státuszokat és kövesd a férőhelyeket.</p></article>
      </div>
      <div class="card organizer-note"><b>Ugyanaz a túraközpont marad.</b><span class="muted">A szervezői mód a meglévő fiókodhoz kapcsolódik, a saját túráid és helyi adataid változatlanul megmaradnak.</span></div>
    </section>
  </div>${footer()}`;
};

/* ---------- TÚRA RÉSZLETE (publikus, módosítatlan katalógusnézet) ---------- */
function tourModal(tid){
  const t = v122PublicTours().find(x=>x.id===tid); if(!t) return;
  openModal({ title:esc(t.name),
    body:`<div class="img-wrap" style="height:190px;border-radius:14px;margin-bottom:1rem">${imgTag(t.img,t.name)}</div>
      <div class="meta" style="margin-bottom:.8rem"><span>📍 <b>${esc(t.start.name)}</b> · ${esc(t.region)}</span>
      <span>📏 ${t.km} km</span><span>⏱ ${t.h} ó</span><span>⬆ ${t.up} m</span><span>★ ${t.rating} (${t.reviews} értékelés)</span>${diffChip(t.diff)}</div>
      <div id="tm-map" class="mapbox" style="height:240px;border-radius:14px;margin:.7rem 0" aria-label="A túra valódi kezdőpontja"></div>
      <p>${esc(t.desc)}</p>
      ${window.v122SourceLine?v122SourceLine(t):""}
      ${t.gpxUrl?`<div class="flex" style="gap:.5rem;flex-wrap:wrap;margin-top:.3rem"><a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="${esc(t.gpxUrl)}">⬇ GPX letöltése</a>${t.src?`<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(t.src)}">${esc(t.srcn||"🔗 Hivatalos távleírás")}</a>`:""}</div>`:`<p class="small muted">🗺️ Útvonaladat még nem érhető el. A kezdőpontból saját útvonalat tervezhetsz a térképen.</p>`}
      ${window.v123PlanningUrl&&t.start?`<a class="btn btn-ghost btn-sm" style="margin-top:.35rem" target="_blank" rel="noopener nofollow" href="${esc(window.v123PlanningUrl(t))}">🧭 Útvonal tervezése a térképen</a>`:""}
      ${t.src?`<a class="tour-src" id="tourSrc" target="_blank" rel="noopener" href="${esc(t.src)}">🔗 ${(t.srcn||"Forrás és nyomvonal")}</a>`:""}
     ${t.src2?`<a class="tour-src" target="_blank" rel="noopener" href="${t.src2}">🧭 ${(t.src2n||'Nyomvonal')} — Komoot</a>`:""}
     ${t.src3?`<a class="tour-src" target="_blank" rel="noopener" href="${t.src3}">🧭 ${(t.src3n||'Nyomvonal 2')} — Komoot</a>`:""}
      <div style="height:44px">${elevSpark(t.elev)}</div>
      <div class="flex" style="gap:.5rem;flex-wrap:wrap;margin-top:.35rem">
        <button class="btn btn-ember btn-sm" id="tm-gps">🥾 Indítás GPS-szel</button>
        <a class="btn btn-ghost btn-sm" href="#/tervezes?route=${encodeURIComponent(t.id)}">🧭 Túra tervezése</a>
      </div>
      <p class="small muted">💡 Regisztráció után egy kattintással átemelheted a saját túráid közé, és a rendszer automatikusan javasol felszerelést, időtervet és étellistát.</p>`,
    footer:`<div class="flex" style="justify-content:space-between"><button class="btn btn-ghost btn-sm" data-close>Bezárás</button>
      <button class="btn btn-primary" id="tm-save">➕ Mentés a saját túráim közé</button></div>`,
    onOpen: r => {
      r.querySelector("#tm-save").onclick = () => {
      if(!Store.me()){ toast("Előbb jelentkezz be vagy regisztrálj","🔐"); NAV.to("#/regisztracio"); return; }
      const d = Store.myData();
      if(!d.tours.some(x=>x.place===t.start.name && x.status==="tervezés" && x.date>=Store.todayISO())){
        Store.newTourFromDraft({ title:t.name, place:t.start.name, region:t.region, lengthKm:t.km, ascent:t.up,
          durationH:t.h, difficulty:t.diff, tags:t.tags.slice(), img:t.img, desc:t.desc, coords:{...t.start}, date:Store.nextSatDate() });
      }
      closeModal(); toast("Mentve a tervezett túráid közé — nyisd meg a munkaterületet! 🥾","✓"); NAV.to("#/turaim"); };
      const gps=r.querySelector("#tm-gps"); if(gps) gps.onclick=()=>{ if(window.v125StartCatalogTour) window.v125StartCatalogTour(t.id); };
      const mapEl=r.querySelector("#tm-map");
      if(mapEl&&t.start&&t.start.lat&&typeof MapKit!=="undefined"){
        try{ const m=MapKit.make(mapEl,{center:[t.start.lat,t.start.lng],zoom:12}); if(m){ MapKit.pin(m,t.start.lat,t.start.lng,"pin-cat",`<b>${esc(t.start.name)}</b><br>${esc(t.region||"")} · valódi kezdőpont`); } }
        catch(e){ mapEl.innerHTML='<p class="small muted">A térkép most nem érhető el — a forrásadat és a GPS indítás továbbra is használható.</p>'; }
      }
    } });
}

/* ---------- HASH: #/turak/:id és #/esemenyek/:id → modalok az app felett ---------- */
VIEWS.tourDetail = (id) => { tourModal(id); NAV.to(history.state&&location.hash.replace(/#\/turak\/[^?]+/,"")||"#/felfedezes"); };

/* ================= AUTH ================= */
function cloudAuthEnabled(){ try{ return !!(window.__V54&&window.__V54.api&&window.__V54.api.cloudAuthEnabled&&window.__V54.api.cloudAuthEnabled()); }catch(e){ return false; } }
function cloudAuthError(e){ try{ return window.__V54.api.errorText(e); }catch(x){ return "A művelet most nem sikerült. A helyi adataid érintetlenek."; } }
VIEWS.login = () => `
<div class="auth-shell" style="min-height:70vh">
  <form class="card auth-card" id="login-form" novalidate>
    <h1 class="mb0" style="font-size:1.7rem">Üdv újra a túrán 🥾</h1>
    <p class="muted">Jelentkezz be és a személyes túraközpontod vár.</p>
    <label class="f" for="li-e">E-mail-cím</label><input class="input" id="li-e" type="email" autocomplete="email" placeholder="pelda@mail.hu" required>
    <div style="height:.9rem"></div>
    <label class="f" for="li-p">Jelszó</label>
    <div class="pw-row"><input class="input" id="li-p" type="password" autocomplete="current-password"><button type="button" class="pw-eye" data-t="li-p" aria-label="Jelszó mutatása">👁</button></div>
    <p class="field-err hidden" id="li-err" role="alert"></p>
    <button class="btn btn-primary btn-lg btn-block" style="margin-top:.6rem">Bejelentkezés</button>
    <p class="auth-switch">Nincs még fiókod? <a href="#/regisztracio">Regisztrálj egyet — ingyenes</a></p>
  </form></div>`;
VIEWS.login.after = root => {
  const f=root.querySelector("#login-form");
  root.querySelectorAll(".pw-eye").forEach(b => b.onclick = () => { const t=root.querySelector("#"+b.dataset.t); t.type = t.type==="password"?"text":"password"; b.textContent = t.type==="password"?"👁":"🙈"; });
  f.onsubmit = async e => { e.preventDefault();
    const err=root.querySelector("#li-err"); err.classList.add("hidden");
    const email=root.querySelector("#li-e").value.trim().toLowerCase(), password=root.querySelector("#li-p").value;
    const submit=f.querySelector("button[type=submit]"); if(submit) submit.disabled=true;
    try{
      if(cloudAuthEnabled()){
        const r=await window.__V54.api.authLogin(email,password);
        if(r&&r.pending){ err.textContent="Erősítsd meg az e-mail címedet, majd jelentkezz be újra."; err.classList.remove("hidden"); return; }
      } else {
        const r=Store.login(email,password);
        if(r.err){ err.textContent=r.err; err.classList.remove("hidden"); return; }
      }
      const u=Store.me();
      if(!u){ err.textContent="A helyi munkamenet létrehozása nem sikerült."; err.classList.remove("hidden"); return; }
      toast(`Szia újra, ${u.name.split(" ")[0]}! 👋`,"🥾");
      NAV.to(u.onboarded ? "#/vezerlopult" : "#/onboarding");
    }catch(e){ err.textContent=cloudAuthEnabled()?cloudAuthError(e):"Hibás e-mail vagy jelszó."; err.classList.remove("hidden"); }
    finally{ if(submit) submit.disabled=false; }
  };
};

VIEWS.register = () => `
<div class="auth-shell" style="min-height:70vh">
  <form class="card auth-card" id="reg-form" novalidate>
    <h1 class="mb0" style="font-size:1.7rem">Készítsd el a túraközpontodat</h1>
    <p class="muted">${cloudAuthEnabled()?"Ingyenes — a fiókod Supabase Auth-tal védett, a helyi túraadatok pedig offline is megmaradnak.":"Ingyenes — az adataid csak a saját böngésződben tárolódnak."}</p>
    <label class="f" for="rg-n">Neved</label><input class="input" id="rg-n" autocomplete="name" placeholder="Kovács Anna">
    <div style="height:.7rem"></div>
    <label class="f" for="rg-c">Honnan szoktál elindulni?</label><input class="input" id="rg-c" placeholder="Pl. Csíkszereda, Gyergyószentmiklós, Kolozsvár…">
    <div style="height:.7rem"></div>
    <label class="f" for="rg-e">E-mail-cím</label><input class="input" id="rg-e" type="email" autocomplete="email" placeholder="pelda@mail.hu">
    <div style="height:.7rem"></div>
    <label class="f" for="rg-p">Jelszó</label>
    <div class="pw-row"><input class="input" id="rg-p" type="password" autocomplete="new-password" placeholder="Min. 8 karakter"><button type="button" class="pw-eye" data-t="rg-p" aria-label="Jelszó mutatása">👁</button></div>
    <div class="pw-meter" id="rg-meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div style="height:.5rem"></div>
    <label class="f" for="rg-p2">Jelszó újra</label>
    <div class="pw-row"><input class="input" id="rg-p2" type="password" autocomplete="new-password"><button type="button" class="pw-eye" data-t="rg-p2" aria-label="Jelszó mutatása">👁</button></div>
    <label class="chk-row"><input type="checkbox" id="rg-t"><span>Elfogadom a <a href="#/rolunk">szolgáltatás feltételeit</a>.</span></label>
    <ul class="form-err hidden" id="rg-err" role="alert"></ul>
    <button class="btn btn-primary btn-lg btn-block" style="margin-top:.8rem">✅ Fiók létrehozása</button>
    <p class="auth-switch">Már van fiókod? <a href="#/belepes">Bejelentkezés</a></p>
  </form></div>`;
VIEWS.register.after = root => {
  const val = id => root.querySelector("#"+id).value;
  root.querySelectorAll(".pw-eye").forEach(b => b.onclick = () => { const t=root.querySelector("#"+b.dataset.t); t.type = t.type==="password"?"text":"password"; b.textContent = t.type==="password"?"👁":"🙈"; });
  const meter = root.querySelector("#rg-meter");
  root.querySelector("#rg-p").addEventListener("input", ev => { const v=ev.target.value;
    let sc = (v.length>=8?1:0)+(v.length>=12?1:0)+(/[a-z]/.test(v)&&/[A-Z]/.test(v)?1:0)+((/\d/.test(v)&&/[^A-Za-z0-9]/.test(v))?2:(/\d/.test(v)?1:0));
    sc=Math.min(4,sc); meter.className="pw-meter m"+sc; meter.querySelectorAll("i").forEach((el,i)=>el.classList.toggle("on",i<sc)); });
  root.querySelector("#reg-form").onsubmit = async e => { e.preventDefault();
    const errs=[];
    if(val("rg-n").trim().length<2) errs.push("Add meg a neved (legalább 2 karakter).");
    const EM = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if(!EM.test(val("rg-e").trim())) errs.push("Adj meg egy érvényes e-mail-címet (pl. neved@example.ro).");
    if(val("rg-p").length<8) errs.push("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
    else if(!/[a-zA-Z]/.test(val("rg-p")) || !/[0-9]/.test(val("rg-p"))) errs.push("A jelszóban legyen betű és szám is.");
    if(val("rg-p2")!==val("rg-p")) errs.push("A két jelszó nem egyezik meg.");
    if(!root.querySelector("#rg-t").checked) errs.push("Fogadd el a szolgáltatás feltételeit.");
    const ul=root.querySelector("#rg-err");
    if(errs.length){ ul.innerHTML=errs.map(x=>`<li>${x}</li>`).join(""); ul.classList.remove("hidden"); return; }
    const name=val("rg-n").trim(), email=val("rg-e").trim().toLowerCase(), password=val("rg-p"), city=val("rg-c").trim();
    const submit=root.querySelector("button[type=submit]"); if(submit) submit.disabled=true;
    try{
      if(cloudAuthEnabled()){
        const r=await window.__V54.api.authSignup(email,password,name,city);
        if(r&&r.pending){ ul.innerHTML="<li>Regisztráció létrejött. Erősítsd meg az e-mail címedet, majd jelentkezz be.</li>"; ul.classList.remove("hidden"); return; }
      } else {
        const r=Store.signup(name,email,password,city);
        if(r.err){ ul.innerHTML=`<li>${r.err}</li>`; ul.classList.remove("hidden"); return; }
      }
      const u=Store.me();
      if(!u){ ul.innerHTML="<li>A helyi munkamenet létrehozása nem sikerült.</li>"; ul.classList.remove("hidden"); return; }
      toast(`Üdv a túraközpontban, ${u.name.split(" ")[0]}! 👋`,"🎒");
      NAV.to("#/onboarding");
    }catch(e){ ul.innerHTML=`<li>${esc(cloudAuthEnabled()?cloudAuthError(e):"A regisztráció nem sikerült.")}</li>`; ul.classList.remove("hidden"); }
    finally{ if(submit) submit.disabled=false; }
  };
};
/* --- Onboarding kérdéssor (restore) --- */
let obAnswer = {};
const OB_STEPS = [
  {k:"from", t:"Honnan szoktál elindulni?", sub:"Közeledtünk a környék túráit és eseményeit.", input:true},
  {k:"style", t:"Milyen túrákon jársz szívesen?", multi:true, sub:"Csomaglistát, időtervet és ételvízt ehhez igazítjuk.",
   opts:[{v:"Könnyű, családi", i:"🧺"},{v:"Egynapos hegyi", i:"🥾"},{v:"Többnapos, sátorozós", i:"⛺"},{v:"Téli / gerinc", i:"❄️"}]},
  {k:"pace", t:"Mennyi idéd van jellemzően egy túrára?", sub:"Az időterv és a tempó ettől függ.",
   opts:[{v:"2–4 óra", i:"🌗"},{v:"Egy teljes nap", i:"🌞"},{v:"Hétvége", i:"🏕️"}]},
  {k:"company", t:"Kivel túrázol jellemzően?", sub:"A résztvevők és az utazás così ez alapján.",
   opts:[{v:"Egyedül", i:"🚶"},{v:"Kettő/párban", i:"👫"},{v:"Családdal", i:"👨‍👩‍👧"},{v:"Túracsoporttal", i:"👥"}]}
];
/* onboarding állapot */ let obStep = 0;
VIEWS.onboarding = () => {
  obStep = obStep||0; const s = Math.min(obStep, OB_STEPS.length);
  if(s >= OB_STEPS.length){
    return `<div class="auth-shell" style="min-height:70vh"><div class="card auth-card center" style="text-align:center">
      <div style="font-size:3rem">🥾</div><h1 class="mb0" style="font-size:1.6rem">Minden megvan, ${esc(Store.me()?Store.me().name.split(" ")[0]:"túrázó")}!</h1>
      <p class="muted">A preferenciáid alapján ellenőrzött forrásokból választhatsz útvonalat és eseményt.</p>
      <button class="btn btn-primary btn-lg btn-block" id="ob-fin" style="margin-top:1.1rem">Irány a személyes túraközpontom →</button>
    </div></div>`;
  }
  const step = OB_STEPS[s];
  return `<div class="wiz-wrap">
    <div class="center" style="margin-bottom:1.4rem">
      <span class="small muted" style="letter-spacing:.18em;text-transform:uppercase;font-weight:700">Gyors beállítás · ${s+1}./${OB_STEPS.length}</span>
      <h1 style="font-size:1.75rem;margin-bottom:.15rem">${step.t}</h1><p class="muted mb0">${step.sub||""}</p>
    </div>
    <div class="wiz-track">${OB_STEPS.map((_,i)=>`<i class="${i<=s?"on":""}"></i>`).join("")}</div>
    ${step.input ? `<div><label class="f" for="ob-from">Kiinduló helyed (város, falu)</label>
        <input class="input" id="ob-from" placeholder="Pl. Csíkszereda, Székelyudvarhely, Kolozsvár…" value="${esc(obAnswer[step.k]||Store.me().city||"")}"></div>` :
    `<div class="opt-grid">${step.opts.map(o=>{ const sel = step.multi ? (obAnswer[step.k]||[]).includes(o.v) : obAnswer[step.k]===o.v; return `
      <button class="opt ${sel?"sel":""}" data-val="${esc(o.v)}">${`<span class="oi">${o.i}</span>`}<span>${esc(o.v)}${o.d?`<small>${esc(o.d)}</small>`:""}</span></button>`}).join("")}</div>`}
    <div class="wiz-nav">
      <button class="btn btn-ghost" id="ob-prev" ${s===0?"disabled":""}>← Vissza</button>
      <button class="btn btn-primary" id="ob-next">${s===OB_STEPS.length-1?"Kész ✓":" tovább →"}</button>
    </div>
    ${s===0?'<p class="small center muted" style="margin-top:1.2rem">Ezek alapján ajánlunk túrákat, eseményeket és felszerelést. Bármikor módosíthatod a beállításokban.</p>':""}
  </div>`;
};
VIEWS.onboarding.after = root => {
  const step = OB_STEPS[obStep];
  root.querySelectorAll(".opt").forEach(o=>o.onclick=()=>{
    if(!step) return;
    if(step.multi){ const v=o.dataset.val, arr=obAnswer[step.k]||[]; const i=arr.indexOf(v);
      i>=0?arr.splice(i,1):arr.push(v); obAnswer[step.k]=arr; }
    else obAnswer[step.k]=o.dataset.val;
    render(); });
  const fin = root.querySelector("#ob-fin"); if(fin) fin.onclick = ()=>{ Store.setPrefs({onboarded:true, ob:obAnswer}); toast("Túraközpontod készen áll — jó tervezést! 🌿","✅"); NAV.to("#/vezerlopult"); };
  const prev = root.querySelector("#ob-prev"); if(prev) prev.onclick=()=>{ if(obStep>0){obStep--; render();} };
  const next = root.querySelector("#ob-next"); if(next) next.onclick=()=>{
    const s=OB_STEPS[obStep];
    if(s && s.input){ const f=root.querySelector("#ob-from"); obAnswer[s.k]=f?f.value:"Csíkszereda"; }
    if(obStep<OB_STEPS.length) obStep++; render(); };
};
