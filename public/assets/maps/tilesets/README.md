# Kenmi Tilesets for Tiled Map Editor

## Setup in Tiled

1. Open Tiled Map Editor (free: https://www.mapeditor.org/)
2. New Map: 16x16 tile size, orthogonal, right-down render order
3. Map > Add External Tileset > browse to the PNG files listed below
4. Set tile width: 16, tile height: 16

## Available Tilesets (all 16x16)

### Desert Ground (at `public/assets/kenmi/desert/tiles/`)

| File | Grid | Tiles | Notes |
|------|------|-------|-------|
| `desert-beach-tiles-1.png` | 5x3 | 15 | Sand/water transitions, color 1 |
| `desert-beach-tiles-2.png` | 5x3 | 15 | Sand/water transitions, color 2 |
| `desert-beach-tiles-3.png` | 5x3 | 15 | Sand/water transitions, color 3 |
| `desert-grass.png` | 3x5 | 15 | Grass on sand |
| `desert-water-tiles-1.png` | 6x3 | 18 | Water fills, color 1 |
| `desert-water-tiles-2.png` | 6x3 | 18 | Water fills, color 2 |
| `desert-water-tiles-3.png` | 6x3 | 18 | Water fills, color 3 |
| `desert-cliff-tiles-1.png` | - | - | Cliff edges |
| `desert-cliff-tiles-2.png` | - | - | Cliff edges |
| `desert-cliff-tiles-3.png` | - | - | Cliff edges |

### Desert Props (at `public/assets/kenmi/desert/props/`)

- These are variable-size images (not 16x16 grids)
- Place them on an **Object Layer** in Tiled, not a Tile Layer
- They are full images — not tile grids

## Naming Convention (Tileset Name = Phaser Texture Key)

When adding a tileset in Tiled, the **tileset name** must match the **Phaser texture key**
used in BootScene. The Tiled JSON export includes the tileset name, and TiledMapLoader
uses it to look up the texture.

For Kenmi tilesets loaded via the catalog, the key pattern is:
`kenmi-desert-tiles-{filename-without-extension}`

Example: `desert-beach-tiles-1.png` has the Phaser key `kenmi-desert-tiles-desert-beach-tiles-1`

So in Tiled, name the tileset: `kenmi-desert-tiles-desert-beach-tiles-1`

Alternatively, you can register shorter aliases in BootScene and use those as the
Tiled tileset name (e.g. `desert-beach-tiles-1`).

## Layer Conventions

| Layer Name | Type | Purpose |
|------------|------|---------|
| `Ground` | Tile Layer | Base terrain (sand, grass, water) |
| `Ground2` | Tile Layer | Secondary terrain details |
| `Objects` | Tile Layer | Trees, rocks, buildings (tile-based) |
| `Collision` | Tile Layer | Impassable tiles (hidden at runtime) |
| `Above` | Tile Layer | Tiles rendered above the player |
| `Exits` | Object Layer | Zone transition rectangles |
| `NPCs` | Object Layer | NPC spawn positions |
| `Interactables` | Object Layer | Interactive object positions |

### Exit Object Properties

Objects in the "Exits" layer should have these custom properties:

| Property | Type | Description |
|----------|------|-------------|
| `targetZone` | string | Zone ID to travel to (e.g. `ancient_library`) |
| `targetEntry` | string | Entry point key in target zone |
| `edge` | string | `north`, `south`, `east`, or `west` |

## Export Settings

1. File > Export As > JSON map files (.json)
2. Save to: `public/assets/maps/{zone-name}.json`
3. In BootScene, add: `this.load.tilemapTiledJSON('map-{zone-name}', '/assets/maps/{zone-name}.json');`

## Scale Factor

Tiled maps use 16x16 tiles. The game grid is 64x64. TiledMapLoader applies a 4x scale
factor automatically (`TILE / tileWidth = 64 / 16 = 4`).

A 40x30 tile map in Tiled = 640x480 pixels = 2560x1920 game pixels after scaling.
