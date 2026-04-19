import { describe, it, expect } from 'vitest';
import rootKnowledgeReducer, {
  learnRoot,
  updateWordScore,
  resetRootScores,
  resetAllRootKnowledge,
  ROOT_MASTERY_THRESHOLD,
  getRootMastery,
  predictWordFromRoot,
  getFoundationRoots,
  selectKnownRoots,
  selectRootMastery,
  selectRootMasterySummary,
  selectRootKnowledgeProgress,
} from '../slices/rootKnowledgeSlice.js';
import {
  ROOT_TEACHING_SET,
  PATTERN_TEMPLATES,
  getRootById,
  getRootByLetters,
} from '../../data/rootTeachingSet.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return rootKnowledgeReducer(undefined, { type: '@@INIT' });
}

/** Build a full Redux state with knownRoots and wordScores */
function buildState(knownRoots = [], wordScores = {}) {
  return { rootKnowledge: { knownRoots, wordScores } };
}

// ── ROOT_TEACHING_SET data ───────────────────────────────────────────────────

describe('ROOT_TEACHING_SET data', () => {
  it('contains exactly 30 roots', () => {
    expect(ROOT_TEACHING_SET).toHaveLength(30);
  });

  it('every root has id, root, coreMeaning, foundationOrder, and derivedWords', () => {
    for (const entry of ROOT_TEACHING_SET) {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('root');
      expect(entry).toHaveProperty('coreMeaning');
      expect(entry).toHaveProperty('foundationOrder');
      expect(entry).toHaveProperty('derivedWords');
      expect(typeof entry.id).toBe('string');
      expect(typeof entry.root).toBe('string');
      expect(typeof entry.coreMeaning).toBe('string');
      expect(Array.isArray(entry.derivedWords)).toBe(true);
    }
  });

  it('every root has 4-6 derived words', () => {
    for (const entry of ROOT_TEACHING_SET) {
      expect(entry.derivedWords.length).toBeGreaterThanOrEqual(4);
      expect(entry.derivedWords.length).toBeLessThanOrEqual(6);
    }
  });

  it('every derivedWord has arabic, english, pattern, and form', () => {
    for (const entry of ROOT_TEACHING_SET) {
      for (const word of entry.derivedWords) {
        expect(word).toHaveProperty('arabic');
        expect(word).toHaveProperty('english');
        expect(word).toHaveProperty('pattern');
        expect(word).toHaveProperty('form');
        expect(typeof word.arabic).toBe('string');
        expect(word.arabic.length).toBeGreaterThan(0);
      }
    }
  });

  it('all root IDs are unique', () => {
    const ids = ROOT_TEACHING_SET.map((r) => r.id);
    expect(new Set(ids).size).toBe(30);
  });

  it('all root letter strings are unique', () => {
    const roots = ROOT_TEACHING_SET.map((r) => r.root);
    expect(new Set(roots).size).toBe(30);
  });

  it('root letters use hyphen-separated format (e.g. "ك-ت-ب")', () => {
    for (const entry of ROOT_TEACHING_SET) {
      const parts = entry.root.split('-');
      expect(parts).toHaveLength(3);
      for (const part of parts) {
        expect(part.length).toBeGreaterThan(0);
      }
    }
  });
});

// ── Foundation roots ─────────────────────────────────────────────────────────

describe('getFoundationRoots()', () => {
  it('returns exactly 5 foundation roots', () => {
    const roots = getFoundationRoots();
    expect(roots).toHaveLength(5);
  });

  it('returns roots in foundationOrder 1-5', () => {
    const roots = getFoundationRoots();
    for (let i = 0; i < roots.length; i++) {
      expect(roots[i].foundationOrder).toBe(i + 1);
    }
  });

  it('includes high-yield roots (ktb, drs, 3lm)', () => {
    const roots = getFoundationRoots();
    const ids = roots.map((r) => r.id);
    expect(ids).toContain('root_ktb');
    expect(ids).toContain('root_drs');
    expect(ids).toContain('root_3lm');
  });
});

// ── getRootById / getRootByLetters ────────────────────────────────────────────

describe('getRootById()', () => {
  it('returns correct root for known ID', () => {
    const root = getRootById('root_ktb');
    expect(root).not.toBeNull();
    expect(root.root).toBe('ك-ت-ب');
    expect(root.coreMeaning).toBe('writing');
  });

  it('returns null for unknown ID', () => {
    expect(getRootById('root_xyz')).toBeNull();
  });
});

