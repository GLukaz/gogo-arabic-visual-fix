import { useState, useEffect } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './GrammarFill.module.css';

/**
 * VERB_PARADIGMS — Embedded conjugation data sourced from grammar.js conjugation-drill exercises.
 * Each entry provides a verb root + paradigm context + correct form + distractors.
 * Used by useQuiz.js buildChoices to generate GrammarFill options.
 * Exported so useQuiz.js can import without circular issues.
 */
export const VERB_PARADIGMS = [
  // كَتَبَ (to write) — present tense
  {
    verb: 'كَتَبَ',
    root: 'ك-ت-ب',
    meaning: 'to write',
    paradigm: 'present',
    pronoun: { en: 'I (أنا)', ar: 'أنا' },
    correctForm: 'أكتب',
    distractors: ['يكتب', 'تكتب', 'نكتب'],
  },
  {
    verb: 'كَتَبَ',
    root: 'ك-ت-ب',
    meaning: 'to write',
    paradigm: 'present',
    pronoun: { en: 'He (هو)', ar: 'هو' },
    correctForm: 'يكتب',
    distractors: ['أكتب', 'تكتب', 'نكتب'],
  },
  {
    verb: 'كَتَبَ',
    root: 'ك-ت-ب',
    meaning: 'to write',
    paradigm: 'present',
    pronoun: { en: 'We (نحن)', ar: 'نحن' },
    correctForm: 'نكتب',
    distractors: ['أكتب', 'يكتب', 'تكتب'],
  },
  // ذَهَبَ (to go) — present tense
  {
    verb: 'ذَهَبَ',
    root: 'ذ-ه-ب',
    meaning: 'to go',
    paradigm: 'present',
    pronoun: { en: 'We (نحن)', ar: 'نحن' },
    correctForm: 'نذهب',
    distractors: ['أذهب', 'يذهب', 'تذهب'],
  },
  {
    verb: 'ذَهَبَ',
    root: 'ذ-ه-ب',
    meaning: 'to go',
    paradigm: 'present',
    pronoun: { en: 'I (أنا)', ar: 'أنا' },
    correctForm: 'أذهب',
    distractors: ['يذهب', 'تذهب', 'نذهب'],
  },
  {
    verb: 'ذَهَبَ',
    root: 'ذ-ه-ب',
    meaning: 'to go',
    paradigm: 'present',
    pronoun: { en: 'He (هو)', ar: 'هو' },
    correctForm: 'يذهب',
    distractors: ['أذهب', 'تذهب', 'نذهب'],
  },
  // قَرَأَ (to read) — present tense
  {
    verb: 'قَرَأَ',
    root: 'ق-ر-أ',
    meaning: 'to read',
    paradigm: 'present',
    pronoun: { en: 'I (أنا)', ar: 'أنا' },
    correctForm: 'أقرأ',
    distractors: ['يقرأ', 'تقرأ', 'نقرأ'],
  },
  {
    verb: 'قَرَأَ',
    root: 'ق-ر-أ',
    meaning: 'to read',
    paradigm: 'present',
    pronoun: { en: 'She (هي)', ar: 'هي' },
    correctForm: 'تقرأ',
    distractors: ['أقرأ', 'يقرأ', 'نقرأ'],
  },
  // فَهِمَ (to understand) — present tense
  {
    verb: 'فَهِمَ',
    root: 'ف-ه-م',
    meaning: 'to understand',
    paradigm: 'present',
    pronoun: { en: 'I (أنا)', ar: 'أنا' },
    correctForm: 'أفهم',
    distractors: ['يفهم', 'تفهم', 'نفهم'],
  },
  {
    verb: 'فَهِمَ',
    root: 'ف-ه-م',
    meaning: 'to understand',
    paradigm: 'present',
    pronoun: { en: 'He (هو)', ar: 'هو' },
    correctForm: 'يفهم',
    distractors: ['أفهم', 'تفهم', 'نفهم'],
  },
  // سَكَنَ (to live/dwell) — present tense
  {
    verb: 'سَكَنَ',
    root: 'س-ك-ن',
    meaning: 'to live/dwell',
    paradigm: 'present',
    pronoun: { en: 'We (نحن)', ar: 'نحن' },
    correctForm: 'نسكن',
    distractors: ['أسكن', 'يسكن', 'تسكن'],
  },
  {
    verb: 'سَكَنَ',
    root: 'س-ك-ن',
    meaning: 'to live/dwell',
    paradigm: 'present',
    pronoun: { en: 'You m. (أنتَ)', ar: 'أنتَ' },
    correctForm: 'تسكن',
    distractors: ['أسكن', 'يسكن', 'نسكن'],
  },
  // سَافَرَ (to travel) — present tense
  {
    verb: 'سَافَرَ',
    root: 'س-ف-ر',
    meaning: 'to travel',
    paradigm: 'present',
    pronoun: { en: 'I (أنا)', ar: 'أنا' },
    correctForm: 'أسافر',
    distractors: ['يسافر', 'تسافر', 'نسافر'],
  },
  {
    verb: 'سَافَرَ',
    root: 'س-ف-ر',
    meaning: 'to travel',
    paradigm: 'present',
    pronoun: { en: 'He (هو)', ar: 'هو' },
    correctForm: 'يسافر',
    distractors: ['أسافر', 'تسافر', 'نسافر'],
  },
  {
    verb: 'سَافَرَ',
    root: 'س-ف-ر',
    meaning: 'to travel',
    paradigm: 'present',
    pronoun: { en: 'We (نحن)', ar: 'نحن' },
    correctForm: 'نسافر',
    distractors: ['أسافر', 'يسافر', 'تسافر'],
  },
];

