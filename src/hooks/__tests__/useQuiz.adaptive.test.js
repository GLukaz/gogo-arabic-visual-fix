import { describe, it, expect } from 'vitest';
import { isFsrsDue, getDistractorTier, pickDistractors } from '../useQuiz.js';
import vocabulary from '../../data/vocabularyAll.js';

describe('isFsrsDue', () => {
  it('returns true for null card', () => {
    expect(isFsrsDue(null)).toBe(true);
  });

  it('returns true for undefined card', () => {
    expect(isFsrsDue(undefined)).toBe(true);
  });

  it('returns true for card with null due', () => {
    expect(isFsrsDue({ due: null })).toBe(true);
  });

  it('returns true for card with undefined due', () => {
    expect(isFsrsDue({ due: undefined })).toBe(true);
  });

  it('returns true for overdue card (due date in past)', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    expect(isFsrsDue({ due: pastDate })).toBe(true);
  });

  it('returns true for card due right now', () => {
    const now = new Date().toISOString();
    expect(isFsrsDue({ due: now })).toBe(true);
  });

  it('returns false for future-due card', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    expect(isFsrsDue({ due: futureDate })).toBe(false);
  });
});

describe('getDistractorTier', () => {
  it('returns normal when total < 3 (insufficient sample)', () => {
    expect(getDistractorTier(0, 0)).toBe('normal');
    expect(getDistractorTier(0, 1)).toBe('normal');
    expect(getDistractorTier(0, 2)).toBe('normal');
    expect(getDistractorTier(2, 2)).toBe('normal');
  });

  it('returns easy when accuracy < 0.70', () => {
    expect(getDistractorTier(1, 5)).toBe('easy');   // 20%
    expect(getDistractorTier(2, 5)).toBe('easy');   // 40%
    expect(getDistractorTier(0, 3)).toBe('easy');   // 0%
    expect(getDistractorTier(2, 3)).toBe('easy');   // 66.7%
  });

  it('returns normal when accuracy is 0.70-0.85 (target band)', () => {
    expect(getDistractorTier(7, 10)).toBe('normal');  // 70%
    expect(getDistractorTier(4, 5)).toBe('normal');   // 80%
    expect(getDistractorTier(17, 20)).toBe('normal'); // 85%
  });

  it('returns hard when accuracy > 0.85', () => {
    expect(getDistractorTier(9, 10)).toBe('hard');   // 90%
    expect(getDistractorTier(3, 3)).toBe('hard');    // 100%
    expect(getDistractorTier(18, 20)).toBe('hard');  // 90%
  });

  it('handles edge case: exactly 0.70 is normal (not easy)', () => {
    expect(getDistractorTier(7, 10)).toBe('normal');
  });

  it('handles edge case: exactly 0.85 is normal (not hard)', () => {
    expect(getDistractorTier(17, 20)).toBe('normal');
  });
});

describe('pickDistractors', () => {
  it('returns requested number of distractors with normal tier', () => {
    const correctWord = vocabulary.find(w => w.category && w.difficulty);
    if (!correctWord) return;
    const distractors = pickDistractors(correctWord, 3, 'normal');
    expect(distractors).toHaveLength(3);
    expect(distractors.every(d => d.id !== correctWord.id)).toBe(true);
  });

  it('hard tier returns same-category distractors', () => {
    // Find a word whose category has at least 4 entries
    const catCounts = {};
    vocabulary.forEach(w => { catCounts[w.category] = (catCounts[w.category] || 0) + 1; });
    const bigCat = Object.entries(catCounts).find(([, c]) => c >= 4);
    if (!bigCat) return;
    const correctWord = vocabulary.find(w => w.category === bigCat[0]);
    const distractors = pickDistractors(correctWord, 3, 'hard');
    expect(distractors).toHaveLength(3);
    const allSameCat = distractors.every(d => d.category === correctWord.category);
    expect(allSameCat).toBe(true);
  });

  it('easy tier returns mostly cross-category distractors', () => {
    const correctWord = vocabulary.find(w => w.category);
    if (!correctWord) return;
    const distractors = pickDistractors(correctWord, 3, 'easy');
    expect(distractors).toHaveLength(3);
    const crossCat = distractors.filter(d => d.category !== correctWord.category);
    expect(crossCat.length).toBeGreaterThanOrEqual(2);
  });

  it('does not include the correct word in distractors', () => {
    const correctWord = vocabulary[0];
    ['normal', 'easy', 'hard'].forEach(tier => {
      const distractors = pickDistractors(correctWord, 3, tier);
      expect(distractors.every(d => d.id !== correctWord.id)).toBe(true);
    });
  });
});
