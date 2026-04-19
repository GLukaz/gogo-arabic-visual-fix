import { describe, it, expect } from 'vitest';
import coreVocabularyReducer, {
  recordWordMastery,
  resetWordMastery,
  resetAllCoreVocab,
  CORE_MASTERY_THRESHOLD,
  CORE_WORD_COUNT,
  isCoreVocabComplete,
  getCoreVocabProgress,
  selectWordMastery,
  selectIsCoreVocabComplete,
  selectCoreVocabProgress,
} from '../slices/coreVocabularySlice.js';
import { CORE_VOCABULARY, getNextCoreWords } from '../../data/coreVocabulary.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return coreVocabularyReducer(undefined, { type: '@@INIT' });
}

function buildStateWithAllMastered(score) {
  const wordMastery = {};
  for (const word of CORE_VOCABULARY) {
    wordMastery[word.id] = score;
  }
  return { coreVocabulary: { wordMastery } };
}

// ── CORE_VOCABULARY data completeness ─────────────────────────────────────────

describe('CORE_VOCABULARY data', () => {
  it('contains exactly 100 words', () => {
    expect(CORE_VOCABULARY).toHaveLength(100);
  });

  it('has frequencyRank 1-100 in ascending order', () => {
    for (let i = 0; i < CORE_VOCABULARY.length; i++) {
      expect(CORE_VOCABULARY[i].frequencyRank).toBe(i + 1);
    }
  });

  it('has unique IDs for all 100 words', () => {
    const ids = CORE_VOCABULARY.map((w) => w.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });

  it('every word has all required fields', () => {
    const requiredFields = [
      'id', 'arabic', 'english', 'rootMeaning',
      'exampleSentence', 'pronunciationGuide', 'mnemonicHint',
      'category', 'frequencyRank',
    ];
    for (const word of CORE_VOCABULARY) {
      for (const field of requiredFields) {
        expect(word).toHaveProperty(field);
        if (field !== 'root' && field !== 'rootMeaning') {
          expect(word[field]).toBeTruthy();
        }
      }
    }
  });

  it('covers all required categories with correct counts', () => {
    const counts = {};
    for (const word of CORE_VOCABULARY) {
      counts[word.category] = (counts[word.category] ?? 0) + 1;
    }
    expect(counts['greetings']).toBe(10);
    expect(counts['pronouns']).toBe(8);
    expect(counts['basic_verbs']).toBe(15);
    expect(counts['numbers']).toBe(10);
    expect(counts['family']).toBe(8);
    expect(counts['food']).toBe(8);
    expect(counts['directions']).toBe(8);
    expect(counts['time']).toBe(8);
    expect(counts['common_nouns']).toBe(15);
    expect(counts['adjectives']).toBe(10);
  });

  it('IDs follow core_001 … core_100 pattern', () => {
    for (let i = 0; i < CORE_VOCABULARY.length; i++) {
      const expected = `core_${String(i + 1).padStart(3, '0')}`;
      expect(CORE_VOCABULARY[i].id).toBe(expected);
    }
  });
});

// ── getNextCoreWords ──────────────────────────────────────────────────────────

describe('getNextCoreWords', () => {
  it('returns first N words when completedCount is 0', () => {
    const result = getNextCoreWords(0, 5);
    expect(result).toHaveLength(5);
    expect(result[0].id).toBe('core_001');
    expect(result[4].id).toBe('core_005');
  });

  it('skips already-completed words', () => {
    const result = getNextCoreWords(10, 5);
    expect(result).toHaveLength(5);
    expect(result[0].id).toBe('core_011');
    expect(result[4].id).toBe('core_015');
  });

  it('returns empty array when all words are completed', () => {
    const result = getNextCoreWords(100, 5);
    expect(result).toHaveLength(0);
  });

  it('returns partial batch at end of list', () => {
    const result = getNextCoreWords(98, 5);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('core_099');
    expect(result[1].id).toBe('core_100');
  });
});

// ── CORE_WORD_COUNT / CORE_MASTERY_THRESHOLD ──────────────────────────────────

describe('constants', () => {
  it('CORE_WORD_COUNT is 100', () => {
    expect(CORE_WORD_COUNT).toBe(100);
  });

  it('CORE_MASTERY_THRESHOLD is 70', () => {
    expect(CORE_MASTERY_THRESHOLD).toBe(70);
  });
});

// ── Reducer ───────────────────────────────────────────────────────────────────

describe('coreVocabularyReducer', () => {
  it('initialises with empty wordMastery', () => {
    const state = getInitialState();
    expect(state.wordMastery).toEqual({});
  });

  it('recordWordMastery sets score for a word', () => {
    const state = coreVocabularyReducer(
      getInitialState(),
      recordWordMastery({ wordId: 'core_001', score: 85 }),
    );
    expect(state.wordMastery['core_001']).toBe(85);
  });

  it('recordWordMastery clamps score to 0-100', () => {
    let state = coreVocabularyReducer(
      getInitialState(),
      recordWordMastery({ wordId: 'core_001', score: 150 }),
    );
    expect(state.wordMastery['core_001']).toBe(100);

    state = coreVocabularyReducer(
      getInitialState(),
      recordWordMastery({ wordId: 'core_001', score: -10 }),
    );
    expect(state.wordMastery['core_001']).toBe(0);
  });

  it('resetWordMastery removes the word from state', () => {
    let state = coreVocabularyReducer(
      getInitialState(),
      recordWordMastery({ wordId: 'core_001', score: 80 }),
    );
    state = coreVocabularyReducer(state, resetWordMastery('core_001'));
    expect(state.wordMastery['core_001']).toBeUndefined();
  });

  it('resetAllCoreVocab clears all mastery scores', () => {
    let state = coreVocabularyReducer(
      getInitialState(),
      recordWordMastery({ wordId: 'core_001', score: 90 }),
    );
    state = coreVocabularyReducer(state, resetAllCoreVocab());
    expect(state.wordMastery).toEqual({});
  });
});

// ── isCoreVocabComplete ───────────────────────────────────────────────────────

describe('isCoreVocabComplete', () => {
  it('returns false when no words have been mastered', () => {
    const state = { coreVocabulary: { wordMastery: {} } };
    expect(isCoreVocabComplete(state)).toBe(false);
  });

  it('returns false when only some words are mastered', () => {
    const wordMastery = {};
    for (let i = 1; i <= 50; i++) {
      wordMastery[`core_${String(i).padStart(3, '0')}`] = 100;
    }
    expect(isCoreVocabComplete({ coreVocabulary: { wordMastery } })).toBe(false);
  });

  it('returns true when all 100 words are at threshold', () => {
    const state = buildStateWithAllMastered(CORE_MASTERY_THRESHOLD);
    expect(isCoreVocabComplete(state)).toBe(true);
  });

  it('returns true when all words are above threshold', () => {
    const state = buildStateWithAllMastered(100);
    expect(isCoreVocabComplete(state)).toBe(true);
  });

  it('returns false when one word is just below threshold', () => {
    const state = buildStateWithAllMastered(CORE_MASTERY_THRESHOLD);
    // Drop one word below threshold
    state.coreVocabulary.wordMastery['core_050'] = CORE_MASTERY_THRESHOLD - 1;
    expect(isCoreVocabComplete(state)).toBe(false);
  });
});

// ── getCoreVocabProgress ──────────────────────────────────────────────────────

describe('getCoreVocabProgress', () => {
  it('returns 0/100 when no mastery recorded', () => {
    const state = { coreVocabulary: { wordMastery: {} } };
    const progress = getCoreVocabProgress(state);
    expect(progress.completed).toBe(0);
    expect(progress.total).toBe(100);
    expect(progress.percentage).toBe(0);
  });

  it('counts only words meeting threshold', () => {
    const wordMastery = {
      core_001: 80,  // above threshold
      core_002: 50,  // below threshold
      core_003: 70,  // exactly at threshold
    };
    const progress = getCoreVocabProgress({ coreVocabulary: { wordMastery } });
    expect(progress.completed).toBe(2); // core_001 and core_003
    expect(progress.total).toBe(100);
    expect(progress.percentage).toBe(2);
  });

  it('returns 100% when all words mastered', () => {
    const state = buildStateWithAllMastered(100);
    const progress = getCoreVocabProgress(state);
    expect(progress.completed).toBe(100);
    expect(progress.percentage).toBe(100);
  });
});

// ── Redux selectors ───────────────────────────────────────────────────────────

describe('Redux selectors', () => {
  it('selectWordMastery returns 0 for unknown word', () => {
    const state = { coreVocabulary: { wordMastery: {} } };
    expect(selectWordMastery(state, 'core_001')).toBe(0);
  });

  it('selectWordMastery returns recorded score', () => {
    const state = { coreVocabulary: { wordMastery: { core_001: 75 } } };
    expect(selectWordMastery(state, 'core_001')).toBe(75);
  });

  it('selectIsCoreVocabComplete delegates to isCoreVocabComplete', () => {
    const incomplete = { coreVocabulary: { wordMastery: {} } };
    expect(selectIsCoreVocabComplete(incomplete)).toBe(false);

    const complete = buildStateWithAllMastered(100);
    expect(selectIsCoreVocabComplete(complete)).toBe(true);
  });

  it('selectCoreVocabProgress returns memoized progress object', () => {
    const state = buildStateWithAllMastered(80);
    const progress = selectCoreVocabProgress(state);
    expect(progress.completed).toBe(100);
    expect(progress.total).toBe(100);
    expect(progress.percentage).toBe(100);
  });
});
