/* ============ V54.1 — Valódi felhasználói fiók + güvenli felhő-alapú mentés (ALAPOK) ============
   AUDIT (V53): minden adat a böngésző localStorage-jában (kulcs: turavaros_v1):
     db = { users{id→user}, data{id→myData}, session, platform, community }. A community-azonosítás e-mail.
     Jelszó edsig sós-olatlan djb2 volt; a helyi login szinkron (V41–V53 oldalon át nem törhető).
   PLATFORM: a live Page static (category immutable) és egy session egy Page-et bír → valós szerver-felhő
     EBBEN a session-ben nem provizionálható. Ezért V54.1: CLOUD-READY réteg:
     - adapter-interfész ( signup/login/save/load/logout ) — REST adapter: window.V54_CLOUD_BASE_URL beállítástól
      活的; ha nincs → helyi trezorszekrény (elkülönített localStorage namespace, PBKDF2-jelszó ellenőrzés, token).
     - UI soha nem állítja, hogy többeszközös felhő él: a blokk neve és állapota őszinte.
   Migráció: LOCAL→CLOUD (soha nem töröl helyit), restore: CLOUD→LOCAL (prefix-biztonsági snapshot előtt),
   dedup: uid-vault+ snap id-cserés idempotent írás. Offline: full local function + sáv+"online回来 szink" state. */
