/* Service Worker for Aradhya Valentine PWA App */
const CACHE_NAME = 'aradhya-love-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './her.html',
  './music.html',
  './promises.html',
  './journey.html',
  './diary.html',
  './timeline.html',
  './manifest.json',
  './css/base.css',
  './css/her.css',
  './css/music.css',
  './css/promises.css',
  './js/nav.js',
  './js/her.js',
  './js/music-player.js',
  './js/diary.js',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
