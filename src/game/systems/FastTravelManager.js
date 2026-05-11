/**
 * FastTravelManager — Handles fast-travel / map-based zone teleportation.
 * Stub implementation — full fast-travel UI and logic is a future phase.
 */
export class FastTravelManager {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Check if a zone is unlocked for fast travel.
   * @param {string} zoneId
   * @returns {boolean}
   */
  isUnlocked(_zoneId) {
    return false; // No fast travel zones unlocked yet
  }

  /**
   * Travel to a zone (no-op stub).
   * @param {string} zoneId
   */
  travelTo(zoneId) {
    console.warn(`[FastTravelManager] Fast travel not yet implemented. Target: ${zoneId}`);
  }

  destroy() {
    this.scene = null;
  }
}
