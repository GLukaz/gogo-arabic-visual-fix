/**
 * PlantIdentification.jsx — Herbalist mini-game
 *
 * Multiple-choice plant identification using Arabic plant names.
 * Shows plant descriptions (color, shape, use, smell) and player selects correct name.
 * Difficulty scales with profession level.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RESOURCES } from '../../../data/resources.js';
import { RECIPES } from '../../../data/recipes.js';
import styles from './PlantIdentification.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Plant descriptions in Arabic
const PLANT_DESCRIPTIONS = {
  saffron: {
    color: 'أحمر برتقالي',
    shape: 'خيوط رفيعة',
    use: 'توابل للطعام',
    smell: 'عطري قوي',
  },
  rose_petals: {
    color: 'أحمر وردي',
    shape: 'بتلات ناعمة',
    use: 'عطور وزينة',
    smell: 'عطري جميل',
  },
  mint: {
    color: 'أخضر',
    shape: 'أوراق صغيرة',
    use: 'شاي ودواء',
    smell: 'منعش',
  },
  chamomile: {
    color: 'أبيض وأصفر',
    shape: 'زهرة صغيرة',
    use: 'شاي مهدئ',
    smell: 'حلو خفيف',
  },
  lavender: {
    color: 'بنفسجي',
    shape: 'زهور صغيرة',
    use: 'عطر وزيت',
    smell: 'عطري مهدئ',
  },
  thyme: {
    color: 'أخضر غامق',
    shape: 'أوراق صغيرة',
    use: 'توابل ودواء',
    smell: 'عطري حاد',
  },
  cinnamon: {
    color: 'بني',
    shape: 'عيدان أو مسحوق',
    use: 'توابل حلوة',
    smell: 'حلو دافئ',
  },
  clove: {
    color: 'بني غامق',
    shape: 'براعم صغيرة',
    use: 'توابل قوية',
    smell: 'حاد دافئ',
  },
};

/**
 * Generate questions from recipe ingredients
 */
function generateQuestions(recipeId, professionLevel, recipes = RECIPES, resources = RESOURCES) {
  const recipe = recipes[recipeId];
  if (!recipe || !recipe.ingredients) return [];

  // Get all plant ingredients from recipe
  const plantIngredients = recipe.ingredients
    .map((ing) => resources[ing.resourceId])
    .filter((res) => res && res.professions?.includes('herbalist'));

  if (plantIngredients.length === 0) return [];

  // Determine difficulty settings
  let numQuestions = 3;
  let showEnglish = true;
  let numChoices = 4;
  let hasTimer = false;

  if (professionLevel >= 8) {
    numQuestions = 7;
    showEnglish = false;
    numChoices = 6;
    hasTimer = true;
  } else if (professionLevel >= 4) {
    numQuestions = 5;
    showEnglish = false;
    numChoices = 4;
  }

  // Generate questions (reuse ingredients if needed)
  const questions = [];
  const allPlantResources = Object.values(resources).filter(
    (res) => res.professions?.includes('herbalist')
  );

  for (let i = 0; i < numQuestions; i++) {
    const targetPlant = plantIngredients[i % plantIngredients.length];
    const description = PLANT_DESCRIPTIONS[targetPlant.id] || {
      color: 'ألوان متنوعة',
      shape: 'شكل طبيعي',
      use: 'استخدامات متعددة',
      smell: 'رائحة مميزة',
    };

    // Generate wrong choices (other plants)
    const wrongChoices = allPlantResources
      .filter((res) => res.id !== targetPlant.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, numChoices - 1);

    const choices = [targetPlant, ...wrongChoices].sort(() => Math.random() - 0.5);

    questions.push({
      id: i,
      targetId: targetPlant.id,
      description,
      choices: choices.map((c) => ({
        id: c.id,
        nameArabic: c.nameArabic,
        nameEnglish: showEnglish ? c.nameEnglish : null,
      })),
      showEnglish,
      hasTimer,
      timeLimit: hasTimer ? 20000 : null,
    });
  }

  return questions;
}

