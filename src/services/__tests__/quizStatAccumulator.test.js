import { describe, it, expect, beforeEach } from 'vitest';
import { recordAnswer, getStats, endSession, getStatsCount, resetStats } from '../quizStatAccumulator.js';

describe('quizStatAccumulator', () => {
  beforeEach(() => {
    resetStats();
  });

  it('returns null for question with less than 3 sessions', () => {
    recordAnswer('word1', 'ar-to-en', true);
    expect(getStats('word1', 'ar-to-en')).toBeNull();
  });

  it('returns stats after 3 sessions', () => {
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', false);
    endSession();
    const stats = getStats('word1', 'ar-to-en');
    expect(stats).not.toBeNull();
    expect(stats.percent).toBe(67); // 2/3
    expect(stats.total).toBe(3);
    expect(stats.sessions).toBe(3);
  });

  it('calculates percent correctly with mixed results', () => {
    // 3 correct, 1 wrong across 3 sessions
    recordAnswer('word1', 'ar-to-en', true);
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', false);
    endSession();
    const stats = getStats('word1', 'ar-to-en');
    expect(stats.percent).toBe(75); // 3/4
  });

  it('returns null for unknown word', () => {
    expect(getStats('nonexistent', 'ar-to-en')).toBeNull();
  });

  it('returns null for word with less than 3 total answers', () => {
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    // Only 2 total answers even though 2 sessions
    expect(getStats('word1', 'ar-to-en')).toBeNull();
  });

  it('tracks different quizTypes separately', () => {
    for (let i = 0; i < 3; i++) {
      recordAnswer('word1', 'ar-to-en', true);
      recordAnswer('word1', 'en-to-ar', false);
      endSession();
    }
    expect(getStats('word1', 'ar-to-en').percent).toBe(100);
    expect(getStats('word1', 'en-to-ar').percent).toBe(0);
  });

  it('endSession clears session so next record starts new', () => {
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    // 3 sessions, 3 answers
    const stats = getStats('word1', 'ar-to-en');
    expect(stats).not.toBeNull();
    expect(stats.sessions).toBe(3);
  });

  it('getStatsCount returns count of questions with valid stats', () => {
    expect(getStatsCount()).toBe(0);
    for (let i = 0; i < 3; i++) {
      recordAnswer('word1', 'ar-to-en', true);
      recordAnswer('word2', 'ar-to-en', true);
      endSession();
    }
    expect(getStatsCount()).toBe(2);
  });

  it('resetStats clears everything', () => {
    recordAnswer('word1', 'ar-to-en', true);
    resetStats();
    expect(getStatsCount()).toBe(0);
  });

  it('handles null/undefined wordId gracefully', () => {
    recordAnswer(null, 'ar-to-en', true);
    recordAnswer(undefined, 'ar-to-en', true);
    recordAnswer('word1', null, true);
    expect(getStatsCount()).toBe(0);
  });

  it('counts same-session answers as one session', () => {
    recordAnswer('word1', 'ar-to-en', true);
    recordAnswer('word1', 'ar-to-en', true);
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    const stats = getStats('word1', 'ar-to-en');
    expect(stats.sessions).toBe(3);
    expect(stats.total).toBe(5);
  });

  it('calculates correctly after 5 sessions with mixed results', () => {
    // Session 1: correct
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    // Session 2: wrong
    recordAnswer('word1', 'ar-to-en', false);
    endSession();
    // Session 3: correct
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    // Session 4: correct
    recordAnswer('word1', 'ar-to-en', true);
    endSession();
    // Session 5: wrong
    recordAnswer('word1', 'ar-to-en', false);
    endSession();
    const stats = getStats('word1', 'ar-to-en');
    expect(stats.percent).toBe(60); // 3/5
    expect(stats.sessions).toBe(5);
  });
});
