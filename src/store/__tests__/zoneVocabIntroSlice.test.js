import { describe, it, expect } from 'vitest';
import zoneVocabIntroReducer, {
  markWordReviewed,
  resetZoneIntro,
  resetAllZoneIntros,
  isZoneIntroComplete,
  getZoneIntroProgress,
  getNextUnreviewedWord,
  selectIsZoneIntroComplete,
  selectZoneIntroProgress,
  makeSelectZoneIntroProgress,
  selectAllZoneIntroProgress,
} from '../slices/zoneVocabIntroSlice.js';
import {
  ZONE_IDS,
  ZONE_COUNT,
  getZoneIntroWords,
  getAllZoneIntroWordIds,
} from '../../data/zoneVocabIntros.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return zoneVocabIntroReducer(undefined, { type: '@@INIT' });
}

function buildStateWithReviewed(zoneId, reviewedWordIds) {
  const reviewedByZone = {};
  reviewedByZone[zoneId] = {};
  for (const wordId of reviewedWordIds) {
    reviewedByZone[zoneId][wordId] = true;
  }
  return { zoneVocabIntro: { reviewedByZone } };
}

function buildStateWithAllReviewed(zoneId) {
  const words = getZoneIntroWords(zoneId);
  return buildStateWithReviewed(zoneId, words.map((w) => w.id));
}

// ── Data completeness ─────────────────────────────────────────────────────────

describe('ZONE_VOCAB_INTROS data', () => {
  it('has exactly 8 zones', () => {
    expect(ZONE_COUNT).toBe(8);
    expect(ZONE_IDS).toHaveLength(8);
  });

  it('contains all expected zone IDs', () => {
    const expectedZones = [
      'oasis_village',
      'desert_marketplace',
      'ancient_library',
      'farmland',
      'bedouin_camp',
      'mountain_village',
      'coastal_port',
      'royal_palace',
    ];
    for (const zoneId of expectedZones) {
      expect(ZONE_IDS).toContain(zoneId);
    }
  });

  it('each zone has 10-15 words', () => {
    for (const zoneId of ZONE_IDS) {
      const words = getZoneIntroWords(zoneId);
      expect(words.length).toBeGreaterThanOrEqual(10);
      expect(words.length).toBeLessThanOrEqual(15);
    }
  });

  it('every word has all required fields', () => {
    const requiredFields = ['id', 'arabic', 'english', 'root', 'zoneContext', 'exampleInZone'];
    for (const zoneId of ZONE_IDS) {
      const words = getZoneIntroWords(zoneId);
      for (const word of words) {
        for (const field of requiredFields) {
          expect(word).toHaveProperty(field);
          // root can be empty string for particles, other fields must be non-empty
          if (field !== 'root') {
            expect(word[field]).toBeTruthy();
          }
        }
      }
    }
  });

  it('all word IDs are unique within each zone', () => {
    for (const zoneId of ZONE_IDS) {
      const words = getZoneIntroWords(zoneId);
      const ids = words.map((w) => w.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    }
  });

  it('total unique word IDs across all zones is 80-100', () => {
    const allIds = getAllZoneIntroWordIds();
    expect(allIds.length).toBeGreaterThanOrEqual(80);
    expect(allIds.length).toBeLessThanOrEqual(100);
  });

  it('returns empty array for unknown zoneId', () => {
    expect(getZoneIntroWords('unknown_zone')).toEqual([]);
  });
});

// ── Initial reducer state ─────────────────────────────────────────────────────

describe('zoneVocabIntroReducer initial state', () => {
  it('starts with empty reviewedByZone', () => {
    const state = getInitialState();
    expect(state.reviewedByZone).toEqual({});
  });
});

// ── markWordReviewed ──────────────────────────────────────────────────────────

describe('markWordReviewed', () => {
  it('marks a word as reviewed in a zone', () => {
    const words = getZoneIntroWords('oasis_village');
    const wordId = words[0].id;
    let state = getInitialState();
    state = zoneVocabIntroReducer(state, markWordReviewed({ zoneId: 'oasis_village', wordId }));
    expect(state.reviewedByZone['oasis_village'][wordId]).toBe(true);
  });

  it('creates zone entry if it does not exist', () => {
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'bedouin_camp', wordId: 'bc_001' }),
    );
    expect(state.reviewedByZone['bedouin_camp']).toBeDefined();
  });

  it('can mark multiple words in the same zone', () => {
    const words = getZoneIntroWords('oasis_village');
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: words[0].id }),
    );
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: words[1].id }),
    );
    expect(state.reviewedByZone['oasis_village'][words[0].id]).toBe(true);
    expect(state.reviewedByZone['oasis_village'][words[1].id]).toBe(true);
  });

  it('does not affect other zones', () => {
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: 'ov_001' }),
    );
    expect(state.reviewedByZone['desert_marketplace']).toBeUndefined();
  });
});

