import { realWorldZones } from '../data/zones/realWorldZones';
import { fantasyZones } from '../data/zones/fantasyZones';

/**
 * Registry for all zones in the game.
 * Combines Real World and Fantasy zones into a single lookup.
 */
class ZoneRegistry {
    constructor() {
        this.zones = { ...realWorldZones, ...fantasyZones };
        this.zoneIds = Object.keys(this.zones);
    }

    /**
     * Get a zone definition by ID.
     * @param {string} zoneId 
     * @returns {Object|null}
     */
    getZone(zoneId) {
        return this.zones[zoneId] || null;
    }

    /**
     * Get all zones.
     * @returns {Object}
     */
    getAllZones() {
        return this.zones;
    }

    /**
     * Get zones filtered by unlocking level.
     * @param {number} playerLevel 
     * @returns {Array}
     */
    getUnlockedZones(playerLevel) {
        return this.zoneIds
            .map(id => this.zones[id])
            .filter(zone => (zone.unlockRequirements?.level ?? 0) <= playerLevel);
    }

    /**
     * Get zones by category/theme (e.g., 'Real World' based on ID presence in import).
     * Note: Could enhance zone data with a 'category' field for cleaner filtering.
     * @returns {Array}
     */
    getRealWorldZones() {
        return Object.values(realWorldZones);
    }

    /**
     * Get fantasy zones.
     * @returns {Array}
     */
    getFantasyZones() {
        return Object.values(fantasyZones);
    }
}

export const zoneRegistry = new ZoneRegistry();
