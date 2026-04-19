import Phaser from 'phaser';
import { store } from '../../store/store.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { incrementWordsLearned } from '../../store/slices/playerSlice.js';
import { createArabicText } from '../ui/ArabicText.js';

/**
 * FloatingWordObject — Phase 47 Plan 02 (INTRO-03 / INTRO-04)
 *
 * A Phaser-native interactive word discovery object. Appears in the world
 * as a pulsing gold glow circle with an Arabic word floating above it.
 * Player walks to it (no prompt) and presses SPACE to discover the word.
 *
 * Visual composition:
 *   - Gold glow circle (Graphics, pulsing alpha 0.1–0.45 over 900ms)
 *   - Arabic word via createArabicText() (gold, depth 51)
 *   - English label below (white, 8px, depth 51)
 *   - Vertical bob tween (±8px, 1200ms Sine.easeInOut loop)
 *
 * Interaction:
 *   - Player within INTERACT_RANGE (128px) + SPACE pressed → _triggerInteraction()
 *   - Glow + word destroyed, particle burst fires, FSRS card dispatched,
 *     wordsLearned incremented, DialogueBox shows discovery message
 *   - onInteract callback fires after DialogueBox is dismissed
 */

const INTERACT_RANGE = 128; // Match InteractableManager (64 * 2)

export class FloatingWordObject {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x - World X position
   * @param {number} y - World Y position
   * @param {{ wordId: string, arabic: string, english: string }} wordData
   * @param {Function} onInteract - Called after DialogueBox is dismissed
   */
  constructor(scene, x, y, wordData, onInteract) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.wordData = wordData;
    this.onInteract = onInteract;
    this._interacted = false;

    // Display objects
    this._glowGraphics = null;
    this._arabicText = null;
    this._englishText = null;

    // Tweens
    this._glowTween = null;
    this._bobTween = null;

    // Input
    this._interactKey = null;

    this._create();
  }

  // ============================================================
  // BUILD DISPLAY OBJECTS
  // ============================================================

  _create() {
    // 1. Glow circle (Graphics at world position, no scrollFactor override — follows camera)
    this._glowGraphics = this.scene.add.graphics();
    this._glowGraphics.fillStyle(0xd4a843, 1);
    this._glowGraphics.fillCircle(0, 0, 32);
    this._glowGraphics.setPosition(this.x, this.y);
    this._glowGraphics.setAlpha(0.15);
    this._glowGraphics.setDepth(50);

    // 2. Pulsing glow tween (stored for cleanup)
    this._glowTween = this.scene.tweens.add({
      targets: this._glowGraphics,
      alpha: { from: 0.1, to: 0.45 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 3. Arabic word text — slightly above center
    this._arabicText = createArabicText(
      this.scene,
      this.x,
      this.y - 8,
      this.wordData.arabic,
      {
        fontSize: '20px',
        color: '#d4a843',
        fontFamily: "'Press Start 2P', monospace",
      }
    );
    this._arabicText.setOrigin(0.5).setDepth(51);

    // 4. English label below
    this._englishText = this.scene.add.text(
      this.x,
      this.y + 20,
      this.wordData.english,
      {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '8px',
        color: '#f4fefa',
      }
    ).setOrigin(0.5).setDepth(51);

    // 5. Bob tween — gentle vertical float on both text objects
    this._bobTween = this.scene.tweens.add({
      targets: [this._arabicText, this._englishText],
      y: '-=8',
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });

    // 6. SPACE key reference for proximity interaction check
    this._interactKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  // ============================================================
  // PER-FRAME UPDATE (called from sequencer's scene 'update' listener)
  // ============================================================

  /**
   * Check proximity and SPACE key each frame.
   * @param {number} playerX - Player's current world X
   * @param {number} playerY - Player's current world Y
   */
  update(playerX, playerY) {
    if (this._interacted) return;

    const dist = Phaser.Math.Distance.Between(playerX, playerY, this.x, this.y);
    if (dist <= INTERACT_RANGE && Phaser.Input.Keyboard.JustDown(this._interactKey)) {
      this._triggerInteraction();
    }
  }

  // ============================================================
  // INTERACTION
  // ============================================================

  _triggerInteraction() {
    if (this._interacted) return;
    this._interacted = true;

    // Cache position before destroying visuals
    const wx = this.x;
    const wy = this.y;

    // 1. Destroy visuals immediately
    this.destroy();

    // 2. Particle burst at word position (gold tint, generous count)
    if (this.scene.particleEffects) {
      this.scene.particleEffects.burst(wx, wy, {
        count: 30,
        tint: 0xd4a843,
        speed: { min: 60, max: 180 },
        lifespan: 900,
      });
    }

    // 3. Dispatch FSRS card — introduces the word into spaced repetition
    store.dispatch(addFsrsCard({
      wordId: this.wordData.wordId,
      card: {
        due: new Date().toISOString(),
        stability: 0,
        difficulty: 0,
        elapsed_days: 0,
        scheduled_days: 0,
        reps: 0,
        lapses: 0,
        state: 0,
        last_review: null,
      },
      source: 'cinematic_intro',
    }));

    // 4. Increment wordsLearned counter in playerSlice
    store.dispatch(incrementWordsLearned());

    // 5. Show DialogueBox discovery message — player must press SPACE to dismiss
    //    onComplete fires the onInteract callback (Plan 47-03 hooks in here)
    const message = `${this.wordData.arabic}  —  "${this.wordData.english}"`;
    if (this.scene.dialogueBox) {
      this.scene.dialogueBox.show(
        'Word Found',
        [message, 'This word is now in your memory.'],
        () => {
          // 6. Fire callback — Plan 47-03 assigns sequencer._onWordLearned here
          if (this.onInteract) this.onInteract();
        }
      );
    } else {
      // Fallback: no DialogueBox — fire callback immediately
      if (this.onInteract) this.onInteract();
    }
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  destroy() {
    if (this._glowTween) {
      this._glowTween.stop();
      this._glowTween = null;
    }
    if (this._bobTween) {
      this._bobTween.stop();
      this._bobTween = null;
    }
    if (this._glowGraphics) {
      this._glowGraphics.destroy();
      this._glowGraphics = null;
    }
    if (this._arabicText) {
      this._arabicText.destroy();
      this._arabicText = null;
    }
    if (this._englishText) {
      this._englishText.destroy();
      this._englishText = null;
    }
  }
}
