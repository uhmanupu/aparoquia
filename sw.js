// sw.js
const CACHE_NAME = 'sacristia-v1';
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap',
  'https://cdn-icons-png.flaticon.com/512/12114/12114233.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.hostname.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
