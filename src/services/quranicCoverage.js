/**
 * Quranic Coverage Service
 *
 * Phase D: Calculates what percentage of unique Quranic vocabulary words
 * the player has mastered. "You can read X% of unique Quranic vocabulary."
 *
 * A word is considered mastered if the player has an FSRS card with
 * stability > 7 days (meaning the word is well-learned, not just seen once).
 */

/**
 * Calculate Quranic vocabulary coverage.
 *
 * @param {Object} fsrsCards - From state.vocabulary.fsrsCards: { wordId: { card, log } }
 * @param {Array} allVocab - Full vocabulary array (from vocabularyAll.js)
 * @returns {{ mastered: number, total: number, percentage: number, seen: number }}
 */
export function calculateQuranicCoverage(fsrsCards, allVocab) {
  // Filter to Quranic words only
  const quranicWords = allVocab.filter(
    (w) => w.source === 'quran' || w.quranRef
  );
  const total = quranicWords.length;

  if (total === 0) return { mastered: 0, total: 0, percentage: 0, seen: 0 };

  let mastered = 0;
  let seen = 0;

  const MASTERY_STABILITY_THRESHOLD = 7; // days

  for (const word of quranicWords) {
    const cardData = fsrsCards[word.id];
    if (!cardData || !cardData.card) continue;

    seen++;

    const stability = cardData.card.stability || 0;
    if (stability >= MASTERY_STABILITY_THRESHOLD) {
      mastered++;
    }
  }

  return {
    mastered,
    total,
    percentage: total > 0 ? Math.round((mastered / total) * 100) : 0,
    seen,
  };
}

/**
 * Get category-level Quranic coverage breakdown.
 *
 * @param {Object} fsrsCards - FSRS card state
 * @param {Array} allVocab - Full vocabulary array
 * @returns {Array<{ category: string, mastered: number, total: number, percentage: number }>}
 */
export function getQuranicCoverageByCategory(fsrsCards, allVocab) {
  const quranicWords = allVocab.filter(
    (w) => w.source === 'quran' || w.quranRef
  );

  const categories = {};
  const MASTERY_STABILITY_THRESHOLD = 7;

  for (const word of quranicWords) {
    const cat = word.category || 'uncategorized';
    if (!categories[cat]) categories[cat] = { mastered: 0, total: 0 };
    categories[cat].total++;

    const cardData = fsrsCards[word.id];
    if (cardData?.card?.stability >= MASTERY_STABILITY_THRESHOLD) {
      categories[cat].mastered++;
    }
  }

  return Object.entries(categories)
    .map(([category, data]) => ({
      category,
      mastered: data.mastered,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.mastered / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
