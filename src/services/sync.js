import * as api from './api.js';
import {
  syncStarted,
  syncCompleted,
  syncConflict,
  setSyncError,
  setPendingChanges,
} from '../store/slices/syncSlice.js';
import { mergeGameStates } from '../utils/syncMerge.js';

/**
 * Debounce timer for auto-sync
 */
let debounceTimer = null;
const DEBOUNCE_DELAY = 5000; // 5 seconds

/**
 * Sync game state to server
 *
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} getState - Redux getState function
 * @returns {Promise<Object>} Sync result
 */
export async function syncGameState(dispatch, getState) {
  try {
    const state = getState();
    const { player, settings, alphabet, quests, vocabulary } = state;
    const { syncVersion } = state.sync;

    dispatch(syncStarted());

    // Derive stats from Redux slices
    const lettersLearned = (alphabet?.completedGroups?.length || 0) * 4; // ~4 letters per group
    const totalQuizzes = quests?.quizzesPassed?.length || 0;
    const correctAnswers = vocabulary?.stats?.totalReviews || 0;

    // Prepare game state payload
    const gameState = {
      player: {
        level: player.level,
        xp: player.xp,
        xpToNext: player.xpToNextLevel,
        dirhams: player.dirhams,
        streak: player.streak,
        lastReviewDate: player.lastPlayedDate,
        wordsLearned: player.wordsLearned,
        lettersLearned,
        totalQuizzes,
        correctAnswers,
        character: {
          bodyType: 'default',
          skinTone: ['light', 'medium', 'tan', 'dark'][player.skinTone] || 'medium',
          outfit: player.outfit,
          headwear: player.headCovering,
        },
        inventory: player.inventory.map(item =>
          typeof item === 'string' ? item : item.itemId
        ),
      },
      settings: {
        masterVolume: settings.masterVolume,
        ambientVolume: settings.ambientVolume,
        sfxVolume: settings.sfxVolume,
        pronunciationVolume: settings.pronunciationVolume,
        showTransliteration: settings.showTransliteration,
        showDiacritics: settings.showDiacritics,
        keyboardMode: settings.keyboardMode,
        difficulty: settings.difficulty,
      },
      clientVersion: syncVersion,
    };

    const result = await api.saveGame(gameState);

    if (result.success) {
      dispatch(syncCompleted({
        syncVersion: result.data.syncVersion,
        lastSyncedAt: result.data.lastSyncedAt,
      }));
      return { success: true };
    } else {
      throw new Error(result.message || 'Save failed');
    }
  } catch (error) {
    // Check if it's a sync conflict (409 status)
    if (error.message && error.message.includes('409')) {
      // Extract conflict data from error response
      // In a real implementation, you'd parse the error response properly
      console.warn('Sync conflict detected, attempting auto-merge');
      // Trigger conflict resolution
      return handleSyncConflict(dispatch, getState, error);
    }

    dispatch(setSyncError(error.message || 'Sync failed'));
    return { success: false, error: error.message };
  }
}

/**
 * Handle sync conflict by auto-merging states
 *
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} getState - Redux getState function
 * @param {Error} conflictError - The conflict error from server
 * @returns {Promise<Object>} Resolution result
 */
async function handleSyncConflict(dispatch, getState, _conflictError) {
  try {
    // In a real implementation, parse the 409 response JSON
    // For now, we'll fetch the server state separately
    const serverDataResult = await api.loadGame();

    if (!serverDataResult.success) {
      throw new Error('Failed to fetch server state for conflict resolution');
    }

    const { gameState: serverState, syncVersion: serverVersion } = serverDataResult.data;

    // Get client state
    const state = getState();
    const clientState = {
      player: {
        level: state.player.level,
        xp: state.player.xp,
        xpToNext: state.player.xpToNextLevel,
        dirhams: state.player.dirhams,
        streak: state.player.streak,
        wordsLearned: state.player.wordsLearned,
        // ... (rest of player state)
      },
      settings: state.settings,
    };

    // Notify about conflict
    dispatch(syncConflict({ serverState, serverVersion }));

    // Auto-merge states
    const mergedState = mergeGameStates(clientState, serverState);

    // Send resolved state back to server
    const resolveResult = await api.resolveConflict({
      resolvedState: mergedState,
      baseVersion: serverVersion,
    });

    if (resolveResult.success) {
      dispatch(syncCompleted({
        syncVersion: resolveResult.data.syncVersion,
        lastSyncedAt: resolveResult.data.lastSyncedAt,
      }));

      // Merged state would need dispatching to individual slices.
      // For now, a page reload with the new syncVersion picks up the server state.
      return { success: true, merged: true };
    } else {
      throw new Error('Failed to resolve conflict');
    }
  } catch (error) {
    dispatch(setSyncError(error.message || 'Conflict resolution failed'));
    return { success: false, error: error.message };
  }
}

/**
 * Schedule an auto-sync with debouncing
 *
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} getState - Redux getState function
 */
export function scheduleAutoSync(dispatch, getState) {
  // Mark pending changes
  dispatch(setPendingChanges(true));

  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Schedule new sync
  debounceTimer = setTimeout(() => {
    syncGameState(dispatch, getState);
  }, DEBOUNCE_DELAY);
}

/**
 * Cancel any pending auto-sync
 */
export function cancelAutoSync() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

/**
 * Initialize sync listeners (e.g., on app start)
 *
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} getState - Redux getState function
 * @returns {Function} Cleanup function
 */
export function initSyncListeners(dispatch, getState) {
  // Listen for window focus to trigger sync
  const handleFocus = () => {
    const state = getState();
    if (state.sync.pendingChanges) {
      syncGameState(dispatch, getState);
    }
  };

  // Listen for online/offline status
  const handleOnline = () => {
    const state = getState();
    if (state.sync.pendingChanges) {
      syncGameState(dispatch, getState);
    }
  };

  window.addEventListener('focus', handleFocus);
  window.addEventListener('online', handleOnline);

  // Return cleanup function
  return () => {
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('online', handleOnline);
    cancelAutoSync();
  };
}

/**
 * Load game state from server on startup
 *
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<Object>} Load result
 */
export async function loadGameState(dispatch) {
  try {
    const result = await api.loadGame();

    if (result.success) {
      const { gameState, syncVersion, lastSyncedAt } = result.data;

      // Update sync version
      dispatch(syncCompleted({
        syncVersion,
        lastSyncedAt,
      }));

      // Return game state for Redux hydration
      return { success: true, gameState };
    } else {
      throw new Error(result.message || 'Load failed');
    }
  } catch (error) {
    dispatch(setSyncError(error.message || 'Load failed'));
    return { success: false, error: error.message };
  }
}
