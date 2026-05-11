import Phaser from 'phaser';
import { store } from '../../store/store.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { audioManager } from '../../services/audio.js';

/**
 * Player sprite with 2-layer compositing (body + head covering).
 *
 * The body sprite is the physics-enabled main sprite.
 * The head covering sprite is a non-physics sprite that follows the body
 * and animates in sync.
 *
 * Spritesheet layout: 4 cols × 4 rows (512x512 total, 128x128 frames)
 *   Row 0 (frames 0-3): Walk down
 *   Row 1 (frames 4-7): Walk left
 *   Row 2 (frames 8-11): Walk right
 *   Row 3 (frames 12-15): Walk up
 */

// Skin tone tint values (applied as multiply tint)
// These shift the baked-in medium skin tone to the target
const SKIN_TINTS = [
  0xFFF5E8,  // 0 = light  (brighten slightly)
  0xFFFFFF,  // 1 = medium (no change)
  0xE8D0B0,  // 2 = tan    (darken slightly)
  0xC0A080,  // 3 = dark   (darken more)
];

// Map outfit IDs from Redux to body spritesheet keys
const OUTFIT_KEYS = {
  'simple-thobe': 'body-simple-thobe',
  'simple-abaya': 'body-simple-abaya',
  'travellers-cloak': 'body-travellers-cloak',
  'desert-thobe': 'body-desert-thobe',
  'blue-thobe': 'body-blue-thobe',
  'green-abaya': 'body-green-abaya',
  'scholars-robe': 'body-scholars-robe',
  'merchants-vest': 'body-merchants-vest',
  'bedouin-wrap': 'body-bedouin-wrap',
  'mountain-cloak': 'body-mountain-cloak',
  'captains-coat': 'body-captains-coat',
  'royal-garment': 'body-royal-garment',
};

// Map head covering IDs to spritesheet keys
const HEAD_KEYS = {
  'kufi': 'head-kufi',
  'ghutra': 'head-ghutra',
  'turban': 'head-turban',
  'hijab': 'head-hijab',
  'hood': 'head-hood',
  'none': 'head-none',
};

