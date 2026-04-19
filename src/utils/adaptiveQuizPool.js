/**
 * Adaptive Quiz Question Pool Selector
 *
 * Selects quiz questions optimized for the player's current difficulty level
 * and FSRS retrievability, targeting a 70-85% success rate.
 *
 * Key concept — retrievability window:
 *   Words in the 0.5-0.85 retrievability range are at the "sweet spot":
 *   - ≥ 0.85: Too well-remembered, reviewing wastes time
 *   - 0.5-0.85: Ideal — challenging but still retrievable ("desirable difficulty")
 *   - < 0.5: Forgotten — reviewing is less efficient
 *
 * FSRS retrievability formula:
 *   R(t, S) = (1 + FSRS_FACTOR × t/S)^FSRS_DECAY
 *   where t = days elapsed since last review, S = stability, DECAY = -0.5, FACTOR = 19/81
 *
 * New cards (reps = 0 or stability = 0) are not included in the pool because
 * they have no FSRS history to determine retrievability.
 */

import { DIFFICULTY_LEVELS } from '../services/difficultyEngine.js';

// ── FSRS constants ─────────────────────────────────────────────────────────────

const FSRS_DECAY  = -0.5;
const FSRS_FACTOR = 19 / 81;

/** Compute FSRS retrievability (0-1). Returns 1.0 for new/unreviewed cards. */
export function computeRetrievability(card, now = new Date()) {
  if (!card || !card.stability || card.reps === 0) return 1.0;

  const lastReview = card.last_review ? new Date(card.last_review) : null;
  if (!lastReview) return 1.0;

  const elapsedDays = Math.max(0, (now.getTime() - lastReview.getTime()) / 86400000);
  return Math.pow(1 + FSRS_FACTOR * elapsedDays / card.stability, FSRS_DECAY);
}

// ── Pool constants ─────────────────────────────────────────────────────────────

/** Retrievability range for the adaptive pool (sweet spot for learning). */
export const RETRIEVABILITY_MIN = 0.5;
export const RETRIEVABILITY_MAX = 0.85;

// ── Main functions ─────────────────────────────────────────────────────────────

/**
 * Select an ordered pool of words for an adaptive quiz session.
 *
 * Algorithm:
 *   1. Compute retrievability for each vocab card
 *   2. Filter to [RETRIEVABILITY_MIN, RETRIEVABILITY_MAX] window
 *   3. Sort ascending by retrievability (most urgent first)
 *   4. Return top `targetCount` word IDs
 *
 * @param {string} playerDifficulty - Current difficulty level (from DIFFICULTY_LEVELS)
 * @param {{ [wordId: string]: { card: Object } }} vocabCards - FSRS card map from Redux state
 * @param {number} targetCount - Maximum number of words to return
 * @param {Date} [now] - Reference time (defaults to current time)
 * @returns {string[]} Ordered array of word IDs (most urgent first)
 */
export function selectAdaptiveQuizPool(playerDifficulty, vocabCards, targetCount, now = new Date()) {
  if (!vocabCards || targetCount <= 0) return [];

  // Score each card
  const scored = [];
  for (const [wordId, data] of Object.entries(vocabCards)) {
    const card = data?.card;
    if (!card) continue;

    const r = computeRetrievability(card, now);

    // Only include words in the sweet-spot retrievability window
    if (r >= RETRIEVABILITY_MIN && r <= RETRIEVABILITY_MAX) {
      scored.push({ wordId, retrievability: r });
    }
  }

  // Sort ascending by retrievability — most urgent (lowest R) first
  scored.sort((a, b) => a.retrievability - b.retrievability);

  return scored.slice(0, targetCount).map((s) => s.wordId);
}

/**
 * Adjust session difficulty based on the last 3 question results.
 *
 * Rules:
 *   3/3 correct  → increase one level (don't exceed 'expert')
 *   0-1/3 correct → decrease one level (don't go below 'beginner')
 *   2/3 correct  → maintain current level
 *
 * @param {string} currentDifficulty - Current difficulty level from DIFFICULTY_LEVELS
 * @param {Array<{ correct: boolean }>} last3Results - Results of the last 3 questions
 * @returns {string} Updated difficulty level
 */
export function adjustSessionDifficulty(currentDifficulty, last3Results) {
  const currentIdx  = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
  const safeIdx     = currentIdx < 0 ? 2 : currentIdx; // default to 'medium' (index 2)
  const safeLevel   = DIFFICULTY_LEVELS[safeIdx];       // always a valid level

  if (!last3Results || last3Results.length < 3) return safeLevel;

  const correct = last3Results.slice(-3).filter((r) => r.correct).length;

  if (correct === 3) {
    // All correct — increase difficulty
    return DIFFICULTY_LEVELS[Math.min(safeIdx + 1, DIFFICULTY_LEVELS.length - 1)];
  }
  if (correct <= 1) {
    // Struggling — decrease difficulty
    return DIFFICULTY_LEVELS[Math.max(safeIdx - 1, 0)];
  }

  // 2/3 correct — maintain
  return safeLevel;
}
