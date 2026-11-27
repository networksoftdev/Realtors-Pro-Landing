const CACHE_NAME = 'realtors-pro-v2';
const APP_SHELL = [
  '/',
  '/site.webmanifest',
  '/pwa-icon.svg',
  '/icon.png',
  '/icon.svg',
  '/favicon.ico',
  '/favicon.svg',
  '/js/property-cards.js',
  '/js/property-detail.js',
  '/css/main.css',
  '/css/style.css',
  '/css/icons.css',
  '/js/app.js',
  '/img/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('realtors-pro-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseCopy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put('/', responseCopy)));
          }
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => cachedResponse || fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseCopy = response.clone();
            event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy)));
          }
          return response;
        }))
  );
});
