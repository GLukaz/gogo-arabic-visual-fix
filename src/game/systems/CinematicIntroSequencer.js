import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { createArabicText } from '../ui/ArabicText.js';
import { FloatingWordObject } from '../objects/FloatingWordObject.js';
import { store } from '../../store/store.js';
import { setTutorialPhase } from '../../store/slices/playerSlice.js';
import { setActiveQuest } from '../../store/slices/questSlice.js';

// ============================================================
// WORD DATA — first Arabic word the player encounters
// ============================================================

const FIRST_WORD = {
  wordId: 'q_0002',
  arabic: 'كِتَاب',
  english: 'book',
};

// Spawn position: near oasis pool, just north of player spawn (tile 14,17 = world 896, 1088)
const WORD_SPAWN_X = 14 * 64; // 896
const WORD_SPAWN_Y = 17 * 64; // 1088

/**
 * CinematicIntroSequencer — Phase 47 Plan 01
 *
 * Orchestrates the Phaser-native cinematic intro sequence for new players:
 *   Beat 1: Text crawl (INTRO-01) — 10 lines fade in sequentially
 *   Beat 2: Camera fade-in from black + dawn tint + pan to player spawn (INTRO-02)
 *   Beats 3-5: Wired in Plans 47-02 and 47-03 via the onPanComplete hook
 *
 * All rendering is inside Phaser (depth 9800) — no React DOM overlays.
 * Player is frozen for the entire sequence via EVENTS.PLAYER_FREEZE.
 */
export class CinematicIntroSequencer {
  /**
   * @param {Phaser.Scene} scene — The active WorldScene instance
   */
  constructor(scene) {
    this.scene = scene;

    // Crawl objects so we can destroy them on skip or fade-out
    this._crawlObjects = [];

    // All delayedCall timers, so skip can cancel pending ones individually
    this._timers = [];

    // Optional hook for Plan 47-02: called when camera pan completes
    // Assign: sequencer.onPanComplete = () => { ... }
    this.onPanComplete = null;

    // Optional hook for Plan 47-03: called after word is learned (DialogueBox dismissed)
    // Assign: sequencer.onWordLearned = () => { ... }
    this.onWordLearned = null;

    // Internal state
    this._glowTween = null;
    this._wordObject = null;
    this._active = true;

    // FloatingWordObject instance (Plan 47-02)
    this._floatingWord = null;

    // Bound scene 'update' listener for per-frame proximity check
    this._updateBound = null;
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  /**
   * Start the full cinematic sequence.
   * Call this once from WorldScene.create() when the new-player guard passes.
   */
  run() {
    // Freeze player immediately — must happen before any async operations
    EventBus.emit(EVENTS.PLAYER_FREEZE);

    // Fade in from black (camera starts black from Phaser default)
    // Phaser signature: fadeIn(duration, red, green, blue, force, callback)
    this.scene.cameras.main.fadeIn(1500, 0, 0, 0, false, (camera, progress) => {
      if (progress === 1) {
        this._applyDawnTint();
      }
    });

    // Register skip handlers — pointer click or SPACE skips the text crawl
    this._skipHandler = () => this._skipCrawl();
    this.scene.input.once('pointerdown', this._skipHandler);
    this.scene.input.keyboard.once('keydown-SPACE', this._skipHandler);
  }

  /**
   * Clean up all resources held by this sequencer.
   * Called by WorldScene.shutdown() to prevent leaks.
   */
  cleanup() {
    this._active = false;

    // Destroy any remaining crawl text objects
    this._crawlObjects.forEach((o) => o?.destroy());
    this._crawlObjects = [];

    // Cancel any pending delayedCall timers
    this._timers.forEach((t) => t?.remove(false));
    this._timers = [];

    // Destroy floating word if still present
    if (this._floatingWord) {
      this._floatingWord.destroy();
      this._floatingWord = null;
    }

    // Remove per-frame update listener if registered
    if (this._updateBound) {
      this.scene.events.off('update', this._updateBound);
      this._updateBound = null;
    }

    // Unfreeze player so the scene shuts down cleanly
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }

  // ============================================================
  // BEAT 1: DAWN TINT
  // ============================================================

  /**
   * Apply warm dawn tint (0xffdca8, alpha 0.3) to the DayNightCycle overlay.
   * Called at the end of the camera fade-in.
   */
  _applyDawnTint() {
    if (!this._active) return;

    const dnc = this.scene.dayNightCycle;
    if (dnc && dnc.overlay) {
      dnc.overlay.setFillStyle(0xffdca8);
      dnc.overlay.setAlpha(0.3);
    }

    this._startTextCrawl();
  }

  // ============================================================
  // BEAT 1: TEXT CRAWL
  // ============================================================

  /**
   * Render 10 lines of story text sequentially, fading each in 500ms apart.
   * Arabic lines use createArabicText() for correct glyph joining.
   * All text is at depth 9800, scroll-factor 0 (fixed to camera).
   */
  _startTextCrawl() {
    if (!this._active) return;

    const CRAWL_LINES = [
      { text: 'في زمنٍ بعيد...', arabic: true },
      { text: 'In a time long past...', arabic: false },
      { text: '', arabic: false },
      { text: 'A young scholar discovers an ancient manuscript', arabic: false },
      { text: 'hidden in the sands of a forgotten oasis.', arabic: false },
      { text: '', arabic: false },
      { text: 'العربية', arabic: true },
      { text: 'Arabic.', arabic: false },
      { text: '', arabic: false },
      { text: 'Your journey begins here.', arabic: false },
    ];

    const cam = this.scene.cameras.main;
    const centerX = cam.width / 2;
    const startY = cam.height * 0.25;

    CRAWL_LINES.forEach((line, index) => {
      const timer = this.scene.time.delayedCall(index * 500, () => {
        if (!this._active) return;

        // Empty separator lines: skip object creation, push null as placeholder
        if (line.text === '') {
          this._crawlObjects.push(null);
          return;
        }

        let textObj;

        if (line.arabic) {
          // Arabic lines: reshape + RTL via createArabicText
          textObj = createArabicText(
            this.scene,
            centerX,
            startY + index * 30,
            line.text,
            {
              fontSize: '18px',
              color: '#d4a843',
              fontFamily: "'Press Start 2P', monospace",
            }
          );
          textObj
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(9800)
            .setAlpha(0);
        } else {
          // English/Latin lines: plain Phaser text
          textObj = this.scene.add.text(
            centerX,
            startY + index * 30,
            line.text,
            {
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '12px',
              color: '#f4fefa',
              wordWrap: { width: cam.width * 0.7 },
            }
          );
          textObj
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(9800)
            .setAlpha(0);
        }

        // Fade in each line
        this.scene.tweens.add({
          targets: textObj,
          alpha: 1,
          duration: 600,
          ease: 'Power2',
        });

        this._crawlObjects.push(textObj);
      });

      this._timers.push(timer);
    });

    // After all lines are visible, hold for 1500ms then fade out
    // Total delay: last line appears at (length-1)*500 = 4500ms,
    // fades in over 600ms, then holds 1500ms = 6600ms total
    const fadeOutTimer = this.scene.time.delayedCall(
      CRAWL_LINES.length * 500 + 2100,
      () => {
        if (!this._active) return;
        this._fadeOutCrawl();
      }
    );
    this._timers.push(fadeOutTimer);
  }

  // ============================================================
  // BEAT 1: FADE OUT CRAWL
  // ============================================================

  /**
   * Fade all crawl text objects out over 800ms, then destroy them
   * and start the camera pan.
   */
  _fadeOutCrawl() {
    if (!this._active) return;

    // Filter to non-null objects only
    const targets = this._crawlObjects.filter(Boolean);

    if (targets.length === 0) {
      // No objects to tween — go straight to pan
      this._crawlObjects = [];
      this._startCameraPan();
      return;
    }

    this.scene.tweens.add({
      targets,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        this._crawlObjects.forEach((o) => o?.destroy());
        this._crawlObjects = [];
        this._startCameraPan();
      },
    });
  }

