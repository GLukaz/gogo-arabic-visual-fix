import { TILE, SAND, GRASS, WATER, ICE_GRASS, STONE, WOOD } from '../../data/zones.js';
import { SPRITE_KEY_MAP, BIOME_DECORATION_SETS, BIOME_ANIMAL_SETS } from '../../data/spriteKeyMap.js';
import { KENMI_FRAME_TABLES } from '../../data/kenmiFrameTables.js';
import { KENMI_CATALOG } from '../../data/kenmiCatalog.js';
import { SHARED_ASSETS } from '../../data/zoneAssetManifests.js';
import ReplaceColorPipeline from './ReplaceColorPipeline.js';

// Lazy key→original-path lookup built from the asset manifests.
// Used by the ?autotileDebug=1 tooltip so the displayed filename is the
// authored source PNG, not a Vite-rewritten/hashed runtime URL.
let _ASSET_KEY_TO_PATH = null;
function getAssetKeyToPath() {
  if (_ASSET_KEY_TO_PATH) return _ASSET_KEY_TO_PATH;
  _ASSET_KEY_TO_PATH = new Map();
  for (const entry of KENMI_CATALOG) _ASSET_KEY_TO_PATH.set(entry.key, entry.path);
  for (const entry of SHARED_ASSETS) _ASSET_KEY_TO_PATH.set(entry.key, entry.path);
  return _ASSET_KEY_TO_PATH;
}

// ================================================================
// Kenmi 16x16 desert tileset keys & frame maps
// ================================================================

/**
 * Phase 97 Plan 04 — Frame table drift detector.
 * Asserts that KENMI_FRAME_TABLES agrees with the hardcoded BEACH/GRASS_F/WATER_F
 * dimensions below. If a future Kenmi artist re-exports a tile PNG at different
 * dimensions, regenerating kenmiFrameTables.js and re-running the game will throw
 * here immediately — no more silent black squares from frame-index drift.
 */
function _assertFrameTableMatch(key, expectedCols, expectedRows) {
  const table = KENMI_FRAME_TABLES[key];
  if (!table) {
    if (typeof console !== 'undefined') {
      console.warn(`[MapLoader] No frame table for ${key}; regenerate with: npm run generate:kenmi-frame-tables`);
    }
    return;
  }
  if (table.cols !== expectedCols || table.rows !== expectedRows) {
    throw new Error(
      `[MapLoader] Frame table mismatch for ${key}: hardcoded expects ${expectedCols}x${expectedRows}, PNG is ${table.cols}x${table.rows}. Update MapLoader constants OR regenerate frame tables.`,
    );
  }
}

// Sand ground tilesets (3 color variants, same layout: 5 cols x 3 rows = 15 frames)
const BEACH_KEYS = [
  'kenmi-desert-tiles-desert-beach-tiles-1',
  'kenmi-desert-tiles-desert-beach-tiles-2',
  'kenmi-desert-tiles-desert-beach-tiles-3',
];
const BEACH_COLS = 5;

// Beach tileset frame indices (per-sheet)
const BEACH = {
  // Sand-water border edges (sand with water cutout)
  CORNER_TL: 0,                       // (0,0) top-left corner
  EDGE_TOP:  1,                     
  CORNER_TR: 2,                     
  SAND_SOLID: BEACH_COLS + 1,         
  WATER_POOL: BEACH_COLS * 2 + 3,       

  EDGE_LEFT:   BEACH_COLS + 0,      
  WATER_CENTER: BEACH_COLS * 2 + 3,   
  EDGE_RIGHT:  BEACH_COLS + 2,      
  SAND_VAR_1:  BEACH_COLS + 1,      
  WATER_VAR:   BEACH_COLS * 2 + 3,    

  CORNER_BL:   BEACH_COLS * 2 + 0,  
  EDGE_BOTTOM: BEACH_COLS * 2 + 1,  
  CORNER_BR:   BEACH_COLS * 2 + 2,  
  SAND_VAR_2:  BEACH_COLS + 1,   
  WATER_INNER: BEACH_COLS * 2 + 3,  
};

const GRASS_KEY = 'kenmi-base-tiles-grass-grass-tiles-3';
const GRASS_COLS = 16;

const GRASS_F = {
  CORNER_TL: GRASS_COLS *5,
  EDGE_TOP:  GRASS_COLS * 5 + 1,
  CORNER_TR: GRASS_COLS * 5 + 2,
  EDGE_LEFT:  GRASS_COLS * 6,
  SOLID:      GRASS_COLS * 9 + 5,
  EDGE_RIGHT: GRASS_COLS * 6 + 2,
  CORNER_BL:  GRASS_COLS * 7 ,
  EDGE_BOTTOM: GRASS_COLS * 7 + 1,
  CORNER_BR:  GRASS_COLS * 7 + 2,
  // Inner (concave) corners — rows 8-9, cols 0-1
  INNER_TL: GRASS_COLS * 9 + 1,
  INNER_TR: GRASS_COLS * 9 + 0,
  INNER_BL: GRASS_COLS * 8 + 1,
  INNER_BR: GRASS_COLS * 8 + 0,
  // Variants in rows 3-4
  VAR_1: GRASS_COLS * 9 + 6,
  VAR_2: GRASS_COLS * 9 + 7,
  VAR_3: GRASS_COLS * 9 + 5,
  VAR_4: GRASS_COLS * 9 + 6,
  VAR_5: GRASS_COLS * 9 + 7,
  VAR_6: GRASS_COLS * 9 + 5,
};

// Water tileset animated (24 cols x 5 rows = 120 frames)
const WATER_KEY = 'kenmi-base-tiles-water-water-tile-3-anim';
const WATER_COLS = 24;

// Animated water tileset frame indices (stride=3 per row)
const WATER_F = {
  // Row 0: CORNER_TL, EDGE_TOP, CORNER_TR (frames 0-23)
  CORNER_TL: 0,
  EDGE_TOP:  1,
  CORNER_TR: 2,
  SOLID_1:   25,
  SOLID_2:   25,
  SOLID_3:   25,
  // Row 1: EDGE_LEFT, SOLID, EDGE_RIGHT (frames 24-47)
  EDGE_LEFT:   24,
  SOLID_4:     25,
  EDGE_RIGHT:  26,
  SOLID_5:     25,
  SOLID_6:     25,
  SOLID_7:     25,
  // Row 2: CORNER_BL, EDGE_BOTTOM, CORNER_BR (frames 48-71)
  CORNER_BL:    48,
  EDGE_BOTTOM:  49,
  CORNER_BR:    50,
  SOLID_8:      25,
  SOLID_9:      25,
  SOLID_10:     25,
  // Row 3-4: Inner corners (frames 72-119)
  INNER_TL: 97,
  INNER_TR: 96,
  INNER_BL: 73,
  INNER_BR: 72,
};

// Phase 97 Plan 04 — drift detection: throw at module load if PNG dimensions
// disagree with the hardcoded constants above. Catches the "black squares" class
// of bug from VISUAL-LAYER-DIAGNOSIS.md the moment it could occur.
for (const k of BEACH_KEYS) _assertFrameTableMatch(k, 5, 3);
_assertFrameTableMatch(GRASS_KEY, 16, 10);
_assertFrameTableMatch(WATER_KEY, 24, 5);

// Water foam animation key (20 cols x 3 rows = 60 frames)
const FOAM_KEY = 'kenmi-desert-tiles-desert-water-foam-animation';
const FOAM_COLS = 20;

const KENMI_SCALE = 4; // 16px tiles -> 64px game tiles

