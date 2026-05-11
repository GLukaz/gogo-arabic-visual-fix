/**
 * rootFsrsSyncMiddleware.js — Bidirectional FSRS ↔ Root Mastery sync
 *
 * Sync Direction 1: FSRS card reviewed → increment root XP
 *   - vocabulary/updateFsrsCard action → find root → add weighted XP (30% contribution)
 *
 * Sync Direction 2: Root level-up → suggest derived words for FSRS
 *   - magic/recordRootUse action → level increased → add derived words to FSRS queue
 *
 * Sync Direction 3: Root level triggers form unlock
 *   - Level 3 → Form II, Level 5 → Form III, Level 7 → Form IV, Level 9 → Form V
 *
 * Follows same pattern as achievementMiddleware and dailyGoalsMiddleware.
 */

import { getRootWords, getWordRoot } from '../../data/rootsData.js';
import {
  recordRootUse,
  unlockForm,
} from '../slices/magicSlice.js';
import { addFsrsCard, selectNewCardsByPath } from '../slices/vocabularySlice.js';
import vocabulary from '../../data/vocabularyAll.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';

/**
 * Create a minimal FSRS-compatible card object for new words
 * @returns {Object} Default FSRS card
 */
function createDefaultCard() {
  return {
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
  };
}

/**
 * Map FSRS rating to accuracy value (30% weight for FSRS contribution)
 * @param {number} rating - FSRS rating (1-4)
 * @returns {number} Accuracy value (0-1)
 */
function ratingToAccuracy(rating) {
  if (rating >= 3) return 0.8; // Good/Easy → 0.8 * 0.3 = 0.24 effective → ~5 XP
  if (rating === 2) return 0.5; // Hard → 0.5 * 0.3 = 0.15 effective → ~3 XP
  return 0.3; // Again → 0.3 * 0.3 = 0.09 effective → ~2 XP
}

/**
 * Form unlock thresholds
 */
const FORM_UNLOCK_LEVELS = {
  II: 3,
  III: 5,
  IV: 7,
  V: 9,
};

export const rootFsrsSyncMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState();
  const result = next(action);
  const state = store.getState();

  // ========== SYNC DIRECTION 1: FSRS → Root XP ==========
  if (action.type === 'vocabulary/updateFsrsCard') {
    const wordId = action.payload?.wordId;
    const rating = action.payload?.rating;

    if (wordId && rating !== undefined) {
      // Find root for this word
      const rootInfo = getWordRoot(wordId);

      if (rootInfo && rootInfo.root) {
        // Check if root is discovered in magic system
        const discoveredRoots = state.magic?.discoveredRoots || [];
        if (discoveredRoots.includes(rootInfo.root)) {
          // Convert FSRS rating to accuracy
          const accuracy = ratingToAccuracy(rating);

          // Dispatch recordRootUse with weighted accuracy
          store.dispatch(
            recordRootUse({
              rootId: rootInfo.root,
              form: 'I', // FSRS reviews count toward Form I
              accuracy: accuracy * 0.3, // 30% weight for FSRS contribution
            })
          );
        }
      }
    }
  }

  // ========== SYNC DIRECTION 2: Root Level-Up → FSRS Suggestions ==========
  if (action.type === 'magic/recordRootUse') {
    const rootId = action.payload?.rootId;

    if (rootId) {
      // Compare level before and after
      const prevMastery = prevState.magic?.rootMastery?.[rootId];
      const currentMastery = state.magic?.rootMastery?.[rootId];

      if (prevMastery && currentMastery && currentMastery.level > prevMastery.level) {
        // Level increased — suggest derived words
        const newLevel = currentMastery.level;

        // Get derived words from rootsData
        const rootInfo = getRootWords(rootId);

        if (rootInfo && rootInfo.words) {
          // Use path-aware selector to pick words in affinity order (PATH-03)
          const pathOrderedNewCards = selectNewCardsByPath(state, vocabulary, 100);
          const rootWordSet = new Set(rootInfo.words);
          let wordsToAdd = pathOrderedNewCards
            .filter(w => rootWordSet.has(w.id))
            .map(w => w.id)
            .slice(0, 3);

          // Fallback: if no root words appear in path-ordered list (edge case), use original filter
          if (wordsToAdd.length === 0) {
            const fsrsCards = state.vocabulary?.fsrsCards || {};
            wordsToAdd = rootInfo.words.filter((wordId) => !fsrsCards[wordId]).slice(0, 3);
          }

          wordsToAdd.forEach((wordId) => {
            store.dispatch(
              addFsrsCard({
                wordId,
                card: createDefaultCard(),
                source: 'root_mastery_unlock',
              })
            );
          });
        }

        // Emit root level-up event
        EventBus.emit(EVENTS.MAGIC_ROOT_LEVEL_UP, {
          rootId,
          newLevel,
        });
      }
    }
  }

  // ========== SYNC DIRECTION 3: Root Level → Form Unlock ==========
  if (action.type === 'magic/recordRootUse') {
    const rootId = action.payload?.rootId;

    if (rootId) {
      const mastery = state.magic?.rootMastery?.[rootId];

      if (mastery) {
        const currentLevel = mastery.level;
        const formsUnlocked = mastery.formsUnlocked || [];

        // Check each form unlock threshold
        Object.entries(FORM_UNLOCK_LEVELS).forEach(([form, levelRequired]) => {
          if (currentLevel >= levelRequired && !formsUnlocked.includes(form)) {
            // Unlock form
            store.dispatch(
              unlockForm({
                rootId,
                form,
              })
            );

            // Emit form unlocked event
            EventBus.emit(EVENTS.MAGIC_FORM_UNLOCKED, {
              rootId,
              form,
            });
          }
        });
      }
    }
  }

  return result;
};
