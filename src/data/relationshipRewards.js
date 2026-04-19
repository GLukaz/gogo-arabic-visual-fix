/**
 * relationshipRewards.js — Friendship tier milestones and per-NPC titles
 *
 * Defines rewards unlocked when a player crosses a friendship tier boundary
 * with any NPC, plus the unique title earned at the "close" tier for each NPC.
 *
 * Tier thresholds (from npcSlice.js):
 *   cold     0-24
 *   cautious 25-49
 *   friendly 50-74
 *   close    75-100
 */

// ─────────────────────────────────────────────────────────────
// Tier milestone definitions
// ─────────────────────────────────────────────────────────────

export const RELATIONSHIP_MILESTONES = Object.freeze({
  cautious: {
    threshold: 25,
    reward: 'unlock_basic_dialogue',
    description: 'New dialogue options unlocked',
    descriptionArabic: 'خيارات حوار جديدة مُتاحة',
    xp: 25,
  },
  friendly: {
    threshold: 50,
    reward: 'unlock_gift_preferences',
    description: 'Gift preferences revealed',
    descriptionArabic: 'تفضيلات الهدايا مكشوفة',
    xp: 50,
    vocabReward: true, // teaches 2 words from NPC's vocab
  },
  close: {
    threshold: 75,
    reward: 'unlock_special_quest',
    description: 'Special quest unlocked',
    descriptionArabic: 'مهمة خاصة مفتوحة',
    xp: 100,
    vocabReward: true, // teaches 5 words
    title: true, // earns title like "Friend of Ibrahim"
  },
});

// ─────────────────────────────────────────────────────────────
// Per-NPC friendship titles (earned at "close" tier, 75+)
// Covers: 27 gift-system NPCs + faction NPCs + remaining world NPCs = all 64
// ─────────────────────────────────────────────────────────────

