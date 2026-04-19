import { describe, it, expect } from 'vitest';
import {
  normaliseArabic,
  countWordDiff,
  scoreConversationResponse,
  calculateConversationXP,
  extractVocabularyFromSentence,
} from '../conversationScoring.js';

// ─────────────────────────────────────────────────────────────────────────────
// normaliseArabic
// ─────────────────────────────────────────────────────────────────────────────

describe('normaliseArabic', () => {
  it('strips tashkeel diacritics', () => {
    // مَرْحَبًا → مرحبا
    expect(normaliseArabic('\u0645\u064E\u0631\u0652\u062D\u064E\u0628\u064B\u0627')).toBe('\u0645\u0631\u062D\u0628\u0627');
  });

  it('collapses multiple spaces', () => {
    expect(normaliseArabic('مرحبا   كيف  حالك')).toBe('مرحبا كيف حالك');
  });

  it('trims leading/trailing whitespace', () => {
    expect(normaliseArabic('  مرحبا  ')).toBe('مرحبا');
  });

  it('returns empty string for null/undefined', () => {
    expect(normaliseArabic(null)).toBe('');
    expect(normaliseArabic(undefined)).toBe('');
    expect(normaliseArabic('')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// scoreConversationResponse — exact match
// ─────────────────────────────────────────────────────────────────────────────

describe('scoreConversationResponse — exact match', () => {
  it('returns 100 for identical text', () => {
    expect(scoreConversationResponse('مرحبا', 'مرحبا')).toBe(100);
  });

  it('returns 100 when player uses diacritics but expected does not', () => {
    // مَرْحَبًا vs مرحبا — same after stripping
    expect(scoreConversationResponse('\u0645\u064E\u0631\u0652\u062D\u064E\u0628\u064B\u0627', 'مرحبا')).toBe(100);
  });

  it('returns 100 when expected has diacritics but player does not', () => {
    expect(scoreConversationResponse('مرحبا', '\u0645\u064E\u0631\u0652\u062D\u064E\u0628\u064B\u0627')).toBe(100);
  });

  it('returns 100 for multi-word exact match', () => {
    expect(scoreConversationResponse('كيف حالك', 'كيف حالك')).toBe(100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// scoreConversationResponse — word diffs
// ─────────────────────────────────────────────────────────────────────────────

describe('scoreConversationResponse — word diffs', () => {
  it('returns 80 for 1-word difference', () => {
    expect(scoreConversationResponse('أنا بخير شكرا', 'أنا بخير جيدا')).toBe(80);
  });

  it('returns 50 for 2-word difference', () => {
    expect(scoreConversationResponse('أنا طالب جيد', 'أنا معلم كبير')).toBe(50);
  });

  it('returns 25 for 3+ word difference', () => {
    expect(scoreConversationResponse('أنا لا أعرف شيئا', 'ذهبت إلى السوق')).toBe(25);
  });

  it('returns 25 for completely wrong answer', () => {
    expect(scoreConversationResponse('لا لا لا', 'نعم نعم نعم')).toBe(25);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// scoreConversationResponse — edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('scoreConversationResponse — edge cases', () => {
  it('returns 25 for empty player text', () => {
    expect(scoreConversationResponse('', 'مرحبا')).toBe(25);
  });

  it('returns 25 for null player text', () => {
    expect(scoreConversationResponse(null, 'مرحبا')).toBe(25);
  });

  it('returns 25 for null expected text', () => {
    expect(scoreConversationResponse('مرحبا', null)).toBe(25);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateConversationXP
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateConversationXP', () => {
  it('returns 100 XP for score 100', () => {
    expect(calculateConversationXP(100)).toBe(100);
  });

  it('returns 90 XP for score 80', () => {
    expect(calculateConversationXP(80)).toBe(90);
  });

  it('returns 75 XP for score 50', () => {
    expect(calculateConversationXP(50)).toBe(75);
  });

  it('returns 62 XP for score 25', () => {
    expect(calculateConversationXP(25)).toBe(62);
  });

  it('caps at 100 XP', () => {
    expect(calculateConversationXP(100)).toBeLessThanOrEqual(100);
    expect(calculateConversationXP(200)).toBeLessThanOrEqual(100);
  });

  it('returns base 50 XP for invalid input', () => {
    expect(calculateConversationXP(NaN)).toBe(50);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// extractVocabularyFromSentence
// ─────────────────────────────────────────────────────────────────────────────

describe('extractVocabularyFromSentence', () => {
  it('extracts unique Arabic words from a sentence', () => {
    const words = extractVocabularyFromSentence('كيف حالك اليوم');
    expect(words).toContain('كيف');
    expect(words).toContain('حالك');
    expect(words).toContain('اليوم');
  });

  it('strips tashkeel from extracted words', () => {
    const words = extractVocabularyFromSentence('\u0643\u064E\u064A\u0652\u0641\u064E \u062D\u064E\u0627\u0644\u064F\u0643\u064E');
    // Should contain كيف and حالك (without diacritics)
    expect(words).toContain('كيف');
    expect(words).toContain('حالك');
  });

  it('deduplicates repeated words', () => {
    const words = extractVocabularyFromSentence('مرحبا مرحبا مرحبا');
    expect(words).toHaveLength(1);
    expect(words[0]).toBe('مرحبا');
  });

  it('returns empty array for empty/null input', () => {
    expect(extractVocabularyFromSentence('')).toEqual([]);
    expect(extractVocabularyFromSentence(null)).toEqual([]);
  });

  it('strips punctuation from tokens', () => {
    const words = extractVocabularyFromSentence('مرحبا، كيف حالك؟');
    expect(words).toContain('مرحبا');
    expect(words).toContain('كيف');
    expect(words).toContain('حالك');
  });
});
