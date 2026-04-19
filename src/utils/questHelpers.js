/**
 * Quest Helper Utilities
 *
 * Centralized logic for checking and completing diverse quest types
 */

import { completeQuest, checkPrerequisites } from '../store/slices/questSlice.js';
import { showNotification } from '../store/slices/uiSlice.js';
import questsData from '../data/quests.json';
import vocabulary from '../data/vocabularyAll.js';

/**
 * Check and complete exploration quests based on NPC visits
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkExplorationQuests(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;
  const npcsVisited = state.quests.npcsVisited || [];
  const zonesVisited = state.quests.zonesVisited || [];

  for (const qd of questsData) {
    if (qd.type === 'exploration' && quests[qd.id]?.status === 'active') {
      let progress = 0;
      let target = qd.target;

      if (qd.requirements?.npcsVisited) {
        // Specific NPCs required
        const requiredNpcs = qd.requirements.npcsVisited;
        progress = requiredNpcs.filter(npc => npcsVisited.includes(npc)).length;
      } else if (qd.requirements?.zonesCount) {
        // Count of unique zones visited
        progress = zonesVisited.length;
        target = qd.requirements.zonesCount;
      } else if (qd.requirements?.zone && qd.requirements?.npcCount) {
        // Count NPCs in specific zone
        const currentZone = state.player.currentZone;
        if (currentZone === qd.requirements.zone) {
          // This would need zone-specific NPC tracking
          // For now, use generic count
          progress = npcsVisited.length;
        }
      }

      if (progress >= target && quests[qd.id].status === 'active') {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check and complete review quests based on session accuracy
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkReviewQuests(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;
  const reviewSessions = state.quests.reviewSessionsCompleted || [];

  for (const qd of questsData) {
    if (qd.type === 'review' && quests[qd.id]?.status === 'active') {
      const minAccuracy = qd.requirements.minAccuracy;
      const qualifyingSessions = reviewSessions.filter(s => s.accuracy >= minAccuracy);

      if (qualifyingSessions.length >= qd.target) {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check and complete quiz quests based on accuracy
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkQuizQuests(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;
  const quizzesPassed = state.quests.quizzesPassed || [];

  for (const qd of questsData) {
    if (qd.type === 'quiz' && quests[qd.id]?.status === 'active') {
      const minAccuracy = qd.requirements?.minAccuracy || 80;
      const qualifyingQuizzes = quizzesPassed.filter(q => q.accuracy >= minAccuracy);

      if (qualifyingQuizzes.length >= qd.target) {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check and complete dialogue quests
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkDialogueQuests(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;
  const dialoguesCompleted = state.quests.dialoguesCompleted || [];

  for (const qd of questsData) {
    if (qd.type === 'dialogue' && quests[qd.id]?.status === 'active') {
      let completed = false;

      if (qd.requirements?.dialogueCompleted) {
        // Single dialogue required
        completed = dialoguesCompleted.includes(qd.requirements.dialogueCompleted);
      } else if (qd.requirements?.dialoguesCompleted) {
        // Multiple dialogues required
        const requiredDialogues = qd.requirements.dialoguesCompleted;
        const completedCount = requiredDialogues.filter(d => dialoguesCompleted.includes(d)).length;
        completed = completedCount >= qd.target;
      }

      if (completed) {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check and complete challenge quests
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkChallengeQuests(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;

  for (const qd of questsData) {
    if (qd.type === 'challenge' && quests[qd.id]?.status === 'active') {
      let progress = 0;
      let target = qd.target;

      if (qd.trackEvent === 'words_learned_today') {
        progress = state.quests.wordsLearnedToday || 0;
      } else if (qd.trackEvent === 'alphabet_letter_mastered') {
        progress = (state.quests.lettersMastered || []).length;
      } else if (qd.trackEvent === 'chest_opened') {
        progress = (state.quests.chestsOpened || []).length;
      }

      if (progress >= target) {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check sentence builder quest
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 */
export function checkSentenceQuest(store, dispatch) {
  const state = store.getState();
  const quests = state.quests.quests;
  const sentenceCount = state.quests.sentenceQuizzesCompleted || 0;

  for (const qd of questsData) {
    if (qd.trackEvent === 'sentence_quiz_completed' && quests[qd.id]?.status === 'active') {
      if (sentenceCount >= qd.target) {
        dispatch(completeQuest(qd.id));
        dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
        dispatch(checkPrerequisites(questsData));
      }
    }
  }
}

