const CACHE_NAME = 'kindr-cache-v2';
const ASSETS = [
    './',
    'index.html',
    'css/main.css',
    'js/app.js',
    'js/config.js',
    'js/services/data.js',
    'js/services/auth.js',
    'js/pages/map.js',
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
            clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Borrando caché antigua:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
