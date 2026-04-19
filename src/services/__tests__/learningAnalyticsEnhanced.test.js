import { describe, it, expect } from 'vitest';
import {
  getWordsPerHour,
  getOptimalSessionLength,
  getAccuracyTrend,
} from '../learningAnalytics.js';

describe('learningAnalytics — enhanced functions', () => {
  describe('getWordsPerHour', () => {
    it('should calculate words per hour', () => {
      const sessions = [
        { wordsReviewed: 30, startedAt: '2024-01-01T10:00:00Z', endedAt: '2024-01-01T10:30:00Z' },
        { wordsReviewed: 20, startedAt: '2024-01-01T11:00:00Z', endedAt: '2024-01-01T11:30:00Z' },
      ];
      const wph = getWordsPerHour(sessions);
      expect(wph).toBe(50); // 50 words / 1 hour
    });

    it('should return 0 for empty sessions', () => {
      expect(getWordsPerHour([])).toBe(0);
      expect(getWordsPerHour(null)).toBe(0);
    });
  });

  describe('getOptimalSessionLength', () => {
    it('should find peak accuracy bucket', () => {
      const sessions = [
        { wordsReviewed: 10, correctCount: 9, startedAt: '2024-01-01T10:00:00Z', endedAt: '2024-01-01T10:10:00Z' },
        { wordsReviewed: 10, correctCount: 8, startedAt: '2024-01-02T10:00:00Z', endedAt: '2024-01-02T10:10:00Z' },
        { wordsReviewed: 10, correctCount: 5, startedAt: '2024-01-03T10:00:00Z', endedAt: '2024-01-03T10:30:00Z' },
        { wordsReviewed: 10, correctCount: 4, startedAt: '2024-01-04T10:00:00Z', endedAt: '2024-01-04T10:30:00Z' },
      ];
      const result = getOptimalSessionLength(sessions);
      expect(result).not.toBeNull();
      expect(result.optimalMinutes).toBe(10);
      expect(result.peakAccuracy).toBeGreaterThan(50);
    });

    it('should return null for empty sessions', () => {
      expect(getOptimalSessionLength([])).toBeNull();
    });

    it('should return null when no bucket has 2+ sessions', () => {
      const sessions = [
        { wordsReviewed: 10, correctCount: 9, startedAt: '2024-01-01T10:00:00Z', endedAt: '2024-01-01T10:10:00Z' },
      ];
      expect(getOptimalSessionLength(sessions)).toBeNull();
    });
  });

  describe('getAccuracyTrend', () => {
    it('should return array of correct length', () => {
      const trend = getAccuracyTrend({}, 7);
      expect(trend.length).toBe(7);
    });

    it('should compute rolling average', () => {
      const today = new Date().toISOString().slice(0, 10);
      const dailyActivity = {
        [today]: { wordsReviewed: 10, correctCount: 8 },
      };
      const trend = getAccuracyTrend(dailyActivity, 7);
      const todayPoint = trend.find((t) => t.date === today);
      expect(todayPoint.accuracy).toBe(80);
      expect(todayPoint.rollingAverage).toBe(80); // Only 1 data point
    });

    it('should handle empty activity', () => {
      const trend = getAccuracyTrend(null, 7);
      expect(trend).toEqual([]);
    });
  });
});
