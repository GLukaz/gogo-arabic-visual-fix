/**
 * Progression Service — Phase 88
 *
 * Pure functions for all progression calculations.
 * No Redux, no side effects — every function takes data in and returns data out.
 */

import {
  XP_CURVE,
  VOCAB_PACING,
  UNLOCK_GATES,
  XP_REWARDS,
  SESSION_CONFIG,
} from '../data/progressionConfig.js';

// ─────────────────────────────────────────────────────────────
// LEVEL CALCULATIONS
// ─────────────────────────────────────────────────────────────

/**
 * Calculate player level from total cumulative XP.
 * Walks the XP curve until the total is exhausted.
 *
 * @param {number} totalXp — cumulative XP earned
 * @returns {number} current level (1-based, capped at maxLevel)
 */
export function calculateLevel(totalXp) {
  if (totalXp <= 0) return 1;

  let remaining = totalXp;
  for (let level = 1; level <= XP_CURVE.maxLevel; level++) {
    const needed = XP_CURVE.getXpForLevel(level);
    if (remaining < needed) return level;
    remaining -= needed;
  }
  return XP_CURVE.maxLevel;
}

/**
 * Get detailed XP progress for the current level.
 *
 * @param {number} totalXp — cumulative XP earned
 * @returns {{ level: number, currentXp: number, xpToNext: number, percentage: number, totalXp: number }}
 */
export function getXpProgress(totalXp) {
  if (totalXp <= 0) {
    const xpToNext = XP_CURVE.getXpForLevel(1);
    return { level: 1, currentXp: 0, xpToNext, percentage: 0, totalXp: 0 };
  }

  let remaining = totalXp;
  for (let level = 1; level <= XP_CURVE.maxLevel; level++) {
    const needed = XP_CURVE.getXpForLevel(level);
    if (remaining < needed) {
      const percentage = Math.round((remaining / needed) * 100);
      return { level, currentXp: remaining, xpToNext: needed, percentage, totalXp };
    }
    remaining -= needed;
  }

  // Max level reached
  const maxNeeded = XP_CURVE.getXpForLevel(XP_CURVE.maxLevel);
  return {
    level: XP_CURVE.maxLevel,
    currentXp: remaining,
    xpToNext: maxNeeded,
    percentage: 100,
    totalXp,
  };
}

// ─────────────────────────────────────────────────────────────
// VOCABULARY PACING
// ─────────────────────────────────────────────────────────────

/**
 * Get the proficiency tier name for a given level.
 *
 * @param {number} level
 * @returns {string} tier name (beginner, elementary, intermediate, advanced, expert)
 */
export function getTierForLevel(level) {
  const { tierRanges } = VOCAB_PACING;
  for (const [tier, [min, max]] of Object.entries(tierRanges)) {
    if (level >= min && level <= max) return tier;
  }
  return 'expert'; // above max level
}

/**
 * Get vocabulary pacing parameters for a given player level.
 *
 * @param {number} level
 * @returns {{ tier: string, newWordsPerDay: number, maxReviewsPerSession: number, masteryThreshold: number, newWordCooldownMinutes: number }}
 */
export function getVocabPacingForLevel(level) {
  const tier = getTierForLevel(level);
  return {
    tier,
    newWordsPerDay: VOCAB_PACING.newWordsPerDay[tier],
    maxReviewsPerSession: VOCAB_PACING.maxReviewsPerSession,
    masteryThreshold: VOCAB_PACING.masteryThreshold,
    newWordCooldownMinutes: VOCAB_PACING.newWordCooldownMinutes,
  };
}

// ─────────────────────────────────────────────────────────────
// FEATURE UNLOCKS
// ─────────────────────────────────────────────────────────────

/**
 * Check if a specific feature is unlocked at a given level.
 *
 * @param {string} feature — feature key from UNLOCK_GATES.features
 * @param {number} level — player level
 * @returns {boolean}
 */
export function isFeatureUnlocked(feature, level) {
  const requiredLevel = UNLOCK_GATES.features[feature];
  if (requiredLevel === undefined) return false;
  return level >= requiredLevel;
}

/**
 * Check if a specific quiz type is unlocked at a given level.
 *
 * @param {string} quizType — quiz type key from UNLOCK_GATES.quizTypes
 * @param {number} level — player level
 * @returns {boolean}
 */
