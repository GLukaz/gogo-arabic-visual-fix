import { describe, it, expect, vi, beforeEach } from 'vitest';
import extendedAnalyticsReducer, {
  recordStudySession,
  generateWeeklyReport,
  generateMonthlyReport,
  setLearningGoal,
  updateGoalProgress,
  resetExtendedAnalytics,
  selectStudySessions,
  selectWeeklyReports,
  selectMonthlyReports,
  selectLearningGoals,
  selectGoalProgress,
  selectGoalCompletion,
  selectGoalStreak,
} from '../extendedAnalyticsSlice.js';

describe('extendedAnalyticsSlice', () => {
  let initialState;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00Z'));
    initialState = extendedAnalyticsReducer(undefined, { type: 'unknown' });
  });

  // ============================================================
  // Initial state
  // ============================================================

  describe('initial state', () => {
    it('should have empty study sessions', () => {
      expect(initialState.studySessions).toEqual([]);
    });

    it('should have empty reports', () => {
      expect(initialState.weeklyReports).toEqual([]);
      expect(initialState.monthlyReports).toEqual([]);
    });

    it('should have default learning goals', () => {
      expect(initialState.learningGoals.dailyMinutes).toBe(20);
      expect(initialState.learningGoals.dailyWords).toBe(5);
      expect(initialState.learningGoals.weeklyPassages).toBe(3);
    });

    it('should have empty goal progress', () => {
      expect(initialState.goalProgress).toEqual({});
    });
  });

  // ============================================================
  // recordStudySession
  // ============================================================

  describe('recordStudySession', () => {
    it('should add a session to studySessions', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        recordStudySession({
          date: '2026-03-27',
          duration: 600,
          activity: 'review',
          wordsReviewed: 10,
          accuracy: 0.8,
        })
      );

      expect(state.studySessions).toHaveLength(1);
      expect(state.studySessions[0].date).toBe('2026-03-27');
      expect(state.studySessions[0].duration).toBe(600);
      expect(state.studySessions[0].wordsReviewed).toBe(10);
    });

    it('should update goal progress for the session date', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        recordStudySession({
          date: '2026-03-27',
          duration: 1200,
          activity: 'quiz',
          wordsReviewed: 5,
          accuracy: 0.9,
        })
      );

      expect(state.goalProgress['2026-03-27'].minutes).toBe(20);
      expect(state.goalProgress['2026-03-27'].words).toBe(5);
    });

    it('should cap sessions at 270', () => {
      let state = initialState;
      for (let i = 0; i < 275; i++) {
        state = extendedAnalyticsReducer(
          state,
          recordStudySession({
            date: '2026-03-27',
            duration: 60,
            activity: 'review',
            wordsReviewed: 1,
          })
        );
      }

      expect(state.studySessions.length).toBeLessThanOrEqual(270);
    });

    it('should use defaults for missing fields', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        recordStudySession({})
      );

      expect(state.studySessions[0].duration).toBe(0);
      expect(state.studySessions[0].activity).toBe('review');
      expect(state.studySessions[0].wordsReviewed).toBe(0);
      expect(state.studySessions[0].accuracy).toBe(0);

      vi.useRealTimers();
    });
  });

  // ============================================================
  // generateWeeklyReport / generateMonthlyReport
  // ============================================================

  describe('generateWeeklyReport', () => {
    it('should add a report to weeklyReports', () => {
      const report = { period: 'weekly', wordsReviewed: 50, startDate: '2026-03-20', endDate: '2026-03-27' };
      const state = extendedAnalyticsReducer(
        initialState,
        generateWeeklyReport({ report })
      );

      expect(state.weeklyReports).toHaveLength(1);
      expect(state.weeklyReports[0].wordsReviewed).toBe(50);
      expect(state.weeklyReports[0].generatedAt).toBeDefined();

      vi.useRealTimers();
    });

    it('should cap weekly reports at 12', () => {
      let state = initialState;
      for (let i = 0; i < 15; i++) {
        state = extendedAnalyticsReducer(
          state,
          generateWeeklyReport({ report: { period: 'weekly', week: i } })
        );
      }

      expect(state.weeklyReports.length).toBeLessThanOrEqual(12);

      vi.useRealTimers();
    });

    it('should ignore null report', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        generateWeeklyReport({ report: null })
      );

      expect(state.weeklyReports).toHaveLength(0);

      vi.useRealTimers();
    });
  });

  describe('generateMonthlyReport', () => {
    it('should cap monthly reports at 6', () => {
      let state = initialState;
      for (let i = 0; i < 8; i++) {
        state = extendedAnalyticsReducer(
          state,
          generateMonthlyReport({ report: { period: 'monthly', month: i } })
        );
      }

      expect(state.monthlyReports.length).toBeLessThanOrEqual(6);

      vi.useRealTimers();
    });
  });

  // ============================================================
  // setLearningGoal
  // ============================================================

  describe('setLearningGoal', () => {
    it('should update dailyMinutes', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        setLearningGoal({ key: 'dailyMinutes', value: 30 })
      );

      expect(state.learningGoals.dailyMinutes).toBe(30);

      vi.useRealTimers();
    });

    it('should update dailyWords', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        setLearningGoal({ key: 'dailyWords', value: 10 })
      );

      expect(state.learningGoals.dailyWords).toBe(10);

      vi.useRealTimers();
    });

    it('should reject invalid keys', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        setLearningGoal({ key: 'invalidKey', value: 10 })
      );

      expect(state.learningGoals).toEqual(initialState.learningGoals);

      vi.useRealTimers();
    });

    it('should reject non-positive values', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        setLearningGoal({ key: 'dailyMinutes', value: 0 })
      );

      expect(state.learningGoals.dailyMinutes).toBe(20);

      vi.useRealTimers();
    });
  });

  // ============================================================
  // updateGoalProgress
  // ============================================================

  describe('updateGoalProgress', () => {
    it('should create and update progress for today', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        updateGoalProgress({ minutes: 10, words: 3 })
      );

      expect(state.goalProgress['2026-03-27'].minutes).toBe(10);
      expect(state.goalProgress['2026-03-27'].words).toBe(3);

      vi.useRealTimers();
    });

    it('should accumulate progress', () => {
      let state = extendedAnalyticsReducer(
        initialState,
        updateGoalProgress({ minutes: 10 })
      );
      state = extendedAnalyticsReducer(
        state,
        updateGoalProgress({ minutes: 5 })
      );

      expect(state.goalProgress['2026-03-27'].minutes).toBe(15);

      vi.useRealTimers();
    });

    it('should support custom date', () => {
      const state = extendedAnalyticsReducer(
        initialState,
        updateGoalProgress({ date: '2026-03-20', passages: 2 })
      );

      expect(state.goalProgress['2026-03-20'].passages).toBe(2);

      vi.useRealTimers();
    });
  });

  // ============================================================
  // resetExtendedAnalytics
  // ============================================================

  describe('resetExtendedAnalytics', () => {
    it('should reset to initial state', () => {
      let state = extendedAnalyticsReducer(
        initialState,
        recordStudySession({ duration: 600, wordsReviewed: 10 })
      );
      state = extendedAnalyticsReducer(state, resetExtendedAnalytics());

      expect(state.studySessions).toEqual([]);
      expect(state.weeklyReports).toEqual([]);
      expect(state.goalProgress).toEqual({});

      vi.useRealTimers();
    });
  });

  // ============================================================
  // Selectors
  // ============================================================

  describe('selectors', () => {
    const mockRoot = {
      extendedAnalytics: {
        studySessions: [{ date: '2026-03-27', duration: 600 }],
        weeklyReports: [{ period: 'weekly' }],
        monthlyReports: [{ period: 'monthly' }],
        learningGoals: { dailyMinutes: 20, dailyWords: 5, weeklyPassages: 3 },
        goalProgress: { '2026-03-27': { minutes: 15, words: 3, passages: 1 } },
      },
    };

    it('selectStudySessions returns sessions', () => {
      expect(selectStudySessions(mockRoot)).toHaveLength(1);
    });

    it('selectWeeklyReports returns reports', () => {
      expect(selectWeeklyReports(mockRoot)).toHaveLength(1);
    });

    it('selectMonthlyReports returns reports', () => {
      expect(selectMonthlyReports(mockRoot)).toHaveLength(1);
    });

    it('selectLearningGoals returns goals', () => {
      expect(selectLearningGoals(mockRoot).dailyMinutes).toBe(20);
    });

    it('selectGoalProgress returns progress map', () => {
      expect(selectGoalProgress(mockRoot)['2026-03-27'].minutes).toBe(15);
    });

    it('selectGoalCompletion calculates percentages', () => {
      const result = selectGoalCompletion(mockRoot);
      expect(result.minutes.percent).toBe(75); // 15/20
      expect(result.words.percent).toBe(60);   // 3/5
      expect(result.passages.percent).toBe(33); // 1/3

      vi.useRealTimers();
    });

    it('selectGoalCompletion caps at 100%', () => {
      const overRoot = {
        extendedAnalytics: {
          ...mockRoot.extendedAnalytics,
          goalProgress: { '2026-03-27': { minutes: 100, words: 50, passages: 20 } },
        },
      };

      const result = selectGoalCompletion(overRoot);
      expect(result.minutes.percent).toBe(100);
      expect(result.words.percent).toBe(100);

      vi.useRealTimers();
    });

    it('selectors handle missing extendedAnalytics', () => {
      const emptyRoot = {};
      expect(selectStudySessions(emptyRoot)).toEqual([]);
      expect(selectWeeklyReports(emptyRoot)).toEqual([]);
      expect(selectLearningGoals(emptyRoot)).toBeDefined();
      expect(selectGoalProgress(emptyRoot)).toEqual({});

      vi.useRealTimers();
    });
  });

  describe('selectGoalStreak', () => {
    it('returns 0 when no progress exists', () => {
      const root = {
        extendedAnalytics: {
          learningGoals: { dailyMinutes: 20, dailyWords: 5, weeklyPassages: 3 },
          goalProgress: {},
        },
      };

      expect(selectGoalStreak(root)).toBe(0);

      vi.useRealTimers();
    });

    it('counts consecutive days with goals met', () => {
      const root = {
        extendedAnalytics: {
          learningGoals: { dailyMinutes: 20, dailyWords: 5, weeklyPassages: 3 },
          goalProgress: {
            '2026-03-27': { minutes: 25, words: 6, passages: 0 },
            '2026-03-26': { minutes: 20, words: 5, passages: 0 },
            '2026-03-25': { minutes: 30, words: 10, passages: 0 },
            '2026-03-24': { minutes: 5, words: 1, passages: 0 }, // missed
          },
        },
      };

      expect(selectGoalStreak(root)).toBe(3);

      vi.useRealTimers();
    });
  });
});
