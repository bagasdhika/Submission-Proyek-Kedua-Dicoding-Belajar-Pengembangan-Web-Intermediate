import { registerUser } from '../../data/api';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Register</h1>

        <form id="registerForm" class="auth-form" novalidate>
          <label for="regName">Nama</label>
          <input
            type="text"
            id="regName"
            required
            aria-required="true"
            placeholder="Nama lengkap"
          />

          <label for="regEmail">Email</label>
          <input
            type="email"
            id="regEmail"
            required
            aria-required="true"
            autocomplete="username"
            placeholder="email@example.com"
          />

          <label for="regPassword">Password</label>
          <input
            type="password"
            id="regPassword"
            required
            aria-required="true"
            minlength="8"
            autocomplete="new-password"
            placeholder="Minimal 8 karakter"
          />

          <button type="submit" class="btn-primary" id="registerBtn">
            Daftar
          </button>
        </form>

        <p class="auth-switch">
          Sudah punya akun?
          <a href="#/login" class="link-button">Login</a>
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

    const form = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value.trim();

      if (!name || !email || !password) {
        alert('Semua field wajib diisi');
        return;
      }

      if (password.length < 8) {
        alert('Password minimal 8 karakter');
        return;
      }

      registerBtn.disabled = true;
      registerBtn.textContent = 'Memproses...';

      try {
        const result = await registerUser({ name, email, password });

        if (result.error) {
          alert(result.message);
          return;
        }

        alert('Registrasi berhasil, silakan login');
        location.hash = '#/login';
      } catch (error) {
        console.error(error);
        alert('Registrasi gagal, periksa koneksi atau data Anda');
      } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Daftar';
      }
    });
  }
}
