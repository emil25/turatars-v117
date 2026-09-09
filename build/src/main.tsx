import bundleSrc from "./app-bundle.js?raw";
import "./styles.css";
import { createClient } from "@supabase/supabase-js";
// The adapter stays outside the legacy classic-script bundle.
// @ts-expect-error JavaScript module intentionally has no generated declarations.
import { prepareCloudAdapter } from "../../cloud-preparation/supabase-adapter.mjs";

/* A Túraváros kilenc modulja klasszikus scriptként fut(ott) — közös globális
   scope, felülbírálható function-deklarációkkal. A kötegelt fájlt ezért
   közvetett eval-lel, globális kódp futtatjuk: ez pontosan a <script> tagek
   szemantikáját adja, és a Vite-bundle így is egy köteg marad. */
declare global {
  interface Window {
    App?: { render(q?: Record<string, string>): void };
    __TVMOUNT?: () => void;
    __TT_SUPABASE_ADAPTER?: Record<string, unknown>;
  }
}

const src = String(bundleSrc);
if (typeof document !== "undefined") {
  try {
    const prepared = prepareCloudAdapter({ env: import.meta.env, createClient });
    if (prepared.mode === "supabase") window.__TT_SUPABASE_ADAPTER = prepared.adapter;
    (0, eval)(src);
  } catch (err) {
    console.error("Túravaros: boot hiba —", err);
  }
}

const t = setTimeout(() => {
  if (window.App && !document.querySelector("#view")?.hasChildNodes()) {
    try {
      (0, eval)(src);
      window.App?.render();
    } catch {
      /* a DC handler már gondosodik róla */
    }
  }
  clearTimeout(t);
}, 0);


if ("serviceWorker" in navigator) { window.addEventListener("load", () => { navigator.serviceWorker.register("./sw.js").catch(() => {}); }); }
