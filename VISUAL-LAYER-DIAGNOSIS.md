# Visual Layer Black Squares — Root Cause Investigation

## Status: Diagnosis in progress (2026-03-19)

## What's broken
The Phaser canvas shows **black squares** for terrain because the Kenmi auto-tiling code uses frame indices that don't resolve to valid frames.

## Root Cause Analysis

### How tiles are loaded
1. **KENMI_CATALOG** (`src/data/kenmiCatalog.js`) — loads tiles CORRECTLY as `spritesheet` with `frameWidth: 16, frameHeight: 16`
2. **BootScene lines 224-230** — loads the SAME tile PNGs AGAIN as flat `image` type with SHORT keys for Tiled map support

### How tiles are rendered
- `MapLoader._hasKenmiTiles()` checks if `kenmi-desert-tiles-desert-beach-tiles-1` exists
- If yes → `_renderKenmiTiles()` uses frame indices (e.g., `BEACH.CORNER_TL = 0`, `BEACH.EDGE_TOP = 1`, etc.)
- If no → `_renderFlatTiles()` uses solid-color fallback images

### Verified Kenmi tile dimensions (all 16x16 pixel frames)
| File | Size | Grid | Frames |
|------|------|------|--------|
| desert-beach-tiles-1.png | 80x48 | 5x3 | 15 |
| desert-beach-tiles-2.png | 80x48 | 5x3 | 15 |
| desert-beach-tiles-3.png | 80x48 | 5x3 | 15 |
| desert-grass.png | 48x80 | 3x5 | 15 |
| desert-water-tiles-1.png | 96x48 | 6x3 | 18 |
| desert-water-foam-animation.png | 320x48 | 20x3 | 60 |

### MapLoader frame index mapping
- BEACH: 5 cols x 3 rows, frames 0-14 (matches 15 frames)
- GRASS: 3 cols x 5 rows, frames 0-14 (matches 15 frames)
- WATER: 6 cols x 3 rows, frames 0-17 (matches 18 frames)
- All use `KENMI_SCALE = 4` (16px → 64px game tiles)

### What needs checking next
1. **Verify KENMI_CATALOG loads before BootScene hardcoded lines** — if the hardcoded `image` load runs AFTER the catalog `spritesheet` load for the same file path, Phaser may overwrite the spritesheet with a flat image
2. **Verify `_safeFrame()` is working** — it's supposed to clamp invalid frame indices, but if the texture is loaded as `image` not `spritesheet`, `tex.frames` won't have numbered keys
3. **Check the actual frame indices** — open each PNG in an image viewer and visually verify the frame grid matches the BEACH/GRASS/WATER_F constant definitions
4. **Check `_renderSandTile`, `_renderGrassTile`, `_renderWaterTile`** — ensure they're picking valid frame indices for the sprite calls (e.g., not using a BEACH frame index on a GRASS spritesheet)

### Likely fix
The BootScene hardcoded lines 224-230 load tiles as flat images. If these run AFTER the KENMI_CATALOG spritesheet loads, they'd overwrite the spritesheet versions. **Remove these lines** or ensure they use different keys that don't conflict.

If the issue persists after that, the frame index mapping in MapLoader needs visual verification against the actual PNG layouts.
