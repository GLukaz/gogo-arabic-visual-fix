import { describe, it, expect } from 'vitest';
import { KENMI_CATALOG } from '../kenmiCatalog.js';
import { ZONES } from '../zones.js';
import { realWorldZones } from '../zones/realWorldZones.js';
import { fantasyZones } from '../zones/fantasyZones.js';

// Phase 97 Plan 01 Wave 0 — RED until all Kenmi references in zone data resolve
// against KENMI_CATALOG. Expected failures point at audit findings (e.g. stone-house-2
// blackpng typo) that Plans 04 / 06 fix.

describe('zone asset integrity', () => {
  const catalogKeys = new Set(KENMI_CATALOG.map((e) => e.key));
  const allZones = { ...ZONES, ...realWorldZones, ...fantasyZones };

  for (const [zoneId, zone] of Object.entries(allZones)) {
    it(`${zoneId}: every Kenmi key in objects array is in KENMI_CATALOG`, () => {
      const kenmiKeys = (zone.objects || [])
        .map((o) => o.key)
        .filter((k) => typeof k === 'string' && k.startsWith('kenmi-'));
      const missing = kenmiKeys.filter((k) => !catalogKeys.has(k));
      expect(missing).toEqual([]);
    });
  }
});
