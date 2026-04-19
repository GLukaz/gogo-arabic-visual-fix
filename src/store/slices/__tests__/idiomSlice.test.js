import { describe, it, expect } from 'vitest';
import idiomReducer, {
  learnIdiom,
  unlearnIdiom,
  toggleFavorite,
  setDailyIdiom,
  recordIdiomQuiz,
  clearHistory,
  resetAllIdiomState,
  selectLearnedCount,
  selectLearnedIds,
  selectIdiomIsLearned,
  selectFavoriteIds,
  selectIdiomIsFavorite,
  selectDailyIdiomId,
  selectLastDailyDate,
  selectQuizHistory,
  selectQuizStats,
  selectQuizAccuracy,
  selectAverageQuizTime,
} from '../idiomSlice.js';

function getInitialState() {
  return JSON.parse(JSON.stringify(idiomReducer(undefined, { type: '@@INIT' })));
}

/** Helper to build root state shape for selectors */
function rootState(sliceState) {
  return { idiom: sliceState };
}

// ============================================================
// INITIAL STATE
// ============================================================

describe('idiomSlice — initial state', () => {
  it('has correct initial values', () => {
    const state = getInitialState();
    expect(state.learnedIdioms).toEqual([]);
    expect(state.favorites).toEqual([]);
    expect(state.dailyIdiomId).toBeNull();
    expect(state.lastDailyDate).toBeNull();
    expect(state.quizHistory).toEqual([]);
    expect(state.quizStats.totalQuestions).toBe(0);
    expect(state.quizStats.correctAnswers).toBe(0);
    expect(state.quizStats.accuracy).toBe(0);
  });
});

// ============================================================
// learnIdiom
// ============================================================

describe('idiomSlice — learnIdiom', () => {
  it('adds idiom to learnedIdioms', () => {
    const state = idiomReducer(getInitialState(), learnIdiom('idiom_123'));
    expect(state.learnedIdioms).toContain('idiom_123');
  });

  it('is idempotent — no duplicate IDs', () => {
    let state = idiomReducer(getInitialState(), learnIdiom('idiom_123'));
    state = idiomReducer(state, learnIdiom('idiom_123'));
    expect(state.learnedIdioms.filter((id) => id === 'idiom_123').length).toBe(1);
  });

  it('can learn multiple idioms', () => {
    let state = idiomReducer(getInitialState(), learnIdiom('idiom_1'));
    state = idiomReducer(state, learnIdiom('idiom_2'));
    state = idiomReducer(state, learnIdiom('idiom_3'));
    expect(state.learnedIdioms).toHaveLength(3);
  });
});

// ============================================================
// unlearnIdiom
// ============================================================

describe('idiomSlice — unlearnIdiom', () => {
  it('removes idiom from learnedIdioms', () => {
    let state = idiomReducer(getInitialState(), learnIdiom('idiom_123'));
    expect(state.learnedIdioms).toContain('idiom_123');
    state = idiomReducer(state, unlearnIdiom('idiom_123'));
    expect(state.learnedIdioms).not.toContain('idiom_123');
  });

  it('does nothing for non-learned idiom', () => {
    const state = idiomReducer(getInitialState(), unlearnIdiom('idiom_999'));
    expect(state.learnedIdioms).toEqual([]);
  });
});

// ============================================================
// toggleFavorite
// ============================================================

describe('idiomSlice — toggleFavorite', () => {
  it('adds to favorites on first toggle', () => {
    const state = idiomReducer(getInitialState(), toggleFavorite('idiom_123'));
    expect(state.favorites).toContain('idiom_123');
  });

  it('removes from favorites on second toggle', () => {
    let state = idiomReducer(getInitialState(), toggleFavorite('idiom_123'));
    state = idiomReducer(state, toggleFavorite('idiom_123'));
    expect(state.favorites).not.toContain('idiom_123');
  });

  it('toggles independently from learned state', () => {
    let state = idiomReducer(getInitialState(), learnIdiom('idiom_123'));
    state = idiomReducer(state, toggleFavorite('idiom_123'));
    expect(state.learnedIdioms).toContain('idiom_123');
    expect(state.favorites).toContain('idiom_123');
  });
});

