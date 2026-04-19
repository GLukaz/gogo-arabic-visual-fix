/**
 * dialogueComplexity.js — CEFR-based Arabic/English dialogue scaling
 *
 * Scales companion dialogue between Arabic and English based on player proficiency level.
 * Ensures deterministic output (no random language switching).
 */

export const CEFR_ARABIC_RATIOS = Object.freeze({
  A1: 0.2,   // Beginner: 20% Arabic, 80% English
  A2: 0.4,   // Elementary: 40% Arabic, 60% English
  B1: 0.6,   // Intermediate: 60% Arabic, 40% English
  B2: 0.7,   // Upper-intermediate: 70% Arabic, 30% English
  C1: 0.8,   // Advanced: 80% Arabic, 20% English
  C2: 0.95,  // Mastery: 95% Arabic, 5% English
});

/**
 * Get Arabic ratio for a given CEFR level.
 * @param {string} cefrLevel - 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
 * @returns {number} Arabic ratio (0.0 - 1.0)
 */
export function getArabicRatio(cefrLevel) {
  return CEFR_ARABIC_RATIOS[cefrLevel] ?? 0.5;
}

/**
 * Scale dialogue complexity based on player CEFR level.
 *
 * Rules:
 * - A1-B1 (ratio < 0.6): English primary, Arabic secondary, show transliteration
 * - B1 (ratio = 0.6): Arabic primary, English secondary, show transliteration
 * - B2 (ratio = 0.7): Arabic primary, English secondary, no transliteration
 * - C1+ (ratio >= 0.8): Arabic primary ONLY, no secondary (immersion mode), no transliteration
 *
 * @param {{ arabic: string, english: string, transliteration: string }} dialogueLine
 * @param {string} cefrLevel - 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
 * @returns {{ primary: string, secondary: string | null, showTransliteration: boolean, isArabicPrimary: boolean }}
 */
export function scaleDialogueComplexity(dialogueLine, cefrLevel) {
  const ratio = getArabicRatio(cefrLevel);
  const isArabicPrimary = ratio > 0.5;

  // Determine primary language
  const primary = isArabicPrimary
    ? (dialogueLine.arabic || dialogueLine.english || '')
    : (dialogueLine.english || dialogueLine.arabic || '');

  // At C1+ (ratio >= 0.8): hide secondary entirely to force immersion
  // At A1-B2 (ratio < 0.8): show secondary as translation aid
  const secondary = ratio >= 0.8
    ? null
    : isArabicPrimary
      ? (dialogueLine.english || null)
      : (dialogueLine.arabic || null);

  // Show transliteration only below B2 (ratio < 0.7) to aid pronunciation
  const showTransliteration = ratio < 0.7;

  return {
    primary,
    secondary,
    showTransliteration,
    isArabicPrimary,
  };
}
