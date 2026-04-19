import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ROOT_ELEMENTS, SPELL_TIERS } from '../../data/rootMagic.js';

const initialState = {
  discoveredRoots: [],           // Array of root IDs (e.g., 'ك-ت-ب')
  rootMastery: {},               // { 'ك-ت-ب': { timesUsed, formsUnlocked: ['I'], xp, level, element } }
  affinity: {
    primary: null,               // Locked after 50+ choices
    secondary: null,
    discoveryChoices: [],        // [{ choiceId, element, weight, timestamp }]
    choiceCount: 0,
  },
  equippedSpells: [null, null, null, null, null, null],  // 6 hotbar slots
  activeCombos: [],              // Battle-temporary combo tracking
  lastCastTimestamp: null,
};

const magicSlice = createSlice({
  name: 'magic',
  initialState,
  reducers: {
    discoverRoot(state, action) {
      // payload: { rootId, element }
      const { rootId, element } = action.payload;

      // Skip if already discovered
      if (state.discoveredRoots.includes(rootId)) {
        return;
      }

      // Validate element exists
      if (!Object.values(ROOT_ELEMENTS).includes(element)) {
        console.error(`[magicSlice] Invalid element '${element}' for root '${rootId}'`);
        return;
      }

      // Add to discovered roots
      state.discoveredRoots.push(rootId);

      // Initialize mastery entry
      state.rootMastery[rootId] = {
        timesUsed: 0,
        formsUnlocked: ['I'],
        xp: 0,
        level: 1,
        element,
      };
    },

    recordRootUse(state, action) {
      // payload: { rootId, form, accuracy }
      const { rootId, accuracy } = action.payload;

      if (!state.rootMastery[rootId]) {
        console.error(`[magicSlice] Cannot record use of undiscovered root '${rootId}'`);
        return;
      }

      const mastery = state.rootMastery[rootId];

      // Increment usage counter
      mastery.timesUsed += 1;

      // Add XP based on accuracy
      let xpGain = 0;
      if (accuracy >= 0.95) {
        xpGain = 15; // Perfect
      } else if (accuracy >= 0.7) {
        xpGain = 10; // Good
      } else {
        xpGain = 5; // Partial
      }

      mastery.xp += xpGain;

      // Level up at 100 XP thresholds
      const newLevel = Math.floor(mastery.xp / 100) + 1;
      if (newLevel > mastery.level) {
        mastery.level = newLevel;
      }
    },

    unlockForm(state, action) {
      // payload: { rootId, form }
      const { rootId, form } = action.payload;

      if (!state.rootMastery[rootId]) {
        console.error(`[magicSlice] Cannot unlock form for undiscovered root '${rootId}'`);
        return;
      }

      const mastery = state.rootMastery[rootId];

      // Add form if not already unlocked
      if (!mastery.formsUnlocked.includes(form)) {
        mastery.formsUnlocked.push(form);
      }
    },

    recordAffinityChoice(state, action) {
      // payload: { choiceId, element, weight }
      const { choiceId, element, weight } = action.payload;

      state.affinity.discoveryChoices.push({ choiceId, element, weight, timestamp: Date.now() });
      state.affinity.choiceCount += 1;

      // Lock affinity when 50+ choices and not yet locked
      if (state.affinity.choiceCount >= 50 && state.affinity.primary === null) {
        // Compute weighted histogram
        const histogram = {};
        state.affinity.discoveryChoices.forEach((choice) => {
          if (!histogram[choice.element]) {
            histogram[choice.element] = 0;
          }
          histogram[choice.element] += choice.weight;
        });

        // Sort by weight sum
        const sorted = Object.entries(histogram).sort((a, b) => b[1] - a[1]);

        // Lock primary and secondary
        if (sorted.length >= 1) {
          state.affinity.primary = sorted[0][0];
        }
        if (sorted.length >= 2) {
          state.affinity.secondary = sorted[1][0];
        }
      }
    },

    equipSpell(state, action) {
      // payload: { slot, rootId, form }
      const { slot, rootId, form } = action.payload;

      // Validate slot
      if (slot < 0 || slot > 5) {
        console.error(`[magicSlice] Invalid spell slot '${slot}' (must be 0-5)`);
        return;
      }

      // Validate root is discovered
      if (!state.discoveredRoots.includes(rootId)) {
        console.error(`[magicSlice] Cannot equip undiscovered root '${rootId}'`);
        return;
      }

      const mastery = state.rootMastery[rootId];

      // Validate form is unlocked
      if (!mastery.formsUnlocked.includes(form)) {
        console.error(`[magicSlice] Form '${form}' not unlocked for root '${rootId}'`);
        return;
      }

      // Look up MP cost
      const mpCost = SPELL_TIERS[form]?.mpCost || 5;

      // Set equipped spell
      state.equippedSpells[slot] = {
        rootId,
        form,
        element: mastery.element,
        mpCost,
      };
    },

    unequipSpell(state, action) {
      // payload: slot (number)
      const slot = action.payload;

      if (slot >= 0 && slot <= 5) {
        state.equippedSpells[slot] = null;
      }
    },

    recordCombo(state, action) {
      // payload: { comboId, elements, timestamp }
      const { comboId, elements, timestamp } = action.payload;

      state.activeCombos.push({
        comboId,
        elements,
        timestamp,
      });
    },

    clearBattleState(state) {
      state.activeCombos = [];
      state.lastCastTimestamp = null;
    },

    setLastCastTimestamp(state, action) {
      state.lastCastTimestamp = action.payload;
    },
  },
});

