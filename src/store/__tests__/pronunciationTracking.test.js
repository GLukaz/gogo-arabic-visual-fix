/**
 * pronunciationTracking.test.js
 * WIRE-012 — pronunciationAccuracy tracking in analyticsSlice
 */
import { describe, it, expect } from 'vitest';
import reducer, {
  recordPronunciationResult,
  selectPronunciationAccuracy,
  resetAnalytics,
} from '../slices/analyticsSlice.js';

const emptyState = reducer(undefined, { type: '@@INIT' });

describe('analyticsSlice — pronunciationAccuracy', () => {
  it('initialState has empty pronunciationAccuracy', () => {
    expect(emptyState.pronunciationAccuracy).toEqual({});
  });

  it('recordPronunciationResult creates entry on first call', () => {
    const state = reducer(emptyState, recordPronunciationResult({ wordId: 'w1', correct: true, similarity: 0.9 }));
    expect(state.pronunciationAccuracy['w1']).toEqual({ correct: 1, total: 1, avgSimilarity: 0.9 });
  });

  it('recordPronunciationResult increments total for both correct and incorrect', () => {
    let state = reducer(emptyState, recordPronunciationResult({ wordId: 'w2', correct: true, similarity: 0.8 }));
    state = reducer(state, recordPronunciationResult({ wordId: 'w2', correct: false, similarity: 0.4 }));
    expect(state.pronunciationAccuracy['w2'].total).toBe(2);
    expect(state.pronunciationAccuracy['w2'].correct).toBe(1);
  });

  it('recordPronunciationResult computes rolling avgSimilarity', () => {
    let state = reducer(emptyState, recordPronunciationResult({ wordId: 'w3', correct: true, similarity: 0.6 }));
    state = reducer(state, recordPronunciationResult({ wordId: 'w3', correct: true, similarity: 1.0 }));
    // avg = (0.6 + 1.0) / 2 = 0.8
    expect(state.pronunciationAccuracy['w3'].avgSimilarity).toBeCloseTo(0.8, 5);
  });

  it('recordPronunciationResult handles missing similarity gracefully', () => {
    const state = reducer(emptyState, recordPronunciationResult({ wordId: 'w4', correct: false }));
    expect(state.pronunciationAccuracy['w4'].avgSimilarity).toBe(0);
  });

  it('selectPronunciationAccuracy returns pronunciationAccuracy map', () => {
    const fakeRootState = { analytics: { pronunciationAccuracy: { w5: { correct: 2, total: 3, avgSimilarity: 0.7 } } } };
    expect(selectPronunciationAccuracy(fakeRootState)).toEqual(fakeRootState.analytics.pronunciationAccuracy);
  });

  it('resetAnalytics clears pronunciationAccuracy', () => {
    let state = reducer(emptyState, recordPronunciationResult({ wordId: 'w6', correct: true, similarity: 0.9 }));
    state = reducer(state, resetAnalytics());
    expect(state.pronunciationAccuracy).toEqual({});
  });
});
