import Phaser from 'phaser';
import { createNineSlice, PANEL_PRESETS } from './NineSlice.js';

/**
 * UIPanel — High-level wrapper for creating scalable pixel art panels in Phaser.
 *
 * Extends Phaser.GameObjects.Container so child elements (text, icons, etc.)
 * can be added relative to the panel's local origin. The background is a
 * NineSlice that stretches without distorting corners.
 *
 * Usage:
 *   const panel = new UIPanel(scene, 50, 400, 600, 160, { preset: 'dark' });
 *   const label = panel.addText('Ahlan!', { color: '#D4A843' });
 *   panel.resize(700, 200);
 *   panel.destroy();
 */
export class UIPanel extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene   - Owning scene.
   * @param {number}       x       - World x (top-left when origin is 0,0).
   * @param {number}       y       - World y.
   * @param {number}       width   - Initial width in pixels.
   * @param {number}       height  - Initial height in pixels.
   * @param {object}       [options]
   * @param {string}       [options.preset='dark']   - Key from PANEL_PRESETS.
   * @param {string}       [options.texture]         - Direct texture key (overrides preset).
   * @param {number}       [options.cornerSize]      - Corner size override.
   * @param {number}       [options.padding=12]      - Default inner padding for addText().
   * @param {number}       [options.depth]           - Display depth.
   * @param {boolean}      [options.scrollFactor]    - If 0, panel stays fixed to camera.
   */
  constructor(scene, x, y, width, height, options = {}) {
    super(scene, Math.round(x), Math.round(y));

    const preset = PANEL_PRESETS[options.preset || 'dark'] || PANEL_PRESETS.dark;
    const texture = options.texture || preset.texture;
    const cornerSize = options.cornerSize ?? preset.cornerSize;

    this._panelWidth = Math.round(width);
    this._panelHeight = Math.round(height);
    this._padding = options.padding ?? 12;

    // Create NineSlice background as a child (position 0,0 relative to container)
    this.bg = createNineSlice(scene, {
      x: 0,
      y: 0,
      width: this._panelWidth,
      height: this._panelHeight,
      texture,
      cornerSize,
      originX: 0,
      originY: 0,
    });

    // Remove from scene display list — it lives inside this container
    scene.children.remove(this.bg);
    this.add(this.bg);

    if (options.depth !== undefined) {
      this.setDepth(options.depth);
    }

    if (options.scrollFactor !== undefined) {
      this.setScrollFactor(options.scrollFactor);
    }

    scene.add.existing(this);
  }

  /** Current panel width. */
  get panelWidth() {
    return this._panelWidth;
  }

  /** Current panel height. */
  get panelHeight() {
    return this._panelHeight;
  }

  /**
   * Resize the panel background. Child elements are NOT repositioned.
   * @param {number} width
   * @param {number} height
   * @returns {this}
   */
  resize(width, height) {
    this._panelWidth = Math.round(width);
    this._panelHeight = Math.round(height);
    this.bg.setSize(this._panelWidth, this._panelHeight);
    return this;
  }

  /**
   * Add a text element inside the panel. Positioned relative to the
   * top-left corner with default padding.
   *
   * @param {string}  text     - The display string.
   * @param {object}  [style]  - Phaser TextStyle overrides.
   * @param {number}  [padding] - Override default padding.
   * @returns {Phaser.GameObjects.Text}
   */
  addText(text, style = {}, padding) {
    const pad = padding ?? this._padding;

    const t = this.scene.add.text(
      Math.round(pad),
      Math.round(pad),
      text,
      {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '12px',
        color: '#f4fefa',
        wordWrap: { width: this._panelWidth - pad * 2 },
        resolution: 2,
        ...style,
      },
    );

    // Remove from scene display list — it lives inside this container
    this.scene.children.remove(t);
    this.add(t);

    return t;
  }

  /**
   * Add Arabic text with appropriate RTL-friendly font.
   *
   * @param {string}  text     - Arabic string.
   * @param {object}  [style]  - Phaser TextStyle overrides.
   * @param {number}  [padding] - Override default padding.
   * @returns {Phaser.GameObjects.Text}
   */
  addArabicText(text, style = {}, padding) {
    return this.addText(text, {
      fontFamily: "'Amiri', 'Noto Naskh Arabic', serif",
      fontSize: '18px',
      color: '#D4A843',
      direction: 'rtl',
      ...style,
    }, padding);
  }

  /**
   * Show the panel (set visible + active).
   * @returns {this}
   */
  show() {
    this.setVisible(true);
    this.setActive(true);
    return this;
  }

  /**
   * Hide the panel (set invisible + inactive).
   * @returns {this}
   */
  hide() {
    this.setVisible(false);
    this.setActive(false);
    return this;
  }

  /**
   * Fade in the panel over the given duration.
   * @param {number} [duration=200] - Milliseconds.
   * @returns {this}
   */
  fadeIn(duration = 200) {
    this.setAlpha(0);
    this.show();
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration,
      ease: 'Power2',
    });
    return this;
  }

  /**
   * Fade out the panel, then hide it.
   * @param {number} [duration=200] - Milliseconds.
   * @returns {this}
   */
  fadeOut(duration = 200) {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration,
      ease: 'Power2',
      onComplete: () => this.hide(),
    });
    return this;
  }
}
