import { createSlice, createSelector } from '@reduxjs/toolkit';

/**
 * journalSlice.js — Player journal & identity Redux slice
 *
 * State shape:
 *   entries           — auto-generated timestamped entries from key game events
 *   notes             — player-written free-form notes
 *   discoveredSecrets — set of secretIds the player has found
 *   visitedLandmarks  — set of landmarkIds the player has visited
 *   earnedTitles      — ordered list of earned title IDs
 *   activeTitle       — currently displayed title (titleId or null)
 *
 * Auto-entries are generated for:
 *   - first word learned
 *   - first quest completed
 *   - each zone first visited
 *   - each NPC first met
 *   - each faction milestone
 *   - secrets discovered
 *   - landmark visits
 *   - titles earned
 */

// Journal entry categories for filtering/display
export const JOURNAL_CATEGORIES = {
  LEARNING:  'learning',   // words, grammar, roots
  QUEST:     'quest',      // quest events
  SOCIAL:    'social',     // NPC meetings, friendship milestones
  TRAVEL:    'travel',     // zone/landmark visits
  SECRETS:   'secrets',    // hidden lore discoveries
  FACTION:   'faction',    // faction reputation milestones
  TITLE:     'title',      // titles earned
  NOTE:      'note',       // player-written notes
};

const MAX_ENTRIES = 500;
const MAX_NOTES   = 100;

const initialState = {
  // Auto-generated entries from game events
  entries: [],
  // { id, text, textArabic, category, timestamp }

  // Player-written notes
  notes: [],
  // { id, text, timestamp, edited }

  // Hidden secrets the player has uncovered
  discoveredSecrets: [],
  // [secretId, ...]

  // Landmarks the player has physically visited
  visitedLandmarks: [],
  // [landmarkId, ...]

  // Titles earned, in order
  earnedTitles: [],
  // [titleId, ...]

  // The title currently displayed next to the player's name
  activeTitle: null,
};

// ─────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────

let _entryCounter = 0;
function makeEntryId() {
  _entryCounter += 1;
  return `entry_${Date.now()}_${_entryCounter}`;
}

let _noteCounter = 0;
function makeNoteId() {
  _noteCounter += 1;
  return `note_${Date.now()}_${_noteCounter}`;
}

