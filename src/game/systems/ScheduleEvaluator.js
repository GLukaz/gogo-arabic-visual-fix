/**
 * ScheduleEvaluator.js
 *
 * Pure utility for evaluating NPC schedule entries against current game time and zone.
 * No side effects, no imports, no external dependencies.
 *
 * Derived from the Majora's Mask / Animal Crossing schedule pattern:
 * declarative schedule arrays evaluated at spawn time and on phase change.
 */

/**
 * Evaluates an NPC's schedule to find the currently active entry.
 *
 * @param {Object} npc - The NPC data object (from npcsEnriched.js or npcs.json)
 * @param {number} currentHour - Current game hour (0-23)
 * @param {string} currentZone - Current zone identifier (e.g. 'oasis_village')
 * @param {Object} storyFlags - Map of story flag keys to truthy/falsy values
 * @returns {Object|null} The first matching schedule entry, or null if no match
 */
export function evaluateSchedule(npc, currentHour, currentZone, storyFlags) {
  if (!npc.schedule || npc.schedule.length === 0) return null;

  for (const entry of npc.schedule) {
    // Zone must match
    if (entry.zone !== currentZone) continue;

    // Hour range check — handles midnight wrap-around (e.g. 20:00-07:00)
    const inRange =
      entry.startHour <= entry.endHour
        ? currentHour >= entry.startHour && currentHour < entry.endHour
        : currentHour >= entry.startHour || currentHour < entry.endHour;

    if (!inRange) continue;

    // Optional story flag gate: skip if required flag is not set
    if (entry.requireFlag) {
      const flagValue = storyFlags?.[entry.requireFlag];
      if (!flagValue) continue;
    }

    return entry; // First matching entry wins (priority = array order)
  }

  return null; // No active schedule for this zone/time
}

/**
 * Returns true if the NPC should be spawned in the given zone at the given hour.
 * NPCs without a schedule array always return true (backward compatible).
 *
 * @param {Object} npc - The NPC data object (from npcsEnriched.js or npcs.json)
 * @param {number} currentHour - Current game hour (0-23)
 * @param {string} currentZone - Current zone identifier (e.g. 'oasis_village')
 * @param {Object} storyFlags - Map of story flag keys to truthy/falsy values
 * @returns {boolean} Whether the NPC should spawn at this time and zone
 */
export function shouldSpawnNpc(npc, currentHour, currentZone, storyFlags) {
  if (!npc.schedule || npc.schedule.length === 0) return true;
  return evaluateSchedule(npc, currentHour, currentZone, storyFlags) !== null;
}
