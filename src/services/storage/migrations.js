/**
 * Redux-Persist Storage Migrations
 *
 * Handles one-time migration from localStorage-only to hybrid IndexedDB+localStorage.
 *
 * Migration path:
 * - Version 0 (implicit): All state in localStorage under 'persist:gogo-arabic'
 * - Version 1: vocabulary + battle moved to IndexedDB, lightweight slices remain in localStorage
 * - Version 2 (Phase 28): magic added to IndexedDB
 * - Version 3 (Phase 29): inventory + economy added
 * - Version 4 (Phase 30): companions added to IndexedDB
 * - Version 5 (Phase 31): crafting added to IndexedDB
 * - Version 8 (Phase 50): worldState moved to IndexedDB
 * - Version 9 (Phase 53): faction moved to IndexedDB
 * - Version 10 (Phase 55): poetry added to IndexedDB
 *
 * Key design:
 * - Migration function receives already-deserialized state from redux-persist
 * - Data movement happens automatically (redux-persist writes to new storage backend)
 * - Migration returns state unchanged (structure is the same, only storage backend changes)
 * - Cleanup of old localStorage keys happens AFTER successful rehydration (5s delay)
 * - Graceful degradation on migration errors (Pitfall 5)
 */

import { createMigrate } from 'redux-persist';

export const CURRENT_VERSION = 12;

/**
 * Migration definitions
 */
