const  staticShareGangTracker= "share-gang-location-tracker-v1.0-beta";
const assets = [
  "/*.html",
  "/assets/**",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticShareGangTracker).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});