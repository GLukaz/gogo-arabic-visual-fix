/**
 * Zone Asset Manifests -- separates shared (upfront) from zone-specific (on-demand) assets.
 *
 * SHARED_ASSETS: Loaded in BootScene.preload() -- always needed regardless of zone.
 * ZONE_ASSET_MANIFESTS: Loaded on zone transition via loadZoneAssets().
 *
 * Each entry: { key: string, path: string, type: 'image'|'spritesheet', frameWidth?, frameHeight? }
 *
 * As of Phase 97 Plan 02 (2026-04-18): Kenmi desert tile PNGs are loaded exclusively
 * through KENMI_CATALOG (src/data/kenmiCatalog.js) -- duplicate registrations that
 * previously lived in DESERT_TILESETS have been removed. ZONE_ASSET_MANIFESTS now
 * hold per-zone extensions only; currently empty for all 8 core zones.
 */

const BODY_OUTFITS = [
  'simple-thobe', 'simple-abaya', 'travellers-cloak',
  'desert-thobe', 'blue-thobe', 'green-abaya',
  'scholars-robe', 'merchants-vest', 'bedouin-wrap',
  'mountain-cloak', 'captains-coat', 'royal-garment',
];

const HEAD_COVERINGS = ['kufi', 'ghutra', 'turban', 'hijab', 'hood', 'none'];

const FACELESS_NPCS = [
  'scholar-yusuf', 'merchant-fatima', 'student-khalid',
  'librarian-ibrahim', 'scribe-amina',
  'trader-hassan', 'spice-seller-layla',
  'farmer-omar', 'herbalist-maryam',
  'elder-tariq', 'storyteller-noor',
  'guide-salim', 'weaver-zahra',
  'captain-rashid', 'fishmonger-hana',
  'vizier-abbas', 'princess-aisha', 'guard-hamza',
  'wanderer-ali', 'healer-khadija', 'imam-muhammad',
  'blacksmith-daud', 'poet-rumi', 'guide-amira',
];

const bodyAssets = BODY_OUTFITS.map((outfit) => ({
  key: `body-${outfit}`,
  path: `/assets/sprites/player/bodies/${outfit}.png`,
  type: 'spritesheet',
  frameWidth: 128,
  frameHeight: 128,
}));

const headAssets = HEAD_COVERINGS.map((covering) => ({
  key: `head-${covering}`,
  path: `/assets/sprites/player/heads/${covering}.png`,
  type: 'spritesheet',
  frameWidth: 128,
  frameHeight: 128,
}));

const npcSprites = FACELESS_NPCS.map((npcId) => ({
  key: `npc-${npcId}`,
  path: `/assets/sprites/npcs/faceless/${npcId}.png`,
  type: 'spritesheet',
  frameWidth: 128,
  frameHeight: 128,
}));

const npcPortraits = FACELESS_NPCS.map((npcId) => ({
  key: `portrait-${npcId}`,
  path: `/assets/portraits/${npcId}.png`,
  type: 'image',
}));

/**
 * Assets loaded in BootScene.preload() -- shared across all zones.
 * Always available; no zone-transition delay.
 */
