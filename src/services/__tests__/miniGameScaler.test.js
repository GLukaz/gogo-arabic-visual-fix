/**
 * miniGameScaler.test.js
 * GROW-023 — Mini-game difficulty scaling service
 */
import { describe, it, expect } from 'vitest';
import {
  getWordSearchParams,
  getCrosswordParams,
  getMemoryMatchParams,
  getNumberChallengeParams,
} from '../miniGameScaler.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOW  = { cefr: 'A1', level: 1 };
const _MID  = { cefr: 'B1', level: 25 };
const HIGH = { cefr: 'C2', level: 50 }; // C2 + max level = difficulty 1.0

// ── getWordSearchParams ───────────────────────────────────────────────────────

describe('getWordSearchParams', () => {
  it('returns minimum params at A1 level 1', () => {
    const p = getWordSearchParams(LOW.cefr, LOW.level);
    expect(p.gridSize).toBe(8);
    expect(p.wordCount).toBe(5);
    expect(p.allowDiagonals).toBe(false);
  });

  it('returns maximum params at C1 level 50', () => {
    const p = getWordSearchParams(HIGH.cefr, HIGH.level);
    expect(p.gridSize).toBe(15);
    expect(p.wordCount).toBe(15);
    expect(p.allowDiagonals).toBe(true);
  });

  it('gridSize is clamped between 8 and 15', () => {
    for (const [cefr, level] of [['A1', 1], ['A2', 10], ['B1', 25], ['C1', 50]]) {
      const { gridSize } = getWordSearchParams(cefr, level);
      expect(gridSize).toBeGreaterThanOrEqual(8);
      expect(gridSize).toBeLessThanOrEqual(15);
    }
  });

  it('wordCount is clamped between 5 and 15', () => {
    for (const [cefr, level] of [['A1', 1], ['B2', 30], ['C1', 50]]) {
      const { wordCount } = getWordSearchParams(cefr, level);
      expect(wordCount).toBeGreaterThanOrEqual(5);
      expect(wordCount).toBeLessThanOrEqual(15);
    }
  });

  it('timeLimit is clamped between 120 and 300', () => {
    const low = getWordSearchParams('A1', 1).timeLimit;
    const high = getWordSearchParams('C1', 50).timeLimit;
    expect(low).toBeGreaterThanOrEqual(290); // near max at lowest difficulty
    expect(low).toBeLessThanOrEqual(300);
    expect(high).toBeGreaterThanOrEqual(120);
    expect(high).toBeLessThanOrEqual(300);
  });

  it('scales up from low to high difficulty', () => {
    const low = getWordSearchParams(LOW.cefr, LOW.level);
    const high = getWordSearchParams(HIGH.cefr, HIGH.level);
    expect(high.gridSize).toBeGreaterThan(low.gridSize);
    expect(high.wordCount).toBeGreaterThan(low.wordCount);
  });

  it('handles unknown cefrLevel gracefully (defaults to A1)', () => {
    const p = getWordSearchParams('Z9', 1);
    expect(p.gridSize).toBeGreaterThanOrEqual(8);
    expect(p.wordCount).toBeGreaterThanOrEqual(5);
  });
});

// ── getCrosswordParams ────────────────────────────────────────────────────────

describe('getCrosswordParams', () => {
  it('returns minimum params at A1 level 1', () => {
    const p = getCrosswordParams(LOW.cefr, LOW.level);
    expect(p.clueCount).toBe(5);
    expect(p.gridComplexity).toBe(1);
    expect(p.showLetterHints).toBe(true);
  });

  it('returns maximum params at C1 level 50', () => {
    const p = getCrosswordParams(HIGH.cefr, HIGH.level);
    expect(p.clueCount).toBe(20);
    expect(p.gridComplexity).toBe(3);
    expect(p.showLetterHints).toBe(false);
  });

  it('clueCount is clamped between 5 and 20', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C2', 50]]) {
      const { clueCount } = getCrosswordParams(cefr, level);
      expect(clueCount).toBeGreaterThanOrEqual(5);
      expect(clueCount).toBeLessThanOrEqual(20);
    }
  });

  it('gridComplexity is clamped between 1 and 3', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C1', 50]]) {
      const { gridComplexity } = getCrosswordParams(cefr, level);
      expect(gridComplexity).toBeGreaterThanOrEqual(1);
      expect(gridComplexity).toBeLessThanOrEqual(3);
    }
  });

  it('scales up from low to high difficulty', () => {
    const low = getCrosswordParams(LOW.cefr, LOW.level);
    const high = getCrosswordParams(HIGH.cefr, HIGH.level);
    expect(high.clueCount).toBeGreaterThan(low.clueCount);
    expect(high.gridComplexity).toBeGreaterThanOrEqual(low.gridComplexity);
  });
});

