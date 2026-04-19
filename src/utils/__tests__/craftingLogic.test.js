import { describe, it, expect, vi } from 'vitest';
import {
  calculateCraftQuality,
  calculateXPGain,
  canUseIngredient,
  getDisplayableIngredients,
  hasRequiredResources,
  calculateProfessionXP,
  calculateGatheringQuality,
} from '../craftingLogic.js';

// Mock data - these will be replaced when 31-01 creates actual data files
const MOCK_RECIPES = {
  calligraphy_basic_scroll: {
    id: 'calligraphy_basic_scroll',
    professionId: 'calligrapher',
    nameArabic: 'لفافة بسيطة',
    nameEnglish: 'Basic Scroll',
    minLevel: 1,
    ingredients: [
      { resourceId: 'paper', quantity: 2 },
      { resourceId: 'ink', quantity: 1 },
    ],
    result: { itemId: 'scroll_basic', quantity: 1 },
    xpGain: 50,
  },
  cook_flat_bread: {
    id: 'cook_flat_bread',
    professionId: 'cook',
    nameArabic: 'خبز مسطح',
    nameEnglish: 'Flat Bread',
    minLevel: 1,
    ingredients: [
      { resourceId: 'flour', quantity: 3 },
      { resourceId: 'water', quantity: 1 },
    ],
    result: { itemId: 'bread_flat', quantity: 2 },
    xpGain: 30,
  },
  blacksmith_iron_dagger: {
    id: 'blacksmith_iron_dagger',
    professionId: 'blacksmith',
    nameArabic: 'خنجر حديدي',
    nameEnglish: 'Iron Dagger',
    minLevel: 2,
    ingredients: [
      { resourceId: 'iron_ore', quantity: 2 },
      { resourceId: 'wood', quantity: 1 },
    ],
    result: { itemId: 'dagger_iron', quantity: 1 },
    xpGain: 75,
  },
  empty_recipe: {
    id: 'empty_recipe',
    ingredients: [],
  },
};

const MOCK_RESOURCES = {
  paper: {
    id: 'paper',
    nameArabic: 'ورق',
    nameEnglish: 'Paper',
    wordId: 'word_paper_001',
    professions: ['calligrapher'],
    zones: ['market'],
    rarity: 'common',
  },
  ink: {
    id: 'ink',
    nameArabic: 'حبر',
    nameEnglish: 'Ink',
    wordId: 'word_ink_002',
    professions: ['calligrapher'],
    zones: ['market'],
    rarity: 'common',
  },
  flour: {
    id: 'flour',
    nameArabic: 'طحين',
    nameEnglish: 'Flour',
    wordId: 'word_flour_003',
    professions: ['cook'],
    zones: ['market'],
    rarity: 'common',
  },
  water: {
    id: 'water',
    nameArabic: 'ماء',
    nameEnglish: 'Water',
    wordId: 'word_water_004',
    professions: ['cook', 'herbalist'],
    zones: ['oasis'],
    rarity: 'common',
  },
  iron_ore: {
    id: 'iron_ore',
    nameArabic: 'خام حديد',
    nameEnglish: 'Iron Ore',
    wordId: 'word_iron_005',
    professions: ['blacksmith'],
    zones: ['mountain'],
    rarity: 'uncommon',
  },
  wood: {
    id: 'wood',
    nameArabic: 'خشب',
    nameEnglish: 'Wood',
    wordId: 'word_wood_006',
    professions: ['blacksmith', 'builder'],
    zones: ['forest'],
    rarity: 'common',
  },
};

