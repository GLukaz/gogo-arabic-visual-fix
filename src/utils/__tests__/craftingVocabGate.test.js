import { describe, it, expect } from 'vitest';
import {
  canUseIngredientByMastery,
  isRecipeCraftableByMastery,
  calculateCefrScaledXP,
  CEFR_XP_MULTIPLIER,
} from '../craftingLogic.js';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_RESOURCES = {
  paper: { id: 'paper', wordId: 'word_paper', nameEnglish: 'Paper' },
  ink:   { id: 'ink',   wordId: 'word_ink',   nameEnglish: 'Ink'   },
  wood:  { id: 'wood',  wordId: 'word_wood',  nameEnglish: 'Wood'  },
  no_word_item: { id: 'no_word_item' }, // no wordId
};

const MOCK_RECIPES = {
  scroll: {
    id: 'scroll',
    ingredients: [
      { resourceId: 'paper', quantity: 2 },
      { resourceId: 'ink',   quantity: 1 },
    ],
  },
  simple_wood: {
    id: 'simple_wood',
    ingredients: [{ resourceId: 'wood', quantity: 1 }],
  },
  no_word_recipe: {
    id: 'no_word_recipe',
    ingredients: [{ resourceId: 'no_word_item', quantity: 1 }],
  },
  empty_recipe: { id: 'empty_recipe', ingredients: [] },
};

const MOCK_VOCAB_DATA = [
  { wordId: 'word_paper', cefrLevel: 'A1' },
  { wordId: 'word_ink',   cefrLevel: 'A2' },
  { wordId: 'word_wood',  cefrLevel: 'B1' },
];

// ─────────────────────────────────────────────────────────────────────────────
// canUseIngredientByMastery
// ─────────────────────────────────────────────────────────────────────────────

describe('canUseIngredientByMastery', () => {
  it('returns true when mastery >= 80%', () => {
    const map = { word_paper: 0.85 };
    expect(canUseIngredientByMastery('paper', map, MOCK_RESOURCES)).toBe(true);
  });

  it('returns true at exactly 80% mastery', () => {
    const map = { word_paper: 0.80 };
    expect(canUseIngredientByMastery('paper', map, MOCK_RESOURCES)).toBe(true);
  });

  it('returns false when mastery < 80%', () => {
    const map = { word_paper: 0.79 };
    expect(canUseIngredientByMastery('paper', map, MOCK_RESOURCES)).toBe(false);
  });

  it('returns false when word not in mastery map', () => {
    const map = {};
    expect(canUseIngredientByMastery('paper', map, MOCK_RESOURCES)).toBe(false);
  });

  it('returns false when ingredient not in RESOURCES', () => {
    const map = { word_paper: 1.0 };
    expect(canUseIngredientByMastery('unknown_item', map, MOCK_RESOURCES)).toBe(false);
  });

  it('returns false when RESOURCES is null', () => {
    const map = { word_paper: 1.0 };
    expect(canUseIngredientByMastery('paper', map, null)).toBe(false);
  });

  it('returns false when resource has no wordId', () => {
    const map = { word_paper: 1.0 };
    expect(canUseIngredientByMastery('no_word_item', map, MOCK_RESOURCES)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isRecipeCraftableByMastery
// ─────────────────────────────────────────────────────────────────────────────

describe('isRecipeCraftableByMastery', () => {
  it('returns true when all ingredients meet mastery threshold', () => {
    const map = { word_paper: 0.9, word_ink: 0.85 };
    expect(isRecipeCraftableByMastery('scroll', map, MOCK_RECIPES, MOCK_RESOURCES)).toBe(true);
  });

  it('returns false when any ingredient is below threshold', () => {
    const map = { word_paper: 0.9, word_ink: 0.5 }; // ink too low
    expect(isRecipeCraftableByMastery('scroll', map, MOCK_RECIPES, MOCK_RESOURCES)).toBe(false);
  });

  it('returns false when all ingredients below threshold', () => {
    const map = { word_paper: 0.3, word_ink: 0.1 };
    expect(isRecipeCraftableByMastery('scroll', map, MOCK_RECIPES, MOCK_RESOURCES)).toBe(false);
  });

  it('returns true for recipe with empty ingredients', () => {
    const map = {};
    expect(isRecipeCraftableByMastery('empty_recipe', map, MOCK_RECIPES, MOCK_RESOURCES)).toBe(true);
  });

  it('returns false for unknown recipe', () => {
    const map = { word_paper: 1.0 };
    expect(isRecipeCraftableByMastery('unknown_recipe', map, MOCK_RECIPES, MOCK_RESOURCES)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateCefrScaledXP
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateCefrScaledXP', () => {
  it('scales XP by A1 multiplier (1x)', () => {
    expect(calculateCefrScaledXP(100, ['word_paper'], MOCK_VOCAB_DATA)).toBe(100);
  });

  it('scales XP by A2 multiplier (1.5x)', () => {
    expect(calculateCefrScaledXP(100, ['word_ink'], MOCK_VOCAB_DATA)).toBe(150);
  });

  it('scales XP by B1 multiplier (2x)', () => {
    expect(calculateCefrScaledXP(100, ['word_wood'], MOCK_VOCAB_DATA)).toBe(200);
  });

  it('averages multiplier for mixed CEFR ingredients', () => {
    // A1 (1x) + A2 (1.5x) = avg 1.25x → 125 XP
    expect(calculateCefrScaledXP(100, ['word_paper', 'word_ink'], MOCK_VOCAB_DATA)).toBe(125);
  });

  it('defaults to 1x for unknown wordId', () => {
    expect(calculateCefrScaledXP(100, ['unknown_word'], MOCK_VOCAB_DATA)).toBe(100);
  });

  it('returns baseXP when wordIds is empty', () => {
    expect(calculateCefrScaledXP(100, [], MOCK_VOCAB_DATA)).toBe(100);
  });

  it('rounds XP to nearest integer', () => {
    // A2 (1.5x) + B2 (3x) = avg 2.25x → 225
    const vocabData = [
      { wordId: 'w1', cefrLevel: 'A2' },
      { wordId: 'w2', cefrLevel: 'B2' },
    ];
    expect(calculateCefrScaledXP(100, ['w1', 'w2'], vocabData)).toBe(225);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CEFR_XP_MULTIPLIER constants
// ─────────────────────────────────────────────────────────────────────────────

describe('CEFR_XP_MULTIPLIER', () => {
  it('defines multipliers for all 4 CEFR levels', () => {
    expect(CEFR_XP_MULTIPLIER.A1).toBeDefined();
    expect(CEFR_XP_MULTIPLIER.A2).toBeDefined();
    expect(CEFR_XP_MULTIPLIER.B1).toBeDefined();
    expect(CEFR_XP_MULTIPLIER.B2).toBeDefined();
  });

  it('B2 multiplier is higher than A1', () => {
    expect(CEFR_XP_MULTIPLIER.B2).toBeGreaterThan(CEFR_XP_MULTIPLIER.A1);
  });
});
