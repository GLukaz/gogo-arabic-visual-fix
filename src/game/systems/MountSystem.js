/**
 * MountSystem — Handles rideable mounts (camel, horse, etc.).
 * Stub implementation — full mount mechanics is a future phase.
 */
export class MountSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMount = null;
    this.mounted = false;
  }

  /**
   * Mount a creature.
   * @param {string} mountType - e.g. 'camel', 'horse'
   */
  mount(mountType) {
    if (this.mounted) return;
    this.currentMount = mountType;
    this.mounted = true;
  }

  /**
   * Dismount.
   */
  dismount() {
    this.currentMount = null;
    this.mounted = false;
  }

  /**
   * Update per frame (no-op stub).
   */
  update() {
    // Future: handle mount movement speed, animations
  }

  destroy() {
    this.currentMount = null;
    this.mounted = false;
    this.scene = null;
  }
}
