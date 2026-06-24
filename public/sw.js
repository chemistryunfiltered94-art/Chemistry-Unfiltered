// public/sw.js
// Hand-written service worker — no build plugin needed.
// Bump CACHE_VERSION whenever the offline-fallback / precache set changes;
// hashed /_next/static/ files don't need a bump since their URLs already
// change on every build.

const CACHE_VERSION = "v1";
const PAGES_CACHE = `chemistry-unfiltered-pages-${CACHE_VERSION}`;
const ASSETS_CACHE = `chemistry-unfiltered-assets-${CACHE_VERSION}`;
const PRECACHE_URLS = ["/offline.html", "/logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(ASSETS_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== PAGES_CACHE && key !== ASSETS_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GET requests. Everything else (Firebase auth,
  // Firestore, Google fonts, third-party APIs) goes straight to the network
  // untouched — caching those could serve stale data or break auth.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  const isNavigation = request.mode === "navigate" || request.destination === "document";

  if (isNavigation) {
    event.respondWith(networkFirstPage(request));
  } else {
    event.respondWith(cacheFirstAsset(request));
  }
});

async function networkFirstPage(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(PAGES_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cache = await caches.open(PAGES_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match("/offline.html");
    return offline || Response.error();
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(ASSETS_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    // Stale-while-revalidate: refresh in the background for next time.
    fetch(request)
      .then((response) => cache.put(request, response))
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return Response.error();
  }
}
