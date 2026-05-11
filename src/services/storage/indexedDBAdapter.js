/**
 * IndexedDB Storage Adapter for redux-persist
 *
 * Custom storage adapter that persists Redux state to IndexedDB instead of localStorage.
 * Uses cached connection pattern to avoid opening a new DB connection per operation.
 *
 * Architecture:
 * - DB_NAME: 'gogo-arabic-idb'
 * - DB_VERSION: 1 (versioned migration pattern for future phases)
 * - STORE_NAME: 'redux-state'
 *
 * Key design decisions:
 * - Cached connection (dbInstance) to avoid repeated open() calls (Pitfall 4)
 * - Versioned schema with upgrade path for future stores
 * - Explicit error handling — no silent fallback to localStorage
 * - Connection reuse — db is NOT closed after each transaction
 */

const DB_NAME = 'gogo-arabic-idb';
const DB_VERSION = 1;
const STORE_NAME = 'redux-state';

// Cached database connection (module scope)
let dbInstance = null;

/**
 * Get cached IndexedDB connection or open new one
 * @returns {Promise<IDBDatabase>}
 */
const getDB = () => {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not available in this environment (private browsing?)'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open IndexedDB: ${request.error?.message || 'unknown error'}`));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      // Invalidate cache if connection is closed by browser (tab sleep, background eviction)
      dbInstance.onclose = () => { dbInstance = null; };
      dbInstance.onversionchange = () => {
        if (dbInstance) dbInstance.close();
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Version 1: Create redux-state store
      if (event.oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      }

      // Future phases can add more stores here:
      // if (event.oldVersion < 2) { ... }
    };

    request.onblocked = () => {
      console.warn('[IndexedDB] Database upgrade blocked by another tab. Close other tabs to continue.');
    };
  });
};

/**
 * Redux-persist storage adapter interface
 */
const indexedDBStorage = {
  /**
   * Get item from IndexedDB
   * @param {string} key
   * @returns {Promise<string>}
   */
  async getItem(key) {
    try {
      const db = await getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          reject(new Error(`Failed to get item '${key}': ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDB] getItem failed for key '${key}':`, error);
      throw error;
    }
  },

  /**
   * Set item in IndexedDB
   * @param {string} key
   * @param {string} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      const db = await getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to set item '${key}': ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDB] setItem failed for key '${key}':`, error);
      throw error;
    }
  },

  /**
   * Remove item from IndexedDB
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      const db = await getDB();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error(`Failed to remove item '${key}': ${request.error?.message}`));
        };
      });
    } catch (error) {
      console.error(`[IndexedDB] removeItem failed for key '${key}':`, error);
      throw error;
    }
  },
};

export default indexedDBStorage;
