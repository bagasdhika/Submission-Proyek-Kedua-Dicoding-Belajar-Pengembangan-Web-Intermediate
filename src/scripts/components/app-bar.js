import { isLoggedIn, removeToken } from '../utils/auth';

class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const loggedIn = isLoggedIn();

    this.innerHTML = `
      <header>
        <div class="main-header container">
          <a href="#/" class="brand-name">Dicoding Story</a>

          <nav
            id="navigation-drawer"
            class="navigation-drawer"
            aria-label="Navigasi Utama"
          >
            <ul class="nav-list" id="nav-list">
              ${
                loggedIn
                  ? `
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
              `
                  : `
                <li><a href="#/login">Login</a></li>
                <li><a href="#/register">Register</a></li>
              `
              }
            </ul>
          </nav>

          <button
            id="drawer-button"
            class="drawer-button"
            aria-label="Buka Menu Navigasi"
          >
            ☰
          </button>
        </div>
      </header>
    `;

    this._initEvent();
  }

  _initEvent() {
    const drawerBtn = this.querySelector('#drawer-button');
    const drawer = this.querySelector('#navigation-drawer');

    if (drawerBtn && drawer) {
      drawerBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
      });
    }

    if (isLoggedIn()) {
      const logoutBtn = this.querySelector('#logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          removeToken();
          location.hash = '#/login';
        });
      }
    }
  }
}

customElements.define('app-bar', AppBar);
