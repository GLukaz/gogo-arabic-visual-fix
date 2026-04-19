/**
 * factionGatedContent.js — Data-driven faction-gated bonus content (Phase 53)
 *
 * Each faction has:
 * - Bonus dialogue at Friendly (25+)
 * - Side quest at Trusted (50+)
 * - Shop discount at Allied (75+)
 *
 * All entries use factionRequired requirement type for ActionSetExecutor.
 * Main storyline quests have NO faction requirements (FACT-04).
 */

import { FACTION_IDS } from './factions.js';

/**
 * Faction-gated bonus dialogue lines.
 * These are ADDITIONAL dialogue branches — the unconditional fallback always exists.
 * ActionSetExecutor evaluates these as actionSets with factionRequired requirements.
 */
export const FACTION_GATED_DIALOGUE = {
  // ---- SCHOLARS ----
  [FACTION_IDS.SCHOLARS]: {
    friendly: [
      { npcId: 'scholar_ibrahim', dialogueKey: 'scholars_friendly_secret_text', description: 'Ibrahim shares a hidden manuscript passage' },
      { npcId: 'librarian_fatima', dialogueKey: 'scholars_friendly_rare_book', description: 'Fatima reveals a rare book location' },
    ],
    trusted: [
      { npcId: 'scholar_ibrahim', dialogueKey: 'scholars_trusted_translation', description: 'Ibrahim offers to teach advanced translation techniques' },
      { npcId: 'calligrapher_hassan', dialogueKey: 'scholars_trusted_calligraphy', description: 'Hassan demonstrates a master calligraphy stroke' },
    ],
  },

  // ---- MERCHANTS ----
  [FACTION_IDS.MERCHANTS]: {
    friendly: [
      { npcId: 'merchant_yusuf', dialogueKey: 'merchants_friendly_trade_tip', description: 'Yusuf shares a trade route secret' },
      { npcId: 'spice_trader_layla', dialogueKey: 'merchants_friendly_spice_lore', description: 'Layla tells the story behind a rare spice' },
    ],
    trusted: [
      { npcId: 'merchant_yusuf', dialogueKey: 'merchants_trusted_wholesale', description: 'Yusuf offers wholesale prices on select items' },
      { npcId: 'money_changer_omar', dialogueKey: 'merchants_trusted_exchange', description: 'Omar reveals currency exchange secrets' },
    ],
  },

  // ---- ARTISANS ----
  [FACTION_IDS.ARTISANS]: {
    friendly: [
      { npcId: 'blacksmith_tariq', dialogueKey: 'artisans_friendly_forging', description: 'Tariq explains Damascus steel forging' },
      { npcId: 'weaver_nadia', dialogueKey: 'artisans_friendly_patterns', description: 'Nadia shares geometric pattern meanings' },
    ],
    trusted: [
      { npcId: 'blacksmith_tariq', dialogueKey: 'artisans_trusted_masterwork', description: 'Tariq offers to craft a masterwork item' },
      { npcId: 'potter_zaid', dialogueKey: 'artisans_trusted_glazing', description: 'Zaid teaches advanced glazing vocabulary' },
    ],
  },

  // ---- TRAVELERS ----
  [FACTION_IDS.TRAVELERS]: {
    friendly: [
      { npcId: 'navigator_khalid', dialogueKey: 'travelers_friendly_star_nav', description: 'Khalid teaches star navigation terms' },
      { npcId: 'guide_amira', dialogueKey: 'travelers_friendly_shortcut', description: 'Amira reveals a hidden shortcut' },
    ],
    trusted: [
      { npcId: 'navigator_khalid', dialogueKey: 'travelers_trusted_map', description: 'Khalid shares a secret map' },
      { npcId: 'caravan_leader_malik', dialogueKey: 'travelers_trusted_caravan', description: 'Malik invites you on a special caravan route' },
    ],
  },

  // ---- GUARDIANS ----
  [FACTION_IDS.GUARDIANS]: {
    friendly: [
      { npcId: 'captain_samir', dialogueKey: 'guardians_friendly_tactics', description: 'Samir discusses battle formations' },
      { npcId: 'guard_fatima', dialogueKey: 'guardians_friendly_patrol', description: 'Fatima shares gate patrol stories' },
    ],
    trusted: [
      { npcId: 'captain_samir', dialogueKey: 'guardians_trusted_training', description: 'Samir offers advanced combat vocabulary training' },
      { npcId: 'trainer_ali', dialogueKey: 'guardians_trusted_sparring', description: 'Ali invites you to the training grounds' },
    ],
  },

  // ---- ARTISTS ----
  [FACTION_IDS.ARTISTS]: {
    friendly: [
      { npcId: 'poet_shahira', dialogueKey: 'artists_friendly_verse', description: 'Shahira recites an exclusive poem' },
      { npcId: 'musician_dawud', dialogueKey: 'artists_friendly_melody', description: 'Dawud plays a rare melody and teaches its Arabic title' },
    ],
    trusted: [
      { npcId: 'poet_shahira', dialogueKey: 'artists_trusted_composition', description: 'Shahira teaches the art of Arabic poetic meters' },
      { npcId: 'storyteller_maryam', dialogueKey: 'artists_trusted_epic', description: 'Maryam shares an unfinished epic tale' },
    ],
  },
};

