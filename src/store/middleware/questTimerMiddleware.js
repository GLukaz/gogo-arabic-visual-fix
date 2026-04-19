/**
 * questTimerMiddleware.js
 * FEAT-039: Quest branching and failure states
 *
 * Tracks active timed quests and dispatches failQuest when their
 * timeLimitMinutes expires. Checks every 60 seconds.
 *
 * Exports:
 *   clearQuestTimerClock()   — cancel the interval (use in test afterEach)
 *   checkExpiredTimers(store) — exported for direct test invocation
 */

import { failQuest, selectActiveTimedQuests } from '../slices/questSlice.js';

// ── Timer state ───────────────────────────────────────────────────────────────

let _timerInterval = null;

/**
 * Cancel the running quest-timer interval.
 * Call this in test `afterEach` hooks to prevent timer leaks.
 */
export function clearQuestTimerClock() {
  if (_timerInterval !== null) {
    clearInterval(_timerInterval);
    _timerInterval = null;
  }
}

// ── Core check ────────────────────────────────────────────────────────────────

/**
 * Inspect every active timed quest and fail any that have exceeded their limit.
 * Exported so tests can invoke it directly without waiting for the interval.
 *
 * @param {object} store — Redux store
 */
export function checkExpiredTimers(store) {
  const state = store.getState();
  const timedQuests = selectActiveTimedQuests(state);

  const now = Date.now();
  for (const [questId, quest] of Object.entries(timedQuests)) {
    const elapsedMs = now - quest.timerStartedAt;
    const limitMs = quest.timeLimitMinutes * 60_000;
    if (elapsedMs >= limitMs) {
      store.dispatch(failQuest({ questId, reason: 'timeout' }));
    }
  }
}

// ── Middleware ────────────────────────────────────────────────────────────────

export const questTimerMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Start the timer checker on app initialisation / rehydration.
  // Redux 5.x appends a random suffix to @@redux/INIT, so use startsWith.
  if (action.type === 'persist/REHYDRATE' || action.type.startsWith('@@redux/INIT')) {
    clearQuestTimerClock();
    _timerInterval = setInterval(() => {
      checkExpiredTimers(store);
    }, 60_000);
  }

  return result;
};