export function isQuizTypeUnlocked(quizType, level) {
  const requiredLevel = UNLOCK_GATES.quizTypes[quizType];
  if (requiredLevel === undefined) return false;
  return level >= requiredLevel;
}

/**
 * Get all features unlocked at a given level.
 *
 * @param {number} level
 * @returns {string[]} array of feature keys
 */
export function getUnlockedFeatures(level) {
  return Object.entries(UNLOCK_GATES.features)
    .filter(([, reqLevel]) => level >= reqLevel)
    .map(([feature]) => feature);
}

/**
 * Get all quiz types unlocked at a given level.
 *
 * @param {number} level
 * @returns {string[]} array of quiz type keys
 */
export function getUnlockedQuizTypes(level) {
  return Object.entries(UNLOCK_GATES.quizTypes)
    .filter(([, reqLevel]) => level >= reqLevel)
    .map(([quizType]) => quizType);
}

/**
 * Get the next feature that will unlock after the current level.
 * Returns null if all features are already unlocked.
 *
 * @param {number} level
 * @returns {{ feature: string, level: number, name: { en: string, ar: string }, description: string } | null}
 */
export function getNextUnlock(level) {
  const upcoming = Object.entries(UNLOCK_GATES.features)
    .filter(([, reqLevel]) => reqLevel > level)
    .sort(([, a], [, b]) => a - b);

  if (upcoming.length === 0) return null;

  const [feature, reqLevel] = upcoming[0];
  return {
    feature,
    level: reqLevel,
    name: UNLOCK_GATES.featureNames[feature] || { en: feature, ar: '' },
    description: UNLOCK_GATES.featureDescriptions[feature] || '',
  };
}

/**
 * Get all upcoming unlocks (features not yet available).
 *
 * @param {number} level
 * @returns {Array<{ feature: string, level: number, name: { en: string, ar: string }, description: string }>}
 */
export function getUpcomingUnlocks(level) {
  return Object.entries(UNLOCK_GATES.features)
    .filter(([, reqLevel]) => reqLevel > level)
    .sort(([, a], [, b]) => a - b)
    .map(([feature, reqLevel]) => ({
      feature,
      level: reqLevel,
      name: UNLOCK_GATES.featureNames[feature] || { en: feature, ar: '' },
      description: UNLOCK_GATES.featureDescriptions[feature] || '',
    }));
}

/**
 * Get features that were just unlocked at exactly this level (for toast notifications).
 *
 * @param {number} level
 * @returns {Array<{ feature: string, name: { en: string, ar: string }, description: string }>}
 */
export function getFeaturesUnlockedAtLevel(level) {
  return Object.entries(UNLOCK_GATES.features)
    .filter(([, reqLevel]) => reqLevel === level)
    .map(([feature]) => ({
      feature,
      name: UNLOCK_GATES.featureNames[feature] || { en: feature, ar: '' },
      description: UNLOCK_GATES.featureDescriptions[feature] || '',
    }));
}

// ─────────────────────────────────────────────────────────────
// SESSION PLANNING
// ─────────────────────────────────────────────────────────────

/**
 * Generate an optimal session plan based on player state.
 *
 * @param {Object} playerState
 * @param {number} playerState.level — player level
 * @param {string[]} playerState.reviewWords — word IDs due for review
 * @param {string[]} playerState.newWords — word IDs available to learn
 * @param {number} playerState.recentMastery — ratio of recent "good" ratings (0-1)
 * @param {number} playerState.streak — current study streak
 * @param {string[]} [playerState.unlockedQuizTypes] — quiz types the player has access to
 * @returns {{ warmup: string[], newContent: string[], review: string[], cooldown: string[], totalItems: number, estimatedMinutes: number }}
 */
