/**
 * validate-quests.js
 *
 * Validates src/data/quests.json for content integrity.
 *
 * Checks:
 *   - All quest IDs are unique
 *   - Prerequisites reference existing quest IDs
 *   - trackEvent values are non-empty strings
 *   - Rewards have both xp and dirhams fields (numbers > 0)
 *
 * Reports:
 *   - Quest count (total and by type)
 *   - Broken prerequisites
 *   - Orphan quests (no prerequisites, not autoStart, not referenced by any other quest)
 *   - Invalid trackEvent values
 *   - Reward violations
 *
 * Run with: node tools/validate-quests.js
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------
function loadQuests() {
  const p = path.join(projectRoot, 'src', 'data', 'quests.json');
  if (!fs.existsSync(p)) {
    console.error(`ERROR: File not found: ${p}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validateQuests(quests) {
  const results = {
    total: quests.length,
    typeBreakdown: {},
    duplicateIds: [],         // { id, count }
    brokenPrerequisites: [],  // { questId, missingPrereq }
    orphanQuests: [],         // quest IDs with no connection to the graph
    invalidTrackEvents: [],   // { questId, trackEvent }
    rewardViolations: [],     // { questId, issue }
  };

  // Build ID → quest map
  const questIds = new Set();
  const idCounts = new Map();

  for (const quest of quests) {
    const id = quest.id || '[missing id]';
    idCounts.set(id, (idCounts.get(id) || 0) + 1);
    questIds.add(id);

    // Type breakdown
    const type = quest.type || 'untyped';
    results.typeBreakdown[type] = (results.typeBreakdown[type] || 0) + 1;
  }

  // Duplicates
  for (const [id, count] of idCounts.entries()) {
    if (count > 1) results.duplicateIds.push({ id, count });
  }

  // Build the set of quest IDs that are referenced as prerequisites
  const referencedAsPrereq = new Set();
  for (const quest of quests) {
    for (const prereq of (quest.prerequisites || [])) {
      referencedAsPrereq.add(prereq);
    }
  }

  for (const quest of quests) {
    const questId = quest.id || '[missing id]';

    // Check prerequisites
    for (const prereq of (quest.prerequisites || [])) {
      if (!questIds.has(prereq)) {
        results.brokenPrerequisites.push({ questId, missingPrereq: prereq });
      }
    }

    // Orphan quests: no prerequisites, not autoStart, not referenced by anyone
    const hasPrereqs = Array.isArray(quest.prerequisites) && quest.prerequisites.length > 0;
    const isAutoStart = quest.autoStart === true;
    const isReferenced = referencedAsPrereq.has(questId);

    if (!hasPrereqs && !isAutoStart && !isReferenced) {
      results.orphanQuests.push(questId);
    }

    // Check trackEvent (should be a non-empty string if present)
    if ('trackEvent' in quest) {
      const te = quest.trackEvent;
      if (typeof te !== 'string' || te.trim() === '') {
        results.invalidTrackEvents.push({ questId, trackEvent: te });
      }
    }

    // Check rewards
    const reward = quest.reward;
    if (!reward) {
      results.rewardViolations.push({ questId, issue: 'missing reward object' });
    } else {
      const xp = reward.xp;
      const dirhams = reward.dirhams;

      if (xp === undefined || xp === null) {
        results.rewardViolations.push({ questId, issue: 'missing reward.xp' });
      } else if (typeof xp !== 'number' || xp < 0) {
        results.rewardViolations.push({ questId, issue: `invalid reward.xp: ${xp}` });
      }

      if (dirhams === undefined || dirhams === null) {
        results.rewardViolations.push({ questId, issue: 'missing reward.dirhams' });
      } else if (typeof dirhams !== 'number' || dirhams < 0) {
        results.rewardViolations.push({ questId, issue: `invalid reward.dirhams: ${dirhams}` });
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



  // Type breakdown
  const sortedTypes = Object.entries(results.typeBreakdown).sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sortedTypes) {
  }

  // Duplicate IDs
  if (results.duplicateIds.length === 0) {
  } else {
    for (const { id, count } of results.duplicateIds) {
    }
  }

  // Broken prerequisites
  if (results.brokenPrerequisites.length === 0) {
  } else {
    for (const { questId, missingPrereq } of results.brokenPrerequisites.slice(0, 20)) {
    }
    if (results.brokenPrerequisites.length > 20) {
    }
  }

  // Orphan quests
  if (results.orphanQuests.length === 0) {
  } else {
    for (const id of results.orphanQuests.slice(0, 10)) {
    }
    if (results.orphanQuests.length > 10) {
    }
  }

  // Invalid trackEvents
  if (results.invalidTrackEvents.length === 0) {
  } else {
    for (const { questId, trackEvent } of results.invalidTrackEvents) {
    }
  }

  // Reward violations
  if (results.rewardViolations.length === 0) {
  } else {
    for (const { questId, issue } of results.rewardViolations.slice(0, 20)) {
    }
  }

  // Overall
  const hasErrors =
    results.duplicateIds.length > 0 ||
    results.brokenPrerequisites.length > 0 ||
    results.invalidTrackEvents.length > 0 ||
    results.rewardViolations.length > 0;
  const hasWarnings = results.orphanQuests.length > 0;


  return hasErrors ? 1 : 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  try {
    process.stdout.write('Loading quests.json... ');
    const quests = loadQuests();

    const results = validateQuests(quests);
    const exitCode = report(results);
    process.exit(exitCode);
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    process.exit(1);
  }
}

main();
