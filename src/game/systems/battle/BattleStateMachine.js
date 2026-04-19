/**
 * BattleStateMachine.js — Core FSM driving turn-based combat.
 *
 * State flow:
 *   INTRO -> TURN_START -> PLAYER_TURN/ENEMY_TURN -> ACTION_SELECT/ENEMY_AI ->
 *   INPUT_PHASE -> RESOLVE_ACTION -> APPLY_DAMAGE -> ANIMATE_HIT ->
 *   TURN_END -> CHECK_END -> VICTORY/DEFEAT or back to TURN_START
 *
 * Phase 32 additions:
 *   GRAMMAR_COMBO: grammar combo input (noun+adj, verb chain, sentence)
 *   TARGET_SELECT: multi-enemy target selection
 *   ITEM_USE: battle item selection and consumption
 *   FLEE_CHALLENGE: Arabic-based flee (replaces random chance)
 *   COMPOUND_CHECK: compound effect resolution after status application
 *   ARENA_WAVE_TRANSITION: between arena waves
 *
 * Communicates with React UI via EventBus and reads/writes Redux store directly.
 * Arabic input accuracy is the primary damage multiplier.
 * EVERY Arabic word typed during battle is captured via recordArabicUsed for PostBattleReview.
 */

import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import {
  startBattle,
  dealDamage,
  dealDamageToEnemy,
  dealDamageToPlayer,
  healEnemy,
  setPlayerDefending,
  setCurrentTurn,
  spendMP,
  tickStatusEffects,
  recordWordUsed,
  recordArabicUsed,
  incrementTurn,
  endBattle,
  initCompanionBattle,
  initMultiTargetBattle,
  spendCompanionMP,
  healCompanion,
  healPlayer,
  damageCompanion,
  setCompanionDefending,
  applyPlayerEffect,
  removeEnemyEffect,
  applyStatusEffect,
  applyBuff,
  updateComboMeter,
  resetComboMeter,
  setGrammarComboState,
  clearGrammarComboState,
  selectArabicUsedThisBattle,
  selectAllEnemiesDefeated,
  selectActiveEnemies,
} from '../../../store/slices/battleSlice.js';
import { consumeItem } from '../../../store/slices/inventorySlice.js';
import { getEnemy } from '../../../data/enemies.js';
import { calculateDamage } from './BattleDamageCalculator.js';
import { EnemyAI } from './EnemyAI.js';
import { RootMagicManager } from '../magic/RootMagicManager.js';
import { getRootWords } from '../../../data/rootsData.js';
import { CompanionBattleAI } from '../companions/CompanionBattleAI.js';
import { GrammarComboDetector } from './GrammarComboDetector.js';
import { CompoundEffectResolver } from './CompoundEffectResolver.js';
import { MultiTargetManager } from './MultiTargetManager.js';

const STATES = Object.freeze({
  IDLE: 'IDLE',
  INTRO: 'INTRO',
  TURN_START: 'TURN_START',
  PLAYER_TURN: 'PLAYER_TURN',
  ACTION_SELECT: 'ACTION_SELECT',
  MAGIC_CAST: 'MAGIC_CAST',
  INPUT_PHASE: 'INPUT_PHASE',
  RESOLVE_ACTION: 'RESOLVE_ACTION',
  APPLY_DAMAGE: 'APPLY_DAMAGE',
  ANIMATE_HIT: 'ANIMATE_HIT',
  COMPANION_TURN: 'COMPANION_TURN',
  COMPANION_ACTION: 'COMPANION_ACTION',
  ENEMY_TURN: 'ENEMY_TURN',
  ENEMY_ANIMATE: 'ENEMY_ANIMATE',
  APPLY_ENEMY_DAMAGE: 'APPLY_ENEMY_DAMAGE',
  TURN_END: 'TURN_END',
  CHECK_END: 'CHECK_END',
  VICTORY: 'VICTORY',
  DEFEAT: 'DEFEAT',
  // Phase 32: New states
  GRAMMAR_COMBO: 'GRAMMAR_COMBO',
  TARGET_SELECT: 'TARGET_SELECT',
  ITEM_USE: 'ITEM_USE',
  FLEE_CHALLENGE: 'FLEE_CHALLENGE',
  COMPOUND_CHECK: 'COMPOUND_CHECK',
  ARENA_WAVE_TRANSITION: 'ARENA_WAVE_TRANSITION',
});

export { STATES as BATTLE_STATES };

export class BattleStateMachine {
  constructor(scene, battleConfig) {
    this.scene = scene;
    this.config = battleConfig;
    this.state = STATES.IDLE;
    this.currentAction = null;
    this.pendingInput = null;
    this.enemyAI = null;
    this.magicManager = null;
    this.companionBattleAI = null;
    this.isPlayerTurn = true; // Strict turns: player first

    // Phase 32: Multi-target manager
    this.multiTargetManager = null;
    this.isMultiTarget = false;

    // Phase 32: Grammar combo detector
    const completedLessons = store.getState().grammar?.completedLessons || [];
    this.grammarComboDetector = new GrammarComboDetector(completedLessons);

    // Phase 32: EventBus listeners for async responses
    this._grammarComboListener = null;
    this._fleeResponseListener = null;
    this._itemSelectListener = null;
    this._targetSelectListener = null;

    // Track the current word for Arabic input (for recordArabicUsed)
    this._currentBattleWord = null;

    // Initialize enemy AI
    const enemyId = battleConfig.enemyParty?.[0];
    const enemyData = typeof enemyId === 'string' ? getEnemy(enemyId) : null;
    if (enemyData) {
      const fsrsCards = store.getState().vocabulary?.fsrsCards || {};
      this.enemyAI = new EnemyAI(enemyData, fsrsCards);
    }

    // Initialize magic manager
    this.magicManager = new RootMagicManager(scene);

    // Initialize companion AI if active battle companion exists
    const activeParty = store.getState().companions?.activeParty;
    if (activeParty?.battle) {
      this.companionBattleAI = new CompanionBattleAI(activeParty.battle);
    }

    // Phase 32: Initialize multi-target if enemy party has multiple enemies
    if (battleConfig.enemyParty && battleConfig.enemyParty.length > 1) {
      this.isMultiTarget = true;
      this.multiTargetManager = new MultiTargetManager(scene);
    }
  }

