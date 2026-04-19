import { describe, it, expect, beforeEach } from 'vitest';
import npcReducer, {
  updateDialogueState,
  teachWord,
  resetNpcDialogue,
} from '../slices/npcSlice.js';

describe('npcSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = npcReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        dialogueState: {},
        friendship: {},
        giftsGiven: {},
      });
    });
  });

  describe('updateDialogueState', () => {
    it('should create new dialogue entry if NPC not found', () => {
      const state = npcReducer(
        initialState,
        updateDialogueState({ npcId: 'npc_001', lastLine: 5 })
      );

      expect(state.dialogueState['npc_001']).toBeDefined();
      expect(state.dialogueState['npc_001'].lastLine).toBe(5);
      expect(state.dialogueState['npc_001'].wordsTaught).toEqual([]);
    });

    it('should update existing dialogue entry', () => {
      const startState = {
        dialogueState: {
          npc_001: { lastLine: 3, wordsTaught: ['word1'] },
        },
      };

      const state = npcReducer(
        startState,
        updateDialogueState({ npcId: 'npc_001', lastLine: 7 })
      );

      expect(state.dialogueState['npc_001'].lastLine).toBe(7);
      expect(state.dialogueState['npc_001'].wordsTaught).toEqual(['word1']);
    });

    it('should handle multiple NPCs independently', () => {
      let state = npcReducer(
        initialState,
        updateDialogueState({ npcId: 'npc_001', lastLine: 2 })
      );
      state = npcReducer(
        state,
        updateDialogueState({ npcId: 'npc_002', lastLine: 4 })
      );

      expect(state.dialogueState['npc_001'].lastLine).toBe(2);
      expect(state.dialogueState['npc_002'].lastLine).toBe(4);
    });
  });

  describe('teachWord', () => {
    it('should add word to new NPC dialogue entry', () => {
      const state = npcReducer(
        initialState,
        teachWord({ npcId: 'npc_001', wordId: 'word_hello' })
      );

      expect(state.dialogueState['npc_001']).toBeDefined();
      expect(state.dialogueState['npc_001'].wordsTaught).toContain('word_hello');
      expect(state.dialogueState['npc_001'].lastLine).toBe(0);
    });

    it('should add word to existing NPC dialogue entry', () => {
      const startState = {
        dialogueState: {
          npc_001: { lastLine: 3, wordsTaught: ['word1'] },
        },
      };

      const state = npcReducer(
        startState,
        teachWord({ npcId: 'npc_001', wordId: 'word2' })
      );

      expect(state.dialogueState['npc_001'].wordsTaught).toEqual(['word1', 'word2']);
    });

    it('should not add duplicate words', () => {
      const startState = {
        dialogueState: {
          npc_001: { lastLine: 0, wordsTaught: ['word1'] },
        },
      };

      let state = npcReducer(
        startState,
        teachWord({ npcId: 'npc_001', wordId: 'word1' })
      );

      expect(state.dialogueState['npc_001'].wordsTaught).toEqual(['word1']);
      expect(state.dialogueState['npc_001'].wordsTaught).toHaveLength(1);
    });

    it('should handle multiple words taught by same NPC', () => {
      let state = npcReducer(
        initialState,
        teachWord({ npcId: 'npc_001', wordId: 'word1' })
      );
      state = npcReducer(state, teachWord({ npcId: 'npc_001', wordId: 'word2' }));
      state = npcReducer(state, teachWord({ npcId: 'npc_001', wordId: 'word3' }));

      expect(state.dialogueState['npc_001'].wordsTaught).toEqual(['word1', 'word2', 'word3']);
    });
  });

  describe('resetNpcDialogue', () => {
    it('should reset dialogue for specific NPC', () => {
      const startState = {
        dialogueState: {
          npc_001: { lastLine: 10, wordsTaught: ['word1', 'word2'] },
          npc_002: { lastLine: 5, wordsTaught: ['word3'] },
        },
      };

      const state = npcReducer(startState, resetNpcDialogue('npc_001'));

      expect(state.dialogueState['npc_001'].lastLine).toBe(0);
      expect(state.dialogueState['npc_001'].wordsTaught).toEqual([]);
      expect(state.dialogueState['npc_002'].lastLine).toBe(5);
      expect(state.dialogueState['npc_002'].wordsTaught).toEqual(['word3']);
    });

    it('should do nothing if NPC not found', () => {
      const state = npcReducer(initialState, resetNpcDialogue('nonexistent'));

      expect(state.dialogueState).toEqual({});
    });

    it('should handle reset when NPC exists but is empty', () => {
      const startState = {
        dialogueState: {
          npc_001: { lastLine: 0, wordsTaught: [] },
        },
      };

      const state = npcReducer(startState, resetNpcDialogue('npc_001'));

      expect(state.dialogueState['npc_001']).toEqual({ lastLine: 0, wordsTaught: [] });
    });
  });
});
