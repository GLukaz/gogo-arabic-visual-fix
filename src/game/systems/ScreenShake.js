// ============================================================
// SCREEN SHAKE SYSTEM
// Triggers camera shake at preset intensities via EventBus.
// Respects prefers-reduced-motion for accessibility.
// ============================================================

const INTENSITY_MAP = {
  light: { duration: 100, intensity: 0.003 },   // quiz correct answer
  medium: { duration: 200, intensity: 0.008 },   // achievement unlock
  heavy: { duration: 350, intensity: 0.015 },    // level up
  // Battle intensities (v6.0)
  hit: { duration: 120, intensity: 0.005 },      // normal attack landing
  critical: { duration: 250, intensity: 0.012 }, // critical hit
  spell: { duration: 300, intensity: 0.010 },    // spell impact
  boss: { duration: 400, intensity: 0.018 },     // boss special attack
};

export default class ScreenShake {
  constructor(scene) {
    this.scene = scene;
    this.reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Trigger a camera shake.
   * @param {'light'|'medium'|'heavy'} intensity - Preset intensity level
   */
  shake(intensity = 'medium') {
    if (this.reduceMotion) return;

    const preset = INTENSITY_MAP[intensity] || INTENSITY_MAP.medium;
    this.scene.cameras.main.shake(preset.duration, preset.intensity);
  }
}
