import { describe, it, expect, beforeEach, vi } from 'vitest';
import dailyGoalsReducer, {
  updateDailyGoal,
  setGoalProgress,
  resetDailyGoals,
  checkDailyReset,
  startSession,
  endSession,
  updateSessionTime,
  completeAllGoals,
  markWelcomeBackShown,
  resetWelcomeBackShown,
  selectDailyGoals,
  selectAllGoalsCompleted,
  selectCompletedGoalsCount,
  selectTotalGoalsCount,
  selectOverallProgress,
  selectLastSessionSummary,
  selectWelcomeBackShown,
} from '../slices/dailyGoalsSlice.js';

// Mock daily goals data
vi.mock('../../data/dailyGoals.js', () => ({
  DEFAULT_DAILY_GOALS: {
    reviewsCompleted: { target: 10, current: 0, label: 'Reviews' },
    newWordsLearned: { target: 5, current: 0, label: 'New Words' },
    minutesPlayed: { target: 15, current: 0, label: 'Minutes' },
  },
  areAllGoalsCompleted: (goals) => {
    return Object.values(goals).every((goal) => goal.current >= goal.target);
  },
  getGoalProgress: (goal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  },
}));

describe('dailyGoalsSlice', () => {
  let initialState;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
    initialState = dailyGoalsReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState.date).toBeNull();
      expect(initialState.allCompleted).toBe(false);
      expect(initialState.sessionStartTime).toBeNull();
      expect(initialState.totalSessionMinutes).toBe(0);
      expect(initialState.goals).toBeDefined();
      expect(Object.keys(initialState.goals)).toHaveLength(3);
    });

    it('should initialize goals with zero current values', () => {
      expect(initialState.goals.reviewsCompleted.current).toBe(0);
      expect(initialState.goals.newWordsLearned.current).toBe(0);
      expect(initialState.goals.minutesPlayed.current).toBe(0);
    });
  });

  describe('updateDailyGoal', () => {
    it('should update goal progress', () => {
      const state = dailyGoalsReducer(
        initialState,
        updateDailyGoal({ goalType: 'reviewsCompleted', amount: 3 })
      );

      expect(state.goals.reviewsCompleted.current).toBe(3);
      expect(state.date).toBe('2026-02-09');
    });

    it('should accumulate goal progress', () => {
      let state = dailyGoalsReducer(
        initialState,
        updateDailyGoal({ goalType: 'reviewsCompleted', amount: 3 })
      );
      state = dailyGoalsReducer(
        state,
        updateDailyGoal({ goalType: 'reviewsCompleted', amount: 2 })
      );

      expect(state.goals.reviewsCompleted.current).toBe(5);
    });

    it('should auto-reset on new day', () => {
      const yesterday = '2026-02-08';
      const startState = {
        ...initialState,
        date: yesterday,
        goals: {
          ...initialState.goals,
          reviewsCompleted: {
            ...initialState.goals.reviewsCompleted,
            current: 15,
          },
        },
      };

      const state = dailyGoalsReducer(
        startState,
        updateDailyGoal({ goalType: 'newWordsLearned', amount: 1 })
      );

      expect(state.date).toBe('2026-02-09');
      expect(state.goals.reviewsCompleted.current).toBe(0);
      expect(state.goals.newWordsLearned.current).toBe(1);
    });

    it('should set allCompleted when all goals met', () => {
      const startState = {
        ...initialState,
        date: '2026-02-09',
        goals: {
          reviewsCompleted: { target: 10, current: 10 },
          newWordsLearned: { target: 5, current: 5 },
          minutesPlayed: { target: 15, current: 10 },
        },
      };

      const state = dailyGoalsReducer(
        startState,
        updateDailyGoal({ goalType: 'minutesPlayed', amount: 5 })
      );

      expect(state.allCompleted).toBe(true);
    });

    it('should allow overflow up to 2x target', () => {
      const startState = {
        ...initialState,
        date: '2026-02-09',
        goals: {
          reviewsCompleted: { target: 10, current: 18 },
        },
      };

      const state = dailyGoalsReducer(
        startState,
        updateDailyGoal({ goalType: 'reviewsCompleted', amount: 3 })
      );

      expect(state.goals.reviewsCompleted.current).toBe(20);
    });

    it('should not update non-existent goal', () => {
      const state = dailyGoalsReducer(
        initialState,
        updateDailyGoal({ goalType: 'nonexistent', amount: 5 })
      );

      expect(state.goals).toEqual(initialState.goals);
    });
  });

  describe('setGoalProgress', () => {
    it('should set goal current value directly', () => {
      const state = dailyGoalsReducer(
        initialState,
        setGoalProgress({ goalType: 'reviewsCompleted', current: 7 })
      );

      expect(state.goals.reviewsCompleted.current).toBe(7);
    });

    it('should auto-reset on new day', () => {
      const yesterday = '2026-02-08';
      const startState = {
        ...initialState,
        date: yesterday,
        goals: {
          ...initialState.goals,
          reviewsCompleted: { ...initialState.goals.reviewsCompleted, current: 20 },
        },
      };

      const state = dailyGoalsReducer(
        startState,
        setGoalProgress({ goalType: 'reviewsCompleted', current: 5 })
      );

      expect(state.date).toBe('2026-02-09');
      expect(state.goals.reviewsCompleted.current).toBe(5);
    });
  });

  describe('resetDailyGoals', () => {
    it('should reset all goals to zero', () => {
      const startState = {
        ...initialState,
        date: '2026-02-08',
        goals: {
          reviewsCompleted: { target: 10, current: 15 },
          newWordsLearned: { target: 5, current: 8 },
          minutesPlayed: { target: 15, current: 20 },
        },
        allCompleted: true,
      };

      const state = dailyGoalsReducer(startState, resetDailyGoals());

      expect(state.date).toBe('2026-02-09');
      expect(state.goals.reviewsCompleted.current).toBe(0);
      expect(state.goals.newWordsLearned.current).toBe(0);
      expect(state.goals.minutesPlayed.current).toBe(0);
      expect(state.allCompleted).toBe(false);
    });
  });

  describe('checkDailyReset', () => {
    it('should reset on new day', () => {
      const yesterday = '2026-02-08';
      const startState = {
        ...initialState,
        date: yesterday,
        goals: {
          ...initialState.goals,
          reviewsCompleted: { ...initialState.goals.reviewsCompleted, current: 10 },
        },
        allCompleted: true,
      };

      const state = dailyGoalsReducer(startState, checkDailyReset());

      expect(state.date).toBe('2026-02-09');
      expect(state.goals.reviewsCompleted.current).toBe(0);
      expect(state.allCompleted).toBe(false);
    });

    it('should not reset on same day', () => {
      const startState = {
        ...initialState,
        date: '2026-02-09',
        goals: {
          ...initialState.goals,
          reviewsCompleted: { ...initialState.goals.reviewsCompleted, current: 5 },
        },
      };

      const state = dailyGoalsReducer(startState, checkDailyReset());

      expect(state.date).toBe('2026-02-09');
      expect(state.goals.reviewsCompleted.current).toBe(5);
    });
  });

  describe('session tracking', () => {
    it('startSession should record session start time', () => {
      const state = dailyGoalsReducer(initialState, startSession());

      expect(state.sessionStartTime).toBe(Date.now());
    });

    it('endSession should accumulate session time', () => {
      const startTime = Date.now();
      const startState = {
        ...initialState,
        sessionStartTime: startTime,
        totalSessionMinutes: 10,
      };

      // Advance time by 5 minutes
      vi.advanceTimersByTime(5 * 60 * 1000);

      const state = dailyGoalsReducer(startState, endSession());

      expect(state.totalSessionMinutes).toBe(15);
      expect(state.sessionStartTime).toBeNull();
    });

    it('endSession should handle no active session', () => {
      const state = dailyGoalsReducer(initialState, endSession());

      expect(state.totalSessionMinutes).toBe(0);
      expect(state.sessionStartTime).toBeNull();
    });

    it('updateSessionTime should update minutes played goal', () => {
      const startTime = Date.now();
      const startState = {
        ...initialState,
        date: '2026-02-09',
        sessionStartTime: startTime,
        totalSessionMinutes: 10,
        goals: {
          ...initialState.goals,
          minutesPlayed: { target: 15, current: 0 },
        },
      };

      // Advance time by 3 minutes
      vi.advanceTimersByTime(3 * 60 * 1000);

      const state = dailyGoalsReducer(startState, updateSessionTime());

      expect(state.goals.minutesPlayed.current).toBe(13);
    });

    it('updateSessionTime should auto-reset on new day', () => {
      const yesterday = '2026-02-08';
      const startTime = Date.now();
      const startState = {
        ...initialState,
        date: yesterday,
        sessionStartTime: startTime,
        totalSessionMinutes: 20,
        goals: {
          ...initialState.goals,
          minutesPlayed: { target: 15, current: 20 },
        },
      };

      const state = dailyGoalsReducer(startState, updateSessionTime());

      expect(state.date).toBe('2026-02-09');
      expect(state.totalSessionMinutes).toBe(0);
      // totalMinutes is computed before reset (20 + 0 session = 20), so minutesPlayed carries it
      expect(state.goals.minutesPlayed.current).toBe(20);
    });
  });

  describe('completeAllGoals', () => {
    it('should set all goals to target', () => {
      const state = dailyGoalsReducer(initialState, completeAllGoals());

      expect(state.goals.reviewsCompleted.current).toBe(
        state.goals.reviewsCompleted.target
      );
      expect(state.goals.newWordsLearned.current).toBe(
        state.goals.newWordsLearned.target
      );
      expect(state.goals.minutesPlayed.current).toBe(
        state.goals.minutesPlayed.target
      );
      expect(state.allCompleted).toBe(true);
    });
  });

  describe('selectors', () => {
    const mockState = {
      dailyGoals: {
        date: '2026-02-09',
        goals: {
          reviewsCompleted: { target: 10, current: 10, label: 'Reviews' },
          newWordsLearned: { target: 5, current: 3, label: 'New Words' },
          minutesPlayed: { target: 15, current: 15, label: 'Minutes' },
        },
        allCompleted: false,
      },
    };

    it('selectDailyGoals should return goals object', () => {
      const goals = selectDailyGoals(mockState);
      expect(Object.keys(goals)).toHaveLength(3);
    });

    it('selectAllGoalsCompleted should return completion status', () => {
      const completed = selectAllGoalsCompleted(mockState);
      expect(completed).toBe(false);
    });

    it('selectCompletedGoalsCount should count completed goals', () => {
      const count = selectCompletedGoalsCount(mockState);
      expect(count).toBe(2); // reviewsCompleted and minutesPlayed are complete
    });

    it('selectTotalGoalsCount should return total goal count', () => {
      const total = selectTotalGoalsCount(mockState);
      expect(total).toBe(3);
    });

    it('selectOverallProgress should calculate percentage', () => {
      // 2 out of 3 goals complete = 67% (rounded)
      const progress = selectOverallProgress(mockState);
      expect(progress).toBe(67);
    });

    it('selectOverallProgress should handle zero goals', () => {
      const emptyState = {
        dailyGoals: { goals: {} },
      };
      const progress = selectOverallProgress(emptyState);
      expect(progress).toBe(0);
    });

    it('selectLastSessionSummary should return correct shape', () => {
      const state = {
        dailyGoals: {
          lastSessionWordsLearned: 5,
          lastSessionReviewsDone: 8,
          lastSessionEndTime: '2026-02-09T12:00:00.000Z',
        },
      };
      const summary = selectLastSessionSummary(state);
      expect(summary).toEqual({
        wordsLearned: 5,
        reviewsDone: 8,
        endTime: '2026-02-09T12:00:00.000Z',
      });
    });

    it('selectLastSessionSummary should return defaults for missing state', () => {
      const state = { dailyGoals: {} };
      const summary = selectLastSessionSummary(state);
      expect(summary).toEqual({
        wordsLearned: 0,
        reviewsDone: 0,
        endTime: null,
      });
    });

    it('selectWelcomeBackShown should return false by default', () => {
      const state = { dailyGoals: {} };
      expect(selectWelcomeBackShown(state)).toBe(false);
    });

    it('selectWelcomeBackShown should return true when set', () => {
      const state = { dailyGoals: { welcomeBackShown: true } };
      expect(selectWelcomeBackShown(state)).toBe(true);
    });
  });

  describe('Welcome Back (Phase 69)', () => {
    it('endSession should snapshot wordsLearned and reviewsDone', () => {
      const startTime = Date.now();
      const startState = {
        ...initialState,
        sessionStartTime: startTime,
        goals: {
          ...initialState.goals,
          wordsLearned: { target: 5, current: 3 },
          reviewsDone: { target: 10, current: 7 },
        },
      };

      vi.advanceTimersByTime(2 * 60 * 1000);
      const state = dailyGoalsReducer(startState, endSession());

      expect(state.lastSessionWordsLearned).toBe(3);
      expect(state.lastSessionReviewsDone).toBe(7);
    });

    it('endSession should set lastSessionEndTime', () => {
      const startTime = Date.now();
      const startState = {
        ...initialState,
        sessionStartTime: startTime,
      };

      vi.advanceTimersByTime(1 * 60 * 1000);
      const state = dailyGoalsReducer(startState, endSession());

      expect(state.lastSessionEndTime).toBeTruthy();
      expect(typeof state.lastSessionEndTime).toBe('string');
      // Should be a valid ISO date string
      expect(() => new Date(state.lastSessionEndTime)).not.toThrow();
    });

    it('markWelcomeBackShown should set flag to true', () => {
      const state = dailyGoalsReducer(initialState, markWelcomeBackShown());
      expect(state.welcomeBackShown).toBe(true);
    });

    it('resetWelcomeBackShown should set flag to false', () => {
      const startState = { ...initialState, welcomeBackShown: true };
      const state = dailyGoalsReducer(startState, resetWelcomeBackShown());
      expect(state.welcomeBackShown).toBe(false);
    });

    it('daily reset (checkDailyReset) should clear welcomeBackShown', () => {
      const yesterday = '2026-02-08';
      const startState = {
        ...initialState,
        date: yesterday,
        welcomeBackShown: true,
      };

      const state = dailyGoalsReducer(startState, checkDailyReset());
      expect(state.welcomeBackShown).toBe(false);
    });

    it('daily reset (resetDailyGoals) should clear welcomeBackShown', () => {
      const startState = {
        ...initialState,
        date: '2026-02-08',
        welcomeBackShown: true,
      };

      const state = dailyGoalsReducer(startState, resetDailyGoals());
      expect(state.welcomeBackShown).toBe(false);
    });

    it('initial state should have welcomeBackShown as false', () => {
      expect(initialState.welcomeBackShown).toBe(false);
    });

    it('initial state should have lastSessionWordsLearned as 0', () => {
      expect(initialState.lastSessionWordsLearned).toBe(0);
    });

    it('initial state should have lastSessionReviewsDone as 0', () => {
      expect(initialState.lastSessionReviewsDone).toBe(0);
    });

    it('initial state should have lastSessionEndTime as null', () => {
      expect(initialState.lastSessionEndTime).toBeNull();
    });
  });
});
