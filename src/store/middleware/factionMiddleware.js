/**
 * factionMiddleware.js — Auto-adjusts faction scores on game events + grants vocab rewards
 *
 * Listens for quest completion, purchases, and dialogue choices.
 * Dispatches adjustAlignment to the factionSlice.
 * Detects tier threshold crossings and grants domain-specific vocabulary rewards.
 * Uses worldState flags to prevent double-firing on score oscillation.
 * Follows achievementMiddleware.js pattern (pass-through first, then react).
 */

import { adjustAlignment } from '../slices/factionSlice.js';
import { FACTION_IDS, NPC_FACTION_MAP } from '../../data/factions.js';
import { FACTION_VOCAB_REWARDS } from '../../data/factionVocab.js';
import { WORLD_STATE_KEYS } from '../../data/worldStateKeys.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';
import { setFlag } from '../slices/worldStateSlice.js';

// Point values for each game event type
const FACTION_POINTS = {
  QUEST_COMPLETE: 10,
  PURCHASE: 5,
  DIALOGUE_CHOICE: 3,
  NPC_INTERACTION: 2,
};

// Quest ID prefix → faction mapping (quests starting with these prefixes grant faction points)
const QUEST_FACTION_MAP = {
  scholars_: FACTION_IDS.SCHOLARS,
  merchants_: FACTION_IDS.MERCHANTS,
  artisans_: FACTION_IDS.ARTISANS,
  travelers_: FACTION_IDS.TRAVELERS,
  guardians_: FACTION_IDS.GUARDIANS,
  artists_: FACTION_IDS.ARTISTS,
  library_: FACTION_IDS.SCHOLARS,
  market_: FACTION_IDS.MERCHANTS,
  craft_: FACTION_IDS.ARTISANS,
  explore_: FACTION_IDS.TRAVELERS,
  guard_: FACTION_IDS.GUARDIANS,
  poetry_: FACTION_IDS.ARTISTS,
};

// Re-entrancy guard (same pattern as achievementMiddleware)
let _isProcessingFaction = false;

/**
 * Determine which faction a quest belongs to based on its ID prefix.
 * Returns null if no faction match.
 */
function getQuestFaction(questId) {
  if (!questId) return null;
  for (const [prefix, factionId] of Object.entries(QUEST_FACTION_MAP)) {
    if (questId.startsWith(prefix)) return factionId;
  }
  return null;
}

/**
 * Tier threshold map: tier key -> { threshold, keySuffix }
 * The keySuffix is combined with factionId to form WORLD_STATE_KEYS lookup.
 */
const TIER_THRESHOLDS = [
  { tier: 'friendly', threshold: 25, keySuffix: 'FRIENDLY' },
  { tier: 'trusted',  threshold: 50, keySuffix: 'TRUSTED'  },
  { tier: 'allied',   threshold: 75, keySuffix: 'ALLIED'   },
];

/**
 * Create a minimal FSRS-compatible card object for new words.
 * Same pattern as craftingVocabMiddleware.js createDefaultCard().
 */
function createDefaultCard() {
  return {
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: 'New',
  };
}

/**
 * Build the WORLD_STATE_KEYS key for a faction+tier combo.
 * e.g., factionId='scholars', keySuffix='FRIENDLY' -> WORLD_STATE_KEYS.FACTION_SCHOLARS_FRIENDLY
 */
function getFactionTierWorldKey(factionId, keySuffix) {
  const keyName = `FACTION_${factionId.toUpperCase()}_${keySuffix}`;
  return WORLD_STATE_KEYS[keyName];
}

/**
 * Check if a tier threshold was crossed and grant vocab rewards.
 * Uses worldState flags to prevent double-firing on score oscillation.
 */
function checkThresholdCrossings(store, factionId, preScore, postScore) {
  const state = store.getState();
  const worldFlags = state.worldState?.flags || {};
  const fsrsCards = state.vocabulary?.fsrsCards || {};

  for (const { tier, threshold, keySuffix } of TIER_THRESHOLDS) {
    // Was below threshold, now at or above
    if (preScore < threshold && postScore >= threshold) {
      const worldKey = getFactionTierWorldKey(factionId, keySuffix);

      // Guard: skip if reward already granted (prevents double-fire on score oscillation)
      if (worldFlags[worldKey]) continue;

      // Mark threshold as crossed in worldState
      if (worldKey) {
        store.dispatch(setFlag({ key: worldKey, value: true }));
      }

      // Grant faction vocabulary words for this tier
      const vocabRewards = FACTION_VOCAB_REWARDS[factionId]?.[tier];
      if (vocabRewards && vocabRewards.length > 0) {
        for (const wordId of vocabRewards) {
          if (!fsrsCards[wordId]) {
            store.dispatch(addFsrsCard({
              wordId,
              card: createDefaultCard(),
              source: `faction_${factionId}_${tier}`,
            }));
          }
        }
      }
    }
  }
}

export const factionMiddleware = (store) => (next) => (action) => {
  // Never intercept redux-persist internal actions
  if (action.type?.startsWith('persist/')) return next(action);

  // Capture pre-action score for threshold comparison (only for adjustAlignment)
  const preScore = action.type === 'faction/adjustAlignment'
    ? (store.getState().faction?.alignment?.[action.payload?.factionId] ?? 0)
    : null;

  const result = next(action);

  // Prevent re-entrant dispatch cascade
  if (_isProcessingFaction) return result;
  _isProcessingFaction = true;

  try {
    // Check threshold crossings after adjustAlignment
    if (action.type === 'faction/adjustAlignment' && preScore !== null) {
      const { factionId } = action.payload;
      const postScore = store.getState().faction?.alignment?.[factionId] ?? 0;
      checkThresholdCrossings(store, factionId, preScore, postScore);
    }

    // Auto-fire faction points from quest completion
    if (action.type === 'quests/completeQuest') {
      const questId = action.payload?.questId || action.payload;
      const factionId = getQuestFaction(questId);
      if (factionId) {
        store.dispatch(adjustAlignment({
          factionId,
          amount: FACTION_POINTS.QUEST_COMPLETE,
        }));
      }
    }

    // Auto-fire faction points from shop purchases
    if (action.type === 'economy/recordPurchase') {
      const shopFaction = action.payload?.factionId;
      if (shopFaction && Object.values(FACTION_IDS).includes(shopFaction)) {
        store.dispatch(adjustAlignment({
          factionId: shopFaction,
          amount: FACTION_POINTS.PURCHASE,
        }));
      }
    }

    // Auto-fire faction points from dialogue choices
    if (action.type === 'narrative/recordDialogueChoice') {
      const factionId = action.payload?.factionId;
      const amount = action.payload?.factionAmount ?? FACTION_POINTS.DIALOGUE_CHOICE;
      if (factionId && Object.values(FACTION_IDS).includes(factionId)) {
        store.dispatch(adjustAlignment({
          factionId,
          amount,
        }));
      }
    }

    // Auto-fire faction points from NPC interactions (friendship increase)
    if (action.type === 'npc/updateFriendship') {
      const npcId = action.payload?.npcId;
      const factionId = NPC_FACTION_MAP[npcId];
      if (factionId) {
        store.dispatch(adjustAlignment({
          factionId,
          amount: FACTION_POINTS.NPC_INTERACTION,
        }));
      }
    }
  } finally {
    _isProcessingFaction = false;
  }

  return result;
};
