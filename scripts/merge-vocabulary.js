/**
 * merge-vocabulary.js
 *
 * Merges Quranic and practical vocabulary into a final game-ready file,
 * assigns difficulty / zone / category, enriches with root letter data,
 * and writes vocabulary-final.json + vocabulary-stats.json.
 *
 * Input:
 *   - scripts/output/quranic-vocabulary-raw.json
 *   - scripts/output/quranic-roots.json
 *   - scripts/output/practical-vocabulary-raw.json
 *
 * Output:
 *   - scripts/output/vocabulary-final.json
 *   - scripts/output/vocabulary-stats.json
 *
 * Usage:
 *   node scripts/merge-vocabulary.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const QURANIC_VOCAB_PATH = path.join(OUTPUT_DIR, 'quranic-vocabulary-raw.json');
const QURANIC_ROOTS_PATH = path.join(OUTPUT_DIR, 'quranic-roots.json');
const PRACTICAL_VOCAB_PATH = path.join(OUTPUT_DIR, 'practical-vocabulary-raw.json');
const FINAL_OUTPUT_PATH = path.join(OUTPUT_DIR, 'vocabulary-final.json');
const STATS_OUTPUT_PATH = path.join(OUTPUT_DIR, 'vocabulary-stats.json');

// ---------------------------------------------------------------------------
// Zone definitions
// ---------------------------------------------------------------------------
const ZONE_DEFS = [
  {
    zone: 'oasis_village',
    categories: ['greetings', 'family', 'quranic_basic'],
    diffRange: [1, 2],
  },
  {
    zone: 'ancient_library',
    categories: ['alphabet', 'reading', 'writing', 'quranic_core'],
    diffRange: [1, 2],
  },
  {
    zone: 'desert_marketplace',
    categories: ['numbers', 'trade', 'food', 'money'],
    diffRange: [2, 3],
  },
  {
    zone: 'farmland',
    categories: ['nature', 'body', 'verbs', 'verbs_basic', 'animals'],
    diffRange: [2, 3],
  },
  {
    zone: 'bedouin_camp',
    categories: ['time', 'storytelling', 'phrases', 'weather'],
    diffRange: [3, 4],
  },
  {
    zone: 'mountain_village',
    categories: ['weather', 'animals', 'clothing', 'survival'],
    diffRange: [3, 4],
  },
  {
    zone: 'coastal_port',
    categories: ['travel', 'directions', 'trade_goods'],
    diffRange: [4, 5],
  },
  {
    zone: 'royal_palace',
    categories: ['formal_speech', 'adjectives', 'colors', 'governance'],
    diffRange: [4, 5],
  },
];

// Build a quick lookup: category -> preferred zone
const CATEGORY_TO_ZONE = {};
for (const def of ZONE_DEFS) {
  for (const cat of def.categories) {
    // First zone listed wins for a given category
    if (!CATEGORY_TO_ZONE[cat]) {
      CATEGORY_TO_ZONE[cat] = def.zone;
    }
  }
}

const ZONE_ORDER = ZONE_DEFS.map((z) => z.zone);
const IDEAL_PER_ZONE = 250;

// ---------------------------------------------------------------------------
// Arabic helpers
// ---------------------------------------------------------------------------

/**
 * Strip Arabic diacritics (tashkeel) from a string.
 * Diacritics occupy the Unicode range 0x0610-0x061A and 0x064B-0x065F,
 * plus 0x0670 (superscript alef).
 */
function stripDiacritics(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '');
}

// ---------------------------------------------------------------------------
// Difficulty helpers
// ---------------------------------------------------------------------------

/**
 * Compute difficulty from a 1-based frequency rank.
 */
function difficultyFromRank(rank) {
  if (rank <= 100) return 1;
  if (rank <= 300) return 2;
  if (rank <= 600) return 3;
  if (rank <= 1000) return 4;
  return 5;
}

// ---------------------------------------------------------------------------
// Category inference
// ---------------------------------------------------------------------------

/**
 * Infer a category for a Quranic word that has no category field.
 * Uses part-of-speech and rough heuristics.
 */
