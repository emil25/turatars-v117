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
const CHALLENGES_DEMO = [
 {id:"ch1", icon:"🏔️", name:"Székelyföld felfedező", desc:"Öt kijelölt gyöngy a Kárpát-kanyarban — mind a hat megyéből.",
  items:[{l:"Madarasi-Hargita", done:false},{l:"Csukás-tető", done:false},{l:"Békás-szoros", done:true},{l:"Solymos-kő", done:true},{l:"Gyilkos-tó", done:false}]},
 {id:"ch2", icon:"🥾", name:"Hargita-kör", desc:"A Hargita hat jellegzetes pontja a két vonulaton.",
  items:[{l:"Hargita-csúcs", done:false},{l:"Cetatea-marostető", done:false},{l:"Ocland-gerinc", done:false},{l:"Szent-Anna-tó", done:false}]},
 {id:"ch3", icon:"🌄", name:"Napkelte klub", desc:"Három eltérő havasi hajnal — a hegyek másarc, mint nappal.",
  items:[{l:"Csukás napkelte", done:false},{l:"Fekete-Hagymás hajnal", done:false},{l:"Torockói-kő napkelte", done:false}]}
];
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
