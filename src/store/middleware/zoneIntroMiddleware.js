/**
 * Zone Intro Middleware — FEAT-046
 *
 * Manages the explicit teaching moment when a player enters a zone for the
 * first time (or hasn't completed the zone's intro vocabulary set).
 *
 * Intercepts two action types:
 *
 * 1. `world/enterZone`
 *    - Checks whether the zone's intro is incomplete (zoneVocabIntroSlice)
 *    - If incomplete, dispatches `zoneIntro/startIntro` to open the teaching session
 *    - If complete, does nothing (lets normal zone entry proceed)
 *
 * 2. `zoneIntro/completeWord`  (shape: { payload: { zoneId, wordId } })
 *    - Marks the word as reviewed in zoneVocabIntroSlice
 *    - Creates a new FSRS card in vocabularySlice (initial Good rating)
 *    - If all words are now reviewed, clears the active intro session
 *
 * Re-entering a zone after dismissal resumes where the player left off because
 * the reviewed-word set is persisted in zoneVocabIntroSlice; the middleware
 * will re-trigger startIntro as long as intro is not complete.
 */

import { startIntro, clearIntro } from '../slices/zoneIntroSlice.js';
import { markWordReviewed, isZoneIntroComplete } from '../slices/zoneVocabIntroSlice.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';
import { getZoneIntroWords } from '../../data/zoneVocabIntros.js';

// ── Module-level state (reset-able for tests) ─────────────────────────────────

/** Expose for test isolation. */
export function _resetIntroMiddlewareState() {
  // Nothing to reset currently — all state lives in Redux slices
  // Kept for API consistency with other middleware test helpers
}

// ── Middleware ────────────────────────────────────────────────────────────────

export const zoneIntroMiddleware = (store) => (next) => (action) => {
  // ── 1. Zone entry: trigger intro if needed ──────────────────────────────────
  if (action.type === 'world/enterZone') {
    const result = next(action);

    const zoneId =
      typeof action.payload === 'string' ? action.payload : action.payload?.zoneId;

    if (zoneId) {
      const state = store.getState();
      const words = getZoneIntroWords(zoneId);

      // Only trigger if zone has intro words and intro is not yet complete
      if (words.length > 0 && !isZoneIntroComplete(zoneId, state)) {
        store.dispatch(startIntro({ zoneId }));
      }
    }

    return result;
  }

  // ── 2. Word completion: mark reviewed + create FSRS card ───────────────────
  if (action.type === 'zoneIntro/completeWord') {
    const result = next(action);

    const { zoneId, wordId } = action.payload ?? {};

    if (zoneId && wordId) {
      // Mark the word as reviewed in zoneVocabIntroSlice
      store.dispatch(markWordReviewed({ zoneId, wordId }));

      // Create an FSRS card for the word if it doesn't already exist
      const state = store.getState();
      const existingCard = state.vocabulary?.fsrsCards?.[wordId];
      if (!existingCard) {
        store.dispatch(
          addFsrsCard({
            wordId,
            // Initial Good rating: state 2 (Review), stability=1 day, difficulty=5
            // This reflects that the player just actively engaged with the word
            state: 1,  // Learning state
            stability: 1,
            difficulty: 5,
            last_review: new Date().toISOString(),
            due: new Date().toISOString(),
            reps: 1,
            lapses: 0,
            source: 'zoneIntro',
          }),
        );
      }

      // After marking reviewed, check if all words in this zone are now complete
      const updatedState = store.getState();
      if (isZoneIntroComplete(zoneId, updatedState)) {
        store.dispatch(clearIntro());
      }
    }

    return result;
  }

  // Pass through all other actions
  return next(action);
};
