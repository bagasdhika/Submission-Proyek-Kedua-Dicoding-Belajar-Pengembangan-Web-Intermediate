import '../styles/styles.css';
import App from './pages/app';
import { syncOfflineStories } from './utils/sync-manager';

/* ===============================
   INIT SPA (TIDAK DIUBAH)
================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
  });

  // Render halaman pertama
  await app.renderPage();

  // SPA navigation
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Tambahan submission kedua
  await registerServiceWorker();
  setupInstallPrompt();
  setupPushNotificationToggle();
});

/* ===============================
   SERVICE WORKER
================================ */
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered');
  } catch (err) {
    console.error('SW registration failed', err);
  }
}

/* ===============================
   PWA INSTALL PROMPT
================================ */
let deferredPrompt;

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.getElementById('installBtn');
    if (!installBtn) return;

    installBtn.hidden = false;
    installBtn.addEventListener('click', async () => {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  });
}

/* ===============================
   PUSH NOTIFICATION TOGGLE
================================ */
function setupPushNotificationToggle() {
  const toggle = document.getElementById('pushToggle');
  if (!toggle) return;

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    toggle.disabled = true;
    return;
  }

  checkSubscription(toggle);

  toggle.addEventListener('change', async (e) => {
    if (e.target.checked) {
      await subscribePush();
    } else {
      await unsubscribePush();
    }
  });
}

/* ===============================
   CHECK SUBSCRIPTION
================================ */
async function checkSubscription(toggle) {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  toggle.checked = !!sub;
}

/* ===============================
   SUBSCRIBE
================================ */
async function subscribePush() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Silakan login terlebih dahulu');
    return;
  }

  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
    ),
  });

  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: sub.endpoint,
      keys: sub.toJSON().keys,
    }),
  });

  alert('Push Notification aktif');
}

/* ===============================
   UNSUBSCRIBE
================================ */
async function unsubscribePush() {
  const token = localStorage.getItem('token');
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();

  if (!sub) return;

  await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: sub.endpoint,
    }),
  });

  await sub.unsubscribe();
  alert('Push Notification dimatikan');
}

/* ===============================
   ONLINE SYNC (KRITERIA 4 ADVANCED)
================================ */
window.addEventListener('online', () => {
  syncOfflineStories();
});

/* ===============================
   HELPER
================================ */
function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const raw = atob(base64Safe);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
