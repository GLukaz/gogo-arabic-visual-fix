/**
 * Service Worker Registration — Phase 72
 *
 * Registers the SW, listens for updates, and provides
 * a callback to notify the app when a new version is available.
 */

let swRegistration = null;

/**
 * Register the service worker and set up update detection
 * @param {Function} onUpdate - Called when a new SW version is waiting
 */
export function registerSW(onUpdate) {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      swRegistration = registration;

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available — notify the app
            if (onUpdate) onUpdate(registration);
          }
        });
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[SW] Registration failed:', err);
      }
    }
  });
}

/**
 * Tell the waiting SW to take over immediately
 */
export function applyUpdate() {
  if (!swRegistration?.waiting) return;
  swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
}
