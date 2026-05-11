import { useState, useCallback, useMemo, memo, useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { openDialogue, openInventory } from '../../store/slices/uiSlice.js';
import { selectUnlockedCount } from '../../store/slices/achievementSlice.js';
import { selectPlayerStats } from '../../store/slices/playerSlice.js';
import { selectActiveQuestCount } from '../../store/slices/questSlice.js';
import { selectReviewQueueCount, selectLearnedWordCount, selectDueCardCount } from '../../store/slices/vocabularySlice.js';
import { selectCompletedGoalsCount, selectTotalGoalsCount } from '../../store/slices/dailyGoalsSlice.js';
import { selectInventoryCount } from '../../store/slices/inventorySlice.js';
import { selectCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './HUD.module.css';
import questsData from '../../data/quests.json';
const AchievementPanel = lazy(() => import('../Achievements/AchievementPanel.jsx'));
const CefrProgressReport = lazy(() => import('../CEFR/CefrProgressReport.jsx'));
const DailyGoalsPanel = lazy(() => import('../Goals/DailyGoalsPanel.jsx'));
import QuestTracker from './QuestTracker.jsx';
import NextObjectiveIndicator from './NextObjectiveIndicator.jsx';
import ClockHUD from './ClockHUD.jsx';
import OfflineIndicator from './OfflineIndicator.jsx';

function HUD({ onMenu }) {
  const dispatch = useDispatch();
  const [achievementPanelOpen, setAchievementPanelOpen] = useState(false);
  const [dailyGoalsPanelOpen, setDailyGoalsPanelOpen] = useState(false);
  const [cefrReportOpen, setCefrReportOpen] = useState(false);
  const [stamina, setStamina] = useState(100);
  const [maxStamina, setMaxStamina] = useState(100);
  const [showStamina, setShowStamina] = useState(false);

  // Use memoized selectors from Redux slices
  const { level, xp, xpToNextLevel } = useSelector(selectPlayerStats);
  const activeQuestCount = useSelector(selectActiveQuestCount);
  const _reviewDueCount = useSelector(selectReviewQueueCount);
  const achievementCount = useSelector(selectUnlockedCount);
  const completedGoalsCount = useSelector(selectCompletedGoalsCount);
  const totalGoalsCount = useSelector(selectTotalGoalsCount);
  const inventoryCount = useSelector(selectInventoryCount);
  const cefrLevel = useSelector(selectCefrLevel);
  const completedGroups = useSelector((s) => s.alphabet.completedGroups || []);
  const wordsLearned = useSelector(selectLearnedWordCount);
  const fsrsDueCount = useSelector(selectDueCardCount);
  const completedQuestCount = useSelector((s) => {
    const quests = s.quests.quests;
    return Object.values(quests).filter(q => q.status === 'completed').length;
  });

  // Calculate letters learned (7 groups × 4 letters = 28 total)
  const lettersLearned = completedGroups.length * 4;
  const totalLetters = 28;

  // Listen for stamina updates from player
  useEffect(() => {
    const handleStaminaUpdate = ({ stamina, maxStamina, isSprinting }) => {
      setStamina(stamina);
      setMaxStamina(maxStamina);
      setShowStamina(isSprinting || stamina < maxStamina);
    };

    EventBus.on(EVENTS.PLAYER_STAMINA_UPDATE, handleStaminaUpdate);

    return () => {
      EventBus.off(EVENTS.PLAYER_STAMINA_UPDATE, handleStaminaUpdate);
    };
  }, []);

  // Show prompt to learn first letter
  useEffect(() => {
    // Only show once per session when player has 0 letters learned
    if (lettersLearned === 0) {
      const hasSeenPrompt = sessionStorage.getItem('alphabet-prompt-shown');
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          dispatch({
            type: 'ui/showNotification',
            payload: {
              message: 'Start learning the Arabic alphabet! Press L or click أ ب button.',
              type: 'quest'
            }
          });
          sessionStorage.setItem('alphabet-prompt-shown', 'true');
        }, 3000); // Show after 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [lettersLearned, dispatch]);

  const xpPercent = useMemo(() => {
    return xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;
  }, [xp, xpToNextLevel]);

  const staminaPercent = useMemo(() => {
    return maxStamina > 0 ? (stamina / maxStamina) * 100 : 0;
  }, [stamina, maxStamina]);

  const openQuestLog = useCallback(() => {
    dispatch(openDialogue({ type: 'quest-log' }));
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }, [dispatch]);

  const openAchievements = useCallback(() => {
    setAchievementPanelOpen(true);
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }, []);

  const closeAchievements = useCallback(() => {
    setAchievementPanelOpen(false);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, []);

  const openDailyGoals = useCallback(() => {
    setDailyGoalsPanelOpen(true);
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }, []);

  const closeDailyGoals = useCallback(() => {
    setDailyGoalsPanelOpen(false);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, []);

  const openCefrReport = useCallback(() => {
    setCefrReportOpen(true);
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }, []);

  const closeCefrReport = useCallback(() => {
    setCefrReportOpen(false);
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, []);

  const openMap = useCallback(() => {
    EventBus.emit(EVENTS.WORLD_MAP_OPEN);
  }, []);

  const openAlphabet = useCallback(() => {
    EventBus.emit(EVENTS.ALPHABET_OPEN);
  }, []);

  const openReviewSession = useCallback(() => {
    EventBus.emit(EVENTS.REVIEW_SESSION_OPEN);
  }, []);

  const openInventoryPanel = useCallback(() => {
    dispatch(openInventory());
    EventBus.emit(EVENTS.PLAYER_FREEZE);
  }, [dispatch]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const buttonProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } };

  return (
    <>
      <div className={styles.container} role="banner" aria-label="Game HUD">
        {/* Left: Level + XP bar + Stamina bar */}
        <div className={styles.left}>
          <span className={styles.levelBadge} aria-label={`Level ${level}`}>Lv.{level}</span>
          <div
            className={styles.xpBarOuter}
            role="progressbar"
            aria-label="Experience progress to next level"
            aria-valuenow={xp}
            aria-valuemin={0}
            aria-valuemax={xpToNextLevel}
          >
            <div className={styles.xpBarFill} style={{ width: `${Math.min(xpPercent, 100)}%` }} />
          </div>
          <span className={styles.xpText} aria-label={`${xp} XP out of ${xpToNextLevel}`}>{xp}/{xpToNextLevel}</span>

          {/* Stamina bar - only visible when sprinting or recharging */}
          {showStamina && (
            <div
              className={styles.staminaBarOuter}
              role="progressbar"
              aria-label="Sprint stamina"
              aria-valuenow={Math.round(stamina)}
              aria-valuemin={0}
              aria-valuemax={maxStamina}
            >
              <div className={styles.staminaBarFill} style={{ width: `${Math.min(staminaPercent, 100)}%` }} />
            </div>
          )}

          <div className={styles.progressStrip} aria-label="Learning progress">
            <span className={styles.progressItem} title="Letters mastered">
              <span className={styles.progressIcon} aria-hidden="true">{'\u0623'}</span>
              <span className={styles.progressValue}>{lettersLearned}/{totalLetters}</span>
            </span>
            <span className={styles.progressSep} aria-hidden="true">|</span>
            <span className={styles.progressItem} title="Words learned">
              <span className={styles.progressIcon} aria-hidden="true">W</span>
              <span className={styles.progressValue}>{wordsLearned}</span>
            </span>
            <span className={styles.progressSep} aria-hidden="true">|</span>
            <span className={styles.progressItem} title="Quests completed">
              <span className={styles.progressIcon} aria-hidden="true">Q</span>
              <span className={styles.progressValue}>{completedQuestCount}/{questsData.length}</span>
            </span>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className={styles.right}>

          {/* Offline indicator */}
          <OfflineIndicator />

          {/* Clock HUD */}
          <ClockHUD />

          {/* Alphabet/Letters button with progress badge */}
          <motion.button
            className={`${styles.btn} ${styles.lettersBtn} ${lettersLearned === 0 ? styles.lettersPulse : ''}`}
            onClick={openAlphabet}
            aria-label={`Alphabet module. ${lettersLearned} of ${totalLetters} letters learned. Press L key.`}
            {...buttonProps}
          >
            <span role="img" aria-label="letters">أ ب</span>
            {lettersLearned < totalLetters && (
              <span className={`${styles.badge} ${styles.lettersBadge}`} aria-hidden="true">
                {lettersLearned}/{totalLetters}
              </span>
            )}
          </motion.button>

          {/* Map button */}
          <motion.button
            className={`${styles.btn} ${styles.mapBtn}`}
            onClick={openMap}
            aria-label="Open world map (M key)"
            {...buttonProps}
          >
            Map
          </motion.button>

          {/* Quests button with active quest badge */}
          <motion.button
            className={styles.btn}
            onClick={openQuestLog}
            aria-label={`Quest log ${activeQuestCount > 0 ? `${activeQuestCount} active quests` : ''}`}
            {...buttonProps}
          >
            Quests
            {activeQuestCount > 0 && (
              <span className={`${styles.badge} ${styles.questBadge}`} aria-hidden="true">
                {activeQuestCount}
              </span>
            )}
          </motion.button>

          {/* Inventory button (v6.0 equipment system) */}
          <motion.button
            className={styles.btn}
            onClick={openInventoryPanel}
            aria-label={`Inventory ${inventoryCount}/200 items. Press I key.`}
            {...buttonProps}
          >
            <span className={styles.inventoryIcon} aria-hidden="true">حقيبة</span>
            {inventoryCount > 0 && (
              <span className={`${styles.badge} ${styles.inventoryBadge}`} aria-hidden="true">
                {inventoryCount}
              </span>
            )}
          </motion.button>

          {/* Daily Goals button */}
          <motion.button
            className={styles.btn}
            onClick={openDailyGoals}
            aria-label={`Daily goals ${completedGoalsCount}/${totalGoalsCount} completed`}
            {...buttonProps}
          >
            <span role="img" aria-label="target">🎯</span>
            {completedGoalsCount > 0 && (
              <span className={`${styles.badge} ${styles.goalBadge}`} aria-hidden="true">
                {completedGoalsCount}/{totalGoalsCount}
              </span>
            )}
          </motion.button>

          {/* CEFR Progress Report button — only shown after placement test */}
          {cefrLevel && (
            <motion.button
              className={styles.btn}
              onClick={openCefrReport}
              aria-label={`CEFR Progress Report. Current level: ${cefrLevel}`}
              {...buttonProps}
            >
              CEFR
              <span className={`${styles.badge} ${styles.cefrBadge}`} aria-hidden="true">
                {cefrLevel}
              </span>
            </motion.button>
          )}

          {/* Achievements button */}
          <motion.button
            className={styles.btn}
            onClick={openAchievements}
            aria-label={`Achievements ${achievementCount > 0 ? `${achievementCount} unlocked` : ''}`}
            {...buttonProps}
          >
            <span role="img" aria-label="trophy">🏆</span>
            {achievementCount > 0 && (
              <span className={`${styles.badge} ${styles.achievementBadge}`} aria-hidden="true">
                {achievementCount}
              </span>
            )}
          </motion.button>

          {/* Review button with FSRS due count badge — always shown when words are due */}
          {fsrsDueCount > 0 && (
            <motion.button
              className={`${styles.btn} ${styles.reviewBtn} ${fsrsDueCount > 10 ? styles.duePulse : ''}`}
              onClick={openReviewSession}
              aria-label={`Start review session - ${fsrsDueCount} words due for review`}
              {...buttonProps}
            >
              Review
              <span className={`${styles.badge} ${styles.reviewBadge}`} aria-hidden="true">
                {fsrsDueCount}
              </span>
            </motion.button>
          )}

          <motion.button
            className={styles.btn}
            onClick={onMenu}
            aria-label="Open menu"
            {...buttonProps}
          >
            Menu
          </motion.button>
        </div>
      </div>

      {/* Active quest tracker - below HUD bar */}
      <QuestTracker />

      {/* Next objective indicator - below quest tracker */}
      <NextObjectiveIndicator />

      {/* Achievement Panel Overlay */}
      {achievementPanelOpen && (
        <Suspense fallback={null}>
          <AchievementPanel onClose={closeAchievements} />
        </Suspense>
      )}

      {/* Daily Goals Panel Overlay */}
      {dailyGoalsPanelOpen && (
        <Suspense fallback={null}>
          <DailyGoalsPanel onClose={closeDailyGoals} />
        </Suspense>
      )}

      {/* CEFR Progress Report Overlay */}
      {cefrReportOpen && (
        <Suspense fallback={null}>
          <CefrProgressReport onClose={closeCefrReport} />
        </Suspense>
      )}
    </>
  );
}

import PropTypes from 'prop-types';

HUD.propTypes = {
  /** Callback when user clicks the Menu button */
  onMenu: PropTypes.func.isRequired,
};

export default memo(HUD);
