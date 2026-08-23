/* Service Worker for Aradhya Valentine PWA */
const CACHE_NAME = 'aradhya-love-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './journey.html',
  './diary.html',
  './css/base.css',
  './js/music.js',
  './js/nav.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
