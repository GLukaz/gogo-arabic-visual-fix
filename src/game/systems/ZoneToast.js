import { createArabicText } from '../ui/ArabicText.js';

/**
 * ZoneToast — shows a brief zone name overlay when entering a new zone.
 *
 * Displays the Arabic name (gold) above the English name (white),
 * fades in, holds 2 seconds, fades out, then self-destructs.
 */
export class ZoneToast {
  /**
   * @param {Phaser.Scene} scene
   * @param {string} zoneName - zone ID (e.g. 'oasis_village')
   * @param {object} zoneData - zone definition from zones.js
   */
  static show(scene, zoneName, zoneData) {
    if (!zoneData) return;

    const cam = scene.cameras.main;
    const centerX = cam.width / 2;

    const englishName = zoneData.name || zoneName.replace(/_/g, ' ');
    const englishLabel = scene.add.text(centerX, 60, englishName.toUpperCase(), {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '12px',
      color: '#f4fefa',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(9500).setAlpha(0);

    let arabicLabel = null;
    if (zoneData.nameArabic) {
      arabicLabel = createArabicText(scene, centerX, 38, zoneData.nameArabic, {
        fontSize: '16px',
        color: '#d4a843',
      });
      arabicLabel.setScrollFactor(0).setDepth(9500).setAlpha(0);
    }

    const targets = [englishLabel];
    if (arabicLabel) targets.push(arabicLabel);

    scene.tweens.add({
      targets,
      alpha: 1,
      duration: 400,
      ease: 'Power2',
      hold: 2000,
      yoyo: true,
      onComplete: () => {
        englishLabel.destroy();
        if (arabicLabel) arabicLabel.destroy();
      },
    });
  }
}
