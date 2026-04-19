# Map Export Structure

This directory is prepared for Tiled Map Editor (.tmx) export.
Currently maps are defined in code (`src/data/zones.js`).

## For Collaborators

- Install Tiled Map Editor (free): https://www.mapeditor.org/
- Tilesets are in: `public/assets/kenmi/`
- Tile size: 16x16 (display at 4x = 64px game grid)
- Zone dimensions: see `src/data/zones.js` for `mapWidth`/`mapHeight` per zone

## Zone List (24 zones)

### Core Zones (8)

| Zone ID              | Name                | Dimensions |
|----------------------|---------------------|------------|
| `oasis_village`      | Oasis Village       | 40 x 30    |
| `ancient_library`    | Ancient Library     | 35 x 30    |
| `desert_marketplace` | Desert Marketplace  | 45 x 35    |
| `farmland`           | Farmland            | 45 x 35    |
| `bedouin_camp`       | Bedouin Camp        | 35 x 25    |
| `mountain_village`   | Mountain Village    | 40 x 30    |
| `coastal_port`       | Coastal Port        | 45 x 35    |
| `royal_palace`       | Royal Palace        | 50 x 40    |

### Real World Zones (8)

| Zone ID       | Name                        | Dimensions |
|---------------|-----------------------------|------------|
| `baghdad`     | Baghdad (House of Wisdom)   | 40 x 30    |
| `cordoba`     | Cordoba (Al-Andalus)        | 40 x 30    |
| `timbuktu`    | Timbuktu                    | 40 x 30    |
| `damascus`    | Damascus                    | 40 x 30    |
| `cairo`       | Cairo                       | 40 x 30    |
| `fez`         | Fez                         | 40 x 30    |
| `samarkand`   | Samarkand                   | 40 x 30    |
| `granada`     | Granada                     | 40 x 30    |

### Fantasy Zones (8)

| Zone ID               | Name                 | Dimensions |
|-----------------------|----------------------|------------|
| `star_oasis`          | Star Oasis           | 40 x 30    |
| `mountain_of_words`   | Mountain of Words    | 40 x 30    |
| `sea_of_ink`          | Sea of Ink           | 40 x 30    |
| `forest_of_tales`     | Forest of Tales      | 40 x 30    |
| `desert_of_silence`   | Desert of Silence    | 40 x 30    |
| `merchants_island`    | Merchants' Island    | 40 x 30    |
| `fortress_of_secrets` | Fortress of Secrets  | 40 x 30    |
| `garden_of_spirits`   | Garden of Spirits    | 40 x 30    |

## Sprite Key Reference

As of v8.0, zone object data uses Kenmi sprite keys directly:

| Old Key            | Kenmi Key                                      |
|--------------------|-------------------------------------------------|
| `palm`             | `kenmi-desert-props-palm-tree-1`                |
| `palm-small`       | `kenmi-desert-props-palm-tree-2`                |
| `palm-alt`         | `kenmi-desert-props-palm-tree-1`                |
| `house-small`      | `kenmi-desert-houses-desert-house-1.1`          |
| `house-small-alt`  | `kenmi-desert-houses-desert-house-2.1`          |
| `house-large`      | `kenmi-desert-houses-desert-house-3.1`          |
| `house-large-alt`  | `kenmi-desert-houses-desert-house-4.1`          |
| `rock1` / `rock2`  | `kenmi-desert-props-desert-rocks`               |
| `ruin-pillar`      | `kenmi-desert-temple-desert-obelisk-small-1`    |
| `ruin-pillar-broke`| `kenmi-desert-temple-desert-obelisk-small-2`    |
| `ruin-gate`        | `kenmi-desert-temple-desert-obelisk-1`          |
| `green-tree`       | `kenmi-desert-props-acacia-tree`                |
| `green-tree-small` | `kenmi-desert-props-halfdead-tree`              |
| `green-tree-bushy` | `kenmi-desert-props-ambarakaman-plant`          |
| `ice-tree`         | `kenmi-desert-props-dead-tree`                  |
