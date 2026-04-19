import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './TashkeelText.module.css';

/**
 * TashkeelText - Renders Arabic text with progressive tashkeel (diacritics) fading.
 *
 * As learners master words, the diacritics gradually fade based on FSRS mastery level:
 * - Beginner: Full tashkeel (opacity 1.0)
 * - Learning: Faded (opacity 0.5)
 * - Familiar: Very faded (opacity 0.25)
 * - Mastered: No tashkeel (opacity 0)
 *
 * Usage:
 *   <TashkeelText arabic="مَرْحَبًا" wordId="greetings_001" />
 *   <TashkeelText arabic="كِتَاب" /> // No wordId = full tashkeel
 *
 * Props:
 * @param {string} arabic - Arabic text with tashkeel marks
 * @param {string} [wordId] - Vocabulary word ID for mastery lookup (optional)
 * @param {string} [className] - Additional CSS class for the wrapper
 * @param {object} [style] - Additional inline styles for the wrapper
 */
export default function TashkeelText({ arabic, wordId, className = '', style = {} }) {
  const showDiacritics = useSelector((s) => s.settings.showDiacritics);
  const formatArabic = useFormatArabic();

  // CONT-07: Look up word metadata for ambiguous flag
  const wordMeta = useMemo(
    () => (wordId ? vocabulary.find((w) => w.id === wordId) : null),
    [wordId]
  );

  // Calculate tashkeel opacity based on mastery — CONT-07: ambiguous words always keep full tashkeel
  const tashkeelOpacity = useMemo(() => {
    if (!showDiacritics) return 0; // User disabled diacritics = hide all
    if (!wordId) return 1.0; // No wordId = show full tashkeel
    if (wordMeta?.ambiguous) return 1.0; // CONT-07: ambiguous words always retain tashkeel
    return formatArabic.getTashkeelOpacity(wordId);
  }, [showDiacritics, wordId, formatArabic, wordMeta]);

  // Split Arabic text into segments: base characters and tashkeel marks
  const segments = useMemo(() => {
    if (!arabic) return [];

    // Regex for tashkeel marks: fathah, dammah, kasrah, sukun, shaddah, tanwin, etc.
    const tashkeelRegex = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
    const result = [];
    let lastIndex = 0;

    // Find all tashkeel marks and split text into segments
    let match;
    while ((match = tashkeelRegex.exec(arabic)) !== null) {
      const index = match.index;

      // Add base text before this tashkeel mark
      if (index > lastIndex) {
        result.push({
          type: 'base',
          text: arabic.substring(lastIndex, index),
        });
      }

      // Add the tashkeel mark
      result.push({
        type: 'tashkeel',
        text: match[0],
      });

      lastIndex = index + 1;
    }

    // Add remaining base text
    if (lastIndex < arabic.length) {
      result.push({
        type: 'base',
        text: arabic.substring(lastIndex),
      });
    }

    return result;
  }, [arabic]);

  // If no tashkeel marks found or user disabled diacritics, render plain text
  if (segments.length === 0 || !showDiacritics) {
    return (
      <span className={className} style={style}>
        {formatArabic(arabic)}
      </span>
    );
  }

  // Render with progressive opacity on tashkeel marks
  return (
    <span className={`${styles.wrapper} ${className}`.trim()} style={style}>
      {segments.map((segment, idx) => {
        if (segment.type === 'base') {
          return <span key={idx}>{segment.text}</span>;
        } else {
          // Tashkeel mark with progressive opacity
          return (
            <span
              key={idx}
              className={styles.tashkeel}
              style={{ opacity: tashkeelOpacity }}
            >
              {segment.text}
            </span>
          );
        }
      })}
    </span>
  );
}

/*
 * ACCESSIBILITY NOTES:
 * - Tashkeel opacity is visual only; screen readers will read the full text
 * - Semantic HTML preserved (span elements)
 * - No interactive elements, so no keyboard navigation needed
 *
 * PERFORMANCE NOTES:
 * - useMemo prevents re-parsing on every render
 * - Opacity changes use CSS transitions for smooth fade
 * - Minimal DOM nodes (one span per segment)
 *
 * USAGE EXAMPLES:
 *
 * // Basic usage with mastery-based fading
 * <TashkeelText arabic="مَرْحَبًا" wordId="greetings_001" />
 *
 * // Without wordId (always shows full tashkeel)
 * <TashkeelText arabic="السَّلَامُ عَلَيْكُم" />
 *
 * // With custom styling
 * <TashkeelText
 *   arabic="كِتَاب"
 *   wordId="objects_book"
 *   className="quiz-word"
 *   style={{ fontSize: '2rem' }}
 * />
 */
