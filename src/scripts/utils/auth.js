/* ===============================
   AUTH UTILITIES
================================ */

const TOKEN_KEY = 'token';
const NAME_KEY = 'name';

/* ===============================
   TOKEN
================================ */

export function saveToken(token) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

/* ===============================
   USER NAME (OPTIONAL)
================================ */

export function saveUserName(name) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(NAME_KEY, name);
}

export function getUserName() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(NAME_KEY);
}
