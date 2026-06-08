const CACHE_NAME = 'fwc-planner-cache-v1';
const urlsToCache = [
  '/',
  '/calendar',
  '/search',
  '/groups',
  '/favorites',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // We only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone response to cache it
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          const url = new URL(event.request.url);
          // Only cache same-origin resources, ignoring dynamic routes or Hot Module Reload scripts
          if (
            url.origin === self.location.origin &&
            !url.pathname.startsWith('/api') &&
            !url.pathname.startsWith('/_next/webpack-hmr') &&
            !url.pathname.includes('webpack')
          ) {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // Fallback for offline API/images if needed
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
