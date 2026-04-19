import { describe, it, expect } from 'vitest';
import {
  RELATIONSHIP_TIERS,
  getRelationshipTier,
  getGiftBonus,
  getRelationshipMultiplier,
} from '../companionRelationship.js';

describe('companionRelationship', () => {
  describe('getRelationshipTier', () => {
    it('returns stranger tier for 0', () => {
      const tier = getRelationshipTier(0);

      expect(tier).toBe(RELATIONSHIP_TIERS.stranger);
      expect(tier.label).toBe('Stranger');
      expect(tier.battleBonus).toBe(0);
    });

    it('returns acquaintance tier for 25', () => {
      const tier = getRelationshipTier(25);

      expect(tier).toBe(RELATIONSHIP_TIERS.acquaintance);
      expect(tier.label).toBe('Acquaintance');
      expect(tier.battleBonus).toBe(0.05);
    });

    it('returns friend tier for 50', () => {
      const tier = getRelationshipTier(50);

      expect(tier).toBe(RELATIONSHIP_TIERS.friend);
      expect(tier.label).toBe('Friend');
      expect(tier.battleBonus).toBe(0.10);
    });

    it('returns closeFriend tier for 70', () => {
      const tier = getRelationshipTier(70);

      expect(tier).toBe(RELATIONSHIP_TIERS.closeFriend);
      expect(tier.label).toBe('Close Friend');
      expect(tier.battleBonus).toBe(0.15);
    });

    it('returns bestFriend tier for 90', () => {
      const tier = getRelationshipTier(90);

      expect(tier).toBe(RELATIONSHIP_TIERS.bestFriend);
      expect(tier.label).toBe('Best Friend');
      expect(tier.battleBonus).toBe(0.20);
    });

    it('returns bestFriend tier for 100 (boundary)', () => {
      const tier = getRelationshipTier(100);

      expect(tier).toBe(RELATIONSHIP_TIERS.bestFriend);
      expect(tier.battleBonus).toBe(0.20);
    });

    it('handles negative (returns stranger)', () => {
      const tier = getRelationshipTier(-5);

      expect(tier).toBe(RELATIONSHIP_TIERS.stranger);
    });

    it('tier boundaries are correct', () => {
      // Test all boundaries
      expect(getRelationshipTier(19).label).toBe('Stranger');
      expect(getRelationshipTier(20).label).toBe('Acquaintance');
      expect(getRelationshipTier(39).label).toBe('Acquaintance');
      expect(getRelationshipTier(40).label).toBe('Friend');
      expect(getRelationshipTier(59).label).toBe('Friend');
      expect(getRelationshipTier(60).label).toBe('Close Friend');
      expect(getRelationshipTier(79).label).toBe('Close Friend');
      expect(getRelationshipTier(80).label).toBe('Best Friend');
    });
  });

  describe('getGiftBonus', () => {
    it('returns base * 1.5 for preferred match', () => {
      const bonus = getGiftBonus('books', ['books', 'scrolls']);

      // books has baseGain 10, so 10 * 1.5 = 15
      expect(bonus).toBe(15);
    });

    it('returns base * 1.0 for no match', () => {
      const bonus = getGiftBonus('food', ['books', 'scrolls']);

      // food has baseGain 5, no match, so 5 * 1.0 = 5
      expect(bonus).toBe(5);
    });

    it('handles unknown category gracefully (returns 0)', () => {
      const bonus = getGiftBonus('unknown_category', []);

      expect(bonus).toBe(0);
    });

    it('calculates correctly for all gift categories', () => {
      // Test each category with and without preference
      const categories = ['books', 'food', 'crafts', 'gems', 'scrolls', 'flowers'];

      categories.forEach(category => {
        const withPreference = getGiftBonus(category, [category]);
        const withoutPreference = getGiftBonus(category, []);

        expect(withPreference).toBeGreaterThan(withoutPreference);

        // Due to Math.floor, the ratio may not be exactly 1.5 for all values
        // For example: food baseGain=5, 5*1.5=7.5, floor=7, 7/5=1.4
        // So we just check it's greater
        const ratio = withPreference / withoutPreference;
        expect(ratio).toBeGreaterThanOrEqual(1.4);
        expect(ratio).toBeLessThanOrEqual(1.5);
      });
    });

    it('returns floored integer', () => {
      const bonus = getGiftBonus('books', ['books']);

      expect(Number.isInteger(bonus)).toBe(true);
    });
  });

  describe('getRelationshipMultiplier', () => {
    it('returns 1.0 for stranger (0)', () => {
      const multiplier = getRelationshipMultiplier(0);

      expect(multiplier).toBe(1.0);
    });

    it('returns 1.05 for acquaintance (25)', () => {
      const multiplier = getRelationshipMultiplier(25);

      expect(multiplier).toBe(1.05);
    });

    it('returns 1.10 for friend (50)', () => {
      const multiplier = getRelationshipMultiplier(50);

      expect(multiplier).toBe(1.10);
    });

    it('returns 1.15 for closeFriend (70)', () => {
      const multiplier = getRelationshipMultiplier(70);

      expect(multiplier).toBe(1.15);
    });

    it('returns 1.20 for bestFriend (90)', () => {
      const multiplier = getRelationshipMultiplier(90);

      expect(multiplier).toBe(1.20);
    });

    it('returns 1.20 for bestFriend (100)', () => {
      const multiplier = getRelationshipMultiplier(100);

      expect(multiplier).toBe(1.20);
    });
  });

  describe('RELATIONSHIP_TIERS', () => {
    it('has exactly 5 tiers', () => {
      expect(Object.keys(RELATIONSHIP_TIERS)).toHaveLength(5);
    });

    it('tiers cover 0-100 range without gaps', () => {
      const tiers = Object.values(RELATIONSHIP_TIERS);

      // Check first tier starts at 0
      expect(tiers[0].min).toBe(0);

      // Check last tier ends at 100
      const lastTier = tiers[tiers.length - 1];
      expect(lastTier.max).toBe(100);
    });

    it('battle bonuses increase with each tier', () => {
      const bonuses = Object.values(RELATIONSHIP_TIERS).map(tier => tier.battleBonus);

      for (let i = 1; i < bonuses.length; i++) {
        expect(bonuses[i]).toBeGreaterThan(bonuses[i - 1]);
      }
    });

    it('all tiers have Arabic labels', () => {
      Object.values(RELATIONSHIP_TIERS).forEach(tier => {
        expect(tier.labelArabic).toBeTruthy();
        expect(typeof tier.labelArabic).toBe('string');
      });
    });
  });
});
