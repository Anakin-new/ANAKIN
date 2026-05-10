// sw.js
const CACHE_NAME = "sovereign-v2.1"; // Increment this when you update CSS/JS
const ASSETS = [
  "/",
  "/index.html",
  "/habits.html",
  "/journal.html",
  "/constitution.html",
  "/cosmic.html",
  "/css/main.css",
  "/js/main.js",
  "/js/habits.js",
  "/js/journal.js",
  "/js/constitution.js",
  "/js/cosmic.js",
  "/manifest.json",
];

// Install: Cache all assets
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Force the new service worker to become active
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

// Activate: Clean up old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        }),
      );
    }),
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    }),
  );
});
