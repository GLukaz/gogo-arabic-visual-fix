# Phase 97: Visual/World Layer Rebuild — Research

**Researched:** 2026-04-17
**Domain:** Phaser 3 sprite-based world rendering, Kenmi pixel art tileset auto-tiling, programmatic zone construction
**Confidence:** HIGH (codebase facts verified via direct read; Phaser patterns cited from the existing in-repo implementation)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Scope & constraints**
- **Visual layer only** — terrain, buildings, decorations, characters, Phaser world rendering. Game logic, Redux slices, quest systems, FSRS, dialogue — all untouched.
- **All 2535 existing tests must continue to pass** — any change that breaks a test is out of scope. This is the verification gate.
- **No new overlay wiring** — don't wire new overlays into GameLayout as part of this work; if an overlay rebuild is needed, file it for a separate phase.
- **"World" terminology, never "map" or "UI"** — all new file names, variables, comments, docs in this phase use "world".

**Asset strategy**
- **Use Kenmi tilesets** — 969 PNGs across 10 packs. Use ALL available Kenmi assets (terrain, buildings, decorations, characters, animals). Do not fall back on placeholders if a Kenmi asset exists for the purpose.
- **No manual Tiled editing by the user** — Claude builds maps programmatically. User is NOT using Tiled Map Editor. Any zone-building is code-driven with Kenmi tile IDs.
- **Faceless characters only** — Islamic art consideration. Modify any character sprites that have faces to remove eyes/faces. Applies to Monster Quest and any other sourced sprites.

**Quality expectations**
- **Quality is the most important thing**.
- **Don't rush visual work** — take passes. Better to spend more compute getting consistent art style right than to ship 8 zones with mismatched tiles.
- **Realistic placeholders at minimum** — never ship obvious placeholder squares.
- **Full batch sizes** — if a zone needs 30 decoration tiles, place all 30, don't half-do it.

**1M context window strategy**
- **Single-pass analysis** — load the entire Phaser world layer (all zones, scenes, render paths, plugin registrations, asset configs, bootloaders) into one context at analysis time.
- **Cross-zone consistency check** — with all 8 zones visible simultaneously, verify Kenmi art style is consistent across zones.

**Zones to rebuild (all 8)**
1. oasis_village (desert)
2. ancient_library (desert)
3. desert_marketplace (desert)
4. farmland (grass)
5. bedouin_camp (desert)
6. mountain_village (snow)
7. coastal_port (grass)
8. royal_palace (desert)

**Preserve**
- All 140 NPCs and their positions
- All 52 quests and quest triggers
- All building entry points and interior scene connections
- All zone gates and prerequisite flags
- All interactive objects (142 objects)
- Phaser event wiring to Redux
- All existing tests (2535)

### Claude's Discretion
- Internal file organization of new tile/asset loader code
- Phaser tilemap data structure (JSON vs programmatic)
- Whether to introduce a tiles registry module or extend existing
- Caching / preloading strategy for Kenmi assets
- Exact zone-by-zone rebuild order (but all 8 must ship together)
- How to detect and report "broken tile" references in the current codebase

### Deferred Ideas (OUT OF SCOPE)
- Animated tile effects (flowing water, swaying trees) — defer to a future polish phase.
- Day/night lighting — out of scope (already in PROJECT.md out-of-scope list).
- New zones beyond the existing 8 — out of scope.
- Replacing game-logic-related systems (Redux slices, FSRS, dialogue engine) — out of scope.
- Overlay UI redesigns — deferred to avoid scope creep and per "no overlay wiring" feedback.
- UI-SPEC workflow — skipped per user feedback memory; this is a visual rebuild of the in-world Phaser layer, not UI component redesign.
</user_constraints>

---

## Project Constraints (from CLAUDE.md)

`CLAUDE.md` does not exist at the project root. Constraints therefore come from CONTEXT.md (above), PROJECT.md, STATE.md, ROADMAP.md, and two in-repo concern memos:

- `VISUAL-LAYER-DIAGNOSIS.md` — diagnoses the "black squares" issue and flags the BootScene line 97 (`test-map.json`) / KENMI_CATALOG collision risk. [VERIFIED: file read]
- `WORLD-VS-LOGIC-CONCERN.md` — confirms world (tiles, positions) is decoupled from logic (NPC IDs, zone names, quest names) except for hardcoded coordinates in `CinematicIntroSequencer.js`. [VERIFIED: file read]

Additional PROJECT.md hard constraints applicable to visual work:
- **No music** (audio uses SFX + ambience only — no change to audio infrastructure needed here). [VERIFIED: PROJECT.md line 194]
- **No eyes/faces** on characters — faceless NPCs are already established in `src/data/zoneAssetManifests.js` via `FACELESS_NPCS` list and `/assets/sprites/npcs/faceless/` directory. [VERIFIED: zoneAssetManifests.js lines 19-30]
- **Arabic-first, culturally respectful, historically accurate** — zones are named in Arabic (واحَة الحُروف) and use Arabic-named items. Kenmi art must not introduce culturally-inappropriate decoration (crosses, Christmas imagery, pig statues placed ritually, etc. — though pigs as farm animals in `farmland` are acceptable Kenmi animals).

---

## Summary

Gogo Arabic's world layer is built on **Phaser 3.90.0** with a dual-path renderer: a programmatic `MapLoader` (1967 LOC) for code-defined zones and a `TiledMapLoader` (254 LOC) for optional Tiled JSON maps. All 8 core zones currently go through the programmatic path. The visual pipeline is:

```
BootScene.preload()           WorldScene.create('oasis_village')
  ├─ SHARED_ASSETS            ├─ MapLoader.create(zone, W, H)
  ├─ KENMI_CATALOG (969)      │    ├─ zone.buildMap() → 2D tile array
  └─ test-map.json            │    ├─ renderGroundTiles(biome)
                              │    │    ├─ _renderKenmiTiles if textures loaded
                              │    │    └─ _renderFlatTiles fallback
                              │    ├─ placeObjects(zone.objects)   ← Kenmi keys
                              │    ├─ scatterDecorations(zone)     ← desert|grass only
                              │    ├─ spawnAmbientAnimals(zone)    ← desert only
                              │    └─ createExitTriggers(zone.exits)
                              ├─ NPCManager.create(zone.npcs)      ← NPC_KEY_MAP
                              ├─ InteractableManager.create()      ← zone.interactables
                              └─ FloatingArabicLabelManager.create()
```

**The visual layer is NOT completely broken** — it renders, but has three classes of bugs documented in previous phases' SUMMARY files and the in-repo diagnosis memo:

1. **Black squares** in tile rendering due to frame-index miscalculations in `BEACH`/`GRASS_F`/`WATER_F` constants when clipped against the actual PNG frame counts. `_safeFrame()` was added as a defensive clamp but the root-cause frame-index audit was deferred from v8.0.
2. **Asset-loading collision risk** — `BootScene` loads the KENMI_CATALOG as spritesheets, but `test-map.json` plus older manifest entries also load some Kenmi PNGs as flat images under different keys. The diagnosis memo notes this could create per-key double-registration confusion.
3. **Inconsistent art style across zones** — v8.0 shipped biome-dispatched building sets in `spriteKeyMap.js` (`BIOME_BUILDING_SETS`), but individual zones received ad-hoc hand-picked Kenmi keys; `mountain_village` (snow) has no `BIOME_BUILDING_SETS.snow` decoration entries and `scatterDecorations` explicitly skips non-desert/non-grass biomes. `farmland` and `coastal_port` use `grass` biome but share a minimal prop set.

The rebuild is therefore NOT about introducing Phaser tilemap machinery (it exists), but about **auditing the current code-paths and zone data, re-seating the Kenmi frame-index tables against actual PNG dimensions, filling biome gaps (snow decorations, non-desert animals), regenerating zone object arrays with consistent biome palettes, and normalising naming/terminology** to "world". The 1M-context advantage pays off in a single-pass WORLD-AUDIT.md that identifies every broken tile reference in one read.

**Primary recommendation:** Produce `WORLD-AUDIT.md` FIRST — enumerate every Kenmi key referenced in zones.js / fantasyZones.js / realWorldZones.js, cross-check each against KENMI_CATALOG, verify PNG dimensions vs the frame-index constants in MapLoader, and list every zone's missing-biome gaps. Gate all rebuild plans on this audit. Treat the 8 zones as one plan per zone after shared-infrastructure plans ship.

---

## Architectural Responsibility Map

