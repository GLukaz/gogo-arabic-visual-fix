import { createSlice } from '@reduxjs/toolkit';
import { FURNITURE } from '../../data/furniture.js';

const GRID_ROWS = 8;
const GRID_COLS = 10;

const initialState = {
  placementGrid: Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null)),
  ownedFurniture: [],  // [{ furnitureId, quantity }]
  utilities: {
    Comfort: 0,
    Knowledge: 0,
    Hospitality: 0,
    Barakah: 0,
  },
};

/**
 * Recalculates utility totals by scanning the entire placement grid.
 * Called internally after every place/remove operation.
 */
function recalcUtilitiesFromGrid(state) {
  const totals = { Comfort: 0, Knowledge: 0, Hospitality: 0, Barakah: 0 };
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const furnitureId = state.placementGrid[row][col];
      if (furnitureId) {
        const item = FURNITURE[furnitureId];
        if (item && item.utilityCategory && totals[item.utilityCategory] !== undefined) {
          totals[item.utilityCategory] += item.utilityValue || 0;
        }
      }
    }
  }
  state.utilities = totals;
}

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    /**
     * Place a furniture item at the given grid cell.
     * Payload: { row, col, furnitureId }
     */
    placeFurniture(state, { payload: { row, col, furnitureId } }) {
      if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return;
      if (state.placementGrid[row][col] !== null) return; // Cell already occupied
      state.placementGrid[row][col] = furnitureId;
      recalcUtilitiesFromGrid(state);
    },

    /**
     * Remove the furniture item at the given grid cell.
     * Payload: { row, col }
     */
    removeFurniture(state, { payload: { row, col } }) {
      if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return;
      state.placementGrid[row][col] = null;
      recalcUtilitiesFromGrid(state);
    },

    /**
     * Add furniture to the player's owned list.
     * Payload: { furnitureId, quantity }
     */
    addOwnedFurniture(state, { payload: { furnitureId, quantity = 1 } }) {
      const existing = state.ownedFurniture.find(f => f.furnitureId === furnitureId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.ownedFurniture.push({ furnitureId, quantity });
      }
    },

    /**
     * Recalculate all utility totals from current grid state.
     * Can be called after bulk operations or rehydration.
     */
    recalculateUtilities(state) {
      recalcUtilitiesFromGrid(state);
    },
  },
});

export const {
  placeFurniture,
  removeFurniture,
  addOwnedFurniture,
  recalculateUtilities,
} = homeSlice.actions;

// Selectors
export const selectPlacementGrid = (state) => state.home?.placementGrid ?? [];
export const selectUtilities = (state) => state.home?.utilities ?? { Comfort: 0, Knowledge: 0, Hospitality: 0, Barakah: 0 };
export const selectUtility = (category) => (state) => state.home?.utilities?.[category] ?? 0;
export const selectOwnedFurniture = (state) => state.home?.ownedFurniture ?? [];

export default homeSlice.reducer;
