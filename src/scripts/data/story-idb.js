import { openDB } from 'idb';

const DATABASE_NAME = 'dicoding-story-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'stories';

const dbPromise = openDB(
  DATABASE_NAME,
  DATABASE_VERSION,
  {
    upgrade(database) {
      if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        database.createObjectStore(
          OBJECT_STORE_NAME,
          { keyPath: 'id' }
        );
      }
    },
  }
);

/* =========================
   CRUD OFFLINE STORY
   ========================= */

export async function saveStories(stories) {
  const db = await dbPromise;
  const tx = db.transaction(
    OBJECT_STORE_NAME,
    'readwrite'
  );
  const store = tx.objectStore(OBJECT_STORE_NAME);

  stories.forEach((story) => {
    store.put(story);
  });

  await tx.done;
}

export async function getAllStories() {
  const db = await dbPromise;
  return db.getAll(OBJECT_STORE_NAME);
}

export async function getStoryById(id) {
  const db = await dbPromise;
  return db.get(OBJECT_STORE_NAME, id);
}

export async function clearStories() {
  const db = await dbPromise;
  const tx = db.transaction(
    OBJECT_STORE_NAME,
    'readwrite'
  );
  tx.objectStore(OBJECT_STORE_NAME).clear();
  await tx.done;
}
