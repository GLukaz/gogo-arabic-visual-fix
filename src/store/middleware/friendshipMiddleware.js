import { adjustFriendship } from '../slices/npcSlice.js';

// Friendship deltas by event type
const FRIENDSHIP_DELTAS = {
  correctAnswer: 2,      // Answered quiz correctly during NPC interaction
  gift: 5,               // Gave a gift to NPC
  questComplete: 10,     // Completed a quest for this NPC
  ignored: -1,           // Walked away during dialogue (future)
  wrongAnswer: -1,       // Wrong quiz answer during NPC interaction
};

export const friendshipMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Listen to quiz completion during NPC context
  // NOTE: 'quiz/recordAnswer' is a future action type — no quiz slice exists yet
  if (action.type === 'quiz/recordAnswer') {
    const { correct, context } = action.payload || {};
    if (context?.npcId) {
      const delta = correct ? FRIENDSHIP_DELTAS.correctAnswer : FRIENDSHIP_DELTAS.wrongAnswer;
      store.dispatch(adjustFriendship({ npcId: context.npcId, delta, reason: correct ? 'correctAnswer' : 'wrongAnswer' }));
    }
  }

  // Listen to quest completion
  // Slice name is 'quests' → action type is 'quests/completeQuest'
  if (action.type === 'quests/completeQuest') {
    const { questId, npcId } = action.payload || {};
    if (npcId) {
      store.dispatch(adjustFriendship({ npcId, delta: FRIENDSHIP_DELTAS.questComplete, reason: 'questComplete' }));
    }
  }

  // Listen to gift giving from companion system
  // Slice name is 'companions' → action type is 'companions/giveGift'
  // Also handle future npc/giveGift action for NPC-scoped gifts
  if (action.type === 'npc/giveGift' || action.type === 'companions/giveGift') {
    const { npcId } = action.payload || {};
    if (npcId) {
      store.dispatch(adjustFriendship({ npcId, delta: FRIENDSHIP_DELTAS.gift, reason: 'gift' }));
    }
  }

  return result;
};
