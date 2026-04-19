/**
 * divergentPaths.js — Faction-specific experience paths (Phase 76: NAR-01)
 *
 * Defines how gameplay diverges based on the player's primary faction.
 * Each faction gets:
 * - A unique narrative perspective/theme
 * - 8 zone-specific story variations (different NPC interactions per zone)
 * - A 5-quest chain telling a coherent faction story
 * - Unique zone entry descriptions (Arabic + English)
 *
 * Total content: 6 paths, 48 zone variations, 30 quests
 */

import { FACTION_IDS } from './factions.js';

// ─────────────────────────────────────────────────────────────────────────────
// Zone IDs (matching existing zone data)
// ─────────────────────────────────────────────────────────────────────────────

const ZONES = {
  OASIS_VILLAGE: 'oasis-village',
  ANCIENT_LIBRARY: 'ancient-library',
  DESERT_MARKETPLACE: 'desert-marketplace',
  BEDOUIN_CAMP: 'bedouin-camp',
  ROYAL_PALACE: 'royal-palace',
  MOUNTAIN_PASS: 'mountain-pass',
  COASTAL_PORT: 'coastal-port',
  HIDDEN_OASIS: 'hidden-oasis',
};

// ─────────────────────────────────────────────────────────────────────────────
// DIVERGENT_PATHS — one entry per faction
// ─────────────────────────────────────────────────────────────────────────────

