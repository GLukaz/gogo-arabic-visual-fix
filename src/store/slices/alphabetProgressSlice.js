/**
 * Alphabet Progress Slice — FEAT-041
 *
 * Tracks mastery per letter for all 28 Arabic consonants + 6 vowels.
 * Each letter has 4 form states: isolated, initial, medial, final —
 * each tracked independently with a 0-100 mastery score.
 *
 * Consonants follow the standard AFL (Alif Baa textbook) sequence.
 * isAlphabetComplete() gates the open sandbox until all 28 consonants
 * reach 80%+ average mastery across all 4 forms.
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';

// ── Letter Definitions ────────────────────────────────────────────────────────

/**
 * Standard AFL (Alif Baa textbook) sequence — 28 Arabic consonants.
 * These IDs correspond to entries in src/data/arabicPhonetics.js ARABIC_CONSONANTS.
 */
export const AFL_SEQUENCE = [
  'hamza', 'ba',    'ta',    'tha',   'jim',   'hah',   'kha',
  'dal',   'dhal',  'ra',    'zay',   'sin',   'sheen', 'sad',
  'dad',   'tah',   'zah',   'ayn',   'ghayn', 'fa',    'qaf',
  'kaf',   'lam',   'meem',  'noon',  'ha',    'waw',   'ya',
];

/**
 * 6 Arabic vowels tracked alongside consonants.
 * IDs correspond to entries in src/data/arabicPhonetics.js ARABIC_VOWELS.
 */
export const VOWEL_IDS = ['fatha', 'kasra', 'damma', 'alif', 'ya_vowel', 'waw_vowel'];

/** All tracked letter IDs: 28 consonants + 6 vowels = 34 total */
export const ALL_LETTER_IDS = [...AFL_SEQUENCE, ...VOWEL_IDS];

/** Mastery percentage threshold (0-100) required per letter for completion check */
export const MASTERY_THRESHOLD = 80;

// ── Pure Helpers ──────────────────────────────────────────────────────────────

/**
 * Compute average mastery (0-100) across all 4 forms for one letter.
 *
 * @param {Object} state - Full Redux state (must have alphabetProgress key)
 * @param {string} letterId - Letter ID from AFL_SEQUENCE or VOWEL_IDS
 * @returns {number} Mastery percentage 0-100
 */
export function getLetterMastery(state, letterId) {
  const forms = state.alphabetProgress?.letterMastery?.[letterId];
  if (!forms) return 0;
  const total =
    (forms.isolated ?? 0) +
    (forms.initial  ?? 0) +
    (forms.medial   ?? 0) +
    (forms.final    ?? 0);
  return Math.round(total / 4);
}

/**
 * Returns true when all 28 consonants have ≥ MASTERY_THRESHOLD% average mastery.
 * Vowels are tracked but not required for gate completion.
 *
 * @param {Object} state - Full Redux state
 * @returns {boolean}
 */
export function isAlphabetComplete(state) {
  return AFL_SEQUENCE.every((id) => getLetterMastery(state, id) >= MASTERY_THRESHOLD);
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /**
   * Per-letter mastery scores keyed by letter ID.
   * { [letterId]: { isolated: 0-100, initial: 0-100, medial: 0-100, final: 0-100 } }
   */
  letterMastery: {},
};

const alphabetProgressSlice = createSlice({
  name: 'alphabetProgress',
  initialState,
  reducers: {
    /**
     * Record a mastery score for a specific letter + form combination.
     * Payload: { letterId: string, form: 'isolated'|'initial'|'medial'|'final', score: number }
     * Score is clamped to 0-100.
     */
    recordFormScore(state, action) {
      const { letterId, form, score } = action.payload;
      if (!state.letterMastery[letterId]) {
        state.letterMastery[letterId] = { isolated: 0, initial: 0, medial: 0, final: 0 };
      }
      const clamped = Math.max(0, Math.min(100, Math.round(score)));
      state.letterMastery[letterId][form] = clamped;
    },

    /**
     * Reset all 4 form scores for a letter back to 0.
     * Payload: letterId string
     */
    resetLetterMastery(state, action) {
      const letterId = action.payload;
      state.letterMastery[letterId] = { isolated: 0, initial: 0, medial: 0, final: 0 };
    },
  },
});

export const { recordFormScore, resetLetterMastery } = alphabetProgressSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Mastery percentage (0-100) for a single letter, averaged across all 4 forms */
export const selectLetterMastery = (state, letterId) => getLetterMastery(state, letterId);

/** True when all 28 consonants are at MASTERY_THRESHOLD%+ mastery */
export const selectIsAlphabetComplete = (state) => isAlphabetComplete(state);

/**
 * Returns next `count` unlearned consonants in AFL sequence.
 * A letter is "unlearned" if its average mastery is below MASTERY_THRESHOLD.
 *
 * @param {Object} state - Full Redux state
 * @param {number} count - How many letters to return
 * @returns {string[]} Array of letter IDs
 */
export const selectNextLettersToLearn = (state, count) => {
  const unlearned = AFL_SEQUENCE.filter(
    (id) => getLetterMastery(state, id) < MASTERY_THRESHOLD,
  );
  return unlearned.slice(0, count);
};

/**
 * Memoized selector: per-letter mastery summary for all 34 tracked letters.
 * Returns { [letterId]: { isolated, initial, medial, final, mastery } }
 */
export const selectAlphabetProgressSummary = createSelector(
  (state) => state.alphabetProgress.letterMastery,
  (letterMastery) => {
    const summary = {};
    for (const id of ALL_LETTER_IDS) {
      const forms = letterMastery[id] ?? { isolated: 0, initial: 0, medial: 0, final: 0 };
      const mastery = Math.round(
        ((forms.isolated ?? 0) + (forms.initial ?? 0) + (forms.medial ?? 0) + (forms.final ?? 0)) / 4,
      );
      summary[id] = { ...forms, mastery };
    }
    return summary;
  },
);

export default alphabetProgressSlice.reducer;
