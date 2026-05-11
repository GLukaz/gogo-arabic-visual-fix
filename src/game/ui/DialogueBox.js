import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { prepareArabicText } from './ArabicText.js';

/**
 * DialogueBox — In-canvas NPC dialogue display.
 * Renders at bottom of viewport, fixed to camera.
 * Typewriter text with advance-on-input.
 *
 * Usage:
 *   const box = new DialogueBox(scene);
 *   box.show('Fatima', ['Welcome!', 'How can I help?'], () => { ... });
 *
 * Call box.advance() on SPACE/ENTER to progress through messages.
 * First press during typing skips to full text; next press advances
 * to the following message (or hides the box if it was the last one).
 */
export class DialogueBox {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;

    // Phaser display objects
    this.container = null;
    this.bg = null;
    this.nameText = null;
    this.bodyText = null;
    this.cursor = null;

    // Tweens / timers
    this.cursorTween = null;
    this.typeTimer = null;

    // State
    this.messages = [];
    this.currentIndex = 0;
    this.isTyping = false;
    this.isVisible = false;
    this.onComplete = null;

    // Layout cache (used for resize if needed later)
    this._boxX = 0;
    this._boxY = 0;
    this._boxW = 0;
    this._boxH = 0;

    this._create();
  }

  // ──────────────────────────────────────────────
  // Internal — build display objects once
  // ──────────────────────────────────────────────

  _create() {
    const cam = this.scene.cameras.main;
    const boxW = Math.min(cam.width - 40, 600);
    const boxH = 120;
    const boxX = (cam.width - boxW) / 2;
    const boxY = cam.height - boxH - 20;

    // Root container — fixed to camera, above everything
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(10000);
    this.container.setVisible(false);

    // Background panel — dark with gold border
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.95);
    bg.fillRoundedRect(boxX, boxY, boxW, boxH, 6);
    bg.lineStyle(3, 0xd4a843, 1);
    bg.strokeRoundedRect(boxX, boxY, boxW, boxH, 6);
    this.container.add(bg);
    this.bg = bg;

    // NPC name label — gold, top-left
    this.nameText = this.scene.add.text(boxX + 16, boxY + 8, '', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '11px',
      color: '#d4a843',
    });
    this.container.add(this.nameText);

    // Body text — white, word-wrapped
    this.bodyText = this.scene.add.text(boxX + 16, boxY + 30, '', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px',
      color: '#f4fefa',
      wordWrap: { width: boxW - 32 },
      lineSpacing: 6,
    });
    this.container.add(this.bodyText);

    // Blinking input cursor (▼) — gold, bottom-right
    this.cursor = this.scene.add.text(
      boxX + boxW - 24,
      boxY + boxH - 20,
      '\u25bc', // ▼
      {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        color: '#d4a843',
      },
    );
    this.cursor.setVisible(false);
    this.container.add(this.cursor);

    // Cache layout
    this._boxX = boxX;
    this._boxY = boxY;
    this._boxW = boxW;
    this._boxH = boxH;
  }

  // ──────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────

  /**
   * Show dialogue with an NPC name and an array of message strings.
   * @param {string}   npcName     Display name shown in gold
   * @param {string[]} messages    Sequential lines of dialogue
   * @param {Function} [onComplete] Called after the final message is dismissed
   */
  show(npcName, messages, onComplete) {
    if (!messages || messages.length === 0) return;

    this.messages = messages;
    this.currentIndex = 0;
    this.onComplete = onComplete || null;
    this.isVisible = true;

    this.container.setVisible(true);
    this.nameText.setText(npcName);

    // Freeze player movement while dialogue is open
    EventBus.emit(EVENTS.PLAYER_FREEZE);

    this._showCurrentMessage();
  }

  /**
   * Advance the dialogue. Call this from your scene's input handler
   * when SPACE or ENTER is pressed.
   *
   * @returns {boolean} true if the input was consumed (dialogue was visible)
   */
  advance() {
    if (!this.isVisible) return false;

    if (this.isTyping) {
      // Skip typewriter — show full text immediately
      this._finishTyping();
      return true;
    }

    // Move to next message (or close)
    this.currentIndex++;
    if (this.currentIndex < this.messages.length) {
      this._showCurrentMessage();
    } else {
      this.hide();
    }
    return true;
  }

  /**
   * Immediately close the dialogue box and fire callbacks.
   */
  hide() {
    this.isVisible = false;
    this.container.setVisible(false);

    this._clearTimers();
    this.cursor.setVisible(false);

    // Unfreeze player
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);

    // Signal dialogue ended (mirrors React DIALOGUE_ENDED event)
    EventBus.emit(EVENTS.DIALOGUE_ENDED);

    if (this.onComplete) {
      const cb = this.onComplete;
      this.onComplete = null;
      cb();
    }
  }

  /**
   * Clean up all display objects. Call when the scene shuts down.
   */
  destroy() {
    this._clearTimers();
    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }

  // ──────────────────────────────────────────────
  // Internal helpers
  // ──────────────────────────────────────────────

  /** Check if text contains Arabic Unicode characters */
  _hasArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  }

  /** Start typewriter for the message at currentIndex */
  _showCurrentMessage() {
    const msg = this.messages[this.currentIndex];
    const isArabic = this._hasArabic(msg);

    // Switch font style based on content language
    if (isArabic) {
      this.bodyText.setStyle({
        fontFamily: "'PixelAE', 'Amiri', 'Noto Naskh Arabic', serif",
        fontSize: '14px',
        color: '#f4fefa',
        wordWrap: { width: this._boxW - 32 },
        lineSpacing: 6,
        align: 'right',
      });
    } else {
      this.bodyText.setStyle({
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        color: '#f4fefa',
        wordWrap: { width: this._boxW - 32 },
        lineSpacing: 6,
      });
    }

    this.bodyText.setText('');
    this.cursor.setVisible(false);
    this.isTyping = true;

    // Prepare the display text (reshape + reverse Arabic, or use as-is for English)
    const displayMsg = isArabic ? prepareArabicText(msg) : msg;

    let charIndex = 0;
    const speed = isArabic ? 20 : 30; // Arabic flows faster (fewer "visual" chars due to reshaping)

    this._clearTimers();

    this.typeTimer = this.scene.time.addEvent({
      delay: speed,
      repeat: displayMsg.length - 1,
      callback: () => {
        charIndex++;
        this.bodyText.setText(displayMsg.substring(0, charIndex));

        if (charIndex >= displayMsg.length) {
          this.isTyping = false;
          this._showCursor();
        }
      },
    });
  }

  /** Skip to the end of the current message's typewriter */
  _finishTyping() {
    if (this.typeTimer) {
      this.typeTimer.remove();
      this.typeTimer = null;
    }
    const msg = this.messages[this.currentIndex];
    const displayMsg = this._hasArabic(msg) ? prepareArabicText(msg) : msg;
    this.bodyText.setText(displayMsg);
    this.isTyping = false;
    this._showCursor();
  }

  /** Show the blinking ▼ cursor */
  _showCursor() {
    this.cursor.setVisible(true);
    if (this.cursorTween) {
      this.cursorTween.remove();
    }
    this.cursorTween = this.scene.tweens.add({
      targets: this.cursor,
      alpha: { from: 1, to: 0.2 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  /** Remove any active timers / tweens */
  _clearTimers() {
    if (this.typeTimer) {
      this.typeTimer.remove();
      this.typeTimer = null;
    }
    if (this.cursorTween) {
      this.cursorTween.remove();
      this.cursorTween = null;
    }
  }
}
