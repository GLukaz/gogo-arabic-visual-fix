/**
 * frequencyWeighting.js
 *
 * Frequency-weighted vocabulary ordering (FEAT-047).
 *
 * Converts the existing `frequency` score (1-9999, higher = more common) into
 * a `frequencyRank` (1 = most common, higher = rarer) and uses that rank to
 * bias new-card introduction toward higher-frequency words.
 *
 * Rank tier / weight mapping (from PRD):
 *   rank   1-500  → tier 1 → 3× selection weight
 *   rank 501-1000 → tier 2 → 2× selection weight
 *   rank 1001-2000 → tier 3 → 1.5× selection weight
 *   rank 2001+    → tier 4 → 1× selection weight
 *
 * Frequency ↔ rank mapping is derived from the vocabulary distribution:
 *   A1 (~500 words, freq 4000-9999) → ranks    1-500
 *   A2 (~1000 words, freq 2000-3999) → ranks  501-1500
 *   B1 (~2000 words, freq 500-1999) → ranks 1501-3500
 *   B2 (~1500 words, freq 1-499)    → ranks 3501-5000
 */

import vocabularyAll from '../data/vocabularyAll.js';

// ─── Rank computation ─────────────────────────────────────────────────────────

/**
 * Convert a word's frequency score into an approximate frequency rank.
 * Rank 1 = most common; higher rank = less common.
 *
 * Uses linear interpolation within each CEFR frequency band so that the
 * top 500 A1 words map cleanly to ranks 1-500.
 *
 * @param {{ frequency?: number }} word
 * @returns {number}
 */
export function getFrequencyRank(word) {
  const freq = word.frequency ?? 0;

  if (freq >= 4000) {
    // A1 band: freq 9999 → rank 1, freq 4000 → rank 500
    return Math.round(1 + ((9999 - freq) * 499) / 5999);
  }

  if (freq >= 2000) {
    // A2 band: freq 3999 → rank 501, freq 2000 → rank 1500
    return Math.round(501 + ((3999 - freq) * 999) / 1999);
  }

  if (freq >= 500) {
    // B1 band: freq 1999 → rank 1501, freq 500 → rank 3500
    return Math.round(1501 + ((1999 - freq) * 1999) / 1499);
  }

  if (freq >= 1) {
    // B2 band: freq 499 → rank 3501, freq 1 → rank 5000
    return Math.round(3501 + ((499 - freq) * 1499) / 498);
  }

  // No frequency data → very rare
  return 9999;
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

/**
 * Map a frequency rank to a tier (1-4).
 *
 * @param {number} rank
 * @returns {1|2|3|4}
 */
export function getFrequencyTier(rank) {
  if (rank <= 500) return 1;
  if (rank <= 1000) return 2;
  if (rank <= 2000) return 3;
  return 4;
}

/**
 * Selection weight for a tier.
 *   tier 1 → 3×, tier 2 → 2×, tier 3 → 1.5×, tier 4 → 1×
 *
 * @param {number} tier
 * @returns {number}
 */
export function getTierWeight(tier) {
  const WEIGHTS = { 1: 3, 2: 2, 3: 1.5, 4: 1 };
  return WEIGHTS[tier] ?? 1;
}

// ─── Weighted selection ───────────────────────────────────────────────────────

/**
 * Select `count` words from `availableCards` with frequency-rank bias.
 *
 * Words whose rank falls in tier 1 (top 500) are 3× more likely to be
 * selected than tier-4 words.  Selection is without replacement.
 *
 * @param {Array<{ id: string, frequency?: number }>} availableCards
 * @param {number} count  Number of cards to return
 * @returns {Array<{ id: string, frequency?: number }>}
 */
export function getFrequencyWeightedNewCards(availableCards, count) {
  if (!availableCards || availableCards.length === 0) return [];
  if (count >= availableCards.length) return [...availableCards];

  // Build a weighted pool: each word appears Math.round(weight * 10) times.
  // Multiplier 10 converts fractional weights (1.5×) to integers.
  const pool = [];
  for (const card of availableCards) {
    const rank = getFrequencyRank(card);
    const tier = getFrequencyTier(rank);
    const copies = Math.round(getTierWeight(tier) * 10); // 30, 20, 15, or 10
    for (let i = 0; i < copies; i++) pool.push(card);
  }

  // Weighted random selection without replacement (rejection sampling)
  const selected = [];
  const usedIds = new Set();
  let iterations = 0;
  const maxIterations = pool.length * 3 + 1000; // safety guard

  while (selected.length < count && usedIds.size < availableCards.length && iterations < maxIterations) {
    iterations++;
    const idx = Math.floor(Math.random() * pool.length);
    const word = pool[idx];
    if (!usedIds.has(word.id)) {
      usedIds.add(word.id);
      selected.push(word);
    }
  }

  return selected;
}

// ─── Redux selector ───────────────────────────────────────────────────────────

/**
 * Count learned vocabulary words per frequency tier.
 * "Learned" = a FSRS card exists in state.vocabulary.fsrsCards.
 *
 * Returns { tier1, tier2, tier3, tier4 } — useful for progress display.
 *
 * @param {Object} state        Redux root state
 * @param {Array}  [allWords]   Vocabulary array; defaults to vocabularyAll
 * @returns {{ tier1: number, tier2: number, tier3: number, tier4: number }}
 */
export function selectVocabByFrequencyTier(state, allWords = vocabularyAll) {
  const fsrsCards = state.vocabulary?.fsrsCards ?? {};
  const counts = { tier1: 0, tier2: 0, tier3: 0, tier4: 0 };

  if (Object.keys(fsrsCards).length === 0) return counts;

  // Build a quick lookup from wordId → frequency
  const freqMap = new Map(allWords.map((w) => [w.id, w.frequency ?? 0]));

  for (const wordId of Object.keys(fsrsCards)) {
    if (!freqMap.has(wordId)) continue; // unknown word — skip
    const rank = getFrequencyRank({ frequency: freqMap.get(wordId) });
    const tier = getFrequencyTier(rank);
    counts[`tier${tier}`]++;
  }

  return counts;
}
