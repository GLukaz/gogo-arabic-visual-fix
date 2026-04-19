/**
 * BattleArena.js — Battle background and stage layout.
 *
 * Zone-specific arena backgrounds with fallback gradient.
 * Ground plane provides visual positioning reference for combatants.
 */

const ARENA_BACKGROUNDS = {
  oasis_village: 'bg-battle-oasis',
  ancient_library: 'bg-battle-library',
  desert_marketplace: 'bg-battle-market',
  coastal_port: 'bg-battle-coast',
  royal_palace: 'bg-battle-palace',
  garden_district: 'bg-battle-garden',
  mountain_pass: 'bg-battle-mountain',
  desert_ruins: 'bg-battle-desert',
};

export class BattleArena {
  constructor(scene, zone) {
    this.scene = scene;
    this.zone = zone;
    this.bg = null;
    this.ground = null;
  }

  create() {
    const { width, height } = this.scene.cameras.main;
    const bgKey = ARENA_BACKGROUNDS[this.zone] || 'bg-battle-desert';

    // Full-screen background
    if (this.scene.textures.exists(bgKey)) {
      this.bg = this.scene.add.image(width / 2, height / 2, bgKey)
        .setScrollFactor(0)
        .setDepth(0);
    } else {
      // Fallback: dark gradient rectangle
      this.bg = this.scene.add
        .rectangle(width / 2, height / 2, width, height, 0x1a1a2e)
        .setScrollFactor(0)
        .setDepth(0);
    }

    // Ground plane (semi-transparent for depth reference)
    this.ground = this.scene.add
      .rectangle(width / 2, height * 0.7, width, height * 0.4, 0x2a1a0e, 0.3)
      .setScrollFactor(0)
      .setDepth(1);
  }

  destroy() {
    this.bg?.destroy();
    this.ground?.destroy();
    this.bg = null;
    this.ground = null;
  }
}
