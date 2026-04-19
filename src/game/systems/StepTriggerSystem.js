import { TILE } from '../../data/zones.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { evaluateActionSets, executeActions } from './ActionSetExecutor.js';
import { buildActionContext } from './actionContext.js';

/**
 * StepTriggerSystem — detects when the player walks into trigger zones or sub-areas.
 *
 * Step triggers fire action sets (dialogue, quests, etc.) when the player enters
 * a tile region. Supports cooldowns and one-shot triggers.
 *
 * Sub-areas emit ENTER/EXIT events for ambient changes (e.g. music, lighting).
 */
export class StepTriggerSystem {
  constructor(scene) {
    this.scene = scene;
    this.triggers = [];
    this.cooldowns = {};       // triggerId → lastFireTime
    this.firedOneShots = new Set();
    this.subAreas = [];
    this.currentSubArea = null;
  }

  /** Load triggers and sub-areas from zone data. Call on zone build. */
  load(zone) {
    this.triggers = zone.stepTriggers || [];
    this.cooldowns = {};
    this.firedOneShots = new Set();
    this.subAreas = zone.subAreas || [];
    this.currentSubArea = null;
  }

  /** Called every frame with the player sprite and current zone name. */
  update(player, currentZone) {
    if (!player) return;

    if (this.triggers.length) {
      this._checkStepTriggers(player, currentZone);
    }
    if (this.subAreas.length) {
      this._checkSubArea(player);
    }
  }

  _checkStepTriggers(player, currentZone) {
    const px = Math.floor(player.x / TILE);
    const py = Math.floor(player.y / TILE);
    const now = this.scene.time.now;

    for (const trigger of this.triggers) {
      if (px < trigger.x || px >= trigger.x + (trigger.width || 1)) continue;
      if (py < trigger.y || py >= trigger.y + (trigger.height || 1)) continue;

      if (trigger.oneShot && this.firedOneShots.has(trigger.id)) continue;

      const lastFire = this.cooldowns[trigger.id] || 0;
      if (trigger.cooldown && now - lastFire < trigger.cooldown) continue;

      const context = buildActionContext(currentZone);
      const matched = evaluateActionSets(trigger.actionSets, context);
      if (!matched) continue;

      executeActions(matched.actions, EventBus);
      this.cooldowns[trigger.id] = now;
      if (trigger.oneShot || trigger.flagOnFire) {
        this.firedOneShots.add(trigger.id);
      }
    }
  }

  _checkSubArea(player) {
    const px = Math.floor(player.x / TILE);
    const py = Math.floor(player.y / TILE);

    let currentArea = null;
    for (const area of this.subAreas) {
      if (px >= area.x && px < area.x + (area.width || 1) &&
          py >= area.y && py < area.y + (area.height || 1)) {
        currentArea = area;
        break;
      }
    }

    const prevArea = this.currentSubArea;
    if (currentArea?.id !== prevArea?.id) {
      if (prevArea) EventBus.emit(EVENTS.SUB_AREA_EXIT, { area: prevArea });
      if (currentArea) EventBus.emit(EVENTS.SUB_AREA_ENTER, { area: currentArea });
      this.currentSubArea = currentArea;
    }
  }
}
