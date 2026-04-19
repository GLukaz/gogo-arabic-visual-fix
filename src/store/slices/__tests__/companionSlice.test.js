import { describe, it, expect } from 'vitest';
import companionReducer, {
  recruitCompanion,
  setActiveCompanion,
  removeActiveCompanion,
  giveGift,
  updateRelationship,
  setCompanionMood,
  recordDialogueLine,
  updateCompanionLevel,
  clearBattleCompanionState,
  selectAllCompanions,
  selectCompanion,
  selectActiveParty,
  selectRecruitedCompanions,
  selectCompanionRelationship,
} from '../companionSlice.js';

// Get initial state by calling reducer with undefined and an init action
const initialState = companionReducer(undefined, { type: '@@INIT' });

describe('companionSlice', () => {
  describe('recruitCompanion', () => {
    it('recruits existing companion and increments recruitedCount', () => {
      const state = companionReducer(initialState, recruitCompanion('companion_amira'));

      expect(state.companions.companion_amira.recruited).toBe(true);
      expect(state.recruitedCount).toBe(1);
    });

    it('skips duplicate recruitment (idempotent)', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_amira'));
      state = companionReducer(state, recruitCompanion('companion_amira'));

      expect(state.companions.companion_amira.recruited).toBe(true);
      expect(state.recruitedCount).toBe(1); // Should not increment again
    });

    it('skips unknown companion ID', () => {
      const state = companionReducer(initialState, recruitCompanion('companion_unknown'));

      expect(state.recruitedCount).toBe(0);
    });
  });

  describe('setActiveCompanion', () => {
    it('sets battle companion', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_amira'));
      state = companionReducer(state, setActiveCompanion({ slot: 'battle', companionId: 'companion_amira' }));

      expect(state.activeParty.battle).toBe('companion_amira');
    });

    it('sets exploration companion', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_khalid'));
      state = companionReducer(state, setActiveCompanion({ slot: 'exploration', companionId: 'companion_khalid' }));

      expect(state.activeParty.exploration).toBe('companion_khalid');
    });

    it('clears other slot if same companion (no duplicate)', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_amira'));
      state = companionReducer(state, setActiveCompanion({ slot: 'battle', companionId: 'companion_amira' }));
      state = companionReducer(state, setActiveCompanion({ slot: 'exploration', companionId: 'companion_amira' }));

      expect(state.activeParty.exploration).toBe('companion_amira');
      expect(state.activeParty.battle).toBeNull(); // Cleared because same companion
    });

    it('rejects unrecruited companion', () => {
      const state = companionReducer(initialState, setActiveCompanion({ slot: 'battle', companionId: 'companion_amira' }));

      expect(state.activeParty.battle).toBeNull(); // Should not be set
    });
  });

  describe('removeActiveCompanion', () => {
    it('clears battle slot', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_amira'));
      state = companionReducer(state, setActiveCompanion({ slot: 'battle', companionId: 'companion_amira' }));
      state = companionReducer(state, removeActiveCompanion('battle'));

      expect(state.activeParty.battle).toBeNull();
    });

    it('clears exploration slot', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_khalid'));
      state = companionReducer(state, setActiveCompanion({ slot: 'exploration', companionId: 'companion_khalid' }));
      state = companionReducer(state, removeActiveCompanion('exploration'));

      expect(state.activeParty.exploration).toBeNull();
    });
  });

  describe('giveGift', () => {
    it('increases relationship and mood, records gift', () => {
      const state = companionReducer(initialState, giveGift({
        companionId: 'companion_amira',
        giftId: 'gift_book',
        relationshipGain: 10,
        timestamp: 1000,
      }));

      expect(state.companions.companion_amira.relationship).toBe(10);
      expect(state.companions.companion_amira.mood).toBe(60); // 50 + 10
      expect(state.companions.companion_amira.giftsReceived).toContain('gift_book');
      expect(state.companions.companion_amira.lastGiftTimestamp).toBe(1000);
    });

    it('clamps relationship at 100', () => {
      let state = companionReducer(initialState, giveGift({
        companionId: 'companion_amira',
        giftId: 'gift_1',
        relationshipGain: 60,
        timestamp: 1000,
      }));
      state = companionReducer(state, giveGift({
        companionId: 'companion_amira',
        giftId: 'gift_2',
        relationshipGain: 60,
        timestamp: 2000,
      }));

      expect(state.companions.companion_amira.relationship).toBe(100); // Clamped
    });

    it('clamps mood at 100', () => {
      let state = initialState;
      for (let i = 0; i < 10; i++) {
        state = companionReducer(state, giveGift({
          companionId: 'companion_amira',
          giftId: `gift_${i}`,
          relationshipGain: 5,
          timestamp: 1000 + i,
        }));
      }

      expect(state.companions.companion_amira.mood).toBe(100); // Clamped
    });
  });

  describe('updateRelationship', () => {
    it('positive increment', () => {
      const state = companionReducer(initialState, updateRelationship({
        companionId: 'companion_amira',
        amount: 25,
      }));

      expect(state.companions.companion_amira.relationship).toBe(25);
    });

    it('negative decrement (clamps at 0)', () => {
      const state = companionReducer(initialState, updateRelationship({
        companionId: 'companion_amira',
        amount: -50,
      }));

      expect(state.companions.companion_amira.relationship).toBe(0); // Clamped
    });
  });

  describe('setCompanionMood', () => {
    it('sets mood within bounds', () => {
      const state = companionReducer(initialState, setCompanionMood({
        companionId: 'companion_amira',
        mood: 75,
      }));

      expect(state.companions.companion_amira.mood).toBe(75);
    });

    it('clamps mood at 100', () => {
      const state = companionReducer(initialState, setCompanionMood({
        companionId: 'companion_amira',
        mood: 150,
      }));

      expect(state.companions.companion_amira.mood).toBe(100);
    });

    it('clamps mood at 0', () => {
      const state = companionReducer(initialState, setCompanionMood({
        companionId: 'companion_amira',
        mood: -20,
      }));

      expect(state.companions.companion_amira.mood).toBe(0);
    });
  });

  describe('recordDialogueLine', () => {
    it('adds to dialogue history', () => {
      const state = companionReducer(initialState, recordDialogueLine({
        companionId: 'companion_amira',
        lineId: 'amira_greet_01',
        timestamp: 1000,
      }));

      expect(state.companions.companion_amira.dialogueHistory).toHaveLength(1);
      expect(state.companions.companion_amira.dialogueHistory[0]).toEqual({
        lineId: 'amira_greet_01',
        timestamp: 1000,
      });
    });

    it('caps at 50 entries (FIFO)', () => {
      let state = initialState;

      // Add 60 dialogue lines
      for (let i = 0; i < 60; i++) {
        state = companionReducer(state, recordDialogueLine({
          companionId: 'companion_amira',
          lineId: `line_${i}`,
          timestamp: 1000 + i,
        }));
      }

      expect(state.companions.companion_amira.dialogueHistory).toHaveLength(50);
      // First entry should be line_10 (0-9 were dropped)
      expect(state.companions.companion_amira.dialogueHistory[0].lineId).toBe('line_10');
      // Last entry should be line_59
      expect(state.companions.companion_amira.dialogueHistory[49].lineId).toBe('line_59');
    });
  });

  describe('updateCompanionLevel', () => {
    it('updates level (min 1)', () => {
      const state = companionReducer(initialState, updateCompanionLevel({
        companionId: 'companion_amira',
        level: 5,
      }));

      expect(state.companions.companion_amira.level).toBe(5);
    });

    it('clamps level at minimum 1', () => {
      const state = companionReducer(initialState, updateCompanionLevel({
        companionId: 'companion_amira',
        level: -5,
      }));

      expect(state.companions.companion_amira.level).toBe(1);
    });
  });

  describe('clearBattleCompanionState', () => {
    it('resets all battle stats', () => {
      // Create a modified state with battle stats
      const stateWithBattleStats = {
        ...initialState,
        companions: {
          ...initialState.companions,
          companion_amira: {
            ...initialState.companions.companion_amira,
            battleStats: {
              battlesParticipated: 10,
              damageDealt: 500,
              healsPerformed: 20,
              timesKO: 2,
            },
          },
        },
      };

      const state = companionReducer(stateWithBattleStats, clearBattleCompanionState());

      expect(state.companions.companion_amira.battleStats).toEqual({
        battlesParticipated: 0,
        damageDealt: 0,
        healsPerformed: 0,
        timesKO: 0,
      });
    });
  });

  describe('selectors', () => {
    it('selectAllCompanions returns companions object', () => {
      const mockState = { companions: initialState };
      const result = selectAllCompanions(mockState);

      expect(result).toBe(initialState.companions);
      expect(Object.keys(result)).toHaveLength(12);
    });

    it('selectCompanion returns specific companion', () => {
      const mockState = { companions: initialState };
      const selector = selectCompanion('companion_amira');
      const result = selector(mockState);

      expect(result.id).toBe('companion_amira');
      expect(result.recruited).toBe(false);
    });

    it('selectActiveParty returns active party object', () => {
      const mockState = { companions: initialState };
      const result = selectActiveParty(mockState);

      expect(result).toEqual({
        battle: null,
        exploration: null,
      });
    });

    it('selectRecruitedCompanions filters to recruited only', () => {
      let state = companionReducer(initialState, recruitCompanion('companion_amira'));
      state = companionReducer(state, recruitCompanion('companion_khalid'));

      const mockState = { companions: state };
      const result = selectRecruitedCompanions(mockState);

      expect(result).toHaveLength(2);
      expect(result.every(c => c.recruited === true)).toBe(true);
      expect(result.map(c => c.id)).toContain('companion_amira');
      expect(result.map(c => c.id)).toContain('companion_khalid');
    });

    it('selectCompanionRelationship returns relationship value', () => {
      let state = companionReducer(initialState, updateRelationship({
        companionId: 'companion_amira',
        amount: 50,
      }));

      const mockState = { companions: state };
      const selector = selectCompanionRelationship('companion_amira');
      const result = selector(mockState);

      expect(result).toBe(50);
    });

    it('selectCompanionRelationship returns 0 for unknown companion', () => {
      const mockState = { companions: initialState };
      const selector = selectCompanionRelationship('companion_unknown');
      const result = selector(mockState);

      expect(result).toBe(0);
    });
  });
});