// Crop regions for multi-item prop sheets (each region is one item in the sheet).
// Maps texture key -> array of { x, y, w, h } regions in source pixels 
// Props NOT listed here are single-item or large-object images — rendered at native or scaled size.
const PROP_CROP_REGIONS = {
  'kenmi-desert-props-desert-rocks': [
    { x: 0,   y: 0,  w: 16, h: 16 },
    { x: 16,  y: 0,  w: 16, h: 16 },
    { x: 32,  y: 0,  w: 32, h: 32 },
    { x: 64,  y: 0,  w: 16, h: 16 },
    { x: 80,  y: 0,  w: 16, h: 16 },
    { x: 96,  y: 0,  w: 16, h: 16 },
    { x: 112,   y: 0, w: 32, h: 32 },
    { x: 144,  y: 0, w: 16, h: 16 },
    { x: 160,  y: 0, w: 32, h: 32 },
    { x: 0,   y: 16,  w: 16, h: 16 },
    { x: 16,  y: 16,  w: 16, h: 16 },
    { x: 64,  y: 16,  w: 16, h: 16 },
    { x: 80,  y: 16,  w: 16, h: 16 },
    { x: 96,  y: 16,  w: 16, h: 16 },    
  ],
  'kenmi-desert-props-palm-tree-1': [
    { x: 48,  y: 0, w: 48, h: 60 },
  ],  
  'kenmi-desert-props-palm-tree-2': [
    { x: 32,  y: 0, w: 32, h: 48 },
  ],
  'kenmi-desert-props-acacia-tree':[
    { x: 80,  y: 0, w: 80, h: 62 },
  ],
  'kenmi-desert-props-desert-pots-sacks': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
    { x: 48, y: 0, w: 16, h: 16 },
    { x: 64, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-desert-rugs': [
    { x: 0,  y: 0,  w: 48, h: 32 },
    { x: 48, y: 0,  w: 48, h: 32 },
    { x: 0, y: 32,  w: 48, h: 32 },
    { x: 48,  y: 32, w: 48, h: 32 },
    { x: 0, y: 64, w: 48, h: 32 },
    { x: 48, y: 64, w: 48, h: 32 },
  ],
  'kenmi-desert-props-desert-bones': [
    { x: 0, y: 32,  w: 32, h: 32 },
    { x: 0, y: 64,  w: 32, h: 32 },
    { x: 32,  y: 64, w: 32, h: 32 },
  ],
  'kenmi-desert-props-golden-pots': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-desert-grass-props': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-fallen-palm-leaves': [
    { x: 0,  y: 0,  w: 32, h: 32 },
  ],
  'kenmi-desert-props-fallen-palm-leaves-dead': [
    { x: 0,  y: 0,  w: 32, h: 32 },
  ],
  'kenmi-desert-props-dead-bush': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-cactus': [
    { x: 0,   y: 0,  w: 32, h: 32 },
    { x: 32,   y: 0,  w: 32, h: 32 },
    { x: 64,   y: 0,  w: 32, h: 32 },
    { x: 96,   y: 0,  w: 32, h: 32 },
    { x: 128,   y: 0,  w: 32, h: 32 },
    { x: 0,   y: 32,  w: 32, h: 32 },
    { x: 32,   y: 32,  w: 32, h: 32 },
    { x: 64,   y: 32,  w: 32, h: 32 },
    { x: 96,   y: 32,  w: 32, h: 32 },
    { x: 128,   y: 32,  w: 32, h: 32 },
    { x: 0,   y: 64,  w: 32, h: 32 },
    { x: 32,   y: 64,  w: 32, h: 32 },
    { x: 64,   y: 64,  w: 32, h: 32 },
    { x: 96,   y: 64,  w: 32, h: 32 },
    { x: 128,   y: 64,  w: 32, h: 32 },
    { x: 0,   y: 96,  w: 32, h: 32 },
    { x: 32,   y: 96,  w: 32, h: 32 },
    { x: 64,   y: 96,  w: 32, h: 32 },
    { x: 96,   y: 96,  w: 32, h: 32 },
    { x: 128,   y: 96,  w: 32, h: 32 },
    { x: 0,   y: 128,  w: 32, h: 32 },
    { x: 32,   y: 128,  w: 32, h: 32 },
    { x: 64,   y: 128,  w: 32, h: 32 },
    { x: 96,   y: 128,  w: 32, h: 32 },
    { x: 128,   y: 128,  w: 32, h: 32 },
    { x: 0,   y: 160,  w: 32, h: 32 },
    { x: 32,   y: 160,  w: 32, h: 32 },
    { x: 64,   y: 160,  w: 32, h: 32 },
    { x: 96,   y: 160,  w: 32, h: 32 },
    { x: 128,   y: 160,  w: 32, h: 32 },
    { x: 0,   y: 192,  w: 32, h: 32 },
    { x: 32,   y: 192,  w: 32, h: 32 },
    { x: 64,   y: 192,  w: 32, h: 32 },
    { x: 96,   y: 192,  w: 32, h: 32 },
    { x: 128,   y: 192,  w: 32, h: 32 },
    { x: 0,   y: 224,  w: 32, h: 32 },
    { x: 32,   y: 224,  w: 32, h: 32 },
    { x: 64,   y: 224,  w: 32, h: 32 },
    { x: 96,   y: 224,  w: 32, h: 32 },
    { x: 128,   y: 224,  w: 32, h: 32 },
  ],
  'kenmi-desert-props-sleeping-mat': [
    { x: 0,  y: 0,  w: 32, h: 32 },
  ],
  'kenmi-desert-props-fire-pit': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
    { x: 48, y: 0, w: 16, h: 16 },
    { x: 64, y: 0, w: 16, h: 16 },
    { x: 80, y: 0, w: 16, h: 16 },
    { x: 96, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-desert-campfire': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
    { x: 48, y: 0, w: 16, h: 16 },
    { x: 64, y: 0, w: 16, h: 16 },
    { x: 80, y: 0, w: 16, h: 16 },
  ],
  'kenmi-desert-props-ambarakaman-plant': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
  ],
  'kenmi-base-outdoor-decoration-barrels': [
    { x: 0,  y: 0,  w: 16, h: 32 },
    { x: 16, y: 0,  w: 16, h: 32 },
    { x: 32, y: 0,  w: 16, h: 32 },
    { x: 48, y: 0,  w: 16, h: 32 },
    { x: 64, y: 0,  w: 16, h: 32 },
    { x: 0,  y: 16, w: 16, h: 32 },
    { x: 16, y: 16, w: 16, h: 32 },
    { x: 32, y: 16, w: 16, h: 32 },
    { x: 48, y: 16, w: 16, h: 32 },
    { x: 64, y: 16, w: 16, h: 32 },
    { x: 80, y: 16, w: 16, h: 32 },
  ],
  'kenmi-base-outdoor-decoration-benches': [
    { x: 0,  y: 0,  w: 16, h: 32 },
    { x: 32, y: 0,  w: 16, h: 32 },
  ],
  'kenmi-base-outdoor-decoration-camp-decor': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 16, h: 16 },
    { x: 32, y: 0, w: 16, h: 16 },
    { x: 48, y: 0, w: 16, h: 16 },
    { x: 64, y: 0, w: 16, h: 16 },
  ],
  'kenmi-base-outdoor-decoration-fences': [
    { x: 16, y: 0,  w: 48, h: 16 },
    { x: 0, y: 0,  w: 16, h: 48 },
    { x: 0, y: 48,  w: 16, h: 16 },
  ],
  'kenmi-base-outdoor-decoration-flowers': [
    { x: 0,  y: 0,  w: 16, h: 16 },
    { x: 16, y: 0,  w: 16, h: 16 },
    { x: 32, y: 0,  w: 16, h: 16 },
    { x: 48, y: 0,  w: 16, h: 16 },
    { x: 64, y: 0,  w: 16, h: 16 },
    { x: 0,  y: 16, w: 16, h: 16 },
    { x: 16, y: 16, w: 16, h: 16 },
    { x: 32, y: 16, w: 16, h: 16 },
    { x: 48, y: 16, w: 16, h: 16 },
    { x: 64, y: 16, w: 16, h: 16 },
    { x: 0,  y: 32, w: 16, h: 16 },
    { x: 16, y: 32, w: 16, h: 16 },
    { x: 32, y: 32, w: 16, h: 16 },
    { x: 48, y: 32, w: 16, h: 16 },
    { x: 64, y: 32, w: 16, h: 16 },
    { x: 0,  y: 48, w: 16, h: 16 },
    { x: 16, y: 48, w: 16, h: 16 },
    { x: 32, y: 48, w: 16, h: 16 },
    { x: 48, y: 48, w: 16, h: 16 },
    { x: 64, y: 48, w: 16, h: 16 },
    { x: 0,  y: 64, w: 16, h: 16 },
    { x: 16, y: 64, w: 16, h: 16 },
    { x: 32, y: 64, w: 16, h: 16 },
    { x: 48, y: 64, w: 16, h: 16 },
    { x: 64, y: 64, w: 16, h: 16 },
    { x: 0,  y: 80, w: 16, h: 16 },
    { x: 16, y: 80, w: 16, h: 16 },
    { x: 32, y: 80, w: 16, h: 16 },
    { x: 48, y: 80, w: 16, h: 16 },
    { x: 64, y: 80, w: 16, h: 16 },
    { x: 0,  y: 96, w: 16, h: 16 },
    { x: 16, y: 96, w: 16, h: 16 },
    { x: 32, y: 96, w: 16, h: 16 },
    { x: 48, y: 96, w: 16, h: 16 },
    { x: 64, y: 96, w: 16, h: 16 },
    { x: 0,  y: 112, w: 16, h: 16 },
    { x: 16, y: 112, w: 16, h: 16 },
    { x: 32, y: 112, w: 16, h: 16 },
    { x: 48, y: 112, w: 16, h: 16 },
    { x: 64, y: 112, w: 16, h: 16 },
    { x: 0,  y: 128, w: 16, h: 16 },
    { x: 16, y: 128, w: 16, h: 16 },
    { x: 32, y: 128, w: 16, h: 16 },
    { x: 48, y: 128, w: 16, h: 16 },
    { x: 64, y: 128, w: 16, h: 16 },
    { x: 0,  y: 144, w: 16, h: 16 },
    { x: 16, y: 144, w: 16, h: 16 },
    { x: 32, y: 144, w: 16, h: 16 },
    { x: 48, y: 144, w: 16, h: 16 },
    { x: 64, y: 144, w: 16, h: 16 },
  ],
  'kenmi-base-outdoor-decoration-hay-bales': [
    { x: 0,  y: 0, w: 16, h: 16 },
    { x: 16, y: 0, w: 32, h: 16 },
  ],
  'kenmi-base-outdoor-decoration-outdoor-decor': [
    { x: 0,  y: 0,  w: 16, h: 16 },
    { x: 16, y: 0,  w: 16, h: 16 },
    { x: 32, y: 0,  w: 16, h: 16 },
    { x: 0,  y: 16, w: 16, h: 16 },
    { x: 16, y: 16, w: 16, h: 16 },
    { x: 32, y: 16, w: 16, h: 16 },
    { x: 0,  y: 32, w: 16, h: 16 },
    { x: 16, y: 32, w: 16, h: 16 },
  ],
};

// Biome-to-tileset config table.
// NOTE: snow biome uses kenmi-base-tiles-grass-grass-tiles-1 (IS a spritesheet) with blue tints.
// kenmi-christmas-decorations-christmass-grass is type 'image' (NOT spritesheet) — cannot use frame indices.
const BIOME_TILESETS = {
  desert: {
    sandKeys: [
      'kenmi-desert-tiles-desert-beach-tiles-1',
      'kenmi-desert-tiles-desert-beach-tiles-2',
      'kenmi-desert-tiles-desert-beach-tiles-3',
    ],
    sandCols: 5,
    grassKey: 'kenmi-base-tiles-grass-grass-tiles-3',
    grassCols: 16,
    waterKey: 'kenmi-base-tiles-water-water-tile-3-anim',
    waterCols: 24,
    foamKey: 'kenmi-desert-tiles-desert-water-foam-animation',
    foamCols: 20,
  },
  grass: {
    sandKeys: ['kenmi-base-tiles-grass-grass-tiles-1'],
    sandCols: 16,
    grassKey: 'kenmi-base-tiles-grass-grass-tiles-1',
    grassCols: 16,
    waterKey: 'kenmi-base-tiles-water-water-tile-1',
    waterCols: 3,
    foamKey: 'kenmi-base-tiles-water-water-foam-animation',
    foamCols: 20,
  },
  snow: {
    sandKeys: ['kenmi-base-tiles-grass-grass-tiles-1'],
    sandCols: 16,
    grassKey: 'kenmi-base-tiles-grass-grass-tiles-1',
    grassCols: 16,
    waterKey: 'kenmi-base-tiles-water-water-tile-1',
    waterCols: 3,
    foamKey: 'kenmi-base-tiles-water-water-foam-animation',
    foamCols: 20,
    iceGrassTint: 0xaaddff,
    sandTint: 0xddeeff,
  },
  dungeon: {
    sandKeys: ['kenmi-base-tiles-cave-cave-floor-1'],
    sandCols: 3,  // cave-floor-1.png = 48x80px = 3 cols x 5 rows
    grassKey: 'kenmi-base-tiles-cave-cave-floor-2',
    grassCols: 3, // cave-floor-2.png = 48x80px = 3 cols x 5 rows
    waterKey: 'kenmi-base-tiles-cave-cave-water',
    waterCols: 7, // cave-water.png = 112x80px = 7 cols x 5 rows
    foamKey: 'kenmi-base-tiles-cave-cave-water-animation',
    foamCols: 56, // cave-water-animation.png = 896x80px = 56 cols x 5 rows
  },
  volcano: {
    sandKeys: ['kenmi-volcano-tiles-volcano-tiles'],
    sandCols: 29, // volcano-tiles.png = 464x144px = 29 cols x 9 rows
    grassKey: 'kenmi-volcano-tiles-volcano-tiles',
    grassCols: 29,
    waterKey: 'kenmi-volcano-tiles-volcano-tiles',
    waterCols: 29,
    foamKey: 'kenmi-volcano-tiles-volcano-lava-buble',
    foamCols: 11, // volcano-lava-buble.png = 176x16px = 11 cols x 1 row
  },
  mushroom: {
    sandKeys: ['kenmi-shroom-tiles-shroomlands-grass-green-tiles'],
    sandCols: 11, // shroomlands-grass-green-tiles.png = 176x192px = 11 cols x 12 rows
    grassKey: 'kenmi-shroom-tiles-shroomlands-grass-green-tiles',
    grassCols: 11,
    waterKey: 'kenmi-base-tiles-water-water-tile-1',
    waterCols: 3,
    foamKey: 'kenmi-base-tiles-water-water-foam-animation',
    foamCols: 20,
  },
};

/**
 * Simple deterministic hash for seeded pseudo-random per tile.
 * Returns a float in [0, 1).
 */
function tileHash(x, y, seed) {
  let h = (x * 374761 + y * 668265 + seed * 982451) | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = (h >> 16) ^ h;
  return (h & 0x7fffffff) / 0x7fffffff;
}

/**
 * MapLoader
 * Handles tilemap loading, rendering, collision setup, and visual effects
 */
export class MapLoader {
  constructor(scene) {
    this.scene = scene;
    this.groundSprites = [];
    this.objectSprites = [];
    this.decoSprites = [];
    this.animalSprites = [];
    this.wallGroup = null;
    this.exitTriggers = [];
    this.activeTweens = [];

    // ?autotileDebug=1 — overlay every ground tile with its frame index and texture key
    this._autotileDebug = false;
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      this._autotileDebug = new URLSearchParams(window.location.search).get('autotileDebug') === '1';
    }

