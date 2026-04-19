/**
 * loreEntriesBatch4.test.js
 * GROW-020 — Expand lore codex: 50 new entries
 */
import { describe, it, expect } from 'vitest';
import { LORE_ENTRIES_BATCH_4 } from '../loreEntriesBatch4.js';

const EXPECTED_CATEGORIES = ['history', 'mythology', 'science', 'scholars', 'world-lore'];
const VALID_RARITIES = ['common', 'uncommon', 'rare', 'legendary'];
const VALID_TRIGGER_PREFIXES = [
  'zone_visit:', 'npc_talk:', 'quest_complete:', 'word_learn:',
  'faction_tier:', 'level_reach:', 'battle_win:', 'object_interact:', 'collection',
];
const VALID_CEFR = ['A1', 'A2', 'B1', 'B2', 'C1'];

describe('LORE_ENTRIES_BATCH_4', () => {
  it('has exactly 50 entries', () => {
    expect(LORE_ENTRIES_BATCH_4).toHaveLength(50);
  });

  it('contains exactly 10 entries per category', () => {
    for (const cat of EXPECTED_CATEGORIES) {
      const count = LORE_ENTRIES_BATCH_4.filter((e) => e.category === cat).length;
      expect(count, `${cat} should have 10 entries`).toBe(10);
    }
  });

  it('all IDs are unique', () => {
    const ids = LORE_ENTRIES_BATCH_4.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all entries have required core fields', () => {
    for (const entry of LORE_ENTRIES_BATCH_4) {
      expect(entry.id, `missing id`).toBeTruthy();
      expect(entry.title, `${entry.id}: missing title`).toBeTruthy();
      expect(entry.titleArabic, `${entry.id}: missing titleArabic`).toBeTruthy();
      expect(entry.category, `${entry.id}: missing category`).toBeTruthy();
      expect(entry.content, `${entry.id}: missing content`).toBeTruthy();
      expect(entry.contentArabic, `${entry.id}: missing contentArabic`).toBeTruthy();
      expect(entry.discoveryTrigger, `${entry.id}: missing discoveryTrigger`).toBeTruthy();
      expect(entry.rarity, `${entry.id}: missing rarity`).toBeTruthy();
    }
  });

  it('all entries have valid keyTerm with arabic, english, transliteration', () => {
    for (const entry of LORE_ENTRIES_BATCH_4) {
      expect(entry.keyTerm, `${entry.id}: missing keyTerm`).toBeDefined();
      expect(entry.keyTerm.arabic, `${entry.id}: missing keyTerm.arabic`).toBeTruthy();
      expect(entry.keyTerm.english, `${entry.id}: missing keyTerm.english`).toBeTruthy();
      expect(entry.keyTerm.transliteration, `${entry.id}: missing keyTerm.transliteration`).toBeTruthy();
    }
  });

  it('all rarities are valid', () => {
    for (const entry of LORE_ENTRIES_BATCH_4) {
      expect(VALID_RARITIES, `${entry.id}: invalid rarity ${entry.rarity}`).toContain(entry.rarity);
    }
  });

  it('all discovery triggers use valid prefixes', () => {
    for (const entry of LORE_ENTRIES_BATCH_4) {
      const valid = VALID_TRIGGER_PREFIXES.some((p) => entry.discoveryTrigger.startsWith(p));
      expect(valid, `${entry.id}: invalid trigger ${entry.discoveryTrigger}`).toBe(true);
    }
  });

  it('all entries have PRD-extra fields: cefrLevel, relatedVocab, unlockCondition', () => {
    for (const entry of LORE_ENTRIES_BATCH_4) {
      expect(VALID_CEFR, `${entry.id}: invalid cefrLevel ${entry.cefrLevel}`).toContain(entry.cefrLevel);
      expect(Array.isArray(entry.relatedVocab), `${entry.id}: relatedVocab must be array`).toBe(true);
      expect(entry.unlockCondition, `${entry.id}: missing unlockCondition`).toBeTruthy();
    }
  });

  it('world-lore category entries are present', () => {
    const worldLore = LORE_ENTRIES_BATCH_4.filter((e) => e.category === 'world-lore');
    expect(worldLore.length).toBe(10);
    for (const entry of worldLore) {
      expect(entry.id).toMatch(/^world_lore_/);
    }
  });

  it('scholars category entries have scholar-specific IDs', () => {
    const scholars = LORE_ENTRIES_BATCH_4.filter((e) => e.category === 'scholars');
    expect(scholars.length).toBe(10);
    for (const entry of scholars) {
      expect(entry.id).toMatch(/^scholars_batch4_/);
    }
  });

  it('has at least one legendary entry', () => {
    const legendaries = LORE_ENTRIES_BATCH_4.filter((e) => e.rarity === 'legendary');
    expect(legendaries.length).toBeGreaterThanOrEqual(1);
  });
});
