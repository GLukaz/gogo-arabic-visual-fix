import { describe, it, expect } from 'vitest';
import alphabetProgressReducer, {
  recordFormScore,
  resetLetterMastery,
  AFL_SEQUENCE,
  VOWEL_IDS,
  ALL_LETTER_IDS,
  getLetterMastery,
  isAlphabetComplete,
  selectNextLettersToLearn,
} from '../slices/alphabetProgressSlice.js';
import { alphabetGateMiddleware } from '../middleware/alphabetGateMiddleware.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return alphabetProgressReducer(undefined, { type: '@@INIT' });
}

/** Build full Redux state with all 28 consonants at a given score per form */
function buildAllMasteredState(score) {
  const letterMastery = {};
  for (const id of AFL_SEQUENCE) {
    letterMastery[id] = { isolated: score, initial: score, medial: score, final: score };
  }
  return { alphabetProgress: { letterMastery } };
}

/** Build a mock store for middleware tests */
function makeMockStore(stateOverrides = {}) {
  const state = {
    alphabetProgress: { letterMastery: {} },
    placement: { hasCompleted: false, assignedLevel: null },
    ...stateOverrides,
  };
  return {
    getState: () => state,
    dispatch: vi.fn(),
  };
}

// ── AFL_SEQUENCE / VOWEL_IDS structure ───────────────────────────────────────

describe('AFL_SEQUENCE', () => {
  it('contains exactly 28 consonants', () => {
    expect(AFL_SEQUENCE).toHaveLength(28);
  });

  it('starts with hamza (Alif) and ends with ya', () => {
    expect(AFL_SEQUENCE[0]).toBe('hamza');
    expect(AFL_SEQUENCE[AFL_SEQUENCE.length - 1]).toBe('ya');
  });

  it('contains all expected consonant IDs', () => {
    const expected = [
      'hamza', 'ba', 'ta', 'tha', 'jim', 'hah', 'kha',
      'dal', 'dhal', 'ra', 'zay', 'sin', 'sheen', 'sad',
      'dad', 'tah', 'zah', 'ayn', 'ghayn', 'fa', 'qaf',
      'kaf', 'lam', 'meem', 'noon', 'ha', 'waw', 'ya',
    ];
    expect(AFL_SEQUENCE).toEqual(expected);
  });
});

describe('VOWEL_IDS', () => {
  it('contains exactly 6 vowels', () => {
    expect(VOWEL_IDS).toHaveLength(6);
  });

  it('includes all 3 short and 3 long vowels', () => {
    expect(VOWEL_IDS).toContain('fatha');
    expect(VOWEL_IDS).toContain('kasra');
    expect(VOWEL_IDS).toContain('damma');
    expect(VOWEL_IDS).toContain('alif');
    expect(VOWEL_IDS).toContain('ya_vowel');
    expect(VOWEL_IDS).toContain('waw_vowel');
  });
});

describe('ALL_LETTER_IDS', () => {
  it('contains 34 total letters (28 consonants + 6 vowels)', () => {
    expect(ALL_LETTER_IDS).toHaveLength(34);
  });
});

// ── Reducer: initial state ────────────────────────────────────────────────────

describe('alphabetProgressSlice initial state', () => {
  it('starts with empty letterMastery', () => {
    const state = getInitialState();
    expect(state.letterMastery).toEqual({});
  });
});

// ── Reducer: recordFormScore ──────────────────────────────────────────────────