/**
 * Faction-gated side quests — unlocked at Trusted (50+).
 * Each faction has exactly one side quest with factionRequired gating.
 */
export const FACTION_GATED_QUESTS = {
  [FACTION_IDS.SCHOLARS]: {
    questId: 'scholars_lost_manuscript',
    title: 'The Lost Manuscript',
    titleArabic: 'المخطوطة المفقودة',
    description: 'Help Ibrahim recover pages of a scattered manuscript from the House of Wisdom',
    factionRequired: { type: 'factionRequired', factionId: 'scholars', minScore: 50 },
    giver: 'scholar_ibrahim',
  },
  [FACTION_IDS.MERCHANTS]: {
    questId: 'merchants_silk_road',
    title: 'The Silk Road Cipher',
    titleArabic: 'شيفرة طريق الحرير',
    description: 'Decode encrypted trade ledgers for Yusuf to unlock a lost trade route',
    factionRequired: { type: 'factionRequired', factionId: 'merchants', minScore: 50 },
    giver: 'merchant_yusuf',
  },
  [FACTION_IDS.ARTISANS]: {
    questId: 'artisans_master_blueprint',
    title: 'The Master Blueprint',
    titleArabic: 'المخطط الرئيسي',
    description: 'Reconstruct an ancient architectural blueprint using Arabic geometric terms',
    factionRequired: { type: 'factionRequired', factionId: 'artisans', minScore: 50 },
    giver: 'blacksmith_tariq',
  },
  [FACTION_IDS.TRAVELERS]: {
    questId: 'travelers_lost_caravan',
    title: 'The Lost Caravan',
    titleArabic: 'القافلة المفقودة',
    description: 'Track a missing caravan using Arabic navigation terms and star charts',
    factionRequired: { type: 'factionRequired', factionId: 'travelers', minScore: 50 },
    giver: 'navigator_khalid',
  },
  [FACTION_IDS.GUARDIANS]: {
    questId: 'guardians_ancient_oath',
    title: 'The Ancient Oath',
    titleArabic: 'القسم القديم',
    description: 'Recite the Guardian oath in classical Arabic to earn their deepest trust',
    factionRequired: { type: 'factionRequired', factionId: 'guardians', minScore: 50 },
    giver: 'captain_samir',
  },
  [FACTION_IDS.ARTISTS]: {
    questId: 'artists_golden_verse',
    title: 'The Golden Verse',
    titleArabic: 'البيت الذهبي',
    description: 'Complete a collaborative poem with Shahira at the moonlit courtyard',
    factionRequired: { type: 'factionRequired', factionId: 'artists', minScore: 50 },
    giver: 'poet_shahira',
  },
};

/**
 * Shop discount tiers by faction alignment.
 * Allied (75+) grants 15% discount at the faction's shops.
 */
export const FACTION_SHOP_DISCOUNTS = {
  ALLIED_DISCOUNT: 0.85,  // 15% off
  ALLIED_THRESHOLD: 75,
};
