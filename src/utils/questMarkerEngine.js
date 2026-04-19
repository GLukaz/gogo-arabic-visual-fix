/**
 * Quest Marker Visibility Rule Engine
 *
 * Pure functions that determine what quest marker an NPC should display based
 * on quest state, player progress, and preconditions.
 *
 * Marker types:
 *   'available'   — quest is locked but all preconditions are met (player can start it)
 *   'active'      — quest is currently in progress
 *   'completable' — quest is active and progress has reached the target (ready to turn in)
 *   null          — no relevant quest for this NPC
 *
 * An NPC is matched to a quest via the quest's `npcGiver` field:
 *   - Exact match: quest.npcGiver === npcId
 *   - Prefix match: npcId.startsWith(quest.npcGiver) (e.g. 'guide-amira' matches 'guide')
 */

import { createSelector } from '@reduxjs/toolkit';
import questsData from '../data/quests.json';

// CEFR level ranking used for gate checks
const CEFR_RANK = { A1: 1, A2: 2, B1: 3, B2: 4 };

/**
 * Check whether all preconditions for a quest definition are met by the player.
 *
 * Precondition fields (all optional in quest def):
 *   prerequisites      — string[] of quest IDs that must be 'completed'
 *   cefrRequired       — 'A1'|'A2'|'B1'|'B2' — player must be at or above this level
 *   friendshipRequired — { npcId: string, minimum: number } — friendship must be >= minimum
 *   levelRequired      — number — player level must be >= this
 *
 * @param {Object} questDef - Quest definition object
 * @param {{ [questId]: { status: string } }} questState - Runtime quest status map
 * @param {Object} playerState - Player state snapshot
 * @param {string|null} playerState.cefrLevel - Current CEFR level
 * @param {number} [playerState.level] - Player level
 * @param {{ [npcId]: number }} [playerState.friendship] - Friendship values per NPC
 * @returns {boolean}
 */
export function checkQuestPreconditions(questDef, questState, playerState) {
  // 1. Quest chain: all prerequisite quests must be completed
  const prereqs = questDef.prerequisites ?? [];
  for (const preId of prereqs) {
    const pre = questState[preId];
    if (!pre || pre.status !== 'completed') return false;
  }

  // 2. CEFR gate (optional)
  if (questDef.cefrRequired) {
    const playerRank = CEFR_RANK[playerState.cefrLevel] ?? 0;
    const requiredRank = CEFR_RANK[questDef.cefrRequired] ?? 0;
    if (playerRank < requiredRank) return false;
  }

  // 3. Friendship gate (optional)
  if (questDef.friendshipRequired) {
    const { npcId, minimum } = questDef.friendshipRequired;
    const friendshipVal = playerState.friendship?.[npcId] ?? 0;
    if (friendshipVal < minimum) return false;
  }

  // 4. Level gate (optional)
  if (questDef.levelRequired != null) {
    const playerLevel = playerState.level ?? 1;
    if (playerLevel < questDef.levelRequired) return false;
  }

  return true;
}

/**
 * Determine the quest marker an NPC should show.
 *
 * Priority (highest first):
 *   'completable' — an active quest for this NPC has reached its target
 *   'active'      — an active quest is in progress
 *   'available'   — a locked quest is ready to be accepted
 *   null          — no relevant quest
 *
 * @param {string} npcId
 * @param {{ [questId]: { status: string, progress?: number, rewardClaimed?: boolean } }} questState
 * @param {Object} playerState - { cefrLevel, level, friendship }
 * @param {Array} [questDefs] - Quest definitions (defaults to quests.json)
 * @returns {'available'|'active'|'completable'|null}
 */
export function getNpcQuestMarker(npcId, questState, playerState, questDefs = questsData) {
  let marker = null;

  for (const qd of questDefs) {
    if (!qd.npcGiver) continue;

    // Match NPC: exact match or prefix match (e.g. 'guide' matches 'guide-amira')
    const matches = qd.npcGiver === npcId || npcId.startsWith(qd.npcGiver + '-') || npcId === qd.npcGiver;
    if (!matches) continue;

    const entry = questState[qd.id];
    if (!entry) continue;

    const { status, progress = 0, rewardClaimed = false } = entry;

    // Already rewarded — ignore for marker purposes
    if (status === 'completed' && rewardClaimed) continue;

    if (status === 'active') {
      const target = qd.target ?? 1;
      if (progress >= target) {
        return 'completable'; // Highest priority — return immediately
      }
      if (marker !== 'completable') marker = 'active';
    } else if (status === 'locked' && marker === null) {
      // Check if all preconditions are met
      if (checkQuestPreconditions(qd, questState, playerState)) {
        marker = 'available';
      }
    }
  }

  return marker;
}

/**
 * Return a filtered list of quest definitions the player can currently accept.
 *
 * A quest is available to start when:
 *   - Its current status is 'locked'
 *   - All preconditions are satisfied
 *
 * @param {Object} playerState - { cefrLevel, level, friendship }
 * @param {Array} allQuestDefs - Quest definitions to evaluate
 * @param {{ [questId]: { status: string } }} questState - Runtime quest state
 * @returns {Array} Filtered quest definitions
 */
export function getAvailableQuests(playerState, allQuestDefs, questState) {
  return allQuestDefs.filter((qd) => {
    const entry = questState[qd.id];
    if (!entry || entry.status !== 'locked') return false;
    return checkQuestPreconditions(qd, questState, playerState);
  });
}

/**
 * Memoized Redux selector that returns a map of npcId → marker type for all NPCs.
 *
 * Reads from state.quests.quests, state.npc.friendship, and state.cefrProgress.currentLevel.
 *
 * @returns {{ [npcId: string]: 'available'|'active'|'completable' }}
 */
export const selectNpcMarkers = createSelector(
  [
    (state) => state.quests?.quests ?? {},
    (state) => state.npc?.friendship ?? {},
    (state) => state.cefrProgress?.currentLevel ?? null,
    (state) => state.player?.level ?? 1,
  ],
  (questState, friendship, cefrLevel, level) => {
    const playerState = { cefrLevel, friendship, level };
    const markers = {};

    // Collect all unique npcGiver values from quest defs to build NPC set
    for (const qd of questsData) {
      if (!qd.npcGiver) continue;
      const npcId = qd.npcGiver;
      if (markers[npcId] !== undefined) continue; // already resolved

      const marker = getNpcQuestMarker(npcId, questState, playerState);
      if (marker !== null) {
        markers[npcId] = marker;
      }
    }

    return markers;
  }
);