export const NPC_FRIENDSHIP_TITLES = Object.freeze({
  // --- Core gift-system NPCs (27 referenced in gifts.js) ---
  'scholar-yusuf':        { titleArabic: 'صديق يوسف',       titleEnglish: 'Friend of Yusuf' },
  'merchant-fatima':      { titleArabic: 'رفيقة فاطمة',      titleEnglish: 'Companion of Fatima' },
  'student-khalid':       { titleArabic: 'زميل خالد',        titleEnglish: 'Ally of Khalid' },
  'librarian-ibrahim':    { titleArabic: 'رفيق إبراهيم',     titleEnglish: 'Companion of Ibrahim' },
  'scribe-amina':         { titleArabic: 'صديقة أمينة',      titleEnglish: 'Friend of Amina' },
  'spice-seller-layla':   { titleArabic: 'حليفة ليلى',       titleEnglish: 'Ally of Layla' },
  'trader-hassan':        { titleArabic: 'شريك حسن',        titleEnglish: 'Partner of Hassan' },
  'guard-hamza':          { titleArabic: 'رفيق حمزة',        titleEnglish: 'Brother-in-arms of Hamza' },
  'farmer-omar':          { titleArabic: 'صديق عمر',        titleEnglish: 'Friend of Omar' },
  'herbalist-maryam':     { titleArabic: 'صديقة مريم',       titleEnglish: 'Friend of Maryam' },
  'elder-tariq':          { titleArabic: 'حبيب طارق',       titleEnglish: 'Beloved of Tariq' },
  'storyteller-noor':     { titleArabic: 'مستمع نور',       titleEnglish: 'Listener of Noor' },
  'wanderer-ali':         { titleArabic: 'رفيق علي',         titleEnglish: 'Fellow Wanderer of Ali' },
  'guide-salim':          { titleArabic: 'صاحب سليم',       titleEnglish: 'Companion of Salim' },
  'weaver-zahra':         { titleArabic: 'صديقة زهرة',       titleEnglish: 'Friend of Zahra' },
  'healer-khadija':       { titleArabic: 'حبيبة خديجة',      titleEnglish: 'Beloved of Khadija' },
  'captain-rashid':       { titleArabic: 'رفيق راشد',        titleEnglish: 'Comrade of Rashid' },
  'fishmonger-hana':      { titleArabic: 'صديقة هنا',        titleEnglish: 'Friend of Hana' },
  'blacksmith-daud':      { titleArabic: 'حليف داود',        titleEnglish: 'Ally of Daud' },
  'vizier-abbas':         { titleArabic: 'مقرّب عباس',       titleEnglish: 'Confidant of Abbas' },
  'princess-aisha':       { titleArabic: 'صديقة عائشة',      titleEnglish: 'Friend of Aisha' },
  'poet-rumi':            { titleArabic: 'تلميذ الرومي',     titleEnglish: 'Disciple of Rumi' },
  'imam-muhammad':        { titleArabic: 'مريد محمد',        titleEnglish: 'Devotee of Muhammad' },
  'baker-yasmin':         { titleArabic: 'صديقة ياسمين',     titleEnglish: 'Friend of Yasmin' },
  'astronomer-zain':      { titleArabic: 'تلميذ زين',        titleEnglish: 'Student of Zain' },
  'carpet-seller-jamal':  { titleArabic: 'صديق جمال',       titleEnglish: 'Friend of Jamal' },
  'dockmaster-nadia':     { titleArabic: 'حليفة نادية',      titleEnglish: 'Ally of Nadia' },

  // --- Additional world NPCs ---
  'mountain-hermit-idris': { titleArabic: 'صديق إدريس',     titleEnglish: 'Friend of Idris' },
  'stable-master-yara':   { titleArabic: 'صديقة يارا',       titleEnglish: 'Friend of Yara' },
  'garden-keeper-leila':  { titleArabic: 'صديقة ليلى',       titleEnglish: 'Friend of Leila' },
  'guide-amira':          { titleArabic: 'رفيقة أميرة',      titleEnglish: 'Companion of Amira' },
  'mysterious-traveler':  { titleArabic: 'صديق المسافر',     titleEnglish: 'Friend of the Traveler' },
  'night-guard':          { titleArabic: 'رفيق الحارس',      titleEnglish: 'Companion of the Guard' },

  // --- Interior NPCs ---
  'scholar-yusuf-interior':    { titleArabic: 'تلميذ يوسف',       titleEnglish: 'Pupil of Yusuf' },
  'merchant-fatima-interior':  { titleArabic: 'زبونة فاطمة',       titleEnglish: 'Patron of Fatima' },
  'librarian-interior':        { titleArabic: 'قارئ المكتبة',       titleEnglish: 'Reader of the Library' },
  'spice-merchant-interior':   { titleArabic: 'زبون التوابل',       titleEnglish: 'Patron of Spices' },
  'textile-merchant-interior': { titleArabic: 'زبون النسيج',        titleEnglish: 'Patron of Textiles' },
  'farmer-interior':           { titleArabic: 'صديق المزارع',       titleEnglish: 'Friend of the Farmer' },
  'bedouin-elder-interior':    { titleArabic: 'حبيب الشيخ',         titleEnglish: 'Beloved of the Elder' },
  'mountain-elder-interior':   { titleArabic: 'تلميذ الشيخ',         titleEnglish: 'Student of the Elder' },
  'imam-interior':             { titleArabic: 'مريد الإمام',          titleEnglish: 'Devotee of the Imam' },
  'tavern-keeper-interior':    { titleArabic: 'صديق الخان',          titleEnglish: 'Friend of the Inn' },
  'vizier-interior':           { titleArabic: 'مقرّب الوزير',         titleEnglish: 'Confidant of the Vizier' },

  // --- Companion NPCs ---
  'companion_amira':  { titleArabic: 'خِلّ أميرة',     titleEnglish: 'Soulmate of Amira' },
  'companion_khalid': { titleArabic: 'خِلّ خالد',      titleEnglish: 'Soulmate of Khalid' },
  'companion_zahra':  { titleArabic: 'خِلّ زهرة',      titleEnglish: 'Soulmate of Zahra' },
  'companion_omar':   { titleArabic: 'خِلّ عمر',       titleEnglish: 'Soulmate of Omar' },
  'companion_layla':  { titleArabic: 'خِلّ ليلى',      titleEnglish: 'Soulmate of Layla' },
  'companion_hassan': { titleArabic: 'خِلّ حسن',       titleEnglish: 'Soulmate of Hassan' },
  'companion_fatima': { titleArabic: 'خِلّ فاطمة',     titleEnglish: 'Soulmate of Fatima' },
  'companion_ali':    { titleArabic: 'خِلّ علي',        titleEnglish: 'Soulmate of Ali' },
  'companion_maryam': { titleArabic: 'خِلّ مريم',      titleEnglish: 'Soulmate of Maryam' },
  'companion_samir':  { titleArabic: 'خِلّ سمير',      titleEnglish: 'Soulmate of Samir' },
  'companion_nadia':  { titleArabic: 'خِلّ نادية',     titleEnglish: 'Soulmate of Nadia' },
  'companion_tariq':  { titleArabic: 'خِلّ طارق',      titleEnglish: 'Soulmate of Tariq' },

  // --- Zone poet NPCs ---
  'poet-oasis':    { titleArabic: 'مريد شاعر الواحة',   titleEnglish: 'Devotee of the Oasis Poet' },
  'poet-library':  { titleArabic: 'مريد شاعر المكتبة',  titleEnglish: 'Devotee of the Library Poet' },
  'poet-market':   { titleArabic: 'مريد شاعر السوق',    titleEnglish: 'Devotee of the Market Poet' },
  'poet-desert':   { titleArabic: 'مريد شاعر الصحراء',  titleEnglish: 'Devotee of the Desert Poet' },
  'poet-ruins':    { titleArabic: 'مريد شاعر الأطلال',   titleEnglish: 'Devotee of the Ruins Poet' },
  'poet-caves':    { titleArabic: 'مريد شاعر الكهوف',   titleEnglish: 'Devotee of the Caves Poet' },
  'poet-coast':    { titleArabic: 'مريد شاعر الساحل',   titleEnglish: 'Devotee of the Coast Poet' },
  'poet-mountain': { titleArabic: 'مريد شاعر الجبل',    titleEnglish: 'Devotee of the Mountain Poet' },
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Get the tier name for a numeric friendship value.
 * Mirrors selectFriendshipTier from npcSlice.js.
 */
export function getFriendshipTier(value) {
  if (value >= 75) return 'close';
  if (value >= 50) return 'friendly';
  if (value >= 25) return 'cautious';
  return 'cold';
}

/**
 * Check if a friendship value change crossed a tier boundary.
 * @param {number} before — friendship value before the change
 * @param {number} after  — friendship value after the change
 * @returns {string|null}  — new tier name if boundary crossed (upward only), or null
 */
export function checkTierCrossing(before, after) {
  const tiersBefore = getFriendshipTier(before);
  const tiersAfter = getFriendshipTier(after);

  if (tiersBefore === tiersAfter) return null;

  // Only trigger on upward crossings
  const order = ['cold', 'cautious', 'friendly', 'close'];
  if (order.indexOf(tiersAfter) > order.indexOf(tiersBefore)) {
    return tiersAfter;
  }

  return null;
}

/**
 * Get the milestone reward for a given tier.
 * @param {string} tier — 'cautious' | 'friendly' | 'close'
 * @returns {object|null}
 */
export function getMilestoneReward(tier) {
  return RELATIONSHIP_MILESTONES[tier] || null;
}

/**
 * Get the friendship title for an NPC.
 * @param {string} npcId
 * @returns {{ titleArabic: string, titleEnglish: string }|null}
 */
export function getNpcTitle(npcId) {
  return NPC_FRIENDSHIP_TITLES[npcId] || null;
}

// ─────────────────────────────────────────────────────────────
// Tier display metadata (colors and labels)
// ─────────────────────────────────────────────────────────────

export const TIER_DISPLAY = Object.freeze({
  cold:     { color: '#666666', label: 'Cold',     labelArabic: 'بارد' },
  cautious: { color: '#D4A017', label: 'Cautious', labelArabic: 'حذر' },
  friendly: { color: '#2E8B57', label: 'Friendly', labelArabic: 'ودود' },
  close:    { color: '#FFD700', label: 'Close',    labelArabic: 'قريب' },
});
