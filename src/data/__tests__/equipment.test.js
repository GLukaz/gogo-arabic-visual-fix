import { describe, it, expect } from 'vitest';
import { EQUIPMENT_DATA, EQUIPMENT_SLOTS, RARITY_TIERS } from '../equipment.js';
import { AFFIXES } from '../affixes.js';
import { ITEM_SETS } from '../itemSets.js';

describe('equipment data integrity', () => {
  it('all items have valid slot from EQUIPMENT_SLOTS', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!EQUIPMENT_SLOTS.includes(item.slot)) {
        invalidItems.push(`${itemId}: invalid slot '${item.slot}'`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all items have valid rarity from RARITY_TIERS', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!RARITY_TIERS[item.rarity]) {
        invalidItems.push(`${itemId}: invalid rarity '${item.rarity}'`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all item affixes reference valid wordIds in AFFIXES', () => {
    const invalidAffixes = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (item.affixes && item.affixes.length > 0) {
        for (const affix of item.affixes) {
          if (!AFFIXES[affix.wordId]) {
            invalidAffixes.push(`${itemId}: invalid affix '${affix.wordId}'`);
          }
        }
      }
    }

    expect(invalidAffixes).toEqual([]);
  });

  it('all set items reference valid setIds in ITEM_SETS', () => {
    const invalidSets = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (item.setId && !ITEM_SETS[item.setId]) {
        invalidSets.push(`${itemId}: invalid setId '${item.setId}'`);
      }
    }

    expect(invalidSets).toEqual([]);
  });

  it('all items have sellPrice > 0', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!item.sellPrice || item.sellPrice <= 0) {
        invalidItems.push(`${itemId}: invalid sellPrice '${item.sellPrice}'`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all items have nameArabic (non-empty)', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!item.nameArabic || item.nameArabic.trim() === '') {
        invalidItems.push(`${itemId}: missing or empty nameArabic`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all items have lore (non-empty)', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!item.lore || item.lore.trim() === '') {
        invalidItems.push(`${itemId}: missing or empty lore`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all items have loreArabic (non-empty)', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!item.loreArabic || item.loreArabic.trim() === '') {
        invalidItems.push(`${itemId}: missing or empty loreArabic`);
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all rarity tiers have Arabic color names', () => {
    for (const [_rarity, tier] of Object.entries(RARITY_TIERS)) {
      expect(tier.nameArabic).toBeTruthy();
      expect(tier.nameArabic.length).toBeGreaterThan(0);
    }
  });

  it('EQUIPMENT_DATA has at least 48 items', () => {
    const itemCount = Object.keys(EQUIPMENT_DATA).length;
    expect(itemCount).toBeGreaterThanOrEqual(48);
  });

  it('every EQUIPMENT_SLOT has at least 4 items', () => {
    const slotsWithTooFewItems = [];

    for (const slot of EQUIPMENT_SLOTS) {
      const itemsForSlot = Object.values(EQUIPMENT_DATA).filter(item => item.slot === slot);

      if (itemsForSlot.length < 4) {
        slotsWithTooFewItems.push(`${slot}: only ${itemsForSlot.length} items`);
      }
    }

    expect(slotsWithTooFewItems).toEqual([]);
  });

  it('all items have stats object with hp, mp, damage, defense', () => {
    const invalidItems = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (!item.stats) {
        invalidItems.push(`${itemId}: missing stats object`);
      } else {
        if (item.stats.hp === undefined) {
          invalidItems.push(`${itemId}: missing stats.hp`);
        }
        if (item.stats.mp === undefined) {
          invalidItems.push(`${itemId}: missing stats.mp`);
        }
        if (item.stats.damage === undefined) {
          invalidItems.push(`${itemId}: missing stats.damage`);
        }
        if (item.stats.defense === undefined) {
          invalidItems.push(`${itemId}: missing stats.defense`);
        }
      }
    }

    expect(invalidItems).toEqual([]);
  });

  it('all item affixes have bonus objects', () => {
    const invalidAffixes = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      if (item.affixes && item.affixes.length > 0) {
        for (const affix of item.affixes) {
          if (!affix.bonus || typeof affix.bonus !== 'object') {
            invalidAffixes.push(`${itemId}: affix '${affix.wordId}' missing bonus object`);
          }
        }
      }
    }

    expect(invalidAffixes).toEqual([]);
  });

  it('all items respect rarity max affix count', () => {
    const violations = [];

    for (const [itemId, item] of Object.entries(EQUIPMENT_DATA)) {
      const maxAffixes = RARITY_TIERS[item.rarity]?.maxAffixes || 0;
      const actualAffixes = item.affixes ? item.affixes.length : 0;

      if (actualAffixes > maxAffixes) {
        violations.push(`${itemId}: ${actualAffixes} affixes exceeds max ${maxAffixes} for rarity '${item.rarity}'`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('all item IDs match their object keys', () => {
    const mismatches = [];

    for (const [key, item] of Object.entries(EQUIPMENT_DATA)) {
      if (item.id !== key) {
        mismatches.push(`key '${key}' does not match item.id '${item.id}'`);
      }
    }

    expect(mismatches).toEqual([]);
  });
});
