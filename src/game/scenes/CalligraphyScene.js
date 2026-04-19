/**
 * CalligraphyScene.js — Lazy-loaded Phaser scene for Arabic letter tracing.
 *
 * CALL-01: This scene is NOT in gameConfig.scene[]. It is registered dynamically
 *          by MiniGamesHub (55-03) via game.scene.add() before first use.
 *
 * CALL-02: Pointer/touch input is captured via scene-level this.input.on() listeners
 *          (NOT game.input.on()), so they are automatically cleaned up on scene stop.
 *
 * Scoring: Frechet distance on resampled path arrays. 28 reference paths loaded from
 *          calligraphyPaths.json (imported dynamically inside create()).
 *
 * Communication with React: EventBus CALLIGRAPHY_STROKE_COMPLETE / CALLIGRAPHY_SCENE_EXIT.
 */

import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { resamplePath, discreteFrechetDistance } from '../../utils/frechetDistance.js';
import { store } from '../../store/store.js';
import { markLetterPracticed } from '../../store/slices/alphabetSlice.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';

// Drawing constants
const RESAMPLE_COUNT = 64;
const STAR_THRESHOLDS = { THREE: 0.15, TWO: 0.30 };
const COLORS = {
  BACKGROUND: 0x1a1a2e,
  REFERENCE_PATH: 0x4a4a6a,
  REFERENCE_ALPHA: 0.4,
  STROKE: 0xf5a623,  // gold
  STAR_GOLD: '#f5a623',
  STAR_GRAY: '#888888',
  TEXT_WHITE: '#ffffff',
  TEXT_MUTED: '#aaaaaa',
  BUTTON: '#cccccc',
};
const DRAWING_AREA = {
  PAD_X: 0.1,        // 10% padding left/right
  TOP_Y: 0.15,       // below header
  HEIGHT: 0.75,      // 75% of scene height for drawing
};
const STROKE_LINE_WIDTH = 6;
const REF_LINE_WIDTH = 8;

