const CACHE_NAME = 'confirmacao-saida-v1';
const APP_SHELL = [
  './confirmacao-saida.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Nunca cachear chamadas à API/Storage do Supabase — sempre dado ao vivo.
  if (url.includes('supabase.co')) return;
  // App shell: cache-first, pra abrir instantâneo como um app de verdade.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
