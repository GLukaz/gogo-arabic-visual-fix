/**
 * difficultyEngine.js — Pure functions for dynamic difficulty calibration.
 *
 * Phase 87: Difficulty Curve Engine
 *
 * All functions are pure (no side effects, no Redux imports). Based on
 * Bjork's "desirable difficulty" research — optimal learning occurs when
 * success rate is 70-85%.
 *
 * Exports:
 *   DIFFICULTY_LEVELS           — Ordered difficulty tiers
 *   TARGET_SUCCESS_RATE         — Optimal success rate window
 *   calculateDifficultyLevel    — EMA-based difficulty from recent results
 *   getDistractorDifficulty     — Distractor closeness for a difficulty level
 *   calculateFatigueFactor      — Session fatigue multiplier (1 = fresh)
 *   shouldSuggestBreak          — Whether player should take a break
 *   getRecommendedSessionLength — Suggested session duration from history
 *   getNewWordRate              — Vocabulary introduction rate
 *   rankQuizTypesForDifficulty  — Ordered quiz types by appropriateness
 */

import { QUIZ_TYPE_REGISTRY, CEFR_ORDER } from '../data/quizTypes.js';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Target success rate window for optimal learning (Bjork's desirable difficulty). */
export const TARGET_SUCCESS_RATE = { min: 0.70, max: 0.85, optimal: 0.775 };

/** Ordered difficulty levels from easiest to hardest. */
export const DIFFICULTY_LEVELS = ['beginner', 'easy', 'medium', 'hard', 'expert'];

/**
 * Quiz type categorization by difficulty tier.
 * beginner: recognition tasks
 * easy: recall tasks
 * medium: production tasks
 * hard: complex production
 * expert: deep knowledge
 */
const QUIZ_TYPE_TIERS = {
  beginner: ['ar-to-en', 'picture-word', 'match'],
  easy: ['en-to-ar', 'fill-blank', 'listen', 'listening-comprehension'],
  medium: ['sentence-build', 'conjugation', 'GrammarFill', 'en-to-type-ar', 'transliterate'],
  hard: ['WordOrder', 'ClozePassage', 'dictation', 'category-sort', 'root-identify'],
  expert: ['DialectIdentify', 'RootExpand', 'CulturalContext'],
};

// ─────────────────────────────────────────────────────────────────────────────
// calculateDifficultyLevel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate player's current difficulty level based on recent performance.
 * Uses exponential moving average of last N quiz results.
 *
 * @param {Array<{ correct: boolean, timeMs: number, type: string }>} recentResults
 * @param {string} currentLevel — current difficulty level from state
 * @param {number} [windowSize=20] — number of recent results to consider
 * @returns {{ level: string, successRate: number, direction: 'up'|'down'|'maintain' }}
 */
export function calculateDifficultyLevel(recentResults, currentLevel = 'medium', windowSize = 20) {
  if (!recentResults || recentResults.length === 0) {
    return { level: currentLevel || 'medium', successRate: 0, direction: 'maintain' };
  }

  // Take the last windowSize results
  const window = recentResults.slice(-windowSize);

  // Calculate exponential moving average — more recent results weighted more heavily
  const alpha = 2 / (window.length + 1);
  let ema = window[0].correct ? 1 : 0;

  for (let i = 1; i < window.length; i++) {
    const value = window[i].correct ? 1 : 0;
    ema = alpha * value + (1 - alpha) * ema;
  }

  const successRate = ema;
  const currentIndex = DIFFICULTY_LEVELS.indexOf(currentLevel || 'medium');

  let direction = 'maintain';
  let newIndex = currentIndex;

  if (successRate > TARGET_SUCCESS_RATE.max && currentIndex < DIFFICULTY_LEVELS.length - 1) {
    // Too easy — increase difficulty by exactly 1 level
    newIndex = currentIndex + 1;
    direction = 'up';
  } else if (successRate < TARGET_SUCCESS_RATE.min && currentIndex > 0) {
    // Too hard — decrease difficulty by exactly 1 level
    newIndex = currentIndex - 1;
    direction = 'down';
  }

  return {
    level: DIFFICULTY_LEVELS[newIndex],
    successRate: Math.round(successRate * 1000) / 1000,
    direction,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// getDistractorDifficulty
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get optimal distractor difficulty for a quiz question.
 * Higher value = closer/harder distractors; lower = more distinct/easier.
 *
 * @param {string} difficultyLevel — one of DIFFICULTY_LEVELS
 * @returns {number} 0-1 scale (0 = very distinct distractors, 1 = very close)
 */
export function getDistractorDifficulty(difficultyLevel) {
  const mapping = {
    beginner: 0.15,
    easy: 0.30,
    medium: 0.50,
    hard: 0.70,
    expert: 0.90,
  };
  return mapping[difficultyLevel] ?? 0.50;
}

// ─────────────────────────────────────────────────────────────────────────────
// calculateFatigueFactor
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate session fatigue factor.
 * After ~20 minutes or 30+ questions, reduce difficulty slightly.
 *
 * @param {number} sessionMinutes — minutes since session start
 * @param {number} questionsAnswered — questions answered this session
 * @returns {{ factor: number, fatigued: boolean }}
 *   factor: 0.8-1.0 multiplier (1 = fresh, 0.8 = fatigued)
 *   fatigued: whether fatigue threshold has been crossed
 */
export function calculateFatigueFactor(sessionMinutes, questionsAnswered) {
  if (sessionMinutes < 0) sessionMinutes = 0;
  if (questionsAnswered < 0) questionsAnswered = 0;

  // Time-based fatigue (kicks in after 20 min, maxes at 40 min)
  const timeFatigue = sessionMinutes > 20
    ? Math.min((sessionMinutes - 20) / 20, 1) * 0.15
    : 0;

  // Question-based fatigue (kicks in after 30 questions, maxes at 60)
  const questionFatigue = questionsAnswered > 30
    ? Math.min((questionsAnswered - 30) / 30, 1) * 0.10
    : 0;

  // Take the larger fatigue effect
  const totalFatigue = Math.min(Math.max(timeFatigue, questionFatigue), 0.20);
  const factor = Math.round((1 - totalFatigue) * 100) / 100;
  const fatigued = sessionMinutes > 20 || questionsAnswered > 30;

  return { factor, fatigued };
}

// ─────────────────────────────────────────────────────────────────────────────
// shouldSuggestBreak
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Should the player take a break?
 *
 * @param {number} sessionMinutes — minutes since session start
 * @param {number} questionsAnswered — questions answered this session
 * @param {number} consecutiveErrors — current streak of consecutive wrong answers
 * @returns {{ suggest: boolean, reason: string|null }}
 */
export function shouldSuggestBreak(sessionMinutes, questionsAnswered, consecutiveErrors) {
  if (sessionMinutes > 30) {
    return { suggest: true, reason: 'time' };
  }
  if (questionsAnswered > 50) {
    return { suggest: true, reason: 'questions' };
  }
  if (consecutiveErrors >= 5) {
    return { suggest: true, reason: 'errors' };
  }
  return { suggest: false, reason: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// getRecommendedSessionLength
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get recommended session length based on player history.
 * Average of past 7 sessions, clamped to 10-45 minutes.
 *
 * @param {Array<{ duration: number }>} historicalSessions — past sessions with duration in minutes
 * @returns {number} Recommended session length in minutes
 */
export function getRecommendedSessionLength(historicalSessions) {
  if (!historicalSessions || historicalSessions.length === 0) {
    return 20; // Default for new players
  }

  // Take last 7 sessions
  const recent = historicalSessions.slice(-7);
  const validDurations = recent
    .map((s) => s.duration)
    .filter((d) => typeof d === 'number' && d > 0);

  if (validDurations.length === 0) return 20;

  const avg = validDurations.reduce((sum, d) => sum + d, 0) / validDurations.length;

  // Clamp to 10-45 minutes
  return Math.round(Math.min(45, Math.max(10, avg)));
}

// ─────────────────────────────────────────────────────────────────────────────
// getNewWordRate
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate vocabulary introduction rate.
 * How many new words per session based on mastery of recent words.
 *
 * @param {number} recentMastery — mastery percentage of recently introduced words (0-1)
 * @param {number} currentLevel — player level (1+)
 * @returns {{ min: number, max: number, recommended: number }}
 */
export function getNewWordRate(recentMastery, currentLevel) {
  if (typeof recentMastery !== 'number' || isNaN(recentMastery)) {
    recentMastery = 0.5; // Default to medium mastery
  }
  if (typeof currentLevel !== 'number' || currentLevel < 1) {
    currentLevel = 1;
  }

  // Clamp mastery to 0-1
  recentMastery = Math.min(1, Math.max(0, recentMastery));

  // Level bonus: higher-level players can handle slightly more words
  const levelBonus = Math.min(Math.floor(currentLevel / 5), 2);

  if (recentMastery > 0.80) {
    // High mastery — introduce more new words
    return { min: 5 + levelBonus, max: 8 + levelBonus, recommended: 6 + levelBonus };
  } else if (recentMastery >= 0.60) {
    // Medium mastery — moderate introduction
    return { min: 3 + levelBonus, max: 5 + levelBonus, recommended: 4 + levelBonus };
  } else {
    // Low mastery — focus on review, minimal new words
    return { min: 1, max: 2 + levelBonus, recommended: 1 + Math.min(levelBonus, 1) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// rankQuizTypesForDifficulty
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rank quiz types by appropriateness for current difficulty.
 * Returns ordered array of quiz type keys, best match first.
 *
 * @param {string} difficultyLevel — one of DIFFICULTY_LEVELS
 * @param {number} playerLevel — player's current level
 * @param {string|null} cefrLevel — player's CEFR level ('A1'|'A2'|'B1'|'B2'|null)
 * @returns {string[]} Ordered quiz type keys
 */
export function rankQuizTypesForDifficulty(difficultyLevel, playerLevel, cefrLevel) {
  const diffIndex = DIFFICULTY_LEVELS.indexOf(difficultyLevel);
  if (diffIndex === -1) return [];

  // Build priority order: exact tier first, then adjacent tiers outward
  const tierOrder = [difficultyLevel];
  for (let offset = 1; offset < DIFFICULTY_LEVELS.length; offset++) {
    // Add tier below if it exists
    if (diffIndex - offset >= 0) {
      tierOrder.push(DIFFICULTY_LEVELS[diffIndex - offset]);
    }
    // Add tier above if it exists
    if (diffIndex + offset < DIFFICULTY_LEVELS.length) {
      tierOrder.push(DIFFICULTY_LEVELS[diffIndex + offset]);
    }
  }

  // Collect types in priority order, filtered by player eligibility
  const ranked = [];
  const playerCefrOrder = cefrLevel ? (CEFR_ORDER[cefrLevel] ?? 0) : 99; // null = no gate

  for (const tier of tierOrder) {
    const typesInTier = QUIZ_TYPE_TIERS[tier] || [];
    for (const typeKey of typesInTier) {
      const entry = QUIZ_TYPE_REGISTRY[typeKey];
      if (!entry) continue;

      // Level gate
      if (playerLevel < entry.minLevel) continue;

      // CEFR gate
      if (entry.cefrMin && playerCefrOrder < (CEFR_ORDER[entry.cefrMin] ?? 1)) continue;

      // Skip TTS types if speech synthesis unavailable
      if (entry.requiresTts && typeof window !== 'undefined' && !window.speechSynthesis) continue;

      if (!ranked.includes(typeKey)) {
        ranked.push(typeKey);
      }
    }
  }

  return ranked;
}
