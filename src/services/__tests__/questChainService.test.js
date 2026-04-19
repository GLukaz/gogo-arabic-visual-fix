/**
 * questChainService.test.js
 * GROW-016 — Quest chain progression logic
 */
import { describe, it, expect } from 'vitest';
import {
  getNextQuestInChain,
  isChainComplete,
  getChainProgress,
  getChainReward,
  getChainByQuestId,
} from '../questChainService.js';
import { QUEST_CHAINS } from '../../data/questChains.js';

// Build a mock questState where all quests in a given chain are completed
function mockQuestState(completedIds = [], activeIds = [], lockedIds = []) {
  const quests = {};
  for (const id of completedIds) quests[id] = { status: 'completed' };
  for (const id of activeIds) quests[id] = { status: 'active' };
  for (const id of lockedIds) quests[id] = { status: 'locked' };
  return { quests };
}

// First chain for convenience
const chain0 = QUEST_CHAINS[0]; // chain_oasis_scholar
const [q0, q1, q2] = chain0.quests;

describe('QUEST_CHAINS dataset', () => {
  it('has exactly 5 chains', () => {
    expect(QUEST_CHAINS).toHaveLength(5);
  });

  it('each chain has 3-5 quests', () => {
    for (const chain of QUEST_CHAINS) {
      expect(chain.quests.length).toBeGreaterThanOrEqual(3);
      expect(chain.quests.length).toBeLessThanOrEqual(5);
    }
  });

  it('each chain has a chainReward with xp', () => {
    for (const chain of QUEST_CHAINS) {
      expect(chain.chainReward.xp).toBeGreaterThan(0);
    }
  });
});

describe('getNextQuestInChain', () => {
  it('returns the second quest when first is completed', () => {
    expect(getNextQuestInChain(q0)).toBe(q1);
  });

  it('returns the third quest when second is completed', () => {
    expect(getNextQuestInChain(q1)).toBe(q2);
  });

  it('returns null for the last quest in a chain', () => {
    const lastQuest = chain0.quests[chain0.quests.length - 1];
    expect(getNextQuestInChain(lastQuest)).toBeNull();
  });

  it('returns null for a quest not in any chain', () => {
    expect(getNextQuestInChain('nonexistent_quest')).toBeNull();
  });
});

describe('isChainComplete', () => {
  it('returns true when all quests in chain are completed', () => {
    const state = mockQuestState(chain0.quests);
    expect(isChainComplete(chain0.chainId, state)).toBe(true);
  });

  it('returns false when some quests are not completed', () => {
    const state = mockQuestState([q0], [q1], [q2]);
    expect(isChainComplete(chain0.chainId, state)).toBe(false);
  });

  it('returns false when quests map is empty', () => {
    const state = mockQuestState();
    expect(isChainComplete(chain0.chainId, state)).toBe(false);
  });

  it('returns false for unknown chainId', () => {
    const state = mockQuestState(chain0.quests);
    expect(isChainComplete('nonexistent_chain', state)).toBe(false);
  });
});

describe('getChainProgress', () => {
  it('reports correct completed count', () => {
    const state = mockQuestState([q0], [q1], [q2]);
    const progress = getChainProgress(chain0.chainId, state);
    expect(progress.completed).toBe(1);
    expect(progress.total).toBe(chain0.quests.length);
  });

  it('identifies the current active quest', () => {
    const state = mockQuestState([q0], [q1], [q2]);
    const progress = getChainProgress(chain0.chainId, state);
    expect(progress.currentQuest).toBe(q1);
  });

  it('returns full chainReward in progress object', () => {
    const state = mockQuestState();
    const progress = getChainProgress(chain0.chainId, state);
    expect(progress.chainReward).toEqual(chain0.chainReward);
  });

  it('returns null currentQuest when all completed', () => {
    const state = mockQuestState(chain0.quests);
    const progress = getChainProgress(chain0.chainId, state);
    expect(progress.currentQuest).toBeNull();
  });

  it('returns zero progress for unknown chain', () => {
    const state = mockQuestState(chain0.quests);
    const progress = getChainProgress('nonexistent_chain', state);
    expect(progress.completed).toBe(0);
    expect(progress.total).toBe(0);
    expect(progress.chainReward).toBeNull();
  });
});

describe('getChainReward', () => {
  it('returns reward for a known chain', () => {
    const reward = getChainReward(chain0.chainId);
    expect(reward).toBeDefined();
    expect(reward.xp).toBeGreaterThan(0);
  });

  it('returns null for unknown chain', () => {
    expect(getChainReward('nonexistent')).toBeNull();
  });
});

describe('getChainByQuestId', () => {
  it('returns the chain that contains a quest', () => {
    const chain = getChainByQuestId(q0);
    expect(chain.chainId).toBe(chain0.chainId);
  });

  it('returns null for unknown quest', () => {
    expect(getChainByQuestId('not_a_chain_quest')).toBeNull();
  });
});
