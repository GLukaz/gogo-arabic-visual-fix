/**
 * progressSnapshotMiddleware.js — Weekly Player Progress Snapshot
 *
 * Checks once per session whether a weekly snapshot is due (Mondays UTC).
 * When due, captures key stats from Redux state and dispatches a snapshot
 * action that the sync layer can persist to the backend.
 *
 * Snapshot fields (< 500 bytes):
 *   vocabCount, vocabMastered, cefrLevel, achievements,
 *   playtimeMinutes, zonesUnlocked, takenAt (ISO week string)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Date helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the ISO week identifier for a date: 'YYYY-WNN'
 * (e.g. '2026-W15' for the 15th week of 2026).
 *
 * @param {Date} [date]
 * @returns {string}
 */
export function getISOWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  // ISO week: week containing Thursday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/**
 * Returns true if today (UTC) is Monday.
 *
 * @param {Date} [date]
 * @returns {boolean}
 */
export function isMondayUTC(date = new Date()) {
  return date.getUTCDay() === 1; // 0=Sun, 1=Mon
}

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot capture
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive CEFR level from FSRS card count (simple heuristic):
 *   0–49 cards   → A1
 *   50–149 cards → A2
 *   150–399 cards → B1
 *   400+          → B2
 */
function deriveCefrLevel(cardCount) {
  if (cardCount >= 400) return 'B2';
  if (cardCount >= 150) return 'B1';
  if (cardCount >= 50)  return 'A2';
  return 'A1';
}

/**
 * Capture a progress snapshot from the current Redux state.
 *
 * @param {object} state — full Redux state
 * @param {string} weekId — ISO week identifier
 * @returns {object} snapshot
 */
export function captureSnapshot(state, weekId) {
  const fsrsCards   = state.vocabulary?.fsrsCards    ?? {};
  const achievements = state.achievements?.unlocked  ?? [];
  const player      = state.player                   ?? {};
  const difficulty  = state.difficulty               ?? {};

  const vocabCount   = Object.keys(fsrsCards).length;
  // "Mastered" = stability >= 21 days (FSRS stability threshold for >90% retention)
  const vocabMastered = Object.values(fsrsCards).filter(
    (e) => (e?.card?.stability ?? 0) >= 21
  ).length;

  // Playtime: rough estimate from difficulty session history (total minutes)
  const playtimeMinutes = (difficulty.historicalSessions ?? []).reduce(
    (sum, s) => sum + (s.duration ?? 0), 0
  );

  // Zones unlocked from player state
  const zonesUnlocked = player.unlockedZones?.length ?? 0;

  return {
    weekId,
    takenAt: new Date().toISOString(),
    vocabCount,
    vocabMastered,
    cefrLevel: deriveCefrLevel(vocabCount),
    achievements: achievements.length,
    playtimeMinutes,
    zonesUnlocked,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Module-level session guard
// ─────────────────────────────────────────────────────────────────────────────

let _snapshotCheckedThisSession = false;

/** Reset for testing */
export function _resetSnapshotSession() {
  _snapshotCheckedThisSession = false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Selector
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transform an array of snapshots into charting-ready data.
 *
 * Returns an array of objects with normalised keys for chart libraries:
 *   { label: 'W15', vocabCount, vocabMastered, cefrLevel,
 *     achievements, playtimeMinutes, zonesUnlocked }
 *
 * @param {Array<object>} snapshots — raw snapshot objects
 * @returns {Array<object>}
 */
export function selectProgressTrend(snapshots) {
  if (!Array.isArray(snapshots) || snapshots.length === 0) return [];

  return snapshots.map((snap) => ({
    label:          snap.weekId ?? snap.takenAt?.slice(0, 10) ?? '?',
    vocabCount:     snap.vocabCount     ?? 0,
    vocabMastered:  snap.vocabMastered  ?? 0,
    cefrLevel:      snap.cefrLevel      ?? 'A1',
    achievements:   snap.achievements   ?? 0,
    playtimeMinutes: snap.playtimeMinutes ?? 0,
    zonesUnlocked:  snap.zonesUnlocked  ?? 0,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

// Actions that indicate a session has started
const SESSION_START_ACTIONS = [
  'difficulty/startSession',
  'player/loadPlayer',
  'ui/appReady',
];

/**
 * Redux middleware that captures weekly progress snapshots on Mondays.
 *
 * Dispatches { type: 'progressSnapshot/captured', payload: snapshot } once
 * per session on Monday UTC. The sync layer (or a thunk) is responsible for
 * persisting this to the backend.
 */
export const progressSnapshotMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Only check on session-start actions, and only once per session
  if (_snapshotCheckedThisSession) return result;
  if (!SESSION_START_ACTIONS.includes(action.type)) return result;

  _snapshotCheckedThisSession = true;

  // Only capture on Mondays UTC
  if (!isMondayUTC()) return result;

  const weekId = getISOWeekId();
  const snapshot = captureSnapshot(store.getState(), weekId);

  store.dispatch({
    type: 'progressSnapshot/captured',
    payload: snapshot,
  });

  return result;
};
