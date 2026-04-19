/**
 * BIOME_BUILDING_SETS — Maps each tilesetTheme to its Kenmi building key arrays.
 * Consumed by mapPlaceholder.js and zone data files to select biome-appropriate buildings.
 */
export const BIOME_BUILDING_SETS = {
  desert: {
    small: [
      'kenmi-desert-houses-desert-house-1.1',
      'kenmi-desert-houses-desert-house-1.2',
      'kenmi-desert-houses-desert-house-1.3',
      'kenmi-desert-houses-desert-house-1.4',
      'kenmi-desert-houses-desert-house-2.1',
      'kenmi-desert-houses-desert-house-2.2',
      'kenmi-desert-houses-desert-house-2.3',
      'kenmi-desert-houses-desert-house-2.4',
    ],
    large: [
      'kenmi-desert-houses-desert-house-3.1',
      'kenmi-desert-houses-desert-house-3.2',
      'kenmi-desert-houses-desert-house-3.3',
      'kenmi-desert-houses-desert-house-3.4',
      'kenmi-desert-houses-desert-house-4.1',
      'kenmi-desert-houses-desert-house-4.2',
      'kenmi-desert-houses-desert-house-4.3',
      'kenmi-desert-houses-desert-house-4.4',
    ],
    temple: 'kenmi-desert-temple-desert-temple',
    pergola: 'kenmi-desert-houses-pergola',
    fence: 'kenmi-desert-props-desert-fencewall',
    obelisk: 'kenmi-desert-temple-desert-obelisk-1',
    obeliskSmall: 'kenmi-desert-temple-desert-obelisk-small-1',
  },
  grass: {
    small: [
      'kenmi-base-buildings-buildings-houses-wood-house-1-wood-base-blue',
      'kenmi-base-buildings-buildings-houses-wood-house-2-wood-base-blue',
      'kenmi-base-buildings-buildings-houses-wood-house-3-wood-base-red',
      'kenmi-base-buildings-buildings-houses-wood-house-4-wood-green-blue',
      'kenmi-base-buildings-buildings-houses-wood-house-5-wood-base-black',
    ],
    large: [
      'kenmi-base-buildings-buildings-houses-stone-house-1-stone-base-blue',
      'kenmi-base-buildings-buildings-houses-stone-house-2-stone-base-blue',
      'kenmi-base-buildings-buildings-houses-stone-house-3-stone-green-blue',
      'kenmi-base-buildings-buildings-unique-buildings-inn-inn-blue',
      'kenmi-base-buildings-buildings-unique-buildings-fisherman-house-fisherman-house-base-blue',
    ],
    barn: 'kenmi-base-buildings-buildings-unique-buildings-barn-barn-base-blue',
    stall: 'kenmi-base-buildings-buildings-unique-buildings-stalls-market-stalls',
  },
  snow: {
    small: [
      'kenmi-base-buildings-buildings-houses-stone-house-1-stone-base-black',
      // Phase 97 Plan 06: stone-house-2-stone-base-black has a catalog-gen typo (blackpng suffix).
      // Use stone-house-3-stone-base-blue as a working replacement; preserves dark-stone variety.
      'kenmi-base-buildings-buildings-houses-stone-house-3-stone-base-blue',
      'kenmi-base-buildings-buildings-houses-limestone-house-1-limestone-base-black',
      'kenmi-base-buildings-buildings-houses-limestone-house-2-limestone-base-black',
    ],
    large: [
      'kenmi-base-buildings-buildings-houses-limestone-house-3-limestone-base-black',
      'kenmi-base-buildings-buildings-houses-limestone-house-4-limestone-base-black',
      'kenmi-base-buildings-buildings-houses-limestone-house-5-limestone-base-black',
      'kenmi-base-buildings-buildings-unique-buildings-inn-inn-black',
    ],
  },
  military: {
    tent: 'kenmi-military-military-tents',
    lookout: 'kenmi-military-lookout-towers',
    palisade: 'kenmi-military-palisade',
  },
  dungeon: {
    arch: 'kenmi-dungeons-dungeon-1-dungeon-1-arch',
    archOpen: 'kenmi-dungeons-dungeon-1-dungeon-1-arch-open',
    pillars: 'kenmi-dungeons-dungeon-1-dungeon-1-pillars',
    gate: 'kenmi-dungeons-dungeon-1-dungeon-1-gate-closed',
    stairs: 'kenmi-dungeons-dungeon-1-dungeon-1-stairs',
  },
  mushroom: {
    small: [
      'kenmi-shroom-houses-shroomlinng-house-1',
      'kenmi-shroom-houses-shroomlinng-house-2',
    ],
    large: [
      'kenmi-shroom-houses-shroomlinng-house-3',
      'kenmi-shroom-houses-shroomlinng-house-3.5',
    ],
  },
  volcano: {
    tower: 'kenmi-volcano-buildings-volcano-tower',
  },
};

