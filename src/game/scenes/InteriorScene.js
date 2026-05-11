import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import DOMOverlayManager from '../systems/DOMOverlay.js';
import { PlayerController } from '../systems/PlayerController.js';
import { NPCManager } from '../systems/NPCManager.js';
import { InteractableManager } from '../systems/InteractableManager.js';
import { MapLoader } from '../systems/MapLoader.js';
import { store } from '../../store/store.js';
import { markBuildingVisited } from '../../store/slices/narrativeSlice.js';
import { INTERIORS } from '../../data/interiors.js';
import { TILE } from '../../data/zones.js';

const INTERACT_RANGE = TILE * 2;

export class InteriorScene extends Phaser.Scene {
  constructor() {
    super('InteriorScene');
    this.frozen = false;
    this.interactCooldown = false;
    this._exiting = false;

    // Data from init()
    this.returnSceneKey = null;
    this.interiorId = null;
    this.entryPosition = null;

    // Subsystems (same as WorldScene)
    this.domOverlay = null;
    this.playerController = null;
    this.npcManager = null;
    this.interactableManager = null;
    this.mapLoader = null;

    // Map dimensions (PlayerController reads these)
    this.currentMapW = 10;
    this.currentMapH = 8;

    // Input
    this.interactKey = null;
  }

  init(data) {
    this.returnSceneKey = data.returnSceneKey;
    this.interiorId = data.interiorId;
    this.entryPosition = data.entryPosition;
    this._exiting = false;
    // Reset state flags (Phaser reuses scene instances)
    this.frozen = false;
    this.interactCooldown = false;
  }

  create() {
    const interior = INTERIORS[this.interiorId];
    if (!interior) {
      console.error(`[InteriorScene] Unknown interior: ${this.interiorId}`);
      // Pop back to WorldScene
      const worldScene = this.scene.get(this.returnSceneKey);
      if (worldScene?.sceneStackManager) {
        worldScene.sceneStackManager.popScene();
      }
      return;
    }

    this.currentMapW = interior.mapWidth;
    this.currentMapH = interior.mapHeight;

    // Initialize subsystems (same order as WorldScene)
    this.domOverlay = new DOMOverlayManager(this);
    this.domOverlay.init();
    this.playerController = new PlayerController(this);
    this.npcManager = new NPCManager(this);
    this.interactableManager = new InteractableManager(this);
    this.mapLoader = new MapLoader(this);

    // Build map
    const wallGroup = this.mapLoader.create(interior, interior.mapWidth, interior.mapHeight);

    // Spawn player at interior spawn point
    const player = this.playerController.create(
      interior.spawnPoint.x * TILE,
      interior.spawnPoint.y * TILE,
      wallGroup
    );

    // Spawn NPCs
    this.npcManager.create(interior.npcs || [], player, wallGroup, this.domOverlay);

    // Spawn interactables
    this.interactableManager.create(interior.interactables || [], this.mapLoader.getObjectSprites());

    // Camera
    this.playerController.setupCamera(interior.mapWidth * TILE, interior.mapHeight * TILE);

    // Input
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // EventBus listeners
    EventBus.on(EVENTS.PLAYER_FREEZE, this.handleFreeze, this);
    EventBus.on(EVENTS.PLAYER_UNFREEZE, this.handleUnfreeze, this);

    // Track building visit
    store.dispatch(markBuildingVisited(this.interiorId));
  }

  update() {
    if (this._exiting) return;

    if (this.frozen) {
      if (this.domOverlay) this.domOverlay.update();
      return;
    }

    // Update player movement
    this.playerController.update();

    // Y-sort sprites
    const player = this.playerController.getPlayer();
    const npcs = this.npcManager.getNPCs();
    const allSprites = [player, ...npcs].filter(Boolean);
    allSprites.forEach((s) => s.setDepth(s.y));

    // EXIT CHECK FIRST — before NPC/interactable to prevent conflicts
    this.checkExitDoor();
    if (this._exiting) return;

    // Check NPC interaction
    this.npcManager.update(
      player,
      this.domOverlay,
      this.interactKey,
      this.interactCooldown,
      this.setInteractCooldown.bind(this)
    );

    // Check interactable objects
    this.interactableManager.update(
      player,
      this.interactKey,
      this.interactCooldown,
      this.setInteractCooldown.bind(this)
    );

    // Update DOM overlays
    if (this.domOverlay) this.domOverlay.update();
  }

  checkExitDoor() {
    const player = this.playerController.getPlayer();
    if (!player) return;

    const exitDoor = this.interactableManager.interactables.find(
      (obj) => obj.isExit
    );
    if (!exitDoor) return;

    const dist = Phaser.Math.Distance.Between(
      player.x, player.y,
      exitDoor.worldX, exitDoor.worldY
    );

    if (
      dist < INTERACT_RANGE &&
      Phaser.Input.Keyboard.JustDown(this.interactKey) &&
      !this.interactCooldown
    ) {
      this.interactCooldown = true;
      this._exiting = true;
      this.time.delayedCall(500, () => { this.interactCooldown = false; });
      this.exitBuilding();
    }
  }

  async exitBuilding() {
    // Crossfade audio back to zone BGM
    try {
      const { audioManager } = await import('../../services/audio.js');
      const { ZONE_BGM_MAP } = await import('../../data/audioConfig.js');
      const worldScene = this.scene.get(this.returnSceneKey);
      const zone = worldScene?.currentZone || 'oasis_village';
      audioManager.playBGM(ZONE_BGM_MAP[zone] || 'oasis');
    } catch {
      // Audio not critical
    }

    // Set pending spawn position on WorldScene
    const worldScene = this.scene.get(this.returnSceneKey);
    if (worldScene) {
      worldScene.pendingSpawnPosition = this.entryPosition;
      if (worldScene.sceneStackManager) {
        worldScene.sceneStackManager.popScene();
      }
    }

    EventBus.emit(EVENTS.BUILDING_EXITED);
  }

  handleFreeze() {
    if (!this.sys.isActive()) return;
    this.frozen = true;
    if (this.playerController && this.playerController.getPlayer()) {
      this.playerController.freeze();
    }
  }

  handleUnfreeze() {
    if (!this.sys.isActive()) return;
    this.frozen = false;
    if (this.playerController) {
      this.playerController.unfreeze();
    }
  }

  setInteractCooldown(value) {
    this.interactCooldown = value;
  }

  shutdown() {
    EventBus.off(EVENTS.PLAYER_FREEZE, this.handleFreeze, this);
    EventBus.off(EVENTS.PLAYER_UNFREEZE, this.handleUnfreeze, this);

    if (this.interactKey) {
      this.input.keyboard.removeKey(this.interactKey);
      this.interactKey = null;
    }

    if (this.playerController) { this.playerController.destroy(); this.playerController = null; }
    if (this.interactableManager) { this.interactableManager.destroy(); this.interactableManager = null; }
    if (this.npcManager) { this.npcManager.destroy(); this.npcManager = null; }
    if (this.mapLoader) { this.mapLoader.destroy(); this.mapLoader = null; }
    if (this.domOverlay) { this.domOverlay.destroy(); this.domOverlay = null; }
  }
}
