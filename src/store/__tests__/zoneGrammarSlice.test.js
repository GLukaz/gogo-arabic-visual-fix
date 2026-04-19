import { describe, it, expect } from 'vitest';
import zoneGrammarReducer, {
  markGrammarPointLearned,
  resetGrammarPoint,
  resetAllGrammarPoints,
  isGrammarPointLearned,
  getZoneGrammarProgress,
  selectGrammarProgress,
  selectIsGrammarPointLearned,
  selectLearnedGrammarPoints,
  selectUnlearnedGrammarPoints,
} from '../slices/zoneGrammarSlice.js';
import {
  GRAMMAR_ZONE_IDS,
  TOTAL_GRAMMAR_POINTS,
  getZoneGrammar,
  getAllGrammarPoints,
  getGrammarPointById,
} from '../../data/zoneGrammarPoints.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialState() {
  return zoneGrammarReducer(undefined, { type: '@@INIT' });
}

function buildReduxState(learnedPoints = {}) {
  return { zoneGrammar: { learnedPoints } };
}

function buildAllLearnedState(zoneId) {
  const points = getZoneGrammar(zoneId);
  const learnedPoints = {};
  for (const pt of points) {
    learnedPoints[pt.id] = true;
  }
  return buildReduxState(learnedPoints);
}

// ── Data completeness ─────────────────────────────────────────────────────────

