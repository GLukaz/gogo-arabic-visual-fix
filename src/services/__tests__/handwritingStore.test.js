import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveAttempt,
  getLetterStats,
  getWeakLetters,
  getDirectionErrors,
  getHandwritingSummary,
  clearHandwritingData,
  loadHandwritingData,
} from '../handwritingStore.js';

// Mock localStorage
const storage = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => storage[key] ?? null),
  setItem: vi.fn((key, val) => { storage[key] = val; }),
  removeItem: vi.fn((key) => { delete storage[key]; }),
});

describe('handwritingStore', () => {
  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  });

  it('saves an attempt and returns stats', () => {
    const stats = saveAttempt('alif', { accuracy: 80, direction: 'correct', mistakes: ['stroke_order'] });
    expect(stats).not.toBeNull();
    expect(stats.attempts).toBe(1);
    expect(stats.totalAccuracy).toBe(80);
    expect(stats.directionCorrect).toBe(1);
    expect(stats.mistakeCounts.stroke_order).toBe(1);
  });

  it('accumulates multiple attempts', () => {
    saveAttempt('ba', { accuracy: 60, direction: 'ltr' });
    saveAttempt('ba', { accuracy: 90, direction: 'correct' });
    const stats = getLetterStats('ba');
    expect(stats.attempts).toBe(2);
    expect(stats.averageAccuracy).toBe(75);
    expect(stats.bestAccuracy).toBe(90);
    expect(stats.directionErrorRate).toBe(50);
  });

  it('returns null for unknown letter', () => {
    expect(getLetterStats('unknown')).toBeNull();
  });

  it('getWeakLetters returns weakest first', () => {
    saveAttempt('alif', { accuracy: 90, direction: 'correct' });
    saveAttempt('alif', { accuracy: 85, direction: 'correct' });
    saveAttempt('ba', { accuracy: 30, direction: 'ltr' });
    saveAttempt('ba', { accuracy: 40, direction: 'ltr' });
    const weak = getWeakLetters();
    expect(weak[0].letterId).toBe('ba');
  });

  it('getDirectionErrors identifies letters with RTL issues', () => {
    for (let i = 0; i < 5; i++) saveAttempt('jim', { accuracy: 50, direction: 'ltr' });
    const errors = getDirectionErrors(30);
    expect(errors.length).toBe(1);
    expect(errors[0].letterId).toBe('jim');
    expect(errors[0].errorRate).toBe(100);
  });

  it('getHandwritingSummary aggregates correctly', () => {
    saveAttempt('alif', { accuracy: 85, direction: 'correct' });
    for (let i = 0; i < 5; i++) saveAttempt('ba', { accuracy: 82, direction: 'correct' });
    const summary = getHandwritingSummary();
    expect(summary.lettersAttempted).toBe(2);
    expect(summary.totalAttempts).toBe(6);
    expect(summary.mastered).toBe(1); // ba has 5 attempts and avg >= 80
  });

  it('clearHandwritingData removes all data', () => {
    saveAttempt('alif', { accuracy: 90, direction: 'correct' });
    clearHandwritingData();
    expect(loadHandwritingData()).toEqual({});
  });
});
