import { Companion } from '../../sprites/Companion.js';
import { CompanionContext } from './CompanionContext.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import { COMPANIONS } from '../../../data/companions.js';

export class CompanionManager {
  constructor(scene) {
    this.scene = scene;
    this.activeCompanion = null;       // Current Companion sprite
    this.activeCompanionId = null;
    this.context = new CompanionContext();

    // Listen for party changes
    this._onPartyChanged = this._handlePartyChanged.bind(this);
    EventBus.on(EVENTS.COMPANION_PARTY_CHANGED, this._onPartyChanged);

    // Check if exploration companion is already set
    const party = store.getState().companions?.activeParty;
    if (party?.exploration) {
      this._spawnCompanion(party.exploration);
    }
  }

  update(time, delta) {
    if (!this.activeCompanion) return;

    // Update companion sprite (lazy pathfinding inside)
    this.activeCompanion.update(time, delta);

    // Check contextual triggers (with cooldown, inside CompanionContext)
    this.context.evaluateTriggers(this.activeCompanionId, time);
  }

  _spawnCompanion(companionId) {
    // Clean up existing companion
    if (this.activeCompanion) {
      this._despawnCompanion();
    }

    const companionDef = COMPANIONS[companionId];
    if (!companionDef) {
      console.warn(`[CompanionManager] Unknown companion: ${companionId}`);
      return;
    }

    // Get player position for spawn offset
    const player = this.scene.playerController?.getPlayer();
    if (!player) return;

    const spawnX = player.x - 60;
    const spawnY = player.y + 30;

    // Use companion sprite key with fallback
    const spriteKey = this.scene.textures.exists(companionDef.spriteKey)
      ? companionDef.spriteKey
      : 'npc-default';  // Graceful fallback if sprite not loaded

    this.activeCompanion = new Companion(this.scene, spawnX, spawnY, {
      id: companionId,
      key: spriteKey,
      name: companionDef.name,
      companionId: companionId,
      colorPalette: companionDef.colorPalette,
    });

    this.activeCompanionId = companionId;
    this.activeCompanion.setFollowTarget(player);
    this.activeCompanion.setDepth(player.depth - 1); // Render behind player

    EventBus.emit(EVENTS.COMPANION_FOLLOW_START, { companionId });
  }

  _despawnCompanion() {
    if (this.activeCompanion) {
      EventBus.emit(EVENTS.COMPANION_FOLLOW_STOP, { companionId: this.activeCompanionId });
      this.activeCompanion.destroy();
      this.activeCompanion = null;
      this.activeCompanionId = null;
    }
  }

  _handlePartyChanged(data) {
    const { slot, companionId } = data;
    if (slot !== 'exploration') return;

    if (companionId) {
      this._spawnCompanion(companionId);
    } else {
      this._despawnCompanion();
    }
  }

  getActiveCompanion() {
    return this.activeCompanion;
  }

  getActiveCompanionId() {
    return this.activeCompanionId;
  }

  destroy() {
    EventBus.off(EVENTS.COMPANION_PARTY_CHANGED, this._onPartyChanged);
    this._despawnCompanion();
    this.context = null;
  }
}
