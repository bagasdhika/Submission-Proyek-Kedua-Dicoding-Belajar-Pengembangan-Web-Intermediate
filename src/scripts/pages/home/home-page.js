import { getStories } from '../../data/api';
import { getToken } from '../../utils/auth';

export default class HomePage {
  async render() {
    return `
      <section class="main-content">
        <h1 class="page-title">Daftar Story</h1>

        <!-- MAP -->
        <div class="map-wrapper" aria-label="Peta lokasi story">
          <div id="map"></div>
        </div>

        <!-- STORY LIST -->
        <section
          id="storyList"
          class="story-list"
          aria-live="polite"
          aria-busy="true"
        ></section>
      </section>
    `;
  }

  async afterRender() {
    /* ================= AUTH GUARD ================= */
    const token = getToken();
    if (!token) {
      location.hash = '#/login';
      return;
    }

    /* ================= MAP INIT ================= */
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map(mapElement).setView([-2.5, 118], 5);

    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap',
      }
    ).addTo(map);

    const topoLayer = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenTopoMap',
      }
    );

    L.control
      .layers(
        {
          OpenStreetMap: osmLayer,
          Topografi: topoLayer,
        },
        null,
        { position: 'topright' }
      )
      .addTo(map);

    /* ================= LOAD STORY ================= */
    const storyListElement = document.getElementById('storyList');
    storyListElement.innerHTML = `<p>Memuat story...</p>`;

    let response;
    try {
      response = await getStories(token);
    } catch (error) {
      storyListElement.innerHTML = `
        <p class="error-text">Gagal memuat data story</p>
      `;
      storyListElement.setAttribute('aria-busy', 'false');
      return;
    }

    if (!response.listStory || response.listStory.length === 0) {
      storyListElement.innerHTML = `<p>Belum ada story</p>`;
      storyListElement.setAttribute('aria-busy', 'false');
      return;
    }

    storyListElement.innerHTML = '';
    storyListElement.setAttribute('aria-busy', 'false');

    /* ================= RENDER STORY ================= */
    response.listStory.forEach((story) => {
      const article = document.createElement('article');
      article.className = 'story-card';
      article.tabIndex = 0;
      article.setAttribute('aria-label', `Story oleh ${story.name}`);

      article.innerHTML = `
        <img
          src="${story.photoUrl}"
          alt="Foto story oleh ${story.name}"
          loading="lazy"
        />

        <div class="story-card-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <time datetime="${story.createdAt}">
            ${new Date(story.createdAt).toLocaleString()}
          </time>
        </div>
      `;

      /* ================= MAP MARKER ================= */
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);

        marker.bindPopup(`
          <strong>${story.name}</strong><br />
          ${story.description}
        `);

        // Sinkronisasi list → peta (nilai tambah kriteria 2)
        const focusToMarker = () => {
          map.setView([story.lat, story.lon], 10, {
            animate: true,
          });
          marker.openPopup();
        };

        article.addEventListener('click', focusToMarker);
        article.addEventListener('keypress', (event) => {
          if (event.key === 'Enter') {
            focusToMarker();
          }
        });
      }

      storyListElement.appendChild(article);
    });
  }
}
