const CACHE_NAME = 'science-animator-v14-spacecraft-travel';
const PLANET_TEXTURES = [
  './assets/planets/high/mercury.jpg',
  './assets/planets/high/venus-surface.jpg',
  './assets/planets/high/venus-atmosphere.jpg',
  './assets/planets/high/earth-day.jpg',
  './assets/planets/high/earth-night.jpg',
  './assets/planets/high/earth-clouds.jpg',
  './assets/planets/high/mars.jpg',
  './assets/planets/high/jupiter.jpg',
  './assets/planets/high/saturn.jpg',
  './assets/planets/high/saturn-ring.png',
  './assets/planets/high/uranus.jpg',
  './assets/planets/high/neptune.jpg',
];
// Moon textures are generated deterministically inside the cached application bundle.
const APP_SHELL = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './ATTRIBUTION.md',
  ...PLANET_TEXTURES,
];

async function discoverBuiltAssets() {
  try {
    const response = await fetch('./index.html', { cache: 'reload' });
    const html = await response.text();
    const paths = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map((match) => match[1])
      .filter((path) => path.startsWith('./') || path.startsWith('/assets/') || path.startsWith('assets/'));
    return [...new Set([...APP_SHELL, ...paths])];
  } catch {
    return APP_SHELL;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const assets = await discoverBuiltAssets();
      await Promise.allSettled(assets.map((asset) => cache.add(asset)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(async () =>
          (await caches.match('./index.html')) ||
          (await caches.match('./')) ||
          (await caches.match('./offline.html')),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
