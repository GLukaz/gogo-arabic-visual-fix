import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * Sync status values
 */
export const SyncStatus = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  CONFLICT: 'conflict',
  ERROR: 'error',
};

const initialState = {
  lastSyncTime: null,
  pendingChanges: false,
  isOnline: true,
  status: SyncStatus.IDLE, // idle | syncing | synced | conflict | error
  syncVersion: 0, // Current known server version
  error: null, // Last error message
  conflictData: null, // { serverState, serverVersion } when conflict occurs
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    /**
     * Set last sync timestamp
     */
    setSyncTime(state, action) {
      state.lastSyncTime = action.payload;
    },

    /**
     * Mark if there are unsaved changes
     */
    setPendingChanges(state, action) {
      state.pendingChanges = action.payload;
    },

    /**
     * Update online/offline status
     */
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
    },

    /**
     * Update sync status
     */
    setSyncStatus(state, action) {
      state.status = action.payload;
    },

    /**
     * Set current sync version
     */
    setSyncVersion(state, action) {
      state.syncVersion = action.payload;
    },

    /**
     * Set sync error
     */
    setSyncError(state, action) {
      state.error = action.payload;
      state.status = SyncStatus.ERROR;
    },

    /**
     * Clear sync error
     */
    clearSyncError(state) {
      state.error = null;
      if (state.status === SyncStatus.ERROR) {
        state.status = SyncStatus.IDLE;
      }
    },

    /**
     * Start sync operation
     */
    syncStarted(state) {
      state.status = SyncStatus.SYNCING;
      state.error = null;
    },

    /**
     * Sync completed successfully
     */
    syncCompleted(state, action) {
      // action.payload: { syncVersion, lastSyncedAt }
      state.status = SyncStatus.SYNCED;
      state.syncVersion = action.payload.syncVersion;
      state.lastSyncTime = action.payload.lastSyncedAt;
      state.pendingChanges = false;
      state.error = null;
      state.conflictData = null;
    },

    /**
     * Sync conflict detected
     */
    syncConflict(state, action) {
      // action.payload: { serverState, serverVersion }
      state.status = SyncStatus.CONFLICT;
      state.conflictData = action.payload;
    },

    /**
     * Clear conflict data after resolution
     */
    clearConflict(state) {
      state.conflictData = null;
      if (state.status === SyncStatus.CONFLICT) {
        state.status = SyncStatus.IDLE;
      }
    },

    /**
     * Reset sync state (e.g., on logout)
     */
    resetSync(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSyncTime,
  setPendingChanges,
  setOnlineStatus,
  setSyncStatus,
  setSyncVersion,
  setSyncError,
  clearSyncError,
  syncStarted,
  syncCompleted,
  syncConflict,
  clearConflict,
  resetSync,
} = syncSlice.actions;

// --- Selectors ---
export const selectSyncStatus = (state) => state.sync.status;
export const selectLastSyncTime = (state) => state.sync.lastSyncTime;
export const selectPendingChanges = (state) => state.sync.pendingChanges;
export const selectIsOnline = (state) => state.sync.isOnline;
export const selectSyncVersion = (state) => state.sync.syncVersion;
export const selectSyncError = (state) => state.sync.error;
export const selectConflictData = (state) => state.sync.conflictData;
export const selectSyncSummary = createSelector(
  [(state) => state.sync.status, (state) => state.sync.error, (state) => state.sync.lastSyncTime],
  (status, error, lastSyncTime) => ({ status, error, lastSyncTime })
);

export default syncSlice.reducer;
