import { createSlice, createSelector } from '@reduxjs/toolkit';
import { grammarLessons } from '../../data/grammar.js';

// Skill tree node count required to access each CEFR level's grammar lessons
const CEFR_GRAMMAR_GATES = {
  'A1': 0, // always accessible
  'A2': 0, // always accessible
  'B1': 3, // Grammar tree level 3 (3+ unlocked nodes)
  'B2': 5, // Grammar tree level 5 (5+ unlocked nodes)
};

export { CEFR_GRAMMAR_GATES };

const initialState = {
  completedLessons: [], // array of lesson IDs
  unlockedLessons: ['al-definite'], // First lesson always unlocked
  lessonScores: {}, // { lessonId: { exerciseScore, quizScore, attempts, lastAttempt } }
  currentLessonId: null,
  // Phase 73: FSRS scheduling for grammar review
  fsrsCards: {}, // { lessonId: { card: FSRS card object, log: last review log } }
};

const grammarSlice = createSlice({
  name: 'grammar',
  initialState,
  reducers: {
    startLesson(state, action) {
      state.currentLessonId = action.payload;
    },

    completeLesson(state, action) {
      // payload: { lessonId, exerciseScore, quizScore }
      const { lessonId, exerciseScore, quizScore } = action.payload;

      if (!state.completedLessons.includes(lessonId)) {
        state.completedLessons.push(lessonId);
      }

      if (!state.lessonScores[lessonId]) {
        state.lessonScores[lessonId] = {
          exerciseScore: 0,
          quizScore: 0,
          attempts: 0,
          lastAttempt: null,
        };
      }

      const lessonScore = state.lessonScores[lessonId];
      lessonScore.attempts += 1;
      lessonScore.lastAttempt = new Date().toISOString();

      // Keep best scores
      if (exerciseScore > lessonScore.exerciseScore) {
        lessonScore.exerciseScore = exerciseScore;
      }
      if (quizScore > lessonScore.quizScore) {
        lessonScore.quizScore = quizScore;
      }
    },

    recordExerciseProgress(state, action) {
      // payload: { lessonId, score }
      const { lessonId, score } = action.payload;

      if (!state.lessonScores[lessonId]) {
        state.lessonScores[lessonId] = {
          exerciseScore: 0,
          quizScore: 0,
          attempts: 0,
          lastAttempt: null,
        };
      }

      if (score > state.lessonScores[lessonId].exerciseScore) {
        state.lessonScores[lessonId].exerciseScore = score;
      }
    },

    recordQuizProgress(state, action) {
      // payload: { lessonId, score }
      const { lessonId, score } = action.payload;

      if (!state.lessonScores[lessonId]) {
        state.lessonScores[lessonId] = {
          exerciseScore: 0,
          quizScore: 0,
          attempts: 0,
          lastAttempt: null,
        };
      }

      if (score > state.lessonScores[lessonId].quizScore) {
        state.lessonScores[lessonId].quizScore = score;
      }
    },

    clearCurrentLesson(state) {
      state.currentLessonId = null;
    },

    resetGrammarProgress(state) {
      state.completedLessons = [];
      state.unlockedLessons = ['al-definite'];
      state.lessonScores = {};
      state.currentLessonId = null;
      state.fsrsCards = {};
    },

    unlockNextLesson(state, action) {
      // payload: { completedLessonId }
      const completedLesson = grammarLessons.find(l => l.id === action.payload.completedLessonId);
      if (!completedLesson) return;

      // Find the next lesson by order (across all categories)
      const sortedLessons = [...grammarLessons].sort((a, b) => a.order - b.order);
      const nextLesson = sortedLessons.find(l => l.order > completedLesson.order);

      if (nextLesson && !state.unlockedLessons.includes(nextLesson.id)) {
        state.unlockedLessons.push(nextLesson.id);
      }
    },

    bulkUnlockLessons(state, action) {
      // payload: string[] of lessonIds
      // Mirrors bulkUnlockNodes pattern: no XP deduction, no middleware side effects, idempotent
      const lessonIds = action.payload;
      lessonIds.forEach((id) => {
        if (!state.unlockedLessons.includes(id)) {
          state.unlockedLessons.push(id);
        }
      });
    },

    // Phase 73: Grammar FSRS actions
    addGrammarFsrsCard(state, action) {
      // payload: { lessonId, card }
      const { lessonId, card } = action.payload;
      if (!state.fsrsCards[lessonId]) {
        state.fsrsCards[lessonId] = { card, log: null };
      }
    },

    updateGrammarFsrsCard(state, action) {
      // payload: { lessonId, card, log }
      const { lessonId, card, log } = action.payload;
      if (state.fsrsCards[lessonId]) {
        state.fsrsCards[lessonId].card = card;
        state.fsrsCards[lessonId].log = log;
      } else {
        state.fsrsCards[lessonId] = { card, log };
      }
    },
  },
});

