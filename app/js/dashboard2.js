/* ============================================================
   TÚRAVAROS — DASHBOARD 2: bakancslista, felszerelés, csapatok,
   napló, statisztikák, AI túratárs, saját térkép, értesítések, beállítások
   ============================================================ */
"use strict";

/* ---------- BAKANCSLISTA ---------- */
let wishCat = "";
VIEWS.wishlist = () => {
  const d = Store.myData();
  const items = d.wishlist.filter(w=>!wishCat||w.cat===wishCat);
  const byCat = {};
  items.forEach(w=>{ const k=(w.cat==null||w.cat==="")?"Egyéb":String(w.cat); (byCat[k]=byCat[k]||[]).push(w); });
  return dash("#/bakancslista")(`
    <div class="dash-top"><div><h1>Bakancslista ❤️</h1>
      <div class="hello">Azok a helyek, amikre egyszer el akarsz jutni — innen egy kattintás túrát tervezni.</div></div>
      <button class="btn btn-primary" id="wish-add">➕ Új hely hozzáadása</button></div>
    <div class="filter-row"><button class="f-pill ${!wishCat?"on":""}" data-wc="">Összes (${d.wishlist.length})</button>
      ${WISH_CATS.map(c=>`<button class="f-pill ${wishCat===c.name?"on":""}" data-wc="${esc(c.name)}">${c.icon} ${c.name} (${d.wishlist.filter(w=>w.cat===c.name).length})</button>`).join("")}</div>
    ${items.length? Object.entries(byCat).map(([cat,ws])=>`
      <div style="margin-bottom:1.6rem"><h2 style="font-size:1.15rem">${WISH_CATS.find(c=>c.name===cat)?.icon||"📍"} ${esc(cat)}</h2>
      <div class="wish-grid">${ws.map(w=>`
        <div class="card" style="overflow:hidden;border-radius:20px">
          <div class="wcard" style="aspect-ratio:4/3">
            ${imgTag(w.img||IMG.erdo,w.name)}
            <div class="wb"><h3>${esc(w.name||w.place||"Névtelen tipp")}</h3><div class="meta" style="color:#dbe7da"><span>${esc(w.place||"")} · ${esc(w.diff||"")}</span></div>
            <div class="flex" style="margin-top:.55rem;flex-wrap:wrap">
              <button class="btn btn-ember btn-sm" data-wplan="${w.id}">🗓️ Tervet készítek</button>
              <button class="icon-btn" style="background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3);color:#fff" data-wdel="${w.id}" aria-label="Eltávolítás">✕</button>
            </div></div>
            <span class="heart">${w.custom?"📍":"❤️"}</span>
          </div></div>`).join("")}</div></div>`).join("")
    : `<div class="empty"><span class="em-ico">💔</span><h3>Ebben a kategóriában még nincs mentett hely</h3>
       <p>Böngesd végig a legszebb helyeket a nyilvános oldalon, mentsd el őket egy kattintással.</p>
       <a class="btn btn-primary" href="#/helyek">🧭 Helyek felfedezése</a></div>`}
    <div class="card panel" style="margin-top:1rem"><h3>💡 Tipp</h3><p class="muted mb0 small">A Bakancslista pontjai a saját térképeden piros szíven jelennek meg — lásd, hol jártál már és hová vágysz.</p></div>`);
};
VIEWS.wishlist.after = root => {
  root.querySelectorAll("[data-wc]").forEach(b=>b.onclick=()=>{wishCat=b.dataset.wc; render();});
  root.querySelector("#wish-add").onclick = () => {
    openModal({ title:"Új hely a bakancslistára",
      body:`<label class="f">Hely neve *</label><input class="input" id="nw-n" placeholder="Hely vagy cél neve">
        <div style="height:.7rem"></div><label class="f">Kategória</label>
        <select class="input" id="nw-c">${WISH_CATS.map(c=>`<option>${esc(c.name)}</option>`).join("")}</select>
        <div style="height:.7rem"></div><label class="f">Hol találtad? (tájegység, helység)</label><input class="input" id="nw-p" placeholder="Pl. Hargita">
        <div style="height:.7rem"></div><label class="f">Nehézség</label><select class="input" id="nw-d"><option>Könnyű</option><option selected>Közepes</option><option>Nehéz</option></select>`,
      footer:`<button class="btn btn-primary btn-block" id="nw-save">❤️ Mentés</button>`,
      onOpen(r){ r.querySelector("#nw-save").onclick=()=>{ const n=r.querySelector("#nw-n").value.trim();
        if(!n){ toast("Adj nevet a helynek","⚠️"); return; }
        Store.toggleWish({id:"c_"+n, name:n, cat:r.querySelector("#nw-c").value, place:r.querySelector("#nw-p").value, diff:r.querySelector("#nw-d").value, img:IMG.erdo, custom:true});
        closeModal(); toast("Felkerült a bakancslistára","❤️"); render(); }; } });
  };
  root.querySelectorAll("[data-wdel]").forEach(b=>b.onclick=()=>{ Store.rmWish(b.dataset.wdel); toast("Eltávolítva a listáról","—"); render(); });
  root.querySelectorAll("[data-wplan]").forEach(b=>b.onclick=()=>{
    const w = Store.myData().wishlist.find(x=>x.id===b.dataset.wplan);
    openModal({ title:`Túra terv: ${esc(w.name)}`,
      body:`<p class="muted mt0">Mikor mennél?</p><input class="input" type="date" id="wp-date" value="${Store.addDays(Store.nextSatDate(),7)}">
        <label class="f" style="margin-top:.8rem">Kivel?</label><input class="input" id="wp-with" placeholder="Pl. Réka, család…">`,
      footer:`<button class="btn btn-primary btn-block" id="wp-go">🥾 Munkaterület létrehozása</button>`,
      onOpen(r){ r.querySelector("#wp-go").onclick=()=>{
        const base = TOURS.find(t=>t.start.name.toLowerCase().includes(w.name.toLowerCase().split(" ")[0].toLowerCase().slice(0,5))) ||
                     TOURS.find(t=>t.region && (w.place||"").toLowerCase().includes(t.region.toLowerCase().split(" ")[0]));
        const t = Store.newTourFromDraft({ title:`${w.name} — bakancslista-túra`, place:w.place||w.name,
          date:r.querySelector("#wp-date").value, difficulty:w.diff||"Közepes", img:w.img,
          tags:base?base.tags:[ "kul", "cs" ].filter(x=>x), lengthKm: base?base.km:"?",
          ascent: base?base.up:"?", durationH: base?base.h:"?" });
        closeModal(); NAV.to("#/tura/"+t.id); }; } });
  });
};

