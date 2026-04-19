import { useState } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { COLORS, FONTS, pixelBtnGold } from '../../styles/theme.js';

const styles = {
  instruction: {
    fontFamily: FONTS.pixel,
    fontSize: '10px',
    color: COLORS.brown,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  prompt: {
    fontSize: '36px',
    fontFamily: FONTS.arabicDisplay,
    direction: 'rtl',
    margin: '10px 0 6px',
    color: COLORS.gold,
    textShadow: `1px 1px 0px ${COLORS.brown}`,
  },
  englishHint: {
    fontFamily: FONTS.pixel,
    fontSize: '10px',
    color: COLORS.brown,
    fontStyle: 'italic',
    marginBottom: '14px',
  },
  inputField: {
    width: '100%',
    fontFamily: FONTS.pixel,
    fontSize: '12px',
    padding: '12px 14px',
    border: `4px solid ${COLORS.dark}`,
    background: COLORS.dark,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: '8px',
    outline: 'none',
    letterSpacing: '1px',
    imageRendering: 'pixelated',
    boxSizing: 'border-box',
    boxShadow: 'inset 3px 3px 0px 0px rgba(0,0,0,0.3)',
  },
  inputCorrect: {
    borderColor: COLORS.green,
    boxShadow: 'inset 3px 3px 0px 0px rgba(0,0,0,0.2), 0 0 0 2px rgba(46,204,113,0.3)',
  },
  inputWrong: {
    borderColor: COLORS.red,
    boxShadow: 'inset 3px 3px 0px 0px rgba(0,0,0,0.2), 0 0 0 2px rgba(240,49,49,0.3)',
  },
  correctLabel: {
    fontFamily: FONTS.pixel,
    fontSize: '10px',
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  correctAnswer: {
    fontFamily: FONTS.pixel,
    fontSize: '13px',
    color: COLORS.green,
    marginTop: '4px',
    letterSpacing: '1px',
  },
  submitBtn: {
    ...pixelBtnGold,
    fontSize: '11px',
    padding: '10px 24px',
    marginTop: '4px',
  },
  hint: {
    fontFamily: FONTS.pixel,
    fontSize: '9px',
    color: COLORS.lightGray,
    marginBottom: '8px',
    fontStyle: 'italic',
  },
};

export default function Transliteration({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (feedback || !input.trim()) return;
    onAnswer(input.trim().toLowerCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  let inputStyle = styles.inputField;
  if (feedback) {
    inputStyle = {
      ...inputStyle,
      ...(feedback.correct ? styles.inputCorrect : styles.inputWrong),
    };
  }

  return (
    <div role="group" aria-label={`Transliteration: romanize ${word.transliteration || word.arabic} (${word.english})`}>
      <div style={styles.instruction} id="translit-instruction">Type the transliteration (romanized):</div>
      <div style={styles.prompt} aria-label={`Arabic word: ${word.transliteration || word.arabic}`}>{formatArabic(word.arabic)}</div>
      <div style={styles.englishHint} aria-label={`Meaning: ${word.english}`}>{word.english}</div>
      <div style={styles.hint}>e.g. "kitaab", "baytu", "salaam"</div>
      <input
        style={inputStyle}
        type="text"
        value={input}
        onChange={(e) => !feedback && setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type transliteration..."
        disabled={!!feedback}
        autoFocus
        aria-label="Type the romanized transliteration"
        aria-describedby="translit-instruction"
      />
      {feedback && !feedback.correct && (
        <div role="alert">
          <div style={styles.correctLabel}>Correct answer:</div>
          <div style={styles.correctAnswer}>{feedback.correctAnswer}</div>
        </div>
      )}
      {!feedback && (
        <button style={styles.submitBtn} onClick={handleSubmit} disabled={!input.trim()} aria-label="Submit transliteration">
          Submit
        </button>
      )}
    </div>
  );
}
