/**
 * grammarRules.test.js
 * GROW-018 — Arabic grammar rules reference dataset
 */
import { describe, it, expect } from 'vitest';
import {
  GRAMMAR_RULES,
  selectRuleById,
  selectRulesByLevel,
  selectRulesByCategory,
} from '../grammarRules.js';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
const VALID_CATEGORIES = ['nouns', 'verbs', 'particles', 'sentence_structure', 'morphology', 'idafa', 'verb_forms'];

describe('GRAMMAR_RULES dataset', () => {
  it('has 60+ rules', () => {
    expect(GRAMMAR_RULES.length).toBeGreaterThanOrEqual(60);
  });

  it('all rules have required fields', () => {
    for (const rule of GRAMMAR_RULES) {
      expect(rule.id, `${rule.id}: missing id`).toBeTruthy();
      expect(rule.title, `${rule.id}: missing title`).toBeTruthy();
      expect(rule.titleArabic, `${rule.id}: missing titleArabic`).toBeTruthy();
      expect(VALID_LEVELS, `${rule.id}: invalid cefrLevel`).toContain(rule.cefrLevel);
      expect(VALID_CATEGORIES, `${rule.id}: invalid category`).toContain(rule.category);
      expect(rule.explanation, `${rule.id}: missing explanation`).toBeTruthy();
      expect(Array.isArray(rule.examples), `${rule.id}: examples must be array`).toBe(true);
      expect(rule.examples.length, `${rule.id}: need at least 1 example`).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(rule.commonMistakes), `${rule.id}: commonMistakes must be array`).toBe(true);
      expect(Array.isArray(rule.practiceTemplates), `${rule.id}: practiceTemplates must be array`).toBe(true);
    }
  });

  it('all IDs are unique', () => {
    const ids = GRAMMAR_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all examples have arabic, english, breakdown fields', () => {
    for (const rule of GRAMMAR_RULES) {
      for (const ex of rule.examples) {
        expect(ex.arabic, `${rule.id}: example missing arabic`).toBeTruthy();
        expect(ex.english, `${rule.id}: example missing english`).toBeTruthy();
        expect(ex.breakdown, `${rule.id}: example missing breakdown`).toBeTruthy();
      }
    }
  });

  it('has 15 A1 rules', () => {
    expect(selectRulesByLevel('A1').length).toBe(15);
  });

  it('has 15 A2 rules', () => {
    expect(selectRulesByLevel('A2').length).toBe(15);
  });

  it('has 15 B1 rules', () => {
    expect(selectRulesByLevel('B1').length).toBe(15);
  });

  it('has 10 B2 rules', () => {
    expect(selectRulesByLevel('B2').length).toBe(10);
  });

  it('has 5 C1 rules', () => {
    expect(selectRulesByLevel('C1').length).toBe(5);
  });

  it('covers all required categories', () => {
    const usedCategories = new Set(GRAMMAR_RULES.map((r) => r.category));
    for (const cat of VALID_CATEGORIES) {
      expect(usedCategories, `missing category: ${cat}`).toContain(cat);
    }
  });
});

describe('selectRuleById', () => {
  it('returns correct rule for known id', () => {
    const rule = selectRuleById('gr_a1_001');
    expect(rule).not.toBeNull();
    expect(rule.cefrLevel).toBe('A1');
  });

  it('returns null for unknown id', () => {
    expect(selectRuleById('nonexistent')).toBeNull();
  });
});

describe('selectRulesByLevel', () => {
  it('filters correctly to B1', () => {
    const b1 = selectRulesByLevel('B1');
    expect(b1.every((r) => r.cefrLevel === 'B1')).toBe(true);
    expect(b1.length).toBeGreaterThan(0);
  });

  it('returns empty array for invalid level', () => {
    expect(selectRulesByLevel('D9')).toHaveLength(0);
  });
});

describe('selectRulesByCategory', () => {
  it('filters correctly to verb_forms', () => {
    const vf = selectRulesByCategory('verb_forms');
    expect(vf.every((r) => r.category === 'verb_forms')).toBe(true);
    expect(vf.length).toBeGreaterThan(0);
  });

  it('returns empty array for unknown category', () => {
    expect(selectRulesByCategory('unknown')).toHaveLength(0);
  });
});