// Fallback keys
const DEFAULT_BODY = 'body-simple-thobe';
const DEFAULT_HEAD = 'head-kufi';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Read player state from Redux
    const state = store.getState().player;
    const bodyKey = OUTFIT_KEYS[state.outfit] || DEFAULT_BODY;
    const headKey = HEAD_KEYS[state.headCovering] || DEFAULT_HEAD;
    const skinTint = SKIN_TINTS[state.skinTone] ?? SKIN_TINTS[1];

    // Use a fallback if the body texture isn't loaded
    const textureKey = scene.textures.exists(bodyKey) ? bodyKey : 'player';

    super(scene, x, y, textureKey, 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Store current keys
    this.bodyKey = textureKey;
    this.headKey = headKey;
    this.skinTint = skinTint;

    // Physics body — smaller hitbox
    this.setSize(40, 30);
    this.setOffset(44, 90);

    this.speed = 200;
    this.sprintSpeed = 400; // 2x normal speed
    this.isFrozen = false;
    this.lastDir = 'down';

    // Sprint mechanics
    this.isSprinting = false;
    this.stamina = 100;
    this.maxStamina = 100;
    this.staminaDrainRate = 20; // Points per second while sprinting
    this.staminaRechargeRate = 33.33; // Points per second (full recharge in 3s)
    this.canSprint = true;

    // Double-tap sprint boost
    this.lastTapTime = { left: 0, right: 0, up: 0, down: 0 };
    this.prevKeyState = { left: false, right: false, up: false, down: false };
    this.doubleTapWindow = 300; // ms
    this.speedBoostActive = false;
    this.speedBoostEndTime = 0;
    this.speedBoostMultiplier = 1.5;

    // Footstep SFX timing
    this.footstepTimer = 0;
    this.footstepInterval = 320; // ms between footstep sounds at normal speed

    // NOTE: Skin tint is only applied to head sprite (not body).
    // Body sprite contains clothing that gets ruined by multiply tint on darker skin tones.

    // --- Head covering sprite (non-physics, follows body) ---
    const headTextureKey = scene.textures.exists(headKey) ? headKey : null;
    if (headTextureKey) {
      this.headSprite = scene.add.sprite(x, y, headTextureKey, 0);
      this.headSprite.setTint(skinTint);
    } else {
      this.headSprite = null;
    }

    // --- Create animations for body ---
    this._createAnims(scene, this.bodyKey, 'body');

    // --- Create animations for head ---
    if (this.headSprite && headTextureKey) {
      this._createAnims(scene, headTextureKey, 'head');
    }

    // --- Input ---
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    // Create dust particle texture if it doesn't exist
    if (!scene.textures.exists('particle-dust')) {
      const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
      graphics.fillStyle(0xD4A843, 1);
      graphics.fillCircle(4, 4, 4);
      graphics.generateTexture('particle-dust', 8, 8);
      graphics.destroy();
    }

    // Dust particles for sprint visual feedback
    this.dustParticles = scene.add.particles(x, y, 'particle-dust', {
      speed: { min: 20, max: 40 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 300,
      frequency: 100,
      maxParticles: 10,
      on: false, // Start disabled
    });
    this.dustParticles.setDepth(this.depth - 1);
  }

  _createAnims(scene, textureKey, prefix) {
    const dirs = [
      { key: `${prefix}-walk-down`, row: 0 },
      { key: `${prefix}-walk-left`, row: 1 },
      { key: `${prefix}-walk-right`, row: 2 },
      { key: `${prefix}-walk-up`, row: 3 },
    ];

    dirs.forEach(({ key, row }) => {
      if (!scene.anims.exists(key)) {
        scene.anims.create({
          key,
          frames: scene.anims.generateFrameNumbers(textureKey, {
            start: row * 4,
            end: row * 4 + 3,
          }),
          frameRate: 8,
          repeat: -1,
        });
      }
    });

    ['down', 'left', 'right', 'up'].forEach((dir, i) => {
      const idleKey = `${prefix}-idle-${dir}`;
      if (!scene.anims.exists(idleKey)) {
        scene.anims.create({
          key: idleKey,
          frames: [{ key: textureKey, frame: i * 4 }],
          frameRate: 1,
        });
      }
    });
  }

  /**
   * Play animation on both body and head in sync.
   */
  _playAnim(animSuffix, ignoreIfPlaying = true) {
    this.anims.play(`body-${animSuffix}`, ignoreIfPlaying);
    if (this.headSprite) {
      this.headSprite.anims.play(`head-${animSuffix}`, ignoreIfPlaying);
    }
  }

  /**
   * Change outfit at runtime (e.g., from shop).
   */
  changeOutfit(outfitId) {
    const newBodyKey = OUTFIT_KEYS[outfitId];
    if (!newBodyKey || !this.scene.textures.exists(newBodyKey)) return;

    this.bodyKey = newBodyKey;
    this.setTexture(newBodyKey);
    this._createAnims(this.scene, newBodyKey, 'body');
    this._playAnim(`idle-${this.lastDir}`, false);
  }

  /**
   * Change head covering at runtime.
   */
  changeHeadCovering(coveringId) {
    const newHeadKey = HEAD_KEYS[coveringId];
    if (!newHeadKey || !this.scene.textures.exists(newHeadKey)) return;

    this.headKey = newHeadKey;
    if (this.headSprite) {
      this.headSprite.setTexture(newHeadKey);
    } else {
      this.headSprite = this.scene.add.sprite(this.x, this.y, newHeadKey, 0);
      this.headSprite.setTint(this.skinTint);
    }
    this._createAnims(this.scene, newHeadKey, 'head');
    this._playAnim(`idle-${this.lastDir}`, false);
  }

  freeze() {
    this.isFrozen = true;
    this.setVelocity(0, 0);
    this._playAnim(`idle-${this.lastDir}`);
  }

  unfreeze() {
    this.isFrozen = false;
  }

  update() {
    if (this.isFrozen) return;

    const delta = this.scene.game.loop.delta / 1000; // Delta time in seconds

    // Check for speed boost expiry
    if (this.speedBoostActive && Date.now() > this.speedBoostEndTime) {
      this.speedBoostActive = false;
    }

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    // Detect double-tap for speed boost (key pressed -> released -> pressed again)
    const now = Date.now();

    // Left key
    if (left && !this.prevKeyState.left) {
      if (now - this.lastTapTime.left < this.doubleTapWindow) {
        this._activateSpeedBoost();
      }
      this.lastTapTime.left = now;
    }
    this.prevKeyState.left = left;

    // Right key
    if (right && !this.prevKeyState.right) {
      if (now - this.lastTapTime.right < this.doubleTapWindow) {
        this._activateSpeedBoost();
      }
      this.lastTapTime.right = now;
    }
    this.prevKeyState.right = right;

    // Up key
    if (up && !this.prevKeyState.up) {
      if (now - this.lastTapTime.up < this.doubleTapWindow) {
        this._activateSpeedBoost();
      }
      this.lastTapTime.up = now;
    }
    this.prevKeyState.up = up;

    // Down key
    if (down && !this.prevKeyState.down) {
      if (now - this.lastTapTime.down < this.doubleTapWindow) {
        this._activateSpeedBoost();
      }
      this.lastTapTime.down = now;
    }
    this.prevKeyState.down = down;

    // Sprint logic (Shift key held + has stamina)
    const wantsToSprint = this.shiftKey.isDown && (left || right || up || down);

    if (wantsToSprint && this.stamina > 0) {
      this.isSprinting = true;
      this.stamina = Math.max(0, this.stamina - this.staminaDrainRate * delta);

      // Disable sprinting when stamina depletes
      if (this.stamina <= 0) {
        this.canSprint = false;
      }
    } else {
      this.isSprinting = false;
      // Recharge stamina when not sprinting
      this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRechargeRate * delta);

      // Re-enable sprinting when stamina is above 20%
      if (this.stamina >= this.maxStamina * 0.2) {
        this.canSprint = true;
      }
    }

    // Prevent sprinting if stamina system locked it
    if (!this.canSprint) {
      this.isSprinting = false;
    }

    // Calculate effective speed
    let effectiveSpeed = this.speed;
    if (this.speedBoostActive) {
      effectiveSpeed *= this.speedBoostMultiplier;
    } else if (this.isSprinting) {
      effectiveSpeed = this.sprintSpeed;
    }

    this.setVelocity(0, 0);

    if (left) {
      this.setVelocityX(-effectiveSpeed);
      this._playAnim('walk-left');
      this.lastDir = 'left';
    } else if (right) {
      this.setVelocityX(effectiveSpeed);
      this._playAnim('walk-right');
      this.lastDir = 'right';
    } else if (up) {
      this.setVelocityY(-effectiveSpeed);
      this._playAnim('walk-up');
      this.lastDir = 'up';
    } else if (down) {
      this.setVelocityY(effectiveSpeed);
      this._playAnim('walk-down');
      this.lastDir = 'down';
    } else {
      this._playAnim(`idle-${this.lastDir}`);
    }

    // Normalize diagonal movement
    if ((left || right) && (up || down)) {
      this.body.velocity.normalize().scale(effectiveSpeed);
    }

    // Footstep SFX
    const moving = left || right || up || down;
    if (moving) {
      this.footstepTimer += this.scene.game.loop.delta;
      // Faster footsteps when sprinting
      const interval = this.isSprinting ? this.footstepInterval * 0.6 : this.footstepInterval;
      if (this.footstepTimer >= interval) {
        this.footstepTimer = 0;
        audioManager.playSFX('footstep');
      }
    } else {
      this.footstepTimer = 0;
    }

    // Update dust particles
    if (this.dustParticles) {
      this.dustParticles.setPosition(this.x, this.y + 20);

      // Enable particles when sprinting or boosting
      if (this.isSprinting || this.speedBoostActive) {
        if (!this.dustParticles.emitting) {
          this.dustParticles.start();
        }
      } else {
        if (this.dustParticles.emitting) {
          this.dustParticles.stop();
        }
      }
    }

    // Keep head sprite in sync with body position and depth
    if (this.headSprite) {
      this.headSprite.setPosition(this.x, this.y);
      this.headSprite.setDepth(this.depth + 1);
    }

    // Emit stamina update for HUD (only when sprinting to avoid spam)
    if (this.isSprinting || this.stamina < this.maxStamina) {
      EventBus.emit(EVENTS.PLAYER_STAMINA_UPDATE, {
        stamina: this.stamina,
        maxStamina: this.maxStamina,
        isSprinting: this.isSprinting
      });
    }
  }

  _activateSpeedBoost() {
    this.speedBoostActive = true;
    this.speedBoostEndTime = Date.now() + 500; // 500ms boost duration
  }

  destroy(fromScene) {
    if (this.headSprite) {
      this.headSprite.destroy();
      this.headSprite = null;
    }
    if (this.dustParticles) {
      this.dustParticles.destroy();
      this.dustParticles = null;
    }
    super.destroy(fromScene);
  }

  /**
   * Get stamina info for HUD display
   */
  getStaminaInfo() {
    return {
      stamina: this.stamina,
      maxStamina: this.maxStamina,
      isSprinting: this.isSprinting,
      canSprint: this.canSprint
    };
  }
}

export { SKIN_TINTS, OUTFIT_KEYS, HEAD_KEYS };