export function getSessionPlan(playerState) {
  const {
    level = 1,
    reviewWords = [],
    newWords = [],
    recentMastery = 1,
    streak = 0,
    unlockedQuizTypes = [],
  } = playerState;

  const pacing = getVocabPacingForLevel(level);
  const { warmupQuestions, cooldownQuestions, reviewToNewRatio, maxDurationMinutes } = SESSION_CONFIG;

  // Determine how many new words are allowed this session
  const canIntroduceNew = recentMastery >= pacing.masteryThreshold;
  const maxNewPerSession = canIntroduceNew
    ? Math.min(Math.ceil(pacing.newWordsPerDay / 2), newWords.length) // half daily budget per session
    : 0;

  // Total review budget for this session
  const reviewBudget = Math.min(reviewWords.length, pacing.maxReviewsPerSession);

  // Warmup: take easy review words first (front of review queue = most overdue = easiest)
  const warmup = reviewWords.slice(0, Math.min(warmupQuestions, reviewBudget));

  // Remaining review words after warmup
  const remainingReview = reviewWords.slice(warmup.length, reviewBudget);

  // Calculate review vs new split from remaining pool
  const totalRemaining = remainingReview.length + maxNewPerSession;
  const targetReviewCount = Math.round(totalRemaining * reviewToNewRatio);
  const targetNewCount = totalRemaining - targetReviewCount;

  const review = remainingReview.slice(0, Math.min(targetReviewCount, remainingReview.length));
  const newContent = newWords.slice(0, Math.min(targetNewCount, maxNewPerSession));

  // Cooldown: grab the easiest remaining review words
  const usedReviewIds = new Set([...warmup, ...review]);
  const cooldownPool = reviewWords.filter((w) => !usedReviewIds.has(w));
  const cooldown = cooldownPool.slice(0, Math.min(cooldownQuestions, cooldownPool.length));

  const totalItems = warmup.length + review.length + newContent.length + cooldown.length;
  // Rough estimate: ~30 seconds per item
  const estimatedMinutes = Math.min(Math.round(totalItems * 0.5), maxDurationMinutes);

  return {
    warmup,
    newContent,
    review,
    cooldown,
    totalItems,
    estimatedMinutes,
    quizTypes: unlockedQuizTypes.length > 0 ? unlockedQuizTypes : getUnlockedQuizTypes(level),
  };
}

// ─────────────────────────────────────────────────────────────
// XP REWARD CALCULATION
// ─────────────────────────────────────────────────────────────

/**
 * Calculate XP reward for an activity.
 *
 * @param {string} activity — activity category (e.g., 'quiz', 'grammar', 'quest')
 * @param {string} type — specific action within category (e.g., 'correct', 'lessonComplete')
 * @param {Object} [params] — optional modifiers
 * @param {number} [params.streakDays] — daily streak for multiplier
 * @param {boolean} [params.perfect] — whether the attempt was perfect
 * @returns {number} XP reward amount
 */
export function calculateXpReward(activity, type, params = {}) {
  const category = XP_REWARDS[activity];
  if (!category) return 0;

  let baseXp = category[type];
  if (baseXp === undefined) return 0;

  // Apply daily challenge streak multiplier
  if (activity === 'dailyChallenge' && params.streakDays) {
    const multiplier = 1 + (params.streakDays * XP_REWARDS.dailyChallenge.streakMultiplierPerDay);
    baseXp = Math.round(baseXp * multiplier);
  }

  return baseXp;
}

// ─────────────────────────────────────────────────────────────
// CEFR ESTIMATION
// ─────────────────────────────────────────────────────────────

/**
 * Estimate CEFR level based on grammar lessons completed and vocabulary size.
 *
 * @param {number} grammarLessonsCompleted
 * @param {number} vocabSize — number of words learned
 * @returns {string} estimated CEFR level ('Pre-A1', 'A1', 'A2', 'B1', 'B2')
 */
export function estimateCefrLevel(grammarLessonsCompleted, vocabSize) {
  const gates = UNLOCK_GATES.cefrGates;

  // Check from highest to lowest
  if (grammarLessonsCompleted >= gates.B2.grammarLessons && vocabSize >= gates.B2.vocabSize) {
    return 'B2';
  }
  if (grammarLessonsCompleted >= gates.B1.grammarLessons && vocabSize >= gates.B1.vocabSize) {
    return 'B1';
  }
  if (grammarLessonsCompleted >= gates.A2.grammarLessons && vocabSize >= gates.A2.vocabSize) {
    return 'A2';
  }
  if (grammarLessonsCompleted >= gates.A1.grammarLessons && vocabSize >= gates.A1.vocabSize) {
    return 'A1';
  }
  return 'Pre-A1';
}

/**
 * Get progress toward the next CEFR level.
 *
 * @param {number} grammarLessonsCompleted
 * @param {number} vocabSize
 * @returns {{ currentLevel: string, nextLevel: string|null, grammarProgress: number, vocabProgress: number, overallProgress: number }}
 */
