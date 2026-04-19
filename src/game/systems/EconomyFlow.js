/**
 * EconomyFlow.js — Per-zone resource tracking system (Phase 35)
 *
 * Simulates resource production chains across world zones.
 * Shops consume input resources and produce outputs each game day (tick).
 * Not wired to Redux yet — managed as a singleton by WorldScene or a game manager.
 */

import { SHOP_PRODUCTION } from '../../data/shops.js';
import { ZONES } from '../../data/zones.js';

// Explicit shop-to-zone mapping (shop IDs vs zone IDs don't always share a common prefix)
const SHOP_ZONE_MAP = {
  oasis_village_shop:    'oasis_village',
  desert_market_shop:    'desert_marketplace',
  sacred_library_shop:   'ancient_library',
  farmland_shop:         'farmland',
  bedouin_camp_shop:     'bedouin_camp',
  mountain_village_shop: 'mountain_village',
  coastal_port_shop:     'coastal_port',
  royal_palace_shop:     'royal_palace',
};

// Initial quantity of each input resource seeded into every zone so the economy has flow from the start
const INITIAL_RESOURCE_AMOUNT = 10;

export class EconomyFlow {
  /**
   * Initialize resource pools for all zones with base input amounts.
   * resourcePool shape: { [zoneId]: { [resourceName]: quantity } }
   */
  constructor() {
    this.resourcePool = {};

    // Seed each zone referenced in SHOP_ZONE_MAP with INITIAL_RESOURCE_AMOUNT of each input
    for (const [shopId, zoneId] of Object.entries(SHOP_ZONE_MAP)) {
      const production = SHOP_PRODUCTION[shopId];
      if (!production) continue;

      if (!this.resourcePool[zoneId]) {
        this.resourcePool[zoneId] = {};
      }

      for (const input of production.inputs) {
        if (this.resourcePool[zoneId][input] === undefined) {
          this.resourcePool[zoneId][input] = INITIAL_RESOURCE_AMOUNT;
        }
      }
    }
  }

  /**
   * Advance economy by the given number of game days.
   * For each shop: if inputs are available, consume them and produce outputs.
   * If inputs are insufficient, production stalls for that shop this tick.
   *
   * @param {number} gameDays - Number of game days to simulate (default 1)
   */
  tick(gameDays = 1) {
    const shortages = [];

    for (let day = 0; day < gameDays; day++) {
      for (const [shopId, production] of Object.entries(SHOP_PRODUCTION)) {
        const zoneId = SHOP_ZONE_MAP[shopId];
        if (!zoneId) continue;

        const pool = this.resourcePool[zoneId];
        if (!pool) continue;

        // Check if all inputs are available (need at least rate × 1 of each input per production cycle)
        const inputsAvailable = production.inputs.every(
          (input) => (pool[input] ?? 0) >= production.rate
        );

        if (!inputsAvailable) {
          // Production stall — record shortage for diagnostics
          shortages.push({ shopId, zoneId, missingInputs: production.inputs.filter((i) => (pool[i] ?? 0) < production.rate) });
          continue;
        }

        // Consume inputs
        for (const input of production.inputs) {
          pool[input] = (pool[input] ?? 0) - production.rate;
        }

        // Produce outputs
        for (const output of production.outputs) {
          pool[output] = (pool[output] ?? 0) + production.rate;
        }
      }
    }

    return { shortages };
  }

  /**
   * Get the quantity of a resource available in a zone.
   *
   * @param {string} zoneId - Zone identifier (e.g. 'oasis_village')
   * @param {string} resource - Resource name (e.g. 'simple_cloth')
   * @returns {number} Quantity available (0 if not tracked)
   */
  getResourceAvailability(zoneId, resource) {
    return this.resourcePool[zoneId]?.[resource] ?? 0;
  }

  /**
   * Manually add resources to a zone's pool.
   * Used for player actions, quest rewards, environmental events, etc.
   *
   * @param {string} zoneId - Zone identifier
   * @param {Object} resources - Map of { [resourceName]: quantity }
   */
  addResources(zoneId, resources) {
    if (!this.resourcePool[zoneId]) {
      this.resourcePool[zoneId] = {};
    }
    for (const [resource, quantity] of Object.entries(resources)) {
      this.resourcePool[zoneId][resource] = (this.resourcePool[zoneId][resource] ?? 0) + quantity;
    }
  }

  /**
   * Consume resources from a zone's pool.
   * Used for player purchases, crafting, and other resource sinks.
   * Does not go below zero.
   *
   * @param {string} zoneId - Zone identifier
   * @param {Object} resources - Map of { [resourceName]: quantity }
   * @returns {{ success: boolean, shortfalls: Object }} Result with success flag and any shortfalls
   */
  consumeResources(zoneId, resources) {
    const pool = this.resourcePool[zoneId] ?? {};
    const shortfalls = {};

    // Check availability before consuming
    for (const [resource, quantity] of Object.entries(resources)) {
      const available = pool[resource] ?? 0;
      if (available < quantity) {
        shortfalls[resource] = quantity - available;
      }
    }

    if (Object.keys(shortfalls).length > 0) {
      return { success: false, shortfalls };
    }

    // Consume resources
    if (!this.resourcePool[zoneId]) {
      this.resourcePool[zoneId] = {};
    }
    for (const [resource, quantity] of Object.entries(resources)) {
      this.resourcePool[zoneId][resource] = (this.resourcePool[zoneId][resource] ?? 0) - quantity;
    }

    return { success: true, shortfalls: {} };
  }

  /**
   * Get a snapshot of the entire resource pool for a zone.
   *
   * @param {string} zoneId - Zone identifier
   * @returns {Object} Shallow copy of the zone's resource pool
   */
  getZonePool(zoneId) {
    return { ...this.resourcePool[zoneId] };
  }
}
