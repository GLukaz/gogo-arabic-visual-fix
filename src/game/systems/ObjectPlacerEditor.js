// ============================================================
// OBJECT PLACER EDITOR
// In-game tool for manually placing scatter objects (props) onto a zone.
// Activated by appending ?placeObjectsEditor to the URL.
//
// Workflow:
//   1. Pick a prop from the left palette
//   2. Click on the world to drop it at the hovered tile
//   3. Right-click a placement to delete it
//   4. Click "Copy JSON" to copy the placements as a snapshot-compatible
//      objects[] array (paste into src/test/fixtures/world-snapshots/<zone>.json
//      under "objects", or into a zone definition).
// ============================================================

import { TILE, ZONES } from '../../data/zones.js';
import { PROP_CROP_REGIONS, FLAT_GROUND_PROPS, KENMI_SCALE } from './MapLoader.js';
import { BIOME_DECORATION_SETS, BIOME_SCATTER_PROP_SETS, ANIMATED_DECO_PROPS } from '../../data/spriteKeyMap.js';

// Texture-key prefixes that count as placeable scatter objects. Anything in the
// Phaser texture cache matching one of these is shown in the palette, so non-
// cropped props (halfdead-tree, fountain, snowmen, etc.) appear alongside the
// PROP_CROP_REGIONS entries.
const PLACEABLE_PREFIXES = [
  'kenmi-desert-props-',
  'kenmi-base-outdoor-decoration-',
  'kenmi-military-',
  'kenmi-christmas-decorations-',
];

const PANEL_Z = 99999;

function isEnabled() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.has('placeObjectsEditor') || params.has('objectPlacer');
}