/**
 * BIOME_DECORATION_SETS — Prop keys available for scatterDecorations per biome.
 * Phase 97 Plan 05.
 *
 * Cultural constraint (per CONTEXT + research Pitfall 6):
 *   NO crosses, Santa, reindeer, Halloween/pumpkin items, or explicit Christian imagery.
 *   Snowmen, chimneys, neutral pine trees, chocolate are OK.
 *
 * CULTURAL_EXCLUDES below is enforced at module load time — if a banned key is
 * added here the import itself throws.
 */
export const BIOME_DECORATION_SETS = {
  desert: [
    'kenmi-desert-props-palm-tree-1',
    'kenmi-desert-props-palm-tree-2',
    'kenmi-desert-props-acacia-tree',
    'kenmi-desert-props-halfdead-tree',
    'kenmi-desert-props-dead-tree',
    'kenmi-desert-props-ambarakaman-plant',
    'kenmi-desert-props-desert-rocks',
  ],
  grass: [
    'kenmi-base-outdoor-decoration-barrels',
    'kenmi-base-outdoor-decoration-benches',
    'kenmi-base-outdoor-decoration-fences',
    'kenmi-base-outdoor-decoration-flowers',
    'kenmi-base-outdoor-decoration-fountain',
    'kenmi-base-outdoor-decoration-hay-bales',
    'kenmi-base-outdoor-decoration-lantern',
    'kenmi-base-outdoor-decoration-nests',
  ],
  snow: [
    'kenmi-christmas-decorations-snowman-1-anim',
    'kenmi-christmas-decorations-snowman-2-anim',
    'kenmi-christmas-decorations-chocolate-chimney',
    'kenmi-christmas-decorations-decor',
  ],
};

/**
 * BIOME_ANIMAL_SETS — Animal sprite keys available for spawnAmbientAnimals per biome.
 * Phase 97 Plan 05.
 *
 * Keys here must be registered in KENMI_CATALOG as spritesheets — frame sizes vary
 * (see kenmiCatalog.js for per-entry frameWidth / frameHeight).
 */
export const BIOME_ANIMAL_SETS = {
  desert: [
    'kenmi-desert-animals-camel-camel-1',
    'kenmi-desert-animals-camel-camel-2',
    'kenmi-desert-animals-camel-camel-3',
    'kenmi-desert-animals-vulture-vulture-1',
    'kenmi-desert-animals-vulture-vulture-2',
    'kenmi-desert-animals-scarab-scarab-black',
    'kenmi-desert-animals-scarab-scarab-brown',
  ],
  grass: [
    'kenmi-base-animals-chicken-chicken-01',
    'kenmi-base-animals-chicken-chicken-02',
    'kenmi-base-animals-chicken-chicken-03',
    'kenmi-base-animals-bee-bee-flying-animation',
    'kenmi-base-animals-butterfly-butterfly',
  ],
  snow: [
    'kenmi-base-animals-butterfly-butterfly',
    'kenmi-base-animals-bee-bee-flying-animation',
    'kenmi-base-animals-chicken-chicken-01',
  ],
};

/**
 * CULTURAL_EXCLUDES — regex patterns for sprite keys that violate the Islamic-art
 * cultural constraints (no crosses, no Santa, no reindeer, etc.).
 *
 * Phase 97 Plan 05 — tightened per plan-checker W-4: use word boundaries to avoid
 * false-matching benign tokens like `crossroads` or `witch-hazel`.
 */