/**
 * GrammarFill — Conjugation fill-in-blank quiz.
 *
 * Shows a verb root + paradigm context (pronoun + tense) and 4 conjugated form choices.
 * The correct answer is a conjugated form from VERB_PARADIGMS (not word.arabic).
 *
 * options[i]: { label, value, correct, paradigmContext: { verb, root, meaning, paradigm, pronoun } }
 * paradigmContext is set by useQuiz buildChoices — all display data comes from options[0].paradigmContext.
 */
export default function GrammarFill({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // Deterministic paradigm index seeded from word.id — reset when word changes
  const [paradigmIndex, setParadigmIndex] = useState(() => {
    return word?.id ? word.id.charCodeAt(0) % VERB_PARADIGMS.length : 0;
  });

  useEffect(() => {
    setParadigmIndex(word?.id ? word.id.charCodeAt(0) % VERB_PARADIGMS.length : 0);
  }, [word?.id]);

  // All display data comes from paradigmContext on the first option
  const paradigmContext = options[0]?.paradigmContext;

  // Fallback to embedded data if paradigmContext not yet populated (e.g. during test)
  const displayVerb = paradigmContext?.verb || VERB_PARADIGMS[paradigmIndex]?.verb || '';
  const displayRoot = paradigmContext?.root || VERB_PARADIGMS[paradigmIndex]?.root || '';
  const displayMeaning = paradigmContext?.meaning || VERB_PARADIGMS[paradigmIndex]?.meaning || '';
  const displayParadigm = paradigmContext?.paradigm || VERB_PARADIGMS[paradigmIndex]?.paradigm || '';
  const displayPronoun = paradigmContext?.pronoun || VERB_PARADIGMS[paradigmIndex]?.pronoun || { en: '', ar: '' };

  return (
    <div role="group" aria-label={`Grammar fill: conjugate "${displayMeaning}" in ${displayParadigm} tense for ${displayPronoun.en}`}>
      <div className={styles.instruction} id="grammar-instruction">Complete the conjugation:</div>
      <div className={styles.promptBox} aria-label={`Verb: ${displayVerb}, root: ${displayRoot}, meaning: "${displayMeaning}", ${displayParadigm} tense, pronoun: ${displayPronoun.en}`}>
        <div className={styles.verbRoot}>{formatArabic(displayVerb)}</div>
        <div className={styles.verbMeaning}>"{displayMeaning}"</div>
        <div className={styles.paradigmLabel}>{displayParadigm} tense</div>
        <div className={styles.pronounAr}>{formatArabic(displayPronoun.ar)}</div>
        <div className={styles.pronoun}>{displayPronoun.en}</div>
      </div>
      <div className={styles.choices} role="group" aria-label="Conjugation choices" aria-describedby="grammar-instruction">
        {options.map((c, i) => {
          let cls = styles.choice;
          if (feedback) {
            if (c.correct) cls = styles.choiceCorrect;
            else if (c.value === feedback.selected && !c.correct) cls = styles.choiceWrong;
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !feedback && onAnswer(c.value)}
              disabled={!!feedback}
              aria-label={`Choice ${i + 1}: ${c.label}${feedback && c.correct ? ' (correct answer)' : ''}${feedback && c.value === feedback.selected && !c.correct ? ' (incorrect)' : ''}`}
            >
              {formatArabic(c.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
