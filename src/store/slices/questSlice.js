import { createSlice, createSelector } from '@reduxjs/toolkit';
import questsData from '../../data/quests.json';
import { ZONES } from '../../data/zones.js';

const initialState = {
  quests: {},       // { [questId]: { status, progress, rewardClaimed, tracking } }
  activeQuestId: null,  // ID of the quest currently being tracked
  npcsVisited: [],  // Array of NPC IDs visited
  zonesVisited: [],  // Array of zone names visited
  dialoguesCompleted: [],  // Array of dialogue IDs completed
  reviewSessionsCompleted: [],  // Array of review session records { accuracy, timestamp }
  quizzesPassed: [],  // Array of quiz records { accuracy, timestamp }
  chestsOpened: [],  // Array of chest IDs opened
  wordsLearnedToday: 0,  // Count of words learned today
  lastResetDate: null,  // Date string for daily reset
  lettersMastered: [],  // Array of letter IDs mastered
  sentenceQuizzesCompleted: 0,  // Count of sentence quizzes completed
};

// Map quest npcGiver roles to full NPC IDs from zones data
const NPC_GIVER_TO_ID = {};
for (const qd of questsData) {
  if (qd.npcGiver && qd.zone) {
    const zone = ZONES[qd.zone];
    if (zone) {
      const npc = zone.npcs.find(n => n.id.startsWith(qd.npcGiver));
      if (npc) {
        NPC_GIVER_TO_ID[`${qd.npcGiver}_${qd.zone}`] = npc.id;
      }
    }
  }
}

const questSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    initializeQuests(state, action) {
      // payload: quests.json array
      // Only initialize entries that don't already exist (preserves persisted data)
      const questDefs = action.payload;
      for (const qd of questDefs) {
        if (!state.quests[qd.id]) {
          state.quests[qd.id] = {
            status: qd.autoStart ? 'active' : 'locked',
            progress: 0,
            rewardClaimed: false,
          };
        }
      }

      // Auto-set active quest if none selected or current selection is invalid
      if (!state.activeQuestId || state.quests[state.activeQuestId]?.status !== 'active') {
        const firstActiveId = Object.keys(state.quests).find(
          id => state.quests[id].status === 'active'
        );
        if (firstActiveId) {
          state.activeQuestId = firstActiveId;
        }
      }
    },

    checkPrerequisites(state, action) {
      // payload: quests.json array (need full definitions to read prerequisites)
      const questDefs = action.payload;
      for (const qd of questDefs) {
        const entry = state.quests[qd.id];
        if (!entry || entry.status !== 'locked') continue;

        // A quest unlocks when every prerequisite is completed
        const allMet = qd.prerequisites.every((preId) => {
          const pre = state.quests[preId];
          return pre && pre.status === 'completed';
        });

        if (allMet) {
          entry.status = 'active';
        }
      }
    },

    updateQuestProgress(state, action) {
      // payload: { questId, amount }
      const { questId, amount } = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'active') {
        entry.progress = (entry.progress ?? 0) + amount;
      }
    },

    completeQuest(state, action) {
      // payload: questId
      const questId = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'active') {
        entry.status = 'completed';
        entry.completedAt = Date.now();

        // If the completed quest was the active one, auto-select next active quest
        if (state.activeQuestId === questId) {
          const nextActiveId = Object.keys(state.quests).find(
            id => state.quests[id].status === 'active'
          );
          state.activeQuestId = nextActiveId || null;
        }
      }
    },

    claimReward(state, action) {
      // payload: questId
      const questId = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'completed' && !entry.rewardClaimed) {
        entry.rewardClaimed = true;
      }
    },

    // New tracking actions for diverse quest types
    visitNpc(state, action) {
      // payload: npcId
      const npcId = action.payload;
      if (!state.npcsVisited.includes(npcId)) {
        state.npcsVisited.push(npcId);
      }
    },

    visitZone(state, action) {
      // payload: zoneName
      const zoneName = action.payload;
      if (!state.zonesVisited.includes(zoneName)) {
        state.zonesVisited.push(zoneName);
      }
    },

    completeDialogue(state, action) {
      // payload: dialogueId
      const dialogueId = action.payload;
      if (!state.dialoguesCompleted.includes(dialogueId)) {
        state.dialoguesCompleted.push(dialogueId);
      }
    },

    recordReviewSession(state, action) {
      // payload: { accuracy, timestamp }
      state.reviewSessionsCompleted.push(action.payload);
    },

    recordQuizPassed(state, action) {
      // payload: { accuracy, timestamp }
      state.quizzesPassed.push(action.payload);
    },

    recordChestOpened(state, action) {
      // payload: chestId
      const chestId = action.payload;
      if (!state.chestsOpened.includes(chestId)) {
        state.chestsOpened.push(chestId);
      }
    },

    incrementWordsLearnedToday(state) {
      // Check if we need to reset the daily counter
      const today = new Date().toDateString();
      if (state.lastResetDate !== today) {
        state.wordsLearnedToday = 0;
        state.lastResetDate = today;
      }
      state.wordsLearnedToday += 1;
    },

    masterLetter(state, action) {
      // payload: letterId
      const letterId = action.payload;
      if (!state.lettersMastered.includes(letterId)) {
        state.lettersMastered.push(letterId);
      }
    },

    incrementSentenceQuizzes(state) {
      state.sentenceQuizzesCompleted += 1;
    },

    setActiveQuest(state, action) {
      // payload: questId (string) or null
      const questId = action.payload;
      if (questId === null) {
        state.activeQuestId = null;
      } else if (state.quests[questId]?.status === 'active') {
        state.activeQuestId = questId;
      }
    },

    activateQuest(state, action) {
      // payload: questId — force a locked/unknown quest to 'active' (used by chain middleware)
      const questId = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'locked') {
        entry.status = 'active';
      }
    },

    // FEAT-039: Quest branching and failure states

    makeQuestChoice(state, action) {
      // payload: { questId, choiceId }
      // Records the player's branch choice and saves a checkpoint at the current progress.
      const { questId, choiceId } = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'active') {
        entry.checkpoint = entry.progress ?? 0;
        entry.currentBranch = choiceId;
      }
    },

    failQuest(state, action) {
      // payload: { questId, reason }
      // Marks an active quest as failed with a retryable flag.
      const { questId, reason } = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'active') {
        entry.status = 'failed';
        entry.failReason = reason ?? 'unknown';
        entry.retryable = true;
      }
    },

    retryQuest(state, action) {
      // payload: questId
      // Resets a failed quest to active, restoring progress to the last checkpoint (or 0).
      const questId = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'failed' && entry.retryable) {
        entry.status = 'active';
        entry.progress = entry.checkpoint ?? 0;
        entry.failReason = null;
        entry.timerStartedAt = null; // clear so timer can be restarted
      }
    },

    startQuestTimer(state, action) {
      // payload: { questId, timeLimitMinutes }
      // Starts a countdown timer for a timed objective quest.
      const { questId, timeLimitMinutes } = action.payload;
      const entry = state.quests[questId];
      if (entry && entry.status === 'active') {
        entry.timeLimitMinutes = timeLimitMinutes;
        entry.timerStartedAt = Date.now();
      }
    },
  },
});

export const {
  initializeQuests,
  checkPrerequisites,
  updateQuestProgress,
  completeQuest,
  claimReward,
  visitNpc,
  visitZone,
  completeDialogue,
  recordReviewSession,
  recordQuizPassed,
  recordChestOpened,
  incrementWordsLearnedToday,
  masterLetter,
  incrementSentenceQuizzes,
  setActiveQuest,
  activateQuest,
  makeQuestChoice,
  failQuest,
  retryQuest,
  startQuestTimer,
} = questSlice.actions;

// ========== MEMOIZED SELECTORS ==========

// Select all quests
export const selectAllQuests = (state) => state.quests.quests;

