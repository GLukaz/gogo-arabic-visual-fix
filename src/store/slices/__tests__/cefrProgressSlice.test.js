/**
 * cefrProgressSlice tests — snapshot, no-regression, and idempotency
 *
 * Tests:
 *  1. recordCefrSnapshot with A1 appends to empty levelHistory
 *  2. selectCefrHistory returns non-empty after setCefrLevel + recordCefrSnapshot
 *  3. recordCefrSnapshot with A1 after A2 in history does NOT append (regression blocked)
 *  4. recordCefrSnapshot with A2 after A2 (same level, new day) DOES append (equal allowed)
 *  5. recordCefrSnapshot called twice same day records only once (idempotent)
 *  6. resetCefrProgress clears lastSnapshotDate to null
 *  7. recordCefrSnapshot with B1 after A2 appends (forward movement allowed)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import cefrProgressReducer, {
  recordCefrSnapshot,
  setCefrLevel,
  resetCefrProgress,
  selectCefrHistory,
  selectCefrLevel,
} from '../cefrProgressSlice.js';

// Helper: wrap state as if it were the Redux store root for selectors
const wrap = (sliceState) => ({ cefrProgress: sliceState });

describe('cefrProgressSlice — recordCefrSnapshot', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Default fake date: 2026-01-15
    vi.setSystemTime(new Date('2026-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Test 1 ────────────────────────────────────────────────────────────────
  it('appends A1 snapshot to empty levelHistory', () => {
    const initial = cefrProgressReducer(undefined, { type: '@@INIT' });
    const next = cefrProgressReducer(initial, recordCefrSnapshot({ level: 'A1' }));

    expect(next.levelHistory).toHaveLength(1);
    expect(next.levelHistory[0].level).toBe('A1');
    expect(next.levelHistory[0].source).toBe('session_snapshot');
    expect(next.lastSnapshotDate).toBe('2026-01-15');
  });

  // ── Test 2 ────────────────────────────────────────────────────────────────
  it('selectCefrHistory returns non-empty after setCefrLevel + recordCefrSnapshot', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });
    state = cefrProgressReducer(state, setCefrLevel({ level: 'A1', source: 'placement' }));

    // Move time forward one day so snapshot guard doesn't block
    vi.setSystemTime(new Date('2026-01-16T10:00:00Z'));
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));

    const history = selectCefrHistory(wrap(state));
    expect(history.length).toBeGreaterThan(0);
  });

  // ── Test 3 ────────────────────────────────────────────────────────────────
  it('does NOT append when new level is lower than last history entry (regression blocked)', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });

    // First snapshot: A2
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A2' }));
    expect(state.levelHistory).toHaveLength(1);

    // Advance to next day to bypass date guard
    vi.setSystemTime(new Date('2026-01-16T10:00:00Z'));

    // Attempt to record A1 (lower) — must be blocked
    const stateAfter = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));
    expect(stateAfter.levelHistory).toHaveLength(1);
  });

  // ── Test 4 ────────────────────────────────────────────────────────────────
  it('DOES append when same level on new day (equal rank is allowed)', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });

    // First snapshot: A2 on day 1
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A2' }));
    expect(state.levelHistory).toHaveLength(1);

    // Advance to next day
    vi.setSystemTime(new Date('2026-01-16T10:00:00Z'));

    // Same level A2 on new day — should append
    const stateAfter = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A2' }));
    expect(stateAfter.levelHistory).toHaveLength(2);
    expect(stateAfter.levelHistory[1].level).toBe('A2');
  });

  // ── Test 5 ────────────────────────────────────────────────────────────────
  it('is idempotent — calling twice same day records only once', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });

    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));

    expect(state.levelHistory).toHaveLength(1);
    expect(state.lastSnapshotDate).toBe('2026-01-15');
  });

  // ── Test 6 ────────────────────────────────────────────────────────────────
  it('resetCefrProgress clears lastSnapshotDate to null', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A1' }));
    expect(state.lastSnapshotDate).toBe('2026-01-15');

    const reset = cefrProgressReducer(state, resetCefrProgress());
    expect(reset.lastSnapshotDate).toBeNull();
    expect(reset.levelHistory).toHaveLength(0);
    expect(reset.currentLevel).toBeNull();
  });

  // ── Test 7 ────────────────────────────────────────────────────────────────
  it('appends B1 after A2 (forward movement allowed)', () => {
    let state = cefrProgressReducer(undefined, { type: '@@INIT' });

    // First snapshot: A2
    state = cefrProgressReducer(state, recordCefrSnapshot({ level: 'A2' }));
    expect(state.levelHistory).toHaveLength(1);

    // Advance to next day
    vi.setSystemTime(new Date('2026-01-16T10:00:00Z'));

    // B1 is forward from A2 — should append
    const stateAfter = cefrProgressReducer(state, recordCefrSnapshot({ level: 'B1' }));
    expect(stateAfter.levelHistory).toHaveLength(2);
    expect(stateAfter.levelHistory[1].level).toBe('B1');
    expect(stateAfter.levelHistory[1].source).toBe('session_snapshot');
  });
});
