/* ============ V123 — VALÓS SZÉKELYFÖLDI KATALÓGUS ============
   A rekordok hivatalos, ellenőrizhető turisztikai útvonaloldalakról érkeznek.
   A koordinátákhoz OSM-alapú helypontot használunk; útvonal-GPX-t csak akkor
   adunk meg, ha azt a forrás ténylegesen publikálja. Nincs kitalált track vagy
   számított távadat.
*/
(function(){
"use strict";
var VERIFIED_AT="2026-09-12";
var IMPORTED_AT="2026-09-12";
var SOURCE_LICENSE="Hivatalos turisztikai útvonaladat; koordináta: OpenStreetMap ODbL 1.0";
var ATTRIBUTION="© Consiliul Județean Harghita / Visit Harghita; © OpenStreetMap contributors";
var OSM="https://www.openstreetmap.org/";
function tour(o){
  return Object.assign({
    region:"Székelyföld", rating:0, reviews:0, tags:[], elev:[], img:IMG.erdo,
    source:"Visit Harghita", sourceLicense:SOURCE_LICENSE, attribution:ATTRIBUTION,
    importedAt:IMPORTED_AT, verifiedAt:VERIFIED_AT, dataStatus:"verified",
    coordsSource:"OpenStreetMap contributors", coordsSourceUrl:OSM
  },o);
}
var TOURS123=[
 tour({id:"vh-harghita-bai-subpadure",name:"Harghita Băi – Subpădure",region:"Hargita-hegység",place:"Harghita Băi",km:9,up:627,h:1.5,diff:"Közepes",tags:["erdő","Hargita"],desc:"Ellenőrzött útvonaladat Harghita Băi kiindulóponttal.",start:{name:"Harghita Băi",lat:46.38563,lng:25.6366},sourceUrl:"https://www.visitharghita.com/en/places/harghita-bai-subpadure-xpwo7cxxk1dalq"}),
 tour({id:"vh-balan-piatra-singuratica",name:"Bălan – Piatra Singuratică",region:"Hășmaș-hegység",place:"Bălan",km:5.5,up:630,h:4,diff:"Közepes",tags:["szikla","kilátás"],desc:"Ellenőrzött útvonaladat Bălan és a Piatra Singuratică között.",start:{name:"Bălan",lat:46.6513,lng:25.8108},sourceUrl:"https://visitharghita.com/en/places/balan-the-lonely-rock-shw_wwbobfkuyq"}),
 tour({id:"vh-balan-piatra-singuratica-cabana",name:"Bălan – Piatra Singuratică menedékház",region:"Hășmaș-hegység",place:"Bălan",km:3.9,up:624,h:3.5,diff:"Közepes",tags:["menedékház","kilátás"],desc:"Ellenőrzött útvonaladat a Bălan–Piatra Singuratică menedékház szakaszra.",start:{name:"Bălan",lat:46.6513,lng:25.8108},sourceUrl:"https://visitharghita.com/en/places/balan-cabana-piatra-singuratica-sy8znxdntskysw"}),
 tour({id:"vh-around-red-lake",name:"Lacul Roșu körút",region:"Hășmaș-hegység",place:"Lacu Roșu",km:4.2,up:64,h:1.5,diff:"Könnyű",tags:["tó","family"],desc:"Ellenőrzött, rövid körút a Gyilkos-tó környezetében.",start:{name:"Lacu Roșu",lat:46.789526,lng:25.786796},sourceUrl:"https://www.visitharghita.com/en/places/around-red-lake-vfimislwjtm3eq"}),
 tour({id:"vh-red-lake-bicajel",name:"Lacu Roșu – Bicăjel",region:"Hășmaș-hegység",place:"Lacu Roșu",km:6.1,up:288,h:2.5,diff:"Közepes",tags:["völgy","kilátás"],desc:"Ellenőrzött útvonaladat a Gyilkos-tótól Bicăjel felé.",start:{name:"Lacu Roșu",lat:46.789526,lng:25.786796},sourceUrl:"https://visitharghita.com/en/places/lacu-rosu-bicajel-bm1mehk22meysq"}),
 tour({id:"vh-baile-tusnad-bixad",name:"Băile Tușnad – Bixad",region:"Csomád-hegység",place:"Băile Tușnad",km:13.1,up:604,h:5,diff:"Nehéz",tags:["gerinc","Csomád"],desc:"Ellenőrzött útvonaladat Băile Tușnad és Bixad között.",start:{name:"Băile Tușnad",lat:46.1433,lng:25.8622},sourceUrl:"https://visitharghita.com/en/places/tusnadfurdo-bukszad-htsodlsm1ug7ka"}),
 tour({id:"vh-baile-tusnad-sfanta-ana",name:"Băile Tușnad – Cabana Sfânta Ana",region:"Csomád-hegység",place:"Băile Tușnad",km:5.4,up:607,h:3.5,diff:"Nehéz",tags:["tó","kilátás"],desc:"Ellenőrzött útvonaladat Băile Tușnad és a Szent Anna menedékház között.",start:{name:"Băile Tușnad",lat:46.1433,lng:25.8622},sourceUrl:"https://www.visitharghita.com/en/places/baile-tusnad-cabana-sfanta-ana-7vop6pl9upt1dq"}),
 tour({id:"vh-sfanta-ana-tetelea",name:"Cabana Sfânta Ana – Țețelea",region:"Csomád-hegység",place:"Lacul Sfânta Ana",km:6.8,up:164,h:2.5,diff:"Könnyű",tags:["tó","family"],desc:"Ellenőrzött útvonaladat a Szent Anna menedékháztól Țețelea felé.",start:{name:"Lacul Sfânta Ana",lat:46.12634,lng:25.88697},sourceUrl:"https://visitharghita.ro/ro/places/cabana-sf-ana-tetelea-ce189x6grwcatg"}),
 tour({id:"vh-ciumani-panorama",name:"Ciumani panorámaút",region:"Görgényi-havasok",place:"Ciumani",km:26.9,up:851,h:8.5,diff:"Nehéz",tags:["panoráma","gerinc"],desc:"Ellenőrzött panorámaút Ciumani kiindulóponttal.",start:{name:"Ciumani",lat:46.67829,lng:25.51786},sourceUrl:"https://www.visitharghita.com/en/places/ciumani-panorama-route-dax89jengeq0vw"}),
  tour({id:"vh-chirui-vargis-pass",name:"Băile Chirui – Vargyasi-hágó",region:"Hargita-hegység",place:"Băile Chirui",km:13.1,up:171,h:4,diff:"Közepes",tags:["erdő","szoros"],desc:"Ellenőrzött útvonaladat Băile Chirui és a Vargyasi-hágó között.",start:{name:"Băile Chirui",lat:46.30069,lng:25.58446},sourceUrl:"https://visitharghita.com/en/places/kiruly-furdo-vargyas-szoros-wkwx1n5hxm7lgq"})
];
var PLACES123=[
  {id:"vh-lacul-sfanta-ana",name:"Lacul Sfânta Ana",place:"Csomád-hegység",cat:"Tavak",diff:"Ellenőrzött hely",img:IMG.tavi_tukor,desc:"Hivatalos turisztikai helyadat a Szent Anna-tóról.",coords:{lat:46.12634,lng:25.88697},source:"Visit Harghita",sourceUrl:"https://www.visitharghita.com/ro/places/lacul-sfanta-ana",sourceLicense:SOURCE_LICENSE,attribution:ATTRIBUTION,importedAt:IMPORTED_AT,verifiedAt:VERIFIED_AT,dataStatus:"verified",coordsSource:"OpenStreetMap contributors",coordsSourceUrl:OSM},
  {id:"vh-lacu-rosu",name:"Lacu Roșu",place:"Hășmaș-hegység",cat:"Tavak",diff:"Ellenőrzött hely",img:IMG.tavi_tukor,desc:"Hivatalos turisztikai helyadat a Gyilkos-tóról.",coords:{lat:46.789526,lng:25.786796},source:"Visit Harghita",sourceUrl:"https://www.visitharghita.com/en/places/around-red-lake-vfimislwjtm3eq",sourceLicense:SOURCE_LICENSE,attribution:ATTRIBUTION,importedAt:IMPORTED_AT,verifiedAt:VERIFIED_AT,dataStatus:"verified",coordsSource:"OpenStreetMap contributors",coordsSourceUrl:OSM},
  {id:"vh-harghita-bai",name:"Harghita Băi",place:"Hargita-hegység",cat:"Hegyvidék",diff:"Ellenőrzött hely",img:IMG.erdo,desc:"Hivatalos turisztikai helyadat Harghita Băi településről.",coords:{lat:46.38563,lng:25.6366},source:"Visit Harghita",sourceUrl:"https://www.visitharghita.com/en/places/harghita-bai-subpadure-xpwo7cxxk1dalq",sourceLicense:SOURCE_LICENSE,attribution:ATTRIBUTION,importedAt:IMPORTED_AT,verifiedAt:VERIFIED_AT,dataStatus:"verified",coordsSource:"OpenStreetMap contributors",coordsSourceUrl:OSM}
];
function ensure(){
  var p=Store.platform(), c=p.catalog;
  if(!c){ c=p.catalog={schemaVersion:1,region:"Székelyföld",tours:[],events:[],places:[]}; }
  if(!Array.isArray(c.tours)) c.tours=[];
  if(!Array.isArray(c.places)) c.places=[];
  var changed=false;
  TOURS123.forEach(function(t){ if(!c.tours.some(function(x){return x.id===t.id;})){ c.tours.push(t); changed=true; } });
  PLACES123.forEach(function(p){ if(!c.places.some(function(x){return x.id===p.id;})){ c.places.push(p); changed=true; } });
  if(changed) Store.save();
}
function planningUrl(t){ return t&&t.start&&isFinite(+t.start.lat)&&isFinite(+t.start.lng) ? "https://www.openstreetmap.org/?mlat="+encodeURIComponent(t.start.lat)+"&mlon="+encodeURIComponent(t.start.lng)+"#map=13/"+encodeURIComponent(t.start.lat)+"/"+encodeURIComponent(t.start.lng) : ""; }
window.v123VerifiedTours=TOURS123; window.v123PlanningUrl=planningUrl; window.v123RouteLabel=function(t){ return t&&t.gpxUrl?"GPX útvonal elérhető":"Útvonaladat még nem érhető el"; };
ensure();
})();
