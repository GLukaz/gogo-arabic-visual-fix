/**
 * leechDetection.js — FSRS Leech Detection and Suspension
 *
 * Words that have lapsed 5+ times are "leeches" — they consistently fail
 * and need special treatment: shorter review intervals and optional suspension.
 *
 * Pure utility functions — no Redux imports, no side effects.
 */

/** Number of lapses before a card is considered a leech */
export const LEECH_THRESHOLD = 5;

/** Minimum scheduled_days after leech penalty is applied */
export const LEECH_MIN_INTERVAL = 1;

/**
 * Returns true if a card is considered a leech (lapses >= LEECH_THRESHOLD).
 *
 * @param {Object|null} card - FSRS card object
 * @returns {boolean}
 */
export function isLeech(card) {
  if (!card) return false;
  return (card.lapses ?? 0) >= LEECH_THRESHOLD;
}

/**
 * Returns all leeched card entries from the fsrsCards map, sorted by lapse count (highest first).
 *
 * @param {Object} allCards - { wordId: { card, log, source, ... } }
 * @returns {Array<{ wordId: string, card: Object, lapses: number }>}
 */
export function getLeechCards(allCards) {
  if (!allCards || typeof allCards !== 'object') return [];
  return Object.entries(allCards)
    .filter(([, data]) => data && data.card && isLeech(data.card))
    .map(([wordId, data]) => ({
      wordId,
      card: data.card,
      lapses: data.card.lapses,
    }))
    .sort((a, b) => b.lapses - a.lapses);
}

/**
 * Returns a modified card with a 50% shorter scheduled interval.
 * The due date is recalculated from now using the reduced interval.
 * Uses Math.max to enforce a minimum interval of 1 day.
 *
 * @param {Object} card - FSRS card object
 * @returns {Object} New card object with adjusted scheduled_days and due
 */
export function applyLeechIntervalPenalty(card) {
  if (!card) return card;
  const originalDays = card.scheduled_days ?? 1;
  const newScheduledDays = Math.max(LEECH_MIN_INTERVAL, Math.floor(originalDays * 0.5));
  // Recalculate due from now using the reduced interval
  const newDue = new Date(Date.now() + newScheduledDays * 86400000).toISOString();
  return { ...card, scheduled_days: newScheduledDays, due: newDue };
}
