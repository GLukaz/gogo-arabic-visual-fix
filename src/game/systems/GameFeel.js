// ============================================================
// GAME FEEL SYSTEM
// Hit-stop, floating damage numbers, camera choreography,
// slow-motion — Phaser-side game feel utilities.
// All exported as named functions; no class instantiation needed.
// Respects prefers-reduced-motion for accessibility.
// ============================================================

/**
 * Returns true if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// ============================================================
// HIT STOP
// Freezes the scene's physics and time for a brief moment to
// sell impactful hits. Pauses physics + tweens, then resumes.
// ============================================================

/**
 * Freeze the scene momentarily — classic "hit-stop" effect.
 *
 * @param {Phaser.Scene} scene      - The active Phaser scene
 * @param {number}       durationMs - Freeze duration in ms (default 50)
 */
export function hitStop(scene, durationMs = 50) {
  if (!scene || prefersReducedMotion()) return;

  // Pause physics world (if ArcadePhysics is active)
  if (scene.physics && scene.physics.world) {
    scene.physics.world.pause();
  }

  // Pause all active tweens
  if (scene.tweens) {
    scene.tweens.pauseAll();
  }

  // Resume everything after durationMs
  scene.time.delayedCall(durationMs, () => {
    if (scene.physics && scene.physics.world) {
      scene.physics.world.resume();
    }
    if (scene.tweens) {
      scene.tweens.resumeAll();
    }
  });
}

// ============================================================
// FLOATING TEXT
// Creates a text label that floats upward and fades out.
// Used for damage numbers, XP gained, words learned, etc.
// ============================================================

/**
 * Spawn a floating text label that drifts upward and fades away.
 *
 * @param {Phaser.Scene} scene    - The active Phaser scene
 * @param {number}       x        - World X position
 * @param {number}       y        - World Y position
 * @param {string}       text     - Label text (e.g. "-15", "+50 XP", "صواب!")
 * @param {string}       color    - CSS hex colour string (default '#ffffff')
 * @param {number}       fontSize - Font size in px (default 16)
 * @returns {Phaser.GameObjects.Text|null}
 */
export function floatingText(
  scene,
  x,
  y,
  text,
  color = '#ffffff',
  fontSize = 16
) {
  if (!scene) return null;

  const label = scene.add.text(x, y, text, {
    fontFamily: '"Press Start 2P", cursive',
    fontSize: `${fontSize}px`,
    color,
    stroke: '#000000',
    strokeThickness: 3,
    resolution: 2,
  });

  label.setOrigin(0.5, 1);
  label.setDepth(1000); // always on top

  if (prefersReducedMotion()) {
    // No animation — show briefly then destroy
    scene.time.delayedCall(600, () => label.destroy());
    return label;
  }

  // Float up + fade out over 1 second
  scene.tweens.add({
    targets: label,
    y: y - 60,
    alpha: 0,
    duration: 1000,
    ease: 'Cubic.easeOut',
    onComplete: () => label.destroy(),
  });

  return label;
}

// ============================================================
// CAMERA FLASH
// Brief white (or coloured) camera flash — used for level-ups
// and major discoveries.
// ============================================================

/**
 * Flash the camera for a brief moment.
 *
 * @param {Phaser.Scene} scene    - The active Phaser scene
 * @param {number}       color    - Phaser hex colour (default 0xffffff)
 * @param {number}       duration - Flash duration in ms (default 100)
 */
export function cameraFlash(scene, color = 0xffffff, duration = 100) {
  if (!scene || prefersReducedMotion()) return;

  const cam = scene.cameras.main;
  if (!cam) return;

  cam.flash(duration, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff);
}

// ============================================================
// CAMERA ZOOM
// Smooth camera zoom for dramatic moments (boss encounters,
// cutscenes, puzzle completions).
// ============================================================

/**
 * Smoothly zoom the camera to a target zoom level.
 *
 * @param {Phaser.Scene} scene      - The active Phaser scene
 * @param {number}       targetZoom - Target zoom factor (1 = normal)
 * @param {number}       duration   - Tween duration in ms (default 500)
 */
export function cameraZoom(scene, targetZoom, duration = 500) {
  if (!scene) return;

  const cam = scene.cameras.main;
  if (!cam) return;

  if (prefersReducedMotion()) {
    cam.setZoom(targetZoom);
    return;
  }

  scene.tweens.add({
    targets: cam,
    zoom: targetZoom,
    duration,
    ease: 'Sine.easeInOut',
  });
}

// ============================================================
// SLOW MOTION
// Temporarily slows the scene's time scale for epic moments.
// Returns the scene to normal speed after `duration` ms.
// ============================================================

/**
 * Enter slow-motion for a set duration, then return to normal speed.
 *
 * @param {Phaser.Scene} scene     - The active Phaser scene
 * @param {number}       timeScale - Slow-motion time scale (default 0.3)
 * @param {number}       duration  - How long slow-mo lasts in ms (default 1000)
 */
export function slowMotion(scene, timeScale = 0.3, duration = 1000) {
  if (!scene || prefersReducedMotion()) return;

  // Phaser's time scale affects physics and tweens running through the scene
  scene.time.timeScale = timeScale;
  if (scene.physics && scene.physics.world) {
    scene.physics.world.timeScale = 1 / timeScale; // inverse — physics uses 1/timeScale
  }

  // Restore after duration (measured in real-world ms, not game-time ms)
  const realTimer = setTimeout(() => {
    if (scene && scene.time) {
      scene.time.timeScale = 1;
    }
    if (scene && scene.physics && scene.physics.world) {
      scene.physics.world.timeScale = 1;
    }
  }, duration);

  // Safety: allow caller to cancel if scene shuts down early
  if (scene.events) {
    scene.events.once('shutdown', () => clearTimeout(realTimer));
    scene.events.once('destroy', () => clearTimeout(realTimer));
  }
}
