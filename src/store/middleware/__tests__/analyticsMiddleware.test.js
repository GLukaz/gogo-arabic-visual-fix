import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsMiddleware, flushAnalytics } from '../analyticsMiddleware.js';

// Mock slice actions so we can inspect dispatches
vi.mock('../../slices/analyticsEventQueueSlice.js', () => ({
  enqueueEvent: vi.fn((payload) => ({
    type: 'analyticsEventQueue/enqueueEvent',
    payload,
  })),
  initSession: vi.fn(() => ({ type: 'analyticsEventQueue/initSession' })),
  flushEvents: vi.fn(() => ({ type: 'analyticsEventQueue/flushEvents' })),
  selectEventQueue: vi.fn((state) => state?.analyticsEventQueue?.events ?? []),
  ANALYTICS_EVENT_TYPES: {
    SESSION_START:        'session_start',
    SESSION_END:          'session_end',
    QUIZ_COMPLETED:       'quiz_completed',
    BATTLE_FINISHED:      'battle_finished',
    LEVEL_UP:             'level_up',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    FEATURE_USED:         'feature_used',
    ZONE_ENTERED:         'zone_entered',
  },
}));

import { enqueueEvent, selectEventQueue } from '../../slices/analyticsEventQueueSlice.js';

// ─── helpers ────────────────────────────────────────────────────────────────

function makeStore(overrides = {}) {
  const state = {
    player: { level: 5, ...overrides.player },
    analyticsEventQueue: { events: [], sessionId: 'test-session', ...overrides.analyticsEventQueue },
    ...overrides,
  };
  return {
    getState: vi.fn(() => state),
    dispatch: vi.fn(),
    _state: state,
  };
}

function makeMiddleware(store) {
  const next = vi.fn((action) => action);
  const dispatch = analyticsMiddleware(store)(next);
  return { next, dispatch };
}

describe('analyticsMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Session initialization ─────────────────────────────────────────────────

  it('dispatches initSession on the first non-queue action', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'some/action' });

    const dispatchedTypes = store.dispatch.mock.calls.map((c) => c[0].type);
    expect(dispatchedTypes).toContain('analyticsEventQueue/initSession');
  });

  it('does NOT dispatch initSession for analyticsEventQueue/* actions', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'analyticsEventQueue/enqueueEvent', payload: {} });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('only initializes session once across multiple actions', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'action/one' });
    dispatch({ type: 'action/two' });
    dispatch({ type: 'action/three' });

    const initCalls = store.dispatch.mock.calls.filter(
      (c) => c[0].type === 'analyticsEventQueue/initSession'
    );
    expect(initCalls).toHaveLength(1);
  });

  it('always calls next(action)', () => {
    const store = makeStore();
    const { next, dispatch } = makeMiddleware(store);

    const action = { type: 'some/action' };
    dispatch(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  // ── Quiz completed ────────────────────────────────────────────────────────

  it('emits quiz_completed for achievements/recordQuizTypeResult', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({
      type: 'achievements/recordQuizTypeResult',
      payload: { quizType: 'reading', perfect: true },
    });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'quiz_completed',
        properties: { quizType: 'reading', perfect: true },
      })
    );
  });

  it('handles missing quiz payload gracefully', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'achievements/recordQuizTypeResult' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'quiz_completed',
        properties: { quizType: null, perfect: false },
      })
    );
  });

  // ── Battle finished ────────────────────────────────────────────────────────

  it('emits battle_finished for battle/endBattle (victory)', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({
      type: 'battle/endBattle',
      payload: { victory: true, accuracy: 0.85, bossId: 'golem' },
    });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'battle_finished',
        properties: { victory: true, accuracy: 0.85, bossId: 'golem' },
      })
    );
  });

  it('emits battle_finished for battle/endBattle (defeat)', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'battle/endBattle', payload: { victory: false } });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'battle_finished',
        properties: expect.objectContaining({ victory: false }),
      })
    );
  });

  // ── Level up ──────────────────────────────────────────────────────────────

  it('emits level_up when player level increases after player/addXP', () => {
    // Before action: level 5; after action: level 6
    let callCount = 0;
    const store = {
      getState: vi.fn(() => {
        callCount += 1;
        // First call (pre-state snapshot): level 5
        // Subsequent calls (post-action reads): level 6
        return {
          player: { level: callCount === 1 ? 5 : 6 },
          analyticsEventQueue: { events: [], sessionId: 'sid' },
        };
      }),
      dispatch: vi.fn(),
    };

    const { dispatch } = makeMiddleware(store);
    dispatch({ type: 'player/addXP', payload: 100 });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'level_up',
        properties: { level: 6, previousLevel: 5 },
      })
    );
  });

  it('does NOT emit level_up when player level stays the same after player/addXP', () => {
    const store = makeStore({ player: { level: 5 } });
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'player/addXP', payload: 10 });

    const levelUpCalls = store.dispatch.mock.calls.filter((c) => {
      const arg = c[0];
      return arg.payload?.type === 'level_up';
    });
    expect(levelUpCalls).toHaveLength(0);
  });

  // ── Achievement unlocked ──────────────────────────────────────────────────

  it('emits achievement_unlocked for achievements/unlockAchievement', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({
      type: 'achievements/unlockAchievement',
      payload: { id: 'first_battle_win' },
    });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'achievement_unlocked',
        properties: { achievementId: 'first_battle_win' },
      })
    );
  });

  // ── Zone entered ──────────────────────────────────────────────────────────

  it('emits zone_entered for player/setCurrentZone', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'player/setCurrentZone', payload: 'desert_ruins' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'zone_entered',
        properties: { zone: 'desert_ruins' },
      })
    );
  });

  // ── Session events ─────────────────────────────────────────────────────────

  it('emits session_start for analytics/startSession', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'analytics/startSession', payload: { type: 'review' } });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'session_start',
        properties: { sessionType: 'review' },
      })
    );
  });

  it('emits session_end for analytics/endSession', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'analytics/endSession' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'session_end' })
    );
  });

  // ── Feature used ──────────────────────────────────────────────────────────

  it('emits feature_used (inventory) for ui/openInventory', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'ui/openInventory' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'feature_used',
        properties: { featureName: 'inventory' },
      })
    );
  });

  it('emits feature_used (journal) for ui/openJournal', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'ui/openJournal' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'feature_used',
        properties: { featureName: 'journal' },
      })
    );
  });

  it('emits feature_used (recipeBook) for ui/openRecipeBook', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'ui/openRecipeBook' });

    expect(enqueueEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'feature_used',
        properties: { featureName: 'recipeBook' },
      })
    );
  });

  // ── Untracked actions ─────────────────────────────────────────────────────

  it('does NOT emit analytics events for untracked actions', () => {
    const store = makeStore();
    const { dispatch } = makeMiddleware(store);

    dispatch({ type: 'vocabulary/addFsrsCard', payload: {} });

    // Only initSession should be dispatched, no enqueueEvent
    expect(enqueueEvent).not.toHaveBeenCalled();
  });
});

