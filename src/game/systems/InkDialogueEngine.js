import { store } from '../../store/store.js';
import { setFlag } from '../../store/slices/worldStateSlice.js';
import { WORLD_STATE_KEYS } from '../../data/worldStateKeys.js';
import { setLearningPath } from '../../store/slices/playerSlice.js';
import { updateQuestProgress } from '../../store/slices/questSlice.js';
import { incrementNpcRelationship } from '../../store/slices/narrativeSlice.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { markTokenHeard } from '../../store/slices/gossipSlice.js';
import { selectDayCount } from '../../store/slices/timeSlice.js';

/**
 * InkDialogueEngine
 *
 * Adapter that wraps an inkjs Story for ink-scripted NPCs,
 * with automatic fallback to the legacy DialogueEngine for
 * any NPC that does not have a compiled .ink.json file.
 *
 * INFRA-07: Adapter pattern — ink Story OR legacy JSON, same interface
 * INFRA-08: import.meta.glob enumerates all .ink.json at build time (Vite-safe)
 * INFRA-09: syncStateIn / syncStateOut bridge Redux worldState ↔ ink variablesState
 */

// Vite-safe dynamic import pattern (Pitfall 2 from RESEARCH.md)
// Enumerates all .ink.json files at build time so Vite can chunk them correctly.
const INK_FILES = import.meta.glob('../data/ink/*.ink.json');

export class InkDialogueEngine {
  /**
   * @param {Phaser.Scene} scene - Active Phaser scene (passed through for future use)
   * @param {import('./DialogueEngine.js').DialogueEngine} legacyDialogueEngine - Fallback legacy engine
   */
  constructor(scene, legacyDialogueEngine) {
    this.scene = scene;
    this.legacy = legacyDialogueEngine;
    this._story = null;
    this._inkLoaded = false;
    this._currentNpcId = null;
    this._comprehensionData = null;
  }

  /**
   * Attempt to load a compiled .ink.json for the given NPC.
   * If no ink file exists, _inkLoaded stays false and all calls
   * transparently fall through to the legacy engine.
   *
   * @param {string} npcId - e.g. 'guide-amira', 'scholar-yusuf'
   */
  async loadForNpc(npcId) {
    const key = `../data/ink/${npcId}.ink.json`;
    const loader = INK_FILES[key];

    if (!loader) {
      // No compiled ink file for this NPC — use legacy path
      this._inkLoaded = false;
      return;
    }

    try {
      const mod = await loader();
      const { Story } = await import('inkjs');
      this._story = new Story(mod.default);
      this._bindExternalFunctions();
      this._inkLoaded = true;
      this._currentNpcId = npcId;
    } catch (err) {
      console.warn(`[InkDialogueEngine] Failed to load ink story for ${npcId}:`, err);
      this._inkLoaded = false;
    }
  }

  /**
   * Load a compiled ink story and optionally set context variables before the first Continue().
   * Used for CEFR milestone dialogue (guide-amira-cefr) and any other scripted event where
   * the caller needs to inject state variables beyond what syncStateIn provides.
   *
   * CEFR-03: guide-amira-cefr.ink uses VAR cefr_level to route to the correct milestone knot.
   *
   * @param {string} npcId - e.g. 'guide-amira-cefr'
   * @param {Object} [context={}] - Key/value pairs injected into ink variablesState after load
   */
  async loadForNpcWithContext(npcId, context = {}) {
    await this.loadForNpc(npcId);
    if (this._inkLoaded && context && this._story) {
      for (const [key, value] of Object.entries(context)) {
        try {
          this._story.variablesState[key] = value;
        } catch {
          // Variable not declared in this story — skip silently
        }
      }
    }
  }

  /**
   * Load the path-choice ink story for Guide Amira.
   * Fires after the first word is learned (ONBOARDING_FIRST_WORD_LEARNED),
   * presenting Scholar / Traveler / Historian choices through in-world dialogue.
   *
   * PATH-01 / PATH-02: uses guide-amira-path.ink.json (not the general guide-amira.ink.json)
   */
  async loadPathChoice() {
    const key = '../data/ink/guide-amira-path.ink.json';
    const loader = INK_FILES[key];

    if (!loader) {
      this._inkLoaded = false;
      return;
    }

    try {
      const mod = await loader();
      const { Story } = await import('inkjs');
      this._story = new Story(mod.default);
      this._bindExternalFunctions();
      this._inkLoaded = true;
      this._currentNpcId = 'guide-amira-path';
    } catch (err) {
      console.warn('[InkDialogueEngine] Failed to load path-choice ink story:', err);
      this._inkLoaded = false;
    }
  }