export class ObjectPlacerEditor {
  constructor(scene) {
    this.scene = scene;
    this.placements = []; // [{ key, x, y, collide, _sprite }]
    this.selectedKey = null;
    this.defaultCollide = true;
    this.showAllBiomes = false;
    this.previewSprite = null;
    this.tileLabel = null;

    // DOM
    this.root = null;
    this.paletteEl = null;
    this.listEl = null;
    this.statusEl = null;

    // Bound handlers (so we can off them on destroy)
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  enable() {
    // Register deco animations (campfire, flies, banners, animated grass) so
    // animated previews/placements actually play. scatterDecorations would
    // normally do this but it's no longer auto-running.
    if (this.scene.mapLoader && this.scene.mapLoader._createDecoGrassAnimations) {
      this.scene.mapLoader._createDecoGrassAnimations();
    }
    this._buildDOM();
    this._refreshPalette();
    this._attachInput();
    this._setStatus('Editor ready — pick a prop, click to place');
  }

  disable() {
    this._detachInput();
    if (this.previewSprite) { this.previewSprite.destroy(); this.previewSprite = null; }
    if (this.tileLabel) { this.tileLabel.destroy(); this.tileLabel = null; }
    for (const p of this.placements) {
      if (p._sprite) p._sprite.destroy();
    }
    this.placements = [];
    if (this.root && this.root.parentNode) this.root.parentNode.removeChild(this.root);
    this.root = null;
  }

  // Called by WorldScene whenever a new zone is loaded — wipes placements list
  // (preview placements only exist in-memory and are not part of the zone).
  onZoneChanged() {
    for (const p of this.placements) {
      if (p._sprite) p._sprite.destroy();
    }
    this.placements = [];
    this._refreshList();
    this._refreshPalette();
    this._setStatus(`Zone: ${this.scene.currentZone}`);
  }

  // --------------------------------------------------------------
  // DOM
  // --------------------------------------------------------------

  _buildDOM() {
    const root = document.createElement('div');
    root.id = 'object-placer-editor';
    root.style.cssText = `
      position: fixed; top: 0; left: 0; bottom: 0;
      width: 280px; z-index: ${PANEL_Z};
      background: rgba(15, 15, 20, 0.92);
      color: #e0e0e0; font-family: 'Courier New', monospace; font-size: 12px;
      border-right: 2px solid #E63946; display: flex; flex-direction: column;
      pointer-events: auto;
    `;

    root.innerHTML = `
      <div style="padding:8px 10px; background:#1a1a22; border-bottom:1px solid #333;">
        <div style="color:#E63946; font-weight:bold; font-size:13px;">OBJECT PLACER</div>
        <div id="op-status" style="color:#888; font-size:10px; margin-top:2px;">Initializing...</div>
        <div style="margin-top:6px; display:flex; gap:4px; flex-wrap:wrap;">
          <button id="op-copy"   style="${btnCSS('#4CAF50')}">Copy JSON</button>
          <button id="op-undo"   style="${btnCSS()}">Undo</button>
          <button id="op-clear"  style="${btnCSS()}">Clear</button>
          <button id="op-close"  style="${btnCSS('#666')}">Close</button>
        </div>
        <label style="display:flex; align-items:center; gap:4px; margin-top:6px; font-size:11px; color:#aaa;">
          <input type="checkbox" id="op-collide" checked> collide on new placements
        </label>
        <label style="display:flex; align-items:center; gap:4px; margin-top:2px; font-size:11px; color:#aaa;">
          <input type="checkbox" id="op-showall"> show all biomes (incl. military, christmas)
        </label>
      </div>
      <div style="padding:6px 10px; background:#15151c; border-bottom:1px solid #333;">
        <input id="op-search" placeholder="filter props..." style="
          width:100%; box-sizing:border-box; background:#0a0a10; color:#e0e0e0;
          border:1px solid #333; padding:4px 6px; font-family:inherit; font-size:11px;">
      </div>
      <div id="op-palette" style="flex:1; overflow-y:auto; padding:6px;"></div>
      <div style="padding:6px 10px; background:#1a1a22; border-top:1px solid #333; max-height:35%; overflow-y:auto;">
        <div style="color:#E63946; font-size:11px; margin-bottom:4px;">PLACEMENTS (<span id="op-count">0</span>)</div>
        <div id="op-list"></div>
      </div>
    `;

    document.body.appendChild(root);
    this.root = root;
    this.paletteEl = root.querySelector('#op-palette');
    this.listEl = root.querySelector('#op-list');
    this.statusEl = root.querySelector('#op-status');

    root.querySelector('#op-copy').addEventListener('click', () => this._copyJSON());
    root.querySelector('#op-undo').addEventListener('click', () => this._undo());
    root.querySelector('#op-clear').addEventListener('click', () => {
      if (this.placements.length && !window.confirm('Clear all placements?')) return;
      while (this.placements.length) this._undo();
    });
    root.querySelector('#op-close').addEventListener('click', () => this.disable());
    root.querySelector('#op-collide').addEventListener('change', (e) => {
      this.defaultCollide = e.target.checked;
    });
    root.querySelector('#op-showall').addEventListener('change', (e) => {
      this.showAllBiomes = e.target.checked;
      this._refreshPalette(this.root.querySelector('#op-search').value.trim().toLowerCase());
    });
    root.querySelector('#op-search').addEventListener('input', (e) => {
      this._refreshPalette(e.target.value.trim().toLowerCase());
    });
  }

  _refreshPalette(filter = '') {
    if (!this.paletteEl) return;

    const biome = this._currentBiome();

    // Default mode: only show props that scatterDecorations would consider for
    // this biome — that's the union of BIOME_SCATTER_PROP_SETS[biome].* and
    // BIOME_DECORATION_SETS[biome]. The palette tracks the current zone's
    // biome, so swapping zones updates which props show up.
    const biomeKeys = new Set();
    const scatterSet = BIOME_SCATTER_PROP_SETS[biome];
    if (scatterSet) {
      for (const list of Object.values(scatterSet)) for (const k of list) biomeKeys.add(k);
    }
    for (const k of (BIOME_DECORATION_SETS[biome] || [])) biomeKeys.add(k);
    // Animated deco props (campfire, flies, banners, animated grass) — small set
    // shared across desert/grass biomes; always include so they're placeable.
    for (const k of Object.keys(ANIMATED_DECO_PROPS)) biomeKeys.add(k);

    let known;
    if (this.showAllBiomes) {
      // Override: surface every placeable across biomes plus loaded textures
      // matching prop prefixes (military, christmas, etc.) for manual placements.
      known = new Set(Object.keys(PROP_CROP_REGIONS));
      for (const list of Object.values(BIOME_DECORATION_SETS)) for (const k of list) known.add(k);
      for (const set of Object.values(BIOME_SCATTER_PROP_SETS)) {
        for (const list of Object.values(set)) for (const k of list) known.add(k);
      }
      if (this.scene.textures && this.scene.textures.list) {
        for (const texKey of Object.keys(this.scene.textures.list)) {
          if (PLACEABLE_PREFIXES.some((p) => texKey.startsWith(p))) known.add(texKey);
        }
      }
    } else {
      known = biomeKeys;
    }

    const allKeys = [...known].sort();
    const loadedKeys = allKeys.filter((k) => this.scene.textures.exists(k));
    const pool = loadedKeys.length ? loadedKeys : allKeys;
    const keys = pool.filter((k) => !filter || k.toLowerCase().includes(filter));

    // Update the status hint with biome context so the user knows what's filtered.
    const biomeHint = this.showAllBiomes
      ? `all biomes (${keys.length} keys)`
      : `biome: ${biome} (${keys.length} keys)`;
    if (this.statusEl && !this.selectedKey) this.statusEl.textContent = `Pick a prop — ${biomeHint}`;

    // Group by namespace (kenmi-desert-props, kenmi-base-outdoor-decoration, kenmi-military)
    const groups = new Map();
    for (const k of keys) {
      const m = k.match(/^kenmi-([^-]+(?:-[^-]+)?)-/);
      const group = m ? m[1] : 'other';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(k);
    }

    this.paletteEl.innerHTML = '';
    for (const [group, gkeys] of groups) {
      const header = document.createElement('div');
      header.textContent = group.toUpperCase();
      header.style.cssText = 'color:#888; font-size:10px; margin:8px 0 4px; padding-bottom:2px; border-bottom:1px solid #333;';
      this.paletteEl.appendChild(header);

      for (const key of gkeys) {
        const row = document.createElement('div');
        row.dataset.key = key;
        row.style.cssText = `
          padding:4px 6px; margin:1px 0; cursor:pointer; border:1px solid transparent;
          border-radius:3px; font-size:10px; word-break:break-all;
          background: ${this.selectedKey === key ? '#3a1f24' : 'transparent'};
          border-color: ${this.selectedKey === key ? '#E63946' : 'transparent'};
        `;
        row.textContent = key.replace(/^kenmi-/, '');
        row.addEventListener('mouseenter', () => {
          if (this.selectedKey !== key) row.style.background = '#1f1f28';
        });
        row.addEventListener('mouseleave', () => {
          if (this.selectedKey !== key) row.style.background = 'transparent';
        });
        row.addEventListener('click', () => this._selectKey(key));
        this.paletteEl.appendChild(row);
      }
    }
  }

  _selectKey(key) {
    this.selectedKey = key;
    this._refreshPalette(this.root.querySelector('#op-search').value.trim().toLowerCase());
    this._setStatus(`Selected: ${key} — click to place, right-click placed object to delete`);
    this._updatePreview();
  }

  _refreshList() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';
    this.root.querySelector('#op-count').textContent = String(this.placements.length);
    const recent = this.placements.slice(-50).reverse();
    for (let i = 0; i < recent.length; i++) {
      const idx = this.placements.length - 1 - i;
      const p = recent[i];
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:4px; align-items:center; font-size:10px; margin:1px 0; color:#aaa;';
      row.innerHTML = `
        <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.key.replace(/^kenmi-/, '')}</span>
        <span style="color:#E63946;">${p.x},${p.y}</span>
        <span style="color:${p.collide ? '#4CAF50' : '#666'}; cursor:pointer;" title="toggle collide">${p.collide ? 'C' : '·'}</span>
        <span style="color:#E63946; cursor:pointer; padding:0 4px;" title="delete">x</span>
      `;
      const [, , , collideBtn, delBtn] = row.querySelectorAll('span');
      collideBtn.addEventListener('click', () => {
        p.collide = !p.collide;
        this._refreshList();
      });
      delBtn.addEventListener('click', () => this._deletePlacement(idx));
      this.listEl.appendChild(row);
    }
  }

