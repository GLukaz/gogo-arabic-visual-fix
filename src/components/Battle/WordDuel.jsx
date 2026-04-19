import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBattle } from '../../hooks/useBattle.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import BattleResult from './BattleResult.jsx';
import styles from './WordDuel.module.css';

/**
 * WordDuel - Turn-based word battle component
 * Player answers Arabic questions to damage the boss
 * Wrong answers cause player to take damage
 *
 * @param {Object} props
 * @param {string} props.bossId - ID of the boss to battle
 * @param {Function} props.onClose - Callback when battle ends
 */
export default function WordDuel({ bossId, onClose }) {
  const {
    battle,
    initBattle,
    handleAnswer,
    nextRound,
    useHint: activateHint,
  } = useBattle(bossId);

  const formatArabic = useFormatArabic();
  const [userInput, setUserInput] = useState('');
  const [bossDialogue, setBossDialogue] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Initialize battle on mount
  useEffect(() => {
    if (bossId && !battle.active) {
      initBattle();
      if (battle.boss?.dialogue?.intro) {
        setBossDialogue(battle.boss.dialogue.intro);
      }
    }
  }, [bossId, battle.active, battle.boss, initBattle]);

  // Check for battle end
  useEffect(() => {
    if (!battle.active && battle.boss) {
      // Battle ended - show result screen
      setShowResult(true);
    }
  }, [battle.active, battle.boss]);

  // Handle choice selection
  const handleChoice = useCallback((value) => {
    if (battle.feedback) return; // Already answered
    handleAnswer(value);
  }, [battle.feedback, handleAnswer]);

  // Handle type quiz submission
  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || battle.feedback) return;
    handleAnswer(userInput);
    setUserInput('');
  }, [userInput, battle.feedback, handleAnswer]);

  // Handle next round
  const handleNext = useCallback(() => {
    nextRound();
  }, [nextRound]);

  // Handle hint usage
  const handleHint = useCallback(() => {
    const used = activateHint();
    if (used) {
      setBossDialogue('One wrong answer has been eliminated!');
    }
  }, [activateHint]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (battle.feedback) {
        // After answering, press Enter to continue
        if (e.key === 'Enter') {
          handleNext();
        }
        return;
      }

      // During question
      if (battle.quizType === 'en-to-type-ar') {
        if (e.key === 'Enter') {
          handleSubmit();
        }
      } else {
        // Number keys 1-4 for choices
        const num = parseInt(e.key);
        if (num >= 1 && num <= battle.choices.length) {
          handleChoice(battle.choices[num - 1].value);
        }
      }

      // Escape to use hint
      if (e.key === 'h' || e.key === 'H') {
        handleHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [battle.feedback, battle.quizType, battle.choices, handleNext, handleChoice, handleSubmit, handleHint]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.25, ease: 'easeOut' };

  if (showResult) {
    return (
      <BattleResult
        bossId={bossId}
        victory={battle.bossHP <= 0 && battle.playerHP > 0}
        onClose={onClose}
      />
    );
  }

  if (!battle.active || !battle.boss || !battle.currentWord) {
    return null;
  }

  const bossHPPercent = (battle.bossHP / battle.maxBossHP) * 100;
  const playerHPPercent = battle.playerHP;
  const timePercent = (battle.timeRemaining / 15000) * 100;

  return (
    <motion.div
      className={styles.overlay}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
    >
      <motion.div
        className={styles.battleContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        {/* Hint Button */}
        {!battle.feedback && battle.quizType !== 'en-to-type-ar' && (
          <button
            className={styles.hintBtn}
            onClick={handleHint}
            disabled={!battle.canUseHint}
            title="Eliminate one wrong answer (50 dirhams) - Press H"
          >
            Hint (50💰)
          </button>
        )}

        {/* Boss Section */}
        <div className={styles.bossSection}>
          <div className={styles.bossHeader}>
            <div className={styles.bossSprite}>{battle.boss.sprite}</div>
            <div className={styles.bossInfo}>
              <h2 className={styles.bossName}>{battle.boss.name}</h2>
              <p className={styles.bossNameArabic}>{battle.boss.nameArabic}</p>
            </div>
          </div>
          <div className={styles.hpBarContainer}>
            <div className={styles.hpBar} style={{ width: `${bossHPPercent}%` }}>
              <span className={styles.hpText}>
                {battle.bossHP} / {battle.maxBossHP} HP
              </span>
            </div>
          </div>
        </div>

        {/* Boss Dialogue */}
        {bossDialogue && (
          <div className={styles.dialogue}>
            {bossDialogue}
          </div>
        )}

        {/* Question Section */}
        <div className={styles.questionSection}>
          <div className={styles.roundInfo}>
            <span>Round {battle.currentRound + 1}</span>
            {battle.streak > 0 && (
              <span className={`${styles.streak} ${battle.streak >= 3 ? styles.streakCritical : ''}`}>
                🔥 {battle.streak} streak{battle.streak >= 3 ? ' - CRITICAL!' : ''}
              </span>
            )}
            <span className={`${styles.timer} ${timePercent < 33 ? styles.timerLow : ''}`}>
              {Math.ceil(battle.timeRemaining / 1000)}s
            </span>
          </div>

          {/* Question Prompt */}
          {battle.quizType === 'ar-to-en' && (
            <>
              <p className={styles.prompt}>What does this mean in English?</p>
              <div className={styles.arabicPrompt}>{formatArabic(battle.currentWord.arabic)}</div>
            </>
          )}

          {battle.quizType === 'en-to-ar' && (
            <>
              <p className={styles.prompt}>Select the Arabic translation:</p>
              <div className={`${styles.prompt} ${styles.promptEnglishWord}`}>
                {battle.currentWord.english}
              </div>
            </>
          )}

          {battle.quizType === 'listen' && (
            <>
              <p className={styles.prompt}>Listen and choose the correct meaning:</p>
              <button
                onClick={() => {
                  const audio = new Audio(`/audio/${battle.currentWord.audioRef || 'placeholder'}.mp3`);
                  audio.play().catch(() => console.warn('Audio not available'));
                }}
                className={styles.audioBtn}
                title="Click to play audio"
              >
                🔊
              </button>
            </>
          )}

          {battle.quizType === 'en-to-type-ar' && (
            <>
              <p className={styles.prompt}>Type the Arabic translation:</p>
              <div className={`${styles.prompt} ${styles.promptEnglishWord}`}>
                {battle.currentWord.english}
              </div>
              <input
                type="text"
                className={styles.typeInput}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={!!battle.feedback}
                placeholder="اكتب هنا..."
                autoFocus
              />
            </>
          )}

          {/* Choices */}
          {battle.quizType !== 'en-to-type-ar' && (
            <div className={styles.choices}>
              {battle.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={`${styles.choiceBtn} ${
                    battle.quizType === 'en-to-ar' ? styles.arabic : ''
                  }`}
                  onClick={() => handleChoice(choice.value)}
                  disabled={!!battle.feedback}
                >
                  {idx + 1}. {battle.quizType === 'en-to-ar' ? formatArabic(choice.label) : choice.label}
                </button>
              ))}
            </div>
          )}

          {/* Submit Button for Type Quiz */}
          {battle.quizType === 'en-to-type-ar' && !battle.feedback && (
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!userInput.trim()}
            >
              Submit
            </button>
          )}

          {/* Feedback */}
          <AnimatePresence mode="wait">
            {battle.feedback && (
              <motion.div
                className={`${styles.feedback} ${
                  battle.feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className={styles.feedbackText}>
                  {battle.feedback.correct ? '✓ Correct!' : `✗ Wrong! Correct answer: ${battle.feedback.correctAnswer}`}
                </p>
                <p className={`${styles.feedbackDamage} ${battle.feedback.isCritical ? styles.feedbackCritical : ''}`}>
                  {battle.feedback.correct
                    ? `${battle.feedback.damage} damage dealt${battle.feedback.isCritical ? ' - CRITICAL HIT!' : ''}!`
                    : `You took ${battle.feedback.damage} damage!`}
                </p>
                <button className={styles.nextBtn} onClick={handleNext}>
                  Next Round (Enter)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player Section */}
        <div className={styles.playerSection}>
          <div className={styles.playerInfo}>
            <span>Your HP</span>
            <span>Hints Used: {battle.hintsUsed}</span>
          </div>
          <div className={styles.hpBarContainer}>
            <div className={`${styles.hpBar} ${styles.player}`} style={{ width: `${playerHPPercent}%` }}>
              <span className={styles.hpText}>{battle.playerHP} / 100 HP</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

import PropTypes from 'prop-types';
WordDuel.propTypes = {
  bossId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
