import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getVocabMasteryDistribution,
  getStrugglingWords,
  getStudyTimeDistribution,
  getLearningVelocity,
  getQuizPerformanceByType,
  getGrammarMasteryByCategory,
  getLearningRecommendations,
  getTimeToNextCefr,
  generateStudyReport,
} from '../learningAnalytics.js';

// ============================================================
// getVocabMasteryDistribution
// ============================================================

describe('getVocabMasteryDistribution', () => {
  it('returns zeros for null vocabulary state', () => {
    const result = getVocabMasteryDistribution(null);
    expect(result).toEqual({ mastered: 0, learning: 0, new: 0, struggling: 0 });
  });

  it('returns zeros for empty fsrsCards', () => {
    const result = getVocabMasteryDistribution({ fsrsCards: {} });
    expect(result).toEqual({ mastered: 0, learning: 0, new: 0, struggling: 0 });
  });

  it('classifies words by accuracy', () => {
    const vocab = {
      fsrsCards: {
        kitab: { card: {} },
        qalam: { card: {} },
        bayt: { card: {} },
        shams: { card: {} },
        qamar: { card: {} },
      },
    };

    const accuracy = {
      kitab: { correct: 9, total: 10 },  // 90% => mastered
      qalam: { correct: 7, total: 10 },  // 70% => learning
      bayt: { correct: 3, total: 10 },   // 30% => struggling
      shams: { correct: 0, total: 0 },   // 0 attempts => new
      // qamar not in accuracy => new
    };

    const result = getVocabMasteryDistribution(vocab, accuracy);
    expect(result.mastered).toBe(1);
    expect(result.learning).toBe(1);
    expect(result.struggling).toBe(1);
    expect(result.new).toBe(2);
  });

  it('handles missing wordAccuracy parameter', () => {
    const vocab = { fsrsCards: { a: {}, b: {} } };
    const result = getVocabMasteryDistribution(vocab);
    expect(result.new).toBe(2);
  });
});

// ============================================================
// getStrugglingWords
// ============================================================

describe('getStrugglingWords', () => {
  it('returns empty array for null input', () => {
    expect(getStrugglingWords(null)).toEqual([]);
    expect(getStrugglingWords(undefined)).toEqual([]);
  });

  it('filters out words with fewer than 2 attempts', () => {
    const accuracy = {
      kitab: { correct: 0, total: 1 },
    };
    expect(getStrugglingWords(accuracy)).toEqual([]);
  });

  it('returns words sorted by accuracy ascending', () => {
    const accuracy = {
      kitab: { correct: 1, total: 10 },  // 10%
      qalam: { correct: 5, total: 10 },  // 50%
      bayt: { correct: 3, total: 10 },   // 30%
    };

    const result = getStrugglingWords(accuracy, 10);
    expect(result).toHaveLength(3);
    expect(result[0].wordId).toBe('kitab');
    expect(result[0].accuracy).toBeCloseTo(0.1);
    expect(result[1].wordId).toBe('bayt');
    expect(result[2].wordId).toBe('qalam');
  });

  it('respects limit parameter', () => {
    const accuracy = {
      a: { correct: 1, total: 10 },
      b: { correct: 2, total: 10 },
      c: { correct: 3, total: 10 },
    };

    const result = getStrugglingWords(accuracy, 2);
    expect(result).toHaveLength(2);
  });

  it('returns empty for non-object input', () => {
    expect(getStrugglingWords('not an object')).toEqual([]);
  });
});

// ============================================================
// getStudyTimeDistribution
// ============================================================

describe('getStudyTimeDistribution', () => {
  it('returns zeros for empty sessions', () => {
    const result = getStudyTimeDistribution([]);
    expect(result.quizzes).toBe(0);
    expect(result.review).toBe(0);
  });

  it('returns zeros for non-array input', () => {
    const result = getStudyTimeDistribution(null);
    expect(result.quizzes).toBe(0);
  });

  it('distributes time by session type', () => {
    const sessions = [
      {
        type: 'quiz',
        startedAt: '2026-03-24T10:00:00Z',
        endedAt: '2026-03-24T10:30:00Z',
      },
      {
        type: 'review',
        startedAt: '2026-03-24T11:00:00Z',
        endedAt: '2026-03-24T11:15:00Z',
      },
      {
        type: 'grammar',
        startedAt: '2026-03-24T12:00:00Z',
        endedAt: '2026-03-24T12:20:00Z',
      },
    ];

    const result = getStudyTimeDistribution(sessions);
    expect(result.quizzes).toBe(30);
    expect(result.review).toBe(15);
    expect(result.grammar).toBe(20);
  });

  it('skips sessions without timestamps', () => {
    const sessions = [
      { type: 'quiz' },
      { type: 'review', startedAt: '2026-03-24T10:00:00Z' },
    ];

    const result = getStudyTimeDistribution(sessions);
    expect(result.quizzes).toBe(0);
    expect(result.review).toBe(0);
  });

  it('maps unknown types to other', () => {
    const sessions = [
      {
        type: 'alphabet',
        startedAt: '2026-03-24T10:00:00Z',
        endedAt: '2026-03-24T10:10:00Z',
      },
    ];

    const result = getStudyTimeDistribution(sessions);
    expect(result.other).toBe(10);
  });
});