/* ---------- FELSZERELÉSEM ---------- */
VIEWS.equipment = () => {
  const d = Store.myData();
  const have = d.equipment.filter(e=>e.has), miss = d.equipment.filter(e=>!e.has);
  const catIcon = c => ({Bakancs:"🥾",Hátizsák:"🎒",Kabát:"🧥",Fejlámpa:"🔦",Túrabot:"🦯",Sátor:"⛺",Hálózsák:"🛌",Ivókanna:"💧",Egyéb:"🧰"}[c]||"🧰");
  return dash("#/felszereles")(`
    <div class="dash-top"><div><h1>Felszerelésem 🎒</h1>
      <div class="hello">A saját cuccaid listája — új tervnél a rendszer ebből indul ki, és azt jelöli, ami még hiányzik.</div></div>
      <button class="btn btn-primary" id="eq-add">➕ Eszköz hozzáadása</button></div>
    <div class="gear-cols">
      <div class="card panel"><h3>✅ Megvan (${have.length})</h3>
        ${have.map(g=>gearRow(g,catIcon)).join("")||'<p class="muted small">Még nem adtál hozzá eszközt.</p>'}</div>
      <div class="card panel" style="border-color:#f2d3b3"><h3><span class="warn-ic">🧯</span> Hiányzik (${miss.length})</h3>
        ${miss.map(g=>gearRow(g,catIcon)).join("")||'<p class="muted small">Teljes a szerelésed — nem kell többé boltok között rohangálnod. 🎉</p>'}</div>
    </div>`);
};
function expiryBadge(x){ const d=Math.ceil((new Date(x)-new Date())/864e5);
  if(d<0) return '<span class="chip chip-ember" style="text-transform:none">⚠ lejárt: '+x+'</span>';
  if(d<=30) return '<span class="chip" style="text-transform:none;background:#FBF4DE;color:#8a6d12">📅 '+d+' nap — újítsd fel!</span>';
  return '<span class="chip chip-green" style="text-transform:none">✔ érvényes: '+x+'</span>'; }
function gearRow(g, icon){
  return `<div class="flex between" style="border-bottom:1px solid var(--line);padding:.7rem .2rem;gap:.6rem">
    <div class="flex" style="gap:.7rem;min-width:0"><span style="font-size:1.45rem;flex:none">${g.icon||icon(g.cat)}</span>
      <div style="min-width:0"><b style="font-size:.95rem">${esc(g.name)}</b>
        <div class="meta" style="font-size:.78rem">${g.expiry?expiryBadge(g.expiry):""}<span>${esc(g.cat)}</span><span title="A naplóból számolt összes túra-táv">🧭 eddig ${Store.journalKmTotal()} km</span>${(Store.journalKmTotal()>800&&/Bakancs|Hátizsák/.test(g.cat))?`<span class="gear-badge" style="background:var(--ember-soft);color:#B95E1C">✂ ideje újat venni!</span>`:""}${g.w?`<span>⚖ ${g.w>=1000?(g.w/1000).toFixed(1).replace(".",",")+" kg":g.w+" g"}</span>`:""}${g.cond?`<span>Állapot: ${g.cond==="Jó"?"🟢 "+esc(g.cond):g.cond.includes("Közepes")?"🟡 "+esc(g.cond):"🔴 "+esc(g.cond)}</span>`:""}</div>
        ${g.note?`<div class="small muted" style="font-style:italic">${esc(g.note)}</div>`:""}</div></div>
    <div class="flex" style="flex:none">
      <button class="btn btn-sm ${g.has?"btn-ghost":"btn-soft"}" data-toggle-has="${g.id}">${g.has?"Megvan ✓":"Szerzem… ⏳"}</button>
      <button class="icon-btn" data-eq-edit="${g.id}" aria-label="Szerkesztés">✎</button>
      <button class="icon-btn" data-eq-del="${g.id}" aria-label="Törlés">🗑</button></div></div>`;
}
VIEWS.equipment.after = root => {
  const form = (g={})=>`<label class="f">Eszköz neve *</label><input class="input" id="eq-n" value="${esc(g.name||"")}" placeholder="Pl. Hógázló">
    <div style="height:.7rem"></div><label class="f">Kategória</label><select class="input" id="eq-c">${GEAR_OWN_CATS.map(c=>`<option ${g.cat===c?"selected":""}>${c}</option>`).join("")}</select>
    <div style="height:.7rem"></div><label class="f">Állapot</label><select class="input" id="eq-s"><option ${g.cond==="Jó"?"selected":""}>Jó</option><option ${g.cond&&g.cond.startsWith("Közepes")?"selected":""}>Közepes</option><option ${g.cond==="Kopott"?"selected":""}>Kopott</option><option value="">Nincs rögzítve</option></select>
    <div style="height:.7rem"></div><label class="f">Súly (g) — hátizsák-kalkulátorhoz</label><input class="input" id="eq-w" type="number" min="0" step="10" value="${g.w||700}">
    <div style="height:.7rem"></div><label class="f">Biztosítás / tagság lejárata (opcionális)</label><input class="input" id="eq-x" type="date" value="${esc(g.expiry||"")}">
    <div style="height:.7rem"></div><label class="f">Megvan-e?</label><select class="input" id="eq-h"><option value="1" ${g.has!==false?"selected":""}>Igen, megvan</option><option value="0" ${g.has===false?"selected":""}>Még nem / nincs</option></select>
    <div style="height:.7rem"></div><label class="f">Jegyzet</label><input class="input" id="eq-note" value="${esc(g.note||"")}" placeholder="Pl. télen microspikes mehet rá">`;
  const save = (r,id) => { const o = { id, name:r.querySelector("#eq-n").value.trim(), cat:r.querySelector("#eq-c").value,
    cond:r.querySelector("#eq-s").value, has:r.querySelector("#eq-h").value==="1", note:r.querySelector("#eq-note").value, expiry:r.querySelector("#eq-x").value||null, icon:{"Bakancs":"🥾","Hátizsák":"🎒","Kabát":"🧥","Fejlámpa":"🔦","Túrabot":"🦯","Sátor":"⛺","Hálózsák":"🛌","Ivókanna":"💧"}[r.querySelector("#eq-c").value]||"🧰", w:Math.max(0,+r.querySelector("#eq-w")?.value||0) };
    if(!o.name){ toast("Add meg az eszköz nevét","⚠️"); return false; }
    Store.saveEquipment(o); return true; };
  root.querySelector("#eq-add").onclick = () => openModal({ title:"Új eszköz", body:form(), footer:`<button class="btn btn-primary btn-block" id="eq-save">Mentés</button>`,
    onOpen(r){ r.querySelector("#eq-save").onclick=()=>{ if(save(r)){ closeModal(); toast("Eszköz elmentve","🎒"); render(); } }; } });
  root.querySelectorAll("[data-eq-edit]").forEach(b=>b.onclick=()=>{ const g=Store.myData().equipment.find(x=>x.id===b.dataset.eqEdit);
    openModal({ title:"Eszköz szerkesztése", body:form(g), footer:`<button class="btn btn-primary btn-block" id="eq-save">Mentés</button>`,
      onOpen(r){ r.querySelector("#eq-save").onclick=()=>{ if(save(r,g.id)){ closeModal(); render(); } }; } }); });
  root.querySelectorAll("[data-toggle-has]").forEach(b=>b.onclick=()=>{ const g=Store.myData().equipment.find(x=>x.id===b.dataset.toggleHas);
    Store.saveEquipment({...g, has:!g.has, cond: g.has? "—" : (g.cond||"Jó")}); render(); });
  root.querySelectorAll("[data-eq-del]").forEach(b=>b.onclick=()=>{
    confirmDlg("Eszköz törlése a listáról?","Törlés",()=>{ Store.removeEquipment(b.dataset.eqDel); toast("Törölve","🗑"); render(); }); });
};

