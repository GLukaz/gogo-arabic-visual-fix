/**
 * Zone Registry — data-driven definitions for all 8 world zones.
 * Each zone provides: map builder, objects, NPCs, interactables, exits, and unlock rules.
 */

export const TILE = 64;
export const SAND = 0;
export const GRASS = 1;
export const WATER = 2;
export const ICE_GRASS = 3;
export const STONE = 4;
export const WOOD = 5;

// ============================================================
// ZONE 1: Oasis Village (40×30)
// ============================================================

function buildOasisMap() {
  const W = 40, H = 30;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = SAND;
      const cx = 20, cy = 14;
      const dx = (x - cx) / 4, dy = (y - cy) / 2.5;
      if (dx * dx + dy * dy < 1) tile = WATER;
      const gx = (x - cx) / 5.5, gy = (y - cy) / 3.5;
      if (gx * gx + gy * gy < 1 && tile !== WATER) tile = GRASS;
      if (x >= 7 && x <= 11 && y >= 4 && y <= 7) tile = GRASS;
      if (x >= 30 && x <= 34 && y >= 22 && y <= 25) tile = GRASS;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const oasis_village = {
  id: 'oasis_village',
  tilesetTheme: 'desert',
  name: 'Oasis Village',
  nameArabic: 'واحَة الحُروف',
  mapWidth: 40,
  mapHeight: 30,
  buildMap: buildOasisMap,
  spawnPoint: { x: 14, y: 20 },
  vocabCategories: ['greetings', 'trade'],
  gatheringSpots: true,

  objects: [
    { key: 'kenmi-desert-props-palm-tree-1', x: 15, y: 11, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 25, y: 10, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 18, y: 17, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 23, y: 18, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 16, y: 13, collide: true, collideW: 20, collideH: 16 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 24, y: 15, collide: true, collideW: 20, collideH: 16 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 5, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 35, y: 6, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 3, y: 22, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 37, y: 20, collide: true, collideW: 20, collideH: 16 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 12, y: 26, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 28, y: 4, collide: true, collideW: 30, collideH: 20 },
    // Houses — varied color variants (BLDG-01: 4 designs x 4 colors)
    { key: 'kenmi-desert-houses-desert-house-1.1', x: 8, y: 3, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 5, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 12, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 6, y: 3, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 11, y: 3, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-houses-desert-house-1.2', x: 10, y: 14, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-props-desert-rocks', x: 8, y: 16, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 13, y: 16, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-houses-desert-house-3.1', x: 32, y: 22, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-props-acacia-tree', x: 29, y: 24, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 35, y: 25, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-1', x: 20, y: 2, collide: true, collideW: 120, collideH: 40 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 17, y: 2, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 23, y: 2, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 2, y: 14, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 36, y: 15, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 15, y: 27, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 30, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 7, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 38, y: 27, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-houses-desert-house-4.2', x: 34, y: 10, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-houses-desert-house-2.3', x: 2, y: 3, collide: true, collideW: 180, collideH: 80 },
    // DECO-04: Golden pots near ruins gate entrance (landmark)
    { key: 'kenmi-desert-props-golden-pots', x: 21, y: 3, collide: false },
    { key: 'kenmi-desert-props-golden-pots', x: 19, y: 3, collide: false },
    // DECO-05: NPC-adjacent props
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 13, y: 19, collide: false },
    { key: 'kenmi-desert-props-sleeping-mat', x: 10, y: 7, collide: false },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 11, y: 19, collide: false },
    { key: 'kenmi-desert-props-sleeping-mat', x: 34, y: 26, collide: false },
    { key: 'kenmi-desert-props-desert-rugs', x: 17, y: 5, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 20, y: 5, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 23, y: 5, collide: true },
    { key: 'kenmi-desert-props-desert-bones', x: 11, y: 23, collide: true },
    { key: 'kenmi-desert-props-desert-bones', x: 21, y: 24, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 32, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 6, y: 14, collide: true },
    { key: 'kenmi-desert-props-golden-pots', x: 22, y: 7, collide: true },
    { key: 'kenmi-desert-props-golden-pots', x: 18, y: 7, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 21, y: 11, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 16, y: 15, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 24, y: 13, collide: true },
    { key: 'kenmi-desert-props-fallen-palm-leaves', x: 33, y: 2, collide: true },
    { key: 'kenmi-desert-props-fallen-palm-leaves', x: 11, y: 4, collide: true },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 19, y: 11, collide: true },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 20, y: 17, collide: true },
    { key: 'kenmi-desert-props-desert-fern', x: 14, y: 22, collide: true },
    { key: 'kenmi-desert-props-desert-fern-dead', x: 27, y: 7, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 28, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 18, y: 20, collide: true },
    { key: 'kenmi-desert-props-desert-ladder', x: 11, y: 15, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 14, y: 9, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 9, y: 7, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 33, y: 26, collide: true },

    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 17, y: 9, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 22, y: 9, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 13, y: 13, collide: true },
    { key: 'kenmi-desert-props-flies-anim', x: 21, y: 13, collide: true },
  
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor-animations-water-decor-animations-water-plants-lillypad-green-1-anim', x: 20, y: 15, collide: true }

  ],

  npcs: [
    { id: 'guide-amira', key: 'npc-guide-amira', name: 'Guide Amira', nameArabic: 'المُرشِدَة أَميرَة', x: 14, y: 18 },
    { id: 'scholar-yusuf', key: 'npc-scholar-yusuf', name: 'Scholar Yusuf', nameArabic: 'الشَّيْخ يوسُف', x: 9, y: 6 },
    { id: 'merchant-fatima', key: 'npc-merchant-fatima', name: 'Merchant Fatima', nameArabic: 'التّاجِرَة فاطِمَة', x: 12, y: 18 },
    { id: 'student-khalid', key: 'npc-student-khalid', name: 'Student Khalid', nameArabic: 'الطّالِب خالِد', x: 33, y: 25 },
  ],

  interactables: [
    { id: 'sign-oasis', type: 'sign', x: 19, y: 5, textArabic: 'واحَة الحُروف', textEnglish: 'Oasis of Letters' },
    { id: 'sign-market', type: 'sign', x: 9, y: 13, textArabic: 'السُّوق', textEnglish: 'The Market' },
    { id: 'sign-study', type: 'sign', x: 7, y: 4, textArabic: 'مَكْتَبَة الشَّيْخ', textEnglish: "Scholar's Library" },
    { id: 'bookshelf-scholar', type: 'bookshelf', x: 10, y: 4, category: 'greetings' },
    { id: 'bookshelf-student', type: 'bookshelf', x: 31, y: 23, category: 'phrases' },
    { id: 'chest-ruins', type: 'chest', x: 21, y: 3, minDirhams: 10, maxDirhams: 30 },
    { id: 'chest-hidden', type: 'chest', x: 2, y: 26, minDirhams: 15, maxDirhams: 50 },
    { id: 'door-scholar-house', type: 'door', x: 8, y: 5, interiorId: 'scholar_house_interior', locked: true, unlockFlag: 'met_scholar_yusuf', lockMessage: "Scholar Yusuf's private study. This door is locked.", labelArabic: '\u0628\u0627\u0628', labelEnglish: 'Door' },
    { id: 'door-merchant-house', type: 'door', x: 10, y: 16, interiorId: 'merchant_house_interior', locked: false, labelArabic: 'بَيْت فاطِمَة', labelEnglish: "Fatima's House" },
    { id: 'door-oasis-guild', type: 'door', x: 34, y: 24, interiorId: 'oasis_guild_interior', locked: false, labelArabic: 'نادي المُغامِرين', labelEnglish: "Adventurer's Guild" },
    // --- Phase 23: Interactive Objects ---
    { id: 'fountain-oasis-1', type: 'fountain', x: 20, y: 9, labelArabic: 'نافورة', labelEnglish: 'Fountain', descriptionEnglish: 'A welcome fountain at the heart of the oasis. Its waters have refreshed travellers for centuries.', descriptionArabic: 'نافورة ترحيب في قلب الواحة.', culturalNote: 'Fountains in Arabian villages symbolise hospitality and the life-giving nature of water in the desert.', vocabWordId: 'ahlan', vocabCategory: 'greetings', repeatable: true },
    { id: 'lantern-oasis-1', type: 'lantern', x: 6, y: 10, labelArabic: 'فانوس', labelEnglish: 'Lantern', descriptionEnglish: 'A brass lantern hanging from a palm, casting warm light across the village path.', culturalNote: 'Fanous lanterns are lit during Ramadan across the Arab world, symbolising guidance.', vocabWordId: 'marhaba', vocabCategory: 'greetings', repeatable: true },
    { id: 'lantern-oasis-2', type: 'lantern', x: 34, y: 13, labelArabic: 'فانوس', labelEnglish: 'Lantern', descriptionEnglish: 'An ornate village lantern illuminating the road to the large house.', vocabWordId: 'salaam', vocabCategory: 'greetings', repeatable: true },
    { id: 'statue-oasis-1', type: 'statue', x: 22, y: 5, labelArabic: 'تمثال', labelEnglish: 'Statue', descriptionEnglish: 'A weathered stone statue near the ancient ruins, depicting a scribe holding a scroll.', culturalNote: 'Scribes preserved knowledge across the medieval Islamic world through meticulous calligraphy.', vocabWordId: 'ustadh', vocabCategory: 'greetings', repeatable: true },
    { id: 'stall-oasis-1', type: 'stall', x: 11, y: 12, labelArabic: 'دكان', labelEnglish: 'Market Stall', descriptionEnglish: 'A small trading stall displaying dried fruits and simple goods.', descriptionArabic: 'دكان صغير يعرض الفواكه المجففة.', vocabWordId: 'shop_w28', vocabCategory: 'trade', repeatable: true },
    { id: 'barrel-oasis-1', type: 'barrel', x: 14, y: 15, labelArabic: 'برميل', labelEnglish: 'Barrel', descriptionEnglish: 'A wooden barrel filled with fresh oasis water for travellers.', vocabWordId: 'sadeeq', vocabCategory: 'greetings', loot: { type: 'dirhams', min: 3, max: 8 }, repeatable: false, stateChange: 'inspected' },
    { id: 'pot-oasis-1', type: 'pot', x: 31, y: 25, labelArabic: 'قِدر', labelEnglish: 'Pot', descriptionEnglish: 'A clay cooking pot simmering with lentil stew. The smell is inviting.', culturalNote: 'Lentil stew (shorbat adas) is a staple across the Arab world, often served to welcome guests.', vocabWordId: 'price_w29', vocabCategory: 'trade', repeatable: true },
    { id: 'crate-oasis-1', type: 'crate', x: 37, y: 22, labelArabic: 'صندوق', labelEnglish: 'Crate', descriptionEnglish: 'A wooden crate packed with traded goods from the marketplace.', vocabWordId: 'tayyib', vocabCategory: 'greetings', loot: { type: 'dirhams', min: 5, max: 12 }, repeatable: false, stateChange: 'inspected' },
    { id: 'painting-oasis-1', type: 'painting', x: 4, y: 6, labelArabic: 'لوحة', labelEnglish: 'Painting', descriptionEnglish: 'A faded mural on the house wall showing the oasis surrounded by palm trees.', vocabWordId: 'kayf_halak', vocabCategory: 'greetings', repeatable: true },
    { id: 'barrel-oasis-2', type: 'barrel', x: 26, y: 12, labelArabic: 'برميل', labelEnglish: 'Barrel', descriptionEnglish: 'A sealed barrel of dates stored near the oasis for trade.', vocabWordId: 'money_w30', vocabCategory: 'trade', repeatable: true },
    { id: 'lantern-oasis-3', type: 'lantern', x: 16, y: 24, labelArabic: 'فانوس', labelEnglish: 'Lantern', descriptionEnglish: 'A ground lantern marking the southern village path.', vocabWordId: 'sabah_al_khayr', vocabCategory: 'greetings', repeatable: true },
    { id: 'pot-oasis-2', type: 'pot', x: 9, y: 9, labelArabic: 'قِدر', labelEnglish: 'Pot', descriptionEnglish: 'A decorative clay pot filled with aromatic herbs.', vocabWordId: 'masaa_al_khayr', vocabCategory: 'greetings', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-oasis-1',
      type: 'inscription',
      x: 2, y: 27,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ك-ت-ب',
      rootFamilyEnglish: 'writing',
      rootWords: ['write_1', 'read_1', 'learn_1', 'know_1'],
      descriptionEnglish: 'An ancient stone inscription carved with the root of writing — ك-ت-ب — the root that gave Arabic its words for pen, book, and scribe.',
      descriptionArabic: 'نَقشٌ حَجَري قَديم مَنقوشٌ بِجَذرِ الكِتابَة — ك-ت-ب.',
      culturalNote: 'The root ك-ت-ب produced over 30 Arabic words. Medieval Islamic scribes (kuttaab) copied texts that preserved Greek, Persian, and Indian knowledge for the world.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-oasis-2',
      type: 'inscription',
      x: 28, y: 15,
      labelArabic: 'نَقش',
      labelEnglish: 'Stone Inscription',
      rootFamily: 'س-ل-م',
      rootFamilyEnglish: 'peace/submission',
      rootWords: ['greetings_001', 'salaam_1', 'knowledge_1', 'journey_1'],
      descriptionEnglish: 'A weathered stone inscription near the village well, bearing the root of peace — س-ل-م.',
      descriptionArabic: 'نَقشٌ حَجَريٌّ قُربَ بِئرِ القَريَة، يَحمِلُ جَذرَ السَّلام — س-ل-م.',
      culturalNote: 'The root س-ل-م gave Arabic its words for peace (سلام), Islam (إسلام), and safety (سلامة). The greeting "as-salamu alaykum" is one of the most universal Arabic phrases worldwide.',
      repeatable: false,
      stateChange: 'discovered',
      useInk: true,
      inkFile: 'inscription-oasis',
    },
    {
      id: 'inscription-oasis-3',
      type: 'inscription',
      x: 36, y: 5,
      labelArabic: 'نَقش',
      labelEnglish: 'Market Inscription',
      rootFamily: 'أ-م-ن',
      rootFamilyEnglish: 'trust/safety',
      rootWords: ['ahlan_1', 'market_w31', 'trade_1', 'truth_1'],
      descriptionEnglish: 'A carved inscription near the merchant quarter with a trade greeting and blessing.',
      descriptionArabic: 'نَقشٌ مَنحوتٌ قُربَ الحَيِّ التِّجاري فيهِ تَحيَّةُ التِّجارَة.',
      culturalNote: 'The root أ-م-ن gave Arabic أمين (trustworthy), أمانة (trust), إيمان (faith), and آمن (safe). Ethical trade was central to early Islamic civilisation.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'oasis-to-library',
      edge: 'north',
      tileRange: [17, 23],
      targetZone: 'ancient_library',
      targetEntry: 'from_oasis',
      label: 'Ancient Library',
      labelArabic: 'المَكتَبَة القَديمَة',
    },
  ],

  unlock: null, // Starting zone — always unlocked

  entries: {
    from_library: { x: 20, y: 3 },
  },

  defaultWeather: 'clear',
  battleBackground: 'bg-oasis',

  // Step triggers — invisible floor zones that fire actionSets when the player walks over them.
  // Missing = no triggers for this zone (backward compatible).
  stepTriggers: [
    {
      id: 'oasis-welcome',
      x: 14, y: 19,        // tile coords just north of spawn (spawnPoint is 14,20)
      width: 2, height: 1, // 2-tile wide, 1-tile tall
      oneShot: true,        // fires once per session (tracked via in-memory set)
      flagOnFire: 'trigger_oasis_welcome', // flag set when this fires
      actionSets: [
        {
          requirements: [{ type: 'flag', flagId: 'trigger_oasis_welcome', value: false }],
          actions: [
            { type: 'speech', npcId: 'narrator', dialogueKey: 'welcome-to-oasis' },
            { type: 'setFlag', flagId: 'trigger_oasis_welcome', value: true },
          ],
        },
      ],
    },
    {
      id: 'marketplace-hint',
      x: 13, y: 8,         // tile coords near the market sign / stall area
      width: 3, height: 1, // 3-tile wide, 1-tile tall
      oneShot: false,
      cooldown: 30000,      // 30 seconds between fires
      actionSets: [
        {
          requirements: [],
          actions: [
            { type: 'playSound', soundId: 'marketplace-chatter' },
          ],
        },
      ],
    },
    {
      id: 'ruins-echo',
      x: 20, y: 3,         // tile coords at the ruin-gate / ancient ruins entrance
      width: 2, height: 1,
      oneShot: true,
      flagOnFire: 'trigger_ruins_echo',
      actionSets: [
        {
          requirements: [{ type: 'flag', flagId: 'trigger_ruins_echo', value: false }],
          actions: [
            { type: 'speech', npcId: 'narrator', dialogueKey: 'ruins-whisper' },
            { type: 'setFlag', flagId: 'trigger_ruins_echo', value: true },
          ],
        },
      ],
    },
  ],

  subAreas: [
    { id: 'market-square', name: 'Market Square', nameArabic: 'ساحة السوق', x: 12, y: 6, width: 6, height: 4 },
    { id: 'oasis-shore', name: 'Oasis Shore', nameArabic: 'شاطئ الواحة', x: 18, y: 12, width: 5, height: 4 },
    { id: 'residential', name: 'Residential Quarter', nameArabic: 'الحي السكني', x: 6, y: 18, width: 8, height: 6 },
    { id: 'ruins', name: 'Ancient Ruins', nameArabic: 'الأطلال القديمة', x: 18, y: 2, width: 6, height: 5 },
  ],
};

