import Phaser from 'phaser';
import { TILE } from '../../data/zones.js';

/**
 * TiledMapLoader — Loads Tiled Map Editor JSON exports into Phaser.
 *
 * This sits alongside the existing MapLoader (code-generated maps) and is
 * used when a zone has a pre-built Tiled JSON map available in the cache.
 *
 * Tiled maps use 16x16 tiles from the Kenmi tilesets. They are scaled 4x
 * at runtime to fill the 64px game grid (TILE / tileWidth).
 *
 * Usage:
 *   // In BootScene.preload():
 *   this.load.tilemapTiledJSON('map-oasis-village', '/assets/maps/oasis-village.json');
 *   this.load.image('desert-beach-tiles-1', '/assets/kenmi/desert/tiles/desert-beach-tiles-1.png');
 *
 *   // In WorldScene:
 *   const tiledLoader = new TiledMapLoader(scene);
 *   const result = tiledLoader.load('map-oasis-village');
 *   // result = { map, layers, wallGroup, collisionLayer, objects, exitTriggers }
 */
export class TiledMapLoader {
  constructor(scene) {
    this.scene = scene;

    // Track created resources for cleanup
    this.currentMap = null;
    this.currentLayers = {};
    this.wallGroup = null;
    this.collisionLayer = null;
  }

  // ------------------------------------------------------------------
  // PUBLIC API
  // ------------------------------------------------------------------

  /**
   * Load a Tiled JSON map and create all layers.
   *
   * @param {string} mapKey — The key used in this.load.tilemapTiledJSON()
   * @returns {{ map, layers, wallGroup, collisionLayer, objects, exitTriggers }}
   */
  load(mapKey) {
    const map = this.scene.make.tilemap({ key: mapKey });
    this.currentMap = map;

    // ---- Add tilesets ----
    // Tiled exports tileset names inside the JSON. For each one we call
    // addTilesetImage(tiledName, phaserTextureKey). We use the same key
    // for both so the Phaser texture key must match the Tiled tileset name
    // exactly (set up in BootScene preload).
    const tilesets = [];
    for (const tilesetData of map.tilesets) {
      const tileset = map.addTilesetImage(tilesetData.name, tilesetData.name);
      if (tileset) {
        tilesets.push(tileset);
      } else {
        console.warn(
          `[TiledMapLoader] Tileset "${tilesetData.name}" not found in Phaser cache. ` +
          'Make sure the texture key in BootScene matches the Tiled tileset name.'
        );
      }
    }

    // ---- Create tile layers ----
    const layers = {};
    const scale = TILE / map.tileWidth; // 64 / 16 = 4

    for (const layerData of map.layers) {
      if (layerData.type === 'tilelayer') {
        const layer = map.createLayer(layerData.name, tilesets);
        if (layer) {
          // Scale 16px tiles up to fill the 64px game grid
          layer.setScale(scale);
          layers[layerData.name] = layer;
        }
      }
    }
    this.currentLayers = layers;

    // ---- Collision ----
    // Convention: a layer named "Collision" or "collision" marks impassable tiles.
    // It is hidden at runtime — only used for physics.
    const wallGroup = this.scene.physics.add.staticGroup();
    this.wallGroup = wallGroup;

    const collisionLayer = layers['Collision'] || layers['collision'] || layers['Walls'] || layers['walls'];
    if (collisionLayer) {
      // Any non-empty tile in the collision layer is impassable
      collisionLayer.setCollisionByExclusion([-1, 0]);
      collisionLayer.setVisible(false);
      this.collisionLayer = collisionLayer;
    }

    // ---- Object layers ----
    // Tiled object layers carry NPCs, exits, spawn points, interactables, etc.
    const objects = {};
    for (const layerData of map.layers) {
      if (layerData.type === 'objectgroup') {
        const objLayer = map.getObjectLayer(layerData.name);
        objects[layerData.name] = objLayer?.objects || [];
      }
    }

    // ---- Exit triggers from object layer ----
    // Convention: an object layer named "Exits" or "exits" contains rectangles
    // with custom properties: targetZone, targetEntry, edge.
    const exitTriggers = this._parseExitTriggers(objects);

    return {
      map,
      layers,
      wallGroup,
      collisionLayer: this.collisionLayer,
      objects,
      exitTriggers,
    };
  }

