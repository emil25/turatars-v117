# DATA MODEL (V117) — minden fő objektum

Jelmagyarázat: **_owner_**: ki látja (private = csak a record userének `data`-ja / szűrt e-mail).
**Verzió**: amelyik V-ben jelent meg. Kötelező mezők hiányában az UI "—"／"nincs adat" — soha fake.

## user (V41) — `db.users[u_x]`
`id*` , `email*` (kisbetűs; ez a community-kulcs), `name*`, `pass*` (djb2 — a V54 PBKDF2 csak a vaultban van), `city, onboarded, joined, bio?` (V50 szerkeszti: name/bio)

## tour / Trip Project (V41) — `data.tours[t_x]`
Kötelező: `id,title,place,region?,date, status ∈ STATUSES`. 
Mezők: `status(ötlet|bakancs|tervezés|közelgő|folyamatban|teljesítve|archiválva|jelentkezve)`,
`days, lengthKm, ascent, descent?, durationH (időtartam ó), difficulty, tags[], img, coords{lat,lng,name}|null, waypoints[], gpx(null), gpxUrl?`,
`timeline[] (V43/V41: id/time/act/owner?), gear[](V41: name/cat/icon/w/checked/own?/host?(V53)/hostUid?), food[](n/i/checked/w), participants[](V41: name/avatar/role/confirmed; V53: uid/at/via), cars[] (util?), budget[](item/sum/payer?/settled?), tasks[](t/done/host/hostUid), notes, photos[], notesStream? via noteStream[](V45: text/at/owner?), safety[](V41: n/checked), extRef?, eventRef?, eventCat?, routeId?, evsRev?(V53), timeHint, meeting, weatherChecked, shareCode?, budgetTotal?, plan? 
`readiness(t)`, `tourCheck(t)` számított. Dedup: `extRef` (V49) és `eventRef`. Owner: record data host.

## route (V47) — ld. GPX.md — `data.routes[rt_x]`
`id,name, distance_km?, elevation_gain_m?, elevation_loss_m?, max/min_elevation_m?, track[[la,ln,el,time]], nPts, wpts[], raw?, fp?/`__fp?`, created_at, linkedTripId?, ownerEvent?(V53)`

## journal / Élmény (V42) — `data.journal[j_x]`
`id, tourId*, title, date, km?, up?, h?, rating?, note, photos[], mood?, lesson?, privacy, updatedAt` — **dedup kulcs: `tourId`** (completeTour merge), a stats ebből + tours statusTeljesített∪archivált.

## wishlist (V41/V49) — `data.wishlist[w_x]`
`id, ref* (f9:t:…, f9:e:p2-…, inbox_…), name, cat, place?, diff?, img?; custom?`, addedAt` — dedup: `ref`.

## equipment (V41) — `data.equipment[eq_x]`
`id, name, cat, has*, w(gramm), cond?, expiry?, notes?` — "saját tétel" = `has:true`.

## inbox (V41→V46) — `data.inbox[ib_x]`
`id, type(link|event|photo|note|tour|place), title, url/source_url?, host?, source_type?, description?, date?, time?, location?, organizer?, distance_km?, elevation_gain?, duration?, difficulty?, image? (dataURL), note?, status(new|wish|trip|read), linkedWishId?, linkedTourId?, read, at, created_at` — dedup: `source_url` vagy title-norm (ibDedup).

## calendar (V41, dashboard.js)
NEM entitás — nézet: `data.tours[].date` + a `db.savedEvents(e/ p2-…)` + a `d.savedEvents` `p2-<evid>` kulcsok → a V42 events pool. Nincs külön tárolás.

## task (V41/V49/V53) — `tour.tasks[]`
`{id, t, done, ownerUid?, host,hostUid}` — V53 gazda: a MEGLÉVő taskra írja a host/nevet (no-new-system).

## participant / jelentkező (V52) — `db.platform.participants[pt_x]`
`{id, eid(events.id), uid*, name, at, status(pending|accepted|declined|withdrawn), decAt?, wdAt?}` — dedup: (eid,uid) joinEv-ben `myJoin`. Owner-jogok: az esemény szervezője kezeli; a túrázó csak a sajátját vonja vissza.

## event (V52) — `db.platform.events[evp_x]`
Kötelező: `id, name*, date*, place*, status`, `orgId*`, `joinMode(internal|external|none)`, `fp=norm(name|date|place)`*
Opcionális: `time, region?, coords?, km?, up?, h?, diff?, desc?, img?, cap?, joinUrl?, projectId?/projectOwner?/projectOwnerKey?(V53), routeId?/routeSnap?, community?, demo*, rev`(változás-számláló)`, createdAt, updatedAt, seeded(demo events)`.
Állapotgép: draft→publikált→(auto:full)|cancelled→completed; a `hidden` status a tesztekben pool-kizárást jelent (V52-vel van). 

## organizer (V52) — `db.platform.organizers[org_x]`
`id, owner*(e-mail; a V53 névhirdetésben viaCommunity), name*, bio?, region?, web?, phone?, logo?(dataURL), demo*`

## connection / túratárs (V53) — `db.community.connections[cn_x]`
`{id, k:"<min e-mail>|<max e-mail>"*, a,b(e-mailek), req, status(pending|accepted|declined|none), at, decAt?, demo?}` — **pairKey dedup** 3× kattintás is =1 sor.

## community profile (V53) — `db.community.profiles[]`
`{id?? uid=e-mail (kulcs!), name*, av?(dataURL), bio?, types[], regions[], exp(Kezdő|Közepes|Haladó), len(Egynapos|Többnapos|Változó), avail(bool), demo*}` — a kereső csak profiles-létezét lista (opt-in).

## invite (V53) — `db.community.invites[iv_x]`
`{id, tourId*, token*(iv_…), owner(e-mail!)/by, email?, status(active|accepted|declined), uid?, at}` — link: `#/meghivo/<token>`; token → fix tour; nincs cross-tour használat.

## notification (V53) — `db.community.notifs[n_…]`
`{id, to(e-mail), text, link, at, read}` — Store.notifications wrap-ban (id-stabil, megtekintéssel read).

## event (real importált, V49 data.js EVENTS const) — nem írható
`id(e12), name, date, place, diff, org, people?, cat, tour?, img, desc, src` — forrás-link; V52 poolba beleolvad (soha ne írd át).

## v54 snapshot + fiók (V54.1, külön tároló — ld. STORAGE_KEYS.md)
`account{uid,salt,hash(PBKDF2),name}`, `snap{at,size,snap}`, `snap{schema:"v54.1",linkedEmail,localUserId,user,data,platform(szűrt),community(szűrt)}` — restore guard: `linkedEmail==sess.email`.

## UI state (nem adat)
`db.session`, `db.community.demoSeeded`, `db.platform.seeded`, `localStorage turatars_v54_state|pre1`, `settings.offers (7 napos suppression)`.
