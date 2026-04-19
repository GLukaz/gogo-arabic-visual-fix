/**
 * Consolidated vocabulary data module.
 *
 * Merges three vocabulary sources into one array (5,000+ words):
 *
 *   1. vocabulary.json        — 250 hand-curated words (richest metadata:
 *                                transliterations, example sentences, audio refs)
 *   2. vocabulary-final.json  — ~970 additional words with English translations
 *   3. vocabularyExpanded.js  — 5,000 CEFR-tagged words (A1/A2/B1/B2)
 *
 * Priority order: curated > vocabulary-final > expanded. If an ID already
 * exists in a higher-priority source, the duplicate from the lower-priority
 * source is excluded.
 *
 * CEFR-split loading (Phase 65-02):
 *   - A1-A2 words load eagerly (vocabulary.json + vocabulary-final A1-A2)
 *   - B1-B2 words load lazily from vocabularyExpanded.js on first access
 *   - The default export starts with A1-A2, then expands when B1-B2 loads
 *
 * Every exported entry is guaranteed to have at minimum:
 *   id, arabic, english, category, difficulty
 *
 * domainAffinity: array of learning path IDs that this word is prioritized for.
 * Assigned post-merge based on the word's category. Used by selectNewCardsByPath
 * to reorder new card queues per player learning path (PATH-03).
 */

import { getAllVocabularySync, loadExtendedVocabulary } from './vocabularyByLevel.js';

// ============================================================
// DOMAIN AFFINITY MAPPING — category → learning path IDs
// ============================================================
const CATEGORY_AFFINITY = {
  // Scholar domain
  grammar: ['scholar'],
  numbers: ['scholar'],
  colors: ['scholar'],
  writing: ['scholar'],
  education: ['scholar'],
  science: ['scholar'],
  mathematics: ['scholar'],
  astronomy: ['scholar'],

  // Traveler domain
  greetings: ['traveler'],
  food: ['traveler'],
  trade: ['traveler'],
  directions: ['traveler'],
  family: ['traveler'],
  body: ['traveler'],
  clothing: ['traveler'],
  daily_life: ['traveler'],
  weather: ['traveler'],

  // Historian domain
  history: ['historian'],
  culture: ['historian'],
  geography: ['historian'],
  architecture: ['historian'],
  religion: ['historian'],
  military: ['historian'],
  government: ['historian'],

  // Shared domains
  nature: ['traveler', 'historian'],
  animals: ['traveler', 'historian'],
  time: ['scholar', 'traveler'],
  phrases: ['traveler', 'scholar'],
  adjectives: ['scholar', 'traveler', 'historian'],
  verbs_basic: ['scholar', 'traveler', 'historian'],

  // Extended Scholar domain
  grammar_patterns: ['scholar'],
  grammar_particles: ['scholar'],
  academic_discourse: ['scholar'],
  verbs_form_II_III: ['scholar'],
  advanced_grammar_forms: ['scholar'],
  advanced_verbs: ['scholar'],
  abstract_general: ['scholar'],
  advanced_nouns_abstract: ['scholar'],
  science_nature: ['scholar'],
  philosophy_advanced: ['scholar'],
  psychology_sociology: ['scholar'],
  verbs_intermediate: ['scholar', 'traveler', 'historian'],
  adjectives_intermediate: ['scholar', 'traveler', 'historian'],

  // Extended Traveler domain
  professions: ['traveler'],
  house_home: ['traveler'],
  travel: ['traveler'],
  health: ['traveler'],
  work_business: ['traveler'],
  transport: ['traveler'],
  emotions: ['traveler', 'scholar'],
  media_communication: ['traveler'],
  shopping: ['traveler'],
  sports_leisure: ['traveler'],
  technology: ['traveler', 'scholar'],
  social_life: ['traveler'],
  city_urban: ['traveler'],
  hospitality: ['traveler'],
  tools_objects: ['traveler'],
  kitchen_cooking: ['traveler'],

  // Extended Historian domain
  history_civilization: ['historian'],
  literary_arabic: ['historian'],
  law_society: ['historian'],
  rhetoric_eloquence: ['historian'],
  arts_culture: ['historian'],
  arts_literature: ['historian'],
  religion_philosophy: ['historian'],
  quranic_classical: ['historian', 'scholar'],
  islamic_sciences_advanced: ['historian'],
  philosophy_thought: ['scholar', 'historian'],

  // Extended Shared domains
  economy_finance: ['traveler', 'historian'],
  politics_governance: ['historian', 'scholar'],
  environment: ['traveler', 'historian'],
  medicine_health: ['scholar', 'traveler'],
  education_teaching: ['scholar'],
  language_linguistics: ['scholar'],
  music_arts: ['historian', 'traveler'],
  agriculture: ['traveler', 'historian'],
  maritime_naval: ['traveler', 'historian'],
  advanced_natural_science: ['scholar'],
  islamic_jurisprudence: ['historian'],
  calligraphy_art: ['historian', 'scholar'],
  poetry_literature: ['historian'],
  astronomy_advanced: ['scholar'],
  philosophy_ethics: ['scholar', 'historian'],
  diplomacy: ['historian', 'traveler'],
  trade_commerce: ['traveler'],
  crafts_manufacturing: ['traveler', 'historian'],
  urban_planning: ['historian'],
  water_irrigation: ['traveler', 'historian'],
  navigation: ['traveler'],
  textiles: ['traveler'],
  ceramics_pottery: ['historian'],
  metallurgy: ['scholar', 'historian'],
  optics_physics: ['scholar'],
  alchemy_chemistry: ['scholar'],
  cartography: ['historian', 'scholar'],
  music_theory: ['historian'],
  medicine_pharmacology: ['scholar'],
  library_sciences: ['scholar'],
};

