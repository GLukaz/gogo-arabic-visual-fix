import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { closeDialogue, showNotification } from '../../store/slices/uiSlice.js';
import { selectNpcRelationship, incrementNpcRelationship } from '../../store/slices/narrativeSlice.js';
import { giveNpcGift } from '../../store/slices/npcSlice.js';
import { selectInventoryItems, removeItem } from '../../store/slices/inventorySlice.js';
import { GIFTS, GIFTS_BY_ID } from '../../data/gifts.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { InkDialogueEngine } from '../../game/systems/InkDialogueEngine.js';
import { useDialogue } from '../../hooks/useDialogue.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { getEnhancedDialogueChoices } from '../../utils/culturalDialogueHelper.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import npcsData from '../../data/npcsEnriched.js';
import DialoguePortrait from './DialoguePortrait.jsx';
import DialogueBox from './DialogueBox.jsx';
import DialogueChoices from './DialogueChoices.jsx';
import TeacherWordCard from './TeacherWordCard.jsx';
import CulturalDialogueMenu from './CulturalDialogueMenu.jsx';
import TopicSelectionMenu from './TopicSelectionMenu.jsx';
import ConversationHistory from './ConversationHistory.jsx';
import RelationshipIndicator from './RelationshipIndicator.jsx';
import ComprehensionCheck from './ComprehensionCheck.jsx';
import styles from './DialogueOverlay.module.css';

/* ---- animation variants ---- */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogueBoxVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.96 },
};

const moodToEmoji = (mood) => {
  const map = { cheerful: '😊', serious: '🤔', worried: '😟', excited: '🤩', angry: '😠', sad: '😢', neutral: '😐' };
  return map[mood] || '😐';
};

/**
 * Compute relationship delta for a given gift and NPC.
 * Falls back to 5 (normal) for unregistered items.
 */
function getGiftDelta(gift, npcId) {
  if (!gift) return 5;
  if ((gift.npcPreferences?.loved || []).includes(npcId)) return gift.relationshipGain.loved;
  if ((gift.npcPreferences?.liked || []).includes(npcId)) return gift.relationshipGain.liked;
  if ((gift.npcPreferences?.disliked || []).includes(npcId)) return gift.relationshipGain.disliked;
  return gift.relationshipGain?.normal ?? 5;
}

/**
 * DialogueOverlay
 * Main container for NPC dialogue — orchestrates portrait, dialogue box, choices,
 * topic selection, relationship indicator, and word cards.
 *
 * Supports both legacy linear dialogue and hub-and-spoke multi-topic conversations.
 */
