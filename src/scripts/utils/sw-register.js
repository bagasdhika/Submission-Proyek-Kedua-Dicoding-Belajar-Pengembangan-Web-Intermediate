/* ===============================
   SERVICE WORKER REGISTER
================================ */

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker tidak didukung browser ini');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      '/service-worker.js'
    );

    console.log('Service Worker berhasil didaftarkan', registration);
  } catch (error) {
    console.error('Service Worker gagal didaftarkan', error);
  }
}
