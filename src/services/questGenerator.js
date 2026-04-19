/**
 * questGenerator.js — Deterministic daily/weekly quest generation service.
 *
 * Generates quests from 4 templates:
 *   - vocab_collection  : learn N words from a category
 *   - battle_wins       : win N battles in a zone
 *   - crafting          : craft N items
 *   - npc_interaction   : talk to N NPCs
 *
 * Determinism: same date + player level → same quest set.
 * Uses a seeded mulberry32 PRNG so quests are reproducible.
 *
 * Exports:
 *   generateDailyQuests(playerState, date)  → array of 3 daily quest objects
 *   generateWeeklyQuest(playerState, date)  → 1 weekly quest object
 */

// ─────────────────────────────────────────────────────────────────────────────
// Seeded PRNG — mulberry32
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a seeded pseudo-random number generator (mulberry32).
 * @param {number} seed - Integer seed
 * @returns {function} - Function returning floats in [0, 1)
 */
export function createSeededRng(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/**
 * Pick a random element from an array using the provided rng.
 * @param {function} rng
 * @param {any[]} arr
 * @returns {any}
 */
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed derivation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a Date (or date string) to an integer YYYYMMDD.
 * @param {Date|string} date
 * @returns {number}
 */
export function dateToInt(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return y * 10000 + m * 100 + day;
}

/**
 * Get the ISO week number (Monday-based) as YYYYWWW integer.
 * @param {Date|string} date
 * @returns {number}
 */
export function dateToWeekInt(date) {
  const d = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  // Set to nearest Thursday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return d.getUTCFullYear() * 100 + weekNo;
}

/**
 * Derive a numeric seed from a date integer and player level.
 * @param {number} dateInt - YYYYMMDD or YYYYWWW integer
 * @param {number} level   - Player level (integer ≥ 1)
 * @returns {number} - Integer seed for the PRNG
 */
export function deriveSeed(dateInt, level) {
  // Simple hash combining date and level
  return ((dateInt * 31 + (level >>> 0)) * 1000003) >>> 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Configuration tables
// ─────────────────────────────────────────────────────────────────────────────

const VOCAB_CATEGORIES = [
  'greetings', 'trade', 'numbers', 'colors', 'food',
  'nature', 'animals', 'time', 'directions', 'body',
  'clothing', 'adjectives', 'verbs_basic', 'phrases',
];

const ZONES = [
  'oasis_village', 'ancient_library', 'desert_marketplace',
  'farmland', 'bedouin_camp', 'mountain_village',
  'coastal_port', 'royal_palace',
];

const NPC_IDS = [
  'guide-amira', 'scholar-yusuf', 'merchant-fatima', 'student-khalid',
  'librarian-ibrahim', 'farmer-omar', 'elder-hassan', 'healer-rania',
  'guard-hamza', 'herbalist-maryam', 'baker-yasmin', 'imam-muhammad',
  'trader-hassan', 'wanderer-ali', 'weaver-zahra',
];

const CRAFTABLE_ITEMS = [
  'healing_potion', 'mana_scroll', 'word_amulet', 'desert_bread',
  'herb_bundle', 'ink_vial', 'sand_compass', 'silk_bookmark',
];

// ─────────────────────────────────────────────────────────────────────────────
// Difficulty scaling
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scale a base target by player level. Higher levels get larger targets.
 * Target = base + floor(level / 5) * increment, clamped to [min, max].
 *
 * @param {number} base      - Starting value at level 1
 * @param {number} increment - Amount to add per 5 levels
 * @param {number} min       - Minimum target
 * @param {number} max       - Maximum target
 * @param {number} level     - Player level
 * @returns {number}
 */
export function scaleTarget(base, increment, min, max, level) {
  const lvl = Math.max(1, Math.floor(level));
  const scaled = base + Math.floor(lvl / 5) * increment;
  return Math.max(min, Math.min(max, scaled));
}

/**
 * Scale XP reward by player level (higher levels earn more XP per quest).
 * @param {number} base
 * @param {number} level
 * @returns {number}
 */
export function scaleXp(base, level) {
  const lvl = Math.max(1, Math.floor(level));
  return Math.round(base * (1 + (lvl - 1) * 0.1));
}

// ─────────────────────────────────────────────────────────────────────────────
// Template builders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Template: learn N vocabulary words from a specific category.
 */
function buildVocabQuest(rng, level, idSuffix) {
  const category = pick(rng, VOCAB_CATEGORIES);
  const target = scaleTarget(5, 2, 5, 20, level);
  const xp = scaleXp(100, level);
  const dirhams = Math.round(xp * 0.4);

  return {
    id: `daily_vocab_${category}_${idSuffix}`,
    title: `Word Collection: ${category}`,
    titleArabic: `جَمْع الكَلِمات: ${category}`,
    description: `Learn ${target} words from the ${category} category`,
    descriptionArabic: `تَعَلَّم ${target} كَلِمَة مِن فِئَة ${category}`,
    type: 'daily',
    templateType: 'vocab_collection',
    zone: null,
    target,
    trackEvent: `word_learned_${category}`,
    autoStart: true,
    prerequisites: [],
    reward: { xp, dirhams },
    npcGiver: null,
    category,
    isGenerated: true,
  };
}

/**
 * Template: win N battles in a specific zone.
 */
function buildBattleQuest(rng, level, idSuffix) {
  const zone = pick(rng, ZONES);
  const target = scaleTarget(2, 1, 2, 8, level);
  const xp = scaleXp(150, level);
  const dirhams = Math.round(xp * 0.5);

  return {
    id: `daily_battle_${zone}_${idSuffix}`,
    title: `Battle in ${zone.replace(/_/g, ' ')}`,
    titleArabic: `قِتال في ${zone.replace(/_/g, ' ')}`,
    description: `Win ${target} battles in ${zone.replace(/_/g, ' ')}`,
    descriptionArabic: `اِفُز بِـ${target} مَعارِك في ${zone.replace(/_/g, ' ')}`,
    type: 'daily',
    templateType: 'battle_wins',
    zone,
    target,
    trackEvent: 'battle_won',
    autoStart: true,
    prerequisites: [],
    reward: { xp, dirhams },
    npcGiver: null,
    isGenerated: true,
  };
}

/**
 * Template: craft N items.
 */
function buildCraftingQuest(rng, level, idSuffix) {
  const item = pick(rng, CRAFTABLE_ITEMS);
  const target = scaleTarget(1, 1, 1, 5, level);
  const xp = scaleXp(120, level);
  const dirhams = Math.round(xp * 0.6);

  return {
    id: `daily_craft_${item}_${idSuffix}`,
    title: `Crafting: ${item.replace(/_/g, ' ')}`,
    titleArabic: `صُنع: ${item.replace(/_/g, ' ')}`,
    description: `Craft ${target} ${item.replace(/_/g, ' ')}`,
    descriptionArabic: `اِصنَع ${target} ${item.replace(/_/g, ' ')}`,
    type: 'daily',
    templateType: 'crafting',
    zone: null,
    target,
    trackEvent: `item_crafted_${item}`,
    autoStart: true,
    prerequisites: [],
    reward: { xp, dirhams },
    npcGiver: null,
    item,
    isGenerated: true,
  };
}

/**
 * Template: talk to N distinct NPCs.
 */
function buildNpcQuest(rng, level, idSuffix) {
  const target = scaleTarget(2, 1, 2, 6, level);
  const xp = scaleXp(80, level);
  const dirhams = Math.round(xp * 0.5);

  // Pick `target` distinct NPCs to suggest
  const shuffled = [...NPC_IDS].sort(() => rng() - 0.5);
  const targets = shuffled.slice(0, Math.min(target, NPC_IDS.length));

  return {
    id: `daily_npc_interaction_${idSuffix}`,
    title: 'Social Connections',
    titleArabic: 'التَّواصُل الاجتِماعي',
    description: `Talk to ${target} different NPCs`,
    descriptionArabic: `تَحَدَّث إِلى ${target} شَخصِيَّات مُختَلِفَة`,
    type: 'daily',
    templateType: 'npc_interaction',
    zone: null,
    target,
    trackEvent: 'npc_talked',
    autoStart: true,
    prerequisites: [],
    reward: { xp, dirhams },
    npcGiver: null,
    targetNpcs: targets,
    isGenerated: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES = [
  buildVocabQuest,
  buildBattleQuest,
  buildCraftingQuest,
  buildNpcQuest,
];

/**
 * Generate 3 daily quests for the given player state and date.
 *
 * Deterministic: same date + playerState.level → same 3 quests.
 *
 * @param {object} playerState - Must contain: level (number, ≥ 1)
 * @param {Date|string} date   - The date to generate quests for
 * @returns {object[]} - Array of 3 quest objects compatible with questSlice
 */
export function generateDailyQuests(playerState, date) {
  const level = Math.max(1, Math.floor(playerState?.level ?? 1));
  const dateInt = dateToInt(date);
  const seed = deriveSeed(dateInt, level);
  const rng = createSeededRng(seed);

  // Pick 3 distinct templates (no duplicates on the same day)
  const templateOrder = [...TEMPLATES].sort(() => rng() - 0.5);
  const chosen = templateOrder.slice(0, 3);

  const idSuffix = `${dateInt}_lvl${level}`;
  return chosen.map(fn => fn(rng, level, idSuffix));
}

/**
 * Generate 1 weekly quest for the given player state and date.
 *
 * Targets are larger than daily quests. Resets on Monday UTC.
 * Deterministic: same week + playerState.level → same quest.
 *
 * @param {object} playerState - Must contain: level (number, ≥ 1)
 * @param {Date|string} date   - Any date within the target week
 * @returns {object} - A single weekly quest object
 */
export function generateWeeklyQuest(playerState, date) {
  const level = Math.max(1, Math.floor(playerState?.level ?? 1));
  const weekInt = dateToWeekInt(date);
  const seed = deriveSeed(weekInt, level);
  const rng = createSeededRng(seed);

  // Weekly quests use vocab_collection with a larger target
  const category = pick(rng, VOCAB_CATEGORIES);
  const target = scaleTarget(20, 5, 20, 60, level);
  const xp = scaleXp(500, level);
  const dirhams = Math.round(xp * 0.8);

  return {
    id: `weekly_vocab_${category}_${weekInt}_lvl${level}`,
    title: `Weekly Challenge: ${category}`,
    titleArabic: `التَّحَدِّي الأُسبوعي: ${category}`,
    description: `Learn ${target} ${category} words this week`,
    descriptionArabic: `تَعَلَّم ${target} كَلِمَة مِن فِئَة ${category} هٰذا الأُسبوع`,
    type: 'weekly',
    templateType: 'vocab_collection',
    zone: null,
    target,
    trackEvent: `word_learned_${category}`,
    autoStart: true,
    prerequisites: [],
    reward: { xp, dirhams },
    npcGiver: null,
    category,
    isGenerated: true,
  };
}
