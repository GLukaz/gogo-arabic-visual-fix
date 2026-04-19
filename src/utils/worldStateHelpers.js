/**
 * worldStateHelpers.js
 * Utility helpers for querying narrative world state from the Redux store.
 *
 * These are pure functions that accept the store state (or a selector result)
 * so they can be used both inside and outside React components.
 */

import { store } from '../store/store.js';

/**
 * Zone-to-story-flag mapping.
 * Each zone lists the story flags relevant to its local arc completion.
 */
const ZONE_STORY_FLAGS = {
  oasis_village: [
    'met_mentor',
    'met_scholar_yusuf',
    'manuscript_returned_scholar',
    'manuscript_kept_merchant',
    'scholar_path',
    'merchant_path',
  ],
  ancient_library: [
    'library_access_granted',
    'lost_chapter_found',
  ],
  desert_marketplace: [
    'marketplace_mediation_complete',
    'warehouse_key_obtained',
  ],
  farmland: [
    'farm_blessing_received',
  ],
  bedouin_camp: [
    'chose_caravan_route',
    'chose_ruins_shortcut',
    'caravan_path',
    'ruins_path',
    'learned_ancient_script',
    'star_map_unlocked',
  ],
  mountain_village: [
    'healer_trial_passed',
    'mountain_hermit_met',
  ],
  coastal_port: [
    'port_passage_secured',
  ],
  royal_palace: [
    'palace_audience_granted',
    'palace_scholar',
    'palace_merchant',
    'palace_scholar_identity',
    'palace_merchant_identity',
  ],
};

/**
 * Checks whether a world object is in the expected state.
 *
 * @param {string} objectId   — the world object identifier (e.g. "desert_bridge")
 * @param {string} expectedState — the state string to compare against (e.g. "open")
 * @param {object} [state]    — optional Redux state; reads from store if omitted
 * @returns {boolean}
 */
export function isWorldObjectInState(objectId, expectedState, state) {
  const s = state || store.getState();
  const currentState = s.narrative?.worldObjectStates?.[objectId] ?? null;
  return currentState === expectedState;
}

/**
 * Returns all story flags relevant to a specific zone,
 * along with their current values.
 *
 * @param {string} zoneId — one of the 8 zone identifiers
 * @param {object} [state] — optional Redux state; reads from store if omitted
 * @returns {{ flag: string, value: any }[]} — array of { flag, value } objects
 */
export function getZoneCompletionFlags(zoneId, state) {
  const s = state || store.getState();
  const flags = ZONE_STORY_FLAGS[zoneId] || [];
  const storyFlags = s.narrative?.storyFlags || {};

  return flags.map((flag) => ({
    flag,
    value: Object.prototype.hasOwnProperty.call(storyFlags, flag)
      ? storyFlags[flag]
      : null,
  }));
}

/**
 * Convenience: returns the number of set (non-null) story flags for a zone.
 *
 * @param {string} zoneId
 * @param {object} [state]
 * @returns {number}
 */
export function getZoneCompletionCount(zoneId, state) {
  return getZoneCompletionFlags(zoneId, state).filter((f) => f.value !== null).length;
}

/**
 * Convenience: returns the total number of expected flags for a zone.
 *
 * @param {string} zoneId
 * @returns {number}
 */
export function getZoneTotalFlags(zoneId) {
  return (ZONE_STORY_FLAGS[zoneId] || []).length;
}

/**
 * Returns all world object states (shallow copy).
 *
 * @param {object} [state]
 * @returns {Record<string, string>}
 */
export function getAllWorldObjectStates(state) {
  const s = state || store.getState();
  return { ...s.narrative.worldObjectStates };
}

/**
 * Returns the exported zone-flag mapping for external use.
 * @returns {Record<string, string[]>}
 */
export function getZoneStoryFlagMap() {
  return { ...ZONE_STORY_FLAGS };
}
