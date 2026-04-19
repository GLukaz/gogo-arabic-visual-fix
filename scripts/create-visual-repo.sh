#!/bin/bash
# Creates a stripped-down repo with ONLY visual layer files for external developer
# Usage: ./scripts/create-visual-repo.sh

set -e

SOURCE="$HOME/Documents/GitHub/gogo-arabic"
TARGET="$HOME/Documents/GitHub/gogo-arabic-visual"

echo "Creating stripped visual layer repo at: $TARGET"

# Clean previous
rm -rf "$TARGET"
mkdir -p "$TARGET"

# --- PHASER SCENES ---
mkdir -p "$TARGET/src/game/scenes"
cp "$SOURCE/src/game/scenes/BootScene.js" "$TARGET/src/game/scenes/"
cp "$SOURCE/src/game/scenes/WorldScene.js" "$TARGET/src/game/scenes/"
cp "$SOURCE/src/game/scenes/InteriorScene.js" "$TARGET/src/game/scenes/"
cp "$SOURCE/src/game/scenes/BattleScene.js" "$TARGET/src/game/scenes/"
cp "$SOURCE/src/game/scenes/CalligraphyScene.js" "$TARGET/src/game/scenes/"

# --- PHASER SPRITES ---
mkdir -p "$TARGET/src/game/sprites"
cp "$SOURCE/src/game/sprites/"*.js "$TARGET/src/game/sprites/" 2>/dev/null || true

# --- PHASER OBJECTS ---
mkdir -p "$TARGET/src/game/objects"
cp "$SOURCE/src/game/objects/"*.js "$TARGET/src/game/objects/" 2>/dev/null || true

# --- PHASER UI ---
mkdir -p "$TARGET/src/game/ui"
cp "$SOURCE/src/game/ui/"*.js "$TARGET/src/game/ui/" 2>/dev/null || true

# --- GAME SYSTEMS (visual only) ---
mkdir -p "$TARGET/src/game/systems/battle"
mkdir -p "$TARGET/src/game/systems/companions"

# Core visual systems
for f in CinematicIntroSequencer DayNightCycle DOMOverlay FloatingArabicLabelManager \
         GameFeel GatheringSpotManager InteractableManager MapLoader MountSystem \
         NPCManager ParticleEffectManager PlayerController SceneStackManager \
         ScreenShake TiledMapLoader WeatherSystem ZoneToast ZoneTransition; do
    cp "$SOURCE/src/game/systems/${f}.js" "$TARGET/src/game/systems/" 2>/dev/null || true
done

# Battle visual systems
cp "$SOURCE/src/game/systems/battle/"*.js "$TARGET/src/game/systems/battle/" 2>/dev/null || true

# Companion visual systems
cp "$SOURCE/src/game/systems/companions/CompanionManager.js" "$TARGET/src/game/systems/companions/" 2>/dev/null || true

# --- GAME CONFIG & ENTRY ---
cp "$SOURCE/src/game/PhaserGame.jsx" "$TARGET/src/game/"
cp "$SOURCE/src/game/config.js" "$TARGET/src/game/"

# --- REACT COMPONENTS (visual overlays only) ---
for dir in Battle Shop Companions HUD World UI Menu Router Dialogue; do
    if [ -d "$SOURCE/src/components/$dir" ]; then
        mkdir -p "$TARGET/src/components/$dir"
        cp "$SOURCE/src/components/$dir/"*.jsx "$TARGET/src/components/$dir/" 2>/dev/null || true
        cp "$SOURCE/src/components/$dir/"*.css "$TARGET/src/components/$dir/" 2>/dev/null || true
        cp "$SOURCE/src/components/$dir/"*.module.css "$TARGET/src/components/$dir/" 2>/dev/null || true
    fi
done

# --- EVENT BUS ---
mkdir -p "$TARGET/src/utils"
cp "$SOURCE/src/utils/eventBus.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/eventBusTypes.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/arabicUtils.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/battleHelpers.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/frechetDistance.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/tashkeelFading.js" "$TARGET/src/utils/" 2>/dev/null || true
cp "$SOURCE/src/utils/accessibility.js" "$TARGET/src/utils/" 2>/dev/null || true

# --- HOOKS (visual only) ---
mkdir -p "$TARGET/src/hooks"
for f in useEventBusListeners useOverlayClose useFormatArabic useAudio useKeyboardShortcuts; do
    cp "$SOURCE/src/hooks/${f}.js" "$TARGET/src/hooks/" 2>/dev/null || true
    cp "$SOURCE/src/hooks/${f}.jsx" "$TARGET/src/hooks/" 2>/dev/null || true
done

# --- AUDIO SERVICE ---
mkdir -p "$TARGET/src/services"
cp "$SOURCE/src/services/audio.js" "$TARGET/src/services/" 2>/dev/null || true

# --- ALL ART ASSETS (full copy) ---
echo "Copying art assets (this may take a moment)..."
cp -R "$SOURCE/public" "$TARGET/public"

# --- PROJECT CONFIG ---
cp "$SOURCE/package.json" "$TARGET/"
cp "$SOURCE/package-lock.json" "$TARGET/" 2>/dev/null || true
cp "$SOURCE/vite.config.js" "$TARGET/" 2>/dev/null || true
cp "$SOURCE/index.html" "$TARGET/" 2>/dev/null || true

# --- MAIN ENTRY ---
cp "$SOURCE/src/main.jsx" "$TARGET/src/" 2>/dev/null || true

# --- STYLES ---
cp "$SOURCE/src/index.css" "$TARGET/src/" 2>/dev/null || true
cp "$SOURCE/src/App.css" "$TARGET/src/" 2>/dev/null || true

# --- DEVELOPER BRIEF ---
cp "$SOURCE/contracts/developer-brief.md" "$TARGET/BRIEF.md" 2>/dev/null || true

# --- GIT INIT ---
cd "$TARGET"
git init
git add -A
git commit -m "Initial visual layer repo for external developer"

echo ""
echo "Done! Stripped repo created at: $TARGET"
echo ""
echo "File count:"
find "$TARGET/src" -name "*.js" -o -name "*.jsx" -o -name "*.css" | wc -l
echo "Asset count:"
find "$TARGET/public/assets" -type f | wc -l
