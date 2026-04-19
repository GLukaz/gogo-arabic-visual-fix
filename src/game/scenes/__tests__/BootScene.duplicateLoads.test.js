import { describe, it, expect } from 'vitest';
import { SHARED_ASSETS } from '../../../data/zoneAssetManifests.js';
import { KENMI_CATALOG } from '../../../data/kenmiCatalog.js';

// Phase 97 Plan 02 — Regression gate for BootScene duplicate-load elimination.
// Mirrors the two asset-loading loops in BootScene.preload() without running Phaser,
// captures every (key, url) pair, and asserts no URL is loaded under two keys and
// no key is loaded twice.

describe('BootScene duplicate load prevention', () => {
  function simulatePreload() {
    const loads = []; // [{ key, url, type }]
    const mockLoad = {
      image: (key, url) => loads.push({ key, url, type: 'image' }),
      spritesheet: (key, url /*, config*/) => loads.push({ key, url, type: 'spritesheet' }),
    };

    // Mirror BootScene.preload() SHARED_ASSETS loop:
    for (const asset of SHARED_ASSETS) {
      if (asset.type === 'spritesheet') {
        mockLoad.spritesheet(asset.key, asset.path, { frameWidth: asset.frameWidth, frameHeight: asset.frameHeight });
      } else {
        mockLoad.image(asset.key, asset.path);
      }
    }
    // Mirror BootScene.preload() KENMI_CATALOG loop:
    for (const entry of KENMI_CATALOG) {
      if (entry.type === 'spritesheet') {
        mockLoad.spritesheet(entry.key, entry.path, { frameWidth: entry.frameWidth, frameHeight: entry.frameHeight });
      } else {
        mockLoad.image(entry.key, entry.path);
      }
    }
    return loads;
  }

  const loads = simulatePreload();

  it('loads at least one asset', () => {
    expect(loads.length).toBeGreaterThan(0);
  });

  it('no URL is loaded under two different keys (excluding intentional legacy aliases)', () => {
    // Intentional duplicate loads for legacy code paths — these are documented in
    // zoneAssetManifests.js comments (e.g., `player` is the legacy key for simple-thobe).
    // Same PNG loaded as both image and spritesheet is legitimate for dual-use contexts.
    const INTENTIONAL_ALIASES = new Set([
      '/assets/tilesets/world.png', // tileset-world (image) + world-tileset (spritesheet) — different Phaser usages
      '/assets/sprites/player/bodies/simple-thobe.png', // body-simple-thobe + player legacy fallback
    ]);

    const urlToKeys = new Map();
    for (const { key, url } of loads) {
      if (!urlToKeys.has(url)) urlToKeys.set(url, new Set());
      urlToKeys.get(url).add(key);
    }
    const collisions = [...urlToKeys.entries()]
      .filter(([, keys]) => keys.size > 1)
      .filter(([url]) => !INTENTIONAL_ALIASES.has(url))
      .map(([url, keys]) => ({ url, keys: [...keys] }));
    expect(collisions, `URL loaded under multiple keys: ${JSON.stringify(collisions, null, 2)}`).toEqual([]);
  });

  it('no key is loaded twice', () => {
    const keyCount = new Map();
    for (const { key } of loads) keyCount.set(key, (keyCount.get(key) ?? 0) + 1);
    const duplicates = [...keyCount.entries()].filter(([, count]) => count > 1);
    expect(duplicates, `Keys loaded more than once: ${JSON.stringify(duplicates)}`).toEqual([]);
  });

  it('every former DESERT_TILESETS path is now loaded under its kenmi-* key exactly once', () => {
    const formerKeys = [
      'desert-beach-tiles-1',
      'desert-beach-tiles-2',
      'desert-beach-tiles-3',
      'desert-grass',
      'desert-water-tiles-1',
      'desert-water-tiles-2',
      'desert-water-tiles-3',
    ];
    const loadedKeys = new Set(loads.map((l) => l.key));
    for (const oldKey of formerKeys) {
      expect(loadedKeys.has(oldKey), `Legacy duplicate key still registered: ${oldKey}`).toBe(false);
    }
    const pathsToVerify = formerKeys.map((k) => `/assets/kenmi/desert/tiles/${k}.png`);
    for (const p of pathsToVerify) {
      const found = loads.find((l) => l.url === p);
      expect(found, `Expected Kenmi PNG ${p} to still be loaded through KENMI_CATALOG`).toBeTruthy();
      expect(found.key.startsWith('kenmi-'), `Path ${p} should be loaded under a kenmi-* catalog key, got ${found?.key}`).toBe(true);
    }
  });
});
