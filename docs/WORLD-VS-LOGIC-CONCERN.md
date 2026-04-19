# Big Concern: Will Rebuilding the World Break the Game Logic?

**Date raised:** 2026-03-19
**Status:** RESOLVED — No, they are separate. But read the edge cases below.

## The Concern

I keep building more game logic (vocabulary, quests, onboarding, combat, dialogue, learning systems) while the world (tiles, buildings, NPC positions, terrain, decorations) is visually broken. My worry is: when I eventually rebuild the world from scratch, will it break all the logic I've built?

## The Answer: No — with very small exceptions

The world and the game logic are **almost completely decoupled**. Here's why:

### What the game logic uses
- **NPC IDs** (like `"merchant-fatima"`, `"scholar-yusuf"`) — not their pixel coordinates
- **Zone names** (like `"oasis_village"`, `"desert_marketplace"`) — not their layouts
- **Object IDs** (like `"barrel-01"`, `"sign-market"`) — not where they sit on screen
- **Quest names, vocabulary word IDs, dialogue tree names** — all string-based, no coordinates

### What the world controls
- Where tiles are placed (sand, grass, water, paths)
- Where buildings sit (x/y pixel coordinates)
- Where NPCs spawn (x/y pixel coordinates)
- Where interactive objects sit (pots, signs, barrels)
- Decorations (palm trees, cacti, camels, rocks)
- Collision boundaries (where you can and can't walk)

### The bridge between them: `zones.js`
One data file (`src/data/zones.js`) connects the world to the logic. It lists each zone's NPCs and objects with their x/y positions. When you redesign a zone's layout, you update the coordinates in this file. That's the only change needed.

## Edge Cases — When the World DOES Affect Logic

These are rare but real:

### 1. Hardcoded coordinates in game logic
A few systems reference specific pixel positions:
- `CinematicIntroSequencer.js` — FloatingWordObject spawns at tile (14,17), Amira at tile (14,18), camera pans to tile (14,20)
- Any quest that says "go to position X,Y" rather than "go to NPC named X"

**Impact:** When you redesign the world, search the codebase for hardcoded tile coordinates and update them. This is a 5-minute job per zone.

### 2. Zone size changes
If you make a zone much larger or smaller, the camera bounds and collision grid need updating. This is automatic if you use Tiled maps (the map file defines its own size).

### 3. Collision layout
NPCs pathfind around walls and obstacles. If you redesign where walls are, the pathfinding just works with the new layout — no code changes. But if you remove a wall that was acting as a zone gate (blocking progress), the gating logic in `zones.js` needs to stay consistent.

### 4. The HUD/UI
The HUD (health bar, buttons, quest tracker, clock) is **completely separate** from both the world and the logic. It's React components pinned to the screen edges. Changing the world doesn't affect the HUD at all. Changing the HUD doesn't affect the world or logic.

## Bottom Line

**Keep building logic. The world rebuild is independent work.** When you're ready to redesign the world:
1. Design zones in Tiled Map Editor
2. Export as JSON
3. Update `zones.js` with new NPC/object coordinates
4. Search for any hardcoded pixel positions in game code (rare)
5. Done — all logic, quests, vocabulary, dialogue, combat just works

---
*This concern was raised on 2026-03-19 during v10.0 onboarding development.*
*Reference this file whenever the question comes up again.*
