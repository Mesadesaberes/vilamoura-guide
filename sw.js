const CACHE_NAME = 'vilamoura-select-v15';

const urlsToCache = [
  '/Vilamoura-Select/',
  '/Vilamoura-Select/index.html',
  '/Vilamoura-Select/manifest.json',
  '/Vilamoura-Select/icon-192.png',
  '/Vilamoura-Select/icon-512.png'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Cache aberto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('❌ Erro ao cachear:', err))
  );
  self.skipWaiting(); // Força ativação imediata
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Cache antigo removido:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume controlo imediato
});

// Intercepta pedidos de rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => {
            // Fallback para offline
            return caches.match('/Vilamoura-Select/index.html');
          });
      })
  );
});