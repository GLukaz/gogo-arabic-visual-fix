/**
 * offlineFsrsMiddleware — Phase 72
 *
 * When offline, intercepts vocabulary/updateFsrsCard actions and queues them
 * in IndexedDB. When the app comes back online, replays the queue.
 * The card update still applies to Redux state immediately (optimistic update)
 * so the user's local session stays current. The queue is for server sync.
 */

import { enqueueReview, syncQueuedReviews, isOnline, getQueueCount } from '../../services/offlineSync.js';
import { updateFsrsCard } from '../slices/vocabularySlice.js';

let syncInProgress = false;

export const offlineFsrsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Queue review for server sync when offline
  if (action.type === 'vocabulary/updateFsrsCard' && !isOnline()) {
    const { wordId, card, log } = action.payload;
    enqueueReview({ wordId, rating: log?.rating ?? 3, card }).catch((err) => {
      if (import.meta.env.DEV) console.warn('[OfflineSync] Queue failed:', err);
    });
  }

  return result;
};

/**
 * Set up online/offline event listeners for auto-sync
 * Called once from main.jsx after store is created
 */
export function initOfflineSync(store) {
  if (typeof window === 'undefined') return;

  const attemptSync = async () => {
    if (syncInProgress || !isOnline()) return;
    syncInProgress = true;
    try {
      const count = await getQueueCount();
      if (count > 0) {
        const synced = await syncQueuedReviews(store.dispatch, updateFsrsCard);
        if (synced > 0 && import.meta.env.DEV) {
          console.log(`[OfflineSync] Synced ${synced} queued reviews`);
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[OfflineSync] Sync failed:', err);
    } finally {
      syncInProgress = false;
    }
  };

  window.addEventListener('online', attemptSync);

  // Also attempt on startup in case we came back online while app was closed
  attemptSync();
}
