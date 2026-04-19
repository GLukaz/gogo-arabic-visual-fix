/**
 * BattleDamagePool.js — Object pool for floating damage numbers.
 *
 * Pre-allocates text objects to avoid GC pressure during multi-hit combos.
 * Numbers float upward with fade-out tween. Color-coded by damage type.
 * Respects prefers-reduced-motion.
 */

const POOL_SIZE = 20;
const FLOAT_DURATION = 800;
const FLOAT_DISTANCE = 60;

const COLORS = {
  damage: '#FF4444',
  heal: '#44FF44',
  critical: '#FFD700',
  miss: '#888888',
  status: '#44AAFF',
};

const FONT_SIZES = {
  damage: '18px',
  heal: '16px',
  critical: '24px',
  miss: '14px',
  status: '14px',
};

export class BattleDamagePool {
  constructor(scene) {
    this.scene = scene;
    this.pool = [];
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pre-allocate text objects
    for (let i = 0; i < POOL_SIZE; i++) {
      const text = scene.add
        .text(0, 0, '', {
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '18px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setDepth(10000)
        .setVisible(false)
        .setScrollFactor(0);

      this.pool.push({ text, active: false });
    }
  }

  /**
   * Show a floating damage number at the given position.
   * @param {number} x - Screen X
   * @param {number} y - Screen Y
   * @param {number|string} value - Damage value or label ("MISS", "CRITICAL")
   * @param {'damage'|'heal'|'critical'|'miss'|'status'} type
   */
  show(x, y, value, type = 'damage') {
    const entry = this.pool.find((e) => !e.active);
    if (!entry) return; // Pool exhausted

    entry.active = true;
    entry.text
      .setPosition(x, y)
      .setText(String(value))
      .setColor(COLORS[type] || '#ffffff')
      .setFontSize(FONT_SIZES[type] || '18px')
      .setVisible(true)
      .setAlpha(1)
      .setScale(type === 'critical' ? 1.2 : 1);

    if (this.reduceMotion) {
      this.scene.time.delayedCall(600, () => {
        entry.text.setVisible(false);
        entry.active = false;
      });
      return;
    }

    // Critical hit: pop scale effect
    if (type === 'critical') {
      this.scene.tweens.add({
        targets: entry.text,
        scale: 1.6,
        duration: 100,
        yoyo: true,
        ease: 'Back.easeOut',
      });
    }

    // Float upward and fade out
    this.scene.tweens.add({
      targets: entry.text,
      y: y - FLOAT_DISTANCE,
      alpha: 0,
      duration: FLOAT_DURATION,
      ease: 'Power2',
      onComplete: () => {
        entry.text.setVisible(false);
        entry.active = false;
      },
    });
  }

  update() {
    // Pool is self-managing via tweens
  }

  destroy() {
    this.pool.forEach((entry) => entry.text?.destroy());
    this.pool = [];
  }
}
