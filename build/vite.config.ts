import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const configDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(configDir, "dist");

async function walkFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  }));
  return nested.flat();
}

function offlinePrecache(): Plugin {
  return {
    name: "turatars-offline-precache",
    apply: "build",
    async closeBundle() {
      const files = (await walkFiles(distDir))
        .filter(path => !["sw.js", "precache-manifest.json"].includes(relative(distDir, path).split(sep).join("/")))
        .filter(path => extname(path).toLowerCase() !== ".md")
        .sort();
      const required: string[] = [];
      const optional: string[] = [];
      const optionalExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp", ".woff", ".woff2"]);
      for (const path of files) {
        const rel = `./${relative(distDir, path).split(sep).join("/")}`;
        const extension = extname(path).toLowerCase();
        if ([".css", ".html", ".js", ".mjs", ".webmanifest"].includes(extension)) required.push(rel);
        else if (optionalExtensions.has(extension)) optional.push(rel);
      }
      if (!required.includes("./index.html") || !required.some(path => path.endsWith(".js")) || !required.some(path => path.endsWith(".css"))) {
        throw new Error("Offline app shell is missing index.html, JavaScript, or CSS output.");
      }

      const digest = createHash("sha256");
      for (const rel of [...required, ...optional].sort()) {
        digest.update(rel);
        digest.update(await readFile(resolve(distDir, rel.slice(2))));
      }
      const cacheName = `turatars-v130.2-${digest.digest("hex").slice(0, 12)}`;
      const manifest = { schema: 1, release: "130.2", cacheName, required, optional };
      await writeFile(resolve(distDir, "precache-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

      const swPath = resolve(distDir, "sw.js");
      const worker = await readFile(swPath, "utf8");
      if (!worker.includes("__TT_OFFLINE_CACHE_NAME__")) throw new Error("Service Worker cache-name marker is missing.");
      await writeFile(swPath, worker.replaceAll("__TT_OFFLINE_CACHE_NAME__", cacheName));
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), offlinePrecache()],
  server: {
    allowedHosts: [".muleusercontent.com"],
  },
  build: {
    emptyOutDir: true,
    outDir: "dist",
  },
});