const migrations = {
  // Version 0 -> 1: localStorage-only to IndexedDB hybrid
  1: (state) => {
    try {
      // redux-persist has already deserialized the state from localStorage
      // The new nested persistReducers will now write vocabulary + battle to IndexedDB
      // We just need to return the state and schedule cleanup of old localStorage data

      // Schedule cleanup of old localStorage vocabulary/battle data after rehydration
      setTimeout(() => {
        try {
          const rootKey = 'persist:gogo-arabic';
          const oldData = localStorage.getItem(rootKey);

          if (oldData) {
            const parsed = JSON.parse(oldData);

            // Remove vocabulary and battle (now in IndexedDB)
            // Keep all other slices (they still use localStorage)
            delete parsed.vocabulary;
            delete parsed.battle;

            // Write back the cleaned root key
            localStorage.setItem(rootKey, JSON.stringify(parsed));
          }
        } catch (cleanupError) {
          console.warn('[Migration] Failed to cleanup old localStorage data:', cleanupError);
          // Non-critical — app still works, just leaves stale data in localStorage
        }
      }, 5000);

      return state;
    } catch (error) {
      console.error('[Migration] v0 -> v1 failed, returning state unchanged:', error);
      // Graceful degradation — return state as-is and let app continue
      return state;
    }
  },

  // Version 2-4: Handled by individual nested persistReducers (no-op migrations)
  2: (state) => state,
  3: (state) => state,
  4: (state) => state,

  // Version 5: Crafting added to IndexedDB (Phase 31)
  5: (state) => {
    // New slice, no data to migrate
    // Crafting data will be initialized via nested persistReducer
    return state;
  },
  // Version 6: Force-skip broken tutorial (root persist only)
  6: (state) => {
    // Only apply to root persist config (has player key)
    if (!state || !state.player) return state;
    return {
      ...state,
      player: {
        ...state.player,
        onboardingComplete: true,
        tutorialPhase: 'complete',
      },
    };
  },

  // Version 7: v7.0 World & Content — new slices and fields
  7: (state) => {
    // Initialize home slice if missing
    if (state && !state.home) {
      state.home = {
        placementGrid: Array(8).fill(null).map(() => Array(10).fill(null)),
        ownedFurniture: [],
        utilities: { Comfort: 0, Knowledge: 0, Hospitality: 0, Barakah: 0 },
      };
    }

    // Initialize stats slice if missing
    if (state && !state.stats) {
      state.stats = {
        wordsLearnedToday: 0,
        wordsLearnedAllTime: 0,
        totalAccuracy: { correct: 0, total: 0 },
        zoneTime: {},
        battlesWon: 0,
        battlesLost: 0,
        currentStreak: 0,
        longestStreak: 0,
        sessionsPlayed: 0,
        totalPlayTime: 0,
        lastSessionDate: null,
        dailyStats: [],
      };
    }

    // Initialize friendship in npc slice if missing
    if (state?.npc && !state.npc.friendship) {
      state.npc.friendship = {};
    }

    // Initialize new settings fields
    if (state?.settings) {
      if (state.settings.difficulty === undefined) state.settings.difficulty = 'normal';
      if (state.settings.vowelMarks === undefined) state.settings.vowelMarks = true;
      if (state.settings.hintFrequency === undefined) state.settings.hintFrequency = 'normal';
      if (state.settings.battleSpeed === undefined) state.settings.battleSpeed = 1.0;
      if (state.settings.vocabRandomizerSeed === undefined) state.settings.vocabRandomizerSeed = null;
      if (state.settings.showRomanization === undefined) state.settings.showRomanization = true;
    }

    // Initialize tiered currency in player slice
    if (state?.player && !state.player.currency) {
      state.player.currency = {
        fils: 0,
        dirhams: state.player.dirhams || 0,
        dinars: 0,
      };
    }

    return state;
  },

  // Version 8: worldState moved from localStorage to IndexedDB (Phase 50)
  8: (state) => {
    // Schedule cleanup of old localStorage worldState data after rehydration
    setTimeout(() => {
      try {
        const rootKey = 'persist:gogo-arabic';
        const oldData = localStorage.getItem(rootKey);

        if (oldData) {
          const parsed = JSON.parse(oldData);

          // Remove worldState from root localStorage persist (now in IndexedDB)
          delete parsed.worldState;

          localStorage.setItem(rootKey, JSON.stringify(parsed));
        }
      } catch (cleanupError) {
        console.warn('[Migration] Failed to cleanup old localStorage worldState:', cleanupError);
      }
    }, 5000);

    return state;
  },

  // Version 9: faction moved from localStorage to IndexedDB (Phase 53)
  9: (state) => {
    setTimeout(() => {
      try {
        const rootKey = 'persist:gogo-arabic';
        const oldData = localStorage.getItem(rootKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          delete parsed.faction;
          localStorage.setItem(rootKey, JSON.stringify(parsed));
        }
      } catch (cleanupError) {
        console.warn('[Migration] Failed to cleanup old localStorage faction:', cleanupError);
      }
    }, 5000);

    return state;
  },

  // Version 10: poetry added to IndexedDB (Phase 55)
  10: (state) => {
    // Clean up any stale localStorage poetry key if it exists (defensive)
    setTimeout(() => {
      try {
        const rootKey = 'persist:gogo-arabic';
        const oldData = localStorage.getItem(rootKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          if (parsed.poetry) {
            delete parsed.poetry;
            localStorage.setItem(rootKey, JSON.stringify(parsed));
          }
        }
      } catch (cleanupError) {
        console.warn('[Migration] Failed to cleanup old localStorage poetry:', cleanupError);
      }
    }, 5000);

    return state;
  },

  // Version 11: FIX-02 grammar slug migration + placementSlice + cefrProgressSlice init (Phase 56)
  11: (state) => {
    // FIX-02: Remap any numeric lesson IDs in grammar.completedLessons to slugs.
    // 42 entries matching grammar.js lesson order exactly.
    const LESSON_SLUGS = [
      'al-definite', 'noun-adjective-agreement', 'personal-pronouns', 'possessive-suffixes',
      'basic-verb-conjugation', 'question-words', 'prepositions', 'numbers-1-10',
      'basic-adjectives', 'demonstratives', 'possessive-pronouns', 'basic-negation',
      'present-tense', 'future-tense', 'dual-form', 'sound-plural', 'broken-plural',
      'comparative', 'active-participle', 'verb-forms-2-5', 'verb-forms-6-10',
      'relative-clauses', 'passive-voice', 'verbal-nouns', 'object-pronouns',
      'adverbs-time-place', 'conjunctions', 'exception-illa', 'emphasis-inna', 'hal-clause',
      'tamyiz', 'indirect-object', 'complex-conditionals', 'oath-expressions', 'exclamation',
      'wonder-verb', 'praise-blame', 'absolute-object', 'mafuul-liajlih', 'mafuul-maah',
      'literary-particles', 'formal-letter',
    ];

    // Only apply grammar fix to configs that have a grammar key (root persist config)
    if (state?.grammar?.completedLessons) {
      state.grammar.completedLessons = state.grammar.completedLessons.map((id) => {
        if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
          return LESSON_SLUGS[parseInt(id, 10)] || id;
        }
        return id;
      });

      // Also remap lessonScores keys (object keyed by lessonId)
      if (state.grammar.lessonScores) {
        const remapped = {};
        for (const [key, value] of Object.entries(state.grammar.lessonScores)) {
          if (/^\d+$/.test(key)) {
            const slug = LESSON_SLUGS[parseInt(key, 10)];
            if (slug) remapped[slug] = value;
          } else {
            remapped[key] = value;
          }
        }
        state.grammar.lessonScores = remapped;
      }
    }

    // Initialize placementSlice if missing
    if (state && !state.placement) {
      state.placement = {
        hasCompleted: false,
        assignedLevel: null,
        rawScore: null,
        completedAt: null,
      };
    }

    // Initialize cefrProgressSlice if missing
    if (state && !state.cefrProgress) {
      state.cefrProgress = {
        currentLevel: null,
        levelHistory: [],
        lastAssessedAt: null,
      };
    }

    return state;
  },

  // Version 12: Add grammar.unlockedLessons for lesson gating (Phase 58)
  12: (state) => {
    // Only apply to root persist config (has grammar key)
    if (state?.grammar) {
      if (!Array.isArray(state.grammar.unlockedLessons)) {
        const completed = state.grammar.completedLessons ?? [];
        // Unlock: al-definite (always) + all completed lessons + the next one after highest completed
        const unlockedSet = new Set(['al-definite', ...completed]);

        // Ordered lesson IDs (same order as grammar.js lesson.order)
        const ORDERED_LESSON_IDS = [
          'al-definite', 'noun-adjective-agreement', 'personal-pronouns', 'possessive-suffixes',
          'basic-verb-conjugation', 'question-words', 'prepositions', 'colors-and-shapes',
          'numbers-1-10', 'basic-adjectives', 'demonstratives', 'possessive-pronouns', 'basic-negation',
          'present-tense', 'future-tense', 'dual-form', 'sound-plural', 'broken-plural',
          'comparative', 'active-participle',
          'verb-forms-2-5', 'verb-forms-6-10', 'relative-clauses', 'passive-voice', 'verbal-nouns',
          'object-pronouns', 'adverbs-time-place', 'conjunctions', 'exception-illa', 'emphasis-inna',
          'hal-clause', 'tamyiz', 'indirect-object', 'complex-conditionals', 'oath-expressions',
          'exclamation', 'wonder-verb', 'praise-blame', 'absolute-object', 'mafuul-liajlih',
          'mafuul-maah', 'literary-particles', 'formal-letter',
        ];

        // Find highest completed lesson index
        let highestCompletedIndex = -1;
        for (const id of completed) {
          const idx = ORDERED_LESSON_IDS.indexOf(id);
          if (idx > highestCompletedIndex) highestCompletedIndex = idx;
        }

        // Unlock the next lesson after the highest completed
        if (highestCompletedIndex >= 0 && highestCompletedIndex < ORDERED_LESSON_IDS.length - 1) {
          unlockedSet.add(ORDERED_LESSON_IDS[highestCompletedIndex + 1]);
        }

        state.grammar.unlockedLessons = [...unlockedSet];
      }
    }

    return state;
  },
};

/**
 * Create redux-persist migration function
 */
export const migrate = createMigrate(migrations, { debug: false });
export { migrations };
