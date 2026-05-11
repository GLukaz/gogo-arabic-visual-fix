#!/usr/bin/env node
/**
 * Phase 97 Plan 07 — Capture deterministic world snapshots for all 8 core zones.
 *
 * Usage:  npm run capture:world-snapshots
 * Output: src/test/fixtures/world-snapshots/{zoneId}.json
 *
 * This script builds a minimal headless Phaser scene surrogate (no vitest/vi dependency)
 * so it can run from plain Node. MapLoader uses scene.add.image / textures.get / etc.
 * The mock here records the shape MapLoader produces without actually rendering.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Minimal headless scene mock — just enough surface for MapLoader.create() to run.
function createHeadlessScene(frameTable) {
  const _frameCounts = new Map(Object.entries(frameTable).map(([k, v]) => [k, v.totalFrames]));

  const noop = () => {};
  const chain = {
    setOrigin() { return chain; },
    setDepth() { return chain; },
    setScale() { return chain; },
    setSize() { return chain; },
    setOffset() { return chain; },
    setTint() { return chain; },
    setVisible() { return chain; },
    setAlpha() { return chain; },
    setFlipX() { return chain; },
    setFlipY() { return chain; },
    setFrame() { return chain; },
    setTexture() { return chain; },
    setPosition() { return chain; },
    setAngle() { return chain; },
    setCrop() { return chain; },
    play() { return chain; },
    destroy: noop,
    body: { setSize: noop, setOffset: noop },
    anims: { play: noop, exists: () => false, create: noop, generateFrameNumbers: () => [] },
  };

  const makeSprite = (x, y, key, frame) => ({
    ...chain,
    x: x ?? 0,
    y: y ?? 0,
    texture: { key },
    frame: frame != null ? { name: frame } : { name: 0 },
  });

  const scene = {
    physics: {
      add: {
        collider: noop,
        sprite: makeSprite,
        staticGroup: () => ({
          create: (x, y, key, frame) => ({
            ...makeSprite(x, y, key, frame),
            refreshBody: noop,
          }),
          getChildren: () => [],
          clear: noop,
        }),
      },
      world: { setBounds: noop },
    },
    add: {
      image: makeSprite,
      sprite: makeSprite,
      text: (x, y) => ({ ...chain, x, y }),
      rectangle: (x, y) => ({ ...chain, x, y, alpha: 1 }),
      existing: noop,
      tilemap: () => ({ createLayer: () => chain, addTilesetImage: () => chain, getObjectLayer: () => ({ objects: [] }), setCollision: noop, layers: [] }),
    },
    make: {
      tilemap: () => ({ createLayer: () => chain, addTilesetImage: () => chain, getObjectLayer: () => ({ objects: [] }), setCollision: noop, layers: [] }),
      graphics: () => ({ fillStyle: noop, fillCircle: noop, generateTexture: noop, destroy: noop }),
    },
    cameras: { main: { scrollX: 0, scrollY: 0, width: 1024, height: 768, centerOn: noop, startFollow: noop, setBounds: noop, setZoom: noop, fadeOut: noop, fadeIn: noop, once: noop } },
    input: { keyboard: { addKey: () => ({ isDown: false, isUp: true }), createCursorKeys: () => ({ up: { isDown: false }, down: { isDown: false }, left: { isDown: false }, right: { isDown: false } }), addKeys: () => ({}) } },
    time: { delayedCall: () => ({ remove: noop }) },
    tweens: { add: () => ({ remove: noop, stop: noop, play: noop }) },
    load: { tilemapTiledJSON: noop, image: noop },
    scene: { start: noop, key: 'Capture', pause: noop, resume: noop, launch: noop, stop: noop, isActive: () => true, getScene: () => null, manager: { getActiveScenes: () => [] } },
    sys: { game: { canvas: { width: 1024, height: 768, parentElement: { appendChild: noop } }, loop: { delta: 16.67 } }, scene: { manager: { getActiveScenes: () => [] } } },
    anims: { exists: () => false, create: noop, generateFrameNumbers: (key, cfg) => { const f = []; for (let i = cfg.start; i <= cfg.end; i++) f.push({ key, frame: i }); return f; } },
    textures: {
      exists: (key) => _frameCounts.has(key),
      get: (key) => ({ key, frameTotal: _frameCounts.get(key) ?? 1, getFrameNames: () => Array.from({ length: _frameCounts.get(key) ?? 1 }, (_, i) => String(i)), frames: {} }),
      _setFrameTotal: (key, total) => _frameCounts.set(key, total),
    },
    game: { canvas: { width: 1024, height: 768, parentElement: { appendChild: noop } }, loop: { delta: 16.67 } },
    currentMapW: 20,
    currentMapH: 15,
  };
  return scene;
}

async function importRel(rel) {
  const url = pathToFileURL(path.join(repoRoot, rel)).href;
  return import(url);
}

const { MapLoader } = await importRel('src/game/systems/MapLoader.js');
const { captureZoneSnapshot } = await importRel('src/game/systems/world/WorldSnapshot.js');
const { ZONES } = await importRel('src/data/zones.js');
const { KENMI_FRAME_TABLES } = await importRel('src/data/kenmiFrameTables.js');

const CORE_ZONES = ['oasis_village', 'ancient_library', 'desert_marketplace', 'farmland', 'bedouin_camp', 'mountain_village', 'coastal_port', 'royal_palace'];
const OUT_DIR = path.resolve(repoRoot, 'src/test/fixtures/world-snapshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

function captureAndWrite(zoneId, zone) {
  const scene = createHeadlessScene(KENMI_FRAME_TABLES);
  const loader = new MapLoader(scene);
  try {
    loader.create(zone, zone.mapWidth, zone.mapHeight);
  } catch (err) {
    console.error(`[capture] ${zoneId}: MapLoader.create threw — ${err.message}`);
    return false;
  }
  const snapshot = captureZoneSnapshot(loader, zone, zone.tilesetTheme);
  const outPath = path.join(OUT_DIR, `${zoneId}.json`);
  fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
  return true;
}

let wrote = 0;
for (const zoneId of CORE_ZONES) {
  const zone = ZONES[zoneId];
  if (!zone) {
    console.error(`[capture] ZONES['${zoneId}'] not found — skipping`);
    continue;
  }
  if (captureAndWrite(zoneId, zone)) wrote++;
}

if (wrote < CORE_ZONES.length) process.exit(1);
