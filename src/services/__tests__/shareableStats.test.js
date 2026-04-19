import { describe, it, expect } from 'vitest';
import {
  generateShareText,
  generateStatsSummary,
  generateWeeklyReport,
  formatStudyTime,
} from '../shareableStats.js';

describe('shareableStats', () => {
  // ============================================================
  // generateShareText
  // ============================================================

  describe('generateShareText', () => {
    it('should include the word count', () => {
      const text = generateShareText({ wordsLearned: 500, level: 15, xp: 5000, streak: 30 });
      expect(text).toContain('500');
    });

    it('should include level and streak', () => {
      const text = generateShareText({ wordsLearned: 100, level: 10, xp: 2000, streak: 14 });
      expect(text).toContain('Level 10');
      expect(text).toContain('14-day streak');
    });

    it('should include #GogoArabic hashtag', () => {
      const text = generateShareText({ wordsLearned: 50, level: 5, xp: 500, streak: 3 });
      expect(text).toContain('#GogoArabic');
    });

    it('should include #LearnArabic hashtag', () => {
      const text = generateShareText({ wordsLearned: 50, level: 5, xp: 500, streak: 3 });
      expect(text).toContain('#LearnArabic');
    });

    it('should use player name when provided', () => {
      const text = generateShareText({ name: 'Moses', wordsLearned: 100, level: 5, xp: 1000, streak: 7 });
      expect(text).toContain('Moses has');
    });

    it('should use "I\'ve" when no name provided', () => {
      const text = generateShareText({ wordsLearned: 100, level: 5, xp: 1000, streak: 7 });
      expect(text).toContain("I've");
    });

    it('should include CEFR level when provided', () => {
      const text = generateShareText({
        wordsLearned: 500,
        level: 15,
        xp: 5000,
        streak: 30,
        cefrLevel: 'A2',
      });
      expect(text).toContain('CEFR A2');
    });

    it('should estimate CEFR when not provided', () => {
      const text = generateShareText({ wordsLearned: 500, level: 15, xp: 5000, streak: 30 });
      expect(text).toContain('CEFR A2');
    });
  });

  // ============================================================
  // generateStatsSummary
  // ============================================================

  describe('generateStatsSummary', () => {
    it('should return all expected fields', () => {
      const summary = generateStatsSummary({
        level: 15,
        xp: 5000,
        wordsLearned: 500,
        wordsMastered: 100,
        streak: 30,
        quizzesCompleted: 20,
        achievementsUnlocked: 15,
        totalStudyTime: 3600,
      });

      expect(summary.level).toBe(15);
      expect(summary.xp).toBe(5000);
      expect(summary.wordsLearned).toBe(500);
      expect(summary.wordsMastered).toBe(100);
      expect(summary.streak).toBe(30);
      expect(summary.quizzesCompleted).toBe(20);
      expect(summary.achievementsUnlocked).toBe(15);
      expect(summary.totalStudyTime).toBe(3600);
      expect(summary.estimatedCefr).toBeTruthy();
      expect(summary.funFacts).toBeInstanceOf(Array);
    });

    it('should use provided CEFR level over estimate', () => {
      const summary = generateStatsSummary({
        wordsLearned: 50,
        cefrLevel: 'B1',
      });
      expect(summary.estimatedCefr).toBe('B1');
    });

    it('should estimate CEFR as A2 for 500 words', () => {
      const summary = generateStatsSummary({ wordsLearned: 500 });
      expect(summary.estimatedCefr).toBe('A2');
    });

    it('should estimate CEFR as B1 for 1000 words', () => {
      const summary = generateStatsSummary({ wordsLearned: 1000 });
      expect(summary.estimatedCefr).toBe('B1');
    });

    it('should estimate CEFR as B2 for 2000+ words', () => {
      const summary = generateStatsSummary({ wordsLearned: 2500 });
      expect(summary.estimatedCefr).toBe('B2');
    });

    it('should generate fun facts for high stats', () => {
      const summary = generateStatsSummary({
        wordsLearned: 600,
        streak: 35,
        level: 25,
        xp: 15000,
        achievementsUnlocked: 25,
      });
      expect(summary.funFacts.length).toBeGreaterThan(0);
    });

    it('should generate at least one fun fact for low stats', () => {
      const summary = generateStatsSummary({ wordsLearned: 5, streak: 1, level: 1, xp: 10 });
      expect(summary.funFacts.length).toBeGreaterThanOrEqual(1);
    });

    it('should default missing fields to safe values', () => {
      const summary = generateStatsSummary({});
      expect(summary.level).toBe(1);
      expect(summary.xp).toBe(0);
      expect(summary.wordsLearned).toBe(0);
      expect(summary.streak).toBe(0);
      expect(summary.estimatedCefr).toBeTruthy();
    });
  });

  // ============================================================
  // generateWeeklyReport
  // ============================================================

  describe('generateWeeklyReport', () => {
    it('should summarize weekly stats from history', () => {
      const playerState = { level: 10, xp: 2000, streak: 7, wordsLearned: 200 };
      const weekHistory = [
        { date: '2026-03-20', wordsLearned: 15, xpEarned: 300, timeStudied: 900 },
        { date: '2026-03-21', wordsLearned: 10, xpEarned: 200, timeStudied: 600 },
        { date: '2026-03-22', wordsLearned: 20, xpEarned: 400, timeStudied: 1200 },
      ];

      const report = generateWeeklyReport(playerState, weekHistory);

      expect(report.wordsThisWeek).toBe(45);
      expect(report.xpThisWeek).toBe(900);
      expect(report.timeThisWeek).toBe(2700);
      expect(report.daysActive).toBe(3);
      expect(report.currentStreak).toBe(7);
      expect(report.totalWordsLearned).toBe(200);
      expect(report.currentLevel).toBe(10);
    });

    it('should identify the best day', () => {
      const weekHistory = [
        { date: '2026-03-20', wordsLearned: 10, xpEarned: 200 },
        { date: '2026-03-21', wordsLearned: 30, xpEarned: 600 },
        { date: '2026-03-22', wordsLearned: 15, xpEarned: 300 },
      ];

      const report = generateWeeklyReport({}, weekHistory);
      expect(report.bestDay.date).toBe('2026-03-21');
      expect(report.bestDay.xpEarned).toBe(600);
    });

    it('should provide encouragement for 7-day activity', () => {
      const weekHistory = Array.from({ length: 7 }, (_, i) => ({
        date: `2026-03-${20 + i}`,
        wordsLearned: 5,
        xpEarned: 100,
        timeStudied: 300,
      }));

      const report = generateWeeklyReport({}, weekHistory);
      expect(report.encouragement).toContain('Perfect week');
    });

    it('should provide encouragement for 0-day activity', () => {
      const report = generateWeeklyReport({}, []);
      expect(report.encouragement).toBeTruthy();
    });

    it('should handle empty history gracefully', () => {
      const report = generateWeeklyReport({ level: 5, streak: 3 }, null);
      expect(report.wordsThisWeek).toBe(0);
      expect(report.xpThisWeek).toBe(0);
      expect(report.daysActive).toBe(0);
      expect(report.bestDay).toBeNull();
    });

    it('should handle missing playerState fields', () => {
      const report = generateWeeklyReport({}, []);
      expect(report.currentStreak).toBe(0);
      expect(report.totalWordsLearned).toBe(0);
      expect(report.currentLevel).toBe(1);
    });
  });

  // ============================================================
  // formatStudyTime
  // ============================================================

  describe('formatStudyTime', () => {
    it('should return "0m" for 0 seconds', () => {
      expect(formatStudyTime(0)).toBe('0m');
    });

    it('should return minutes for values under an hour', () => {
      expect(formatStudyTime(1800)).toBe('30m');
    });

    it('should return hours and minutes', () => {
      expect(formatStudyTime(5400)).toBe('1h 30m');
    });

    it('should return hours only when minutes are 0', () => {
      expect(formatStudyTime(7200)).toBe('2h');
    });

    it('should handle null/undefined', () => {
      expect(formatStudyTime(null)).toBe('0m');
      expect(formatStudyTime(undefined)).toBe('0m');
    });

    it('should handle negative values', () => {
      expect(formatStudyTime(-100)).toBe('0m');
    });
  });
});
