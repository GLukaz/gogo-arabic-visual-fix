/**
 * Difficulty Middleware
 *
 * Phase 87: Difficulty Curve Engine
 *
 * Listens for quiz/challenge completion actions and:
 * - Records result in difficultySlice
 * - Recalculates difficulty level after every 5 results
 * - Checks for fatigue/break suggestion
 * - Adjusts maxNewWordsToday based on mastery
 */

import {
  recordResult,
  adjustDifficulty,
  suggestBreak,
} from '../slices/difficultySlice.js';

import {
  calculateDifficultyLevel,
  shouldSuggestBreak,
  getNewWordRate,
  calculateFatigueFactor,
} from '../../services/difficultyEngine.js';

// Actions that indicate a quiz result was submitted
const QUIZ_RESULT_ACTIONS = [
  'achievements/incrementReviews',
  'achievements/recordPerfectQuiz',
  'dailyChallenge/completeChallenge',
];

/**
 * Extract result data from various action types.
 * Returns null if the action doesn't contain result data we can use.
 */
function extractResultFromAction(action) {
  // Explicit difficulty/recordResult — already handled by the slice
  if (action.type === 'difficulty/recordResult') return null;

  // dailyChallenge/completeChallenge — has score and timeMs
  if (action.type === 'dailyChallenge/completeChallenge') {
    const { score, timeMs, type } = action.payload || {};
    return {
      correct: (score ?? 0) >= 0.7, // 70%+ is correct for daily challenges
      timeMs: timeMs || 0,
      type: type || 'daily',
      timestamp: Date.now(),
    };
  }

  // achievements/recordPerfectQuiz — always correct
  if (action.type === 'achievements/recordPerfectQuiz') {
    return {
      correct: true,
      timeMs: 0,
      type: 'perfect_quiz',
      timestamp: Date.now(),
    };
  }

  return null;
}

// Re-entrancy guard
let _isProcessingDifficulty = false;

export const difficultyMiddleware = (store) => (next) => (action) => {
  // Pass the action through first
  const result = next(action);

  // Prevent re-entrant dispatch cascade
  if (_isProcessingDifficulty) return result;

  // Check if this is a quiz-related action we should track
  const isQuizAction = QUIZ_RESULT_ACTIONS.includes(action.type);

  if (!isQuizAction) return result;

  _isProcessingDifficulty = true;

  try {
    // Extract and record result
    const resultData = extractResultFromAction(action);
    if (resultData) {
      store.dispatch(recordResult(resultData));
    }

    const state = store.getState();
    const difficulty = state.difficulty;

    if (!difficulty) {
      _isProcessingDifficulty = false;
      return result;
    }

    // Recalculate difficulty every 5 results
    if (difficulty.recentResults.length > 0 && difficulty.recentResults.length % 5 === 0) {
      const { level } = calculateDifficultyLevel(
        difficulty.recentResults,
        difficulty.currentLevel,
        20,
      );

      // Calculate new word rate based on recent accuracy
      const recentWindow = difficulty.recentResults.slice(-20);
      const correctCount = recentWindow.filter((r) => r.correct).length;
      const recentMastery = recentWindow.length > 0 ? correctCount / recentWindow.length : 0.5;

      const playerLevel = state.player?.level ?? 1;
      const wordRate = getNewWordRate(recentMastery, playerLevel);

      // Apply fatigue factor to word rate
      const sessionMinutes = difficulty.sessionStart
        ? Math.round((Date.now() - difficulty.sessionStart) / 60000)
        : 0;
      const { factor } = calculateFatigueFactor(sessionMinutes, difficulty.questionsThisSession);
      const adjustedMax = Math.round(wordRate.recommended * factor);

      store.dispatch(adjustDifficulty({
        level,
        maxNewWords: Math.max(1, adjustedMax),
      }));
    }

    // Check for break suggestion (only if not already suggested)
    if (!difficulty.breakSuggested && difficulty.sessionStart) {
      const sessionMinutes = Math.round((Date.now() - difficulty.sessionStart) / 60000);
      const breakCheck = shouldSuggestBreak(
        sessionMinutes,
        difficulty.questionsThisSession,
        difficulty.consecutiveErrors,
      );

      if (breakCheck.suggest) {
        store.dispatch(suggestBreak());
      }
    }
  } finally {
    _isProcessingDifficulty = false;
  }

  return result;
};
