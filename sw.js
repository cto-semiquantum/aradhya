/* Service Worker for Aradhya Valentine PWA App */
const CACHE_NAME = 'aradhya-love-cache-v13';
const urlsToCache = [
  './',
  './index.html',
  './openwhen.html',
  './littlethings.html',
  './chapter.html',
  './growth.html',
  './recap.html',
  './birthday.html',
  './sky.html',
  './future.html',
  './her.html',
  './videos.html',
  './music.html',
  './promises.html',
  './journey.html',
  './diary.html',
  './timeline.html',
  './manifest.json',
  './css/base.css',
  './css/openwhen.css',
  './css/littlethings.css',
  './css/chapter.css',
  './css/growth.css',
  './css/recap.css',
  './css/birthday.css',
  './css/sky.css',
  './css/future.css',
  './css/her.css',
  './css/videos.css',
  './css/music.css',
  './css/promises.css',
  './js/auth.js',
  './js/nav.js',
  './js/openwhen.js',
  './js/chapter.js',
  './js/recap.js',
  './js/birthday.js',
  './js/sky.js',
  './js/her.js',
  './js/music-player.js',
  './js/diary.js',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/her1.jpeg',
  './assets/images/her2.jpeg'
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

// Network-First Strategy for Instant Automatic Updates in PWA App
self.addEventListener('fetch', event => {
  if (event.request.url.endsWith('.mp4')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
