import { describe, it, expect, vi } from 'vitest';
import './mocks/sceneMock.js';
import { createMockScene } from './mocks/sceneMock.js';

// Mock ReplaceColorPipeline to avoid Phaser dependency
vi.mock('../ReplaceColorPipeline.js', () => ({
  default: class ReplaceColorPipeline {
    constructor(game) {
      this.game = game;
    }
  },
}));

import { MapLoader } from '../MapLoader.js';
import { ZONES } from '../../../data/zones.js';

// Phase 97 Plan 01 Wave 0 — RED until Plan 04 lands PNG-derived frame tables
// + MapLoader uses them instead of hardcoded BEACH/GRASS_F/WATER_F constants.

const CORE_ZONES = [
  'oasis_village',
  'ancient_library',
  'desert_marketplace',
  'farmland',
  'bedouin_camp',
  'mountain_village',
  'coastal_port',
  'royal_palace',
];

describe('MapLoader frame validity', () => {
  for (const zoneId of CORE_ZONES) {
    it(`${zoneId}: every ground sprite has a valid frame index within its texture's frameTotal`, () => {
      const scene = createMockScene();
      // Seed known frame totals for the Kenmi tile sheets this zone's biome uses.
      // Conservative defaults matching VISUAL-LAYER-DIAGNOSIS.md verified PNG dimensions:
      //   BEACH 5x3 = 15 frames, GRASS 3x5 = 15 frames, WATER 6x3 = 18 frames.
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-beach-tiles-1', 15);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-beach-tiles-2', 15);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-beach-tiles-3', 15);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-grass', 15);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-water-tiles-1', 18);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-water-tiles-2', 18);
      scene.textures._setFrameTotal('kenmi-desert-tiles-desert-water-tiles-3', 18);

      const loader = new MapLoader(scene);
      const zone = ZONES[zoneId];
      if (!zone) {
        throw new Error(`Zone ${zoneId} missing from ZONES export`);
      }
      loader.create(zone, zone.mapWidth, zone.mapHeight);

      for (const sprite of loader.groundSprites || []) {
        const texKey = sprite.texture?.key;
        if (!texKey) continue;
        const total = scene.textures.get(texKey).frameTotal;
        const frameIdxRaw = sprite.frame?.name;
        const frameIdx = typeof frameIdxRaw === 'number' ? frameIdxRaw : Number(frameIdxRaw);
        if (Number.isFinite(frameIdx)) {
          expect(frameIdx).toBeGreaterThanOrEqual(0);
          expect(frameIdx).toBeLessThan(total);
        }
      }
    });
  }
});