// Select active quests (memoized to avoid recalculating)
export const selectActiveQuests = createSelector(
  [selectAllQuests],
  (quests) => Object.entries(quests)
    .filter(([, quest]) => quest.status === 'active')
    .reduce((acc, [id, quest]) => ({ ...acc, [id]: quest }), {})
);

// Select active quest count (memoized)
export const selectActiveQuestCount = createSelector(
  [selectActiveQuests],
  (activeQuests) => Object.keys(activeQuests).length
);

// Select completed quests (memoized)
export const selectCompletedQuests = createSelector(
  [selectAllQuests],
  (quests) => Object.entries(quests)
    .filter(([, quest]) => quest.status === 'completed')
    .reduce((acc, [id, quest]) => ({ ...acc, [id]: quest }), {})
);

// Select NPC quest markers (! for available, ? for turn-in)
// PROG-10: Also shows markers for story/active quests, not just locked ones
export const selectNpcQuestMarkers = createSelector(
  [selectAllQuests],
  (quests) => {
    const markers = {};

    for (const qd of questsData) {
      if (!qd.npcGiver || !qd.zone) continue;

      const questState = quests[qd.id];
      if (!questState) continue;

      const npcId = NPC_GIVER_TO_ID[`${qd.npcGiver}_${qd.zone}`];
      if (!npcId) continue;

      // Priority 1: Turn-in (green ?) — completed but reward not claimed
      if (questState.status === 'completed' && !questState.rewardClaimed) {
        markers[npcId] = 'question';
        continue;
      }

      // Priority 2: Active quest in progress (golden !) — NPC has an active quest
      // This ensures story quest NPCs also show markers while their quest is active
      if (questState.status === 'active' && !markers[npcId]) {
        markers[npcId] = 'exclamation';
        continue;
      }

      // Priority 3: Available (golden !) — locked but prerequisites met, ready to pick up
      if (questState.status === 'locked' && !markers[npcId]) {
        const allPrerequisitesMet = qd.prerequisites.every((preId) => {
          const pre = quests[preId];
          return pre && pre.status === 'completed';
        });
        if (allPrerequisitesMet) {
          markers[npcId] = 'exclamation';
        }
      }
    }

    return markers;
  }
);

// Select active quest (full quest object with definition data)
export const selectActiveQuest = createSelector(
  [selectAllQuests, (state) => state.quests.activeQuestId],
  (quests, activeQuestId) => {
    if (!activeQuestId) return null;

    const questState = quests[activeQuestId];
    if (!questState || questState.status !== 'active') return null;

    const questDef = questsData.find(q => q.id === activeQuestId);
    if (!questDef) return null;

    return {
      id: activeQuestId,
      status: questState.status,
      progress: questState.progress,
      rewardClaimed: questState.rewardClaimed,
      title: questDef.title,
      description: questDef.description,
      target: questDef.target,
      zone: questDef.zone,
      npcGiver: questDef.npcGiver,
      trackEvent: questDef.trackEvent,
    };
  }
);

// Select active quest objective location (for compass/HUD)
export const selectActiveQuestObjectiveLocation = createSelector(
  [selectActiveQuest],
  (activeQuest) => {
    if (!activeQuest || !activeQuest.npcGiver || !activeQuest.zone) return null;

    const zone = ZONES[activeQuest.zone];
    if (!zone) return null;

    const npc = zone.npcs.find(n => n.id.startsWith(activeQuest.npcGiver));
    if (!npc) return null;

    return {
      x: npc.x * 64,
      y: npc.y * 64,
    };
  }
);

// Select all active quests that have a running timer (FEAT-039)
export const selectActiveTimedQuests = createSelector(
  [selectAllQuests],
  (quests) => Object.entries(quests)
    .filter(([, quest]) => quest.status === 'active' && quest.timerStartedAt != null)
    .reduce((acc, [id, quest]) => ({ ...acc, [id]: quest }), {})
);

export default questSlice.reducer;
