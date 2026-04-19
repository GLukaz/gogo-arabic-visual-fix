/**
 * Conflict resolution utilities for cloud sync
 * Field-level merge strategies
 */

/**
 * Merge two arrays with union (no duplicates)
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Union of both arrays
 */
export function mergeArraysUnion(arr1, arr2) {
  const set = new Set([...(arr1 || []), ...(arr2 || [])]);
  return Array.from(set);
}

/**
 * Take the maximum of two numeric values
 * @param {number} val1 - First value
 * @param {number} val2 - Second value
 * @param {number} defaultValue - Default if both are null/undefined
 * @returns {number} Maximum value
 */
export function mergeMax(val1, val2, defaultValue = 0) {
  const v1 = val1 ?? defaultValue;
  const v2 = val2 ?? defaultValue;
  return Math.max(v1, v2);
}

/**
 * Take the more recent date
 * @param {Date|string|null} date1 - First date
 * @param {Date|string|null} date2 - Second date
 * @returns {Date|string|null} More recent date
 */
export function mergeLatestDate(date1, date2) {
  if (!date1) return date2;
  if (!date2) return date1;

  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();

  return time1 > time2 ? date1 : date2;
}

/**
 * Merge two FSRS card objects, taking the one with later review date
 * @param {Object} card1 - First FSRS card
 * @param {Object} card2 - Second FSRS card
 * @returns {Object} Card with later due date
 */
export function mergeFsrsCard(card1, card2) {
  if (!card1) return card2;
  if (!card2) return card1;

  const due1 = card1.card?.due ? new Date(card1.card.due).getTime() : 0;
  const due2 = card2.card?.due ? new Date(card2.card.due).getTime() : 0;

  return due1 > due2 ? card1 : card2;
}

/**
 * Merge two FSRS card collections (objects with wordId keys)
 * @param {Object} cards1 - First cards collection
 * @param {Object} cards2 - Second cards collection
 * @returns {Object} Merged cards collection
 */
export function mergeFsrsCards(cards1, cards2) {
  const merged = { ...(cards1 || {}) };

  for (const [wordId, card2] of Object.entries(cards2 || {})) {
    if (merged[wordId]) {
      merged[wordId] = mergeFsrsCard(merged[wordId], card2);
    } else {
      merged[wordId] = card2;
    }
  }

  return merged;
}

/**
 * Merge two quest objects, taking the more complete one
 * @param {Object} quest1 - First quest
 * @param {Object} quest2 - Second quest
 * @returns {Object} More complete quest
 */
export function mergeQuest(quest1, quest2) {
  if (!quest1) return quest2;
  if (!quest2) return quest1;

  // Priority: completed > active > available > failed
  const statusPriority = {
    completed: 4,
    active: 3,
    available: 2,
    failed: 1,
  };

  const priority1 = statusPriority[quest1.status] || 0;
  const priority2 = statusPriority[quest2.status] || 0;

  if (priority1 !== priority2) {
    return priority1 > priority2 ? quest1 : quest2;
  }

  // Same status - take the one with more progress
  const progress1 = quest1.progress || 0;
  const progress2 = quest2.progress || 0;

  return progress1 >= progress2 ? quest1 : quest2;
}

/**
 * Merge two quest collections
 * @param {Object} quests1 - First quests collection
 * @param {Object} quests2 - Second quests collection
 * @returns {Object} Merged quests collection
 */
export function mergeQuests(quests1, quests2) {
  const merged = { ...(quests1 || {}) };

  for (const [questId, quest2] of Object.entries(quests2 || {})) {
    if (merged[questId]) {
      merged[questId] = mergeQuest(merged[questId], quest2);
    } else {
      merged[questId] = quest2;
    }
  }

  return merged;
}

/**
 * Full game state merge with field-level conflict resolution
 *
 * @param {Object} clientState - Client's local state
 * @param {Object} serverState - Server's state
 * @returns {Object} Merged game state
 */
export function mergeGameStates(clientState, serverState) {
  const merged = {
    player: {},
    settings: {},
    quests: {},
    fsrsCards: {},
  };

  // Player stats - take maximum values for progress metrics
  merged.player = {
    level: mergeMax(clientState.player?.level, serverState.player?.level, 1),
    xp: mergeMax(clientState.player?.xp, serverState.player?.xp, 0),
    xpToNext: mergeMax(clientState.player?.xpToNext, serverState.player?.xpToNext, 100),
    dirhams: mergeMax(clientState.player?.dirhams, serverState.player?.dirhams, 0),
    streak: mergeMax(clientState.player?.streak, serverState.player?.streak, 0),
    wordsLearned: mergeMax(clientState.player?.wordsLearned, serverState.player?.wordsLearned, 0),
    lettersLearned: mergeMax(clientState.player?.lettersLearned, serverState.player?.lettersLearned, 0),
    totalQuizzes: mergeMax(clientState.player?.totalQuizzes, serverState.player?.totalQuizzes, 0),
    correctAnswers: mergeMax(clientState.player?.correctAnswers, serverState.player?.correctAnswers, 0),
    lastReviewDate: mergeLatestDate(
      clientState.player?.lastReviewDate,
      serverState.player?.lastReviewDate
    ),
  };

  // Character appearance - prefer client (most recent user choice)
  merged.player.character = clientState.player?.character || serverState.player?.character || {
    bodyType: 'default',
    skinTone: 'medium',
    outfit: 'thobe_white',
    headwear: null,
  };

  // Inventory - union of both sets
  merged.player.inventory = mergeArraysUnion(
    clientState.player?.inventory,
    serverState.player?.inventory
  );

  // Settings - prefer client (most recent user preferences)
  merged.settings = {
    ...(serverState.settings || {}),
    ...(clientState.settings || {}),
  };

  // Quests - merge with quest-specific logic
  merged.quests = mergeQuests(clientState.quests, serverState.quests);

  // FSRS cards - merge with card-specific logic
  merged.fsrsCards = mergeFsrsCards(clientState.fsrsCards, serverState.fsrsCards);

  return merged;
}
