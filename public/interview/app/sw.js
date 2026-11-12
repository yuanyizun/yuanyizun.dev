const CACHE = "interview-app-v1";
const PRECACHE = ["/api/questions"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("interview-app-") && key !== CACHE)
          .map((key) => caches.delete(key)),
      ),
    ).then(() => self.clients.claim()),
  );
});

function isAppNavigation(request, url) {
  return (
    request.mode === "navigate" &&
    (url.pathname === "/interview/app" || url.pathname.startsWith("/interview/app/"))
  );
}

function isQuestionsApi(request, url) {
  return request.method === "GET" && url.pathname === "/api/questions";
}

function isNextStatic(request, url) {
  return (
    request.method === "GET" &&
    url.origin === self.location.origin &&
    url.pathname.startsWith("/_next/static/")
  );
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("offline");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (isAppNavigation(request, url) || isQuestionsApi(request, url)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isNextStatic(request, url)) {
    event.respondWith(cacheFirst(request));
  }
});
