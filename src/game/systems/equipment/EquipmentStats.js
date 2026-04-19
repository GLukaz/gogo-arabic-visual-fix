/**
 * EquipmentStats.js — Runtime equipment bonus cache for battle calculations
 *
 * Caches equipment stat totals and refreshes when equipment changes.
 * Used by BattleScene to apply equipment bonuses to damage, defense, HP, MP.
 */

import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import { calculateTotalEquipmentStats } from '../../../utils/itemStats.js';

export class EquipmentStats {
  constructor() {
    this.cachedBonuses = {
      hp: 0,
      mp: 0,
      damage: 1.0,
      defense: 1.0,
      setBonuses: [],
    };

    // Bind event listeners
    this._onEquipmentChanged = this.refresh.bind(this);
    this._onStatsUpdated = this.refresh.bind(this);

    EventBus.on(EVENTS.EQUIPMENT_CHANGED, this._onEquipmentChanged);
    EventBus.on(EVENTS.EQUIPMENT_STATS_UPDATED, this._onStatsUpdated);

    // Calculate initial bonuses
    this.refresh();
  }

  /**
   * Refresh cached bonuses from current Redux state
   */
  refresh() {
    const state = store.getState();
    const equipped = state.inventory.equipped;
    const vocabulary = state.vocabulary;

    // Calculate total equipment stats (from itemStats.js utility)
    this.cachedBonuses = calculateTotalEquipmentStats(equipped, vocabulary);
  }

  /**
   * Get all equipment bonuses
   * @returns {Object} { hp, mp, damage, defense, setBonuses }
   */
  getTotalBonuses() {
    return { ...this.cachedBonuses };
  }

  /**
   * Get a single stat value for battle calculations
   * @param {string} statName - 'hp', 'mp', 'damage', or 'defense'
   * @returns {number} The stat value (additive for hp/mp, multiplicative for damage/defense)
   */
  getStatForBattle(statName) {
    if (this.cachedBonuses[statName] !== undefined) {
      return this.cachedBonuses[statName];
    }

    console.warn(`[EquipmentStats] Unknown stat '${statName}', returning default`);
    return statName === 'damage' || statName === 'defense' ? 1.0 : 0;
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    EventBus.off(EVENTS.EQUIPMENT_CHANGED, this._onEquipmentChanged);
    EventBus.off(EVENTS.EQUIPMENT_STATS_UPDATED, this._onStatsUpdated);
  }
}
