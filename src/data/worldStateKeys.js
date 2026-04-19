/**
 * World State Keys — single source of truth for all world flag and counter names.
 *
 * Convention: {ZONE}_{ACTION}_{TARGET} for zone-scoped flags
 *             {CATEGORY}_{ACTION}_{TARGET} for cross-zone flags
 *
 * All JS keys: SCREAMING_SNAKE_CASE
 * All string values: lowercase_snake_case
 *
 * NEVER use raw strings with setFlag/incrementCounter after Phase 50.
 * Always import and reference from this file.
 */

export const WORLD_STATE_KEYS = {

  // ============================================================
  // GLOBAL / CROSS-ZONE FLAGS
  // ============================================================

  // Onboarding
  ONBOARDING_COMPLETE: 'onboarding_complete',
  ONBOARDING_FIRST_WORD_LEARNED: 'onboarding_first_word_learned',
  ONBOARDING_PATH_CHOSEN: 'onboarding_path_chosen',
  ONBOARDING_MENTOR_MET: 'onboarding_mentor_met',
  ONBOARDING_TUTORIAL_COMPLETE: 'onboarding_tutorial_complete',
  ONBOARDING_FIRST_QUEST_STARTED: 'onboarding_first_quest_started',
  ONBOARDING_FIRST_DIALOGUE_COMPLETE: 'onboarding_first_dialogue_complete',
  ONBOARDING_CONTROLS_EXPLAINED: 'onboarding_controls_explained',
  ONBOARDING_MAP_OPENED: 'onboarding_map_opened',
  ONBOARDING_JOURNAL_OPENED: 'onboarding_journal_opened',

  // Learning path mentor + first quest tracking (PATH-04)
  MENTOR_NPC_ID: 'mentor_npc_id',
  FIRST_QUEST_ASSIGNED: 'first_quest_assigned',
  FIRST_QUEST_ID: 'first_quest_id',
  ONBOARDING_WORDS_LEARNED_COUNT: 'onboarding_words_learned_count',
  ONBOARDING_FIRST_QUEST_COMPLETE: 'onboarding_first_quest_complete',

  // Time
  TIME_PHASE: 'time_phase',
  TIME_IS_NIGHT: 'is_night',
  TIME_FIRST_NIGHT_SEEN: 'time_first_night_seen',
  TIME_FIRST_DAWN_SEEN: 'time_first_dawn_seen',

  // Main quest acts (8 acts)
  QUEST_ACT_1_COMPLETE: 'quest_act_1_complete',
  QUEST_ACT_2_COMPLETE: 'quest_act_2_complete',
  QUEST_ACT_3_COMPLETE: 'quest_act_3_complete',
  QUEST_ACT_4_COMPLETE: 'quest_act_4_complete',
  QUEST_ACT_5_COMPLETE: 'quest_act_5_complete',
  QUEST_ACT_6_COMPLETE: 'quest_act_6_complete',
  QUEST_ACT_7_COMPLETE: 'quest_act_7_complete',
  QUEST_ACT_8_COMPLETE: 'quest_act_8_complete',

  // Learning path
  PATH_SCHOLAR_CHOSEN: 'path_scholar_chosen',
  PATH_TRAVELER_CHOSEN: 'path_traveler_chosen',
  PATH_HISTORIAN_CHOSEN: 'path_historian_chosen',

  // Global progression milestones
  GLOBAL_FIRST_BATTLE_WON: 'global_first_battle_won',
  GLOBAL_FIRST_PURCHASE_MADE: 'global_first_purchase_made',
  GLOBAL_FIRST_CRAFT_MADE: 'global_first_craft_made',
  GLOBAL_ALL_ZONES_VISITED: 'global_all_zones_visited',
  GLOBAL_LEVEL_10_REACHED: 'global_level_10_reached',
  GLOBAL_LEVEL_20_REACHED: 'global_level_20_reached',
  GLOBAL_LEVEL_30_REACHED: 'global_level_30_reached',
  GLOBAL_100_WORDS_LEARNED: 'global_100_words_learned',
  GLOBAL_500_WORDS_LEARNED: 'global_500_words_learned',
  GLOBAL_1000_WORDS_LEARNED: 'global_1000_words_learned',
  GLOBAL_COMPANION_RECRUITED: 'global_companion_recruited',
  GLOBAL_FIRST_INSCRIPTION_FOUND: 'global_first_inscription_found',
  GLOBAL_ALL_INSCRIPTIONS_FOUND: 'global_all_inscriptions_found',
  GLOBAL_PROLOGUE_COMPLETE: 'global_prologue_complete',
  GLOBAL_ENDGAME_UNLOCKED: 'global_endgame_unlocked',

  // ============================================================
  // NPC MET FLAGS (all NPCs — auto-set by worldStateMiddleware)
  // ============================================================

  // Zone 1 - Oasis Village NPCs
  NPC_GUIDE_AMIRA_MET: 'npc_guide_amira_met',
  NPC_SCHOLAR_YUSUF_MET: 'npc_scholar_yusuf_met',
  NPC_MERCHANT_FATIMA_MET: 'npc_merchant_fatima_met',
  NPC_STUDENT_KHALID_MET: 'npc_student_khalid_met',

  // Zone 2 - Ancient Library NPCs
  NPC_LIBRARIAN_IBRAHIM_MET: 'npc_librarian_ibrahim_met',
  NPC_SCRIBE_AMINA_MET: 'npc_scribe_amina_met',

  // Zone 3 - Desert Marketplace NPCs
  NPC_SPICE_SELLER_LAYLA_MET: 'npc_spice_seller_layla_met',
  NPC_TRADER_HASSAN_MET: 'npc_trader_hassan_met',
  NPC_GUARD_HAMZA_MET: 'npc_guard_hamza_met',

  // Zone 4 - Farmland NPCs
  NPC_FARMER_OMAR_MET: 'npc_farmer_omar_met',
  NPC_HERBALIST_MARYAM_MET: 'npc_herbalist_maryam_met',

  // Zone 5 - Bedouin Camp NPCs
  NPC_ELDER_TARIQ_MET: 'npc_elder_tariq_met',
  NPC_STORYTELLER_NOOR_MET: 'npc_storyteller_noor_met',
  NPC_GUIDE_SALIM_MET: 'npc_guide_salim_met',

  // Zone 6 - Mountain Village NPCs
  NPC_WEAVER_ZAHRA_MET: 'npc_weaver_zahra_met',
  NPC_HEALER_KHADIJA_MET: 'npc_healer_khadija_met',
  NPC_BLACKSMITH_DAUD_MET: 'npc_blacksmith_daud_met',

  // Zone 7 - Coastal Port NPCs
  NPC_CAPTAIN_RASHID_MET: 'npc_captain_rashid_met',
  NPC_FISHMONGER_HANA_MET: 'npc_fishmonger_hana_met',
  NPC_WANDERER_ALI_MET: 'npc_wanderer_ali_met',

  // Zone 8 - Royal Palace NPCs
  NPC_VIZIER_ABBAS_MET: 'npc_vizier_abbas_met',
  NPC_PRINCESS_AISHA_MET: 'npc_princess_aisha_met',
  NPC_IMAM_MUHAMMAD_MET: 'npc_imam_muhammad_met',
  NPC_POET_RUMI_MET: 'npc_poet_rumi_met',

  // ============================================================
  // NPC WORDS TAUGHT COUNTERS (auto-incremented by worldStateMiddleware)
  // ============================================================

  NPC_GUIDE_AMIRA_WORDS_TAUGHT: 'npc_guide_amira_words_taught',
  NPC_SCHOLAR_YUSUF_WORDS_TAUGHT: 'npc_scholar_yusuf_words_taught',
  NPC_MERCHANT_FATIMA_WORDS_TAUGHT: 'npc_merchant_fatima_words_taught',
  NPC_STUDENT_KHALID_WORDS_TAUGHT: 'npc_student_khalid_words_taught',
  NPC_LIBRARIAN_IBRAHIM_WORDS_TAUGHT: 'npc_librarian_ibrahim_words_taught',
  NPC_SCRIBE_AMINA_WORDS_TAUGHT: 'npc_scribe_amina_words_taught',
  NPC_SPICE_SELLER_LAYLA_WORDS_TAUGHT: 'npc_spice_seller_layla_words_taught',
  NPC_TRADER_HASSAN_WORDS_TAUGHT: 'npc_trader_hassan_words_taught',
  NPC_GUARD_HAMZA_WORDS_TAUGHT: 'npc_guard_hamza_words_taught',
  NPC_FARMER_OMAR_WORDS_TAUGHT: 'npc_farmer_omar_words_taught',
  NPC_HERBALIST_MARYAM_WORDS_TAUGHT: 'npc_herbalist_maryam_words_taught',
  NPC_ELDER_TARIQ_WORDS_TAUGHT: 'npc_elder_tariq_words_taught',
  NPC_STORYTELLER_NOOR_WORDS_TAUGHT: 'npc_storyteller_noor_words_taught',
  NPC_GUIDE_SALIM_WORDS_TAUGHT: 'npc_guide_salim_words_taught',
  NPC_WEAVER_ZAHRA_WORDS_TAUGHT: 'npc_weaver_zahra_words_taught',
  NPC_HEALER_KHADIJA_WORDS_TAUGHT: 'npc_healer_khadija_words_taught',
  NPC_BLACKSMITH_DAUD_WORDS_TAUGHT: 'npc_blacksmith_daud_words_taught',
  NPC_CAPTAIN_RASHID_WORDS_TAUGHT: 'npc_captain_rashid_words_taught',
  NPC_FISHMONGER_HANA_WORDS_TAUGHT: 'npc_fishmonger_hana_words_taught',
  NPC_WANDERER_ALI_WORDS_TAUGHT: 'npc_wanderer_ali_words_taught',
  NPC_VIZIER_ABBAS_WORDS_TAUGHT: 'npc_vizier_abbas_words_taught',
  NPC_PRINCESS_AISHA_WORDS_TAUGHT: 'npc_princess_aisha_words_taught',
  NPC_IMAM_MUHAMMAD_WORDS_TAUGHT: 'npc_imam_muhammad_words_taught',
  NPC_POET_RUMI_WORDS_TAUGHT: 'npc_poet_rumi_words_taught',

  // ============================================================
  // OASIS VILLAGE (Zone 1) — ~70 flags
  // ============================================================

  // Backward-compatible raw flags (MUST NOT change values)
  OASIS_MET_MENTOR: 'met_scholar_yusuf',         // door-scholar-house unlockFlag
  OASIS_TRIGGER_WELCOME: 'trigger_oasis_welcome', // stepTrigger flagOnFire
  OASIS_TRIGGER_RUINS_ECHO: 'trigger_ruins_echo', // stepTrigger flagOnFire

  // Zone unlock
  OASIS_UNLOCKED: 'oasis_unlocked',

  // NPC interactions
  OASIS_TALKED_GUIDE_AMIRA: 'oasis_talked_guide_amira',
  OASIS_TALKED_SCHOLAR_YUSUF: 'oasis_talked_scholar_yusuf',
  OASIS_TALKED_MERCHANT_FATIMA: 'oasis_talked_merchant_fatima',
  OASIS_TALKED_STUDENT_KHALID: 'oasis_talked_student_khalid',
  OASIS_GUIDE_AMIRA_QUEST_GIVEN: 'oasis_guide_amira_quest_given',
  OASIS_SCHOLAR_YUSUF_QUEST_GIVEN: 'oasis_scholar_yusuf_quest_given',
  OASIS_MERCHANT_FATIMA_QUEST_GIVEN: 'oasis_merchant_fatima_quest_given',

  // Main quest flags
  OASIS_QUEST_WELCOME_COMPLETE: 'oasis_quest_welcome_complete',
  OASIS_QUEST_TUTORIAL_COMPLETE: 'oasis_quest_tutorial_complete',
  OASIS_QUEST_WORDS_OF_OASIS_STARTED: 'oasis_quest_words_of_oasis_started',
  OASIS_QUEST_WORDS_OF_OASIS_COMPLETE: 'oasis_quest_words_of_oasis_complete',

  // Side quests
  OASIS_SIDE_QUEST_1_STARTED: 'oasis_side_quest_1_started',
  OASIS_SIDE_QUEST_1_COMPLETE: 'oasis_side_quest_1_complete',
  OASIS_SIDE_QUEST_2_STARTED: 'oasis_side_quest_2_started',
  OASIS_SIDE_QUEST_2_COMPLETE: 'oasis_side_quest_2_complete',
  OASIS_SIDE_QUEST_3_STARTED: 'oasis_side_quest_3_started',
  OASIS_SIDE_QUEST_3_COMPLETE: 'oasis_side_quest_3_complete',

  // Companion quest
  OASIS_COMPANION_QUEST_STARTED: 'oasis_companion_quest_started',
  OASIS_COMPANION_QUEST_COMPLETE: 'oasis_companion_quest_complete',

  // Door unlock flags
  OASIS_SCHOLAR_HOUSE_UNLOCKED: 'met_scholar_yusuf', // alias — same value as OASIS_MET_MENTOR
  OASIS_MERCHANT_HOUSE_ENTERED: 'oasis_merchant_house_entered',
  OASIS_GUILD_ENTERED: 'oasis_guild_entered',

  // Interactable object inspections
  OASIS_INSPECTED_STALL_1: 'oasis_inspected_stall_1',
  OASIS_INSPECTED_BARREL_1: 'oasis_inspected_barrel_1',
  OASIS_INSPECTED_BARREL_2: 'oasis_inspected_barrel_2',
  OASIS_INSPECTED_CRATE_1: 'oasis_inspected_crate_1',
  OASIS_INSPECTED_POT_1: 'oasis_inspected_pot_1',
  OASIS_INSPECTED_POT_2: 'oasis_inspected_pot_2',
  OASIS_INSPECTED_PAINTING_1: 'oasis_inspected_painting_1',
  OASIS_INSPECTED_LANTERN_1: 'oasis_inspected_lantern_1',
  OASIS_INSPECTED_LANTERN_2: 'oasis_inspected_lantern_2',
  OASIS_INSPECTED_LANTERN_3: 'oasis_inspected_lantern_3',
  OASIS_INSPECTED_STATUE_1: 'oasis_inspected_statue_1',
  OASIS_INSPECTED_FOUNTAIN_1: 'oasis_inspected_fountain_1',

  // Chests opened
  OASIS_CHEST_RUINS_OPENED: 'oasis_chest_ruins_opened',
  OASIS_CHEST_HIDDEN_OPENED: 'oasis_chest_hidden_opened',

  // Bookshelves read
  OASIS_BOOKSHELF_SCHOLAR_READ: 'oasis_bookshelf_scholar_read',
  OASIS_BOOKSHELF_STUDENT_READ: 'oasis_bookshelf_student_read',

  // Gathering / crafting
  OASIS_GATHERED_HERBS: 'oasis_gathered_herbs',
  OASIS_GATHERED_WATER: 'oasis_gathered_water',
  OASIS_CRAFTED_FIRST_ITEM: 'oasis_crafted_first_item',

  // Discovery flags
  OASIS_FOUND_HIDDEN_AREA: 'oasis_found_hidden_area',
  OASIS_FOUND_INSCRIPTION_1: 'oasis_found_inscription_1',
  OASIS_INSCRIPTION_OASIS_1_DISCOVERED: 'oasis_inscription_oasis_1_discovered',
  OASIS_INSCRIPTION_OASIS_2_DISCOVERED: 'oasis_inscription_oasis_2_discovered',
  OASIS_INSCRIPTION_OASIS_3_DISCOVERED: 'oasis_inscription_oasis_3_discovered',

  // Purchase flags
  OASIS_PURCHASED_ITEM: 'oasis_purchased_item',
  OASIS_FIRST_HAGGLE_DONE: 'oasis_first_haggle_done',

  // Faction interactions
  OASIS_SCHOLARS_INTRODUCED: 'oasis_scholars_introduced',
  OASIS_MERCHANTS_INTRODUCED: 'oasis_merchants_introduced',

  // Sub-area visited
  OASIS_MARKET_SQUARE_VISITED: 'oasis_market_square_visited',
  OASIS_SHORE_VISITED: 'oasis_shore_visited',
  OASIS_RESIDENTIAL_VISITED: 'oasis_residential_visited',
  OASIS_RUINS_VISITED: 'oasis_ruins_visited',

  // ============================================================
  // ANCIENT LIBRARY (Zone 2) — ~65 flags
  // ============================================================

  // Backward-compatible raw flags
  LIBRARY_ACCESS_GRANTED: 'library_access_granted', // door-archive unlockFlag

  // Zone unlock
  LIBRARY_UNLOCKED: 'library_unlocked',
  LIBRARY_FIRST_VISIT: 'library_first_visit',

  // NPC interactions
  LIBRARY_TALKED_LIBRARIAN_IBRAHIM: 'library_talked_librarian_ibrahim',
  LIBRARY_TALKED_SCRIBE_AMINA: 'library_talked_scribe_amina',
  LIBRARY_IBRAHIM_QUEST_GIVEN: 'library_ibrahim_quest_given',
  LIBRARY_AMINA_QUEST_GIVEN: 'library_amina_quest_given',

  // Main quest flags
  LIBRARY_QUEST_CATALOG_STARTED: 'library_quest_catalog_started',
  LIBRARY_QUEST_CATALOG_COMPLETE: 'library_quest_catalog_complete',
  LIBRARY_QUEST_LOST_CHAPTER_STARTED: 'library_quest_lost_chapter_started',
  LIBRARY_LOST_CHAPTER_FOUND: 'library_lost_chapter_found',
  LIBRARY_ARCHIVE_UNLOCKED: 'library_archive_unlocked',
  LIBRARY_QUEST_MASTER_LETTERS_STARTED: 'library_quest_master_letters_started',
  LIBRARY_QUEST_MASTER_LETTERS_COMPLETE: 'library_quest_master_letters_complete',

  // Side quests
  LIBRARY_SIDE_QUEST_1_STARTED: 'library_side_quest_1_started',
  LIBRARY_SIDE_QUEST_1_COMPLETE: 'library_side_quest_1_complete',
  LIBRARY_SIDE_QUEST_2_STARTED: 'library_side_quest_2_started',
  LIBRARY_SIDE_QUEST_2_COMPLETE: 'library_side_quest_2_complete',

  // Door unlock flags
  LIBRARY_ARCHIVE_DOOR_ENTERED: 'library_archive_door_entered',
  LIBRARY_STUDY_ENTERED: 'library_study_entered',

  // Interactable object inspections
  LIBRARY_INSPECTED_FOUNTAIN_1: 'library_inspected_fountain_1',
  LIBRARY_INSPECTED_STATUE_1: 'library_inspected_statue_1',
  LIBRARY_INSPECTED_STATUE_2: 'library_inspected_statue_2',
  LIBRARY_INSPECTED_PAINTING_1: 'library_inspected_painting_1',
  LIBRARY_INSPECTED_PAINTING_2: 'library_inspected_painting_2',
  LIBRARY_INSPECTED_LANTERN_1: 'library_inspected_lantern_1',
  LIBRARY_INSPECTED_LANTERN_2: 'library_inspected_lantern_2',
  LIBRARY_INSPECTED_LANTERN_3: 'library_inspected_lantern_3',
  LIBRARY_INSPECTED_CRATE_1: 'library_inspected_crate_1',
  LIBRARY_INSPECTED_BARREL_1: 'library_inspected_barrel_1',
  LIBRARY_INSPECTED_POT_1: 'library_inspected_pot_1',
  LIBRARY_INSPECTED_POT_2: 'library_inspected_pot_2',

  // Chests opened
  LIBRARY_CHEST_MAIN_OPENED: 'library_chest_main_opened',
  LIBRARY_CHEST_HIDDEN_OPENED: 'library_chest_hidden_opened',

  // Bookshelves read
  LIBRARY_BOOKSHELF_NUMBERS_READ: 'library_bookshelf_numbers_read',
  LIBRARY_BOOKSHELF_COLORS_READ: 'library_bookshelf_colors_read',
  LIBRARY_BOOKSHELF_PHRASES_READ: 'library_bookshelf_phrases_read',

  // Discovery flags
  LIBRARY_FOUND_INSCRIPTION_1: 'library_found_inscription_1',
  LIBRARY_INSCRIPTION_LIBRARY_1_DISCOVERED: 'library_inscription_library_1_discovered',
  LIBRARY_INSCRIPTION_LIBRARY_2_DISCOVERED: 'library_inscription_library_2_discovered',
  LIBRARY_INSCRIPTION_LIBRARY_3_DISCOVERED: 'library_inscription_library_3_discovered',
  LIBRARY_REFLECTING_POOL_DISCOVERED: 'library_reflecting_pool_discovered',

  // Gathering
  LIBRARY_GATHERED_SCROLL: 'library_gathered_scroll',
  LIBRARY_GATHERED_INK: 'library_gathered_ink',

  // ============================================================
  // DESERT MARKETPLACE (Zone 3) — ~65 flags
  // ============================================================

  // Backward-compatible raw flags
  MARKETPLACE_WAREHOUSE_UNLOCKED: 'warehouse_key_obtained', // door-warehouse unlockFlag

  // Zone unlock
  MARKETPLACE_UNLOCKED: 'marketplace_unlocked',
  MARKETPLACE_FIRST_VISIT: 'marketplace_first_visit',

  // NPC interactions
  MARKETPLACE_TALKED_LAYLA: 'marketplace_talked_layla',
  MARKETPLACE_TALKED_HASSAN: 'marketplace_talked_hassan',
  MARKETPLACE_TALKED_HAMZA: 'marketplace_talked_hamza',
  MARKETPLACE_LAYLA_QUEST_GIVEN: 'marketplace_layla_quest_given',
  MARKETPLACE_HASSAN_QUEST_GIVEN: 'marketplace_hassan_quest_given',

  // Main quest flags
  MARKETPLACE_QUEST_MEDIATION_STARTED: 'marketplace_quest_mediation_started',
  MARKETPLACE_MEDIATION_COMPLETE: 'marketplace_mediation_complete',
  MARKETPLACE_QUEST_TRADE_ROUTE_STARTED: 'marketplace_quest_trade_route_started',
  MARKETPLACE_QUEST_TRADE_ROUTE_COMPLETE: 'marketplace_quest_trade_route_complete',
  MARKETPLACE_QUEST_MASTER_COMPLETE: 'marketplace_quest_master_complete',

  // Side quests
  MARKETPLACE_SIDE_QUEST_1_STARTED: 'marketplace_side_quest_1_started',
  MARKETPLACE_SIDE_QUEST_1_COMPLETE: 'marketplace_side_quest_1_complete',
  MARKETPLACE_SIDE_QUEST_2_STARTED: 'marketplace_side_quest_2_started',
  MARKETPLACE_SIDE_QUEST_2_COMPLETE: 'marketplace_side_quest_2_complete',
  MARKETPLACE_SIDE_QUEST_3_STARTED: 'marketplace_side_quest_3_started',
  MARKETPLACE_SIDE_QUEST_3_COMPLETE: 'marketplace_side_quest_3_complete',

  // Door / area entered
  MARKETPLACE_WAREHOUSE_ENTERED: 'marketplace_warehouse_entered',
  MARKETPLACE_SPICE_SHOP_ENTERED: 'marketplace_spice_shop_entered',
  MARKETPLACE_TEXTILE_SHOP_ENTERED: 'marketplace_textile_shop_entered',

  // Interactable object inspections
  MARKETPLACE_INSPECTED_FOUNTAIN_1: 'marketplace_inspected_fountain_1',
  MARKETPLACE_INSPECTED_STALL_1: 'marketplace_inspected_stall_1',
  MARKETPLACE_INSPECTED_STALL_2: 'marketplace_inspected_stall_2',
  MARKETPLACE_INSPECTED_STALL_3: 'marketplace_inspected_stall_3',
  MARKETPLACE_INSPECTED_STALL_4: 'marketplace_inspected_stall_4',
  MARKETPLACE_INSPECTED_BARREL_1: 'marketplace_inspected_barrel_1',
  MARKETPLACE_INSPECTED_BARREL_2: 'marketplace_inspected_barrel_2',
  MARKETPLACE_INSPECTED_BARREL_3: 'marketplace_inspected_barrel_3',
  MARKETPLACE_INSPECTED_POT_1: 'marketplace_inspected_pot_1',
  MARKETPLACE_INSPECTED_POT_2: 'marketplace_inspected_pot_2',
  MARKETPLACE_INSPECTED_CRATE_1: 'marketplace_inspected_crate_1',
  MARKETPLACE_INSPECTED_CRATE_2: 'marketplace_inspected_crate_2',
  MARKETPLACE_INSPECTED_LANTERN_1: 'marketplace_inspected_lantern_1',
  MARKETPLACE_INSPECTED_LANTERN_2: 'marketplace_inspected_lantern_2',

  // Chests opened
  MARKETPLACE_CHEST_HIDDEN_OPENED: 'marketplace_chest_hidden_opened',
  MARKETPLACE_CHEST_CORNER_OPENED: 'marketplace_chest_corner_opened',

  // Bookshelves read
  MARKETPLACE_BOOKSHELF_FOOD_READ: 'marketplace_bookshelf_food_read',
  MARKETPLACE_BOOKSHELF_TRADE_READ: 'marketplace_bookshelf_trade_read',
  MARKETPLACE_BOOKSHELF_NUMBERS_READ: 'marketplace_bookshelf_numbers_read',

  // Discovery flags
  MARKETPLACE_FOUND_INSCRIPTION_1: 'marketplace_found_inscription_1',
  MARKETPLACE_INSCRIPTION_MARKETPLACE_1_DISCOVERED: 'marketplace_inscription_marketplace_1_discovered',
  MARKETPLACE_INSCRIPTION_MARKETPLACE_2_DISCOVERED: 'marketplace_inscription_marketplace_2_discovered',
  MARKETPLACE_INSCRIPTION_MARKETPLACE_3_DISCOVERED: 'marketplace_inscription_marketplace_3_discovered',

  // Purchase / haggling flags
  MARKETPLACE_FIRST_PURCHASE: 'marketplace_first_purchase',
  MARKETPLACE_HAGGLE_WON: 'marketplace_haggle_won',
  MARKETPLACE_SPICE_PURCHASED: 'marketplace_spice_purchased',

  // Gathering
  MARKETPLACE_GATHERED_SPICES: 'marketplace_gathered_spices',
  MARKETPLACE_GATHERED_CLOTH: 'marketplace_gathered_cloth',

  // ============================================================
  // FARMLAND (Zone 4) — ~65 flags
  // ============================================================

  // Zone unlock
  FARMLAND_UNLOCKED: 'farmland_unlocked',
  FARMLAND_FIRST_VISIT: 'farmland_first_visit',

  // NPC interactions
  FARMLAND_TALKED_FARMER_OMAR: 'farmland_talked_farmer_omar',
  FARMLAND_TALKED_HERBALIST_MARYAM: 'farmland_talked_herbalist_maryam',
  FARMLAND_OMAR_QUEST_GIVEN: 'farmland_omar_quest_given',
  FARMLAND_MARYAM_QUEST_GIVEN: 'farmland_maryam_quest_given',

  // Main quest flags
  FARMLAND_QUEST_HARVEST_STARTED: 'farmland_quest_harvest_started',
  FARMLAND_QUEST_HARVEST_COMPLETE: 'farmland_quest_harvest_complete',
  FARMLAND_QUEST_HERBS_STARTED: 'farmland_quest_herbs_started',
  FARMLAND_QUEST_HERBS_COMPLETE: 'farmland_quest_herbs_complete',
  FARMLAND_QUEST_IRRIGATION_STARTED: 'farmland_quest_irrigation_started',
  FARMLAND_QUEST_IRRIGATION_COMPLETE: 'farmland_quest_irrigation_complete',

  // Side quests
  FARMLAND_SIDE_QUEST_1_STARTED: 'farmland_side_quest_1_started',
  FARMLAND_SIDE_QUEST_1_COMPLETE: 'farmland_side_quest_1_complete',
  FARMLAND_SIDE_QUEST_2_STARTED: 'farmland_side_quest_2_started',
  FARMLAND_SIDE_QUEST_2_COMPLETE: 'farmland_side_quest_2_complete',
  FARMLAND_SIDE_QUEST_3_STARTED: 'farmland_side_quest_3_started',
  FARMLAND_SIDE_QUEST_3_COMPLETE: 'farmland_side_quest_3_complete',

  // Companion quest
  FARMLAND_COMPANION_QUEST_STARTED: 'farmland_companion_quest_started',
  FARMLAND_COMPANION_QUEST_COMPLETE: 'farmland_companion_quest_complete',

  // Door / area entered
  FARMLAND_BARN_ENTERED: 'farmland_barn_entered',
  FARMLAND_FARMHOUSE_ENTERED: 'farmland_farmhouse_entered',

  // Interactable object inspections
  FARMLAND_INSPECTED_POT_1: 'farmland_inspected_pot_1',
  FARMLAND_INSPECTED_POT_2: 'farmland_inspected_pot_2',
  FARMLAND_INSPECTED_POT_3: 'farmland_inspected_pot_3',
  FARMLAND_INSPECTED_BARREL_1: 'farmland_inspected_barrel_1',
  FARMLAND_INSPECTED_BARREL_2: 'farmland_inspected_barrel_2',
  FARMLAND_INSPECTED_BARREL_3: 'farmland_inspected_barrel_3',
  FARMLAND_INSPECTED_STATUE_1: 'farmland_inspected_statue_1',
  FARMLAND_INSPECTED_FOUNTAIN_1: 'farmland_inspected_fountain_1',
  FARMLAND_INSPECTED_LANTERN_1: 'farmland_inspected_lantern_1',
  FARMLAND_INSPECTED_LANTERN_2: 'farmland_inspected_lantern_2',
  FARMLAND_INSPECTED_CRATE_1: 'farmland_inspected_crate_1',
  FARMLAND_INSPECTED_PAINTING_1: 'farmland_inspected_painting_1',
  FARMLAND_INSPECTED_STALL_1: 'farmland_inspected_stall_1',

  // Chests opened
  FARMLAND_CHEST_HIDDEN_OPENED: 'farmland_chest_hidden_opened',
  FARMLAND_CHEST_POND_OPENED: 'farmland_chest_pond_opened',

  // Bookshelves read
  FARMLAND_BOOKSHELF_NATURE_READ: 'farmland_bookshelf_nature_read',
  FARMLAND_BOOKSHELF_ANIMALS_READ: 'farmland_bookshelf_animals_read',
  FARMLAND_BOOKSHELF_BODY_READ: 'farmland_bookshelf_body_read',

  // Discovery flags
  FARMLAND_FOUND_INSCRIPTION_1: 'farmland_found_inscription_1',
  FARMLAND_INSCRIPTION_FARMLAND_1_DISCOVERED: 'farmland_inscription_farmland_1_discovered',
  FARMLAND_INSCRIPTION_FARMLAND_2_DISCOVERED: 'farmland_inscription_farmland_2_discovered',
  FARMLAND_INSCRIPTION_FARMLAND_3_DISCOVERED: 'farmland_inscription_farmland_3_discovered',
  FARMLAND_POND_DISCOVERED: 'farmland_pond_discovered',
  FARMLAND_IRRIGATION_CANAL_DISCOVERED: 'farmland_irrigation_canal_discovered',

  // Gathering flags
  FARMLAND_GATHERED_WHEAT: 'farmland_gathered_wheat',
  FARMLAND_GATHERED_HERBS: 'farmland_gathered_herbs',
  FARMLAND_GATHERED_POMEGRANATES: 'farmland_gathered_pomegranates',
  FARMLAND_GATHERED_MINT: 'farmland_gathered_mint',

  // ============================================================
  // BEDOUIN CAMP (Zone 5) — ~65 flags
  // ============================================================

  // Zone unlock
  BEDOUIN_UNLOCKED: 'bedouin_unlocked',
  BEDOUIN_FIRST_VISIT: 'bedouin_first_visit',

  // NPC interactions
  BEDOUIN_TALKED_ELDER_TARIQ: 'bedouin_talked_elder_tariq',
  BEDOUIN_TALKED_STORYTELLER_NOOR: 'bedouin_talked_storyteller_noor',
  BEDOUIN_TALKED_GUIDE_SALIM: 'bedouin_talked_guide_salim',
  BEDOUIN_TARIQ_QUEST_GIVEN: 'bedouin_tariq_quest_given',
  BEDOUIN_NOOR_QUEST_GIVEN: 'bedouin_noor_quest_given',
  BEDOUIN_SALIM_QUEST_GIVEN: 'bedouin_salim_quest_given',

  // Main quest flags
  BEDOUIN_QUEST_TRUST_STARTED: 'bedouin_quest_trust_started',
  BEDOUIN_QUEST_TRUST_COMPLETE: 'bedouin_quest_trust_complete',
  BEDOUIN_QUEST_STORY_STARTED: 'bedouin_quest_story_started',
  BEDOUIN_QUEST_STORY_COMPLETE: 'bedouin_quest_story_complete',
  BEDOUIN_QUEST_GUIDE_STARTED: 'bedouin_quest_guide_started',
  BEDOUIN_QUEST_GUIDE_COMPLETE: 'bedouin_quest_guide_complete',
  BEDOUIN_TRIBAL_COUNCIL_ATTENDED: 'bedouin_tribal_council_attended',

  // Side quests
  BEDOUIN_SIDE_QUEST_1_STARTED: 'bedouin_side_quest_1_started',
  BEDOUIN_SIDE_QUEST_1_COMPLETE: 'bedouin_side_quest_1_complete',
  BEDOUIN_SIDE_QUEST_2_STARTED: 'bedouin_side_quest_2_started',
  BEDOUIN_SIDE_QUEST_2_COMPLETE: 'bedouin_side_quest_2_complete',
  BEDOUIN_SIDE_QUEST_3_STARTED: 'bedouin_side_quest_3_started',
  BEDOUIN_SIDE_QUEST_3_COMPLETE: 'bedouin_side_quest_3_complete',

  // Companion quest
  BEDOUIN_COMPANION_QUEST_STARTED: 'bedouin_companion_quest_started',
  BEDOUIN_COMPANION_QUEST_COMPLETE: 'bedouin_companion_quest_complete',

  // Areas entered
  BEDOUIN_TENT_ELDER_ENTERED: 'bedouin_tent_elder_entered',
  BEDOUIN_STORYTELLING_CIRCLE_ENTERED: 'bedouin_storytelling_circle_entered',
  BEDOUIN_NIGHT_CAMP_VISITED: 'bedouin_night_camp_visited',

  // Object inspections
  BEDOUIN_INSPECTED_FIRE_PIT: 'bedouin_inspected_fire_pit',
  BEDOUIN_INSPECTED_TENT_1: 'bedouin_inspected_tent_1',
  BEDOUIN_INSPECTED_TENT_2: 'bedouin_inspected_tent_2',
  BEDOUIN_INSPECTED_CARPET_1: 'bedouin_inspected_carpet_1',
  BEDOUIN_INSPECTED_COFFEE_POT: 'bedouin_inspected_coffee_pot',
  BEDOUIN_INSPECTED_CAMEL: 'bedouin_inspected_camel',
  BEDOUIN_INSPECTED_LANTERN_1: 'bedouin_inspected_lantern_1',
  BEDOUIN_INSPECTED_LANTERN_2: 'bedouin_inspected_lantern_2',
  BEDOUIN_INSPECTED_POT_1: 'bedouin_inspected_pot_1',
  BEDOUIN_INSPECTED_POT_2: 'bedouin_inspected_pot_2',
  BEDOUIN_INSPECTED_BARREL_1: 'bedouin_inspected_barrel_1',
  BEDOUIN_INSPECTED_CRATE_1: 'bedouin_inspected_crate_1',
  BEDOUIN_INSPECTED_STATUE_1: 'bedouin_inspected_statue_1',

  // Chests opened
  BEDOUIN_CHEST_MAIN_OPENED: 'bedouin_chest_main_opened',
  BEDOUIN_CHEST_HIDDEN_OPENED: 'bedouin_chest_hidden_opened',

  // Discovery flags
  BEDOUIN_FOUND_INSCRIPTION_1: 'bedouin_found_inscription_1',
  BEDOUIN_INSCRIPTION_CAMP_1_DISCOVERED: 'bedouin_inscription_camp_1_discovered',
  BEDOUIN_INSCRIPTION_CAMP_2_DISCOVERED: 'bedouin_inscription_camp_2_discovered',
  BEDOUIN_INSCRIPTION_CAMP_3_DISCOVERED: 'bedouin_inscription_camp_3_discovered',
  BEDOUIN_STARGAZING_SITE_DISCOVERED: 'bedouin_stargazing_site_discovered',

  // Gathering
  BEDOUIN_GATHERED_DATES: 'bedouin_gathered_dates',
  BEDOUIN_GATHERED_COFFEE: 'bedouin_gathered_coffee',
  BEDOUIN_TRIBAL_GIFT_RECEIVED: 'bedouin_tribal_gift_received',

  // ============================================================
  // MOUNTAIN VILLAGE (Zone 6) — ~65 flags
  // ============================================================

  // Zone unlock
  MOUNTAIN_UNLOCKED: 'mountain_unlocked',
  MOUNTAIN_FIRST_VISIT: 'mountain_first_visit',

  // NPC interactions
  MOUNTAIN_TALKED_WEAVER_ZAHRA: 'mountain_talked_weaver_zahra',
  MOUNTAIN_TALKED_HEALER_KHADIJA: 'mountain_talked_healer_khadija',
  MOUNTAIN_TALKED_BLACKSMITH_DAUD: 'mountain_talked_blacksmith_daud',
  MOUNTAIN_ZAHRA_QUEST_GIVEN: 'mountain_zahra_quest_given',
  MOUNTAIN_KHADIJA_QUEST_GIVEN: 'mountain_khadija_quest_given',
  MOUNTAIN_DAUD_QUEST_GIVEN: 'mountain_daud_quest_given',

  // Main quest flags
  MOUNTAIN_QUEST_PATH_STARTED: 'mountain_quest_path_started',
  MOUNTAIN_QUEST_PATH_COMPLETE: 'mountain_quest_path_complete',
  MOUNTAIN_QUEST_WEAVING_STARTED: 'mountain_quest_weaving_started',
  MOUNTAIN_QUEST_WEAVING_COMPLETE: 'mountain_quest_weaving_complete',
  MOUNTAIN_QUEST_HEALING_STARTED: 'mountain_quest_healing_started',
  MOUNTAIN_QUEST_HEALING_COMPLETE: 'mountain_quest_healing_complete',
  MOUNTAIN_FORGE_UNLOCKED: 'mountain_forge_unlocked',

  // Side quests
  MOUNTAIN_SIDE_QUEST_1_STARTED: 'mountain_side_quest_1_started',
  MOUNTAIN_SIDE_QUEST_1_COMPLETE: 'mountain_side_quest_1_complete',
  MOUNTAIN_SIDE_QUEST_2_STARTED: 'mountain_side_quest_2_started',
  MOUNTAIN_SIDE_QUEST_2_COMPLETE: 'mountain_side_quest_2_complete',
  MOUNTAIN_SIDE_QUEST_3_STARTED: 'mountain_side_quest_3_started',
  MOUNTAIN_SIDE_QUEST_3_COMPLETE: 'mountain_side_quest_3_complete',

  // Companion quest
  MOUNTAIN_COMPANION_QUEST_STARTED: 'mountain_companion_quest_started',
  MOUNTAIN_COMPANION_QUEST_COMPLETE: 'mountain_companion_quest_complete',

  // Areas entered
  MOUNTAIN_FORGE_ENTERED: 'mountain_forge_entered',
  MOUNTAIN_HEALER_HUT_ENTERED: 'mountain_healer_hut_entered',
  MOUNTAIN_WEAVING_WORKSHOP_ENTERED: 'mountain_weaving_workshop_entered',
  MOUNTAIN_SUMMIT_REACHED: 'mountain_summit_reached',

  // Object inspections
  MOUNTAIN_INSPECTED_LOOM_1: 'mountain_inspected_loom_1',
  MOUNTAIN_INSPECTED_FORGE_1: 'mountain_inspected_forge_1',
  MOUNTAIN_INSPECTED_HERB_RACK_1: 'mountain_inspected_herb_rack_1',
  MOUNTAIN_INSPECTED_STATUE_1: 'mountain_inspected_statue_1',
  MOUNTAIN_INSPECTED_FOUNTAIN_1: 'mountain_inspected_fountain_1',
  MOUNTAIN_INSPECTED_LANTERN_1: 'mountain_inspected_lantern_1',
  MOUNTAIN_INSPECTED_LANTERN_2: 'mountain_inspected_lantern_2',
  MOUNTAIN_INSPECTED_POT_1: 'mountain_inspected_pot_1',
  MOUNTAIN_INSPECTED_POT_2: 'mountain_inspected_pot_2',
  MOUNTAIN_INSPECTED_BARREL_1: 'mountain_inspected_barrel_1',
  MOUNTAIN_INSPECTED_CRATE_1: 'mountain_inspected_crate_1',
  MOUNTAIN_INSPECTED_PAINTING_1: 'mountain_inspected_painting_1',

  // Chests opened
  MOUNTAIN_CHEST_MAIN_OPENED: 'mountain_chest_main_opened',
  MOUNTAIN_CHEST_HIDDEN_OPENED: 'mountain_chest_hidden_opened',
  MOUNTAIN_CHEST_SUMMIT_OPENED: 'mountain_chest_summit_opened',

  // Discovery flags
  MOUNTAIN_FOUND_INSCRIPTION_1: 'mountain_found_inscription_1',
  MOUNTAIN_INSCRIPTION_VILLAGE_1_DISCOVERED: 'mountain_inscription_village_1_discovered',
  MOUNTAIN_INSCRIPTION_VILLAGE_2_DISCOVERED: 'mountain_inscription_village_2_discovered',
  MOUNTAIN_INSCRIPTION_VILLAGE_3_DISCOVERED: 'mountain_inscription_village_3_discovered',
  MOUNTAIN_ANCIENT_PATH_DISCOVERED: 'mountain_ancient_path_discovered',

  // Gathering
  MOUNTAIN_GATHERED_WOOL: 'mountain_gathered_wool',
  MOUNTAIN_GATHERED_MEDICINAL_HERBS: 'mountain_gathered_medicinal_herbs',
  MOUNTAIN_GATHERED_ORE: 'mountain_gathered_ore',

  // ============================================================
  // COASTAL PORT (Zone 7) — ~65 flags
  // ============================================================

  // Zone unlock
  COASTAL_UNLOCKED: 'coastal_unlocked',
  COASTAL_FIRST_VISIT: 'coastal_first_visit',

  // NPC interactions
  COASTAL_TALKED_CAPTAIN_RASHID: 'coastal_talked_captain_rashid',
  COASTAL_TALKED_FISHMONGER_HANA: 'coastal_talked_fishmonger_hana',
  COASTAL_TALKED_WANDERER_ALI: 'coastal_talked_wanderer_ali',
  COASTAL_RASHID_QUEST_GIVEN: 'coastal_rashid_quest_given',
  COASTAL_HANA_QUEST_GIVEN: 'coastal_hana_quest_given',
  COASTAL_ALI_QUEST_GIVEN: 'coastal_ali_quest_given',

  // Main quest flags
  COASTAL_QUEST_TRADE_STARTED: 'coastal_quest_trade_started',
  COASTAL_QUEST_TRADE_COMPLETE: 'coastal_quest_trade_complete',
  COASTAL_QUEST_VOYAGE_STARTED: 'coastal_quest_voyage_started',
  COASTAL_QUEST_VOYAGE_COMPLETE: 'coastal_quest_voyage_complete',
  COASTAL_QUEST_FISH_MARKET_STARTED: 'coastal_quest_fish_market_started',
  COASTAL_QUEST_FISH_MARKET_COMPLETE: 'coastal_quest_fish_market_complete',
  COASTAL_SHIP_REPAIRED: 'coastal_ship_repaired',

  // Side quests
  COASTAL_SIDE_QUEST_1_STARTED: 'coastal_side_quest_1_started',
  COASTAL_SIDE_QUEST_1_COMPLETE: 'coastal_side_quest_1_complete',
  COASTAL_SIDE_QUEST_2_STARTED: 'coastal_side_quest_2_started',
  COASTAL_SIDE_QUEST_2_COMPLETE: 'coastal_side_quest_2_complete',
  COASTAL_SIDE_QUEST_3_STARTED: 'coastal_side_quest_3_started',
  COASTAL_SIDE_QUEST_3_COMPLETE: 'coastal_side_quest_3_complete',

  // Companion quest
  COASTAL_COMPANION_QUEST_STARTED: 'coastal_companion_quest_started',
  COASTAL_COMPANION_QUEST_COMPLETE: 'coastal_companion_quest_complete',

  // Areas entered
  COASTAL_SHIP_BOARDED: 'coastal_ship_boarded',
  COASTAL_WAREHOUSE_ENTERED: 'coastal_warehouse_entered',
  COASTAL_FISH_MARKET_ENTERED: 'coastal_fish_market_entered',
  COASTAL_LIGHTHOUSE_REACHED: 'coastal_lighthouse_reached',

  // Object inspections
  COASTAL_INSPECTED_BOAT_1: 'coastal_inspected_boat_1',
  COASTAL_INSPECTED_NET_1: 'coastal_inspected_net_1',
  COASTAL_INSPECTED_ANCHOR_1: 'coastal_inspected_anchor_1',
  COASTAL_INSPECTED_LIGHTHOUSE: 'coastal_inspected_lighthouse',
  COASTAL_INSPECTED_STALL_1: 'coastal_inspected_stall_1',
  COASTAL_INSPECTED_STALL_2: 'coastal_inspected_stall_2',
  COASTAL_INSPECTED_BARREL_1: 'coastal_inspected_barrel_1',
  COASTAL_INSPECTED_BARREL_2: 'coastal_inspected_barrel_2',
  COASTAL_INSPECTED_CRATE_1: 'coastal_inspected_crate_1',
  COASTAL_INSPECTED_CRATE_2: 'coastal_inspected_crate_2',
  COASTAL_INSPECTED_POT_1: 'coastal_inspected_pot_1',
  COASTAL_INSPECTED_LANTERN_1: 'coastal_inspected_lantern_1',
  COASTAL_INSPECTED_STATUE_1: 'coastal_inspected_statue_1',

  // Chests opened
  COASTAL_CHEST_MAIN_OPENED: 'coastal_chest_main_opened',
  COASTAL_CHEST_HIDDEN_OPENED: 'coastal_chest_hidden_opened',

  // Discovery flags
  COASTAL_FOUND_INSCRIPTION_1: 'coastal_found_inscription_1',
  COASTAL_INSCRIPTION_PORT_1_DISCOVERED: 'coastal_inscription_port_1_discovered',
  COASTAL_INSCRIPTION_PORT_2_DISCOVERED: 'coastal_inscription_port_2_discovered',
  COASTAL_INSCRIPTION_PORT_3_DISCOVERED: 'coastal_inscription_port_3_discovered',
  COASTAL_HIDDEN_COVE_DISCOVERED: 'coastal_hidden_cove_discovered',

  // Gathering
  COASTAL_GATHERED_FISH: 'coastal_gathered_fish',
  COASTAL_GATHERED_PEARLS: 'coastal_gathered_pearls',
  COASTAL_GATHERED_SEA_HERBS: 'coastal_gathered_sea_herbs',

  // ============================================================
  // ROYAL PALACE (Zone 8) — ~65 flags
  // ============================================================

  // Backward-compatible raw flags
  PALACE_AUDIENCE_GRANTED: 'palace_audience_granted', // door-palace-throne unlockFlag

  // Zone unlock
  PALACE_UNLOCKED: 'palace_unlocked',
  PALACE_FIRST_VISIT: 'palace_first_visit',
  PALACE_GATES_OPENED: 'palace_gates_opened',

  // NPC interactions
  PALACE_TALKED_VIZIER_ABBAS: 'palace_talked_vizier_abbas',
  PALACE_TALKED_PRINCESS_AISHA: 'palace_talked_princess_aisha',
  PALACE_TALKED_IMAM_MUHAMMAD: 'palace_talked_imam_muhammad',
  PALACE_TALKED_POET_RUMI: 'palace_talked_poet_rumi',
  PALACE_VIZIER_QUEST_GIVEN: 'palace_vizier_quest_given',
  PALACE_PRINCESS_QUEST_GIVEN: 'palace_princess_quest_given',
  PALACE_IMAM_QUEST_GIVEN: 'palace_imam_quest_given',
  PALACE_POET_QUEST_GIVEN: 'palace_poet_quest_given',

  // Main quest flags
  PALACE_QUEST_AUDIENCE_STARTED: 'palace_quest_audience_started',
  PALACE_QUEST_AUDIENCE_COMPLETE: 'palace_quest_audience_complete',
  PALACE_QUEST_ROYAL_DECREE_STARTED: 'palace_quest_royal_decree_started',
  PALACE_QUEST_ROYAL_DECREE_COMPLETE: 'palace_quest_royal_decree_complete',
  PALACE_QUEST_DIPLOMACY_STARTED: 'palace_quest_diplomacy_started',
  PALACE_QUEST_DIPLOMACY_COMPLETE: 'palace_quest_diplomacy_complete',
  PALACE_THRONE_ROOM_AUDIENCE_GRANTED: 'palace_audience_granted', // alias for door flag
  PALACE_ROYAL_BANQUET_ATTENDED: 'palace_royal_banquet_attended',
  PALACE_SCHOLARS_GATHERED: 'palace_scholars_gathered',

  // Side quests
  PALACE_SIDE_QUEST_1_STARTED: 'palace_side_quest_1_started',
  PALACE_SIDE_QUEST_1_COMPLETE: 'palace_side_quest_1_complete',
  PALACE_SIDE_QUEST_2_STARTED: 'palace_side_quest_2_started',
  PALACE_SIDE_QUEST_2_COMPLETE: 'palace_side_quest_2_complete',
  PALACE_SIDE_QUEST_3_STARTED: 'palace_side_quest_3_started',
  PALACE_SIDE_QUEST_3_COMPLETE: 'palace_side_quest_3_complete',

  // Companion quest
  PALACE_COMPANION_QUEST_STARTED: 'palace_companion_quest_started',
  PALACE_COMPANION_QUEST_COMPLETE: 'palace_companion_quest_complete',

  // Areas entered
  PALACE_THRONE_ROOM_ENTERED: 'palace_throne_room_entered',
  PALACE_GARDEN_ENTERED: 'palace_garden_entered',
  PALACE_LIBRARY_ENTERED: 'palace_library_entered',
  PALACE_TREASURY_ENTERED: 'palace_treasury_entered',

  // Object inspections
  PALACE_INSPECTED_THRONE: 'palace_inspected_throne',
  PALACE_INSPECTED_ROYAL_SEAL: 'palace_inspected_royal_seal',
  PALACE_INSPECTED_PORTRAIT_1: 'palace_inspected_portrait_1',
  PALACE_INSPECTED_PORTRAIT_2: 'palace_inspected_portrait_2',
  PALACE_INSPECTED_FOUNTAIN_1: 'palace_inspected_fountain_1',
  PALACE_INSPECTED_STATUE_1: 'palace_inspected_statue_1',
  PALACE_INSPECTED_STATUE_2: 'palace_inspected_statue_2',
  PALACE_INSPECTED_LANTERN_1: 'palace_inspected_lantern_1',
  PALACE_INSPECTED_LANTERN_2: 'palace_inspected_lantern_2',
  PALACE_INSPECTED_POT_1: 'palace_inspected_pot_1',
  PALACE_INSPECTED_CRATE_1: 'palace_inspected_crate_1',
  PALACE_INSPECTED_BOOKSHELF_1: 'palace_inspected_bookshelf_1',

  // Chests opened
  PALACE_CHEST_TREASURY_OPENED: 'palace_chest_treasury_opened',
  PALACE_CHEST_GARDEN_OPENED: 'palace_chest_garden_opened',
  PALACE_CHEST_HIDDEN_OPENED: 'palace_chest_hidden_opened',

  // Discovery flags
  PALACE_FOUND_INSCRIPTION_1: 'palace_found_inscription_1',
  PALACE_INSCRIPTION_PALACE_1_DISCOVERED: 'palace_inscription_palace_1_discovered',
  PALACE_INSCRIPTION_PALACE_2_DISCOVERED: 'palace_inscription_palace_2_discovered',
  PALACE_INSCRIPTION_PALACE_3_DISCOVERED: 'palace_inscription_palace_3_discovered',
  PALACE_SECRET_PASSAGE_DISCOVERED: 'palace_secret_passage_discovered',
  PALACE_ROYAL_GARDEN_DISCOVERED: 'palace_royal_garden_discovered',

  // Gathering
  PALACE_GATHERED_ROYAL_HERBS: 'palace_gathered_royal_herbs',
  PALACE_ROYAL_GIFT_RECEIVED: 'palace_royal_gift_received',

  // ============================================================
  // PUZZLES & RIDDLES (cross-zone, dynamic — use helpers below)
  // ============================================================
  // puzzle_solved_{puzzleId} and riddle_solved_{riddleId} are dynamic.
  // Use puzzleSolvedKey(puzzleId) and riddleSolvedKey(riddleId) helpers.

  // ============================================================
  // SHOP PURCHASE COUNTERS (cross-zone, dynamic — use helpers below)
  // ============================================================
  // shop_{shopId}_purchases are dynamic.
  // Use shopPurchasesKey(shopId) helper.

  // ============================================================
  // FACTION FLAGS (Phase 53 readiness)
  // ============================================================

  FACTION_SCHOLARS_FRIENDLY: 'faction_scholars_friendly',
  FACTION_SCHOLARS_TRUSTED: 'faction_scholars_trusted',
  FACTION_SCHOLARS_ALLIED: 'faction_scholars_allied',
  FACTION_SCHOLARS_RIVAL: 'faction_scholars_rival',

  FACTION_MERCHANTS_FRIENDLY: 'faction_merchants_friendly',
  FACTION_MERCHANTS_TRUSTED: 'faction_merchants_trusted',
  FACTION_MERCHANTS_ALLIED: 'faction_merchants_allied',
  FACTION_MERCHANTS_RIVAL: 'faction_merchants_rival',

  FACTION_ARTISANS_FRIENDLY: 'faction_artisans_friendly',
  FACTION_ARTISANS_TRUSTED: 'faction_artisans_trusted',
  FACTION_ARTISANS_ALLIED: 'faction_artisans_allied',
  FACTION_ARTISANS_RIVAL: 'faction_artisans_rival',

  FACTION_TRAVELERS_FRIENDLY: 'faction_travelers_friendly',
  FACTION_TRAVELERS_TRUSTED: 'faction_travelers_trusted',
  FACTION_TRAVELERS_ALLIED: 'faction_travelers_allied',
  FACTION_TRAVELERS_RIVAL: 'faction_travelers_rival',

  FACTION_GUARDIANS_FRIENDLY: 'faction_guardians_friendly',
  FACTION_GUARDIANS_TRUSTED: 'faction_guardians_trusted',
  FACTION_GUARDIANS_ALLIED: 'faction_guardians_allied',
  FACTION_GUARDIANS_RIVAL: 'faction_guardians_rival',

  FACTION_ARTISTS_FRIENDLY: 'faction_artists_friendly',
  FACTION_ARTISTS_TRUSTED: 'faction_artists_trusted',
  FACTION_ARTISTS_ALLIED: 'faction_artists_allied',
  FACTION_ARTISTS_RIVAL: 'faction_artists_rival',

  // ============================================================
  // WORLD QUESTS (named quest completion flags)
  // ============================================================

  QUEST_WORDS_OF_OASIS_COMPLETE: 'quest_words_of_oasis_complete',
  QUEST_MASTER_OF_LETTERS_COMPLETE: 'quest_master_of_letters_complete',
  QUEST_MERCHANT_MASTER_COMPLETE: 'quest_merchant_master_complete',
  QUEST_HARVEST_FEAST_COMPLETE: 'quest_harvest_feast_complete',
  QUEST_DESERT_WANDERER_COMPLETE: 'quest_desert_wanderer_complete',
  QUEST_MOUNTAIN_CRAFT_COMPLETE: 'quest_mountain_craft_complete',
  QUEST_SEA_ROAD_COMPLETE: 'quest_sea_road_complete',
  QUEST_ROYAL_AUDIENCE_COMPLETE: 'quest_royal_audience_complete',
  QUEST_THE_GREAT_JOURNEY_COMPLETE: 'quest_the_great_journey_complete',
  QUEST_GUARDIAN_OF_KNOWLEDGE_COMPLETE: 'quest_guardian_of_knowledge_complete',
  QUEST_TRADE_ALLIANCE_COMPLETE: 'quest_trade_alliance_complete',
  QUEST_BEDOUIN_BROTHERHOOD_COMPLETE: 'quest_bedouin_brotherhood_complete',
  QUEST_COASTAL_COMMERCE_COMPLETE: 'quest_coastal_commerce_complete',
  QUEST_PALACE_DIPLOMATIC_COMPLETE: 'quest_palace_diplomatic_complete',
  QUEST_INSCRIPTIONS_OF_TRUTH_COMPLETE: 'quest_inscriptions_of_truth_complete',

  // ============================================================
  // LEARNING PATH COMPLETION FLAGS (v11.0 Phase 51 readiness)
  // ============================================================

  LEARNING_GREETINGS_COMPLETE: 'learning_greetings_complete',
  LEARNING_NUMBERS_COMPLETE: 'learning_numbers_complete',
  LEARNING_COLORS_COMPLETE: 'learning_colors_complete',
  LEARNING_TRADE_COMPLETE: 'learning_trade_complete',
  LEARNING_FOOD_COMPLETE: 'learning_food_complete',
  LEARNING_NATURE_COMPLETE: 'learning_nature_complete',
  LEARNING_ANIMALS_COMPLETE: 'learning_animals_complete',
  LEARNING_BODY_COMPLETE: 'learning_body_complete',
  LEARNING_VERBS_COMPLETE: 'learning_verbs_complete',
  LEARNING_PHRASES_COMPLETE: 'learning_phrases_complete',
  LEARNING_ALPHABET_COMPLETE: 'learning_alphabet_complete',
  LEARNING_FIRST_REVIEW_DONE: 'learning_first_review_done',
  LEARNING_STREAK_3_DAYS: 'learning_streak_3_days',
  LEARNING_STREAK_7_DAYS: 'learning_streak_7_days',
  LEARNING_STREAK_30_DAYS: 'learning_streak_30_days',

  // ============================================================
  // INK DIALOGUE FLAGS (v11.0 Phase 51 readiness)
  // ============================================================

  INK_PILOT_NPC_1_COMPLETE: 'ink_pilot_npc_1_complete',
  INK_PILOT_NPC_2_COMPLETE: 'ink_pilot_npc_2_complete',
  INK_PILOT_NPC_3_COMPLETE: 'ink_pilot_npc_3_complete',
  INK_PILOT_NPC_4_COMPLETE: 'ink_pilot_npc_4_complete',
  INK_PILOT_NPC_5_COMPLETE: 'ink_pilot_npc_5_complete',
  INK_DIALOGUE_SYSTEM_ACTIVE: 'ink_dialogue_system_active',

  // ============================================================
  // GOSSIP / RUMOUR FLAGS (v11.0 Phase 53 readiness)
  // ============================================================

  GOSSIP_LIBRARY_RUMOR_HEARD: 'gossip_library_rumor_heard',
  GOSSIP_PALACE_INTRIGUE_HEARD: 'gossip_palace_intrigue_heard',
  GOSSIP_BEDOUIN_RAID_HEARD: 'gossip_bedouin_raid_heard',
  GOSSIP_COASTAL_TREASURE_HEARD: 'gossip_coastal_treasure_heard',
  GOSSIP_MOUNTAIN_FORGE_HEARD: 'gossip_mountain_forge_heard',
  GOSSIP_OASIS_WATER_SHORTAGE_HEARD: 'gossip_oasis_water_shortage_heard',
  GOSSIP_MARKET_PRICE_SPIKE_HEARD: 'gossip_market_price_spike_heard',
  GOSSIP_FARM_DROUGHT_HEARD: 'gossip_farm_drought_heard',
  GOSSIP_ROYAL_WEDDING_HEARD: 'gossip_royal_wedding_heard',
  GOSSIP_SCHOLARS_DISPUTE_HEARD: 'gossip_scholars_dispute_heard',

  // ============================================================
  // ECONOMY / SHOP FLAGS (cross-zone)
  // ============================================================

  ECONOMY_FIRST_PURCHASE: 'economy_first_purchase',
  ECONOMY_FIRST_HAGGLE_WON: 'economy_first_haggle_won',
  ECONOMY_SPENT_500_DIRHAMS: 'economy_spent_500_dirhams',
  ECONOMY_SPENT_1000_DIRHAMS: 'economy_spent_1000_dirhams',
  ECONOMY_EARNED_500_DIRHAMS: 'economy_earned_500_dirhams',
  ECONOMY_EARNED_1000_DIRHAMS: 'economy_earned_1000_dirhams',

  // ============================================================
  // BATTLE / COMBAT FLAGS (cross-zone)
  // ============================================================

  BATTLE_FIRST_WON: 'battle_first_won',
  BATTLE_FIRST_BOSS_DEFEATED: 'battle_first_boss_defeated',
  BATTLE_10_ENEMIES_DEFEATED: 'battle_10_enemies_defeated',
  BATTLE_50_ENEMIES_DEFEATED: 'battle_50_enemies_defeated',
  BATTLE_FIRST_SPELL_CAST: 'battle_first_spell_cast',
  BATTLE_PERFECT_QUIZ_IN_BATTLE: 'battle_perfect_quiz_in_battle',
  BATTLE_TUTORIAL_COMPLETE: 'battle_tutorial_complete',

};

