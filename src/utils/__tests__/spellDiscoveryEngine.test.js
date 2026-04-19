import { describe, it, expect } from 'vitest';
import {
  canDiscoverSpell,
  getDiscoverableSpells,
  selectDiscoverableSpells,
  AFFINITY_THRESHOLD,
  FORM_TO_GRAMMAR_LESSON,
} from '../spellDiscoveryEngine.js';

// ── Mock spell definitions ─────────────────────────────────────────────────────

const MOCK_SPELLS = [
  { id: 'spell_A_I',   rootId: 'root-A', element: 'fire',  form: 'I',   levelRequired: 1 },
  { id: 'spell_A_II',  rootId: 'root-A', element: 'fire',  form: 'II',  levelRequired: 2 },
  { id: 'spell_A_III', rootId: 'root-A', element: 'fire',  form: 'III', levelRequired: 3 },
  { id: 'spell_B_I',   rootId: 'root-B', element: 'water', form: 'I',   levelRequired: 1 },
  { id: 'spell_C_I',   rootId: 'root-C', element: 'light', form: 'I',   levelRequired: 5 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeState({
  discoveredRoots  = [],
  rootMastery      = {},
  affinityChoices  = [],
  completedLessons = [],
  level            = 1,
} = {}) {
  return {
    magic:   { discoveredRoots, rootMastery, affinity: { discoveryChoices: affinityChoices } },
    grammar: { completedLessons },
    player:  { level },
  };
}

/** Build the minimal state that satisfies all five conditions for spell_A_I. */
function fullStateForA_I() {
  return makeState({
    discoveredRoots:  ['root-A'],
    affinityChoices:  [{ element: 'fire' }],
    completedLessons: ['basic-verb-conjugation'],
  });
}

// ── AFFINITY_THRESHOLD ────────────────────────────────────────────────────────

describe('AFFINITY_THRESHOLD', () => {
  it('is at least 1', () => {
    expect(AFFINITY_THRESHOLD).toBeGreaterThanOrEqual(1);
  });
});

// ── FORM_TO_GRAMMAR_LESSON ────────────────────────────────────────────────────

describe('FORM_TO_GRAMMAR_LESSON', () => {
  it('maps Form I to basic-verb-conjugation', () => {
    expect(FORM_TO_GRAMMAR_LESSON['I']).toBe('basic-verb-conjugation');
  });

  it('maps Forms II-V to verb-forms-2-5', () => {
    for (const form of ['II', 'III', 'IV', 'V']) {
      expect(FORM_TO_GRAMMAR_LESSON[form]).toBe('verb-forms-2-5');
    }
  });

  it('maps Forms VI-X to verb-forms-6-10', () => {
    for (const form of ['VI', 'VII', 'VIII', 'IX', 'X']) {
      expect(FORM_TO_GRAMMAR_LESSON[form]).toBe('verb-forms-6-10');
    }
  });
});

// ── canDiscoverSpell ──────────────────────────────────────────────────────────

describe('canDiscoverSpell', () => {
  it('returns false for unknown spellId', () => {
    const state = fullStateForA_I();
    expect(canDiscoverSpell('nonexistent_spell', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns false when root is not in magic.discoveredRoots', () => {
    const state = makeState({
      discoveredRoots:  [],            // root-A not discovered
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation'],
    });
    expect(canDiscoverSpell('spell_A_I', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns false when required grammar lesson is not completed', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: [],            // lesson missing
    });
    expect(canDiscoverSpell('spell_A_I', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns false when elemental affinity count is below threshold', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      affinityChoices:  [],            // no fire choices
      completedLessons: ['basic-verb-conjugation'],
    });
    expect(canDiscoverSpell('spell_A_I', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns true when exactly AFFINITY_THRESHOLD fire choices present', () => {
    const choices = Array.from({ length: AFFINITY_THRESHOLD }, () => ({ element: 'fire' }));
    const state = makeState({
      discoveredRoots:  ['root-A'],
      affinityChoices:  choices,
      completedLessons: ['basic-verb-conjugation'],
    });
    expect(canDiscoverSpell('spell_A_I', state, MOCK_SPELLS)).toBe(true);
  });

  it('returns true for Form I when all five conditions are met', () => {
    expect(canDiscoverSpell('spell_A_I', fullStateForA_I(), MOCK_SPELLS)).toBe(true);
  });

  it('returns false for Form II when Form I is not yet unlocked (spell chain)', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      rootMastery:      { 'root-A': { formsUnlocked: [] } }, // Form I not in formsUnlocked
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation', 'verb-forms-2-5'],
      level:            2,
    });
    expect(canDiscoverSpell('spell_A_II', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns true for Form II when Form I is unlocked', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      rootMastery:      { 'root-A': { formsUnlocked: ['I'] } },
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation', 'verb-forms-2-5'],
      level:            2,
    });
    expect(canDiscoverSpell('spell_A_II', state, MOCK_SPELLS)).toBe(true);
  });

  it('returns false for Form III when only Form I is unlocked (II missing)', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      rootMastery:      { 'root-A': { formsUnlocked: ['I'] } }, // II not unlocked
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation', 'verb-forms-2-5'],
      level:            3,
    });
    expect(canDiscoverSpell('spell_A_III', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns false when player level is below levelRequired', () => {
    const state = makeState({
      discoveredRoots:  ['root-C'],
      affinityChoices:  [{ element: 'light' }],
      completedLessons: ['basic-verb-conjugation'],
      level:            4,             // needs 5
    });
    expect(canDiscoverSpell('spell_C_I', state, MOCK_SPELLS)).toBe(false);
  });

  it('returns true when player level exactly equals levelRequired', () => {
    const state = makeState({
      discoveredRoots:  ['root-C'],
      affinityChoices:  [{ element: 'light' }],
      completedLessons: ['basic-verb-conjugation'],
      level:            5,             // exactly 5
    });
    expect(canDiscoverSpell('spell_C_I', state, MOCK_SPELLS)).toBe(true);
  });

  it('returns false for completely empty playerState', () => {
    expect(canDiscoverSpell('spell_A_I', {}, MOCK_SPELLS)).toBe(false);
  });

  it('counts only matching-element affinity choices', () => {
    // Has water choices but spell needs fire — should fail affinity check
    const state = makeState({
      discoveredRoots:  ['root-A'],
      affinityChoices:  [{ element: 'water' }, { element: 'water' }],
      completedLessons: ['basic-verb-conjugation'],
    });
    expect(canDiscoverSpell('spell_A_I', state, MOCK_SPELLS)).toBe(false);
  });
});

// ── getDiscoverableSpells ─────────────────────────────────────────────────────

describe('getDiscoverableSpells', () => {
  it('returns empty array when no spells are defined', () => {
    expect(getDiscoverableSpells(fullStateForA_I(), [])).toEqual([]);
  });

  it('returns empty array when no roots are discovered', () => {
    const state = makeState({
      discoveredRoots:  [],
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation'],
    });
    expect(getDiscoverableSpells(state, MOCK_SPELLS)).toEqual([]);
  });

  it('returns qualifying spell definitions when conditions are met', () => {
    const state = fullStateForA_I();
    const result = getDiscoverableSpells(state, MOCK_SPELLS);
    expect(result.map((s) => s.id)).toContain('spell_A_I');
  });

  it('excludes spells whose root+form is already in rootMastery.formsUnlocked', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      rootMastery:      { 'root-A': { formsUnlocked: ['I'] } }, // Form I already unlocked
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation', 'verb-forms-2-5'],
      level:            2,
    });
    const result = getDiscoverableSpells(state, MOCK_SPELLS);
    const ids = result.map((s) => s.id);
    expect(ids).not.toContain('spell_A_I');  // already unlocked
    expect(ids).toContain('spell_A_II');     // Form II now available
  });

  it('returns multiple qualifying spells across different roots', () => {
    const state = makeState({
      discoveredRoots:  ['root-A', 'root-B'],
      affinityChoices:  [{ element: 'fire' }, { element: 'water' }],
      completedLessons: ['basic-verb-conjugation'],
    });
    const result = getDiscoverableSpells(state, MOCK_SPELLS);
    const ids = result.map((s) => s.id);
    expect(ids).toContain('spell_A_I');
    expect(ids).toContain('spell_B_I');
  });

  it('does not include Form II when Form I prerequisite is not unlocked', () => {
    const state = makeState({
      discoveredRoots:  ['root-A'],
      affinityChoices:  [{ element: 'fire' }],
      completedLessons: ['basic-verb-conjugation', 'verb-forms-2-5'],
      level:            2,
    });
    const result = getDiscoverableSpells(state, MOCK_SPELLS);
    const ids = result.map((s) => s.id);
    expect(ids).not.toContain('spell_A_II'); // Form I not unlocked yet
  });
});

// ── selectDiscoverableSpells ──────────────────────────────────────────────────

describe('selectDiscoverableSpells', () => {
  it('returns an array (may be empty) given a minimal Redux state', () => {
    const state = {
      magic:   { discoveredRoots: [], rootMastery: {}, affinity: { discoveryChoices: [] } },
      grammar: { completedLessons: [] },
      player:  { level: 1 },
    };
    const result = selectDiscoverableSpells(state);
    expect(Array.isArray(result)).toBe(true);
  });

  it('is memoized — returns same reference when state is unchanged', () => {
    const state = {
      magic:   { discoveredRoots: [], rootMastery: {}, affinity: { discoveryChoices: [] } },
      grammar: { completedLessons: [] },
      player:  { level: 1 },
    };
    const first  = selectDiscoverableSpells(state);
    const second = selectDiscoverableSpells(state);
    expect(first).toBe(second);
  });
});
