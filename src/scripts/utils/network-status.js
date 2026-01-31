/* ===============================
   NETWORK STATUS
================================ */

export function initNetworkStatus() {
  const updateStatus = () => {
    if (navigator.onLine) {
      document.body.classList.remove('offline');
      console.log('Status: Online');
    } else {
      document.body.classList.add('offline');
      console.log('Status: Offline');
    }
  };

  // Initial check
  updateStatus();

  // Listen changes
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
}
