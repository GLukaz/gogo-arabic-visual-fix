import { useState } from 'react';
import ArabicKeyboard from '../Keyboard/ArabicKeyboard.jsx';
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
    fontFamily: FONTS.pixel,
    fontSize: '15px',
    margin: '12px 0 16px',
    color: COLORS.dark,
  },
  inputDisplay: {
    direction: 'rtl',
    fontSize: '28px',
    fontFamily: FONTS.arabic,
    padding: '12px 20px',
    minHeight: '54px',
    background: COLORS.dark,
    border: `4px solid ${COLORS.gray}`,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: '4px',
    boxShadow: `
      inset 3px 3px 0px 0px rgba(0,0,0,0.3),
      inset -3px -3px 0px 0px rgba(255,255,255,0.05)
    `,
    imageRendering: 'pixelated',
  },
  feedbackCorrect: {
    borderColor: COLORS.green,
    boxShadow: `
      inset 3px 3px 0px 0px rgba(0,0,0,0.3),
      inset -3px -3px 0px 0px rgba(46,204,113,0.15),
      0 0 0 2px rgba(46,204,113,0.3)
    `,
  },
  feedbackWrong: {
    borderColor: COLORS.red,
    boxShadow: `
      inset 3px 3px 0px 0px rgba(0,0,0,0.3),
      inset -3px -3px 0px 0px rgba(240,49,49,0.15),
      0 0 0 2px rgba(240,49,49,0.3)
    `,
  },
  correctAnswer: {
    fontSize: '20px',
    fontFamily: FONTS.arabic,
    direction: 'rtl',
    color: COLORS.green,
    marginTop: '8px',
    marginBottom: '4px',
  },
  correctLabel: {
    fontFamily: FONTS.pixel,
    fontSize: '10px',
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  submitBtn: {
    ...pixelBtnGold,
    fontSize: '11px',
    padding: '12px 28px',
    marginTop: '8px',
  },
};

export default function EnglishToTypeArabic({ word, feedback, onAnswer }) {
  const [input, setInput] = useState('');

  const handleKey = (letter) => {
    if (feedback) return;
    setInput((prev) => prev + letter);
  };

  const handleBackspace = () => {
    if (feedback) return;
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (feedback || !input.trim()) return;
    onAnswer(input.trim());
  };

  let inputStyle = styles.inputDisplay;
  if (feedback) {
    inputStyle = {
      ...inputStyle,
      ...(feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong),
    };
  }

  return (
    <div role="group" aria-label={`Type Arabic: translate "${word.english}"`}>
      <div style={styles.instruction} id="type-ar-instruction">Type the Arabic translation:</div>
      <div style={styles.prompt} aria-label={`English word: ${word.english}`}>{word.english}</div>
      <div style={inputStyle} role="textbox" aria-readonly="true" aria-label={`Your Arabic input: ${input || 'empty'}`}>{input || '\u200B'}</div>
      {feedback && !feedback.correct && (
        <div role="alert">
          <div style={styles.correctLabel}>Correct answer:</div>
          <div style={styles.correctAnswer}>
            {feedback.correctAnswer}
          </div>
        </div>
      )}
      <ArabicKeyboard
        onKeyPress={handleKey}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        showSubmit={!feedback}
      />
    </div>
  );
}
