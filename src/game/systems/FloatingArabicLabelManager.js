/**
 * FloatingArabicLabelManager
 * IMM-03: Renders floating Arabic labels above interactable world objects.
 * Labels fade based on FSRS vocabulary stability — new words are prominent,
 * mastered words fade to zero.
 */

import { store } from '../../store/store.js';
import { getLabelsForZone } from '../../data/environmentalLabels.js';
import { createArabicText } from '../ui/ArabicText.js';

const LABEL_OFFSET_Y = -65;
const TRANSLIT_OFFSET_Y = -78;
const UPDATE_INTERVAL = 5000;

export class FloatingArabicLabelManager {
  constructor(scene) {
    this.scene = scene;
    this.labels = [];
    this._lastUpdateTime = 0;
  }

  /**
   * Create floating labels for all matching interactables in the zone.
   * @param {string} zoneName - Zone ID from zones.js
   * @param {import('./InteractableManager.js').InteractableManager} interactableManager
   */
  create(zoneName, interactableManager) {
    this.destroy();
    const labelDefs = getLabelsForZone(zoneName);
    if (!labelDefs.length) return;

    const interactables = interactableManager.interactables || [];

    for (const def of labelDefs) {
      const obj = interactables.find((i) => i.id === def.interactableId);
      if (!obj) continue;

      const px = obj.worldX;
      const py = obj.worldY;

      // Arabic label above object — uses createArabicText for proper reshaping/RTL
      const arabicText = createArabicText(this.scene, px, py + LABEL_OFFSET_Y, def.arabic, {
        fontSize: '16px',
        color: '#e2b659',
        stroke: '#1a1a2e',
        strokeThickness: 4,
      });
      arabicText.setDepth(9998);

      // Transliteration below Arabic
      const translitText = this.scene.add.text(px, py + TRANSLIT_OFFSET_Y, def.transliteration, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '6px',
        color: '#c8c8c8',
        stroke: '#1a1a2e',
        strokeThickness: 2,
      }).setOrigin(0.5).setDepth(9998);

      // Gentle bob animation on the Arabic text
      this.scene.tweens.add({
        targets: [arabicText],
        y: py + LABEL_OFFSET_Y - 4,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.labels.push({ def, arabicText, translitText, worldX: px, worldY: py });
    }

    this._updateVisibility();
  }

  /**
   * Periodically update label visibility based on FSRS vocabulary mastery.
   * @param {number} time - Phaser scene time
   */
  update(time) {
    if (time - this._lastUpdateTime < UPDATE_INTERVAL) return;
    this._lastUpdateTime = time;
    this._updateVisibility();
  }

  /**
   * Adjust label alpha/visibility based on FSRS card stability.
   * - No card or 0 reps: full visibility (new word)
   * - Stability < 7: full Arabic, transliteration visible
   * - Stability 7–29: faded Arabic, transliteration hidden
   * - Stability >= 30: fully hidden (mastered)
   */
  _updateVisibility() {
    const state = store.getState();
    const fsrsCards = state.vocabulary?.fsrsCards ?? {};

    for (const label of this.labels) {
      const cardData = fsrsCards[label.def.vocabWordId];

      if (!cardData || !cardData.card || cardData.card.reps === 0) {
        label.arabicText.setAlpha(1.0);
        label.translitText.setVisible(true).setAlpha(0.8);
        continue;
      }

      const stability = cardData.card.stability || 0;

      if (stability < 7) {
        label.arabicText.setAlpha(1.0);
        label.translitText.setVisible(true).setAlpha(0.6);
      } else if (stability < 30) {
        label.arabicText.setAlpha(0.5);
        label.translitText.setVisible(false);
      } else {
        label.arabicText.setAlpha(0);
        label.translitText.setVisible(false);
      }
    }
  }

  /**
   * Destroy all labels and free resources.
   */
  destroy() {
    for (const label of this.labels) {
      if (label.arabicText?.destroy) label.arabicText.destroy();
      if (label.translitText?.destroy) label.translitText.destroy();
    }
    this.labels = [];
    this._lastUpdateTime = 0;
  }
}
