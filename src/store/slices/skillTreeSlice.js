import { createSlice, createSelector } from '@reduxjs/toolkit';
import { SKILL_TREES, SKILL_TREE_ORDER } from '../../data/skillTrees.js';

/**
 * skillTreeSlice — Redux state for Arabic learning skill trees
 *
 * Manages which skill tree nodes the player has unlocked and how much
 * Skill XP has been accumulated per tree.
 *
 * State shape:
 *   unlockedNodes: { reading: ['reading_01', ...], writing: [...], ... }
 *   skillXP:       { reading: 320, writing: 0, ... }
 */

// Build initial state from tree data so new trees are auto-included
const buildInitialUnlocked = () => {
  const result = {};
  SKILL_TREE_ORDER.forEach((treeId) => {
    result[treeId] = [];
  });
  return result;
};

const buildInitialXP = () => {
  const result = {};
  SKILL_TREE_ORDER.forEach((treeId) => {
    result[treeId] = 0;
  });
  return result;
};

const initialState = {
  unlockedNodes: buildInitialUnlocked(),
  skillXP: buildInitialXP(),
};

const skillTreeSlice = createSlice({
  name: 'skillTree',
  initialState,
  reducers: {
    /**
     * unlockNode — Deduct XP and mark a node as unlocked.
     *
     * Guards:
     * - Node must exist in SKILL_TREES
     * - All prerequisite nodes must already be unlocked
     * - Player must have enough XP for that tree
     * - Node must not already be unlocked
     *
     * @param {string} payload.treeId  - Tree identifier (e.g. 'reading')
     * @param {string} payload.nodeId  - Node identifier (e.g. 'reading_03')
     */
    unlockNode(state, action) {
      const { treeId, nodeId } = action.payload;

      const tree = SKILL_TREES[treeId];
      if (!tree) {
        console.error(`[skillTreeSlice] Unknown treeId: '${treeId}'`);
        return;
      }

      const node = tree.nodes.find((n) => n.id === nodeId);
      if (!node) {
        console.error(`[skillTreeSlice] Unknown nodeId: '${nodeId}' in tree '${treeId}'`);
        return;
      }

      // Ensure arrays are initialised (handles pre-existing persisted state)
      if (!Array.isArray(state.unlockedNodes[treeId])) {
        state.unlockedNodes[treeId] = [];
      }

      // Guard: already unlocked
      if (state.unlockedNodes[treeId].includes(nodeId)) {
        return;
      }

      // Guard: prerequisites
      const prereqsMet = node.prerequisites.every((prereqId) =>
        state.unlockedNodes[treeId].includes(prereqId)
      );
      if (!prereqsMet) {
        console.warn(`[skillTreeSlice] Prerequisites not met for '${nodeId}'`);
        return;
      }

      // Guard: XP
      const currentXP = state.skillXP[treeId] ?? 0;
      if (currentXP < node.xpCost) {
        console.warn(
          `[skillTreeSlice] Insufficient XP for '${nodeId}': have ${currentXP}, need ${node.xpCost}`
        );
        return;
      }

      // Deduct XP and unlock
      state.skillXP[treeId] = currentXP - node.xpCost;
      state.unlockedNodes[treeId].push(nodeId);
    },

    /**
     * addSkillXP — Award Skill XP to a specific tree.
     *
     * @param {string} payload.treeId  - Tree identifier
     * @param {number} payload.amount  - XP to add (must be positive)
     */
    addSkillXP(state, action) {
      const { treeId, amount } = action.payload;

      if (!SKILL_TREES[treeId]) {
        console.error(`[skillTreeSlice] Unknown treeId: '${treeId}'`);
        return;
      }

      if (typeof amount !== 'number' || amount <= 0) {
        console.warn(`[skillTreeSlice] Invalid XP amount: ${amount}`);
        return;
      }

      if (typeof state.skillXP[treeId] !== 'number') {
        state.skillXP[treeId] = 0;
      }

      state.skillXP[treeId] += amount;
    },

    /**
     * bulkUnlockNodes — Mark multiple nodes as unlocked without XP deduction.
     *
     * Used exclusively by initializeSkillTree to bootstrap v11.0 saves.
     * Bypasses XP cost check — does not deduct from skillXP.
     *
     * @param {string}   payload.treeId  - Tree identifier
     * @param {string[]} payload.nodeIds - Array of node IDs to unlock
     */
    bulkUnlockNodes(state, action) {
      const { treeId, nodeIds } = action.payload;
      if (!Array.isArray(state.unlockedNodes[treeId])) {
        state.unlockedNodes[treeId] = [];
      }
      nodeIds.forEach((nodeId) => {
        if (!state.unlockedNodes[treeId].includes(nodeId)) {
          state.unlockedNodes[treeId].push(nodeId);
        }
      });
    },
  },
});

export const { unlockNode, addSkillXP, bulkUnlockNodes } = skillTreeSlice.actions;
export default skillTreeSlice.reducer;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

/** Raw unlocked nodes array for a given tree */
export const selectUnlockedNodes = (treeId) => (state) =>
  state.skillTree?.unlockedNodes?.[treeId] ?? [];

/** Current Skill XP for a given tree */
export const selectSkillXP = (treeId) => (state) =>
  state.skillTree?.skillXP?.[treeId] ?? 0;

/**
 * selectTreeProgress — Returns { unlocked, total, percentage } for a tree.
 *
 * @param {string} treeId
 * @returns {{ unlocked: number, total: number, percentage: number }}
 */
export const selectTreeProgress = (treeId) =>
  createSelector(
    (state) => state.skillTree?.unlockedNodes?.[treeId] ?? [],
    (unlockedNodes) => {
      const tree = SKILL_TREES[treeId];
      if (!tree) return { unlocked: 0, total: 0, percentage: 0 };
      const total = tree.nodes.length;
      const unlocked = unlockedNodes.length;
      const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
      return { unlocked, total, percentage };
    }
  );

/**
 * selectNodeAvailability — For a given tree, returns a map of
 * nodeId → 'unlocked' | 'available' | 'locked'
 */
export const selectNodeAvailability = (treeId) =>
  createSelector(
    (state) => state.skillTree?.unlockedNodes?.[treeId] ?? [],
    (state) => state.skillTree?.skillXP?.[treeId] ?? 0,
    (unlockedNodes, currentXP) => {
      const tree = SKILL_TREES[treeId];
      if (!tree) return {};

      const availability = {};
      for (const node of tree.nodes) {
        if (unlockedNodes.includes(node.id)) {
          availability[node.id] = 'unlocked';
        } else {
          const prereqsMet = node.prerequisites.every((prereqId) =>
            unlockedNodes.includes(prereqId)
          );
          const canAfford = currentXP >= node.xpCost;
          availability[node.id] = prereqsMet && canAfford ? 'available' : 'locked';
        }
      }
      return availability;
    }
  );
