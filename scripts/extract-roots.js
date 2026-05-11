/**
 * extract-roots.js
 *
 * Extracts root letter data for Quranic verbs from quran101 dictionary.json
 * and outputs a structured JSON file mapping verbs to their 3-letter roots.
 *
 * Input:
 *   - quran101 dictionary.json (101 Quranic verbs with root_word data)
 *
 * Output:
 *   - scripts/output/quranic-roots.json
 *
 * Usage:
 *   node scripts/extract-roots.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const DICTIONARY_PATH = path.resolve(
  __dirname,
  '../../quran101/app/src/main/assets/dictionary.json'
);

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'quranic-roots.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a spaced root like "ق و ل" to a compact form "قول".
 */
function compactRoot(spacedRoot) {
  return spacedRoot
    .split(/\s+/)
    .filter(Boolean)
    .join('');
}

/**
 * Build a short English gloss for a root based on the translations of the
 * verbs that share it.  When there is a single verb the gloss is just its
 * translation; when there are several we combine the unique keywords.
 */
function buildRootMeaning(translations) {
  // Collect unique translation fragments, removing leading "to "
  const keywords = new Set();
  for (const t of translations) {
    // Each translation may contain comma-separated meanings
    const parts = t.split(',').map((s) => s.trim());
    for (const part of parts) {
      // Normalise: strip leading "to " so we can re-add it once
      const clean = part.replace(/^to\s+/i, '').trim();
      if (clean) keywords.add(clean);
    }
  }

  const list = Array.from(keywords);

  if (list.length === 0) return '';
  if (list.length === 1) return `related to ${list[0]}`;
  if (list.length <= 3) return `related to ${list.join(', ')}`;

  // If many meanings, take the first three and indicate there are more
  return `related to ${list.slice(0, 3).join(', ')}, etc.`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // 1. Read and parse dictionary.json
  if (!fs.existsSync(DICTIONARY_PATH)) {
    console.error(`Error: dictionary.json not found at ${DICTIONARY_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DICTIONARY_PATH, 'utf-8');
  const dictionary = JSON.parse(raw);
  const words = dictionary.words;

  if (!Array.isArray(words) || words.length === 0) {
    console.error('Error: dictionary.json contains no words array');
    process.exit(1);
  }


  // 2. Build verb entries
  const verbs = words.map((w) => ({
    arabic: w.arabic,
    english: w.translation,
    transliteration: w.transliteration,
    rootLetters: compactRoot(w.root_word),
    rootLettersSpaced: w.root_word,
    frequency: parseInt(w.frequency, 10),
    partOfSpeech: 'verb',
  }));

  // 3. Build root-to-words mapping
  //    Key = compact root (e.g. "قول"), value = { root, rootSpaced, meaning, words[] }
  const rootMapObj = {};

  for (const verb of verbs) {
    const key = verb.rootLetters;
    if (!rootMapObj[key]) {
      rootMapObj[key] = {
        root: key,
        rootSpaced: verb.rootLettersSpaced,
        translations: [],   // temporary, used to build meaning
        words: [],
      };
    }
    rootMapObj[key].words.push(verb.arabic);
    rootMapObj[key].translations.push(verb.english);
  }

  // Replace the temporary translations array with a single meaning string
  for (const key of Object.keys(rootMapObj)) {
    const entry = rootMapObj[key];
    entry.meaning = buildRootMeaning(entry.translations);
    delete entry.translations;
  }

  // 4. Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 5. Write output
  const output = {
    verbs,
    rootMap: rootMapObj,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  // 6. Print summary
  const uniqueRoots = Object.keys(rootMapObj).length;
  const sharedRoots = Object.values(rootMapObj).filter(
    (r) => r.words.length > 1
  );


  if (sharedRoots.length > 0) {
    for (const r of sharedRoots) {
    }
  }

}

main();
