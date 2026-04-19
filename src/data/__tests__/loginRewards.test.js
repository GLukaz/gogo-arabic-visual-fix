/**
 * loginRewards.test.js
 * GROW-019 — Daily login rewards system
 */
import { describe, it, expect } from 'vitest';
import { LOGIN_REWARDS, getRewardForDay, getNextMilestoneDay } from '../loginRewards.js';
import reducer, {
  processLoginReward,
  resetLoginStreak,
  dismissLoginReward,
  selectLoginStreak,
  selectTotalLogins,
  selectPendingLoginReward,
  selectLastLoginDate,
} from '../../store/slices/playerSlice.js';

const initialState = reducer(undefined, { type: '@@INIT' });

// ── Data tests ──────────────────────────────────────────────────────────────

describe('LOGIN_REWARDS dataset', () => {
  it('has exactly 30 entries', () => {
    expect(LOGIN_REWARDS).toHaveLength(30);
  });

  it('days are numbered 1-30 consecutively', () => {
    LOGIN_REWARDS.forEach((r, i) => {
      expect(r.day).toBe(i + 1);
    });
  });

  it('milestone days are 7, 14, 21, 30', () => {
    const milestones = LOGIN_REWARDS.filter((r) => r.isMilestone).map((r) => r.day);
    expect(milestones).toEqual([7, 14, 21, 30]);
  });

  it('milestone days have rare items', () => {
    const milestones = LOGIN_REWARDS.filter((r) => r.isMilestone);
    for (const m of milestones) {
      expect(m.item).toBeTruthy();
    }
  });

  it('all rewards have xp and dirhams > 0', () => {
    for (const r of LOGIN_REWARDS) {
      expect(r.xp).toBeGreaterThan(0);
      expect(r.dirhams).toBeGreaterThan(0);
    }
  });
});

describe('getRewardForDay', () => {
  it('returns day 1 reward for streak 1', () => {
    expect(getRewardForDay(1).day).toBe(1);
  });

  it('returns day 7 reward for streak 7', () => {
    expect(getRewardForDay(7).day).toBe(7);
    expect(getRewardForDay(7).isMilestone).toBe(true);
  });

  it('cycles back: day 31 returns day 1 reward', () => {
    expect(getRewardForDay(31).day).toBe(1);
  });

  it('cycles back: day 37 returns day 7 reward (milestone)', () => {
    expect(getRewardForDay(37).day).toBe(7);
  });

  it('handles 0/null/undefined gracefully', () => {
    expect(getRewardForDay(0)).toBeDefined();
    expect(getRewardForDay(null)).toBeDefined();
  });
});

describe('getNextMilestoneDay', () => {
  it('from streak 1, next milestone is day 7', () => {
    expect(getNextMilestoneDay(1)).toBe(7);
  });

  it('from streak 5, next milestone is day 7', () => {
    expect(getNextMilestoneDay(5)).toBe(7);
  });

  it('from streak 7 (just hit milestone), next is day 14', () => {
    expect(getNextMilestoneDay(7)).toBe(14);
  });

  it('from streak 30 (monthly), next wraps to day 37 (=7 in next cycle)', () => {
    expect(getNextMilestoneDay(30)).toBe(37);
  });
});

// ── Reducer tests ───────────────────────────────────────────────────────────

describe('playerSlice — login reward reducers', () => {
  const reward = { day: 1, xp: 25, dirhams: 10, item: null };

  it('processLoginReward increments totalLogins', () => {
    const state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    expect(selectTotalLogins({ player: state })).toBe(1);
  });

  it('processLoginReward increments loginStreak', () => {
    const state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    expect(selectLoginStreak({ player: state })).toBe(1);
  });

  it('processLoginReward sets lastLoginDate', () => {
    const state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    expect(selectLastLoginDate({ player: state })).toBe('2026-04-07');
  });

  it('processLoginReward sets pendingLoginReward', () => {
    const state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    expect(selectPendingLoginReward({ player: state })).toEqual(reward);
  });

  it('processLoginReward applies XP immediately', () => {
    const state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    expect(state.xp).toBe(25);
  });

  it('resetLoginStreak resets streak to 1', () => {
    let state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-01', reward }));
    state = reducer(state, processLoginReward({ todayUTC: '2026-04-02', reward }));
    state = reducer(state, resetLoginStreak({ todayUTC: '2026-04-07', reward }));
    expect(selectLoginStreak({ player: state })).toBe(1);
  });

  it('dismissLoginReward clears pendingLoginReward', () => {
    let state = reducer(initialState, processLoginReward({ todayUTC: '2026-04-07', reward }));
    state = reducer(state, dismissLoginReward());
    expect(selectPendingLoginReward({ player: state })).toBeNull();
  });
});
