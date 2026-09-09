/* ============================================================
   TÚRAVAROS — BŐVÍTŐ MODUL (bump2) — 1. rész
   Állapotgép · készültség · ellenőrző · workspace-beépítés · súlyok
   ============================================================ */
"use strict";

const CAT7 = {"Hátizsák":"🎒 Alapfelszerelés","Bakancs":"🧦 Lábbelik","Öltözet":"🧥 Ruházat","Ivó":"💧 Víz","Étel":"🍎 Étel","Biztonság":"🩹 Biztonság","Navigáció":"🔦 Navigáció és elektronika","Sátor":"🏕️ Táborozás","Egyéb":"🎒 Alapfelszerelés","Védő":"🩹 Biztonság"};
const cat7 = c => CAT7[c] || "🎒 Alapfelszerelés";
const g2kg = g => (g>=1000 ? (g/1000).toFixed(2).replace(".",",")+" kg" : Math.round(g)+" g");
const escAttr = n => String(n).replace(/"/g,"'").replace(/</g,"&lt;");

/* ---------- 1) TÚRAPROJEKT-ÁLLAPOTOK ---------- */
function projectedStatus(t){
  if(t.status==="tervezés" || t.status==="jelentkezve"){
    const d = Store.dayDiff(t.date);
    if(d>=0 && d<=3) return "közelgő";
  }
  return t.status;
}
window.statusChip = s => {
  const m = STATUSES[s] || {ico:"🟡", label:s||"tervezés", cls:"chip-blue"};
  return `<span class="chip ${m.cls}" title="Túraprojekt-állapot">${m.ico} ${esc(m.label)}</span>`;
};
function statusMenu(t){
  const opts=["ötlet","bakancs","tervezés","teljesítve","archiválva"];
  openModal({ title:"Túraprojekt állapota",
    body:`<p class="muted small mt0">Életciklus: 💡 ötlet → ❤️ bakancslista → 🟡 tervezés → 🔵 közelgő (automatikus, 3 napon belül) → 🟢 teljesítve → 📖 archiválva.</p>
      <div class="opt-grid">${opts.map(s=>`<button class="opt ${t.status===s?"sel":""}" data-st="${s}"><span class="oi">${STATUSES[s].ico}</span><span>${STATUSES[s].label}</span></button>`).join("")}</div>`,
    onOpen(r){ r.querySelectorAll("[data-st]").forEach(b=>b.onclick=()=>{
      const s=b.dataset.st;
      if(s==="teljesítve"){ closeModal(); finishWizard(t); return; }
      if(s==="archiválva"){ Store.archiveTour(t.id); toast("A túra az archívumba került — az élmény megmarad.","📖"); }
      else { Store.setStatus(t.id, s); toast("Állapot: "+STATUSES[s].label, STATUSES[s].ico); }
      closeModal(); render(); }); } });
}

/* ---------- 2) KÉSZÜLTSÉGI MUTATÓ + 3) ELLENŐRZŐ ---------- */
function readiBar(t){
  if(t.status==="teljesítve"||t.status==="archiválva") return "";
  const r = Store.readiness(t);
  return `<div class="readi">
    <div class="flex between" style="width:100%">
      <span><b>Felkészültség</b> <span class="readi-pct">${r.pct}% kész</span></span>
      <button class="btn btn-ember btn-sm" id="rdi-check">Ellenőrizd a túrámat →</button></div>
    <div class="readi-track" role="progressbar" aria-valuenow="${r.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${r.pct}%"></i></div>
    <div class="small readi-missing">${r.missing.length ? `Még ${r.missing.length} dolog van hátra: ${r.missing.slice(0,3).map(m=>`<span class="readi-chip">☐ ${esc(m.label)}</span>`).join("")}${r.missing.length>3?`<span class="readi-chip">+${r.missing.length-3} többi</span>`:""}`
      : "🟢 Indulásra kész — jó utat! 🥾"}</div></div>`;
}
function readiCheckModal(t){
  const c = Store.tourCheck(t);
  openModal({ title:"🛃 Túra-ellenőrző — "+esc(t.title),
    body:`<p class="muted mt0"><b>${esc(c.head)}</b> · Felkészültség: <b>${c.pct}%</b></p>
      <div class="checker-list">${c.rows.map(x=>`<div class="checker ${x.ok?"ok":""}">
        <span>${x.ok?"✅":"☐"} ${esc(x.label)}</span>
        ${!x.ok&&x.goto?`<button class="btn btn-soft btn-sm" data-jump="${x.goto}">Kijavítom</button>`:""}</div>`).join("")}</div>`,
    footer:`<button class="btn btn-primary btn-block" data-close>Értelmezve</button>`,
    onOpen(r){ r.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>{ closeModal(); wsTab=b.dataset.jump; render(); }); } });
}
function saveTemplateModal(t){
  openModal({ title:"📐 Túrasablon ebből a túrából",
    body:`<p class="muted small mt0">A sablon magával viszi egy új túrába: csomaglista súlyostul, időterv, étel- és itallista, nehézség és napoksám.</p>
      <label class="f">Sablon neve</label><input class="input" id="tp-n" value="${esc(t.title)} — sablon">
      <label class="f" style="margin-top:.6rem">Ikon</label><input class="input" id="tp-i" maxlength="4" value="${/napkel|napfelk/.test((t.tags||[]).join()+t.title)?"🌄":(t.days>1?"🏕️":"🥾")}">
      <p class="small muted" style="margin-top:.5rem">${t.gear.length} csomag · ${t.timeline.length} időpont · ${t.food.length} étel tétel kerül a sablonba.</p>`,
    footer:`<button class="btn btn-primary btn-block" id="tp-save">Sablon mentése</button>`,
    onOpen(r){ r.querySelector("#tp-save").onclick=()=>{
      Store.saveTemplateFromTour(t.id, r.querySelector("#tp-n").value.trim()||t.title, r.querySelector("#tp-i").value.trim());
      closeModal(); toast("Sablon elmentve — új túránál egy koppintással előhívhatod.","📐"); }; } });
}

/* ---------- WORKSPACE-beépítés: állapotchip, készültség, gombok ---------- */
const _origWSafter2 = VIEWS.workspace.after;
VIEWS.workspace.after = (root, id) => {
  _origWSafter2(root, id);
  const t = Store.getTour(id); if(!t || !root.querySelector(".ws-title h1")) return;
  const ps = projectedStatus(t), sm = STATUSES[ps]||{};
  const sp=document.createElement("span"); sp.className="chip "+(sm.cls||"chip-blue"); sp.id="st-chip";
  sp.innerHTML=(sm.ico||"•")+" "+esc(sm.label||ps); sp.style.cursor="pointer"; sp.title="Állapot átállítása";
  sp.onclick=()=>statusMenu(t);
  root.querySelector(".ws-title h1").appendChild(sp);
  const actEl = root.querySelector(".ws-actions");
  if(actEl && !actEl.querySelector("#tmode-btn")){
    const b1=document.createElement("button"); b1.id="tmode-btn"; b1.className="btn btn-ghost btn-sm"; b1.innerHTML="⚡ Túra mód"; b1.onclick=()=>NAV.to("#/turamod/"+t.id);
    const b2=document.createElement("button"); b2.className="btn btn-soft btn-sm"; b2.innerHTML="📐 Sablonba mentés"; b2.onclick=()=>saveTemplateModal(t);
    actEl.prepend(b1); actEl.appendChild(b2);
  }
  const head = root.querySelector(".ws-stats");
  if(head && !root.querySelector(".readi")){
    const wrap=document.createElement("div"); wrap.innerHTML=readiBar(t);
    if(wrap.firstChild) head.parentNode.insertBefore(wrap.firstChild, head);
    const cb=root.querySelector("#rdi-check"); if(cb) cb.onclick=()=>readiCheckModal(t);
  }
};

/* ---------- 6+7) CSOMAGOLÁS V2: kategóriák, súlyok, hátizsák-kalkulátor ---------- */
const _origTab = wsTabHTML;
wsTabHTML = (t, catTour) => {
  if(wsTab==="felszereles") return gearV2(t);
  let h = _origTab(t, catTour);
  if(wsTab==="biztonsag") h += securityCardHTML(t);
  if(wsTab==="utvonal")   h = terepStripHTML(t) + h;
  return h;
};
function bpackBarsHTML(b){
  return b.rows.map(r=>`<div class="bar-row"><span class="bl">${esc(r.cat.replace(/^[^ ]+ /,""))}</span><span class="bt"><i style="width:${b.total?r.g/b.total*100:0}%"></i></span><span class="bv">${g2kg(r.g)}</span></div>`).join("");
}
function gearV2(t){
  const b = Store.backpack(t);
  const groups={}; t.gear.forEach(g=>{ const c=cat7(g.cat); (groups[c]=groups[c]||[]).push(g); });
  return `<div class="split2 gear2col">
    <div class="card panel">
      <div class="flex between wrapcol" style="margin-bottom:.4rem"><h3 style="margin:0">🎒 Csomaglista kategóriák szerint</h3>
        <span class="chip chip-green">${t.gear.filter(g=>g.checked).length}/${t.gear.length} bepakolva</span></div>
      ${Object.keys(groups).map(c=>`<div class="gear-cat">
        <div class="gear-cat-h">${c} <span class="muted small">· ${g2kg(groups[c].reduce((a,g)=>a+(+g.w||0),0))}</span></div>
        ${groups[c].map(g=>`<div class="ck ${g.checked?"done":""}">
          <input type="checkbox" data-gear="${escAttr(g.name)}" ${g.checked?"checked":""}>
          <span class="gear-name" style="flex:1;min-width:0">${g.icon||"🧰"} ${esc(g.name)}
            ${g.own?'<span class="gear-badge">saját cucc ✓</span>':''}
            ${g.buymode?'<span class="gear-badge buy">🛒 megvásárolandó</span>':''}
            ${!g.own&&!g.buymode?`<button class="gear-miniact" data-buymark="${escAttr(g.name)}" title="felvétel a vásárlólistába">🛒</button>`:''}
            <span class="gear-w"><input type="number" class="input" min="0" step="10" data-gearw="${escAttr(g.name)}" value="${+g.w||0}" aria-label="súly grammban"> g</span>
            <button class="icon-btn" style="width:26px;height:26px" data-gearrm="${escAttr(g.name)}" aria-label="tétel eltávolítása">✕</button></span>
        </div>`).join("")}</div>`).join("")}
      ${t.gear.some(g=>g.buymode)?`<div class="alert-strip" style="margin-top:.8rem"><span>🛒</span><div><b>Vásárlólista a túrához:</b> ${t.gear.filter(g=>g.buymode).map(g=>esc(g.name)).join(", ")}</div></div>`:""}
      <div class="flex" style="margin-top:1rem;gap:.5rem"><input class="input" id="gearq" placeholder="Plusz tétel (pl. szúnyogháló, vízfiltér)…"><button class="btn btn-primary btn-sm" id="gearadd">Hozzáad</button></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card panel"><h3>🎒 Teljes hátizsák súlya</h3>
        <div class="bpack-num" id="bpack-total"><b>${g2kg(b.total)}</b><span class="muted small"> — saját cucc: ${g2kg(b.own)}, beszerzendő: ${g2kg(b.buy)}</span></div>
        ${b.over?'<div class="alert-strip" style="margin:.4rem 0"><span>⚠️</span><div>Túl nehéz! 12 kg fölött a nyereg megérzi — vedd ki a dupla cuccot vagy oszd el a csapat közt.</div></div>'
        :b.heavy?'<div class="alert-strip" style="margin:.4rem 0;background:#FBF4DE;border-color:#eadfb0;color:#8a6d12"><span>🟠</span><div>Elérhető, de komoly csomag: 9 kg fölött érdemes átnézni, mi az, ami csak „biztonság kedvéért” van bent.</div></div>':''}
        <div id="bpack-rows">${bpackBarsHTML(b)}</div>
        <p class="small muted" style="margin:.6rem 0 0">Minden tétel súlyát átírhatod. A <a href="#/felszereles" style="color:var(--sky)">Felszerelésem</a> oldalon rögzítheted a saját cuccaid súlyát tartósan (1 l víz = 1 kg).</p></div>
      <div class="card panel"><h3>💡 Csomagolási tipp</h3>
        <p class="small muted mt0 mb0">Nehezet középre, felülre: sátor fólia, víz. Amire este kell (fejlámpa, kabát, zokni) – külön, gyors zsebbe, hogy ne kelljen kibontani a táskát.</p></div>
    </div></div>`;
}
const _origWire = wireTab;
wireTab = (root, t) => {
  _origWire(root, t);
  if(wsTab==="felszereles"){
    root.querySelectorAll("[data-gearw]").forEach(i=>i.onchange=()=>{ const g=t.gear.find(x=>x.name===i.dataset.gearw); if(!g) return;
      g.w=Math.max(0,+i.value||0); Store.save();
      const b=Store.backpack(t); const tt=root.querySelector("#bpack-total b"); if(tt) tt.textContent=g2kg(b.total);
      const br=root.querySelector("#bpack-rows"); if(br) br.innerHTML=bpackBarsHTML(b); });
    root.querySelectorAll("[data-buymark]").forEach(b=>b.onclick=e=>{e.preventDefault();const g=t.gear.find(x=>x.name===b.dataset.buymark); if(g){g.buymode=true; Store.save(); render();}});
    root.querySelectorAll("[data-gearrm]").forEach(b=>b.onclick=e=>{e.preventDefault(); t.gear=t.gear.filter(x=>x.name!==b.dataset.gearrm); Store.save(); render();});
  }
  wireSecurityCard(root, t);
  root.querySelectorAll("[data-ackr]").forEach(a=>a.onclick=()=>{ Store.ackFieldReport(a.dataset.ackr); render(); });
  root.querySelectorAll("[data-jreport]").forEach(a=>a.onclick=()=>{ reportModal({tourId:t.id, region:t.region||t.place, place:t.place}); });
};

/* ============================================================
   2. rész — BIZTONSÁGI KÁRTYA · MEGOSZTÁS · TEREPFI · SABLONOK ·
   FINISH-WIZARD · TÚRA MÓD
   ============================================================ */

