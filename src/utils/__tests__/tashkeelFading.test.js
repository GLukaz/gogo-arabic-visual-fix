import { describe, it, expect } from 'vitest';
import {
  getDiacriticOpacity,
  splitTashkeel,
  hasDiacritics,
  getTashkeelLevel,
  applyTashkeelFading,
  TASHKEEL_LEVEL,
} from '../tashkeelFading.js';

describe('getDiacriticOpacity', () => {
  it('returns 1.0 for null stability (new word)', () => {
    expect(getDiacriticOpacity(null)).toBe(1.0);
  });

  it('returns 1.0 for stability < 3', () => {
    expect(getDiacriticOpacity(0)).toBe(1.0);
    expect(getDiacriticOpacity(2)).toBe(1.0);
    expect(getDiacriticOpacity(2.9)).toBe(1.0);
  });

  it('returns 0.6 for stability 3-9', () => {
    expect(getDiacriticOpacity(3)).toBe(0.6);
    expect(getDiacriticOpacity(5)).toBe(0.6);
    expect(getDiacriticOpacity(9)).toBe(0.6);
  });

  it('returns 0.3 for stability 10-29', () => {
    expect(getDiacriticOpacity(10)).toBe(0.3);
    expect(getDiacriticOpacity(20)).toBe(0.3);
    expect(getDiacriticOpacity(29)).toBe(0.3);
  });

  it('returns 0 for stability >= 30 (mastered)', () => {
    expect(getDiacriticOpacity(30)).toBe(0);
    expect(getDiacriticOpacity(100)).toBe(0);
  });
});

describe('splitTashkeel', () => {
  it('splits Arabic text into base chars and diacritics', () => {
    const result = splitTashkeel('كَبِيرٌ');
    const diacritics = result.filter(r => r.isDiacritic);
    const base = result.filter(r => !r.isDiacritic);
    expect(diacritics.length).toBeGreaterThan(0);
    expect(base.length).toBe(4); // ك ب ي ر
  });

  it('returns empty array for null/empty input', () => {
    expect(splitTashkeel(null)).toEqual([]);
    expect(splitTashkeel('')).toEqual([]);
  });

  it('marks all chars as non-diacritic for plain text', () => {
    const result = splitTashkeel('كبير');
    expect(result.every(r => !r.isDiacritic)).toBe(true);
  });
});

describe('hasDiacritics', () => {
  it('returns true for text with fathah', () => {
    expect(hasDiacritics('كَبِير')).toBe(true);
  });

  it('returns false for plain Arabic', () => {
    expect(hasDiacritics('كبير')).toBe(false);
  });

  it('returns false for empty/null', () => {
    expect(hasDiacritics('')).toBe(false);
  });
});

// ─── getTashkeelLevel ─────────────────────────────────────────────────────────

const NOW = new Date('2026-02-09T00:00:00Z').getTime();
const DAY = 24 * 60 * 60 * 1000;