export const CULTURAL_EXCLUDES = [
  /\bsanta\b/i,
  /\breindeer\b/i,
  /-cross(-|$|ifix)/i,
  /\bpumpkin\b/i,
  /\bhalloween\b/i,
  /\bwitch\b/i,
];

function _culturallyAllowed(key) {
  return !CULTURAL_EXCLUDES.some((re) => re.test(key));
}

for (const [biome, keys] of Object.entries(BIOME_DECORATION_SETS)) {
  for (const k of keys) {
    if (!_culturallyAllowed(k)) {
      throw new Error(`BIOME_DECORATION_SETS.${biome} contains culturally-excluded key: ${k}`);
    }
  }
}
for (const [biome, keys] of Object.entries(BIOME_ANIMAL_SETS)) {
  for (const k of keys) {
    if (!_culturallyAllowed(k)) {
      throw new Error(`BIOME_ANIMAL_SETS.${biome} contains culturally-excluded key: ${k}`);
    }
  }
}

/**
 * LEGACY FALLBACK — Maps old placeholder sprite keys to Kenmi asset keys.
 *
 * As of v8.0 Phase 43, zone data files (zones.js, mapPlaceholder.js) reference
 * Kenmi keys directly. This map is kept for backward compatibility with any
 * interior definitions or third-party code that may still reference old keys.
 * It can be removed once all consumers are verified to use Kenmi keys directly.
 */
export const SPRITE_KEY_MAP = {
  'palm': 'kenmi-desert-props-palm-tree-1',
  'palm-small': 'kenmi-desert-props-palm-tree-2',
  'palm-alt': 'kenmi-desert-props-palm-tree-1',
  'house-small': 'kenmi-desert-houses-desert-house-1.1',
  'house-small-alt': 'kenmi-desert-houses-desert-house-2.1',
  'house-large': 'kenmi-desert-houses-desert-house-3.1',
  'house-large-alt': 'kenmi-desert-houses-desert-house-4.1',
  'rock1': 'kenmi-desert-props-desert-rocks',
  'rock2': 'kenmi-desert-props-desert-rocks',
  'ruin-pillar': 'kenmi-desert-temple-desert-obelisk-small-1',
  'ruin-pillar-broke': 'kenmi-desert-temple-desert-obelisk-small-2',
  'ruin-gate': 'kenmi-desert-temple-desert-obelisk-1',
  'green-tree': 'kenmi-desert-props-acacia-tree',
  'green-tree-small': 'kenmi-desert-props-halfdead-tree',
  'green-tree-bushy': 'kenmi-desert-props-ambarakaman-plant',
  'ice-tree': 'kenmi-desert-props-dead-tree',
};

/**
 * Maps logical NPC IDs to FACELESS sprite keys registered in BootScene
 * via SHARED_ASSETS.npcSprites (zoneAssetManifests.js FACELESS_NPCS loop).
 *
 * Phase 97 Plan 03: every value is `npc-{id}` matching one of the 24 faceless
 * PNGs at public/assets/sprites/npcs/faceless/*.png. No kenmi-desert-npc-*,
 * kenmi-desert-npc-pharaoh, kenmi-desert-npc-traders-*, or kenmi-base-npcs-premade-*
 * references permitted — those sprites have visible eyes (cultural constraint per
 * Islamic art considerations in PROJECT.md).
 *
 * 1:1 mapping with FACELESS_NPCS array. guide-amira registered via Plan 03 Task 1a.
 */
export const NPC_KEY_MAP = {
  // Desert scholars/elders
  'npc-scholar-yusuf':      'npc-scholar-yusuf',
  'npc-student-khalid':     'npc-student-khalid',
  'npc-librarian-ibrahim':  'npc-librarian-ibrahim',
  'npc-scribe-amina':       'npc-scribe-amina',
  'npc-imam-muhammad':      'npc-imam-muhammad',
  'npc-poet-rumi':          'npc-poet-rumi',
  'npc-elder-tariq':        'npc-elder-tariq',
  'npc-storyteller-noor':   'npc-storyteller-noor',

  // Merchants/traders
  'npc-merchant-fatima':    'npc-merchant-fatima',
  'npc-spice-seller-layla': 'npc-spice-seller-layla',
  'npc-trader-hassan':      'npc-trader-hassan',

  // Role-specific
  'npc-farmer-omar':        'npc-farmer-omar',
  'npc-herbalist-maryam':   'npc-herbalist-maryam',
  'npc-blacksmith-daud':    'npc-blacksmith-daud',
  'npc-weaver-zahra':       'npc-weaver-zahra',
  'npc-fishmonger-hana':    'npc-fishmonger-hana',
  'npc-captain-rashid':     'npc-captain-rashid',
  'npc-healer-khadija':     'npc-healer-khadija',

  // Authority figures
  'npc-vizier-abbas':       'npc-vizier-abbas',
  'npc-princess-aisha':     'npc-princess-aisha',
  'npc-guard-hamza':        'npc-guard-hamza',

  // Wanderers/guides
  'npc-wanderer-ali':       'npc-wanderer-ali',
  'npc-guide-salim':        'npc-guide-salim',
  'npc-guide-amira':        'npc-guide-amira',
};

