/**
 * factionEvents.js — 12 rotating faction events (2 per faction)
 *
 * Events are scheduled either daily or weekly. During an active event the
 * associated vocabBoost category grants additional XP and the faction's
 * alignment point gains are increased.
 *
 * Consumers should check event.schedule and drive active/inactive state from
 * a clock (e.g. timeSlice or a Date comparison). Each event specifies a
 * duration in hours so the game can automatically expire them.
 */

import { FACTION_IDS } from './factions.js';

/**
 * @typedef {Object} FactionEvent
 * @property {string} id          — unique event identifier
 * @property {string} factionId   — owning faction (matches FACTION_IDS)
 * @property {string} name        — English event name
 * @property {string} nameArabic  — Arabic event name
 * @property {string} description — short flavour text shown to the player
 * @property {number} duration    — how long the event lasts (hours)
 * @property {string} vocabBoost  — vocabulary category string boosted during this event
 * @property {'weekly'|'daily'} schedule — how often the event recurs
 */

/** @type {FactionEvent[]} */
export const FACTION_EVENTS = Object.freeze([

  // ── SCHOLARS ────────────────────────────────────────────────────────────────

  {
    id: 'scholars_debate',
    factionId: FACTION_IDS.SCHOLARS,
    name: "Scholar's Debate",
    nameArabic: 'نقاش العلماء',
    description:
      'The scholars of the great library gather to dispute grammar and theology. ' +
      'Attend, listen, and sharpen your academic vocabulary.',
    duration: 4,
    vocabBoost: 'academic',
    schedule: 'weekly',
  },

  {
    id: 'calligraphy_workshop',
    factionId: FACTION_IDS.SCHOLARS,
    name: 'Calligraphy Workshop',
    nameArabic: 'ورشة الخط العربي',
    description:
      'Master calligrapher Hassan opens his studio to students. ' +
      'Practice letter forms and absorb the classical vocabulary of the written arts.',
    duration: 2,
    vocabBoost: 'calligraphy',
    schedule: 'daily',
  },

  // ── MERCHANTS ───────────────────────────────────────────────────────────────

  {
    id: 'market_festival',
    factionId: FACTION_IDS.MERCHANTS,
    name: 'Market Festival',
    nameArabic: 'مهرجان السوق',
    description:
      'Stalls overflow with spices, cloth, and curiosities. The air rings with haggling. ' +
      'Join the festival and master the language of trade.',
    duration: 6,
    vocabBoost: 'marketplace',
    schedule: 'weekly',
  },

  {
    id: 'counting_house_drill',
    factionId: FACTION_IDS.MERCHANTS,
    name: 'Counting House Drill',
    nameArabic: 'تمرين بيت الحسابات',
    description:
      'The money changers run rapid-fire arithmetic drills at dawn. ' +
      'Practice numbers and currency vocabulary before the market opens.',
    duration: 1,
    vocabBoost: 'numbers',
    schedule: 'daily',
  },

  // ── ARTISANS ─────────────────────────────────────────────────────────────────

  {
    id: 'guild_showcase',
    factionId: FACTION_IDS.ARTISANS,
    name: 'Guild Showcase',
    nameArabic: 'عرض النقابة',
    description:
      'Every artisan guild displays its finest work in the central courtyard. ' +
      'Walk among the stalls and learn the technical names of materials and methods.',
    duration: 5,
    vocabBoost: 'materials',
    schedule: 'weekly',
  },

  {
    id: 'workshop_open_day',
    factionId: FACTION_IDS.ARTISANS,
    name: 'Workshop Open Day',
    nameArabic: 'يوم الورشة المفتوح',
    description:
      'The blacksmith and the weaver open their workshops to visitors. ' +
      'Learn the vocabulary of tools and crafting techniques firsthand.',
    duration: 3,
    vocabBoost: 'tools',
    schedule: 'daily',
  },

  // ── TRAVELERS ────────────────────────────────────────────────────────────────

  {
    id: 'caravan_departure',
    factionId: FACTION_IDS.TRAVELERS,
    name: 'Caravan Departure',
    nameArabic: 'انطلاق القافلة',
    description:
      'A great caravan sets out at dawn for distant cities. Help load supplies and ' +
      'learn the geographic vocabulary of routes, landmarks, and distant lands.',
    duration: 8,
    vocabBoost: 'geography',
    schedule: 'weekly',
  },

  {
    id: 'navigators_circle',
    factionId: FACTION_IDS.TRAVELERS,
    name: "Navigator's Circle",
    nameArabic: 'حلقة الملاحين',
    description:
      'Sailors and desert guides gather at dusk to share star maps and navigation lore. ' +
      'Absorb the language of direction, distance, and celestial wayfinding.',
    duration: 2,
    vocabBoost: 'navigation',
    schedule: 'daily',
  },

  // ── GUARDIANS ────────────────────────────────────────────────────────────────

  {
    id: 'honour_ceremony',
    factionId: FACTION_IDS.GUARDIANS,
    name: 'Honour Ceremony',
    nameArabic: 'حفل الشرف',
    description:
      'The city guard assembles at the great gate to recite oaths and commend brave deeds. ' +
      'Listen and learn the formal language of honour, duty, and protection.',
    duration: 2,
    vocabBoost: 'honor',
    schedule: 'weekly',
  },

  {
    id: 'training_ground_drill',
    factionId: FACTION_IDS.GUARDIANS,
    name: 'Training Ground Drill',
    nameArabic: 'تدريب الميدان',
    description:
      'Captain Samir leads dawn drills on the training ground. ' +
      'Commands ring out sharp and clear — the best time to learn military vocabulary.',
    duration: 1,
    vocabBoost: 'command',
    schedule: 'daily',
  },

  // ── ARTISTS ──────────────────────────────────────────────────────────────────

  {
    id: 'poetry_circle',
    factionId: FACTION_IDS.ARTISTS,
    name: 'Poetry Circle',
    nameArabic: 'حلقة الشعر',
    description:
      'Poets gather under the stars to recite classical verse and compose new lines. ' +
      'Join the circle, offer a line of your own, and immerse yourself in literary Arabic.',
    duration: 3,
    vocabBoost: 'poetry',
    schedule: 'weekly',
  },

  {
    id: 'oud_evening',
    factionId: FACTION_IDS.ARTISTS,
    name: 'Oud Evening',
    nameArabic: 'سهرة العود',
    description:
      'Musician Dawud performs in the courtyard of the inn as the sun sets. ' +
      'The melodies inspire storytelling — a perfect setting for music and performance vocabulary.',
    duration: 2,
    vocabBoost: 'music',
    schedule: 'daily',
  },
]);

/** Convenience getter: all events for a specific faction */
export const getEventsByFaction = (factionId) =>
  FACTION_EVENTS.filter((e) => e.factionId === factionId);

/** Convenience getter: events by schedule type */
export const getEventsBySchedule = (schedule) =>
  FACTION_EVENTS.filter((e) => e.schedule === schedule);
