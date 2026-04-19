import { createSlice } from '@reduxjs/toolkit';

export const NOTIFICATION_TYPES = {
  ACHIEVEMENT: 'achievement',
  REWARD: 'reward',
  LEVEL_UP: 'levelUp',
  QUEST_UPDATE: 'questUpdate',
  SYSTEM: 'system',
  WARNING: 'warning',
};

export const NOTIFICATION_PRIORITIES = {
  CRITICAL: 3,
  HIGH: 2,
  NORMAL: 1,
  LOW: 0,
};

const MAX_HISTORY = 50;

let _idCounter = 0;

function insertByPriority(queue, notification) {
  const insertIndex = queue.findIndex((n) => n.priority < notification.priority);
  if (insertIndex === -1) {
    queue.push(notification);
  } else {
    queue.splice(insertIndex, 0, notification);
  }
}

const initialState = {
  queue: [],
  activeNotification: null,
  history: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    enqueueNotification: {
      reducer(state, action) {
        const notification = action.payload;
        if (!state.activeNotification) {
          state.activeNotification = notification;
        } else {
          insertByPriority(state.queue, notification);
        }
      },
      prepare(payload) {
        return {
          payload: {
            id: ++_idCounter,
            type: payload.type || NOTIFICATION_TYPES.SYSTEM,
            message: payload.message || '',
            priority: payload.priority ?? NOTIFICATION_PRIORITIES.NORMAL,
            duration: payload.duration ?? 3000,
            data: payload.data || null,
            timestamp: Date.now(),
          },
        };
      },
    },

    dismissNotification(state) {
      if (!state.activeNotification) return;
      // Move active to history
      state.history.unshift(state.activeNotification);
      if (state.history.length > MAX_HISTORY) {
        state.history.length = MAX_HISTORY;
      }
      // Promote next from queue (queue is already sorted by priority)
      state.activeNotification = state.queue.length > 0 ? state.queue.shift() : null;
    },

    clearQueue(state) {
      state.queue = [];
      state.activeNotification = null;
    },
  },

  extraReducers: (builder) => {
    // Backward compat: ui/showNotification enqueues into the new system at NORMAL priority
    builder.addCase('ui/showNotification', (state, action) => {
      const { message, type } = action.payload || {};
      const notification = {
        id: ++_idCounter,
        type: type || NOTIFICATION_TYPES.SYSTEM,
        message: message || '',
        priority: NOTIFICATION_PRIORITIES.NORMAL,
        duration: 3000,
        data: null,
        timestamp: Date.now(),
      };
      if (!state.activeNotification) {
        state.activeNotification = notification;
      } else {
        insertByPriority(state.queue, notification);
      }
    });
  },
});

export const { enqueueNotification, dismissNotification, clearQueue } = notificationSlice.actions;

// Selectors
export const selectActiveNotification = (state) => state.notifications.activeNotification;
export const selectNotificationQueue = (state) => state.notifications.queue;
export const selectNotificationHistory = (state) => state.notifications.history;

export default notificationSlice.reducer;
