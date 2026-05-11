/**
 * gatheringSpots.js — Gathering resource node definitions for Phase 31
 *
 * Defines respawning resource spots across all zones with Arabic resource names,
 * cooldowns, and profession associations.
 *
 * Spot types:
 * - herb_patch: medicinal plants, flowers, herbs (herbalist)
 * - ore_vein: metal ore, gemstones (blacksmith, jeweler)
 * - water_source: fresh water, oils (alchemist, herbalist)
 * - animal_trace: wool, leather, silk (weaver)
 * - papyrus_stand: papyrus, vellum (calligrapher)
 */

import { _RESOURCES } from './resources.js';

/**
 * GATHERING_SPOTS — Flat object keyed by spotId for O(1) lookup
 */
export const GATHERING_SPOTS = {
  // ════════════════════════════════════════════════════════════════════════
  // OASIS VILLAGE (oasis_village) — 8 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_oasis_herbs_01': {
    id: 'spot_oasis_herbs_01',
    zoneId: 'oasis_village',
    x: 17,
    y: 14,
    resourceId: 'chamomile',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000, // 4 hours
    gatherType: 'herb_patch',
  },
  'spot_oasis_herbs_02': {
    id: 'spot_oasis_herbs_02',
    zoneId: 'oasis_village',
    x: 22,
    y: 16,
    resourceId: 'mint',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_oasis_water_01': {
    id: 'spot_oasis_water_01',
    zoneId: 'oasis_village',
    x: 19,
    y: 13,
    resourceId: 'rosewater',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_oasis_papyrus_01': {
    id: 'spot_oasis_papyrus_01',
    zoneId: 'oasis_village',
    x: 21,
    y: 15,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_oasis_animal_01': {
    id: 'spot_oasis_animal_01',
    zoneId: 'oasis_village',
    x: 8,
    y: 23,
    resourceId: 'wool',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_oasis_ore_01': {
    id: 'spot_oasis_ore_01',
    zoneId: 'oasis_village',
    x: 36,
    y: 14,
    resourceId: 'copper_ore',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_oasis_herbs_03': {
    id: 'spot_oasis_herbs_03',
    zoneId: 'oasis_village',
    x: 6,
    y: 6,
    resourceId: 'saffron',
    spriteKey: 'green-tree-small',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'herb_patch',
  },
  'spot_oasis_ore_02': {
    id: 'spot_oasis_ore_02',
    zoneId: 'oasis_village',
    x: 2,
    y: 13,
    resourceId: 'iron_ore',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },

  // ════════════════════════════════════════════════════════════════════════
  // ANCIENT LIBRARY (ancient_library) — 7 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_library_papyrus_01': {
    id: 'spot_library_papyrus_01',
    zoneId: 'ancient_library',
    x: 12,
    y: 8,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_library_papyrus_02': {
    id: 'spot_library_papyrus_02',
    zoneId: 'ancient_library',
    x: 28,
    y: 10,
    resourceId: 'vellum',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_library_herbs_01': {
    id: 'spot_library_herbs_01',
    zoneId: 'ancient_library',
    x: 5,
    y: 18,
    resourceId: 'lavender',
    spriteKey: 'green-tree-small',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'herb_patch',
  },
  'spot_library_ore_01': {
    id: 'spot_library_ore_01',
    zoneId: 'ancient_library',
    x: 35,
    y: 22,
    resourceId: 'lapis_lazuli',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare gemstone)
    gatherType: 'ore_vein',
  },
  'spot_library_water_01': {
    id: 'spot_library_water_01',
    zoneId: 'ancient_library',
    x: 20,
    y: 25,
    resourceId: 'rosewater',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_library_animal_01': {
    id: 'spot_library_animal_01',
    zoneId: 'ancient_library',
    x: 8,
    y: 12,
    resourceId: 'wool',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_library_papyrus_03': {
    id: 'spot_library_papyrus_03',
    zoneId: 'ancient_library',
    x: 15,
    y: 6,
    resourceId: 'paper',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },

  // ════════════════════════════════════════════════════════════════════════
  // DESERT MARKETPLACE (desert_marketplace) — 9 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_market_animal_01': {
    id: 'spot_market_animal_01',
    zoneId: 'desert_marketplace',
    x: 8,
    y: 12,
    resourceId: 'silk',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'animal_trace',
  },
  'spot_market_animal_02': {
    id: 'spot_market_animal_02',
    zoneId: 'desert_marketplace',
    x: 32,
    y: 15,
    resourceId: 'wool',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_market_ore_01': {
    id: 'spot_market_ore_01',
    zoneId: 'desert_marketplace',
    x: 18,
    y: 8,
    resourceId: 'gold_ore',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'ore_vein',
  },
  'spot_market_ore_02': {
    id: 'spot_market_ore_02',
    zoneId: 'desert_marketplace',
    x: 25,
    y: 20,
    resourceId: 'copper_ore',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_market_herbs_01': {
    id: 'spot_market_herbs_01',
    zoneId: 'desert_marketplace',
    x: 12,
    y: 18,
    resourceId: 'cumin',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_market_herbs_02': {
    id: 'spot_market_herbs_02',
    zoneId: 'desert_marketplace',
    x: 35,
    y: 22,
    resourceId: 'cardamom',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_market_water_01': {
    id: 'spot_market_water_01',
    zoneId: 'desert_marketplace',
    x: 20,
    y: 12,
    resourceId: 'olive_oil',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_market_papyrus_01': {
    id: 'spot_market_papyrus_01',
    zoneId: 'desert_marketplace',
    x: 6,
    y: 6,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_market_animal_03': {
    id: 'spot_market_animal_03',
    zoneId: 'desert_marketplace',
    x: 28,
    y: 25,
    resourceId: 'cotton',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },

  // ════════════════════════════════════════════════════════════════════════
  // FARMLAND (farmland) — 10 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_farm_herbs_01': {
    id: 'spot_farm_herbs_01',
    zoneId: 'farmland',
    x: 10,
    y: 8,
    resourceId: 'wheat',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_farm_herbs_02': {
    id: 'spot_farm_herbs_02',
    zoneId: 'farmland',
    x: 18,
    y: 12,
    resourceId: 'barley',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_farm_herbs_03': {
    id: 'spot_farm_herbs_03',
    zoneId: 'farmland',
    x: 25,
    y: 15,
    resourceId: 'dates',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_farm_animal_01': {
    id: 'spot_farm_animal_01',
    zoneId: 'farmland',
    x: 6,
    y: 18,
    resourceId: 'wool',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_farm_animal_02': {
    id: 'spot_farm_animal_02',
    zoneId: 'farmland',
    x: 32,
    y: 20,
    resourceId: 'linen',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_farm_water_01': {
    id: 'spot_farm_water_01',
    zoneId: 'farmland',
    x: 15,
    y: 6,
    resourceId: 'olive_oil',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_farm_herbs_04': {
    id: 'spot_farm_herbs_04',
    zoneId: 'farmland',
    x: 28,
    y: 8,
    resourceId: 'honey',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_farm_ore_01': {
    id: 'spot_farm_ore_01',
    zoneId: 'farmland',
    x: 35,
    y: 25,
    resourceId: 'iron_ore',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_farm_animal_03': {
    id: 'spot_farm_animal_03',
    zoneId: 'farmland',
    x: 12,
    y: 22,
    resourceId: 'cotton',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_farm_papyrus_01': {
    id: 'spot_farm_papyrus_01',
    zoneId: 'farmland',
    x: 22,
    y: 18,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },

  // ════════════════════════════════════════════════════════════════════════
  // BEDOUIN CAMP (bedouin_camp) — 8 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_bedouin_animal_01': {
    id: 'spot_bedouin_animal_01',
    zoneId: 'bedouin_camp',
    x: 8,
    y: 10,
    resourceId: 'hemp',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_bedouin_animal_02': {
    id: 'spot_bedouin_animal_02',
    zoneId: 'bedouin_camp',
    x: 18,
    y: 14,
    resourceId: 'linen',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_bedouin_herbs_01': {
    id: 'spot_bedouin_herbs_01',
    zoneId: 'bedouin_camp',
    x: 12,
    y: 6,
    resourceId: 'aloe_vera',
    spriteKey: 'green-tree-small',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'herb_patch',
  },
  'spot_bedouin_water_01': {
    id: 'spot_bedouin_water_01',
    zoneId: 'bedouin_camp',
    x: 25,
    y: 18,
    resourceId: 'olive_oil',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_bedouin_ore_01': {
    id: 'spot_bedouin_ore_01',
    zoneId: 'bedouin_camp',
    x: 6,
    y: 20,
    resourceId: 'copper_ore',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_bedouin_herbs_02': {
    id: 'spot_bedouin_herbs_02',
    zoneId: 'bedouin_camp',
    x: 30,
    y: 12,
    resourceId: 'sage',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_bedouin_animal_03': {
    id: 'spot_bedouin_animal_03',
    zoneId: 'bedouin_camp',
    x: 15,
    y: 22,
    resourceId: 'wool',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_bedouin_papyrus_01': {
    id: 'spot_bedouin_papyrus_01',
    zoneId: 'bedouin_camp',
    x: 22,
    y: 8,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },

  // ════════════════════════════════════════════════════════════════════════
  // MOUNTAIN VILLAGE (mountain_village) — 8 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_mountain_ore_01': {
    id: 'spot_mountain_ore_01',
    zoneId: 'mountain_village',
    x: 10,
    y: 8,
    resourceId: 'iron_ore',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_mountain_ore_02': {
    id: 'spot_mountain_ore_02',
    zoneId: 'mountain_village',
    x: 25,
    y: 12,
    resourceId: 'silver_ore',
    spriteKey: 'rock2',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'ore_vein',
  },
  'spot_mountain_ore_03': {
    id: 'spot_mountain_ore_03',
    zoneId: 'mountain_village',
    x: 18,
    y: 18,
    resourceId: 'silver_ore',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare gemstone)
    gatherType: 'ore_vein',
  },
  'spot_mountain_herbs_01': {
    id: 'spot_mountain_herbs_01',
    zoneId: 'mountain_village',
    x: 6,
    y: 15,
    resourceId: 'thyme',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_mountain_water_01': {
    id: 'spot_mountain_water_01',
    zoneId: 'mountain_village',
    x: 30,
    y: 20,
    resourceId: 'olive_oil',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_mountain_animal_01': {
    id: 'spot_mountain_animal_01',
    zoneId: 'mountain_village',
    x: 12,
    y: 22,
    resourceId: 'wool',
    spriteKey: 'rock1',
    respawnInterval: 14400000,
    gatherType: 'animal_trace',
  },
  'spot_mountain_herbs_02': {
    id: 'spot_mountain_herbs_02',
    zoneId: 'mountain_village',
    x: 28,
    y: 6,
    resourceId: 'fenugreek',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_mountain_papyrus_01': {
    id: 'spot_mountain_papyrus_01',
    zoneId: 'mountain_village',
    x: 35,
    y: 15,
    resourceId: 'vellum',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },

  // ════════════════════════════════════════════════════════════════════════
  // COASTAL PORT (coastal_port) — 9 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_port_water_01': {
    id: 'spot_port_water_01',
    zoneId: 'coastal_port',
    x: 8,
    y: 10,
    resourceId: 'blessed_water',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_port_animal_01': {
    id: 'spot_port_animal_01',
    zoneId: 'coastal_port',
    x: 15,
    y: 14,
    resourceId: 'silk',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'animal_trace',
  },
  'spot_port_herbs_01': {
    id: 'spot_port_herbs_01',
    zoneId: 'coastal_port',
    x: 22,
    y: 8,
    resourceId: 'cinnamon',
    spriteKey: 'green-tree-small',
    respawnInterval: 28800000, // 8 hours (rare spice)
    gatherType: 'herb_patch',
  },
  'spot_port_animal_02': {
    id: 'spot_port_animal_02',
    zoneId: 'coastal_port',
    x: 30,
    y: 18,
    resourceId: 'silk',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'animal_trace',
  },
  'spot_port_ore_01': {
    id: 'spot_port_ore_01',
    zoneId: 'coastal_port',
    x: 12,
    y: 22,
    resourceId: 'copper_ore',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'ore_vein',
  },
  'spot_port_papyrus_01': {
    id: 'spot_port_papyrus_01',
    zoneId: 'coastal_port',
    x: 6,
    y: 6,
    resourceId: 'papyrus',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_port_herbs_02': {
    id: 'spot_port_herbs_02',
    zoneId: 'coastal_port',
    x: 28,
    y: 12,
    resourceId: 'ginger_root',
    spriteKey: 'green-tree-small',
    respawnInterval: 14400000,
    gatherType: 'herb_patch',
  },
  'spot_port_water_02': {
    id: 'spot_port_water_02',
    zoneId: 'coastal_port',
    x: 35,
    y: 24,
    resourceId: 'olive_oil',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_port_ore_02': {
    id: 'spot_port_ore_02',
    zoneId: 'coastal_port',
    x: 18,
    y: 20,
    resourceId: 'tin_ore',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare gemstone)
    gatherType: 'ore_vein',
  },

  // ════════════════════════════════════════════════════════════════════════
  // BAGHDAD MARKETPLACE (baghdad_marketplace) — 6 spots
  // ════════════════════════════════════════════════════════════════════════
  'spot_baghdad_market_ore_01': {
    id: 'spot_baghdad_market_ore_01',
    zoneId: 'baghdad_marketplace',
    x: 10,
    y: 8,
    resourceId: 'gold_ore',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'ore_vein',
  },
  'spot_baghdad_market_animal_01': {
    id: 'spot_baghdad_market_animal_01',
    zoneId: 'baghdad_marketplace',
    x: 25,
    y: 12,
    resourceId: 'silk',
    spriteKey: 'rock2',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'animal_trace',
  },
  'spot_baghdad_market_herbs_01': {
    id: 'spot_baghdad_market_herbs_01',
    zoneId: 'baghdad_marketplace',
    x: 18,
    y: 18,
    resourceId: 'saffron',
    spriteKey: 'green-tree-small',
    respawnInterval: 28800000, // 8 hours (rare)
    gatherType: 'herb_patch',
  },
  'spot_baghdad_market_papyrus_01': {
    id: 'spot_baghdad_market_papyrus_01',
    zoneId: 'baghdad_marketplace',
    x: 6,
    y: 15,
    resourceId: 'paper',
    spriteKey: 'palm-small',
    respawnInterval: 14400000,
    gatherType: 'papyrus_stand',
  },
  'spot_baghdad_market_water_01': {
    id: 'spot_baghdad_market_water_01',
    zoneId: 'baghdad_marketplace',
    x: 30,
    y: 20,
    resourceId: 'rosewater',
    spriteKey: 'rock2',
    respawnInterval: 14400000,
    gatherType: 'water_source',
  },
  'spot_baghdad_market_ore_02': {
    id: 'spot_baghdad_market_ore_02',
    zoneId: 'baghdad_marketplace',
    x: 14,
    y: 6,
    resourceId: 'gold_ore',
    spriteKey: 'rock1',
    respawnInterval: 28800000, // 8 hours (rare gemstone)
    gatherType: 'ore_vein',
  },
};

/**
 * Get all gathering spots for a specific zone
 * @param {string} zoneId - Zone ID
 * @returns {array} Array of gathering spot configs
 */
export function getGatheringSpotsForZone(zoneId) {
  return Object.values(GATHERING_SPOTS).filter(spot => spot.zoneId === zoneId);
}

/**
 * Get total count of gathering spots
 * @returns {number}
 */
export function getGatheringSpotCount() {
  return Object.keys(GATHERING_SPOTS).length;
}