describe('recordFormScore', () => {
  it('creates a new entry for an untracked letter', () => {
    const state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'ba',
      form: 'isolated',
      score: 75,
    }));
    expect(state.letterMastery.ba).toBeDefined();
    expect(state.letterMastery.ba.isolated).toBe(75);
    expect(state.letterMastery.ba.initial).toBe(0);
    expect(state.letterMastery.ba.medial).toBe(0);
    expect(state.letterMastery.ba.final).toBe(0);
  });

  it('updates only the specified form, leaving others unchanged', () => {
    let state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'ta', form: 'isolated', score: 60,
    }));
    state = alphabetProgressReducer(state, recordFormScore({
      letterId: 'ta', form: 'initial', score: 90,
    }));
    expect(state.letterMastery.ta.isolated).toBe(60);
    expect(state.letterMastery.ta.initial).toBe(90);
    expect(state.letterMastery.ta.medial).toBe(0);
  });

  it('clamps score to maximum of 100', () => {
    const state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'ha', form: 'final', score: 150,
    }));
    expect(state.letterMastery.ha.final).toBe(100);
  });

  it('clamps score to minimum of 0', () => {
    const state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'ha', form: 'medial', score: -20,
    }));
    expect(state.letterMastery.ha.medial).toBe(0);
  });

  it('overwrites a previous score for the same form', () => {
    let state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'lam', form: 'isolated', score: 50,
    }));
    state = alphabetProgressReducer(state, recordFormScore({
      letterId: 'lam', form: 'isolated', score: 85,
    }));
    expect(state.letterMastery.lam.isolated).toBe(85);
  });
});

// ── Reducer: resetLetterMastery ───────────────────────────────────────────────

describe('resetLetterMastery', () => {
  it('resets all 4 forms to 0 for a tracked letter', () => {
    let state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'meem', form: 'isolated', score: 90,
    }));
    state = alphabetProgressReducer(state, resetLetterMastery('meem'));
    expect(state.letterMastery.meem).toEqual({ isolated: 0, initial: 0, medial: 0, final: 0 });
  });

  it('does not affect other letters', () => {
    let state = alphabetProgressReducer(getInitialState(), recordFormScore({
      letterId: 'ba', form: 'isolated', score: 80,
    }));
    state = alphabetProgressReducer(state, recordFormScore({
      letterId: 'ta', form: 'isolated', score: 80,
    }));
    state = alphabetProgressReducer(state, resetLetterMastery('ba'));
    expect(state.letterMastery.ba.isolated).toBe(0);
    expect(state.letterMastery.ta.isolated).toBe(80);
  });
});

// ── getLetterMastery ──────────────────────────────────────────────────────────

describe('getLetterMastery', () => {
  it('returns 0 for an untracked letter', () => {
    const state = { alphabetProgress: { letterMastery: {} } };
    expect(getLetterMastery(state, 'ba')).toBe(0);
  });

  it('returns average across all 4 forms', () => {
    const state = {
      alphabetProgress: {
        letterMastery: {
          ba: { isolated: 80, initial: 60, medial: 100, final: 40 },
        },
      },
    };
    // (80 + 60 + 100 + 40) / 4 = 70
    expect(getLetterMastery(state, 'ba')).toBe(70);
  });

  it('returns 100 when all forms are 100', () => {
    const state = {
      alphabetProgress: {
        letterMastery: { ya: { isolated: 100, initial: 100, medial: 100, final: 100 } },
      },
    };
    expect(getLetterMastery(state, 'ya')).toBe(100);
  });

  it('handles missing alphabetProgress gracefully', () => {
    expect(getLetterMastery({}, 'ba')).toBe(0);
  });
});

// ── isAlphabetComplete ────────────────────────────────────────────────────────

describe('isAlphabetComplete', () => {
  it('returns false when no letters are mastered', () => {
    const state = { alphabetProgress: { letterMastery: {} } };
    expect(isAlphabetComplete(state)).toBe(false);
  });

  it('returns true when all 28 consonants are at 80%+ mastery', () => {
    const state = buildAllMasteredState(80);
    expect(isAlphabetComplete(state)).toBe(true);
  });

  it('returns false when only some consonants are mastered', () => {
    const state = buildAllMasteredState(0);
    state.alphabetProgress.letterMastery.ba = { isolated: 90, initial: 90, medial: 90, final: 90 };
    expect(isAlphabetComplete(state)).toBe(false);
  });

  it('returns false when one consonant is at exactly 79%', () => {
    const state = buildAllMasteredState(80);
    state.alphabetProgress.letterMastery.ya = { isolated: 79, initial: 79, medial: 79, final: 79 };
    expect(isAlphabetComplete(state)).toBe(false);
  });

  it('does NOT require vowels to be mastered for completion', () => {
    const state = buildAllMasteredState(100);
    // Vowels are absent — should still be complete
    expect(isAlphabetComplete(state)).toBe(true);
  });
});

