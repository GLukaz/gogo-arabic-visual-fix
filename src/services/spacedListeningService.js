/**
 * Spaced Listening Service
 *
 * Feature #2: Ambient Arabic audio for FSRS-due words while exploring.
 * Uses Web Speech Synthesis API to play Arabic words at configurable intervals.
 * Pauses during battles, dialogues, and quizzes.
 */

import { getDueCards } from './fsrs.js';

const DEFAULT_INTERVAL_MS = 45_000; // 45 seconds between words
const MIN_INTERVAL_MS = 15_000;
const MAX_INTERVAL_MS = 120_000;

let _timer = null;
let _isRunning = false;
let _intervalMs = DEFAULT_INTERVAL_MS;
let _getState = null; // Redux getState reference
let _wordQueue = [];
let _queueIndex = 0;

/**
 * Check if Speech Synthesis is available and supports Arabic.
 * @returns {boolean}
 */
export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Build the word queue from FSRS-due vocabulary in the current zone.
 * @param {Object} fsrsCards - From state.vocabulary.fsrsCards
 * @param {string} currentZone - Current zone ID
 * @param {Array} vocabAll - Full vocabulary array
 * @returns {Array<{ id: string, arabic: string }>}
 */
function buildWordQueue(fsrsCards, currentZone, vocabAll) {
  const allDueIds = new Set(getDueCards(fsrsCards));

  // Filter to words in current zone that are due
  const zoneWords = vocabAll.filter(
    (w) => (w.zone === currentZone || !w.zone) && allDueIds.has(w.id)
  );

  // Shuffle
  return zoneWords
    .map((w) => ({ id: w.id, arabic: w.arabic }))
    .sort(() => Math.random() - 0.5);
}

/**
 * Speak an Arabic word using Web Speech Synthesis.
 * @param {string} arabic - Arabic text to speak
 * @param {number} volume - 0-1 volume level
 * @returns {Promise<void>}
 */
function speakArabic(arabic, volume = 0.7) {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) return resolve();

    const utterance = new SpeechSynthesisUtterance(arabic);
    utterance.lang = 'ar';
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.volume = Math.max(0, Math.min(1, volume));

    utterance.onend = resolve;
    utterance.onerror = resolve; // Don't fail the loop

    speechSynthesis.speak(utterance);
  });
}

/**
 * Check if the game is in a state where listening should be paused.
 * @param {Object} state - Redux state
 * @returns {boolean}
 */
function shouldPause(state) {
  // Pause during battles
  if (state.battle?.activeBattle) return true;

  // Pause if muted
  if (state.settings?.isMuted) return true;

  // Pause if pronunciation volume is 0
  if (state.settings?.pronunciationVolume === 0) return true;

  return false;
}

/**
 * Play the next word in the queue.
 */
async function playNext() {
  if (!_isRunning || !_getState) return;

  const state = _getState();
  if (shouldPause(state)) return; // Skip this tick, try again next interval

  if (_wordQueue.length === 0) return;

  // Wrap around
  if (_queueIndex >= _wordQueue.length) _queueIndex = 0;

  const word = _wordQueue[_queueIndex];
  _queueIndex++;

  const volume = (state.settings?.pronunciationVolume ?? 100) / 100;
  const masterVolume = (state.settings?.masterVolume ?? 70) / 100;
  const effectiveVolume = volume * masterVolume;

  await speakArabic(word.arabic, effectiveVolume);
}

/**
 * Start the spaced listening loop.
 * @param {Function} getState - Redux store.getState
 * @param {Array} vocabAll - Full vocabulary array (loaded once)
 * @param {Object} options - { intervalMs }
 */
export function startListening(getState, vocabAll, options = {}) {
  if (!isSpeechSynthesisSupported()) return;

  _getState = getState;
  _intervalMs = Math.max(
    MIN_INTERVAL_MS,
    Math.min(MAX_INTERVAL_MS, options.intervalMs || DEFAULT_INTERVAL_MS)
  );

  const state = getState();
  const fsrsCards = state.vocabulary?.fsrsCards ?? {};
  const currentZone = state.player?.currentZone ?? 'oasis_village';

  _wordQueue = buildWordQueue(fsrsCards, currentZone, vocabAll);
  _queueIndex = 0;
  _isRunning = true;

  // Clear any existing timer
  if (_timer) clearInterval(_timer);
  _timer = setInterval(playNext, _intervalMs);
}

/**
 * Stop the spaced listening loop.
 */
export function stopListening() {
  _isRunning = false;
  if (_timer) {
    clearInterval(_timer);
    _timer = null;
  }
  if (isSpeechSynthesisSupported()) {
    speechSynthesis.cancel();
  }
}

/**
 * Refresh the word queue (e.g., on zone change).
 * @param {Array} vocabAll - Full vocabulary array
 */
export function refreshQueue(vocabAll) {
  if (!_getState) return;
  const state = _getState();
  const fsrsCards = state.vocabulary?.fsrsCards ?? {};
  const currentZone = state.player?.currentZone ?? 'oasis_village';
  _wordQueue = buildWordQueue(fsrsCards, currentZone, vocabAll);
  _queueIndex = 0;
}

/**
 * Set the interval between words.
 * @param {number} ms - Interval in milliseconds (15000–120000)
 */
export function setInterval(ms) {
  _intervalMs = Math.max(MIN_INTERVAL_MS, Math.min(MAX_INTERVAL_MS, ms));
  if (_isRunning && _timer) {
    clearInterval(_timer);
    _timer = globalThis.setInterval(playNext, _intervalMs);
  }
}

/**
 * Check if listening is currently active.
 * @returns {boolean}
 */
export function isListening() {
  return _isRunning;
}

// Export for testing
export { buildWordQueue, shouldPause, playNext };