/**
 * Post-process vocabulary: assign domainAffinity and infer CEFR levels.
 */
function enrichVocabulary(words) {
  for (const word of words) {
    // Assign domain affinity
    word.domainAffinity = CATEGORY_AFFINITY[word.category] || [];

    // Normalize fields for vocabulary-final entries
    if (!word.transliteration) word.transliteration = word.transliteration || null;
    if (!word.category) word.category = 'general';
    if (!word.difficulty) word.difficulty = 1;
    if (!word.audioRef) word.audioRef = word.audioRef || null;
    if (!word.npcSource) word.npcSource = word.npcSource || null;
    if (!word.exampleSentence) word.exampleSentence = word.exampleSentence || null;

    // Infer CEFR level for legacy words lacking cefrLevel
    if (!word.cefrLevel) {
      if (word.frequency >= 4000) word.cefrLevel = 'A1';
      else if (word.frequency >= 2000) word.cefrLevel = 'A2';
      else if (word.frequency >= 500) word.cefrLevel = 'B1';
      else if (word.frequency != null) word.cefrLevel = 'B2';
      else if (word.difficulty === 1) word.cefrLevel = 'A1';
      else if (word.difficulty === 2) word.cefrLevel = 'A2';
      else if (word.difficulty === 3) word.cefrLevel = 'B1';
      else if (word.difficulty === 4) word.cefrLevel = 'B2';
      else word.cefrLevel = 'A2'; // safe fallback
    }
  }
  return words;
}

// Get initial vocabulary (A1-A2 eagerly loaded)
const vocabulary = enrichVocabulary(getAllVocabularySync());

// Trigger background load of B1-B2 words — the array reference stays the same,
// but getAllVocabularySync() will return the expanded set after load completes.
// Components that re-render (e.g., on Redux state change) will pick up new words.
loadExtendedVocabulary().then(() => {
  const full = getAllVocabularySync();
  enrichVocabulary(full);
}).catch(() => {});

// Dev-mode affinity summary (stripped by bundler in production via dead-code elimination)
if (import.meta.env.DEV) {
  const summary = { scholar: 0, traveler: 0, historian: 0, shared: 0, none: 0 };
  for (const w of vocabulary) {
    const a = w.domainAffinity;
    if (a.length === 0) summary.none++;
    else if (a.length > 1) summary.shared++;
    else summary[a[0]]++;
  }
  // eslint-disable-next-line no-console
  console.debug('[vocabularyAll] domainAffinity distribution:', summary);
}

export default vocabulary;
export { loadExtendedVocabulary };
