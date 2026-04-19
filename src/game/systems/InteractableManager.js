import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { store } from '../../store/store.js';
import { stripDiacritics } from '../../utils/arabicUtils.js';

// Interactable proximity threshold: 2 tiles = 128px
const INTERACT_RANGE = 64 * 2;

// Sprite key mapping for the 8 new interactive object types + inscription — Kenmi keys
const WORLD_OBJECT_SPRITES = {
  fountain: 'kenmi-desert-props-golden-pots',
  statue: 'kenmi-desert-temple-desert-obelisk-small-1',
  painting: 'kenmi-desert-temple-desert-obelisk-small-2',
  lantern: 'kenmi-desert-props-desert-rocks',
  stall: 'kenmi-desert-houses-pergola',
  barrel: 'kenmi-desert-props-desert-rocks',
  crate: 'kenmi-desert-props-golden-pots',
  pot: 'kenmi-desert-props-golden-pots',
  inscription: 'kenmi-desert-temple-desert-obelisk-small-2',
};

// Set of all new world object types (behavior composition, not class-per-type)
const WORLD_OBJECT_TYPES = new Set(Object.keys(WORLD_OBJECT_SPRITES));

// One-time (non-repeatable) object types — once interacted, they are "used up"
// Note: pot removed — all 23 pot entries explicitly set repeatable: true
const ONE_TIME_TYPES = new Set(['barrel', 'crate']);

/**
 * InteractableManager
 * Manages chests, bookshelves, signs, doors, and 8 new world object types
 * (fountain, statue, painting, lantern, stall, barrel, crate, pot).
 */
export class InteractableManager {
  constructor(scene) {
    this.scene = scene;
    this.interactables = [];
    this.doorTweens = [];
    this.objectTweens = [];
  }

