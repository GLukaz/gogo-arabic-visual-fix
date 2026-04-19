import { describe, it, expect, beforeEach } from 'vitest';
import uiReducer, {
  openDialogue,
  closeDialogue,
  openQuiz,
  closeQuiz,
  toggleMenu,
  openSign,
  closeSign,
  showNotification,
  clearNotification,
} from '../slices/uiSlice.js';

describe('uiSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = uiReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        dialogueOpen: false,
        quizOpen: false,
        menuOpen: false,
        signOpen: false,
        objectInspectOpen: false,
        inventoryOpen: false,
        recipeBookOpen: false,
        craftingMiniGameActive: false,
        quizConfig: null,
        dialogueConfig: null,
        signData: null,
        objectInspectData: null,
        notification: null,
        craftingRecipeId: null,
        craftingProfessionId: null,
        journalOpen: false,
      });
    });
  });

  describe('openDialogue', () => {
    it('should open dialogue with config', () => {
      const config = { npcId: 'npc_001', npcName: 'Yusuf' };
      const state = uiReducer(initialState, openDialogue(config));

      expect(state.dialogueOpen).toBe(true);
      expect(state.dialogueConfig).toEqual(config);
    });

    it('should replace existing dialogue config', () => {
      const startState = {
        ...initialState,
        dialogueOpen: true,
        dialogueConfig: { npcId: 'npc_001', npcName: 'Old NPC' },
      };

      const newConfig = { npcId: 'npc_002', npcName: 'New NPC' };
      const state = uiReducer(startState, openDialogue(newConfig));

      expect(state.dialogueOpen).toBe(true);
      expect(state.dialogueConfig).toEqual(newConfig);
    });
  });

  describe('closeDialogue', () => {
    it('should close dialogue and clear config', () => {
      const startState = {
        ...initialState,
        dialogueOpen: true,
        dialogueConfig: { npcId: 'npc_001', npcName: 'Yusuf' },
      };

      const state = uiReducer(startState, closeDialogue());

      expect(state.dialogueOpen).toBe(false);
      expect(state.dialogueConfig).toBeNull();
    });

    it('should handle closing when already closed', () => {
      const state = uiReducer(initialState, closeDialogue());

      expect(state.dialogueOpen).toBe(false);
      expect(state.dialogueConfig).toBeNull();
    });
  });

  describe('openQuiz', () => {
    it('should open quiz with config', () => {
      const config = {
        type: 'flashcard',
        words: ['word1', 'word2'],
        context: 'practice',
        timer: 30,
      };
      const state = uiReducer(initialState, openQuiz(config));

      expect(state.quizOpen).toBe(true);
      expect(state.quizConfig).toEqual(config);
    });

    it('should replace existing quiz config', () => {
      const startState = {
        ...initialState,
        quizOpen: true,
        quizConfig: { type: 'old', words: [] },
      };

      const newConfig = { type: 'new', words: ['word1'] };
      const state = uiReducer(startState, openQuiz(newConfig));

      expect(state.quizOpen).toBe(true);
      expect(state.quizConfig).toEqual(newConfig);
    });
  });

  describe('closeQuiz', () => {
    it('should close quiz and clear config', () => {
      const startState = {
        ...initialState,
        quizOpen: true,
        quizConfig: { type: 'flashcard', words: ['word1'] },
      };

      const state = uiReducer(startState, closeQuiz());

      expect(state.quizOpen).toBe(false);
      expect(state.quizConfig).toBeNull();
    });

    it('should handle closing when already closed', () => {
      const state = uiReducer(initialState, closeQuiz());

      expect(state.quizOpen).toBe(false);
      expect(state.quizConfig).toBeNull();
    });
  });

  describe('toggleMenu', () => {
    it('should toggle menu from false to true', () => {
      const state = uiReducer(initialState, toggleMenu());

      expect(state.menuOpen).toBe(true);
    });

    it('should toggle menu from true to false', () => {
      const startState = { ...initialState, menuOpen: true };
      const state = uiReducer(startState, toggleMenu());

      expect(state.menuOpen).toBe(false);
    });

    it('should toggle multiple times', () => {
      let state = uiReducer(initialState, toggleMenu());
      expect(state.menuOpen).toBe(true);

      state = uiReducer(state, toggleMenu());
      expect(state.menuOpen).toBe(false);

      state = uiReducer(state, toggleMenu());
      expect(state.menuOpen).toBe(true);
    });
  });

  describe('openSign', () => {
    it('should open sign with data', () => {
      const signData = { arabic: 'مرحبا', english: 'Welcome' };
      const state = uiReducer(initialState, openSign(signData));

      expect(state.signOpen).toBe(true);
      expect(state.signData).toEqual(signData);
    });

    it('should replace existing sign data', () => {
      const startState = {
        ...initialState,
        signOpen: true,
        signData: { arabic: 'قديم', english: 'Old' },
      };

      const newData = { arabic: 'جديد', english: 'New' };
      const state = uiReducer(startState, openSign(newData));

      expect(state.signOpen).toBe(true);
      expect(state.signData).toEqual(newData);
    });
  });

  describe('closeSign', () => {
    it('should close sign and clear data', () => {
      const startState = {
        ...initialState,
        signOpen: true,
        signData: { arabic: 'مرحبا', english: 'Welcome' },
      };

      const state = uiReducer(startState, closeSign());

      expect(state.signOpen).toBe(false);
      expect(state.signData).toBeNull();
    });

    it('should handle closing when already closed', () => {
      const state = uiReducer(initialState, closeSign());

      expect(state.signOpen).toBe(false);
      expect(state.signData).toBeNull();
    });
  });

  describe('showNotification', () => {
    it('should show notification with message and type', () => {
      const notification = { message: 'Success!', type: 'success' };
      const state = uiReducer(initialState, showNotification(notification));

      expect(state.notification).toEqual(notification);
    });

    it('should replace existing notification', () => {
      const startState = {
        ...initialState,
        notification: { message: 'Old', type: 'info' },
      };

      const newNotification = { message: 'New', type: 'error' };
      const state = uiReducer(startState, showNotification(newNotification));

      expect(state.notification).toEqual(newNotification);
    });
  });

  describe('clearNotification', () => {
    it('should clear notification', () => {
      const startState = {
        ...initialState,
        notification: { message: 'Test', type: 'info' },
      };

      const state = uiReducer(startState, clearNotification());

      expect(state.notification).toBeNull();
    });

    it('should handle clearing when already null', () => {
      const state = uiReducer(initialState, clearNotification());

      expect(state.notification).toBeNull();
    });
  });

  describe('multiple overlays', () => {
    it('should handle multiple overlays open simultaneously', () => {
      let state = uiReducer(
        initialState,
        openDialogue({ npcId: 'npc_001', npcName: 'Yusuf' })
      );
      state = uiReducer(state, toggleMenu());

      expect(state.dialogueOpen).toBe(true);
      expect(state.menuOpen).toBe(true);
      expect(state.quizOpen).toBe(false);
    });

    it('should close overlays independently', () => {
      let state = {
        ...initialState,
        dialogueOpen: true,
        dialogueConfig: { npcId: 'npc_001' },
        quizOpen: true,
        quizConfig: { type: 'flashcard' },
        menuOpen: true,
      };

      state = uiReducer(state, closeDialogue());
      expect(state.dialogueOpen).toBe(false);
      expect(state.quizOpen).toBe(true);
      expect(state.menuOpen).toBe(true);

      state = uiReducer(state, closeQuiz());
      expect(state.quizOpen).toBe(false);
      expect(state.menuOpen).toBe(true);
    });
  });
});
