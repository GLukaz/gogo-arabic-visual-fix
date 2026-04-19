/**
 * BattleSpriteManager.js — Combatant sprites and battle animations.
 *
 * Battle sprites are 256x256 per frame, separate from overworld sprites.
 * Spritesheet layout: 8 columns x 4 rows = 32 frames
 *   Row 0 (0-7):   Idle cycle (looping)
 *   Row 1 (8-15):  Attack sequence (play-once)
 *   Row 2 (16-19): Hurt, (20-23): Defend
 *   Row 3 (24-27): Cast spell, (28-29): Victory, (30-31): Defeat
 *
 * Player on right (RTL-friendly), enemies on left.
 * Respects prefers-reduced-motion for tint flash effects.
 */

import { store } from '../../../store/store.js';
import { ENEMY_KENMI_MAP } from '../../../data/spriteKeyMap.js';

export class BattleSpriteManager {
  constructor(scene) {
    this.scene = scene;
    this.playerSprite = null;
    this.enemySprites = []; // [{ sprite, enemyId, animPrefix }]
    this.companionSprites = []; // Phase 30
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  spawnPlayer() {
    const { width, height } = this.scene.cameras.main;
    const outfit = store.getState().player.outfit || 'simple-thobe';
    const key = `battle-player-${outfit}`;

    // Player on right side (RTL: protagonist on right)
    this.playerSprite = this.scene.add.sprite(width * 0.75, height * 0.55, key, 0);
    this.playerSprite.setScale(2);
    this.playerSprite.setDepth(10);

    this._createBattleAnims(key, 'player');
    this.playerSprite.play('player-idle');
  }

  spawnEnemies(enemyParty) {
    const { width, height } = this.scene.cameras.main;

    enemyParty.forEach((enemyId, index) => {
      const battleKey = `battle-enemy-${enemyId}`;
      const kenmiKey = ENEMY_KENMI_MAP[enemyId];
      // Use Kenmi sprite when: a Kenmi mapping exists, the Kenmi texture is loaded,
      // and the 256x256 battle sprite is NOT already loaded (kenmi is the fallback).
      const useKenmi = !!(kenmiKey && this.scene.textures.exists(kenmiKey) && !this.scene.textures.exists(battleKey));

      const textureKey = useKenmi ? kenmiKey : battleKey;

      // Enemies on left side, staggered vertically for multi-enemy
      const xPos = width * 0.25;
      const yPos = height * 0.45 + index * 80;

      const sprite = this.scene.add.sprite(xPos, yPos, textureKey, 0);

      if (useKenmi) {
        sprite.setScale(6); // 16px * 6 = 96px — visible at battle scale
      } else {
        sprite.setScale(2); // Original 256x256 * 2
      }

      sprite.setFlipX(true); // Face right toward player
      sprite.setDepth(10);

      const animPrefix = `enemy-${index}`;

      if (useKenmi) {
        this._createKenmiBattleAnims(textureKey, animPrefix);
      } else {
        this._createBattleAnims(textureKey, animPrefix);
      }

      sprite.play(`${animPrefix}-idle`);
      this.enemySprites.push({ sprite, enemyId, animPrefix, useKenmi });
    });
  }

  _createBattleAnims(textureKey, prefix) {
    const anims = this.scene.anims;

    // Check if texture exists before creating animations
    if (!this.scene.textures.exists(textureKey)) {
      // Create placeholder animations that don't depend on the texture
      return;
    }

    // Idle: frames 0-7, looping
    if (!anims.exists(`${prefix}-idle`)) {
      anims.create({
        key: `${prefix}-idle`,
        frames: anims.generateFrameNumbers(textureKey, { start: 0, end: 7 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Attack: frames 8-15, play once
    if (!anims.exists(`${prefix}-attack`)) {
      anims.create({
        key: `${prefix}-attack`,
        frames: anims.generateFrameNumbers(textureKey, { start: 8, end: 15 }),
        frameRate: 12,
        repeat: 0,
      });
    }

    // Hurt: frames 16-19, play once
    if (!anims.exists(`${prefix}-hurt`)) {
      anims.create({
        key: `${prefix}-hurt`,
        frames: anims.generateFrameNumbers(textureKey, { start: 16, end: 19 }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Defend: frames 20-23, play once (hold last frame)
    if (!anims.exists(`${prefix}-defend`)) {
      anims.create({
        key: `${prefix}-defend`,
        frames: anims.generateFrameNumbers(textureKey, { start: 20, end: 23 }),
        frameRate: 8,
        repeat: 0,
      });
    }

    // Cast: frames 24-27, play once
    if (!anims.exists(`${prefix}-cast`)) {
      anims.create({
        key: `${prefix}-cast`,
        frames: anims.generateFrameNumbers(textureKey, { start: 24, end: 27 }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Victory: frames 28-29, looping
    if (!anims.exists(`${prefix}-victory`)) {
      anims.create({
        key: `${prefix}-victory`,
        frames: anims.generateFrameNumbers(textureKey, { start: 28, end: 29 }),
        frameRate: 4,
        repeat: -1,
      });
    }

    // Defeat: frames 30-31, play once (hold last frame)
    if (!anims.exists(`${prefix}-defeat`)) {
      anims.create({
        key: `${prefix}-defeat`,
        frames: anims.generateFrameNumbers(textureKey, { start: 30, end: 31 }),
        frameRate: 4,
        repeat: 0,
      });
    }
  }

  /**
   * Create battle animations for Kenmi 16x16 spritesheets (12 cols x 20 rows).
   * Walk-cycle rows: down=0, left=1, right=2, up=3 (each row = 12 frames)
   *   Row 0 frames 0-11  = walk-down
   *   Row 1 frames 12-23 = walk-left
   *   Row 2 frames 24-35 = walk-right (used for attack lunge)
   *   Row 3 frames 36-47 = walk-up   (used for cast gesture)
   */
  _createKenmiBattleAnims(textureKey, prefix) {
    const anims = this.scene.anims;

    if (!this.scene.textures.exists(textureKey)) return;

    // Idle: walk-down frames 0-2, looping (gentle sway)
    if (!anims.exists(`${prefix}-idle`)) {
      anims.create({
        key: `${prefix}-idle`,
        frames: anims.generateFrameNumbers(textureKey, { frames: [0, 1, 2] }),
        frameRate: 4,
        repeat: -1,
      });
    }

    // Attack: walk-right frames 24-26, play once (lunge forward)
    if (!anims.exists(`${prefix}-attack`)) {
      anims.create({
        key: `${prefix}-attack`,
        frames: anims.generateFrameNumbers(textureKey, { frames: [24, 25, 26] }),
        frameRate: 12,
        repeat: 0,
      });
    }

    // Hurt: quick flash between frames 0 and 2
    if (!anims.exists(`${prefix}-hurt`)) {
      anims.create({
        key: `${prefix}-hurt`,
        frames: anims.generateFrameNumbers(textureKey, { frames: [0, 2] }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Defend: hold frame 12 (walk-left first frame — brace stance)
    if (!anims.exists(`${prefix}-defend`)) {
      anims.create({
        key: `${prefix}-defend`,
        frames: [{ key: textureKey, frame: 12 }],
        frameRate: 1,
        repeat: 0,
      });
    }

    // Cast: walk-up frames 36-38 (arms raised gesture)
    if (!anims.exists(`${prefix}-cast`)) {
      anims.create({
        key: `${prefix}-cast`,
        frames: anims.generateFrameNumbers(textureKey, { frames: [36, 37, 38] }),
        frameRate: 10,
        repeat: 0,
      });
    }

    // Victory: reuse idle walk-down loop
    if (!anims.exists(`${prefix}-victory`)) {
      anims.create({
        key: `${prefix}-victory`,
        frames: anims.generateFrameNumbers(textureKey, { frames: [0, 1, 2] }),
        frameRate: 4,
        repeat: -1,
      });
    }

    // Defeat: freeze on frame 0
    if (!anims.exists(`${prefix}-defeat`)) {
      anims.create({
        key: `${prefix}-defeat`,
        frames: [{ key: textureKey, frame: 0 }],
        frameRate: 1,
        repeat: 0,
      });
    }
  }

  // --- Animation triggers called by BattleStateMachine ---

  playPlayerAttack(onComplete) {
    this._playAndReturn(this.playerSprite, 'player-attack', 'player-idle', onComplete);
  }

  playPlayerHurt(onComplete) {
    this._flashTint(this.playerSprite, 0xff0000, 150);
    this._playAndReturn(this.playerSprite, 'player-hurt', 'player-idle', onComplete);
  }

  playPlayerCast(onComplete) {
    this._playAndReturn(this.playerSprite, 'player-cast', 'player-idle', onComplete);
  }

  playPlayerDefend(onComplete) {
    this._playAndReturn(this.playerSprite, 'player-defend', 'player-idle', onComplete);
  }

  playPlayerVictory() {
    this.playerSprite?.play('player-victory');
  }

  playPlayerDefeat() {
    this.playerSprite?.play('player-defeat');
  }

  playEnemyAttack(enemyIndex, onComplete) {
    const enemy = this.enemySprites[enemyIndex];
    if (!enemy) return onComplete?.();
    this._playAndReturn(
      enemy.sprite,
      `${enemy.animPrefix}-attack`,
      `${enemy.animPrefix}-idle`,
      onComplete
    );
  }

  playEnemyHurt(enemyIndex, onComplete) {
    const enemy = this.enemySprites[enemyIndex];
    if (!enemy) return onComplete?.();
    this._flashTint(enemy.sprite, 0xff0000, 150);
    this._playAndReturn(
      enemy.sprite,
      `${enemy.animPrefix}-hurt`,
      `${enemy.animPrefix}-idle`,
      onComplete
    );
  }

  playEnemyDefeat(enemyIndex, onComplete) {
    const enemy = this.enemySprites[enemyIndex];
    if (!enemy) return onComplete?.();
    enemy.sprite.play(`${enemy.animPrefix}-defeat`);
    this.scene.tweens.add({
      targets: enemy.sprite,
      alpha: 0,
      duration: 800,
      delay: 400,
      onComplete: () => onComplete?.(),
    });
  }

  // --- Helpers ---

  _playAndReturn(sprite, animKey, idleKey, onComplete) {
    if (!sprite || !this.scene.anims.exists(animKey)) {
      // Fallback: skip animation if it doesn't exist (no sprite loaded)
      onComplete?.();
      return;
    }
    sprite.play(animKey);
    sprite.once('animationcomplete', () => {
      sprite.play(idleKey);
      onComplete?.();
    });
  }

  _flashTint(sprite, color, duration) {
    if (this.reduceMotion || !sprite) return;
    sprite.setTint(color);
    this.scene.time.delayedCall(duration, () => {
      sprite.clearTint();
    });
  }

  update() {
    // Future: idle breathing tween, bobbing, shadow pulse
  }

  destroy() {
    this.playerSprite?.destroy();
    this.enemySprites.forEach((e) => e.sprite?.destroy());
    this.companionSprites.forEach((c) => c.sprite?.destroy());
    this.playerSprite = null;
    this.enemySprites = [];
    this.companionSprites = [];
  }
}
