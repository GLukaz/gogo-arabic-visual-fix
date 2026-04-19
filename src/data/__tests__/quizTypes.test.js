import { describe, it, expect } from 'vitest';
import { QUIZ_TYPE_REGISTRY, selectQuizTypeForPlayer, CEFR_ORDER } from '../quizTypes.js';

describe('QUIZ_TYPE_REGISTRY', () => {
  it('exports exactly 21 quiz types', () => {
    expect(Object.keys(QUIZ_TYPE_REGISTRY)).toHaveLength(21);
  });

  it('all existing 12 types are present with real minLevel values', () => {
    const existing = [
      'ar-to-en', 'en-to-ar', 'en-to-type-ar', 'listen', 'match',
      'sentence-build', 'root-identify', 'fill-blank', 'category-sort',
      'transliterate', 'conjugation', 'picture-word',
    ];
    existing.forEach(t => {
      expect(QUIZ_TYPE_REGISTRY).toHaveProperty(t);
      expect(QUIZ_TYPE_REGISTRY[t].minLevel).toBeLessThan(999);
    });
  });

  it('active Phase 60 types (GrammarFill, WordOrder, ClozePassage) have real minLevel values', () => {
    expect(QUIZ_TYPE_REGISTRY['GrammarFill'].minLevel).toBe(4);
    expect(QUIZ_TYPE_REGISTRY['GrammarFill'].cefrMin).toBe('A2');
    expect(QUIZ_TYPE_REGISTRY['WordOrder'].minLevel).toBe(5);
    expect(QUIZ_TYPE_REGISTRY['WordOrder'].cefrMin).toBe('B1');
    expect(QUIZ_TYPE_REGISTRY['ClozePassage'].minLevel).toBe(4);
    expect(QUIZ_TYPE_REGISTRY['ClozePassage'].cefrMin).toBe('A2');
  });

  it('Phase 68 types (DialectIdentify, RootExpand, CulturalContext) have minLevel:8 and cefrMin:B2', () => {
    const phase68Types = ['DialectIdentify', 'RootExpand', 'CulturalContext'];
    phase68Types.forEach(t => {
      expect(QUIZ_TYPE_REGISTRY[t].minLevel).toBe(8);
      expect(QUIZ_TYPE_REGISTRY[t].cefrMin).toBe('B2');
    });
  });

  it('every entry has label, cluster, minLevel, and cefrMin fields', () => {
    Object.entries(QUIZ_TYPE_REGISTRY).forEach(([key, entry]) => {
      expect(entry).toHaveProperty('label');
      expect(entry).toHaveProperty('cluster');
      expect(entry).toHaveProperty('minLevel');
      expect(entry).toHaveProperty('cefrMin');
      expect(typeof entry.label).toBe('string');
      expect(typeof entry.cluster).toBe('string');
      expect(typeof entry.minLevel).toBe('number');
    });
  });

  it('clusters are one of the 5 valid cluster IDs', () => {
    const validClusters = ['vocabulary', 'grammar', 'reading', 'roots', 'listening'];
    Object.values(QUIZ_TYPE_REGISTRY).forEach(entry => {
      expect(validClusters).toContain(entry.cluster);
    });
  });
});

describe('CEFR_ORDER', () => {
  it('has correct ordering A1 < A2 < B1 < B2', () => {
    expect(CEFR_ORDER['A1']).toBeLessThan(CEFR_ORDER['A2']);
    expect(CEFR_ORDER['A2']).toBeLessThan(CEFR_ORDER['B1']);
    expect(CEFR_ORDER['B1']).toBeLessThan(CEFR_ORDER['B2']);
  });
});

