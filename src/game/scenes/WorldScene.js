import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import DOMOverlayManager from '../systems/DOMOverlay.js';
import ZoneTransition from '../systems/ZoneTransition.js';
import { PlayerController } from '../systems/PlayerController.js';
import { NPCManager } from '../systems/NPCManager.js';
import { InteractableManager } from '../systems/InteractableManager.js';
import { MapLoader } from '../systems/MapLoader.js';
import { TiledMapLoader } from '../systems/TiledMapLoader.js';
import ScreenShake from '../systems/ScreenShake.js';
import ParticleEffectManager from '../systems/ParticleEffectManager.js';
import { SceneStackManager } from '../systems/SceneStackManager.js';
import { DialogueEngine } from '../systems/DialogueEngine.js';
import { EquipmentManager } from '../systems/equipment/EquipmentManager.js';
import { CompanionManager } from '../systems/companions/CompanionManager.js';
import { store } from '../../store/store.js';
import { GatheringSpotManager } from '../systems/GatheringSpotManager.js';
import { ZONES, TILE } from '../../data/zones.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { WeatherSystem } from '../systems/WeatherSystem.js';
import { DayNightCycle } from '../systems/DayNightCycle.js';
import { WorldStateManager } from '../systems/WorldStateManager.js';
import { PuzzleManager } from '../systems/PuzzleManager.js';
import { FastTravelManager } from '../systems/FastTravelManager.js';
import { MountSystem } from '../systems/MountSystem.js';
import { AutoSave } from '../systems/AutoSave.js';
import { GameplayStats } from '../systems/GameplayStats.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { CinematicIntroSequencer } from '../systems/CinematicIntroSequencer.js';
import { StepTriggerSystem } from '../systems/StepTriggerSystem.js';
import { ExitTriggerChecker } from '../systems/ExitTriggerChecker.js';
import { ZoneToast } from '../systems/ZoneToast.js';
import { FloatingArabicLabelManager } from '../systems/FloatingArabicLabelManager.js';
import { ObjectPlacerEditor } from '../systems/ObjectPlacerEditor.js';


