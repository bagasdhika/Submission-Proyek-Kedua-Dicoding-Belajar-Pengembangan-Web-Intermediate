import { loginUser } from '../../data/api';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Login</h1>

        <form id="loginForm" class="auth-form" novalidate>
          <label for="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            required
            aria-required="true"
            autocomplete="username"
            placeholder="email@example.com"
          />

          <label for="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            required
            aria-required="true"
            minlength="8"
            autocomplete="current-password"
            placeholder="Minimal 8 karakter"
          />

          <button type="submit" class="btn-primary" id="loginBtn">
            Login
          </button>
        </form>

        <p class="auth-switch">
          Belum punya akun?
          <a href="#/register" class="link-button">Daftar</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    /* ========== TOKEN GUARD ========== */
    const token = localStorage.getItem('token');
    if (token) {
      location.hash = '#/';
      return;
    }

    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      if (!email || !password) {
        alert('Email dan password wajib diisi');
        return;
      }

      loginBtn.disabled = true;
      loginBtn.textContent = 'Memproses...';

      try {
        const result = await loginUser({ email, password });

        if (result.error) {
          alert(result.message);
          return;
        }

        localStorage.setItem('token', result.loginResult.token);
        localStorage.setItem('name', result.loginResult.name);

        location.hash = '#/';
      } catch (error) {
        console.error(error);
        alert('Login gagal, periksa koneksi atau data Anda');
      } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
      }
    });
  }
}