describe('selectQuizTypeForPlayer', () => {
  it('returns a valid quiz type key', () => {
    const result = selectQuizTypeForPlayer({}, 10, 'A1');
    expect(QUIZ_TYPE_REGISTRY).toHaveProperty(result);
  });

  it('excludes types above player level', () => {
    // Level 1 should only get minLevel <= 1 types
    const results = Array.from({ length: 50 }, () =>
      selectQuizTypeForPlayer({}, 1, null)
    );
    results.forEach(t => {
      expect(QUIZ_TYPE_REGISTRY[t].minLevel).toBeLessThanOrEqual(1);
    });
  });

  it('excludes types above CEFR level', () => {
    // A1 player should never get B1/B2-gated types
    const results = Array.from({ length: 100 }, () =>
      selectQuizTypeForPlayer({}, 10, 'A1')
    );
    results.forEach(t => {
      const entry = QUIZ_TYPE_REGISTRY[t];
      if (entry.cefrMin) {
        expect(CEFR_ORDER['A1']).toBeGreaterThanOrEqual(CEFR_ORDER[entry.cefrMin]);
      }
    });
  });

  it('allows all cefrMin gates when cefrLevel is null (no placement)', () => {
    // With null CEFR, types with cefrMin should still be eligible (if level permits)
    const results = Array.from({ length: 200 }, () =>
      selectQuizTypeForPlayer({}, 10, null)
    );
    // Should include at least some types that have cefrMin set
    const typesWithCefrMin = results.filter(t => QUIZ_TYPE_REGISTRY[t].cefrMin !== null);
    expect(typesWithCefrMin.length).toBeGreaterThan(0);
  });

  it('Phase 68 types appear for B2 players at level 8+', () => {
    const phase68Types = ['DialectIdentify', 'RootExpand', 'CulturalContext'];
    const results = Array.from({ length: 500 }, () =>
      selectQuizTypeForPlayer({}, 10, 'B2')
    );
    // At level 10 B2, at least some Phase 68 types should appear
    const found = results.filter(t => phase68Types.includes(t));
    expect(found.length).toBeGreaterThan(0);
  });

  it('GrammarFill appears in rotation for A2 player at level 4+', () => {
    const results = Array.from({ length: 300 }, () =>
      selectQuizTypeForPlayer({}, 4, 'A2')
    );
    expect(results).toContain('GrammarFill');
  });

  it('GrammarFill does not appear for A1 player', () => {
    const results = Array.from({ length: 200 }, () =>
      selectQuizTypeForPlayer({}, 10, 'A1')
    );
    expect(results).not.toContain('GrammarFill');
  });

  it('WordOrder appears in rotation for B1 player at level 5+', () => {
    const results = Array.from({ length: 300 }, () =>
      selectQuizTypeForPlayer({}, 5, 'B1')
    );
    expect(results).toContain('WordOrder');
  });

  it('WordOrder does not appear for A2 player', () => {
    const results = Array.from({ length: 300 }, () =>
      selectQuizTypeForPlayer({}, 10, 'A2')
    );
    expect(results).not.toContain('WordOrder');
  });

  it('ClozePassage appears in rotation for A2 player at level 4+', () => {
    const results = Array.from({ length: 300 }, () =>
      selectQuizTypeForPlayer({}, 4, 'A2')
    );
    expect(results).toContain('ClozePassage');
  });

  it('biases toward grammar types when grammar cluster is weak', () => {
    const weakAccuracy = { grammar: { correct: 1, total: 5 } }; // 20% = weak
    const results = Array.from({ length: 200 }, () =>
      selectQuizTypeForPlayer(weakAccuracy, 10, 'A1')
    );
    const grammarResults = results.filter(t =>
      QUIZ_TYPE_REGISTRY[t]?.cluster === 'grammar'
    );
    // Should be grammar > 50% of the time (target bias is 70%)
    expect(grammarResults.length).toBeGreaterThan(100);
  });

  it('does NOT bias toward grammar with fewer than 3 grammar questions', () => {
    const tooFewSamples = { grammar: { correct: 0, total: 2 } };
    const results = Array.from({ length: 200 }, () =>
      selectQuizTypeForPlayer(tooFewSamples, 10, 'A1')
    );
    const grammarResults = results.filter(t =>
      QUIZ_TYPE_REGISTRY[t]?.cluster === 'grammar'
    );
    // Without the bias trigger, grammar should not dominate (< 50%)
    expect(grammarResults.length).toBeLessThan(100);
  });

  it('does NOT bias when grammar accuracy is 70% or above', () => {
    const goodAccuracy = { grammar: { correct: 4, total: 5 } }; // 80%
    const results = Array.from({ length: 200 }, () =>
      selectQuizTypeForPlayer(goodAccuracy, 10, 'A1')
    );
    const grammarResults = results.filter(t =>
      QUIZ_TYPE_REGISTRY[t]?.cluster === 'grammar'
    );
    // Without the bias trigger, grammar should not dominate (< 50%)
    expect(grammarResults.length).toBeLessThan(100);
  });

  it('falls back to ar-to-en when no types are eligible', () => {
    // playerLevel 0 filters everything (all types have minLevel >= 1)
    const result = selectQuizTypeForPlayer({}, 0, null);
    expect(result).toBe('ar-to-en');
  });

  it('returns different types across multiple calls (not deterministic)', () => {
    const results = new Set(
      Array.from({ length: 100 }, () => selectQuizTypeForPlayer({}, 10, 'A1'))
    );
    // Should return at least 3 different types
    expect(results.size).toBeGreaterThanOrEqual(3);
  });
});