/* ---------- TÚRACSAPATOK ---------- */
VIEWS.teams = () => {
  const d = Store.myData();
  const nextShared = t => { const names=new Set(t.members.map(m=>m.name));
    return Store.upcoming().find(x=>x.participants.some(p=>names.has(p.name)) && x.participants.length>=2); };
  return dash("#/csapatok")(`
    <div class="dash-top"><div><h1>Túracsapatok 👥</h1><div class="hello">Barátok, közös túrák, autók — egyszerűen.</div></div>
      <button class="btn btn-primary" id="tm-new">➕ Csapat létrehozása</button></div>
    <div class="grid g2">
      ${d.teams.map(t=>{ const nt = nextShared(t); return `
      <div class="card panel">
        <div class="flex between"><h3>${esc(t.name)}<span class="chip chip-green" style="margin-left:.5rem">${t.members.length} tag</span></h3>
          ${t.joined?`<button class="btn btn-ghost btn-sm" data-leave="${t.id}">Kilépés</button>`:`<button class="btn btn-ember btn-sm" data-join="${t.id}">Csatlakozom</button>`}${t.joined?`<button class="btn btn-soft btn-sm" style="margin-left:.4rem" data-invite="${t.id}">📨 Meghívás</button>`:""}</div>
        ${t.desc?`<p class="small muted">${esc(t.desc)}</p>`:""}
        <div class="flex wrapcol" style="gap:.45rem;margin:.55rem 0">
          ${t.members.slice(0,6).map(m=>`<span class="person-chip"><span class="avt">${initials(m.name)}</span>${esc(m.name)}${m.role==="szervező"?' <span class="chip chip-pine" style="text-transform:none;font-size:.62rem">vezér</span>':""}</span>`).join("")}
          ${t.members.length>6?`<span class="small muted">+${t.members.length-6}</span>`:""}</div>
        ${nt?`<div class="card" style="background:var(--cream);padding:.7rem .9rem;border-radius:12px">
          <div class="small muted">Következő közös túrátok:</div><b>🥾 ${esc(nt.title)}</b> · ${fmtDateFull(nt.date)}
          <div class="small">${count(nt.participants,p=>p.confirmed)}/${nt.participants.length} erősítette meg</div>
          <a class="btn btn-soft btn-sm" style="margin-top:.5rem" href="#/tura/${nt.id}">Részletek</a></div>`:`<p class="small muted">${t.joined?"Nincs még közös tervezett túrátok — hívd meg a többieket egy túrára!":"Csatlakozz, és máris látod a közös terveket."}</p>`}
      </div>`; }).join("")}
    </div>
    <h2 style="font-size:1.15rem;margin-top:2rem">👥 Csatlakozás hívókóddal</h2>
    <div class="card panel" style="padding:1rem">
      <p class="muted small mt0" style="margin-bottom:.5rem">Kaptál kódot a túratársadtól? Írd be — ha a csapat ezen a gépen szerepel, a te listádba kerülsz. A többeszközös szinkron szerveres háttérrel jön.</p>
      <div class="flex" style="gap:.6rem;flex-wrap:wrap"><input class="input" id="jc-in" placeholder="Pl. A1B2" style="width:150px;text-transform:uppercase"><button class="btn btn-primary btn-sm" id="jc-go">Csatlakozom</button>
      <a class="btn btn-ghost btn-sm" href="#/uj-tura">➕ Új túra a csapattal</a></div></div>
`);
};
VIEWS.teams.after = root => {
  const jcg=root.querySelector("#jc-go"); if(jcg) jcg.onclick=()=>{ const code=root.querySelector("#jc-in").value.trim().toUpperCase();
    if(!code){ toast("\u00cdrd be a h\u00edv\u00f3k\u00f3dot", "\u2328\ufe0f"); return; }
    const t=(Store.myData().teams||[]).find(x=>(x.inviteCode||"")===code);
    if(!t){ toast("Ilyen h\u00edv\u00f3k\u00f3d\u00fa csapat nem tal\u00e1lhat\u00f3 ezen a g\u00e9pen \u2014 a t\u00f6bbeszem\u00e9ly\u0171 szinkron szerveres h\u00e1tt\u00e9rrel j\u00f6v\u0151.", "\ud83d\udd0e"); return; }
    Store.joinTeam(t.id); Store.save(); toast("Bel\u00e9pt\u00e9l a(z) "+t.name+" csapatba", "\ud83d\udc65"); render(); };
  const t0 = Store.myData().teams;
  root.querySelector("#tm-new").onclick = () => openModal({ title:"Új túracsapat",
    body:`<label class="f">Csapat neve *</label><input class="input" id="nc-n" placeholder="Pl. Hétfő reggeli Sétacsapat">
      <div style="height:.7rem"></div><label class="f">Rövid leírás</label><input class="input" id="nc-d" placeholder="Kinek szól, milyen ritmusban?">`,
    footer:`<button class="btn btn-primary btn-block" id="nc-save">Csapat létrehozása</button>`,
    onOpen(r){ r.querySelector("#nc-save").onclick=()=>{ const n=r.querySelector("#nc-n").value.trim();
      if(!n){ toast("Adj nevet","⚠️"); return; }
      Store.addTeam(n); const t=Store.teamById(Store.myData().teams.at(-1).id); t.desc=r.querySelector("#nc-d").value; Store.save();
      closeModal(); toast("Csapat kész — hívj meg embereket a túráidon!","👥"); render(); }; } });
  root.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>{ Store.joinTeam(b.dataset.join);
    Store.save(); toast("Beléptél a csapatba — a hívást a 📨 Meghívás gombbal küldheted","👥"); render(); });
  root.querySelectorAll("[data-invite]").forEach(b=>b.onclick=()=>{ const t=Store.teamById(b.dataset.invite);
    if(!t.inviteCode){ t.inviteCode=Math.random().toString(36).slice(2,6).toUpperCase(); Store.save(); }
    const msg="Gyere a(z) "+t.name+" túracsapatba a Túratársban! Csatlakozó kód: "+t.inviteCode+" — "+location.href.split("#")[0];
    openModal({title:"📨 Meghívás — "+esc(t.name), body:`<p class="small muted mt0">Küldd el ezt a szöveget (Messenger, SMS, mail). A kódot a meghívott a „Csatlakozás hívókóddal” mezőbe írja be.</p>
      <div class="code-line"><b id="inv-code">${t.inviteCode}</b><button class="btn btn-soft btn-sm" id="inv-copy">Kód másolása</button></div>
      <label class="f" for="inv-msg" style="margin-top:.7rem">Meghívó szöveg</label><textarea class="input" id="inv-msg" rows="3" style="font-size:.85rem">${esc(msg)}</textarea>
      <label class="f" for="inv-name" style="margin-top:.7rem">Vagy vedd fel neved szerint a csapat listába:</label>
      <div class="flex" style="gap:.5rem"><input class="input" id="inv-name" placeholder="Pl. Kiss Anna — utána a túra Résztvevők fülére" style="flex:1"><button class="btn btn-primary btn-sm" id="inv-add">＋</button></div>`,
      footer:`<button class="btn btn-ghost btn-block" data-close>Kész</button>`,
      onOpen(r){ r.querySelector("#inv-copy").onclick=()=>{ navigator.clipboard.writeText(r.querySelector("#inv-msg").value).then(
        ()=>toast("Meghívó szöveg a vágólapon ✔","📋"), ()=>toast("A böngésző nem enged másolást — jelöld ki a szöveget","📋")); };
        r.querySelector("#inv-add").onclick=()=>{ const v=r.querySelector("#inv-name").value.trim(); if(!v){toast("Írd be a nevet","✍️");return;}
          const tt=Store.teamById(b.dataset.invite); tt.members.push({id:Store.uid("m"),name:v,role:"tag"}); Store.save();
          closeModal(); toast(v+" benne van a csapatban — a túra Résztvevők fülén jelöld","👥"); render(); }; } }); });

  root.querySelectorAll("[data-leave]").forEach(b=>b.onclick=()=>{ Store.leaveTeam(b.dataset.leave); render(); });
};

