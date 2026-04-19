import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { completeLesson, recordExerciseProgress, recordQuizProgress } from '../../store/slices/grammarSlice.js';
import { addXP } from '../../store/slices/playerSlice.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { grammarLessons } from '../../data/grammar.js';
import ExplanationStage from './stages/ExplanationStage.jsx';
import ExamplesStage from './stages/ExamplesStage.jsx';
import RulesStage from './stages/RulesStage.jsx';
import ExerciseStage from './stages/ExerciseStage.jsx';
import QuizStage from './stages/QuizStage.jsx';
import CompleteStage from './stages/CompleteStage.jsx';
import styles from './stages/GrammarStages.module.css';

const XP_REWARDS = { EXERCISE_CORRECT: 5, QUIZ_CORRECT: 10, LESSON_COMPLETE: 50, PERFECT_LESSON: 100 };

export default function GrammarLesson({ lessonId, onBack }) {
  const dispatch = useDispatch();
  const formatArabic = useFormatArabic();
  const lesson = grammarLessons.find((l) => l.id === lessonId);
  const [stage, setStage] = useState('explanation');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [matchedPairs, setMatchedPairs] = useState({});
  const [selectedMatchIndex, setSelectedMatchIndex] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [exerciseScore, setExerciseScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!lesson) return;
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') { onBack(); }
      if (stage === 'exercises' || stage === 'quiz') {
        const exercise = stage === 'exercises' ? lesson.exercises[currentExerciseIndex] : null;
        const quiz = stage === 'quiz' ? lesson.quiz[currentQuizIndex] : null;
        const item = exercise || quiz;
        if (item && item.type !== 'match' && !showFeedback) {
          if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            if (item.options && item.options[optionIndex]) { handleAnswerSelect(item.options[optionIndex]); }
          }
        }
        if (e.key === 'Enter' && showFeedback) { handleNext(); }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, currentExerciseIndex, currentQuizIndex, showFeedback, lesson, onBack]);

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <div>Lesson not found</div>
        <button onClick={onBack} className={`${styles.pixelBtnDark} ${styles.notFoundBack}`}>Back</button>
      </div>
    );
  }

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    const isExercise = stage === 'exercises';
    const currentIndex = isExercise ? currentExerciseIndex : currentQuizIndex;
    const item = isExercise ? lesson.exercises[currentIndex] : lesson.quiz[currentIndex];
    const isCorrect = answer === item.answer || answer === item.correct;
    if (isExercise) {
      setExerciseAnswers({ ...exerciseAnswers, [currentIndex]: answer });
      if (isCorrect) { setExerciseScore(exerciseScore + 1); dispatch(addXP(XP_REWARDS.EXERCISE_CORRECT)); }
    } else {
      setQuizAnswers({ ...quizAnswers, [currentIndex]: answer });
      if (isCorrect) { setQuizScore(quizScore + 1); dispatch(addXP(XP_REWARDS.QUIZ_CORRECT)); }
    }
    setFeedbackMessage(isCorrect ? 'Correct!' : `Wrong! The answer is: ${item.answer || item.options[item.correct]}`);
    setShowFeedback(true);
  };

  const handleMatchSelect = (index, _value) => {
    if (showFeedback) return;
    const exercise = lesson.exercises[currentExerciseIndex];
    if (selectedMatchIndex === null) { setSelectedMatchIndex(index); } else {
      const firstPair = exercise.pairs[selectedMatchIndex];
      const secondPair = exercise.pairs[index];
      const isMatch = (firstPair[0] === secondPair[0] && firstPair[1] === secondPair[1]) || (firstPair[0] === secondPair[1] && firstPair[1] === secondPair[0]);
      if (isMatch && selectedMatchIndex !== index) {
        const newMatched = { ...matchedPairs, [selectedMatchIndex]: true, [index]: true };
        setMatchedPairs(newMatched);
        if (Object.keys(newMatched).length === exercise.pairs.length * 2) {
          setExerciseScore(exerciseScore + 1); dispatch(addXP(XP_REWARDS.EXERCISE_CORRECT));
          setFeedbackMessage('All pairs matched!'); setShowFeedback(true);
        }
      }
      setSelectedMatchIndex(null);
    }
  };

  const handleNext = () => {
    setShowFeedback(false); setFeedbackMessage('');
    if (stage === 'exercises') {
      if (currentExerciseIndex < lesson.exercises.length - 1) { setCurrentExerciseIndex(currentExerciseIndex + 1); setMatchedPairs({}); setSelectedMatchIndex(null); } else {
        dispatch(recordExerciseProgress({ lessonId: lesson.id, score: Math.round((exerciseScore / lesson.exercises.length) * 100) }));
        if (lesson.quiz.length === 0) {
          const exerciseScorePercent = Math.round((exerciseScore / lesson.exercises.length) * 100);
          dispatch(completeLesson({ lessonId: lesson.id, exerciseScore: exerciseScorePercent, quizScore: 100 }));
          dispatch(addXP(exerciseScore === lesson.exercises.length ? XP_REWARDS.PERFECT_LESSON : XP_REWARDS.LESSON_COMPLETE));
          setStage('complete');
        } else { setStage('quiz'); }
      }
    } else if (stage === 'quiz') {
      if (currentQuizIndex < lesson.quiz.length - 1) { setCurrentQuizIndex(currentQuizIndex + 1); } else {
        const quizScorePercent = Math.round((quizScore / lesson.quiz.length) * 100);
        dispatch(recordQuizProgress({ lessonId: lesson.id, score: quizScorePercent }));
        const exerciseScorePercent = Math.round((exerciseScore / lesson.exercises.length) * 100);
        dispatch(completeLesson({ lessonId: lesson.id, exerciseScore: exerciseScorePercent, quizScore: quizScorePercent }));
        if (exerciseScore === lesson.exercises.length && quizScore === lesson.quiz.length) { dispatch(addXP(XP_REWARDS.PERFECT_LESSON)); } else { dispatch(addXP(XP_REWARDS.LESSON_COMPLETE)); }
        setStage('complete');
      }
    }
  };

  switch (stage) {
    case 'explanation': return <ExplanationStage lesson={lesson} formatArabic={formatArabic} onBack={onBack} onNext={() => setStage('examples')} />;
    case 'examples': return <ExamplesStage lesson={lesson} formatArabic={formatArabic} onBack={() => setStage('explanation')} onNext={() => setStage('rules')} />;
    case 'rules': return <RulesStage lesson={lesson} onBack={() => setStage('examples')} onNext={() => setStage('exercises')} />;
    case 'exercises': return <ExerciseStage lesson={lesson} currentIndex={currentExerciseIndex} score={exerciseScore} answers={exerciseAnswers} matchedPairs={matchedPairs} selectedMatchIndex={selectedMatchIndex} showFeedback={showFeedback} feedbackMessage={feedbackMessage} formatArabic={formatArabic} onAnswerSelect={handleAnswerSelect} onMatchSelect={handleMatchSelect} onNext={handleNext} onQuit={onBack} />;
    case 'quiz': return <QuizStage lesson={lesson} currentIndex={currentQuizIndex} score={quizScore} answers={quizAnswers} showFeedback={showFeedback} feedbackMessage={feedbackMessage} onAnswerSelect={handleAnswerSelect} onNext={handleNext} onQuit={onBack} />;
    case 'complete': return <CompleteStage lesson={lesson} exerciseScore={exerciseScore} quizScore={quizScore} onBack={onBack} />;
    default: return null;
  }
}
