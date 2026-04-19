/**
 * arabicNumbers.js — Arabic numeral conversion utilities (Phase 29)
 *
 * Handles conversion between Eastern Arabic numerals (٠-٩) and Western Arabic numerals (0-9).
 */

/**
 * Convert Eastern Arabic numerals (٠-٩) to Western (0-9) and return as integer
 * @param {string|number} input - Input containing Eastern or Western numerals
 * @returns {number} Parsed integer, 0 if invalid, max 9999
 */
export function normalizeArabicNumber(input) {
  if (typeof input === 'number') {
    return Math.min(Math.max(input, 0), 9999);
  }

  if (typeof input !== 'string') {
    return 0;
  }

  // Convert Eastern Arabic (U+0660-U+0669) to Western (0-9)
  const normalized = input.replace(/[\u0660-\u0669]/g, (c) => {
    return String.fromCharCode(c.charCodeAt(0) - 0x0660 + 48);
  });

  // Strip non-digits
  const digitsOnly = normalized.replace(/\D/g, '');

  if (digitsOnly === '') {
    return 0;
  }

  const parsed = parseInt(digitsOnly, 10);

  // Handle NaN and cap at 9999
  if (isNaN(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, 0), 9999);
}

/**
 * Format a number using Eastern Arabic numerals (٠-٩)
 * @param {number} number - Number to format
 * @returns {string} Number in Eastern Arabic numerals
 */
export function formatAsEasternArabic(number) {
  const western = String(number);

  // Convert each Western digit (0-9) to Eastern Arabic (U+0660-U+0669)
  return western.replace(/[0-9]/g, (c) => {
    return String.fromCharCode(c.charCodeAt(0) - 48 + 0x0660);
  });
}

/**
 * Format a number with thousands separators
 * @param {number} number - Number to format
 * @param {boolean} useEastern - If true, use Eastern Arabic numerals
 * @returns {string} Formatted number with separators
 */
export function formatWithSeparators(number, useEastern = false) {
  // Add thousands separators
  const formatted = number.toLocaleString('en-US');

  if (useEastern) {
    // Convert to Eastern Arabic and use Arabic comma (U+060C)
    return formatAsEasternArabic(number).replace(/,/g, '\u060C');
  }

  return formatted;
}
