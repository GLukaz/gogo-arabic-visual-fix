/**
 * NineSlice — Thin utility wrapper around Phaser's built-in NineSlice game object.
 *
 * Phaser 3.60+ includes a native NineSlice that splits a source texture into
 * 9 regions (4 corners, 4 edges, 1 center) and stretches edges/center to fill
 * any target size without distorting corners. This wrapper adds convenience
 * defaults for pixel art panels used throughout the game.
 *
 * Usage:
 *   import { createNineSlice } from './NineSlice.js';
 *
 *   const bg = createNineSlice(scene, {
 *     x: 100, y: 100,
 *     width: 320, height: 180,
 *     texture: 'panel-dark',
 *     cornerSize: 6,
 *   });
 *   bg.setOrigin(0);               // top-left anchor
 *   bg.setSize(400, 200);          // resize dynamically
 *   bg.destroy();
 */

/**
 * Create a Phaser NineSlice game object with pixel-art-friendly defaults.
 *
 * @param {Phaser.Scene} scene  - The scene to create the object in.
 * @param {object}       opts   - Configuration options.
 * @param {number}       opts.x            - World x position (default 0).
 * @param {number}       opts.y            - World y position (default 0).
 * @param {number}       opts.width        - Target width in pixels (default 256).
 * @param {number}       opts.height       - Target height in pixels (default 256).
 * @param {string}       opts.texture      - Texture key (default 'panel-dark').
 * @param {string|number} [opts.frame]     - Optional frame within the texture.
 * @param {number}       opts.cornerSize   - Corner cut size in source pixels (default 6).
 * @param {number}       [opts.leftWidth]  - Override left column size.
 * @param {number}       [opts.rightWidth] - Override right column size.
 * @param {number}       [opts.topHeight]  - Override top row size.
 * @param {number}       [opts.bottomHeight] - Override bottom row size.
 * @param {number}       [opts.originX]    - Origin X (default 0).
 * @param {number}       [opts.originY]    - Origin Y (default 0).
 * @returns {Phaser.GameObjects.NineSlice}
 */
export function createNineSlice(scene, opts = {}) {
  const {
    x = 0,
    y = 0,
    width = 256,
    height = 256,
    texture = 'panel-dark',
    frame = undefined,
    cornerSize = 6,
    leftWidth,
    rightWidth,
    topHeight,
    bottomHeight,
    originX = 0,
    originY = 0,
  } = opts;

  const lw = leftWidth ?? cornerSize;
  const rw = rightWidth ?? cornerSize;
  const th = topHeight ?? cornerSize;
  const bh = bottomHeight ?? cornerSize;

  const ns = scene.add.nineslice(
    Math.round(x),
    Math.round(y),
    texture,
    frame,
    Math.round(width),
    Math.round(height),
    lw,
    rw,
    th,
    bh,
  );

  ns.setOrigin(originX, originY);

  return ns;
}

/**
 * Panel texture presets — maps human-readable panel names to the generated
 * texture keys and their source corner sizes. Used by UIPanel and PanelFactory.
 */
export const PANEL_PRESETS = Object.freeze({
  dark:      { texture: 'panel-dark',            cornerSize: 6 },
  parchment: { texture: 'panel-parchment',       cornerSize: 6 },
  red:       { texture: 'panel-red',             cornerSize: 6 },
  tooltip:   { texture: 'panel-tooltip',         cornerSize: 4 },
  kenmi:     { texture: 'kenmi-ui-ui-ui-frames', cornerSize: 6 },
});