  /**
   * Whether an ink Story was successfully loaded for the current NPC.
   * @returns {boolean}
   */
  get isInkLoaded() {
    return this._inkLoaded;
  }

  /**
   * INFRA-09: Copy relevant Redux state INTO ink variablesState before dialogue starts.
   * Only syncs keys that are actually declared as variables in the ink story
   * (silently skips unknown keys via try/catch).
   */
  syncStateIn() {
    if (!this._inkLoaded) return;

    const state = store.getState();
    const flags = state.worldState?.flags ?? {};

    // Sync all world state flags into ink variables
    for (const [key, value] of Object.entries(flags)) {
      try {
        this._story.variablesState[key] = value;
      } catch {
        // Ink variable not declared in this story — skip silently
      }
    }

    // Sync learning path (player slice)
    try {
      this._story.variablesState['player_learning_path'] = state.player?.learningPath || '';
    } catch {
      // Variable not declared in this story — skip
    }

    // Sync onboarding complete flag (player slice)
    try {
      this._story.variablesState['player_onboarding_complete'] = !!(state.player?.onboardingComplete);
    } catch {
      // Variable not declared in this story — skip
    }

    // Sync current CEFR level (cefrProgress slice) — used by guide-amira-cefr.ink
    try {
      this._story.variablesState['cefr_level'] = state.cefrProgress?.currentLevel || '';
    } catch {
      // Variable not declared in this story — skip
    }
  }

  /**
   * INFRA-09: Flush ink variablesState mutations BACK to Redux worldState after dialogue ends.
   * Only writes keys that are in WORLD_STATE_KEYS to avoid polluting the store.
   */
  syncStateOut() {
    if (!this._inkLoaded) return;

    const knownValues = new Set(Object.values(WORLD_STATE_KEYS));
    const globalVars = this._story.variablesState?._globalVariables?.keys?.() ?? [];

    for (const varName of knownValues) {
      try {
        const value = this._story.variablesState[varName];
        if (value !== undefined) {
          store.dispatch(setFlag({ key: varName, value }));
        }
      } catch {
        // Variable not in this story — skip
      }
    }

    // Suppress unused variable warning for globalVars (enumeration not used here
    // because we iterate knownValues instead for safety)
    void globalVars;
  }

