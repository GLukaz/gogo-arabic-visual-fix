import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setTutorialPhase } from '../../store/slices/playerSlice.js';
import styles from './CinematicIntro.module.css';

const CRAWL_LINES = [
  'في زمنٍ بعيد...',
  'In a time long past...',
  '',
  'A young scholar discovers an ancient manuscript',
  'hidden in the sands of a forgotten oasis.',
  '',
  'Its pages hold the key to a language',
  'that shaped civilizations —',
  '',
  'العربية',
  'Arabic.',
  '',
  'Your journey begins here.',
];

const LINE_DELAY = 600;
const FADE_OUT_DELAY = 1500;

export default function CinematicIntro() {
  const dispatch = useDispatch();
  const [visibleLines, setVisibleLines] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (visibleLines >= CRAWL_LINES.length) {
      const timer = setTimeout(() => setFadingOut(true), FADE_OUT_DELAY);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  useEffect(() => {
    if (!fadingOut) return;
    const timer = setTimeout(() => {
      dispatch(setTutorialPhase('path_choice'));
    }, 1000);
    return () => clearTimeout(timer);
  }, [fadingOut, dispatch]);

  const handleSkip = useCallback(() => {
    dispatch(setTutorialPhase('path_choice'));
  }, [dispatch]);

  return (
    <div
      className={`${styles.cinematic} ${fadingOut ? styles.fadeOut : ''}`}
      onClick={handleSkip}
      role="presentation"
    >
      <div className={styles.crawlContainer}>
        {CRAWL_LINES.slice(0, visibleLines).map((line, i) => (
          <p
            key={i}
            className={`${styles.line} ${
              /[\u0600-\u06FF]/.test(line) ? styles.arabic : ''
            }`}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </div>
      <button className={styles.skipBtn} onClick={handleSkip}>
        Skip
      </button>
    </div>
  );
}