/* ---------- 9) BIZTONSÁGI KÁRTYA a Biztonság fülön ---------- */
function firstTimeVal(t){ return t.meeting && /\d{2}:\d{2}/.test(t.meeting) ? t.meeting.match(/\d{2}:\d{2}/)[0] : (t.timeline.slice().sort((a,b)=>a.t.localeCompare(b.t))[0]||{}).t || "—"; }
function lastTimeVal(t){ return (t.timeline.slice().sort((a,b)=>a.t.localeCompare(b.t)).at(-1)||{}).t || (t.date?"":"")||"—"; }
function securityCardHTML(t){
  const shareUrl = t.shareCode ? `${location.origin}${location.pathname}#/osztott/${t.shareCode}` : "";
  return `<div class="card panel sec-card" style="margin-top:16px">
    <h3>🛡️ Biztonsági kártya — nyomtatható / megosztható lap</h3>
    <div class="sec-grid">
      <div class="sec-item"><span class="muted small">📍 Kiindulópont</span><b>${esc(t.place||t.region||"—")}</b></div>
      <div class="sec-item"><span class="muted small">🏔️ Cél</span><b>${esc(t.title)}</b></div>
      <div class="sec-item"><span class="muted small">🌐 Tervezett útvonal</span><b>${t.gpx?"GPX feltöltve — "+(t.waypoints.length||0)+" pont":t.waypoints.length?t.waypoints.map(w=>esc(w.name)).join(" → "):"jelzett túraútvonal (túraterv)"}</b></div>
      <div class="sec-item"><span class="muted small">📅 Dátum</span><b>${t.date?fmtDateFull(t.date)+" · "+dowHU(t.date):"—"}</b></div>
      <div class="sec-item"><span class="muted small">🕕 Indulási idő</span><b>${esc(firstTimeVal(t))}</b></div>
      <div class="sec-item"><span class="muted small">🕗 Várható visszaérkezés</span><b>${esc(lastTimeVal(t))}${t.durationH?" (+"+Math.round(t.durationH)+1+" ó tartalék)":""}</b></div>
      <div class="sec-item"><span class="muted small">👥 Résztvevők</span><b>${t.participants.length?t.participants.map(p=>esc(p.name)).join(", "):"egyedül"} · ${t.participants.length&&t.participants.some(p=>!p.confirmed)?"⚠ megerősítés hiányzik":"✓"}</b></div>
      <div class="sec-item"><span class="muted small">📏 Táv · szint</span><b>${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m · kb ${t.durationH||"?"} ó</b></div>
    </div>
    <div class="flex wrapcol" style="margin-top:1rem;gap:.6rem">
      <a class="btn btn-ghost btn-sm" id="sec-print" href="#/biztonsag/${t.id}" target="_blank" rel="noopener">🖨 Nyomtatható biztonsági lap</a><button class="btn btn-primary btn-sm" id="sec-share">${t.shareCode?"🔗 Megosztási link másolása":"🔗 Túraterv megosztása (link)"} </button>
      <button class="btn btn-ghost btn-sm" data-copylink="https://turavaros.hu/t/${t.shareCode||""}">⧉ Hivatalos link másolása</button>
      <a class="btn btn-soft btn-sm" href="${shareUrl||"#"}" ${shareUrl?"":"style=\"display:none\""} target="_self">👁 Megosztott nézet megnyitása</a>
    </div>
    <p class="small muted" style="margin:.8rem 0 0">Baleset, eltévedés: hívjd a <b>112</b>-t, és a kártya adatait add meg. Tartsd a telefonodon képernyőképen — az offline mentés a következő fejlesztési ütem.</p>
  </div>`;
}
function wireSecurityCard(root, t){
  const s = root.querySelector("#sec-share");
  if(s) s.onclick = async ()=>{
    if(!t.shareCode){ t.shareCode = Store.uid("sh").replace("sh_","sh") + Date.now().toString(36); Store.save(); }
    const url = `${location.origin}${location.pathname}#/osztott/${t.shareCode}`;
    try{ await navigator.clipboard.writeText(url); toast("Megosztási link kimásolva — vésd be a családának!","🔗"); }
    catch(e){ openModal({title:"Túraterv megosztása", body:`<input class="input" readonly value="${esc(url)}">`, footer:`<button class="btn btn-primary btn-block" data-close>Ok</button>`}); }
    render();
  };
  const cp = root.querySelector("[data-copylink]");
  if(cp) cp.onclick=async e=>{ try{ await navigator.clipboard.writeText(e.target.dataset.copylink); toast("Link kimásolva","⧉"); }catch(err){ toast("A böngésző nem enged másolást","⚠️"); } };
}

/* ---------- Megosztott nézet (csak a szükséges infók) ---------- */
function findShared(code){
  try{ const db=JSON.parse(localStorage.getItem("turavaros_v1"));
    for(const k in db.data){ const t=(db.data[k].tours||[]).find(x=>x.shareCode===code); if(t) return {t, owner:(db.users[k]||{}).name||""}; }
  }catch(e){} return null;
}
VIEWS.share = (code) => {
  const f = findShared(code);
  if(!f) return `<div class="auth-shell" style="min-height:70vh"><div class="card auth-card">
    <div class="empty em-ico">🧭</div><h1>Ez a túraterv nem található</h1>
    <p class="muted">A link lejárt, vagy a megosztott terv már nem érhető el ezen az eszközön.</p>
    <a class="btn btn-primary" href="#/">Irány a Túratárs</a></div></div>`;
  const t=f.t;
  return `<div class="wrap" style="max-width:680px;padding:28px 16px 60px">
    <div class="card panel" style="border-radius:22px">
      <div class="img-wrap" style="height:150px;border-radius:14px 14px 0 0">${imgTag(t.img,t.title)}</div>
      <h1 style="font-size:1.7rem;margin-top:1.1rem">${esc(t.title)}</h1>
      <p class="muted mt0">Biztonsági kártya — ${f.owner?`közzétéve: ${esc(f.owner)} túrája`:""}. ${t.date?fmtDateFull(t.date):""} · ${dowHU(t.date)}</p>
      <div class="sec-grid" style="margin-top:1.2rem">
        <div class="sec-item"><span class="muted small">📍 Kiindulás</span><b>${esc(t.place||t.region||"—")}</b></div>
        <div class="sec-item"><span class="muted small">🕕 Indulás</span><b>${esc(firstTimeVal(t))}</b></div>
        <div class="sec-item"><span class="muted small">🕗 Várható hazaérkezés</span><b>${esc(lastTimeVal(t))}</b></div>
        <div class="sec-item"><span class="muted small">📏 Táv · szint</span><b>${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m</b></div>
        <div class="sec-item" style="grid-column:1/-1"><span class="muted small">👥 A csapat</span><b>${t.participants.length?t.participants.map(p=>esc(p.name)).join(", "):"egyedül"}</b></div>
      </div>
      <div class="alert-strip" style="margin-top:1rem"><span>🆘</span><div>Ha nem érkezik meg a jelzett idő +2 óráig: 112, és a fenti útvonalat add meg a segélyszolgálatnak.</div></div>
      <p class="small muted" style="margin-top:1.2rem">Ez az oldal csak a biztonsági szempontból fontos adatokat tartalmazza — képeket, jegyzeteket és a csomaglistát nem.</p>
      <a class="btn btn-primary" href="#/">Túratárs — tervezd meg a te túrádat is</a>
    </div></div>`;
};

/* ---------- 11) TEREPRI JELENTŐK ---------- */
function terepBadge(r){ const f=Store.reportFresh(r), acked = Store.me && Store.myData && r.ackedBy!==undefined;
  const col = f.cls==="fresh" ? "#3E8E5F" : (f.cls==="old" ? "#E07A2F" : "#8a8f7f");
  const cls2 = f.cls==="fresh"?"chip-green":f.cls==="old"?"chip-ember":"chip-sand";
  return `<span class="chip ${cls2}" style="font-size:.66rem">●&nbsp;${esc(f.txt)}</span>`;
}
function terepRow(r, opts={}){
  const t = r.tour?tourById(r.tour):null;
  const age = Store.reportFresh(r);
  const ty = (typeof TEREP_TYPES!=="undefined"?TEREP_TYPES:[]).find(x=>x.v===r.type)||{i:"ℹ️"};
  return `<div class="nrow terep ${age.cls}" ${opts.compact&&age.cls==="stale"?`style="opacity:.62"`:""}>
    <span class="nic">${ty.i}</span>
    <div style="flex:1;min-width:0">
      <div class="flex between wrapcol"><b style="font-size:.95rem">${esc(r.type)} <span class="muted small" style="font-weight:400">· ${esc(r.region||r.place||"")}</span></b>
      ${terepBadge(r)}</div>
      <div style="margin-top:.15rem">${esc(r.text)}</div>
      <div class="small muted" style="margin-top:.25rem">${esc(r.author)} · ${(r.ts||r.date).slice(0,16).replace("T"," ")}
        ${t?` · <a href="#/turak/${t.id}" style="color:var(--sky)">${esc(t.name)}</a>`:""}</div>
      ${age.warn && !Store.me()? "": age.warn && (Store.myData().reportAck[r.id]) ? `<div class="small" style="color:var(--moss)">✓ Te is megerősítetted, hogy aktuális.</div>`
        : age.warn ? `<div class="small" style="margin-top:.3rem">⚠ ${ty.i} Friss ez még?
            <button class="btn btn-soft btn-sm" data-ackr="${r.id}" style="margin-left:.4rem">Igen, még aktuális</button></div>`:""}
    </div>${r.photo?`<img src="${r.photo}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:10px;flex:none" onerror="this.remove()">`:""}</div>`;
}
function terepStripHTML(t){
  const rs = Store.reportsForTour(t).slice(0,3);
  return `<div class="terep-strip">
    <div class="flex between wrapcol" style="margin-bottom:.2rem">
      <b class="small">🌍 Terepi infók — ${esc(t.region||t.place||"")}</b>
      <button class="btn btn-soft btn-sm" data-jreport>Jelentek valami</button></div>
    ${rs.length? rs.map(r=>terepRow(r,{compact:1})).join("") : `<p class="small muted mb0">Nincs friss jelentés ehhez a tájegységhez. Te látsz valamit az ösvényen? Jelezd!</p>`}
  </div>`;
}
function reportModal(pre){
  const T = (typeof TEREP_TYPES!=="undefined"?TEREP_TYPES:[]);
  openModal({ title:"🌍 Terepi jelentés",
    body:`<p class="muted small mt0">A többi túrázó is látni fogja — de ne tölj fel olyat, ami 3 hetes: a rendszer a frissességet súlyozza.</p>
      <label class="f">Típus</label><select class="input" id="tm-t">${T.map(x=>`<option>${x.v}</option>`).join("")}</select>
      <div style="height:.7rem"></div>
      <label class="f">Tereg / helyszín</label><input class="input" id="tm-p" value="${esc(pre.region||"")}" placeholder="Pl. Hargita — Ocland-ösvény">
      <div style="height:.7rem"></div>
      <label class="f">Mit láttál?</label><textarea class="input" id="tm-x" rows="3" placeholder="Röviden, konkrétan: hol, milyen állapotban"></textarea>
      <label class="f" style="margin-top:.7rem">Fotó (opcionális, maximum ~150 KB)</label>
      <input type="file" id="tm-ph" accept="image/*" class="input" style="padding:.5em">
      ${pre.tourId?`<p class="small muted">Hozzárendelve: ${esc(Store.getTour(pre.tourId)?Store.getTour(pre.tourId).title:pre.tourId)}</p>`:""}`,
    footer:`<button class="btn btn-primary btn-block" id="tm-save">Jelentés beküldése</button>`,
    onOpen(r){ r.querySelector("#tm-save").onclick=()=>{
      const txt=r.querySelector("#tm-x").value.trim(), pl=r.querySelector("#tm-p").value.trim();
      if(!txt || !pl){ toast("Kérj helyszínt és leírást","⚠️"); return; }
      const ph=r.querySelector("#tm-ph").files[0];
      const fin=(purl)=>{ Store.addFieldReport({type:r.querySelector("#tm-t").value, region:pl.split("—")[0].trim(), place:pl, text:txt, tour:pre.tourId||null, photo:purl||null});
        closeModal(); toast("Köszönjük — a jelentés látható a többieknek.","🌍"); render(); };
      if(ph){ const fr=new FileReader(); fr.onload=()=> fin(fr.result.length<180000?fr.result:null); fr.readAsDataURL(ph); }
      else fin(null); }; } });
}
VIEWS.terepi = () => {
  if(!Store.me()) return `<div class="wrap pub-section"><h1>Terepi infók</h1><p class="muted">A túrázók friss jelentései egy helyen — de a böngészéshez lépj be a túraközpontba.</p><a class="btn btn-primary" href="#/belepes">Bejelentkezés</a></div>`;
  const all = Store.fieldReports().slice().sort((a,b)=>((b.ts||b.date).localeCompare(a.ts||a.date)));
  const T = [...new Set((typeof TEREP_TYPES!=="undefined"?TEREP_TYPES.map(x=>x.v):[]))];
  return dash("#/terepi")(`
    <div class="dash-top"><div><h1>Terepi infók 🌍</h1><div class="hello">Állatok, kidőlt fák, lezárások, források — aki jár utána, jelez. A frissességű infók erősebbek, a 3 hetesek tompaak és megerősítést kérnek.</div></div>
      <button class="btn btn-ember" id="tr-add">➕ Új jelentés</button></div>
    <div class="filter-row"><span class="chip chip-sand">${all.filter(r=>Store.reportFresh(r).cls==="fresh").length} friss</span>
      <span class="chip chip-ember">${all.filter(r=>Store.reportFresh(r).cls==="old").length} frissülendő</span>
      <span class="chip chip-sand">${all.filter(r=>Store.reportFresh(r).cls==="stale").length} régi</span>
      <span class="muted small">Sajátjaid: ${Store.myData().terepi.length}</span></div>
    <div class="card panel" style="padding:.2rem 0">${all.map(r=>terepRow(r,{})).join("")}</div>`);
};
VIEWS.terepi.after = root => { root.querySelector("#tr-add").onclick=()=>reportModal({region:(Store.me().prefsOnb||{}).from||""});
  root.querySelectorAll("[data-ackr]").forEach(a=>a.onclick=()=>{ Store.ackFieldReport(a.dataset.ackr); render(); }); };

