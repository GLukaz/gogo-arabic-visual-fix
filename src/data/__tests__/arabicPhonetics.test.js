import { describe, it, expect } from 'vitest';
import {
  ARABIC_CONSONANTS,
  ARABIC_VOWELS,
  MINIMAL_PAIRS,
  SOUND_CATEGORIES,
  getConsonantById,
  getConsonantsByArticulation,
  getMinimalPairsForLetter,
} from '../arabicPhonetics.js';

describe('arabicPhonetics data', () => {
  // ── ARABIC_CONSONANTS ───────────────────────────────────────────────────

  describe('ARABIC_CONSONANTS', () => {
    it('has exactly 28 consonants', () => {
      expect(ARABIC_CONSONANTS).toHaveLength(28);
    });

    it('every consonant has all required fields', () => {
      const requiredFields = [
        'id',
        'letter',
        'name',
        'nameArabic',
        'ipaSymbol',
        'articulationPoint',
        'articulationManner',
        'voicing',
        'englishApproximation',
        'description',
        'category',
      ];

      ARABIC_CONSONANTS.forEach((consonant) => {
        requiredFields.forEach((field) => {
          expect(consonant).toHaveProperty(field);
        });
      });
    });

    it('every consonant has a unique id', () => {
      const ids = ARABIC_CONSONANTS.map((c) => c.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('every consonant has a unique letter', () => {
      const letters = ARABIC_CONSONANTS.map((c) => c.letter);
      const unique = new Set(letters);
      expect(unique.size).toBe(letters.length);
    });

    it('every IPA symbol is wrapped in slashes', () => {
      ARABIC_CONSONANTS.forEach((c) => {
        expect(c.ipaSymbol).toMatch(/^\/.+\/$/);
      });
    });

    it('articulationPoint is one of the valid values', () => {
      const valid = [
        'bilabial',
        'dental',
        'alveolar',
        'palatal',
        'velar',
        'uvular',
        'pharyngeal',
        'glottal',
      ];
      ARABIC_CONSONANTS.forEach((c) => {
        expect(valid).toContain(c.articulationPoint);
      });
    });

    it('articulationManner is one of the valid values', () => {
      const valid = ['stop', 'fricative', 'affricate', 'nasal', 'liquid', 'glide'];
      ARABIC_CONSONANTS.forEach((c) => {
        expect(valid).toContain(c.articulationManner);
      });
    });

    it('voicing is boolean', () => {
      ARABIC_CONSONANTS.forEach((c) => {
        expect(typeof c.voicing).toBe('boolean');
      });
    });

    it('category is one of the valid values', () => {
      const valid = ['basic', 'emphatic', 'pharyngeal', 'uvular', 'glottal'];
      ARABIC_CONSONANTS.forEach((c) => {
        expect(valid).toContain(c.category);
      });
    });

    it('has exactly 4 emphatic consonants', () => {
      const emphatic = ARABIC_CONSONANTS.filter((c) => c.category === 'emphatic');
      expect(emphatic).toHaveLength(4);
    });

    it('has exactly 2 pharyngeal consonants', () => {
      const pharyngeal = ARABIC_CONSONANTS.filter((c) => c.category === 'pharyngeal');
      expect(pharyngeal).toHaveLength(2);
    });

    it('has exactly 3 uvular consonants', () => {
      const uvular = ARABIC_CONSONANTS.filter((c) => c.category === 'uvular');
      expect(uvular).toHaveLength(3);
    });

    it('has exactly 2 glottal consonants', () => {
      const glottal = ARABIC_CONSONANTS.filter((c) => c.category === 'glottal');
      expect(glottal).toHaveLength(2);
    });
  });

  // ── ARABIC_VOWELS ─────────────────────────────────────────────────────

  describe('ARABIC_VOWELS', () => {
    it('has exactly 6 vowels', () => {
      expect(ARABIC_VOWELS).toHaveLength(6);
    });

    it('every vowel has all required fields', () => {
      const requiredFields = [
        'id',
        'symbol',
        'name',
        'nameArabic',
        'ipaSymbol',
        'type',
        'englishApproximation',
        'description',
      ];

      ARABIC_VOWELS.forEach((vowel) => {
        requiredFields.forEach((field) => {
          expect(vowel).toHaveProperty(field);
        });
      });
    });

    it('has 3 short vowels and 3 long vowels', () => {
      const short = ARABIC_VOWELS.filter((v) => v.type === 'short');
      const long = ARABIC_VOWELS.filter((v) => v.type === 'long');
      expect(short).toHaveLength(3);
      expect(long).toHaveLength(3);
    });

    it('short vowels have null letter', () => {
      const short = ARABIC_VOWELS.filter((v) => v.type === 'short');
      short.forEach((v) => {
        expect(v.letter).toBeNull();
      });
    });

    it('long vowels have a letter', () => {
      const long = ARABIC_VOWELS.filter((v) => v.type === 'long');
      long.forEach((v) => {
        expect(v.letter).not.toBeNull();
        expect(typeof v.letter).toBe('string');
      });
    });

    it('every IPA symbol is wrapped in slashes', () => {
      ARABIC_VOWELS.forEach((v) => {
        expect(v.ipaSymbol).toMatch(/^\/.+\/$/);
      });
    });

    it('every vowel has a unique id', () => {
      const ids = ARABIC_VOWELS.map((v) => v.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });
  });

  // ── MINIMAL_PAIRS ─────────────────────────────────────────────────────

  describe('MINIMAL_PAIRS', () => {
    it('has at least 15 pairs', () => {
      expect(MINIMAL_PAIRS.length).toBeGreaterThanOrEqual(15);
    });

    it('every pair has all required fields', () => {
      MINIMAL_PAIRS.forEach((pair) => {
        expect(pair).toHaveProperty('id');
        expect(pair).toHaveProperty('soundA');
        expect(pair).toHaveProperty('soundB');
        expect(pair).toHaveProperty('difficulty');
        expect(pair).toHaveProperty('explanation');
      });
    });

    it('every pair has valid sound objects with id, letter, name, ipaSymbol, exampleWords', () => {
      MINIMAL_PAIRS.forEach((pair) => {
        ['soundA', 'soundB'].forEach((key) => {
          const sound = pair[key];
          expect(sound).toHaveProperty('id');
          expect(sound).toHaveProperty('letter');
          expect(sound).toHaveProperty('name');
          expect(sound).toHaveProperty('ipaSymbol');
          expect(sound).toHaveProperty('exampleWords');
          expect(Array.isArray(sound.exampleWords)).toBe(true);
          expect(sound.exampleWords.length).toBeGreaterThanOrEqual(1);
        });
      });
    });

    it('every pair references valid consonant IDs', () => {
      const consonantIds = new Set(ARABIC_CONSONANTS.map((c) => c.id));
      MINIMAL_PAIRS.forEach((pair) => {
        expect(consonantIds.has(pair.soundA.id)).toBe(true);
        expect(consonantIds.has(pair.soundB.id)).toBe(true);
      });
    });

    it('no duplicate pair IDs', () => {
      const ids = MINIMAL_PAIRS.map((p) => p.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    });

    it('difficulty is 1, 2, or 3', () => {
      MINIMAL_PAIRS.forEach((pair) => {
        expect([1, 2, 3]).toContain(pair.difficulty);
      });
    });

    it('includes pairs across all 3 difficulty levels', () => {
      const diffs = new Set(MINIMAL_PAIRS.map((p) => p.difficulty));
      expect(diffs.has(1)).toBe(true);
      expect(diffs.has(2)).toBe(true);
      expect(diffs.has(3)).toBe(true);
    });
  });

  // ── SOUND_CATEGORIES ──────────────────────────────────────────────────

  describe('SOUND_CATEGORIES', () => {
    it('has at least 4 categories', () => {
      expect(SOUND_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    });

    it('every category has all required fields', () => {
      SOUND_CATEGORIES.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('nameArabic');
        expect(cat).toHaveProperty('description');
        expect(cat).toHaveProperty('letters');
        expect(cat).toHaveProperty('difficulty');
        expect(Array.isArray(cat.letters)).toBe(true);
      });
    });

    it('all letters in categories are valid consonant IDs', () => {
      const consonantIds = new Set(ARABIC_CONSONANTS.map((c) => c.id));
      SOUND_CATEGORIES.forEach((cat) => {
        cat.letters.forEach((letterId) => {
          expect(consonantIds.has(letterId)).toBe(true);
        });
      });
    });

    it('no letter appears in multiple categories', () => {
      const seen = new Set();
      SOUND_CATEGORIES.forEach((cat) => {
        cat.letters.forEach((letterId) => {
          expect(seen.has(letterId)).toBe(false);
          seen.add(letterId);
        });
      });
    });

    it('includes emphatic, pharyngeal, uvular, and glottal categories', () => {
      const ids = SOUND_CATEGORIES.map((c) => c.id);
      expect(ids).toContain('emphatic');
      expect(ids).toContain('pharyngeal');
      expect(ids).toContain('uvular');
      expect(ids).toContain('glottal');
    });
  });

  // ── Helper functions ──────────────────────────────────────────────────

  describe('getConsonantById', () => {
    it('returns consonant for valid id', () => {
      const ba = getConsonantById('ba');
      expect(ba).toBeDefined();
      expect(ba.letter).toBe('\u0628');
    });

    it('returns undefined for invalid id', () => {
      expect(getConsonantById('nonexistent')).toBeUndefined();
    });
  });

  describe('getConsonantsByArticulation', () => {
    it('returns all bilabial consonants', () => {
      const bilabials = getConsonantsByArticulation('bilabial');
      expect(bilabials.length).toBeGreaterThanOrEqual(2);
      bilabials.forEach((c) => {
        expect(c.articulationPoint).toBe('bilabial');
      });
    });

    it('returns empty array for invalid point', () => {
      expect(getConsonantsByArticulation('nonexistent')).toHaveLength(0);
    });
  });

  describe('getMinimalPairsForLetter', () => {
    it('returns pairs containing the given letter', () => {
      const pairs = getMinimalPairsForLetter('sin');
      expect(pairs.length).toBeGreaterThanOrEqual(1);
      pairs.forEach((p) => {
        const hasLetter = p.soundA.id === 'sin' || p.soundB.id === 'sin';
        expect(hasLetter).toBe(true);
      });
    });

    it('returns empty array for letter with no pairs', () => {
      expect(getMinimalPairsForLetter('nonexistent')).toHaveLength(0);
    });
  });
});
