/**
 * Build script for vocabulary data.
 * Validates vocabulary.json entries.
 * Run: node scripts/build-vocabulary.js
 */

import { readFile } from 'fs/promises';

const VALID_CATEGORIES = [
  'greetings', 'numbers', 'colors', 'family', 'food', 'animals',
  'body', 'clothing', 'nature', 'trade', 'directions', 'time',
  'verbs_basic', 'adjectives', 'phrases',
];

async function main() {
  const raw = await readFile('client/src/data/vocabulary.json', 'utf-8');
  const words = JSON.parse(raw);


  // Category breakdown
  const catCounts = {};
  words.forEach((w) => {
    catCounts[w.category] = (catCounts[w.category] || 0) + 1;
  });

  Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const valid = VALID_CATEGORIES.includes(cat) ? '' : ' [INVALID CATEGORY]';
    });

  // Validate
  let errors = 0;
  const ids = new Set();
  words.forEach((w) => {
    if (!w.id || !w.arabic || !w.english || !w.transliteration || !w.category) {
      console.error(`Missing fields for word: ${w.id || 'UNKNOWN'}`);
      errors++;
    }
    if (ids.has(w.id)) {
      console.error(`Duplicate ID: ${w.id}`);
      errors++;
    }
    ids.add(w.id);
    if (w.difficulty < 1 || w.difficulty > 5) {
      console.error(`Invalid difficulty for ${w.id}: ${w.difficulty}`);
      errors++;
    }
  });

  if (errors === 0) {
  } else {
    console.error(`\n${errors} validation errors found`);
    process.exit(1);
  }
}

main().catch(console.error);
