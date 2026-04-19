/**
 * Anti-Frustration Middleware
 *
 * Feature #10: Detects when the player fails the same word 3+ times
 * consecutively and emits TEACHING_MOMENT_TRIGGER via EventBus.
 *
 * The teaching moment includes:
 *   - The word data (arabic, english, transliteration)
 *   - Root family info (if available)
 *   - Audio playback hint
 *
 * Failure counters are in-memory only, reset on correct answer or page reload.
 */

import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

const FAILURE_THRESHOLD = 3;

// In-memory failure tracking: { wordId: { count, lastTimestamp } }
const _failureCounts = {};

/**
 * Reset failure count for a word (called on correct answer).
 * @param {string} wordId
 */
function resetWordFailures(wordId) {
  delete _failureCounts[wordId];
}

/**
 * Increment failure count for a word.
 * @param {string} wordId
 * @returns {number} New failure count
 */
function incrementFailure(wordId) {
  if (!_failureCounts[wordId]) {
    _failureCounts[wordId] = { count: 0, lastTimestamp: 0 };
  }
  _failureCounts[wordId].count += 1;
  _failureCounts[wordId].lastTimestamp = Date.now();
  return _failureCounts[wordId].count;
}

export const antiFrustrationMiddleware = (_store) => (next) => (action) => {
  const result = next(action);

  // Listen for FSRS review results (vocabulary/updateFsrsCard carries rating)
  if (action.type === 'vocabulary/updateFsrsCard') {
    const { wordId, rating } = action.payload || {};
    if (!wordId) return result;

    // FSRS ratings: 1=Again (fail), 2=Hard, 3=Good, 4=Easy
    if (rating === 1) {
      // Failed
      const count = incrementFailure(wordId);

      if (count >= FAILURE_THRESHOLD && count % FAILURE_THRESHOLD === 0) {
        // Trigger teaching moment
        EventBus.emit(EVENTS.TEACHING_MOMENT_TRIGGER || 'react:teaching-moment', {
          wordId,
          failureCount: count,
          reason: 'repeated_failure',
        });
      }
    } else if (rating >= 2) {
      // Got it right (Hard, Good, or Easy) — reset counter
      resetWordFailures(wordId);
    }
  }

  // Also listen for quiz incorrect answers
  if (action.type === 'quiz/answerQuestion') {
    const { wordId, correct } = action.payload || {};
    if (!wordId) return result;

    if (!correct) {
      const count = incrementFailure(wordId);
      if (count >= FAILURE_THRESHOLD && count % FAILURE_THRESHOLD === 0) {
        EventBus.emit(EVENTS.TEACHING_MOMENT_TRIGGER || 'react:teaching-moment', {
          wordId,
          failureCount: count,
          reason: 'quiz_failure',
        });
      }
    } else {
      resetWordFailures(wordId);
    }
  }

  return result;
};

/**
 * Get current failure count for a word (for testing/debugging).
 * @param {string} wordId
 * @returns {number}
 */
export function getFailureCount(wordId) {
  return _failureCounts[wordId]?.count || 0;
}

/**
 * Clear all failure counts (for testing).
 */
export function clearAllFailures() {
  for (const key of Object.keys(_failureCounts)) {
    delete _failureCounts[key];
  }
}

// Export internals for testing
export { _failureCounts, FAILURE_THRESHOLD, resetWordFailures, incrementFailure };
