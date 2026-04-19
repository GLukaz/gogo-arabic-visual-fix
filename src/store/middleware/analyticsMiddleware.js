/**
 * analyticsMiddleware.js — FEAT-029
 *
 * Intercepts key Redux actions and emits structured analytics events into
 * the analyticsEventQueue slice. Events are queued locally and can be
 * batch-flushed to the server via flushAnalytics().
 *
 * Tracked events:
 *   achievements/recordQuizTypeResult → quiz_completed
 *   battle/endBattle                  → battle_finished
 *   player/addXP (level change)       → level_up
 *   achievements/unlockAchievement    → achievement_unlocked
 *   player/setCurrentZone             → zone_entered
 *   analytics/startSession            → session_start
 *   analytics/endSession              → session_end
 *   ui/openInventory                  → feature_used (inventory)
 *   ui/openJournal                    → feature_used (journal)
 *   ui/openRecipeBook                 → feature_used (recipeBook)
 */

import {
  enqueueEvent,
  initSession,
  flushEvents,
  selectEventQueue,
  ANALYTICS_EVENT_TYPES,
} from '../slices/analyticsEventQueueSlice.js';

// ─────────────────────────────────────────────────────────────────────────────
// Action → event mapping
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map Redux action types to analytics event builders.
 * Each entry returns { type, properties } for enqueueEvent.
 */
const ACTION_EVENT_MAP = {
  'achievements/recordQuizTypeResult': (action) => ({
    type: ANALYTICS_EVENT_TYPES.QUIZ_COMPLETED,
    properties: {
      quizType: action.payload?.quizType ?? null,
      perfect:  action.payload?.perfect  ?? false,
    },
  }),

  'battle/endBattle': (action) => ({
    type: ANALYTICS_EVENT_TYPES.BATTLE_FINISHED,
    properties: {
      victory:  action.payload?.victory  ?? false,
      accuracy: action.payload?.accuracy ?? null,
      bossId:   action.payload?.bossId   ?? null,
    },
  }),

  'achievements/unlockAchievement': (action) => ({
    type: ANALYTICS_EVENT_TYPES.ACHIEVEMENT_UNLOCKED,
    properties: {
      achievementId: action.payload?.id ?? action.payload?.achievementId ?? null,
    },
  }),

  'player/setCurrentZone': (action) => ({
    type: ANALYTICS_EVENT_TYPES.ZONE_ENTERED,
    properties: {
      zone: action.payload ?? null,
    },
  }),

  'analytics/startSession': (action) => ({
    type: ANALYTICS_EVENT_TYPES.SESSION_START,
    properties: {
      sessionType: action.payload?.type ?? null,
    },
  }),

  'analytics/endSession': () => ({
    type: ANALYTICS_EVENT_TYPES.SESSION_END,
    properties: {},
  }),

  'ui/openInventory': () => ({
    type: ANALYTICS_EVENT_TYPES.FEATURE_USED,
    properties: { featureName: 'inventory' },
  }),

  'ui/openJournal': () => ({
    type: ANALYTICS_EVENT_TYPES.FEATURE_USED,
    properties: { featureName: 'journal' },
  }),

  'ui/openRecipeBook': () => ({
    type: ANALYTICS_EVENT_TYPES.FEATURE_USED,
    properties: { featureName: 'recipeBook' },
  }),
};

// Internal slice prefix — skip tracking these to avoid infinite loops
const QUEUE_SLICE_PREFIX = 'analyticsEventQueue/';

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

export const analyticsMiddleware = (store) => {
  let sessionInitialized = false;

  return (next) => (action) => {
    // Skip our own internal slice actions (prevents infinite dispatch loops)
    if (typeof action.type === 'string' && action.type.startsWith(QUEUE_SLICE_PREFIX)) {
      return next(action);
    }

    // Initialize session ID once before any user action
    if (!sessionInitialized) {
      sessionInitialized = true;
      store.dispatch(initSession());
    }

    // Snapshot player level BEFORE the action processes (for level_up detection)
    const preState = store.getState();
    const prevLevel = preState.player?.level ?? null;

    const result = next(action);

    // ── Level-up detection ──────────────────────────────────────────────────
    if (action.type === 'player/addXP' && prevLevel !== null) {
      const newLevel = store.getState().player?.level ?? prevLevel;
      if (newLevel > prevLevel) {
        store.dispatch(enqueueEvent({
          type: ANALYTICS_EVENT_TYPES.LEVEL_UP,
          properties: { level: newLevel, previousLevel: prevLevel },
        }));
      }
    }

    // ── Mapped action events ────────────────────────────────────────────────
    const eventBuilder = ACTION_EVENT_MAP[action.type];
    if (eventBuilder) {
      const event = eventBuilder(action);
      store.dispatch(enqueueEvent(event));
    }

    return result;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// flushAnalytics — batch-send queued events to the server
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send all queued analytics events to /api/analytics.
 * No-ops gracefully if offline or server returns an error.
 *
 * @param {object} store — Redux store (real or mock)
 * @returns {Promise<{ sent: number, reason?: string }>}
 */
export async function flushAnalytics(store) {
  const state = store.getState();
  const events = selectEventQueue(state);

  if (events.length === 0) {
    return { sent: 0 };
  }

  // No-op if browser reports offline
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { sent: 0, reason: 'offline' };
  }

  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });

    if (response.ok) {
      store.dispatch(flushEvents());
      return { sent: events.length };
    }
    return { sent: 0, reason: `http_${response.status}` };
  } catch {
    // Network error or fetch not available — no-op
    return { sent: 0, reason: 'error' };
  }
}