  start() {
    // Dispatch startBattle to Redux
    const enemyId = this.config.enemyParty?.[0];
    const firstEnemyId = typeof enemyId === 'string' ? enemyId : enemyId?.enemyId || enemyId;
    const enemyData = getEnemy(firstEnemyId);

    // Get equipment bonuses from scene's EquipmentStats (HP/MP are additive)
    const equipmentBonuses = this.scene.equipmentStats?.getTotalBonuses() || { hp: 0, mp: 0 };
    const baseMaxHP = 100;
    const baseMaxMP = 50;

    if (this.isMultiTarget) {
      // Multi-enemy: dispatch startBattle with first enemy, then initMultiTargetBattle
      store.dispatch(
        startBattle({
          bossId: firstEnemyId,
          bossHP: enemyData?.baseHP || 100,
          encounterType: this.config.encounterType || 'random',
          zone: this.config.zone,
          enemyData: enemyData || null,
          playerMaxHP: baseMaxHP + equipmentBonuses.hp,
          playerMaxMP: baseMaxMP + equipmentBonuses.mp,
        })
      );

      // Build enemy party data for initMultiTargetBattle
      const enemyPartyData = this.config.enemyParty.map((entry) => {
        const id = typeof entry === 'string' ? entry : entry.enemyId || entry;
        const data = getEnemy(id);
        return {
          enemyId: id,
          hp: data?.baseHP || 100,
          maxHp: data?.baseHP || 100,
          row: typeof entry === 'object' ? entry.row : undefined,
        };
      });

      store.dispatch(initMultiTargetBattle({ enemyParty: enemyPartyData }));

      // Initialize MultiTargetManager with positions
      this.multiTargetManager.initEnemies(this.config.enemyParty);
    } else {
      // Single enemy: standard startBattle
      store.dispatch(
        startBattle({
          bossId: firstEnemyId,
          bossHP: enemyData?.baseHP || 100,
          encounterType: this.config.encounterType || 'random',
          zone: this.config.zone,
          enemyData: enemyData || null,
          playerMaxHP: baseMaxHP + equipmentBonuses.hp,
          playerMaxMP: baseMaxMP + equipmentBonuses.mp,
        })
      );
    }

    // Initialize companion battle state if companion exists
    if (this.companionBattleAI) {
      store.dispatch(
        initCompanionBattle({
          hp: this.companionBattleAI.baseStats.hp,
          mp: this.companionBattleAI.baseStats.mp,
        })
      );
    }

    this._transition(STATES.INTRO);
  }

  update() {
    switch (this.state) {
      case STATES.TURN_START:
        this._nextTurn();
        break;
      case STATES.CHECK_END:
        this._checkBattleEnd();
        break;
      default:
        break;
    }
  }

  // ─── State transitions ─────────────────────────────────────

  _transition(newState) {
    const oldState = this.state;
    this.state = newState;

    EventBus.emit(EVENTS.BATTLE_STATE_CHANGED, {
      from: oldState,
      to: newState,
    });

    this._onEnter(newState);
  }

  _onEnter(state) {
    switch (state) {
      case STATES.INTRO:
        this._playIntro();
        break;
      case STATES.PLAYER_TURN:
        this._startPlayerTurn();
        break;
      case STATES.ACTION_SELECT:
        EventBus.emit(EVENTS.BATTLE_STATE_CHANGED, {
          to: 'ACTION_SELECT',
          actions: this._getAvailableActions(),
        });
        break;
      case STATES.MAGIC_CAST:
        this._handleMagicCast();
        break;
      case STATES.INPUT_PHASE:
        this._promptArabicInput();
        break;
      case STATES.RESOLVE_ACTION:
        this._resolveAction();
        break;
      case STATES.APPLY_DAMAGE:
        this._applyDamage();
        break;
      case STATES.ANIMATE_HIT:
        this._animateHit();
        break;
      case STATES.COMPANION_TURN:
        this._startCompanionTurn();
        break;
      case STATES.ENEMY_TURN:
        this._startEnemyTurn();
        break;
      case STATES.ENEMY_ANIMATE:
        this._animateEnemyAction();
        break;
      case STATES.APPLY_ENEMY_DAMAGE:
        this._applyEnemyDamage();
        break;
      case STATES.TURN_END:
        this._endTurn();
        break;
      case STATES.VICTORY:
        this._handleVictory();
        break;
      case STATES.DEFEAT:
        this._handleDefeat();
        break;
      // Phase 32: New state handlers
      case STATES.GRAMMAR_COMBO:
        this._handleGrammarCombo();
        break;
      case STATES.ITEM_USE:
        this._handleItemUse();
        break;
      case STATES.FLEE_CHALLENGE:
        this._handleFleeChallenge();
        break;
      case STATES.COMPOUND_CHECK:
        this._handleCompoundCheck();
        break;
      case STATES.ARENA_WAVE_TRANSITION:
        // Handled externally by ArenaController
        break;
    }
  }

  // ─── Turn management ───────────────────────────────────────

  _nextTurn() {
    store.dispatch(incrementTurn());

    if (this.isPlayerTurn) {
      store.dispatch(setCurrentTurn('player'));
      this._transition(STATES.PLAYER_TURN);
    } else {
      store.dispatch(setCurrentTurn('enemy'));
      this._transition(STATES.ENEMY_TURN);
    }
  }

  // ─── Player turn ───────────────────────────────────────────

  _startPlayerTurn() {
    store.dispatch(setPlayerDefending(false));
    this._transition(STATES.ACTION_SELECT);
  }

