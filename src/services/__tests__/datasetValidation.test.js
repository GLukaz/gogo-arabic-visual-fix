import { describe, it, expect } from 'vitest';
import { DIALECT_COMPARISON, DIALECT_CATEGORIES, getWordsByCategory, getDialectWord } from '../../data/dialectComparison.js';
import { DAILY_PHRASES } from '../../data/dailyPhrases.js';
import { CALLIGRAPHY_STYLES, getStyleById, getStylesByDifficulty } from '../../data/calligraphyStyles.js';
import { GOLDEN_AGE_SCHOLARS, getScholarById, getScholarsByField, getAllScholarVocab } from '../../data/goldenAgeScholars.js';
import { ACHIEVEMENT_CHAINS, getChainById, getChainsByCategory } from '../../data/achievementChains.js';
import { ZONE_TRADE_PROFILES, TRADE_CATEGORIES } from '../../data/tradeRoutes.js';

describe('dialectComparison dataset', () => {
  it('has 350+ entries', () => {
    expect(DIALECT_COMPARISON.length).toBeGreaterThanOrEqual(350);
  });

  it('each entry has all 4 dialects', () => {
    for (const entry of DIALECT_COMPARISON.slice(0, 20)) {
      expect(entry.msa).toBeDefined();
      expect(entry.egyptian).toBeDefined();
      expect(entry.levantine).toBeDefined();
      expect(entry.gulf).toBeDefined();
    }
  });

  it('getWordsByCategory filters correctly', () => {
    const food = getWordsByCategory('food');
    expect(food.length).toBeGreaterThan(0);
    expect(food.every((w) => w.category === 'food')).toBe(true);
  });

  it('getDialectWord returns correct dialect', () => {
    const word = getDialectWord(1, 'egyptian');
    expect(word).toBeDefined();
    expect(word.arabic).toBeDefined();
  });

  it('DIALECT_CATEGORIES has multiple categories', () => {
    expect(DIALECT_CATEGORIES.length).toBeGreaterThan(5);
  });
});

describe('dailyPhrases dataset', () => {
  it('has exactly 365 phrases', () => {
    expect(DAILY_PHRASES.length).toBe(365);
  });

  it('each phrase has required fields', () => {
    for (const p of DAILY_PHRASES) {
      expect(p.arabic).toBeDefined();
      expect(p.transliteration).toBeDefined();
      expect(p.english).toBeDefined();
      expect(p.cefrLevel).toBeDefined();
      expect(p.category).toBeDefined();
    }
  });
});

describe('calligraphyStyles dataset', () => {
  it('has 6 styles', () => {
    expect(CALLIGRAPHY_STYLES.length).toBe(6);
  });

  it('getStyleById finds naskh', () => {
    const naskh = getStyleById('naskh');
    expect(naskh).toBeDefined();
    expect(naskh.nameArabic).toBe('نسخ');
  });

  it('getStylesByDifficulty sorts by level', () => {
    const sorted = getStylesByDifficulty();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].difficultyLevel).toBeGreaterThanOrEqual(sorted[i - 1].difficultyLevel);
    }
  });
});

describe('goldenAgeScholars dataset', () => {
  it('has 30+ scholars', () => {
    expect(GOLDEN_AGE_SCHOLARS.length).toBeGreaterThanOrEqual(30);
  });

  it('getScholarById finds al_khwarizmi', () => {
    const s = getScholarById('al_khwarizmi');
    expect(s).toBeDefined();
    expect(s.field).toBe('mathematics');
  });

  it('getScholarsByField filters correctly', () => {
    const medics = getScholarsByField('medicine');
    expect(medics.length).toBeGreaterThan(0);
    expect(medics.every((s) => s.field === 'medicine')).toBe(true);
  });

  it('getAllScholarVocab returns vocabulary array', () => {
    const vocab = getAllScholarVocab();
    expect(vocab.length).toBeGreaterThan(50);
    expect(vocab[0]).toHaveProperty('arabic');
    expect(vocab[0]).toHaveProperty('scholarId');
  });
});

describe('achievementChains dataset', () => {
  it('has 20 chains', () => {
    expect(ACHIEVEMENT_CHAINS.length).toBe(20);
  });

  it('getChainById finds chain', () => {
    const chain = getChainById('chain_oasis_master');
    expect(chain).toBeDefined();
    expect(chain.prerequisiteIds.length).toBeGreaterThan(0);
  });

  it('getChainsByCategory filters correctly', () => {
    const meta = getChainsByCategory('meta');
    expect(meta.length).toBeGreaterThan(0);
    expect(meta.every((c) => c.category === 'meta')).toBe(true);
  });
});

describe('tradeRoutes dataset', () => {
  it('has 8 zones', () => {
    expect(Object.keys(ZONE_TRADE_PROFILES).length).toBe(8);
  });

  it('has 10 trade categories', () => {
    expect(TRADE_CATEGORIES.length).toBe(10);
  });

  it('each zone has buy and sell for all categories', () => {
    for (const [, profile] of Object.entries(ZONE_TRADE_PROFILES)) {
      for (const cat of TRADE_CATEGORIES) {
        expect(profile.buy[cat]).toBeDefined();
        expect(profile.sell[cat]).toBeDefined();
      }
    }
  });
});