// ── resetZoneIntro ────────────────────────────────────────────────────────────

describe('resetZoneIntro', () => {
  it('clears reviewed words for a single zone', () => {
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: 'ov_001' }),
    );
    state = zoneVocabIntroReducer(state, resetZoneIntro('oasis_village'));
    expect(state.reviewedByZone['oasis_village']).toBeUndefined();
  });

  it('does not affect other zones when resetting one', () => {
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: 'ov_001' }),
    );
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'bedouin_camp', wordId: 'bc_001' }),
    );
    state = zoneVocabIntroReducer(state, resetZoneIntro('oasis_village'));
    expect(state.reviewedByZone['bedouin_camp']['bc_001']).toBe(true);
  });
});

// ── resetAllZoneIntros ────────────────────────────────────────────────────────

describe('resetAllZoneIntros', () => {
  it('clears all reviewed words for all zones', () => {
    let state = getInitialState();
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'oasis_village', wordId: 'ov_001' }),
    );
    state = zoneVocabIntroReducer(
      state,
      markWordReviewed({ zoneId: 'bedouin_camp', wordId: 'bc_001' }),
    );
    state = zoneVocabIntroReducer(state, resetAllZoneIntros());
    expect(state.reviewedByZone).toEqual({});
  });
});

// ── isZoneIntroComplete ───────────────────────────────────────────────────────

describe('isZoneIntroComplete', () => {
  it('returns false when no words reviewed', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    expect(isZoneIntroComplete('oasis_village', state)).toBe(false);
  });

  it('returns false when only some words reviewed', () => {
    const words = getZoneIntroWords('oasis_village');
    const partialState = buildStateWithReviewed('oasis_village', [words[0].id, words[1].id]);
    expect(isZoneIntroComplete('oasis_village', partialState)).toBe(false);
  });

  it('returns true when all words reviewed', () => {
    const state = buildStateWithAllReviewed('oasis_village');
    expect(isZoneIntroComplete('oasis_village', state)).toBe(true);
  });

  it('returns false for unknown zone', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    expect(isZoneIntroComplete('unknown_zone', state)).toBe(false);
  });

  it('works for all 8 zones when all words reviewed', () => {
    for (const zoneId of ZONE_IDS) {
      const state = buildStateWithAllReviewed(zoneId);
      expect(isZoneIntroComplete(zoneId, state)).toBe(true);
    }
  });
});

// ── getZoneIntroProgress ──────────────────────────────────────────────────────

describe('getZoneIntroProgress', () => {
  it('returns 0/total/0% when nothing reviewed', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const progress = getZoneIntroProgress('oasis_village', state);
    const total = getZoneIntroWords('oasis_village').length;
    expect(progress.reviewed).toBe(0);
    expect(progress.total).toBe(total);
    expect(progress.percentage).toBe(0);
  });

  it('returns correct count when some words reviewed', () => {
    const words = getZoneIntroWords('oasis_village');
    const state = buildStateWithReviewed('oasis_village', [words[0].id, words[1].id]);
    const progress = getZoneIntroProgress('oasis_village', state);
    expect(progress.reviewed).toBe(2);
    expect(progress.total).toBe(words.length);
    expect(progress.percentage).toBe(Math.round((2 / words.length) * 100));
  });

  it('returns 100% when all words reviewed', () => {
    const state = buildStateWithAllReviewed('oasis_village');
    const progress = getZoneIntroProgress('oasis_village', state);
    expect(progress.percentage).toBe(100);
    expect(progress.reviewed).toBe(progress.total);
  });

  it('returns { reviewed: 0, total: 0, percentage: 0 } for unknown zone', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    expect(getZoneIntroProgress('unknown_zone', state)).toEqual({
      reviewed: 0,
      total: 0,
      percentage: 0,
    });
  });
});

