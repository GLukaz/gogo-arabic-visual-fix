/**
 * Storage Quota Management
 *
 * Uses StorageManager API to check quota and request persistent storage.
 *
 * Key features:
 * - Feature detection for StorageManager API (not available in all browsers)
 * - Quota monitoring to prevent IndexedDB overflow
 * - Persistent storage request to prevent eviction
 *
 * Returns:
 * - usage: bytes used
 * - quota: bytes available
 * - percentage: usage as percentage of quota
 * - available: whether StorageManager API is available
 * - usageMB/quotaMB: human-readable sizes
 */

/**
 * Check current storage quota usage
 * @returns {Promise<Object>} Quota information
 */
export const checkStorageQuota = async () => {
  // Feature detection — StorageManager API not available in all browsers/contexts
  if (!navigator.storage || !navigator.storage.estimate) {
    console.warn('[StorageQuota] StorageManager API not available in this browser');
    return {
      usage: 0,
      quota: 0,
      percentage: 0,
      available: false,
      usageMB: 0,
      quotaMB: 0,
    };
  }

  try {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? Math.round((usage / quota) * 100) : 0;

    const usageMB = (usage / (1024 * 1024)).toFixed(2);
    const quotaMB = (quota / (1024 * 1024)).toFixed(2);

    return {
      usage,
      quota,
      percentage,
      available: true,
      usageMB: parseFloat(usageMB),
      quotaMB: parseFloat(quotaMB),
    };
  } catch (error) {
    console.error('[StorageQuota] Failed to estimate storage:', error);
    return {
      usage: 0,
      quota: 0,
      percentage: 0,
      available: false,
      usageMB: 0,
      quotaMB: 0,
    };
  }
};

/**
 * Request persistent storage (prevents eviction under storage pressure)
 * @returns {Promise<boolean>} Whether persistent storage was granted
 */
export const requestPersistentStorage = async () => {
  // Feature detection
  if (!navigator.storage || !navigator.storage.persist) {
    console.warn('[StorageQuota] Persistent storage API not available in this browser');
    return false;
  }

  try {
    const isPersisted = await navigator.storage.persist();

    if (isPersisted) {
    } else {
      console.warn('[StorageQuota] Persistent storage denied — data may be evicted under storage pressure');
    }

    return isPersisted;
  } catch (error) {
    console.error('[StorageQuota] Failed to request persistent storage:', error);
    return false;
  }
};
