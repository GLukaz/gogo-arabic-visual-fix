/**
 * SeasonalEventOverlay.jsx — Full seasonal event detail overlay (Phase 86)
 *
 * Shows when a seasonal Islamic event (Ramadan / Eid al-Fitr / Eid al-Adha) is active:
 *   - Event greeting banner with Arabic calligraphy styling
 *   - Current event description
 *   - Special vocabulary list with learned/unlearned status
 *   - Event quest progress
 *   - XP bonus indicator
 *   - Day counter for Ramadan ("Day 15 of 30")
 *
 * Uses green (#006400) + gold (#FFD700) Islamic theme.
 */

import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectActiveEvent,
  selectActiveEventData,
  selectSeasonalVocabLearned,
  selectSeasonalQuestsCompleted,
  learnSeasonalWord,
} from '../../store/slices/seasonalEventSlice.js';
import { getDaysIntoRamadan, getHijriYear } from '../../utils/hijriCalendar.js';
import { getRamadanDailyTheme } from '../../data/seasonalEvents.js';
import styles from './SeasonalEventOverlay.module.css';

// ── Component ───────────────────────────────────────────────────────────────

function SeasonalEventOverlay({ onClose }) {
  const dispatch = useDispatch();
  const activeEventId = useSelector(selectActiveEvent);
  const eventData = useSelector(selectActiveEventData);
  const vocabLearned = useSelector(selectSeasonalVocabLearned);
  const questsCompleted = useSelector(selectSeasonalQuestsCompleted);

  const panelRef = useRef(null);

  // Ramadan-specific: current day and theme
  const now = new Date();
  const ramadanDay = activeEventId === 'ramadan' ? getDaysIntoRamadan(now) : null;
  const ramadanTheme = ramadanDay ? getRamadanDailyTheme(ramadanDay) : null;
  const hijriYear = getHijriYear(now);

  // Set of learned word IDs for quick lookup
  const learnedSet = useMemo(
    () => new Set(vocabLearned),
    [vocabLearned]
  );

  const completedQuestSet = useMemo(
    () => new Set(questsCompleted),
    [questsCompleted]
  );

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle vocabulary word click (mark as learned)
  const handleLearnWord = useCallback(
    (wordId) => {
      if (!activeEventId) return;
      dispatch(learnSeasonalWord({ eventId: activeEventId, wordId }));
    },
    [dispatch, activeEventId]
  );

  if (!eventData) return null;

  const vocabCount = eventData.specialVocabulary.length;
  const learnedCount = vocabLearned.length;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${eventData.name} Seasonal Event`}
    >
      <div className={styles.panel} ref={panelRef}>
        {/* ── Header / Greeting ──────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.greetingBlock}>
            <span className={styles.greetingIcon} aria-hidden="true">
              {eventData.icon}
            </span>
            <div className={styles.greetingText}>
              <h2 className={styles.greetingArabic} dir="rtl">
                {eventData.greeting}
              </h2>
              <p className={styles.greetingEnglish}>
                {eventData.greetingEnglish}
              </p>
            </div>
            <span className={styles.greetingIcon} aria-hidden="true">
              {eventData.icon}
            </span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close seasonal event overlay"
            type="button"
          >
            ESC
          </button>
        </div>

        {/* ── Scrollable Content ─────────────────────────────────── */}
        <div className={styles.content}>

          {/* Event Description */}
          <div className={styles.section}>
            <div className={styles.eventTitle}>
              <span className={styles.eventName}>{eventData.name}</span>
              <span className={styles.eventNameArabic} dir="rtl">
                {eventData.nameArabic}
              </span>
            </div>
            <p className={styles.eventDesc}>{eventData.description}</p>
            <p className={styles.eventDescArabic} dir="rtl">
              {eventData.descriptionArabic}
            </p>
          </div>

          {/* XP Bonus + Day Counter Row */}
          <div className={styles.infoRow}>
            <div className={styles.infoBadge}>
              <span className={styles.infoBadgeLabel}>XP Bonus</span>
              <span className={styles.infoBadgeValue}>
                +{Math.round((eventData.xpMultiplier - 1) * 100)}%
              </span>
            </div>
            {ramadanDay && (
              <div className={styles.infoBadge}>
                <span className={styles.infoBadgeLabel}>Ramadan Day</span>
                <span className={styles.infoBadgeValue}>
                  {ramadanDay} / {eventData.duration}
                </span>
              </div>
            )}
            <div className={styles.infoBadge}>
              <span className={styles.infoBadgeLabel}>Hijri Year</span>
              <span className={styles.infoBadgeValue}>{hijriYear} AH</span>
            </div>
          </div>

          {/* Ramadan Daily Theme */}
          {ramadanTheme && (
            <div className={styles.themeBlock}>
              <span className={styles.themeLabel}>Today&apos;s Theme:</span>
              <span className={styles.themeName}>{ramadanTheme.theme}</span>
              <span className={styles.themeArabic} dir="rtl">
                {ramadanTheme.themeArabic}
              </span>
            </div>
          )}

          {/* ── Vocabulary Section ───────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Special Vocabulary ({learnedCount}/{vocabCount})
            </h3>
            <div className={styles.vocabGrid}>
              {eventData.specialVocabulary.map((word) => {
                const isLearned = learnedSet.has(word.id);
                return (
                  <button
                    key={word.id}
                    className={`${styles.vocabCard} ${isLearned ? styles.vocabLearned : ''}`}
                    onClick={() => !isLearned && handleLearnWord(word.id)}
                    disabled={isLearned}
                    type="button"
                    aria-label={`${word.english} — ${word.transliteration}${isLearned ? ' (learned)' : ''}`}
                  >
                    <span className={styles.vocabArabic} dir="rtl">
                      {word.arabic}
                    </span>
                    <span className={styles.vocabTranslit}>
                      {word.transliteration}
                    </span>
                    <span className={styles.vocabEnglish}>
                      {word.english}
                    </span>
                    {isLearned && (
                      <span className={styles.vocabCheck} aria-hidden="true">
                        &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quests Section ────────────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Event Quests</h3>
            {eventData.quests.map((quest) => {
              const isComplete = completedQuestSet.has(quest.id);
              return (
                <div
                  key={quest.id}
                  className={`${styles.questCard} ${isComplete ? styles.questComplete : ''}`}
                >
                  <div className={styles.questHeader}>
                    <span className={styles.questTitle}>{quest.title}</span>
                    <span className={styles.questTitleArabic} dir="rtl">
                      {quest.titleArabic}
                    </span>
                  </div>
                  <p className={styles.questDesc}>{quest.description}</p>
                  <div className={styles.questMeta}>
                    <span className={styles.questReward}>
                      +{quest.reward.xp} XP &middot; {quest.reward.dirhams} dirhams
                    </span>
                    {isComplete ? (
                      <span className={styles.questBadgeComplete}>COMPLETE</span>
                    ) : (
                      <span className={styles.questBadgeActive}>IN PROGRESS</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonalEventOverlay;
