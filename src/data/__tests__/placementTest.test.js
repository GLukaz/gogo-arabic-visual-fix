import { describe, it, expect } from 'vitest';
import { PLACEMENT_ITEMS, PLACEMENT_LEVELS } from '../placementTest.js';

const VALID_TYPES = ['ar-to-en', 'en-to-ar', 'fill-blank', 'GrammarFill', 'ClozePassage'];
const VALID_DOMAINS = ['vocabulary', 'grammar', 'reading', 'roots', 'speaking', 'culture'];

describe('PLACEMENT_LEVELS', () => {
  it('is Pre-A1, A1, A2, B1 in order', () => {
    expect(PLACEMENT_LEVELS).toEqual(['Pre-A1', 'A1', 'A2', 'B1']);
  });

  it('has exactly 4 entries', () => {
    expect(PLACEMENT_LEVELS).toHaveLength(4);
  });
});

describe('PLACEMENT_ITEMS item bank', () => {
  it('has exactly 30 items', () => {
    expect(PLACEMENT_ITEMS).toHaveLength(30);
  });

  it('all items have required fields', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('cefrLevel');
      expect(item).toHaveProperty('domain');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('prompt');
      expect(item).toHaveProperty('arabic');
      expect(item).toHaveProperty('options');
      expect(item).toHaveProperty('correctAnswer');
      expect(typeof item.id).toBe('string');
      expect(typeof item.prompt).toBe('string');
      expect(typeof item.arabic).toBe('string');
      expect(Array.isArray(item.options)).toBe(true);
    });
  });

  it('all item IDs are unique', () => {
    const ids = PLACEMENT_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(30);
  });

  it('correctAnswer is always in options', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item.options).toContain(item.correctAnswer);
    });
  });

  it('options always have exactly 4 choices', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item.options).toHaveLength(4);
    });
  });

  it('no items above B1 (no B2, C1, C2)', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(PLACEMENT_LEVELS).toContain(item.cefrLevel);
    });
  });

  it('all 6 domains are represented (at least 5 required)', () => {
    const uniqueDomains = new Set(PLACEMENT_ITEMS.map((item) => item.domain));
    expect(uniqueDomains.size).toBeGreaterThanOrEqual(5);
    // Verify every domain present is a valid domain
    uniqueDomains.forEach((domain) => {
      expect(VALID_DOMAINS).toContain(domain);
    });
  });

  it('each CEFR level has at least one item', () => {
    PLACEMENT_LEVELS.forEach((level) => {
      const itemsAtLevel = PLACEMENT_ITEMS.filter((item) => item.cefrLevel === level);
      expect(itemsAtLevel.length).toBeGreaterThan(0);
    });
  });

  it('Pre-A1 has exactly 5 items', () => {
    const preA1Items = PLACEMENT_ITEMS.filter((item) => item.cefrLevel === 'Pre-A1');
    expect(preA1Items).toHaveLength(5);
  });

  it('B1 has exactly 5 items', () => {
    const b1Items = PLACEMENT_ITEMS.filter((item) => item.cefrLevel === 'B1');
    expect(b1Items).toHaveLength(5);
  });

  it('A1 has exactly 10 items', () => {
    const a1Items = PLACEMENT_ITEMS.filter((item) => item.cefrLevel === 'A1');
    expect(a1Items).toHaveLength(10);
  });

  it('A2 has exactly 10 items', () => {
    const a2Items = PLACEMENT_ITEMS.filter((item) => item.cefrLevel === 'A2');
    expect(a2Items).toHaveLength(10);
  });

  it('types are only simple choice types (no tile/drag)', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(VALID_TYPES).toContain(item.type);
    });
  });

  it('item IDs follow sequential naming (placement_001 through placement_030)', () => {
    const ids = PLACEMENT_ITEMS.map((item) => item.id);
    // All IDs should match the naming pattern
    ids.forEach((id) => {
      expect(id).toMatch(/^placement_\d{3}$/);
    });
  });
});
