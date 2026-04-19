import { describe, it, expect, beforeEach } from 'vitest';
import alphabetReducer, {
  loadGroups,
  startLesson,
  advanceStep,
  completeGroup,
  resetLesson,
} from '../slices/alphabetSlice.js';

describe('alphabetSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = alphabetReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        groups: [],
        completedGroups: [],
        currentLesson: null,
        practicedLetters: {},
      });
    });
  });

  describe('loadGroups', () => {
    it('should load alphabet groups', () => {
      const groups = [
        { id: 'group1', letters: ['ا', 'ب', 'ت'] },
        { id: 'group2', letters: ['ث', 'ج', 'ح'] },
      ];

      const state = alphabetReducer(initialState, loadGroups(groups));

      expect(state.groups).toEqual(groups);
      expect(state.groups).toHaveLength(2);
    });

    it('should replace existing groups', () => {
      const startState = {
        ...initialState,
        groups: [{ id: 'old_group' }],
      };

      const newGroups = [{ id: 'new_group' }];
      const state = alphabetReducer(startState, loadGroups(newGroups));

      expect(state.groups).toEqual(newGroups);
      expect(state.groups).toHaveLength(1);
    });

    it('should handle empty groups array', () => {
      const state = alphabetReducer(initialState, loadGroups([]));

      expect(state.groups).toEqual([]);
    });
  });

  describe('startLesson', () => {
    it('should start a new lesson at step 1', () => {
      const state = alphabetReducer(initialState, startLesson('group1'));

      expect(state.currentLesson).toEqual({
        groupId: 'group1',
        step: 1,
      });
    });

    it('should replace existing lesson', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 3 },
      };

      const state = alphabetReducer(startState, startLesson('group2'));

      expect(state.currentLesson).toEqual({
        groupId: 'group2',
        step: 1,
      });
    });
  });

  describe('advanceStep', () => {
    it('should advance lesson step', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 1 },
      };

      const state = alphabetReducer(startState, advanceStep());

      expect(state.currentLesson.step).toBe(2);
    });

    it('should not advance past step 5', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 5 },
      };

      const state = alphabetReducer(startState, advanceStep());

      expect(state.currentLesson.step).toBe(5);
    });

    it('should handle no current lesson', () => {
      const state = alphabetReducer(initialState, advanceStep());

      expect(state.currentLesson).toBeNull();
    });

    it('should advance through all steps sequentially', () => {
      let state = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 1 },
      };

      for (let i = 2; i <= 5; i++) {
        state = alphabetReducer(state, advanceStep());
        expect(state.currentLesson.step).toBe(i);
      }

      // Try advancing past step 5
      state = alphabetReducer(state, advanceStep());
      expect(state.currentLesson.step).toBe(5);
    });
  });

  describe('completeGroup', () => {
    it('should add group to completed groups', () => {
      const state = alphabetReducer(initialState, completeGroup('group1'));

      expect(state.completedGroups).toContain('group1');
    });

    it('should not add duplicate groups', () => {
      const startState = {
        ...initialState,
        completedGroups: ['group1'],
      };

      const state = alphabetReducer(startState, completeGroup('group1'));

      expect(state.completedGroups).toEqual(['group1']);
      expect(state.completedGroups).toHaveLength(1);
    });

    it('should clear current lesson if it matches completed group', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 5 },
      };

      const state = alphabetReducer(startState, completeGroup('group1'));

      expect(state.completedGroups).toContain('group1');
      expect(state.currentLesson).toBeNull();
    });

    it('should not clear current lesson if different group', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 3 },
      };

      const state = alphabetReducer(startState, completeGroup('group2'));

      expect(state.completedGroups).toContain('group2');
      expect(state.currentLesson).toEqual({ groupId: 'group1', step: 3 });
    });

    it('should handle multiple completed groups', () => {
      let state = alphabetReducer(initialState, completeGroup('group1'));
      state = alphabetReducer(state, completeGroup('group2'));
      state = alphabetReducer(state, completeGroup('group3'));

      expect(state.completedGroups).toEqual(['group1', 'group2', 'group3']);
    });
  });

  describe('resetLesson', () => {
    it('should clear current lesson', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 3 },
      };

      const state = alphabetReducer(startState, resetLesson());

      expect(state.currentLesson).toBeNull();
    });

    it('should not affect completed groups', () => {
      const startState = {
        ...initialState,
        currentLesson: { groupId: 'group1', step: 2 },
        completedGroups: ['group1', 'group2'],
      };

      const state = alphabetReducer(startState, resetLesson());

      expect(state.currentLesson).toBeNull();
      expect(state.completedGroups).toEqual(['group1', 'group2']);
    });

    it('should handle already null lesson', () => {
      const state = alphabetReducer(initialState, resetLesson());

      expect(state.currentLesson).toBeNull();
    });
  });
});
