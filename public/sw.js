/// <reference lib="webworker" />

// Minimal service worker for PWA installation
// This enables the app to be installed as a standalone PWA

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

sw.addEventListener('install', () => {
  console.log('Service Worker installing.');
  sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener('fetch', (event) => {
  // Let the browser handle all fetch requests normally
  event.respondWith(fetch(event.request));
});
