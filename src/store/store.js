import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import playerReducer from './slices/playerSlice.js';
import vocabularyReducer from './slices/vocabularySlice.js';
import questReducer from './slices/questSlice.js';
import npcReducer from './slices/npcSlice.js';
import alphabetReducer from './slices/alphabetSlice.js';
import settingsReducer from './slices/settingsSlice.js';
import uiReducer from './slices/uiSlice.js';
import syncReducer from './slices/syncSlice.js';
import achievementReducer from './slices/achievementSlice.js';
import dailyGoalsReducer from './slices/dailyGoalsSlice.js';
import grammarReducer from './slices/grammarSlice.js';
import battleReducer from './slices/battleSlice.js';
import narrativeReducer from './slices/narrativeSlice.js';
import magicReducer from './slices/magicSlice.js';
import inventoryReducer from './slices/inventorySlice.js';
import economyReducer from './slices/economySlice.js';
import companionReducer from './slices/companionSlice.js';
import craftingReducer from './slices/craftingSlice.js';
import arenaReducer from './slices/arenaSlice.js';
import timeReducer from './slices/timeSlice.js';
import weatherReducer from './slices/weatherSlice.js';
import worldStateReducer from './slices/worldStateSlice.js';
import homeReducer from './slices/homeSlice.js';
import statsReducer from './slices/statsSlice.js';
import skillTreeReducer from './slices/skillTreeSlice.js';
import factionReducer from './slices/factionSlice.js';
import gossipReducer from './slices/gossipSlice.js';
import poetryReducer from './slices/poetrySlice.js';
import journalReducer from './slices/journalSlice.js';
import codexReducer from './slices/codexSlice.js';
import endgameReducer from './slices/endgameSlice.js';
import placementReducer from './slices/placementSlice.js';
import cefrProgressReducer from './slices/cefrProgressSlice.js';
import analyticsReducer from './slices/analyticsSlice.js';
import eventReducer from './slices/eventSlice.js';
import loreReducer from './slices/loreSlice.js';
import dailyChallengeReducer from './slices/dailyChallengeSlice.js';
import readingReducer from './slices/readingSlice.js';
import writingReducer from './slices/writingSlice.js';
import conversationReducer from './slices/conversationSlice.js';
import miniGameReducer from './slices/miniGameSlice.js';
import seasonalEventReducer from './slices/seasonalEventSlice.js';
import difficultyReducer from './slices/difficultySlice.js';
import leaderboardReducer from './slices/leaderboardSlice.js';
import onboardingReducer from './slices/onboardingSlice.js';
import extendedAnalyticsReducer from './slices/extendedAnalyticsSlice.js';
import phoneticsReducer from './slices/phoneticsSlice.js';
import idiomReducer from './slices/idiomSlice.js';
import linguisticCombatReducer from './slices/linguisticCombatSlice.js';
import alphabetProgressReducer from './slices/alphabetProgressSlice.js';
import coreVocabularyReducer from './slices/coreVocabularySlice.js';
import rootKnowledgeReducer from './slices/rootKnowledgeSlice.js';
import foundationReducer from './slices/foundationSlice.js';
import zoneVocabIntroReducer from './slices/zoneVocabIntroSlice.js';
import zoneIntroReducer from './slices/zoneIntroSlice.js';
import zoneGrammarReducer from './slices/zoneGrammarSlice.js';
import { alphabetGateMiddleware } from './middleware/alphabetGateMiddleware.js';
import { zoneIntroMiddleware } from './middleware/zoneIntroMiddleware.js';
import { foundationMiddleware } from './middleware/foundationMiddleware.js';
import { achievementMiddleware } from './middleware/achievementMiddleware.js';
import { dailyGoalsMiddleware } from './middleware/dailyGoalsMiddleware.js';
import { storageQuotaMiddleware } from './middleware/storageQuotaMiddleware.js';
import { rootFsrsSyncMiddleware } from './middleware/rootFsrsSyncMiddleware.js';
import { battleRewardsMiddleware } from './middleware/battleRewardsMiddleware.js';
import { craftingVocabMiddleware } from './middleware/craftingVocabMiddleware.js';
import { statusEffectVocabMiddleware } from './middleware/statusEffectVocabMiddleware.js';
import { friendshipMiddleware } from './middleware/friendshipMiddleware.js';
import { utilityBonusMiddleware } from './middleware/utilityBonusMiddleware.js';
import { worldStateMiddleware } from './middleware/worldStateMiddleware.js';
import { factionMiddleware } from './middleware/factionMiddleware.js';
import { gossipMiddleware } from './middleware/gossipMiddleware.js';
import { poetryRewardsMiddleware } from './middleware/poetryRewardsMiddleware.js';
import { learningProgressMiddleware } from './middleware/learningProgressMiddleware.js';
import { offlineFsrsMiddleware } from './middleware/offlineFsrsMiddleware.js';
import { grammarFsrsMiddleware } from './middleware/grammarFsrsMiddleware.js';
import { divergentExperienceMiddleware } from './middleware/divergentExperienceMiddleware.js';
import relationshipMiddleware from './middleware/relationshipMiddleware.js';
import loreMiddleware from './middleware/loreMiddleware.js';
import { difficultyMiddleware } from './middleware/difficultyMiddleware.js';
import { economyMiddleware } from './middleware/economyMiddleware.js';
import { seasonalAutomationMiddleware, checkAndDispatch } from './middleware/seasonalAutomationMiddleware.js';
import { zoneReviewMiddleware } from './middleware/zoneReviewMiddleware.js';
import { antiFrustrationMiddleware } from './middleware/antiFrustrationMiddleware.js';
import { questChainMiddleware } from './middleware/questChainMiddleware.js';
import { loginRewardMiddleware } from './middleware/loginRewardMiddleware.js';
import { leechDetectionMiddleware } from './middleware/leechDetectionMiddleware.js';
import { quizDailyGoalsMiddleware } from './middleware/quizDailyGoalsMiddleware.js';
import { economyDecayMiddleware } from './middleware/economyDecayMiddleware.js';
import { cefrProgressMiddleware } from './middleware/cefrProgressMiddleware.js';
import { relationshipDecayMiddleware } from './middleware/relationshipDecayMiddleware.js';
import { zoneEntryReviewMiddleware } from './middleware/zoneEntryReviewMiddleware.js';
import microReviewReducer from './slices/microReviewSlice.js';
import notificationReducer from './slices/notificationSlice.js';
import dailyQuestReducer from './slices/dailyQuestSlice.js';
import { dailyQuestMiddleware } from './middleware/dailyQuestMiddleware.js';
import analyticsEventQueueReducer from './slices/analyticsEventQueueSlice.js';
import { analyticsMiddleware } from './middleware/analyticsMiddleware.js';
import { tutorialMiddleware } from './middleware/tutorialMiddleware.js';
import { dialogueChoiceMiddleware } from './middleware/dialogueChoiceMiddleware.js';
import worldTimeReducer from './slices/worldTimeSlice.js';
import { worldTimeMiddleware } from './middleware/worldTimeMiddleware.js';
import { questTimerMiddleware } from './middleware/questTimerMiddleware.js';
import deckReducer from './slices/deckSlice.js';
import indexedDBStorage from '../services/storage/indexedDBAdapter.js';
import { migrate, CURRENT_VERSION } from '../services/storage/migrations.js';

