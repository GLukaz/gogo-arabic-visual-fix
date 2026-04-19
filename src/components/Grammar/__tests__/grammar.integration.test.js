import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import grammarReducer, {
  startLesson,
  completeLesson,
  recordExerciseProgress,
  recordQuizProgress,
  clearCurrentLesson,
  unlockNextLesson,
  resetGrammarProgress,
  addGrammarFsrsCard,
  updateGrammarFsrsCard,
} from '../../../store/slices/grammarSlice.js';

/**
 * Grammar System Integration Tests (Phase H / Ralph Phase 71)
 *
 * Tests the full grammar lesson lifecycle:
 *   unlock → start → exercises → quiz → complete → next lesson unlock → FSRS scheduling
 */
describe('Grammar System Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { grammar: grammarReducer },
    });
  });

  describe('Lesson lifecycle', () => {
    it('should start with al-definite unlocked', () => {
      const state = store.getState().grammar;
      expect(state.unlockedLessons).toContain('al-definite');
    });

    it('should start a lesson', () => {
      store.dispatch(startLesson('al-definite'));
      expect(store.getState().grammar.currentLessonId).toBe('al-definite');
    });

    it('should complete a lesson and track scores', () => {
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 80,
        quizScore: 90,
      }));

      const state = store.getState().grammar;
      expect(state.completedLessons).toContain('al-definite');
      expect(state.lessonScores['al-definite'].exerciseScore).toBe(80);
      expect(state.lessonScores['al-definite'].quizScore).toBe(90);
      expect(state.lessonScores['al-definite'].attempts).toBe(1);
    });

    it('should keep best scores on re-completion', () => {
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 80,
        quizScore: 90,
      }));
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 70, // Worse
        quizScore: 95,     // Better
      }));

      const score = store.getState().grammar.lessonScores['al-definite'];
      expect(score.exerciseScore).toBe(80); // Kept best
      expect(score.quizScore).toBe(95);     // Updated to better
      expect(score.attempts).toBe(2);
    });

    it('should unlock next lesson after completion', () => {
      store.dispatch(unlockNextLesson({ completedLessonId: 'al-definite' }));

      const state = store.getState().grammar;
      // Should have at least 2 unlocked lessons (al-definite + next)
      expect(state.unlockedLessons.length).toBeGreaterThanOrEqual(2);
    });

    it('should clear current lesson', () => {
      store.dispatch(startLesson('al-definite'));
      store.dispatch(clearCurrentLesson());
      expect(store.getState().grammar.currentLessonId).toBeNull();
    });
  });

  describe('Exercise and quiz progress', () => {
    it('should record exercise progress independently', () => {
      store.dispatch(recordExerciseProgress({ lessonId: 'al-definite', score: 75 }));

      const score = store.getState().grammar.lessonScores['al-definite'];
      expect(score.exerciseScore).toBe(75);
      expect(score.quizScore).toBe(0); // Not touched
    });

    it('should record quiz progress independently', () => {
      store.dispatch(recordQuizProgress({ lessonId: 'al-definite', score: 85 }));

      const score = store.getState().grammar.lessonScores['al-definite'];
      expect(score.quizScore).toBe(85);
    });

    it('should keep best exercise score', () => {
      store.dispatch(recordExerciseProgress({ lessonId: 'al-definite', score: 60 }));
      store.dispatch(recordExerciseProgress({ lessonId: 'al-definite', score: 90 }));
      store.dispatch(recordExerciseProgress({ lessonId: 'al-definite', score: 70 }));

      expect(store.getState().grammar.lessonScores['al-definite'].exerciseScore).toBe(90);
    });
  });

  describe('Grammar FSRS scheduling', () => {
    it('should add FSRS card for a lesson', () => {
      store.dispatch(addGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { due: '2024-01-15', stability: 3 },
      }));

      const fsrs = store.getState().grammar.fsrsCards['al-definite'];
      expect(fsrs.card.stability).toBe(3);
      expect(fsrs.log).toBeNull();
    });

    it('should update FSRS card after review', () => {
      store.dispatch(addGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { due: '2024-01-15', stability: 3 },
      }));
      store.dispatch(updateGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { due: '2024-02-01', stability: 14 },
        log: { rating: 3, timestamp: Date.now() },
      }));

      const fsrs = store.getState().grammar.fsrsCards['al-definite'];
      expect(fsrs.card.stability).toBe(14);
      expect(fsrs.log.rating).toBe(3);
    });

    it('should not overwrite existing FSRS card with addGrammarFsrsCard', () => {
      store.dispatch(addGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { stability: 3 },
      }));
      store.dispatch(addGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { stability: 99 },
      }));

      // addGrammarFsrsCard should not overwrite
      expect(store.getState().grammar.fsrsCards['al-definite'].card.stability).toBe(3);
    });
  });

  describe('Reset', () => {
    it('should reset all grammar progress', () => {
      store.dispatch(completeLesson({
        lessonId: 'al-definite',
        exerciseScore: 80,
        quizScore: 90,
      }));
      store.dispatch(addGrammarFsrsCard({
        lessonId: 'al-definite',
        card: { stability: 10 },
      }));

      store.dispatch(resetGrammarProgress());

      const state = store.getState().grammar;
      expect(state.completedLessons).toEqual([]);
      expect(state.unlockedLessons).toEqual(['al-definite']);
      expect(state.lessonScores).toEqual({});
      expect(state.fsrsCards).toEqual({});
    });
  });
});
