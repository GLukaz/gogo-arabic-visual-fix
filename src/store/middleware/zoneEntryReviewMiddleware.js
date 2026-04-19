/**
 * Zone Entry Micro-Review Middleware
 *
 * Listens for `world/enterZone` actions. When a player enters a zone that has
 * FSRS-due vocabulary, selects up to 3 of the most urgent cards and dispatches
 * microReview/suggest so the UI can surface a quick-review overlay.
 *
 * Cooldown: 1 hour per zone — the same zone will not trigger again within that window.
 *
 * Urgency score: (now - dueDate) / (stability × DAY_MS)
 *   Higher score = more overdue relative to the card's review interval.
 *   Only cards that are already past their due date are eligible.
 *
 * Action shape: { type: 'world/enterZone', payload: { zoneId } }
 *   or           { type: 'world/enterZone', payload: '<zoneId string>' }
 */

import { suggest } from '../slices/microReviewSlice.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const HOUR_MS  = 60 * 60 * 1000;
const DAY_MS   = 24 * 60 * 60 * 1000;

/** Maximum number of words to include in one micro-review. */
export const MAX_REVIEW_CARDS = 3;

/** Cooldown duration per zone before another micro-review can trigger. */
export const COOLDOWN_MS = HOUR_MS;

// ── Module-level state (reset-able for tests) ─────────────────────────────────

/** Per-zone last-trigger timestamps: { [zoneId]: timestampMs } */
let _zoneCooldowns = {};

/** Cached zone → word-ID map loaded from vocabulary data. */
let _vocabByZone = null;

/** Expose for test isolation. */
export function _resetZoneState() {
  _zoneCooldowns = {};
  _vocabByZone   = null;
}

export function _getZoneCooldowns() {
  return _zoneCooldowns;
}

/** Allow tests to inject a zone→wordId map without loading vocabulary data. */
export function _setVocabByZone(map) {
  _vocabByZone = map;
}

// ── Vocabulary zone lookup ────────────────────────────────────────────────────

async function loadVocabByZone() {
  if (_vocabByZone) return _vocabByZone;

  const vocabAll = (await import('../../data/vocabularyAll.js')).default;
  const map = {};
  for (const word of vocabAll) {
    const zone = word.zone || 'oasis_village';
    if (!map[zone]) map[zone] = [];
    map[zone].push(word.id);
  }
  _vocabByZone = map;
  return _vocabByZone;
}

// ── Pure function ─────────────────────────────────────────────────────────────

/**
 * Select up to MAX_REVIEW_CARDS due vocabulary cards for a zone, ordered by urgency.
 *
 * @param {string} zoneId           - Zone identifier
 * @param {{ [wordId]: { card: Object } }} vocabCards - FSRS card map from Redux state
 * @param {Date|number} now         - Reference time (Date or epoch ms)
 * @param {string[]|null} zoneWordIds - Word IDs belonging to this zone.
 *   When null, all words in vocabCards are considered (fallback / testing without vocab data).
 * @returns {string[]} Ordered array of word IDs (most urgent first), length ≤ MAX_REVIEW_CARDS
 */
export function getZoneDueCards(zoneId, vocabCards, now, zoneWordIds = null) {
  if (!vocabCards) return [];

  const nowMs      = now instanceof Date ? now.getTime() : Number(now);
  const candidates = zoneWordIds
    ? zoneWordIds.filter((id) => vocabCards[id]?.card)
    : Object.keys(vocabCards);

  const scored = [];

  for (const wordId of candidates) {
    const data = vocabCards[wordId];
    if (!data?.card) continue;

    const card = data.card;

    // Skip new/unreviewed cards
    if (!card.reps || card.reps === 0) continue;
    if (!card.stability || !card.due) continue;

    const dueMs = new Date(card.due).getTime();

    // Only include cards that are already past their due date
    if (dueMs > nowMs) continue;

    // Urgency: how overdue is this card relative to its review interval?
    const urgency = (nowMs - dueMs) / (card.stability * DAY_MS);
    scored.push({ wordId, urgency });
  }

  // Sort descending — highest urgency (most overdue) first
  scored.sort((a, b) => b.urgency - a.urgency);

  return scored.slice(0, MAX_REVIEW_CARDS).map((s) => s.wordId);
}

// ── Middleware ────────────────────────────────────────────────────────────────

export const zoneEntryReviewMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type !== 'world/enterZone') return result;

  // Support both string payload and { zoneId } object payload
  const zoneId = typeof action.payload === 'string'
    ? action.payload
    : action.payload?.zoneId;

  if (!zoneId) return result;

  const now     = Date.now();
  const lastRun = _zoneCooldowns[zoneId] ?? 0;

  // Honour per-zone cooldown
  if (now - lastRun < COOLDOWN_MS) return result;

  const state      = store.getState();
  const vocabCards = state.vocabulary?.fsrsCards ?? {};

  loadVocabByZone().then((vocabByZone) => {
    const zoneWordIds = vocabByZone[zoneId] ?? null;
    const selected    = getZoneDueCards(zoneId, vocabCards, new Date(now), zoneWordIds);

    if (selected.length === 0) return;

    _zoneCooldowns[zoneId] = now;
    store.dispatch(suggest({ zoneId, cards: selected }));
  });

  return result;
};
