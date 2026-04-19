/**
 * factions.js — 6 faction definitions for the alignment system
 *
 * Each faction represents a cultural and academic tradition within the Arabic-speaking world.
 * Players accumulate alignment points through quests, dialogue choices, and NPC interactions.
 * Primary faction (highest score) grants full bonuses; secondary faction grants half bonuses.
 */

export const FACTION_IDS = Object.freeze({
  SCHOLARS:  'scholars',
  MERCHANTS: 'merchants',
  ARTISANS:  'artisans',
  TRAVELERS: 'travelers',
  GUARDIANS: 'guardians',
  ARTISTS:   'artists',
});

/**
 * @typedef {Object} FactionBonus
 * @property {number} vocabXpMultiplier  — multiplier applied to vocabulary XP gains (1.0 = no bonus)
 * @property {number} questXpMultiplier  — multiplier applied to quest XP gains (1.0 = no bonus)
 */

/**
 * @typedef {Object} Faction
 * @property {string}       id                — matches FACTION_IDS key (lowercase)
 * @property {string}       name              — English faction name
 * @property {string}       nameArabic        — Arabic faction name
 * @property {string}       description       — brief lore description
 * @property {string}       icon              — emoji representing the faction
 * @property {string[]}     vocabCategories   — vocabulary category tags this faction prioritises
 * @property {string[]}     npcMembers        — NPC IDs aligned to this faction
 * @property {FactionBonus} bonuses           — XP multipliers granted when this is the primary faction
 */

/** @type {Faction[]} */
export const FACTIONS = Object.freeze([
  {
    id: FACTION_IDS.SCHOLARS,
    name: 'Scholars',
    nameArabic: 'العلماء',
    description:
      'Keepers of knowledge and the written word. The Scholars guard the great libraries, ' +
      'teach the art of calligraphy, and debate sacred texts. Their Arabic is precise, ' +
      'formal, and rich with classical vocabulary.',
    icon: '📚',
    vocabCategories: [
      'academic',
      'reading_comprehension',
      'calligraphy',
      'religion',
      'grammar',
      'classical',
    ],
    npcMembers: ['scholar_ibrahim', 'librarian_fatima', 'calligrapher_hassan', 'mentor_amira'],
    bonuses: {
      vocabXpMultiplier: 1.4,
      questXpMultiplier: 1.1,
    },
  },

  {
    id: FACTION_IDS.MERCHANTS,
    name: 'Merchants',
    nameArabic: 'التجار',
    description:
      'Masters of negotiation and the marketplace. Merchants travel trade routes, ' +
      'haggle in crowded souqs, and count coins in a dozen currencies. Their Arabic ' +
      'is pragmatic, persuasive, and number-fluent.',
    icon: '⚖️',
    vocabCategories: [
      'trade',
      'numbers',
      'marketplace',
      'negotiation',
      'currency',
      'commerce',
    ],
    npcMembers: ['merchant_yusuf', 'spice_trader_layla', 'money_changer_omar', 'vendor_sara'],
    bonuses: {
      vocabXpMultiplier: 1.2,
      questXpMultiplier: 1.3,
    },
  },

  {
    id: FACTION_IDS.ARTISANS,
    name: 'Artisans',
    nameArabic: 'الحرفيون',
    description:
      'Craftspeople of extraordinary skill. Artisans shape metal, weave cloth, ' +
      'and build structures that outlast empires. Their Arabic is precise and technical, ' +
      'filled with the names of tools, materials, and methods.',
    icon: '🔨',
    vocabCategories: [
      'crafting',
      'technical',
      'workshop',
      'materials',
      'tools',
      'architecture',
    ],
    npcMembers: ['blacksmith_tariq', 'weaver_nadia', 'potter_zaid', 'carpenter_rania'],
    bonuses: {
      vocabXpMultiplier: 1.3,
      questXpMultiplier: 1.2,
    },
  },

  {
    id: FACTION_IDS.TRAVELERS,
    name: 'Travelers',
    nameArabic: 'المسافرون',
    description:
      'Wanderers of deserts, seas, and mountain passes. Travelers carry knowledge ' +
      'between distant lands and speak the Arabic of roads, ports, and caravanserais. ' +
      'Their vocabulary spans geography, navigation, and cultural exchange.',
    icon: '🧭',
    vocabCategories: [
      'geography',
      'navigation',
      'cultural_exchange',
      'transport',
      'directions',
      'nature',
    ],
    npcMembers: ['navigator_khalid', 'guide_amira', 'cartographer_leila', 'caravan_leader_malik'],
    bonuses: {
      vocabXpMultiplier: 1.2,
      questXpMultiplier: 1.4,
    },
  },

  {
    id: FACTION_IDS.GUARDIANS,
    name: 'Guardians',
    nameArabic: 'الحراس',
    description:
      'Warriors and protectors who live by a strict code of honour. Guardians defend ' +
      'city gates, escort caravans, and train in ancient martial disciplines. ' +
      'Their Arabic reflects duty, loyalty, and the language of command.',
    icon: '🛡️',
    vocabCategories: [
      'military',
      'honor',
      'protection',
      'command',
      'weapons',
      'law',
    ],
    npcMembers: ['captain_samir', 'guard_fatima', 'trainer_ali', 'sentinel_hind'],
    bonuses: {
      vocabXpMultiplier: 1.1,
      questXpMultiplier: 1.5,
    },
  },

  {
    id: FACTION_IDS.ARTISTS,
    name: 'Artists',
    nameArabic: 'الفنانون',
    description:
      'Poets, musicians, and performers who breathe life into language. Artists compose ' +
      'in classical metres, play the oud in moonlit courtyards, and recite stories ' +
      'that stir the soul. Their Arabic soars with metaphor and beauty.',
    icon: '🎭',
    vocabCategories: [
      'literary',
      'poetry',
      'music',
      'performance',
      'storytelling',
      'emotions',
    ],
    npcMembers: ['poet_shahira', 'musician_dawud', 'storyteller_maryam', 'dancer_zineb'],
    bonuses: {
      vocabXpMultiplier: 1.35,
      questXpMultiplier: 1.15,
    },
  },
]);

/** Convenience map: factionId → Faction object (O(1) lookup) */
export const FACTION_BY_ID = Object.freeze(
  Object.fromEntries(FACTIONS.map((f) => [f.id, f]))
);

export const FACTION_TIERS = Object.freeze({
  NEUTRAL:  { label: 'Neutral',  labelArabic: 'محايد',   threshold: 0  },
  FRIENDLY: { label: 'Friendly', labelArabic: 'ودي',     threshold: 25 },
  TRUSTED:  { label: 'Trusted',  labelArabic: 'موثوق',   threshold: 50 },
  ALLIED:   { label: 'Allied',   labelArabic: 'حليف',    threshold: 75 },
  REVERED:  { label: 'Revered',  labelArabic: 'موقّر',   threshold: 100 },
});

export function getFactionTier(score) {
  if (score >= 100) return FACTION_TIERS.REVERED;
  if (score >= 75)  return FACTION_TIERS.ALLIED;
  if (score >= 50)  return FACTION_TIERS.TRUSTED;
  if (score >= 25)  return FACTION_TIERS.FRIENDLY;
  return FACTION_TIERS.NEUTRAL;
}

export const NPC_FACTION_MAP = Object.freeze(
  Object.fromEntries(
    FACTIONS.flatMap((f) => f.npcMembers.map((npcId) => [npcId, f.id]))
  )
);
