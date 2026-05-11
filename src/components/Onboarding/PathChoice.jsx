import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLearningPath, setTutorialPhase } from '../../store/slices/playerSlice.js';
import styles from './PathChoice.module.css';

const PATHS = [
  {
    id: 'scholar',
    nameAr: 'القارئ',
    nameEn: 'Path of the Scholar',
    icon: '📜',
    desc: 'Reading focus — Quranic vocabulary, classical texts, calligraphy. Prioritizes reading comprehension and formal Arabic.',
    mentor: 'Scholar Yusuf',
  },
  {
    id: 'traveler',
    nameAr: 'المسافر',
    nameEn: 'Path of the Traveler',
    icon: '🧭',
    desc: 'Conversational focus — greetings, directions, food, daily life. Prioritizes practical phrases and social situations.',
    mentor: 'Guide Amira',
  },
  {
    id: 'historian',
    nameAr: 'المؤرخ',
    nameEn: 'Path of the Historian',
    icon: '🏛️',
    desc: 'Cultural focus — historical terms, scientific Arabic, trade vocabulary. Prioritizes world exploration and cultural knowledge.',
    mentor: 'Elder Tariq',
  },
  {
    id: 'polymath',
    nameAr: 'المتعلم',
    nameEn: 'Path of the Polymath',
    icon: '🌟',
    desc: 'All-rounder — reading, conversation, and culture combined. No priority bias — learn everything equally. The hardest but most rewarding path.',
    mentor: 'All Mentors',
  },
];

/**
 * PathChoice overlay — dual-mode component.
 *
 * mode="onboarding" (default): legacy first-time path selection flow.
 *   Used as settings fallback if ink dialogue path choice is unavailable.
 *
 * mode="settings" (PATH-05): path-switching from the settings menu.
 *   Shows the current path highlighted, displays a reset warning banner,
 *   and calls onClose() after dispatching the new path.
 */
export default function PathChoice({ mode = 'onboarding', onClose }) {
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.player.learningPath);
  const [selected, setSelected] = useState(mode === 'settings' ? currentPath : null);
  const [fadingOut, setFadingOut] = useState(false);

  const handleConfirm = useCallback(() => {
    if (!selected) return;

    if (mode === 'settings') {
      // Settings mode: switch path and call onClose — do NOT change tutorialPhase
      dispatch(setLearningPath(selected));
      if (onClose) onClose();
      return;
    }

    // Onboarding mode: dispatch path, fade out, then advance tutorial phase
    dispatch(setLearningPath(selected));
    setFadingOut(true);
    setTimeout(() => {
      dispatch(setTutorialPhase('awaiting_mentor'));
    }, 800);
  }, [selected, dispatch, mode, onClose]);

  const isSettingsMode = mode === 'settings';
  const confirmLabel = isSettingsMode ? 'Switch Path' : 'Begin Journey';

  return (
    <div className={`${styles.overlay} ${fadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.container}>

        {/* Reset warning — settings mode only */}
        {isSettingsMode && (
          <div className={styles.resetWarning}>
            <span className={styles.resetWarningText}>
              Changing your path resets word priority bonuses. Your learned words are kept.
            </span>
            <span className={styles.resetWarningAr} lang="ar">
              تغيير المسار يعيد ضبط أولويات الكلمات. كلماتك المحفوظة تبقى.
            </span>
          </div>
        )}

        <p className={styles.amiraText}>
          {isSettingsMode ? '"Change your learning path"' : '"What draws you to Arabic?"'}
        </p>
        <p className={styles.subtitle}>
          {isSettingsMode ? 'Priority bonuses reset when switching paths' : 'Choose your focus — you can change later'}
        </p>

        <div className={styles.paths}>
          {PATHS.map((path) => (
            <button
              key={path.id}
              className={`${styles.pathCard} ${selected === path.id ? styles.selected : ''} ${isSettingsMode && currentPath === path.id ? styles.current : ''}`}
              onClick={() => setSelected(path.id)}
            >
              <span className={styles.icon}>{path.icon}</span>
              <span className={styles.nameAr}>{path.nameAr}</span>
              <span className={styles.nameEn}>{path.nameEn}</span>
              <span className={styles.desc}>{path.desc}</span>
              <span className={styles.mentor}>Mentor: {path.mentor}</span>
              {isSettingsMode && currentPath === path.id && (
                <span className={styles.currentBadge}>Current</span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.buttonRow}>
          <button
            className={`${styles.confirmBtn} ${selected ? styles.active : ''}`}
            onClick={handleConfirm}
            disabled={!selected}
          >
            {confirmLabel}
          </button>
          {isSettingsMode && onClose && (
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
