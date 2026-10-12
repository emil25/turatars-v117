/* Turatars V130.2: build-time generated, hash-versioned offline app shell. */
const CACHE_NAME = '__TT_OFFLINE_CACHE_NAME__';
const CACHE_PREFIX = 'turatars-v130.2-';
const LEGACY_CACHE_NAMES = ['turatears-v130-atlas-1'];
const MANIFEST_FILE = 'precache-manifest.json';
const APP_ENTRY_FILE = 'index.html';
const scopeUrl = new URL(self.registration.scope);
const appEntryUrl = new URL(APP_ENTRY_FILE, scopeUrl);
const manifestUrl = new URL(MANIFEST_FILE, scopeUrl);
const externalCacheHosts = /(^|\.)(tile\.openstreetmap\.org|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|wikimedia\.org)$/i;

function inScope(url) {
  return url.origin === scopeUrl.origin && url.pathname.startsWith(scopeUrl.pathname);
}

function safeAssetUrls(values) {
  if (!Array.isArray(values)) throw new Error('Invalid app-shell asset list');
  return values.map(value => {
    const url = new URL(value, scopeUrl);
    if (!inScope(url) || url.pathname === new URL('sw.js', scopeUrl).pathname) throw new Error('Unsafe app-shell URL');
    return url.href;
  });
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const response = await fetch(manifestUrl.href, { cache: 'no-store' });
    if (!response.ok) throw new Error(`App-shell manifest failed: ${response.status}`);
    const manifest = await response.json();
    if (manifest.schema !== 1 || manifest.release !== '130.2' || manifest.cacheName !== CACHE_NAME) {
      throw new Error('App-shell manifest does not match this Service Worker.');
    }
    const required = safeAssetUrls(manifest.required);
    const optional = safeAssetUrls(manifest.optional || []);
    if (!required.includes(appEntryUrl.href) || !required.some(url => /\.(m?js)(\?|$)/i.test(url)) || !required.some(url => /\.css(\?|$)/i.test(url))) {
      throw new Error('App-shell manifest is missing a critical entry, JavaScript, or CSS file.');
    }

    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(required);
      await cache.put(manifestUrl.href, new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/json' } }));
    } catch (error) {
      await caches.delete(CACHE_NAME);
      throw error;
    }
    // Photos and icons improve the offline view but cannot prevent the app from installing.
    await Promise.all(optional.map(url => cache.add(url).catch(() => undefined)));
    // Do not skip the normal waiting lifecycle: open tabs keep their current worker and cache.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Normal SW activation waits for clients controlled by the previous worker to close.
    // Only remove our own known app-shell caches; leave unrelated caches untouched.
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME &&
      (key.startsWith(CACHE_PREFIX) || LEGACY_CACHE_NAMES.includes(key)))
      .map(key => caches.delete(key)));
  })());
});

async function readManifest(cache) {
  try { return await (await cache.match(manifestUrl.href)).json(); } catch { return null; }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === scopeUrl.origin && inScope(url)) {
    if (request.mode === 'navigate') {
      event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) await cache.put(appEntryUrl.href, response.clone());
          return response;
        } catch {
          const entry = await cache.match(appEntryUrl.href);
          return entry || new Response('Az alkalmazás offline indításhoz szükséges fájljai még nem érhetők el. Nyisd meg online, majd próbáld újra.', {
            status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      })());
      return;
    }
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const manifest = await readManifest(cache);
      if (!manifest) return fetch(request);
      const known = safeAssetUrls([...(manifest.required || []), ...(manifest.optional || [])]);
      if (!known.includes(url.href) && !known.includes(new URL(url.pathname, scopeUrl).href)) return fetch(request);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return new Response('Ez a kiegészítő fájl jelenleg nem érhető el offline.', {
          status: 503, headers: { 'Content-Type': url.pathname.endsWith('.js') ? 'text/javascript' : 'text/plain; charset=utf-8' },
        });
      }
    })());
    return;
  }

  // Cache only public map/font/media hosts. Supabase and other APIs are never handled here.
  if (externalCacheHosts.test(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        fetch(request).then(response => response.ok && cache.put(request, response)).catch(() => {});
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') await cache.put(request, response.clone());
        return response;
      } catch {
        return new Response('', { status: 503 });
      }
    })());
  }
});
