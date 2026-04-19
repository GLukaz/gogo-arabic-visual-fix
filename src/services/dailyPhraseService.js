/**
 * dailyPhraseService.js — Daily Arabic phrase rotation
 *
 * Returns a practical Arabic phrase for the welcome screen.
 * Phrases rotate by day-of-year, filtered by player's CEFR level.
 */

import { DAILY_PHRASES } from '../data/dailyPhrases.js';

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Get today's phrase appropriate for the player's CEFR level.
 * @param {string} [cefrLevel='A1']
 * @param {Date} [date=new Date()]
 * @returns {Object} Phrase object
 */
export function getTodayPhrase(cefrLevel = 'A1', date = new Date()) {
  const maxIdx = Math.max(0, CEFR_ORDER.indexOf(cefrLevel));
  const eligible = DAILY_PHRASES.filter((p) => {
    const pIdx = CEFR_ORDER.indexOf(p.cefrLevel);
    return pIdx >= 0 && pIdx <= maxIdx;
  });
  if (eligible.length === 0) return DAILY_PHRASES[0] || null;
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return eligible[day % eligible.length];
}

export function getPhrasesByCategory(category) {
  return DAILY_PHRASES.filter((p) => p.category === category);
}

export function getPhraseCategories() {
  return [...new Set(DAILY_PHRASES.map((p) => p.category))];
}