// ============================================================
// getLearningVelocity
// ============================================================

describe('getLearningVelocity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00Z'));
  });

  it('returns empty array for null input', () => {
    vi.useRealTimers();
    expect(getLearningVelocity(null)).toEqual([]);
  });

  it('returns N entries for N days', () => {
    const result = getLearningVelocity({}, 7);
    expect(result).toHaveLength(7);
  });

  it('fills in activity data for matching dates', () => {
    const dailyActivity = {
      '2026-03-27': { wordsReviewed: 15, timeSpentMs: 900000 },
      '2026-03-26': { wordsReviewed: 10, timeSpentMs: 600000 },
    };

    const result = getLearningVelocity(dailyActivity, 3);
    const today = result.find((d) => d.date === '2026-03-27');
    expect(today.wordsLearned).toBe(15);
    expect(today.minutesStudied).toBe(15);

    vi.useRealTimers();
  });

  it('returns 0 for dates without activity', () => {
    const result = getLearningVelocity({}, 3);
    expect(result.every((d) => d.wordsLearned === 0)).toBe(true);

    vi.useRealTimers();
  });
});

// ============================================================
// getQuizPerformanceByType
// ============================================================

describe('getQuizPerformanceByType', () => {
  it('returns empty object for non-array input', () => {
    expect(getQuizPerformanceByType(null)).toEqual({});
  });

  it('aggregates performance by type', () => {
    const sessions = [
      {
        type: 'review',
        wordsReviewed: 10,
        correctCount: 8,
        startedAt: '2026-03-24T10:00:00Z',
        endedAt: '2026-03-24T10:10:00Z',
      },
      {
        type: 'review',
        wordsReviewed: 20,
        correctCount: 15,
        startedAt: '2026-03-24T11:00:00Z',
        endedAt: '2026-03-24T11:20:00Z',
      },
      {
        type: 'quiz',
        wordsReviewed: 10,
        correctCount: 9,
        startedAt: '2026-03-24T12:00:00Z',
        endedAt: '2026-03-24T12:05:00Z',
      },
    ];

    const result = getQuizPerformanceByType(sessions);
    expect(result.review.attempts).toBe(2);
    expect(result.review.accuracy).toBeCloseTo(23 / 30); // (8+15)/(10+20)
    expect(result.quiz.attempts).toBe(1);
    expect(result.quiz.accuracy).toBeCloseTo(0.9);
  });

  it('handles sessions without times', () => {
    const sessions = [{ type: 'quiz', wordsReviewed: 5, correctCount: 3 }];
    const result = getQuizPerformanceByType(sessions);
    expect(result.quiz.averageTime).toBe(0);
  });
});

// ============================================================
// getGrammarMasteryByCategory
// ============================================================

describe('getGrammarMasteryByCategory', () => {
  it('returns zeros for null state', () => {
    const result = getGrammarMasteryByCategory(null);
    expect(result).toEqual({ completed: 0, total: 0, averageScore: 0 });
  });

  it('calculates completion and average score', () => {
    const grammar = {
      completedLessons: ['al-definite', 'pronouns'],
      unlockedLessons: ['al-definite', 'pronouns', 'verbs'],
      lessonScores: {
        'al-definite': { quizScore: 80, exerciseScore: 70, attempts: 2, lastAttempt: null },
        pronouns: { quizScore: 90, exerciseScore: 85, attempts: 1, lastAttempt: null },
      },
    };

    const result = getGrammarMasteryByCategory(grammar);
    expect(result.completed).toBe(2);
    expect(result.total).toBe(3);
    expect(result.averageScore).toBe(85); // (80+90)/2
  });

  it('handles no quiz scores', () => {
    const grammar = {
      completedLessons: [],
      unlockedLessons: ['al-definite'],
      lessonScores: {},
    };

    const result = getGrammarMasteryByCategory(grammar);
    expect(result.averageScore).toBe(0);
  });
});

// ============================================================
// getLearningRecommendations
// ============================================================

