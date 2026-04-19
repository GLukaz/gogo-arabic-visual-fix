import { describe, it, expect, beforeEach } from 'vitest';
import analyticsReducer, {
  recordWordResult,
  startSession,
  updateSessionProgress,
  endSession,
  recordDropout,
  recordLessonCompleted,
  resetAnalytics,
  selectWordAccuracy,
  selectHardestWords,
  selectSessionTrends,
  selectOverallAccuracy,
  selectDropoutPoints,
  selectDailyActivity,
} from '../analyticsSlice.js';

describe('analyticsSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = analyticsReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should have empty initial state', () => {
      expect(initialState.wordAccuracy).toEqual({});
      expect(initialState.sessions).toEqual([]);
      expect(initialState.currentSession).toBeNull();
      expect(initialState.dropoutPoints).toEqual({});
      expect(initialState.dailyActivity).toEqual({});
    });
  });

  describe('recordWordResult', () => {
    it('should create entry for new word', () => {
      const state = analyticsReducer(initialState, recordWordResult({ wordId: 'kitab', correct: true }));
      expect(state.wordAccuracy['kitab']).toEqual({ correct: 1, total: 1 });
    });

    it('should increment totals for existing word', () => {
      let state = analyticsReducer(initialState, recordWordResult({ wordId: 'kitab', correct: true }));
      state = analyticsReducer(state, recordWordResult({ wordId: 'kitab', correct: false }));
      state = analyticsReducer(state, recordWordResult({ wordId: 'kitab', correct: true }));
      expect(state.wordAccuracy['kitab']).toEqual({ correct: 2, total: 3 });
    });
  });

  describe('session lifecycle', () => {
    it('should start and end a session', () => {
      let state = analyticsReducer(initialState, startSession({ type: 'review' }));
      expect(state.currentSession).toBeDefined();
      expect(state.currentSession.type).toBe('review');

      state = analyticsReducer(state, updateSessionProgress({ wordsReviewed: 10, correctCount: 8 }));
      expect(state.currentSession.wordsReviewed).toBe(10);

      state = analyticsReducer(state, endSession());
      expect(state.currentSession).toBeNull();
      expect(state.sessions).toHaveLength(1);
      expect(state.sessions[0].wordsReviewed).toBe(10);
      expect(state.sessions[0].endedAt).toBeDefined();
    });

    it('should cap sessions at 100', () => {
      let state = initialState;
      for (let i = 0; i < 105; i++) {
        state = analyticsReducer(state, startSession({ type: 'review' }));
        state = analyticsReducer(state, endSession());
      }
      expect(state.sessions.length).toBeLessThanOrEqual(100);
    });

    it('endSession should update daily activity', () => {
      let state = analyticsReducer(initialState, startSession({ type: 'review' }));
      state = analyticsReducer(state, updateSessionProgress({ wordsReviewed: 5, correctCount: 4 }));
      state = analyticsReducer(state, endSession());

      const today = new Date().toISOString().slice(0, 10);
      expect(state.dailyActivity[today]).toBeDefined();
      expect(state.dailyActivity[today].sessionCount).toBe(1);
      expect(state.dailyActivity[today].wordsReviewed).toBe(5);
    });

    it('endSession is a no-op if no current session', () => {
      const state = analyticsReducer(initialState, endSession());
      expect(state.sessions).toHaveLength(0);
    });
  });

  describe('recordDropout', () => {
    it('should track dropout by route', () => {
      let state = analyticsReducer(initialState, recordDropout({ route: '/review' }));
      state = analyticsReducer(state, recordDropout({ route: '/review' }));
      state = analyticsReducer(state, recordDropout({ route: '/grammar/lesson1' }));
      expect(state.dropoutPoints['/review']).toBe(2);
      expect(state.dropoutPoints['/grammar/lesson1']).toBe(1);
    });
  });

  describe('recordLessonCompleted', () => {
    it('should increment daily lessons completed', () => {
      let state = analyticsReducer(initialState, recordLessonCompleted());
      state = analyticsReducer(state, recordLessonCompleted());
      const today = new Date().toISOString().slice(0, 10);
      expect(state.dailyActivity[today].lessonsCompleted).toBe(2);
    });
  });

  describe('resetAnalytics', () => {
    it('should reset to initial state', () => {
      let state = analyticsReducer(initialState, recordWordResult({ wordId: 'kitab', correct: true }));
      state = analyticsReducer(state, startSession({ type: 'review' }));
      state = analyticsReducer(state, endSession());
      state = analyticsReducer(state, resetAnalytics());
      expect(state).toEqual(initialState);
    });
  });

  describe('selectors', () => {
    it('selectHardestWords returns words sorted by accuracy ascending', () => {
      const mockState = {
        analytics: {
          ...initialState,
          wordAccuracy: {
            kitab: { correct: 1, total: 5 },   // 20% accuracy
            qalam: { correct: 4, total: 5 },   // 80% accuracy
            bayt: { correct: 2, total: 4 },     // 50% accuracy
            maa: { correct: 0, total: 1 },      // only 1 attempt, excluded (min 2)
          },
        },
      };
      const hardest = selectHardestWords(mockState, 10);
      expect(hardest).toHaveLength(3);
      expect(hardest[0].wordId).toBe('kitab');
      expect(hardest[0].accuracy).toBeCloseTo(0.2);
      expect(hardest[1].wordId).toBe('bayt');
      expect(hardest[2].wordId).toBe('qalam');
    });

    it('selectSessionTrends returns last N sessions with computed fields', () => {
      const mockState = {
        analytics: {
          ...initialState,
          sessions: [
            { type: 'review', startedAt: '2026-03-24T10:00:00Z', endedAt: '2026-03-24T10:10:00Z', wordsReviewed: 20, correctCount: 15 },
            { type: 'grammar', startedAt: '2026-03-24T11:00:00Z', endedAt: '2026-03-24T11:05:00Z', wordsReviewed: 10, correctCount: 8 },
          ],
        },
      };
      const trends = selectSessionTrends(mockState, 14);
      expect(trends).toHaveLength(2);
      expect(trends[0].durationMs).toBe(600000); // 10 minutes
      expect(trends[0].accuracy).toBeCloseTo(0.75);
    });

    it('selectOverallAccuracy computes global ratio', () => {
      const mockState = {
        analytics: {
          ...initialState,
          wordAccuracy: {
            kitab: { correct: 3, total: 4 },
            qalam: { correct: 2, total: 6 },
          },
        },
      };
      const accuracy = selectOverallAccuracy(mockState);
      expect(accuracy).toBeCloseTo(0.5); // 5/10
    });

    it('selectOverallAccuracy returns 0 when no data', () => {
      expect(selectOverallAccuracy({ analytics: initialState })).toBe(0);
    });
  });
});