/* ---------- TÚRANAPLÓ ---------- */
VIEWS.journal = () => {
  const d = Store.myData(); const js = d.journal.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
  let lastM = "";
  return dash("#/naplo")(`
    <div class="dash-top"><div><h1>Túranapló 📖</h1><div class="hello">A te sztorid, a te képeiddel — minden teljesített túra egy-egy bejegyzés.</div></div></div>
    ${js.length? js.map(j=>`
      ${(()=>{ const m=(j.date||"").slice(0,7); const lab=m?`${MONTHS_HU[+m.slice(5,7)-1]} ${m.slice(0,4)}`:""; const head = lab!==lastM? (lastM=lab, `<h2 style="font-size:1.1rem;margin:1.6rem 0 .6rem;color:var(--moss)">${lab}</h2>`):""; return head; })()}
      <article class="card jcard" style="margin-bottom:14px">
        <div class="img-wrap">${imgTag(Store.myData().tours.find(t=>t.id===j.tourId)?.img||IMG.erdo, j.title)}</div>
        <div class="jb">
          <div class="flex between wrapcol"><b>${esc(j.title)}</b><span class="small muted">${fmtDateFull(j.date)}</span></div>
          <span class="stars">${"★".repeat(j.rating||0)}${"☆".repeat(5-(j.rating||0))}</span>
          <p class="small" style="margin:.3rem 0 .2rem;color:var(--bark-soft)">"${esc(j.note||"")}"</p>
          <div class="meta" style="font-size:.8rem"><span>📍 ${esc(j.place||"—")}</span><span>📏 ${j.km==null||j.km===""?"—":esc(String(j.km))+" "} km</span><span>⬆ ${j.up==null||j.up===""||isNaN(+j.up)?"—":j.up} m</span><span>⏱ ${j.h==null||j.h===""||isNaN(+j.h)?"—":j.h} ó</span></div>
          <div class="flex" style="margin-top:.6rem">
            <button class="btn btn-ghost btn-sm" data-jedit="${j.id}">✎ Jegyzet szerkesztése</button>
            ${j.tourId?`<a class="btn btn-soft btn-sm" href="#/tura/${j.tourId}">📁 Munkaterület</a>`:""}
            <a class="btn btn-soft btn-sm" href="?img=/photo/${j.id}">🖼 Képek megnyitása</a>
          </div></div>
      </article>`).join("")
    : `<div class="empty"><span class="em-ico">📖</span><h3>A naplód még üres</h3><p>Ha teljesítesz egy túrát, ide felkerül az értékeléseddel, képeiddel és a saját szavaiddal. A többi — dátum, táv, szint — automatikusan rendeződik.</p>
      <a class="btn btn-primary" href="#/turaim">Túráim</a></div>`}`);
};
VIEWS.journal.after = root => {
  root.querySelectorAll("[data-jedit]").forEach(b=>b.onclick=()=>{
    const j = Store.myData().journal.find(x=>x.id===b.dataset.jedit);
    openModal({ title:`Jegyzet: ${esc(j.title)}`,
      body:`<textarea class="input" id="jn" rows="4">${esc(j.note||"")}</textarea>
        <label class="f" style="margin-top:.8rem">Értékelés</label><select class="input" id="jr">${[5,4,3,2,1].map(n=>`<option value="${n}" ${j.rating===n?"selected":""}>${"★".repeat(n)}</option>`).join("")}</select>`,
      footer:`<button class="btn btn-primary btn-block" id="js">Mentés</button>`,
      onOpen(r){ r.querySelector("#js").onclick=()=>{ j.note=r.querySelector("#jn").value; j.rating=+r.querySelector("#jr").value;
        Store.updateTour(j.tourId,{}); renderNotifSafe(); closeModal(); toast("Napló frissítve","📖"); render(); }; } });
  });
};
function renderNotifSafe(){ try{ renderHeader(); }catch(e){} }