describe('getRootByLetters()', () => {
  it('returns correct root for known letters', () => {
    const root = getRootByLetters('د-ر-س');
    expect(root).not.toBeNull();
    expect(root.id).toBe('root_drs');
  });

  it('returns null for unknown letter string', () => {
    expect(getRootByLetters('x-y-z')).toBeNull();
  });
});

// ── predictWordFromRoot ────────────────────────────────────────────────────────

describe('predictWordFromRoot()', () => {
  it('generates كَتَبَ from root ك-ت-ب + pattern fa3ala', () => {
    const result = predictWordFromRoot('ك-ت-ب', 'fa3ala');
    // Pattern فَعَلَ with k,t,b substituted → كَتَبَ
    expect(result).toBe('كَتَبَ');
  });

  it('generates مَدْرَسَة from root د-ر-س + pattern maf3ala', () => {
    const result = predictWordFromRoot('د-ر-س', 'maf3ala');
    // Pattern مَفْعَلَة with d,r,s → مَدْرَسَة
    expect(result).toBe('مَدْرَسَة');
  });

  it('generates كَاتِب from root ك-ت-ب + pattern fa3il', () => {
    const result = predictWordFromRoot('ك-ت-ب', 'fa3il');
    // Pattern فَاعِل → كَاتِب
    expect(result).toBe('كَاتِب');
  });

  it('generates مَكْتُوب from root ك-ت-ب + pattern maf3ul', () => {
    const result = predictWordFromRoot('ك-ت-ب', 'maf3ul');
    expect(result).toBe('مَكْتُوب');
  });

  it('returns null for unknown pattern', () => {
    expect(predictWordFromRoot('ك-ت-ب', 'unknown_pattern')).toBeNull();
  });

  it('returns null for invalid root (fewer than 3 radicals)', () => {
    expect(predictWordFromRoot('ك-ت', 'fa3ala')).toBeNull();
  });

  it('returns null for empty root', () => {
    expect(predictWordFromRoot('', 'fa3ala')).toBeNull();
  });

  it('returns null for null inputs', () => {
    expect(predictWordFromRoot(null, 'fa3ala')).toBeNull();
    expect(predictWordFromRoot('ك-ت-ب', null)).toBeNull();
  });

  it('handles root where a radical matches a template placeholder letter', () => {
    // Root ف-ه-م: first radical is ف (same as template placeholder)
    // Pattern fa3ala: فَعَلَ → فَهَمَ (he understood)
    const result = predictWordFromRoot('ف-ه-م', 'fa3ala');
    expect(result).toBe('فَهَمَ');
  });

  it('PATTERN_TEMPLATES contains the expected common patterns', () => {
    expect(PATTERN_TEMPLATES).toHaveProperty('fa3ala');
    expect(PATTERN_TEMPLATES).toHaveProperty('fa3il');
    expect(PATTERN_TEMPLATES).toHaveProperty('maf3ul');
    expect(PATTERN_TEMPLATES).toHaveProperty('maf3ala');
    expect(PATTERN_TEMPLATES).toHaveProperty('fa3l');
  });
});

// ── Reducer initial state ────────────────────────────────────────────────────

describe('rootKnowledge reducer', () => {
  it('initial state has empty knownRoots and wordScores', () => {
    const state = getInitialState();
    expect(state.knownRoots).toEqual([]);
    expect(state.wordScores).toEqual({});
  });

  // learnRoot
  it('learnRoot adds root to knownRoots', () => {
    const state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    expect(state.knownRoots).toContain('root_ktb');
  });

  it('learnRoot is idempotent — does not add duplicate', () => {
    let state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    state = rootKnowledgeReducer(state, learnRoot('root_ktb'));
    expect(state.knownRoots.filter((id) => id === 'root_ktb')).toHaveLength(1);
  });

  it('learnRoot initializes wordScores entry for the root', () => {
    const state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    expect(state.wordScores['root_ktb']).toBeDefined();
  });

  it('learnRoot ignores unknown rootId', () => {
    const state = rootKnowledgeReducer(getInitialState(), learnRoot('root_xyz'));
    expect(state.knownRoots).toHaveLength(0);
  });

  // updateWordScore
  it('updateWordScore records a score for a derived word', () => {
    let state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    state = rootKnowledgeReducer(state, updateWordScore({ rootId: 'root_ktb', arabic: 'كَتَبَ', score: 80 }));
    expect(state.wordScores['root_ktb']['كَتَبَ']).toBe(80);
  });

  it('updateWordScore clamps score to 0-100', () => {
    let state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    state = rootKnowledgeReducer(state, updateWordScore({ rootId: 'root_ktb', arabic: 'كَتَبَ', score: 150 }));
    expect(state.wordScores['root_ktb']['كَتَبَ']).toBe(100);

    state = rootKnowledgeReducer(state, updateWordScore({ rootId: 'root_ktb', arabic: 'كَتَبَ', score: -10 }));
    expect(state.wordScores['root_ktb']['كَتَبَ']).toBe(0);
  });

  // resetRootScores
  it('resetRootScores clears word scores for a root', () => {
    let state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    state = rootKnowledgeReducer(state, updateWordScore({ rootId: 'root_ktb', arabic: 'كَتَبَ', score: 80 }));
    state = rootKnowledgeReducer(state, resetRootScores('root_ktb'));
    expect(state.wordScores['root_ktb']).toEqual({});
    expect(state.knownRoots).toContain('root_ktb'); // still known
  });

  // resetAllRootKnowledge
  it('resetAllRootKnowledge clears everything', () => {
    let state = rootKnowledgeReducer(getInitialState(), learnRoot('root_ktb'));
    state = rootKnowledgeReducer(state, updateWordScore({ rootId: 'root_ktb', arabic: 'كَتَبَ', score: 80 }));
    state = rootKnowledgeReducer(state, resetAllRootKnowledge());
    expect(state.knownRoots).toHaveLength(0);
    expect(state.wordScores).toEqual({});
  });
});

