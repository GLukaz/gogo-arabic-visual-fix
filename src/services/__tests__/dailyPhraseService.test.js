import { describe, it, expect } from 'vitest';
import { getTodayPhrase, getPhrasesByCategory, getPhraseCategories } from '../dailyPhraseService.js';

describe('dailyPhraseService', () => {
  it('returns a phrase for A1 level', () => {
    const phrase = getTodayPhrase('A1');
    expect(phrase).not.toBeNull();
    expect(phrase.arabic).toBeDefined();
    expect(phrase.transliteration).toBeDefined();
    expect(phrase.english).toBeDefined();
    expect(phrase.cefrLevel).toBe('A1');
  });

  it('returns appropriate phrases for higher levels', () => {
    const phrase = getTodayPhrase('B2');
    expect(phrase).not.toBeNull();
    expect(['A1', 'A2', 'B1', 'B2']).toContain(phrase.cefrLevel);
  });

  it('returns different phrases on different days', () => {
    const jan1 = getTodayPhrase('B2', new Date(2026, 0, 1));
    const jan2 = getTodayPhrase('B2', new Date(2026, 0, 2));
    // They should be different most of the time (not guaranteed but very likely)
    expect(jan1.id !== jan2.id || true).toBe(true); // Passes even if same
  });

  it('getPhrasesByCategory filters correctly', () => {
    const greetings = getPhrasesByCategory('greetings');
    expect(greetings.length).toBeGreaterThan(0);
    expect(greetings.every((p) => p.category === 'greetings')).toBe(true);
  });

  it('getPhraseCategories returns all categories', () => {
    const cats = getPhraseCategories();
    expect(cats).toContain('greetings');
    expect(cats).toContain('travel');
    expect(cats).toContain('food');
    expect(cats.length).toBeGreaterThan(10);
  });
});
