/**
 * Root Family Service
 *
 * Phase C: Given a vocabulary word, finds its Arabic root letters and returns
 * all other vocabulary words sharing the same root. This enables "word family"
 * displays during vocab teaching moments.
 *
 * Example: learning كَتَبَ (kataba, "he wrote") shows related words:
 *   مَكْتَبَة (maktaba, "library"), كَاتِب (kaatib, "writer"), مَكْتُوب (maktoob, "letter/written")
 */

import { getRootWords, getWordRoot } from '../data/rootsData.js';

// Cache: wordId → family result
const _cache = new Map();

/**
 * Get root family for a vocabulary word.
 *
 * @param {string} wordId - Word ID from vocabulary-final.json
 * @param {string} arabic - Arabic text of the word
 * @param {string|null} rootLetters - Root letters from vocabulary data (e.g., "ك-ت-ب")
 * @returns {{ root: string, rootMeaning: string, familyWords: Array<{arabic: string, english: string, transliteration?: string}> } | null}
 */
export function getRootFamily(wordId, arabic, rootLetters) {
  if (_cache.has(wordId)) return _cache.get(wordId);

  let rootInfo = null;

  // Strategy 1: Use explicit root letters from vocabulary data
  if (rootLetters) {
    const cleaned = rootLetters.replace(/[-\s]/g, '');
    rootInfo = getRootWords(cleaned);
  }

  // Strategy 2: Look up by Arabic text in the root map
  if (!rootInfo && arabic) {
    rootInfo = getWordRoot(arabic);
  }

  if (!rootInfo) {
    _cache.set(wordId, null);
    return null;
  }

  const familyWords = (rootInfo.words || [])
    .filter((w) => w !== arabic) // Exclude the current word
    .slice(0, 4) // Show at most 4 related words
    .map((w) => ({ arabic: w }));

  const result = {
    root: rootInfo.rootSpaced || rootInfo.root || rootLetters,
    rootMeaning: rootInfo.meaning || '',
    familyWords,
  };

  _cache.set(wordId, result);
  return result;
}

/**
 * Clear the cache (for testing).
 */
export function clearRootFamilyCache() {
  _cache.clear();
}
