/**
 * Build script for alphabet data.
 * Validates alphabet.json and generates any derived data.
 * Run: node scripts/build-alphabet.js
 */

import { readFile } from 'fs/promises';

const EXPECTED_LETTERS = 28;
const EXPECTED_GROUPS = 13;

async function main() {
  const raw = await readFile('client/src/data/alphabet.json', 'utf-8');
  const letters = JSON.parse(raw);

  console.log(`Loaded ${letters.length} letters`);

  if (letters.length < EXPECTED_LETTERS) {
    console.warn(`Warning: Expected ${EXPECTED_LETTERS} letters, got ${letters.length}`);
  }

  const groups = new Set(letters.map((l) => l.group));
  console.log(`Found ${groups.size} groups`);

  if (groups.size !== EXPECTED_GROUPS) {
    console.warn(`Warning: Expected ${EXPECTED_GROUPS} groups, got ${groups.size}`);
  }

  // Validate each letter
  let errors = 0;
  letters.forEach((l) => {
    if (!l.id || !l.letter || !l.name || !l.forms) {
      console.error(`Missing fields for letter: ${l.id || 'UNKNOWN'}`);
      errors++;
    }
    if (l.forms && (!l.forms.isolated || !l.forms.initial || !l.forms.medial || !l.forms.final)) {
      console.error(`Missing form(s) for letter: ${l.id}`);
      errors++;
    }
  });

  if (errors === 0) {
    console.log('All letters validated successfully!');
  } else {
    console.error(`${errors} validation errors found`);
    process.exit(1);
  }
}

main().catch(console.error);