  /**
   * Check if a Tiled map exists in the cache for a given zone ID.
   * Zone IDs use underscores (oasis_village), map keys use hyphens (map-oasis-village).
   *
   * @param {string} zoneId
   * @returns {boolean}
   */
  hasMap(zoneId) {
    const mapKey = this.zoneIdToMapKey(zoneId);
    return this.scene.cache.tilemap.has(mapKey);
  }

  /**
   * Convert a zone ID to the conventional Tiled map cache key.
   * e.g. "oasis_village" → "map-oasis-village"
   *
   * @param {string} zoneId
   * @returns {string}
   */
  zoneIdToMapKey(zoneId) {
    return `map-${zoneId.replace(/_/g, '-')}`;
  }

  /**
   * Get the world-pixel dimensions of the currently loaded Tiled map,
   * accounting for the 4x scale factor.
   *
   * @returns {{ width: number, height: number }}
   */
  getWorldSize() {
    if (!this.currentMap) return { width: 0, height: 0 };
    const scale = TILE / this.currentMap.tileWidth;
    return {
      width: this.currentMap.widthInPixels * scale,
      height: this.currentMap.heightInPixels * scale,
    };
  }

  /**
   * Destroy all map elements created by the last load() call.
   */
  destroy() {
    // Destroy tile layers
    for (const key of Object.keys(this.currentLayers)) {
      const layer = this.currentLayers[key];
      if (layer && layer.destroy) layer.destroy();
    }
    this.currentLayers = {};

    // Destroy wall group
    if (this.wallGroup) {
      this.wallGroup.clear(true, true);
      this.wallGroup = null;
    }

    this.collisionLayer = null;

    // Destroy the tilemap itself
    if (this.currentMap) {
      this.currentMap.destroy();
      this.currentMap = null;
    }
  }

  // ------------------------------------------------------------------
  // PRIVATE HELPERS
  // ------------------------------------------------------------------

  /**
   * Parse exit triggers from Tiled object layers.
   *
   * Expects objects in an "Exits" layer with custom properties:
   *   - targetZone (string) — zone ID to travel to
   *   - targetEntry (string) — entry point key in target zone
   *   - edge (string) — "north", "south", "east", "west"
   *
   * Returns an array matching the shape WorldScene.checkExitTriggers() expects:
   *   [{ edge, tileRange: [start, end], targetZone, targetEntry }]
   *
   * @param {Object} objects — parsed object layers from load()
   * @returns {Array}
   */
  _parseExitTriggers(objects) {
    const exitTriggers = [];
    const exitObjects = objects['Exits'] || objects['exits'] || [];

    const scale = this.currentMap ? TILE / this.currentMap.tileWidth : 4;

    for (const obj of exitObjects) {
      // Extract custom properties (Tiled stores them as an array of {name, value})
      const props = this._getObjectProperties(obj);
      const targetZone = props.targetZone;
      const targetEntry = props.targetEntry || 'default';
      const edge = props.edge || 'south';

      if (!targetZone) continue;

      // Convert pixel coordinates to tile coordinates
      // Tiled object x/y are in map-pixel space (16px grid), scale to game grid
      const scaledX = (obj.x * scale) / TILE;
      const scaledY = (obj.y * scale) / TILE;
      const scaledW = ((obj.width || TILE) * scale) / TILE;
      const scaledH = ((obj.height || TILE) * scale) / TILE;

      let tileRange;
      if (edge === 'north' || edge === 'south') {
        tileRange = [Math.floor(scaledX), Math.floor(scaledX + scaledW) - 1];
      } else {
        tileRange = [Math.floor(scaledY), Math.floor(scaledY + scaledH) - 1];
      }

      exitTriggers.push({ edge, tileRange, targetZone, targetEntry });
    }

    return exitTriggers;
  }

  /**
   * Extract custom properties from a Tiled object into a flat key-value map.
   * Tiled JSON stores properties as: [{ name: "foo", type: "string", value: "bar" }, ...]
   *
   * @param {Object} obj — a Tiled object
   * @returns {Object}
   */
  _getObjectProperties(obj) {
    const result = {};
    if (obj.properties) {
      for (const prop of obj.properties) {
        result[prop.name] = prop.value;
      }
    }
    return result;
  }
}
