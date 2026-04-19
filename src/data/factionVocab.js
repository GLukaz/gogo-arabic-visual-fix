/**
 * factionVocab.js — Vocabulary rewards unlocked at faction tier thresholds (Phase 53)
 *
 * Each faction grants domain-specific Arabic words when the player reaches
 * a tier threshold for the first time. Words are drawn from the faction's
 * vocabCategories and added to the FSRS queue.
 *
 * Structure: { factionId: { tierKey: [wordId, ...] } }
 * Tier keys match FACTION_TIERS: 'friendly', 'trusted', 'allied', 'revered'
 */

import { FACTION_IDS } from './factions.js';

export const FACTION_VOCAB_REWARDS = Object.freeze({
  [FACTION_IDS.SCHOLARS]: {
    friendly: [
      'kitab', 'qalam', 'ilm', 'darasa', 'maktaba', 'ustadh',
      'qiraa', 'kitaba', 'fahima', 'allama', 'talaba', 'hafitha',
    ],
    trusted: [
      'bahth', 'falsafa', 'mantiq', 'nahw', 'sarf', 'balagha',
      'tafsir', 'riwaya', 'makhtutat', 'tarjama', 'muallif', 'mashruha',
    ],
  },

  [FACTION_IDS.MERCHANTS]: {
    friendly: [
      'suq', 'thaman', 'bay', 'shiraa', 'tijara', 'dirham',
      'dinar', 'ribh', 'khasara', 'tajir', 'bidaa', 'mizan',
    ],
    trusted: [
      'muqayada', 'aqd', 'damana', 'shuhud', 'rahn', 'qard',
      'faidah', 'tasdir', 'istirad', 'jumruk', 'makhzan', 'sharika',
    ],
  },

  [FACTION_IDS.ARTISANS]: {
    friendly: [
      'hadid', 'khashab', 'fakhkhar', 'nasij', 'hijara', 'naqsh',
      'sinaa', 'alat', 'mitrqa', 'minshar', 'ibra', 'furn',
    ],
    trusted: [
      'tiraz', 'zukhruf', 'handasa', 'qaws', 'amud', 'qubba',
      'musamma', 'tashkil', 'siqal', 'lawha', 'rabta', 'qalb',
    ],
  },

  [FACTION_IDS.TRAVELERS]: {
    friendly: [
      'safar', 'tariq', 'jiha', 'shamal', 'janub', 'sharq',
      'gharb', 'kharita', 'bahr', 'jabal', 'sahra', 'nahr',
    ],
    trusted: [
      'bawsala', 'najm', 'ufuq', 'mina', 'qafila', 'rahhal',
      'mustawatn', 'jazira', 'wadi', 'ghar', 'mamarr', 'jisr',
    ],
  },

  [FACTION_IDS.GUARDIANS]: {
    friendly: [
      'sayf', 'diri', 'haris', 'bab', 'sur', 'qalaa',
      'amr', 'jundy', 'himaya', 'wafa', 'sharaf', 'quwwa',
    ],
    trusted: [
      'jaysh', 'qaaid', 'khuttat', 'harb', 'silm', 'muahada',
      'asir', 'nashr', 'difa', 'hujum', 'kamiin', 'raya',
    ],
  },

  [FACTION_IDS.ARTISTS]: {
    friendly: [
      'shir', 'qasida', 'ghina', 'ud', 'nay', 'raqsa',
      'qissa', 'riwaya_adab', 'masrah', 'fann', 'jamal', 'ilham',
    ],
    trusted: [
      'bayt_shir', 'wazn', 'qafiya', 'majaz', 'tashbih', 'kinaya',
      'maqam', 'nagham', 'lahn', 'ibda', 'dhawq', 'turath',
    ],
  },
});