// ============================================================
// ZONE 2: Ancient Library (35×30)
// ============================================================

function buildLibraryMap() {
  const W = 35, H = 30;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = SAND;
      // Stone courtyard (grass tiles) in center
      if (x >= 10 && x <= 24 && y >= 8 && y <= 22) tile = GRASS;
      // Inner reading garden
      if (x >= 14 && x <= 20 && y >= 12 && y <= 18) tile = GRASS;
      // Small reflecting pool
      if (x >= 16 && x <= 18 && y >= 14 && y <= 16) tile = WATER;
      // Garden path entrance from south
      if (x >= 16 && x <= 18 && y >= 22 && y <= 29) tile = GRASS;
      // Garden path to north
      if (x >= 16 && x <= 18 && y >= 0 && y <= 8) tile = GRASS;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const ancient_library = {
  id: 'ancient_library',
  tilesetTheme: 'desert',
  name: 'Ancient Library',
  nameArabic: 'المَكتَبَة القَديمَة',
  mapWidth: 35,
  mapHeight: 30,
  buildMap: buildLibraryMap,
  spawnPoint: { x: 17, y: 27 },
  vocabCategories: ['numbers', 'colors', 'phrases'],
  gatheringSpots: true,

  objects: [
    // Library building structures — temple structures (BLDG-02)
    { key: 'kenmi-desert-temple-desert-temple', x: 14, y: 5, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-temple-desert-temple', x: 20, y: 5, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-houses-desert-house-1.4', x: 8, y: 10, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-houses-desert-house-2.4', x: 26, y: 10, collide: true, collideW: 180, collideH: 80 },
    // Obelisk pillars lining courtyard
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 10, y: 8, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 10, y: 14, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 10, y: 20, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 24, y: 8, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 24, y: 14, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 24, y: 20, collide: true, collideW: 20, collideH: 20 },
    // Broken obelisks for ruins atmosphere
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 6, y: 4, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 28, y: 4, collide: true, collideW: 20, collideH: 20 },
    // Trees around library
    { key: 'kenmi-desert-props-acacia-tree', x: 4, y: 15, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 30, y: 15, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 12, y: 24, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 22, y: 24, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 3, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 31, y: 8, collide: true, collideW: 30, collideH: 20 },
    // Rocks
    { key: 'kenmi-desert-props-desert-rocks', x: 2, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 32, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 5, y: 27, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 29, y: 27, collide: true, collideW: 30, collideH: 20 },
    // Gate entrance
    { key: 'kenmi-desert-temple-desert-obelisk-1', x: 17, y: 22, collide: true, collideW: 120, collideH: 40 },
    // DECO-04: Obelisks flanking the library gate + golden pot in reading garden
    { key: 'kenmi-desert-temple-desert-obelisk-2', x: 12, y: 22, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-2', x: 22, y: 22, collide: true, collideW: 20, collideH: 20 },
    // DECO-05: NPC-adjacent props
    { key: 'kenmi-desert-props-sleeping-mat', x: 18, y: 12, collide: false },
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 11, y: 17, collide: false },
    { key: 'kenmi-desert-props-desert-fern', x: 10, y: 26, collide: true },
    { key: 'kenmi-desert-props-desert-fern', x: 31, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-fern', x: 31, y: 20, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 24, y: 25, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 27, y: 18, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 26, y: 15, collide: true },
    { key: 'kenmi-desert-props-desert-ladder', x: 9, y: 11, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 11, y: 9, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 5, y: 9, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 6, y: 11, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 28, y: 11, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 27, y: 13, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 17, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 20, y: 17, collide: true },
    { key: 'kenmi-desert-props-fire-pit', x: 13, y: 7, collide: true },
    { key: 'kenmi-desert-props-fire-pit', x: 15, y: 7, collide: true },
    { key: 'kenmi-desert-props-fire-pit', x: 19, y: 7, collide: true },
    { key: 'kenmi-desert-props-fire-pit', x: 21, y: 7, collide: true },
    { key: 'kenmi-desert-props-fire-pit', x: 15, y: 7, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 9, y: 5, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 26, y: 2, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 8, y: 2, collide: true },
  
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 8, y: 21, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 6, y: 14, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 7, y: 17, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 13, y: 26, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 20, y: 27, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 14, y: 28, collide: true },
    { key: 'kenmi-military-campfire-pot-anim', x: 13, y: 15, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 5, y: 23, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 4, y: 25, collide: true },
    { key: 'kenmi-desert-props-cactus', x: 4, y: 21, collide: true },
  
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor-animations-water-decor-animations-water-plants-lillypad-green-2-anim', x: 17, y: 15, collide: true }

  ],

  npcs: [
    { id: 'librarian-ibrahim', key: 'npc-librarian-ibrahim', name: 'Librarian Ibrahim', nameArabic: 'أَمين المَكتَبَة إبراهيم', x: 17, y: 11 },
    { id: 'scribe-amina', key: 'npc-scribe-amina', name: 'Scribe Amina', nameArabic: 'الكاتِبَة أَمينَة', x: 12, y: 16 },
  ],

  interactables: [
    { id: 'sign-library-gate', type: 'sign', x: 17, y: 23, textArabic: 'المَكتَبَة القَديمَة', textEnglish: 'The Ancient Library' },
    { id: 'sign-reading-room', type: 'sign', x: 14, y: 11, textArabic: 'غُرفَة القِراءَة', textEnglish: 'Reading Room' },
    { id: 'bookshelf-numbers', type: 'bookshelf', x: 11, y: 11, category: 'numbers' },
    { id: 'bookshelf-colors', type: 'bookshelf', x: 23, y: 11, category: 'colors' },
    { id: 'bookshelf-phrases', type: 'bookshelf', x: 17, y: 8, category: 'phrases' },
    { id: 'chest-library', type: 'chest', x: 7, y: 6, minDirhams: 20, maxDirhams: 60 },
    { id: 'chest-library-hidden', type: 'chest', x: 30, y: 25, minDirhams: 25, maxDirhams: 70 },
    { id: 'door-archive', type: 'door', x: 20, y: 8, interiorId: 'library_archive_interior', locked: true, unlockFlag: 'library_access_granted', lockMessage: 'The ancient archives are sealed.', labelArabic: '\u0628\u0627\u0628', labelEnglish: 'Door' },
    { id: 'door-library-study', type: 'door', x: 8, y: 12, interiorId: 'library_study_interior', locked: false, labelArabic: 'غُرفَة الدِّراسَة', labelEnglish: 'Study Room' },
    // --- Phase 23: Interactive Objects ---
    { id: 'fountain-library-1', type: 'fountain', x: 17, y: 13, labelArabic: 'نافورة', labelEnglish: 'Reflecting Pool Fountain', descriptionEnglish: 'A serene fountain feeding the reflecting pool. Scholars meditate by its gentle sound.', descriptionArabic: 'نافورة هادئة تغذي البركة.', culturalNote: 'Reflecting pools in Islamic architecture symbolise paradise and contemplation.', vocabWordId: 'how_are_you_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'statue-library-1', type: 'statue', x: 15, y: 15, labelArabic: 'تمثال', labelEnglish: 'Statue of Knowledge', descriptionEnglish: 'A stone statue of a seated scholar with an open book, representing the pursuit of knowledge.', culturalNote: 'The Arabic word for knowledge (ilm) appears over 750 times in the Quran.', vocabWordId: 'num_7', vocabCategory: 'numbers', repeatable: true },
    { id: 'statue-library-2', type: 'statue', x: 19, y: 15, labelArabic: 'تمثال', labelEnglish: 'Statue of the Astronomer', descriptionEnglish: 'A marble figure gazing at the sky, holding an astrolabe.', culturalNote: 'Arab astronomers invented the astrolabe and named many stars still known today.', vocabWordId: 'num_10', vocabCategory: 'numbers', repeatable: true },
    { id: 'painting-library-1', type: 'painting', x: 12, y: 9, labelArabic: 'لوحة', labelEnglish: 'Ancient Painting', descriptionEnglish: 'A richly detailed painting depicting the founding of the great library.', vocabWordId: 'color_blue', vocabCategory: 'colors', repeatable: true },
    { id: 'painting-library-2', type: 'painting', x: 22, y: 9, labelArabic: 'لوحة', labelEnglish: 'Calligraphy Painting', descriptionEnglish: 'An ornate calligraphy panel with verses about seeking knowledge.', culturalNote: 'Arabic calligraphy is considered one of the highest art forms in Islamic culture.', vocabWordId: 'please_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'lantern-library-1', type: 'lantern', x: 11, y: 17, labelArabic: 'فانوس', labelEnglish: 'Scholar Lantern', descriptionEnglish: 'A tall brass lantern illuminating the courtyard. Its flame never seems to wane.', vocabWordId: 'num_3', vocabCategory: 'numbers', repeatable: true },
    { id: 'lantern-library-2', type: 'lantern', x: 23, y: 17, labelArabic: 'فانوس', labelEnglish: 'Scholar Lantern', descriptionEnglish: 'A matching brass lantern on the east side of the courtyard.', vocabWordId: 'num_5', vocabCategory: 'numbers', repeatable: true },
    { id: 'lantern-library-3', type: 'lantern', x: 17, y: 26, labelArabic: 'فانوس', labelEnglish: 'Garden Path Lantern', descriptionEnglish: 'A small lantern lighting the garden path to the library gate.', vocabWordId: 'color_green', vocabCategory: 'colors', repeatable: true },
    { id: 'crate-library-1', type: 'crate', x: 9, y: 10, labelArabic: 'صندوق', labelEnglish: 'Manuscript Crate', descriptionEnglish: 'A sealed crate of ancient manuscripts awaiting cataloguing.', vocabWordId: 'color_gold', vocabCategory: 'colors', loot: { type: 'dirhams', min: 8, max: 20 }, repeatable: false, stateChange: 'inspected' },
    { id: 'barrel-library-1', type: 'barrel', x: 25, y: 10, labelArabic: 'برميل', labelEnglish: 'Ink Barrel', descriptionEnglish: 'A barrel of fine ink used by scribes for copying manuscripts.', culturalNote: 'Medieval Arab scribes used ink made from soot, gum arabic, and water.', vocabWordId: 'color_black', vocabCategory: 'colors', repeatable: true },
    { id: 'pot-library-1', type: 'pot', x: 14, y: 19, labelArabic: 'قِدر', labelEnglish: 'Incense Pot', descriptionEnglish: 'A clay pot burning frankincense, filling the courtyard with a sacred aroma.', culturalNote: 'Frankincense from the Arabian Peninsula has been traded for over 5000 years.', vocabWordId: 'i_am_fine_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'pot-library-2', type: 'pot', x: 20, y: 19, labelArabic: 'قِدر', labelEnglish: 'Herbal Pot', descriptionEnglish: 'A pot of dried herbs used by scholars to stay alert during long study sessions.', vocabWordId: 'num_1', vocabCategory: 'numbers', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-library-1',
      type: 'inscription',
      x: 33, y: 2,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ع-ل-م',
      rootFamilyEnglish: 'knowledge',
      rootWords: ['learn_1', 'know_1', 'understand_1', 'write_1'],
      descriptionEnglish: 'A carved inscription near the library ruins bearing the root of knowledge — ع-ل-م — from which the Arabic words for scholar, science, and flag all derive.',
      descriptionArabic: 'نَقشٌ مَنحوتٌ بِجَذرِ العِلم — ع-ل-م — جَذرُ كُلِّ مَعرِفَة.',
      culturalNote: 'The root ع-ل-م gave Arabic its words for world (عالَم), flag (عَلَم), and scholar (عالِم). The House of Wisdom (Bayt al-Hikma) in Baghdad was the greatest library of the medieval world.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-library-2',
      type: 'inscription',
      x: 5, y: 14,
      labelArabic: 'نَقش',
      labelEnglish: 'Reading Inscription',
      rootFamily: 'ق-ر-أ',
      rootFamilyEnglish: 'reading',
      rootWords: ['read_1', 'know_1', 'learn_1', 'understand_1'],
      descriptionEnglish: 'A pillar inscription in the library courtyard, bearing the root of reading — ق-ر-أ — the first divine command.',
      descriptionArabic: 'نَقشٌ على عَمودٍ في ساحَةِ المَكتَبَة، يَحمِلُ جَذرَ القِراءَة — ق-ر-أ.',
      culturalNote: 'The root ق-ر-أ gave Arabic قَرَأ (to read), قُرآن (Quran — the recitation), and قارئ (reader). The first word revealed in the Quran was "iqra" — Read!',
      repeatable: false,
      stateChange: 'discovered',
      useInk: true,
      inkFile: 'inscription-library',
    },
    {
      id: 'inscription-library-3',
      type: 'inscription',
      x: 2, y: 5,
      labelArabic: 'نَقش',
      labelEnglish: 'Scholar Proverb',
      rootFamily: 'طَ-ل-ب',
      rootFamilyEnglish: 'seeking/requesting',
      rootWords: ['learn_1', 'journey_1', 'find_1', 'happiness_1'],
      descriptionEnglish: 'A carved proverb on the library entrance arch, urging the seeker of knowledge to travel far.',
      descriptionArabic: 'حِكمَةٌ مَنقوشَةٌ على قَوسِ المَكتَبَة، تَحُثُّ طالِبَ العِلمِ على السَّفَر.',
      culturalNote: 'The root طَ-ل-ب gave Arabic طالِب (student — "one who seeks"), مَطلوب (required), and طَلَب (to request). Seeking knowledge is a religious duty in Islam.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'library-to-oasis',
      edge: 'south',
      tileRange: [15, 19],
      targetZone: 'oasis_village',
      targetEntry: 'from_library',
      label: 'Oasis Village',
      labelArabic: 'واحَة الحُروف',
    },
    {
      id: 'library-to-marketplace',
      edge: 'east',
      tileRange: [12, 18],
      targetZone: 'desert_marketplace',
      targetEntry: 'from_library',
      label: 'Desert Marketplace',
      labelArabic: 'سوق الصَّحراء',
    },
  ],

  unlock: { quest: 'words_of_oasis' },

  defaultWeather: 'mist',
  battleBackground: 'bg-library',

  entries: {
    from_oasis: { x: 17, y: 27 },
    from_marketplace: { x: 33, y: 15 },
  },
};

// ============================================================
// ZONE 3: Desert Marketplace (45×35)
// ============================================================

function buildMarketplaceMap() {
  const W = 45, H = 35;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = SAND;
      // Main market road running east-west
      if (y >= 15 && y <= 19 && x >= 5 && x <= 39) tile = GRASS;
      // North-south cross street
      if (x >= 20 && x <= 24 && y >= 5 && y <= 29) tile = GRASS;
      // Market square at intersection
      if (x >= 18 && x <= 26 && y >= 13 && y <= 21) tile = GRASS;
      // Small fountain in center
      if (x >= 21 && x <= 23 && y >= 16 && y <= 18) tile = WATER;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const desert_marketplace = {
  id: 'desert_marketplace',
  tilesetTheme: 'desert',
  name: 'Desert Marketplace',
  nameArabic: 'سوق الصَّحراء',
  mapWidth: 45,
  mapHeight: 35,
  buildMap: buildMarketplaceMap,
  spawnPoint: { x: 5, y: 17 },
  vocabCategories: ['trade', 'food', 'numbers'],
  gatheringSpots: true,

  objects: [
    // Market stalls — pergolas (BLDG-03)
    { key: 'kenmi-desert-houses-pergola', x: 10, y: 12, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-houses-pergola', x: 10, y: 22, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-houses-pergola', x: 30, y: 12, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-houses-pergola', x: 30, y: 22, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-desert-houses-desert-house-3.3', x: 22, y: 4, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-houses-desert-house-4.4', x: 22, y: 28, collide: true, collideW: 240, collideH: 100 },
    // Palms lining the road
    { key: 'kenmi-desert-props-palm-tree-1', x: 7, y: 14, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 7, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 37, y: 14, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 37, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 15, y: 9, collide: true, collideW: 20, collideH: 16 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 29, y: 9, collide: true, collideW: 20, collideH: 16 },
    // Gate at market entrance
    { key: 'kenmi-desert-temple-desert-obelisk-1', x: 22, y: 2, collide: true, collideW: 120, collideH: 40 },
    // Rocks along edges
    { key: 'kenmi-desert-props-desert-rocks', x: 3, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 41, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 3, y: 28, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 41, y: 28, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 15, y: 31, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 35, y: 31, collide: true, collideW: 30, collideH: 20 },
    // Scattered palms
    { key: 'kenmi-desert-props-palm-tree-1', x: 40, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 4, y: 5, collide: true, collideW: 30, collideH: 20 },
    // Fence walls along market road
    { key: 'kenmi-desert-props-desert-fencewall', x: 8, y: 15, collide: true, collideW: 40, collideH: 10 },
    { key: 'kenmi-desert-props-desert-fencewall', x: 14, y: 15, collide: true, collideW: 40, collideH: 10 },
    { key: 'kenmi-desert-props-desert-fencewall', x: 28, y: 15, collide: true, collideW: 40, collideH: 10 },
    { key: 'kenmi-desert-props-desert-fencewall', x: 34, y: 15, collide: true, collideW: 40, collideH: 10 },
    // DECO-04: Golden pot at market fountain / small obelisk at market entrance
    { key: 'kenmi-desert-temple-desert-obelisk-small-2', x: 20, y: 2, collide: true, collideW: 20, collideH: 20 },
    // DECO-05: NPC-adjacent props (Layla 15,17; Hassan 29,17; Guard Hamza 22,8)
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 14, y: 18, collide: false },
    { key: 'kenmi-desert-props-desert-rugs', x: 29, y: 18, collide: false },
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 23, y: 9, collide: false },
 
    { key: 'kenmi-desert-props-desert-grass-props', x: 20, y: 31, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 17, y: 29, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 26, y: 29, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 23, y: 30, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 26, y: 28, collide: true },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 18, y: 28, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 22, y: 32, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 15, y: 22, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 16, y: 4, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 29, y: 5, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 27, y: 3, collide: true },
    { key: 'kenmi-desert-props-desert-rugs', x: 30, y: 2, collide: true },
    { key: 'kenmi-desert-props-fallen-palm-leaves-dead', x: 42, y: 11, collide: true },
    { key: 'kenmi-desert-props-golden-pots', x: 21, y: 6, collide: true },
    { key: 'kenmi-desert-props-sleeping-mat', x: 30, y: 4, collide: true },
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 32, y: 4, collide: true },  

  
    { key: 'kenmi-desert-props-desert-bones', x: 37, y: 30, collide: true },
    { key: 'kenmi-desert-props-desert-bones', x: 40, y: 30, collide: true },
    { key: 'kenmi-desert-props-desert-bones', x: 39, y: 24, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 38, y: 6, collide: true },
    { key: 'kenmi-desert-props-desert-fern-dead', x: 43, y: 17, collide: true },
    { key: 'kenmi-desert-props-desert-fern-dead', x: 39, y: 33, collide: true },
    { key: 'kenmi-desert-props-desert-fern-dead', x: 32, y: 28, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 33, y: 7, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 26, y: 8, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 34, y: 13, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 42, y: 16, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 42, y: 19, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 43, y: 21, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 33, y: 21, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 28, y: 23, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 28, y: 27, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 17, y: 25, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 13, y: 26, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 9, y: 24, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 14, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 17, y: 10, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 12, y: 7, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 13, y: 10, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 9, y: 4, collide: true },
    { key: 'kenmi-desert-props-flies-anim', x: 22, y: 16, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 19, y: 18, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 23, y: 15, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 21, y: 20, collide: true },
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 13, y: 22, collide: true },
    { key: 'kenmi-military-campfire-pot-anim', x: 25, y: 17, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 26, y: 23, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 9, y: 28, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 11, y: 24, collide: true },
  
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor-animations-water-decor-animations-water-plants-lillypad-purple-2-anim', x: 22, y: 17, collide: true },


  ],

  npcs: [
    { id: 'spice-seller-layla', key: 'npc-spice-seller-layla', name: 'Spice Seller Layla', nameArabic: 'بائِعَة التَّوابِل لَيلى', x: 15, y: 17 },
    { id: 'trader-hassan', key: 'npc-trader-hassan', name: 'Trader Hassan', nameArabic: 'التّاجِر حَسَّان', x: 29, y: 17 },
    { id: 'guard-hamza', key: 'npc-guard-hamza', name: 'Guard Hamza', nameArabic: 'الحارِس حَمزَة', x: 22, y: 8 },
  ],

  interactables: [
    { id: 'sign-market-main', type: 'sign', x: 22, y: 3, textArabic: 'سوق الصَّحراء', textEnglish: 'Desert Marketplace' },
    { id: 'sign-spice-stall', type: 'sign', x: 12, y: 17, textArabic: 'التَّوابِل', textEnglish: 'Spices' },
    { id: 'sign-trade-stall', type: 'sign', x: 32, y: 17, textArabic: 'البَضائِع', textEnglish: 'Goods' },
    { id: 'bookshelf-market-food', type: 'bookshelf', x: 11, y: 13, category: 'food' },
    { id: 'bookshelf-market-trade', type: 'bookshelf', x: 31, y: 13, category: 'trade' },
    { id: 'bookshelf-market-numbers', type: 'bookshelf', x: 22, y: 6, category: 'numbers' },
    { id: 'chest-market-hidden', type: 'chest', x: 40, y: 3, minDirhams: 25, maxDirhams: 80 },
    { id: 'chest-market-corner', type: 'chest', x: 3, y: 32, minDirhams: 20, maxDirhams: 65 },
    { id: 'door-warehouse', type: 'door', x: 35, y: 12, interiorId: 'market_warehouse_interior', locked: true, unlockFlag: 'warehouse_key_obtained', lockMessage: "The merchant's warehouse is locked.", labelArabic: '\u0628\u0627\u0628', labelEnglish: 'Door' },
    { id: 'door-spice-shop', type: 'door', x: 10, y: 14, interiorId: 'spice_shop_interior', locked: false, labelArabic: 'دُكّان البُهارات', labelEnglish: 'Spice Shop' },
    { id: 'door-textile-shop', type: 'door', x: 30, y: 14, interiorId: 'textile_shop_interior', locked: false, labelArabic: 'دُكّان الأَقمِشَة', labelEnglish: 'Textile Shop' },
    // --- Phase 23: Interactive Objects ---
    { id: 'fountain-market-1', type: 'fountain', x: 22, y: 14, labelArabic: 'نافورة', labelEnglish: 'Market Fountain', descriptionEnglish: 'The central market fountain where merchants gather to trade news and haggle prices.', descriptionArabic: 'نافورة السوق المركزية حيث يجتمع التجار.', culturalNote: 'Souks (markets) have been the heart of Arab commerce and social life for millennia.', vocabWordId: 'market_w31', vocabCategory: 'trade', repeatable: true },
    { id: 'stall-market-1', type: 'stall', x: 18, y: 16, labelArabic: 'دكان', labelEnglish: 'Fruit Stall', descriptionEnglish: 'A bustling stall overflowing with dates, figs, and pomegranates.', culturalNote: 'Dates are mentioned over 20 times in the Quran and are a symbol of generosity.', vocabWordId: 'fruit_1', vocabCategory: 'food', repeatable: true },
    { id: 'stall-market-2', type: 'stall', x: 26, y: 16, labelArabic: 'دكان', labelEnglish: 'Jewellery Stall', descriptionEnglish: 'A glittering display of silver rings, amber necklaces, and turquoise bracelets.', vocabWordId: 'gold_w32', vocabCategory: 'trade', repeatable: true },
    { id: 'stall-market-3', type: 'stall', x: 18, y: 20, labelArabic: 'دكان', labelEnglish: 'Pottery Stall', descriptionEnglish: 'Hand-painted ceramic bowls and plates stacked in colourful towers.', culturalNote: 'Arab pottery traditions date back thousands of years, with distinctive geometric patterns.', vocabWordId: 'num_4', vocabCategory: 'numbers', repeatable: true },
    { id: 'stall-market-4', type: 'stall', x: 26, y: 20, labelArabic: 'دكان', labelEnglish: 'Cloth Stall', descriptionEnglish: 'Bolts of silk and cotton in every colour, imported from distant lands.', vocabWordId: 'sell_w33', vocabCategory: 'trade', repeatable: true },
    { id: 'barrel-market-1', type: 'barrel', x: 13, y: 15, labelArabic: 'برميل', labelEnglish: 'Spice Barrel', descriptionEnglish: 'A barrel brimming with saffron, the most expensive spice in the world.', culturalNote: 'Arab traders controlled the global spice trade for centuries along the Silk Road.', vocabWordId: 'salt_1', vocabCategory: 'food', loot: { type: 'dirhams', min: 5, max: 15 }, repeatable: false, stateChange: 'inspected' },
    { id: 'barrel-market-2', type: 'barrel', x: 33, y: 15, labelArabic: 'برميل', labelEnglish: 'Oil Barrel', descriptionEnglish: 'A heavy barrel of olive oil destined for the coastal port.', vocabWordId: 'oil_1', vocabCategory: 'food', repeatable: true },
    { id: 'barrel-market-3', type: 'barrel', x: 20, y: 10, labelArabic: 'برميل', labelEnglish: 'Grain Barrel', descriptionEnglish: 'Barley and wheat stored for the market bakers.', vocabWordId: 'bread_1', vocabCategory: 'food', repeatable: true },
    { id: 'pot-market-1', type: 'pot', x: 9, y: 18, labelArabic: 'قِدر', labelEnglish: 'Spice Pot', descriptionEnglish: 'A clay pot of ground cumin releasing a warm, earthy fragrance.', vocabWordId: 'pepper_1', vocabCategory: 'food', repeatable: true },
    { id: 'pot-market-2', type: 'pot', x: 35, y: 18, labelArabic: 'قِدر', labelEnglish: 'Dye Pot', descriptionEnglish: 'A pot of indigo dye used to colour the textiles sold next door.', vocabWordId: 'buy_w34', vocabCategory: 'trade', repeatable: true },
    { id: 'crate-market-1', type: 'crate', x: 38, y: 11, labelArabic: 'صندوق', labelEnglish: 'Trade Crate', descriptionEnglish: 'A sealed shipping crate stamped with marks from the coastal port.', vocabWordId: 'merchant_w35', vocabCategory: 'trade', loot: { type: 'dirhams', min: 10, max: 25 }, repeatable: false, stateChange: 'inspected' },
    { id: 'crate-market-2', type: 'crate', x: 6, y: 23, labelArabic: 'صندوق', labelEnglish: 'Storage Crate', descriptionEnglish: 'A wooden crate filled with dried herbs and medicinal roots.', vocabWordId: 'honey_1', vocabCategory: 'food', repeatable: true },
    { id: 'lantern-market-1', type: 'lantern', x: 20, y: 15, labelArabic: 'فانوس', labelEnglish: 'Market Lantern', descriptionEnglish: 'A tall iron lantern marking the crossroads of the main market streets.', vocabWordId: 'num_2', vocabCategory: 'numbers', repeatable: true },
    { id: 'lantern-market-2', type: 'lantern', x: 24, y: 19, labelArabic: 'فانوس', labelEnglish: 'Market Lantern', descriptionEnglish: 'A hanging lantern swaying gently above the south market square.', vocabWordId: 'cheap_w36', vocabCategory: 'trade', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-marketplace-1',
      type: 'inscription',
      x: 42, y: 3,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ت-ج-ر',
      rootFamilyEnglish: 'trade',
      rootWords: ['price_w31', 'money_w30', 'shop_w28', 'merchant_w44'],
      descriptionEnglish: 'A market inscription etched into the far corner wall, bearing the root of trade — ت-ج-ر — the root behind merchant, commerce, and all exchange.',
      descriptionArabic: 'نَقشُ السُّوق المَحفورُ في رُكنِه البَعيد، بِجَذرِ التِّجارَة — ت-ج-ر.',
      culturalNote: 'The root ت-ج-ر gave Arabic تاجِر (merchant) and تِجارَة (commerce). Arab traders controlled the Silk Road for centuries, spreading language and knowledge alongside goods.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-marketplace-2',
      type: 'inscription',
      x: 6, y: 6,
      labelArabic: 'نَقش',
      labelEnglish: 'Trader Inscription',
      rootFamily: 'ب-ي-ع',
      rootFamilyEnglish: 'selling/trade',
      rootWords: ['sell_w33', 'buy_w34', 'price_w29', 'merchant_w35'],
      descriptionEnglish: 'A carved inscription at the market entrance arch, bearing the root of commerce — ب-ي-ع.',
      descriptionArabic: 'نَقشٌ مَنحوتٌ على قَوسِ مَدخَلِ السُّوق، يَحمِلُ جَذرَ البَيع — ب-ي-ع.',
      culturalNote: 'The root ب-ي-ع gave Arabic باع (to sell), بَيع (sale), and مَبيع (goods sold). The Quran explicitly permits trade while forbidding usury (riba), establishing ethical commerce.',
      repeatable: false,
      stateChange: 'discovered',
      useInk: true,
      inkFile: 'inscription-marketplace',
    },
    {
      id: 'inscription-marketplace-3',
      type: 'inscription',
      x: 42, y: 30,
      labelArabic: 'نَقش',
      labelEnglish: "Merchant's Blessing",
      rootFamily: 'ب-ر-ك',
      rootFamilyEnglish: 'blessing',
      rootWords: ['money_w30', 'merchant_w44', 'gold_w32', 'shop_w28'],
      descriptionEnglish: "A merchant's blessing inscription on the southern market wall, carved by a prosperous trader.",
      descriptionArabic: 'نَقشُ دُعاءِ التّاجِر على الجِدارِ الجَنوبي للسُّوق.',
      culturalNote: "The root ب-ر-ك gave Arabic بَرَكَة (blessing), مُبارَك (blessed), and تَبارَكَ (blessed be). Arab merchants began all transactions with 'bismillah' — In the name of God.",
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'market-to-library',
      edge: 'west',
      tileRange: [15, 19],
      targetZone: 'ancient_library',
      targetEntry: 'from_marketplace',
      label: 'Ancient Library',
      labelArabic: 'المَكتَبَة القَديمَة',
    },
    {
      id: 'market-to-farmland',
      edge: 'north',
      tileRange: [19, 25],
      targetZone: 'farmland',
      targetEntry: 'from_marketplace',
      label: 'Farmland',
      labelArabic: 'الأَرض الزِّراعِيَّة',
    },
  ],

  unlock: { quest: 'master_of_letters', minLevel: 5 },

  defaultWeather: 'dust',
  battleBackground: 'bg-desert',

  entries: {
    from_library: { x: 3, y: 17 },
    from_farmland: { x: 22, y: 3 },
  },
};

