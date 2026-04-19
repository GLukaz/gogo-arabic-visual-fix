/**
 * selectQuestVocabMet — Quest vocabulary gate selector
 *
 * Phase E: Checks if the player has learned (has FSRS card for) all required
 * vocabulary words for a given quest. Returns { met, missing }.
 */

import { createSelector } from '@reduxjs/toolkit';

/**
 * Factory selector: given a quest's requiredVocab array,
 * check against the player's FSRS cards.
 *
 * @param {Array<string>} requiredVocab - Array of wordIds from quest data
 * @returns {function} Selector returning { met: boolean, missing: string[] }
 */
export const makeSelectQuestVocabMet = (requiredVocab) =>
  createSelector(
    [(state) => state.vocabulary?.fsrsCards ?? {}],
    (fsrsCards) => {
      if (!requiredVocab || requiredVocab.length === 0) {
        return { met: true, missing: [] };
      }

      const missing = requiredVocab.filter((wordId) => !fsrsCards[wordId]);

      return {
        met: missing.length === 0,
        missing,
      };
    }
  );

/**
 * Non-memoized version for one-off checks (e.g., in middleware).
 *
 * @param {Object} fsrsCards - From state.vocabulary.fsrsCards
 * @param {Array<string>} requiredVocab - Array of wordIds
 * @returns {{ met: boolean, missing: string[] }}
 */
export function checkQuestVocabMet(fsrsCards, requiredVocab) {
  if (!requiredVocab || requiredVocab.length === 0) {
    return { met: true, missing: [] };
  }

  const missing = requiredVocab.filter((wordId) => !fsrsCards[wordId]);

  return {
    met: missing.length === 0,
    missing,
  };
}