  _getAvailableActions() {
    const actions = ['attack', 'defend'];

    // Magic if player has MP
    const battleState = store.getState().battle;
    if (battleState.playerMP >= 5) {
      actions.push('magic');
    }

    // Phase 32: Grammar combo if player has available combos
    const playerLevel = store.getState().player?.level || 1;
    const availableComboTypes = this.grammarComboDetector.getAvailableComboTypes(playerLevel);
    if (availableComboTypes.length > 0) {
      actions.push('combo');
    }

    // Phase 32: Item available if player has usable battle items
    const inventoryItems = store.getState().inventory?.items || [];
    const hasBattleItems = inventoryItems.some((item) => {
      // Check for usableInBattle flag (same logic as BattleItemMenu)
      return item.quantity > 0;
    });
    if (hasBattleItems) {
      actions.push('item');
    }

    // Flee always available
    actions.push('flee');

    return actions;
  }

  /**
   * Handle player action selection (from React via EventBus).
   */
  handleAction(action, target, slot) {
    if (this.state !== STATES.ACTION_SELECT) return;

    this.currentAction = { type: action, target: target || 0, slot };

    if (action === 'flee') {
      // Phase 32: Flee now uses Arabic challenge instead of random chance
      this._transition(STATES.FLEE_CHALLENGE);
      return;
    }

    if (action === 'defend') {
      store.dispatch(setPlayerDefending(true));
      this._transition(STATES.RESOLVE_ACTION);
      return;
    }

    if (action === 'item') {
      // Phase 32: Item use via ITEM_USE state
      this._transition(STATES.ITEM_USE);
      return;
    }

    if (action === 'combo') {
      // Phase 32: Grammar combo
      this._transition(STATES.GRAMMAR_COMBO);
      return;
    }

    if (action === 'magic') {
      // Magic requires spell slot and transitions to MAGIC_CAST
      this._transition(STATES.MAGIC_CAST);
      return;
    }

    // Attack requires Arabic input
    this._transition(STATES.INPUT_PHASE);
  }

  /**
   * Handle Arabic input result (from React via EventBus).
   * CRITICAL: Captures every Arabic word used via recordArabicUsed.
   */
  handleArabicInput(result) {
    if (this.state !== STATES.INPUT_PHASE) return;

    this.pendingInput = result;

    // Phase 32 CRITICAL: Record Arabic word used for PostBattleReview
    if (this._currentBattleWord) {
      store.dispatch(recordArabicUsed({
        word: this._currentBattleWord.arabic,
        accuracy: result?.accuracy || 0,
        comboType: null, // Normal attack, not a combo
      }));
    }

    this._transition(STATES.RESOLVE_ACTION);
  }

  /**
   * Handle flee attempt.
   */
  handleFlee() {
    if (this.state !== STATES.ACTION_SELECT) return;
    this.currentAction = { type: 'flee', target: 0 };
    this._transition(STATES.FLEE_CHALLENGE);
  }

  // ─── Phase 32: Grammar Combo ────────────────────────────────

  _handleGrammarCombo() {
    const playerLevel = store.getState().player?.level || 1;
    const availableTypes = this.grammarComboDetector.getAvailableComboTypes(playerLevel);

    // Emit grammar combo event for React GrammarComboInput
    EventBus.emit(EVENTS.BATTLE_GRAMMAR_COMBO, {
      availableTypes,
      playerLevel,
    });

    // Listen for response from React GrammarComboInput
    this._grammarComboListener = (comboResult) => {
      EventBus.off(EVENTS.BATTLE_ARABIC_INPUT, this._grammarComboListener);
      this._grammarComboListener = null;

      if (!comboResult || comboResult.cancelled) {
        // Player cancelled combo, return to action select
        this._transition(STATES.ACTION_SELECT);
        return;
      }

      const { comboType, arabicInput, sentenceParts, previousVerbs } = comboResult;
      let result = null;

      // Validate the combo via GrammarComboDetector
      if (comboType === 'noun_adjective') {
        result = this.grammarComboDetector.detectNounAdjectiveCombo(arabicInput);
      } else if (comboType === 'verb_chain') {
        result = this.grammarComboDetector.detectVerbConjugationChain(arabicInput, previousVerbs || []);
      } else if (comboType === 'ultimate_sentence') {
        result = this.grammarComboDetector.detectSentenceCombo(sentenceParts || {});
      }

      // CRITICAL: Record Arabic used for PostBattleReview regardless of validity
      const arabicWord = arabicInput || (sentenceParts ? Object.values(sentenceParts).join(' ') : '');
      if (arabicWord) {
        store.dispatch(recordArabicUsed({
          word: arabicWord,
          accuracy: result?.valid ? (result.accuracy || 1.0) : 0,
          comboType: comboType || 'grammar',
        }));
      }

      if (result?.valid) {
        // Apply combo multiplier to damage
        const baseDamage = 10;
        const equipmentDamageMult = this.scene.equipmentStats?.getStatForBattle('damage') || 1.0;
        const comboDamage = Math.floor(baseDamage * result.damageMultiplier * equipmentDamageMult);

        this.currentAction = {
          type: 'combo',
          target: this.currentAction?.target || 0,
          resolvedDamage: comboDamage,
          wasCorrect: true,
          isMiss: false,
          comboType: result.comboType,
          damageMultiplier: result.damageMultiplier,
        };

        // Update combo meter: +25 for grammar combo
        store.dispatch(updateComboMeter({ amount: 25 }));

        // Set grammar combo state in Redux
        store.dispatch(setGrammarComboState({
          type: comboType,
          chain: [arabicWord],
          multiplier: result.damageMultiplier,
        }));

        this._transition(STATES.APPLY_DAMAGE);
      } else {
        // Combo failed — return to action select
        store.dispatch(resetComboMeter());
        this._transition(STATES.ACTION_SELECT);
      }
    };

    EventBus.on(EVENTS.BATTLE_ARABIC_INPUT, this._grammarComboListener);
  }

