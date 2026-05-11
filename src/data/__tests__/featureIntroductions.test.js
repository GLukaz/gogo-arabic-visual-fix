import { describe, it, expect } from 'vitest';
import {
  FEATURE_INTRODUCTIONS,
  getFeatureIntroById,
  getIntrosForLevel,
  getAllFeatureIds,
} from '../featureIntroductions.js';

// ============================================================
// FEATURE_INTRODUCTIONS — data integrity
// ============================================================

describe('FEATURE_INTRODUCTIONS', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(FEATURE_INTRODUCTIONS)).toBe(true);
    expect(FEATURE_INTRODUCTIONS.length).toBeGreaterThanOrEqual(20);
  });

  it('every entry has all required fields', () => {
    FEATURE_INTRODUCTIONS.forEach((intro) => {
      expect(intro).toHaveProperty('id');
      expect(intro).toHaveProperty('triggerLevel');
      expect(intro).toHaveProperty('title');
      expect(intro).toHaveProperty('titleArabic');
      expect(intro).toHaveProperty('description');
      expect(intro).toHaveProperty('steps');
      expect(intro).toHaveProperty('feature');
      expect(typeof intro.id).toBe('string');
      expect(typeof intro.triggerLevel).toBe('number');
      expect(typeof intro.title).toBe('string');
      expect(typeof intro.titleArabic).toBe('string');
      expect(typeof intro.description).toBe('string');
      expect(typeof intro.feature).toBe('string');
      expect(Array.isArray(intro.steps)).toBe(true);
    });
  });

  it('every entry has at least one step', () => {
    FEATURE_INTRODUCTIONS.forEach((intro) => {
      expect(intro.steps.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('every step has text and textArabic', () => {
    FEATURE_INTRODUCTIONS.forEach((intro) => {
      intro.steps.forEach((step, _idx) => {
        expect(typeof step.text).toBe('string');
        expect(step.text.length).toBeGreaterThan(0);
        expect(typeof step.textArabic).toBe('string');
        expect(step.textArabic.length).toBeGreaterThan(0);
      });
    });
  });

  it('all IDs are unique', () => {
    const ids = FEATURE_INTRODUCTIONS.map((intro) => intro.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all triggerLevels are positive integers', () => {
    FEATURE_INTRODUCTIONS.forEach((intro) => {
      expect(Number.isInteger(intro.triggerLevel)).toBe(true);
      expect(intro.triggerLevel).toBeGreaterThanOrEqual(1);
    });
  });

  it('entries are sorted by triggerLevel (ascending)', () => {
    for (let i = 1; i < FEATURE_INTRODUCTIONS.length; i++) {
      expect(FEATURE_INTRODUCTIONS[i].triggerLevel).toBeGreaterThanOrEqual(
        FEATURE_INTRODUCTIONS[i - 1].triggerLevel
      );
    }
  });

  it('Arabic title text contains Arabic characters', () => {
    const arabicPattern = /[\u0600-\u06FF]/;
    FEATURE_INTRODUCTIONS.forEach((intro) => {
      expect(arabicPattern.test(intro.titleArabic)).toBe(true);
    });
  });

  it('covers levels 1 through 15', () => {
    const levels = new Set(FEATURE_INTRODUCTIONS.map((intro) => intro.triggerLevel));
    expect(levels.has(1)).toBe(true);
    expect(levels.has(15)).toBe(true);
  });
});

// ============================================================
// getFeatureIntroById
// ============================================================

describe('getFeatureIntroById', () => {
  it('returns the correct intro for a valid ID', () => {
    const intro = getFeatureIntroById('intro_basic_quiz');
    expect(intro).not.toBeNull();
    expect(intro.id).toBe('intro_basic_quiz');
    expect(intro.feature).toBe('quiz');
  });

  it('returns null for an unknown ID', () => {
    expect(getFeatureIntroById('nonexistent_id')).toBeNull();
  });
});

// ============================================================
// getIntrosForLevel
// ============================================================

describe('getIntrosForLevel', () => {
  it('returns all level-1 intros for level 1', () => {
    const intros = getIntrosForLevel(1);
    expect(intros.length).toBeGreaterThan(0);
    intros.forEach((intro) => {
      expect(intro.triggerLevel).toBeLessThanOrEqual(1);
    });
  });

  it('returns more intros at higher levels', () => {
    const level1 = getIntrosForLevel(1);
    const level5 = getIntrosForLevel(5);
    const level15 = getIntrosForLevel(15);
    expect(level5.length).toBeGreaterThan(level1.length);
    expect(level15.length).toBeGreaterThan(level5.length);
  });

  it('returns all intros at max level', () => {
    const maxLevel = Math.max(...FEATURE_INTRODUCTIONS.map((i) => i.triggerLevel));
    const all = getIntrosForLevel(maxLevel);
    expect(all.length).toBe(FEATURE_INTRODUCTIONS.length);
  });
});

// ============================================================
// getAllFeatureIds
// ============================================================

describe('getAllFeatureIds', () => {
  it('returns a non-empty array of unique strings', () => {
    const ids = getAllFeatureIds();
    expect(ids.length).toBeGreaterThan(0);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
    ids.forEach((id) => expect(typeof id).toBe('string'));
  });
});