/* ---------- 5) SABLONKEZELŐ NÉZET ---------- */
VIEWS.templates = () => {
  const tpls = Store.allTemplates(); const mine = tpls.filter(x=>x.custom);
  return dash("#/sablonok")( `
    <div class="dash-top"><div><h1>Túrasablonok 📐</h1><div class="hello">Alapíts új túrát Preparation-ból — vagy mentsd el a beállt tervedet.</div></div>
      <a class="btn btn-primary" href="#/uj-tura">➕ Új túra sablonból</a></div>
    <h2 style="font-size:1.1rem">Alapértelmezett</h2>
    <div class="grid g2">${(tpls.filter(x=>!x.custom)).map(x=>tplCard(x)).join("")}</div>
    <h2 style="font-size:1.1rem;margin-top:1.6rem">Sajátjaim (${mine.length})</h2>
    ${mine.length?`<div class="grid g2">${mine.map(x=>tplCard(x)).join("")}</div>`:`<p class="muted">Még nincs saját sablonod. Egy beállt túrát a <b>Túra módosítása</b> gombbal tudsz elmenteni.</p>`}` );
};
function tplCard(x){
  return `<div class="card panel" style="border-radius:16px">
    <div class="flex"><span style="font-size:1.6rem;flex:none">${x.icon||"📐"}</span>
      <div style="min-width:0"><b>${esc(x.name)}</b> ${x.custom?'<span class="chip chip-pine" style="font-size:.6rem">saját</span>':""}
      <div class="meta" style="font-size:.8rem"><span>${x.days||1} nap · ${x.difficulty||"Közepes"}</span><span>🎒 ${(x.gear||[]).length} csomag</span><span>⏱ ${x.timeline&&x.timeline.length||0} időpont</span></div></div></div>
    <p class="small muted" style="margin:.6rem 0 .2rem">${esc(x.desc||"")}${x.tasks&&x.tasks.length?` · teendők: ${x.tasks.slice(0,2).join(", ")}`:""}…
    </p>
    <div class="flex" style="gap:.5rem;margin-top:.5rem">
      <button class="btn btn-primary btn-sm" data-tplnew="${x.id}">🥾 Túrát ebből</button>
      ${x.custom?`<button class="btn btn-danger btn-sm" data-tpldel="${x.id}">Törlés</button>`:""}</div></div>`;
}
VIEWS.templates.after = root => {
  root.querySelectorAll("[data-tplnew]").forEach(b=>b.onclick=()=>{
    const tpl=Store.templateById(b.dataset.tplnew); const d=Store.myData();
    const t=Store.newTourFromDraft({ title:`${tpl.name} — ${d.tours.filter(x=>x.templateId===tpl.id).length+1}. kiadás`, place:"", date:"", days:tpl.days||1, difficulty:tpl.difficulty||"Közepes",
      durationH:tpl.hours||(tpl.days>1?5:3), tags:(tpl.tags||[]).slice(), meeting:tpl.meeting||"", templateId:tpl.id });
    Store.applyTemplate(t.id, tpl.id); render();
    toast("Sablon alapján új projektre váltottál — töltsd ki a dátumot/helyszínt.","📐");
  });
  root.querySelectorAll("[data-tpldel]").forEach(b=>b.onclick=()=>confirmDlg("Sablon törölése?", "Törlés", ()=>{ Store.deleteTemplate(b.dataset.tpldel); render(); }));
};

/* ---------- 16) TÚRA UTÁNI 5-LÉPÉSES FOLYAMAT ---------- */
function finishWizard(t){
  const d=Store.myData(), ex=d.journal.find(j=>j.tourId===t.id);
  const steps=[
    ()=>`<div class="center"><p class="muted mt0">🥾 <b>${esc(t.title)}</b> — ${t.date?fmtDateFull(t.date):""}</p>
      <h2 style="font-size:1.35rem">Milyen volt?</h2>
      <div class="mood-row">${[["😫","Nagyon nehéz"],["🙂","Jó"],["😍","Fantasztikus"]].map(m=>`<button class="mood-pick ${wizF.mood===m[0]?"sel":""}" data-mood="${m[0]}">${m[0]}<small>${m[1]}</small></button>`).join("")}</div>
      <p class="small muted">Csillagokban is: ${[1,2,3,4,5].map(i=>`<button class="star-btn ${i<=wizF.rating?"on":""}" data-star="${i}">★</button>`).join("")}</p></div>`,
    ()=>`<h2 style="font-size:1.35rem">Táv és idő — amit a tervből átvettem</h2>
      <div class="grid g2"><div><label class="f">Megtett táv (km)</label><input class="input" id="fw-km" type="number" step=".1" value="${wizF.km}"></div>
      <div><label class="f">Tényleges idő (óra)</label><input class="input" id="fw-h" type="number" step=".5" value="${wizF.h}"></div></div>
      <p class="small muted">A szint és a hely automatikusan jön a túratervből. Felülírhatod a terv adatait, ha másképp alakult.</p>`,
    ()=>`<h2 style="font-size:1.35rem">Fotók hozzáadása</h2>
      <input type="file" accept="image/*" multiple id="fw-ph" class="input" style="padding:.6em">
      <p class="small muted">A korábban feltöltött ${t.photos.length} túrakép itt marad. Max ~8 kép az memóriabarát.</p>
      <div class="ph-grid" style="margin-top:.6rem">${wizF.photos.map(p=>`<div class="img-wrap" style="aspect-ratio:1"><img src="${p}" onerror="this.remove()"></div>`).join("")}</div>`,
    ()=>`<h2 style="font-size:1.35rem">Élmény, történet</h2>
      <textarea class="input" id="fw-note" rows="4" placeholder="Pl. Gyönyörű idő volt. A felső szakasz sáros volt, de megérte.">${esc(wizF.note)}</textarea>`,
    ()=>`<h2 style="font-size:1.35rem">Tanulság + láthatóság</h2>
      <label class="f">💡 Mit tanultam ebből a túrából?</label>
      <textarea class="input" id="fw-lesson" rows="2" placeholder="Pl. Legközelebb több vizet viszek.">${esc(wizF.lesson)}</textarea>
      <label class="f" style="margin-top:.7rem">🔒 Ki lássa az élményt az Élménykönyvben?</label>
      <div class="seg">${["privát","csak túratársak","nyilvános"].map(p=>`<label class="seg-opt ${wizF.privacy===p?"on":""}"><input type="radio" name="fwpr" value="${p}" ${wizF.privacy===p?"checked":""}> ${p==="privát"?"🔒":p==="csak túratársak"?"👥":"🌍"} ${p}</label>`).join("")}</div>
      <p class="small muted">Az élmény a te naplód — a megosztás itt opció, nem alapértelmezés.</p>`];
  let wizF = { mood: ex&&ex.mood||"", rating: ex&&ex.rating||0, km: +t.lengthKm||0, h: +t.durationH||0,
    photos: (t.photos||[]).slice(0,8), note: ex&&ex.note||"", lesson: ex&&ex.lesson||"", privacy: ex&&ex.privacy||"privát", step:0 };
  const total=steps.length;
  function paint(back){
    if(!back) wizF.step=Math.max(0,Math.min(total-1,wizF.step));
    openModal({ title:`🥾 Túra utáni folyamat — ${Math.min(wizF.step+1,total)}. a ${total} lépésből`,
      body: steps[wizF.step](),
      footer:`<div class="flex between">${wizF.step>0?`<button class="btn btn-ghost btn-sm" id="fw-prev">← Vissza</button>`:"<span></span>"}
        <button class="btn ${wizF.step===total-1?"btn-ember":"btn-primary"}" id="fw-next">${wizF.step===total-1?"✓ Kész — megőrzöm":"Tovább →"}</button></div>`,
      onOpen(r){
        const collect=()=>{ const km=r.querySelector("#fw-km"); if(km) wizF.km=+km.value; const h=r.querySelector("#fw-h"); if(h) wizF.h=+h.value;
          const note=r.querySelector("#fw-note"); if(note) wizF.note=note.value; const l=r.querySelector("#fw-lesson"); if(l) wizF.lesson=l.value;
          const pr=r.querySelector("input[name=fwpr]:checked"); if(pr) wizF.privacy=pr.value; };
        r.querySelectorAll("[data-mood]").forEach(b=>b.onclick=()=>{ collect(); wizF.mood=b.dataset.mood; paint(); });
        r.querySelectorAll("[data-star]").forEach(b=>b.onclick=()=>{ collect(); wizF.rating=+b.dataset.star; paint(); });
        r.querySelectorAll('[name="fwpr"]').forEach(b=>b.onchange=()=>{collect();});
        const ph=r.querySelector("#fw-ph"); if(ph) ph.onchange=()=>{ [...ph.files].slice(0,6).forEach(f=>{ const rd=new FileReader(); rd.onload=()=>{ if(rd.result.length<500000) wizF.photos.push(rd.result); paint(true); }; rd.readAsDataURL(f); }); };
        const pb=r.querySelector("#fw-prev"); if(pb) pb.onclick=()=>{ collect(); wizF.step--; paint(true); };
        r.querySelector("#fw-next").onclick=()=>{
          collect();
          if(wizF.step<total-1){ wizF.step++; paint(); return; }
          Store.completeTour(t.id, { rating:wizF.rating||5, note:wizF.note, photos:wizF.photos, mood:wizF.mood,
            lesson:wizF.lesson, privacy:wizF.privacy, km:wizF.km, h:wizF.h });
          closeModal(); toast("🟢 Teljesítve — és meg is örökítetve az Élménykönyvben.","📖"); render();
        };
      }});
  }
  paint();
}
/* a régi naplós flow helyett ez fut (workspace.finishFlow still létezik — finomhang: teljesítés = 5 lépés) */
const _origFinishFlow = window.finishFlow;
window.finishFlow = (t, forceLog)=>{ if(t.status==="teljesítve" || forceLog) finishWizard(t); else finishWizard(t); };

