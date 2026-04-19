import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './GrammarStages.module.css';

export default function ExerciseStage({
  lesson, currentIndex, score, answers, matchedPairs, selectedMatchIndex,
  showFeedback, feedbackMessage, formatArabic,
  onAnswerSelect, onMatchSelect, onNext, onQuit,
}) {
  const exercise = lesson.exercises[currentIndex];

  // Internal state for multi-step exercise types
  const [multiSelected, setMultiSelected] = useState([]);
  const [clozeIndex, setClozeIndex] = useState(0);
  const [classifyIndex, setClassifyIndex] = useState(0);

  const feedbackClass = feedbackMessage.includes('Correct') ? styles.feedbackCorrect : styles.feedbackWrong;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <button onClick={onQuit} className={styles.pixelBtnDark}>Quit</button>
        <div className={styles.title}>
          Exercise {currentIndex + 1} / {lesson.exercises.length}
        </div>
        <div className={styles.scoreDisplay}>
          Score: {score}/{lesson.exercises.length}
        </div>
      </div>

      <div className={styles.body}>
        {exercise.type === 'fill-blank' && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceBase;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {exercise.type === 'translate' && (
          <>
            <div className={styles.promptCenter}>
              Translate: {exercise.prompt}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabic;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceArabicCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicWrong;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => onAnswerSelect(option)}
                    className={cls}
                    disabled={showFeedback}
                  >
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {exercise.type === 'match' && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.choicesWrapGap}>
              {exercise.pairs.flatMap((pair, idx) => [
                <button
                  key={`${idx}-0`}
                  onClick={() => onMatchSelect(idx * 2, pair[0])}
                  className={
                    matchedPairs[idx * 2]
                      ? styles.matchBtnArabicMatched
                      : selectedMatchIndex === idx * 2
                      ? styles.matchBtnArabicSelected
                      : styles.matchBtnArabic
                  }
                  disabled={matchedPairs[idx * 2]}
                >
                  {formatArabic(pair[0])}
                </button>,
                <button
                  key={`${idx}-1`}
                  onClick={() => onMatchSelect(idx * 2 + 1, pair[1])}
                  className={
                    matchedPairs[idx * 2 + 1]
                      ? styles.matchBtnEnglishMatched
                      : selectedMatchIndex === idx * 2 + 1
                      ? styles.matchBtnEnglishSelected
                      : styles.matchBtnEnglish
                  }
                  disabled={matchedPairs[idx * 2 + 1]}
                >
                  {pair[1]}
                </button>,
              ])}
            </div>
          </>
        )}

        {/* ── conjugation-drill ─────────────────────────────────────────── */}
        {exercise.type === 'conjugation-drill' && (
          <>
            <div className={styles.promptCenterSmall}>
              Conjugate: <span className={styles.verbLabel}>{formatArabic(exercise.verb)}</span>
              {exercise.root && (
                <span className={styles.rootNote}>
                  (root: {formatArabic(exercise.root)})
                </span>
              )}
            </div>
            <div className={`${styles.text} ${styles.paradigmNote}`}>
              Pronoun: <strong>{formatArabic(exercise.pronoun)}</strong> &mdash; Paradigm: {exercise.paradigm}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabicLarge;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceArabicLargeCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicLargeWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── sentence-transformation ───────────────────────────────────── */}
        {exercise.type === 'sentence-transformation' && (
          <>
            <div className={styles.promptCenterSmall}>
              {exercise.prompt}
            </div>
            {exercise.hint && (
              <div className={styles.hintText}>
                Hint: {exercise.hint}
              </div>
            )}
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabic;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceArabicCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── word-order ────────────────────────────────────────────────── */}
        {exercise.type === 'word-order' && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabic;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceArabicCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── error-identification ──────────────────────────────────────── */}
        {exercise.type === 'error-identification' && (
          <>
            <div className={styles.errorLabel}>
              Find the error:
            </div>
            <div className={styles.arabicSentence}>
              {formatArabic(exercise.sentence)}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabic;
                if (showFeedback) {
                  if (option === exercise.error) cls = styles.choiceArabicCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
            {showFeedback && feedbackMessage.includes('Correct') && (
              <div className={styles.correctionNote}>
                Correction: <strong>{formatArabic(exercise.correction)}</strong>
              </div>
            )}
          </>
        )}

        {/* ── multiple-select ───────────────────────────────────────────── */}
        {exercise.type === 'multiple-select' && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                const isSelected = multiSelected.includes(option);
                const isCorrect = exercise.correctAnswers.includes(option);
                let cls = isSelected ? styles.choiceSelected : styles.choiceBase;
                if (showFeedback) {
                  if (isCorrect) cls = styles.choiceCorrect;
                  else if (isSelected) cls = styles.choiceWrong;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (showFeedback) return;
                      const next = isSelected
                        ? multiSelected.filter((s) => s !== option)
                        : [...multiSelected, option];
                      setMultiSelected(next);
                    }}
                    className={cls}
                    disabled={showFeedback}
                  >
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
            {!showFeedback && (
              <div className={styles.multiSelectSubmit}>
                <button
                  onClick={() => {
                    const joined = exercise.correctAnswers.slice().sort().join(',');
                    onAnswerSelect(joined);
                    setMultiSelected([]);
                  }}
                  className={styles.pixelBtnGoldMt}
                >
                  Check ({multiSelected.length} selected)
                </button>
              </div>
            )}
          </>
        )}

        {/* ── true-false ────────────────────────────────────────────────── */}
        {exercise.type === 'true-false' && (
          <>
            <div className={styles.arabicSentenceSmall}>
              {formatArabic(exercise.statement)}
            </div>
            <div className={styles.choicesWrap}>
              {['true', 'false'].map((option, idx) => {
                let cls = styles.choiceBase;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {option === 'true' ? 'True ✓' : 'False ✗'}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── cloze ─────────────────────────────────────────────────────── */}
        {exercise.type === 'cloze' && (
          <>
            <div className={styles.promptCenter}>
              Fill in the blanks:
            </div>
            <div className={styles.arabicSentenceLarge}>
              {formatArabic(exercise.text)}
            </div>
            {exercise.blanks[clozeIndex] && (
              <>
                <div className={styles.classifyCounter}>
                  Blank {clozeIndex + 1} of {exercise.blanks.length}
                </div>
                <div className={styles.choicesWrap}>
                  {exercise.blanks[clozeIndex].options.map((option, idx) => {
                    const isLastBlank = clozeIndex === exercise.blanks.length - 1;
                    let cls = styles.choiceArabicLarge;
                    if (showFeedback && isLastBlank) {
                      if (option === exercise.blanks[clozeIndex].answer) cls = styles.choiceArabicLargeCorrect;
                      else if (option === answers[currentIndex]) cls = styles.choiceArabicLargeWrong;
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (showFeedback) return;
                          const correct = option === exercise.blanks[clozeIndex].answer;
                          if (correct && clozeIndex < exercise.blanks.length - 1) {
                            setClozeIndex(clozeIndex + 1);
                          } else {
                            onAnswerSelect(option);
                            setClozeIndex(0);
                          }
                        }}
                        className={cls}
                        disabled={showFeedback}
                      >
                        {idx + 1}. {formatArabic(option)}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {/* ── classify ──────────────────────────────────────────────────── */}
        {exercise.type === 'classify' && exercise.items[classifyIndex] && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.arabicSentenceLarge}>
              {formatArabic(exercise.items[classifyIndex].text)}
            </div>
            <div className={styles.classifyCounter}>
              Item {classifyIndex + 1} of {exercise.items.length}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.categories.map((cat, idx) => {
                const correctCat = exercise.items[classifyIndex].category;
                const isLastItem = classifyIndex === exercise.items.length - 1;
                let cls = styles.choiceBase;
                if (showFeedback && isLastItem) {
                  if (cat === correctCat) cls = styles.choiceCorrect;
                  else if (cat === answers[currentIndex]) cls = styles.choiceWrong;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (showFeedback) return;
                      const correct = cat === correctCat;
                      if (correct && classifyIndex < exercise.items.length - 1) {
                        setClassifyIndex(classifyIndex + 1);
                      } else {
                        onAnswerSelect(cat);
                        setClassifyIndex(0);
                      }
                    }}
                    className={cls}
                    disabled={showFeedback}
                  >
                    {idx + 1}. {cat}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── build-sentence ────────────────────────────────────────────── */}
        {exercise.type === 'build-sentence' && (
          <>
            <div className={styles.promptCenter}>
              {exercise.prompt}
            </div>
            <div className={styles.choicesWrap}>
              {exercise.options.map((option, idx) => {
                let cls = styles.choiceArabic;
                if (showFeedback) {
                  if (option === exercise.answer) cls = styles.choiceArabicCorrect;
                  else if (option === answers[currentIndex]) cls = styles.choiceArabicWrong;
                }
                return (
                  <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                    {idx + 1}. {formatArabic(option)}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {showFeedback && (
          <>
            <div className={feedbackClass}>{feedbackMessage}</div>
            <button onClick={onNext} className={styles.pixelBtnGoldMt}>Next</button>
          </>
        )}
      </div>
    </motion.div>
  );
}
