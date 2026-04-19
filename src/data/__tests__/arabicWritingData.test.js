/**
 * arabicWritingData.test.js
 *
 * Data integrity tests for Arabic writing practice data.
 * Verifies all 28 letters present, stroke data valid, words/phrases complete.
 *
 * Phase 83 — Arabic Writing Practice
 */

import { describe, it, expect } from 'vitest';
import {
  ARABIC_LETTERS,
  WRITING_EXERCISES,
  DIFFICULTY_LEVELS,
  getLetterById,
  getLettersByGroup,
  getLettersByDifficulty,
  getLetterStrokePoints,
} from '../arabicWritingData.js';

// ─── The 28 Arabic Letters ────────────────────────────────────────────────────

const EXPECTED_LETTERS = [
  'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
  'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
];

describe('ARABIC_LETTERS', () => {
  it('has exactly 28 letters', () => {
    expect(ARABIC_LETTERS).toHaveLength(28);
  });

  it('contains all 28 Arabic letters', () => {
    const letters = ARABIC_LETTERS.map((l) => l.letter);
    for (const expected of EXPECTED_LETTERS) {
      expect(letters).toContain(expected);
    }
  });

  it('all letters have unique IDs', () => {
    const ids = ARABIC_LETTERS.map((l) => l.id);
    expect(new Set(ids).size).toBe(28);
  });

  it('all letters have required fields', () => {
    const requiredFields = [
      'id', 'letter', 'name', 'nameArabic',
      'isolated', 'initial', 'medial', 'final',
      'strokeOrder', 'difficulty', 'group',
    ];

    ARABIC_LETTERS.forEach((letter) => {
      requiredFields.forEach((field) => {
        expect(letter).toHaveProperty(field);
      });
    });
  });

  it('all letters have 4 positional forms as strings', () => {
    ARABIC_LETTERS.forEach((letter) => {
      expect(typeof letter.isolated).toBe('string');
      expect(typeof letter.initial).toBe('string');
      expect(typeof letter.medial).toBe('string');
      expect(typeof letter.final).toBe('string');
      expect(letter.isolated.length).toBeGreaterThan(0);
    });
  });

  it('all strokeOrder arrays are non-empty', () => {
    ARABIC_LETTERS.forEach((letter) => {
      expect(Array.isArray(letter.strokeOrder)).toBe(true);
      expect(letter.strokeOrder.length).toBeGreaterThan(0);
    });
  });

  it('all stroke points are in normalized 0-1 range', () => {
    ARABIC_LETTERS.forEach((letter) => {
      letter.strokeOrder.forEach((stroke) => {
        expect(Array.isArray(stroke.points)).toBe(true);
        expect(stroke.points.length).toBeGreaterThanOrEqual(2);
        stroke.points.forEach((pt) => {
          expect(pt.x).toBeGreaterThanOrEqual(0);
          expect(pt.x).toBeLessThanOrEqual(1);
          expect(pt.y).toBeGreaterThanOrEqual(0);
          expect(pt.y).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  it('all strokes have a valid type', () => {
    const validTypes = ['line', 'curve'];
    ARABIC_LETTERS.forEach((letter) => {
      letter.strokeOrder.forEach((stroke) => {
        expect(validTypes).toContain(stroke.type);
      });
    });
  });

  it('difficulty is between 1 and 3', () => {
    ARABIC_LETTERS.forEach((letter) => {
      expect(letter.difficulty).toBeGreaterThanOrEqual(1);
      expect(letter.difficulty).toBeLessThanOrEqual(3);
    });
  });

  it('group is a positive integer', () => {
    ARABIC_LETTERS.forEach((letter) => {
      expect(Number.isInteger(letter.group)).toBe(true);
      expect(letter.group).toBeGreaterThan(0);
    });
  });

  it('dots array exists and entries have valid structure', () => {
    ARABIC_LETTERS.forEach((letter) => {
      expect(Array.isArray(letter.dots)).toBe(true);
      letter.dots.forEach((dot) => {
        expect(dot).toHaveProperty('x');
        expect(dot).toHaveProperty('y');
        expect(dot).toHaveProperty('count');
        expect(dot.x).toBeGreaterThanOrEqual(0);
        expect(dot.x).toBeLessThanOrEqual(1);
        expect(dot.y).toBeGreaterThanOrEqual(0);
        expect(dot.y).toBeLessThanOrEqual(1);
        expect([1, 2, 3]).toContain(dot.count);
      });
    });
  });
});

// ─── Words ────────────────────────────────────────────────────────────────────

describe('WRITING_EXERCISES.connected', () => {
  const words = WRITING_EXERCISES.connected;

  it('has at least 30 word entries', () => {
    expect(words.length).toBeGreaterThanOrEqual(30);
  });

  it('all words have required fields', () => {
    const requiredFields = ['id', 'arabic', 'english', 'transliteration', 'cefrLevel', 'letterBreakdown'];
    words.forEach((word) => {
      requiredFields.forEach((field) => {
        expect(word).toHaveProperty(field);
      });
    });
  });

  it('all words have unique IDs', () => {
    const ids = words.map((w) => w.id);
    expect(new Set(ids).size).toBe(words.length);
  });

  it('all words have valid CEFR levels', () => {
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    words.forEach((word) => {
      expect(validLevels).toContain(word.cefrLevel);
    });
  });

  it('letterBreakdown is a non-empty array of strings', () => {
    words.forEach((word) => {
      expect(Array.isArray(word.letterBreakdown)).toBe(true);
      expect(word.letterBreakdown.length).toBeGreaterThan(0);
      word.letterBreakdown.forEach((l) => {
        expect(typeof l).toBe('string');
      });
    });
  });
});

// ─── Phrases ──────────────────────────────────────────────────────────────────

describe('WRITING_EXERCISES.phrases', () => {
  const phrases = WRITING_EXERCISES.phrases;

  it('has at least 20 phrase entries', () => {
    expect(phrases.length).toBeGreaterThanOrEqual(20);
  });

  it('all phrases have required fields', () => {
    const requiredFields = ['id', 'arabic', 'english', 'transliteration', 'cefrLevel'];
    phrases.forEach((phrase) => {
      requiredFields.forEach((field) => {
        expect(phrase).toHaveProperty(field);
      });
    });
  });

  it('all phrases have unique IDs', () => {
    const ids = phrases.map((p) => p.id);
    expect(new Set(ids).size).toBe(phrases.length);
  });
});

// ─── Difficulty Levels ────────────────────────────────────────────────────────

describe('DIFFICULTY_LEVELS', () => {
  it('has exactly 3 levels', () => {
    expect(DIFFICULTY_LEVELS).toHaveLength(3);
  });

  it('levels have required fields', () => {
    DIFFICULTY_LEVELS.forEach((level) => {
      expect(level).toHaveProperty('id');
      expect(level).toHaveProperty('label');
      expect(level).toHaveProperty('labelArabic');
      expect(level).toHaveProperty('minScore');
    });
  });

  it('IDs match expected values', () => {
    const ids = DIFFICULTY_LEVELS.map((l) => l.id);
    expect(ids).toEqual(['isolated', 'connected', 'phrases']);
  });
});

// ─── Helper functions ─────────────────────────────────────────────────────────

describe('helper functions', () => {
  it('getLetterById returns correct letter', () => {
    const alif = getLetterById('alif');
    expect(alif).not.toBeNull();
    expect(alif.letter).toBe('ا');
  });

  it('getLetterById returns null for unknown ID', () => {
    expect(getLetterById('nonexistent')).toBeNull();
  });

  it('getLettersByGroup returns only letters of that group', () => {
    const group1 = getLettersByGroup(1);
    expect(group1.length).toBeGreaterThan(0);
    group1.forEach((l) => expect(l.group).toBe(1));
  });

  it('getLettersByDifficulty returns only letters of that difficulty', () => {
    const easy = getLettersByDifficulty(1);
    expect(easy.length).toBeGreaterThan(0);
    easy.forEach((l) => expect(l.difficulty).toBe(1));
  });

  it('getLetterStrokePoints returns flattened points for known letter', () => {
    const points = getLetterStrokePoints('alif');
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(0);
    points.forEach((pt) => {
      expect(pt).toHaveProperty('x');
      expect(pt).toHaveProperty('y');
    });
  });

  it('getLetterStrokePoints returns empty array for unknown letter', () => {
    expect(getLetterStrokePoints('nonexistent')).toEqual([]);
  });
});