/**
 * HYBRID STORAGE ARCHITECTURE
 *
 * Heavy data (vocabulary, battle, magic, inventory, crafting) persists to IndexedDB via nested persistReducer.
 * Lightweight data (player, settings, quests, economy, etc.) persists to localStorage via root persistReducer.
 *
 * Why nested persistReducer instead of split namespaces?
 * - Preserves existing selector paths (state.vocabulary.*, state.battle.*, state.magic.*, state.inventory.*, state.crafting.*)
 * - No breaking changes for 50K LOC of existing code
 * - Transparent to all consumers of Redux state
 *
 * Migration:
 * - Version 0 (implicit): All state in localStorage 'persist:gogo-arabic'
 * - Version 1: vocabulary + battle moved to IndexedDB, others remain in localStorage
 * - Version 2 (Phase 28): magic added to IndexedDB
 * - Version 3 (Phase 29): inventory added to IndexedDB, economy added to localStorage
 * - Version 4 (Phase 30): companions added to IndexedDB
 * - Version 5 (Phase 31): crafting added to IndexedDB
 * - Version 8 (Phase 50): worldState moved to IndexedDB
 * - Version 9 (Phase 53): faction moved to IndexedDB
 * - Version 10 (Phase 55): poetry added to IndexedDB
 * - Version 11 (Phase 56): placementSlice + cefrProgressSlice added to localStorage; grammar slug migration
 *
 * Storage backends:
 * - localStorage (root): player, quests, alphabet, settings, npc, achievements, dailyGoals, grammar, narrative, economy
 * - IndexedDB (nested): vocabulary, battle, magic, inventory, companions, crafting, worldState, faction, poetry
 * - Not persisted (transient): ui, sync, gossip
 */

