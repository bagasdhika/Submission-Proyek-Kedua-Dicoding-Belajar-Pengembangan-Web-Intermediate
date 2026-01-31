import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

/* =========================
   RESPONSE HANDLER
========================= */
async function handleResponse(response) {
  let result = null;

  try {
    result = await response.json();
  } catch (error) {
    throw new Error('Response server tidak valid');
  }

  if (!response.ok || result.error) {
    throw new Error(result.message || 'Terjadi kesalahan');
  }

  return result;
}

/* =========================
   AUTHENTICATION
========================= */
export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(response);
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

/* =========================
   STORIES
========================= */
export async function getStories(token, page = 1, size = 10) {
  const response = await fetch(
    `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}

export async function getStoryDetail(id, token) {
  const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function addStory(formData, token) {
  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function addStoryGuest(formData) {
  const response = await fetch(ENDPOINTS.STORIES_GUEST, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
}

/* =========================
   PUSH NOTIFICATION
========================= */
export async function subscribeNotification(data, token) {
  const response = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}

export async function unsubscribeNotification(endpoint, token) {
  const response = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint }),
  });

  return handleResponse(response);
}
