import { getAllStories, clearStories } from './db';

export async function syncOfflineStories() {
  if (!navigator.onLine) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  const stories = await getAllStories();
  if (!stories.length) return;

  for (const story of stories) {
    const formData = new FormData();
    formData.append('description', story.description);
    formData.append('photo', story.photo);
    if (story.lat) formData.append('lat', story.lat);
    if (story.lon) formData.append('lon', story.lon);

    try {
      await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } catch (err) {
      console.error('Sync gagal', err);
      return;
    }
  }

  await clearStories();
  console.log('Offline stories synced');
}
