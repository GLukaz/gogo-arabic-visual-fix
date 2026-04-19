import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  companionXpMiddleware,
  COMPANION_XP_CONFIG,
  calcCompanionBattleXp,
} from '../companionXpMiddleware.js';
import {
  calculateCompanionLevel,
  getCompanionAbilities,
  COMPANION_ABILITIES,
  MAX_COMPANION_LEVEL,
  COMPANION_ABILITY_LEVELS,
} from '../../../data/companionAbilities.js';
import companionReducer, {
  addCompanionXP,
  recruitCompanion,
} from '../../slices/companionSlice.js';

// Mock companionSlice so we can inspect dispatched actions
vi.mock('../../slices/companionSlice.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    addCompanionXP: vi.fn(({ companionId, xp }) => ({
      type: 'companions/addCompanionXP',
      payload: { companionId, xp },
    })),
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// companionXpMiddleware tests
// ─────────────────────────────────────────────────────────────────────────────

describe('companionXpMiddleware', () => {
  let store;
  let next;
  let middleware;

  const makeStore = (battleCompanionId = 'companion_amira') => ({
    getState: vi.fn(() => ({
      companions: {
        activeParty: { battle: battleCompanionId, exploration: null },
      },
    })),
    dispatch: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    store = makeStore();
    next = vi.fn((action) => action);
    middleware = companionXpMiddleware(store)(next);
  });

  it('passes all actions through to next', () => {
    const action = { type: 'player/addXP', payload: 100 };
    middleware(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('does not dispatch for unrelated actions', () => {
    middleware({ type: 'player/addXP', payload: 100 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches addCompanionXP on battle/endBattle with active companion', () => {
    middleware({
      type: 'battle/endBattle',
      payload: { victory: true, rewards: { xp: 50 } },
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'companions/addCompanionXP',
        payload: expect.objectContaining({ companionId: 'companion_amira' }),
      })
    );
  });

  it('does not dispatch when no companion is in the battle slot', () => {
    store = makeStore(null);
    middleware = companionXpMiddleware(store)(next);
    middleware({
      type: 'battle/endBattle',
      payload: { victory: true, rewards: { xp: 50 } },
    });
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('awards more XP on victory than on defeat', () => {
    const victoryXp = calcCompanionBattleXp(true, 50);
    const defeatXp = calcCompanionBattleXp(false, 50);
    expect(victoryXp).toBeGreaterThan(defeatXp);
  });

  it('awards XP even on defeat (participation XP)', () => {
    middleware({
      type: 'battle/endBattle',
      payload: { victory: false, rewards: { xp: 0 } },
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({ xp: expect.any(Number) }),
      })
    );
    const dispatched = store.dispatch.mock.calls[0][0];
    expect(dispatched.payload.xp).toBeGreaterThan(0);
  });

  it('scales XP with battle reward XP', () => {
    const lowXp = calcCompanionBattleXp(true, 0);
    const highXp = calcCompanionBattleXp(true, 200);
    expect(highXp).toBeGreaterThan(lowXp);
  });

  it('caps XP at MAX_XP_PER_BATTLE', () => {
    const xp = calcCompanionBattleXp(true, 99999);
    expect(xp).toBeLessThanOrEqual(COMPANION_XP_CONFIG.MAX_XP_PER_BATTLE);
  });

  it('handles missing rewards payload gracefully', () => {
    expect(() =>
      middleware({ type: 'battle/endBattle', payload: { victory: true } })
    ).not.toThrow();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('handles missing payload gracefully', () => {
    expect(() =>
      middleware({ type: 'battle/endBattle', payload: null })
    ).not.toThrow();
  });

  it('calcCompanionBattleXp returns at least BASE_XP_PER_BATTLE for any defeat', () => {
    expect(calcCompanionBattleXp(false, 0)).toBe(
      COMPANION_XP_CONFIG.BASE_XP_PER_BATTLE
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calculateCompanionLevel tests
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateCompanionLevel', () => {
  it('returns level 1 at 0 XP', () => {
    expect(calculateCompanionLevel(0)).toBe(1);
  });

  it('returns level 1 below the first threshold', () => {
    expect(calculateCompanionLevel(99)).toBe(1);
  });

  it('returns level 2 at 200 XP (2 * 100)', () => {
    expect(calculateCompanionLevel(200)).toBe(2);
  });

  it('returns level 5 at 500 XP (5 * 100)', () => {
    expect(calculateCompanionLevel(500)).toBe(5);
  });

  it('returns level 10 at 1000 XP', () => {
    expect(calculateCompanionLevel(1000)).toBe(10);
  });

  it('caps at MAX_COMPANION_LEVEL (20)', () => {
    expect(calculateCompanionLevel(99999)).toBe(MAX_COMPANION_LEVEL);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCompanionAbilities tests
// ─────────────────────────────────────────────────────────────────────────────

describe('getCompanionAbilities', () => {
  it('returns empty array for unknown companion', () => {
    expect(getCompanionAbilities('companion_unknown', 10)).toEqual([]);
  });

  it('returns no abilities at level 1 (below first threshold)', () => {
    const abilities = getCompanionAbilities('companion_amira', 1);
    expect(abilities).toHaveLength(0);
  });

  it('returns 1 ability at level 5', () => {
    const abilities = getCompanionAbilities('companion_amira', 5);
    expect(abilities).toHaveLength(1);
    expect(abilities[0].unlocksAtLevel).toBe(5);
  });

  it('returns 2 abilities at level 10', () => {
    const abilities = getCompanionAbilities('companion_amira', 10);
    expect(abilities).toHaveLength(2);
  });

  it('returns 3 abilities at level 15', () => {
    const abilities = getCompanionAbilities('companion_amira', 15);
    expect(abilities).toHaveLength(3);
  });

  it('returns 3 abilities at level 20 (all unlocked)', () => {
    const abilities = getCompanionAbilities('companion_amira', 20);
    expect(abilities).toHaveLength(3);
  });

  it('each companion has exactly 3 abilities defined', () => {
    Object.keys(COMPANION_ABILITIES).forEach((companionId) => {
      expect(COMPANION_ABILITIES[companionId]).toHaveLength(3);
    });
  });

  it('all 12 companions have abilities defined', () => {
    const companionIds = [
      'companion_amira', 'companion_khalid', 'companion_zahra', 'companion_omar',
      'companion_layla', 'companion_hassan', 'companion_fatima', 'companion_ali',
      'companion_maryam', 'companion_samir', 'companion_nadia', 'companion_tariq',
    ];
    companionIds.forEach((id) => {
      expect(COMPANION_ABILITIES[id]).toBeDefined();
      expect(COMPANION_ABILITIES[id]).toHaveLength(3);
    });
  });

  it('all ability unlock levels are from [5, 10, 15]', () => {
    Object.values(COMPANION_ABILITIES).forEach((abilities) => {
      abilities.forEach((ability) => {
        expect(COMPANION_ABILITY_LEVELS).toContain(ability.unlocksAtLevel);
      });
    });
  });

  it('all abilities have required fields (id, name, effect)', () => {
    Object.values(COMPANION_ABILITIES).forEach((abilities) => {
      abilities.forEach((ability) => {
        expect(ability.id).toBeTruthy();
        expect(ability.name).toBeTruthy();
        expect(ability.effect).toBeTruthy();
        expect(typeof ability.effect).toBe('object');
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// addCompanionXP reducer tests (integration with companionSlice)
// ─────────────────────────────────────────────────────────────────────────────

describe('addCompanionXP reducer', () => {
  // Use the real reducer (not mocked) by reimporting — but since companionSlice
  // is mocked at module scope, we call the real reducer directly via the
  // original implementation. Re-import fresh without the vi.mock override.
  // Instead, we test via snapshot of the real reducer's exported function.

  // We need a fresh companionReducer unaffected by the mock above.
  // Since vi.mock hoists and wraps the whole module, we re-import the
  // actual reducer via the `actual` captured in the mock factory.
  let realReducer;
  let initialState;

  beforeEach(async () => {
    // Import actual (unmocked) module
    const mod = await vi.importActual('../../slices/companionSlice.js');
    realReducer = mod.default;
    initialState = realReducer(undefined, { type: '@@INIT' });
  });

  it('awards XP to a recruited companion', () => {
    let state = realReducer(initialState, { type: 'companions/recruitCompanion', payload: 'companion_amira' });
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_amira', xp: 100 } });
    expect(state.companions.companion_amira.xp).toBe(100);
  });

  it('does not award XP to unrecruited companions', () => {
    const state = realReducer(initialState, {
      type: 'companions/addCompanionXP',
      payload: { companionId: 'companion_amira', xp: 500 },
    });
    expect(state.companions.companion_amira.xp).toBe(0);
  });

  it('auto-levels up when XP threshold reached', () => {
    let state = realReducer(initialState, { type: 'companions/recruitCompanion', payload: 'companion_amira' });
    // 500 XP → level 5
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_amira', xp: 500 } });
    expect(state.companions.companion_amira.level).toBe(5);
  });

  it('accumulates XP across multiple awards', () => {
    let state = realReducer(initialState, { type: 'companions/recruitCompanion', payload: 'companion_khalid' });
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_khalid', xp: 300 } });
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_khalid', xp: 200 } });
    expect(state.companions.companion_khalid.xp).toBe(500);
    expect(state.companions.companion_khalid.level).toBe(5);
  });

  it('does not allow negative XP additions', () => {
    let state = realReducer(initialState, { type: 'companions/recruitCompanion', payload: 'companion_amira' });
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_amira', xp: -100 } });
    expect(state.companions.companion_amira.xp).toBe(0);
  });

  it('caps level at 20', () => {
    let state = realReducer(initialState, { type: 'companions/recruitCompanion', payload: 'companion_amira' });
    state = realReducer(state, { type: 'companions/addCompanionXP', payload: { companionId: 'companion_amira', xp: 99999 } });
    expect(state.companions.companion_amira.level).toBe(20);
  });
});