// ── getNextUnreviewedWord ─────────────────────────────────────────────────────

describe('getNextUnreviewedWord', () => {
  it('returns the first word when nothing reviewed', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const words = getZoneIntroWords('oasis_village');
    const next = getNextUnreviewedWord('oasis_village', state);
    expect(next).toEqual(words[0]);
  });

  it('returns the next unreviewed word after some are reviewed', () => {
    const words = getZoneIntroWords('oasis_village');
    const state = buildStateWithReviewed('oasis_village', [words[0].id]);
    const next = getNextUnreviewedWord('oasis_village', state);
    expect(next).toEqual(words[1]);
  });

  it('returns null when all words are reviewed', () => {
    const state = buildStateWithAllReviewed('oasis_village');
    expect(getNextUnreviewedWord('oasis_village', state)).toBeNull();
  });
});

// ── Selectors ─────────────────────────────────────────────────────────────────

describe('selectIsZoneIntroComplete', () => {
  it('returns false when not complete', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    expect(selectIsZoneIntroComplete(state, 'oasis_village')).toBe(false);
  });

  it('returns true when complete', () => {
    const state = buildStateWithAllReviewed('oasis_village');
    expect(selectIsZoneIntroComplete(state, 'oasis_village')).toBe(true);
  });
});

describe('selectZoneIntroProgress', () => {
  it('returns progress object for a zone', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const progress = selectZoneIntroProgress(state, 'oasis_village');
    expect(progress).toHaveProperty('reviewed');
    expect(progress).toHaveProperty('total');
    expect(progress).toHaveProperty('percentage');
  });
});

describe('makeSelectZoneIntroProgress', () => {
  it('returns a memoized selector for a specific zone', () => {
    const selectOasisProgress = makeSelectZoneIntroProgress('oasis_village');
    const words = getZoneIntroWords('oasis_village');
    const state = buildStateWithAllReviewed('oasis_village');
    const progress = selectOasisProgress(state);
    expect(progress.reviewed).toBe(words.length);
    expect(progress.total).toBe(words.length);
    expect(progress.percentage).toBe(100);
  });
});

describe('selectAllZoneIntroProgress', () => {
  it('returns byZone object with an entry per zone', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const result = selectAllZoneIntroProgress(state);
    expect(Object.keys(result.byZone)).toHaveLength(ZONE_COUNT);
    for (const zoneId of ZONE_IDS) {
      expect(result.byZone[zoneId]).toBeDefined();
    }
  });

  it('returns correct totals', () => {
    const state = { zoneVocabIntro: { reviewedByZone: {} } };
    const result = selectAllZoneIntroProgress(state);
    const expectedTotal = ZONE_IDS.reduce((sum, z) => sum + getZoneIntroWords(z).length, 0);
    expect(result.totalWords).toBe(expectedTotal);
    expect(result.totalReviewed).toBe(0);
    expect(result.overallPercentage).toBe(0);
  });

  it('correctly counts reviewed words across zones', () => {
    const wordsOasis = getZoneIntroWords('oasis_village');
    const wordsBedouin = getZoneIntroWords('bedouin_camp');
    const state = {
      zoneVocabIntro: {
        reviewedByZone: {
          oasis_village: { [wordsOasis[0].id]: true, [wordsOasis[1].id]: true },
          bedouin_camp: { [wordsBedouin[0].id]: true },
        },
      },
    };
    const result = selectAllZoneIntroProgress(state);
    expect(result.totalReviewed).toBe(3);
    expect(result.byZone['oasis_village'].reviewed).toBe(2);
    expect(result.byZone['bedouin_camp'].reviewed).toBe(1);
  });
});
