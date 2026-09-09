/* ============ V45 — 🥾 TÚRA MÓD: mobil-first, olvasó nézet, a meglévő modulokra épít ============ */
(function(){
"use strict";
function hhmmNow(){ const d=new Date(); return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }
function tv(x){ return x?esc(x):'<span class="muted">nincs megadva</span>'; }

const _v45OldFn = VIEWS.tourmode;
const _v45OldAfter = _v45OldFn && _v45OldFn.after;
VIEWS.tourmode = function(id){
  const t = Store.getTour(id);
  if(!t) return '<div class="tmode tm2"><div class="tm2-head"><h1>A túra nem található</h1><a class="btn btn-primary" href="#/turaim">← Túráim</a></div></div>';
  if(!t.noteStream) t.noteStream=[]; if(!t.tasks) t.tasks=[];
  const dd = t.date?Store.dayDiff(t.date):null;
  const r = (typeof Store.readiness==="function")?Store.readiness(t):{pct:0,missing:[]};
  const un = (t.participants||[]).filter(function(p){return p.confirmed||p.stat==="jön";}).length;
  const packDone=(t.gear||[]).filter(function(g){return g.checked;}).length, packN=(t.gear||[]).length;
  const waterL=(t.food||[]).filter(function(f){return /víz|iv[óo]/i.test(f.n||"");}).reduce(function(a,f){return a+(+f.w||0);},0)/1000;
  const foodN=(t.food||[]).filter(function(f){return !/víz|iv[óo]/i.test(f.n||"");}).length;
  const tl=(t.timeline||[]).slice().sort(function(a,b){return String(a.t).localeCompare(String(b.t));});
  const now=hhmmNow(); const isToday=dd===0;
  const nextEv=(isToday&&tl.length)?tl.find(function(x){return String(x.t)>=now;}):(tl.length?tl[0]:null);
  const fr=(typeof Store.fieldReports==="function")?Store.fieldReports():[];
  const fresh=fr.filter(function(x){
      const s=(x.loc||x.place||"").toLowerCase();
      return s && t.place && (s.indexOf(String(t.place).slice(0,6).toLowerCase())>=0 || String(t.place).toLowerCase().indexOf(s.slice(0,6))>=0);
    }).filter(function(x){ const ts=(x.date||x.ts||"").slice(0,10); return !ts || Store.dayDiff(ts)>=-14; }).slice(0,2);
  const photos=(t.photos||[]);
  function big(ic,label,sub,key){ return '<button class="tm2-big" data-tm2="'+key+'"><span class="tm2-ic">'+ic+'</span><span class="tm2-l">'+label+'</span><span class="tm2-s">'+sub+'</span></button>'; }
  return '<div class="tmode tm2">'+
    '<div class="tm2-top"><a href="#/tura/'+t.id+'">← Munkaterület</a><span class="tm2-rdy">🎒 '+r.pct+'%</span></div>'+
    '<div class="tm2-head"><h1>🥾 '+esc(t.title||"Túra")+'</h1>'+
      '<div class="tm2-meta"><span>📍 '+tv(t.place||t.region)+'</span><span>📅 '+tv(t.date?esc(t.date):null)+'</span>'+
      '<span>📏 '+(t.lengthKm? t.lengthKm+" km":'<span class="muted">nincs megadva</span>')+'</span>'+
      '<span>⛰️ '+(t.ascent? t.ascent+" m":'<span class="muted">nincs megadva</span>')+'</span></div>'+
      (isToday?'<div class="tm2-today">🥾 MA TÚRÁZOL</div>':(dd!==null&&dd>0?'<div class="tm2-soon">A túra '+dd+' nap múlva lesz — a mód így is megnyitható.</div>':(dd!==null?'<div class="tm2-past">A dátum a múltban van — az adatok így is elérhetők.</div>':'')))+
    '</div>'+
    (nextEv
      ? '<div class="tm2-next"><small>🕐 KÖVETKEZŐ</small><b>'+esc(nextEv.t)+'</b><span>'+esc(nextEv.l)+'</span></div>'
      : (tl.length
        ? '<div class="tm2-note-line" data-tm2="idoter">🕐 Az idővonal első pontja ('+esc(tl[0].t)+') már lezárult — nyisd meg</div>'
        : '<div class="tm2-next warn"><span>🕐 Még nincs idővonal.</span><button class="tm2-minib" data-tm2="idoter">Idővonal megnyitása</button></div>'))+
    '<div class="tm2-grid">'+
      big("🗺️","Útvonal", (t.gpx||t.coords)?"GPX / pontok készek":"nincs útvonal","utvonal")+
      big("🕐","Idővonal", tl.length?(tl.length+" pont"):("üres"),"idoter")+
      big("🎒","Felszerelés", packN?(packDone+"/"+packN+" bepakolva"):"üres lista","felszereles")+
      big("💧","Étel / víz", waterL.toFixed(1)+" l · "+foodN+" étel","ete")+
      big("👥","Társak", (t.participants.length? un+"/"+t.participants.length+" visszaigazolva":"nincs társ"),"resztvevok")+
      big("📸","Fotó", photos.length? photos.length+" a túrához":"nincs fotó","PHOTO")+
      big("📝","Gyors jegyzet", (t.noteStream.length? t.noteStream.length+" mentve":"ide írhatsz"),"NOTE")+
      big("🛡️","Biztonság","tényadat-os panel","SAFE")+
    '</div>'+
    (packN && packDone<packN? '<button class="tm2-strip" data-tm2="felszereles">⚠️ '+(packN-packDone)+' tétel nincs bepakolva — Megnyitom</button>':'')+
    (t.participants.length&&un<t.participants.length? '<button class="tm2-strip" data-tm2="resztvevok">👤 '+(t.participants.length-un)+' résztvevő nem erősített meg — Megnyitom</button>':'')+
    (fresh.length? '<div class="tm2-terep"><b>⚠️ '+fresh.length+' friss terepi jelentés</b><span>„'+esc(String(fresh[0].text||"").slice(0,90))+'”</span><a href="#/terepi">Megnézem</a></div>':'')+
    '<div class="card panel tm-quick" id="tm-quick"><h3>📝 Gyors jegyzet a pályáról</h3>'+
      '<div class="flex" style="gap:.45rem;flex-wrap:wrap"><input class="input" id="tm-note" placeholder="Pl. forrás a 2 km-nél, jelzés festve…" style="flex:1;min-width:140px"><button class="btn btn-primary" id="tm-note-add">＋</button>'+
      '<button class="btn btn-soft" id="tm-photo">📸 Fotó</button><input type="file" id="tm-pf" accept="image/*" class="hidden"></div>'+
      (t.noteStream||[]).slice().reverse().slice(0,5).map(function(n){return '<div class="tm-note"><b>'+esc(n.ts)+'</b> '+esc(n.text)+'</div>';}).join("")+
      (photos.length? '<div class="tm-photos">'+photos.slice(-6).map(function(q){return '<img src="'+q+'" alt="túra fotó">';}).join("")+'</div>':'')+
      '<p class="small muted mb0" style="margin:.5rem 0 0">A jegyzet és fotó a túraprojekthez kapcsolódik — az Élménykönyvben felhasználhatod.</p>'+
    '</div>'+
    (r.pct<100? '<button class="tm2-strip amber" id="tm2-rvw">⚠️ A túrád még nincs teljesen előkészítve — 🔍 Nézd át</button>'
              : '<div class="tm2-strip green">🟢 A túrád készen áll.</div>')+
    (t.status==="teljesítve"||t.status==="archiválva"
      ? '<div class="tm2-done"><b>🎉 Túra teljesítve!</b><span>Az élmény bármikor rögzíthető.</span><div class="flex" style="gap:.5rem;flex-wrap:wrap"><button class="btn btn-primary" id="tm2-mem">📖 Élmény hozzáadása</button><a class="btn btn-soft" href="#/tura/'+t.id+'">← Vissza a túrához</a></div></div>'
      : '<button class="tm2-complete" id="tm2-fin">✓ TÚRA TELJESÍTVE</button>')+
    '<div class="tm2-foot"><span>Offline működik — a külső adatok nélkül is fut.</span></div>'+
  '</div>';
};

function tm2Safety(t){
  const L=Store.me()||{};
  const rows=[["Helyszín",t.place||t.region||null],["Útvonal",(t.gpx||t.coords)?"rögzítve (GPX/pontok)":"Nincs megadva"],
    ["Résztvevők",(t.participants||[]).length? t.participants.map(function(p){return p.name+(p.confirmed||p.stat==="jön"?" ✓":"");}).join(", "):null],
    ["Tervezett érkezés",(t.timeline&&t.timeline.length)?(t.timeline[t.timeline.length-1].t+" — "+t.timeline[t.timeline.length-1].l):null],
    ["Találkozási pont",t.meeting||t.startPoint||null],["Kapcsolattartó",L.email||null]];
  openModal({ title:"🛡️ Biztonsági infó — "+esc(t.title||""),
    body:'<p class="small mt0 mb0">'+rows.map(function(x){return '<b>'+x[0]+':</b> '+(x[1]?esc(String(x[1])):'<span class="muted">Nincs megadott adat.</span>');}).join("<br>")+'</p>'+
      '<div class="alert-strip"><span>ℹ️</span><div>Ez a funkció nem helyettesít segélyhívást vagy hivatalos vészjelző rendszert. 112 / 116 — vészhelyzetben a hivatalos segélyhívó.</div></div>',
    footer:'<button class="btn btn-primary btn-block" data-close>Értelmezve</button>'});
}

const _v45PrevAfter = _v45OldAfter;
VIEWS.tourmode.after = function(root,id){
  try{ _v45PrevAfter && _v45PrevAfter(root,id); }catch(e){}
  const m=(location.hash||"").match(/turamod\/([\w-]+)/);
  const t=Store.getTour(id || m && m[1]);
  if(!t||!root) return;
  if(!t.noteStream) t.noteStream=[]; if(!t.tasks) t.tasks=[];
  root.querySelectorAll('[data-tm2]').forEach(function(b){
    b.onclick=function(){ const k=b.getAttribute('data-tm2');
      if(k==='utvonal'||k==='idoter'||k==='felszereles'||k==='ete'||k==='resztvevok'){ wsTab=k; NAV.to('#/tura/'+t.id); }
      else if(k==='PHOTO'){ const pf=document.getElementById('tm-pf'); if(pf){ pf.click(); } }
      else if(k==='NOTE'){ const i=document.getElementById('tm-note'); if(i){ i.focus(); i.scrollIntoView({block:'center',behavior:'smooth'}); } }
      else if(k==='SAFE'){ tm2Safety(t); } };
  });
  const rv=document.getElementById('tm2-rvw');
  if(rv) rv.onclick=function(){ try{ window.tourReview(t); }catch(e){ toast("Az Ellenőrző most nem elérhető","🔍"); } };
  const fin=document.getElementById('tm2-fin');
  if(fin) fin.onclick=function(){
    if(t.status==="teljesítve"||t.status==="archiválva"){ toast("A túra már teljesítve — a statisztika nem duplikál","🎉"); return; }
    openModal({ title:"✓ Túra teljesítve?",
      body:'<p class="muted mt0">A(z) <b>'+esc(t.title)+'</b> teljesítésre kerül, és az V42 élmény-folyam indul.</p>',
      footer:'<button class="btn btn-ghost" data-close>Mégsem</button> <button class="btn btn-primary" id="tm2-yes">✓ Teljesítettem</button>',
      onOpen(mm){ mm.querySelector("#tm2-yes").onclick=function(){
        Store.completeTour(t.id,{rating:5,note:""});
        closeModal();
        if(window.congratsToursModal){ render(); congratsToursModal(Store.getTour(t.id)); }
        else { toast("Teljesítve","🎉"); render(); } }; } });
  };
  // ---- V45 saját fotó+jegyzet drótozás (nem a régi wrapperre támaszkodva) ----
  const nIn=document.getElementById('tm-note'), nAdd=document.getElementById('tm-note-add');
  if(nAdd && nAdd.getAttribute('data-v45b')!=='1'){ nAdd.setAttribute('data-v45b','1');
    nAdd.onclick=function(){ const v=(nIn.value||"").trim(); if(!v){ toast("írj Something","✍️"); return; }
      const tt=Store.getTour(t.id); const ts=new Date().toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'});
      (tt.noteStream=tt.noteStream||[]).push({ts,text:v}); tt.notes=(tt.notes?tt.notes+" | ":"")+v;
      Store.save(); if(window.render) render(); else if(window.App&&App.render) App.render({}); toast("Gyors jegyzet a túrához mentve ✔","📝"); };
    if(nIn) nIn.onkeydown=function(e){ if(e.key==="Enter") nAdd.click(); };
  }
  const pf=document.getElementById('tm-pf'), pB=document.getElementById('tm-photo');
  if(pB && pB.getAttribute('data-v45b')!=='1'){ pB.setAttribute('data-v45b','1'); pB.onclick=function(){ pf.click(); }; }
  if(pf && pf.getAttribute('data-v45b')!=='1'){ pf.setAttribute('data-v45b','1');
    pf.onchange=function(){ const f=pf.files&&pf.files[0]; if(!f) return;
      const rd=new FileReader(); rd.onload=function(){ const im=new Image(); im.onload=function(){
        try{ const c=document.createElement('canvas'); const sc=Math.min(1,900/im.width);
          c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext('2d').drawImage(im,0,0,c.width,c.height);
          const url=c.toDataURL('image/jpeg',0.62); const tt=Store.getTour(t.id);
          if(!tt.photos) tt.photos=[]; tt.photos.push(url); (tt.noteStream=tt.noteStream||[]).push({ts:new Date().toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'}),text:"📸 fotó csatolva"});
          Store.save(); if(window.render) render(); else if(window.App&&App.render) App.render({}); toast("Fotó a túrához mentve (tömörítve, a képsor végén)","📸"); }catch(err){ toast("A fotó feldolgozása nem sikerült","🖼️"); } };
        im.onerror=function(){ toast("A fotó nem olvasható","🖼️"); }; im.src=rd.result; }; rd.readAsDataURL(f); }; }
    const mem=document.getElementById('tm2-mem');
  if(mem) mem.onclick=function(){ if(window.openMemoryEditor){ window.openMemoryEditor(Store.getTour(t.id)); } else toast("Az memoria szerkesztőért menj a teljesitett túráid fülre","📖"); };
};
window.__V45MODULE=1;
})();
