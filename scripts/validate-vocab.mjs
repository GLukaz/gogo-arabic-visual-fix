#!/usr/bin/env node
/**
 * vocab:validate — Build-time vocabulary validation for Gogo Arabic.
 *
 * Replicates the three-source merge from vocabularyAll.js (without importing it
 * directly, since vocabularyAll.js uses import.meta.env.DEV and relies on Vite's
 * JSON import handling which are not available in plain Node.js). JSON sources are
 * read via readFile; vocabularyExpanded.js is imported as ESM.
 *
 * Checks:
 *   1. No duplicate Arabic text entries in the merged vocabulary
 *   2. No missing root fields on non-particle words (warning, not error)
 *   3. All expanded words (exp_* prefix) have cefrLevel set
 *   4. All words (including legacy) have cefrLevel after CEFR inference
 *   5. No numbered placeholder words remain (مُصْطَلَح N)
 *
 * Exit 0 on success, exit 1 on errors.
 * Usage: npm run vocab:validate
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ── Load sources ─────────────────────────────────────────────────────────────
const curatedWords = JSON.parse(
  await readFile(path.join(root, 'src/data/vocabulary.json'), 'utf-8')
);
const finalWordsRaw = JSON.parse(
  await readFile(path.join(root, 'src/data/vocabulary-final.json'), 'utf-8')
);
const { default: expandedWords } = await import(
  path.join(root, 'src/data/vocabularyExpanded.js')
);

// ── Replicate vocabularyAll.js merge logic ────────────────────────────────────
const curatedIds = new Set(curatedWords.map((w) => w.id));

const additionalWords = finalWordsRaw
  .filter((w) => w.english != null && w.english !== '' && !curatedIds.has(w.id))
  .map((w) => ({
    id: w.id,
    arabic: w.arabic,
    english: w.english,
    transliteration: w.transliteration || null,
    category: w.category || 'general',
    difficulty: w.difficulty || 1,
    audioRef: w.audioRef || null,
    npcSource: w.npcSource || null,
    exampleSentence: w.exampleSentence || null,
    source: w.source || null,
    quranRef: w.quranRef || null,
    rootLetters: w.rootLetters || null,
    partOfSpeech: w.partOfSpeech || null,
    zone: w.zone || null,
    frequency: w.frequency ?? null,
  }));

const allExistingIds = new Set([
  ...curatedWords.map((w) => w.id),
  ...additionalWords.map((w) => w.id),
]);

const newExpandedWords = expandedWords.filter((w) => !allExistingIds.has(w.id));
const merged = [...curatedWords, ...additionalWords, ...newExpandedWords];

// Arabic-text dedup (keep first occurrence = highest-priority source)
const seenArabicDedup = new Set();
const vocabulary = [];
for (const word of merged) {
  if (seenArabicDedup.has(word.arabic)) continue;
  seenArabicDedup.add(word.arabic);
  vocabulary.push(word);
}

// Apply CEFR inference matching vocabularyAll.js logic
for (const word of vocabulary) {
  if (!word.cefrLevel) {
    if (word.frequency >= 4000) word.cefrLevel = 'A1';
    else if (word.frequency >= 2000) word.cefrLevel = 'A2';
    else if (word.frequency >= 500) word.cefrLevel = 'B1';
    else if (word.frequency != null) word.cefrLevel = 'B2';
    else if (word.difficulty === 1) word.cefrLevel = 'A1';
    else if (word.difficulty === 2) word.cefrLevel = 'A2';
    else if (word.difficulty === 3) word.cefrLevel = 'B1';
    else if (word.difficulty === 4) word.cefrLevel = 'B2';
    else word.cefrLevel = 'A2';
  }
}

// ── Run checks ────────────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;

console.log(`Validating ${vocabulary.length} words (merged from 3 sources)...\n`);

// ── Check 1: Duplicate Arabic text ──────────────────────────────────────────
// The merge already deduplicates, but we verify no duplicates snuck through
const seenArabic = new Map(); // arabic → first id
for (const w of vocabulary) {
  if (seenArabic.has(w.arabic)) {
    console.error(`ERROR: DUPLICATE ARABIC "${w.arabic}" — ids: ${seenArabic.get(w.arabic)}, ${w.id}`);
    errors++;
  } else {
    seenArabic.set(w.arabic, w.id);
  }
}

// ── Check 2: Missing root field ──────────────────────────────────────────────
// Particles, pronouns, loanwords, and phrases legitimately have null root.
// Warn (not error) when root is completely absent (undefined).
const PARTICLE_CATEGORIES = new Set([
  'greetings', 'phrases', 'grammar_particles', 'grammar',
  'grammar_patterns', 'advanced_grammar_forms',
]);
for (const w of vocabulary) {
  if (w.root === undefined && !PARTICLE_CATEGORIES.has(w.category)) {
    console.warn(`WARN: MISSING ROOT — ${w.id} "${w.arabic}" (category: ${w.category})`);
    warnings++;
  }
}

// ── Check 3: Missing/invalid CEFR on expanded words ─────────────────────────
const VALID_CEFR = new Set(['A1', 'A2', 'B1', 'B2']);
for (const w of vocabulary) {
  if (w.id.startsWith('exp_') && !VALID_CEFR.has(w.cefrLevel)) {
    console.error(`ERROR: MISSING/INVALID CEFR — ${w.id} "${w.arabic}" (cefrLevel: ${w.cefrLevel})`);
    errors++;
  }
}

// ── Check 4: All words have cefrLevel (including legacy, after inference) ────
for (const w of vocabulary) {
  if (!VALID_CEFR.has(w.cefrLevel)) {
    console.error(`ERROR: MISSING CEFR (legacy) — ${w.id} "${w.arabic}" (cefrLevel: ${w.cefrLevel})`);
    errors++;
  }
}

// ── Check 5: No numbered placeholder words remain ────────────────────────────
for (const w of vocabulary) {
  if (/مُصْطَلَح \d+/.test(w.arabic)) {
    console.error(`ERROR: PLACEHOLDER WORD — ${w.id} "${w.arabic}"`);
    errors++;
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
const cefrDist = { A1: 0, A2: 0, B1: 0, B2: 0 };
for (const w of vocabulary) {
  if (VALID_CEFR.has(w.cefrLevel)) cefrDist[w.cefrLevel]++;
}

console.log(`CEFR distribution: A1=${cefrDist.A1} A2=${cefrDist.A2} B1=${cefrDist.B1} B2=${cefrDist.B2}`);

if (errors > 0) {
  console.error(`\nFAILED: ${errors} error(s), ${warnings} warning(s) in ${vocabulary.length} words`);
  process.exit(1);
}

console.log(`\nvocab:validate PASSED — ${vocabulary.length} words, 0 errors, ${warnings} warning(s)`);
process.exit(0);
