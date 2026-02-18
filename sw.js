const CACHE_NAME = 'kindr-cache-v11.2.2';
const TILE_CACHE = 'kindr-tiles-v11.2.2';
const ASSETS = [
    './',
    'index.html',
    'css/main.css',
    'js/app.js',
    'js/config.js',
    'js/services/data.js',
    'js/services/auth.js',
    'js/pages/map_v11.js',
    'js/pages/news.js',
    'js/pages/events.js',
    'js/pages/tribu.js',
    'js/pages/ranking.js',
    'js/pages/profile.js',
    'js/pages/chat.js',
    'assets/logo.png',
    'assets/logo.svg',
    'assets/map-marker.png',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    'https://assets.mixkit.co/active_storage/sfx/1918/1918-preview.mp3'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Force takeover
            clients.claim(),
            // TOTAL NUCLEAR PURGE: Delete EVERY cache that exists
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        console.log('[SW] Nuclear Purge deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Map Tiles Strategy: Cache-First
    if (url.hostname.includes('basemaps.cartocdn.com')) {
        event.respondWith(
            caches.open(TILE_CACHE).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