// ── getMemoryMatchParams ──────────────────────────────────────────────────────

describe('getMemoryMatchParams', () => {
  it('returns minimum params at A1 level 1', () => {
    const p = getMemoryMatchParams(LOW.cefr, LOW.level);
    expect(p.pairCount).toBe(4);
    expect(p.timeLimit).toBe(120);
  });

  it('returns maximum params at C1 level 50', () => {
    const p = getMemoryMatchParams(HIGH.cefr, HIGH.level);
    expect(p.pairCount).toBe(12);
    expect(p.timeLimit).toBe(60);
  });

  it('pairCount is clamped between 4 and 12', () => {
    for (const [cefr, level] of [['A1', 1], ['B2', 40], ['C1', 50]]) {
      const { pairCount } = getMemoryMatchParams(cefr, level);
      expect(pairCount).toBeGreaterThanOrEqual(4);
      expect(pairCount).toBeLessThanOrEqual(12);
    }
  });

  it('timeLimit is clamped between 60 and 120', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C1', 50]]) {
      const { timeLimit } = getMemoryMatchParams(cefr, level);
      expect(timeLimit).toBeGreaterThanOrEqual(60);
      expect(timeLimit).toBeLessThanOrEqual(120);
    }
  });

  it('harder difficulty yields more pairs and less time', () => {
    const low = getMemoryMatchParams(LOW.cefr, LOW.level);
    const high = getMemoryMatchParams(HIGH.cefr, HIGH.level);
    expect(high.pairCount).toBeGreaterThan(low.pairCount);
    expect(high.timeLimit).toBeLessThan(low.timeLimit);
  });
});

// ── getNumberChallengeParams ──────────────────────────────────────────────────

describe('getNumberChallengeParams', () => {
  it('returns minimum params at A1 level 1', () => {
    const p = getNumberChallengeParams(LOW.cefr, LOW.level);
    expect(p.digitCount).toBe(1);
    expect(p.operations).toEqual(['addition']);
    expect(p.questionCount).toBe(5);
  });

  it('returns maximum params at C1 level 50', () => {
    const p = getNumberChallengeParams(HIGH.cefr, HIGH.level);
    expect(p.digitCount).toBe(4);
    expect(p.operations).toContain('division');
    expect(p.questionCount).toBe(15);
  });

  it('digitCount is clamped between 1 and 4', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C1', 50]]) {
      const { digitCount } = getNumberChallengeParams(cefr, level);
      expect(digitCount).toBeGreaterThanOrEqual(1);
      expect(digitCount).toBeLessThanOrEqual(4);
    }
  });

  it('operations array grows with difficulty', () => {
    const a1 = getNumberChallengeParams('A1', 1).operations;
    const b2 = getNumberChallengeParams('B2', 40).operations;
    const c1 = getNumberChallengeParams('C1', 50).operations;
    expect(a1.length).toBeLessThan(c1.length);
    expect(b2.length).toBeLessThanOrEqual(c1.length);
  });

  it('always includes addition', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C1', 50]]) {
      const { operations } = getNumberChallengeParams(cefr, level);
      expect(operations).toContain('addition');
    }
  });

  it('timePerQuestion is clamped between 10 and 30', () => {
    for (const [cefr, level] of [['A1', 1], ['B1', 25], ['C1', 50]]) {
      const { timePerQuestion } = getNumberChallengeParams(cefr, level);
      expect(timePerQuestion).toBeGreaterThanOrEqual(10);
      expect(timePerQuestion).toBeLessThanOrEqual(30);
    }
  });

  it('player level beyond 50 is clamped', () => {
    const p = getNumberChallengeParams('A1', 999);
    expect(p.digitCount).toBeGreaterThanOrEqual(1);
    expect(p.digitCount).toBeLessThanOrEqual(4);
  });
});
