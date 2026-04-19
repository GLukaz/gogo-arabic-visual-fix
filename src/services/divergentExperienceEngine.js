/**
 * divergentExperienceEngine.js — Pure-function service for the Divergent Experience Engine
 * Phase 76: NAR-01
 *
 * All functions are pure (no React, no Redux, no side effects).
 * They accept slices of state and return derived data.
 *
 * Depends on:
 * - src/data/divergentPaths.js — path definitions, quest chains, zone variations
 * - src/data/factions.js       — getFactionTier, FACTION_TIERS
 */

import {
  DIVERGENT_PATHS,
  QUEST_TO_FACTION_MAP,
  DIVERGENT_QUEST_BY_ID,
} from '../data/divergentPaths.js';
import { getFactionTier, FACTION_TIERS } from '../data/factions.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive the primary faction ID from a faction alignment object.
 * Returns null if no faction has any alignment points.
 *
 * @param {{ [factionId: string]: number }} alignment
 * @returns {string|null}
 */
function derivePrimaryFaction(alignment) {
  if (!alignment) return null;
  const sorted = Object.entries(alignment).sort(([, a], [, b]) => b - a);
  return sorted[0]?.[1] > 0 ? sorted[0][0] : null;
}

/**
 * Check whether a faction score meets or exceeds the friendly tier threshold (25).
 *
 * @param {number} score
 * @returns {boolean}
 */
function isFriendlyOrAbove(score) {
  return score >= FACTION_TIERS.FRIENDLY.threshold;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * shouldShowDivergentContent — is the player eligible for ANY divergent path?
 * True if at least one faction is at friendly (25+) tier.
 *
 * @param {{ alignment: { [factionId: string]: number } }} factionState
 * @returns {boolean}
 */
export function shouldShowDivergentContent(factionState) {
  if (!factionState?.alignment) return false;
  return Object.values(factionState.alignment).some(isFriendlyOrAbove);
}

/**
 * getActivePathForPlayer — returns the divergent path definition for the
 * player's primary faction, or null if no faction is at friendly+.
 *
 * @param {{ alignment: { [factionId: string]: number }, primaryFaction: string|null }} factionState
 * @returns {{ factionId: string, path: object }|null}
 */
export function getActivePathForPlayer(factionState) {
  if (!factionState?.alignment) return null;

  const primaryId = factionState.primaryFaction ?? derivePrimaryFaction(factionState.alignment);
  if (!primaryId) return null;

  const score = factionState.alignment[primaryId] ?? 0;
  if (!isFriendlyOrAbove(score)) return null;

  const path = DIVERGENT_PATHS[primaryId];
  if (!path) return null;

  return { factionId: primaryId, path };
}

/**
 * getZoneVariation — returns zone-specific content for the player's primary
 * faction in the given zone, or null if not eligible.
 *
 * @param {{ alignment: { [factionId: string]: number }, primaryFaction: string|null }} factionState
 * @param {string} zoneName — e.g. 'oasis-village'
 * @returns {{ entryText: { arabic: string, english: string }, availableNpcs: string[], hiddenInteractions: string[] }|null}
 */
export function getZoneVariation(factionState, zoneName) {
  const activePath = getActivePathForPlayer(factionState);
  if (!activePath) return null;

  const variation = activePath.path.zoneVariations[zoneName];
  return variation ?? null;
}

/**
 * getDivergentEntryText — returns the { arabic, english } entry text for a
 * zone based on primary faction, or null if not eligible or zone has no
 * variation for this faction.
 *
 * @param {{ alignment: { [factionId: string]: number }, primaryFaction: string|null }} factionState
 * @param {string} zoneName
 * @returns {{ arabic: string, english: string }|null}
 */
export function getDivergentEntryText(factionState, zoneName) {
  const variation = getZoneVariation(factionState, zoneName);
  return variation?.entryText ?? null;
}

/**
 * getAvailableQuests — returns quest chain quests for the player's primary
 * faction that are currently unlocked (prerequisites met).
 *
 * A quest is "available" when:
 * 1. The player's primary faction matches the quest's faction.
 * 2. The player meets the unlock condition (friendly tier, alignment >= 25).
 * 3. All prerequisite quests in the chain are completed (or it has no prerequisites).
 * 4. The quest itself is NOT already completed.
 *
 * @param {{ alignment: { [factionId: string]: number }, primaryFaction: string|null }} factionState
 * @param {{ quests: { [questId: string]: { status: string } } }} questState — from questSlice
 * @returns {object[]} — array of quest data objects from the chain
 */
export function getAvailableQuests(factionState, questState) {
  const activePath = getActivePathForPlayer(factionState);
  if (!activePath) return [];

  const quests = questState?.quests ?? {};
  const chain = activePath.path.questChain;

  return chain.filter((quest) => {
    // Already completed or already active — not "available to start"
    const questEntry = quests[quest.id];
    if (questEntry && (questEntry.status === 'completed' || questEntry.status === 'active')) {
      return false;
    }

    // Check prerequisites — all must be completed
    const prereqsMet = quest.prerequisites.every((preId) => {
      const pre = quests[preId];
      return pre && pre.status === 'completed';
    });

    return prereqsMet;
  });
}

/**
 * getNextQuestInChain — given a just-completed quest ID, returns the next
 * quest in the same faction's chain, or null if it was the last quest
 * or the quest is not a divergent path quest.
 *
 * @param {string} completedQuestId
 * @returns {object|null} — next quest data object, or null
 */
export function getNextQuestInChain(completedQuestId) {
  const factionId = QUEST_TO_FACTION_MAP[completedQuestId];
  if (!factionId) return null;

  const chain = DIVERGENT_PATHS[factionId]?.questChain;
  if (!chain) return null;

  const currentIndex = chain.findIndex((q) => q.id === completedQuestId);
  if (currentIndex === -1 || currentIndex >= chain.length - 1) return null;

  return chain[currentIndex + 1];
}

/**
 * getDivergentQuestById — look up a divergent path quest by its ID.
 *
 * @param {string} questId
 * @returns {object|null}
 */
export function getDivergentQuestById(questId) {
  return DIVERGENT_QUEST_BY_ID[questId] ?? null;
}

/**
 * getFactionForQuest — look up which faction a divergent quest belongs to.
 *
 * @param {string} questId
 * @returns {string|null} — faction ID or null
 */
export function getFactionForQuest(questId) {
  return QUEST_TO_FACTION_MAP[questId] ?? null;
}

/**
 * getAllPathsStatus — returns an overview of all 6 divergent paths and
 * whether each is unlocked, active, or locked for the current player.
 *
 * @param {{ alignment: { [factionId: string]: number }, primaryFaction: string|null }} factionState
 * @returns {{ factionId: string, theme: string, themeArabic: string, unlocked: boolean, isPrimary: boolean, tier: object }[]}
 */
export function getAllPathsStatus(factionState) {
  const alignment = factionState?.alignment ?? {};
  const primaryId = factionState?.primaryFaction ?? derivePrimaryFaction(alignment);

  return Object.entries(DIVERGENT_PATHS).map(([factionId, path]) => {
    const score = alignment[factionId] ?? 0;
    const tier = getFactionTier(score);
    const unlocked = isFriendlyOrAbove(score);

    return {
      factionId,
      theme: path.theme,
      themeArabic: path.themeArabic,
      unlocked,
      isPrimary: factionId === primaryId,
      tier,
    };
  });
}
