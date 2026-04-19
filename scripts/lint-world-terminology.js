#!/usr/bin/env node
/**
 * Phase 97 terminology lint.
 *
 * Forbids standalone "map" / "UI" tokens in Phase 97-added files ONLY.
 * Existing files (MapLoader.js, TiledMapLoader.js, test-map.json) are NOT renamed
 * in Phase 97 — they're whitelisted via the EXCLUDES list.
 *
 * Smart exclusions:
 *   - Array.prototype.map() calls are skipped (".map(" pattern not flagged)
 *   - Object.map / any .map. is skipped
 *   - map-like JS identifiers are skipped (Map class, new Map(), WeakMap, etc.)
 *   - Comments referencing the rule itself are skipped if they contain "terminology"
 *   - "UI" is flagged as a case-sensitive whole word (UI, not Guide / Ruin / Mikus)
 */

import fs from 'node:fs';
import path from 'node:path';

// Phase 97-added directories — enforce terminology here.
const PHASE_97_PATHS = [
  'src/game/systems/world',
  'src/test/fixtures/world-snapshots',
];

// Existing names Phase 97 does NOT rename — skip these files.
const EXCLUDES = [
  'MapLoader.js',
  'TiledMapLoader.js',
  'test-map.json',
];

function isForbiddenMap(line) {
  // Skip lines that reference .map() array calls (standard JS).
  if (/\.map\s*\(/.test(line)) return false;
  // Skip Map class references (new Map, WeakMap, Map constructor).
  if (/\b(WeakMap|new\s+Map|:\s*Map\b|extends\s+Map\b)/.test(line)) return false;
  // Skip lines that describe the rule itself (e.g. our own comments).
  if (/terminology/i.test(line)) return false;
  // Skip filename references to existing (excluded) modules.
  if (/MapLoader\b|TiledMapLoader\b|test-map\b/.test(line)) return false;
  // Match standalone "map" as a word (case-insensitive).
  return /\bmap\b/i.test(line);
}

function isForbiddenUi(line) {
  // Match UI (case-sensitive) as a word boundary, excluding identifiers that happen to contain "UI" like "Guide".
  return /\bUI\b/.test(line);
}

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let hits = 0;
for (const root of PHASE_97_PATHS) {
  for (const file of walk(root)) {
    if (EXCLUDES.some((ex) => file.includes(ex))) continue;
    // Only lint text-ish files.
    if (!/\.(js|jsx|ts|tsx|json|md)$/.test(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (isForbiddenMap(line)) {
        console.error(`${file}:${i + 1}: forbidden token "map" — use "world" terminology`);
        hits++;
      }
      if (isForbiddenUi(line)) {
        console.error(`${file}:${i + 1}: forbidden token "UI" — Phase 97 is under-the-hood`);
        hits++;
      }
    });
  }
}

if (hits > 0) {
  console.error(`\n${hits} terminology violation(s) — Phase 97 forbids "map"/"UI" in new world-layer files`);
  process.exit(1);
}
console.log('lint:world-terminology — clean');
