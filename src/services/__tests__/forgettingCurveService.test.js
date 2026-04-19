import { describe, it, expect } from 'vitest';
import {
  getUrgentReviewList,
  getDecayingWords,
  getRetentionForecast,
  getRetentionHealth,
} from '../forgettingCurveService.js';

describe('forgettingCurveService', () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const mockCards = {
    word_overdue_7d: { card: { due: lastWeek.toISOString(), stability: 2 } },
    word_overdue_1d: { card: { due: yesterday.toISOString(), stability: 5 } },
    word_due_tomorrow: { card: { due: tomorrow.toISOString(), stability: 14 } },
    word_new: { card: { due: null, stability: 0 } },
    word_healthy: { card: { due: tomorrow.toISOString(), stability: 30 } },
  };

  describe('getUrgentReviewList', () => {
    it('should return overdue words sorted by urgency', () => {
      const urgent = getUrgentReviewList(mockCards);
      expect(urgent.length).toBe(2);
      expect(urgent[0].wordId).toBe('word_overdue_7d');
      expect(urgent[0].overdueDays).toBeGreaterThan(6);
    });

    it('should respect limit', () => {
      const urgent = getUrgentReviewList(mockCards, 1);
      expect(urgent.length).toBe(1);
    });

    it('should handle empty input', () => {
      expect(getUrgentReviewList({})).toEqual([]);
      expect(getUrgentReviewList(null)).toEqual([]);
    });
  });

  describe('getDecayingWords', () => {
    it('should return words with stability below threshold', () => {
      const decaying = getDecayingWords(mockCards, 3);
      expect(decaying.length).toBe(1);
      expect(decaying[0].wordId).toBe('word_overdue_7d');
    });

    it('should sort by stability ascending', () => {
      const decaying = getDecayingWords(mockCards, 10);
      for (let i = 1; i < decaying.length; i++) {
        expect(decaying[i].stability).toBeGreaterThanOrEqual(decaying[i - 1].stability);
      }
    });
  });

  describe('getRetentionForecast', () => {
    it('should return forecast array with correct length', () => {
      const forecast = getRetentionForecast(mockCards, 7);
      expect(forecast.length).toBe(7);
    });

    it('should have cumulative due count', () => {
      const forecast = getRetentionForecast(mockCards, 7);
      for (let i = 1; i < forecast.length; i++) {
        expect(forecast[i].cumulativeDue).toBeGreaterThanOrEqual(forecast[i - 1].cumulativeDue);
      }
    });

    it('day 0 should include backlog', () => {
      const forecast = getRetentionForecast(mockCards, 3);
      expect(forecast[0].dueCount).toBeGreaterThanOrEqual(2); // 2 overdue words
    });
  });

  describe('getRetentionHealth', () => {
    it('should categorize words correctly', () => {
      const health = getRetentionHealth(mockCards);
      expect(health.overdue).toBe(2);
      expect(health.healthy).toBeGreaterThanOrEqual(1);
      expect(health.total).toBe(4); // Excludes word_new (stability 0)
    });

    it('should return 100% health for empty cards', () => {
      expect(getRetentionHealth({}).healthPercentage).toBe(100);
    });
  });
});
