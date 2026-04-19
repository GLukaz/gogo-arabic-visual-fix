import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DialogueEngine } from '../DialogueEngine.js';
import { createMockScene } from './mocks/sceneMock.js';
import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';

// Mock the store module
vi.mock('../../../store/store.js', () => ({
  store: {
    getState: vi.fn(),
    dispatch: vi.fn(),
  },
}));

// Mock quests data
vi.mock('../../../data/quests.json', () => ({
  default: [
    { id: 'quest1', name: 'Test Quest 1', prerequisites: [] },
    { id: 'quest2', name: 'Test Quest 2', prerequisites: ['quest1'] },
  ],
}));

import { store } from '../../../store/store.js';

describe('DialogueEngine', () => {
  let scene;
  let engine;
  let mockState;

  beforeEach(() => {
    scene = createMockScene();

    // Default mock state (set BEFORE creating engine)
    mockState = {
      quests: {
        quests: {
          quest1: { id: 'quest1', status: 'active', progress: 0 },
          quest2: { id: 'quest2', status: 'completed', progress: 10 },
        },
      },
      narrative: {
        storyFlags: {
          flag1: 'value1',
          flag2: 42,
          flag3: true,
        },
        npcRelationships: {
          npc1: 3,
          npc2: 0,
        },
        worldObjectStates: {},
        choiceHistory: [],
        visitedBuildings: [],
      },
      vocabulary: {
        fsrsCards: {
          word1: { wordId: 'word1', due: Date.now() },
          word2: { wordId: 'word2', due: Date.now() },
        },
      },
      magic: {
        discoveredRoots: [],
        rootMastery: {},
        affinity: {
          primary: null,
          secondary: null,
          discoveryChoices: [],
          choiceCount: 0,
        },
        equippedSpells: [null, null, null, null, null, null],
        activeCombos: [],
        lastCastTimestamp: null,
      },
    };

    store.getState.mockReturnValue(mockState);
    store.dispatch.mockClear();
    vi.spyOn(EventBus, 'emit').mockImplementation(() => {});

    // Create engine AFTER mock state is set
    engine = new DialogueEngine(scene);
  });

  describe('evaluateCondition', () => {
    it('returns true for null/undefined condition', () => {
      expect(engine.evaluateCondition(null)).toBe(true);
      expect(engine.evaluateCondition(undefined)).toBe(true);
      expect(engine.evaluateCondition({})).toBe(true);
    });

    it('checks quest status correctly for active quest', () => {
      const condition = { quest: { id: 'quest1', status: 'active' } };
      expect(engine.evaluateCondition(condition)).toBe(true);

      const failCondition = { quest: { id: 'quest1', status: 'completed' } };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('checks quest status correctly for completed quest', () => {
      const condition = { quest: { id: 'quest2', status: 'completed' } };
      expect(engine.evaluateCondition(condition)).toBe(true);
    });

    it('checks quest status correctly for not_started', () => {
      engine.currentNpcId = 'npc1';
      const condition = { quest: { id: 'quest3', status: 'not_started' } };
      expect(engine.evaluateCondition(condition)).toBe(true);

      const failCondition = { quest: { id: 'quest1', status: 'not_started' } };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('checks story flag correctly', () => {
      const condition1 = { storyFlag: { key: 'flag1', value: 'value1' } };
      expect(engine.evaluateCondition(condition1)).toBe(true);

      const condition2 = { storyFlag: { key: 'flag2', value: 42 } };
      expect(engine.evaluateCondition(condition2)).toBe(true);

      const condition3 = { storyFlag: { key: 'flag3', value: true } };
      expect(engine.evaluateCondition(condition3)).toBe(true);

      const failCondition = { storyFlag: { key: 'flag1', value: 'wrong' } };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('checks relationship level with min/max', () => {
      engine.currentNpcId = 'npc1';

      const minCondition = { relationship: { min: 2 } };
      expect(engine.evaluateCondition(minCondition)).toBe(true);

      const maxCondition = { relationship: { max: 4 } };
      expect(engine.evaluateCondition(maxCondition)).toBe(true);

      const rangeCondition = { relationship: { min: 2, max: 4 } };
      expect(engine.evaluateCondition(rangeCondition)).toBe(true);

      const failMinCondition = { relationship: { min: 4 } };
      expect(engine.evaluateCondition(failMinCondition)).toBe(false);

      const failMaxCondition = { relationship: { max: 2 } };
      expect(engine.evaluateCondition(failMaxCondition)).toBe(false);
    });

    it('checks relationship level defaults to 0 for unknown NPC', () => {
      engine.currentNpcId = 'unknown_npc';

      const condition = { relationship: { min: 0, max: 0 } };
      expect(engine.evaluateCondition(condition)).toBe(true);

      const failCondition = { relationship: { min: 1 } };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('checks vocabulary mastery', () => {
      const condition = { vocabulary: { wordId: 'word1' } };
      expect(engine.evaluateCondition(condition)).toBe(true);

      const failCondition = { vocabulary: { wordId: 'unknown_word' } };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('supports NOT negation', () => {
      const condition = {
        not: { storyFlag: { key: 'flag1', value: 'wrong' } },
      };
      expect(engine.evaluateCondition(condition)).toBe(true);

      const failCondition = {
        not: { storyFlag: { key: 'flag1', value: 'value1' } },
      };
      expect(engine.evaluateCondition(failCondition)).toBe(false);
    });

    it('AND-combines multiple conditions', () => {
      engine.currentNpcId = 'npc1';

      const allPassCondition = {
        quest: { id: 'quest1', status: 'active' },
        storyFlag: { key: 'flag1', value: 'value1' },
        relationship: { min: 2 },
      };
      expect(engine.evaluateCondition(allPassCondition)).toBe(true);

      const oneFailsCondition = {
        quest: { id: 'quest1', status: 'active' },
        storyFlag: { key: 'flag1', value: 'wrong' },
      };
      expect(engine.evaluateCondition(oneFailsCondition)).toBe(false);
    });
  });

  describe('getAvailableTopics', () => {
    it('filters trees by condition and sorts by priority', () => {
      engine.currentNpcId = 'npc1';

      const npc = {
        id: 'npc1',
        name: 'Test NPC',
        dialogueTrees: [
          {
            id: 'tree1',
            topic: 'lore',
            priority: 2,
            lines: [{ english: 'Tell me about the history' }],
          },
          {
            id: 'tree2',
            topic: 'quests',
            priority: 1,
            condition: { quest: { id: 'quest1', status: 'active' } },
            lines: [{ english: 'Need help?' }],
          },
          {
            id: 'tree3',
            topic: 'teaching',
            condition: { quest: { id: 'quest1', status: 'completed' } },
            lines: [{ english: 'Let me teach you' }],
          },
          {
            id: 'tree4', // No topic field (not hub-and-spoke)
            lines: [{ english: 'Default greeting' }],
          },
        ],
      };

      const topics = engine.getAvailableTopics(npc);

      expect(topics).toHaveLength(2); // tree1 and tree2 pass, tree3 fails, tree4 has no topic
      expect(topics[0].treeId).toBe('tree2'); // Priority 1 first
      expect(topics[1].treeId).toBe('tree1'); // Priority 2 second
      expect(topics[0].topic).toBe('quests');
      expect(topics[1].topic).toBe('lore');
    });

    it('sets currentNpcId when called', () => {
      const npc = {
        id: 'npc_test',
        name: 'Test',
        dialogueTrees: [],
      };

      engine.getAvailableTopics(npc);
      expect(engine.currentNpcId).toBe('npc_test');
    });
  });

  describe('getFilteredChoices', () => {
    it('removes choices that fail condition check', () => {
      engine.currentNpcId = 'npc1';

      const choices = [
        { arabic: 'نعم', english: 'Yes' }, // No condition = always visible
        {
          arabic: 'لا',
          english: 'No',
          condition: { quest: { id: 'quest1', status: 'active' } },
        },
        {
          arabic: 'ربما',
          english: 'Maybe',
          condition: { quest: { id: 'quest1', status: 'completed' } },
        },
      ];

      const filtered = engine.getFilteredChoices(choices);

      expect(filtered).toHaveLength(2);
      expect(filtered[0].english).toBe('Yes');
      expect(filtered[1].english).toBe('No');
    });

    it('returns empty array for null/undefined choices', () => {
      expect(engine.getFilteredChoices(null)).toEqual([]);
      expect(engine.getFilteredChoices(undefined)).toEqual([]);
    });
  });

  describe('executeEffects', () => {
    it('dispatches correct actions for quest_start effect', () => {
      const effects = [{ type: 'quest_start', questId: 'quest1' }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalled();
      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.SFX_QUEST);
    });

    it('dispatches correct actions for quest_complete effect', () => {
      const effects = [{ type: 'quest_complete', questId: 'quest1' }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalledTimes(3); // completeQuest + showNotification + checkPrerequisites
      expect(EventBus.emit).toHaveBeenCalledWith(EVENTS.SFX_QUEST);
    });

    it('dispatches correct actions for relationship_change effect', () => {
      const effects = [{ type: 'relationship_change', amount: 1 }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalled();
      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.DIALOGUE_RELATIONSHIP_CHANGED,
        expect.objectContaining({
          npcId: 'npc1',
          amount: 1,
        })
      );
    });

    it('dispatches correct actions for story_flag effect', () => {
      const effects = [{ type: 'story_flag', flag: 'test_flag', value: 'test_value' }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('emits event for teach_word effect', () => {
      const effects = [{ type: 'teach_word', wordId: 'word1' }];

      engine.executeEffects(effects, 'npc1');

      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.DIALOGUE_EFFECT_EXECUTED,
        expect.objectContaining({
          type: 'teach_word',
          wordId: 'word1',
        })
      );
    });

    it('emits event for give_item effect', () => {
      const effects = [{ type: 'give_item', itemId: 'item1', quantity: 3 }];

      engine.executeEffects(effects, 'npc1');

      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.DIALOGUE_EFFECT_EXECUTED,
        expect.objectContaining({
          type: 'give_item',
          itemId: 'item1',
          quantity: 3,
        })
      );
    });

    it('dispatches correct actions for unlock_area effect', () => {
      const effects = [{ type: 'unlock_area', area: 'desert' }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('dispatches correct actions for change_npc_state effect', () => {
      const effects = [{ type: 'change_npc_state', state: 'happy' }];

      engine.executeEffects(effects, 'npc1');

      expect(store.dispatch).toHaveBeenCalled();
    });

    it('emits shop open event for open_shop effect', () => {
      const effects = [{ type: 'open_shop' }];

      engine.executeEffects(effects, 'npc1');

      expect(EventBus.emit).toHaveBeenCalledWith(
        EVENTS.SHOP_OPEN,
        expect.objectContaining({
          npcId: 'npc1',
        })
      );
    });

    it('executes multiple effects without duplicate summary event', () => {
      const effects = [
        { type: 'story_flag', flag: 'flag1', value: 'val1' },
        { type: 'story_flag', flag: 'flag2', value: 'val2' },
      ];

      engine.executeEffects(effects, 'npc1');

      // Should dispatch twice (one per story_flag) but NOT emit a summary event
      expect(store.dispatch).toHaveBeenCalledTimes(2);
    });
  });

  describe('recordPlayerChoice', () => {
    it('dispatches recordChoice action', () => {
      engine.recordPlayerChoice('npc1', 'choice1');

      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  describe('shouldReturnToHub', () => {
    it('returns true when returnToHub is true', () => {
      const tree = { returnToHub: true };
      expect(engine.shouldReturnToHub(tree)).toBe(true);
    });

    it('returns false when returnToHub is false or undefined', () => {
      const tree1 = { returnToHub: false };
      expect(engine.shouldReturnToHub(tree1)).toBe(false);

      const tree2 = {};
      expect(engine.shouldReturnToHub(tree2)).toBe(false);
    });
  });

  describe('destroy', () => {
    it('clears currentNpcId', () => {
      engine.currentNpcId = 'npc1';
      engine.destroy();
      expect(engine.currentNpcId).toBeNull();
    });
  });
});
