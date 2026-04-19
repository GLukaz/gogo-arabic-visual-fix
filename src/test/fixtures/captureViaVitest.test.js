/**
 * Phase 97 Plan 07 — Capture world snapshot fixtures using the SAME vitest-native
 * mock that WorldSnapshot.test.js uses, so fixtures and test-time snapshots match.
 *
 * This is a one-shot fixture generator. It is disabled by default (skip block);
 * enable by setting the env var CAPTURE_WORLD_SNAPSHOTS=1 when invoking vitest.
 *
 * Usage:  CAPTURE_WORLD_SNAPSHOTS=1 npx vitest run src/test/fixtures/captureViaVitest.test.js
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import '../../game/systems/__tests__/mocks/sceneMock.js';
import { createMockScene } from '../../game/systems/__tests__/mocks/sceneMock.js';
import { MapLoader } from '../../game/systems/MapLoader.js';
import { captureZoneSnapshot } from '../../game/systems/world/WorldSnapshot.js';
import { ZONES } from '../../data/zones.js';
import { KENMI_FRAME_TABLES } from '../../data/kenmiFrameTables.js';

const CORE_ZONES = ['oasis_village', 'ancient_library', 'desert_marketplace', 'farmland', 'bedouin_camp', 'mountain_village', 'coastal_port', 'royal_palace'];
const OUT_DIR = path.resolve('src/test/fixtures/world-snapshots');

const shouldRun = process.env.CAPTURE_WORLD_SNAPSHOTS === '1';

describe.skipIf(!shouldRun)('capture world snapshot fixtures', () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const zoneId of CORE_ZONES) {
    it(`captures ${zoneId} fixture`, () => {
      const scene = createMockScene();
      for (const [key, table] of Object.entries(KENMI_FRAME_TABLES)) {
        scene.textures._setFrameTotal(key, table.totalFrames);
      }
      const loader = new MapLoader(scene);
      const zone = ZONES[zoneId];
      expect(zone, `ZONES['${zoneId}'] missing`).toBeTruthy();
      loader.create(zone, zone.mapWidth, zone.mapHeight);
      const snapshot = captureZoneSnapshot(loader, zone, zone.tilesetTheme);
      const outPath = path.join(OUT_DIR, `${zoneId}.json`);
      fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
      expect(fs.existsSync(outPath)).toBe(true);
    });
  }
});
