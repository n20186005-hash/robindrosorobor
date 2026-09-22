// রবীন্দ্র সরোবর পর্যটক নির্দেশিকা — সার্ভিস ওয়ার্কার
// পৃষ্ঠা: নেটওয়ার্ক-ফার্স্ট (সর্বদা সতেজ), ব্যর্থ হলে ক্যাশে।
// স্থির সম্পদ: ক্যাশে-ফার্স্ট (দ্রুত লোড)।

const CACHE = 'robindro-sorobor-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['/', '/index.html', '/site.webmanifest', '/icons/favicon.svg', '/icons/logo.svg']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // গুগল মানচিত্র/অ্যানালিটিক্স বাইরে রাখুন

  // পৃষ্ঠা নেভিগেশন: network-first, পড়ে গেলে ক্যাশে/অফলাইন ফলব্যাক
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  // স্থির সম্পদ: cache-first, তারপর নেটওয়ার্ক ও ক্যাশে করুন
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && /\.(css|js|svg|png|jpg|jpeg|webp|webmanifest|woff2?)$/.test(url.pathname)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
    )
  );
});