// Nested persist configs for heavy slices (IndexedDB)
const vocabularyPersistConfig = {
  key: 'gogo-arabic-vocabulary',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const battlePersistConfig = {
  key: 'gogo-arabic-battle',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const magicPersistConfig = {
  key: 'gogo-arabic-magic',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const inventoryPersistConfig = {
  key: 'gogo-arabic-inventory',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const companionPersistConfig = {
  key: 'gogo-arabic-companions',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const craftingPersistConfig = {
  key: 'gogo-arabic-crafting',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const worldStatePersistConfig = {
  key: 'gogo-arabic-world-state',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const factionPersistConfig = {
  key: 'gogo-arabic-faction',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
};

const poetryPersistConfig = {
  key: 'gogo-arabic-poetry',
  storage: indexedDBStorage,
  version: CURRENT_VERSION,
  migrate,
  blacklist: ['activeBattle'], // activeBattle is session-only (like gossip tokens)
};

// Wrap heavy reducers with nested persistReducer
const persistedVocabularyReducer = persistReducer(vocabularyPersistConfig, vocabularyReducer);
const persistedBattleReducer = persistReducer(battlePersistConfig, battleReducer);
const persistedMagicReducer = persistReducer(magicPersistConfig, magicReducer);
const persistedInventoryReducer = persistReducer(inventoryPersistConfig, inventoryReducer);
const persistedCompanionReducer = persistReducer(companionPersistConfig, companionReducer);
const persistedCraftingReducer = persistReducer(craftingPersistConfig, craftingReducer);
const persistedWorldStateReducer = persistReducer(worldStatePersistConfig, worldStateReducer);
const persistedFactionReducer = persistReducer(factionPersistConfig, factionReducer);
const persistedPoetryReducer = persistReducer(poetryPersistConfig, poetryReducer);

// Root persist config (localStorage) — vocabulary, battle, magic, inventory, crafting excluded (they have nested configs)
const persistConfig = {
  key: 'gogo-arabic',
  storage, // localStorage
  whitelist: [
    'player',
    'quests',
    'alphabet',
    'settings',
    'npc',
    'achievements',
    'dailyGoals',
    'grammar',
    'narrative',
    'economy',
    'arena',
    'time',
    'weather',
    'home',
    'stats',
    'skillTree',
    'journal',
    'codex',
    'endgame',
    'placement',
    'cefrProgress',
    'analytics',
    'event',
    'lore',
    'dailyChallenge',
    'reading',
    'writing',
    'conversation',
    'miniGame',
    'seasonalEvent',
    'difficulty',
    'leaderboard',
    'onboarding2',
    'extendedAnalytics',
    'phonetics',
    'idiom',
    'linguisticCombat',
    'worldTime',
    'decks',
    'alphabetProgress',
    'coreVocabulary',
    'rootKnowledge',
    'foundation',
    'zoneVocabIntro',
    'zoneIntro',
    'zoneGrammar',
  ],
  // NOTE: vocabulary, battle, magic, inventory, companions, crafting REMOVED from whitelist — they use nested persistReducer with IndexedDB
};

const rootReducer = combineReducers({
  player: playerReducer,
  vocabulary: persistedVocabularyReducer, // IndexedDB (nested)
  quests: questReducer,
  npc: npcReducer,
  alphabet: alphabetReducer,
  settings: settingsReducer,
  ui: uiReducer,
  sync: syncReducer,
  achievements: achievementReducer,
  dailyGoals: dailyGoalsReducer,
  grammar: grammarReducer,
  battle: persistedBattleReducer, // IndexedDB (nested)
  narrative: narrativeReducer,
  magic: persistedMagicReducer, // IndexedDB (nested)
  inventory: persistedInventoryReducer, // IndexedDB (nested)
  economy: economyReducer,
  companions: persistedCompanionReducer, // IndexedDB (nested)
  crafting: persistedCraftingReducer, // IndexedDB (nested)
  arena: arenaReducer,
  time: timeReducer,
  weather: weatherReducer,
  worldState: persistedWorldStateReducer, // IndexedDB (nested) — Phase 50
  home: homeReducer,
  stats: statsReducer,
  skillTree: skillTreeReducer,
  faction: persistedFactionReducer, // IndexedDB (nested) — Phase 53
  gossip: gossipReducer,             // NOT persisted — session-ephemeral tokens
  poetry: persistedPoetryReducer,    // IndexedDB (nested) — Phase 55
  journal: journalReducer,
  codex: codexReducer,
  endgame: endgameReducer,
  placement: placementReducer,
  cefrProgress: cefrProgressReducer,
  analytics: analyticsReducer,
  event: eventReducer,
  lore: loreReducer,
  dailyChallenge: dailyChallengeReducer,
  reading: readingReducer,
  writing: writingReducer,
  conversation: conversationReducer,
  miniGame: miniGameReducer,
  seasonalEvent: seasonalEventReducer,
  difficulty: difficultyReducer,
  leaderboard: leaderboardReducer,
  onboarding2: onboardingReducer,
  extendedAnalytics: extendedAnalyticsReducer,
  phonetics: phoneticsReducer,
  idiom: idiomReducer,
  linguisticCombat: linguisticCombatReducer,
  microReview: microReviewReducer,
  notifications: notificationReducer,       // transient — not persisted
  dailyQuest: dailyQuestReducer,            // transient — not persisted (middleware re-generates on date change)
  analyticsEventQueue: analyticsEventQueueReducer, // transient — not persisted (flushed to server)
  worldTime: worldTimeReducer,
  decks: deckReducer,
  alphabetProgress: alphabetProgressReducer,
  coreVocabulary: coreVocabularyReducer,
  rootKnowledge: rootKnowledgeReducer,
  foundation: foundationReducer,
  zoneVocabIntro: zoneVocabIntroReducer,
  zoneIntro: zoneIntroReducer,
  zoneGrammar: zoneGrammarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore all redux-persist actions (root + nested persistReducers generate their own)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE', 'persist/FLUSH'],
      },
    }).concat(alphabetGateMiddleware, foundationMiddleware, achievementMiddleware, dailyGoalsMiddleware, quizDailyGoalsMiddleware, storageQuotaMiddleware, rootFsrsSyncMiddleware, battleRewardsMiddleware, craftingVocabMiddleware, statusEffectVocabMiddleware, friendshipMiddleware, utilityBonusMiddleware, worldStateMiddleware, factionMiddleware, gossipMiddleware, poetryRewardsMiddleware, learningProgressMiddleware, offlineFsrsMiddleware, grammarFsrsMiddleware, divergentExperienceMiddleware, relationshipMiddleware, loreMiddleware, difficultyMiddleware, economyMiddleware, economyDecayMiddleware, cefrProgressMiddleware, relationshipDecayMiddleware, seasonalAutomationMiddleware, zoneReviewMiddleware, zoneEntryReviewMiddleware, zoneIntroMiddleware, antiFrustrationMiddleware, questChainMiddleware, loginRewardMiddleware, leechDetectionMiddleware, dailyQuestMiddleware, analyticsMiddleware, tutorialMiddleware, dialogueChoiceMiddleware, worldTimeMiddleware, questTimerMiddleware),
});

export const persistor = persistStore(store);

// Initial seasonal event check on app start (for environments without redux-persist rehydration)
checkAndDispatch(store);
