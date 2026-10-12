import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { chromium } = await import(pathToFileURL(process.env.TT_PLAYWRIGHT_PATH).href);
const browser = await chromium.launch({ headless: true, executablePath: process.env.TT_EDGE_PATH });
const base = (process.env.TT_PREVIEW_URL || 'http://127.0.0.1:4175/').replace(/#.*$/, '');
const pageErrors = [], consoleErrors = [];
const tourId = 't-v1305-gps';
const plannedGpx = { name: 'Az eredeti tervezett GPX', pts: [{lat:46.36,lng:25.8,ele:700,time:null},{lat:46.37,lng:25.81,ele:820,time:null}], line: [[46.36,25.8],[46.37,25.81]], elev: [700,820] };

function seed(cfg) {
  const now = Date.now(), tenKmLongitude = 10000 / 6371000 * 180 / Math.PI;
  const tour = { id: cfg.tourId, title: 'V130.5 tényleges GPS próba', place: 'Csíkszereda', region: 'Hargita', status: 'teljesítve',
    projectStatus: 'TELJESÍTVE', date: '2026-10-12', doneAt: '2026-10-12', difficulty: 'Közepes', lengthKm: 28, ascent: 1200, durationH: 6,
    coords: {lat:46.36,lng:25.8}, gpx: cfg.plannedGpx, routeId: null, liveTrack: { version: 1, status: 'finished', startedAt: now-3600000,
      finishedAt: now, activeMs: 1800000, segmentStartedAt: null, pausedAt: null,
      points: [{lat:0,lng:0,timestamp:now-3600000,accuracy:5,altitude:null},{lat:0,lng:tenKmLongitude,timestamp:now,accuracy:5,altitude:null}],
      distanceM: 10000, speedKmh: 5, maxSpeedKmh: 7, elevationGain: 0, elevationLoss: 0 },
    timeline: [], gear: [], participants: [], cars: [], food: [], safety: [], notes: '', photos: [], tasks: [], budget: [], packList: [], projectGearIds: [], tags: [] };
  const planned = { ...tour, id: 't-v1305-not-done', title: 'Még csak terv', status: 'tervezés', projectStatus: 'TERVEZETT', liveTrack: null,
    lengthKm: 42, ascent: 2000, durationH: 9, gpx: null };
  const wishlistPlan = { ...planned, id: 't-v1305-wishlist', title: 'Még csak bakancslista', status: 'bakancs' };
  const data = { tours: [tour, planned, wishlistPlan], routes: [], wishlist: [], savedEvents: [], equipment: [], journal: [
    {id:'j-v1305-plan',tourId:planned.id,title:planned.title,date:'2026-10-12',km:42,up:2000,h:9,note:'',photos:[]},
    {id:'j-v1305-wishlist',tourId:wishlistPlan.id,title:wishlistPlan.title,date:'2026-10-12',km:55,up:2400,h:12,note:'',photos:[]}
  ], teams: [], goals: {km:300,tours:12,summits:3}, notifDismiss: [], prefs: {weather:false,reminders:false}, aiChat: [], templates: [],
    terepi: [], reportAck: {}, challenges: null, widgets: null, inbox: [] };
  if (!localStorage.getItem('turavaros_v1')) {
    localStorage.setItem('turavaros_v1', JSON.stringify({ users: {'u-v1305': {id:'u-v1305',name:'V130.5 teszt',email:'v1305@test.invalid',pass:'local:test',onboarded:true}},
      data: {'u-v1305':data}, session:'u-v1305' }));
    localStorage.setItem('turatars_v54_settings_v1', JSON.stringify({offers:{'v1305@test.invalid':Date.now()}}));
  }
  sessionStorage.setItem('v1305-planned-gpx', JSON.stringify(cfg.plannedGpx));
  window.__v1305TenKmLongitude = tenKmLongitude;
  Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { watchPosition(){ return 1; }, clearWatch(){} } });
}

