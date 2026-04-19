import { FURNITURE } from '../../data/furniture.js';
import { store } from '../../store/store.js';
import { placeFurniture, removeFurniture } from '../../store/slices/homeSlice.js';

/**
 * HomeDecoration
 *
 * Logic layer for grid-based home decoration.
 * Manages furniture placement on an NxM grid, enforcing:
 *  - Bounds checking
 *  - Cell occupancy checks
 *  - Player ownership verification
 *
 * Dispatches to homeSlice to keep Redux as the source of truth.
 * No UI — a React component for the decoration UI will be added in a future phase.
 */
export class HomeDecoration {
  constructor(gridRows = 8, gridCols = 10) {
    this.gridRows = gridRows;
    this.gridCols = gridCols;
  }

  /**
   * Check whether a furniture item can be placed at (row, col).
   * Returns false if: out of bounds, cell occupied, or player doesn't own item.
   */
  canPlace(row, col, furnitureId) {
    const state = store.getState();
    const grid = state.home?.placementGrid;
    if (!grid) return false;
    if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) return false;
    if (grid[row][col] !== null) return false; // Cell occupied
    // Check player owns the furniture
    const owned = state.home?.ownedFurniture?.find(f => f.furnitureId === furnitureId);
    return owned && owned.quantity > 0;
  }

  /**
   * Place a furniture item at (row, col).
   * Returns true if placement was dispatched, false if canPlace() rejected.
   */
  place(row, col, furnitureId) {
    if (!this.canPlace(row, col, furnitureId)) return false;
    store.dispatch(placeFurniture({ row, col, furnitureId }));
    return true;
  }

  /**
   * Remove the furniture item at (row, col).
   * Always dispatches regardless of whether cell is occupied.
   * Returns true.
   */
  remove(row, col) {
    store.dispatch(removeFurniture({ row, col }));
    return true;
  }

  /**
   * Get a summary of current utility totals from Redux state.
   * Returns an object keyed by utility category name.
   */
  getUtilitySummary() {
    return store.getState().home?.utilities || {};
  }

  /**
   * Get the FURNITURE entry for the item placed at (row, col).
   * Returns null if the cell is empty or furnitureId is unknown.
   */
  getFurnitureAt(row, col) {
    const grid = store.getState().home?.placementGrid;
    const id = grid?.[row]?.[col];
    return id ? FURNITURE[id] || null : null;
  }
}
