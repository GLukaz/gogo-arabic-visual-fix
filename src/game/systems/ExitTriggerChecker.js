import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { ZONES, TILE } from '../../data/zones.js';

/**
 * ExitTriggerChecker — detects when the player walks to a zone edge exit.
 *
 * Compares the player's tile position against exit trigger definitions
 * (edge + tile range) and emits ZONE_CHECK_UNLOCK to initiate zone transition.
 */
export class ExitTriggerChecker {
  /**
   * Check exit triggers for the current frame.
   * @param {object} params
   * @param {Phaser.GameObjects.Sprite} params.player
   * @param {boolean} params.transitioning - true if a zone transition is in progress
   * @param {boolean} params.usingTiledMap
   * @param {Array} params.tiledExitTriggers - exit triggers from TiledMapLoader
   * @param {object} params.mapLoader - code-generated MapLoader instance
   * @param {number} params.mapW - map width in tiles
   * @param {number} params.mapH - map height in tiles
   */
  static check({ player, transitioning, usingTiledMap, tiledExitTriggers, mapLoader, mapW, mapH }) {
    if (!player || transitioning) return;

    const tileX = Math.floor(player.x / TILE);
    const tileY = Math.floor(player.y / TILE);

    const exitTriggers = usingTiledMap
      ? (tiledExitTriggers || [])
      : mapLoader.getExitTriggers();

    for (const exit of exitTriggers) {
      const [start, end] = exit.tileRange;
      let triggered = false;

      if (exit.edge === 'north' && tileY <= 0 && tileX >= start && tileX <= end) {
        triggered = true;
      } else if (exit.edge === 'south' && tileY >= mapH - 1 && tileX >= start && tileX <= end) {
        triggered = true;
      } else if (exit.edge === 'west' && tileX <= 0 && tileY >= start && tileY <= end) {
        triggered = true;
      } else if (exit.edge === 'east' && tileX >= mapW - 1 && tileY >= start && tileY <= end) {
        triggered = true;
      }

      if (triggered) {
        const targetZone = ZONES[exit.targetZone];
        if (!targetZone) return;

        let entryX, entryY;
        const entry = targetZone.entries?.[exit.targetEntry];
        if (entry) {
          entryX = entry.x * TILE;
          entryY = entry.y * TILE;
        } else {
          entryX = targetZone.spawnPoint.x * TILE;
          entryY = targetZone.spawnPoint.y * TILE;
        }

        EventBus.emit(EVENTS.ZONE_CHECK_UNLOCK, {
          zoneName: exit.targetZone,
          entryX,
          entryY,
          unlock: targetZone.unlock,
        });
        return;
      }
    }
  }
}
