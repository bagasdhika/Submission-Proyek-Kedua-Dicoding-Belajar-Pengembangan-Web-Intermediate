import { VAPID_PUBLIC_KEY } from '../config';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const subscribePushNotification = async () => {
  if (!('serviceWorker' in navigator)) return null;
  if (!('PushManager' in window)) return null;

  const registration = await navigator.serviceWorker.ready;

  const existingSubscription =
    await registration.pushManager.getSubscription();
  if (existingSubscription) {
    return existingSubscription;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return subscription;
};

export const unsubscribePushNotification = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription =
    await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();
  }
};