  // ============================================================
  // SKIP HANDLER
  // ============================================================

  /**
   * Skip the text crawl immediately.
   * Cancels all pending timers, destroys existing text objects,
   * and jumps directly to the camera pan.
   */
  _skipCrawl() {
    if (!this._active) return;

    // Remove remaining keyboard listener (pointer listener is already consumed via .once)
    this.scene.input.keyboard.off('keydown-SPACE', this._skipHandler);

    // Cancel all pending delayedCall timers
    this._timers.forEach((t) => t.remove(false));
    this._timers = [];

    // Destroy any text objects already created
    this._crawlObjects.forEach((o) => o?.destroy());
    this._crawlObjects = [];

    // Jump straight to camera pan
    this._startCameraPan();
  }

  // ============================================================
  // BEAT 2: CAMERA PAN
  // ============================================================

  /**
   * Pan the camera from an offset position to the oasis_village player spawn
   * over 2500ms. Applies the warm dawn feel already set by _applyDawnTint().
   *
   * Spawn: tile (14, 20) × 64px = world pixel (896, 1280)
   */
  _startCameraPan() {
    if (!this._active) return;

    const TILE = 64;
    const spawnX = 14 * TILE; // 896
    const spawnY = 20 * TILE; // 1280

    // Start pan from a slightly offset position for cinematic effect
    this.scene.cameras.main.centerOn(spawnX - 200, spawnY - 200);

    // Pan to player spawn over 2500ms
    this.scene.cameras.main.pan(
      spawnX,
      spawnY,
      2500,
      'Power2',
      false,
      (cam, progress) => {
        if (progress === 1) {
          this._onPanComplete();
        }
      }
    );
  }

  // ============================================================
  // BEAT 2 → BEAT 3 HOOK
  // ============================================================

