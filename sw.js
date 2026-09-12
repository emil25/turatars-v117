/* Turatars service worker — offline app-shell + gyors csempetár */
const V = 'turatears-v123';
const SHELL = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(V);
      const net = await fetch(e.request).catch(() => null);
      if (net && net.ok) { cache.put(e.request, net.clone()); return net; }
      const hit = await cache.match(e.request);
      if (hit) return hit;
      if (e.request.mode === 'navigate') return cache.match('./index.html');
      return new Response('offline');
    })());
  } else if (/tile|openstreetmap|unpkg|gstatic|fonts|wikimedia/.test(u.host + u.href)) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const h = await c.match(e.request);
      if (h) { fetch(e.request).then(r => r.ok && c.put(e.request, r)).catch(() => {}); return h; }
      try { const r = await fetch(e.request); if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }
      catch (err) { return new Response('', { status: 503 }); }
    })());
  }
});
