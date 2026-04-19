/**
 * BattleHUDManager.js — Phaser-rendered HP/MP bars with smooth easing.
 *
 * HP bars use layered rectangles: bg (dark) -> dmgBar (pending damage) -> hpBar (current).
 * Damage preview: dmgBar holds old value briefly before shrinking to show "pending damage".
 * Color transitions: green > yellow > red based on HP ratio.
 * MP bar uses blue gradient. All bars are fixed to camera (scrollFactor 0).
 */

import { store } from '../../../store/store.js';

/**
 * Animated HP/MP bar with smooth easing, flash on damage, and color transitions.
 */
class HPBar {
  constructor(scene, x, y, width, height, config = {}) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.barWidth = width;
    this.barHeight = height;
    this.maxValue = config.maxValue || 100;
    this.currentValue = config.maxValue || 100;
    this.displayValue = this.currentValue;
    this.barColor = config.barColor || null; // null = auto green/yellow/red

    // Background bar (dark)
    this.bgBar = scene.add
      .rectangle(x, y, width, height, 0x333333)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(9990);

    // Damage preview bar (lighter, shows pending damage)
    this.dmgBar = scene.add
      .rectangle(x, y, width, height, 0xff6666)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(9991);

    // Main bar
    const color = this.barColor || 0x44cc44;
    this.hpBar = scene.add
      .rectangle(x, y, width, height, color)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(9992);

    // Value text
    this.hpText = scene.add
      .text(x + width / 2, y, '', {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(9993);

    this._updateDisplay();
  }

  /**
   * Set value with smooth animation.
   * @param {number} newValue
   * @param {boolean} flash - Flash white on damage
   */
  setValue(newValue, flash = false) {
    const oldValue = this.currentValue;
    this.currentValue = Math.max(0, Math.min(this.maxValue, newValue));

    // Flash bar on damage
    if (flash && newValue < oldValue) {
      this.hpBar.setFillStyle(0xffffff);
      this.scene.time.delayedCall(80, () => {
        this._updateBarColor();
      });
    }

    const targetWidth = (this.currentValue / this.maxValue) * this.barWidth;

    // Damage preview: holds old width, then shrinks with delay
    this.scene.tweens.add({
      targets: this.dmgBar,
      width: targetWidth,
      duration: 600,
      delay: 300,
      ease: 'Power2',
    });

    // Main bar moves immediately
    this.scene.tweens.add({
      targets: this.hpBar,
      width: targetWidth,
      duration: 400,
      ease: 'Power2',
      onUpdate: () => {
        const ratio = this.hpBar.width / this.barWidth;
        this.displayValue = Math.round(ratio * this.maxValue);
        this._updateDisplay();
      },
    });
  }

  _updateBarColor() {
    if (this.barColor) {
      this.hpBar.setFillStyle(this.barColor);
      return;
    }
    const ratio = this.currentValue / this.maxValue;
    if (ratio > 0.5) {
      this.hpBar.setFillStyle(0x44cc44); // Green
    } else if (ratio > 0.25) {
      this.hpBar.setFillStyle(0xcccc44); // Yellow
    } else {
      this.hpBar.setFillStyle(0xcc4444); // Red
    }
  }

  _updateDisplay() {
    this.hpText.setText(`${this.displayValue} / ${this.maxValue}`);
    if (!this.barColor) this._updateBarColor();
  }

  destroy() {
    this.bgBar?.destroy();
    this.dmgBar?.destroy();
    this.hpBar?.destroy();
    this.hpText?.destroy();
  }
}

export class BattleHUDManager {
  constructor(scene) {
    this.scene = scene;
    this.playerHP = null;
    this.playerMP = null;
    this.enemyHP = null;
    this.playerNameText = null;
    this.enemyNameText = null;
  }

  create() {
    const { width } = this.scene.cameras.main;
    const battleState = store.getState().battle;

    // Player HUD (right side)
    const playerX = width - 280;
    const playerY = 30;

    this.playerNameText = this.scene.add
      .text(playerX, playerY - 15, 'Player', {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '12px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setScrollFactor(0)
      .setDepth(9993);

    this.playerHP = new HPBar(this.scene, playerX, playerY + 8, 240, 14, {
      maxValue: battleState.playerMaxHP,
    });

    this.playerMP = new HPBar(this.scene, playerX, playerY + 28, 240, 10, {
      maxValue: battleState.playerMaxMP,
      barColor: 0x4488ff, // Blue for MP
    });

    // Enemy HUD (left side)
    const enemyX = 40;
    const enemyY = 30;
    const enemyName = battleState.enemyData?.nameArabic || battleState.enemyData?.name || 'Enemy';

    this.enemyNameText = this.scene.add
      .text(enemyX, enemyY - 15, enemyName, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '12px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        direction: 'rtl',
      })
      .setScrollFactor(0)
      .setDepth(9993);

    this.enemyHP = new HPBar(this.scene, enemyX, enemyY + 8, 240, 14, {
      maxValue: battleState.maxBossHP,
    });
  }

  setPlayerHP(value) {
    this.playerHP?.setValue(value, true);
  }

  setPlayerMP(value) {
    this.playerMP?.setValue(value);
  }

  setEnemyHP(value) {
    this.enemyHP?.setValue(value, true);
  }

  update() {
    // HP/MP bars self-animate via tweens; no per-frame logic needed
  }

  destroy() {
    this.playerHP?.destroy();
    this.playerMP?.destroy();
    this.enemyHP?.destroy();
    this.playerNameText?.destroy();
    this.enemyNameText?.destroy();
  }
}
