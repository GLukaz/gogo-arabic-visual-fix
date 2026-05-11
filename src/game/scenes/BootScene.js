import Phaser from 'phaser';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { KENMI_CATALOG } from '../../data/kenmiCatalog.js';
import { SHARED_ASSETS } from '../../data/zoneAssetManifests.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // --- Preload PixelAE Arabic font for Phaser Canvas text ---
    const pixelAERegular = new FontFace(
      'PixelAE',
      "url('/assets/fonts/PixelAE-Regular.ttf')"
    );
    const pixelAEBold = new FontFace(
      'PixelAE',
      "url('/assets/fonts/PixelAE-Bold.ttf')",
      { weight: 'bold' }
    );
    Promise.all([pixelAERegular.load(), pixelAEBold.load()])
      .then((fonts) => {
        fonts.forEach((f) => document.fonts.add(f));
      })
      .catch((err) => {
        console.warn('[BootScene] PixelAE font failed to load:', err);
      });

    const { width, height } = this.cameras.main;

    // --- Loading bar background ---
    const barW = 400;
    const barH = 20;
    const barX = (width - barW) / 2;
    const barY = height / 2;

    const bg = this.add.rectangle(width / 2, barY, barW + 4, barH + 4, 0x3a373b);
    const fill = this.add
      .rectangle(barX + 2, barY, 0, barH, 0xd4a843)
      .setOrigin(0, 0.5);

    const loadingText = this.add
      .text(width / 2, barY - 40, 'Loading...', {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '14px',
        color: '#f4fefa',
      })
      .setOrigin(0.5);

    const arabicText = this.add
      .text(width / 2, barY - 65, '\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...', {
        fontFamily: "'Amiri', 'Arial', serif",
        fontSize: '18px',
        color: '#D4A843',
      })
      .setOrigin(0.5);

    this.load.on('progress', (p) => {
      fill.width = barW * p;
    });

    this.load.on('complete', () => {
      bg.destroy();
      fill.destroy();
      loadingText.destroy();
      arabicText.destroy();
    });

    // =========================================================
    // SHARED ASSETS — loaded from manifest (tilesets, player, NPCs, UI, BG)
    // Zone-specific assets (desert Kenmi tilesets) are deferred to zone
    // transition via loadZoneAssets() in ZoneTransition.js.
    // =========================================================
    // Old placeholder object sprites (palm, house-*, rock*, ruin-*, green-tree*, ice-tree)
    // have been fully replaced by Kenmi keys in zone data and InteractableManager.
    // Audio is handled entirely by Howler.js (AudioManager singleton) -- no Phaser audio loading.
    for (const asset of SHARED_ASSETS) {
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, asset.path, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
      } else {
        this.load.image(asset.key, asset.path);
      }
    }

    // =========================================================
    // TILED MAP JSON FILES
    // =========================================================
    // Add Tiled JSON maps here as zones are built in Tiled Map Editor.
    // Convention: key = "map-{zone-id-with-hyphens}", path = "/assets/maps/{zone}.json"
    // Example: this.load.tilemapTiledJSON('map-oasis-village', '/assets/maps/oasis-village.json');
    this.load.tilemapTiledJSON('map-test-map', '/assets/maps/test-map.json');

    // =========================================================
    // KENMI CUTE FANTASY ASSETS — loaded from catalog
    // =========================================================
    // Register error handler once (fires per failed asset)
    this.load.on('loaderror', (file) => {
      console.warn(`[BootScene] Failed to load asset: ${file.key} @ ${file.url}`);
    });

    for (const entry of KENMI_CATALOG) {
      if (entry.type === 'spritesheet') {
        this.load.spritesheet(entry.key, entry.path, {
          frameWidth: entry.frameWidth,
          frameHeight: entry.frameHeight,
        });
      } else {
        this.load.image(entry.key, entry.path);
      }
    }
  }

  create() {
    // Generate pixel art panel textures for NineSlice use
    this._generatePanelTextures();

    this.scene.start('WorldScene');
    EventBus.emit(EVENTS.SCENE_READY);
  }

  // ===========================================================
  // Panel texture generation
  // ===========================================================

  /**
   * Generate small pixel art panel textures at runtime using Phaser Graphics.
   * These are used as NineSlice sources — corners stay fixed, edges/center stretch.
   */
  _generatePanelTextures() {
    // Dark panel with gold border (dialogues, menus)
    this._makePanel('panel-dark', 48, 48, {
      bg: 0x1a1a2e, bgAlpha: 0.95,
      border: 0xd4a843, borderWidth: 3, cornerSize: 6,
    });

    // Parchment panel (inventory, quest journal)
    this._makePanel('panel-parchment', 48, 48, {
      bg: 0x3d2b1f, bgAlpha: 0.95,
      border: 0x8b6914, borderWidth: 3, cornerSize: 6,
    });

    // Red accent panel (battle, warnings)
    this._makePanel('panel-red', 48, 48, {
      bg: 0x2e1a1a, bgAlpha: 0.95,
      border: 0xe63946, borderWidth: 3, cornerSize: 6,
    });

    // Tooltip (small, muted)
    this._makePanel('panel-tooltip', 32, 32, {
      bg: 0x2a2a3e, bgAlpha: 0.92,
      border: 0x666680, borderWidth: 2, cornerSize: 4,
    });
  }

  /**
   * Draw a single pixel art panel texture and register it in Phaser's texture manager.
   *
   * Layout for a 48x48 source with borderWidth=3, cornerSize=6:
   *   - Outer border stroke (3px wide)
   *   - Brighter corner accents at each corner (6px along each edge)
   *   - Solid fill interior
   *
   * @param {string} key  - Texture key to register.
   * @param {number} w    - Source texture width.
   * @param {number} h    - Source texture height.
   * @param {object} opts - Drawing options.
   */
  _makePanel(key, w, h, opts) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    const bw = opts.borderWidth;
    const halfBw = Math.floor(bw / 2);

    // Background fill (inset by border width)
    g.fillStyle(opts.bg, opts.bgAlpha ?? 1);
    g.fillRect(bw, bw, w - bw * 2, h - bw * 2);

    // Border stroke
    g.lineStyle(bw, opts.border, 1);
    g.strokeRect(halfBw, halfBw, w - bw, h - bw);

    // Corner accents — small bright marks at each corner for pixel art style
    const cs = opts.cornerSize;
    g.fillStyle(opts.border, 1);

    // Top-left corner
    g.fillRect(0, 0, cs, bw);
    g.fillRect(0, 0, bw, cs);

    // Top-right corner
    g.fillRect(w - cs, 0, cs, bw);
    g.fillRect(w - bw, 0, bw, cs);

    // Bottom-left corner
    g.fillRect(0, h - bw, cs, bw);
    g.fillRect(0, h - cs, bw, cs);

    // Bottom-right corner
    g.fillRect(w - cs, h - bw, cs, bw);
    g.fillRect(w - bw, h - cs, bw, cs);

    g.generateTexture(key, w, h);
    g.destroy();
  }
}
