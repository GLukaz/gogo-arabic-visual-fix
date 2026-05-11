#!/usr/bin/env node

/**
 * extract-quran-vocab.js
 *
 * Extracts Quranic vocabulary from:
 *   1. quran-json chapter files (114 surahs with Arabic text + translations)
 *   2. Mendeley quran-morphology.csv (word-level morphological analysis)
 *
 * Outputs the top 1500 content-word stems sorted by frequency to:
 *   scripts/output/quranic-vocabulary-raw.json
 *
 * Usage: node scripts/extract-quran-vocab.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const QURAN_JSON_DIR = path.resolve(__dirname, '../../quran-json/dist/chapters/en');
const MORPHOLOGY_CSV = path.resolve(__dirname, '../../gogo-arabic-assets/mendeley/quran-morphology.csv');
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'quranic-vocabulary-raw.json');

// ---------------------------------------------------------------------------
// Part-of-speech mapping from Morph_tag to simplified category
// ---------------------------------------------------------------------------
const MORPH_TAG_TO_POS = {
  // Nouns
  NOUN_ABSTRACT: 'noun',
  NOUN_CONCRETE: 'noun',
  NOUN_PROP: 'noun',
  NOUN_PROP_FOREIGN: 'noun',
  NOUN_ACTIVE_PART: 'noun',      // active participle (acts as noun/adj)
  NOUN_PASSIVE_PART: 'noun',     // passive participle
  NOUN_TIME_PLACE: 'noun',       // noun of time/place
  NOUN_NUM: 'noun',              // numeral noun
  NOUN_FIVE: 'noun',             // the five special nouns
  NOUN_RELATIVE: 'noun',         // relative noun
  NOUN_INSTRUMENT: 'noun',       // noun of instrument
  NOUN_VERB_LIKE: 'noun',        // noun resembling a verb
  NOUN_DIMINUTIVE: 'noun',       // diminutive noun
  EXCEPT_NOUN: 'noun',           // exception noun

  // Gerunds (verbal nouns — still nouns)
  GERUND: 'noun',
  GERUND_MEEM: 'noun',           // meem gerund
  GERUND_INSTANT: 'noun',        // instantaneous gerund
  GERUND_PROFESSION: 'noun',     // profession gerund
  GERUND_STATE: 'noun',          // state gerund

  // Verbs
  PV: 'verb',                    // perfect verb
  IV: 'verb',                    // imperfect verb
  CV: 'verb',                    // imperative verb
  PV_PASS: 'verb',              // passive perfect verb
  IV_PASS: 'verb',              // passive imperfect verb
  UNINFLECTED_VERB: 'verb',     // uninflected verb

  // Adjectives
  ADJ: 'adjective',
  ADJ_QUALIT: 'adjective',      // qualitative adjective
  ADJ_COMP: 'adjective',        // comparative adjective
  ADJ_INTENS: 'adjective',      // intensive adjective

  // Adverbs
  ADV: 'adverb',
  REL_ADV: 'adverb',            // relative adverb

  // Prepositions
  PREP: 'preposition',

  // Pronouns
  PRON: 'pronoun',
  DEM_PRON: 'pronoun',
  DEM_PRON_MS: 'pronoun',
  DEM_PRON_MP: 'pronoun',
  DEM_PRON_F: 'pronoun',
  DEM_PRON_FS: 'pronoun',
  REL_PRON: 'pronoun',
  INTERROG_PRON: 'pronoun',
  PRON_1S: 'pronoun',
  PRON_2MS: 'pronoun',
  PRON_2MP: 'pronoun',
  PRON_3MP: 'pronoun',

  // Particles / conjunctions / determiners / negation / other function words
  CONJ: 'particle',
  PART: 'particle',
  NEG_PART: 'particle',
  ANNUL_PART: 'particle',
  SUBJUNC_PART: 'particle',
  CONDITION_PART: 'particle',
  EXCEPT_PART: 'particle',
  JUSSIVE_PART: 'particle',
  INF_ANNUL_PART: 'particle',
  CERT_PART: 'particle',
  VOC_PART: 'particle',
  INTERROG_PART: 'particle',
  KAAFA_MAKFOUFA: 'particle',
  YES_NO_RESP_PART: 'particle',
  FUTUR_PART: 'particle',
  FUT_PART: 'particle',
  INF_SUBJUNC_PART: 'particle',

  // Other / foreign
  OTHER: 'other',
  FOREIGN: 'other',
  CURRENCY: 'other',
  ABBREV: 'other',
};

// ---------------------------------------------------------------------------
// Common function words to exclude (too simple / grammatical, not content)
// These are the undiacritized forms (Without_Diacritics column).
// ---------------------------------------------------------------------------
const FUNCTION_WORDS_TO_EXCLUDE = new Set([
  // Prepositions
  'في', 'من', 'الي', 'إلى', 'على', 'علي', 'عن', 'الى',
  'ب', 'ل', 'ك',

  // Pronouns
  'هو', 'هي', 'هم', 'هن', 'أنا', 'نحن', 'أنت', 'أنتم',
  'أنتن', 'هما', 'أنتما',

  // Demonstratives
  'ذلك', 'تلك', 'هذا', 'هذه', 'هؤلاء', 'ذا', 'ذي',
  'اولئك', 'أولئك',

  // Relative pronouns
  'الذي', 'التي', 'الذين', 'اللذين', 'اللتين', 'اللاتي',
  'اللائي', 'اللواتي',

  // Conjunctions / particles
  'و', 'ف', 'ثم', 'أو', 'أم', 'بل', 'لكن',

  // Negation
  'لا', 'لم', 'لن', 'ما', 'ليس',

  // Other common particles
  'إن', 'أن', 'ان', 'كان', 'قد', 'إذ', 'إذا', 'لو',
  'حتى', 'مع', 'عند', 'بين', 'بعد', 'قبل', 'فوق', 'تحت',
  'منذ', 'كل', 'كلا', 'بعض', 'غير',
  'يا', 'أي', 'إلا', 'نعم', 'بلى',

  // إياك forms
  'إياك', 'إياكم', 'إياه', 'إياهم', 'إيانا',

  // Very short / purely grammatical stems that slip through
  'ال', 'اذ', 'اذا',
]);

// ---------------------------------------------------------------------------
// CSV parser (manual, no external deps)
// ---------------------------------------------------------------------------
function parseCSV(text) {
  // Remove BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(',');

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = line.split(',');
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (fields[j] || '').trim();
    }
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {

  // ---- 1. Read morphology CSV ----
  const csvText = fs.readFileSync(MORPHOLOGY_CSV, 'utf-8');
  const morphRows = parseCSV(csvText);

  // ---- 2. Filter to Stems only ----
  const stems = morphRows.filter(r => r.Morph_type === 'Stem');

  // ---- 3. Read all 114 chapter JSON files ----
  const chapters = [];
  for (let i = 1; i <= 114; i++) {
    const filePath = path.join(QURAN_JSON_DIR, `${i}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  WARNING: Missing chapter file ${filePath}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    chapters.push(data);
  }

  // ---- 4. Build word frequency map from stems ----
  //
  // Key: Without_Diacritics (undiacritized stem form)
  // Value: { arabic, withoutDiacritics, partOfSpeech, morphTag, frequency, quranRefs }
  //
  const vocabMap = new Map();

  for (const row of stems) {
    const segmentedWord = row.Segmented_Word;
    const morphTag = row.Morph_tag;
    const surah = parseInt(row.Sura_No, 10);
    const ayah = parseInt(row.Verse_No, 10);

    // Skip rows with empty or null segmented words
    if (!segmentedWord || segmentedWord === '(null)') continue;
    // Skip rows with empty morph tag
    if (!morphTag) continue;

    const pos = MORPH_TAG_TO_POS[morphTag];
    if (!pos) continue; // unknown tag, skip

    // Use the Segmented_Word as the stem form for grouping, but
    // group by the Without_Diacritics column (the full word without diacritics)
    // since stems from the same surface word share the same Without_Diacritics.
    // Actually, we group by the segmented stem form (undiacritized stem),
    // because Without_Diacritics is the full word including prefixes.
    // The Segmented_Word for stems IS the undiacritized stem.
    const stemKey = segmentedWord;

    if (vocabMap.has(stemKey)) {
      const entry = vocabMap.get(stemKey);
      entry.frequency += 1;
      // Keep first 3 quran references
      if (entry.quranRefs.length < 3) {
        // Avoid duplicate refs
        const alreadyHas = entry.quranRefs.some(
          ref => ref.surah === surah && ref.ayah === ayah
        );
        if (!alreadyHas) {
          entry.quranRefs.push({ surah, ayah });
        }
      }
    } else {
      vocabMap.set(stemKey, {
        arabic: row.Word,          // diacritized full word (first occurrence)
        withoutDiacritics: stemKey, // undiacritized stem
        english: null,
        transliteration: null,
        partOfSpeech: pos,
        quranRefs: [{ surah, ayah }],
        frequency: 1,
        morphTag: morphTag,
      });
    }
  }


  // ---- 5. Convert to array, sort by frequency descending ----
  let vocab = Array.from(vocabMap.values());
  vocab.sort((a, b) => b.frequency - a.frequency);

  // ---- 6. Filter out function words ----
  const beforeFilter = vocab.length;
  vocab = vocab.filter(entry => {
    // Exclude entries in the function-word exclusion list
    if (FUNCTION_WORDS_TO_EXCLUDE.has(entry.withoutDiacritics)) return false;

    // Exclude particles, prepositions, pronouns (pos-level filter)
    if (entry.partOfSpeech === 'particle') return false;
    if (entry.partOfSpeech === 'preposition') return false;
    if (entry.partOfSpeech === 'pronoun') return false;
    if (entry.partOfSpeech === 'other') return false;

    return true;
  });

  // ---- 7. Keep top 1500 ----
  vocab = vocab.slice(0, 1500);

  // ---- 8. Print some stats ----
  const posCounts = {};
  for (const entry of vocab) {
    posCounts[entry.partOfSpeech] = (posCounts[entry.partOfSpeech] || 0) + 1;
  }
  for (const [pos, count] of Object.entries(posCounts).sort((a, b) => b[1] - a[1])) {
  }


  // ---- 9. Write output ----
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const output = {
    meta: {
      description: 'Quranic vocabulary extracted from quran-json and Mendeley morphology data',
      generatedAt: new Date().toISOString(),
      totalWords: vocab.length,
      sources: [
        'quran-json (github.com/nicehash/quran-json)',
        'Mendeley quran-morphology.csv',
      ],
    },
    words: vocab,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
}

main();
