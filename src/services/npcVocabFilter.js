/**
 * NPC Vocabulary Filter
 *
 * Feature #8: Adapts NPC dialogue to the player's vocabulary level.
 * Scans Arabic text in dialogue lines and annotates unknown words
 * with transliteration hints, so the player can still understand
 * NPCs even when dialogue contains words they haven't learned.
 */

/**
 * @typedef {Object} AnnotatedWord
 * @property {string} arabic - The Arabic word
 * @property {string} transliteration - Romanized pronunciation (if available)
 * @property {boolean} known - Whether the player has learned this word
 */

/**
 * @typedef {Object} FilteredDialogue
 * @property {string} arabic - Original Arabic text
 * @property {string} english - English translation
 * @property {Array<AnnotatedWord>} annotations - Per-word annotations
 * @property {boolean} hasUnknownWords - True if any words are unknown
 */

/**
 * Strip Arabic diacritics (tashkeel) for matching purposes.
 * @param {string} text
 * @returns {string}
 */
function stripDiacritics(text) {
  return text.replace(/[\u064B-\u0652\u0670]/g, '');
}

/**
 * Build a lookup set from the player's known vocabulary.
 * Includes both with-diacritics and stripped versions for flexible matching.
 *
 * @param {Set<string>|Array<string>} knownWordIds - Word IDs the player knows
 * @param {Array} vocabAll - Full vocabulary array with { id, arabic, transliteration }
 * @returns {{ knownArabicSet: Set<string>, transliterationMap: Map<string, string> }}
 */
export function buildVocabLookup(knownWordIds, vocabAll) {
  const knownSet = knownWordIds instanceof Set ? knownWordIds : new Set(knownWordIds);
  const knownArabicSet = new Set();
  const transliterationMap = new Map();

  for (const word of vocabAll) {
    const stripped = stripDiacritics(word.arabic);
    transliterationMap.set(stripped, word.transliteration || '');

    if (knownSet.has(word.id)) {
      knownArabicSet.add(word.arabic);
      knownArabicSet.add(stripped);
    }
  }

  return { knownArabicSet, transliterationMap };
}

/**
 * Filter a dialogue line — annotate each Arabic word with known/unknown status.
 *
 * @param {Object} dialogueLine - { arabic: string, english: string }
 * @param {Set<string>} knownArabicSet - Set of known Arabic words (stripped)
 * @param {Map<string, string>} transliterationMap - Arabic → transliteration
 * @returns {FilteredDialogue}
 */
export function filterDialogue(dialogueLine, knownArabicSet, transliterationMap) {
  const arabic = dialogueLine.arabic || '';
  const english = dialogueLine.english || '';

  // Split Arabic text into words (preserving punctuation as separate tokens)
  const tokens = arabic.split(/(\s+)/);
  const annotations = [];
  let hasUnknownWords = false;

  for (const token of tokens) {
    // Skip whitespace tokens
    if (/^\s+$/.test(token)) continue;

    // Strip punctuation for matching
    const cleaned = token.replace(/[.,،!?؟:;۔]/g, '').trim();
    if (!cleaned) continue;

    const stripped = stripDiacritics(cleaned);
    const known = knownArabicSet.has(cleaned) || knownArabicSet.has(stripped);

    if (!known) hasUnknownWords = true;

    annotations.push({
      arabic: token,
      transliteration: transliterationMap.get(stripped) || '',
      known,
    });
  }

  return {
    arabic,
    english,
    annotations,
    hasUnknownWords,
  };
}

/**
 * Batch-filter multiple dialogue lines.
 *
 * @param {Array<Object>} dialogueLines - Array of { arabic, english }
 * @param {Set<string>|Array<string>} knownWordIds - Player's known word IDs
 * @param {Array} vocabAll - Full vocabulary array
 * @returns {Array<FilteredDialogue>}
 */
export function filterDialogueBatch(dialogueLines, knownWordIds, vocabAll) {
  const { knownArabicSet, transliterationMap } = buildVocabLookup(knownWordIds, vocabAll);

  return dialogueLines.map((line) =>
    filterDialogue(line, knownArabicSet, transliterationMap)
  );
}

/**
 * Convenience wrapper — filter a single dialogue line for a player.
 * Builds the lookup tables internally from knownWordIds + vocabAll.
 *
 * @param {Object} dialogueLine - { arabic: string, english: string }
 * @param {Set<string>|Array<string>} knownWordIds - Player's known word IDs (FSRS card keys)
 * @param {Array} vocabAll - Full vocabulary array
 * @returns {FilteredDialogue}
 */
export function filterDialogueForPlayer(dialogueLine, knownWordIds, vocabAll) {
  const { knownArabicSet, transliterationMap } = buildVocabLookup(knownWordIds, vocabAll);
  return filterDialogue(dialogueLine, knownArabicSet, transliterationMap);
}