// ─────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    /**
     * Add an auto-generated journal entry (from a game event).
     * payload: { text, textArabic?, category, timestamp? }
     */
    addJournalEntry(state, action) {
      const {
        text,
        textArabic = '',
        category = JOURNAL_CATEGORIES.NOTE,
        timestamp = Date.now(),
      } = action.payload;

      const entry = {
        id: makeEntryId(),
        text,
        textArabic,
        category,
        timestamp,
      };

      state.entries.unshift(entry); // Most-recent first

      // Cap to MAX_ENTRIES
      if (state.entries.length > MAX_ENTRIES) {
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      }
    },

    /**
     * Add a player-written note.
     * payload: { text } or string
     */
    addNote(state, action) {
      const text = typeof action.payload === 'string'
        ? action.payload
        : action.payload.text;

      if (!text || !text.trim()) return;

      state.notes.unshift({
        id: makeNoteId(),
        text: text.trim(),
        timestamp: Date.now(),
        edited: false,
      });

      if (state.notes.length > MAX_NOTES) {
        state.notes = state.notes.slice(0, MAX_NOTES);
      }
    },

    /**
     * Edit an existing player note.
     * payload: { noteId, text }
     */
    editNote(state, action) {
      const { noteId, text } = action.payload;
      const note = state.notes.find((n) => n.id === noteId);
      if (!note || !text.trim()) return;
      note.text    = text.trim();
      note.edited  = true;
      note.timestamp = Date.now();
    },

    /**
     * Delete a player note by ID.
     * payload: noteId (string)
     */
    deleteNote(state, action) {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
    },

    /**
     * Mark a secret as discovered.
     * payload: secretId (string)
     * Automatically creates a journal entry.
     */
    discoverSecret(state, action) {
      const secretId = action.payload;
      if (state.discoveredSecrets.includes(secretId)) return;

      state.discoveredSecrets.push(secretId);

      // Auto journal entry
      const entry = {
        id: makeEntryId(),
        text: `You discovered a hidden secret: ${secretId}`,
        textArabic: `اكْتَشَفْتَ سِرًّا خَفِيًّا`,
        category: JOURNAL_CATEGORIES.SECRETS,
        timestamp: Date.now(),
      };
      state.entries.unshift(entry);
      if (state.entries.length > MAX_ENTRIES) {
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      }
    },

    /**
     * Record a landmark visit.
     * payload: { landmarkId, landmarkName?, landmarkNameArabic? }
     * Idempotent — only records on first visit.
     */
    visitLandmark(state, action) {
      const {
        landmarkId,
        landmarkName     = landmarkId,
        landmarkNameArabic = '',
      } = action.payload;

      if (state.visitedLandmarks.includes(landmarkId)) return;

      state.visitedLandmarks.push(landmarkId);

      // Auto journal entry
      const entry = {
        id: makeEntryId(),
        text: `You visited ${landmarkName} for the first time.`,
        textArabic: landmarkNameArabic
          ? `زُرْتَ ${landmarkNameArabic} للمرة الأولى.`
          : '',
        category: JOURNAL_CATEGORIES.TRAVEL,
        timestamp: Date.now(),
      };
      state.entries.unshift(entry);
      if (state.entries.length > MAX_ENTRIES) {
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      }
    },

    /**
     * Award the player a title.
     * payload: { titleId, titleName, titleNameArabic }
     * Idempotent — only adds if not already earned.
     */
    earnTitle(state, action) {
      const {
        titleId,
        titleName     = titleId,
        titleNameArabic = '',
      } = action.payload;

      if (state.earnedTitles.includes(titleId)) return;

      state.earnedTitles.push(titleId);

      // Auto journal entry
      const entry = {
        id: makeEntryId(),
        text: `Title earned: "${titleName}"`,
        textArabic: titleNameArabic ? `نِلْتَ لَقَب: "${titleNameArabic}"` : '',
        category: JOURNAL_CATEGORIES.TITLE,
        timestamp: Date.now(),
      };
      state.entries.unshift(entry);
      if (state.entries.length > MAX_ENTRIES) {
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      }
    },

    /**
     * Set the active displayed title.
     * payload: titleId (string) or null to clear
     */
    setActiveTitle(state, action) {
      const titleId = action.payload;
      // Must be earned or null
      if (titleId === null || state.earnedTitles.includes(titleId)) {
        state.activeTitle = titleId;
      }
    },

    /**
     * Bulk-add multiple journal entries at once (e.g. on rehydration or event batching).
     * payload: entry[] — same shape as addJournalEntry payload
     */
    bulkAddJournalEntries(state, action) {
      const newEntries = action.payload.map((e) => ({
        id: makeEntryId(),
        text: e.text || '',
        textArabic: e.textArabic || '',
        category: e.category || JOURNAL_CATEGORIES.NOTE,
        timestamp: e.timestamp || Date.now(),
      }));

      state.entries.unshift(...newEntries);
      if (state.entries.length > MAX_ENTRIES) {
        state.entries = state.entries.slice(0, MAX_ENTRIES);
      }
    },

    /**
     * Clear all player-written notes (e.g. new game / reset).
     */
    clearNotes(state) {
      state.notes = [];
    },
  },
});

// ─────────────────────────────────────────────────────────────
// Exported actions
// ─────────────────────────────────────────────────────────────

export const {
  addJournalEntry,
  addNote,
  editNote,
  deleteNote,
  discoverSecret,
  visitLandmark,
  earnTitle,
  setActiveTitle,
  bulkAddJournalEntries,
  clearNotes,
} = journalSlice.actions;

// ─────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────

export const selectAllJournalEntries = (state) => state.journal?.entries ?? [];
export const selectAllNotes          = (state) => state.journal?.notes   ?? [];
export const selectDiscoveredSecrets = (state) => state.journal?.discoveredSecrets ?? [];
export const selectVisitedLandmarks  = (state) => state.journal?.visitedLandmarks  ?? [];
export const selectEarnedTitles      = (state) => state.journal?.earnedTitles       ?? [];
export const selectActiveTitle       = (state) => state.journal?.activeTitle        ?? null;

export const selectJournalEntryCount = (state) => (state.journal?.entries ?? []).length;
export const selectSecretsCount      = (state) => (state.journal?.discoveredSecrets ?? []).length;
export const selectLandmarksCount    = (state) => (state.journal?.visitedLandmarks  ?? []).length;
export const selectTitlesCount       = (state) => (state.journal?.earnedTitles       ?? []).length;

export const selectHasDiscoveredSecret = (secretId) =>
  (state) => (state.journal?.discoveredSecrets ?? []).includes(secretId);

export const selectHasVisitedLandmark = (landmarkId) =>
  (state) => (state.journal?.visitedLandmarks ?? []).includes(landmarkId);

export const selectHasEarnedTitle = (titleId) =>
  (state) => (state.journal?.earnedTitles ?? []).includes(titleId);

// Entries filtered by category
export const selectEntriesByCategory = (category) =>
  createSelector(
    [selectAllJournalEntries],
    (entries) => entries.filter((e) => e.category === category)
  );

// Latest N entries (default 10) across all categories
export const selectRecentEntries = (n = 10) =>
  createSelector(
    [selectAllJournalEntries],
    (entries) => entries.slice(0, n)
  );

export default journalSlice.reducer;
