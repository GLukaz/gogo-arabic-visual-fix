import { zoneRegistry } from './ZoneRegistry';

/**
 * Manages active zone state, loading, and transitions.
 * Handles the logic of moving the player between zones and verifying unlock conditions.
 */
class ZoneManager {
    constructor() {
        this.currentZoneId = null;
        this.previousZoneId = null;
    }

    /**
     * Attempt to travel to a new zone.
     * @param {string} zoneId - The ID of the target zone.
     * @param {Object} playerState - The player's current state (for level checks, etc.).
     * @returns {Object} Result object { success: boolean, reason?: string, zone?: Object }
     */
    travelToZone(zoneId, playerState) {
        const zone = zoneRegistry.getZone(zoneId);

        if (!zone) {
            return { success: false, reason: 'Zone does not exist.' };
        }

        // Check unlocking requirements
        if (zone.unlockRequirements && playerState.level < zone.unlockRequirements.level) {
            return {
                success: false,
                reason: `Level ${zone.unlockRequirements.level} required to enter ${zone.name}.`
            };
        }

        // Perform transition
        this.previousZoneId = this.currentZoneId;
        this.currentZoneId = zoneId;

        if (import.meta.env.DEV) console.log(`ZoneManager: Traveled to ${zone.name} (${zoneId})`);

        // In a full implementation, this would trigger scene changes, asset loading, etc.
        return { success: true, zone };
    }

    /**
     * Get the current active zone definition.
     * @returns {Object|null}
     */
    getCurrentZone() {
        return zoneRegistry.getZone(this.currentZoneId);
    }

    /**
     * Get the previously visited zone.
     * @returns {Object|null}
     */
    getPreviousZone() {
        return zoneRegistry.getZone(this.previousZoneId);
    }
}

export const zoneManager = new ZoneManager();
