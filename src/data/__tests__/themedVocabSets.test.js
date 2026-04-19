/**
 * themedVocabSets.test.js
 *
 * Data integrity tests for the 20 themed vocabulary sets.
 * Validates: 20 sets, 15+ words each, required fields, unique IDs.
 *
 * Phase 90 (VOCAB-SETS)
 */

import { describe, it, expect } from 'vitest';
import {
  THEMED_VOCAB_SETS,
  getVocabSetById,
  getVocabSetsByCefrLevel,
  getAllVocabSetIds,
  getVocabSetCount,
} from '../themedVocabSets.js';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'];

describe('Themed Vocab Sets — data integrity', () => {
  it('has exactly 20 sets', () => {
    expect(THEMED_VOCAB_SETS).toHaveLength(20);
  });

  it('every set has all required fields', () => {
    const requiredFields = ['id', 'title', 'titleArabic', 'cefrLevel', 'description', 'words'];

    for (const set of THEMED_VOCAB_SETS) {
      for (const field of requiredFields) {
        expect(set, `Set ${set.id} missing field: ${field}`).toHaveProperty(field);
      }
    }
  });

  it('every set has a unique ID', () => {
    const ids = THEMED_VOCAB_SETS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every set ID ends with _set', () => {
    for (const set of THEMED_VOCAB_SETS) {
      expect(set.id.endsWith('_set'), `ID ${set.id} should end with _set`).toBe(true);
    }
  });

  it('every set has a valid CEFR level', () => {
    for (const set of THEMED_VOCAB_SETS) {
      expect(VALID_LEVELS, `${set.id}: invalid level ${set.cefrLevel}`).toContain(set.cefrLevel);
    }
  });

  it('every set has at least 15 words', () => {
    for (const set of THEMED_VOCAB_SETS) {
      expect(
        set.words.length,
        `${set.id}: should have >= 15 words, has ${set.words.length}`
      ).toBeGreaterThanOrEqual(15);
    }
  });

  it('every word has required fields: arabic, english, transliteration', () => {
    for (const set of THEMED_VOCAB_SETS) {
      for (let i = 0; i < set.words.length; i++) {
        const word = set.words[i];
        const label = `${set.id} word[${i}]`;
        expect(word.arabic, `${label}: missing arabic`).toBeTruthy();
        expect(word.english, `${label}: missing english`).toBeTruthy();
        expect(word.transliteration, `${label}: missing transliteration`).toBeTruthy();
      }
    }
  });

  it('every set has non-empty title and titleArabic', () => {
    for (const set of THEMED_VOCAB_SETS) {
      expect(set.title.length, `${set.id}: empty title`).toBeGreaterThan(0);
      expect(set.titleArabic.length, `${set.id}: empty titleArabic`).toBeGreaterThan(0);
    }
  });

  it('every set has a non-empty description', () => {
    for (const set of THEMED_VOCAB_SETS) {
      expect(set.description.length, `${set.id}: empty description`).toBeGreaterThan(0);
    }
  });

  it('words within each set have unique arabic entries', () => {
    for (const set of THEMED_VOCAB_SETS) {
      const arabicWords = set.words.map((w) => w.arabic);
      const uniqueArabic = new Set(arabicWords);
      expect(
        uniqueArabic.size,
        `${set.id}: has duplicate Arabic words`
      ).toBe(arabicWords.length);
    }
  });

  it('at least half of all sets have fun facts on some words', () => {
    let setsWithFunFacts = 0;
    for (const set of THEMED_VOCAB_SETS) {
      const hasFunFact = set.words.some((w) => w.funFact && w.funFact.length > 0);
      if (hasFunFact) setsWithFunFacts++;
    }
    expect(setsWithFunFacts).toBeGreaterThanOrEqual(10);
  });

  it('fun facts are non-empty strings when present', () => {
    for (const set of THEMED_VOCAB_SETS) {
      for (const word of set.words) {
        if (word.funFact !== undefined) {
          expect(typeof word.funFact).toBe('string');
          expect(word.funFact.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('Themed Vocab Sets — helper functions', () => {
  it('getVocabSetCount returns 20', () => {
    expect(getVocabSetCount()).toBe(20);
  });

  it('getAllVocabSetIds returns 20 unique IDs', () => {
    const ids = getAllVocabSetIds();
    expect(ids).toHaveLength(20);
    expect(new Set(ids).size).toBe(20);
  });

  it('getVocabSetById returns correct set', () => {
    const set = getVocabSetById('animals_set');
    expect(set).not.toBeNull();
    expect(set.title).toBe('Animals of the Arab World');
  });

  it('getVocabSetById returns null for missing ID', () => {
    expect(getVocabSetById('nonexistent')).toBeNull();
  });

  it('getVocabSetsByCefrLevel returns matching sets', () => {
    const a1Sets = getVocabSetsByCefrLevel('A1');
    expect(a1Sets.length).toBeGreaterThanOrEqual(1);
    for (const set of a1Sets) {
      expect(set.cefrLevel).toBe('A1');
    }
  });

  it('getVocabSetsByCefrLevel returns all when no level given', () => {
    expect(getVocabSetsByCefrLevel()).toHaveLength(20);
  });
});
