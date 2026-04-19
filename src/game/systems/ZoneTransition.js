import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { loadZoneAssets } from '../../data/zoneAssetManifests.js';

// ZoneTransition handles moving between world zones.
// Per PRD: walk onto exit tile -> fade to black (0.5s) -> load new zone -> fade in (0.5s).
// Phase 4: Added unlock gating — checks quest/level/words before allowing transition.
// Phase 14: Added try/catch/finally with timeout protection to prevent stuck transitions.

class ZoneTransition {
  constructor(scene) {
    this.scene = scene;
    this.transitioning = false;
  }

  /**
   * Transition to a new zone with configurable camera fade.
   * Wrapped in try/catch/finally to guarantee unfreeze even on error.
   * @param {string} zoneName - Target zone key
   * @param {number} entryX - Spawn X in target zone
   * @param {number} entryY - Spawn Y in target zone
   * @param {object} fadeConfig - Optional fade overrides
   * @param {number} [fadeConfig.fadeOutDuration=500] - Fade-out duration in ms
   * @param {number} [fadeConfig.fadeInDuration=500] - Fade-in duration in ms
   * @param {{ r: number, g: number, b: number }} [fadeConfig.fadeColor={ r: 0, g: 0, b: 0 }] - Fade color
   */
  async transitionTo(zoneName, entryX, entryY, fadeConfig = {}) {
    if (this.transitioning) return;
    this.transitioning = true;

    const fadeOutDuration = fadeConfig.fadeOutDuration ?? 500;
    const fadeInDuration = fadeConfig.fadeInDuration ?? 500;
    const color = fadeConfig.fadeColor ?? { r: 0, g: 0, b: 0 };

    // Disable player movement during transition
    EventBus.emit(EVENTS.PLAYER_FREEZE);

    try {
      // Fade out with timeout protection (3 second max)
      await this._fadeWithTimeout('fadeOut', fadeOutDuration, 3000, color);

      // Notify Redux of zone change
      EventBus.emit(EVENTS.ZONE_CHANGE, { zone: zoneName, x: entryX, y: entryY });

      // Load zone-specific assets if not already cached (during fade-out, screen is black)
      EventBus.emit(EVENTS.ZONE_LOADING_START, { zone: zoneName });
      try {
        await loadZoneAssets(this.scene, zoneName);
      } catch (loadErr) {
        console.warn('[ZoneTransition] Zone asset loading failed, continuing:', loadErr);
        // Non-fatal -- zone may render with missing textures but won't crash
      }
      EventBus.emit(EVENTS.ZONE_LOADING_END, { zone: zoneName });

      // Load the new zone (WorldScene handles this via loadZone method)
      this.scene.loadZone(zoneName, entryX, entryY);

      // Fade in with timeout protection
      await this._fadeWithTimeout('fadeIn', fadeInDuration, 3000, color);
    } catch (err) {
      console.error('Zone transition error:', err);
      // Force camera to normal state on error
      try {
        this.scene.cameras.main.resetFX();
      } catch (_unused) {
        // Camera may not exist if scene was destroyed
      }
    } finally {
      // ALWAYS reset state and unfreeze, even on error
      this.transitioning = false;
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    }
  }

  /**
   * Camera fade with timeout protection.
   * Resolves when fade completes OR when timeout expires (whichever first).
   */
  _fadeWithTimeout(fadeType, duration, timeout, color = { r: 0, g: 0, b: 0 }) {
    return new Promise((resolve) => {
      const camera = this.scene?.cameras?.main;
      if (!camera) {
        resolve();
        return;
      }

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };

      // Start the fade
      if (fadeType === 'fadeOut') {
        camera.fadeOut(duration, color.r, color.g, color.b);
        camera.once('camerafadeoutcomplete', settle);
      } else {
        camera.fadeIn(duration, color.r, color.g, color.b);
        camera.once('camerafadeincomplete', settle);
      }

      // Timeout safety -- resolve even if camera event never fires
      const timer = setTimeout(settle, timeout);
    });
  }
}

export default ZoneTransition;
