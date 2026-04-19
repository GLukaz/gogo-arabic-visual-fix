import { describe, it, expect, beforeEach, vi } from 'vitest';
import grammarReducer, {
  startLesson,
  completeLesson,
  recordExerciseProgress,
  recordQuizProgress,
  clearCurrentLesson,
  resetGrammarProgress,
  unlockNextLesson,
  bulkUnlockLessons,
  addGrammarFsrsCard,
  updateGrammarFsrsCard,
  selectCompletedLessons,
  selectLessonScores,
  selectCurrentLessonId,
  selectGrammarProgress,
  selectLessonScore,
  selectIsLessonCompleted,
  selectUnlockedLessons,
  selectIsLessonUnlocked,
  selectLessonsByCategory,
  selectGrammarFsrsCards,
  selectGrammarDueLessons,
  selectGrammarDueCount,
  CEFR_GRAMMAR_GATES,
} from '../slices/grammarSlice.js';
import cefrProgressReducer, { setCefrLevel, resetCefrProgress } from '../slices/cefrProgressSlice.js';

// Mock the grammar lessons data
vi.mock('../../data/grammar.js', () => ({
  grammarLessons: [
    { id: 'lesson1', category: 'nouns', order: 1, cefrLevel: 'A1' },
    { id: 'lesson2', category: 'nouns', order: 2, cefrLevel: 'A1' },
    { id: 'lesson3', category: 'verbs', order: 3, cefrLevel: 'A2' },
    { id: 'lesson4', category: 'verbs', order: 4, cefrLevel: 'A2' },
    { id: 'lesson5', category: 'advanced', order: 5, cefrLevel: 'B1' },
    { id: 'lesson6', category: 'advanced', order: 6, cefrLevel: 'B2' },
  ],
  grammarCategories: [
    { id: 'nouns', name: 'Nouns' },
    { id: 'verbs', name: 'Verbs' },
    { id: 'advanced', name: 'Advanced' },
  ],
}));