This phase is a single-tier rebuild — all work happens in **Browser / Client (Phaser runtime + the data files it consumes)**. No API, backend, or storage tier is touched. Tier mapping of the sub-capabilities:

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Asset catalog generation | Node script (build-time) | Browser (load-time) | `scripts/generate-kenmi-catalog.js` walks `public/assets/kenmi/` and emits `kenmiCatalog.js`; BootScene then loads it at runtime. |
| Asset preload | Browser (Phaser BootScene) | — | `BootScene.preload()` calls `this.load.spritesheet / this.load.image` for every catalog entry. |
| Zone definition (tiles, objects, NPCs) | Browser (JS data files) | — | `src/data/zones.js` and its `buildMap()` functions are pure JS — no server round-trip. |
| Ground rendering (tile grid) | Browser (Phaser MapLoader) | — | `MapLoader._renderKenmiTiles()` iterates the 2D array, picks frames, calls `scene.add.image(px, py, key, frame)`. |
| Object placement (buildings, props) | Browser (Phaser MapLoader) | — | `MapLoader.placeObjects()` renders `zone.objects` with Y-sort and collision bodies. |
| Decoration scatter | Browser (Phaser MapLoader) | — | `MapLoader.scatterDecorations()` does seeded-random prop placement. |
| Ambient animal spawning | Browser (Phaser MapLoader) | — | `MapLoader.spawnAmbientAnimals()` — desert-biome gated. |
| NPC sprite rendering | Browser (NPCManager) | — | `NPCManager.create()` reads `zone.npcs`, looks up `NPC_KEY_MAP`, renders Kenmi NPCs with hijab overlay for female NPCs. |
| Interactable rendering | Browser (InteractableManager) | — | Signs, doors, chests, etc. rendered with their own sprite keys. |
| Interior scene rendering | Browser (InteriorScene + MapLoader) | — | Same MapLoader used for interiors via `INTERIORS` data. |
| Regression validation | Node (vitest + jsdom) | — | Existing scene mocks (sceneMock.js) let MapLoader run headlessly — we extend this for visual regression snapshots. |

**Sanity-check signal for the plan:** any task that touches Redux slices, server routes, MongoDB schemas, or React overlay components is out of tier.

---

## Standard Stack

### Core (already installed — no dependency changes needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `phaser` | 3.90.0 | Scene graph, texture manager, sprite rendering, tilemap loader, physics (Arcade), input | Already the rendering engine for all game code; 3.90 is the 2025-era LTS with full Tiled JSON support. [VERIFIED: package.json line 25] |
| Kenmi Cute Fantasy (free asset bundle) | v1 (as shipped in public/assets/kenmi/) | Pixel-art tiles, buildings, props, characters, animals, UI | User has procured this; all 969 PNGs already on disk across 10 packs. Catalog generated by `scripts/generate-kenmi-catalog.js`. [VERIFIED: 969 PNGs counted via find] |
| `js-arabic-reshaper` | 1.0.0 | Arabic text reshaping for Phaser `text` objects | Already in use elsewhere — relevant if any in-world labels render. [VERIFIED: package.json line 20] |

### Supporting (in-repo, not external)

| Module | Purpose | When to Use |
|--------|---------|-------------|
| `src/data/kenmiCatalog.js` (969 entries, auto-generated) | Master list of every Kenmi asset with key, path, type, frameWidth/Height | Read-only at runtime; BootScene iterates it to preload. Regenerate via `node scripts/generate-kenmi-catalog.js`. |
| `src/data/spriteKeyMap.js` (226 LOC) | `BIOME_BUILDING_SETS`, `NPC_KEY_MAP` (24 entries), `FEMALE_NPC_IDS` (10 entries), `ENEMY_KENMI_MAP` (19 entries), legacy `SPRITE_KEY_MAP` fallback | Use as the single source of truth for "which Kenmi key maps to which role". Extend it (do not replace it) when adding new biome-specific sets. |
| `src/data/zoneAssetManifests.js` (195 LOC) | `SHARED_ASSETS` (loaded at boot), `ZONE_ASSET_MANIFESTS` (per-zone lazy load via `loadZoneAssets()`) | Shared = world/coast/indoor tilesets + faceless NPC sprites + desert tilesets used universally. Per-zone = extra tilesets that change by biome. |
| `src/data/zones.js` (1602 LOC) | 8 core zones: `oasis_village`, `ancient_library`, `desert_marketplace`, `farmland`, `bedouin_camp`, `mountain_village`, `coastal_port`, `royal_palace`. Each with `buildMap()`, `objects`, `npcs`, `interactables`, `exits`, `tilesetTheme`, `gatheringSpots` | Canonical zone data. Rebuild WILL regenerate `objects` arrays per zone and MAY adjust `buildMap()` terrain layouts, but must preserve every NPC `id`, interactable `id`, and exit target. |
| `src/data/zones/realWorldZones.js` (160 LOC) | 8 additional real-world zones (Baghdad, Cordoba, Timbuktu, Damascus, Cairo, Fez, Samarkand, Granada) | Out of scope for the "8 core zones" per CONTEXT.md but must not regress — rebuild cannot break their rendering. All use `tilesetTheme: 'desert'`. |
| `src/data/zones/fantasyZones.js` (152 LOC) | 8 fantasy zones (star_oasis, mountain_of_words, sea_of_ink, forest_of_tales, desert_of_silence, merchants_island, fortress_of_secrets, garden_of_spirits) | Same — not in the 8-zone rebuild list but must keep rendering. Use 6 different biomes (desert, snow, grass, mushroom, volcano, dungeon). |
| `src/data/zones/mapPlaceholder.js` (84 LOC) | Shared default `buildMap()` used by placeholder zones; `getDefaultObjects(biome)` factory | Don't delete; placeholder zones depend on it. |
| `src/game/systems/MapLoader.js` (1967 LOC) | Core programmatic renderer with `BIOME_TILESETS` (6 biomes), `PROP_CROP_REGIONS` (multi-item prop sheets), `_renderKenmiTiles`, `_renderFlatTiles`, `_renderSandTile/_renderGrassTile/_renderWaterTile`, `scatterDecorations`, `spawnAmbientAnimals`, `_createFoamAnimations`, `_safeFrame` | The workhorse. Rebuild will modify this file heavily — but must preserve public API (`create()`, `destroy()`, `getObjectSprites()`, `getGroundSprites()`, `getExitTriggers()`) so `MapLoader.test.js` (existing test file) keeps passing. |
| `src/game/systems/TiledMapLoader.js` (254 LOC) | Tiled JSON loader for the optional `test-map.json` path | Currently only `map-test-map` is registered in BootScene. If rebuild decides to move to Tiled JSON for some zones, this loader is ready — but CONTEXT forbids user-driven Tiled editing, so Tiled JSON would be Claude-generated via a build script. |
| `src/game/scenes/BootScene.js` (210 LOC) | Loads fonts, SHARED_ASSETS, KENMI_CATALOG, one Tiled JSON, runs `_generatePanelTextures()`, starts WorldScene | Single preload pass; all 969 Kenmi PNGs loaded upfront. This is acceptable — total asset weight is bounded and Phaser's cache handles repeated-zone-entry caching. |
| `src/game/scenes/WorldScene.js` (404 LOC) | Primary scene; orchestrates MapLoader, NPCManager, InteractableManager, PlayerController, and 20+ subsystems | Rebuild touches `buildZone()` and `clearZone()` only — do not rewire `update()` tick or shutdown order. |
| `src/game/scenes/InteriorScene.js` (227 LOC) | Building interiors via `INTERIORS` data + same MapLoader | Uses `tilesetTheme: 'indoor'` or similar — verify interior rendering is not regressed when MapLoader changes. Not listed in 8 zones to rebuild but shares the renderer. |
| `src/world/ZoneManager.js` + `ZoneRegistry.js` (121 LOC total) | Separate higher-level zone manager (registers realWorldZones + fantasyZones) — currently appears orphaned: WorldScene reads `ZONES` directly from zones.js | Flag for audit; may be dead code. Do not delete without verification. |
| `vitest` | 3.0.0 | Test runner with jsdom env | Visual regression tests added for Phase 97 will be vitest-based with tile-grid JSON snapshots and the existing scene mock. [VERIFIED: package.json line 52] |
| `playwright` | 1.58.2 | E2E test runner | 6 specs exist in `e2e/`. Rebuild should not require E2E changes unless a smoke test starts failing. [VERIFIED: package.json line 49] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Programmatic zone building in `zones.js` | Tiled Map Editor JSON exports | CONTEXT forbids user-driven Tiled editing. Claude could programmatically generate Tiled JSON but it adds a serialisation layer without gain — `buildMap()` functions already produce 2D arrays cleanly. Stick with programmatic. [ASSUMED vs CONTEXT — constraint is user-driven Tiled, not all Tiled; but no reason to introduce JSON intermediate.] |
| Hand-rolled Kenmi frame-index constants (`BEACH`/`GRASS_F`/`WATER_F`) | PNG-metadata-derived auto-tile table (read PNG dimensions at build time) | Current constants are fragile (off-by-one = black squares). A build-time script that introspects each tile PNG's grid and emits the frame table would be much more robust. Worth considering in the audit plan. [ASSUMED — feasibility depends on whether Kenmi PNGs follow a discoverable convention; they do, all tiles are 16px.] |
| Extending MapLoader.js (1967 LOC, 6 biomes, 3 render paths) | Splitting into `TerrainRenderer`, `DecorationScatterer`, `AnimalSpawner`, `PropCropRegistry` | Splitting improves clarity but risks breaking `MapLoader.test.js` (42 tests) and changes the public import surface. Safer: keep MapLoader as the facade, extract internal helpers to sibling files that MapLoader imports. |
| Tiles as `image` loads with frame cropping | Tiles as `spritesheet` loads with frame index | KENMI_CATALOG already classifies tile files as `spritesheet` — keep that. But SHARED_ASSETS line 67-88 also loads some tile PNGs as flat `image` for older Tiled-map support; these keys collide with the catalog. The rebuild should reconcile so each PNG has exactly ONE Phaser key type. [VERIFIED: zoneAssetManifests.js SHARED_ASSETS vs kenmiCatalog.js — 'desert-beach-tiles-1' is loaded twice with different keys.] |

