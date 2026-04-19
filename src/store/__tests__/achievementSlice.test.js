import { describe, it, expect, beforeEach, vi } from 'vitest';
import achievementReducer, {
  unlockAchievement,
  dismissAchievementNotification,
  clearAllNotifications,
  incrementReviews,
  recordPerfectQuiz,
  recordShopPurchase,
  selectUnlockedAchievements,
  selectNewAchievements,
  selectAchievementStats,
  selectIsAchievementUnlocked,
  selectUnlockedCount,
} from '../slices/achievementSlice.js';

// Mock achievement data
vi.mock('../../data/achievements.js', () => ({
  ACHIEVEMENTS: [
    { id: 'ach_1', xpReward: 50 },
    { id: 'ach_2', xpReward: 100 },
    { id: 'ach_3', xpReward: 150 },
  ],
  getAchievementById: (id) => {
    const achievements = {
      ach_1: { id: 'ach_1', xpReward: 50 },
      ach_2: { id: 'ach_2', xpReward: 100 },
      ach_3: { id: 'ach_3', xpReward: 150 },
    };
    return achievements[id];
  },
}));

vi.mock('../../data/vocabularyAll.js', () => ({
  default: [],
}));

describe('achievementSlice', () => {
  let initialState;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-09T00:00:00Z'));
    initialState = achievementReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        unlockedAchievements: {},
        newAchievements: [],
        completedChains: [],
        stats: {
          totalReviews: 0,
          reviewStreakDays: 0,
          lastReviewDate: null,
          perfectQuizzes: 0,
          shopPurchases: 0,
          dirhamsSpent: 0,
          quizTypeStats: {},
        },
      });
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock achievement with timestamp', () => {
      const state = achievementReducer(initialState, unlockAchievement('ach_1'));

      expect(state.unlockedAchievements['ach_1']).toBe(Date.now());
      expect(state.newAchievements).toContain('ach_1');
    });

    it('should add to new achievements queue', () => {
      const state = achievementReducer(initialState, unlockAchievement('ach_1'));

      expect(state.newAchievements).toHaveLength(1);
      expect(state.newAchievements[0]).toBe('ach_1');
    });

    it('should not unlock already unlocked achievement', () => {
      const startState = {
        ...initialState,
        unlockedAchievements: { ach_1: 1234567890 },
        newAchievements: [],
      };

      const state = achievementReducer(startState, unlockAchievement('ach_1'));

      expect(state.unlockedAchievements['ach_1']).toBe(1234567890);
      expect(state.newAchievements).toHaveLength(0);
    });

    it('should unlock multiple achievements', () => {
      let state = achievementReducer(initialState, unlockAchievement('ach_1'));
      state = achievementReducer(state, unlockAchievement('ach_2'));

      expect(Object.keys(state.unlockedAchievements)).toHaveLength(2);
      expect(state.newAchievements).toEqual(['ach_1', 'ach_2']);
    });
  });

  describe('dismissAchievementNotification', () => {
    it('should remove achievement from new achievements queue', () => {
      const startState = {
        ...initialState,
        newAchievements: ['ach_1', 'ach_2', 'ach_3'],
      };

      const state = achievementReducer(
        startState,
        dismissAchievementNotification('ach_2')
      );

      expect(state.newAchievements).toEqual(['ach_1', 'ach_3']);
    });

    it('should handle dismissing non-existent notification', () => {
      const startState = {
        ...initialState,
        newAchievements: ['ach_1'],
      };

      const state = achievementReducer(
        startState,
        dismissAchievementNotification('ach_2')
      );

      expect(state.newAchievements).toEqual(['ach_1']);
    });

    it('should not affect unlocked achievements', () => {
      const startState = {
        ...initialState,
        unlockedAchievements: { ach_1: Date.now() },
        newAchievements: ['ach_1'],
      };

      const state = achievementReducer(
        startState,
        dismissAchievementNotification('ach_1')
      );

      expect(state.unlockedAchievements).toHaveProperty('ach_1');
      expect(state.newAchievements).toEqual([]);
    });
  });

  describe('clearAllNotifications', () => {
    it('should clear all new achievements', () => {
      const startState = {
        ...initialState,
        newAchievements: ['ach_1', 'ach_2', 'ach_3'],
      };

      const state = achievementReducer(startState, clearAllNotifications());

      expect(state.newAchievements).toEqual([]);
    });

    it('should not affect unlocked achievements', () => {
      const startState = {
        ...initialState,
        unlockedAchievements: { ach_1: Date.now(), ach_2: Date.now() },
        newAchievements: ['ach_1', 'ach_2'],
      };

      const state = achievementReducer(startState, clearAllNotifications());

      expect(Object.keys(state.unlockedAchievements)).toHaveLength(2);
      expect(state.newAchievements).toEqual([]);
    });
  });

  describe('incrementReviews', () => {
    it('should increment total reviews', () => {
      const state = achievementReducer(initialState, incrementReviews());

      expect(state.stats.totalReviews).toBe(1);
    });

    it('should start review streak on first review', () => {
      const state = achievementReducer(initialState, incrementReviews());

      expect(state.stats.reviewStreakDays).toBe(1);
      expect(state.stats.lastReviewDate).toBe(new Date('2026-02-09T00:00:00Z').toDateString());
    });

    it('should not increment streak on same day', () => {
      const today = new Date().toDateString();
      const startState = {
        ...initialState,
        stats: {
          ...initialState.stats,
          totalReviews: 5,
          reviewStreakDays: 3,
          lastReviewDate: today,
        },
      };

      const state = achievementReducer(startState, incrementReviews());

      expect(state.stats.totalReviews).toBe(6);
      expect(state.stats.reviewStreakDays).toBe(3);
    });

    it('should increment streak on consecutive day', () => {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const startState = {
        ...initialState,
        stats: {
          ...initialState.stats,
          reviewStreakDays: 5,
          lastReviewDate: yesterday,
        },
      };

      const state = achievementReducer(startState, incrementReviews());

      expect(state.stats.reviewStreakDays).toBe(6);
      expect(state.stats.lastReviewDate).toBe(new Date('2026-02-09T00:00:00Z').toDateString());
    });

    it('should reset streak if not consecutive', () => {
      const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();
      const startState = {
        ...initialState,
        stats: {
          ...initialState.stats,
          reviewStreakDays: 10,
          lastReviewDate: twoDaysAgo,
        },
      };

      const state = achievementReducer(startState, incrementReviews());

      expect(state.stats.reviewStreakDays).toBe(1);
    });
  });

  describe('recordPerfectQuiz', () => {
    it('should increment perfect quiz counter', () => {
      const state = achievementReducer(initialState, recordPerfectQuiz());

      expect(state.stats.perfectQuizzes).toBe(1);
    });

    it('should accumulate perfect quizzes', () => {
      let state = achievementReducer(initialState, recordPerfectQuiz());
      state = achievementReducer(state, recordPerfectQuiz());
      state = achievementReducer(state, recordPerfectQuiz());

      expect(state.stats.perfectQuizzes).toBe(3);
    });
  });

  describe('recordShopPurchase', () => {
    it('should increment shop purchases and track dirhams spent', () => {
      const state = achievementReducer(initialState, recordShopPurchase(50));

      expect(state.stats.shopPurchases).toBe(1);
      expect(state.stats.dirhamsSpent).toBe(50);
    });

    it('should accumulate purchases and spending', () => {
      let state = achievementReducer(initialState, recordShopPurchase(30));
      state = achievementReducer(state, recordShopPurchase(20));
      state = achievementReducer(state, recordShopPurchase(15));

      expect(state.stats.shopPurchases).toBe(3);
      expect(state.stats.dirhamsSpent).toBe(65);
    });

    it('should handle zero cost purchases', () => {
      const state = achievementReducer(initialState, recordShopPurchase(0));

      expect(state.stats.shopPurchases).toBe(1);
      expect(state.stats.dirhamsSpent).toBe(0);
    });
  });

  describe('selectors', () => {
    const mockState = {
      achievements: {
        unlockedAchievements: {
          ach_1: 1234567890,
          ach_2: 1234567900,
        },
        newAchievements: ['ach_2'],
        stats: {
          totalReviews: 50,
          reviewStreakDays: 7,
          lastReviewDate: '2026-02-09',
          perfectQuizzes: 3,
          shopPurchases: 5,
          dirhamsSpent: 150,
        },
      },
    };

    it('selectUnlockedAchievements should return unlocked achievements', () => {
      const unlocked = selectUnlockedAchievements(mockState);
      expect(Object.keys(unlocked)).toHaveLength(2);
      expect(unlocked).toHaveProperty('ach_1');
      expect(unlocked).toHaveProperty('ach_2');
    });

    it('selectNewAchievements should return new achievements queue', () => {
      const newAchs = selectNewAchievements(mockState);
      expect(newAchs).toEqual(['ach_2']);
    });

    it('selectAchievementStats should return stats object', () => {
      const stats = selectAchievementStats(mockState);
      expect(stats.totalReviews).toBe(50);
      expect(stats.reviewStreakDays).toBe(7);
      expect(stats.perfectQuizzes).toBe(3);
      expect(stats.shopPurchases).toBe(5);
      expect(stats.dirhamsSpent).toBe(150);
    });

    it('selectIsAchievementUnlocked should return true for unlocked achievement', () => {
      const isUnlocked = selectIsAchievementUnlocked('ach_1')(mockState);
      expect(isUnlocked).toBe(true);
    });

    it('selectIsAchievementUnlocked should return false for locked achievement', () => {
      const isUnlocked = selectIsAchievementUnlocked('ach_3')(mockState);
      expect(isUnlocked).toBe(false);
    });

    it('selectUnlockedCount should return count of unlocked achievements', () => {
      const count = selectUnlockedCount(mockState);
      expect(count).toBe(2);
    });
  });
});
