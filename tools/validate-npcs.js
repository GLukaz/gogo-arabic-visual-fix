/**
 * validate-npcs.js
 *
 * Validates src/data/npcs.json for content integrity.
 *
 * Checks:
 *   - All NPCs have dialogueTrees (non-empty array)
 *   - teachWord references exist in vocabulary (vocabulary.json + vocabulary-final.json)
 *   - culturalNote entries are non-empty strings
 *
 * Reports:
 *   - NPC count
 *   - Total dialogue lines
 *   - TeachWord count
 *   - Invalid (unresolved) teachWord refs
 *   - NPCs missing dialogueTrees
 *   - Malformed culturalNote entries
 *
 * Run with: node tools/validate-npcs.js
 */


import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');


// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------
function loadNpcs() {
  const p = path.join(projectRoot, 'src', 'data', 'npcs.json');
  if (!fs.existsSync(p)) {
    console.error(`ERROR: File not found: ${p}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function buildVocabIdSet() {
  const ids = new Set();

  const v1Path = path.join(projectRoot, 'src', 'data', 'vocabulary.json');
  const v2Path = path.join(projectRoot, 'src', 'data', 'vocabulary-final.json');

  if (fs.existsSync(v1Path)) {
    const v1 = JSON.parse(fs.readFileSync(v1Path, 'utf8'));
    for (const w of v1) if (w.id) ids.add(w.id);
  }

  if (fs.existsSync(v2Path)) {
    const v2 = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
    for (const w of v2) if (w.id) ids.add(w.id);
  }

  return ids;
}

// ---------------------------------------------------------------------------
// Tree walker — recursively collect metrics from dialogue lines
// ---------------------------------------------------------------------------
function walkLines(lines, metrics) {
  if (!Array.isArray(lines)) return;

  for (const line of lines) {
    if (typeof line !== 'object' || line === null) continue;

    // Count as a dialogue line if it has speaker or action
    if ('speaker' in line || 'action' in line) {
      metrics.totalLines++;
    }

    if ('teachWord' in line) {
      metrics.teachWords.push(line.teachWord);
    }

    if ('culturalNote' in line) {
      metrics.culturalNotes.push({ value: line.culturalNote });
    }

    // Recurse into nested lines (e.g., choice branches)
    if (Array.isArray(line.lines)) {
      walkLines(line.lines, metrics);
    }

    // Recurse into choices that have a 'lines' property
    if (Array.isArray(line.choices)) {
      for (const choice of line.choices) {
        if (Array.isArray(choice.lines)) {
          walkLines(choice.lines, metrics);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateNpcs(npcs, vocabIds) {
  const results = {
    npcCount: npcs.length,
    missingDialogueTrees: [],   // npc IDs with no dialogueTrees
    totalLines: 0,
    teachWordCount: 0,
    invalidTeachWords: [],      // { npcId, teachWord }
    culturalNoteCount: 0,
    malformedCulturalNotes: [], // { npcId, value }
  };

  for (const npc of npcs) {
    const npcId = npc.id || '[unknown]';

    // Check dialogueTrees
    if (!Array.isArray(npc.dialogueTrees) || npc.dialogueTrees.length === 0) {
      results.missingDialogueTrees.push(npcId);
    }

    // Walk all dialogue trees
    const metrics = { totalLines: 0, teachWords: [], culturalNotes: [] };

    for (const tree of (npc.dialogueTrees || [])) {
      walkLines(tree.lines || [], metrics);
    }

    results.totalLines += metrics.totalLines;
    results.teachWordCount += metrics.teachWords.length;
    results.culturalNoteCount += metrics.culturalNotes.length;

    // Check each teachWord against vocab
    for (const tw of metrics.teachWords) {
      if (!vocabIds.has(tw)) {
        results.invalidTeachWords.push({ npcId, teachWord: tw });
      }
    }

    // Check culturalNote format (must be non-empty string)
    for (const { value } of metrics.culturalNotes) {
      if (typeof value !== 'string' || value.trim() === '') {
        results.malformedCulturalNotes.push({ npcId, value });
      }
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

  console.log('\n=== NPC Validation Report ===\n');

  console.log(`NPCs:             ${results.npcCount}`);
  console.log(`Dialogue lines:   ${results.totalLines.toLocaleString()}`);
  console.log(`teachWords:       ${results.teachWordCount}`);
  console.log(`culturalNotes:    ${results.culturalNoteCount}`);

  // Missing dialogueTrees
  if (results.missingDialogueTrees.length === 0) {
    console.log(`\n[${PASS}] All NPCs have dialogueTrees`);
  } else {
    console.log(`\n[${FAIL}] ${results.missingDialogueTrees.length} NPC(s) missing dialogueTrees:`);
    for (const id of results.missingDialogueTrees) {
      console.log(`       "${id}"`);
    }
  }

  // Invalid teachWords
  if (results.invalidTeachWords.length === 0) {
    console.log(`[${PASS}] All teachWord references resolved`);
  } else {
    // Deduplicate for display
    const seen = new Set();
    const unique = results.invalidTeachWords.filter((e) => {
      const key = `${e.npcId}:${e.teachWord}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    console.log(`[${WARN}] ${unique.length} unresolved teachWord reference(s):`);
    for (const { npcId, teachWord } of unique.slice(0, 20)) {
      console.log(`       NPC "${npcId}" → teachWord "${teachWord}" not found in vocabulary`);
    }
    if (unique.length > 20) {
      console.log(`       ... and ${unique.length - 20} more`);
    }
  }

  // Malformed culturalNotes
  if (results.malformedCulturalNotes.length === 0) {
    console.log(`[${PASS}] All culturalNote entries are valid strings`);
  } else {
    console.log(`[${FAIL}] ${results.malformedCulturalNotes.length} malformed culturalNote(s):`);
    for (const { npcId, value } of results.malformedCulturalNotes.slice(0, 10)) {
      console.log(`       NPC "${npcId}" has culturalNote: ${JSON.stringify(value)}`);
    }
  }

  // Overall
  const hasErrors = results.missingDialogueTrees.length > 0 || results.malformedCulturalNotes.length > 0;
  const hasWarnings = results.invalidTeachWords.length > 0;
  console.log(`\nOverall: ${hasErrors ? FAIL : hasWarnings ? WARN : PASS}`);

  return hasErrors ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  try {
    process.stdout.write('Loading npcs.json... ');
    const npcs = loadNpcs();
    console.log(`${npcs.length} NPCs loaded.`);

    process.stdout.write('Building vocabulary ID set... ');
    const vocabIds = buildVocabIdSet();
    console.log(`${vocabIds.size.toLocaleString()} vocabulary IDs indexed.`);

    const results = validateNpcs(npcs, vocabIds);
    const exitCode = report(results);
    process.exit(exitCode);
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    process.exit(1);
  }
}

main();
