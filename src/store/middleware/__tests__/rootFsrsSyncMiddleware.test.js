import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rootFsrsSyncMiddleware } from '../rootFsrsSyncMiddleware.js';

// Mock dependencies
vi.mock('../../../data/rootsData.js', () => ({
  getWordRoot: vi.fn((wordId) => {
    const mockRoots = {
      'kitaab': { root: 'ك-ت-ب', meaning: 'writing' },
      'kataba': { root: 'ك-ت-ب', meaning: 'he wrote' },
      'maktab': { root: 'ك-ت-ب', meaning: 'office' },
      'unknown': null,
    };
    return mockRoots[wordId] || null;
  }),
  getRootWords: vi.fn((rootId) => {
    if (rootId === 'ك-ت-ب') {
      return {
        root: 'ك-ت-ب',
        words: ['kitaab', 'kataba', 'maktab', 'kutub', 'kaatib'],
      };
    }
    return { root: rootId, words: [] };
  }),
}));

vi.mock('../../../utils/eventBus.js', () => ({
  EventBus: {
    emit: vi.fn(),
  },
}));

// Import mocked modules
import { _getWordRoot, _getRootWords } from '../../../data/rootsData.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

describe('rootFsrsSyncMiddleware', () => {
  let store;
  let next;

  beforeEach(() => {
    vi.clearAllMocks();

    store = {
      getState: vi.fn(),
      dispatch: vi.fn(),
    };
    next = vi.fn((action) => action);
  });

  describe('FSRS -> Root sync', () => {
    it('increments root XP when FSRS card reviewed for word with known root', () => {
      store.getState.mockReturnValue({
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: { 'ك-ت-ب': { level: 1, xp: 0 } },
        },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'vocabulary/updateFsrsCard',
        payload: {
          wordId: 'kitaab',
          rating: 3,
          card: {},
        },
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'magic/recordRootUse',
          payload: expect.objectContaining({
            rootId: 'ك-ت-ب',
            form: 'I',
          }),
        })
      );
    });

    it('uses 0.8 accuracy for FSRS rating >= 3 (Good/Easy)', () => {
      store.getState.mockReturnValue({
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: { 'ك-ت-ب': { level: 1, xp: 0 } },
        },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'vocabulary/updateFsrsCard',
        payload: {
          wordId: 'kitaab',
          rating: 3,
          card: {},
        },
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            accuracy: 0.8 * 0.3, // 0.24 effective
          }),
        })
      );
    });

    it('uses 0.5 accuracy for FSRS rating 2 (Hard)', () => {
      store.getState.mockReturnValue({
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: { 'ك-ت-ب': { level: 1, xp: 0 } },
        },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'vocabulary/updateFsrsCard',
        payload: {
          wordId: 'kitaab',
          rating: 2,
          card: {},
        },
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            accuracy: 0.5 * 0.3, // 0.15 effective
          }),
        })
      );
    });

    it('ignores FSRS reviews for words with no matching root', () => {
      store.getState.mockReturnValue({
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: { 'ك-ت-ب': { level: 1, xp: 0 } },
        },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'vocabulary/updateFsrsCard',
        payload: {
          wordId: 'unknown',
          rating: 3,
          card: {},
        },
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('ignores FSRS reviews for undiscovered roots', () => {
      store.getState.mockReturnValue({
        magic: {
          discoveredRoots: [], // ك-ت-ب not discovered
          rootMastery: {},
        },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'vocabulary/updateFsrsCard',
        payload: {
          wordId: 'kitaab',
          rating: 3,
          card: {},
        },
      });

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('passes through non-vocabulary actions unchanged', () => {
      store.getState.mockReturnValue({
        magic: { discoveredRoots: [], rootMastery: {} },
        vocabulary: { fsrsCards: {} },
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      const action = { type: 'player/move', payload: { x: 100, y: 200 } };
      middleware(action);

      expect(next).toHaveBeenCalledWith(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('Root -> FSRS sync', () => {
    it('suggests derived words when root levels up', () => {
      // Before state: level 1, 95 XP
      const prevState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 95, element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      // After state: level 2, 110 XP
      const currentState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 2, xp: 110, element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      let callCount = 0;
      store.getState.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? prevState : currentState;
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      // Should dispatch addFsrsCard for new words
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'vocabulary/addFsrsCard',
          payload: expect.objectContaining({
            source: 'root_mastery_unlock',
          }),
        })
      );

      // Should emit level-up event
      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.MAGIC_ROOT_LEVEL_UP,
        expect.objectContaining({
          rootId: 'ك-ت-ب',
          newLevel: 2,
        })
      );
    });

    it('limits to 3 new FSRS cards per level-up', () => {
      const prevState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 95, element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      const currentState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 2, xp: 110, element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      let callCount = 0;
      store.getState.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? prevState : currentState;
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      // Count addFsrsCard dispatches (should be max 3)
      const addCardCalls = store.dispatch.mock.calls.filter(
        (call) => call[0].type === 'vocabulary/addFsrsCard'
      );
      expect(addCardCalls.length).toBeLessThanOrEqual(3);
    });

    it('does not add FSRS cards for words already in vocabulary', () => {
      const prevState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 1, xp: 95, element: 'knowledge' },
          },
        },
        vocabulary: {
          fsrsCards: {
            kitaab: { state: 'New' },
            kataba: { state: 'New' },
            maktab: { state: 'New' },
          },
        },
        player: { learningPath: 'scholar' },
      };

      const currentState = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 2, xp: 110, element: 'knowledge' },
          },
        },
        vocabulary: {
          fsrsCards: {
            kitaab: { state: 'New' },
            kataba: { state: 'New' },
            maktab: { state: 'New' },
          },
        },
        player: { learningPath: 'scholar' },
      };

      let callCount = 0;
      store.getState.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? prevState : currentState;
      });

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      // Count addFsrsCard dispatches (should only add new words)
      const addCardCalls = store.dispatch.mock.calls.filter(
        (call) => call[0].type === 'vocabulary/addFsrsCard'
      );

      // All dispatched words should NOT be in existing fsrsCards
      addCardCalls.forEach((call) => {
        const wordId = call[0].payload.wordId;
        expect(prevState.vocabulary.fsrsCards).not.toHaveProperty(wordId);
      });
    });
  });

  describe('Form unlock', () => {
    it('unlocks Form II at root level 3', () => {
      const state = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 3, xp: 200, formsUnlocked: ['I'], element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      store.getState.mockReturnValue(state);

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'magic/unlockForm',
          payload: expect.objectContaining({
            rootId: 'ك-ت-ب',
            form: 'II',
          }),
        })
      );

      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.MAGIC_FORM_UNLOCKED,
        expect.objectContaining({
          rootId: 'ك-ت-ب',
          form: 'II',
        })
      );
    });

    it('unlocks Form III at root level 5', () => {
      const state = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 5, xp: 400, formsUnlocked: ['I', 'II'], element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      store.getState.mockReturnValue(state);

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'magic/unlockForm',
          payload: expect.objectContaining({
            form: 'III',
          }),
        })
      );
    });

    it('does not unlock forms if already unlocked', () => {
      const state = {
        magic: {
          discoveredRoots: ['ك-ت-ب'],
          rootMastery: {
            'ك-ت-ب': { level: 3, xp: 200, formsUnlocked: ['I', 'II'], element: 'knowledge' },
          },
        },
        vocabulary: { fsrsCards: {} },
        player: { learningPath: 'scholar' },
      };

      store.getState.mockReturnValue(state);

      const middleware = rootFsrsSyncMiddleware(store)(next);

      middleware({
        type: 'magic/recordRootUse',
        payload: { rootId: 'ك-ت-ب', form: 'I', accuracy: 0.95 },
      });

      // Should not dispatch unlockForm for Form II (already unlocked)
      const unlockCalls = store.dispatch.mock.calls.filter(
        (call) => call[0].type === 'magic/unlockForm' && call[0].payload.form === 'II'
      );
      expect(unlockCalls).toHaveLength(0);
    });
  });
});