// ============================================================
// HELPER FUNCTIONS — for dynamic key generation
// ============================================================

/**
 * Get the quest completion flag key for a given questId.
 * Falls back to dynamic `quest_{questId}_complete` if not in constants.
 */
export function questCompleteKey(questId) {
  const key = `QUEST_${questId.toUpperCase().replace(/-/g, '_')}_COMPLETE`;
  return WORLD_STATE_KEYS[key] || `quest_${questId.replace(/-/g, '_')}_complete`;
}

/**
 * Get the NPC met flag key for a given npcId.
 * Falls back to dynamic `npc_{npcId}_met` if not in constants.
 */
export function npcMetKey(npcId) {
  const key = `NPC_${npcId.toUpperCase().replace(/-/g, '_')}_MET`;
  return WORLD_STATE_KEYS[key] || `npc_${npcId.replace(/-/g, '_')}_met`;
}

/**
 * Get the puzzle solved flag key (dynamic, not enumerated in constants).
 */
export function puzzleSolvedKey(puzzleId) {
  return `puzzle_solved_${puzzleId}`;
}

/**
 * Get the riddle solved flag key (dynamic, not enumerated in constants).
 */
export function riddleSolvedKey(riddleId) {
  return `riddle_solved_${riddleId}`;
}

/**
 * Get the shop purchase counter key (dynamic, not enumerated in constants).
 */
export function shopPurchasesKey(shopId) {
  return `shop_${shopId}_purchases`;
}
