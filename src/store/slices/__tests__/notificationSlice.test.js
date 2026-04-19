import { describe, it, expect, beforeEach } from 'vitest';
import notificationReducer, {
  enqueueNotification,
  dismissNotification,
  clearQueue,
  selectActiveNotification,
  selectNotificationQueue,
  selectNotificationHistory,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_TYPES,
} from '../notificationSlice.js';

describe('notificationSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = notificationReducer(undefined, { type: '@@INIT' });
  });

  // ── Initial state ────────────────────────────────────────────────────────────

  it('Test 1: initial state has empty queue, null active, empty history', () => {
    expect(initialState.queue).toEqual([]);
    expect(initialState.activeNotification).toBeNull();
    expect(initialState.history).toEqual([]);
  });

  // ── enqueueNotification ──────────────────────────────────────────────────────

  it('Test 2: first enqueue sets activeNotification immediately (no queuing)', () => {
    const state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'Hello', type: 'system', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    expect(state.activeNotification).not.toBeNull();
    expect(state.activeNotification.message).toBe('Hello');
    expect(state.queue).toHaveLength(0);
  });

  it('Test 3: second enqueue goes into queue when active is set', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'First', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'Second', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    expect(state.activeNotification.message).toBe('First');
    expect(state.queue).toHaveLength(1);
    expect(state.queue[0].message).toBe('Second');
  });

  it('Test 4: notification has correct fields (type, message, priority, duration)', () => {
    const state = notificationReducer(
      initialState,
      enqueueNotification({
        type: NOTIFICATION_TYPES.ACHIEVEMENT,
        message: 'Level up!',
        priority: NOTIFICATION_PRIORITIES.HIGH,
        duration: 5000,
        data: { level: 5 },
      })
    );
    const n = state.activeNotification;
    expect(n.type).toBe('achievement');
    expect(n.message).toBe('Level up!');
    expect(n.priority).toBe(NOTIFICATION_PRIORITIES.HIGH);
    expect(n.duration).toBe(5000);
    expect(n.data).toEqual({ level: 5 });
    expect(n.id).toBeDefined();
    expect(n.timestamp).toBeDefined();
  });

  it('Test 5: default priority is NORMAL (1) when not specified', () => {
    const state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'test' })
    );
    expect(state.activeNotification.priority).toBe(NOTIFICATION_PRIORITIES.NORMAL);
  });

  // ── Priority ordering ────────────────────────────────────────────────────────

  it('Test 6: higher priority notification goes to front of queue', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'active', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'low', priority: NOTIFICATION_PRIORITIES.LOW })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'critical', priority: NOTIFICATION_PRIORITIES.CRITICAL })
    );
    // Queue order: critical (3) first, then low (0)
    expect(state.queue[0].message).toBe('critical');
    expect(state.queue[1].message).toBe('low');
  });

  it('Test 7: same priority notifications are FIFO within the same tier', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'active', priority: NOTIFICATION_PRIORITIES.HIGH })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'first-normal', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'second-normal', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    expect(state.queue[0].message).toBe('first-normal');
    expect(state.queue[1].message).toBe('second-normal');
  });

  it('Test 8: mixed priorities are sorted correctly in queue', () => {
    // Active is critical; queue gets: low, high, normal, critical
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'active', priority: NOTIFICATION_PRIORITIES.CRITICAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'low', priority: NOTIFICATION_PRIORITIES.LOW })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'high', priority: NOTIFICATION_PRIORITIES.HIGH })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'normal', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'critical2', priority: NOTIFICATION_PRIORITIES.CRITICAL })
    );
    // Expected queue order: critical2(3), high(2), normal(1), low(0)
    expect(state.queue[0].message).toBe('critical2');
    expect(state.queue[1].message).toBe('high');
    expect(state.queue[2].message).toBe('normal');
    expect(state.queue[3].message).toBe('low');
  });

  // ── dismissNotification ──────────────────────────────────────────────────────

  it('Test 9: dismiss removes active notification', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'active' })
    );
    state = notificationReducer(state, dismissNotification());
    expect(state.activeNotification).toBeNull();
  });

  it('Test 10: dismiss promotes next from queue', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'first', priority: NOTIFICATION_PRIORITIES.NORMAL })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'second', priority: NOTIFICATION_PRIORITIES.HIGH })
    );
    // Queue has 'second' (HIGH); active is 'first'
    state = notificationReducer(state, dismissNotification());
    expect(state.activeNotification.message).toBe('second');
    expect(state.queue).toHaveLength(0);
  });

  it('Test 11: dismiss with empty queue sets activeNotification to null', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'only' })
    );
    state = notificationReducer(state, dismissNotification());
    expect(state.activeNotification).toBeNull();
    expect(state.queue).toHaveLength(0);
  });

  it('Test 12: dismiss on already null active is a no-op', () => {
    const state = notificationReducer(initialState, dismissNotification());
    expect(state.activeNotification).toBeNull();
    expect(state.history).toHaveLength(0);
  });

  // ── History ──────────────────────────────────────────────────────────────────

  it('Test 13: dismissed notifications go to history', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'gone', type: 'system' })
    );
    state = notificationReducer(state, dismissNotification());
    expect(state.history).toHaveLength(1);
    expect(state.history[0].message).toBe('gone');
  });

  it('Test 14: history is most-recent-first (LIFO)', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'first' })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'second' })
    );
    state = notificationReducer(state, dismissNotification()); // dismiss 'first'
    state = notificationReducer(state, dismissNotification()); // dismiss 'second'
    expect(state.history[0].message).toBe('second');
    expect(state.history[1].message).toBe('first');
  });

  it('Test 15: history caps at 50 entries', () => {
    let state = initialState;
    // Enqueue and dismiss 60 notifications
    for (let i = 0; i < 60; i++) {
      state = notificationReducer(state, enqueueNotification({ message: `msg-${i}` }));
      state = notificationReducer(state, dismissNotification());
    }
    expect(state.history).toHaveLength(50);
  });

  // ── clearQueue ───────────────────────────────────────────────────────────────

  it('Test 16: clearQueue empties queue and active notification', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'first' })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'second' })
    );
    state = notificationReducer(state, clearQueue());
    expect(state.activeNotification).toBeNull();
    expect(state.queue).toHaveLength(0);
  });

  // ── Backward compatibility: ui/showNotification ──────────────────────────────

  it('Test 17: ui/showNotification sets activeNotification when queue is empty', () => {
    const state = notificationReducer(
      initialState,
      { type: 'ui/showNotification', payload: { message: 'compat', type: 'warning' } }
    );
    expect(state.activeNotification).not.toBeNull();
    expect(state.activeNotification.message).toBe('compat');
    expect(state.activeNotification.type).toBe('warning');
    expect(state.activeNotification.priority).toBe(NOTIFICATION_PRIORITIES.NORMAL);
  });

  it('Test 18: ui/showNotification enqueues behind higher-priority active', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'critical-active', priority: NOTIFICATION_PRIORITIES.CRITICAL })
    );
    state = notificationReducer(
      state,
      { type: 'ui/showNotification', payload: { message: 'compat-normal' } }
    );
    expect(state.activeNotification.message).toBe('critical-active');
    expect(state.queue).toHaveLength(1);
    expect(state.queue[0].message).toBe('compat-normal');
  });

  // ── Selectors ────────────────────────────────────────────────────────────────

  it('Test 19: selectActiveNotification returns active notification from state slice', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'selector-test' })
    );
    const fakeRootState = { notifications: state };
    expect(selectActiveNotification(fakeRootState).message).toBe('selector-test');
  });

  it('Test 20: selectNotificationQueue returns queue array', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'active' })
    );
    state = notificationReducer(
      state,
      enqueueNotification({ message: 'queued' })
    );
    const fakeRootState = { notifications: state };
    expect(selectNotificationQueue(fakeRootState)).toHaveLength(1);
  });

  it('Test 21: selectNotificationHistory returns history array', () => {
    let state = notificationReducer(
      initialState,
      enqueueNotification({ message: 'hist' })
    );
    state = notificationReducer(state, dismissNotification());
    const fakeRootState = { notifications: state };
    expect(selectNotificationHistory(fakeRootState)).toHaveLength(1);
  });
});