describe('getLearningRecommendations', () => {
  it('returns at least one recommendation for null state', () => {
    const result = getLearningRecommendations(null);
    expect(result.length).toBeGreaterThan(0);
  });

  it('recommends review for struggling words', () => {
    const state = {
      wordAccuracy: {
        kitab: { correct: 1, total: 10 },
        qalam: { correct: 2, total: 10 },
      },
      vocabularyCount: 50,
      grammarCompleted: 5,
      readingCompleted: 5,
      conversationCompleted: 5,
      currentStreak: 3,
      sessionsCount: 10,
    };

    const result = getLearningRecommendations(state);
    expect(result.some((r) => r.type === 'review')).toBe(true);
  });

  it('recommends vocabulary growth for low word count', () => {
    const state = {
      wordAccuracy: {},
      vocabularyCount: 10,
      grammarCompleted: 5,
      readingCompleted: 5,
      conversationCompleted: 5,
      currentStreak: 3,
      sessionsCount: 10,
    };

    const result = getLearningRecommendations(state);
    expect(result.some((r) => r.type === 'explore')).toBe(true);
  });

  it('includes Arabic descriptions', () => {
    const result = getLearningRecommendations({});
    result.forEach((r) => {
      expect(r.descriptionArabic).toBeDefined();
      expect(r.descriptionArabic.length).toBeGreaterThan(0);
    });
  });

  it('returns sorted by priority', () => {
    const result = getLearningRecommendations({});
    for (let i = 1; i < result.length; i++) {
      expect(result[i].priority).toBeGreaterThanOrEqual(result[i - 1].priority);
    }
  });
});

// ============================================================
// getTimeToNextCefr
// ============================================================

describe('getTimeToNextCefr', () => {
  it('returns A1 as next for null current level', () => {
    const result = getTimeToNextCefr({});
    expect(result.currentLevel).toBeNull();
    expect(result.nextLevel).toBe('A1');
  });

  it('returns null next for B2 (highest)', () => {
    const result = getTimeToNextCefr({ currentLevel: 'B2' });
    expect(result.nextLevel).toBeNull();
    expect(result.confidence).toBe('high');
  });

  it('estimates days based on velocity', () => {
    const velocity = Array.from({ length: 14 }, (_, i) => ({
      date: `2026-03-${String(14 + i).padStart(2, '0')}`,
      wordsLearned: 10,
      minutesStudied: 15,
    }));

    const result = getTimeToNextCefr({ currentLevel: 'A1' }, velocity);
    expect(result.currentLevel).toBe('A1');
    expect(result.nextLevel).toBe('A2');
    expect(result.estimatedDays).toBeGreaterThan(0);
    expect(result.confidence).toBe('high');
  });

  it('returns low confidence with no velocity data', () => {
    const result = getTimeToNextCefr({ currentLevel: 'A1' }, []);
    expect(result.confidence).toBe('low');
  });
});

// ============================================================
// generateStudyReport
// ============================================================

describe('generateStudyReport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00Z'));
  });

  it('returns a report with all required fields', () => {
    const report = generateStudyReport({});
    expect(report.period).toBe('weekly');
    expect(report.startDate).toBeDefined();
    expect(report.endDate).toBeDefined();
    expect(report.wordsReviewed).toBeDefined();
    expect(report.averageAccuracy).toBeDefined();
    expect(report.recommendations).toBeDefined();
    expect(report.highlights).toBeDefined();

    vi.useRealTimers();
  });

  it('aggregates daily activity within the period', () => {
    const report = generateStudyReport({
      dailyActivity: {
        '2026-03-25': { wordsReviewed: 20, lessonsCompleted: 1, sessionCount: 2, timeSpentMs: 1200000 },
        '2026-03-26': { wordsReviewed: 15, lessonsCompleted: 0, sessionCount: 1, timeSpentMs: 900000 },
        '2026-01-01': { wordsReviewed: 100, lessonsCompleted: 5, sessionCount: 10, timeSpentMs: 5000000 },
      },
      sessions: [],
      wordAccuracy: {},
    });

    expect(report.wordsReviewed).toBe(35); // 20+15, excluding Jan 1
    expect(report.studyMinutes).toBe(35);  // (1200000+900000)/60000 = 35

    vi.useRealTimers();
  });

  it('generates monthly report when specified', () => {
    const report = generateStudyReport({}, 'monthly');
    expect(report.period).toBe('monthly');

    vi.useRealTimers();
  });

  it('adds highlight for high accuracy', () => {
    const sessions = [
      {
        type: 'review',
        startedAt: '2026-03-25T10:00:00Z',
        endedAt: '2026-03-25T10:10:00Z',
        wordsReviewed: 10,
        correctCount: 10,
      },
    ];

    const report = generateStudyReport({
      dailyActivity: {},
      sessions,
      wordAccuracy: {},
    });

    expect(report.averageAccuracy).toBe(100);
    expect(report.highlights.some((h) => h.includes('accuracy'))).toBe(true);

    vi.useRealTimers();
  });
});