/* ---------- STATISZTIKÁK ---------- */
VIEWS.stats = () => {
  const s = Store.stats(), d = Store.myData();
  const months = []; const now=new Date();
  for(let i=11;i>=0;i--){ const dd=new Date(now.getFullYear(),now.getMonth()-i,1);
    months.push(`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,"0")}`); }
  const maxKm = Math.max(1,...months.map(m=>(s.byM[m]||{km:0}).km));
  const diffs = Object.entries(s.diffs), maxD = Math.max(1,...diffs.map(x=>x[1]));
  const goalPct = Math.min(100, Math.round(s.yearKm/s.goals.km*100));
  const ring = (p, color) => { const c=2*Math.PI*58; return `<svg width="150" height="150"><circle cx="75" cy="75" r="58" stroke="#EFE8D8" stroke-width="12" fill="none"/>
    <circle cx="75" cy="75" r="58" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p/100)}" style="transition:stroke-dashoffset 1s"/></svg>`; };
  return dash("#/statisztikak")(`
    <div class="dash-top"><div><h1>Statisztikák 📊</h1><div class="hello">Ahol a kilométerek sztorivá válnak.</div></div></div>
    <div class="grid g4 smm2" style="margin-bottom:18px">
      <div class="kpi"><span class="kic">🥾</span><div><b>${s.tours}</b><span>összes túra</span></div></div>
      <div class="kpi"><span class="kic">📏</span><div><b>${Math.round(s.km)}</b><span>összes kilométer</span></div></div>
      <div class="kpi"><span class="kic">⬆️</span><div><b>${(s.up/1000).toFixed(1)}k</b><span>m szintkülönbség</span></div></div>
      <div class="kpi"><span class="kic">⏱️</span><div><b>${Math.round(s.h)}</b><span>óra a túraösvényeken</span></div></div>
      <div class="kpi"><span class="kic">🏔️</span><div><b>${s.summits}</b><span>megmászott csúcs</span></div></div>
      <div class="kpi"><span class="kic">🎯</span><div><b>${s.planned}</b><span>tervezés alatt</span></div></div>
      <div class="kpi"><span class="kic">📅</span><div><b>${new Date().getFullYear()}</b><span>${s.yearKm} km eddig</span></div></div>
      <div class="kpi"><span class="kic">🔥</span><div><b>${s.tours?Math.round(s.km/s.tours*10)/10:"0"}</b><span>km / átlagtúra</span></div></div>
    </div>
    <div class="grid" style="grid-template-columns:1.15fr .85fr;align-items:start;gap:18px">
      <div class="card chart-card"><h3>Havonta megtett km</h3>
        ${months.map(m=>{ const v=(s.byM[m]||{km:0,tours:0}); const mon=m.slice(5,7);
          return `<div class="bar-row"><span class="bl">${MONTHS_HU[+mon-1].slice(0,3)}.</span>
            <span class="bt"><i style="width:${Math.max(v.km?2:0, v.km/maxKm*100)}%;background:${m.startsWith(String(now.getFullYear()))?"linear-gradient(90deg,var(--moss),var(--leaf))":"#cfe0cf"}"></i></span>
            <span class="bv">${Math.round(v.km)} km · ${v.tours}×</span></div>`; }).join("")}
        <p class="small muted">A sávok a teljesített túrák távolságát mutatják az elmúlt 12 hónapban.</p>
      </div>
      <div>
        <div class="card chart-card">
          <h3>Nehézségi megoszlás</h3>
          ${diffs.map(([k,v])=>`<div class="bar-row"><span class="bl">${k.slice(0,3)}</span><span class="bt"><i style="width:${v/maxD*100}%"></i></span><span class="bv">${v} db</span></div>`).join("")}
        </div>
        <div class="card chart-card" style="margin-top:14px"><h3>Kedvenc tájegységek</h3>
          ${Object.entries(s.regions).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`<div class="bar-row"><span class="bl" style="font-size:.72rem">${esc(k.slice(0,5))}.</span><span class="bt"><i style="width:${v/Math.max(...Object.values(s.regions))*100}%;background:linear-gradient(90deg,var(--sky),#6FA8C8)"></i></span><span class="bv">${v}× </span></div>`).join("")||'<p class="small muted">Még nincs adat.</p>'}</div>
      </div>
    </div>
    <div class="card chart-card" style="margin-top:18px">
      <div class="flex between wrapcol"><h3 style="margin:0">Éves cél — ${s.year}</h3>
        <div class="flex" style="gap:.4rem"><label class="f" style="margin:0">Cél (km)</label><input class="input" id="goal-km" type="number" style="width:90px" value="${s.goals.km}"><button class="btn btn-soft btn-sm" id="goal-save">Mentés</button></div></div>
      <div class="split2" style="grid-template-columns:170px 1fr;margin-top:.8rem;gap:24px">
        <div class="goal-ring">${ring(goalPct,"var(--ember)")}<div class="gr-c"><b>${goalPct}%</b><span>${Math.round(s.yearKm)} / ${s.goals.km} km</span></div></div>
        <div>
          <div class="progress-strip" style="height:20px"><i style="width:${goalPct}%"></i></div>
          <p class="small muted" style="margin-top:.6rem">${goalPct>=100? "🏆 Cél teljesítve — tűzz ki újat!" : `Még ${Math.max(0,s.goals.km-Math.round(s.yearKm))} km hiányzik a ${s.year}-i célhoz. ${Math.ceil((s.goals.km-s.yearKm)/Math.max(1,s.yearKm/((+Store.todayISO().slice(5,7)))))} km átlag/hónap kell a hátralévő időben.`}</p>
        </div></div>
    </div>`);
};
VIEWS.stats.after = root => {
  const g = root.querySelector("#goal-km");
  root.querySelector("#goal-save").onclick=()=>{ Store.myData().goals.km=Math.max(10,+g.value||300); Store.save(); toast("Cél mentve 🎯","✅"); render(); };
};

