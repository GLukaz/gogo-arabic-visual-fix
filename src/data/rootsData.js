/**
 * Quranic Roots Data Module
 *
 * Processes quranic-roots.json to provide:
 * - ROOTS: Map of root letters to derived words and meanings
 * - VERBS: Array of all Quranic verbs with root information
 * - Helper functions to navigate roots <-> words
 */

import quranicRoots from './quranic-roots.json';

// Export the raw verbs array for direct access
export const VERBS = quranicRoots.verbs || [];

// Export the root map (root letters -> derived words)
export const ROOT_MAP = quranicRoots.rootMap || {};

/**
 * Get all derived words for a given root
 * @param {string} rootLetters - Root letters (e.g., "كتب" or "ك ت ب")
 * @returns {Object} Root info with words array and meaning
 */
export function getRootWords(rootLetters) {
  // Normalize: remove spaces
  const normalized = rootLetters.replace(/\s/g, '');
  return ROOT_MAP[normalized] || null;
}

/**
 * Find the root information for a given Arabic word
 * @param {string} arabicWord - The Arabic word to look up
 * @returns {Object|null} Root info { root, rootSpaced, words, meaning }
 */
export function getWordRoot(arabicWord) {
  // First check verbs array
  const verb = VERBS.find(v => v.arabic === arabicWord);
  if (verb && verb.rootLetters) {
    return getRootWords(verb.rootLetters);
  }

  // Then search through root map
  for (const [_rootKey, rootInfo] of Object.entries(ROOT_MAP)) {
    if (rootInfo.words && rootInfo.words.includes(arabicWord)) {
      return rootInfo;
    }
  }

  return null;
}

/**
 * Get all unique roots sorted by frequency
 * @returns {Array} Array of { root, rootSpaced, wordCount, meaning }
 */
export function getAllRoots() {
  return Object.entries(ROOT_MAP).map(([root, info]) => ({
    root,
    rootSpaced: info.rootSpaced || root.split('').join(' '),
    wordCount: info.words ? info.words.length : 0,
    meaning: info.meaning || '',
  })).sort((a, b) => b.wordCount - a.wordCount);
}

/**
 * Get root categories for filtering
 * Categories based on semantic meaning
 */
export const ROOT_CATEGORIES = {
  all: 'All Roots',
  belief: 'Faith & Belief',
  action: 'Actions & Deeds',
  communication: 'Speech & Communication',
  creation: 'Creation & Nature',
  guidance: 'Guidance & Knowledge',
  worship: 'Worship & Prayer',
};

/**
 * Categorize a root based on its meaning
 * @param {string} meaning - The meaning string
 * @returns {string} Category key
 */
export function categorizeRoot(meaning) {
  const lower = meaning.toLowerCase();

  if (lower.includes('believe') || lower.includes('faith') || lower.includes('trust')) {
    return 'belief';
  }
  if (lower.includes('say') || lower.includes('speak') || lower.includes('call') || lower.includes('ask')) {
    return 'communication';
  }
  if (lower.includes('create') || lower.includes('make') || lower.includes('bring forth')) {
    return 'creation';
  }
  if (lower.includes('guide') || lower.includes('know') || lower.includes('teach') || lower.includes('learn')) {
    return 'guidance';
  }
  if (lower.includes('worship') || lower.includes('pray') || lower.includes('fear')) {
    return 'worship';
  }
  if (lower.includes('do') || lower.includes('work') || lower.includes('take') || lower.includes('give')) {
    return 'action';
  }

  return 'all';
}

/**
 * Get roots filtered by category
 * @param {string} category - Category key
 * @returns {Array} Filtered roots
 */
export function getRootsByCategory(category) {
  if (category === 'all') {
    return getAllRoots();
  }

  return getAllRoots().filter(root => categorizeRoot(root.meaning) === category);
}

/**
 * Search roots by Arabic or English
 * @param {string} query - Search term
 * @returns {Array} Matching roots
 */
export function searchRoots(query) {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllRoots();

  const results = [];

  // Search in root letters
  for (const [rootKey, rootInfo] of Object.entries(ROOT_MAP)) {
    if (rootKey.includes(query) ||
        (rootInfo.rootSpaced && rootInfo.rootSpaced.includes(query)) ||
        (rootInfo.meaning && rootInfo.meaning.toLowerCase().includes(lowerQuery))) {
      results.push({
        root: rootKey,
        rootSpaced: rootInfo.rootSpaced || rootKey.split('').join(' '),
        wordCount: rootInfo.words ? rootInfo.words.length : 0,
        meaning: rootInfo.meaning || '',
        words: rootInfo.words || [],
      });
    }
  }

  return results.sort((a, b) => b.wordCount - a.wordCount);
}
