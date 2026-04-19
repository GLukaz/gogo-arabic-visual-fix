/**
 * ArabicText — Utility for rendering Arabic text in Phaser Canvas.
 * Handles reshaping (letter joining via js-arabic-reshaper) and RTL reversal.
 *
 * Phaser's Canvas text renderer does not support:
 *   1. Arabic letter joining (connected forms) — solved by reshaping to presentation forms
 *   2. Right-to-left layout — solved by reversing the character order
 *
 * Usage:
 *   import { createArabicText, prepareArabicText } from '../ui/ArabicText.js';
 *
 *   // Create a Phaser text object with proper Arabic rendering
 *   const text = createArabicText(scene, x, y, 'مرحبا', { fontSize: '16px' });
 *
 *   // Or just prepare the string for use with existing text objects
 *   myText.setText(prepareArabicText('مرحبا'));
 */

import { reshape } from 'js-arabic-reshaper';

/** Default font stack: PixelAE for in-canvas pixel art, with Arabic fallbacks */
const DEFAULT_FONT_FAMILY = "'PixelAE', 'Amiri', 'Noto Naskh Arabic', serif";

/**
 * Reverse a string for RTL display.
 * Uses Array.from (spread) to correctly handle multi-codepoint characters
 * and Unicode surrogate pairs.
 *
 * @param {string} str
 * @returns {string}
 */
function reverseString(str) {
  return [...str].reverse().join('');
}

/**
 * Check if a character is Arabic (main block + presentation forms + diacritics).
 *
 * @param {number} code - Unicode code point.
 * @returns {boolean}
 */
function isArabicChar(code) {
  return (
    (code >= 0x0600 && code <= 0x06ff) || // Arabic
    (code >= 0x0750 && code <= 0x077f) || // Arabic Supplement
    (code >= 0x08a0 && code <= 0x08ff) || // Arabic Extended-A
    (code >= 0xfb50 && code <= 0xfdff) || // Arabic Presentation Forms-A
    (code >= 0xfe70 && code <= 0xfeff)    // Arabic Presentation Forms-B
  );
}

/**
 * Prepare Arabic text for Phaser Canvas rendering.
 * 1. Reshape connected letters using js-arabic-reshaper (isolated -> initial/medial/final forms)
 * 2. Reverse character order for RTL display
 *
 * Non-Arabic text passes through unchanged.
 * Mixed text (Arabic + Latin) is handled segment by segment:
 *   - Arabic segments are reshaped and reversed
 *   - Latin segments are kept in original order
 *   - The overall segment order is reversed for RTL layout
 *
 * @param {string} text - Raw Arabic (or mixed) text.
 * @returns {string} Text ready for Phaser Canvas rendering.
 */
export function prepareArabicText(text) {
  if (!text) return '';

  // Check if the text contains any Arabic characters
  const hasArabic = [...text].some((ch) => isArabicChar(ch.codePointAt(0)));
  if (!hasArabic) return text;

  // Reshape Arabic letters to their presentation (connected) forms
  const reshaped = reshape(text);

  // Split into segments of Arabic vs non-Arabic to handle mixed text
  const segments = [];
  let current = '';
  let currentIsArabic = null;

  for (const ch of reshaped) {
    const code = ch.codePointAt(0);
    const charIsArabic = isArabicChar(code) || code === 0x20; // include spaces

    // If we're starting fresh or the type hasn't changed, accumulate
    if (currentIsArabic === null || charIsArabic === currentIsArabic) {
      current += ch;
      currentIsArabic = charIsArabic;
    } else {
      segments.push({ text: current, arabic: currentIsArabic });
      current = ch;
      currentIsArabic = charIsArabic;
    }
  }
  if (current) {
    segments.push({ text: current, arabic: currentIsArabic });
  }

  // For purely Arabic text (most common case), just reverse
  if (segments.length === 1 && segments[0].arabic) {
    return reverseString(segments[0].text);
  }

  // For mixed text: reverse Arabic segments individually,
  // then reverse segment order for overall RTL layout
  const processed = segments
    .map((seg) => (seg.arabic ? reverseString(seg.text) : seg.text))
    .reverse()
    .join('');

  return processed;
}

/**
 * Create a Phaser Text object with properly rendered Arabic text.
 *
 * @param {Phaser.Scene} scene - The current Phaser scene.
 * @param {number} x - X position.
 * @param {number} y - Y position.
 * @param {string} text - Raw Arabic text (will be reshaped + reversed).
 * @param {object} [style={}] - Phaser text style overrides.
 * @returns {Phaser.GameObjects.Text} The created text object.
 */
export function createArabicText(scene, x, y, text, style = {}) {
  const prepared = prepareArabicText(text);

  const mergedStyle = {
    fontFamily: style.fontFamily || DEFAULT_FONT_FAMILY,
    fontSize: style.fontSize || '16px',
    color: style.color || '#d4a843',
    align: style.align || 'right',
    ...style,
  };

  const textObj = scene.add.text(x, y, prepared, mergedStyle);
  textObj.setOrigin(
    style.originX ?? 0.5,
    style.originY ?? 0.5
  );

  // Store the raw Arabic text so it can be retrieved/updated later
  textObj.setData('rawArabic', text);

  return textObj;
}

/**
 * Update an existing Phaser Text object with new Arabic text.
 * Reshapes and reverses the new text before setting it.
 *
 * @param {Phaser.GameObjects.Text} textObj - Existing Phaser text object.
 * @param {string} newText - New raw Arabic text.
 * @returns {Phaser.GameObjects.Text} The same text object (for chaining).
 */
export function updateArabicText(textObj, newText) {
  textObj.setText(prepareArabicText(newText));
  textObj.setData('rawArabic', newText);
  return textObj;
}
