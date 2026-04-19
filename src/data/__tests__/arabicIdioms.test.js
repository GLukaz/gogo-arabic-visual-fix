import { describe, it, expect } from 'vitest';
import {
  ARABIC_IDIOMS,
  IDIOM_CATEGORIES,
  CATEGORY_META,
  getIdiomById,
  getIdiomsByCategory,
  getIdiomsByLevel,
  searchIdioms,
  getRandomIdiom,
} from '../arabicIdioms.js';

// ============================================================
// COUNT ASSERTIONS
// ============================================================

describe('arabicIdioms data integrity — counts', () => {
  it('has 100+ idioms total', () => {
    expect(ARABIC_IDIOMS.length).toBeGreaterThanOrEqual(100);
  });

  it('has exactly 10 categories', () => {
    expect(IDIOM_CATEGORIES).toHaveLength(10);
  });

  it('has 10+ idioms per category', () => {
    const byCat = {};
    for (const idiom of ARABIC_IDIOMS) {
      byCat[idiom.category] ??= 0;
      byCat[idiom.category]++;
    }
    for (const cat of IDIOM_CATEGORIES) {
      expect(byCat[cat] ?? 0, `${cat} has only ${byCat[cat] ?? 0}`).toBeGreaterThanOrEqual(10);
    }
  });

  it('has at least 5 idioms per CEFR level', () => {
    const byLevel = { A1: 0, A2: 0, B1: 0, B2: 0 };
    for (const idiom of ARABIC_IDIOMS) {
      byLevel[idiom.cefrLevel]++;
    }
    for (const level of ['A1', 'A2', 'B1', 'B2']) {
      expect(byLevel[level], `${level} has only ${byLevel[level]}`).toBeGreaterThanOrEqual(5);
    }
  });
});

// ============================================================
// STRUCTURE ASSERTIONS
// ============================================================

describe('arabicIdioms data integrity — structure', () => {
  it('all idioms have required fields', () => {
    for (const idiom of ARABIC_IDIOMS) {
      expect(idiom.id, `Missing id`).toBeTruthy();
      expect(idiom.category, `${idiom.id}: missing category`).toBeTruthy();
      expect(idiom.arabic, `${idiom.id}: missing arabic`).toBeTruthy();
      expect(idiom.transliteration, `${idiom.id}: missing transliteration`).toBeTruthy();
      expect(idiom.literal, `${idiom.id}: missing literal`).toBeTruthy();
      expect(idiom.meaning, `${idiom.id}: missing meaning`).toBeTruthy();
      expect(idiom.englishEquivalent, `${idiom.id}: missing englishEquivalent`).toBeTruthy();
      expect(idiom.usageExample, `${idiom.id}: missing usageExample`).toBeDefined();
      expect(idiom.usageExample.arabic, `${idiom.id}: missing usageExample.arabic`).toBeTruthy();
      expect(idiom.usageExample.english, `${idiom.id}: missing usageExample.english`).toBeTruthy();
      expect(idiom.cefrLevel, `${idiom.id}: missing cefrLevel`).toBeTruthy();
    }
  });

  it('all categories are valid', () => {
    for (const idiom of ARABIC_IDIOMS) {
      expect(
        IDIOM_CATEGORIES,
        `${idiom.id}: invalid category "${idiom.category}"`
      ).toContain(idiom.category);
    }
  });

  it('all CEFR levels are valid', () => {
    const validLevels = ['A1', 'A2', 'B1', 'B2'];
    for (const idiom of ARABIC_IDIOMS) {
      expect(
        validLevels,
        `${idiom.id}: invalid cefrLevel "${idiom.cefrLevel}"`
      ).toContain(idiom.cefrLevel);
    }
  });

  it('all IDs follow the idiom_{category}_{number} format', () => {
    const idPattern = /^idiom_[a-z]+_\d{3}$/;
    for (const idiom of ARABIC_IDIOMS) {
      expect(
        idPattern.test(idiom.id),
        `${idiom.id} does not match id pattern`
      ).toBe(true);
    }
  });
});

// ============================================================
// UNIQUENESS ASSERTIONS
// ============================================================

describe('arabicIdioms data integrity — uniqueness', () => {
  it('all IDs are unique', () => {
    const ids = ARABIC_IDIOMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('no duplicate Arabic text', () => {
    const texts = ARABIC_IDIOMS.map((i) => i.arabic);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

// ============================================================
// CATEGORY META ASSERTIONS
// ============================================================

describe('arabicIdioms data integrity — CATEGORY_META', () => {
  it('has entry for every category', () => {
    for (const cat of IDIOM_CATEGORIES) {
      expect(CATEGORY_META[cat], `Missing meta for "${cat}"`).toBeDefined();
      expect(CATEGORY_META[cat].label, `${cat}: missing label`).toBeTruthy();
      expect(CATEGORY_META[cat].labelArabic, `${cat}: missing labelArabic`).toBeTruthy();
      expect(CATEGORY_META[cat].icon, `${cat}: missing icon`).toBeTruthy();
    }
  });

  it('all category labels are unique', () => {
    const labels = Object.values(CATEGORY_META).map((m) => m.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

// ============================================================
// API FUNCTION ASSERTIONS
// ============================================================

describe('arabicIdioms API functions', () => {
  it('getIdiomById returns correct idiom', () => {
    const idiom = getIdiomById('idiom_wisdom_001');
    expect(idiom).toBeDefined();
    expect(idiom.category).toBe('wisdom');
    expect(idiom.arabic).toBeTruthy();
  });

  it('getIdiomById returns null for non-existent ID', () => {
    const idiom = getIdiomById('idiom_nonexistent_999');
    expect(idiom).toBeNull();
  });

  it('getIdiomsByCategory returns only matching idioms', () => {
    const wisdom = getIdiomsByCategory('wisdom');
    expect(wisdom.length).toBeGreaterThan(0);
    for (const idiom of wisdom) {
      expect(idiom.category).toBe('wisdom');
    }
  });

  it('getIdiomsByCategory returns empty for invalid category', () => {
    const results = getIdiomsByCategory('invalid_category');
    expect(results).toEqual([]);
  });

  it('getIdiomsByLevel returns only matching level', () => {
    const a1 = getIdiomsByLevel('A1');
    expect(a1.length).toBeGreaterThan(0);
    for (const idiom of a1) {
      expect(idiom.cefrLevel).toBe('A1');
    }
  });

  it('searchIdioms finds by Arabic text', () => {
    const results = searchIdioms('\u0635\u0628\u0631');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searchIdioms finds by English meaning', () => {
    const results = searchIdioms('patience');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searchIdioms finds by transliteration', () => {
    const results = searchIdioms('sabr');
    expect(results.length).toBeGreaterThan(0);
  });

  it('searchIdioms returns empty for invalid query', () => {
    expect(searchIdioms('')).toEqual([]);
    expect(searchIdioms(null)).toEqual([]);
    expect(searchIdioms(undefined)).toEqual([]);
  });

  it('getRandomIdiom returns an idiom', () => {
    const idiom = getRandomIdiom();
    expect(idiom).toBeDefined();
    expect(idiom.id).toBeTruthy();
  });

  it('getRandomIdiom with seed is deterministic', () => {
    const a = getRandomIdiom(42);
    const b = getRandomIdiom(42);
    expect(a.id).toBe(b.id);
  });
});