export function getCefrProgress(grammarLessonsCompleted, vocabSize) {
  const current = estimateCefrLevel(grammarLessonsCompleted, vocabSize);
  const levels = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];
  const currentIdx = levels.indexOf(current);

  if (currentIdx >= levels.length - 1) {
    return {
      currentLevel: current,
      nextLevel: null,
      grammarProgress: 100,
      vocabProgress: 100,
      overallProgress: 100,
    };
  }

  const nextLevel = levels[currentIdx + 1];
  const nextGate = UNLOCK_GATES.cefrGates[nextLevel];

  if (!nextGate) {
    return {
      currentLevel: current,
      nextLevel: null,
      grammarProgress: 100,
      vocabProgress: 100,
      overallProgress: 100,
    };
  }

  const grammarProgress = Math.min(100, Math.round((grammarLessonsCompleted / nextGate.grammarLessons) * 100));
  const vocabProgress = Math.min(100, Math.round((vocabSize / nextGate.vocabSize) * 100));
  const overallProgress = Math.round((grammarProgress + vocabProgress) / 2);

  return {
    currentLevel: current,
    nextLevel,
    grammarProgress,
    vocabProgress,
    overallProgress,
  };
}

// ─────────────────────────────────────────────────────────────
// PROGRESS REPORT
// ─────────────────────────────────────────────────────────────

/**
 * Generate a comprehensive progress report from player state.
 *
 * @param {Object} playerState
 * @param {number} playerState.level
 * @param {number} playerState.xp — total cumulative XP
 * @param {number} playerState.wordsLearned — total words in FSRS
 * @param {number} playerState.wordsMastered — words with high stability
 * @param {number} playerState.grammarLessonsCompleted — grammar lessons done
 * @param {number} playerState.grammarLessonsTotal — total grammar lessons available
 * @param {number} playerState.questsCompleted — quests finished
 * @param {number} playerState.questsTotal — total quests available
 * @param {number} playerState.streak — current study streak
 * @param {number} playerState.maxStreak — all-time best streak
 * @param {number} [playerState.totalStudyTimeMinutes] — total study time
 * @param {number} [playerState.sessionsThisWeek] — sessions this week
 * @param {number} [playerState.newWordsToday] — words learned today
 * @returns {Object} comprehensive progress report
 */
export function getProgressReport(playerState) {
  const {
    level = 1,
    xp = 0,
    wordsLearned = 0,
    wordsMastered = 0,
    grammarLessonsCompleted = 0,
    grammarLessonsTotal = 50,
    questsCompleted = 0,
    questsTotal = 60,
    streak = 0,
    maxStreak = 0,
    totalStudyTimeMinutes = 0,
    sessionsThisWeek = 0,
    newWordsToday = 0,
  } = playerState;

  const xpProgress = getXpProgress(xp);
  const vocabPacing = getVocabPacingForLevel(level);
  const cefrProgress = getCefrProgress(grammarLessonsCompleted, wordsLearned);
  const unlockedFeatures = getUnlockedFeatures(level);
  const nextUnlock = getNextUnlock(level);
  const upcomingUnlocks = getUpcomingUnlocks(level).slice(0, 3); // show next 3

  return {
    // Level progress
    level: xpProgress.level,
    currentXp: xpProgress.currentXp,
    xpToNext: xpProgress.xpToNext,
    xpPercentage: xpProgress.percentage,
    totalXp: xp,

    // Vocabulary
    wordsLearned,
    wordsMastered,
    masteryPercentage: wordsLearned > 0 ? Math.round((wordsMastered / wordsLearned) * 100) : 0,
    newWordsToday,
    newWordsBudget: vocabPacing.newWordsPerDay,
    vocabTier: vocabPacing.tier,

    // Grammar
    grammarLessonsCompleted,
    grammarLessonsTotal,
    grammarPercentage: grammarLessonsTotal > 0
      ? Math.round((grammarLessonsCompleted / grammarLessonsTotal) * 100)
      : 0,

    // Quests
    questsCompleted,
    questsTotal,
    questPercentage: questsTotal > 0
      ? Math.round((questsCompleted / questsTotal) * 100)
      : 0,

    // Engagement
    streak,
    maxStreak,
    totalStudyTimeMinutes,
    sessionsThisWeek,

    // CEFR
    estimatedCefrLevel: cefrProgress.currentLevel,
    cefrProgress,

    // Unlocks
    unlockedFeatureCount: unlockedFeatures.length,
    totalFeatureCount: Object.keys(UNLOCK_GATES.features).length,
    nextUnlock,
    upcomingUnlocks,
  };
}
