/**
 * NPC Schedule System
 * Defines where each NPC is located based on the game hour (0-23).
 * Each NPC has 3-4 schedule blocks covering the full 24-hour cycle.
 *
 * Schedule blocks: { timeStart, timeEnd, location, activity }
 * - timeStart/timeEnd: hours (0-23), timeEnd can be < timeStart for overnight blocks
 * - location: zone ID from zones.js
 * - activity: what the NPC is doing (for dialogue/behavior hints)
 */

/**
 * Full schedule data for all 30 NPCs.
 * Each NPC has 3-4 blocks that cover the entire 24-hour cycle.
 */
export const NPC_SCHEDULES = {
  // === OASIS VILLAGE NPCs ===

  'scholar-yusuf': [
    { timeStart: 5, timeEnd: 8, location: 'oasis_village', activity: 'morning_prayer_and_study' },
    { timeStart: 8, timeEnd: 17, location: 'ancient_library', activity: 'teaching' },
    { timeStart: 17, timeEnd: 21, location: 'oasis_village', activity: 'evening_walk' },
    { timeStart: 21, timeEnd: 5, location: 'oasis_village', activity: 'sleeping' },
  ],

  'merchant-fatima': [
    { timeStart: 6, timeEnd: 12, location: 'oasis_village', activity: 'opening_shop' },
    { timeStart: 12, timeEnd: 14, location: 'oasis_village', activity: 'lunch_break' },
    { timeStart: 14, timeEnd: 21, location: 'desert_marketplace', activity: 'trading' },
    { timeStart: 21, timeEnd: 6, location: 'oasis_village', activity: 'sleeping' },
  ],

  'student-khalid': [
    { timeStart: 7, timeEnd: 12, location: 'ancient_library', activity: 'studying' },
    { timeStart: 12, timeEnd: 15, location: 'oasis_village', activity: 'practicing_arabic' },
    { timeStart: 15, timeEnd: 20, location: 'oasis_village', activity: 'socializing' },
    { timeStart: 20, timeEnd: 7, location: 'oasis_village', activity: 'sleeping' },
  ],

  'guard-hamza': [
    { timeStart: 6, timeEnd: 14, location: 'oasis_village', activity: 'morning_patrol' },
    { timeStart: 14, timeEnd: 18, location: 'oasis_village', activity: 'training' },
    { timeStart: 18, timeEnd: 23, location: 'oasis_village', activity: 'night_watch' },
    { timeStart: 23, timeEnd: 6, location: 'oasis_village', activity: 'sleeping' },
  ],

  'farmer-omar': [
    { timeStart: 5, timeEnd: 11, location: 'farmland', activity: 'farming' },
    { timeStart: 11, timeEnd: 14, location: 'oasis_village', activity: 'selling_produce' },
    { timeStart: 14, timeEnd: 19, location: 'farmland', activity: 'afternoon_farming' },
    { timeStart: 19, timeEnd: 5, location: 'oasis_village', activity: 'sleeping' },
  ],

  'herbalist-maryam': [
    { timeStart: 6, timeEnd: 10, location: 'oasis_village', activity: 'gathering_herbs' },
    { timeStart: 10, timeEnd: 17, location: 'oasis_village', activity: 'healing_patients' },
    { timeStart: 17, timeEnd: 21, location: 'oasis_village', activity: 'preparing_remedies' },
    { timeStart: 21, timeEnd: 6, location: 'oasis_village', activity: 'sleeping' },
  ],

  'elder-tariq': [
    { timeStart: 5, timeEnd: 9, location: 'oasis_village', activity: 'morning_meditation' },
    { timeStart: 9, timeEnd: 15, location: 'oasis_village', activity: 'advising_villagers' },
    { timeStart: 15, timeEnd: 20, location: 'oasis_village', activity: 'storytelling' },
    { timeStart: 20, timeEnd: 5, location: 'oasis_village', activity: 'sleeping' },
  ],

  'storyteller-noor': [
    { timeStart: 8, timeEnd: 12, location: 'oasis_village', activity: 'writing' },
    { timeStart: 12, timeEnd: 18, location: 'desert_marketplace', activity: 'performing' },
    { timeStart: 18, timeEnd: 22, location: 'oasis_village', activity: 'evening_tales' },
    { timeStart: 22, timeEnd: 8, location: 'oasis_village', activity: 'sleeping' },
  ],

  'guide-salim': [
    { timeStart: 6, timeEnd: 12, location: 'oasis_village', activity: 'guiding_travelers' },
    { timeStart: 12, timeEnd: 16, location: 'desert_marketplace', activity: 'scouting' },
    { timeStart: 16, timeEnd: 21, location: 'oasis_village', activity: 'resting' },
    { timeStart: 21, timeEnd: 6, location: 'oasis_village', activity: 'sleeping' },
  ],

  'healer-khadija': [
    { timeStart: 6, timeEnd: 12, location: 'oasis_village', activity: 'clinic_hours' },
    { timeStart: 12, timeEnd: 15, location: 'oasis_village', activity: 'preparing_medicine' },
    { timeStart: 15, timeEnd: 20, location: 'oasis_village', activity: 'house_calls' },
    { timeStart: 20, timeEnd: 6, location: 'oasis_village', activity: 'sleeping' },
  ],

  'imam-muhammad': [
    { timeStart: 4, timeEnd: 8, location: 'oasis_village', activity: 'fajr_prayer_and_teaching' },
    { timeStart: 8, timeEnd: 13, location: 'oasis_village', activity: 'community_guidance' },
    { timeStart: 13, timeEnd: 18, location: 'ancient_library', activity: 'scholarly_study' },
    { timeStart: 18, timeEnd: 4, location: 'oasis_village', activity: 'evening_prayer_and_rest' },
  ],

  'baker-yasmin': [
    { timeStart: 4, timeEnd: 10, location: 'oasis_village', activity: 'baking' },
    { timeStart: 10, timeEnd: 16, location: 'oasis_village', activity: 'selling_bread' },
    { timeStart: 16, timeEnd: 20, location: 'desert_marketplace', activity: 'shopping_supplies' },
    { timeStart: 20, timeEnd: 4, location: 'oasis_village', activity: 'sleeping' },
  ],

  'stable-master-yara': [
    { timeStart: 5, timeEnd: 11, location: 'oasis_village', activity: 'tending_animals' },
    { timeStart: 11, timeEnd: 16, location: 'farmland', activity: 'exercising_horses' },
    { timeStart: 16, timeEnd: 21, location: 'oasis_village', activity: 'stable_maintenance' },
    { timeStart: 21, timeEnd: 5, location: 'oasis_village', activity: 'sleeping' },
  ],

  // === ANCIENT LIBRARY NPCs ===

  'librarian-ibrahim': [
    { timeStart: 7, timeEnd: 13, location: 'ancient_library', activity: 'cataloguing' },
    { timeStart: 13, timeEnd: 15, location: 'oasis_village', activity: 'lunch_break' },
    { timeStart: 15, timeEnd: 21, location: 'ancient_library', activity: 'evening_reading' },
    { timeStart: 21, timeEnd: 7, location: 'ancient_library', activity: 'sleeping' },
  ],

  'scribe-amina': [
    { timeStart: 8, timeEnd: 13, location: 'ancient_library', activity: 'copying_manuscripts' },
    { timeStart: 13, timeEnd: 16, location: 'oasis_village', activity: 'sketching' },
    { timeStart: 16, timeEnd: 20, location: 'ancient_library', activity: 'calligraphy_practice' },
    { timeStart: 20, timeEnd: 8, location: 'ancient_library', activity: 'sleeping' },
  ],

  'astronomer-zain': [
    { timeStart: 6, timeEnd: 10, location: 'ancient_library', activity: 'morning_calculations' },
    { timeStart: 10, timeEnd: 16, location: 'ancient_library', activity: 'teaching_astronomy' },
    { timeStart: 16, timeEnd: 20, location: 'oasis_village', activity: 'evening_walk' },
    { timeStart: 20, timeEnd: 6, location: 'mountain_village', activity: 'stargazing' },
  ],

  // === DESERT MARKETPLACE NPCs ===

  'spice-seller-layla': [
    { timeStart: 7, timeEnd: 13, location: 'desert_marketplace', activity: 'selling_spices' },
    { timeStart: 13, timeEnd: 15, location: 'oasis_village', activity: 'lunch_break' },
    { timeStart: 15, timeEnd: 20, location: 'desert_marketplace', activity: 'restocking' },
    { timeStart: 20, timeEnd: 7, location: 'desert_marketplace', activity: 'sleeping' },
  ],

  'trader-hassan': [
    { timeStart: 6, timeEnd: 12, location: 'desert_marketplace', activity: 'morning_trade' },
    { timeStart: 12, timeEnd: 15, location: 'coastal_port', activity: 'checking_shipments' },
    { timeStart: 15, timeEnd: 21, location: 'desert_marketplace', activity: 'evening_trade' },
    { timeStart: 21, timeEnd: 6, location: 'desert_marketplace', activity: 'sleeping' },
  ],

  'wanderer-ali': [
    { timeStart: 5, timeEnd: 10, location: 'oasis_village', activity: 'morning_camp' },
    { timeStart: 10, timeEnd: 16, location: 'desert_marketplace', activity: 'bartering' },
    { timeStart: 16, timeEnd: 21, location: 'bedouin_camp', activity: 'visiting_bedouin' },
    { timeStart: 21, timeEnd: 5, location: 'desert_marketplace', activity: 'sleeping_under_stars' },
  ],

  'weaver-zahra': [
    { timeStart: 7, timeEnd: 12, location: 'desert_marketplace', activity: 'weaving' },
    { timeStart: 12, timeEnd: 15, location: 'desert_marketplace', activity: 'selling_textiles' },
    { timeStart: 15, timeEnd: 20, location: 'oasis_village', activity: 'gathering_materials' },
    { timeStart: 20, timeEnd: 7, location: 'desert_marketplace', activity: 'sleeping' },
  ],

  'carpet-seller-jamal': [
    { timeStart: 8, timeEnd: 14, location: 'desert_marketplace', activity: 'selling_carpets' },
    { timeStart: 14, timeEnd: 17, location: 'desert_marketplace', activity: 'carpet_demonstration' },
    { timeStart: 17, timeEnd: 21, location: 'oasis_village', activity: 'evening_tea' },
    { timeStart: 21, timeEnd: 8, location: 'desert_marketplace', activity: 'sleeping' },
  ],

  // === COASTAL PORT NPCs ===

  'captain-rashid': [
    { timeStart: 5, timeEnd: 12, location: 'coastal_port', activity: 'sailing' },
    { timeStart: 12, timeEnd: 16, location: 'coastal_port', activity: 'overseeing_dock' },
    { timeStart: 16, timeEnd: 21, location: 'coastal_port', activity: 'evening_navigation' },
    { timeStart: 21, timeEnd: 5, location: 'coastal_port', activity: 'sleeping' },
  ],

  'fishmonger-hana': [
    { timeStart: 4, timeEnd: 10, location: 'coastal_port', activity: 'fishing' },
    { timeStart: 10, timeEnd: 16, location: 'coastal_port', activity: 'selling_fish' },
    { timeStart: 16, timeEnd: 20, location: 'desert_marketplace', activity: 'trading_catch' },
    { timeStart: 20, timeEnd: 4, location: 'coastal_port', activity: 'sleeping' },
  ],

  'blacksmith-daud': [
    { timeStart: 6, timeEnd: 12, location: 'coastal_port', activity: 'forging' },
    { timeStart: 12, timeEnd: 14, location: 'coastal_port', activity: 'lunch_break' },
    { timeStart: 14, timeEnd: 20, location: 'coastal_port', activity: 'repairs_and_sales' },
    { timeStart: 20, timeEnd: 6, location: 'coastal_port', activity: 'sleeping' },
  ],

  'dockmaster-nadia': [
    { timeStart: 6, timeEnd: 14, location: 'coastal_port', activity: 'managing_docks' },
    { timeStart: 14, timeEnd: 18, location: 'coastal_port', activity: 'inventory_check' },
    { timeStart: 18, timeEnd: 22, location: 'coastal_port', activity: 'evening_paperwork' },
    { timeStart: 22, timeEnd: 6, location: 'coastal_port', activity: 'sleeping' },
  ],

  // === ROYAL PALACE NPCs ===

  'vizier-abbas': [
    { timeStart: 7, timeEnd: 13, location: 'royal_palace', activity: 'court_session' },
    { timeStart: 13, timeEnd: 16, location: 'royal_palace', activity: 'private_audience' },
    { timeStart: 16, timeEnd: 21, location: 'royal_palace', activity: 'administrative_duties' },
    { timeStart: 21, timeEnd: 7, location: 'royal_palace', activity: 'sleeping' },
  ],

  'princess-aisha': [
    { timeStart: 8, timeEnd: 12, location: 'royal_palace', activity: 'royal_studies' },
    { timeStart: 12, timeEnd: 16, location: 'ancient_library', activity: 'scholarly_visit' },
    { timeStart: 16, timeEnd: 20, location: 'royal_palace', activity: 'garden_stroll' },
    { timeStart: 20, timeEnd: 8, location: 'royal_palace', activity: 'sleeping' },
  ],

  // === OTHER ZONE NPCs ===

  'poet-rumi': [
    { timeStart: 6, timeEnd: 11, location: 'garden_district', activity: 'composing_poetry' },
    { timeStart: 11, timeEnd: 16, location: 'oasis_village', activity: 'reciting_poetry' },
    { timeStart: 16, timeEnd: 21, location: 'ancient_library', activity: 'reading' },
    { timeStart: 21, timeEnd: 6, location: 'garden_district', activity: 'sleeping' },
  ],

  'mountain-hermit-idris': [
    { timeStart: 4, timeEnd: 10, location: 'mountain_village', activity: 'dawn_meditation' },
    { timeStart: 10, timeEnd: 15, location: 'mountain_village', activity: 'foraging' },
    { timeStart: 15, timeEnd: 20, location: 'mountain_village', activity: 'teaching_wisdom' },
    { timeStart: 20, timeEnd: 4, location: 'mountain_village', activity: 'sleeping' },
  ],

  'garden-keeper-leila': [
    { timeStart: 6, timeEnd: 12, location: 'garden_district', activity: 'tending_garden' },
    { timeStart: 12, timeEnd: 15, location: 'oasis_village', activity: 'selling_flowers' },
    { timeStart: 15, timeEnd: 20, location: 'garden_district', activity: 'watering_plants' },
    { timeStart: 20, timeEnd: 6, location: 'garden_district', activity: 'sleeping' },
  ],
};

