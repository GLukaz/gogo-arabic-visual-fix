/**
 * battleRewardsMiddleware.js — Routes battle victory rewards to player/inventory
 *
 * Intercepts battle/endBattle actions and distributes rewards:
 * - XP → playerSlice.addXP
 * - Gold → playerSlice.addDirhams
 * - Items → inventorySlice.addItem (with 200-cap check)
 * - Affix words → vocabularySlice.addFsrsCard (auto-teach on discovery)
 *
 * Closes Phase 27 gap: "rewards not wired" (INTG-06)
 */

import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { addXP, addDirhams } from '../slices/playerSlice.js';
import { addItem, unlockAffix } from '../slices/inventorySlice.js';
import { addFsrsCard } from '../slices/vocabularySlice.js';
import { EQUIPMENT_DATA } from '../../data/equipment.js';

export const battleRewardsMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Intercept battleSlice endBattle action
  if (action.type === 'battle/endBattle') {
    const { victory, rewards } = action.payload || {};

    if (victory && rewards) {
      const { xp, gold, items } = rewards;

      // Award XP to player
      if (xp && xp > 0) {
        store.dispatch(addXP(xp));
      }

      // Award gold (dirhams)
      if (gold && gold > 0) {
        store.dispatch(addDirhams(gold));
      }

      // Award items to inventory
      if (items && items.length > 0) {
        items.forEach((itemReward) => {
          const inventoryState = store.getState().inventory;

          // Check 200-item inventory cap
          if (inventoryState.items.length >= 200) {
            EventBus.emit(EVENTS.INVENTORY_FULL);
            return; // Skip this item reward
          }

          // Add item to inventory
          store.dispatch(
            addItem({
              itemId: itemReward.itemId,
              quantity: itemReward.quantity || 1,
            })
          );

          // Check for new affix words to teach
          const item = EQUIPMENT_DATA[itemReward.itemId];
          if (item?.affixes && item.affixes.length > 0) {
            const vocabState = store.getState().vocabulary;

            item.affixes.forEach((affix) => {
              const fsrsCards = vocabState.fsrsCards || {};

              // Only auto-teach if word is not already in FSRS deck
              if (!fsrsCards[affix.wordId]) {
                // Add to unlocked affixes list
                store.dispatch(unlockAffix(affix.wordId));

                // Add to FSRS deck with New state
                store.dispatch(
                  addFsrsCard({
                    wordId: affix.wordId,
                    state: 0, // FSRS state 0 = New
                    difficulty: 0,
                    stability: 0,
                    last_review: null,
                  })
                );

                // Emit event for UI toast
                EventBus.emit(EVENTS.AFFIX_DISCOVERED, {
                  wordId: affix.wordId,
                  itemId: itemReward.itemId,
                });
              }
            });
          }

          // Emit item added event
          EventBus.emit(EVENTS.INVENTORY_ITEM_ADDED, { itemId: itemReward.itemId });
        });
      }
    }
  }

  return result;
};
