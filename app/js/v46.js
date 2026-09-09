/* ========= V46 — 📥 INBOX 2.0 : minden túraötlet egy helyen =========
   Típusok: link / esemény / kép / jegyzet / túraötlet / hely.
   Helyi AI-felismerés beillesztett szövegből (kitalált adat NINCS).
   Egy lépés: ⭐ Bakancslista · 🗓️ Túraterv — duplikáció-védelem, forrás megmarad. */
(function(){
"use strict";
var IB_T={link:["🔗","Link"],event:["📅","Esemény"],photo:["📸","Kép"],note:["📝","Jegyzet"],tour:["🥾","Túraötlet"],place:["📍","Hely"]};
var ibQ="", ibCat="", ibSort="uj";
function X(s){ return esc(s==null?"":String(s)); }
function ibHost(u){ return String(u||"").replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0].slice(0,26); }
function ibGuessType(u){ u=String(u||"").toLowerCase();
  if(/facebook\.com|fb\.com|fb\.me|events|event\?/.test(u)) return "event";
  if(/maps\.google|goo\.gl\/maps|osm\.org|\d{2,3}\.\d{3,}[, ]+\d{2,3}\.\d{3,}|@-?\d/.test(u)) return "place";
  if(/wikiloc|komoot|termeszetjaro|termeszetjaro|turistak|\.gpx|tasz\.hu/.test(u)) return "tour";
  return "link"; }
function ibNorm(x){ if(!x.id) x.id=Store.uid("ib");
  if(!x.created_at) x.created_at=x.at||new Date().toISOString();
  if(x.source_url===undefined) x.source_url=x.url||null;
  if(x.host===undefined) x.host=x.url?ibHost(x.url):null;
  if(x.image===undefined) x.image=x.img||null;
  if(x.location===undefined) x.location=x.place||null;
  if(!x.status) x.status=x.linkedTourId?"trip":(x.linkedWishId?"wish":(x.read?"read":"new"));
  return x; }
function ibAll(){ var d=Store.myData(); if(!d.inbox) d.inbox=[]; d.inbox.forEach(ibNorm); return d.inbox; }
function ibGet(id){ return ibAll().find(function(x){return x.id===id;}); }
function ibSave(it){ var d=Store.myData(); if(!d.inbox) d.inbox=[];
  it.updated_at=new Date().toISOString();
  var i=d.inbox.findIndex(function(y){return y.id===it.id;});
  if(i>-1) d.inbox[i]=Object.assign(d.inbox[i],it); else d.inbox.unshift(it);
  Store.save(); }
function ibStatus(it){ return it.linkedTourId?"trip":(it.linkedWishId?"wish":(it.read?"read":"new")); }
function ibDedup(url,title){ var n=String(title||"").trim().toLowerCase();
  return ibAll().find(function(x){ return (url && x.source_url===url) || (n && String(x.title||"").trim().toLowerCase()===n); }); }

/* ---------- Helyi AI: szöveg → mezők. Amit nem lát, azt ÜRESEN hagyja. ---------- */
function ibParse(str){ str=String(str||""); var F={};
  var mo={jan:1,feb:2,mar:3,apr:4,maj:5,jun:6,jul:7,aug:8,sze:9,sep:9,okt:10,nov:11,dec:12};
  var d1=str.match(/\b(20\d{2})[.\/\- ](\d{1,2})[.\/\- ](\d{1,2})\b/);
  if(d1) F.date=d1[1]+"-"+("0"+(+d1[2])).slice(-2)+"-"+("0"+(+d1[3])).slice(-2);
  else { var d2=str.match(/\b(20\d{2})\.?\s*(jan\w*|feb\w*|m[aá]rc\w*|mar\w*|apr\w*|m[aá]j\w*|jun\w*|j[uú]l\w*|aug\w*|szep\w*|okt\w*|nov\w*|dec\w*)\.?,?\s*(\d{1,2})/i);
    if(d2){ var k0=d2[2].toLowerCase().slice(0,3).normalize("NFD").replace(/[^a-z]/g,""); if(mo[k0]) F.date=d2[1]+"-"+("0"+mo[k0]).slice(-2)+"-"+("0"+(+d2[3])).slice(-2); } }
  var tm=str.match(/\b([01]?\d|2[0-3]):(\d{2})\b/); if(tm) F.time=("0"+(+tm[1])).slice(-2)+":"+tm[2];
  var lo=str.match(/(?:helysz[íi]n|hely|tal[áa]lkoz[áa]s|location|where)[\s:=-]+([^\n,;·|]{3,60})/i); if(lo) F.location=lo[1].trim();
  var org=str.match(/(?:szervez[\u00f6\u0151o][\u00e9e]k|szervez[\u00f6\u0151o]?|organizer)[\s:=-]+([^\n,;\u00b7|]{2,50})/i); if(org) F.organizer=org[1].trim();
  var di=str.match(/(\d+(?:[.,]\d+)?)\s*km\b/i); if(di) F.distance_km=di[1].replace(",",".");
  var el=str.match(/szint[\w]*\s*[:=-]?\s*(\d{2,4})\s*m\b/i); if(el) F.elevation_gain=el[1];
  var du=str.match(/(\d+(?:[.,]\d+)?)\s*(?:[óo]r[áa]*|hours?|[h])\b/i); if(du) F.duration=du[1].replace(",",".");
  var df=str.match(/\b(k[öo]nny[úu]|easy|k[öo]zepes|medium|neh[ée]z|hard)\b/i);
  if(df){ var q=df[1].toLowerCase(); F.difficulty=/k[öo]nny|easy/.test(q)?"Könnyű":/k[öo]zep|medium/.test(q)?"Közepes":"Nehéz"; }
  var first=(str.split(/\n/).filter(function(x){return x.trim();})[0]||"").trim();
  if(first && !/^https?:\/\//.test(first)){ var seg=first.length>90 ? first.split(/\s[—–]\s|\s-\s/)[0].trim() : first; if(seg&&seg.length<=90) F.title=seg.replace(/^(esem[ée]ny|t[úu]ra|hely|in memoriam|eml[ée]k)['\s:=-]*/i,"").trim(); }
  var des=str.match(/(?:le[íi]r[áa]s|program|description|inf[óo])[\s:=-]+([\s\S]{6,220})/i); if(des) F.description=des[1].trim();
  return F; }
var IB_DETECT=["title","date","time","location","organizer","distance_km","elevation_gain","duration","difficulty"];

/* ---------------- Composer ---------------- */
function ibFields(type){ var M={
  link:[["title","Cím (ha van)"],["date","Dátum","date"],["time","Időpont","time"],["location","Helyszín"],["organizer","Szervező"],["distance_km","Táv (km, op.)","num"],["elevation_gain","Szint (m, op.)","num"],["duration","Időtartam (óra, op.)","num"],["difficulty","Nehézség","dif"],["note","Mi ez, miért jó?"]],
  event:[["title","Esemény neve *"],["date","Dátum","date"],["time","Idő","time"],["location","Helyszín"],["organizer","Szervező"],["description","Leírás / program"]],
  photo:[["title","Ami a képen van (cím)"],["date","Dátum (ha látszik)","date"],["time","Idő (ha látszik)","time"],["location","Hely (ha látszik)"],["organizer","Szervező (ha van)"],["description","A képről beillesztett/másolt szöveg"]],
  note:[["title","Cím (opcionális)"],["note","Jegyzet *"]],
  tour:[["title","Túra neve *"],["location","Helyszín / régió *"],["date","Dátum (opcionális)","date"],["distance_km","Táv (km, op.)","num"],["elevation_gain","Szint (m, op.)","num"],["duration","Időtartam (óra, op.)","num"],["difficulty","Nehézség","dif"],["description","Mit tudunk róla?"]],
  place:[["title","Hely neve *"],["location","Régió / pontos hely"],["description","Mit érdemes tudni"],["note","Miért akarom megnézni?"]] };
  return M[type]||M.note; }
function ibFieldHTML(st){ var h="";
  ibFields(st.type).forEach(function(F){ var k=F[0],lb=F[1],kd=F[2],v=st[k]==null?"":String(st[k]);
    h+='<div class="ib26-fld"><label class="f">'+lb+"</label>";
    if(kd==="dif") h+='<select class="input" id="ib26f_'+k+'"><option value="">—</option>'+["Könnyű","Közepes","Nehéz"].map(function(x){return "<option"+(v===x?" selected":"")+">"+x+"</option>";}).join("")+"</select>";
    else if(kd==="num") h+='<input class="input" id="ib26f_'+k+'" type="number" min="0" step="0.1" value="'+X(v)+'">';
    else if(kd==="date"||kd==="time") h+='<input class="input" id="ib26f_'+k+'" type="'+kd+'" value="'+X(v)+'">';
    else if(k==="note"||k==="description") h+='<textarea class="input" id="ib26f_'+k+'" rows="2">'+X(v)+"</textarea>";
    else h+='<input class="input" id="ib26f_'+k+'" value="'+X(v)+'">';
    h+="</div>"; });
  return h; }
function ibCollect(m,st){ m.querySelectorAll("[id^='ib26f_']").forEach(function(el){ var k=el.id.slice(6),v=(el.value||"").trim();
  if(v) st[k]=v; else delete st[k]; }); }
function ibComposer(type, existing){
  var st = existing ? Object.assign({},existing) : {type:type||"link"};
  st.type = st.type||"link";
  var found=null;
  function frame(){
    var tbar='<div class="ib26-types">'+Object.keys(IB_T).map(function(k){
      return '<button class="ib26-type'+(st.type===k?" on":"")+'" data-bt="'+k+'">'+IB_T[k][0]+" "+IB_T[k][1]+"</button>"; }).join("")+"</div>";
    var urlLine='<div class="ib26-fld"><label class="f">🔗 Forrás link (opcionális)</label><input class="input" id="ib26f_url" value="'+X(st.url||"")+'" placeholder="https://m.facebook.com/events/…"></div>';
    var raw=(st.type==="link"||st.type==="event"||st.type==="photo")
      ?'<div><label class="f">🤖 Ebből ismerjem fel az adatokat (illeszd be a szöveget)</label><textarea class="input" id="ib26-raw" rows="3" placeholder="Esemény: Hargita őszi túra — 2026.10.10. 09:00, helyszín: Gyergyó, szervező: CsEKE, táv: 14 km, szint: 780 m">'+X(st._raw||"")+"</textarea></div>":"";
    var ai=(st.type==="link"||st.type==="event"||st.type==="photo")
      ?'<div class="ib26-airow"><button class="btn btn-soft btn-sm" id="ib26-det">🔍 Feldolgozom</button>'
       +(st.type==="photo"?'<label class="btn btn-ghost btn-sm"><span>📸 Fájl</span><input type="file" accept="image/*" id="ib26-ph"></label>':"")+"</div>":"";
    var ffound=found? '<div class="ib26-found"><b>🤖 Ezt találtam:</b> '+found.map(function(k){var lbl={date:"📅",time:"🕐",location:"📍",organizer:"👤",distance_km:"📏",elevation_gain:"⛰️",duration:"⏱",difficulty:"★",title:"🥾"}[k];return lbl+" "+X(st[k]);}).join(" &middot; ")
       +'<br><span class="small muted">Minden felismert mező szerkeszthető — [✓] a mentés gomb.</span></div>':"";
    var img=st.image?'<div class="ib26-imgbox"><img src="'+X(st.image)+'"><button class="btn btn-ghost btn-sm" id="ib26-im">✕</button></div>':"";
    var saveBtn='<button class="btn btn-primary btn-block btn-lg" id="ib26-save" style="margin-top:.8rem">'+(found?"✓ Így mentem":"💾 Mentés az Inboxba")+"</button>";
    var ocr=st.type==="photo"?'<p class="small muted" style="margin-top:.4rem">OCR automatikus felismerés jelenleg nem elérhető — a képet elmentjük, a szöveget kézzel is beírhatod.</p>':"";
    var linked=(st.linkedTourId||st.linkedWishId)?'<p class="small muted" style="margin-top:.4rem">'+(st.linkedTourId?"🗓️ ezzel már van terved · ":"")+(st.linkedWishId?"⭐ már a bakancslistádon":"")+"</p>":"";
    return tbar+urlLine+raw+ai+img+ffound+'<div class="ib26-grid">'+ibFieldHTML(st)+"</div>"+saveBtn+ocr+linked; }
  openModal({ title:"📥 Új mentés az Inboxba", body:'<div id="ib26-wrap">'+frame()+"</div>", footer:"",
    onOpen:function(m){
      function repaint(){ var r=m.querySelector("#ib26-wrap"); if(r) r.innerHTML=frame(); wire(m); }
      function wire(mm){
        mm.querySelectorAll("[data-bt]").forEach(function(b){ b.onclick=function(){ ibCollect(mm,st); var r=mm.querySelector("#ib26-raw"); if(r) st._raw=r.value; st.type=b.dataset.bt; found=null; repaint(); }; });
        var det=mm.querySelector("#ib26-det"); if(det) det.onclick=function(){ ibCollect(mm,st); var r=mm.querySelector("#ib26-raw"); if(r) st._raw=r.value;
          var P=ibParse((st._raw||"")+" "+(st.url||"")); found=[];
          IB_DETECT.forEach(function(k){ if(P[k]){ st[k]=P[k]; found.push(k); } });
          if(P.description) st.description=P.description;
          if(!found.length) toast("Nem találtam biztos adatot — a mezőket kézzel is kitöltheted","ℹ️");
          else if(st.type==="link" && !st.title) st.title=ibHost(st.url);
          repaint(); };
        var ph=mm.querySelector("#ib26-ph"); if(ph) ph.onchange=function(){ var f=ph.files[0]; if(!f) return; var rd=new FileReader();
          rd.onload=function(){ var im=new Image(); im.onload=function(){ try{ var c=document.createElement("canvas"); var sc=Math.min(1,760/im.width);
            c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext("2d").drawImage(im,0,0,c.width,c.height);
            st.image=c.toDataURL("image/jpeg",0.55); st.type="photo"; toast("Kép csatolva","📸"); repaint(); }catch(e){ toast("Kép-feldolgozási hiba","🖼️"); } };
            im.onerror=function(){ toast("A fájl nem kép","🖼️"); }; im.src=rd.result; }; rd.readAsDataURL(f); };
        var ix=mm.querySelector("#ib26-im"); if(ix) ix.onclick=function(){ delete st.image; repaint(); };
        var sv=mm.querySelector("#ib26-save"); if(sv) sv.onclick=function(){ ibCollect(mm,st);
          var r=mm.querySelector("#ib26-raw"); if(r) st._raw=r.value;
          if(st.type==="link" && !(st.url||"").trim()){ toast("Adj meg linket","🔗"); return; }
          if(st.type==="note" && !(st.note||st.title||"").trim()){ toast("Írj valamit a jegyzetbe","📝"); return; }
          /* V51-fix: title származtatás (V46 viselkedés visszakapcsolása) */ if(!String(st.title||"").trim()){ if(st.note) st.title=String(st.note).trim().split(/\n/)[0].slice(0,60); else if(st.location) st.title=String(st.location); else if(st.description) st.title=String(st.description).slice(0,60); }
          if(!(st.title||st.note||st.url||st.image||st.location||st.description||st.date)) { toast("A mentéshez legyen legalább egy adat","ℹ️"); return; }
          if(!st.id) { var du=ibDedup(st.url,st.title); if(du){ toast("Ez már van a postafiókban — megnyitom","📥"); closeModal(); ibComposer(du.type, du); return; } }
          var it={ id:st.id||Store.uid("ib"), type:st.type,
            title:String(st.title||""), url:(st.url||"").trim()||null, source_url:(st.url||"").trim()||null,
            source_type: st.type, host:(st.url?ibHost(st.url):null),
            date:st.date||null, time:st.time||null, location:st.location||null, organizer:st.organizer||null,
            description:st.description||null, distance_km:st.distance_km||null, elevation_gain:st.elevation_gain||null,
            duration:st.duration||null, difficulty:st.difficulty||null, image:st.image||null,
            note:String(st.note||""), at:st.at||new Date().toISOString(), created_at:st.created_at||st.at||new Date().toISOString(),
            read: it_readDefault(st,found), status:st.status||(st.linkedTourId?"trip":(st.linkedWishId?"wish":"new")),
            linkedWishId:st.linkedWishId||null, linkedTourId:st.linkedTourId||null };
          ibSave(it); closeModal();
          toast(found&&found.length?"Mentve a felismert adatokkal — ✓ felismerve 📥":"Mentve az Inboxba 📥","✓");
          ibRepaint(); }; }
      wire(m); } }); }
function it_readDefault(st,found){ return !!st.read; }

/* ---------------- Lista nézet ---------------- */
function ibChip(st){ var H={new:["🆕","Új","chip-sand"],wish:["⭐","Bakancslistán","chip-green"],trip:["🗓️","Terv készült","chip-blue"],read:["✓","Feldolgozva","chip-pine"]}[st];
  return '<span class="chip '+H[2]+'">'+H[0]+" "+H[1]+"</span>"; }
function ibCardHTML(it){ var T=IB_T[it.type]||IB_T.link;
  var meta=[it.date?X(it.date):"", it.time?X(it.time):"", it.location?X(it.location):"",
    it.distance_km?X(it.distance_km)+" km":"", it.elevation_gain?X(it.elevation_gain)+" m":""].filter(Boolean).join(" · ");
  var line=meta? '<p class="small muted" style="margin:.2rem 0 0">'+meta+"</p>":"";
  var org=it.organizer?'<p class="small muted" style="margin:.15rem 0 0">👤 '+X(it.organizer)+"</p>":"";
  var desc=it.description? '<p class="ib26-desc">'+X(it.description).slice(0,170)+"</p>":"";
  var img=it.image?'<img class="ib26-kiskep" src="'+X(it.image)+'" alt="inbox kép">':"";
  var src=it.url? '<a class="ib26-src" href="'+X(it.url)+'" target="_blank" rel="noopener nofollow">🔗 '+X(it.host||ibHost(it.url))+'</a>':"";
  var triplink=it.linkedTourId&&Store.getTour(it.linkedTourId)? ' <a class="ib26-src" href="#/tura/'+X(it.linkedTourId)+'">🗓️ Terv →</a>':"";
  var newb=ibStatus(it)==="new"?" ib26-new":"";
  return '<article class="card ib26-card'+newb+'">'+
    '<div class="ib26-icon" aria-hidden="true">'+T[0]+"</div>"+
    '<div class="ib26-main"><div class="ib26-row1">'+
      "<b>"+(X(it.title)||"(címetlen)")+"</b>"+ibChip(ibStatus(it))+"</div>"+
      '<div class="small" style="color:#8b8578">'+X(T[1])+"."+src+triplink+"</div>"+line+org+desc+img+
      '<div class="ib26-acts">'+
        (it.linkedWishId?'<span class="ib26-mini">⭐ Bakacslista</span>':'<button class="btn btn-ghost btn-sm" data-ib2w="'+X(it.id)+'">⭐ Bakancslistára teszem</button>')+
        (it.linkedTourId?'<span class="ib26-mini">🗓️ van terv</span>':'<button class="btn btn-ember btn-sm" data-ib2t="'+X(it.id)+'">🗓️ Túratervet készítek</button>')+
        '<button class="btn btn-soft btn-sm" data-ib2e="'+X(it.id)+'">✏️</button>'+
        '<button class="btn btn-ghost btn-sm" data-ib2r="'+X(it.id)+'" title="Feldolgozottnak jelöl">☑</button>'+
        '<button class="btn btn-ghost btn-sm" data-ib2gpx="'+X(it.id)+'" title="GPX hozzáadása">🗺️ GPX</button>'+ '<button class="btn btn-ghost btn-sm" data-ib2d="'+X(it.id)+'">🗑</button>'+
      "</div></div></article>"; }
function ibFiltered(){ var L=ibAll().slice();
  if(ibCat) L=L.filter(function(x){return x.type===ibCat;});
  if(ibQ){ var q=ibQ.toLowerCase(); L=L.filter(function(x){
    return (String(x.title||"")+" "+String(x.location||"")+" "+String(x.organizer||"")+" "+String(x.note||"")+" "+String(x.url||"")+" "+String(x.description||"")).toLowerCase().indexOf(q)>-1; }); }
  if(ibSort==="uj") L.sort(function(a,b){return String(b.created_at||b.at||"").localeCompare(String(a.created_at||a.at||""));});
  else if(ibSort==="regi") L.sort(function(a,b){return String(a.created_at||a.at||"").localeCompare(String(b.created_at||b.at||""));});
  else if(ibSort==="date") L.sort(function(a,b){return String(a.date||"ZZZZ").localeCompare(String(b.date||"ZZZZ"));});
  else if(ibSort==="type") L.sort(function(a,b){return String(a.type).localeCompare(String(b.type))||String(b.created_at||"").localeCompare(String(a.created_at||""));});
  return L; }
function ibRepaint(){ var box=document.getElementById("ib26-list"); if(!box) { ibRefresh(); return; }
  var L=ibFiltered(), had=ibAll().length;
  box.innerHTML = L.length? L.map(ibCardHTML).join("") :
    (had? '<div class="empty"><span class="em-ico">🔍</span><h3>Nincs találat</h3><p class="muted">Lazíts a keresésen vagy a szűrőn.</p></div>'
       : '<div class="empty"><span class="em-ico">📥</span><h3>Még üres az Inboxod</h3><p>Ments ide túrákat, eseményeket és helyeket, hogy később könnyen megtervezhesd őket.</p><button class="btn btn-primary" id="ib26-first">＋ Első mentés</button></div>');
  var fs=document.getElementById("ib26-first"); if(fs) fs.onclick=function(){ ibComposer("link"); }; }
function ibRefresh(){ if(typeof render!=="undefined") render(); else if(typeof App!=="undefined"&&App.render) App.render(); }

/* ---------------- Akciók ---------------- */
function ibWish(id){ var it=ibGet(id); if(!it||it.linkedWishId) return; var d=Store.myData(); var ref="inbox_"+it.id;
  if(d.wishlist.some(function(w){return w.ref===ref;})) { it.linkedWishId=true; ibSave(it); toast("Megtaláltam a bakancslistán","⭐"); ibRefresh(); return; }
  var w={ id:Store.uid("w"), ref:ref, name:it.title||it.location||it.note||"Inbox-ötletem", cat: it.type==="place"&&it.location?it.location:(it.type==="tour"?"Túraötlet":"Inbox"),
    place:it.location||it.host||"Inbox", diff:"—", img: it.image||null, addedAt:Store.todayISO() };
  d.wishlist.push(w); Store.save(); it.linkedWishId=w.id; it.read=true; it.status=it.linkedTourId?"trip":"wish"; ibSave(it);
  toast("Rakerült a bakancslistára ⭐ (a kapcsolat megmaradt)","⭐"); ibRefresh(); }
function ibTrip(id){ var it=ibGet(id); if(!it) return;
  if(it.linkedTourId){ var ex=Store.getTour(it.linkedTourId);
    if(ex){ toast("Ebből az ötletből már van terved — megnyitom","🗓️"); NAV.to("#/tura/"+it.linkedTourId); return; } }
  var t=Store.newTourFromDraft({ title:(it.title||it.note||"Inbox-ötletem").slice(0,80),
    place:it.location||it.host||"", date:it.date||"", status:"ötlet",
    difficulty:it.difficulty||"Közepes", lengthKm:+it.distance_km||0, ascent:+it.elevation_gain||0,
    durationH:+it.duration||0, img: it.image||null,
    desc:String(it.description||it.note||"").slice(0,380), coords:null,
    notes:"Forrás: Inbox"+(it.url?" · "+it.url:"")+(it.organizer?" · Szervező: "+it.organizer:"")+(it.time?" · Találkozó: "+it.time:""),
    tags:["inbox"] });
  it.linkedTourId=t.id; it.read=true; it.status=it.linkedWishId?"trip":"trip"; ibSave(it);
  toast("Túraterv létrejött — adatok átvitve, V43 planner/V44 review elérhetők","🗓️");
  NAV.to("#/tura/"+t.id); }
function ibMark(id){ var it=ibGet(id); if(!it) return; it.read=true; if(!it.linkedTourId&&!it.linkedWishId) it.status="read"; ibSave(it); ibRefresh(); }
function ibDel(id){ var it=ibGet(id); if(!it) return;
  confirmDlg('Törlöd: "'+(it.title||it.note||"elem")+'"? Az ebből készült túraprojekt nem törlődik!','Törlés',function(){
    var d=Store.myData(); var keepTour=it.linkedTourId;
    d.inbox=(d.inbox||[]).filter(function(x){return x.id!==id;});
    if(keepTour){ toast("Inbox-elem törölve — túraprojekt megmaradt ✓","🗑"); } else { toast("Inbox-elem törölve","🗑"); }
    Store.save(); ibRefresh(); }); }

/* ---------------- Nézet + drótozás ---------------- */
VIEWS.inbox = function(){ var n=ibAll().filter(function(x){return ibStatus(x)==="new";}).length;
  return dash("#/inbox")('<div class="ib26-page" style="padding-top:6px">'+
    '<div class="ib26-headcard"><div><h1 style="margin:0">📥 Inbox</h1>'+
    '<p class="small muted" style="margin:.2rem 0 0">Ide mentheted el a túrákkal kapcsolatos ötleteidet, linkjeidet és eseményeidet — innen egy lépés a ⭐ bakancslista vagy a 🗓️ túraterv.</p></div>'+
    '<button class="btn btn-primary" id="ib26-new">＋ Új mentés'+(n?' <span class="badge">'+n+"</span>":"")+"</button></div>"+
    '<div class="ib26-tools"><input class="input" id="ib26-q" placeholder="🔍 Keresés: cím, hely, szervező, szöveg" value="'+X(ibQ)+'">'+
    '<select class="input" id="ib26-sort"><option value="uj">Legújabb</option><option value="regi">Legrégebbi</option><option value="date">Túra dátuma</option><option value="type">Típus</option></select></div>'+
    '<div class="ib26-filters">'+[""  ,"link","event","photo","note","tour","place"].map(function(k){
      return '<button class="f-pill'+(ibCat===k?" on":"")+'" data-cat="'+k+'">'+(k?IB_T[k][0]+" "+IB_T[k][1]:"Mind")+"</button>"; }).join("")+"</div>"+
    '<div id="ib26-list"></div>'+
    '<p class="small muted center" style="margin:1.2rem 0 1rem;opacity:.8">Az adataid csak ebben a böngészőben tárolódnak — nem hagyják el a készüléket.</p>'+
    "</div>"); };
VIEWS.inbox.after = function(root){ ibRepaint();
  var nb=root.querySelector("#ib26-new"); if(nb) nb.onclick=function(){ ibComposer("link"); };
  var q=root.querySelector("#ib26-q"); if(q) q.oninput=function(){ ibQ=q.value; ibRepaint(); };
  var so=root.querySelector("#ib26-sort"); if(so){ so.value=ibSort; so.onchange=function(){ ibSort=so.value; ibRepaint(); }; }
  root.querySelectorAll("[data-cat]").forEach(function(b){ b.onclick=function(){ ibCat=b.dataset.cat;
    root.querySelectorAll("[data-cat]").forEach(function(z){ z.classList.toggle("on", z.dataset.cat===ibCat); }); ibRepaint(); }; });
  root.addEventListener("click", function(ev0){ var b=ev0.target.closest("[data-ib2w],[data-ib2t],[data-ib2e],[data-ib2r],[data-ib2d],[data-ib2gpx]"); if(!b) return;
    var idw=b.getAttribute("data-ib2w"), idt=b.getAttribute("data-ib2t"), ide=b.getAttribute("data-ib2e"), idr=b.getAttribute("data-ib2r"), idd=b.getAttribute("data-ib2d");
    if(idw) ibWish(idw); if(idt) ibTrip(idt); if(ide){ var x=ibGet(ide); if(x) ibComposer(x.type,x); } if(idr) ibMark(idr); if(idd) ibDel(idd);
    var idg=b.getAttribute("data-ib2gpx"); if(idg){ try{ window.openGPXImport({inboxId:idg, tripId:(ibGet(idg)||{}).linkedTourId||null}); }catch(e){ toast("A GPX Modul nem érhető el","🗺️"); } } }); };
VIEWS.inbox.after = (function(orig){ return function(root){ orig&&orig(root);   var lst=root.querySelector("#ib26-list");
  if(lst) lst.addEventListener("click", function(ev0){ var b=ev0.target.closest("[data-ib2w],[data-ib2t],[data-ib2e],[data-ib2r],[data-ib2d],[data-ib2gpx]"); if(!b) return;
    var idw=b.getAttribute("data-ib2w"), idt=b.getAttribute("data-ib2t"), ide=b.getAttribute("data-ib2e"), idr=b.getAttribute("data-ib2r"), idd=b.getAttribute("data-ib2d");
    if(idw) ibWish(idw); if(idt) ibTrip(idt); if(ide){ var x=ibGet(ide); if(x) ibComposer(x.type,x); } if(idr) ibMark(idr); if(idd) ibDel(idd);
    var idg=b.getAttribute("data-ib2gpx"); if(idg){ try{ window.openGPXImport({inboxId:idg, tripId:(ibGet(idg)||{}).linkedTourId||null}); }catch(e){ toast("A GPX Modul nem érhető el","🗺️"); } } });
 }; })(VIEWS.inbox.after);
window.__V46=1; window.__v46dbg={ parse:ibParse, fields:typeof fieldsFor!=='undefined'?null:null };
})();
