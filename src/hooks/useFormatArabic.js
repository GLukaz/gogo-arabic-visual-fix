import { createElement } from 'react';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { stripDiacritics } from '../utils/arabicUtils.js';
import { splitTashkeel, hasDiacritics } from '../utils/tashkeelFading.js';
import vocabulary from '../data/vocabularyAll.js';

/**
 * TASH-02: Path-aware tashkeel fading rate.
 * Scholar retains tashkeel 2x longer (divisor = 2.0 -> thresholds doubled).
 * Historian retains 1.33x longer.
 * Traveler uses baseline thresholds.
 */
const FADE_DIVISOR = {
  scholar: 2.0,
  historian: 1.33,
  traveler: 1.0,
};

/**
 * Hook that returns a function to conditionally strip Arabic diacritics (harakat)
 * based on the user's showDiacritics setting.
 *
 * Enhanced to support progressive tashkeel fading based on word mastery.
 *
 * Usage:
 *   const formatArabic = useFormatArabic(); // Simple usage (backward compatible)
 *   <div>{formatArabic(someArabicText)}</div>
 *
 *   const { formatArabic, getTashkeelOpacity } = useFormatArabic(); // With mastery
 *   <div style={{ opacity: getTashkeelOpacity('word_123') }}>{someArabicText}</div>
 */
export function useFormatArabic() {
  const showDiacritics = useSelector((s) => s.settings.showDiacritics);
  const fsrsCards = useSelector((s) => s.vocabulary.fsrsCards);
  const learningPath = useSelector((s) => s.player.learningPath);

  const formatArabic = useCallback(
    (text) => {
      if (!text || showDiacritics) return text;
      return stripDiacritics(text);
    },
    [showDiacritics]
  );

  /**
   * Calculate tashkeel opacity based on FSRS card mastery level and learning path.
   *
   * @param {string} wordId - The vocabulary word ID
   * @returns {number} Opacity value 0-1
   *
   * Mastery levels (Traveler baseline; Scholar thresholds doubled; Historian x1.33):
   * - Beginner (state 0-1, reps < t_learning): opacity 1.0 (full tashkeel)
   * - Learning (reps t_learning to t_familiar): opacity 0.5 (faded)
   * - Familiar (reps t_familiar to t_mastered): opacity 0.25 (very faded)
   * - Mastered (reps >= t_mastered, stability > t_stability): opacity 0 (no tashkeel)
   */
  const getTashkeelOpacity = useCallback(
    (wordId) => {
      if (!wordId) return 1.0; // No wordId = show full tashkeel

      // TASH-01 / CONT-07: Ambiguous words always retain full tashkeel regardless of mastery
      const wordMeta = vocabulary.find((w) => w.id === wordId);
      if (wordMeta?.ambiguous) return 1.0;

      const fsrsCard = fsrsCards[wordId];
      if (!fsrsCard || !fsrsCard.card) return 1.0; // No card = show full tashkeel

      const { state, reps = 0, stability = 0 } = fsrsCard.card;

      // TASH-02: Apply path-aware fading divisor
      // Scholar needs 2x the reps before tashkeel fades — divisor multiplies thresholds
      const divisor = FADE_DIVISOR[learningPath] ?? 1.0;

      const t_learning  = Math.round(3  * divisor);  // Scholar: 6,  Traveler: 3
      const t_familiar  = Math.round(7  * divisor);  // Scholar: 14, Traveler: 7
      const t_mastered  = Math.round(13 * divisor);  // Scholar: 26, Traveler: 13
      const t_stability = Math.round(30 * divisor);  // Scholar: 60, Traveler: 30

      // Beginner: new or early learning
      if (state === 0 || state === 1 || reps < t_learning) {
        return 1.0;
      }

      // Learning: making progress
      if (reps >= t_learning && reps < t_familiar) {
        return 0.5;
      }

      // Familiar: well practiced
      if (reps >= t_familiar && reps < t_mastered) {
        return 0.25;
      }

      // Mastered: high reps and high stability
      if (reps >= t_mastered && stability > t_stability) {
        return 0;
      }

      // High reps but lower stability — almost mastered
      if (reps >= t_mastered) {
        return 0.15;
      }

      // Fallback
      return 1.0;
    },
    [fsrsCards, learningPath]  // CRITICAL: learningPath in deps to avoid stale closure (Pitfall 7)
  );

  /**
   * WIRE-03: Render Arabic text with progressive tashkeel fading as a React element.
   * Diacritics fade based on FSRS mastery for the given wordId.
   *
   * @param {string} text - Arabic text
   * @param {string} wordId - Vocabulary word ID for mastery lookup
   * @returns {React.ReactElement} - span with fading diacritics, or plain text
   */
  const renderArabic = useCallback(
    (text, wordId) => {
      if (!text) return text;
      if (!showDiacritics) return stripDiacritics(text);

      const opacity = getTashkeelOpacity(wordId);

      // Full opacity — no fading needed, return plain text
      if (opacity >= 1 || !hasDiacritics(text)) {
        return createElement('span', { lang: 'ar', dir: 'rtl' }, text);
      }

      // Zero opacity — strip diacritics entirely
      if (opacity <= 0) {
        return createElement('span', { lang: 'ar', dir: 'rtl' }, stripDiacritics(text));
      }

      // Partial opacity — render each diacritic with faded opacity
      const parts = splitTashkeel(text);
      return createElement(
        'span',
        { lang: 'ar', dir: 'rtl' },
        ...parts.map((part, i) =>
          part.isDiacritic
            ? createElement('span', { key: i, style: { opacity }, 'aria-hidden': 'true' }, part.char)
            : part.char
        )
      );
    },
    [showDiacritics, getTashkeelOpacity]
  );

  // For backward compatibility, return just the function when destructured as before
  // But also expose getTashkeelOpacity and renderArabic for advanced usage
  const returnValue = formatArabic;
  returnValue.getTashkeelOpacity = getTashkeelOpacity;
  returnValue.renderArabic = renderArabic;

  return returnValue;
}
