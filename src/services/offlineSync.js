/**
 * Offline Sync Service — Phase 72
 *
 * Queues FSRS review results in IndexedDB when offline.
 * Syncs queued reviews when connection is restored.
 * Works both with and without service worker.
 */

const SYNC_DB_NAME = 'gogo-arabic-offline-sync';
const SYNC_STORE = 'review-queue';
const DB_VERSION = 1;

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(SYNC_DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      dbInstance.onclose = () => { dbInstance = null; };
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue a review result for later sync
 * @param {{ wordId: string, rating: number, card: object }} reviewData
 */
export async function enqueueReview(reviewData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_STORE);
    store.add({ ...reviewData, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get all queued reviews
 * @returns {Promise<Array>}
 */
export async function getQueuedReviews() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readonly');
    const store = tx.objectStore(SYNC_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Clear all queued reviews after successful sync
 */
export async function clearReviewQueue() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    const store = tx.objectStore(SYNC_STORE);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Get count of queued reviews
 * @returns {Promise<number>}
 */
export async function getQueueCount() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SYNC_STORE, 'readonly');
    const store = tx.objectStore(SYNC_STORE);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Sync queued reviews by dispatching them to the Redux store
 * @param {Function} dispatch - Redux store.dispatch
 * @param {Function} updateFsrsCard - The action creator from vocabularySlice
 * @returns {Promise<number>} Number of reviews synced
 */
export async function syncQueuedReviews(dispatch, updateFsrsCard) {
  const reviews = await getQueuedReviews();
  if (reviews.length === 0) return 0;

  for (const review of reviews) {
    dispatch(updateFsrsCard({
      wordId: review.wordId,
      rating: review.rating,
      card: review.card,
    }));
  }

  await clearReviewQueue();
  return reviews.length;
}

/**
 * Check if currently online
 * @returns {boolean}
 */
export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// ─── Generic Action Queue (Feature #11) ─────────────

const ACTION_QUEUE_STORE = 'action-queue';
const ACTION_DB_VERSION = 2;

// Whitelist of action types safe to queue and replay
const QUEUEABLE_ACTION_TYPES = new Set([
  'quests/updateQuestProgress',
  'quests/completeQuest',
  'quests/visitNpc',
  'quests/visitZone',
  'quests/completeDialogue',
  'quests/recordReviewSession',
  'quests/recordQuizPassed',
  'grammar/completeLesson',
  'grammar/recordExerciseProgress',
  'grammar/recordQuizProgress',
  'grammar/updateGrammarFsrsCard',
  'achievements/unlock',
  'achievements/incrementReviews',
  'player/incrementWordsLearned',
  'player/addXP',
  'vocabulary/updateFsrsCard',
]);

let actionDbInstance = null;

function openActionDB() {
  if (actionDbInstance) return Promise.resolve(actionDbInstance);

  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(SYNC_DB_NAME, ACTION_DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(ACTION_QUEUE_STORE)) {
        db.createObjectStore(ACTION_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => {
      actionDbInstance = request.result;
      actionDbInstance.onclose = () => { actionDbInstance = null; };
      resolve(actionDbInstance);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Queue a Redux action for later replay.
 * Only whitelisted action types are accepted.
 *
 * @param {Object} action - { type, payload }
 * @returns {Promise<boolean>} True if queued, false if not whitelisted
 */
export async function enqueueAction(action) {
  if (!action?.type || !QUEUEABLE_ACTION_TYPES.has(action.type)) {
    return false;
  }

  const db = await openActionDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ACTION_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(ACTION_QUEUE_STORE);
    store.add({
      type: action.type,
      payload: action.payload,
      timestamp: Date.now(),
    });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Replay all queued actions by dispatching them to the Redux store.
 *
 * @param {Function} dispatch - Redux store.dispatch
 * @returns {Promise<number>} Number of actions replayed
 */
export async function syncQueuedActions(dispatch) {
  const db = await openActionDB();
  const actions = await new Promise((resolve, reject) => {
    const tx = db.transaction(ACTION_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(ACTION_QUEUE_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (actions.length === 0) return 0;

  // Sort by timestamp to maintain order
  actions.sort((a, b) => a.timestamp - b.timestamp);

  for (const action of actions) {
    dispatch({ type: action.type, payload: action.payload });
  }

  // Clear the queue
  await new Promise((resolve, reject) => {
    const tx = db.transaction(ACTION_QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(ACTION_QUEUE_STORE);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return actions.length;
}

/**
 * Get count of queued actions.
 * @returns {Promise<number>}
 */
export async function getActionQueueCount() {
  const db = await openActionDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ACTION_QUEUE_STORE, 'readonly');
    const store = tx.objectStore(ACTION_QUEUE_STORE);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if an action type is in the whitelist.
 * @param {string} actionType
 * @returns {boolean}
 */
export function isActionQueueable(actionType) {
  return QUEUEABLE_ACTION_TYPES.has(actionType);
}

