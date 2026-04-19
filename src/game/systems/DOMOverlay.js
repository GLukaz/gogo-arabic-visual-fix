// DOMOverlay manages HTML elements positioned over the Phaser canvas.
// Used for: NPC name labels (Arabic + English), sign text, interaction prompts.
// Updates position every frame based on camera position so overlays track
// world coordinates while rendering crisp, native Arabic text via the DOM.

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

class DOMOverlayManager {
  constructor(scene) {
    this.scene = scene;
    this.overlays = new Map(); // id -> { element, worldX, worldY, offsetX, offsetY, visible }
    this.container = null;
    // Cache last camera state to avoid updating every frame
    this.lastCameraScrollX = 0;
    this.lastCameraScrollY = 0;
    this.lastScaleX = 1;
    this.lastScaleY = 1;
    // Dirty flag: set to true when any overlay position changes (independent of camera)
    this._overlayMoved = false;
  }

  // Call once when scene starts - creates the overlay container div
  init() {
    this.container = document.createElement('div');
    this.container.id = 'dom-overlays';
    this.container.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:10;';

    // Insert after the Phaser canvas
    const canvas = this.scene.game.canvas;
    canvas.parentElement.appendChild(this.container);
  }

  // Create a text overlay at a world position.
  // Returns the overlay ID.
  createOverlay(id, worldX, worldY, htmlContent, options = {}) {
    const el = document.createElement('div');
    el.innerHTML = htmlContent;
    el.style.cssText = `
      position: absolute;
      transform: translate(-50%, -100%);
      white-space: nowrap;
      pointer-events: ${options.interactive ? 'auto' : 'none'};
      transition: opacity 0.2s;
      ${options.style || ''}
    `;

    // If created hidden, start with opacity 0
    if (options.visible === false) {
      el.style.opacity = '0';
    }

    this.container.appendChild(el);

    this.overlays.set(id, {
      element: el,
      worldX,
      worldY,
      offsetX: options.offsetX || 0,
      offsetY: options.offsetY || 0,
      visible: options.visible !== false,
    });

    return id;
  }

  // Create an NPC name label overlay.
  // Renders Arabic name in Amiri serif font and English name in pixel font.
  createNpcLabel(npcId, worldX, worldY, arabicName, englishName) {
    const html = `
      <div style="text-align:center;">
        <div style="font-family:'Amiri',serif;font-size:14px;color:#D4A843;text-shadow:0 1px 2px rgba(0,0,0,0.8);">${escapeHtml(arabicName)}</div>
        <div style="font-family:'Press Start 2P',cursive;font-size:8px;color:#FFFFFF;text-shadow:0 1px 2px rgba(0,0,0,0.8);">${escapeHtml(englishName)}</div>
      </div>
    `;
    return this.createOverlay(`npc-label-${npcId}`, worldX, worldY, html, {
      offsetY: -20,
    });
  }

  // Create an interaction prompt ("SPACE") that starts hidden.
  createInteractionPrompt(id, worldX, worldY) {
    const html = `
      <div style="font-family:'Press Start 2P',cursive;font-size:8px;color:#FFFFFF;background:rgba(0,0,0,0.7);padding:3px 8px;border-radius:3px;border:1px solid #D4A843;">
        SPACE
      </div>
    `;
    return this.createOverlay(`prompt-${id}`, worldX, worldY, html, {
      offsetY: -50,
      visible: false,
    });
  }

  // Show or hide an overlay with a CSS opacity transition
  setVisible(id, visible) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.visible = visible;
      overlay.element.style.opacity = visible ? '1' : '0';
    }
  }

  // Replace the inner HTML of an overlay
  updateContent(id, htmlContent) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.element.innerHTML = htmlContent;
    }
  }

  // Move an overlay to a new world position
  updatePosition(id, worldX, worldY) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      if (overlay.worldX !== worldX || overlay.worldY !== worldY) {
        overlay.worldX = worldX;
        overlay.worldY = worldY;
        this._overlayMoved = true; // mark dirty so update() recomputes even with static camera
      }
    }
  }

  // Remove an overlay and clean up its DOM element
  removeOverlay(id) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.element.remove();
      this.overlays.delete(id);
    }
  }

  // Called every frame from scene.update() to sync overlay screen positions
  // with their world coordinates, accounting for camera scroll and canvas scaling.
  // Optimized to only update DOM when camera actually moves, scale changes,
  // or an overlay's world position changed.
  update() {
    const camera = this.scene.cameras.main;
    const scaleX = this.scene.game.canvas.width / camera.width;
    const scaleY = this.scene.game.canvas.height / camera.height;

    // Only update if camera position, scale, or any overlay position changed
    const cameraChanged =
      camera.scrollX !== this.lastCameraScrollX ||
      camera.scrollY !== this.lastCameraScrollY ||
      scaleX !== this.lastScaleX ||
      scaleY !== this.lastScaleY;

    if (!cameraChanged && !this._overlayMoved) {
      return;
    }

    // Update cache
    this.lastCameraScrollX = camera.scrollX;
    this.lastCameraScrollY = camera.scrollY;
    this.lastScaleX = scaleX;
    this.lastScaleY = scaleY;
    this._overlayMoved = false;

    // Update all overlay positions
    for (const [, overlay] of this.overlays) {
      if (!overlay.visible) continue;

      const screenX =
        (overlay.worldX - camera.scrollX + overlay.offsetX) * scaleX;
      const screenY =
        (overlay.worldY - camera.scrollY + overlay.offsetY) * scaleY;

      overlay.element.style.left = `${screenX}px`;
      overlay.element.style.top = `${screenY}px`;
    }
  }

  // Clean up all overlays and remove the container from the DOM
  destroy() {
    for (const [, overlay] of this.overlays) {
      overlay.element.remove();
    }
    this.overlays.clear();
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

export default DOMOverlayManager;
