import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { splitTashkeel, getDiacriticOpacity, hasDiacritics } from '../../utils/tashkeelFading.js';

/**
 * FadingArabicText — Renders Arabic text with progressively fading diacritics
 * based on FSRS mastery (stability).
 *
 * Props:
 *   text       - Arabic string to render
 *   wordId     - Vocabulary word ID (used to look up FSRS card stability)
 *   stability  - Optional override for stability (skips Redux lookup)
 *   className  - Optional CSS class for the wrapper span
 *   style      - Optional inline styles for the wrapper span
 *   lang       - Language attribute (defaults to "ar")
 */
function FadingArabicText({ text, wordId, stability: stabilityOverride, className, style, lang = 'ar' }) {
  const showDiacritics = useSelector((state) => state.settings?.showDiacritics ?? true);

  // Look up FSRS card stability from vocabulary slice
  const cardStability = useSelector((state) => {
    if (stabilityOverride != null) return stabilityOverride;
    if (!wordId) return null;
    const card = state.vocabulary?.fsrsCards?.[wordId];
    return card?.stability ?? null;
  });

  const opacity = useMemo(
    () => getDiacriticOpacity(stabilityOverride ?? cardStability),
    [stabilityOverride, cardStability]
  );

  // Fast path: no diacritics in text or diacritics fully visible
  if (!showDiacritics || !text || !hasDiacritics(text) || opacity >= 1) {
    return <span className={className} style={style} lang={lang} dir="rtl">{text}</span>;
  }

  // Fast path: diacritics fully hidden
  if (opacity <= 0) {
    const stripped = text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    return <span className={className} style={style} lang={lang} dir="rtl">{stripped}</span>;
  }

  // Split and render with fading diacritics
  const parts = splitTashkeel(text);

  return (
    <span className={className} style={style} lang={lang} dir="rtl">
      {parts.map((part, i) =>
        part.isDiacritic ? (
          <span key={i} style={{ opacity }} aria-hidden="true">
            {part.char}
          </span>
        ) : (
          part.char
        )
      )}
    </span>
  );
}

export default memo(FadingArabicText);
