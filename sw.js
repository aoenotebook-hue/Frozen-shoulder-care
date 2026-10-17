/* Service worker: lets Android offer "Install app" and keeps the app opening
   when the signal drops. Network first, so a new version always loads when
   online; the saved copy is only a fallback. Only the app's own files are
   handled — results sent to the clinic's Google Sheet (another origin) and
   media (large, range-requested videos) pass straight through untouched. */
const CACHE = 'fs-shell-v1';
const SHELL = ['/', '/index.html', '/app.js', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/media/')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && SHELL.includes(url.pathname)) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('/') : Response.error())))
  );
});
