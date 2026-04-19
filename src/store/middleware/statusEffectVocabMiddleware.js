/**
 * statusEffectVocabMiddleware.js — Auto-sync status effect vocabulary to FSRS
 *
 * When a status effect is applied in battle, automatically add its Arabic vocabulary
 * to the FSRS review queue if not already present. This ensures combat-related
 * vocabulary integrates seamlessly with the spaced repetition system.
 *
 * Compound effects also queue their own Arabic vocabulary when applied.
 *
 * Follows the same pattern as craftingVocabMiddleware.js.
 */

import { getStatusEffect, COMPOUND_EFFECTS } from '../../data/statusEffects.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';

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

export const statusEffectVocabMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Listen for status effect application in battle
  if (action.type === 'battle/applyStatusEffect') {
    const effect = action.payload?.effect;

    if (effect && effect.id) {
      const state = store.getState();
      const fsrsCards = state.vocabulary?.fsrsCards || {};

      // Check if this is a compound effect application
      if (action.payload.compound) {
        const compound = COMPOUND_EFFECTS[effect.id];
        if (compound && compound.arabic) {
          const wordId = `compound_${effect.id}`;
          if (!fsrsCards[wordId]) {
            store.dispatch(
              addFsrsCard({
                wordId,
                card: createDefaultCard(),
                source: 'battle_compound_effect',
              })
            );
          }
        }
      } else {
        // Regular status effect — look up and queue its Arabic vocabulary
        const effectData = getStatusEffect(effect.id);
        if (effectData && effectData.arabic) {
          const wordId = `status_${effect.id}`;
          if (!fsrsCards[wordId]) {
            store.dispatch(
              addFsrsCard({
                wordId,
                card: createDefaultCard(),
                source: 'battle_status_effect',
              })
            );
          }
        }
      }
    }
  }

  return result;
};
