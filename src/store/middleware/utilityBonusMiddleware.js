export const utilityBonusMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  const utilities = state.home?.utilities || {};

  // Knowledge bonus: +XP on word learn / quiz complete
  if (action.type === 'player/addXp' || action.type === 'fsrs/recordReview') {
    const knowledgeBonus = Math.floor(utilities.Knowledge / 10); // +1 XP per 10 Knowledge
    if (knowledgeBonus > 0 && action.payload?.xp) {
      // The XP was already added by the original action.
      // We dispatch a small bonus XP on top.
      // Avoid infinite loop: check for a _bonusApplied flag
      if (!action.meta?.utilityBonus) {
        store.dispatch({
          type: 'player/addXp',
          payload: { xp: knowledgeBonus, source: 'knowledge_utility' },
          meta: { utilityBonus: true },
        });
      }
    }
  }

  // Hospitality bonus: friendship gains are amplified
  if (action.type === 'npc/adjustFriendship') {
    const hospitalityBonus = Math.floor(utilities.Hospitality / 20); // +1 per 20
    if (hospitalityBonus > 0 && action.payload?.delta > 0 && !action.meta?.utilityBonus) {
      store.dispatch({
        type: 'npc/adjustFriendship',
        payload: { ...action.payload, delta: hospitalityBonus },
        meta: { utilityBonus: true },
      });
    }
  }

  return result;
};

// Comfort and Barakah are read directly by game systems:
// - Comfort: selectUtility('Comfort') → battle/recovery systems check this value
// - Barakah: selectUtility('Barakah') → loot/drop systems check this value
// These bonuses are "pull" not "push" — systems read the value when needed.
// No middleware needed for those.
