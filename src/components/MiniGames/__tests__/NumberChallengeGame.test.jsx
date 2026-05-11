import { describe, it, expect } from 'vitest';
import {
  ARABIC_NUMERALS,
  NUMBER_WORDS,
  toArabicNumerals,
  fromArabicNumerals,
  generateNumberQuestion,
  QUESTION_TYPES,
} from '../../../data/miniGames/numberChallengeData.js';

describe('numberChallengeData', () => {
  describe('ARABIC_NUMERALS', () => {
    it('has 10 entries (0-9)', () => {
      expect(Object.keys(ARABIC_NUMERALS).length).toBe(10);
    });

    it('maps western digits to Arabic-Indic numerals', () => {
      expect(ARABIC_NUMERALS[0]).toBe('٠');
      expect(ARABIC_NUMERALS[5]).toBe('٥');
      expect(ARABIC_NUMERALS[9]).toBe('٩');
    });
  });

  describe('NUMBER_WORDS', () => {
    it('covers 0-100 (101 entries)', () => {
      expect(NUMBER_WORDS.length).toBe(101);
    });

    it('first entry is zero', () => {
      expect(NUMBER_WORDS[0].value).toBe(0);
      expect(NUMBER_WORDS[0].arabic).toBe('صفر');
      expect(NUMBER_WORDS[0].english).toBe('zero');
    });

    it('last entry is 100', () => {
      const last = NUMBER_WORDS[NUMBER_WORDS.length - 1];
      expect(last.value).toBe(100);
      expect(last.arabic).toBe('مئة');
    });

    it('each entry has value, arabic, english', () => {
      NUMBER_WORDS.forEach((entry) => {
        expect(typeof entry.value).toBe('number');
        expect(entry.arabic).toBeTruthy();
        expect(entry.english).toBeTruthy();
      });
    });

    it('values are sequential from 0 to 100', () => {
      NUMBER_WORDS.forEach((entry, i) => {
        expect(entry.value).toBe(i);
      });
    });
  });

  describe('toArabicNumerals', () => {
    it('converts single digit', () => {
      expect(toArabicNumerals(5)).toBe('٥');
    });

    it('converts multi-digit number', () => {
      expect(toArabicNumerals(42)).toBe('٤٢');
    });

    it('converts zero', () => {
      expect(toArabicNumerals(0)).toBe('٠');
    });

    it('converts 100', () => {
      expect(toArabicNumerals(100)).toBe('١٠٠');
    });
  });

  describe('fromArabicNumerals', () => {
    it('converts Arabic-Indic numeral back to western', () => {
      expect(fromArabicNumerals('٥')).toBe(5);
      expect(fromArabicNumerals('٤٢')).toBe(42);
      expect(fromArabicNumerals('١٠٠')).toBe(100);
    });
  });

  describe('generateNumberQuestion', () => {
    it('generates a question with required fields', () => {
      const q = generateNumberQuestion(1);
      expect(q.type).toBeTruthy();
      expect(q.prompt).toBeTruthy();
      expect(q.promptLabel).toBeTruthy();
      expect(typeof q.correctAnswer).toBe('number');
      expect(Array.isArray(q.choices)).toBe(true);
      expect(q.choices.length).toBe(4);
    });

    it('difficulty 1: generates single-digit questions', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateNumberQuestion(1);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThanOrEqual(9);
      }
    });

    it('difficulty 2: generates two-digit questions', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateNumberQuestion(2);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(10);
        expect(q.correctAnswer).toBeLessThanOrEqual(99);
      }
    });

    it('difficulty 3: generates arithmetic questions', () => {
      const q = generateNumberQuestion(3);
      expect(q.type).toBe('arithmetic');
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
    });

    it('difficulty 4: generates word match questions', () => {
      const q = generateNumberQuestion(4);
      expect(q.type).toBe('wordMatch');
    });

    it('correct answer is always among choices', () => {
      for (let d = 1; d <= 4; d++) {
        for (let i = 0; i < 10; i++) {
          const q = generateNumberQuestion(d);
          const hasCorrect = q.choices.some((c) => c.value === q.correctAnswer);
          expect(hasCorrect).toBe(true);
        }
      }
    });

    it('all choices are unique', () => {
      for (let d = 1; d <= 4; d++) {
        for (let i = 0; i < 10; i++) {
          const q = generateNumberQuestion(d);
          const values = q.choices.map((c) => c.value);
          const unique = new Set(values);
          expect(unique.size).toBe(values.length);
        }
      }
    });
  });

  describe('QUESTION_TYPES', () => {
    it('has 4 question types', () => {
      expect(QUESTION_TYPES.length).toBe(4);
      expect(QUESTION_TYPES).toContain('identify');
      expect(QUESTION_TYPES).toContain('select');
      expect(QUESTION_TYPES).toContain('arithmetic');
      expect(QUESTION_TYPES).toContain('wordMatch');
    });
  });
});
