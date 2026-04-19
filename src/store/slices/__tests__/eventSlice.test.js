import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  updateActiveEvents,
  recordEventAttendance,
  clearExpiredEvents,
  selectActiveEventIds,
  selectVocabBoosts,
  selectEventHistory,
  selectLastChecked,
  selectActiveEvents,
  selectEventAttendance,
} from '../eventSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// Reducer tests
// ─────────────────────────────────────────────────────────────────────────────

describe('eventSlice reducer', () => {
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('initial state', () => {
    it('starts with empty activeEvents', () => {
      expect(initialState.activeEvents).toEqual([]);
    });

    it('starts with null lastChecked', () => {
      expect(initialState.lastChecked).toBeNull();
    });

    it('starts with empty eventHistory', () => {
      expect(initialState.eventHistory).toEqual({});
    });

    it('starts with empty vocabBoostActive', () => {
      expect(initialState.vocabBoostActive).toEqual([]);
    });
  });

  describe('updateActiveEvents', () => {
    it('sets active event IDs, vocab boosts, and timestamp', () => {
      const state = reducer(
        initialState,
        updateActiveEvents({
          activeEventIds: ['calligraphy_workshop', 'oud_evening'],
          vocabBoosts: ['calligraphy', 'music'],
          checkedAt: 870,
        })
      );

      expect(state.activeEvents).toEqual(['calligraphy_workshop', 'oud_evening']);
      expect(state.vocabBoostActive).toEqual(['calligraphy', 'music']);
      expect(state.lastChecked).toBe(870);
    });

    it('replaces previous active events', () => {
      let state = reducer(
        initialState,
        updateActiveEvents({
          activeEventIds: ['calligraphy_workshop'],
          vocabBoosts: ['calligraphy'],
          checkedAt: 840,
        })
      );

      state = reducer(
        state,
        updateActiveEvents({
          activeEventIds: ['oud_evening'],
          vocabBoosts: ['music'],
          checkedAt: 1140,
        })
      );

      expect(state.activeEvents).toEqual(['oud_evening']);
      expect(state.vocabBoostActive).toEqual(['music']);
    });
  });

  describe('recordEventAttendance', () => {
    it('creates a new history entry on first attendance', () => {
      const state = reducer(
        initialState,
        recordEventAttendance({ eventId: 'scholars_debate', timestamp: 960 })
      );

      expect(state.eventHistory.scholars_debate).toEqual({
        timesAttended: 1,
        lastAttended: 960,
      });
    });

    it('increments attendance count on subsequent visits', () => {
      let state = reducer(
        initialState,
        recordEventAttendance({ eventId: 'scholars_debate', timestamp: 960 })
      );

      state = reducer(
        state,
        recordEventAttendance({ eventId: 'scholars_debate', timestamp: 2400 })
      );

      expect(state.eventHistory.scholars_debate.timesAttended).toBe(2);
      expect(state.eventHistory.scholars_debate.lastAttended).toBe(2400);
    });

    it('tracks multiple events independently', () => {
      let state = reducer(
        initialState,
        recordEventAttendance({ eventId: 'scholars_debate', timestamp: 960 })
      );

      state = reducer(
        state,
        recordEventAttendance({ eventId: 'oud_evening', timestamp: 1200 })
      );

      expect(state.eventHistory.scholars_debate.timesAttended).toBe(1);
      expect(state.eventHistory.oud_evening.timesAttended).toBe(1);
    });
  });

  describe('clearExpiredEvents', () => {
    it('empties activeEvents and vocabBoostActive', () => {
      let state = reducer(
        initialState,
        updateActiveEvents({
          activeEventIds: ['oud_evening'],
          vocabBoosts: ['music'],
          checkedAt: 1200,
        })
      );

      state = reducer(state, clearExpiredEvents());

      expect(state.activeEvents).toEqual([]);
      expect(state.vocabBoostActive).toEqual([]);
    });

    it('does NOT clear eventHistory', () => {
      let state = reducer(
        initialState,
        recordEventAttendance({ eventId: 'oud_evening', timestamp: 1200 })
      );

      state = reducer(
        state,
        updateActiveEvents({
          activeEventIds: ['oud_evening'],
          vocabBoosts: ['music'],
          checkedAt: 1200,
        })
      );

      state = reducer(state, clearExpiredEvents());

      expect(state.eventHistory.oud_evening.timesAttended).toBe(1);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Selector tests
// ─────────────────────────────────────────────────────────────────────────────

describe('eventSlice selectors', () => {
  const mockState = {
    event: {
      activeEvents: ['calligraphy_workshop'],
      lastChecked: 870,
      eventHistory: {
        scholars_debate: { timesAttended: 3, lastAttended: 5000 },
      },
      vocabBoostActive: ['calligraphy'],
    },
  };

  describe('base selectors', () => {
    it('selectActiveEventIds returns the active ID list', () => {
      expect(selectActiveEventIds(mockState)).toEqual(['calligraphy_workshop']);
    });

    it('selectVocabBoosts returns boosted categories', () => {
      expect(selectVocabBoosts(mockState)).toEqual(['calligraphy']);
    });

    it('selectEventHistory returns the full history object', () => {
      expect(selectEventHistory(mockState)).toEqual({
        scholars_debate: { timesAttended: 3, lastAttended: 5000 },
      });
    });

    it('selectLastChecked returns the timestamp', () => {
      expect(selectLastChecked(mockState)).toBe(870);
    });
  });

  describe('selectActiveEvents (memoized)', () => {
    it('returns enriched event objects with faction metadata', () => {
      const events = selectActiveEvents(mockState);
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('calligraphy_workshop');
      expect(events[0].factionIcon).toBeDefined();
      expect(events[0].factionName).toBeDefined();
    });

    it('returns empty array when no events active', () => {
      const emptyState = {
        event: { ...mockState.event, activeEvents: [] },
      };
      expect(selectActiveEvents(emptyState)).toEqual([]);
    });

    it('filters out unknown event IDs', () => {
      const badState = {
        event: { ...mockState.event, activeEvents: ['nonexistent_xyz'] },
      };
      expect(selectActiveEvents(badState)).toEqual([]);
    });
  });

  describe('selectEventAttendance', () => {
    it('returns attendance record for tracked event', () => {
      const attendance = selectEventAttendance('scholars_debate')(mockState);
      expect(attendance.timesAttended).toBe(3);
      expect(attendance.lastAttended).toBe(5000);
    });

    it('returns defaults for untracked event', () => {
      const attendance = selectEventAttendance('oud_evening')(mockState);
      expect(attendance.timesAttended).toBe(0);
      expect(attendance.lastAttended).toBeNull();
    });
  });
});