// ============================================================
// setDailyIdiom
// ============================================================

describe('idiomSlice — setDailyIdiom', () => {
  it('updates dailyIdiomId and lastDailyDate', () => {
    const state = idiomReducer(
      getInitialState(),
      setDailyIdiom({ idiomId: 'idiom_456', date: '2026-03-27' })
    );
    expect(state.dailyIdiomId).toBe('idiom_456');
    expect(state.lastDailyDate).toBe('2026-03-27');
  });

  it('overwrites previous daily idiom', () => {
    let state = idiomReducer(
      getInitialState(),
      setDailyIdiom({ idiomId: 'idiom_old', date: '2026-03-26' })
    );
    state = idiomReducer(
      state,
      setDailyIdiom({ idiomId: 'idiom_new', date: '2026-03-27' })
    );
    expect(state.dailyIdiomId).toBe('idiom_new');
    expect(state.lastDailyDate).toBe('2026-03-27');
  });
});

// ============================================================
// recordIdiomQuiz
// ============================================================

describe('idiomSlice — recordIdiomQuiz', () => {
  it('appends to quizHistory and updates stats', () => {
    const state = idiomReducer(
      getInitialState(),
      recordIdiomQuiz({
        idiomId: 'idiom_123',
        type: 'idiom-to-meaning',
        correct: true,
        timeMs: 2500,
        chosenAnswer: 'patience',
      })
    );

    expect(state.quizHistory).toHaveLength(1);
    expect(state.quizHistory[0].idiomId).toBe('idiom_123');
    expect(state.quizHistory[0].correct).toBe(true);
    expect(state.quizStats.totalQuestions).toBe(1);
    expect(state.quizStats.correctAnswers).toBe(1);
    expect(state.quizStats.accuracy).toBe(100);
  });

  it('calculates accuracy correctly for mixed results', () => {
    let state = getInitialState();
    state = idiomReducer(
      state,
      recordIdiomQuiz({
        idiomId: 'idiom_1',
        type: 'idiom-to-meaning',
        correct: true,
        timeMs: 2000,
        chosenAnswer: 'a',
      })
    );
    state = idiomReducer(
      state,
      recordIdiomQuiz({
        idiomId: 'idiom_2',
        type: 'meaning-to-idiom',
        correct: false,
        timeMs: 3000,
        chosenAnswer: 'b',
      })
    );

    expect(state.quizStats.totalQuestions).toBe(2);
    expect(state.quizStats.correctAnswers).toBe(1);
    expect(state.quizStats.accuracy).toBe(50);
  });

  it('tracks fastest time', () => {
    let state = getInitialState();
    state = idiomReducer(
      state,
      recordIdiomQuiz({
        idiomId: 'idiom_1',
        type: 'idiom-to-meaning',
        correct: true,
        timeMs: 5000,
        chosenAnswer: 'a',
      })
    );
    state = idiomReducer(
      state,
      recordIdiomQuiz({
        idiomId: 'idiom_2',
        type: 'idiom-to-meaning',
        correct: true,
        timeMs: 1500,
        chosenAnswer: 'b',
      })
    );

    expect(state.quizStats.fastestTime).toBe(1500);
  });

  it('caps quizHistory at 100 recent entries', () => {
    let state = getInitialState();

    for (let i = 0; i < 150; i++) {
      state = idiomReducer(
        state,
        recordIdiomQuiz({
          idiomId: `idiom_${i}`,
          type: 'idiom-to-meaning',
          correct: i % 2 === 0,
          timeMs: 2000,
          chosenAnswer: 'answer',
        })
      );
    }

    expect(state.quizHistory).toHaveLength(100);
    // Oldest entries should be dropped
    expect(state.quizHistory[0].idiomId).toBe('idiom_50');
  });
});

// ============================================================
// clearHistory
// ============================================================

describe('idiomSlice — clearHistory', () => {
  it('resets quizHistory and quizStats', () => {
    let state = idiomReducer(
      getInitialState(),
      recordIdiomQuiz({
        idiomId: 'idiom_1',
        type: 'idiom-to-meaning',
        correct: true,
        timeMs: 2000,
        chosenAnswer: 'a',
      })
    );
    state = idiomReducer(state, clearHistory());

    expect(state.quizHistory).toEqual([]);
    expect(state.quizStats.totalQuestions).toBe(0);
    expect(state.quizStats.correctAnswers).toBe(0);
    expect(state.quizStats.accuracy).toBe(0);
  });
});