export default function PlantIdentification({ recipeId, professionLevel, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize questions
  useEffect(() => {
    if (!recipeId) return;
    const qs = generateQuestions(recipeId, professionLevel);
    setQuestions(qs);
    setCurrentIndex(0);
    setScore({ correct: 0, incorrect: 0 });
    setFeedback(null);
    setIsComplete(false);

    if (qs.length > 0 && qs[0].hasTimer) {
      setTimeRemaining(qs[0].timeLimit);
    }
  }, [recipeId, professionLevel]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (choiceId, isTimeout = false) => {
      if (!currentQuestion || feedback) return;

      const isCorrect = !isTimeout && choiceId === currentQuestion.targetId;
      const correctChoice = currentQuestion.choices.find((c) => c.id === currentQuestion.targetId);

      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }));

      setFeedback({
        isCorrect,
        isTimeout,
        correctAnswer: correctChoice,
      });

      // Move to next question after delay
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setFeedback(null);
          if (questions[currentIndex + 1]?.hasTimer) {
            setTimeRemaining(questions[currentIndex + 1].timeLimit);
          }
        } else {
          // Quiz complete
          setIsComplete(true);
          const totalQuestions = questions.length;
          const accuracy = Math.max(0, (score.correct + (isCorrect ? 1 : 0) - 0.5 * (score.incorrect + (isCorrect ? 0 : 1))) / totalQuestions);
          onComplete?.(accuracy);
        }
      }, 2000);
    },
    [currentQuestion, currentIndex, feedback, questions, score, onComplete]
  );

  // Timer countdown
  useEffect(() => {
    if (!currentQuestion || !currentQuestion.hasTimer || isComplete || feedback) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          // Time's up - mark as incorrect
          handleAnswer(null, true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentQuestion, isComplete, feedback, handleAnswer]);

  if (!currentQuestion || isComplete) {
    return null;
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timerPercent = currentQuestion.hasTimer ? (timeRemaining / currentQuestion.timeLimit) * 100 : 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={styles.questionCount}>
          <span className={styles.arabic}>
            سؤال {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={styles.questionCard}
          initial={reduceMotion ? {} : { rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={reduceMotion ? {} : { rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={styles.title}>ما اسم هذا النبات؟</h3>

          <div className={styles.description}>
            <div className={styles.descRow}>
              <span className={styles.label}>اللون:</span>
              <span className={styles.value}>{currentQuestion.description.color}</span>
            </div>
            <div className={styles.descRow}>
              <span className={styles.label}>الشكل:</span>
              <span className={styles.value}>{currentQuestion.description.shape}</span>
            </div>
            <div className={styles.descRow}>
              <span className={styles.label}>الاستخدام:</span>
              <span className={styles.value}>{currentQuestion.description.use}</span>
            </div>
            <div className={styles.descRow}>
              <span className={styles.label}>الرائحة:</span>
              <span className={styles.value}>{currentQuestion.description.smell}</span>
            </div>
          </div>

          {currentQuestion.hasTimer && (
            <div className={styles.timer}>
              <div className={styles.timerBar} style={{ width: `${timerPercent}%` }} />
              <span className={styles.timerText}>{Math.ceil(timeRemaining / 1000)}s</span>
            </div>
          )}

          <div
            className={`${styles.choices} ${currentQuestion.choices.length === 6 ? styles.choicesGrid6 : styles.choicesGrid4}`}
          >
            {currentQuestion.choices.map((choice) => {
              const isSelected = feedback && choice.id === currentQuestion.targetId;
              const showCorrect = feedback?.isCorrect === false && isSelected;
              const showIncorrect = feedback && !feedback.isCorrect;

              return (
                <button
                  key={choice.id}
                  className={`${styles.choiceButton} ${showCorrect ? styles.correct : ''} ${showIncorrect ? styles.incorrect : ''}`}
                  onClick={() => handleAnswer(choice.id)}
                  disabled={!!feedback}
                >
                  <span className={styles.choiceArabic}>{choice.nameArabic}</span>
                  {choice.nameEnglish && (
                    <span className={styles.choiceEnglish}>{choice.nameEnglish}</span>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <motion.div
              className={`${styles.feedback} ${feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {feedback.isTimeout ? (
                <span>انتهى الوقت!</span>
              ) : feedback.isCorrect ? (
                <span>صحيح!</span>
              ) : (
                <span>
                  خطأ! الإجابة الصحيحة: {feedback.correctAnswer.nameArabic}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
