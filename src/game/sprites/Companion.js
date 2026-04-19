import Phaser from 'phaser';
import { NPC } from './NPC.js';

export class Companion extends NPC {
  constructor(scene, x, y, config) {
    // config: { id, key, name, companionId, colorPalette }
    super(scene, x, y, config);

    this.companionId = config.companionId;
    this.followTarget = null;        // Player sprite reference
    this.followDistance = 80;         // Stay 80px behind player
    this.updateInterval = 200;       // Recalculate path every 200ms (lazy)
    this.lastUpdateTime = 0;
    this.isFollowing = false;
    this.moveSpeed = 100;            // Pixels per second

    // Override NPC immovable — companions need to move
    this.setImmovable(false);

    // Walk animations (4-direction)
    const walkDown = `${config.id}-walk-down`;
    const walkUp = `${config.id}-walk-up`;
    const walkLeft = `${config.id}-walk-left`;
    const walkRight = `${config.id}-walk-right`;

    // Create walk animations if they don't exist (using standard 4x4 spritesheet)
    if (!scene.anims.exists(walkDown)) {
      scene.anims.create({ key: walkDown, frames: scene.anims.generateFrameNumbers(config.key, { frames: [0, 1, 2, 3] }), frameRate: 8, repeat: -1 });
    }
    if (!scene.anims.exists(walkUp)) {
      scene.anims.create({ key: walkUp, frames: scene.anims.generateFrameNumbers(config.key, { frames: [12, 13, 14, 15] }), frameRate: 8, repeat: -1 });
    }
    if (!scene.anims.exists(walkLeft)) {
      scene.anims.create({ key: walkLeft, frames: scene.anims.generateFrameNumbers(config.key, { frames: [4, 5, 6, 7] }), frameRate: 8, repeat: -1 });
    }
    if (!scene.anims.exists(walkRight)) {
      scene.anims.create({ key: walkRight, frames: scene.anims.generateFrameNumbers(config.key, { frames: [8, 9, 10, 11] }), frameRate: 8, repeat: -1 });
    }

    // Hide NPC interaction hints for companions (they follow, not get interacted with via SPACE)
    this.hintText.setVisible(false);
    this.questMarker.setVisible(false);

    // Set companion name label color to companion's primary color
    if (config.colorPalette?.primary) {
      this.nameLabel.setColor(config.colorPalette.primary);
    }
  }

  setFollowTarget(target) {
    this.followTarget = target;
    this.isFollowing = !!target;
  }

  update(time, _delta) {
    if (!this.followTarget || !this.isFollowing) return;

    // Lazy update: only recalculate every 200ms
    if (time - this.lastUpdateTime < this.updateInterval) return;
    this.lastUpdateTime = time;

    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.followTarget.x, this.followTarget.y
    );

    if (distance > this.followDistance + 32) {
      // Move toward player
      this.scene.physics.moveToObject(this, this.followTarget, this.moveSpeed);
      this._playDirectionalWalkAnim();
    } else if (distance < this.followDistance) {
      // Too close, stop
      this.setVelocity(0, 0);
      this._playIdleAnim();
    } else {
      // In sweet spot, stop
      this.setVelocity(0, 0);
      this._playIdleAnim();
    }

    // Teleport if too far away (e.g., zone transition)
    if (distance > 500) {
      this.setPosition(
        this.followTarget.x - 60,
        this.followTarget.y + 30
      );
      this.setVelocity(0, 0);
    }

    // Update label/name positions
    this.nameLabel.setPosition(this.x, this.y - 56);
  }

  _playDirectionalWalkAnim() {
    const vx = this.body.velocity.x;
    const vy = this.body.velocity.y;
    const id = this.npcId;

    if (Math.abs(vx) > Math.abs(vy)) {
      this.anims.play(vx < 0 ? `${id}-walk-left` : `${id}-walk-right`, true);
    } else {
      this.anims.play(vy < 0 ? `${id}-walk-up` : `${id}-walk-down`, true);
    }
  }

  _playIdleAnim() {
    this.setFrame(0);
    this.anims.stop();
  }

  destroy(fromScene) {
    this.followTarget = null;
    this.isFollowing = false;
    super.destroy(fromScene);
  }
}