describe('ZONE_GRAMMAR_POINTS data', () => {
  it('covers exactly 8 zones', () => {
    expect(GRAMMAR_ZONE_IDS).toHaveLength(8);
  });

  it('contains all expected zone IDs', () => {
    const expectedZones = [
      'oasis_village',
      'ancient_library',
      'desert_marketplace',
      'farmland',
      'bedouin_camp',
      'mountain_village',
      'coastal_port',
      'royal_palace',
    ];
    for (const zoneId of expectedZones) {
      expect(GRAMMAR_ZONE_IDS).toContain(zoneId);
    }
  });

  it('each zone has 2-3 grammar points', () => {
    for (const zoneId of GRAMMAR_ZONE_IDS) {
      const points = getZoneGrammar(zoneId);
      expect(points.length).toBeGreaterThanOrEqual(2);
      expect(points.length).toBeLessThanOrEqual(3);
    }
  });

  it('total grammar points are between 16 and 24', () => {
    expect(TOTAL_GRAMMAR_POINTS).toBeGreaterThanOrEqual(16);
    expect(TOTAL_GRAMMAR_POINTS).toBeLessThanOrEqual(24);
  });

  it('every point has all required fields', () => {
    const requiredFields = ['id', 'zone', 'concept', 'explanation', 'arabicExample', 'pattern', 'relatedVocab', 'cefrLevel', 'order'];
    for (const zoneId of GRAMMAR_ZONE_IDS) {
      const points = getZoneGrammar(zoneId);
      for (const pt of points) {
        for (const field of requiredFields) {
          expect(pt, `${pt.id} missing field: ${field}`).toHaveProperty(field);
          if (field !== 'relatedVocab') {
            expect(pt[field], `${pt.id}.${field} should be non-empty`).toBeTruthy();
          }
        }
        expect(Array.isArray(pt.relatedVocab), `${pt.id}.relatedVocab should be an array`).toBe(true);
        expect(pt.relatedVocab.length, `${pt.id}.relatedVocab should have at least 1 word`).toBeGreaterThan(0);
      }
    }
  });

  it('grammar concepts progress from A1 in early zones to B1 in later zones', () => {
    // Zones 1-4 should have A1/A2 points
    const earlyZones = ['oasis_village', 'ancient_library', 'desert_marketplace', 'farmland'];
    for (const zoneId of earlyZones) {
      const points = getZoneGrammar(zoneId);
      const hasEarlyLevel = points.some((pt) => pt.cefrLevel === 'A1' || pt.cefrLevel === 'A2');
      expect(hasEarlyLevel, `${zoneId} should have A1 or A2 grammar points`).toBe(true);
    }

    // Zones 7-8 should have B1 points
    const laterZones = ['coastal_port', 'royal_palace'];
    for (const zoneId of laterZones) {
      const points = getZoneGrammar(zoneId);
      const hasB1 = points.some((pt) => pt.cefrLevel === 'B1');
      expect(hasB1, `${zoneId} should have B1 grammar points`).toBe(true);
    }
  });

  it('all IDs are unique across zones', () => {
    const allPoints = getAllGrammarPoints();
    const ids = allPoints.map((pt) => pt.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('order values are unique and form a natural global sequence', () => {
    const allPoints = getAllGrammarPoints();
    const orders = allPoints.map((pt) => pt.order);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });

  it('getGrammarPointById returns the correct point', () => {
    const pt = getGrammarPointById('gp_ov_001');
    expect(pt).toBeDefined();
    expect(pt.zone).toBe('oasis_village');
    expect(pt.cefrLevel).toBe('A1');
  });

  it('getGrammarPointById returns undefined for unknown ID', () => {
    expect(getGrammarPointById('gp_nonexistent')).toBeUndefined();
  });
});

// ── Reducer initial state ─────────────────────────────────────────────────────

describe('zoneGrammarReducer initial state', () => {
  it('starts with empty learnedPoints', () => {
    const state = getInitialState();
    expect(state.learnedPoints).toEqual({});
  });
});

// ── Reducer actions ───────────────────────────────────────────────────────────

describe('markGrammarPointLearned', () => {
  it('marks a grammar point as learned', () => {
    const state = getInitialState();
    const next = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    expect(next.learnedPoints['gp_ov_001']).toBe(true);
  });

  it('is idempotent — marking the same point twice causes no issues', () => {
    let state = getInitialState();
    state = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    state = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    expect(state.learnedPoints['gp_ov_001']).toBe(true);
  });

  it('does not affect other points', () => {
    const state = getInitialState();
    const next = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    expect(next.learnedPoints['gp_ov_002']).toBeUndefined();
  });
});

describe('resetGrammarPoint', () => {
  it('removes a learned point', () => {
    let state = getInitialState();
    state = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    state = zoneGrammarReducer(state, resetGrammarPoint('gp_ov_001'));
    expect(state.learnedPoints['gp_ov_001']).toBeUndefined();
  });

  it('is safe to call on an already-unlearned point', () => {
    const state = getInitialState();
    const next = zoneGrammarReducer(state, resetGrammarPoint('gp_ov_001'));
    expect(next.learnedPoints).toEqual({});
  });
});

describe('resetAllGrammarPoints', () => {
  it('clears all learned points', () => {
    let state = getInitialState();
    state = zoneGrammarReducer(state, markGrammarPointLearned('gp_ov_001'));
    state = zoneGrammarReducer(state, markGrammarPointLearned('gp_al_001'));
    state = zoneGrammarReducer(state, resetAllGrammarPoints());
    expect(state.learnedPoints).toEqual({});
  });
});

// ── Pure helpers ──────────────────────────────────────────────────────────────

describe('isGrammarPointLearned', () => {
  it('returns false when point not learned', () => {
    const state = buildReduxState({});
    expect(isGrammarPointLearned('gp_ov_001', state)).toBe(false);
  });

  it('returns true when point is learned', () => {
    const state = buildReduxState({ 'gp_ov_001': true });
    expect(isGrammarPointLearned('gp_ov_001', state)).toBe(true);
  });
});

describe('getZoneGrammarProgress', () => {
  it('returns zeros for a zone with no learned points', () => {
    const state = buildReduxState({});
    const progress = getZoneGrammarProgress('oasis_village', state);
    expect(progress.learned).toBe(0);
    expect(progress.total).toBe(getZoneGrammar('oasis_village').length);
    expect(progress.percentage).toBe(0);
  });

  it('returns 100% when all points in a zone are learned', () => {
    const state = buildAllLearnedState('oasis_village');
    const progress = getZoneGrammarProgress('oasis_village', state);
    expect(progress.percentage).toBe(100);
    expect(progress.learned).toBe(progress.total);
  });

  it('returns correct partial progress', () => {
    const points = getZoneGrammar('oasis_village');
    const state = buildReduxState({ [points[0].id]: true });
    const progress = getZoneGrammarProgress('oasis_village', state);
    expect(progress.learned).toBe(1);
    expect(progress.total).toBe(points.length);
  });

  it('returns zeros and empty total for unknown zone', () => {
    const state = buildReduxState({});
    const progress = getZoneGrammarProgress('unknown_zone', state);
    expect(progress).toEqual({ learned: 0, total: 0, percentage: 0 });
  });
});

// ── Redux selectors ───────────────────────────────────────────────────────────

describe('selectGrammarProgress', () => {
  it('returns { learned: 0, total: TOTAL_GRAMMAR_POINTS, byZone } initially', () => {
    const state = buildReduxState({});
    const progress = selectGrammarProgress(state);
    expect(progress.learned).toBe(0);
    expect(progress.total).toBe(TOTAL_GRAMMAR_POINTS);
    expect(Object.keys(progress.byZone)).toHaveLength(GRAMMAR_ZONE_IDS.length);
  });

  it('correctly totals learned points across all zones', () => {
    const learnedPoints = {
      'gp_ov_001': true,
      'gp_al_001': true,
      'gp_dm_001': true,
    };
    const state = buildReduxState(learnedPoints);
    const progress = selectGrammarProgress(state);
    expect(progress.learned).toBe(3);
  });

  it('byZone entry reflects per-zone progress', () => {
    const points = getZoneGrammar('oasis_village');
    const learnedPoints = {};
    for (const pt of points) {
      learnedPoints[pt.id] = true;
    }
    const state = buildReduxState(learnedPoints);
    const progress = selectGrammarProgress(state);
    expect(progress.byZone['oasis_village'].percentage).toBe(100);
    expect(progress.byZone['ancient_library'].percentage).toBe(0);
  });
});

describe('selectLearnedGrammarPoints', () => {
  it('returns empty array when nothing learned', () => {
    const state = buildReduxState({});
    expect(selectLearnedGrammarPoints(state)).toEqual([]);
  });

  it('returns array of learned point IDs', () => {
    const state = buildReduxState({ 'gp_ov_001': true, 'gp_al_001': true });
    const learned = selectLearnedGrammarPoints(state);
    expect(learned).toContain('gp_ov_001');
    expect(learned).toContain('gp_al_001');
    expect(learned).toHaveLength(2);
  });
});

describe('selectUnlearnedGrammarPoints', () => {
  it('returns all points when nothing learned', () => {
    const state = buildReduxState({});
    const unlearned = selectUnlearnedGrammarPoints(state);
    expect(unlearned).toHaveLength(TOTAL_GRAMMAR_POINTS);
  });

  it('excludes learned points', () => {
    const state = buildReduxState({ 'gp_ov_001': true });
    const unlearned = selectUnlearnedGrammarPoints(state);
    expect(unlearned.map((pt) => pt.id)).not.toContain('gp_ov_001');
    expect(unlearned).toHaveLength(TOTAL_GRAMMAR_POINTS - 1);
  });
});

describe('selectIsGrammarPointLearned', () => {
  it('returns false for unlearned point', () => {
    const state = buildReduxState({});
    expect(selectIsGrammarPointLearned(state, 'gp_ov_001')).toBe(false);
  });

  it('returns true for learned point', () => {
    const state = buildReduxState({ 'gp_ov_001': true });
    expect(selectIsGrammarPointLearned(state, 'gp_ov_001')).toBe(true);
  });
});