  /**
   * Create interactable objects from zone config
   */
  create(interactableConfigs, objectSprites) {
    this.interactables = [];

    interactableConfigs.forEach((cfg) => {
      const px = cfg.x * 64 + 32;
      const py = cfg.y * 64 + 32;

      // Choose sprite based on type — Kenmi keys
      let spriteKey;
      if (cfg.type === 'sign') spriteKey = 'kenmi-desert-temple-desert-obelisk-small-2';
      else if (cfg.type === 'bookshelf') spriteKey = 'kenmi-desert-temple-desert-obelisk-small-1';
      else if (cfg.type === 'chest') spriteKey = 'kenmi-desert-props-desert-rocks';
      else if (cfg.type === 'door') spriteKey = 'kenmi-desert-houses-desert-house-1.1';
      else if (WORLD_OBJECT_TYPES.has(cfg.type)) spriteKey = WORLD_OBJECT_SPRITES[cfg.type];

      const sprite = this.scene.add.image(px, py, spriteKey).setOrigin(0.5, 0.8);
      sprite.setScale(0.7);

      // Tint already-opened chests from persisted state
      if (cfg.type === 'chest') {
        const openedChests = store.getState().player.openedChests || [];
        if (openedChests.includes(cfg.id)) {
          sprite.setTint(0x666666);
        }
      }

      // Tint already-interacted one-time world objects from narrativeSlice
      if (WORLD_OBJECT_TYPES.has(cfg.type)) {
        const worldObjectStates = store.getState().narrative?.worldObjectStates || {};
        const objectState = worldObjectStates[cfg.id];
        const repeatable = cfg.repeatable === true || (cfg.repeatable !== false && !ONE_TIME_TYPES.has(cfg.type));
        if (!repeatable && objectState === 'used') {
          sprite.setTint(0x666666);
        }
      }

      objectSprites.push(sprite);

      // Label above the object (respects harakat setting)
      const showDiacritics = store.getState().settings?.showDiacritics ?? true;
      let rawLabel;
      let useArabicFont = false;

      if (cfg.type === 'sign') {
        rawLabel = cfg.textArabic;
        useArabicFont = true;
      } else if (cfg.type === 'bookshelf') {
        rawLabel = 'Bookshelf';
      } else if (cfg.type === 'door') {
        rawLabel = cfg.labelArabic || 'Door';
        useArabicFont = !!cfg.labelArabic;
      } else if (WORLD_OBJECT_TYPES.has(cfg.type) && cfg.labelArabic) {
        rawLabel = cfg.labelArabic;
        useArabicFont = true;
      } else if (WORLD_OBJECT_TYPES.has(cfg.type)) {
        // Fallback to type name capitalized
        rawLabel = cfg.type.charAt(0).toUpperCase() + cfg.type.slice(1);
      } else {
        rawLabel = 'Chest';
      }

      const labelText = (useArabicFont && !showDiacritics) ? stripDiacritics(rawLabel) : rawLabel;
      const label = this.scene.add.text(px, py - 50, labelText, {
        fontFamily: useArabicFont ? "'Noto Naskh Arabic', serif" : "'Press Start 2P', monospace",
        fontSize: useArabicFont ? '14px' : '7px',
        color: '#e2b659',
        stroke: '#2b292c',
        strokeThickness: 3,
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

      const interactable = {
        ...cfg,
        sprite,
        label,
        hintText,
        worldX: px,
        worldY: py,
      };
      this.interactables.push(interactable);

      // Door glow effect: pulsing alpha for unlocked doors with interiors
      if (cfg.type === 'door') {
        if (!cfg.locked && cfg.interiorId) {
          const tween = this.scene.tweens.add({
            targets: sprite,
            alpha: { from: 0.85, to: 1.0 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          this.doorTweens.push(tween);
        } else if (cfg.locked) {
          sprite.setTint(0x888888);
        }
      }

      // Visual cue for new world object types: subtle pulsing alpha tween
      if (WORLD_OBJECT_TYPES.has(cfg.type)) {
        const worldObjectStates = store.getState().narrative?.worldObjectStates || {};
        const objectState = worldObjectStates[cfg.id];
        const repeatable = cfg.repeatable === true || (cfg.repeatable !== false && !ONE_TIME_TYPES.has(cfg.type));
        // Only pulse if the object is still interactive (repeatable or not yet used)
        if (repeatable || objectState !== 'used') {
          const tween = this.scene.tweens.add({
            targets: sprite,
            alpha: { from: 0.8, to: 1.0 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
          this.objectTweens.push(tween);
        }
      }
    });
  }

  /**
   * Update interactable zones (called every frame)
   * Checks proximity and handles SPACE key for interaction
   */
  update(playerSprite, interactKey, interactCooldown, setInteractCooldown) {
    let nearInteractable = false;

    this.interactables.forEach((obj) => {
      const dist = Phaser.Math.Distance.Between(
        playerSprite.x,
        playerSprite.y,
        obj.worldX,
        obj.worldY
      );
      const inRange = dist < INTERACT_RANGE;
      obj.hintText.setVisible(inRange);

      if (
        inRange &&
        !nearInteractable &&
        Phaser.Input.Keyboard.JustDown(interactKey) &&
        !interactCooldown
      ) {
        nearInteractable = true;
        setInteractCooldown(true);
        this.scene.time.delayedCall(500, () => {
          setInteractCooldown(false);
        });
        this.handleInteractable(obj);
      }
    });
  }

  /**
   * Handle interaction with an object (sign, chest, bookshelf, door, or world object)
   */
  handleInteractable(obj) {
    const playerState = store.getState().player;
    const openedChests = playerState.openedChests || [];
    const readBooks = playerState.readBooks || [];

    if (obj.type === 'sign') {
      EventBus.emit(EVENTS.SIGN_SHOW, {
        arabic: obj.textArabic,
        english: obj.textEnglish,
      });
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    } else if (obj.type === 'bookshelf') {
      if (!readBooks.includes(obj.id)) {
        EventBus.emit(EVENTS.BOOKSHELF_INTERACT, {
          category: obj.category,
          id: obj.id,
        });
        EventBus.emit(EVENTS.PLAYER_FREEZE);
      } else {
        EventBus.emit(EVENTS.BOOKSHELF_INTERACT, {
          category: obj.category,
          id: obj.id,
          reread: true,
        });
        EventBus.emit(EVENTS.PLAYER_FREEZE);
      }
    } else if (obj.type === 'chest') {
      if (!openedChests.includes(obj.id)) {
        const amount = Math.floor(
          Math.random() * (obj.maxDirhams - obj.minDirhams + 1)
        ) + obj.minDirhams;
        EventBus.emit(EVENTS.CHEST_OPENED, { amount, id: obj.id });
        // Visual feedback: tint the chest to show it's opened
        if (obj.sprite) obj.sprite.setTint(0x666666);
      } else {
        EventBus.emit(EVENTS.CHEST_EMPTY, { id: obj.id });
      }
    } else if (obj.type === 'door') {
      let isLocked = obj.locked;
      if (isLocked && obj.unlockFlag) {
        const state = store.getState();
        const flagValue = state.narrative?.storyFlags?.[obj.unlockFlag];
        if (flagValue) {
          isLocked = false;
          obj.locked = false;
          if (obj.sprite) obj.sprite.clearTint();
        }
      }
      if (isLocked) {
        EventBus.emit(EVENTS.DOOR_LOCKED, {
          message: obj.lockMessage || 'This door is locked.',
          id: obj.id,
        });
      } else if (obj.interiorId) {
        const player = this.scene.playerController?.getPlayer();
        EventBus.emit(EVENTS.DOOR_OPENED, {
          id: obj.id,
          interiorId: obj.interiorId,
          entryPosition: player ? { x: player.x, y: player.y } : null,
        });
      } else {
        EventBus.emit(EVENTS.DOOR_OPENED, { id: obj.id });
      }
    } else if (WORLD_OBJECT_TYPES.has(obj.type)) {
      this.handleWorldObject(obj);
    }
  }

  /**
   * Handle interaction with a world object (fountain, statue, painting, etc.)
   * Uses unified OBJECT_INTERACT event with behavior composition.
   */
  handleWorldObject(obj) {
    const worldObjectStates = store.getState().narrative?.worldObjectStates || {};
    const objectState = worldObjectStates[obj.id];
    const repeatable = obj.repeatable === true || (obj.repeatable !== false && !ONE_TIME_TYPES.has(obj.type));

    // Already used and non-repeatable — show "already inspected" notification
    if (!repeatable && objectState === 'used') {
      EventBus.emit(EVENTS.SFX_CLICK);
      return;
    }

    // Determine the state change to dispatch (respect config, default to 'used')
    const stateChange = (!repeatable) ? (obj.stateChange || 'used') : null;

    // Emit unified OBJECT_INTERACT event with full payload
    EventBus.emit(EVENTS.OBJECT_INTERACT, {
      id: obj.id,
      type: obj.type,
      labelArabic: obj.labelArabic || null,
      labelEnglish: obj.labelEnglish || null,
      descriptionArabic: obj.descriptionArabic || null,
      descriptionEnglish: obj.descriptionEnglish || null,
      culturalNote: obj.culturalNote || null,
      vocabWordId: obj.vocabWordId || null,
      vocabCategory: obj.vocabCategory || null,
      loot: obj.loot || null,
      stateChange,
      repeatable,
      // ENVR-01: Inscription-specific fields (rootFamily, rootWords, ink routing)
      rootFamily: obj.rootFamily || null,
      rootFamilyEnglish: obj.rootFamilyEnglish || null,
      rootWords: obj.rootWords || null,
      useInk: obj.useInk || false,
      inkFile: obj.inkFile || null,
    });
    EventBus.emit(EVENTS.PLAYER_FREEZE);

    // Visual feedback for one-time objects: tint after interaction
    if (!repeatable && obj.sprite) {
      obj.sprite.setTint(0x666666);
    }
  }

  /**
   * Destroy all interactables
   */
  destroy() {
    this.doorTweens.forEach((t) => { if (t) t.remove(); });
    this.doorTweens = [];

    this.objectTweens.forEach((t) => { if (t) t.remove(); });
    this.objectTweens = [];

    this.interactables.forEach((obj) => {
      if (obj.sprite) obj.sprite.destroy();
      if (obj.label) obj.label.destroy();
      if (obj.hintText) obj.hintText.destroy();
    });
    this.interactables = [];
  }
}
