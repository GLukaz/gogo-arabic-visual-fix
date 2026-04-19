# Phase 97: Visual/World Layer Rebuild - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning
**Source:** Direct user conversation (no discuss-phase run — context captured inline by orchestrator)

<domain>
## Phase Boundary

Rebuild Gogo Arabic's visual/world layer so every zone renders correctly using Kenmi assets, with no broken tiles and a consistent art style. Leverages Opus 4.7's 1M context window to reason across the entire 210K LOC codebase — all zones, Phaser scenes, render paths, plugins, and asset pipelines — in a single pass. This is pure visual work. Game logic is out of scope: all 2535 existing tests must still pass untouched.

</domain>

<decisions>
## Implementation Decisions

### Scope & Constraints
- **Visual layer only** — terrain, buildings, decorations, characters, Phaser world rendering. Game logic, Redux slices, quest systems, FSRS, dialogue — all untouched.
- **All 2535 existing tests must continue to pass** — any change that breaks a test is out of scope. This is the verification gate.
- **No new overlay wiring** — per user feedback memory. Don't wire new overlays into GameLayout as part of this work; if an overlay rebuild is needed, file it for a separate phase.
- **"World" terminology, never "map" or "UI"** — per user feedback memory. All new file names, variables, comments, docs in this phase use "world".

### Asset strategy
- **Use Kenmi tilesets** — user has provided 969 PNGs across 10 packs. Use ALL available Kenmi assets (terrain, buildings, decorations, characters, animals). Do not fall back on placeholders if a Kenmi asset exists for the purpose.
- **No manual Tiled editing by the user** — Claude builds maps programmatically. User is NOT using Tiled Map Editor. Any zone-building is code-driven with Kenmi tile IDs.
- **Faceless characters only** — Islamic art consideration. Modify any character sprites that have faces to remove eyes/faces. Applies to Monster Quest and any other sourced sprites.

### Quality Expectations
- **Quality is the most important thing** — user explicitly stated this.
- **Don't rush visual work** — per user feedback memory. Take passes. Better to spend more compute getting consistent art style right than to ship 8 zones with mismatched tiles.
- **Realistic placeholders at minimum** — per user feedback memory "UI quality: realistic placeholders, full batch sizes, design-first". Never ship obvious placeholder squares.
- **Full batch sizes** — if a zone needs 30 decoration tiles, place all 30, don't half-do it.

### 1M Context Window Strategy
- **Single-pass analysis** — load the entire Phaser world layer (all zones, scenes, render paths, plugin registrations, asset configs, bootloaders) into one context at analysis time. Find every callsite, every zone reference, every tile ID pattern in one read.
- **Cross-zone consistency check** — with all 8 zones visible simultaneously, verify Kenmi art style is consistent across zones. This is the capability Opus 4.6 could not do well.

### Zones to rebuild (from PROJECT.md)
All 8 existing zones must render cleanly:
1. oasis_village
2. ancient_library
3. desert_marketplace
4. farmland
5. bedouin_camp
6. mountain_village
7. coastal_port
8. royal_palace

### Preserve
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Asset & visual conventions
- `.planning/PROJECT.md` — core product, zones, NPCs, cultural constraints (no faces, no music)
- `.planning/ROADMAP.md` — Phase 97 goal and success criteria
- `.planning/STATE.md` — current shipped state (v15.0 complete, 85 phases, 2535 tests)

### Existing visual pipeline (must read to map current state)
- `src/scenes/` — Phaser scenes including WorldScene, InteriorScene, BootScene
- `src/game/zones/` — zone definitions and tile references
- `public/assets/` — current asset organization
- `src/game/` — Phaser plugin and config files

### User feedback memories (hard constraints)
- Claude does ALL visual work (no Tiled editing requested of user)
- Use "world" terminology, not "map" or "UI"
- No new overlay wiring in Gogo Arabic
- Realistic placeholders, full batch sizes, design-first
- Don't rush visual work

</canonical_refs>

<specifics>
## Specific Ideas

- Produce a pre-rebuild `WORLD-AUDIT.md` first that lists every broken/missing tile reference and every zone's current asset gaps — this informs the rebuild scope.
- Treat the zone rebuilds as 8 parallelizable plans (one per zone) after the audit + shared-infrastructure plans ship.
- Add regression fixture: snapshot each zone's rendered tile grid as a deterministic JSON so future phases can detect regressions.
- Use Opus 4.7 1M context at the AUDIT stage specifically — that is where the single-pass reasoning pays off.

</specifics>

<deferred>
## Deferred Ideas

- Animated tile effects (flowing water, swaying trees) — defer to a future polish phase.
- Day/night lighting — out of scope (already in PROJECT.md out-of-scope list).
- New zones beyond the existing 8 — out of scope.
- Replacing game-logic-related systems (Redux slices, FSRS, dialogue engine) — out of scope.
- Overlay UI redesigns — deferred to avoid scope creep and per "no overlay wiring" feedback.
- UI-SPEC workflow — skipped per user feedback memory ("skip UI-SPEC gate for under-the-hood phases"); this is a visual rebuild of the in-world Phaser layer, not UI component redesign.

</deferred>

---

*Phase: 97-visual-world-layer-rebuild*
*Context gathered: 2026-04-17 via orchestrator-captured conversation*
