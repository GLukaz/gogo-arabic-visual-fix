/**
 * vocabCollections.test.js
 * GROW-022 — Vocabulary themed collections dataset
 */
import { describe, it, expect } from 'vitest';
import {
  VOCAB_COLLECTIONS,
  selectCollection,
  selectCollectionsByLevel,
  selectWordCountByCollection,
  selectCollectionProgress,
} from '../vocabCollections.js';
import vocabularyAll from '../vocabularyAll.js';
import VOCABULARY_EXPANDED from '../vocabularyExpanded.js';

// Build a Set of all valid word IDs across all vocabulary sources.
// vocabularyAll (sync) contains curated + vocabulary-final A1-A2 (after Arabic-text dedup).
// VOCABULARY_EXPANDED contains all exp_* IDs (B1-B2 and A1-A2 extended).
const ALL_WORD_IDS = new Set([
  ...vocabularyAll.map((w) => w.id),
  ...VOCABULARY_EXPANDED.map((w) => w.id),
]);

// ── Structure tests ───────────────────────────────────────────────────────────

describe('VOCAB_COLLECTIONS structure', () => {
  it('has exactly 10 collections', () => {
    expect(VOCAB_COLLECTIONS).toHaveLength(10);
  });

  it('total word count exceeds 900', () => {
    const total = VOCAB_COLLECTIONS.reduce((sum, c) => sum + c.wordIds.length, 0);
    expect(total).toBeGreaterThanOrEqual(900);
  });

  it('all collections have required fields', () => {
    for (const col of VOCAB_COLLECTIONS) {
      expect(col.id, 'missing id').toBeTruthy();
      expect(col.name, `${col.id}: missing name`).toBeTruthy();
      expect(col.nameArabic, `${col.id}: missing nameArabic`).toBeTruthy();
      expect(col.description, `${col.id}: missing description`).toBeTruthy();
      expect(col.cefrRange, `${col.id}: missing cefrRange`).toBeTruthy();
      expect(Array.isArray(col.wordIds), `${col.id}: wordIds must be array`).toBe(true);
      expect(col.wordIds.length, `${col.id}: wordIds must not be empty`).toBeGreaterThan(0);
    }
  });

  it('all collection IDs are unique', () => {
    const ids = VOCAB_COLLECTIONS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each collection has at least 90 words', () => {
    for (const col of VOCAB_COLLECTIONS) {
      expect(col.wordIds.length, `${col.id} has only ${col.wordIds.length} words`).toBeGreaterThanOrEqual(90);
    }
  });

  it('cefrRange uses valid CEFR levels', () => {
    const valid = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    for (const col of VOCAB_COLLECTIONS) {
      const parts = col.cefrRange.split('-');
      for (const p of parts) {
        expect(valid, `${col.id}: invalid cefrRange part ${p}`).toContain(p);
      }
    }
  });
});

// ── Word reference validity ────────────────────────────────────────────────────

describe('VOCAB_COLLECTIONS word references', () => {
  it('all wordIds within each collection are unique', () => {
    for (const col of VOCAB_COLLECTIONS) {
      expect(
        new Set(col.wordIds).size,
        `${col.id} has duplicate wordIds`
      ).toBe(col.wordIds.length);
    }
  });

  it('all wordIds exist in vocabularyAll', () => {
    const missing = [];
    for (const col of VOCAB_COLLECTIONS) {
      for (const id of col.wordIds) {
        if (!ALL_WORD_IDS.has(id)) {
          missing.push(`${col.id}: ${id}`);
        }
      }
    }
    if (missing.length > 0) {
      throw new Error(`Missing word IDs:\n${missing.slice(0, 10).join('\n')}`);
    }
    expect(missing).toHaveLength(0);
  });
});

// ── Selector tests ────────────────────────────────────────────────────────────

describe('selectCollection', () => {
  it('returns the correct collection by id', () => {
    const col = selectCollection('greetings_social');
    expect(col).toBeDefined();
    expect(col.id).toBe('greetings_social');
  });

  it('returns null for unknown id', () => {
    expect(selectCollection('does_not_exist')).toBeNull();
  });
});

describe('selectCollectionsByLevel', () => {
  it('returns A1 collections for level A1', () => {
    const cols = selectCollectionsByLevel('A1');
    expect(cols.length).toBeGreaterThan(0);
    for (const col of cols) {
      expect(col.cefrRange).toMatch(/A1/);
    }
  });

  it('returns B1 collections for level B1', () => {
    const cols = selectCollectionsByLevel('B1');
    expect(cols.length).toBeGreaterThan(0);
  });

  it('A1-A2 collections appear for both A1 and A2 queries', () => {
    const a1 = selectCollectionsByLevel('A1').map((c) => c.id);
    const a2 = selectCollectionsByLevel('A2').map((c) => c.id);
    const multiCefr = VOCAB_COLLECTIONS.filter((c) => c.cefrRange === 'A1-A2').map((c) => c.id);
    for (const id of multiCefr) {
      expect(a1).toContain(id);
      expect(a2).toContain(id);
    }
  });

  it('returns empty array for C2 (no C2 collections exist)', () => {
    expect(selectCollectionsByLevel('C2')).toHaveLength(0);
  });
});

describe('selectWordCountByCollection', () => {
  it('returns an object with an entry per collection', () => {
    const counts = selectWordCountByCollection();
    expect(Object.keys(counts)).toHaveLength(10);
  });

  it('counts match actual wordIds length', () => {
    const counts = selectWordCountByCollection();
    for (const col of VOCAB_COLLECTIONS) {
      expect(counts[col.id]).toBe(col.wordIds.length);
    }
  });
});

describe('selectCollectionProgress', () => {
  const colId = 'numbers_time_colors';
  const col = VOCAB_COLLECTIONS.find((c) => c.id === colId);

  it('returns null for unknown collection id', () => {
    expect(selectCollectionProgress('nonexistent', [])).toBeNull();
  });

  it('returns 0% when no words mastered', () => {
    const result = selectCollectionProgress(colId, []);
    expect(result.completed).toBe(0);
    expect(result.pct).toBe(0);
    expect(result.total).toBe(col.wordIds.length);
  });

  it('returns 100% when all words mastered', () => {
    const result = selectCollectionProgress(colId, col.wordIds);
    expect(result.completed).toBe(col.wordIds.length);
    expect(result.pct).toBe(100);
  });

  it('calculates partial progress correctly', () => {
    const half = col.wordIds.slice(0, Math.floor(col.wordIds.length / 2));
    const result = selectCollectionProgress(colId, half);
    expect(result.completed).toBe(half.length);
    expect(result.pct).toBe(Math.round((half.length / col.wordIds.length) * 100));
  });

  it('accepts a Set as masteredWordIds', () => {
    const mastered = new Set(col.wordIds.slice(0, 10));
    const result = selectCollectionProgress(colId, mastered);
    expect(result.completed).toBe(10);
  });

  it('ignores mastered words not in the collection', () => {
    const result = selectCollectionProgress(colId, ['some_other_word', 'another_word']);
    expect(result.completed).toBe(0);
  });
});
