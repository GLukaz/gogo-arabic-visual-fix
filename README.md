# GoGo Arabic

An Arabic learning RPG that teaches Modern Standard Arabic through exploration, quests, and turn-based word battles in a pixel-art world.

## Architecture

This is a **hybrid React + Phaser** application. React handles all UI (menus, quizzes, HUD, overlays) while Phaser 3 runs the game world (tile maps, sprites, camera, physics). They communicate through a centralized EventBus (`src/utils/eventBusTypes.js`). Redux Toolkit manages shared state across both layers.

- **Frontend:** React 19, Phaser 3, Redux Toolkit (29 slices, 9 middleware), Framer Motion
- **Backend:** Express 5, MongoDB (optional — frontend works fully offline with localStorage/IndexedDB)
- **Testing:** Vitest, Testing Library, Playwright
- **Build:** Vite 7
- **Node:** 22+ required (ESM, `"type": "module"`)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The backend server is optional. To run it:
```bash
cd server
cp .env.example .env  # Edit with your MongoDB URI and JWT secret
npm install
npm run dev
```

## Project Structure

```
src/
  components/   # 37 feature directories (Battle/, Quiz/, NPC/, etc.)
  data/         # Game data (vocabulary, NPCs, zones, quests, grammar)
  game/
    scenes/     # 4 Phaser scenes (World, Interior, Battle, Boot)
    systems/    # 40+ game systems (NPC, Map, Zone, Equipment, etc.)
    sprites/    # Phaser game objects (Player, NPC, etc.)
    events/     # EventBus type registry
    ui/         # Phaser-layer UI elements
  hooks/        # 19 custom React hooks
  store/
    slices/     # 29 Redux slices (player, battle, vocabulary, etc.)
    middleware/  # 9 middleware (achievements, battle rewards, etc.)
  services/     # Storage, sync, audio services
  styles/       # Theme and shared styles
  utils/        # Helpers and utilities
  world/        # Zone management
server/         # Express API (MVC: controllers, routes, models, middleware)
.planning/      # GSD workflow: roadmap, phase plans, state tracking
```

For a comprehensive project reference, see `GOGO_ARABIC_OVERVIEW.md`.

## Features

- **Arabic Alphabet Module** — Learn all 28 letters with four forms, vowel combinations, and writing quizzes
- **Spaced Repetition Vocabulary** — FSRS-based review system across 6 CEFR levels (A1-C2)
- **Turn-Based Word Battles** — Fight bosses by answering Arabic vocabulary questions
- **Root Magic System** — Cast spells derived from Arabic trilateral roots with elemental affinities
- **Equipment & Economy** — Craft, buy, and equip gear from zone-themed shops with haggling
- **Companion System** — Recruit 12 companions across 6 zones with role-based battle AI
- **Grammar Lessons** — Interactive exercises covering essential Arabic grammar patterns
- **Quest System** — Story-driven and side quests with NPC dialogue trees
- **6 Explorable Zones** — Desert village, ancient library, mountain fortress, coastal market, oasis garden, and grand mosque
- **Daily Goals & Achievements** — Streaks, milestones, and progress tracking

## Cultural Design

This project follows culturally respectful design principles:

- **Faceless characters** — All pixel-art characters are depicted without facial features, following Islamic artistic traditions
- **No music** — Audio design uses ambient soundscapes and sound effects only
- **Arabic-first** — All in-game Arabic text uses proper right-to-left rendering with tashkeel (diacritical marks)
- **Historically grounded** — Zones and narratives draw from real Arabic and Islamic history and culture

## License

Private project. All rights reserved.
