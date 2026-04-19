import { describe, it, expect } from 'vitest';
import {
  selectNextItem,
  computeRawScore,
  assignCefrLevel,
  dropOneTier,
  shouldEarlyExit,
  deriveGrammarUnlocks,
  deriveSkillTreeUnlocks,
} from '../placementEngine.js';
import { PLACEMENT_ITEMS } from '../../data/placementTest.js';
import { grammarLessons } from '../../data/grammar.js';
import { SKILL_TREE_ORDER } from '../../data/skillTrees.js';

// ─────────────────────────────────────────────────────────────────────────────
// assignCefrLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('assignCefrLevel', () => {
  it('100% score: rawLevel B1, assignedLevel A2', () => {
    const result = assignCefrLevel(30, 30);
    expect(result.rawLevel).toBe('B1');
    expect(result.assignedLevel).toBe('A2');
  });

  it('0% score: rawLevel Pre-A1, assignedLevel Pre-A1 (floor)', () => {
    const result = assignCefrLevel(0, 30);
    expect(result.rawLevel).toBe('Pre-A1');
    expect(result.assignedLevel).toBe('Pre-A1');
  });

  it('75%+ score (23/30 = 76.7%): rawLevel B1, assignedLevel A2', () => {
    const result = assignCefrLevel(23, 30);
    expect(result.rawLevel).toBe('B1');
    expect(result.assignedLevel).toBe('A2');
  });

  it('50-74% score (18/30 = 60%): rawLevel A2, assignedLevel A1', () => {
    const result = assignCefrLevel(18, 30);
    expect(result.rawLevel).toBe('A2');
    expect(result.assignedLevel).toBe('A1');
  });

  it('25-49% score (10/30 = 33%): rawLevel A1, assignedLevel Pre-A1', () => {
    const result = assignCefrLevel(10, 30);
    expect(result.rawLevel).toBe('A1');
    expect(result.assignedLevel).toBe('Pre-A1');
  });

  it('storedLevel maps Pre-A1 to A1 (cefrProgressSlice only stores A1-B2)', () => {
    const result = assignCefrLevel(0, 30); // Pre-A1 assigned
    expect(result.assignedLevel).toBe('Pre-A1');
    expect(result.storedLevel).toBe('A1');
  });

  it('storedLevel equals assignedLevel when assignedLevel is A1', () => {
    const result = assignCefrLevel(18, 30); // A1 assigned
    expect(result.assignedLevel).toBe('A1');
    expect(result.storedLevel).toBe('A1');
  });

  it('storedLevel equals assignedLevel when assignedLevel is A2', () => {
    const result = assignCefrLevel(30, 30); // A2 assigned
    expect(result.assignedLevel).toBe('A2');
    expect(result.storedLevel).toBe('A2');
  });

  it('returns object with rawLevel, assignedLevel, and storedLevel', () => {
    const result = assignCefrLevel(15, 20);
    expect(result).toHaveProperty('rawLevel');
    expect(result).toHaveProperty('assignedLevel');
    expect(result).toHaveProperty('storedLevel');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// dropOneTier
// ─────────────────────────────────────────────────────────────────────────────

describe('dropOneTier', () => {
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

// ─────────────────────────────────────────────────────────────────────────────
// computeRawScore
// ─────────────────────────────────────────────────────────────────────────────

describe('computeRawScore', () => {
  it('counts correct answers', () => {
    const answers = [
      { itemId: 'placement_001', correct: true },
      { itemId: 'placement_002', correct: false },
    ];
    expect(computeRawScore(answers)).toBe(1);
  });

  it('empty array returns 0', () => {
    expect(computeRawScore([])).toBe(0);
  });

  it('all correct returns full count', () => {
    const answers = [
      { itemId: 'a', correct: true },
      { itemId: 'b', correct: true },
      { itemId: 'c', correct: true },
    ];
    expect(computeRawScore(answers)).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// shouldEarlyExit
// ─────────────────────────────────────────────────────────────────────────────

describe('shouldEarlyExit', () => {
  it('false when fewer than 10 answers', () => {
    const answers = Array.from({ length: 9 }, (_, i) => ({
      itemId: `item_${i}`,
      correct: true,
    }));
    expect(shouldEarlyExit(answers)).toBe(false);
  });

  it('true when last 10 are all correct', () => {
    const answers = Array.from({ length: 10 }, (_, i) => ({
      itemId: `item_${i}`,
      correct: true,
    }));
    expect(shouldEarlyExit(answers)).toBe(true);
  });

  it('true when 15 answers and last 10 all correct', () => {
    const early5 = Array.from({ length: 5 }, (_, i) => ({
      itemId: `item_${i}`,
      correct: false,
    }));
    const last10 = Array.from({ length: 10 }, (_, i) => ({
      itemId: `item_${i + 5}`,
      correct: true,
    }));
    expect(shouldEarlyExit([...early5, ...last10])).toBe(true);
  });

  it('false when one wrong in last 10', () => {
    const answers = Array.from({ length: 11 }, (_, i) => ({
      itemId: `item_${i}`,
      correct: i !== 5, // answer at index 5 is wrong
    }));
    expect(shouldEarlyExit(answers)).toBe(false);
  });

  it('false for empty array', () => {
    expect(shouldEarlyExit([])).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectNextItem
// ─────────────────────────────────────────────────────────────────────────────

describe('selectNextItem', () => {
  it('returns an item on first call (no answers yet)', () => {
    const result = selectNextItem([], 'A1', []);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('cefrLevel');
  });

  it('does not return already-answered items', () => {
    const answeredIds = PLACEMENT_ITEMS.slice(0, 5).map((item) => item.id);
    const result = selectNextItem(answeredIds, 'A1', []);
    expect(result).not.toBeNull();
    expect(answeredIds).not.toContain(result.id);
  });

  it('returns null when all items answered', () => {
    const allIds = PLACEMENT_ITEMS.map((item) => item.id);
    expect(selectNextItem(allIds, 'A1', [])).toBeNull();
  });

  it('returns null when 20+ items answered (test cap)', () => {
    const twentyIds = PLACEMENT_ITEMS.slice(0, 20).map((item) => item.id);
    expect(selectNextItem(twentyIds, 'A1', [])).toBeNull();
  });

  it('adjusts level estimate: correct answer at A1 shifts toward A2 items', () => {
    // After a correct answer at A1, estimate moves to A2
    const answers = [{ itemId: 'placement_006', correct: true }];
    const result = selectNextItem(['placement_006'], 'A1', answers);
    expect(result).not.toBeNull();
    // The next item should be at or near A2 level
    expect(['A1', 'A2', 'B1']).toContain(result.cefrLevel);
  });

  it('returns item from adjacent level if current level exhausted', () => {
    // Answer all Pre-A1 items; starting at Pre-A1 should fall back to adjacent
    const preA1Ids = PLACEMENT_ITEMS
      .filter((item) => item.cefrLevel === 'Pre-A1')
      .map((item) => item.id);
    const result = selectNextItem(preA1Ids, 'Pre-A1', []);
    expect(result).not.toBeNull();
    expect(result.cefrLevel).not.toBe('Pre-A1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deriveGrammarUnlocks
// ─────────────────────────────────────────────────────────────────────────────

describe('deriveGrammarUnlocks', () => {
  it('A1 returns only Pre-A1 and A1 cefrLevel lessons', () => {
    const ids = deriveGrammarUnlocks('A1');
    ids.forEach((id) => {
      const lesson = grammarLessons.find((l) => l.id === id);
      expect(lesson).toBeDefined();
      expect(['Pre-A1', 'A1']).toContain(lesson.cefrLevel);
    });
  });

  it('A2 includes all A1 lessons (superset)', () => {
    const a1Ids = deriveGrammarUnlocks('A1');
    const a2Ids = deriveGrammarUnlocks('A2');
    expect(a2Ids.length).toBeGreaterThan(a1Ids.length);
    a1Ids.forEach((id) => expect(a2Ids).toContain(id));
  });

  it('returns lessons sorted by order ascending', () => {
    const ids = deriveGrammarUnlocks('A2');
    const lessons = ids.map((id) => grammarLessons.find((l) => l.id === id));
    const orders = lessons.map((l) => l.order);
    // Should be sorted ascending
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThan(orders[i - 1]);
    }
  });

  it('first returned lesson has order 1 (starts from beginning)', () => {
    const ids = deriveGrammarUnlocks('A1');
    expect(ids.length).toBeGreaterThan(0);
    const firstLesson = grammarLessons.find((l) => l.id === ids[0]);
    expect(firstLesson.order).toBe(1);
  });

  it('Pre-A1 returns no lessons (grammar.js has no Pre-A1 lessons)', () => {
    const ids = deriveGrammarUnlocks('Pre-A1');
    expect(ids).toEqual([]);
  });

  it('B1 returns more lessons than A2 (cumulative superset)', () => {
    const a2Ids = deriveGrammarUnlocks('A2');
    const b1Ids = deriveGrammarUnlocks('B1');
    expect(b1Ids.length).toBeGreaterThan(a2Ids.length);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deriveSkillTreeUnlocks
// ─────────────────────────────────────────────────────────────────────────────

describe('deriveSkillTreeUnlocks', () => {
  it('A1 includes grammar_01 (A1 node) and grammar_02 (A1 node)', () => {
    const unlocks = deriveSkillTreeUnlocks('A1');
    expect(unlocks).toHaveProperty('grammar');
    expect(unlocks.grammar).toContain('grammar_01');
    expect(unlocks.grammar).toContain('grammar_02');
  });

  it('A1 does NOT include grammar_03 (A2 node)', () => {
    const unlocks = deriveSkillTreeUnlocks('A1');
    expect(unlocks.grammar).not.toContain('grammar_03');
  });

  it('A2 includes more total nodes than A1', () => {
    const a1Unlocks = deriveSkillTreeUnlocks('A1');
    const a2Unlocks = deriveSkillTreeUnlocks('A2');
    const a1Count = Object.values(a1Unlocks).flat().length;
    const a2Count = Object.values(a2Unlocks).flat().length;
    expect(a2Count).toBeGreaterThan(a1Count);
  });

  it('A2 includes grammar_03 (A2 node)', () => {
    const unlocks = deriveSkillTreeUnlocks('A2');
    expect(unlocks.grammar).toContain('grammar_03');
  });

  it('returns object with tree IDs as keys', () => {
    const result = deriveSkillTreeUnlocks('A1');
    const keys = Object.keys(result);
    keys.forEach((key) => {
      expect(SKILL_TREE_ORDER).toContain(key);
    });
  });

  it('nodes sorted by xpCost ascending per tree', () => {
    const unlocks = deriveSkillTreeUnlocks('A2');
    const { SKILL_TREES } = require('../../data/skillTrees.js');
    Object.entries(unlocks).forEach(([treeId, nodeIds]) => {
      const tree = SKILL_TREES[treeId];
      const nodeMap = Object.fromEntries(tree.nodes.map((n) => [n.id, n]));
      const costs = nodeIds.map((id) => nodeMap[id].xpCost);
      for (let i = 1; i < costs.length; i++) {
        expect(costs[i]).toBeGreaterThanOrEqual(costs[i - 1]);
      }
    });
  });

  it('Pre-A1 includes Pre-A1 nodes (reading_01, writing_01)', () => {
    const unlocks = deriveSkillTreeUnlocks('Pre-A1');
    expect(unlocks).toHaveProperty('reading');
    expect(unlocks.reading).toContain('reading_01');
    expect(unlocks).toHaveProperty('writing');
    expect(unlocks.writing).toContain('writing_01');
  });

  it('Pre-A1 does NOT include A1 grammar nodes (grammar_01 is A1)', () => {
    const unlocks = deriveSkillTreeUnlocks('Pre-A1');
    // grammar tree has no Pre-A1 nodes, so grammar key may be absent
    if (unlocks.grammar) {
      expect(unlocks.grammar).not.toContain('grammar_01');
    } else {
      expect(unlocks.grammar).toBeUndefined();
    }
  });

  it('only includes trees with at least one eligible node', () => {
    const unlocks = deriveSkillTreeUnlocks('Pre-A1');
    Object.values(unlocks).forEach((nodeIds) => {
      expect(nodeIds.length).toBeGreaterThan(0);
    });
  });
});