describe('grammarSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = grammarReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        completedLessons: [],
        unlockedLessons: ['al-definite'],
        lessonScores: {},
        currentLessonId: null,
        fsrsCards: {},
      });
    });

    it('should include al-definite in unlockedLessons', () => {
      expect(initialState.unlockedLessons).toEqual(['al-definite']);
    });
  });

  describe('startLesson', () => {
    it('should set current lesson ID', () => {
      const state = grammarReducer(initialState, startLesson('lesson1'));

      expect(state.currentLessonId).toBe('lesson1');
    });

    it('should replace existing current lesson', () => {
      const startState = { ...initialState, currentLessonId: 'lesson1' };
      const state = grammarReducer(startState, startLesson('lesson2'));

      expect(state.currentLessonId).toBe('lesson2');
    });
  });

  describe('completeLesson', () => {
    it('should mark lesson as completed and store scores', () => {
      const payload = {
        lessonId: 'lesson1',
        exerciseScore: 85,
        quizScore: 90,
      };
      const state = grammarReducer(initialState, completeLesson(payload));

      expect(state.completedLessons).toContain('lesson1');
      expect(state.lessonScores['lesson1']).toBeDefined();
      expect(state.lessonScores['lesson1'].exerciseScore).toBe(85);
      expect(state.lessonScores['lesson1'].quizScore).toBe(90);
      expect(state.lessonScores['lesson1'].attempts).toBe(1);
      expect(state.lessonScores['lesson1'].lastAttempt).toBeDefined();
    });

    it('should not duplicate lesson in completedLessons', () => {
      const startState = {
        ...initialState,
        completedLessons: ['lesson1'],
      };

      const state = grammarReducer(
        startState,
        completeLesson({ lessonId: 'lesson1', exerciseScore: 80, quizScore: 85 })
      );

      expect(state.completedLessons).toEqual(['lesson1']);
      expect(state.completedLessons).toHaveLength(1);
    });

    it('should keep best scores across multiple attempts', () => {
      // First attempt
      let state = grammarReducer(
        initialState,
        completeLesson({ lessonId: 'lesson1', exerciseScore: 70, quizScore: 75 })
      );

      // Second attempt with better exercise score
      state = grammarReducer(
        state,
        completeLesson({ lessonId: 'lesson1', exerciseScore: 85, quizScore: 70 })
      );

      expect(state.lessonScores['lesson1'].exerciseScore).toBe(85);
      expect(state.lessonScores['lesson1'].quizScore).toBe(75);
      expect(state.lessonScores['lesson1'].attempts).toBe(2);
    });

    it('should increment attempts counter', () => {
      let state = grammarReducer(
        initialState,
        completeLesson({ lessonId: 'lesson1', exerciseScore: 80, quizScore: 85 })
      );

      state = grammarReducer(
        state,
        completeLesson({ lessonId: 'lesson1', exerciseScore: 90, quizScore: 95 })
      );

      expect(state.lessonScores['lesson1'].attempts).toBe(2);
    });
  });

  describe('recordExerciseProgress', () => {
    it('should record exercise score for new lesson', () => {
      const state = grammarReducer(
        initialState,
        recordExerciseProgress({ lessonId: 'lesson1', score: 75 })
      );

      expect(state.lessonScores['lesson1']).toBeDefined();
      expect(state.lessonScores['lesson1'].exerciseScore).toBe(75);
      expect(state.lessonScores['lesson1'].quizScore).toBe(0);
    });

    it('should update exercise score if better', () => {
      const startState = {
        ...initialState,
        lessonScores: {
          lesson1: {
            exerciseScore: 70,
            quizScore: 80,
            attempts: 0,
            lastAttempt: null,
          },
        },
      };

      const state = grammarReducer(
        startState,
        recordExerciseProgress({ lessonId: 'lesson1', score: 85 })
      );

      expect(state.lessonScores['lesson1'].exerciseScore).toBe(85);
      expect(state.lessonScores['lesson1'].quizScore).toBe(80);
    });

    it('should not update exercise score if worse', () => {
      const startState = {
        ...initialState,
        lessonScores: {
          lesson1: {
            exerciseScore: 90,
            quizScore: 80,
            attempts: 0,
            lastAttempt: null,
          },
        },
      };

      const state = grammarReducer(
        startState,
        recordExerciseProgress({ lessonId: 'lesson1', score: 70 })
      );

      expect(state.lessonScores['lesson1'].exerciseScore).toBe(90);
    });
  });

  describe('recordQuizProgress', () => {
    it('should record quiz score for new lesson', () => {
      const state = grammarReducer(
        initialState,
        recordQuizProgress({ lessonId: 'lesson1', score: 85 })
      );

      expect(state.lessonScores['lesson1']).toBeDefined();
      expect(state.lessonScores['lesson1'].quizScore).toBe(85);
      expect(state.lessonScores['lesson1'].exerciseScore).toBe(0);
    });

    it('should update quiz score if better', () => {
      const startState = {
        ...initialState,
        lessonScores: {
          lesson1: {
            exerciseScore: 80,
            quizScore: 75,
            attempts: 0,
            lastAttempt: null,
          },
        },
      };

      const state = grammarReducer(
        startState,
        recordQuizProgress({ lessonId: 'lesson1', score: 90 })
      );

      expect(state.lessonScores['lesson1'].quizScore).toBe(90);
      expect(state.lessonScores['lesson1'].exerciseScore).toBe(80);
    });

    it('should not update quiz score if worse', () => {
      const startState = {
        ...initialState,
        lessonScores: {
          lesson1: {
            exerciseScore: 80,
            quizScore: 95,
            attempts: 0,
            lastAttempt: null,
          },
        },
      };

      const state = grammarReducer(
        startState,
        recordQuizProgress({ lessonId: 'lesson1', score: 80 })
      );

      expect(state.lessonScores['lesson1'].quizScore).toBe(95);
    });
  });

  describe('clearCurrentLesson', () => {
    it('should clear current lesson ID', () => {
      const startState = { ...initialState, currentLessonId: 'lesson1' };
      const state = grammarReducer(startState, clearCurrentLesson());

      expect(state.currentLessonId).toBeNull();
    });

    it('should not affect completed lessons or scores', () => {
      const startState = {
        ...initialState,
        currentLessonId: 'lesson1',
        completedLessons: ['lesson1', 'lesson2'],
        lessonScores: {
          lesson1: { exerciseScore: 85, quizScore: 90, attempts: 1 },
        },
      };

      const state = grammarReducer(startState, clearCurrentLesson());

      expect(state.currentLessonId).toBeNull();
      expect(state.completedLessons).toEqual(['lesson1', 'lesson2']);
      expect(state.lessonScores).toEqual(startState.lessonScores);
    });
  });

  describe('resetGrammarProgress', () => {
    it('should reset all grammar progress', () => {
      const startState = {
        completedLessons: ['lesson1', 'lesson2'],
        unlockedLessons: ['lesson1', 'lesson2', 'lesson3'],
        lessonScores: {
          lesson1: { exerciseScore: 85, quizScore: 90, attempts: 2 },
          lesson2: { exerciseScore: 80, quizScore: 85, attempts: 1 },
        },
        currentLessonId: 'lesson3',
      };

      const state = grammarReducer(startState, resetGrammarProgress());

      expect(state).toEqual(initialState);
    });

    it('should reset unlockedLessons to [\'al-definite\']', () => {
      const startState = {
        completedLessons: ['lesson1'],
        unlockedLessons: ['lesson1', 'lesson2'],
        lessonScores: {},
        currentLessonId: null,
      };

      const state = grammarReducer(startState, resetGrammarProgress());

      expect(state.unlockedLessons).toEqual(['al-definite']);
    });
  });

  describe('unlockNextLesson', () => {
    it('should unlock the next lesson by order', () => {
      const startState = {
        ...initialState,
        unlockedLessons: ['lesson1'],
        completedLessons: ['lesson1'],
      };
      const state = grammarReducer(startState, unlockNextLesson({ completedLessonId: 'lesson1' }));
      expect(state.unlockedLessons).toContain('lesson2');
    });

    it('should not duplicate an already-unlocked lesson', () => {
      const startState = {
        ...initialState,
        unlockedLessons: ['lesson1', 'lesson2'],
        completedLessons: ['lesson1'],
      };
      const state = grammarReducer(startState, unlockNextLesson({ completedLessonId: 'lesson1' }));
      expect(state.unlockedLessons.filter(id => id === 'lesson2')).toHaveLength(1);
    });

    it('should handle completing the last lesson gracefully', () => {
      const startState = {
        ...initialState,
        unlockedLessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'],
        completedLessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'],
      };
      const state = grammarReducer(startState, unlockNextLesson({ completedLessonId: 'lesson6' }));
      // No crash, no new lesson added
      expect(state.unlockedLessons).toHaveLength(6);
    });

    it('should handle unknown lesson ID gracefully', () => {
      const state = grammarReducer(initialState, unlockNextLesson({ completedLessonId: 'nonexistent' }));
      expect(state.unlockedLessons).toEqual(['al-definite']);
    });

    it('should unlock across categories (lesson1 nouns → lesson2 nouns by order)', () => {
      const startState = {
        ...initialState,
        unlockedLessons: ['lesson1'],
        completedLessons: ['lesson1'],
      };
      const state = grammarReducer(startState, unlockNextLesson({ completedLessonId: 'lesson1' }));
      // lesson2 has order 2 (next after order 1), regardless of category
      expect(state.unlockedLessons).toContain('lesson2');
    });
  });

  describe('selectors', () => {
    const mockState = {
      grammar: {
        completedLessons: ['lesson1', 'lesson2'],
        unlockedLessons: ['lesson1', 'lesson2'],
        lessonScores: {
          lesson1: {
            exerciseScore: 85,
            quizScore: 90,
            attempts: 2,
            lastAttempt: '2026-02-09T00:00:00Z',
          },
          lesson2: {
            exerciseScore: 75,
            quizScore: 80,
            attempts: 1,
            lastAttempt: '2026-02-08T00:00:00Z',
          },
        },
        currentLessonId: 'lesson3',
      },
    };

    it('selectCompletedLessons should return completed lessons array', () => {
      const lessons = selectCompletedLessons(mockState);
      expect(lessons).toEqual(['lesson1', 'lesson2']);
    });

    it('selectLessonScores should return lesson scores object', () => {
      const scores = selectLessonScores(mockState);
      expect(scores).toEqual(mockState.grammar.lessonScores);
    });

    it('selectCurrentLessonId should return current lesson ID', () => {
      const lessonId = selectCurrentLessonId(mockState);
      expect(lessonId).toBe('lesson3');
    });

    it('selectGrammarProgress should calculate percentage', () => {
      // Mock has 2 completed out of 6 total lessons = 33%
      const progress = selectGrammarProgress(mockState);
      expect(progress).toBe(33);
    });

    it('selectLessonScore should return score for specific lesson', () => {
      const score = selectLessonScore('lesson1')(mockState);
      expect(score).toEqual({
        exerciseScore: 85,
        quizScore: 90,
        attempts: 2,
        lastAttempt: '2026-02-09T00:00:00Z',
      });
    });

    it('selectLessonScore should return null for non-existent lesson', () => {
      const score = selectLessonScore('nonexistent')(mockState);
      expect(score).toBeNull();
    });

    it('selectIsLessonCompleted should return true for completed lesson', () => {
      const isCompleted = selectIsLessonCompleted('lesson1')(mockState);
      expect(isCompleted).toBe(true);
    });

    it('selectIsLessonCompleted should return false for incomplete lesson', () => {
      const isCompleted = selectIsLessonCompleted('lesson3')(mockState);
      expect(isCompleted).toBe(false);
    });

    it('selectLessonsByCategory should annotate isUnlocked on lesson objects', () => {
      const lessonsByCategory = selectLessonsByCategory(mockState);
      const nounLessons = lessonsByCategory['nouns'];
      expect(nounLessons).toBeDefined();
      const lesson1 = nounLessons.find(l => l.id === 'lesson1');
      expect(lesson1).toBeDefined();
      expect(lesson1.isUnlocked).toBe(true);
    });

    it('selectLessonsByCategory should mark locked lessons as isUnlocked: false', () => {
      const lessonsByCategory = selectLessonsByCategory(mockState);
      const verbLessons = lessonsByCategory['verbs'];
      expect(verbLessons).toBeDefined();
      const lesson3 = verbLessons.find(l => l.id === 'lesson3');
      expect(lesson3).toBeDefined();
      expect(lesson3.isUnlocked).toBe(false);
    });
  });

  describe('CEFR gating via selectLessonsByCategory', () => {
    it('CEFR_GRAMMAR_GATES has B1:3 and B2:5', () => {
      expect(CEFR_GRAMMAR_GATES['B1']).toBe(3);
      expect(CEFR_GRAMMAR_GATES['B2']).toBe(5);
      expect(CEFR_GRAMMAR_GATES['A1']).toBe(0);
      expect(CEFR_GRAMMAR_GATES['A2']).toBe(0);
    });

    it('B1 lesson is CEFR-locked when grammar tree has fewer than 3 nodes', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson1', 'lesson5'],
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: ['grammar_01', 'grammar_02'] } },
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const b1Lesson = lessonsByCategory['advanced'].find(l => l.id === 'lesson5');
      expect(b1Lesson.isCefrLocked).toBe(true);
      expect(b1Lesson.isUnlocked).toBe(false);
      expect(b1Lesson.cefrGateLevel).toBe(3);
      expect(b1Lesson.currentTreeLevel).toBe(2);
    });

    it('B1 lesson is accessible when grammar tree has 3+ nodes', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson5'],
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: ['grammar_01', 'grammar_02', 'grammar_03'] } },
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const b1Lesson = lessonsByCategory['advanced'].find(l => l.id === 'lesson5');
      expect(b1Lesson.isCefrLocked).toBe(false);
      expect(b1Lesson.isUnlocked).toBe(true);
      expect(b1Lesson.cefrGateLevel).toBe(3);
      expect(b1Lesson.currentTreeLevel).toBe(3);
    });

    it('B2 lesson is CEFR-locked when grammar tree has fewer than 5 nodes', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson6'],
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: ['grammar_01', 'grammar_02', 'grammar_03', 'grammar_04'] } },
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const b2Lesson = lessonsByCategory['advanced'].find(l => l.id === 'lesson6');
      expect(b2Lesson.isCefrLocked).toBe(true);
      expect(b2Lesson.isUnlocked).toBe(false);
      expect(b2Lesson.cefrGateLevel).toBe(5);
      expect(b2Lesson.currentTreeLevel).toBe(4);
    });

    it('B2 lesson is accessible when grammar tree has 5+ nodes', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson6'],
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: ['g1', 'g2', 'g3', 'g4', 'g5'] } },
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const b2Lesson = lessonsByCategory['advanced'].find(l => l.id === 'lesson6');
      expect(b2Lesson.isCefrLocked).toBe(false);
      expect(b2Lesson.isUnlocked).toBe(true);
      expect(b2Lesson.cefrGateLevel).toBe(5);
      expect(b2Lesson.currentTreeLevel).toBe(5);
    });

    it('A1/A2 lessons are never CEFR-locked (gate=0)', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson1', 'lesson3'],
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: [] } },
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const a1Lesson = lessonsByCategory['nouns'].find(l => l.id === 'lesson1');
      const a2Lesson = lessonsByCategory['verbs'].find(l => l.id === 'lesson3');
      expect(a1Lesson.isCefrLocked).toBe(false);
      expect(a2Lesson.isCefrLocked).toBe(false);
    });

    it('isUnlocked is false when lesson is in unlockedLessons but isCefrLocked is true', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson5'], // B1 lesson is in unlockedLessons array
          lessonScores: {},
          currentLessonId: null,
        },
        skillTree: { unlockedNodes: { grammar: [] } }, // but tree level is 0 (< 3)
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const b1Lesson = lessonsByCategory['advanced'].find(l => l.id === 'lesson5');
      expect(b1Lesson.isCefrLocked).toBe(true);
      // isUnlocked must be false even though lesson5 is in unlockedLessons
      expect(b1Lesson.isUnlocked).toBe(false);
    });

    it('gracefully returns tree level 0 when skillTree state is absent', () => {
      const state = {
        grammar: {
          completedLessons: [],
          unlockedLessons: ['lesson1'],
          lessonScores: {},
          currentLessonId: null,
        },
        // no skillTree key
      };
      const lessonsByCategory = selectLessonsByCategory(state);
      const a1Lesson = lessonsByCategory['nouns'].find(l => l.id === 'lesson1');
      // A1 always accessible (gate=0), so even with tree level 0, not CEFR-locked
      expect(a1Lesson.isCefrLocked).toBe(false);
      expect(a1Lesson.currentTreeLevel).toBe(0);
    });
  });

  describe('selectors - unlockedLessons', () => {
    it('selectUnlockedLessons returns unlockedLessons array', () => {
      const mockState = { grammar: { ...initialState, unlockedLessons: ['lesson1', 'lesson2'] } };
      expect(selectUnlockedLessons(mockState)).toEqual(['lesson1', 'lesson2']);
    });

    it('selectIsLessonUnlocked returns true for unlocked lesson', () => {
      const mockState = { grammar: { ...initialState, unlockedLessons: ['lesson1'] } };
      expect(selectIsLessonUnlocked('lesson1')(mockState)).toBe(true);
    });

    it('selectIsLessonUnlocked returns false for locked lesson', () => {
      const mockState = { grammar: { ...initialState, unlockedLessons: ['lesson1'] } };
      expect(selectIsLessonUnlocked('lesson3')(mockState)).toBe(false);
    });
  });

  describe('bulkUnlockLessons', () => {
    it('adds new lesson IDs to unlockedLessons', () => {
      // Start with only 'al-definite' unlocked (initial state)
      const state = grammarReducer(
        initialState,
        bulkUnlockLessons(['noun-adjective-agreement', 'personal-pronouns'])
      );
      expect(state.unlockedLessons).toContain('al-definite');
      expect(state.unlockedLessons).toContain('noun-adjective-agreement');
      expect(state.unlockedLessons).toContain('personal-pronouns');
      expect(state.unlockedLessons).toHaveLength(3);
    });

    it('is idempotent — dispatching same IDs twice produces no duplicates', () => {
      let state = grammarReducer(
        initialState,
        bulkUnlockLessons(['lesson1', 'lesson2'])
      );
      state = grammarReducer(state, bulkUnlockLessons(['lesson1', 'lesson2']));
      expect(state.unlockedLessons.filter((id) => id === 'lesson1')).toHaveLength(1);
      expect(state.unlockedLessons.filter((id) => id === 'lesson2')).toHaveLength(1);
    });

    it('does not remove existing unlocked lessons', () => {
      const startState = { ...initialState, unlockedLessons: ['al-definite'] };
      const state = grammarReducer(
        startState,
        bulkUnlockLessons(['lesson1', 'lesson2'])
      );
      expect(state.unlockedLessons).toContain('al-definite');
      expect(state.unlockedLessons).toContain('lesson1');
      expect(state.unlockedLessons).toContain('lesson2');
    });

    it('with empty array is a no-op — state unchanged', () => {
      const state = grammarReducer(initialState, bulkUnlockLessons([]));
      expect(state.unlockedLessons).toEqual(['al-definite']);
    });

    it('only adds IDs not already present when there is partial overlap', () => {
      const startState = { ...initialState, unlockedLessons: ['al-definite', 'lesson1'] };
      const state = grammarReducer(
        startState,
        bulkUnlockLessons(['lesson1', 'lesson2', 'lesson3'])
      );
      expect(state.unlockedLessons.filter((id) => id === 'lesson1')).toHaveLength(1);
      expect(state.unlockedLessons).toContain('lesson2');
      expect(state.unlockedLessons).toContain('lesson3');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Phase 73: Grammar FSRS card tests
  // ─────────────────────────────────────────────────────────────────────────────

  describe('addGrammarFsrsCard', () => {
    it('should add a new FSRS card for a lesson', () => {
      const card = { due: '2026-03-24T00:00:00Z', stability: 0, difficulty: 0, reps: 0, lapses: 0, state: 'New' };
      const state = grammarReducer(initialState, addGrammarFsrsCard({ lessonId: 'lesson1', card }));
      expect(state.fsrsCards['lesson1']).toBeDefined();
      expect(state.fsrsCards['lesson1'].card).toEqual(card);
      expect(state.fsrsCards['lesson1'].log).toBeNull();
    });

    it('should not overwrite an existing card', () => {
      const card1 = { due: '2026-03-24T00:00:00Z', reps: 0, state: 'New' };
      const card2 = { due: '2026-03-25T00:00:00Z', reps: 1, state: 'Learning' };
      let state = grammarReducer(initialState, addGrammarFsrsCard({ lessonId: 'lesson1', card: card1 }));
      state = grammarReducer(state, addGrammarFsrsCard({ lessonId: 'lesson1', card: card2 }));
      expect(state.fsrsCards['lesson1'].card.reps).toBe(0); // original card preserved
    });
  });

  describe('updateGrammarFsrsCard', () => {
    it('should update an existing FSRS card', () => {
      const card1 = { due: '2026-03-24T00:00:00Z', reps: 0, state: 'New' };
      const card2 = { due: '2026-03-25T00:00:00Z', reps: 1, state: 'Learning' };
      const log = { rating: 3 };
      let state = grammarReducer(initialState, addGrammarFsrsCard({ lessonId: 'lesson1', card: card1 }));
      state = grammarReducer(state, updateGrammarFsrsCard({ lessonId: 'lesson1', card: card2, log }));
      expect(state.fsrsCards['lesson1'].card.reps).toBe(1);
      expect(state.fsrsCards['lesson1'].log.rating).toBe(3);
    });

    it('should create card entry if it does not exist', () => {
      const card = { due: '2026-03-24T00:00:00Z', reps: 2, state: 'Review' };
      const state = grammarReducer(initialState, updateGrammarFsrsCard({ lessonId: 'lesson1', card, log: null }));
      expect(state.fsrsCards['lesson1'].card.reps).toBe(2);
    });
  });

  describe('resetGrammarProgress clears FSRS cards', () => {
    it('should clear fsrsCards on reset', () => {
      const card = { due: '2026-03-24T00:00:00Z', reps: 0, state: 'New' };
      let state = grammarReducer(initialState, addGrammarFsrsCard({ lessonId: 'lesson1', card }));
      state = grammarReducer(state, resetGrammarProgress());
      expect(state.fsrsCards).toEqual({});
    });
  });

  describe('grammar FSRS selectors', () => {
    it('selectGrammarFsrsCards returns fsrsCards', () => {
      const mockState = { grammar: { ...initialState, fsrsCards: { lesson1: { card: { due: '2026-03-24' }, log: null } } } };
      expect(selectGrammarFsrsCards(mockState)).toEqual({ lesson1: { card: { due: '2026-03-24' }, log: null } });
    });

    it('selectGrammarDueLessons returns lessons with past due dates', () => {
      const pastDue = new Date(Date.now() - 86400000).toISOString(); // yesterday
      const futureDue = new Date(Date.now() + 86400000).toISOString(); // tomorrow
      const mockState = {
        grammar: {
          ...initialState,
          fsrsCards: {
            lesson1: { card: { due: pastDue }, log: null },
            lesson2: { card: { due: futureDue }, log: null },
          },
        },
      };
      const due = selectGrammarDueLessons(mockState);
      expect(due).toContain('lesson1');
      expect(due).not.toContain('lesson2');
    });

    it('selectGrammarDueCount returns correct count', () => {
      const pastDue = new Date(Date.now() - 86400000).toISOString();
      const mockState = {
        grammar: {
          ...initialState,
          fsrsCards: {
            lesson1: { card: { due: pastDue }, log: null },
            lesson2: { card: { due: pastDue }, log: null },
          },
        },
      };
      expect(selectGrammarDueCount(mockState)).toBe(2);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cefrProgressSlice — resetCefrProgress tests
// ─────────────────────────────────────────────────────────────────────────────

describe('cefrProgressSlice - resetCefrProgress', () => {
  it('returns to initial state when called on a populated state', () => {
    let state = cefrProgressReducer(undefined, { type: 'unknown' });
    state = cefrProgressReducer(state, setCefrLevel({ level: 'A2', source: 'placement' }));
    expect(state.currentLevel).toBe('A2');

    const reset = cefrProgressReducer(state, resetCefrProgress());
    expect(reset.currentLevel).toBeNull();
    expect(reset.levelHistory).toEqual([]);
    expect(reset.lastAssessedAt).toBeNull();
  });

  it('after setCefrLevel the levelHistory has an entry; after resetCefrProgress it is empty', () => {
    let state = cefrProgressReducer(undefined, { type: 'unknown' });
    state = cefrProgressReducer(state, setCefrLevel({ level: 'A1', source: 'placement' }));
    state = cefrProgressReducer(state, setCefrLevel({ level: 'A2', source: 'placement' }));
    expect(state.levelHistory.length).toBeGreaterThan(0);

    const reset = cefrProgressReducer(state, resetCefrProgress());
    expect(reset.levelHistory).toHaveLength(0);
  });

  it('is idempotent — calling reset twice returns initial state both times', () => {
    let state = cefrProgressReducer(undefined, setCefrLevel({ level: 'B1', source: 'test' }));
    const reset1 = cefrProgressReducer(state, resetCefrProgress());
    const reset2 = cefrProgressReducer(reset1, resetCefrProgress());
    expect(reset2.currentLevel).toBeNull();
    expect(reset2.levelHistory).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fan-out integration tests (using mocked grammar.js — 4 lessons with cefrLevel)
// ─────────────────────────────────────────────────────────────────────────────

describe('fan-out integration: bulkUnlockLessons via mocked grammar', () => {
  // Mocked grammar.js (from vi.mock above):
  //   lesson1: cefrLevel A1, order 1
  //   lesson2: cefrLevel A1, order 2
  //   lesson3: cefrLevel A2, order 3
  //   lesson4: cefrLevel A2, order 4

  it('A1 placement: bulkUnlockLessons unlocks all A1 lessons', () => {
    // Simulate what deriveGrammarUnlocks('A1') would return for mock data
    const a1Ids = ['lesson1', 'lesson2'];
    const state = grammarReducer(
      { completedLessons: [], unlockedLessons: ['al-definite'], lessonScores: {}, currentLessonId: null },
      bulkUnlockLessons(a1Ids)
    );
    expect(state.unlockedLessons).toContain('lesson1');
    expect(state.unlockedLessons).toContain('lesson2');
    expect(state.unlockedLessons).not.toContain('lesson3');
    expect(state.unlockedLessons).not.toContain('lesson4');
  });

  it('A2 placement: bulkUnlockLessons unlocks A1 + A2 lessons', () => {
    // Simulate what deriveGrammarUnlocks('A2') would return for mock data
    const a2Ids = ['lesson1', 'lesson2', 'lesson3', 'lesson4'];
    const state = grammarReducer(
      { completedLessons: [], unlockedLessons: ['al-definite'], lessonScores: {}, currentLessonId: null },
      bulkUnlockLessons(a2Ids)
    );
    expect(state.unlockedLessons).toContain('lesson1');
    expect(state.unlockedLessons).toContain('lesson2');
    expect(state.unlockedLessons).toContain('lesson3');
    expect(state.unlockedLessons).toContain('lesson4');
  });

  it('bulkUnlockLessons + resetCefrProgress are independent — resetting CEFR does not affect grammar unlocks', () => {
    const grammarState = grammarReducer(
      { completedLessons: [], unlockedLessons: ['al-definite'], lessonScores: {}, currentLessonId: null },
      bulkUnlockLessons(['lesson1', 'lesson2'])
    );
    // Reset CEFR (simulates retake)
    let cefrState = cefrProgressReducer(undefined, setCefrLevel({ level: 'A1', source: 'placement' }));
    cefrState = cefrProgressReducer(cefrState, resetCefrProgress());

    // Grammar state still has the unlocked lessons
    expect(grammarState.unlockedLessons).toContain('lesson1');
    expect(grammarState.unlockedLessons).toContain('lesson2');
    // CEFR reset to initial
    expect(cefrState.currentLevel).toBeNull();
  });
});
