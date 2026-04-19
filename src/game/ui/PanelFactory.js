import { UIPanel } from './UIPanel.js';

/**
 * PanelFactory — Static methods that create pre-configured UIPanel instances
 * for common game UI elements (dialogue boxes, menus, tooltips, etc.).
 *
 * All panels use runtime-generated NineSlice textures so no external
 * spritesheet extraction is required.
 *
 * Usage:
 *   import { PanelFactory } from './PanelFactory.js';
 *   const dlg = PanelFactory.createDialoguePanel(scene, 40, 480, 700, 160);
 *   dlg.addText('Welcome to the Medina!');
 *   dlg.addArabicText('\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A \u0627\u0644\u0645\u062F\u064A\u0646\u0629!');
 */
export class PanelFactory {
  /**
   * Dialogue panel — dark background with gold border.
   * Used for NPC conversations, story narration, tutorials.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts] - Additional UIPanel options.
   * @returns {UIPanel}
   */
  static createDialoguePanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'dark',
      depth: 1000,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Menu panel — dark background with gold border, same as dialogue
   * but without fixed-to-camera by default.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createMenuPanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'dark',
      depth: 900,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Parchment panel — warm brown/gold theme.
   * Used for inventory, quest journal, shop interfaces.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createParchmentPanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'parchment',
      depth: 950,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Red accent panel — dark background with red border.
   * Used for battle UI, warnings, health-related displays.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createBattlePanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'red',
      depth: 1000,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Tooltip panel — small, muted, non-intrusive.
   * Used for item hover info, brief hints.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createTooltipPanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'tooltip',
      padding: 8,
      depth: 1100,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Full-screen overlay panel — covers the entire game viewport.
   * Used for pause screens, modal dialogues, loading overlays.
   *
   * @param {Phaser.Scene} scene
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createOverlayPanel(scene, extraOpts = {}) {
    const { width, height } = scene.cameras.main;
    return new UIPanel(scene, 0, 0, width, height, {
      preset: 'dark',
      depth: 2000,
      scrollFactor: 0,
      padding: 24,
      ...extraOpts,
    });
  }

  /**
   * Kenmi sign panel — warm orange Kenmi UI frame art.
   * Used for sign popups, simple in-game text displays.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createKenmiPanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'kenmi',
      depth: 10000,
      scrollFactor: 0,
      ...extraOpts,
    });
  }

  /**
   * Kenmi tooltip panel — smaller Kenmi UI frame for hover info.
   *
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {object} [extraOpts]
   * @returns {UIPanel}
   */
  static createKenmiTooltipPanel(scene, x, y, width, height, extraOpts = {}) {
    return new UIPanel(scene, x, y, width, height, {
      preset: 'kenmi',
      padding: 8,
      depth: 10100,
      scrollFactor: 0,
      ...extraOpts,
    });
  }
}

// ==========================================================================
// UI-07 COMPLIANCE NOTE (Phase 42):
// React overlays (HUD bar, main menu, settings, profile, wardrobe, quest log,
// shop, complex NPC dialogue with choices/portraits) remain as React components.
// Only in-game elements (signs, basic objects, NPC labels) have moved to Phaser.
// See: src/components/Router/GameLayout.jsx for the React overlay render tree.
// ==========================================================================
