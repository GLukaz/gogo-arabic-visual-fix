/**
 * BattleOverlay.jsx — React overlay container for all battle UI.
 *
 * Listens to EventBus for BattleScene state changes.
 * Renders BattleMenu (action select), BattleArabicInput (word prompt),
 * ComboCounter (streak), enemy intent text, and BattleResult (victory/defeat).
 *
 * Phase 32 additions:
 * - StatusEffectBar (player + enemy effects)
 * - ComboMeter (combo charge gauge)
 * - GrammarComboInput (grammar combo multi-field input)
 * - BattleItemMenu (battle-usable inventory items)
 * - TargetSelector (multi-enemy target selection)
 * - ArenaHUD (arena wave-based combat overlay)
 * - PostBattleReview (post-battle Arabic analytics)
 * - BossRushInterlude (story interludes between boss rush fights)
 * - Flee challenge via BattleArabicInput in flee mode
 *
 * Mounted inside GameLayout. Only visible when battle is active.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './BattleOverlay.module.css';

import BattleMenu from './BattleMenu.jsx';
import BattleArabicInput from './BattleArabicInput.jsx';
import ComboCounter from './ComboCounter.jsx';
import BattleResult from './BattleResult.jsx';

// Phase 32 components
import StatusEffectBar from './StatusEffectBar.jsx';
import ComboMeter from './ComboMeter.jsx';
import GrammarComboInput from './GrammarComboInput.jsx';
import BattleItemMenu from './BattleItemMenu.jsx';
import TargetSelector from './TargetSelector.jsx';
import ArenaHUD from './ArenaHUD.jsx';
import PostBattleReview from './PostBattleReview.jsx';
import BossRushInterlude from './BossRushInterlude.jsx';

export default function BattleOverlay() {
  const [battleActive, setBattleActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [availableActions, setAvailableActions] = useState([]);
  const [prompt, setPrompt] = useState(null);
  const [enemyAction, setEnemyAction] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [companionAction, setCompanionAction] = useState(null);
  const [isCompanionTurn, setIsCompanionTurn] = useState(false);

  // Phase 32 state
  const [showGrammarCombo, setShowGrammarCombo] = useState(false);
  const [grammarComboData, setGrammarComboData] = useState(null);
  const [showItemMenu, setShowItemMenu] = useState(false);
  const [showTargetSelector, setShowTargetSelector] = useState(false);
  const [targetSelectorData, setTargetSelectorData] = useState(null);
  const [showPostReview, setShowPostReview] = useState(false);
  const [_postReviewData, setPostReviewData] = useState(null);
  const [showArenaHUD, setShowArenaHUD] = useState(false);
  const [fleeChallengeData, setFleeChallengeData] = useState(null);

  const streak = useSelector((s) => s.battle.streak);
  const activeParty = useSelector((s) => s.companions?.activeParty);
  const allCompanions = useSelector((s) => s.companions?.companions);
  const battleState = useSelector((s) => s.battle);

  // Phase 32 selectors
  const playerEffects = useSelector((s) => s.battle.playerEffects);
  const enemyEffects = useSelector((s) => s.battle.enemyEffects);
  const comboMeter = useSelector((s) => s.battle.comboMeter);
  const maxComboMeter = useSelector((s) => s.battle.maxComboMeter);
  const grammarComboState = useSelector((s) => s.battle.grammarComboState);
  const enemies = useSelector((s) => s.battle.enemies);
  const arabicUsedThisBattle = useSelector((s) => s.battle.arabicUsedThisBattle);
  const maxStreak = useSelector((s) => s.battle.maxStreak);

  // Freeze player when battle is active, unfreeze when component unmounts
  useEffect(() => {
    if (battleActive) {
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    }
    return () => {
      if (battleActive) {
        EventBus.emit(EVENTS.PLAYER_UNFREEZE);
      }
    };
  }, [battleActive]);

  useEffect(() => {
    const onBattleStarted = () => {
      setBattleActive(true);
      setPhase('intro');
      setBattleResult(null);
      // Reset Phase 32 state on new battle
      setShowGrammarCombo(false);
      setGrammarComboData(null);
      setShowItemMenu(false);
      setShowTargetSelector(false);
      setTargetSelectorData(null);
      setShowPostReview(false);
      setPostReviewData(null);
      setFleeChallengeData(null);
    };

    const onStateChanged = ({ to, actions }) => {
      setPhase(to);
      if (to === 'ACTION_SELECT' && actions) {
        setAvailableActions(actions);
      }
      if (to !== 'INPUT_PHASE') {
        setPrompt(null);
      }
      if (to !== 'ENEMY_TURN') {
        setEnemyAction(null);
      }
      // Phase 32: clear sub-phase overlays on state transitions
      if (to !== 'GRAMMAR_COMBO') {
        setShowGrammarCombo(false);
        setGrammarComboData(null);
      }
      if (to !== 'ITEM_USE') {
        setShowItemMenu(false);
      }
      if (to !== 'TARGET_SELECT') {
        setShowTargetSelector(false);
        setTargetSelectorData(null);
      }
      if (to !== 'FLEE_CHALLENGE') {
        setFleeChallengeData(null);
      }
    };

    const onPromptWord = (wordData) => {
      setPrompt(wordData);
    };

    const onEnemyAction = (data) => {
      setEnemyAction(data);
    };

    const onBattleEnded = (result) => {
      setBattleResult(result);
      setPhase('result');
      // Phase 32: prepare post-review data from battle
      setShowGrammarCombo(false);
      setShowItemMenu(false);
      setShowTargetSelector(false);
      setFleeChallengeData(null);
    };

    const onCompanionTurnStart = ({ companionId: _companionId }) => {
      setIsCompanionTurn(true);
      setCompanionAction(null);
    };

    const onCompanionAction = ({ companionId: _companionId, action }) => {
      setCompanionAction(action);
    };

    const onCompanionTurnEnd = () => {
      setIsCompanionTurn(false);
      setCompanionAction(null);
    };

    // Phase 32: Grammar combo event
    const onGrammarCombo = (data) => {
      setGrammarComboData(data);
      setShowGrammarCombo(true);
    };

    // Phase 32: Flee challenge event
    const onFleeChallenge = (data) => {
      setFleeChallengeData(data);
    };

    // Phase 32: Target selection event
    const onTargetSelect = (data) => {
      setTargetSelectorData(data);
      setShowTargetSelector(true);
    };

    // Phase 32: Item menu open event
    const onItemMenuOpen = () => {
      setShowItemMenu(true);
    };

    // Phase 32: Post-battle review event
    const onPostReview = (data) => {
      setPostReviewData(data);
    };

    // Phase 32: Arena wave start
    const onArenaWaveStart = () => {
      setShowArenaHUD(true);
    };

    // Phase 32: Arena complete
    const onArenaComplete = () => {
      // ArenaHUD handles its own result display
    };

    EventBus.on(EVENTS.BATTLE_STARTED, onBattleStarted);
    EventBus.on(EVENTS.BATTLE_STATE_CHANGED, onStateChanged);
    EventBus.on(EVENTS.BATTLE_PROMPT_WORD, onPromptWord);
    EventBus.on(EVENTS.BATTLE_ENEMY_ACTION, onEnemyAction);
    EventBus.on(EVENTS.BATTLE_ENDED, onBattleEnded);
    EventBus.on(EVENTS.COMPANION_BATTLE_TURN_START, onCompanionTurnStart);
    EventBus.on(EVENTS.COMPANION_BATTLE_ACTION, onCompanionAction);
    EventBus.on(EVENTS.COMPANION_BATTLE_TURN_END, onCompanionTurnEnd);
    // Phase 32 events
    EventBus.on(EVENTS.BATTLE_GRAMMAR_COMBO, onGrammarCombo);
    EventBus.on(EVENTS.BATTLE_FLEE_CHALLENGE, onFleeChallenge);
    EventBus.on(EVENTS.BATTLE_TARGET_SELECT, onTargetSelect);
    EventBus.on(EVENTS.BATTLE_ITEM_MENU_OPEN, onItemMenuOpen);
    EventBus.on(EVENTS.BATTLE_POST_REVIEW, onPostReview);
    EventBus.on(EVENTS.ARENA_WAVE_START, onArenaWaveStart);
    EventBus.on(EVENTS.ARENA_COMPLETE, onArenaComplete);

    return () => {
      EventBus.off(EVENTS.BATTLE_STARTED, onBattleStarted);
      EventBus.off(EVENTS.BATTLE_STATE_CHANGED, onStateChanged);
      EventBus.off(EVENTS.BATTLE_PROMPT_WORD, onPromptWord);
      EventBus.off(EVENTS.BATTLE_ENEMY_ACTION, onEnemyAction);
      EventBus.off(EVENTS.BATTLE_ENDED, onBattleEnded);
      EventBus.off(EVENTS.COMPANION_BATTLE_TURN_START, onCompanionTurnStart);
      EventBus.off(EVENTS.COMPANION_BATTLE_ACTION, onCompanionAction);
      EventBus.off(EVENTS.COMPANION_BATTLE_TURN_END, onCompanionTurnEnd);
      // Phase 32 cleanup
      EventBus.off(EVENTS.BATTLE_GRAMMAR_COMBO, onGrammarCombo);
      EventBus.off(EVENTS.BATTLE_FLEE_CHALLENGE, onFleeChallenge);
      EventBus.off(EVENTS.BATTLE_TARGET_SELECT, onTargetSelect);
      EventBus.off(EVENTS.BATTLE_ITEM_MENU_OPEN, onItemMenuOpen);
      EventBus.off(EVENTS.BATTLE_POST_REVIEW, onPostReview);
      EventBus.off(EVENTS.ARENA_WAVE_START, onArenaWaveStart);
      EventBus.off(EVENTS.ARENA_COMPLETE, onArenaComplete);
    };
  }, []);

  const handleBattleClose = useCallback(() => {
    setBattleActive(false);
    setPhase('idle');
    setBattleResult(null);
    setShowPostReview(false);
    setPostReviewData(null);
    setShowArenaHUD(false);
  }, []);

  // Phase 32: Handle review button from BattleResult
  const handleReview = useCallback(() => {
    setShowPostReview(true);
  }, []);

  // Phase 32: Handle grammar combo submission
  const handleGrammarComboSubmit = useCallback((result) => {
    EventBus.emit(EVENTS.BATTLE_ARABIC_INPUT, {
      input: result.arabicInput,
      accuracy: result.accuracy,
      damageMultiplier: result.damageMultiplier,
      comboType: result.comboType,
    });
    setShowGrammarCombo(false);
    setGrammarComboData(null);
  }, []);

  // Phase 32: Handle grammar combo cancel
  const handleGrammarComboCancel = useCallback(() => {
    setShowGrammarCombo(false);
    setGrammarComboData(null);
  }, []);

  // Phase 32: Handle item use from BattleItemMenu
  const handleItemUse = useCallback((itemData) => {
    EventBus.emit(EVENTS.BATTLE_ITEM_USED, itemData);
    setShowItemMenu(false);
  }, []);

  // Phase 32: Handle target selection
  const handleTargetSelect = useCallback((targetIndex) => {
    EventBus.emit(EVENTS.BATTLE_TARGET_SELECT, { targetIndex });
    setShowTargetSelector(false);
    setTargetSelectorData(null);
  }, []);

  if (!battleActive) return null;

  // Phase 32: Build post-review battle data from Redux state
  const reviewBattleData = {
    arabicUsedThisBattle: arabicUsedThisBattle || [],
    maxStreak: maxStreak || 0,
    timeElapsed: battleResult?.timeElapsed || 0,
    playerEffects: playerEffects || [],
    enemyEffects: enemyEffects || [],
  };

  return (
    <div className={styles.container}>
      {/* Phase 32: Status effect bars */}
      {playerEffects && playerEffects.length > 0 && (
        <StatusEffectBar effects={playerEffects} target="player" />
      )}
      {enemyEffects && enemyEffects.length > 0 && (
        <StatusEffectBar effects={enemyEffects} target="enemy" />
      )}

      {/* Phase 32: Combo meter — left side */}
      <ComboMeter
        comboMeter={comboMeter || 0}
        maxComboMeter={maxComboMeter || 100}
        grammarComboState={grammarComboState}
        streak={streak}
      />

      {/* Battle menu — visible during ACTION_SELECT */}
      <div className={styles.pointerEventsAuto}>
        <BattleMenu
          visible={phase === 'ACTION_SELECT'}
          availableActions={availableActions}
          onAction={() => setPhase('waiting')}
        />
      </div>

      {/* Arabic input — visible during INPUT_PHASE */}
      <div className={styles.pointerEventsAuto}>
        <BattleArabicInput
          prompt={phase === 'INPUT_PHASE' ? prompt : null}
          onSubmit={() => setPhase('resolving')}
        />
      </div>

      {/* Phase 32: Flee challenge — BattleArabicInput in flee mode */}
      {fleeChallengeData && (
        <div className={styles.pointerEventsAuto}>
          <BattleArabicInput
            mode="flee"
            prompt={{
              word: fleeChallengeData.word,
              timeLimit: 10000,
              difficulty: 'type',
            }}
            onSubmit={() => {
              setFleeChallengeData(null);
            }}
          />
        </div>
      )}

      {/* Phase 32: Grammar combo input — visible during GRAMMAR_COMBO phase */}
      {showGrammarCombo && grammarComboData && (
        <div className={styles.pointerEventsAuto}>
          <GrammarComboInput
            comboType={grammarComboData.comboType || grammarComboData.type}
            template={grammarComboData.template}
            onSubmit={handleGrammarComboSubmit}
            onCancel={handleGrammarComboCancel}
          />
        </div>
      )}

      {/* Phase 32: Battle item menu — visible during ITEM_USE phase */}
      <div className={styles.pointerEventsAuto}>
        <BattleItemMenu
          visible={showItemMenu}
          onUseItem={handleItemUse}
          onCancel={() => setShowItemMenu(false)}
        />
      </div>

      {/* Phase 32: Target selector — visible during TARGET_SELECT phase */}
      <div className={styles.pointerEventsAuto}>
        <TargetSelector
          visible={showTargetSelector}
          enemies={targetSelectorData?.enemies || enemies || []}
          onSelectTarget={handleTargetSelect}
          onCancel={() => {
            setShowTargetSelector(false);
            setTargetSelectorData(null);
          }}
        />
      </div>

      {/* Phase 32: Arena HUD — visible during arena mode */}
      {showArenaHUD && <ArenaHUD />}

      {/* Phase 32: Boss Rush Interlude — self-managed via EventBus */}
      <BossRushInterlude />

      {/* Combo counter — always visible when streak > 1 */}
      <ComboCounter streak={streak} />

      {/* Enemy action intent */}
      {phase === 'ENEMY_TURN' && enemyAction && (
        <div className={styles.enemyIntent}>
          <p>{enemyAction.intent}</p>
        </div>
      )}

      {/* Companion turn indicator */}
      {isCompanionTurn && (
        <div className={styles.companionTurn}>
          <div className={styles.companionTurnLabel}>
            Companion&apos;s Turn
          </div>
          {companionAction && (
            <div className={styles.companionActionText}>
              {companionAction.action === 'heal' && '💚 Healing...'}
              {companionAction.action === 'attack' && '⚔️ Attacking...'}
              {companionAction.action === 'defend' && '🛡️ Defending...'}
              {companionAction.action === 'buff' && '✨ Buffing...'}
              {companionAction.action === 'skill' && '💫 Using skill...'}
              {companionAction.action === 'dispel' && '🌀 Dispelling...'}
            </div>
          )}
        </div>
      )}

      {/* Companion HP/MP bars (if battle companion active) */}
      {activeParty?.battle && battleState?.companionHP !== undefined && (
        <div className={styles.companionHPPanel}>
          <div className={styles.companionName}>
            {allCompanions && allCompanions[activeParty.battle] ?
              (allCompanions[activeParty.battle].name || 'Companion') :
              'Companion'}
          </div>
          {/* HP Bar */}
          <div className={styles.barSection}>
            <div className={`${styles.barLabel} ${styles.barLabelHP}`}>HP</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFillHP}
                style={{
                  width: `${Math.max(0, Math.min(100, ((battleState.companionHP || 0) / (battleState.companionMaxHP || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
          {/* MP Bar */}
          <div>
            <div className={`${styles.barLabel} ${styles.barLabelMP}`}>MP</div>
            <div className={styles.barTrackSmall}>
              <div
                className={styles.barFillMP}
                style={{
                  width: `${Math.max(0, Math.min(100, ((battleState.companionMP || 0) / (battleState.companionMaxMP || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Battle result overlay */}
      {phase === 'result' && battleResult && !showPostReview && (
        <div className={styles.pointerEventsAuto}>
          <BattleResult
            victory={battleResult.victory}
            bossId={battleResult.bossId}
            onClose={handleBattleClose}
            onReview={handleReview}
          />
        </div>
      )}

      {/* Phase 32: Post-battle review overlay */}
      {showPostReview && (
        <div className={styles.pointerEventsAuto}>
          <PostBattleReview
            battleData={reviewBattleData}
            onClose={() => {
              setShowPostReview(false);
              handleBattleClose();
            }}
          />
        </div>
      )}
    </div>
  );
}
