/**
 * Tashkeel (diacritics) fading based on FSRS mastery.
 *
 * As a player masters an Arabic word, the vowel marks (tashkeel) progressively
 * fade, training the player to read without diacritics — the way native Arabic
 * text is typically written.
 *
 * Stability thresholds (FSRS stability value):
 *   - stability < 3:  Full diacritics (opacity 1.0) — still learning
 *   - stability 3-9:  Fading diacritics (opacity 0.6) — intermediate
 *   - stability 10-29: Dim diacritics (opacity 0.3) — well-known
 *   - stability >= 30: Hidden diacritics (opacity 0) — mastered
 */

// Unicode ranges for Arabic diacritical marks (tashkeel)
const DIACRITIC_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;

/**
 * Calculate diacritic opacity based on FSRS stability.
 * @param {number|null} stability - FSRS stability value (null = new word = full opacity)
 * @returns {number} Opacity value 0-1
 */
export function getDiacriticOpacity(stability) {
  if (stability == null || stability < 3) return 1.0;
  if (stability < 10) return 0.6;
  if (stability < 30) return 0.3;
  return 0;
}

/**
 * Split Arabic text into base characters and diacritics for rendering.
 * Returns an array of { char, isDiacritic } objects.
 *
 * @param {string} text - Arabic text with diacritics
 * @returns {Array<{char: string, isDiacritic: boolean}>}
 */
export function splitTashkeel(text) {
  if (!text) return [];
  const result = [];
  for (const char of text) {
    result.push({
      char,
      isDiacritic: DIACRITIC_REGEX.test(char),
    });
  }
  return result;
}

/**
 * Check if text contains any diacritical marks.
 * @param {string} text
 * @returns {boolean}
 */
export function hasDiacritics(text) {
  return DIACRITIC_REGEX.test(text);
}

// ─── Progressive Fading Engine (FSRS-based) ──────────────────────────────────

/** Tashkeel level constants */
export const TASHKEEL_LEVEL = Object.freeze({
  FULL: 'FULL',
  PARTIAL: 'PARTIAL',
  NONE: 'NONE',
});

const DAYS_MS = 24 * 60 * 60 * 1000;

/**
 * Determine the tashkeel visibility level for a word based on its FSRS card.
 *
 * Recovery rule: if the card has a `lastFailDate` within the last 3 days,
 * always return FULL regardless of stability.
 *
 * Stability thresholds:
 *   < 7  days → FULL
 *   7-30 days → PARTIAL
 *   > 30 days → NONE
 *
 * @param {string} _wordId - Word identifier (reserved for future per-word overrides)
 * @param {Object} fsrsCard - FSRS card data
 * @param {number|null} fsrsCard.stability - FSRS stability in days
 * @param {string|number|null} [fsrsCard.lastFailDate] - ISO string or timestamp of last wrong answer
 * @param {number} [now] - Current timestamp in ms (defaults to Date.now())
 * @returns {'FULL'|'PARTIAL'|'NONE'}
 */
export function getTashkeelLevel(_wordId, fsrsCard, now = Date.now()) {
  if (!fsrsCard) return TASHKEEL_LEVEL.FULL;

  const { stability, lastFailDate } = fsrsCard;

  // Recovery: wrong answer within last 3 days forces FULL
  if (lastFailDate) {
    const failTime = typeof lastFailDate === 'number' ? lastFailDate : new Date(lastFailDate).getTime();
    if (!isNaN(failTime) && now - failTime < 3 * DAYS_MS) {
      return TASHKEEL_LEVEL.FULL;
    }
  }

  if (stability == null || stability < 7) return TASHKEEL_LEVEL.FULL;
  if (stability <= 30) return TASHKEEL_LEVEL.PARTIAL;
  return TASHKEEL_LEVEL.NONE;
}

const DIACRITIC_STRIP_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/**
 * Apply tashkeel fading to Arabic text according to a visibility level.
 *
 * FULL    → return text unchanged
 * PARTIAL → keep diacritics only on the first letter of each whitespace-delimited word
 * NONE    → strip all diacritics
 *
 * @param {string} arabicText
 * @param {'FULL'|'PARTIAL'|'NONE'} level
 * @returns {string}
 */
export function applyTashkeelFading(arabicText, level) {
  if (!arabicText) return arabicText || '';

  if (level === TASHKEEL_LEVEL.FULL) return arabicText;
  if (level === TASHKEEL_LEVEL.NONE) return arabicText.replace(DIACRITIC_STRIP_REGEX, '');

  // PARTIAL: keep diacritics attached to the first base letter of each word only.
  // In Unicode, a diacritic always follows its base letter, so we track how many
  // base letters we've emitted. Diacritics are kept only when seenBaseCount === 1
  // (i.e. they immediately follow the first base letter of the word).
  const chars = [...arabicText];
  const result = [];
  let seenBaseCount = 0; // base-letter count within current word

  for (const ch of chars) {
    // Whitespace resets the word boundary
    if (/\s/.test(ch)) {
      seenBaseCount = 0;
      result.push(ch);
      continue;
    }

    const isDiac = /[\u064B-\u065F\u0670\u06D6-\u06ED]/.test(ch);

    if (isDiac) {
      // Keep only if this diacritic follows the first base letter (seenBaseCount === 1)
      if (seenBaseCount === 1) result.push(ch);
    } else {
      // Base letter — always keep, increment counter
      seenBaseCount++;
      result.push(ch);
    }
  }

  return result.join('');
}