**Installation:** none — zero new dependencies.

**Version verification:**
- `phaser@3.90.0` — verified in `package-lock.json`. [VERIFIED: package.json line 25]
- Phaser 3.90 is the current release series as of 2024-2025; no API-breaking changes expected in 3.9x. [CITED: https://github.com/phaserjs/phaser/releases]
- `vitest@3.0.0` — current major. [VERIFIED: package.json line 52]

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Node build-time                                                         │
│  public/assets/kenmi/ (969 PNGs, 10 packs) ──┐                          │
│                                              ▼                          │
│  scripts/generate-kenmi-catalog.js  ──▶ src/data/kenmiCatalog.js        │
└─────────────────────────────────────────────────────────────────────────┘
                                              │ import
                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Browser runtime — Phaser scenes                                         │
│                                                                         │
│   BootScene ─────────────────┐                                          │
│     ├─ load SHARED_ASSETS     │ (fonts, tilesets, player, 23 NPCs,     │
│     ├─ load KENMI_CATALOG     │  portraits, UI kit, backgrounds)        │
│     ├─ load test-map.json     │ (all 969 Kenmi PNGs)                    │
│     └─ create panel textures  ▼                                         │
│                                                                         │
│   WorldScene.create('oasis_village')                                    │
│     ├─ init subsystems (20+ managers)                                   │
│     └─ buildZone(zoneName, spawnX, spawnY)                              │
│          ├─ zone = ZONES[zoneName]         ◀── src/data/zones.js        │
│          ├─ if TiledMap cached:            ◀── map-test-map only        │
│          │    TiledMapLoader.load()                                     │
│          └─ else:                                                       │
│               MapLoader.create(zone, W, H)                              │
│                 ├─ zone.buildMap() → 2D array of tile type ints        │
│                 ├─ renderGroundTiles(groundData, W, H, biome)           │
│                 │   ├─ if Kenmi textures exist: _renderKenmiTiles       │
│                 │   │   └─ per-tile: pick sheet + frame via             │
│                 │   │       _renderSandTile/_renderGrassTile/            │
│                 │   │       _renderWaterTile using BIOME_TILESETS[biome]│
│                 │   └─ else: _renderFlatTiles (solid colour fallback)   │
│                 ├─ setupCollision (borders + water + object collideW/H) │
│                 ├─ placeObjects(zone.objects)  ◀── kenmi-* keys         │
│                 │   └─ Y-sorted, collide flags honoured                 │
│                 ├─ scatterDecorations (desert|grass only)               │
│                 │   └─ seeded random, biome-specific prop arrays,       │
│                 │       respects occupiedTiles and exitTiles sets        │
│                 ├─ spawnAmbientAnimals (desert only)                    │
│                 │   └─ chicken, cow, horse, frog, bee with walk-cycles  │
│                 └─ createExitTriggers(zone.exits)                       │
│                     └─ invisible physics bodies + edge signposts        │
│                                                                         │
│     ├─ NPCManager.create(zone.npcs, player, wallGroup)                  │
│     │   └─ each NPC → NPC_KEY_MAP → Kenmi sprite + hijab overlay if F   │
│     ├─ InteractableManager.create(zone.interactables, objectSprites)    │
│     │   └─ signs, doors, chests, fountains, lanterns, statues, …        │
│     └─ FloatingArabicLabelManager.create(zoneName, interactableManager) │
│         └─ FSRS-mastery-gated Arabic labels hover above objects         │
│                                                                         │
│   WorldScene.update()                                                   │
│     └─ PlayerController, NPCManager, InteractableManager,               │
│        StepTriggerSystem, ExitTriggerChecker, FloatingArabicLabelMgr    │
│                                                                         │
│   InteriorScene (mounted on door interaction)                           │
│     └─ same MapLoader against src/data/interiors.js data                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities (file-by-file)

| File | Responsibility | Modification Risk |
|------|----------------|-------------------|
| `scripts/generate-kenmi-catalog.js` | Walks Kenmi dir, classifies spritesheet vs image, emits catalog | Low — only extend if a new pack lands |
| `src/data/kenmiCatalog.js` | 969-entry auto-generated catalog | Zero — regenerate via script |
| `src/data/spriteKeyMap.js` | Biome → building key arrays; NPC ID → Kenmi key; female flag; enemy map; legacy fallback | Medium — extend biome sets (snow decorations, mushroom animals) and add new NPC mappings if any NPC currently maps to a face-bearing sprite |
| `src/data/zoneAssetManifests.js` | SHARED_ASSETS + per-zone lazy loads + `loadZoneAssets()` | Medium — reconcile collisions with KENMI_CATALOG keys; decide lazy vs upfront |
| `src/data/zones.js` | 8 core zones: buildMap + objects + npcs + interactables + exits | HIGH — objects arrays rebuilt per zone; buildMap may be re-tuned; PRESERVE all NPC/interactable/exit IDs |
| `src/data/zones/realWorldZones.js` | 8 real-world zones (all desert biome) | Medium — re-check that rebuilt MapLoader still renders them |
| `src/data/zones/fantasyZones.js` | 8 fantasy zones (6 biomes) | Medium — ensure no regression; mushroom/volcano/dungeon rendering is known-fragile |
| `src/data/zones/mapPlaceholder.js` | Default `buildMap()` + `getDefaultObjects(biome)` | Low |
| `src/game/systems/MapLoader.js` | Programmatic terrain + object + deco + animal rendering | HIGH — tile frame constants likely need PNG-derivation; biome gaps (snow decorations, non-desert animals) must fill; `_safeFrame` root-cause |
| `src/game/systems/TiledMapLoader.js` | Tiled JSON loader | Low — only used for `map-test-map`; leave alone unless Claude opts to introduce more Tiled JSONs |
| `src/game/systems/NPCManager.js` | NPC sprite rendering with hijab + movement | Low — only touch if new NPC_KEY_MAP entries need new rendering behaviour |
| `src/game/systems/InteractableManager.js` | Signs, doors, chests rendering | Low — sprite keys already Kenmi; rebuild may swap some keys |
| `src/game/scenes/BootScene.js` | Asset preload | Medium — reconcile duplicate tile loads |
| `src/game/scenes/WorldScene.js` | Scene orchestration | Low — only buildZone/clearZone need verification |
| `src/game/scenes/InteriorScene.js` | Interior scene | Low — verify, don't rewrite |
| `src/world/ZoneManager.js` + `ZoneRegistry.js` | Appears orphaned | Investigate; probably delete after verification |

### Recommended Project Structure (after rebuild)

```
src/
├── data/
│   ├── kenmiCatalog.js                   # auto-generated; unchanged
│   ├── kenmiFrameTables.js               # NEW: PNG-dimension-derived auto-tile frame tables
│   │                                     #      per biome (replaces hardcoded BEACH/GRASS_F/WATER_F)
│   ├── spriteKeyMap.js                   # extended with: BIOME_BUILDING_SETS.snow decorations,
│   │                                     #                BIOME_ANIMAL_SETS for non-desert,
│   │                                     #                FACELESS_CHARACTER_IDS verified complete
│   ├── zoneAssetManifests.js             # reconciled: no duplicate loads
│   └── zones.js                          # rebuilt objects arrays per zone; NPC/interactable/exit IDs preserved
├── game/
│   ├── systems/
│   │   ├── MapLoader.js                  # terrain + object + deco + animal rendering
│   │   │                                 # (keep public API stable for MapLoader.test.js)
│   │   ├── world/                        # NEW folder; MapLoader imports these
│   │   │   ├── TerrainRenderer.js        # extracted _renderKenmiTiles + per-tile methods
│   │   │   ├── DecorationScatterer.js    # extracted scatterDecorations
│   │   │   ├── AnimalSpawner.js          # extracted spawnAmbientAnimals
│   │   │   └── WorldSnapshot.js          # NEW: serialises tile-grid to deterministic JSON
│   │   │                                 #      for regression snapshots
│   │   └── TiledMapLoader.js             # unchanged
│   └── scenes/
│       ├── BootScene.js                  # reconciled preload
│       ├── WorldScene.js                 # unchanged (verify only)
│       └── InteriorScene.js              # unchanged (verify only)
└── test/
    ├── fixtures/
    │   └── world-snapshots/              # NEW: per-zone JSON snapshots (8 files)
    │       ├── oasis_village.json
    │       ├── ancient_library.json
    │       └── … (one per zone)
    └── setup.js                          # existing
```

Note: the folder is named `world/` per CONTEXT terminology rule.

### Pattern 1: Auto-tile frame-index derivation from PNG dimensions

**What:** Instead of hardcoding `const BEACH = { CORNER_TL: 0, EDGE_TOP: 1, … }` with magic numbers that go stale when a PNG changes, derive the frame table at **build time** from the actual PNG dimensions.

**When to use:** Every tileset frame table in MapLoader (BEACH, GRASS_F, WATER_F) and any new biome tables. This is the root-cause fix for black squares.

**Example:**
```js
// scripts/generate-kenmi-frame-tables.js (NEW)
import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';  // zero-dep 16KB library OR write a PNG-header parser

function frameTableFor16pxTileset(pngPath, { colsKnown, rowsKnown } = {}) {
  const { width, height } = imageSize(fs.readFileSync(pngPath));
  const cols = colsKnown ?? width / 16;
  const rows = rowsKnown ?? height / 16;
  const totalFrames = cols * rows;
  return {
    cols, rows, totalFrames,
    // 3×3 auto-tile positions (always the same for biome transition tilesets)
    CORNER_TL: 0,         EDGE_TOP:   1,         CORNER_TR:   2,
    EDGE_LEFT:  cols,     SOLID:      cols + 1,  EDGE_RIGHT:  cols + 2,
    CORNER_BL:  cols * 2, EDGE_BOTTOM: cols * 2 + 1, CORNER_BR: cols * 2 + 2,
  };
}
// Output: src/data/kenmiFrameTables.js
```

**Why:** Today's black squares come from `BEACH.EDGE_BOTTOM = BEACH_COLS * 2 + 1 = 11`, which is only valid if the PNG is 5 cols × 3 rows. If the artist ever exports a 5×4 or 6×3 variant, `_safeFrame` clamps to an incorrect frame silently. Deriving from the PNG itself makes the table self-healing. [VERIFIED: MapLoader.js lines 17-36; PNG dimensions confirmed in VISUAL-LAYER-DIAGNOSIS.md]

### Pattern 2: Per-zone deterministic tile-grid snapshot

**What:** Each zone produces a deterministic JSON of `{ tileType, textureKey, frameIndex, spritesheet }` per (x, y). Regeneration with the same inputs yields a byte-identical file.

**When to use:** Regression testing. Committed to `src/test/fixtures/world-snapshots/{zoneId}.json` once per zone post-rebuild. Later phases (v17, v18) that touch MapLoader run a test that regenerates the snapshot and diffs it against the committed fixture — any diff is a regression.

**Example:**
```js
// src/game/systems/world/WorldSnapshot.js
export function captureWorldSnapshot(mapLoader, zone, biome) {
  const snapshot = {
    zoneId: zone.id,
    biome,
    mapW: zone.mapWidth,
    mapH: zone.mapHeight,
    tiles: [],
    objects: zone.objects.map(o => ({ key: o.key, x: o.x, y: o.y })),
  };
  // walk mapLoader.groundSprites in order; each has .texture.key and .frame.name
  for (const s of mapLoader.groundSprites) {
    snapshot.tiles.push({
      px: s.x, py: s.y,
      key: s.texture.key,
      frame: s.frame?.name ?? 0,
    });
  }
  return snapshot;
}
```

### Pattern 3: Biome-complete prop and animal sets

**What:** Today `scatterDecorations` only runs for `desert` and `grass` biomes (line 1085 of MapLoader). `spawnAmbientAnimals` is desert-only (phase 41-03 decision). Snow / volcano / dungeon / mushroom biomes have ZERO ambient decoration or life. For the 8 core zones, this affects **mountain_village (snow)** — it currently has no scattered decorations and no animals.

**Fix:** Add `BIOME_DECORATION_SETS` and `BIOME_ANIMAL_SETS` to `spriteKeyMap.js`:
- snow: `kenmi-christmas-decorations-*` for snow scatter; base chickens/cows/horses with white-tint for snow animals.
- For the 8 core zones, only `snow` matters — the others are desert (5) or grass (2).

### Anti-Patterns to Avoid

- **Anti-pattern: Hardcoding frame indices without PNG verification.** This is the root cause of all current black squares. Derive from PNG dimensions at build time. [VERIFIED: VISUAL-LAYER-DIAGNOSIS.md]
- **Anti-pattern: Loading the same PNG as both `image` and `spritesheet` with different keys.** Creates texture-manager ambiguity and per-file duplicate memory. BootScene currently does this for some desert tiles via SHARED_ASSETS + DESERT_TILESETS vs KENMI_CATALOG. Reconcile so every PNG has exactly one Phaser key type.
- **Anti-pattern: Adding a new tileset without regenerating the catalog.** Manual edits to `kenmiCatalog.js` will be blown away by the next `npm run` of the generator script.
- **Anti-pattern: Replacing `MapLoader.test.js` assertions to accommodate new renderer behaviour.** The 2535-test invariant means test assertions are load-bearing. If a refactor breaks the existing 42 MapLoader tests, that's a regression signal, not a test-to-update.
- **Anti-pattern: Changing `NPC_KEY_MAP` entries without confirming the Kenmi target sprite is faceless.** Several `kenmi-desert-npc-desert-person-*` sprites DO have faces (visible eyes). Need visual audit; may require post-processing to remove faces before shipping.
- **Anti-pattern: Using "map" or "UI" terminology in new code.** CONTEXT is explicit. New files use "world".
- **Anti-pattern: Wiring new overlays into GameLayout.** This phase is in-canvas Phaser only; overlays are out of scope.
- **Anti-pattern: Hand-editing `tilesetTheme` in zones.js without cross-checking BIOME_TILESETS has a complete entry for that biome.** Snow biome has a `sandTint` but no snow-dedicated decoration set — adding tilesetTheme: 'snow' to a new zone without filling the decoration gap produces a barren zone.
- **Anti-pattern: Deleting `src/world/ZoneManager.js` and `ZoneRegistry.js` without verification.** They APPEAR orphaned (WorldScene reads `ZONES` directly from zones.js) but may be imported by something the audit hasn't inspected yet. Mark for audit, not deletion.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pixel-art tile rendering | Custom WebGL canvas | Phaser 3 `scene.add.image(x, y, key, frame).setScale(4)` | Phaser already batches, handles y-sort, tints, and physics bodies; it's what the other 199 systems use. |
| Auto-tile neighbour lookup (3×3 or blob tileset) | Custom neighbour walker | Existing `_getNeighbors(groundData, x, y, W, H)` + `_pickEdgeFrame` | Already in MapLoader.js with tests. |
| 16px → 64px scaling | Custom re-export of tile PNGs | Phaser `sprite.setScale(KENMI_SCALE = 4)` at render time | Zero asset inflation; preserves crisp pixels. |
| Seeded-random deterministic tile variants | Crypto or Math.random() | Existing `tileHash(x, y, seed)` in MapLoader | Deterministic, fast, already used by all current variant logic; critical for snapshot stability. |
| Arabic text rendering | Hand-reshape Arabic strings | `js-arabic-reshaper` already installed | Correct bidi + joining; installed at package.json line 20. |
| Sprite animation creation | Per-sprite anims.create at spawn | Centralised `_createFoamAnimations`, `_createAnimalAnimations`, `_createDecoGrassAnimations` in MapLoader | Pattern established; single registration per Phaser scene prevents duplicate-anim warnings. |
| PNG dimension reading at build time | Hand-running `file` command + regex | `image-size` npm library OR 20-line PNG header parser | Trivial and robust; PNG header is a fixed 24 bytes. Even a 20-line parser is better than hand-maintained constants. |
| Tile-grid serialisation for regression fixtures | YAML / custom binary | `JSON.stringify(snapshot, null, 2)` with stable key ordering | Git diff-friendly; no schema drift. |
| Asset manifest generation | Manual edit | Existing `scripts/generate-kenmi-catalog.js` | Already idempotent; just re-run. |
| Scene mock for headless tests | New mock | Existing `src/game/systems/__tests__/mocks/sceneMock.js` | Reused by 11 existing system tests; extend it rather than replace. |
| Cultural face removal | Manual Photoshop pass | Post-processing script that loads the PNG, blacks out eye pixels at known coords, saves back | If any existing `kenmi-*-npc-*` sprite has faces, a deterministic script removes them before commit — reproducible across asset refreshes. |

**Key insight:** every capability this phase needs already has an in-repo implementation. The rebuild is about **fixing, extending, and unifying** the existing code — not replacing it.

---

## Runtime State Inventory

This is a visual-only rebuild with **no stored data, live service config, OS-registered state, secrets, or build artifacts** affected beyond the project's own files. Verification below:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | **None.** IndexedDB stores player progress / FSRS / quests / equipment — none of these reference tile coordinates or Kenmi keys. `narrativeSlice` tracks `markBuildingVisited(interiorId)` which uses string IDs from zones.js (preserved). MongoDB server holds user auth / cloud sync — no world-layer data. [VERIFIED: grep for 'kenmi-' and 'tilesetTheme' against src/store — zero matches.] | None |
| Live service config | **None.** No external services reference world layer (no n8n workflows, no Datadog dashboards referencing tile IDs). Service worker may cache Kenmi PNGs — a full PNG refresh should bust SW cache. Vite dev server doesn't persist world state. | Bump SW cache version if face-removal post-processes any PNG (not automatic) |
| OS-registered state | **None.** No launchd / Task Scheduler / pm2 processes tied to Kenmi assets. | None |
| Secrets / env vars | **None.** No env vars reference world/map/zone/tile/kenmi strings. [VERIFIED: grep on source] | None |
| Build artifacts | `src/data/kenmiCatalog.js` is auto-generated; regenerate if new PNGs added. Vite builds the bundle from Kenmi PNGs in `public/assets/kenmi/` — a production build will re-pick-up any face-removed PNGs on next `vite build`. No stale caches to worry about. | Re-run `npm run build` after any asset changes |

**Nothing to migrate.** This is a classic code-and-data-file edit phase — no runtime state hiding in databases or services.

---

## Common Pitfalls

### Pitfall 1: Black squares from frame-index miscalculation
**What goes wrong:** MapLoader hardcodes `BEACH.EDGE_BOTTOM = 11` based on a 5×3 grid assumption. If any PNG is resized or `_safeFrame` silently clamps to 0, the player sees a black square (frame 0 is often an edge variant in biome tilesets, not a "safe fallback").
**Why it happens:** Frame tables are hand-maintained magic numbers; Kenmi PNG grid layout is not introspected.
**How to avoid:** Derive frame tables from PNG dimensions at build time (Pattern 1). Store derived tables in `src/data/kenmiFrameTables.js` (auto-generated from PNGs). Keep `_safeFrame` as a last-resort guard.
**Warning signs:** Visual — any square of solid black. Log-level — `_safeFrame` triggered (add a DEV-mode `console.warn` that logs clamped frame requests).

### Pitfall 2: Duplicate Kenmi PNG loads under different keys
**What goes wrong:** A PNG is loaded by KENMI_CATALOG as a `spritesheet` with frames AND by SHARED_ASSETS / DESERT_TILESETS as a flat `image`. The second load can overwrite the first in the texture manager; frame indices then return `undefined`, and rendering falls back to base frame 0.
**Why it happens:** Two independent lists were written at different times (`zoneAssetManifests.js` predates `kenmiCatalog.js`).
**How to avoid:** Pick ONE loader per PNG. Either: (a) remove DESERT_TILESETS and rely purely on KENMI_CATALOG — then TiledMapLoader tilesets must reference catalog keys; or (b) deduplicate by making SHARED_ASSETS the exception list (fonts, UI kit, faceless-NPC sprites) and letting KENMI_CATALOG own all Kenmi PNGs. [VERIFIED: VISUAL-LAYER-DIAGNOSIS.md identifies this exact issue.]
**Warning signs:** Same PNG appears at two Phaser keys in `scene.textures.list`. A simple dev-mode assertion in BootScene can detect this.

### Pitfall 3: Breaking `MapLoader.test.js` while refactoring
**What goes wrong:** The existing test file mocks `scene.add.image`, `scene.add.rectangle`, `scene.tweens.add`, `scene.physics.add.staticGroup`, and expects specific calls like `scene.add.image(32, 32, 'tile-grass')` when rendering GRASS. Any refactor that moves ground rendering to a new method or changes the texture key contract will fail these tests.
**Why it happens:** Tests assert specific side effects (texture keys, x/y coordinates, sprite-count), not behavioural outcomes.
**How to avoid:** Preserve MapLoader's public API exactly — `create()`, `destroy()`, `renderGroundTiles()`, `addWaterEdgeEffect()`, `buildExitEdgeSet()`, `addInvisibleWall()`, `getGroundSprites()`, `getObjectSprites()`, `getExitTriggers()`. Internal refactors into `src/game/systems/world/*.js` helper modules are fine as long as `MapLoader.js` imports them and re-exposes the same methods.
**Warning signs:** `vitest run src/game/systems/__tests__/MapLoader.test.js` fails after refactor — stop and revert.

### Pitfall 4: Inadvertent game-logic changes via zones.js edits
**What goes wrong:** Rebuilding `objects` arrays touches the same file as `npcs`, `interactables`, `exits`, `vocabCategories`, `gatheringSpots`, and `spawnPoint`. A clumsy edit drops an NPC ID or changes a door's `interiorId` → breaks 52 quests or 140 NPC dialogue trees silently.
**Why it happens:** `zones.js` is 1602 LOC and mixes visual and logical concerns.
**How to avoid:** Only rewrite the `objects` array and optionally adjust `buildMap()`. Do NOT touch `npcs`, `interactables`, `exits`, `vocabCategories`, `gatheringSpots`, `id`, `name`, `nameArabic`, `mapWidth`, `mapHeight`, `tilesetTheme`, or `spawnPoint`. Add a JSON-schema pre-commit check that asserts every zone still has every required field, every NPC ID and interactable ID survives, every exit target exists in ZONE_ORDER.
**Warning signs:** `npm test` reports regressions in `npc-*.test.js`, `quest-*.test.js`, or `zones.test.js`.

### Pitfall 5: Face-bearing Kenmi NPC sprites
**What goes wrong:** CONTEXT mandates faceless characters. The current `NPC_KEY_MAP` (src/data/spriteKeyMap.js) maps 24 role IDs to Kenmi sprites like `kenmi-desert-npc-desert-person-1.png`. Kenmi desert-person sprites have visible faces (eyes, mouths).
**Why it happens:** The v8.0 phase 41 decision was to hook Kenmi sprites to existing NPC IDs without re-checking the cultural constraint; `FACELESS_NPCS` in zoneAssetManifests still points at the old `/assets/sprites/npcs/faceless/*.png` PNGs (23 in that dir, confirmed by ls).
**How to avoid:** Audit every sprite key in NPC_KEY_MAP, BIOME_BUILDING_SETS (for any character-on-building), and `spawnAmbientAnimals` helpers. For each face-bearing sprite used in the 8 core zones, either: (a) revert to the existing `/assets/sprites/npcs/faceless/` PNGs and regenerate NPC_KEY_MAP, or (b) post-process the Kenmi sprite to remove eye pixels via a reproducible script. Both options are programmatic.
**Warning signs:** None in tests; this is a manual visual review — include in Wave 0 human-verify checkpoint.

### Pitfall 6: Cultural decoration conflicts
**What goes wrong:** Christmas pack has crosses (gingerbread-house has a cross on the roof in some variants), snowmen (ok), reindeer (ok), Santa (not ok in an Arabic RPG — swap for neutral pilgrim). Halloween witches should NOT appear in any core zone.
**Why it happens:** When filling the `snow` biome gap for `mountain_village`, there's temptation to grab christmas-decorations wholesale.
**How to avoid:** Whitelist which Kenmi packs per zone. `mountain_village` gets: base (stone/limestone buildings, grass variants tinted blue, standard animals), base/trees (pine-like trees OK), and selected Christmas (snowman, chimney, wreath-less gingerbread). NEVER: santa, reindeer, any crossed decoration, halloween assets, pumpkins, bats.
**Warning signs:** User review — flag every non-base, non-desert Kenmi pack asset used in the 8 core zones for explicit user sign-off.

### Pitfall 7: `spawnAmbientAnimals` desert-only lock
**What goes wrong:** Live-world feeling hinges on ambient animals. The current implementation guards `if (biome !== 'desert') return` (phase 41-03 decision). `farmland` and `coastal_port` are `grass` biome — zero ambient life. `mountain_village` is `snow` — zero ambient life.
**Why it happens:** Phase 41 shipped desert animals only to limit scope; no non-desert audit was done.
**How to avoid:** Extend `spawnAmbientAnimals` with a BIOME_ANIMAL_SETS config. grass: chicken, cow, horse, pig (already in Kenmi base/animals). snow: reindeer (careful — neutral framing), white-tinted horses. farmland should feel farm-like. Skip animals for desert if the zone has `gatheringSpots: true` and already has visual density.
**Warning signs:** `farmland` looks dead after rebuild — add this to the audit's completeness check.

### Pitfall 8: Interior scenes regressing
**What goes wrong:** `InteriorScene` uses the same `MapLoader` against `INTERIORS` data. Changes to `MapLoader._renderKenmiTiles` or `placeObjects` that assume outdoor zone shape break interiors.
**Why it happens:** The 8 zones don't include interiors in scope, but they share the renderer.
**How to avoid:** Explicitly test interior rendering as part of regression. Verify the `scholar_house_interior`, `merchant_house_interior`, etc. still render. Add at least one interior snapshot fixture.
**Warning signs:** E2E tests that open a door fail; or a visual human-verify of any building interior shows blank tiles.

---

## Code Examples

### Verified MapLoader create flow (current, works)

```javascript
// From src/game/systems/MapLoader.js (lines 380-419)
create(zone, mapWidth, mapHeight) {
  this.groundSprites = [];
  this.objectSprites = [];
  this.decoSprites = [];
  this.animalSprites = [];
  this.exitTriggers = [];

  const groundData = zone.buildMap();
  const objects = zone.objects;
  const exits = zone.exits || [];

  this.wallGroup = this.scene.physics.add.staticGroup();

  const biome = zone.tilesetTheme || 'desert';
  this.renderGroundTiles(groundData, mapWidth, mapHeight, biome);

  if (!this._hasKenmiTiles()) {
    this.addWaterEdgeEffect(groundData, mapWidth, mapHeight);
  }

  this.setupCollision(groundData, mapWidth, mapHeight, exits);
  this.placeObjects(objects);
  this.scatterDecorations(zone, groundData, mapWidth, mapHeight);
  this.spawnAmbientAnimals(zone, groundData, mapWidth, mapHeight);
  this.createExitTriggers(exits, mapWidth, mapHeight);

  return this.wallGroup;
}
```

### Recommended: PNG-derived frame table (new)

```javascript
// scripts/generate-kenmi-frame-tables.js (NEW)
import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';  // or inline a 20-line PNG header parser

const TILE_PNGS = [
  { key: 'kenmi-desert-tiles-desert-beach-tiles-1', path: 'public/assets/kenmi/desert/tiles/desert-beach-tiles-1.png' },
  { key: 'kenmi-desert-tiles-desert-grass',         path: 'public/assets/kenmi/desert/tiles/desert-grass.png' },
  { key: 'kenmi-desert-tiles-desert-water-tiles-1', path: 'public/assets/kenmi/desert/tiles/desert-water-tiles-1.png' },
  // … derive all tile keys from KENMI_CATALOG entries with /tiles/ in path and type === 'spritesheet'
];

function deriveFrameTable(pngPath) {
  const { width, height } = imageSize(fs.readFileSync(pngPath));
  const cols = width / 16;
  const rows = height / 16;
  return { cols, rows, totalFrames: cols * rows };
}

const tables = {};
for (const { key, path: p } of TILE_PNGS) {
  tables[key] = deriveFrameTable(p);
}
fs.writeFileSync(
  'src/data/kenmiFrameTables.js',
  `// AUTO-GENERATED — run scripts/generate-kenmi-frame-tables.js to regenerate\n` +
  `export const KENMI_FRAME_TABLES = ${JSON.stringify(tables, null, 2)};\n`
);
```

### Recommended: World snapshot capture (new)

```javascript
// src/game/systems/world/WorldSnapshot.js (NEW)
export function captureZoneSnapshot(mapLoader, zone, biome) {
  // Produces byte-identical output for same input — deterministic because:
  // - groundSprites iteration order = y × mapW + x
  // - tileHash seeded from (x, y, seed) constants
  return {
    version: 1,
    zoneId: zone.id,
    biome,
    mapW: zone.mapWidth,
    mapH: zone.mapHeight,
    tiles: mapLoader.groundSprites.map(s => ({
      x: s.x, y: s.y,
      key: s.texture.key,
      frame: typeof s.frame?.name !== 'undefined' ? s.frame.name : null,
    })),
    objects: zone.objects.map(o => ({
      key: o.key, x: o.x, y: o.y, collide: !!o.collide,
    })),
    decoCount: mapLoader.decoSprites.length,
    animalCount: mapLoader.animalSprites.length,
  };
}
```

### Example: MapLoader test extension for snapshot regression

```javascript
// src/game/systems/__tests__/WorldSnapshot.test.js (NEW)
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { createMockScene } from './mocks/sceneMock.js';
import { MapLoader } from '../MapLoader.js';
import { captureZoneSnapshot } from '../world/WorldSnapshot.js';
import { ZONES } from '../../../data/zones.js';

