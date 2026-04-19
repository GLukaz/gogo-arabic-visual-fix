/**
 * Tests for Storage Quota Monitoring Middleware
 *
 * Verifies middleware dispatches warning notification at 80% quota threshold
 * and only checks once per session.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { REHYDRATE } from 'redux-persist';

// Mock storage quota functions at module level
vi.mock('../../../services/storage/storageQuota.js', () => ({
  checkStorageQuota: vi.fn(),
  requestPersistentStorage: vi.fn(),
}));

describe('Storage Quota Middleware', () => {
  let mockStore;
  let next;
  let middleware;
  let storageQuotaModule;

  beforeEach(async () => {
    // Use real timers for async operations in middleware
    vi.useRealTimers();

    // Reset modules to clear the session flag
    vi.resetModules();

    // Import mocked storage quota module
    storageQuotaModule = await import('../../../services/storage/storageQuota.js');

    // Import fresh middleware instance (session flag reset)
    const middlewareModule = await import('../storageQuotaMiddleware.js');
    middleware = middlewareModule.storageQuotaMiddleware;

    // Clear all mocks
    vi.clearAllMocks();

    // Create mock store
    mockStore = {
      dispatch: vi.fn(),
      getState: vi.fn(() => ({})),
    };

    // Create mock next function
    next = vi.fn((action) => action);
  });

  describe('REHYDRATE action handling', () => {
    it('checks quota on REHYDRATE action with quota > 80%', async () => {
      // Mock quota check to return 85% usage
      storageQuotaModule.checkStorageQuota.mockResolvedValue({
        available: true,
        percentage: 85,
        usageMB: 8.5,
        quotaMB: 10,
      });
      storageQuotaModule.requestPersistentStorage.mockResolvedValue(true);

      const action = { type: REHYDRATE, payload: {} };

      // Execute middleware
      const result = middleware(mockStore)(next)(action);

      // Action passes through immediately
      expect(result).toEqual(action);
      expect(next).toHaveBeenCalledWith(action);

      // Wait for async quota check
      await vi.waitFor(() => {
        expect(storageQuotaModule.requestPersistentStorage).toHaveBeenCalled();
        expect(storageQuotaModule.checkStorageQuota).toHaveBeenCalled();
      });

      // Wait for notification dispatch
      await vi.waitFor(() => {
        expect(mockStore.dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('showNotification'),
            payload: expect.objectContaining({
              message: expect.stringContaining('Storage almost full'),
              type: 'warning',
            }),
          })
        );
      });
    });

    it('does not dispatch notification when quota < 80%', async () => {
      // Mock quota check to return 50% usage
      storageQuotaModule.checkStorageQuota.mockResolvedValue({
        available: true,
        percentage: 50,
        usageMB: 5,
        quotaMB: 10,
      });
      storageQuotaModule.requestPersistentStorage.mockResolvedValue(true);

      const action = { type: REHYDRATE, payload: {} };

      middleware(mockStore)(next)(action);

      expect(next).toHaveBeenCalledWith(action);

      // Wait for async operations
      await vi.waitFor(() => {
        expect(storageQuotaModule.checkStorageQuota).toHaveBeenCalled();
      });

      // No notification should be dispatched
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch notification when StorageManager unavailable', async () => {
      // Mock quota check to return unavailable
      storageQuotaModule.checkStorageQuota.mockResolvedValue({
        available: false,
        percentage: 0,
      });
      storageQuotaModule.requestPersistentStorage.mockResolvedValue(false);

      const action = { type: REHYDRATE, payload: {} };

      middleware(mockStore)(next)(action);

      expect(next).toHaveBeenCalledWith(action);

      await vi.waitFor(() => {
        expect(storageQuotaModule.checkStorageQuota).toHaveBeenCalled();
      });

      // No notification (quota unavailable)
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('only checks quota once per session', async () => {
      storageQuotaModule.checkStorageQuota.mockResolvedValue({
        available: true,
        percentage: 85,
        usageMB: 8.5,
        quotaMB: 10,
      });
      storageQuotaModule.requestPersistentStorage.mockResolvedValue(true);

      const action1 = { type: REHYDRATE, payload: {} };
      const action2 = { type: REHYDRATE, payload: {} };

      // First REHYDRATE
      middleware(mockStore)(next)(action1);

      await vi.waitFor(() => {
        expect(storageQuotaModule.checkStorageQuota).toHaveBeenCalledTimes(1);
      });

      // Second REHYDRATE
      middleware(mockStore)(next)(action2);

      // Wait a bit to ensure no second call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Still only called once (session flag prevents second check)
      expect(storageQuotaModule.checkStorageQuota).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-persist actions', () => {
    it('passes through non-REHYDRATE actions without quota check', async () => {
      const action = { type: 'player/setName', payload: 'Test Player' };

      const result = middleware(mockStore)(next)(action);

      expect(result).toEqual(action);
      expect(next).toHaveBeenCalledWith(action);

      // Wait a bit to ensure no async operations
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(storageQuotaModule.checkStorageQuota).not.toHaveBeenCalled();
      expect(storageQuotaModule.requestPersistentStorage).not.toHaveBeenCalled();
    });

    it('handles multiple non-REHYDRATE actions correctly', async () => {
      const actions = [
        { type: 'player/levelUp' },
        { type: 'vocabulary/addWord' },
        { type: 'battle/endBattle' },
      ];

      actions.forEach((action) => {
        const result = middleware(mockStore)(next)(action);
        expect(result).toEqual(action);
      });

      expect(next).toHaveBeenCalledTimes(3);

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(storageQuotaModule.checkStorageQuota).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('does not block app startup when quota check fails', async () => {
      storageQuotaModule.checkStorageQuota.mockRejectedValue(new Error('Quota check failed'));
      storageQuotaModule.requestPersistentStorage.mockResolvedValue(true);

      const action = { type: REHYDRATE, payload: {} };

      // Should not throw
      expect(() => {
        middleware(mockStore)(next)(action);
      }).not.toThrow();

      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not block app startup when persistent storage request fails', async () => {
      storageQuotaModule.checkStorageQuota.mockResolvedValue({
        available: true,
        percentage: 50,
      });
      storageQuotaModule.requestPersistentStorage.mockRejectedValue(new Error('Persist request failed'));

      const action = { type: REHYDRATE, payload: {} };

      expect(() => {
        middleware(mockStore)(next)(action);
      }).not.toThrow();

      expect(next).toHaveBeenCalledWith(action);
    });
  });
});