// ── selectNextLettersToLearn ──────────────────────────────────────────────────

describe('selectNextLettersToLearn', () => {
  it('returns first N unlearned letters in AFL order', () => {
    const state = { alphabetProgress: { letterMastery: {} } };
    const next = selectNextLettersToLearn(state, 3);
    expect(next).toEqual(['hamza', 'ba', 'ta']);
  });

  it('skips already mastered letters', () => {
    const state = {
      alphabetProgress: {
        letterMastery: {
          hamza: { isolated: 90, initial: 90, medial: 90, final: 90 },
          ba:    { isolated: 80, initial: 80, medial: 80, final: 80 },
        },
      },
    };
    const next = selectNextLettersToLearn(state, 2);
    expect(next).toEqual(['ta', 'tha']);
  });

  it('returns empty array when all consonants are mastered', () => {
    const state = buildAllMasteredState(100);
    expect(selectNextLettersToLearn(state, 5)).toEqual([]);
  });

  it('returns fewer letters than requested when near end of sequence', () => {
    const state = buildAllMasteredState(100);
    // Remove mastery from last 2 consonants
    state.alphabetProgress.letterMastery.waw = { isolated: 0, initial: 0, medial: 0, final: 0 };
    state.alphabetProgress.letterMastery.ya  = { isolated: 0, initial: 0, medial: 0, final: 0 };
    const next = selectNextLettersToLearn(state, 5);
    expect(next).toHaveLength(2);
    expect(next).toContain('waw');
    expect(next).toContain('ya');
  });
});

// ── alphabetGateMiddleware ────────────────────────────────────────────────────

describe('alphabetGateMiddleware', () => {
  it('passes non-zone actions through unchanged', () => {
    const store = makeMockStore();
    const next = vi.fn((a) => a);
    const mw = alphabetGateMiddleware(store)(next);

    const action = { type: 'player/addXp', payload: 10 };
    mw(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('blocks world/enterZone when alphabet is incomplete', () => {
    const store = makeMockStore(); // no mastery
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'oasis_village' });
    expect(next).not.toHaveBeenCalled();
  });

  it('allows world/enterZone when alphabet is complete', () => {
    const completedState = buildAllMasteredState(80);
    const store = makeMockStore({ ...completedState });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    const action = { type: 'world/enterZone', payload: 'oasis_village' };
    mw(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('bypasses gate when placement test shows A2 level', () => {
    const store = makeMockStore({
      placement: { hasCompleted: true, assignedLevel: 'A2' },
    });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'desert_marketplace' });
    expect(next).toHaveBeenCalled();
  });

  it('bypasses gate when placement test shows B1 level', () => {
    const store = makeMockStore({
      placement: { hasCompleted: true, assignedLevel: 'B1' },
    });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'sacred_library' });
    expect(next).toHaveBeenCalled();
  });

  it('does NOT bypass gate when placement level is A1', () => {
    const store = makeMockStore({
      placement: { hasCompleted: true, assignedLevel: 'A1' },
    });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'oasis_village' });
    expect(next).not.toHaveBeenCalled();
  });

  it('does NOT bypass gate when placement is completed but assignedLevel is null', () => {
    const store = makeMockStore({
      placement: { hasCompleted: true, assignedLevel: null },
    });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'oasis_village' });
    expect(next).not.toHaveBeenCalled();
  });

  it('does NOT bypass gate when placement has not been completed', () => {
    const store = makeMockStore({
      placement: { hasCompleted: false, assignedLevel: 'A2' },
    });
    const next = vi.fn();
    const mw = alphabetGateMiddleware(store)(next);

    mw({ type: 'world/enterZone', payload: 'oasis_village' });
    expect(next).not.toHaveBeenCalled();
  });
});
