/**
 * CEFR-split vocabulary loader.
 *
 * A1-A2 words from vocabulary.json + vocabulary-final.json load eagerly (~700 KB).
 * B1-B2 words from vocabularyExpanded.js load lazily on first access (~1,000 KB).
 *
 * This enables faster initial load — early-game players only need A1-A2 vocabulary.
 */

import curatedWords from './vocabulary.json';
import finalWords from './vocabulary-final.json';

// A1-A2 core words: curated set (all levels) + vocabulary-final A1-A2 entries
// Include curated words regardless of CEFR level (they have richest metadata)
const curatedIds = new Set(curatedWords.map(w => w.id));

const finalA1A2 = finalWords
  .filter(w => w.english != null && w.english !== '' && !curatedIds.has(w.id))
  .filter(w => {
    // Include A1, A2, and entries without cefrLevel (default to A2)
    const level = w.cefrLevel || (w.difficulty <= 2 ? 'A2' : null);
    return !level || level === 'A1' || level === 'A2';
  });

const coreWords = [...curatedWords, ...finalA1A2];

// B1-B2 words from vocabulary-final.json (deferred)
const finalB1B2 = finalWords
  .filter(w => w.english != null && w.english !== '' && !curatedIds.has(w.id))
  .filter(w => w.cefrLevel === 'B1' || w.cefrLevel === 'B2');

let extendedWords = null;
let allWordsCache = null;

/**
 * Lazy-load B1-B2 words from vocabularyExpanded.js.
 * Safe to call multiple times — returns cached result after first load.
 */
export async function loadExtendedVocabulary() {
  if (extendedWords) return extendedWords;
  const { default: expanded } = await import('./vocabularyExpanded.js');
  extendedWords = [...finalB1B2, ...expanded];
  allWordsCache = null; // invalidate merged cache
  return extendedWords;
}

/**
 * Synchronous getter: returns A1-A2 immediately, includes B1-B2 if already loaded.
 */
export function getAllVocabularySync() {
  if (allWordsCache) return allWordsCache;
  const all = extendedWords ? [...coreWords, ...extendedWords] : coreWords;
  // Deduplicate by ID, then by Arabic text (keep first = highest priority)
  const seenId = new Set();
  const seenArabic = new Set();
  const result = [];
  for (const word of all) {
    if (word.id && seenId.has(word.id)) continue;
    if (seenArabic.has(word.arabic)) continue;
    if (word.id) seenId.add(word.id);
    seenArabic.add(word.arabic);
    result.push(word);
  }
  allWordsCache = result;
  return result;
}

/**
 * Async getter: loads everything, returns complete vocabulary.
 */
export async function getAllVocabularyFull() {
  await loadExtendedVocabulary();
  return getAllVocabularySync();
}

export { coreWords };
