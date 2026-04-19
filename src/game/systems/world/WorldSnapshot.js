/**
 * WorldSnapshot — deterministic serialisation of a built MapLoader zone.
 *
 * Same (mapLoader, zone, biome) MUST produce byte-identical JSON. Determinism relies on:
 *   - mapLoader.groundSprites being appended in (y * mapW + x) order during renderGroundTiles
 *   - zone.objects being iterated in their array order during placeObjects
 *   - mapLoader.decoSprites / animalSprites counts being deterministic from the seeded-random tileHash
 *
 * Consumed by Plan 07 snapshot capture script and by WorldSnapshot.test.js regression harness.
 *
 * NOTE on terminology: this module lives under src/game/systems/world/
 * per the Phase 97 CONTEXT.md constraint that new visual-layer code uses "world" terminology.
 * (Array.prototype.map() calls below are JS standard and intentional.)
 */

/**
 * Capture a deterministic snapshot of a built zone.
 *
 * @param {object} mapLoader - built MapLoader instance (loader.create has been called);
 *                             its groundSprites / decoSprites / animalSprites arrays are read.
 *                             Named "mapLoader" for compatibility with the existing class name;
 *                             may be renamed to "worldLoader" in a future rename phase.
 * @param {object} zone       - zone object from ZONES (src/data/zones.js), REAL_WORLD_ZONES, or FANTASY_ZONES
 * @param {string} biome      - zone.tilesetTheme
 * @returns {{
 *   version: 1,
 *   zoneId: string,
 *   biome: string,
 *   mapW: number,
 *   mapH: number,
 *   tiles: Array<{ x:number, y:number, key:string|null, frame:(number|string|null) }>,
 *   objects: Array<{ key:string, x:number, y:number, collide:boolean }>,
 *   decoCount: number,
 *   animalCount: number
 * }}
 */
export function captureZoneSnapshot(mapLoader, zone, biome) {
  return {
    version: 1,
    zoneId: zone.id,
    biome,
    mapW: zone.mapWidth,
    mapH: zone.mapHeight,
    tiles: (mapLoader.groundSprites || []).map((s) => ({
      x: s.x,
      y: s.y,
      key: s.texture?.key ?? null,
      frame: typeof s.frame?.name !== 'undefined' ? s.frame.name : null,
    })),
    objects: (zone.objects || []).map((o) => ({
      key: o.key,
      x: o.x,
      y: o.y,
      collide: !!o.collide,
    })),
    decoCount: (mapLoader.decoSprites || []).length,
    animalCount: (mapLoader.animalSprites || []).length,
  };
}