/**
 * Set of NPC sprite keys belonging to female characters.
 * Used by NPC.js to apply hijab head covering overlay.
 * Female NPCs identified from character names and roles in npcs.json.
 */
export const FEMALE_NPC_IDS = new Set([
  'npc-merchant-fatima',      // Fatima
  'npc-scribe-amina',         // Amina
  'npc-spice-seller-layla',   // Layla
  'npc-herbalist-maryam',     // Maryam
  'npc-storyteller-noor',     // Noor
  'npc-weaver-zahra',         // Zahra
  'npc-healer-khadija',       // Khadija
  'npc-princess-aisha',       // Aisha
  'npc-fishmonger-hana',      // Hana
  'npc-guide-amira',          // Amira
]);

/**
 * Hijab tint color — a warm off-white that blends with Kenmi desert palette.
 * Applied as multiply tint to the hijab overlay rectangle.
 */
export const NPC_HIJAB_TINT = 0xF5E6D3;

/**
 * Maps enemy IDs from enemies.js to Kenmi overworld sprite keys.
 * Used by BattleSpriteManager as fallback when 256x256 battle sprites are unavailable.
 * Desert Warriors: 2 weapon types (atgier, bow) x 2 color variants = 4 warriors
 * Mummy: 1 variant (desert/enemies/mummy.png)
 *
 * Enemies not in this map will attempt to load battle-enemy-{id} (256x256) as before.
 * Kenmi keys rotate through 5 textures to provide visual variety.
 */
export const ENEMY_KENMI_MAP = {
  // Oasis Village enemies
  'sand-scarab':    'kenmi-desert-enemies-desert-warrior-atgier-1',
  'dust-sprite':    'kenmi-desert-enemies-desert-warrior-bow-1',
  'oasis-guardian': 'kenmi-desert-enemies-mummy',

  // Ancient Library enemies
  'ink-wraith':      'kenmi-desert-enemies-desert-warrior-bow-2',
  'scroll-golem':    'kenmi-desert-enemies-desert-warrior-atgier-2',
  'keeper-of-words': 'kenmi-desert-enemies-mummy',

  // Desert Marketplace enemies
  'sand-djinn':       'kenmi-desert-enemies-desert-warrior-atgier-1',
  'mirage-thief':     'kenmi-desert-enemies-desert-warrior-bow-1',
  'merchant-prince':  'kenmi-desert-enemies-desert-warrior-atgier-2',

  // Coastal Port enemies
  'sea-serpent':  'kenmi-desert-enemies-desert-warrior-bow-2',
  'storm-caller': 'kenmi-desert-enemies-desert-warrior-atgier-1',
  'tide-lord':    'kenmi-desert-enemies-mummy',

  // Royal Palace enemies
  'palace-sentinel': 'kenmi-desert-enemies-desert-warrior-atgier-2',
  'shadow-vizier':   'kenmi-desert-enemies-mummy',

  // Garden District enemies
  'thorn-vine':     'kenmi-desert-enemies-desert-warrior-bow-1',
  'blossom-spirit': 'kenmi-desert-enemies-desert-warrior-bow-2',

  // Mountain Pass enemies
  'rock-elemental':  'kenmi-desert-enemies-desert-warrior-atgier-2',
  'wind-hawk':       'kenmi-desert-enemies-desert-warrior-bow-1',
  'mountain-elder':  'kenmi-desert-enemies-mummy',
};