  // ─── Phase 32: Flee Challenge (Arabic-based) ────────────────

  _handleFleeChallenge() {
    // Select a word for the flee challenge (prefer easier/familiar words)
    const fleeWord = this._selectFleeWord();

    // Emit flee challenge event for React BattleArabicInput in flee mode
    EventBus.emit(EVENTS.BATTLE_FLEE_CHALLENGE, {
      word: fleeWord,
      timeLimit: 10000, // 10 second limit for flee
    });

    // Listen for flee response
    this._fleeResponseListener = (result) => {
      EventBus.off(EVENTS.BATTLE_ARABIC_INPUT, this._fleeResponseListener);
      this._fleeResponseListener = null;

      // CRITICAL: Record Arabic used for PostBattleReview regardless of success
      store.dispatch(recordArabicUsed({
        word: fleeWord.arabic,
        accuracy: result?.accuracy || 0,
        comboType: 'flee',
      }));

      if (result?.accuracy >= 0.8) {
        // Successful flee
        const battleResult = this._calculateRewards(false);
        battleResult.fled = true;
        store.dispatch(endBattle(battleResult));
        this.scene.exitBattle(battleResult);
      } else {
        // Failed flee — enemy gets free turn
        EventBus.emit(EVENTS.BATTLE_FLEE_FAILED, {
          accuracy: result?.accuracy || 0,
          word: fleeWord,
        });
        this.isPlayerTurn = false;
        this._transition(STATES.TURN_END);
      }
    };

    EventBus.on(EVENTS.BATTLE_ARABIC_INPUT, this._fleeResponseListener);
  }

  /**
   * Select a word for flee challenge — prefer words with higher familiarity (easier).
   */
  _selectFleeWord() {
    const vocabState = store.getState().vocabulary;
    const learnedWords = vocabState?.learnedWords || [];

    if (learnedWords.length === 0) {
      return { id: 'hello', arabic: '\u0645\u0631\u062D\u0628\u0627', english: 'Hello', element: null };
    }

    // Prefer words with higher stability (more familiar) for flee — should be easier
    const fsrsCards = vocabState?.fsrsCards || {};
    const sortedByStability = [...learnedWords].sort((a, b) => {
      const stabilityA = fsrsCards[a.id]?.card?.stability || 0;
      const stabilityB = fsrsCards[b.id]?.card?.stability || 0;
      return stabilityB - stabilityA; // Higher stability first (more familiar)
    });

    // Pick from top 30% most familiar words
    const easyPoolSize = Math.max(1, Math.floor(sortedByStability.length * 0.3));
    const easyPool = sortedByStability.slice(0, easyPoolSize);
    return easyPool[Math.floor(Math.random() * easyPool.length)];
  }

  // ─── Phase 32: Item Use ─────────────────────────────────────

  _handleItemUse() {
    // Emit item menu open event for React BattleItemMenu
    EventBus.emit(EVENTS.BATTLE_ITEM_MENU_OPEN, {});

    // Listen for item selection from React
    this._itemSelectListener = (itemResult) => {
      EventBus.off(EVENTS.BATTLE_ITEM_USED, this._itemSelectListener);
      this._itemSelectListener = null;

      if (!itemResult || itemResult.cancelled) {
        // Player cancelled item use, return to action select
        this._transition(STATES.ACTION_SELECT);
        return;
      }

      const { itemId, effect } = itemResult;

      // Consume the item from inventory
      store.dispatch(consumeItem({ itemId }));

      // Apply buff if the item has stat effects
      if (effect) {
        store.dispatch(applyBuff({
          buffId: itemId,
          stat: effect.stat || 'hpRegen',
          value: effect.value || 0,
          duration: effect.duration || 60000,
          source: 'consumable',
        }));
      }

      // Item use counts as the player's turn action
      this.currentAction = {
        type: 'item',
        target: 0,
        resolvedDamage: 0,
        wasCorrect: true,
        isMiss: false,
      };

      this._transition(STATES.RESOLVE_ACTION);
    };

    EventBus.on(EVENTS.BATTLE_ITEM_USED, this._itemSelectListener);
  }

  // ─── Phase 32: Compound Effect Check ────────────────────────

  _handleCompoundCheck() {
    const battleState = store.getState().battle;

    // Check player effects for compounds
    const playerCompound = CompoundEffectResolver.checkForCompounds(battleState.playerEffects);
    if (playerCompound) {
      // Apply compound effect to player
      store.dispatch(applyStatusEffect({
        target: 'player',
        effect: {
          id: playerCompound.id,
          remainingTurns: playerCompound.turns,
          compound: true,
          ...(playerCompound.effect || {}),
        },
      }));

      EventBus.emit(EVENTS.BATTLE_COMPOUND_TRIGGERED, {
        target: 'player',
        compound: playerCompound,
      });
    }

    // Check enemy effects for compounds
    const enemyCompound = CompoundEffectResolver.checkForCompounds(battleState.enemyEffects);
    if (enemyCompound) {
      store.dispatch(applyStatusEffect({
        target: 'enemy',
        effect: {
          id: enemyCompound.id,
          remainingTurns: enemyCompound.turns,
          compound: true,
          ...(enemyCompound.effect || {}),
        },
      }));

      EventBus.emit(EVENTS.BATTLE_COMPOUND_TRIGGERED, {
        target: 'enemy',
        compound: enemyCompound,
      });
    }

    // Continue to CHECK_END
    this._transition(STATES.CHECK_END);
  }

  // ─── Magic casting ─────────────────────────────────────────