export class CalligraphyScene extends Phaser.Scene {
  constructor() {
    // CALL-01: key-only constructor; NOT registered in gameConfig.scene[]
    super({ key: 'CalligraphyScene' });
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────

  init(data) {
    this._letterId = data.letterId || 'alif';
    this._returnSceneKey = data.returnSceneKey || 'WorldScene';
    this._strokePath = [];
    this._isDrawing = false;
    this._graphics = null;
    this._referenceGraphics = null;
    this._referencePaths = null;
    this._feedbackText = null;
    this._debugText = null;
    this._resultText = null;
    this._prevPtr = null;
  }

  async create() {
    const { width, height } = this.scale;

    // Background
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // Load reference paths dynamically (keeps JSON out of initial bundle)
    try {
      const mod = await import('../../data/calligraphyPaths.json');
      this._referencePaths = mod.default || mod;
    } catch (err) {
      console.error('[CalligraphyScene] Failed to load calligraphyPaths.json', err);
      this._referencePaths = {};
    }

    // Reference path display (faint guide)
    this._referenceGraphics = this.add.graphics();
    this._drawReferencePath();

    // Player stroke graphics layer (drawn on top of reference)
    this._graphics = this.add.graphics();

    // Letter heading
    const letterData = this._referencePaths[this._letterId];
    const unicode = letterData?.unicode ?? '?';
    const nameEn = letterData?.nameEnglish ?? this._letterId;

    this.add.text(width / 2, 28, unicode, {
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.TEXT_WHITE,
    }).setOrigin(0.5);

    this.add.text(width / 2, 82, `Trace the letter — ${nameEn}`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.TEXT_MUTED,
    }).setOrigin(0.5);

    // Back button (top-left)
    const backBtn = this.add.text(16, 12, '← Back', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.BUTTON,
    }).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this._exitScene());

    // Clear button (top-right)
    const clearBtn = this.add.text(width - 16, 12, 'Clear ✕', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.BUTTON,
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    clearBtn.on('pointerdown', () => this._clearStroke());

    // Star rating feedback text (hidden until needed)
    this._feedbackText = this.add.text(width / 2, height / 2, '', {
      fontSize: '36px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.STAR_GOLD,
    }).setOrigin(0.5).setDepth(10);

    // Debug accuracy text (shown below stars)
    this._debugText = this.add.text(width / 2, height / 2 + 44, '', {
      fontSize: '11px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.TEXT_MUTED,
    }).setOrigin(0.5).setDepth(10);

    // Result label text ("Practiced!" or "Try again!") — shown below debug
    this._resultText = this.add.text(width / 2, height / 2 + 64, '', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: COLORS.STAR_GOLD,
    }).setOrigin(0.5).setDepth(10);

    // ── Pointer input (CALL-02: scene-level only) ─────────────────────────
    this.input.on('pointerdown', (ptr) => {
      this._isDrawing = true;
      this._strokePath = [this._normalize(ptr.x, ptr.y)];
      this._prevPtr = { x: ptr.x, y: ptr.y };
      this._graphics.clear();
    });

    this.input.on('pointermove', (ptr) => {
      if (!this._isDrawing) return;
      const norm = this._normalize(ptr.x, ptr.y);
      this._strokePath.push(norm);

      // Draw segment from previous pointer position
      if (this._prevPtr) {
        this._graphics.lineStyle(STROKE_LINE_WIDTH, COLORS.STROKE, 1);
        this._graphics.beginPath();
        this._graphics.moveTo(this._prevPtr.x, this._prevPtr.y);
        this._graphics.lineTo(ptr.x, ptr.y);
        this._graphics.strokePath();
      }
      this._prevPtr = { x: ptr.x, y: ptr.y };
    });

    this.input.on('pointerup', () => {
      this._isDrawing = false;
      this._prevPtr = null;

      if (this._strokePath.length >= 5) {
        this._onStrokeComplete();
      } else {
        this._showFeedback('Trace the complete stroke', COLORS.TEXT_MUTED, 1200);
      }
    });
  }

  // ─────────────────────────────────────────────
  // DRAWING
  // ─────────────────────────────────────────────

  _drawReferencePath() {
    if (!this._referencePaths) return;
    const letterData = this._referencePaths[this._letterId];
    if (!letterData?.referencePath?.length) return;

    const { width, height } = this.scale;
    const areaX = width * DRAWING_AREA.PAD_X;
    const areaY = height * DRAWING_AREA.TOP_Y;
    const areaW = width * (1 - 2 * DRAWING_AREA.PAD_X);
    const areaH = height * DRAWING_AREA.HEIGHT;

    this._referenceGraphics.clear();
    this._referenceGraphics.lineStyle(REF_LINE_WIDTH, COLORS.REFERENCE_PATH, COLORS.REFERENCE_ALPHA);

    const pts = letterData.referencePath;
    this._referenceGraphics.beginPath();
    this._referenceGraphics.moveTo(
      areaX + pts[0].x * areaW,
      areaY + pts[0].y * areaH,
    );
    for (let i = 1; i < pts.length; i++) {
      this._referenceGraphics.lineTo(
        areaX + pts[i].x * areaW,
        areaY + pts[i].y * areaH,
      );
    }
    this._referenceGraphics.strokePath();
  }

  // ─────────────────────────────────────────────
  // COORDINATE HELPERS
  // ─────────────────────────────────────────────

  /**
   * Normalize a screen coordinate to the 0-1 drawing area space.
   * Clamped to [0, 1] in both axes.
   */
  _normalize(x, y) {
    const { width, height } = this.scale;
    const areaX = width * DRAWING_AREA.PAD_X;
    const areaY = height * DRAWING_AREA.TOP_Y;
    const areaW = width * (1 - 2 * DRAWING_AREA.PAD_X);
    const areaH = height * DRAWING_AREA.HEIGHT;

    return {
      x: Math.min(1, Math.max(0, (x - areaX) / areaW)),
      y: Math.min(1, Math.max(0, (y - areaY) / areaH)),
    };
  }

  // ─────────────────────────────────────────────
  // SCORING
  // ─────────────────────────────────────────────

  _onStrokeComplete() {
    const letterData = this._referencePaths?.[this._letterId];
    if (!letterData?.referencePath?.length) {
      this._showFeedback('No reference path found', COLORS.TEXT_MUTED, 1500);
      return;
    }

    const referencePath = letterData.referencePath;

    // Resample both paths to a fixed count before comparing (Pitfall 2 prevention)
    const playerResampled = resamplePath(this._strokePath, RESAMPLE_COUNT);
    const refResampled = resamplePath(referencePath, RESAMPLE_COUNT);

    const frechetDist = discreteFrechetDistance(playerResampled, refResampled);

    // Map distance to star rating
    let stars;
    if (frechetDist < STAR_THRESHOLDS.THREE) {
      stars = 3;
    } else if (frechetDist < STAR_THRESHOLDS.TWO) {
      stars = 2;
    } else {
      stars = 1;
    }

    // Display star rating (filled gold for earned, gray outline for unearned)
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    const starColor = stars >= 2 ? COLORS.STAR_GOLD : COLORS.STAR_GRAY;
    this._feedbackText.setText(starStr).setColor(starColor).setAlpha(1);

    // Show Frechet distance as debug accuracy info
    this._debugText.setText(`Accuracy: ${frechetDist.toFixed(3)}`).setAlpha(1);

    // Show practice result label
    const resultMsg = stars >= 2 ? 'Practiced!' : 'Try again!';
    const resultColor = stars >= 2 ? '#22cc66' : '#f5a623';
    this._resultText.setText(resultMsg).setColor(resultColor).setAlpha(1);

    // Dispatch markLetterPracticed to alphabetSlice if 2+ stars
    if (stars >= 2) {
      store.dispatch(markLetterPracticed({ letterId: this._letterId, stars }));
    }

    // Dispatch addFsrsCard for associated vocabulary word if letter has a wordId
    const wordId = letterData?.wordId;
    if (wordId && stars >= 2) {
      const fsrsCards = store.getState().vocabulary?.fsrsCards ?? {};
      if (!fsrsCards[wordId]) {
        // Create a minimal FSRS card for the letter's associated word
        store.dispatch(addFsrsCard({
          wordId,
          card: { due: new Date().toISOString(), stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 0, lapses: 0, state: 0, last_review: null },
          source: 'calligraphy',
        }));
      }
    }

    // Emit result to React layer
    EventBus.emit(EVENTS.CALLIGRAPHY_STROKE_COMPLETE, {
      letterId: this._letterId,
      stars,
      frechetDistance: frechetDist,
    });

    // Auto-clear after 2.5 seconds so player can try again
    this.time.delayedCall(2500, () => {
      this._clearStroke();
    });
  }

  // ─────────────────────────────────────────────
  // CONTROLS
  // ─────────────────────────────────────────────

  _clearStroke() {
    this._graphics.clear();
    this._strokePath = [];
    this._isDrawing = false;
    this._prevPtr = null;
    if (this._feedbackText) {
      this._feedbackText.setText('');
    }
    if (this._debugText) {
      this._debugText.setText('');
    }
    if (this._resultText) {
      this._resultText.setText('');
    }
  }

  _exitScene() {
    EventBus.emit(EVENTS.CALLIGRAPHY_SCENE_EXIT, { letterId: this._letterId });
    this.scene.stop();
  }

  // ─────────────────────────────────────────────
  // UI HELPERS
  // ─────────────────────────────────────────────

  _showFeedback(message, color, duration = 1000) {
    if (!this._feedbackText) return;
    this._feedbackText.setText(message).setColor(color).setAlpha(1);

    this.time.delayedCall(duration, () => {
      if (this._feedbackText && this._feedbackText.active) {
        this._feedbackText.setText('');
      }
    });
  }
}
