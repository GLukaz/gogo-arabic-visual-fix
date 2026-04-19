import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { store } from '../../store/store.js';
import { getGatheringSpotsForZone } from '../../data/gatheringSpots.js';
import { RESOURCES } from '../../data/resources.js';
import { addResource, recordGatheringCooldown } from '../../store/slices/craftingSlice.js';
import { calculateGatheringQuality } from '../../utils/craftingLogic.js';
import { stripDiacritics } from '../../utils/arabicUtils.js';

// Gathering proximity threshold: 2 tiles = 128px
const GATHER_RANGE = 64 * 2;

/**
 * GatheringSpotManager
 * Manages respawning resource nodes across the world for the crafting system.
 * Follows InteractableManager.js pattern for consistency.
 */
export class GatheringSpotManager {
  constructor(scene) {
    this.scene = scene;
    this.spots = [];
    this.gatherListeners = new Map(); // spotId -> listener cleanup functions
  }

  /**
   * Create gathering spots for the current zone
   * @param {string} zoneId - Current zone ID
   */
  create(zoneId) {
    this.spots = [];
    this.gatherListeners.clear();

    const spotConfigs = getGatheringSpotsForZone(zoneId);
    const currentTime = Date.now();
    const cooldowns = store.getState().crafting?.gatheringCooldowns || {};

    spotConfigs.forEach((cfg) => {
      const px = cfg.x * 64 + 32;
      const py = cfg.y * 64 + 32;

      // Create sprite for the gathering spot
      const sprite = this.scene.add.image(px, py, cfg.spriteKey).setOrigin(0.5, 0.8);
      sprite.setScale(0.6);

      // Determine initial state based on cooldown
      const lastGathered = cooldowns[cfg.id] || 0;
      const timeSinceGather = currentTime - lastGathered;
      const isDepleted = timeSinceGather < cfg.respawnInterval;

      // Create resource label (respects harakat setting)
      const resource = RESOURCES[cfg.resourceId];
      const showDiacritics = store.getState().settings?.showDiacritics ?? true;
      const rawLabel = resource ? resource.nameArabic : '???';
      const labelText = showDiacritics ? rawLabel : stripDiacritics(rawLabel);

      // Background rectangle for text readability
      const tempText = this.scene.add.text(0, 0, labelText, {
        fontFamily: "'Noto Naskh Arabic', serif",
        fontSize: '18px',
      });
      const textWidth = tempText.width + 12;
      const textHeight = tempText.height + 6;
      tempText.destroy();

      const labelBg = this.scene.add.rectangle(px, py - 50, textWidth, textHeight, 0x1a1a2e, 0.75)
        .setOrigin(0.5)
        .setDepth(9998);

      const label = this.scene.add.text(px, py - 50, labelText, {
        fontFamily: "'Noto Naskh Arabic', serif",
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#1a1a2e',
        strokeThickness: 4,
        align: 'center',
      }).setOrigin(0.5).setDepth(9999);

      // Interaction hint (hidden by default)
      const hintText = this.scene.add.text(px, py + 30, '[SPACE]', {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '7px',
        color: '#f4fefa',
        stroke: '#2b292c',
        strokeThickness: 2,
      }).setOrigin(0.5).setVisible(false).setDepth(9999);

      const spot = {
        ...cfg,
        sprite,
        label,
        labelBg,
        hintText,
        worldX: px,
        worldY: py,
        state: isDepleted ? 'depleted' : 'ready',
      };

      // Apply visual state
      if (isDepleted) {
        sprite.setTint(0x888888);
        // Schedule respawn based on remaining time
        const remainingTime = cfg.respawnInterval - timeSinceGather;
        this.scene.time.delayedCall(remainingTime, () => {
          this.respawnSpot(cfg.id);
        });
      } else {
        // Add subtle pulsing effect for ready spots
        this.scene.tweens.add({
          targets: sprite,
          alpha: { from: 0.85, to: 1.0 },
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      this.spots.push(spot);
    });
  }

  /**
   * Update gathering spots (called every frame)
   * Checks proximity and handles SPACE key for gathering
   */
  update(playerSprite, interactKey, interactCooldown, setInteractCooldown) {
    let nearSpot = false;

    this.spots.forEach((spot) => {
      const dist = Phaser.Math.Distance.Between(
        playerSprite.x,
        playerSprite.y,
        spot.worldX,
        spot.worldY
      );
      const inRange = dist < GATHER_RANGE;

      // Show/hide interaction hint based on proximity and state
      if (inRange && spot.state === 'ready') {
        spot.hintText.setVisible(true);
      } else if (inRange && spot.state === 'depleted') {
        // Show "depleted" hint
        spot.hintText.setText('Depleted');
        spot.hintText.setVisible(true);
      } else {
        spot.hintText.setVisible(false);
        if (spot.state === 'ready') {
          spot.hintText.setText('[SPACE]');
        }
      }

      // Handle gathering interaction
      if (
        inRange &&
        !nearSpot &&
        spot.state === 'ready' &&
        Phaser.Input.Keyboard.JustDown(interactKey) &&
        !interactCooldown
      ) {
        nearSpot = true;
        setInteractCooldown(true);
        this.scene.time.delayedCall(500, () => {
          setInteractCooldown(false);
        });
        this.gatherResource(spot.id);
      }
    });
  }

  /**
   * Gather resource from a spot
   * @param {string} spotId - Spot ID
   */
  gatherResource(spotId) {
    const spot = this.spots.find(s => s.id === spotId);
    if (!spot || spot.state !== 'ready') {
      return;
    }

    // Get player's profession level for the relevant profession
    const resource = RESOURCES[spot.resourceId];
    if (!resource) {
      console.error(`[GatheringSpotManager] Unknown resource '${spot.resourceId}'`);
      return;
    }

    // Determine profession level (use first matching profession, default to 0)
    const craftingState = store.getState().crafting;
    let professionLevel = 0;
    if (resource.professions && resource.professions.length > 0) {
      const professionId = resource.professions[0];
      const profession = craftingState?.professions?.[professionId];
      professionLevel = profession?.level || 0;
    }

    // Calculate gathering quality based on profession level
    const quality = calculateGatheringQuality(professionLevel);

    // Add resource to player's inventory
    store.dispatch(addResource({
      resourceId: spot.resourceId,
      quantity: 1,
      quality,
    }));

    // Record cooldown timestamp
    const timestamp = Date.now();
    store.dispatch(recordGatheringCooldown({
      spotId,
      timestamp,
    }));

    // Emit events for feedback
    EventBus.emit(EVENTS.CRAFTING_RESOURCE_GATHERED, {
      resourceId: spot.resourceId,
      quality,
      nameArabic: resource.nameArabic,
      nameEnglish: resource.nameEnglish,
    });
    EventBus.emit(EVENTS.SFX_CORRECT);
    EventBus.emit(EVENTS.GATHERING_SPOT_DEPLETED, { spotId });

    // Set spot to depleted state
    spot.state = 'depleted';
    spot.sprite.setTint(0x888888);

    // Schedule respawn
    this.scene.time.delayedCall(spot.respawnInterval, () => {
      this.respawnSpot(spotId);
    });
  }

  /**
   * Respawn a depleted gathering spot
   * @param {string} spotId - Spot ID
   */
  respawnSpot(spotId) {
    const spot = this.spots.find(s => s.id === spotId);
    if (!spot) {
      return;
    }

    // Set state to ready
    spot.state = 'ready';
    spot.sprite.clearTint();

    // Re-add pulsing effect
    this.scene.tweens.add({
      targets: spot.sprite,
      alpha: { from: 0.85, to: 1.0 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Emit ready event
    EventBus.emit(EVENTS.GATHERING_SPOT_READY, { spotId });
  }

  /**
   * Destroy all gathering spots
   */
  destroy() {
    // Clean up event listeners
    this.gatherListeners.forEach(cleanup => cleanup());
    this.gatherListeners.clear();

    // Destroy sprites and labels
    this.spots.forEach((spot) => {
      if (spot.sprite) spot.sprite.destroy();
      if (spot.labelBg) spot.labelBg.destroy();
      if (spot.label) spot.label.destroy();
      if (spot.hintText) spot.hintText.destroy();
    });
    this.spots = [];
  }
}
