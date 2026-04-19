/**
 * leaderboardSlice.js — Phase 91
 *
 * Redux state for multi-profile local leaderboard system.
 * Manages player profiles and sync timestamps.
 * All localStorage operations are delegated to multiProfileLeaderboardService.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  /** Display name for the current player */
  playerName: '',
  /** Array of profile objects: { id, name, avatar, createdAt } */
  profiles: [],
  /** ID of the currently active profile */
  activeProfile: null,
  /** ISO timestamp of last leaderboard sync to localStorage */
  lastSynced: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    /**
     * Set the current player's display name.
     * payload: string
     */
    setPlayerName(state, action) {
      const name = action.payload;
      if (typeof name === 'string') {
        state.playerName = name.trim();
      }
    },

    /**
     * Create a new local profile.
     * payload: { id, name, avatar, createdAt }
     */
    createProfile(state, action) {
      const profile = action.payload;
      if (!profile || !profile.id || !profile.name) return;

      // Max 5 profiles
      if (state.profiles.length >= 5) return;

      // No duplicate IDs
      if (state.profiles.find((p) => p.id === profile.id)) return;

      state.profiles.push({
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar || '\ud83e\uddd1\u200d\ud83c\udfeb',
        createdAt: profile.createdAt || new Date().toISOString(),
      });

      // Auto-activate if first profile
      if (state.profiles.length === 1) {
        state.activeProfile = profile.id;
        state.playerName = profile.name;
      }
    },

    /**
     * Switch to a different profile.
     * payload: profileId string
     */
    switchProfile(state, action) {
      const profileId = action.payload;
      const profile = state.profiles.find((p) => p.id === profileId);
      if (profile) {
        state.activeProfile = profileId;
        state.playerName = profile.name;
      }
    },

    /**
     * Remove a profile by ID.
     * payload: profileId string
     */
    removeProfile(state, action) {
      const profileId = action.payload;
      state.profiles = state.profiles.filter((p) => p.id !== profileId);

      // If the removed profile was active, switch to the first available
      if (state.activeProfile === profileId) {
        if (state.profiles.length > 0) {
          state.activeProfile = state.profiles[0].id;
          state.playerName = state.profiles[0].name;
        } else {
          state.activeProfile = null;
          state.playerName = '';
        }
      }
    },

    /**
     * Record that scores were synced to localStorage.
     */
    syncScores(state) {
      state.lastSynced = new Date().toISOString();
    },

    /**
     * Hydrate profiles from localStorage (called on app start).
     * payload: Array of profile objects
     */
    hydrateProfiles(state, action) {
      const profiles = action.payload;
      if (Array.isArray(profiles)) {
        state.profiles = profiles.slice(0, 5);
      }
    },
  },
});

export const {
  setPlayerName,
  createProfile,
  switchProfile,
  removeProfile,
  syncScores,
  hydrateProfiles,
} = leaderboardSlice.actions;

// ========== SELECTORS ==========

export const selectPlayerName = (state) => state.leaderboard?.playerName ?? '';

export const selectProfiles = (state) => state.leaderboard?.profiles ?? [];

export const selectActiveProfile = createSelector(
  [(state) => state.leaderboard?.profiles ?? [], (state) => state.leaderboard?.activeProfile],
  (profiles, activeId) => profiles.find((p) => p.id === activeId) || null
);

export const selectActiveProfileId = (state) => state.leaderboard?.activeProfile ?? null;

export const selectLastSynced = (state) => state.leaderboard?.lastSynced ?? null;

export const selectProfileCount = createSelector(
  [selectProfiles],
  (profiles) => profiles.length
);

export const selectCanCreateProfile = createSelector(
  [selectProfileCount],
  (count) => count < 5
);

export default leaderboardSlice.reducer;