(function(){
"use strict";
var VKEY="turatars_v54_vault_v1";        /* local vault namespace — separate key, NOT db */
var SKEY="turatars_v54_settings_v1";     /* device settings: linked emails, last-offer ts */
/* ---------- helpers ---------- */
function b64(buf){ var s=String.fromCharCode.apply(null, new Uint8Array(buf)); return btoa(s); }
function rnd(n){ var a=new Uint8Array(n); (self.crypto||window.crypto).getRandomValues(a); return a; }
function hex(bytes){ return Array.prototype.map.call(bytes,function(b){return ("0"+b.toString(16)).slice(-2);}).join(""); }
function sha256hex(str){ if(!(self.crypto&&self.crypto.subtle)){ /* fallback */ return "legacy:"+djb(str); }
  try{ return self.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function(h){ return hex(new Uint8Array(h)); }); }catch(e){ return Promise.resolve("legacy:"+djb(str)); } }
function djb(s){ var h=5381; for(var i=0;i<s.length;i++) h=(h*33^s.charCodeAt(i))>>>0; return "h"+h.toString(36); }
function pbkdf2(pass, saltB64, iters){ if(!(self.crypto&&self.crypto.subtle)) return Promise.resolve(null);
  var enc=new TextEncoder();
  return self.crypto.subtle.importKey("raw", enc.encode(String(pass||"")), "PBKDF2", false, ["deriveBits"])
   .then(function(k){ return self.crypto.subtle.deriveBits({name:"PBKDF2", salt: Uint8Array.from(atob(saltB64), function(c){return c.charCodeAt(0);}), iterations: iters||120000, hash:"SHA-256"}, k, 256); })
   .then(function(bits){ return hex(new Uint8Array(bits)); }).catch(function(){ return null; }); }
function sget(k){ try{ return JSON.parse(localStorage.getItem(k)||"null"); }catch(e){ return null; } }
function sset(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
function vault(){ var v=sget(VKEY); if(!v){ v={ accounts:{}, snaps:{} }; } v.accounts=v.accounts||{}; v.snaps=v.snaps||{}; return v; }
function saveVault(v){ return sset(VKEY, v); }
function settings(){ return sget(SKEY)||{offers:{}}; }
function setSettings(s){ sset(SKEY, s); }
function uidGen(){ return "uid_"+Date.now().toString(36)+hex(rnd(4)); }
/* ---------- SNAPSHOT (uid-bound) ---------- */
function buildSnapshot(email){ try{
  var email1=normEmail(email);
  var db=(function(){ try{ return JSON.parse(localStorage.getItem("turavaros_v1")||"{}"); }catch(e){ return {}; } })();
  var u=null, k; for(k in db.users){ if(db.users[k].email===email1){ u=db.users[k]; break; } }
  if(!u) return null;
  var d=(db.data&&db.data[u.id])||{};
  var c=db.community||{}; var p=db.platform||{};
  var mineConn=(c.connections||[]).filter(function(x){ return x.a===email1||x.b===email1; });
  var mineInv=(c.invites||[]).filter(function(x){ return x.email===email1||x.by===email1||x.uid===email1; });
  var relTourIds={}; ((d.tours)||[]).forEach(function(t){ relTourIds[t.id]=1; });
  mineInv.forEach(function(iv){ if(iv.tourId) relTourIds[iv.tourId]=1; });
  var mineNotifs=(c.notifs||[]).filter(function(x){ return x.to===email1; });
  var snap={ schema:"v54.1", v:1, uid:u.email? ("uid_map:"+email1):u.id, linkedEmail:email1, localUserId:u.id,
    ts:new Date().toISOString(),
    user:{ id:u.id, name:u.name, email:u.email, city:u.city, onboarded:true, joined:u.joined||"", bio:u.bio||null },
    data: d,
    routes: d.routes||[],
    platform: { organizers:(p.organizers||[]).filter(function(o){ return o.owner===email1; }),
      events:(p.events||[]).filter(function(e){ var o=(p.organizers||[]).find(function(x){return x.id===e.orgId;}); return (o&&o.owner===email1) || e.projectOwner===email1 || (e.id&&(p.participants||[]).some(function(x){return x.eid===e.id&&x.uid===email1;})); }),
      participants:(p.participants||[]).filter(function(x){ return x.uid===email1 || (p.events.some(function(e){ var o=(p.organizers||[]).find(function(x2){return x2.id===e.orgId;}); return e.id===x.eid&&o&&o.owner===email1; })); }) },
    community: { profiles:(c.profiles||[]).filter(function(x){ return x.uid===email1; }),
      connections:mineConn, invites:mineInv, notifs:mineNotifs, seeded:true },
    /* shared projektek meta (only own ones fully) */
    sharedMeta:{ note:"A V53 meghívásos megosztás a szervezetlen adatot helyben hagyja — restore után a másik fél projektje a meghívó tokenmel újra betölthető." }
  };
  return snap; }catch(e){ return null; } }
function snapshotSize(snap){ try{ return JSON.stringify(snap).length; }catch(e){ return 0; } }
/* ---------- ADAPTERS ---------- */
var Adapter = {
  name: "local-vault",
  signup: function(email, pass, name){ return localSignup(email,pass,name); },
  login: function(email, pass){ return localLogin(email,pass); },
  save: function(token, snap){ return localSave(token, snap); },
  load: function(token){ return localLoad(token); },
  logout: function(token){ return Promise.resolve(true); },
  whoami: function(token){ return Promise.resolve(localWho(token)); }
};
var RestAdapter = {
  name:"cloud-http",
  signup: function(email,pass,name){ return api("POST","/api/signup",{email:email,password:pass,name:name}); },
  login: function(email,pass){ return api("POST","/api/login",{email:email,password:pass}); },
  save: function(token,snap){ return api("POST","/api/vault",{snapshot:snap},{auth:token}); },
  load: function(token){ return api("GET","/api/vault",null,{auth:token}); },
  logout: function(token){ return api("POST","/api/logout",null,{auth:token}).catch(function(){ return true; }); },
  whoami: function(token){ return api("GET","/api/whoami",null,{auth:token}); }
};
var SupabaseAdapter = window.__TT_SUPABASE_ADAPTER||null;
function base(){ return (window.V54_CLOUD_BASE_URL||"").replace(/\/+$/,""); }
function getActive(){
  if(sess&&sess.provider==="local-vault") return Adapter;
  if(sess&&sess.provider==="cloud-http") return RestAdapter;
  if(sess&&sess.provider==="supabase-snapshot"&&SupabaseAdapter) return SupabaseAdapter;
  if(SupabaseAdapter&&navigator.onLine!==false) return SupabaseAdapter;
  return base()?RestAdapter:Adapter; }
function isRemote(){ return getActive().name!=="local-vault"; }
function remoteBase(){ var a=getActive(); return a&&a.baseUrl?a.baseUrl:base(); }
function api(method, path, body, opt){ var url=base()+path; var h={ "content-type":"application/json" };
  var out={ method:method, headers:h };
  if(opt&&opt.auth) h["authorization"]="Bearer "+opt.auth;
  if(body!=null) out.body=JSON.stringify(body);
  return fetch(url, out).then(function(r){ if(!r.ok) { return r.json().catch(function(){return {};}).then(function(j){ var e=new Error((j&&j.error)||("http_"+r.status)); e.status=r.status; throw e; }); }
    return r.json(); }); }
/* ---------- local vault impl ---------- */
function normEmail(e){ return String(e==null?"":e).trim().toLowerCase(); }
function localSignup(email, pass, name){ email=normEmail(email);
  if(!/^[^@\s]+@[^@\s]+/.test(email)) return Promise.reject({error:"bad_email"});
  if(!pass||String(pass).length<8) return Promise.reject({error:"weak_password"});
  var v=vault(); var ex=v.accounts[email];
  if(ex && ex.uid) { return pbkdf2(pass, ex.salt, 120000).then(function(hh){ if(hh!==ex.hash) throw {error:"bad_password"};
    var vv=vault(); var tok="tk_"+hex(rnd(8)); vv.tokens=vv.tokens||{}; vv.tokens[tok]=email; if(!saveVault(vv)) throw {error:"storage_full"}; return {token:tok, uid:ex.uid, email:email, reused:true}; }); }
  var saltB64=b64(rnd(16));
  return pbkdf2(pass, saltB64, 120000).then(function(h){ if(!h) throw {error:"crypto_unavailable"};
    var vv=vault(); vv.accounts[email]={ uid:"uid_"+djb(email)+"_"+hex(rnd(3)), email:email, salt:saltB64, hash:h, name:name||"Túrázó", createdAt:new Date().toISOString() };
    var tok="tk_"+hex(rnd(8)); vv.tokens=vv.tokens||{}; vv.tokens[tok]=email; if(!saveVault(vv)) throw {error:"storage_full"};
    return { token:tok, uid:vv.accounts[email].uid, email:email }; }); }
function localLogin(email, pass){ email=normEmail(email); var acc=vault().accounts[email];
  if(!acc){ var r=localSignup(email, pass, (Store.me()&&Store.me().name)||"Túrázó"); return r; }
  return pbkdf2(pass, acc.salt, 120000).then(function(h){ if(h!==acc.hash){ throw {error:"bad_password"}; }
    var v=vault(); var tok="tk_"+hex(rnd(8)); v.tokens=v.tokens||{}; v.tokens[tok]=email; if(!saveVault(v)) throw {error:"storage_full"};
    return { token:tok, uid:acc.uid, email:email }; }); }
function localWho(token){ var v=vault(); var e=(v.tokens||{})[token]||null; if(!e) return null; var a=v.accounts[e]; return a?{uid:a.uid,email:a.email,name:a.name}:null; }
function localSave(token, snap){ var w=localWho(token); if(!w) return Promise.reject({error:"unauthorized"});
  if(snapshotSize(snap) > 4400000) return Promise.reject({error:"too_large", size:snapshotSize(snap)});
  var v=vault(); v.snaps[w.uid]= { at:new Date().toISOString(), size:snapshotSize(snap), snap:snap };
  if(!saveVault(v)) return Promise.reject({error:"storage_full"});
  return Promise.resolve({ok:true, size:snapshotSize(snap)}); }
function localLoad(token){ var w=localWho(token); if(!w) return Promise.reject({error:"unauthorized"});
  var vn=vault(); var s=vn.snaps[w.uid]; return Promise.resolve(s? s : {error:"empty"}); }
/* ---------- session state (device) ---------- */
var sess = { token:null, uid:null, email:null, name:null, status:"checking", lastAt:0, err:null, pending:false, provider:null, remoteVersion:null };
function st(){ return sess; }
 function sset_(){ try{ localStorage.setItem("turatars_v54_state", JSON.stringify({token:sess.token,uid:sess.uid,email:sess.email,provider:sess.provider,remoteVersion:sess.remoteVersion,pending:!!sess.pending})); }catch(e){} }
function sget_(){ try{ return JSON.parse(localStorage.getItem("turatars_v54_state")||"null"); }catch(e){ return null; } }
function clearSess(){ sess.token=sess.uid=sess.email=sess.provider=null; sess.remoteVersion=null; sess.pending=false; sess.status="signed-out"; try{ localStorage.removeItem("turatars_v54_state"); }catch(e){} }
function loadCloudProfile(){
  var A=getActive();
  if(A.name!=="supabase-snapshot"||typeof A.profile!=="function"||!sess.token) return Promise.resolve(null);
  return Promise.resolve(A.profile()).then(function(profile){ if(profile&&typeof Store.adoptCloudProfile==="function") Store.adoptCloudProfile(profile); return profile||null; });
}
function saveCloudProfile(){
  var A=getActive(), payload=typeof Store.cloudProfile==="function"?Store.cloudProfile():null;
  if(!payload) return Promise.reject({error:"signed_out"});
  if(A.name!=="supabase-snapshot") return Promise.resolve(payload);
  if(typeof A.saveProfile!=="function"||!sess.token) return Promise.reject({error:"signed_out"});
  return Promise.resolve(A.saveProfile(payload)).then(function(profile){ if(profile&&typeof Store.adoptCloudProfile==="function") Store.adoptCloudProfile(profile); return profile||payload; });
}
function syncCloudProfileAfterAuth(result){
  if(getActive().name!=="supabase-snapshot") return Promise.resolve(result);
  return loadCloudProfile().then(function(profile){
    if(profile) return result;
    return saveCloudProfile().then(function(){ return result; });
  }).catch(function(error){ result.profileError=error&&error.error||"profile_unavailable"; return result; });
}
function adoptAuthUser(result, email){
  sess.token=result&&result.token||null; sess.email=normEmail((result&&result.email)||email); sess.uid=result&&result.uid||null;
  sess.name=result&&result.name||null; sess.pending=!!(result&&result.pending); sess.provider=(result&&result.provider)||getActive().name;
  sess.status=sess.pending?"pending":"ready"; sset_();
  if(!sess.pending && typeof Store.adoptCloudUser==="function") Store.adoptCloudUser({uid:sess.uid,email:sess.email,name:sess.name});
  return result;
}
function authSignup(email,password,name,city){
  var A=getActive();
  return Promise.resolve(A.signup(normEmail(email),password,name||"Túrázó")).then(function(result){
    result=result||{}; result.name=result.name||name||"Túrázó"; result.city=city||""; adoptAuthUser(result,email); return syncCloudProfileAfterAuth(result);
  });
}
function authLogin(email,password){
  var A=getActive();
  return Promise.resolve(A.login(normEmail(email),password)).then(function(result){
    result=result||{};
    return Promise.resolve(result.name?result:A.whoami().then(function(w){ return Object.assign({},result,w||{}); })).then(function(full){ adoptAuthUser(full,email); return syncCloudProfileAfterAuth(full); });
  });
}
window.__V54={ build:buildSnapshot, vault:{ get:vault }, api:{ signup:function(e,p,n){ return getActive().signup(e,p,n); }, login:function(e,p){ return getActive().login(e,p); }, authSignup:authSignup, authLogin:authLogin,
    cloudAuthEnabled:function(){ return !!SupabaseAdapter; }, errorText:mapErr, loadProfile:function(){ return loadCloudProfile(); }, saveProfileFromLocal:function(){ return saveCloudProfile(); }, save:function(snap){ if(!sess.token) return Promise.reject({error:"signed_out"}); return getActive().save(sess.token, snap, sess.remoteVersion); }, load:function(){ if(!sess.token) return Promise.reject({error:"signed_out"}); return getActive().load(sess.token); },
    communityList:function(){ if(!SupabaseAdapter||typeof SupabaseAdapter.communityList!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communityList(); },
    communityUpsert:function(tour){ if(!SupabaseAdapter||typeof SupabaseAdapter.communityUpsert!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communityUpsert(tour); },
    communitySetVisibility:function(id,visibility,gpxPublic){ if(!SupabaseAdapter||typeof SupabaseAdapter.communitySetVisibility!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communitySetVisibility(id,visibility,gpxPublic); },
    communityReview:function(id,rating,note){ if(!SupabaseAdapter||typeof SupabaseAdapter.communityReview!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communityReview(id,rating,note); },
    communityFavorite:function(id){ if(!SupabaseAdapter||typeof SupabaseAdapter.communityFavorite!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communityFavorite(id); },
    communityReport:function(id,reason,details){ if(!SupabaseAdapter||typeof SupabaseAdapter.communityReport!=="function") return Promise.reject({error:"community_cloud_unavailable"}); return SupabaseAdapter.communityReport(id,reason,details); },
    routingPlan:function(request){ if(!SupabaseAdapter||typeof SupabaseAdapter.routingPlan!=="function") return Promise.reject({error:"routing_not_configured"}); return SupabaseAdapter.routingPlan(request); },
    routingSearch:function(query){ if(!SupabaseAdapter||typeof SupabaseAdapter.routingSearch!=="function") return Promise.reject({error:"routing_not_configured"}); return SupabaseAdapter.routingSearch(query); },
    logoutNow:function(){ var t=sess.token, a=getActive(); var p=(t&&a.name!=="local-vault")?Promise.resolve(a.logout(t)).catch(function(){ return true; }):Promise.resolve(true); return p.then(function(){ clearSess(); }); } },
  st:st, settings:settings, setSettings:setSettings, isRemote:isRemote, activeName:function(){ return getActive().name; },
  restoreApply:applySnapshot, preSnapName:("v54_pre1") };
/* ---------- SNAPSHOT restore (CLOUD→LOCAL, uid-hez kötve; idempotens) ---------- */
function mergeFields(old, row){ var out=Object.assign({},old||{});
  Object.keys(row||{}).forEach(function(k){ var v=row[k];
    if(v && typeof v==="object" && !Array.isArray(v) && out[k] && typeof out[k]==="object" && !Array.isArray(out[k])) out[k]=mergeFields(out[k],v);
    else out[k]=v; }); return out; }
function upsertById(arr, rows){ var m={}, out=(arr||[]).slice(); out.forEach(function(x){ if(x&&x.id!=null) m[String(x.id)]=out.indexOf(x); });
  (rows||[]).forEach(function(r){ if(!r||r.id==null){ if(r) out.push(r); return; } var k=String(r.id);
    if(m[k]!=null) out[m[k]]=mergeFields(out[m[k]],r); else { out.push(r); m[k]=out.length-1; } }); return out; }
function union(a,b){ var m={}; var o=[]; (a||[]).concat(b||[]).forEach(function(x){ var k=(x&&x.id)?String(x.id):String(x); if(!m[k]){ m[k]=1; o.push(x); } }); return o; }
function applySnapshot(snap, opts){ try{
  if(!snap||!snap.snap) return {ok:false, err:"empty"}; var s=snap.snap;
  if(s.schema!=="v54.1") return {ok:false, err:"schema"};
  if(String(s.linkedEmail).toLowerCase()!==normEmail(sess.email)) return {ok:false, err:"email_mismatch"};
  var db; try{ db=JSON.parse(Store.exportData()); }catch(e){ return {ok:false,err:"local_data"}; } if(!db) return {ok:false,err:"local_data"};
  db.users=db.users||{}; db.data=db.data||{};
  // Work on a detached candidate; neither persistence nor Store.db changes yet.
  var before=JSON.stringify(db);
  var uid=s.localUserId||("u_"+djb(normEmail(s.linkedEmail)));
  var exU=null, ek; for(ek in db.users){ if(db.users[ek].email===normEmail(s.linkedEmail)){ exU=ek; break; } }
  var key=exU||uid; var lu=(db.users[key]=db.users[key]||{ id:key, email:normEmail(s.linkedEmail), joined:new Date().toISOString().slice(0,10) });
  lu.name=(s.user&&s.user.name)||lu.name||"Túrázó"; lu.city=(s.user&&s.user.city)||lu.city||""; lu.onboarded=true;
  if(s.user && s.user.bio!==undefined) lu.bio=s.user.bio;
  if(!lu.pass) lu.pass=djb(normEmail(s.linkedEmail)+":v54restored");
  var old=db.data[key]||{};
  var d=s.data||{};
  var merged=mergeFields(old,d);
  ["tours","journal","routes","wishlist","equipment","inbox","teams","templates","terepi","budget","challenges"].forEach(function(f){ merged[f]=upsertById(old[f], (d[f]||[])); });
  ["widgets","prefs","aiChat","goals","goalList"].forEach(function(f){ merged[f]= (d[f]!=null? d[f] : old[f]); });
  merged.savedEvents=union(old.savedEvents, d.savedEvents); merged.notifDismiss=union(old.notifDismiss, d.notifDismiss);
  merged.reports=upsertById(old.reports, d.reports||[]);
  db.data[key]=merged;
  /* platform + community merge (own uid-scoped rows only, upsert by id → no dup) */
  db.platform=db.platform||{ organizers:[], events:[], participants:[] };
  var pp=s.platform||{};
  db.platform.organizers=upsertById(db.platform.organizers, pp.organizers);
  /* only events that belong to this user are restored (never global others) */
  if((pp.events||[]).length){ var em={}; pp.events.forEach(function(e){ em[String(e.id)]=1; });
    db.platform.events=upsertById(db.platform.events.filter(function(e){ return !(em[String(e.id)] && pp.events.some(function(x){return x.id===e.id;})) || em[String(e.id)]===1 ? true : true; }), pp.events);
  }
  db.platform.participants=upsertById(db.platform.participants.filter(function(x){ return x.uid!==normEmail(s.linkedEmail) && !((pp.participants||[]).some(function(y){ return y.id===x.id; })); }), pp.participants);
  db.community=db.community||{ profiles:[], connections:[], invites:[], notifs:[] };
  var cc=s.community||{};
  db.community.profiles=upsertById(db.community.profiles.filter(function(x){ return x.uid!==normEmail(s.linkedEmail); }), (cc.profiles||[]).map(function(x){ return Object.assign({id:(x.uid||"p")}, x); }));
  db.community.connections=upsertById(db.community.connections, cc.connections);
  db.community.invites=upsertById(db.community.invites, cc.invites);
  db.community.notifs=upsertById(db.community.notifs, cc.notifs);
  db.community.demoSeeded=true;
  db.session=key;
  var candidate=JSON.stringify(db);
  if(candidate!==before){
    var previousBackup=localStorage.getItem("turatars_v54_pre1");
    if(!preSave(JSON.parse(before))) return {ok:false, err:"pre_restore_failed"};
    var imp=Store.importData(candidate);
    if(!imp||!imp.ok){
      // importData leaves both the old memory and DB key intact on write failure.
      try{ if(previousBackup===null) localStorage.removeItem("turatars_v54_pre1"); else localStorage.setItem("turatars_v54_pre1",previousBackup); }catch(e){}
      return {ok:false, err:"storage_full"};
    }
  }
  sess.restoredTs=snap.at||"";
  return {ok:true, tours:(merged.tours||[]).length, routes:(merged.routes||[]).length, journal:(merged.journal||[]).length};
}catch(e){ return {ok:false, err:"exception:"+String(e&&e.message).slice(0,60)}; } }
function preSave(db){ try{
  db=db||JSON.parse(Store.exportData()); if(!db) return false;
  var raw=JSON.stringify({ts:new Date().toISOString(),db:db});
  localStorage.setItem("turatars_v54_pre1",raw);
  return localStorage.getItem("turatars_v54_pre1")===raw;
}catch(e){ return false; } }
function rollback(){ try{
  var pre=JSON.parse(localStorage.getItem("turatars_v54_pre1")||"null"); if(!pre||!pre.db) return false;
  var result=Store.importData(JSON.stringify(pre.db)); return !!(result&&result.ok);
}catch(e){ return false; } }
/* ---------- UI: Fiók & sync blokk a V50 profilban ---------- */
function esc4(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function fmtT(ts){ try{ return new Date(ts).toLocaleString("hu-HU",{hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"}); }catch(e){ return ""; } }
function acctModal(prefillEmail, intent){ var em=prefillEmail||((Store.me()||{}).email||"");
  openModal({ title: intent==="restore"? "☁️ Fiók a visszaállításhoz" : "☁️ Fiók létrehozása és mentés", body:
    '<div class="e2form"><label class="f">E-mail *</label><input class="input" id="v4_e" type="email" value="'+esc4(em)+'">'+
    '<label class="f">Jelszó (min. 8 char) *</label><input class="input" id="v4_p" type="password">'+
    (isRemote()? '<p class="small muted">💾 A mentés a szerverre megy: '+esc4(remoteBase())+"</p>" :
     '<p class="small muted">🔒 Ezen az eszközön elkülönített trezorba mentünk (PBKDF2). Valódi szerver-csatlakozás után ugyanígy a felhőbe — az UI ugyanaz marad.</p>')+
    '<p class="small muted">E-mail + jelszó bejelentkezés. Google bejelentkezés jelenleg nem elérhető.</p>'+
    '<p id="v4_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="v4_go">'+(intent==="restore"?"🔓 Belépés és visszaállítás":"☁️ Fiók és mentés most")+"</button>",
   onOpen:function(m){ m.querySelector("#v4_go").onclick=function(){ var e4=m.querySelector("#v4_e").value, p4=m.querySelector("#v4_p").value; var er=m.querySelector("#v4_err");
     var show=function(t){ er.textContent=t; er.style.display=""; };
     var A=getActive();
     Promise.resolve(authSignup(normEmail(e4), p4, (Store.me()&&Store.me().name)||"Túrázó"))
      .then(function(sg){
        if(sess.pending){ sess.status="pending"; sset_(); renderBlock(); show("Erősítsd meg az e-mail címedet a Supabase levelében, majd jelentkezz be újra."); return false; }
         return finishIntent(intent, e4); })
      .catch(function(e1){ /* A régi V54 account modalnál megmarad az újrabelépési út. */ if(e1&&String(e1.error||"").match(/exist|password|reused|email/i)){
          return Promise.resolve(authLogin(normEmail(e4), p4)).then(function(l){ if(sess.pending){ show("Az e-mail cím még nincs megerősítve."); return false; } return finishIntent(intent, e4); }).catch(function(e2){ show(mapErr(e2)); }); }
        show(mapErr(e1)); }); }; } }); }
function mapErr(e){ var c; try{ c=String((e&&e.error)||e||""); }catch(x){ c="error"; } try{ if(/fetch|network|Failed/i.test(String(e&&e.message||e))) c="network"; }catch(y){}
  return ({bad_password:"Hibás e-mail vagy jelszó.", email_already_registered:"Ezzel az e-mail-címmel már van fiók. Jelentkezz be.", signed_out:"A cloud fiók nincs bejelentkezve; a helyi profil mentve maradt.", unauthorized:"A fiók-munkamenet lejárt — lépj be újra.", email_confirmation_required:"Előbb erősítsd meg az e-mail címedet.", expected_version_required:"Előbb töltsd be a felhő aktuális állapotát.", version_conflict:"A felhőben újabb mentés van. Töltsd vissza azt, majd ments újra.", invalid_snapshot:"A helyi mentés hiányos, ezért nem küldtük fel.", credentials_not_allowed:"A mentés tiltott fiókadatot tartalmaz, ezért nem küldtük fel.", email_mismatch:"A helyi és a felhőfiók e-mail címe nem egyezik.", too_large:"A mentés túl nagy ehhez a tárolóhoz — törölj régi GPX-fájlokat.", storage_full:"A böngésző tárhelye tele — a HELYI adataid érintetlenek maradtak.", bad_email:"Az e-mail formátum hibás.", weak_password:"A jelszónak legalább 8 karakter kell lennie.", network:"Nincs kapcsolat — a módosítások helyben mentve."}
    [c]) || ("A művelet most nem sikerült ("+c+"). A helyi adataid érintetlenek."); }
function finishIntent(intent, e4){ var A=getActive(); if(A.name!=="supabase-snapshot"){ if(intent==="restore") return doLoad(true); return doSave(true); }
  return Promise.resolve(A.load(sess.token)).then(function(remote){
    if(remote&&remote.error==="empty"){ sess.remoteVersion=0; sset_(); if(intent==="save") return doSave(true); toast("A fiókodban még nincs mentés","☁️"); return null; }
    if(!remote||remote.error) throw (remote||{error:"cloud_error"});
    sess.remoteVersion=Number(remote.version); sset_();
    if(intent==="restore") return doLoad(true,remote);
    sess.status="ready"; renderBlock(); toast("A felhőben már van mentés. Előbb állítsd vissza; nem írtuk felül.","⚠️"); return false;
  }).catch(function(e){ sess.status="error"; sess.err=mapErr(e); renderBlock(); toast(sess.err,"⚠️"); return false; }); }
function curLocalEmail(){ var u=Store.me(); return u&&u.email? normEmail(u.email): (sess.email||null); }
function doSave(silentOk){ var em=curLocalEmail(); if(!em){ toast("Előbb jelentkezz be a helyi fiókodba","🔑"); return Promise.resolve(false); }
  sess.status="saving"; renderBlock();
  var snap=buildSnapshot(em);
  if(!snap){ sess.status="error"; sess.err="nincs local user ezzel az emaillel"; renderBlock(); return Promise.resolve(false); }
  var A=getActive();
  if(A.name==="supabase-snapshot" && !Number.isSafeInteger(sess.remoteVersion)){
    return Promise.resolve(A.load(sess.token)).then(function(remote){ if(remote&&remote.error==="empty"){ sess.remoteVersion=0; sset_(); return doSave(silentOk); }
      if(remote&&!remote.error){ sess.remoteVersion=Number(remote.version); sset_(); sess.status="ready"; renderBlock(); toast("A felhőben már van mentés. Előbb állítsd vissza; nem írtuk felül.","⚠️"); return false; }
      throw (remote||{error:"cloud_error"}); }).catch(function(e){ sess.status="error"; sess.err=mapErr(e); renderBlock(); toast(sess.err,"⚠️"); return false; });
  }
  return Promise.resolve(A.save(sess.token, snap, sess.remoteVersion)).then(function(r){ if(r&&r.error){ throw {error:r.error}; }
    if(r&&Number.isSafeInteger(Number(r.version))) sess.remoteVersion=Number(r.version);
    sess.status="saved"; sess.lastAt=(r&&r.at)||Date.now(); sess.err=null; sset_();
    var sets=settings(); sets.linked=sets.linked||{}; sets.linked[sess.email]=1; setSettings(sets);
    renderBlock(); toast(silentOk? "☁️ Adatok a fiókba mentve (példány: "+((r&&r.size)?Math.round(r.size/1024)+" KB":"kész")+")":"☁️ Szinkronizálva","☁️"); return true; })
   .catch(function(e){ var err=(e&&e.error)||(e&&e.message)||""; if(/TypeError|toLowerCase|undefined/.test(err)){ err="internal"; } sess.status="error"; sess.err=err?mapErr(e):'ismeretlen'; renderBlock(); toast(sess.err,"⚠️"); return false; }); }
 function doLoad(auto,preloaded){ var A=getActive();
  return Promise.resolve(preloaded||A.load(sess.token)).then(function(snap){ if(!snap||snap.error==="empty"){ if(snap&&Number.isSafeInteger(Number(snap.version))) sess.remoteVersion=Number(snap.version); sset_(); toast("A fiódban még nincs mentés","☁️"); if(auto) return; return null; }
     if(snap.error){ if(!auto) toast(mapErr(snap),"⚠️"); return null; }
    if(Number.isSafeInteger(Number(snap.version))) sess.remoteVersion=Number(snap.version); sset_();
    var res=applySnapshot(snap);
    if(!res.ok){ if(res.err==="email_mismatch"){ toast("Ez a mentés másik fiókhoz tartozik — a privát adatok így is védve maradnak.","🔒"); } else toast("A visszaállítás nem sikerült — a helyi adatok érintetlenek maradtak. ("+res.err+")","⚠️"); renderBlock(); return null; }
    toast("📥 Fiókból visszaállítva. (Biztonsági pillanatkép: "+((res.tours||0))+" túra, "+(res.routes||0)+" route) Előző állapot: „vissza az előzőhöz”.", "☁️");
    try{ App.render(); }catch(e){} renderBlock(); sess.status="restored"; return res; }); }
var _v54Shown=0;
function v54Busy(){ try{ return _v54Shown || !!document.querySelector("[data-modal]"); }catch(e){ return true; } }
/* ---------- offer logic ---------- */
function maybeOffer(){ try{ if(v54Busy()) return; var u=Store.me(); if(!u) return; var sets=settings();
  if(sess.email) return; var lastOffer=(sets.offers&&sets.offers[normEmail(u.email)])||0;
  if(Date.now()-lastOffer < 1000*60*60*24*7) return; /* 1/day max */
  var d=(function(){ try{ var dd=JSON.parse(localStorage.getItem("turavaros_v1")); return dd&&dd.data&&dd.data[u.id]; }catch(e){ return null; } })();
  if(!d) return; if(!( (d.tours||[]).length || (d.journal||[]).length || (d.routes||[]).length || (d.wishlist||[]).length )) return void 0;
  sets.offers=sets.offers||{}; sets.offers[normEmail(u.email)]=Date.now(); setSettings(sets);
  _v54Shown=1; openModal({ title:"☁️ Fiók és adatbiztonság", body:'<p class="muted mt0" style="font-weight:600">☁️ Mentsük el az adataidat a fiókodba?</p><p class="small muted" style="margin:.2rem 0">Eddig csak ezen a böngészőn tároltuk — e-mail + jelszó (PBKDF2) védett tárolóba mentjük; szerver csatlakozása után ugyanígy a felhőbe.</p>'+
    "<p class=\"small\">🥾 "+((d.tours||[]).length)+" projekt · 🗺️ "+((d.routes||[]).length)+" útvonal · 📖 "+((d.journal||[]).length)+" élmény — helyben maradnak, nem törlődnek semmi caso-ban sem.</p>",
    footer:'<button class="btn btn-ghost" id="v4_later">Most kihagyom</button> <button class="btn btn-primary" id="v4_now">☁️ Mentés a fiókba</button>',
    onOpen:function(m){ m.querySelector("#v4_now").onclick=function(){ closeModal(); acctModal(u.email,"save"); }; m.querySelector("#v4_later").onclick=function(){ closeModal(); }; } });
}catch(e){} }
/* ---------- profile block ---------- */
function c54Inner(){ var s=sess; var remote=isRemote();
  var linked=!!s.email; var u=Store.me()||{};
  var stat = !linked? '<span class="chip chip-sand">☁️ Nincs fiók összekötve</span>'
    : s.status==="pending"? '<span class="chip chip-amber">✉️ E-mail megerősítésre vár</span>'
    : (s.status==="saved"||s.status==="restored")? '<span class="chip chip-green">☁️ Szinkronizálva · '+esc4(fmtT(s.lastAt||s.restoredTs||Date.now()))+"</span>"
    : s.status==="saving"? '<span class="chip chip-amber">☁️ Mentés folyamatban…</span>'
    : s.status==="error"? '<span class="chip chip-rose">☁️ Hiba: '+esc4(String(s.err||"") )+"</span>"
    : '<span class="chip chip-sand">☁️Fiók: '+esc4(s.email)+ (navigator.onLine===false?" — offline":"")+"</span>";
  var line = remote? "💾 Cél: szerver ("+esc4(remoteBase())+")" : "🔒 Cél: ehhez az eszközhöz rendelt titkosított trezor";
  return '<h2>☁️ Fiók és szinkronizálás</h2>'+
    '<div class="c54row">'+stat+"<span class='chip chip-sand'>🧍 "+esc4(u.name||"Túrázó")+(u.email?" · "+esc4(u.email):"")+"</span>"+(!navigator.onLine? "<span class='chip chip-amber'>Offline – a módosítások helyben mentve.</span>":"")+ (u.pass&&false?"":"")+"</div>"+
    '<p class="small muted mb0">'+line+"</p>"+
    '<div class="c54btns">'+ (!linked? '<button class="btn btn-primary btn-sm" id="c54-link">🔗 Fiók létrehozása mentéshez</button>'
      : (s.linkedEmail&&s.linkedEmail!==normEmail(u.email))? '<button class="btn btn-soft btn-sm" id="c54-rel">🔁 Újrakereseli a jelenlegi userhez</button>'
      : '<button class="btn btn-soft btn-sm" id="c54-save">💾 Mentés a fiókba / Szinkron most</button>')+
      (linked&&normEmail(u.email)!==sess.email? "":'')+
      (linked? '<button class="btn btn-soft btn-sm" id="c54-load">📥 Visszaállítás a fiókból</button>':'')+
      '<button class="btn btn-ghost btn-sm" id="c54-out">🚪 Fiók kilépés</button>'+
      '<button class="btn btn-ghost btn-sm" id="c54-back">↩️ Előző helyi állapot vissza&lt;fordítás&gt;</button>'+
    "</div>"+
    '<p class="small muted">E-mail + jelszó belépés aktív. A Google bejelentkezés jelenleg nem elérhető.</p>'; }
function renderBlock(){ try{ var root=document.getElementById("c54sec"); if(!root) return; root.innerHTML=c54Inner(); wireBlock(); }catch(e){} }
function wireBlock(){ var $=function(id){ return document.getElementById(id); };
  var b=$("c54-link"); if(b) b.onclick=function(){ acctModal((Store.me()||{}).email,"save"); };
  var sv=$("c54-save"); if(sv) sv.onclick=function(){ if(!isRemote()&&navigator.onLine===false){ toast("Offline — a szinkronizálás later, a helyi mentés él.","📡"); } doSave(false); };
  var ld=$("c54-load"); if(ld) ld.onclick=function(){ if(!confirmRestore()) return; doLoad(false); };
  var ro=$("c54-rel"); if(ro) ro.onclick=function(){ acctModal((Store.me()||{}).email,"save"); };
  var out=$("c54-out"); if(out) out.onclick=function(){ window.__V54.api.logoutNow(); toast("Kijelentkeztél a fiókból — a helyi app tovább működik","☁️"); try{ App.render(); }catch(e){} };
  var bb=$("c54-back"); if(bb) bb.onclick=function(){ try{ var pre=JSON.parse(localStorage.getItem("turatars_v54_pre1")||"null"); if(!pre){ toast("Nincs előző pillanatkép","↩️"); return; } if(!rollback()){ toast("Nem sikerült a visszaállítás — a helyi adatok változatlanok","⚠️"); return; } toast("Visszaállítva az előző helyi állapotot ("+fmtT(pre.ts)+")","↩️"); try{ App.render(); }catch(e){} }catch(e){ toast("Nem sikerült","⚠️"); } }; }
function confirmRestore(){ try{ var d=(Store.myData()||{}); if(((d.tours||[]).length)) { return confirm("A visszaállítás FELÜLÍRJA a jelenlegi helyi adatokat a fiókod mentésével (a mentés magától biztonsági pillanatképet készít). Folytassam?"); } }catch(e){} return true; }
(function(){ var _p50=VIEWS.profile&&VIEWS.profile.after;
  VIEWS.profile.after=function(root){ try{ _p50&&_p50(root); }catch(e){}
    try{ if(!root||root.querySelector("#c54sec")||root.querySelector(".c54x")) return; var host=root.querySelector(".p5"); if(!host) return;
      var sec=document.createElement("section"); sec.className="card panel p5-sec c54x"; sec.id="c54sec"; sec.innerHTML=c54Inner();
      var last=root.querySelector(".p5 > section:nth-last-child(4)"); if(last&&last.parentNode===host){ host.insertBefore(sec, last.nextSibling); } else host.insertBefore(sec, host.querySelector(".p5-hero")); 
      wireBlock(); }catch(e){} }; })();
/* offline sáv */
(function(){ function banner(){ var ex=document.getElementById("c54band");
    if(!navigator.onLine){ if(!ex){ var d=document.createElement("div"); d.id="c54band"; d.className="c54-band chip chip-amber"; d.textContent="Offline – a módosítások helyben mentve."; document.body.appendChild(d); } }
    else if(ex){ ex.remove(); if(sess.email){ sess.status="ready"; renderBlock(); toast("🌐 Online — szinkronizálhatsz a Fiók & szinkronizálás blokkból","☁️"); } } }
  window.addEventListener("online", banner); window.addEventListener("offline", function(){ sess.status="offline"; banner(); }); banner();
  var t=setInterval(banner, 20000); })();
/* session resume + first offer on load hook */
(function(){ var s0=sget_(); if(s0&&s0.email){ sess.token=s0.token||null; sess.email=s0.email; sess.uid=s0.uid||null; sess.pending=!!s0.pending; sess.remoteVersion=Number.isSafeInteger(Number(s0.remoteVersion))?Number(s0.remoteVersion):null; sess.provider=s0.provider||((s0.token&&/^tk_/.test(s0.token))?"local-vault":(SupabaseAdapter?"supabase-snapshot":(base()?"cloud-http":"local-vault")));
    if(sess.pending&&!sess.token){ sess.status="pending"; renderBlock(); return; }
    if(!sess.token) return;
    sess.status="ready"; getActive().whoami(s0.token).then(function(w){ if(w){ sess.uid=w.uid; sess.email=normEmail(w.email||sess.email); sess.name=w.name||sess.name; if(w.token) sess.token=w.token; if(typeof Store.adoptCloudUser==="function") Store.adoptCloudUser({uid:sess.uid,email:sess.email,name:sess.name}); return loadCloudProfile().catch(function(){ return null; }).then(function(){ sess.status="ready"; sset_(); renderBlock(); try{ if(window.App) App.render(); }catch(e){} }); } else { clearSess(); renderBlock(); } }).catch(function(e){ if(navigator.onLine===false||/network/i.test(String((e&&e.error)||e||""))){ sess.status="offline"; renderBlock(); } else { clearSess(); renderBlock(); } }); } })();
/* friss eszközre相同 sessionnel: restore-ajánlat */
setTimeout(function(){ try{ if(v54Busy() || !sess.email || Store.me()) return;
  var A=getActive(); A.load(sess.token).then(function(s){ try{
    if(!s||s.error||!s.snap) return; if(sess.restoreOffered) return; sess.restoreOffered=1;
    var n=(s.snap.data&&s.snap.data.tours||[]).length;
    _v54Shown=1; openModal({ title:"☁️ Üdv újra — ez az eszköz még üres", body:'<p class="muted mt0">A fiókodban találtunk mentést ('+esc4(s.snap.linkedEmail)+", "+n+" túra, "+fmtT(s.at||s.snap.ts)+"). Visszaállítsuk ide?</p>",
      footer:'<button class="btn btn-ghost" data-close>Most kihagyom</button> <button class="btn btn-primary" id="v4_rst">☁️ Visszaállítás a fiókból</button>',
      onOpen:function(m){ var g=m.querySelector("#v4_rst"); if(g) g.onclick=function(){ doLoad(true); closeModal(); }; } });
  }catch(e){} }); }catch(e){} }, 2300);
setTimeout(function(){ try{ maybeOffer(); }catch(e){} }, 1700);
window.__V54.api.restoreApply=applySnapshot;
window.__V54.api.preSave=function(){ return preSave(); };
window.__V54.api.rollback=rollback;
window.__V54.uid=function(){ return sess.uid; };
})();
