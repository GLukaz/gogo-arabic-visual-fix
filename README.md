# Gogo Arabic — Visual Layer Fix

This repository is a stripped-down copy of Gogo Arabic, scoped specifically for a Phaser 3 visual-rendering bug fix. Business-planning files, autonomous-agent scripts, backend code, and unrelated tooling have been removed. Everything you need to reproduce, debug, and fix the visual bugs is here.

## The problem

The game's Phaser world layer renders incorrectly across all 8 zones:

- Ground tiles display as a chaotic mosaic of sand / water / grass frames
- NPC sprites recently started rendering at ~8x their intended size (regression from a recent refactor — see `docs/WORLD-AUDIT.md` Face-Bearing NPC Sprites section)
- Some decoration props appear at wrong positions / scales
- Specific bug classes are documented below

## Where to start (read these in order)

1. **`docs/WORLD-AUDIT.md`** — single most important file. Single-pass audit identifying every bug class with file paths, line numbers, and fix recommendations mapped to downstream sub-tasks.
2. **`docs/VISUAL-LAYER-DIAGNOSIS.md`** — pre-existing diagnosis of the "black squares" tile issue, with verified PNG dimensions and frame math.
3. **`docs/WORLD-VS-LOGIC-CONCERN.md`** — confirms the visual layer is decoupled from game logic. Tells you what you can safely touch.
4. **`docs/97-CONTEXT.md`** — hard constraints (no overlay wiring, "world" terminology, no face-bearing NPCs, etc.)
5. **`docs/97-RESEARCH.md`** — deep technical research: pitfalls, patterns, validation architecture.
6. **`src/game/systems/MapLoader.js`** — the ~2000-line file where most rendering bugs live. The audit points at specific line numbers.

## Running the game

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the game loads, you walk around with WASD / arrow keys. You should see the broken visuals immediately (chaotic ground tiles, oversized NPCs in certain cases).

## Scope — strictly enforced

**IN SCOPE (you may modify):**

- `src/game/**` (Phaser code — scenes, systems, sprites)
- `src/data/zones.js`, `src/data/zones/**`, `src/data/kenmiCatalog.js`, `src/data/kenmiFrameTables.js`, `src/data/spriteKeyMap.js`, `src/data/zoneAssetManifests.js`
- `public/assets/**` (art — modify only if needed)
- `scripts/**` (build-time helpers)
- New test files in `src/**/__tests__/`

**OUT OF SCOPE (do not modify):**

- `src/store/**` (Redux state)
- `src/game/systems/fsrs/**` (learning algorithm)
- `src/game/systems/battle/**` (battle state machine)
- `src/data/ink/**` (dialogue story files)
- Arabic content JSON in `src/data/`
- `src/components/GameLayout.jsx` (no new overlay wiring)
- Any existing tests (they must continue to pass)

## Success criteria

1. All 8 zones (`oasis_village`, `ancient_library`, `desert_marketplace`, `farmland`, `bedouin_camp`, `mountain_village`, `coastal_port`, `royal_palace`) render with clean, consistent Kenmi pixel art
2. NPC sprites at correct scale
3. All existing tests pass: `npm run test:run`
4. Terminology lint passes: `npm run lint:world-terminology`
5. Before/after screenshots for all 8 zones

## Delivery

1. Create a branch from `main`, work on that branch
2. Atomic commits — one concern per commit, each reverting cleanly
3. Open a Pull Request against `main`
4. Include before/after screenshots in the PR description
5. Ping the repo owner for review

## Test commands

```bash
npm run test:run                  # Full test suite
npm run test:e2e                  # Playwright E2E
npm run lint                      # ESLint
npm run lint:world-terminology    # Phase-specific terminology gate
npm run build                     # Production build (must pass)
```

## Notes

- This repo has a fresh Git history — your work here won't leak into the main private repo until the owner copies it over as clean commits crediting you.
- Please document any scope ambiguity before changing anything that touches the out-of-scope list above.
