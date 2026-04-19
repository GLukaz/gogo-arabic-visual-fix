import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Phase 97 Plan 01 Wave 0 — RED until Plan 07 commits 8 fixture files.
// This test asserts fixture PRESENCE and basic shape (version: 1, zoneId match).

describe('world snapshot fixtures', () => {
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
  for (const zoneId of CORE_ZONES) {
    it(`${zoneId}.json fixture exists and parses as valid JSON`, () => {
      const p = path.resolve(`src/test/fixtures/world-snapshots/${zoneId}.json`);
      expect(fs.existsSync(p), `missing fixture: ${p}`).toBe(true);
      const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
      expect(parsed.version).toBe(1);
      expect(parsed.zoneId).toBe(zoneId);
    });
  }
});
