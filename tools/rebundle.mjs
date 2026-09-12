#!/usr/bin/env node
/* tools/rebundle.mjs — app/js/*.js → build/src/app-bundle.js + app-css/views.css
   A SZOROS SORREND a korábban bevizsgált render-lánc (VIEWS.after wrapperi sor). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.join(here, "..");
const files = ["data","store","ui","public","dashboard","dashboard2","workspace","upgrade",
  "project","v44","v45","v46","v47","v47b","v48","v49","v50","v52","v53","v54","v120","v121","v122","v123","v124","v125","v126","app"];
const srcDir = path.join(pkg, "app", "js");
const out = [path.join(pkg, "build", "src", "app-bundle.js")];
let parts = files.map(f => "/* ==== " + f + " ==== */\n" + fs.readFileSync(path.join(srcDir, f + ".js"), "utf8"));
let bundle = parts.join("\n") +
  ";window.Store=Store;window.VIEWS=VIEWS;window.tourReview=tourReview;window.smartPlanner=smartPlanner;(function(){ [\"EVENTS\",\"IMG\",\"TOURS\",\"TEMPLATES_DEFAULT\"].forEach(function(k){ try{ window[k]=eval(k); }catch(e){} }); })();";
fs.writeFileSync(out[0], bundle);
fs.copyFileSync(path.join(pkg, "app", "css", "views.css"), path.join(pkg, "build", "src", "app-css", "views.css"));
console.log("rebundle ok:", out[0].split("/").slice(-1)[0], bundle.length, "byte");
