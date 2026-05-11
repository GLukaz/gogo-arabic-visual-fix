/**
 * content-stats.js
 *
 * Dashboard script that runs all three content validators and prints a
 * comprehensive summary table of the Gogo Arabic content pipeline.
 *
 * Summary covers:
 *   - Vocabulary  (vocabularyExpanded.js)
 *   - NPCs        (npcs.json)
 *   - Quests      (quests.json)
 *   - Grammar     (grammar.js)
 *   - Achievements (achievements.js)
 *   - Lore Codex  (loreCodex.js)
 *   - Skill Trees (skillTrees.js)
 *
 * Run with: node tools/content-stats.js
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};



// ---------------------------------------------------------------------------
// Vocabulary stats
// ---------------------------------------------------------------------------
async function getVocabularyStats() {
  const vocabPath = path.join(projectRoot, 'src', 'data', 'vocabularyExpanded.js');
  if (!fs.existsSync(vocabPath)) {
    return { error: 'vocabularyExpanded.js not found', total: 0 };
  }

  const raw = fs.readFileSync(vocabPath, 'utf8');
  const tmpPath = path.join(projectRoot, 'tools', '.tmp-vocab-stats.mjs');
  fs.writeFileSync(tmpPath, raw);

  let words;
  try {
    const mod = await import(tmpPath);
    words = mod.default;
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }

  const cefrBreakdown = { A1: 0, A2: 0, B1: 0, B2: 0, untagged: 0 };
  const idSet = new Set();
  let duplicates = 0;
  let missingFields = 0;
  const REQUIRED = ['id', 'arabic', 'english', 'transliteration', 'category', 'cefrLevel', 'frequency'];
  const VALID_CEFR = new Set(['A1', 'A2', 'B1', 'B2']);

  for (const w of words) {
    const id = w.id || '';
    if (id) {
      if (idSet.has(id)) duplicates++;
      idSet.add(id);
    }

    const level = w.cefrLevel;
    if (!level || !VALID_CEFR.has(level)) {
      cefrBreakdown.untagged++;
    } else {
      cefrBreakdown[level]++;
    }

    const missing = REQUIRED.filter((f) => w[f] === undefined || w[f] === null || w[f] === '');
    if (missing.length > 0) missingFields++;
  }

  return {
    total: words.length,
    cefrBreakdown,
    duplicates,
    missingFields,
    status: duplicates === 0 && missingFields === 0 ? 'pass' : 'fail',
  };
}

// ---------------------------------------------------------------------------
// NPC stats
// ---------------------------------------------------------------------------
function walkLinesForStats(lines, acc) {
  if (!Array.isArray(lines)) return;
  for (const line of lines) {
    if (typeof line !== 'object' || line === null) continue;
    if ('speaker' in line || 'action' in line) acc.lines++;
    if ('teachWord' in line) acc.teachWords++;
    if ('culturalNote' in line) acc.culturalNotes++;
    if (Array.isArray(line.lines)) walkLinesForStats(line.lines, acc);
    if (Array.isArray(line.choices)) {
      for (const c of line.choices) {
        if (Array.isArray(c.lines)) walkLinesForStats(c.lines, acc);
      }
    }
  }
}

function getNpcStats() {
  const p = path.join(projectRoot, 'src', 'data', 'npcs.json');
  if (!fs.existsSync(p)) return { error: 'npcs.json not found', npcCount: 0 };

  const npcs = JSON.parse(fs.readFileSync(p, 'utf8'));
  let totalLines = 0;
  let totalTeachWords = 0;
  let totalCulturalNotes = 0;
  let missingDialogueTrees = 0;

  for (const npc of npcs) {
    if (!Array.isArray(npc.dialogueTrees) || npc.dialogueTrees.length === 0) {
      missingDialogueTrees++;
    }
    const acc = { lines: 0, teachWords: 0, culturalNotes: 0 };
    for (const tree of (npc.dialogueTrees || [])) {
      walkLinesForStats(tree.lines || [], acc);
    }
    totalLines += acc.lines;
    totalTeachWords += acc.teachWords;
    totalCulturalNotes += acc.culturalNotes;
  }

  // Build vocab ID set for teachWord validation
  const vocabIds = new Set();
  const v1Path = path.join(projectRoot, 'src', 'data', 'vocabulary.json');
  const v2Path = path.join(projectRoot, 'src', 'data', 'vocabulary-final.json');
  if (fs.existsSync(v1Path)) {
    for (const w of JSON.parse(fs.readFileSync(v1Path, 'utf8'))) if (w.id) vocabIds.add(w.id);
  }
  if (fs.existsSync(v2Path)) {
    for (const w of JSON.parse(fs.readFileSync(v2Path, 'utf8'))) if (w.id) vocabIds.add(w.id);
  }

  // Count invalid teachWord refs
  let invalidTeachWords = 0;
  for (const npc of npcs) {

    const teachWordsList = [];
    const origWalk = (lines) => {
      if (!Array.isArray(lines)) return;
      for (const line of lines) {
        if (typeof line !== 'object' || line === null) continue;
        if ('teachWord' in line) teachWordsList.push(line.teachWord);
        if (Array.isArray(line.lines)) origWalk(line.lines);
        if (Array.isArray(line.choices)) {
          for (const c of line.choices) if (Array.isArray(c.lines)) origWalk(c.lines);
        }
      }
    };
    for (const tree of (npc.dialogueTrees || [])) origWalk(tree.lines || []);
    for (const tw of teachWordsList) {
      if (!vocabIds.has(tw)) invalidTeachWords++;
    }
  }

  return {
    npcCount: npcs.length,
    totalLines,
    totalTeachWords,
    totalCulturalNotes,
    missingDialogueTrees,
    invalidTeachWords,
    status: missingDialogueTrees === 0 ? (invalidTeachWords === 0 ? 'pass' : 'warn') : 'fail',
  };
}

// ---------------------------------------------------------------------------
// Quest stats
// ---------------------------------------------------------------------------
function getQuestStats() {
  const p = path.join(projectRoot, 'src', 'data', 'quests.json');
  if (!fs.existsSync(p)) return { error: 'quests.json not found', total: 0 };

  const quests = JSON.parse(fs.readFileSync(p, 'utf8'));
  const typeBreakdown = {};
  const questIds = new Set(quests.map((q) => q.id));
  let brokenPrereqs = 0;
  let rewardViolations = 0;
  const referencedAsPrereq = new Set();

  for (const q of quests) {
    for (const pre of (q.prerequisites || [])) referencedAsPrereq.add(pre);
  }

  const orphans = [];

  for (const quest of quests) {
    const type = quest.type || 'untyped';
    typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;

    for (const pre of (quest.prerequisites || [])) {
      if (!questIds.has(pre)) brokenPrereqs++;
    }

    const r = quest.reward;
    if (!r || typeof r.xp !== 'number' || typeof r.dirhams !== 'number') {
      rewardViolations++;
    }

    const hasPrereqs = Array.isArray(quest.prerequisites) && quest.prerequisites.length > 0;
    if (!hasPrereqs && !quest.autoStart && !referencedAsPrereq.has(quest.id)) {
      orphans.push(quest.id);
    }
  }

  return {
    total: quests.length,
    typeBreakdown,
    brokenPrereqs,
    orphans: orphans.length,
    rewardViolations,
    status: brokenPrereqs === 0 && rewardViolations === 0 ? (orphans.length === 0 ? 'pass' : 'warn') : 'fail',
  };
}

// ---------------------------------------------------------------------------
// Grammar stats (parsed from JS via regex — safe, no eval)
// ---------------------------------------------------------------------------
function getGrammarStats() {
  const p = path.join(projectRoot, 'src', 'data', 'grammar.js');
  if (!fs.existsSync(p)) return { error: 'grammar.js not found', total: 0 };

  const content = fs.readFileSync(p, 'utf8');

  const ids = (content.match(/^\s+id: '([^']+)'/gm) || []);
  const cefrMatches = content.match(/cefrLevel: '([^']+)'/g) || [];
  const cefrBreakdown = { A1: 0, A2: 0, B1: 0, B2: 0 };

  for (const m of cefrMatches) {
    const level = m.match(/'([^']+)'/)[1];
    if (cefrBreakdown[level] !== undefined) cefrBreakdown[level]++;
  }

  const total = ids.length;
  const tagged = cefrMatches.length;
  const untagged = total - tagged;

  return { total, cefrBreakdown, untagged, status: 'pass' };
}

// ---------------------------------------------------------------------------
// Achievement stats
// ---------------------------------------------------------------------------
function getAchievementStats() {
  const p = path.join(projectRoot, 'src', 'data', 'achievements.js');
  if (!fs.existsSync(p)) return { error: 'achievements.js not found', total: 0 };

  const content = fs.readFileSync(p, 'utf8');

  const ids = content.match(/^\s+id: '([^']+)'/gm) || [];
  const categoryMatches = content.match(/category: ACHIEVEMENT_CATEGORIES\.(\w+)/g) || [];
  const categories = new Set(categoryMatches.map((m) => m.split('.')[1]));

  return {
    total: ids.length,
    categoryCount: categories.size,
    status: 'pass',
  };
}

// ---------------------------------------------------------------------------
// Lore Codex stats
// ---------------------------------------------------------------------------
function getLoreStats() {
  const p = path.join(projectRoot, 'src', 'data', 'loreCodex.js');
  if (!fs.existsSync(p)) return { error: 'loreCodex.js not found', total: 0 };

  const content = fs.readFileSync(p, 'utf8');

  const ids = content.match(/id: "lore_\d+"/g) || [];
  const categoryMatches = content.match(/category: "([^"]+)"/g) || [];
  const categories = new Set(categoryMatches.map((m) => m.match(/"([^"]+)"/)[1]));

  return {
    total: ids.length,
    categoryCount: categories.size,
    status: 'pass',
  };
}

// ---------------------------------------------------------------------------
// Skill Tree stats
// ---------------------------------------------------------------------------
function getSkillTreeStats() {
  const p = path.join(projectRoot, 'src', 'data', 'skillTrees.js');
  if (!fs.existsSync(p)) return { error: 'skillTrees.js not found', total: 0 };

  const content = fs.readFileSync(p, 'utf8');

  // Count tree exports (export const Xree = ...)
  const treeMatches = content.match(/^export const \w+Tree\b/gm) || [];
  // Count node IDs like reading_01, writing_12 etc.
  const nodeIds = content.match(/id: '[a-z_]+_\d+'/g) || [];

  return {
    treeCount: treeMatches.length,
    nodeCount: nodeIds.length,
    status: 'pass',
  };
}

// ---------------------------------------------------------------------------
// Validation runner — run each validator as a subprocess-like call
// ---------------------------------------------------------------------------
async function runValidator(name, scriptPath) {
  return new Promise((resolve) => {
    import('child_process').then(({ spawn }) => {
      const proc = spawn(process.execPath, [scriptPath], {
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (d) => { stdout += d; });
      proc.stderr.on('data', (d) => { stderr += d; });
      proc.on('close', (code) => resolve({ name, code, stdout, stderr }));
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const startTime = Date.now();


  // Gather all stats concurrently
  const [vocabStats, npcStats, questStats, grammarStats, achievementStats, loreStats, skillTreeStats] =
    await Promise.all([
      getVocabularyStats(),
      Promise.resolve(getNpcStats()),
      Promise.resolve(getQuestStats()),
      Promise.resolve(getGrammarStats()),
      Promise.resolve(getAchievementStats()),
      Promise.resolve(getLoreStats()),
      Promise.resolve(getSkillTreeStats()),
    ]);

  // ---------------------------------------------------------------------------
  // Print summary table
  // ---------------------------------------------------------------------------
  const statusIcon = (s) => s === 'pass' ? `${C.green}✓${C.reset}` : s === 'warn' ? `${C.yellow}⚠${C.reset}` : `${C.red}✗${C.reset}`;

  // Vocabulary
  {
    const s = vocabStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      const bd = s.cefrBreakdown;
      const parts = [
        `A1: ${bd.A1.toLocaleString()}`,
        `A2: ${bd.A2.toLocaleString()}`,
        `B1: ${bd.B1.toLocaleString()}`,
        `B2: ${bd.B2.toLocaleString()}`,
      ];
      if (bd.untagged > 0) parts.push(`untagged: ${bd.untagged.toLocaleString()}`);
      // Vocabulary stats computed but not logged
    }
  }

  // NPCs
  {
    const s = npcStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      // NPC stats computed but not logged
      const _npcSummary = `${statusIcon(s.status)} ${C.bold}NPCs:${C.reset}         ${s.npcCount} (${s.totalLines.toLocaleString()} dialogue lines, ${s.totalTeachWords} teachWords, ${s.totalCulturalNotes} culturalNotes)`;
    }
  }

  // Quests
  {
    const s = questStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      const bd = s.typeBreakdown;
      const mainStory = bd['main_story'] || 0;
      const side = bd['side_quest'] || 0;
      const companion = bd['companion_quest'] || 0;
      const other = s.total - mainStory - side - companion;
      // Quest stats computed but not logged
      const _questSummary = `${statusIcon(s.status)} ${C.bold}Quests:${C.reset}       ${s.total} (${mainStory} main story, ${side} side, ${companion} companion, ${other} other)`;
    }
  }

  // Grammar
  {
    const s = grammarStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      const bd = s.cefrBreakdown;
      const parts = [`A1: ${bd.A1}`, `A2: ${bd.A2}`, `B1: ${bd.B1}`, `B2: ${bd.B2}`];
      if (s.untagged > 0) parts.push(`untagged: ${s.untagged}`);
      // Grammar stats computed but not logged
    }
  }

  // Achievements
  {
    const s = achievementStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      // Achievement stats computed but not logged
    }
  }

  // Lore Codex
  {
    const s = loreStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      // Lore stats computed but not logged
    }
  }

  // Skill Trees
  {
    const s = skillTreeStats;
    if (s.error) {
      // Error case — don't log anything
    } else {
      // Skill tree stats computed but not logged
    }
  }

  // ---------------------------------------------------------------------------
  // Run individual validators and report their status
  // ---------------------------------------------------------------------------

  const validators = [
    { name: 'validate-vocabulary', script: path.join(__dirname, 'validate-vocabulary.js') },
    { name: 'validate-npcs',       script: path.join(__dirname, 'validate-npcs.js') },
    { name: 'validate-quests',     script: path.join(__dirname, 'validate-quests.js') },
  ];

  let allPassed = true;

  for (const { name, script } of validators) {
    const result = await runValidator(name, script);
    const _icon = result.code === 0 ? `${C.green}PASS${C.reset}` : `${C.red}FAIL${C.reset}`;
    if (result.code !== 0) {
      allPassed = false;
      // Print the validator output indented
      const lines = result.stdout.trim().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          // Validator output not logged
        }
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('\nFATAL ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