describe('craftingLogic', () => {
  describe('calculateCraftQuality', () => {
    it('returns legendary for accuracy > 0.95', () => {
      expect(calculateCraftQuality(0.96)).toBe('legendary');
      expect(calculateCraftQuality(1.0)).toBe('legendary');
    });

    it('returns legendary for accuracy exactly 0.95 (inclusive boundary)', () => {
      expect(calculateCraftQuality(0.95)).toBe('legendary');
    });

    it('returns epic for accuracy > 0.80 and <= 0.95', () => {
      expect(calculateCraftQuality(0.81)).toBe('epic');
      expect(calculateCraftQuality(0.90)).toBe('epic');
      expect(calculateCraftQuality(0.94)).toBe('epic');
    });

    it('returns rare for accuracy > 0.60 and <= 0.80', () => {
      expect(calculateCraftQuality(0.61)).toBe('rare');
      expect(calculateCraftQuality(0.70)).toBe('rare');
      expect(calculateCraftQuality(0.80)).toBe('rare');
    });

    it('returns uncommon for accuracy > 0.40 and <= 0.60', () => {
      expect(calculateCraftQuality(0.41)).toBe('uncommon');
      expect(calculateCraftQuality(0.50)).toBe('uncommon');
      expect(calculateCraftQuality(0.60)).toBe('uncommon');
    });

    it('returns common for accuracy <= 0.40', () => {
      expect(calculateCraftQuality(0.40)).toBe('common');
      expect(calculateCraftQuality(0.20)).toBe('common');
      expect(calculateCraftQuality(0.0)).toBe('common');
    });
  });

  describe('calculateXPGain', () => {
    it('applies 1.5x multiplier for accuracy >= 0.95 (perfect bonus)', () => {
      expect(calculateXPGain(100, 0.95)).toBe(150);
      expect(calculateXPGain(100, 1.0)).toBe(150);
      expect(calculateXPGain(50, 0.96)).toBe(75);
    });

    it('applies 1.2x multiplier for accuracy >= 0.80 and < 0.95 (good bonus)', () => {
      expect(calculateXPGain(100, 0.80)).toBe(120);
      expect(calculateXPGain(100, 0.85)).toBe(120);
      expect(calculateXPGain(100, 0.94)).toBe(120);
    });

    it('applies 1.0x multiplier for accuracy >= 0.60 and < 0.80 (standard)', () => {
      expect(calculateXPGain(100, 0.60)).toBe(100);
      expect(calculateXPGain(100, 0.70)).toBe(100);
      expect(calculateXPGain(100, 0.79)).toBe(100);
    });

    it('applies 0.5x multiplier for accuracy < 0.60 (poor penalty)', () => {
      expect(calculateXPGain(100, 0.59)).toBe(50);
      expect(calculateXPGain(100, 0.40)).toBe(50);
      expect(calculateXPGain(100, 0.0)).toBe(50);
    });

    it('always returns integer (floor)', () => {
      expect(calculateXPGain(33, 0.95)).toBe(49); // 33 * 1.5 = 49.5 -> 49
      expect(calculateXPGain(33, 0.80)).toBe(39); // 33 * 1.2 = 39.6 -> 39
    });

    it('handles edge case of 0 base XP', () => {
      expect(calculateXPGain(0, 0.95)).toBe(0);
      expect(calculateXPGain(0, 0.50)).toBe(0);
    });
  });

  describe('canUseIngredient', () => {
    it('returns true when resource exists, word in FSRS, and has been reviewed', () => {
      const fsrsCards = {
        word_paper_001: { card: { reps: 5 } },
      };
      expect(canUseIngredient('paper', fsrsCards, MOCK_RESOURCES)).toBe(true);
    });

    it('returns false when resource does not exist', () => {
      const fsrsCards = {
        word_paper_001: { card: { reps: 5 } },
      };
      expect(canUseIngredient('unknown_resource', fsrsCards, MOCK_RESOURCES)).toBe(false);
    });

    it('returns false when word not in FSRS cards', () => {
      const fsrsCards = {};
      expect(canUseIngredient('paper', fsrsCards, MOCK_RESOURCES)).toBe(false);
    });

    it('returns false when word in FSRS but never reviewed (reps = 0)', () => {
      const fsrsCards = {
        word_paper_001: { card: { reps: 0 } },
      };
      expect(canUseIngredient('paper', fsrsCards, MOCK_RESOURCES)).toBe(false);
    });

    it('returns true for reps = 1 (reviewed at least once)', () => {
      const fsrsCards = {
        word_ink_002: { card: { reps: 1 } },
      };
      expect(canUseIngredient('ink', fsrsCards, MOCK_RESOURCES)).toBe(true);
    });
  });

  describe('getDisplayableIngredients', () => {
    it('shows Arabic name and no hint when ingredient is usable', () => {
      const fsrsCards = {
        word_paper_001: { card: { reps: 2 } },
        word_ink_002: { card: { reps: 1 } },
      };
      const result = getDisplayableIngredients('calligraphy_basic_scroll', fsrsCards, MOCK_RECIPES, MOCK_RESOURCES);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        resourceId: 'paper',
        quantity: 2,
        canUse: true,
        displayName: 'ورق',
        hint: null,
      });
      expect(result[1]).toEqual({
        resourceId: 'ink',
        quantity: 1,
        canUse: true,
        displayName: 'حبر',
        hint: null,
      });
    });

    it('shows ??? and hint when ingredient is locked', () => {
      const fsrsCards = {
        word_paper_001: { card: { reps: 2 } },
        // ink not in FSRS
      };
      const result = getDisplayableIngredients('calligraphy_basic_scroll', fsrsCards, MOCK_RECIPES, MOCK_RESOURCES);

      expect(result[1]).toEqual({
        resourceId: 'ink',
        quantity: 1,
        canUse: false,
        displayName: '???',
        hint: 'Learn "Ink" to unlock',
      });
    });

    it('handles all ingredients locked (empty FSRS)', () => {
      const fsrsCards = {};
      const result = getDisplayableIngredients('calligraphy_basic_scroll', fsrsCards, MOCK_RECIPES, MOCK_RESOURCES);

      expect(result).toHaveLength(2);
      expect(result[0].canUse).toBe(false);
      expect(result[1].canUse).toBe(false);
      expect(result[0].displayName).toBe('???');
      expect(result[1].displayName).toBe('???');
    });

    it('handles recipe with unknown recipe ID', () => {
      const fsrsCards = {};
      const result = getDisplayableIngredients('unknown_recipe', fsrsCards, MOCK_RECIPES, MOCK_RESOURCES);

      expect(result).toEqual([]);
    });
  });

  describe('hasRequiredResources', () => {
    it('returns canCraft=true and empty missing when all resources available', () => {
      const playerResources = [
        { resourceId: 'paper', quantity: 5 },
        { resourceId: 'ink', quantity: 3 },
      ];
      const result = hasRequiredResources('calligraphy_basic_scroll', playerResources, MOCK_RECIPES);

      expect(result.canCraft).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('returns canCraft=false and missing list when resources insufficient', () => {
      const playerResources = [
        { resourceId: 'paper', quantity: 1 }, // need 2
        { resourceId: 'ink', quantity: 0 },    // need 1
      ];
      const result = hasRequiredResources('calligraphy_basic_scroll', playerResources, MOCK_RECIPES);

      expect(result.canCraft).toBe(false);
      expect(result.missing).toHaveLength(2);
      expect(result.missing[0]).toEqual({
        resourceId: 'paper',
        needed: 2,
        have: 1,
        shortfall: 1,
      });
      expect(result.missing[1]).toEqual({
        resourceId: 'ink',
        needed: 1,
        have: 0,
        shortfall: 1,
      });
    });

    it('returns canCraft=false when resource completely missing', () => {
      const playerResources = [
        { resourceId: 'paper', quantity: 5 },
        // ink missing entirely
      ];
      const result = hasRequiredResources('calligraphy_basic_scroll', playerResources, MOCK_RECIPES);

      expect(result.canCraft).toBe(false);
      expect(result.missing).toHaveLength(1);
      expect(result.missing[0]).toEqual({
        resourceId: 'ink',
        needed: 1,
        have: 0,
        shortfall: 1,
      });
    });

    it('handles recipe with 0 ingredients (edge case)', () => {
      const playerResources = [];
      const result = hasRequiredResources('empty_recipe', playerResources, MOCK_RECIPES);

      expect(result.canCraft).toBe(true);
      expect(result.missing).toEqual([]);
    });

    it('handles unknown recipe ID', () => {
      const playerResources = [];
      const result = hasRequiredResources('unknown_recipe', playerResources, MOCK_RECIPES);

      expect(result.canCraft).toBe(false);
      expect(result.missing).toEqual([]);
    });
  });

  describe('calculateProfessionXP', () => {
    it('calculates correct threshold for levels 1-10 (100 XP per level)', () => {
      expect(calculateProfessionXP(50, 1)).toEqual({
        current: 50,
        required: 100,
        percent: 50,
      });

      expect(calculateProfessionXP(250, 5)).toEqual({
        current: 250,
        required: 500,
        percent: 50,
      });

      expect(calculateProfessionXP(500, 10)).toEqual({
        current: 500,
        required: 1000,
        percent: 50,
      });
    });

    it('handles level 0 edge case (50 XP to reach level 1)', () => {
      expect(calculateProfessionXP(25, 0)).toEqual({
        current: 25,
        required: 50,
        percent: 50,
      });

      expect(calculateProfessionXP(50, 0)).toEqual({
        current: 50,
        required: 50,
        percent: 100,
      });
    });

    it('calculates percent correctly for edge values', () => {
      expect(calculateProfessionXP(0, 1)).toEqual({
        current: 0,
        required: 100,
        percent: 0,
      });

      expect(calculateProfessionXP(100, 1)).toEqual({
        current: 100,
        required: 100,
        percent: 100,
      });
    });

    it('handles XP overflow (more than required)', () => {
      expect(calculateProfessionXP(150, 1)).toEqual({
        current: 150,
        required: 100,
        percent: 150,
      });
    });

    it('returns integer percent (floor)', () => {
      expect(calculateProfessionXP(33, 1).percent).toBe(33); // 33/100 = 33
      expect(calculateProfessionXP(66, 2).percent).toBe(33); // 66/200 = 33
    });
  });

  describe('calculateGatheringQuality', () => {
    it('returns correct quality distribution for level 0-2 (80% normal, 20% high)', () => {
      expect(calculateGatheringQuality(0, 0.0)).toBe('normal');
      expect(calculateGatheringQuality(0, 0.79)).toBe('normal');
      expect(calculateGatheringQuality(0, 0.80)).toBe('high');
      expect(calculateGatheringQuality(0, 0.99)).toBe('high');

      expect(calculateGatheringQuality(1, 0.50)).toBe('normal');
      expect(calculateGatheringQuality(2, 0.85)).toBe('high');
    });

    it('returns correct quality distribution for level 3-5 (60% normal, 30% high, 10% pristine)', () => {
      expect(calculateGatheringQuality(3, 0.0)).toBe('normal');
      expect(calculateGatheringQuality(3, 0.59)).toBe('normal');
      expect(calculateGatheringQuality(3, 0.60)).toBe('high');
      expect(calculateGatheringQuality(3, 0.89)).toBe('high');
      expect(calculateGatheringQuality(3, 0.90)).toBe('pristine');
      expect(calculateGatheringQuality(3, 0.99)).toBe('pristine');

      expect(calculateGatheringQuality(4, 0.70)).toBe('high');
      expect(calculateGatheringQuality(5, 0.95)).toBe('pristine');
    });

    it('returns correct quality distribution for level 6-8 (40% normal, 35% high, 20% pristine, 5% perfect)', () => {
      expect(calculateGatheringQuality(6, 0.0)).toBe('normal');
      expect(calculateGatheringQuality(6, 0.39)).toBe('normal');
      expect(calculateGatheringQuality(6, 0.40)).toBe('high');
      expect(calculateGatheringQuality(6, 0.74)).toBe('high');
      expect(calculateGatheringQuality(6, 0.75)).toBe('pristine');
      expect(calculateGatheringQuality(6, 0.94)).toBe('pristine');
      expect(calculateGatheringQuality(6, 0.95)).toBe('perfect');
      expect(calculateGatheringQuality(6, 0.99)).toBe('perfect');

      expect(calculateGatheringQuality(7, 0.50)).toBe('high');
      expect(calculateGatheringQuality(8, 0.80)).toBe('pristine');
    });

    it('returns correct quality distribution for level 9-10 (20% normal, 30% high, 30% pristine, 20% perfect)', () => {
      expect(calculateGatheringQuality(9, 0.0)).toBe('normal');
      expect(calculateGatheringQuality(9, 0.19)).toBe('normal');
      expect(calculateGatheringQuality(9, 0.20)).toBe('high');
      expect(calculateGatheringQuality(9, 0.49)).toBe('high');
      expect(calculateGatheringQuality(9, 0.50)).toBe('pristine');
      expect(calculateGatheringQuality(9, 0.79)).toBe('pristine');
      expect(calculateGatheringQuality(9, 0.80)).toBe('perfect');
      expect(calculateGatheringQuality(9, 0.99)).toBe('perfect');

      expect(calculateGatheringQuality(10, 0.10)).toBe('normal');
      expect(calculateGatheringQuality(10, 0.30)).toBe('high');
      expect(calculateGatheringQuality(10, 0.60)).toBe('pristine');
      expect(calculateGatheringQuality(10, 0.90)).toBe('perfect');
    });

    it('uses Math.random() when no roll parameter provided', () => {
      const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      calculateGatheringQuality(3); // should call Math.random()
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it('handles boundary edge cases', () => {
      // Exact boundary values
      expect(calculateGatheringQuality(2, 0.80)).toBe('high'); // exactly at threshold
      expect(calculateGatheringQuality(5, 0.60)).toBe('high'); // exactly at threshold
      expect(calculateGatheringQuality(8, 0.95)).toBe('perfect'); // exactly at threshold
    });
  });
});
