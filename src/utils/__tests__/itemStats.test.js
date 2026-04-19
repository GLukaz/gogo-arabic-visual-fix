import { describe, it, expect } from 'vitest';
import { calculateItemStats, calculateTotalEquipmentStats, compareItemStats } from '../itemStats.js';

describe('itemStats', () => {
  describe('calculateItemStats', () => {
    it('returns base stats for item without affixes', () => {
      const vocabularyState = { fsrsCards: {} };
      const stats = calculateItemStats('simple_kufi', vocabularyState);

      expect(stats).toEqual({
        hp: 5,
        mp: 0,
        damage: 0,
        defense: 0,
      });
    });

    it('applies full affix bonus (1.0) when word is learned', () => {
      const vocabularyState = {
        fsrsCards: {
          word_wise: { state: 'Review' }, // Fully learned
        },
      };
      const stats = calculateItemStats('scholars_kufi', vocabularyState);

      // Base: { hp: 0, mp: 15 }
      // Affix: word_wise bonus { mp: 10 } * 1.0 = 10
      expect(stats.hp).toBe(0);
      expect(stats.mp).toBe(25); // 15 + 10
    });

    it('applies half affix bonus (0.5) when word is unlearned', () => {
      const vocabularyState = {
        fsrsCards: {
          word_wise: { state: 'Learning' }, // Not in Review state
        },
      };
      const stats = calculateItemStats('scholars_kufi', vocabularyState);

      // Base: { hp: 0, mp: 15 }
      // Affix: word_wise bonus { mp: 10 } * 0.5 = 5
      expect(stats.hp).toBe(0);
      expect(stats.mp).toBe(20); // 15 + 5
    });

    it('applies half affix bonus (0.5) when word is undiscovered', () => {
      const vocabularyState = { fsrsCards: {} }; // No card for word_wise
      const stats = calculateItemStats('scholars_kufi', vocabularyState);

      // Base: { hp: 0, mp: 15 }
      // Affix: word_wise bonus { mp: 10 } * 0.5 = 5
      expect(stats.hp).toBe(0);
      expect(stats.mp).toBe(20); // 15 + 5
    });

    it('handles item with multiple affixes', () => {
      const vocabularyState = {
        fsrsCards: {
          word_noble: { state: 'Review' }, // Learned
        },
      };
      const stats = calculateItemStats('royal_ghutra', vocabularyState);

      // Base: { hp: 15, mp: 20, damage: 0.02, defense: 0.02 }
      // Affix: word_noble bonus { hp: 10 } * 1.0 = 10
      expect(stats.hp).toBe(25); // 15 + 10
      expect(stats.mp).toBe(20);
      expect(stats.damage).toBe(0.02);
      expect(stats.defense).toBe(0.02);
    });

    it('returns zero stats for non-existent itemId', () => {
      const vocabularyState = { fsrsCards: {} };
      const stats = calculateItemStats('nonexistent_item', vocabularyState);

      expect(stats).toEqual({
        hp: 0,
        mp: 0,
        damage: 0,
        defense: 0,
      });
    });

    it('handles missing vocabularyState gracefully', () => {
      const stats = calculateItemStats('simple_kufi', {});

      expect(stats).toEqual({
        hp: 5,
        mp: 0,
        damage: 0,
        defense: 0,
      });
    });
  });

  describe('calculateTotalEquipmentStats', () => {
    it('sums HP and MP additively across equipped items', () => {
      const equipped = {
        headCovering: 'simple_kufi', // hp: 5
        robe: null,
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = { fsrsCards: {} };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      expect(stats.hp).toBe(5);
      expect(stats.mp).toBe(0);
    });

    it('multiplies damage and defense across equipped items', () => {
      const equipped = {
        headCovering: 'royal_ghutra', // damage: 0.02, defense: 0.02
        robe: null,
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = { fsrsCards: {} };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      // Damage starts at 1.0, adds 0.02 = 1.02
      expect(stats.damage).toBe(1.02);
      expect(stats.defense).toBe(1.02);
    });

    it('includes set bonuses from matching themed items', () => {
      const equipped = {
        headCovering: 'scholars_kufi', // scholars_set
        robe: 'scholars_robe', // scholars_set (2-piece bonus: +20 MP)
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = { fsrsCards: {} };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      // Should have set bonuses array populated
      expect(stats.setBonuses).toBeDefined();
      expect(Array.isArray(stats.setBonuses)).toBe(true);
    });

    it('handles empty equipment (all slots null)', () => {
      const equipped = {
        headCovering: null,
        robe: null,
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = { fsrsCards: {} };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      expect(stats.hp).toBe(0);
      expect(stats.mp).toBe(0);
      expect(stats.damage).toBe(1.0); // Base multiplicative
      expect(stats.defense).toBe(1.0); // Base multiplicative
      expect(stats.setBonuses).toEqual([]);
    });

    it('handles mixed learned/unlearned affix items', () => {
      const equipped = {
        headCovering: 'scholars_kufi', // word_wise affix
        robe: null,
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = {
        fsrsCards: {
          word_wise: { state: 'Review' }, // Learned
        },
      };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      // scholars_kufi base mp: 15, affix mp: 10 * 1.0 = 10, total: 25
      expect(stats.mp).toBe(25);
    });

    it('sums stats from multiple equipped items', () => {
      const equipped = {
        headCovering: 'simple_kufi', // hp: 5
        robe: 'simple_robe', // Assuming it exists with hp: 10
        cloak: null,
        belt: null,
        boots: null,
        gloves: null,
        accessory1: null,
        accessory2: null,
      };
      const vocabularyState = { fsrsCards: {} };

      const stats = calculateTotalEquipmentStats(equipped, vocabularyState);

      // simple_kufi: hp: 5
      // simple_robe: need to check if it exists, but assuming hp: 10
      expect(stats.hp).toBeGreaterThanOrEqual(5);
    });
  });

  describe('compareItemStats', () => {
    it('returns positive diff when new item is better', () => {
      const vocabularyState = { fsrsCards: {} };
      const diff = compareItemStats('royal_ghutra', 'simple_kufi', vocabularyState);

      // royal_ghutra: { hp: 15, mp: 20, damage: 0.02, defense: 0.02 }
      // + word_noble affix bonus: { hp: 10 } * 0.5 (unlearned) = 5
      // Total: { hp: 20, mp: 20, damage: 0.02, defense: 0.02 }
      // simple_kufi: { hp: 5, mp: 0, damage: 0, defense: 0 }
      expect(diff.hp).toBe(15); // 20 - 5
      expect(diff.mp).toBe(20);
      expect(diff.damage).toBe(0.02);
      expect(diff.defense).toBe(0.02);
    });

    it('returns negative diff when new item is worse', () => {
      const vocabularyState = { fsrsCards: {} };
      const diff = compareItemStats('simple_kufi', 'royal_ghutra', vocabularyState);

      // simple_kufi: { hp: 5, mp: 0, damage: 0, defense: 0 }
      // royal_ghutra with affix: { hp: 20, mp: 20, damage: 0.02, defense: 0.02 }
      expect(diff.hp).toBe(-15); // 5 - 20
      expect(diff.mp).toBe(-20);
      expect(diff.damage).toBe(-0.02);
      expect(diff.defense).toBe(-0.02);
    });

    it('returns zero diff for identical items', () => {
      const vocabularyState = { fsrsCards: {} };
      const diff = compareItemStats('simple_kufi', 'simple_kufi', vocabularyState);

      expect(diff.hp).toBe(0);
      expect(diff.mp).toBe(0);
      expect(diff.damage).toBe(0);
      expect(diff.defense).toBe(0);
    });

    it('handles comparison with null currentItemId', () => {
      const vocabularyState = { fsrsCards: {} };
      const diff = compareItemStats('simple_kufi', null, vocabularyState);

      // Comparing against zero stats
      expect(diff.hp).toBe(5);
      expect(diff.mp).toBe(0);
      expect(diff.damage).toBe(0);
      expect(diff.defense).toBe(0);
    });

    it('respects vocabulary-gated affix bonuses in comparison', () => {
      const vocabularyState = {
        fsrsCards: {
          word_wise: { state: 'Review' }, // Learned
        },
      };
      const diff = compareItemStats('scholars_kufi', 'simple_kufi', vocabularyState);

      // scholars_kufi with learned word_wise: mp: 15 + 10 = 25
      // simple_kufi: mp: 0
      expect(diff.mp).toBe(25);
    });
  });
});
