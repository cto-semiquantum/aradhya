/* Service Worker for Aradhya Valentine PWA App */
const CACHE_NAME = 'aradhya-love-cache-v20';
const urlsToCache = [
  './',
  './index.html',
  './live.html',
  './herdiary.html',
  './cookie.html',
  './voicenotes.html',
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
  './css/live.css',
  './css/herdiary.css',
  './css/cookie.css',
  './css/voicenotes.css',
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
  './js/realtime-client.js',
  './js/live.js',
  './js/herdiary.js',
  './js/cookie.js',
  './js/voicenotes.js',
  './js/touch-heart.js',
  './js/mood-sync.js',
  './js/openwhen.js',
  './js/chapter.js',
  './js/recap.js',
  './js/birthday.js',
  './js/sky.js',
  './js/her.js',
  './js/music-player.js',
  './js/music.js',
  './js/script.js',
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

// Push Notification Event for Instant Live Updates on phones
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Harsh ka naya update 💌', message: event.data.text() };
    }
  } else {
    data = { title: 'Harsh ka naya update 💌', message: 'Kuch naya share kiya hai, tap karke dekho...' };
  }

  const title = data.title || 'Harsh Updates 💌';
  const options = {
    body: data.message || data.body || 'Harsh ne ek naya update bheja hai...',
    icon: './assets/images/icon-192.png',
    badge: './assets/images/icon-192.png',
    vibrate: [200, 100, 200, 100, 300],
    data: {
      url: data.click_url || data.url || './live.html'
    },
    actions: [
      { action: 'open', title: 'Open Live Feed ✨' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './live.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes('live.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
