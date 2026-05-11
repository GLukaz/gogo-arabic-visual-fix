import { describe, it, expect, beforeEach } from 'vitest';
import reducer, {
  discoverRoot,
  recordRootUse,
  recordAffinityChoice,
  equipSpell,
  unequipSpell,
  recordCombo,
  clearBattleState,
  setLastCastTimestamp,
  selectDiscoveredRoots,
  selectRootMastery,
  selectAllRootMastery,
  selectAffinity,
  selectEquippedSpells,
  selectAffinityBonuses,
} from '../magicSlice.js';

describe('magicSlice', () => {
  let initialState;

  beforeEach(() => {
    // Get fresh initial state
    initialState = reducer(undefined, { type: '@@INIT' });
  });

  describe('discoverRoot', () => {
    it('adds root to discoveredRoots array', () => {
      const state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      expect(state.discoveredRoots).toContain('ك-ت-ب');
    });

    it('initializes rootMastery entry with level 1, xp 0, formsUnlocked: ["I"]', () => {
      const state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      expect(state.rootMastery['ك-ت-ب']).toEqual({
        timesUsed: 0,
        formsUnlocked: ['I'],
        xp: 0,
        level: 1,
        element: 'knowledge',
      });
    });

    it('sets correct element from payload', () => {
      const state = reducer(initialState, discoverRoot({ rootId: 'ح-ر-ق', element: 'fire' }));
      expect(state.rootMastery['ح-ر-ق'].element).toBe('fire');
    });

    it('skips duplicate root discovery (idempotent)', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));

      expect(state.discoveredRoots.filter(r => r === 'ك-ت-ب').length).toBe(1);
      expect(state.rootMastery['ك-ت-ب'].level).toBe(1); // Not reinitialized
    });

    it('handles multiple roots for same element', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, discoverRoot({ rootId: 'ق-ر-أ', element: 'knowledge' }));

      expect(state.discoveredRoots).toContain('ك-ت-ب');
      expect(state.discoveredRoots).toContain('ق-ر-أ');
      expect(state.rootMastery['ك-ت-ب'].element).toBe('knowledge');
      expect(state.rootMastery['ق-ر-أ'].element).toBe('knowledge');
    });
  });

  describe('recordRootUse', () => {
    it('increments timesUsed', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.8 }));

      expect(state.rootMastery['ك-ت-ب'].timesUsed).toBe(1);
    });

    it('adds 15 XP for perfect accuracy (>=0.95)', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 }));

      expect(state.rootMastery['ك-ت-ب'].xp).toBe(15);
    });

    it('adds 10 XP for good accuracy (>=0.7)', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.7 }));

      expect(state.rootMastery['ك-ت-ب'].xp).toBe(10);
    });

    it('adds 5 XP for partial accuracy (<0.7)', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.5 }));

      expect(state.rootMastery['ك-ت-ب'].xp).toBe(5);
    });

    it('levels up from 1 to 2 at 100 XP', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));

      // Add 100 XP (7 perfect casts = 105 XP)
      for (let i = 0; i < 7; i++) {
        state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 }));
      }

      expect(state.rootMastery['ك-ت-ب'].xp).toBe(105);
      expect(state.rootMastery['ك-ت-ب'].level).toBe(2);
    });

    it('handles level 3 at 200 XP', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));

      // Add 210 XP (14 perfect casts = 210 XP)
      for (let i = 0; i < 14; i++) {
        state = reducer(state, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 }));
      }

      expect(state.rootMastery['ك-ت-ب'].xp).toBe(210);
      expect(state.rootMastery['ك-ت-ب'].level).toBe(3);
    });

    it('does nothing for undiscovered root', () => {
      const state = reducer(initialState, recordRootUse({ rootId: 'ك-ت-ب', form: 'I', accuracy: 0.8 }));

      expect(state.rootMastery['ك-ت-ب']).toBeUndefined();
    });
  });

  describe('recordAffinityChoice', () => {
    it('pushes choice to discoveryChoices array', () => {
      const state = reducer(initialState, recordAffinityChoice({
        choiceId: 'choice_1',
        element: 'fire',
        weight: 1.0,
      }));

      expect(state.affinity.discoveryChoices).toHaveLength(1);
      expect(state.affinity.discoveryChoices[0]).toMatchObject({
        choiceId: 'choice_1',
        element: 'fire',
        weight: 1.0,
      });
    });

    it('increments choiceCount', () => {
      let state = reducer(initialState, recordAffinityChoice({
        choiceId: 'choice_1',
        element: 'fire',
        weight: 1.0,
      }));

      expect(state.affinity.choiceCount).toBe(1);

      state = reducer(state, recordAffinityChoice({
        choiceId: 'choice_2',
        element: 'water',
        weight: 1.0,
      }));

      expect(state.affinity.choiceCount).toBe(2);
    });

    it('does NOT lock affinity before 50 choices', () => {
      let state = initialState;

      // Add 49 choices
      for (let i = 0; i < 49; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `choice_${i}`,
          element: 'fire',
          weight: 1.0,
        }));
      }

      expect(state.affinity.choiceCount).toBe(49);
      expect(state.affinity.primary).toBeNull();
      expect(state.affinity.secondary).toBeNull();
    });

    it('locks primary and secondary affinity at exactly 50 choices', () => {
      let state = initialState;

      // Add 40 fire choices
      for (let i = 0; i < 40; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `fire_${i}`,
          element: 'fire',
          weight: 1.0,
        }));
      }

      // Add 10 water choices
      for (let i = 0; i < 10; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `water_${i}`,
          element: 'water',
          weight: 1.0,
        }));
      }

      expect(state.affinity.choiceCount).toBe(50);
      expect(state.affinity.primary).toBe('fire');
      expect(state.affinity.secondary).toBe('water');
    });

    it('selects highest weighted element as primary', () => {
      let state = initialState;

      // Add weighted choices
      for (let i = 0; i < 30; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `fire_${i}`,
          element: 'fire',
          weight: 2.0, // Fire gets 60 total weight
        }));
      }

      for (let i = 0; i < 20; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `water_${i}`,
          element: 'water',
          weight: 1.0, // Water gets 20 total weight
        }));
      }

      expect(state.affinity.primary).toBe('fire');
      expect(state.affinity.secondary).toBe('water');
    });

    it('selects second highest as secondary', () => {
      let state = initialState;

      // 25 fire (weight 1)
      for (let i = 0; i < 25; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `fire_${i}`,
          element: 'fire',
          weight: 1.0,
        }));
      }

      // 15 water (weight 1)
      for (let i = 0; i < 15; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `water_${i}`,
          element: 'water',
          weight: 1.0,
        }));
      }

      // 10 earth (weight 1)
      for (let i = 0; i < 10; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `earth_${i}`,
          element: 'earth',
          weight: 1.0,
        }));
      }

      expect(state.affinity.primary).toBe('fire');
      expect(state.affinity.secondary).toBe('water');
    });

    it('does not re-lock after already locked (additional choices are recorded but affinity stays)', () => {
      let state = initialState;

      // Lock with 50 fire choices
      for (let i = 0; i < 50; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `fire_${i}`,
          element: 'fire',
          weight: 1.0,
        }));
      }

      expect(state.affinity.primary).toBe('fire');
      const primaryBefore = state.affinity.primary;

      // Add 50 water choices (should not override)
      for (let i = 0; i < 50; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `water_${i}`,
          element: 'water',
          weight: 1.0,
        }));
      }

      expect(state.affinity.choiceCount).toBe(100);
      expect(state.affinity.primary).toBe(primaryBefore); // Still fire
    });
  });

  describe('equipSpell', () => {
    it('equips spell to specified slot (0-5)', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, equipSpell({ slot: 0, rootId: 'ك-ت-ب', form: 'I' }));

      expect(state.equippedSpells[0]).toMatchObject({
        rootId: 'ك-ت-ب',
        form: 'I',
        element: 'knowledge',
        mpCost: 5,
      });
    });

    it('includes rootId, form, element, and mpCost in slot data', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ح-ر-ق', element: 'fire' }));
      state = reducer(state, equipSpell({ slot: 2, rootId: 'ح-ر-ق', form: 'I' }));

      const equipped = state.equippedSpells[2];
      expect(equipped).toHaveProperty('rootId', 'ح-ر-ق');
      expect(equipped).toHaveProperty('form', 'I');
      expect(equipped).toHaveProperty('element', 'fire');
      expect(equipped).toHaveProperty('mpCost', 5);
    });

    it('does nothing for undiscovered root', () => {
      const state = reducer(initialState, equipSpell({ slot: 0, rootId: 'ك-ت-ب', form: 'I' }));

      expect(state.equippedSpells[0]).toBeNull();
    });
  });

  describe('unequipSpell', () => {
    it('sets slot to null', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, equipSpell({ slot: 0, rootId: 'ك-ت-ب', form: 'I' }));
      expect(state.equippedSpells[0]).not.toBeNull();

      state = reducer(state, unequipSpell(0));
      expect(state.equippedSpells[0]).toBeNull();
    });
  });

  describe('clearBattleState', () => {
    it('resets activeCombos and lastCastTimestamp', () => {
      let state = reducer(initialState, recordCombo({
        comboId: 'combo_inferno',
        elements: ['fire', 'fire'],
        timestamp: Date.now(),
      }));
      state = reducer(state, setLastCastTimestamp(Date.now()));

      expect(state.activeCombos).toHaveLength(1);
      expect(state.lastCastTimestamp).not.toBeNull();

      state = reducer(state, clearBattleState());
      expect(state.activeCombos).toHaveLength(0);
      expect(state.lastCastTimestamp).toBeNull();
    });
  });

  describe('selectors', () => {
    it('selectDiscoveredRoots returns discoveredRoots array', () => {
      const state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      const mockState = { magic: state };

      const discovered = selectDiscoveredRoots(mockState);
      expect(discovered).toContain('ك-ت-ب');
    });

    it('selectRootMastery returns mastery for specific root', () => {
      const state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      const mockState = { magic: state };

      const mastery = selectRootMastery(mockState, 'ك-ت-ب');
      expect(mastery).toMatchObject({
        level: 1,
        xp: 0,
        element: 'knowledge',
      });
    });

    it('selectAllRootMastery returns full mastery object', () => {
      let state = reducer(initialState, discoverRoot({ rootId: 'ك-ت-ب', element: 'knowledge' }));
      state = reducer(state, discoverRoot({ rootId: 'ح-ر-ق', element: 'fire' }));
      const mockState = { magic: state };

      const allMastery = selectAllRootMastery(mockState);
      expect(allMastery).toHaveProperty('ك-ت-ب');
      expect(allMastery).toHaveProperty('ح-ر-ق');
    });

    it('selectAffinity returns affinity object', () => {
      const mockState = { magic: initialState };
      const affinity = selectAffinity(mockState);

      expect(affinity).toHaveProperty('primary', null);
      expect(affinity).toHaveProperty('secondary', null);
      expect(affinity).toHaveProperty('discoveryChoices');
      expect(affinity).toHaveProperty('choiceCount', 0);
    });

    it('selectEquippedSpells returns 6-element array', () => {
      const mockState = { magic: initialState };
      const equipped = selectEquippedSpells(mockState);

      expect(equipped).toHaveLength(6);
      expect(equipped.every(slot => slot === null)).toBe(true);
    });

    it('selectAffinityBonuses returns multipliers when affinity locked', () => {
      let state = initialState;

      // Lock affinity
      for (let i = 0; i < 50; i++) {
        state = reducer(state, recordAffinityChoice({
          choiceId: `choice_${i}`,
          element: 'fire',
          weight: 1.0,
        }));
      }

      const mockState = { magic: state };
      const bonuses = selectAffinityBonuses(mockState);

      expect(bonuses.primaryElement).toBe('fire');
      expect(bonuses.primaryMultiplier).toBe(2.0);
      expect(bonuses.secondaryMultiplier).toBe(1.5);
    });

    it('selectAffinityBonuses returns nulls when affinity not locked', () => {
      const mockState = { magic: initialState };
      const bonuses = selectAffinityBonuses(mockState);

      expect(bonuses.primaryElement).toBeNull();
      expect(bonuses.secondaryElement).toBeNull();
      expect(bonuses.primaryMultiplier).toBeNull();
      expect(bonuses.secondaryMultiplier).toBeNull();
    });
  });
});