// ============================================================
// ZONE 4: Farmland (45×35)
// ============================================================

function buildFarmlandMap() {
  const W = 45, H = 35;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = GRASS;
      // Large grass fields
      if (x >= 5 && x <= 20 && y >= 5 && y <= 15) tile = GRASS;
      if (x >= 25 && x <= 40 && y >= 5 && y <= 15) tile = GRASS;
      if (x >= 10 && x <= 35 && y >= 20 && y <= 30) tile = GRASS;
      // Irrigation canal
      if (x >= 22 && x <= 23 && y >= 3 && y <= 32) tile = WATER;
      // Small pond
      if (x >= 36 && x <= 39 && y >= 25 && y <= 28) tile = WATER;
      // Path
      if (y >= 16 && y <= 19 && x >= 3 && x <= 42) tile = SAND;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const farmland = {
  id: 'farmland',
  tilesetTheme: 'grass',
  name: 'Farmland',
  nameArabic: 'الأَرض الزِّراعِيَّة',
  mapWidth: 45,
  mapHeight: 35,
  buildMap: buildFarmlandMap,
  spawnPoint: { x: 22, y: 33 },
  vocabCategories: ['nature', 'animals', 'body', 'verbs_basic'],
  gatheringSpots: true,

  objects: [
    // Farm buildings — grass biome (barn + wood houses)
    { key: 'kenmi-base-buildings-buildings-unique-buildings-barn-barn-base-blue', x: 10, y: 3, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-base-buildings-buildings-houses-wood-house-1-wood-base-blue', x: 35, y: 3, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-base-buildings-buildings-houses-wood-house-2-wood-base-red', x: 8, y: 22, collide: true, collideW: 180, collideH: 80 },
    // Trees around fields
    { key: 'kenmi-desert-props-acacia-tree', x: 5, y: 5, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 20, y: 5, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 5, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 40, y: 5, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 10, y: 15, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 35, y: 15, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 15, y: 20, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 30, y: 20, collide: true, collideW: 40, collideH: 20 },
    // Rocks along edges
    { key: 'kenmi-desert-props-desert-rocks', x: 2, y: 10, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 42, y: 10, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 2, y: 30, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 42, y: 30, collide: true, collideW: 30, collideH: 20 },
    // Palm trees
    { key: 'kenmi-desert-props-palm-tree-1', x: 40, y: 22, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 3, y: 18, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 42, y: 18, collide: true, collideW: 20, collideH: 16 },
    // DECO-05: NPC-adjacent props (Omar 12,10 and Maryam 33,25)
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 11, y: 11, collide: false },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 34, y: 26, collide: false },

    { key: 'kenmi-base-outdoor-decoration-barrels', x: 13, y: 21, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 9, y: 22, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 10, y: 22, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 11, y: 22, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 4, y: 22, collide: true, cropIndex: 2 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 6, y: 26, collide: true, cropIndex: 9 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 14, y: 17, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 18, y: 17, collide: true, cropIndex: 3 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 19, y: 19, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 8, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 10, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 12, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 6, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 38, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 36, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 34, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 32, y: 32, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 17, y: 29, collide: true, cropIndex: 8 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 13, y: 27, collide: true, cropIndex: 35 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 10, y: 26, collide: true, cropIndex: 17 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 9, y: 29, collide: true, cropIndex: 18 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 13, y: 25, collide: true, cropIndex: 19 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 30, y: 29, collide: true, cropIndex: 45 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 27, y: 27, collide: true, cropIndex: 32 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 30, y: 25, collide: true, cropIndex: 35 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 26, y: 25, collide: true, cropIndex: 31 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 25, y: 29, collide: true, cropIndex: 39 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 28, y: 29, collide: true, cropIndex: 43 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 31, y: 6, collide: true, cropIndex: 17 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 30, y: 9, collide: true, cropIndex: 44 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 27, y: 11, collide: true, cropIndex: 42 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 29, y: 12, collide: true, cropIndex: 18 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 32, y: 11, collide: true, cropIndex: 38 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 15, y: 17, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 19, y: 16, collide: true, cropIndex: 24 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 10, y: 16, collide: true, cropIndex: 32 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 26, y: 16, collide: true, cropIndex: 7 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 30, y: 18, collide: true, cropIndex: 24 },
    { key: 'kenmi-base-outdoor-decoration-flowers', x: 35, y: 17, collide: true, cropIndex: 46 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 13, y: 16, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 4, y: 16, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 32, y: 16, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-lantern', x: 12, y: 5, collide: true },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 17, y: 17, collide: true, cropIndex: 2 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 33, y: 18, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 37, y: 19, collide: true, cropIndex: 2 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 40, y: 26, collide: true, cropIndex: 2 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 37, y: 24, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 35, y: 27, collide: true, cropIndex: 5 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 38, y: 29, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 40, y: 28, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 35, y: 29, collide: true, cropIndex: 3 },
    { key: 'kenmi-desert-props-flies-anim', x: 38, y: 27, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 39, y: 24, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 35, y: 26, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 37, y: 29, collide: true },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 16, y: 3, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 30, y: 3, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 39, y: 14, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 31, y: 14, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 6, y: 14, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-fences', x: 14, y: 14, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 6, y: 2, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 5, y: 8, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-hay-bales', x: 8, y: 5, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-rocks', x: 24, y: 7, collide: true, cropIndex: 13 },
    { key: 'kenmi-desert-props-desert-rocks', x: 21, y: 23, collide: true, cropIndex: 5 },
    { key: 'kenmi-desert-props-desert-rocks', x: 24, y: 27, collide: true, cropIndex: 13 },
    { key: 'kenmi-desert-props-desert-rocks', x: 21, y: 27, collide: true, cropIndex: 4 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 24, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 24, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 24, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 24, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 26, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 26, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 26, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 26, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 5, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 5, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 5, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 7, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 7, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 7, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 7, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 27, y: 9, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 29, y: 9, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 31, y: 9, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 13, y: 24, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 16, y: 24, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 13, y: 26, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 13, y: 28, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 16, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 13, y: 30, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 16, y: 30, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 25, y: 9, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 16, y: 26, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 32, y: 1, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 32, y: 3, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 38, y: 3, collide: true, cropIndex: 5 },
 
    { key: 'kenmi-base-outdoor-decoration-scarecrows', x: 15, y: 25, collide: true, cropIndex: 0 },

  ],

  npcs: [
    { id: 'farmer-omar', key: 'npc-farmer-omar', name: 'Farmer Omar', nameArabic: 'المُزارِع عُمَر', x: 12, y: 10 },
    { id: 'herbalist-maryam', key: 'npc-herbalist-maryam', name: 'Herbalist Maryam', nameArabic: 'العَشّابَة مَريَم', x: 33, y: 25 },
  ],

  interactables: [
    { id: 'sign-farm-entrance', type: 'sign', x: 22, y: 32, textArabic: 'الأَرض الزِّراعِيَّة', textEnglish: 'The Farmland' },
    { id: 'sign-farm-barn', type: 'sign', x: 10, y: 4, textArabic: 'المَزرَعَة', textEnglish: 'The Farm' },
    { id: 'bookshelf-nature', type: 'bookshelf', x: 7, y: 8, category: 'nature' },
    { id: 'bookshelf-animals', type: 'bookshelf', x: 37, y: 8, category: 'animals' },
    { id: 'bookshelf-body', type: 'bookshelf', x: 20, y: 25, category: 'body' },
    { id: 'chest-farm-hidden', type: 'chest', x: 42, y: 3, minDirhams: 30, maxDirhams: 90 },
    { id: 'chest-farm-pond', type: 'chest', x: 36, y: 30, minDirhams: 25, maxDirhams: 75 },
    { id: 'door-barn', type: 'door', x: 15, y: 8, interiorId: 'farmhouse_interior', locked: false, labelArabic: 'بَيْت المُزارِع', labelEnglish: "Farmer's House" },
    // --- Phase 23: Interactive Objects ---
    { id: 'pot-farm-1', type: 'pot', x: 8, y: 10, labelArabic: 'قِدر', labelEnglish: 'Cooking Pot', descriptionEnglish: 'A large iron pot bubbling with farm-fresh vegetable stew.', descriptionArabic: 'قدر كبير من الحساء بالخضار الطازجة.', culturalNote: 'Communal cooking pots are central to rural Arab hospitality, always ready for unexpected guests.', vocabWordId: 'flower_w26', vocabCategory: 'nature', repeatable: true },
    { id: 'pot-farm-2', type: 'pot', x: 16, y: 12, labelArabic: 'قِدر', labelEnglish: 'Herb Pot', descriptionEnglish: 'A clay pot growing fresh mint and basil for cooking.', vocabWordId: 'earth_w22', vocabCategory: 'nature', repeatable: true },
    { id: 'pot-farm-3', type: 'pot', x: 30, y: 23, labelArabic: 'قِدر', labelEnglish: 'Seed Pot', descriptionEnglish: 'A pot filled with seeds ready for the next planting season.', vocabWordId: 'tree_w27', vocabCategory: 'nature', repeatable: true },
    { id: 'barrel-farm-1', type: 'barrel', x: 14, y: 7, labelArabic: 'برميل', labelEnglish: 'Crop Barrel', descriptionEnglish: 'A barrel of freshly harvested wheat, golden and fragrant.', vocabWordId: 'sun_w19', vocabCategory: 'nature', loot: { type: 'dirhams', min: 5, max: 12 }, repeatable: false, stateChange: 'inspected' },
    { id: 'barrel-farm-2', type: 'barrel', x: 28, y: 8, labelArabic: 'برميل', labelEnglish: 'Water Barrel', descriptionEnglish: 'A barrel collecting irrigation water from the canal.', vocabWordId: 'water_w13', vocabCategory: 'nature', repeatable: true },
    { id: 'barrel-farm-3', type: 'barrel', x: 18, y: 28, labelArabic: 'برميل', labelEnglish: 'Fruit Barrel', descriptionEnglish: 'A barrel packed with ripe pomegranates from the orchard.', culturalNote: 'Pomegranates are mentioned in the Quran and symbolise abundance and prosperity.', vocabWordId: 'rain_w14', vocabCategory: 'nature', repeatable: true },
    { id: 'statue-farm-1', type: 'statue', x: 12, y: 22, labelArabic: 'تمثال', labelEnglish: 'Nature Statue', descriptionEnglish: 'A carved stone depicting a farmer sowing seeds under a crescent moon.', culturalNote: 'Traditional Arab farmers used the lunar calendar to determine planting seasons.', vocabWordId: 'camel_1', vocabCategory: 'animals', repeatable: true },
    { id: 'fountain-farm-1', type: 'fountain', x: 38, y: 26, labelArabic: 'نافورة', labelEnglish: 'Pond Fountain', descriptionEnglish: 'A small stone fountain feeding the farm pond. Fish dart beneath the surface.', vocabWordId: 'river_w15', vocabCategory: 'nature', repeatable: true },
    { id: 'lantern-farm-1', type: 'lantern', x: 8, y: 17, labelArabic: 'فانوس', labelEnglish: 'Path Lantern', descriptionEnglish: 'A lantern marking the main farm path, lit at dusk by the farmer.', vocabWordId: 'moon_w20', vocabCategory: 'nature', repeatable: true },
    { id: 'lantern-farm-2', type: 'lantern', x: 38, y: 17, labelArabic: 'فانوس', labelEnglish: 'Path Lantern', descriptionEnglish: 'A matching lantern on the eastern stretch of the farm path.', vocabWordId: 'star_w21', vocabCategory: 'nature', repeatable: true },
    { id: 'crate-farm-1', type: 'crate', x: 34, y: 6, labelArabic: 'صندوق', labelEnglish: 'Tool Crate', descriptionEnglish: 'A wooden crate holding farming tools: hoes, sickles, and rope.', vocabWordId: 'wind_w24', vocabCategory: 'nature', loot: { type: 'dirhams', min: 4, max: 10 }, repeatable: false, stateChange: 'inspected' },
    { id: 'painting-farm-1', type: 'painting', x: 9, y: 24, labelArabic: 'لوحة', labelEnglish: 'Harvest Mural', descriptionEnglish: 'A cheerful mural painted on the farmhouse wall showing the autumn harvest.', vocabWordId: 'sky_w18', vocabCategory: 'nature', repeatable: true },
    { id: 'stall-farm-1', type: 'stall', x: 25, y: 22, labelArabic: 'دكان', labelEnglish: 'Farm Stand', descriptionEnglish: 'A roadside stand selling fresh eggs, honey, and goat cheese.', vocabWordId: 'goat_1', vocabCategory: 'animals', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-farmland-1',
      type: 'inscription',
      x: 2, y: 32,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ز-ر-ع',
      rootFamilyEnglish: 'planting',
      rootWords: ['tree_w27', 'water_w13', 'sun_w14', 'rain_w25'],
      descriptionEnglish: 'A weathered stone at the farmland\'s edge carved with the root of planting — ز-ر-ع — connecting seeds, agriculture, and all growth in Arabic.',
      descriptionArabic: 'حَجَرٌ قَديمٌ عَلى طَرَف الأَرض، مَنقوشٌ بِجَذرِ الزِّراعَة — ز-ر-ع.',
      culturalNote: 'The root ز-ر-ع gave Arabic زَراعَة (agriculture) and مَزرَعَة (farm). Islamic agricultural science introduced crop rotation, irrigation, and new plants to Europe during the Golden Age.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-farmland-2',
      type: 'inscription',
      x: 42, y: 32,
      labelArabic: 'نَقش',
      labelEnglish: 'Harvest Inscription',
      rootFamily: 'ز-ر-ع',
      rootFamilyEnglish: 'planting/growing',
      rootWords: ['tree_w27', 'water_w13', 'earth_1', 'sun_w19'],
      descriptionEnglish: 'A stone inscription at the far field edge, bearing a farmer\'s prayer about planting and harvest.',
      descriptionArabic: 'نَقشٌ حَجَري في طَرَفِ الحَقلِ البَعيد، فيهِ دُعاءُ الزّارِع للحَصاد.',
      culturalNote: 'The root ز-ر-ع gave Arabic زَرَعَ (to plant), زِراعَة (agriculture), and مَزرَعَة (farm). Islamic Golden Age scholars wrote encyclopaedic works on crop science and irrigation.',
      repeatable: false,
      stateChange: 'discovered',
    },
    {
      id: 'inscription-farmland-3',
      type: 'inscription',
      x: 22, y: 5,
      labelArabic: 'نَقش',
      labelEnglish: 'Harvest Prayer',
      rootFamily: 'ح-م-د',
      rootFamilyEnglish: 'praise/gratitude',
      rootWords: ['flower_w26', 'rain_w14', 'moon_w20', 'sun_w19'],
      descriptionEnglish: 'A carved harvest prayer on the irrigation canal stone, giving thanks for provision and fruit.',
      descriptionArabic: 'صَلاةُ حَصادٍ مَنقوشَةٌ على حَجَرِ القَناةِ، شُكراً على الرِّزق والثَّمَر.',
      culturalNote: 'The root ح-م-د gave Arabic حَمد (praise), مُحَمَّد (praised one — the Prophet), and حَمدَلَة (saying "Alhamdulillah"). Gratitude prayers before harvest are found across Arab cultures.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'farm-to-marketplace',
      edge: 'south',
      tileRange: [19, 25],
      targetZone: 'desert_marketplace',
      targetEntry: 'from_farmland',
      label: 'Desert Marketplace',
      labelArabic: 'سوق الصَّحراء',
    },
    {
      id: 'farm-to-bedouin',
      edge: 'east',
      tileRange: [15, 19],
      targetZone: 'bedouin_camp',
      targetEntry: 'from_farmland',
      label: 'Bedouin Camp',
      labelArabic: 'مُخَيَّم البَدو',
    },
  ],

  unlock: { quest: 'merchant_master', minLevel: 8, minWords: 400 },

  defaultWeather: 'clear',
  battleBackground: 'bg-farmland',

  entries: {
    from_marketplace: { x: 22, y: 33 },
    from_bedouin: { x: 43, y: 17 },
  },
};

