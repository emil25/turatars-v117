/* ============================================================
   V130 — TÚRA MÓD
   A V120/V121 valódi GPS- és offline track-kezelését használja.
   Ez a réteg a V129 túraprojektet adja át a kültéri, mobil nézetnek.
   ============================================================ */
(function(){
"use strict";

var V130_VERSION="130", v130Timer=null;

function v130Tour(id){try{return Store.getTour(String(id));}catch(e){return null;}}
function v130Live(t){return t&&t.liveTrack&&typeof t.liveTrack==="object"?t.liveTrack:null;}
function v130Esc(v){return typeof esc==="function"?esc(v==null?"":String(v)):String(v==null?"":v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function v130Toast(s,i){if(typeof toast==="function")toast(s,i||"🥾");}
function v130Route(t){var d=Store.myData&&Store.myData(),rs=d&&d.routes;return t&&t.routeId&&Array.isArray(rs)?rs.find(function(r){return r&&r.id===t.routeId;}):null;}
function v130PlanPoints(t){
  var r=v130Route(t), raw=r&&Array.isArray(r.track)?r.track:[];
  if(raw.length>1)return raw.map(function(p){return[+p[0],+p[1]];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
  var line=t&&t.gpx&&Array.isArray(t.gpx.line)?t.gpx.line:[];
  if(line.length>1)return line.map(function(p){return[+p[0],+p[1]];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});
  return [];
}
function v130PointArray(live){return(live&&Array.isArray(live.points)?live.points:[]).map(function(p){return[+p.lat,+p.lng];}).filter(function(p){return Number.isFinite(p[0])&&Number.isFinite(p[1]);});}
function v130Km(m){return((+m||0)/1000).toFixed(2).replace(".",",")+" km";}
function v130Time(ms){return typeof v120FormatTime==="function"?v120FormatTime(ms):"00:00:00";}
function v130Elevation(live){var ps=live&&live.points||[];return ps.filter(function(p){return p&&p.altitude!=null&&Number.isFinite(+p.altitude);}).length>=2;}
function v130Current(t){var l=v130Live(t),p=l&&l.points&&l.points.length?l.points[l.points.length-1]:null;return p||null;}

function v130EnsureGpsJournal(t){
  var l=v130Live(t);if(!t||!l||l.status!=="finished"||typeof Store.completeTour!=="function")return;
  if(!(l.summary&&l.summary.version===1&&l.summary.source==="gps")){l.summary=typeof v120ComputeSummary==="function"?v120ComputeSummary(l):null;try{Store.save();}catch(e){}}
  var s=l.summary;if(!s)return;
  var d=Store.myData(),j=(d&&d.journal||[]).find(function(x){return x.tourId===t.id;});
  function same(a,b){if(a==null||b==null)return a==null&&b==null;return Number.isFinite(+a)&&Number.isFinite(+b)&&Math.abs(+a-(+b))<0.000001;}
  if(j&&j.metricSource==="gps"&&j.actualSummaryVersion===s.version&&same(j.km,s.distanceKm)&&same(j.up,s.elevationGainM)&&same(j.h,s.elapsedHours)&&same(j.activeHours,s.activeHours)&&same(j.averageSpeedKmh,s.averageActiveKmh))return;
  Store.completeTour(t.id,{doneAt:s.finishedAt?new Date(s.finishedAt).toISOString().slice(0,10):t.doneAt,title:j&&j.title||t.title,
    rating:j&&j.rating||0,note:j&&j.note||"",photos:j&&j.photos||[],mood:j&&j.mood||"",fav:j&&j.fav,lesson:j&&j.lesson||"",privacy:j&&j.privacy||"privát"});
}

function v130Summary(root,t){
  var l=v130Live(t);if(!root||!l)return;
  if(l.status==="finished"){
    t.status="teljesítve";t.projectStatus="TELJESÍTVE";t.doneAt=t.doneAt||new Date(l.finishedAt||Date.now()).toISOString().slice(0,10);t.v130CompletedAt=l.finishedAt||Date.now();v130EnsureGpsJournal(t);try{Store.save();}catch(e){}
  }
  var metrics=typeof v120ActualSummary==="function"?v120ActualSummary(l):null,active=l.status==="finished"&&metrics?metrics.activeMs:(typeof v120ActiveMs==="function"?v120ActiveMs(l):(+l.activeMs||0)),total=l.status==="finished"&&metrics&&metrics.elapsedMs!=null?metrics.elapsedMs:(typeof v120TotalMs==="function"?v120TotalMs(l):Math.max(0,(l.finishedAt||Date.now())-(l.startedAt||Date.now()))),actual=metrics?metrics.distanceM:(+l.distanceM||0),plan=v130Route(t),planned=plan&&Number.isFinite(+plan.distance_km)?+plan.distance_km*1000:(+t.lengthKm||0)*1000,hasElev=metrics?metrics.elevationGainM!=null:v130Elevation(l);
  function set(id,text){var e=root.querySelector(id);if(e)e.textContent=text;}
  var average=metrics?metrics.averageActiveKmh:(typeof v120AverageKmh==="function"?v120AverageKmh(actual,active):0);
  set("#v130-distance",v130Km(actual));set("#v130-total-distance",v130Km(actual));set("#v130-total",v130Time(total));set("#v130-active",v130Time(active));set("#v130-summary-active",v130Time(active));set("#v130-average",average.toFixed(1)+" km/h");set("#v130-summary-average",average.toFixed(1)+" km/h");set("#v130-max",((metrics&&metrics.maxSpeedKmh)||+l.maxSpeedKmh||0).toFixed(1)+" km/h");set("#v130-planned-vs-actual",planned>0?v130Km(planned)+" → "+v130Km(actual):"Nincs tervezett távadat");set("#v130-elevation",hasElev?(Math.round(metrics?metrics.elevationGainM:(+l.elevationGain||0))+" m"):
    "Nincs adat");set("#v130-points",String((l.points||[]).length));
  var status=root.querySelector("#v130-status");if(status)status.textContent=l.status==="finished"?"TÚRA TELJESÍTVE":l.status==="paused"?"SZÜNETELTETVE":"FOLYAMATBAN";
  var summary=root.querySelector("#v130-summary");if(summary)summary.hidden=l.status!=="finished";
  var share=root.querySelector("#v130-share");if(share)share.hidden=!(navigator.share&&v130Current(t));
  if(typeof v120MapDraw==="function")v120MapDraw(l.points||[]);
}

/* V130.9 — deterministic review derived only from the saved GPS recording.
   This is intentionally read-only: planned GPX and the local/cloud Store are untouched. */
function v130ReviewNumber(value){
  if(value==null||value==="")return null;
  try{var n=Number(value);return Number.isFinite(n)?n:null;}catch(e){return null;}
}
function v130ReviewTimestamp(value){
  var n=v130ReviewNumber(value);if(n!=null&&n>=0)return n;
  if(typeof value==="string"&&value.trim()){var parsed=Date.parse(value);return Number.isFinite(parsed)&&parsed>=0?parsed:null;}
  return null;
}
function v130ReviewPoint(point){
  if(!point||typeof point!=="object")return null;
  var lat=v130ReviewNumber(point.lat),lng=v130ReviewNumber(point.lng);
  if(lat==null||lng==null||lat< -90||lat>90||lng< -180||lng>180)return null;
  var accuracy=v130ReviewNumber(point.accuracy),altitude=v130ReviewNumber(point.altitude);
  return{lat:lat,lng:lng,accuracy:accuracy!=null&&accuracy>=0?accuracy:null,altitude:altitude,timestamp:v130ReviewTimestamp(point.timestamp)};
}
function v130ReviewCoordinates(line){
  if(!Array.isArray(line))return[];
  return line.map(function(p){
    if(Array.isArray(p))return v130ReviewPoint({lat:p[0],lng:p[1]});
    if(p&&typeof p==="object")return v130ReviewPoint({lat:p.lat!=null?p.lat:p.latitude,lng:p.lng!=null?p.lng:p.lon,accuracy:null,altitude:p.altitude!=null?p.altitude:p.ele});
    return null;
  }).filter(Boolean);
}
function v130ReviewPlan(t){
  var route=v130Route(t),line=route&&Array.isArray(route.track)?route.track:null;
  if(!line||line.length<2)line=t&&t.gpx&&Array.isArray(t.gpx.line)?t.gpx.line:null;
  var points=v130ReviewCoordinates(line||[]),distance=v130ReviewNumber(route&&(route.distance_km!=null?route.distance_km:route.distanceKm));
  if(distance==null||distance<=0){var fromTrack=v130ReviewTrackDistance(points);if(fromTrack!=null)distance=fromTrack/1000;}
  var tourDistance=v130ReviewNumber(t&&t.lengthKm);if((distance==null||distance<=0)&&tourDistance!=null&&tourDistance>0)distance=tourDistance;
  var ascent=v130ReviewNumber(route&&(route.elevation_gain_m!=null?route.elevation_gain_m:route.ascent));
  if(ascent==null)ascent=v130ReviewNumber(t&&t.ascent);
  return{points:points,distanceKm:distance!=null&&distance>0?distance:null,ascentM:ascent!=null&&ascent>=0?ascent:null,hasTrack:points.length>=2};
}
function v130ReviewTrackDistance(points){
  if(!Array.isArray(points)||points.length<2)return null;
  var total=0,segments=0;
  for(var i=1;i<points.length;i++){
    var a=points[i-1],b=points[i];if(!a||!b)continue;
    var m=typeof v120Distance==="function"?v120Distance(a,b):null;
    if(Number.isFinite(m)&&m>=0){total+=m;segments++;}
  }
  return segments&&Number.isFinite(total)?total:null;
}
function v130ReviewTrack(live){
  var raw=live&&Array.isArray(live.points)?live.points:[],indexed=raw.map(v130ReviewPoint),points=indexed.filter(Boolean),distanceM=v130ReviewTrackDistance(indexed),timestamps=points.filter(function(p){return p.timestamp!=null;}).length;
  var elevations=points.filter(function(p){return p.altitude!=null;}).map(function(p){return{lat:p.lat,lng:p.lng,altitude:p.altitude};}),elevation=null;
  if(elevations.length>=2&&typeof v120Elevation==="function"){try{var computed=v120Elevation(elevations);elevation=computed&&Number.isFinite(+computed.gain)&&+computed.gain>=0?+computed.gain:null;}catch(e){elevation=null;}}
  var accuracies=points.map(function(p){return p.accuracy;}).filter(function(n){return n!=null&&Number.isFinite(n)&&n>=0;}).sort(function(a,b){return a-b;}),medianAccuracy=accuracies.length?accuracies[Math.floor((accuracies.length-1)/2)]:null;
  var elapsedStart=v130ReviewTimestamp(live&&live.startedAt),elapsedEnd=v130ReviewTimestamp(live&&live.finishedAt),elapsedMs=elapsedStart!=null&&elapsedEnd!=null&&elapsedEnd>=elapsedStart?elapsedEnd-elapsedStart:null;
  var activeMs=v130ReviewNumber(live&&live.activeMs);if(activeMs==null&&live&&live.summary)activeMs=v130ReviewNumber(live.summary.activeMs);
  if(activeMs==null||activeMs<0)activeMs=null;
  var average=distanceM!=null&&activeMs!=null&&activeMs>0?distanceM*3600/activeMs:null;
  if(average!=null&&!Number.isFinite(average))average=null;
  var total=raw.length,valid=points.length,status;
  if(!total)status="Nincs rögzített GPS-pont.";
  else if(valid<2||distanceM==null)status="Kevés érvényes GPS-pont van a megtett út kiszámításához.";
  else if(valid<total||timestamps<valid||accuracies.length<valid)status="Részleges GPS-adatsor: egyes pontok, időbélyegek vagy pontossági adatok hiányoznak.";
  else status="A rögzített pontok koordinátái és időbélyegei elérhetők.";
  return{points:points,pointCount:{total:total,valid:valid,timestamped:timestamps,elevated:elevations.length,accuracy:accuracies.length},distanceM:distanceM,elapsedMs:elapsedMs,activeMs:activeMs,averageActiveKmh:average,elevationGainM:elevation,medianAccuracyM:medianAccuracy,completeness:status};
}
function v130ReviewPointToSegmentMeters(point,a,b){
  var rad=Math.PI/180,radius=6371000,cos=Math.cos(point.lat*rad);
  function xy(p){var deltaLng=((p.lng-point.lng+540)%360)-180;return{x:deltaLng*rad*radius*cos,y:(p.lat-point.lat)*rad*radius};}
  var p1=xy(a),p2=xy(b),dx=p2.x-p1.x,dy=p2.y-p1.y,den=dx*dx+dy*dy,t=den?Math.max(0,Math.min(1,-(p1.x*dx+p1.y*dy)/den)):0;
  var x=p1.x+t*dx,y=p1.y+t*dy,d=Math.sqrt(x*x+y*y);return Number.isFinite(d)?d:null;
}
function v130ReviewRouteFit(actual,planned){
  var points=actual&&actual.points||[],line=planned&&planned.points||[],accuracies=points.map(function(p){return p.accuracy;}).filter(function(n){return n!=null&&Number.isFinite(n)&&n>=0;}).sort(function(a,b){return a-b;});
  if(points.length<3||line.length<2||accuracies.length<3)return null;
  var median=accuracies[Math.floor((accuracies.length-1)/2)];if(!Number.isFinite(median)||median>120)return null;
  var tolerance=Math.min(150,Math.max(30,median*2)),within=0,totalDeviation=0,count=0;
  points.forEach(function(point){if(point.accuracy==null)return;var nearest=Infinity;for(var i=1;i<line.length;i++){var d=v130ReviewPointToSegmentMeters(point,line[i-1],line[i]);if(d!=null&&d<nearest)nearest=d;}if(Number.isFinite(nearest)){count++;totalDeviation+=nearest;if(nearest<=tolerance)within++;}});
  if(count<3)return null;
  return{sampleCount:count,withinTolerance:within,withinPercent:within/count*100,meanDeviationM:totalDeviation/count,toleranceM:tolerance};
}
function v130ReviewData(t){
  var live=v130Live(t);if(!live||live.status!=="finished")return null;
  var actual=v130ReviewTrack(live),planned=v130ReviewPlan(t),actualKm=actual.distanceM!=null?actual.distanceM/1000:null,delta=actualKm!=null&&planned.distanceKm!=null?actualKm-planned.distanceKm:null;
  var deltaPercent=delta!=null&&planned.distanceKm>0?delta/planned.distanceKm*100:null;
  return{title:String(t.title||"Saját túra"),actual:actual,planned:planned,comparison:{distanceDeltaKm:delta,distanceDeltaPercent:Number.isFinite(deltaPercent)?deltaPercent:null,routeFit:v130ReviewRouteFit(actual,planned)}};
}
function v130ReviewKm(km){return km==null||!Number.isFinite(km)?"Nincs adat":km.toFixed(2).replace(".",",")+" km";}
function v130ReviewTime(ms){return ms==null||!Number.isFinite(ms)||ms<0?"Nincs adat":v120FormatTime(ms);}
function v130ReviewSpeed(speed){return speed==null||!Number.isFinite(speed)||speed<0?"Nincs adat":speed.toFixed(1).replace(".",",")+" km/h";}
function v130ReviewDelta(data){
  var c=data.comparison;if(c.distanceDeltaKm==null)return"A tervezett és tényleges táv összevetéséhez nincs elegendő adat.";
  var sign=c.distanceDeltaKm>0?"+":c.distanceDeltaKm<0?"−":"",abs=Math.abs(c.distanceDeltaKm).toFixed(2).replace(".",",")+" km",pct=c.distanceDeltaPercent==null?"":" ("+(c.distanceDeltaPercent>0?"+":c.distanceDeltaPercent<0?"−":"")+Math.abs(c.distanceDeltaPercent).toFixed(1).replace(".",",")+"%)";
  return"A tényleges táv "+sign+abs+" eltérést mutat a tervezett távhoz képest"+pct+".";
}
function v130ReviewFitText(fit){
  if(!fit)return"A nyomvonal-követés nem értékelhető: ehhez legalább néhány GPS-pont, pontossági adat és tervezett nyomvonal szükséges.";
  return"A rögzített GPS-pontok "+fit.withinTolerance+" / "+fit.sampleCount+" esetben estek a tervezett nyomvonal körülbelül "+Math.round(fit.toleranceM)+" méteres környezetébe (átlagos eltérés: "+Math.round(fit.meanDeviationM)+" m). Ez tájékoztató összevetés; a GPS pontossága és mintavételezése befolyásolja.";
}
function v130ReviewShareText(t){
  var data=v130ReviewData(t);if(!data)return"";
  var a=data.actual,lines=["Túraértékelés — "+data.title,"Megtett táv: "+v130ReviewKm(a.distanceM==null?null:a.distanceM/1000),"Teljes idő: "+v130ReviewTime(a.elapsedMs),"Aktív rögzítési idő: "+v130ReviewTime(a.activeMs),"Átlagsebesség (aktív idő): "+v130ReviewSpeed(a.averageActiveKmh),"Szintemelkedés: "+(a.elevationGainM==null?"Nincs adat":Math.round(a.elevationGainM)+" m"),"Rögzített GPS-pontok: "+a.pointCount.valid+" / "+a.pointCount.total];
  if(data.planned.distanceKm!=null)lines.push("Tervezett táv: "+v130ReviewKm(data.planned.distanceKm));
  if(data.comparison.distanceDeltaKm!=null)lines.push(v130ReviewDelta(data));
  return lines.join("\n");
}
function v130ReviewCard(label,value,detail){return'<article class="v1309-review-metric"><span>'+label+'</span><strong>'+v130Esc(value)+'</strong>'+(detail?'<small>'+v130Esc(detail)+'</small>':"")+'</article>';}
function v130ReviewHtml(id){
  var t=v130Tour(id),inner;
  if(!t){inner='<main class="v1309-review"><div class="card panel"><h1>A túra nem található</h1><p class="muted">Ez a túra nem érhető el a saját adataid között.</p><a class="btn btn-soft" href="#/turaim">Vissza a túráimhoz</a></div></main>';return dash("#/turaim")(inner);}
  var live=v130Live(t),data=v130ReviewData(t);
  if(!data){inner='<main class="v1309-review"><a class="small muted" href="#/tura/'+v130Esc(t.id)+'">← Vissza a túratervhez</a><div class="card panel"><h1>Túraértékelés még nem érhető el</h1><p class="muted">A túra befejezett GPS-felvétele után jelenik meg az értékelés.</p></div></main>';return dash("#/tura-live/"+t.id)(inner);}
  var a=data.actual,c=data.comparison,j=(Store.myData().journal||[]).find(function(row){return row&&row.tourId===t.id;}),fit=v130ReviewFitText(c.routeFit),plannedText=data.planned.distanceKm==null?"Nincs adat":v130ReviewKm(data.planned.distanceKm),plannedAscent=data.planned.ascentM==null?"Nincs adat":Math.round(data.planned.ascentM)+" m",actualDistance=v130ReviewKm(a.distanceM==null?null:a.distanceM/1000),actualElevation=a.elevationGainM==null?"Nincs adat":Math.round(a.elevationGainM)+" m";
  var completeDetail=a.pointCount.timestamped+" / "+a.pointCount.valid+" pontban van időbélyeg · "+a.pointCount.elevated+" pont tartalmaz magasságot";
  inner='<main class="v1309-review" id="v1309-review" data-tour-id="'+v130Esc(t.id)+'">'+
    '<header class="v1309-review-hero"><a class="small muted" href="#/tura-live/'+v130Esc(t.id)+'">← Vissza a túra összesítőjéhez</a><span class="eyebrow">SAJÁT GPS-FELVÉTEL</span><h1>📊 Túraértékelés</h1><h2>'+v130Esc(t.title||"Saját túra")+'</h2><p class="muted">Az összegzés helyben, a mentett GPS-adatokból készült. A tervezett adatok csak összehasonlításra szolgálnak.</p></header>'+
    '<section class="v1309-review-grid" aria-label="Tényleges GPS-adatok">'+
      v130ReviewCard("Megtett táv",actualDistance,"A tényleges GPS-nyomvonalból")+
      v130ReviewCard("Teljes idő",v130ReviewTime(a.elapsedMs),"Kezdéstől a befejezésig")+
      v130ReviewCard("Aktív idő",v130ReviewTime(a.activeMs),"Aktív GPS-rögzítési idő")+
      v130ReviewCard("Átlagsebesség",v130ReviewSpeed(a.averageActiveKmh),"Aktív idő alapján")+
      v130ReviewCard("Szintemelkedés",actualElevation,a.elevationGainM==null?"Nincs elegendő GPS-magasságadat":"A rögzített magasságokból")+
      v130ReviewCard("GPS-pontok",a.pointCount.valid+" / "+a.pointCount.total,"Érvényes pont / összes rögzített pont")+
    '</section>'+
    '<section class="card panel v1309-review-section"><h2>Tervezett és tényleges út</h2><div class="v1309-review-compare">'+
      '<div><span>Tervezett táv</span><strong>'+v130Esc(plannedText)+'</strong><small>Tervezett szint: '+v130Esc(plannedAscent)+'</small></div>'+
      '<div><span>Tényleges GPS-táv</span><strong>'+v130Esc(actualDistance)+'</strong><small>Tényleges GPS-szint: '+v130Esc(actualElevation)+'</small></div></div>'+
      '<p>'+v130Esc(v130ReviewDelta(data))+'</p><p class="mb0">'+v130Esc(fit)+'</p><p class="small muted">'+(data.planned.hasTrack?"A tervezett GPX és a tényleges GPS-felvétel külön adatként marad meg.":"A tervezett GPX-nyomvonal nem érhető el; nyomvonal-egyezést ezért nem számítottunk.")+'</p></section>'+
    '<section class="card panel v1309-review-section"><h2>GPS-felvétel teljessége</h2><p><b>'+v130Esc(a.completeness)+'</b></p><p class="small muted mb0">'+v130Esc(completeDetail)+(a.medianAccuracyM==null?"":" · medián GPS-pontosság: ±"+Math.round(a.medianAccuracyM)+" m")+'</p></section>'+
    '<section class="card panel v1309-review-section"><h2>Rövid értékelés</h2><p>'+v130Esc(a.distanceM==null?"A rögzített adatokból még nem számítható megbízható távolság.":"A tényleges út "+actualDistance+" volt. "+(a.elapsedMs==null?"Az eltelt idő nem áll rendelkezésre.":"A túra teljes ideje "+v130ReviewTime(a.elapsedMs)+"; ebből "+v130ReviewTime(a.activeMs)+" aktív GPS-rögzítési idő."))+'</p><p>'+v130Esc(c.routeFit?"A nyomvonal-összevetés a mentett tervezett vonalhoz és a rögzített GPS-pontok pontosságához igazított, tájékoztató számítás.":"A nyomvonal követéséről nem vonunk le következtetést, mert a szükséges adatok nem állnak teljesen rendelkezésre.")+'</p><p class="small muted mb0">Az értékelés nem minősíti a túra biztonságát vagy egészségügyi terhelését.</p></section>'+
    '<section class="card panel v1309-review-section"><div class="flex between wrapcol"><h2>Kapcsolódó túranapló</h2><a class="btn btn-soft btn-sm" href="#/naplo">Túranapló megnyitása</a></div>'+(j&&j.note?'<p class="mb0">„'+v130Esc(j.note)+'”</p>':'<p class="muted mb0">Ehhez a túrához még nincs szöveges naplóbejegyzés.</p>')+'</section>'+
    '<div class="v1309-review-actions"><a class="btn btn-soft" href="#/tura/'+v130Esc(t.id)+'">Tervezett túra és útvonal</a><button class="btn btn-primary" id="v1309-copy-summary">Összefoglaló másolása</button></div><p class="small muted">A másolható szöveg nem tartalmaz koordinátákat vagy GPS-nyomvonalat.</p></main>';
  return dash("#/tura-live/"+t.id)(inner);
}
VIEWS.tourReview=v130ReviewHtml;
VIEWS.tourReview.after=function(root,id){
  var button=root&&root.querySelector("#v1309-copy-summary");if(!button)return;
  button.onclick=function(){var text=v130ReviewShareText(v130Tour(id));if(!text)return;
    function copied(){v130Toast("A túraösszefoglaló a vágólapra került.","📋");}
    function fallback(){var area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();var ok=false;try{ok=document.execCommand("copy");}catch(e){}area.remove();if(ok)copied();else v130Toast("A másolás nem sikerült; próbáld újra.","📋");}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(copied).catch(fallback);else fallback();
  };
};

function v130Html(t){
  var l=v130Live(t), finished=l&&l.status==="finished", plan=v130Route(t), pstart=t&&t.routeStart||plan&&plan.start, pend=t&&t.routeEnd||plan&&plan.finish;
  var wrap=typeof dash==="function"?dash("#/tura/"+t.id):"";
  var inner='<main id="v120-root" class="v130-mode" data-v130-mode="1" data-tour-id="'+v130Esc(t.id)+'">'+
    '<div class="v130-top"><a class="small muted" href="#/tura/'+v130Esc(t.id)+'">← Túra részletei</a><span class="v130-live-badge" id="v130-status">'+(finished?"TÚRA TELJESÍTVE":l&&l.status==="paused"?"SZÜNETELTETVE":"FOLYAMATBAN")+'</span></div>'+
    '<section class="v130-title card"><div><span class="eyebrow">TÚRA MÓD</span><h1>🥾 '+v130Esc(t.title||"Saját túra")+'</h1><p class="muted mb0">'+v130Esc((pstart&&pstart.label)||t.place||"Indulási pont")+' → '+v130Esc((pend&&pend.label)||"Célpont")+'</p></div><div class="small muted">'+(navigator.onLine===false?"📱 Offline":"☁️ Helyi GPS-rögzítés")+'</div></section>'+
    '<div id="v121-offline" class="v121-offline" role="status" hidden>📱 Offline – a túra helyben mentve</div><div id="v121-offroute" class="v121-offroute" role="alert" hidden>⚠️ Letértél a tervezett útvonalról</div>'+
    '<section class="v130-map-wrap card"><div class="v130-map-legend"><span><i class="v130-dot plan"></i> Tervezett útvonal</span><span><i class="v130-dot actual"></i> Megtett útvonal</span><span><i class="v130-dot rejoin"></i> Vissza az útvonalra</span></div><div class="v120-map" id="v120-map"><div class="empty"><span class="em-ico">🗺️</span><h3>GPS-térkép</h3><p>A tervezett útvonal és a valódi GPS-nyomvonal itt jelenik meg.</p></div></div></section>'+
    '<section class="v130-stats"><div><span>MEGTETT</span><strong id="v130-distance">0,00 km</strong></div><div><span>IDŐ</span><strong id="v130-active">00:00:00</strong></div><div><span>SEBESSÉG</span><strong id="v120-speed">0,0 km/h</strong></div><div><span>ÁTLAG (AKTÍV IDŐ)</span><strong id="v130-average">0,0 km/h</strong></div><div><span>GPS PONT</span><strong id="v130-points">0</strong></div><div><span>GPS PONTOSSÁG</span><strong id="v120-accuracy">Nincs adat</strong></div></section>'+
    '<section class="v130-controls v120-controls"><button class="btn btn-soft btn-lg" id="v120-pause">⏸ SZÜNET</button><button class="btn btn-primary btn-lg" id="v120-resume" hidden>▶ FOLYTATÁS</button><button class="btn btn-danger btn-lg" id="v120-finish"'+(finished?" hidden":"")+'>✅ TÚRA BEFEJEZÉSE</button></section>'+
    '<section class="v130-actions"><button class="btn btn-ghost" id="v130-locate">📍 HOL VAGYOK?</button><button class="btn btn-ghost" id="v130-rejoin">🧭 VISSZA AZ ÚTVONALRA</button><button class="btn btn-ember" id="v130-help">🆘 SEGÍTSÉG</button><button class="btn btn-ghost" id="v130-share" hidden>📍 Hely megosztása</button></section>'+
    '<section class="v130-summary card" id="v130-summary" hidden><span class="eyebrow">TELJESÍTÉSI ÖSSZEGZÉS</span><h2>🥾 TÚRA TELJESÍTVE</h2><a class="btn btn-soft" href="#/tura-ertekeles/'+v130Esc(t.id)+'">📊 Túraértékelés megnyitása</a><div class="v130-summary-grid"><div><span>Megtettem</span><b id="v130-total-distance">0,00 km</b></div><div><span>Teljes idő</span><b id="v130-total">00:00:00</b></div><div><span>Mozgásban</span><b id="v130-summary-active">00:00:00</b></div><div><span>Átlagsebesség (aktív idő)</span><b id="v130-summary-average">0,0 km/h</b></div><div><span>Legnagyobb sebesség</span><b id="v130-max">Nincs adat</b></div><div><span>Szintemelkedés</span><b id="v130-elevation">Nincs adat</b></div></div><p class="small muted">Tervezett → tényleges táv: <b id="v130-planned-vs-actual">Nincs adat</b></p><div class="flex wrap" style="gap:.5rem"><button class="btn btn-primary" id="v130-journal">📖 Élmény mentése</button><a class="btn btn-soft" href="#/tura/'+v130Esc(t.id)+'">Vissza a túratervhez</a></div></section>'+
    '</main>';
  return typeof wrap==="function"?wrap(inner):inner;
}

function v130Coords(t){var p=v130Current(t);return p&&Number.isFinite(+p.lat)&&Number.isFinite(+p.lng)?p:null;}
function v130Copy(t){var p=v130Coords(t);if(!p){v130Toast("Még nincs elérhető GPS-pozíció.","📍");return;}var text=Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6);var done=function(){v130Toast("A koordináták a vágólapra kerültek.","📋");};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(function(){done();});}else{var a=document.createElement("textarea");a.value=text;document.body.appendChild(a);a.select();try{document.execCommand("copy");}catch(e){}a.remove();done();}}
function v130Locate(t){var p=v130Coords(t),m=window.__V120_MAP;if(!p){v130Toast("Még nincs GPS-pozíció.","📍");return;}if(m&&m.setView)m.setView([p.lat,p.lng],Math.max(m.getZoom?m.getZoom():15,15));v130Copy(t);}
function v130Help(t){var p=v130Coords(t),text=p?Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6):"Nincs elérhető GPS-pozíció.";openModal({title:"🆘 Segítség",body:'<p class="mt0">A Túratárs nem indít automatikus segélyhívást.</p><div class="card panel"><b>Jelenlegi koordináták</b><p class="mono" id="v130-help-coords">'+v130Esc(text)+'</p><p class="small muted">Pontosság: '+(p&&p.accuracy!=null?"±"+Math.round(p.accuracy)+" m":"Nincs adat")+'</p></div>',footer:'<div class="flex wrap" style="gap:.5rem"><button class="btn btn-soft" id="v130-help-copy">📋 Koordináták másolása</button><button class="btn btn-ghost" id="v130-help-close" data-close>Bezárás</button></div>',onOpen:function(r){var b=r.querySelector("#v130-help-copy");if(b)b.onclick=function(){v130Copy(t);};}});}
function v130Share(t){var p=v130Coords(t);if(!p||!navigator.share)return;navigator.share({title:t.title||"Túra helyzete",text:"Jelenlegi túrapozíció: "+Number(p.lat).toFixed(6)+", "+Number(p.lng).toFixed(6),url:"https://www.openstreetmap.org/?mlat="+p.lat+"&mlon="+p.lng+"#map=16/"+p.lat+"/"+p.lng}).catch(function(){});}
function v130Rejoin(t){
  var p=v130Coords(t),plan=v130PlanPoints(t);if(!p){v130Toast("A visszaút tervezéséhez előbb kell egy GPS-pont.","📍");return;}
  if(!plan.length){v130Toast("Ehhez a túrához nincs betöltött tervezett útvonal.","🧭");return;}
  if(navigator.onLine===false){v130Toast("Offline módban az előre betöltött útvonal használható; új visszaút nem tervezhető.","📱");return;}
  var target={lat:plan[0][0],lng:plan[0][1],label:"Az útvonal kezdőpontja"};
  if(!window.V127Routing||typeof window.V127Routing.plan!=="function"){v130Toast("A valódi visszaút-tervező most nem érhető el.","🧭");return;}
  v130Toast("Valós visszaút tervezése…","🧭");window.V127Routing.plan({lat:+p.lat,lng:+p.lng,label:"Aktuális GPS-pozíció"},target,"hiking").then(function(out){var r=out&&out.routes&&out.routes[0];if(!r||!Array.isArray(r.track)||r.track.length<2)throw new Error("A szolgáltató nem adott vissza használható visszaútvonalat.");window.__V130_REJOIN_POINTS=r.track.map(function(x){return[+x[0],+x[1]];});t.liveTrack.rejoinRoute={source:"openrouteservice",createdAt:new Date().toISOString(),distanceM:r.distanceM,durationS:r.durationS};Store.save();if(typeof v120MapDraw==="function")v120MapDraw(t.liveTrack.points||[]);v130Toast("Valós visszaút készült az útvonalhoz ("+((+r.distanceM||0)/1000).toFixed(1).replace(".",",")+" km).","🧭");}).catch(function(e){v130Toast(e&&e.message?e.message:"A visszaút-tervezés nem sikerült.","🧭");});
}
function v130Journal(t){if(typeof openMemoryEditor==="function")openMemoryEditor(t,false);else NAV.to("#/naplo");}

function v130Wire(root,id){
  var t=v130Tour(id);if(!root||!t)return;
  var b=root.querySelector("#v130-locate");if(b)b.onclick=function(){v130Locate(t);};
  b=root.querySelector("#v130-help");if(b)b.onclick=function(){v130Help(t);};
  b=root.querySelector("#v130-share");if(b)b.onclick=function(){v130Share(t);};
  b=root.querySelector("#v130-rejoin");if(b)b.onclick=function(){v130Rejoin(t);};
  b=root.querySelector("#v130-journal");if(b)b.onclick=function(){v130Journal(t);};
  v130Summary(root,t);
}

/* A V120/V121 handler marad az egyetlen GPS-motor; itt csak a valós
   sebességből vezetjük le a túra mód legnagyobb sebességét. */
var baseHandle=window.v120HandlePosition;
if(typeof baseHandle==="function")window.v120HandlePosition=function(id,pos){baseHandle(id,pos);var t=v130Tour(id),l=v130Live(t);if(!l)return;l.maxSpeedKmh=Math.max(+l.maxSpeedKmh||0,+l.speedKmh||0);try{Store.save();if(window.__V121&&typeof window.__V121.backup==="function")window.__V121.backup(t);}catch(e){}var root=document.getElementById("v120-root");if(root)v130Summary(root,t);};

var baseFinish=window.v120Finish;
if(typeof baseFinish==="function")window.v120Finish=function(id){baseFinish(id);var t=v130Tour(id),l=v130Live(t);if(!t||!l)return;t.status="teljesítve";t.projectStatus="TELJESÍTVE";t.doneAt=t.doneAt||new Date(l.finishedAt||Date.now()).toISOString().slice(0,10);t.v130CompletedAt=l.finishedAt||Date.now();try{Store.save();}catch(e){}if(typeof render==="function")render();};

var baseLive=VIEWS.liveTour,baseAfter=VIEWS.liveTour.after;
VIEWS.liveTour=function(id){var t=v130Tour(id);if(t&&window.__V129&&window.__V129.ensure){window.__V129.ensure(t);window.__V129.hydrateRoute(t);}return t?v130Html(t):baseLive(id);};
VIEWS.liveTour.after=function(root,id){
  var t=v130Tour(id),plan=v130PlanPoints(t);window.__V130_PLAN_POINTS=plan;window.__V130_REJOIN_POINTS=null;
  try{baseAfter&&baseAfter(root,id);}catch(e){}
  if(!root||!t)return;v130Wire(root,id);v130Summary(root,t);
  ["#v120-pause","#v120-resume"].forEach(function(sel){var control=root.querySelector(sel);if(!control||control.dataset.v130Wrapped)return;var prior=control.onclick;control.dataset.v130Wrapped="1";control.onclick=function(ev){if(typeof prior==="function")prior.call(this,ev);var refresh=function(){var x=v130Tour(id);if(x)v130Summary(root,x);};setTimeout(refresh,0);setTimeout(refresh,260);};});
  if(v130Timer)clearInterval(v130Timer);v130Timer=setInterval(function(){var x=v130Tour(id);if(x){v130Summary(root,x);if(x.liveTrack&&x.liveTrack.status==="finished")clearInterval(v130Timer);}},250);
};

/* A projektből induló gomb ugyanabba a V120 belépési pontba vezet. */
var wsAfter=VIEWS.workspace&&VIEWS.workspace.after;
if(wsAfter) VIEWS.workspace.after=function(root,id){
  wsAfter(root,id);var b=root&&root.querySelector("#v120-start");if(b)b.textContent="▶ TÚRA INDÍTÁSA";var p=root&&root.querySelector("#v129-gps-start");if(p)p.textContent="▶ TÚRA INDÍTÁSA";
  var t=v130Tour(id),live=v130Live(t),host=root&&root.querySelector(".ws-actions");
  if(t&&live&&live.status==="finished"&&host&&!host.querySelector("[data-v130-review-link]")){var link=document.createElement("a");link.className="btn btn-soft btn-sm";link.href="#/tura-ertekeles/"+encodeURIComponent(t.id);link.textContent="📊 Túraértékelés";link.setAttribute("data-v130-review-link","");host.insertBefore(link,host.firstChild);}
};

function css130(){if(document.getElementById("v130-css"))return;var s=document.createElement("style");s.id="v130-css";s.textContent='.v130-mode{max-width:980px;margin:0 auto;padding:clamp(.75rem,2vw,1.5rem) clamp(.65rem,3vw,1.25rem) 5rem;background:var(--paper)}.v130-top{display:flex;justify-content:space-between;align-items:center;gap:.6rem;margin-bottom:.65rem}.v130-live-badge{font-size:.74rem;font-weight:800;letter-spacing:.1em;color:var(--leaf)}.v130-title{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:.65rem}.v130-title h1{margin:.25rem 0;font-size:clamp(1.25rem,4vw,2rem)}.v130-map-wrap{padding:.55rem;position:relative}.v130-map-wrap #v120-map{height:clamp(310px,58vh,560px);min-height:310px;border-radius:14px;overflow:hidden}.v130-map-legend{display:flex;gap:.75rem;flex-wrap:wrap;font-size:.78rem;color:var(--ink-soft);padding:.25rem .2rem .55rem}.v130-dot{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:.2rem}.v130-dot.plan{background:var(--leaf);border:2px dashed var(--leaf)}.v130-dot.actual{background:var(--ember)}.v130-dot.rejoin{background:#3A79A8}.v130-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.55rem;margin:.7rem 0}.v130-stats>div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:.75rem .6rem;text-align:center}.v130-stats span,.v130-summary-grid span{display:block;font-size:.68rem;letter-spacing:.08em;color:var(--ink-soft);font-weight:700}.v130-stats strong{display:block;font-size:clamp(1.1rem,4vw,1.65rem);margin-top:.18rem}.v130-controls,.v130-actions{display:flex;gap:.55rem;flex-wrap:wrap;margin:.65rem 0}.v130-controls .btn{flex:1;min-height:54px}.v130-actions .btn{min-height:46px}.v130-summary{margin-top:1rem;border-left:4px solid var(--leaf)}.v130-summary h2{margin:.3rem 0 .8rem}.v130-summary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem}.v130-summary-grid>div{padding:.55rem;background:var(--sand);border-radius:10px}.v130-summary-grid b{display:block;margin-top:.2rem}.v130-offline{margin:.5rem 0}.v130-mode .v121-offline,.v130-mode .v121-offroute{border-radius:12px;padding:.65rem .8rem;margin:.55rem 0;font-weight:700}.v130-mode .v121-offline{background:#fff3d6;color:#7a571d}.v130-mode .v121-offroute{background:#ffe2dc;color:#8c3b24}@media(max-width:600px){.v130-title{align-items:flex-start;flex-direction:column}.v130-map-wrap #v120-map{height:48vh;min-height:280px}.v130-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.v130-controls{position:sticky;bottom:.35rem;z-index:5;background:color-mix(in srgb,var(--paper) 92%,transparent);padding:.35rem 0}.v130-controls .btn{flex:1 1 45%;min-height:54px}.v130-actions .btn{flex:1 1 45%;min-height:48px}.v130-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.v130-top .small{font-size:.78rem}}';document.head.appendChild(s);}
if(typeof addEventListener==="function")addEventListener("DOMContentLoaded",css130);else css130();
window.__V130={version:V130_VERSION,planPoints:v130PlanPoints,summary:v130Summary,review:v130ReviewData,reviewShareText:v130ReviewShareText,copyCoords:v130Copy,rejoin:v130Rejoin};
})();