  /**
   * Bind Redux dispatch actions as external functions callable from ink scripts.
   * ink calls these via: ~ setLearningPath("scholar")
   * @private
   */
  _bindExternalFunctions() {
    // Set learning path + mark path-chosen flag
    this._story.BindExternalFunction('setLearningPath', (path) => {
      store.dispatch(setLearningPath(path));
      store.dispatch(setFlag({ key: WORLD_STATE_KEYS.ONBOARDING_PATH_CHOSEN, value: true }));
    });

    // Start a quest (sets it to active with progress 0)
    this._story.BindExternalFunction('startQuest', (questId) => {
      store.dispatch(updateQuestProgress({ questId, amount: 0 }));
    });

    // Change NPC relationship by a delta amount
    this._story.BindExternalFunction('changeRelationship', (npcId, amount) => {
      store.dispatch(incrementNpcRelationship({ npcId, amount }));
    });

    // Write a world state flag to Redux (called from ink scripts: ~ setFlag("key"))
    this._story.BindExternalFunction('setFlag', (key) => {
      store.dispatch(setFlag({ key, value: true }));
    });

    // Read a world state flag from Redux (for ink conditionals)
    this._story.BindExternalFunction('getFlag', (key) => {
      return store.getState().worldState?.flags?.[key] ?? false;
    });

    // Read the player's current learning path (for ink conditionals)
    this._story.BindExternalFunction('getLearningPath', () => {
      return store.getState().player?.learningPath || '';
    });

    // ENVR-02: Check if player knows a word (returns 1 if has reps > 0, 0 if unknown)
    this._story.BindExternalFunction('getVocabMastery', (wordId) => {
      const state = store.getState();
      const fsrsCards = state.vocabulary?.fsrsCards ?? {};
      const cardEntry = fsrsCards[wordId];
      return (cardEntry && cardEntry.card && cardEntry.card.reps > 0) ? 1 : 0;
    });

    // ENVR-02: Add FSRS card from ink context (only if word not already known)
    this._story.BindExternalFunction('addFsrsCardFromInk', (wordId, source) => {
      const state = store.getState();
      const fsrsCards = state.vocabulary?.fsrsCards ?? {};
      if (!fsrsCards[wordId]) {
        store.dispatch(addFsrsCard({
          wordId,
          card: {
            due: new Date().toISOString(),
            stability: 0,
            difficulty: 0,
            elapsed_days: 0,
            scheduled_days: 0,
            reps: 0,
            lapses: 0,
            state: 'New',
          },
          source,
        }));
      }
    });

    // GOSP-03: Get first unheard, non-expired gossip token for an NPC
    this._story.BindExternalFunction('getGossipToken', (npcId) => {
      const state = store.getState();
      const currentDay = selectDayCount(state);
      const tokens = state.gossip?.npcTokens?.[npcId] || [];
      const active = tokens.find(t => !t.heard && t.expiresDay > currentDay);
      return active ? active.arabicLine : '';
    });

    // GOSP-04: Mark the first unheard, non-expired gossip token as heard so it is not repeated
    this._story.BindExternalFunction('markGossipHeard', (npcId) => {
      const state = store.getState();
      const currentDay = selectDayCount(state);
      const tokens = state.gossip?.npcTokens?.[npcId] || [];
      const active = tokens.find(t => !t.heard && t.expiresDay > currentDay);
      if (active) {
        store.dispatch(markTokenHeard({ npcId, tokenId: active.tokenId }));
      }
    });

    // IMM-01: Comprehension check data — set by ink before #comprehension_check tagged line
    this._story.BindExternalFunction('setComprehensionCheck', (question, optionA, optionB, optionC, correctIndex) => {
      this._comprehensionData = {
        question,
        options: [optionA, optionB, optionC],
        correctIndex,
      };
    });

    // GOSP-05: Get grammar note for the current gossip token
    this._story.BindExternalFunction('getGossipGrammarNote', (npcId) => {
      const state = store.getState();
      const currentDay = selectDayCount(state);
      const tokens = state.gossip?.npcTokens?.[npcId] || [];
      const active = tokens.find(t => !t.heard && t.expiresDay > currentDay);
      return active ? active.grammarNote : '';
    });
  }

  // ─── Story control ───────────────────────────────────────────

  /**
   * Whether the story has more content to output.
   * @returns {boolean}
   */
  canContinue() {
    return this._inkLoaded ? this._story.canContinue : false;
  }

  /**
   * Advance the story and return the next line of dialogue.
   * @returns {string|null}
   */
  continue() {
    return this._inkLoaded ? this._story.Continue() : null;
  }

  /**
   * Current list of player choice options (if any).
   * @returns {import('inkjs').Choice[]}
   */
  currentChoices() {
    return this._inkLoaded ? this._story.currentChoices : [];
  }

  /**
   * Select a choice by index (0-based).
   * @param {number} index
   */
  chooseChoiceIndex(index) {
    if (this._inkLoaded) {
      this._story.ChooseChoiceIndex(index);
    }
  }

  /**
   * Reset the story state and clear the loaded story.
   * Call after dialogue ends to free memory.
   */
  reset() {
    if (this._inkLoaded) {
      this._story.ResetState();
    }
    this._inkLoaded = false;
    this._story = null;
    this._currentNpcId = null;
    this._comprehensionData = null;
  }

  /**
   * Convenience method: sync state in, collect all text lines until a choice or END.
   * @returns {{ lines: string[], choices: import('inkjs').Choice[] }}
   */
  getDialogueLines() {
    this.syncStateIn();
    const lines = [];
    while (this.canContinue()) {
      lines.push(this.continue());
    }
    return { lines, choices: this.currentChoices() };
  }

  /**
   * IMM-01: Retrieve and consume the comprehension check data set by ink's setComprehensionCheck().
   * Returns null if no check was set. Consuming clears the data so each check fires once.
   * @returns {{ question: string, options: string[], correctIndex: number } | null}
   */
  getComprehensionData() {
    const data = this._comprehensionData;
    this._comprehensionData = null;
    return data;
  }
}
