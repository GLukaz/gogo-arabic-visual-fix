import { describe, it, expect, beforeEach } from 'vitest';
import syncReducer, {
  SyncStatus,
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
} from '../slices/syncSlice.js';

describe('syncSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = syncReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        lastSyncTime: null,
        pendingChanges: false,
        isOnline: true,
        status: SyncStatus.IDLE,
        syncVersion: 0,
        error: null,
        conflictData: null,
      });
    });
  });

  describe('setSyncTime', () => {
    it('should set last sync timestamp', () => {
      const timestamp = '2026-02-09T00:00:00Z';
      const state = syncReducer(initialState, setSyncTime(timestamp));

      expect(state.lastSyncTime).toBe(timestamp);
    });

    it('should update existing timestamp', () => {
      const startState = { ...initialState, lastSyncTime: '2026-01-01T00:00:00Z' };
      const newTimestamp = '2026-02-09T00:00:00Z';
      const state = syncReducer(startState, setSyncTime(newTimestamp));

      expect(state.lastSyncTime).toBe(newTimestamp);
    });
  });

  describe('setPendingChanges', () => {
    it('should set pending changes to true', () => {
      const state = syncReducer(initialState, setPendingChanges(true));

      expect(state.pendingChanges).toBe(true);
    });

    it('should set pending changes to false', () => {
      const startState = { ...initialState, pendingChanges: true };
      const state = syncReducer(startState, setPendingChanges(false));

      expect(state.pendingChanges).toBe(false);
    });
  });

  describe('setOnlineStatus', () => {
    it('should set online status to false', () => {
      const state = syncReducer(initialState, setOnlineStatus(false));

      expect(state.isOnline).toBe(false);
    });

    it('should set online status to true', () => {
      const startState = { ...initialState, isOnline: false };
      const state = syncReducer(startState, setOnlineStatus(true));

      expect(state.isOnline).toBe(true);
    });
  });

  describe('setSyncStatus', () => {
    it('should set sync status to syncing', () => {
      const state = syncReducer(initialState, setSyncStatus(SyncStatus.SYNCING));

      expect(state.status).toBe(SyncStatus.SYNCING);
    });

    it('should set sync status to synced', () => {
      const state = syncReducer(initialState, setSyncStatus(SyncStatus.SYNCED));

      expect(state.status).toBe(SyncStatus.SYNCED);
    });

    it('should set sync status to error', () => {
      const state = syncReducer(initialState, setSyncStatus(SyncStatus.ERROR));

      expect(state.status).toBe(SyncStatus.ERROR);
    });
  });

  describe('setSyncVersion', () => {
    it('should set sync version', () => {
      const state = syncReducer(initialState, setSyncVersion(5));

      expect(state.syncVersion).toBe(5);
    });

    it('should update existing version', () => {
      const startState = { ...initialState, syncVersion: 3 };
      const state = syncReducer(startState, setSyncVersion(10));

      expect(state.syncVersion).toBe(10);
    });
  });

  describe('setSyncError', () => {
    it('should set error message and status to ERROR', () => {
      const error = 'Network error occurred';
      const state = syncReducer(initialState, setSyncError(error));

      expect(state.error).toBe(error);
      expect(state.status).toBe(SyncStatus.ERROR);
    });

    it('should replace existing error', () => {
      const startState = {
        ...initialState,
        error: 'Old error',
        status: SyncStatus.ERROR,
      };
      const newError = 'New error';
      const state = syncReducer(startState, setSyncError(newError));

      expect(state.error).toBe(newError);
      expect(state.status).toBe(SyncStatus.ERROR);
    });
  });

  describe('clearSyncError', () => {
    it('should clear error and reset status to IDLE', () => {
      const startState = {
        ...initialState,
        error: 'Test error',
        status: SyncStatus.ERROR,
      };
      const state = syncReducer(startState, clearSyncError());

      expect(state.error).toBeNull();
      expect(state.status).toBe(SyncStatus.IDLE);
    });

    it('should not change status if not ERROR', () => {
      const startState = {
        ...initialState,
        error: null,
        status: SyncStatus.SYNCING,
      };
      const state = syncReducer(startState, clearSyncError());

      expect(state.error).toBeNull();
      expect(state.status).toBe(SyncStatus.SYNCING);
    });
  });

  describe('syncStarted', () => {
    it('should set status to SYNCING and clear error', () => {
      const startState = {
        ...initialState,
        error: 'Previous error',
      };
      const state = syncReducer(startState, syncStarted());

      expect(state.status).toBe(SyncStatus.SYNCING);
      expect(state.error).toBeNull();
    });
  });

  describe('syncCompleted', () => {
    it('should update all sync completion fields', () => {
      const payload = {
        syncVersion: 10,
        lastSyncedAt: '2026-02-09T00:00:00Z',
      };
      const state = syncReducer(initialState, syncCompleted(payload));

      expect(state.status).toBe(SyncStatus.SYNCED);
      expect(state.syncVersion).toBe(10);
      expect(state.lastSyncTime).toBe('2026-02-09T00:00:00Z');
      expect(state.pendingChanges).toBe(false);
      expect(state.error).toBeNull();
      expect(state.conflictData).toBeNull();
    });

    it('should clear pending changes and errors', () => {
      const startState = {
        ...initialState,
        pendingChanges: true,
        error: 'Some error',
        conflictData: { serverVersion: 5 },
      };

      const payload = {
        syncVersion: 11,
        lastSyncedAt: '2026-02-09T01:00:00Z',
      };
      const state = syncReducer(startState, syncCompleted(payload));

      expect(state.pendingChanges).toBe(false);
      expect(state.error).toBeNull();
      expect(state.conflictData).toBeNull();
    });
  });

  describe('syncConflict', () => {
    it('should set status to CONFLICT and store conflict data', () => {
      const conflictData = {
        serverState: { some: 'data' },
        serverVersion: 15,
      };
      const state = syncReducer(initialState, syncConflict(conflictData));

      expect(state.status).toBe(SyncStatus.CONFLICT);
      expect(state.conflictData).toEqual(conflictData);
    });

    it('should replace existing conflict data', () => {
      const startState = {
        ...initialState,
        status: SyncStatus.CONFLICT,
        conflictData: { serverVersion: 10 },
      };

      const newConflictData = {
        serverState: { new: 'data' },
        serverVersion: 20,
      };
      const state = syncReducer(startState, syncConflict(newConflictData));

      expect(state.conflictData).toEqual(newConflictData);
    });
  });

  describe('clearConflict', () => {
    it('should clear conflict data and reset status to IDLE', () => {
      const startState = {
        ...initialState,
        status: SyncStatus.CONFLICT,
        conflictData: { serverVersion: 5 },
      };
      const state = syncReducer(startState, clearConflict());

      expect(state.conflictData).toBeNull();
      expect(state.status).toBe(SyncStatus.IDLE);
    });

    it('should not change status if not CONFLICT', () => {
      const startState = {
        ...initialState,
        status: SyncStatus.SYNCING,
        conflictData: null,
      };
      const state = syncReducer(startState, clearConflict());

      expect(state.conflictData).toBeNull();
      expect(state.status).toBe(SyncStatus.SYNCING);
    });
  });

  describe('resetSync', () => {
    it('should reset to initial state', () => {
      const startState = {
        lastSyncTime: '2026-02-09T00:00:00Z',
        pendingChanges: true,
        isOnline: false,
        status: SyncStatus.SYNCED,
        syncVersion: 10,
        error: 'Some error',
        conflictData: { serverVersion: 5 },
      };

      const state = syncReducer(startState, resetSync());

      expect(state).toEqual(initialState);
    });
  });

  describe('sync workflow', () => {
    it('should handle complete sync lifecycle', () => {
      // Start sync
      let state = syncReducer(initialState, syncStarted());
      expect(state.status).toBe(SyncStatus.SYNCING);

      // Complete sync
      state = syncReducer(
        state,
        syncCompleted({ syncVersion: 1, lastSyncedAt: '2026-02-09T00:00:00Z' })
      );
      expect(state.status).toBe(SyncStatus.SYNCED);
      expect(state.syncVersion).toBe(1);
    });

    it('should handle sync error workflow', () => {
      // Start sync
      let state = syncReducer(initialState, syncStarted());

      // Encounter error
      state = syncReducer(state, setSyncError('Network timeout'));
      expect(state.status).toBe(SyncStatus.ERROR);
      expect(state.error).toBe('Network timeout');

      // Clear error and retry
      state = syncReducer(state, clearSyncError());
      expect(state.status).toBe(SyncStatus.IDLE);
      expect(state.error).toBeNull();
    });

    it('should handle conflict resolution workflow', () => {
      // Start sync
      let state = syncReducer(initialState, syncStarted());

      // Detect conflict
      state = syncReducer(
        state,
        syncConflict({ serverState: {}, serverVersion: 5 })
      );
      expect(state.status).toBe(SyncStatus.CONFLICT);

      // Resolve conflict
      state = syncReducer(state, clearConflict());
      expect(state.status).toBe(SyncStatus.IDLE);
      expect(state.conflictData).toBeNull();
    });
  });
});
