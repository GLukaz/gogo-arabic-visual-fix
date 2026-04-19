/**
 * dialectVariants.test.js
 * WIRE-010 — selectDialectVariants selector
 */
import { describe, it, expect, vi } from 'vitest';
import { selectDialectVariants } from '../slices/vocabularySlice.js';

vi.mock('../../data/vocabularyAll.js', () => ({
  default: [
    { id: 'word_hello', english: 'hello', arabic: 'مرحبا', transliteration: 'marhaba' },
    { id: 'word_food', english: 'food', arabic: 'طعام', transliteration: 'taam' },
    { id: 'word_rare', english: 'zzznomatch', arabic: 'نادر', transliteration: 'naadir' },
  ],
}));

// dialectComparison.js is NOT mocked — uses real data, 'hello' entry exists
describe('selectDialectVariants', () => {
  it('returns null for unknown wordId', () => {
    expect(selectDialectVariants('nonexistent_id')).toBeNull();
  });

  it('returns null when wordId is falsy', () => {
    expect(selectDialectVariants(null)).toBeNull();
    expect(selectDialectVariants('')).toBeNull();
  });

  it('returns null when word has no matching dialect entry', () => {
    const result = selectDialectVariants('word_rare');
    expect(result).toBeNull();
  });

  it('returns dialect variants for a known word (hello)', () => {
    const result = selectDialectVariants('word_hello');
    expect(result).not.toBeNull();
    expect(result.msa).toBeDefined();
    expect(result.msa.arabic).toBeDefined();
    expect(result.egyptian).toBeDefined();
    expect(result.levantine).toBeDefined();
    expect(result.gulf).toBeDefined();
  });

  it('returns entry with english field matching the word', () => {
    const result = selectDialectVariants('word_hello');
    expect(result.english.toLowerCase()).toBe('hello');
  });

  it('MSA form has arabic and transliteration', () => {
    const result = selectDialectVariants('word_hello');
    expect(result.msa.arabic).toBeTruthy();
    expect(result.msa.transliteration).toBeTruthy();
  });
});
