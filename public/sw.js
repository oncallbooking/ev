// Simple service worker for caching
const CACHE = 'futrifix-v1';
const toCache = ['/', '/index.html', '/app.css', '/app.js'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(toCache)));
});

self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
