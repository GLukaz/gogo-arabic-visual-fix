/**
 * accessibility.js
 * Utility functions for color-blind palettes, font scaling, and screen-reader announcements.
 */

// ---------------------------------------------------------------------------
// Color-blind palettes
// Each palette maps semantic color roles to accessible replacements.
// Values are CSS color strings.
// ---------------------------------------------------------------------------

const PALETTES = {
  none: {
    primary:   '#d4a843', // gold
    secondary: '#4caf50', // green
    danger:    '#e63946', // red
    info:      '#2196f3', // blue
    warning:   '#ff9800', // orange
    accent:    '#9c27b0', // purple
    background:'#0A0A0A',
    surface:   '#1a1a2e',
    text:      '#f0e6d3',
    textMuted: '#9e8c6e',
  },
  // Protanopia — reduced red sensitivity: reds shift to blue-purple, greens mostly intact
  protanopia: {
    primary:   '#d4a843',
    secondary: '#4caf50',
    danger:    '#0077bb', // red → blue
    info:      '#2196f3',
    warning:   '#ee7733', // orange becomes more amber-safe
    accent:    '#aa3377', // purple stays
    background:'#0A0A0A',
    surface:   '#1a1a2e',
    text:      '#f0e6d3',
    textMuted: '#9e8c6e',
  },
  // Deuteranopia — reduced green sensitivity: greens shift to blue, reds to orange
  deuteranopia: {
    primary:   '#d4a843',
    secondary: '#0077bb', // green → blue
    danger:    '#ee7733', // red → orange
    info:      '#2196f3',
    warning:   '#ffcc00', // orange → yellow
    accent:    '#aa3377',
    background:'#0A0A0A',
    surface:   '#1a1a2e',
    text:      '#f0e6d3',
    textMuted: '#9e8c6e',
  },
  // Tritanopia — reduced blue sensitivity: blues shift to red, yellows to pink
  tritanopia: {
    primary:   '#d4a843',
    secondary: '#4caf50',
    danger:    '#e63946',
    info:      '#cc3311', // blue → red
    warning:   '#ee3377', // yellow-orange → pink
    accent:    '#009988', // purple → teal
    background:'#0A0A0A',
    surface:   '#1a1a2e',
    text:      '#f0e6d3',
    textMuted: '#9e8c6e',
  },
};

/**
 * Returns the color palette for the given color-blind mode.
 * @param {'none'|'protanopia'|'deuteranopia'|'tritanopia'} mode
 * @returns {Record<string, string>}
 */
export function getColorBlindPalette(mode) {
  return PALETTES[mode] ?? PALETTES.none;
}

// ---------------------------------------------------------------------------
// Font scaling
// ---------------------------------------------------------------------------

/**
 * Returns a scaled CSS font-size string.
 * @param {number} baseSize  Base size in pixels.
 * @param {number} scale     Scale factor (0.8–1.5).
 * @returns {string}         e.g. "13.6px"
 */
export function applyFontScale(baseSize, scale) {
  const clamped = Math.min(1.5, Math.max(0.8, scale));
  return `${Math.round(baseSize * clamped * 10) / 10}px`;
}

// ---------------------------------------------------------------------------
// Screen-reader live region
// ---------------------------------------------------------------------------

let _liveRegion = null;

/**
 * Announces a message to screen readers via an ARIA live region.
 * Creates the live region on first call and reuses it afterwards.
 * @param {string} message        The text to announce.
 * @param {'polite'|'assertive'} [priority='polite']
 */
export function announceToScreenReader(message, priority = 'polite') {
  if (typeof document === 'undefined') return; // SSR guard

  if (!_liveRegion) {
    _liveRegion = document.createElement('div');
    _liveRegion.setAttribute('id', 'gogo-a11y-live');
    _liveRegion.setAttribute('aria-live', priority);
    _liveRegion.setAttribute('aria-atomic', 'true');
    _liveRegion.setAttribute('role', 'status');
    // Visually hidden but readable by AT
    Object.assign(_liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
    document.body.appendChild(_liveRegion);
  }

  // Toggling text forces re-announcement even if message is the same
  _liveRegion.textContent = '';
  requestAnimationFrame(() => {
    _liveRegion.textContent = message;
  });
}
