/**
 * PlacementTestOverlay.test.jsx
 *
 * Integration-style tests verifying the contract between the overlay and the
 * placement engine. These run as pure unit tests (no DOM rendering required)
 * so they work without a jsdom test environment.
 *
 * Tests cover the 8 required cases from the plan spec.
 */

import { describe, it, expect } from 'vitest';
import { PLACEMENT_ITEMS, PLACEMENT_LEVELS } from '../../../data/placementTest.js';
import {
  assignCefrLevel,
  dropOneTier,
  shouldEarlyExit,
  computeRawScore,
  selectNextItem,
} from '../../../services/placementEngine.js';

const VALID_TYPES = ['ar-to-en', 'en-to-ar', 'fill-blank', 'GrammarFill', 'ClozePassage'];

// ─── Item bank contract ───────────────────────────────────────────────────────

describe('placement items — choice rendering contract', () => {
  it('all items have valid type for choice rendering', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(VALID_TYPES).toContain(item.type);
    });
  });

  it('all item options arrays have exactly 4 elements', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item.options).toHaveLength(4);
    });
  });

  it('no item has undefined correctAnswer', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item.correctAnswer).toBeDefined();
      expect(item.correctAnswer).not.toBeNull();
      expect(typeof item.correctAnswer).toBe('string');
    });
  });

  it('every item correctAnswer is within its options array', () => {
    PLACEMENT_ITEMS.forEach((item) => {
      expect(item.options).toContain(item.correctAnswer);
    });
  });
});

// ─── assignCefrLevel contract ─────────────────────────────────────────────────

describe('assignCefrLevel — result shape', () => {
  it('result has all required fields', () => {
    const result = assignCefrLevel(10, 20);
    expect(result).toHaveProperty('rawLevel');
    expect(result).toHaveProperty('assignedLevel');
    expect(result).toHaveProperty('storedLevel');
    expect(typeof result.rawLevel).toBe('string');
    expect(typeof result.assignedLevel).toBe('string');
    expect(typeof result.storedLevel).toBe('string');
  });

  it('assignedLevel is always a PLACEMENT_LEVELS entry', () => {
    // Test all score/total combinations from the plan spec thresholds
    const tests = [
      { score: 0, total: 20 },
      { score: 4, total: 20 },
      { score: 9, total: 20 },
      { score: 14, total: 20 },
      { score: 19, total: 20 },
      { score: 20, total: 20 },
      { score: 0, total: 10 },
      { score: 10, total: 10 },
    ];
    tests.forEach(({ score, total }) => {
      const result = assignCefrLevel(score, total);
      expect(PLACEMENT_LEVELS).toContain(result.assignedLevel);
    });
  });
});

// ─── dropOneTier contract ─────────────────────────────────────────────────────

describe('dropOneTier — valid levels', () => {
  it('produces a valid PLACEMENT_LEVELS entry for each assignable level', () => {
    // Assignable levels are PLACEMENT_LEVELS (Pre-A1, A1, A2, B1)
    PLACEMENT_LEVELS.forEach((level) => {
      const dropped = dropOneTier(level);
      expect(PLACEMENT_LEVELS).toContain(dropped);
    });
  });

  it('B1 drops to A2', () => {
    expect(dropOneTier('B1')).toBe('A2');
  });

  it('A2 drops to A1', () => {
    expect(dropOneTier('A2')).toBe('A1');
  });

  it('A1 stays at A1 (floor)', () => {
    expect(dropOneTier('A1')).toBe('A1');
  });

  it('Pre-A1 stays at Pre-A1 (floor)', () => {
    expect(dropOneTier('Pre-A1')).toBe('Pre-A1');
  });
});

// ─── shouldEarlyExit contract ─────────────────────────────────────────────────

describe('shouldEarlyExit — return type and logic', () => {
  it('returns boolean', () => {
    const result = shouldEarlyExit([]);
    expect(typeof result).toBe('boolean');
  });

  it('10 consecutive correct answers triggers early exit', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      itemId: `placement_00${i + 1}`,
      correct: true,
    }));
    expect(shouldEarlyExit(answers)).toBe(true);
  });

  it('9 consecutive correct answers does NOT trigger early exit', () => {
    const answers = Array.from({ length: 9 }, (_, i) => ({
      itemId: `placement_00${i + 1}`,
      correct: true,
    }));
    expect(shouldEarlyExit(answers)).toBe(false);
  });

  it('10 answers with one wrong does NOT trigger early exit', () => {
    const answers = [
      { itemId: 'placement_001', correct: false },
      ...Array.from({ length: 9 }, (_, i) => ({
        itemId: `placement_00${i + 2}`,
        correct: true,
      })),
    ];
    expect(shouldEarlyExit(answers)).toBe(false);
  });

  it('more than 10 answers, last 10 all correct triggers early exit', () => {
    const answers = [
      { itemId: 'placement_001', correct: false },
      { itemId: 'placement_002', correct: false },
      ...Array.from({ length: 10 }, (_, i) => ({
        itemId: `placement_0${(i + 3).toString().padStart(2, '0')}`,
        correct: true,
      })),
    ];
    expect(shouldEarlyExit(answers)).toBe(true);
  });
});

// ─── storedLevel Pre-A1 exclusion ─────────────────────────────────────────────

describe('storedLevel — never Pre-A1', () => {
  it('result.storedLevel is always A1 or higher for all score ranges', () => {
    const testCases = Array.from({ length: 21 }, (_, i) => ({ score: i, total: 20 }));
    testCases.forEach(({ score, total }) => {
      const result = assignCefrLevel(score, total);
      expect(result.storedLevel).not.toBe('Pre-A1');
      // Must be a valid upper-level entry (A1, A2, or B1)
      expect(['A1', 'A2', 'B1']).toContain(result.storedLevel);
    });
  });
});

// ─── Overlay-engine integration: question flow ────────────────────────────────

describe('selectNextItem — overlay usage contract', () => {
  it('returns an item from PLACEMENT_ITEMS for fresh state', () => {
    const item = selectNextItem([], 'A1', []);
    expect(item).not.toBeNull();
    expect(PLACEMENT_ITEMS.map((i) => i.id)).toContain(item.id);
  });

  it('never returns an already-answered item', () => {
    const answered = PLACEMENT_ITEMS.slice(0, 15).map((i) => i.id);
    const item = selectNextItem(answered, 'A1', []);
    if (item) {
      expect(answered).not.toContain(item.id);
    }
  });

  it('returns null when 20 or more items answered (test cap)', () => {
    const answered = PLACEMENT_ITEMS.slice(0, 20).map((i) => i.id);
    const result = selectNextItem(answered, 'A1', []);
    expect(result).toBeNull();
  });
});

// ─── computeRawScore contract ──────────────────────────────────────────────────

describe('computeRawScore — overlay score display', () => {
  it('returns 0 for empty answers', () => {
    expect(computeRawScore([])).toBe(0);
  });

  it('counts only correct answers', () => {
    const answers = [
      { itemId: 'p1', correct: true },
      { itemId: 'p2', correct: false },
      { itemId: 'p3', correct: true },
      { itemId: 'p4', correct: true },
    ];
    expect(computeRawScore(answers)).toBe(3);
  });
});