// ─── analyticsEventQueueSlice unit tests ─────────────────────────────────────

describe('analyticsEventQueueSlice', () => {
  // Import actual slice (bypass vi.mock above via importActual)
  let reducer;
  let actions;

  beforeEach(async () => {
    const mod = await vi.importActual('../../slices/analyticsEventQueueSlice.js');
    reducer = mod.default;
    actions = {
      initSession: mod.initSession,
      enqueueEvent: mod.enqueueEvent,
      flushEvents: mod.flushEvents,
    };
  });

  it('initializes with empty events and null sessionId', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.events).toEqual([]);
    expect(state.sessionId).toBeNull();
  });

  it('initSession sets a non-empty sessionId string', () => {
    const state = reducer(undefined, actions.initSession());
    expect(typeof state.sessionId).toBe('string');
    expect(state.sessionId.length).toBeGreaterThan(0);
  });

  it('enqueueEvent adds event with type and properties', () => {
    let state = reducer(undefined, actions.initSession());
    state = reducer(state, actions.enqueueEvent({ type: 'quiz_completed', properties: { quizType: 'grammar' } }));
    expect(state.events).toHaveLength(1);
    expect(state.events[0].type).toBe('quiz_completed');
    expect(state.events[0].properties.quizType).toBe('grammar');
  });

  it('enqueueEvent stamps timestamp and sessionId on events', () => {
    let state = reducer(undefined, actions.initSession());
    const sid = state.sessionId;
    state = reducer(state, actions.enqueueEvent({ type: 'zone_entered', properties: {} }));
    expect(state.events[0].sessionId).toBe(sid);
    expect(typeof state.events[0].timestamp).toBe('number');
  });

  it('flushEvents clears all queued events', () => {
    let state = reducer(undefined, actions.initSession());
    state = reducer(state, actions.enqueueEvent({ type: 'quiz_completed', properties: {} }));
    state = reducer(state, actions.enqueueEvent({ type: 'level_up', properties: {} }));
    expect(state.events).toHaveLength(2);

    state = reducer(state, actions.flushEvents());
    expect(state.events).toHaveLength(0);
  });

  it('FIFO overflow caps queue at MAX_QUEUE_SIZE (500)', async () => {
    const { MAX_QUEUE_SIZE } = await vi.importActual('../../slices/analyticsEventQueueSlice.js');
    let state = reducer(undefined, actions.initSession());

    // Add MAX_QUEUE_SIZE + 10 events
    for (let i = 0; i < MAX_QUEUE_SIZE + 10; i++) {
      state = reducer(state, actions.enqueueEvent({ type: 'zone_entered', properties: { i } }));
    }

    expect(state.events).toHaveLength(MAX_QUEUE_SIZE);
    // Oldest events were evicted — last event should have i = MAX_QUEUE_SIZE + 9
    expect(state.events[state.events.length - 1].properties.i).toBe(MAX_QUEUE_SIZE + 9);
  });
});

// ─── flushAnalytics ───────────────────────────────────────────────────────────

describe('flushAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('returns { sent: 0 } when queue is empty', async () => {
    const store = makeStore({ analyticsEventQueue: { events: [], sessionId: 'sid' } });
    // selectEventQueue mock already returns []
    const result = await flushAnalytics(store);
    expect(result).toEqual({ sent: 0 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('sends events and dispatches flushEvents on success', async () => {
    selectEventQueue.mockReturnValueOnce([
      { type: 'quiz_completed', timestamp: 1, sessionId: 'sid', properties: {} },
    ]);

    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    // navigator.onLine is true by default in jsdom

    const store = makeStore();
    const result = await flushAnalytics(store);

    expect(result).toEqual({ sent: 1 });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'analyticsEventQueue/flushEvents' })
    );
  });

  it('no-ops (does not dispatch flush) when server returns error status', async () => {
    selectEventQueue.mockReturnValueOnce([
      { type: 'level_up', timestamp: 1, sessionId: 'sid', properties: {} },
    ]);

    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    const store = makeStore();
    const result = await flushAnalytics(store);

    expect(result.sent).toBe(0);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('no-ops when fetch throws (network error)', async () => {
    selectEventQueue.mockReturnValueOnce([
      { type: 'battle_finished', timestamp: 1, sessionId: 'sid', properties: {} },
    ]);

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const store = makeStore();
    const result = await flushAnalytics(store);

    expect(result.reason).toBe('error');
    expect(result.sent).toBe(0);
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