/** All NPC IDs that have schedules */
export const SCHEDULED_NPC_IDS = Object.keys(NPC_SCHEDULES);

/**
 * Check if a game hour falls within a schedule block's time range.
 * Handles overnight blocks where timeStart > timeEnd (e.g., 21:00 - 05:00).
 *
 * @param {number} gameHour - Current game hour (0-23)
 * @param {number} timeStart - Block start hour (0-23)
 * @param {number} timeEnd - Block end hour (0-23)
 * @returns {boolean}
 */
function isWithinTimeRange(gameHour, timeStart, timeEnd) {
  if (timeStart < timeEnd) {
    // Normal range: e.g., 8-17
    return gameHour >= timeStart && gameHour < timeEnd;
  }
  // Overnight range: e.g., 21-5 means 21,22,23,0,1,2,3,4
  return gameHour >= timeStart || gameHour < timeEnd;
}

/**
 * Get the current location and activity of an NPC at a given game hour.
 *
 * @param {string} npcId - The NPC's ID (e.g., 'scholar-yusuf')
 * @param {number} gameHour - Current game hour (0-23)
 * @returns {{ location: string, activity: string } | null} Current location + activity, or null if NPC not found
 */
export function getNpcLocation(npcId, gameHour) {
  const schedule = NPC_SCHEDULES[npcId];
  if (!schedule) return null;

  const hour = ((gameHour % 24) + 24) % 24; // Normalize to 0-23

  for (const block of schedule) {
    if (isWithinTimeRange(hour, block.timeStart, block.timeEnd)) {
      return { location: block.location, activity: block.activity };
    }
  }

  // Fallback: return first block's location (should not happen if schedules cover 24h)
  return { location: schedule[0].location, activity: schedule[0].activity };
}

/**
 * Get all NPCs currently at a given location at a given game hour.
 *
 * @param {string} locationId - The zone/location ID (e.g., 'oasis_village')
 * @param {number} gameHour - Current game hour (0-23)
 * @returns {Array<{ npcId: string, activity: string }>} NPCs at this location
 */
export function getNpcsAtLocation(locationId, gameHour) {
  const hour = ((gameHour % 24) + 24) % 24;
  const results = [];

  for (const [npcId, schedule] of Object.entries(NPC_SCHEDULES)) {
    for (const block of schedule) {
      if (block.location === locationId && isWithinTimeRange(hour, block.timeStart, block.timeEnd)) {
        results.push({ npcId, activity: block.activity });
        break; // Only one block matches per NPC
      }
    }
  }

  return results;
}