try {
  const context = await browser.newContext({ viewport: {width:390,height:844} });
  await context.route('**/*.supabase.co/**', route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => { if(message.type()==='error'&&!/Failed to load resource|net::ERR_/i.test(message.text()))consoleErrors.push(message.text()); });
  await page.addInitScript(seed,{tourId,plannedGpx});
  await page.goto(base+'#/tura-live/'+tourId,{waitUntil:'networkidle'});
  await page.waitForFunction(id => (Store.myData().journal||[]).some(j=>j.tourId===id&&j.metricSource==='gps'),tourId);

  const calculations = await page.evaluate(() => {
    const pts=(distanceM)=>[{lat:0,lng:0,altitude:100,timestamp:1000},{lat:0,lng:distanceM/6371000*180/Math.PI,altitude:108,timestamp:3601000}];
    const oneHour=window.__V120.computeSummary({distanceM:999,startedAt:1000,finishedAt:3601000,activeMs:3600000,points:pts(10000)});
    const halfHour=window.__V120.computeSummary({distanceM:999,startedAt:1000,finishedAt:1801000,activeMs:1800000,points:pts(5000)});
    const zero=window.__V120.computeSummary({startedAt:1000,finishedAt:1000,activeMs:0,points:pts(10000)});
    const single=window.__V120.computeSummary({distanceM:10000,startedAt:1000,finishedAt:1000,activeMs:0,points:[{lat:0,lng:0,altitude:null,timestamp:1000}]});
    const missingElevation=window.__V120.computeSummary({distanceM:10000,startedAt:1000,finishedAt:3601000,activeMs:3600000,points:[{lat:0,lng:0,altitude:null},{lat:0,lng:.1,altitude:null}]});
    const paused={startedAt:1000,status:'paused',activeMs:900000,pausedAt:1801000};
    const resumed={...paused,status:'running',segmentStartedAt:1801000};
    const invalidLat=window.__V120.acceptPoint({points:[]},{lat:91,lng:0,timestamp:2000});
    const invalidLng=window.__V120.acceptPoint({points:[]},{lat:0,lng:181,timestamp:2000});
    return {oneHour,halfHour,zero,single,missingElevation,pausedActive:window.__V120.activeMs(paused,1801000),pausedElapsed:window.__V120.totalMs({...paused,finishedAt:1801000},1801000),
      resumedActive:window.__V120.activeMs(resumed,2701000),resumedElapsed:window.__V120.totalMs({...resumed,finishedAt:2701000},2701000),invalidLat,invalidLng};
  });
  assert.ok(Math.abs(calculations.oneHour.averageActiveKmh-10)<0.01,'10 km over one active hour is 10 km/h');
  assert.ok(Math.abs(calculations.halfHour.averageActiveKmh-10)<0.01,'5 km over 30 active minutes is 10 km/h');
  assert.equal(calculations.zero.averageActiveKmh,0); assert.ok(Number.isFinite(calculations.zero.averageActiveKmh));
  assert.equal(calculations.single.distanceM,0,'A single point cannot imply traveled distance.');
  assert.equal(calculations.missingElevation.elevationGainM,null,'No altitude data must remain unknown.');
  assert.equal(calculations.pausedActive,900000); assert.equal(calculations.pausedElapsed,1800000);
  assert.equal(calculations.resumedActive,1800000); assert.equal(calculations.resumedElapsed,2700000);
  assert.equal(calculations.invalidLat.ok,false); assert.equal(calculations.invalidLng.ok,false);

  const initial = await page.evaluate(id => {
    const t=Store.getTour(id),j=Store.myData().journal.find(x=>x.tourId===id),s=Store.stats();
    return {summary:t.liveTrack.summary,journal:structuredClone(j),stats:{tours:s.tours,km:s.km,up:s.up,h:s.h},plannedGpx:structuredClone(t.gpx),
      plannedGpxOriginal:JSON.parse(sessionStorage.getItem('v1305-planned-gpx'))};
  },tourId);
  assert.ok(Math.abs(initial.journal.km-10)<0.01,'Journal uses measured GPS distance, not the 28 km planned route.');
  assert.equal(initial.journal.h,1,'Journal stores elapsed time (recording start to finish, including pause).');
  assert.equal(initial.journal.activeHours,0.5,'Active time remains separately available.');
  assert.ok(Math.abs(initial.journal.averageSpeedKmh-20)<0.01,'Active-time average is explicit and correct for the paused track.');
  assert.equal(initial.journal.up,null,'Missing GPS elevations are not replaced with planned ascent.');
  assert.equal(initial.journal.metricSource,'gps');
  assert.deepEqual(initial.plannedGpx,initial.plannedGpxOriginal,'Finishing GPS must preserve the planned GPX.');
  assert.equal(initial.stats.tours,1,'The unfinished tour with a stray journal row is excluded.');
  assert.ok(Math.abs(initial.stats.km-10)<0.01); assert.equal(initial.stats.h,1);

  const duplicateStats=await page.evaluate(id=>{const d=Store.myData();d.journal.unshift({id:'j-v1305-old-duplicate',tourId:id,km:28,up:1200,h:6,updatedAt:'2026-10-11T00:00:00Z'});const s=Store.stats();d.journal.shift();return {tours:s.tours,km:s.km,h:s.h};},tourId);
  assert.equal(duplicateStats.tours,1,'Duplicate journal rows for one tour count once.');
  assert.ok(Math.abs(duplicateStats.km-10)<0.01,'GPS-derived metrics win over stale planned/legacy duplicate rows.');

  const repeated = await page.evaluate(id => {
    Store.completeTour(id,{km:999,h:99,up:999,note:'GPS-adat megtartása'});
    const d=Store.myData(),t=Store.getTour(id),rows=d.journal.filter(j=>j.tourId===id),s=Store.stats();
    return {rows:rows.length,journal:structuredClone(rows[0]),stats:{tours:s.tours,km:s.km,h:s.h},gpx:structuredClone(t.gpx)};
  },tourId);
  assert.equal(repeated.rows,1,'Repeated completion updates one journal row.');
  assert.ok(Math.abs(repeated.journal.km-10)<0.01); assert.equal(repeated.journal.h,1); assert.equal(repeated.journal.up,null);
  assert.equal(repeated.journal.note,'GPS-adat megtartása'); assert.equal(repeated.stats.tours,1); assert.ok(Math.abs(repeated.stats.km-10)<0.01);
  assert.deepEqual(repeated.gpx,initial.plannedGpx);

  const savedId=repeated.journal.id;
  await page.reload({waitUntil:'networkidle'});
  const reloaded=await page.evaluate(id=>{const j=Store.myData().journal.find(x=>x.tourId===id);const s=Store.stats();return {j:structuredClone(j),stats:{tours:s.tours,km:s.km,h:s.h},summary:structuredClone(Store.getTour(id).liveTrack.summary)};},tourId);
  assert.equal(reloaded.j.id,savedId,'Reopening retains the same journal record.');
  assert.equal(reloaded.j.km,repeated.journal.km);assert.equal(reloaded.j.h,repeated.journal.h);assert.equal(reloaded.j.up,null);
  assert.equal(reloaded.stats.tours,1);assert.ok(Math.abs(reloaded.stats.km-10)<0.01);assert.equal(reloaded.stats.h,1);
  assert.ok(Math.abs(reloaded.summary.distanceKm-10)<0.01);assert.equal(reloaded.summary.elapsedHours,1);assert.equal(reloaded.summary.activeHours,0.5);

  await page.goto(base+'#/naplo',{waitUntil:'networkidle'});
  const entry=page.locator('.mem').filter({hasText:'V130.5 tényleges GPS próba'}).first();
  await entry.waitFor();
  const journalText=await entry.innerText();
  assert.match(journalText,/10[,.]00\s+km/);assert.match(journalText,/—\s*m/);assert.match(journalText,/Eltelt:\s*1\.00\s+ó/);

  await page.evaluate(id=>window.finishFlow(Store.getTour(id),true),'t-v1305-not-done');
  await page.locator('#fw-next').click();
  const wizardMetrics=await page.evaluate(()=>({km:document.querySelector('#fw-km')?.value,h:document.querySelector('#fw-h')?.value}));
  assert.deepEqual(wizardMetrics,{km:'',h:''},'An unfinished plan with stale journal fields must not prefill completion metrics.');
  for(let step=0;step<4;step++)await page.locator('#fw-next').click();
  const manualCompletion=await page.evaluate(id=>{const j=Store.myData().journal.find(x=>x.tourId===id);return {status:Store.getTour(id).status,km:j.km,up:j.up,h:j.h};},'t-v1305-not-done');
  assert.deepEqual(manualCompletion,{status:'teljesítve',km:null,up:null,h:null},'Completing without actual GPS/manual values must not retain planned metrics.');
  assert.deepEqual(pageErrors,[],pageErrors.join('\n'));assert.deepEqual(consoleErrors,[],consoleErrors.join('\n'));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=390,'390px mobile viewport has no horizontal overflow.');
  console.log(JSON.stringify({metrics:{oneHourKmh:calculations.oneHour.averageActiveKmh,halfHourKmh:calculations.halfHour.averageActiveKmh,
    completedKm:reloaded.j.km,elapsedHours:reloaded.j.h,activeHours:reloaded.j.activeHours,elevation:reloaded.j.up},plannedGpxPreserved:true,
    noDuplicate:true,plannedTourExcluded:true,reloadStable:true,mobile390:true,pageerror:0,consoleError:0},null,2));
  console.log('V130.5 actual GPS statistics and journal browser test PASS');
} finally { await browser.close(); }
