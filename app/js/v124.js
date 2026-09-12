/* ============ V124 — KORÁBBI VALÓS TARTALOM HELYREÁLLÍTÁSA ============
   Csak a Git-történetben már szereplő, hivatalos forrással igazolható
   rekordokat állítja vissza. A V123 rekordok megjelenített neveit az
   elérhető hivatalos magyar megnevezésekre frissíti. DEMO adatot nem seedel.
*/
(function(){
"use strict";
var TODAY="2026-09-12", SOURCE_LICENSE="Tényszerű útvonal- vagy eseményadat és hivatkozás; az eredeti tartalom joga a forrásnál marad";
var VISIT_ATTR="© Hargita Megye Tanácsa / Visit Harghita; © OpenStreetMap contributors";
var CSEKE_ATTR="© Csíkszéki Erdélyi Kárpát-Egyesület (CsEKE)";
function catalog(){
  var p=Store.platform();
  if(!p.catalog) p.catalog={schemaVersion:1,region:"Székelyföld",tours:[],events:[],places:[]};
  ["tours","events","places"].forEach(function(k){ if(!Array.isArray(p.catalog[k])) p.catalog[k]=[]; });
  return p.catalog;
}
function patchById(list, rows){
  var changed=false;
  rows.forEach(function(row){
    var old=list.find(function(x){return x&&x.id===row.id;});
    if(old){ Object.keys(row).forEach(function(k){ if(JSON.stringify(old[k])!==JSON.stringify(row[k])){ old[k]=row[k]; changed=true; } }); }
    else { list.push(row); changed=true; }
  });
  return changed;
}
var HU_TOURS=[
  {id:"vh-harghita-bai-subpadure",name:"Hargitafürdő – Erdőalja",place:"Hargitafürdő",start:{name:"Hargitafürdő",lat:46.38563,lng:25.6366},sourceUrl:"https://www.visitharghita.com/en/places/harghita-bai-subpadure-xpwo7cxxk1dalq",desc:"Hivatalos útvonaladat Hargitafürdő és Erdőalja között."},
  {id:"vh-balan-piatra-singuratica",name:"Balánbánya – Egyeskő",region:"Nagy-Hagymás",place:"Balánbánya",start:{name:"Balánbánya",lat:46.6513,lng:25.8108},sourceUrl:"https://www.visitharghita.com/hu/places/balanbanya-egyesko-shw_wwbobfkuyq",desc:"Hivatalos útvonaladat Balánbánya és Egyeskő között."},
  {id:"vh-balan-piatra-singuratica-cabana",name:"Balánbánya – Egyeskő menedékház",region:"Nagy-Hagymás",place:"Balánbánya",start:{name:"Balánbánya",lat:46.6513,lng:25.8108},sourceUrl:"https://www.visitharghita.com/hu/places/balanbanya-egyesko-menedekhaz-sy8znxdntskysw",desc:"Hivatalos útvonaladat Balánbánya és az Egyeskő menedékház között."},
  {id:"vh-around-red-lake",name:"Gyilkos-tó körül",region:"Nagy-Hagymás",place:"Gyilkos-tó",start:{name:"Gyilkos-tó",lat:46.789526,lng:25.786796},sourceUrl:"https://www.visitharghita.com/hu/places/gyilkos-to-korul-vfimislwjtm3eq",desc:"Hivatalos rövid körút a Gyilkos-tó körül."},
  {id:"vh-red-lake-bicajel",name:"Gyilkos-tó – Kisbékás",region:"Nagy-Hagymás",place:"Gyilkos-tó",start:{name:"Gyilkos-tó",lat:46.789526,lng:25.786796},sourceUrl:"https://visitharghita.com/en/places/lacu-rosu-bicajel-bm1mehk22meysq",desc:"Hivatalos útvonaladat a Gyilkos-tó és Kisbékás között."},
  {id:"vh-baile-tusnad-bixad",name:"Tusnádfürdő – Bükszád",place:"Tusnádfürdő",start:{name:"Tusnádfürdő",lat:46.1433,lng:25.8622},sourceUrl:"https://www.visitharghita.com/hu/places/tusnadfurdo-bukszad-htsodlsm1ug7ka",desc:"Hivatalos útvonaladat Tusnádfürdő és Bükszád között."},
  {id:"vh-baile-tusnad-sfanta-ana",name:"Tusnádfürdő – Szent Anna menedékház",place:"Tusnádfürdő",start:{name:"Tusnádfürdő",lat:46.1433,lng:25.8622},sourceUrl:"https://www.visitharghita.com/en/places/baile-tusnad-cabana-sfanta-ana-7vop6pl9upt1dq",desc:"Hivatalos útvonaladat Tusnádfürdő és a Szent Anna menedékház között."},
  {id:"vh-sfanta-ana-tetelea",name:"Szent Anna menedékház – Cecele",place:"Szent Anna-tó",start:{name:"Szent Anna-tó",lat:46.12634,lng:25.88697},sourceUrl:"https://visitharghita.ro/ro/places/cabana-sf-ana-tetelea-ce189x6grwcatg",desc:"Hivatalos útvonaladat a Szent Anna menedékház és a Cecele között."},
  {id:"vh-ciumani-panorama",name:"Csomafalva – Nagylok – Faragó-mező – Csomafalva",place:"Csomafalva",start:{name:"Csomafalva",lat:46.67829,lng:25.51786},sourceUrl:"https://www.visitharghita.com/en/places/ciumani-panorama-route-dax89jengeq0vw",desc:"Hivatalos panorámaút Csomafalva kiindulóponttal."},
  {id:"vh-chirui-vargis-pass",name:"Kirulyfürdő – Vargyas-szoros",place:"Kirulyfürdő",start:{name:"Kirulyfürdő",lat:46.30069,lng:25.58446},sourceUrl:"https://www.visitharghita.com/hu/places/kiruly-furdo-vargyas-szoros-wkwx1n5hxm7lgq",desc:"Hivatalos útvonaladat Kirulyfürdő és a Vargyas-szoros között."}
];
function szatt(o){ return Object.assign({region:"Csomád-hegység",rating:0,reviews:0,tags:["teljesítménytúra"],elev:[],img:IMG.tzo_tav,source:"SZATT / CsEKE",sourceLicense:SOURCE_LICENSE,attribution:CSEKE_ATTR,importedAt:TODAY,verifiedAt:TODAY,dataStatus:"verified"},o); }
var RESTORED_TOURS=[
  szatt({id:"szatt-10",name:"SZATT 10 km – Szent Anna-tó",place:"Lázárfalvi Nyírfürdő",km:10,up:302,h:3,diff:"Könnyű",start:{name:"Lázárfalvi Nyírfürdő",lat:46.1883,lng:25.9465},desc:"A CsEKE Szent Anna-tavi teljesítménytúrájának hivatalos 10 km-es távja.",gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/801/szatt-2026-10km.gpx",sourceUrl:"https://szatt.cseke.ro/turak/1"}),
  szatt({id:"szatt-16",name:"SZATT 16 km – középtáv",place:"Lázárfalvi Nyírfürdő",km:16,up:365,h:5,diff:"Közepes",start:{name:"Lázárfalvi Nyírfürdő",lat:46.1883,lng:25.9465},desc:"A CsEKE Szent Anna-tavi teljesítménytúrájának hivatalos 16 km-es távja.",gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/635/szatt-2026-16km.gpx",sourceUrl:"https://szatt.cseke.ro/turak/2"}),
  szatt({id:"szatt-40",name:"SZATT 40 km – hosszútáv",place:"Lázárfalvi Nyírfürdő",km:40,up:1500,h:12,diff:"Nehéz",start:{name:"Lázárfalvi Nyírfürdő",lat:46.1883,lng:25.9465},desc:"A CsEKE Szent Anna-tavi teljesítménytúrájának hivatalos 40 km-es távja.",gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/636/szatt-2026-40km.gpx",sourceUrl:"https://szatt.cseke.ro/turak/3"})
];
function event(o){ return Object.assign({people:0,cap:0,img:IMG.erdo,sourceLicense:SOURCE_LICENSE,attribution:CSEKE_ATTR,importedAt:TODAY,status:"published",demo:false},o); }
var RESTORED_EVENTS=[
  event({id:"e12",name:"Szent Anna-tó teljesítménytúra 2026 – CsEKE",date:"2026-09-12",time:"07:00–18:00",place:"Lázárfalva, Nyírfürdő",diff:"Közepes",org:"CsEKE – Csíkszéki Erdélyi Kárpát-Egyesület",cat:"Teljesítménytúra",tour:"szatt-10",desc:"Három hivatalos távval meghirdetett Szent Anna-tavi teljesítménytúra.",src:"https://szatt.cseke.ro/",source:"SZATT / CsEKE",sourceUrl:"https://szatt.cseke.ro/tudnivalok",verifiedAt:TODAY,dataStatus:"verified"}),
  event({id:"e13",name:"Molnár Sándor emlékzarándoklat – Zarándokoljunk együtt!",date:"2026-09-19",time:"07:30–18:00",place:"Fügés-tető – Széphavas-kápolna",diff:"Könnyű",org:"Romániai Mária Út Egyesület",cat:"Zarándoklat",desc:"A szervező és a hivatalos turisztikai eseményoldal által közzétett emlékzarándoklat.",src:"https://visitharghita.com/hu/events/molnar-sandor-emlekzarandoklat-zarandokoljunk-egyutt",source:"Visit Harghita / Romániai Mária Út Egyesület",sourceUrl:"https://visitharghita.com/hu/events/molnar-sandor-emlekzarandoklat-zarandokoljunk-egyutt",verifiedAt:TODAY,dataStatus:"verified"}),
  event({id:"e14",name:"Retyezát csúcsai és tengerszemei – 3 nap",date:"2026-09-11",place:"Retyezát-hegység, Hunyad",diff:"Nehéz",org:"HiKeNTech",cat:"Többnapos túra",desc:"Korábbi, forráshivatkozással tárolt esemény; lejárt és újraellenőrzésre vár.",src:"https://hikentech.com/retyezat-csucsi-es-tengerszemei/",source:"HiKeNTech",sourceUrl:"https://hikentech.com/retyezat-csucsi-es-tengerszemei/",reviewedAt:TODAY,dataStatus:"needs_review",archived:true}),
  event({id:"e15",name:"Elektromos kerékpártúra a Hagymás-hegységben",date:"2026-09-20",time:"10:00",place:"Gyergyószentmiklós",diff:"Nehéz",org:"Nagyhagymás Közösségek Közti Fejlesztési Társulás",cat:"Kerékpáros túra",desc:"A Git-történetben megőrzött Facebook-esemény; hivatalos újraellenőrzésre vár.",src:"https://www.facebook.com/events/1588106432868506/",source:"Facebook esemény / Nagyhagymás KKT",sourceUrl:"https://www.facebook.com/events/1588106432868506/",reviewedAt:TODAY,dataStatus:"needs_review"}),
  event({id:"e16",name:"Nagy Mező-havas (görgényi túra)",date:"2026-09-26",place:"Görgényi-havasok",diff:"Közepes",org:"CsEKE – Zsigmond Éva",cat:"Vezetett túra",desc:"A CsEKE 2026-os éves túratervében meghirdetett túra.",src:"https://www.cseke.ro/evesturaterv?page=3",source:"CsEKE éves túraterv",sourceUrl:"https://www.cseke.ro/evesturaterv?page=3",verifiedAt:TODAY,dataStatus:"verified"}),
  event({id:"e17",name:"Őszi Kisbarangolók (gyerektúra)",date:"2026-09-27",place:"Helyszín még nincs közzétéve",diff:"Könnyű",org:"CsEKE – Kisbarangolók",cat:"Családi túra",desc:"A CsEKE éves túratervében szereplő program; a részletes helyszín ellenőrzésre vár.",src:"https://www.cseke.ro/evesturaterv?page=3",source:"CsEKE éves túraterv",sourceUrl:"https://www.cseke.ro/evesturaterv?page=3",reviewedAt:TODAY,dataStatus:"needs_review"}),
  event({id:"e18",name:"Istenszéke túra (Őszi Kelemen)",date:"2026-10-10",place:"Kelemen-havasok",diff:"Közepes",org:"CsEKE – Zsigmond Éva",cat:"Vezetett túra",desc:"A CsEKE 2026-os éves túratervében meghirdetett túra.",src:"https://www.cseke.ro/evesturaterv?page=3",source:"CsEKE éves túraterv",sourceUrl:"https://www.cseke.ro/evesturaterv?page=3",verifiedAt:TODAY,dataStatus:"verified"}),
  event({id:"e19",name:"Honismereti túra (1 nap, busszal)",date:"2026-10-17",place:"Erdővidék",diff:"Könnyű",org:"CsEKE – Solti Imre és Ferencz Lóránd",cat:"Honismereti túra",desc:"A CsEKE éves túratervében szereplő program; a részletes szervezés még folyamatban van.",src:"https://www.cseke.ro/evesturaterv?page=3",source:"CsEKE éves túraterv",sourceUrl:"https://www.cseke.ro/evesturaterv?page=3",reviewedAt:TODAY,dataStatus:"needs_review"})
];
var HU_PLACES=[
  {id:"vh-lacul-sfanta-ana",name:"Szent Anna-tó",sourceUrl:"https://www.visitharghita.com/ro/places/lacul-sfanta-ana",desc:"Hivatalos turisztikai helyadat a Szent Anna-tóról."},
  {id:"vh-lacu-rosu",name:"Gyilkos-tó",place:"Nagy-Hagymás",sourceUrl:"https://www.visitharghita.com/hu/places/gyilkosto",desc:"Hivatalos turisztikai helyadat a Gyilkos-tóról."},
  {id:"vh-harghita-bai",name:"Hargitafürdő",sourceUrl:"https://www.visitharghita.com/en/places/harghita-bai-subpadure-xpwo7cxxk1dalq",desc:"Hivatalos turisztikai helyadat Hargitafürdőről."}
];
function ensure(){
  var c=catalog(), changed=false;
  changed=patchById(c.tours,HU_TOURS)||changed;
  changed=patchById(c.tours,RESTORED_TOURS)||changed;
  changed=patchById(c.places,HU_PLACES)||changed;
  changed=patchById(c.events,RESTORED_EVENTS)||changed;
  if(changed) Store.save();
}
function pendingEvents(){
  return catalog().events.filter(function(e){return e&&!e.demo&&!e.archived&&e.dataStatus==="needs_review"&&String(e.date||"")>=Store.todayISO();}).map(function(e){return Object.assign({},e,{cat:(e.cat?e.cat+" · ":"")+"Ellenőrzés alatt"});});
}
window.V124={restoredTours:RESTORED_TOURS,restoredEvents:RESTORED_EVENTS,hungarianTours:HU_TOURS,hungarianPlaces:HU_PLACES,pendingEvents:pendingEvents};
window.v124PendingEvents=pendingEvents;
ensure();
})();