/* ---------- 8) TÚRA MÓD (mobil, minimalista) ---------- */
VIEWS.tourmode = (id)=>{
  const t=Store.getTour(id); if(!t) return `<div class="wrap center" style="padding:2rem">A túra nem található. <a href="#/turaim">← Túráim</a></div>`;
  const r=Store.readiness(t);
  const b=Store.backpack(t);
  return `<div class="tmode">
    <div class="tm-top"><a href="#/tura/${t.id}">← Munkaterület</a>
      <span class="small">🥾 <b>${esc(t.title)}</b>${t.date?" · "+fmtDate(t.date):""}</span>
      <span class="tm-readi" title="Felkészültség">${r.pct}%</span></div>
    ${t.coords&&t.date?`<div class="tm-map" id="tm-map" data-lat="${t.coords.lat}" data-lng="${t.coords.lng}"></div>`
      :`<div class="tm-map tm-nomap">📍 ${esc(t.place||"nincs pont megadva")}</div>`}
    <div class="tm-tiles">
      <a class="tm-tile" href="${t.coords?`https://www.google.com/maps/dir/?api=1&destination=${t.coords.lat},${t.coords.lng}&travelmode=walking`:"#"}" target="_blank" rel="noopener"><span class="tm-ic">🗺️</span><b>Útvonal</b><small>${t.gpx?"GPX-rögzítve":t.waypoints.length?"saját útvonal":"túraterv szerint"}</small></a>
      <button class="tm-tile" id="tm-pack"><span class="tm-ic">🎒</span><b>Csomaglista</b><small>${t.gear.filter(g=>g.checked).length}/${t.gear.length} · ${g2kg(b.total)}</small></button>
      <button class="tm-tile" id="tm-time"><span class="tm-ic">⏰</span><b>Időterv</b><small>indulás: ${esc(firstTimeVal(t))}</small></button>
      <button class="tm-tile" id="tm-note"><span class="tm-ic">📝</span><b>Gyors jegyzet</b><small>${(t.notes||"").length?esc((t.notes||"").slice(0,18))+"…":"üres"}</small></button>
      <button class="tm-tile" id="tm-photo"><span class="tm-ic">📸</span><b>Fotó</b><small>${t.photos.length} a galériában</small></button>
      <button class="tm-tile tm-sos" id="tm-sos"><span class="tm-ic">🆘</span><b>Fontos infók</b><small>112 · csapat · idő</small></button>
    </div>
    ${t.status!=="teljesítve"?`<button class="btn btn-ember btn-lg btn-block" id="tm-done" style="margin-top:14px">✓ Túra teljesítve — élmény rögzítése</button>`:""}
    <p class="small center" style="opacity:.5;margin-top:14px">Túra mód — alul a sáv nem zavar; offline térkép és GPS a következő ütemben.</p>
    <div style="height:20px"></div></div>`;
};
VIEWS.tourmode.after = (root,id)=>{
  const t=Store.getTour(id); if(!t) return;
  const mapEl=root.querySelector("#tm-map");
  if(mapEl && mapEl.dataset.lat && window.L){ const m=MapKit.make(mapEl,{scroll:false}); if(m){ const la=+mapEl.dataset.lat, ln=+mapEl.dataset.lng;
    m.setView([la,ln],13); MapKit.pin(m,la,ln,"pin-plan",`🥾 ${esc(t.title)}`);
    if(t.waypoints.length) L.polyline([[la,ln],...t.waypoints.map(w=>[w.lat,w.lng])],{color:"#1C4A36",weight:4}).addTo(m); } }
  const done=root.querySelector("#tm-done"); if(done) done.onclick=()=>finishWizard(t);
  const pack=root.querySelector("#tm-pack"); if(pack) pack.onclick=()=>{
    openModal({ title:"🎒 Csomaglista — érintésre pipál",
      body:`<div id="tm-gear">${t.gear.map(g=>`<label class="ck ${g.checked?"done":""}" style="padding:.85em .6em;border-bottom:1px solid var(--line);font-size:1.05rem">
        <input type="checkbox" data-tmg="${escAttr(g.name)}" ${g.checked?"checked":""}> ${g.icon||"🧰"} ${esc(g.name)} <small class="muted">${g.w?g2kg(g.w):""}</small></label>`).join("")}</div>`,
      footer:`<button class="btn btn-primary btn-block" data-close>Kész</button>`,
      onOpen(r){ r.querySelectorAll("[data-tmg]").forEach(c=>c.onchange=()=>{ const g=t.gear.find(x=>x.name===c.dataset.tmg); g.checked=c.checked; c.closest(".ck").classList.toggle("done",c.checked); Store.save(); }); }}); };
  const tm=root.querySelector("#tm-time"); if(tm) tm.onclick=()=>{
    openModal({ title:"⏰ Időterv", body:`<div class="tl-item" style="font-size:1.15rem">${t.timeline.map(x=>`<div class="flex" style="padding:.5rem 0;gap:1rem"><b class="tl-time">${x.t}</b><span>${esc(x.l)}</span></div>`).join("")}</div>` }); };
  const nt=root.querySelector("#tm-note"); if(nt) nt.onclick=()=>{
    openModal({ title:"📝 Gyors jegyzet", body:`<textarea class="input" id="tmn" rows="5">${esc(t.notes||"")}</textarea>
      <p class="small muted">Azonnal mentődik a túratervbe.</p>`,
      footer:`<button class="btn btn-primary btn-block" id="tmn-save">Mentés</button>`,
      onOpen(r){ r.querySelector("#tmn-save").onclick=()=>{ Store.updateTour(t.id,{notes:r.querySelector("#tmn").value}); closeModal(); toast("Jegyzet mentve","📝"); }; }}); };
  const ph=root.querySelector("#tm-photo"); if(ph) ph.onclick=()=>{ const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.multiple=true;
    inp.onchange=()=>{ [...inp.files].slice(0,6).forEach(f=>{ const rd=new FileReader(); rd.onload=()=>{ t.photos.push(rd.result); Store.save(); render(); }; rd.readAsDataURL(f); }); }; inp.click(); };
  const sos=root.querySelector("#tm-sos"); if(sos) sos.onclick=()=>{
    openModal({ title:"🆘 Fontos infók — indulás előtt / baj esetén",
      body:`<div class="sec-grid">
        <div class="sec-item"><span class="muted small">📍 Honnan indultál</span><b>${esc(t.place||"—")}</b></div>
        <div class="sec-item"><span class="muted small">📅 Mikor</span><b>${t.date?fmtDateFull(t.date):"—"}</b></div>
        <div class="sec-item"><span class="muted small">🕕 Indulás · haza</span><b>${esc(firstTimeVal(t))} → ${esc(lastTimeVal(t))}</b></div>
        <div class="sec-item"><span class="muted small">🗺️ Táv · szint</span><b>${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m</b></div>
        <div class="sec-item" style="grid-column:1/-1"><span class="muted small">👥 Csapat</span><b>${t.participants.map(p=>esc(p.name)).join(", ")||"egyedül"}</b></div></div>
      <div class="alert-strip" style="margin-top:.9rem"><span>🆘</span><div><b>112</b> — a fenti adatokat mondd el. Ha nem jöttél vissza a becsült idő +2 óráig, a megosztott terv linkje (#/osztott/…) segít a keresésben.</div></div>
      ${t.meeting?`<p class="small"><b>Találkozó:</b> ${esc(t.meeting)}</p>`:""}` }); };
};

/* ---------- 4) TÚRA ELŐTTI KÖZPONT — widget a dashboardba ---------- */
function prepHub(t){
  const r = Store.readiness(t), dd = Store.dayDiff(t.date);
  const wtr = t.weatherRain ? `<span class="chip chip-ember">🌧️ ${t.weatherRain}% eső</span>` : "";
  const lines = [
    t.gpx||t.waypoints.length||t.coords?"🟢 Útvonal kész": "🔴 Útvonal nincs beállítva",
    t.participants.every(p=>p.confirmed)?"🟢 Résztvevők rendben":`🟡 ${t.participants.filter(p=>!p.confirmed).length} résztvevő nem erősített`,
    t.gear.every(g=>g.checked)?"🟢 Csomag ellenőrizve":`🟡 ${t.gear.filter(g=>!g.checked).length} felszerelési elem még nincs kipipálva`,
    t.weatherChecked?"🟢 Időjárás nézve":`🔴 Időjárás ellenőrzése szükséges`];
  const todayTasks=[];
  if(!t.weatherChecked) todayTasks.push("Időjárás ellenőrzése");
  const gu=t.gear.filter(g=>!g.checked)[0]; if(gu) todayTasks.push(gu.name+" ellenőrzése");
  if(!t.food.every(f=>f.checked)) todayTasks.push("Étel összekészítése");
  if(t.participants.some(p=>!p.confirmed)) todayTasks.push("Résztvevők recall (megerősítés kérése)");
  todayTasks.push("Telefon feltöltése, powerbank");
  return `<div class="prep-hub">
    <div class="ph-top"><span class="ph-day">${dd===0?"MA":dd===1?"HOLNAP":dd+" NAP MÚLVA"}</span>
      <b class="ph-ic">${dd<=1?"🥾":"🗓️"} ${dd<=1?"HOLNAPI TÚRÁD":"KÖZELEGŐ TÚRÁD"}</b>${wtr}</div>
    <h2 class="ph-title">${esc(t.title)}</h2>
    <div class="ph-facts">📅 ${fmtDateFull(t.date)} · 🕕 Indulás: <b>${esc(firstTimeVal(t))}</b>${t.meeting?` · 📍 Találkozó: ${esc(t.meeting)}`:""} · 📏 ${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m</div>
    <div class="ph-readi"><span class="small">Felkészültség</span><b>${r.pct}%</b>
      <div class="readi-track"><i style="width:${r.pct}%"></i></div></div>
    <div class="ph-cols"><div class="ph-col"><b class="small">ÁllAPOT</b>${lines.map(l=>`<div class="ph-line ${/🔴/.test(l)?"red":/🟡/.test(l)?"amber":""}">${l}</div>`).join("")}</div>
      <div class="ph-col"><b class="small">MAI TEENDŐK</b>${todayTasks.slice(0,4).map(x=>`<label class="ck ph-task"><input type="checkbox" ${t.notes.includes(x)?"checked":""} data-ptask="${escAttr(x)}"> ${esc(x)}</label>`).join("")}</div></div>
    <div class="ph-btns">
      <a class="btn btn-lg" style="background:#fff;color:var(--pine);border:1.5px solid var(--line)" href="#/tura/${t.id}">Túra megnyitása</a>
      <button class="btn btn-primary btn-lg" id="ph-go">${t.readOk?"✓ Megint jelzem — indulásra kész":"➜ Indulásra kész vagyok"}</button></div>
  </div>`;
}

/* ---------- 12+13) OKOS DASHBOARD — widgetrendszer, átrendezhető ---------- */
const WIDGETS = {
  chall:{label:"🎯 Heti kihívás"},
  hub:{label:"🥾 Következő túra / túra előtti központ"},
  tiles:{label:"📊 Gyors áttekintő"},
  readi:{label:"🎒 Csomagolási állapot"},
  quick:{label:"⚡ Gyors indítás"},
  recs:{label:"💡 Ajánlott túrák"},
  goal:{label:"🏆 Célok és kihívások"},
  cal:{label:"🗓️ Naptár + esemény"},
  memory:{label:"📖 Legutóbbi élmények"},
  terep:{label:"⚠️ Terepi infók"},
  sun:{label:"☀️ Nap & hold — a következő túrához"},
  recent:{label:"🕝 Legutóbb megnézett"},
  tools:{label:"🧮 Túrakalkulátor"}
};
VIEWS.dash = function(){
  const u=Store.me(), d=Store.myData(), st=Store.stats();
  const order = (d.widgets||["hub","tiles","readi","quick","recs","goal","cal","memory","terep"]).filter(k=>WIDGETS[k]);
  const next=Store.upcoming()[0];
  const dd = next? Store.dayDiff(next.date):99;
  const lastDone = d.tours.filter(t=>t.status==="teljesítve").sort((a,b)=>(b.doneAt||"").localeCompare(a.doneAt||""))[0];
  const recentDone = lastDone && Store.dayDiff(lastDone.doneAt||lastDone.date)>=-2;
  const unlogged = recentDone && !d.journal.find(j=>j.tourId===lastDone.id);
  const evNext = EVENTS.concat((window.e2Events&&location.hash.indexOf('#/vezerlopult')>-1)?[]:[]).filter(e=>d.savedEvents.includes(e.id) && e.date>=Store.todayISO()).sort((a,b)=>a.date.localeCompare(b.date))[0] || (function(){ var all=EVENTS.concat(window.e2Events?window.e2Events():[]); return all.filter(e=>d.savedEvents&&d.savedEvents.indexOf(e.id)>-1 && e.date>=Store.todayISO()).sort((a,b)=>String(a.date).localeCompare(String(b.date)))[0]; })();
  const W={};
  W.inbox=function(){ const d=Store.myData(); const items=(d.inbox||[]).slice(0,3); const n=(d.inbox||[]).filter(x=>!x.read).length;
    const ic={link:"🔗",event:"📣",place:"📍",note:"📝",photo:"🖼️"};
    return `<div class="wpan"><div class="flex between"><h3>📥 Inbox <span class="chip ${n?"chip-ember":"chip-sand"}">${n?n+" uj":"ures"}</span></h3><a class="btn btn-soft btn-sm" href="#/inbox">Nyitás</a></div>`
      +(items.length?items.map(it=>`<a class="ib-mini" href="#/inbox">${ic[it.type]||"🔗"} ${esc((it.title||it.note||"otltem").slice(0,44))}</a>`).join("")
        :'<p class="small muted mb0">Ments ide Facebook-eseményt, cikket, fotót — az Inbox egy koppintással túraprojektté alakítja.</p>')
      +`</div>`; };
  // HUB
  if(next && dd>=0 && dd<=3){ W.hub = prepHub(next); }
  else if(next){ W.hub = `<div class="card panel" style="margin-bottom:18px">
      <div class="flex between wrapcol"><div><div class="nb-label">KÖVETKEZŐ TÚRÁD · ${fmtDateFull(next.date)}</div>
        <h3 style="margin:.25rem 0 .2rem"><a href="#/tura/${next.id}">${esc(next.title)}</a> ${statusChip(projectedStatus(next))}</h3>
        <p class="small muted mb0">${esc(next.place||next.region)} · 📏 ${next.lengthKm} km · ⏱ ${next.durationH} ó · ⬆ ${next.ascent} m · Felkészültség <b>${Store.readiness(next).pct}%</b></p></div>
        <div class="flex wrapcol" style="gap:.5rem"><a class="btn btn-soft btn-sm" href="#/tura/${next.id}">Túra megnyitása</a>
        <a class="btn btn-primary btn-sm" href="#/turamod/${next.id}">⚡ Túra mód</a></div></div></div>`; }
  else { W.hub = `<div class="card panel" style="margin-bottom:18px;background:linear-gradient(120deg,#fff,#f3f7f0)">
      <b class="small nb-label">KÖVETKEZŐ KALAND</b>
      <h3 style="margin:.3rem 0">Még nincs következő túrád.</h3>
      <p class="muted" style="margin-bottom:1rem">Ván egy szombatod — keressünk hozzá útvonalat?</p>
      <div class="flex wrapcol" style="gap:.6rem">
        <a class="btn btn-primary" href="#/felfedezes">🗺️ Fedezz fel túrákat</a>
        <a class="btn btn-soft" href="#/bakancslista">❤️ Nézd meg a bakancslistádat</a>
        <a class="btn btn-ghost" href="#/ai">🤖 Kérj túraajánlást</a></div></div>`; }
  if(unlogged){ W.hub += `<div class="card panel" style="margin:-8px 0 18px;border-color:#f2d3b3;background:var(--ember-soft)">
    <div class="flex between wrapcol"><div>🥾 <b>Hogy sikerült a(z utóbbi) túrád?</b> <span class="muted small">— ${esc(lastDone.title)}</span></div>
    <button class="btn btn-ember btn-sm" id="hw-log">📖 Élmény hozzáadása</button></div></div>`; }
  // TILES
  const m = (function(){ const mm=Store.todayISO().slice(0,7); const js=d.journal.filter(j=>(j.date||"").startsWith(mm)); return {km:Math.round(js.reduce((a,j)=>a+(+j.km||0),0)), tours:js.length}; })();
  W.tiles = `<div class="grid g4 smm2" style="margin-bottom:18px">
    <div class="card stat-tile"><span class="st-ic">🥾</span><b>${d.tours.filter(t=>t.status==="tervezés"||t.status==="jelentkezve").length + d.tours.filter(t=>t.status==="ötlet").length}</b><span>tervezés/ötlet szinten</span></div>
    <div class="card stat-tile"><span class="st-ic">🎫</span><b>${evNext?fmtDate(evNext.date):"—"}</b><span>következő esemény</span></div>
    <div class="card stat-tile"><span class="st-ic">✅</span><b>${next?Store.readiness(next).missing.length:"—"}</b><span>függőben lévő teendő${next?" a következő túrádon":""}</span></div>
    <div class="card stat-tile"><span class="st-ic">📏</span><b>${m.km} km</b><span>a hónap eddig (${m.tours} túra)</span></div></div>`;
  // READI
  if(next) W.readi = `<div class="grid g2" style="margin-bottom:18px">${
    [["Csomag", next.gear, "felszereles","/tura/"+next.id],["Étel és víz", next.food, "ete","/tura/"+next.id]].map(([label,arr,tab,href])=>{
      const pc=arr.length? Math.round(arr.filter(x=>x.checked).length/arr.length*100):100;
      return `<div class="card panel"><div class="flex between"><b class="small">${label}</b><b class="readi-pct">${pc}%</b></div>
        <div class="readi-track"><i style="width:${pc}%"></i></div>
        <p class="small muted mb0">${arr.length?arr.filter(x=>!x.checked).slice(0,2).map(x=>"☐ "+esc(x.name||x.n)).join(" · "):"kész!"}
        ${arr.filter(x=>!x.checked).length>2?" …":""} · <a href="${href}">listához →</a></p></div>`;}).join("")}</div>`;
  W.quick = `<h2 style="font-size:1.25rem">Gyors indítás</h2>
    <div class="qa-grid" style="margin-bottom:26px">
      <a class="quickact" href="#/uj-tura"><span class="qi">🗓️</span><b>Új túra / sablonból</b><span>ötlet → munkaterület egy lépésben</span></a>
      <a class="quickact" href="#/felfedezes"><span class="qi">🗺️</span><b>Túra felfedezése</b><span>${TOURS.length} útvonal a térképen</span></a>
      <a class="quickact" href="#/esemenyek"><span class="qi">🎪</span><b>Esemény keresése</b><span>vezetett, napkelte, fotós túrák</span></a>
      <a class="quickact" href="#/bakancslista"><span class="qi">❤️</span><b>Bakancslista</b><span>${d.wishlist.length} hely — tervezés egy koppintás</span></a></div>`;
  const recs = recommendFor(u);
  const calc = d.calc || {km:"12", up:"600", w:"75"};
  W.tools = `<div class="card panel tools-card" style="margin-bottom:18px">
    <div class="split2" style="grid-template-columns:1fr 1fr">
      <div>
        <h3>⏱ Túrakalkulátor</h3>
        <p class="small muted mt0">Naismit-szintű tiszta gyalogos becslés — a te adatoddal kalibrálva.</p>
        <div class="calc-grid">
          <label class="f">Táv (km)</label><input class="input" id="cn-km" type="number" min="1" step="1" value="${esc(calc.km)}">
          <label class="f">Szint ↑ (m)</label><input class="input" id="cn-up" type="number" min="0" step="50" value="${esc(calc.up)}">
          <label class="f">Testtömeg (kg)</label><input class="input" id="cn-w" type="number" min="35" max="160" value="${esc(calc.w)}">
        </div>
        <div class="calc-out"><b id="cn-res">—</b><span id="cn-kcal"></span><span class="small muted">A munkaterület-időterv a tényleges tempód alapján finomodhat a naplókból.</span></div>
        <div class="flex" style="margin-top:.6rem;gap:.5rem">
          <a class="btn btn-soft btn-sm" href="#/uj-tura">➕ Tervezz ezzel a réddel</a></div>
      </div>
      <div id="sun-mini">
        <h3>☀️ Nap &amp; hold a következő túrához</h3>
        <p class="small muted mt0" id="sun-hint">A túra helyszínének kelési-nyugvási és holdadatai — a fejlámpa és az aranyóra miatt.</p>
      </div>
    </div></div>`;
  W.sun = `<div class="card panel sun-today"><div class="flex between wrapcol" style="margin-bottom:.2rem"><h3 style="margin:0">☀️ Ma a táj felett</h3><span class="chip chip-sand" id="sun-loc">—</span></div>
      <div id="sun-today-body"><p class="small muted mt0" style="margin:0">⏳ Napkelte, holdfázis, szél — mérem…</p></div></div>`;

    W.recent = (d.recent&&d.recent.length) ? `<h2 style="font-size:1.2rem">🕝 Legutóbb néztem</h2><div class="recent-row">${d.recent.slice(0,4).map(r=>`<a class="recent-chip" href="${r.href}">${r.ico||"🧭"} ${esc(r.label.slice(0,30))}</a>`).join("")}</div>` : "";
  W.recs = `<h2 style="font-size:1.25rem">Neked ajánlott túrák <span class="small muted" style="font-weight:400">a preferenciáid alapján</span></h2>
    <div class="grid g2">${recs.map(t=>`<a class="card tcard" href="#/turak/${t.id}" style="text-decoration:none;margin-bottom:0">
      <div class="img-wrap" style="height:120px">${imgTag(t.img,t.name)}<span class="rate">${t.rating}★</span></div>
      <div class="tbody"><span class="region">${esc(t.region)} · ${esc(t.diff)}</span><h3 style="font-size:1rem">${esc(t.name)}</h3>
      <div class="meta"><span>📏 ${t.km} km</span><span>⏱ ${t.h} ó</span></div></div></a>`).join("")}</div>`;
  // GOAL widget
  const gl = Store.goalRows(), ach = Store.achievements();
  W.goal = `<div class="card panel" style="margin-bottom:18px"><h3>🏆 Célok${new Date().getFullYear()} — és kihívások</h3>
    <div class="grid g3 smm2">${gl.map(g=>`<div class="goal-mini"><div class="flex between"><b class="small">${g.icon} ${esc(g.label)}</b><span class="small muted">${g.current} / ${g.target}${g.unit==="db"?"":" "+g.unit}</span></div>
      <div class="goal-bar ${g.pct>=100?"done":""}"><i style="width:${Math.min(100,g.pct)}%"></i></div>
      <div class="flex between"><span class="small muted">${g.pct}%</span><span><button class="icon-btn goal-delta" data-goal="${g.id}" data-sgn="1" aria-label="hozzáad">+</button></span></div></div>`).join("")}</div>
    <div class="flex" style="margin-top:.8rem;gap:.5rem;flex-wrap:wrap">${ach.slice(0,4).map(a=>`<span class="chip ${a.now>=a.target?"chip-ember":"chip-green"}" style="text-transform:none">${a.now>=a.target?"🏅 ":"☐ "}${esc(a.name)} — ${Math.min(a.now,a.target)}/${a.target}</span>`).join("")}
      <a class="btn btn-soft btn-sm" href="#/statisztikak">→ Részletes statisztikák</a>
      <button class="btn btn-ghost btn-sm" id="goal-new">➕ Saját cél</button></div></div>`;
  const cals = (function(){ const now=new Date(); const mo=(now.getMonth()+1).toString().padStart(2,"0");
    const iso0=`${Store.todayISO()}`; const cells=[]; const first=new Date(now.getFullYear(),now.getMonth(),1); const st=(first.getDay()+6)%7; const dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();
    for(let i=1;i<=dim;i++){ const iiso=`${now.getFullYear()}-${mo}-${String(i).padStart(2,"0")}`;
      const pl=d.tours.filter(t=>t.date===iiso && t.status!=="teljesítve"), dn=d.tours.filter(t=>t.date===iiso&&t.status==="teljesítve"),
      ev=(EVENTS.concat(window.e2Events?window.e2Events():[])).filter(e=>e.date===iiso && d.savedEvents.includes(e.id));
      cells.push(`<div class="mini-cal-c ${iiso===iso0?"today":""}">${i}${pl.length?' <i class="mc-do cp-plan"></i>':""}${ev.length?' <i class="mc-do cp-event"></i>':""}${dn.length?' <i class="mc-do cp-done"></i>':""}</div>`); }
    return `<div class="mini-cal-wrap">${DOW_HU.map(x=>`<span class="mini-cal-d">${x}</span>`).join("")}${cells.join("")}</div>`; })();
  W.cal = `<h2 style="font-size:1.25rem">Naptár <span class="small"><a href="#/naptar" style="color:var(--sky);font-weight:600">→ Teljes</a></span></h2>${cals}
    ${evNext?`<div class="card panel" style="margin-top:10px"><span class="chip chip-ember">${esc(evNext.cat)}</span><div style="margin-top:.4rem"><b>${esc(evNext.name)}</b></div><div class="meta"><span>📅 ${fmtDateFull(evNext.date)}</span><span>📍 ${esc(evNext.place)}</span><span>👥 ${evNext.people}/${evNext.cap}</span></div></div>`:""}`;
  W.chall = (()=>{ const wl=d.wishlist.length?d.wishlist.map(w=>w.name):(TOURS.filter(t=>!Store.myData().tours.some(x=>x.title===t.name)).slice(0,6).map(t=>t.name.split("(")[0].trim()));
    const weeks=Math.floor((Date.now()-Date.UTC(new Date().getUTCFullYear(),0,1))/6048e5);
    const pool=[["köd- és aranyórás fotóséta","a hét végén, lemenőben, 2 óra"],["napfelkelte-kiruccanás","kelte előtt 45 perccel, fejlámpa"],["holdfény-sétáltetés","szombat este, fejlámpával"],["csendes gerinc-kör","hétköznap este, 90 perc"],["forrás-vadászat a gyerekekkel","szombat délelőtt"],["éjjeli bagoly-les","péntek szürkületben"]];
    const p=pool[weeks%pool.length], wname=wl.length?wl[weeks%wl.length]:"Bálványos";
    return `<div class="card panel chall-card" style="margin-bottom:18px"><div class="flex between wrapcol"><h3 style="margin:0">🎯 Heti kihívás</h3><span class="chip chip-ember">${(weeks%52)+1}. hét</span></div>
      <p style="margin:.55rem 0"><b>${esc(p[0])}</b> — helyszín: <b>${esc(wname)}</b>, idő: ${esc(p[1])}.</p>
      <div class="flex wrapcol" style="gap:.5rem">
        <button class="btn btn-ember btn-sm" data-chall="1">Elfogadom — tervezés</button>
        <span class="small muted" id="chall-wx">— holdfázis és időjárás ellenőrzése a közelgőn…</span></div></div>`; })();
  const mems = d.journal.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,2);
  W.memory = `<h2 style="font-size:1.25rem">Élménykönyv <span class="small"><a href="#/naplo" style="color:var(--sky);font-weight:600">→ Nyitva</a></span></h2>
    ${mems.length?`<div class="grid g2">${mems.map(j=>`<a class="card" href="#/naplo" style="overflow:hidden;border-radius:16px;display:block">
      <div class="img-wrap" style="height:110px">${imgTag((j.photos&&j.photos[0])||IMG.erdo,"")}</div>
      <div style="padding:.7rem .9rem"><b class="small">${esc(j.title)}</b><span class="mood-chip">${j.mood||""}</span>
      ${j.rating?`<span class="stars" style="color:var(--ember)">★</span>`:""}<p class="small muted mb0" style="font-style:italic">„${esc(j.note||"")}"</p></div></a>`).join("")}</div>`
      : `<p class="muted small">A teljesített túráid élményei itt jelennek meg először.</p>`}`;
  const rs = Store.fieldReports().slice(0,2);
  W.terep = `<h2 style="font-size:1.25rem">Terepi infók <span class="small"><a href="#/terepi" style="color:var(--sky);font-weight:600">→ Mind</a></span></h2>
    <div class="card panel" style="padding:.3rem 0">${rs.map(r=>terepRow(r,{compact:1}).replace('class="nrow terep','class="terep-sm nrow terep')).join("")}</div>`;
  const widgets = order.map(k=>`<section class="wsec" data-w="${k}" draggable="false"><div class="wsec-grip" title="Húzd átrendezéshez">⠿</div>${W[k]}</section>`).join("");
  return dash("#/vezerlopult")(`
    <div class="dash-top">
      <div><div class="hello">${new Date().getHours()<10?"Jó reggelt":new Date().getHours()<18?"Kellemes napot":"Kellemes estet"} · ${fmtDateFull(Store.todayISO())} · ${u.city?esc(u.city):"jó kirándulást"}</div>
      <h1>Szia, ${esc((u.name||"útitárs").split(" ")[0])}! Merre kalandozunk legközelebb? 🥾</h1></div>
      <div class="flex" style="gap:.5rem;flex-wrap:wrap"><a class="btn btn-ember" href="#/uj-tura">➕ Új túra tervezése</a>
        <button class="btn btn-ghost btn-sm" id="dw-edit">${dwOn?"✓ Kész":"⠿ Widgetek átrendezése"}</button></div></div>
    <div id="widgets">${widgets}</div>`);
};
let dwOn=false;
VIEWS.dash.after = root=>{
  const t=Store.upcoming()[0];
  root.querySelectorAll("[data-ptask]").forEach(c=>c.onchange=()=>{ if(t){ const x=c.dataset.ptask; t.notes = c.checked? (t.notes? t.notes+" | ":"")+x+" ✓" : (t.notes||"").replace(x+" ✓","").trim(); Store.save(); } });
  const hw=root.querySelector("#hw-log"); if(hw) hw.onclick=()=>{ const lastDone=Store.myData().tours.filter(x=>x.status==="teljesítve").sort((a,b)=>(b.doneAt||"").localeCompare(a.doneAt||""))[0]; if(lastDone) finishWizard(lastDone); };
  root.querySelectorAll(".goal-delta").forEach(b=>b.onclick=()=>{ const rows=Store.goalRows(); const g=rows.find(x=>x.id===b.dataset.goal); Store.goalDelta(g.id,+b.dataset.sgn); render(); });
  const gn=root.querySelector("#goal-new"); if(gn) gn.onclick=goalNewModal;
  // === Túrakalkulátor + Nap/hold widget ===
  { const dd=Store.myData();
    const cn=id=>root.querySelector(id);
    const recalc=()=>{ const o=root.querySelector("#cn-res"); if(!o) return;
      const km=+cn("#cn-km").value||0, up=+cn("#cn-up").value||0, w=+cn("#cn-w").value||75;
      const h=Math.max(.5, km/4 + up/500 + (w>90?0.2:0));
      o.textContent=(Math.round(h*10)/10)+" ó becsült tiszta gyalogidő";
      root.querySelector("#cn-kcal").textContent="≈ "+Math.round(h*6.5*w)+" kcal";
      dd.calc={km:String(km||""),up:String(up||""),w:String(w)}; Store.save(); };
    if(cn("#cn-km")){ ["#cn-km","#cn-up","#cn-w"].forEach(id=>cn(id).addEventListener("input",recalc)); recalc(); }
    const sbox=root.querySelector("#sun-mini");
    if(sbox){ const nx=Store.upcoming()[0];
      if(nx && nx.coords && nx.date){
        (async()=>{ try{
          const res=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+nx.coords.lat+"&longitude="+nx.coords.lng+
            "&daily=sunrise,sunset,daylight_duration,moon_phase&timezone=auto&forecast_days=16");
          const j=await res.json(); let idx=j.daily.time.indexOf(nx.date); if(idx<0) idx=0;
          const hh=t=>(t||"").slice(11,16)||"—";
          const dl=Math.round(j.daily.daylight_duration[idx]/60);
          const ph=j.daily.moon_phase[idx], ill=Math.round((1-Math.cos(2*Math.PI*ph))/2*100);
          const t0=(nx.timeline&&nx.timeline[0]&&nx.timeline[0].t)||"09:00";
          const lastT=(nx.timeline&&nx.timeline.length)?nx.timeline[nx.timeline.length-1].t:"";
          sbox.innerHTML='<h3>☀️ Nap &amp; hold — '+esc(nx.title.slice(0,20))+'</h3>'+
            '<div class="sunline"><span>🌅 Kelte <b>'+hh(j.daily.sunrise[idx])+'</b></span>'+
            '<span>🌇 Nyugta <b>'+hh(j.daily.sunset[idx])+'</b></span>'+
            '<span>🌙 Hold <b>'+ill+'%</b> '+(ill>55?'<em class=muted>(telihold közelében)</em>':'')+'</span></div>'+
            '<p class="small muted mb0">Nappal: '+Math.floor(dl/60)+'ó '+(dl%60)+'p'+
            (t0<hh(j.daily.sunrise[idx])?' · sötétben indulsz — <b>fejlámpa</b> a zsebedbe':'')+
            (lastT&&lastT>hh(j.daily.sunset[idx])?' · <b>várhatóan sötétben érsz vissza</b> — count'+ (dl<600?'olj +25% időt':'') :'.')+'</p>';
        }catch(e){ sbox.querySelector("#sun-hint").textContent="Az időjárás-api most nem elérhető – a widget helyben marad."; } })();
      } else { sbox.querySelector("#sun-hint").textContent="Kövesd a túra helyszínét — ha van koordináta, itt mutatjuk a keltét, nyugtát és a hold fázisát."; }
    }
  }
  const ch=root.querySelector("[data-chall]"); if(ch) ch.onclick=challPlan;
  const clr=root.querySelectorAll("[data-chall-link]"); clr.forEach(b=>b.onclick=()=>{ const t=Store.getTour(b.dataset.challLink); if(t){ if(!t.shareCode){t.shareCode=Store.uid("sh").replace("sh","ch")+Date.now().toString(36); Store.save();}
    navigator.clipboard && navigator.clipboard.writeText(location.origin+location.pathname+"#/osztott/"+t.shareCode).then(()=>toast("Emlékeztető link kimásolva — dobjad be a csoportba!","📣"),()=>toast("Az link: #/osztott/"+t.shareCode,"📣")); } });
  const wx=root.querySelector("#chall-wx"); if(wx){ const nx=Store.upcoming()[0]; if(nx&&nx.coords){ (async()=>{ try{const res=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+nx.coords.lat+"&longitude="+nx.coords.lng+"&daily=precipitation_probability_max&forecast_days=2"); const j=await res.json(); wx.textContent = "Eső esélye a kihivás napján: "+ (j.daily.precipitation_probability_max[1]||0) + "%"; }catch(e){ wx.textContent="−"; } })(); } else wx.textContent=""; }
  const eb=root.querySelector("#dw-edit"); if(eb) eb.onclick=()=>{ dwOn=!dwOn; root.querySelectorAll(".wsec").forEach(s=>{ s.draggable=dwOn; s.classList.toggle("editing",dwOn); }); eb.textContent=dwOn?"✓ Kész":"⠿ Widgetek átrendezése";
    if(!dwOn){ const d=Store.myData(); d.widgets=[...root.querySelectorAll("#widgets .wsec")].map(s=>s.dataset.w); Store.save(); toast("Widget-elrendezés mentve","🧩"); } };
  const box=root.querySelector("#widgets"); let dragEl=null;
  box.querySelectorAll(".wsec").forEach(s=>{ s.addEventListener("dragstart",()=>{dragEl=s;s.classList.add("dragging");}); s.addEventListener("dragend",()=>{dragEl&&dragEl.classList.remove("dragging");});
    s.addEventListener("dragover",e=>{ if(!dragEl||dragEl===s) return; e.preventDefault(); const r=s.getBoundingClientRect(); const after=(e.clientY-r.top)>r.height/2; box.insertBefore(dragEl, after?s.nextSibling:s); }); });
};
function goalNewModal(){
  openModal({ title:"➕ Személyes cél", body:`<label class="f">Cél megnevezése</label><input class="input" id="gn-l" placeholder="Pl. új csúcsok idén">
    <label class="f" style="margin-top:.7rem">Célérték</label><input class="input" id="gn-t" type="number" value="5">
    <label class="f" style="margin-top:.7rem">Egység</label><input class="input" id="gn-u" value="db">`,
    footer:`<button class="btn btn-primary btn-block" id="gn-ok">Cél létrehozása</button>`,
    onOpen(r){ r.querySelector("#gn-ok").onclick=()=>{ const l=r.querySelector("#gn-l").value.trim(); if(!l){toast("Adj nevet","⚠️");return;}
      Store.addGoal({icon:"🎯", label:l, metric:"custom", target:+r.querySelector("#gn-t").value||5, unit:r.querySelector("#gn-u").value||"db", manual:0});
      closeModal(); toast("Cél felvéve — a + gombokkal jelzed a haladást.","🏆"); render(); }; } });
}
/* ---------- FEJLÉC: terepi + téma gombok ---------- */
(function(){
  const origRH = window.renderHeader || renderHeader;
  window.renderHeader = function(){
    origRH();
    const u = Store.me(), nav = document.querySelector(".pub-links");
    if(nav && u && !nav.querySelector('[href="#/terepi"]')){
      nav.insertAdjacentHTML("beforeend", '<a href="#terepi">Terepi infók</a><a href="#/sablonok">Sablonok</a>'); }
    const cta = document.querySelector(".pub-cta");
    if(cta && !cta.querySelector("#theme-btn")){
      const th = (Store.getTheme && Store.getTheme()) || "light";
      const b = document.createElement("button");
      b.id="theme-btn"; b.type="button"; b.className="icon-btn"; b.title="Téma: "+th;
      b.textContent = th==="dark" ? "🌙" : th==="auto" ? "🌗" : "☀️";
      b.onclick = ()=>{ const cur=(Store.getTheme&&Store.getTheme())||"light";
        const next = cur==="light"?"dark":cur==="dark"?"auto":"light";
        if(Store.setTheme){ Store.setTheme(next); location.reload(); } };
      cta.prepend(b);
    }
  };
  
})();

/* ---------- 10) ÉLMÉNYKÖNYV — a naplólap felváltása gazdagabb nézetre ---------- */
(function(){
  const _journal = VIEWS.journal;
  VIEWS.journal = () => {
    const d = Store.myData();
    if(!d.journal.length) return _journal();
    const js = d.journal.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    const priv = p => !p||p==="privát" ? '<span class="chip chip-sand">🔒 Privát</span>' : p==="csak túratársak" ? '<span class="chip chip-green">👥 Csak túratársak</span>' : '<span class="chip chip-blue">🌍 Nyilvános</span>';
    const head = `<div class="dash-top"><div><span class="eyebrow" style="color:var(--leaf);font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase">A TE SZEMÉLYES ALBUMOD</span><h1 class="mb0">Élménykönyv 📖</h1><div class="hello">${d.journal.length} teljesített túra · ${d.journal.reduce((s,j)=>s+(j.photos||[]).length,0)} emlék · ${d.journal.map(j=>j.mood).filter(Boolean).join(" ")}</div></div>
      ${Store.upcoming()[0]?`<a class="btn btn-primary" href="#/tura/${Store.upcoming()[0].id}">Közelgő túra nyitása</a>`:`<a class="btn btn-primary" href="#/uj-tura">➕ Új túra</a>`}</div>`;
    const album = `<div class="mem-album">${js.map(j=>`
      <div class="card mem">
        <div class="img-wrap" style="height:190px">${imgTag(j.photos&&j.photos[0]||IMG.erdo,"")}</div>
        <div class="mem-b">
          <div class="flex between wrapcol"><div><b>${esc(j.title)}</b><div class="small muted">${fmtDateFull(j.date)} · ${esc(j.place||"")}</div></div>
          <div class="flex" style="gap:.35rem;align-items:center">${j.mood?`<span class="mood-chip" title="Hangulat">${j.mood}</span>`:""}${priv(j.privacy)}</div></div>
          <div class="stars" style="color:var(--ember);margin:.4rem 0">${"★".repeat(j.rating||0)}${'<span style="opacity:.25">'+"★".repeat(5-(j.rating||0))+"</span>"}</div>
          ${j.note?`<p style="margin:.2rem 0;font-size:.98rem">„${esc(j.note)}”</p>`:""}
          ${j.fav?`<p class="small" style="margin:.25rem 0;color:var(--ember)">❤️ ${esc(j.fav)}</p>`:""}
          <p class="small" style="margin:.3rem 0"><span class="chip chip-sand" style="background:#FBF4DE;color:#8a6d12;font-style:italic">💡 ${esc(j.lesson||"")||"Mit tanultál? Írd meg a ✎ gombbal."}</span></p>
          ${j.audio?`<audio controls src="${j.audio}" style="width:100%;height:36px;margin:.3rem 0"></audio>`:""}
          <div class="meta" style="font-size:.78rem"><span>📏 ${j.km||"?"} km</span><span>⬆ ${j.up||"?"} m</span><span>⏱ ${j.h||"?"} ó</span></div>
          <div class="flex wrapcol" style="gap:.5rem;margin-top:.6rem">
            <button class="btn btn-soft btn-sm" data-jedit="${j.id}">✎ Történet és tanulság</button>
            ${j.tourId?`<a class="btn btn-ghost btn-sm" href="#/tura/${j.tourId}">📁 Munkaterület</a>`:""}
            ${!j.archived?`<button class="btn btn-ghost btn-sm" data-jarch="${j.id}">📖 Archiválás</button>`:"<span class='chip chip-sand'>archiválva</span>"}</div>
          <div class="flex" style="gap:5px;margin-top:.5rem;flex-wrap:wrap">${(j.photos||[]).slice(1).map(p=>`<img src="${p}" alt="" style="width:52px;height:52px;object-fit:cover;border-radius:8px">`).join("")}</div>
        </div></div>`).join("")}</div>`;
  return _journal ? (function(){ const base=_journal();
    // a régi lista tetejére rendereljük az albumot, alulra a részletes listát ne — cseréljük teljes egészében:
    return dash("#/naplo")(head + album); })():head+album;
};
VIEWS.journal.after = (root)=>{
  root.querySelectorAll("[data-jedit]").forEach(b=>b.onclick=()=>{
    const j=Store.myData().journal.find(x=>x.id===b.dataset.jedit);
    openModal({ title:"✎ "+esc(j.title),
      body:`<label class="f">Hangulat</label><div class="mood-row">${[["😫","Nagyon nehéz"],["🙂","Jó"],["😍","Fantasztikus"]].map(m=>`<button class="mood-pick ${j.mood===m[0]?"sel":""}" data-m="${m[0]}">${m[0]}<small>${m[1]}</small></button>`).join("")}</div>
        <label class="f" style="margin-top:.7rem">Történet</label><textarea class="input" id="je-n" rows="3">${esc(j.note||"")}</textarea>
        <label class="f" style="margin-top:.6rem">💡 Mit tanultam ebből a túrából?</label><input class="input" id="je-l" value="${esc(j.lesson||"")}" placeholder="Pl. Legközelebb több vizet viszek.">
        <label class="f" style="margin-top:.6rem">Értékelés</label><input class="input" id="je-r" type="number" min="1" max="5" value="${j.rating||5}">
        <label class="f" style="margin-top:.6rem">Láthatóság</label>
        <select class="input" id="je-p">${["privát","csak túratársak","nyilvános"].map(o=>`<option ${j.privacy===o?"selected":""}>${o}</option>`).join("")}</select>
        <label class="f" style="margin-top:.6rem">🎤 Hangjegyzet</label><input type="file" id="je-a" accept="audio/*" class="input" style="padding:.55em">
        <label class="f" style="margin-top:.6rem">📸 Képek</label><input type="file" id="je-ph" accept="image/*" multiple class="input" style="padding:.55em">`,
      footer:`<button class="btn btn-primary btn-block" id="je-save">✓ Mentés</button>`,
      onOpen(r){ let mood=j.mood||"";
        r.querySelectorAll("[data-m]").forEach(b2=>b2.onclick=()=>{ mood=b2.dataset.m; r.querySelectorAll("[data-m]").forEach(x=>x.classList.toggle("sel",x===b2)); });
        r.querySelector("#je-save").onclick=()=>{
          const patch={ note:r.querySelector("#je-n").value, lesson:r.querySelector("#je-l").value, rating:+r.querySelector("#je-r").value, privacy:r.querySelector("#je-p").value, mood };
          const ph=r.querySelector("#je-ph").files[0];
          const au=r.querySelector("#je-a").files[0];
          let tasks=0, done=0, finish=()=>{ if(au&&tasks<2){} };
          const store=()=>{ Store.updateJournal(j.id, patch); closeModal(); toast("Esemény frissítve","✎"); render(); };
          if(ph){ tasks++; const rd=new FileReader(); rd.onload=()=>{ patch.photos=[...new Set([...(j.photos||[]),rd.result])].slice(0,9); if(++done===tasks)store(); }; rd.readAsDataURL(ph); }
          if(au){ tasks++; const rd=new FileReader(); rd.onload=()=>{ if(rd.result.length<800000) patch.audio=rd.result; if(++done===tasks)store(); }; rd.readAsDataURL(au); }
          if(!tasks) store(); }; }});
  });
  root.querySelectorAll("[data-jarch]").forEach(b=>b.onclick=()=>{ const j=Store.myData().journal.find(x=>x.id===b.dataset.jarch); j.archived=true; Store.save(); toast("Archiválva — az emlék megmarad.","📖"); render(); });
  wireTerepLinks(root);
};
})();

function wireTerepLinks(root){ (root||document).querySelectorAll("[data-ackr]").forEach(a=>a.onclick=()=>{ if(Store.me()){ Store.ackFieldReport(a.dataset.ackr); render(); } }); 
  (root||document).querySelectorAll("[data-jreport]").forEach(a=>a.onclick=()=>{ const tr=Store.myData() && (function(){ const t=Store.upcoming()[0]; return t?{region:t.region}:null;})(); reportModal(tr||{}); }); }

/* ---------- 14+15) Statisztikák: célok + kihívások szekció hozzáadása ---------- */
(function(){
  const _s = VIEWS.stats;
  VIEWS.stats = () => { const base=_s(); const d=Store.myData();
    const rows = Store.goalRows();
    const ach = Store.achievements();
    const ch = d.challenges||[];
    const extra = `<section id="bump-goals"></div>`;
    return base.replace('</div>`','') && base; // tartalom később DOM-ból
  };
})();
window.statsBumpInstall = function(AppObj){
  try{ if(Store.applyTheme) Store.applyTheme(); }catch(e){}
  window.statsBumpCheck = ()=>{ if((location.hash||"").indexOf("statisztikak")>=0) statsBumpAppend(); };
  const q = ()=>{ if((location.hash||"").indexOf("statisztikak")>=0){ setTimeout(window.statsBumpCheck, 150); setTimeout(window.statsBumpCheck, 700); } };
  document.addEventListener("hashchange", q);
  const _origRender = AppObj.render;
  AppObj.render = function(...a){ _origRender.apply(this,a); q(); };
  setInterval(()=>{ if((location.hash||"").indexOf("statisztikak")>=0 && !document.getElementById("bump-goals-wrap")) window.statsBumpCheck(); }, 200);
};
function statsBumpAppend(){ if((location.hash||"").indexOf("statisztikak")<0) return;
  if(document.getElementById("bump-goals-wrap")) return;
  const d = Store.myData(); if(!d||!d.goalList) return;
  const rows = Store.goalRows(), ach = Store.achievements(), ch = d.challenges||[];
  const el = document.createElement("section"); el.id="bump-goals-wrap";
  el.innerHTML = `<div class="split2" style="grid-template-columns:1.05fr .95fr;gap:18px;margin-top:20px;align-items:start">
    <div class="card panel"><h3>🎯 Személyes céljaim</h3>
      ${rows.map(g=>`<div class="goal-row">
        <div class="flex between wrapcol"><b class="small">${g.icon} ${esc(g.label)}</b><span class="small ${g.pct>=100?"goal-done":""}"><b>${g.current}</b> / ${g.target}${g.unit&&g.unit!=="db"?" "+esc(g.unit):""} ${g.pct>=100?"🏅 elérvé!" : " ("+g.pct+"%)"}</span></div>
        <div class="goal-bar ${g.pct>=100?"done":""}"><i style="width:${Math.min(100,g.pct)}%"></i></div>
        <div class="flex" style="justify-content:flex-end"><button class="icon-btn" data-goal="${g.id}:1" title="Egy kattintásnyi haloml" style="width:26px;height:26px">＋</button>
        <button class="icon-btn" data-goalrm="${g.id}" title="Cél törlése" style="width:26px;height:26px">✕</button></div></div>`).join("")}
      <button class="btn btn-soft btn-sm" id="bump-goalnew" style="margin-top:.6rem">➕ Saját cél hozzáadása</button></div>
    <div class="card panel"><h3>🧗 Kihívások — teljesítmények</h3>
      <div class="ach-row">${ach.map(a=>`<span class="ach ${a.now>=a.target?"done":""}">${a.icon} ${a.now>=a.target?"✔":"☐"} ${esc(a.name)} <b class="muted">${a.now}/${a.target}</b></span>`).join("")}</div>
      ${ch.map(c=>{ const done=c.items.filter(x=>x.done).length; return `<div class="chal-card">
        <div class="flex between wrapcol"><b>${c.icon} ${esc(c.name)} <span class="muted small">(${c.desc||""})</span></b><span class="chip chip-blue">${done}/${c.items.length}</span></div>
        <div class="readi-track" style="margin:.35rem 0 .2rem"><i style="width:${c.items.length?done/c.items.length*100:0}%;background:linear-gradient(90deg,var(--sky),#78a4c2)"></i></div>
        ${c.items.map((it,i)=>`<label class="ck" style="padding:.22em .4em"><input type="checkbox" data-chal="${c.id}" data-chal-item="${i}" ${it.done?"checked":""}> ${it.done?"☑️":"☐"}&nbsp;${esc(it.l)}</label>`).join("")}</div>`;}).join("")}
      <button class="btn btn-soft btn-sm" id="bump-chalnew" style="margin-top:.6rem">➕ Új kihívás</button></div>
  </div>`;
  const view = document.querySelector("#view .dash-main"); if(!view) return; view.appendChild(el);
  el.querySelectorAll("[data-goal]").forEach(b=>b.onclick=()=>{ const [id,sgn]=b.dataset.goal.split(":"); Store.goalDelta(id,+sgn); statsBumpReflow(); });
  el.querySelectorAll("[data-goalrm]").forEach(b=>b.onclick=()=>{ Store.rmGoal(b.dataset.goalrm); statsBumpReflow(); });
  el.querySelectorAll("[data-chal]").forEach(c=>c.onchange=()=>{ Store.toggleChallengeItem(c.dataset.chal,+c.dataset.chalItem); statsBumpReflow(); });
  const gn=el.querySelector("#bump-goalnew"); if(gn) gn.onclick=goalNewModal2;
  const cn=el.querySelector("#bump-chalnew"); if(cn) cn.onclick=chalNewModal;
}
function statsBumpReflow(){ const s=document.getElementById("bump-goals-wrap"); if(s) s.remove(); statsBumpAppend(); }
function goalNewModal2(){ openModal({ title:"➕ Személyes cél",
  body:`<label class="f">Cél neve *</label><input class="input" id="g2-n" placeholder="Pl. bepakolni a székelyföldi csúcsokat">
    <div class="grid g2" style="margin-top:.6rem"><div><label class="f"> célérték</label><input class="input" id="g2-t" type="number" value="10"></div>
    <div><label class="f">Egység</label><input class="input" id="g2-u" value="km"></div></div>
    <label class="f" style="margin-top:.6rem">Automatikus mérés? (írd be: km, túrák, csúcsok, napkelte — vagy üresen hagyva manüls + gombok)</label><select class="input" id="g2-m"><option value="custom">manuális (+ gombbal)</option><option value="km">megtett km</option><option value="tours">teljesített túrák</option><option value="summits">megmászt csúcsok</option><option value="napkelte">napkelte-s túrák</option></select>`,
  footer:`<button class="btn btn-primary btn-block" id="g2-ok">Cél létrehozása</button>`,
  onOpen(r){ r.querySelector("#g2-ok").onclick=()=>{ const n=r.querySelector("#g2-n").value.trim(); if(!n){toast("Adj nevet","🙂");return;}
    Store.addGoal({icon:"🎯", label:n, metric:r.querySelector("#g2-m").value, target:+r.querySelector("#g2-t").value||10, unit:r.querySelector("#g2-u").value||"db", manual:0});
    closeModal(); toast("Cél felvéve — hajrá! 🎯","🏁"); statsBumpAppend(); }; } }); }
function chalNewModal(){ openModal({ title:"➕ Új helyi kihívás",
  body:`<label class="f">Neve *</label><input class="input" id="c2-n" placeholder="Pl. Hagymás-kör: hat csúcs">
    <label class="f" style="margin-top:.6rem">Ikon</label><input class="input" id="c2-i" maxlength="4" value="🧗">
    <label class="f" style="margin-top:.6rem">Helyszínek / tételek — soronként egy</label><textarea class="input" id="c2-l" rows="4" placeholder="Kőris-hegy&#10;Melegő-hát&#10;Góbi-bérc"></textarea>`,
  footer:`<button class="btn btn-primary btn-block" id="c2-ok">Kihívás létrehozása</button>`,
  onOpen(r){ r.querySelector("#c2-ok").onclick=()=>{ const items=r.querySelector("#c2-l").value.split("\n").map(x=>x.trim()).filter(Boolean);
    if(items.length<2){toast("Kell legalább két tétel","⚠️");return;}
    Store.addChallenge({name:r.querySelector("#c2-n").value.trim()||"Új kihívás", icon:r.querySelector("#c2-i").value||"🧗", items:items.map(l=>({l,done:false})), desc:"saját kihívás"});
    closeModal(); toast("Kihívás elmentve — irány a lista tetejére 🧗","🎯"); statsBumpAppend(); }; } }); } 


/* ---------- WIZARD: sablonválasztó csipák (a form lépésben) ---------- */
(function(){
  const _nta = VIEWS.newTour.after;
  VIEWS.newTour.after = (root,arg)=>{
    _nta && _nta(root,arg);
    if(wiz && (wiz._step==="detail" || wiz._step==="form") && wiz.kind!=="event"){
      const box=root.querySelector(".wiz-nav");
      if(box && !root.querySelector(".tpl-strip")){
        const strip=document.createElement("div"); strip.className="tpl-strip";
        strip.innerHTML=`<div class="small" style="width:100%"><b>📐 Kiindulás sablonból:</b></div>
          ${Store.allTemplates().map(t=>`<button class="f-pill ${wiz.template===t.id?"on":""}" data-tpl="${t.id}">${t.icon} ${esc(t.name)}</button>`).join("")}
          <div class="small muted" style="width:100%">A sablon a létrehozáskor a csomaglistát, időtervet és étellistát cseréli — a többi adat megmarad, amit megadsz.</div>`;
        box.parentNode.insertBefore(strip, box);
        const go2 = root.querySelector("#wz-go");
        if(go2 && !go2._tplw){ const oc=go2.onclick; go2._tplw=1;
          go2.onclick = (e)=>{ const before=Store.myData().tours.map(x=>x.id);
            oc && oc.call(go2,e);
            if(wiz && wiz.template){ const after=Store.myData().tours.map(x=>x.id); const newId=after.find(id=>before.indexOf(id)<0);
              if(newId){ const dateVal=(root.querySelector("#wz-date")||{}).value; if(dateVal && !Store.getTour(newId).date){ Store.updateTour(newId,{date:dateVal}); }
                Store.applyTemplate(newId, wiz.template); } } }; }
        strip.querySelectorAll("[data-tpl]").forEach(b=>b.onclick=()=>{ wiz.template=b.dataset.tpl;
          const t=Store.templateById(t.id); if(t){ wiz.title=wiz.title||t.name; wiz.difficulty=t.difficulty||wiz.difficulty; }
          strip.querySelectorAll("[data-tpl]").forEach(x=>x.classList.toggle("on",x===b));
          toast("Sablon kiválasztva — a létrehozáskor becsomagolja a csomaglistát, időtervet, kaját.","📐"); });
      }
    }
  };
  // létrehozáskor érvénybe lép a selected sablon
  const _n = Store.myData; // no-op
})();

/* ---------- HAGYMÁS INTERAKTÍV ÚTVONALHALÓZAT (beágyazott térkép + GPX import) ---------- */
const HGY = { filter: "mind" };
const hgyIcon = t => t==="bringa" ? "🚲" : t==="esztena" ? "🐑" : "🥾";
function hgyParseGpx(txt){
  const x=new DOMParser().parseFromString(txt,"application/xml");
  const nodes=[...x.querySelectorAll("trkpt,rtept,wpt")];
  return nodes.map(n=>({lat:+n.getAttribute("lat"), lng:+n.getAttribute("lon"),
    ele:(n.querySelector("ele")&&+n.querySelector("ele").textContent)||null})).filter(p=>isFinite(p.lat)&&isFinite(p.lng));
}
function hgyStats(pts){
  let d=0,up=0,dn=0,min=1e9,max=-1e9;
  for(let i=1;i<pts.length;i++){ const a=pts[i-1],b=pts[i],R=6371e3,t=Math.PI/180;
    const h=Math.sin((b.lat-a.lat)*t/2)**2+Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin((b.lng-a.lng)*t/2)**2;
    d+=2*R*Math.asin(Math.sqrt(h));
    if(a.ele&&b.ele){ if(b.ele>a.ele) up+=b.ele-a.ele; else dn+=a.ele-b.ele; } }
  pts.forEach(p=>{ if(p.ele){ if(p.ele<min)min=p.ele; if(p.ele>max)max=p.ele; } });
  return {m:d, up, dn, min:isFinite(min)?min:null, max:isFinite(max)?max:null};
}
function hgyImport(i, btn){
  const r=HAGYMAS_ROUTES[i];
  if(!Store.me()){ toast("Az importhoz jelentkezz be","🔐"); NAV.to("#/belepes"); return; }
  if(btn){ btn.disabled=true; btn.textContent="…" }
  fetch(r.url).then(res=>res.text()).then(txt=>{
    const pts=hgyParseGpx(txt);
    if(pts.length<3) throw new Error("no pts");
    const st=hgyStats(pts);
    const t=Store.newTourFromDraft({
      title:r.n.replace(/_/g," ").replace(/\s+/g," "),
      place:"Nagyhagymás útvonalhálózat — "+({bringa:"kerékpár",tura:"túra",esztena:"esztenák"}[r.t]||r.t)+" útvonal",
      region:"Gyergyó", date:"", lengthKm:Math.round(st.m/100)/10, up:Math.round(st.up), durationH:Math.max(1,Math.round(st.m/100/45*10)/10+Math.round(st.up/350*10)/10),
      difficulty: st.up>900?"Nehéz": st.up>450?"Közepes":"Könnyű",
      tags:["hagymás","hálózat","gpx","kilátás"], img: r.t==="bringa"?IMG.legifoto:(r.t==="esztena"?IMG.mezofeny:IMG.kodos),
      desc:"Importálva a Nagyhagymás Közösségek Közti Fejlesztési Társulás interaktív útvonalai közül (vin: "+ (r.t==="esztena"?"KML legelő-pont":"GPX nyomvonal") +"). A munkaterületen a dátum, szintidő és csomag már a te terved.",
      coords:{name:"Rajt: "+r.n, lat:pts[0].lat, lng:pts[0].lng},
      waypoints:[{name:"Rajt",lat:pts[0].lat,lng:pts[0].lng},{name:"Cél",lat:pts.at(-1).lat,lng:pts.at(-1).lng}],
      gpx:{pts, line:pts.map(p=>[p.lat,p.lng]), elev: (st.min!=null? pts.map(p=>p.ele-(st.min||0)) : pts.map((_,j)=>j%10))},
      startNote:""
    });
    toast("Útvonal importálva a te Túraprojekt-listádba 🕹","🧭");
    render();
    if(btn){ btn.disabled=false }
    location.hash="#/tura/"+t.id;
  }).catch(()=>{
    if(btn){ btn.disabled=false; btn.textContent="🧭 Tervbe importálás" }
    openModal({ title:"A GPX most nem tölthető le",
      body:`<p class="muted mt0">A böngésző vagy a szerver most Blokkolta a cross-origin letöltést. Az útvonal így is elérke: a beágyazott térképről (jobb felső új lap), vagy töltsd le tőlük és importáld a workspace GPX-feltöltésénél.</p>`,
      footer:`<div class="flex" style="gap:.5rem;flex-wrap:wrap"><a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="${esc(r.url)}">⬇ GPX letöltése</a><button class="btn btn-ghost btn-sm" data-close>Bezárás</button></div>` });
  });
}
VIEWS.hagymas = () => {
  const u=Store.me();
  const list = HAGYMAS_ROUTES.filter(r=>HGY.filter==="mind"||r.t===HGY.filter);
  const body = `
    <div class="hgy">
      <div class="flex between wrapcol" style="margin-bottom:.4rem">
        <section class="hgy-map-wrap">
          <div class="hgy-map-box">
            <iframe src="${HAGYMAS_MAP_URL}" loading="lazy" title="Hagymás interaktív túraútvonalak" allow="geolocation"></iframe>
          </div>
        </section>
        <aside class="hgy-side">
          <div class="card panel" style="border-radius:16px">
            <h3 style="font-size:1.05rem">🕹 Hagymás útvonalhálózat</h3>
            <p class="small muted mt0">A Nagyhagymás Közösségek Közti Fejlesztési Társulás 37 jelzett útvonala — túra, kerékpár és esztenák. Kattints a „Tervbe importálás” gombra, és a GPX nyomsávonat munkaterület lesz: szintidővel, pontokkal, a te dátumoddal.</p>
            <div class="filter-row" style="margin:.3rem 0 .6rem">
              ${[["mind","Mind"],["tura","🥾 Túra"],["bringa","🚲 Bringa"],["esztena","🐑 Esztenák"]].map(([v,l])=>`<button class="f-pill ${HGY.filter===v?"on":""}" data-hgf="${v}">${l}</button>`).join("")}
            </div>
            <a class="btn btn-soft btn-sm btn-block" target="_blank" rel="noopener" href="${HAGYMAS_MAP_URL}">🔗 Interaktív térkép yeni ablakban</a>
            <div class="ext-links">
              <span class="small" style="width:100%;color:var(--bark-soft)">Külső útvonaladatbázisok — inspirationnak:</span>
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://hu.wikiloc.com/nyomvonalak/turazas/romania/harghita">🌐 Wikiloc · Hargita</a>
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://hu.wikiloc.com/nyomvonalak/turazas/romania/harghita/harghita-bai">🧭 Wikiloc · Hargita-bánya</a>
              <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.komoot.com/suggest/gyergy%C3%B3szentmikl%C3%B3s">🚴 Komoot · Gyergyó</a>
            </div>
            <p class="small muted" style="margin:.5rem 0 0">Forrás: adinagyhagymas.ro · ${HAGYMAS_ROUTES.length} útvonal (6 bringa, 30 gyalogos, 1 legelő-KML)</p>
          </div>
        </aside>
      </div>
      ${u?`
      <div class="hgy-list">
        ${list.map((r,i)=>{ const gi=HAGYMAS_ROUTES.indexOf(r);
          return `<div class="hgy-row"><b>${hgyIcon(r.t)}&nbsp; ${esc(r.n.replace(/_/g," "))}</b><span class="chip ${r.t==='bringa'?'chip-ember':r.t==='esztena'?'chip-sand':'chip-green'}" style="text-transform:none">${{bringa:"kerékpár",esztena:"legelő KML",tura:"túra GPX"}[r.t]}</span>
            <button class="btn btn-primary btn-sm" onclick="hgyImport(${gi},this)" ${r.t==='esztena'?'disabled title="KML — csak a Térképen' : ""}>🧭 Tervbe importálás</button>
            <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(r.url)}">⬇</a></div>` }).join("")}
      </div>` : `
      <div class="card panel center" style="border-radius:18px">
        <h3>Jelkezz be az importáláshoz</h3><p class="muted">Az útvonalak a te személyes túraközpontodba kerülnek.</p>
        <a class="btn btn-primary" href="#/belepes">Bejelentkezés</a>
      </div>`}
    </div>`;
  const shell = u ? dash("#/hagymas")(u.onboarded?body:`<p class="muted">Előbb töltsd ki a 5 perces onboardingt — utána tudod importálni az útvonalakat.</p><a class="btn btn-primary" href="#/onboarding">Onboarding</a>`) : body;
  return shell;
};
VIEWS.hagymas.after = root => {
  root.querySelectorAll("[data-hgf]").forEach(b=>b.onclick=()=>{ HGY.filter=b.dataset.hgf; render(); });
};

/* ---------- SZATT 2026 — Szent Anna-tó Teljesítménytúra modul ---------- */
function szattMakeTour(id){
  const src=TOURS.find(t=>t.id===id); if(!src) return;
  if(!Store.me()){ toast("A terv mentéséhez jelentkezz be","🔐"); NAV.to("#/belepes"); return; }
  const t=Store.newTourFromDraft({ title:src.name, place:src.start.name, region:src.region, date:"2026-09-12",
    lengthKm:src.km, ascent:src.up, durationH:src.h, difficulty:src.diff, tags:src.tags.slice(), img:src.img,
    desc:src.desc, coords:{...src.start}, waypoints:src.waypoints||[], notes:"Nevezés: "+SZATT.reg });
  toast("SZATT táv a túráim közé téve — szept. 12., Nyírfürdő 🏅","🏔");
  render(); location.hash="#/tura/"+t.id;
}
VIEWS.szatt = () => {
  if(!window.SZATT) return '<div class="wrap" style="padding:60px 20px"><h1>SZATT</h1><p class="muted">Az adatok nem tölthetők be.</p></div>';
  return `
  <div class="wrap pub-section tight" style="max-width:1000px">
    <div class="hcard big" style="min-height:240px;border-radius:22px;margin-bottom:14px">
      <img src="https://szatt.cseke.ro/img/szentannato-hero.jpg" alt="Szent Anna-tó" onerror="this.remove()">
      <div class="hb" style="padding:1.4rem">
        <span class="chip chip-pine">Csíkszéki EKE · SzATT</span>
        <h1 style="font-size:2rem;margin:.3rem 0">Szent Anna-tó Teljesítménytúra 2026</h1>
        <p style="margin:0">📅 <b>2026. szeptember 12., szombat</b> &nbsp;·&nbsp; 📍 <b>${esc(SZATT.location)}</b> &nbsp;·&nbsp; Rajt–cél a Nyírfürdőn, a Szent Anna-tó és a Mohos-tőzegláp szomszédságában</p>
      </div>
    </div>
    <div class="flex wrapcol" style="gap:.5rem;margin-bottom:14px">
      <a class="btn btn-ember btn-sm" target="_blank" rel="noopener" href="${SZATT.reg}">📝 Regisztráció (szatt.cseke.ro)</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${SZATT.tudnyivalok}">ℹ️ Tudnivalók</a>
      <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${SZATT.archive}">🕰 Archívum & eredmények</a>
      <a class="btn btn-soft btn-sm" href="#/esemenyek">← Eseménynaptár</a>
    </div>
    <div class="grid g3 smm2">
      ${SZATT.tavok.map(t=>{ const tr=TOURS.find(x=>x.src===t.detail);
        return `<div class="card panel szatt-kartya">
        <div class="flex between"><b>🏁 ${esc(t.n)}</b><span class="diff diff-${DIFFS[t.diff]}">${t.diff}</span></div>
        <div class="meta" style="margin:.5rem 0"><span>📏 <b>${t.km} km</b></span><span>⬆ <b>${t.up} m</b></span><span>⏱ <b>${t.h} ó</b></span><span>🕐 Rajt <b>${t.rajt}</b></span></div>
        <div class="flex" style="gap:.4rem;flex-wrap:wrap">
          ${tr?`<button class="btn btn-primary btn-sm" onclick="szattMakeTour('${tr.id}')">➕ A te túráid közé</button>`:""}
          <a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="${t.gpx}">⬇ GPX</a>
          <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${t.pdf}">📄 PDF (távterv)</a>
        </div></div>` }).join("")}
    </div>
    <div class="card panel" style="margin-top:14px">
      <h3 style="font-size:1rem">A múlt évek rajtolói</h3>
      <div class="flex" style="gap:1.4rem;flex-wrap:wrap">${SZATT.history.map(h=>`<div class="kpi"><b>${h.foven}</b><span>fő · ${h.y}</span></div>`).join("")}</div>
      <p class="small muted" style="margin-top:.7rem">Szervező: Csíkszéki Erdélyi Kárpát-Egyesület · ${SZATT.email} · ${SZATT.phone} — a nevezés korlátozott létszámú, érdemes időben jelentkezn! A távok frissítőkkel, emléklappal és meleg étellel a célban.</p>
    </div>
  </div>${footer()}`;
};


/* ---------- Nyomtatható biztonsági lap ---------- */
VIEWS.security = (id) => {
  const t = Store.getTour(id); if(!t) return `<div class="wrap pub-section"><h1>A túra nem található</h1><a class="btn btn-primary" href="#/turaim">← Túráim</a></div>`;
  const geo = t.coords ? `${t.coords.lat.toFixed(5)}, ${t.coords.lng.toFixed(5)}` : "nincs pont";
  return `
  <div class="print-page">
    <div class="print-head">
      <div class="logo" style="font-size:1.5rem">
        <svg viewBox="0 0 100 100" width="34" height="34"><path d="M6 84 L32 30 L50 60 L38 84 Z" fill="#1C4A36"/><path d="M31 84 L56 34 L78 70 L94 84 L14 84 Z" fill="#2F6B4A"/><path d="M10 76 C 28 56, 40 68, 54 50 S 78 52, 88 42" fill="none" stroke="#F7F4EC" stroke-width="3" stroke-dasharray="5 5"/><circle cx="76" cy="18" r="8" fill="#E07A2F"/></svg>
        <b>TURATÁR · ${esc(t.title)}</b><span class="muted small" style="margin-left:auto">${new Date().toLocaleString("hu-HU")}</span></div>
    </div>
    <div class="print-grid">
      <div class="sec-item"><span class="muted small">📍 Kiinduló pont</span><b>${esc(t.place||t.region||"—")} · ${geo}</b></div>
      <div class="sec-item"><span class="muted small">🎯 Cél</span><b>${esc(t.title)}</b></div>
      <div class="sec-item"><span class="muted small">🗺️ Tervezett útvonal</span><b>${t.gpx?(t.waypoints.length||0)+" saját pont + GPX":(t.waypoints.length? t.waypoints.map(w=>esc(w.name)).join(" → "):"jelzett turistaösvény")}</b></div>
      <div class="sec-item"><span class="muted small">📅 Dátum · nap</span><b>${t.date?fmtDateFull(t.date)+" ("+dowHU(t.date).slice(0,3)+")":"tervezés alatt"}</b></div>
      <div class="sec-item"><span class="muted small">🕕 Várható indulás</span><b>${esc(firstTimeVal(t))}</b></div>
      <div class="sec-item"><span class="muted small">🕗 Várható hazatérés</span><b>${esc(lastTimeVal(t))} +2 ó tartalék</b></div>
      <div class="sec-item"><span class="muted small">👥 Csapat (${(t.participants||[]).length+1} fő)</span><b>${(t.participants||[]).map(p=>esc(p.name)+(p.confirmed?"":" ⚠")).join(", ")||"egyedül"}</b></div>
      <div class="sec-item"><span class="muted small">📏 Táv · szint · nehézség</span><b>${t.lengthKm||"?"} km · ↑${t.ascent||"?"} m · ${esc(t.difficulty||"?")} · ${t.days} nap</b></div>
      ${t.meeting?`<div class="sec-item"><span class="muted small">🤝 Találkozás</span><b>${esc(t.meeting)}</b></div>`:""}
    </div>
    <p class="small" style="margin-top:1rem">Baleset, eltévedés, késés: <b>112</b> — és kérheted a hegyimentőket is. Ha a várható hazatérés +3 óra és nem jelkezik: jelezzék az útvonalat és a csapatot.</p>
    <div class="foot-112">🆘 112 &nbsp;·&nbsp; Túraterv link: #/biztonsag/${t.id} &nbsp;·&nbsp; ${(t.notes||"").slice(0,90)}</div>
    <div class="print-actions no-print">
      <button class="btn btn-primary btn-lg" onclick="window.print()">🖨 Nyomtatás / PDF mentés</button>
      <a class="btn btn-ghost btn-lg" href="#/tura/${t.id}">← Vissza a munkaterületre</a>
    </div>
    <p class="muted small" style="margin-top:1.2rem">A Lap a Túratárs demóból való — offline nyomtatásra PDF-be is elmentheted. Kérdésre a szervező elérhetősége a megosztott oldalon.</p>
  </div>`;
};

VIEWS.csapatstat = () => {
  const d=Store.myData();
  const tours=d.tours.filter(t=>(t.status==="tervezés"||t.status==="jelentkezve") && (t.participants||[]).length);
  const rows = tours.length ? tours.sort((a,b)=>(a.date||"9").localeCompare(b.date||"9")).map(t=>{
    const r = Store.readiness(t); const pend=t.participants.filter(p=>!p.confirmed);
    const gTodo=t.gear.filter(g=>!g.checked), fTodo=t.food.filter(f=>!f.checked);
    return `<div class="card panel cst-card">
      <div class="flex between wrapcol"><b>🥾 ${esc(t.title)}</b><span class="muted">${t.date?fmtDateFull(t.date):"—"} · Felkészültség <b>${r.pct}%</b></span></div>
      <div class="readi-track"><i style="width:${r.pct}%"></i></div>
      <div class="cst-cols">
        <div><b class="eyebrow">Csapat</b>${t.participants.map(p=>`<span class="cst-p ${p.confirmed?"ok":""}">${p.confirmed?"✔":"…"} ${esc(p.name)}</span>`).join("")}</div>
        <div><b class="eyebrow">Teendő</b>${[...gTodo.slice(0,3).map(g=>"☐ "+esc(g.name)), ...(fTodo.length?["☐ étel/víz ("+fTodo.filter(x=>!x.checked).length+" jelöletlen)"]:[])].slice(0,4).map(x=>`<span class="cst-t">${x}</span>`).join("")||"<span class=muted>minden kész</span>"}</div>
      </div>
      <div class="flex" style="gap:.5rem;margin-top:.4rem"><a class="btn btn-soft btn-sm" href="#/tura/${t.id}">Munkaterület</a>
      ${pend.length?`<button class="btn btn-ember btn-sm" data-chall-link="${t.id}">📣 Emlékeztető küldése</button>`:""}</div>
    </div>`}).join("") : '<div class="empty"><span class="em-ico">👥</span><h3>Nincs csapatostul tervezett túrád</h3><p class="muted">A Résztvevők fülön hívhatsz meg embereket — ekkor itt egy helyben látod, ki mit intézzen.</p><a class="btn btn-primary" href="#/turaim">Túráim</a></div>';
  return dash("#/csapat")( `
    <div class="dash-top"><div><h1>Csapat állapota 👥</h1><div class="hello">Egy nézetben: ki erősített már meg, kinek nincs meg a cucc, mi a hátra lévő feladat.</div></div></div>
    <div class="grid" style="gap:14px">${rows}</div>
    <div class="card panel" style="margin-top:14px"><p class="small muted mt0 mb0">💡 Az egyes résztvevők pipálását a túra Résztvevők fülén tudod jelölni — a cucc hiánya a Felszerelés fül állapotából jön.</p></div>`);
};

/* ——— heti kihivás elfogadása ——— */
function challPlan(){
  if(!Store.me()){ NAV.to("#/belepes"); return; }
  const d=Store.myData(); const wk=Math.floor((Date.now()-Date.UTC(new Date().getUTCFullYear(),0,1))/6048e5);
  const t0=TOURS[wk % Math.max(1,TOURS.length)];
  const wname=d.wishlist.length?(d.wishlist[wk%d.wishlist.length].name):(t0 ? t0.name.split("(")[0].trim() : "Heti kihívás");
  const date0=(()=>{ const days=[...Array(6)].map((_,i)=>Store.addDays(Store.todayISO(),i+2)); const f=days.find(dd=>{const k=new Date(dd).getDay();return k===6;}) || days[0]; return f; })();
  const t=Store.newTourFromDraft({ title:"🎯 "+wname+" — heti kihívás", place:wname, region:(t0&&t0.region)||"",
    date: date0, lengthKm:(t0&&t0.km)||6, ascent:(t0&&t0.up)||300, durationH: 2,
    difficulty:"Könnyű", tags:(t0?t0.tags.slice(0,2):["kilátás"]).concat(["kihívás"]),
    coords:(t0&&{...t0.start})||null, img:(t0&&t0.img)||IMG.mezofeny,
    desc:"A heti kihívás: "+wname+" — a feladat a Túratárs hetimalomából. Képet a teljesítés után az Élménykönyvbe!" });
  toast("Kész — a kihívás a tervedben van, "+fmtDate(date0)+"-re!","🎯");
  render(); location.hash="#/tura/"+t.id;
}

(function(){ const c=root=>{ root.querySelectorAll("[data-chall-link]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(b.dataset.challLink); if(t){ if(!t.shareCode){ t.shareCode=Store.uid("sh").replace("sh","ch")+Date.now().toString(36); Store.save(); toast("Megosztott lap link: #/osztott/"+t.shareCode,"📣"); }
  navigator.clipboard && navigator.clipboard.writeText(location.origin+location.pathname+"#/osztott/"+t.shareCode).then(()=>{ toast("Csapat-emlékeztető link kimásolva!","📣"); },(()=>0)); } }); };
  const _o=VIEWS.csapatstat.after; VIEWS.csapatstat.after=(root,arg)=>{ if(_o) _o(root,arg); c(root); }; })();
