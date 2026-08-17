/**
 * EnterpriseHub Mobile PWA & Web JavaScript Controller
 */

let deferredPrompt = null;
let activeMediaStream = null;

// =========================================================================
// 1. Service Worker & PWA Installation Setup
// =========================================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

// Catch Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBanner = document.getElementById('pwa-install-banner');
  if (installBanner) {
    installBanner.classList.remove('d-none');
  }
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      }
      deferredPrompt = null;
      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner) installBanner.classList.add('d-none');
    });
  } else {
    Swal.fire({
      icon: 'info',
      title: 'Install EnterpriseHub PWA',
      text: 'Buka menu browser Anda (titik 3 di kanan atas atau ikon bagikan di Safari) lalu pilih "Tambahkan ke Layar Utama" / "Install App".',
      confirmButtonColor: '#2563eb'
    });
  }
}

// =========================================================================
// 2. Camera WebRTC & Selfie Capture
// =========================================================================
async function initCamera(videoElementId = 'camera-stream') {
  const video = document.getElementById(videoElementId);
  if (!video) return;

  try {
    const constraints = {
      video: {
        facingMode: 'user', // Front camera for selfie
        width: { ideal: 640 },
        height: { ideal: 640 }
      },
      audio: false
    };

    activeMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = activeMediaStream;
    await video.play();
    console.log('[Camera] Camera stream active');
  } catch (err) {
    console.error('[Camera] Error accessing camera:', err);
    Swal.fire({
      icon: 'warning',
      title: 'Akses Kamera Ditolak / Tidak Tersedia',
      text: 'Harap izinkan akses kamera di peramban Anda untuk mengambil foto selfie presensi.',
      confirmButtonColor: '#2563eb'
    });
  }
}

function stopCamera() {
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach(track => track.stop());
    activeMediaStream = null;
  }
}

function takeSelfieSnapshot(videoElementId = 'camera-stream', canvasElementId = 'camera-canvas', previewImgId = 'selfie-preview') {
  const video = document.getElementById(videoElementId);
  const canvas = document.getElementById(canvasElementId);
  const preview = document.getElementById(previewImgId);

  if (!video || !canvas) return null;

  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth || 480;
  canvas.height = video.videoHeight || 480;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const base64Data = canvas.toDataURL('image/jpeg', 0.85);

  if (preview) {
    preview.src = base64Data;
    preview.classList.remove('d-none');
    video.classList.add('d-none');
  }

  // Save to hidden input if exists
  const hiddenInput = document.getElementById('selfie-base64-input');
  if (hiddenInput) {
    hiddenInput.value = base64Data;
  }

  return base64Data;
}

function retakeSelfie(videoElementId = 'camera-stream', previewImgId = 'selfie-preview') {
  const video = document.getElementById(videoElementId);
  const preview = document.getElementById(previewImgId);
  const hiddenInput = document.getElementById('selfie-base64-input');

  if (preview) preview.classList.add('d-none');
  if (video) video.classList.remove('d-none');
  if (hiddenInput) hiddenInput.value = '';
}

// =========================================================================
// 3. Geolocation GPS & Geofencing Calculation (Haversine Formula)
// =========================================================================
function getGPSCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung pada browser ini.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let msg = 'Gagal mengambil lokasi GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin lokasi GPS ditolak oleh pengguna.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Informasi lokasi GPS tidak tersedia.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Permintaan lokasi GPS habis waktu (timeout).';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// =========================================================================
// 4. Push Notification Permissions
// =========================================================================
function requestNotificationPermission() {
  if (!('Notification' in window)) {
    Swal.fire({ icon: 'info', text: 'Browser tidak mendukung push notification.' });
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      Swal.fire({
        icon: 'success',
        title: 'Notifikasi Diaktifkan!',
        text: 'Anda akan menerima pengingat presensi dan notifikasi tugas langsung di perangkat Anda.',
        confirmButtonColor: '#2563eb'
      });
      new Notification('EnterpriseHub PWA', {
        body: 'Notifikasi kehadiran dan tugas siap digunakan!',
        icon: '/icons/icon.svg'
      });
    }
  });
}

// Live Clock for Mobile Attendance
function updateLiveClock(elementId = 'live-clock') {
  const clockEl = document.getElementById(elementId);
  if (!clockEl) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds} WIB`;
}

setInterval(() => updateLiveClock(), 1000);
