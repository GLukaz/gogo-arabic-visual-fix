import Phaser from 'phaser';
import { NPC } from '../sprites/NPC.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { store } from '../../store/store.js';
import { selectNpcQuestMarkers } from '../../store/slices/questSlice.js';
import { shouldSpawnNpc, evaluateSchedule } from './ScheduleEvaluator.js';
import { selectGameTime } from '../../store/slices/timeSlice.js';
import npcsEnriched from '../../data/npcsEnriched.js';
import { evaluateActionSets, executeActions } from './ActionSetExecutor.js';
import { buildActionContext } from './actionContext.js';

// NPC proximity threshold: 2 tiles = 128px
const INTERACT_RANGE = 64 * 2;

// O(1) lookup map for full NPC data (includes schedule arrays)
const NPC_DATA_MAP = new Map(npcsEnriched.map((n) => [n.id, n]));

/**
 * NPCManager
 * Handles NPC spawning, interaction detection, and dialogue triggering
 */
export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];

    // Listen for time phase changes to re-evaluate NPC schedules
    EventBus.on(EVENTS.TIME_PHASE_CHANGED, this._onPhaseChanged, this);
  }

  /**
   * Spawn NPCs from zone config
   * NPCs with a schedule are only spawned if their schedule matches the
   * current zone and hour. NPCs without a schedule always spawn.
   */
  create(npcConfigs, playerSprite, _wallGroup, _domOverlay) {
    this.npcs = [];

    // Read current game time and story flags for schedule evaluation
    const { hour } = selectGameTime(store.getState());
    const currentZone = this.scene.currentZone || '';
    const flags = store.getState().narrative?.storyFlags || {};

    npcConfigs.forEach((cfg) => {
      // Schedule filtering: skip NPCs whose schedule doesn't match
      const fullNpcData = NPC_DATA_MAP.get(cfg.id);
      if (fullNpcData && !shouldSpawnNpc(fullNpcData, hour, currentZone, flags)) {
        return; // Not in this zone at this time — skip
      }

      // Visibility flag filtering: skip story-gated NPCs whose flag doesn't match (Phase 34)
      if (fullNpcData?.visibilityFlag) {
        const flagValue = !!flags[fullNpcData.visibilityFlag];
        if (flagValue !== fullNpcData.showWhenTrue) return; // Story gate not yet passed — skip
      }

      const npcX = cfg.x * 64 + 32;
      const npcY = cfg.y * 64 + 32;

      const npc = new NPC(this.scene, npcX, npcY, {
        id: cfg.id,
        key: cfg.key,
        name: cfg.name,
        nameArabic: cfg.nameArabic,
      });

      // Store active schedule entry on sprite for use by movement system
      if (fullNpcData?.schedule?.length) {
        npc._scheduleEntry = evaluateSchedule(fullNpcData, hour, currentZone, flags);
      }

      // Initialize movement behavior from schedule entry (Phase 33)
      if (npc._scheduleEntry) {
        const behavior = npc._scheduleEntry.behavior;
        if (behavior === 'wander') {
          npc.startWander(96); // 1.5-tile radius
        } else if (behavior === 'patrol' && npc._scheduleEntry.patrol) {
          npc.startPatrol(
            npc._scheduleEntry.patrol.path,
            npc._scheduleEntry.patrol.durations
          );
        }
        // 'static' = do nothing (default behavior)
      }

      this.npcs.push(npc);
      this.scene.physics.add.collider(playerSprite, npc);

      // DOM NPC label removed — Arabic + English name labels now rendered as Phaser text sprites on NPC (Phase 42)
      // domOverlay.createNpcLabel() call removed — NPC.arabicNameLabel via createArabicText() replaces it
      // DOM interaction prompt removed — now handled by Phaser NPC sprite (Phase 42)
    });
  }

  /**
   * Update NPC interaction zones (called every frame)
   * Checks proximity and handles SPACE key for interaction
   */
  update(playerSprite, domOverlay, interactKey, interactCooldown, setInteractCooldown) {
    // Read quest marker state from Redux (Phaser can't use React hooks)
    const markers = selectNpcQuestMarkers(store.getState());
    const onboardingTargetNpc = store.getState().player.onboardingTargetNpc;

    this.npcs.forEach((npc) => {
      const dist = Phaser.Math.Distance.Between(
        playerSprite.x,
        playerSprite.y,
        npc.x,
        npc.y
      );

      const inRange = dist < INTERACT_RANGE;

      // Show/hide the Phaser-rendered hint text on the NPC sprite
      npc.setInteractionHint(inRange);

      // Update quest marker (!, ?, or hidden)
      const marker = markers[npc.npcId] || null;
      npc.setQuestMarker(marker);

      // Update onboarding highlight
      npc.setOnboardingHighlight(!!onboardingTargetNpc && npc.npcId === onboardingTargetNpc);

      // Update DOM overlay label position to track NPC world position
      // (DOM interaction prompt removed in Phase 42 — handled by Phaser NPC sprite)
      domOverlay.updatePosition(
        `npc-label-${npc.npcId}`,
        npc.x,
        npc.y
      );

      // Tick NPC update (wander target arrival check)
      npc.update();

      // Handle SPACE key press for interaction
      if (
        inRange &&
        Phaser.Input.Keyboard.JustDown(interactKey) &&
        !interactCooldown
      ) {
        setInteractCooldown(true);
        this.scene.time.delayedCall(500, () => {
          setInteractCooldown(false);
        });

        // Face player: flip sprite based on relative position (Phase 33)
        npc.setFlipX(playerSprite.x > npc.x);

        // Stop movement so NPC stands still during dialogue (Phase 33)
        npc.stopMovement();

        // ActionSet evaluation: data-driven NPC behavior (Phase 34)
        // Emit matched actions alongside normal dialogue. ACTION_* consumers
        // are not wired yet, so we do NOT skip the default NPC_INTERACT.
        const fullData = NPC_DATA_MAP.get(npc.npcId);
        if (fullData?.actionSets?.interact) {
          const context = buildActionContext();
          const matched = evaluateActionSets(fullData.actionSets.interact, context);
          if (matched) {
            executeActions(matched.actions, EventBus);
            // Fall through to normal NPC_INTERACT below
          }
        }

        // Fallback: no actionSets or no matched set — emit classic NPC_INTERACT
        EventBus.emit(EVENTS.NPC_INTERACT, {
          npcId: npc.npcId,
          npcName: npc.npcName,
        });
        EventBus.emit(EVENTS.PLAYER_FREEZE);
      }
    });
  }

  /**
   * Trigger interaction with a specific NPC without requiring SPACE press.
   * Used by useTutorialTrigger for auto-greeting Guide Amira.
   */
  autoInteract(npcId) {
    const npc = this.npcs.find((n) => n.npcId === npcId);
    if (!npc) return;

    EventBus.emit(EVENTS.NPC_INTERACT, {
      npcId: npc.npcId,
      npcName: npc.npcName,
      autoTriggered: true,
    });
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }

  /**
   * Get NPCs for Y-sorting
   */
  getNPCs() {
    return this.npcs;
  }

  /**
   * Re-evaluate all spawned NPCs' schedules when time phase changes.
   * NPCs whose schedule no longer matches the current time are hidden.
   * NPCs whose schedule location changed are tweened to the new position.
   * Called by EventBus TIME_PHASE_CHANGED listener.
   */
  _onPhaseChanged({ phase: _phase }) {
    // Guard: NPCs haven't been spawned yet — skip initial fire on load
    if (!this.npcs || !this.npcs.length) return;

    const { hour } = selectGameTime(store.getState());
    const flags = store.getState().narrative?.storyFlags || {};
    const currentZone = this.scene.currentZone || '';

    this.npcs.forEach((npc) => {
      const fullData = NPC_DATA_MAP.get(npc.npcId);
      if (!fullData?.schedule?.length) return; // No schedule = always active, skip

      const entry = evaluateSchedule(fullData, hour, currentZone, flags);

      if (!entry) {
        // NPC should not be visible in this zone at this time
        npc.stopMovement();
        npc.setActive(false).setVisible(false);
        if (npc.body) npc.body.enable = false;
      } else {
        // NPC should be visible — show and move to schedule location
        npc.setActive(true).setVisible(true);
        if (npc.body) npc.body.enable = true;

        // Calculate new position from schedule entry tile coords
        const tileSize = 64;
        const newX = entry.location.x * tileSize + tileSize / 2;
        const newY = entry.location.y * tileSize + tileSize / 2;

        // Tween to new position (smooth 2s transition, not teleport)
        npc.stopMovement();
        this.scene.tweens.add({
          targets: npc,
          x: newX,
          y: newY,
          duration: 2000,
          ease: 'Linear',
          onComplete: () => {
            // Start new behavior from updated schedule entry
            npc._scheduleEntry = entry;
            if (entry.behavior === 'wander') {
              npc._spawnX = newX;
              npc._spawnY = newY;
              npc.startWander(96);
            } else if (entry.behavior === 'patrol' && entry.patrol) {
              npc.startPatrol(entry.patrol.path, entry.patrol.durations);
            } else {
              // Static — restore immovable
              npc.setImmovable(true);
              npc.setVelocity(0, 0);
            }
          },
        });
      }
    });
  }

  /**
   * Destroy all NPCs
   */
  destroy() {
    EventBus.off(EVENTS.TIME_PHASE_CHANGED, this._onPhaseChanged, this);
    this.npcs.forEach((npc) => {
      npc.destroy();
    });
    this.npcs = [];
  }
}
