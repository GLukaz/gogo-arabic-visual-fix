/**
 * analyticsEventQueueSlice — FEAT-029
 *
 * Event queue for structured analytics events. Events are queued locally
 * and batch-sent to the server. Session ID is generated on app start and
 * included in all events. Queue is capped at MAX_QUEUE_SIZE (FIFO overflow).
 *
 * NOT persisted — transient queue that is flushed to the server.
 */

import { createSlice } from '@reduxjs/toolkit';

export const MAX_QUEUE_SIZE = 500;

/** Analytics event types */
export const ANALYTICS_EVENT_TYPES = {
  SESSION_START:          'session_start',
  SESSION_END:            'session_end',
  QUIZ_COMPLETED:         'quiz_completed',
  BATTLE_FINISHED:        'battle_finished',
  LEVEL_UP:               'level_up',
  ACHIEVEMENT_UNLOCKED:   'achievement_unlocked',
  FEATURE_USED:           'feature_used',
  ZONE_ENTERED:           'zone_entered',
};

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const initialState = {
  events: [],      // Array of { type, timestamp, sessionId, properties }
  sessionId: null, // Current session identifier
};

const analyticsEventQueueSlice = createSlice({
  name: 'analyticsEventQueue',
  initialState,
  reducers: {
    /**
     * Initialize (or regenerate) the session ID.
     * Called once on app start by analyticsMiddleware.
     */
    initSession(state) {
      state.sessionId = generateSessionId();
    },

    /**
     * Add an event to the queue.
     * payload: { type, properties? }
     * Timestamp and sessionId are injected here.
     */
    enqueueEvent(state, action) {
      const { type, properties = {} } = action.payload;
      const event = {
        type,
        timestamp: Date.now(),
        sessionId: state.sessionId ?? '',
        properties,
      };
      state.events.push(event);
      // FIFO overflow — discard oldest events beyond cap
      if (state.events.length > MAX_QUEUE_SIZE) {
        state.events = state.events.slice(-MAX_QUEUE_SIZE);
      }
    },

    /**
     * Clear all queued events (called after a successful flush to the server).
     */
    flushEvents(state) {
      state.events = [];
    },
  },
});

export const { initSession, enqueueEvent, flushEvents } = analyticsEventQueueSlice.actions;

// ========== SELECTORS ==========

export const selectEventQueue  = (state) => state.analyticsEventQueue?.events ?? [];
export const selectSessionId   = (state) => state.analyticsEventQueue?.sessionId ?? null;

export default analyticsEventQueueSlice.reducer;
