import { describe, it, expect } from 'vitest';
import leaderboardReducer, {
  setPlayerName,
  createProfile,
  switchProfile,
  removeProfile,
  syncScores,
  hydrateProfiles,
  selectPlayerName,
  selectProfiles,
  selectActiveProfile,
  selectActiveProfileId,
  selectLastSynced,
  selectProfileCount,
  selectCanCreateProfile,
} from '../leaderboardSlice.js';

/**
 * Helper: build a minimal Redux state tree with the leaderboard slice.
 */
function buildState(leaderboardState) {
  return { leaderboard: leaderboardState };
}

describe('leaderboardSlice', () => {
  const initialState = leaderboardReducer(undefined, { type: '@@INIT' });

  // ============================================================
  // Initial state
  // ============================================================

  describe('initial state', () => {
    it('should have empty playerName', () => {
      expect(initialState.playerName).toBe('');
    });

    it('should have empty profiles array', () => {
      expect(initialState.profiles).toEqual([]);
    });

    it('should have null activeProfile', () => {
      expect(initialState.activeProfile).toBeNull();
    });

    it('should have null lastSynced', () => {
      expect(initialState.lastSynced).toBeNull();
    });
  });

  // ============================================================
  // setPlayerName
  // ============================================================

  describe('setPlayerName', () => {
    it('should set the player name', () => {
      const state = leaderboardReducer(initialState, setPlayerName('Alice'));
      expect(state.playerName).toBe('Alice');
    });

    it('should trim whitespace', () => {
      const state = leaderboardReducer(initialState, setPlayerName('  Bob  '));
      expect(state.playerName).toBe('Bob');
    });

    it('should ignore non-string payloads', () => {
      const state = leaderboardReducer(initialState, setPlayerName(123));
      expect(state.playerName).toBe('');
    });
  });

  // ============================================================
  // createProfile
  // ============================================================

  describe('createProfile', () => {
    it('should add a profile to the array', () => {
      const profile = { id: 'p1', name: 'Alice', avatar: '\ud83e\uddd9', createdAt: '2026-01-01' };
      const state = leaderboardReducer(initialState, createProfile(profile));

      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0].name).toBe('Alice');
    });

    it('should auto-activate the first profile', () => {
      const profile = { id: 'p1', name: 'Alice' };
      const state = leaderboardReducer(initialState, createProfile(profile));

      expect(state.activeProfile).toBe('p1');
      expect(state.playerName).toBe('Alice');
    });

    it('should not auto-activate subsequent profiles', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, createProfile({ id: 'p2', name: 'Bob' }));

      expect(state.activeProfile).toBe('p1');
      expect(state.playerName).toBe('Alice');
    });

    it('should reject profiles without id', () => {
      const state = leaderboardReducer(initialState, createProfile({ name: 'Alice' }));
      expect(state.profiles).toHaveLength(0);
    });

    it('should reject profiles without name', () => {
      const state = leaderboardReducer(initialState, createProfile({ id: 'p1' }));
      expect(state.profiles).toHaveLength(0);
    });

    it('should reject duplicate profile IDs', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, createProfile({ id: 'p1', name: 'Bob' }));

      expect(state.profiles).toHaveLength(1);
    });

    it('should enforce max 5 profiles', () => {
      let state = initialState;
      for (let i = 0; i < 6; i++) {
        state = leaderboardReducer(state, createProfile({ id: `p${i}`, name: `Player${i}` }));
      }
      expect(state.profiles).toHaveLength(5);
    });

    it('should assign default avatar if not provided', () => {
      const state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      expect(state.profiles[0].avatar).toBeTruthy();
    });
  });

  // ============================================================
  // switchProfile
  // ============================================================

  describe('switchProfile', () => {
    it('should switch to a valid profile', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, createProfile({ id: 'p2', name: 'Bob' }));
      state = leaderboardReducer(state, switchProfile('p2'));

      expect(state.activeProfile).toBe('p2');
      expect(state.playerName).toBe('Bob');
    });

    it('should not switch to a nonexistent profile', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, switchProfile('nonexistent'));

      expect(state.activeProfile).toBe('p1');
      expect(state.playerName).toBe('Alice');
    });
  });

  // ============================================================
  // removeProfile
  // ============================================================

  describe('removeProfile', () => {
    it('should remove a profile by ID', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, createProfile({ id: 'p2', name: 'Bob' }));
      state = leaderboardReducer(state, removeProfile('p2'));

      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0].name).toBe('Alice');
    });

    it('should switch to first profile when active profile is removed', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, createProfile({ id: 'p2', name: 'Bob' }));
      state = leaderboardReducer(state, switchProfile('p2'));
      state = leaderboardReducer(state, removeProfile('p2'));

      expect(state.activeProfile).toBe('p1');
      expect(state.playerName).toBe('Alice');
    });

    it('should clear active profile when last profile is removed', () => {
      let state = leaderboardReducer(initialState, createProfile({ id: 'p1', name: 'Alice' }));
      state = leaderboardReducer(state, removeProfile('p1'));

      expect(state.activeProfile).toBeNull();
      expect(state.playerName).toBe('');
    });
  });

  // ============================================================
  // syncScores
  // ============================================================

  describe('syncScores', () => {
    it('should set lastSynced to an ISO timestamp', () => {
      const state = leaderboardReducer(initialState, syncScores());
      expect(state.lastSynced).toBeTruthy();
      expect(() => new Date(state.lastSynced)).not.toThrow();
    });
  });

  // ============================================================
  // hydrateProfiles
  // ============================================================

  describe('hydrateProfiles', () => {
    it('should set profiles from an array', () => {
      const profiles = [
        { id: 'p1', name: 'Alice', avatar: '\ud83e\uddd9', createdAt: '2026-01-01' },
        { id: 'p2', name: 'Bob', avatar: '\ud83e\uddde', createdAt: '2026-01-02' },
      ];
      const state = leaderboardReducer(initialState, hydrateProfiles(profiles));
      expect(state.profiles).toHaveLength(2);
    });

    it('should limit to 5 profiles', () => {
      const profiles = Array.from({ length: 8 }, (_, i) => ({
        id: `p${i}`,
        name: `Player${i}`,
      }));
      const state = leaderboardReducer(initialState, hydrateProfiles(profiles));
      expect(state.profiles).toHaveLength(5);
    });

    it('should ignore non-array payloads', () => {
      const state = leaderboardReducer(initialState, hydrateProfiles('not-an-array'));
      expect(state.profiles).toEqual([]);
    });
  });

  // ============================================================
  // Selectors
  // ============================================================

  describe('selectors', () => {
    it('selectPlayerName should return playerName', () => {
      const state = buildState({ ...initialState, playerName: 'Alice' });
      expect(selectPlayerName(state)).toBe('Alice');
    });

    it('selectProfiles should return profiles array', () => {
      const profiles = [{ id: 'p1', name: 'Alice' }];
      const state = buildState({ ...initialState, profiles });
      expect(selectProfiles(state)).toEqual(profiles);
    });

    it('selectActiveProfile should return the active profile object', () => {
      const profiles = [
        { id: 'p1', name: 'Alice' },
        { id: 'p2', name: 'Bob' },
      ];
      const state = buildState({ ...initialState, profiles, activeProfile: 'p2' });
      expect(selectActiveProfile(state)).toEqual({ id: 'p2', name: 'Bob' });
    });

    it('selectActiveProfile should return null if no match', () => {
      const state = buildState(initialState);
      expect(selectActiveProfile(state)).toBeNull();
    });

    it('selectActiveProfileId should return activeProfile id', () => {
      const state = buildState({ ...initialState, activeProfile: 'p1' });
      expect(selectActiveProfileId(state)).toBe('p1');
    });

    it('selectLastSynced should return lastSynced', () => {
      const state = buildState({ ...initialState, lastSynced: '2026-03-27T10:00:00Z' });
      expect(selectLastSynced(state)).toBe('2026-03-27T10:00:00Z');
    });

    it('selectProfileCount should return the number of profiles', () => {
      const profiles = [{ id: 'p1', name: 'A' }, { id: 'p2', name: 'B' }];
      const state = buildState({ ...initialState, profiles });
      expect(selectProfileCount(state)).toBe(2);
    });

    it('selectCanCreateProfile should return true when under limit', () => {
      const profiles = [{ id: 'p1', name: 'A' }];
      const state = buildState({ ...initialState, profiles });
      expect(selectCanCreateProfile(state)).toBe(true);
    });

    it('selectCanCreateProfile should return false at limit', () => {
      const profiles = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}`, name: `P${i}` }));
      const state = buildState({ ...initialState, profiles });
      expect(selectCanCreateProfile(state)).toBe(false);
    });

    it('should handle missing leaderboard state gracefully', () => {
      const state = {};
      expect(selectPlayerName(state)).toBe('');
      expect(selectProfiles(state)).toEqual([]);
      expect(selectActiveProfileId(state)).toBe(null);
      expect(selectLastSynced(state)).toBe(null);
    });
  });
});
