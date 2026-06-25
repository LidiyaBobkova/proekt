const CACHE_NAME = 'clean-sheet-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/catalog.html',
  '/about.html',
  '/contacts.html',
  '/css/style.css',
  '/css/catalog.css',
  '/css/about.css',
  '/css/contacts.css',
  '/js/script.js',
  '/manifest.json',
  '/images/icon-192.png',
  '/images/icon-512.png'
];

// Установка и кэширование
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          // Кэшируем новые ресурсы
          if (fetchResponse && fetchResponse.status === 200) {
            const clone = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return fetchResponse;
        }).catch(() => {
          // Offline fallback для страниц
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});