// ============================================================
// WORLD SCENE — Main scene orchestrator, delegates to subsystems
// ============================================================
export class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
    this.frozen = false;
    this.interactCooldown = false;
    this.currentZone = 'oasis_village';
    this.currentMapW = 40;
    this.currentMapH = 30;
    this.pendingSpawnPosition = null;

    // Subsystems (initialized in create())
    this.domOverlay = null;
    this.zoneTransition = null;
    this.playerController = null;
    this.npcManager = null;
    this.interactableManager = null;
    this.mapLoader = null;
    this.tiledMapLoader = null;
    this.usingTiledMap = false;
    this.screenShake = null;
    this.particleEffects = null;
    this.sceneStackManager = null;
    this.dialogueEngine = null;
    this.equipmentManager = null;
    this.companionManager = null;
    this.gatheringSpotManager = null;
    this.timeSystem = null;
    this.weatherSystem = null;
    this.dayNightCycle = null;
    this.dialogueBox = null;
    this.introSequencer = null;
    this.stepTriggerSystem = null;
    this.floatingLabelManager = null;

    this._suppressZoneToast = true;
    this.interactKey = null;
  }

  // ============================================================
  // LIFECYCLE
  // ============================================================

  create() {
    this.frozen = false;
    this.interactCooldown = false;

    // Initialize subsystems
    this.domOverlay = new DOMOverlayManager(this);
    this.domOverlay.init();
    this.zoneTransition = new ZoneTransition(this);
    this.playerController = new PlayerController(this);
    this.npcManager = new NPCManager(this);
    this.interactableManager = new InteractableManager(this);
    this.mapLoader = new MapLoader(this);
    this.tiledMapLoader = new TiledMapLoader(this);
    this.screenShake = new ScreenShake(this);
    this.particleEffects = new ParticleEffectManager(this);
    this.timeSystem = new TimeSystem(this);
    this.weatherSystem = new WeatherSystem(this);
    this.dayNightCycle = new DayNightCycle(this);
    this.worldStateManager = new WorldStateManager(this);
    this.puzzleManager = new PuzzleManager(this);
    this.fastTravelManager = new FastTravelManager(this);
    this.mountSystem = new MountSystem(this);
    this.sceneStackManager = new SceneStackManager(this);
    this.dialogueEngine = new DialogueEngine(this);
    this.stepTriggerSystem = new StepTriggerSystem(this);

    // Sync time phase → world state flags
    const updateTimeFlags = (phase) => {
      if (!this.worldStateManager) return;
      this.worldStateManager.setFlag('time_phase', phase);
      this.worldStateManager.setFlag('is_night', phase === 'night');
    };
    EventBus.on(EVENTS.TIME_PHASE_CHANGED, updateTimeFlags);
    updateTimeFlags(this.timeSystem.lastPhase || 'day');
    this.events.once('shutdown', () => {
      EventBus.off(EVENTS.TIME_PHASE_CHANGED, updateTimeFlags);
    });

    // Companion system (must be after PlayerController)
    this.companionManager = new CompanionManager(this);

    // Load the default zone
    const zone = ZONES.oasis_village;
    this.buildZone('oasis_village', zone.spawnPoint.x * TILE, zone.spawnPoint.y * TILE);

    // AutoSave + GameplayStats
    this.autoSave = new AutoSave();
    this.autoSave.start();
    this.gameplayStats = new GameplayStats();
    this.gameplayStats.start();

    // Camera
    this.playerController.setupCamera(this.currentMapW * TILE, this.currentMapH * TILE);

    // EventBus listeners
    EventBus.on(EVENTS.PLAYER_FREEZE, this.handleFreeze, this);
    EventBus.on(EVENTS.PLAYER_UNFREEZE, this.handleUnfreeze, this);
    EventBus.on(EVENTS.VFX_SHAKE, this.handleVfxShake, this);
    EventBus.on(EVENTS.VFX_PARTICLES_BURST, this.handleVfxBurst, this);
    EventBus.on(EVENTS.VFX_PARTICLES_CONTINUOUS, this.handleVfxContinuous, this);
    EventBus.on(EVENTS.DOOR_OPENED, this.handleDoorOpened, this);

    // Input
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.on('keydown-M', () => {
      if (this.mountSystem && !this.frozen) this.mountSystem.mount('camel');
    });

    // Restore player position when resuming from InteriorScene
    this.events.off('resume');
    this.events.on('resume', () => {
      if (this.pendingSpawnPosition) {
        const player = this.playerController.getPlayer();
        if (player) player.setPosition(this.pendingSpawnPosition.x, this.pendingSpawnPosition.y);
        this.pendingSpawnPosition = null;
      }
    });

    // Phaser in-canvas DialogueBox
    this.dialogueBox = new DialogueBox(this);
    EventBus.on(EVENTS.NPC_SIMPLE_DIALOGUE, this._handleSimpleDialogue, this);

    EventBus.emit(EVENTS.SCENE_READY, this);

    if (ObjectPlacerEditor.isEnabled()) {
      this.objectPlacerEditor = new ObjectPlacerEditor(this);
      this.objectPlacerEditor.enable();
    }

    // Cinematic intro for new players
    const playerState = store.getState().player;
    if (!playerState.onboardingComplete && playerState.tutorialPhase === 'cinematic_intro') {
      this.introSequencer = new CinematicIntroSequencer(this);
      this.introSequencer.run();
    }
  }

  update(time, delta) {
    // Handle DialogueBox input even while frozen
    if (this.dialogueBox && this.dialogueBox.isVisible) {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('SPACE')) ||
          Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ENTER'))) {
        this.dialogueBox.advance();
        return;
      }
    }

    if (this.frozen) {
      if (this.domOverlay) this.domOverlay.update();
      return;
    }

    // Update player and equipment
    this.playerController.update();
    if (this.equipmentManager) this.equipmentManager.update();
    if (this.companionManager) this.companionManager.update(this.time.now, this.game.loop.delta);

    // Y-sort all sprites for depth ordering
    const player = this.playerController.getPlayer();
    const npcs = this.npcManager.getNPCs();
    [player, ...npcs].filter(Boolean).forEach((s) => s.setDepth(s.body?.bottom ?? s.y));

    // Throttled player position for HUD compass (~10Hz at 60fps)
    this._frameCount = (this._frameCount || 0) + 1;
    if (this._frameCount % 6 === 0 && player) {
      EventBus.emit(EVENTS.PLAYER_POSITION_UPDATE, { x: player.x, y: player.y });
    }

    // Interaction checks
    this.npcManager.update(player, this.domOverlay, this.interactKey, this.interactCooldown, this.setInteractCooldown.bind(this));
    this.interactableManager.update(player, this.interactKey, this.interactCooldown, this.setInteractCooldown.bind(this));
    if (this.gatheringSpotManager) {
      this.gatheringSpotManager.update(player, this.interactKey, this.interactCooldown, this.setInteractCooldown.bind(this));
    }

    // Trigger systems
    this.stepTriggerSystem.update(player, this.currentZone);
    ExitTriggerChecker.check({
      player,
      transitioning: this.zoneTransition.transitioning,
      usingTiledMap: this.usingTiledMap,
      tiledExitTriggers: this.currentTiledExitTriggers,
      mapLoader: this.mapLoader,
      mapW: this.currentMapW,
      mapH: this.currentMapH,
    });

    // IMM-03: Update floating Arabic labels (FSRS-based visibility)
    if (this.floatingLabelManager) this.floatingLabelManager.update(time);

    // DOM overlays, time, weather
    if (this.domOverlay) this.domOverlay.update();
    if (this.timeSystem) this.timeSystem.update(time, delta);
    if (this.weatherSystem) this.weatherSystem.update(time, delta);

    // Fast travel unlock check
    if (this.fastTravelManager && typeof this.fastTravelManager.checkCurrentLocation === 'function') {
      const p = this.playerController.getPlayer();
      if (p) this.fastTravelManager.checkCurrentLocation(p.x, p.y, this.currentZone);
    }
  }

  shutdown() {
    EventBus.emit(EVENTS.SCENE_SHUTDOWN);
    if (this.introSequencer) { this.introSequencer.cleanup(); this.introSequencer = null; }
    if (this.dialogueBox) { this.dialogueBox.destroy(); this.dialogueBox = null; }
    EventBus.off(EVENTS.NPC_SIMPLE_DIALOGUE, this._handleSimpleDialogue, this);

    if (this.autoSave) { this.autoSave.stop(); this.autoSave = null; }
    if (this.gameplayStats) { this.gameplayStats.stop(); this.gameplayStats = null; }
    if (this.companionManager) { this.companionManager.destroy(); this.companionManager = null; }
    if (this.equipmentManager) { this.equipmentManager.destroy(); this.equipmentManager = null; }
    if (this.gatheringSpotManager) { this.gatheringSpotManager.destroy(); this.gatheringSpotManager = null; }
    if (this.dialogueEngine) { this.dialogueEngine.destroy(); this.dialogueEngine = null; }
    if (this.sceneStackManager) { this.sceneStackManager.destroy(); this.sceneStackManager = null; }
    if (this.worldStateManager) { this.worldStateManager.destroy(); this.worldStateManager = null; }
    if (this.puzzleManager) { if (this.puzzleManager.destroy) this.puzzleManager.destroy(); this.puzzleManager = null; }
    if (this.fastTravelManager) { if (this.fastTravelManager.destroy) this.fastTravelManager.destroy(); this.fastTravelManager = null; }

    if (this.zoneTransition) this.zoneTransition.transitioning = false;
    this.events.off('resume');

    EventBus.off(EVENTS.PLAYER_FREEZE, this.handleFreeze, this);
    EventBus.off(EVENTS.PLAYER_UNFREEZE, this.handleUnfreeze, this);
    EventBus.off(EVENTS.VFX_SHAKE, this.handleVfxShake, this);
    EventBus.off(EVENTS.VFX_PARTICLES_BURST, this.handleVfxBurst, this);
    EventBus.off(EVENTS.VFX_PARTICLES_CONTINUOUS, this.handleVfxContinuous, this);
    EventBus.off(EVENTS.DOOR_OPENED, this.handleDoorOpened, this);

    if (this.objectPlacerEditor) { this.objectPlacerEditor.disable(); this.objectPlacerEditor = null; }
    if (this.particleEffects) { this.particleEffects.destroy(); this.particleEffects = null; }
    if (this.domOverlay) { this.domOverlay.destroy(); this.domOverlay = null; }
    if (this.timeSystem) { this.timeSystem.destroy(); this.timeSystem = null; }
    if (this.weatherSystem) { this.weatherSystem.destroy(); this.weatherSystem = null; }
    if (this.dayNightCycle) { this.dayNightCycle.destroy(); this.dayNightCycle = null; }
    if (this.mountSystem) { this.mountSystem.destroy(); this.mountSystem = null; }
  }

  // ============================================================
  // ZONE LOADING
  // ============================================================

  loadZone(zoneName, entryX, entryY) {
    if (!this.scene || !this.scene.isActive()) return;
    this.clearZone();
    this.buildZone(zoneName, entryX, entryY);
    this.playerController.setupCamera(this.currentMapW * TILE, this.currentMapH * TILE);
  }

  clearZone() {
    if (this.dialogueBox) { this.dialogueBox.destroy(); this.dialogueBox = new DialogueBox(this); }
    if (this.domOverlay) { this.domOverlay.destroy(); this.domOverlay = new DOMOverlayManager(this); this.domOverlay.init(); }
    if (this.equipmentManager) { this.equipmentManager.destroy(); this.equipmentManager = null; }
    if (this.gatheringSpotManager) { this.gatheringSpotManager.destroy(); this.gatheringSpotManager = null; }

    if (this.usingTiledMap) { this.tiledMapLoader.destroy(); } else { this.mapLoader.destroy(); }
    this.usingTiledMap = false;
    if (this.floatingLabelManager) { this.floatingLabelManager.destroy(); this.floatingLabelManager = null; }
    if (this.npcManager) this.npcManager.destroy();
    if (this.interactableManager) this.interactableManager.destroy();
    if (this.playerController) this.playerController.destroy();
  }

  buildZone(zoneName, spawnX, spawnY) {
    this.currentZone = zoneName;
    const zone = ZONES[zoneName];
    if (!zone) { console.error(`Unknown zone: ${zoneName}`); return; }

    this.currentMapW = zone.mapWidth;
    this.currentMapH = zone.mapHeight;

    // Load trigger systems for this zone
    this.stepTriggerSystem.load(zone);

    // Build map — prefer Tiled JSON if available
    let wallGroup;
    let objectSprites = [];

    if (this.tiledMapLoader.hasMap(zoneName)) {
      this.usingTiledMap = true;
      const mapKey = this.tiledMapLoader.zoneIdToMapKey(zoneName);
      const result = this.tiledMapLoader.load(mapKey);
      this.currentTiledMap = result.map;
      this.currentTiledLayers = result.layers;
      this.currentTiledExitTriggers = result.exitTriggers;
      wallGroup = result.wallGroup;
      const worldSize = this.tiledMapLoader.getWorldSize();
      this.currentMapW = worldSize.width / TILE;
      this.currentMapH = worldSize.height / TILE;
    } else {
      this.usingTiledMap = false;
      wallGroup = this.mapLoader.create(zone, zone.mapWidth, zone.mapHeight);
      objectSprites = this.mapLoader.getObjectSprites();
    }

    // Spawn player, equipment, NPCs, interactables
    const player = this.playerController.create(spawnX, spawnY, wallGroup);
    this.equipmentManager = new EquipmentManager(this, player);
    this.npcManager.create(zone.npcs, player, wallGroup, this.domOverlay);
    this.interactableManager.create(zone.interactables, objectSprites);

    // IMM-03: Floating Arabic labels above world objects
    this.floatingLabelManager = new FloatingArabicLabelManager(this);
    this.floatingLabelManager.create(zoneName, this.interactableManager);

    if (zone.gatheringSpots) {
      this.gatheringSpotManager = new GatheringSpotManager(this);
      this.gatheringSpotManager.create(zoneName);
    }

    // Zone name toast (suppressed on first load)
    if (!this._suppressZoneToast) ZoneToast.show(this, zoneName, zone);
    this._suppressZoneToast = false;

    if (this.objectPlacerEditor) this.objectPlacerEditor.onZoneChanged();
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  _handleSimpleDialogue(data) {
    if (this.dialogueBox && data.npcName && data.messages) {
      this.dialogueBox.show(data.npcName, data.messages, data.onComplete);
    }
  }

  handleFreeze() {
    try {
      if (!this.scene?.isActive?.()) return;
      if (!this.playerController) return;
      this.frozen = true;
      this.playerController.freeze();
    } catch (e) {
      // Scene was destroyed or not ready, silently ignore
    }
  }

  handleUnfreeze() {
    try {
      if (!this.scene?.isActive?.()) return;
      if (!this.playerController) return;
      this.frozen = false;
      this.playerController.unfreeze();
    } catch (e) {
      // Scene was destroyed or not ready, silently ignore
    }
  }

  setInteractCooldown(value) { this.interactCooldown = value; }

  handleVfxShake({ intensity }) { if (this.screenShake) this.screenShake.shake(intensity); }

  handleVfxBurst({ x, y, config } = {}) {
    if (!this.particleEffects) return;
    this.particleEffects.burst(x ?? this.cameras.main.midPoint.x, y ?? this.cameras.main.midPoint.y, config || {});
  }

  handleVfxContinuous({ x, y, config } = {}) {
    if (!this.particleEffects) return;
    this.particleEffects.continuous(x ?? this.cameras.main.midPoint.x, y ?? this.cameras.main.midPoint.y, config || {});
  }

  async handleDoorOpened({ id: _id, interiorId, entryPosition }) {
    if (!interiorId) return;
    try {
      const { audioManager } = await import('../../services/audio.js');
      const { INTERIOR_BGM } = await import('../../data/audioConfig.js');
      audioManager.playBGM(INTERIOR_BGM[interiorId] || INTERIOR_BGM.default || 'interior');
    } catch {
      // Audio not critical
    }
    this.sceneStackManager.pushScene('InteriorScene', { interiorId, entryPosition });
    EventBus.emit(EVENTS.BUILDING_ENTERED, { interiorId });
  }

  handleFastTravel({ zoneName }) {
    if (this.fastTravelManager) {
      this.fastTravelManager.travelTo(zoneName);
    } else {
      this.loadZone(zoneName);
    }
  }
}