function inferQuranicCategory(word) {
  const pos = (word.partOfSpeech || '').toLowerCase();
  if (pos === 'verb') return 'verbs';
  if (pos === 'adjective' || pos === 'adj') return 'adjectives';
  if (pos === 'noun') return 'quranic_core';
  if (pos === 'particle' || pos === 'preposition' || pos === 'conjunction') {
    return 'quranic_basic';
  }
  if (pos === 'pronoun' || pos === 'demonstrative') return 'quranic_basic';
  // Default bucket for Quranic words
  return 'quranic_core';
}

// ---------------------------------------------------------------------------
// Zone assignment
// ---------------------------------------------------------------------------

/**
 * Determine the zone for a word based on its category and difficulty.
 * First tries a direct category match, then falls back to difficulty range.
 */
function assignZone(category, difficulty) {
  // Direct category match
  const direct = CATEGORY_TO_ZONE[category];
  if (direct) return direct;

  // Fallback: pick the first zone whose difficulty range contains the word
  for (const def of ZONE_DEFS) {
    if (difficulty >= def.diffRange[0] && difficulty <= def.diffRange[1]) {
      return def.zone;
    }
  }

  // Last resort
  return 'oasis_village';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  // ------------------------------------------------------------------
  // 1. Load input files
  // ------------------------------------------------------------------
  const quranicRaw = loadJsonSafe(QURANIC_VOCAB_PATH, { words: [] });
  const rootsData = loadJsonSafe(QURANIC_ROOTS_PATH, { verbs: [], rootMap: {} });
  const practicalRaw = loadJsonSafe(PRACTICAL_VOCAB_PATH, []);

  // quranic-vocabulary-raw.json may be { meta, words[] } or a plain array
  const quranicVocab = Array.isArray(quranicRaw) ? quranicRaw : (quranicRaw.words || []);
  // practical-vocabulary-raw.json may be a plain array or wrapped
  const practicalVocab = Array.isArray(practicalRaw) ? practicalRaw : (practicalRaw.words || []);

  console.log(`Loaded ${quranicVocab.length} Quranic words`);
  console.log(`Loaded ${rootsData.verbs.length} root verbs, ${Object.keys(rootsData.rootMap).length} roots`);
  console.log(`Loaded ${practicalVocab.length} practical words`);

  // ------------------------------------------------------------------
  // 2. Build root lookup tables from quranic-roots.json
  //    - rootsByArabic: diacritics-stripped verb form -> rootLetters
  //    - rootMap: compact root -> root entry
  // ------------------------------------------------------------------
  const rootsByArabic = {};
  for (const verb of rootsData.verbs) {
    const bare = stripDiacritics(verb.arabic);
    rootsByArabic[bare] = verb.rootLetters;
    // Also index the diacriticed form
    rootsByArabic[verb.arabic] = verb.rootLetters;
  }
  // ------------------------------------------------------------------
  // 3. Normalise Quranic words
  // ------------------------------------------------------------------
  const quranicNormalised = quranicVocab.map((w, idx) => {
    const bare = w.withoutDiacritics || stripDiacritics(w.arabic);
    const rootLetters = lookupRoot(w.arabic, bare, rootsByArabic) || null;
    const rank = idx + 1; // words are already sorted by frequency desc
    const difficulty = difficultyFromRank(rank);
    const category = inferQuranicCategory(w);

    // Build a quranRef from the first reference if available
    let quranRef = null;
    if (Array.isArray(w.quranRefs) && w.quranRefs.length > 0) {
      const ref = w.quranRefs[0];
      if (ref.surah != null && ref.ayah != null) {
        quranRef = { surah: ref.surah, ayah: ref.ayah };
      }
    }

    return {
      _key: bare, // temporary, used for dedup
      arabic: w.arabic,
      withoutDiacritics: bare,
      english: w.english || null,
      transliteration: w.transliteration || null,
      source: 'quran',
      quranRef,
      rootLetters,
      partOfSpeech: w.partOfSpeech || null,
      difficulty,
      category,
      zone: null, // assigned later
      exampleSentence: null,
      frequency: w.frequency || 0,
    };
  });

  // ------------------------------------------------------------------
  // 4. Normalise practical words
  // ------------------------------------------------------------------
  const practicalNormalised = practicalVocab.map((w) => {
    const bare = stripDiacritics(w.arabic);
    const rootLetters = lookupRoot(w.arabic, bare, rootsByArabic) || null;
    const difficulty = w.difficulty || 3; // use pre-assigned difficulty
    const category = (w.category || 'phrases').toLowerCase();

    return {
      _key: bare,
      arabic: w.arabic,
      withoutDiacritics: bare,
      english: w.english || null,
      transliteration: w.transliteration || null,
      source: w.source || 'common',
      quranRef: null,
      rootLetters,
      partOfSpeech: w.partOfSpeech || null,
      difficulty,
      category,
      zone: null,
      exampleSentence: null,
      frequency: w.rank ? Math.max(0, 10000 - w.rank) : 0,
    };
  });

  // ------------------------------------------------------------------
  // 5. Merge and deduplicate
  //    For duplicates (same withoutDiacritics), keep the Quranic version
  //    but enrich with practical's english/transliteration if missing.
  // ------------------------------------------------------------------
  const merged = new Map(); // key: withoutDiacritics -> word object

  // Add Quranic words first (they take priority)
  for (const w of quranicNormalised) {
    merged.set(w._key, w);
  }

  let enriched = 0;
  let practicalOnly = 0;

  for (const w of practicalNormalised) {
    if (merged.has(w._key)) {
      // Enrich existing Quranic word with practical data
      const existing = merged.get(w._key);
      if (!existing.english && w.english) {
        existing.english = w.english;
        enriched++;
      }
      if (!existing.transliteration && w.transliteration) {
        existing.transliteration = w.transliteration;
        enriched++;
      }
      // If the practical word has a better category for zone assignment, note it
      if (existing.category.startsWith('quranic_') && w.category) {
        existing.category = w.category;
      }
    } else {
      merged.set(w._key, w);
      practicalOnly++;
    }
  }

  console.log(`\nMerge results:`);
  console.log(`  Quranic words:      ${quranicNormalised.length}`);
  console.log(`  Practical words:     ${practicalNormalised.length}`);
  console.log(`  Enrichments applied: ${enriched}`);
  console.log(`  Practical-only adds: ${practicalOnly}`);
  console.log(`  Deduplicated total:  ${merged.size}`);

  // ------------------------------------------------------------------
  // 6. Assign zones
  // ------------------------------------------------------------------
  const words = Array.from(merged.values());

  // Remove temp key
  for (const w of words) {
    delete w._key;
  }

  // First pass: assign zone from category + difficulty
  for (const w of words) {
    w.zone = assignZone(w.category, w.difficulty);
  }

  // ------------------------------------------------------------------
  // 7. Balance zones (~250 per zone)
  // ------------------------------------------------------------------
  balanceZones(words);

  // ------------------------------------------------------------------
  // 8. Assign final IDs
  // ------------------------------------------------------------------
  let qIdx = 1;
  let pIdx = 1;
  for (const w of words) {
    if (w.source === 'quran') {
      w.id = `q_${String(qIdx++).padStart(4, '0')}`;
    } else {
      w.id = `p_${String(pIdx++).padStart(4, '0')}`;
    }
  }

  // ------------------------------------------------------------------
  // 9. Sort: zone order, then difficulty asc, then frequency desc
  // ------------------------------------------------------------------
  words.sort((a, b) => {
    const zoneA = ZONE_ORDER.indexOf(a.zone);
    const zoneB = ZONE_ORDER.indexOf(b.zone);
    if (zoneA !== zoneB) return zoneA - zoneB;
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    return (b.frequency || 0) - (a.frequency || 0);
  });

  // Re-assign IDs after sort so they are sequential within zones
  qIdx = 1;
  pIdx = 1;
  for (const w of words) {
    if (w.source === 'quran') {
      w.id = `q_${String(qIdx++).padStart(4, '0')}`;
    } else {
      w.id = `p_${String(pIdx++).padStart(4, '0')}`;
    }
  }

  // ------------------------------------------------------------------
  // 10. Build final output (clean field order)
  // ------------------------------------------------------------------
  const finalOutput = words.map((w) => ({
    id: w.id,
    arabic: w.arabic,
    withoutDiacritics: w.withoutDiacritics,
    english: w.english,
    transliteration: w.transliteration,
    source: w.source,
    quranRef: w.quranRef,
    rootLetters: w.rootLetters,
    partOfSpeech: w.partOfSpeech,
    difficulty: w.difficulty,
    category: w.category,
    zone: w.zone,
    exampleSentence: w.exampleSentence,
    frequency: w.frequency,
  }));

  // ------------------------------------------------------------------
  // 11. Write vocabulary-final.json
  // ------------------------------------------------------------------
  fs.writeFileSync(FINAL_OUTPUT_PATH, JSON.stringify(finalOutput, null, 2), 'utf-8');
  console.log(`\nWrote ${finalOutput.length} words to ${FINAL_OUTPUT_PATH}`);

  // ------------------------------------------------------------------
  // 12. Compute and write stats
  // ------------------------------------------------------------------
  const stats = computeStats(finalOutput);
  fs.writeFileSync(STATS_OUTPUT_PATH, JSON.stringify(stats, null, 2), 'utf-8');
  console.log(`Wrote stats to ${STATS_OUTPUT_PATH}`);

  // Print summary
  printStats(stats);
}

