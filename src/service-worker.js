/* ===============================
   SERVICE WORKER
   Dicoding Story App
================================ */

const CACHE_NAME = 'dicoding-story-v1';
const API_CACHE = 'dicoding-story-api-v1';

/* ===============================
   APP SHELL
   (WAJIB: file benar-benar ada)
================================ */
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',

  /* ================= CSS ================= */
  '/styles/styles.css',

  /* ================= JS CORE ================= */
  '/scripts/index.js',
  '/scripts/pages/app.js',

  /* ================= ROUTES ================= */
  '/scripts/routes/routes.js',
  '/scripts/routes/url-parser.js',

  /* ================= PAGES ================= */
  '/scripts/pages/home/home-page.js',
  '/scripts/pages/login/login-page.js',
  '/scripts/pages/register/register-page.js',
  '/scripts/pages/add-story/add-story-page.js',

  /* ================= UTILS ================= */
  '/scripts/utils/auth.js',
  '/scripts/utils/navigation.js',
  '/scripts/utils/network-status.js',
  '/scripts/utils/sw-register.js',
  /*'/scripts/utils/notification-toggle.js',*/

  /* ================= DATA ================= */
  '/scripts/data/api.js',
  '/scripts/data/notification-toggle.js',
  '/scripts/data/story-idb.js',

  /* ================= ASSETS ================= */
  '/public/images/logo.png',
  '/public/images/favicon.png',
];

/* ===============================
   INSTALL
================================ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

/* ===============================
   ACTIVATE
================================ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* ===============================
   FETCH
   - App Shell  → Cache First
   - API       → Network First
================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* ===== API Dicoding Story ===== */
  if (url.origin === 'https://story-api.dicoding.dev') {
    event.respondWith(networkFirst(request));
    return;
  }

  /* ===== APP SHELL ===== */
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});

/* ===============================
   NETWORK FIRST (API)
================================ */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(API_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cache = await caches.open(API_CACHE);
    return cache.match(request);
  }
}

/* ===============================
   PUSH NOTIFICATION
================================ */
self.addEventListener('push', (event) => {
  let data = {
    title: 'Story Baru',
    options: {
      body: 'Ada story baru di Dicoding Story',
      icon: '/public/images/logo.png',
      badge: '/public/images/logo.png',
      data: {
        url: '/index.html#/',
      },
      actions: [
        {
          action: 'open',
          title: 'Lihat Story',
        },
      ],
    },
  };

  if (event.data) {
    const payload = event.data.json();
    data.title = payload.title || data.title;
    data.options.body =
      payload.options?.body || data.options.body;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});

/* ===============================
   NOTIFICATION CLICK
================================ */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('#/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/index.html#/');
      }
    })
  );
});
