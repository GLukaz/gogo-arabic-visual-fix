/**
 * gifts.js — 100+ gift items for the NPC gift system
 *
 * Categories: food (25), crafts (20), books (15), clothing (10), tools (10), luxury (10), cultural (10)
 *
 * Each gift: {
 *   id, name, nameArabic, category, value (dirhams),
 *   npcPreferences: { liked: [npcIds], loved: [npcIds], disliked: [npcIds] },
 *   relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 }
 * }
 */

// ─────────────────────────────────────────────────────────────
// FOOD (25 items)
// ─────────────────────────────────────────────────────────────
const foodGifts = [
  {
    id: 'gift_dates',
    name: 'Box of Dates',
    nameArabic: 'صُنْدُوق تَمْر',
    category: 'food',
    value: 15,
    npcPreferences: {
      loved: ['elder-tariq', 'imam-muhammad'],
      liked: ['farmer-omar', 'healer-khadija', 'scholar-yusuf'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_honey',
    name: 'Jar of Wild Honey',
    nameArabic: 'جَرَّة عَسَل بَرِّي',
    category: 'food',
    value: 25,
    npcPreferences: {
      loved: ['healer-khadija', 'herbalist-maryam', 'baker-yasmin'],
      liked: ['elder-tariq', 'storyteller-noor'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_bread_sesame',
    name: 'Sesame Flatbread',
    nameArabic: 'خُبْز بِالسِّمْسِم',
    category: 'food',
    value: 8,
    npcPreferences: {
      loved: ['baker-yasmin', 'farmer-omar'],
      liked: ['student-khalid', 'guard-hamza', 'wanderer-ali'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_pomegranate',
    name: 'Pomegranates',
    nameArabic: 'رُمَّان',
    category: 'food',
    value: 12,
    npcPreferences: {
      loved: ['garden-keeper-leila', 'princess-aisha'],
      liked: ['healer-khadija', 'herbalist-maryam', 'scribe-amina'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_figs',
    name: 'Dried Figs',
    nameArabic: 'تِين مُجَفَّف',
    category: 'food',
    value: 10,
    npcPreferences: {
      loved: ['elder-tariq', 'imam-muhammad', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'wanderer-ali'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_olives',
    name: 'Cured Olives',
    nameArabic: 'زَيْتُون مُعَالَج',
    category: 'food',
    value: 14,
    npcPreferences: {
      loved: ['merchant-fatima', 'trader-hassan'],
      liked: ['farmer-omar', 'guard-hamza', 'captain-rashid'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_rosewater',
    name: 'Rose Water',
    nameArabic: 'مَاء الوَرْد',
    category: 'food',
    value: 20,
    npcPreferences: {
      loved: ['princess-aisha', 'scribe-amina', 'weaver-zahra'],
      liked: ['healer-khadija', 'baker-yasmin'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_saffron',
    name: 'Saffron Threads',
    nameArabic: 'خُيُوط زَعْفَران',
    category: 'food',
    value: 50,
    npcPreferences: {
      loved: ['merchant-fatima', 'vizier-abbas', 'princess-aisha'],
      liked: ['baker-yasmin', 'healer-khadija'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_mint_tea',
    name: 'Mint Tea Bundle',
    nameArabic: 'رُزْمَة شَاي بِالنَّعْنَاع',
    category: 'food',
    value: 7,
    npcPreferences: {
      loved: ['elder-tariq', 'student-khalid', 'guide-amira'],
      liked: ['scholar-yusuf', 'librarian-ibrahim', 'storyteller-noor'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_almonds',
    name: 'Roasted Almonds',
    nameArabic: 'لَوْز مَحْمَص',
    category: 'food',
    value: 18,
    npcPreferences: {
      loved: ['carpet-seller-jamal', 'trader-hassan'],
      liked: ['student-khalid', 'vizier-abbas'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_halva',
    name: 'Pistachio Halva',
    nameArabic: 'حَلْوَى بِالفِسْتُق',
    category: 'food',
    value: 22,
    npcPreferences: {
      loved: ['baker-yasmin', 'student-khalid', 'guide-amira'],
      liked: ['merchant-fatima', 'scribe-amina'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_cinnamon',
    name: 'Cinnamon Sticks',
    nameArabic: 'عِيدَان قِرْفَة',
    category: 'food',
    value: 16,
    npcPreferences: {
      loved: ['herbalist-maryam', 'baker-yasmin'],
      liked: ['healer-khadija', 'spice-seller-layla'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_spice_blend',
    name: 'Desert Spice Blend',
    nameArabic: 'خَلِيط بَهَارَات الصَّحْرَاء',
    category: 'food',
    value: 30,
    npcPreferences: {
      loved: ['spice-seller-layla', 'merchant-fatima'],
      liked: ['baker-yasmin', 'trader-hassan', 'farmer-omar'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_lamb_stew',
    name: 'Clay Pot of Lamb Stew',
    nameArabic: 'إِنَاء طِيني بِيَخْنَة الضَّأْن',
    category: 'food',
    value: 35,
    npcPreferences: {
      loved: ['guard-hamza', 'blacksmith-daud', 'captain-rashid'],
      liked: ['farmer-omar', 'wanderer-ali', 'stable-master-yara'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_dried_herbs',
    name: 'Bundle of Dried Herbs',
    nameArabic: 'رُزْمَة أَعْشَاب مُجَفَّفَة',
    category: 'food',
    value: 13,
    npcPreferences: {
      loved: ['herbalist-maryam', 'healer-khadija'],
      liked: ['garden-keeper-leila', 'baker-yasmin'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_fish_dried',
    name: 'Dried Salted Fish',
    nameArabic: 'سَمَك مُجَفَّف وَمُمَلَّح',
    category: 'food',
    value: 11,
    npcPreferences: {
      loved: ['fishmonger-hana', 'dockmaster-nadia', 'captain-rashid'],
      liked: ['wanderer-ali', 'guard-hamza'],
      disliked: ['princess-aisha', 'vizier-abbas'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_grape_juice',
    name: 'Fresh Grape Juice',
    nameArabic: 'عَصِير عِنَب طَازِج',
    category: 'food',
    value: 9,
    npcPreferences: {
      loved: ['princess-aisha', 'scribe-amina', 'storyteller-noor'],
      liked: ['student-khalid', 'guide-amira'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_flatbread_stuffed',
    name: 'Stuffed Flatbread',
    nameArabic: 'خُبْز مَحْشُوّ',
    category: 'food',
    value: 17,
    npcPreferences: {
      loved: ['farmer-omar', 'blacksmith-daud', 'stable-master-yara'],
      liked: ['guard-hamza', 'student-khalid'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_cardamom_coffee',
    name: 'Cardamom Coffee Beans',
    nameArabic: 'حُبُوب قَهْوَة بِالهَيْل',
    category: 'food',
    value: 28,
    npcPreferences: {
      loved: ['vizier-abbas', 'elder-tariq', 'poet-rumi'],
      liked: ['scholar-yusuf', 'librarian-ibrahim', 'astronomer-zain'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_lentil_soup',
    name: 'Bowl of Lentil Soup',
    nameArabic: 'طَبَق شُورْبَة عَدَس',
    category: 'food',
    value: 6,
    npcPreferences: {
      loved: ['student-khalid', 'wanderer-ali', 'guide-salim'],
      liked: ['farmer-omar', 'guard-hamza'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_raisins',
    name: 'Sun-Dried Raisins',
    nameArabic: 'زَبِيب مُجَفَّف بِالشَّمْس',
    category: 'food',
    value: 10,
    npcPreferences: {
      loved: ['imam-muhammad', 'elder-tariq'],
      liked: ['healer-khadija', 'herbalist-maryam'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_orange_blossom',
    name: 'Orange Blossom Water',
    nameArabic: 'مَاء زَهْر البُرْتُقَال',
    category: 'food',
    value: 18,
    npcPreferences: {
      loved: ['garden-keeper-leila', 'weaver-zahra', 'princess-aisha'],
      liked: ['scribe-amina', 'storyteller-noor'],
      disliked: ['blacksmith-daud'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_walnuts',
    name: 'Shelled Walnuts',
    nameArabic: 'جَوْز مَقْشُور',
    category: 'food',
    value: 15,
    npcPreferences: {
      loved: ['mountain-hermit-idris'],
      liked: ['scholar-yusuf', 'librarian-ibrahim'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_camel_milk',
    name: 'Camel Milk',
    nameArabic: 'حَلِيب الإِبِل',
    category: 'food',
    value: 20,
    npcPreferences: {
      loved: ['stable-master-yara', 'guide-salim', 'wanderer-ali'],
      liked: ['healer-khadija', 'farmer-omar'],
      disliked: ['vizier-abbas', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_marzipan',
    name: 'Marzipan Sweets',
    nameArabic: 'حَلْوَى الماَرْزِيبَان',
    category: 'food',
    value: 32,
    npcPreferences: {
      loved: ['princess-aisha', 'scribe-amina', 'storyteller-noor'],
      liked: ['weaver-zahra', 'guide-amira'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// CRAFTS (20 items)
// ─────────────────────────────────────────────────────────────
const craftsGifts = [
  {
    id: 'gift_clay_bowl',
    name: 'Hand-Thrown Clay Bowl',
    nameArabic: 'طَبَق طِيني مَصْنُوع يَدَوِيًّا',
    category: 'crafts',
    value: 20,
    npcPreferences: {
      loved: ['farmer-omar', 'healer-khadija', 'herbalist-maryam'],
      liked: ['baker-yasmin', 'garden-keeper-leila'],
      disliked: ['vizier-abbas', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_woven_basket',
    name: 'Woven Palm Basket',
    nameArabic: 'سَلَّة مَنْسُوجَة مِن سَعَف النَّخِيل',
    category: 'crafts',
    value: 25,
    npcPreferences: {
      loved: ['weaver-zahra', 'farmer-omar', 'fishmonger-hana'],
      liked: ['baker-yasmin', 'garden-keeper-leila'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_leather_pouch',
    name: 'Tooled Leather Pouch',
    nameArabic: 'كِيس جِلْدِي مَزَّيَّن',
    category: 'crafts',
    value: 40,
    npcPreferences: {
      loved: ['merchant-fatima', 'trader-hassan', 'carpet-seller-jamal'],
      liked: ['guard-hamza', 'captain-rashid'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_copper_lamp',
    name: 'Engraved Copper Lamp',
    nameArabic: 'مِصْبَاح نُحَاسِي مَنْقُوش',
    category: 'crafts',
    value: 55,
    npcPreferences: {
      loved: ['scholar-yusuf', 'astronomer-zain', 'librarian-ibrahim'],
      liked: ['vizier-abbas', 'scribe-amina', 'princess-aisha'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_embroidered_cloth',
    name: 'Embroidered Cloth Panel',
    nameArabic: 'قِطْعَة قُمَاش مُطَرَّزَة',
    category: 'crafts',
    value: 45,
    npcPreferences: {
      loved: ['weaver-zahra', 'princess-aisha', 'scribe-amina'],
      liked: ['merchant-fatima', 'carpet-seller-jamal'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_iron_horseshoe',
    name: 'Handforged Iron Horseshoe',
    nameArabic: 'حِدْوَة حَدِيدِيَّة مَطْرُوقَة يَدَوِيًّا',
    category: 'crafts',
    value: 30,
    npcPreferences: {
      loved: ['blacksmith-daud', 'stable-master-yara'],
      liked: ['farmer-omar', 'guard-hamza'],
      disliked: ['princess-aisha', 'scribe-amina'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_wooden_comb',
    name: 'Carved Wooden Comb',
    nameArabic: 'مُشْط خَشَبِي مَنْحُوت',
    category: 'crafts',
    value: 15,
    npcPreferences: {
      loved: ['weaver-zahra', 'guide-amira', 'storyteller-noor'],
      liked: ['scribe-amina', 'baker-yasmin'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_mosaic_tile',
    name: 'Hand-Painted Mosaic Tile',
    nameArabic: 'بَلَاطَة فُسَيْفِسَاء مَرْسُومَة يَدَوِيًّا',
    category: 'crafts',
    value: 60,
    npcPreferences: {
      loved: ['astronomer-zain', 'princess-aisha', 'vizier-abbas'],
      liked: ['scholar-yusuf', 'poet-rumi'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_reed_flute',
    name: 'Reed Flute',
    nameArabic: 'نَاي قَصَب',
    category: 'crafts',
    value: 35,
    npcPreferences: {
      loved: ['poet-rumi', 'storyteller-noor', 'guide-amira'],
      liked: ['student-khalid', 'wanderer-ali'],
      disliked: ['vizier-abbas'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_saddle_oil',
    name: 'Saddle Conditioning Oil',
    nameArabic: 'زَيْت صِيَانَة السَّرْج',
    category: 'crafts',
    value: 22,
    npcPreferences: {
      loved: ['stable-master-yara', 'guide-salim', 'captain-rashid'],
      liked: ['farmer-omar', 'wanderer-ali'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_ink_block',
    name: 'Carbon Ink Block',
    nameArabic: 'كُتْلَة حِبْر فَحْمِي',
    category: 'crafts',
    value: 28,
    npcPreferences: {
      loved: ['scribe-amina', 'librarian-ibrahim', 'scholar-yusuf'],
      liked: ['poet-rumi', 'astronomer-zain'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_prayer_mat_simple',
    name: 'Simple Woven Prayer Mat',
    nameArabic: 'سَجَّادَة صَلَاة بَسِيطَة مَنْسُوجَة',
    category: 'crafts',
    value: 38,
    npcPreferences: {
      loved: ['imam-muhammad', 'elder-tariq'],
      liked: ['scholar-yusuf', 'weaver-zahra'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_ceramic_vase',
    name: 'Blue Glazed Ceramic Vase',
    nameArabic: 'مَزْهَرِيَّة خَزَفِيَّة مَطْلِيَّة بِالأَزْرَق',
    category: 'crafts',
    value: 48,
    npcPreferences: {
      loved: ['garden-keeper-leila', 'princess-aisha'],
      liked: ['weaver-zahra', 'scribe-amina'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_bronze_mirror',
    name: 'Polished Bronze Mirror',
    nameArabic: 'مِرْآة بُرُونْزِيَّة مَصْقُولَة',
    category: 'crafts',
    value: 55,
    npcPreferences: {
      loved: ['merchant-fatima', 'princess-aisha'],
      liked: ['weaver-zahra', 'storyteller-noor', 'guide-amira'],
      disliked: ['mountain-hermit-idris'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_rope_braided',
    name: 'Hand-Braided Rope',
    nameArabic: 'حَبْل مَضْفُور يَدَوِيًّا',
    category: 'crafts',
    value: 12,
    npcPreferences: {
      loved: ['fishmonger-hana', 'dockmaster-nadia', 'captain-rashid'],
      liked: ['farmer-omar', 'stable-master-yara'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_silver_needle',
    name: 'Silver Embroidery Needle',
    nameArabic: 'إِبْرَة تَطْرِيز فِضِّيَّة',
    category: 'crafts',
    value: 42,
    npcPreferences: {
      loved: ['weaver-zahra', 'scribe-amina'],
      liked: ['merchant-fatima', 'princess-aisha'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_dyed_wool',
    name: 'Bundle of Dyed Wool',
    nameArabic: 'رُزْمَة صُوف مَصْبُوغ',
    category: 'crafts',
    value: 26,
    npcPreferences: {
      loved: ['weaver-zahra', 'carpet-seller-jamal'],
      liked: ['merchant-fatima', 'baker-yasmin'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_carved_seal',
    name: 'Stone Carved Seal',
    nameArabic: 'خَاتَم حَجَرِي مَنْقُوش',
    category: 'crafts',
    value: 65,
    npcPreferences: {
      loved: ['vizier-abbas', 'merchant-fatima', 'librarian-ibrahim'],
      liked: ['scholar-yusuf', 'scribe-amina'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_star_chart_fabric',
    name: 'Star Chart on Linen',
    nameArabic: 'خَرِيطَة نُجُوم عَلَى كَتَّان',
    category: 'crafts',
    value: 70,
    npcPreferences: {
      loved: ['astronomer-zain', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'guide-salim', 'captain-rashid'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_kite_silk',
    name: 'Silk Desert Kite',
    nameArabic: 'طَائِرَة وَرَقِيَّة مِن الحَرِير',
    category: 'crafts',
    value: 33,
    npcPreferences: {
      loved: ['student-khalid', 'guide-amira', 'storyteller-noor'],
      liked: ['farmer-omar', 'wanderer-ali'],
      disliked: ['vizier-abbas'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// BOOKS (15 items)
// ─────────────────────────────────────────────────────────────
const bookGifts = [
  {
    id: 'gift_book_poetry',
    name: 'Collection of Desert Poetry',
    nameArabic: 'مَجْمُوعَة قَصَائِد الصَّحْرَاء',
    category: 'books',
    value: 45,
    npcPreferences: {
      loved: ['poet-rumi', 'scholar-yusuf', 'librarian-ibrahim'],
      liked: ['storyteller-noor', 'scribe-amina', 'princess-aisha'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_medicine',
    name: 'Herbal Medicine Treatise',
    nameArabic: 'رِسَالَة فِي الطِّبّ العُشْبِي',
    category: 'books',
    value: 60,
    npcPreferences: {
      loved: ['healer-khadija', 'herbalist-maryam'],
      liked: ['scholar-yusuf', 'librarian-ibrahim'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_astronomy',
    name: 'Treatise on the Stars',
    nameArabic: 'رِسَالَة فِي عِلْم النُّجُوم',
    category: 'books',
    value: 75,
    npcPreferences: {
      loved: ['astronomer-zain', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'vizier-abbas', 'princess-aisha'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_fiqh',
    name: 'Book of Jurisprudence',
    nameArabic: 'كِتَاب الفِقْه',
    category: 'books',
    value: 80,
    npcPreferences: {
      loved: ['imam-muhammad', 'scholar-yusuf', 'elder-tariq'],
      liked: ['librarian-ibrahim', 'vizier-abbas'],
      disliked: ['wanderer-ali'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_geography',
    name: 'Book of Lands and Routes',
    nameArabic: 'كِتَاب البِلَاد وَالمَسَالِك',
    category: 'books',
    value: 55,
    npcPreferences: {
      loved: ['guide-salim', 'guide-amira', 'trader-hassan'],
      liked: ['captain-rashid', 'wanderer-ali', 'merchant-fatima'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_grammar',
    name: 'Arabic Grammar Primer',
    nameArabic: 'مُقَدِّمَة فِي النَّحْو العَرَبِي',
    category: 'books',
    value: 50,
    npcPreferences: {
      loved: ['scholar-yusuf', 'librarian-ibrahim', 'scribe-amina'],
      liked: ['student-khalid', 'imam-muhammad'],
      disliked: ['guard-hamza', 'blacksmith-daud'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_stories',
    name: 'Book of Tales and Fables',
    nameArabic: 'كِتَاب القِصَص وَالحِكَايَات',
    category: 'books',
    value: 40,
    npcPreferences: {
      loved: ['storyteller-noor', 'student-khalid', 'guide-amira'],
      liked: ['poet-rumi', 'princess-aisha'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_arithmetic',
    name: 'Treatise on Numbers',
    nameArabic: 'رِسَالَة فِي الأَعْدَاد',
    category: 'books',
    value: 65,
    npcPreferences: {
      loved: ['astronomer-zain', 'merchant-fatima', 'vizier-abbas'],
      liked: ['scholar-yusuf', 'librarian-ibrahim'],
      disliked: ['wanderer-ali', 'farmer-omar'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_agriculture',
    name: 'Book of Farming and Seasons',
    nameArabic: 'كِتَاب الزِّرَاعَة وَالمَوَاسِم',
    category: 'books',
    value: 42,
    npcPreferences: {
      loved: ['farmer-omar', 'garden-keeper-leila'],
      liked: ['herbalist-maryam', 'healer-khadija'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_trade',
    name: 'Merchant\'s Handbook',
    nameArabic: 'دَلِيل التَّاجِر',
    category: 'books',
    value: 58,
    npcPreferences: {
      loved: ['merchant-fatima', 'trader-hassan', 'carpet-seller-jamal'],
      liked: ['vizier-abbas', 'dockmaster-nadia'],
      disliked: ['mountain-hermit-idris'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_horsemanship',
    name: 'Art of Horsemanship',
    nameArabic: 'فَنّ الفُرُوسِيَّة',
    category: 'books',
    value: 70,
    npcPreferences: {
      loved: ['stable-master-yara', 'captain-rashid'],
      liked: ['guard-hamza', 'guide-salim'],
      disliked: ['librarian-ibrahim', 'scribe-amina'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_philosophy',
    name: 'Philosophical Discourses',
    nameArabic: 'مُحَاوَرَات فَلْسَفِيَّة',
    category: 'books',
    value: 85,
    npcPreferences: {
      loved: ['mountain-hermit-idris', 'scholar-yusuf', 'poet-rumi'],
      liked: ['librarian-ibrahim', 'astronomer-zain'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_seafaring',
    name: 'Sailor\'s Navigation Manual',
    nameArabic: 'دَلِيل المِلَاحَة البَحْرِيَّة',
    category: 'books',
    value: 62,
    npcPreferences: {
      loved: ['captain-rashid', 'dockmaster-nadia'],
      liked: ['trader-hassan', 'guide-salim'],
      disliked: ['mountain-hermit-idris'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_calligraphy',
    name: 'Calligraphy Practice Scroll',
    nameArabic: 'لَفَافَة تَدْرِيب الخَطّ',
    category: 'books',
    value: 48,
    npcPreferences: {
      loved: ['scribe-amina', 'librarian-ibrahim', 'imam-muhammad'],
      liked: ['scholar-yusuf', 'poet-rumi'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_book_prophecy',
    name: 'Book of Omens and Signs',
    nameArabic: 'كِتَاب الفَأْل وَالعَلَامَات',
    category: 'books',
    value: 55,
    npcPreferences: {
      loved: ['mysterious-traveler', 'storyteller-noor'],
      liked: ['mountain-hermit-idris', 'astronomer-zain'],
      disliked: ['imam-muhammad'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// CLOTHING (10 items)
// ─────────────────────────────────────────────────────────────
const clothingGifts = [
  {
    id: 'gift_keffiyeh_embroidered',
    name: 'Embroidered Keffiyeh',
    nameArabic: 'كُوفِيَّة مُطَرَّزَة',
    category: 'clothing',
    value: 50,
    npcPreferences: {
      loved: ['elder-tariq', 'vizier-abbas', 'carpet-seller-jamal'],
      liked: ['trader-hassan', 'guard-hamza'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_silk_scarf',
    name: 'Silk Shoulder Scarf',
    nameArabic: 'وِشَاح كَتِفٍ حَرِيرِي',
    category: 'clothing',
    value: 65,
    npcPreferences: {
      loved: ['princess-aisha', 'merchant-fatima', 'weaver-zahra'],
      liked: ['guide-amira', 'storyteller-noor'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_leather_belt',
    name: 'Tooled Leather Belt',
    nameArabic: 'حِزَام جِلْدِي مَزَّيَّن',
    category: 'clothing',
    value: 35,
    npcPreferences: {
      loved: ['guard-hamza', 'blacksmith-daud', 'captain-rashid'],
      liked: ['stable-master-yara', 'wanderer-ali'],
      disliked: ['princess-aisha', 'scribe-amina'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_wool_cloak',
    name: 'Heavy Wool Cloak',
    nameArabic: 'عَبَاءَة صُوف ثَقِيلَة',
    category: 'clothing',
    value: 55,
    npcPreferences: {
      loved: ['mountain-hermit-idris', 'wanderer-ali', 'guide-salim'],
      liked: ['farmer-omar', 'elder-tariq'],
      disliked: ['princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_sandals_leather',
    name: 'Hand-Stitched Leather Sandals',
    nameArabic: 'صَنَادِل جِلْدِيَّة مَخِيطَة يَدَوِيًّا',
    category: 'clothing',
    value: 40,
    npcPreferences: {
      loved: ['guide-amira', 'guide-salim', 'wanderer-ali'],
      liked: ['student-khalid', 'farmer-omar'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_thobe_dyed',
    name: 'Indigo-Dyed Thobe',
    nameArabic: 'ثَوْب مَصْبُوغ بِالنِّيلَة',
    category: 'clothing',
    value: 70,
    npcPreferences: {
      loved: ['vizier-abbas', 'elder-tariq', 'imam-muhammad'],
      liked: ['scholar-yusuf', 'merchant-fatima'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_gloves_riding',
    name: 'Riding Gloves',
    nameArabic: 'قُفَّازَات الفُرُوسِيَّة',
    category: 'clothing',
    value: 30,
    npcPreferences: {
      loved: ['stable-master-yara', 'captain-rashid', 'guide-salim'],
      liked: ['guard-hamza', 'wanderer-ali'],
      disliked: ['librarian-ibrahim'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_turban_cotton',
    name: 'White Cotton Turban',
    nameArabic: 'عِمَامَة قُطْنِيَّة بَيْضَاء',
    category: 'clothing',
    value: 28,
    npcPreferences: {
      loved: ['imam-muhammad', 'scholar-yusuf', 'elder-tariq'],
      liked: ['librarian-ibrahim', 'vizier-abbas'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_apron_linen',
    name: 'Linen Work Apron',
    nameArabic: 'مِئْزَر عَمَل مِن الكَتَّان',
    category: 'clothing',
    value: 18,
    npcPreferences: {
      loved: ['baker-yasmin', 'blacksmith-daud', 'farmer-omar'],
      liked: ['fishmonger-hana', 'herbalist-maryam'],
      disliked: ['vizier-abbas', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_veil_silk',
    name: 'Silk Face Veil',
    nameArabic: 'نِقَاب حَرِيرِي',
    category: 'clothing',
    value: 60,
    npcPreferences: {
      loved: ['princess-aisha', 'weaver-zahra', 'merchant-fatima'],
      liked: ['scribe-amina', 'guide-amira'],
      disliked: ['fishmonger-hana', 'blacksmith-daud'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// TOOLS (10 items)
// ─────────────────────────────────────────────────────────────
const toolGifts = [
  {
    id: 'gift_chisel_iron',
    name: 'Iron Chisel Set',
    nameArabic: 'طَقْم إِزْمِيل حَدِيدِي',
    category: 'tools',
    value: 45,
    npcPreferences: {
      loved: ['blacksmith-daud'],
      liked: ['farmer-omar', 'carpenter'],
      disliked: ['princess-aisha', 'scribe-amina', 'librarian-ibrahim'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_fishing_net',
    name: 'Woven Fishing Net',
    nameArabic: 'شَبَكَة صَيْد مَنْسُوجَة',
    category: 'tools',
    value: 35,
    npcPreferences: {
      loved: ['fishmonger-hana', 'dockmaster-nadia'],
      liked: ['captain-rashid', 'wanderer-ali'],
      disliked: ['vizier-abbas'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_sickle',
    name: 'Iron Sickle',
    nameArabic: 'مِنْجَل حَدِيدِي',
    category: 'tools',
    value: 28,
    npcPreferences: {
      loved: ['farmer-omar', 'garden-keeper-leila'],
      liked: ['herbalist-maryam'],
      disliked: ['vizier-abbas', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_quill_set',
    name: 'Fine Calligraphy Quill Set',
    nameArabic: 'طَقْم أَقْلَام خَطّ رَاقِيَة',
    category: 'tools',
    value: 52,
    npcPreferences: {
      loved: ['scribe-amina', 'librarian-ibrahim', 'scholar-yusuf'],
      liked: ['poet-rumi', 'imam-muhammad'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_telescope',
    name: 'Brass Sighting Tube',
    nameArabic: 'أُنْبُوب مُرَاقَبَة نُحَاسِي',
    category: 'tools',
    value: 90,
    npcPreferences: {
      loved: ['astronomer-zain'],
      liked: ['scholar-yusuf', 'captain-rashid', 'guide-salim'],
      disliked: ['blacksmith-daud', 'baker-yasmin'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_scales_merchant',
    name: 'Precision Merchant Scales',
    nameArabic: 'مِيزَان تَاجِر دَقِيق',
    category: 'tools',
    value: 80,
    npcPreferences: {
      loved: ['merchant-fatima', 'trader-hassan', 'carpet-seller-jamal'],
      liked: ['vizier-abbas'],
      disliked: ['farmer-omar'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_mortar_pestle',
    name: 'Stone Mortar and Pestle',
    nameArabic: 'هَاوُون وَمِدَقَّة حَجَرِيَّان',
    category: 'tools',
    value: 32,
    npcPreferences: {
      loved: ['herbalist-maryam', 'healer-khadija', 'baker-yasmin'],
      liked: ['garden-keeper-leila'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_compass',
    name: 'Magnetic Compass',
    nameArabic: 'بُوصُلَة مَغْنَاطِيسِيَّة',
    category: 'tools',
    value: 75,
    npcPreferences: {
      loved: ['guide-salim', 'captain-rashid', 'dockmaster-nadia'],
      liked: ['astronomer-zain', 'trader-hassan', 'wanderer-ali'],
      disliked: ['baker-yasmin'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_bellows_forge',
    name: 'Leather Forge Bellows',
    nameArabic: 'مِنْفَاخ فُرْن جِلْدِي',
    category: 'tools',
    value: 38,
    npcPreferences: {
      loved: ['blacksmith-daud'],
      liked: ['farmer-omar'],
      disliked: ['scribe-amina', 'poet-rumi', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_loom_shuttles',
    name: 'Cedar Loom Shuttles',
    nameArabic: 'مَكُوك نَوْل مِن خَشَب الأَرْز',
    category: 'tools',
    value: 30,
    npcPreferences: {
      loved: ['weaver-zahra', 'carpet-seller-jamal'],
      liked: ['merchant-fatima'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// LUXURY (10 items)
// ─────────────────────────────────────────────────────────────
const luxuryGifts = [
  {
    id: 'gift_pearl_necklace',
    name: 'Pearl Necklace',
    nameArabic: 'عِقْد لُؤْلُؤ',
    category: 'luxury',
    value: 200,
    npcPreferences: {
      loved: ['princess-aisha', 'merchant-fatima'],
      liked: ['weaver-zahra', 'scribe-amina'],
      disliked: ['blacksmith-daud', 'farmer-omar', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_gold_inkwell',
    name: 'Gilded Inkwell',
    nameArabic: 'دَوَاة مُذَهَّبَة',
    category: 'luxury',
    value: 150,
    npcPreferences: {
      loved: ['scribe-amina', 'vizier-abbas', 'librarian-ibrahim'],
      liked: ['scholar-yusuf', 'imam-muhammad'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_amber_pendant',
    name: 'Amber Pendant',
    nameArabic: 'قِلَادَة كَهْرَبَاء',
    category: 'luxury',
    value: 120,
    npcPreferences: {
      loved: ['healer-khadija', 'herbalist-maryam', 'princess-aisha'],
      liked: ['storyteller-noor', 'guide-amira'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_silk_carpet',
    name: 'Fine Silk Prayer Carpet',
    nameArabic: 'سَجَّادَة صَلَاة حَرِيرِيَّة فَاخِرَة',
    category: 'luxury',
    value: 250,
    npcPreferences: {
      loved: ['imam-muhammad', 'vizier-abbas', 'elder-tariq'],
      liked: ['scholar-yusuf', 'princess-aisha'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_spyglass_brass',
    name: 'Engraved Brass Spyglass',
    nameArabic: 'مِنْظَار نُحَاسِي مَنْقُوش',
    category: 'luxury',
    value: 180,
    npcPreferences: {
      loved: ['captain-rashid', 'astronomer-zain'],
      liked: ['guide-salim', 'vizier-abbas'],
      disliked: ['baker-yasmin'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_silver_bracelet',
    name: 'Filigree Silver Bracelet',
    nameArabic: 'سِوَار فِضِّي بِتَقْنِيَة التَّفْصِيص',
    category: 'luxury',
    value: 130,
    npcPreferences: {
      loved: ['princess-aisha', 'weaver-zahra', 'guide-amira'],
      liked: ['merchant-fatima', 'storyteller-noor'],
      disliked: ['blacksmith-daud'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_oud_perfume',
    name: 'Oud Wood Perfume',
    nameArabic: 'عِطْر خَشَب العُود',
    category: 'luxury',
    value: 160,
    npcPreferences: {
      loved: ['vizier-abbas', 'princess-aisha', 'merchant-fatima'],
      liked: ['elder-tariq', 'imam-muhammad'],
      disliked: ['blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_ivory_chess',
    name: 'Ivory Chess Set',
    nameArabic: 'طَقْم شَطْرَنْج عَاجِي',
    category: 'luxury',
    value: 300,
    npcPreferences: {
      loved: ['vizier-abbas', 'scholar-yusuf', 'librarian-ibrahim'],
      liked: ['princess-aisha', 'astronomer-zain'],
      disliked: ['farmer-omar', 'blacksmith-daud'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_jade_amulet',
    name: 'Carved Jade Amulet',
    nameArabic: 'تَمِيمَة يَشَم مَنْحُوتَة',
    category: 'luxury',
    value: 175,
    npcPreferences: {
      loved: ['mysterious-traveler', 'mountain-hermit-idris'],
      liked: ['healer-khadija', 'storyteller-noor'],
      disliked: ['imam-muhammad'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_crystal_vial',
    name: 'Crystal Perfume Vial',
    nameArabic: 'قَارُورَة عِطْر كَرِيسْتَالِيَّة',
    category: 'luxury',
    value: 140,
    npcPreferences: {
      loved: ['princess-aisha', 'scribe-amina'],
      liked: ['merchant-fatima', 'weaver-zahra', 'storyteller-noor'],
      disliked: ['guard-hamza', 'blacksmith-daud', 'fishmonger-hana'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// CULTURAL (10 items)
// ─────────────────────────────────────────────────────────────
const culturalGifts = [
  {
    id: 'gift_quran_calligraphy',
    name: 'Calligraphed Quranic Verse',
    nameArabic: 'آيَة قُرْآنِيَّة مَكْتُوبَة بِالخَطّ',
    category: 'cultural',
    value: 90,
    npcPreferences: {
      loved: ['imam-muhammad', 'elder-tariq', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'scribe-amina'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_prayer_beads',
    name: 'Sandalwood Prayer Beads',
    nameArabic: 'مِسْبَحَة خَشَب صَنْدَل',
    category: 'cultural',
    value: 50,
    npcPreferences: {
      loved: ['imam-muhammad', 'elder-tariq', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'mountain-hermit-idris'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_tribal_mask',
    name: 'Ancestral Tribal Mask',
    nameArabic: 'قِنَاع قَبَلِي مَوْرُوث',
    category: 'cultural',
    value: 100,
    npcPreferences: {
      loved: ['storyteller-noor', 'mysterious-traveler'],
      liked: ['elder-tariq', 'mountain-hermit-idris'],
      disliked: ['vizier-abbas', 'princess-aisha'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_henna_kit',
    name: 'Henna Art Kit',
    nameArabic: 'طَقْم فَنّ الحِنَّاء',
    category: 'cultural',
    value: 35,
    npcPreferences: {
      loved: ['weaver-zahra', 'guide-amira', 'storyteller-noor'],
      liked: ['baker-yasmin', 'fishmonger-hana'],
      disliked: ['blacksmith-daud', 'guard-hamza'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_darbuka',
    name: 'Ceramic Darbuka Drum',
    nameArabic: 'دَرْبُكَّة خَزَفِيَّة',
    category: 'cultural',
    value: 75,
    npcPreferences: {
      loved: ['storyteller-noor', 'poet-rumi', 'wanderer-ali'],
      liked: ['guide-amira', 'student-khalid'],
      disliked: ['librarian-ibrahim', 'scholar-yusuf'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_heritage_coin',
    name: 'Ancient Gold Dinar',
    nameArabic: 'دِينَار ذَهَبِي أَثَرِي',
    category: 'cultural',
    value: 200,
    npcPreferences: {
      loved: ['librarian-ibrahim', 'vizier-abbas', 'scholar-yusuf'],
      liked: ['merchant-fatima', 'trader-hassan', 'astronomer-zain'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_camel_figurine',
    name: 'Carved Camel Figurine',
    nameArabic: 'تِمْثَال جَمَل مَنْحُوت',
    category: 'cultural',
    value: 28,
    npcPreferences: {
      loved: ['stable-master-yara', 'guide-salim'],
      liked: ['wanderer-ali', 'student-khalid', 'storyteller-noor'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_sun_astrolabe',
    name: 'Replica Astrolabe',
    nameArabic: 'إِسْطِرْلَاب نُسْخَة طِرَاز',
    category: 'cultural',
    value: 160,
    npcPreferences: {
      loved: ['astronomer-zain', 'scholar-yusuf'],
      liked: ['librarian-ibrahim', 'mysterious-traveler'],
      disliked: ['blacksmith-daud', 'farmer-omar'],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_oasis_painting',
    name: 'Oasis Landscape Painting',
    nameArabic: 'لَوْحَة مَنْظَر وَاحَة',
    category: 'cultural',
    value: 85,
    npcPreferences: {
      loved: ['poet-rumi', 'princess-aisha', 'storyteller-noor'],
      liked: ['garden-keeper-leila', 'scribe-amina'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
  {
    id: 'gift_festival_lantern',
    name: 'Ramadan Festival Lantern',
    nameArabic: 'فَانُوس عِيد رَمَضَان',
    category: 'cultural',
    value: 55,
    npcPreferences: {
      loved: ['imam-muhammad', 'elder-tariq', 'baker-yasmin'],
      liked: ['student-khalid', 'guide-amira', 'storyteller-noor'],
      disliked: [],
    },
    relationshipGain: { normal: 5, liked: 10, loved: 20, disliked: -5 },
  },
];

// ─────────────────────────────────────────────────────────────
// COMBINED EXPORT
// ─────────────────────────────────────────────────────────────

export const GIFTS = [
  ...foodGifts,
  ...craftsGifts,
  ...bookGifts,
  ...clothingGifts,
  ...toolGifts,
  ...luxuryGifts,
  ...culturalGifts,
];

// Lookup map: giftId → gift object
export const GIFTS_BY_ID = Object.fromEntries(GIFTS.map((g) => [g.id, g]));

// Lookup by category
export const GIFTS_BY_CATEGORY = GIFTS.reduce((acc, gift) => {
  if (!acc[gift.category]) acc[gift.category] = [];
  acc[gift.category].push(gift);
  return acc;
}, {});

/**
 * Compute the relationship delta for giving a gift to an npcId.
 * Returns the numeric delta based on npcPreferences.
 */
export function computeGiftDelta(gift, npcId) {
  if (!gift) return 0;
  const { npcPreferences, relationshipGain } = gift;
  if (npcPreferences.loved.includes(npcId)) return relationshipGain.loved;
  if (npcPreferences.disliked.includes(npcId)) return relationshipGain.disliked;
  if (npcPreferences.liked.includes(npcId)) return relationshipGain.liked;
  return relationshipGain.normal;
}

export default GIFTS;
