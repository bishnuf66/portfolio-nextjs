const CACHE_NAME = "portfolio-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon-16-16.png",
  "/assets/smallLogo.ico",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  // Skip API routes
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Determine cache strategy
          let cacheName = DYNAMIC_CACHE;

          // Cache static assets longer
          if (
            url.pathname.includes("/_next/static/") ||
            url.pathname.includes("/images/") ||
            url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$/)
          ) {
            cacheName = STATIC_CACHE;
          }

          caches.open(cacheName).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Always return a valid Response in error cases
          if (request.mode === "navigate") {
            return caches.match("/").then((fallback) => fallback || Response.error());
          }

          // Generic offline fallback for non-navigation requests
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
    })
  );
});

// Background sync for analytics
self.addEventListener("sync", (event) => {
  if (event.tag === "analytics-sync") {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync queued analytics data when online
  try {
    const cache = await caches.open("analytics-queue");
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log("Failed to sync analytics:", error);
      }
    }
  } catch (error) {
    console.log("Analytics sync error:", error);
  }
}
