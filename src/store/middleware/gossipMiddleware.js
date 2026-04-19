/**
 * gossipMiddleware.js — Creates gossip tokens on quest completion and notable NPC interactions
 *
 * GOSP-01: Listens for quest completion and notable NPC friendship changes
 * GOSP-02: Propagates tokens only to NPCs with friendship >= 25 (state.npc.friendship)
 * GOSP-02: Tokens expire after 3 game-days (expiresDay = currentDay + 3)
 * GOSP-02: Prunes expired tokens on time/tickTime and time/advanceTime
 *
 * Follows factionMiddleware.js pattern exactly:
 * - Re-entrancy guard (_isProcessingGossip)
 * - persist/ action early return
 * - pass-through first (next(action)), then react
 * - Uses state.npc.friendship (NOT state.narrative.npcRelationships which is 0-5 tier)
 */

import { addGossipToken, pruneExpiredTokens } from '../slices/gossipSlice.js';
import { selectDayCount } from '../slices/timeSlice.js';
import { GOSSIP_TEMPLATES } from '../../data/gossipTemplates.js';

// Re-entrancy guard — prevents recursive dispatch cascade
let _isProcessingGossip = false;

export const gossipMiddleware = (store) => (next) => (action) => {
  // Never intercept redux-persist internal actions
  if (action.type?.startsWith('persist/')) return next(action);

  const result = next(action);

  // Prevent re-entrant dispatch cascade
  if (_isProcessingGossip) return result;
  _isProcessingGossip = true;

  try {
    // GOSP-01: Create gossip tokens on quest completion
    if (action.type === 'quests/completeQuest') {
      const questId = action.payload?.questId || action.payload;
      const template = GOSSIP_TEMPLATES[questId];
      if (template) {
        _propagateGossip(store, template, questId);
      }
    }

    // GOSP-01: Create gossip on notable NPC interaction (friendship delta > 5)
    if (action.type === 'npc/adjustFriendship' || action.type === 'npc/updateFriendship') {
      const delta = action.payload?.delta || action.payload?.amount || 0;
      if (Math.abs(delta) > 5) {
        const npcId = action.payload?.npcId;
        if (npcId) {
          // Generic interaction gossip (not quest-specific)
          _propagateGossip(store, {
            topic: `npc_interaction_${npcId}`,
            arabicLine: 'رَأيتُكَ تَتَحَدَّثُ مَعَ أحَدِ سُكَّانِ القَريَة.',
            englishHint: 'I saw you talking with one of the village residents.',
            grammarNote: 'Past tense: رَأيتُكَ (ra\'aytuka) — I saw you. تَتَحَدَّثُ (tatahaddithu) — talking.',
          }, `npc_notable_${npcId}`);
        }
      }
    }

    // GOSP-02: Prune expired tokens on time advance
    if (action.type === 'time/tickTime' || action.type === 'time/advanceTime') {
      const state = store.getState();
      const currentDay = selectDayCount(state);
      store.dispatch(pruneExpiredTokens({ currentDay }));
    }
  } finally {
    _isProcessingGossip = false;
  }

  return result;
};

/**
 * Propagate a gossip token to all NPCs with friendship >= 25.
 * Uses state.npc.friendship (0-100 scale), NOT state.narrative.npcRelationships (0-5 tier).
 *
 * @param {object} store - Redux store
 * @param {object} template - Gossip template { topic, arabicLine, englishHint, grammarNote }
 * @param {string} sourceId - Unique source identifier for the tokenId
 */
function _propagateGossip(store, template, sourceId) {
  const state = store.getState();
  const currentDay = selectDayCount(state);
  // GOSP-02: Use npcSlice.friendship (0-100), NOT narrativeSlice.npcRelationships (0-5)
  const friendships = state.npc?.friendship ?? {};

  const token = {
    tokenId: `${sourceId}_${Date.now()}`,
    topic: template.topic,
    arabicLine: template.arabicLine,
    englishHint: template.englishHint,
    grammarNote: template.grammarNote,
    createdDay: currentDay,
    expiresDay: currentDay + 3,
    heard: false,
  };

  Object.entries(friendships)
    .filter(([, score]) => score >= 25)
    .forEach(([npcId]) => {
      store.dispatch(addGossipToken({ npcId, token: { ...token } }));
    });
}
