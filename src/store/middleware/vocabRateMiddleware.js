/**
 * vocabRateMiddleware.js — Vocabulary Introduction Rate Controller
 *
 * Controls how many new vocabulary words are introduced per day based on
 * the player's current mastery of existing words. Resets at UTC midnight.
 *
 * Rate table (mastery → words/day):
 *   ≥ 85%  → 30 words/day
 *   70–85% → 15 words/day
 *   60–70% → 5 words/day
 *   < 60%  → 0 words/day (focus on review)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Rate table
// ─────────────────────────────────────────────────────────────────────────────

const RATE_TABLE = [
  { threshold: 0.85, wordsPerDay: 30 },
  { threshold: 0.70, wordsPerDay: 15 },
  { threshold: 0.60, wordsPerDay: 5 },
];

/**
 * Get the daily new-word rate for a given mastery percentage.
 *
 * @param {number} masteryPercent — 0–100 or 0–1 (both accepted)
 * @returns {number} words per day (0 | 5 | 15 | 30)
 */
export function getNewWordRate(masteryPercent) {
  if (typeof masteryPercent !== 'number' || isNaN(masteryPercent)) return 0;
  // Normalise: accept either 0-100 or 0-1
  const mastery = masteryPercent > 1 ? masteryPercent / 100 : masteryPercent;
  // Use >= so boundary values (0.60, 0.70, 0.85) fall into the higher bucket
  for (const { threshold, wordsPerDay } of RATE_TABLE) {
    if (mastery >= threshold) return wordsPerDay;
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Module-level daily state (resets on UTC date change)
// ─────────────────────────────────────────────────────────────────────────────

let _daily = {
  date: null, // 'YYYY-MM-DD' UTC
  count: 0,   // new words introduced today
  limit: 5,   // current daily limit (updated from mastery on each intercept)
  paused: false,
};

/** Reset module state — used in tests and when a new day is detected. */
export function _resetDailyState(overrides = {}) {
  _daily = {
    date: null,
    count: 0,
    limit: 5,
    paused: false,
    ...overrides,
  };
}

function _getTodayUTC() {
  return new Date().toISOString().split('T')[0];
}

function _maybeResetForNewDay() {
  const today = _getTodayUTC();
  if (_daily.date !== today) {
    _daily.date = today;
    _daily.count = 0;
    _daily.paused = false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mastery helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive overall mastery from Redux state.
 * Uses the accuracy of the last 20 quiz results (difficulty.recentResults)
 * as a proxy for vocabulary mastery.
 *
 * @param {object} state — full Redux state
 * @returns {number} 0–1
 */
export function _deriveMastery(state) {
  const results = state?.difficulty?.recentResults;
  if (!results || results.length === 0) return 0.5; // default: medium mastery
  const window = results.slice(-20);
  const correct = window.filter((r) => r.correct).length;
  return correct / window.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Select remaining new words allowed today.
 * Reads from difficultySlice if available; falls back to module state.
 *
 * @param {object} state — full Redux state
 * @returns {number}
 */
export function selectRemainingNewWords(state) {
  // Prefer difficultySlice values when the slice is mounted
  const difficulty = state?.difficulty;
  if (difficulty && typeof difficulty.maxNewWordsToday === 'number') {
    return Math.max(0, difficulty.maxNewWordsToday - (difficulty.newWordsToday ?? 0));
  }
  return Math.max(0, _daily.limit - _daily.count);
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Redux middleware that gates vocabulary introduction actions.
 *
 * Intercepts vocabulary/addFsrsCard when source === 'introduction' (or
 * when no source is provided, indicating a new introduction rather than
 * a review sync).
 *
 * When the daily limit is reached:
 *   - Dispatches vocabRate/limitReached action
 *   - Sets internal paused flag until midnight reset
 *   - Still calls next(action) — does NOT hard-block Redux actions; the
 *     dispatch notification lets UI/game logic handle the pause gracefully.
 */
export const vocabRateMiddleware = (store) => (next) => (action) => {
  // Always pass through first so the store stays consistent
  const result = next(action);

  // Only inspect new vocabulary introductions
  if (action.type !== 'vocabulary/addFsrsCard') return result;

  // Reviews / system syncs have a source of 'review', 'sync', 'import', etc.
  // A missing source or source === 'introduction' indicates a new introduction.
  const { source } = action.payload ?? {};
  const isNewIntroduction = !source || source === 'introduction' || source === 'new';
  if (!isNewIntroduction) return result;

  // Check for UTC midnight rollover
  _maybeResetForNewDay();

  // Derive mastery and recalculate limit
  const state = store.getState();
  const mastery = _deriveMastery(state);
  _daily.limit = getNewWordRate(mastery);

  if (_daily.count >= _daily.limit) {
    // Limit reached — notify and set paused flag
    if (!_daily.paused) {
      _daily.paused = true;
      store.dispatch({
        type: 'vocabRate/limitReached',
        payload: { limit: _daily.limit, count: _daily.count, mastery },
      });
    }
  } else {
    // Under limit — increment counter
    _daily.count += 1;

    if (_daily.count >= _daily.limit) {
      // Just hit the limit on this word
      _daily.paused = true;
      store.dispatch({
        type: 'vocabRate/limitReached',
        payload: { limit: _daily.limit, count: _daily.count, mastery },
      });
    }
  }

  return result;
};
