/**
 * questChainService.js
 * GROW-016: Quest chain progression logic.
 *
 * Pure functions — no Redux dependency. Consumers pass questState from the store.
 */

import { QUEST_CHAINS } from '../data/questChains.js';

// Module-level lookup: questId → { chain, indexInChain }
const _questToChain = new Map();
for (const chain of QUEST_CHAINS) {
  chain.quests.forEach((questId, idx) => {
    _questToChain.set(questId, { chain, index: idx });
  });
}

/**
 * getChainByQuestId(questId) — returns the chain that contains this quest, or null.
 */
export function getChainByQuestId(questId) {
  return _questToChain.get(questId)?.chain ?? null;
}

/**
 * getNextQuestInChain(completedQuestId) — returns the next quest ID after
 * the given completed quest, or null if it's the last quest in the chain.
 */
export function getNextQuestInChain(completedQuestId) {
  const entry = _questToChain.get(completedQuestId);
  if (!entry) return null;
  const { chain, index } = entry;
  const nextIndex = index + 1;
  return nextIndex < chain.quests.length ? chain.quests[nextIndex] : null;
}

/**
 * isChainComplete(chainId, questState) — returns true if every quest in the chain
 * has status 'completed'.
 *
 * @param {string} chainId
 * @param {Object} questState — Redux quests slice state ({ quests: { [id]: { status } } })
 */
export function isChainComplete(chainId, questState) {
  const chain = QUEST_CHAINS.find((c) => c.chainId === chainId);
  if (!chain) return false;
  return chain.quests.every(
    (qId) => questState.quests[qId]?.status === 'completed'
  );
}

/**
 * getChainProgress(chainId, questState) — returns progress object.
 *
 * @returns {{ completed: number, total: number, currentQuest: string|null, chainReward: object }}
 */
export function getChainProgress(chainId, questState) {
  const chain = QUEST_CHAINS.find((c) => c.chainId === chainId);
  if (!chain) return { completed: 0, total: 0, currentQuest: null, chainReward: null };

  const completed = chain.quests.filter(
    (qId) => questState.quests[qId]?.status === 'completed'
  ).length;

  const currentQuest =
    chain.quests.find(
      (qId) => questState.quests[qId]?.status === 'active'
    ) ??
    chain.quests.find(
      (qId) => questState.quests[qId]?.status === 'locked'
    ) ??
    null;

  return {
    completed,
    total: chain.quests.length,
    currentQuest,
    chainReward: chain.chainReward,
  };
}

/**
 * getChainReward(chainId) — returns the chain reward object, or null.
 */
export function getChainReward(chainId) {
  return QUEST_CHAINS.find((c) => c.chainId === chainId)?.chainReward ?? null;
}