  _handleMagicCast() {
    const state = store.getState();
    const equippedSpells = state.magic?.equippedSpells || [];
    const spell = equippedSpells[this.currentAction.slot];

    if (!spell) {
      console.error('[BattleStateMachine] No spell in slot', this.currentAction.slot);
      this._transition(STATES.ACTION_SELECT);
      return;
    }

    // Get a random derived word from the spell's root for Arabic input challenge
    const rootInfo = getRootWords(spell.rootId);
    let challengeWord = null;

    if (rootInfo && rootInfo.words && rootInfo.words.length > 0) {
      // Pick a random word from this root
      const randomWordId = rootInfo.words[Math.floor(Math.random() * rootInfo.words.length)];
      // We need to look up the full word data (this is a simplification - in reality we'd use vocabularyAll.js)
      challengeWord = {
        id: randomWordId,
        arabic: randomWordId, // Simplified - actual word would come from vocabulary data
        english: rootInfo.meaning || 'word',
        element: spell.element,
      };
    } else {
      // Fallback: generic word
      challengeWord = {
        id: 'generic',
        arabic: spell.rootId,
        english: 'magic word',
        element: spell.element,
      };
    }

    // Store the spell and target info for later resolution
    this.pendingInput = {
      spell,
      targetIndex: this.currentAction.target || 0,
    };

    // Track current word for recordArabicUsed
    this._currentBattleWord = challengeWord;

    // Transition to INPUT_PHASE with the challenge word
    this._transition(STATES.INPUT_PHASE);

    // Emit the prompt with the challenge word
    EventBus.emit(EVENTS.BATTLE_PROMPT_WORD, {
      word: challengeWord,
      difficulty: this._determineDifficulty(),
      action: 'magic',
      timeLimit: this._getTimeLimit(this._determineDifficulty()),
    });
  }

  // ─── Arabic input ──────────────────────────────────────────

  _promptArabicInput() {
    const word = this._selectBattleWord();
    const difficulty = this._determineDifficulty();

    // Track current word for recordArabicUsed
    this._currentBattleWord = word;

    EventBus.emit(EVENTS.BATTLE_PROMPT_WORD, {
      word,
      difficulty,
      action: this.currentAction.type,
      timeLimit: this._getTimeLimit(difficulty),
    });
  }