// ============================================================
// resetAllIdiomState
// ============================================================

describe('idiomSlice — resetAllIdiomState', () => {
  it('resets everything to initial state', () => {
    let state = idiomReducer(getInitialState(), learnIdiom('idiom_1'));
    state = idiomReducer(state, toggleFavorite('idiom_2'));
    state = idiomReducer(state, setDailyIdiom({ idiomId: 'idiom_3', date: '2026-03-27' }));
    state = idiomReducer(state, resetAllIdiomState());

    expect(state.learnedIdioms).toEqual([]);
    expect(state.favorites).toEqual([]);
    expect(state.dailyIdiomId).toBeNull();
    expect(state.lastDailyDate).toBeNull();
    expect(state.quizHistory).toEqual([]);
  });
});

// ============================================================
// SELECTORS
// ============================================================

describe('idiomSlice — selectors', () => {
  const mockSliceState = {
    learnedIdioms: ['idiom_1', 'idiom_2'],
    favorites: ['idiom_1'],
    dailyIdiomId: 'idiom_daily',
    lastDailyDate: '2026-03-27',
    quizHistory: [],
    quizStats: {
      totalQuestions: 10,
      correctAnswers: 7,
      accuracy: 70,
      fastestTime: 1500,
      averageTime: 2500,
    },
  };

  it('selectLearnedCount returns count of learned idioms', () => {
    expect(selectLearnedCount(rootState(mockSliceState))).toBe(2);
  });

  it('selectLearnedIds returns array of learned IDs', () => {
    expect(selectLearnedIds(rootState(mockSliceState))).toEqual(['idiom_1', 'idiom_2']);
  });

  it('selectIdiomIsLearned checks membership', () => {
    expect(selectIdiomIsLearned('idiom_1')(rootState(mockSliceState))).toBe(true);
    expect(selectIdiomIsLearned('idiom_999')(rootState(mockSliceState))).toBe(false);
  });

  it('selectFavoriteIds returns favourites', () => {
    expect(selectFavoriteIds(rootState(mockSliceState))).toEqual(['idiom_1']);
  });

  it('selectIdiomIsFavorite checks membership', () => {
    expect(selectIdiomIsFavorite('idiom_1')(rootState(mockSliceState))).toBe(true);
    expect(selectIdiomIsFavorite('idiom_2')(rootState(mockSliceState))).toBe(false);
  });

  it('selectDailyIdiomId returns dailyIdiomId', () => {
    expect(selectDailyIdiomId(rootState(mockSliceState))).toBe('idiom_daily');
  });

  it('selectLastDailyDate returns lastDailyDate', () => {
    expect(selectLastDailyDate(rootState(mockSliceState))).toBe('2026-03-27');
  });

  it('selectQuizHistory returns quiz history', () => {
    expect(selectQuizHistory(rootState(mockSliceState))).toEqual([]);
  });

  it('selectQuizStats returns quiz stats', () => {
    const stats = selectQuizStats(rootState(mockSliceState));
    expect(stats.totalQuestions).toBe(10);
    expect(stats.accuracy).toBe(70);
  });

  it('selectQuizAccuracy returns accuracy', () => {
    expect(selectQuizAccuracy(rootState(mockSliceState))).toBe(70);
  });

  it('selectAverageQuizTime returns average time', () => {
    expect(selectAverageQuizTime(rootState(mockSliceState))).toBe(2500);
  });

  it('selectors handle missing idiom state gracefully', () => {
    const emptyRoot = { idiom: undefined };
    expect(selectLearnedCount(emptyRoot)).toBe(0);
    expect(selectLearnedIds(emptyRoot)).toEqual([]);
    expect(selectFavoriteIds(emptyRoot)).toEqual([]);
    expect(selectDailyIdiomId(emptyRoot)).toBeNull();
    expect(selectQuizAccuracy(emptyRoot)).toBe(0);
  });
});
