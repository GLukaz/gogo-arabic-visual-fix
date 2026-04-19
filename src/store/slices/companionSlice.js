import { createSlice, createSelector } from '@reduxjs/toolkit';
import { calculateCompanionLevel, MAX_COMPANION_LEVEL } from '../../data/companionAbilities.js';

// Initial 12 companion entries (IDs will match companions.js)
const COMPANION_IDS = [
  'companion_amira',
  'companion_khalid',
  'companion_zahra',
  'companion_omar',
  'companion_layla',
  'companion_hassan',
  'companion_fatima',
  'companion_ali',
  'companion_maryam',
  'companion_samir',
  'companion_nadia',
  'companion_tariq',
];

// Initialize companion state objects
const initializeCompanions = () => {
  const companions = {};

  COMPANION_IDS.forEach(id => {
    companions[id] = {
      id,
      recruited: false,
      relationship: 0,            // 0-100
      mood: 50,                   // 0-100 (affects dialogue tone)
      level: 1,                   // Mirrors player level - 2 (min 1)
      xp: 0,                       // cumulative XP earned (for leveling)
      giftsReceived: [],          // [giftId, ...]
      lastGiftTimestamp: null,
      dialogueHistory: [],        // [{ lineId, timestamp }] — last 50
      battleStats: {
        battlesParticipated: 0,
        damageDealt: 0,
        healsPerformed: 0,
        timesKO: 0,
      },
    };
  });

  return companions;
};

const initialState = {
  companions: initializeCompanions(),
  activeParty: {
    battle: null,         // companionId or null
    exploration: null,    // companionId or null
  },
  recruitedCount: 0,
  lastSwapTimestamp: null,
};

const companionSlice = createSlice({
  name: 'companions',
  initialState,
  reducers: {
    recruitCompanion(state, action) {
      // payload: companionId
      const companionId = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Skip if already recruited
      if (companion.recruited) {
        return;
      }

      companion.recruited = true;
      state.recruitedCount += 1;
    },

    setActiveCompanion(state, action) {
      // payload: { slot, companionId }
      const { slot, companionId } = action.payload;

      // Validate slot
      if (slot !== 'battle' && slot !== 'exploration') {
        console.error(`[companionSlice] Invalid slot '${slot}' (must be 'battle' or 'exploration')`);
        return;
      }

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      if (!companion.recruited) {
        console.error(`[companionSlice] Cannot set non-recruited companion '${companionId}' as active`);
        return;
      }

      // If same companion is already in the OTHER slot, clear that slot
      const otherSlot = slot === 'battle' ? 'exploration' : 'battle';
      if (state.activeParty[otherSlot] === companionId) {
        state.activeParty[otherSlot] = null;
      }

      // Set active companion
      state.activeParty[slot] = companionId;
    },

    removeActiveCompanion(state, action) {
      // payload: slot
      const slot = action.payload;

      if (slot !== 'battle' && slot !== 'exploration') {
        console.error(`[companionSlice] Invalid slot '${slot}'`);
        return;
      }

      state.activeParty[slot] = null;
    },

    giveGift(state, action) {
      // payload: { companionId, giftId, relationshipGain, timestamp }
      const { companionId, giftId, relationshipGain, timestamp } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Increase relationship (clamped 0-100)
      companion.relationship = Math.min(100, companion.relationship + relationshipGain);

      // Push giftId to giftsReceived
      companion.giftsReceived.push(giftId);

      // Set lastGiftTimestamp
      companion.lastGiftTimestamp = timestamp;

      // Increase mood by 10 (clamped 0-100)
      companion.mood = Math.min(100, companion.mood + 10);
    },

    updateRelationship(state, action) {
      // payload: { companionId, amount }
      const { companionId, amount } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Add amount to relationship, clamp 0-100
      companion.relationship = Math.max(0, Math.min(100, companion.relationship + amount));
    },

    setCompanionMood(state, action) {
      // payload: { companionId, mood }
      const { companionId, mood } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Set mood, clamp 0-100
      companion.mood = Math.max(0, Math.min(100, mood));
    },

    recordDialogueLine(state, action) {
      // payload: { companionId, lineId, timestamp }
      const { companionId, lineId, timestamp } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Push to dialogueHistory
      companion.dialogueHistory.push({ lineId, timestamp });

      // Keep last 50 entries
      if (companion.dialogueHistory.length > 50) {
        companion.dialogueHistory = companion.dialogueHistory.slice(-50);
      }
    },

    updateCompanionLevel(state, action) {
      // payload: { companionId, level }
      const { companionId, level } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      // Set level (min 1)
      companion.level = Math.max(1, level);
    },

    addCompanionXP(state, action) {
      // payload: { companionId, xp }
      const { companionId, xp } = action.payload;

      const companion = state.companions[companionId];
      if (!companion) {
        console.error(`[companionSlice] Unknown companion '${companionId}'`);
        return;
      }

      if (!companion.recruited) {
        return; // Only award XP to recruited companions
      }

      // Add XP
      companion.xp = (companion.xp ?? 0) + Math.max(0, xp);

      // Recalculate level from cumulative XP (capped at MAX_COMPANION_LEVEL)
      const newLevel = calculateCompanionLevel(companion.xp);
      companion.level = Math.min(MAX_COMPANION_LEVEL, Math.max(companion.level, newLevel));
    },

    clearBattleCompanionState(state) {
      // Reset all companion battleStats to zero
      Object.values(state.companions).forEach(companion => {
        companion.battleStats = {
          battlesParticipated: 0,
          damageDealt: 0,
          healsPerformed: 0,
          timesKO: 0,
        };
      });
    },
  },
});

export const {
  recruitCompanion,
  setActiveCompanion,
  removeActiveCompanion,
  giveGift,
  updateRelationship,
  setCompanionMood,
  recordDialogueLine,
  updateCompanionLevel,
  addCompanionXP,
  clearBattleCompanionState,
} = companionSlice.actions;

// ────────────────────────────────────────────────
// Selectors
// ────────────────────────────────────────────────

export const selectAllCompanions = (state) => state.companions.companions;

export const selectCompanion = (companionId) => (state) => state.companions.companions[companionId];

export const selectActiveParty = (state) => state.companions.activeParty;

export const selectRecruitedCompanions = createSelector(
  [selectAllCompanions],
  (companions) => {
    return Object.values(companions).filter(companion => companion.recruited === true);
  }
);

export const selectCompanionRelationship = (companionId) => (state) => {
  return state.companions.companions[companionId]?.relationship ?? 0;
};

export const selectCompanionsByZone = (zone) => (state) => {
  // Note: This selector will require companion data to be imported
  // For now, return empty array - will be wired in Task 2 after companions.js exists
  return [];
};

export default companionSlice.reducer;
