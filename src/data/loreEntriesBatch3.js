/**
 * Lore Entries Batch 3 — Calligraphy styles and Golden Age scholars
 * WIRE-011: wires calligraphyStyles.js and goldenAgeScholars.js into the codex system.
 *
 * Categories: calligraphy (6 entries), scholars (30+ entries)
 */

import { CALLIGRAPHY_STYLES } from './calligraphyStyles.js';
import { GOLDEN_AGE_SCHOLARS } from './goldenAgeScholars.js';

/** Convert a CalligraphyStyle to a lore entry */
function calligraphyToLore(style) {
  return {
    id: `calligraphy_${style.id}`,
    title: `${style.name} Script`,
    titleArabic: style.nameArabic,
    category: 'calligraphy',
    content: `${style.description} ${style.history || ''}`.trim(),
    contentArabic: style.nameArabic,
    keyTerm: {
      arabic: style.nameArabic,
      english: style.name,
      transliteration: style.name.toLowerCase(),
    },
    discoveryTrigger: 'collection:codex_browse',
    zone: null,
    rarity: 'uncommon',
  };
}

/** Convert a GoldenAgeScholar to a lore entry */
function scholarToLore(scholar) {
  const firstVocab = scholar.arabicVocab?.[0];
  return {
    id: `scholar_${scholar.id}`,
    title: scholar.name,
    titleArabic: scholar.nameArabic,
    category: 'scholars',
    content: scholar.bio || '',
    contentArabic: scholar.fullNameArabic || scholar.nameArabic,
    keyTerm: firstVocab
      ? { arabic: firstVocab.arabic, english: firstVocab.english, transliteration: firstVocab.transliteration }
      : { arabic: scholar.nameArabic, english: scholar.name, transliteration: scholar.name.toLowerCase() },
    discoveryTrigger: 'collection:codex_browse',
    zone: null,
    rarity: 'rare',
  };
}

export const LORE_ENTRIES_BATCH_3 = [
  ...CALLIGRAPHY_STYLES.map(calligraphyToLore),
  ...GOLDEN_AGE_SCHOLARS.map(scholarToLore),
];
