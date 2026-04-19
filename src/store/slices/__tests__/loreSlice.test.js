import { describe, it, expect } from 'vitest';
import loreReducer, {
  discoverEntry,
  markRead,
  markAllRead,
  selectDiscoveredIds,
  selectTotalDiscovered,
  selectNewEntryCount,
  selectNewEntryIds,
  selectIsDiscovered,
  selectEntryMeta,
} from '../loreSlice.js';

describe('loreSlice', () => {
  const initial = loreReducer(undefined, { type: '@@INIT' });

  describe('initial state', () => {
    it('starts with empty discovered and newEntries', () => {
      expect(initial.discovered).toEqual({});
      expect(initial.newEntries).toEqual([]);
    });
  });

  describe('discoverEntry', () => {
    it('adds entry to discovered with metadata', () => {
      const state = loreReducer(initial, discoverEntry({ id: 'history_001', trigger: 'zone_visit:oasis-village' }));
      expect(state.discovered['history_001']).toBeDefined();
      expect(state.discovered['history_001'].trigger).toBe('zone_visit:oasis-village');
      expect(state.discovered['history_001'].read).toBe(false);
      expect(typeof state.discovered['history_001'].discoveredAt).toBe('number');
    });

    it('adds entry to newEntries', () => {
      const state = loreReducer(initial, discoverEntry({ id: 'history_001', trigger: 'collection' }));
      expect(state.newEntries).toContain('history_001');
    });

    it('does not duplicate already discovered entries', () => {
      let state = loreReducer(initial, discoverEntry({ id: 'history_001', trigger: 'collection' }));
      const discoveredAt = state.discovered['history_001'].discoveredAt;
      state = loreReducer(state, discoverEntry({ id: 'history_001', trigger: 'npc_talk:ibrahim' }));
      expect(state.discovered['history_001'].discoveredAt).toBe(discoveredAt);
      expect(state.newEntries.filter((id) => id === 'history_001').length).toBe(1);
    });
  });

  describe('markRead', () => {
    it('marks entry as read and removes from newEntries', () => {
      let state = loreReducer(initial, discoverEntry({ id: 'art_001', trigger: 'collection' }));
      state = loreReducer(state, markRead('art_001'));
      expect(state.discovered['art_001'].read).toBe(true);
      expect(state.newEntries).not.toContain('art_001');
    });

    it('handles marking non-existent entry gracefully', () => {
      const state = loreReducer(initial, markRead('nonexistent'));
      expect(state.discovered).toEqual({});
    });
  });

  describe('markAllRead', () => {
    it('marks all entries as read and clears newEntries', () => {
      let state = loreReducer(initial, discoverEntry({ id: 'a', trigger: 'collection' }));
      state = loreReducer(state, discoverEntry({ id: 'b', trigger: 'collection' }));
      state = loreReducer(state, discoverEntry({ id: 'c', trigger: 'collection' }));
      state = loreReducer(state, markAllRead());
      expect(state.newEntries).toEqual([]);
      expect(state.discovered['a'].read).toBe(true);
      expect(state.discovered['b'].read).toBe(true);
      expect(state.discovered['c'].read).toBe(true);
    });
  });

  describe('selectors', () => {
    const mockState = {
      lore: {
        discovered: {
          'history_001': { discoveredAt: 1000, read: true, trigger: 'collection' },
          'art_001': { discoveredAt: 2000, read: false, trigger: 'npc_talk:yusuf' },
        },
        newEntries: ['art_001'],
      },
    };

    it('selectDiscoveredIds returns discovered map', () => {
      expect(selectDiscoveredIds(mockState)).toBe(mockState.lore.discovered);
    });

    it('selectTotalDiscovered returns count', () => {
      expect(selectTotalDiscovered(mockState)).toBe(2);
    });

    it('selectNewEntryCount returns unread count', () => {
      expect(selectNewEntryCount(mockState)).toBe(1);
    });

    it('selectNewEntryIds returns array', () => {
      expect(selectNewEntryIds(mockState)).toEqual(['art_001']);
    });

    it('selectIsDiscovered checks specific entry', () => {
      expect(selectIsDiscovered('history_001')(mockState)).toBe(true);
      expect(selectIsDiscovered('mythology_001')(mockState)).toBe(false);
    });

    it('selectEntryMeta returns metadata or null', () => {
      expect(selectEntryMeta('history_001')(mockState)).toEqual(mockState.lore.discovered['history_001']);
      expect(selectEntryMeta('nonexistent')(mockState)).toBeNull();
    });
  });
});
