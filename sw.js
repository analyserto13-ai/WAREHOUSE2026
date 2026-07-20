// Ευρετήριο Αποθήκης - Service Worker
// Αύξησε τον αριθμό εδώ κάθε φορά που κάνεις σημαντική αλλαγή στο index.html,
// ώστε οι συσκευές να παίρνουν τη νέα έκδοση αντί για παλιά cached αρχεία.
const CACHE_NAME = 'ea-cache-v13';
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './banner.jpg',
  './splash.jpg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Ποτέ μην κάνεις cache τα calls προς το Apps Script - πάντα φρέσκα δεδομένα
  if (url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
