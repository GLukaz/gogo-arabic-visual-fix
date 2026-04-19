/**
 * Tests for Storage Quota Management
 *
 * Verifies quota checking with mocked StorageManager API and persistent storage requests.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkStorageQuota, requestPersistentStorage } from '../storageQuota.js';

describe('Storage Quota Management', () => {
  let originalNavigator;

  beforeEach(() => {
    // Save original navigator
    originalNavigator = global.navigator;
  });

  afterEach(() => {
    // Restore original navigator
    global.navigator = originalNavigator;
  });

  describe('checkStorageQuota', () => {
    it('returns correct percentage when StorageManager available', async () => {
      // Mock navigator.storage.estimate to return 80% usage
      global.navigator = {
        storage: {
          estimate: vi.fn().mockResolvedValue({
            usage: 8_000_000, // 8MB
            quota: 10_000_000, // 10MB
          }),
        },
      };

      const result = await checkStorageQuota();

      expect(result.available).toBe(true);
      expect(result.usage).toBe(8_000_000);
      expect(result.quota).toBe(10_000_000);
      expect(result.percentage).toBe(80);
      expect(result.usageMB).toBeCloseTo(7.63, 1); // 8MB / 1024 / 1024
      expect(result.quotaMB).toBeCloseTo(9.54, 1); // 10MB / 1024 / 1024
    });

    it('returns unavailable when StorageManager not available', async () => {
      // Mock navigator without storage API
      global.navigator = {};

      const result = await checkStorageQuota();

      expect(result.available).toBe(false);
      expect(result.usage).toBe(0);
      expect(result.quota).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.usageMB).toBe(0);
      expect(result.quotaMB).toBe(0);
    });

    it('returns unavailable when estimate method missing', async () => {
      // Mock navigator.storage without estimate method
      global.navigator = {
        storage: {},
      };

      const result = await checkStorageQuota();

      expect(result.available).toBe(false);
      expect(result.percentage).toBe(0);
    });

    it('handles estimate errors gracefully', async () => {
      // Mock navigator.storage.estimate to throw error
      global.navigator = {
        storage: {
          estimate: vi.fn().mockRejectedValue(new Error('Estimate failed')),
        },
      };

      const result = await checkStorageQuota();

      expect(result.available).toBe(false);
      expect(result.percentage).toBe(0);
    });

    it('calculates percentage correctly for different usage levels', async () => {
      // Test 0% usage
      global.navigator = {
        storage: {
          estimate: vi.fn().mockResolvedValue({
            usage: 0,
            quota: 10_000_000,
          }),
        },
      };

      let result = await checkStorageQuota();
      expect(result.percentage).toBe(0);

      // Test 50% usage
      global.navigator.storage.estimate.mockResolvedValue({
        usage: 5_000_000,
        quota: 10_000_000,
      });

      result = await checkStorageQuota();
      expect(result.percentage).toBe(50);

      // Test 100% usage
      global.navigator.storage.estimate.mockResolvedValue({
        usage: 10_000_000,
        quota: 10_000_000,
      });

      result = await checkStorageQuota();
      expect(result.percentage).toBe(100);
    });
  });

  describe('requestPersistentStorage', () => {
    it('returns true when persistent storage granted', async () => {
      global.navigator = {
        storage: {
          persist: vi.fn().mockResolvedValue(true),
        },
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(true);
      expect(global.navigator.storage.persist).toHaveBeenCalled();
    });

    it('returns false when persistent storage denied', async () => {
      global.navigator = {
        storage: {
          persist: vi.fn().mockResolvedValue(false),
        },
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });

    it('returns false when storage API unavailable', async () => {
      global.navigator = {};

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });

    it('returns false when persist method missing', async () => {
      global.navigator = {
        storage: {},
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });

    it('handles persist errors gracefully', async () => {
      global.navigator = {
        storage: {
          persist: vi.fn().mockRejectedValue(new Error('Persist failed')),
        },
      };

      const result = await requestPersistentStorage();

      expect(result).toBe(false);
    });
  });
});
