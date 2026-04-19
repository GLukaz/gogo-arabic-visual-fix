/**
 * loreMiddleware — Auto-discovers lore entries when game events match triggers.
 * Phase 79 (NAR-04).
 *
 * Listens for:
 *   - quest/completeQuest          → 'quest_complete:{questId}'
 *   - faction/adjustAlignment      → 'faction_tier:{factionId}:{tier}' (on threshold crossing)
 *   - worldState/setFlag           → 'zone_visit:{zone}' (for zone discovery flags)
 *   - vocabulary/addFsrsCard       → 'word_learn:{wordId}'
 *   - npc/recordDialogue           → 'npc_talk:{npcId}'
 *   - player/addXp                 → 'level_reach:{level}' (on level-up)
 */

import { getLoreEntriesByTrigger } from '../../data/loreEntries.js';
import { discoverEntry } from '../slices/loreSlice.js';

const FACTION_TIERS = [
  { threshold: 25, name: 'friendly' },
  { threshold: 50, name: 'trusted' },
  { threshold: 75, name: 'allied' },
  { threshold: 100, name: 'revered' },
];

function getTierName(alignment) {
  let tier = null;
  for (const t of FACTION_TIERS) {
    if (alignment >= t.threshold) tier = t.name;
  }
  return tier;
}

const loreMiddleware = (store) => (next) => (action) => {
  // Let the action process first
  const result = next(action);

  // Skip during hydration / persistence
  if (action.type?.startsWith('persist/')) return result;

  const state = store.getState();
  const discovered = state.lore?.discovered ?? {};

  /** Helper: discover all entries matching a trigger string */
  function tryDiscover(triggerString) {
    const entries = getLoreEntriesByTrigger(triggerString);
    for (const entry of entries) {
      if (!discovered[entry.id]) {
        store.dispatch(discoverEntry({ id: entry.id, trigger: triggerString }));
      }
    }
  }

  switch (action.type) {
    // Quest completion
    case 'quests/completeQuest': {
      const questId = action.payload?.questId ?? action.payload;
      if (questId) tryDiscover(`quest_complete:${questId}`);
      break;
    }

    // Faction alignment change — check for tier crossing
    case 'faction/adjustAlignment': {
      const { factionId } = action.payload ?? {};
      if (!factionId) break;
      const alignment = state.faction?.alignment?.[factionId] ?? 0;
      const tierName = getTierName(alignment);
      if (tierName) {
        tryDiscover(`faction_tier:${factionId}:${tierName}`);
      }
      break;
    }

    // Zone discovery via world state flags
    case 'worldState/setFlag': {
      const flagKey = action.payload?.key ?? '';
      // Zone discovery flags follow pattern: ZONE_{NAME}_DISCOVERED
      const zoneMatch = flagKey.match(/^ZONE_(.+)_DISCOVERED$/);
      if (zoneMatch) {
        const zoneName = zoneMatch[1].toLowerCase().replace(/_/g, '-');
        tryDiscover(`zone_visit:${zoneName}`);
      }
      break;
    }

    // Vocabulary learning
    case 'vocabulary/addFsrsCard': {
      const wordId = action.payload?.wordId ?? action.payload?.id;
      if (wordId) tryDiscover(`word_learn:${wordId}`);
      break;
    }

    // NPC dialogue
    case 'npc/recordDialogue': {
      const npcId = action.payload?.npcId;
      if (npcId) tryDiscover(`npc_talk:${npcId}`);
      break;
    }

    // Level up — check all level thresholds
    case 'player/addXp': {
      const level = state.player?.level;
      if (level) tryDiscover(`level_reach:${level}`);
      break;
    }

    // Battle wins
    case 'battle/recordVictory': {
      const wins = state.battle?.totalVictories ?? state.player?.battlesWon;
      if (wins) {
        for (const milestone of [5, 10, 25, 50, 100]) {
          if (wins >= milestone) tryDiscover(`battle_win:${milestone}`);
        }
      }
      break;
    }

    default:
      break;
  }

  return result;
};

export default loreMiddleware;
