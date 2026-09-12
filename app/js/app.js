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
      utvonalak: "routes", turamod: "tourmode", terepi: "terepi", sablonok: "templates", osztott: "share", szervezo: "szervezo", szervezoknek: "szervezoknek", tarsak: "tarsak", meghivo: "meghivo"
    };
    const DASHY = ["security","csapatstat","dash", "tours", "newTour", "workspace", "liveTour", "calendar", "wishlist", "equipment", "teams", "routes", "journal", "stats", "ai", "mymap", "notifs", "settings", "profile", "tourmode", "terepi", "templates", "szervezo", "tarsak", "meghivo"];
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
      const t = tourById(arg);
      
      root.innerHTML = VIEWS.discover();
      if (VIEWS.discover.after) VIEWS.discover.after(root);
      renderHeader(); renderMobileNav();
      if (t) tourModal(t.id); else toast("Ilyen túra nem található a katalógusban", "🤔");
      return;
    }
    if (key === "events" && arg) {
      const e = EVENTS.find(x => x.id === arg);
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
      notifs: VIEWS.notifs.after, settings: VIEWS.settings.after, profile: VIEWS.profile.after, szervezo: (VIEWS.szervezo&&VIEWS.szervezo.after)||null, szervezoknek: (VIEWS.szervezoknek&&VIEWS.szervezoknek.after)||null, tarsak: (VIEWS.tarsak&&VIEWS.tarsak.after)||null, meghivo: (VIEWS.meghivo&&VIEWS.meghivo.after)||null, szatt: null,
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