export const SHARED_ASSETS = [
  // Tilesets
  { key: 'tileset-world', path: '/assets/tilesets/world.png', type: 'image' },
  { key: 'tileset-coast', path: '/assets/tilesets/coast.png', type: 'image' },
  { key: 'tileset-indoor', path: '/assets/tilesets/indoor.png', type: 'image' },

  // Ground tiles (flat fallback -- needed until Kenmi terrain is fixed)
  { key: 'tile-sand', path: '/assets/sprites/objects/sand.png', type: 'image' },
  { key: 'tile-grass', path: '/assets/sprites/objects/grass.png', type: 'image' },
  { key: 'grass-ice', path: '/assets/sprites/objects/grass_ice.png', type: 'image' },

  // World tileset spritesheet
  { key: 'world-tileset', path: '/assets/tilesets/world.png', type: 'spritesheet', frameWidth: 64, frameHeight: 64 },

  // Desert tiles spritesheet
  {
    key: 'desert-tiles',
    path: '/assets/tilesets/desert-32x32/Desert Tileset 32x32/DESERT TILESET 32x32.png',
    type: 'spritesheet',
    frameWidth: 32,
    frameHeight: 32,
  },

  // Player body spritesheets (12 outfits)
  ...bodyAssets,

  // Legacy player fallback
  { key: 'player', path: '/assets/sprites/player/bodies/simple-thobe.png', type: 'spritesheet', frameWidth: 128, frameHeight: 128 },

  // Player head coverings (6 coverings)
  ...headAssets,

  // NPC sprites (23 faceless NPCs)
  ...npcSprites,

  // NPC portraits (23 silhouettes)
  ...npcPortraits,

  // Object sprites (exit markers + special)
  { key: 'hospital', path: '/assets/sprites/objects/hospital.png', type: 'image' },
  { key: 'gate-pillar', path: '/assets/sprites/objects/gate_pillar.png', type: 'image' },
  { key: 'gate-top', path: '/assets/sprites/objects/gate_top.png', type: 'image' },
  { key: 'shadow', path: '/assets/sprites/shadow.png', type: 'image' },

  // UI icons
  { key: 'ui-alert', path: '/assets/ui/alert.png', type: 'image' },
  { key: 'ui-star', path: '/assets/ui/star.png', type: 'image' },
  { key: 'ui-health', path: '/assets/ui/health.png', type: 'image' },
  { key: 'ui-energy', path: '/assets/ui/energy.png', type: 'image' },
  { key: 'ui-shield', path: '/assets/ui/shield.png', type: 'image' },
  { key: 'ui-sword', path: '/assets/ui/sword.png', type: 'image' },
  { key: 'ui-cross', path: '/assets/ui/cross.png', type: 'image' },
  { key: 'ui-hand', path: '/assets/ui/hand.png', type: 'image' },
  { key: 'ui-arrows', path: '/assets/ui/arrows.png', type: 'image' },

  // Backgrounds
  { key: 'bg-sand', path: '/assets/backgrounds/sand.png', type: 'image' },
  { key: 'bg-forest', path: '/assets/backgrounds/forest.png', type: 'image' },
  { key: 'bg-ice', path: '/assets/backgrounds/ice.png', type: 'image' },

  // BDragon panels
  { key: 'bdragon-border-1', path: '/assets/ui/bdragon-panels/Border All 1.png', type: 'image' },
  { key: 'bdragon-border-2', path: '/assets/ui/bdragon-panels/Border All 2.png', type: 'image' },
  { key: 'bdragon-border-3', path: '/assets/ui/bdragon-panels/Border All 3.png', type: 'image' },
  { key: 'bdragon-border-4', path: '/assets/ui/bdragon-panels/Border All 4.png', type: 'image' },
  { key: 'bdragon-deco-1', path: '/assets/ui/bdragon-panels/Deco All 1.png', type: 'image' },
  { key: 'bdragon-deco-2', path: '/assets/ui/bdragon-panels/Deco All 2.png', type: 'image' },

  // RPG UI Kit
  { key: 'rpg-ui-tiles', path: '/assets/ui/rpg-ui-kit/PNG/Main_tiles.png', type: 'image' },
  { key: 'rpg-ui-buttons', path: '/assets/ui/rpg-ui-kit/PNG/Buttons.png', type: 'image' },
  { key: 'rpg-ui-icons', path: '/assets/ui/rpg-ui-kit/PNG/Icons.png', type: 'image' },
];

/**
 * Per-zone asset lists loaded on demand during zone transition.
 * Assets in these lists are NOT loaded at boot -- only when the player first visits the zone.
 * On revisit the TextureManager cache is checked; already-loaded assets are skipped.
 *
 * Phase 97 Plan 02: empty for all 8 core zones. Kenmi desert tiles are now loaded
 * exclusively through KENMI_CATALOG at BootScene preload time.
 */
export const ZONE_ASSET_MANIFESTS = {
  oasis_village: [],
  ancient_library: [],
  desert_marketplace: [],
  farmland: [],
  bedouin_camp: [],
  mountain_village: [],
  coastal_port: [],
  royal_palace: [],
};

/**
 * Dynamically load zone-specific assets on the active Phaser scene.
 * Skips assets already in TextureManager (previously loaded zones).
 *
 * @param {Phaser.Scene} scene - The currently active scene (must be started)
 * @param {string} zoneId - Zone key from zones.js (e.g. 'oasis_village')
 * @returns {Promise<void>} Resolves when all zone assets are loaded
 */
export async function loadZoneAssets(scene, zoneId) {
  const manifest = ZONE_ASSET_MANIFESTS[zoneId] || [];
  const toLoad = manifest.filter((a) => !scene.textures.exists(a.key));

  if (toLoad.length === 0) return; // All cached from previous visit

  return new Promise((resolve) => {
    toLoad.forEach((asset) => {
      if (asset.type === 'spritesheet') {
        scene.load.spritesheet(asset.key, asset.path, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
      } else {
        scene.load.image(asset.key, asset.path);
      }
    });
    scene.load.once('complete', resolve);
    scene.load.start();
  });
}