describe('getTashkeelLevel', () => {
  it('returns FULL when fsrsCard is null', () => {
    expect(getTashkeelLevel('w1', null, NOW)).toBe(TASHKEEL_LEVEL.FULL);
  });

  it('returns FULL when stability is null (new word)', () => {
    expect(getTashkeelLevel('w1', { stability: null }, NOW)).toBe(TASHKEEL_LEVEL.FULL);
  });

  it('returns FULL when stability < 7', () => {
    expect(getTashkeelLevel('w1', { stability: 0 }, NOW)).toBe(TASHKEEL_LEVEL.FULL);
    expect(getTashkeelLevel('w1', { stability: 6.9 }, NOW)).toBe(TASHKEEL_LEVEL.FULL);
  });

  it('returns PARTIAL when stability is exactly 7', () => {
    expect(getTashkeelLevel('w1', { stability: 7 }, NOW)).toBe(TASHKEEL_LEVEL.PARTIAL);
  });

  it('returns PARTIAL when stability is 7-30', () => {
    expect(getTashkeelLevel('w1', { stability: 15 }, NOW)).toBe(TASHKEEL_LEVEL.PARTIAL);
    expect(getTashkeelLevel('w1', { stability: 30 }, NOW)).toBe(TASHKEEL_LEVEL.PARTIAL);
  });

  it('returns NONE when stability > 30', () => {
    expect(getTashkeelLevel('w1', { stability: 31 }, NOW)).toBe(TASHKEEL_LEVEL.NONE);
    expect(getTashkeelLevel('w1', { stability: 100 }, NOW)).toBe(TASHKEEL_LEVEL.NONE);
  });

  it('recovery: lastFailDate within 3 days forces FULL even with high stability', () => {
    const recentFail = new Date(NOW - 2 * DAY).toISOString(); // 2 days ago
    expect(getTashkeelLevel('w1', { stability: 50, lastFailDate: recentFail }, NOW)).toBe(TASHKEEL_LEVEL.FULL);
  });

  it('recovery: lastFailDate as numeric timestamp within 3 days forces FULL', () => {
    const recentFail = NOW - 1 * DAY; // 1 day ago
    expect(getTashkeelLevel('w1', { stability: 50, lastFailDate: recentFail }, NOW)).toBe(TASHKEEL_LEVEL.FULL);
  });

  it('recovery: lastFailDate exactly 3 days ago does NOT force FULL', () => {
    const oldFail = NOW - 3 * DAY; // exactly 3 days ago (not within < 3 days)
    expect(getTashkeelLevel('w1', { stability: 50, lastFailDate: oldFail }, NOW)).toBe(TASHKEEL_LEVEL.NONE);
  });

  it('recovery: lastFailDate older than 3 days uses stability normally', () => {
    const oldFail = new Date(NOW - 10 * DAY).toISOString();
    expect(getTashkeelLevel('w1', { stability: 15, lastFailDate: oldFail }, NOW)).toBe(TASHKEEL_LEVEL.PARTIAL);
  });

  it('wordId parameter is accepted (reserved for future use)', () => {
    // Should not throw or alter behaviour
    expect(getTashkeelLevel('any-word-id', { stability: 8 }, NOW)).toBe(TASHKEEL_LEVEL.PARTIAL);
  });
});

// ─── applyTashkeelFading ──────────────────────────────────────────────────────

describe('applyTashkeelFading', () => {
  const FULL_WORD = 'كَبِيرٌ'; // كَ بِ ي رٌ — fathah on ك, kasra on ب, tanwin-damm on ر

  it('FULL level returns text unchanged', () => {
    expect(applyTashkeelFading(FULL_WORD, TASHKEEL_LEVEL.FULL)).toBe(FULL_WORD);
  });

  it('NONE level strips all diacritics', () => {
    const result = applyTashkeelFading(FULL_WORD, TASHKEEL_LEVEL.NONE);
    expect(hasDiacritics(result)).toBe(false);
    expect(result).toBe('كبير');
  });

  it('PARTIAL level keeps diacritics on first letter only', () => {
    const result = applyTashkeelFading(FULL_WORD, TASHKEEL_LEVEL.PARTIAL);
    // First letter كَ should keep its fathah; rest should be stripped
    expect(result).toContain('كَ');
    // The result should have fewer diacritics than original
    const origDiacCount = [...FULL_WORD].filter(c => /[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(c)).length;
    const fadedDiacCount = [...result].filter(c => /[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(c)).length;
    expect(fadedDiacCount).toBeLessThan(origDiacCount);
  });

  it('PARTIAL on multi-word text keeps first-letter diacritics per word', () => {
    const text = 'كَبِيرٌ جِدًّا'; // two words
    const result = applyTashkeelFading(text, TASHKEEL_LEVEL.PARTIAL);
    const words = result.split(' ');
    // Each word's first letter retains its immediate diacritic; subsequent letters stripped
    expect(words.length).toBe(2);
    // Neither word should be fully stripped (first letter diacritics preserved)
    expect(hasDiacritics(words[0])).toBe(true);
    expect(hasDiacritics(words[1])).toBe(true);
  });

  it('handles empty string', () => {
    expect(applyTashkeelFading('', TASHKEEL_LEVEL.NONE)).toBe('');
    expect(applyTashkeelFading('', TASHKEEL_LEVEL.FULL)).toBe('');
    expect(applyTashkeelFading('', TASHKEEL_LEVEL.PARTIAL)).toBe('');
  });

  it('NONE on text without diacritics returns same text', () => {
    expect(applyTashkeelFading('كبير', TASHKEEL_LEVEL.NONE)).toBe('كبير');
  });
});
