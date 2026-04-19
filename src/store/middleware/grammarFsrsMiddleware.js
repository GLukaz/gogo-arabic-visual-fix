/**
 * grammarFsrsMiddleware — Phase 73
 *
 * Creates/updates FSRS cards for grammar lessons on completeLesson.
 * Uses the same ts-fsrs scheduler as vocabulary reviews.
 *
 * Flow:
 *   grammar/completeLesson dispatched →
 *     1. If no FSRS card exists for this lesson → create one via addGrammarFsrsCard
 *     2. Derive rating from quiz score (≥80 → Good, ≥50 → Hard, else → Again)
 *     3. Schedule next review via ts-fsrs and dispatch updateGrammarFsrsCard
 */

import { createEmptyCard, fsrs, generatorParameters, Rating } from 'ts-fsrs';
import {
  addGrammarFsrsCard,
  updateGrammarFsrsCard,
} from '../slices/grammarSlice.js';

const params = generatorParameters();
const scheduler = fsrs(params);

/**
 * Convert quiz score (0-100) to FSRS rating
 */
function scoreToRating(quizScore) {
  if (quizScore >= 90) return Rating.Easy;
  if (quizScore >= 70) return Rating.Good;
  if (quizScore >= 50) return Rating.Hard;
  return Rating.Again;
}

export const grammarFsrsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === 'grammar/completeLesson') {
    const { lessonId, quizScore } = action.payload;
    const state = store.getState();
    const existing = state.grammar.fsrsCards[lessonId];

    if (!existing) {
      // First completion — create a fresh card and immediately review it
      const freshCard = createEmptyCard();
      const rating = scoreToRating(quizScore);
      const reviewResult = scheduler.repeat(freshCard, new Date());
      const scheduled = reviewResult[rating];

      store.dispatch(addGrammarFsrsCard({ lessonId, card: freshCard }));
      store.dispatch(updateGrammarFsrsCard({
        lessonId,
        card: scheduled.card,
        log: scheduled.log,
      }));
    } else {
      // Subsequent review — schedule next interval from existing card
      const rating = scoreToRating(quizScore);
      const currentCard = existing.card;
      const reviewResult = scheduler.repeat(currentCard, new Date());
      const scheduled = reviewResult[rating];

      store.dispatch(updateGrammarFsrsCard({
        lessonId,
        card: scheduled.card,
        log: scheduled.log,
      }));
    }
  }

  return result;
};
