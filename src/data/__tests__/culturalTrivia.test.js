/**
 * culturalTrivia.test.js
 * GROW-015 — Arabic cultural trivia dataset tests
 */
import { describe, it, expect } from 'vitest';
import {
  CULTURAL_TRIVIA,
  selectTriviaByCategory,
  selectRandomTrivia,
  selectTriviaByEra,
} from '../culturalTrivia.js';

const VALID_CATEGORIES = ['history', 'food', 'science', 'art', 'music', 'architecture', 'literature', 'language', 'geography', 'customs'];
const VALID_CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const VALID_ERAS = ['ancient', 'classical', 'medieval', 'modern', 'contemporary'];

describe('CULTURAL_TRIVIA dataset', () => {
  it('has 200 or more entries', () => {
    expect(CULTURAL_TRIVIA.length).toBeGreaterThanOrEqual(200);
  });

  it('all 10 categories are represented', () => {
    const categories = new Set(CULTURAL_TRIVIA.map(t => t.category));
    for (const cat of VALID_CATEGORIES) {
      expect(categories.has(cat)).toBe(true);
    }
  });

  it('has approximately 20 entries per category (at least 18)', () => {
    for (const cat of VALID_CATEGORIES) {
      const count = CULTURAL_TRIVIA.filter(t => t.category === cat).length;
      expect(count).toBeGreaterThanOrEqual(18);
    }
  });

  it('all entries have required fields: id, fact, factArabic, category, cefrLevel, region, era', () => {
    for (const entry of CULTURAL_TRIVIA) {
      expect(entry.id, `${entry.id} missing id`).toBeTruthy();
      expect(entry.fact, `${entry.id} missing fact`).toBeTruthy();
      expect(entry.factArabic, `${entry.id} missing factArabic`).toBeTruthy();
      expect(entry.category, `${entry.id} missing category`).toBeTruthy();
      expect(entry.cefrLevel, `${entry.id} missing cefrLevel`).toBeTruthy();
      expect(entry.region, `${entry.id} missing region`).toBeTruthy();
      expect(entry.era, `${entry.id} missing era`).toBeTruthy();
    }
  });

  it('all entry IDs are unique', () => {
    const ids = CULTURAL_TRIVIA.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all category values are from the defined set', () => {
    for (const entry of CULTURAL_TRIVIA) {
      expect(VALID_CATEGORIES).toContain(entry.category);
    }
  });

  it('all cefrLevel values are valid', () => {
    for (const entry of CULTURAL_TRIVIA) {
      expect(VALID_CEFR).toContain(entry.cefrLevel);
    }
  });

  it('all era values are valid', () => {
    for (const entry of CULTURAL_TRIVIA) {
      expect(VALID_ERAS).toContain(entry.era);
    }
  });

  it('all facts are non-empty strings', () => {
    for (const entry of CULTURAL_TRIVIA) {
      expect(typeof entry.fact).toBe('string');
      expect(entry.fact.length).toBeGreaterThan(10);
      expect(typeof entry.factArabic).toBe('string');
      expect(entry.factArabic.length).toBeGreaterThan(5);
    }
  });
});

// ── selectTriviaByCategory ─────────────────────────────────────────────────

describe('selectTriviaByCategory', () => {
  it('returns only entries for the requested category', () => {
    const results = selectTriviaByCategory('history');
    expect(results.every(t => t.category === 'history')).toBe(true);
  });

  it('returns at least 18 entries for each category', () => {
    for (const cat of VALID_CATEGORIES) {
      const results = selectTriviaByCategory(cat);
      expect(results.length).toBeGreaterThanOrEqual(18);
    }
  });

  it('returns an empty array for an unknown category', () => {
    const results = selectTriviaByCategory('nonexistent');
    expect(results).toEqual([]);
  });
});

// ── selectRandomTrivia ─────────────────────────────────────────────────────

describe('selectRandomTrivia', () => {
  it('returns exactly the requested count', () => {
    const results = selectRandomTrivia(10);
    expect(results.length).toBe(10);
  });

  it('returns an empty array when count is 0', () => {
    expect(selectRandomTrivia(0)).toEqual([]);
  });

  it('returned entries have all required fields', () => {
    const results = selectRandomTrivia(5);
    for (const entry of results) {
      expect(entry.id).toBeTruthy();
      expect(entry.fact).toBeTruthy();
      expect(entry.factArabic).toBeTruthy();
    }
  });

  it('does not exceed total dataset size', () => {
    const results = selectRandomTrivia(10000);
    expect(results.length).toBeLessThanOrEqual(CULTURAL_TRIVIA.length);
  });
});

// ── selectTriviaByEra ──────────────────────────────────────────────────────

describe('selectTriviaByEra', () => {
  it('returns only entries for the requested era', () => {
    const results = selectTriviaByEra('medieval');
    expect(results.every(t => t.era === 'medieval')).toBe(true);
  });

  it('medieval era has the most entries (Islamic Golden Age)', () => {
    const medieval = selectTriviaByEra('medieval').length;
    const ancient = selectTriviaByEra('ancient').length;
    const contemporary = selectTriviaByEra('contemporary').length;
    expect(medieval).toBeGreaterThan(ancient);
    expect(medieval).toBeGreaterThan(contemporary);
  });

  it('returns an empty array for an unknown era', () => {
    const results = selectTriviaByEra('future');
    expect(results).toEqual([]);
  });

  it('all five eras have at least one entry', () => {
    for (const era of VALID_ERAS) {
      const results = selectTriviaByEra(era);
      expect(results.length).toBeGreaterThan(0);
    }
  });
});