/**
 * Check collection quests (words from specific category)
 * @param {object} store - Redux store
 * @param {function} dispatch - Redux dispatch function
 * @param {string} category - Word category
 */
export function checkCollectionQuests(store, dispatch, category) {
  const state = store.getState();
  const quests = state.quests.quests;
  const fsrsCards = state.vocabulary.fsrsCards || {};

  for (const qd of questsData) {
    if (qd.type === 'collection' && quests[qd.id]?.status === 'active') {
      if (qd.requirements?.wordsFromCategory === category) {
        // Count learned words in this category

        const categoryWords = vocabulary.filter(w => w.category === category);
        const learnedInCategory = categoryWords.filter(w => fsrsCards[w.id]).length;

        if (learnedInCategory >= qd.requirements.count) {
          dispatch(completeQuest(qd.id));
          dispatch(showNotification({ message: `Quest complete: ${qd.title}`, type: 'quest' }));
          dispatch(checkPrerequisites(questsData));
        }
      }
    }
  }
}

/**
 * Get current progress for a quest
 * @param {object} quest - Quest definition from quests.json
 * @param {object} state - Redux state
 * @returns {number} Current progress value
 */
export function getQuestProgress(quest, state) {
  const quests = state.quests.quests;
  const questState = quests[quest.id];

  if (!questState || questState.status !== 'active') {
    return 0;
  }

  switch (quest.type) {
    case 'exploration': {
      if (quest.requirements?.npcsVisited) {
        const npcsVisited = state.quests.npcsVisited || [];
        return quest.requirements.npcsVisited.filter(npc => npcsVisited.includes(npc)).length;
      } else if (quest.requirements?.zonesCount) {
        return (state.quests.zonesVisited || []).length;
      }
      return questState.progress || 0;
    }

    case 'review': {
      const reviewSessions = state.quests.reviewSessionsCompleted || [];
      const minAccuracy = quest.requirements.minAccuracy;
      return reviewSessions.filter(s => s.accuracy >= minAccuracy).length;
    }

    case 'quiz': {
      const quizzesPassed = state.quests.quizzesPassed || [];
      const minAccuracy = quest.requirements?.minAccuracy || 80;
      return quizzesPassed.filter(q => q.accuracy >= minAccuracy).length;
    }

    case 'dialogue': {
      const dialoguesCompleted = state.quests.dialoguesCompleted || [];
      if (quest.requirements?.dialogueCompleted) {
        return dialoguesCompleted.includes(quest.requirements.dialogueCompleted) ? 1 : 0;
      } else if (quest.requirements?.dialoguesCompleted) {
        return quest.requirements.dialoguesCompleted.filter(d => dialoguesCompleted.includes(d)).length;
      }
      return 0;
    }

    case 'challenge': {
      if (quest.trackEvent === 'words_learned_today') {
        return state.quests.wordsLearnedToday || 0;
      } else if (quest.trackEvent === 'alphabet_letter_mastered') {
        return (state.quests.lettersMastered || []).length;
      } else if (quest.trackEvent === 'chest_opened') {
        return (state.quests.chestsOpened || []).length;
      }
      return questState.progress || 0;
    }

    case 'collection': {
      if (quest.requirements?.wordsFromCategory) {

        const fsrsCards = state.vocabulary.fsrsCards || {};
        const category = quest.requirements.wordsFromCategory;
        const categoryWords = vocabulary.filter(w => w.category === category);
        return categoryWords.filter(w => fsrsCards[w.id]).length;
      }
      return questState.progress || 0;
    }

    default:
      // Legacy "learn X words" quests
      return questState.progress || 0;
  }
}
