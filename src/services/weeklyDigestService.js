/**
 * Weekly Digest Service
 *
 * Feature #7: Surfaces the existing `generateStudyReport()` on login.
 * Tracks when the last digest was shown and only offers a new one
 * after ≥7 days. Stores timestamp in localStorage.
 */

import { generateStudyReport } from './learningAnalytics.js';

const DIGEST_KEY = 'gogo_last_digest_shown';
const MIN_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Check if a weekly digest is ready to show.
 *
 * @returns {boolean}
 */
export function isDigestReady() {
  const lastShown = getLastShownTimestamp();
  if (!lastShown) return true; // Never shown
  return Date.now() - lastShown >= MIN_INTERVAL_MS;
}

/**
 * Get the weekly digest data if ready, or null if not due.
 *
 * @param {Object} playerState - Aggregated player state snapshot
 *   (same shape as generateStudyReport expects)
 * @returns {Object|null} Study report or null
 */
export function getDigestIfReady(playerState) {
  if (!isDigestReady()) return null;

  const report = generateStudyReport(playerState, 'weekly');

  // Only show if there's meaningful activity
  if (report.sessionsCount === 0 && report.wordsReviewed === 0) return null;

  return report;
}

/**
 * Mark the digest as shown (call after user dismisses the digest).
 */
export function markDigestShown() {
  try {
    localStorage.setItem(DIGEST_KEY, String(Date.now()));
  } catch {
    // localStorage quota exceeded — silently ignore
  }
}

/**
 * Get the timestamp of when the digest was last shown.
 * @returns {number|null}
 */
export function getLastShownTimestamp() {
  try {
    const raw = localStorage.getItem(DIGEST_KEY);
    if (!raw) return null;
    const ts = Number(raw);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

/**
 * Reset the digest timer (for testing).
 */
export function resetDigestTimer() {
  try {
    localStorage.removeItem(DIGEST_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Generate a human-friendly summary string from digest data.
 *
 * @param {Object} digest - Output of generateStudyReport
 * @returns {string}
 */
export function formatDigestSummary(digest) {
  if (!digest) return '';

  const parts = [];

  if (digest.wordsReviewed > 0) {
    parts.push(`📚 Reviewed ${digest.wordsReviewed} words`);
  }
  if (digest.wordsMastered > 0) {
    parts.push(`⭐ Mastered ${digest.wordsMastered} words`);
  }
  if (digest.studyMinutes > 0) {
    parts.push(`⏱️ ${digest.studyMinutes} minutes studied`);
  }
  if (digest.streakDays > 0) {
    parts.push(`🔥 ${digest.streakDays} day streak`);
  }
  if (digest.averageAccuracy > 0) {
    parts.push(`🎯 ${digest.averageAccuracy}% accuracy`);
  }

  return parts.join(' • ');
}
