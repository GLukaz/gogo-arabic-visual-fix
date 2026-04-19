/**
 * companionDialogue.test.js
 * FEAT-036: Companion dialogue progression — 5 relationship tiers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DIALOGUE_TIERS,
  TIER_ORDER,
  COMPANION_DIALOGUE_TIERS,
  getDialogueTier,
  getCompanionDialogue,
  selectActiveCompanionGreeting,
  revealCompanionBackstory,
} from '../companionDialogue.js';

// ── Module-level mock of codexSlice so no Redux store is needed ──
vi.mock('../../store/slices/codexSlice.js', () => ({
  unlockEntry: vi.fn((id) => ({ type: 'codex/unlockEntry', payload: id })),
}));

import { unlockEntry } from '../../store/slices/codexSlice.js';

const COMPANION_IDS = [
  'companion_amira',
  'companion_khalid',
  'companion_zahra',
  'companion_omar',
  'companion_layla',
  'companion_hassan',
  'companion_fatima',
  'companion_ali',
  'companion_maryam',
  'companion_samir',
  'companion_nadia',
  'companion_tariq',
];

// ────────────────────────────────────────────────
// DIALOGUE_TIERS & TIER_ORDER constants
// ────────────────────────────────────────────────
describe('DIALOGUE_TIERS', () => {
  it('exports exactly 5 tiers', () => {
    expect(Object.keys(DIALOGUE_TIERS)).toHaveLength(5);
  });

  it('has the correct tier names', () => {
    expect(Object.keys(DIALOGUE_TIERS)).toEqual(
      expect.arrayContaining(['stranger', 'acquaintance', 'friend', 'close', 'bonded'])
    );
  });

  it('TIER_ORDER has 5 items in ascending relationship order', () => {
    expect(TIER_ORDER).toHaveLength(5);
    expect(TIER_ORDER[0]).toBe('stranger');
    expect(TIER_ORDER[4]).toBe('bonded');
  });
});

// ────────────────────────────────────────────────
// getDialogueTier
// ────────────────────────────────────────────────
describe('getDialogueTier', () => {
  it.each([
    [0,   'stranger'],
    [10,  'stranger'],
    [19,  'stranger'],
    [20,  'acquaintance'],
    [25,  'acquaintance'],
    [39,  'acquaintance'],
    [40,  'friend'],
    [50,  'friend'],
    [59,  'friend'],
    [60,  'close'],
    [70,  'close'],
    [79,  'close'],
    [80,  'bonded'],
    [90,  'bonded'],
    [100, 'bonded'],
  ])('level %i → %s', (level, expected) => {
    expect(getDialogueTier(level)).toBe(expected);
  });

  it('clamps below 0 to stranger', () => {
    expect(getDialogueTier(-5)).toBe('stranger');
  });

  it('clamps above 100 to bonded', () => {
    expect(getDialogueTier(150)).toBe('bonded');
  });

  it('handles null/undefined as 0 → stranger', () => {
    expect(getDialogueTier(null)).toBe('stranger');
    expect(getDialogueTier(undefined)).toBe('stranger');
  });
});

// ────────────────────────────────────────────────
// COMPANION_DIALOGUE_TIERS data completeness
// ────────────────────────────────────────────────
describe('COMPANION_DIALOGUE_TIERS — completeness', () => {
  it('has data for all 12 companions', () => {
    for (const id of COMPANION_IDS) {
      expect(COMPANION_DIALOGUE_TIERS[id], `missing ${id}`).toBeDefined();
    }
  });

  it.each(COMPANION_IDS)('%s has all 5 tiers', (id) => {
    const data = COMPANION_DIALOGUE_TIERS[id];
    for (const tier of TIER_ORDER) {
      expect(data[tier], `${id} missing tier ${tier}`).toBeDefined();
    }
  });

  it.each(COMPANION_IDS)('%s — each tier has greeting, idle[3+], hint, backstoryReveal', (id) => {
    const data = COMPANION_DIALOGUE_TIERS[id];
    for (const tier of TIER_ORDER) {
      const entry = data[tier];
      // greeting
      expect(entry.greeting?.arabic, `${id}/${tier}: greeting.arabic`).toBeTruthy();
      expect(entry.greeting?.english, `${id}/${tier}: greeting.english`).toBeTruthy();
      // idle
      expect(Array.isArray(entry.idle), `${id}/${tier}: idle is array`).toBe(true);
      expect(entry.idle.length, `${id}/${tier}: idle has 3+`).toBeGreaterThanOrEqual(3);
      for (const line of entry.idle) {
        expect(line.arabic, `${id}/${tier}: idle arabic`).toBeTruthy();
        expect(line.english, `${id}/${tier}: idle english`).toBeTruthy();
      }
      // hint
      expect(entry.hint?.arabic, `${id}/${tier}: hint.arabic`).toBeTruthy();
      expect(entry.hint?.english, `${id}/${tier}: hint.english`).toBeTruthy();
      // backstoryReveal
      expect(entry.backstoryReveal?.arabic, `${id}/${tier}: backstoryReveal.arabic`).toBeTruthy();
      expect(entry.backstoryReveal?.english, `${id}/${tier}: backstoryReveal.english`).toBeTruthy();
      expect(entry.backstoryReveal?.codexEntryId, `${id}/${tier}: backstoryReveal.codexEntryId`).toBeTruthy();
    }
  });

  it.each(COMPANION_IDS)('%s — all 5 codexEntryIds are unique', (id) => {
    const data = COMPANION_DIALOGUE_TIERS[id];
    const ids = TIER_ORDER.map((tier) => data[tier].backstoryReveal.codexEntryId);
    const unique = new Set(ids);
    expect(unique.size).toBe(5);
  });

  it('all 60 codexEntryIds across all companions are globally unique', () => {
    const allIds = [];
    for (const id of COMPANION_IDS) {
      for (const tier of TIER_ORDER) {
        allIds.push(COMPANION_DIALOGUE_TIERS[id][tier].backstoryReveal.codexEntryId);
      }
    }
    expect(new Set(allIds).size).toBe(60);
  });
});

// ────────────────────────────────────────────────
// getCompanionDialogue
// ────────────────────────────────────────────────
describe('getCompanionDialogue', () => {
  it('returns stranger tier at relationship 0', () => {
    const result = getCompanionDialogue('companion_amira', 0);
    expect(result).not.toBeNull();
    expect(result.greeting).toBeDefined();
  });

  it('returns acquaintance tier at relationship 20', () => {
    const result = getCompanionDialogue('companion_khalid', 20);
    expect(result?.greeting?.arabic).toBeTruthy();
    // acquaintance greeting differs from stranger
    const stranger = getCompanionDialogue('companion_khalid', 0);
    expect(result?.greeting?.arabic).not.toBe(stranger?.greeting?.arabic);
  });

  it('returns friend tier at relationship 40', () => {
    const result = getCompanionDialogue('companion_zahra', 40);
    expect(getDialogueTier(40)).toBe('friend');
    expect(result).toBeDefined();
    expect(result?.hint?.english).toBeTruthy();
  });

  it('returns close tier at relationship 60', () => {
    expect(getCompanionDialogue('companion_omar', 60)).toBeDefined();
    expect(getDialogueTier(60)).toBe('close');
  });

  it('returns bonded tier at relationship 80', () => {
    const result = getCompanionDialogue('companion_fatima', 80);
    expect(result).toBeDefined();
    expect(result?.backstoryReveal?.codexEntryId).toContain('lore_5');
  });

  it('returns bonded tier at relationship 100', () => {
    const result = getCompanionDialogue('companion_hassan', 100);
    expect(result).toBeDefined();
    expect(getDialogueTier(100)).toBe('bonded');
  });

  it('returns null for unknown companionId', () => {
    expect(getCompanionDialogue('companion_unknown', 50)).toBeNull();
  });

  it('returns null for falsy companionId', () => {
    expect(getCompanionDialogue(null, 50)).toBeNull();
    expect(getCompanionDialogue(undefined, 50)).toBeNull();
  });
});

// ────────────────────────────────────────────────
// selectActiveCompanionGreeting
// ────────────────────────────────────────────────
describe('selectActiveCompanionGreeting', () => {
  it('returns null when no active companion', () => {
    const state = {
      companions: {
        activeParty: { exploration: null, battle: null },
        companions: {},
      },
    };
    expect(selectActiveCompanionGreeting(state)).toBeNull();
  });

  it('returns greeting for active exploration companion', () => {
    const state = {
      companions: {
        activeParty: { exploration: 'companion_amira', battle: null },
        companions: {
          companion_amira: { relationship: 0, recruited: true },
        },
      },
    };
    const result = selectActiveCompanionGreeting(state);
    expect(result).not.toBeNull();
    expect(result.arabic).toBeTruthy();
    expect(result.english).toBeTruthy();
  });

  it('falls back to battle slot when exploration is null', () => {
    const state = {
      companions: {
        activeParty: { exploration: null, battle: 'companion_khalid' },
        companions: {
          companion_khalid: { relationship: 50, recruited: true },
        },
      },
    };
    const result = selectActiveCompanionGreeting(state);
    expect(result).not.toBeNull();
    expect(result.arabic).toBeTruthy();
  });

  it('returns correct tier greeting based on relationship level', () => {
    const stateStranger = {
      companions: {
        activeParty: { exploration: 'companion_zahra', battle: null },
        companions: { companion_zahra: { relationship: 5 } },
      },
    };
    const stateBonded = {
      companions: {
        activeParty: { exploration: 'companion_zahra', battle: null },
        companions: { companion_zahra: { relationship: 90 } },
      },
    };
    const strangerGreeting = selectActiveCompanionGreeting(stateStranger);
    const bondedGreeting = selectActiveCompanionGreeting(stateBonded);
    expect(strangerGreeting.arabic).not.toBe(bondedGreeting.arabic);
  });

  it('handles missing companions state gracefully', () => {
    const state = { companions: { activeParty: { exploration: null, battle: null }, companions: {} } };
    expect(selectActiveCompanionGreeting(state)).toBeNull();
  });
});

// ────────────────────────────────────────────────
// revealCompanionBackstory — codex unlock dispatch
// ────────────────────────────────────────────────
describe('revealCompanionBackstory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches unlockEntry with the correct codexEntryId', () => {
    const dispatch = vi.fn();
    const result = revealCompanionBackstory('companion_amira', 0)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(unlockEntry).toHaveBeenCalledWith('companion_amira_lore_1');
    expect(result).toBeDefined();
    expect(result.backstoryReveal.codexEntryId).toBe('companion_amira_lore_1');
  });

  it('dispatches the bonded tier codexEntryId for relationship 80+', () => {
    const dispatch = vi.fn();
    revealCompanionBackstory('companion_khalid', 85)(dispatch);
    expect(unlockEntry).toHaveBeenCalledWith('companion_khalid_lore_5');
  });

  it('dispatches friend tier codexEntryId for relationship 40-59', () => {
    const dispatch = vi.fn();
    revealCompanionBackstory('companion_hassan', 45)(dispatch);
    expect(unlockEntry).toHaveBeenCalledWith('companion_hassan_lore_3');
  });

  it('does not dispatch for unknown companion', () => {
    const dispatch = vi.fn();
    const result = revealCompanionBackstory('companion_unknown', 50)(dispatch);
    expect(dispatch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('returns the dialogue object', () => {
    const dispatch = vi.fn();
    const result = revealCompanionBackstory('companion_fatima', 60)(dispatch);
    expect(result).not.toBeNull();
    expect(result.greeting).toBeDefined();
    expect(result.idle.length).toBeGreaterThanOrEqual(3);
    expect(result.hint).toBeDefined();
    expect(result.backstoryReveal).toBeDefined();
  });

  it('dispatches once per call — no duplicate unlocks', () => {
    const dispatch = vi.fn();
    revealCompanionBackstory('companion_tariq', 70)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
