// Service worker: lets the app work offline (e.g. on a walk/run with no signal)
const CACHE = "mowes-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // The app page: try the network first so the newest version always loads
  // when online; fall back to the cached copy when offline.
  const wantsHtml = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (wantsHtml) {
    e.respondWith(
      // "no-store" skips the browser's own cache so we always pull the freshest
      // app page from the network when online (falls back to cache when offline).
      fetch(req, { cache: "no-store" }).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Other files (icons, manifest): use cache first for speed/offline.
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => cached)
    )
  );
});
