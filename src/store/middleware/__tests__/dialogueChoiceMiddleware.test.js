/**
 * dialogueChoiceMiddleware.test.js
 *
 * Tests for FEAT-032 — Dialogue choice tracking and world state effects.
 * Covers: choice recording, history selectors, flags, all consequence types,
 *         multi-consequence dispatch, empty consequences, middleware guard.
 */

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { dialogueChoiceMiddleware } from '../dialogueChoiceMiddleware.js';
import narrativeReducer, {
  recordDialogueChoice,
  selectNpcDialogueHistory,
  hasChosenOption,
  selectNpcDialogueFlags,
  selectChoiceHistory,
} from '../../slices/narrativeSlice.js';
import factionReducer, { selectAlignment } from '../../slices/factionSlice.js';
import questReducer from '../../slices/questSlice.js';
import inventoryReducer from '../../slices/inventorySlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// Store factory
// ─────────────────────────────────────────────────────────────────────────────

function makeStore(preloaded = {}) {
  return configureStore({
    reducer: {
      narrative: narrativeReducer,
      faction: factionReducer,
      quests: questReducer,
      inventory: inventoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dialogueChoiceMiddleware),
    preloadedState: preloaded,
  });
}

/** Locked quest preloaded state for questUnlock consequence tests */
const QUEST_PRELOAD = {
  quests: {
    quests: {
      'test-quest-001': { status: 'locked', progress: 0, rewardClaimed: false },
    },
    activeQuestId: null,
    npcsVisited: [],
    zonesVisited: [],
    dialoguesCompleted: [],
    reviewSessionsCompleted: [],
    quizzesPassed: [],
    chestsOpened: [],
    wordsLearnedToday: 0,
    lastResetDate: null,
    lettersMastered: [],
    sentenceQuizzesCompleted: 0,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Choice recording
// ─────────────────────────────────────────────────────────────────────────────

describe('recordDialogueChoice — choice recording', () => {
  it('stores the choice in choiceHistory', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'greet_warmly', consequences: [] }));

    const history = selectChoiceHistory(store.getState());
    expect(history).toHaveLength(1);
    expect(history[0].npcId).toBe('npc_elder');
    expect(history[0].choiceId).toBe('greet_warmly');
    expect(history[0].timestamp).toBeDefined();
  });

  it('stores multiple choices in insertion order', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'choice_a', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'choice_b', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_merchant', choiceId: 'haggle', consequences: [] }));

    const history = selectChoiceHistory(store.getState());
    expect(history).toHaveLength(3);
    expect(history[0].choiceId).toBe('choice_a');
    expect(history[1].choiceId).toBe('choice_b');
    expect(history[2].npcId).toBe('npc_merchant');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectNpcDialogueHistory
// ─────────────────────────────────────────────────────────────────────────────

describe('selectNpcDialogueHistory', () => {
  it('returns choices for the specified NPC only', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'hello', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_merchant', choiceId: 'haggle', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'bye', consequences: [] }));

    const history = selectNpcDialogueHistory('npc_elder')(store.getState());
    expect(history).toHaveLength(2);
    expect(history.every((e) => e.npcId === 'npc_elder')).toBe(true);
  });

  it('returns empty array for NPC with no choices', () => {
    const store = makeStore();
    const history = selectNpcDialogueHistory('npc_unknown')(store.getState());
    expect(history).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// hasChosenOption
// ─────────────────────────────────────────────────────────────────────────────

describe('hasChosenOption', () => {
  it('returns true when the player has made that choice with that NPC', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'greet_warmly', consequences: [] }));

    expect(hasChosenOption('npc_elder', 'greet_warmly')(store.getState())).toBe(true);
  });

  it('returns false when the choice has not been made', () => {
    const store = makeStore();
    expect(hasChosenOption('npc_elder', 'greet_warmly')(store.getState())).toBe(false);
  });

  it('returns false when the NPC matches but the choiceId does not', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'greet_warmly', consequences: [] }));

    expect(hasChosenOption('npc_elder', 'greet_coldly')(store.getState())).toBe(false);
  });

  it('returns false when the choiceId matches but the NPC does not', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'greet_warmly', consequences: [] }));

    expect(hasChosenOption('npc_other', 'greet_warmly')(store.getState())).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// selectNpcDialogueFlags
// ─────────────────────────────────────────────────────────────────────────────

describe('selectNpcDialogueFlags', () => {
  it('returns object with choiceIds as keys set to true', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'greet_warmly', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'share_secret', consequences: [] }));

    const flags = selectNpcDialogueFlags('npc_elder')(store.getState());
    expect(flags).toEqual({ greet_warmly: true, share_secret: true });
  });

  it('returns empty object for NPC with no choices', () => {
    const store = makeStore();
    const flags = selectNpcDialogueFlags('npc_unknown')(store.getState());
    expect(flags).toEqual({});
  });

  it('excludes choices made with other NPCs', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'elder_choice', consequences: [] }));
    store.dispatch(recordDialogueChoice({ npcId: 'npc_merchant', choiceId: 'merchant_choice', consequences: [] }));

    const flags = selectNpcDialogueFlags('npc_elder')(store.getState());
    expect(flags).toEqual({ elder_choice: true });
    expect(flags.merchant_choice).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Consequence: factionChange