export default function DialogueOverlay() {
  const dispatch = useDispatch();
  const overlayData = useSelector((s) => s.ui.dialogueConfig);

  const npcId = overlayData?.npcId;
  const npc = npcsData.find((n) => n.id === npcId);

  const {
    currentTree, lineIndex, close, advance, handleChoice,
    showCulturalMenu, setShowCulturalMenu,
    phase, availableTopics, selectTopic, topicsDiscussed,
    filteredChoices, isHubAndSpoke,
  } = useDialogue(npc);

  const relationshipLevel = useSelector(selectNpcRelationship(npcId || ''));

  const focusTrapRef = useFocusTrap(true, null);

  const [showHistory, setShowHistory] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);

  // ── Ink dialogue mode (PATH-01, PATH-02) ───────────────────────
  // When an ink story starts (e.g. path-choice after first word learned),
  // we bypass the legacy dialogue system and render directly from ink state.
  // inkDialogueState: { lines: string[], choices: Choice[], engine, npcData } | null
  const [inkDialogueState, setInkDialogueState] = useState(null);
  const [inkLineIndex, setInkLineIndex] = useState(0);
  const [comprehensionCheck, setComprehensionCheck] = useState(null);
  const inkEngineRef = useRef(null);

  useEffect(() => {
    const handleInkStart = ({ engine, npcData: inkNpcData }) => {
      inkEngineRef.current = engine;
      engine.syncStateIn();
      const lines = [];
      const lineTags = [];
      while (engine.canContinue()) {
        lines.push(engine.continue().trim());
        lineTags.push([...(engine._story?.currentTags || [])]);
      }
      const choices = engine.currentChoices();
      // Build a tag map that survives Boolean filtering (maps filtered index -> original tags)
      const filtered = [];
      const filteredTags = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
          filtered.push(lines[i]);
          filteredTags.push(lineTags[i]);
        }
      }
      setInkDialogueState({ lines: filtered, choices, npcData: inkNpcData, lineTags: filteredTags });
      setInkLineIndex(0);
      setComprehensionCheck(null);
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    };

    EventBus.on(EVENTS.INK_DIALOGUE_START, handleInkStart);
    return () => EventBus.off(EVENTS.INK_DIALOGUE_START, handleInkStart);
  }, []);

  // ── CEFR milestone dialogue (CEFR-03) ──────────────────────────
  // When learningProgressMiddleware emits CEFR_MILESTONE_REACHED, load the
  // guide-amira-cefr ink story with cefr_level context and start ink dialogue.
  useEffect(() => {
    const handleCefrMilestone = async ({ npcId: milestoneNpcId, context }) => {
      const engine = new InkDialogueEngine(null, null);
      await engine.loadForNpcWithContext(milestoneNpcId, context);
      if (!engine.isInkLoaded) return; // Compiled ink file missing — skip silently
      EventBus.emit(EVENTS.INK_DIALOGUE_START, {
        engine,
        npcData: { id: milestoneNpcId, name: 'Guide Amira — أميرة' },
      });
    };

    EventBus.on(EVENTS.CEFR_MILESTONE_REACHED, handleCefrMilestone);
    return () => EventBus.off(EVENTS.CEFR_MILESTONE_REACHED, handleCefrMilestone);
  }, []);
  // ────────────────────────────────────────────────────────────────

  const _closeInkDialogue = (engine) => {
    // Flush ink variable mutations to Redux worldState (sets ONBOARDING_PATH_CHOSEN, etc.)
    engine.syncStateOut();
    engine.reset();
    inkEngineRef.current = null;
    setInkDialogueState(null);
    setInkLineIndex(0);
    // useTutorialTrigger listens for INK_DIALOGUE_END to advance tutorial phase
    EventBus.emit(EVENTS.INK_DIALOGUE_END);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  };

  const handleInkChoice = (choiceIndex) => {
    const engine = inkEngineRef.current;
    if (!engine) return;
    engine.chooseChoiceIndex(choiceIndex);
    const lines = [];
    const lineTags = [];
    while (engine.canContinue()) {
      lines.push(engine.continue().trim());
      lineTags.push([...(engine._story?.currentTags || [])]);
    }
    const choices = engine.currentChoices();
    // Build filtered arrays that preserve tag alignment
    const filtered = [];
    const filteredTags = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]) {
        filtered.push(lines[i]);
        filteredTags.push(lineTags[i]);
      }
    }
    if (filtered.length === 0 && choices.length === 0) {
      _closeInkDialogue(engine);
    } else {
      setInkDialogueState((prev) => ({ ...prev, lines: filtered, choices, lineTags: filteredTags }));
      setInkLineIndex(0);
      setComprehensionCheck(null);
    }
  };

  const advanceInkLine = () => {
    const engine = inkEngineRef.current;
    if (!engine || !inkDialogueState) return;
    if (comprehensionCheck) return; // Blocked by active check
    const nextIdx = inkLineIndex + 1;
    if (nextIdx < inkDialogueState.lines.length) {
      setInkLineIndex(nextIdx);
      // Check if next line has comprehension_check tag
      const tags = inkDialogueState.lineTags?.[nextIdx] || [];
      if (tags.includes('comprehension_check')) {
        const checkData = engine.getComprehensionData();
        if (checkData) {
          setComprehensionCheck(checkData);
        }
      }
    } else if (inkDialogueState.choices.length > 0) {
      // All lines shown — keep at last line so choices are visible
    } else {
      // No more lines AND no choices → ink story at END with no path choice shown
      _closeInkDialogue(engine);
    }
  };
  // ────────────────────────────────────────────────────────────────

  // Inventory items for gift panel
  const inventoryItems = useSelector(selectInventoryItems);

  // Gift categories tracked in gifts.js
  const GIFT_CATEGORIES = ['food', 'crafts', 'books', 'clothing', 'tools', 'luxury', 'cultural'];

  // Items in inventory that are registered gifts or match gift categories
  const giftableItems = inventoryItems.filter(
    (item) => GIFTS_BY_ID[item.itemId] || GIFT_CATEGORIES.includes(item.category)
  );

  const handleGiveGift = (inventoryItem) => {
    const gift = GIFTS_BY_ID[inventoryItem.itemId];
    const delta = getGiftDelta(gift, npcId);
    dispatch(giveNpcGift({ npcId, giftId: inventoryItem.itemId, relationshipDelta: delta }));
    dispatch(removeItem({ itemId: inventoryItem.itemId, quantity: 1 }));
    const reactionLabel =
      delta >= 20 ? 'loves it!' : delta >= 10 ? 'really likes it!' : delta < 0 ? 'dislikes it.' : 'appreciates it.';
    dispatch(showNotification({
      message: `${npc?.name || npcId} ${reactionLabel} (+${delta} friendship)`,
      type: 'info',
    }));
    setShowGiftPanel(false);
  };

  // Centralized overlay close with ESC key and unmount safety net
  useOverlayClose(close);

  const line = (npc && currentTree) ? currentTree.lines[lineIndex] : null;

  /* ---- keyboard shortcuts (Space/Enter to advance, number keys for choices) ---- */
  /* NOTE: ESC is handled by useOverlayClose above (capture phase) */
  useEffect(() => {
    if (!line) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // If current line has choices, handle number keys for choice selection
      if (line?.choices) {
        const choices = isHubAndSpoke ? filteredChoices : line.choices;
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= choices.length) {
          e.preventDefault();
          handleChoice(choices[num - 1]);
          return;
        }
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (!line?.choices) {
            advance();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line, lineIndex, currentTree, isHubAndSpoke, filteredChoices]);

  // ── Ink dialogue rendering (PATH-01 / PATH-02) ──────────────────
  // Render directly from ink state — bypasses legacy NPC data entirely.
  if (inkDialogueState) {
    const currentInkLine = inkDialogueState.lines[inkLineIndex] ?? '';
    const atLastLine = inkLineIndex >= inkDialogueState.lines.length - 1;
    const inkNpc = inkDialogueState.npcData;
    const showingChoices = atLastLine && inkDialogueState.choices.length > 0;

    return (
      <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label="Dialogue with Guide Amira">
        <motion.div
          className={styles.backdrop}
          onClick={!showingChoices && !comprehensionCheck ? advanceInkLine : undefined}
          role={!showingChoices && !comprehensionCheck ? 'button' : undefined}
          tabIndex={!showingChoices && !comprehensionCheck ? 0 : undefined}
          aria-label={!showingChoices && !comprehensionCheck ? 'Continue dialogue' : undefined}
          onKeyDown={!showingChoices && !comprehensionCheck ? (e) => {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advanceInkLine(); }
          } : undefined}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className={styles.inkMotionWrap}
          variants={dialogueBoxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.dialogueBox}>
            <div className={styles.content}>
              {inkNpc && (
                <div className={`${styles.npcHeader} ${styles.inkNpcHeader}`}>
                  <span className={styles.inkNpcName}>
                    {inkNpc.name || 'Guide Amira'}
                  </span>
                </div>
              )}
              <p
                dir="rtl"
                lang="ar"
                className={styles.inkLine}
              >
                {currentInkLine}
              </p>

              {comprehensionCheck && (
                <ComprehensionCheck
                  question={comprehensionCheck.question}
                  options={comprehensionCheck.options}
                  correctIndex={comprehensionCheck.correctIndex}
                  onComplete={(wasCorrect) => {
                    if (wasCorrect && inkDialogueState.npcData?.id) {
                      dispatch(incrementNpcRelationship({
                        npcId: inkDialogueState.npcData.id,
                        amount: 2,
                      }));
                    }
                    setComprehensionCheck(null);
                    // Auto-advance past the check line
                    advanceInkLine();
                  }}
                />
              )}

              {showingChoices ? (
                <div className={styles.inkChoicesWrap}>
                  {inkDialogueState.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleInkChoice(idx)}
                      dir="rtl"
                      lang="ar"
                      className={styles.inkChoiceBtn}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              ) : (
                !atLastLine && (
                  <div className={styles.inkContinueHint}>
                    Press Space or click to continue
                  </div>
                )
              )}

              {atLastLine && inkDialogueState.choices.length === 0 && (
                <div className={styles.inkContinueHint}>
                  Press Space or click to continue
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  // ─────────────────────────────────────────────────────────────────

  // Early return if invalid data
  if (!npc || !currentTree) {
    if (npc || overlayData) {
      dispatch(closeDialogue());
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    }
    return null;
  }

  if (!line) {
    close();
    return null;
  }

  // Check for reduced motion preference
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

  /* ---- conversation history (highest priority overlay) ---- */
  if (showHistory) {
    return (
      <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label="Conversation history">
        <motion.div
          className={styles.backdrop}
          onClick={() => setShowHistory(false)}
          role="button"
          tabIndex={0}
          aria-label="Close history"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              setShowHistory(false);
            }
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        />
        <motion.div
          className={styles.inkMotionWrap}
          variants={dialogueBoxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <ConversationHistory
            npc={npc}
            topicsDiscussed={topicsDiscussed}
            allTopics={availableTopics}
            onBack={() => setShowHistory(false)}
          />
        </motion.div>
      </div>
    );
  }

  /* ---- hub phase: topic selection ---- */
  if (phase === 'hub' && isHubAndSpoke) {
    return (
      <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label="Topic selection">
        <motion.div
          className={styles.backdrop}
          onClick={close}
          role="button"
          tabIndex={0}
          aria-label="Close dialogue"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              close();
            }
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        />
        <motion.div
          className={styles.inkMotionWrap}
          variants={dialogueBoxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <TopicSelectionMenu
            topics={availableTopics}
            onSelectTopic={selectTopic}
            topicsDiscussed={topicsDiscussed}
            npc={npc}
            portrait={<DialoguePortrait npc={npc} />}
            onClose={close}
            onShowHistory={() => setShowHistory(true)}
            relationshipLevel={relationshipLevel}
          />
        </motion.div>
      </div>
    );
  }

  /* ---- cultural menu rendering ---- */
  if (showCulturalMenu) {
    const handleCulturalSelect = (culturalDialogue) => {
      handleChoice({
        action: 'cultural_dialogue',
        culturalDialogueData: culturalDialogue,
      });
    };

    const handleBackFromCultural = () => {
      setShowCulturalMenu(false);
    };

    return (
      <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label="Cultural dialogue menu">
        <motion.div
          className={styles.backdrop}
          onClick={close}
          role="button"
          tabIndex={0}
          aria-label="Close cultural menu"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              close();
            }
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        />
        <motion.div
          className={styles.inkMotionWrap}
          variants={dialogueBoxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <CulturalDialogueMenu
            npc={npc}
            onCulturalSelect={handleCulturalSelect}
            onBack={handleBackFromCultural}
            portrait={<DialoguePortrait npc={npc} />}
          />
        </motion.div>
      </div>
    );
  }

  /* ---- choice line rendering ---- */
  if (line.choices) {
    const choicesToRender = isHubAndSpoke ? filteredChoices : line.choices;
    const enhancedChoices = !isHubAndSpoke ? getEnhancedDialogueChoices(npc, line) : null;

    // Add "Back to topics" choice for hub-and-spoke NPCs in topic phase
    const finalChoices = [...(enhancedChoices || choicesToRender)];
    if (isHubAndSpoke && phase === 'topic' && currentTree.returnToHub) {
      finalChoices.push({
        english: '← Back to topics',
        action: 'return_to_hub',
      });
    }

    return (
      <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label="Dialogue choices">
        <motion.div
          className={styles.backdrop}
          onClick={close}
          role="button"
          tabIndex={0}
          aria-label="Close dialogue"
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              close();
            }
          }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        />
        <motion.div
          className={styles.inkMotionWrap}
          variants={dialogueBoxVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          {isHubAndSpoke && (
            <div className={`${styles.dialogueBox} ${styles.hubChoiceDialogueBox}`}>
              <div className={styles.content}>
                <div className={styles.npcHeader}>
                  {npc.personality?.mood && (
                    <span className={styles.npcMood} aria-label={`NPC mood: ${npc.personality.mood}`}>
                      {moodToEmoji(npc.personality.mood)}
                    </span>
                  )}
                  <RelationshipIndicator npcId={npc.id} level={relationshipLevel} />
                </div>
              </div>
            </div>
          )}
          <DialogueChoices
            choices={finalChoices}
            onChoiceSelect={handleChoice}
            portrait={<DialoguePortrait npc={npc} />}
          />
        </motion.div>
      </div>
    );
  }

  /* ---- normal dialogue line rendering ---- */
  return (
    <div ref={focusTrapRef} className={styles.overlay} role="dialog" aria-label={`Dialogue with ${npc.name}`}>
      <motion.div
        className={styles.backdrop}
        onClick={advance}
        role="button"
        tabIndex={0}
        aria-label="Continue dialogue"
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            advance();
          }
        }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
      />
      <motion.div
        className={styles.inkMotionWrap}
        variants={dialogueBoxVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={transition}
      >
        <DialogueBox
          npc={npc}
          line={line}
          onAdvance={advance}
          portrait={<DialoguePortrait npc={npc} />}
          teachWordCard={line.teachWord ? <TeacherWordCard wordId={line.teachWord} /> : null}
          isHubAndSpoke={isHubAndSpoke}
          relationshipLevel={relationshipLevel}
        />

        {/* Gift button — always available during dialogue */}
        {!showGiftPanel && (
          <div className={styles.giftBtnWrap}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowGiftPanel(true); }}
              className={styles.giftBtn}
              aria-label="Give a gift to this NPC"
            >
              Gift
            </button>
          </div>
        )}

        {/* Gift panel */}
        {showGiftPanel && (
          <div
            className={styles.giftPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.giftPanelTitle}>
              Choose a Gift
            </div>
            {giftableItems.length === 0 && (
              <div className={styles.giftPanelEmpty}>No giftable items in your inventory.</div>
            )}
            {giftableItems.map((item) => {
              const gift = GIFTS_BY_ID[item.itemId];
              return (
                <button
                  key={item.itemId}
                  onClick={(e) => { e.stopPropagation(); handleGiveGift(item); }}
                  className={styles.giftItemBtn}
                >
                  {gift?.name || item.name || item.itemId}
                  {gift?.nameArabic && (
                    <span className={styles.giftItemArabic}>{gift.nameArabic}</span>
                  )}
                  <span className={styles.giftItemQty}>x{item.quantity}</span>
                </button>
              );
            })}
            <button
              onClick={(e) => { e.stopPropagation(); setShowGiftPanel(false); }}
              className={styles.giftCancelBtn}
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