export const DIVERGENT_PATHS = Object.freeze({

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHOLARS — The Pursuit of Knowledge
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.SCHOLARS]: {
    theme: 'The Pursuit of Knowledge',
    themeArabic: 'طلب العلم',
    description:
      'Your scholarly reputation opens doors to ancient libraries and hidden manuscripts. ' +
      'Scribes seek your counsel, and librarians trust you with their rarest volumes.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'أهل القرية يشيرون إليك باحترام — لقد سمعوا عن علمك',
          english: 'The villagers gesture to you with respect — they have heard of your learning.',
        },
        availableNpcs: ['scholar-yusuf', 'elder-tariq'],
        hiddenInteractions: ['ancient_scroll_discovery', 'grammar_debate'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'أمين المكتبة يفتح لك الباب الخلفي — المخطوطات النادرة بانتظارك',
          english: 'The librarian opens the back door for you — the rare manuscripts await.',
        },
        availableNpcs: ['librarian-ibrahim', 'scribe-amina'],
        hiddenInteractions: ['restricted_archive_access', 'manuscript_restoration'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'بائع الكتب القديمة يلوّح لك — لديه شيء خاص لعالِم مثلك',
          english: 'The old bookseller waves to you — he has something special for a scholar like you.',
        },
        availableNpcs: ['trader-hassan', 'carpet-seller-jamal'],
        hiddenInteractions: ['rare_book_auction', 'scholarly_debate_circle'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'شيخ القبيلة يدعوك لتقرأ النجوم معه الليلة',
          english: 'The tribal elder invites you to read the stars with him tonight.',
        },
        availableNpcs: ['elder-tariq', 'storyteller-noor'],
        hiddenInteractions: ['oral_history_recording', 'desert_astronomy_lesson'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'الوزير يطلب رأيك في ترجمة رسالة دبلوماسية مهمة',
          english: 'The vizier seeks your opinion on translating an important diplomatic letter.',
        },
        availableNpcs: ['vizier-abbas', 'princess-aisha'],
        hiddenInteractions: ['royal_library_tour', 'diplomatic_translation'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'نقش قديم على الصخور — ربما تستطيع قراءته بفضل علمك',
          english: 'An ancient inscription on the rocks — perhaps your learning can decipher it.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['petroglph_deciphering', 'hermit_philosophy_exchange'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'بحّار يحمل خريطة بكتابة غريبة — يبحث عن عالِم لقراءتها',
          english: 'A sailor carries a map with strange writing — he searches for a scholar to read it.',
        },
        availableNpcs: ['captain-rashid', 'dockmaster-nadia'],
        hiddenInteractions: ['foreign_script_analysis', 'maritime_lexicon_study'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'بين أشجار النخيل، تلمع صفحات مخطوطة منسية',
          english: 'Among the palm trees, the pages of a forgotten manuscript glimmer.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['lost_treatise_recovery', 'botanical_arabic_study'],
      },
    },

    questChain: [
      {
        id: 'scholars_path_1',
        title: 'The First Manuscript',
        titleArabic: 'المخطوطة الأولى',
        description: 'Scholar Yusuf speaks of a missing page from the Oasis Village chronicle. Search the elder\'s collection for clues.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_scholars_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 40 },
      },
      {
        id: 'scholars_path_2',
        title: 'The Librarian\'s Cipher',
        titleArabic: 'شيفرة أمين المكتبة',
        description: 'Ibrahim has found a coded letter in the Ancient Library. Decode three Arabic riddles to unlock its message.',
        zone: 'ancient-library',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_scholars_2',
        prerequisites: ['scholars_path_1'],
        reward: { xp: 180, dirhams: 55 },
      },
      {
        id: 'scholars_path_3',
        title: 'Ink and Starlight',
        titleArabic: 'حبر وضوء النجوم',
        description: 'The Bedouin elders guard an oral poem that has never been written down. Transcribe it before its last keeper passes.',
        zone: 'bedouin-camp',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_scholars_3',
        prerequisites: ['scholars_path_2'],
        reward: { xp: 250, dirhams: 70 },
      },
      {
        id: 'scholars_path_4',
        title: 'The Palace Translation',
        titleArabic: 'ترجمة القصر',
        description: 'The vizier needs an ancient treaty translated from classical Arabic. Your accuracy will decide a kingdom\'s fate.',
        zone: 'royal-palace',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_scholars_4',
        prerequisites: ['scholars_path_3'],
        reward: { xp: 320, dirhams: 90 },
      },
      {
        id: 'scholars_path_5',
        title: 'The Complete Chronicle',
        titleArabic: 'السجل الكامل',
        description: 'Unite every fragment you have gathered into a single chronicle — the definitive history of these lands, in your own Arabic words.',
        zone: 'ancient-library',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_scholars_5',
        prerequisites: ['scholars_path_4'],
        reward: { xp: 500, dirhams: 150 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANTS — The Way of Trade
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.MERCHANTS]: {
    theme: 'The Way of Trade',
    themeArabic: 'طريق التجارة',
    description:
      'Your reputation as a shrewd trader precedes you. Market stalls lower prices, ' +
      'caravan leaders share their routes, and smugglers whisper deals in your ear.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'الباعة يرفعون أصواتهم عند وصولك — المنافسة تشتد',
          english: 'The vendors raise their voices as you arrive — the competition heats up.',
        },
        availableNpcs: ['merchant-fatima', 'baker-yasmin'],
        hiddenInteractions: ['wholesale_deal_negotiation', 'supply_chain_mapping'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'حتى المكتبة لها سوقها — مخطوطات نادرة بأسعار لا يعرفها إلا التجار',
          english: 'Even the library has its market — rare manuscripts at prices only traders know.',
        },
        availableNpcs: ['librarian-ibrahim', 'scribe-amina'],
        hiddenInteractions: ['manuscript_appraisal', 'ink_trade_ledger'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'هذا عالمك — كل ركن فيه فرصة، وكل صوت فيه صفقة',
          english: 'This is your world — every corner holds opportunity, every voice a deal.',
        },
        availableNpcs: ['spice-seller-layla', 'trader-hassan', 'weaver-zahra'],
        hiddenInteractions: ['black_market_access', 'price_war_arbitration'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'البدو يستقبلونك كتاجر محترم — القهوة جاهزة والبضائع معروضة',
          english: 'The Bedouin receive you as a respected trader — coffee is ready and goods laid out.',
        },
        availableNpcs: ['elder-tariq', 'storyteller-noor'],
        hiddenInteractions: ['camel_trade_negotiation', 'desert_salt_route'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'القصر بحاجة لمورّد ذكي — الوزير ينتظر عرضك',
          english: 'The palace needs a clever supplier — the vizier awaits your bid.',
        },
        availableNpcs: ['vizier-abbas', 'princess-aisha'],
        hiddenInteractions: ['royal_contract_bid', 'treasury_audit'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'الممر الجبلي مليء بالمعادن النادرة — عين التاجر ترى الذهب في الصخور',
          english: 'The mountain pass is rich with rare minerals — a trader\'s eye sees gold in the rocks.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['mineral_prospecting', 'mountain_toll_negotiation'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'سفن التجارة ترسو — حمولات من الحرير والتوابل تنتظر من يشتريها',
          english: 'Trade ships dock — cargoes of silk and spice await a buyer.',
        },
        availableNpcs: ['captain-rashid', 'fishmonger-hana', 'dockmaster-nadia'],
        hiddenInteractions: ['import_manifest_review', 'shipping_route_investment'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'واحة مخفية — المكان المثالي لمستودع سري',
          english: 'A hidden oasis — the perfect place for a secret warehouse.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['rare_herb_monopoly', 'oasis_trade_post_founding'],
      },
    },

    questChain: [
      {
        id: 'merchants_path_1',
        title: 'The First Bargain',
        titleArabic: 'الصفقة الأولى',
        description: 'Merchant Fatima challenges you to negotiate a bulk purchase using proper Arabic trade phrases. Beat her price.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_merchants_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 60 },
      },
      {
        id: 'merchants_path_2',
        title: 'The Spice Route Ledger',
        titleArabic: 'دفتر طريق التوابل',
        description: 'Layla\'s spice ledger is written in old Arabic numerals. Decode three entries to trace a lost trade route.',
        zone: 'desert-marketplace',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_merchants_2',
        prerequisites: ['merchants_path_1'],
        reward: { xp: 180, dirhams: 80 },
      },
      {
        id: 'merchants_path_3',
        title: 'Harbour Deal',
        titleArabic: 'صفقة المرفأ',
        description: 'Captain Rashid has a cargo of silk but no buyer. Negotiate the sale in Arabic and take your commission.',
        zone: 'coastal-port',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_merchants_3',
        prerequisites: ['merchants_path_2'],
        reward: { xp: 250, dirhams: 100 },
      },
      {
        id: 'merchants_path_4',
        title: 'The Royal Tender',
        titleArabic: 'المناقصة الملكية',
        description: 'The palace seeks a supplier for the annual feast. Draft a formal Arabic proposal and outbid your rivals.',
        zone: 'royal-palace',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_merchants_4',
        prerequisites: ['merchants_path_3'],
        reward: { xp: 320, dirhams: 120 },
      },
      {
        id: 'merchants_path_5',
        title: 'The Trade Empire',
        titleArabic: 'إمبراطورية التجارة',
        description: 'Establish a trade network spanning all eight zones. Sign contracts in Arabic with a representative in each region.',
        zone: 'desert-marketplace',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_merchants_5',
        prerequisites: ['merchants_path_4'],
        reward: { xp: 500, dirhams: 200 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISANS — The Craftsman's Way
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.ARTISANS]: {
    theme: 'The Craftsman\'s Way',
    themeArabic: 'طريق الحرفي',
    description:
      'Your hands speak the language of craft. Blacksmiths share forging secrets, ' +
      'weavers invite you to their looms, and architects reveal hidden blueprints.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'رائحة الخشب المنشور والحديد الساخن تستقبلك — الورشة مفتوحة لك',
          english: 'The scent of sawn wood and hot iron greets you — the workshop is open.',
        },
        availableNpcs: ['baker-yasmin', 'farmer-omar'],
        hiddenInteractions: ['village_workshop_access', 'irrigation_design'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'مخطوطات هندسية قديمة — أسرار البناء التي شيّدت المدن',
          english: 'Ancient engineering manuscripts — the building secrets that raised cities.',
        },
        availableNpcs: ['librarian-ibrahim', 'scribe-amina'],
        hiddenInteractions: ['architecture_blueprint_study', 'geometric_pattern_archive'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'صوت المطارق يعلو من زقاق الحدادين — هنا يولد الفن من النار',
          english: 'The sound of hammers rises from the smiths\' alley — here art is born from fire.',
        },
        availableNpcs: ['weaver-zahra', 'carpet-seller-jamal'],
        hiddenInteractions: ['master_loom_trial', 'metalwork_commission'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'خيام البدو مصنوعة يدويًا — كل خيط يحكي قصة',
          english: 'Bedouin tents are handmade — every thread tells a story.',
        },
        availableNpcs: ['elder-tariq'],
        hiddenInteractions: ['tent_weaving_lesson', 'saddle_repair_challenge'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'فسيفساء القصر تحتاج ترميمًا — يداك هما الأمل',
          english: 'The palace mosaics need restoration — your hands are the hope.',
        },
        availableNpcs: ['vizier-abbas', 'princess-aisha'],
        hiddenInteractions: ['mosaic_restoration_project', 'royal_forge_access'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'صخور الجبل غنية بالمعادن — المادة الخام لتحفتك القادمة',
          english: 'The mountain rock is rich with ore — raw material for your next masterpiece.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['ore_extraction_technique', 'mountain_forge_discovery'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'حوض بناء السفن يحتاج نجّارًا ماهرًا — السفينة نصف مكتملة',
          english: 'The shipyard needs a skilled carpenter — the ship is half-complete.',
        },
        availableNpcs: ['blacksmith-daud', 'dockmaster-nadia'],
        hiddenInteractions: ['shipbuilding_commission', 'anchor_forging'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'طين الواحة مثالي للفخار — خامات لم يمسها أحد من قبل',
          english: 'The oasis clay is perfect for pottery — untouched raw material.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['clay_harvesting', 'natural_dye_extraction'],
      },
    },

    questChain: [
      {
        id: 'artisans_path_1',
        title: 'The Apprentice\'s Tool',
        titleArabic: 'أداة المتدرب',
        description: 'Learn the Arabic names of ten essential tools in the village workshop. A craftsman must name his instruments.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_artisans_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 40 },
      },
      {
        id: 'artisans_path_2',
        title: 'The Weaver\'s Pattern',
        titleArabic: 'نقش النسّاجة',
        description: 'Zahra challenges you to describe a geometric carpet pattern using Arabic shape and colour vocabulary.',
        zone: 'desert-marketplace',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_artisans_2',
        prerequisites: ['artisans_path_1'],
        reward: { xp: 180, dirhams: 55 },
      },
      {
        id: 'artisans_path_3',
        title: 'Fire and Steel',
        titleArabic: 'نار وفولاذ',
        description: 'Blacksmith Daud at the coastal port teaches you Damascus steel forging. Follow his Arabic instructions precisely.',
        zone: 'coastal-port',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_artisans_3',
        prerequisites: ['artisans_path_2'],
        reward: { xp: 250, dirhams: 70 },
      },
      {
        id: 'artisans_path_4',
        title: 'The Palace Mosaic',
        titleArabic: 'فسيفساء القصر',
        description: 'Restore a crumbling mosaic in the royal palace. Each tile must be described in Arabic before it can be placed.',
        zone: 'royal-palace',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_artisans_4',
        prerequisites: ['artisans_path_3'],
        reward: { xp: 320, dirhams: 90 },
      },
      {
        id: 'artisans_path_5',
        title: 'The Master\'s Mark',
        titleArabic: 'علامة الأستاذ',
        description: 'Create your masterwork — a single piece that combines every craft you have learned. Inscribe it with your Arabic name.',
        zone: 'mountain-pass',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_artisans_5',
        prerequisites: ['artisans_path_4'],
        reward: { xp: 500, dirhams: 150 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TRAVELERS — The Road Between Worlds
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.TRAVELERS]: {
    theme: 'The Road Between Worlds',
    themeArabic: 'الطريق بين العوالم',
    description:
      'Every horizon calls your name. Guides share secret paths, cartographers ' +
      'reveal uncharted territories, and caravans welcome you as one of their own.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'القرية محطة على طريقك — يستقبلونك كمسافر عائد لا كغريب',
          english: 'The village is a stop on your road — they greet you as a returning traveler, not a stranger.',
        },
        availableNpcs: ['guide-salim', 'stable-master-yara'],
        hiddenInteractions: ['caravan_schedule_access', 'shortcut_discovery'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'خرائط قديمة تملأ الرفوف — طرق لم يسلكها أحد منذ قرون',
          english: 'Ancient maps fill the shelves — routes no one has walked for centuries.',
        },
        availableNpcs: ['librarian-ibrahim', 'astronomer-zain'],
        hiddenInteractions: ['ancient_route_mapping', 'celestial_navigation_texts'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'تجار من أراضٍ بعيدة يتبادلون أخبار الطرق — وأنت أكثرهم خبرة',
          english: 'Traders from distant lands exchange road news — and you are the most experienced among them.',
        },
        availableNpcs: ['wanderer-ali', 'spice-seller-layla'],
        hiddenInteractions: ['traveler_intelligence_exchange', 'desert_shortcut_map'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'البدو يعرفون وجهك — أنت من أبناء الطريق مثلهم',
          english: 'The Bedouin know your face — you are a child of the road, like them.',
        },
        availableNpcs: ['elder-tariq', 'storyteller-noor'],
        hiddenInteractions: ['nomad_path_initiation', 'desert_survival_wisdom'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'القصر يحتاج رسولًا يعرف الطرق — لا أحد أنسب منك',
          english: 'The palace needs a messenger who knows the roads — no one is more suited than you.',
        },
        availableNpcs: ['vizier-abbas', 'princess-aisha'],
        hiddenInteractions: ['royal_courier_mission', 'diplomatic_envoy_briefing'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'الممر الجبلي خطير لمن لا يعرفه — لكنك تعرف كل صخرة فيه',
          english: 'The mountain pass is dangerous for those who do not know it — but you know every rock.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['hidden_pass_revelation', 'altitude_navigation_lesson'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'البحر طريق آخر — والبحّارة هنا يحترمون من يعرف الأرض والماء معًا',
          english: 'The sea is another road — and the sailors here respect those who know both land and water.',
        },
        availableNpcs: ['captain-rashid', 'dockmaster-nadia'],
        hiddenInteractions: ['sea_route_charting', 'tide_prediction_lesson'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'وجدتها — الواحة التي لا تظهر على أي خريطة',
          english: 'You found it — the oasis that appears on no map.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['uncharted_territory_naming', 'oasis_waypoint_marking'],
      },
    },

    questChain: [
      {
        id: 'travelers_path_1',
        title: 'The First Horizon',
        titleArabic: 'الأفق الأول',
        description: 'Guide Salim says a true traveler must name the four cardinal directions in Arabic before setting out. Prove yourself.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_travelers_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 40 },
      },
      {
        id: 'travelers_path_2',
        title: 'Stars Over Sand',
        titleArabic: 'نجوم فوق الرمال',
        description: 'The Bedouin navigate by stars. Learn the Arabic names of five guiding stars to earn your desert compass.',
        zone: 'bedouin-camp',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_travelers_2',
        prerequisites: ['travelers_path_1'],
        reward: { xp: 180, dirhams: 55 },
      },
      {
        id: 'travelers_path_3',
        title: 'The Mountain Crossing',
        titleArabic: 'عبور الجبل',
        description: 'The hermit Idris guards a pass through the mountains. Answer his Arabic riddles to earn passage.',
        zone: 'mountain-pass',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_travelers_3',
        prerequisites: ['travelers_path_2'],
        reward: { xp: 250, dirhams: 70 },
      },
      {
        id: 'travelers_path_4',
        title: 'The Seafarer\'s Tongue',
        titleArabic: 'لسان البحّار',
        description: 'Captain Rashid will only sail with those who speak the sea\'s language. Learn maritime Arabic vocabulary.',
        zone: 'coastal-port',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_travelers_4',
        prerequisites: ['travelers_path_3'],
        reward: { xp: 320, dirhams: 90 },
      },
      {
        id: 'travelers_path_5',
        title: 'The Complete Map',
        titleArabic: 'الخريطة الكاملة',
        description: 'Chart every zone in Arabic. Your map will be the definitive guide to these lands — written in the traveler\'s own hand.',
        zone: 'hidden-oasis',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_travelers_5',
        prerequisites: ['travelers_path_4'],
        reward: { xp: 500, dirhams: 150 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUARDIANS — The Shield's Oath
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.GUARDIANS]: {
    theme: 'The Shield\'s Oath',
    themeArabic: 'عهد الدرع',
    description:
      'Duty and honour define your path. Guards salute you at every gate, ' +
      'commanders trust your judgement, and the people sleep safely in your shadow.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'الحارس عند البوابة يرفع سيفه تحية — أنت واحد منهم',
          english: 'The guard at the gate raises his sword in salute — you are one of them.',
        },
        availableNpcs: ['guard-hamza', 'night-guard'],
        hiddenInteractions: ['gate_patrol_duty', 'night_watch_briefing'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'المعرفة سلاح أيضًا — الحراس الحقيقيون يحمون العلم كما يحمون الناس',
          english: 'Knowledge is also a weapon — true guardians protect learning as they protect people.',
        },
        availableNpcs: ['librarian-ibrahim', 'scribe-amina'],
        hiddenInteractions: ['library_security_review', 'guard_oath_archive'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'السوق يحتاج عيونًا يقظة — اللصوص يختبئون بين الباعة',
          english: 'The market needs watchful eyes — thieves hide among the vendors.',
        },
        availableNpcs: ['trader-hassan', 'wanderer-ali'],
        hiddenInteractions: ['market_patrol_mission', 'thief_investigation'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'البدو يعرفون قيمة الحارس — في الصحراء، القوة تعني البقاء',
          english: 'The Bedouin know the value of a guardian — in the desert, strength means survival.',
        },
        availableNpcs: ['elder-tariq'],
        hiddenInteractions: ['caravan_escort_duty', 'desert_defense_training'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'الحرس الملكي يفتح لك الطريق — أنت ضيف القائد الأعلى',
          english: 'The royal guard clears the way — you are the commander\'s guest.',
        },
        availableNpcs: ['vizier-abbas', 'princess-aisha'],
        hiddenInteractions: ['palace_guard_drill', 'royal_armory_inspection'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'الممر يحتاج حراسة — قطاع الطرق ينتظرون في الظلال',
          english: 'The pass needs guarding — bandits wait in the shadows.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['bandit_ambush_prevention', 'watchtower_establishment'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'الميناء خط الدفاع الأول — السفن المجهولة تقترب',
          english: 'The port is the first line of defense — unknown ships approach.',
        },
        availableNpcs: ['captain-rashid', 'dockmaster-nadia'],
        hiddenInteractions: ['port_security_assessment', 'maritime_defense_planning'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'مكان آمن يحتاج حارسًا — الواحة المخفية يجب أن تبقى سرًا',
          english: 'A safe place needs a guardian — the hidden oasis must remain secret.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['oasis_fortification', 'secret_entrance_guard'],
      },
    },

    questChain: [
      {
        id: 'guardians_path_1',
        title: 'The First Watch',
        titleArabic: 'الحراسة الأولى',
        description: 'Guard Hamza assigns your first night watch. Learn the Arabic commands needed to challenge approaching strangers.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_guardians_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 40 },
      },
      {
        id: 'guardians_path_2',
        title: 'The Market Thief',
        titleArabic: 'لص السوق',
        description: 'A pickpocket is terrorising the desert marketplace. Gather witness statements in Arabic and identify the culprit.',
        zone: 'desert-marketplace',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_guardians_2',
        prerequisites: ['guardians_path_1'],
        reward: { xp: 180, dirhams: 55 },
      },
      {
        id: 'guardians_path_3',
        title: 'The Mountain Ambush',
        titleArabic: 'كمين الجبل',
        description: 'Bandits block the mountain pass. Plan a counter-ambush using Arabic tactical vocabulary with the hermit Idris.',
        zone: 'mountain-pass',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_guardians_3',
        prerequisites: ['guardians_path_2'],
        reward: { xp: 250, dirhams: 70 },
      },
      {
        id: 'guardians_path_4',
        title: 'The Palace Shield',
        titleArabic: 'درع القصر',
        description: 'The vizier suspects a traitor in the royal guard. Interrogate suspects in formal Arabic and uncover the truth.',
        zone: 'royal-palace',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_guardians_4',
        prerequisites: ['guardians_path_3'],
        reward: { xp: 320, dirhams: 90 },
      },
      {
        id: 'guardians_path_5',
        title: 'The Guardian\'s Oath',
        titleArabic: 'قسم الحارس',
        description: 'Recite the ancient Guardian oath in classical Arabic before the assembled commanders. Your words will be remembered for generations.',
        zone: 'royal-palace',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_guardians_5',
        prerequisites: ['guardians_path_4'],
        reward: { xp: 500, dirhams: 150 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARTISTS — The Song of the Soul
  // ═══════════════════════════════════════════════════════════════════════════
  [FACTION_IDS.ARTISTS]: {
    theme: 'The Song of the Soul',
    themeArabic: 'أغنية الروح',
    description:
      'Beauty speaks through you. Poets share unfinished verses, musicians ' +
      'play secret melodies, and storytellers entrust you with tales untold.',

    zoneVariations: {
      [ZONES.OASIS_VILLAGE]: {
        entryText: {
          arabic: 'صوت العود يتسلل من بين البيوت — الليلة ليلة شعر',
          english: 'The sound of the oud slips between the houses — tonight is a night of poetry.',
        },
        availableNpcs: ['storyteller-noor', 'elder-tariq'],
        hiddenInteractions: ['village_poetry_circle', 'evening_oud_gathering'],
      },
      [ZONES.ANCIENT_LIBRARY]: {
        entryText: {
          arabic: 'دواوين الشعر القديمة تنتظر من يعيد إحياءها',
          english: 'Ancient poetry collections await someone to bring them back to life.',
        },
        availableNpcs: ['librarian-ibrahim', 'scribe-amina'],
        hiddenInteractions: ['lost_poem_reconstruction', 'calligraphy_art_session'],
      },
      [ZONES.DESERT_MARKETPLACE]: {
        entryText: {
          arabic: 'الراوي في زاوية السوق يجمع الناس حوله — قصة جديدة كل مساء',
          english: 'The storyteller in the market corner gathers crowds — a new tale every evening.',
        },
        availableNpcs: ['carpet-seller-jamal', 'weaver-zahra'],
        hiddenInteractions: ['marketplace_performance', 'tapestry_story_reading'],
      },
      [ZONES.BEDOUIN_CAMP]: {
        entryText: {
          arabic: 'نار المخيم تضيء — البدو ينتظرون من يغنّي لهم أغنية الصحراء',
          english: 'The campfire burns bright — the Bedouin wait for someone to sing them the desert song.',
        },
        availableNpcs: ['storyteller-noor', 'elder-tariq'],
        hiddenInteractions: ['campfire_storytelling', 'desert_song_composition'],
      },
      [ZONES.ROYAL_PALACE]: {
        entryText: {
          arabic: 'الأميرة ترعى الفنون — بلاطها مفتوح للشعراء والموسيقيين',
          english: 'The princess patronises the arts — her court is open to poets and musicians.',
        },
        availableNpcs: ['princess-aisha', 'vizier-abbas'],
        hiddenInteractions: ['royal_poetry_recital', 'court_musician_audition'],
      },
      [ZONES.MOUNTAIN_PASS]: {
        entryText: {
          arabic: 'صدى صوتك يتردد بين الجبال — المكان المثالي لأغنية',
          english: 'Your voice echoes between the mountains — the perfect place for a song.',
        },
        availableNpcs: ['mountain-hermit-idris'],
        hiddenInteractions: ['echo_song_recording', 'mountain_inspiration_verse'],
      },
      [ZONES.COASTAL_PORT]: {
        entryText: {
          arabic: 'البحّارة يغنّون عند المغيب — أغانيهم مليئة بالحنين',
          english: 'The sailors sing at sunset — their songs are full of longing.',
        },
        availableNpcs: ['captain-rashid', 'fishmonger-hana'],
        hiddenInteractions: ['sea_shanty_learning', 'harbour_melody_composition'],
      },
      [ZONES.HIDDEN_OASIS]: {
        entryText: {
          arabic: 'هدوء الواحة يفتح أبواب الإلهام — هنا تُولد القصائد',
          english: 'The silence of the oasis opens the doors of inspiration — here poems are born.',
        },
        availableNpcs: ['herbalist-maryam'],
        hiddenInteractions: ['nature_poetry_writing', 'oasis_lullaby_creation'],
      },
    },

    questChain: [
      {
        id: 'artists_path_1',
        title: 'The First Verse',
        titleArabic: 'البيت الأول',
        description: 'Storyteller Noor asks you to compose your first line of Arabic poetry. Choose your words carefully — every syllable matters.',
        zone: 'oasis-village',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_artists_1',
        prerequisites: [],
        reward: { xp: 120, dirhams: 40 },
      },
      {
        id: 'artists_path_2',
        title: 'The Lost Melody',
        titleArabic: 'اللحن المفقود',
        description: 'A sailor at the port hums a melody but cannot remember the Arabic lyrics. Reconstruct the song from fragments.',
        zone: 'coastal-port',
        type: 'side',
        target: 3,
        trackEvent: 'divergent_artists_2',
        prerequisites: ['artists_path_1'],
        reward: { xp: 180, dirhams: 55 },
      },
      {
        id: 'artists_path_3',
        title: 'The Desert Ballad',
        titleArabic: 'قصيدة الصحراء',
        description: 'The Bedouin elders challenge you to compose a ballad about the desert using five classical Arabic metaphors.',
        zone: 'bedouin-camp',
        type: 'side',
        target: 5,
        trackEvent: 'divergent_artists_3',
        prerequisites: ['artists_path_2'],
        reward: { xp: 250, dirhams: 70 },
      },
      {
        id: 'artists_path_4',
        title: 'The Royal Recital',
        titleArabic: 'الأمسية الملكية',
        description: 'Princess Aisha invites you to perform at the palace. Prepare a poem in formal Arabic that will move the court to tears.',
        zone: 'royal-palace',
        type: 'side',
        target: 4,
        trackEvent: 'divergent_artists_4',
        prerequisites: ['artists_path_3'],
        reward: { xp: 320, dirhams: 90 },
      },
      {
        id: 'artists_path_5',
        title: 'The Eternal Song',
        titleArabic: 'الأغنية الخالدة',
        description: 'Compose the masterwork — a song that weaves every story, poem, and melody you have learned into a single Arabic epic.',
        zone: 'hidden-oasis',
        type: 'side',
        target: 1,
        trackEvent: 'divergent_artists_5',
        prerequisites: ['artists_path_4'],
        reward: { xp: 500, dirhams: 150 },
      },
    ],

    unlockCondition: { factionTier: 'friendly', minAlignment: 25 },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Convenience exports
// ─────────────────────────────────────────────────────────────────────────────

/** All divergent quest IDs (30 total) for prerequisite validation */
export const ALL_DIVERGENT_QUEST_IDS = Object.freeze(
  Object.values(DIVERGENT_PATHS).flatMap((path) =>
    path.questChain.map((q) => q.id)
  )
);

/** Map: questId → factionId for quick lookup */
export const QUEST_TO_FACTION_MAP = Object.freeze(
  Object.fromEntries(
    Object.entries(DIVERGENT_PATHS).flatMap(([factionId, path]) =>
      path.questChain.map((q) => [q.id, factionId])
    )
  )
);

/** Map: questId → quest data object for quick lookup */
export const DIVERGENT_QUEST_BY_ID = Object.freeze(
  Object.fromEntries(
    Object.values(DIVERGENT_PATHS).flatMap((path) =>
      path.questChain.map((q) => [q.id, q])
    )
  )
);
