#!/usr/bin/env node
/**
 * Phase 97 Kenmi coverage transparency report.
 *
 * Emits `.planning/phases/97-visual-world-layer-rebuild/KENMI-COVERAGE.md` listing:
 *   - Every Kenmi catalog key USED in zones.js / realWorldZones.js / fantasyZones.js
 *   - Every Kenmi catalog key NOT used (audit signal — "use ALL Kenmi assets" per CONTEXT)
 *
 * Unused keys are not an immediate bug; they're a flag for audit review so that when Plan 06
 * rebuilds zones it can consider drawing from the unused pool.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

async function importData(rel) {
  const url = pathToFileURL(path.join(repoRoot, rel)).href;
  return import(url).catch(() => ({}));
}

const { KENMI_CATALOG = [] } = await importData('src/data/kenmiCatalog.js');
const { ZONES = {} } = await importData('src/data/zones.js');
const { realWorldZones = {} } = await importData('src/data/zones/realWorldZones.js');
const { fantasyZones = {} } = await importData('src/data/zones/fantasyZones.js');

const allKeysUsed = new Set();
for (const zones of [ZONES, realWorldZones, fantasyZones]) {
  for (const zone of Object.values(zones)) {
    for (const o of zone.objects || []) {
      if (typeof o.key === 'string' && o.key.startsWith('kenmi-')) allKeysUsed.add(o.key);
    }
  }
}

const allKeys = KENMI_CATALOG.map((e) => e.key);
const used = allKeys.filter((k) => allKeysUsed.has(k));
const unused = allKeys.filter((k) => !allKeysUsed.has(k));

const outPath = path.resolve(repoRoot, '.planning/phases/97-visual-world-layer-rebuild/KENMI-COVERAGE.md');
const body = `# Kenmi Coverage Report

Generated: ${new Date().toISOString()}

## Summary

- Total catalog entries: ${allKeys.length}
- Used in zones: ${used.length} (${((used.length / allKeys.length) * 100).toFixed(1)}%)
- Unused: ${unused.length}

## Used Keys

${used.sort().map((k) => `- ${k}`).join('\n')}

## Unused Keys

${unused.sort().map((k) => `- ${k}`).join('\n')}
`;

fs.writeFileSync(outPath, body);
console.log(`wrote ${outPath}`);
console.log(`coverage: ${used.length}/${allKeys.length} (${((used.length / allKeys.length) * 100).toFixed(1)}%)`);
