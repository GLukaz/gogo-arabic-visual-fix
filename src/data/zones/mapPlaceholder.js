import { BIOME_BUILDING_SETS } from '../spriteKeyMap.js';

/**
 * Constants typically imported from zones.js, but duplicated here
 * to avoid circular dependencies (zones.js -> realWorldZones -> mapPlaceholder -> zones.js).
 */
const SAND = 0;
const GRASS = 1;

/**
 * Generates a simple 40x30 placeholder map.
 * Used for new zones that don't have unique designs yet.
 */
export function buildPlaceholderMap() {
    const W = 40, H = 30;
    const m = [];
    for (let y = 0; y < H; y++) {
        const row = [];
        for (let x = 0; x < W; x++) {
            let tile = SAND;
            // Simple border
            if (x === 0 || x === W - 1 || y === 0 || y === H - 1) tile = GRASS;
            // Cross path
            if (x >= W / 2 - 2 && x <= W / 2 + 2) tile = GRASS;
            if (y >= H / 2 - 2 && y <= H / 2 + 2) tile = GRASS;
            row.push(tile);
        }
        m.push(row);
    }
    return m;
}

/**
 * Default spawn point for placeholder maps.
 */
export const defaultSpawnPoint = { x: 20, y: 15 };

/**
 * Returns default building objects for a placeholder zone based on its biome.
 */
export function getDefaultObjects(tilesetTheme = 'desert') {
    const biome = BIOME_BUILDING_SETS[tilesetTheme] || BIOME_BUILDING_SETS.desert;

    if (tilesetTheme === 'dungeon') {
        return [
            { key: biome.arch, x: 10, y: 10, collide: true, collideW: 40, collideH: 30 },
            { key: biome.pillars, x: 30, y: 10, collide: true, collideW: 20, collideH: 20 },
            { key: biome.archOpen, x: 10, y: 20, collide: true, collideW: 40, collideH: 30 },
            { key: biome.pillars, x: 30, y: 20, collide: true, collideW: 20, collideH: 20 },
        ];
    }

    if (tilesetTheme === 'mushroom') {
        return [
            { key: biome.small[0], x: 10, y: 10, collide: true, collideW: 120, collideH: 60 },
            { key: biome.small[1], x: 30, y: 10, collide: true, collideW: 120, collideH: 60 },
            { key: biome.large[0], x: 10, y: 20, collide: true, collideW: 180, collideH: 80 },
            { key: biome.large[1], x: 30, y: 20, collide: true, collideW: 180, collideH: 80 },
        ];
    }

    if (tilesetTheme === 'volcano') {
        return [
            { key: biome.tower, x: 10, y: 10, collide: true, collideW: 60, collideH: 40 },
            { key: biome.tower, x: 30, y: 10, collide: true, collideW: 60, collideH: 40 },
            { key: biome.tower, x: 10, y: 20, collide: true, collideW: 60, collideH: 40 },
            { key: biome.tower, x: 30, y: 20, collide: true, collideW: 60, collideH: 40 },
        ];
    }

    // desert, grass, snow — use small/large arrays
    const small = biome.small || BIOME_BUILDING_SETS.desert.small;
    const large = biome.large || BIOME_BUILDING_SETS.desert.large;

    return [
        { key: small[0], x: 10, y: 8, collide: true, collideW: 180, collideH: 80 },
        { key: small[1 % small.length], x: 30, y: 8, collide: true, collideW: 180, collideH: 80 },
        { key: large[0], x: 10, y: 20, collide: true, collideW: 240, collideH: 100 },
        { key: large[1 % large.length], x: 30, y: 20, collide: true, collideW: 240, collideH: 100 },
    ];
}

// Backward-compatible default (desert biome)
export const defaultObjects = getDefaultObjects('desert');
