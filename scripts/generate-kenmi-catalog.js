#!/usr/bin/env node
/**
 * generate-kenmi-catalog.js
 *
 * Walks public/assets/kenmi/ and generates src/data/kenmiCatalog.js.
 * Each entry has: key, path, type ('image' | 'spritesheet'), frameWidth?, frameHeight?
 *
 * Classification rules:
 *   SPRITESHEET (16x16):
 *     - Any file in a /tiles/ ancestor directory
 *     - Any file ending in -anim.png
 *     - Any file in /npc/, /npcs-premade/, /enemies/, /animals/, /player/, /shroomlings/, /characters/
 *     - Special: witch.png, bat.png in halloween/witch/
 *     - Special: santa-claus.png, santa-claus-helper.png, reindeer.png in christmas/characters/
 *
 *   IMAGE (everything else):
 *     - Houses, buildings, props (non-anim), UI, temple, decorations, icons, crops, trees, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const KENMI_ROOT = path.join(PROJECT_ROOT, 'public', 'assets', 'kenmi');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'kenmiCatalog.js');

// Pack name → prefix used in catalog keys
const PACK_PREFIXES = {
  base: 'base',
  desert: 'desert',
  dungeons: 'dungeons',
  ui: 'ui',
  characters: 'char',
  shroomlands: 'shroom',
  militarycamp: 'military',
  halloween: 'halloween',
  christmas: 'christmas',
  volcano: 'volcano',
};

/**
 * Check if any path segment matches one of the given names (exact).
 * @param {string[]} segments - path segments (already lowercased)
 * @param {string[]} names - names to check
 */
function hasSegment(segments, names) {
  return segments.some((s) => names.includes(s));
}

/**
 * Determine type and frame dimensions for a given PNG file.
 * @param {string} relPath - pack-relative path, e.g. "tiles/grass/grass-tiles-1.png"
 * @param {string} packName - e.g. "base"
 * @param {string} filename - e.g. "grass-tiles-1.png"
 */
function classify(relPath, packName, filename) {
  const lowerRel = relPath.toLowerCase();
  const lowerFile = filename.toLowerCase();
  const segments = lowerRel.split('/').slice(0, -1); // directories only

  // --- SPRITESHEET RULES ---

  // 1. Any tile directory
  if (hasSegment(segments, ['tiles'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 2. Animated files (ends with -anim.png)
  if (lowerFile.endsWith('-anim.png')) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 3. NPC / character sprites
  if (hasSegment(segments, ['npc', 'npcs-premade', 'traders'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 4. Enemy sprites
  if (hasSegment(segments, ['enemies'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 5. Animal sprites
  if (hasSegment(segments, ['animals'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 6. Player sprites (base, chest, head, legs, feet, hands, tools, mounts)
  if (hasSegment(segments, ['player', 'player-base', 'player-mounts'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }
  // player-base-animations.png file specifically
  if (lowerFile === 'player-base-animations.png') {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 7. Shroomlings (characters in shroomlands)
  if (hasSegment(segments, ['shroomlings'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 8. Characters pack (goblins, knights, orcs, angels)
  if (packName === 'characters') {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 9. Halloween living characters (witch dir)
  if (packName === 'halloween' && hasSegment(segments, ['witch'])) {
    // witch cauldron anim already covered by rule 2; bat and witch are spritesheets
    if (lowerFile !== 'with-hut.png' && lowerFile !== 'broom.png') {
      return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
    }
  }

  // 10. Christmas characters
  if (packName === 'christmas' && hasSegment(segments, ['characters'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // 11. Volcano enemies already covered by rule 4 (enemies segment)
  // Dungeon door/gate anim already covered by rule 2
  // Desert person, mummy in enemies — covered by rules 3, 4

  // Desert mummy.png in props (not enemies) — still a character spritesheet
  if (packName === 'desert' && lowerFile === 'mummy.png') {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // Snails in shroomlands
  if (hasSegment(segments, ['snails'])) {
    return { type: 'spritesheet', frameWidth: 16, frameHeight: 16 };
  }

  // --- IMAGE RULES (everything else) ---
  return { type: 'image' };
}

/**
 * Generate catalog key from pack name, pack-relative path, and filename.
 * Format: kenmi-{packPrefix}-{path-segments-joined-with-hyphens}-{stem}
 */
function makeKey(packName, relPath) {
  const prefix = PACK_PREFIXES[packName] || packName;
  // Strip filename extension
  const withoutExt = relPath.replace(/\.png$/i, '');
  // Split into segments, join with hyphens
  const segments = withoutExt.split('/').filter(Boolean);
  const joined = segments.join('-');
  return `kenmi-${prefix}-${joined}`;
}

/**
 * Walk a directory recursively, calling cb(absolutePath, relativeToPackRoot)
 * for each .png file found.
 */
function walkDir(dir, base, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, relPath, cb);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      cb(fullPath, relPath.replace(/\\/g, '/'));
    }
  }
}

const entries = [];
const keysSeen = new Set();
const duplicates = [];

for (const packName of Object.keys(PACK_PREFIXES)) {
  const packDir = path.join(KENMI_ROOT, packName);
  if (!fs.existsSync(packDir)) {
    console.warn(`WARN: Pack directory not found: ${packDir}`);
    continue;
  }

  walkDir(packDir, '', (absPath, relPath) => {
    const filename = path.basename(relPath);
    const classification = classify(relPath, packName, filename);
    const key = makeKey(packName, relPath);
    const publicPath = `/assets/kenmi/${packName}/${relPath}`;

    if (keysSeen.has(key)) {
      duplicates.push(key);
    }
    keysSeen.add(key);

    const entry = {
      key,
      path: publicPath,
      ...classification,
    };
    entries.push(entry);
  });

  console.log(`Processed ${packName}: ${entries.length} entries so far`);
}

// Sort entries by key for deterministic output
entries.sort((a, b) => a.key.localeCompare(b.key));

// Count stats
const spritesheets = entries.filter((e) => e.type === 'spritesheet').length;
const images = entries.filter((e) => e.type === 'image').length;

console.log(`\nTotal entries: ${entries.length}`);
console.log(`Spritesheets: ${spritesheets}`);
console.log(`Images: ${images}`);
console.log(`Duplicate keys: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.warn('Duplicate keys:', duplicates.slice(0, 10));
}

// Generate file content
const lines = entries.map((e) => {
  if (e.type === 'spritesheet') {
    return `  { key: ${JSON.stringify(e.key)}, path: ${JSON.stringify(e.path)}, type: 'spritesheet', frameWidth: 16, frameHeight: 16 },`;
  } else {
    return `  { key: ${JSON.stringify(e.key)}, path: ${JSON.stringify(e.path)}, type: 'image' },`;
  }
});

const fileContent = `// AUTO-GENERATED by scripts/generate-kenmi-catalog.js
// DO NOT EDIT MANUALLY — re-run the script to regenerate
// Generated: ${new Date().toISOString()}
// Stats: ${entries.length} total, ${spritesheets} spritesheets, ${images} images

/**
 * KENMI_CATALOG — master list of all Kenmi Cute Fantasy assets.
 *
 * Each entry:
 *   key         {string}  Phaser texture key (globally unique)
 *   path        {string}  URL served from Vite public/ directory
 *   type        {string}  'image' | 'spritesheet'
 *   frameWidth  {number}  (spritesheets only) frame width in pixels
 *   frameHeight {number}  (spritesheets only) frame height in pixels
 */
export const KENMI_CATALOG = [
${lines.join('\n')}
];

export default KENMI_CATALOG;
`;

fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
console.log(`\nWritten to: ${OUTPUT_FILE}`);
