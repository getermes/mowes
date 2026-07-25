// Service worker: lets the app work offline (e.g. on a walk/run with no signal)
const CACHE = "mowes-v41";
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
      // Network-first so the newest version loads when online — but if the
      // connection is weak/slow, don't hang: after ~3s fall back to the saved
      // copy so the app always opens fast (e.g. on a walk/run with poor signal).
      // The network fetch still finishes in the background and refreshes the
      // cache for next time. On a first-ever visit (no saved copy yet) we wait
      // for the network since there's nothing to fall back to.
      new Promise(resolve => {
        let settled = false;
        const done = r => { if (!settled) { settled = true; resolve(r); } };
        const timer = setTimeout(() => {
          caches.match("./index.html").then(cached => { if (cached) done(cached); });
        }, 3000);
        // "no-store" skips the browser's own cache so we always pull the freshest page.
        fetch(req, { cache: "no-store" }).then(resp => {
          clearTimeout(timer);
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put("./index.html", copy)).catch(() => {});
          done(resp);
        }).catch(() => {
          clearTimeout(timer);
          caches.match("./index.html").then(cached => done(cached));
        });
      })
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
