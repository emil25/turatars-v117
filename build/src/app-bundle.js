/* ==== data ==== */
/* ============================================================
   TÚRAVAROS — KATALÓGUS: SZÉKELYFÖLD ÉS ERDÉLY
   ============================================================ */
"use strict";

const IMG = {
  hegylanc:  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=70",
  napfel:    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=70",
  erdo:      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=70",
  kodos:     "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=70",
  tzo_tav:   "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=70",
  lenyes:    "https://images.unsplash.com/photo-1447752875215-B270836f2bfd?auto=format&fit=crop&w=1000&q=70",
  napnyugta: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=70",
  csillagos: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=70",
  hatizsak:  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1000&q=70",
  tavi_tukor:"https://images.unsplash.com/photo-1501785888041-af3ef283b47c?auto=format&fit=crop&w=1000&q=70",
  koronak:   "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1000&q=70",
  vizases:   "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=70",
  zaraz:     "https://images.unsplash.com/photo-1504280390367-361c6d9f38f?auto=format&fit=crop&w=1000&q=70",
  volgy:     "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1000&q=70",
  mezofeny:  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1000&q=70",
  legifoto:  "https://images.unsplash.com/photo-1469474968028-5662310124b3?auto=format&fit=crop&w=1000&q=70"
};
const imgTag = (src, alt, cls="") => `<img src="${src}" alt="${alt||""}" loading="lazy" class="${cls}" onerror="this.style.display='none'">`;

const MONTHS_HU = ["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december"];
const DOW_HU = ["H","K","Sze","Cs","P","Szo","V"];
const DIFFS = { "Könnyű":"konywu", "Közepes":"kozepest", "Nehéz":"nehezu" };
const DIFF_NUM = { "Könnyű":1, "Közepes":2, "Nehéz":3 };
const DIFF_NAME = { 1:"Könnyű", 2:"Közepes", 3:"Nehéz" };

/* ---------- TÚRAKATALÓGUS — SZÉKELYFÖLD ÉS ERDÉLY ---------- */
const TOURS = [
 {id:"maria-ko", name:"Mária-kő – csíksomlyói zarándokhegy", region:"Csíki-havasok", km:6, up:210, h:2, diff:"Könnyű",
  tags:["kilátás","erdő","family","kezdőknek"], img:IMG.mezofeny, rating:4.8, reviews:412,
  desc:"A Csíki-havasok kapuja: a somlyói kegytemplomtól a nyeregre, onnan a Csíki-medence legszebb panorámája. Zarándokút gyerekekkel is.",
  start:{name:"Csíksomlyó, Klastrom-domb", lat:46.3941, lng:25.7500}, elev:[2,3,5,7,9,10,9,8,6,4,3,2]},
 {id:"kekes", name:"Csukás-tető (1116 m) – a Gyilkos-tó őre", region:"Gyergyói-havasok", km:14, up:820, h:5.5, diff:"Közepes",
  tags:["csúcs","kilátás","napkelte","szikla"], img:IMG.napfel, rating:4.9, reviews:287,
  desc:"A gyergyói havas jelképe: a tv-torony tetejéről a Gyilkos-tó, a Békás és a Kelemen-havasok láncolata. Napkeltére felejthetetlen.",
  start:{name:"Gyilkostó, Csukás-nyereg", lat:46.9976, lng:25.8544}, elev:[1,4,7,10,13,15,16,14,12,9,5,2]},
 {id:"irott-ko", name:"Hargita-csúcs (1801 m) – Ocland-ösvény", region:"Hargita", km:16, up:950, h:6, diff:"Nehéz",
  tags:["csúcs","kilátás","gerinc"], img:IMG.hegylanc, rating:4.9, reviews:516,
  desc:"A székelyföldi szent hegy: a vulkáni kúpról tiszta időben a Kelemen-havasokig belátni. Télen túrasí, nyáron gerinc.",
  start:{name:"Gyergyószentmiklós, Ocland-völgy", lat:46.7040, lng:25.5310}, elev:[2,5,8,11,14,16,18,16,13,9,6,2]},
 {id:"jastedy", name:"Szakadát-vízesés és a Békás-szoros partja", region:"Gyergyó", km:9, up:300, h:3, diff:"Könnyű",
  tags:["vízesés","tó","family","erdő"], img:IMG.vizases, rating:4.8, reviews:342,
  desc:"A Békás-szoros bejáratánál a Szakadát-vízesés 25 méterről zuhan; a parti ösvény a vörös sziklák között a Gyilkos-tóig vezet.",
  start:{name:"Gyilkostó, tópart", lat:46.9986, lng:25.8648}, elev:[1,2,3,5,4,6,5,7,5,3,2,1]},
 {id:"sas-ko", name:"Torockói-kő (Piatra Secuiului) szikláinak köre", region:"Erdélyi-karszt", km:12, up:760, h:5, diff:"Nehéz",
  tags:["szikla","kilátás","kaland"], img:IMG.tzo_tav, rating:4.9, reviews:128,
  desc:"A 'székely Mont Blanc': bányaösvények, létrás sziklafal és a Csorbakétő-tető — a Küküllő-völgy őrzi a bérce.",
  start:{name:"Torockó (Trascău), Fő-tér", lat:46.7068, lng:23.0720}, elev:[2,4,8,12,15,17,18,15,11,7,4,2]},
 {id:"tihany-kor", name:"Bálványos: Szent-Anna-tó ösvényei", region:"Hargita", km:7, up:240, h:2.5, diff:"Könnyű",
  tags:["tó","family","erdő","kilátás"], img:IMG.tavi_tukor, rating:4.7, reviews:388,
  desc:"Krátertavak a Bálványos hegycsoportján: a Szent-Anna-tó tükre és az Esztreng-lápos erdei ösvényei — ligetek, fenyvesek.",
  start:{name:"Bálványosfürdő (Băile Bálványos)", lat:45.8520, lng:26.0330}, elev:[2,2,3,2,3,4,3,5,3,2,2,1]},
 {id:"dobogoko", name:"Cetatea-marostető – a Hargita várhegye", region:"Hargita", km:6, up:320, h:2.5, diff:"Könnyű",
  tags:["family","kilátás","naplemente","rom"], img:IMG.napnyugta, rating:4.6, reviews:263,
  desc:"Az egykori székely vársáncok teteje 460 méternyi meredek panorámával; a naplemente a Hargitára aranyoz.",
  start:{name:"Bálványos, Nyerges-tető", lat:45.8780, lng:26.0280}, elev:[1,2,4,6,7,5,6,7,5,3,2,1]},
 {id:"so-hegy", name:"Só-hegy és a csíki Vár-hegy", region:"Csíki-havasok", km:8, up:340, h:3, diff:"Közepes",
  tags:["erdő","kilátás","rom","város"], img:IMG.erdo, rating:4.5, reviews:196,
  desc:"Csíkszereda fölött a Só-hegy sósváráról a Vár-hegyen át a Somlyóig: a Csíki-medence három vára, egy körtúrában.",
  start:{name:"Csíkszereda, Só-hegy", lat:46.3520, lng:25.7680}, elev:[2,4,6,5,7,8,6,5,7,4,2,1]},
 {id:"matra-soroz", name:"Madarasi-Hargita és a Stânculei gerinc", region:"Hargita", km:18, up:1050, h:7, diff:"Nehéz",
  tags:["csúcs","gerinc","kilátás","teljesítmény"], img:IMG.legifoto, rating:4.9, reviews:74,
  desc:"A Hargita déli nyúlványainak gerinctúrája: Jigodai-tető, Nyugati-Hargita és a stânculei szirtek – egész napos, komoly szint.",
  start:{name:"Gyergyómadar (Mădărașul-Ciucului)", lat:46.6440, lng:25.5310}, elev:[3,6,9,13,16,18,15,12,9,6,4,2]},
 {id:"vert-to", name:"Fekete-Hagymás – a Vörös-tó kettőse", region:"Gyergyói-havasok", km:8, up:380, h:3.5, diff:"Közepes",
  tags:["tó","kilátás","erdő","napkelte"], img:IMG.kodos, rating:4.7, reviews:154,
  desc:"A Gyergyói-havasok jellegzetes lapostetője: a Vörös-tó a havasi égen, a Hármashágó – a Kelemen-ív a háttérben.",
  start:{name:"Vizács-tető (Vlașa Plai)", lat:46.8350, lng:25.6480}, elev:[2,3,5,4,5,6,5,4,6,3,2,1]},
 {id:"pilisi-ketto", name:"Tordai-hasadék és a Kereszt-vár sziklái", region:"Erdélyi-karszt", km:10, up:420, h:4, diff:"Közepes",
  tags:["szurdok","rom","erdő","kaland"], img:IMG.volgy, rating:4.8, reviews:421,
  desc:"Járdányi-vízesés, Hasadék, Kereszt-vár és Gézengúz-kő: Erdély legdrámaibb hasadéka mesés karsztsziklák között.",
  start:{name:"Torda (Turda), Hasadék-bejárat", lat:46.5962, lng:23.7886}, elev:[1,3,5,8,6,7,9,7,5,3,2,1]},
 {id:"nagy-kopasz", name:"Déva vára és a Csergő-tető", region:"Hunyad", km:8, up:400, h:3.5, diff:"Közepes",
  tags:["rom","kilátás","erdő"], img:IMG.lenyes, rating:4.6, reviews:233,
  desc:"A Maros-völgy őre: a várból a Csergő-tető bányaösvényein a Sebes-havasok vonulata. Lángos-vizesés a völgyben.",
  start:{name:"Déva (Deva), Várhegy", lat:45.8730, lng:22.8886}, elev:[1,4,7,9,8,6,5,7,5,3,2,1]},
 {id:"galya-lelo", name:"Magyar-tető és a Nyíres-tó", region:"Erded", km:11, up:480, h:4, diff:"Közepes",
  tags:["kilátás","erdő","csend","napkelte"], img:IMG.erdo, rating:4.6, reviews:86,
  desc:"Az Erded-hegység legszebb vonulata: tölcsér-karszt, lucfenyvesek és a Nyíres-tó – Kolozsvár lába alatt, mégis vadon.",
  start:{name:"Gyalu (Gilău), Váralja", lat:46.7840, lng:23.2270}, elev:[2,3,6,8,10,11,9,7,8,5,3,2]},
 {id:"janos-hegy", name:"Sztána és a Nyergestető könnyű köre", region:"Kolozsvidék", km:5, up:180, h:2, diff:"Könnyű",
  tags:["family","kezdőknek","város","kilátás"], img:IMG.koronak, rating:4.5, reviews:348,
  desc:"Kolozsvár szomszédságában: Szigetliget, szántóföldek, egy keskeny-nyereg és a Hóstát – városi kikapcsolódó, gyepes ösvényekkel.",
  start:{name:"Sztána (Hăşdate), Felső-templom", lat:46.7400, lng:23.4300}, elev:[1,2,3,4,5,4,3,2,2,2,1,1]},
 {id:"solymos", name:"Solymos-kő – a gyergyói bazalt-orgonák", region:"Gyergyói-havasok", km:12, up:700, h:5, diff:"Nehéz",
  tags:["bazalt","kilátás","kaland"], img:IMG.tzo_tav, rating:4.9, reviews:167,
  desc:"Románia egyik legszeleszélyesebb sziklavonulata: bazaltorgonák, létrás szurdokok és a Tengerszem-tó a csúcs alatt.",
  start:{name:"Gyilkostó, Solymos-nyereg", lat:47.0020, lng:25.8400}, elev:[2,4,8,12,15,17,15,12,9,6,3,2]},
 {id:"kek-szakasz", name:"Hargita-átvonulás: Gyimes–Bálványos (többnapos)", region:"Hargita", km:42, up:2400, h:13, diff:"Nehéz",
  tags:["többnapos","sátor","gerinc","kihívás"], img:IMG.zaraz, rating:4.9, reviews:58,
  desc:"A székelyföldi gerincklasszikus két nap: hargitai menedékházak, nyakigláb ösvények, és a Bálványosi-fennsík tűzgyújtós éjszakája.",
  start:{name:"Vráncsika-völgy (Valea Vârnghișului)", lat:46.2050, lng:25.8430}, elev:[4,7,5,9,12,8,14,10,6,11,5,3]},
 {id:"szalajka", name:"Bâlea-tó és a Surla-pták köre", region:"Fogaras", km:6, up:150, h:2, diff:"Könnyű",
  tags:["tó","family","kilátás","magashegy"], img:IMG.tzo_tav, rating:4.8, reviews:511,
  desc:"A Fogarasi-havasok gyöngyöse 1834 méteren: gleccser-tó hídakkal, zúgó patak a Surla-bércre és a Porumbșel, gó-túrákra.",
  start:{name:"Bâlea-tó (transzilvánia út)", lat:45.6044, lng:24.7184}, elev:[2,2,3,2,3,4,3,4,3,2,2,1]},
 {id:"badacsony", name:"Bunkica-vár (1263 m) – a táj hegye", region:"Kolozsvidék", km:10, up:520, h:4.5, diff:"Közepes",
  tags:["rom","kilátás","szikla"], img:IMG.hegylanc, rating:4.7, reviews:142,
  desc:"Az Erdélyi 'tanúhegy': a hargitai vulkán maradványa, tetején a középkori vár romja. Szép időben a Küküllő-völgyig belátni.",
  start:{name:"Almásesszentandrás, Váralja", lat:46.8460, lng:23.3020}, elev:[1,4,7,10,12,10,8,6,5,3,2,1]}
,
 {id:"egyesko", name:"Egyeskő (1547 m) – balánbányai gerinc", region:"Hargita", km:3.7, up:660, h:1.7, diff:"Nehéz",
  tags:["csúcs","szikla","kilátás"], img:IMG.hegylanc, rating:4.7, reviews:83,
  desc:"Rövid, de talpra lép: a felvonó tetőállomásától sziklás gerincen az Egyeskő tetejére — a Csíki- és a Gyergyói-havasok panorámája a háttérben.",
  start:{name:"Balánbánya, Felvonó-felső állomás", lat:46.6761, lng:25.5684}, elev:[8,9,11,13,14,15,13,10,7,5],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/4814676,balanbanya-egyesko/"},
 {id:"singuratica", name:"Piatra Singuratică – Magányos-kő (1506 m)", region:"Hargita", km:5.6, up:730, h:2.4, diff:"Közepes",
  tags:["szikla","kilátás","erdő"], img:IMG.kodos, rating:4.6, reviews:57,
  desc:"Erős kaptató a cserjes ösvényen a havasi rétre, a Magányos-kő peremére — sziklafigurák és panoráma a Hargita-tetőkre.",
  start:{name:"Balánbánya, Vasutas-telep", lat:46.6742, lng:25.5703}, elev:[8,11,13,16,18,17,14,11,9,6],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/3870871,blan--izvor--cabana-piatra-singuratic--piatra-singuratic/"},
 {id:"szoko", name:"Szökő-vízesés és a Madarasi-Hargita ösvénye", region:"Hargita", km:8.5, up:370, h:2.5, diff:"Közepes",
  tags:["vízesés","menedékház","erdő"], img:IMG.vizases, rating:4.8, reviews:71,
  desc:"A Szeles-völgyi Pethő-menedékháztól a Szökő-vízeséshez (Sărătorilea), majd felfelé a Madarasi-Hargita menedékház felé — a nagy gerinctúra klasszikus előjátéka.",
  start:{name:"Szeles-völgy, Pethő Panzió", lat:46.6860, lng:25.5510}, elev:[15,16,17,18,19,18,17,16],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/3448255,peth-panzio--cascada-sritoarea-szoek--harghita-mdra--cabana-madarasi-menedekhaz/"},
 {id:"lacround", name:"Gyilkos-tó-parti kör (Vörös-tó)", region:"Gyergyó", km:3.7, up:40, h:0.7, diff:"Könnyű",
  tags:["tó","family","erdő"], img:IMG.tzo_tav, rating:4.5, reviews:120,
  desc:"Lapos, babakocsival és kutyával is járható kör a tó partján, mocsárdeszkákkal és madármegfigyelővel; a Bálványos-bérc a háttérben.",
  start:{name:"Gyilkostó, Kemping", lat:46.9990, lng:25.8590}, elev:[1,1,2,2,1,1,2,1],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/3788281,rund-um-den-lacul-rosu/"},
 {id:"varsag", name:"Székelyvarsági fennsík-séta", region:"Hargita", km:6.1, up:90, h:1.5, diff:"Könnyű",
  tags:["family","kilátás","csend"], img:IMG.mezofeny, rating:4.4, reviews:34,
  desc:"Havasi fennsík, nyílt rétek és a Hargita-bérc vonulata a háttérben — a Kászon kapujában, turistaháztól turistaházig.",
  start:{name:"Székelyvarság, Turistaház", lat:46.5220, lng:25.6620}, elev:[8,8,9,9,10,9,8,8,7],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/4551731,szekelyvarsag/"},
 {id:"apahavas", name:"Gyimesi Apahavas (1326 m) – bükki gerinctúra", region:"Csík", km:15.6, up:380, h:3.7, diff:"Könnyű",
  tags:["gerinc","kilátás","erdő"], img:IMG.koronak, rating:4.6, reviews:48,
  desc:"A gyimesi határvár hegye: lankás bükki gerinc, a Kikizi-lánc és a Kelemen-havasok panorámája, útközben az Áramhelyi-nyereg.",
  start:{name:"Gyimesbükk, Fekete-völgy", lat:47.0120, lng:25.7840}, elev:[9,10,11,12,13,14,15,14,12,10,9],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/4814668,gyimes-apahavas/"},
 {id:"suhardu", name:"Kis-Suhard-völgy – Vörös-tó (Gyergyószentmiklós fölött)", region:"Gyergyó", km:11.5, up:600, h:3.7, diff:"Közepes",
  tags:["tó","erdő","kilátás"], img:IMG.erdo, rating:4.5, reviews:29,
  desc:"A város feletti bérceken Gyergyó-Suhardba és a Kis-Suhard-nyeregbe, le a Vörös-tóhoz — négy évszakos, végig jelzett túra.",
  start:{name:"Gyergyószentmiklós, Kőfejtő-út", lat:46.7057, lng:25.8367}, elev:[9,10,11,12,13,14,13,12,11,10,12],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/3647816,gheorgheni--aua-suhardului--suhardu-mic--lacu-rou/"},
 {id:"udfok", name:"Székelyudvarhely – Nyergestető és a Küküllő-völgy", region:"Csík", km:9.6, up:420, h:2.7, diff:"Közepes",
  tags:["kilátás","rom","erdő"], img:IMG.lenyes, rating:4.3, reviews:41,
  desc:"Városhát-oldali ösvények a Nyerges-tetőig, onnan a Nagy-Küküllő és a Só-Hargita vonulata — városi kiránduló, komolyabb szinttel.",
  start:{name:"Székelyudvarhely, Küküllő-part", lat:46.3076, lng:25.2972}, elev:[5,7,9,11,12,11,9,7,6,5],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/3152451,odorheiu-secuiesc-harghita-romania/"},
 {id:"hasmas", name:"Hasmas (1703 m) – Határmalom-ösvény", region:"Kelemen", km:15.6, up:1060, h:5.8, diff:"Nehéz",
  tags:["kilátás","gerinc","csend"], img:IMG.csillagos, rating:4.8, reviews:36,
  desc:"A Kelemen-havasok déli kapuja: erdőösvény a Határmalom-tetőre, fent havasi fűszőnyeg — tiszta időben a Kelemen 2103 m-éig belátni.",
  start:{name:"Bögzi (Brăduț), Határmalom", lat:46.2150, lng:25.8600}, elev:[8,10,12,14,16,17,16,14,11,8,6],
  src:"https://hu.bergfex.com/sommer/harghita/touren/wanderung/1345308,hasmas/"},
 {id:"retyezatkor", name:"Retyezát csúcs (2482 m) és a Stevița-tengerszem", region:"Hunyad", km:15, up:1400, h:8.5, diff:"Nehéz",
  tags:["csúcs","szikla","tengerszem","kitett","kihívás"], img:IMG.csillagos, rating:4.9, reviews:24,
  desc:"Erdély vad gránithegysége: meredek erdőkaptató, a Stevița-vízesés és -tengerszem, majd a gránittömbök közt — kézhasznállal — a Retyezát csúcsra. Csak rendszeres túrázóknak, komoly szinttel; a Pietrele-völgyi kör (vízesések, Tăul dintre Brazi) méltó levezetés.",
  start:{name:"Pietrele-völgy, Menedékház", lat:45.3246, lng:22.8915}, elev:[2,4,7,10,13,17,21,25,22,17,11,5],
  src:"https://hikentech.com/retyezat-csucsi-es-tengerszemei/"}
,
 {id:"hagymas-bike", name:"Kerékpártúra a Hagymás-hegységben – Fenyő-útja és Pongrác-tető", region:"Gyergyó", km:51, up:1050, h:6, diff:"Nehéz",
  tags:["kerékpár","kilátás","gerinc","kihívás"], img:IMG.legifoto, rating:4.8, reviews:18,
  desc:"A Nagyhagymás KKT eseménysorozatának aktív programja: Gyergyószentmiklós teréről Kovácspéteren át a Meggyes-hágóig (ezen a szakaszon a kerékpár tolása javasolt!), majd Pongrác-tető. Két variáció: 51 km — hosszabb, technikásabb, nagyobb kihívás; 40 km — könnyebb, a Fenyő útja nyomvonalán, könnyebb ereszkedőkkel. Cél: a Békényfői Kolping Tanya, finom ebéddel. Elsősorban e-bike-kal ajánlott (korlátozott számban bérelhető, 200 RON/bringa); sisak kötelező; a részvétel ingyenes, regisztrációhoz kötött.",
  start:{name:"Gyergyószentmiklós, Fő-tér", lat:46.7057, lng:25.8367},   src:"https://adinagyhagymas.ro/interaktiv-turautvonalak/", srcn:"Hagymás interaktív túraútvonal-térkép",
  src2:"https://www.komoot.com/hu-hu/tour/3245938513", src2n:"Komoot · 51 km útvonal",
  src3:"https://www.komoot.com/hu-hu/tour/3246482522", src3n:"Komoot · 40 km útvonal"}

,{id:"szatt-10", name:"SZATT · 10 km — Szent-Anna-tó köre", region:"Hargita", km:10, up:302, h:3, diff:"Könnyű",
  tags:["kilátás","tó","family","teljesítmény"], img:IMG.tzo_tav, rating:4.8, reviews:41,
  desc:"A CsEKE éves teljesítménytúrájának könnyű távja: a rajt és a cél a Lázárfalvi Nyírfürdő, az útvonal a Szent-Anna-tó és a Mohos-tőzegláp szomszédságában körbepihenő — panorámával, frissítőkkel, emléklappal. Rajt 10:00, kB. 3 óra.",
  start:{name:"Lázárfalvi Nyírfürdő", lat:46.1883, lng:25.9465}, elev:[2,3,3,4,4,3,3,2,2,1],
  gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/801/szatt-2026-10km.gpx", src:"https://szatt.cseke.ro/turak/1", srcn:"SzATT távleírás (PDF + térkép)"},
 {id:"szatt-16", name:"SZATT · 16 km — Mohos-perem", region:"Hargita", km:16, up:365, h:5, diff:"Közepes",
  tags:["kilátás","tó","teljesítmény"], img:IMG.kodos, rating:4.8, reviews:36,
  desc:"A középső táv: a tó partjától a Mohos.peremi ösvényekre, onnan a Bálványos-bércek alatt vissza a Nyírfürdőhöz. Rajt 09:00, kB. 5 óra.",
  start:{name:"Lázárfalvi Nyírfürdő", lat:46.1883, lng:25.9465}, elev:[2,4,6,8,9,7,6,8,5,3,2],
  gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/635/szatt-2026-16km.gpx", src:"https://szatt.cseke.ro/turak/2", srcn:"SzATT távleírás (PDF + térkép)"},
 {id:"szatt-40", name:"SZATT · 40 km — a nagy kihívás", region:"Hargita", km:40, up:1500, h:12, diff:"Nehéz",
  tags:["teljesítmény","gerinc","kilátás","kihívás"], img:IMG.hegylanc, rating:4.9, reviews:29,
  desc:"A teljesítménytúrázók napja: a három kört érintő nagy 40 km-es táv a Csomád-peremen és a Bálványos-láp hegyein, 12 órás szintidővel — egyéni tempó, 3 frissítő, célban meleg étel. Rajt 07:00.",
  start:{name:"Lázárfalvi Nyírfürdő", lat:46.1883, lng:25.9465}, elev:[3,7,11,15,18,21,18,14,17,12,7,3],
  gpxUrl:"https://szatt.cseke.ro/storage/tt-hikes/636/szatt-2026-40km.gpx", src:"https://szatt.cseke.ro/turak/3", srcn:"SzATT távleírás (PDF + térkep)"}
];
const tourById = id => TOURS.find(t=>t.id===id);

/* ---------- ESEMÉNYEK ---------- */
const EVENTS = [
  {id:"e12", name:"Szent Anna-tó teljesítménytúra 2026 — CsEKE", date:"2026-09-12", place:"Lázárfalva, Nyírfürdő", diff:"Közepes",
  org:"CsEKE — Csíkszéki Erdélyi Kárpát-Egyesület", people:214, cap:400, cat:"Teljesítménytúra", tour:"tihany-kor", img:IMG.kodos,
  desc:"Új helyszínen: a rajt és a cél a Lázárfalvi Nyírfürdő. Az útvonal a Szent Anna-tó – Mohos-tőzegláp – Csomád-hegység változatos terepén vezet, három távval; frissítők, emléklap, meleg étel a célban. Rutinosan és először is jó.",
  time:"07:00–18:00", reg:"https://szatt.cseke.ro/", src:"https://visitharghita.com/hu/events/szent-anna-to-teljesitmenytura-2026-cseke"},
  {id:"e13", name:"Molnár Sándor emlékzarándoklat — Zarándokoljunk együtt!", date:"2026-09-19", place:"Fügés-tető → Széphavas-kápolna", diff:"Könnyű",
  org:"Romániai Mária Út Egyesület", people:88, cap:200, cat:"Vezetett túra", tour:"maria-ko", img:IMG.erdo,
  desc:"Emlékzarándoklat a Kászon-havasokban: busz 07:30-kor a csíkszeredai Erőss Zsolt Arénától a Fügés-tetőre, majd kb. 2 órás zarándokút a Széphavas-kápolnáig és vissza. 15:00 megemlékezés, 16:00 emlékfa-ültetés, 18:00 hálaadó szentmise. Zarándokvezetők: Kocsis György és Solti Imre.",
  time:"07:30–18:00", reg:"https://forms.gle/d6hJj8nHjcJHAYdH6", src:"https://visitharghita.com/hu/events/molnar-sandor-emlekzarandoklat-zarandokoljunk-egyutt"},
  {id:"e14", name:"Retyezát csúcsai és tengerszemei — 3 nap", date:"2026-09-11", place:"Retyezát-hegység, Hunyad", diff:"Nehéz",
  org:"HiKeNTech · Precup Csaba — nemzetközi hegyi túravezető", people:6, cap:8, cat:"Többnapos túra", tour:"retyezatkor", img:IMG.kodos,
  desc:"Péntek: telekocsi az országúton, helyben szállás. Szombat: a hét legkeményebb menete — Stevița-tengerszem és a Retyezát csúcs (2482 m) sziklás, kitett, kézhasználatos gerincén, ±1400 m. Vasárnap: Pietrele-völgyi vezetői kör a két vízeséssel és a Fenyvesek tavával, hazafelé Vajdahunyad vára. 6–8 fős kis csoport, fejlámpa kötelező, hegyi mentésre is érvényes utasbiztosítás szükséges. Részvételi díj: 59 000 Ft.",
  time:"szept. 11–13. · szombat 8–9 óra", reg:"https://hikentech.com/jelentkezesek/", src:"https://hikentech.com/retyezat-csucsi-es-tengerszemei/"},
  {id:"e15", name:"Elektromos kerékpártúra a Hagymás-hegységben", date:"2026-09-20", place:"Gyergyószentmiklós, Fő-tér", diff:"Nehéz",
  org:"Nagyhagymás Közösségek Közti Fejlesztési Társulás", people:6, cap:40, cat:"Kerékpáros túra", tour:"hagymas-bike", img:IMG.legifoto,
  desc:"Kezdés vasárnap 10:00-kor (EEST). Kiinduló: Gyergyószentmiklós főtere; cél: a Békényfői Kolping Tanya, ebéddel várva. Két útvonal: 51 km (technikásabb) és 40 km (könnyebb ereszkedők, a Fenyő-útja nyomvonalán). A Meggyes-hágó meredébb — ott tolás javasolt. E-bike ajánlott; bérelhető korlátozott számban (200 RON). Sisak kötelező. Részvétel ingyenes, regisztrációhoz kötött — a regisztrációban jelezendő a bringa típusa és a bérlési igény. Szervezők: Nagyhagymás KKT, E-bike tours Gyergyószentmiklós, a Hargita Megyei Hegyi- és Barlangimentő Közszolgálat közreműködésével.",
  time:"vasárnap 10:00 · ~1050 m szint",
  reg:"https://www.facebook.com/events/1588106432868506/", src:"https://www.facebook.com/events/1588106432868506/"},
  {id:"e16", name:"Nagy Mező-havas (Görgényi túra)", date:"2026-09-26", place:"Görgényi havasok", diff:"Közepes",
  org:"CsEKE — Csíkszéki Erdélyi Kárpát-Egyesület · Zsigmond Éva", people:0, cap:60, cat:"Vezetett túra", tour:"vert-to", img:IMG.erdo,
  desc:"A CsEKE éves túratervének őszi gyalogtúrája a Görgényi-havasok Nagy Mezőjére — 12 km, ~550 m szintemelkedés, könnyű-közepes tempó, csíki közösségi hangulat. Találkozó és részletek a szervező oldalon.",
  reg:"https://www.cseke.ro/index.php/esemenyek/nagy-mezo-havas-383", src:"https://www.cseke.ro/index.php/esemenyek/nagy-mezo-havas-383"},
  {id:"e17", name:"Őszi Kisbarangolók (gyerektúra)", date:"2026-09-27", place:"Csíki-havasok", diff:"Könnyű",
  org:"CsEKE — Kisbarangolók · Kosza-Bereczki Judit", people:0, cap:40, cat:"Családi túra", tour:"maria-ko", img:IMG.mezofeny,
  desc:"A CsEKE gyerekeknek szóló őszindító túrája: rövid, játékos, biztonságos ösvény a szülőkkel közös barangolásra — a Kisbarangolók sorozat következő állomása.",
  reg:"https://www.cseke.ro/index.php/esemenyek/oszi-kisbarangolok-384", src:"https://www.cseke.ro/index.php/esemenyek/oszi-kisbarangolok-384"},
  {id:"e18", name:"Istenszéke túra (Őszi Kelemen)", date:"2026-10-10", place:"Kelemen-havasok", diff:"Közepes",
  org:"CsEKE — Zsigmond Éva", people:142, cap:120, cat:"Teljesítménytúra", tour:"w16", img:IMG.hegylanc,
  desc:"A már hagyományos őszi Istenszéke túra a Kelemen-havasokban: 19 km, ~1100 m szint — komolyabb gyalog, gyönyörű kilátással a Rodos-tetőre és a gyimesi hágókra.",
  reg:"https://www.cseke.ro/index.php/esemenyek/oszi-isten-szeke-tura-385", src:"https://www.cseke.ro/index.php/esemenyek/oszi-isten-szeke-tura-385"},
  {id:"e19", name:"Honismereti túra (1 nap, busszal)", date:"2026-10-17", place:"Erdővidék", diff:"Könnyű",
  org:"CsEKE — Solti Imre és Ferencz Lóránd", people:0, cap:50, cat:"Vezetett túra", tour:"suhardu", img:IMG.kodos,
  desc:"Egy napos buszos honismereti túra az Erdővidék rejtett értékeihez templomokról, rétekről, helyi sorsokról — a CsEKE közösségi programja,könnyű gyalogokkal.",
  reg:"https://www.cseke.ro/index.php/esemenyek/honismereti-tura-1nap-busszal-399", src:"https://www.cseke.ro/index.php/esemenyek/honismereti-tura-1nap-busszal-399"}
];

/* ---------- BAKANCSLISTA-HELYEK ---------- */
const WISH = [
 {id:"w1", name:"Hargita-csúcs (1801 m)", cat:"Csúcsok", place:"Hargita", diff:"Nehéz", img:IMG.hegylanc, lat:46.5700, lng:25.4900},
 {id:"w2", name:"Csukás-tető napkelte", cat:"Napkelte helyek", place:"Gyergyó", diff:"Közepes", img:IMG.napfel, lat:46.9976, lng:25.8544},
 {id:"w3", name:"Szakadát-vízesés", cat:"Vízesések", place:"Gyergyó", diff:"Könnyű", img:IMG.vizases, lat:46.9900, lng:25.8300},
 {id:"w4", name:"Gyilkos-tó (Lacu Roșu)", cat:"Tavak", place:"Gyergyó", diff:"Könnyű", img:IMG.tavi_tukor, lat:46.9986, lng:25.8648},
 {id:"w5", name:"Gyimesi vadvölgy", cat:"Erdők", place:"Csík", diff:"Nehéz", img:IMG.erdo, lat:46.5100, lng:25.8400},
 {id:"w6", name:"Székelyföld-kör gyalog", cat:"Többnapos túrák", place:"Székelyföld", diff:"Nehéz", img:IMG.zaraz, lat:46.6000, lng:25.7000},
 {id:"w7", name:"Solymos-kő orgonái", cat:"Csúcsok", place:"Gyergyó", diff:"Nehéz", img:IMG.tzo_tav, lat:47.0020, lng:25.8400},
 {id:"w8", name:"Csukás-vízesés", cat:"Vízesések", place:"Gyergyó", diff:"Közepes", img:IMG.vizases, lat:46.6870, lng:25.8940},
 {id:"w9", name:"Tengerszem-tó a Görgényben", cat:"Tavak", place:"Görgény", diff:"Közepes", img:IMG.lenyes, lat:46.6550, lng:25.1520},
 {id:"w10", name:"Torockói-kő (Piatra Secuiului)", cat:"Csúcsok", place:"Erdélyi-karszt", diff:"Nehéz", img:IMG.kodos, lat:46.7068, lng:23.0720},
 {id:"w11", name:"Cetatea-marostető naplemente", cat:"Napkelte helyek", place:"Hargita", diff:"Könnyű", img:IMG.napnyugta, lat:45.8780, lng:26.0280},
 {id:"w12", name:"Görgény vadonvölgyei", cat:"Erdők", place:"Görgény", diff:"Nehéz", img:IMG.volgy, lat:46.7500, lng:25.0500},
 {id:"w13", name:"Fekete-Hagymás reggeli ködje", cat:"Napkelte helyek", place:"Gyergyó", diff:"Közepes", img:IMG.mezofeny, lat:46.8350, lng:25.6480},
 {id:"w14", name:"Borzavár-vízesés", cat:"Vízesések", place:"Maros", diff:"Nehéz", img:IMG.vizases, lat:46.5780, lng:25.1900},
 {id:"w15", name:"Bâlea-tó (Fogarasi-tó)", cat:"Tavak", place:"Fogaras", diff:"Közepes", img:IMG.tzo_tav, lat:45.6044, lng:24.7184},
 {id:"w16", name:"Kelemen-havasok: Zsil-völgyi gerinc", cat:"Többnapos túrák", place:"Beszterce", diff:"Nehéz", img:IMG.csillagos, lat:47.0100, lng:25.3600}
];
const WISH_CATS = [{icon:"🏔️", name:"Csúcsok"},{icon:"🌄", name:"Napkelte helyek"},{icon:"💧", name:"Vízesések"},
  {icon:"🏞️", name:"Tavak"},{icon:"🌲", name:"Erdők"},{icon:"🏕️", name:"Többnapos túrák"}];

/* ---------- FELSZERELÉS SZABLONOK ---------- */
const GEAR_BASE = [
 {n:"Túrahátizsák (25–35 l)", c:"Hátizsák", i:"🎒"}, {n:"Túrabakancs", c:"Bakancs", i:"🥾"},
 {n:"Víz (bőven, 2 l)", c:"Ivó", i:"💧"}, {n:"Elsősegélycsomag", c:"Biztonság", i:"⛑️"},
 {n:"Zsebkés / multitool", c:"Egyéb", i:"🔪"}, {n:"Napszemüveg és naptej", c:"Védő", i:"🧴"},
 {n:"Réteges öltözet", c:"Öltözet", i:"🧥"}, {n:"Offline térkép a telefonon", c:"Navigáció", i:"🗺️"}
];
const GEAR_RULES = [
 {if:"h>4", items:[{n:"Fejlámpa + tartalék elem", c:"Egyéb", i:"🔦"}, {n:"Készlet víz (2 l)", c:"Ivó", i:"💧"}, {n:"Gyors energia (energia-szelet, mogyoró)", c:"Étel", i:"🍫"}]},
 {if:"diff>=3", items:[{n:"Túrabot", c:"Egyéb", i:"🦯"}, {n:"Erős talpú bakancs", c:"Bakancs", i:"🥾"}, {n:"Elektrolit italpor", c:"Ivó", i:"🧂"}]},
 {if:"rain", items:[{n:"Esőkabát", c:"Öltözet", i:"🧥"}, {n:"Hátizsák-vízhuzat", c:"Hátizsák", i:"🎒"}, {n:"Váltó zokni", c:"Öltözet", i:"🧦"}]},
 {if:"summer", items:[{n:"Naptej", c:"Védő", i:"🧴"}, {n:"Fejfedő / sapka", c:"Védő", i:"🧢"}, {n:"Szúnyog- és kullancsriasztó", c:"Védő", i:"🦟"}]},
 {if:"winter", items:[{n:"Meleg kabát", c:"Öltözet", i:"🧥"}, {n:"Sapka + nyakmelegítő", c:"Öltözet", i:"🧢"}, {n:"Hógázló (microspikes)", c:"Egyéb", i:"⛓️"}, {n:"Termosz forró itallal", c:"Étel", i:"☕"}]},
 {if:"summit", items:[{n:"Könnyű kabát (a tetőn hűvös van)", c:"Öltözet", i:"🧥"}, {n:"Szélkabát", c:"Öltözet", i:"🧥"}]},
 {if:"napkelte", items:[{n:"Meleg réteg (a tetőn hideg van)", c:"Öltözet", i:"🧥"}, {n:"Fejlámpa", c:"Egyéb", i:"🔦"}, {n:"Termosz kávé", c:"Étel", i:"☕"}]},
 {if:"days>1", items:[{n:"Sátor", c:"Sátor", i:"⛺"}, {n:"Hálózsák", c:"Egyéb", i:"🛌"}, {n:"Hordógáz + kis főző", c:"Étel", i:"🍳"}, {n:"Kiegészítő akkumulátor", c:"Egyéb", i:"🔋"}, {n:"Szúnyogháló", c:"Sátor", i:"🕸️"}]},
 {if:"éjszaka", items:[{n:"Fejlámpa + tartalék elem", c:"Egyéb", i:"🔦"}, {n:"Hősugárzó fólia", c:"Biztonság", i:"🪙"}, {n:"Reflektorfény", c:"Biztonság", i:"✨"}]},
 {if:"kerékpár", items:[{n:"Sisak", c:"Egyéb", i:"🪖"}, {n:"Belsőgumi-javító szett", c:"Egyéb", i:"🔧"}, {n:"Kerékpáros kesztyű", c:"Öltözet", i:"🧤"}]},
 {if:"fotó", items:[{n:"Állvány", c:"Egyéb", i:"📷"}, {n:"Tisztító kendő", c:"Egyéb", i:"🧻"}, {n:"Extra akku és memóriakártya", c:"Egyéb", i:"🧭"}]}
];
const GEAR_OWN_CATS = ["Bakancs","Hátizsák","Kabát","Fejlámpa","Túrabot","Sátor","Hálózsák","Ivókanna","Egyéb"];
const FOOD_TEMPLATE = h => {
  const arr = [{n:"Szendvics", i:"🥪", checked:false}, {n:"Banán", i:"🍌", checked:false}];
  if (h>=3) arr.push({n:"Energia-szelet, mogyoró", i:"🍫", checked:false});
  if (h>=5) arr.push({n:"Meleg étel a túra végére / termosz", i:"🍲", checked:false});
  return arr;
};
const waterFor = h => Math.min(4, Math.max(1, Math.round(h/2)));

const TIMELINE_TPL = [
 {t:"06:00", l:"Indulás hazulról", ty:"utazás"}, {t:"07:30", l:"Helyszínre érkezés, parkolás", ty:"utazás"},
 {t:"08:00", l:"Túra kezdése a jelzett útvonalon", ty:"tura"}, {t:"10:00", l:"Rövid pihenő, snack a patakparton", ty:"pihenő"},
 {t:"12:00", l:"Csúcspont / kilátópont", ty:"tura"}, {t:"13:00", l:"Ebéd a tető alatti tisztáson", ty:"pihenő"},
 {t:"15:30", l:"Visszaérkezés a parkolóba", ty:"tura"}, {t:"16:30", l:"Hazaindulás", ty:"utazás"}
];
const SAFETY = [
 {n:"Telefon feltöltve, powerbank a táskában"}, {n:"Offline térkép letöltve a területre"},
 {n:"Valaki tudja, merre mész és mikor térsz haza"}, {n:"Időjárás ellenőrizve indulás előtt"},
 {n:"Megfelelő felszerelés bepakkolva"}, {n:"Sípos, világítóeszköz elérő helyen"},
 {n:"Készlet ivóvíz és uzsonna bőven"}
];

/* ============ BŐVÍTÉSEK ============ */
const STATUSES = {
  "ötlet":{ico:"💡", label:"Ötlet", cls:"chip-sand"}, "bakancs":{ico:"❤️", label:"Bakancslistán", cls:"chip-green"},
  "tervezés":{ico:"🟡", label:"Tervezés alatt", cls:"chip-blue"}, "közelgő":{ico:"🔵", label:"Közelgő", cls:"chip-blue"},
  "folyamatban":{ico:"🚩", label:"Folyamatban", cls:"chip-ember"},
  "teljesítve":{ico:"🟢", label:"Teljesítve", cls:"chip-green"}, "archiválva":{ico:"📖", label:"Archiválva", cls:"chip-sand"},
  "jelentkezve":{ico:"🎫", label:"Eseményre jelentkezve", cls:"chip-ember"}
};
const statusFlow = ["ötlet","bakancs","tervezés","közelgő","teljesítve","archiválva"];

const WEIGHT_GUESS = {"Túrahátizsák (25–35 l)":1400,"Túrabakancs":1250,"Víz (bőven, 2 l)":2000,"Elsősegélycsomag":250,
 "Zsebkés / multitool":120,"Napszemüveg és naptej":150,"Réteges öltözet":600,"Offline térkép a telefonon":200,
 "Fejlámpa + tartalék elem":110,"Készlet víz (2 l)":2000,"Gyors energia (energia-szelet, mogyoró)":200,
 "Túrabot":480,"Erős talpú bakancs":1250,"Elektrolit italpor":120,"Esőkabát":380,"Hátizsák-vízhuzat":120,
 "Váltó zokni":150,"Naptej":110,"Fejfedő / sapka":80,"Szúnyog- és kullancsriasztó":80,"Meleg kabát":700,
 "Sapka + nyakmelegítő":140,"Hógázló (microspikes)":420,"Termosz forró itallal":450,"Könnyű kabát (a tetőn hűvös van)":320,
 "Szélkabát":380,"Meleg réteg (a tetőn hideg van)":520,"Termosz kávé":480,"Sátor":1900,"Hálózsák":1100,
 "Hordógáz + kis főző":680,"Kiegészítő akkumulátor":240,"Szúnyogháló":90,"Hősugárzó fólia":60,"Reflektorfény":140,
 "Sisak":280,"Belsőgumi-javító szett":180,"Kerékpáros kesztyű":90,"Állvány":520,"Tisztító kendő":40,
 "Extra akku és memóriakártya":90,"Szendvics":220,"Banán":120,"Energia-szelet, mogyoró":90,
 "Meleg étel a túra végére / termosz":400,"Víz":500,"Powerbank":220};

const TEMPLATES_DEFAULT = [
  {id:"tpl-rovid", icon:"🌲", name:"Rövid túra", desc:"2–4 óra, easy körtúra Naplementében", hours:3, difficulty:"Könnyű", days:1,
   gear:[{n:"Bakancs",c:"Bakancs",w:900,i:"🥾"},{n:"Hátizsák 20 l",c:"Hátizsák",w:900,i:"🎒"},{n:"Víz 1,5 l",c:"Ivókanna",w:1500,i:"💧"},{n:"Uzsonna",c:"Étel",w:350,i:"🥪"},{n:"Fejlámpa",c:"Electronika",w:90,i:"🔦"},{n:"Kesztyű+sapka",c:"Meleg",w:160,i:"🧤"}],
   timeline:[{t:"09:00",l:"Indulás a parkolóból"},{t:"09:20",l:"Erdőszél — tempó"},{t:"10:10",l:"Nyereg / pihenő"},{t:"10:45",l:"Kilátópont — uzsonna"},{t:"11:45",l:"Vissza a parkolóhoz"}],
   food:["Víz 1,5 l","Szendvics","Banán vagy mogyoró"],
   tasks:["Terepjelzés frissítése (Terepi infók)","Időjárás-ellenőrzés","Csoporttal egyeztetett találkozó"]},
  {id:"tpl-egynapos", icon:"🥾", name:"Egynapos hegyi túra", desc:"6–8 óra, szinttel bíró gerinctúra", hours:7, difficulty:"Közepes", days:1,
   gear:[{n:"Bakancs",c:"Bakancs",w:1100,i:"🥾"},{n:"Hátizsák 30 l",c:"Hátizsák",w:1300,i:"🎒"},{n:"Túrabot",c:"Túrabot",w:480,i:"🦯"},{n:"Szélkabát",c:"Kabát",w:320,i:"🧥"},{n:"Mezbáska+elem",c:"Electronika",w:120,i:"🔋"},{n:"Elsősegély",c:"Elsősegély",w:240,i:"⛑️"}],
   timeline:[{t:"07:00",l:"Indulás — felkészülés"},{t:"07:30",l:"Erdőszél: ritmus"},{t:"09:00",l:"Nyereg — ivás"},{t:"10:30",l:"Csúcs — fotó"},{t:"11:30",l:"Leereszkedés pihenőkkel"},{t:"14:00",l:"Parkoló"},{t:"14:30",l:"Víz és csoki"}],
   food:["Víz 2–3 l","Két uzsonna","Sós+mogyoró", "Gyümölcs"],
   tasks:["Cipzállás, bakancs status ellenőrzés","Időjárás ablak (csúcsidő)","Föltöltött telefon + szájviz"]},
  {id:"tpl-napkelte", icon:"🌄", name:"Napfelkelte túra", desc:"Sötét indulás, fény a tetőn", hours:3.5, difficulty:"Könnyű", days:1,
   gear:[{n:"Fejlámpa + pótelelem",c:"Electronika",w:150,i:"🔦"},{n:"Meleg kabát",c:"Kabát",w:650,i:"🧥"},{n:"Kanna forró teába",c:"Ivókanna",w:800,i:"♨️"},{n:"Csúszásgátló",c:"Egyéb",w:180,i:"🩹"}],
   timeline:[{t:"03:30",l:"Ébresztő, sötét indulás fejlámpával"},{t:"04:40",l:"Nyereg — égzás figyelése"},{t:"05:20",l:"Kilátópont — napkelte"},{t:"06:30",l:"Visszaérkezés"},{t:"07:00",l:"Búza"}],
   food:["Forró tea/kávé","Szendvics","Csoki"],
   tasks:["Napkelte időpont ellenőrzés a hegyen","Zászlóidő: korai kelés ébresztő"]},
  {id:"tel-eli", icon:"❄️", name:"Téli túra", desc:"Hó, hideg, korábban sötét", hours:4, difficulty:"Közepes", days:1,
   gear:[{n:"Hótalp/microspike",c:"Egyéb",w:380,i:"🧊"},{n:"Meleg zsebek és sapka",c:"Meleg",w:220,i:"🧤"},{n:"Termosz",c:"Ivókanna",w:500,i:"♨️"},{n:"Túrabot",c:"Túrabot",w:480,i:"🦯"},{n:"Vésztakaró",c:"Elsősegély",w:90,i:"🆘"}],
   timeline:[{t:"08:00",l:"Hó- és lawinainfó",ty:"terep"},{t:"08:30",l:"Indulás"},{t:"10:30",l:"Fordulási időpont — nem bízunk a szerencsére"},{t:"12:30",l:"Vissza bemelegítéssel"}],
   food:["Forró tea","Magas kalóriájú energia (csoki, dió)","Kesztyűbelső"],
   tasks:["Hó- és lavinajelentés","Rövidebb nappal: hazaérkezés sötét előtt","Töltött telefon, meztartás"]},
  {id:"tpl-szallopo", icon:"🏕️", name:"Többnapos túra (sátorozós)", desc:"2–4 nap, szállítás sátorral", hours:6, difficulty:"Nehéz", days:3,
   gear:[{n:"Sátor",c:"Sátor",w:2400,i:"⛺"},{n:"Hálózsák",c:"Hálózsák",w:1200,i:"🛌"},{n:"Mafat és matrac",c:"Sátor",w:700,i:"🍲"},{n:"Gáztűzhely",c:"Főzés",w:400,i:"🔥"},{n:"Vízszűrő",c:"Ivókanna",w:90,i:"💧"}],
   timeline:[{t:"07:30",l:"Bontás, tábor összekészítés"},{t:"08:30",l:"Napi táv — közép: pihenők"},{t:"15:00",l:"Táborverés: sátor, víz, főzés"},{t:"19:30",l:"Esti egyeztetés holnapra"}],
   food:["Napi 2–3 étkezés zacskós/alap", "Vízterv forrásokat számolva", "Nasi útközben"],
   tasks:["Vízforrások a területen","Időjárás 3 napos távban","Társak és teherelosztás egyeztetése","Táborozási engedély"]},
  {id:"tpl-ejo", icon:"🍷", name:"Szüreti / kulturális séta", desc:"Laza, falusi, esős időjárásbiztos", hours:2.5, difficulty:"Könnyű", days:1,
   gear:[{n:"Könnyű cipő",c:"Bakancs",w:600,i:"👟"},{n:"Napelemes táska esőre",c:"Kabát",w:300,i:"☂️"},{n:"Telefon + térkép",c:"Navigálás",w:220,i:"🗺️"}],
   timeline:[{t:"15:00",l:"Találkozó a faluközpontban"},{t:"15:20",l:"Pince-sor / műemlékek"},{t:"16:30",l:"Kilátó domb"},{t:"17:30",l:"Közös vacsora"}],
   food:["Víz","Szüreti tízóraija","Közbenső"],
   tasks:["Időszak rendezvény — nyitvatartás","Asztalfoglalás (ha kell)"]}
];


/* ---------- TEREPRI JELENTŐK (közösségi, böngészőben tárolt) ---------- */
const TEREP_TYPES = [
 {v:"Állatészlelés", i:"🐻"}, {v:"Kidőlt fa", i:"🌲"}, {v:"Lezárt útvonal", i:"🚧"}, {v:"Kiszáradt forrás", i:"💧"},
 {v:"Problémás kutyák", i:"🐕"}, {v:"Jeges szakasz", i:"❄️"}, {v:"Sáros út", i:"🌧️"}, {v:"Egyéb akadály", i:"⚠️"}
];
const TEREP_DEMO = [
  
];

const GOAL_METRICS = { km:"km", tours:"túra", summits:"csúcs", napkelte:"napkelte-túra", wish:"bakancslista-hely" };
/* A Nagyhagymás KKT interaktív túraútvonal-adatai (forrás: adinagyhagymas.ro) */
const HAGYMAS_ROUTES = [
 {t:"bringa", n:"MTB-Panoráma", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB-Panor%C3%A1ma.gpx"},
 {t:"bringa", n:"MTB_Balánbánya_Gyergyókm4", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB_Bal%C3%A1nb%C3%A1nya_Gyergy%C3%B3km4.gpx"},
 {t:"bringa", n:"MTB_Balánbánya_Hidegség_Hosszúréz_Háromkút", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB_Bal%C3%A1nb%C3%A1nya_Hidegs%C3%A9g_Hossz%C3%BAr%C3%A9z_H%C3%A1romk%C3%BAt.gpx"},
 {t:"bringa", n:"MTB_Balánbánya_SúgóBarlang", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB_Bal%C3%A1nb%C3%A1nya_S%C3%BAg%C3%B3Barlang.gpx"},
 {t:"bringa", n:"MTB_Marosfő_Szenttamás", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB_Marosf%C5%91_Szenttam%C3%A1s.gpx"},
 {t:"bringa", n:"MTB_Szenttamás_CsíkiHavasok_SötétVölgyELágazás", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/bycicle_routes/hu/MTB_Szenttam%C3%A1s_Cs%C3%ADkiHavasok_S%C3%B6t%C3%A9tV%C3%B6lgyEL%C3%A1gaz%C3%A1s.gpx"},
 {t:"tura", n:"D10_GyilkostoGyilkoskilato", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D10_GyilkostoGyilkoskilato.gpx"},
 {t:"tura", n:"D11_GyilkostoHaromkutJuhpatak", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D11_GyilkostoHaromkutJuhpatak.gpx"},
 {t:"tura", n:"D12_GyilkostoJuhpatakFehermezo", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D12_GyilkostoJuhpatakFehermezo.gpx"},
 {t:"tura", n:"D13_GyilkostoKerekkoFehermezo", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D13_GyilkostoKerekkoFehermezo.gpx"},
 {t:"tura", n:"D14_GyilkostoKisbekas", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D14_GyilkostoKisbekas.gpx"},
 {t:"tura", n:"D15_GyilkostoLikas", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D15_GyilkostoLikas.gpx"},
 {t:"tura", n:"D16_GyilkostoKorul", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D16_GyilkostoKorul.gpx"},
 {t:"tura", n:"D17_GyilkostoCzifranyeregGyoparV", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D17_GyilkostoCzifranyeregGyoparV.gpx"},
 {t:"tura", n:"D18_Gyopár villa - Lapos-szoros - Kupás nyaka", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D18_Gyop%C3%A1r%20villa%20-%20Lapos-szoros%20-%20Kup%C3%A1s%20nyaka.gpx"},
 {t:"tura", n:"D19_Heveder_FeketeRez_Balánbánya", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D19_Heveder_FeketeRez_Bal%C3%A1nb%C3%A1nya.gpx"},
 {t:"tura", n:"D1_BalanbanyaEgyeskoKekcsik", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D1_BalanbanyaEgyeskoKekcsik.gpx"},
 {t:"tura", n:"D20_KisCOhard", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D20_KisCOhard.gpx"},
 {t:"tura", n:"D21_KupaspatakKupasmezeje", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D21_KupaspatakKupasmezeje.gpx"},
 {t:"tura", n:"D22_KupasLikaspusztaNyerges", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D22_KupasLikaspusztaNyerges.gpx"},
 {t:"tura", n:"D23_Marosfő - Fekete-rez pusztája - Súgó barlang", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D23_Marosf%C5%91%20-%20Fekete-rez%20puszt%C3%A1ja%20-%20S%C3%BAg%C3%B3%20barlang.gpx"},
 {t:"tura", n:"D24_Marosfo_Feketerez_Kovacspeter_Meggyes", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D24_Marosfo_Feketerez_Kovacspeter_Meggyes.gpx"},
 {t:"tura", n:"D26_Marosfő - Gréces", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D26_Marosf%C5%91%20-%20Gr%C3%A9ces.gpx"},
 {t:"tura", n:"D27_TatarhavasPongracNagyhagymas", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D27_TatarhavasPongracNagyhagymas.gpx"},
 {t:"tura", n:"D28_VinklipusztaGyoparV", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D28_VinklipusztaGyoparV.gpx"},
 {t:"tura", n:"D2_BalanbanyaMeggyespatakTork", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D2_BalanbanyaMeggyespatakTork.gpx"},
 {t:"tura", n:"D4_Fekete-rez - Súgó barlang - Sípos kő", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D4_Fekete-rez%20-%20S%C3%BAg%C3%B3%20barlang%20-%20S%C3%ADpos%20k%C5%91.gpx"},
 {t:"tura", n:"D5_Gyergyó4km_Kovacspeter_Vaspatar_Fehermezo", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D5_Gyergy%C3%B34km_Kovacspeter_Vaspatar_Fehermezo.gpx"},
 {t:"tura", n:"D62_Gyergyo4km_Kovacspeter", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D62_Gyergyo4km_Kovacspeter.gpx"},
 {t:"tura", n:"D6_Gyergyo_Borzoka_Gyergyo", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D6_Gyergyo_Borzoka_Gyergyo.gpx"},
 {t:"tura", n:"D7_Gyergyó - Sípos kő", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D7_Gyergy%C3%B3%20-%20S%C3%ADpos%20k%C5%91.gpx"},
 {t:"tura", n:"D8_Gyergyo_SugoBarlang_Vaslab", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D8_Gyergyo_SugoBarlang_Vaslab.gpx"},
 {t:"tura", n:"D95_GalkutjaTerko", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D95_GalkutjaTerko.gpx"},
 {t:"tura", n:"D96_BalanbanyaEgyeskoPirosH", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D96_BalanbanyaEgyeskoPirosH.gpx"},
 {t:"tura", n:"D97_EgyeskoVigyazo", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D97_EgyeskoVigyazo.gpx"},
 {t:"tura", n:"D9_GyilkoskilatoGyilkosForras", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/routes/hu/D9_GyilkoskilatoGyilkosForras.gpx"},
 {t:"esztena", n:"Esztenak", url:"https://adinagyhagymas.leadingsoft.eu/api/map-file/sheepfolds/hu/Esztenak.kml"}
];
const HAGYMAS_MAP_URL = 'https://adinagyhagymas.ro/interaktiv-turautvonalak/';


/* —— SZATT 2026 (Szent Anna-tó Teljesítménytúra, CsEKE) — szatt.cseke.ro ——— */
const SZATT = {
  date:"2026-09-12", location:"Lázárfalvi Nyírfürdő (Lázárfalva)", lat:46.1883, lng:25.9465,
  site:"https://szatt.cseke.ro/", reg:"https://szatt.cseke.ro/regisztracio",
  tudnyivalok:"https://szatt.cseke.ro/tudnivalok", archive:"https://szatt.cseke.ro/archivum",
  phone:"+40 757 546 901", email:"info@cseke.ro",
  history:[{y:2024,foven:72},{y:2023,foven:365},{y:2021,foven:305}],
  tavok:[
    {n:"Szent Anna-tó kör (10 km)", km:10, up:302, h:3, rajt:"10:00", diff:"Könnyű",
     gpx:"https://szatt.cseke.ro/storage/tt-hikes/801/szatt-2026-10km.gpx", pdf:"https://szatt.cseke.ro/turak/1/pdf", detail:"https://szatt.cseke.ro/turak/1"},
    {n:"Mohos-perem (16 km)", km:16, up:365, h:5, rajt:"09:00", diff:"Közepes",
     gpx:"https://szatt.cseke.ro/storage/tt-hikes/635/szatt-2026-16km.gpx", pdf:"https://szatt.cseke.ro/turak/2/pdf", detail:"https://szatt.cseke.ro/turak/2"},
    {n:"Bálványos-kihívás (40 km)", km:40, up:1500, h:12, rajt:"07:00", diff:"Nehéz",
     gpx:"https://szatt.cseke.ro/storage/tt-hikes/636/szatt-2026-40km.gpx", pdf:"https://szatt.cseke.ro/turak/3/pdf", detail:"https://szatt.cseke.ro/turak/3"}
  ]
};

/* ==== store ==== */
/* ============================================================
   TÚRAVAROS — TÁROLÓ RÉTEG
   localStorage-alapú adatbázis: regisztráció, bejelentkezés,
   felhasználónként elkülönített adatok, túra-modell, értesítések,
   statisztikák és a szabályalapú AI Túratervező.
   
   ============================================================ */
"use strict";
const Store = (() => {
  const KEY = "turavaros_v1";
  let db = null;

  /* ---------- segédek ---------- */
  const uid = p => (p||"id") + "_" + Math.random().toString(36).slice(2,9);
  const hash = s => { let h=5381; for(const c of s) h=(h*33^c.charCodeAt(0))>>>0; return "h"+h.toString(36); };
  const todayISO = () => new Date().toISOString().slice(0,10);
  const addDays = (iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
  const dayDiff = iso => !iso ? 999 : Math.round((new Date(iso+"T12:00:00") - new Date(todayISO()+"T12:00:00"))/864e5);
  const count = (a,f)=>a.filter(f).length;
  function nextSatDate(){ const d=new Date(); const add=(6-d.getDay()+7)%7||7; d.setDate(d.getDate()+add); return d.toISOString().slice(0,10); }

  function load(){
    try{ db = JSON.parse(localStorage.getItem(KEY)); }catch(e){ db=null; }
    if(!db){ db = { users:{}, data:{}, session:null }; save(); }
  }
  function save(){ localStorage.setItem(KEY, JSON.stringify(db)); }

  const me = () => db.session ? db.users[db.session] : null;
  function blankUserData(){ return { tours:[], wishlist:[], savedEvents:[], equipment:[], journal:[], teams:[],
    goals:{km:300, tours:12, summits:3}, goalList:null, notifDismiss:[], prefs:{weather:true, reminders:true}, aiChat:[],
    templates:[], terepi:[], reportAck:{}, challenges:null, widgets:null }; }
  function ensureExtras(d){
    if(!d) return d;
    if(!d.templates) d.templates=[]; if(!d.terepi) d.terepi=[]; if(!d.reportAck) d.reportAck={};
    if(!d.goalList) d.goalList = [
      {id:uid("g"), icon:"🥾", label:"km túrázva idén", metric:"km", target:300, unit:"km"},
      {id:uid("g"), icon:"🏔️", label:"új csúcs", metric:"summits", target:10, unit:"db"},
      {id:uid("g"), icon:"🌄", label:"napfelkelte túra", metric:"napkelte", target:3, unit:"db"}];
    // Challenges are user-owned records. Do not seed fabricated/demo entries,
    // and remove the legacy seeded challenge IDs from existing local data.
    if(!d.challenges) d.challenges = [];
    if(Array.isArray(d.challenges)) d.challenges = d.challenges.filter(x => !/^ch[123]$/.test(String(x&&x.id||"")));
    if(!d.inbox) d.inbox=[];
    if(!d.widgets) { d.widgets = ["hub","readi","quick","sun","inbox","recent","chall","recs","goal","cal","memory","terep","tools","tiles"]; }    if(!d.widgets.includes("recent")) { const si=d.widgets.indexOf("sun"); d.widgets.splice(si>=0?si+1:4,0,"recent"); }

    else { if(!d.widgets.includes("sun")) d.widgets.splice(1,0,"sun"); if(!d.widgets.includes("tools")) d.widgets.splice(3,0,"tools"); if(!d.widgets.includes("chall")) d.widgets.splice(1,0,"chall"); }
    { const PRI=["hub","readi","quick","sun","inbox"]; const pre=d.widgets.filter(x=>PRI.includes(x)).sort((a,b)=>PRI.indexOf(a)-PRI.indexOf(b)); d.widgets=pre.concat(d.widgets.filter(x=>!PRI.includes(x))); }
    (d.tours||[]).forEach(t=>{ (t.gear||[]).forEach(g=>{ if(!g) return; if(g.w==null) g.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[g.name]) || 900; });
      (t.food||[]).forEach(f=>{ if(f.w==null) f.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[f.n]) || 250; }); });
    (d.equipment||[]).forEach(e=>{ if(e.w==null) e.w = (typeof WEIGHT_GUESS!=="undefined" && WEIGHT_GUESS[e.name]) || 900; });
    return d;
  }
  const myData = () => { const u=me(); if(!u) return null; db.data[u.id] ||= blankUserData(); return ensureExtras(db.data[u.id]); };
  function platform(){ if(!db.platform) db.platform={ organizers:[], events:[], participants:[] }; return db.platform; }
  function community(){ if(!db.community) db.community={ profiles:[], connections:[], invites:[], notifs:[] }; return db.community; }
  function userDataOf(uidOrKey){ if(db.data[uidOrKey]) return db.data[uidOrKey]; for(const k in db.data){} const u=userByAny(uidOrKey); return u? (db.data[u.id]||null) : null; }
  function findTourAnywhere(id){ for(const k in db.data){ const t=(db.data[k].tours||[]).find(x=>x.id===id); if(t) return {tour:t, owner:k, email:(db.users[k]&&db.users[k].email)||k, data:db.data[k]}; } return null; }
  function userByAny(q){ for(const k in db.users){ const u=db.users[k]; if(u.id===q||u.email===q) return u; } return null; }
  function allUserDataIds(){ return Object.keys(db.data); }

  /* ---------- AUTH ---------- */
  function signup(name, email, pass, city){
    email = email.trim().toLowerCase();
    if(Object.values(db.users).some(u=>u.email===email)) return {err:"Ezzel az e-mail-címmel már regisztráltak."};
    const id = uid("u");
    db.users[id] = { id, name:name.trim(), email, pass:hash(pass), city:(city||"").trim(), onboarded:false, joined:todayISO() };
    db.data[id] = blankUserData(); ensureExtras(db.data[id]);
    db.session = id; save();
    return {ok:true, user:db.users[id]};
  }
  function changePassword(oldp, newp){
    const u = me(); if(!u) return {err:"Nincs bejelentkezett felhasználó."};
    if(u.pass !== hash(oldp)) return {err:"A jelenlegi jelszó hibás."};
    if(!newp || newp.length < 8) return {err:"Az új jelszónak legalább 8 karakter hosszúnak kell lennie."};
    if(!/[0-9]/.test(newp) || !/[a-zA-Z]/.test(newp)) return {err:"Az új jelszóban legyen betű és szám is."};
    u.pass = hash(newp); save(); return {ok:true};
  }
  function login(email, pass){
    email = email.trim().toLowerCase();
    const u = Object.values(db.users).find(x=>x.email===email);
    if(!u || u.pass!==hash(pass)) return {err:"Hibás e-mail vagy jelszó."};
    db.session = u.id; save(); return {ok:true, user:u};
  }
  /* Cloud Auth után a helyi Store ugyanazt a felhasználót és adatmodellt használja.
     Ez nem új auth-rendszer: csak egy Supabase-identitás helyi projekciója, hogy
     a V117.1 funkciói offline és cloud session mellett is változatlanul fussanak. */
  function adoptCloudUser(profile){
    profile = profile || {};
    const email = String(profile.email||"").trim().toLowerCase();
    if(!email) return {err:"Hiányzó cloud e-mail-cím."};
    let u = Object.values(db.users).find(x=>x.email===email);
    if(!u){
      const id = uid("u");
      u = { id, name:String(profile.name||"Túrázó").trim()||"Túrázó", email,
        pass:"cloud:"+(profile.uid||id), city:String(profile.city||"").trim(),
        onboarded:false, joined:todayISO(), cloudUid:profile.uid||null };
      db.users[id]=u; db.data[id]=blankUserData(); ensureExtras(db.data[id]);
    } else {
      if(profile.name && (!u.name || u.name==="Túrázó")) u.name=String(profile.name).trim();
      if(profile.city && !u.city) u.city=String(profile.city).trim();
      if(profile.uid) u.cloudUid=profile.uid;
      db.data[u.id] ||= blankUserData(); ensureExtras(db.data[u.id]);
    }
    db.session=u.id; save(); return {ok:true,user:u};
  }
  function cloudProfile(){
    const u=me(); if(!u) return null;
    const email=String(u.email||"").toLowerCase();
    const p=community().profiles.find(x=>x.uid===email)||{};
    const prefs=u.prefsOnb||{};
    const hp={
      types:Array.isArray(p.types)?p.types.slice():((u.prefsOnb&&u.prefsOnb.types)||[]),
      regions:Array.isArray(p.regions)?p.regions.slice():((u.prefsOnb&&u.prefsOnb.regions)||[]),
      exp:p.exp||(prefs.exp||"Kezdő"),
      len:p.len||(prefs.len||"Változó"),
      avail:p.avail!==false,
      from:prefs.from||u.city||"",
      freq:prefs.freq||"", diff:prefs.diff||"", radius:prefs.radius||""
    };
    return { display_name:u.name||"Túrázó", avatar_url:p.av||null, bio:u.bio||p.bio||null,
      city:u.city||null, hiking_profile:hp, is_discoverable:p.isDiscoverable===true };
  }
  function adoptCloudProfile(profile){
    const u=me(); if(!u||!profile) return {err:"Nincs helyi felhasználó."};
    if(profile.display_name) u.name=String(profile.display_name).trim()||u.name;
    if(profile.city!=null) u.city=String(profile.city||"").trim();
    if(profile.bio!=null) u.bio=String(profile.bio||"");
    const hp=profile.hiking_profile&&typeof profile.hiking_profile==="object"?profile.hiking_profile:{};
    const email=String(u.email||"").toLowerCase();
    const c=community(); let p=c.profiles.find(x=>x.uid===email);
    if(!p){ p={uid:email,av:"",name:u.name||"Túrázó",bio:"",types:[],regions:[],exp:"Kezdő",len:"Változó",avail:true,demo:false,createdAt:profile.created_at||new Date().toISOString()}; c.profiles.push(p); }
    p.cloudUid=profile.user_id||p.cloudUid||null;
    if(profile.avatar_url!=null) p.av=String(profile.avatar_url||"");
    if(profile.bio!=null) p.bio=String(profile.bio||"");
    if(Array.isArray(hp.types)) p.types=hp.types.slice();
    if(Array.isArray(hp.regions)) p.regions=hp.regions.slice();
    if(hp.exp!=null) p.exp=String(hp.exp);
    if(hp.len!=null) p.len=String(hp.len);
    if(hp.avail!=null) p.avail=!!hp.avail;
    p.isDiscoverable=profile.is_discoverable===true;
    if(Object.keys(hp).length){ u.prefsOnb=Object.assign(u.prefsOnb||{},hp); }
    save(); return p;
  }
  const logout = () => { db.session=null; save(); };
  function updateProfile(patch){ const u=me(); if(!u) return; Object.assign(u,patch); save(); }
  function setPrefs(p){ const u=me(); if(!u) return; u.prefsOnb = Object.assign(u.prefsOnb||{}, p); if(p.onboarded!==undefined) u.onboarded=!!p.onboarded; save(); }

  /* ---------- TÚRA-MODELL ---------- */
  function recommendGear(tour, weatherRain){
    const mon = tour.date ? new Date(tour.date+"T12:00:00").getMonth()+1 : new Date().getMonth()+1;
    const tags = (tour.tags||[]).join(" ") + " " + (tour.eventCat||"");
    const ctx = { h:+tour.durationH||0, diff:DIFF_NUM[tour.difficulty]||2, days:+tour.days||1,
      rain:!!weatherRain, summer:[6,7,8].includes(mon), winter:[12,1,2,3].includes(mon),
      summit:["csúcs","kilátás","szikla"].some(t=>(tour.tags||[]).includes(t)),
      napkelte:/napkel|napfelk/.test(tags), éjszaka:/éjszak/.test(tags),
      kerékpár:/kerékp|bring/.test(tags), fotó:/fot/.test(tags) };
    const out = {};
    const push = it => { if(out[it.n]) return; out[it.n] = {name:it.n, cat:it.c, icon:it.i, checked:false, own:false, note:""}; };
    GEAR_BASE.forEach(push);
    GEAR_RULES.forEach(r=>{ let on=false; try{ on = new Function("ctx","with(ctx){return ("+r.if+")}")(ctx); }catch(e){}
      if(on) r.items.forEach(push); });
    const d = myData();
    if(d) for(const g of d.equipment) if(g.has && out[g.name]) out[g.name].own = true;
    return Object.values(out);
  }
  function newTourFromDraft(dr){
    const t = Object.assign({
      id: uid("t"), status: dr.status||"tervezés", createdAt: todayISO(), weatherRain:false,
      title:"", place:"", region:"", date:"", days:1, lengthKm:0, ascent:0, durationH:0,
      difficulty:"Közepes", tags:[], desc:"", img:IMG.erdo, coords:null, waypoints:[], gpx:null,
      timeline:[], gear:[], participants:[], cars:[], food:[],
      safety: SAFETY.map(s=>({n:s.n, checked:false})),
      notes:"", photos:[], eventRef:null, eventCat:"", meeting:"", weatherChecked:false, shareCode:null,
      tasks:[], noteStream:[], budget:[]
    }, dr);
    if(!t.title) t.title = t.place || "Új túra";
    if(!t.timeline.length) t.timeline = TIMELINE_TPL.map(x=>({id:uid("tl"),...x}));
    if(!t.gear.length) t.gear = recommendGear(t, dr._rain);
    if(!t.food.length) t.food = FOOD_TEMPLATE(t.durationH).map(f=>({id:uid("fd"),...f}));
    if(!t.tasks.length) t.tasks = ["Időjárás-ellenőrzés a túra napjára","Víz és uzsonna beszerzése","Résztvevők visszaigazolása","Felszerelés állapotának ellenőrzése"].map((l,i)=>({id:uid("tk"),label:l,done:false,due:Math.max(0,t.date?dayDiff(t.date):7)-i*2}));
    myData().tours.push(t); save(); return t;
  }
  function updateTour(id, patch){ const t=getTour(id); if(!t) return null; Object.assign(t,patch); save(); return t; }
  function deleteTour(id){ const d=myData(); d.tours=d.tours.filter(t=>t.id!==id); d.journal=d.journal.filter(j=>j.tourId!==id); save(); }
  const getTour = id => myData().tours.find(t=>t.id===id);

  function completeTour(id, rating, note, photos){
    const o = (rating && typeof rating==="object") ? rating : {rating, note, photos};
    const d=myData(), t=getTour(id); if(!t) return;
    t.status="teljesítve"; t.doneAt = o.doneAt || t.date || todayISO();
    const core = { tourId:id, title:(o.title||t.title||"").slice(0,88), place:t.region||t.place, date:t.doneAt,
      km:+(o.km!=null?o.km:t.lengthKm)||0, up:+t.ascent||0, h:+(o.h!=null?o.h:t.durationH)||0,
      rating:+o.rating||0, note:o.note||"", photos:(o.photos&&o.photos.length?o.photos:[t.img]).slice(0,9),
      ...(o.fav!==undefined?{fav:o.fav}:{}), ...(o.lesson?{lesson:o.lesson}:{}), updatedAt:new Date().toISOString() };
    const jx = d.journal.find(j=>j.tourId===id);
    if(jx) Object.assign(jx, core);
    else d.journal.push(Object.assign({ id:uid("j"), mood:o.mood||"", lesson:o.lesson||"",
      audio:o.audio||null, privacy:o.privacy||"privát" }, core));
    save();
  }
  function updateJournal(id, patch){ const my=myData(); const j=my.journal.find(x=>x.id===id); if(j) Object.assign(j,patch); save(); return j; }
  function rmJournal(id){ const my=myData(); my.journal=my.journal.filter(x=>x.id!==id); save(); }
  function archiveTour(id){ updateTour(id,{status:"archiválva"}); }
  function promoteWishToTour(wishId){
    const d=myData(), w=d.wishlist.find(x=>x.id===wishId); if(!w) return null;
    const t=newTourFromDraft({ title:w.name, place:w.place||w.name, date:"", difficulty:w.diff||"Közepes",
      img:w.img, coords:(w.lat?{name:w.place||w.name, lat:w.lat, lng:w.lng}:null),
      tags:[w.cat==="Csúcsok"?"csúcs":w.cat==="Vízesések"?"vízesés":w.cat==="Erdők"?"erdő":"kilátás"],
      lengthKm:"?", ascent:"?", durationH:"?" });
    w.asTourId=t.id; w.status="tervezés"; save(); return t; }
  function setWishStatus(id,st){ const w=myData().wishlist.find(x=>x.id===id); if(w){ w.status=st; save(); } }
  function setStatus(id,st){ const t=getTour(id); if(!t) return null; if(st==="tervezés"&&t.status==="ötlet"){} t.status=st; save(); return t; }

  /* ---------- KÉSZÜLTSÉG + ELLENŐRZŐ ---------- */
  function readiness(t){
    const rows=[];
    rows.push({k:"date",   label:"Dátum beállítva",           ok:!!t.date, goto:""});
    rows.push({k:"place",  label:"Helyszín kiválasztva",       ok:!!(t.place||t.region), goto:""});
    rows.push({k:"route",  label:"Útvonal elkészítve",         ok:!!(t.gpx||t.waypoints.length||t.coords), goto:"utvonal"});
    rows.push({k:"time",   label:"Időterv elkészítve",         ok:(t.timeline||[]).length>=3, goto:"idoter"});
    rows.push({k:"pack", label:"Csomagolás ellenőrizve (minden bepakolva)", ok:(t.gear||[]).filter(g=>g).length>0 && t.gear.every(g=>!g||g.checked), goto:"felszereles"});
    rows.push({k:"gear", label:"Felszerelés állapotát láttam (minden elem súlya ismert)", ok:(t.gear||[]).filter(g=>g).length>0 && t.gear.every(g=>!g||(+g.w||0)>0), goto:"felszereles"});
    rows.push({k:"food",   label:"Étel és víz megtervezve",    ok:(t.food||[]).length>0 && t.food.every(f=>f.checked), goto:"ete"});
    rows.push({k:"people", label:"Résztvevők visszaigazolva",  ok:!t.participants.length || t.participants.every(p=>p.confirmed), goto:"resztvevok"});
    rows.push({k:"travel", label:"Utazás megszervezve",        ok:!!t.meeting || t.participants.length===0 || t.cars.length>0, goto:"utazas"});
    rows.push({k:"weather",label:"Időjárás ellenőrizve",       ok:!!t.weatherChecked, goto:"utvonal"});
    rows.push({k:"notes",  label:"Fontos jegyzetek kitöltve",  ok:(t.notes||"").trim().length>=6, goto:"jegyzet"});
    const done=rows.filter(r=>r.ok).length;
    return {rows, pct:Math.round(done/rows.length*100), missing:rows.filter(r=>!r.ok)};
  }
  function tourCheck(t){ const r=readiness(t);
    const v = r.pct>=100 ? {cls:"ok", head:"🟢 A túrád indulásra készen áll!"}
      : r.pct>=70 ? {cls:"ok", head:`🟢 Majdnem indulásra kész — még ${r.missing.length} dolog hiányzik`}
      : r.pct>=40 ? {cls:"mid", head:`🟡 Jó úton jársz — ${r.missing.length} pont még nyitott`}
      : {cls:"bad", head:`🔴 A tervezés elején jársz — ${r.missing.length} pont nyitott`};
    return Object.assign({pct:r.pct, rows:r.rows, missing:r.missing}, v); }

  /* ---------- CSOMAGSÚLY / HÁTIZSÁK KALKULÁTOR ---------- */
  function backpack(t){
    const cats={}; let total=0, buy=0, own=0;
    (t.gear||[]).forEach(g=>{ if(!g) return; const w=+g.w||0; cats[g.cat||"Egyéb"]=(cats[g.cat||"Egyéb"]||0)+w;
      total+=w; if(g.own){own+=w;}else{buy+=w;} });
    const rows=Object.entries(cats).map(([cat,g])=>({cat, g})).sort((a,b)=>b.g-a.g);
    return {total, own, buy, rows, over:total>12500, heavy:total>9500};
  }

  /* ---------- TÚRASABLONOK ---------- */
  function allTemplates(){ return (typeof TEMPLATES_DEFAULT!=="undefined"?TEMPLATES_DEFAULT:[]).concat(myData().templates); }
  function templateById(id){ return allTemplates().find(x=>x.id===id)||null; }
  function isDefaultTpl(id){ return (typeof TEMPLATES_DEFAULT!=="undefined") && TEMPLATES_DEFAULT.some(x=>x.id===id); }
  function saveTemplateFromTour(tourId, name, icon){
    const t=getTour(tourId); if(!t) return null;
    const tpl={ id:uid("tp"), custom:true, icon:icon||"⭐", name:(name||t.title),
      desc:`${t.lengthKm||"?"} km · ${t.durationH||"?"} ó · ${t.difficulty||""}`,
      difficulty:t.difficulty, days:t.days||1, tags:(t.tags||[]).slice(), meeting:t.meeting||"", hours:t.durationH||3,
      gear:t.gear.map(g=>({n:g.name,c:g.cat,i:g.icon,w:g.w||900})),
      timeline:t.timeline.map(x=>({t:x.t,l:x.l,ty:x.ty})),
      food:t.food.map(f=>f.n), tasks:["Csomagolás ellenőrzése","Időjárás megnézése","Valaki tudja, merre jársz"] };
    myData().templates.push(tpl); save(); return tpl; }
  function deleteTemplate(id){ if(!myData().templates.some(x=>x.id===id)) return; const d=myData(); d.templates=d.templates.filter(x=>x.id!==id); save(); }
  function editTemplate(id, patch){ const t=myData().templates.find(x=>x.id===id); if(t) Object.assign(t,patch); save(); return t; }
  function createTemplateFromDraft(o){
    const tpl={ id:uid("tp"), custom:true, icon:o.icon||"📐", name:o.name, desc:o.desc||"",
      difficulty:o.difficulty||"Könnyű", days:o.days||1, tags:o.tags||[], meeting:"", hours:o.hours||3,
      gear:(o.gear||[]).map(n=>({n, c:"Egyéb", i:"🧰", w:WEIGHT_GUESS[n]||900})).filter(x=>n_ok(x.n)),
      timeline:(o.timeline||[]).map(x=>({t:x.t,l:x.l,ty:x.ty||"tura"})),
      food:(o.food||[]).map(n=>n).filter(n_ok), tasks:o.tasks||[] };
    myData().templates.push(tpl); save(); return tpl; }
  function n_ok(n){ return n && typeof n==="string" && n.length>1; }
  function applyTemplate(tourId, tplId){
    const t=getTour(tourId), tpl=templateById(tplId); if(!t||!tpl) return null;
    const have={}; t.gear.forEach(g=>have[g.name]=true);
    (tpl.gear||[]).forEach(g=>{ const n=typeof g==="string"?g:g.n; if(!n||have[n]) return;
      t.gear.push({name:n, cat:(typeof g==="object"&&g.c)||"Egyéb", icon:(typeof g==="object"&&g.i)||"🧰",
        checked:false, own:false, note:"sablonból", w:(typeof g==="object"&&g.w)||WEIGHT_GUESS[n]||900}); have[n]=true; });
    if(tpl.timeline&&tpl.timeline.length && !t.timeline.some(x=>x.l&&x.l!==undefined&&x.hintEdited))
      t.timeline = tpl.timeline.map(x=>({id:uid("tl"),t:x.t,l:x.l,ty:x.ty}));
    (tpl.food||[]).forEach(n=>{ if(n && !t.food.some(f=>f.n===n)) t.food.push({id:uid("fd"),n,i:"🥫",checked:false,w:WEIGHT_GUESS[n]||250}); });
    t.templateId = tpl.id; save(); return t; }

  /* ---------- TEREPRI JELENTŐK (koözösségi, a böngészőben tárolt globális lista) ---------- */
  function fieldReports(){
    if(!db.globalTerepi){ const now=Date.now();
      db.globalTerepi = (typeof TEREP_DEMO!=="undefined"?TEREP_DEMO:[]).map(r=>({...r, ts:r.date+"T"+(r.time||"12:00")+":00"})); }
    return db.globalTerepi.concat(myData() ? myData().terepi : []); }
  function addFieldReport(o){
    const d=myData(); if(!d) return null; o.id=uid("tr"); o.author=me().name; o.ts=new Date().toISOString().slice(0,16).replace("T"," ");
    d.terepi.unshift(o); save(); return o; }
  function ackFieldReport(id){ const my=myData(); my.reportAck[id]=todayISO(); save(); }
  function reportFresh(r){
    const t=new Date((r.ts||r.date+"T12:00:00").replace(" ","T")).getTime(); const hrs=(Date.now()-t)/36e5;
    if(hrs<6)  return {txt:"friss",        cls:"fresh"};
    if(hrs<72) return {txt:`${Math.round(hrs)} órája`, cls:"fresh"};
    if(hrs<24*10) return {txt:`${Math.round(hrs/24)} napja`, cls:"old", warn:true};
    return {txt:`${Math.round(hrs/24)} napja — már nem biztos, hogy aktuális`, cls:"stale", warn:true}; }
  function reportsForTour(t){ const reg=(t.region||"").toLowerCase().split(" ")[0];
    if(!reg) return []; return fieldReports().filter(r=>(r.region||"").toLowerCase().includes(reg||"") || r.tour===t.id)
      .sort((a,b)=>(b.ts||b.date).localeCompare(a.ts||a.date)); }

  /* ---------- CÉLOK + KIÍVÁSOK ---------- */
  function goalRows(){ const st=stats(), d=myData();
    const now=new Date(); const y=now.getFullYear();
    const inYear = d.journal.filter(j=>(j.date||"").startsWith(String(y)));
    const cur = { km: inYear.reduce((a,j)=>a+(+j.km||0),0)||0,
      tours: inYear.length,
      summits: inYear.reduce((a,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return a+((t&&t.tags&&t.tags.includes("csúcs"))?1:0); },0),
      napkelte: inYear.reduce((a,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return a+((t&&(t.tags||[]).includes("napkelte")||/napkel|napfelk/.test(j.title))?1:0); },0),
      wish: d.wishlist.filter(w=>inYear.some(j=>(w.asTourId||w.name||"").toLowerCase && (j.title||"").toLowerCase().includes(((w.name||"x").split(" ")[0]||"x").toLowerCase().slice(0,5)))).length,
      custom: 0 };
    return (d.goalList||[]).map(g=>({...g, current: g.metric==="custom" ? (+g.manual||0) : Math.round((cur[g.metric]||0)*10)/10,
      pct: Math.min(100, Math.round((cur[g.metric]||0)/(+g.target||1)*100)) })); }
  function addGoal(o){ const d=myData(); d.goalList.push(Object.assign({id:uid("g"),icon:"🎯",metric:"custom",manual:0,unit:""},o)); save(); }
  function rmGoal(id){ const d=myData(); d.goalList=d.goalList.filter(g=>g.id!==id); save(); }
  function goalDelta(id, n){ const g=myData().goalList.find(x=>x.id===id); if(!g) return; g.metric="custom"; g.manual=Math.max(0,(+g.manual||+g.current||0)+n); save(); }
  function toggleChallengeItem(cid, idx){ const c=myData().challenges.find(x=>x.id===cid); if(c){ c.items[idx].done=!c.items[idx].done; save(); } }
  function addChallenge(o){ const d=myData(); d.challenges.push({id:uid("ch"),icon:"🏔️",name:o.name,desc:o.desc||"",items:(o.items||[]).map(l=>({l:l.l||l,done:false}))}); save(); }
  function achievements(){ const st=stats(), d=myData();
    const sunrise = d.journal.filter(j=>{ const t=d.tours.find(x=>x.id===j.tourId); return (t&&(t.tags||[]).includes("napkelte"))||/napkel|napfelk/.test(j.title); }).length;
    return [
      {id:"a1", icon:"🥾", name:"Első 10 túra", now: st.tours, target:10},
      {id:"a2", icon:"📏", name:"100 km a bakancsban", now: Math.round(st.km), target:100},
      {id:"a3", icon:"🏔️", name:"Első 5 csúcs", now: st.summits, target:5},
      {id:"a4", icon:"🌄", name:"Első napkelte túra", now: sunrise, target:1},
      {id:"a5", icon:"⚡", name:"1000 m szint egy nap alatt", now: Math.max(0,...d.journal.map(j=>+j.up||0)), target:1000}]; }

  /* ---------- WIDGET SORREND + TEMA ---------- */
  function exportData(){ return JSON.stringify(db); }
  function importData(json){
    try{ const o=JSON.parse(json);
      if(!o || typeof o!=="object" || !o.users || !o.data) return {err:"Érvénytelen Túratárs mentés (users/data nélkül)."};
      // Theme is optional in existing Store exports; getTheme supplies its UI default.
      const next = Object.assign({users:{},data:{},session:null}, o);
      // Commit persistence before publishing the new in-memory state.
      localStorage.setItem(KEY, JSON.stringify(next)); db = next; return {ok:true};
    }catch(e){ return {err:"Nem sikerült beolvasni a fájlt."}; }
  }
  function eraseMyData(){ const u=me(); if(!u) return; db.data[u.id]=blankUserData(); save(); }
  function journalKmTotal(){ const d=myData(); if(!d) return 0; return Math.round(d.journal.reduce((a,j)=>a+(+j.km||0),0)); }
    function setWidgetOrder(arr){ myData().widgets=arr.slice(); save(); }
  function setTheme(mode){ db.theme=mode; save(); applyTheme(); }
  function getTheme(){ return db.theme||"light"; }
  function applyTheme(){ if(typeof document==="undefined") return;
    const t=db.theme||"light"; const eff = t==="auto" ? (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light") : t;
    document.documentElement.dataset.theme = eff; }

  /* ---------- BAKANCSLISTA, ESEMÉNYEK, ESZKÖZÖK, CSAPATOK ---------- */
  const inWish = w => myData().wishlist.some(x=>x.ref===w.id);
  function toggleWish(w){ const d=myData(); const i=d.wishlist.findIndex(x=>x.ref===w.id);
    if(i>=0) d.wishlist.splice(i,1);
    else d.wishlist.push({id:uid("w"), ref:w.id, name:w.name, cat:w.cat, place:w.place, diff:w.diff, img:w.img, lat:w.lat, lng:w.lng, addedAt:todayISO()});
    save(); }
  function rmWish(id){ const d=myData(); d.wishlist=d.wishlist.filter(x=>x.id!==id); save(); }
  function addWishCustom(o){ myData().wishlist.push(Object.assign({id:uid("w"), addedAt:todayISO(), custom:true},o)); save(); }

  const isEventSaved = eid => myData().savedEvents.includes(eid);
  function toggleEvent(eid){
    const d=myData(), i=d.savedEvents.indexOf(eid);
    if(i>=0){ d.savedEvents.splice(i,1); d.tours=d.tours.filter(t=>t.eventRef!==eid); save(); return; }
    d.savedEvents.push(eid);
    const ev = EVENTS.find(x=>x.id===eid), base = ev && ev.tour ? tourById(ev.tour) : null;
    const _notes=(ev&&ev.reg)?("Nevezés: "+(ev.reg||"")+(ev.time?" · "+ev.time:"")):"";
    const _tr = ev ? newTourFromDraft({ title:ev.name, place: base?base.start.name:ev.place, region: base?base.region:ev.place,
      date:ev.date, lengthKm:base?base.km:8, ascent:base?base.up:300, durationH:base?base.h:3,
      difficulty:ev.diff, tags: base?base.tags.slice():["vezetett"], img:ev.img, desc:ev.desc,
      coords: base?{...base.start}:null, eventRef:ev.id, eventCat:ev.cat, status:"jelentkezve" }) : null;
    if(_tr && _notes && !(String(_tr.notes).indexOf("Nevezés:")>=0)) _tr.notes = (_tr.notes ? _tr.notes + (String.fromCharCode(10)) : "") + _notes;
    save();
  }

  function saveEquipment(o){ const d=myData();
    if(o.id){ const g=d.equipment.find(x=>x.id===o.id); if(g) Object.assign(g,o); }
    else { o.id=uid("g"); d.equipment.push(o); }
    save(); }
  function removeEquipment(id){ const d=myData(); d.equipment=d.equipment.filter(x=>x.id!==id); save(); }

  function addTeam(name){ const d=myData(); const t={id:uid("tm"), name, desc:"", joined:true,
    members:[{id:uid("m"), name:me().name, role:"szervező"}]}; d.teams.push(t); save(); return t; }
  function joinTeam(id){ const t=myData().teams.find(x=>x.id===id);
    if(t && !t.joined){ t.joined=true; t.members.push({id:uid("m"), name:me().name, role:"tag"}); } save(); }
  function leaveTeam(id){ const t=myData().teams.find(x=>x.id===id);
    if(t){ t.joined=false; t.members=t.members.filter(m=>m.name!==me().name); } save(); }
  function teamById(id){ return myData().teams.find(t=>t.id===id); }

  /* ---------- STATISZTIKÁK ---------- */
  function stats(){
    const d = myData(); if(!d) return null;
    const done = d.journal;
    const byM={}; done.forEach(j=>{ const m=(j.date||"").slice(0,7); byM[m]=byM[m]||{km:0,tours:0,up:0};
      byM[m].km+=+j.km||0; byM[m].up+=+j.up||0; byM[m].tours++; });
    const regions={}; done.forEach(j=>{ regions[j.place]=(regions[j.place]||0)+1; });
    const diffs={"Könnyű":0,"Közepes":0,"Nehéz":0};
    done.forEach(j=>{ const t=d.tours.find(x=>x.id===j.tourId); const df=t?t.difficulty:"Közepes"; if(diffs[df]!=null)diffs[df]++; });
    const year=todayISO().slice(0,4);
    const yearKm = Object.entries(byM).filter(([m])=>m.startsWith(year)).reduce((s,[,v])=>s+v.km,0);
    const summits = done.reduce((s,j)=>{ const t=d.tours.find(x=>x.id===j.tourId); return s+((t&&t.tags&&t.tags.includes("csúcs"))?1:0); },0);
    return { km: done.reduce((s,j)=>s+(+j.km||0),0), up: done.reduce((s,j)=>s+(+j.up||0),0), h: done.reduce((s,j)=>s+(+j.h||0),0),
      tours:done.length, summits, byM, regions, diffs, year, yearKm, goals:d.goals,
      planned: d.tours.filter(t=>t.status==="tervezés"||t.status==="jelentkezve").length };
  }

  /* ---------- KÖVETKEZŐ LÉPÉS LOGIKA ---------- */
  function upcoming(){
    const d=myData(); if(!d) return [];
    return d.tours.filter(t=>(t.status==="tervezés"||t.status==="jelentkezve") && t.date && t.date>=todayISO())
      .sort((a,b)=>a.date.localeCompare(b.date));
  }
  function needs(){
    const t = upcoming()[0]; if(!t) return [];
    const n=[];
    if(!t.weatherChecked) n.push({label:"Ellenőrizd az időjárást", href:"#/tura/"+t.id});
    if(t.gear.some(g=>!g.checked)) n.push({label:`Csomagolás: ${count(t.gear,g=>!g.checked)} elem még jelöletlen`, href:"#/tura/"+t.id});
    if(t.safety.some(s=>!s.checked)) n.push({label:"Mentsd ki a biztonsági listát", href:"#/tura/"+t.id});
    if(t.participants.some(p=>!p.confirmed)) n.push({label:"Kérj megerősítést a résztvevőktől", href:"#/tura/"+t.id});
    return n.slice(0,4);
  }

  /* ---------- ÉRTESÍTÉSEK (keves, de tényleg hasznos) ---------- */
  function notifications(){
    const d=myData(); if(!d) return [];
    const out=[]; const t0 = upcoming()[0];
    if(t0){
      const dd = dayDiff(t0.date);
      if(dd>=0 && dd<=2) out.push({id:"nd-"+t0.id, icon:"📅", text:`${dd===0?"Ma":dd===1?"Holnap":"Két nap múlva"} indul a túrád: ${t0.title}.`, link:"#/tura/"+t0.id});
      if(dd>=0 && dd<=5 && t0.gear.some(g=>!g.checked))
        out.push({id:"ng-"+t0.id, icon:"🎒", text:`${count(t0.gear,g=>!g.checked)} felszerelési elem még ellenőrizetlen a(z) ${t0.title} túrádon.`, link:"#/tura/"+t0.id});
    }
    EVENTS.filter(e=>d.savedEvents.includes(e.id)).forEach(e=>{
      const dd=dayDiff(e.date);
      if(dd>=0 && dd<=7) out.push({id:"ne-"+e.id, icon:"🥾", text:`${dd===0?"Ma":dd+" nap múlva"}: ${e.name} (${e.place}).`, link:"#/esemenyek"});
      const near = d.wishlist.find(w=>(e.place||"").toLowerCase().includes((w.place||"~").toLowerCase().slice(0,4)) || (w.name||"").toLowerCase().includes((e.place||"~").toLowerCase().slice(0,4)));
      if(near && dd>0) out.push({id:"nw-"+e.id, icon:"❤️", text:`Egy esemény közel van a bakancslistádhoz: ${e.name}.`, link:"#/esemenyek"});
    });
        const soon = d.equipment.filter(g=>g.expiry && (()=>{const dd=new Date(g.expiry+"T12:00:00")-new Date(); return dd>0 && dd< 30*864e5;})());
    const lapsed = d.equipment.filter(g=>g.expiry && new Date(g.expiry+"T12:00:00") < new Date());
    for(const g of lapsed.slice(0,1)) out.push({id:"n-exp-"+g.id, icon:"⛑️", text:`Lejárt a ${g.name} „biztosítás/tagság” dátuma (${g.expiry}) — újítsd fel vagy írd át az időpontot.`, link:"#/felszereles"});
    for(const g of soon.slice(0,1)) out.push({id:"n-exp2-"+g.id, icon:"📅", text:`A ${g.name} biztosítás/tagsága ${Math.ceil((new Date(g.expiry)-new Date())/864e5)} nap múlva jár le.`, link:"#/felszereles"});
const unlogged = d.tours.find(t=>t.status==="teljesítve" && !d.journal.some(j=>j.tourId===t.id));
    if(unlogged) out.push({id:"nj-"+unlogged.id, icon:"📖", text:`A(z) ${unlogged.title} teljesítve — de még nem írtál róla a túranaplódba.`, link:"#/tura/"+unlogged.id});
    const undated = d.tours.find(t=>t.status==="tervezés" && !t.date);
    if(undated) out.push({id:"nu-"+undated.id, icon:"🗓️", text:`A(z) ${undated.title} túrához még nincs dátum. Tervezd meg, mire jó egy nap!`, link:"#/tura/"+undated.id});
    return out.filter(n=>!d.notifDismiss.includes(n.id)).slice(0,5);
  }
  const dismissNotif = id => { const d=myData(); if(!d.notifDismiss.includes(id)) d.notifDismiss.push(id); save(); };

  /* ---------- AI TÚRATÁRS (szabályalapú asszisztens) ---------- */
  function aiReply(text){
    const q = text.toLowerCase();
    const want = { diff: /könny/.test(q)?"Könnyű" : /neh[ée]z/.test(q)?"Nehéz" : /k[öo]zep/.test(q)?"Közepes" : null,
      maxH: (()=>{ const m=q.match(/(\d+(?:[.,]\d+)?)\s*(?:[óo]ra|órás|órán|[h]\b|(?:h[óo]))/); return m?parseFloat(m[1].replace(",",".")):null; })(),
      region:null, tags:[] };
    if(/napkel|napfelk/.test(q)) want.tags.push("napkelte");
    if(/cs[úu]cs|hegyre|cs[áa]cs/.test(q)) want.tags.push("csúcs");
    if(/v[íi]zes[ée]s/.test(q)) want.tags.push("vízesés");
    if(/\tt[óo]v?/.test(q)||/tavak|to/.test(q)) want.tags.push("tó");
    if(/erd/.test(q)) want.tags.push("erdő");
    if(/csal[áa]d|gyerek|kicsik/.test(q)) want.tags.push("family");
    if(/fot[óo]/.test(q)) want.tags.push("fotó");
    if(/t[öo]bbnapos|s[áa]tr/.test(q)) want.tags.push("többnapos");
    if(/ker[ée]kp|bring/.test(q)) want.tags.push("kerékpár");
    if(/[ée]jszak/.test(q)) want.tags.push("éjszaka");
    if(/kil[áa]t|panor/.test(q)) want.tags.push("kilátás");
    if(/kezd/.test(q)) want.tags.push("kezdőknek");
    for(const rg of [...new Set(TOURS.map(t=>t.region))]) if(q.includes(rg.toLowerCase().split(" ")[0])) want.region = rg;
    const score = t => { let s=(t.rating-4.5)*2;
      if(want.diff) s += t.diff===want.diff ? 3 : -2;
      if(want.maxH) s += t.h > want.maxH ? -6 : 2 + Math.max(0,(want.maxH-t.h))*0.25;
      if(want.region) s += t.region.toLowerCase().startsWith(want.region.toLowerCase().slice(0,4)) ? 2 : -1;
      want.tags.forEach(tg=>{ if(t.tags.includes(tg)) s+=2.5; });
      if(/r[öo]vid|s[ée]ta|k[öo]nnyed/.test(q) && t.km<=8) s+=1.5;
      if(/h[ée]v/.test(q) && !t.tags.includes("family")) s+=.5;
      return s; };
    const t = TOURS.slice().sort((a,b)=>score(b)-score(a))[0];
    const date = /szombat/.test(q)?nextSatDate(): addDays(todayISO(), 3);
    const steps = TIMELINE_TPL.slice(0, Math.max(4, Math.min(8, 2+Math.round((t.h||3)/1.4))));
    const gear = recommendGear({difficulty:t.diff, durationH:t.h, days:1, tags:t.tags, date}, /es[öo]|rain/.test(q)).slice(0,10);
    return { tour:t, date, why:buildWhy(t,want,q), plan:steps, gear, food:FOOD_TEMPLATE(t.h), water:waterFor(t.h) };
  }
  function buildWhy(t,want,q){
    const b=[]; b.push(`${t.diff} nehézségű, ${t.km} km, kb. ${t.h} óra`);
    if(t.tags.includes("kilátás")||t.tags.includes("csúcs")) b.push("gyönyörű panorámával");
    if(t.tags.includes("erdő")) b.push("árnyékos erdőn át");
    if(t.tags.includes("family")) b.push("gyerekbarát");
    if(want.maxH && t.h<=want.maxH) b.push(`belefér a ~${want.maxH} órába`);
    return b.join(" · ");
  }

  /* ---------- KEZDŐ + DEMÓ ADATOK ---------- */
  
  
  load();
  return { load, save, me, myData, platform, community, userDataOf, findTourAnywhere, userByAny, allUserDataIds, signup, login, adoptCloudUser, cloudProfile, adoptCloudProfile, logout, changePassword, updateProfile, setPrefs,
    newTourFromDraft, updateTour, deleteTour, getTour, completeTour, recommendGear,
    toggleWish, addWishCustom, rmWish, inWish, isEventSaved, toggleEvent,
    saveEquipment, removeEquipment, stats, notifications, dismissNotif, upcoming, needs,
    dayDiff, aiReply, uid, todayISO, addDays, nextSatDate,
    addTeam, joinTeam, leaveTeam, teamById,
    /* bump2 — új modulok API-ja */
    updateJournal, rmJournal, archiveTour, promoteWishToTour, setWishStatus, setStatus,
    readiness, tourCheck, backpack,
    allTemplates, templateById, isDefaultTpl, saveTemplateFromTour, deleteTemplate, editTemplate,
    createTemplateFromDraft, applyTemplate,
    fieldReports, addFieldReport, ackFieldReport, reportFresh, reportsForTour,
    goalRows, addGoal, rmGoal, goalDelta, toggleChallengeItem, addChallenge, achievements,
    setWidgetOrder, setTheme, getTheme, applyTheme,
    exportData, importData, eraseMyData, journalKmTotal };
})();

/* ==== ui ==== */
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

/* ==== public ==== */
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
"      <div class="grid g3">${popular.map(t=>tourCard(t)).join("")}</div>
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
  return `<div class="wrap pub-section tight">
    <div class="sect-head"><div><span class="eyebrow">${v122PublicTours().length} útvonal · élő szűrők</span><h1 style="font-size:2rem" class="mb0">Túrák felfedezése</h1></div></div>
    <div class="searchbox" style="margin-top:0;grid-template-columns:1.4fr .8fr .8fr .8fr .9fr" id="discfilters">
      <div class="sc-field"><label for="d-q">Keresés</label><input id="d-q" value="${esc(saved.q||"")}" placeholder="Név, tájegység…"></div>
      <div class="sc-field"><label for="d-diff">Nehézség</label><select id="d-diff"><option value="">Mindegy</option><option>Könnyű</option><option>Közepes</option><option>Nehéz</option></select></div>
      <div class="sc-field"><label for="d-id">Idő</label><select id="d-id"><option value="">Bármennyi</option><option value="3">max 3 ó</option><option value="5">max 5 ó</option><option value="99">bármilyen hosszú</option></select></div>
      <div class="sc-field"><label for="d-reg">Tájegység</label><select id="d-reg"><option value="">Mindegy</option>${[...new Set(v122PublicTours().map(t=>t.region))].map(r=>`<option>${esc(r)}</option>`).join("")}</select></div>
      <div class="sc-field"><label>Nézet</label><button class="input" id="d-toggle" style="cursor:pointer;text-align:left;background:transparent">🗺️ Térkép</button></div>
    </div>
    <div class="grid g3" id="disc-results" style="margin-top:22px"></div>
    <div class="mapbox hidden" id="disc-map" style="margin-top:22px;height:460px"></div>
    <div class="trail-divider"><span class="trail-blaze"></span></div>
    <p class="muted small">A találatok frissülnek, ahogy szűrsz: a térképnézet pontjaira kattintva azonnal megnyithatod a túrát.</p>
  </div>${footer()}`;
};
VIEWS.discover.after = (root)=>{
  const els = { q:root.querySelector("#d-q"), diff:root.querySelector("#d-diff"), h:root.querySelector("#d-id"), reg:root.querySelector("#d-reg") };
  try{ const saved=JSON.parse(sessionStorage.getItem("tvq")||"{}"); if(saved.diff)els.diff.value=saved.diff; if(saved.h)els.h.value=saved.h; }catch(e){}
  let showMap=false, discMap=null;
  const apply = () => {
    const q=els.q.value.toLowerCase().trim(), f = t =>
      (!els.diff.value || t.diff===els.diff.value) &&
      (!els.reg.value || t.region===els.reg.value) &&
      (els.h.value==="99" || !els.h.value || t.h <= +els.h.value || els.h.value==="99") &&
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
  ["q","diff","h","reg"].forEach(k=>{ els[k].addEventListener("input",apply); els[k].addEventListener("change",apply); });
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
      <p>${esc(t.desc)}</p>
      ${window.v122SourceLine?v122SourceLine(t):""}
      ${t.gpxUrl?`<div class="flex" style="gap:.5rem;flex-wrap:wrap;margin-top:.3rem"><a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="${esc(t.gpxUrl)}">⬇ GPX letöltése</a>${t.src?`<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(t.src)}">${esc(t.srcn||"🔗 Hivatalos távleírás")}</a>`:""}</div>`:`<p class="small muted">🗺️ Útvonaladat még nem érhető el. A kezdőpontból saját útvonalat tervezhetsz a térképen.</p>`}
      ${window.v123PlanningUrl&&t.start?`<a class="btn btn-ghost btn-sm" style="margin-top:.35rem" target="_blank" rel="noopener nofollow" href="${esc(window.v123PlanningUrl(t))}">🧭 Útvonal tervezése a térképen</a>`:""}
      ${t.src?`<a class="tour-src" id="tourSrc" target="_blank" rel="noopener" href="${esc(t.src)}">🔗 ${(t.srcn||"Forrás és nyomvonal")}</a>`:""}
     ${t.src2?`<a class="tour-src" target="_blank" rel="noopener" href="${t.src2}">🧭 ${(t.src2n||'Nyomvonal')} — Komoot</a>`:""}
     ${t.src3?`<a class="tour-src" target="_blank" rel="noopener" href="${t.src3}">🧭 ${(t.src3n||'Nyomvonal 2')} — Komoot</a>`:""}
      <div style="height:44px">${elevSpark(t.elev)}</div>
      <p class="small muted">💡 Regisztráció után egy kattintással átemelheted a saját túráid közé, és a rendszer automatikusan javasol felszerelést, időtervet és étellistát.</p>`,
    footer:`<div class="flex" style="justify-content:space-between"><button class="btn btn-ghost btn-sm" data-close>Bezárás</button>
      <button class="btn btn-primary" id="tm-save">➕ Mentés a saját túráim közé</button></div>`,
    onOpen: r => r.querySelector("#tm-save").onclick = () => {
      if(!Store.me()){ toast("Előbb jelentkezz be vagy regisztrálj","🔐"); NAV.to("#/regisztracio"); return; }
      const d = Store.myData();
      if(!d.tours.some(x=>x.place===t.start.name && x.status==="tervezés" && x.date>=Store.todayISO())){
        Store.newTourFromDraft({ title:t.name, place:t.start.name, region:t.region, lengthKm:t.km, ascent:t.up,
          durationH:t.h, difficulty:t.diff, tags:t.tags.slice(), img:t.img, desc:t.desc, coords:{...t.start}, date:Store.nextSatDate() });
      }
      closeModal(); toast("Mentve a tervezett túráid közé — nyisd meg a munkaterületet! 🥾","✓"); NAV.to("#/turaim"); } });
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

/* ==== dashboard ==== */
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
      <button class="btn btn-ghost btn-sm" data-edit="${t.id}">✏️ Szerkesztés</button>
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
  root.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{
    const t=Store.getTour(b.dataset.edit); if(!t) return;
    openModal({title:"✏️ Túra szerkesztése", body:`
      <label class="f" for="et-title">Túra neve</label><input class="input" id="et-title" value="${esc(t.title||"")}">
      <label class="f" for="et-place">Helyszín</label><input class="input" id="et-place" value="${esc(t.place||"")}">
      <label class="f" for="et-date">Dátum</label><input class="input" id="et-date" type="date" value="${esc(t.date||"")}">
      <label class="f" for="et-desc">Rövid leírás</label><textarea class="input" id="et-desc" rows="3">${esc(t.desc||"")}</textarea>
      <div class="grid g2"><div><label class="f" for="et-diff">Nehézség</label><select class="input" id="et-diff">${["Könnyű","Közepes","Nehéz"].map(x=>`<option ${t.difficulty===x?"selected":""}>${x}</option>`).join("")}</select></div>
      <div><label class="f" for="et-km">Tervezett táv (km)</label><input class="input" id="et-km" type="number" min="0" step="0.1" value="${esc(t.lengthKm||"")}"></div>
      <div><label class="f" for="et-ascent">Szintemelkedés (m)</label><input class="input" id="et-ascent" type="number" min="0" step="10" value="${esc(t.ascent||"")}"></div>
      <div><label class="f" for="et-duration">Becsült idő (óra)</label><input class="input" id="et-duration" type="number" min="0" step="0.5" value="${esc(t.durationH||"")}"></div></div>`,
      footer:`<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="et-save">Mentés</button>`,
      onOpen:r=>{ r.querySelector("#et-save").onclick=()=>{ Store.updateTour(t.id,{title:r.querySelector("#et-title").value.trim()||t.title,place:r.querySelector("#et-place").value.trim(),date:r.querySelector("#et-date").value,desc:r.querySelector("#et-desc").value.trim(),difficulty:r.querySelector("#et-diff").value,lengthKm:+r.querySelector("#et-km").value||0,ascent:+r.querySelector("#et-ascent").value||0,durationH:+r.querySelector("#et-duration").value||0}); closeModal(); toast("Túra mentve helyben — a felhőbe a Szinkron most gombbal menthető.","✅"); render(); }; }
    });
  });
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
    ${free?`<div style="grid-column:1/-1"><label class="f" for="wz-desc">Rövid leírás</label><textarea class="input" id="wz-desc" rows="3" placeholder="Mit érdemes tudni erről a túráról?">${esc(wiz.desc||"")}</textarea></div>
    <div><label class="f" for="wz-km">Tervezett táv (km)</label><input class="input" id="wz-km" type="number" min="0" step="0.1" value="${esc(wiz.lengthKm||"")}"></div>
    <div><label class="f" for="wz-ascent">Szintemelkedés (m)</label><input class="input" id="wz-ascent" type="number" min="0" step="10" value="${esc(wiz.ascent||"")}"></div>
    <div><label class="f" for="wz-duration">Becsült idő (óra)</label><input class="input" id="wz-duration" type="number" min="0" step="0.5" value="${esc(wiz.durationH||"")}"></div>`:""}
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
      ["#wz-place","#wz-start","#wz-date","#wz-days","#wz-hours","#wz-diff","#wz-with","#wz-title","#wz-desc","#wz-km","#wz-ascent","#wz-duration"].forEach(id=>{const e=q(id); if(e&&e.value!==undefined){
        const map={"#wz-place":"place","#wz-start":"start","#wz-date":"date","#wz-days":"days","#wz-hours":"hours","#wz-diff":"difficulty","#wz-with":"who","#wz-title":"title","#wz-desc":"desc","#wz-km":"lengthKm","#wz-ascent":"ascent","#wz-duration":"durationH"};
        wiz[map[id]] = ["#wz-days","#wz-km","#wz-ascent","#wz-duration"].includes(id)?(e.value===""?"":+e.value):e.value; }});
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
      date: wiz.date || "", days, lengthKm: base?base.km:(wiz.lengthKm!==""&&wiz.lengthKm!=null?wiz.lengthKm:(wiz.kind==="multi"?32:10)),
      ascent: base?base.up:(wiz.ascent!==""&&wiz.ascent!=null?wiz.ascent:(wiz.kind==="multi"?1200:450)), durationH: base?base.h:(wiz.durationH!==""&&wiz.durationH!=null?wiz.durationH:hoursNum),
      difficulty: wiz.difficulty||"Közepes", tags: wiz.kind==="multi"?["többnapos","sátor"]: base? base.tags.slice():[],
      img: base?base.img: IMG.kodos, desc: wiz.desc|| (base?base.desc:""), coords: base? {...base.start}:null,
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

/* ==== dashboard2 ==== */
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

/* ==== workspace ==== */
/* ============================================================
   TÚRAVAROS — TÚRA-MUNKATERÜLET (workspace)
   Fejléc adatokkal + 11 fül: áttekintés, útvonal, időterv, felszerelés,
   résztvevők, utazás, étel és víz, jegyzetek, biztonság, fotók, napló
   ============================================================ */
"use strict";
const WS_TABS = [
 ["attekintes","Áttekintés"], ["utvonal","Útvonal"], ["idoter","Időterv"], ["felszereles","Felszerelés"],
 ["resztvevok","Résztvevők"], ["utazas","Utazás"], ["ete","Étel és víz"], ["jegyzet","Jegyzetek"],
 ["koltseg","💶 Költségek"], ["biztonsag","Biztonság"], ["fotok","Fotók"], ["naplo","Túranapló"]
];
let wsTab = "attekintes";
const pct = a => a.length ? a.filter(x=>x.checked).length/a.length : 1;

VIEWS.workspace = (id) => {
  const t = Store.getTour(id);
  if(!t) return dash("#/turaim")+`<div class="empty"><span class="em-ico">🤔</span><h3>A túra nem található</h3><a class="btn btn-primary" href="#/turaim">Vissza a Túráimhoz</a></div>`;
  const catTour = null;
    const pct = (a)=> a.length? a.filter(x=>x.checked).length/a.length : 1;
  return dash("#/turaim")(`
    <a class="small muted" href="#/turaim" style="display:inline-block;margin-bottom:.7rem;color:var(--sky);font-weight:600">← Túráim</a>
    <div class="ws-head">
      <div class="ws-title">
        <div>
          ${statusChip(t.status)} ${t.eventCat?`<span class="chip chip-ember">${esc(t.eventCat)}</span>`:""}
          <h1 style="margin-top:.4rem">${esc(t.title).toUpperCase()} <span class="muted" style="font-size:.55em;font-weight:500">· ${t.date?fmtDateFull(t.date):"dátum nélkül"}</span></h1>
          <div class="small muted">Állapot: <b style="text-transform:uppercase">${t.status==="tervezés"?"tervezés alatt":t.status==="jelentkezve"?"eseményre jelentkeztél":"teljesítve"}</b>${t.difficulty?" · "+esc(t.difficulty):""}</div>
        </div>
        <div class="ws-actions">
          ${t.status!=="teljesítve"?`<button class="btn btn-ember btn-sm" data-wsfinish>✓ Teljesítettem</button>`:""}
          <button class="btn btn-ghost btn-sm" data-wsshare>🔗 Túraterv megosztása</button>
          <button class="icon-btn" data-wsdel aria-label="Túra törlése">🗑</button>
        </div>
      </div>
      <div class="ws-stats">
        <span class="ws-stat">📍 <b>${esc(t.place||t.region||"nincs megadva")}</b></span>
        <span class="ws-stat">📅 <b>${t.date?fmtDateFull(t.date)+" ("+dowHU(t.date).slice(0,3)+")":"—"}</b></span>
        <span class="ws-stat">📏 <b>${t.lengthKm||"?"} km</b></span>
        <span class="ws-stat">⏱ <b>kb. ${t.durationH||"?"} ó</b></span>
        <span class="ws-stat">⬆ <b>${t.ascent||"?"} m</b></span>
        <span class="ws-stat" id="ws-weather">🌦 <b>időjárás betöltése…</b></span>
      </div>
    </div>
    <div class="tabs" role="tablist">${WS_TABS.map(([k,l])=>`<button class="${wsTab===k?"on":""}" data-wstab="${k}">${l}</button>`).join("")}</div>
    <div id="ws-body">${wsTabHTML(t, catTour)}</div>`);
};
VIEWS.workspace.after = (root, arg) => {
  const t = Store.getTour(arg); if(!t) return;
  root.querySelectorAll("[data-wstab]").forEach(b=>b.onclick=()=>{ wsTab=b.dataset.wstab; render(); });
  const fin = root.querySelector("[data-wsfinish]"); if(fin) fin.onclick=()=> finishFlow(t);
  const sh = root.querySelector("[data-wsshare]"); if(sh) sh.onclick=()=> sharePlan(t);
  const del = root.querySelector("[data-wsdel]"); if(del) del.onclick=()=> confirmDlg(`A(z) ${t.title} túra törlődik minden tervével.`, "Törlés", ()=>{ Store.deleteTour(t.id); toast("Túra törölve","🗑"); NAV.to("#/turaim"); });
  // időjárás + safety jelzés
  if(t.coords){
    Weather.get(t.coords.lat,t.coords.lng,t.date||Store.todayISO()).then(r=>{
      const el=root.querySelector("#ws-weather"); if(!el||!r) { if(el) el.innerHTML=`🌦 <b>nem érhető el (nincs kapcsolat)</b>`; return; }
      el.innerHTML = `${r.icon} <b>${Math.round(r.min)}–${Math.round(r.max)} °C</b> · ${esc(r.label)}${r.rain>=50?` · <span class="warn-ic" style="font-weight:700">${r.rain}% eső!</span>`:` · eső: ${r.rain}%`}`;
      Store.updateTour(t.id,{weatherChecked:true, weatherRain:r.rain>=50});
    }).catch(()=>{ const el=root.querySelector("#ws-weather"); if(el) el.innerHTML="🌦 <b>—</b>"; });
  } else { const el=root.querySelector("#ws-weather"); if(el) el.innerHTML="🌦 <b>adj helyszínt az időjáráshoz</b>"; }
  wireTab(root, t);
};

/* ---------- FÜL TARTALOMOK ---------- */

function stepRow(txt, j){ return `<label class="ck" style="border-bottom:1px solid var(--line)" data-j="${j}"><span style="width:19px;text-align:center;flex:none">◻</span><span>${txt}</span><span style="margin-left:auto;font-size:.72rem;color:var(--sky);font-weight:700">MEGNYITÁS ›</span></label>`; }
function doneRow(){ return `<label class="ck" style="border-bottom:1px solid var(--line)"><span style="width:19px;text-align:center;flex:none">✅</span><span><b>Minden teendő kész — irány a hegy!</b></span></label>`; }
function wsOverview(t, catTour, steps){
  return `<div class="ws-grid">
    <div>
      <div class="card panel">
        <h3>📋 Túraterv összefoglaló</h3>
        <p class="mt0">${esc(t.desc || "Ehhez a túrához még nem írtál leírást — az Útvonal fülön jelölheted a pontokat.")}</p>
        <div class="grid g2 smm2" style="margin-top:.6rem">
          <div class="stat-tile card"><span class="st-ic">🗺</span><b>${t.lengthKm||"?"} km</b><span>távolság</span></div>
          <div class="stat-tile card"><span class="st-ic">⛰️</span><b>${t.ascent||"?"} m</b><span>szintkülönbség</span></div>
          <div class="stat-tile card"><span class="st-ic">⏱️</span><b>${t.durationH||"?"} ó</b><span>becsült idő</span></div>
          <div class="stat-tile card"><span class="st-ic">${t.days>1?"⛺":"🥾"}</span><b>${t.days||1} nap</b><span>${esc(t.difficulty)}</span></div>
        </div>
      </div>
      ${t.meeting?`<div class="card panel" style="margin-top:14px"><h3>🚏 Találkozás</h3><p class="mb0">${esc(t.meeting)}</p></div>`:""}
      <div class="card panel" style="margin-top:14px">
        <h3>🚩 Mi a következő lépés?</h3>
        ${steps.join("")}
      </div>
    </div>
    <div>
      <div class="card panel">
        <h3>✔ Felkészültség</h3>
        ${[["Felszerelés",pct(t.gear)],["Biztonság",pct(t.safety)],["Étel és víz",pct(t.food)]].map(([k,v])=>`
          <div class="small" style="margin-top:.55rem">${k}<b style="float:right">${Math.round(v*100)}%</b></div>
          <div class="progress-strip" style="height:9px"><i style="width:${v*100}%"></i></div>`).join("")}
      </div>
      <div class="card panel" style="margin-top:14px">
        <h3>👥 ${t.participants.length? t.participants.length+" résztvevő":"Csatlakozók"}</h3>
        ${t.participants.length? t.participants.map(p=>`<div class="flex between" style="padding:.3rem 0"><span class="person-chip"><span class="avt">${initials(p.name)}</span>${esc(p.name)}</span>
          <span class="chip ${p.confirmed?"chip-green":"chip-ember"}">${p.confirmed?"megerősítve":"megerősítésre vár"}</span></div>`).join("")
          : `<p class="muted small mb0">A Résztvevők fülön hívhatod meg a társakat.</p>`}
      </div>
      ${t.participants.length ? "" : `<div class="card panel" style="margin-top:14px"><h3>🤝 Tervezz csapatot?</h3><p class="small muted mb0">Egy esemény vagy saját túra könnyebb társakkal — nézd meg a <a href="#/csapatok" style="color:var(--sky);font-weight:600">Túracsapatokat</a>.</p></div>`}
    </div></div>`;
}

function wsTabHTML(t, catTour){
  switch(wsTab){
  case "attekintes": {
    const safeTodo = t.safety.filter(s=>!s.checked).length;
    const unconfirm = t.participants.filter(p=>!p.confirmed).length;
    const gearTodo = t.gear.filter(g=>!g.checked).slice(0,2);
    const steps = [];
    gearTodo.forEach(g=> steps.push(stepRow(`Csomagolás: <b>${esc(g.name)}</b>`, "felszereles")));
    if(safeTodo) steps.push(stepRow(`${safeTodo} biztonsági pont jelöletlen`, "biztonsag"));
    if(unconfirm) steps.push(stepRow(`${unconfirm} résztvevő még nem erősített meg`, "resztvevok"));
    if(!t.date) steps.push(stepRow("Tedd hozzá a túra dátumát", "attekintes"));
    const html = wsOverview(t, catTour, steps.length? steps : [doneRow()]);
    return html;
  }
  case "utvonal": {
    const hasMap = !!t.coords;
    return `<div class="ws-grid">
      <div class="card panel">
        <div class="flex between wrapcol" style="margin-bottom:.6rem"><h3 style="margin:0">🗺️ Útvonal</h3>
          <div class="flex" style="gap:.5rem">
            <label class="btn btn-ghost btn-sm" style="cursor:pointer">📁 GPX feltöltése<input type="file" id="gpx-in" accept=".gpx" hidden></label>
            <button class="btn btn-ghost btn-sm" id="gpx-out">⬇ GPX mentés</button>
            <a class="btn btn-primary btn-sm" target="_blank" rel="noopener" id="nav-go" ${hasMap?"":`href="#!" data-nova="1"`}>🧭 Navigáció indítása</a>
          </div></div>
        <div class="mapbox tall" id="ws-map" style="${hasMap?"":"min-height:220px"}"></div>
        <div class="meta" style="margin-top:.7rem"><span>🚗 Kiinduló: <b>${esc(t.place||"—")}</b></span>${t.waypoints.length?`<span>📍 Fontos pontok: ${t.waypoints.map(w=>esc(w.name)).join(", ")}</span>`:""}</div>
        <p class="small muted mb0">💡 A feltöltött GPX a valós útvonalat rajzolja ki a térképre és a profilra.</p>
      </div>
      <div>
        <div class="card panel">
          <h3>⛰️ Magassági profil</h3>
          ${t.gpx?(function(){ const el = t.gpx.elev;
            return `<svg viewBox="0 0 100 34" style="width:100%;height:120px" preserveAspectRatio="none">
              <polygon points="0,32 ${el.map((v,i)=>`${i/(el.length-1)*100},${32-v/Math.max(...el)*28}`).join(" ")} 100,32" fill="rgba(47,107,74,.18)"/>
              <polyline points="${el.map((v,i)=>`${i/(el.length-1)*100},${32-v/Math.max(...el)*28}`).join(" ")}" fill="none" stroke="var(--moss)" stroke-width="1.6"/></svg>
              <div class="meta" style="font-size:.78rem"><span>Min ${Math.min(...el)*10}–${Math.max(...el)*12} m*</span><span>*becsült skála</span></div>`;})()
            : '<p class="muted small mb0">Tölts fel GPX-t a magassági profil megjelenítéséhez.</p>'}
        </div>
        <div class="card panel" style="margin-top:14px"><h3>📍 Fontos pontok</h3>
          <div id="wp-list">${t.waypoints.map((w,i)=>`<div class="flex between" style="padding:.25rem 0"><span>#${i+1} ${esc(w.name)}</span><button class="icon-btn" style="width:26px;height:26px" data-rmwp="${i}">✕</button></div>`).join("")||'<p class="muted small mb0">Kattints a térképre pont hozzáadásához.</p>'}</div>
          <div class="flex" style="margin-top:.6rem;gap:.5rem"><input class="input" id="wp-name" placeholder="Pl. Forrás, kilátó…"><button class="btn btn-soft btn-sm" id="wp-add">Hozzáad</button></div>
        </div>
      </div></div>`;
  }
  case "idoter": {
    return `<div class="card panel">
      <div class="flex between wrapcol"><h3 style="margin:0">⏰ Időterv — ${(t.timeline||[]).length} pont</h3>
        <button class="btn btn-soft btn-sm" id="tl-add">➕ Új időpont</button></div>
      <p class="small muted">Egyszerű szerkesztés: húzd feljjebb-lejjebbvel a ↕ nyilakkal, vagy írd át közvetlen a szöveget.</p>
      <div class="grid" style="gap:2px">
      ${t.timeline.map((x,i)=>`
        <div class="tl-item" data-tl="${x.id}">
          <input class="input tl-time" size="5" style="width:86px;text-align:center" value="${esc(x.t)}" data-tlk="${x.id}:t" aria-label="Időpont">
          <span class="tl-line"><span class="tl-dot"></span></span>
          <input class="input flex" style="border:0;background:transparent;box-shadow:none;flex:1;font-weight:500" value="${esc(x.l)}" data-tlk="${x.id}:l">
          <span class="tl-tools flex" style="gap:.2rem">
            <button class="icon-btn" style="width:26px;height:26px" data-tlmv="${x.id}:-1" title="Fel">↑</button>
            <button class="icon-btn" style="width:26px;height:26px" data-tlmv="${x.id}:1" title="Le">↓</button>
            <button class="icon-btn" style="width:26px;height:26px" data-tldel="${x.id}" title="Törlés">✕</button></span>
        </div>${i<t.timeline.length-1?'<div style="height:14px;border-left:2px dashed var(--leaf);margin-left:52px"></div>':''}`).join("")}</div>
      ${t.status==="teljesítve"?`<div class="alert-strip" style="margin-top:.8rem;background:#EAF3E8;border-color:#cfe0cf;color:#2C6B2E">✓ ezt a túrát ${fmtDateFull(t.doneAt||t.date)}-án teljesítetted — az időterv a valós ritmusod alapján szerkeszthető a következő alkalomra.</div>`:""}
    </div>`;
  }
  case "felszereles": {
    const todo=t.gear.filter(g=>!g.checked), ok=t.gear.filter(g=>g.checked);
    return `<div class="gear-cols">
      <div class="card panel"><h3>🎒 Ajánlott a túra alapján <span class="chip chip-green">${Math.round(pct(t.gear)*100)}%</span></h3>
        <p class="small muted">A rendszer ${t.lengthKm||"?"} km, ${t.durationH||"?"} óra, ${esc(t.difficulty)} szint ${t.weatherRain?"és esős előrejelzés":""} alapján rakta össze.</p>
        ${ok.concat(todo).map(g=>`<label class="ck ${g.checked?"done":""}">
          <input type="checkbox" data-gear="${g.name.replace(/"/g,"'")}" ${g.checked?"checked":""}> ${g.icon||"🧰"} ${esc(g.name)}
          ${g.own?'<span class="gear-badge" style="margin-left:auto">a te cuccod ✓</span>':'<span class="gear-badge '+(g.checked?"":"")+'" style="margin-left:auto">'+(g.checked?"beepakolva":"beepakolandó")+'</span>'}
          </label>`).join("")}
      </div>
      <div class="card panel"><h3>🏠 Saját felszerelésem</h3>
        ${Store.myData().equipment.map(g=>`<div class="flex between" style="padding:.35rem 0;border-bottom:1px solid var(--line)">
          <span>${g.icon||"🧰"} ${esc(g.name)}</span>
          <span class="chip ${g.has?"chip-green":"chip-ember"}">${g.has?"megvan":"nincs meg"}</span></div>`).join("")}
        <a class="btn btn-soft btn-sm btn-block" style="margin-top:.8rem" href="#/felszereles">→ Részletes kezelés (állapot, jegyzet)</a>
        <div class="flex" style="margin-top:.8rem;gap:.5rem"><input class="input" id="gearq" placeholder="Plusz elem hozzáadása ehhez a túrához…"><button class="btn btn-primary btn-sm" id="gearadd">Hozzáad</button></div>
      </div></div>`;
  }
  case "resztvevok": {
    return `<div class="ws-grid"><div class="card panel">
      <div class="flex between wrapcol"><h3 style="margin:0">👥 Résztvevők (${t.participants.length})</h3>
        <div class="flex" style="gap:.5rem"><input class="input" id="pname" placeholder="Név" style="width:160px"><button class="btn btn-primary btn-sm" id="padd">Meghívás</button></div></div>
      ${t.participants.map(p=>`<div class="flex between" style="padding:.55rem 0;border-bottom:1px solid var(--line)">
        <span class="person-chip"><span class="avt">${initials(p.name)}</span>${esc(p.name)}</span>
        <div class="flex" style="gap:.5rem">
          <button class="btn btn-sm ${p.confirmed?"btn-soft":"btn-ember"}" data-pconf="${p.id}">${p.confirmed?"✓ Megvan a megerősítés":"Megerősítés kérése"}</button>
          <button class="icon-btn" style="width:30px;height:30px" data-prm="${p.id}">✕</button></div></div>`).join("")||
        '<p class="muted">Hívd meg, kivel mész — a lista megjelenik az utazásszervezésnél is.</p>'}
      </div><div>
      <div class="card panel"><h3>🔗 Meghívó</h3>
        <p class="small muted">Hamarosan e-mailben és linkkel is mehet. Addig oszd meg a terved linkjét:
        <button class="btn btn-soft btn-sm" data-wsshare-like>${t.shareCode?"🔗 "+t.shareCode.slice(0,10):"Kód generálása"}</button></p></div>
      </div></div>`;
  }
  case "utazas": {
    const freeSeats = t.cars.reduce((s,c)=>s+c.seats-c.assigned.length,0);
    const people = t.participants.map(p=>p.name);
    const carless = people.filter(n=>!t.cars.some(c=>c.assigned.includes(n)));
    return `<div class="ws-grid"><div class="card panel">
      <h3>🚗 Autók és helyek</h3>
      <p class="small muted">Találkozási pont: <b>${esc(t.meeting||"még nincs rögzítve — add meg lent")}</b> · szabad hely: <b>${freeSeats}</b></p>
      ${t.cars.map(c=>`<div class="carbox ${c.assigned.length<c.seats?"":"full"}" style="margin-bottom:.8rem">
        <div class="flex between"><span class="person-chip"><span class="avt">${initials(c.driver)}</span>${esc(c.driver)} sofőr</span>
          <span class="chip ${c.assigned.length<c.seats?"chip-green":"chip-sand"}">${c.seats-c.assigned.length} szabad hely</span></div>
        <div>${c.assigned.map(a=>`<span class="seat">${esc(a)} <button data-seat="${c.id}:${a}" aria-label="Leváltatás">✕</button></span>`).join("")||'<span class="seat empty">— helyek szabadok —</span>'}</div>
        ${carless.length&&c.assigned.length<c.seats?`<div class="flex" style="margin-top:.5rem;gap:.4rem"><select class="input" style="max-width:190px" id="as-${c.id}">${carless.map(n=>`<option>${esc(n)}</option>`).join("")}</select>
          <button class="btn btn-soft btn-sm" data-seatadd="${c.id}">Beül ✚</button></div>`:""}
      </div>`).join("")||'<p class="muted">Még nincs felírva sofőr.</p>'}
      <div class="flex" style="gap:.5rem;margin-top:1rem"><input class="input" id="cdriver" placeholder="Sofőr neve (pl. te)" value="${esc(Store.me().name)}" style="max-width:220px">
        <select class="input" id="cseats" style="width:110px"><option>3</option><option>1</option><option>2</option><option>4</option><option>5</option></select>
        <button class="btn btn-primary btn-sm" id="addcar">Autó hozzáadása</button></div>
      <div class="flex" style="gap:.5rem;margin-top:1rem"><input class="input" id="meet-in" placeholder="📍 Találkozás helye és ideje (pl. Csíkszereda, pályaudvar, 05:30)" value="${esc(t.meeting)}">
        <button class="btn btn-soft btn-sm" id="meet-save">Mentés</button></div>
    </div>
    <div class="card panel"><h3>💡 Ötletek</h3>
      <ul style="padding-left:1.1rem;color:var(--bark-soft);font-size:.92rem"><li class="mt0">A sofőrök és utasok listája a Biztonság fülön is megjelenik — indulás előtt ellenőrizheted.</li>
      <li>Távmegbeszélés helyett a résztvevők fülön jelzett “megerősítés” státusz segít: aki nem mondta, az ott sincs.</li>
      <li>10+ fős csapatnál érdemes két autón oszolni a csomagokat.</li></ul></div></div>`;
  }
  case "ete": {
    const l = Math.round((t.durationH||3)/2)||1;
    return `<div class="ws-grid"><div class="card panel">
      <h3>💧 Víz- és ételbecslés</h3>
      <p class="muted small mt0">${t.durationH||3} órás túrához:</p>
      <div class="grid g3 smm2">
        <div class="stat-tile card"><span class="st-ic">💧</span><b>~${l} l / fő</b><span>vízminimum — melegebb időben +1 l</span></div>
        <div class="stat-tile card"><span class="st-ic">🥪</span><b>${t.durationH>=4?"2×":"1×"}</b><span>étkezés + uzsonna</span></div>
        <div class="stat-tile card"><span class="st-ic">🍌</span><b>gyors energia</b><span>banán, energia-szelet, mogyoró</span></div></div>
      <div id="gasp"></div>
      <p class="small muted" style="margin-top:.9rem">A tetőn a legfontosabb a víz megspórolása — a fél óra alatt fél liter is elfogy. ${t.weatherRain?"<span class=\"warn-ic\">Esőben mehet termosz forró tea.</span>":""}</p>
    </div>
    <div class="card panel"><h3>🧺 Bevásárlólista</h3>
      ${t.food.map(f=>`<label class="ck ${f.checked?"done":""}"><input type="checkbox" data-food="${f.id}" ${f.checked?"checked":""}> ${f.i||""} ${esc(f.n)}</label>`).join("")}
      <div class="flex" style="margin-top:.7rem;gap:.5rem"><input class="input" id="fadd" placeholder="Pl. Energiaszelet, sonka,alma"><button class="btn btn-soft btn-sm" id="faddb">Hozzáad</button></div>
    </div></div>`;
  }
  case "jegyzet": {
    return `<div class="card panel">
      <h3>🗒️ Jegyzetek</h3>
      <p class="small muted">Ez a túra magán-jegyzetfüzete — a részleteket ne a Messengerbe temesd, ide.</p>
      <textarea class="input" id="ws-notes" rows="8" placeholder="Pl. Ne felejtsük a fejlámpákat! Zsolt viszi a termoszos kávét.">${esc(t.notes||"")}</textarea>
      <div class="flex" style="margin-top:.8rem;justify-content:flex-end"><button class="btn btn-primary btn-sm" id="notes-save">✓ Mentés</button></div>
    </div>`;
  }
    case "koltseg": {
    const B = t.budget || [];
    const cats = ["Belépő","Szállás / panzió","Étel, ital","Utazás, üzemanyag","Egyéb"];
    const sumAll = B.reduce((a,x)=>a+(+x.amt||0),0);
    const sumSplit = B.filter(x=>x.split).reduce((a,x)=>a+(+x.amt||0),0);
    const heads = 1 + (t.participants||[]).length;
    return `<div class="split2" style="grid-template-columns:1.05fr .95fr;gap:18px;align-items:start">
      <div class="card panel">
        <h3>💶 Költség-terv — ${esc(t.title)}</h3>
        <p class="small muted mt0">A csapatostul fizetett tételek (belépő, panzió, csoportétel, bench-üzemanyag) oszlanak fejenként; a saját cucc neked marad.</p>
        <div class="bud-list">
        ${B.map(b=>`<div class="bud-row">
          <input type="checkbox" data-bsplit="${b.id}" ${b.split?"checked":""} title="fejenként osztható">
          <b>${esc(b.n)}</b><span class="muted small">${esc(b.cat)}</span>
          <span class="bud-amt">${(+b.amt||0).toLocaleString("hu-HU")} € ${b.split?"<small class=\"muted\">÷"+heads+" fő ≈ "+((+b.amt||0)/heads).toLocaleString("hu-HU")+" €</small>":""}</span>
          <button class="icon-btn" style="width:26px;height:26px" data-bdel="${b.id}" aria-label="törlés">✕</button>
        </div>`).join("")||'<p class="muted small">Még nincs tételed — írd be a költéseket, a táblázat adja a fejenkénti_SUM_</p>'}
        </div>
        <div class="budget-add">
          <input class="input" id="bud-n" placeholder="Pl. Panzió, Gyilkostó">
          <select class="input" id="bud-c">${cats.map(c=>`<option>${c}</option>`).join("")}</select>
          <input class="input" id="bud-a" type="number" min="0" placeholder="9" style="width:84px">
          <label class="ck" style="white-space:nowrap"><input type="checkbox" id="bud-s" checked> csapatos</label>
          <button class="btn btn-primary btn-sm" id="bud-add">Hozzáad</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card panel"><h3>Összegzés</h3>
          <div class="bud-sum"><b>${sumAll.toLocaleString("hu-HU")} €</b><span class="muted">az összes költség</span></div>
          <div class="bud-sum"><b>${sumSplit.toLocaleString("hu-HU")} €</b><span class="muted">osztható, ${heads} fővel</span></div>
          <div class="bud-sum"><b>${sumSplit ? (sumSplit/heads).toLocaleString("hu-HU", {maximumFractionDigits:0}) + " €" : "—"}</b><span class="muted">fejenként (a csoportszám)</span></div>
          <p class="small muted">Tipp: a saját utazást és a egyéni vacsorát ne pipáld csapatosra — különben mindenki tol egy üres zsebet.</p>
          <a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="https://www.settle-up.com">↗ Csoportszámolás (kütyü, ingyenes app)</a>
        </div>
        <div class="card panel"><h3>Naptár-adag ${heads}</h3>
          <p class="small muted mt0 mb0">A ${heads}-fős társaságra számolva: a víz és uzsonna ${heads}× az étel- és víztáblázatra írva — a Felszerelés fül „Víz” tételeit érdemes ennyivel duplicálni.</p></div>
      </div></div>`;
  }
case "biztonsag": {
    return `<div class="ws-grid"><div class="card panel">
      <h3><span class="warn-ic">🧯</span> Biztonsági ellenőrzőlista — indulás előtt</h3>
      ${t.safety.map((s,i)=>`<label class="ck ${s.checked?"done":""}" style="border-bottom:1px solid var(--line)"><input type="checkbox" data-safety="${i}" ${s.checked?"checked":""}> <span style="font-size:1.35rem;margin-right:.2rem">${i<3?"⚠️":"✓"}</span>${esc(s.n)}</label>`).join("")}
      <div class="alert-strip" style="margin-top:1rem"><span>🆘</span><div>Baleset esetén a <b>112</b>. Tájékozódás nélkül ne indulj: offline térkép és a megosztott túraplan legyen kéznél.</div></div>
    </div>
    <div class="card panel"><h3>🔗 Túraterv megosztása</h3>
      <p class="small muted">A link birtokában a csapat (vagy a szüleid) látják, merre mész és mikor térsz haza — valódi megosztás hamarosan.</p>
      <div class="flex"><input class="input" readonly value="${t.shareCode?`https://turatars.ro/t/${t.shareCode.slice(0,20)}`:"még nincs kód"}" id="share-url">
        <button class="btn btn-ghost btn-sm" data-wsshare>${t.shareCode?"⧉ Másolás":"Kód generálása"}</button></div>
    </div></div>`;
  }
  case "fotok": {
    return `<div class="card panel">
      <div class="flex between wrapcol"><h3 style="margin:0">📸 Fényképek</h3><span class="chip chip-sand">${t.photos.length} kép</span></div>
      <p class="small muted">A teljesített túra képei automatikusan ide kerülnek a naplóból — de most is dobj ide egy mood-boardot.</p>
      ${(t.photos||[]).length? `<div class="ph-grid" style="margin:1rem 0">${t.photos.map(p=>`<label class="img-wrap" style="aspect-ratio:1;border-radius:12px">${imgTag(p,"túra kép")}<input type="checkbox" data-photo-del="${p}" style="position:absolute;top:6px;right:6px;accent-color:#B3372A" title="jelöld be, és nyomd a Törlést"></label>`).join("")}</div>
        <button class="btn btn-danger btn-sm" id="p-del">Kijelölt képek törlése</button>`
        : `<div class="empty" style="padding:2rem"><span class="em-ico">🖼️</span><p>Még nincs kép</p><label class="btn btn-primary btn-sm" style="cursor:pointer">📷 Kép feltöltése<input type="file" id="p-up" accept="image/*" multiple hidden></label></div>`}
      ${t.photos.length?`<div class="flex" style="margin-top:1rem;gap:.5rem"><label class="btn btn-soft btn-sm" style="cursor:pointer">📷 További képek<input type="file" id="p-up" accept="image/*" multiple hidden></label></div>`:""}
    </div>`;
  }
  case "naplo": {
    const j = Store.myData().journal.find(x=>x.tourId===t.id);
    let main;
    if(t.status!=="teljesítve"){
      main = `<div class="flex between wrapcol" style="margin-bottom:.4rem"><b>📖 Túranapló</b>
        <button class="btn btn-ember btn-sm" id="j-complete">✓ Teljesítettem — irány a naplózás</button></div>
        <p class="muted">Amikor lezárult a túra, a fenti gombbal tudod naplózni: értékelés, jegyzet, képek — a többit (dátum, hely, táv, idő) a rendszer átveszi a tervből.</p>
        <div class="alert-strip"><span>🤖</span><div>A túra után a rendszer megkérdez: „Teljesítetted a túrát?” — egy koppintás, és itt vagy a naplózásban.</div></div>`;
    } else if(j){
      main = `<h3>📖 A naplód bejegyzése — ${fmtDateFull(j.date)}</h3>
        <div class="stars" style="color:var(--ember);font-size:1.3rem">${"★".repeat(j.rating||0)}${"☆".repeat(5-(j.rating||0))}</div>
        <p style="font-size:1.05rem">„${esc(j.note||"—")}”</p>
        <div class="meta"><span>📏 ${j.km} km</span><span>⬆ ${j.up} m</span><span>⏱ ${j.h} ó</span></div>
        ${(j.photos||[]).length?`<div class="ph-grid" style="margin-top:1rem">${j.photos.map(p=>`<div class="img-wrap">${imgTag(p,"")}</div>`).join("")}</div>`:""}
        <div class="flex" style="margin-top:1rem"><button class="btn btn-soft btn-sm" id="j-edit">✎ Jegyzet szerkesztése</button></div>`;
    } else {
      main = `<h3>Teljesítetted — de a naplóbejegyzés még hiányzik</h3>
        <p class="muted">Írd meg pár sorban, milyen volt. Ez a digitális túranaplód lapja lesz.</p>
        <button class="btn btn-ember" id="j-add">➕ Bejegyzés írása</button>`;
    }
    return `<div class="ws-grid"><div class="card panel">${main}</div>
      <div class="card panel"><h3>📊 Túraadatai (automatikus)</h3>
        <div class="meta" style="gap:.3rem"><span>📅 ${t.date?fmtDateFull(t.date):"—"}</span><span>📍 ${esc(t.place||t.region||"—")}</span>
        <span>📏 ${t.lengthKm||"—"} km</span><span>⬆ ${t.ascent||"—"} m</span><span>⏱ ${t.durationH||"—"} ó</span><span>⛰ ${esc(t.difficulty)}</span></div></div></div>`;
  }
  }
  return "";
}

/* ---------- FÜL ESEMÉNYKEZELŐK ---------- */
function wireTab(root, t){
  const q=s=>root.querySelector(s); const qa=s=>[...root.querySelectorAll(s)];
  qa(".jumpto").forEach(a=>a.onclick=e=>{e.preventDefault(); wsTab=a.dataset.j; render();});
  switch(wsTab){
  case "attekintes":
    qa("[data-j]").forEach(a=>a.onclick=()=>{ wsTab=a.dataset.j; render(); });
    break;
  case "utvonal": {
    const mapEl=q("#ws-map");
    if(window.L && mapEl && !mapEl._lmade){
      mapEl._lmade=true;
      const m = MapKit.make(mapEl, {zoom:13, center:t.coords?[t.coords.lat,t.coords.lng]:null});
      if(m){ if(t.coords){ m.setView([t.coords.lat,t.coords.lng], 13);
          MapKit.pin(m,t.coords.lat,t.coords.lng,"pin-plan",`🚗 Kiinduló / parkoló<br><b>${esc(t.place)}</b>`);
          }
          if(t.gpx&&t.gpx.line){ L.polyline(t.gpx.line,{color:"#1C4A36",weight:4}).addTo(m); m.fitBounds(t.gpx.line); }
          t.waypoints.forEach(w=>MapKit.pin(m,w.lat,w.lng,"pin-wish",esc(w.name)));
          m.on("click", e=>{ const name=t.waypoints.length? t.waypoints.length+1 : 1; t.waypoints.push({id:Store.uid("wp"),name:"Pont "+name,lat:e.latlng.lat,lng:e.latlng.lng}); Store.save(); render(); });
        }
    }
    const gpx=q("#gpx-in");
    if(gpx) gpx.onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader();
      r.onload=()=>{ try{
        const xml=new DOMParser().parseFromString(r.result,"text/xml");
        const pts=[...xml.querySelectorAll("trkpt")].map(n=>({lat:+n.getAttribute("lat"),lng:+n.getAttribute("lon"),ele:+(n.children[0]&&n.children[0].textContent||0)}));
        if(!pts.length) throw 0;
        const line=pts.map(p=>[p.lat,p.lng]);
        let dist=0; for(let i=1;i<pts.length;i++){ const d=geo(pts[i-1],pts[i]); if(d<2200) dist+=d; } // szegmentumszűrés
        const eles=[...pts.map(p=>p.ele).filter(x=>x>100), ...pts.map((_,i)=>20)] // fallback profil
        ; const prof=eles.slice(0,200).length?[...Array(40)].map((_,i)=>{ const p=pts[Math.floor(i/40*pts.length)]; return p.ele||20; }):[...Array(40)].map((_,i)=>20);
        Store.updateTour(t.id,{ gpx:{pts, line, elev:prof.length===40?prof:[20,40,60,40,20]}, waypoints: pts.filter((_,i)=>i%Math.ceil(pts.length/6)===0).slice(0,6) });
        toast("GPX beolvasva — a valódi útvonal a térképed! 🗺","📁"); render();
      }catch(err){ toast("A GPX fájlt nem tudtam beolvasni — ellenőrizd a formátumot.","⚠️"); } };
      r.readAsText(f); };
    const goBtn=q("#nav-go");
    if(goBtn){ if(t.coords) goBtn.href=`https://www.google.com/maps/dir/?api=1&destination=${t.coords.lat},${t.coords.lng}&travelmode=walking`;
      else goBtn.onclick=e=>{ e.preventDefault(); toast("Add meg előbb a helyszínt az Új túra folyamatban.","📍"); }; }
    q("#gpx-out").onclick=()=>{ if(!t.coords){ toast("Nincs mentett útvonal — tölts fel GPX-t vagy válassz katalógus-túrát.","⚠️"); return; }
      const line = (t.gpx&&t.gpx.pts)||[[t.coords.lat,t.coords.lng]]; const trkpts=line.map(p=>`<trkpt lat="${p.lat}" lon="${p.lng}"></trkpt>`).join("");
      const gpxTxt=`<?xml version="1.0"?><gpx version="1.1" creator="Túratárs" xmlns="http://www.topografix.com/GPX/1/1"><trk><name>${esc(t.title)}</name><trkseg>${trkpts}</trkseg></trk></gpx>`;
      const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([gpxTxt],{type:"application/gpx+xml"})); a.download=(t.title||"tura")+".gpx"; a.click(); toast("GPX mentve","📁"); };
    qa("[data-rmwp]").forEach(b=>b.onclick=()=>{ t.waypoints.splice(+b.dataset.rmwp,1); Store.save(); render(); });
    const add=q("#wp-add"); if(add) add.onclick=()=>{
      if(!t.coords){ toast("Előbb jelölj ki egy helyszínt — a térképre kattintva adhatsz pontot.","📍"); return; }
      const n=q("#wp-name").value.trim(); if(!n) return;
      t.waypoints.push({id:Store.uid("wp"),name:n, lat:t.coords.lat+(Math.random()-.5)/9, lng:t.coords.lng+(Math.random()-.5)/9});
      Store.save(); render(); };
    break; }
  case "idoter":
    qa("[data-tlk]").forEach(i=>i.onchange=()=>{ const [id,k]=i.dataset.tlk.split(":"); const x=t.timeline.find(y=>y.id===id); if(x) x[k]=i.value; Store.save(); toast("Időterv mentve","⏱"); });
    qa("[data-tlmv]").forEach(b=>b.onclick=()=>{ const [id,dir]=b.dataset.tlmv.split(":"); const i=t.timeline.findIndex(x=>x.id===id), j=i+ +dir;
      if(j>=0&&j<t.timeline.length){ [t.timeline[i],t.timeline[j]]=[t.timeline[j],t.timeline[i]]; Store.save(); render(); } });
    qa("[data-tldel]").forEach(b=>b.onclick=()=>{ t.timeline=t.timeline.filter(x=>x.id!==b.dataset.tldel); Store.save(); render(); });
    q("#tl-add").onclick=()=>{ t.timeline.push({id:Store.uid("tl"),t:"12:00",l:"Új pont — írd át",ty:"tura"}); t.timeline.sort((a,b)=>a.t.localeCompare(b.t)); Store.save(); render(); };
    break;
  case "felszereles":
    qa("[data-gear]").forEach(c=>c.onchange=()=>{ const g=t.gear.find(x=>x.name===c.dataset.gear); if(g) g.checked=c.checked; Store.save(); renderNotifSafe(); render(); });
    const gaf=q("#gearadd"); if(gaf) gaf.onclick=()=>{ const n=q("#gearq").value.trim(); if(!n) return;
      t.gear.push({name:n, cat:"Egyéb", icon:"➕", checked:false, own:false, note:""}); Store.save(); render(); };
    break;
  case "resztvevok":
    q("#padd").onclick=()=>{ const n=q("#pname").value.trim(); if(!n) return;
      t.participants.push({id:Store.uid("p"),name:n,confirmed:false}); Store.save(); render(); };
    qa("[data-pconf]").forEach(b=>b.onclick=()=>{ const p=t.participants.find(x=>x.id===b.dataset.pconf);
      p.confirmed=!p.confirmed; Store.save(); render(); });
    qa("[data-prm]").forEach(b=>b.onclick=()=>{ t.participants=t.participants.filter(x=>x.id!==b.dataset.prm);
      t.cars.forEach(c=>c.assigned=c.assigned.filter(n=>t.participants.some(p=>p.name===n)||n===c.driver)); Store.save(); render(); });
    break;
  case "utazas":
    q("#addcar") && (q("#addcar").onclick=()=>{ const d0=q("#cdriver").value.trim(); if(!d0) return;
      t.cars.push({id:Store.uid("c"),driver:d0,seats:+q("#cseats").value||3,assigned:[]}); Store.save(); render(); });
    q("#meet-save") && (q("#meet-save").onclick=()=>{ Store.updateTour(t.id,{meeting:q("#meet-in").value}); toast("Találkozás mentve","📍"); render(); });
    qa("[data-seatadd]").forEach(b=>b.onclick=()=>{ const c=t.cars.find(x=>x.id===b.dataset.seatadd); const n=q("#as-"+c.id).value;
      if(c.assigned.filter(a=>a!=="—").length<c.seats) c.assigned.push(n); Store.save(); render(); });
    qa("[data-seat]").forEach(b=>b.onclick=()=>{ const [cid,nm]=b.dataset.seat.split(":");
      const c=t.cars.find(x=>x.id===cid); c.assigned=c.assigned.filter(a=>a!==nm); Store.save(); render(); });
    break;
  case "ete":
    qa("[data-food]").forEach(c=>c.onchange=()=>{ const f=t.food.find(x=>x.id===c.dataset.food); f.checked=c.checked; Store.save(); render(); });
    q("#faddb").onclick=()=>{ const n=q("#fadd").value.trim(); if(!n) return; t.food.push({id:Store.uid("fd"),n,i:"🥫",checked:false}); Store.save(); render(); };
    break;
  case "jegyzet":
    q("#notes-save").onclick=()=>{ Store.updateTour(t.id,{notes:q("#ws-notes").value}); toast("Jegyzet mentve","🗒"); };
    break;
  case "koltseg": {
    if (!t.budget) t.budget = [];
    root.querySelector("#bud-add").onclick = () => {
      const n = root.querySelector("#bud-n").value.trim();
      const amt = +root.querySelector("#bud-a").value || 0;
      if (!n || !amt) { toast("Adj nevet és összeget","🧾"); return; }
      t.budget.push({ id: Store.uid("bz"), n, cat: root.querySelector("#bud-c").value, amt, split: root.querySelector("#bud-s").checked });
      Store.save(); render();
    };
    root.querySelectorAll("[data-bdel]").forEach(b => b.onclick = () => { t.budget = t.budget.filter(x => x.id !== b.dataset.bdel); Store.save(); render(); });
    root.querySelectorAll("[data-bsplit]").forEach(c => c.onchange = () => { const b = t.budget.find(x => x.id === c.dataset.bsplit); if (b) b.split = c.checked; Store.save(); render(); });
    break; }
  case "biztonsag":
    qa("[data-safety]").forEach(c=>c.onchange=()=>{ t.safety[+c.dataset.safety].checked=c.checked; Store.save(); render({silent:true}); });
    break;
  case "fotok":
    q("#p-up") && (q("#p-up").onchange = e => {
      [...e.target.files].slice(0,6).forEach(f=>{ const r=new FileReader();
        r.onload=()=>{ t.photos.push(r.result); Store.save(); render(); }; r.readAsDataURL(f); }); });
    const pdel=q("#p-del"); if(pdel) pdel.onclick=()=>{
      qa("[data-photo-del]").forEach(ch=>{ if(ch.checked) t.photos=t.photos.filter(p=>p!==ch.dataset.photoDel); }); Store.save(); render(); };
    break;
  case "naplo":
    const jc=q("#j-complete"); if(jc) jc.onclick=()=> finishFlow(t);
    const ja=q("#j-add"); if(ja) ja.onclick=()=> finishFlow(t,true);
    const je=q("#j-edit"); if(je) je.onclick=()=> finishFlow(t,true);
    break;
  }
}
function geo(a,b){ const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLon=(b.lng-a.lng)*Math.PI/180;
  const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(s)); }
function render(){ window.App && App.render && App.render({}) ; }

/* ---------- KÖZÖS FOLYAMATOK ---------- */
function finishFlow(t, forceLog){
  if(t.status==="teljesítve" && (forceLog||Store.myData().journal.some(j=>j.tourId===t.id))){ journalModal(t); return; }
  if(t.status!=="teljesítve"){
    openModal({ title:`${esc(t.title)}` , body:`<div class="hcard" style="min-height:120px">${imgTag(t.img||IMG.erdo,"")}<div class="hb"><b style="font-size:1.05rem">Teljesítetted ezt a túrát?</b><div class="meta"><span>${t.date?fmtDateFull(t.date):""} · ${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m</span></div></div></div>
      <p class="muted small">Ha igen: értékelés + jegyzet + képek — és a többi (dátum, hely, táv, idő) automatikusan a naplódra kerül.</p>
      <div class="flex" style="gap:.6rem;justify-content:flex-end;margin-top:1rem"><button class="btn btn-ghost btn-sm" data-close>Még nem</button>
      <button class="btn btn-ember btn-lg" id="ff-yes">✓ Teljesítettem</button></div>`,
      onOpen(r){ r.querySelector("#ff-yes").onclick=()=>{ closeModal(); journalModal(t, true); }; }});
  } else journalModal(t);
}
function journalModal(t, markDone){
  openModal({ title:`📖 Túranapló — ${esc(t.title)}`,
    body:`<p class="muted mt0 small">${fmtDateFull(t.date||t.doneAt)} · ${esc(t.region||t.place||"")} · ${t.lengthKm} km · ⬆ ${t.ascent} m · ⏱ ${t.durationH} ó</p>
      <label class="f">Értékelés</label><div id="jm-stars" style="font-size:2rem;display:flex;gap:.15rem">${[1,2,3,4,5].map(i=>`<button data-s="${i}" style="background:none;border:0;cursor:pointer;color:#cfcabb" aria-label="${i} csillag">★</button>`).join("")}</div>
      <label class="f" style="margin-top:.5rem">Saját jegyzet</label><textarea class="input" id="jm-note" rows="3" placeholder="Pl. Gyönyörű idő volt. A felső szakasz sáros volt, de megérte."></textarea>
      <label class="f" style="margin-top:.7rem">📸 Képek</label><input type="file" id="jm-ph" accept="image/*" multiple class="input" style="padding:.55em">`,
    footer:`<button class="btn btn-primary btn-block btn-lg" id="jm-save">✓ Mentés a túranaplóba</button>`,
    onOpen(r){ let stars=5; const draw=()=>r.querySelectorAll("[data-s]").forEach(s=>s.style.color=s.dataset.s<=stars?"var(--ember)":"#cfcabb");
      r.querySelectorAll("[data-s]").forEach(s=>s.onclick=()=>{stars=+s.dataset.s;draw();}); draw();
      r.querySelector("#jm-save").onclick=()=>{
        const fs=[...r.querySelector("#jm-ph").files].slice(0,6);
        const finalize=()=>{ Store.completeTour(t.id, stars, r.querySelector("#jm-note").value, imgs); if(markDone) Store.updateTour(t.id,{status:"teljesítve"});
          closeModal(); toast("Felkerült a túranaplódba — ez a te sztorid. 📖","✓"); wsTab="naplo"; render(); };
        let imgs=t.photos||[];
        if(fs.length){ let n=0; const tmp=[]; fs.forEach(f=>{ const rd=new FileReader(); rd.onload=()=>{ tmp.push(rd.result); if(++n===fs.length){ imgs=[...tmp, ...imgs]; finalize(); } }; rd.readAsDataURL(f); }); }
        else finalize(); }; } });
}
function sharePlan(t){
  if(!t.shareCode){ t.shareCode = Store.uid("sh")+Math.random().toString(36).slice(2,8); Store.save(); }
  openModal({ title:"🔗 Túraterv megosztása",
    body:`<p class="muted mt0 small">Ezt a linket elküldheted a csapatnak (és a szüleidnek): látják az útvonalat, az időtervet és a csomaglistát. A megosztás csak olvasható.</p>
      <div class="flex"><input class="input" id="shr-url" readonly value="https://turatars.ro/t/${t.shareCode.slice(0,18)}"><button class="btn btn-primary btn-sm" id="shr-copy">⧉ Másolás</button></div>
      <div class="alert-strip" style="margin-top:1rem"><span>🛠</span><div>A valódi, nyilvános megosztott oldal a következő verzióban élesedik — a kódot már most használhatod.</div></div>` });
}

/* ==== upgrade ==== */
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
  const widgets = order.map(k=>{
    const widget = W[k];
    const rendered = typeof widget === "function" ? widget() : (widget || "");
    return `<section class="wsec" data-w="${k}" draggable="false"><div class="wsec-grip" title="Húzd átrendezéshez">⠿</div>${rendered}</section>`;
  }).join("");
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

/* ==== project ==== */
/* ============================================================
   TÚRATÁRS V16 — TÚRAPROJEKT KÖZPONT (project.js)
   Időjárás-chip, dinamikus készültség, AI-terv a túrán belül,
   Inbox (linkek/események → saját túraprojekt), teendők,
   csomagolósúly-összevonás (étel a hátizsákba), Túra mód V2,
   publikus → tervezés hidak, dashboard-szabályozott rend.
   ============================================================ */
"use strict";
(function(){

const uidp = p => p + "_" + Math.random().toString(36).slice(2,9);
const num = v => Math.max(0, Math.round(+v||0));
const D = () => Store.myData();

/* ---------- 0) séma-védelem ---------- */
function ensureTourFields(t){
  if(!t.tasks) t.tasks=[];
  if(!t.noteStream) t.noteStream=[];
  return t;
}
const _origMyData = Store.myData;
Store.myData = function(){ const d=_origMyData.call(Store); if(!d) return d;
  (d.tours||[]).forEach(ensureTourFields);
  if(!d.inbox) d.inbox=[];
  return d; };

/* ---------- 1) KOCSONYAGTÁR ↔ csomagolás: súly a háti zsákban, étellel együtt ---------- */
const _origPack = Store.backpack;
Store.backpack = function(t){
  const b = _origPack.call(Store, t);
  const foodG = (t.food||[]).reduce((a,f)=>a+(+f.w||0),0);
  if(foodG>0){ b.rows = b.rows.concat([{cat:"Étel és víz", g:foodG}]).sort((x,y)=>y.g-x.g); }
  b.total += foodG; b.foodKg = foodG/1000;
  b.over = b.total>14000; b.heavy = b.total>11000;
  return b;
};

/* ---------- 2) Készültség felirat: „Még N dolog van hátra.” ---------- */
readiBar = function(t){
  const c = Store.tourCheck(t);
  const bar = `<div class="readi" id="rdi-bar">
    <div class="readi-head"><b>Felkészültség</b><span>${c.pct}%</span></div>
    <div class="readi-track"><i class="readi-fill ${c.pct>=100?"full":""}" style="width:${c.pct}%"></i></div>
    <div class="readi-note">${c.pct>=100
      ? "🟢 Indulásra kész — jó utat! 🥾"
      : `Még ${c.missing.length} dolog van hátra.`}
      <span class="readi-chips">${c.missing.slice(0,3).map(m=>`<span class="readi-chip">${esc(m.label)}</span>`).join("")}${c.missing.length>3?`<span class="readi-chip">+${c.missing.length-3} többi</span>`:""}</span>
      <button class="btn btn-soft btn-sm" id="rdi-check" style="margin-left:auto">🛃 Túra ellenőrzése</button>
    </div></div>`;
  return bar;
};

/* ---------- 3) IDŐJÁRÁS a túraprojektben (chip a fejlécben + eső → csomag) ---------- */
const WMO = [[0,"🌞"],[1,"🌤️"],[2,"⛅"],[3,"☁️"],[45,"🌫️"],[51,"🌦️"],[53,"🌦️"],[55,"🌧️"],[61,"🌧️"],[63,"🌧️"],[65,"🌧️"],[71,"🌨️"],[73,"🌨️"],[75,"❄️"],[77,"❄️"],[80,"🌦️"],[81,"🌧️"],[82,"⛈️"],[85,"🌨️"],[86,"❄️"],[95,"⛈️"],[96,"⛈️"],[99,"⛈️"]];
function wmoIco(c){ let best=WMO[0]; for(const [v,i] of WMO){ if(Math.abs(v-c)<=Math.abs(best[0]-c)) best=[v,i]; } return best[1]; }
function tourCoords(t){
  if(t.coords && +t.coords.lat) return {lat:+t.coords.lat, lng:+t.coords.lng};
  const cat = TOURS.find(x=>x.id===t.refTour || x.name===t.title || (t.place && x.start.name===t.place) || x.name===t.place);
  if(cat) return {lat:cat.start.lat, lng:cat.start.lng};
  return null;
}
async function fetchTourWeather(t){
  const c = tourCoords(t);
  let lat=c&&c.lat, lng=c&&c.lng;
  if(!lat){
    const q = (t.region||t.place||"Hargita").slice(0,40);
    try{ const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=hu`)).json();
      if(g.results&&g.results[0]){ lat=g.results[0].latitude; lng=g.results[0].longitude; } }catch(e){}
  }
  if(!lat) throw new Error("nincs koordináta");
  const day = t.date && /^\d{4}-\d\d-\d\d$/.test(t.date) ? t.date : Store.todayISO();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto&start_date=${day}&end_date=${day}`;
  const j = await (await fetch(url)).json();
  const d=j.daily||{}, cur=j.current||{};
  const w = { at:new Date().toISOString(), tempMax:num(d.temperature_2m_max&&d.temperature_2m_max[0]), tempMin:num(d.temperature_2m_min&&d.temperature_2m_min[0]),
    ico: wmoIco((d.weather_code&&d.weather_code[0])??cur.weather_code??0), rain:+(d.precipitation_probability_max&&d.precipitation_probability_max[0])||0,
    nowTemp: Math.round(cur.temperature_2m||0) };
  t.weather = w; t.weatherChecked = true;
  if(w.rain>=40){ t.weatherRain=true; if(!t.gear.some(g=>/esőkabát|kabát/i.test(g.name))) t.gear.push({name:"Esőkabát",cat:"Kabát",icon:"🧥",checked:false,own:!!(D().equipment||[]).find(e=>/kabát/i.test(e.name)),note:"AI: esőjelzés",w:350}); }
  Store.save();
  return w;
}

/* ---------- 4) AI a túraprojekten belül: generálás + „Mentés a túrába” ---------- */
function ownMatch(name){ return (D().equipment||[]).find(e=>e.name===name || e.name.toLowerCase()===String(name).toLowerCase()); }
function buildGearKit(t){
  const H=t.durationH||4, night=(t.days||1)>1, winter=/t[eé]li|hideg|h[oó]z|jég/.test(((t.tags||[]).join(" ")+(t.title||" ")).toLowerCase());
  const out=[];
  const pu=(name,cat,w,icon)=>{ const own=ownMatch(name); out.push({name:name,cat:cat,w:own?(+own.w||w):w,icon:icon,checked:false,own:!!own,note:own?"saját tár":""}); };
  pu("Fejlámpa","Electronika",90,"🔦"); pu("Térkép / telefon","Navigálás",120,"🗺️"); pu("Víz 1,5 l","Ivókanna",H>=4?3000:1500,"💧");
  pu("Uzsonna","Étel",420,"🥪"); pu("Kesztyű+sapka","Meleg",180,"🧤");
  if(H>=4) pu("Túrabot","Túrabot",450,"🦯");
  if(t.weatherRain) pu("Esőkabát","Kabát",350,"🧥");
  if(winter){ pu("Hótalp/microspike","Egyéb",320,"🧊"); pu("Termosz","Ivókanna",380,"♨️"); }
  if(night){ pu("Sátor","Sátor",2400,"⛺"); pu("Hálózsák","Hálózsák",1100,"🛌"); pu("Fejlámpa+pó elem","Electronika",120,"🔋"); }
  return out;
}
function buildTimeKit(t){
  const H=t.durationH||4; let s=/napfelkel|napkelt|h[oó]zsa/.test((t.title+"").toLowerCase())?3.5:(8+t.days*0);
  const start = s<5 ? 3 : 8; const arr=[];
  let h=start;
  arr.push({t:hhmm(h), l:"Indulás a parkolóból / találkozóponton"});
  for(let i=1;i<=Math.min(4,Math.ceil(H/1.5));i++){ h+=H/Math.min(4,Math.ceil(H/1.5)); if(h<start+H) arr.push({t:hhmm(h), l:MILE_STONES[Math.min(i-1,MILE_STONES.length-1)]}); }
  h=start+H*0.55; if(h<start+H) arr.push({t:hhmm(h), l:"Pihenő, uzsonna, kilátópont"});
  arr.push({t:hhmm(start+H+0.2), l:"Vissza a kiindulóponthoz — levegőztetés, nyújtás"});
  const seen=new Set(); return arr.filter(a=>{if(seen.has(a.l))return false;seen.add(a.l);return true;}).sort((a,b)=>a.t.localeCompare(b.t));
}
const hhmm = x => String(Math.max(0,Math.min(23,Math.floor(x)))).padStart(2,"0")+":"+String(Math.round((x%1)*60/5)*5%60).padStart(2,"0");
const MILE_STONES = ["Erdőszél — tempó beállítása","Patakpart / pihenőpont","Nyereg — légzés ellenőrzése","Gerinc — kitett szakasz","Kilátópont — fotó"];
function buildFoodKit(t){
  const H=t.durationH||4, per=Math.ceil(H/2);
  const items=[["Víz (palack)",  H>=5?2500:1500],["Uzsonna (szendvics)",420],["Gyümölcs/mogyoró",260]];
  if(t.days>1) items.push( ["Konyha-egység / bensó",700],["Főzelék-zacskó",180]);
  return items.map(([n,w])=>({id:uidp("fd"),n,i:"🥫",checked:false,w}));
}
function buildTravelKit(t){
  const first=(t.participants||[]).slice(0,4).map(p=>p.name);
  return { meeting:t.meeting||t.place||"Közös indulás", cars: t.cars.length?t.cars:[{id:uidp("car"),driver:(Store.me()||{}).name||"Te", seats:5, assigned:first, plate:""}] };
}
function buildTaskKit(t){
  const dd = t.date?Store.dayDiff(t.date):9;
  const due=[];
  due.push({t:-7,l:"Időjárás elöljáró ellenőrzése",ref:Math.max(1,dd-7)});
  due.push({t:-2,l:"Csomaglista pipálása (súlyellenőrzés)",ref:Math.max(1,dd-2)});
  due.push({t:-1,l:"Utazás / sofőr egyeztetés",ref:Math.max(0,dd-1)});
  due.push({t:0,l:"Korai kelés — a napfelkelte nem vár 🌄",ref:Math.max(0,dd)});
  return due.map(x=>({id:uidp("tk"),label:x.l,done:false,due:x.ref}));
}
function aiKitModal(t){
  const K={ idoter:buildTimeKit(t), csomag:buildGearKit(t), etel:buildFoodKit(t), utazas:buildTravelKit(t), teendok:buildTaskKit(t) };
  const SECL=[["idoter","🕐","Időterv",K.idoter.map(x=>`${x.t} — ${x.l}`) ],
    ["csomag","🎒","Csomaglista (súllyal)",K.csomag.map(x=>`${x.name} · ${g2kg(x.w)}${x.own?" · a te táradban":"✔"}`)],
    ["etel","🥪","Étel és víz",K.etel.map(x=>`${x.n} · kb. ${g2kg(x.w)}`)],
    ["utazas","🚗","Utazás és sofőrök",[K.utazas.meeting?("Találkozó: "+K.utazas.meeting):"", K.utazas.cars.map(c=>`${c.driver} sofőr — ${c.seats} hely, ${c.assigned.length} utas`).join(" · ")]],
    ["teendok","✅","Teendők",K.teendok.map(x=>`D-${x.due}: ${x.label}`)] ];
  openModal({ title:"⚡ AI terv — "+esc(t.title), body:`
    <p class="small muted mt0">Szempontok: ${t.lengthKm||"?"} km · ${t.durationH||4} ó · ${esc(t.difficulty)} · ${t.days>1?t.days+" nap":"napi"} · esőjelzés: ${t.weatherRain?"van":"nincs"} · saját tárad: ${D().equipment.filter(e=>e.has).length} eszköz</p>
    ${SECL.map(([k,ic,ttl,lines])=>`<label class="ck" style="align-items:flex-start"><input type="checkbox" data-sec="${k}" checked>
      <span><b>${ic} ${ttl}</b><br><span class="small muted">${lines.filter(Boolean).join(" · ")||"-"}</span></span></label>`).join("")}
    <button class="btn btn-primary btn-block" id="aikit-save" style="margin-top:.9rem">💾 Mentés a túrába</button>`,
    footer:`<button class="btn btn-ghost btn-block" data-close>Mégsem</button>`,
    onOpen(r){ r.querySelector("#aikit-save").onclick=()=>{
      const on=k=>!!r.querySelector(`[data-sec="${k}"]`)&&r.querySelector(`[data-sec="${k}"]`).checked;
      if(on("idoter")) t.timeline = K.idoter.map(x=>({id:uidp("tl"),t:x.t,l:x.l,ty:"ai"}));
      if(on("csomag")){ const have={}; t.gear.forEach(g=>have[g.name]=true);
        K.csomag.forEach(g=>{ if(!have[g.name]) t.gear.push(Object.assign({id:uidp("g")},g)); }); }
      if(on("etel")){ K.etel.forEach(f=>{ if(!t.food.some(x=>x.n===f.n)) t.food.push(f); }); }
      if(on("utazas")){ if(!t.meeting) t.meeting=K.utazas.meeting; if(!t.cars.length) t.cars=K.utazas.cars; }
      if(on("teendok")){ K.teendok.forEach(x=>{ if(!t.tasks.some(y=>y.label===x.label)) t.tasks.push(x); }); }
      if(t.status==="ötlet") t.status="tervezés";
      ensureTourFields(t); Store.save(); closeModal();
      toast("Az AI-terv a túrádba kerülhet ✔","⚡"); render();
    }; } });
}

/* ---------- 5) Saját felszereléstár → csomaglista picker ---------- */
function gearOwnPicker(t){
  const eq=(D().equipment||[]).filter(e=>e.has);
  const inPack={}; t.gear.forEach(g=>inPack[g.name]=true);
  const cats={}; eq.forEach(e=>{ (cats[e.cat||"Egyéb"]=cats[e.cat||"Egyéb"]||[]).push(e); });
  openModal({ title:"🎒 Válassz a saját táradból", body:`
    <p class="small muted mt0">A súlyuk automatusan belekerül a hátizsák-kalkulátorba. ${eq.filter(e=>inPack[e.name]).length} már alistában van a túrán.</p>
    <div class="own-list">
    ${Object.keys(cats).sort().map(c=>`<div class="own-cat"><div class="own-cat-h">${c} <span class="muted small">${g2kg(cats[c].reduce((a,e)=>a+(+e.w||0),0))}</span></div>
      ${cats[c].map(e=>`<label class="ck ${inPack[e.name]?"done":""}"><input type="checkbox" data-ownpk="${e.name.replace(/"/g,"'")}" data-ownw="${+e.w||600}" data-ownc="${c}" ${inPack[e.name]?"checked":""}>
        <span>${esc(e.name)} <span class="muted small">${g2kg(+e.w||600)}${e.cond?" · "+esc(e.cond):""}</span></span></label>`).join("")}</div>`).join("")}
    </div>`, footer:`<button class="btn btn-ghost" data-close>Mégse</button><button class="btn btn-primary" id="ownpk-ok">Hozzáad a csomaghoz</button>`,
    onOpen(r){ r.querySelector("#ownpk-ok").onclick=()=>{
      let n=0; r.querySelectorAll("[data-ownpk]").forEach(cb=>{ if(!cb.checked) return; const nm=cb.dataset.ownpk;
        if(t.gear.some(g=>g.name===nm)) return;
        t.gear.push({name:nm, cat:cb.dataset.ownc, icon:"🧰", w:+cb.dataset.ownw||600, checked:false, own:true, note:"saját tárból"}); n++; });
      Store.save(); closeModal(); if(n) toast(n+" saját cucc bekerült a csomagba — súlyostul ✔","🎒"); render(); }; } });
}
function condBadge(name){ const e=(D().equipment||[]).find(x=>x.name===name); if(!e) return "";
  return e.cond&&e.cond!=="Jó"?`<span class="cond-pill ${/Kopott|Jav/.test(e.cond)?"bad":""}">${esc(e.cond)}</span>`:""; }

/* ---------- 6) Workspace connection: időjárás, AI, teendők, picker ---------- */
const _prjWA = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id) => {
  _prjWA && _prjWA(root,id);
  const t = Store.getTour(id); if(!t || !root.querySelector(".ws-stats")) return;
  ensureTourFields(t);
  // — gombok a fejléc-action sorba
  const act = root.querySelector(".ws-actions") || root.querySelector(".ws-stats");
  function mkBtn(html,idv,cls,fn){ const b=document.createElement("button"); b.className=cls; b.innerHTML=html; b.onclick=fn; if(idv)b.id=idv; act.appendChild(b); return b; }
 ensureTourFields(t); recordRecent();
  const w=t.weather;
  mkBtn(w?`${w.ico} ${w.tempMin}–${w.tempMax}°C · esély ${w.rain}%`:"🌤️ Időjárás — ellenőrzés","btn-wx","btn btn-soft btn-sm wth-btn", async ev=>{
    const b=ev.currentTarget; const old=b.innerHTML; b.innerHTML="⏳ Mérem…";
    try{ const w2=await fetchTourWeather(t); b.innerHTML=`${w2.ico} ${w2.tempMin}–${w2.tempMax}°C · eső ${w2.rain}%`; toast(`Időjárás rögzítve — felkészültség frissült ✔ (${w2.rain}% esély, ${w2.tempMax}°C)`, w2.ico);}
    catch(e2){ b.innerHTML=old; toast("Az időjárás nem érhető el (nincs kapcsolat?)","📡"); } });
  mkBtn("🤖 Tervezd meg ezt a túrát","btn-ai","btn btn-ember btn-sm", ()=>aiKitModal(t));
  mkBtn("＋ Saját tárból","btn-pick","btn btn-soft btn-sm", ()=>gearOwnPicker(t));
  // — Teendők panel az áttekintés végére
  if(wsTab==="attekintes"){
    const grid=root.querySelector(".ws-grid");
    if(grid && !root.querySelector(".tasks-panel")){
      const open=t.tasks.filter(x=>!x.done).length;
      grid.insertAdjacentHTML("beforeend", `<div class="card panel tasks-panel"><div class="flex between wrapcol" style="margin-bottom:.35rem"><h3 style="margin:0">✅ Teendők</h3><span class="chip ${open?"chip-sand":"chip-green"}">${open?"még "+open+" feladat":"mindent pipáltál"}</span></div>
        <div id="tk-list">${t.tasks.map(x=>`<div class="ck ${x.done?"done":""}" style="display:flex;gap:.5rem;align-items:center;padding:.3rem 0"><input type="checkbox" data-tk="${x.id}" ${x.done?"checked":""}> ${esc(x.label)} ${x.due<=1?'<span class="chip chip-ember" style="font-size:.72rem">hamarosan</span>':`<span class="muted small">D-${x.due}</span>`}</div>`).join("")||'<p class="small muted">Nincs feladat — az AI terv kitöltése gomb fel tud dobni egyet.</p>'}</div>
        <div class="flex" style="gap:.45rem;margin-top:.6rem"><input class="input" id="tk-n" placeholder="Új teendő…" style="flex:1"><button class="btn btn-primary btn-sm" id="tk-add">＋</button></div></div>`);
      const rt=root;
      rt.querySelectorAll("[data-tk]").forEach(cb=>cb.onclick=()=>{ const x=t.tasks.find(y=>y.id===cb.dataset.tk); if(x){x.done=cb.checked; Store.save(); render();} });
      const add=()=>{ const v=rt.querySelector("#tk-n").value.trim(); if(!v)return; t.tasks.push({id:uidp("tk"),label:v,done:false,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); Store.save(); render(); };
      rt.querySelector("#tk-add").onclick=add; rt.querySelector("#tk-n").addEventListener("keydown",e=>{if(e.key==="Enter")add();});
    }
  }
  // — Felszerelés fülön a saját-tár jelölések + állapot badge
  if(wsTab==="felszereles"){ root.querySelectorAll(".ck input[type=checkbox]").forEach(()=>{}); }
};

/* ---------- 7) Esemény → túraprojekt egy koppintás ---------- */
function planFromEvent(e){
  const base = e.tour?tourById(e.tour):null;
  const t = Store.newTourFromDraft({ title:e.name, place:(base?base.start.name:e.place), region:(base?base.region:e.region||""),
    date:e.date||"", lengthKm:base?base.km:0, ascent:base?base.up:0, durationH:base?base.h:0,
    difficulty:base?base.diff:"Könnyű", img:base?base.img:(e.img||IMG.erdo), tags:["esemény"], eventRef:e.id,
    desc:e.desc||"", coords:base?{lat:base.start.lat,lng:base.start.lng}:null, notes:(e.src?"Forrás: "+e.src:"") });
  return t;
}
const _origEventModal = eventModal;
eventModal = function(eid){ _origEventModal(eid);
  if(!Store.me()) return;
  const ft=document.querySelector(".modal-foot"); const e=EVENTS.find(x=>x.id===eid); if(!ft||!e) return;
  if(ft.querySelector("#ev-plan")) return;
  const b=document.createElement("button"); b.className="btn btn-ember"; b.id="ev-plan"; b.style.marginRight=".5rem";
  b.innerHTML="🥾 Túraprojekt indítása ebből";
  b.onclick=()=>{ const t=planFromEvent(e); closeModal(); toast("Megnyitom a munkaterületet, ahol a tervet tovább írhatod","🧭"); NAV.to("#/tura/"+t.id); };
  ft.insertBefore(b, ft.firstChild); };
const _prjEvAfter = VIEWS.events.after;
VIEWS.events.after = (root) => { _prjEvAfter && _prjEvAfter(root);
  if(!Store.me()) return;
  root.querySelectorAll(".ecard").forEach(card=>{ const a=card.querySelector("h3 a"); if(!a) return;
    const mm=a.getAttribute("href").match(/esemenyek\/([\w-]+)/); if(!mm||card.querySelector("[data-evplan]")) return;
    const b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.dataset.evplan=mm[1];
    b.style.cssText="margin-top:.5rem;width:100%"; b.innerHTML="🥾 Tervezés — saját projektként";
    b.onclick=ev=>{ ev.stopPropagation(); const t=planFromEvent(EVENTS.find(x=>x.id===b.dataset.evplan)); toast("Túraprojekt létrehozva a naptáradban","🧭"); NAV.to("#/tura/"+t.id); };
    (card.querySelector(".eb")||card).appendChild(b); }); };

/* ---------- 8) INBOX — hirtlen mentett ötletem, hivatkozás, FB esemény ---------- */
const IB_ICON={link:"🔗",event:"📣",place:"📍",note:"📝",photo:"🖼️"};
function ibAdd(o){ const d=D(); const it=Object.assign({id:uidp("ib"),at:new Date().toISOString(),read:false},o); d.inbox.unshift(it); Store.save(); return it; }
function guessDate(str){ const yy=new Date().getFullYear(); const p2=x=>String(+x).padStart(2,"0");
  let m=str.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/); if(m) return m[1]+"-"+p2(m[2])+"-"+p2(m[3]);
  m=str.match(/(\d{1,2})\.?\s*(jan|feb|marc|apr|maj|jun|jul|aug|szep|okt|nov|dec)/i);
  if(m){ const mo={jan:1,feb:2,marc:3,apr:4,maj:5,jun:6,jul:7,aug:8,szep:9,okt:10,nov:11,dec:12}[m[2].toLowerCase().normalize("NFD").replace(/[^a-z]/g,"")]||(new Date()).getMonth()+1; return yy+"-"+p2(mo)+"-"+p2(m[1]); }
  m=str.match(/(\d{1,2})[./](\d{1,2})\./); if(m) return yy+"-"+p2(m[2])+"-"+p2(m[1]);
  return ""; }
function ibTour(it){
  const date=guessDate((it.title+" "+(it.note||"")).slice(0,140));
  const t=Store.newTourFromDraft({ title:it.title||"Inbox-ötletem", status:"ötlet", date, place:it.place||"", img:it.img||IMG.erdo, desc:it.note||"", notes:(it.url?("Forrás: "+it.url):""), tags:["inbox"] });
  it.read=true; Store.save(); NAV.to("#/tura/"+t.id);
}
function ibWish(it){ const d=D(); const ref="ib_"+it.id;
  if(d.wishlist.some(x=>x.ref===ref)){ toast("Ez már a bakancslistádon van","❤️"); return; }
  d.wishlist.push({id:uidp("w"),ref,name:it.title||it.note.slice(0,40),cat:"Inbox",place:it.place||it.url||"—",diff:"—",img:it.img||IMG.erdo,addedAt:Store.todayISO()});
  it.read=true; Store.save(); toast("Rakva a bakancslistára ❤️","❤️"); render(); }
VIEWS.inbox = () => {
  const d=D();
  return dash("#/inbox")(`
    <div class="dash-top"><div><h1>📥 Inbox</h1><div class="hello">Gyors mentőöv: link, Facebook esemény, helyszín, jegyzet, fotó — innen egy koppintás a túraprojekt.</div></div></div>
    <div class="ib-form card panel">
      <div class="flex wrapcol" style="gap:.5rem;align-items:flex-end">
        <div style="min-width:150px"><label class="f" for="ib-t">Típus</label><select class="input" id="ib-t">
          <option value="link">🔗 Link / cikk</option><option value="event">📣 Esemény (FB, site)</option><option value="place">📍 Helyszín</option><option value="note">📝 Jegyzet</option><option value="photo">🖼️ Fotó</option></select></div>
        <div style="flex:2;min-width:190px"><label class="f" for="ib-n">Cím</label><input class="input" id="ib-n" placeholder="Pl. SzATT 2026 — izzó gerinc"></div>
        <div style="flex:2;min-width:190px"><label class="f" for="ib-u">URL (opcionális)</label><input class="input" id="ib-u" placeholder="https://m.facebook.com/events/…"></div>
        <div style="flex:3;min-width:190px"><label class="f" for="ib-x">Jegyzet</label><input class="input" id="ib-x" placeholder="Dátum, találkozó, tipp…"></div>
        <button class="btn btn-primary" id="ib-save" style="margin-bottom:2px">＋ Mentés az Inboxba</button>
      </div>
      <label class="ib-photo hidden" id="ib-pwrap"><span>🖼️ Fotó csatolása</span><input type="file" id="ib-p" accept="image/*"></label>
    </div>
    <div id="ib-list"></div>`);
};
VIEWS.inbox.after = root => {
  const draw=()=>{
    const list=root.querySelector("#ib-list"); const d=D();
    list.innerHTML = d.inbox.length? d.inbox.map(it=>`
      <div class="ib-item ${it.read?"":"new"}" data-ibid="${it.id}">
        <span class="ib-ic">${IB_ICON[it.type]||"🔗"}</span>
        <div class="ib-b">
          <b>${esc(it.title||it.note||"(cím nélkül)")}</b>
          <div class="small muted">${it.note?esc(it.note).slice(0,110):""} ${it.url?`· <a href="${esc(it.url)}" target="_blank" rel="noopener">forrás ↗</a>`:""} · ${new Date(it.at).toLocaleDateString("hu-HU")}</div>
          ${it.img?`<img class="ib-img" src="${it.img}" alt="">`:""}
          <div class="ib-acts">
            <button class="btn btn-ember btn-sm" data-ib-plan="${it.id}">🧭 Túraprojekt</button>
            <button class="btn btn-soft btn-sm" data-ib-wish="${it.id}">❤️ Bakancslistára</button>
            ${it.url?`<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="${esc(it.url)}">↗ Megnyitás</a>`:""}
            <button class="btn btn-ghost btn-sm" data-ib-del="${it.id}">🗑</button></div></div></div>`).join("")
      : `<div class="empty-state card"><div class="empty em-ico">📥</div><h3>Friss, üres postaláda</h3><p class="muted">Ments ide linkeket, FB eseményeket, jegyzeteket — aztán alakítsd őket túraprojektté.</p></div>`;
    list.querySelectorAll("[data-ib-plan]").forEach(b=>b.onclick=()=>{ ibTour(D().inbox.find(x=>x.id===b.dataset.ibPlan||x.id===b.dataset.ibPlan)); });
    list.querySelectorAll("[data-ib-wish]").forEach(b=>b.onclick=()=>{ ibWish(D().inbox.find(x=>x.id===b.dataset.ibWish)); });
    list.querySelectorAll("[data-ib-del]").forEach(b=>b.onclick=()=>{ const d2=D(); d2.inbox=d2.inbox.filter(x=>x.id!=b.dataset.ibDel); Store.save(); draw(); });
  }; draw();
  const ty=root.querySelector("#ib-t"); const pwrap=root.querySelector("#ib-pwrap");
  ty.onchange=()=>{ pwrap.classList.toggle("hidden", ty.value!=="photo"); };
  root.querySelector("#ib-save").onclick=()=>{
    const v=id=>root.querySelector("#"+id).value.trim();
    const item={type:ty.value,title:v("ib-n"),url:v("ib-u"),note:v("ib-x"),place:ty.value==="place"?v("ib-n"):""};
    const f=root.querySelector("#ib-p").files&&root.querySelector("#ib-p").files[0];
    const finish=(img)=>{ if(!item.title&&!img&&!item.url&&!item.note){ toast("Írj valamit: címet, linket vagy jegyzetet","✍️"); return; }
      ibAdd(img?Object.assign(item,{img}):item);
      ["ib-n","ib-u","ib-x"].forEach(id=>root.querySelector("#"+id).value=""); root.querySelector("#ib-p").value="";
      ty.value="link"; pwrap.classList.add("hidden"); toast("Elmentve az Inboxba 📥","✓");
      const list=root.querySelector("#ib-list"); list.innerHTML="";
      const r2=root; const drawF=r2; // újra rajz
      D().inbox.length; render(); };
    if(f){ const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,700/im.width); c.width=im.width*sc|0; c.height=im.height*sc|0;
        const g=c.getContext("2d"); g.fillStyle="#000"; g.fillRect(0,0,c.width,c.height); g.setTransform(1,0,0,1,c.width/2,c.height/2);
        let rot=0; try{ const o=new Image(); rot=0; }catch(e){}
        g.rotate(rot); g.drawImage(im,-c.width/2,-c.height/2,c.width,c.height);
        try{ const d3=D(); const pc=d3.inbox.filter(x=>x.img).length; if(pc>=9){ toast("10 kép max az Inboxban — törölj párat","🗜"); return; } }catch(e){}
        finish(c.toDataURL("image/jpeg",0.62)); }; im.onerror=()=>toast("A fotó nem olvasható","🖼️"); im.src=rd.result; }; rd.readAsDataURL(f); }
    else finish(); };
};

/* ---------- 9) Widget az Inboxból + dashboard blokkrend ---------- */
const _prjLabels=WIDGETS;
WIDGETS.inbox={label:"📥 Inbox — gyors mentések"};
/* (az Inboxwidget a dashboard W-tárgyában kapott helyet — lásd upgrade.js W.inbox) */


/* ---------- 10) Túra mód V2 — gyors jegyzet + fotó (DOM) ---------- */
function tmQuickCard(t){ ensureTourFields(t); return `<div class="card panel tm-quick">
  <h3>Gyors jegyzet a pályáról</h3>
  <div class="flex" style="gap:.45rem;flex-wrap:wrap"><input class="input" id="tm-note" placeholder="Pl. forrás a 2 km-nél, jelzés festve…" style="flex:1;min-width:140px"><button class="btn btn-primary" id="tm-note-add">＋</button>
    <button class="btn btn-soft" id="tm-photo">📸 Fotó</button><input type="file" id="tm-pf" accept="image/*" class="hidden"></div>
  ${(t.noteStream||[]).slice().reverse().slice(0,6).map(n=>`<div class="tm-note"><b>${n.ts}</b> ${esc(n.text)}</div>`).join("")}
  ${(t.photos||[]).length?`<div class="tm-photos">${t.photos.slice(-4).map(p=>`<img src="${p}" alt="túra fotó">`).join("")}</div>`:""}</div>`; }
function tmWire(){
  try{
    const add=document.getElementById("tm-note-add"); if(!add) return;
    const mm=(location.hash||"").match(/turamod\/([\w-]+)/); if(!mm) return;
    const t=Store.getTour(mm[1]); if(!t) return;
    add.onclick=()=>{ const i=document.getElementById("tm-note"); const v=i.value.trim(); if(!v) return;
      ensureTourFields(t); t.noteStream.push({ts:new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}),text:v}); Store.save(); render(); };
    const pf=document.getElementById("tm-pf"); if(!pf) return;
    document.getElementById("tm-photo").onclick=()=>pf.click();
    pf.onchange=()=>{ const f=pf.files&&pf.files[0]; if(!f) return; const rd=new FileReader();
      rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,800/im.width);
        c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); const g=c.getContext("2d"); g.drawImage(im,0,0,c.width,c.height);
        ensureTourFields(t); t.photos.push(c.toDataURL("image/jpeg",0.6));
        t.noteStream.push({ts:new Date().toLocaleTimeString("hu-HU",{hour:"2-digit",minute:"2-digit"}),text:"📸 fotó csatolva"});
        Store.save(); render(); toast("Fotó a túrához mentve (tömörítve)","📸"); }; im.onerror=()=>toast("A fotó nem olvasható","🖼️"); im.src=rd.result; }; rd.readAsDataURL(f); };
  }catch(e){}
}
const _prjTMA = VIEWS.tourmode.after;
try{ VIEWS.tourmode.after = function(root, id){ try{ _prjTMA && _prjTMA.apply(this, arguments);
  const mm=(location.hash||"").match(/turamod\/([\w-]+)/);
  if(mm){ const t=Store.getTour(mm[1]||id); const box=(root||document).querySelector(".tmode");
    if(t && box && !box.querySelector(".tm-quick")){ box.insertAdjacentHTML("beforeend", tmQuickCard(t)); } }
  tmWire(); }catch(e){ console.error("TMHOOK", e); } }; }catch(e){}
const _prjRender0 = render;
render = function(){ _prjRender0.apply(this, arguments);
  try{ const mm=(location.hash||"").match(/turamod\/([\w-]+)/);
    if(mm){ const tm=document.querySelector(".tmode"); if(tm){ const t=Store.getTour(mm[1]);
      if(t && !document.querySelector(".tm-quick")) tm.insertAdjacentHTML("beforeend", tmQuickCard(t)); } }
  }catch(e){}
  tmWire(); };

/* ---------- 11) sablon teendők → t.tasks + apply csatlakozás ---------- */
function allTpl(){ return TEMPLATES_DEFAULT.concat(D().templates||[]); }
if(Store.applyTemplate){ const _prjAT = Store.applyTemplate;
  Store.applyTemplate = (tid,tpid)=>{ const res=_prjAT(tid,tpid);
    try{ const t=Store.getTour(tid); const tpl=allTpl().find(x=>x.id===tpid);
      if(t&&tpl&&tpl.tasks){ ensureTourFields(t);
        tpl.tasks.forEach(x=>{ if(!t.tasks.some(y=>y.label===x)) t.tasks.push({id:uidp("tk"),label:x,done:false,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); });
        Store.save(); } }catch(e){}
    return res; }; }

/* ---------- 12) Dashboard finomítás: üres sávok eltüntetése + első lépés panel ---------- */
const _pDashA = VIEWS.dash.after;
VIEWS.dash.after = (root) => {
  try{ _pDashA && _pDashA(root); }catch(e){}
  try{
    const box = root.querySelector("#widgets"); if(!box) return;
    const d = Store.myData();
    box.querySelectorAll(".wsec").forEach(sec=>{
      const w = sec.dataset.w; const txt = (sec.textContent||"").replace(/\s+/g,"").length;
      const ctl = sec.querySelector("input,select,textarea,button:not(#rdi-check),a");
      if(txt < 16 && !ctl) sec.remove();
    });
    if(!d.tours.length && !d.journal.length){
      box.insertAdjacentHTML("afterbegin", `<section class="wsec"><div class="df-card"><div class="df-ic">&#129466;</div>
        <div class="df-b"><h3>&#220;res a túraközpontod — töltsük meg</h3>
        <p class="muted small" style="margin:.1rem 0 .2rem">Három lépés, és a tervezés, csomagolás, naptár, élménykönyv egy helyen fut.</p>
        <div class="df-steps">
          <a href="#/felfedezes"><b>1 · Válassz célt</b><span>32 útvonal · Székelyföld és Erdély</span></a>
          <a href="#/uj-tura"><b>2 · Tervezd meg</b><span>induló sablonok · 5 perc</span></a>
          <a href="#/inbox"><b>3 · Mentd az ötleteidet</b><span>FB esemény, link, fotó</span></a>
        </div></div></div></section>`);
    }
  }catch(e){}
};


/* ---------- 13) ☀️ Valódi időjárás widget (ma, profilszékszeredád fölött) ---------- */
const SUNKEY="tv.sun.v1";
async function sunToday(){ const u=Store.me(); if(!u) throw new Error("no user"); const city=(u.city||"").trim()||"Csíkszereda";
  const today=Store.todayISO(); const ck=SUNKEY+"|"+city+"|"+today;
  let cache={}; try{ cache=JSON.parse(localStorage.getItem(SUNKEY)||"{}"); }catch(e){}
  if(cache[ck]) return cache[ck];
  let lat=46.7,lng=25.0;
  try{ const g=await (await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(city.slice(0,40))+"&count=1&language=hu")).json();
    if(g.results&&g.results[0]){ lat=g.results[0].latitude; lng=g.results[0].longitude; } }catch(e){}
  const j=await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset,temperature_2m_max,precipitation_probability_max&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`)).json();
  const moonAge=(()=>{ const KNOWN=Date.UTC(2000,0,6,18,14); return ((Date.now()-KNOWN)/86400000)%29.530588853; })();
  const w={ city, sr:(j.daily.sunrise[0]||"").slice(11,16), ss:(j.daily.sunset[0]||"").slice(11,16),
    tmax:Math.round(j.daily.temperature_2m_max[0]), rain:+(j.daily.precipitation_probability_max[0]||0),
    moon:Math.round((1-Math.cos(2*Math.PI*moonAge/29.530588853))/2*100), now:Math.round(j.current.temperature_2m),
    ico:wmoIco(j.current.weather_code), wind:Math.round(j.current.wind_speed_10m) };
  Object.keys(cache).forEach(k=>{ if(!k.endsWith("|"+today)) delete cache[k]; });
  cache[ck]=w; try{ localStorage.setItem(SUNKEY, JSON.stringify(cache)); }catch(e){}
  return w; }
function sunPaint(root){ const box=root.querySelector("#sun-today-body"); if(!box) return;
  sunToday().then(w=>{ const loc=root.querySelector("#sun-loc"); if(loc) loc.textContent=esc(w.city);
    const hold = w.moon<15?"újhold":w.moon<45?"fogyó félhold":w.moon<80?"teliesebb hold":"telihold";
    box.innerHTML = `<div class="sun-flex">
      <span class="sun-now">${w.ico} <b>${w.now}°C</b><small>max ${w.tmax}° · eső ${w.rain}% · szél ${w.wind} km/h</small></span>
      <span class="sun-pair" title="napkelte">🌅 <b>${w.sr}</b></span><span class="sun-pair" title="napnyugta">🌇 <b>${w.ss}</b></span>
      <span class="sun-moon" title="hold">🌙 ${hold} · ${w.moon}%</span></div>
      <p class="small muted" style="margin:.45rem 0 0">Korai indulásnál számolj a ${w.sr} utáni fényrel — a fejlámpa akkor is kell.</p>`;
  }).catch(()=>{ box.innerHTML = '<p class="small muted mt0" style="margin:0">Az időjárás nem kérhető most (nincs kapcsolat).</p>'; }); }

/* ---------- 14) 🕝 Legutóbb megnézett gyűjtő ---------- */
function recordRecent(){ try{
  const h=location.hash||""; let ent=null;
  let m=h.match(/^#\/tura\/([\w-]+)/); if(m){ const t=Store.getTour(m[1]); if(t) ent={href:h,ico:"🥾",label:t.title}; }
  if(!ent){ m=h.match(/^#\/turak\/([\w-]+)/); if(m){ const ct=TOURS.find(x=>x.id===m[1]||x.id===m[1].split("?")[0]); if(ct) ent={href:h,ico:"⛰️",label:ct.name}; } }
  if(!ent){ m=h.match(/^#\/esemenyek\/([\w-]+)/); if(m){ const e=EVENTS.find(x=>x.id===m[1]); if(e) ent={href:h,ico:"📣",label:e.name}; } }
  if(!ent) return;
  const d=Store.myData(); if(!d.recent) d.recent=[];
  d.recent=[ent].concat(d.recent.filter(x=>x.href!==ent.href)).slice(0,6); Store.save();
}catch(e){} }
addEventListener("hashchange", recordRecent);
  setTimeout(recordRecent, 1400);

/* ---------- 15) ⬇️ GPX export a saját túrához ---------- */
function gpxEscape(x){ return String(x||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
function buildGpx(t){
  const pts=[];
  if(t.coords&&+t.coords.lat) pts.push({lat:+t.coords.lat,lng:+t.coords.lng,n:t.place||t.title,ele:null});
  (t.waypoints||[]).forEach(w=>{ if(+w.lat) pts.push({lat:+w.lat,lng:+w.lng,n:w.name||"pont",ele:w.ele?+w.ele:null}); });
  const slug=(t.title||"tura").toLowerCase().replace(/[^a-z0-9]+/gi,"-").slice(0,40);
  const wpts=pts.map(p=>`  <wpt lat="${p.lat}" lon="${p.lng}">${p.ele!=null?`\n    <ele>${p.ele}</ele>`:""}\n    <name>${gpxEscape(p.n)}</name></wpt>`).join("\n");
  const trkpts=pts.length>1?`    <trkseg>\n${pts.map(p=>`      <trkpt lat="${p.lat}" lon="${p.lng}">${p.ele!=null?`<ele>${p.ele}</ele>`:""}</trkpt>`).join("\n")}\n    </trkseg>`:"";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Turatars" xmlns="http://www.topografix.com/GPX/1/1">\n  <metadata><name>${gpxEscape(t.title)}</name><desc>${gpxEscape((t.desc||"").slice(0,180))}</desc></metadata>\n${wpts}\n  <trk><name>${gpxEscape(t.title)}</name>${trkpts?"\n"+trkpts+"\n ":""}</trk>\n</gpx>`; }
function dlGpx(t){
  if(t.gpx && /^https?:/.test(t.gpx)){ window.open(t.gpx, "_blank"); toast("A katalógus GPX-et új lapon nyitottam — mentsd onnan","🗺️"); return; }
  if(!(t.coords||t.waypoints||[]).length){ toast("Ehhez a tervhez nincs útvonalpont — importálj nyomvonalat (Katalógus/Hagymás) előbb","🧭"); return ; }
  const xml=buildGpx(t); const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([xml],{type:"application/gpx+xml"})); a.download=(t.title||"tura").replace(/[^\w-]+/g,"_").slice(0,44)+".gpx";
  document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},600);
  toast("GPX letöltve — betöltheted Természetjáróba, Komootba","⬇️"); }

/* Gombok: GPX az Útvonal- és Áttekintés füleken, sun festés, recent mentés */
const _prj12DashA = VIEWS.dash.after;
VIEWS.dash.after = (root) => { _prj12DashA && _prj12DashA(root); recordRecent();
  try{ if(root.querySelector('[data-w="sun"]')) sunPaint(root); }catch(e){} };
const _prj12WsA = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id) => { _prj12WsA && _prj12WsA(root,id);
  try{ if(wsTab==="utvonal"||wsTab==="attekintes"){ const act=root.querySelector(".ws-actions");
    if(act && !document.getElementById("btn-gpx")){ const b=document.createElement("button"); b.className="btn btn-ghost btn-sm"; b.id="btn-gpx";
      b.innerHTML="⬇️ GPX"; b.onclick=()=>{ const t=Store.getTour(id); if(t) dlGpx(t); }; act.insertBefore(b, act.children[2]||null); } } }catch(e){} };


/* ---------- 16) V36: Túráim státuszrend + Teendők fül + 3 állapotú résztvevők + közös cucc + Ma-lista + AI-útvonal ---------- */
const TV_GROUPS=[["otlet","💡 Ötletek"],["bakancs","❤️ Bakancslistán"],["tervezes","🟡 Tervezés alatt"],["kozelgo","🔵 Közelgő"],["folyamatban","🚩 Folyamatban"],["teljesitve","🟢 Teljesítve"],["archivalva","📖 Archiválva"],["esemeny","🎫 Események"],["mind","🌐 Mind"]];
function tvBucket(t){ const d=t.date?Store.dayDiff(t.date):999;
  if(t.status==="ötlet")return"otlet"; if(t.status==="bakancs")return"bakancs";
  if(t.status==="teljesítve")return"teljesitve"; if(t.status==="archiválva")return"archivalva";
  if(t.status==="folyamatban"||(t.date&&d<=0))return"folyamatban";
  if(t.eventRef)return"esemeny";
  if(d<=7&&["tervezés","közelgő"].includes(t.status))return"kozelgo"; return "tervezes"; }
let tvTab="mind";
VIEWS.tours = () => { const d=Store.myData();
  const buck={}; d.tours.forEach(t=>{ const k=tvBucket(t); (buck[k]=buck[k]||[]).push(t); });
  Object.values(buck).forEach(a=>a.sort((x,y)=>(x.date||"9999").localeCompare(y.date||"9999")));
  const list=(tvTab==="mind"? d.tours.slice() : (buck[tvTab]||[]).slice()).sort((x,y)=>(x.date||"9999").localeCompare(y.date||"9999"));
  return dash("#/turaim")(`
    <div class="dash-top"><div><h1>Túráim 🥾</h1><div class="hello">Minden terved önálló túraprojekt — a fülek a projekt állapotát követik.</div></div>
      <a class="btn btn-primary" href="#/uj-tura">➕ Új túra</a></div>
    <div class="tabs tv36" role="tablist">${TV_GROUPS.map(([k,l])=>{ const n=k==="mind"?d.tours.length:(buck[k]||[]).length; return `<button class="${tvTab===k?"on":""}" data-tvtab="${k}">${l} ${n?`<span class="tvn">${n}</span>`:""}</button>`; }).join("")}</div>
    ${list.length?`<div class="grid" id="tour-list">${list.map(tourRow).join("")}</div>`:
     `<div class="empty"><span class="em-ico">🌲</span><h3>Ebben a szekcióban még nincs túrád</h3><p class="muted">A „Mind” fül mindent mutat; a katalógus bármely túrája egy kattintással projektté válik.</p>
     <a class="btn btn-primary" href="#/uj-tura">➕ Első túra</a> <a class="btn btn-soft" href="#/felfedezes">🗺️ Túrák a katalógusban</a></div>`}`);
};
VIEWS.tours.after = root => {
  root.querySelectorAll("[data-tvtab]").forEach(b=>b.onclick=()=>{ tvTab=b.dataset.tvtab; render(); });
  wireTourActions(root);
};

/* Teendők önálló fül (aki-osztással) + közös felszerelés */
try{ if(!WS_TABS.some(x=>x[0]==="teendok")) WS_TABS.push(["teendok","✅ Teendők"]); }catch(e){}
const _prjTab16 = wsTabHTML;
wsTabHTML = function(t,catTour){ if(wsTab==="teendok"){ ensureTourFields(t);
    const who=t.participants.map(p=>p.name);
    const open=t.tasks.filter(x=>!x.done).length;
    return `<div class="ws-grid"><div class="card panel">
      <div class="flex between wrapcol"><h3 style="margin:0">✅ Teendők — ki mit csináljon</h3>
        <span class="chip ${open?"chip-ember":"chip-green"}">${open?open+" nyitott":"minden kész ✓"}</span></div>
      <div id="tk-list">${t.tasks.map(x=>`<div class="ck ${x.done?"done":""}" style="display:flex;gap:.5rem;align-items:center;padding:.35rem 0">
          <input type="checkbox" data-tk="${x.id}" ${x.done?"checked":""}>
          <span style="flex:1">${esc(x.label)}</span>
          <select class="input who-sel" data-tkwho="${x.id}" style="width:auto;font-size:.82rem;padding:.2rem .45rem">
            <option value="">senki</option>${who.map(w=>`<option ${x.who===w?"selected":""}>${esc(w)}</option>`).join("")}</select>
          ${x.due!=null?`<span class="chip chip-sand" style="font-size:.72rem">D-${x.due}</span>`:""}</div>`).join("")||'<p class="small muted">Nincs teendő — az ⚡ AI terv fel tud dobni egy teljes listát.</p>'}</div>
      <div class="flex" style="gap:.45rem;margin-top:.8rem;flex-wrap:wrap"><input class="input" id="tk-n" placeholder="Új teendő…" style="flex:1;min-width:160px">
        <select class="input" id="tk-who" style="width:150px"><option value="">kinek?</option>${who.map(w=>`<option>${esc(w)}</option>`).join("")}</select>
        <button class="btn btn-primary btn-sm" id="tk-add">＋ Felvétel</button></div>
      ${(t.participants.length&&t.gear.length)?`<div class="divider" style="border-top:1px solid var(--line);margin:1rem 0"></div><h3>Közös felszerelés — ki visz mit</h3>
        ${t.gear.map(g=>`<label class="ck" style="align-items:center;gap:.5rem"><span style="flex:1">${esc(g.icon||"🧰")} ${esc(g.name)}</span>
          <select class="input own-sel" data-gowho="${esc(g.name)}" style="width:170px;font-size:.84rem"><option value="">—</option>${t.participants.map(p=>`<option ${g.who===p.name?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label>`).join("")}
        <p class="small muted mt0">A ki nem osztott felszerelés a Túraprojekt csomagjában van — egy emberhez rendelve nem duplication.</p>`:""}</div></div>`; }
  return _prjTab16(t,catTour); };


/* ---------- 17) V36 kötelek: résztvevő-státusz, teendő-fejlesztés, utazás-bővítés, étel-chipek, Ma-lista, AI-út ---------- */
/* ws after-lánc: tab-függő drótverás */
const _prjWA17 = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ _prjWA17 && _prjWA17(root,id);
  const t=Store.getTour(id); if(!t) return; ensureTourFields(t);
  // Résztvevők: 3 állapotú ciklus + feladatösszefoglaló
  if(wsTab==="resztvevok"){
    root.querySelectorAll("[data-pconf]").forEach(b=>{ const p=t.participants.find(x=>x.id===b.dataset.pconf); if(!p) return;
      const s=p.stat|| (p.confirmed?"jön":"válasz");
      b.textContent = s==="jön"?"✓ Jön":s==="nem"?"✕ Nem jön":"⏳ Válaszra vár";
      b.className = "btn btn-sm "+(s==="jön"?"btn-soft":s==="nem"?"btn-danger":"btn-ember");
      b.onclick = ()=>{ p.stat = s==="válasz"?"jön":s==="jön"?"nem":"válasz"; p.confirmed=p.stat==="jön"; Store.save(); render(); }; });
    const done=t.participants.filter(p=>(p.stat||"válasz")==="jön").length, no=t.participants.filter(p=>p.stat==="nem").length;
    const card=root.querySelector(".card.panel");
    if(card) card.insertAdjacentHTML("afterbegin", `<p class="small muted" style="margin:0 0 .6rem">✓ ${done} jön · ⏳ ${t.participants.length-done-no} válaszol · ✕ ${no} nem jön — a nemet mondottakat a túra napja előtt jelezheted a csoportnak.</p>`);
  }
  // Teendők tab drótozás
  if(wsTab==="teendok"){
    root.querySelectorAll("[data-tk]").forEach(cb=>cb.onclick=()=>{ const x=t.tasks.find(y=>y.id===cb.dataset.tk); if(x){x.done=cb.checked; Store.save(); render();} });
    root.querySelectorAll("[data-tkwho]").forEach(sel=>sel.onchange=()=>{ const x=t.tasks.find(y=>y.id===sel.dataset.tkwho); if(x){ x.who=sel.value||null; Store.save(); render(); } });
    const add=()=>{ const v=root.querySelector("#tk-n").value.trim(); if(!v) return; const w=root.querySelector("#tk-who");
      t.tasks.push({id:uidp("tk"),label:v,done:false,who:w&&w.value?w.value:null,due:Math.max(0,t.date?Store.dayDiff(t.date):3)}); Store.save(); render(); };
    const ab=root.querySelector("#tk-add"); if(ab) ab.onclick=add;
    const inp=root.querySelector("#tk-n"); if(inp) inp.addEventListener("keydown",e=>{if(e.key==="Enter")add();});
    root.querySelectorAll("[data-gowho]").forEach(sel=>sel.onchange=()=>{ const g=t.gear.find(y=>y.name===sel.dataset.gowho); if(g){ g.who=sel.value||null; Store.save(); toast(sel.value?sel.value+" hozza: "+g.name:g.name+" visszatett common-ba","🤝"); } });
  }
  // Utazás kiegészítő mezők
  if(wsTab==="utazas" && !document.getElementById("tr-extra")){
    const c1=root.querySelector(".card.panel");
    if(c1){ const box=document.createElement("div"); box.id="tr-extra"; box.className="card panel";
      box.innerHTML=`<h3>🧳 Indulási részletek</h3>
        <label class="f" for="tr-start">Indulási hely</label><input class="input" id="tr-start" placeholder="Pl. Csíkszereda, autóbusz-pályaudvar" value="${esc(t.startPoint||"")}">
        <div style="height:.6rem"></div>
        <label class="f" for="tr-when">Indulási idő</label><input class="input" id="tr-when" type="time" value="${esc(t.meetingTime||"")}">
        <div style="height:.6rem"></div>
        <label class="f" for="tr-mode">Közlekedési mód</label><select class="input" id="tr-mode">${["Autó","Busz","Vonat","Terepjáró","Gyalog","Bicikli"].map(m=>`<option ${t.travelMode===m?"selected":""}>${m}</option>`).join("")}</select>
        <p class="small muted mt0">Az autó + sofőrök a fenti részen maradtak — az étel/ital a Költségek → utazás tétel lehet. 💶</p>`;
      c1.parentNode.insertBefore(box, c1.nextSibling);
      const sv=()=>{ t.startPoint=box.querySelector("#tr-start").value.trim(); t.meetingTime=box.querySelector("#tr-when").value; t.travelMode=box.querySelector("#tr-mode").value; Store.save(); toast("Utazás adatok mentve ✔","🧳"); };
      box.querySelectorAll("input,select").forEach(el=>el.addEventListener("change",sv)); }
  }
  // Étel预设 chipek
  if(wsTab==="ete" && !document.getElementById("fd-chips")){
    const box=document.createElement("div"); box.id="fd-chips"; box.className="card panel";
    box.innerHTML=`<h3>Gyors felvételek</h3><div class="filter-row">${[["Reggeli","🥣"],["Ebéd","🥪"],["Snack","🍌"],["Ital","🧃"],["Víz","💧"]].map(([n,i])=>`<button class="f-pill" data-fd="${n}" data-fdi="${i}">${i} ${n}</button>`).join("")}</div>
      <p class="small muted mt0">A túra ${t.durationH||"|"} órája alapján a rendszer a fentieket minimumként javasolja.</p>`;
    const g=root.querySelector(".ws-grid"); if(g) g.appendChild(box);
    box.querySelectorAll("[data-fd]").forEach(b=>b.onclick=()=>{
      const n=b.dataset.fd, ex=t.food.find(f=>f.n===n||f.n.startsWith(n+" "));
      const f={id:uidp("fd"),n:(ex?ex.n+" +1":(n==="Víz"?"Víz 1,5 l":n)),i:b.dataset.fdi,checked:false,w:n==="Víz"?1500:(n==="Ebéd"?450:220),cat:n};
      t.food.push(f); Store.save(); render(); toast(f.n+" feltéve — csomagolósúlyban is","🥫"); });
  }
};

/* 3 állapotú display a csapat-státushoz illesztett gombok + Readiness-blokk új sorok — a fent már kezelve. */

/* AI modal kiterjesztése: útvonal-javaslat a katalógusból */
const _oldKit = aiKitModal;
aiKitModal = function(t){
  const norm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u0308]/g,"").replace(/[^a-z0-9 ]/g," ");
  const q=t.title+" "+t.place+" "+t.region;
  let m=null, best=0;
  TOURS.forEach(c=>{ const hay=norm(c.name+" "+c.start.name+" "+c.region); let sc=0;
    norm(q).split(/\s+/).forEach(w=>{ if(w.length>3&&hay.includes(w)) sc++; }); if(sc>best){best=sc;m=c;} });
  window.__aiRoute = (best>0)?m:null;
  _oldKit(t);
  setTimeout(()=>{ try{
    const save=document.getElementById("aikit-save"); const box=save&&save.closest(".modal"); if(!box||!save) return;
    if(!box.querySelector('[data-sec="utvonal"]')){
      const row=document.createElement("label"); row.className="ck"; row.style.cssText="align-items:flex-start;margin-top:.55rem";
      row.innerHTML=`<input type="checkbox" data-sec="utvonal" ${window.__aiRoute?"checked":""}>
        <span><b>🧭 Útvonal${window.__aiRoute?" — "+esc(window.__aiRoute.name):""}</b><br><span class="small muted">${window.__aiRoute?esc(window.__aiRoute.start.name)+" · "+window.__aiRoute.km+" km · "+window.__aiRoute.up+" m szint · GPX a katalógusban":"nincs jó katalógus-egyezés"}</span></span>`;
      save.parentNode.insertBefore(row, save);
    }
    if(!save.__routed){ save.__routed=1; const oc=save.onclick;
      save.onclick=(ev)=>{ const cb=box.querySelector('[data-sec="utvonal"]');
        if(cb&&cb.checked&&window.__aiRoute){ const c=window.__aiRoute;
          t.coords={lat:c.start.lat,lng:c.start.lng}; t.gpx=c.gpxUrl||null; t.refs=c.src||null;
          if(!t.lengthKm){ t.lengthKm=c.km; t.ascent=c.up; } }
        if(oc) oc.call(save,ev); }; }
  }catch(e){ console.error("AI-route",e); } },60);
};

/* „Ma mit kell tennem?” — okos quick widget: fejléc + automata lista */
const _prjDA17 = VIEWS.dash.after;
VIEWS.dash.after = function(root){ _prjDA17 && _prjDA17(root);
  try{
    const sec=root.querySelector('[data-w="quick"]'); const nx=Store.upcoming()[0];
    if(sec && !nx){ const d2=Store.myData(); const w=(d2.wishlist||[])[0];
      sec.innerHTML=`<div class="wpan"><div class="flex between"><h3>📌 Nincs közelgő túrád</h3><span class="chip chip-sand">szabad szombatok 🌲</span></div>
        ${w?`<p class="small" style="margin:.2rem 0 .5rem">A bakancslistád teteje: <b>${esc(w.name)}</b>${w.place?" — "+esc(w.place):""}</p>
        <a class="btn btn-ember btn-sm" href="#/bakancslista">🗓️ Tervezz belőle túraprojektet</a>`
        :`<p class="small" style="margin:.2rem 0 .5rem">Ilyenkor a legjobb felfedezni — az erdő nem vár:</p>
        <a class="btn btn-ember btn-sm" href="#/felfedezes">🧭 Túrák a katalógusban</a>`}
        <a class="btn btn-soft btn-sm" style="margin-left:.4rem" href="#/uj-tura">➕ Új túra</a></div>`; }
    if(sec && nx){ ensureTourFields(nx); const dd=Store.dayDiff(nx.date);
      const todos=[];
      (nx.tasks||[]).filter(x=>!x.done&&x.due<=1).slice(0,3).forEach(x=>todos.push({t:x.label,go:"teendok",who:x.who?esc(x.who)+" — ":""}));
      if(!nx.weatherChecked) todos.push({t:"Ellenőrizd az időjárást",act:"wx"});
      if((nx.gear||[]).some(g=>!g.checked)) todos.push({t:"Csomagold ki a listát (mi hiányzik)",go:"felszereles"});
      if(nx.gear.some(g=>/fejlámpa/i.test(g.name)&&!g.checked) && dd<=1) todos.push({t:"Ellenőrizd a fejlámpát (elem!)",go:"felszereles"});
      if((nx.food||[]).some(f=>!f.checked) && dd<=2) todos.push({t:"Vásárolj vizet + uzsonnát",go:"ete"});
      if((nx.participants||[]).some(p=>!p.confirmed)) todos.push({t:"Erősítsd meg a résztvevőket",go:"resztvevok"});
      const chk=todos.map((x,i)=>`<li class="q36"><button class="q36-go" data-qi="${i}" title="Ugrás">${["☐","☐","☐","☐","☐","☐"][i]}</button><span>${x.who||""}<b>${x.t}</b></span></li>`).join("");
      (sec.querySelector(".wcard")||sec).innerHTML = `<div class="flex between"><h3>📌 Ma mit kell tennem?</h3><span class="chip ${dd<=1?"chip-ember":"chip-sand"}">${dd===0?"MA van! 🥾":dd+" nap múlva: "+esc(nx.title.slice(0,18))}</span></div>
        <p class="small muted" style="margin:.15rem 0 .5rem">A(z) <b>${esc(nx.title)}</b> ${dd===0?"mára":dd+" nap múlva"} esedékes (${nx.date?fmtDateFull(nx.date):""}) — a feladatok a projekt állapotából jöttek.</p>
        <ul class="q36-list">${chk||"<li style='list-style:none' class='muted small'>Minden kulcsfontosságú pont zöld — pipáld aTeendőidet a projektben.</li>"}</ul>`;

    /* dashboard readi = igazi Felkészültség-sáv + Ellenőrzés ugró a projektbe */
    const rs=root.querySelector('[data-w="readi"]');
    if(rs){ const c=Store.tourCheck(nx);
      rs.innerHTML=`<div class="wpan"><div class="flex between"><h3>🎒 Felkészültség — ${esc(nx.title.slice(0,22))}</h3><span class="chip ${c.pct>=100?"chip-green":"chip-ember"}">${c.pct}%</span></div>
        <div class="readi-track" style="margin:.5rem 0 .3rem"><i class="readi-fill ${c.pct>=100?"full":""}" style="width:${c.pct}%"></i></div>
        <p class="small nb" style="margin:0">${c.pct>=100?"🟢 Indulásra kész — jó utat!":`Még ${c.missing.length} dolog van hátra.`} <span class="readi-chips">${c.missing.slice(0,2).map(x=>`<span class="readi-chip">${esc(x.label)}</span>`).join("")}${c.missing.length>2?`<span class="readi-chip">+${c.missing.length-2} többi</span>`:""}</span></p>
        <button class="btn btn-soft btn-sm" id="dash-rdi" style="margin-top:.6rem">🛃 Túra ellenőrzése</button>
        <a class="btn btn-ghost btn-sm" style="margin-top:.6rem" href="#/tura/${nx.id}">Munkaterület →</a></div>`;
      const rb=root.querySelector("#dash-rdi");
      if(rb) rb.onclick=()=>{ readiCheckModal(nx);
        const modal=document.querySelector("[data-modal]");
        if(modal) modal.addEventListener("click",e=>{ const j=e.target.closest("[data-jump]"); if(j){ e.preventDefault(); e.stopPropagation(); closeModal(); wsTab=j.dataset.jump; location.hash="#/tura/"+nx.id; } },true); };
    }
      sec.querySelectorAll("[data-qi]").forEach(li=>li.onclick=(e)=>{ e.stopPropagation(); const x=todos[+li.dataset.qi];
        const mm=location.hash.match(/#\/tura\/([\w-]+)/);
        if(x.act==="wx"){ fetchTourWeather(nx).then(()=>{ toast("Időjárás ellenőrizve ✔","🌤️"); render(); }).catch(()=>toast("Nincs kapcsolat","📡")); return; }
        wsTab=x.go; location.hash="#/tura/"+(mm?mm[1]:""); render(); });
    }
  }catch(e){}
};

/* Túra mód: automatikus „folyamatban” státusz a túra napján + ⚡ gomb a fejlécben */
const _tmodeA = VIEWS.tourmode.after || (r=>{});
VIEWS.tourmode.after = function(root,id){ _tmodeA(root,id);
  try{ const t=Store.getTour(id||location.hash.match(/turamod\/([\w-]+)/)?.[1]); if(!t||!t.date) return;
    if(Store.dayDiff(t.date)<=0 && ["tervezés","közelgő","jelentkezve"].includes(t.status)){ Store.setStatus(t.id,"folyamatban"); } }catch(e){} };


/* ---------- 18) V42: Teljesített túra → Élménykönyv természetes folyamat ---------- */
function richMemory(j){ if(!j) return false;
  return !!( (j.note&&j.note.trim().length>3) || (j.fav&&j.fav.trim()) || (j.lesson&&j.lesson.trim().length>3) || (j.photos||[]).length>1 || j.audio || (j.mood&&j.rating) ); }
window.memBtn = function(t){ const j=Store.myData().journal.find(x=>x.tourId===t.id);
  if(richMemory(j)) return `<button class="btn btn-soft btn-sm" data-openmem="${t.id}">✓ Élmény elmentve</button> <a class="btn btn-ghost btn-sm" href="#/naplo" title="Élménykönyv">🗂</a>`;
  return `<button class="btn btn-ember btn-sm" data-openmem="${t.id}">📖 Élmény hozzáadása</button>`; };
function openMemoryEditor(t, fresh){
  const d=Store.myData(), j=d.journal.find(x=>x.tourId===t.id)||{}; const parts=encodeURIComponent;
  const ppl=(t.participants||[]).map(p=>p.name).join(", ")||""; 
  openModal({ title:"📖 Élmény — "+esc(t.title), body:`
    <p class="small muted mt0" style="margin:0 0 .5rem">${esc(t.region||t.place||"")} · ${t.date?fmtDateFull(t.date):""} · 📏 ${t.lengthKm||"?"} km · ⬆ ${t.ascent||"?"} m${t.durationH?" · ⏱ "+t.durationH+" ó":""}${ppl?" · 👥 "+esc(ppl):""}${t.gpx||t.coords?" · 🧭 útvonal rögzítve":""}</p>
    <label class="f" for="mm-title">Cím</label><input class="input" id="mm-title" value="${esc(j.title||t.title)}">
    <label class="f" style="margin-top:.6rem" for="mm-story">Mesélj a túráról — nem kötelező</label><textarea class="input" id="mm-story" rows="4" placeholder="Mi volt a legjobb? ${fresh?"":"A korábbi szöveg megmarad."}">${esc(j.note||"")}</textarea>
    <label class="f" style="margin-top:.7rem">⭐ Értékeld a túrát</label>
    <div id="mm-stars" style="display:flex;gap:.2rem;font-size:1.8rem">${[1,2,3,4,5].map(i=>`<button data-s="${i}" style="background:none;border:0;cursor:pointer;color:${i<=(j.rating||5)?"var(--ember)":"#cfcabb"}" aria-label="${i}">★</button>`).join("")}</div>
    <label class="f" style="margin-top:.7rem" for="mm-fav">❤️ Kedvenc pillanatom</label><input class="input" id="mm-fav" value="${esc(j.fav||"")}" placeholder="Egy mondat, ami leginkább visszaadja.">
    <label class="f" style="margin-top:.6rem" for="mm-lesson">💡 Mit tanultam ebből a túrából?</label><input class="input" id="mm-lesson" value="${esc(j.lesson||"")}" placeholder="Pl. jövőre korábban indulunk.">
    <label class="f" style="margin-top:.7rem" for="mm-ph">📸 Fotók</label><input type="file" id="mm-ph" accept="image/*" multiple class="input" style="padding:.55em">
    ${(j.photos&&j.photos.length>1)?`<div class="tm-photos" style="margin-top:.4rem">${j.photos.slice(0,6).map(q=>`<img src="${q}" alt="emlék">`).join("")}</div>`:`<p class="small muted" style="margin-top:.3rem">${(j.photos||[]).length?"Már van egy borító-kép a túrából.":"Most még nincs fotó — fel is tölthetsz."}</p>`}
    <button class="btn btn-primary btn-block btn-lg" id="mm-save" style="margin-top:.9rem">📖 Elmentem az Élménykönyvembe</button>`,
    footer:`<button class="btn btn-ghost btn-block" data-close>${fresh?"Később mentem el":"Mégse"}</button>`,
    onOpen(r){
      let rating=j.rating||5; const stars=()=>r.querySelectorAll("[data-s]").forEach(s=>s.style.color=(+s.dataset.s)<=rating?"var(--ember)":"#cfcabb");
      r.querySelectorAll("[data-s]").forEach(s=>s.onclick=()=>{rating=+s.dataset.s;stars()}); stars();
      r.querySelector("#mm-save").onclick=()=>{ const files=[...(r.querySelector("#mm-ph").files||[])]; const old=(j.photos||[]).filter(p=>p&&(p.indexOf("data:")===0||(p.length<200&&p!==t.img)));
        const finalize=(extra)=>{ const photos=[...new Set([...(j.photos&&j.photos.length>1?j.photos:(old.length?old:[])), ...extra])].slice(0,9);
          Store.completeTour(t.id, { rating, note:r.querySelector("#mm-story").value, lesson:r.querySelector("#mm-lesson").value,
            fav:r.querySelector("#mm-fav").value, title:r.querySelector("#mm-title").value.trim()||t.title, photos,
            km:+(r.querySelector("#mm-km")||{}).value||0 }); const jj=Store.myData().journal.find(x=>x.tourId===t.id);
          jj.km=+j.km||+t.lengthKm||0; Store.save(); closeModal();
          openModal({ title:"📖 Élmény mentve", body:`<p class="muted mt0">A(z) <b>${esc(t.title)}</b> élménye az Élménykönyvedben van — a túra véglegesítve.</p>
            <div class="flex" style="gap:.5rem;justify-content:flex-end"><button class="btn btn-ghost" data-close>Kész</button><a class="btn btn-primary" href="#/naplo" data-close-onclick> Megnézem az élményt</a></div>`,
            footer:`<button class="btn btn-primary btn-block" id="mm-view">📖 Megnézem az élményt</button>`,
            onOpen(x){ const go=()=>{ closeModal(); NAV.to("#/naplo"); }; const a=x.querySelector("#mm-view"); if(a)a.onclick=go;
              const b=x.querySelector("[data-close-onclick]"); if(b)b.onclick=(e)=>{e.preventDefault();go();}; } }); };
        if(!files.length){ finalize([]); return; }
        let done=0; const acc=[];
        files.slice(0,6).forEach(f=>{ const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); const sc=Math.min(1,900/im.width);
            c.width=Math.round(im.width*sc); c.height=Math.round(im.height*sc); c.getContext("2d").drawImage(im,0,0,c.width,c.height);
            acc.push(c.toDataURL("image/jpeg",0.62)); if(++done===Math.min(files.length,6)) finalize(acc); }; im.onerror=()=>{ if(++done>=files.length) finalize(acc); }; im.src=rd.result; }; rd.readAsDataURL(f); });
      }; } });
  const mmk=r2=>{};
}
function congratsToursModal(t){
  openModal({ title:"🎉 Gratulálunk!", body:`<p class="muted mt0" style="font-size:1.05rem">Teljesítetted: <b>${esc(t.title)}</b>.</p>
      <p class="muted">Szeretnéd elmenteni ezt az élményt az Élménykönyvedbe? Csillag, egy mondat, fotó — ennyi is elég.</p>`,
    footer:`<div class="flex" style="gap:.5rem;justify-content:flex-end"><button class="btn btn-ghost" id="cg-later">Később</button>
      <button class="btn btn-primary" id="cg-now">📖 Élmény hozzáadása</button></div>`,
    onOpen(r){ r.querySelector("#cg-now").onclick=()=>{ closeModal(); openMemoryEditor(t,true); };
      r.querySelector("#cg-later").onclick=()=>{ closeModal(); toast("A túra Complete maradt — élményt bármikor fűzhetsz hozzá","🎒"); render(); }; } });
}
/* gombokdrótozás a Túráim-listében + a sorok frissítési állapotai */
const _prjDA18 = VIEWS.dash.after;
VIEWS.dash.after = (root)=>{ _prjDA18 && _prjDA18(root);
  try{ const mem=root.querySelector('[data-w="memory"]');
    if(mem){ const d0=Store.myData(); const ms=d0.journal.slice().sort((a,b)=>(b.doneAt||b.date||"").localeCompare(a.doneAt||a.date||"")).slice(0,3);
      if(!d0.journal.length){ mem.innerHTML=`<div class="wpan"><h2 style="font-size:1.2rem">📖 Élménykönyv</h2>
        <p class="small" style="margin:.25rem 0 0">Még nincs elmentett élményed.</p>
        <p class="small muted" style="margin:.15rem 0 .55rem">Az első teljesített túrád után itt őrizheted meg az élményeidet.</p>
        <a class="btn btn-soft btn-sm" href="#/turaim">Teljesítettek</a> <a class="btn btn-ghost btn-sm" href="#/uj-tura">➕ Új túra</a></div>`; }
      else {  // tartalmas widget: teljes tartalom-ujraírás a kártyákkel + Összes élmény
        d0.journal.sort((a,x)=>(x.date||"").localeCompare(a.date||""));
        const top=d0.journal.slice(0,3);
        mem.innerHTML=`<div class="wpan"><h2 style="font-size:1.2rem">📖 Élménykönyv</h2>
          ${top.map(j=>`<a class="mem-mini" href="#/naplo">${j.photos&&j.photos[0]?`<img src="${j.photos[0]}" alt="">`:"🏞️"}
            <span><b>${esc((j.title||"").slice(0,26))}</b><small>${j.rating?`★${j.rating} · `:""}${j.date?fmtDate(j.date):""} · ${j.km||"?"} km${j.mood?" "+j.mood:""}</small></span></a>`).join("")}
          <div style="margin-top:.55rem"><a class="btn btn-soft btn-sm" id="mem-all" href="#/naplo">📖 Összes élmény (${d0.journal.length})</a></div></div>`; } }
  }catch(e){} };
const _prjTourA18 = VIEWS.tours.after;
VIEWS.tours.after = (root)=>{ _prjTourA18 && _prjTourA18(root);
  root.querySelectorAll("[data-openmem]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(b.dataset.openmem); if(t) openMemoryEditor(t); }); };
/* a workspace napló-fül „✓ Teljesítettem” gombja is a gratulálóba fusson */
const _prjWS18 = VIEWS.workspace.after;
VIEWS.workspace.after = (root,id)=>{ _prjWS18 && _prjWS18(root,id); 
  root.querySelectorAll("[data-openmem-ws]").forEach(b=>b.onclick=()=>{ const t=Store.getTour(id); if(t) openMemoryEditor(t); }); };

window.congratsToursModal = congratsToursModal; window.openMemoryEditor = openMemoryEditor;
window.__V42 = 1;


/* ---------- 19) V43: Okos túratervező (smart planner) — aiKitModal új felülírása ---------- */
const spN = x => String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g," ").replace(/[^a-z0-9 ]/g," ").trim();
function smartPlanner(t){
  const d = Store.myData(); ensureTourFields(t);
  const missing=[]; if(!t.date) missing.push("A túra időpontja nincs megadva — az idővonalhoz javasolt időpontokat készítek.");
  if(!(t.coords||t.gpx||t.waypoints) ) missing.push("Az útvonal részletei még hiányoznak.");
  if(!t.weather) missing.push("Időjárási adat jelenleg nem érhető el.");
  const K={ idoter:buildTimeKit(t), csomag:buildGearKit(t), etel:buildFoodKit(t), utazas:buildTravelKit(t), teendok:buildTaskKit(t) };
  const haveG={}, haveF={}, haveT={};
  t.gear.forEach(g=>haveG[spN(g.name)]=1); t.food.forEach(f=>haveF[spN(f.n)]=1); t.tasks.forEach(x=>haveT[spN(x.label)]=1);
  const gearRows=K.csomag.map(g=>{ const ownE=(d.equipment||[]).find(e=>spN(e.name)===spN(g.name)); return Object.assign({ownE},g); });
  const inGear=haveG;
  const routeNorm=x=>String(x||"").toLowerCase();
  let routeMatch=null; const rq=spN(t.title+" "+t.place+" "+t.region);
  let best=0; (typeof TOURS!=="undefined"?TOURS:[]).forEach(c=>{ let sc=0; spN(c.name+" "+c.start.name+" "+c.region).split(" ").forEach(w=>{ if(w.length>3 && rq.includes(w)) sc++; }); if(sc>best){best=sc;routeMatch=c;} });
  if(best<1) routeMatch=null;
  const hasTravelData = (t.cars||[]).length || t.meeting || t.startPoint;
  const budget=(t.budget||[]); const bsum=budget.reduce((a,x)=>a+(+x.amt||0),0);
  const weatherHint = t.weather && (t.weather.rain>=40) ? `<div class="alert-strip"><span>🌧️</span><div>Eső várható (${t.weather.rain}%). Érdemes esőkabátot és vízálló táskavédelmet vinni — ez most csak javaslat.</div></div>` : "";

  openModal({ title:"🤖 Okos túratervező",
    body:`<p class="muted small mt0" id="sp-status">Átnézem a túrád adatait…</p>
      ${missing.length?`<p class="small muted" style="margin:.2rem 0 .6rem">${missing.join(" ")}</p>`:""}
      ${weatherHint}
      <div id="sp-body" style="margin-top:.4rem"></div>`,
    footer:``,
    onOpen(r){
      const body=r.querySelector("#sp-body"); const stat=r.querySelector("#sp-status");
      const STEPS=["Túra adatai","Felszerelés","Étel és víz","Idővonal","Feladatok","Közlekedés"];
      let si=0; stat.innerHTML=STEPS.map((s,i)=>`<span class="sp-step ${i?"":"on"}" data-step="${i}">${i?"·":"▸"} ${s}</span>`).join(" ");
      const tick=setInterval(()=>{ si++; stat.querySelectorAll(".sp-step").forEach((el,i)=>el.classList.toggle("done",i<si)); if(si>=STEPS.length){ clearInterval(tick); renderPanel(); } },90);

      function renderPanel(){
        body.innerHTML=`
        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="idoter" checked> <b>🕐 Idővonal <span class="chip chip-sand">szerkeszthető</span></b></label>
          <div id="sp-time">${K.idoter.map((x,i)=>`<div class="sp-row" data-ti="${i}"><input class="input sp-t" type="time" value="${x.t}"><input class="input sp-l" value="${esc(x.l)}"><button class="icon-btn sp-x" data-tx="${i}" title="Eltávolítás">✕</button></div>`).join("")}</div>
          <button class="btn btn-ghost btn-sm" id="sp-tadd">＋ Időpont</button></section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="pakolas" checked> <b>🎒 Pakolás</b></label>
          ${gearRows.map((g,i)=>{ const have=!!inGear[spN(g.name)];
            return `<div class="sp-row"><span class="sp-ic">${g.icon||"🧰"}</span><span class="sp-n">${esc(g.name)}<small class="muted"> · ${g2kg(g.w)}${g.chkExtra||""}</small>${have?` <span class="chip chip-green">✓ a listában</span>`:(g.ownE?` <span class="chip chip-pine">🎒 saját: ${esc(g.ownE.name)}</span>`:` <span class="chip chip-sand">nincs a táradban</span>`)}</span>
              ${have?`<span class="muted small">—</span>`:(g.ownE?`<button class="btn btn-soft btn-sm" data-gadd="${i}" data-own="1">＋ Saját tárból</button>`:`<button class="btn btn-soft btn-sm" data-gadd="${i}">＋ Pakoláshoz</button>`)}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="etel" checked> <b>💧 Étel és víz <span class="chip chip-sand">javasolt mennyiségek</span></b></label>
          ${K.etel.map((f,i)=>{ const have=!!haveF[spN(f.n)];
            return `<div class="sp-row"><span class="sp-ic">${f.i||"🥫"}</span><span class="sp-n">${esc(f.n)}<small class="muted"> · ~${g2kg(f.w)}</small></span>${have?`<span class="chip chip-green">✓</span>`:`<button class="btn btn-soft btn-sm" data-fadd="${i}">＋ Hozzáadás</button>`}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="task" checked> <b>📋 Feladatok</b></label>
          ${["Időjárás ellenőrzése a túra előtt","Víz és élelem beszerzése","Társak visszaigazolása","Autó / utazás egyeztetése","Indulás előtti felszerelés-ellenőrzés"].map((x,i)=>{ const have=!!haveT[spN(x)];
            return `<div class="sp-row"><span class="sp-n">☐ ${esc(x)}</span>${have?`<span class="chip chip-green">✓ szerepel</span>`:`<button class="btn btn-soft btn-sm" data-tadd="${i}" data-lab="${esc(x)}">＋</button>`}</div>`; }).join("")}</section>

        <section class="sp-sec"><label class="ck" style="align-items:center"><input type="checkbox" data-cat="kozlekedes" ${hasTravelData?"checked":"disabled"}> <b>🚗 Közlekedés</b></label>
          ${hasTravelData?`<p class="small mb0" style="margin:.2rem 0 .4rem">${t.meeting?("Találkozó: <b>"+esc(t.meeting)+"</b> · "):""}${(t.cars||[]).length?("Autó: "+t.cars.map(c=>esc(c.driver)).join(", ")):""}${t.startPoint?(" · Indulás: "+esc(t.startPoint)):""}</p>
          <p class="small muted mb0">Az Alkalmazás a szabad ülőhelyekre beüli a vissza nem erősített résztvevőket — sofőrt és helyszínt nem talál ki.</p>`:
          `<p class="small mb0" style="margin:.2rem 0 .4rem">🚗 A közlekedés még nincs megtervezve.</p><button class="btn btn-soft btn-sm" id="sp-travel">Tervezem →</button>`}</section>

        <section class="sp-sec"><b>💶 Költségek</b>
          ${budget.length?`<p class="small mb0" style="margin:.2rem 0">Becsült költség a beírt tételeidből: <b>${bsum} €</b> — az összegek a te adataid, nem ajánlások.</p><a class="btn btn-ghost btn-sm" href="#/tura/${t.id}" data-jump="koltseg">Költség-rovat →</a>`:`<p class="small muted mb0" style="margin:.2rem 0">Nincsenek rögzített költségeid. Árat nem találok ki — a Költségek模块ban vezethetsz.</p><button class="btn btn-ghost btn-sm" data-jump="koltseg">Költség-rovat →</button>`}</section>

        ${routeMatch&&!t.coords?`<section class="sp-sec"><b>🧭 Útvonal</b><p class="small" style="margin:.2rem 0">Katalógus-találat: <b>${esc(routeMatch.name)}</b> (${routeMatch.km} km · ⬆${routeMatch.up} m) — koordináták importálása?</p><button class="btn btn-soft btn-sm" id="sp-route">＋ Útvonal beemelése</button></section>`:(t.coords||t.gpx?`<section class="sp-sec"><b>🧭 Útvonal</b> <span class="chip chip-green">✓ beállítva</span></section>`:`<section class="sp-sec"><b>🧭 Útvonal</b> <span class="muted small">nincs katalógus-egyezés — a Térkép/Útvonal modulban adhatod meg.</span></section>`)}

        <div class="flex" style="gap:.5rem;justify-content:flex-end;margin-top:.9rem">
          <button class="btn btn-ghost" data-close>← Még átnézem</button>
          <button class="btn btn-primary" id="sp-apply">✓ Kiválasztottak alkalmazása</button></div>`;
        wire();
      }
      function wire(){
        body.querySelectorAll("#sp-time .sp-x").forEach(b=>b.onclick=()=>{ b.closest(".sp-row").remove(); });
        const ta=body.querySelector("#sp-tadd"); if(ta) ta.onclick=()=>{ const row=document.createElement("div"); row.className="sp-row";
          row.innerHTML=`<input class="input sp-t" type="time" value="12:00"><input class="input sp-l" placeholder="Jelölés"> <button class="icon-btn sp-x">✕</button>`; body.querySelector("#sp-time").appendChild(row); row.querySelector(".sp-x").onclick=()=>row.remove(); };
        body.querySelectorAll("[data-gadd]").forEach(btn=>btn.onclick=()=>{ const i=+btn.dataset.gadd; const g=gearRows[i]; if(!g||inGear[spN(g.name)]||g.__added) return;
          const ownE=g.ownE; t.gear.push({ name:g.name, cat:(ownE&&ownE.cat)||g.cat, icon:g.icon||"🧰", w:ownE?(+ownE.w||g.w):g.w, checked:false, own:!!ownE, note:ownE?"saját tár (okos terv)":"okos terv" });
          g.__added=1; inGear[spN(g.name)]=1; btn.outerHTML=`<span class="chip chip-green">✓ hozzáadva</span>`; Store.save(); });
        body.querySelectorAll("[data-fadd]").forEach(btn=>btn.onclick=()=>{ const f=K.etel[+btn.dataset.fadd]; if(!f||haveF[spN(f.n)]) return;
          t.food.push({id:uidp("fd"),n:f.n,i:f.i,checked:false,w:f.w}); haveF[spN(f.n)]=1; btn.outerHTML=`<span class="chip chip-green">✓</span>`; Store.save(); });
        body.querySelectorAll("[data-tadd]").forEach(btn=>btn.onclick=()=>{ const lab=btn.dataset.lab; if(!lab||haveT[spN(lab)]) return;
          t.tasks.push({id:uidp("tk"),label:lab,done:false,who:null,due:Math.max(1,t.date?Store.dayDiff(t.date):3)}); haveT[spN(lab)]=1; btn.outerHTML=`<span class="chip chip-green">✓</span>`; Store.save(); });
        const rt=body.querySelector("#sp-route"); if(rt) rt.onclick=()=>{ t.coords={lat:routeMatch.start.lat,lng:routeMatch.start.lng}; t.gpx=routeMatch.gpxUrl||null; Store.save(); rt.outerHTML=`<span class="chip chip-green">✓ Útvonal beemelve</span>`; toast("Útvonal importálva a katalógusból","🧭"); };
        const tr=body.querySelector("#sp-travel"); if(tr) tr.onclick=()=>{ closeModal(); wsTab="utazas"; render(); };
        body.querySelectorAll("[data-jump]").forEach(x=>x.onclick=()=>{ closeModal(); wsTab=x.dataset.jump; render(); });
        const ap=body.querySelector("#sp-apply"); if(ap) ap.onclick=()=>{
          const on=k=>{ const el=body.querySelector(`[data-cat="${k}"]`); return el&&el.checked && !el.disabled; };
          let n={};
          if(on("idoter")){ const rows=[...body.querySelectorAll("#sp-time .sp-row")]; const ex=t.timeline.map(x=>(spN(x.t)+spN(x.l)));
            rows.forEach((rw,i)=>{ const tv=rw.querySelector(".sp-t").value, lab=rw.querySelector(".sp-l").value.trim(); if(tv&&lab&&!ex.includes(spN(tv)+spN(lab))){ t.timeline.push({id:uidp("tl"),t:tv,l:lab,ty:"ai"}); }});
            t.timeline.sort((a,b)=>a.t.localeCompare(b.t)); n.idoter=t.timeline.length; }
          if(on("pakolas")){ const before=t.gear.length;
            gearRows.forEach(g=>{ const key=spN(g.name); if(inGear[key]) return; const ownE=g.ownE;
              t.gear.push({name:g.name,cat:(ownE&&ownE.cat)||g.cat,icon:g.icon||"🧰",w:ownE?(+ownE.w||g.w):g.w,checked:false,own:!!ownE,note:ownE?"saját tár (okos terv)":"okos terv"}); });
            n.pakolas=t.gear.length-before; }
          if(on("etel")){ const before=t.food.length; K.etel.forEach(f=>{ if(!haveF[spN(f.n)]){ t.food.push({id:uidp("fd"),n:f.n,i:f.i,checked:false,w:f.w}); haveF[spN(f.n)]=1; } }); n.etel=t.food.length-before; }
          if(on("task")){ const before=t.tasks.length; ["Időjárás ellenőrzése a túra előtt","Víz és élelem beszerzése","Társak visszaigazolása","Autó / utazás egyeztetése","Indulás előtti felszerelés-ellenőrzés"].forEach(lab=>{ if(!haveT[spN(lab)]){ t.tasks.push({id:uidp("tk"),label:lab,done:false,who:null,due:Math.max(1,t.date?Store.dayDiff(t.date):3)}); haveT[spN(lab)]=1; } }); n.task=t.tasks.length-before; }
          if(on("kozlekedes")){ let seats=t.cars.reduce((s,c)=>s+Math.max(0,(c.seats||4)-(c.assigned||[]).length),0);
            const un=t.participants.filter(p=>!p.confirmed&&!t.cars.some(c=>(c.assigned||[]).includes(p.name)));
            if(t.cars.length){ let ci=0; un.forEach(p=>{ while(ci<t.cars.length && (t.cars[ci].assigned||[]).length>= (t.cars[ci].seats||4)) ci++;
              if(ci<t.cars.length){ t.cars[ci].assigned=[...(t.cars[ci].assigned||[]),p.name]; n.kozlekedes=(n.kozlekedes||0)+1; } }); }
            if(!t.meeting && n.kozlekedes) {}/* nem talál ki helyszínt */ }
          if(t.status==="ötlet") t.status="tervezés";
          Store.save(); const r2=Store.readiness(t);
          closeModal(); render();
          toast(`Terv alkalmazva — idővonal:${n.idoter??"✓"} · pakolás +${n.pakolas||0} · étel +${n.etel||0} · feladat +${n.task||0}${n.kozlekedes?" · ülőhely +"+n.kozlekedes:""}. Felkészültség: ${r2.pct}%`,"🤖"); };
      }
    }});
}

aiKitModal = smartPlanner; window.smartPlanner=smartPlanner;
window.__V16PROJECT = 1;
})();

/* ==== v44 ==== */
/* V44 – §20: „Nézd át a túrámat!” — olvasó-ellenőrző modal. Nem ír a projektbe; csak Intézem-gomb után. */
(function(){
"use strict";
function ensureTourFields(t){ if(!t.tasks) t.tasks=[]; if(!t.noteStream) t.noteStream=[]; return t; }
function normC(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function rvwHas(t, rx){ return (t.gear||[]).some(function(g){ return rx.test(normC(g.name)); }); }
function rvwAddGear(t, label, rx){
  if(rvwHas(t, rx)){ toast("Ez már szerepel a csomaglistán","🎒"); return false; }
  var eq=(Store.myData().equipment||[]).find(function(e){ return rx.test(normC(e.name)); });
  t.gear.push({ name:(eq?eq.name:label), cat:(eq&&eq.cat)||"Egyéb", icon:"🧰", w:eq?(+eq.w||450):450,
    checked:false, own:!!eq, note:"Nézd át — javasolt" });
  Store.save(); return true;
}
function rvwWeatherFresh(t){
  var key=(t.date||"nodb")+"|"+((t.coords&&t.coords.lat)||0)+"|"+(t.place||t.region||"");
  window.__rvwW = window.__rvwW || {};
  var C=window.__rvwW;
  if(C[key] && C[key].at && Date.now()-C[key].at < 5*60*1000) return Promise.resolve(C[key].w);
  var lat,lng;
  if(t.__wc){ lat=t.__wc.lat; lng=t.__wc.lng; }
  else if(t.coords && +t.coords.lat){ lat=+t.coords.lat; lng=+t.coords.lng; }
  else if(t.place || t.region){
    return fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(String(t.place||t.region).slice(0,40))+"&count=1&language=hu")
      .then(function(r){return r.json();}).then(function(g){
        if(!g.results||!g.results[0]) return null;
        var c={lat:g.results[0].latitude,lng:g.results[0].longitude};
        try{ Object.defineProperty(t,"__wc",{value:c,enumerable:false,configurable:true}); }catch(e){}
        var day=(t.date&&/^\d{4}-\d\d-\d\d$/.test(t.date))?t.date:Store.todayISO();
        return fetch("https://api.open-meteo.com/v1/forecast?latitude="+c.lat+"&longitude="+c.lng+"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&start_date="+day+"&end_date="+day+"&timezone=auto")
          .then(function(rr){return rr.json();}).then(function(j){ var d0=j.daily||{};
            var w={ rain:+(d0.precipitation_probability_max&&d0.precipitation_probability_max[0]||0),
              tmax:Math.round((d0.temperature_2m_max&&d0.temperature_2m_max[0])||0),
              tmin:Math.round((d0.temperature_2m_min&&d0.temperature_2m_min[0])||0),
              wind:Math.round((d0.wind_speed_10m_max&&d0.wind_speed_10m_max[0])||0),
              code:(d0.weather_code&&d0.weather_code[0])||0 };
            C[key]={at:Date.now(),w:w}; return w; }).catch(function(){ return null; });
      }).catch(function(){ return null; });
  } else return Promise.resolve(null);
  if(!lat) return Promise.resolve(null);
  var day=(t.date&&/^\d{4}-\d\d-\d\d$/.test(t.date))?t.date:null;
  if(!day) return Promise.resolve(null);
  var dd=Store.dayDiff(day);
  if(dd<-1||dd>14) return Promise.resolve("NOLONG");
  var url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max"+
    "&start_date="+day+"&end_date="+day+"&timezone=auto";
  return fetch(url).then(function(r){return r.json();}).then(function(j){
    var d=j.daily||{};
    var w={ rain:+(d.precipitation_probability_max&&d.precipitation_probability_max[0]||0),
      tmax:Math.round((d.temperature_2m_max&&d.temperature_2m_max[0])||0),
      tmin:Math.round((d.temperature_2m_min&&d.temperature_2m_min[0])||0),
      wind:Math.round((d.wind_speed_10m_max&&d.wind_speed_10m_max[0])||0),
      code:(d.weather_code&&d.weather_code[0])||0 };
    C[key]={at:Date.now(),w:w}; return w; }).catch(function(){ return null; });
}
var RVW_STEPS=["Túra adatai","Időjárás","Felszerelés","Étel és víz","Társak","Idővonal","Közlekedés"];

function tourReview(t){
  ensureTourFields(t);
  openModal({ title:"🔍 Túra ellenőrzése — "+esc(t.title),
    body:'<p class="muted small mt0" id="rvw-status"></p><div id="rvw-body" style="margin-top:.4rem"></div>',
    footer:"",
    onOpen: function(mr){
      var stat=mr.querySelector("#rvw-status"), body=mr.querySelector("#rvw-body");
      stat.innerHTML = RVW_STEPS.map(function(s,i){ return '<span class="sp-step'+(i?'':' on')+'">'+s+'</span>'; }).join(" ");
      var si=-1;
      var tick=setInterval(function(){ si++;
        stat.querySelectorAll(".sp-step").forEach(function(el,k){ el.classList.toggle("done",k<=si); });
        if(si>=RVW_STEPS.length-1){ clearInterval(tick); run(); } },85);

      function actBtn(a,item){ if(!a) return ""; var enc=encodeURIComponent(JSON.stringify(a));
        return '<button class="btn btn-soft btn-sm" data-rvw-jump="'+enc+'">'+esc(a.l)+'</button>'; }
      function rowOf(x, lvl){ return '<div class="rvw-row"><span>'+(lvl==="i"?"🔴 ":"🟠 ")+x.t+'</span>'+actBtn(x.a,x)+'</div>'; }

      function run(){
        stat.innerHTML = RVW_STEPS.map(function(s){ return '<span class="sp-step done">✓ '+s+'</span>'; }).join(" ");
        var imp=[], att=[], okL=[], info=[]; var nFix=0;
        rvwWeatherFresh(t).then(function(wxRes){
          var wx = (wxRes && wxRes!=="NOLONG") ? wxRes : (t.weather||null);
          var rd=Store.readiness(t), H=+t.durationH||0, P=(t.participants||[]).length;
          if(!wxRes && t.weather){ wx=t.weather; }
          if(wxRes==="NOLONG") info.push("ℹ️ Ehhez a dátumhoz még nincs elérhető időjárási előrejelzés.");
          if(!wxRes && wxRes!=="NOLONG") info.push("ℹ️ Időjárási adat jelenleg nem érhető el ehhez a helyszínhez.");

          if(!t.date) info.push("ℹ️ A túra időpontja nincs megadva.");
          if(t.coords||t.gpx|| (t.waypoints&&t.waypoints.length)) okL.push("🧭 Útvonal rendben"); else info.push("ℹ️ Az útvonal részletei még hiányoznak.");

          if(wx){
            var rainy=(wx.rain>=40);
            if(rainy && !rvwHas(t,/kabat|waterproof|esok/)){ imp.push({t:"Eső várható a túra idején ("+wx.rain+"%), de esőkabát nincs a pakoláson.", a:{l:"+ Pakoláshoz", g:"Esőkabát", rx:"kabat|esok"}, rx:"kabat|esok"}); nFix++; }
            else if(rainy) okL.push("🌧️ Esőre felkészültél");
            else okL.push("🌤️ Időjárás: száraznak ígérkezik ("+wx.rain+"% eső)");
            if(wx.tmin<=3 && !rvwHas(t,/meleg|polart|pulover|sapka|kesztyu|reka/)){ att.push({t:"Hideg reggel ("+wx.tmin+"°C) — meleg réteg nincs a listán.", a:{l:"+ Pakoláshoz", g:"Meleg réteg", rx:"meleg|polart|pulover"}, rx:"meleg|poly|pulover|sapka"}); nFix++; }
            if(wx.wind>=35 && (+t.ascent||0)>=450){ att.push({t:"Erős szél ("+wx.wind+" km/h) és kitett, magas útvonal — jó előre számolni vele.", a:{l:"🕐 Idővonal", w:"idoter"}}); nFix++; }
          }
          var nightStart = (t.timeline&&t.timeline.length&&t.timeline[0].t && t.timeline[0].t < "06:30");
          if(nightStart && !rvwHas(t,/fejla|lamp|hlanl/)){ att.push({t:"Sötét indulás ("+t.timeline[0].t+") — fejlámpa nem szerepel a csomaglistán.", a:{l:"+ Pakoláshoz", g:"Fejlámpa", rx:"fejl|lamp"}, rx:"fejl|lamp"}); nFix++; }

          if(!(t.gear||[]).length){ imp.push({t:"Nincs csomaglista a túrához.", a:{l:"🗺️ Tervező megNyitása", open:"kit"}}); nFix++; }
          else { var un=t.gear.filter(function(g){return !g.checked;}).length, own=t.gear.filter(function(g){return g.own;}).length;
            okL.push("🎒 "+t.gear.length+" elem a listán"+(own?" · "+own+" saját tárós":""));
            if(un){ att.push({t:un+" elem még nincs bepipálva.", a:{l:"🎒 Pakoláshoz", w:"felszereles"}}); nFix++; } else okL.push("🟢 Csomaglista kipipálva"); }
          if(t.weather && !t.weatherChecked){ att.push({t:"☀️ Az időjárást a projektben még nem jelölted ellenőrzöttnek.", a:{l:"✔ Megjelölöm", markwx:1}}); nFix++; }
          var waterKg=(t.food||[]).reduce(function(a,f){ return /viz|iv|water/i.test(normC(f.n))?a+(+f.w||0):a; },0)/1000;
          if(!(t.food||[]).length){ att.push({t:"Nincs étel/víz terv.", a:{l:"💧 Módosítom", w:"ete"}}); nFix++; }
          else if(H>=3 && P>=0 && waterKg < (H/2)*(P||1)*0.75){ att.push({t:"Víz: "+waterKg.toFixed(1)+" l tervezett — a távhoz képest kevésnek tűnik.", a:{l:"💧 Módosítom", w:"ete"}}); nFix++; }
          else okL.push("🟢 Étel és víz rendben");
          var conf=t.participants.filter(function(p){return p.confirmed||p.stat==="jön";}).length;
          var dec=t.participants.filter(function(p){return p.stat==="nem";}).length;
          if(P===0){ info.push("👥 Nincs résztvevő — egyedül mész?"); }
          else if(dec){ att.push({t:dec+" résztvevő nem jön — ültetés/étel eshet át.", a:{l:"👥 Megnézem", w:"resztvevok"}}); nFix++; }
          else if(conf<P){ att.push({t:(P-conf)+" résztvevő még nem erősítette meg.", a:{l:"👥 Megnézem", w:"resztvevok"}}); nFix++; }
          else okL.push("👥 Mindenki visszaigazolta");
          if(!(t.timeline||[]).length){ att.push({t:"Az idővonal még nincs megtervezve.", a:{l:"🕐 Tervezem", w:"idoter"}}); nFix++; }
          else if(t.timeline.length<3){ att.push({t:"Idővonal csak "+t.timeline.length+" pontból áll — érdemes kiegészíteni.", a:{l:"🕐 Tervezem", w:"idoter"}}); }
          else okL.push("🕐 Idővonal rendben");
          var hasMeet=!!(t.meeting||t.startPoint||t.meetingTime||t.travelMode), hasCar=(t.cars||[]).length>0;
          if(!hasMeet && !hasCar){ att.push({t:"A közlekedés még nincs megtervezve.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else if(hasMeet!==hasCar || (hasCar && !t.meeting) || (hasCar && !t.meetingTime)){ att.push({t:"Közlekedés részleges: találkozási pont/idő vagy autó hiányzik.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else if(P>0 && !t.cars.some(function(c){return (c.assigned||[]).length;})){ att.push({t:"Senki sincs beosztva az autókba.", a:{l:"🚗 Tervezem", w:"utazas"}}); nFix++; }
          else okL.push("🚗 Közlekedés rendben");
          var openT=t.tasks.filter(function(x){return !x.done;});
          if(openT.length){ var li=openT.slice(0,3).map(function(x){return "□ "+esc((x.who?x.who+" — ":"")+x.label);}).join("<br>");
            att.push({t:"Még "+openT.length+" teendő: "+li, a:{l:"📋 Feladatok", w:"teendok"}}); nFix++; }
          else if(t.tasks.length) okL.push("📋 Minden teendő kész");
          if(!(t.budget||[]).length) info.push("ℹ️ Nincsenek rögzített költségek — a Költségek fülön vezetheted.");
          var ready = imp.length===0 && att.length===0;
          var html='<div class="rvw-head"><span class="rvw-pct">'+rd.pct+'%</span><b>🥾 Túra készültsége: '+rd.pct+'%</b><span class="small muted"> · '+(nFix?nFix+" dologra még érdemes figyelned":"minden rendben")+'</span></div>';
          if(ready){ html+='<div class="alert-strip"><span>🎉</span><div>A(z) <b>'+esc(t.title)+'</b> túrád készen áll! <div class="small" style="margin-top:.3rem">'+okL.slice(0,6).map(function(o){return "🟢 "+esc(typeof o==="string"?o:o.t);}).join(" · ")+'</div></div></div><p class="small muted">Minden fontos előkészület rendben van.</p>'; }
          else{
            if(imp.length){ html+='<h3 class="rvw-h">🔴 Fontos ('+imp.length+')</h3>'+imp.map(function(x){return rowOf(x,"i");}).join(""); }
            if(att.length){ html+='<h3 class="rvw-h">🟠 Figyelj rá ('+att.length+')</h3>'+att.map(function(x){return rowOf(x,"a");}).join(""); }
            if(okL.length){ html+='<div class="rvw-okwrap"><b class="small">🟢 Rendben</b>'+okL.map(function(o){return '<p class="small" style="margin:.22rem 0">• '+esc(typeof o==="string"?o:o.t)+'</p>';}).join("")+'</div>'; }
            if(info.length){ html+='<div class="rvw-info">'+info.map(function(x){return '<p class="small muted" style="margin:.25rem 0">'+x+'</p>';}).join("")+'</div>'; }
          }
          html+='<div class="flex" style="margin-top:.8rem;justify-content:space-between;gap:.5rem"><button class="btn btn-ghost btn-sm" id="rvw-again">🔄 Újra ellenőrzöm</button><button class="btn btn-primary btn-sm" data-close>Kész</button></div>';
          body.innerHTML=html; wire();
        });
      }
      function wire(){
        body.querySelectorAll("[data-rvw-jump]").forEach(function(b){ b.onclick=function(){ var a; try{a=JSON.parse(decodeURIComponent(b.dataset.rvwJump));}catch(e){return;}
          var t2=Store.getTour(t.id); if(!t2) return;
          if(a.g){ if(rvwAddGear(t2, a.g, new RegExp(a.rx||a.g,"i"))) toast(a.g+" bekerült a csomaglistába","🎒"); }
          else if(a.markwx){ t2.weatherChecked=true; Store.save(); toast("Időjárás ellenőrzöttnek jelölve","✔"); }
          else if(a.open==="kit"){ closeModal(); var el=document.getElementById("btn-ai"); if(el) el.click(); return; }
          else if(a.w){ closeModal(); wsTab=a.w; render(); return; }
          run(); }; });
        var ag=body.querySelector("#rvw-again"); if(ag) ag.onclick=function(){ run(); };
      }
    }});
}
window.tourReview = tourReview;
window.rvwWeatherFresh = rvwWeatherFresh;

/* V43 után: workspace-gomb + dashboard bővítés */
(function(){
  var _v44wa = VIEWS.workspace.after;
  VIEWS.workspace.after = function(root,id){ _v44wa&&_v44wa(root,id);
    try{ var act=root.querySelector(".ws-actions");
      if(act && !document.getElementById("btn-rvw")){
        var b=document.createElement("button"); b.className="btn btn-primary btn-sm"; b.id="btn-rvw"; b.innerHTML="🔍 Nézd át a túrámat";
        b.onclick=function(){ var t=Store.getTour(id); if(t) tourReview(t); };
        act.appendChild(b); } }catch(e){} };
  var _v44da = VIEWS.dash.after;
  VIEWS.dash.after = function(root){ _v44da&&_v44da(root);
    try{ var rb=root.querySelector("#dash-rdi"); var nx=Store.upcoming()[0];
      if(rb && nx){ var c=Store.tourCheck(nx);
        if(c.pct>=100){ rb.outerHTML='<button class="btn btn-soft btn-sm" id="dash-rvw">🎉 Készen áll</button>'; var e2=root.querySelector("#dash-rvw"); e2.onclick=function(){tourReview(nx)}; }
        else{ var hint=document.createElement("span"); hint.className="muted small"; hint.textContent=" A következő túrád ellenőrzésre vár."; rb.parentNode.insertBefore(hint, rb.nextSibling);
          var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="dash-rvw2"; b.innerHTML="🔍"; b.title="Nézd át a túrámat"; b.onclick=function(){tourReview(nx);}; rb.parentNode.insertBefore(b, hint.nextSibling); } } }catch(e){} };
})();
window.__V44MODULE = 1;
})();
/* ==== v45 ==== */
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

/* ==== v46 ==== */
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

/* ==== v47 ==== */
/* ============ V47 — 🗺️ GPX IMPORT + ÚTVONALKEZELÉS (a Trip Project részeként) ============ */
(function(){
"use strict";

/* ---------- segédek ---------- */
function n0(v){ return v==null?0:(+v||0); }
function escA(x){ return esc(x==null?"":String(x)); }
function haversine(a,b){ var R=6371000,p=Math.PI/180,dLat=(b[0]-a[0]),dLon=(b[1]-a[1]);
  var f=function(d){return d*p/2;}; var s=Math.sin(f(dLat))*Math.sin(f(dLat))+Math.cos(a[0]*p)*Math.cos(b[0]*p)*Math.sin(f(dLon))*Math.sin(f(dLon));
  return 2*R*Math.asin(Math.min(1,Math.sqrt(s))); }
function downsample(arr,max){ if(arr.length<=max) return arr.slice(); var out=[],i,step=arr.length/(max-1);
  for(i=0;i<max-1;i++) out.push(arr[Math.floor(i*step)]); out.push(arr[arr.length-1]); return out; }

/* ---------- GPX parser (valódi XML; nem talál ki adatot) ---------- */
function parseGPX(text){
  var doc; try{ doc=new DOMParser().parseFromString(String(text||""),"application/xml"); }catch(e){ return {err:"xml"}; }
  if(!doc||doc.getElementsByTagName("parsererror").length) return {err:"xml"};
  var all=[], wpts=[], name=null;
  var trk=doc.getElementsByTagName("trk");
  if(trk.length){ var nm=trk[0].getElementsByTagName("name"); if(nm.length&&nm[0].textContent) name=nm[0].textContent.trim().slice(0,80); }
  var meta=doc.getElementsByTagName("metadata"); if(!name&&meta.length){ var mn=meta[0].getElementsByTagName("name"); if(mn.length&&mn[0].textContent) name=mn[0].textContent.trim().slice(0,80); }
  var tp=doc.getElementsByTagName("trkpt");
  for(var i=0;i<tp.length;i++){
    var lat=parseFloat(tp[i].getAttribute("lat")), lng=parseFloat(tp[i].getAttribute("lon"));
    if(isNaN(lat)||isNaN(lng)) continue;
    var ele=[], tm=[];
    try{ ele=tp[i].getElementsByTagName("ele"); tm=tp[i].getElementsByTagName("time"); }catch(e){}
    var e=ele.length?parseFloat(ele[0].textContent):null; if(isNaN(e)) e=null;
    all.push([lat,lng,e, tm.length?String(tm[0].textContent||"").trim():null]);
  }
  var wp=doc.getElementsByTagName("wpt");
  for(var j=0;j<wp.length;j++){
    var wl=parseFloat(wp[j].getAttribute("lat")), wg=parseFloat(wp[j].getAttribute("lon"));
    if(isNaN(wl)||isNaN(wg)) continue;
    var wn=wp[j].getElementsByTagName("name"), we=wp[j].getElementsByTagName("ele");
    var wel=we.length?parseFloat(we[0].textContent):null; if(isNaN(wel)) wel=null;
    wpts.push({lat:wl,lng:wg,name:(wn.length?String(wn[0].textContent||"").trim().slice(0,60):"wp"+(j+1)),ele:wel});
  }
  if(!all.length&&wpts.length) return {err:"notrack",wpts:wpts,name:name};
  if(!all.length) return {err:"notrack",wpts:wpts,name:name};
  return {pts:all,wpts:wpts,name:name};
}

/* ---------- statisztikák a track pontokból ---------- */
function routeStats(pts){
  var i,dm=0; for(i=1;i<pts.length;i++) dm+=haversine([pts[i-1][0],pts[i-1][1]],[pts[i][0],pts[i][1]]);
  var els=[]; for(i=0;i<pts.length;i++) if(pts[i][2]!=null) els.push(pts[i][2]);
  var gain=0, loss=0;
  if(els.length>1){ var anchor=els[0], BAND=8;
    for(i=1;i<els.length;i++){ var dd=els[i]-anchor; if(Math.abs(dd)>=BAND){ if(dd>0)gain+=dd; else loss-=dd; anchor=els[i]; } } }
  var mn=els.length?Math.ceil(Math.min.apply(null,els)):null, mx=els.length?Math.floor(Math.max.apply(null,els)):null;
  return { n:pts.length, km:dm/1000, gain:Math.round(gain), loss:Math.round(loss),
    max:mx, min:mn, hasEle:els.length>1,
    start:{lat:pts[0][0],lng:pts[0][1]},
    finish:{lat:pts[pts.length-1][0],lng:pts[pts.length-1][1]} };
}
function fpOf(name,st,size){ return [String(name||"").trim().toLowerCase(), st.n,
  String(st.start.lat.toFixed(5)), String(st.start.lng.toFixed(5)),
  String(st.finish.lat.toFixed(5)), String(st.finish.lng.toFixed(5)), Math.round(size/4096)].join("|"); }

/* ---------- tárolás (d.routes, query-safe) ---------- */
function rAll(){ var d=Store.myData(); if(!d.routes) d.routes=[]; return d.routes; }
function rGet(id){ id=String(id); return rAll().find(function(x){ return x.id===id; }); }
function rFindFp(fp){ return rAll().find(function(x){ return x.fp===fp; }); }
function rSave(r){ var d=Store.myData(); if(!d.routes) d.routes=[]; r.updated_at=new Date().toISOString();
  var i=d.routes.findIndex(function(y){ return y.id===r.id; });
  if(i>-1) d.routes[i]=Object.assign(d.routes[i],r); else d.routes.unshift(r);
  try{ Store.save(); }catch(e){ var raw=r.raw; delete r.raw; try{ Store.save(); }catch(e2){ if(raw)r.raw=raw; toast("A könyvtár tele — törölj régi útvonalakat","🗺️"); return false; } }
  return true; }
function rDelete(id){ var d=Store.myData(); id=String(id);
  (d.tours||[]).forEach(function(t){ if(t.routeId===id){ t.routeId=null; } });
  d.routes=(d.routes||[]).filter(function(x){ return x.id!==id; }); Store.save(); }

/* ---------- formázás ---------- */
function fKm(x){ return (Math.round(x*10)/10).toFixed(1).replace(".", ",")+" km"; }
function fM(x){ return String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," "); }

/* ---------- térkép + profil ---------- */
function profileSVG(track){ var vals=[]; for(var i=0;i<track.length;i++) if(track[i][2]!=null) vals.push(track[i][2]);
  if(vals.length<3) return '<p class="small muted mt0 mb0">⛰️ Magassági profilhoz elevation kell — nem becsüljük meg.</p>';
  var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), W=560, H=110;
  var sm=downsample(vals,220), pts=sm.map(function(v,i){ var x=8+(i/(sm.length-1))*(W-16), y=H-((v-mn)/((mx-mn)||1))*(H-20)-8; return x.toFixed(1)+","+y.toFixed(1); }).join(" ");
  return '<div class="rt-prof"><svg viewBox="0 0 '+W+' '+(H+26)+'" style="width:100%;height:auto" role="img" aria-label="magassági profil">'+
    '<polygon points="'+pts+' '+(W-8)+','+(H+2)+' 8,'+(H+2)+'" fill="#E7F0E2"/>'+
    '<polyline points="'+pts+'" fill="none" stroke="#2F6B4A" stroke-width="2.5"/></svg>'+
    '<div class="small muted" style="display:flex;justify-content:space-between"><span>🟢 '+fM(mn)+' m</span><span>🔝 '+fM(mx)+' m</span><span>🏁</span></div></div>'; }
function mapInto(el, r){ try{ if(!el) return false; var map=(typeof MapKit!=="undefined"&&MapKit.make)?MapKit.make(el,{zoom:11}):null; if(!map) return false;
  var t=r.track||[]; if(!t.length) return false; var ll=t.map(function(p){return [p[0],p[1]];});
  if(typeof L!=="undefined"){ if(ll.length>1) L.polyline(ll,{color:"#2C6E9B",weight:4,opacity:.9}).addTo(map);
    L.circleMarker(ll[0],{radius:6,color:"#1C4A36",fillColor:"#2F6B4A",fillOpacity:1}).addTo(map).bindTooltip("🟢 Start");
    L.circleMarker(ll[ll.length-1],{radius:6,color:"#8C3B24",fillColor:"#B3372A",fillOpacity:1}).addTo(map).bindTooltip("🏁 Cél");
    (r.wpts||[]).slice(0,60).forEach(function(w){ L.circleMarker([w.lat,w.lng],{radius:4,fillOpacity:1,opacity:1,color:"#E07A2F"}).addTo(map).bindTooltip(w.name||""); }); }
  return true; }catch(e){ return false; } }

/* ---------- előnézet + mentés ---------- */
function previewModal(pr,ctx){ // pr={name,stats,wpts,raw,fp,file,sizePts,track}
  var st=pr.stats;
  var html='<div class="rt-pv">'+
    '<label class="f" for="rt-name">'+escA("Útvonal neve")+'</label><input class="input" id="rt-name" value="'+escA(pr.name||"Importált útvonal").slice(0,80)+'">'+
    '<div class="rt-stats">'+
    '<span class="rt-stat">📏 <b>'+fKm(st.km)+'</b></span>'+
    '<span class="rt-stat">⛰️ <b>'+(st.hasEle?"+"+fM(st.gain)+" m":"nincs elevation")+'</b></span>'+
    '<span class="rt-stat">⬇️ <b>'+(st.hasEle?"-"+fM(st.loss)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔝 <b>'+(st.hasEle?fM(st.max)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔻 <b>'+(st.hasEle?fM(st.min)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">📍 <b>'+st.n+' pont</b></span></div>'+
    '<p class="small muted mb0">🟢 Start: '+st.start.lat.toFixed(5)+", "+st.start.lng.toFixed(5)+' &middot; 🏁 Cél: '+st.finish.lat.toFixed(5)+", "+st.finish.lng.toFixed(5)+'</p>'+
    (pr.wpts&&pr.wpts.length?'<p class="small mb0">📌 Waypointok: '+pr.wpts.length+(pr.wpts[0].name?(' — '+escA(pr.wpts.slice(0,3).map(function(w){return w.name;}).filter(Boolean).join(', '))+(pr.wpts.length>3?'…':'')):'')+'</p>':"")+
    (st.hasEle?profileSVG(downsample(pr.track,800)):"")+
    '<div class="rt-map" id="rt-pv-map"></div>'+
    '<p class="small muted" style="margin:.3rem 0 0">🔒 Privátnak jelölt útvonal — csak nálad látszik.</p>'+
    '<div class="rt-btns">'+
      '<button class="btn btn-primary" id="rt-keep">'+escA("✓ Mentés az útvonalaim közé")+'</button>'+
      (ctx&&ctx.inboxId?'<button class="btn btn-soft" id="rt-to-inbox">📥 Inbox-elemhez</button>':"")+
      (ctx&&ctx.tripId?'<button class="btn btn-ember" id="rt-to-trip">🥾 A túrához adom</button>'
        :'<button class="btn btn-ember" id="rt-new-trip">🗓️ Új túrát készítek belőle</button>'+
         '<button class="btn btn-soft" id="rt-to-trip2">📥 Hozzáad meglévő túrához</button>')+
      '<button class="btn btn-ghost" data-close>🗑️ Elvetem</button>'+
    '</div></div>';
  openModal({ title:"🗺️ Útvonal előnézet", body:html, footer:"",
    onOpen:function(m){ var nm=m.querySelector("#rt-name");
      m.querySelector("#rt-keep").onclick=function(){ var r=commitRoute(pr,nm); if(r){ closeModal(); toast((r.name||"")+" a saját útvonalaid között (privát)","🗺️"); routesRefresh(); } };
      var ni=m.querySelector("#rt-to-inbox"); if(ni) ni.onclick=function(){ var r=commitRoute(pr,nm,true); if(!r) return; var it=(Store.myData().inbox||[]).find(function(x){return x.id===ctx.inboxId;});
        if(it){ it.routeId=r.id; it.read=true; Store.save(); } closeModal(); toast("GPX hozzáadva az Inbox-elemhez 🗺️","📥"); routesRefresh(); };
      var nb=m.querySelector("#rt-new-trip"); if(nb) nb.onclick=function(){ var r=commitRoute(pr,nm,true); if(!r) return; if(r.linkedTripId&&Store.getTour(r.linkedTripId)){ closeModal(); NAV.to("#/tura/"+r.linkedTripId); toast("Ehhez az útvonalhoz már van terved","🗓️"); return; }
        var name=(nm.value.trim()||r.name); var t=Store.newTourFromDraft({title:name, place:"", region:"", date:"", status:"tervezés",
          lengthKm:r.distance_km, ascent:r.elevation_gain_m, durationH:0, coords:(r.start&&r.start.lat)?{lat:r.start.lat,lng:r.start.lng}:null,
          desc:"Importált GPX: "+fKm(r.distance_km)+(r.elevation_gain_m?" · ⛰️ +"+r.elevation_gain_m+" m":""), notes:"Forrás: GPX import", tags:["gpx"] });
        t.routeId=r.id; t.descent=r.elevation_loss_m; Store.save(); r.linkedTripId=t.id; rSave(r);
        closeModal(); toast("Túraprojekt a GPX adataival","🗓️"); NAV.to("#/tura/"+t.id); routesRefresh(); };
      var at=m.querySelector("#rt-to-trip")||m.querySelector("#rt-to-trip2"); if(at) at.onclick=function(){ var tripId=ctx&&ctx.tripId;
        var go=function(tid){ var r=commitRoute(pr,nm,true); if(!r) return; attachToTrip(r,tid); };
        if(tripId) go(tripId); else routesPickTrip(go); };
      if(typeof MapKit!=="undefined") mapInto(m.querySelector("#rt-pv-map"), pr.routeForMap||{track:pr.track,wpts:pr.wpts}); } });
}
function commitRoute(pr, nmEl, attachMode){ var name=((nmEl&&nmEl.value)||pr.name||"Importált útvonal").trim().slice(0,80)||"Importált útvonal";
  var dup=rFindFp(pr.fp); if(dup){ if(attachMode){ toast("Ez az útvonal már megvan — azt kapcsoljuk hozzá","🗺️"); return dup; }
    toast("Ez az útvonal már szerepel a saját útvonalaid között","🗺️");
    setTimeout(function(){ window.__rtopen&&window.__rtopen(dup.id,true); },400); return null; }
  var track=downsample(pr.track,6000);
  var r={ id:Store.uid("rt"), name:name, source:"gpx-import", source_file:pr.file||null, fp:pr.fp,
    distance_km:Math.round(pr.stats.km*10)/10, elevation_gain_m:pr.stats.hasEle?pr.stats.gain:null, elevation_loss_m:pr.stats.hasEle?pr.stats.loss:null,
    max_elevation_m:pr.stats.hasEle?pr.stats.max:null, min_elevation_m:pr.stats.hasEle?pr.stats.min:null,
    start:{lat:pr.stats.start.lat,lng:pr.stats.start.lng}, finish:{lat:pr.stats.finish.lat,lng:pr.stats.finish.lng},
    track:track, nPts:pr.stats.n, wpts:(pr.wpts||[]).slice(0,120), raw:(pr.raw!=null&&pr.raw.length<700000)?pr.raw:null, created_at:new Date().toISOString() };
  if(!rSave(r)) return null; window.__rtopen&&window.__rtopen(r.id,true); return r; }
function attachToTrip(r, tripId){ var trip=Store.getTour(tripId); if(!trip) return; 
  var hasManual=(n0(trip.lengthKm)>0&&trip.lengthKm!==r.distance_km)||(n0(trip.ascent)>0&&trip.ascent!==r.elevation_gain_m);
  function apply(overwrite){ trip.routeId=r.id; r.linkedTripId=tripId;
    if(overwrite){ trip.lengthKm=r.distance_km; trip.ascent=r.elevation_gain_m||0; trip.descent=r.elevation_loss_m||0;
      if((!trip.coords||!trip.coords.lat)&&r.start&&r.start.lat) trip.coords={lat:r.start.lat,lng:r.start.lng}; trip.notes=(trip.notes?trip.notes+" · ":"")+"GPX: "+r.name; }
    rSave(r); Store.save(); closeModal(); toast("GPX a túraprojekthez kapcsolva — friss a readiness","🥾"); NAV.to("#/tura/"+tripId); }
  if(hasManual){ openModal({ title:"A GPX adataival frissítsük?", body:'<p class="muted mt0">Ehhez a túrához már van kézzel megadott táv vagy szint. A GPX: <b>'+fKm(r.distance_km)+' · ⛰️ +'+(r.elevation_gain_m||0)+' m</b>. Mit tartsunk?</p>',
    footer:'<button class="btn btn-ghost" id="rt-keep-manual">Megtartom a kézit</button> <button class="btn btn-primary" id="rt-overwrite">Frissítem a GPX-sel</button>',
    onOpen:function(m){ m.querySelector("#rt-overwrite").onclick=function(){ apply(true); }; m.querySelector("#rt-keep-manual").onclick=function(){ apply(false); }; } }); }
  else apply(true); }
function routesPickTrip(cb){ var list=(Store.myData().tours||[]); if(!list.length){ toast("Nincs még túraprojekted — hozzát létre egyet","🥾"); return; }
  openModal({ title:"🥾 Válassz túraprojektet", body:'<div class="rt-trips">'+list.map(function(t){ return '<button class="rt-trip" data-tid="'+t.id+'"><b>'+escA(t.title)+'</b><span>'+(t.date?escA(t.date):"")+(t.routeId?" · 🗺️":"")+"</span></button>"; }).join("")+"</div>",
    footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',
    onOpen:function(m){ m.querySelectorAll("[data-tid]").forEach(function(b){ b.onclick=function(){ closeModal(); cb(b.dataset.tid); }; }); } }); }

/* ---------- importáló ---------- */
function openImport(ctx){ ctx=ctx||{};
  openModal({ title:"🗺️ GPX import", body:
    '<div class="rt-drop" id="rt-drop"><b>📂 GPX fájl kiválasztása</b><br>Húzd ide a <code>.gpx</code> fájlt<br><label class="btn btn-primary btn-sm" style="margin-top:.7rem"><span>📁 Válassz fájlt</span><input type="file" name="f" accept=".gpx,text/xml,application/gpx+xml" hidden></label></div>'+
    '<p class="small muted mt0 mb0" id="rt-drop-msg">Valódi GPX-t dolgozunk fel — a hiányzó adatot nem találjuk ki. Az útvonal privát marad.</p>',
    footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',
    onOpen:function(m){ var drop=m.querySelector("#rt-drop"), inp=m.querySelector("#rt-drop input[type=file]"), msg=m.querySelector("#rt-drop-msg");
      function handle(file){ if(!file) return; var rd=new FileReader();
        rd.onload=function(){ var txt=String(rd.result||"");
          if(txt.length>3500000){ msg.innerHTML='<b style="color:#8C3B24">A GPX fájl túl nagy.</b>'; return; }
          var P=parseGPX(txt);
          if(P.err==="xml"){ msg.innerHTML='<b style="color:#8C3B24">A GPX fájl nem olvasható.</b>'; return; }
          if(P.err==="notrack"||!P.pts){ if(P.wpts&&P.wpts.length){ msg.innerHTML='A fájlban nincs track — waypoint-kezelés hamarosan. Ezzel nem tudunk útvonalat generálni.'; return; } msg.innerHTML='<b style="color:#8C3B24">Nem találtunk track pontot a fájlban.</b>'; return; }
          var st=routeStats(P.pts);
          var rFor={track:P.pts,wpts:P.wpts};
          var pr={ name:P.name||file.name.replace(/\.gpx$/i,"").slice(0,80), stats:st, wpts:P.wpts, track:P.pts, raw:txt, fp:fpOf(P.name||file.name,st,txt.length), file:file.name, routeForMap:rFor };
          if(st.n<2){ msg.innerHTML="Nem elég koordináta a távolság-kiszámításhoz."; return; }
          closeModal(); if(ctx.opened) return;
          setTimeout(function(){ previewModal(pr,ctx); },120); };
        rd.readAsText(file); }
      inp.onchange=function(){ handle(inp.files[0]); };
      ["dragover","dragleave","drop"].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); }); });
      drop.ondrop=function(e){ e.preventDefault(); if(e.dataTransfer&&e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }; } }); }

window.openGPXImport = openImport;

/* ---------- részletek (lap helyett modal) ---------- */
window.v47parseGPX=function(text){ var p=parseGPX(text); if(p&&p.err) return p; var st=routeStats(p.pts); return { name:p.name, track:p.pts, wpts:p.wpts, stats:st, raw:String(text||""), fp:null }; };
window.__rtopen=function(id, replace){ var r=rGet(id); if(!r) return;
  var trip=r.linkedTripId?Store.getTour(r.linkedTripId):null;
  openModal({ title:"🗺️ "+escA(r.name), body:
    '<div class="rt-stats">'+
    '<span class="rt-stat">📏 <b>'+fKm(n0(r.distance_km))+'</b></span>'+
    '<span class="rt-stat">⛰️ <b>'+(r.elevation_gain_m!=null?"+"+fM(r.elevation_gain_m)+" m":"nincs elevation")+'</b></span>'+
    '<span class="rt-stat">⬇️ <b>'+(r.elevation_loss_m!=null?"-"+fM(r.elevation_loss_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔝 <b>'+(r.max_elevation_m!=null?fM(r.max_elevation_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🔻 <b>'+(r.min_elevation_m!=null?fM(r.min_elevation_m)+" m":"—")+'</b></span>'+
    '<span class="rt-stat">🗓️ <b>'+new Date(r.created_at).toLocaleDateString("hu-HU")+'</b></span></div>'+
    (r.max_elevation_m!=null?profileSVG(r.track||[]):'<p class="small muted mb0">⛰️ Nincs elevációs adat</p>')+
    '<div class="rt-map" id="rt-map-'+ r.id +'"></div>'+
    (trip?'<p class="small mb0">🥾 Kapcsolódó túra: <a href="#/tura/'+trip.id+'">'+escA(trip.title)+"</a></p>":'<p class="small muted mb0">🥾 Nincs túrához kapcsolva</p>')+
    (r.wpts&&r.wpts.length?'<p class="small muted mb0">📌 Waypointok ('+r.wpts.length+'): '+r.wpts.slice(0,6).map(function(w){return escA(w.name);}).join(", ")+"</p>":"")+
    '<div class="rt-btns">'+
      (trip?'<a class="btn btn-ember" href="#/tura/'+trip.id+'">🥾 Túra megnyitása</a>':'<button class="btn btn-ember" id="rt-link">🥾 Túrához adom</button> <button class="btn btn-soft" id="rt-mktrip">🗓️ Túra belőle</button>')+
      '<button class="btn btn-soft" id="rt-export">⬇️ GPX export</button>'+
      '<button class="btn btn-ghost" id="rt-rename">✏️ Áthívtás</button>'+
      '<button class="btn btn-ghost" id="rt-del">🗑️</button>'+
    '</div>', footer:'<button class="btn btn-primary btn-block" data-close>Kész</button>',
    onOpen:function(m){ mapInto(m.querySelector(".rt-map"),r);
      m.querySelector("#rt-export").onclick=function(){ exportRoute(r); };
      m.querySelector("#rt-rename").onclick=function(){ var v=prompt("Új név:",r.name); if(v){ r.name=String(v).slice(0,80); rSave(r); toast("Áthívva a néven","✏️"); closeModal(); routesRefresh(); } };
      m.querySelector("#rt-del").onclick=function(){ confirmDlg("Biztosan törölöd az útvonalat?"+(trip?" Az ehhez kapcsolt túra (\""+trip.title+"\") MEGMARAD.":""),"Törlés",function(){ rDelete(r.id); closeModal(); toast("Útvonal törölve — a túra megmaradt","🗑"); routesRefresh(); }); };
      var lk=m.querySelector("#rt-link"); if(lk) lk.onclick=function(){ routesPickTrip(function(tid){ var rr=rGet(r.id); if(rr){ rr.linkedTripId=tid; attachToTrip(rr,tid); } }); };
      var mk=m.querySelector("#rt-mktrip"); if(mk) mk.onclick=function(){ var rr=rGet(r.id); if(!rr) return;
        if(rr.linkedTripId&&Store.getTour(rr.linkedTripId)){ closeModal(); toast("van már kapcsolódó túra","🗓️"); NAV.to("#/tura/"+rr.linkedTripId); return; }
        var t=Store.newTourFromDraft({title:rr.name, place:"", date:"", status:"tervezés", lengthKm:rr.distance_km, ascent:rr.elevation_gain_m||0,
          coords:(rr.start&&rr.start.lat)?{lat:rr.start.lat,lng:rr.start.lng}:null, desc:"GPX import: "+rr.name, notes:"Forrás: GPX import", tags:["gpx"] });
        t.routeId=rr.id; t.descent=rr.elevation_loss_m||0; Store.save(); rr.linkedTripId=t.id; rSave(rr); closeModal(); toast("Túra létrehozva a GPX-adataival","🗓️"); NAV.to("#/tura/"+t.id); routesRefresh(); }; } }); };

/* ---------- export ---------- */
function gpxFromRoute(r){
  var pts=r.track||[];
  var seg=""; for(var i=0;i<pts.length;i++){ var p=pts[i];
    seg+="      <trkpt lat=\""+p[0]+"\" lon=\""+p[1]+"\">"+(p[2]!=null?"<ele>"+p[2]+"</ele>":"")+(p[3]?"<time>"+p[3]+"</time>":"")+"</trkpt>\n"; }
  return"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx version=\"1.1\" creator=\"Turatars\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n  <metadata><name>"+escA(r.name)+"</name></metadata>\n"+
    "<trk><name>"+escA(r.name)+"</name><trkseg>\n"+seg+"</trkseg></trk>\n</gpx>\n"; }
function exportRoute(r){ var txt=r.raw||gpxFromRoute(r); var a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([txt],{type:"application/gpx+xml"})); a.download=String(r.name||"utvonal").replace(/[^\w-]+/g,"_").slice(0,40)+".gpx";
  document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },600); toast(r.raw?"Eredeti GPX letöltve — az adat nem változott":"A mentett trackből regenerált GPX","⬇️"); }

window.rtFmt={fKm:fKm,fM:fM,get:rGet};
window.__V47 = 1;
})();

/* ==== v47b ==== */
/* ============ V47b — 🗺️ routes page + hook integrations (workspace, inbox, review, túra mód) ============ */
(function(){
"use strict";
function n0(v){ return v==null?0:(+v||0); }
function fKm(x){ return (Math.round(n0(x)*10)/10).toFixed(1).replace(".",",")+" km"; }
function rAll(){ var d=Store.myData(); if(!d.routes) d.routes=[]; return d.routes; }
function rGet(id){ id=String(id); return rAll().find(function(x){ return x.id===id; }); }
function escA(x){ return esc(x==null?"":String(x)); }
function routesRefresh(){ return rtRefresh(); }
window.routesRefresh=routesRefresh;
function rtRefresh(){ if(String(location.hash||"").indexOf("#/utvonalak")===0){ if(window.render) render(); else if(typeof App!=="undefined") App.render(); } }
window.rtRefresh=rtRefresh;

/* ---------- 🗺️ Saját útvonalaim oldal ---------- */
VIEWS.routes = function(){ var R=rAll();
  return dash("#/utvonalak")('<div class="dash-top"><div><h1>🗺️ Saját útvonalaim</h1>'+
    '<p class="small muted" style="margin:.15rem 0 0">Valódi GPX fájlok — távolság, szint és profil a tényleges track pontokból. Mindegyik privát.</p></div>'+
    '<button class="btn btn-primary" id="rt-import">🗺️ GPX import</button></div>'+
    (R.length? '<div class="rt-cards">'+R.map(function(r){ var trip=r.linkedTripId?Store.getTour(r.linkedTripId):null;
      return '<article class="card rt-card" data-rt="'+r.id+'">'+
        '<div class="rt-ic">🗺️</div><div class="rt-main"><b>'+escA(r.name)+'</b>'+
        '<div class="small muted">'+fKm(r.distance_km)+' · ⛰️ +'+fM0(r.elevation_gain_m)+' m'+(trip?' · 🥾 '+escA(trip.title):'')+' · 📥 '+new Date(r.created_at).toLocaleDateString("hu-HU")+'</div>'+
        '<div class="rt-row"><button class="btn btn-soft btn-sm" data-open="'+r.id+'">Megnyitás</button>'+
        (trip?'<a class="btn btn-ember btn-sm" href="#/tura/'+trip.id+'">🥾 Túra</a>':'')+'<span class="spacer"></span><button class="btn btn-ghost btn-sm" data-exp="'+r.id+'">⬇️</button><button class="btn btn-ghost btn-sm" data-del="'+r.id+'">🗑</button></div>'+
        '</div></article>'; }).join("")+'</div>'
      : '<div class="empty"><span class="em-ico">🗺️</span><h3>Még nincs importált útvonalad</h3>'+
        '<p>Húzz be egy .gpx fájlt — a távolságot, szinteket és profilt a valódi track pontokból számoljuk, semmit nem találunk ki.</p>'+
        '<button class="btn btn-primary" id="rt-import-empty">🗺️ GPX import most</button></div>')+
    '</div>'); };
function fM0(x){ return x==null?"0":String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," "); }
VIEWS.routes.after = function(root){ var R=rAll();
  var b=root.querySelector("#rt-import")||root.querySelector("#rt-import-empty");
  if(b) b.onclick=function(){ window.openGPXImport({}); };
  root.querySelectorAll("[data-open]").forEach(function(x){ x.onclick=function(){ window.__rtopen(x.dataset.open); }; });
  root.querySelectorAll("[data-exp]").forEach(function(x){ x.onclick=function(){ var r=rGet(x.dataset.exp); if(r) window.__rtexport&&window.__rtexport(r);
    else { var rr=rGet(x.dataset.exp); /* fallback */ } }; });
  root.querySelectorAll("[data-del]").forEach(function(x){ x.onclick=function(){ var r=rGet(x.dataset.del); if(!r) return;
    var t=r.linkedTripId?Store.getTour(r.linkedTripId):null;
    confirmDlg("Biztosan törlöd: "+r.name+"?"+(t?" A(t) \""+t.title+"\" túra MEGMARAD.":""),"Törlés",function(){
      var d=Store.myData(); d.routes=(d.routes||[]).filter(function(y){return y.id!==r.id;});
      (d.tours||[]).forEach(function(tt){ if(tt.routeId===r.id){ tt.routeId=null; } });
      Store.save(); toast("Útvonal törölve — a túra érintetlen","🗑"); rtRefresh(); }); }; });
  root.querySelectorAll("[data-rt]").forEach(function(c){ c.onclick=function(e){ if(e.target.closest("button,a")) return; window.__rtopen(c.dataset.rt); }; }); };

/* export reachable (v47 belső exportRoute helyett újrahasznosítunk) */
window.__rtexport=function(r){ var pts=r.track||[], seg="", i;
  for(i=0;i<pts.length;i++){ var p=pts[i]; seg+='      <trkpt lat="'+p[0]+'" lon="'+p[1]+'">'+(p[2]!=null?"<ele>"+p[2]+"</ele>":"")+(p[3]?"<time>"+p[3]+"</time>":"")+"</trkpt>\n"; }
  var txt=r.raw||("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<gpx version=\"1.1\" creator=\"Turatars\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n  <metadata><name>"+escA(r.name)+"</name></metadata>\n<trk><name>"+escA(r.name)+"</name><trkseg>\n"+seg+"</trkseg></trk>\n</gpx>");
  var a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([txt],{type:"application/gpx+xml"}));
  a.download=String(r.name||"utvonal").replace(/[^\w]+/g,"_").slice(0,40)+".gpx"; document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },700);
  toast(r.raw?"Eredeti GPX letöltve (az adat változatlan)":"Letöltve a mentett trackből","⬇️"); };

/* ---------- workspace Útvonal fül: GPX kártya / import gomb ---------- */
var _wA47 = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ try{ _wA47 && _wA47(root,id); }catch(e){}
  var t=Store.getTour(id); if(!t||!root) return;
  try{
    var rvw=root.querySelector("#btn-rvw"); if(rvw) rvw.onclick=function(){ try{ (window.tourReview||tourReview)(t); }catch(e){} };
    var gp=root.querySelector("#btn-wx"); if(gp && t.routeId && !gp.__rt){ /* időjárás marad */ }
    var grid=root.querySelector(".ws-grid")||root.querySelector("#view .ws-grid")||null;
    if(String(wsTab)!=="utvonal") return;
    var act=root.querySelector(".ws-actions");
    if(t.routeId && act && !root.querySelector("#rt-ws-open")){ var r=rGet(t.routeId);
      if(r){ var bo=document.createElement("button"); bo.className="btn btn-soft btn-sm"; bo.id="rt-ws-open";
        bo.innerHTML="🗺️ Részletek"; bo.onclick=function(){ window.__rtopen(r.id); }; act.appendChild(bo); } }
    if(!t.routeId && act && !root.querySelector("#rt-ws-import")){ var bi=document.createElement("button"); bi.className="btn btn-soft btn-sm";
      bi.id="rt-ws-import"; bi.innerHTML="🗺️ GPX import"; bi.onclick=function(){ window.openGPXImport({tripId:id}); }; act.appendChild(bi); }
    /* ha van route: a ⬇️ GPX export gombot útvonal-exportra váltjuk */
    var gb=root.querySelector("#btn-gpx");
    if(gb && t.routeId){ var rr=rGet(t.routeId); if(rr) gb.onclick=function(){ window.__rtexport(rr); }; }
    /* route státusz-sáv a fül végére */
    if(t.routeId && grid && !root.querySelector(".rt-tripcard")){ var r2=rGet(t.routeId);
      if(r2){ var div=document.createElement("div"); div.className="card panel rt-tripcard";
        div.innerHTML='<h3>🗺️ GPX útvonal: '+escA(r2.name)+'</h3><p class="small mb0">'+fKm(r2.distance_km)+' · ⛰️ +'+fM0(r2.elevation_gain_m)+' m · ⬇️ -'+fM0(r2.elevation_loss_m)+' m · '+((r2.track||[]).length)+' pont (tömörítve) / '+(r2.nPts||0)+' eredeti</p>'+
        '<button class="btn btn-soft btn-sm" data-rtx="re">🔄 Új GPX cseréje</button> <button class="btn btn-ghost btn-sm" data-rtx="un">🔗 Leválasztás</button>';
        grid.appendChild(div);
        div.querySelectorAll("[data-rtx]").forEach(function(bb){ bb.onclick=function(){ var a=bb.dataset.rtx;
          if(a==="re"){ window.openGPXImport({tripId:id,replace:t.routeId}); }
          else { t.routeId=null; var r3=rGet(t.routeId); if(r3){ r3.linkedTripId=null; } Store.save(); toast("Az útvonal leválasztva — a GPX megmaradt a könyvtárban","🔗"); rtRefresh(); render(); } }; }); } }
    /* V45: túra-mód Útvonal gomb → route részletek */
  }catch(e){} };

/* ---------- V44 review: GPX kontextus sor ---------- */
var _rv47=window.tourReview;
window.tourReview=function(t){ try{ _rv47&&_rv47(t); var r=t.routeId?rGet(t.routeId):null; if(!r) return;
  var tries=0, iv=setInterval(function(){ tries++; var b=document.getElementById("rvw-body");
    if(b && b.querySelector(".rvw-head")){ clearInterval(iv); if(b.querySelector(".rvw-gpx")) return; b.insertAdjacentHTML("afterbegin",
      '<div class="rvw-gpx small" style="margin:.2rem 0 .55rem">🗺️ GPX: ez egy '+fKm(r.distance_km)+(r.elevation_gain_m?'-es, +'+fM0(r.elevation_gain_m)+' m szintemelkedés':'')+' útvonal ('+(r.nPts||0)+' pont) — az számítások ezt használják.</div>'); }
    if(tries>60) clearInterval(iv); },120); }catch(e){} };

/* ---------- V45 túra mód: Útvonal gomb GPX-re ---------- */
var _tmA47 = VIEWS.tourmode.after;
VIEWS.tourmode.after = function(root,id){ try{ _tmA47&&_tmA47(root,id); }catch(e){}
  try{ var t=(id||((location.hash.match(/turamod\/([\w-]+)/)||[])[1]))&&Store.getTour(id||location.hash.match(/turamod\/([\w-]+)/)[1]); if(!t||!t.routeId||!root) return;
    var r=rGet(t.routeId); if(!r) return;
    var b=root.querySelector('[data-tm2="utvonal"]'); if(b && !b.__rt47){ b.__rt47=1; b.onclick=function(){ window.__rtopen(r.id); }; } }catch(e){} };

window.__V47B=1; })();

/* ==== v48 ==== */
/* ===== V48 — 🧠 VEZETŐ TERV („Hogy áll a túrám?”) — READ-ONLY összefoglaló =====
   Nem tervez újra: a Store.readiness/tourCheck, V47 route, V44 weather, packing/food/
   companions/transport/tasks meglévő adatait olvassa. Intézem = navigáció csak. */
(function(){
"use strict";
function X(s){ return esc(s==null?"":String(s)); }
function n0(v){ return v==null?0:(+v||0); }
function fKm(x){ return (Math.round(n0(x)*10)/10).toFixed(1).replace('.',',')+" km"; }
function fM(x){ x=Math.round(n0(x)); return String(x).replace(/\B(?=(\d{3})+(?!\d))/g," "); }
function hhmm(h){ h=n0(h); if(!h) return null; var H=Math.floor(h); return {h:H, p:Math.round((h-H)*60)}; }
function routeOf(t){ try{ var fr=window.rtFmt; return (fr && t.routeId) ? fr.get(String(t.routeId)) : null; }catch(e){ return null; } }

function ckDomains(t, wxLive){
  var rows=[]; var H=n0(t.durationH), P=(t.participants||[]).length, G=t.gear||[], F=t.food||[];
  function lite(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
  var wKg=F.filter(function(f){return /viz|iv(?:o|0)/.test(lite(f.n));}).reduce(function(a,f){return a+(+f.w||0);},0)/1000;
  var d, r=routeOf(t); // ——— GYORS ÁTTEKINTÉS sorrend a spec §5 szerint
  d={k:"utvonal", ic:"🗺️", nm:"Útvonal"};
  if(r){ d.s="ok"; d.line="✓ GPX betöltve · "+fKm(r.distance_km)+(r.elevation_gain_m!=null?" · ⛰️ +"+fM(r.elevation_gain_m)+" m":"")+" · "+(r.nPts||0)+" pont"; }
  else if(t.coords||t.gpx||(t.waypoints||[]).length){ d.s="ok"; d.line="✓ Útvonal megvan (koordináták)"; d.tip="GPX importálása pontosíthatja"; d.goto="utvonal"; d.act="🗺️ GPX importálása"; }
  else { d.s="info"; d.line="ℹ️ Nincs GPX útvonal"; d.act="🗺️ GPX importálása"; d.goto="utvonal"; }
  rows.push(d);
  d={k:"felsz", ic:"🎒", nm:"Felszerelés"};
  if(!G.length){ d.s="bad"; d.line="🔴 Nincs packolási lista"; d.act="🎒 Intézem"; d.goto="felszereles"; }
  else { var packed=G.filter(function(g){return g.checked;});
    if(packed.length===G.length){ d.s="ok"; d.line="✓ "+packed.length+" / "+G.length+" bepakolva"; }
    else { d.s="warn"; d.line="🟠 "+packed.length+" / "+G.length+" bepakolva — "+(G.length-packed.length)+" nincs bejelölve";
      d.miss=G.filter(function(g){return !g.checked;}).slice(0,3).map(function(g){return g.name;});
      d.act="🎒 Intézem"; d.goto="felszereles"; } }
  rows.push(d);
  d={k:"viz", ic:"💧", nm:"Víz"};
  if(!F.length){ d.s="info"; d.line="ℹ️ Nincs megadva vízmennyiség"; d.act="💧 Megnézem"; d.goto="ete"; }
  else if(H>=3 && wKg < (H/2)*Math.max(1,P)*0.75){ d.s="warn"; d.line="🟠 "+wKg.toFixed(1).replace(".",",")+" kg tervezett — az időtartamhoz képest kevésnek tűnik"; d.act="💧 Megnézem"; d.goto="ete"; }
  else { d.s="ok"; d.line="✓ "+wKg.toFixed(1).replace(".",",")+" kg víz tervezve"; }
  rows.push(d);
  d={k:"etel", ic:"🍽️", nm:"Étel"};
  var meals=F.filter(function(f){return !/viz|iv(?:o|0)/.test(lite(f.n));});
  if(meals.length){ d.s="ok"; d.line="✓ "+meals.length+" étel tervben"; } else { d.s="info"; d.line="ℹ️ Nincs ételterv"; d.act="🍽️ Megnézem"; d.goto="ete"; }
  rows.push(d);
  d={k:"tars", ic:"👥", nm:"Társak"}; if(!P){ d.s="ok"; d.line="✓ Egyéni túra"; }
  else { var jo=t.participants.filter(function(p){return p.confirmed||p.stat==="jön";}).length;
    var no=t.participants.filter(function(p){return p.stat==="nem";}).length;
    var varr=P-jo-no;
    if(varr>0){ d.s="warn"; d.line="👥 "+P+" résztvevő · ✓ "+jo+" jön"+(varr?" · 🟠 "+varr+" nem válaszolt":"")+(no?" · ✕ "+no+" nem jön":""); d.act="👥 Intézem"; d.goto="resztvevok"; }
    else if(no>0){ d.s="warn"; d.line="👥 "+jo+" jön · "+no+" nem jön — ültetés/étel áttervezendő"; d.act="👥 Intézem"; d.goto="resztvevok"; }
    else { d.s="ok"; d.line="✓ Minden résztvevő visszaigazolta ("+jo+")"; } }
  rows.push(d);
  d={k:" kozleked".trim(), ic:"🚗", nm:"Közlekedés"};
  var meet=!!(t.meeting||t.startPoint||t.meetingTime||t.travelMode), car=(t.cars||[]).length>0;
  if(!meet&&!car){ d.s="bad"; d.line="🔴 Közlekedés nincs megtervezve"; d.act="🚗 Intézem"; d.goto="utazas"; }
  else if(meet!=car || !t.meeting || !t.arrival || (t.cars||[]).some(function(c){return !(c.assigned||[]).length;}) && P>0){ d.s="warn"; d.line="🟠 Részben tervezve — ellenőrizd a részleteket"; d.act="🚗 Intézem"; d.goto="utazas"; }
  else { d.s="ok"; d.line="✓ Közlekedés rendezve" + (P? " ("+(t.cars||[]).reduce(function(a,c){return a+(c.seats||0);},0)+" ülőhely)":""); }
  rows.push(d);
  d={k:"teendo", ic:"☑️", nm:"Teendők"}; var tk=(t.tasks||[]).filter(function(x){return !x.done;});
  if(!(t.tasks||[]).length){ d.s="info"; d.line="ℹ️ Nincs feladat rögzítve"; d.goto="teendok"; }
  else if(tk.length){ d.s="warn"; d.line="🟠 "+tk.length+" nyitott feladat"; d.miss=tk.slice(0,3).map(function(x){ return (x.who? x.who+" — ":"")+x.label; }); d.act="☑️ Intézem"; d.goto="teendok"; }
  else { d.s="ok"; d.line="✓ minden feladat kész ("+t.tasks.length+")"; }
  rows.push(d);
  d={k:"idojaras", ic:"🌦️", nm:"Időjárás"};
  if(t.weatherChecked && (wxLive||t.weather)){ var w=wxLive||t.weather; d.s="ok"; d.line="✓ "+(w.ico||"")+" "+String(w.tmin!=null?w.tmin+"–":""), (w.tempMax!=null?w.tempMax:"—")+"°"+(w.rain!=null?" · eső "+w.rain+"%":"")+(w.nowTemp!=null?" · most "+w.nowTemp+"°":""); d.line="✓ Időjárás ellenőrizve"+(w.rain!=null?" (eső "+w.rain+"%, "+(w.tmin!=null?w.tmin+"–"+w.tmax:"—")+"°)":""); }
  else if(wxLive){ d.s="warn"; d.line="🟠 "+(wxLive.ico||"🌦️")+" megvan az előrejelzés — jelöld ellenőrzöttnek a lap tetején"; d.goto="utvonal"; }
  else if(!t.weather){ d.s="info"; d.line="ℹ️ Nincs elérhető előrejelzés"; d.goto="utvonal"; }
  else { d.s="warn"; d.line="🟠 Időjárás van az adatbázisban, de nincs jóváhagyva"; d.act="🛏 Megnyitom"; d.goto="utvonal"; }
  rows.push(d);
  return rows;
}
function ckOverall(rows){ var bad=rows.filter(function(x){return x.s==="bad";}); var warn=rows.filter(function(x){return x.s==="warn";});
  if(bad.length) return {k:"bad", t:"🔴 TERVEZÉSI PROBLÉMA", sub:"Ezek nélkül a terv nem mehet tovább:"};
  if(warn.length) return {k:"warn", t:"🟠 FIGYELMET IGÉNYEL", sub:"A jelenlegi adatok alapján több pont is rendezendő."};
  return {k:"ok", t:"🟢 JÓL TERVEZHETŐ", sub:"A jelenlegi terv alapján nem találtunk fontos hiányosságot."}; }
function ckProblems(rows){ var p=[];
  rows.forEach(function(d){ if(d.s==="bad"||d.s==="warn") p.push(d); if(d.s==="ok"||d.s==="warn"||d.s==="bad"){} });
  // a weather-extra: ha van esőjelzés a packolásban... (v44 weather adatai már benne vannak az idomainben)
  return p.slice(0,5); }
function ckHead(t){ var r=Store.readiness(t), c;
  var head=["<div class=\"ck-top\"><div class=\"ck-pct\"><b>"+r.pct+"%</b><span>készültség (ugyanaz, mint a dashboard)</span></div><div class=\"ck-meta\">"];
  c=[]; if(n0(t.lengthKm)) c.push("📏 "+fKm(t.lengthKm));
  if(n0(t.ascent)) c.push("⛰️ +"+fM(t.ascent)+" m");
  var hm=hhmm(t.durationH); if(hm) c.push("🕐 "+hm.h+"ó"+(hm.p?" "+hm.p+"p":""));
  if(t.date) c.push("📅 "+X(t.date));
  head.push(c.length?("<span>"+c.join("</span><span>")+"</span>"):"<span class=\"muted\">—</span>");
  head.push("</div></div>");
  return head.join(""); }
function ckHTML(t, rows, overall, isGreen, wxHint){
  var o=[]; o.push("<div class=\"ck-wrap\">");
  o.push("<p class=\"small muted\" style=\"margin:0 0 .5rem\">A jelenlegi túraterved alapján — <b>"+X(t.title||"")+"</b></p>");
  o.push(ckHead(t));
  o.push("<div class=\"ck-main "+overall.k+"\">"+overall.t+(overall.k==="ok"?"<p class=\"small mb0\" style=\"margin:.2rem 0 0\">"+overall.sub+"</p>":"")+"</div>");
  var probs=ckProblems(rows);
  if(isGreen)
    o.push("<div class=\"ck-next green\"><b>🎯 Következő lépés</b><p class=\"mb0\" style=\"margin:.15rem 0 0\">Nincs fontos teendő — a terv vezetési szempontból kész. <span class=\"small muted\">(A ✓ jelölés csak azt fedi le, amit mi is ellenőriztünk a te adataid alapján.)</span></p></div>");
  else { var n=probs[0];
    o.push("<div class=\"ck-next\"><b>🎯 Következő lépés</b><p class=\"ck-next-l\" style=\"margin:.15rem 0 .35rem\">\""+X((n.line||"").replace(/^[✓🟠🔴ℹ️]\s*/,""))+"\"</p>"+
    (n.act?("<button class=\"btn btn-primary btn-sm\" data-ckgoto=\""+n.goto+"\" data-ckact=\""+(n.k==="utvonal"&&n.act&&n.act.indexOf("GPX")>-1?"gpx":"nav")+"\">"+X(n.act)+"</button>"):"")+
    "<span class=\"small muted\" style=\"margin-left:.5rem\">"+(probs.length>1?("további "+(probs.length-1)+" figyelendő"):"")+"</span></div>"); }
    o.push("<details class=\"ck-det\""+(overall.k==="ok"?"":" open")+"><summary><b>Túra állapota — gyors áttekintés</b></summary>"+
    "<div class=\"ck-list\">"+rows.map(function(d){
      var s={ok:"✓",warn:"🟠",bad:"🔴",info:"ℹ️"}[d.s];
      return "<div class=\"ck-row\">"+d.ic+" <b>"+d.nm+"</b> <span class=\"ck-st st-"+d.s+"\">"+s+"</span><span class=\"ck-line\">"+d.line+"</span>"+
        (d.goto && d.s!=="ok" ? "<button class=\"btn btn-ghost btn-sm\" data-ckgoto=\""+d.goto+"\" data-ckact=\""+(d.k==="utvonal"&&d.act&&d.act.indexOf("GPX")>-1?"gpx":"nav")+"\">"+(d.act||"Megnyitom")+"</button>" : (d.act&&d.s==="ok"?"":"")) +
        (d.miss&&d.miss.length?"<div class=\"ck-miss\">"+d.miss.map(X).join(" · ")+"</div>":"")+"</div>"; }).join("")+
    "</div></details>");
  if(probs.length>1) o.push("<div class=\"ck-probs\"><b>Figyelendő pontok</b>"+probs.slice(1).map(function(d){
    return "<div class=\"ck-prow "+(d.s==="bad"?"bad":"warn")+"\"><span>"+d.ic+"</span>"+X(d.line)+(d.goto?"<button class=\"btn btn-ghost btn-sm\" data-ckgoto=\""+d.goto+"\">Intézem</button>":"")+"</div>"; }).join("")+"</div>");
  o.push("<div class=\"ck-foot\"><button class=\"btn btn-soft\" id=\"ck-re\">🔄 Újraelemzem</button>"+
    (isGreen?"<a class=\"btn btn-primary\" id=\"ck-go\" href=\"#/turamod/"+ t.id +"\">🥾 Indulok</a>":"<button class=\"btn btn-ember\" id=\"ck-fix\" data-ckgoto=\""+(probs[0]&&probs[0].goto||"attekintes")+"\">🛠️ Terv javítása</button>")+
    "</div></div>");
  return o.join(""); }

async function openCockpit(t, forceLive){
  if(!t) return;
  var wxLive=null;
  if(!t.weatherChecked && (!t.weather || t.weather.at && Date.now()-new Date(t.weather.at) > 3*3600e3)) {
    try{ if(window.rvwWeatherFresh){ var w=await window.rvwWeatherFresh(t); if(w && w!=="NOLONG") wxLive=w; } }catch(e){}
  } else if(t.weather) wxLive=t.weather;
  function paint(){
    var rows=ckDomains(t, wxLive);
    var overall=ckOverall(rows); var isGreen=overall.k==="ok";
    try{ openModal({ title:"🧠 Hogy áll a túrám?",
      body:ckHTML(t, rows, overall, isGreen, wxLive), footer:"",
      onOpen:function(m){
        m.querySelectorAll("[data-ckgoto]").forEach(function(b){ b.onclick=function(e){
          var a=b.getAttribute("data-ckact");
          if(a==="gpx"){ closeModal(); try{ window.openGPXImport({tripId:t.id}); }catch(err){} return; }
          // navigáció a MEGLÉVŐ modulhoz
          var tab=b.dataset.ckgoto;
          try{ if(tab==="utvonal"||tab==="idoter"){ wsTab=tab; } else { wsTab=tab; } }catch(err){}
          closeModal(); NAV.to("#/tura/"+t.id); }; });
        var re=m.querySelector("#ck-re"); if(re) re.onclick=function(){ openCockpit(t, true); };
      }}); }catch(e){ }
  } paint();
  }
window.openCockpit=openCockpit;

/* ---------- gombok: workspace fejléc + dashboard ---------- */
var _ckWa = VIEWS.workspace.after;
VIEWS.workspace.after = function(root,id){ try{ _ckWa && _ckWa(root,id); }catch(e){}
  try{ var t=Store.getTour(id); if(!t||!root) return;
    var act=root.querySelector(".ws-actions");
    if(act && !root.querySelector("#btn-cockpit")){ var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="btn-cockpit";
      b.innerHTML="🧠 Hogy áll a túrám?"; b.onclick=function(){ openCockpit(t); }; act.appendChild(b); } }catch(e){} };
var _ckDa = VIEWS.dash.after;
VIEWS.dash.after = function(root){ try{ _ckDa && _ckDa(root); }catch(e){}
  try{ if(!root) return; var nx=(typeof Store!=="undefined"&&Store.upcoming)?Store.upcoming()[0]:null;
    if(!nx) return; var sec=root.querySelector('[data-w="readi"]'); if(!sec||sec.querySelector("#dash-ck")) return;
    var b=document.createElement("button"); b.className="btn btn-soft btn-sm"; b.id="dash-ck"; b.textContent="🧠 Áttekintem";
    b.style.marginLeft=".45rem"; b.onclick=function(){ openCockpit(nx); };
    var anchor=sec.querySelector("#dash-rvw2")||sec.querySelector("#dash-rvw")||sec.querySelector("#dash-rdi")||sec.querySelector("#dash-rdi2"); if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(b, anchor.nextSibling); }catch(e){} };
window.__V48=1;
})();

/* ==== v49 ==== */
/* ============ V49 — 🗺️ TÚRAFELFEDEZŐ + TÚRAESEMÉNY-GYŰJTŐ ============
   A meglévő valós katalógusra (TOURS/EVENTS) épülő appnézet a #/felfedezes útvonalon.
   CTA: 🗓️ Tervet készítek → newTourFromDraft + extRef dedup | ❤️ → wishlist ref
   | esemény→projekt eventRef-fel | route: V47 | DEMO utak jelölve. SEMMI kitalált külső adat. */
(function(){
"use strict";
var f9={ tab:"tours", q:"", region:"", diff:"", dist:"", elev:"", sort:"", weekend:false, csucs:false, loc:null, locMsg:"" };
function nz(v,k){ return (v===null||v===undefined||v==="")?(k||"—"):v; }
function esc9(x){ return esc(x==null?"":String(x)); }
function refOf(kind,id){ return "f9:"+kind+":"+id; }
function CAT_T(){ return window.v122PublicTours?window.v122PublicTours():((typeof TOURS!=="undefined")?TOURS:[]); }
function CAT_E(){ var base=window.v122PublicEvents?window.v122PublicEvents():((typeof EVENTS!=="undefined")?EVENTS:[]); try{ var pending=window.v124PendingEvents?window.v124PendingEvents():[]; var ex=(window.e2Events?window.e2Events():[]).filter(function(e){return !e.demo;}); var all=base.concat(pending||[],ex||[]), seen={}; return all.filter(function(e){var k=String(e.id||""); if(!k||seen[k]) return false; seen[k]=1; return true;}); }catch(e){ return base; } }
function hasWish(ref){ var d=Store.myData(); return (d.wishlist||[]).some(function(w){return w.ref===ref;}); }
function tourByRef(ref){ var d=Store.myData(); return (d.tours||[]).find(function(t){return t.extRef===ref;}); }
function ctaFor(kind,it){
  var ref=refOf(kind,it.id); var wished=hasWish(ref); var have=tourByRef(ref);
  var heart = wished ? '<span class="chip chip-green">❤️ Bakancslistán</span>'
        : '<button class="btn btn-soft btn-sm" data-f9w="'+kind+":"+it.id+'">❤️ Bakancslistára</button>';
  var plan  = have ? '<button class="btn btn-ghost btn-sm" data-f9open="'+have+'">🗓️ van terved — megnyitom</button>'
        : '<button class="btn btn-primary btn-sm" data-f9plan="'+kind+":"+it.id+'">🗓️ Tervet készítek</button>';
  return { heart:heart, plan:plan };
}
function imgTagSafe(x,label){ try{ return imgTag(x,label); }catch(e){ return ""; } }
function card(t){
  try{ var c=ctaFor("t",t);
  return '<article class="f9card card" data-id="'+t.id+'">'+
    '<div class="img-wrap f9-img">'+imgTagSafe(t.img||IMG.erdo,t.name)+'</div>'+
    '<div class="f9-b"><div class="f9-t1"><b>'+esc9(t.name)+'</b>'+(t.rating?'<span class="chip chip-sand">⭐ '+t.rating+(t.reviews?'('+t.reviews+')':'')+'</span>':'')+'</div>'+
    '<p class="small muted mb0">'+esc9(nz(t.region,'régió nélkül'))+' · 📍 '+esc9(nz(t.start?t.start.name:null,'nincs hely'))+'</p>'+
    '<p class="small mb0" style="margin:.2rem 0 .5rem">📏 '+nz(t.km!=null?t.km+" km":null)+' · ⛰️ '+nz(t.up!=null?"+"+t.up+" m":null)+' · 🕐 '+nz(t.h!=null?t.h+" ó":null)+' · 🥾 '+nz(t.diff)+'</p><p class="tiny muted">'+(window.v123RouteLabel?window.v123RouteLabel(t):(t.gpxUrl?"GPX útvonal elérhető":"Útvonaladat még nem érhető el"))+'</p>'+(window.v122SourceLine?v122SourceLine(t):'')+
    '<div class="f9cta"><button class="btn btn-ghost btn-sm" data-f9tour="'+t.id+'">🥾 Megnézem</button>'+c.plan+c.heart+'</div></div></article>';
  }catch(e){ return ""; }
}
function ecard(e){
  try{ var c=ctaFor("e",e); var base=CAT_T().find(function(t){return t.id===e.tour;});
  var meta='📅 '+nz(e.date,e.time?e.date:null,'dátum nélkül')+(e.time?' '+e.time:'');
  if(base){ meta+=' · 📏 '+base.km+' km · ⛰️ +'+base.up+' m'; } else if(e.km!=null){ meta+=' · 📏 '+e.km+' km'+(e.up!=null?' · ⛰️ +'+e.up+' m':''); }
   return '<article class="f9card card ecard9"><div class="f9-b"><div class="f9-t1"><b>📣 '+esc9(e.name)+'</b>'+(e.dataStatus==="needs_review"?'<span class="chip chip-sand">Ellenőrzés alatt</span>':(e.cat?'<span class="chip chip-sand">'+esc9(e.cat)+'</span>':''))+'</div>'+
    '<p class="small muted mb0">'+meta+(e.place?' · 📍 '+esc9(e.place):'')+(e.diff?' · 🥾 '+esc9(e.diff):'')+(e.org?' · 👥 '+esc9(e.org):'')+'</p>'+
    '<p class="small mb0 f9-src">'+(e.src?'<a href="'+esc9(e.src)+'" target="_blank" rel="noopener nofollow">🔗 Forrás: eredeti oldal ↗</a>':'')+'</p>'+(window.v122SourceLine?v122SourceLine(e):'')+
    '<div class="f9cta"><button class="btn btn-ghost btn-sm" data-f9ev="'+e.id+'">📖 Részletek</button>'+c.plan+c.heart+'</div></div></article>';
  }catch(e2){ return ""; }
}
function peakList(){
  var seen={}, out=[];
  CAT_T().forEach(function(x){
    var p=(x.name||"").split(/[–—-]/)[0].trim(); if(!p) return; var k=p.toLowerCase();
    if(!seen[k]){ seen[k]={name:p, region:x.region||"", n:0, up:null}; out.push(seen[k]); }
    seen[k].n++; if(!seen[k].up && x.up && x.up>500) seen[k].up=x.up;
  });
  return out;
}
function pcard(h){
  return '<article class="f9card card"><div class="f9-b"><div class="f9-t1"><b>🏔️ '+esc9(h.name)+'</b></div>'+
   '<p class="small muted mb0">'+esc9(nz(h.region,'régió nélkül'))+' · '+h.n+' túra a katalógusban · '+(h.up?'⛰️ +'+h.up+' m (katalógus)':'magasság: nincs adat')+'</p>'+
   '<div class="f9cta"><button class="btn btn-primary btn-sm" data-f9peak="'+esc9(h.name)+'">🥾 Túrák itt</button></div></div></article>';
}
function kvMile(o){ return o.distance_km?((Math.round(o.distance_km*10)/10).toFixed(1).replace(".",",") + " km"):"—"; }
function rcard(o,own){
  if(own){ return '<article class="f9card card"><div class="f9-b"><div class="f9-t1"><b>🗺️ '+esc9(o.name||"Névtelen útvonal")+'</b></div>'+
   '<p class="small muted mb0">📏 '+kvMile(o)+' · ⛰️ '+(o.elevation_gain_m!=null?'+'+o.elevation_gain_m+' m':'—')+' · '+(o.created_at?new Date(o.created_at).toLocaleDateString("hu-HU")+" óta":"")+(o.linkedTripId?' · 🥾 projektedhez kapcsolt':'')+'</p>'+
   '<div class="f9cta"><button class="btn btn-soft btn-sm" data-f9route="'+o.id+'">🗺️ Részletek</button></div></div></article>'; }
  return '';
}
/* ——— szűrők, geo, lista ——— */
function nearWeek(datestr){ if(!datestr) return false; try{ var d=new Date(datestr+"T12:00:00"); var now=new Date(); var sat=new Date(now); var day=sat.getDay(); sat.setDate(sat.getDate()+((6-day+7)%7)); sat.setHours(6,0,0,0); var mon=new Date(sat); mon.setDate(sat.getDate()+2); return d>=sat && d<mon; }catch(e){ return false; } }
function tourMatch(t){
  try{ var q1=f9.q.toLowerCase().trim();
  if(q1 && (String(t.name)+" "+(t.region||"")+" "+(t.start?t.start.name:"")+" "+(t.tags||[]).join(" ")).toLowerCase().indexOf(q1)<0) return false;
  if(f9.region && (t.region||"")!==f9.region) return false;
  if(f9.diff && (t.diff||"")!==f9.diff) return false;
  if(f9.dist==="0" && !(t.km<10)) return false; if(f9.dist==="1" && !(t.km>=10&&t.km<=20)) return false; if(f9.dist==="2" && !(t.km>20)) return false;
  if(f9.elev==="0" && !(t.up<500)) return false; if(f9.elev==="1" && !(t.up>=500&&t.up<1000)) return false; if(f9.elev==="2" && !(t.up>=1000)) return false;
  if(f9.csucs && !(/csúcs|kilátó|nyereg|gerinc|tető|topica|hargita|csukás|köves|bükki|balvanyos|radna|izerea|tarnica|hasmas|stânișoara|piatra/.test((t.name+" "+(t.tags||[]).join(" ")).toLowerCase()))) return false;
  return true; }catch(e){ return false; }
}
function evMatch(e){
  try{ var q1=f9.q.toLowerCase().trim();
  if(q1 && (String(e.name)+" "+(e.place||"")+" "+(e.org||"")).toLowerCase().indexOf(q1)<0) return false;
  if(f9.diff && (e.diff||"")!==f9.diff) return false;
  if(f9.weekend && !nearWeek(e.date)) return false;
  return true; }catch(e2){ return false; }
}
function geod(a,b){ try{ var R=6371e3,p=Math.PI/180,dLa=(b[0]-a[0])*p,dLo=(b[1]-a[1])*p; var s=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(a[0]*p)*Math.cos(b[0]*p)*Math.sin(dLo/2)*Math.sin(dLo/2); return 2*R*Math.asin(Math.min(1,Math.sqrt(s))); }catch(e){ return 999999; } }
function dloc(t){ if(!t||!t.start||!f9.loc) return 999999; return geod([t.start.lat,t.start.lng],[f9.loc.lat,f9.loc.lng])/1000; }
function sortTour(arr){
  if(f9.sort==="km") return arr.slice().sort(function(a,b){return (a.km||0)-(b.km||0);});
  if(f9.sort==="up") return arr.slice().sort(function(a,b){return (a.up||0)-(b.up||0);});
  if(f9.sort==="pop") return arr.slice().sort(function(a,b){return (b.rating||0)-(a.rating||0);});
  if(f9.sort==="near") return arr.slice().sort(function(a,b){return dloc(a)-dloc(b);});
  return arr; }
function geoAsk(){
  if(!navigator.geolocation){ f9.locMsg='<span class="small muted">A helymeghatározás nem elérhető ebben a böngészőben.</span>'; f9repList(); return; }
  f9.locMsg='<span class="small muted">📍 Helymeghatározás…</span>'; f9repList();
  navigator.geolocation.getCurrentPosition(function(pos){ f9.loc={lat:pos.coords.latitude,lng:pos.coords.longitude}; f9.sort="near"; f9.locMsg='<span class="chip chip-green">📍 Közelitő hely beállítva — rendezés távolság szerint</span>'; f9rep(); },
   function(err){ f9.locMsg='<span class="small muted">A közeli túrákhoz engedélyezd a helymeghatározást.</span>'; f9repList(); }, {timeout:8000, maximumAge:600000});
}
/* ——— személyes ajánlás (szabályalapú) ——— */
function scored(){
  var d=Store.myData(); var done=d.journal||[];
  var avKm=done.length?done.reduce(function(a,j){return a+(+j.km||0);},0)/done.length:0;
  var regions={}, diffs={};
  (d.wishlist||[]).forEach(function(w){ if(w.ref&&/^f9:t:/.test(w.ref)){ var c=CAT_T().find(function(t){return "f9:t:"+t.id===w.ref;}); if(c&&c.region) regions[c.region]=1; } });
  (d.tours||[]).forEach(function(t){ if(t.difficulty) diffs[t.difficulty]=1; });
  var out=CAT_T().map(function(t){ var sc=0; var reasons=[];
    if(regions[t.region]){ sc+=2; reasons.push("A bakancslistád régiójából"); }
    if(avKm && t.km>=avKm*0.6 && t.km<=avKm*1.6){ sc+=2; reasons.push("Hasonló hosszúságú, mint a teljesítéseid"); }
    if(diffs[t.diff]){ sc+=1; reasons.push("Ugyanilyen nehézségű, mint amit jársz"); }
    if(f9.loc){ var dd=dloc(t); if(dd<50){ sc+=2; reasons.push("Közel van ("+(Math.round(dd*10)/10)+" km)"); } }
    if(t.rating) sc+=(t.rating-4)*1.2;
    return {t:t, sc:sc, reasons:reasons.slice(0,2)};
  }).sort(function(a,b){return b.sc-a.sc;});
  return out;
}
function recMini(){
  var top=scored().slice(0,3);
  if(!top.length) return "";
  return '<section class="card f9recs"><div class="f9-rec-h">🧭 Személyes ajánlás<span class="small muted"> — a te adataid alapján (szabály, nem AI)</span></div>'+
   top.map(function(s){ return '<a class="f9-recrow" data-f9rec="'+s.t.id+'"><b>🥾 '+esc9(s.t.name)+'</b><small>'+esc9(s.reasons.length?s.reasons.join(" · "):"Népszerű a katalógusban")+'</small></a>'; }).join("")+
   '<div style="margin-top:.5rem"><a class="btn btn-soft btn-sm" data-f9tab="pop">🔎 Összes ajánlás</a></div></section>';
}
function f9ListHtml(){
  try{
  if(f9.tab==="events"){ var fe=CAT_E().filter(evMatch); var top=fe.slice(0,6); var rest=fe.slice(6);
    var out='<p class="small muted" style="margin:.1rem 0 .7rem">Csak ellenőrzött, forrásmegjelölt események jelennek meg.</p>';
    if(top.length){ out+=top.map(ecard).join(""); if(rest.length) out+='<details class="f9-more"><summary>＋ '+rest.length+' további esemény</summary>'+rest.map(ecard).join("")+'</details>'; return out; }
    return '<div class="empty"><span class="em-ico">📅</span><h3>Jelenleg nincs ellenőrzött esemény.</h3><p class="muted">Ha hiteles forrásból érkezik új esemény, az ellenőrzés után jelenik meg.</p><button class="btn btn-primary" data-f9tab="tours">🥾 Túrák felfedezése</button></div>';
  }
  if(f9.tab==="peaks"){ var pk=peakList(); if(f9.q){ var q1=f9.q.toLowerCase(); pk=pk.filter(function(h){return (h.name+" "+h.region).toLowerCase().indexOf(q1)>-1;}); }
    return pk.map(pcard).join("")||'<div class="empty"><span class="em-ico">🏔️</span><h3>Nincs ilyen hegy a katalógusban.</h3><button class="btn btn-ghost" data-f9clear>🔄 Szűrők törlése</button></div>'; }
  if(f9.tab==="routes"){ var own=(Store.myData().routes||[]).slice(); var html='<h3 class="f9-sect">⭐ Saját útvonalak (V47 GPX)</h3>';
    html += own.length? own.map(function(o){return rcard(o,true);}).join("") : '<div class="empty sm"><span class="em-ico">🗺️</span><h3>Még nincs útvonal.</h3><button class="btn btn-primary" data-f9import>＋ GPX importálása</button></div>';
    html+='<h3 class="f9-sect">🌍 Ellenőrzött nyilvános útvonalak</h3>'+(CAT_T().length?CAT_T().map(function(o){return rcard({id:o.id,name:o.name,distance_km:o.km,elevation_gain_m:o.up},false);}).join(""):'<div class="empty sm"><span class="em-ico">🗺️</span><h3>Nincs ellenőrzött nyilvános útvonal.</h3><p class="muted">Saját GPX útvonalat a személyes túraközpontban importálhatsz.</p></div>');
    return html; }
  if(f9.tab==="pop"){ var arr= f9.q||f9.region||f9.diff||f9.dist||f9.elev||f9.csucs? CAT_T().filter(tourMatch) : CAT_T();
    return '<p class="small muted">Népszerűség a katalógus valódi ⭐ értékelései alapján; érték nélküli túra a lista végén.</p>'+sortTour(arr.slice().sort(function(a,b){return (b.rating||0)-(a.rating||0);}) ).slice(0,12).map(card).join(""); }
  var arr2=CAT_T().filter(tourMatch); var res=sortTour(arr2);
  var head = (f9.weekend? '<p class="small muted">📅 A hétvége-szűrés az Események fülön érvényes (a túráknak nincs fix dátumuk).</p>':"");
  var body = res.length? res.map(card).join("") : '<div class="empty"><span class="em-ico">🔎</span><h3>Nem találtunk ilyen túrát.</h3><button class="btn btn-ghost" data-f9clear>🔄 Szűrők törlése</button></div>';
  return head+body;
  }catch(e){ return '<div class="empty"><span class="em-ico">⚠️</span><h3>A lista megjelenítése most nem sikerült.</h3><button class="btn btn-ghost" data-f9tab="tours">🥾 Túrák</button></div>'; }
}
/* ——— nézet + drótozás ——— */
function f9HeadHtml(){
  var regs=CAT_T().map(function(t){return t.region;}).filter(function(v,i,a){return v&&a.indexOf(v)===i;});
  function sel(id,val,opts,all){ return '<select class="input" id="'+id+'"><option value="">'+all+'</option>'+opts.map(function(o){ return '<option value="'+esc9(o)+'"'+(val===o?' selected':'')+'>'+esc9(o)+'</option>'; }).join("")+'</select>'; }
  return '<section class="wrap f9head"><div class="f9-hero-t"><p class="eyeb">🗺️ TÚRAFELFEDEZŐ</p><h1 class="f9-h1">Mit túrázzak?</h1><p class="f9-sub">Találd meg a következő túrádat Székelyföldön és Erdélyben — egy koppintással saját terv lesz belőle.</p></div>'+
   '<div class="f9-tools"><input class="input" id="f9q" placeholder="🔎 Keress túrát, hegyet, útvonalat vagy eseményt…" value="'+esc9(f9.q)+'">'+
   sel("f9reg",f9.region,regs,"📍 Régió: mindegy")+' '+sel("f9diff",f9.diff,["Könnyű","Közepes","Nehéz"],"🥾 Nehézség")+' '+
   '<select class="input" id="f9dist"><option value="">📏 Távolság</option><option value="0"'+(f9.dist==="0"?" selected":"")+'>0–10 km</option><option value="1"'+(f9.dist==="1"?" selected":"")+'>10–20 km</option><option value="2"'+(f9.dist==="2"?" selected":"")+'>20+ km</option></select> '+
   '<select class="input" id="f9elev"><option value="">⛰️ Szint</option><option value="0"'+(f9.elev==="0"?" selected":"")+'>0–500 m</option><option value="1"'+(f9.elev==="1"?" selected":"")+'>500–1000 m</option><option value="2"'+(f9.elev==="2"?" selected":"")+'>1000+ m</option></select></div>'+
   '<div class="f9-chips" role="group">'+
    '<button class="f-pill'+(f9.loc&&f9.sort==="near"?" on":"")+'" data-f9chip="near">📍 Közel hozzám</button>'+
    '<button class="f-pill'+(f9.weekend?" on":"")+'" data-f9chip="weekend">📅 Ezen a hétvégén</button>'+
    '<button class="f-pill'+(f9.diff==="Könnyű"?" on":"")+'" data-f9chip="Könnyű">🥾 Könnyű</button>'+
    '<button class="f-pill'+(f9.diff==="Közepes"?" on":"")+'" data-f9chip="Közepes">🥾 Közepes</button>'+
    '<button class="f-pill'+(f9.diff==="Nehéz"?" on":"")+'" data-f9chip="Nehéz">🥾 Nehéz</button>'+
    '<button class="f-pill'+(f9.csucs?" on":"")+'" data-f9chip="csucs">🏔️ Csúcs</button>'+
    '<button class="f-pill'+(f9.tab==="events"&&f9.kozos?" on":"")+'" data-f9chip="kozos">👥 Közösségi</button>'+
    '<span class="f9-sortwrap">Rendezés:<select class="input" id="f9sort"><option value="">alap</option><option value="pop"'+(f9.sort==="pop"?" selected":"")+'>⭐ népszerű</option><option value="km"'+(f9.sort==="km"?" selected":"")+'>📏 legrövidebb</option><option value="up"'+(f9.sort==="up"?" selected":"")+'>⛰️ legkisebb szint</option><option value="near"'+(f9.sort==="near"?" selected":"")+'>📍 legközelebbi</option></select></span></div>'+
   (f9.locMsg?'<p class="small" style="margin:.4rem 0 0">'+f9.locMsg+'</p>':'')+
   '<div class="tabs f9-tabs" role="tablist">'+
    [["tours","🥾 Túrák"],["events","📅 Események"],["peaks","🏔️ Hegyek"],["routes","🗺️ Útvonalak"],["pop","⭐ Népszerű"]].map(function(x){ return '<button class="'+(f9.tab===x[0]?"on":"")+'" data-f9tab="'+x[0]+'">'+x[1]+'</button>'; }).join("")+
   '</div></section>';
}
function f9View(){ return f9HeadHtml()+'<div class="wrap"><div id="f9-list" class="grid f9-grid">'+f9ListHtml()+'</div>'+(f9.tab==="tours"?recMini():"")+'</div>'; }
var f9rootEl=null;
function f9rep(){ var r=document.getElementById("view"); if(!r||!f9rootEl) f9rootEl=r; r.innerHTML=f9View(); }
function f9repList(){ var l=document.getElementById("f9-list"); if(l){ l.innerHTML=f9ListHtml(); var rc=document.querySelector(".f9recs"); if(f9.tab==="tours"&&!rc){ l.insertAdjacentHTML("afterend", recMini()); } } }
/* ——— akciók ——— */
function planFrom(kind,id){
  try{ var ref=refOf(kind,id); var d=Store.myData(); var exist=(d.tours||[]).find(function(x){return x.extRef===ref;});
    if(exist){ openModal({title:"🗓️ Ehhez már van túraprojekted", body:'<p class="muted mt0">A(z) <b>'+esc9(exist.title)+'</b> projekt már fut — nem hozunk létre másikat.</p>', footer:'<button class="btn btn-ghost" data-close>Később</button> <a class="btn btn-primary" href="#/tura/'+exist.id+'">🗓️ Megnyitom</a>'}); return; }
    var n=null;
    if(kind==="t"){ var t=CAT_T().find(function(x){return x.id===id;}); if(!t) return;
      n=Store.newTourFromDraft({ title:t.name, place:(t.start?t.start.name:t.region||""), region:t.region||"", date:"", lengthKm:+t.km||0, ascent:+t.up||0, durationH:+t.h||0, difficulty:t.diff||"Közepes", img:t.img||IMG.erdo, desc:t.desc||"", coords:(t.start&&t.start.lat)?{lat:t.start.lat,lng:t.start.lng}:null, notes:"Forrás: Túrafelfedező", tags:(t.tags||[]).slice(0,6).concat(["felfedezett"]) });
    } else { var e=CAT_E().find(function(x){return x.id===id;}); if(!e) return; var base=CAT_T().find(function(t){return t.id===e.tour;});
      n=Store.newTourFromDraft({ title:e.name, place:e.place||"", region:base?(base.region||""):"", date:e.date||"", timeHint:e.time||"", lengthKm:base?(+base.km||0):0, ascent:base?(+base.up||0):0, durationH:base?(+base.h||0):0, difficulty:e.diff||(base?base.diff:null)||"Közepes", img:e.img||(base?base.img:IMG.erdo), desc:e.desc||"", coords:(base&&base.start&&base.start.lat)?{lat:base.start.lat,lng:base.start.lng}:null, notes:"Forrás: Túraesemény"+(e.src?" · "+e.src:"")+(e.org?" · "+e.org:""), tags:["esemeny"] });
      n.eventRef=e.id; n.eventCat=e.cat||""; }
    n.status="tervezés"; n.extRef=ref; Store.save();
    toast("Túraprojekt létrejött a felfedezett adatokkal — 🤖 V43 / 🧠 V48/V44 elérhető a projektben","🗓️");
    NAV.to("#/tura/"+n.id);
  }catch(e2){ toast("A tervkészítés most nem sikerült","⚠️"); }
}
function wishToggle(kind,id){
  try{ var ref=refOf(kind,id); var t=(kind==="t")?CAT_T().find(function(x){return x.id===id;}):CAT_E().find(function(x){return x.id===id;}); if(!t) return;
    var d=Store.myData(); var w={id:ref,name:t.name||ref,cat:(kind==="t"?(t.region||"Felfedezett"):(t.cat||"Esemény")),place:(t.start?t.start.name:(t.place||"")) ,diff:(t.diff||"—"),img:t.img||null}; var had=hasWish(ref);
    Store.toggleWish(w); toast(had?"Eltávolítva a bakancslistáról":"✓ Bakancslistára mentve", had?"—":"❤️"); f9repList();
  }catch(e){ toast("A mentés most nem sikerült","⚠️"); }
}
function shareF9(kind,id){
  try{ var t=(kind==="t")?CAT_T().find(function(x){return x.id===id;}):CAT_E().find(function(x){return x.id===id;}); if(!t) return;
    var txt="Túratárs javaslat: "+t.name+(t.start?" ("+t.start.name+")":(t.place?" ("+t.place+")":""))+" — https://turatars.ro/#/felfedezes";
    if(navigator.share){ navigator.share({title:"Túratárs", text:txt}).catch(function(){ try{navigator.clipboard.writeText(txt); toast("Megosztás szövege vágólapon ✔","📤");}catch(e2){} }); }
    else if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(function(){ toast("Link + szöveg a vágólapon ✔","📤"); }).catch(function(){ toast("Az eyed át a linket:","#"+location.hash); }); }
    else { toast("Másold: "+location.href.slice(0,48)+"…","📤"); }
  }catch(e){}
}
function openTourModal(id){
  try{ var t=CAT_T().find(function(x){return x.id===id;}); if(!t) return; var c=ctaFor("t",t);
   openModal({title:"🏔️ "+esc9(t.name), body:'<div class="img-wrap modimg9">'+imgTagSafe(t.img||IMG.erdo,t.name)+'</div>'+
    '<p class="small muted mt0">'+esc9(t.region)+' · 📍 '+esc9(t.start?t.start.name:"nincs hely")+'</p>'+
    '<p class="small mb0">📏 '+nz(t.km!=null?t.km+" km":null,'nincs adat')+' &middot; ⛰️ '+nz(t.up!=null?"+"+t.up+" m":null,'—')+' &middot; 🕐 '+nz(t.h!=null?t.h+" ó":null,'—')+' &middot; 🥾 '+nz(t.diff)+' &middot; ⭐ '+nz(t.rating,'nincs értékelés')+'</p>'+
    '<div id="f9map-'+t.id+'" class="modmap9"></div>'+
    '<p class="small mb0">'+esc9(t.desc||"Erről a túráról nincs leírás a katalógusban.")+'</p>'+ (t.gpxUrl?'<a class="btn btn-soft btn-sm" target="_blank" rel="noopener" href="'+esc9(t.gpxUrl)+'">⬇ GPX letöltése</a>':'<p class="small muted">🗺️ Útvonaladat még nem érhető el. A kezdőpontból saját útvonalat tervezhetsz.</p>')+(window.v123PlanningUrl&&t.start?'<a class="btn btn-ghost btn-sm" target="_blank" rel="noopener nofollow" href="'+esc9(window.v123PlanningUrl(t))+'">🧭 Útvonal tervezése a térképen</a>':'')+
    ((t.tags||[]).length?'<p class="small muted mb0">'+t.tags.map(esc9).join(" · ")+'</p>':"")+
    '<div class="f9cta">'+c.plan+c.heart+'<button class="btn btn-ghost btn-sm" data-f9share="t:'+t.id+'">📤 Megosztás</button></div>'+
    (t.start&&t.start.lat?'<p class="tiny muted">A térképen csak a valódi kezdőpont látszik — kitalált útvonalat nem rajzolunk.</p>':""),
    footer:'<button class="btn btn-primary btn-block" data-close>Kész</button>',
    onOpen:function(m){ f9modalWire(m); var el=m.querySelector(".modmap9"); if(el&&t.start&&t.start.lat&&typeof MapKit!=="undefined"){ try{ var mp=MapKit.make(el,{center:[t.start.lat,t.start.lng],zoom:12}); MapKit.pin(mp,t.start.lat,t.start.lng,"pin-cat",esc9(t.start.name)); }catch(e){ el.innerHTML='<span class="small muted">Térkép nem érhető el — az adat így is használható.</span>'; } } } });
  }catch(e){}
}
function openEventModal(id){
  try{ var e=CAT_E().find(function(x){return x.id===id;}); if(!e) return; var c=ctaFor("e",e); var base=CAT_T().find(function(t){return t.id===e.tour;});
    openModal({title:"📣 "+esc9(e.name), body:'<p class="small muted mt0">📅 '+nz(e.date,'dátum nélkül')+(e.time?(' · 🕐 '+e.time):"")+(e.place?(' · 📍 '+esc9(e.place)):"")+(e.cat?(' · '+esc9(e.cat)):"")+'</p>'+
     '<p class="small mb0">'+(base?('📏 '+base.km+' km · ⛰️ +'+base.up+' m · 🕐 '+base.h+' ó · 🥾 '+esc9(base.diff||"—")):(e.km!=null||e.up!=null)?((e.km!=null?'📏 '+e.km+' km':'')+(e.km!=null&&e.up!=null?' · ':'')+(e.up!=null?'⛰️ +'+e.up+' m':'')+(e.h!=null?' · 🕐 '+e.h+' ó':'')+(e.diff?' · 🥾 '+esc9(e.diff):'')):"Táv/szint: nincs adat a katalógusban")+' · 👥 '+nz(e.org,'szervező nélkül')+'</p>'+ (window.v52Extra?window.v52Extra(e):'') +
     '<p class="small mb0">'+esc9(e.desc||"Rövid leírás nincs a helyi állományban.")+'</p>'+
     '<p class="small mb0">'+(e.people?("Jelentkezett: "+e.people+(e.cap?("/"+e.cap):"")):"")+'</p>'+
     '<div class="f9cta"><a class="btn btn-soft btn-sm" '+(e.src?('href="'+esc9(e.src)+'" target="_blank" rel="noopener"'):'aria-disabled="true"')+'>🔗 Eredeti oldal</a><button class="btn btn-ghost btn-sm" data-f9share="e:'+e.id+'">📤 Megosztás</button>'+c.heart+'</div>',
     footer:(c.plan?'<div class="f9cta">'+c.plan+'</div>':"")+'' ,
     onOpen:function(m){ f9modalWire(m); }});
  }catch(e2){}
}
function f9modalWire(m){
  m.addEventListener("click", function(e0){ var b=e0.target.closest?e0.target.closest("[data-f9plan],[data-f9w],[data-f9open],[data-f9share],[data-f9tour],[data-f9ev]"):null; if(!b) return;
   var pl=b.dataset.f9plan; if(pl){ var q=pl.split(":"); closeModal(); planFrom(q[0],q[1]); return; }
   var wu=b.dataset.f9w; if(wu){ var ww=wu.split(":"); wishToggle(ww[0],ww[1]); /*V51FIX*/ var hb=document.querySelector('[data-modal]'); if(hb){ var n=hb.querySelector('[data-f9w]'); if(n){ n.outerHTML='<span class="chip chip-green">❤️ Bakancslistán</span>'; } } f9repList(); return; }
   var op=b.dataset.f9open; if(op){ closeModal(); NAV.to("#/tura/"+op); return; }
   var sh=b.dataset.f9share; if(sh){ var ss=sh.split(":"); shareF9(ss[0],ss[1]); return; }
   var to=b.dataset.f9tour; if(to){ closeModal(); openTourModal(to); return; }
   var evv=b.dataset.f9ev; if(evv){ closeModal(); openEventModal(evv); return; } });
}
function f9wire(root){
  root.addEventListener("input", function(e0){ var x=e0.target; if(x.id==="f9q"){ f9.q=x.value; f9repList(); } });
  root.addEventListener("change", function(e0){ var x=e0.target; var m={f9reg:"region",f9diff:"diff",f9dist:"dist",f9elev:"elev",f9sort:"sort"}[x.id]; if(m){ f9[m]=x.value; if(m==="diff"&&f9.tab==="peaks") f9.tab="tours"; f9rep(); } });
  root.addEventListener("click", function(e0){ var b=e0.target.closest?e0.target.closest("[data-f9tab],[data-f9chip],[data-f9clear],[data-f9plan],[data-f9open],[data-f9w],[data-f9tour],[data-f9ev],[data-f9peak],[data-f9route],[data-f9import],[data-f9rec],[data-f9share]"):null; if(!b) return;
    if(b.dataset.f9tab){ f9.tab=b.dataset.f9tab; f9rep(); return; }
    var ch=b.dataset.f9chip; if(ch){ if(ch==="near"){ geoAsk(); }
      else if(ch==="weekend"){ f9.weekend=!f9.weekend; if(f9.weekend) f9.tab="events"; f9rep(); }
      else if(ch==="csucs"){ f9.csucs=!f9.csucs; if(f9.tab!=="tours"&&f9.tab!=="pop") f9.tab="tours"; f9rep(); }
      else if(ch==="kozos"){ f9.kozos=!f9.kozos; f9.tab="events"; f9rep(); }
      else { f9.diff = (f9.diff===ch)?"":ch; f9rep(); } return; }
    if(b.hasAttribute("data-f9clear")){ f9.q="";f9.region="";f9.diff="";f9.dist="";f9.elev="";f9.csucs=false;f9.weekend=false;f9.sort="";f9rep(); return; }
    var pl=b.dataset.f9plan; if(pl){ var pp=pl.split(":"); closeModal(); planFrom(pp[0],pp[1]); return; }
    var op=b.dataset.f9open; if(op){ closeModal(); NAV.to("#/tura/"+op); return; }
    var wu=b.dataset.f9w; if(wu){ var ww=wu.split(":"); wishToggle(ww[0],ww[1]); return; }
    var to=b.dataset.f9tour; if(to){ openTourModal(to); return; }
    var ev=b.dataset.f9ev; if(ev){ openEventModal(ev); return; }
    var pk=b.dataset.f9peak; if(pk){ f9.q=pk; f9.tab="tours"; f9rep(); return; }
    var rt=b.dataset.f9route; if(rt){ if(window.__rtopen) window.__rtopen(rt,true); return; }
    if(b.hasAttribute("data-f9import")){ closeModal(); if(window.openGPXImport) window.openGPXImport({}); else NAV.to("#/utvonalak"); return; }
    var rc=b.dataset.f9rec; if(rc){ openTourModal(rc); return; }
    var sh=b.dataset.f9share; if(sh){ var ss=sh.split(":"); shareF9(ss[0],ss[1]); return; } });
}
var _f9orig = VIEWS.discover, _f9origA = VIEWS.discover && VIEWS.discover.after;
VIEWS.discover = function(){ try{ if(!Store.me()) return _f9orig(); return '<main class="f9page">'+f9View()+'</main>'; }catch(e){ try{ return _f9orig(); }catch(e2){ return '<div class="wrap">A felfedezés most nem érhető el.</div>'; } } };
VIEWS.discover.after = function(root){
  try{ if(!Store.me()){ _f9origA && _f9origA(root); return; } }catch(e){}
  if(!root.__f9w){ root.__f9w=1; f9wire(root); }
};
(function(){ try{
  var _prevDash = VIEWS.dash && VIEWS.dash.after;
  VIEWS.dash = VIEWS.dash || function(){ return ""; };
  VIEWS.dash.after = function(root){ try{ _prevDash&&_prevDash(root); }catch(e){}
    try{ if(!root) return; var w=root.querySelector("#widgets"); if(!w||w.querySelector("#f9mini")) return; var top=scored().slice(0,3); if(!top.length) return;
      var box=document.createElement("section"); box.className="wsec"; box.id="f9mini";
      box.innerHTML='<div class="wpan f9mini"><b>🗺️ Fedezd fel a következő túrádat</b>'+top.map(function(s){return '<span class="f9-minirow">'+esc9(s.t.name)+' <small>'+(s.reasons[0]||"népszerű")+'</small></span>';}).join("")+'<a class="btn btn-soft btn-sm" href="#/felfedezes">🔎 Felfedezem</a></div>';
      var inbox=w.querySelector('[data-w="inbox"]'); if(inbox&&inbox.parentNode) inbox.parentNode.insertBefore(box, inbox.nextSibling); else w.appendChild(box);
    }catch(e){} };
}catch(e){} })();
window.__V49=1; window.f9State=f9; window.v49Plan=planFrom; window.v49OpenEv=openEventModal; window.v49CAT_E=CAT_E;
})();

/* ==== v50 ==== */
/* ============ V50 — 👤 Saját túrázási profil + személyes statisztika + jelvények ============
   Források: d.tours (teljesítve/archiválva) + d.journal (V42) + d.routes (V47) + wishlist + equipment.
   Nem tárol párhuzamos adatot; a jelvények és statisztikák determinisztikus, render-időben számított állapotok. */
(function(){
"use strict";
function esc5(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function num(x){ var n=+x; return (x==null||x===""||!isFinite(n))?null:n; }
function p5fmtNum(n){ var v=num(n); return v==null?"—":Math.round(v).toLocaleString("hu-HU"); }
function p5kmfmt(x){ var v=num(x); return v==null?"—":(Math.round(v*10)/10).toString().replace(".",","); }
function rtf(x){ return p5kmfmt(x); }
function p5TrackMax(tr){ try{ if(!tr||!tr.length) return null; var m=null; tr.forEach(function(pt){ var e=(pt&&pt.length>2)?num(pt[2]):null; if(e!=null&&(m===null||e>m)) m=e; }); return m; }catch(e){ return null; } }
var HM=["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
var p5Y=null; /* kiválasztott év — csak UI állapot */

/* ---------- a teljesített túra-egységek (tourId dedup) ---------- */
function doneList(){
  var d=(Store.myData()||{}); var out=[]; var seen={};
  (d.tours||[]).forEach(function(t){
    if(!t||!t.id||seen[t.id]) return; if(t.status!=="teljesítve"&&t.status!=="archiválva") return; seen[t.id]=1;
    var j=null; (d.journal||[]).forEach(function(x){ if(x&&x.tourId===t.id&&!j) j=x; });
    var km=num(t.lengthKm), up=num(t.ascent), desc=num(t.descent), durH=num(t.durationH), maxE=null;
    var region=(t.region||"").trim(), place=(t.place||"").trim(), when=(j&&j.date)||t.doneAt||t.date||"";
    if(j){ var jk=num(j.km), ju=num(j.up), jh=num(j.h); if(jk!=null)km=jk; if(ju!=null)up=ju; if(jh!=null)durH=jh; if(j.date)when=j.date; }
    if(t.routeId){ var r=(d.routes||[]).find(function(x){return x&&x.id===t.routeId;});
      if(r){ var rk=num(r.distance_km), ru=num(r.elevation_gain_m), rl=num(r.elevation_loss_m), rm=p5TrackMax(r.track);
        if(rk!=null)km=rk; if(ru!=null)up=ru; if(rl!=null)desc=rl; if(rm!=null)maxE=rm; } }
    if(maxE==null&&t.elev&&t.elev.length){ var el=t.elev.map(num).filter(function(x){return x!=null;}); if(el.length)maxE=Math.max.apply(null,el); }
    out.push({ id:t.id, title:(j&&j.title)||t.title||place||"Névtelen túra", km:km, up:up, desc:desc, durH:durH, maxE:maxE,
      region:region, place:place, when:when||"", hasJournal:!!j }); });
  return out;
}
function agg(list){ var km=0,up=0,h=0,n=0,hi=null; list.forEach(function(t){ n++;
  if(t.km!=null)km+=t.km; if(t.up!=null)up+=t.up; if(t.durH!=null)h+=t.durH; if(t.maxE!=null&&(hi===null||t.maxE>hi))hi=t.maxE; });
  return {n:n,km:km,up:up,h:h,maxE:hi}; }
function years(list){ var s={}; list.forEach(function(t){ var y=(t.when||"").slice(0,4); if(y&&+y>2000&&+y<2100)s[y]=1; }); return Object.keys(s).sort().reverse(); }
function regionsOf(list){ var m={}; list.forEach(function(t){ var r=(t.region||t.place||"").trim(); if(r)m[r]=(m[r]||0)+1; }); return Object.keys(m).map(function(k){return [k,m[k]];}).sort(function(a,b){return b[1]-a[1];}); }
function byM(list,y){ var a=[]; for(var mi=1;mi<=12;mi++){ var key=y+"-"+(mi<10?"0":"")+mi; var rows=list.filter(function(t){return (t.when||"").indexOf(key)===0;}); var km=0; rows.forEach(function(t){ if(t.km!=null)km+=t.km; }); a.push({m:HM[mi-1],n:rows.length,km:Math.round(km*10)/10}); } return a; }
function bests(list){
  function pick(fn){ var b=null; list.forEach(function(t){ var v=fn(t); if(v==null)return; var bv=b?fn(b):null; if(b===null||(bv!=null&&v>bv)||(bv==null)) b=t; }); return {t:b,v:b?fn(b):null}; }
  return { high:pick(function(t){return t.maxE;}), long:pick(function(t){return t.km;}), up:pick(function(t){return t.up;}), dur:pick(function(t){return t.durH;}) }; }

/* ---------- JELVÉNYEK — számított állapot (nincs tárolás → dedup automatikus) ---------- */
var P5_BADGES=[
  {id:"p5-t1", icon:"🥾", name:"Első túra", kind:"n", need:1, unit:"túra"},
  {id:"p5-t5", icon:"🥾", name:"Öt túra", kind:"n", need:5, unit:"túra"},
  {id:"p5-t10", icon:"🏔️", name:"Tíz túra", kind:"n", need:10, unit:"túra"},
  {id:"p5-up5", icon:"⛰️", name:"Szintgyűjtő", kind:"up", need:5000, unit:"m"},
  {id:"p5-up10", icon:"⛰️", name:"Hegyi szintgyűjtő", kind:"up", need:10000, unit:"m"},
  {id:"p5-k100", icon:"📏", name:"100 km", kind:"km", need:100, unit:"km"},
  {id:"p5-k250", icon:"📏", name:"250 km", kind:"km", need:250, unit:"km"},
  {id:"p5-hi", icon:"🏔️", name:"Magashegyi túrázó", kind:"maxE", need:1500, unit:"m"},
  {id:"p5-reg", icon:"🗺️", name:"Erdély felfedezője", kind:"reg", need:3, unit:"régió"},
  {id:"p5-per", icon:"🔥", name:"Kitartó túrázó", kind:"yr", need:10, unit:"túra"}];
function valOf(kind,st,list){ if(kind==="n")return st.n; if(kind==="km")return st.km; if(kind==="up")return st.up; if(kind==="maxE")return st.maxE;
  if(kind==="reg")return regionsOf(list).length;
  if(kind==="yr"){ var b=0; years(list).forEach(function(y){ var c=list.filter(function(t){return (t.when||"").indexOf(y)===0;}).length; if(c>b)b=c; }); return b; } return 0; }
function p5Badges(list,st){ return P5_BADGES.map(function(b){
  if(!list.length) return Object.assign({},b,{got:null,now:null,miss:""});
  var v=valOf(b.kind,st,list);
  if(v==null) return Object.assign({},b,{got:false,now:null,miss:""});
  var got=v>=b.need; var dif=Math.max(0,b.need-v);
  var miss=got?"":"Még "+(b.kind==="n"||b.kind==="yr"||b.kind==="reg"? (Math.ceil(dif)+" "+b.unit) : (p5fmtNum(Math.ceil(dif))+" "+b.unit))+" hiányzik.";
  return Object.assign({},b,{got:got,now:Math.round(v*10)/10,miss:miss}); }); }
function nextGoal(bd){ var open=bd.filter(function(b){return b.got===false&&b.now!=null;});
  if(!open.length){ return bd.every(function(b){return b.got===true;})? "🎉 Szép munka! Minden jelenlegi mérföldkövet teljesítetted." : null; }
  open.sort(function(a,b){ return (a.need-a.now)-(b.need-b.now); });
  var b=open[0]; var dif=Math.ceil(b.need-b.now);
  return "Már csak "+(b.kind==="n"||b.kind==="yr"||b.kind==="reg"? dif+" "+b.unit : p5fmtNum(dif)+" "+b.unit)+" kell a(z) „"+b.name+"” jelvényhez."; }

/* ---------- kis diagram + építőelemek ---------- */
function p5Chart(list,y){ var mm=byM(list,y); var max=1; mm.forEach(function(x){ if(x.n>max)max=x.n; });
  return '<div class="p5-chart" role="img" aria-label="Havi aktivitás: túrák száma">'+ mm.map(function(x){ var h=x.n?Math.max(7,Math.round(x.n/max*44)):3;
    return '<div class="p5-b1" title="'+esc5(x.m+": "+x.n+" túra · "+p5kmfmt(x.km)+" km")+'">'+(x.n?'<b class="p5-bn">'+x.n+"</b>":"")+'<span class="p5-bv" style="height:'+h+'px"></span><small>'+esc5(x.m.slice(0,3))+".</small></div>"; }).join("")+"</div>"; }
function p5StatCard(icon,val,label,href){ var s='<b class="p5-sv">'+icon+" "+esc5(val)+'</b><small class="p5-sl">'+esc5(label)+"</small>";
  return href? '<a class="p5-stat" href="'+href+'">'+s+"</a>" : '<div class="p5-stat">'+s+"</div>"; }
function p5Sec(t,inner,act){ return '<section class="card panel p5-sec"><h2>'+t+"</h2>"+(act?'<div class="p5-act">'+act+"</div>":"")+inner+"</section>"; }
function p5Tile(icon,label,count,href,btn){ return '<div class="p5-tile"><div class="p5-tl"><b>'+icon+" "+esc5(label)+'</b><span class="mut">'+esc5(count)+"</span></div><a class=\"btn btn-soft btn-sm\" href=\""+href+"\">"+btn+"</a></div>"; }
function p5RoutesInner(){ try{ var d=Store.myData(); var rs=(d.routes||[]).slice(); if(!rs.length) return '<p class="muted small">Még nincs importált útvonal — a V47 GPX-import itt jelenik meg.</p>';
  return '<div class="p5-rlist">'+rs.slice(0,4).map(function(r){ var hi=p5TrackMax(r.track);
    return '<div class="p5-row"><b>🗺️ '+esc5(r.name||"Névtelen útvonal")+'</b><span class="mut">'+(r.distance_km!=null?rtf(r.distance_km)+" km":"km: —")+" · "+(r.elevation_gain_m!=null?"↑ "+p5fmtNum(r.elevation_gain_m)+" m":"szint: nem ismétlődik")+(hi!=null?" · ⛰️ max "+p5fmtNum(hi)+" m":"")+'</span><button class="btn btn-soft btn-sm" data-p5route="'+esc5(r.id)+'">🗺️ Megnyitom</button></div>'; }).join("")
    +(rs.length>4?'<a class="small" href="#/utvonalak">+'+(rs.length-4)+" további → Útvonalak</a>":"")+"</div>"; }catch(e){ return '<p class="muted small">Az útvonalak most nem olvashatók.</p>'; } }
function ownGearN(){ try{ return ((Store.myData()||{}).equipment||[]).filter(function(e){return e&&e.has;}).length; }catch(e){ return 0; } }

/* ---------- fő nézet ---------- */
function p5Inner(){
  var list=doneList(); var st=agg(list); var bds=p5Badges(list,st); var got=bds.filter(function(b){return b.got===true;}).length;
  var ys=years(list); var y=p5Y||ys[0]||String(new Date().getFullYear());
  var yopts=ys.slice(); if(yopts.indexOf(y)<0)yopts.unshift(y); if(!yopts.length)yopts=[String(new Date().getFullYear())];
  var ysel='<select class="input p5-ys" id="p5year" aria-label="Év kiválasztása">'+yopts.map(function(x){return '<option'+(x===y?" selected":"")+">"+esc5(x)+"</option>";}).join("")+"</select>";
  var yList=list.filter(function(t){return (t.when||"").indexOf(y)===0;}); var ya=agg(yList);
  var zero=!list.length;
  var yCard='<div class="p5-grid4">'+ (yList.length? p5StatCard("🥾",String(ya.n),"teljesített túra · "+y,"#/turaim")+p5StatCard("📏",p5kmfmt(ya.km)+" km","évi táv")+(ya.up? p5StatCard("⛰️",p5fmtNum(ya.up)+" m","évi szint"):"")+(ya.maxE!=null? p5StatCard("🏔️",p5fmtNum(ya.maxE)+" m","évi legmagasabb pont"):"") : '<p class="muted" style="margin:.5rem 0 0">Ebben az évben még nincs teljesített túrád.</p>')+"</div>";
  var b=bests(list);
  var bb='<div class="p5-rows">'+ [["🏔️","Legmagasabb pontú túra",b.high.v!=null?p5fmtNum(b.high.v)+" m":null,b.high.t],["📏","Leghosszabb túra",b.long.v!=null?rtf(b.long.v)+" km":null,b.long.t],["⛰️","Legnagyobb szint",b.up.v!=null?p5fmtNum(b.up.v)+" m":null,b.up.t],["🥾","Leghosszabb időtartam",b.dur.v!=null?p5fmtNum(Math.round(b.dur.v*60))+" perc":null,b.dur.t]].map(function(x){
      if(!list.length||x[2]==null) return '<div class="p5-row"><b>'+x[0]+" "+esc5(x[1])+'</b><span class="mut">nincs adat</span></div>';
      return '<div class="p5-row"><b>'+x[0]+" "+esc5(x[1])+'</b><span class="mut">'+esc5(x[2])+(x[3]?' · <a href="#/tura/'+esc5(x[3].id)+'">'+esc5(x[3].title.slice(0,26))+"</a>":"")+"</span></div>"; }).join("")+"</div>"
    +(list.length?"":'<p class="muted">ℹ️ Még nincs elegendő adat.</p>');
  var rg=regionsOf(list);
  var rgHtml=(rg.length? '<div class="chips">'+rg.map(function(x){return '<span class="chip chip-green">'+esc5(x[0])+" · "+x[1]+"</span>";}).join("")+"</div>"+(rg.length>=3?'<p class="small muted">Csak aProjects túráidban szereplő, ténylegesen rögzített helyszínek.</p>':'') : '<p class="muted">Csak a ténylegesen rögzített régiókat mutatjuk — ahiányzó helyszínt nem találunk ki.</p>');
  var last=list.slice().sort(function(a,x){ return (x.when||"").localeCompare(a.when||""); })[0];
  var lastHtml=last? '<div class="p5-row"><b>📖 '+esc5(last.title)+'</b><span class="mut">'+esc5(last.when||"nincs dátum")+(last.km!=null?" · "+rtf(last.km)+" km":"")+(last.up!=null?" · ↑ "+p5fmtNum(last.up)+" m":"")+'</span><button class="btn btn-soft btn-sm" data-p5mem="'+esc5(last.id)+'">'+(last.hasJournal?"📖 Élmény":"📖 Élmény hozzáadása")+"</button></div>":"";
  var sumS=[]; if(!zero){ var cy=String(new Date().getFullYear()); var nY=list.filter(function(t){return (t.when||"").indexOf(cy)===0;}).length;
    if(nY) sumS.push("Idén "+nY+" túrát teljesítetted.");
    if(b.up.t&&b.up.v!=null) sumS.push("A legtöbb szint a(z) „"+b.up.t.title.slice(0,28)+"” túrán volt (↑ "+p5fmtNum(b.up.v)+" m).");
    var rr=regionsOf(list).length; if(rr>=1) sumS.push(rr+" ismert helyszín/régió van a teljesítéseid közt."); }
  var ng=nextGoal(bds); var u=Store.me()||{}; var uname=(u.name||"").trim()||"Túrázó";
  var badges='<div class="p5-bgrid">'+bds.map(function(x){ var state=x.got===true?"got":(x.got===false?(x.now==null?"nod":"open"):"lock");
    return '<div class="p5-badge '+state+'"><span class="p5-bico">'+(x.got===true||x.got===false?x.icon:"🔒")+'</span><b>'+esc5(x.name)+"</b>"+
      (x.got===true?'<small class="ok">✓ megszerezted</small>':x.got===false?(x.miss?'<small class="mut">'+esc5(x.miss)+"</small>":'<small class="mut">nincs adat</small>'):"<small class=\"mut\">Még nincs elég adat.</small>")+"</div>"; }).join("")+"</div>";

  return '<div class="p5">'+
    '<section class="card panel p5-hero"><span class="p5-av">👤</span><div class="p5-ht"><h1 style="margin:0;font-size:1.35rem">👤 Saját túrázásom</h1>'+
      '<p class="muted" style="margin:.25rem 0 0">'+esc5(uname)+' · 🥾 Túrázó'+(u.city?" · "+esc5(u.city):"")+"</p>"+(u.bio?'<p class="small" style="margin:.3rem 0 0">'+esc5(u.bio)+"</p>":"")+"</div>"+
      '<button class="btn btn-ghost btn-sm" id="p5edit">✏️ Profil szerkesztése</button></section>'+
    (zero?'<section class="card panel p5-sec"><h2>Még nincs teljesített túrád.</h2><p class="muted">🥾 0 túra · 📏 0 km · ⛰️ 0 m — a statisztika csak a valódi teljesítésekből számol.</p><a class="btn btn-primary btn-sm" href="#/felfedezes">🗺️ Felfedezek egy túrát</a></section>':"")+
    '<div class="p5-grid4">'+ p5StatCard("🥾",String(st.n),"teljesített túra","#/turaim")+p5StatCard("📏",p5fmtNum(st.km)+" km","összes táv","#/turaim")+p5StatCard("⛰️",st.up?p5fmtNum(st.up)+" m":"—","összes szint")+p5StatCard("🏔️",st.maxE!=null?p5fmtNum(st.maxE)+" m":"nincs adat","legmagasabb pont")+"</div>"+
    p5Sec("📅 Éves statisztika "+ysel,yCard)+
    p5Sec("📊 Havi aktivitás", (yList.length? p5Chart(list,y):'<p class="muted">Ehhez az évhez nincs adat.</p>')+'<p class="small muted" style="margin:.5rem 0 0">🥾 túrák száma havonta — katt a tooltipre az km-ekért. Az adatok a V42 teljesítésekből jönnek.</p>')+
    p5Sec("🏆 Legjobb teljesítményeim",bb)+
    p5Sec("🗺️ Felfedezett régiók",rgHtml)+
    p5Sec("🗺️ Saját útvonalaim (V47)",p5RoutesInner())+
    p5Sec("❤️ Bakancslista · 📖 Élménykönyv · 🎒 Felszerelés", '<div class="p5-tiles">'+
      p5Tile("❤️","Bakancslista",((Store.myData().wishlist||[]).length)+" cél","#/bakancslista","❤️ Megnézem")+
      p5Tile("📖","Élménykönyv",((Store.myData().journal||[]).length)+" elmentett élmény","#/naplo","📖 Megnézem")+
      p5Tile("🎒","Felszerelésem",ownGearN()+" saját tétel","#/felszereles","🎒 Megnézem")+"</div>")+
    p5Sec("🧭 Túráim térképen",'<p class="muted small" style="margin:0 0 .4rem">A meglévő Saját térképre viszem a teljesített és tervezett túráid coords-jait.</p><a class="btn btn-soft btn-sm" href="#/terkep">🗺️ Megnyitom</a>')+
    (lastHtml? p5Sec("📖 Legutóbbi teljesített túrám",lastHtml):"")+
    p5Sec("🏆 Jelvények <small class=\"mut\">(motivációs mérföldkövek — nem hivatalos minősítés)</small>", badges)+
    (ng? '<section class="card panel p5-next"><b>🎯 Következő cél</b><p style="margin:.35rem 0 0">'+esc5(ng)+"</p></section>":"")+
    (got>=P5_BADGES.length&&list.length? '<section class="card panel p5-next"><b>🎉 Szép munka!</b><p style="margin:.35rem 0 0">Minden jelenlegi mérföldkövet teljesítetted.</p></section>':"")+
    p5Sec("🥾 Túrázási összegzés", sumS.length? '<p class="mt0">'+sumS.map(esc5).join("</p><p>")+"</p>" : '<p class="muted">Csak valódi adatból írunk — most nincs mit összefoglalni.</p>')+
    /* —— a korábbi fiók-blokk megőrizve (viszlátható link + kilépés) —— */
    '<section class="card panel p5-sec"><h2>👤 Fiók</h2><div class="p5-grid4">'+
      ["#/felszereles|🎒 Felszerelésem","#/bakancslista|❤️ Bakancslistám","#/naplo|📖 Túranaplóm","#/statisztikak|📊 Statisztikák","#/csapatok|👥 Túracsapatok","#/beallitasok|⚙️ Beállítások","#/ertesitesek|🔔 Értesítések ("+ (function(){try{return Store.notifications().length;}catch(e){return 0;}})()+")","#/turaim|🥾 Túráim"].map(function(pair){ var q=pair.split("|");
        return '<a class="quickact" href="'+q[0]+'" style="align-items:center;text-align:center"><b>'+esc5(q[1])+"</b></a>"; }).join("")+"</div>"+
      '<button class="btn btn-ghost btn-block" style="margin-top:12px" id="pf-out">🚪 Kijelentkezés</button></section>'+
  "</div>";
}
var _p5origAfter=VIEWS.profile&&VIEWS.profile.after;
VIEWS.profile=function(){ try{ if(!Store.me()) return ""; return dash("#/profil")(p5Inner()); }catch(e){ return dash("#/profil")('<section class="card panel"><h1>👤 Profil</h1><p class="muted">A profil most nem jeleníthető meg — az adataid érintetlenek.</p></section>'); } };
VIEWS.profile.after=function(root){ try{ _p5origAfter&&_p5origAfter(root); }catch(e){}
 try{ if(!root)return;
  var ys=root.querySelector("#p5year"); if(ys) ys.onchange=function(){ p5Y=ys.value; try{ App.render(); }catch(e){} };
  var ed=root.querySelector("#p5edit"); if(ed) ed.onclick=function(){ var u=Store.me()||{};
    openModal({ title:"✏️ Profil szerkesztése", body:'<label class="fld">Megjelenített név<input class="input" id="p5n" maxlength="40" value="'+esc5(u.name||"")+'"></label><label class="fld">Bemutatkozás (opcionális)<input class="input" id="p5b" maxlength="120" value="'+esc5(u.bio||"")+'"></label><p class="small muted">Profilképet a jelenlegi rendszer nem tárol — ezért nincs ilyen mező. Valódi név nem kötelező.</p>',
      footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="p5save">💾 Mentés</button>',
      onOpen:function(m){ var s=m.querySelector("#p5save"); if(s) s.onclick=function(){ var me=Store.me(); if(!me)return; var n=(m.querySelector("#p5n").value||"").trim(), bl=(m.querySelector("#p5b").value||"").trim();
        if(n)me.name=n; me.bio=bl; Store.save(); closeModal();
        var cloudSave=window.__V54&&window.__V54.api&&window.__V54.api.saveProfileFromLocal;
        if(cloudSave){ Promise.resolve(cloudSave()).then(function(){ toast("Profil mentve a fiókba","👤"); }).catch(function(){ toast("Profil helyben mentve; a felhőmentés nem sikerült","⚠️"); }).then(function(){ try{ App.render(); }catch(e){} }); }
        else { toast("Profil mentve","👤"); try{ App.render(); }catch(e){} }
      }; } }); };
  root.querySelectorAll("[data-p5route]").forEach(function(x){ x.onclick=function(){ try{ if(window.__rtopen) window.__rtopen(x.dataset.p5route,true); else NAV.to("#/utvonalak"); }catch(e){} }; });
  root.querySelectorAll("[data-p5mem]").forEach(function(b){ b.onclick=function(){ try{ var t=Store.getTour(b.dataset.p5mem); if(t&&window.openMemoryEditor) window.openMemoryEditor(t); else toast("A túra már nem érhető el","📖"); }catch(e){} }; });
 }catch(e){} };

/* ---------- dashboard mini-blokk ---------- */
(function(){ try{ var _prev=VIEWS.dash&&VIEWS.dash.after;
  VIEWS.dash.after=function(root){ try{ _prev&&_prev(root); }catch(e){}
    try{ if(!root||!root.querySelector) return; if(root.querySelector("#p50mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
      var list=doneList(); var st=agg(list); var bd=p5Badges(list,st); var got=bd.filter(function(b){return b.got===true;}).length;
      var box=document.createElement("section"); box.className="wsec"; box.id="p50mini";
      box.innerHTML='<div class="wpan p50mini"><b>👤 Saját túrázásom</b><span class="p50m1">'+st.n+" túra · "+p5fmtNum(st.km)+' km</span><span class="chip chip-green">🏆 '+got+" jelvény</span><a class=\"btn btn-soft btn-sm\" href=\"#/profil\">Profil</a></div>";
      var f9=root.querySelector("#f9mini"); if(f9&&f9.parentNode) f9.parentNode.insertBefore(box,f9.nextSibling); else w.appendChild(box);
    }catch(e){} }; }catch(e){} })();

window.__V50=1; window.__p5={doneList, agg, years, regionsOf, byM, bests, p5Badges, nextGoal};
})();

/* ==== v52 ==== */
/* ============ V52 — 🗺️ Erdélyi túra- és eseményplatform ============
   Új réteg a meglévő rendszerre: szervezői profil, események, jelentkezés.
   KAPCSOLÓDIK: V47 route (routeId), V49 extRef/f9:e dedup, V41 naptár (savedEvents+dato), V46 inbox, V41 projekt.
   Új adatsík kizárólag a Store.platform()-ban (events/organizers/participants) — NEM új túra/GPX/journal/stats rendszer.
   Valódi eseményt nem találunk ki; DEMO elemek jelöltek. */
(function(){
"use strict";
/* ---------- alapok ---------- */
function esc2(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function P(){ try{ return Store.platform(); }catch(e){ return {organizers:[],events:[],participants:[]}; } }
function nowISO(){ return new Date().toISOString(); }
function myU(){ return Store.me()||{}; }
function myId(){ var u=Store.me(); return u&&u.email? String(u.email): (u&&u.id)||""; }
function norm(s){ return String(s==null?"":s).toLowerCase().normalize? String(s).toLowerCase().replace(/\s+/g," ").trim():String(s||"").toLowerCase(); }
function fpOf(ev){ return norm(ev.name)+"|"+norm(ev.date)+"|"+norm(ev.place); }
function isOrg(){ var p=P(); return p.organizers.find(function(o){ return o.owner===myId(); })||null; }
function getEvent(id){ return P().events.find(function(x){ return x.id===id; })||null; }
function ownEvent(id){ var e=getEvent(id); var o=isOrg(); return (e&&o&&e.orgId===o.id)?e:null; }

/* ---------- DEMO események eltávolítása ---------- */
function ensureDemo(){
  var p=P(), changed=false, removed=new Set();
  p.events=(p.events||[]).filter(function(e){
    var demo=!!e.demo || String(e.id||"").indexOf("evp_demo")===0 || /^DEMO\s*[—–-]/i.test(String(e.name||""));
    if(demo){ removed.add(e.id); changed=true; return false; }
    return true;
  });
  p.participants=(p.participants||[]).filter(function(x){ return !removed.has(x.eid); });
  p.organizers=(p.organizers||[]).filter(function(o){
    var demo=!!o.demo || o.id==="org_demo" || /^DEMO\s*[—–-]/i.test(String(o.name||""));
    if(demo){ changed=true; return false; }
    return true;
  });
  p.seeded=true;
  if(changed) Store.save();
}

/* ---------- mapped pool a V49/CAT_E számára ---------- */
function counts(id){ var p=P(); var L=p.participants.filter(function(x){ return x.eid===id && x.status!=="withdrawn" && x.status!=="declined"; });
  return { pend:L.filter(function(x){return x.status==="pending";}).length, acc:L.filter(function(x){return x.status==="accepted";}).length, tot:L.length }; }
window.e2Events=function(){ ensureDemo(); var u=myU(); var o=isOrg(); try{
  var meEmail=u&&u.email; var mEmail=u&&u.email;
  return P().events.filter(function(e){ if(e.status==="draft"||e.status==="hidden"||e.demo) return false; return true; })
   .map(function(e){ var org=P().organizers.find(function(x){return x.id===e.orgId;}); var c=counts(e.id);
    return { id:"p2-"+e.id, name: e.name, date:e.date||"", time:e.time||"", place:e.place||"", diff:e.diff||"",
      org:(org?org.name:"")+ (e.community?"":(org&&!org.demo?"":"")), people:c.acc+ (e.cap?"/"+e.cap:""), km:e.km!=null?String(e.km):null, up:e.up!=null?String(e.up):null, h:e.h!=null?String(e.h):null,
      desc:(e.desc||""), src: e.sourceUrl|| (e.joinMode==="external"? (e.joinUrl||null):null), p2:e.id, source:e.source, sourceUrl:e.sourceUrl, verifiedAt:e.verifiedAt, reviewedAt:e.reviewedAt, importedAt:e.importedAt, dataStatus:e.dataStatus==="verified"?"verified":"needs_review",
      cat: e.community?"🥾 Közösségi túra":"Platform", demo:!!e.demo }; }); }catch(err){ return []; } };

/* ---------- esemény modal extrák (V49 openEventModal hívja) ---------- */
window.v52Extra=function(e){ try{ if(!e||!e.p2) return ""; var ev=getEvent(e.p2); if(!ev) return ""; var o=isOrg(); var st=myJoin(e.p2);
  var parts=[];
  if(ev.date) parts.push('<button class="btn btn-soft btn-sm" data-e2cal="'+ev.id+'">'+(savedIn(ev)?"✓ Már a naptáradban van":"📅 Naptárba")+"</button>");
  if(ev.joinMode==="internal"){ var label = !st? "👥 Jelentkezem" : st.status==="pending"?"🟠 Jelentkezés elküldve" : st.status==="accepted"?"🟢 Elfogadva" : st.status==="declined"?"🔴 Elutasítva" : "👥 Jelentkezem";
    var full = ev.cap && counts(ev.id).tot>=ev.cap && !(st&&(st.status==="pending"||st.status==="accepted"));
    parts.push(full && !st? '<span class="chip chip-rose">🔴 Betelt — nincs hely</span>' : '<button class="btn btn-ember btn-sm" data-e2join="'+ev.id+'"'+((st&&st.status!=="withdrawn")?" disabled":"")+">"+label+"</button>"+((st&&st.status!=="withdrawn")?' <button class="btn btn-ghost btn-sm" data-e2wd="'+ev.id+'">Visszavonom</button>':""));
  } else if(ev.joinMode==="external" && ev.joinUrl){ parts.push('<a class="btn btn-ember btn-sm" href="'+esc2(ev.joinUrl)+'" target="_blank" rel="noopener">🔗 Jelentkezés a szervezőnél</a><p class="small muted" style="margin:.3rem 0 0">A jelentkezést a szervező saját felületén intézed — az app nem látja a sikert.</p>'); }
  if(ev.joinMode==="none"){ parts.push('<p class="small muted" style="margin:.2rem 0 0">Ehhez az eseményhez nincs jelentkezési rendszer.</p>'); }
  if(ev.routeId){ var r=(Store.myData().routes||[]).find(function(x){return x.id===ev.routeId;});
    parts.push(r? '<button class="btn btn-soft btn-sm" data-e2route="'+ev.id+'">🗺️ Útvonal (GPX)</button>' : (ev.routeSnap? '<p class="small muted" style="margin:.2rem 0 0">🗺️ GPX útvonal: '+esc2(ev.routeSnap.name)+" · "+(ev.routeSnap.distance_km!=null?ev.routeSnap.distance_km.toFixed(1).replace(".",",")+" km":"km")+(ev.routeSnap.maxE!=null?" · ⛰️ max "+Math.round(ev.routeSnap.maxE)+" m":"")+" — a szervező saját nyomvonala (a GPX-fájlt a szervező birtokolja).</p>" : "")); }
  else parts.push('<p class="small muted" style="margin:.2rem 0 0">Ehhez az eseményhez nincs GPX útvonal.</p>');
  if(o&&ev.orgId===o.id) parts.push('<button class="btn btn-ghost btn-sm" data-e2edit="'+ev.id+'">✏️ Szerkesztés</button>');
  if(ev.status==="cancelled") parts.push('<p class="small" style="color:#b3402f;margin:.2rem 0 0">🔴 Ezt az eseményt a szervező lemondta.</p>');
  if(ev.status==="full") parts.push('<span class="chip chip-rose">🔴 Betelt</span>');
  parts.push('<p class="small muted" style="margin:.25rem 0 0">👥 '+(ev.cap? counts(ev.id).tot+" / "+ev.cap+" jelentkezett":"Nincs létszámlimit")+(ev.km!=null||ev.up!=null?"":"")+"</p>");
  return '<div class="f9cta e2x">'+parts.join("")+"</div>"; }catch(err){ return ""; } };
function rEV(id){ var e=getEvent(id); if(!e) return ""; var o=isOrg(); var st=myJoin(id); var c=counts(id); var full=e.cap&&c.tot>=e.cap; var jo="";
  if(e.joinMode==="internal"){ var label = !st? "👥 Jelentkezem" : st.status==="pending"?"🟠 Jelentkezés elküldve" : st.status==="accepted"?"🟢 Elfogadva" : st.status==="declined"?"🔴 Elutasítva" : "👥 Jelentkezem";
    jo = full && !(st&&(st.status==="pending"||st.status==="accepted")) ? '<span class="chip chip-rose">🔴 Betelt — nincs hely</span>' : '<button class="btn btn-ember btn-sm" data-e2join="'+e.id+'"'+((st&&st.status!=="withdrawn")?" disabled":"")+">"+label+"</button>"+((st&&st.status!=="withdrawn")?' <button class="btn btn-ghost btn-sm" data-e2wd="'+e.id+'">Visszavonom</button>':""); }
  else if(e.joinMode==="external"&&e.joinUrl){ jo='<a class="btn btn-ember btn-sm" href="'+esc2(e.joinUrl)+'" target="_blank" rel="noopener">🔗 Jelentkezés a szervezőnél</a>'; }
  else if(e.joinMode==="none"){ jo='<span class="small muted">Nincs jelentkezési rendszer.</span>'; }
  var cal='<button class="btn btn-soft btn-sm" data-e2cal="'+e.id+'">'+(savedIn(e)?"✓ Már a naptáradban van":"📅 Naptárba")+"</button>";
  var ed=(o&&e.orgId===o.id)?'<button class="btn btn-ghost btn-sm" data-e2edit="'+e.id+'">✏️ Szerkesztés</button>':'';
  return jo+cal+ed; }
function patchJoinBlock(eid){ var m=document.querySelector('[data-modal]'); if(!m) return; var host=m.querySelector('.e2x'); var row=host?host.previousElementSibling:null; if(!row){ }
  var act=m.querySelector('.e2x'); if(!act) return; var holder=act.querySelector('[data-e2join],[data-e2wd]'); if(!holder||!holder.parentElement) return;
  holder.parentElement.innerHTML=rEV(eid); }
function reopenEvModal(eid){ try{ if(document.querySelector("[data-modal]")){ setTimeout(function(){ try{ closeModal(); window.v49OpenEv&&window.v49OpenEv("p2-"+eid); }catch(e){} },160); } }catch(e){} }
function savedIn(ev){ var d=Store.myData(); return (d.savedEvents||[]).indexOf("p2-"+ev.id)>-1; }
function myJoin(eid){ var p=P(); return p.participants.find(function(x){ return x.eid===eid && x.uid===myId(); })||null; }

/* ---------- műveletek ---------- */
function joinEv(eid){ var ev=getEvent(eid); if(!ev||ev.status==="cancelled") { toast("Az esemény nem vár jelentkezést","🔴"); return; }
  if(ev.joinMode!=="internal"){ toast("Külső jelentkezés: a szervező linkjén intézheted","🔗"); return; }
  var ex=myJoin(eid); if(ex&&ex.status!=="withdrawn"){ toast("Már jeleztél részvételt","👥"); return; }
  if(ev.cap && counts(eid).tot>=ev.cap){ toast("🔴 Betelt — sajnos nincs több hely","👥"); return; }
  var p=P(); var row=ex; if(!row){ row={id:"pt_"+Math.random().toString(36).slice(2,8), eid:eid, uid:myId(), name:(myU().name||"Túrázó"), at:nowISO(), status:"pending"}; p.participants.push(row); }
  else { row.status="pending"; row.at=nowISO(); row.withdrewAt=null; }
  if(ev.cap && counts(eid).tot>=ev.cap){ ev.status="full"; }
  Store.save(); toast("🟠 Jelentkezés elküldve a szervezőnek","👥"); patchJoinBlock(eid); refreshHere(); }
function withdraw(eid){ var row=myJoin(eid); if(!row||row.status==="withdrawn") return; row.status="withdrawn"; row.wdAt=nowISO(); var ev=getEvent(eid); if(ev&&ev.status==="full") ev.status="published"; Store.save(); toast("Jelentkezés visszavonva","⚪"); patchJoinBlock(eid); refreshHere(); }
function addToCal(eid){ var ev=getEvent(eid); if(!ev||!ev.date) return; var d=Store.myData(); d.savedEvents=d.savedEvents||[]; var key="p2-"+eid; if(d.savedEvents.indexOf(key)>-1){ toast("✓ Már a naptáradban van","📅"); return; } d.savedEvents.push(key); Store.save(); toast("Hozzáadva a naptáradhoz","📅"); patchJoinBlock(eid); refreshHere(); }
function decide(pid,status){ var p=P(); var row=p.participants.find(function(x){return x.id===pid;}); if(!row) return; var ev=getEvent(row.eid); var o=isOrg(); if(!ev||!o||ev.orgId!==o.id){ toast("Nem vagy jogosult处理ni","🔒"); return; } if(status==="accepted"&&ev.cap&&counts(ev.id).acc>=ev.cap){ toast("Limit: nem fogadhatsz többet","🔴"); return; } row.status=status; row.decAt=nowISO(); Store.save(); try{ if(window.v53OnDecide) window.v53OnDecide(row,status,ev); }catch(e2){} toast(status==="accepted"?"🟢 Elfogadva":"🔴 Elutasítva","📋"); if(window.__e2appLast){ closeModal(); setTimeout(function(){ orgApplicants(window.__e2appLast); },150); } else refreshHere(); }
function evStatus(eid,st){ var ev=ownEvent(eid); if(!ev){ toast("Csak a saját eseményt módosíthatod","🔒"); return; } ev.status=st; Store.save(); toast({published:"Publikálva 🌐",draft:"Piszozatba véve",cancelled:"Lemondva 🛑",completed:"Lezárva ✓"}[st]||"Módosítva",st==="cancelled"?"🛑":"•"); refreshHere(); }
function changedBannerForTour(t){ try{ if(!t||!t.eventRef||String(t.eventRef).indexOf("p2-")!==0) return ""; var ev=getEvent(t.eventRef.slice(3)); if(!ev) return ""; var seen=t.evsRev; if(seen==null) { t.evsRev=ev.rev; Store.save(); return ""; } if(ev.rev>seen){ return '<div class="card panel e2note">⚠️ Az esemény adatai megváltoztak (frissítés '+ (ev.date||"") +'). A te tervedet nem írtuk át — <button class="btn btn-ghost btn-sm" id="e2sync">Frissítem a tervet</button></div>'; } return ""; }catch(e){ return ""; } }

function refreshHere(){ try{ if(document.querySelector("[data-modal]")) return; if(window.App&&App.render) App.render(); }catch(e){} }
/* ---------- GPX preview (V47 parser újrafelhasználása) ---------- */
function gpxStats(pr){ var tr=(pr&&pr.track)||[]; var st=(pr&&pr.stats)||{}; return { n:st.n||tr.length, km:st.km!=null?Math.round(st.km*10)/10:null, gain:st.gain!=null?st.gain:null, loss:st.loss!=null?st.loss:null, maxE:st.max!=null?st.max:(function(){ var m=null; tr.forEach(function(pt){ var e=pt&&pt[2]!=null?+pt[2]:null; if(e!=null&&isFinite(e)&&(m===null||e>m)) m=e; }); return m; })() }; }
function miniProfileSVG(track){ try{ var vals=(track||[]).map(function(pt){return pt&&pt.length>2?+pt[2]:null;}).filter(function(v){return v!=null&&!isNaN(v);}); if(vals.length<3) return '<p class="small muted">Elevation profilhoz nincs adat — nem becsüljük.</p>';
  var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), w=280, h=54; var pts=vals.map(function(v,i){ return (Math.round(i/(vals.length-1)*w))+","+(Math.round(h-(v-mn)/((mx-mn)||1)*(h-6)-3)); }).join(" ");
  return '<svg viewBox="0 0 '+w+" "+h+'" class="e2-prof" role="img" aria-label="Magassági profil"><polyline points="'+pts+'" fill="none" stroke="#1C4A36" stroke-width="2"/></svg><p class="small muted" style="margin:.15rem 0 0">⛰️ '+Math.round(mn)+"–"+Math.round(mx)+" m · 📍 "+vals.length+" pont (minta a teljes trackből)</p>"; }catch(e){ return ""; } }
function miniMapInto(el, track){ try{ if(!el) return; if(typeof MapKit==="undefined"||!window.L){ el.innerHTML='<p class="small muted">A térkép most nem elérhető — az útvonal adatai így is menthetők.</p>'; return; }
  var pts=(track||[]).filter(function(p){return p&&p[0]!=null&&p[1]!=null;}); if(pts.length<2){ el.innerHTML='<p class="small muted">Túl kevés pont a térképhez.</p>'; return; }
  var m=MapKit.make(el,{lat:pts[0][0],lng:pts[0][1]}); if(m){ window.L.polyline(pts.map(function(p){return [p[0],p[1]];}),{color:"#1C4A36",weight:3}).addTo(m); if(m.fitBounds) m.fitBounds(window.L.latLngBounds(pts.map(function(p){return [p[0],p[1]];}))); } }catch(e){ try{ el.innerHTML='<p class="small muted">Térkép-hiba — menthető az adat.</p>'; }catch(e2){} } }

/* ---------- esemény-űr (létrehozás/szerkesztés) ---------- */
function evForm(existing){ var e=existing||{}; var isEdit=!!existing;
  var F=function(k,v){ return '<input class="input" id="e2f_'+k+'" value="'+esc2(v==null?"":v)+'">'; };
  openModal({ title: isEdit?("✏️ Esemény szerkesztése — "+(e.name||"")):"＋ Új túraesemény",
   body:'<div class="e2form">'+
    '<label class="f">Esemény neve *</label>'+F("name",e.name)+
    '<div class="grid g2e"><div><label class="f">Dátum *</label><input class="input" id="e2f_date" type="date" value="'+esc2(e.date||"")+'"></div>'+
    '<div><label class="f">Kezdés</label><input class="input" id="e2f_time" type="time" value="'+esc2(e.time||"")+'"></div></div>'+
    '<label class="f">Helyszín *</label>'+F("place",e.place)+
    '<label class="f">Régió</label>'+F("region",e.region)+
    '<div class="grid g2e"><div><label class="f">Koordináta (lat,lng — opcionális)</label>'+F("coords",e.coords?e.coords.join(","):"")+'</div>'+
    '<div><label class="f">Nehézség</label><select class="input" id="e2f_diff"><option value="">—</option>'+["Könnyű","Közepes","Nehéz"].map(function(d){return "<option"+(e.diff===d?" selected":"")+">"+d+"</option>";}).join("")+"</select></div></div>"+
    '<div class="grid g2e"><div><label class="f">Táv (km)</label><input class="input" id="e2f_km" type="number" min="0" step="0.5" value="'+esc2(e.km!=null?e.km:"")+'"></div>'+
    '<div><label class="f">Szintemelkedés (m)</label><input class="input" id="e2f_up" type="number" min="0" step="10" value="'+esc2(e.up!=null?e.up:"")+'"></div></div>'+
    '<div class="grid g2e"><div><label class="f">Időtartam (óra)</label><input class="input" id="e2f_h" type="number" min="0" step="0.5" value="'+esc2(e.h!=null?e.h:"")+'"></div>'+
    '<div><label class="f">Max létszám (üres = nincs limit)</label><input class="input" id="e2f_cap" type="number" min="1" step="1" value="'+esc2(e.cap!=null?e.cap:"")+'"></div></div>'+
    '<label class="f">Leírás</label><textarea class="input" id="e2f_desc" rows="2">'+esc2(e.desc||"")+"</textarea>"+
    '<label class="f">Jelentkezési mód</label><select class="input" id="e2f_join"><option value="internal"'+(e.joinMode!=="external"&&e.joinMode!=="none"?" selected":"")+">A) Belső jelentkezés (kezeled a felületen)</option><option value=\"external\""+(e.joinMode==="external"?" selected":"")+">B) Külső link</option><option value=\"none\""+(e.joinMode==="none"?" selected":"")+">C) Nincs jelentkezés</option></select>"+
    '<div id="e2f_urlbox"'+(e.joinMode==="external"?"":' style="display:none"')+'><label class="f">Külső jelentkezési link</label><input class="input" id="e2f_url" value="'+esc2(e.joinUrl||"")+'" placeholder="https://…"></div>'+
    '<div style="height:.4rem"></div><label class="f">GPX (opcionális — V47 parser)</label><label class="btn btn-soft btn-sm">📂 GPX fájl kiválasztása<input type="file" accept=".gpx,application/gpx+xml" id="e2f_gpxf" style="display:none"></label>'+
    '<div id="e2f_gpxprev" class="e2-gpxprev">'+(e.routeSnap?('<p class="small mb0">🗺️ '+esc2(e.routeSnap.name||"útvonal")+' — 📏 '+(e.routeSnap.distance_km!=null?e.routeSnap.distance_km:"—")+' km · ⛰️ +'+(e.routeSnap.gain!=null?e.routeSnap.gain:"—")+' m · 🏔️ max '+(e.routeSnap.maxE!=null?Math.round(e.routeSnap.maxE):"—")+' m</p><div class="e2-pminimap" style="height:0"></div>'):(isEdit&&e.routeId?('<p class="small mb0">🗺️ GPX útvonal csatolva (útmutató a mentett útvonalakhoz).</p>'):""))+"</div>"+
    '<p class="small muted" style="margin:.5rem 0 0">⚠️ Valóságtartalom: csak olyan eseményt tölts fel, ami megrendezést nyer. Demó jelölés a rendszerben nem kérhető — a platform a TE eseményeidet mutatja.</p>'+
    '<p id="e2f_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="e2f_save">'+(isEdit?"💾 Mentés":"＋ Esemény létrehozása")+"</button>",
   onOpen:function(m){ var gpxData=m.__gpx=null;
     var js=m.querySelector("#e2f_join"); if(js) js.onchange=function(){ var u=m.querySelector("#e2f_urlbox"); if(u) u.style.display = js.value==="external"?"":"none"; };
     var fi=m.querySelector("#e2f_gpxf"); if(fi) fi.onchange=function(){ var f=fi.files&&fi.files[0]; if(!f) return; var rd=new FileReader();
       rd.onload=function(){ try{ var pr=(window.v47parseGPX?window.v47parseGPX(String(rd.result||"")):null); var box=m.querySelector("#e2f_gpxprev");
         if(!pr||pr.err||!pr.track||pr.track.length<3){ box.innerHTML='<p class="e2-err">⚠️ Hibás vagy túl rövid GPX — nem menthető útvonalként. ("Ehhez nem tudunk valós útvonalat rendelni.")</p>'; m.__gpx=null; return; }
         var st=gpxStats(pr); m.__gpx={ name:(f.name||"GPX").replace(/\.gpx$/i,"").slice(0,60), pr:pr, stats:st };
         box.innerHTML='<p class="small" style="margin:.2rem 0">🗺️ <b>'+esc2(m.__gpx.name)+'</b> · 📏 '+(st.km!=null?st.km.toFixed(1).replace(".",","):"—")+' km · ⛰️ +'+(st.gain!=null?Math.round(st.gain):"—")+' m · 🏔️ max '+(st.maxE!=null?Math.round(st.maxE):"—")+' m · 📍 '+st.n+' pont</p>'+miniProfileSVG(pr.track)+'<div class="e2-pminimap"></div>';
         miniMapInto(box.querySelector(".e2-pminimap"), pr.track);
       }catch(e){ m.__gpx=null; box.innerHTML='<p class="e2-err">⚠️ A GPX feldolgozása most nem sikerült.</p>'; } };
       rd.onerror=function(){ var box=m.querySelector("#e2f_gpxprev"); if(box) box.innerHTML='<p class="e2-err">⚠️ A fájl nem olvasható.</p>'; };
       rd.readAsText(f); };
     m.querySelector("#e2f_save").onclick=function(){ var g=function(k){ var el=m.querySelector("#e2f_"+k); return el?String(el.value||"").trim():""; };
       var name=g("name"), date=g("date"), place=g("place"); var err=m.querySelector("#e2f_err");
       if(!name||!date||!place){ if(err){ err.textContent="Kötelező: név, dátum, helyszín."; err.style.display=""; } return; }
       if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){ if(err){ err.textContent="A dátum formátuma YYYY-HH-NN legyen."; err.style.display=""; } return; }
       var o=isOrg(); if(!o){ toast("Előbb szervezői profil kell","🏢"); closeModal(); orgForm(); return; }
       var coords=null; var cg=g("coords"); if(cg){ var cs=cg.split(",").map(function(x){return parseFloat(x.replace(".", "."));}); if(cs.length===2&&!isNaN(cs[0])&&!isNaN(cs[1])&&Math.abs(cs[0])<=90&&Math.abs(cs[1])<=180) coords=[cs[0],cs[1]]; }
       var numOrNull=function(v){ var n=parseFloat(String(v).replace(",", ".")); return (v!==""&&!isNaN(n))?n:null; };
       var jmode=g("join")||"internal";
       var patch={ name:name, date:date, time:g("time")||"", place:place, region:g("region")||"", coords:coords,
         km:numOrNull(g("km")), up:numOrNull(g("up")), h:numOrNull(g("h")), diff:g("diff")||"", desc:g("desc")||"",
         joinMode:jmode, joinUrl:(jmode==="external"?(g("url")||""):""), cap:numOrNull(g("cap")) };
       if(isEdit){ var ev=ownEvent(existing.id); if(!ev) return; var keyCh=fpOf(patch)!==ev.fp;
         Object.assign(ev, patch); ev.rev=(ev.rev||0)+1; ev.updatedAt=nowISO();
         if(m.__gpx) attachGpx(ev, m.__gpx);
         if(keyCh){ var dup=P().events.find(function(x){ return x.id!==ev.id && x.fp===fpOf(ev); }); if(dup){ toast("Már van ilyen azonos esemény (név+dátum+helyszín) — a duplikátum elmentve összefűzés helyett jelzéssel","⚠️"); } }
       } else { var fp=fpOf(patch);
         var dupE=P().events.find(function(x){ return x.fp===fp; });
         if(dupE){ toast("Ez az esemény már létezik (név+dátum+helyszín egyezés) — megnyitom","♻️"); closeModal(); if(window.v49OpenEv&&dupE.status!=="hidden") window.v49OpenEv("p2:"+dupE.id); return; }
         var ev2={ id:"evp_"+Math.random().toString(36).slice(2,8), orgId:o.id, status:"published"==="x"?"draft":"draft", fp:fp, rev:0, createdAt:nowISO(), demo:false };
         Object.assign(ev2, patch); P().events.push(ev2);
         if(m.__gpx) attachGpx(ev2, m.__gpx);
         toast("Esemény létrehozva — most még PISZKOZAT. A listádból egy koppintással publikálhatod.","🗂️"); }
       Store.save(); closeModal(); refreshHere(); }; } }); }
function attachGpx(ev, g){ var d=Store.myData(); d.routes=d.routes||[]; var st=g.stats;
  function rfpOf(t){ try{ var tr=t||[]; if(!tr.length) return null; var f=tr[0], l=tr[tr.length-1]; return [f&&f[0],f&&f[1],f&&f[2],l&&l[0],l&&l[1],l&&l[2],tr.length].join("~"); }catch(e){ return null; } }
  var fpx=rfpOf(g.pr.track); var ex=fpx && d.routes.find(function(r){ return r.__fp===fpx; });
  if(ex){ ev.routeId=ex.id; ev.routeSnap={ name:ex.name, distance_km:ex.distance_km, gain:ex.elevation_gain_m, maxE:p52maxOf(ex.track), n:ex.nPts||null }; return; }
  var rid="rt_"+Math.random().toString(36).slice(2,8);
  var ps=(g.pr&&g.pr.stats)||{};
  d.routes.push({ id:rid, name:g.name, distance_km:st.km, elevation_gain_m:ps.hasEle?st.gain:null, elevation_loss_m:ps.hasEle?st.loss:null,
    max_elevation_m:ps.hasEle?ps.max:null, min_elevation_m:ps.hasEle?ps.min:null,
    start:ps.start||null, finish:ps.finish||null,
    track:g.pr.track, nPts:st.n, created_at:nowISO(), source:"gpx-import", raw:(g.pr.raw&&g.pr.raw.length<700000)?g.pr.raw:null, ownerEvent:ev.id, __fp:(function(t){ try{ var f=(t||[])[0], l=(t||[])[(t||[]).length-1]; return f&&l?[f[0],f[1],f[2],l[0],l[1],l[2],t.length].join("~"):null; }catch(e){ return null; } })(g.pr.track) });
  ev.routeId=rid; ev.routeSnap={ name:g.name, distance_km:st.km!=null?Math.round(st.km*10)/10:null, gain:st.gain!=null?Math.round(st.gain):null, maxE:st.maxE!=null?Math.round(st.maxE):null, n:st.n }; }
function p52maxOf(tr){ try{ var m=null; (tr||[]).forEach(function(p){ var e=p&&p.length>2?+p[2]:null; if(e!=null&&isFinite(e)&&(m===null||e>m)) m=e; }); return m; }catch(e){ return null; } }

/* ---------- szervezői regisztráció ---------- */
function orgForm(){ var o=isOrg(); if(o){ toast("Szervezői profilod már létezik","🏢"); return; }
  var u=myU();
  openModal({ title:"🏢 Szervezői profil létrehozása", body:
    '<div class="e2form"><label class="f">Szervező neve *</label><input class="input" id="e2o_name" value="'+esc2(u.name||"")+'" maxlength="60">'+
    '<label class="f">Rövid bemutatkozás</label><textarea class="input" id="e2o_bio" rows="2" maxlength="220"></textarea>'+
    '<div class="grid g2e"><div><label class="f">E-mail *</label><input class="input" id="e2o_mail" type="email" value="'+esc2(u.email||"")+'"></div>'+
    '<div><label class="f">Régió</label><input class="input" id="e2o_reg" value="'+esc2(u.city||"")+'"></div></div>'+
    '<div class="grid g2e"><div><label class="f">Weboldal/link (opcionális)</label><input class="input" id="e2o_web" placeholder="https://…"></div>'+
    '<div><label class="f">Telefon (opcionális)</label><input class="input" id="e2o_ph"></div></div>'+
    '<label class="f">Logó / profilkép (opcionális)</label><label class="btn btn-soft btn-sm">🖼️ Kép kiválasztása<input type="file" accept="image/*" id="e2o_logo" style="display:none"></label><p id="e2o_logoprev" class="small muted"></p>'+
    '<p class="small muted" style="margin:.4rem 0 0">Az adatok ebben a böngészőben tárolódnak — a szervezői fiók nem nyilvános regisztráció.</p><p id="e2o_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="e2o_save">🏢 Profil létrehozása</button>',
   onOpen:function(m){ var lg=m.querySelector("#e2o_logo"); m.__logo=null; if(lg) lg.onchange=function(){ var f=lg.files&&lg.files[0]; if(!f) return; if(f.size>140000){ m.querySelector("#e2o_err").textContent="A kép max ~140 KB — válassz kisebet."; m.querySelector("#e2o_err").style.display=""; return; }
     var rd=new FileReader(); rd.onload=function(){ m.__logo=String(rd.result||"").slice(0,200000); m.querySelector("#e2o_logoprev").textContent="✓ Kép kiválasztva"; }; rd.readAsDataURL(f); };
     m.querySelector("#e2o_save").onclick=function(){ var g=function(k){ var el=m.querySelector("#e2o_"+k); return el?String(el.value||"").trim():""; }; var nm=g("name"), mail=g("mail");
       if(!nm||!mail){ m.querySelector("#e2o_err").textContent="Név és e-mail kötelező."; m.querySelector("#e2o_err").style.display=""; return; }
       if(mail.indexOf("@")<1){ m.querySelector("#e2o_err").textContent="Az e-mail formátum hibás."; m.querySelector("#e2o_err").style.display=""; return; }
       var ur=g("web"); if(ur&&!/^https?:\/\//i.test(ur)) ur="https://"+ur.replace(/^\/+/,"");
       P().organizers.push({ id:"org_"+Math.random().toString(36).slice(2,8), owner:myId(), name:nm, bio:g("bio"), email:mail, web:ur, phone:g("ph"), region:g("reg"), logo:m.__logo||"", demo:false, createdAt:nowISO() });
       Store.save(); closeModal(); toast("🏢 Szervezői profil kész — hozd létre az első eseményt","🎉"); refreshHere(); }; } }); }
/* ---------- JELENTKEZŐK (csak saját esemény) ---------- */
function orgApplicants(eid){ window.__e2appLast=eid; var ev=ownEvent(eid); if(!ev){ toast("Csak a saját esemény jelentkezőit láthatod","🔒"); return; }
  var L=P().participants.filter(function(x){ return x.eid===eid; });
  function prect(x){
    var S={pending:"🟠 Elküldve",accepted:"🟢 Elfogadva",declined:"🔴 Elutasítva",withdrawn:"⚪ Visszavonta"}[x.status]||x.status;
    var act="";
    if(x.status==="pending") act='<span style="display:flex;gap:.35rem;flex-wrap:wrap"><button class="btn btn-soft btn-sm" data-e2dec="'+x.id+':accepted">Elfogad</button><button class="btn btn-ghost btn-sm" data-e2dec="'+x.id+':declined">Elutasít</button></span>';
    else if(x.status==="withdrawn") act='<span class="small muted">visszavonta — hely felszabadult</span>';
    else if(x.status==="declined") act='<button class="btn btn-ghost btn-sm" data-e2dec="'+x.id+':pending">Mégis elfogadom</button>';
    else if(x.status==="accepted") act="<span class='small'>✔</span>";
    return '<div class="e2prow"><b>'+esc2(x.name||"Túrázó")+'</b><span class="mut">'+S+" · "+esc2(String(x.at||"").slice(0,10))+"</span> "+act+"</div>";
  }
  var body = L.length ? ('<div class="e2plist">'+L.slice().sort(function(a,b){ return String(b.at).localeCompare(String(a.at)); }).map(prect).join("")+"</div>") : '<p class="muted">Még nincs jelentkező.</p>';
  openModal({ title:"📋 Jelentkezők — "+esc2(ev.name)+(ev.cap?(" ("+counts(eid).tot+"/"+ev.cap+")"):""), body:body,
    footer:'<button class="btn btn-ghost" data-close>Bezárás</button>',
    onOpen:function(m){ m.addEventListener("click",function(x){ var b=x.target.closest?x.target.closest("[data-e2dec]"):null; if(!b) return; var q=String(b.getAttribute("data-e2dec")).split(":"); decide(q[0],q[1]); }); } });
}

/* ---------- SZERVEZŐI KÖZPONT ---------- */
function szervezoHtml(){ ensureDemo(); var o=isOrg(); if(!o){
    return '<div class="e2org"><section class="card panel e2hero"><span class="e2-big">🏢</span><div><h1 style="margin:0">Szervezői központ</h1><p class="muted" style="margin:.3rem 0 0">Kovácsolj össze eseményeket, kezelj jelentkezéseket — a túrázók a Felfedezésben találják meg őket.</p><button class="btn btn-primary" id="e2-reg">🏢 Szervezőként csatlakozom</button></div></section>'+
     '<p class="small muted">A nyilvános események csak ellenőrzött, forrásmegjelölt rekordként jelennek meg.</p></div>'; }
  var evs=P().events.filter(function(e){ return e.orgId===o.id; });
  var up=evs.filter(function(e){ return e.status!=="draft" && e.status!=="completed" && e.date>=Store.todayISO(); }).sort(function(a,b){return String(a.date).localeCompare(String(b.date));});
  let done=evs.filter(function(e){ return e.status==="completed" || (e.status!=="draft" && e.date && e.date<Store.todayISO()); });
  var drafts=evs.filter(function(e){ return e.status==="draft"; });
  function row(e, edit){ var c=counts(e.id); var chip={published:"<span class='chip chip-green'>🌐 Publikus</span>",draft:"<span class='chip chip-sand'>🗂️ Piszkozat</span>",full:"<span class='chip chip-rose'>🔴 Betelt</span>",cancelled:"<span class='chip chip-rose'>🛑 Lemondva</span>",completed:"<span class='chip chip-pine'>✓ Lezárt</span>"}[e.status]||e.status;
    var btns=[]; if(e.status==="draft") btns.push("<button class='btn btn-primary btn-sm' data-e2st='"+e.id+":published'>🌐 Publikálom</button>");
    if(e.status!=="cancelled"&&e.status!=="completed") btns.push("<button class='btn btn-ghost btn-sm' data-e2st='"+e.id+":cancelled'>🛑 Lemondás</button><button class=\"btn btn-soft btn-sm\" data-e2st='"+e.id+"'>🗂️ Piszkozat</button>");
    if(e.status==="cancelled") btns.push("<button class='btn btn-soft btn-sm' data-e2st='"+e.id+"'>🗂️ Piszkozat</button>");
    if(e.status!=="cancelled") btns.push("<button class='btn btn-soft btn-sm' data-e2st='"+e.id+":completed'>✓ Lezárás</button>");
    if(e.status!=="published"){ /* full auto */ }
    btns.push("<button class='btn btn-ember btn-sm' data-e2app='"+e.id+"'>📋 Jelentkezők ("+c.tot+")</button>");
    return '<div class="e2row"><div><b>'+ (e.demo?"🧪 ":"📅 ")+esc2(e.name)+"</b><span class='mut'>"+esc2(e.date||"—")+" · "+esc2(e.place||"") + (e.km!=null?" · "+e.km+" km":"")+"</span> "+chip+"</div><div class='e2rowbtns'>"+btns.join("")+(edit&&e.status==="published"?"":"")+ (edit?"<span class='mut small'>"+(e.cap?("👥 "+c.tot+"/"+e.cap):"—")+" · </span>":"")+"<button class='btn btn-ghost btn-sm' data-e2edit='"+e.id+"'>✏️</button>"+(e.status==="full"?" <span class='chip chip-rose'>Betelt</span>":"")+"</div></div>"; }
  var stat='<div class="e2stats"><div><b>'+evs.filter(function(e){return e.status!=="draft";}).length+"</b><small>📅 esemény</small></div><div><b>"+P().participants.filter(function(x){ return evs.some(function(e){return e.id===x.eid;}); }).length+"</b><small>👥 jelentkező</small></div><div><b>"+P().participants.filter(function(x){ return evs.some(function(e){return e.id===x.eid;}) && x.status==="accepted"; }).length+"</b><small>✓ elfogadott</small></div></div>";
  return '<div class="e2org">'+
   '<section class="card panel e2hero"><span class="e2-big">'+(o.logo?"<img src=\""+esc2(o.logo)+"\" class=\"e2-logo\" alt=\"\">":"🏢")+"</span><div><h1 style=\"margin:0\">🏢 "+esc2(o.name)+"</h1><p class=\"muted\" style=\"margin:.25rem 0 0\">"+esc2(o.bio||"")+(o.region?(" · 📍 "+esc2(o.region)):"")+(o.web?(" · 🌐 <a href=\""+esc2(o.web)+"\" target=\"_blank\" rel=\"noopener\">weboldal</a>"):"")+"</p><p class=\"small\" style=\"margin:.2rem 0 0\">📅 "+evs.filter(function(e){return !e.demo;}).length+" szervezett esemény</p></div></section>"+
   p5btnish()+
   '<section class="card panel e2sec"><h2>＋ Műveletek</h2><button class="btn btn-primary" id="e2-new">＋ Új túraesemény</button>'+stat+'</section>'+ 
   '<section class="card panel e2sec"><h2>📅 Közelgő</h2>'+(up.length? up.map(function(e){return row(e,1);}).join(""):'<p class="muted">Még nincs közelgő eseményed.</p>')+"</section>"+
   '<section class="card panel e2sec"><h2>🗂️ Piszkozatok</h2>'+(drafts.length? drafts.map(function(e){return row(e,1);}).join(""):'<p class="muted">Nincs piszkozat.</p>')+"</section>"+
   '<section class="card panel e2sec"><h2>✓ Lezárult</h2>'+(done.length? done.map(function(e){return row(e,1);}).join(""):'<p class="muted">Még nincs lezárt esemény.</p>')+"</section></div>"; }
function p5btnish(){ return ""; }
var _e2orig=null;
VIEWS.szervezo = function(){ try{ ensureDemo(); return dash("#/szervezo")( szervezoHtml() ); }catch(e){ return dash("#/szervezo")('<section class="card panel"><h1>🏢 Szervezői központ</h1><p class="muted">A központ most nem érhető el — az adataid érintetlenek.</p></section>'); } };
VIEWS.szervezo.after = function(root){ try{ var reg=root.querySelector("#e2-reg"); if(reg) reg.onclick=function(){ orgForm(); }; var nw=root.querySelector("#e2-new"); if(nw) nw.onclick=function(){ if(!isOrg()){ orgForm(); return; } evForm(null); }; }catch(e){} };

/* ---------- delegált akciók (modal + lap tartalom felett) ---------- */
document.addEventListener("click", function(ev){ var b = ev.target && ev.target.closest ? ev.target.closest("[data-e2join],[data-e2wd],[data-e2cal],[data-e2route],[data-e2edit],[data-e2st],[data-e2app],[data-e2open]") : null; if(!b) return;
  var v;
  if((v=b.getAttribute("data-e2join"))){ joinEv(v); return; }
  if((v=b.getAttribute("data-e2wd"))){ withdraw(v); return; }
  if((v=b.getAttribute("data-e2cal"))){ addToCal(v); return; }
  if((v=b.getAttribute("data-e2open"))){ try{ if(window.v49OpenEv) window.v49OpenEv("p2:"+v); }catch(e){} return; }
  if((v=b.getAttribute("data-e2route"))){ var e2=getEvent(v); if(!e2) return; if(window.__rtopen && e2.routeId && (Store.myData().routes||[]).some(function(r){return r.id===e2.routeId;})){ window.__rtopen(e2.routeId,true); } else toast("Az útvonal a szervező saját GPX-listájában él — itt az összefoglaló látható.","🗺️"); return; }
  if((v=b.getAttribute("data-e2edit"))){ var ev2=ownEvent(v); if(!ev2){ toast("Csak a saját esemény szerkeszthető","🔒"); return; } closeModal(); setTimeout(function(){ evForm(ev2); },120); return; }
  if((v=b.getAttribute("data-e2st"))){ var q=String(v).split(":"); if(!ownEvent(q[0])){ toast("Nem a te eseményed","🔒"); return; } var st=q[1]||"draft"; var e3=ownEvent(q[0]); if(st==="published"&&e3.cap&&counts(e3.id).tot>=e3.cap) st="full"; evStatus(q[0],st); return; }
  if((v=b.getAttribute("data-e2app"))){ orgApplicants(v); return; } });

/* ---------- workspace figyelmeztetés: módosult esemény ---------- */
(function(){ var _pw=VIEWS.workspace&&VIEWS.workspace.after; VIEWS.workspace.after=function(root,id){ try{ _pw&&_pw(root,id); }catch(e){}
  try{ if(!root||!location.hash.startsWith("#/tura/")) return; var t=Store.getTour(id); if(!t) return; var note=changedBannerForTour(t); if(!note) return;
    var act=root.querySelector(".ws-top,.ws-actions,section.card"); if(!act||act.querySelector(".e2note")) return; var box=document.createElement("div"); box.innerHTML=note; act.parentNode.insertBefore(box, act.nextSibling); var sb=box.querySelector("#e2sync"); if(sb) sb.onclick=function(){ var eid=String(t.eventRef).slice(3); var ev=getEvent(eid); if(!ev) return;
      if(ev.name) t.title=ev.name; t.date=ev.date||t.date; t.timeHint=ev.time||t.timeHint; t.place=ev.place||t.place; if(ev.km!=null) t.lengthKm=ev.km; if(ev.up!=null) t.ascent=ev.up; if(ev.h!=null) t.durationH=ev.h; if(ev.diff) t.difficulty=ev.diff; if(ev.coords&&ev.coords.length===2) t.coords={lat:ev.coords[0],lng:ev.coords[1],name:ev.place||t.place}; t.evsRev=ev.rev; Store.save(); toast("Terv frissítve az esemény adataival","🔄"); try{ App.render(); }catch(e2){} }; }catch(e){} }; })();

/* ---------- dashboard mini blokk ---------- */
(function(){ var _pd=VIEWS.dash&&VIEWS.dash.after; VIEWS.dash.after=function(root){ try{ _pd&&_pd(root); }catch(e){}
  try{ if(!root||!root.querySelector||root.querySelector("#e2mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
    var items=[]; try{ (Store.upcoming()||[]).forEach(function(t){ if(t.date) items.push({d:t.date, t:"🥾 "+(t.title||" túra"), sub:"saját terv"}); }); }catch(e){}
    ensureDemo(); var u=myU(); var d=Store.myData(); var joined=P().participants.filter(function(x){ return x.uid===myId() && (x.status==="pending"||x.status==="accepted"); }).map(function(x){ return x.eid; });
    P().events.forEach(function(e){ if((e.status==="published"||e.status==="full") && !e.demo && e.dataStatus==="verified" && e.sourceUrl){ if(e.date && e.date>=Store.todayISO() && (joined.indexOf(e.id)>-1 || (d.savedEvents||[]).indexOf("p2:"+e.id)>-1)) items.push({d:e.date, t:"📅 "+e.name, sub:(e.place||"")}); } });
    items.sort(function(a,b){ return String(a.d).localeCompare(String(b.d)); }); if(!items.length) return;
    var box=document.createElement("section"); box.className="wsec"; box.id="e2mini";
    box.innerHTML='<div class="wpan e2mini"><b>📅 Közelgő túrák és események</b>'+items.slice(0,3).map(function(i){ return '<span class="e2minir"><small>'+esc2(i.d)+"</small><b>"+esc2(i.t.slice(0,44))+"</b><s>"+esc2(i.sub)+"</s></span>"; }).join("")+
      '<a class="btn btn-soft btn-sm" href="#/felfedezes">🗺️ Összes esemény</a></div>';
    var p50=root.querySelector("#p50mini"); if(p50&&p50.parentNode) p50.parentNode.insertBefore(box, p50.nextSibling); else w.appendChild(box); }catch(e){} }; })();

/* ---------- profil V50 blokk ---------- */
(function(){ var _pp=VIEWS.profile&&VIEWS.profile.after; VIEWS.profile.after=function(root){ try{ _pp&&_pp(root); }catch(e){}
  try{ if(root.querySelector("#e2psec")) return; var o=isOrg(); var sec=document.createElement("section"); sec.className="card panel p5-sec"; sec.id="e2psec";
    if(o){ var evs=P().events.filter(function(e){ return e.orgId===o.id && e.status!=="draft"; });
      sec.innerHTML="<h2>🏢 Szervezői profil</h2><div class=\"e2row\"><div><b>"+esc2(o.name)+"</b><span class='mut'>"+evs.length+" esemény"+(o.region?(" · 📍 "+esc2(o.region)):"")+"</span></div><a class='btn btn-soft btn-sm' href='#/szervezo'>Nyitás</a></div>"; }
    else sec.innerHTML="<h2>🏢 Szervezői profil</h2><p class=\"muted\" style=\"margin:0 0 .5rem\">Szervezőként is létrehozhatsz eseményeket — saját eseménylistával és jelentkezés-kezeléssel.</p><button class='btn btn-primary btn-sm' id='e2-preg'>🏢 Szervezői profil létrehozása</button>";
    var last=root.querySelector(".p5 > section:nth-last-child(2)"); (last&&last.nextSibling&&last.parentNode|| (last=root.querySelector(".p5"))).insertBefore(sec, last?last.nextSibling:null); if(!o){ var rr=root.querySelector("#e2-preg"); if(rr) rr.onclick=function(){ orgForm(); }; } }catch(e){} }; })();

/* ---------- nyilvános Események lap bővítése ---------- */
(function(){ var _pe=VIEWS.events, _pea=VIEWS.events&&VIEWS.events.after;
  VIEWS.events=function(){ try{ var base=_pe?_pe.apply(this,arguments):""; ensureDemo(); var today=Store.todayISO();
    var up=P().events.filter(function(e){ return (e.status==="published"||e.status==="full") && !e.demo && e.date>=today; });
    try{ up=up.concat(window.v124PendingEvents?window.v124PendingEvents():[]); }catch(e){}
    var seen={}; up=up.filter(function(e){var k=String(e.id||""); if(!k||seen[k]) return false; seen[k]=1; return true;}).sort(function(a,b){ return String(a.date).localeCompare(String(b.date)); });
    var extra='<section class="wrap pub-section tight e2pub"><div class="sect-head"><div><span class="eyeb">PLATFORM</span><h1 class="mb0" style="font-size:1.6rem">📅 Platform események</h1></div></div>'+
      (up.length? up.map(function(e){ var org=P().organizers.find(function(x){return x.id===e.orgId;}); var full=e.cap&&counts(e.id).tot>=e.cap;
        var verified=e.dataStatus==="verified"&&e.sourceUrl;
        return '<article class="card e2pcard"><b>📣 '+esc2(e.name)+'</b> <span class="chip '+(verified?'chip-green':'chip-sand')+'">'+(verified?'Ellenőrizve':'Ellenőrzés alatt')+'</span><p class="small muted mb0">'+esc2(e.date)+(e.time?(" "+e.time):"")+(e.place?(" · 📍 "+esc2(e.place)):"")+(e.km!=null?(" · "+e.km+" km"):"")+(e.up!=null?(" · +"+e.up+" m"):"")+(full?" · 🔴 Betelt":"")+'</p><p class="small">👥 '+esc2(org?org.name:(e.org||""))+'</p>'+(e.sourceUrl?'<p class="small muted">Forrás / '+(verified?'Ellenőrizve':'Ellenőrzés alatt')+': <a href="'+esc2(e.sourceUrl)+'" target="_blank" rel="noopener nofollow">'+esc2(e.source||e.sourceUrl)+'</a></p>':'')+'<div style="display:flex;gap:.45rem;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-e2open="'+e.id+'">📖 Részletek</button></div></article>'; }).join("")
       : '<p class="muted">Jelenleg nincs közzétett esemény.</p>')+"</section>";
    var footerAt=base.lastIndexOf("<footer");
    return footerAt>=0 ? base.slice(0,footerAt)+extra+base.slice(footerAt) : base+extra; }catch(e){ return _pe?_pe.apply(this,arguments):""; } };
  VIEWS.events.after=function(root){ try{ _pea&&_pea(root); }catch(e){} }; })();

/* ---------- publikus export teszteknek ---------- */
window.__V52=1; window.e2={P:P,isOrg:isOrg,getEvent:getEvent,join:joinEv,withdraw:withdraw,counts:counts,orgForm:orgForm,evForm:evForm,e2Events:window.e2Events,ensureDemo:ensureDemo,ownEvent:ownEvent,szervezoHtml:szervezoHtml};
})();

/* ==== v53 ==== */
/* ============ V53 — 👥 Túratársak és közösségi túrák ============
   Közösségi réteg a V52 platformra: profiles/connections/invites/notifs a Store.community() alatt.
   Túra-adatok: NEM duplikál — a meghívott aMEGLÉVŐ projekt résztvevője (t.participants), a közös nézet ugyanazt
   az objectet olvassa. Közösségi túra = V52 platform-esemény (community:true, projectId csatolással).
   Minden mutation guard-olt: aktuális user + owner-jog. */
(function(){
"use strict";
function esc3(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
function C(){ try{ return Store.community(); }catch(e){ return {profiles:[],connections:[],invites:[],notifs:[]}; } }
function curU(){ return Store.me(); }
function uidNow(){ var u=curU(); return u&&u.email?String(u.email):(u&&u.id)||""; }
function dataKeyOf(u){ return u.email?String(u.email):u.id; }
function profOf(uid){ return C().profiles.find(function(p){ return p.uid===uid; })||null; }
function myProf(){ return profOf(uidNow()); }
function setMyProf(patch){ var uid=uidNow(); var p=profOf(uid); if(!p){ p={ uid:uid, av:"", name:(curU().name||"Túrázó"), bio:"", types:[], regions:[], exp:"Kezdő", len:"Változó", avail:true, demo:false, createdAt:new Date().toISOString() }; C().profiles.push(p); } Object.assign(p, patch); p.availMask=(p.avail&&!p.demo)?!!(window.e2&&!0):null; Store.save(); try{ var cloudSave=window.__V54&&window.__V54.api&&window.__V54.api.saveProfileFromLocal; if(cloudSave) cloudSave().catch(function(){}); }catch(e){} return p; }
function pairKey(a,b){ return [a,b].sort().join("|"); }
function connOf(a,b){ var k=pairKey(a,b); return C().connections.find(function(x){ return x.k===k; })||null; }
function connAdd(targetUid){ var me=uidNow(); if(!targetUid||me===targetUid){ toast("Önmagad nem jelölheted","👥"); return; } var u=curU(); if(!myProf()){ setMyProf({}); }
  var ex=connOf(me,targetUid);
  if(ex && ex.status!=="none"){ toast(ex.status==="pending"?"A jelölés már elküldve 🟠":(ex.status==="accepted"?"Már túratársak lettetek 🟢":"A jelölést elutasították"), "👥"); return; }
  if(ex){ ex.status="pending"; ex.at=new Date().toISOString(); ex.req=me; }
  else C().connections.push({ id:"cn_"+Math.random().toString(36).slice(2,8), k:pairKey(me,targetUid), a:me, b:targetUid, req:me, status:"pending", at:new Date().toISOString(), demo:!!(profOf(targetUid)&&profOf(targetUid).demo) });
  c53notify(targetUid, "🔔 Új túratársi jelölés: "+(u.name||"Túrázó"), "#/tarsak", "conn-"+connOf(me,targetUid).id+"-req");
  Store.save(); toast("🟠 Jelölés elküldve","🤝"); }
function connDecide(id, status){ var cn=C().connections.find(function(x){ return x.id===id; }); if(!cn) return; var me=uidNow();
  if(cn.b!==me && cn.a!==me){ toast("Nem a te kérelmed","🔒"); return; }
  var other = cn.a===me?cn.b:cn.a;
  if(cn.status===status && status!=="none"){ toast("M már rögzítve","👥"); return; }
  cn.status=status; cn.decAt=new Date().toISOString();
  c53notify(other, status==="accepted"?"🟢 Elfogadta a jelölésedet — túratársak lettetek!":(status==="declined"?"❌ Elutasította a jelölést":"🗑 Kapcsolat eltávolítva"), "#/tarsak", "conn-"+cn.id+"-"+status+"-"+Date.now().toString().slice(-5));
  Store.save(); toast(status==="accepted"?"🟢 Túratársak lettett":(status==="declined"?"Elutasítva":"Eltávolítva"),"👥"); }
function c53notify(to, text, link, id){ if(!to||to.startsWith("DEMO")) { return; } C().notifs.push({ id: id||("n_"+Math.random().toString(36).slice(2,9)), to:to, text:text, link:link||"#/tarsak", at:new Date().toISOString(), read:false }); }
function myNotifs(){ var me=uidNow(); var c=C(); var mine=c.notifs.filter(function(n){ return n.to===me && !n.read; });
  if(mine.length>40){ c.notifs=c.notifs.filter(function(n){ return !(n.to===me && n.read); }); } return mine; }
function markNotifsRead(){ var me=uidNow(); C().notifs.forEach(function(n){ if(n.to===me) n.read=true; }); Store.save(); }
/* --- meghívók --- */
function createInvite(tourId){ var st=Store.findTourAnywhere(tourId); if(!st || !ownTour(tourId)){ toast("Csak a saját túrádhoz hozhatsz meghívót","🔒"); return null; }
  var tok="iv_"+Math.random().toString(36).slice(2,10);
  var inv={ id:"inv_"+tok.slice(3), tourId:tourId, token:tok, owner:st.owner, email:st.email, status:"active", by:uidNow(), at:new Date().toISOString() };
  C().invites.push(inv); Store.save(); toast("Meghívó link elkészült — more link: #/meghivo/"+tok, "🔗"); return inv; }
function inviteByToken(tok){ return C().invites.find(function(x){ return x.token===tok; })||null; }
function ownTour(id){ var t=Store.getTour(id); return !!(t && String((t.participants&&"")||"")==="" ? true : !!t) && !!(t); }
function joinByInvite(token){ var inv=inviteByToken(token); if(!inv){ toast("Érvénytelen vagy lejárt meghívó","🔗"); return false; }
  if(inv.status!=="active"){ toast("A meghívó már fel lett használva vagy elutasitották","👥 "); return false; }
  var st=Store.findTourAnywhere(inv.tourId); if(!st){ toast("A túra már nem érhető el","🥾"); return false; }
  var me=uidNow(), u=curU();
  var ex=(st.tour.participants||[]).find(function(p){ return p.uid===me; });
  if(ex){ ex.confirmed=true; ex.joinedAt=ex.joinedAt||new Date().toISOString(); ex.via="invite"; inv.status="accepted"; inv.uid=me;
    c53notify(inv.email||inv.owner, "👤 "+(u.name||"Túrázó")+" ismét részt vesz a(z) "+st.tour.title+" túrán", "#/tura/"+inv.tourId, "ivd-"+inv.token+"-re"); Store.save(); toast("🟢 Csatlakoztál a túrához","🥾"); return true; }
  st.tour.participants=st.tour.participants||[];
  st.tour.participants.push({ name:u.name||"Túrázó", uid:me, confirmed:true, at:new Date().toISOString(), via:"invite", role:"Résztvevő" });
  inv.status="accepted"; inv.uid=me;
  c53notify(inv.email||inv.owner, "🟢 "+(u.name||"Túrázó")+" csatlakozott a(z) "+st.tour.title+" túrához", "#/tura/"+inv.tourId, "ivd-"+inv.token+"-"+me);
  c53NotifyShared(st.tour, u); Store.save(); toast("🟢 Csatlakoztál a közös túrához — a projekt adatait látjátok","🥾"); return true; }
function declineInvite(token){ var inv=inviteByToken(token); if(!inv||inv.status!=="active") return; inv.status="declined"; inv.uid=uidNow();
  c53notify(inv.email||inv.owner, "❌ "+(curU().name||"Túrázó")+" elutasította a(z) "+ (function(){ var st=Store.findTourAnywhere(inv.tourId); return st?st.tour.title:""; })() +" meghívását", "#/tura/"+inv.tourId, "ivd-"+token+"-dec-"+Date.now().toString().slice(-4));
  Store.save(); toast("Elutasítva","⚪"); }
function leaveShared(tourId){ var me=uidNow(); var st=Store.findTourAnywhere(tourId); if(!st) return; var arr=(st.tour.participants||[]).filter(function(p){ return p.uid!==me; });
  if(arr.length!==(st.tour.participants||[]).length){ st.tour.participants=arr; c53notify(st.email||st.owner, "🚪 "+(curU().name||"Túrázó")+" kilépett a(z) "+st.tour.title+" túrából", "#/tura/"+tourId, "lv-"+tourId+"-"+me+"-"+Date.now().toString().slice(-4)); Store.save(); toast("Kiléptél a közös túrából","🚪"); } }
function c53NotifyShared(){ }
function sharedToursOfMe(){ var me=uidNow(); var out=[]; Store.allUserDataIds().forEach(function(k){ if(k===me) return; var d=Store.userDataOf(k)||{}; (d.tours||[]).forEach(function(t){ var row=(t.participants||[]).find(function(p){ return p.uid===me; }); if(row) out.push({ tour:t, owner:k, row:row }); }); }); return out; }
function memberRowOf(tourId){ var me=uidNow(); var st=Store.findTourAnywhere(tourId); if(!st) return null; var row=(st.tour.participants||[]).find(function(p){return p.uid===me;}); return row?{row:row, owner:st.owner}:null; }
function ownerOrgFor(uidEmail){ var p=Store.platform(); var o=p.organizers.find(function(x){ return x.owner===uidEmail; });
  if(!o){ o={ id:"org_"+Math.random().toString(36).slice(2,8), owner:uidEmail, name:(curU().name||"Túrázó")+" közösségi túrái", bio:"Community event publisher", region:"", web:"", phone:"", logo:"", demo:false, viaCommunity:true, createdAt:new Date().toISOString() }; p.organizers.push(o); Store.save(); } return o; }
/* --- közösségi túra publikálás a projektből --- */
function publishTour(tourId, opts){ var st=Store.findTourAnywhere(tourId); if(!st){ toast("Az esemény nem található","🥾"); return null; }
  opts=opts||{}; var cap=opts.cap?Math.max(1,parseInt(opts.cap,10)||0):null;
  var ex=Store.platform().events.find(function(e){ return e.projectId===tourId; });
  if(ex){ toast("Ezt a túrát már meghirdetted — megnyitom az eseményeid között","📢"); return ex; }
  var o=ownerOrgFor(st.email||st.owner); var t=st.tour;
  var ev={ id:"evp_"+Math.random().toString(36).slice(2,8), orgId:o.id, projectId:t.id, projectOwner:st.email||st.owner, projectOwnerKey:st.owner,
    name:t.title||"Közösségi túra", date:t.date||"", time:t.timeHint?t.timeHint.slice(0,5):(t.time||""), place:t.place||t.region||"", region:t.region||"", coords:(t.coords&&t.coords.lat)?[t.coords.lat,t.coords.lng]:null,
    km:(t.lengthKm&&isFinite(t.lengthKm)?t.lengthKm:null), up:(t.ascent!=null)?t.ascent:null, h:(t.durationH!=null)?t.durationH:null, diff:t.difficulty||"",
    desc:(t.desc||t.notes||"").slice(0,300), cap:cap, deadline:opts.deadline||"", status:"draft", joinMode:"internal", rev:0, demo:false, community:true, createdAt:new Date().toISOString() };
  if(t.routeId){ var rr=((Store.userDataOf(st.owner||st.email)||{}).routes||[]).find(function(x){ return x.id===t.routeId; });
    if(rr){ ev.routeId=rr.id; ev.routeSnap={ name:rr.name||"GPX útvonal", distance_km:rr.distance_km, gain:rr.elevation_gain_m, maxE:null, n:rr.nPts||null }; } }
  if(cap){ ev.status="draft"; }
  Store.platform().events.push(ev); Store.save(); toast("Előnézet kész — az esemény most PISZKOZAT; a Szervezői központban publikálhatod","🗂️"); return ev; }
function communityEventsOfMine(){ var me=uidNow(); var out=[]; Store.platform().events.forEach(function(e){ if(!e.community) return; var isMineOrg = (e.projectOwner && (e.projectOwner===me || (Store.userByAny(e.projectOwner)&&Store.userByAny(e.projectOwner).email===me))); var o=Store.platform().organizers.find(function(x){return x.id===e.orgId;}); if(isMineOrg || (o&&o.owner===me)) out.push(e); }); return out; }
/* --- a V52 döntés-hook: elfogadáskor résztvevővé tétel --- */
window.v53OnDecide=function(row,status,ev){ try{
  if(status==="accepted" && ev && ev.projectId){ var st=Store.findTourAnywhere(ev.projectId); if(!st) return;
    var ex=(st.tour.participants||[]).find(function(p){ return p.uid===row.uid; });
    if(!ex){ st.tour.participants=st.tour.participants||[]; st.tour.participants.push({ name:row.name||"Túrázó", uid:row.uid, confirmed:true, at:row.at||new Date().toISOString(), via:"event:"+ev.id, role:"Résztvevő" });
      c53notify(st.owner, "🟢 "+(row.name||"Túrázó")+" elfogadva és csatlakozott a közös projekthez", "#/tura/"+ev.projectId, "ea-"+row.eid+"-"+row.uid+"-"+Date.now().toString().slice(-4)); }
    c53notify(row.uid, "🟢 Elfogadta a szervező a jelentkezést — 🗓️ Megnyitom a közös túrát", "#/tura/"+ev.projectId, "ead-"+ev.id+"-"+row.uid);
    Store.save(); }
  if(status==="declined" && row){ c53notify(row.uid, "🔴 Elutasította a jelentkezést: "+ev.name, "#/felfedezes", "ed-"+ev.id+"-"+row.uid+"-"+Date.now().toString().slice(-4)); Store.save(); }
}catch(e){} };
/* ---------- DEMOprofile-ok (egyértelmű jelöléssel) ---------- */
function ensureDemo(){ var c=C(), before=c.profiles.length; c.profiles=(c.profiles||[]).filter(function(p){ return !p.demo && !/^DEMO/i.test(String(p.uid||"")) && !/^DEMO/i.test(String(p.name||"")); }); if(c.profiles.length!==before){ c.connections=(c.connections||[]).filter(function(x){ return !/^DEMO/i.test(String(x.a||"")) && !/^DEMO/i.test(String(x.b||"")); }); Store.save(); } }
function typeOpts(){ return ["Körös túra","Gerinctúra","Kilátás","Vízesés","Sátoros","Teljesítménytúra","Családi"]; }
function userStats(uid){ try{ var d=Store.userDataOf(uid)||{}; var tours=d.tours||[]; var j=d.journal||[];
  var done=tours.filter(function(t){ return t.status==="teljesítve"||t.status==="archiválva"; });
  var km=0,up=0; done.forEach(function(t){ var jr=(j||[]).find(function(x){return x.tourId===t.id;}); var k=jr?+jr.km:+t.lengthKm; var u=jr?+jr.up:+t.ascent; if(isFinite(k)&&k>0)km+=k; if(isFinite(u)&&u>0)up+=u; });
  var bd=0; try{ if(window.__p5){ var dl=window.__p5.doneList(); var st=window.__p5.agg(dl); bd=window.__p5.p5Badges(dl,st).filter(function(b){return b.got===true;}).length; } }catch(e2){}
  return { tours:done.length, km:Math.round(km), up:Math.round(up), badges:bd }; }catch(e){ return {tours:0,km:0,up:0,badges:0}; } }
function myId(){ return uidNow(); }
function renderCard(p){ var me=myId(); var s=pairStatus(me,p.uid); var btn="";
  if(s==="none"||s==="declined") btn='<button class="btn btn-primary btn-sm" data-c53add="'+p.uid+'">👥 Túratársnak jelölöm</button>'+(s==="declined"?' <span class="chip chip-rose">❌ Elutasítva</span>':"");
  else if(s==="pending"){ var cn=connOf(me,p.uid); btn = (cn.req===me)? '<span class="chip chip-amber">🟠 Jelölés elküldve</span> <button class="btn btn-ghost btn-sm" data-c53dec="'+cn.id+':none">⚪ Visszavonom</button>'
    : '<button class="btn btn-soft btn-sm" data-c53dec="'+cn.id+':accepted">🟢 Elfogadom</button> <button class="btn btn-ghost btn-sm" data-c53dec="'+cn.id+':declined">❌ Elutasítom</button>'; }
  else btn='<span class="chip chip-green">🟢 Túratársak</span> <button class="btn btn-ghost btn-sm" data-c53dec="'+connOf(me,p.uid).id+':none">Kapcsolat törlése</button>';
  var s2=userStats(p.uid);
  return '<article class="f9card card c53card"><div class="f9-b"><div class="f9-t1">'+(p.av?'<img src="'+esc3(p.av)+'" class="c53-av img" alt="">':'<span class="c53-av">'+esc3((p.name||"T").charAt(0))+"</span>")
    +"<b>"+esc3(p.name||"Túrázó")+"</b>"+((p.regions||[]).map(function(r){return '<span class="chip chip-sand">📍 '+esc3(r)+"</span>";}).join(""))
    +"</div><p class=\"small muted mb0\">🥾 "+s2.tours+" túra · 📏 "+s2.km+" km · ⛰️ "+s2.up+" m"+(s2.badges?" · 🏆 "+s2.badges:"")+((p.exp)?(" · 🎓 "+esc3(p.exp)):"")+((p.len)?(" · ⏱ "+esc3(p.len)):"")+(p.avail?" · 🟢 elérhető":" · ⚪ most nem")+"</p>"
    +'<p class="small mb0">'+((p.types||[]).map(function(t){return '<span class="chip chip-green">'+esc3(t)+"</span>";}).join(" ")||"")+"</p>"
    +'<div class="f9cta">'+btn+"</div></div></article>"; }
function pairStatus(a,b){ var cn=connOf(a,b); return cn?cn.status:"none"; }
function c53Inner(){ ensureDemo(); var u=curU(); var me=myId(); var P5=myProf();
  var myC=C().connections.filter(function(x){ return x.a===me||x.b===me; });
  var friends=myC.filter(function(x){return x.status==="accepted";});
  var sent=myC.filter(function(x){return x.status==="pending";});
  var pool=C().profiles.filter(function(p){ return p.uid!==me; });
  var html='<div class="c53"><section class="card panel p5-hero"><span class="p5-av">'+(P5&&P5.av?'<img src="'+esc3(P5.av)+'" class="c53-av img" alt="">':"👤")+'</span><div class="p5-ht"><h1 style="margin:0;font-size:1.3rem">👥 Túratársak</h1><p class="muted" style="margin:.25rem 0 0">'+esc3(P5?P5.name:(u.name||"Túrázó"))+" · "+friends.length+" túratárs · "+sent.length+" függő"+(myNotifs().length?" · 🔔 "+myNotifs().length+" értesítés":"")+"</p></div>"+
    '<button class="btn btn-ghost btn-sm" id="c53-editprof">'+(P5?"✏️ Közösségi profil":"👤 Közösségi profil létrehozása")+"</button></section>";
  html+='<div class="c53-tools"><input class="input" id="c53-q" placeholder="🔎 Keress túrázót (név, régió, típus)…">'
    +'<select class="input" id="c53-reg"><option value="">📍 Régió: minden</option>'+pool.map(function(p){return p.regions||[];}).join(",").split(",").map(function(x){return x.trim();}).filter(function(v,i,a){return v&&a.indexOf(v)===i;}).map(function(r){return '<option>'+esc3(r)+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-exp"><option value="">🎓 Tapasztalat</option>'+["Kezdő","Közepes","Haladó"].map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-len"><option value="">⏱ Hossz</option>'+["Egynapos","Többnapos","Változó"].map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<select class="input" id="c53-type"><option value="">🥾 Típus</option>'+typeOpts().map(function(x){return "<option>"+x+"</option>";}).join("")+"</select>"
    +'<label class="c53-chk"><input type="checkbox" id="c53-avail" style="width:auto"> csak elérhető</label></div>'
    +'<div id="c53-list">'+ (pool.length? pool.map(renderCard).join("") : '<p class="muted">Nincs még megjeleníthető profil — hozz létre közösségi profilt, majd jelölj másokat.</p>')+"</div>";
  var inc=C().connections.filter(function(cn){ return (cn.a===me||cn.b===me) && cn.status==="pending" && cn.req!==me; });
  var pf={}; C().profiles.forEach(function(p){ pf[p.uid]=p.name; });
  html+='<section class="card panel c53-sec"><h2>📩 Bejövő jelölések</h2>'+ (inc.length? '<div class="c53-rows">'+ inc.map(function(cn){ var other=cn.a===me?cn.b:cn.a;
    return '<div class="e2row"><div><b>'+esc3(pf[other]||other)+"</b><span class='mut'>🟠 jelölést küldött</span></div><div class='e2rowbtns'><button class='btn btn-soft btn-sm' data-c53dec=\""+cn.id+":accepted\">🟢 Elfogadom</button><button class='btn btn-ghost btn-sm' data-c53dec=\""+cn.id+":declined\\\">❌ Elutasítom</button></div></div>"; }).join("")+"</div>" : '<p class="muted small mb0">Nincs bejövő jelölésed.</p>')+"</section>";
  var mines=sharedToursOfMe();
  if(mines.length) html+='<section class="card panel c53-sec"><h2>🤝 Közös túráim</h2>'+ mines.slice(0,4).map(function(x){ var od=Store.userDataOf(x.owner)||{}; var un=(Store.userByAny(x.owner)||{}).name||x.owner;
    return '<div class="e2row"><div><b>🥾 '+esc3(x.tour.title||"Túra")+"</b><span class='mut'>👑 "+esc3(un)+((x.tour.date)?(" · "+esc3(x.tour.date)):"")+"</span></div><div class='e2rowbtns'><a class='btn btn-soft btn-sm' href='#/tura/"+x.tour.id+"'>Megnyitom</a><button class='btn btn-ghost btn-sm' data-c53leave='"+x.tour.id+"'>🚪 Kilépek</button></div></div>"; }).join("")+"</section>";
  return html+"</div>"; }
VIEWS.tarsak=function(){ try{ if(!curU()) return dash("#/tarsak")('<div class="empty"><h3>JEentkezz be a túratársakhoz</h3><a class="btn btn-primary" href="#/belepes">Belépés</a></div>'); return dash("#/tarsak")(c53Inner()); }catch(e){ return dash("#/tarsak")('<section class="card panel"><h1>👥 Túratársak</h1><p class="muted">A nézet most nem érhető el — az adataid érintetlenek.</p></section>'); } };
VIEWS.tarsak.after=function(root){ try{ var me=myId();
  function rf(){ var l=root.querySelector("#c53-list"); if(!l) return; var pool=C().profiles.filter(function(p){ return p.uid!==me; });
    var qq=(root.querySelector("#c53-q").value||"").toLowerCase().trim();
    var rg=root.querySelector("#c53-reg").value; var ex=root.querySelector("#c53-exp").value; var ln=root.querySelector("#c53-len").value; var ty=root.querySelector("#c53-type").value; var av=root.querySelector("#c53-avail").checked;
    var fr=pool.filter(function(p){ if(qq && String((p.name||"")+" "+((p.regions||[]).join(" "))+" "+((p.types||[]).join(" "))).toLowerCase().indexOf(qq)<0) return false;
      if(rg && (p.regions||[]).indexOf(rg)<0) return false; if(ex && p.exp!==ex) return false; if(ln && p.len!==ln) return false;
      if(ty && (p.types||[]).indexOf(ty)<0) return false; if(av && !p.avail) return false; return true; });
    l.innerHTML= fr.length? fr.map(renderCard).join("") : '<div class="empty"><span class="em-ico">🔎</span><h3>Nincs találat</h3><p class="muted">Nincs a szűrőnek megfelelő profil.</p></div>'; }
  ["c53-q","c53-reg","c53-exp","c53-len","c53-type"].forEach(function(idd){ var elx=root.querySelector("#"+idd); if(elx){ elx.oninput=rf; elx.onchange=rf; } });
  var ack=root.querySelector("#c53-avail"); if(ack) ack.onchange=rf;
  var ep=root.querySelector("#c53-editprof"); if(ep) ep.onclick=function(){ profForm(); }; }catch(e){} };
function profForm(){ var P5=myProf()||{}; var u=curU();
  openModal({ title:"👤 Közösségi profil", body:'<div class="e2form"><label class="f">Megjelenített név *</label><input class="input" id="pr_n" maxlength="40" value="'+esc3(P5.name||u.name||"Túrázó")+'">'+
   '<label class="f">Rövid bemutatkozás</label><textarea class="input" id="pr_b" rows="2">'+esc3(P5.bio||"")+"</textarea>"+
   '<label class="f">Profilkép (opcionális)</label><label class="btn btn-soft btn-sm">🖼️ Kép<input type="file" accept="image/*" id="pr_avf" style="display:none"></label><p id="pr_avmsg" class="small muted">'+(P5.av?"✓ Van kép":"nincs")+"</p>"+
   '<label class="f">Kedvenc túratípusok</label><div class="chips">'+typeOpts().map(function(t){ var on=(P5.types||[]).indexOf(t)>-1; return '<button type="button" class="f-pill'+(on?" on":"")+'" data-prt="'+t+'">'+t+"</button>"; }).join("")+"</div>"+
   '<label class="f">Kedvenc régiók (vesszővel)</label><input class="input" id="pr_r" value="'+esc3((P5.regions||[]).join(", "))+'">'+
   '<div class="grid g2e"><div><label class="f">Tapaszlalati szint</label><select class="input" id="pr_exp">'+["Kezdő","Közepes","Haladó"].map(function(x){return '<option'+((P5.exp||"Kezdő")===x?" selected":"")+">"+x+"</option>";}).join("")+"</select></div>"+
   '<div><label class="f">Túrahossz</label><select class="input" id="pr_len">'+["Egynapos","Többnapos","Változó"].map(function(x){return '<option'+((P5.len||"Változó")===x?" selected":"")+">"+x+"</option>";}).join("")+"</select></div></div>"+
   '<label class="f">Elérhetőség</label><select class="input" id="pr_av">'+["Igen","Most nem"].map(function(x){return '<option'+((P5.avail!==false)?"Igen":"Most nem")===x?" selected":""+">"+x+"</option>";}).join("")+"</select>"+
   '<p class="small muted mt0 mb0">A statisztika a V50 profilból jön, nem írható itt.</p><p id="pr_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="pr_save">💾 Mentés</button>',
   onOpen:function(m){ var cur=myProf()||{}; m.__av=cur.av||null;
     m.querySelectorAll("[data-prt]").forEach(function(bt){ bt.onclick=function(){ bt.classList.toggle("on"); }; });
     m.querySelector("#pr_avf").onchange=function(){ var f=this.files&&this.files[0]; if(!f) return; if(f.size>120000){ var er=m.querySelector("#pr_err"); er.textContent="A kép max ~120 KB."; er.style.display=""; return; }
       var rd=new FileReader(); rd.onload=function(){ m.__av=String(rd.result||"").slice(0,180000); m.querySelector("#pr_avmsg").textContent="✓ kiválasztva"; }; rd.readAsDataURL(f); };
     m.querySelector("#pr_save").onclick=function(){ var v=function(id){ var e=m.querySelector(id); return e?String(e.value||"").trim():""; }; var nm=v("#pr_n");
       if(!nm){ var er2=m.querySelector("#pr_err"); er2.textContent="A név kötelező."; er2.style.display=""; return; }
       var types=[]; m.querySelectorAll("[data-prt].on").forEach(function(x){ types.push(String(x.getAttribute("data-prt"))); });
       var regs=v("#pr_r").split(/[,;]/).map(function(x){return x.trim();}).filter(Boolean);
       setMyProf({ name:nm, bio:v("#pr_b"), types:types, regions:regs, exp:v("#pr_exp"), len:v("#pr_len"), avail:v("#pr_av")==="Igen", av:m.__av||"" });
       closeModal(); toast("👤 Közösségi profil mentve","🤝"); try{ App.render(); }catch(e){} }; } }); }
/* ---------- MEGHÍVÓ nézet (link nyitó) ---------- */
function invInner(tok){ var inv=inviteByToken(tok);
  if(!inv) return '<section class="card panel"><h1>🔗 Érvénytelen vagy lejárt link</h1><p class="muted">A meghívó nem található — kérd el újra a szervezőtől, vagy használd a 🗺️ Felfedezést.</p><a class="btn btn-primary" href="#/tarsak">👥 Túratársak</a></section>';
  var st=Store.findTourAnywhere(inv.tourId); var t=st&&st.tour; var me=myId(); var u=curU();
  if(!t) return '<section class="card panel"><h1>🥾 A túra már nem érhető el</h1><a class="btn btn-soft" href="#/tarsak">👥 Túratársak</a></section>';
  
  var ownerLabel=(function(){ var uu=Store.userByAny(st.owner)||Store.userByAny(st.email); return (uu&&uu.name)||"Szervező"; })();
  var joined=(t.participants||[]).some(function(p){ return p.uid===me; });
  if(String(st.email)===String(me)||st.owner===me) return '<section class="card panel c53-inv"><h1>🔗 Meghívó</h1><p class="muted">Ez a te saját túrád — a résztvevőket a projekt 👥 fülén kezelheted.</p><a class="btn btn-primary" href="#/tura/'+t.id+'">🥾 A túrához</a></section>';
  return '<section class="card panel c53-inv"><h1>🥾 '+esc3(t.title||"Közösségi túra")+"</h1>"+
    '<p class="muted mt0">👑 Szervező: '+esc3(ownerLabel)+(t.date? ' · 📅 '+esc3(t.date):"")+(t.place? ' · 📍 '+esc3(t.place):"")+(t.lengthKm? ' · 📏 '+t.lengthKm+" km":"")+(t.ascent? ' · ⛰️ +'+t.ascent+" m":"")+"</p>"+
    (joined? '<p class="chip chip-green">🟢 Már részt veszel</p><a class="btn btn-soft" href="#/tura/'+t.id+'">🗓️ Megnyitom a közös túrát</a>' :
      '<p class="muted small">'+(inv.status==="declined"?"❌ Korábban elutasítottad — de most csatlakozhatsz.":(inv.status==="accepted"?"🟢 Elfogadva — nyisd meg a közös túrát.":"🟠 Meghívtak erre a konkrét túrára."))+"</p>"+
      '<div class="f9cta"><a class="btn btn-primary btn-sm" href="#/tura/'+t.id+'" id="c53-inv-go" target="_self">👥 Csatlakozom és megnyitom</a> <button class="btn btn-ghost btn-sm" id="c53-inv-dec">❌ Elutasítom</button></div>')+
    '<p class="small muted mt0">🔒 Ez a link kizárólag ehhez a túrához ('+esc3(t.title||"")+') tartozik — másik projekthez nem használható.</p></section>'; }
var _invTok="";
VIEWS.meghivo=function(a){ try{ _invTok=(a&&a.token)||hashToken()||""; return dash("#/meghivo")(invInner(_invTok)); }catch(e){ return dash("#/meghivo")("<section class=\"card panel\"><h1>🔗 Hiba</h1></section>"); } };
VIEWS.meghivo.after=function(root){ try{ var go=root.querySelector("#c53-inv-go"); if(go) go.onclick=function(e){ e.preventDefault(); if(joinByInvite(hashToken())) { setTimeout(function(){ try{ App.render(); }catch(e2){} },300); } };
  var dc=root.querySelector("#c53-inv-dec"); if(dc) dc.onclick=function(){ declineInvite(hashToken()); try{ App.render(); }catch(e){} }; }catch(e){} };
function hashToken(){ var h=location.hash||""; var m=h.match(/#\/meghivo\/([A-Za-z0-9_]+)/); return m?m[1]:""; }
/* ---------- MEGOSZTOTt project view: ha nem a mi túránk, de résztvevők vagyunk ---------- */
function memberStats(t){ return { n:(t.participants||[]).filter(function(p){return p.confirmed;}).length }; }
function sharedView(t, ownerId, row){ var od=Store.userDataOf(ownerId)||{}; var uu=Store.userByAny(ownerId)||{}; var ownerName=uu.name||"Szervező";
  var rr=(od.routes||[]).find(function(x){ return x.id===t.routeId; });
  var tl=(t.timeline||[]).map(function(p){ return "<li>"+esc3(p.t||p.time||"")+" — "+esc3(p.act||p.name||"")+"</li>"; }).join("");
  var tasks=(t.tasks||[]).map(function(k){ var host=k.host?esc3(k.host):"—"; return '<div class="e2row"><div><b>'+(k.done?"✅ ":"⬜ ")+esc3(k.t||k.title||"")+'</b></div><span class="mut">👤 '+host+"</span></div>"; }).join("");
  var gearAll=(t.gear||[]); var food=(t.food||[]); var bud=(t.budget||[]);
  return '<div class="wrap" style="padding-top:16px"><section class="card panel c53-share"><span class="chip chip-sand">👤 Meghívottként nézed — READ-ONLY</span>'+
   '<h1 style="margin:.2rem 0">🥾 '+esc3(t.title||"Túra")+'</h1><p class="muted mt0" style="margin:.2rem 0 0">👑 Szervező: '+esc3(ownerName)+(t.date? " · 📅 "+esc3(t.date):"")+(t.place? " · 📍 "+esc3(t.place):"")+(t.lengthKm? " · 📏 "+t.lengthKm+" km":"")+(t.ascent? " · ⛰️ +"+t.ascent+" m":"")+(t.difficulty? " · 🥾 "+esc3(t.difficulty):"")+"</p>"+
   '<div class="f9cta"><a class="btn btn-soft btn-sm" href="#/tarsak">👥 Túratársak</a> <button class="btn btn-ghost btn-sm" id="cx53-leave" data-t="'+t.id+'">🚪 Kilépek</button></div></section>'+
   '<div class="p5-grid4">'+p5statish("👥", memberStats(t).n+" fő","létszám")+p5statish("⏱",(t.durationH||"—")+" ó","időtartam")+p5statish("🥾",esc3(t.difficulty||"—"),"nehézség")+(rr? p5statish("🗺️","GPX","útvonal csatolva"):"")+"</div>"+
   (rr? '<section class="card panel c53-sec"><h2>🗺️ Útvonal (a szervező GPX-e)</h2><p class="small muted mb0">'+esc3(rr.name||"GPX")+" · 📏 "+(rr.distance_km||"?")+" km · ⛰️ +"+(rr.elevation_gain_m||"?")+" m</p></section>":"")+
   ((t.noteStream||[]).length? '<section class="card panel c53-sec"><h2>📝 Jegyzetek</h2><ul class="c53-note">'+ (t.noteStream||[]).slice(-8).map(function(nn){ return '<li>'+esc3(nn.text||nn.note||"")+"</li>"; }).join("")+"</ul></section>":"")+
   ((t.timeline||[]).length? '<section class="card panel c53-sec"><h2>⏱ Időterv</h2><ol class="c53-note">'+tl+"</ol></section>":"")+
   (tasks? '<section class="card panel c53-sec"><h2>✅ Teendők (gazdákkal)</h2>'+tasks+"</section>":"")+
   (gearAll.length? '<section class="card panel c53-sec"><h2>🎒 Felszerelés</h2><div class="chips">'+gearAll.map(function(g){ return '<span class="chip">'+(g.checked?"🎒":"🎒")+" "+esc3(g.name||"")+"</span>"; }).join("")+"</div></section>":"")+
   (food.length? '<section class="card panel c53-sec"><h2>💧 Étel-víz</h2><div class="chips">'+food.map(function(f){ return '<span class="chip">'+esc3(f.n||f.name||"")+"</span>"; }).join("")+"</div></section>":"")+
   (bud.length? '<section class="card panel c53-sec"><h2>💶 Költségek</h2><div class="c53-rows">'+bud.map(function(b){ return '<div class="e2row"><span>'+esc3(b.item||b.n||"")+"</span><b>"+(b.cost||b.sum||"—")+"</b></div>"; }).join("")+"</div></section>":"")+
   '<section class="card panel c53-sec"><h2>👥 Résztvevők</h2><div class="c53-rows">'+(t.participants||[]).map(function(p){ return '<div class="e2row"><div><b>'+esc3(p.name||"Túrázó")+(p.uid===ownerId?" 👑":"")+"</b></div><span class='mut'>"+(p.confirmed?"🟢":"🟠")+(p.via?" · "+esc3(p.via):"")+"</span></div>"; }).join("")+"</div></section></div>"; }
function p5statish(ic,v,l){ return '<div class="p5-stat"><b class="p5-sv">'+ic+" "+v+'</b><small class="p5-sl">'+l+"</small></div>"; }
var _wsOrigFn=VIEWS.workspace, _wsOrigAfter=_wsOrigFn&&_wsOrigFn.after;
VIEWS.workspace=function(a){ try{ if(!Store.getTour(a)) { var mm=memberRowOf(a); if(mm) return '<main class="wrap">'+sharedView(Store.findTourAnywhere(a).tour, mm.owner, mm.row)+"</main>"; } }catch(e){}
  var base=_wsOrigFn?_wsOrigFn.apply(this,arguments):"";
  try{ if(Store.getTour(a)) { var extra=c53ActionsOn(a); if(base.indexOf('class="dash-main">')>-1) base=base.replace('class="dash-main">','class="dash-main">'+extra); else base = base.replace('</main>', extra+'</main>'); } }catch(e){}
  return base; };
VIEWS.workspace.after=function(root,id){ try{ _wsOrigAfter&&_wsOrigAfter(root,id); }catch(e){}
  try{ if(!root) return;
    var lw=root.querySelector("#cx53-leave"); if(lw) lw.onclick=function(){ leaveShared(lw.dataset.t); location.hash="#/tarsak"; };
    var ib=root.querySelector("#c53-invite"); if(ib) ib.onclick=function(){ var inv=createInvite(id); if(!inv) return; copyLink(inv); };
    var hc=root.querySelector("#c53-hosts"); if(hc) hc.onclick=function(){ hostModal(id); };
    var pb=root.querySelector("#c53-publish"); if(pb) pb.onclick=function(){ publishModal(id); };
    var pp2=root.querySelector("#c53-publish-open"); if(pp2) pp2.onclick=function(){ try{ var e2=Store.platform().events.find(function(x){ return x.projectId===id; }); if(e2&&window.v49OpenEv) window.v49OpenEv("p2-"+e2.id); }catch(e){} };
  }catch(e){} };
function c53Actions(id){ var mine=Store.getTour(id); if(!mine) return "";
  return '<div class="c53-own"><span class="chip chip-green">👑 Szervező vagy</span> <button class="btn btn-soft btn-sm" id="c53-invite">🔗 Meghívó link</button> <button class="btn btn-soft btn-sm" id="c53-hosts">👤 Gazdák</button> <button class="btn btn-ember btn-sm" id="c53-publish">📢 Meghirdetem</button></div>'; }
function c53ActionsOn(id){ return c53Actions(id); }
function copyLink(inv){ var url=location.origin+location.pathname+"#/meghivo/"+inv.token; var done=false;
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url); done=true; } }catch(e){}
  toast(done?"Meghívó link kimásolva":"Link: #/meghivo/"+inv.token,"🔗"); }
function hostModal(id){ var t=Store.getTour(id); if(!t) return; if(!((t.participants||[]).length|| true)){}
  var ppl=[{uid:null,name:"👑 Szervező (te)"}].concat((t.participants||[]).map(function(p){ return {uid:p.uid,name:p.name||"Túrázó"}; }));
  var list=(t.tasks||[]).slice();
  openModal({ title:"👤 Feladat- és eszköz gazdák", body:'<p class="small muted mt0">Meglévő teendők — ki ért hozzájuk. A rendszer nem új feladatot, a meglévő gazdát állítja.</p><div class="c53-hosts">'+ list.map(function(k,i){ return '<div class="c53-hostrow"><b>'+esc3(k.t||k.title||"Teendő")+"</b><select class=\"input\" data-hhost=\""+i+'"><option value="">gazda nélkül</option>'+ppl.map(function(p){ var val=String(p.uid||""); return '<option value="'+esc3(val)+'"'+(String(k.host)===val?" selected":"")+">"+esc3(p.name)+"</option>"; }).join("")+"</select></div>"; }).join("")+"</div>",
   footer:'<button class="btn btn-ghost" data-close>Mégse</button> <button class="btn btn-primary" id="c53-hostsave">💾 Mentés</button>',
   onOpen:function(m){ m.querySelector("#c53-hostsave").onclick=function(){        var idxs=m.querySelectorAll("[data-hhost]"); for(var i=0;i<idxs.length;i++){ var sel=idxs[i]; var ki=+sel.getAttribute("data-hhost"); var tv=sel.value;
         var person=ppl.find(function(pp){ return String(pp.uid||"")===String(tv); }); t.tasks[ki].host=person?person.name:""; t.tasks[ki].hostUid=person?person.uid:null; }
       Store.save(); toast("Gazdák elmentve","👤"); closeModal(); try{ App.render(); }catch(e){} }; } }); }
function publishModal(id){ var t=Store.getTour(id); if(!t) return; var ex=Store.platform().events.find(function(e){ return e.projectId===id; });
  if(ex){ openModal({ title:"📢 Meghirdetve", body:'<p class="muted mt0">Ezt a túrát már meghirdetted — '+esc3(ex.name)+".</p>", footer:'<button class="btn btn-ghost" data-close>Bezár</button> <button class="btn btn-primary" id="c53-p-open">🗓️ Az esemény</button>', onOpen:function(m){ var o=m.querySelector("#c53-p-open"); if(o) o.onclick=function(){ try{ if(window.v49OpenEv) window.v49OpenEv("p2-"+ex.id); }catch(e){} closeModal(); }; } }); return; }
  openModal({ title:"📢 Túra meghirdetése — előnézet", body:
    '<div class="e2form"><p class="small muted mt0">A projekt adataiból készülő <b>közösségi túra</b>, mint V52 esemény (piszkozatban indul — a Szervezői központban publikálod).</p>'+
    '<label class="f">Cím *</label><input class="input" id="pv_t" value="'+esc3(t.title||"")+'">'+
    '<div class="grid g2e"><div><label class="f">Dátum</label><input class="input" id="pv_d" value="'+esc3(t.date||"")+'"></div><div><label class="f">Helyszín</label><input class="input" id="pv_p" value="'+esc3(t.place||"")+'"></div>'+
    '<div><label class="f">Km</label><input class="input" id="pv_km" value="'+esc3(t.lengthKm||"")+'"></div><div><label class="f">Szint</label><input class="input" id="pv_up" value="'+esc3(t.ascent||"")+'"></div>'+
    '<div><label class="f">Max létszám</label><input class="input" id="pv_cap" type="number" min="1" placeholder="nincs limit"></div><div><label class="f">Jelentkezési határidő</label><input class="input" id="pv_dl" type="date"></div></div>'+
    '<label class="f">Rövid leírás</label><textarea class="input" id="pv_ds" rows="2">'+esc3((t.desc||"").slice(0,240))+"</textarea>"+
    ((t.routeId)?"<p class='small muted'>🗺️ GPX útvonal csatolva az előnézethez.</p>":"<p class='small muted'>🗺️ Nincs GPX útvonal — a jelentkezők nem látnak ilyet.</p>")+
    '<p id="pv_err" class="e2-err" style="display:none"></p></div>',
   footer:'<button class="btn btn-ghost" data-close>Mégse (nem publikál)</button> <button class="btn btn-primary" id="pv_go">📢 Előnézetből létrehozás (piszkozat)</button>',
   onOpen:function(m){ m.querySelector("#pv_go").onclick=function(){ var v=function(id2){ var e=m.querySelector(id2); return e?String(e.value||"").trim():""; };
     var cap=v("#pv_cap"); var t2=Store.getTour(id); if(!t2) return;
     t2.title=v("#pv_t"); t2.date=v("#pv_d"); t2.place=v("#pv_p");
     if(!t2.title){ var er=m.querySelector("#pv_err"); er.textContent="Cím kötelező."; er.style.display=""; return; }
     var ev=publishTour(id,{ cap:cap?parseInt(cap,10):null, deadline:v("#pv_dl") }); if(ev){ closeModal(); toast("🗂️ Közösségi esemény piszkozat létrehozva — a Szervezői központban publikálhatod","📢"); try{ App.render(); }catch(e){} } }; } }); }
/* ---------- delegált akciók ---------- */
var _doc=document;
_doc.addEventListener("click", function(evt){ try{ var b=evt.target&&evt.target.closest?evt.target.closest("[data-c53add],[data-c53dec],[data-c53leave]"):null; if(!b) return;
  var ad=b.getAttribute("data-c53add"); if(ad){ connAdd(ad); refreshAll(); return; }
  var de=b.getAttribute("data-c53dec"); if(de){ var q=String(de).split(":"); connDecide(q[0], q[1]||"none"); refreshAll(); return; }
  var lv=b.getAttribute("data-c53leave"); if(lv){ leaveShared(lv); refreshAll(); return; } }catch(e){} });
function refreshAll(){ try{ if(window.App&&App.render) App.render(); }catch(e){} }
/* ---------- V50 profil blokk + értesítés-gomb ---------- */
(function(){ var _p=VIEWS.profile&&VIEWS.profile.after;
  VIEWS.profile.after=function(root){ try{ _p&&_p(root); }catch(e){}
    try{ if(!root||root.querySelector("#c53psec")) return; var u=curU(); if(!u) return; var P5=myProf(); var me=uidNow();
      var fr=C().connections.filter(function(x){ return (x.a===me||x.b===me)&&x.status==="accepted"; }).length;
      var sec=document.createElement("section"); sec.className="card panel p5-sec"; sec.id="c53psec";
      var s2=userStats(me);
      sec.innerHTML="<h2>👥 Közösség</h2>"+ (P5? '<div class="e2row"><div><b>'+ (P5.av?'<img src="'+esc3(P5.av)+'" class="c53-av img sm" alt="">':'👤')+" "+esc3(P5.name)+"</b><span class='mut'>"+fr+" túratárs · 🥾 "+s2.tours+" · 🏆 "+s2.badges+"</span></div><a class='btn btn-soft btn-sm' href='#/tarsak'>👥 Túratársak</a></div>"
        : "<p class='muted mb0' style='margin:.1rem 0 .4rem'>Megjelenhetsz másoknak is, mint túratársjelölt — állíts be közösségi profilt.</p><a class='btn btn-primary btn-sm' href='#/tarsak'>👤 Közösségi profil</a>");
      var last=root.querySelector(".p5 > section:nth-last-child(3)"); var host=root.querySelector(".p5"); if(host&&last) host.insertBefore(sec, last.nextSibling); else if(host) host.appendChild(sec); }catch(e){} }; })();
/* ---------- dashboard mini blokk ---------- */(function(){ var _pd=VIEWS.dash&&VIEWS.dash.after;
  VIEWS.dash.after=function(root){ try{ _pd&&_pd(root); }catch(e){}
    try{ if(!root||!root.querySelector) return; if(root.querySelector("#c53mini")) return; var w=root.querySelector("#widgets"); if(!w) return;
      ensureDemo(); var me=uidNow(); var rows=[];
      C().connections.forEach(function(cn){ if((cn.a===me||cn.b===me)&&cn.status==="pending"&&cn.req!==me){ var o=cn.a===me?cn.b:cn.a; var p=profOf(o); rows.push("🟠 "+ (p&&p.name||o) + " jelölne — fogadd a Túratársaknál"); } });
      C().invites.forEach(function(iv){ if(iv.status==="active"&&(!iv.uid||iv.uid===me)){ var st=Store.findTourAnywhere(iv.tourId); if(st) rows.push("🔗 Meghívás: "+(st.tour.title||"túra")); } });
      sharedToursOfMe().forEach(function(x){ if(x.tour.date) rows.push("🥾 "+x.tour.title+" · "+x.tour.date); });
      var box=document.createElement("section"); box.className="wsec"; box.id="c53mini";
      if(!rows.length){ box.innerHTML='<div class="wpan c53mini"><b>👥 Túratársak</b><p class="muted small" style="margin:.2rem 0">Még nincs közös túrád.</p><a class="btn btn-soft btn-sm" href="#/tarsak">Keresek társakat</a></div>'; }
      else box.innerHTML='<div class="wpan c53mini"><b>👥 Túratársak</b>'+ rows.slice(0,3).map(function(x,i){ var href = x.indexOf("🥾")===0? "#/tarsak" : "#/tarsak"; void href; return '<span class="e2minir"><b>'+esc3(x.slice(0,60))+"</b></span>"; }).join("")+'<a class="btn btn-soft btn-sm" href="#/tarsak">👥 Túratársak</a></div>';
      var ref=root.querySelector("#e2mini")||root.querySelector("#e50mini")||root.querySelector("#f9mini")||root.querySelector("#p50mini"); if(ref&&ref.parentNode) ref.parentNode.insertBefore(box, ref.nextSibling); else w.appendChild(box); }catch(e){} }; })();
/* ---------- szervezői központ: közösségi túrák szekció ---------- */
(function(){ var _sz=VIEWS.szervezo, _sza=VIEWS.szervezo&&VIEWS.szervezo.after;
  VIEWS.szervezo=function(){ var base=_sz?_sz.apply(this,arguments):""; try{ ensureDemo(); var evs=communityEventsOfMine();
    var extra='<section class="card panel e2sec"><h2>🥾 Közösségi túráim</h2>'+ (evs.length? evs.map(function(e){ var cnt=window.e2?null:null; void cnt; var tot=countsFor(e.id), cap=e.cap||null; var free=cap!=null?Math.max(0,cap-tot):"—"; var st=Store.findTourAnywhere(e.projectId);
      return '<div class="e2row"><div><b>🥾 '+esc3(e.name)+(e.status==="draft"?" (piszkozat)":"")+"</b><span class='mut'>"+esc3(e.date||"")+" · "+((st&&st.tour)?'📋 projekt is van':'📋 nincs projekt')+"</span></div><div class='e2rowbtns'><span class='chip "+(cap!=null&&tot>=cap?"chip-rose":"chip-sand")+"'>👥 "+tot+(cap!=null?("/"+cap):"")+" · szabad: "+free+"</span>"+
        (e.status==="draft"? "<button class='btn btn-primary btn-sm' data-e2st='"+e.id+":published'>🌐 Publikálom</button>":"")+
        "<button class='btn btn-soft btn-sm' data-e2app='"+e.id+"'>📋 Jelentkezők</button>"+( (st&&st.tour)? "<a class='btn btn-ghost btn-sm' href='#/tura/"+e.projectId+"'>🥾 Projekt</a>":"")+
        (e.status!=="completed"&&e.status!=="cancelled"? "<button class='btn btn-ghost btn-sm' data-e2st='"+e.id+":completed'>✓ Lezárás</button>":"")+"</div></div>"; }).join("") : '<p class="muted small">Még nincs közösségi túrád — a saját projektedből egy gombdal hirdetheted meg (🥾 projekt → 📢 Meghirdetem).</p>')+"</section>";
    return base.replace(/<\/div>$/, extra+"</div>"); }catch(e){ return base; } };
  VIEWS.szervezo.after=function(root){ try{ _sza&&_sza(root); }catch(e){} };
  function countsFor(eid){ try{ var L=Store.platform().participants.filter(function(x){ return x.eid===eid && x.status!=="withdrawn" && x.status!=="declined"; }); return L.length; }catch(e){ return 0; } } })();
/* ---------- Store.notifications kibővítése közösségi elemekkel ---------- */
(function(){ try{ var _n=Store.notifications;
  Store.notifications=function(){ var base=[]; try{ base=_n?_n():[]; }catch(e){} var mine=[]; try{ mine=myNotifs().map(function(x){ return { id:"c53-"+x.id, icon:"🔔", text:x.text, link:x.link, at:x.at }; }); }catch(e){}
    try{ if((location.hash||"").indexOf("ertesitesek")>-1 && mine.length){ var read=C().notifs.filter(function(x){return x.to===uidNow() && !x.read;}).map(function(x){return x.id;}).join(","); if(!window.__c53mark||window.__c53mark!==read){ window.__c53mark=read; setTimeout(markNotifsRead,900); } } }catch(e){}
    var seen={}; return base.concat(mine).filter(function(o){ if(seen[o.id]) return false; seen[o.id]=1; return true; }); };
} catch(e){} })();
window.__V53=1; window.c53={ connAdd:connAdd, connDecide:connDecide, connOf:connOf, createInvite:createInvite, joinByInvite:joinByInvite, declineInvite:declineInvite, leaveShared:leaveShared, sharedToursOfMe:sharedToursOfMe, memberRowOf:memberRowOf, publishTour:publishTour, profOf:profOf, setMyProf:setMyProf, communityEventsOfMine:communityEventsOfMine, ensureDemo:ensureDemo, C:C, myNotifs:myNotifs };
})();

/* ==== v54 ==== */
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
    cloudAuthEnabled:function(){ return !!SupabaseAdapter; }, errorText:mapErr, loadProfile:function(){ return loadCloudProfile(); }, saveProfileFromLocal:function(){ return saveCloudProfile(); }, save:function(snap){ if(!sess.token) return Promise.reject({error:"signed_out"}); return getActive().save(sess.token, snap, sess.remoteVersion); }, load:function(){ if(!sess.token) return Promise.reject({error:"signed_out"}); return getActive().load(sess.token); }, logoutNow:function(){ var t=sess.token, a=getActive(); var p=(t&&a.name!=="local-vault")?Promise.resolve(a.logout(t)).catch(function(){ return true; }):Promise.resolve(true); return p.then(function(){ clearSess(); return true; }); } },
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

/* ==== v120 ==== */
/* ============================================================
   V120 — ÉLŐ TÚRA / GPS MÓD
   A meglévő Store.tours + GPX struktúrát használja; nincs külön útvonal-adatmodell.
   ============================================================ */
"use strict";

const V120_MAX_SPEED_MPS = 20;
const V120_ACCURACY_LIMIT = 120;
let v120WatchId = null;
let v120Timer = null;
let v120Map = null;
let v120MapLine = null;
let v120MapMarker = null;

function v120Now(){ return Date.now(); }
function v120Point(pos){ const c=pos&&pos.coords||{}; return {lat:+c.latitude,lng:+c.longitude,timestamp:pos.timestamp||v120Now(),accuracy:Number.isFinite(+c.accuracy)?+c.accuracy:null,altitude:Number.isFinite(+c.altitude)?+c.altitude:null}; }
function v120Distance(a,b){
  if(typeof haversine==="function") return haversine([a.lat,a.lng],[b.lat,b.lng]);
  const p=Math.PI/180,R=6371000,dLat=(b.lat-a.lat)*p,dLng=(b.lng-a.lng)*p,q=Math.sin(dLat/2)**2+Math.cos(a.lat*p)*Math.cos(b.lat*p)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(q)));
}
function v120FormatTime(ms){ const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`; }
function v120Live(t){ return t&&t.liveTrack&&typeof t.liveTrack==="object"?t.liveTrack:null; }
function v120ActiveMs(live,now=v120Now()){ if(!live)return 0; let out=+live.activeMs||0; if(live.status==="running"&&live.segmentStartedAt)out+=Math.max(0,now-+live.segmentStartedAt); return out; }
function v120TotalMs(live,now=v120Now()){ return !live||!live.startedAt?0:Math.max(0,(live.finishedAt||now)-live.startedAt); }
function v120Elevation(points){ let gain=0,loss=0,anchor=null; (points||[]).forEach(p=>{if(p.altitude==null)return;if(anchor==null){anchor=p.altitude;return;}const d=p.altitude-anchor;if(Math.abs(d)>=8){if(d>0)gain+=d;else loss-=d;anchor=p.altitude;}}); return {gain:Math.round(gain),loss:Math.round(loss)}; }
function v120Accept(live,point){
  if(!point||!Number.isFinite(point.lat)||!Number.isFinite(point.lng))return {ok:false,reason:"invalid"};
  if(point.accuracy!=null&&point.accuracy>V120_ACCURACY_LIMIT)return {ok:false,reason:"accuracy"};
  const points=live.points||[],prev=points[points.length-1]; if(!prev)return {ok:true,distanceM:0,speedKmh:0};
  const dt=Math.max(0,(point.timestamp-prev.timestamp)/1000),distance=v120Distance(prev,point); if(!dt)return {ok:false,reason:"timestamp"};
  const allowance=Math.max(150,V120_MAX_SPEED_MPS*dt+(point.accuracy||0)+(prev.accuracy||0)); if(distance>allowance)return {ok:false,reason:"jump",distanceM:distance};
  return {ok:true,distanceM:distance,speedKmh:distance/dt*3.6};
}
function v120GetTour(id){ return Store.getTour(String(id)); }
function v120Persist(t){ try{ Store.updateTour(t.id,{liveTrack:t.liveTrack}); return true; }catch(e){ return false; } }
function v120MapReset(){ if(v120Map){try{v120Map.remove();}catch(e){}} v120Map=null;v120MapLine=null;v120MapMarker=null; }
function v120MapDraw(points){
  const el=document.getElementById("v120-map"); if(!el||!points.length)return;
  if(!v120Map&&typeof MapKit!=="undefined"&&window.L){v120Map=MapKit.make(el,{center:[points[0].lat,points[0].lng],zoom:16,scroll:true});if(!v120Map)return;}
  if(!v120Map||!window.L)return; const line=points.map(p=>[p.lat,p.lng]);
  if(v120MapLine)v120MapLine.setLatLngs(line);else v120MapLine=L.polyline(line,{color:"#E07A2F",weight:5,opacity:.9}).addTo(v120Map);
  const last=points[points.length-1]; if(v120MapMarker)v120MapMarker.setLatLng([last.lat,last.lng]);else v120MapMarker=L.circleMarker([last.lat,last.lng],{radius:8,color:"#1C4A36",fillColor:"#E07A2F",fillOpacity:1}).addTo(v120Map).bindTooltip("📍 Aktuális pozíció");
  if(line.length>1)v120Map.fitBounds(L.latLngBounds(line).pad(.25));else v120Map.setView(line[0],16);
}
function v120Stat(root,t){
  const live=v120Live(t);if(!live||!root)return;const now=v120Now(),active=v120ActiveMs(live,now),total=v120TotalMs(live,now),km=(+live.distanceM||0)/1000;
  const set=(id,text)=>{const e=root.querySelector(id);if(e)e.textContent=text;};
  set("#v120-distance",`${km.toFixed(2)} km`);set("#v120-active",v120FormatTime(active));set("#v120-total",v120FormatTime(total));set("#v120-speed",`${(+live.speedKmh||0).toFixed(1)} km/h`);set("#v120-average",`${(active>0?(+live.distanceM||0)/active*3.6:0).toFixed(1)} km/h`);set("#v120-points",String((live.points||[]).length));set("#v120-status",live.status==="running"?"Folyamatban":live.status==="paused"?"Szüneteltetve":"Befejezve");
  const p=live.points&&live.points.at(-1);set("#v120-position",p?`${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`:"Még nincs GPS-pont");set("#v120-accuracy",p&&p.accuracy!=null?`±${Math.round(p.accuracy)} m`:"—");set("#v120-elevation",`${live.elevationGain||0} m`);v120MapDraw(live.points||[]);
  const pause=root.querySelector("#v120-pause"),resume=root.querySelector("#v120-resume"),finish=root.querySelector("#v120-finish");if(pause)pause.hidden=live.status!=="running";if(resume)resume.hidden=live.status!=="paused";if(finish)finish.hidden=live.status==="finished";
}
function v120StopWatch(){if(v120WatchId!=null&&navigator.geolocation){navigator.geolocation.clearWatch(v120WatchId);v120WatchId=null;}}
function v120HandlePosition(id,pos){const t=v120GetTour(id),live=v120Live(t);if(!t||!live||live.status!=="running")return;const p=v120Point(pos),accepted=v120Accept(live,p);if(!accepted.ok)return;live.points=live.points||[];live.points.push(p);live.distanceM=(+live.distanceM||0)+(accepted.distanceM||0);live.speedKmh=accepted.speedKmh||0;const elev=v120Elevation(live.points);live.elevationGain=elev.gain;live.elevationLoss=elev.loss;live.lastPositionAt=p.timestamp;live.lastError=null;v120Persist(t);v120Stat(document.getElementById("v120-root"),t);}
function v120GeoError(err){const msg=err&&err.code===1?"A helymeghatározási engedély szükséges a túra indításához.":err&&err.code===2?"A helyzet most nem határozható meg. Ellenőrizd a GPS-t és próbáld újra.":"A GPS nem válaszol időben. Próbáld újra nyílt ég alatt.";toast(msg,"📍");}
function v120StartWatch(id){if(!navigator.geolocation){toast("Ebben a böngészőben nincs helymeghatározás.","📍");return false;}v120StopWatch();v120WatchId=navigator.geolocation.watchPosition(p=>v120HandlePosition(id,p),v120GeoError,{enableHighAccuracy:true,maximumAge:5000,timeout:15000});return true;}
function v120Begin(id){const t=v120GetTour(id);if(!t)return;window.__V120_ACTIVE_ID=t.id;try{sessionStorage.setItem("v120-active-tour",t.id);}catch(e){};if(!navigator.geolocation){toast("A túra csak valós GPS-szel indítható; ez a böngésző nem támogatja.","📍");return;}navigator.geolocation.getCurrentPosition(pos=>{const started=v120Now(),p=v120Point(pos);t.liveTrack={version:1,status:"running",startedAt:started,finishedAt:null,activeMs:0,segmentStartedAt:started,pausedAt:null,points:[],distanceM:0,speedKmh:0,elevationGain:0,elevationLoss:0,lastPositionAt:null};const accepted=v120Accept(t.liveTrack,p);if(accepted.ok){t.liveTrack.points.push(p);t.liveTrack.lastPositionAt=p.timestamp;}v120Persist(t);toast("🥾 Túra elindítva — GPS-rögzítés folyamatban","📍");NAV.to("#/tura-live/"+t.id);},v120GeoError,{enableHighAccuracy:true,maximumAge:0,timeout:15000});}
function v120Pause(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status!=="running")return;const now=v120Now();live.activeMs=v120ActiveMs(live,now);live.status="paused";live.pausedAt=now;live.segmentStartedAt=null;v120Persist(t);v120StopWatch();v120Stat(document.getElementById("v120-root"),t);}
function v120Resume(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status!=="paused")return;live.status="running";live.segmentStartedAt=v120Now();live.pausedAt=null;v120Persist(t);v120StartWatch(id);v120Stat(document.getElementById("v120-root"),t);}
function v120Finish(id){const t=v120GetTour(id),live=v120Live(t);if(!live||live.status==="finished")return;const now=v120Now();live.activeMs=v120ActiveMs(live,now);live.status="finished";live.finishedAt=now;live.segmentStartedAt=null;v120StopWatch();const pts=live.points||[];if(pts.length){t.gpx={pts:pts.map(p=>({lat:p.lat,lng:p.lng,ele:p.altitude,time:new Date(p.timestamp).toISOString()})),line:pts.map(p=>[p.lat,p.lng]),elev:pts.filter(p=>p.altitude!=null).map(p=>p.altitude)};t.coords={lat:pts[0].lat,lng:pts[0].lng};}t.status="teljesítve";t.liveTrack=live;v120Persist(t);toast("📱 Helyben mentve — a Felhő-szinkronizálás külön indítható.","✅");v120MapReset();render();}
function v120LiveHTML(t){if(typeof t==="string")t=v120GetTour(t);if(!t){const active=window.__V120_ACTIVE_ID||sessionStorage.getItem("v120-active-tour");const routeId=String(location.hash||"").split("/")[2];t=v120GetTour(active||routeId);}const l=v120Live(t),finished=l&&l.status==="finished";if(!t||!l)return dash("#/turaim")(`<div class="card panel"><h2>Élő túra nem található</h2><p class="muted">A túra helyi adatait nem sikerült betölteni.</p></div>`);return dash("#/tura/"+t.id)(`<div id="v120-root" class="v120-live"><a class="small muted" href="#/tura/${t.id}" style="display:inline-block;margin-bottom:.7rem;color:var(--sky);font-weight:600">← Túra részletei</a><div class="v120-head card"><div><span class="chip ${finished?"chip-green":"chip-ember"}" id="v120-status">${finished?"Befejezve":l.status==="paused"?"Szüneteltetve":"Folyamatban"}</span><h1>🥾 ${esc(t.title)}</h1><p class="muted mb0">${finished?"Túra összesítő":"Élő GPS-rögzítés — csak valódi helyadat kerül mentésre"}</p></div><div class="small muted">📍 <span id="v120-position">${l.points&&l.points.length?`${l.points.at(-1).lat.toFixed(5)}, ${l.points.at(-1).lng.toFixed(5)}`:"Még nincs GPS-pont"}</span><br>GPS pontosság: <span id="v120-accuracy">—</span></div></div><div class="v120-map card" id="v120-map"><div class="empty"><span class="em-ico">📍</span><h3>GPS-térkép</h3><p>A rögzített útvonal itt jelenik meg.</p></div></div><div class="v120-stats grid g2 smm2"><div class="card stat-tile"><span class="st-ic">📏</span><b id="v120-distance">0.00 km</b><span>Megtett táv</span></div><div class="card stat-tile"><span class="st-ic">⏱️</span><b id="v120-active">00:00</b><span>Aktív idő</span></div><div class="card stat-tile"><span class="st-ic">⚡</span><b id="v120-speed">0.0 km/h</b><span>Aktuális sebesség</span></div><div class="card stat-tile"><span class="st-ic">📊</span><b id="v120-average">0.0 km/h</b><span>Átlagsebesség</span></div><div class="card stat-tile"><span class="st-ic">📍</span><b id="v120-points">${(l.points||[]).length}</b><span>GPS pont</span></div><div class="card stat-tile"><span class="st-ic">⛰️</span><b id="v120-elevation">${l.elevationGain||0} m</b><span>Szintemelkedés</span></div></div>${finished?`<div class="card panel v120-summary"><h2>Összesítő</h2><p class="muted">Kezdés: ${l.startedAt?new Date(l.startedAt).toLocaleString("hu-HU"):"—"}<br>Befejezés: ${l.finishedAt?new Date(l.finishedAt).toLocaleString("hu-HU"):"—"}<br>Teljes idő: <b id="v120-total">${v120FormatTime(v120TotalMs(l))}</b></p><p class="mb0">A track a túra GPX-adatában is megmaradt, a meglévő útvonal- és naplórendszer használhatja.</p></div>`:""}${!finished?`<div class="v120-controls"><button class="btn btn-soft btn-lg" id="v120-pause">⏸ Szünet</button><button class="btn btn-primary btn-lg" id="v120-resume" hidden>▶ Folytatás</button><button class="btn btn-danger btn-lg" id="v120-finish">🏁 Túra befejezése</button></div>`:`<div class="v120-controls"><a class="btn btn-primary btn-lg" href="#/tura/${t.id}">Túra részletei</a></div>`}</div>`);}
VIEWS.liveTour=v120LiveHTML;
VIEWS.liveTour.after=(root,id)=>{const t=v120GetTour(id);if(!t||!v120Live(t))return;const l=v120Live(t);v120MapReset();if(l.status==="running")v120StartWatch(id);const pause=root.querySelector("#v120-pause"),resume=root.querySelector("#v120-resume"),finish=root.querySelector("#v120-finish");if(pause)pause.onclick=()=>v120Pause(id);if(resume)resume.onclick=()=>v120Resume(id);if(finish)finish.onclick=()=>confirmDlg("A rögzített track lezáródik és összesítő készül.","Túra befejezése",()=>v120Finish(id));v120Stat(root,t);setTimeout(()=>v120MapDraw(v120Live(v120GetTour(id))?.points||[]),250);if(v120Timer)clearInterval(v120Timer);v120Timer=setInterval(()=>{const x=v120GetTour(id);if(x)v120Stat(root,x);},1000);};
const v120WorkspaceView=VIEWS.workspace;
VIEWS.workspace=(id)=>{if(!id){const routeId=String(location.hash||"").split("/")[2];if(routeId)id=routeId;}return v120WorkspaceView(id);};const v120WorkspaceAfter=VIEWS.workspace.after;
VIEWS.workspace.after=(root,id)=>{if(!id){const routeId=String(location.hash||"").split("/")[2];if(routeId)id=routeId;}v120WorkspaceAfter&&v120WorkspaceAfter(root,id);try{const t=v120GetTour(id),live=v120Live(t);if(!t)return;const host=root.querySelector(".ws-actions");if(!host||root.querySelector("#v120-start,#v120-continue"))return;if(live&&["running","paused"].includes(live.status)){const b=document.createElement("a");b.id="v120-continue";b.className="btn btn-ember btn-sm";b.href="#/tura-live/"+id;b.textContent=live.status==="paused"?"▶ Folytatás":"📍 Élő túra megnyitása";host.insertBefore(b,host.firstChild);return;}const b=document.createElement("button");b.id="v120-start";b.className="btn btn-ember btn-sm";b.textContent="🥾 Túra indítása";b.onclick=()=>v120Begin(id);host.insertBefore(b,host.firstChild);}catch(e){}};
window.addEventListener("beforeunload",e=>{try{const d=Store.myData(),active=(d&&d.tours||[]).some(t=>v120Live(t)&&["running","paused"].includes(t.liveTrack.status));if(active){e.preventDefault();e.returnValue="A túra folyamatban van — biztosan kilépsz?";return e.returnValue;}}catch(err){}});
window.__V120={haversine:v120Distance,acceptPoint:v120Accept,activeMs:v120ActiveMs,formatTime:v120FormatTime};

/* ==== v121 ==== */
/* ============================================================
   V121 — OFFLINE GPS + GPX IMPORT/EXPORT KIEGÉSZÍTÉS
   A V120 élő tracket és a V47 útvonal/GPX modellt használja.
   ============================================================ */
(function(){
"use strict";

const V121_ACTIVE_KEY = "turatars_v121_active";
let v121Online = navigator.onLine !== false;
let v121BackupTimer = null;

function v121Live(t){ return t && t.liveTrack && typeof t.liveTrack === "object" ? t.liveTrack : null; }
function v121Tour(id){ try{ return Store.getTour(String(id)); }catch(e){ return null; } }
function v121Esc(x){ return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&apos;"); }
function v121Backup(t){
  const live=v121Live(t); if(!t||!live||!['running','paused'].includes(live.status)) return;
  try{ localStorage.setItem(V121_ACTIVE_KEY,JSON.stringify({tourId:t.id,liveTrack:live,updatedAt:Date.now()})); }catch(e){}
}
function v121ReadBackup(){ try{ const raw=localStorage.getItem(V121_ACTIVE_KEY); return raw?JSON.parse(raw):null; }catch(e){ return null; } }
function v121Hydrate(t){
  const b=v121ReadBackup(); if(!t||!b||String(b.tourId)!==String(t.id)||!b.liveTrack) return;
  const current=v121Live(t), bt=+b.updatedAt||0, ct=current&&(+current.updatedAt||0);
  if(!current || (['running','paused'].includes(current.status) && bt>ct)){ t.liveTrack=b.liveTrack; try{ Store.save(); }catch(e){} }
}
function v121Persist(t){
  try{ if(typeof Store.updateTour==="function") Store.updateTour(t.id,{liveTrack:t.liveTrack}); else Store.save();
    t.liveTrack.updatedAt=Date.now(); v121Backup(t); return true;
  }catch(e){ v121Backup(t); return false; }
}

/* V120 minden pont után ment; itt ugyanazt a mentést egészítjük ki helyi,
   tabon kívül is megmaradó biztonsági másolattal. */
if(typeof v120Persist==="function"){
  const basePersist=v120Persist;
  v120Persist=function(t){ const ok=basePersist(t); v121Backup(t); return ok; };
}
if(typeof v120Finish==="function"){
  const baseFinish=v120Finish;
  v120Finish=function(id){ baseFinish(id); try{ const t=v121Tour(id); if(t&&v121Live(t)&&v121Live(t).status==="finished") localStorage.removeItem(V121_ACTIVE_KEY); }catch(e){} };
}
function v121ActiveBackup(id){ const t=v121Tour(id); if(t) v121Backup(t); }
window.addEventListener("pagehide",function(){ try{ const d=Store.myData(); (d.tours||[]).forEach(v121Backup); }catch(e){} });

function v121OfflineText(root){
  if(!root) return;
  const t=root.querySelector("#v121-offline"); if(!t) return;
  t.hidden=v121Online;
  if(!v121Online) t.textContent="📱 Offline – a túra helyben mentve";
}
function v121OffRoute(t,point){
  const live=v121Live(t), route=t&&t.routeId?((Store.myData().routes||[]).find(function(x){return x.id===t.routeId;})):null;
  if(!live||!point||!route||!Array.isArray(route.track)||!route.track.length) return;
  let nearest=Infinity;
  route.track.forEach(function(p){
    const q={lat:+p[0],lng:+p[1]}; if(!Number.isFinite(q.lat)||!Number.isFinite(q.lng)) return;
    const d=typeof v120Distance==="function"?v120Distance(point,q):0; if(d<nearest) nearest=d;
  });
  const tolerance=Math.max(60,+point.accuracy||30);
  if(nearest>tolerance){ live.offRouteConsecutive=(+live.offRouteConsecutive||0)+1; }
  else { live.offRouteConsecutive=0; live.offRoute=false; live.offRouteDistanceM=Math.round(nearest); }
  if((+live.offRouteConsecutive||0)>=3){ live.offRoute=true; live.offRouteDistanceM=Math.round(nearest); }
  v121Persist(t);
  const root=document.getElementById("v120-root"), el=root&&root.querySelector("#v121-offroute");
  if(el){ el.hidden=!live.offRoute; if(live.offRoute) el.textContent="⚠️ Letértél az útvonalról — térj vissza a trackhez ("+live.offRouteDistanceM+" m)"; }
}
if(typeof v120HandlePosition==="function"){
  const baseHandle=v120HandlePosition;
  v120HandlePosition=function(id,pos){ baseHandle(id,pos); const t=v121Tour(id),live=v121Live(t); if(live&&live.points&&live.points.length) v121OffRoute(t,live.points[live.points.length-1]); };
}

function v121ExportLive(t){
  const live=v121Live(t), points=(live&&live.points)||[]; if(!points.length){ toast("Nincs exportálható GPS track.","📤"); return; }
  const seg=points.map(function(p){
    return '      <trkpt lat="'+Number(p.lat).toFixed(7)+'" lon="'+Number(p.lng).toFixed(7)+'">'+
      (p.altitude!=null?'<ele>'+Number(p.altitude).toFixed(2)+'</ele>':'')+
      (p.timestamp?'<time>'+v121Esc(new Date(p.timestamp).toISOString())+'</time>':'')+
      '</trkpt>';
  }).join("\n");
  const text='<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Turatars V122" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>'+v121Esc(t.title||"Élő túra")+'</name></metadata><trk><name>'+v121Esc(t.title||"Élő túra")+'</name><trkseg>\n'+seg+'\n</trkseg></trk></gpx>';
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([text],{type:"application/gpx+xml"})); a.download=(t.title||"tura").replace(/[^\w\-]+/g,"_").slice(0,48)+".gpx"; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},700); toast("GPX export elkészült","📤");
}
window.__v121ExportLive=v121ExportLive;

function v121AttachRoute(t,r){
  if(!t||!r) return;
  t.routeId=r.id; r.linkedTripId=t.id;
  if(!t.gpx && Array.isArray(r.track)) t.gpx={pts:r.track.map(function(p){return {lat:p[0],lng:p[1],ele:p[2]==null?null:p[2],time:p[3]||null};}),line:r.track.map(function(p){return [p[0],p[1]];}),elev:r.track.map(function(p){return p[2];}).filter(function(x){return x!=null;})};
  if((!t.coords||!Number.isFinite(+t.coords.lat))&&r.start) t.coords={lat:r.start.lat,lng:r.start.lng};
  Store.save(); toast("Az útvonal a túrához kapcsolva","🗺️"); render();
}
function v121RoutePicker(root,id,t){
  if(!root||!t||t.routeId) return;
  const routes=((Store.myData().routes||[])); if(!routes.length) return;
  const host=root.querySelector(".ws-actions"); if(!host||root.querySelector("#v121-route-picker")) return;
  const b=document.createElement("button"); b.id="v121-route-picker"; b.className="btn btn-soft btn-sm"; b.textContent="🗺️ Meglévő útvonal használata"; host.appendChild(b);
  b.onclick=function(){
    openModal({title:"🗺️ Válassz útvonalat",body:'<div class="v121-route-list">'+routes.map(function(r){return '<button class="v121-route-choice" data-route="'+v121Esc(r.id)+'"><b>'+v121Esc(r.name||"Útvonal")+'</b><span>'+(Number(r.distance_km||0).toFixed(1))+" km · +"+(Math.round(r.elevation_gain_m||0))+" m · "+(r.nPts||((r.track||[]).length))+" pont</span></button>";}).join("")+'</div>',footer:'<button class="btn btn-ghost btn-block" data-close>Mégse</button>',onOpen:function(m){m.querySelectorAll("[data-route]").forEach(function(x){x.onclick=function(){const r=routes.find(function(q){return q.id===x.dataset.route;});if(r){closeModal();v121AttachRoute(t,r);}};});}});
  };
}

/* Élő nézet kiegészítése: offline állapot, eltérés és valódi GPS-export. */
const baseLiveAfter=VIEWS.liveTour.after;
VIEWS.liveTour.after=function(root,id){
  const t=v121Tour(id); if(t) v121Hydrate(t);
  try{ baseLiveAfter&&baseLiveAfter(root,id); }catch(e){}
  if(!root||!t) return;
  const head=root.querySelector(".v120-head");
  if(head&&!root.querySelector("#v121-offline")) head.insertAdjacentHTML("afterend",'<div id="v121-offline" class="v121-offline" role="status" hidden>📱 Offline – a túra helyben mentve</div>');
  if(head&&!root.querySelector("#v121-offroute")) head.insertAdjacentHTML("afterend",'<div id="v121-offroute" class="v121-offroute" role="alert" hidden>⚠️ Letértél az útvonalról</div>');
  v121OfflineText(root);
  const live=v121Live(t);
  if(live&&live.offRoute){const e=root.querySelector("#v121-offroute");if(e){e.hidden=false;e.textContent="⚠️ Letértél az útvonalról — térj vissza a trackhez ("+(live.offRouteDistanceM||0)+" m)";}}
  const controls=root.querySelector(".v120-controls");
  if(controls&&live&&live.status==="finished"&&!root.querySelector("#v121-gpx-export")){const b=document.createElement("button");b.id="v121-gpx-export";b.className="btn btn-soft btn-lg";b.textContent="📤 GPX export";b.onclick=function(){v121ExportLive(v121Tour(id)||t);};controls.insertBefore(b,controls.firstChild);}
  if(v121BackupTimer) clearInterval(v121BackupTimer); v121BackupTimer=setInterval(function(){const x=v121Tour(id);if(x){v121Persist(x);const r=document.getElementById("v120-root");v121OfflineText(r);}},10000);
};

/* V47 útvonal-fül: az eredeti importáló marad az elsődleges, ehhez jön a
   meglévő útvonal kiválasztása és a V121 azonosítójú import gomb. */
const baseWorkspaceAfter=VIEWS.workspace.after;
VIEWS.workspace.after=function(root,id){
  try{baseWorkspaceAfter&&baseWorkspaceAfter(root,id);}catch(e){}
  const t=v121Tour(id); if(!root||!t||typeof wsTab!=="undefined"&&String(wsTab)!=="utvonal") return;
  const actions=root.querySelector(".ws-actions"); if(actions&&!root.querySelector("#v121-gpx-import")){
    const b=document.createElement("button"); b.id="v121-gpx-import"; b.className="btn btn-soft btn-sm"; b.textContent="📂 GPX importálása"; b.onclick=function(){window.openGPXImport&&window.openGPXImport({tripId:id,replace:t.routeId||null});}; actions.appendChild(b);
  }
  v121RoutePicker(root,id,t);
};

function v121Net(){ v121Online=navigator.onLine!==false; document.querySelectorAll("#v121-offline").forEach(function(x){x.hidden=v121Online;}); }
window.addEventListener("offline",v121Net); window.addEventListener("online",v121Net);
window.__V121={exportLive:v121ExportLive,backup:v121Backup,hydrate:v121Hydrate,offline:function(){return !v121Online},offRoute:v121OffRoute};
})();

/* ==== v122 ==== */
/* ============ V122 — VERIFIED PUBLIC DATA CATALOG ============
   The legacy catalog remains available to the private V41–V121 flows, but
   public pages only expose records imported with explicit provenance and a
   verified status. No placeholder or demo records are seeded here. */
(function(){
"use strict";
var REQUIRED=["source","sourceUrl","sourceLicense","attribution","importedAt","verifiedAt","dataStatus"];
function platform(){ try{return Store.platform();}catch(e){return null;} }
function catalog(){
  var p=platform(); if(!p) return {tours:[],events:[],places:[]};
  if(!p.catalog) p.catalog={schemaVersion:1,region:"Székelyföld",tours:[],events:[],places:[]};
  if(!Array.isArray(p.catalog.tours)) p.catalog.tours=[];
  if(!Array.isArray(p.catalog.events)) p.catalog.events=[];
  if(!Array.isArray(p.catalog.places)) p.catalog.places=[];
  return p.catalog;
}
function escV(x){ try{return esc(x==null?"":String(x));}catch(e){return String(x==null?"":x);} }
function valid(x){
  if(!x || x.archived===true || x.dataStatus!=="verified") return false;
  for(var i=0;i<REQUIRED.length;i++) if(x[REQUIRED[i]]==null || String(x[REQUIRED[i]]).trim()==="") return false;
  return !!String(x.sourceUrl).trim();
}
function normalizeTour(x){
  var t=Object.assign({},x||{}); t.tags=Array.isArray(t.tags)?t.tags:[];
  t.region=t.region||""; t.name=t.name||""; t.km=t.km==null?(t.distanceKm==null?null:+t.distanceKm):+t.km; t.up=t.up==null?(t.elevationGainM==null?null:+t.elevationGainM):+t.up;
  t.h=t.h==null?(t.durationHours==null?null:+t.durationHours):+t.h; t.diff=t.diff||t.difficulty||""; t.difficulty=t.difficulty||t.diff;
  t.start=(t.start||t.coords)&&typeof (t.start||t.coords)==="object"?(t.start||t.coords):null; t.elev=Array.isArray(t.elev)?t.elev:[];
  return t;
}
function normalizeEvent(x){ var e=Object.assign({},x||{}); e.name=e.name||""; e.org=e.org||e.organizer||""; e.cat=e.cat||""; e.people=Number(e.people)||0; e.cap=Number(e.cap)||0; return e; }
function tourReady(t){ var n=normalizeTour(t), s=n&&n.start; return !!(valid(n)&&n.name&&n.region&&s&&isFinite(+s.lat)&&isFinite(+s.lng)&&isFinite(+n.km)&&isFinite(+n.up)&&isFinite(+n.h)&&n.diff); }
function eventReady(e){ var n=normalizeEvent(e); return !!(valid(n)&&n.name&&n.org&&n.date&&n.place); }
function placeReady(p){ return !!(valid(p)&&p.name&&p.place); }
function publicTours(){ return catalog().tours.filter(tourReady).map(normalizeTour); }
function publicEvents(){
  var today=Store.todayISO();
  return catalog().events.filter(function(e){ return eventReady(e) && String(e.date)>=today; }).map(normalizeEvent);
}
function publicPlaces(){ return catalog().places.filter(placeReady); }
function sourceLine(x){
  if(!x||!x.sourceUrl) return "";
  var verified=x.dataStatus==="verified", at=verified?x.verifiedAt:(x.reviewedAt||x.importedAt), label=verified?"Forrás / Ellenőrizve":"Forrás / Ellenőrzés alatt";
  return '<p class="small muted v122-source">'+label+': <a href="'+escV(x.sourceUrl)+'" target="_blank" rel="noopener nofollow">'+escV(x.source||"külső forrás")+'</a>'+(at?' · '+escV(at):'')+'</p>';
}
function validateRecord(x,kind){
  var miss=REQUIRED.filter(function(k){ if(k==="verifiedAt"&&x.dataStatus==="needs_review") return !(x.reviewedAt||x.importedAt); return x[k]==null||String(x[k]).trim()===""; });
  if(!x.id) miss.push("id"); if(kind==="tour" && !x.name) miss.push("name"); if(kind==="event" && (!x.name||!(x.organizer||x.org)||!x.date||!x.place)) miss.push("name, organizer, date, place");
  if(x.dataStatus!=="verified" && x.dataStatus!=="needs_review") miss.push("dataStatus (verified/needs_review)");
  return miss;
}
function adminHtml(){
  var c=catalog(), n=c.tours.length+c.events.length+c.places.length;
  return '<div class="wrap pub-section tight"><section class="card panel"><span class="eyebrow">V122 · FORRÁSKEZELÉS</span><h1>Forrásalapú katalógus</h1><p class="muted">A nyilvános katalógusba csak <b>verified</b> rekord kerülhet. A régi, forrás nélkül maradt adatok nem jelennek meg nyilvánosan.</p><div class="grid g3"><div class="card"><b>'+c.tours.length+'</b><span class="small muted">importált túra</span></div><div class="card"><b>'+c.events.length+'</b><span class="small muted">importált esemény</span></div><div class="card"><b>'+n+'</b><span class="small muted">összes forrásrekord</span></div></div><p class="small muted">Kötelező mezők: '+REQUIRED.join(", ")+'</p><label class="f" for="v122-json">Ellenőrzött rekord előkészítése (JSON)</label><textarea class="input" id="v122-json" rows="10" placeholder="Nem kerül automatikusan nyilvánosságra — előbb ellenőrizd a forrást."></textarea><p id="v122-msg" class="small muted"></p><button class="btn btn-primary" id="v122-validate">Rekord ellenőrzése</button></section></div>';
}
function adminAfter(root){
  var b=root.querySelector("#v122-validate"); if(!b) return;
  b.onclick=function(){ var msg=root.querySelector("#v122-msg"), raw=root.querySelector("#v122-json").value, x;
    try{x=JSON.parse(raw);}catch(e){msg.textContent="Hibás JSON — nincs mentés."; return;}
    var kind=x.kind||"tour", miss=validateRecord(x,kind); msg.textContent=miss.length?"Hiányzó vagy hibás mezők: "+miss.join(", "):"A rekord megfelel a sémának. Mentéshez admin jóváhagyás és forrásellenőrzés szükséges.";
  };
}
window.V122={
  schemaVersion:1, region:"Székelyföld", requiredFields:REQUIRED,
  catalog:catalog, tours:publicTours, events:publicEvents, places:publicPlaces,
  sourceLine:sourceLine, validate:validateRecord,
  importSchema:{tour:REQUIRED.concat(["id","name","region","coords","distanceKm","elevationGainM","difficulty","durationHours","routeUrl","description"]),event:REQUIRED.concat(["id","name","organizer","date","place","officialUrl"]),place:REQUIRED.concat(["id","name","place"])},
  hasVerifiedData:function(){return publicTours().length>0||publicEvents().length>0||publicPlaces().length>0;}
};
window.v122PublicTours=publicTours; window.v122PublicEvents=publicEvents; window.v122PublicPlaces=publicPlaces; window.v122SourceLine=sourceLine;
VIEWS.v122Admin=function(){ return Store.me()?adminHtml():'<div class="wrap pub-section"><div class="empty"><h1>Forráskezelés</h1><p>Jelentkezz be a forrásrekordok ellenőrzéséhez.</p><a class="btn btn-primary" href="#/belepes">Belépés</a></div></div>'; };
VIEWS.v122Admin.after=adminAfter;
})();

/* ==== v123 ==== */
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

/* ==== v124 ==== */
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

/* ==== app ==== */
/* ============================================================
   TÚRAVAROS — ROUTER + BOOT
   ============================================================ */
"use strict";
const App = {
  render(){
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [path, qs] = raw.split("?");
    const seg = path.split("/").filter(Boolean);
    const params = Object.fromEntries(new URLSearchParams(qs || ""));
    const route = seg[0] || "";
    const arg = seg[1];
    const ROUTES = {
      "": "home", felfedezes: "discover", esemenyek: "events", helyek: "places",
      turak: "tourDetail", belepes: "login", regisztracio: "register", onboarding: "onboarding",
      vezerlopult: "dash", turaim: "tours", "uj-tura": "newTour", tura: "workspace", "tura-live": "liveTour", naptar: "calendar",
      bakancslista: "wishlist", felszereles: "equipment", csapatok: "teams", naplo: "journal",
      statisztikak: "stats", hagymas: "hagymas", biztonsag: "security", csapat: "csapatstat", szatt: "szatt", ai: "ai", inbox: "inbox", terkep: "mymap", ertesitesek: "notifs", beallitasok: "settings", profil: "profile",
      utvonalak: "routes", turamod: "tourmode", terepi: "terepi", sablonok: "templates", osztott: "share", szervezo: "szervezo", szervezoknek: "szervezoknek", tarsak: "tarsak", meghivo: "meghivo", forrasok: "v122Admin"
    };
    const DASHY = ["security","csapatstat","dash", "tours", "newTour", "workspace", "liveTour", "calendar", "wishlist", "equipment", "teams", "routes", "journal", "stats", "ai", "mymap", "notifs", "settings", "profile", "tourmode", "terepi", "templates", "szervezo", "tarsak", "meghivo", "v122Admin"];
    let key = ROUTES[route] || "404";

    if (DASHY.includes(key) && !Store.me()) {
      toast("Ez a személyes túraközpont — előbb jelentkezz be", "🔐");
      location.hash = "#/belepes";
      key = "login";
    }
    document.body.classList.remove("in-dash");

    const root = document.getElementById("view");
    closeModal();

    if (key === "tourDetail") {
      const t = (window.v122PublicTours ? window.v122PublicTours().find(x=>x.id===arg) : tourById(arg));
      
      root.innerHTML = VIEWS.discover();
      if (VIEWS.discover.after) VIEWS.discover.after(root);
      renderHeader(); renderMobileNav();
      if (t) tourModal(t.id); else toast("Ilyen túra nem található a katalógusban", "🤔");
      return;
    }
    if (key === "events" && arg) {
      const e = (window.v122PublicEvents ? window.v122PublicEvents().find(x => x.id === arg) : EVENTS.find(x => x.id === arg));
      root.innerHTML = VIEWS.events();
      VIEWS.events.after(root);
      renderHeader(); renderMobileNav();
      if (e) eventModal(e.id); else history.replaceState(0, "", "#esemenyek");
      return;
    }

    const v = App.view(key);
    let html;
    if (key === "404") {
      html = `<div class="wrap" style="padding:80px 20px;text-align:center"><h1>Az ösvény itt elfogy 🧭</h1>
        <p class="muted">Ez az oldal nem létezik (még).</p><a class="btn btn-primary" href="#/">Kezdőlap</a></div>`;
    } else if (key === "workspace" || key === "security" || key === "liveTour") {
      html = VIEWS[key](arg);
    } else if (key === "tourmode") {
      html = VIEWS.tourmode(arg);
    } else if (key === "share") {
      html = VIEWS.share(arg);
    } else if (key === "terepi") {
      html = VIEWS.terepi();
    } else if (key === "templates") {
      html = VIEWS.templates();
    } else if (key === "newTour") {
      html = VIEWS.newTour(params);
    } else {
      html = VIEWS[key]();
    }
    root.innerHTML = html;

    const afterFn = { home: VIEWS.home.after, share: VIEWS.share.after, dash: VIEWS.dash.after, tours: VIEWS.tours.after, discover: VIEWS.discover.after,
      events: VIEWS.events.after, places: VIEWS.places.after, login: VIEWS.login.after, register: VIEWS.register.after, liveTour: VIEWS.liveTour.after,
      onboarding: VIEWS.onboarding.after, newTour: VIEWS.newTour.after, calendar: VIEWS.calendar.after,
      wishlist: VIEWS.wishlist.after, equipment: VIEWS.equipment.after, teams: VIEWS.teams.after,
      journal: VIEWS.journal.after, stats: VIEWS.stats.after, routes: VIEWS.routes && VIEWS.routes.after ? VIEWS.routes.after : null, hagymas: VIEWS.hagymas && VIEWS.hagymas.after ? VIEWS.hagymas.after : null, ai: VIEWS.ai.after, mymap: VIEWS.mymap.after, inbox: VIEWS.inbox && VIEWS.inbox.after,
      notifs: VIEWS.notifs.after, settings: VIEWS.settings.after, profile: VIEWS.profile.after, szervezo: (VIEWS.szervezo&&VIEWS.szervezo.after)||null, szervezoknek: (VIEWS.szervezoknek&&VIEWS.szervezoknek.after)||null, tarsak: (VIEWS.tarsak&&VIEWS.tarsak.after)||null, meghivo: (VIEWS.meghivo&&VIEWS.meghivo.after)||null, forrasok: (VIEWS.v122Admin&&VIEWS.v122Admin.after)||null, szatt: null,
      terepi: VIEWS.terepi && VIEWS.terepi.after ? VIEWS.terepi.after : null, templates: VIEWS.templates && VIEWS.templates.after ? VIEWS.templates.after : null }[key];
    const wsAfter = key === "workspace" ? VIEWS.workspace.after : (key === "tourmode" ? VIEWS.tourmode.after : (key === "liveTour" ? VIEWS.liveTour.after : null));
    (wsAfter || afterFn) && (wsAfter || afterFn)(root, arg, params);

    renderHeader();
    renderMobileNav();
    if (DASHY.includes(location.hash.replace(/^#\/?/, "").split("/")[0]) || location.hash.startsWith("#/tura/") || location.hash.startsWith("#/tura-live/")) document.body.classList.add("in-dash");
    if (!location.hash.startsWith("#/tura/") && !location.hash.startsWith("#/tura-live/")) window.scrollTo(0, 0);

    // „Teljesítetted?” — szándékosan elfeledett, lejárt túrák naplózása (képernyőnként egyszer)
    if (key === "dash" && !sessionStorage.getItem("tv-prompted")) {
      const over = Store.myData().tours.find(t => t.status === "tervezés" && t.date && t.date < Store.todayISO());
      if (over) {
        sessionStorage.setItem("tv-prompted", "1");
        setTimeout(() => openModal({
          title: "Lejárt egy túraterved 🥾",
          body: `<p class="mt0">A(z) <b>${esc(over.title)}</b> terve ${fmtDateFull(over.date)}-ra szólt — mi történt?
            Ha megvolt, naplózd fel pár sorban; ha elmaradt, tervezd újra egy nieuwe dátumra.</p>`,
          footer: `<div class="flex" style="gap:.5rem;justify-content:flex-end;flex-wrap:wrap">
            <button class="btn btn-ghost btn-sm" data-close>Később</button>
            <button class="btn btn-soft btn-sm" id="pm-move">Újratervezem</button>
            <button class="btn btn-ember" id="pm-done">✓ Megvolt — naplózom!</button></div>`,
          onOpen(r) {
            r.querySelector("#pm-done").onclick = () => { closeModal(); finishFlow(over); };
            r.querySelector("#pm-move").onclick = () => {
              closeModal();
              Store.updateTour(over.id, { date: Store.addDays(Store.todayISO(), 7), status: "tervezés" });
              toast("Új dátum: egy hét múlva. Hajrá! 💪", "📅"); render();
            };
          }
        }));
      }
    }
  },
  view(id) { return VIEWS[id]; }
};
window.App = App;
function render() { App.render(); }

window.addEventListener("hashchange", () => App.render());
window.addEventListener("DOMContentLoaded", () => { if (!location.hash) location.hash = "#/";
  if (window.statsBumpInstall) window.statsBumpInstall(App);
  App.render(); });
;window.Store=Store;window.VIEWS=VIEWS;window.tourReview=tourReview;window.smartPlanner=smartPlanner;(function(){ ["EVENTS","IMG","TOURS","TEMPLATES_DEFAULT"].forEach(function(k){ try{ window[k]=eval(k); }catch(e){} }); })();