  /**
   * Called when the camera pan reaches 100% progress.
   *
   * Emits a named EventBus event so other systems can hook in,
   * calls the optional legacy onPanComplete callback for compatibility,
   * then spawns the FloatingWordObject (Beat 3: INTRO-03).
   */
  _onPanComplete() {
    if (!this._active) return;

    // EventBus signal for any listener interested in pan completion
    EventBus.emit('cinematic:pan_complete', this.scene);

    // Expose hook for external callers (legacy — kept for compatibility)
    if (typeof this.onPanComplete === 'function') {
      this.onPanComplete();
    }

    // Spawn the floating word — Beat 3 (INTRO-03)
    this._spawnFloatingWord();
  }

  // ============================================================
  // BEAT 3: FLOATING WORD SPAWN (INTRO-03)
  // ============================================================

  /**
   * Create a FloatingWordObject near the oasis pool at world (896, 1088).
   * Register per-frame scene 'update' listener to check player proximity.
   * Unfreeze the player so they can walk to it naturally.
   */
  _spawnFloatingWord() {
    if (!this._active) return;

    this._floatingWord = new FloatingWordObject(
      this.scene,
      WORD_SPAWN_X,
      WORD_SPAWN_Y,
      FIRST_WORD,
      () => this._onWordLearned()
    );

    // Register per-frame update to check proximity + SPACE
    this._updateBound = () => {
      if (!this._floatingWord || !this._active) return;
      const player = this.scene.playerController?.getPlayer();
      if (player) {
        this._floatingWord.update(player.x, player.y);
      }
    };
    this.scene.events.on('update', this._updateBound);

    // Unfreeze player so they can walk to the floating word
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }

  // ============================================================
  // BEAT 4: WORD LEARNED HOOK (INTRO-04 → Plan 47-03)
  // ============================================================

  /**
   * Called after FloatingWordObject interaction + DialogueBox dismiss.
   * Removes the per-frame update listener, then exposes the onWordLearned
   * hook for Plan 47-03 (Amira arrival).
   *
   * Assign: sequencer.onWordLearned = () => { ... }
   */
  _onWordLearned() {
    if (!this._active) return;
    // Remove update listener (FloatingWordObject proximity check)
    if (this._updateBound) {
      this.scene.events.off('update', this._updateBound);
      this._updateBound = null;
    }
    // Expose external hook (for testing / Phase 48-49 wiring)
    if (this.onWordLearned) this.onWordLearned();
    // Proceed to beat 5: Amira arrival
    this._triggerAmiraArrival();
  }

  // ============================================================
  // BEAT 5: AMIRA ARRIVAL (INTRO-05)
  // ============================================================

  /**
   * Pan camera to Guide Amira's position (tile 14,18 → world 896, 1152),
   * then open her arrival dialogue.
   * Player remains frozen (DialogueBox.show() emits PLAYER_FREEZE again).
   */
  _triggerAmiraArrival() {
    if (!this._active) return;

    // Freeze player while Amira speaks
    EventBus.emit(EVENTS.PLAYER_FREEZE);

    // Pan camera to Amira's position (tile 14,18 → world 896, 1152)
    const amiraWorldX = 14 * 64; // 896
    const amiraWorldY = 18 * 64; // 1152
    this.scene.cameras.main.pan(amiraWorldX, amiraWorldY, 1000, 'Power2', false, (cam, progress) => {
      if (progress === 1) {
        this._showAmiraDialogue();
      }
    });
  }

  /**
   * Show Guide Amira's two-line arrival dialogue via DialogueBox.
   * On completion, calls _completeSequence().
   */
  _showAmiraDialogue() {
    if (!this._active || !this.scene.dialogueBox) {
      this._completeSequence();
      return;
    }

    const messages = [
      'السَّلامُ عَلَيْكُم، أَيُّها المُسافِر.',
      'I have been waiting for you. Speak to me when you are ready.',
    ];

    this.scene.dialogueBox.show('Guide Amira', messages, () => {
      this._completeSequence();
    });
  }

  // ============================================================
  // SEQUENCE COMPLETION
  // ============================================================

  /**
   * Dispatches Redux state transitions and calls cleanup().
   * - setTutorialPhase('awaiting_mentor') un-blocks TutorialHints
   *   and triggers the "Walk to Guide Amira" arrow hint
   * - setActiveQuest('tutorial_welcome') hands the player their first quest
   */
  _completeSequence() {
    if (!this._active) return;

    // Dispatch: transition tutorial phase to awaiting_mentor
    // This un-blocks TutorialHints (see GameLayout.jsx line ~292)
    // and triggers the "Walk to Guide Amira" arrow hint (TutorialHints.jsx line ~131)
    store.dispatch(setTutorialPhase('awaiting_mentor'));

    // Dispatch: set first quest as active
    store.dispatch(setActiveQuest('tutorial_welcome'));

    // Cleanup: unfreeze player, destroy all objects
    this.cleanup();
  }
}