export const {
  discoverRoot,
  recordRootUse,
  unlockForm,
  recordAffinityChoice,
  equipSpell,
  unequipSpell,
  recordCombo,
  clearBattleState,
  setLastCastTimestamp,
} = magicSlice.actions;

// ========== MEMOIZED SELECTORS ==========

export const selectDiscoveredRoots = (state) => state.magic.discoveredRoots;

export const selectRootMastery = (state, rootId) => state.magic.rootMastery[rootId];

export const selectAllRootMastery = (state) => state.magic.rootMastery;

export const selectAffinity = (state) => state.magic.affinity;

export const selectEquippedSpells = (state) => state.magic.equippedSpells;

export const selectAffinityBonuses = createSelector(
  [(state) => state.magic.affinity],
  (affinity) => {
    if (!affinity.primary) {
      return {
        primaryElement: null,
        secondaryElement: null,
        primaryMultiplier: null,
        secondaryMultiplier: null,
      };
    }

    return {
      primaryElement: affinity.primary,
      secondaryElement: affinity.secondary,
      primaryMultiplier: 2.0,
      secondaryMultiplier: 1.5,
    };
  }
);

export const selectDiscoveredRootsByElement = createSelector(
  [(state) => state.magic.discoveredRoots, (state) => state.magic.rootMastery, (state, element) => element],
  (discoveredRoots, rootMastery, element) => {
    return discoveredRoots.filter((rootId) => {
      const mastery = rootMastery[rootId];
      return mastery && mastery.element === element;
    });
  }
);

export const selectSpellPower = createSelector(
  [(state) => state.magic.rootMastery, (state) => state.magic.affinity, (state, rootId) => rootId],
  (rootMastery, affinity, rootId) => {
    const mastery = rootMastery[rootId];
    if (!mastery) return 0;

    // Base power from root level
    let basePower = 10 + mastery.level * 5;

    // Affinity bonus
    let affinityMultiplier = 1.0;
    if (affinity.primary === mastery.element) {
      affinityMultiplier = 2.0;
    } else if (affinity.secondary === mastery.element) {
      affinityMultiplier = 1.5;
    }

    return Math.floor(basePower * affinityMultiplier);
  }
);

export default magicSlice.reducer;
