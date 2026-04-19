/**
 * Service Worker — Gogo Arabic PWA
 * Phase 72: Offline & PWA
 *
 * Strategies:
 * - Cache-first: static assets (sprites, fonts, audio, images)
 * - Network-first: API calls with IndexedDB fallback
 * - Stale-while-revalidate: JS/CSS bundles
 */

const CACHE_VERSION = 'gogo-arabic-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Static asset extensions for cache-first strategy
const STATIC_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  '.ttf', '.woff', '.woff2', '.otf',
  '.mp3', '.ogg', '.wav', '.m4a',
  '.json',
];

// API path prefix
const API_PREFIX = '/api/';

// Assets to precache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
];

// ─── INSTALL ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('gogo-arabic-') && key !== STATIC_CACHE && key !== API_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // API calls: network-first with cache fallback
  if (url.pathname.startsWith(API_PREFIX)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Static assets: cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // JS/CSS bundles: stale-while-revalidate
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Navigation requests: network-first (SPA fallback to index.html)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }
});

// ─── STRATEGIES ────────────────────────────────────────────────────────────────

/**
 * Cache-first: check cache, fall back to network and cache the response
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Network-first: try network, fall back to cache
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Stale-while-revalidate: return cache immediately, update in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || networkPromise;
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function isStaticAsset(pathname) {
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

// ─── OFFLINE SYNC QUEUE (message-based) ────────────────────────────────────────
// The app posts messages to the SW to queue offline review results.
// When back online, the SW syncs them.

const SYNC_DB_NAME = 'gogo-arabic-offline-sync';
const SYNC_STORE = 'review-queue';

function openSyncDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function enqueueReview(data) {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_STORE);
    store.add({ ...data, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getQueuedReviews() {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readonly');
    const store = tx.objectStore(SYNC_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function clearQueue() {
  const db = await openSyncDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_STORE);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  if (type === 'QUEUE_REVIEW') {
    enqueueReview(payload).then(() => {
      event.source?.postMessage({ type: 'REVIEW_QUEUED', payload });
    });
  }

  if (type === 'GET_QUEUED_REVIEWS') {
    getQueuedReviews().then((reviews) => {
      event.source?.postMessage({ type: 'QUEUED_REVIEWS', payload: reviews });
    });
  }

  if (type === 'CLEAR_REVIEW_QUEUE') {
    clearQueue().then(() => {
      event.source?.postMessage({ type: 'QUEUE_CLEARED' });
    });
  }

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
