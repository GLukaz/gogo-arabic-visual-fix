/**
 * Lore Entries — Orchestrator module combining all lore entry batches.
 * Phase 79 (NAR-04): 300+ discoverable entries across 10 categories.
 *
 * Categories: history, culture, language, geography, religion,
 *             science, art, trade, warfare, mythology
 */

import { LORE_ENTRIES_BATCH_1 } from './loreEntriesBatch1.js';
import { LORE_ENTRIES_BATCH_2 } from './loreEntriesBatch2.js';
import { LORE_ENTRIES_BATCH_3 } from './loreEntriesBatch3.js';
import { LORE_ENTRIES_BATCH_4 } from './loreEntriesBatch4.js';

/** All lore entries combined */
export const LORE_ENTRIES = [...LORE_ENTRIES_BATCH_1, ...LORE_ENTRIES_BATCH_2, ...LORE_ENTRIES_BATCH_3, ...LORE_ENTRIES_BATCH_4];

/** Lookup by ID */
const _byId = new Map(LORE_ENTRIES.map((e) => [e.id, e]));
export function getLoreEntryById(id) {
  return _byId.get(id) ?? null;
}

/** Filter by category */
export function getLoreEntriesByCategory(category) {
  return LORE_ENTRIES.filter((e) => e.category === category);
}

/** Filter by discovery trigger prefix (e.g. 'zone_visit', 'npc_talk') */
export function getLoreEntriesByTriggerType(triggerType) {
  return LORE_ENTRIES.filter((e) => e.discoveryTrigger.startsWith(triggerType));
}

/** Get entries matching a specific trigger value (e.g. 'zone_visit:oasis-village') */
export function getLoreEntriesByTrigger(trigger) {
  return LORE_ENTRIES.filter((e) => e.discoveryTrigger === trigger);
}

/** All unique categories */
export const LORE_CATEGORIES = [
  'history', 'culture', 'language', 'geography', 'religion',
  'science', 'art', 'trade', 'warfare', 'mythology',
  'calligraphy', 'scholars', 'world-lore',
];

/** Category metadata for UI */
export const CATEGORY_META = {
  history:     { icon: '\uD83D\uDCDC', label: 'History',     labelArabic: '\u062A\u0627\u0631\u064A\u062E' },
  culture:     { icon: '\uD83C\uDFFA', label: 'Culture',     labelArabic: '\u062B\u0642\u0627\u0641\u0629' },
  language:    { icon: '\u270F\uFE0F',  label: 'Language',    labelArabic: '\u0644\u063A\u0629' },
  geography:   { icon: '\uD83D\uDDFA\uFE0F', label: 'Geography', labelArabic: '\u062C\u063A\u0631\u0627\u0641\u064A\u0627' },
  religion:    { icon: '\uD83D\uDD4C', label: 'Religion',    labelArabic: '\u062F\u064A\u0646' },
  science:     { icon: '\uD83D\uDD2C', label: 'Science',     labelArabic: '\u0639\u0644\u0645' },
  art:         { icon: '\uD83C\uDFA8', label: 'Art',         labelArabic: '\u0641\u0646' },
  trade:       { icon: '\u2696\uFE0F',  label: 'Trade',       labelArabic: '\u062A\u062C\u0627\u0631\u0629' },
  warfare:     { icon: '\u2694\uFE0F',  label: 'Warfare',     labelArabic: '\u062D\u0631\u0628' },
  mythology:   { icon: '\uD83D\uDC09', label: 'Mythology',   labelArabic: '\u0623\u0633\u0627\u0637\u064A\u0631' },
  calligraphy: { icon: '\u2712\uFE0F',  label: 'Calligraphy', labelArabic: '\u0627\u0644\u062E\u0637' },
  scholars:    { icon: '\uD83D\uDCDA', label: 'Scholars',    labelArabic: '\u0627\u0644\u0639\u0644\u0645\u0627\u0621' },
  'world-lore':{ icon: '\uD83C\uDF0D', label: 'World Lore', labelArabic: '\u0623\u0633\u0627\u0637\u064A\u0631 \u0627\u0644\u0639\u0627\u0644\u0645' },
};

/** Per-category totals for progress tracking */
export function getCategoryTotals() {
  const totals = {};
  for (const cat of LORE_CATEGORIES) {
    totals[cat] = LORE_ENTRIES.filter((e) => e.category === cat).length;
  }
  return totals;
}
