/**
 * questChainMiddleware.js
 * GROW-016: When a quest completes, auto-unlock the next quest in its chain.
 *
 * Listens for quests/completeQuest and dispatches activateQuest for the next
 * quest in the chain (if any), plus grants the chain reward on full completion.
 */

import { completeQuest, activateQuest } from '../slices/questSlice.js';
import { addXP } from '../slices/playerSlice.js';
import {
  getNextQuestInChain,
  isChainComplete,
  getChainByQuestId,
  getChainReward,
} from '../../services/questChainService.js';

export const questChainMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === completeQuest.type) {
    const completedQuestId = action.payload;
    const state = store.getState();

    // Unlock next quest in chain
    const nextQuestId = getNextQuestInChain(completedQuestId);
    if (nextQuestId) {
      store.dispatch(activateQuest(nextQuestId));
    }

    // Grant chain reward if the whole chain is now complete
    const chain = getChainByQuestId(completedQuestId);
    if (chain) {
      const complete = isChainComplete(chain.chainId, state.quests);
      if (complete) {
        const reward = getChainReward(chain.chainId);
        if (reward?.xp) {
          store.dispatch(addXP(reward.xp));
        }
      }
    }
  }

  return result;
};