const CORE_ZONES = [
  'oasis_village', 'ancient_library', 'desert_marketplace', 'farmland',
  'bedouin_camp', 'mountain_village', 'coastal_port', 'royal_palace',
];

for (const zoneId of CORE_ZONES) {
  it(`${zoneId} renders deterministically — snapshot matches fixture`, () => {
    const scene = createMockScene();
    const loader = new MapLoader(scene);
    const zone = ZONES[zoneId];
    loader.create(zone, zone.mapWidth, zone.mapHeight);

    const snapshot = captureZoneSnapshot(loader, zone, zone.tilesetTheme);
    const fixturePath = path.resolve(`src/test/fixtures/world-snapshots/${zoneId}.json`);
    const expected = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    expect(snapshot).toEqual(expected);
  });
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Flat solid-colour tiles (sand = one 64px brown square per tile) | Kenmi 16×16 pixel art with auto-tile frame selection scaled 4× | v8.0 Phase 39 (2026-03-18) | Real pixel-art look; but introduced black-square frame-index bugs that remain. |
| Placeholder NPC sprites (128×128 thumbnails) | 16×16 Kenmi walk-cycle sprites in NPC_KEY_MAP | v8.0 Phase 41 (2026-03-18) | Character density looks right; but some Kenmi NPCs have faces, violating the faceless constraint. |
| Ambient animals: none | Desert chicken/cow/horse/bee/frog with walk-cycle anims | v8.0 Phase 41-03 | "Alive" desert zones; but grass and snow zones have no ambient life. |
| Placeholder buildings (coloured rectangles labelled "house") | Kenmi building PNGs with colour variants (BIOME_BUILDING_SETS) | v8.0 Phase 40 (2026-03-18) | Visual variety across zones. |
| Decorations: none | Seeded-random `scatterDecorations` with occupied-tile and exit-tile respect | v8.0 Phase 40-02 | Zones feel hand-placed (desert+grass only). |
| Single rendering code path | Dual path: programmatic `MapLoader` + Tiled JSON `TiledMapLoader` | v8.0 Phase 38 | Flexibility, but only one Tiled JSON is registered (`test-map`), so dual-path is latent. |

**Deprecated / outdated:**
- The `tile-sand` / `tile-grass` / `grass-ice` flat-colour sprites in SHARED_ASSETS are kept as emergency fallback when Kenmi textures fail to load (`_renderFlatTiles`). Do NOT remove in Phase 97 — the fallback is load-bearing for interior scenes that don't have Kenmi biomes.
- The `DESERT_TILESETS` entries in `zoneAssetManifests.js` (lines 142-149) are duplicate loads of KENMI_CATALOG entries under different keys. **Deprecate in favour of reusing KENMI_CATALOG keys via TiledMapLoader aliasing.** Reconcile in Phase 97.
- `src/world/ZoneManager.js` + `ZoneRegistry.js` appear orphaned — WorldScene uses the `ZONES` dict directly. Investigate and potentially delete (but defer to Phase 98 code health audit, not this phase).
- The `map-test-map` Tiled JSON (`BootScene.js:97`) is a left-over test asset. If not used by any zone, flag for removal in Phase 43/98 (NOT in Phase 97 — this is visual-only).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Face-removal post-processing is feasible (eye pixels are at known positions in Kenmi NPC sprites) | Pitfall 5 | If Kenmi NPC eye positions vary per-sprite, script approach fails → fall back to faceless PNGs in `/assets/sprites/npcs/faceless/` and update NPC_KEY_MAP to not use kenmi-desert-npc-* for faced characters. Decision: validate during WORLD-AUDIT. |
| A2 | `src/world/ZoneManager.js` is orphaned | Component Responsibilities | If something imports it, deletion would break that consumer. Decision: don't delete in Phase 97; mark for Phase 98. |
| A3 | Kenmi tile PNGs are consistent 16×16 grids | Pattern 1 | If any tile PNG has irregular framing, auto-derivation fails for that tile. Decision: script should validate `width % 16 === 0 && height % 16 === 0` and error-flag any outliers. |
| A4 | 2535-test-pass invariant can be preserved by holding MapLoader public API stable | Pitfall 3 | If tests assert internals (e.g., private method names), refactor to helper modules still breaks them. Decision: run `npm run test:run` before starting Phase 97 to capture pass-count, then incrementally after each commit. |
| A5 | `_safeFrame` clamping currently silently hides frame-table bugs | Pitfall 1 | Fix assumes clamping is the guard; if `_safeFrame` is bypassed somewhere, the bug may still surface. Decision: grep for `this.scene.add.image` in MapLoader and verify every call goes through `_safeFrame` for spritesheet keys. |
| A6 | CinematicIntroSequencer.js hardcoded coords (14,17)(14,18)(14,20) are in oasis_village and will remain valid after rebuild | Implementation | If `buildOasisMap()` changes the spawn/path layout, the intro sequence breaks. Decision: preserve the spawn region geometry in oasis_village; don't fundamentally re-shape the map around cinematic tiles. [VERIFIED via WORLD-VS-LOGIC-CONCERN.md that these coords exist.] |
| A7 | Vite's asset bundling picks up all 969 Kenmi PNGs with no per-file opt-in | Installation | If Vite's `publicDir` handling changes or a PNG path has disallowed characters, some assets silently 404. Decision: run a production build + smoke-test zone entry after rebuild. |
| A8 | Image-size npm package is zero-conflict with existing dependencies | Don't Hand-Roll | If dependency conflicts, inline a 20-line PNG-header parser. Low risk; image-size has ~0 deps and broad compatibility. |

**Open question:** is the `BIOME_DECORATION_SETS.snow` gap in scope for Phase 97, or does `mountain_village` stay bare because v8.0 shipped it that way? CONTEXT says "consistent art style across all 8 zones" — interpreting this as: mountain_village must have decorations and animals to match the other 7. Flag for plan-phase user confirmation.

---

## Phase Requirements

No formal REQ-IDs are assigned to Phase 97 (per CONTEXT "TBD — to be defined during planning — phase pre-dates formal REQ-IDs for v16.0"). The planner should emit REQ-IDs in the WORLD- namespace during plan-phase. Proposed mapping, derived from CONTEXT's success criteria:

| Proposed ID | Description | Research Support |
|----|-------------|------------------|
| WORLD-01 | All 8 core zones render without missing/broken tiles; every Kenmi key used in zones.js exists in KENMI_CATALOG | WORLD-AUDIT.md produces the matrix; Pitfall 1 and Pitfall 2 describe root causes; kenmiFrameTables.js fixes |
| WORLD-02 | Consistent Kenmi art style across all 8 zones (terrain, buildings, decorations, characters) | BIOME_BUILDING_SETS + new BIOME_DECORATION_SETS + BIOME_ANIMAL_SETS extensions |
| WORLD-03 | Character sprites are faceless (Islamic art constraint) | Audit NPC_KEY_MAP against Kenmi sprite face visibility; Pitfall 5 |
| WORLD-04 | No "map" or "UI" terminology in new code/docs | Naming discipline during rebuild; grep check as verification gate |
| WORLD-05 | No new overlay wiring introduced | Tier map confirms Phaser-only scope |
| WORLD-06 | All 2535 existing tests continue to pass | MapLoader public API preservation; Pitfall 3 |
| WORLD-07 | Per-zone deterministic world-snapshot JSON committed as regression fixture | WorldSnapshot.js + 8 fixture files |
| WORLD-08 | WORLD-AUDIT.md produced first as scope-gating document (1M-context single-pass) | Phase strategy from CONTEXT specifics |
| WORLD-09 | mountain_village (snow biome) has parity decorations and ambient life | BIOME_DECORATION_SETS.snow + BIOME_ANIMAL_SETS.snow gaps |
| WORLD-10 | farmland + coastal_port (grass biome) have ambient animals | BIOME_ANIMAL_SETS.grass gap |
| WORLD-11 | BootScene deduplicated — every Kenmi PNG has exactly one Phaser key type | Pitfall 2; reconcile SHARED_ASSETS vs KENMI_CATALOG |
| WORLD-12 | Interior scenes (building interiors) continue to render correctly | Pitfall 8; interior snapshot fixture |

---

## Open Questions (RESOLVED)

1. **Face-removal strategy for Kenmi NPC sprites**
   - What we know: 24 entries in NPC_KEY_MAP, several map to `kenmi-desert-npc-desert-person-*` which have visible eyes.
   - What's unclear: whether the user prefers (a) revert to existing `/assets/sprites/npcs/faceless/*.png` PNGs, or (b) post-process Kenmi sprites via script to black out eye pixels.
   - **RESOLVED:** Option (a) — use existing faceless PNGs. The `/assets/sprites/npcs/faceless/` directory contains **24 PNGs** (including `guide-amira.png`). Registration in `FACELESS_NPCS` (`src/data/zoneAssetManifests.js`) is currently only 23 entries; Plan 03 adds `guide-amira` to reach full 24/24 parity. Keep Kenmi for animals / enemies / buildings / decorations; use existing faceless sprites for named NPCs.

2. **Snow-biome decoration parity**
   - What we know: `scatterDecorations` skips everything except desert/grass. `mountain_village` has zero scatter.
   - What's unclear: does "consistent art style" in CONTEXT require snow decorations or is sparse snow acceptable?
   - **RESOLVED:** Treat as required (WORLD-09). User confirmed in plan-phase that snow-biome parity is required. Plan 05 fills gap with christmas pack selectively (snowman ok, santa/reindeer NO, no cross-bearing items). CULTURAL_EXCLUDES regex tightened in revision (W-4) to avoid false-matching benign tokens like `crossroads`.

3. **Tiled JSON path: keep or remove?**
   - What we know: TiledMapLoader exists, `map-test-map` is the only registered Tiled JSON.
   - What's unclear: does Phase 97 promote any zone to Tiled JSON, or keep everything programmatic?
   - **RESOLVED:** Keep everything programmatic; CONTEXT forbids user-driven Tiled and there's no Claude-driven advantage for this rebuild. TiledMapLoader left in place for future phases. `map-test-map` registration NOT removed in this phase (deferred to Phase 98 Code Health cleanup).

4. **Will any object-collision size need re-tuning?**
   - What we know: zones.js entries hard-code `collideW` and `collideH` per object (e.g., `desert-house-1.1` = 180×80). These were hand-tuned in v8.0.
   - What's unclear: if Kenmi building PNGs are visually re-seated (different x,y), do hard-coded collide sizes still match visual footprint?
   - **RESOLVED:** Keep collideW/H values unchanged unless the object visual origin changes. Plan 06 preserves existing collide sizes. If a rebuild repositions a building, verify collide size visually (headless screenshot in Plan 08).

5. **Will `_safeFrame` still be needed after kenmiFrameTables.js lands?**
   - What we know: `_safeFrame` clamps invalid frame requests to frame 0 or the max frame.
   - What's unclear: if frame tables are derived from PNGs, are there any remaining paths that can request an invalid frame?
   - **RESOLVED:** Keep `_safeFrame` as a belt-and-braces guard. Plan 04 adds a DEV-mode `console.warn` when triggered so future bugs surface loudly. Do not remove the clamp — it protects against any future path that might pass a frame from stale cached data.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | running scripts (generate-kenmi-*.js) and vitest | ✓ (implied — project builds) | 18+ expected | — |
| npm / vite | build + dev server | ✓ | Vite 7.3.1 | — |
| Phaser 3.90.0 | world rendering | ✓ | 3.90.0 | — |
| Kenmi asset bundle | all visual work | ✓ | 969 PNGs on disk | — |
| `image-size` or equivalent PNG-header reader | build-time frame-table generation | ✗ | — | Inline 20-line PNG header parser (no dep add) |
| Playwright | E2E sanity (not required to modify; just to verify no break) | ✓ | 1.58.2 | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** `image-size`. Fallback is a 20-line inline PNG header parser (PNG IHDR chunk at bytes 16-24 gives width/height). Trivial to add.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest@3.0.0 with jsdom environment |
| Config file | `vitest.config.js` (existing) |
| Quick run command | `npm run test:run -- src/game/systems/__tests__/MapLoader.test.js src/game/systems/__tests__/WorldSnapshot.test.js` |
| Full suite command | `npm run test:run` (2535 tests) |
| Coverage command | `npm run test:coverage` |
| E2E command | `npm run test:e2e` (playwright, 6 specs) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WORLD-01 | Every Kenmi key in zones.js exists in KENMI_CATALOG | unit (data integrity) | `vitest run src/data/__tests__/zoneAssetIntegrity.test.js` | ❌ Wave 0 |
| WORLD-01 | No black tiles — every ground sprite has a valid frame | integration (mapLoader + scene mock) | `vitest run src/game/systems/__tests__/MapLoader.frameValidity.test.js` | ❌ Wave 0 |
| WORLD-02 | Each of 8 core zones renders to a deterministic snapshot matching committed fixture | integration (snapshot regression) | `vitest run src/game/systems/__tests__/WorldSnapshot.test.js` | ❌ Wave 0 |
| WORLD-03 | Every NPC sprite key used by NPC_KEY_MAP is in the faceless whitelist | unit (data integrity) | `vitest run src/data/__tests__/facelessNpcs.test.js` | ❌ Wave 0 |
| WORLD-04 | No new file in `src/game/` or `src/data/` contains the token "map" in a filename or "UI" in new world-layer code | lint (grep) | custom npm script `npm run lint:world-terminology` | ❌ Wave 0 |
| WORLD-05 | No new overlay wired in `src/components/GameLayout.jsx` | diff gate (git) | PR-level manual — no automated test needed | — |
| WORLD-06 | All 2535 existing tests pass | regression | `npm run test:run` | ✅ (existing) |
| WORLD-07 | 8 zone snapshot fixture files exist and parse as valid JSON | unit | `vitest run src/test/fixtures/__tests__/snapshotsExist.test.js` | ❌ Wave 0 |
| WORLD-08 | WORLD-AUDIT.md exists at `.planning/phases/97-visual-world-layer-rebuild/WORLD-AUDIT.md` with required sections | manual checkpoint | human-verify (part of plan-phase workflow) | — |
| WORLD-09 | mountain_village snapshot has non-zero decoCount and animalCount | snapshot assertion | Included in WORLD-02 test | (via WORLD-02) |
| WORLD-10 | farmland + coastal_port snapshots have non-zero animalCount | snapshot assertion | Included in WORLD-02 test | (via WORLD-02) |
| WORLD-11 | No Phaser texture key is loaded twice under different classifications | BootScene integration | `vitest run src/game/scenes/__tests__/BootScene.duplicateLoads.test.js` | ❌ Wave 0 |
| WORLD-12 | Interior scenes render to valid snapshots | integration | Extend WorldSnapshot.test.js to cover INTERIORS | (via WORLD-02) |

### Sampling Rate
- **Per task commit:** `npm run test:run -- src/game/systems/__tests__/MapLoader.test.js` (fast — <5s)
- **Per wave merge:** `npm run test:run` (full 2535-test suite) + visual smoke test via `npm run dev` and manual zone walk-through
- **Phase gate (before `/gsd-verify-work`):** full suite + E2E (`npm run test:e2e`) + production build (`npm run build`) + manual visual verification of all 8 zones

### Wave 0 Gaps (test infrastructure to add before implementation)

- [ ] `src/data/__tests__/zoneAssetIntegrity.test.js` — verifies every `key: 'kenmi-*'` reference in zones.js + realWorldZones.js + fantasyZones.js exists in KENMI_CATALOG. Covers WORLD-01.
- [ ] `src/game/systems/__tests__/MapLoader.frameValidity.test.js` — builds each of 8 zones with mock scene, asserts every ground sprite has `frame` in the valid range for its texture. Covers WORLD-01.
- [ ] `src/game/systems/__tests__/WorldSnapshot.test.js` — regenerates snapshot for each zone, diffs against `src/test/fixtures/world-snapshots/{zoneId}.json`. Covers WORLD-02, WORLD-07, WORLD-09, WORLD-10, WORLD-12.
- [ ] `src/test/fixtures/world-snapshots/*.json` — 8 fixture files committed AFTER zone rebuild (produced by a one-shot "capture" script run at end of each zone plan).
- [ ] `src/data/__tests__/facelessNpcs.test.js` — asserts every sprite key referenced by NPC_KEY_MAP passes a face-check (either in FACELESS_NPCS list OR exists in `/assets/sprites/npcs/faceless/` directory). Covers WORLD-03.
- [ ] `scripts/lint-world-terminology.js` + `npm run lint:world-terminology` script — greps src/game/systems/world/ and new src/data entries added in Phase 97 for forbidden tokens ('map', 'UI'). Covers WORLD-04.
- [ ] `src/game/scenes/__tests__/BootScene.duplicateLoads.test.js` — mocks `this.load.spritesheet` / `this.load.image`, runs BootScene.preload, asserts no URL is loaded twice under different keys. Covers WORLD-11.
- [ ] `src/game/systems/world/WorldSnapshot.js` — serialisation helper described in Pattern 2.
- [ ] Extend `src/game/systems/__tests__/mocks/sceneMock.js` to provide a `textures.get(key)` that returns frame enumeration (currently stubbed for basic use) so WorldSnapshot and frameValidity tests can introspect textures.

### Regression Artifacts to Produce

Per CONTEXT specifics ("Add regression fixture: snapshot each zone's rendered tile grid as a deterministic JSON so future phases can detect regressions"):

1. **Per-zone tile-grid JSON** (Pattern 2). 8 files, one per core zone, in `src/test/fixtures/world-snapshots/`. Committed to git. Any future MapLoader change that alters ground tile rendering must update these fixtures intentionally, not silently.
2. **Interior snapshots** (if scope permits) — at least for `scholar_house_interior`, `merchant_house_interior`, `oasis_guild_interior` — prove InteriorScene is not regressed.
3. **Kenmi asset coverage report** — `scripts/report-kenmi-coverage.js` (NEW) walks KENMI_CATALOG and zones.js, produces `.planning/phases/97-visual-world-layer-rebuild/KENMI-COVERAGE.md` listing: (a) every Kenmi key used somewhere in world data, (b) every unused Kenmi key (for transparency — CONTEXT says "use ALL available Kenmi assets", so unused keys are a flag for audit).
4. **Before/after screenshot fixtures** — NOT automated-verified (visual review), but committed to `.planning/phases/97-visual-world-layer-rebuild/screenshots/{before,after}/{zoneId}.png` for human comparison. Produced by a manual `npm run dev` + screenshot per zone walk-through. 8 before + 8 after files minimum.
5. **BootScene duplicate-load detection** — test `BootScene.duplicateLoads.test.js` produces a PASS/FAIL gate; no artifact to commit beyond the test.

### Specific Test Files That Must NOT Regress

These are the 11 currently-passing system tests that directly touch the visual layer. Any task that introduces test failures in these files is an immediate revert signal:

- `src/game/systems/__tests__/MapLoader.test.js` (42 assertions across create/render/collision/exit/deco)
- `src/game/systems/__tests__/NPCManager.test.js` (NPC spawning)
- `src/game/systems/__tests__/InteractableManager.test.js` (doors, signs, chests)
- `src/game/systems/__tests__/ZoneTransition.test.js` (zone switching)
- `src/game/systems/__tests__/PlayerController.test.js` (player on ground)
- `src/game/systems/__tests__/SceneStackManager.test.js` (interior push/pop)
- `src/game/systems/__tests__/DOMOverlay.test.js` (DOM elements over canvas)
- `src/game/systems/__tests__/DialogueEngine.test.js` (dialogue triggers)
- `src/game/systems/__tests__/EquipmentManager.test.js` (equipment sprites)
- `src/game/systems/battle/__tests__/BattleStateMachine.test.js` (battle scene uses same MapLoader renderers for enemy sprites)
- `src/game/systems/companions/__tests__/CompanionManager.test.js` (companion sprites)

Plus all 263 test files for the broader 2535-test-pass invariant.

---

## Security Domain

**Applicable?** No — this phase is a pure in-canvas visual rebuild with no auth, no user input, no network requests, no secrets, no dynamic content. `security_enforcement` is not set in `.planning/config.json`. Since no network, storage, or user-input surface is modified, ASVS categories do not apply to this phase's deliverables. Standard project-level controls (JWT cookies, CSRF, Helmet, Zod, rate limiting) remain in place on the server and are untouched by Phase 97.

---

## Sources

### Primary (HIGH confidence)
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/97-visual-world-layer-rebuild/97-CONTEXT.md` — locked decisions
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/PROJECT.md` — project overview and constraints
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/STATE.md` — 2535 tests, v15.0 complete
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/ROADMAP.md` — Phase 97 section
- `/Users/theshumba/Documents/GitHub/gogo-arabic/VISUAL-LAYER-DIAGNOSIS.md` — diagnosis of black squares root cause
- `/Users/theshumba/Documents/GitHub/gogo-arabic/WORLD-VS-LOGIC-CONCERN.md` — confirms world/logic decoupling
- `/Users/theshumba/Documents/GitHub/gogo-arabic/package.json` — verified dependency versions (Phaser 3.90.0, Vitest 3.0.0)
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/data/kenmiCatalog.js` — 969 catalog entries confirmed (592 spritesheets, 377 images)
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/data/zoneAssetManifests.js` — SHARED_ASSETS + ZONE_ASSET_MANIFESTS + FACELESS_NPCS
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/data/zones.js` — 1602 LOC, 8 zones, 201 id-tagged entries
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/data/spriteKeyMap.js` — BIOME_BUILDING_SETS, NPC_KEY_MAP, FEMALE_NPC_IDS, ENEMY_KENMI_MAP
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/systems/MapLoader.js` — 1967 LOC, BIOME_TILESETS, PROP_CROP_REGIONS, frame-index constants, 3 render paths
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/systems/TiledMapLoader.js` — Tiled JSON path
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/scenes/BootScene.js` — asset preload
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/scenes/WorldScene.js` — scene orchestration
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/scenes/InteriorScene.js` — interior rendering (shared MapLoader)
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/systems/__tests__/MapLoader.test.js` — existing 42 assertions, load-bearing public API contract
- `/Users/theshumba/Documents/GitHub/gogo-arabic/src/game/systems/__tests__/mocks/sceneMock.js` — reusable Phaser scene mock
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/38-asset-pipeline/38-01-SUMMARY.md` — catalog generation pattern
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/39-terrain-rendering/39-RESEARCH.md` — prior phase research (reusable patterns)
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/39-terrain-rendering/39-03-SUMMARY.md` — documents "black squares" as deferred known-issue
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/40-buildings-decorations/40-01-SUMMARY.md` — BIOME_BUILDING_SETS provenance
- `/Users/theshumba/Documents/GitHub/gogo-arabic/.planning/phases/41-characters-ambient-life/41-03-SUMMARY.md` — NPC and animal spawning decisions
- `/Users/theshumba/Documents/GitHub/gogo-arabic/public/assets/kenmi/` — 969 PNGs verified via find
- `/Users/theshumba/Documents/GitHub/gogo-arabic/public/assets/sprites/npcs/faceless/` — 23 faceless PNGs verified via ls
- `git log --oneline -- src/game/systems/MapLoader.js` — history of rendering changes

### Secondary (MEDIUM confidence — official Phaser docs not consulted in-session but API usage verified against existing code)
- Phaser 3 tilemap / spritesheet / texture-manager APIs — inferred from the 3,183 LOC of in-repo scene/system code which reliably uses the same patterns.

### Tertiary (LOW confidence — training knowledge not verified this session)
- Generic "pixel-art game rendering best practices" — none cited as load-bearing in this research; all recommendations are grounded in in-repo patterns.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every library, version, and in-repo module verified by direct file read
- Architecture patterns: HIGH — patterns derived from existing 1967-LOC MapLoader implementation and prior phase research (v8.0 Phase 39-41)
- Pitfalls: HIGH — Pitfalls 1-4 verified against VISUAL-LAYER-DIAGNOSIS.md + SUMMARY files; Pitfalls 5-8 are logical extensions grounded in constraint mapping
- Validation architecture: HIGH — test framework, existing test files, and regression approach all verified
- Environment availability: HIGH — all dependencies already installed, no procurement needed

**Research date:** 2026-04-17
**Valid until:** 2026-05-17 (30 days — codebase may shift as v12.0-v15.0 phases already landed; do not assume stale for visual layer since no active work modifies MapLoader between now and Phase 97 execution)

---

*Phase: 97-visual-world-layer-rebuild*
*Research produced for gsd-planner consumption — CONTEXT.md decisions are LOCKED and inform every downstream plan.*
