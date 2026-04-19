/**
 * Sentence Generator Service
 *
 * Feature #3: Auto-generates sentence-building exercises from the player's
 * known vocabulary + completed grammar rules. Returns tile-format data
 * compatible with the existing SentenceBuilder.jsx component.
 *
 * Templates:
 *   - الـ + noun (definite article)
 *   - noun + adjective agreement
 *   - verb + noun (subject-verb)
 *   - noun + possessive (إضافة)
 *   - preposition + noun
 */

/**
 * @typedef {Object} GeneratedSentence
 * @property {string} english - English translation
 * @property {string} arabic - Correct Arabic sentence
 * @property {Array<string>} tiles - Correct tiles in order
 * @property {Array<string>} distractorTiles - Extra wrong tiles
 * @property {string} template - Template type used
 */

// Template definitions
const TEMPLATES = [
  {
    id: 'definite_noun',
    pattern: 'الـ + noun',
    requiredGrammar: [], // Always available
    generate: (nouns) => {
      const noun = pickRandom(nouns);
      if (!noun) return null;
      return {
        english: `the ${noun.english}`,
        arabic: `ال${noun.arabic}`,
        tiles: ['الـ', noun.arabic],
        template: 'definite_noun',
      };
    },
  },
  {
    id: 'noun_adjective',
    pattern: 'noun + adjective',
    requiredGrammar: ['noun-adj-agreement'],
    generate: (nouns, adjectives) => {
      const noun = pickRandom(nouns);
      const adj = pickRandom(adjectives);
      if (!noun || !adj) return null;
      return {
        english: `${noun.english} ${adj.english}`,
        arabic: `${noun.arabic} ${adj.arabic}`,
        tiles: [noun.arabic, adj.arabic],
        template: 'noun_adjective',
      };
    },
  },
  {
    id: 'definite_noun_adjective',
    pattern: 'الـ + noun + الـ + adjective',
    requiredGrammar: ['al-definite', 'noun-adj-agreement'],
    generate: (nouns, adjectives) => {
      const noun = pickRandom(nouns);
      const adj = pickRandom(adjectives);
      if (!noun || !adj) return null;
      return {
        english: `the ${adj.english} ${noun.english}`,
        arabic: `ال${noun.arabic} ال${adj.arabic}`,
        tiles: [`ال${noun.arabic}`, `ال${adj.arabic}`],
        template: 'definite_noun_adjective',
      };
    },
  },
  {
    id: 'preposition_noun',
    pattern: 'preposition + noun',
    requiredGrammar: [],
    generate: (nouns, _adj, prepositions) => {
      const prep = pickRandom(prepositions);
      const noun = pickRandom(nouns);
      if (!prep || !noun) return null;
      return {
        english: `${prep.english} the ${noun.english}`,
        arabic: `${prep.arabic} ال${noun.arabic}`,
        tiles: [prep.arabic, `ال${noun.arabic}`],
        template: 'preposition_noun',
      };
    },
  },
  {
    id: 'simple_sentence',
    pattern: 'noun + verb',
    requiredGrammar: [],
    generate: (nouns, _adj, _prep, verbs) => {
      const noun = pickRandom(nouns);
      const verb = pickRandom(verbs);
      if (!noun || !verb) return null;
      return {
        english: `${noun.english} ${verb.english}`,
        arabic: `${noun.arabic} ${verb.arabic}`,
        tiles: [noun.arabic, verb.arabic],
        template: 'simple_sentence',
      };
    },
  },
];

/**
 * Pick a random element from an array.
 */
function pickRandom(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Classify vocabulary words by part of speech.
 * @param {Array} knownWords - Array of vocabulary word objects the player knows
 * @returns {{ nouns: Array, adjectives: Array, verbs: Array, prepositions: Array }}
 */
function classifyWords(knownWords) {
  const nouns = [];
  const adjectives = [];
  const verbs = [];
  const prepositions = [];

  for (const word of knownWords) {
    const pos = (word.partOfSpeech || word.pos || '').toLowerCase();
    if (pos.includes('noun') || pos === 'n') nouns.push(word);
    else if (pos.includes('adj')) adjectives.push(word);
    else if (pos.includes('verb') || pos === 'v') verbs.push(word);
    else if (pos.includes('prep')) prepositions.push(word);
    // Default: treat as noun for flexibility
    else if (word.arabic && word.english) nouns.push(word);
  }

  return { nouns, adjectives, verbs, prepositions };
}

/**
 * Generate distractor tiles from known vocabulary.
 * @param {Array<string>} correctTiles - The correct tile strings
 * @param {Array} allKnown - All known word objects
 * @param {number} count - Number of distractors to generate
 * @returns {Array<string>}
 */
function generateDistractors(correctTiles, allKnown, count = 2) {
  const correctSet = new Set(correctTiles);
  const pool = allKnown
    .map((w) => w.arabic)
    .filter((a) => a && !correctSet.has(a) && !correctSet.has(`ال${a}`));

  // Shuffle and pick
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a sentence-building exercise.
 *
 * @param {Array} knownWords - Vocabulary words the player has FSRS cards for
 * @param {Array<string>} completedGrammar - Array of completed grammar lesson IDs
 * @param {Object} options - { distractorCount }
 * @returns {GeneratedSentence|null}
 */
export function generateSentence(knownWords, completedGrammar = [], options = {}) {
  if (!knownWords || knownWords.length < 2) return null;

  const distractorCount = options.distractorCount ?? 2;
  const { nouns, adjectives, verbs, prepositions } = classifyWords(knownWords);

  // Filter templates to those the player has unlocked
  const completedSet = new Set(completedGrammar);
  const available = TEMPLATES.filter((t) =>
    t.requiredGrammar.every((g) => completedSet.has(g) || completedSet.size === 0)
  );

  if (available.length === 0) return null;

  // Try up to 5 times to generate a valid sentence
  for (let attempt = 0; attempt < 5; attempt++) {
    const template = pickRandom(available);
    const result = template.generate(nouns, adjectives, prepositions, verbs);
    if (result) {
      const distractorTiles = generateDistractors(result.tiles, knownWords, distractorCount);
      return {
        ...result,
        distractorTiles,
      };
    }
  }

  return null;
}

/**
 * Generate multiple sentence exercises.
 *
 * @param {Array} knownWords - Player's known vocabulary
 * @param {Array<string>} completedGrammar - Completed grammar lesson IDs
 * @param {number} count - Number of sentences to generate
 * @returns {Array<GeneratedSentence>}
 */
export function generateSentenceBatch(knownWords, completedGrammar = [], count = 5) {
  const sentences = [];
  const seen = new Set();

  for (let i = 0; i < count * 3 && sentences.length < count; i++) {
    const s = generateSentence(knownWords, completedGrammar);
    if (s && !seen.has(s.arabic)) {
      seen.add(s.arabic);
      sentences.push(s);
    }
  }

  return sentences;
}

// Export templates for testing
export { TEMPLATES, classifyWords, generateDistractors };
