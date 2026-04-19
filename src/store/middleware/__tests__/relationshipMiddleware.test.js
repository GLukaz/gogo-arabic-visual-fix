import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { relationshipMiddleware, MILESTONE_ACTION_TYPES } from '../relationshipMiddleware.js';
import npcReducer, { giveNpcGift } from '../../slices/npcSlice.js';

/**
 * Relationship Middleware Tests
 *
 * Tests:
 * - Tier crossing detection (upward only)
 * - Milestone notifications dispatched correctly
 * - Gift preference reveal at friendly tier
 * - Special quest unlock at close tier
 * - No false positives on same-tier changes
 */
describe('relationshipMiddleware', () => {
  let store;
  let dispatchedActions;

  /**
   * Create a store with a spy middleware that records dispatched actions.
   */
  function createStore(initialFriendship = {}) {
    dispatchedActions = [];

    const spyMiddleware = () => (next) => (action) => {
      dispatchedActions.push(action);
      return next(action);
    };

    return configureStore({
      reducer: {
        npc: npcReducer,
      },
      preloadedState: {
        npc: {
          dialogueState: {},
          friendship: initialFriendship,
          giftsGiven: {},
        },
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(relationshipMiddleware, spyMiddleware),
    });
  }

  beforeEach(() => {
    store = createStore({ 'scholar-yusuf': 50 });
  });

  // ─── Basic tier crossing ───

  describe('tier crossing detection', () => {
    it('does NOT dispatch tierReached when friendship stays in the same tier', () => {
      // 50 + 5 = 55 → still "friendly" (50-74)
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 5,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(0);
    });

    it('dispatches tierReached when friendship crosses from friendly to close', () => {
      // 50 + 25 = 75 → crosses to "close"
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 25,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(1);
      expect(tierActions[0].payload.tier).toBe('close');
      expect(tierActions[0].payload.npcId).toBe('scholar-yusuf');
      expect(tierActions[0].payload.friendshipValue).toBe(75);
    });

    it('dispatches tierReached when crossing from cold to cautious', () => {
      store = createStore({ 'elder-tariq': 20 });

      store.dispatch(giveNpcGift({
        npcId: 'elder-tariq',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(1);
      expect(tierActions[0].payload.tier).toBe('cautious');
    });

    it('dispatches tierReached when crossing from cautious to friendly', () => {
      store = createStore({ 'guard-hamza': 45 });

      store.dispatch(giveNpcGift({
        npcId: 'guard-hamza',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(1);
      expect(tierActions[0].payload.tier).toBe('friendly');
    });

    it('does NOT dispatch tierReached on downward crossing (disliked gift)', () => {
      // Start at 50 (friendly), give disliked gift: 50 - 5 = 45 → cautious
      // Downward crossing should NOT trigger
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_rosewater',
        relationshipDelta: -5,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(0);
    });
  });

  // ─── Milestone content ───

  describe('milestone payload content', () => {
    it('includes milestone reward data in the payload', () => {
      store = createStore({ 'scholar-yusuf': 20 });

      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const tierAction = dispatchedActions.find(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierAction.payload.milestone).toBeDefined();
      expect(tierAction.payload.milestone.reward).toBe('unlock_basic_dialogue');
      expect(tierAction.payload.milestone.xp).toBe(25);
    });

    it('includes NPC title when crossing to close tier', () => {
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 25,
      }));

      const tierAction = dispatchedActions.find(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierAction.payload.title).toBeDefined();
      expect(tierAction.payload.title.titleEnglish).toBe('Friend of Yusuf');
      expect(tierAction.payload.title.titleArabic).toBe('صديق يوسف');
    });

    it('does NOT include title when crossing to non-close tier', () => {
      store = createStore({ 'scholar-yusuf': 20 });

      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const tierAction = dispatchedActions.find(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierAction.payload.title).toBeNull();
    });
  });

  // ─── Preferences revealed ───

  describe('preference reveals', () => {
    it('dispatches preferencesRevealed when crossing to friendly tier', () => {
      store = createStore({ 'guard-hamza': 45 });

      store.dispatch(giveNpcGift({
        npcId: 'guard-hamza',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const prefActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.PREFERENCES_REVEALED
      );
      expect(prefActions.length).toBe(1);
      expect(prefActions[0].payload.npcId).toBe('guard-hamza');
    });

    it('dispatches preferencesRevealed when crossing to close tier', () => {
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 25,
      }));

      const prefActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.PREFERENCES_REVEALED
      );
      expect(prefActions.length).toBe(1);
    });

    it('does NOT dispatch preferencesRevealed for cautious tier', () => {
      store = createStore({ 'scholar-yusuf': 20 });

      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const prefActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.PREFERENCES_REVEALED
      );
      expect(prefActions.length).toBe(0);
    });
  });

  // ─── Special quest unlock ───

  describe('special quest unlock', () => {
    it('dispatches specialQuestUnlocked when crossing to close tier', () => {
      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 25,
      }));

      const questActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.SPECIAL_QUEST_UNLOCKED
      );
      expect(questActions.length).toBe(1);
      expect(questActions[0].payload.npcId).toBe('scholar-yusuf');
      expect(questActions[0].payload.questFlag).toBe('quest_scholar-yusuf_special');
    });

    it('does NOT dispatch specialQuestUnlocked for non-close tiers', () => {
      store = createStore({ 'guard-hamza': 45 });

      store.dispatch(giveNpcGift({
        npcId: 'guard-hamza',
        giftId: 'gift_dates',
        relationshipDelta: 10,
      }));

      const questActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.SPECIAL_QUEST_UNLOCKED
      );
      expect(questActions.length).toBe(0);
    });
  });

  // ─── Edge cases ───

  describe('edge cases', () => {
    it('handles NPC with no prior friendship record (defaults to 50)', () => {
      store = createStore({});

      // New NPC defaults to 50 (friendly). +25 = 75 → close
      store.dispatch(giveNpcGift({
        npcId: 'merchant-fatima',
        giftId: 'gift_dates',
        relationshipDelta: 25,
      }));

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(1);
      expect(tierActions[0].payload.tier).toBe('close');
    });

    it('does not crash when action payload is missing npcId', () => {
      expect(() => {
        store.dispatch(giveNpcGift({
          giftId: 'gift_dates',
          relationshipDelta: 5,
        }));
      }).not.toThrow();
    });

    it('does not dispatch milestone for non-gift actions', () => {
      store.dispatch({ type: 'some/otherAction', payload: {} });

      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(0);
    });

    it('handles friendship capped at 100', () => {
      store = createStore({ 'scholar-yusuf': 95 });

      store.dispatch(giveNpcGift({
        npcId: 'scholar-yusuf',
        giftId: 'gift_dates',
        relationshipDelta: 20,
      }));

      const state = store.getState();
      expect(state.npc.friendship['scholar-yusuf']).toBe(100);

      // No tier crossing since already close
      const tierActions = dispatchedActions.filter(
        (a) => a.type === MILESTONE_ACTION_TYPES.TIER_REACHED
      );
      expect(tierActions.length).toBe(0);
    });
  });
});
