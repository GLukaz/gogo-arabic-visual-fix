/**
 * EquipmentManager.js — Phaser sprite management for equipment rendering
 *
 * Creates and manages equipment sprites layered on top of player character.
 * Listens to EVENTS.EQUIPMENT_CHANGED and updates sprites accordingly.
 * Supports graceful degradation (missing textures) and prefers-reduced-motion.
 */

import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import { EQUIPMENT_DATA } from '../../../data/equipment.js';

/**
 * Depth layers for equipment rendering (relative to player sprite depth)
 * Lower values render behind, higher values render in front
 */
const DEPTH_LAYERS = {
  boots: 0,
  belt: 5,
  robe: 10,
  gloves: 15,
  cloak: 20,
  headCovering: 25,
  accessory1: 30,
  accessory2: 35,
};

export class EquipmentManager {
  /**
   * @param {Phaser.Scene} scene - The scene this manager belongs to
   * @param {Phaser.GameObjects.Sprite} playerSprite - The player sprite to attach equipment to
   */
  constructor(scene, playerSprite) {
    this.scene = scene;
    this.playerSprite = playerSprite;
    this.equipmentSprites = {}; // { slot: sprite }
    this.lastPlayerX = playerSprite.x;
    this.lastPlayerY = playerSprite.y;
    this.lastPlayerFrame = playerSprite.frame?.name;

    // Check prefers-reduced-motion setting
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Bind event listener
    this._onEquipmentChanged = this.updateSprites.bind(this);
    EventBus.on(EVENTS.EQUIPMENT_CHANGED, this._onEquipmentChanged);

    // Initial render
    this.updateSprites();
  }

  /**
   * Update all equipment sprites based on current inventory state
   * Called on construction and when EQUIPMENT_CHANGED event fires
   */
  updateSprites() {
    // Get current equipped items from Redux
    const equipped = store.getState().inventory.equipped;

    // Destroy all existing equipment sprites
    Object.values(this.equipmentSprites).forEach((sprite) => {
      if (sprite) sprite.destroy();
    });
    this.equipmentSprites = {};

    // Create sprites for each equipped slot
    for (const [slot, itemId] of Object.entries(equipped)) {
      if (!itemId) continue; // Skip empty slots

      // Look up item data
      const itemData = EQUIPMENT_DATA[itemId];
      if (!itemData) {
        console.warn(`[EquipmentManager] Item '${itemId}' not found in EQUIPMENT_DATA`);
        continue;
      }

      // Check if texture exists (graceful degradation)
      const assetKey = `equipment_${itemId}`;
      if (!this.scene.textures.exists(assetKey)) {
        // Texture not yet created — skip without error
        // This allows development to continue before all equipment sprites are made
        continue;
      }

      // Create sprite at player position
      const sprite = this.scene.add.sprite(
        this.playerSprite.x,
        this.playerSprite.y,
        assetKey
      );

      // Set depth relative to player sprite
      const playerDepth = this.playerSprite.depth || 0;
      sprite.setDepth(playerDepth + DEPTH_LAYERS[slot]);

      // Match player scale/flip if applicable
      if (this.playerSprite.scaleX !== undefined) {
        sprite.setScale(this.playerSprite.scaleX, this.playerSprite.scaleY);
      }
      if (this.playerSprite.flipX !== undefined) {
        sprite.setFlipX(this.playerSprite.flipX);
      }

      // Store sprite reference
      this.equipmentSprites[slot] = sprite;

      // Apply equipment glow/shimmer effect if not reduced-motion
      // (Skip VFX for now — can be added in future polish phase)
    }

    // Emit event so battle system recalculates equipment stats
    EventBus.emit(EVENTS.EQUIPMENT_STATS_UPDATED);
  }

  /**
   * Update equipment sprite positions to match player sprite
   * Called every frame from scene update()
   */
  update() {
    if (!this.playerSprite || !this.playerSprite.active) return;

    // Optimization: only update if player has moved or frame changed
    const playerMoved =
      this.playerSprite.x !== this.lastPlayerX ||
      this.playerSprite.y !== this.lastPlayerY;
    const frameChanged = this.playerSprite.frame?.name !== this.lastPlayerFrame;

    if (!playerMoved && !frameChanged) {
      return; // No update needed
    }

    // Update all equipment sprite positions and frames
    for (const sprite of Object.values(this.equipmentSprites)) {
      if (!sprite) continue;

      sprite.setPosition(this.playerSprite.x, this.playerSprite.y);

      // Sync frame if equipment has matching animation frames
      if (this.playerSprite.frame && sprite.frame) {
        const frameName = this.playerSprite.frame.name;
        if (sprite.anims && sprite.anims.currentAnim) {
          // If equipment has animations, sync them
          sprite.setFrame(frameName);
        }
      }

      // Sync scale and flip
      if (this.playerSprite.scaleX !== undefined) {
        sprite.setScale(this.playerSprite.scaleX, this.playerSprite.scaleY);
      }
      if (this.playerSprite.flipX !== undefined) {
        sprite.setFlipX(this.playerSprite.flipX);
      }
    }

    // Store last state for next frame
    this.lastPlayerX = this.playerSprite.x;
    this.lastPlayerY = this.playerSprite.y;
    this.lastPlayerFrame = this.playerSprite.frame?.name;
  }

  /**
   * Clean up sprites and event listeners
   * Called in scene shutdown()
   */
  destroy() {
    // Destroy all equipment sprites
    Object.values(this.equipmentSprites).forEach((sprite) => {
      if (sprite) sprite.destroy();
    });
    this.equipmentSprites = {};

    // Unbind event listener
    EventBus.off(EVENTS.EQUIPMENT_CHANGED, this._onEquipmentChanged);
  }
}
