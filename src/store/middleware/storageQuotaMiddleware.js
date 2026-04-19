/**
 * Storage Quota Monitoring Middleware
 *
 * Redux middleware that monitors IndexedDB storage quota and warns players
 * when usage exceeds 80% of available quota.
 *
 * Key features:
 * - Runs once per session on REHYDRATE (not on every persist action)
 * - Checks quota using StorageManager API
 * - Requests persistent storage to prevent eviction
 * - Dispatches warning notification at 80% threshold
 *
 * Architecture:
 * - Listens for persist/REHYDRATE action (fired after store loads from storage)
 * - Uses session flag to prevent repeated checks
 * - Dispatches showNotification action from uiSlice
 */

import { REHYDRATE } from 'redux-persist';
import { showNotification } from '../slices/uiSlice';
import { checkStorageQuota, requestPersistentStorage } from '../../services/storage/storageQuota';

// Session flag to prevent repeated quota checks
let hasCheckedQuota = false;

/**
 * Storage quota monitoring middleware
 */
export const storageQuotaMiddleware = (store) => (next) => (action) => {
  // Pass action through first
  const result = next(action);

  // Only check on REHYDRATE and once per session
  if (action.type === REHYDRATE && !hasCheckedQuota) {
    hasCheckedQuota = true;

    // Run quota check and persistent storage request asynchronously
    (async () => {
      try {
        // Request persistent storage (one-time on load)
        await requestPersistentStorage();

        // Check current quota usage
        const quota = await checkStorageQuota();

        if (quota.available && quota.percentage > 80) {
          // Dispatch warning notification
          store.dispatch(
            showNotification({
              message: 'Storage almost full. Consider clearing old battle history.',
              type: 'warning',
            })
          );

          console.warn(
            `[StorageQuota] Usage at ${quota.percentage}% (${quota.usageMB}MB / ${quota.quotaMB}MB)`
          );
        }
      } catch (error) {
        console.error('[StorageQuota] Middleware check failed:', error);
        // Non-critical — don't block app startup
      }
    })();
  }

  return result;
};
