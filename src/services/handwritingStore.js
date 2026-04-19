/**
 * handwritingStore.js — Data layer for Arabic handwriting practice
 *
 * Stores stroke data, accuracy metrics, and common mistakes per letter.
 * Uses localStorage for persistence (IndexedDB upgrade path available).
 */

const STORAGE_KEY = 'gogo_handwriting_data';

/**
 * Load all handwriting data from localStorage.
 * @returns {Object} Map of letterId → stats
 */
export function loadHandwritingData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save all handwriting data to localStorage.
 * @param {Object} data
 */
function persistData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — silently fail
  }
}

/**
 * Save a single handwriting attempt for a letter.
 * @param {string} letterId - Arabic letter identifier (e.g., 'alif', 'ba')
 * @param {Object} attempt
 * @param {number} attempt.accuracy - 0-100 accuracy score
 * @param {Array} attempt.strokes - Array of stroke point arrays [{x, y, t}]
 * @param {string} attempt.direction - 'rtl' | 'ltr' | 'correct'
 * @param {string[]} [attempt.mistakes] - Array of mistake types
 * @returns {Object} Updated letter stats
 */
export function saveAttempt(letterId, attempt) {
  if (!letterId || !attempt) return null;

  const data = loadHandwritingData();
  if (!data[letterId]) {
    data[letterId] = {
      letterId,
      attempts: 0,
      totalAccuracy: 0,
      bestAccuracy: 0,
      directionErrors: 0,
      directionCorrect: 0,
      mistakeCounts: {},
      recentAttempts: [],
      firstAttemptAt: new Date().toISOString(),
      lastAttemptAt: null,
    };
  }

  const stats = data[letterId];
  stats.attempts += 1;
  stats.totalAccuracy += (attempt.accuracy || 0);
  stats.bestAccuracy = Math.max(stats.bestAccuracy, attempt.accuracy || 0);
  stats.lastAttemptAt = new Date().toISOString();

  // Track direction errors
  if (attempt.direction === 'ltr') {
    stats.directionErrors += 1;
  } else if (attempt.direction === 'correct' || attempt.direction === 'rtl') {
    stats.directionCorrect += 1;
  }

  // Track mistake types
  if (attempt.mistakes && Array.isArray(attempt.mistakes)) {
    for (const mistake of attempt.mistakes) {
      stats.mistakeCounts[mistake] = (stats.mistakeCounts[mistake] || 0) + 1;
    }
  }

  // Keep last 10 attempts (accuracy + timestamp)
  stats.recentAttempts.push({
    accuracy: attempt.accuracy || 0,
    direction: attempt.direction || 'unknown',
    timestamp: new Date().toISOString(),
  });
  if (stats.recentAttempts.length > 10) {
    stats.recentAttempts = stats.recentAttempts.slice(-10);
  }

  data[letterId] = stats;
  persistData(data);
  return stats;
}

/**
 * Get stats for a specific letter.
 * @param {string} letterId
 * @returns {Object|null}
 */
export function getLetterStats(letterId) {
  const data = loadHandwritingData();
  const stats = data[letterId];
  if (!stats) return null;

  return {
    ...stats,
    averageAccuracy: stats.attempts > 0
      ? Math.round(stats.totalAccuracy / stats.attempts)
      : 0,
    directionErrorRate: (stats.directionErrors + stats.directionCorrect) > 0
      ? Math.round((stats.directionErrors / (stats.directionErrors + stats.directionCorrect)) * 100)
      : 0,
  };
}

/**
 * Get letters sorted by weakness (lowest accuracy first).
 * @param {number} [limit=10]
 * @returns {Array} Array of letter stats with averageAccuracy
 */
export function getWeakLetters(limit = 10) {
  const data = loadHandwritingData();
  return Object.values(data)
    .filter((s) => s.attempts >= 2) // Need at least 2 attempts
    .map((s) => ({
      ...s,
      averageAccuracy: Math.round(s.totalAccuracy / s.attempts),
    }))
    .sort((a, b) => a.averageAccuracy - b.averageAccuracy)
    .slice(0, limit);
}

/**
 * Get letters with frequent direction errors (RTL vs LTR confusion).
 * @param {number} [minErrorRate=30] Minimum error rate percentage
 * @returns {Array}
 */
export function getDirectionErrors(minErrorRate = 30) {
  const data = loadHandwritingData();
  return Object.values(data)
    .filter((s) => {
      const total = s.directionErrors + s.directionCorrect;
      if (total < 3) return false;
      return (s.directionErrors / total) * 100 >= minErrorRate;
    })
    .map((s) => ({
      letterId: s.letterId,
      directionErrors: s.directionErrors,
      directionCorrect: s.directionCorrect,
      errorRate: Math.round((s.directionErrors / (s.directionErrors + s.directionCorrect)) * 100),
    }))
    .sort((a, b) => b.errorRate - a.errorRate);
}

/**
 * Get a summary of all handwriting practice progress.
 * @returns {Object}
 */
export function getHandwritingSummary() {
  const data = loadHandwritingData();
  const entries = Object.values(data);

  if (entries.length === 0) {
    return { lettersAttempted: 0, totalAttempts: 0, averageAccuracy: 0, mastered: 0 };
  }

  const totalAttempts = entries.reduce((sum, s) => sum + s.attempts, 0);
  const totalAccuracy = entries.reduce((sum, s) => sum + s.totalAccuracy, 0);
  const mastered = entries.filter((s) => {
    const avg = s.attempts > 0 ? s.totalAccuracy / s.attempts : 0;
    return avg >= 80 && s.attempts >= 5;
  }).length;

  return {
    lettersAttempted: entries.length,
    totalAttempts,
    averageAccuracy: totalAttempts > 0 ? Math.round(totalAccuracy / totalAttempts) : 0,
    mastered,
  };
}

/**
 * Clear all handwriting data (for testing or reset).
 */
export function clearHandwritingData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