// ============================================================
// ZONE 5: Bedouin Camp (35×25)
// ============================================================

function buildBedouinMap() {
  const W = 35, H = 25;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = SAND;
      // Central campfire area
      if (x >= 14 && x <= 20 && y >= 10 && y <= 16) tile = GRASS;
      // Tent areas (small grass patches)
      if (x >= 5 && x <= 10 && y >= 6 && y <= 10) tile = GRASS;
      if (x >= 24 && x <= 30 && y >= 6 && y <= 10) tile = GRASS;
      if (x >= 5 && x <= 10 && y >= 16 && y <= 20) tile = GRASS;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const bedouin_camp = {
  id: 'bedouin_camp',
  tilesetTheme: 'desert',
  name: 'Bedouin Camp',
  nameArabic: 'مُخَيَّم البَدو',
  mapWidth: 35,
  mapHeight: 25,
  buildMap: buildBedouinMap,
  spawnPoint: { x: 3, y: 13 },
  vocabCategories: ['time', 'phrases', 'adjectives'],
  gatheringSpots: true,

  objects: [
    // Tent structures — military tents (BLDG-05)
    { key: 'kenmi-military-military-tents', x: 7, y: 6, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-military-military-tents', x: 27, y: 6, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-military-military-tents', x: 7, y: 17, collide: true, collideW: 180, collideH: 80 },
    // Lookout tower
    { key: 'kenmi-military-lookout-towers', x: 17, y: 1, collide: true, collideW: 40, collideH: 30 },
    // Palisades flanking the camp
    { key: 'kenmi-military-palisade', x: 1, y: 12, collide: true, collideW: 30, collideH: 60 },
    { key: 'kenmi-military-palisade', x: 33, y: 12, collide: true, collideW: 30, collideH: 60 },
    // Central gathering area
    { key: 'kenmi-desert-props-desert-rocks', x: 16, y: 12, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 18, y: 14, collide: true, collideW: 30, collideH: 20 },
    // Scattered palms
    { key: 'kenmi-desert-props-palm-tree-1', x: 2, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 32, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 2, y: 20, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 32, y: 20, collide: true, collideW: 20, collideH: 16 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 13, y: 2, collide: true, collideW: 30, collideH: 20 },
    // Edge rocks
    { key: 'kenmi-desert-props-desert-rocks', x: 12, y: 22, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 25, y: 22, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 30, y: 15, collide: true, collideW: 30, collideH: 20 },
    // DECO-05: NPC-adjacent props (Tariq 17,13; Noor 8,8; Ali 27,8)
    { key: 'kenmi-desert-props-sleeping-mat', x: 16, y: 14, collide: false },
    { key: 'kenmi-desert-props-water-sack-on-stick', x: 18, y: 14, collide: false },
    { key: 'kenmi-desert-props-desert-rugs', x: 9, y: 9, collide: false },
    { key: 'kenmi-desert-props-sleeping-mat', x: 28, y: 9, collide: false },

    { key: 'kenmi-desert-props-desert-rugs', x: 6, y: 13, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-rugs', x: 25, y: 13, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 10, y: 7, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 5, y: 9, collide: true, cropIndex: 3 },
    { key: 'kenmi-desert-props-desert-rocks', x: 33, y: 8, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-rocks', x: 28, y: 2, collide: true, cropIndex: 10 },
    { key: 'kenmi-desert-props-desert-rocks', x: 6, y: 2, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-golden-pots', x: 8, y: 20, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-golden-pots', x: 9, y: 20, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-golden-pots', x: 5, y: 20, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 30, y: 8, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 30, y: 7, collide: true, cropIndex: 3 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 24, y: 8, collide: true, cropIndex: 0 },
    { key: 'kenmi-military-banners-anim', x: 10, y: 3, collide: true },
    { key: 'kenmi-military-banners-anim', x: 24, y: 3, collide: true },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 15, y: 19, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 19, y: 19, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 27, y: 20, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-lantern', x: 25, y: 10, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-1-anim', x: 12, y: 10, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-2-anim', x: 12, y: 14, collide: true },
    { key: 'kenmi-desert-props-outdoor-decor-animations-desert-grass-3-anim', x: 22, y: 12, collide: true },
    { key: 'kenmi-desert-props-desert-grass-props', x: 19, y: 22, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 29, y: 17, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 8, y: 23, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 13, y: 7, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 16, y: 6, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 19, y: 8, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-fern', x: 5, y: 3, collide: true },
    { key: 'kenmi-desert-props-desert-fern', x: 30, y: 3, collide: true },
    { key: 'kenmi-desert-props-desert-fern', x: 33, y: 2, collide: true },
    { key: 'kenmi-desert-props-golden-pots', x: 16, y: 16, collide: true, cropIndex: 0 },
    { key: 'kenmi-military-campfire-pot-anim', x: 17, y: 7, collide: true },
    { key: 'kenmi-military-palisade', x: 33, y: 15, collide: true, cropIndex: 1 },
    { key: 'kenmi-military-flags-anim', x: 10, y: 16, collide: true },
    { key: 'kenmi-military-flags-anim', x: 10, y: 6, collide: true },
    { key: 'kenmi-military-flags-anim', x: 24, y: 6, collide: true },

  ],

  npcs: [
    { id: 'elder-tariq', key: 'npc-elder-tariq', name: 'Elder Tariq', nameArabic: 'الشَّيخ طارِق', x: 17, y: 13 },
    { id: 'storyteller-noor', key: 'npc-storyteller-noor', name: 'Storyteller Noor', nameArabic: 'الحَكّاءَة نور', x: 8, y: 8 },
    { id: 'wanderer-ali', key: 'npc-wanderer-ali', name: 'Wanderer Ali', nameArabic: 'الرَّحّالَة عَلي', x: 27, y: 8 },
  ],

  interactables: [
    { id: 'sign-camp', type: 'sign', x: 3, y: 12, textArabic: 'مُخَيَّم البَدو', textEnglish: 'Bedouin Camp' },
    { id: 'sign-elder-tent', type: 'sign', x: 14, y: 10, textArabic: 'خَيمَة الشَّيخ', textEnglish: "Elder's Tent" },
    { id: 'bookshelf-time', type: 'bookshelf', x: 9, y: 18, category: 'time' },
    { id: 'bookshelf-adjectives', type: 'bookshelf', x: 29, y: 8, category: 'adjectives' },
    { id: 'chest-camp-hidden', type: 'chest', x: 31, y: 22, minDirhams: 30, maxDirhams: 100 },
    { id: 'chest-camp-tent', type: 'chest', x: 5, y: 7, minDirhams: 25, maxDirhams: 80 },
    { id: 'door-bedouin-tent', type: 'door', x: 7, y: 8, interiorId: 'bedouin_tent_interior', locked: false, labelArabic: 'خَيْمَة الشَّيْخ', labelEnglish: "Elder's Tent" },
    // --- Phase 23: Interactive Objects ---
    { id: 'lantern-camp-1', type: 'lantern', x: 15, y: 11, labelArabic: 'فانوس', labelEnglish: 'Campfire Lantern', descriptionEnglish: 'A tall lantern beside the central campfire, casting dancing shadows across the sand.', descriptionArabic: 'فانوس طويل بجانب نار المخيم.', culturalNote: 'Bedouin campfires are the centre of storytelling, poetry, and hospitality under the stars.', vocabWordId: 'night_1', vocabCategory: 'time', repeatable: true },
    { id: 'lantern-camp-2', type: 'lantern', x: 19, y: 11, labelArabic: 'فانوس', labelEnglish: 'Campfire Lantern', descriptionEnglish: 'A matching lantern on the other side of the gathering circle.', vocabWordId: 'evening_1', vocabCategory: 'time', repeatable: true },
    { id: 'lantern-camp-3', type: 'lantern', x: 6, y: 17, labelArabic: 'فانوس', labelEnglish: 'Tent Lantern', descriptionEnglish: 'A small hanging lantern at the entrance of the southern tent.', vocabWordId: 'morning_1', vocabCategory: 'time', repeatable: true },
    { id: 'painting-camp-1', type: 'painting', x: 9, y: 7, labelArabic: 'لوحة', labelEnglish: 'Family Tapestry', descriptionEnglish: 'A woven tapestry depicting a Bedouin family travelling across the desert with their camels.', culturalNote: 'Bedouin families are organised into tribes and clans, with strong bonds of loyalty and kinship.', vocabWordId: 'where_is_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'painting-camp-2', type: 'painting', x: 26, y: 7, labelArabic: 'لوحة', labelEnglish: 'Star Map', descriptionEnglish: 'A painted star map showing desert navigation routes used by Bedouin travellers.', culturalNote: 'Bedouins navigate the desert by reading the stars, a skill passed down through generations.', vocabWordId: 'hour_1', vocabCategory: 'time', repeatable: true },
    { id: 'crate-camp-1', type: 'crate', x: 22, y: 9, labelArabic: 'صندوق', labelEnglish: 'Travel Crate', descriptionEnglish: 'A crate of supplies prepared for the next desert crossing.', vocabWordId: 'strong_1', vocabCategory: 'adjectives', loot: { type: 'dirhams', min: 8, max: 18 }, repeatable: false, stateChange: 'inspected' },
    { id: 'crate-camp-2', type: 'crate', x: 10, y: 19, labelArabic: 'صندوق', labelEnglish: 'Provisions Crate', descriptionEnglish: 'Dried meat, flatbread, and water skins for the camp.', vocabWordId: 'today_1', vocabCategory: 'time', repeatable: true },
    { id: 'pot-camp-1', type: 'pot', x: 17, y: 15, labelArabic: 'قِدر', labelEnglish: 'Coffee Pot', descriptionEnglish: 'A traditional dallah coffee pot warming over the embers. The aroma of cardamom fills the air.', culturalNote: 'Arabic coffee (qahwa) with cardamom is a cornerstone of Bedouin hospitality. Refusing a cup is considered rude.', vocabWordId: 'welcome_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'barrel-camp-1', type: 'barrel', x: 28, y: 9, labelArabic: 'برميل', labelEnglish: 'Water Barrel', descriptionEnglish: 'A precious barrel of water, the most valuable resource in the desert.', vocabWordId: 'tomorrow_1', vocabCategory: 'time', loot: { type: 'dirhams', min: 3, max: 8 }, repeatable: false, stateChange: 'inspected' },
    { id: 'statue-camp-1', type: 'statue', x: 20, y: 4, labelArabic: 'تمثال', labelEnglish: 'Wayfinder Stone', descriptionEnglish: 'An ancient carved stone used as a directional marker by desert travellers.', culturalNote: 'Stone cairns and markers guided caravans across the Arabian deserts long before compasses arrived.', vocabWordId: 'old_1', vocabCategory: 'adjectives', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-bedouin-1',
      type: 'inscription',
      x: 32, y: 22,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'س-ف-ر',
      rootFamilyEnglish: 'travel',
      rootWords: ['star_w16', 'moon_w15', 'desert_w18', 'camel_1'],
      descriptionEnglish: 'A Bedouin inscription hidden at the camp\'s far corner, bearing the root of travel — س-ف-ر — the root behind journey, traveler, and the ambassador.',
      descriptionArabic: 'نَقشٌ بَدَوي في رُكنِ المُخَيَّم، يَحمِلُ جَذرَ السَّفَر — س-ف-ر.',
      culturalNote: 'The root س-ف-ر gave Arabic سَفَر (journey), سَفير (ambassador), and سِفر (book). Bedouin caravans were the information highways of the ancient Arab world.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-camp-2',
      type: 'inscription',
      x: 3, y: 3,
      labelArabic: 'نَقش',
      labelEnglish: 'Traveller Inscription',
      rootFamily: 'س-ف-ر',
      rootFamilyEnglish: 'travel/journey',
      rootWords: ['star_w16', 'moon_w15', 'desert_w18', 'camel_1'],
      descriptionEnglish: 'An inscription at the camp lookout post, carved by a traveller who journeyed across many deserts.',
      descriptionArabic: 'نَقشٌ عِندَ مَنصَبِ المُراقَبَة، نَحَتَه مُسافِرٌ اجتازَ كَثيراً مِنَ الصَّحاري.',
      culturalNote: 'The root س-ف-ر gave Arabic سَفَر (journey), سَفير (ambassador), مُسافِر (traveller), and سِفر (scripture/book). Bedouin caravans connected cultures across thousands of miles.',
      repeatable: false,
      stateChange: 'discovered',
      useInk: true,
      inkFile: 'inscription-camp',
    },
    {
      id: 'inscription-camp-3',
      type: 'inscription',
      x: 14, y: 22,
      labelArabic: 'نَقش',
      labelEnglish: 'Hospitality Stone',
      rootFamily: 'ك-ر-م',
      rootFamilyEnglish: 'generosity/nobility',
      rootWords: ['welcome_1', 'strong_1', 'old_1', 'where_is_1'],
      descriptionEnglish: 'A hospitality stone at the camp entrance carved with a Bedouin saying about honouring guests.',
      descriptionArabic: 'حَجَرُ الكَرَم عِندَ مَدخَلِ المُخَيَّم، مَنقوشٌ بِمَثَلٍ بَدَوي عَن إكرامِ الضَّيف.',
      culturalNote: 'The root ك-ر-م gave Arabic كَريم (generous/noble), كَرَم (generosity), and كِرامَة (dignity). Bedouin hospitality (diyafa) requires hosting guests for three days without question.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'bedouin-to-farmland',
      edge: 'west',
      tileRange: [11, 15],
      targetZone: 'farmland',
      targetEntry: 'from_bedouin',
      label: 'Farmland',
      labelArabic: 'الأَرض الزِّراعِيَّة',
    },
    {
      id: 'bedouin-to-mountain',
      edge: 'north',
      tileRange: [15, 19],
      targetZone: 'mountain_village',
      targetEntry: 'from_bedouin',
      label: 'Mountain Village',
      labelArabic: 'قَرية الجَبَل',
    },
  ],

  unlock: { quest: 'natures_scholar', minLevel: 11, minWords: 600 },

  defaultWeather: 'sandstorm',
  battleBackground: 'bg-camp',

  entries: {
    from_farmland: { x: 3, y: 13 },
    from_mountain: { x: 17, y: 3 },
  },
};

// ============================================================
// ZONE 6: Mountain Village (40×30)
// ============================================================

function buildMountainMap() {
  const W = 40, H = 30;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = ICE_GRASS;
      // Rocky mountain paths
      if ((y >= 13 && y <= 16) || (x >= 18 && x <= 21)) tile = SAND;
      // Village clearing
      if (x >= 12 && x <= 28 && y >= 8 && y <= 22) tile = GRASS;
      // Mountain stream
      if (x >= 30 && x <= 31 && y >= 3 && y <= 27) tile = WATER;
      // Small pond
      if (x >= 20 && x <= 23 && y >= 18 && y <= 20) tile = WATER;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const mountain_village = {
  id: 'mountain_village',
  tilesetTheme: 'snow',
  name: 'Mountain Village',
  nameArabic: 'قَرية الجَبَل',
  mapWidth: 40,
  mapHeight: 30,
  buildMap: buildMountainMap,
  spawnPoint: { x: 20, y: 27 },
  vocabCategories: ['clothing', 'animals', 'adjectives'],
  gatheringSpots: true,

  objects: [
    // Village buildings — snow biome (limestone/stone dark-variant houses)
    { key: 'kenmi-base-buildings-buildings-houses-limestone-house-3-limestone-base-black', x: 15, y: 9, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-base-buildings-buildings-houses-limestone-house-4-limestone-base-black', x: 25, y: 9, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-base-buildings-buildings-houses-stone-house-1-stone-base-black', x: 14, y: 18, collide: true, collideW: 180, collideH: 80 },
    // Phase 97 Plan 06: KENMI_CATALOG has a typo-suffixed key 'stone-house-2-stone-base-blackpng'
    // (auto-generator leaked .png into key name). Use stone-house-3-stone-base-blue as a working variant
    // until scripts/generate-kenmi-catalog.js is fixed. Preserves visual intent (dark stone village).
    { key: 'kenmi-base-buildings-buildings-houses-stone-house-3-stone-base-blue', x: 26, y: 18, collide: true, collideW: 180, collideH: 80 },
    // Mountain trees (dead/sparse trees fitting cold climate)
    { key: 'kenmi-desert-props-dead-tree', x: 4, y: 6, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-dead-tree', x: 8, y: 4, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-dead-tree', x: 35, y: 6, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-dead-tree', x: 37, y: 4, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 12, y: 14, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 28, y: 14, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 6, y: 20, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 34, y: 20, collide: true, collideW: 40, collideH: 20 },
    // Rocks and obelisks
    { key: 'kenmi-desert-props-desert-rocks', x: 3, y: 14, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 37, y: 14, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 8, y: 26, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 33, y: 26, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 18, y: 8, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 22, y: 8, collide: true, collideW: 20, collideH: 20 },
    // DECO-05: NPC-adjacent props (Salim 20,13; Zahra 15,20; Khadija 27,20)
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 19, y: 14, collide: false },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 16, y: 21, collide: false },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 28, y: 21, collide: false },
    
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 14, y: 9, collide: true, cropIndex: 3 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 13, y: 9, collide: true, cropIndex: 3 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 28, y: 8, collide: true, cropIndex: 3 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 28, y: 9, collide: true, cropIndex: 3 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 25, y: 18, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 12, y: 19, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 18, y: 24, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 20, y: 5, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 34, y: 13, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 9, y: 14, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-lantern', x: 26, y: 10, collide: true },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor-animations-water-decor-animations-water-plants-lillypad-brown-2-anim', x: 22, y: 19, collide: true },
    { key: 'kenmi-desert-props-desert-rocks', x: 25, y: 3, collide: true, cropIndex: 4 },
    { key: 'kenmi-desert-props-desert-rocks', x: 34, y: 2, collide: true, cropIndex: 7 },
    { key: 'kenmi-desert-props-desert-rocks', x: 36, y: 9, collide: true, cropIndex: 12 },
    { key: 'kenmi-desert-props-desert-rocks', x: 8, y: 6, collide: true, cropIndex: 12 },
    { key: 'kenmi-desert-props-desert-rocks', x: 5, y: 8, collide: true, cropIndex: 7 },
    { key: 'kenmi-desert-props-desert-rocks', x: 9, y: 10, collide: true, cropIndex: 12 },
    { key: 'kenmi-desert-props-desert-rocks', x: 9, y: 21, collide: true, cropIndex: 12 },
    { key: 'kenmi-desert-props-desert-rocks', x: 13, y: 27, collide: true, cropIndex: 4 },
    { key: 'kenmi-desert-props-desert-rocks', x: 26, y: 25, collide: true, cropIndex: 7 },
    { key: 'kenmi-desert-props-desert-rocks', x: 35, y: 23, collide: true, cropIndex: 7 },
    { key: 'kenmi-desert-props-desert-pots-sacks', x: 18, y: 10, collide: true, cropIndex: 4 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 13, y: 11, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 23, y: 11, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 21, y: 17, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 21, y: 6, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 18, y: 3, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 20, y: 2, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 6, y: 13, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 8, y: 16, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 11, y: 16, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 18, y: 27, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 21, y: 24, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 19, y: 23, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 34, y: 16, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 36, y: 13, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-desert-grass-props', x: 33, y: 13, collide: true, cropIndex: 2 },
    { key: 'kenmi-desert-props-dead-bush', x: 12, y: 2, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-dead-bush', x: 7, y: 5, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 6, y: 1, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-dead-bush', x: 11, y: 26, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-dead-bush', x: 9, y: 24, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 10, y: 28, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 36, y: 22, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 36, y: 26, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-dead-bush', x: 27, y: 27, collide: true, cropIndex: 0 },
    { key: 'kenmi-desert-props-dead-bush', x: 26, y: 2, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 38, y: 7, collide: true, cropIndex: 1 },
    { key: 'kenmi-desert-props-dead-bush', x: 33, y: 9, collide: true, cropIndex: 1 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 16, y: 12, collide: true, cropIndex: 0 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 22, y: 11, collide: true, cropIndex: 4 },
    { key: 'kenmi-base-outdoor-decoration-outdoor-decor', x: 18, y: 16, collide: true, cropIndex: 5 },
  ],

  npcs: [
    { id: 'guide-salim', key: 'npc-guide-salim', name: 'Guide Salim', nameArabic: 'الدَّليل سَليم', x: 20, y: 13 },
    { id: 'weaver-zahra', key: 'npc-weaver-zahra', name: 'Weaver Zahra', nameArabic: 'النَّسّاجَة زَهراء', x: 15, y: 20 },
    { id: 'healer-khadija', key: 'npc-healer-khadija', name: 'Healer Khadija', nameArabic: 'المُعالِجَة خَديجَة', x: 27, y: 20 },
  ],

  interactables: [
    { id: 'sign-mountain', type: 'sign', x: 20, y: 26, textArabic: 'قَرية الجَبَل', textEnglish: 'Mountain Village' },
    { id: 'sign-weaver', type: 'sign', x: 13, y: 18, textArabic: 'بَيت النَّسّاجَة', textEnglish: "Weaver's House" },
    { id: 'bookshelf-clothing', type: 'bookshelf', x: 16, y: 10, category: 'clothing' },
    { id: 'bookshelf-animals-mt', type: 'bookshelf', x: 24, y: 10, category: 'animals' },
    { id: 'bookshelf-adj-mt', type: 'bookshelf', x: 20, y: 16, category: 'adjectives' },
    { id: 'chest-mountain-stream', type: 'chest', x: 32, y: 15, minDirhams: 35, maxDirhams: 110 },
    { id: 'chest-mountain-peak', type: 'chest', x: 5, y: 3, minDirhams: 40, maxDirhams: 120 },
    { id: 'door-mountain-home', type: 'door', x: 15, y: 20, interiorId: 'mountain_home_interior', locked: false, labelArabic: 'بَيْت الشَّيْخ', labelEnglish: "Elder's Home" },
    { id: 'door-mountain-mosque', type: 'door', x: 25, y: 20, interiorId: 'mountain_mosque_interior', locked: false, labelArabic: 'المَسْجِد', labelEnglish: 'Mosque' },
    // --- Phase 23: Interactive Objects ---
    { id: 'statue-mountain-1', type: 'statue', x: 20, y: 10, labelArabic: 'تمثال', labelEnglish: 'Mountain Guardian', descriptionEnglish: 'A tall carved statue of an ibex, the guardian spirit of the mountain village.', descriptionArabic: 'تمثال منحوت لوعل الجبل.', culturalNote: 'The Arabian ibex is a symbol of resilience and has lived in these mountains for thousands of years.', vocabWordId: 'horse_1', vocabCategory: 'animals', repeatable: true },
    { id: 'statue-mountain-2', type: 'statue', x: 16, y: 14, labelArabic: 'تمثال', labelEnglish: 'Healer Statue', descriptionEnglish: 'A stone carving of a hand holding herbs, honouring the village healers.', vocabWordId: 'cloak_w5', vocabCategory: 'clothing', repeatable: true },
    { id: 'painting-mountain-1', type: 'painting', x: 17, y: 19, labelArabic: 'لوحة', labelEnglish: 'Animal Mural', descriptionEnglish: 'A wall painting showing mountain goats, eagles, and foxes in their natural habitat.', culturalNote: 'Mountain villages in the Arab world often feature murals celebrating local wildlife.', vocabWordId: 'bird_1', vocabCategory: 'animals', repeatable: true },
    { id: 'painting-mountain-2', type: 'painting', x: 24, y: 19, labelArabic: 'لوحة', labelEnglish: 'Weaving Pattern', descriptionEnglish: 'A decorative tile showing traditional geometric weaving patterns from the village.', vocabWordId: 'headscarf_w2', vocabCategory: 'clothing', repeatable: true },
    { id: 'pot-mountain-1', type: 'pot', x: 14, y: 12, labelArabic: 'قِدر', labelEnglish: 'Herbal Pot', descriptionEnglish: 'A pot of dried mountain herbs — thyme, sage, and chamomile — used for medicinal teas.', culturalNote: 'Traditional Arab herbal medicine (tibb) has been practised for over 1000 years.', vocabWordId: 'hot_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'pot-mountain-2', type: 'pot', x: 26, y: 12, labelArabic: 'قِدر', labelEnglish: 'Dye Pot', descriptionEnglish: 'A pot of natural plant dye used by the weaver to colour wool.', vocabWordId: 'dress_w6', vocabCategory: 'clothing', repeatable: true },
    { id: 'lantern-mountain-1', type: 'lantern', x: 19, y: 22, labelArabic: 'فانوس', labelEnglish: 'Village Lantern', descriptionEnglish: 'A copper lantern lighting the village square as evening falls.', vocabWordId: 'cold_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'lantern-mountain-2', type: 'lantern', x: 21, y: 22, labelArabic: 'فانوس', labelEnglish: 'Village Lantern', descriptionEnglish: 'A second lantern flanking the path between the elder home and mosque.', vocabWordId: 'sheep_1', vocabCategory: 'animals', repeatable: true },
    { id: 'fountain-mountain-1', type: 'fountain', x: 29, y: 10, labelArabic: 'نافورة', labelEnglish: 'Stream Fountain', descriptionEnglish: 'A natural spring channelled into a stone basin beside the mountain stream.', culturalNote: 'Mountain springs are considered blessed in Arab tradition, often named after saints or prophets.', vocabWordId: 'beautiful_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'barrel-mountain-1', type: 'barrel', x: 13, y: 21, labelArabic: 'برميل', labelEnglish: 'Wool Barrel', descriptionEnglish: 'A barrel of raw mountain wool waiting to be spun by the weaver.', vocabWordId: 'turban_w7', vocabCategory: 'clothing', loot: { type: 'dirhams', min: 6, max: 14 }, repeatable: false, stateChange: 'inspected' },
    { id: 'crate-mountain-1', type: 'crate', x: 27, y: 21, labelArabic: 'صندوق', labelEnglish: 'Medicine Crate', descriptionEnglish: 'A crate of herbal remedies prepared by the village healer for trade.', vocabWordId: 'new_1', vocabCategory: 'adjectives', loot: { type: 'dirhams', min: 8, max: 20 }, repeatable: false, stateChange: 'inspected' },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-mountain-1',
      type: 'inscription',
      x: 2, y: 3,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ش-ف-ي',
      rootFamilyEnglish: 'healing',
      rootWords: ['water_w13', 'old_1', 'new_1', 'big_1'],
      descriptionEnglish: 'An inscription carved high on the mountain path, bearing the healing root — ش-ف-ي — connecting cure, recovery, and the lips in Arabic.',
      descriptionArabic: 'نَقشٌ مَحفورٌ عالياً في طَريقِ الجَبَل، يَحمِلُ جَذرَ الشِّفاء — ش-ف-ي.',
      culturalNote: 'The root ش-ف-ي gave Arabic شِفاء (healing) and شَفَة (lip). Ibn Sina\'s Canon of Medicine (القانون في الطِّبّ), written in Arabic, was the primary medical textbook in Europe until the 17th century.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-mountain-2',
      type: 'inscription',
      x: 37, y: 27,
      labelArabic: 'نَقش',
      labelEnglish: 'Craft Inscription',
      rootFamily: 'ص-ن-ع',
      rootFamilyEnglish: 'making/crafting',
      rootWords: ['horse_1', 'cloak_w5', 'new_1', 'bird_1'],
      descriptionEnglish: 'A craftsman\'s inscription near the mountain stream, carved by an ancestor who built the village.',
      descriptionArabic: 'نَقشُ حِرفيٍّ قُربَ مَجرى الجَبَل، نَحَتَه جَدٌّ بَنى القَريَة.',
      culturalNote: 'The root ص-ن-ع gave Arabic صَنَعَ (to make), صِناعَة (industry), صانِع (craftsman), and مَصنَع (factory). Arab artisans in Toledo and Cordoba were famed for their metalwork across Europe.',
      repeatable: false,
      stateChange: 'discovered',
    },
    {
      id: 'inscription-mountain-3',
      type: 'inscription',
      x: 6, y: 27,
      labelArabic: 'نَقش',
      labelEnglish: 'Forge Proverb',
      rootFamily: 'ص-ب-ر',
      rootFamilyEnglish: 'patience/endurance',
      rootWords: ['hot_1', 'cold_1', 'beautiful_1', 'new_1'],
      descriptionEnglish: 'A proverb stone near the village edge, comparing the patience of a craftsman to the shaping of iron.',
      descriptionArabic: 'حَجَرُ مَثَلٍ قُربَ طَرَفِ القَريَة، يُقارِنُ صَبرَ الحِرفي بِتَشكيلِ الحَديد.',
      culturalNote: 'The root ص-ب-ر gave Arabic صَبر (patience), صابِر (patient one), and صَبّار (very patient). Patience (sabr) is one of the most praised virtues in Arabic proverbs.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'mountain-to-bedouin',
      edge: 'south',
      tileRange: [17, 23],
      targetZone: 'bedouin_camp',
      targetEntry: 'from_mountain',
      label: 'Bedouin Camp',
      labelArabic: 'مُخَيَّم البَدو',
    },
    {
      id: 'mountain-to-port',
      edge: 'east',
      tileRange: [12, 18],
      targetZone: 'coastal_port',
      targetEntry: 'from_mountain',
      label: 'Coastal Port',
      labelArabic: 'المِيناء',
    },
  ],

  unlock: { quest: 'tales_of_desert', minLevel: 14, minWords: 800 },

  defaultWeather: 'snow',
  battleBackground: 'bg-mountain',

  entries: {
    from_bedouin: { x: 20, y: 27 },
    from_port: { x: 38, y: 15 },
  },
};

// ============================================================
// ZONE 7: Coastal Port (45×35)
// ============================================================

function buildPortMap() {
  const W = 45, H = 35;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = SAND;
      // Harbor water on the east side
      if (x >= 35) tile = WATER;
      // Dock area (grass path along water edge)
      if (x >= 32 && x <= 34 && y >= 5 && y <= 30) tile = GRASS;
      // Town center
      if (x >= 10 && x <= 25 && y >= 12 && y <= 22) tile = GRASS;
      // Main road to dock
      if (y >= 16 && y <= 18 && x >= 5 && x <= 34) tile = GRASS;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const coastal_port = {
  id: 'coastal_port',
  tilesetTheme: 'grass',
  name: 'Coastal Port',
  nameArabic: 'المِيناء',
  mapWidth: 45,
  mapHeight: 35,
  buildMap: buildPortMap,
  spawnPoint: { x: 3, y: 17 },
  vocabCategories: ['directions', 'trade', 'food'],
  gatheringSpots: true,

  objects: [
    // Port buildings — grass biome (stone + inn + fisherman house)
    { key: 'kenmi-base-buildings-buildings-houses-stone-house-3-stone-base-blue', x: 15, y: 10, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-base-buildings-buildings-unique-buildings-inn-inn-blue', x: 22, y: 10, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-base-buildings-buildings-unique-buildings-fisherman-house-fisherman-house-base-blue', x: 10, y: 22, collide: true, collideW: 180, collideH: 80 },
    { key: 'kenmi-base-buildings-buildings-houses-wood-house-3-wood-base-red', x: 22, y: 22, collide: true, collideW: 180, collideH: 80 },
    // Dock structures — obelisk markers
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 33, y: 8, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 33, y: 14, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 33, y: 20, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 33, y: 26, collide: true, collideW: 20, collideH: 20 },
    // Palms near coast
    { key: 'kenmi-desert-props-palm-tree-1', x: 30, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 30, y: 30, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 5, y: 8, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 5, y: 26, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-2', x: 28, y: 12, collide: true, collideW: 20, collideH: 16 },
    // Rocks
    { key: 'kenmi-desert-props-desert-rocks', x: 3, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 3, y: 30, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 15, y: 30, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 25, y: 5, collide: true, collideW: 30, collideH: 20 },
    // Trees in town
    { key: 'kenmi-desert-props-acacia-tree', x: 10, y: 14, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-halfdead-tree', x: 25, y: 14, collide: true, collideW: 30, collideH: 20 },
    // DECO-05: NPC-adjacent props (Rashid 33,17; Hana 18,17; Daud 12,24)
    { key: 'kenmi-base-outdoor-decoration-barrels', x: 34, y: 18, collide: false },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 17, y: 18, collide: false },
    { key: 'kenmi-base-outdoor-decoration-camp-decor', x: 11, y: 25, collide: false },
  ],

  npcs: [
    { id: 'captain-rashid', key: 'npc-captain-rashid', name: 'Captain Rashid', nameArabic: 'القُبطان رَشيد', x: 33, y: 17 },
    { id: 'fishmonger-hana', key: 'npc-fishmonger-hana', name: 'Fishmonger Hana', nameArabic: 'بائِعَة السَّمَك هَناء', x: 18, y: 17 },
    { id: 'blacksmith-daud', key: 'npc-blacksmith-daud', name: 'Blacksmith Daud', nameArabic: 'الحَدّاد داوُد', x: 12, y: 24 },
  ],

  interactables: [
    { id: 'sign-port', type: 'sign', x: 5, y: 17, textArabic: 'المِيناء', textEnglish: 'The Coastal Port' },
    { id: 'sign-dock', type: 'sign', x: 32, y: 6, textArabic: 'رَصيف السُّفُن', textEnglish: 'Ship Dock' },
    { id: 'sign-smithy', type: 'sign', x: 11, y: 23, textArabic: 'الحِدادَة', textEnglish: 'The Smithy' },
    { id: 'bookshelf-directions', type: 'bookshelf', x: 16, y: 11, category: 'directions' },
    { id: 'bookshelf-port-trade', type: 'bookshelf', x: 23, y: 11, category: 'trade' },
    { id: 'bookshelf-port-food', type: 'bookshelf', x: 18, y: 23, category: 'food' },
    { id: 'chest-port-dock', type: 'chest', x: 34, y: 28, minDirhams: 40, maxDirhams: 130 },
    { id: 'chest-port-alley', type: 'chest', x: 8, y: 8, minDirhams: 35, maxDirhams: 110 },
    { id: 'door-port-tavern', type: 'door', x: 15, y: 22, interiorId: 'port_tavern_interior', locked: false, labelArabic: 'حانَة البَحّارَة', labelEnglish: "Sailor's Tavern" },
    { id: 'door-port-warehouse', type: 'door', x: 22, y: 22, interiorId: 'port_warehouse_interior', locked: false, labelArabic: 'مَخْزَن المِيناء', labelEnglish: 'Port Warehouse' },
    // --- Phase 23: Interactive Objects ---
    { id: 'lantern-port-1', type: 'lantern', x: 33, y: 10, labelArabic: 'فانوس', labelEnglish: 'Dock Lantern', descriptionEnglish: 'A weathered iron lantern guiding ships into the harbour at night.', descriptionArabic: 'فانوس حديدي يرشد السفن ليلاً.', culturalNote: 'Arab seafarers were master navigators who sailed as far as China and East Africa.', vocabWordId: 'north_1', vocabCategory: 'directions', repeatable: true },
    { id: 'lantern-port-2', type: 'lantern', x: 33, y: 22, labelArabic: 'فانوس', labelEnglish: 'Dock Lantern', descriptionEnglish: 'A southern dock lantern, its flame reflected in the dark harbour water.', vocabWordId: 'south_1', vocabCategory: 'directions', repeatable: true },
    { id: 'lantern-port-3', type: 'lantern', x: 15, y: 16, labelArabic: 'فانوس', labelEnglish: 'Town Lantern', descriptionEnglish: 'A brass lantern illuminating the main road through port town.', vocabWordId: 'fish_1', vocabCategory: 'food', repeatable: true },
    { id: 'crate-port-1', type: 'crate', x: 33, y: 12, labelArabic: 'صندوق', labelEnglish: 'Shipping Crate', descriptionEnglish: 'A large crate of exotic goods arriving from overseas: silk, porcelain, and spices.', culturalNote: 'Arab dhow ships carried goods between India, Africa, and the Gulf for centuries.', vocabWordId: 'expensive_w37', vocabCategory: 'trade', loot: { type: 'dirhams', min: 12, max: 30 }, repeatable: false, stateChange: 'inspected' },
    { id: 'crate-port-2', type: 'crate', x: 33, y: 18, labelArabic: 'صندوق', labelEnglish: 'Export Crate', descriptionEnglish: 'A crate of Arabian dates and frankincense bound for distant ports.', vocabWordId: 'goods_w38', vocabCategory: 'trade', repeatable: true },
    { id: 'crate-port-3', type: 'crate', x: 20, y: 12, labelArabic: 'صندوق', labelEnglish: 'Supply Crate', descriptionEnglish: 'A crate of ship supplies: rope, canvas, and tar.', vocabWordId: 'right_1', vocabCategory: 'directions', repeatable: true },
    { id: 'barrel-port-1', type: 'barrel', x: 33, y: 24, labelArabic: 'برميل', labelEnglish: 'Fish Barrel', descriptionEnglish: 'A barrel of freshly salted fish from the morning catch.', culturalNote: 'Fishing has been a livelihood along the Arabian coast for over 7000 years.', vocabWordId: 'meat_1', vocabCategory: 'food', loot: { type: 'dirhams', min: 5, max: 12 }, repeatable: false, stateChange: 'inspected' },
    { id: 'barrel-port-2', type: 'barrel', x: 12, y: 17, labelArabic: 'برميل', labelEnglish: 'Rum Barrel', descriptionEnglish: 'A barrel of date wine stored near the tavern. It smells sweet and strong.', vocabWordId: 'sugar_1', vocabCategory: 'food', repeatable: true },
    { id: 'barrel-port-3', type: 'barrel', x: 27, y: 17, labelArabic: 'برميل', labelEnglish: 'Tar Barrel', descriptionEnglish: 'A barrel of ship tar used to waterproof the hulls of trading dhows.', vocabWordId: 'left_1', vocabCategory: 'directions', repeatable: true },
    { id: 'painting-port-1', type: 'painting', x: 16, y: 21, labelArabic: 'لوحة', labelEnglish: 'Sea Painting', descriptionEnglish: 'A vibrant painting of a dhow sailing at sunset, its lateen sail billowing in the wind.', culturalNote: 'The lateen sail, perfected by Arab sailors, revolutionised navigation across the Indian Ocean.', vocabWordId: 'east_1', vocabCategory: 'directions', repeatable: true },
    { id: 'painting-port-2', type: 'painting', x: 23, y: 21, labelArabic: 'لوحة', labelEnglish: 'Port Map', descriptionEnglish: 'A detailed painted map showing trade routes connecting this port to distant lands.', vocabWordId: 'west_1', vocabCategory: 'directions', repeatable: true },
    { id: 'fountain-port-1', type: 'fountain', x: 18, y: 14, labelArabic: 'نافورة', labelEnglish: 'Town Fountain', descriptionEnglish: 'A large stone fountain in the port town centre where sailors refill their water skins.', vocabWordId: 'water_1', vocabCategory: 'food', repeatable: true },
    { id: 'statue-port-1', type: 'statue', x: 22, y: 14, labelArabic: 'تمثال', labelEnglish: 'Navigator Statue', descriptionEnglish: 'A bronze statue of a famous navigator holding a compass and map scroll.', culturalNote: 'Ibn Majid, the "Lion of the Sea", wrote over 40 navigational texts in the 15th century.', vocabWordId: 'near_1', vocabCategory: 'directions', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-port-1',
      type: 'inscription',
      x: 42, y: 3,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'ب-ح-ر',
      rootFamilyEnglish: 'sea',
      rootWords: ['sea_w23', 'wind_w26', 'north_1', 'fish_animal_1'],
      descriptionEnglish: 'A sailor\'s inscription carved at the port\'s far edge, bearing the root of the sea — ب-ح-ر — from which Arabic draws its words for ocean, lake, and the vast expanse.',
      descriptionArabic: 'نَقشُ البَحّارَة في طَرَف المِيناء، بِجَذرِ البَحر — ب-ح-ر.',
      culturalNote: 'The root ب-ح-ر gave Arabic بَحر (sea), بُحيرَة (lake), and بَحّار (sailor). Arab navigators mapped the Indian Ocean trade routes 500 years before European explorers.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-port-2',
      type: 'inscription',
      x: 7, y: 3,
      labelArabic: 'نَقش',
      labelEnglish: "Sailor's Inscription",
      rootFamily: 'ب-ح-ر',
      rootFamilyEnglish: 'sea/ocean',
      rootWords: ['sea_w23', 'wind_w26', 'north_1', 'fish_animal_1'],
      descriptionEnglish: "A sailor's prayer inscription carved into a dockside stone, asking the sea to be merciful.",
      descriptionArabic: 'نَقشُ دُعاءِ البَحّارِ مَنقوشٌ في حَجَرِ الرَّصيف، يَسأَلُ البَحرَ الرَّحمَة.',
      culturalNote: 'The root ب-ح-ر gave Arabic بَحر (sea), بُحيرَة (lake), and بَحّار (sailor). Arab dhow sailors navigated the Indian Ocean for centuries using stars and monsoon winds.',
      repeatable: false,
      stateChange: 'discovered',
    },
    {
      id: 'inscription-port-3',
      type: 'inscription',
      x: 42, y: 30,
      labelArabic: 'نَقش',
      labelEnglish: "Navigator's Prayer",
      rootFamily: 'ح-ف-ظ',
      rootFamilyEnglish: 'protection/preservation',
      rootWords: ['fish_1', 'meat_1', 'near_1', 'east_1'],
      descriptionEnglish: 'A navigator\'s protective prayer carved on the harbour wall at the water\'s edge.',
      descriptionArabic: 'دُعاءُ المَلّاحِ الوِقائي مَنقوشٌ على جِدارِ المِيناء عِندَ الماء.',
      culturalNote: 'The root ح-ف-ظ gave Arabic حَفِظَ (to protect/memorise), حافِظ (protector/one who memorises), and حِفظ (preservation). Memorising sacred texts for divine protection is a core Islamic practice.',
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'port-to-mountain',
      edge: 'west',
      tileRange: [15, 19],
      targetZone: 'mountain_village',
      targetEntry: 'from_port',
      label: 'Mountain Village',
      labelArabic: 'قَرية الجَبَل',
    },
    {
      id: 'port-to-palace',
      edge: 'north',
      tileRange: [19, 25],
      targetZone: 'royal_palace',
      targetEntry: 'from_port',
      label: 'Royal Palace',
      labelArabic: 'القَصر المَلَكي',
    },
  ],

  unlock: { quest: 'mountain_wisdom', minLevel: 17, minWords: 1200 },

  defaultWeather: 'rain',
  battleBackground: 'bg-port',

  entries: {
    from_mountain: { x: 3, y: 17 },
    from_palace: { x: 22, y: 3 },
  },
};

// ============================================================
// ZONE 8: Royal Palace (50×40)
// ============================================================

function buildPalaceMap() {
  const W = 50, H = 40;
  const m = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      let tile = GRASS;
      // Palace courtyard — stone (sand tile)
      if (x >= 15 && x <= 35 && y >= 10 && y <= 30) tile = SAND;
      // Inner garden
      if (x >= 20 && x <= 30 && y >= 15 && y <= 25) tile = GRASS;
      // Central fountain
      if (x >= 23 && x <= 27 && y >= 18 && y <= 22) tile = WATER;
      // Grand entrance path
      if (x >= 23 && x <= 27 && y >= 30 && y <= 39) tile = SAND;
      // Side gardens
      if (x >= 5 && x <= 12 && y >= 12 && y <= 28) tile = GRASS;
      if (x >= 38 && x <= 45 && y >= 12 && y <= 28) tile = GRASS;
      // Outer walls (ice grass for marble look)
      if (y <= 3 || y >= 37 || x <= 2 || x >= 47) tile = ICE_GRASS;
      row.push(tile);
    }
    m.push(row);
  }
  return m;
}

const royal_palace = {
  id: 'royal_palace',
  tilesetTheme: 'desert',
  name: 'Royal Palace',
  nameArabic: 'القَصر المَلَكي',
  mapWidth: 50,
  mapHeight: 40,
  buildMap: buildPalaceMap,
  spawnPoint: { x: 25, y: 37 },
  vocabCategories: ['adjectives', 'colors', 'phrases'],
  gatheringSpots: true,

  objects: [
    // Palace structures — temple structures (BLDG-02/BLDG-07)
    { key: 'kenmi-desert-temple-desert-temple', x: 20, y: 8, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-temple-desert-temple', x: 30, y: 8, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-houses-desert-house-3.4', x: 15, y: 15, collide: true, collideW: 240, collideH: 100 },
    { key: 'kenmi-desert-houses-desert-house-4.3', x: 35, y: 15, collide: true, collideW: 240, collideH: 100 },
    // Palace walls / obelisk pillars
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 15, y: 10, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 35, y: 10, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 15, y: 20, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 35, y: 20, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 15, y: 30, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 35, y: 30, collide: true, collideW: 20, collideH: 20 },
    // Grand gate
    { key: 'kenmi-desert-temple-desert-obelisk-1', x: 25, y: 30, collide: true, collideW: 120, collideH: 40 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 22, y: 30, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-small-1', x: 28, y: 30, collide: true, collideW: 20, collideH: 20 },
    // Garden trees
    { key: 'kenmi-desert-props-acacia-tree', x: 7, y: 15, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 7, y: 25, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 42, y: 15, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-acacia-tree', x: 42, y: 25, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 22, y: 16, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 28, y: 16, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 22, y: 24, collide: true, collideW: 40, collideH: 20 },
    { key: 'kenmi-desert-props-ambarakaman-plant', x: 28, y: 24, collide: true, collideW: 40, collideH: 20 },
    // Palms in outer gardens
    { key: 'kenmi-desert-props-palm-tree-1', x: 9, y: 13, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 41, y: 13, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 9, y: 27, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-palm-tree-1', x: 41, y: 27, collide: true, collideW: 30, collideH: 20 },
    // Rocks at edges
    { key: 'kenmi-desert-props-desert-rocks', x: 5, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 44, y: 5, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 5, y: 35, collide: true, collideW: 30, collideH: 20 },
    { key: 'kenmi-desert-props-desert-rocks', x: 44, y: 35, collide: true, collideW: 30, collideH: 20 },
    // DECO-04: Large obelisks at grand gate + golden pots at central fountain
    { key: 'kenmi-desert-temple-desert-obelisk-2', x: 20, y: 30, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-temple-desert-obelisk-2', x: 30, y: 30, collide: true, collideW: 20, collideH: 20 },
    { key: 'kenmi-desert-props-golden-pots', x: 23, y: 20, collide: false },
    { key: 'kenmi-desert-props-golden-pots', x: 27, y: 20, collide: false },
    // DECO-05: NPC-adjacent props (Vizier Abbas 25,13; Princess Aisha 20,20; Poet Rumi 30,20)
    { key: 'kenmi-desert-props-desert-rugs', x: 26, y: 14, collide: false },
    { key: 'kenmi-desert-props-sleeping-mat', x: 19, y: 21, collide: false },
    { key: 'kenmi-desert-props-golden-pots', x: 31, y: 21, collide: false },
  ],

  npcs: [
    { id: 'vizier-abbas', key: 'npc-vizier-abbas', name: 'Vizier Abbas', nameArabic: 'الوَزير عَبّاس', x: 25, y: 13 },
    { id: 'princess-aisha', key: 'npc-princess-aisha', name: 'Princess Aisha', nameArabic: 'الأَميرَة عائِشَة', x: 20, y: 20 },
    { id: 'poet-rumi', key: 'npc-poet-rumi', name: 'Poet Rumi', nameArabic: 'الشّاعِر الرّومي', x: 30, y: 20 },
    { id: 'imam-muhammad', key: 'npc-imam-muhammad', name: 'Imam Muhammad', nameArabic: 'الإمام مُحَمَّد', x: 8, y: 20 },
  ],

  interactables: [
    { id: 'sign-palace', type: 'sign', x: 25, y: 36, textArabic: 'القَصر المَلَكي', textEnglish: 'The Royal Palace' },
    { id: 'sign-throne', type: 'sign', x: 25, y: 11, textArabic: 'قاعَة العَرش', textEnglish: 'Throne Room' },
    { id: 'sign-garden', type: 'sign', x: 20, y: 16, textArabic: 'الحَديقَة', textEnglish: 'The Garden' },
    { id: 'bookshelf-palace-adj', type: 'bookshelf', x: 17, y: 10, category: 'adjectives' },
    { id: 'bookshelf-palace-colors', type: 'bookshelf', x: 33, y: 10, category: 'colors' },
    { id: 'bookshelf-palace-phrases', type: 'bookshelf', x: 25, y: 17, category: 'phrases' },
    { id: 'chest-palace-throne', type: 'chest', x: 25, y: 9, minDirhams: 60, maxDirhams: 200 },
    { id: 'chest-palace-garden', type: 'chest', x: 43, y: 20, minDirhams: 50, maxDirhams: 180 },
    { id: 'door-palace-throne', type: 'door', x: 25, y: 12, interiorId: 'palace_throne_interior', locked: true, lockMessage: 'The throne room requires an audience with the Vizier.', unlockFlag: 'palace_audience_granted', labelArabic: 'قاعَة العَرش', labelEnglish: 'Throne Room' },
    // --- Phase 23: Interactive Objects ---
    { id: 'fountain-palace-1', type: 'fountain', x: 25, y: 20, labelArabic: 'نافورة', labelEnglish: 'Royal Fountain', descriptionEnglish: 'A magnificent central fountain surrounded by marble, its waters sparkling in the sunlight.', descriptionArabic: 'نافورة ملكية رائعة محاطة بالرخام.', culturalNote: 'Palace fountains in Islamic architecture represent paradise (jannah), with gardens built around four water channels.', vocabWordId: 'excuse_me_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'fountain-palace-2', type: 'fountain', x: 8, y: 18, labelArabic: 'نافورة', labelEnglish: 'Garden Fountain', descriptionEnglish: 'A small fountain in the west garden, its gentle sound soothing visiting dignitaries.', vocabWordId: 'color_white', vocabCategory: 'colors', repeatable: true },
    { id: 'painting-palace-1', type: 'painting', x: 18, y: 11, labelArabic: 'لوحة', labelEnglish: 'Royal Portrait', descriptionEnglish: 'A grand portrait of the palace founder, adorned in gold and lapis lazuli.', culturalNote: 'Lapis lazuli was imported from Afghanistan and prized across the Islamic world for its vivid blue colour.', vocabWordId: 'color_golden', vocabCategory: 'colors', repeatable: true },
    { id: 'painting-palace-2', type: 'painting', x: 32, y: 11, labelArabic: 'لوحة', labelEnglish: 'Battle Painting', descriptionEnglish: 'A sweeping painting of a great battle with horses, banners, and desert dunes.', vocabWordId: 'brave_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'painting-palace-3', type: 'painting', x: 25, y: 23, labelArabic: 'لوحة', labelEnglish: 'Garden Mosaic', descriptionEnglish: 'An intricate mosaic panel depicting flowers, birds, and flowing water in the garden.', culturalNote: 'Islamic geometric art avoids depicting living beings, instead celebrating nature through patterns and arabesques.', vocabWordId: 'color_red', vocabCategory: 'colors', repeatable: true },
    { id: 'painting-palace-4', type: 'painting', x: 40, y: 18, labelArabic: 'لوحة', labelEnglish: 'Calligraphy Panel', descriptionEnglish: 'A stunning calligraphy panel with gold leaf, displaying a poem about wisdom and justice.', vocabWordId: 'good_morning_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'lantern-palace-1', type: 'lantern', x: 16, y: 28, labelArabic: 'فانوس', labelEnglish: 'Ornate Lantern', descriptionEnglish: 'A jewel-encrusted lantern of hammered brass casting intricate shadow patterns on the courtyard walls.', culturalNote: 'Mashrabiya lanterns create geometric light patterns, a signature of Islamic decorative arts.', vocabWordId: 'color_purple', vocabCategory: 'colors', repeatable: true },
    { id: 'lantern-palace-2', type: 'lantern', x: 34, y: 28, labelArabic: 'فانوس', labelEnglish: 'Ornate Lantern', descriptionEnglish: 'A matching ornate lantern on the eastern side of the grand gate.', vocabWordId: 'color_silver', vocabCategory: 'colors', repeatable: true },
    { id: 'lantern-palace-3', type: 'lantern', x: 25, y: 33, labelArabic: 'فانوس', labelEnglish: 'Entrance Lantern', descriptionEnglish: 'A tall golden lantern illuminating the grand entrance path to the palace.', vocabWordId: 'goodbye_1', vocabCategory: 'phrases', repeatable: true },
    { id: 'statue-palace-1', type: 'statue', x: 20, y: 28, labelArabic: 'تمثال', labelEnglish: 'Lion Statue', descriptionEnglish: 'A majestic stone lion guarding the west side of the grand gate.', culturalNote: 'Lions symbolise power and sovereignty in Islamic art, often guarding palace entrances.', vocabWordId: 'big_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'statue-palace-2', type: 'statue', x: 30, y: 28, labelArabic: 'تمثال', labelEnglish: 'Lion Statue', descriptionEnglish: 'A matching lion statue guarding the east side of the grand gate.', vocabWordId: 'tall_1', vocabCategory: 'adjectives', repeatable: true },
    { id: 'crate-palace-1', type: 'crate', x: 6, y: 15, labelArabic: 'صندوق', labelEnglish: 'Treasure Crate', descriptionEnglish: 'A gilded crate containing tribute gifts from distant provinces: gold, jewels, and silk.', vocabWordId: 'color_yellow', vocabCategory: 'colors', loot: { type: 'dirhams', min: 20, max: 50 }, repeatable: false, stateChange: 'inspected' },
    { id: 'crate-palace-2', type: 'crate', x: 44, y: 15, labelArabic: 'صندوق', labelEnglish: 'Treasure Crate', descriptionEnglish: 'Another tribute crate, this one filled with rare manuscripts and astronomical instruments.', vocabWordId: 'i_speak_arabic_1', vocabCategory: 'phrases', loot: { type: 'dirhams', min: 25, max: 60 }, repeatable: false, stateChange: 'inspected' },
    { id: 'pot-palace-1', type: 'pot', x: 21, y: 17, labelArabic: 'قِدر', labelEnglish: 'Rose Water Pot', descriptionEnglish: 'A pot of rose water used to perfume the palace gardens and receiving halls.', culturalNote: 'Rose water (ma ward) has been distilled in the Arab world since the 8th century.', vocabWordId: 'color_pink', vocabCategory: 'colors', repeatable: true },
    { id: 'pot-palace-2', type: 'pot', x: 29, y: 17, labelArabic: 'قِدر', labelEnglish: 'Incense Pot', descriptionEnglish: 'A pot burning oud incense, filling the garden with a rich, woody fragrance.', culturalNote: 'Oud (agarwood) is called "liquid gold" in the Arab world and has been prized for over 3000 years.', vocabWordId: 'good_evening_1', vocabCategory: 'phrases', repeatable: true },
    // --- Phase 45: Hidden inscription (root family discovery) ---
    {
      id: 'inscription-palace-1',
      type: 'inscription',
      x: 2, y: 37,
      labelArabic: 'نَقش',
      labelEnglish: 'Ancient Inscription',
      rootFamily: 'م-ل-ك',
      rootFamilyEnglish: 'kingdom',
      rootWords: ['big_1', 'old_1', 'new_1', 'brave_1'],
      descriptionEnglish: 'A royal inscription hidden in the palace outer garden, bearing the root of kingship — م-ل-ك — the root behind king, kingdom, angel, and possession in Arabic.',
      descriptionArabic: 'نَقشٌ مَلَكي في حَديقَةِ القَصرِ الخارِجيَّة، بِجَذرِ المُلك — م-ل-ك.',
      culturalNote: 'The root م-ل-ك gave Arabic مَلِك (king), مَملَكَة (kingdom), مَلَك (angel), and مَلَكَ (to possess). The Abbasid Caliphate at its peak governed from Central Asia to North Africa.',
      repeatable: false,
      stateChange: 'discovered',
    },
    // --- Phase 54: New inscriptions (ENVR-01) ---
    {
      id: 'inscription-palace-2',
      type: 'inscription',
      x: 47, y: 20,
      labelArabic: 'نَقش',
      labelEnglish: 'Justice Inscription',
      rootFamily: 'ح-ك-م',
      rootFamilyEnglish: 'ruling/wisdom',
      rootWords: ['big_1', 'old_1', 'brave_1', 'tall_1'],
      descriptionEnglish: 'A royal inscription on the east garden wall, carved with a decree about just governance.',
      descriptionArabic: 'نَقشٌ مَلَكي على جِدارِ الحَديقَةِ الشَّرقيَّة، مَنقوشٌ بِمَرسومٍ عَن العَدل.',
      culturalNote: "The root ح-ك-م gave Arabic حَكَمَ (to rule/judge), حُكم (ruling/wisdom), حَكيم (wise one), and حِكمَة (wisdom). The concept of 'hukm' encompasses both governance and divine decree.",
      repeatable: false,
      stateChange: 'discovered',
      useInk: true,
      inkFile: 'inscription-palace',
    },
    {
      id: 'inscription-palace-3',
      type: 'inscription',
      x: 47, y: 38,
      labelArabic: 'نَقش',
      labelEnglish: 'Royal Decree',
      rootFamily: 'ع-د-ل',
      rootFamilyEnglish: 'justice/equality',
      rootWords: ['brave_1', 'big_1', 'i_speak_arabic_1', 'color_golden'],
      descriptionEnglish: 'A royal decree inscription at the palace outer wall, proclaiming knowledge available to all.',
      descriptionArabic: 'نَقشُ مَرسومٍ مَلَكي على الجِدارِ الخارِجي للقَصر، يُعلِنُ العِلمَ لِلجَميع.',
      culturalNote: "The root ع-د-ل gave Arabic عَدَلَ (to be just), عَدل (justice), عادِل (just/fair). The 'Scales of Justice' symbol appears in Islamic jurisprudence (fiqh) representing divine balance.",
      repeatable: false,
      stateChange: 'discovered',
    },
  ],

  exits: [
    {
      id: 'palace-to-port',
      edge: 'south',
      tileRange: [22, 28],
      targetZone: 'coastal_port',
      targetEntry: 'from_palace',
      label: 'Coastal Port',
      labelArabic: 'المِيناء',
    },
  ],

  unlock: { quest: 'port_of_knowledge', minLevel: 20, minWords: 1600 },

  defaultWeather: 'clear',
  battleBackground: 'bg-palace',

  entries: {
    from_port: { x: 25, y: 37 },
  },
};

// ============================================================
// ZONE REGISTRY
// ============================================================



import { realWorldZones } from './zones/realWorldZones.js';
import { fantasyZones } from './zones/fantasyZones.js';

export const ZONES = {
  oasis_village,
  ancient_library,
  desert_marketplace,
  farmland,
  bedouin_camp,
  mountain_village,
  coastal_port,
  royal_palace,
  ...realWorldZones,
  ...fantasyZones,
};

// Ordered list for world map rendering
export const ZONE_ORDER = [
  // Initial 8 Zones
  'oasis_village',
  'ancient_library',
  'desert_marketplace',
  'farmland',
  'bedouin_camp',
  'mountain_village',
  'coastal_port',
  'royal_palace',
  // Real World Zones
  'baghdad',
  'cordoba',
  'timbuktu',
  'damascus',
  'cairo',
  'fez',
  'samarkand',
  'granada',
  // Fantasy Zones
  'star_oasis',
  'mountain_of_words',
  'sea_of_ink',
  'forest_of_tales',
  'desert_of_silence',
  'merchants_island',
  'fortress_of_secrets',
  'garden_of_spirits',
];

// Tile type constants for external use

