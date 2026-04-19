// ============================================================
// PARTICLE EFFECT MANAGER
// One-shot bursts and continuous sparkle effects via Phaser 3.60+ API.
// Respects prefers-reduced-motion for accessibility.
// ============================================================

const PARTICLE_TEXTURE_KEY = 'particle-dot';

export default class ParticleEffectManager {
  constructor(scene) {
    this.scene = scene;
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pendingTimers = [];
  }

  // -----------------------------------------------------------
  // Lazy texture creation (4x4 white square)
  // -----------------------------------------------------------
  ensureTexture() {
    if (this.scene.textures.exists(PARTICLE_TEXTURE_KEY)) return;

    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 4, 4);
    gfx.generateTexture(PARTICLE_TEXTURE_KEY, 4, 4);
    gfx.destroy();
  }

  // -----------------------------------------------------------
  // One-shot particle burst
  // -----------------------------------------------------------
  /**
   * @param {number} x - World X position
   * @param {number} y - World Y position
   * @param {object} config - Override defaults
   */
  burst(x, y, config = {}) {
    if (this.reduceMotion) return;
    this.ensureTexture();

    const count = config.count ?? 20;
    const lifespan = config.lifespan ?? 800;

    const emitter = this.scene.add.particles(x, y, PARTICLE_TEXTURE_KEY, {
      speed: config.speed ?? { min: 50, max: 150 },
      lifespan,
      scale: config.scale ?? { start: 1, end: 0 },
      tint: config.tint ?? 0xe2b659,
      gravityY: config.gravityY ?? 100,
      emitting: false,
    });

    emitter.explode(count);

    // Auto-destroy after particles expire
    const timer = this.scene.time.delayedCall(lifespan + 200, () => {
      emitter.destroy();
      this.removeTimer(timer);
    });
    this.pendingTimers.push(timer);
  }

  // -----------------------------------------------------------
  // Continuous sparkle effect (lasts `duration` ms)
  // -----------------------------------------------------------
  /**
   * @param {number} x - World X position
   * @param {number} y - World Y position
   * @param {object} config - Override defaults
   */
  continuous(x, y, config = {}) {
    if (this.reduceMotion) return;
    this.ensureTexture();

    const duration = config.duration ?? 2000;
    const lifespan = config.lifespan ?? 600;

    const emitter = this.scene.add.particles(x, y, PARTICLE_TEXTURE_KEY, {
      frequency: config.frequency ?? 80,
      speed: config.speed ?? { min: 20, max: 60 },
      lifespan,
      scale: config.scale ?? { start: 0.8, end: 0 },
      tint: config.tint ?? 0xe2b659,
      quantity: config.quantity ?? 2,
      duration,
      emitting: true,
    });

    // Destroy after duration + particle lifespan + buffer
    const timer = this.scene.time.delayedCall(duration + lifespan + 200, () => {
      emitter.destroy();
      this.removeTimer(timer);
    });
    this.pendingTimers.push(timer);
  }

  // -----------------------------------------------------------
  // Cleanup
  // -----------------------------------------------------------
  removeTimer(timer) {
    const idx = this.pendingTimers.indexOf(timer);
    if (idx !== -1) this.pendingTimers.splice(idx, 1);
  }

  destroy() {
    for (const timer of this.pendingTimers) {
      if (timer && timer.remove) {
        timer.remove(false);
      }
    }
    this.pendingTimers = [];
  }
}