// ── getRootMastery ────────────────────────────────────────────────────────────

describe('getRootMastery()', () => {
  it('returns 0 for unknown rootId', () => {
    const state = buildState();
    expect(getRootMastery(state, 'root_xyz')).toBe(0);
  });

  it('returns 0 when no words have been scored', () => {
    const state = buildState(['root_ktb'], {});
    expect(getRootMastery(state, 'root_ktb')).toBe(0);
  });

  it('calculates average mastery across all derivedWords', () => {
    // root_ktb has 6 derived words; score 3 of them at 60 each = avg 30
    const state = buildState(['root_ktb'], {
      root_ktb: { 'كَتَبَ': 60, 'كِتَاب': 60, 'كَاتِب': 60 },
    });
    // 6 words: 60+60+60+0+0+0 = 180 / 6 = 30
    expect(getRootMastery(state, 'root_ktb')).toBe(30);
  });

  it('returns 100 when all words are scored at 100', () => {
    const root = getRootById('root_ktb');
    const wordScores = {};
    root.derivedWords.forEach((w) => { wordScores[w.arabic] = 100; });
    const state = buildState(['root_ktb'], { root_ktb: wordScores });
    expect(getRootMastery(state, 'root_ktb')).toBe(100);
  });
});

// ── Selectors ─────────────────────────────────────────────────────────────────

describe('selectKnownRoots', () => {
  it('returns empty array initially', () => {
    const state = buildState();
    expect(selectKnownRoots(state)).toEqual([]);
  });

  it('returns array of known root IDs', () => {
    const state = buildState(['root_ktb', 'root_drs']);
    expect(selectKnownRoots(state)).toEqual(['root_ktb', 'root_drs']);
  });
});

describe('selectRootMastery', () => {
  it('returns mastery for a known root', () => {
    const root = getRootById('root_drs');
    const wordScores = {};
    root.derivedWords.forEach((w) => { wordScores[w.arabic] = 80; });
    const state = buildState(['root_drs'], { root_drs: wordScores });
    expect(selectRootMastery(state, 'root_drs')).toBe(80);
  });
});

describe('selectRootMasterySummary', () => {
  it('returns summary entry for each known root', () => {
    const state = buildState(['root_ktb']);
    const summary = selectRootMasterySummary(state);
    expect(summary).toHaveProperty('root_ktb');
    expect(summary.root_ktb).toMatchObject({
      root: 'ك-ت-ب',
      coreMeaning: 'writing',
      mastery: 0,
      wordCount: 6,
    });
  });
});

describe('selectRootKnowledgeProgress', () => {
  it('shows 0/30 with no known roots', () => {
    const state = buildState();
    const progress = selectRootKnowledgeProgress(state);
    expect(progress.known).toBe(0);
    expect(progress.total).toBe(30);
    expect(progress.masteredCount).toBe(0);
    expect(progress.averageMastery).toBe(0);
  });

  it('counts mastered roots when above ROOT_MASTERY_THRESHOLD', () => {
    const root = getRootById('root_ktb');
    const wordScores = {};
    root.derivedWords.forEach((w) => { wordScores[w.arabic] = ROOT_MASTERY_THRESHOLD; });
    const state = buildState(['root_ktb'], { root_ktb: wordScores });
    const progress = selectRootKnowledgeProgress(state);
    expect(progress.known).toBe(1);
    expect(progress.masteredCount).toBe(1);
  });
});