  _setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  _currentBiome() {
    const zoneId = this.scene.currentZone;
    const zone = zoneId && ZONES[zoneId];
    return (zone && zone.tilesetTheme) || 'desert';
  }

  // --------------------------------------------------------------
  // Phaser input
  // --------------------------------------------------------------

  _attachInput() {
    this.scene.input.on('pointermove', this._onPointerMove);
    this.scene.input.on('pointerdown', this._onPointerDown);
    // Disable native context menu over the canvas so right-click can be used to delete
    this.scene.game.canvas.addEventListener('contextmenu', this._onContextMenu);
    window.addEventListener('keydown', this._onKeyDown);
  }

  _detachInput() {
    this.scene.input.off('pointermove', this._onPointerMove);
    this.scene.input.off('pointerdown', this._onPointerDown);
    this.scene.game.canvas.removeEventListener('contextmenu', this._onContextMenu);
    window.removeEventListener('keydown', this._onKeyDown);
  }

  _onContextMenu(e) { e.preventDefault(); }

  _onKeyDown(e) {
    // Skip when typing in the search box or any input
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'Escape') {
      this.selectedKey = null;
      this._refreshPalette();
      if (this.previewSprite) { this.previewSprite.destroy(); this.previewSprite = null; }
      this._setStatus('Selection cleared');
    } else if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this._undo();
    }
  }

  _onPointerMove(pointer) {
    const tx = Math.floor(pointer.worldX / TILE);
    const ty = Math.floor(pointer.worldY / TILE);

    if (!this.tileLabel) {
      this.tileLabel = this.scene.add.text(0, 0, '', {
        fontFamily: 'Courier New, monospace',
        fontSize: '12px', color: '#fff',
        backgroundColor: '#000', padding: { x: 3, y: 1 },
      }).setDepth(99999).setScrollFactor(1);
    }
    this.tileLabel.setPosition(tx * TILE + TILE / 2 + 6, ty * TILE - 16);
    this.tileLabel.setText(`${tx},${ty}`);

    if (this.previewSprite) {
      const px = tx * TILE + TILE / 2;
      const py = ty * TILE + TILE / 2;
      this.previewSprite.setPosition(px, py);
    }
  }

  _onPointerDown(pointer) {
    const tx = Math.floor(pointer.worldX / TILE);
    const ty = Math.floor(pointer.worldY / TILE);

    // Right click → delete placement at this tile (latest match wins)
    if (pointer.rightButtonDown()) {
      for (let i = this.placements.length - 1; i >= 0; i--) {
        if (this.placements[i].x === tx && this.placements[i].y === ty) {
          this._deletePlacement(i);
          return;
        }
      }
      return;
    }

    if (!this.selectedKey) {
      this._setStatus('Pick a prop from the palette first');
      return;
    }
    this._placeAt(tx, ty);
  }

  // --------------------------------------------------------------
  // Placement & rendering
  // --------------------------------------------------------------

  _updatePreview() {
    if (this.previewSprite) { this.previewSprite.destroy(); this.previewSprite = null; }
    if (!this.selectedKey) return;
    if (!this.scene.textures.exists(this.selectedKey)) {
      this._setStatus(`Texture not loaded: ${this.selectedKey}`);
      return;
    }
    const result = this._renderProp(this.selectedKey, 0, 0);
    if (result) {
      result.sprite.setAlpha(0.55);
      result.sprite.setDepth(99998);
      this.previewSprite = result.sprite;
    }
  }

  _placeAt(tileX, tileY) {
    if (!this.scene.textures.exists(this.selectedKey)) {
      this._setStatus(`Texture not loaded: ${this.selectedKey}`);
      return;
    }
    const result = this._renderProp(this.selectedKey, tileX, tileY);
    if (!result) return;
    const { sprite, cropIndex } = result;
    this.placements.push({
      key: this.selectedKey,
      x: tileX,
      y: tileY,
      collide: this.defaultCollide,
      ...(cropIndex != null ? { cropIndex } : {}),
      _sprite: sprite,
    });
    this._refreshList();
    this._setStatus(`Placed ${this.selectedKey} @ ${tileX},${tileY} (${this.placements.length} total)`);
  }

  _deletePlacement(index) {
    const p = this.placements[index];
    if (!p) return;
    if (p._sprite) p._sprite.destroy();
    this.placements.splice(index, 1);
    this._refreshList();
    this._setStatus(`Deleted ${p.key} @ ${p.x},${p.y}`);
  }

  _undo() {
    if (!this.placements.length) return;
    this._deletePlacement(this.placements.length - 1);
  }

  // Mirrors MapLoader.placeObjects rendering so previews/placements look identical
  // to what the game will draw when this JSON gets baked into a snapshot.
  // Returns { sprite, cropIndex } — cropIndex is the spritesheet variant chosen
  // (or null for non-cropped props) so callers can persist it for in-game reload.
  _renderProp(textureKey, tileX, tileY) {
    const px = tileX * TILE + TILE / 2;
    const py = tileY * TILE + TILE / 2;

    // Animated deco props: spawn as sprite + play looping animation. Mirrors
    // MapLoader.placeObjects's animated branch.
    const animName = ANIMATED_DECO_PROPS[textureKey];
    const sprite = animName
      ? this.scene.add.sprite(px, py, textureKey, 0)
      : this.scene.add.image(px, py, textureKey);
    if (animName && this.scene.anims.exists(animName)) sprite.play(animName);

    const cropRegions = PROP_CROP_REGIONS[textureKey];
    let cropIndex = null;
    if (cropRegions && cropRegions.length > 0) {
      cropIndex = Math.floor(Math.random() * cropRegions.length);
      const region = cropRegions[cropIndex];
      sprite.setCrop(region.x, region.y, region.w, region.h);
      sprite.setScale(KENMI_SCALE);
      const src = this.scene.textures.get(textureKey).source[0];
      sprite.setOrigin(
        (region.x + region.w / 2) / src.width,
        (region.y + region.h / 2) / src.height
      );
      const depth = FLAT_GROUND_PROPS.has(textureKey)
        ? 0.5 + py * 0.0001
        : py + (region.h / 2) * KENMI_SCALE;
      sprite.setDepth(depth);
    } else {
      sprite.setOrigin(0.5, 0.8);
      sprite.setScale(KENMI_SCALE);
      const depth = FLAT_GROUND_PROPS.has(textureKey)
        ? 0.5 + py * 0.0001
        : py + sprite.displayHeight * 0.2;
      sprite.setDepth(depth);
    }
    return { sprite, cropIndex };
  }

  // --------------------------------------------------------------
  // Export
  // --------------------------------------------------------------

  _copyJSON() {
    const objects = this.placements.map(({ key, x, y, collide, cropIndex }) => ({
      key, x, y,
      ...(collide ? { collide: true } : {}),
      ...(cropIndex != null ? { cropIndex } : {}),
    }));
    const json = JSON.stringify(objects, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(
        () => this._setStatus(`Copied ${objects.length} objects to clipboard`),
        () => this._copyFallback(json)
      );
    } else {
      this._copyFallback(json);
    }
  }

  _copyFallback(json) {
    const ta = document.createElement('textarea');
    ta.value = json;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this._setStatus(`Copied ${this.placements.length} objects (fallback)`);
    } catch {
      this._setStatus('Copy failed — open devtools to read JSON');
      console.log('[ObjectPlacerEditor] objects JSON:\n' + json);
    }
    document.body.removeChild(ta);
  }
}

function btnCSS(bg = '#333') {
  return `
    background: ${bg}; color: #fff; border: 1px solid #555;
    padding: 3px 8px; cursor: pointer; font-family: inherit; font-size: 11px;
    border-radius: 3px;
  `.replace(/\s+/g, ' ');
}

ObjectPlacerEditor.isEnabled = isEnabled;