/* ---------- AI TÚRATÁRS ---------- */
VIEWS.ai = () => {
  const d=Store.myData();
  const msgs = d.aiChat||[];
  return dash("#/ai")(`
    <div class="dash-top"><div><h1>AI Túratervező 🤖</h1><div class="hello">Írd le természetesen, mire vágysz — ő ajánl túrát, időtervet, csomaglistát, étellistát. Egy gombbal új túraként is elmentheted.</div></div></div>
    <div class="ai-shell card" style="padding:1.1rem 1.2rem">
      <div class="ai-msgs" id="ai-msgs">
        ${msgs.length? msgs.map(m=>`<div class="bub ${m.role==="user"?"user":"ai"}">${m.html||esc(m.text)}</div>`).join("") :
        `<div class="bub ai">Szia! Én a Túratárs Túratervezője vagyok. 🥾<br>Pl.: <i>„Szombaton szeretnék egy közepes nehézségű, maximum 5 órás túrát gyönyörű kilátással.”</i></div>`}
        ${msgs.length? msgs.filter(m=>m.role==="ai"&&m.result).slice(-1).map(m=>aiRecCard(m.result)).join(""):""}
      </div>
      <div class="ai-chips">
        ${["Könnyű, 3 órán belüli családi túra vízeséshez","Nehéz túra, holnap, komoly szintekkel","Napfelkelte-sétalehetőség vasárnap","Többnapos sátrazós túra az erdőben"].map(c=>`<button class="f-pill" data-chip="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <div class="ai-input-row"><input class="input" id="ai-in" placeholder="Mire vágysz a héten? Írd le, mint egy barátnak…" autocomplete="off">
        <button class="btn btn-primary" id="ai-send">Küldés ➤</button></div>
    </div>`);
};
function aiRecCard(r){
  if(!r) return "";
  const t=r.tour;
  return `<div class="ai-card-rec">
    <div class="img-wrap" style="height:110px">${imgTag(t.img,t.name)}</div>
    <div style="padding:.85rem .95rem">
      <b>${esc(t.name)}</b><div class="meta" style="font-size:.8rem;margin-top:.2rem"><span>${esc(t.region)}</span><span>📏 ${t.km} km</span><span>⏱ ${t.h} ó</span><span>⬆ ${t.up} m</span>${diffChip(t.diff)}</div>
      <p class="small muted" style="margin:.5rem 0 .6rem">${r.why}</p>
      <div class="flex" style="gap:.4rem;flex-wrap:wrap">
        <button class="btn btn-ember btn-sm" data-aims="${t.id}" data-aidate="${r.date}">💾 Mentés új túraként</button>
        <a class="btn btn-ghost btn-sm" href="#/turak/${t.id}">👀 Részletek</a></div></div></div>`;
}
VIEWS.ai.after = root => {
  const d=Store.myData(); const box=root.querySelector("#ai-msgs"), inp=root.querySelector("#ai-in");
  const push = () => { box.innerHTML = (d.aiChat||[]).map(m=>{
    let out = `<div class="bub ${m.role==="user"?"user":"ai"}">${m.html||esc(m.text)}</div>`;
    if(m.role==="ai"&&m.result) out += aiRecCard(m.result);
    return out; }).join("") || box.innerHTML;
    box.scrollTop = box.scrollHeight; wire(); };
  const wire = () => {
    root.querySelectorAll("[data-aims]").forEach(b=>b.onclick=()=>{
      const t = tourById(b.dataset.aims);
      const tour = Store.newTourFromDraft({ title:t.name, place:t.start.name, region:t.region, lengthKm:t.km, ascent:t.up,
        durationH:t.h, difficulty:t.diff, tags:t.tags.slice(), img:t.img, desc:t.desc, coords:{...t.start}, date:b.dataset.aidate });
      toast("Munkaterület létrehozva az AI-tervből — nézd meg a csomaglistát! 🎒","🤖"); NAV.to("#/tura/"+tour.id); });
  };
  const send = () => {
    const text = inp.value.trim(); if(!text) return;
    inp.value="";
    if(!d.aiChat) d.aiChat=[];
    d.aiChat.push({role:"user", text});
    const res = Store.aiReply(text); res.date = res.date|| Store.nextSatDate();
    d.aiChat.push({role:"ai", text:"", result:res,
      html:`<i class="typing" id="tp"><i></i><i></i></i>`, _pending:true});
    Store.save(); push();
    setTimeout(()=>{
      const r=res; r.why = r.why||"";
      const last = d.aiChat[d.aiChat.length-1]; last._pending=false;
      last.html = `Ajánlásom: <b>${esc(r.tour.name)}</b> — ${r.why}. ${fmtDate(r.date)}-án (${dowHU(r.date).slice(0,3)})<br>
        <b>Időterv javaslat:</b> ${r.plan.slice(0,5).map(x=>`${x.t} — ${esc(x.l)}`).join(" · ")}.<br>
        <b>Csomag:</b> ${r.gear.slice(0,5).map(g=>g.icon+" "+esc(g.name)).join(", ")}… · <b>Víz:</b> ${r.water}/fő · ${r.food.map(f=>esc(f.n)).join(", ")}.`;
      Store.save(); push();
    }, 950);
  };
  root.querySelector("#ai-send").onclick = send;
  inp.addEventListener("keydown",e=>{ if(e.key==="Enter") send(); });
  root.querySelectorAll("[data-chip]").forEach(b=>b.onclick=()=>{ inp.value=b.dataset.chip; send(); });
  wire();
};

/* ---------- SAJÁT TÉRKÉP ---------- */
VIEWS.mymap = () => dash("#/terkep")(`
  <div class="dash-top"><div><h1>Az én túratérképem 🧭</h1><div class="hello">Zöld: hol jártál már. Kék: hová mész. Piros: hová vágysz még a bakancslistádról.</div></div>
  <div class="legend" style="margin-top:8px"><span><i style="background:#3E8E5F"></i>Teljesített</span><span><i style="background:#2C6E9B"></i>Tervezett</span><span><i style="background:#C94F4F"></i>Bakancslista</span><span><i style="background:#E07A2F"></i>Esemény</span></div></div>
  <div class="card panel" style="padding:10px"><div class="mapbox" id="mymap" style="height:calc(100vh - 300px);min-height:380px"></div></div>`);
VIEWS.mymap.after = root => {
  const d = Store.myData();
  const map = MapKit.make(root.querySelector("#mymap"), {zoom:7});
  if(!map) return;
  const pts=[];
  d.journal.forEach(j=>{ const t=d.tours.find(x=>x.id===j.tourId);
    if(t&&t.coords){ pts.push(t.coords); MapKit.pin(map,t.coords.lat,t.coords.lng,"pin-done",
      `<b>${esc(t.title)}</b><br>✓ ${fmtDateFull(j.date)} · ${j.km} km · ${j.up} m`); } });
  d.tours.filter(t=>(t.status==="tervezés"||t.status==="jelentkezve")&&t.coords).forEach(t=>{ pts.push(t.coords);
    MapKit.pin(map,t.coords.lat,t.coords.lng,"pin-plan",
      `<b><a href="#/tura/${t.id}">${esc(t.title)}</a></b><br>✎ ${t.date?fmtDateFull(t.date):"terv"}`); });
  d.wishlist.filter(w=>w.lat).forEach(w=>{ pts.push(w);
    MapKit.pin(map,w.lat,w.lng,"pin-wish",`❤️ <b>${esc(w.name)}</b><br>${esc(w.cat||"")}`); });
  d.savedEvents.forEach(eid=>{ const e=EVENTS.find(x=>x.id===eid); const b=e&&e.tour?tourById(e.tour):null;
    if(b){ pts.push(b.start); MapKit.pin(map,b.start.lat,b.start.lng,"pin-event",`🎫 <b>${esc(e.name)}</b><br>${fmtDateFull(e.date)}`); }});
  if(pts.length) MapKit.fit(map, pts);
};

/* ---------- ÉRTESÍTÉSEK ---------- */
VIEWS.notifs = () => {
  const list = Store.notifications();
  return dash("#/ertesitesek")(`
    <div class="dash-top"><div><h1>Értesítések 🔔</h1><div class="hello">Csak olyat jelzünk, ami tényleg számít: időjárás, teendők, események, bakancslista.</div></div>
    ${list.length?`<div class="card panel" style="padding:.4rem 0">
      ${list.map(n=>`<div class="nrow"><span class="nic">${n.icon}</span><div style="flex:1">${esc(n.text)}
        ${n.link?`<div><a href="${n.link}" style="color:var(--sky);font-weight:600;font-size:.84rem">Megnyitás →</a></div>`:""}</div>
        <button class="icon-btn" data-nd="${n.id}" aria-label="Elvetés">✕</button></div>`).join("")}
    </div>`:`<div class="empty"><span class="em-ico">🍃</span><h3>Nincs semmi figyelmet való</h3><p>A rendszer szól, ha eső közeledik, felszerelések hiányoznak, vagy esemény van a bakancslistád közel.</p></div>`}`);
};
VIEWS.notifs.after = root => root.querySelectorAll("[data-nd]").forEach(b=>b.onclick=()=>{ Store.dismissNotif(b.dataset.nd); render(); });

/* ---------- BEÁLLÍTÁSOK + PROFIL ---------- */
VIEWS.settings = () => {
  const u=Store.me(), p=u.prefsOnb||{};
  return dash("#/beallitasok")(`
    <div class="dash-top"><div><h1>Beállítások ⚙️</h1></div></div>
    <div class="split2" style="grid-template-columns:1fr">
    <div class="card panel">
      <h3>👤 Személyes adatok</h3>
      <div class="profile-head" style="margin-bottom:1.1rem">
        <div class="avatar lg">${initials(u.name)}</div>
        <div><b style="font-size:1.15rem;font-family:var(--font-display)">${esc(u.name)}</b>
        <div class="muted small">${esc(u.email)} · ${esc(u.city||"—")} · tag ${(u.joined||"").slice(0,4)} óta</div></div></div>
      <div class="grid g2">
        <div><label class="f">Név</label><input class="input" id="st-n" value="${esc(u.name)}"></div>
        <div><label class="f">Kiinduló helység</label><input class="input" id="st-c" value="${esc(u.city||"")}" placeholder="Pl. Gyergyószentmárton"></div>
      </div>
      <button class="btn btn-primary btn-sm" id="st-save" style="margin-top:1rem">✓ Adatok mentése</button>
    </div>
    <div class="card panel">
      <h3>🧭 Túrázási preferenciák (onboarding)</h3>
      <p class="small muted mt0">Ezek alapján ajánlunk túrákat és eseményeket. Bármikor finomhangolhatod — töltsd ki újra a 5 kérdést.</p>
      <button class="btn btn-soft btn-sm" id="st-ob">🔁 Onboarding újra</button>
      <div class="meta" style="margin-top:.9rem"><span>Gyakoriság: <b>${esc(p.freq||"—")}</b></span>
      <span>Túratípusok: <b>${(p.types||["—"]).join(", ")}</b></span>
      <span>Nehézség: <b>${esc(p.diff||"—")}</b></span><span>Indulás: <b>${esc(p.from||u.city||"—")}</b></span><span>Utazás: <b>${esc(p.radius||"—")}</b>
      </div></div>
    <div class="card panel">
      <h3>🎯 Éves célok</h3>
      <div class="grid g2"><div><label class="f">km cél (${new Date().getFullYear()})</label><input class="input" type="number" id="st-gkm" value="${Store.myData().goals.km}"></div></div>
    </div>
    <div class="card panel">
      <h3>🖥 Megjelenés és adattárolás</h3>
      <div class="flex between" style="padding:.4rem 0"><div>Időjárás-ellenőrzés a kezdőoldalon <div class="small muted">A következő túrád helyszínére 14 napos előrejelzéssel.</div></div>
        <label class="toggle"><input type="checkbox" ${ (u.prefs&&u.prefs.weather!==false) ? "checked":"" }><i></i></label></div>
      <div class="flex between" style="padding:.4rem 0;border-top:1px solid var(--line)">
        <div><small>Minden adat csak a saját böngésződben (localStorage) tárolódik — ezért az app offline is működik.</small></div>
      </div>
    </div>
    <div class="card panel">
      <h3>🔐 Jelszó és fiók</h3>
      <div class="pw-row"><input class="input" id="st-old" type="password" placeholder="Jelenlegi jelszó" autocomplete="current-password"><button type="button" class="pw-eye" data-t="st-old" aria-label="Mutat">👁</button></div>
      <div style="height:.5rem"></div>
      <div class="pw-row"><input class="input" id="st-new" type="password" placeholder="Új jelszó (min. 8, betű + szám)" autocomplete="new-password"><button type="button" class="pw-eye" data-t="st-new" aria-label="Mutat">👁</button></div>
      <div style="height:.5rem"></div>
      <div class="pw-row"><input class="input" id="st-new2" type="password" placeholder="Új jelszó újra" autocomplete="new-password"><button type="button" class="pw-eye" data-t="st-new2" aria-label="Mutat">👁</button></div>
      <p class="field-err hidden" id="st-pw-err" role="alert"></p>
      <button class="btn btn-primary btn-sm" id="st-pass" style="margin-top:.7rem">Jelszó módosítása</button>
    </div>
    <div class="card panel" style="border-color:#f2d3b3" id="theme-card">
      <h3>🌗 Megjelenés</h3>
      <div class="filter-row" id="theme-seg">
        <button class="f-pill" data-th="light">☀️ Világos</button><button class="f-pill" data-th="dark">🌙 Sötét</button><button class="f-pill" data-th="auto">🌗 Rendszer</button></div>
      <div style="border-top:1px solid var(--line);margin-top:1rem"></div>
      <h3><span class="warn-ic">⚠️</span> Veszélyes zóna</h3>
      <div class="flex wrapcol" style="gap:.6rem">
        <button class="btn btn-danger btn-sm" id="st-reset">🧹 Saját adataim törlése</button>
        <button class="btn btn-ghost btn-sm" id="st-logout">🚪 Kijelentkezés</button></div>
    </div></div>`);
};
VIEWS.settings.after = root => {
  root.querySelectorAll(".pw-eye").forEach(b => b.onclick = () => { const t=root.querySelector("#"+b.dataset.t); t.type = t.type==="password"?"text":"password"; b.textContent = t.type==="password"?"👁":"🙈"; });
  root.querySelector("#st-pass").onclick = () => { const err=root.querySelector("#st-pw-err"); err.classList.add("hidden");
    const gv=i=>root.querySelector("#"+i).value;
    if(gv("st-new")!==gv("st-new2")){ err.textContent="Az új jelszó megerősítése nem egyezik."; err.classList.remove("hidden"); return; }
    const r=Store.changePassword(gv("st-old"), gv("st-new"));
    if(r.err){ err.textContent=r.err; err.classList.remove("hidden"); return; }
    ["st-old","st-new","st-new2"].forEach(i=>root.querySelector("#"+i).value="");
    toast("A jelszó módosulhat ✔","🔐"); };
  root.querySelector("#st-save").onclick=()=>{ Store.updateProfile({name:root.querySelector("#st-n").value.trim()||Store.me().name, city:root.querySelector("#st-c").value.trim()}); var cloudSave=window.__V54&&window.__V54.api&&window.__V54.api.saveProfileFromLocal; if(cloudSave) Promise.resolve(cloudSave()).then(()=>toast("Adatok mentve a fiókba","✅")).catch(()=>toast("Adatok helyben mentve; a felhőmentés nem sikerült","⚠️")).then(()=>render()); else { toast("Adatok mentve","✅"); render(); } };
  root.querySelector("#st-gkm").addEventListener("change",e=>{ Store.myData().goals.km=Math.max(10,+e.target.value||300); Store.save(); });
  root.querySelectorAll("[data-th]").forEach(b=>{const cur=(Store.getTheme&&Store.getTheme())||"light"; b.classList.toggle("on", b.dataset.th===cur);
      b.onclick=()=>{ Store.setTheme(b.dataset.th); location.reload(); };});
    root.querySelector("#st-ob").onclick=()=>{ OB_STEPS && (obStep=0, obAnswer={}); Store.updateProfile({onboarded:false}); NAV.to("#/onboarding"); };
  root.querySelector("#st-reset").onclick=()=>{ confirmDlg("Az összes túrád, naplód, listád törlődik. Ez nem visszavonható.","Törölj mindent",()=>{
    const id=Store.me().id; const db=JSON.parse(localStorage.getItem("turavaros_v1")); delete db.data[id];
    db.data[id]={tours:[],wishlist:[],savedEvents:[],equipment:[],journal:[],teams:[],goals:{km:300,tours:12,summits:3},notifDismiss:[],aiChat:[]};
    localStorage.setItem("turavaros_v1",JSON.stringify(db)); toast("Adatok törölve","🧹"); render(); }); };
  root.querySelector("#st-logout").onclick=()=>{ Store.logout(); toast("Kijelentkeztél — várunk a terepen!","👋"); NAV.to("#/"); };
};

/* ---------- MOBIL PROFIL (a bottom-nav „ Profil” pontja) ---------- */
VIEWS.profile = () => {
  const u=Store.me(), s=Store.stats();
  return dash("#/")(`
    <div class="card panel" style="text-align:center;margin-bottom:16px">
      <div class="avatar lg" style="margin:0 auto .7rem">${initials(u.name)}</div>
      <h1 style="font-size:1.5rem;margin:0">${esc(u.name)}</h1>
      <div class="muted small">${esc(u.city||"")} · ${s.tours} túra · ${Math.round(s.km)} km</div></div>
    <div class="grid g2 smm2">
      ${[["#/felszereles","🎒 Felszerelésem"],["#/bakancslista","❤️ Bakancslistám"],["#/naplo","📖 Túranaplóm"],["#/statisztikak","📊 Statisztikák"],["#/csapatok","👥 Túracsapatok"],["#/beallitasok","⚙️ Beállítások"],["#/ertesitesek","🔔 Értesítések ("+Store.notifications().length+")"],["#/turaim","🥾 Túráim"]].map(([h,l])=>
        `<a class="quickact" href="${h}" style="align-items:center;text-align:center"><b>${l}</b></a>`).join("")}
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:14px" id="pf-out">🚪 Kijelentkezés</button>`);
};
VIEWS.profile.after = root => { root.querySelector("#pf-out").onclick=()=>{ Store.logout(); NAV.to("#/"); }; };

/* ——— Fiók: adatmentés, visszaállítás, törlés a Beállításokon túl ——— */
(function(){
  const _origSa = VIEWS.settings.after;
  VIEWS.settings.after = (root, arg) => { if(_origSa) _origSa(root, arg);
    const host = root.querySelector("#view .dash-main") || root;
    const card = document.createElement("div"); card.className="card panel account-card";
    card.innerHTML = `<h3>👤 Fiókom — Túratárs-adatmentés</h3>
      <p class="small muted mt0">Minden adata (túrák, naptár, csomag, élmények, bakancslista) a böngésződ localStorage-ában él — ezt a gombbal viheted magaddal, és más böngészőben vissza is töltheted.</p>
      <div class="flex wrapcol" style="gap:.5rem">
        <button class="btn btn-primary btn-sm" id="acc-export">📦 Adatmentés letöltése (JSON)</button>
        <label class="btn btn-soft btn-sm" style="cursor:pointer">📥 Visszaállítás mentésből<input type="file" id="acc-import" accept=".json,application/json" hidden></label>
        <a class="btn btn-ghost btn-sm" href="#/profil">🧑 Fiókom – fiók</a></div>`;
    host.appendChild(card);
    card.querySelector("#acc-export").onclick=()=>{
      const blob=new Blob([Store.exportData()],{type:"application/json"});
      const a=document.createElement("a"); a.href=URL.createObjectURL(blob);
      a.download="turatears-adatmentes-"+Store.todayISO()+".json"; a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),2000); toast("Adatmentés letöltve — őrizz jól!","📦");
    };
    card.querySelector("#acc-import").onchange=(e)=>{ const f=e.target.files[0]; if(!f) return;
      const rd=new FileReader(); rd.onload=()=>{ const r=Store.importData(String(rd.result));
        if(r.err){ toast(r.err,"⚠️"); return; } toast("Adat visszaállítva","📥"); location.reload(); }; rd.readAsText(f); };
  };
})();