// ─────────────────────────────────────────────────────────────────────────────

describe('consequence — factionChange', () => {
  it('dispatches adjustAlignment to the faction slice', () => {
    const store = makeStore();
    const alignmentBefore = selectAlignment(store.getState()).scholars;

    store.dispatch(recordDialogueChoice({
      npcId: 'npc_scholar',
      choiceId: 'support_scholars',
      consequences: [{ type: 'factionChange', factionId: 'scholars', amount: 10 }],
    }));

    const alignmentAfter = selectAlignment(store.getState()).scholars;
    expect(alignmentAfter).toBe(alignmentBefore + 10);
  });

  it('can reduce faction alignment (negative amount)', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({
      npcId: 'npc_rebel',
      choiceId: 'insult_merchants',
      consequences: [{ type: 'factionChange', factionId: 'merchants', amount: -5 }],
    }));

    // merchants starts at 0, clamped to 0 (can't go below 0)
    expect(selectAlignment(store.getState()).merchants).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Consequence: relationshipChange
// ─────────────────────────────────────────────────────────────────────────────

describe('consequence — relationshipChange', () => {
  it('dispatches incrementNpcRelationship to the narrative slice', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'give_gift',
      consequences: [{ type: 'relationshipChange', npcId: 'npc_elder', amount: 2 }],
    }));

    const state = store.getState();
    expect(state.narrative.npcRelationships['npc_elder']).toBe(2);
  });

  it('clamps relationship for regular NPCs at max 5', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'max_out',
      consequences: [{ type: 'relationshipChange', npcId: 'npc_elder', amount: 99 }],
    }));

    expect(store.getState().narrative.npcRelationships['npc_elder']).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Consequence: questUnlock
// ─────────────────────────────────────────────────────────────────────────────

describe('consequence — questUnlock', () => {
  it('activates a locked quest', () => {
    const store = makeStore(QUEST_PRELOAD);
    expect(store.getState().quests.quests['test-quest-001'].status).toBe('locked');

    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'accept_mission',
      consequences: [{ type: 'questUnlock', questId: 'test-quest-001' }],
    }));

    expect(store.getState().quests.quests['test-quest-001'].status).toBe('active');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Consequence: itemGrant
// ─────────────────────────────────────────────────────────────────────────────

describe('consequence — itemGrant', () => {
  it('adds an item to the inventory', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'receive_scroll',
      consequences: [{ type: 'itemGrant', itemId: 'ancient_scroll' }],
    }));

    const items = store.getState().inventory.items;
    expect(items.some((i) => i.itemId === 'ancient_scroll')).toBe(true);
  });

  it('grants exactly 1 unit of the item', () => {
    const store = makeStore();
    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'receive_key',
      consequences: [{ type: 'itemGrant', itemId: 'silver_key' }],
    }));

    const item = store.getState().inventory.items.find((i) => i.itemId === 'silver_key');
    expect(item.quantity).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Multiple consequences
// ─────────────────────────────────────────────────────────────────────────────

describe('multiple consequences processed in sequence', () => {
  it('applies all consequences from a single choice', () => {
    const store = makeStore(QUEST_PRELOAD);

    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'pledge_allegiance',
      consequences: [
        { type: 'factionChange', factionId: 'scholars', amount: 15 },
        { type: 'relationshipChange', npcId: 'npc_elder', amount: 1 },
        { type: 'questUnlock', questId: 'test-quest-001' },
        { type: 'itemGrant', itemId: 'scholars_badge' },
      ],
    }));

    const state = store.getState();
    expect(state.faction.alignment.scholars).toBe(15);
    expect(state.narrative.npcRelationships['npc_elder']).toBe(1);
    expect(state.quests.quests['test-quest-001'].status).toBe('active');
    expect(state.inventory.items.some((i) => i.itemId === 'scholars_badge')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('empty consequences array dispatches no extra actions', () => {
    const store = makeStore();
    const alignmentBefore = { ...selectAlignment(store.getState()) };

    store.dispatch(recordDialogueChoice({
      npcId: 'npc_elder',
      choiceId: 'silent_nod',
      consequences: [],
    }));

    // Choice is still recorded
    expect(selectChoiceHistory(store.getState())).toHaveLength(1);
    // But no faction change
    expect(selectAlignment(store.getState())).toEqual(alignmentBefore);
  });

  it('choice with no consequences field is handled gracefully', () => {
    const store = makeStore();
    // payload without consequences key
    store.dispatch(recordDialogueChoice({ npcId: 'npc_elder', choiceId: 'shrug' }));
    expect(selectChoiceHistory(store.getState())).toHaveLength(1);
  });

  it('middleware ignores unrelated action types', () => {
    const store = makeStore();
    // Dispatch an unrelated action — alignment should stay at 0
    store.dispatch({ type: 'SOME_OTHER_ACTION', payload: {} });
    const alignment = selectAlignment(store.getState());
    Object.values(alignment).forEach((v) => expect(v).toBe(0));
  });
});
