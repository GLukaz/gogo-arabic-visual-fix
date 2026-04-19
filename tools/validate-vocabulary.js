/**
 * validate-vocabulary.js
 *
 * Validates src/data/vocabularyExpanded.js for content integrity.
 *
 * Checks:
 *   - No duplicate IDs
 *   - All required fields present: id, arabic, english, transliteration, category, cefrLevel, frequency
 *   - Valid cefrLevel values: A1, A2, B1, B2
 *   - Frequency in valid range (> 0)
 *
 * Reports:
 *   - Total word count
 *   - Per-CEFR breakdown
 *   - Missing field violations
 *   - Duplicate ID violations
 *
 * Run with: node tools/validate-vocabulary.js
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Parse vocabularyExpanded.js by evaluating it as a module
// ---------------------------------------------------------------------------
async function loadVocabulary() {
  const vocabPath = path.join(projectRoot, 'src', 'data', 'vocabularyExpanded.js');

  if (!fs.existsSync(vocabPath)) {
    console.error(`ERROR: File not found: ${vocabPath}`);
    process.exit(1);
  }

  // Read the raw JS file and transform it for dynamic import
  const raw = fs.readFileSync(vocabPath, 'utf8');

  // Write a temp file to a temp location we can import
  const tmpPath = path.join(projectRoot, 'tools', '.tmp-vocab.mjs');
  fs.writeFileSync(tmpPath, raw);

  try {
    const mod = await import(tmpPath);
    return mod.default;
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

// ---------------------------------------------------------------------------
// Validation logic
// ---------------------------------------------------------------------------
const REQUIRED_FIELDS = ['id', 'arabic', 'english', 'transliteration', 'category', 'cefrLevel', 'frequency'];
const VALID_CEFR = new Set(['A1', 'A2', 'B1', 'B2']);

function validateVocabulary(words) {
  const results = {
    total: words.length,
    cefrBreakdown: {},
    missingFields: [],   // { index, id, missing: [] }
    duplicateIds: [],    // { id, count }
    invalidCefr: [],     // { id, cefrLevel }
    invalidFrequency: [], // { id, frequency }
  };

  // Initialize CEFR counters
  for (const level of ['A1', 'A2', 'B1', 'B2', 'untagged']) {
    results.cefrBreakdown[level] = 0;
  }

  const idCounts = new Map();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const id = word.id || `[index ${i}]`;

    // Track ID occurrences
    idCounts.set(id, (idCounts.get(id) || 0) + 1);

    // Check required fields
    const missing = REQUIRED_FIELDS.filter((f) => word[f] === undefined || word[f] === null || word[f] === '');
    if (missing.length > 0) {
      results.missingFields.push({ index: i, id, missing });
    }

    // Check cefrLevel
    const cefr = word.cefrLevel;
    if (!cefr) {
      results.cefrBreakdown['untagged']++;
    } else if (!VALID_CEFR.has(cefr)) {
      results.invalidCefr.push({ id, cefrLevel: cefr });
      results.cefrBreakdown['untagged']++;
    } else {
      results.cefrBreakdown[cefr] = (results.cefrBreakdown[cefr] || 0) + 1;
    }

    // Check frequency
    const freq = word.frequency;
    if (typeof freq !== 'number' || freq <= 0 || !isFinite(freq)) {
      results.invalidFrequency.push({ id, frequency: freq });
    }
  }

  // Find duplicates (count > 1)
  for (const [id, count] of idCounts.entries()) {
    if (count > 1) {
      results.duplicateIds.push({ id, count });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
function report(results) {
  const PASS = '\x1b[32mPASS\x1b[0m';
  const FAIL = '\x1b[31mFAIL\x1b[0m';
  const WARN = '\x1b[33mWARN\x1b[0m';

  console.log('\n=== Vocabulary Validation Report ===\n');

  // Total
  console.log(`Total words: ${results.total.toLocaleString()}`);

  // CEFR breakdown
  console.log('\nCEFR Breakdown:');
  for (const [level, count] of Object.entries(results.cefrBreakdown)) {
    if (count > 0) {
      console.log(`  ${level.padEnd(8)} ${count.toLocaleString()}`);
    }
  }

  // Duplicates
  if (results.duplicateIds.length === 0) {
    console.log(`\n[${PASS}] No duplicate IDs`);
  } else {
    console.log(`\n[${FAIL}] ${results.duplicateIds.length} duplicate ID(s) found:`);
    for (const { id, count } of results.duplicateIds.slice(0, 20)) {
      console.log(`       ID "${id}" appears ${count} times`);
    }
    if (results.duplicateIds.length > 20) {
      console.log(`       ... and ${results.duplicateIds.length - 20} more`);
    }
  }

  // Missing fields
  if (results.missingFields.length === 0) {
    console.log(`[${PASS}] All required fields present`);
  } else {
    console.log(`[${FAIL}] ${results.missingFields.length} word(s) missing required fields:`);
    for (const { id, missing } of results.missingFields.slice(0, 20)) {
      console.log(`       "${id}" missing: ${missing.join(', ')}`);
    }
    if (results.missingFields.length > 20) {
      console.log(`       ... and ${results.missingFields.length - 20} more`);
    }
  }

  // Invalid CEFR
  if (results.invalidCefr.length === 0) {
    console.log(`[${PASS}] All cefrLevel values valid`);
  } else {
    console.log(`[${FAIL}] ${results.invalidCefr.length} word(s) with invalid cefrLevel:`);
    for (const { id, cefrLevel } of results.invalidCefr.slice(0, 10)) {
      console.log(`       "${id}" has cefrLevel="${cefrLevel}"`);
    }
  }

  // Invalid frequency
  if (results.invalidFrequency.length === 0) {
    console.log(`[${PASS}] All frequency values valid`);
  } else {
    console.log(`[${WARN}] ${results.invalidFrequency.length} word(s) with invalid frequency:`);
    for (const { id, frequency } of results.invalidFrequency.slice(0, 10)) {
      console.log(`       "${id}" has frequency=${frequency}`);
    }
  }

  // Overall status
  const hasErrors = results.duplicateIds.length > 0 || results.missingFields.length > 0 || results.invalidCefr.length > 0;
  console.log(`\nOverall: ${hasErrors ? FAIL : PASS}`);

  return hasErrors ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  try {
    process.stdout.write('Loading vocabularyExpanded.js... ');
    const words = await loadVocabulary();
    console.log(`${words.length} words loaded.`);

    const results = validateVocabulary(words);
    const exitCode = report(results);
    process.exit(exitCode);
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    process.exit(1);
  }
}

main();
