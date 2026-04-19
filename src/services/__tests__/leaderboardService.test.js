import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getWeekId,
  loadLeaderboardData,
  saveLeaderboardData,
  recordWeeklySnapshot,
  calculatePercentile,
  resetLeaderboardData,
} from '../leaderboardService.js';

describe('leaderboardService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getWeekId', () => {
    it('should return ISO week format', () => {
      // 2026-02-09 is a Monday in week 7
      const result = getWeekId(new Date('2026-02-09T00:00:00Z'));
      expect(result).toMatch(/^\d{4}-W\d{2}$/);
    });

    it('should return the same week for dates in the same week', () => {
      const monday = getWeekId(new Date('2026-02-09T00:00:00Z'));
      const wednesday = getWeekId(new Date('2026-02-11T00:00:00Z'));
      expect(monday).toBe(wednesday);
    });

    it('should return different weeks for dates in different weeks', () => {
      const week1 = getWeekId(new Date('2026-02-09T00:00:00Z'));
      const week2 = getWeekId(new Date('2026-02-16T00:00:00Z'));
      expect(week1).not.toBe(week2);
    });
  });

  describe('loadLeaderboardData', () => {
    it('should return empty defaults when no data stored', () => {
      const data = loadLeaderboardData();
      expect(data).toEqual({ weeklySnapshots: [], currentWeek: null });
    });

    it('should parse stored data correctly', () => {
      const stored = {
        weeklySnapshots: [{ week: '2026-W07', wordsLearned: 10, quizzesCompleted: 3, streak: 5 }],
        currentWeek: '2026-W07',
      };
      localStorage.setItem('gogo-arabic-leaderboard', JSON.stringify(stored));

      const data = loadLeaderboardData();
      expect(data.weeklySnapshots).toHaveLength(1);
      expect(data.currentWeek).toBe('2026-W07');
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('gogo-arabic-leaderboard', 'not-json');
      const data = loadLeaderboardData();
      expect(data).toEqual({ weeklySnapshots: [], currentWeek: null });
    });
  });

  describe('saveLeaderboardData', () => {
    it('should persist data to localStorage', () => {
      const data = {
        weeklySnapshots: [{ week: '2026-W07', wordsLearned: 5, quizzesCompleted: 2, streak: 3 }],
        currentWeek: '2026-W07',
      };
      saveLeaderboardData(data);

      const raw = localStorage.getItem('gogo-arabic-leaderboard');
      expect(JSON.parse(raw)).toEqual(data);
    });
  });

  describe('recordWeeklySnapshot', () => {
    it('should create a new snapshot for the current week', () => {
      const stats = { wordsLearned: 15, quizzesCompleted: 4, streak: 7 };
      const result = recordWeeklySnapshot(stats);

      expect(result.weeklySnapshots).toHaveLength(1);
      expect(result.weeklySnapshots[0].wordsLearned).toBe(15);
      expect(result.weeklySnapshots[0].quizzesCompleted).toBe(4);
      expect(result.weeklySnapshots[0].streak).toBe(7);
    });

    it('should update an existing snapshot for the same week', () => {
      recordWeeklySnapshot({ wordsLearned: 5, quizzesCompleted: 1, streak: 2 });
      const result = recordWeeklySnapshot({ wordsLearned: 10, quizzesCompleted: 3, streak: 4 });

      expect(result.weeklySnapshots).toHaveLength(1);
      expect(result.weeklySnapshots[0].wordsLearned).toBe(10);
    });

    it('should keep only last 52 weeks of snapshots', () => {
      // Pre-fill 52 snapshots
      const snapshots = [];
      for (let i = 1; i <= 52; i++) {
        snapshots.push({ week: `2025-W${String(i).padStart(2, '0')}`, wordsLearned: i, quizzesCompleted: 1, streak: 1 });
      }
      saveLeaderboardData({ weeklySnapshots: snapshots, currentWeek: '2025-W52' });

      // Record a new one — should push out the oldest
      const result = recordWeeklySnapshot({ wordsLearned: 99, quizzesCompleted: 10, streak: 14 });
      expect(result.weeklySnapshots.length).toBeLessThanOrEqual(52);
    });
  });

  describe('calculatePercentile', () => {
    it('should return null percentile when not enough historical data', () => {
      const result = calculatePercentile({ wordsLearned: 10, quizzesCompleted: 2, streak: 5 });
      expect(result.hasEnoughData).toBe(false);
      expect(result.percentile).toBeNull();
    });

    it('should return a percentile when enough snapshots exist', () => {
      // Create 4 past-week snapshots with varying performance
      const thisWeek = getWeekId(new Date());
      const snapshots = [
        { week: '2025-W01', wordsLearned: 2, quizzesCompleted: 1, streak: 1 },
        { week: '2025-W02', wordsLearned: 5, quizzesCompleted: 2, streak: 3 },
        { week: '2025-W03', wordsLearned: 10, quizzesCompleted: 3, streak: 5 },
        { week: '2025-W04', wordsLearned: 15, quizzesCompleted: 5, streak: 7 },
      ];
      saveLeaderboardData({ weeklySnapshots: snapshots, currentWeek: thisWeek });

      // Current stats better than 3 of 4 past weeks
      const result = calculatePercentile({ wordsLearned: 12, quizzesCompleted: 4, streak: 6 });
      expect(result.hasEnoughData).toBe(true);
      expect(result.percentile).toBeGreaterThanOrEqual(0);
      expect(result.percentile).toBeLessThanOrEqual(100);
    });

    it('should return 100 percentile when current week beats all past weeks', () => {
      const thisWeek = getWeekId(new Date());
      const snapshots = [
        { week: '2025-W01', wordsLearned: 1, quizzesCompleted: 0, streak: 1 },
        { week: '2025-W02', wordsLearned: 2, quizzesCompleted: 1, streak: 1 },
        { week: '2025-W03', wordsLearned: 3, quizzesCompleted: 1, streak: 2 },
      ];
      saveLeaderboardData({ weeklySnapshots: snapshots, currentWeek: thisWeek });

      const result = calculatePercentile({ wordsLearned: 100, quizzesCompleted: 50, streak: 30 });
      expect(result.percentile).toBe(100);
    });

    it('should return 0 percentile when current week is worst', () => {
      const thisWeek = getWeekId(new Date());
      const snapshots = [
        { week: '2025-W01', wordsLearned: 20, quizzesCompleted: 10, streak: 14 },
        { week: '2025-W02', wordsLearned: 25, quizzesCompleted: 12, streak: 14 },
        { week: '2025-W03', wordsLearned: 30, quizzesCompleted: 15, streak: 14 },
      ];
      saveLeaderboardData({ weeklySnapshots: snapshots, currentWeek: thisWeek });

      const result = calculatePercentile({ wordsLearned: 0, quizzesCompleted: 0, streak: 0 });
      expect(result.percentile).toBe(0);
    });

    it('should exclude current week from past snapshots', () => {
      const thisWeek = getWeekId(new Date());
      const snapshots = [
        { week: thisWeek, wordsLearned: 50, quizzesCompleted: 20, streak: 14 },
        { week: '2025-W01', wordsLearned: 1, quizzesCompleted: 0, streak: 1 },
        { week: '2025-W02', wordsLearned: 2, quizzesCompleted: 1, streak: 1 },
      ];
      saveLeaderboardData({ weeklySnapshots: snapshots, currentWeek: thisWeek });

      // Only 2 past snapshots (current week excluded) — not enough
      const result = calculatePercentile({ wordsLearned: 10, quizzesCompleted: 3, streak: 5 });
      expect(result.hasEnoughData).toBe(false);
    });
  });

  describe('resetLeaderboardData', () => {
    it('should remove leaderboard data from localStorage', () => {
      saveLeaderboardData({ weeklySnapshots: [{ week: '2025-W01' }], currentWeek: '2025-W01' });
      resetLeaderboardData();
      expect(localStorage.getItem('gogo-arabic-leaderboard')).toBeNull();
    });
  });
});
