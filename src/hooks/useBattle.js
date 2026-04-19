import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startBattle as startBattleAction, dealDamage, useHint as activateHintAction, endBattle, resetBattle } from '../store/slices/battleSlice.js';
import { addXP, addDirhams, spendDirhams } from '../store/slices/playerSlice.js';
import { addFsrsCard, updateFsrsCard } from '../store/slices/vocabularySlice.js';
import { createNewCard, reviewCard, Rating } from '../services/fsrs.js';
import { selectBattleWords } from '../utils/wordSelection.js';
import { shuffle } from '../utils/shuffle.js';
import vocabulary from '../data/vocabularyAll.js';
import { getBossById } from '../data/bosses.js';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';

const HINT_COST = 50;
const ROUND_TIME_LIMIT = 15000; // 15 seconds per round
const BASE_DAMAGE = 25;
const CRITICAL_MULTIPLIER = 2;

/**
 * Custom hook for managing Word Duel battles
 * Handles battle state, word selection, damage calculation, and victory/defeat logic
 */
export function useBattle(bossId) {
  const dispatch = useDispatch();
  const battleState = useSelector((s) => s.battle);
  const fsrsCards = useSelector((s) => s.vocabulary.fsrsCards);
  const playerDirhams = useSelector((s) => s.player.dirhams);

  const [battleWords, setBattleWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(null);
  const [choices, setChoices] = useState([]);
  const [quizType, setQuizType] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME_LIMIT);
  const [battleStartTime] = useState(Date.now());

  const timerRef = useRef(null);
  const roundStartTimeRef = useRef(null);

  const boss = getBossById(bossId);

  // Initialize battle
  const initBattle = useCallback(() => {
    if (!boss) return;

    // Select words based on boss category and difficulty
    const words = selectBattleWords(
      vocabulary,
      boss.category,
      boss.difficulty,
      8 // 8 rounds per battle
    );

    setBattleWords(words);
    dispatch(startBattleAction({ bossId: boss.id, bossHP: boss.hp }));

    // Start first round
    setCurrentWordIndex(0);
  }, [boss, dispatch]);

  // Build choices for current word
  const buildChoices = useCallback((word, type) => {
    const distractors = vocabulary
      .filter((w) => w.id !== word.id && w.category === word.category)
      .slice(0, 3);

    if (type === 'ar-to-en' || type === 'listen') {
      return shuffle([
        { label: word.english, value: word.english, correct: true },
        ...distractors.map((d) => ({ label: d.english, value: d.english, correct: false })),
      ]);
    } else if (type === 'en-to-ar') {
      return shuffle([
        { label: word.arabic, value: word.arabic, correct: true },
        ...distractors.map((d) => ({ label: d.arabic, value: d.arabic, correct: false })),
      ]);
    }
    return [];
  }, []);

  // Load next round
  const loadRound = useCallback(() => {
    if (!boss || currentWordIndex >= battleWords.length) return;

    const word = battleWords[currentWordIndex];
    const type = boss.attackPatterns[Math.floor(Math.random() * boss.attackPatterns.length)];
    const newChoices = type !== 'en-to-type-ar' ? buildChoices(word, type) : [];

    setCurrentWord(word);
    setQuizType(type);
    setChoices(newChoices);
    setFeedback(null);
    setTimeRemaining(ROUND_TIME_LIMIT);
    roundStartTimeRef.current = Date.now();

    // Start round timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          clearInterval(timerRef.current);
          // Auto-submit wrong answer on timeout
          handleAnswer('', true);
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }, [boss, battleWords, currentWordIndex, buildChoices]);

  // Calculate damage based on speed and streak
  const calculateDamage = useCallback((correct, timeElapsed) => {
    if (!correct) return BASE_DAMAGE; // Player takes damage

    // Boss damage calculation
    let damage = BASE_DAMAGE;

    // Speed bonus (answer within 5 seconds = +5 damage)
    if (timeElapsed < 5000) {
      damage += 5;
    }

    // Critical hit on 3-streak
    if (battleState.streak >= 2) {
      damage *= CRITICAL_MULTIPLIER;
    }

    return Math.floor(damage);
  }, [battleState.streak]);

  // Handle answer submission
  const handleAnswer = useCallback((userAnswer, isTimeout = false) => {
    if (!currentWord || feedback) return;

    const timeElapsed = Date.now() - (roundStartTimeRef.current || Date.now());

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Check correctness
    let correct = false;
    if (!isTimeout) {
      if (quizType === 'ar-to-en' || quizType === 'listen') {
        correct = userAnswer === currentWord.english;
      } else if (quizType === 'en-to-ar') {
        correct = userAnswer === currentWord.arabic;
      } else if (quizType === 'en-to-type-ar') {
        const normalize = (s) => s.replace(/[\u064B-\u065F\u0670]/g, '').trim();
        correct = normalize(userAnswer) === normalize(currentWord.arabic);
      }
    }

    // Calculate damage
    const damage = calculateDamage(correct, timeElapsed);

    // Apply damage
    dispatch(dealDamage({ damage, correct }));

    // Update FSRS card
    if (!fsrsCards[currentWord.id]) {
      dispatch(addFsrsCard({ wordId: currentWord.id, card: createNewCard() }));
    }
    const rating = correct ? Rating.Good : Rating.Again;
    const currentCard = fsrsCards[currentWord.id]?.card || createNewCard();
    const result = reviewCard(currentCard, rating);
    dispatch(updateFsrsCard({ wordId: currentWord.id, card: result.card, log: result.log }));

    // Set feedback
    const correctAnswer = (quizType === 'ar-to-en' || quizType === 'listen')
      ? currentWord.english
      : currentWord.arabic;

    setFeedback({
      correct,
      correctAnswer,
      damage,
      isCritical: battleState.streak >= 2 && correct,
      isTimeout,
    });

    // Play sound effect
    EventBus.emit(correct ? EVENTS.SFX_CORRECT : EVENTS.SFX_WRONG);

    // Get appropriate dialogue
    if (boss && correct) {
      EventBus.emit(EVENTS.BOSS_DIALOGUE, boss.dialogue.hit);
    } else if (boss && !correct) {
      EventBus.emit(EVENTS.BOSS_DIALOGUE, boss.dialogue.miss);
    }
  }, [currentWord, quizType, feedback, calculateDamage, battleState.streak, boss, dispatch, fsrsCards]);

  // Advance to next round
  const nextRound = useCallback(() => {
    const nextIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextIndex);
    setFeedback(null);
  }, [currentWordIndex]);

  // Use hint (eliminate one wrong answer)
  const useHint = useCallback(() => {
    if (playerDirhams < HINT_COST || choices.length <= 2) return false;

    dispatch(spendDirhams(HINT_COST));
    dispatch(activateHintAction());

    // Remove one wrong answer
    const wrongChoices = choices.filter(c => !c.correct);
    if (wrongChoices.length > 0) {
      const toRemove = wrongChoices[0];
      setChoices(choices.filter(c => c !== toRemove));
      EventBus.emit(EVENTS.SFX_QUEST);
      return true;
    }

    return false;
  }, [playerDirhams, choices, dispatch]);

  // End battle and distribute rewards
  const finishBattle = useCallback((victory) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!boss) return;

    const timeElapsed = Date.now() - battleStartTime;
    const accuracy = battleState.currentRound > 0
      ? Math.round(((battleState.currentRound - battleState.hintsUsed) / battleState.currentRound) * 100)
      : 0;

    const rewards = victory ? boss.rewards : { xp: 0, dirhams: 0 };

    if (victory) {
      dispatch(addXP(rewards.xp));
      dispatch(addDirhams(rewards.dirhams));
      EventBus.emit(EVENTS.SFX_QUEST);
      if (boss.dialogue.defeat) {
        EventBus.emit(EVENTS.BOSS_DIALOGUE, boss.dialogue.defeat);
      }
    } else {
      EventBus.emit(EVENTS.SFX_WRONG);
      if (boss.dialogue.victory) {
        EventBus.emit(EVENTS.BOSS_DIALOGUE, boss.dialogue.victory);
      }
    }

    dispatch(endBattle({ victory, accuracy, timeElapsed, rewards }));
  }, [boss, battleState, battleStartTime, dispatch]);

  // Check for battle end conditions
  useEffect(() => {
    if (battleState.activeBattle !== bossId) return;

    // Player defeated
    if (battleState.playerHP <= 0) {
      finishBattle(false);
    }
    // Boss defeated
    else if (battleState.bossHP <= 0) {
      finishBattle(true);
    }
    // Load next round if feedback is cleared
    else if (!feedback && currentWordIndex < battleWords.length) {
      loadRound();
    }
    // All rounds complete but battle continues (shouldn't happen normally)
    else if (currentWordIndex >= battleWords.length && battleState.bossHP > 0) {
      finishBattle(false);
    }
  }, [battleState, bossId, feedback, currentWordIndex, battleWords.length, finishBattle, loadRound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    battle: {
      active: battleState.activeBattle === bossId,
      boss,
      playerHP: battleState.playerHP,
      bossHP: battleState.bossHP,
      maxBossHP: battleState.maxBossHP,
      currentRound: battleState.currentRound,
      streak: battleState.streak,
      hintsUsed: battleState.hintsUsed,
      currentWord,
      choices,
      quizType,
      feedback,
      timeRemaining,
      canUseHint: playerDirhams >= HINT_COST && choices.length > 2,
    },
    initBattle,
    handleAnswer,
    nextRound,
    useHint,
    finishBattle,
  };
}
