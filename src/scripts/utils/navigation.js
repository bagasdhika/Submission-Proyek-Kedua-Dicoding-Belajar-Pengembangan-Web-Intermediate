import { isLoggedIn, removeToken } from './auth';

/* ===============================
   RENDER NAVIGATION
================================ */
export function renderNavigation() {
  const navList = document.getElementById('nav-list');
  if (!navList) return;

  if (isLoggedIn()) {
    // ================= LOGIN =================
    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>

      <li>
        <label class="push-toggle">
          <input
            type="checkbox"
            id="pushToggle"
            aria-label="Aktifkan Push Notification"
          />
          <span>Notifikasi</span>
        </label>
      </li>

      <li>
        <button
          id="installBtn"
          class="install-btn"
          hidden
          aria-label="Install Aplikasi"
        >
          Install
        </button>
      </li>

      <li>
        <button
          id="logoutBtn"
          class="logout-btn"
          aria-label="Logout"
        >
          Logout
        </button>
      </li>
    `;

    _initLogout();
  } else {
    // ================= GUEST =================
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
}

/* ===============================
   LOGOUT HANDLER
================================ */
function _initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    removeToken();
    location.hash = '#/login';
  });
}
