/* For Mom · service worker — offline caching + installability + auto-update
 * HTML / navigations  -> NETWORK-FIRST (always freshest when online)
 * Static assets       -> STALE-WHILE-REVALIDATE (instant, refreshed in background)
 * Bump CACHE_VERSION on every deploy to purge old caches.
 */
var CACHE_VERSION = 'v12';
var CACHE = 'for-mom-' + CACHE_VERSION;

var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './photos/mom-1.jpg',
  './photos/mom-2.jpg',
  './photos/flowers.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () { /* non-fatal */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  // Google Fonts: cache-first so typography survives offline
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return res;
        });
      })
    );
    return;
  }

  // Navigations / HTML: network-first
  if (e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (hit) { return hit || caches.match('./index.html'); });
      })
    );
    return;
  }

  // Other same-origin assets: stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        var fetchPromise = fetch(e.request).then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          return res;
        }).catch(function () { return hit; });
        return hit || fetchPromise;
      })
    );
  }
});
