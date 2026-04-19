/**
 * skillTreeRewards.test.js
 *
 * Tests verifying:
 *   1-4. All 4 new reward types (unlock_spell, unlock_dialogue, unlock_zone,
 *        unlock_npc_branch) have at least one node across the 6 skill trees.
 *   5-7. ActionSetExecutor evaluates skill_tree_level requirements correctly
 *        using context.skillTreeUnlocked.
 */

import { describe, it, expect } from 'vitest';
import { SKILL_TREES } from '../skillTrees.js';
import { evaluateActionSets } from '../../game/systems/ActionSetExecutor.js';

// Flatten all nodes from all 6 trees into a single array for data checks
const allNodes = Object.values(SKILL_TREES).flatMap((tree) => tree.nodes);

// ─────────────────────────────────────────────────────────────────────────────
// Reward type existence tests
// ─────────────────────────────────────────────────────────────────────────────

describe('skillTrees reward types', () => {
  it('has at least one unlock_spell node across 6 trees', () => {
    const node = allNodes.find((n) => n.rewards?.type === 'unlock_spell');
    expect(node).toBeDefined();
    expect(typeof node.rewards.value).toBe('string');
  });

  it('has at least one unlock_dialogue node across 6 trees', () => {
    const node = allNodes.find((n) => n.rewards?.type === 'unlock_dialogue');
    expect(node).toBeDefined();
    expect(typeof node.rewards.value).toBe('string');
  });

  it('has at least one unlock_zone node across 6 trees', () => {
    const node = allNodes.find((n) => n.rewards?.type === 'unlock_zone');
    expect(node).toBeDefined();
    expect(typeof node.rewards.value).toBe('string');
  });

  it('has at least one unlock_npc_branch node across 6 trees', () => {
    const node = allNodes.find((n) => n.rewards?.type === 'unlock_npc_branch');
    expect(node).toBeDefined();
    expect(typeof node.rewards.value).toBe('string');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ActionSetExecutor — skill_tree_level requirement evaluation
// ─────────────────────────────────────────────────────────────────────────────

describe('ActionSetExecutor — skill_tree_level requirement', () => {
  const makeActionSets = (treeId, minNodes) => [
    {
      requirements: [{ type: 'skill_tree_level', treeId, minNodes }],
      actions: [{ type: 'ACTION_DIALOGUE', payload: { text: 'test' } }],
    },
  ];

  it('matches when unlocked count meets minNodes', () => {
    const context = {
      skillTreeUnlocked: { grammar: ['grammar_01', 'grammar_02', 'grammar_03'] },
    };
    const result = evaluateActionSets(makeActionSets('grammar', 3), context);
    expect(result).not.toBeNull();
  });

  it('does not match when unlocked count is below minNodes', () => {
    const context = {
      skillTreeUnlocked: { grammar: ['grammar_01', 'grammar_02', 'grammar_03'] },
    };
    const result = evaluateActionSets(makeActionSets('grammar', 5), context);
    expect(result).toBeNull();
  });

  it('handles missing tree gracefully (returns false)', () => {
    const context = {
      skillTreeUnlocked: {},
    };
    const result = evaluateActionSets(makeActionSets('grammar', 1), context);
    expect(result).toBeNull();
  });

  it('matches when unlocked count exceeds minNodes', () => {
    const context = {
      skillTreeUnlocked: { reading: ['reading_01', 'reading_02', 'reading_03', 'reading_04', 'reading_05'] },
    };
    const result = evaluateActionSets(makeActionSets('reading', 3), context);
    expect(result).not.toBeNull();
  });

  it('matches when minNodes defaults to 1 with at least one unlocked node', () => {
    // No minNodes field — defaults to 1
    const actionSets = [
      {
        requirements: [{ type: 'skill_tree_level', treeId: 'writing' }],
        actions: [{ type: 'ACTION_DIALOGUE', payload: { text: 'test' } }],
      },
    ];
    const context = {
      skillTreeUnlocked: { writing: ['writing_01'] },
    };
    const result = evaluateActionSets(actionSets, context);
    expect(result).not.toBeNull();
  });

  it('does not match when skillTreeUnlocked is absent from context', () => {
    // context has no skillTreeUnlocked key at all
    const context = {};
    const result = evaluateActionSets(makeActionSets('culture', 1), context);
    expect(result).toBeNull();
  });
});
