import { addStory } from '../../data/api';
import { getToken } from '../../utils/auth';

export default class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Tambah Cerita</h1>

        <form id="addStoryForm" class="story-form">
          <!-- DESKRIPSI -->
          <label for="description">Deskripsi Cerita</label>
          <textarea
            id="description"
            name="description"
            required
            aria-required="true"
            placeholder="Ceritakan pengalamanmu..."
          ></textarea>

          <!-- FOTO -->
          <label for="photo">Foto</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
          />
          <small>Bisa dari galeri atau kamera</small>

          <!-- KAMERA -->
          <div class="camera-control">
            <button type="button" id="cameraBtn">📷 Gunakan Kamera</button>
            <button type="button" id="captureBtn" hidden>Ambil Foto</button>
          </div>

          <video
            id="cameraPreview"
            autoplay
            playsinline
            hidden
            aria-label="Preview kamera"
          ></video>

          <!-- MAP -->
          <label>Pilih Lokasi (Opsional)</label>
          <div id="map"></div>
          <p id="locationInfo" class="location-info">
            Klik peta untuk menentukan lokasi
          </p>

          <button type="submit" class="btn-primary">
            Posting Cerita
          </button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    /* ========== TOKEN GUARD ========== */
    const token = getToken();
    if (!token) {
      location.hash = '#/login';
      return;
    }

    /* ========== MAP ========== */
    const map = L.map('map').setView([-6.2, 106.8], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    let lat = null;
    let lon = null;
    let marker = null;

    map.on('click', (e) => {
      lat = e.latlng.lat;
      lon = e.latlng.lng;

      if (marker) marker.remove();
      marker = L.marker(e.latlng).addTo(map);

      document.getElementById('locationInfo').textContent =
        `Lokasi: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    });

    /* ========== CAMERA ========== */
    const cameraBtn = document.getElementById('cameraBtn');
    const captureBtn = document.getElementById('captureBtn');
    const video = document.getElementById('cameraPreview');
    const photoInput = document.getElementById('photo');

    let stream = null;

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
      }
      video.hidden = true;
      captureBtn.hidden = true;
    };

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Browser tidak mendukung kamera');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        video.srcObject = stream;
        video.hidden = false;
        captureBtn.hidden = false;
      } catch {
        alert('Izin kamera ditolak');
      }
    };

    cameraBtn.addEventListener('click', startCamera);

    captureBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas.getContext('2d').drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });

        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
      }, 'image/jpeg', 0.8);

      stopCamera();
    });

    /* ========== SUBMIT ========== */
    const form = document.getElementById('addStoryForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.getElementById('description').value.trim();
      if (!description) {
        alert('Deskripsi wajib diisi');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      const formData = new FormData();
      formData.append('description', description);

      if (photoInput.files[0]) {
        formData.append('photo', photoInput.files[0]);
      }

      if (lat !== null && lon !== null) {
        formData.append('lat', lat);
        formData.append('lon', lon);
      }

      try {
        const result = await addStory(formData, token);
        alert(result.message);
        stopCamera();
        location.hash = '#/';
      } catch {
        alert('Gagal menambahkan cerita');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Posting Cerita';
      }
    });
  }
}