  _selectBattleWord() {
    // Select from player's vocabulary, weighted toward due/weak words
    const vocabState = store.getState().vocabulary;
    const learnedWords = vocabState?.learnedWords || [];

    if (learnedWords.length === 0) {
      // Fallback: a simple word for new players
      return { id: 'hello', arabic: '\u0645\u0631\u062D\u0628\u0627', english: 'Hello', element: null };
    }

    // Prefer words that are due for review (FSRS integration)
    const fsrsCards = vocabState?.fsrsCards || {};
    const now = Date.now();
    const dueWords = learnedWords.filter((w) => {
      const card = fsrsCards[w.id];
      if (!card?.card?.due) return true; // No card = new = due
      return new Date(card.card.due).getTime() <= now;
    });

    const pool = dueWords.length > 0 ? dueWords : learnedWords;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  _determineDifficulty() {
    const playerLevel = store.getState().player?.level || 1;
    if (playerLevel <= 3) return 'choice'; // Multiple choice for beginners
    return 'type'; // Free typing for intermediate+
  }

  _getTimeLimit(difficulty) {
    return difficulty === 'choice' ? 15000 : 20000;
  }

  // ─── Damage resolution ─────────────────────────────────────

  _resolveAction() {
    const action = this.currentAction;
    const input = this.pendingInput;

    if (action.type === 'attack') {
      const enemyData = store.getState().battle.enemyData;

      // Get equipment damage bonus from scene's EquipmentStats
      const equipmentDamageMult = this.scene.equipmentStats?.getStatForBattle('damage') || 1.0;

      const result = calculateDamage({
        baseDamage: 10,
        accuracy: input?.accuracy || 0,
        timeElapsedMs: input?.timeElapsed || 20000,
        element: null,
        targetElement: enemyData?.element || null,
        streak: store.getState().battle.streak,
        playerLevel: store.getState().player?.level || 1,
        isMagic: false,
        equipmentDamageMult,
      });
      action.resolvedDamage = result.damage;
      action.isMiss = result.isMiss;
      action.isCritical = result.isCritical;
      action.wasCorrect = !result.isMiss;

      // Phase 32: Update combo meter based on result
      if (action.wasCorrect) {
        store.dispatch(updateComboMeter({ amount: 10 }));
      } else {
        store.dispatch(resetComboMeter());
      }
    } else if (action.type === 'magic') {
      // Magic uses RootMagicManager for damage calculation
      // pendingInput from _handleMagicCast contains spell info
      const spell = input?.spell;
      const targetIndex = input?.targetIndex || 0;
      const accuracy = input?.accuracy || 0;

      if (spell) {
        // Cast spell via RootMagicManager (it handles MP, damage, combos)
        const success = this.magicManager.castSpell(action.slot, targetIndex, accuracy);

        if (success) {
          // RootMagicManager handles damage via delayed call, so we mark action as completed
          action.wasCorrect = true;
          action.isMiss = false;
          action.element = spell.element;
          // Damage is handled by RootMagicManager, not here
          action.resolvedDamage = 0; // Will be applied by manager
        } else {
          // Spell failed (not enough MP)
          action.wasCorrect = false;
          action.isMiss = true;
          action.resolvedDamage = 0;
        }
      } else {
        // Fallback to old magic system if no spell found
        const enemyData = store.getState().battle.enemyData;
        store.dispatch(spendMP(5));
        const result = calculateDamage({
          baseDamage: 12,
          accuracy: input?.accuracy || 0,
          timeElapsedMs: input?.timeElapsed || 20000,
          element: input?.element || null,
          targetElement: enemyData?.element || null,
          streak: store.getState().battle.streak,
          playerLevel: store.getState().player?.level || 1,
          isMagic: true,
        });
        action.resolvedDamage = result.damage;
        action.isMiss = result.isMiss;
        action.isCritical = result.isCritical;
        action.wasCorrect = !result.isMiss;
        action.element = input?.element;
      }
    } else if (action.type === 'defend') {
      action.resolvedDamage = 0;
      action.wasCorrect = true;
    } else if (action.type === 'item') {
      action.resolvedDamage = 0;
      action.wasCorrect = true;
    } else if (action.type === 'combo') {
      // Phase 32: Combo damage already resolved in _handleGrammarCombo
      // Just pass through
    }

    // Update FSRS for the word used
    if (input?.wordId) {
      store.dispatch(recordWordUsed(input.wordId));
    }

    this._transition(STATES.APPLY_DAMAGE);
  }

  _applyDamage() {
    const { resolvedDamage, wasCorrect, isMiss, target } = this.currentAction;

    if (isMiss || !wasCorrect) {
      // Player takes counter-damage on miss
      const counterDamage = Math.max(1, Math.floor((resolvedDamage || 5) * 0.5));
      store.dispatch(dealDamage({ damage: counterDamage, correct: false }));
    } else if (resolvedDamage > 0) {
      if (this.isMultiTarget && store.getState().battle.enemies.length > 1) {
        // Phase 32: Multi-target — use dealDamageToEnemy with row modifier
        const battleState = store.getState().battle;
        const targetIdx = target || battleState.targetIndex || 0;
        const targetEnemy = battleState.enemies[targetIdx];
        const playerRow = battleState.playerRow || 'front';
        const targetRow = targetEnemy?.row || 'front';

        // Apply row damage modifier from MultiTargetManager
        const rowModifier = this.multiTargetManager
          ? this.multiTargetManager.getRowDamageModifier(playerRow, targetRow)
          : 1.0;
        const modifiedDamage = Math.floor(resolvedDamage * rowModifier);

        store.dispatch(dealDamageToEnemy({ enemyIndex: targetIdx, damage: modifiedDamage }));

        // Also update single-enemy tracking for streak
        store.dispatch(dealDamage({ damage: 0, correct: true }));
      } else {
        // Single target: standard damage
        store.dispatch(dealDamage({ damage: resolvedDamage, correct: true }));
      }
      const streak = store.getState().battle.streak;
      EventBus.emit(EVENTS.BATTLE_COMBO_UPDATE, { streak });
    }

    this._transition(STATES.ANIMATE_HIT);
  }

  _animateHit() {
    const { resolvedDamage, wasCorrect, isMiss, type, element, target, isCritical } =
      this.currentAction;

    const sprites = this.scene.sprites;
    const effects = this.scene.effects;
    const damagePool = this.scene.damagePool;
    const screenShake = this.scene.screenShake;

    if (wasCorrect && !isMiss) {
      // ── Player hits enemy ──
      const playAnim =
        type === 'magic'
          ? (cb) => sprites.playPlayerCast(cb)
          : (cb) => sprites.playPlayerAttack(cb);

      playAnim(() => {
        // Hit-stop
        effects.hitStop(isCritical ? 5 : 3);

        // Screen shake
        screenShake.shake(isCritical ? 'critical' : 'hit');

        // Critical flash
        if (isCritical) {
          effects.screenFlash(0xffd700, 80);
        }

        const afterSpell = () => {
          // Enemy hurt animation
          sprites.playEnemyHurt(target || 0, () => {
            // Floating damage number
            const enemySprite = sprites.enemySprites[target || 0]?.sprite;
            if (enemySprite) {
              damagePool.show(
                enemySprite.x,
                enemySprite.y - 40,
                resolvedDamage,
                isCritical ? 'critical' : 'damage'
              );
            }

            // Update HP bar
            const battleState = store.getState().battle;
            this.scene.hud.setEnemyHP(battleState.bossHP);

            this._transition(STATES.TURN_END);
          });
        };

        // Spell effect (if magic)
        if (type === 'magic' && element) {
          const enemySprite = sprites.enemySprites[target || 0]?.sprite;
          if (enemySprite) {
            effects.playSpellEffect(element, enemySprite.x, enemySprite.y, afterSpell);
          } else {
            afterSpell();
          }
        } else {
          afterSpell();
        }
      });
    } else {
      // ── Player missed ──
      const enemySprite = sprites.enemySprites[target || 0]?.sprite;
      if (enemySprite) {
        damagePool.show(enemySprite.x, enemySprite.y - 40, 'MISS', 'miss');
      }

      const counterDamage = Math.max(1, Math.floor((resolvedDamage || 5) * 0.5));
      sprites.playPlayerHurt(() => {
        if (sprites.playerSprite) {
          damagePool.show(sprites.playerSprite.x, sprites.playerSprite.y - 40, counterDamage, 'damage');
        }
        this.scene.hud.setPlayerHP(store.getState().battle.playerHP);
        this._transition(STATES.TURN_END);
      });

      screenShake.shake('hit');
    }
  }

  // ─── Companion turn ────────────────────────────────────────

  _startCompanionTurn() {
    if (!this.companionBattleAI) {
      // No companion, skip to enemy turn
      this._transition(STATES.ENEMY_TURN);
      return;
    }

    // Emit companion turn start event
    EventBus.emit(EVENTS.COMPANION_BATTLE_TURN_START, {
      companionId: this.companionBattleAI.companionId,
    });

    // Build battleState object from Redux
    const battleState = store.getState().battle;
    const companionState = {
      playerHP: battleState.playerHP,
      playerMaxHP: battleState.playerMaxHP,
      companionHP: battleState.companionHP ?? this.companionBattleAI.baseStats.hp,
      companionMaxHP: this.companionBattleAI.baseStats.hp,
      companionMP: battleState.companionMP ?? this.companionBattleAI.baseStats.mp,
      enemyHP: battleState.bossHP || 0,
      enemyMaxHP: battleState.maxBossHP || 100,
      playerEffects: battleState.playerEffects ?? [],
      companionEffects: battleState.companionEffects ?? [],
      enemyEffects: battleState.enemyEffects ?? [],
    };

    // Get AI decision
    const action = this.companionBattleAI.selectAction(companionState);

    // Emit action for React UI display
    EventBus.emit(EVENTS.COMPANION_BATTLE_ACTION, {
      companionId: this.companionBattleAI.companionId,
      action,
    });

    // 500ms delay before resolving (gives React time to show companion action)
    this.scene.time.delayedCall(500, () => {
      this._resolveCompanionAction(action);
    });
  }

  _resolveCompanionAction(action) {
    switch (action.action) {
      case 'attack':
        store.dispatch(dealDamage({ damage: action.damage, correct: true }));
        break;
      case 'skill':
        store.dispatch(dealDamage({ damage: action.damage, correct: true }));
        store.dispatch(spendCompanionMP(action.mpCost));
        break;
      case 'heal':
        if (action.target === 'player') {
          store.dispatch(healPlayer(action.healAmount));
        } else {
          store.dispatch(healCompanion(action.healAmount));
        }
        store.dispatch(spendCompanionMP(action.mpCost));
        break;
      case 'defend':
        store.dispatch(setCompanionDefending(true));
        break;
      case 'buff':
        store.dispatch(
          applyPlayerEffect({ id: action.effectId, duration: action.duration, source: 'companion' })
        );
        store.dispatch(spendCompanionMP(action.mpCost));
        break;
      case 'dispel':
        store.dispatch(removeEnemyEffect(0)); // Remove first enemy buff
        store.dispatch(spendCompanionMP(action.mpCost));
        break;
    }

    // Emit turn end
    EventBus.emit(EVENTS.COMPANION_BATTLE_TURN_END, {
      companionId: this.companionBattleAI.companionId,
    });

    // Transition to ENEMY_TURN
    this._transition(STATES.ENEMY_TURN);
  }

  // ─── Enemy turn ────────────────────────────────────────────

  _startEnemyTurn() {
    if (!this.enemyAI) {
      this._transition(STATES.TURN_END);
      return;
    }

    const battleState = store.getState().battle;
    const enemyAction = this.enemyAI.decide(battleState);
    this.currentAction = enemyAction;

    EventBus.emit(EVENTS.BATTLE_ENEMY_ACTION, {
      enemyId: enemyAction.enemyId,
      actionType: enemyAction.type,
      intent: enemyAction.intentText,
    });

    // Brief pause to show intent
    this.scene.time.delayedCall(600, () => {
      if (enemyAction.type === 'heal') {
        this._applyEnemyHeal(enemyAction);
      } else if (enemyAction.type === 'defend') {
        // Enemy defend — skip damage, go to turn end
        this._transition(STATES.TURN_END);
      } else {
        this._transition(STATES.ENEMY_ANIMATE);
      }
    });
  }

  _animateEnemyAction() {
    const { enemyIndex } = this.currentAction;
    this.scene.sprites.playEnemyAttack(enemyIndex || 0, () => {
      this._transition(STATES.APPLY_ENEMY_DAMAGE);
    });
  }

  _applyEnemyDamage() {
    const { damage, type } = this.currentAction;
    const effects = this.scene.effects;
    const sprites = this.scene.sprites;
    const damagePool = this.scene.damagePool;
    const screenShake = this.scene.screenShake;

    const isDefending = store.getState().battle.isPlayerDefending;

    // Apply equipment defense bonus (reduces incoming damage)
    const equipmentDefenseMult = this.scene.equipmentStats?.getStatForBattle('defense') || 1.0;
    let reducedDamage = Math.floor(damage / equipmentDefenseMult);

    // Apply defend bonus (50% reduction)
    const finalDamage = isDefending ? Math.floor(reducedDamage * 0.5) : reducedDamage;

    store.dispatch(dealDamageToPlayer({ damage: finalDamage }));

    effects.hitStop(2);
    screenShake.shake('hit');

    // Spell effect for special attacks
    if (type === 'special' && this.currentAction.element) {
      const playerSprite = sprites.playerSprite;
      if (playerSprite) {
        effects.playSpellEffect(this.currentAction.element, playerSprite.x, playerSprite.y, () => { });
      }
    }

    const playAnim = isDefending
      ? (cb) => sprites.playPlayerDefend(cb)
      : (cb) => sprites.playPlayerHurt(cb);

    playAnim(() => {
      if (sprites.playerSprite) {
        damagePool.show(sprites.playerSprite.x, sprites.playerSprite.y - 40, finalDamage, 'damage');
      }
      this.scene.hud.setPlayerHP(store.getState().battle.playerHP);
      this._transition(STATES.TURN_END);
    });
  }

  _applyEnemyHeal(action) {
    const amount = action.healAmount || 0;
    store.dispatch(healEnemy({ amount }));
    this.scene.hud.setEnemyHP(store.getState().battle.bossHP);
    this.scene.damagePool.show(
      this.scene.sprites.enemySprites[0]?.sprite?.x || 200,
      (this.scene.sprites.enemySprites[0]?.sprite?.y || 200) - 40,
      `+${amount}`,
      'heal'
    );
    this._transition(STATES.TURN_END);
  }

  // ─── Turn end / check ──────────────────────────────────────

  _endTurn() {
    this.currentAction = null;
    this.pendingInput = null;
    this._currentBattleWord = null;

    // Check if player turn just ended and we have companion
    if (this.isPlayerTurn && this.companionBattleAI) {
      // Player turn done, companion turn next — toggle BEFORE branching
      this.isPlayerTurn = false;
      this._transition(STATES.COMPANION_TURN);
      return;
    }

    // Alternate turns (strict turn mode)
    this.isPlayerTurn = !this.isPlayerTurn;

    // Tick status effects
    store.dispatch(tickStatusEffects());

    // Phase 32: Check for compound effects after tick
    const battleState = store.getState().battle;
    const playerCompound = CompoundEffectResolver.checkForCompounds(battleState.playerEffects);
    const enemyCompound = CompoundEffectResolver.checkForCompounds(battleState.enemyEffects);

    if (playerCompound || enemyCompound) {
      this._transition(STATES.COMPOUND_CHECK);
    } else {
      this._transition(STATES.CHECK_END);
    }
  }

  _checkBattleEnd() {
    const battleState = store.getState().battle;

    // Phase 32: Multi-target check
    if (this.isMultiTarget && battleState.enemies.length > 0) {
      if (selectAllEnemiesDefeated({ battle: battleState })) {
        this._transition(STATES.VICTORY);
        return;
      }
    } else if (battleState.bossHP <= 0) {
      this._transition(STATES.VICTORY);
      return;
    }

    if (battleState.playerHP <= 0) {
      this._transition(STATES.DEFEAT);
    } else {
      this._transition(STATES.TURN_START);
    }
  }

  // ─── Intro / Outro ─────────────────────────────────────────

  _playIntro() {
    this.scene.cameras.main.fadeIn(500);

    const enemyData = store.getState().battle.enemyData;
    const enemyName = enemyData?.nameArabic || enemyData?.name || 'Enemy';

    this.scene.time.delayedCall(800, () => {
      EventBus.emit(EVENTS.BATTLE_ENEMY_ACTION, {
        actionType: 'intro',
        intent: `${enemyName} appears!`,
      });

      this.scene.time.delayedCall(1200, () => {
        this._transition(STATES.TURN_START);
      });
    });
  }

  _handleVictory() {
    const sprites = this.scene.sprites;
    sprites.playPlayerVictory();

    sprites.enemySprites.forEach((_, idx) => {
      sprites.playEnemyDefeat(idx, () => { });
    });

    const result = this._calculateRewards(true);

    // Reset magic battle state
    if (this.magicManager) {
      this.magicManager.resetBattleState();
    }

    // Phase 32: Clear grammar combo state
    store.dispatch(clearGrammarComboState());

    // Phase 32: Emit post-battle review data for React PostBattleReview
    const arabicUsed = selectArabicUsedThisBattle(store.getState());
    EventBus.emit(EVENTS.BATTLE_POST_REVIEW, {
      arabicUsed,
      victory: true,
      rewards: result.rewards,
    });

    this.scene.time.delayedCall(2000, () => {
      store.dispatch(endBattle(result));
      this.scene.exitBattle(result);
    });
  }

  _handleDefeat() {
    this.scene.sprites.playPlayerDefeat();
    const result = this._calculateRewards(false);

    // Reset magic battle state
    if (this.magicManager) {
      this.magicManager.resetBattleState();
    }

    // Phase 32: Clear grammar combo state
    store.dispatch(clearGrammarComboState());

    // Phase 32: Emit post-battle review data even on defeat
    const arabicUsed = selectArabicUsedThisBattle(store.getState());
    EventBus.emit(EVENTS.BATTLE_POST_REVIEW, {
      arabicUsed,
      victory: false,
      rewards: result.rewards,
    });

    this.scene.time.delayedCall(2000, () => {
      store.dispatch(endBattle(result));
      this.scene.exitBattle(result);
    });
  }

  _calculateRewards(victory) {
    const state = store.getState().battle;
    const accuracy = state.currentRound > 0 ? state.wordsUsed.length / state.currentRound : 0;
    const timeElapsed = state.battleStartTimestamp ? Date.now() - state.battleStartTimestamp : 0;

    if (!victory) {
      return {
        victory: false,
        accuracy,
        timeElapsed,
        rewards: { xp: Math.floor(state.currentRound * 5), dirhams: 0 },
        bossId: state.activeBattle,
      };
    }

    const enemyData = state.enemyData;
    const baseXP = enemyData?.xpReward || 100;
    const baseDirhams = enemyData?.dirhamReward || 50;
    const streakBonus = 1 + state.maxStreak * 0.05;
    const accuracyBonus = 1 + accuracy * 0.3;

    return {
      victory: true,
      accuracy,
      timeElapsed,
      rewards: {
        xp: Math.floor(baseXP * streakBonus * accuracyBonus),
        dirhams: Math.floor(baseDirhams * accuracyBonus),
      },
      wordsUsed: state.wordsUsed,
      maxStreak: state.maxStreak,
      bossId: state.activeBattle,
    };
  }

  // ─── Flee (legacy wrapper) ──────────────────────────────────

  _handleFlee() {
    // Phase 32: Delegate to flee challenge (Arabic-based)
    this._transition(STATES.FLEE_CHALLENGE);
  }

  destroy() {
    this.state = STATES.IDLE;
    this.currentAction = null;
    this.pendingInput = null;
    this.enemyAI = null;
    this._currentBattleWord = null;

    // Clean up Phase 32 EventBus listeners
    if (this._grammarComboListener) {
      EventBus.off(EVENTS.BATTLE_ARABIC_INPUT, this._grammarComboListener);
      this._grammarComboListener = null;
    }
    if (this._fleeResponseListener) {
      EventBus.off(EVENTS.BATTLE_ARABIC_INPUT, this._fleeResponseListener);
      this._fleeResponseListener = null;
    }
    if (this._itemSelectListener) {
      EventBus.off(EVENTS.BATTLE_ITEM_USED, this._itemSelectListener);
      this._itemSelectListener = null;
    }
    if (this._targetSelectListener) {
      EventBus.off(EVENTS.BATTLE_TARGET_SELECT, this._targetSelectListener);
      this._targetSelectListener = null;
    }

    // Reset magic battle state
    if (this.magicManager) {
      this.magicManager.resetBattleState();
      this.magicManager = null;
    }

    // Phase 32: Destroy multi-target manager
    if (this.multiTargetManager) {
      this.multiTargetManager.destroy();
      this.multiTargetManager = null;
    }

    this.grammarComboDetector = null;
  }
}
