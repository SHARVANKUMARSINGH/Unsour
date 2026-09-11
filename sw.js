const CACHE_NAME = 'unsource-cache-v1';
const urlsToCache = [
  '/Unsour/',
  '/Unsour/index.html'
];

// 1. Install the Service Worker and cache the main files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Intercept requests to serve cached files or save new ones (like your CDN image)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached version if we have it
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from the network
        return fetch(event.request).then(networkResponse => {
          // Open the cache and save a copy of this new request (only if it's a GET request)
          return caches.open(CACHE_NAME).then(cache => {
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
  );
});

