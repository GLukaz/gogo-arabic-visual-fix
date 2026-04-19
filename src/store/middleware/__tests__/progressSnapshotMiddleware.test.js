import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getISOWeekId,
  isMondayUTC,
  captureSnapshot,
  selectProgressTrend,
  progressSnapshotMiddleware,
  _resetSnapshotSession,
} from '../progressSnapshotMiddleware.js';

// ─────────────────────────────────────────────────────────────────────────────
// getISOWeekId
// ─────────────────────────────────────────────────────────────────────────────

describe('getISOWeekId', () => {
  it('returns a string in YYYY-WNN format', () => {
    const id = getISOWeekId(new Date('2026-04-06T00:00:00Z')); // Monday Apr 6 2026
    expect(id).toMatch(/^\d{4}-W\d{2}$/);
  });

  it('returns the same week for Monday and Sunday of the same week', () => {
    const mon = getISOWeekId(new Date('2026-04-06T00:00:00Z')); // Mon
    const sun = getISOWeekId(new Date('2026-04-12T00:00:00Z')); // Sun of same week
    expect(mon).toBe(sun);
  });

  it('returns different weeks for different calendar weeks', () => {
    const w1 = getISOWeekId(new Date('2026-04-06T00:00:00Z'));
    const w2 = getISOWeekId(new Date('2026-04-13T00:00:00Z'));
    expect(w1).not.toBe(w2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isMondayUTC
// ─────────────────────────────────────────────────────────────────────────────

describe('isMondayUTC', () => {
  it('returns true for a Monday UTC date', () => {
    expect(isMondayUTC(new Date('2026-04-06T00:00:00Z'))).toBe(true);
  });

  it('returns false for a Tuesday UTC date', () => {
    expect(isMondayUTC(new Date('2026-04-07T00:00:00Z'))).toBe(false);
  });

  it('returns false for Sunday UTC date', () => {
    expect(isMondayUTC(new Date('2026-04-05T00:00:00Z'))).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// captureSnapshot
// ─────────────────────────────────────────────────────────────────────────────

describe('captureSnapshot', () => {
  const mockState = {
    vocabulary: {
      fsrsCards: {
        word_1: { card: { stability: 5 } },   // not mastered
        word_2: { card: { stability: 25 } },  // mastered
        word_3: { card: { stability: 30 } },  // mastered
      },
    },
    achievements: { unlocked: ['ach_1', 'ach_2', 'ach_3'] },
    player: { unlockedZones: ['zone_1', 'zone_2'] },
    difficulty: {
      historicalSessions: [
        { duration: 20 },
        { duration: 15 },
      ],
    },
  };

  it('captures vocabCount from fsrsCards', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.vocabCount).toBe(3);
  });

  it('captures vocabMastered from high-stability cards', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.vocabMastered).toBe(2); // stability >= 21
  });

  it('captures achievement count', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.achievements).toBe(3);
  });

  it('captures zonesUnlocked count', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.zonesUnlocked).toBe(2);
  });

  it('sums playtimeMinutes from historicalSessions', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.playtimeMinutes).toBe(35);
  });

  it('includes weekId and takenAt', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(snap.weekId).toBe('2026-W15');
    expect(snap.takenAt).toBeDefined();
  });

  it('derives cefrLevel from vocabCount', () => {
    const snap = captureSnapshot(mockState, '2026-W15');
    expect(['A1', 'A2', 'B1', 'B2']).toContain(snap.cefrLevel);
  });

  it('handles missing state slices gracefully', () => {
    const snap = captureSnapshot({}, '2026-W15');
    expect(snap.vocabCount).toBe(0);
    expect(snap.vocabMastered).toBe(0);
    expect(snap.achievements).toBe(0);
    expect(snap.zonesUnlocked).toBe(0);
    expect(snap.playtimeMinutes).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectProgressTrend
// ─────────────────────────────────────────────────────────────────────────────

describe('selectProgressTrend', () => {
  it('returns empty array for null input', () => {
    expect(selectProgressTrend(null)).toEqual([]);
    expect(selectProgressTrend([])).toEqual([]);
  });

  it('maps snapshot fields to chart-ready labels', () => {
    const snapshots = [
      { weekId: '2026-W14', vocabCount: 50, vocabMastered: 20, cefrLevel: 'A2', achievements: 5, playtimeMinutes: 120, zonesUnlocked: 3 },
      { weekId: '2026-W15', vocabCount: 75, vocabMastered: 40, cefrLevel: 'A2', achievements: 8, playtimeMinutes: 180, zonesUnlocked: 4 },
    ];
    const trend = selectProgressTrend(snapshots);
    expect(trend).toHaveLength(2);
    expect(trend[0].label).toBe('2026-W14');
    expect(trend[0].vocabCount).toBe(50);
    expect(trend[1].label).toBe('2026-W15');
    expect(trend[1].vocabMastered).toBe(40);
  });

  it('fills missing fields with defaults', () => {
    const snapshots = [{ weekId: '2026-W10' }];
    const trend = selectProgressTrend(snapshots);
    expect(trend[0].vocabCount).toBe(0);
    expect(trend[0].achievements).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// progressSnapshotMiddleware
// ─────────────────────────────────────────────────────────────────────────────

describe('progressSnapshotMiddleware', () => {
  let store;
  let next;
  let mw;

  beforeEach(() => {
    _resetSnapshotSession();
    store = {
      getState: () => ({
        vocabulary: { fsrsCards: {} },
        achievements: { unlocked: [] },
        player: { unlockedZones: [] },
        difficulty: { historicalSessions: [] },
      }),
      dispatch: vi.fn(),
    };
    next = vi.fn((a) => a);
    mw = progressSnapshotMiddleware(store)(next);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes all actions through to next', () => {
    const action = { type: 'player/loadPlayer' };
    mw(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does NOT dispatch on non-session-start actions', () => {
    mw({ type: 'player/addXP', payload: 100 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches progressSnapshot/captured on Monday session start', () => {
    // Mock to Monday UTC
    vi.setSystemTime(new Date('2026-04-06T08:00:00Z')); // Monday

    mw({ type: 'difficulty/startSession' });

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'progressSnapshot/captured' })
    );
  });

  it('does NOT dispatch on non-Monday session start', () => {
    vi.setSystemTime(new Date('2026-04-07T08:00:00Z')); // Tuesday

    mw({ type: 'difficulty/startSession' });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches at most once per session (even on Monday)', () => {
    vi.setSystemTime(new Date('2026-04-06T08:00:00Z'));

    mw({ type: 'difficulty/startSession' });
    mw({ type: 'difficulty/startSession' }); // second call

    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('snapshot payload includes required fields', () => {
    vi.setSystemTime(new Date('2026-04-06T08:00:00Z'));
    mw({ type: 'difficulty/startSession' });

    const call = store.dispatch.mock.calls[0][0];
    expect(call.payload).toHaveProperty('weekId');
    expect(call.payload).toHaveProperty('vocabCount');
    expect(call.payload).toHaveProperty('vocabMastered');
    expect(call.payload).toHaveProperty('cefrLevel');
    expect(call.payload).toHaveProperty('achievements');
    expect(call.payload).toHaveProperty('playtimeMinutes');
    expect(call.payload).toHaveProperty('zonesUnlocked');
    expect(call.payload).toHaveProperty('takenAt');
  });
});
