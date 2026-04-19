/**
 * loreEntriesBatch3.test.js
 * WIRE-011 — calligraphyStyles and goldenAgeScholars registered in lore codex
 */
import { describe, it, expect } from 'vitest';
import { LORE_ENTRIES_BATCH_3 } from '../loreEntriesBatch3.js';
import { LORE_ENTRIES, LORE_CATEGORIES, CATEGORY_META, getCategoryTotals } from '../loreEntries.js';

describe('loreEntriesBatch3 — calligraphy', () => {
  const calligraphyEntries = LORE_ENTRIES_BATCH_3.filter((e) => e.category === 'calligraphy');

  it('registers at least 6 calligraphy entries', () => {
    expect(calligraphyEntries.length).toBeGreaterThanOrEqual(6);
  });

  it('each calligraphy entry has required lore fields', () => {
    for (const entry of calligraphyEntries) {
      expect(entry.id).toMatch(/^calligraphy_/);
      expect(entry.title).toBeTruthy();
      expect(entry.titleArabic).toBeTruthy();
      expect(entry.content).toBeTruthy();
      expect(entry.keyTerm).toMatchObject({
        arabic: expect.any(String),
        english: expect.any(String),
        transliteration: expect.any(String),
      });
      expect(entry.discoveryTrigger).toBeTruthy();
      expect(entry.rarity).toBeTruthy();
    }
  });
});

describe('loreEntriesBatch3 — scholars', () => {
  const scholarEntries = LORE_ENTRIES_BATCH_3.filter((e) => e.category === 'scholars');

  it('registers scholar entries', () => {
    expect(scholarEntries.length).toBeGreaterThan(0);
  });

  it('each scholar entry has required lore fields', () => {
    for (const entry of scholarEntries) {
      expect(entry.id).toMatch(/^scholar_/);
      expect(entry.title).toBeTruthy();
      expect(entry.keyTerm.arabic).toBeTruthy();
      expect(entry.content).toBeTruthy();
    }
  });
});

describe('loreEntries — category registration', () => {
  it('includes calligraphy in LORE_CATEGORIES', () => {
    expect(LORE_CATEGORIES).toContain('calligraphy');
  });

  it('includes scholars in LORE_CATEGORIES', () => {
    expect(LORE_CATEGORIES).toContain('scholars');
  });

  it('CATEGORY_META has calligraphy metadata', () => {
    expect(CATEGORY_META.calligraphy).toBeDefined();
    expect(CATEGORY_META.calligraphy.label).toBe('Calligraphy');
    expect(CATEGORY_META.calligraphy.icon).toBeTruthy();
  });

  it('CATEGORY_META has scholars metadata', () => {
    expect(CATEGORY_META.scholars).toBeDefined();
    expect(CATEGORY_META.scholars.label).toBe('Scholars');
  });

  it('LORE_ENTRIES contains batch3 calligraphy entries', () => {
    const calligraphyInAll = LORE_ENTRIES.filter((e) => e.category === 'calligraphy');
    expect(calligraphyInAll.length).toBeGreaterThanOrEqual(6);
  });

  it('getCategoryTotals includes calligraphy and scholars', () => {
    const totals = getCategoryTotals();
    expect(totals.calligraphy).toBeGreaterThanOrEqual(6);
    expect(totals.scholars).toBeGreaterThan(0);
  });
});