export const {
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
} = grammarSlice.actions;

// ========== SELECTORS ==========

export const selectCompletedLessons = (state) => state.grammar.completedLessons;
export const selectLessonScores = (state) => state.grammar.lessonScores;
export const selectCurrentLessonId = (state) => state.grammar.currentLessonId;
export const selectUnlockedLessons = (state) => state.grammar.unlockedLessons;

export const selectIsLessonUnlocked = (lessonId) => (state) =>
  state.grammar.unlockedLessons.includes(lessonId);

// Calculate overall grammar progress (percentage)
export const selectGrammarProgress = createSelector(
  [selectCompletedLessons],
  (completedLessons) => {
    const totalLessons = grammarLessons.length;
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  }
);

// Get lesson score for a specific lesson
export const selectLessonScore = (lessonId) => (state) => {
  return state.grammar.lessonScores[lessonId] || null;
};

// Check if lesson is completed
export const selectIsLessonCompleted = (lessonId) => (state) => {
  return state.grammar.completedLessons.includes(lessonId);
};

// Get lessons by category with completion status and CEFR gating
export const selectLessonsByCategory = createSelector(
  [
    selectCompletedLessons,
    selectLessonScores,
    selectUnlockedLessons,
    (state) => state.skillTree?.unlockedNodes?.grammar?.length ?? 0,
  ],
  (completedLessons, lessonScores, unlockedLessons, grammarTreeLevel) => {
    const lessonsByCategory = {};

    grammarLessons.forEach((lesson) => {
      if (!lessonsByCategory[lesson.category]) {
        lessonsByCategory[lesson.category] = [];
      }

      const cefrGate = CEFR_GRAMMAR_GATES[lesson.cefrLevel] ?? 0;
      const cefrUnlocked = grammarTreeLevel >= cefrGate;

      lessonsByCategory[lesson.category].push({
        ...lesson,
        isCompleted: completedLessons.includes(lesson.id),
        isUnlocked: unlockedLessons.includes(lesson.id) && cefrUnlocked,
        isCefrLocked: !cefrUnlocked,
        cefrGateLevel: cefrGate,
        currentTreeLevel: grammarTreeLevel,
        score: lessonScores[lesson.id] || null,
      });
    });

    // Sort lessons within each category by order
    Object.keys(lessonsByCategory).forEach((category) => {
      lessonsByCategory[category].sort((a, b) => a.order - b.order);
    });

    return lessonsByCategory;
  }
);

// Phase 73: FSRS selectors for grammar
export const selectGrammarFsrsCards = (state) => state.grammar.fsrsCards;

export const selectGrammarDueLessons = createSelector(
  [selectGrammarFsrsCards],
  (fsrsCards) => {
    const now = new Date();
    return Object.entries(fsrsCards)
      .filter(([, data]) => {
        if (!data.card || !data.card.due) return true;
        return new Date(data.card.due) <= now;
      })
      .map(([lessonId]) => lessonId);
  }
);

export const selectGrammarDueCount = createSelector(
  [selectGrammarDueLessons],
  (dueLessons) => dueLessons.length
);

export default grammarSlice.reducer;
