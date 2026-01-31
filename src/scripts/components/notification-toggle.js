import {
  subscribeNotification,
  unsubscribeNotification,
} from '../data/api';
import { getToken } from './auth';

/* ===============================
   INIT TOGGLE
================================ */
export async function initNotificationToggle(toggleElement) {
  // Cek dukungan browser
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    toggleElement.disabled = true;
    return;
  }

  // Minta izin notifikasi
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    toggleElement.disabled = true;
    return;
  }

  // Ambil service worker
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  // Set status toggle awal
  toggleElement.checked = !!subscription;

  // Event toggle
  toggleElement.addEventListener('change', async (event) => {
    if (event.target.checked) {
      await handleSubscribe(registration, toggleElement);
    } else {
      await handleUnsubscribe(registration, toggleElement);
    }
  });
}

/* ===============================
   SUBSCRIBE
================================ */
async function handleSubscribe(registration, toggle) {
  try {
    const token = getToken();
    if (!token) {
      alert('Silakan login terlebih dahulu');
      toggle.checked = false;
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'
      ),
    });

    await subscribeNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys,
      },
      token
    );

    alert('Push Notification berhasil diaktifkan');
  } catch (error) {
    console.error('Subscribe failed:', error);
    toggle.checked = false;
  }
}

/* ===============================
   UNSUBSCRIBE
================================ */
async function handleUnsubscribe(registration, toggle) {
  try {
    const token = getToken();
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return;

    await unsubscribeNotification(subscription.endpoint, token);
    await subscription.unsubscribe();

    alert('Push Notification dimatikan');
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    toggle.checked = true;
  }
}

/* ===============================
   HELPER
================================ */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
