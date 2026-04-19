import { describe, it, expect } from 'vitest';
import {
  LORE_ENTRIES,
  LORE_CATEGORIES,
  CATEGORY_META,
  getLoreEntryById,
  getLoreEntriesByCategory,
  getLoreEntriesByTrigger,
  getCategoryTotals,
} from '../loreEntries.js';

describe('loreEntries data integrity', () => {
  it('has 300+ entries', () => {
    expect(LORE_ENTRIES.length).toBeGreaterThanOrEqual(300);
  });

  it('has 10 categories', () => {
    expect(LORE_CATEGORIES.length).toBeGreaterThanOrEqual(10);
  });

  it('has metadata for every category', () => {
    for (const cat of LORE_CATEGORIES) {
      expect(CATEGORY_META[cat]).toBeDefined();
      expect(CATEGORY_META[cat].icon).toBeTruthy();
      expect(CATEGORY_META[cat].label).toBeTruthy();
      expect(CATEGORY_META[cat].labelArabic).toBeTruthy();
    }
  });

  it('all entries have required fields', () => {
    for (const entry of LORE_ENTRIES) {
      expect(entry.id, `Missing id`).toBeTruthy();
      expect(entry.title, `${entry.id}: missing title`).toBeTruthy();
      expect(entry.titleArabic, `${entry.id}: missing titleArabic`).toBeTruthy();
      expect(entry.category, `${entry.id}: missing category`).toBeTruthy();
      expect(entry.content, `${entry.id}: missing content`).toBeTruthy();
      expect(entry.contentArabic, `${entry.id}: missing contentArabic`).toBeTruthy();
      expect(entry.keyTerm, `${entry.id}: missing keyTerm`).toBeDefined();
      expect(entry.keyTerm.arabic, `${entry.id}: missing keyTerm.arabic`).toBeTruthy();
      expect(entry.keyTerm.english, `${entry.id}: missing keyTerm.english`).toBeTruthy();
      expect(entry.keyTerm.transliteration, `${entry.id}: missing keyTerm.transliteration`).toBeTruthy();
      expect(entry.discoveryTrigger, `${entry.id}: missing discoveryTrigger`).toBeTruthy();
      expect(entry.rarity, `${entry.id}: missing rarity`).toBeTruthy();
    }
  });

  it('all IDs are unique', () => {
    const ids = LORE_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all categories are valid', () => {
    for (const entry of LORE_ENTRIES) {
      expect(LORE_CATEGORIES).toContain(entry.category);
    }
  });

  it('all rarities are valid', () => {
    const validRarities = ['common', 'uncommon', 'rare', 'legendary'];
    for (const entry of LORE_ENTRIES) {
      expect(validRarities, `${entry.id}: invalid rarity ${entry.rarity}`).toContain(entry.rarity);
    }
  });

  it('has at least 25 entries per category', () => {
    const totals = getCategoryTotals();
    // Original 10 categories require 25+; new extension categories require 1+
    const newCategories = new Set(['calligraphy', 'scholars', 'world-lore']);
    for (const cat of LORE_CATEGORIES) {
      const min = newCategories.has(cat) ? 1 : 25;
      expect(totals[cat], `${cat} has only ${totals[cat]}`).toBeGreaterThanOrEqual(min);
    }
  });

  it('has legendary entries', () => {
    const legendaries = LORE_ENTRIES.filter((e) => e.rarity === 'legendary');
    expect(legendaries.length).toBeGreaterThanOrEqual(10);
  });

  it('getLoreEntryById returns correct entry', () => {
    const entry = getLoreEntryById('mythology_001');
    expect(entry).toBeDefined();
    expect(entry.category).toBe('mythology');
  });

  it('getLoreEntryById returns null for unknown', () => {
    expect(getLoreEntryById('nonexistent')).toBeNull();
  });

  it('getLoreEntriesByCategory filters correctly', () => {
    const science = getLoreEntriesByCategory('science');
    expect(science.length).toBeGreaterThanOrEqual(25);
    expect(science.every((e) => e.category === 'science')).toBe(true);
  });

  it('getLoreEntriesByTrigger filters correctly', () => {
    const zoneEntries = getLoreEntriesByTrigger('zone_visit:oasis-village');
    expect(zoneEntries.length).toBeGreaterThan(0);
    expect(zoneEntries.every((e) => e.discoveryTrigger === 'zone_visit:oasis-village')).toBe(true);
  });

  it('discovery triggers follow valid format', () => {
    const validPrefixes = ['zone_visit:', 'npc_talk:', 'quest_complete:', 'word_learn:', 'faction_tier:', 'level_reach:', 'battle_win:', 'object_interact:', 'collection'];
    for (const entry of LORE_ENTRIES) {
      const valid = validPrefixes.some((p) => entry.discoveryTrigger.startsWith(p));
      expect(valid, `${entry.id}: invalid trigger ${entry.discoveryTrigger}`).toBe(true);
    }
  });
});
