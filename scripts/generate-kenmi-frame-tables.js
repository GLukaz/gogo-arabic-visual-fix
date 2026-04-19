#!/usr/bin/env node
/**
 * Phase 97 Plan 04 — Generate Kenmi frame tables from PNG dimensions.
 *
 * Reads PNG headers for every spritesheet entry in KENMI_CATALOG whose path lives
 * under /tiles/, computes cols/rows/totalFrames from width/height at 16px tile size,
 * and emits src/data/kenmiFrameTables.js with:
 *
 *   KENMI_FRAME_TABLES = {
 *     'kenmi-desert-tiles-desert-beach-tiles-1': {
 *       cols: 5, rows: 3, totalFrames: 15,
 *       CORNER_TL: 0, EDGE_TOP: 1, CORNER_TR: 2,
 *       EDGE_LEFT: 5, SOLID: 6, EDGE_RIGHT: 7,
 *       CORNER_BL: 10, EDGE_BOTTOM: 11, CORNER_BR: 12,
 *     },
 *     ...
 *   }
 *
 * Regenerate via: npm run generate:kenmi-frame-tables
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const TILE_PX = 16;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readPngDimensions(pngPath) {
  const fd = fs.openSync(pngPath, 'r');
  const buf = Buffer.alloc(24);
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  if (buf.compare(PNG_SIGNATURE, 0, 8, 0, 8) !== 0) {
    throw new Error(`${pngPath}: not a PNG`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

const { KENMI_CATALOG } = await import(pathToFileURL(path.join(repoRoot, 'src/data/kenmiCatalog.js')).href);

const tileEntries = KENMI_CATALOG.filter(
  (e) => e.type === 'spritesheet' && e.path.includes('/tiles/'),
);

const tables = {};
const outliers = [];

for (const entry of tileEntries) {
  const absolutePath = path.resolve(repoRoot, 'public' + entry.path);
  try {
    const { width, height } = readPngDimensions(absolutePath);
    if (width % TILE_PX !== 0 || height % TILE_PX !== 0) {
      outliers.push({ key: entry.key, path: entry.path, width, height });
      continue;
    }
    const cols = width / TILE_PX;
    const rows = height / TILE_PX;
    tables[entry.key] = {
      cols,
      rows,
      totalFrames: cols * rows,
      CORNER_TL: 0,          EDGE_TOP: 1,               CORNER_TR: 2,
      EDGE_LEFT: cols,       SOLID: cols + 1,           EDGE_RIGHT: cols + 2,
      CORNER_BL: cols * 2,   EDGE_BOTTOM: cols * 2 + 1, CORNER_BR: cols * 2 + 2,
    };
  } catch (err) {
    outliers.push({ key: entry.key, path: entry.path, error: err.message });
  }
}

if (outliers.length > 0) {
  console.error(`\nOutliers (non-16px-grid or read errors):`);
  for (const o of outliers) console.error(`  ${o.key} — ${JSON.stringify(o)}`);
  console.error(`\n${outliers.length} outliers detected. Inspect before proceeding.`);
}

const outPath = path.resolve(repoRoot, 'src/data/kenmiFrameTables.js');
const body = [
  '// AUTO-GENERATED — DO NOT EDIT BY HAND',
  '// Regenerate via: npm run generate:kenmi-frame-tables',
  '// Derived from PNG headers under public/assets/kenmi/**/tiles/*.png',
  '',
  `export const KENMI_FRAME_TABLES = ${JSON.stringify(tables, null, 2)};`,
  '',
].join('\n');
fs.writeFileSync(outPath, body);
console.log(`wrote ${outPath} — ${Object.keys(tables).length} tile tables, ${outliers.length} outliers`);
