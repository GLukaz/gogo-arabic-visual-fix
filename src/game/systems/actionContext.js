/**
 * actionContext.js
 *
 * Shared utility for building the action context snapshot used by
 * ActionSetExecutor.evaluateActionSets() to check requirements against
 * current game state.
 *
 * Extracted from NPCManager.js (Phase 34-03) so both NPCManager and
 * WorldScene can import it without duplication.
 */

import { store } from '../../store/store.js';
import { selectGameTime } from '../../store/slices/timeSlice.js';

/**
 * Build the action context snapshot from Redux state.
 * Used by evaluateActionSets to check quest statuses, flags, player stats, etc.
 *
 * @param {string} [zoneOverride] - Optional zone override (e.g. from WorldScene.currentZone).
 *   When omitted, falls back to Redux player.currentZone.
 * @returns {Object} Context object for ActionSetExecutor requirement evaluation:
 *   questStatuses, storyFlags, vocabMastery, playerLevel, inventory,
 *   currentHour, currentZone, factionScores, skillTreeUnlocked
 */
export function buildActionContext(zoneOverride) {
  const state = store.getState();
  return {
    questStatuses: state.quest?.statuses || {},
    storyFlags: state.narrative?.storyFlags || {},
    vocabMastery: state.vocabulary?.stats?.accuracy || 0,
    playerLevel: state.player?.level || 1,
    inventory: state.inventory?.items?.map((i) => i.id) || [],
    currentHour: selectGameTime(state).hour,
    currentZone: zoneOverride || state.player?.currentZone || 'oasis_village',
    factionScores: state.faction?.alignment || {},
    skillTreeUnlocked: state.skillTree?.unlockedNodes || {},
  };
}
