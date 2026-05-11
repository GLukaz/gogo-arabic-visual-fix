/**
 * Zone Review Middleware
 *
 * WIRE-02: When the player transitions to a new zone, checks for FSRS-due vocabulary
 * cards associated with that zone and emits MICRO_REVIEW_TRIGGER via EventBus
 * if ≥2 due cards exist, prompting a quick 2-3 word micro-review overlay.
 *
 * Cooldown: at most one micro-review trigger per 10 minutes to avoid annoyance.
 */

import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { getDueCards } from '../../services/fsrs.js';

// Import vocabulary data lazily to avoid circular deps
let _vocabByZone = null;
let _vocabAllLoaded = false;

async function loadVocabAll() {
  try {
    return (await import('../../data/vocabularyAll.js')).default;
  } catch (e) {
    console.error('[zoneReviewMiddleware] Failed to load vocabularyAll:', e);
    return [];
  }
}

export async function getVocabByZone() {
  if (_vocabByZone) return _vocabByZone;

  try {
    const vocabAll = await loadVocabAll();
    if (!vocabAll || vocabAll.length === 0) {
      return {};
    }

    _vocabByZone = {};
    for (const word of vocabAll) {
      const zone = word.zone || 'oasis_village';
      if (!_vocabByZone[zone]) _vocabByZone[zone] = [];
      _vocabByZone[zone].push(word.id);
    }
    _vocabAllLoaded = true;
  } catch (e) {
    console.error('[zoneReviewMiddleware] Error building vocab map:', e);
    _vocabByZone = {};
  }

  return _vocabByZone;
}

// Export for testing
export { loadVocabAll };

const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const MIN_DUE_FOR_TRIGGER = 2;
const MAX_REVIEW_WORDS = 3;
let _lastTriggerTime = 0;

export const zoneReviewMiddleware = (_store) => (next) => (action) => {
  const result = next(action);

  // Only trigger on zone change
  if (action.type !== 'player/setCurrentZone') return result;

  const now = Date.now();
  if (now - _lastTriggerTime < COOLDOWN_MS) return result;

  const state = _store.getState();
  const fsrsCards = state.vocabulary?.fsrsCards ?? {};
  const newZone = action.payload;

  // Async: load vocab map then check due cards
  getVocabByZone().then((vocabByZone) => {
    const zoneWordIds = vocabByZone[newZone] || [];
    if (zoneWordIds.length === 0) return;

    // Filter to words the player has learned (has FSRS card) and are due
    const allDue = getDueCards(fsrsCards);
    const dueSet = new Set(allDue);
    const zoneDue = zoneWordIds.filter((id) => dueSet.has(id));

    if (zoneDue.length >= MIN_DUE_FOR_TRIGGER) {
      _lastTriggerTime = Date.now();
      // Pick up to MAX_REVIEW_WORDS random due words
      const selected = zoneDue.sort(() => Math.random() - 0.5).slice(0, MAX_REVIEW_WORDS);
      EventBus.emit(EVENTS.MICRO_REVIEW_TRIGGER, { wordIds: selected });
    }
  });

  return result;
};

// Export for testing
export { COOLDOWN_MS, MIN_DUE_FOR_TRIGGER, MAX_REVIEW_WORDS };
