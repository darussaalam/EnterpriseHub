const CACHE_NAME = 'enterprisehub-pwa-v1';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/css/custom.css',
  '/js/pwa-app.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Non-critical cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event with Network-First strategy for dynamic API and Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // For static CSS/JS/Images
  if (url.pathname.startsWith('/css') || url.pathname.startsWith('/js') || url.pathname.startsWith('/icons') || url.hostname.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // For HTML pages / Dynamic API
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Offline Fallback HTML if not found
          return new Response(`
            <!DOCTYPE html>
            <html lang="id">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Mode Offline - EnterpriseHub</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
            </head>
            <body class="bg-light d-flex align-items-center justify-content-center min-vh-100 p-3">
              <div class="card shadow-sm border-0 text-center p-4" style="max-width: 400px; border-radius: 16px;">
                <div class="mb-3 text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-wifi-off" viewBox="0 0 16 16">
                    <path d="M10.706 3.294A12.545 12.545 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c.63 0 1.249.05 1.852.148l.854-.854zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.448 8.448 0 0 1 4.577-1.336c.64 0 1.255.083 1.838.238l.84-.84A9.454 9.454 0 0 0 8 6zm0 3c-.93 0-1.81.25-2.57.697a.479.479 0 0 0-.07.756.52.52 0 0 0 .637.08A4.975 4.975 0 0 1 8 10c.516 0 1.008.077 1.47.218l.812-.812A5.967 5.967 0 0 0 8 9zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                  </svg>
                </div>
                <h5 class="fw-bold mb-2">Anda Sedang Offline</h5>
                <p class="text-muted small mb-4">Koneksi internet Anda terputus. Buka kembali halaman saat terhubung ke jaringan internet.</p>
                <button onclick="window.location.reload()" class="btn btn-primary rounded-pill w-100 py-2">
                  Coba Muat Ulang
                </button>
              </div>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html' } });
        });
      })
  );
});

// Push Notification Event
self.addEventListener('push', (event) => {
  let data = { title: 'EnterpriseHub Notification', body: 'Anda memiliki pembaruan sistem baru.', url: '/mobile/dashboard' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/mobile/dashboard' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const urlToOpen = event.notification.data.url || '/mobile/dashboard';
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