// ---------------------------------------------------------------------------
// Helper: load JSON with a fallback
// ---------------------------------------------------------------------------
function loadJsonSafe(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${filePath} not found, using empty fallback`);
    return fallback;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// Helper: look up root letters for a word
// ---------------------------------------------------------------------------
function lookupRoot(arabic, bare, rootsByArabic) {
  // Try diacriticed form first, then bare
  if (rootsByArabic[arabic]) return rootsByArabic[arabic];
  if (rootsByArabic[bare]) return rootsByArabic[bare];
  return null;
}

// ---------------------------------------------------------------------------
// Helper: balance zones to ~TARGET_PER_ZONE each
// ---------------------------------------------------------------------------
function balanceZones(words) {
  const numZones = ZONE_ORDER.length;
  // Use the larger of IDEAL_PER_ZONE or the even split, so no zone overflows
  // if we have more words than 8*250.
  const targetPerZone = Math.max(IDEAL_PER_ZONE, Math.ceil(words.length / numZones));

  console.log(`  Balance target per zone: ~${targetPerZone} (${words.length} words / ${numZones} zones)`);

  /** Quick count helper */
  function countByZone() {
    const counts = {};
    for (const z of ZONE_ORDER) counts[z] = 0;
    for (const w of words) counts[w.zone] = (counts[w.zone] || 0) + 1;
    return counts;
  }

  const beforeCounts = countByZone();
  console.log('\nZone distribution before balancing:');
  for (const z of ZONE_ORDER) {
    console.log(`  ${z}: ${beforeCounts[z]}`);
  }

  // Strategy: redistribute from oversized zones to undersized zones.
  // We run multiple passes. Each pass:
  //   1. Find zones that are over target; collect their lowest-priority
  //      overflow words (highest difficulty, lowest frequency).
  //   2. Find zones that are under target; assign overflow words to them,
  //      preferring zones whose difficulty range is closest to the word's.

  for (let pass = 0; pass < 15; pass++) {
    const counts = countByZone();
    let anyChange = false;

    // Collect all overflow words from oversized zones
    const pool = [];
    for (let i = 0; i < ZONE_ORDER.length; i++) {
      const zone = ZONE_ORDER[i];
      const excess = counts[zone] - targetPerZone;
      if (excess <= 0) continue;

      // Get zone words, sort by: highest difficulty first, then lowest frequency
      // These are the "least essential" words for this zone.
      const zoneWords = words
        .filter((w) => w.zone === zone)
        .sort((a, b) => b.difficulty - a.difficulty || (a.frequency || 0) - (b.frequency || 0));

      for (let j = 0; j < excess && j < zoneWords.length; j++) {
        pool.push({ word: zoneWords[j], fromZoneIdx: i });
      }
    }

    if (pool.length === 0) break;

    // Sort pool words by difficulty ascending so we assign easiest first
    pool.sort((a, b) => a.word.difficulty - b.word.difficulty || (b.word.frequency || 0) - (a.word.frequency || 0));

    // Assign pool words to undersized zones
    for (const item of pool) {
      const updatedCounts = countByZone();
      // Check that the source zone is still oversized
      const fromZone = ZONE_ORDER[item.fromZoneIdx];
      if (updatedCounts[fromZone] <= targetPerZone) continue;

      // Find the best undersized target zone for this word
      let bestZone = null;
      let bestScore = Infinity;

      for (let i = 0; i < ZONE_ORDER.length; i++) {
        const zone = ZONE_ORDER[i];
        if (updatedCounts[zone] >= targetPerZone) continue;

        const def = ZONE_DEFS[i];
        // Score: distance from zone's difficulty range midpoint to word difficulty
        const mid = (def.diffRange[0] + def.diffRange[1]) / 2;
        const distDiff = Math.abs(item.word.difficulty - mid);
        // Tie-break: prefer zones with the largest deficit
        const deficit = targetPerZone - updatedCounts[zone];
        const score = distDiff * 1000 - deficit;

        if (score < bestScore) {
          bestScore = score;
          bestZone = zone;
        }
      }

      if (bestZone) {
        item.word.zone = bestZone;
        anyChange = true;
      }
    }

    if (!anyChange) break;
  }

  // Re-count after balancing
  const finalCounts = countByZone();

  console.log('\nZone distribution after balancing:');
  for (const z of ZONE_ORDER) {
    console.log(`  ${z}: ${finalCounts[z]}`);
  }
}

// ---------------------------------------------------------------------------
// Helper: compute stats
// ---------------------------------------------------------------------------
function computeStats(words) {
  const bySource = {};
  const byZone = {};
  const byDifficulty = {};
  const byPartOfSpeech = {};

  let wordsWithRoots = 0;
  let wordsWithQuranRef = 0;
  let wordsWithEnglish = 0;
  let wordsWithTransliteration = 0;

  for (const w of words) {
    // By source
    bySource[w.source] = (bySource[w.source] || 0) + 1;

    // By zone
    byZone[w.zone] = (byZone[w.zone] || 0) + 1;

    // By difficulty
    const dk = String(w.difficulty);
    byDifficulty[dk] = (byDifficulty[dk] || 0) + 1;

    // By part of speech
    const pos = w.partOfSpeech || 'unknown';
    byPartOfSpeech[pos] = (byPartOfSpeech[pos] || 0) + 1;

    // Flags
    if (w.rootLetters) wordsWithRoots++;
    if (w.quranRef) wordsWithQuranRef++;
    if (w.english) wordsWithEnglish++;
    if (w.transliteration) wordsWithTransliteration++;
  }

  return {
    totalWords: words.length,
    bySource,
    byZone,
    byDifficulty,
    byPartOfSpeech,
    wordsWithRoots,
    wordsWithQuranRef,
    wordsWithEnglish,
    wordsWithTransliteration,
  };
}

// ---------------------------------------------------------------------------
// Helper: print stats
// ---------------------------------------------------------------------------
function printStats(stats) {
  console.log('\n=== Vocabulary Stats ===');
  console.log(`Total words: ${stats.totalWords}`);

  console.log('\nBy source:');
  for (const [k, v] of Object.entries(stats.bySource)) {
    console.log(`  ${k}: ${v}`);
  }

  console.log('\nBy zone:');
  for (const z of ZONE_ORDER) {
    console.log(`  ${z}: ${stats.byZone[z] || 0}`);
  }

  console.log('\nBy difficulty:');
  for (let d = 1; d <= 5; d++) {
    console.log(`  ${d}: ${stats.byDifficulty[String(d)] || 0}`);
  }

  console.log('\nBy part of speech:');
  for (const [k, v] of Object.entries(stats.byPartOfSpeech).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }

  console.log(`\nWords with roots:           ${stats.wordsWithRoots}`);
  console.log(`Words with Quran ref:       ${stats.wordsWithQuranRef}`);
  console.log(`Words with English:         ${stats.wordsWithEnglish}`);
  console.log(`Words with transliteration: ${stats.wordsWithTransliteration}`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
main();
