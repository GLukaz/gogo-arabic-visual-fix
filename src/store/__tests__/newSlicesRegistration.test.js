import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import placementReducer, {
  recordPlacementResult,
  resetPlacement,
  selectHasCompletedPlacement,
  selectPlacement,
} from '../slices/placementSlice.js';
import cefrProgressReducer, {
  setCefrLevel,
  initCefrLevel,
  selectCefrLevel,
  selectCefrHistory,
} from '../slices/cefrProgressSlice.js';

describe('placementSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        placement: placementReducer,
        cefrProgress: cefrProgressReducer,
      },
    });
  });

  it('state.placement is accessible at correct path', () => {
    const state = store.getState();
    expect(state.placement).toBeDefined();
    expect(state.placement.hasCompleted).toBe(false);
    expect(state.placement.assignedLevel).toBeNull();
    expect(state.placement.rawScore).toBeNull();
    expect(state.placement.completedAt).toBeNull();
  });

  it('recordPlacementResult sets hasCompleted = true and stores values', () => {
    store.dispatch(recordPlacementResult({ assignedLevel: 'A1', rawScore: 8 }));
    const placement = selectPlacement(store.getState());
    expect(selectHasCompletedPlacement(store.getState())).toBe(true);
    expect(placement.assignedLevel).toBe('A1');
    expect(placement.rawScore).toBe(8);
    expect(placement.completedAt).toBeTruthy();
  });

  it('resetPlacement returns to initial state', () => {
    store.dispatch(recordPlacementResult({ assignedLevel: 'A2', rawScore: 12 }));
    store.dispatch(resetPlacement());
    const state = store.getState();
    expect(state.placement.hasCompleted).toBe(false);
    expect(state.placement.assignedLevel).toBeNull();
  });
});

describe('cefrProgressSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        placement: placementReducer,
        cefrProgress: cefrProgressReducer,
      },
    });
  });

  it('state.cefrProgress is accessible at correct path', () => {
    const state = store.getState();
    expect(state.cefrProgress).toBeDefined();
    expect(state.cefrProgress.currentLevel).toBeNull();
    expect(state.cefrProgress.levelHistory).toEqual([]);
    expect(state.cefrProgress.lastAssessedAt).toBeNull();
  });

  it('initCefrLevel sets currentLevel when null', () => {
    store.dispatch(initCefrLevel('A1'));
    expect(selectCefrLevel(store.getState())).toBe('A1');
  });

  it('initCefrLevel does NOT overwrite existing level', () => {
    store.dispatch(initCefrLevel('A1'));
    store.dispatch(initCefrLevel('A2'));
    expect(selectCefrLevel(store.getState())).toBe('A1');
  });

  it('setCefrLevel updates currentLevel and appends history', () => {
    store.dispatch(initCefrLevel('A1'));
    store.dispatch(setCefrLevel({ level: 'A2', source: 'placement' }));

    expect(selectCefrLevel(store.getState())).toBe('A2');
    const history = selectCefrHistory(store.getState());
    expect(history).toHaveLength(1);
    expect(history[0].level).toBe('A1');
    expect(history[0].source).toBe('placement');
  });

  it('setCefrLevel does NOT append history when level is unchanged', () => {
    store.dispatch(initCefrLevel('A1'));
    store.dispatch(setCefrLevel({ level: 'A1', source: 'quiz' }));

    expect(selectCefrHistory(store.getState())).toHaveLength(0);
  });
});
