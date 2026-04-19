/**
 * readingSlice.test.js
 *
 * Tests for reading slice reducers, selectors, and stats calculation.
 * Phase 82 (READ-01 + READ-02)
 */

import { describe, it, expect } from 'vitest';
import readingReducer, {
  startPassage,
  completePassage,
  resetCurrent,
  selectCompletedPassages,
  selectReadingStats,
  selectCurrentPassage,
  selectPassageScore,
} from '../readingSlice.js';

function getInitialState() {
  return JSON.parse(JSON.stringify(readingReducer(undefined, { type: '@@INIT' })));
}

describe('readingSlice — reducers', () => {
  it('returns correct initial state', () => {
    const state = getInitialState();
    expect(state.completedPassages).toEqual({});
    expect(state.currentPassageId).toBeNull();
    expect(state.readingStats.totalRead).toBe(0);
    expect(state.readingStats.averageScore).toBe(0);
    expect(state.readingStats.passagesPerLevel).toEqual({ A1: 0, A2: 0, B1: 0, B2: 0 });
  });

  it('startPassage sets currentPassageId', () => {
    const state = getInitialState();
    const next = readingReducer(state, startPassage({ passageId: 'a1_001' }));
    expect(next.currentPassageId).toBe('a1_001');
  });

  it('completePassage adds to completedPassages and clears current', () => {
    let state = getInitialState();
    state = readingReducer(state, startPassage({ passageId: 'a1_001' }));
    const next = readingReducer(
      state,
      completePassage({
        passageId: 'a1_001',
        score: 0.8,
        wordsEncountered: ['exp_a1_031', 'exp_a1_162'],
      }),
    );

    expect(next.completedPassages['a1_001']).toBeDefined();
    expect(next.completedPassages['a1_001'].score).toBe(0.8);
    expect(next.completedPassages['a1_001'].wordsEncountered).toEqual(['exp_a1_031', 'exp_a1_162']);
    expect(next.completedPassages['a1_001'].completedAt).toBeGreaterThan(0);
    expect(next.currentPassageId).toBeNull();
  });

  it('completePassage defaults wordsEncountered to empty array', () => {
    let state = getInitialState();
    const next = readingReducer(
      state,
      completePassage({ passageId: 'a1_002', score: 1.0 }),
    );
    expect(next.completedPassages['a1_002'].wordsEncountered).toEqual([]);
  });

  it('resetCurrent clears currentPassageId', () => {
    let state = getInitialState();
    state = readingReducer(state, startPassage({ passageId: 'a1_003' }));
    expect(state.currentPassageId).toBe('a1_003');

    const next = readingReducer(state, resetCurrent());
    expect(next.currentPassageId).toBeNull();
  });

  it('completing multiple passages updates stats', () => {
    let state = getInitialState();
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_001', score: 0.8, wordsEncountered: [] }),
    );
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_002', score: 1.0, wordsEncountered: [] }),
    );

    expect(state.readingStats.totalRead).toBe(2);
    expect(state.readingStats.averageScore).toBe(0.9);
  });

  it('completing a passage again updates the score (overwrite)', () => {
    let state = getInitialState();
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_001', score: 0.5, wordsEncountered: [] }),
    );
    expect(state.completedPassages['a1_001'].score).toBe(0.5);

    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_001', score: 1.0, wordsEncountered: [] }),
    );
    expect(state.completedPassages['a1_001'].score).toBe(1.0);
    // totalRead should still be 1 (same passage)
    expect(state.readingStats.totalRead).toBe(1);
  });
});

describe('readingSlice — selectors', () => {
  it('selectCompletedPassages returns completedPassages', () => {
    const root = { reading: getInitialState() };
    expect(selectCompletedPassages(root)).toEqual({});
  });

  it('selectCompletedPassages handles missing reading state', () => {
    expect(selectCompletedPassages({})).toEqual({});
  });

  it('selectReadingStats returns stats', () => {
    const root = { reading: getInitialState() };
    const stats = selectReadingStats(root);
    expect(stats.totalRead).toBe(0);
    expect(stats.averageScore).toBe(0);
  });

  it('selectReadingStats handles missing reading state', () => {
    const stats = selectReadingStats({});
    expect(stats.totalRead).toBe(0);
  });

  it('selectCurrentPassage returns currentPassageId', () => {
    const root = { reading: { ...getInitialState(), currentPassageId: 'b1_005' } };
    expect(selectCurrentPassage(root)).toBe('b1_005');
  });

  it('selectCurrentPassage handles missing reading state', () => {
    expect(selectCurrentPassage({})).toBeNull();
  });

  it('selectPassageScore returns score for completed passage', () => {
    const root = {
      reading: {
        ...getInitialState(),
        completedPassages: {
          a1_001: { score: 0.75, completedAt: Date.now(), wordsEncountered: [] },
        },
      },
    };
    const selector = selectPassageScore('a1_001');
    expect(selector(root)).toBe(0.75);
  });

  it('selectPassageScore returns null for non-completed passage', () => {
    const root = { reading: getInitialState() };
    const selector = selectPassageScore('nonexistent');
    expect(selector(root)).toBeNull();
  });
});

describe('readingSlice — stats calculation', () => {
  it('averageScore is rounded to 2 decimal places', () => {
    let state = getInitialState();
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_001', score: 0.333, wordsEncountered: [] }),
    );
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_002', score: 0.667, wordsEncountered: [] }),
    );
    // (0.333 + 0.667) / 2 = 0.5
    expect(state.readingStats.averageScore).toBe(0.5);
  });

  it('passagesPerLevel tracks correct levels', () => {
    let state = getInitialState();
    state = readingReducer(
      state,
      completePassage({ passageId: 'a1_001', score: 1, wordsEncountered: [] }),
    );
    state = readingReducer(
      state,
      completePassage({ passageId: 'a2_001', score: 1, wordsEncountered: [] }),
    );
    state = readingReducer(
      state,
      completePassage({ passageId: 'b1_001', score: 1, wordsEncountered: [] }),
    );

    expect(state.readingStats.passagesPerLevel.A1).toBe(1);
    expect(state.readingStats.passagesPerLevel.A2).toBe(1);
    expect(state.readingStats.passagesPerLevel.B1).toBe(1);
    expect(state.readingStats.passagesPerLevel.B2).toBe(0);
  });
});