    scene.renderer.pipelines.add('ReplaceColor', new ReplaceColorPipeline(scene.game));
  }

  /**
   * When ?autotileDebug=1 is set, make the tile interactive and show a single
   * shared tooltip with frame index + texture key while the mouse hovers it.
   * The shared label is pushed into groundSprites so it gets destroyed on teardown.
   */
  _addTileDebugLabel(sprite, px, py) {
    if (!this._autotileDebug || !sprite) return;

    if (!this._debugHoverLabel) {
      this._debugHoverLabel = this.scene.add.text(0, 0, '', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffff00',
        backgroundColor: 'rgba(0,0,0,0.85)',
        align: 'center',
        padding: { x: 4, y: 2 },
        resolution: 2,
      });
      this._debugHoverLabel.setOrigin(0.5, 1);
      this._debugHoverLabel.setDepth(99999);
      this._debugHoverLabel.setVisible(false);
      this.groundSprites.push(this._debugHoverLabel);
    }

    sprite.setInteractive();
    sprite.on('pointerover', () => {
      const key = (sprite.texture && sprite.texture.key) || '?';
      const frameName = sprite.frame ? String(sprite.frame.name) : '?';
      const file = this._getTextureFilename(sprite.texture);
      const method = sprite._debugMethod || '?';
      this._debugHoverLabel.setText(`${frameName}\n${key}\n${file}\n${method}`);
      this._debugHoverLabel.setPosition(px, py - TILE / 2 - 2);
      this._debugHoverLabel.setVisible(true);
    });
    sprite.on('pointerout', () => {
      this._debugHoverLabel.setVisible(false);
    });
  }

  /**
   * Extract the original source PNG filename (e.g. "desert-beach-tiles-1.png")
   * for a Phaser Texture. Prefers the asset manifest (authored path, stable
   * across Vite hashing) and falls back to the runtime image URL.
   */
  _getTextureFilename(texture) {
    const key = texture && texture.key;
    const manifestPath = key && getAssetKeyToPath().get(key);
    if (manifestPath) {
      return manifestPath.substring(manifestPath.lastIndexOf('/') + 1) || manifestPath;
    }
    const src = texture && texture.source && texture.source[0];
    const url = src && src.image && src.image.src;
    if (!url) return '?';
    try {
      const path = new URL(url, window.location.origin).pathname;
      return path.substring(path.lastIndexOf('/') + 1) || path;
    } catch {
      return url.substring(url.lastIndexOf('/') + 1) || url;
    }
  }

  /**
   * Build a zone's tilemap, objects, and collision
   */
  create(zone, mapWidth, mapHeight) {
    this.groundSprites = [];
    this.objectSprites = [];
    this.decoSprites = [];
    this.animalSprites = [];
    this.exitTriggers = [];
    this._debugHoverLabel = null;
    this.activeTweens.forEach((t) => { if (t) t.remove(); });
    this.activeTweens = [];

    const groundData = zone.buildMap();
    const objects = zone.objects;
    const exits = zone.exits || [];

    // Create collision group
    this.wallGroup = this.scene.physics.add.staticGroup();

    // Render ground tiles — biome drives tileset selection
    const biome = zone.tilesetTheme || 'desert';
    this.renderGroundTiles(groundData, mapWidth, mapHeight, biome);

    // Water edge shimmer effect — only for flat-tile fallback (skip when Kenmi tiles active)
    if (!this._hasKenmiTiles()) {
      this.addWaterEdgeEffect(groundData, mapWidth, mapHeight);
    }

    // Setup collision (borders + water)
    this.setupCollision(groundData, mapWidth, mapHeight, exits);

    // Place world objects
    this.placeObjects(objects);

    this.scatterDecorations(zone, groundData, mapWidth, mapHeight);

    // this.spawnAmbientAnimals(zone, groundData, mapWidth, mapHeight);

    // Create exit triggers (signposts at zone edges)
    this.createExitTriggers(exits, mapWidth, mapHeight);

    return this.wallGroup;
  }

  // ================================================================
  // Ground tile rendering
  // ================================================================

  /**
   * Render ground tiles — uses Kenmi tileset if available, flat colors as fallback
   */
  renderGroundTiles(groundData, mapW, mapH, biome = 'desert') {
    if (this._hasKenmiTiles()) {
      this._renderKenmiTiles(groundData, mapW, mapH, biome);
    } else {
      this._renderFlatTiles(groundData, mapW, mapH);
    }
  }

  /**
   * Check if Kenmi tileset textures are loaded
   */
  _hasKenmiTiles() {
    return this.scene.textures.exists(BEACH_KEYS[0]);
  }

  /**
   * Safe frame getter — clamps frame index to valid range for a texture.
   * Returns frame 0 if the requested frame doesn't exist (prevents black squares).
   */
  _safeFrame(textureKey, frame) {
    if (frame == null || frame < 0) return 0;
    const tex = this.scene.textures.get(textureKey);
    if (!tex || !tex.frames) return 0;
    // Phaser spritesheet frames are named by index: '0', '1', '2', etc.
    // Check if this frame index exists
    if (tex.frames[String(frame)]) return frame;
    // Fallback: find max valid frame
    const maxFrame = Object.keys(tex.frames).filter(k => k !== '__BASE').length - 1;
    // Phase 97 Plan 04 — DEV-mode warn when clamping so future frame-index drift surfaces loudly.
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      const table = KENMI_FRAME_TABLES[textureKey];
      // eslint-disable-next-line no-console
      console.warn(`[MapLoader] _safeFrame clamped: key=${textureKey} requested=${frame} maxFrame=${maxFrame}${table ? ` tableTotal=${table.totalFrames}` : ''}`);
    }
    return Math.min(frame, Math.max(0, maxFrame));
  }

  /**
   * Fallback: original flat-color tile rendering
   */
  _renderFlatTiles(groundData, mapW, mapH) {
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const px = x * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;
        const tileType = groundData[y][x];

        let sprite;
        if (tileType === GRASS) {
          sprite = this.scene.add.image(px, py, 'tile-grass');
        } else if (tileType === WATER) {
          sprite = this.scene.add.image(px, py, 'tile-sand');
          sprite.setTint(0x50b0d8);
        } else if (tileType === ICE_GRASS) {
          sprite = this.scene.add.image(px, py, 'grass-ice');
        } else {
          sprite = this.scene.add.image(px, py, 'tile-sand');
        }
        this.groundSprites.push(sprite);
        this._addTileDebugLabel(sprite, px, py);
      }
    }
  }

  /**
   * Kenmi 16x16 tileset rendering with auto-tiling and biome dispatch.
   * Uses biome config to select correct tileset keys for sand, grass, water, and foam.
   * All sprites scaled 4x (16px -> 64px).
   */
  _renderKenmiTiles(groundData, mapW, mapH, biome = 'desert') {
    this._currentBiome = biome;
    this._currentBiomeConfig = BIOME_TILESETS[biome] || BIOME_TILESETS.desert;

    // Create foam animation if not yet registered
    this._createFoamAnimations();
    // Create water animation if not yet registered
    this._createWaterAnimations();

    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const px = x * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;
        const tileType = groundData[y][x];
        const n = this._getNeighbors(groundData, x, y, mapW, mapH);
        const hash = tileHash(x, y, 42);

        let sprite;

        switch (tileType) {
          case GRASS:
          case ICE_GRASS:
            sprite = this._renderGrassTile(px, py, n, hash, tileType,groundData, x, y, mapW, mapH);
            break;
          case WATER:
            sprite = this._renderWaterTile(px, py, n, hash, groundData, x, y, mapW, mapH);
            break;
          case SAND:
          case STONE:
          case WOOD:
          default:
            sprite = this._renderSandTile(px, py, n, hash, groundData, x, y, mapW, mapH);
            break;
        }

        sprite.setDepth(0);
        this.groundSprites.push(sprite);
        this._addTileDebugLabel(sprite, px, py);
      }
    }
  }

  // ================================================================
  // Kenmi tile renderers
  // ================================================================

  /**
   * Render a sand tile. Checks if any water neighbor exists to pick
   * sand-water border frames from the biome tileset.
   */
  _renderSandTile(px, py, neighbors, hash, groundData, tx, ty, mapW, mapH) {
    const cfg = this._currentBiomeConfig;
    const nWater = neighbors.n === WATER;
    const sWater = neighbors.s === WATER;
    const wWater = neighbors.w === WATER;
    const eWater = neighbors.e === WATER;
    const nwWater = (ty > 0 && tx > 0) ? groundData[ty - 1][tx - 1] === WATER : false;
    const neWater = (ty > 0 && tx < mapW - 1) ? groundData[ty - 1][tx + 1] === WATER : false;
    const swWater = (ty < mapH - 1 && tx > 0) ? groundData[ty + 1][tx - 1] === WATER : false;
    const seWater = (ty < mapH - 1 && tx < mapW - 1) ? groundData[ty + 1][tx + 1] === WATER : false;
    const hasWaterNeighbor = nWater || sWater || wWater || eWater || nwWater || neWater || swWater || seWater;

    if (!hasWaterNeighbor) {
      // Solid sand — pick from biome color variants for visual variety
      const sandKeys = cfg.sandKeys;
      const variantIdx = Math.floor(hash * sandKeys.length);
      const key = sandKeys[variantIdx];

      let frame;
      if (this._currentBiome === 'desert') {
        // Desert: use specific BEACH frame constants (5-col layout)
        const solidFrames = [BEACH.SAND_SOLID, BEACH.SAND_VAR_1, BEACH.SAND_VAR_2];
        const varHash = tileHash(tx, ty, 99);
        frame = solidFrames[Math.floor(varHash * solidFrames.length)];
      } else {
        // Non-desert: SAND auto-tile block at rows 5-7 (offset cols*5 from GRASS rows 0-2)
        const cols = cfg.sandCols;
        const solidCenter = cols * 6 + 1;
        const solidVariants = [solidCenter];
        const varHash = tileHash(tx, ty, 99);
        frame = solidVariants[Math.floor(varHash * solidVariants.length)];
      }

      const sprite = this.scene.add.image(px, py, key, this._safeFrame(key, frame));
      sprite.setScale(KENMI_SCALE);
      sprite._debugMethod = '_renderSandTile';
      if (this._currentBiome === 'snow' && cfg.sandTint) {
        sprite.setTint(cfg.sandTint);
      }
      if (this._currentBiome === 'desert') {
        const nGrass = neighbors.n === GRASS;
        const sGrass = neighbors.s === GRASS;
        const wGrass = neighbors.w === GRASS;
        const eGrass = neighbors.e === GRASS;
        const nwGrass = (ty > 0 && tx > 0) ? groundData[ty-1][tx-1] === GRASS : false;
        const neGrass = (ty > 0 && tx < mapW-1) ? groundData[ty-1][tx+1] === GRASS : false;
        const swGrass = (ty < mapH-1 && tx > 0) ? groundData[ty+1][tx-1] === GRASS : false;
        const seGrass = (ty < mapH-1 && tx < mapW-1) ? groundData[ty+1][tx+1] === GRASS : false;
        if (nGrass || sGrass || wGrass || eGrass || nwGrass || neGrass || swGrass || seGrass) {
          this._addGrassOverlay(px, py, nGrass, sGrass, wGrass, eGrass, nwGrass, neGrass, swGrass, seGrass);
        }
      }
      return sprite;
    }

    // Sand bordering water — use biome transition frames
    const key = cfg.sandKeys[0];

    let frame;
    if (this._currentBiome === 'desert') {
      frame = this._pickSandWaterFrame(nWater, sWater, wWater, eWater, groundData, tx, ty, mapW, mapH);
    } else {
      // Non-desert: SAND auto-tile edge frames at rows 5-7 (offset cols*5 from GRASS rows 0-2)
        frame = this._pickSandWaterFrameNoDesert(nWater, sWater, wWater, eWater, groundData, tx, ty, mapW, mapH);
    }

    const sprite = this.scene.add.image(px, py, key, this._safeFrame(key, frame));
    sprite.setScale(KENMI_SCALE);
    sprite._debugMethod = '_renderSandTile';
    if (this._currentBiome === 'snow' && cfg.sandTint) {
      sprite.setTint(cfg.sandTint);
    }

    if (this._currentBiome === 'desert') {
      const nGrass = neighbors.n === GRASS;
      const sGrass = neighbors.s === GRASS;
      const wGrass = neighbors.w === GRASS;
      const eGrass = neighbors.e === GRASS;
      const nwGrass = (ty > 0 && tx > 0) ? groundData[ty-1][tx-1] === GRASS : false;
      const neGrass = (ty > 0 && tx < mapW-1) ? groundData[ty-1][tx+1] === GRASS : false;
      const swGrass = (ty < mapH-1 && tx > 0) ? groundData[ty+1][tx-1] === GRASS : false;
      const seGrass = (ty < mapH-1 && tx < mapW-1) ? groundData[ty+1][tx+1] === GRASS : false;
      if (nGrass || sGrass || wGrass || eGrass || nwGrass || neGrass || swGrass || seGrass) {
        this._addGrassOverlay(px, py, nGrass, sGrass, wGrass, eGrass, nwGrass, neGrass, swGrass, seGrass);
      }
    }
    return sprite;
  }

  /**
   * Pick the correct beach-tiles frame for sand bordering water.
   * The beach tileset shows sand with water cutouts, so:
   * - "top edge" = sand on top, water below
   * - Corners are where two edges meet
   */
  _pickSandWaterFrame(nWater, sWater, wWater, eWater, groundData, tx, ty, mapW, mapH) {
    // Also check diagonal neighbors for corner detection
    const nw = (ty > 0 && tx > 0) ? groundData[ty - 1][tx - 1] === WATER : false;
    const ne = (ty > 0 && tx < mapW - 1) ? groundData[ty - 1][tx + 1] === WATER : false;
    const sw = (ty < mapH - 1 && tx > 0) ? groundData[ty + 1][tx - 1] === WATER : false;
    const se = (ty < mapH - 1 && tx < mapW - 1) ? groundData[ty + 1][tx + 1] === WATER : false;

    // Two-edge corners (L-shaped water borders)
    if (nWater && wWater) return BEACH.CORNER_BR;  // water NW -> sand is BR corner
    if (nWater && eWater) return BEACH.CORNER_BL;  // water NE -> sand is BL corner
    if (sWater && wWater) return BEACH.CORNER_TR;  // water SW -> sand is TR corner
    if (sWater && eWater) return BEACH.CORNER_TL;  // water SE -> sand is TL corner

    // Single cardinal edges
    if (nWater) return BEACH.EDGE_BOTTOM; // water above -> bottom edge of sand island
    if (sWater) return BEACH.EDGE_TOP;    // water below -> top edge of sand island
    if (wWater) return BEACH.EDGE_RIGHT;  // water left -> right edge of sand island
    if (eWater) return BEACH.EDGE_LEFT;   // water right -> left edge of sand island

    // Inner corners (only diagonal water neighbor)
    if (nw) return BEACH.CORNER_BR;
    if (ne) return BEACH.CORNER_BL;
    if (sw) return BEACH.CORNER_TR;
    if (se) return BEACH.CORNER_TL;

    // Fallback to solid sand
    return BEACH.SAND_SOLID;
  }


  _pickSandWaterFrameNoDesert(nWater, sWater, wWater, eWater, groundData, tx, ty, mapW, mapH) {
    const cfg = this._currentBiomeConfig;
    const cols = cfg.sandCols;
    const TL = cols * 5, T = cols * 5 + 1, TR = cols * 5 + 2;
    const L = cols * 6, R = cols * 6 + 2;
    const BL = cols * 7, B = cols * 7 + 1, BR = cols * 7 + 2;
    const solidCenter = cols * 6 + 1;
    const INNER_TL = cols * 9 + 1, INNER_TR = cols * 9;
    const INNER_BL = cols * 8 + 1, INNER_BR = cols * 8;
   
    // Also check diagonal neighbors for corner detection
    const nw = (ty > 0 && tx > 0) ? groundData[ty - 1][tx - 1] === WATER : false;
    const ne = (ty > 0 && tx < mapW - 1) ? groundData[ty - 1][tx + 1] === WATER : false;
    const sw = (ty < mapH - 1 && tx > 0) ? groundData[ty + 1][tx - 1] === WATER : false;
    const se = (ty < mapH - 1 && tx < mapW - 1) ? groundData[ty + 1][tx + 1] === WATER : false;

    // Two-edge corners (L-shaped water borders) — original directions
    if (nWater && wWater) return BR;
    if (nWater && eWater) return BL;
    if (sWater && wWater) return TR;
    if (sWater && eWater) return TL;

    // Single cardinal edges — inverted
    if (nWater) return T;
    if (sWater) return B;
    if (wWater) return L;
    if (eWater) return R;

    // Inner corners (only diagonal water neighbor) — inverted
    if (nw) return INNER_TL;
    if (ne) return INNER_TR;
    if (sw) return INNER_BL;
    if (se) return INNER_BR;

    // Fallback to solid sand
    return solidCenter;
  }
  /**
   * Render a grass tile with auto-tiling edges.
   * Uses biome config to select the correct grass spritesheet.
   */
  _renderGrassTile(px, py, neighbors, hash, tileType, groundData, tx, ty, mapW, mapH) {
    const cfg = this._currentBiomeConfig;
    const isGrassLike = (t) => t === GRASS || t === ICE_GRASS || t=== WATER; // treat water as "grass-like" for grass edge rendering (sand is the "foreign" type)
    const nForeign = !isGrassLike(neighbors.n);
    const sForeign = !isGrassLike(neighbors.s);
    const wForeign = !isGrassLike(neighbors.w);
    const eForeign = !isGrassLike(neighbors.e);


    let frame;
    if (this._currentBiome === 'desert') {
      //  (path in grass, reversed logic)
      if (nForeign || sForeign || wForeign || eForeign) {
        const solids = [GRASS_F.SOLID, GRASS_F.VAR_1, GRASS_F.VAR_2, GRASS_F.VAR_3];
        frame = solids[Math.floor(hash * solids.length)];
      } else {
        frame = this._pickEdgeFrame(
          nForeign, sForeign, wForeign, eForeign,
          GRASS_F.CORNER_TL, GRASS_F.EDGE_TOP, GRASS_F.CORNER_TR,
          GRASS_F.EDGE_LEFT, GRASS_F.EDGE_BOTTOM, GRASS_F.EDGE_RIGHT,
          GRASS_F.SOLID,
          GRASS_F.CORNER_BL, GRASS_F.CORNER_BR
        );
      }
    } else {
      // Non-desert grass: inverted edge logic (sand outside, grass inside) + inner corners
        frame = this._pickGrassForeignFrame(nForeign, sForeign, wForeign, eForeign, hash, groundData, tx, ty, mapW, mapH);
    }

    const grassKey = cfg.grassKey;
    const sprite = this.scene.add.image(px, py, grassKey, this._safeFrame(grassKey, frame));
    sprite.setScale(KENMI_SCALE);
    sprite._debugMethod = '_renderGrassTile';

    if (tileType === ICE_GRASS) { 
      //paint in white and let the shader recolor it, so the same tile can be used for both snow and desert biomes with different tints
      sprite.setPipeline('ReplaceColor');
      const pipeline = sprite.pipeline;

      if(this._currentBiome === 'desert')
      {
        pipeline.set3f(
          'targetColor',
          0.486, // R
          0.588, // G
          0.235  // B
        );
      }
      else{
        pipeline.set3f(
          'targetColor',
          0.243, // R
          0.537, // G
          0.282  // B
        );
      }
    }

    return sprite;
  }

  _pickGrassForeignFrame(nForeign, sForeign, wForeign, eForeign, hash, groundData, tx, ty, mapW, mapH) {
    const cfg = this._currentBiomeConfig;
    const cols = cfg.grassCols;
    const T = cols * 5 + 1, L = cols * 6, CENTER = cols * 9 + 5, R = cols * 6 + 2, B = cols * 7 + 1;
    const INNER_TL = cols * 9 + 1, INNER_TR = cols * 9;
    const INNER_BL = cols * 8 + 1, INNER_BR = cols * 8;
    const TL = cols * 5, TR = cols * 5 + 2, BL = cols * 7, BR = cols * 7 + 2;

    const isGrassLike = (t) => t === GRASS || t === ICE_GRASS || t=== WATER; // treat water as "grass-like" for grass edge rendering (sand is the "foreign" type)

    // Water-specific cardinal checks (water is grass-like, but we need to distinguish it for mixed corners)
    const nWater = (ty > 0) ? groundData[ty - 1][tx] === WATER : false;
    const sWater = (ty < mapH - 1) ? groundData[ty + 1][tx] === WATER : false;
    const wWater = (tx > 0) ? groundData[ty][tx - 1] === WATER : false;
    const eWater = (tx < mapW - 1) ? groundData[ty][tx + 1] === WATER : false;
    const nwWater = (ty > 0 && tx > 0) ? groundData[ty - 1][tx - 1] === WATER : false;
    const neWater = (ty > 0 && tx < mapW - 1) ? groundData[ty - 1][tx + 1] === WATER : false;
    const swWater = (ty < mapH - 1 && tx > 0) ? groundData[ty + 1][tx - 1] === WATER : false;
    const seWater = (ty < mapH - 1 && tx < mapW - 1) ? groundData[ty + 1][tx + 1] === WATER : false;

    // Also check diagonal neighbors for corner detection
    const nw = (ty > 0 && tx > 0) ? !isGrassLike(groundData[ty - 1][tx - 1]) : false;
    const ne = (ty > 0 && tx < mapW - 1) ? !isGrassLike(groundData[ty - 1][tx + 1]) : false;
    const sw = (ty < mapH - 1 && tx > 0) ? !isGrassLike(groundData[ty + 1][tx - 1]) : false;
    const se = (ty < mapH - 1 && tx < mapW - 1) ? !isGrassLike(groundData[ty + 1][tx + 1]) : false;

    // Two-edge corners (L-shaped  borders)
    if (nForeign && wForeign) return INNER_BR;  //  BR corner
    if (nForeign && eForeign) return INNER_BL;  //  BL corner
    if (sForeign && wForeign) return INNER_TR;  //  TR corner
    if (sForeign && eForeign) return INNER_TL;  //  TL corner

    // Mixed grass/water/sand outer corners: sand on one vertical cardinal + water on one horizontal cardinal
    if (sForeign && eWater && !nForeign && !wForeign) return TR;
    if (sForeign && wWater && !nForeign && !eForeign) return TL;
    if (nForeign && eWater && !sForeign && !wForeign) return BR;
    if (nForeign && wWater && !sForeign && !eForeign) return BL;

    // Mixed grass/water/sand outer corners: sand on one horizontal cardinal + water on one vertical cardinal
    if (wForeign && nWater && !sForeign && !eForeign) return TR;
    if (eForeign && nWater && !sForeign && !wForeign) return TL;
    if (wForeign && sWater && !nForeign && !eForeign) return BR;
    if (eForeign && sWater && !nForeign && !wForeign) return BL;

    // Mixed grass/water/sand outer corners: sand on one cardinal + water on adjacent diagonal
    if (eForeign && neWater && !wForeign && !nForeign) return TL;
    if (eForeign && seWater && !wForeign && !sForeign) return BL;
    if (wForeign && nwWater && !eForeign && !nForeign) return TR;
    if (wForeign && swWater && !eForeign && !sForeign) return BR;
    if (nForeign && nwWater && !sForeign && !wForeign) return BL;
    if (nForeign && neWater && !sForeign && !eForeign) return BR;
    if (sForeign && swWater && !nForeign && !wForeign) return TL;
    if (sForeign && seWater && !nForeign && !eForeign) return TR;

    // Single cardinal edges
    if (nForeign) return B; // above -> bottom edge of island
    if (sForeign) return T;    // below -> top edge of island
    if (wForeign) return R;  // left -> right edge of island
    if (eForeign) return L;   // right -> left edge of island

    // corners (only diagonal water neighbor)
    if (nw && !swWater) return BR;
    if (ne && !seWater) return BL;
    if (sw && !nwWater) return TR;
    if (se && !neWater) return TL;

    // Fallback to solid sand
    const solids = [CENTER, CENTER + 1, CENTER + 2];
    return solids[Math.floor(hash * solids.length)];
  }


  /**
   * Render a water tile with auto-tiling edges.
   * Also places animated foam sprites on water tiles bordering sand.
   */
  _renderWaterTile(px, py, neighbors, hash, groundData, tx, ty, mapW, mapH) {
    const cfg = this._currentBiomeConfig;
    const nForeign = neighbors.n !== WATER;
    const sForeign = neighbors.s !== WATER;
    const wForeign = neighbors.w !== WATER;
    const eForeign = neighbors.e !== WATER;

    let frame;
    if (this._currentBiome === 'desert') {
      // Desert water: use WATER_F constants (6-col layout)
      if (!nForeign && !sForeign && !wForeign && !eForeign) {
        const solids = [WATER_F.SOLID_1, WATER_F.SOLID_2, WATER_F.SOLID_3,
                        WATER_F.SOLID_4, WATER_F.SOLID_5];
        frame = solids[Math.floor(hash * solids.length)];
      } else {
        frame = this._pickEdgeFrame(
          nForeign, sForeign, wForeign, eForeign,
          WATER_F.CORNER_TL, WATER_F.EDGE_TOP, WATER_F.CORNER_TR,
          WATER_F.EDGE_LEFT, WATER_F.EDGE_BOTTOM, WATER_F.EDGE_RIGHT,
          WATER_F.SOLID_1,
          WATER_F.CORNER_BL, WATER_F.CORNER_BR
        );
      }
    } else {
      // Non-desert water: use 3×3 auto-tile from sheet top-left
      const cols = cfg.waterCols; // 3 for base water
      const TL = 0, T = 1, TR = 2;
      const L = cols, CENTER = cols + 1, R = cols + 2;
      const BL = cols * 2, B = cols * 2 + 1, BR = cols * 2 + 2;
      if (!nForeign && !sForeign && !wForeign && !eForeign) {
        const solids = [CENTER];
        frame = solids[Math.floor(hash * solids.length)];
      } else {
        frame = this._pickEdgeFrame(nForeign, sForeign, wForeign, eForeign, TL, T, TR, L, B, R, CENTER, BL, BR);
      }
    }

    const waterKey = cfg.waterKey;

    // Use sprite for desert biome water to enable animations
    let sprite;
    if (this._currentBiome === 'desert') {
      sprite = this.scene.add.sprite(px, py, waterKey, this._safeFrame(waterKey, frame));
      sprite._debugMethod = '_renderWaterTile';

      // Determine which row (0-4) and tile type (0-2) the frame belongs to
      const rowSize = 24;
      const row = Math.floor(frame / rowSize);
      const frameInRow = frame % rowSize;
      const tileType = frameInRow % 3;
      const animKey = `water-anim-row${row}-${tileType}`;
      if (this.scene.anims.exists(animKey)) {
        sprite.play(animKey);
      }
    } else {
      // Non-desert water uses static image
      sprite = this.scene.add.image(px, py, waterKey, this._safeFrame(waterKey, frame));
      sprite._debugMethod = '_renderWaterTile';
    }

    sprite.setScale(KENMI_SCALE);


    // Add water inner corner overlays for desert biome
    if (this._currentBiome === 'desert') {
      const nwWater = (ty > 0 && tx > 0) ? groundData[ty-1][tx-1] === WATER : false;
      const neWater = (ty > 0 && tx < mapW-1) ? groundData[ty-1][tx+1] === WATER : false;
      const swWater = (ty < mapH-1 && tx > 0) ? groundData[ty+1][tx-1] === WATER : false;
      const seWater = (ty < mapH-1 && tx < mapW-1) ? groundData[ty+1][tx+1] === WATER : false;
      if (nwWater || neWater || swWater || seWater) {
        this._addWaterOverlay(px, py, nForeign, sForeign, wForeign, eForeign, nwWater, neWater, swWater, seWater);
      }
    }

    return sprite;
  }

  // ================================================================
  // Auto-tiling helpers
  // ================================================================

  /**
   * Get 4-neighbor tile types (N, S, E, W). Out-of-bounds treated as same type.
   */
  _getNeighbors(groundData, x, y, mapW, mapH) {
    const current = groundData[y][x];
    return {
      n: y > 0 ? groundData[y - 1][x] : current,
      s: y < mapH - 1 ? groundData[y + 1][x] : current,
      w: x > 0 ? groundData[y][x - 1] : current,
      e: x < mapW - 1 ? groundData[y][x + 1] : current,
    };
  }

  /**
   * Generic 4-neighbor edge frame picker.
   * Given which sides are "foreign" (bordering different terrain), picks the
   * appropriate auto-tile frame from a 3x3 block:
   *   TL  T  TR
   *   L   -  R
   *   BL  B  BR
   */
  _pickEdgeFrame(nForeign, sForeign, wForeign, eForeign, TL, T, TR, L, B, R, fallback, BL, BR) {
    // Corner cases (2 adjacent foreign sides)
    if (nForeign && wForeign) return TL;
    if (nForeign && eForeign) return TR;
    if (sForeign && wForeign) return BL !== undefined ? BL : L;
    if (sForeign && eForeign) return BR !== undefined ? BR : R;

    // Single edge cases
    if (nForeign) return T;
    if (sForeign) return B;
    if (wForeign) return L;
    if (eForeign) return R;

    // Fallback (shouldn't normally reach here)
    return fallback;
  }

  /**
   * Check if tile type is sand-like (sand, stone, wood, or unknown)
   */
  _isSandLike(tileType) {
    return tileType === SAND || tileType === STONE || tileType === WOOD;
  }

  // ================================================================
  // Water foam animation
  // ================================================================

  /**
   * Create foam animation configs (run once per zone load).
   * Uses biome-specific foam spritesheet key and column count.
   */
  _createFoamAnimations() {
    const cfg = this._currentBiomeConfig || BIOME_TILESETS.desert;
    const foamKey = cfg.foamKey;
    if (!this.scene.textures.exists(foamKey)) return;

    // Use the foam key (sanitised) as a prefix to create unique anim keys per biome
    const prefix = foamKey.replace(/[^a-z0-9]/g, '-');
    const topKey = `${prefix}-foam-top`;
    const leftKey = `${prefix}-foam-left`;
    const bottomKey = `${prefix}-foam-bottom`;

    if (this.scene.anims.exists(topKey)) {
      // Already created for this biome — just store references
      this._foamAnimKeys = { top: topKey, left: leftKey, bottom: bottomKey };
      this._foamTextureKey = foamKey;
      return;
    }

    const foamCols = cfg.foamCols;

    // Get actual frame count to avoid creating animations for nonexistent rows
    const foamTexture = this.scene.textures.get(foamKey);
    const totalFrames = foamTexture.frameTotal - 1; // subtract __BASE frame
    const foamRows = Math.floor(totalFrames / foamCols) || 1;

    // Row 0 always exists
    this.scene.anims.create({
      key: topKey,
      frames: this.scene.anims.generateFrameNumbers(foamKey, { start: 0, end: Math.min(foamCols - 1, totalFrames - 1) }),
      frameRate: 6,
      repeat: -1,
    });

    if (foamRows >= 2) {
      // Row 1: left/vertical foam
      this.scene.anims.create({
        key: leftKey,
        frames: this.scene.anims.generateFrameNumbers(foamKey, { start: foamCols, end: Math.min(foamCols * 2 - 1, totalFrames - 1) }),
        frameRate: 6,
        repeat: -1,
      });
    }

    if (foamRows >= 3) {
      // Row 2: bottom/other direction foam
      this.scene.anims.create({
        key: bottomKey,
        frames: this.scene.anims.generateFrameNumbers(foamKey, { start: foamCols * 2, end: Math.min(foamCols * 3 - 1, totalFrames - 1) }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Store current foam anim keys for _addFoamOverlay
    this._foamAnimKeys = { top: topKey, left: leftKey, bottom: bottomKey };
    this._foamTextureKey = foamKey;
  }

  /**
   * Create water animation configs (run once per zone load).
   * Water has 5 rows of animations, each with 3 tile types spaced by stride=3.
   * Row 0: CORNER_TL(0,3,6,...), EDGE_TOP(1,4,7,...), CORNER_TR(2,5,8,...)
   * Row 1: EDGE_LEFT(24,27,30,...), SOLID(25,28,31,...), EDGE_RIGHT(26,29,32,...)
   * etc.
   */
  _createWaterAnimations() {
    if (!this.scene.textures.exists(WATER_KEY)) return;

    const stride = 3;  // 3 tile types per row
    const variations = 8;  // 8 animation frames per tile type
    const rowSize = 24;  // frames per row
    const numRows = 5;  // 5 animation rows

    // Create animation for each row and tile type
    for (let row = 0; row < numRows; row++) {
      for (let tileType = 0; tileType < stride; tileType++) {
        const animKey = `water-anim-row${row}-${tileType}`;

        // Skip if already created
        if (this.scene.anims.exists(animKey)) continue;

        // Generate frames for this row: rowStart + 0*3+tileType, rowStart + 1*3+tileType, etc.
        const frames = [];
        const rowStart = row * rowSize;
        for (let i = 0; i < variations; i++) {
          const frameIndex = rowStart + i * stride + tileType;
          frames.push(frameIndex);
        }

        // Create animation
        this.scene.anims.create({
          key: animKey,
          frames: frames.map(f => ({ key: WATER_KEY, frame: f })),
          frameRate: 8,
          repeat: -1,
        });
      }
    }

    this._waterAnimCreated = true;
  }

  /**
   * Add animated foam sprite overlay on a water tile that borders land.
   * Uses biome-specific foam texture and animation keys.
   */
  _addFoamOverlay(px, py, nForeign, sForeign, wForeign, eForeign) {
    const foamKey = this._foamTextureKey;
    if (!foamKey || !this.scene.textures.exists(foamKey)) return;

    const keys = this._foamAnimKeys;
    if (!keys) return;

    // Pick the foam animation direction based on which edge borders land
    let animKey = null;
    if (nForeign) animKey = keys.top;
    else if (sForeign) animKey = keys.bottom;
    else if (wForeign) animKey = keys.left;
    else if (eForeign) animKey = keys.left; // flip for right side

    if (!animKey || !this.scene.anims.exists(animKey)) return;

    const foam = this.scene.add.sprite(px, py, foamKey, 0);
    foam.setScale(KENMI_SCALE);
    foam.setDepth(1);
    foam.setAlpha(0.7);
    foam.play(animKey);

    // Flip horizontally for right-side foam
    if (eForeign && !wForeign) {
      foam.setFlipX(true);
    }
    // Flip vertically for bottom foam
    if (sForeign && !nForeign && animKey === keys.bottom) {
      foam.setFlipY(true);
    }

    this.groundSprites.push(foam);
  }


  _addGrassOverlay(px, py, nGrass, sGrass, wGrass, eGrass, nwGrass = false, neGrass = false, swGrass = false, seGrass = false) {
    if (!this.scene.textures.exists(GRASS_KEY)) return;

    const addOverlayFrame = (frame) => {
      const overlay = this.scene.add.image(px, py, GRASS_KEY, this._safeFrame(GRASS_KEY, frame));
      overlay.setScale(KENMI_SCALE);
      overlay.setDepth(1);
      this.groundSprites.push(overlay);
    };

    // Cardinal edges and convex corners
    const frame = this._pickEdgeFrame(
      nGrass, sGrass, wGrass, eGrass,
      GRASS_F.CORNER_TL, GRASS_F.EDGE_TOP, GRASS_F.CORNER_TR,
      GRASS_F.EDGE_LEFT, GRASS_F.EDGE_BOTTOM, GRASS_F.EDGE_RIGHT,
      null,
      GRASS_F.CORNER_BL, GRASS_F.CORNER_BR
    );
    if (frame !== null) addOverlayFrame(frame);

    // Concave (inner) corners: diagonal grass with no adjacent cardinal grass
    if (nwGrass && !nGrass && !wGrass) addOverlayFrame(GRASS_F.INNER_TL);
    if (neGrass && !nGrass && !eGrass) addOverlayFrame(GRASS_F.INNER_TR);
    if (swGrass && !sGrass && !wGrass) addOverlayFrame(GRASS_F.INNER_BL);
    if (seGrass && !sGrass && !eGrass) addOverlayFrame(GRASS_F.INNER_BR);
  }

  _addWaterOverlay(px, py, nForeign, sForeign, wForeign, eForeign, nwWater = false, neWater = false, swWater = false, seWater = false) {
    if (!this.scene.textures.exists(WATER_KEY)) return;

    const addOverlayFrame = (frameNum) => {
      const overlay = this.scene.add.sprite(px, py, WATER_KEY, this._safeFrame(WATER_KEY, frameNum));
      overlay.setScale(KENMI_SCALE);
      overlay.setDepth(1);

      // Determine which row and tile type to play correct animation
      const rowSize = 24;
      const row = Math.floor(frameNum / rowSize);
      const frameInRow = frameNum % rowSize;
      const tileType = frameInRow % 3;
      const animKey = `water-anim-row${row}-${tileType}`;
      if (this.scene.anims.exists(animKey)) {
        overlay.play(animKey);
      }

      this.groundSprites.push(overlay);
    };

    // Concave (inner) corners: no diagonal water but cardinal water on both sides
    if (!nwWater && !nForeign && !wForeign) addOverlayFrame(WATER_F.INNER_TL);
    if (!neWater && !nForeign && !eForeign) addOverlayFrame(WATER_F.INNER_TR);
    if (!swWater && !sForeign && !wForeign) addOverlayFrame(WATER_F.INNER_BL);
    if (!seWater && !sForeign && !eForeign) addOverlayFrame(WATER_F.INNER_BR);
  }
  // ================================================================
  // Water edge effects
  // ================================================================

  /**
   * Add shimmer effect to water edges
   */
  addWaterEdgeEffect(groundData, mapW, mapH) {
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        if (groundData[y][x] !== WATER) continue;
        const adj = [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];
        for (const [ax, ay] of adj) {
          if (
            ax >= 0 &&
            ax < mapW &&
            ay >= 0 &&
            ay < mapH &&
            groundData[ay][ax] !== WATER
          ) {
            const px = x * TILE + TILE / 2;
            const py = y * TILE + TILE / 2;
            const edge = this.scene.add.rectangle(px, py, TILE, TILE, 0x66d7ee, 0.3);
            const tween = this.scene.tweens.add({
              targets: edge,
              alpha: { from: 0.15, to: 0.35 },
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
            });
            this.activeTweens.push(tween);
            this.groundSprites.push(edge);
            break;
          }
        }
      }
    }
  }

  // ================================================================
  // Collision
  // ================================================================

  /**
   * Setup collision: world borders (with exit gaps) and water
   */
  setupCollision(groundData, mapW, mapH, exits) {
    const mapPixelW = mapW * TILE;
    const mapPixelH = mapH * TILE;

    // World border walls (invisible) — skip tiles that have exits
    const exitEdgeTiles = this.buildExitEdgeSet(exits, mapW, mapH);

    for (let x = -1; x <= mapW; x++) {
      if (!exitEdgeTiles.has(`north:${x}`)) {
        this.addInvisibleWall(x * TILE + TILE / 2, -TILE / 2, TILE, TILE);
      }
      if (!exitEdgeTiles.has(`south:${x}`)) {
        this.addInvisibleWall(x * TILE + TILE / 2, mapPixelH + TILE / 2, TILE, TILE);
      }
    }
    for (let y = 0; y < mapH; y++) {
      if (!exitEdgeTiles.has(`west:${y}`)) {
        this.addInvisibleWall(-TILE / 2, y * TILE + TILE / 2, TILE, TILE);
      }
      if (!exitEdgeTiles.has(`east:${y}`)) {
        this.addInvisibleWall(mapPixelW + TILE / 2, y * TILE + TILE / 2, TILE, TILE);
      }
    }

    // Water collision
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        if (groundData[y][x] === WATER) {
          this.addInvisibleWall(
            x * TILE + TILE / 2,
            y * TILE + TILE / 2,
            TILE,
            TILE
          );
        }
      }
    }
  }

  // ================================================================
  // World objects
  // ================================================================

  /**
   * Place world objects (trees, buildings, etc.) with Y-sorting
   */
  placeObjects(objects) {
    const sortedObjects = [...objects].sort((a, b) => a.y - b.y);
    sortedObjects.forEach((obj) => {
      const px = obj.x * TILE + TILE / 2;
      const py = obj.y * TILE + TILE / 2;

      // Remap old placeholder keys to Kenmi asset keys (backward compatible)
      const kenmiKey = SPRITE_KEY_MAP[obj.key];
      const textureKey = kenmiKey && this.scene.textures.exists(kenmiKey) ? kenmiKey : obj.key;
      const sprite = this.scene.add.image(px, py, textureKey);

      sprite.setOrigin(0.5, 0.8);

      // Select random variation from spritesheet if multi-item prop (2+ regions)
      // Single-region crops are for large singular objects (e.g. palm trees)
      const cropRegions = PROP_CROP_REGIONS[textureKey];
      if (cropRegions && cropRegions.length > 0) {
        // Multi-item spritesheet: pick random variant
        const randomIdx = Math.floor(Math.random() * cropRegions.length);
        const region = cropRegions[randomIdx];
        sprite.setCrop(region.x, region.y, region.w, region.h);
        sprite.setScale(KENMI_SCALE);
      }  else {
        sprite.setScale(KENMI_SCALE);
      }

      sprite.setDepth(py);

      this.objectSprites.push(sprite);

      if (obj.collide) {
        const collider = this.wallGroup.create(px, py + 20, null);
        collider.setVisible(false);
        collider.body.setSize(obj.collideW || 40, obj.collideH || 20);
        collider.refreshBody();
      }
    });
  }

  // ================================================================
  // Exit triggers
  // ================================================================

  /**
   * Create exit trigger signposts at zone edges
   */
  createExitTriggers(exits, mapW, mapH) {
    exits.forEach((exit) => {
      const { edge, tileRange, label, labelArabic } = exit;
      const midTile = Math.floor((tileRange[0] + tileRange[1]) / 2);

      let signX, signY;
      if (edge === 'north') {
        signX = midTile * TILE + TILE / 2;
        signY = TILE / 2;
      } else if (edge === 'south') {
        signX = midTile * TILE + TILE / 2;
        signY = (mapH - 1) * TILE + TILE / 2;
      } else if (edge === 'west') {
        signX = TILE / 2;
        signY = midTile * TILE + TILE / 2;
      } else {
        signX = (mapW - 1) * TILE + TILE / 2;
        signY = midTile * TILE + TILE / 2;
      }

      const signSprite = this.scene.add.image(signX, signY, 'gate-pillar').setOrigin(0.5, 0.8).setDepth(9998);
      const signLabel = this.scene.add.text(signX, signY - 50, `${labelArabic}\n${label}`, {
        fontFamily: "'Noto Naskh Arabic', serif",
        fontSize: '12px',
        color: '#e2b659',
        stroke: '#2b292c',
        strokeThickness: 3,
        align: 'center',
      }).setOrigin(0.5).setDepth(9999);

      this.exitTriggers.push({
        ...exit,
        signX,
        signY,
        sprite: signSprite,
        label: signLabel,
      });
    });
  }

  // ================================================================
  // Decoration scattering
  // ================================================================

  /**
   * Scatter Kenmi desert/grass props across empty sand tiles for visual density.
   * Uses seeded randomness for deterministic placement, context-aware prop
   * selection, and clustering near objects/water/edges.
   */
  scatterDecorations(zone, groundData, mapW, mapH) {
    const biome = zone.tilesetTheme || 'desert';
    // Phase 97 Plan 05: registry-driven biome gate. If the biome has NO entry in
    // BIOME_DECORATION_SETS (or empty), skip. Previously only desert+grass ran;
    // now snow also runs (via BIOME_DECORATION_SETS.snow).
    const biomePropKeys = BIOME_DECORATION_SETS[biome];
    if (!biomePropKeys || biomePropKeys.length === 0) return;

    // Ensure at least ONE of the biome's decoration textures is loaded before proceeding.
    const anyLoaded = biomePropKeys.some((k) => this.scene.textures.exists(k));
    if (!anyLoaded) return;

    // Create animated grass animations if not yet registered
    this._createDecoGrassAnimations();

    // Build occupied tile set from zone objects (tile coords)
    const occupiedTiles = new Set();
    const objects = zone.objects || [];
    for (const obj of objects) {
      // Mark the object tile and a 1-tile buffer as occupied
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          occupiedTiles.add(`${obj.x + dx},${obj.y + dy}`);
        }
      }
    }

    // Build exit tile set (tiles near exits where decorations should not appear)
    const exitTiles = new Set();
    const exits = zone.exits || [];
    for (const exit of exits) {
      const [start, end] = exit.tileRange;
      for (let t = start - 1; t <= end + 1; t++) {
        if (exit.edge === 'north' || exit.edge === 'south') {
          const ey = exit.edge === 'north' ? 0 : mapH - 1;
          for (let dy = -1; dy <= 1; dy++) {
            exitTiles.add(`${t},${ey + dy}`);
          }
        } else {
          const ex = exit.edge === 'west' ? 0 : mapW - 1;
          for (let dx = -1; dx <= 1; dx++) {
            exitTiles.add(`${ex + dx},${t}`);
          }
        }
      }
    }

    // Prop sets by context — biome-specific
    let NEAR_WATER_PROPS, NEAR_BUILDING_PROPS, EDGE_PROPS, OPEN_PROPS;

    if (biome === 'grass') {
      NEAR_WATER_PROPS = [
        'kenmi-base-outdoor-decoration-flowers',
        'kenmi-base-outdoor-decoration-outdoor-decor',
      ];
      NEAR_BUILDING_PROPS = [
        'kenmi-base-outdoor-decoration-barrels',
        'kenmi-base-outdoor-decoration-hay-bales',
        'kenmi-base-outdoor-decoration-camp-decor',
      ];
      EDGE_PROPS = [
        'kenmi-base-outdoor-decoration-fences',
        'kenmi-base-outdoor-decoration-outdoor-decor',
      ];
      OPEN_PROPS = [
        'kenmi-base-outdoor-decoration-flowers',
        'kenmi-base-outdoor-decoration-outdoor-decor',
        'kenmi-base-outdoor-decoration-hay-bales',
      ];
    } else {
      // desert (default)
      NEAR_WATER_PROPS = [
        'kenmi-desert-props-desert-fern',
        'kenmi-desert-props-fallen-palm-leaves',
        'kenmi-desert-props-desert-grass-props',
      ];
      NEAR_BUILDING_PROPS = [
        'kenmi-desert-props-desert-pots-sacks',
        'kenmi-desert-props-desert-rugs',
        'kenmi-desert-props-sleeping-mat',
        'kenmi-desert-props-golden-pots',
      ];
      EDGE_PROPS = [
        'kenmi-desert-props-dead-bush',
        'kenmi-desert-props-desert-fern-dead',
        'kenmi-desert-props-desert-bones',
        'kenmi-desert-props-fallen-palm-leaves-dead',
      ];
      OPEN_PROPS = [
        'kenmi-desert-props-cactus',
        'kenmi-desert-props-desert-rocks',
        'kenmi-desert-props-dead-bush',
        'kenmi-desert-props-desert-grass-props',
        'kenmi-desert-props-desert-fern',
      ];
    }

    // Animated grass spritesheet keys
    const ANIM_GRASS_KEYS = [
      'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim',
      'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim',
      'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim',
    ];

    const DECO_SEED = 777;

    // Helper: check if tile at (tx,ty) is water
    const isWater = (tx, ty) => {
      if (tx < 0 || tx >= mapW || ty < 0 || ty >= mapH) return false;
      return groundData[ty][tx] === WATER;
    };

    // Helper: check if tile is near water (within radius tiles)
    const nearWater = (tx, ty, radius) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (isWater(tx + dx, ty + dy)) return true;
        }
      }
      return false;
    };

    // Helper: check if tile is near an object (within radius tiles)
    const nearObject = (tx, ty, radius) => {
      for (const obj of objects) {
        const dist = Math.max(Math.abs(obj.x - tx), Math.abs(obj.y - ty));
        if (dist <= radius) return true;
      }
      return false;
    };

    // Helper: check if tile is near map edge
    const nearEdge = (tx, ty, radius) => {
      return tx < radius || ty < radius || tx >= mapW - radius || ty >= mapH - radius;
    };

    // Helper: pick from array using hash
    const pickFrom = (arr, hash) => {
      const key = arr[Math.floor(hash * arr.length)];
      // Only pick if texture is loaded
      return this.scene.textures.exists(key) ? key : null;
    };

    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        const tileType = groundData[y][x];

        // --- Animated grass on GRASS tiles (3% chance) ---
        if (tileType === GRASS || tileType === ICE_GRASS) {
          const grassHash = tileHash(x, y, DECO_SEED + 500);
          if (grassHash < 0.03) {
            const animIdx = Math.floor(tileHash(x, y, DECO_SEED + 501) * ANIM_GRASS_KEYS.length);
            const animKey = ANIM_GRASS_KEYS[animIdx];
            if (this.scene.textures.exists(animKey)) {
              const animName = `deco-grass-${animIdx + 1}`;
              this._ensureDecoGrassAnim(animKey, animName);
              const px = x * TILE + TILE / 2;
              const py = y * TILE + TILE / 2;
              const grassSprite = this.scene.add.sprite(px, py, animKey, 0);
              grassSprite.setScale(KENMI_SCALE);
              grassSprite.setDepth(py);
              grassSprite.setAlpha(0.85 + tileHash(x, y, DECO_SEED + 502) * 0.15);
              grassSprite.play(animName);
              this.decoSprites.push(grassSprite);
            }
          }
          continue; // Don't place sand props on grass tiles
        }

        // Only place sand decorations on SAND-like tiles
        if (!this._isSandLike(tileType)) continue;

        // Skip occupied tiles (objects, exits)
        const tileKey = `${x},${y}`;
        if (occupiedTiles.has(tileKey)) continue;
        if (exitTiles.has(tileKey)) continue;

        // Determine placement chance based on context
        const hash1 = tileHash(x, y, DECO_SEED);
        let chance = 0.04; // base 4%

        const isNearObj = nearObject(x, y, 3);
        const isNearWater = nearWater(x, y, 2);
        const isNearEdge = nearEdge(x, y, 2);

        if (isNearObj) chance = 0.08;
        else if (isNearWater) chance = 0.06;
        else if (isNearEdge) chance = 0.02;

        if (hash1 > chance) continue;

        // Pick a prop based on context
        const hash2 = tileHash(x, y, DECO_SEED + 1);
        let propKey = null;

        if (isNearWater) {
          propKey = pickFrom(NEAR_WATER_PROPS, hash2);
        } else if (isNearObj) {
          propKey = pickFrom(NEAR_BUILDING_PROPS, hash2);
        } else if (isNearEdge) {
          propKey = pickFrom(EDGE_PROPS, hash2);
        } else {
          propKey = pickFrom(OPEN_PROPS, hash2);
        }

        if (!propKey) continue;

        // Rugs are large; reduce their spawn rate by 50%
        if (propKey === 'kenmi-desert-props-desert-rugs') {
          const rugHash = tileHash(x, y, DECO_SEED + 10);
          if (rugHash > 0.5) continue;
        }

        // Random offset within tile for natural look
        const offsetX = (tileHash(x, y, DECO_SEED + 2) - 0.5) * 24;
        const offsetY = (tileHash(x, y, DECO_SEED + 3) - 0.5) * 24;

        const px = x * TILE + TILE / 2 + offsetX;
        const py = y * TILE + TILE / 2 + offsetY;

        const sprite = this._createDecoSprite(px, py, propKey, tileHash(x, y, DECO_SEED + 5));
        if (sprite) {
          this.decoSprites.push(sprite);
        }
      }
    }

    // --- Clustering pass: add prop groups of 2-4 near buildings (DECO-02) ---
    const buildingObjects = (zone.objects || []).filter(obj =>
      obj.key && (
        obj.key.includes('house') || obj.key.includes('tent') ||
        obj.key.includes('temple') || obj.key.includes('pergola') ||
        obj.key.includes('tower') || obj.key.includes('arch') ||
        obj.key.includes('inn') || obj.key.includes('barn') ||
        obj.key.includes('shroom')
      )
    );

    const CLUSTER_PROPS_DESERT = [
      'kenmi-desert-props-desert-pots-sacks',
      'kenmi-desert-props-desert-rugs',
      'kenmi-desert-props-sleeping-mat',
      'kenmi-desert-props-water-sack-on-stick',
      'kenmi-desert-props-fire-pit',
      'kenmi-desert-props-desert-ladder',
    ];

    const CLUSTER_PROPS_GRASS = [
      'kenmi-base-outdoor-decoration-barrels',
      'kenmi-base-outdoor-decoration-camp-decor',
      'kenmi-base-outdoor-decoration-hay-bales',
      'kenmi-base-outdoor-decoration-benches',
    ];

    const clusterProps = biome === 'grass' ? CLUSTER_PROPS_GRASS : CLUSTER_PROPS_DESERT;

    for (let bi = 0; bi < buildingObjects.length; bi++) {
      const bldg = buildingObjects[bi];
      const clusterSize = 2 + Math.floor(tileHash(bldg.x, bldg.y, DECO_SEED + 100) * 3); // 2-4

      
      for (let ci = 0; ci < clusterSize; ci++) {
        // Offset 1.5-3.5 tiles from building in random direction
        const angle = tileHash(bldg.x + ci, bldg.y, DECO_SEED + 101 + ci) * Math.PI * 2;
        const dist = 1.5 + tileHash(bldg.x, bldg.y + ci, DECO_SEED + 102 + ci) * 2;
        const tx = Math.round(bldg.x + Math.cos(angle) * dist);
        const ty = Math.round(bldg.y + Math.sin(angle) * dist);

        // Bounds, occupancy, and water checks
        if (tx < 1 || tx >= mapW - 1 || ty < 1 || ty >= mapH - 1) continue;
        if (occupiedTiles.has(`${tx},${ty}`)) continue;
        if (exitTiles.has(`${tx},${ty}`)) continue;
        if (groundData[ty][tx] === WATER) continue;

        const propIdx = Math.floor(tileHash(tx, ty, DECO_SEED + 200 + ci) * clusterProps.length);
        const propKey = clusterProps[propIdx];
        if (!this.scene.textures.exists(propKey)) continue;

        // Rugs are large; reduce their spawn rate by 50%
        if (propKey === 'kenmi-desert-props-desert-rugs') {
          const rugHash = tileHash(tx, ty, DECO_SEED + 210 + ci);
          if (rugHash > 0.5) continue;
        }

        const offsetX = (tileHash(tx, ty, DECO_SEED + 201) - 0.5) * 16;
        const offsetY = (tileHash(tx, ty, DECO_SEED + 202) - 0.5) * 16;
        const px = tx * TILE + TILE / 2 + offsetX;
        const py = ty * TILE + TILE / 2 + offsetY;

        const sprite = this._createDecoSprite(px, py, propKey, tileHash(tx, ty, DECO_SEED + 203));
        if (sprite) {
          this.decoSprites.push(sprite);
          // Mark occupied so no more props overlap here
          occupiedTiles.add(`${tx},${ty}`);
        }
      }
    }

    // --- Animated campfires: 1-2 per desert zone near center (DECO-03) ---
    if (biome === 'desert' && this.scene.anims.exists('deco-campfire')) {
      const campfireCount = 1 + Math.floor(tileHash(3, 3, DECO_SEED + 300) * 2);
      for (let i = 0; i < campfireCount; i++) {
        const cx = Math.floor(mapW / 2) + Math.floor((tileHash(i, 5, DECO_SEED + 301) - 0.5) * 10);
        const cy = Math.floor(mapH / 2) + Math.floor((tileHash(5, i, DECO_SEED + 302) - 0.5) * 8);
        if (cx < 1 || cx >= mapW - 1 || cy < 1 || cy >= mapH - 1) continue;
        if (occupiedTiles.has(`${cx},${cy}`)) continue;
        if (groundData[cy][cx] === WATER) continue;

        const px = cx * TILE + TILE / 2;
        const py = cy * TILE + TILE / 2;
        const campfire = this.scene.add.sprite(px, py, 'kenmi-military-campfire-pot-anim', 0);
        campfire.setScale(KENMI_SCALE);
        campfire.setDepth(py);
        campfire.play('deco-campfire');
        this.decoSprites.push(campfire);
        occupiedTiles.add(`${cx},${cy}`);
      }
    }

    // --- Animated flies: 2-3 near water/shorelines in desert zones (DECO-03) ---
    if (biome === 'desert' && this.scene.anims.exists('deco-flies')) {
      const fliesCount = 2 + Math.floor(tileHash(7, 7, DECO_SEED + 400) * 2);
      let fliesPlaced = 0;
      for (let y = 0; y < mapH && fliesPlaced < fliesCount; y++) {
        for (let x = 0; x < mapW && fliesPlaced < fliesCount; x++) {
          if (groundData[y][x] !== WATER) continue;
          // Only place on shore-adjacent water tiles
          const hasShore = (x > 0 && groundData[y][x - 1] !== WATER) ||
                           (x < mapW - 1 && groundData[y][x + 1] !== WATER) ||
                           (y > 0 && groundData[y - 1][x] !== WATER) ||
                           (y < mapH - 1 && groundData[y + 1][x] !== WATER);
          if (!hasShore) continue;

          const fHash = tileHash(x, y, DECO_SEED + 401);
          if (fHash > 0.15) continue; // sparse — only ~15% of shore tiles

          const px = x * TILE + TILE / 2;
          const py = y * TILE + TILE / 2 - 16; // slightly above water surface
          const flies = this.scene.add.sprite(px, py, 'kenmi-desert-props-flies-anim', 0);
          flies.setScale(KENMI_SCALE);
          flies.setDepth(py + 1000); // above water layer
          flies.setAlpha(0.7);
          flies.play('deco-flies');
          this.decoSprites.push(flies);
          fliesPlaced++;
        }
      }
    }

    // --- Military banners/flags for bedouin camp ---
    if (zone.id === 'bedouin_camp') {
      const bannerPositions = [
        { x: 7, y: 4 },
        { x: 27, y: 4 },
      ];
      for (let i = 0; i < bannerPositions.length; i++) {
        const bp = bannerPositions[i];
        if (bp.x < 0 || bp.x >= mapW || bp.y < 0 || bp.y >= mapH) continue;
        const animKey = i === 0 ? 'deco-banner' : 'deco-flag';
        const texKey = i === 0 ? 'kenmi-military-banners-anim' : 'kenmi-military-flags-anim';
        if (!this.scene.anims.exists(animKey)) continue;
        const px = bp.x * TILE + TILE / 2;
        const py = bp.y * TILE + TILE / 2;
        const banner = this.scene.add.sprite(px, py, texKey, 0);
        banner.setScale(KENMI_SCALE);
        banner.setDepth(py);
        banner.play(animKey);
        this.decoSprites.push(banner);
      }
    }
  }

  /**
   * Create a decoration sprite for the given prop key at world position (px, py).
   * For multi-item sheets (listed in PROP_CROP_REGIONS), picks one random crop region
   * and renders it at KENMI_SCALE. For single-item or large-object images, renders at
   * native size (already appropriately sized for the game grid).
   * @param {number} px - World X position
   * @param {number} py - World Y position
   * @param {string} propKey - Kenmi texture key
   * @param {number} hash - A [0,1) value used to pick crop variant
   * @returns {Phaser.GameObjects.Image|null}
   */
  _createDecoSprite(px, py, propKey, hash) {
    if (!this.scene.textures.exists(propKey)) return null;

    const sprite = this.scene.add.image(px, py, propKey);

    const cropRegions = PROP_CROP_REGIONS[propKey];
    if (cropRegions && cropRegions.length > 0) {
      // Multi-item sheet: pick one region, crop to it, then scale 4x
      const regionIdx = Math.floor(hash * cropRegions.length);
      const region = cropRegions[regionIdx];
      sprite.setCrop(region.x, region.y, region.w, region.h);
      sprite.setScale(KENMI_SCALE);
    } else {
      // Not in crop list — check texture source dimensions
      const tex = this.scene.textures.get(propKey);
      const src = tex.source[0];
      const srcW = src ? src.width : 16;
      if (srcW <= 16) {
        // Small single-item: scale 4x
        sprite.setScale(KENMI_SCALE);
      } else {
        // Larger single-object image (e.g. palm-tree, acacia-tree): render at native size
        // These are already sized for the visual world (80-240px wide)
        sprite.setScale(1);
      }
    }

    sprite.setDepth(py- sprite.displayHeight); // Y-sort depth

    return sprite;
  }

  /**
   * Create animated grass, campfire, and flies decoration animations (run once)
   */
  _createDecoGrassAnimations() {
    // Pre-create all 3 grass animation configs
    const grassSheets = [
      { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', anim: 'deco-grass-1' },
      { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', anim: 'deco-grass-2' },
      { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', anim: 'deco-grass-3' },
    ];
    for (const { key, anim } of grassSheets) {
      this._ensureDecoGrassAnim(key, anim);
    }

    // Campfire animation (DECO-03)
    const campfireKey = 'kenmi-military-campfire-pot-anim';
    if (this.scene.textures.exists(campfireKey) && !this.scene.anims.exists('deco-campfire')) {
      const tex = this.scene.textures.get(campfireKey);
      const frameCount = tex.frameTotal - 1;
      if (frameCount > 0) {
        this.scene.anims.create({
          key: 'deco-campfire',
          frames: this.scene.anims.generateFrameNumbers(campfireKey, { start: 0, end: frameCount - 1 }),
          frameRate: 6,
          repeat: -1,
        });
      }
    }

    // Flies animation (DECO-03)
    const fliesKey = 'kenmi-desert-props-flies-anim';
    if (this.scene.textures.exists(fliesKey) && !this.scene.anims.exists('deco-flies')) {
      const tex = this.scene.textures.get(fliesKey);
      const frameCount = tex.frameTotal - 1;
      if (frameCount > 0) {
        this.scene.anims.create({
          key: 'deco-flies',
          frames: this.scene.anims.generateFrameNumbers(fliesKey, { start: 0, end: frameCount - 1 }),
          frameRate: 8,
          repeat: -1,
        });
      }
    }

    // Military banner and flag animations for bedouin camp
    const bannerKey = 'kenmi-military-banners-anim';
    if (this.scene.textures.exists(bannerKey) && !this.scene.anims.exists('deco-banner')) {
      const tex = this.scene.textures.get(bannerKey);
      const frameCount = tex.frameTotal - 1;
      if (frameCount > 0) {
        this.scene.anims.create({
          key: 'deco-banner',
          frames: this.scene.anims.generateFrameNumbers(bannerKey, { start: 0, end: frameCount - 1 }),
          frameRate: 5,
          repeat: -1,
        });
      }
    }

    const flagKey = 'kenmi-military-flags-anim';
    if (this.scene.textures.exists(flagKey) && !this.scene.anims.exists('deco-flag')) {
      const tex = this.scene.textures.get(flagKey);
      const firstFlagFrames = 6;
      const frameCount = firstFlagFrames - 1;
      if (frameCount > 0) {
        this.scene.anims.create({
          key: 'deco-flag',
          frames: this.scene.anims.generateFrameNumbers(flagKey, { start: 0, end: frameCount - 1 }),
          frameRate: 5,
          repeat: -1,
        });
      }
    }
  }

  /**
   * Ensure a single animated grass animation exists
   */
  _ensureDecoGrassAnim(textureKey, animName) {
    if (this.scene.anims.exists(animName)) return;
    if (!this.scene.textures.exists(textureKey)) return;

    // Get frame count from texture
    const tex = this.scene.textures.get(textureKey);
    const frameCount = tex.frameTotal - 1; // subtract __BASE frame
    if (frameCount <= 0) return;

    this.scene.anims.create({
      key: animName,
      frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: frameCount - 1 }),
      frameRate: 4 + Math.floor(Math.random() * 3), // 4-6 fps for natural sway
      repeat: -1,
    });
  }

  // ================================================================
  // Ambient animals
  // ================================================================

  /**
   * Spawn ambient desert animals (camels, vultures, scarabs) as non-interactive
   * decoration sprites. Uses seeded placement for deterministic positions.
   */
  spawnAmbientAnimals(zone, groundData, mapW, mapH) {
    // Phase 97 Plan 05: registry-driven biome gate. Previously desert-only; now
    // grass (farmland, coastal_port) and snow (mountain_village) also get ambient life.
    const tilesetTheme = zone.tilesetTheme || 'desert';
    const biomeAnimalKeys = BIOME_ANIMAL_SETS[tilesetTheme];
    if (!biomeAnimalKeys || biomeAnimalKeys.length === 0) return;

    const anyAnimalLoaded = biomeAnimalKeys.some((k) => this.scene.textures.exists(k));
    if (!anyAnimalLoaded) return;

    // Create animal animations if they don't already exist
    this._createAnimalAnimations();

    // Build occupied tile set from zone objects (with 3-tile buffer)
    const objects = zone.objects || [];
    const occupiedSet = new Set();
    for (const obj of objects) {
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          occupiedSet.add(`${obj.x + dx},${obj.y + dy}`);
        }
      }
    }

    // Helper: check if tile at (tx,ty) is water
    const isWater = (tx, ty) => {
      if (tx < 0 || tx >= mapW || ty < 0 || ty >= mapH) return false;
      return groundData[ty][tx] === WATER;
    };

    // Helper: check if tile is near water (within radius tiles)
    const nearWater = (tx, ty, radius) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (isWater(tx + dx, ty + dy)) return true;
        }
      }
      return false;
    };

    // Helper: is tile valid for placement (sand, not occupied, not water, not near water within minDist)
    const isValidSandTile = (tx, ty, minWaterDist) => {
      if (tx < 0 || tx >= mapW || ty < 0 || ty >= mapH) return false;
      if (!this._isSandLike(groundData[ty][tx])) return false;
      if (occupiedSet.has(`${tx},${ty}`)) return false;
      if (minWaterDist > 0 && nearWater(tx, ty, minWaterDist)) return false;
      return true;
    };

    const ANIMAL_SEED = 4242;

    // --- Camels: 2-3 on sand tiles, away from buildings/water ---
    const camelCount = 2 + Math.floor(tileHash(0, 0, ANIMAL_SEED) * 2); // 2 or 3
    const camelVariants = ['kenmi-desert-animals-camel-camel-1', 'kenmi-desert-animals-camel-camel-2', 'kenmi-desert-animals-camel-camel-3'];
    const camelAnimKeys = ['camel-idle-1', 'camel-idle-2', 'camel-idle-3'];

    for (let i = 0; i < camelCount; i++) {
      // Find a valid sand tile using seeded scan
      const seedX = tileHash(i, 0, ANIMAL_SEED + 10);
      const seedY = tileHash(0, i, ANIMAL_SEED + 11);
      let placed = false;

      // Spiral outward from seeded start position
      const startX = Math.floor(seedX * (mapW - 6)) + 3;
      const startY = Math.floor(seedY * (mapH - 6)) + 3;

      for (let r = 0; r < Math.max(mapW, mapH) && !placed; r++) {
        for (let dy = -r; dy <= r && !placed; dy++) {
          for (let dx = -r; dx <= r && !placed; dx++) {
            if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue; // only perimeter
            const tx = startX + dx;
            const ty = startY + dy;
            if (isValidSandTile(tx, ty, 3)) {
              const variantIdx = Math.floor(tileHash(tx, ty, ANIMAL_SEED + 12) * camelVariants.length);
              const textureKey = camelVariants[variantIdx];
              if (!this.scene.textures.exists(textureKey)) continue;

              const animKey = camelAnimKeys[variantIdx];
              const px = tx * TILE + TILE / 2;
              const py = ty * TILE + TILE / 2;

              const sprite = this.scene.add.sprite(px, py, textureKey, 0);
              sprite.setScale(KENMI_SCALE);
              sprite.setDepth(py);
              if (this.scene.anims.exists(animKey)) {
                sprite.play(animKey);
              }
              // Random facing direction
              if (tileHash(tx, ty, ANIMAL_SEED + 13) > 0.5) {
                sprite.setFlipX(true);
              }

              this.animalSprites.push(sprite);
              // Mark tile as occupied so next camel doesn't overlap
              for (let ody = -2; ody <= 2; ody++) {
                for (let odx = -2; odx <= 2; odx++) {
                  occupiedSet.add(`${tx + odx},${ty + ody}`);
                }
              }
              placed = true;
            }
          }
        }
      }
    }

    // --- Vultures: 1-2 near edges of map, flying overhead ---
    const vultureCount = 1 + Math.floor(tileHash(1, 1, ANIMAL_SEED + 20) * 2); // 1 or 2
    const vultureVariants = [
      'kenmi-desert-animals-vulture-vulture-1',
      'kenmi-desert-animals-vulture-vulture-2',
      'kenmi-desert-animals-vulture-vulture-3',
      'kenmi-desert-animals-vulture-vulture-4',
    ];
    const vultureAnimKeys = [
      'vulture-fly-1', 'vulture-fly-2', 'vulture-fly-3', 'vulture-fly-4',
    ];

    for (let i = 0; i < vultureCount; i++) {
      const seedVal = tileHash(i, 2, ANIMAL_SEED + 21);
      // Place near map edges
      let tx, ty;
      const edgeSide = Math.floor(tileHash(i, 3, ANIMAL_SEED + 22) * 4);
      const along = tileHash(i, 4, ANIMAL_SEED + 23);

      if (edgeSide === 0) { // top
        tx = Math.floor(along * mapW);
        ty = Math.floor(seedVal * 3);
      } else if (edgeSide === 1) { // bottom
        tx = Math.floor(along * mapW);
        ty = mapH - 1 - Math.floor(seedVal * 3);
      } else if (edgeSide === 2) { // left
        tx = Math.floor(seedVal * 3);
        ty = Math.floor(along * mapH);
      } else { // right
        tx = mapW - 1 - Math.floor(seedVal * 3);
        ty = Math.floor(along * mapH);
      }

      tx = Math.max(0, Math.min(mapW - 1, tx));
      ty = Math.max(0, Math.min(mapH - 1, ty));

      // Vultures fly, so they don't need valid ground — just need to be on sand-ish area
      if (tx >= 0 && tx < mapW && ty >= 0 && ty < mapH) {
        const variantIdx = Math.floor(tileHash(tx, ty, ANIMAL_SEED + 24) * vultureVariants.length);
        const textureKey = vultureVariants[variantIdx];
        if (!this.scene.textures.exists(textureKey)) continue;

        const animKey = vultureAnimKeys[variantIdx];
        const px = tx * TILE + TILE / 2;
        const py = ty * TILE + TILE / 2;

        const sprite = this.scene.add.sprite(px, py, textureKey, 0);
        sprite.setScale(KENMI_SCALE);
        sprite.setDepth(9000); // High depth — flying above everything
        sprite.setAlpha(0.9);
        if (this.scene.anims.exists(animKey)) {
          sprite.play(animKey);
        }
        // Random facing direction
        if (tileHash(tx, ty, ANIMAL_SEED + 25) > 0.5) {
          sprite.setFlipX(true);
        }

        this.animalSprites.push(sprite);
      }
    }

    // --- Scarabs: 2-4 near water or on open sand ---
    const scarabCount = 2 + Math.floor(tileHash(2, 2, ANIMAL_SEED + 30) * 3); // 2-4
    const scarabVariants = [
      'kenmi-desert-animals-scarab-scarab-black',
      'kenmi-desert-animals-scarab-scarab-brown',
      'kenmi-desert-animals-scarab-scarab-green',
      'kenmi-desert-animals-scarab-scarab-yellow',
    ];
    const scarabAnimKeys = [
      'scarab-crawl-black', 'scarab-crawl-brown', 'scarab-crawl-green', 'scarab-crawl-yellow',
    ];

    for (let i = 0; i < scarabCount; i++) {
      const seedX = tileHash(i, 5, ANIMAL_SEED + 31);
      const seedY = tileHash(5, i, ANIMAL_SEED + 32);
      let placed = false;

      // Try to find sand tile near water (within 3 tiles)
      const startX = Math.floor(seedX * (mapW - 4)) + 2;
      const startY = Math.floor(seedY * (mapH - 4)) + 2;

      for (let r = 0; r < Math.max(mapW, mapH) && !placed; r++) {
        for (let dy = -r; dy <= r && !placed; dy++) {
          for (let dx = -r; dx <= r && !placed; dx++) {
            if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
            const tx = startX + dx;
            const ty = startY + dy;
            if (tx < 0 || tx >= mapW || ty < 0 || ty >= mapH) continue;
            if (!this._isSandLike(groundData[ty][tx])) continue;
            if (occupiedSet.has(`${tx},${ty}`)) continue;
            // Prefer tiles near water (within 3 tiles)
            if (!nearWater(tx, ty, 3) && r < Math.max(mapW, mapH) / 2) continue;

            const variantIdx = Math.floor(tileHash(tx, ty, ANIMAL_SEED + 33) * scarabVariants.length);
            const textureKey = scarabVariants[variantIdx];
            if (!this.scene.textures.exists(textureKey)) continue;

            const animKey = scarabAnimKeys[variantIdx];
            const px = tx * TILE + TILE / 2;
            const py = ty * TILE + TILE / 2;

            const sprite = this.scene.add.sprite(px, py, textureKey, 0);
            sprite.setScale(KENMI_SCALE);
            sprite.setDepth(py);
            if (this.scene.anims.exists(animKey)) {
              sprite.play(animKey);
            }
            // Random facing direction
            if (tileHash(tx, ty, ANIMAL_SEED + 34) > 0.5) {
              sprite.setFlipX(true);
            }

            this.animalSprites.push(sprite);
            occupiedSet.add(`${tx},${ty}`);
            placed = true;
          }
        }
      }
    }
  }

  /**
   * Create Phaser animations for ambient animals (run once per scene).
   * Camels: frames 0-3 at 4fps, Vultures: frames 0-5 at 6fps, Scarabs: frames 0-3 at 4fps.
   */
  _createAnimalAnimations() {
    const scene = this.scene;

    // Helper: safely generate frame indices within the spritesheet's actual frame count.
    // Prevents animation errors if a sprite has fewer frames than expected.
    const safeFrames = (texture, maxFrames) => {
      const tex = scene.textures.get(texture);
      // Object.keys includes '__BASE' so subtract 1 for actual frame count
      const total = tex ? Math.max(0, Object.keys(tex.frames).length - 1) : 0;
      const count = Math.min(maxFrames, total);
      const frames = [];
      for (let i = 0; i < count; i++) frames.push(i);
      return frames;
    };

    // Camel idle animations (3 variants)
    const camelVariants = [
      { texture: 'kenmi-desert-animals-camel-camel-1', anim: 'camel-idle-1' },
      { texture: 'kenmi-desert-animals-camel-camel-2', anim: 'camel-idle-2' },
      { texture: 'kenmi-desert-animals-camel-camel-3', anim: 'camel-idle-3' },
    ];
    for (const { texture, anim } of camelVariants) {
      if (!scene.anims.exists(anim) && scene.textures.exists(texture)) {
        const frames = safeFrames(texture, 4);
        if (frames.length === 0) continue;
        scene.anims.create({
          key: anim,
          frames: scene.anims.generateFrameNumbers(texture, { frames }),
          frameRate: 4,
          repeat: -1,
        });
      }
    }

    // Vulture flying animations (4 variants)
    const vultureVariants = [
      { texture: 'kenmi-desert-animals-vulture-vulture-1', anim: 'vulture-fly-1' },
      { texture: 'kenmi-desert-animals-vulture-vulture-2', anim: 'vulture-fly-2' },
      { texture: 'kenmi-desert-animals-vulture-vulture-3', anim: 'vulture-fly-3' },
      { texture: 'kenmi-desert-animals-vulture-vulture-4', anim: 'vulture-fly-4' },
    ];
    for (const { texture, anim } of vultureVariants) {
      if (!scene.anims.exists(anim) && scene.textures.exists(texture)) {
        const frames = safeFrames(texture, 6);
        if (frames.length === 0) continue;
        scene.anims.create({
          key: anim,
          frames: scene.anims.generateFrameNumbers(texture, { frames }),
          frameRate: 6,
          repeat: -1,
        });
      }
    }

    // Scarab crawl animations (4 color variants)
    const scarabVariants = [
      { texture: 'kenmi-desert-animals-scarab-scarab-black', anim: 'scarab-crawl-black' },
      { texture: 'kenmi-desert-animals-scarab-scarab-brown', anim: 'scarab-crawl-brown' },
      { texture: 'kenmi-desert-animals-scarab-scarab-green', anim: 'scarab-crawl-green' },
      { texture: 'kenmi-desert-animals-scarab-scarab-yellow', anim: 'scarab-crawl-yellow' },
    ];
    for (const { texture, anim } of scarabVariants) {
      if (!scene.anims.exists(anim) && scene.textures.exists(texture)) {
        const frames = safeFrames(texture, 4);
        if (frames.length === 0) continue;
        scene.anims.create({
          key: anim,
          frames: scene.anims.generateFrameNumbers(texture, { frames }),
          frameRate: 4,
          repeat: -1,
        });
      }
    }
  }

  // ================================================================
  // Helpers
  // ================================================================

  /**
   * Build a set of edge:tile keys where exits exist (to leave gaps in border walls)
   */
  buildExitEdgeSet(exits, _mapW, _mapH) {
    const set = new Set();
    for (const exit of exits) {
      const [start, end] = exit.tileRange;
      for (let t = start; t <= end; t++) {
        set.add(`${exit.edge}:${t}`);
      }
    }
    return set;
  }

  /**
   * Add an invisible wall to the collision group
   */
  addInvisibleWall(x, y, w, h) {
    const wall = this.wallGroup.create(x, y, null);
    wall.setVisible(false);
    wall.body.setSize(w, h);
    wall.refreshBody();
  }

  /**
   * Get ground sprites for cleanup
   */
  getGroundSprites() {
    return this.groundSprites;
  }

  /**
   * Get object sprites for cleanup
   */
  getObjectSprites() {
    return this.objectSprites;
  }

  /**
   * Get exit triggers for zone transition checking
   */
  getExitTriggers() {
    return this.exitTriggers;
  }

  /**
   * Destroy all map elements
   */
  destroy() {
    this.activeTweens.forEach((t) => { if (t) t.remove(); });
    this.activeTweens = [];

    this.groundSprites.forEach((s) => s.destroy());
    this.groundSprites = [];

    this.objectSprites.forEach((s) => s.destroy());
    this.objectSprites = [];

    this.decoSprites.forEach((s) => s.destroy());
    this.decoSprites = [];

    this.animalSprites.forEach((s) => s.destroy());
    this.animalSprites = [];

    this.exitTriggers.forEach((et) => {
      if (et.sprite) et.sprite.destroy();
      if (et.label) et.label.destroy();
    });
    this.exitTriggers = [];

    if (this.wallGroup) {
      this.wallGroup.clear(true, true);
      this.wallGroup = null;
    }
  }
}
