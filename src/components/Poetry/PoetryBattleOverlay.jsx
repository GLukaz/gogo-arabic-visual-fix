/**
 * PoetryBattleOverlay.jsx
 *
 * React overlay for untimed fill-in-the-blank poetry battles.
 *
 * POET-04: NO timer, NO countdown, NO time-pressure UI anywhere.
 *   Players advance by clicking choices — there is no auto-advance.
 *
 * POET-05: NPC poet fills blanks with configurable accuracy.
 *   Winners earn 50 XP and FSRS vocabulary cards for correctly answered words.
 *
 * Flow:
 *   1. selectActiveBattle → renders when battle is in_progress or scoring
 *   2. Each blank: load 4 choices via getPoetryChoices → player clicks
 *   3. After last blank: status → 'scoring' → NPC answers generated → scores shown
 *   4. Close button: emits POETRY_BATTLE_END → GameLayout clears overlay
 *
 * Rewards dispatched from this component (not middleware) so the overlay
 * can also display the reward list to the player.
 */

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectActiveBattle,
  submitPlayerAnswer,
  advanceBlank,
  setChoices,
  setNpcAnswers,
  endPoetryBattle,
} from '../../store/slices/poetrySlice.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { addXP } from '../../store/slices/playerSlice.js';
import { getPoetryChoices, generateNpcAnswers, calculatePoetryScore } from '../../services/poetryBattle.js';
import { getPoemById } from '../../data/poems.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './PoetryBattleOverlay.module.css';

/**
 * PoetryBattleOverlay — renders when a poetry battle is active.
 * @param {{ npcAccuracy?: number }} props
 */
export default function PoetryBattleOverlay({ npcAccuracy = 0.7 }) {
  const dispatch = useDispatch();
  const battle = useSelector(selectActiveBattle);
  const fsrsCards = useSelector((state) => state.vocabulary?.fsrsCards || {});

  // Local state for per-choice visual feedback (correct/wrong flash)
  const [choiceFeedback, setChoiceFeedback] = useState(null); // { index, isCorrect }
  const [choicesDisabled, setChoicesDisabled] = useState(false);

  // Scoring state
  const [scoreResult, setScoreResult] = useState(null); // { playerScore, npcScore, won, rewards }

  // Don't render if no active battle
  if (!battle) return null;

  const poem = getPoemById(battle.poemId);
  if (!poem) {
    console.error('[PoetryBattleOverlay] Poem not found:', battle.poemId);
    return null;
  }

  return (
    <BattleContent
      battle={battle}
      poem={poem}
      npcAccuracy={npcAccuracy}
      fsrsCards={fsrsCards}
      dispatch={dispatch}
      choiceFeedback={choiceFeedback}
      setChoiceFeedback={setChoiceFeedback}
      choicesDisabled={choicesDisabled}
      setChoicesDisabled={setChoicesDisabled}
      scoreResult={scoreResult}
      setScoreResult={setScoreResult}
    />
  );
}

/**
 * Inner component — separated so hooks run unconditionally.
 * (Rules of hooks: hooks cannot be called after an early return)
 */
function BattleContent({
  battle,
  poem,
  npcAccuracy,
  fsrsCards,
  dispatch,
  choiceFeedback,
  setChoiceFeedback,
  choicesDisabled,
  setChoicesDisabled,
  scoreResult,
  setScoreResult,
}) {
  const currentBlankIndex = battle.currentBlankIndex;
  const currentBlank = battle.blanks?.[currentBlankIndex];

  // Load choices when blank changes (in_progress status only)
  useEffect(() => {
    if (battle.status !== 'in_progress') return;
    if (!currentBlank) return;

    const choices = getPoetryChoices(
      currentBlank.wordId,
      currentBlank.correctWord,
      currentBlank.cefrLevel
    );
    dispatch(setChoices(choices));
    setChoiceFeedback(null);
    setChoicesDisabled(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBlankIndex, battle.status]);

  // Scoring phase: generate NPC answers and calculate scores once
  useEffect(() => {
    if (battle.status !== 'scoring' || scoreResult) return;

    const npcAnswers = generateNpcAnswers(battle.blanks, npcAccuracy);
    dispatch(setNpcAnswers(npcAnswers));

    const { playerScore, npcScore, won } = calculatePoetryScore(
      battle.playerAnswers,
      npcAnswers
    );

    // Collect reward info before dispatching endPoetryBattle
    const rewards = [];
    if (won) {
      rewards.push('50 XP earned');
      dispatch(addXP(50));

      // FSRS vocabulary reward: add card for each correctly answered word
      battle.playerAnswers.forEach((answer) => {
        if (answer?.isCorrect && answer.wordId && !fsrsCards[answer.wordId]) {
          dispatch(addFsrsCard({ wordId: answer.wordId, card: null, source: 'poetry_battle' }));
          rewards.push(`New word unlocked`);
        }
      });

      EventBus.emit(EVENTS.SFX_QUEST);
    }

    dispatch(endPoetryBattle({ won, playerScore, npcScore }));
    setScoreResult({ playerScore, npcScore, won, rewards });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle.status]);

  // Handle choice click — no timer, no auto-advance (POET-04)
  const handleChoiceClick = useCallback(
    (choice, idx) => {
      if (choicesDisabled) return;

      setChoicesDisabled(true);
      setChoiceFeedback({ index: idx, isCorrect: choice.isCorrect });

      dispatch(
        submitPlayerAnswer({
          blankIndex: currentBlankIndex,
          wordId: choice.wordId,
          isCorrect: choice.isCorrect,
        })
      );

      // After visual feedback delay, advance to next blank
      // This setTimeout is ONLY for visual feedback delay — not time pressure.
      // The player has already clicked; we're just showing them the result.
      setTimeout(() => {
        dispatch(advanceBlank());
      }, 600);
    },
    [choicesDisabled, currentBlankIndex, dispatch, setChoiceFeedback, setChoicesDisabled]
  );

  // Close battle overlay
  const handleClose = useCallback(() => {
    EventBus.emit(EVENTS.POETRY_BATTLE_END);
  }, []);

  // Build flat blank map for rendering: blankIndex → answer info
  const answeredBlanks = {};
  battle.playerAnswers.forEach((answer, idx) => {
    if (answer) answeredBlanks[idx] = answer;
  });

  // Running player score during play
  const runningScore = battle.playerAnswers.filter((a) => a?.isCorrect).length;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.poemContainer}>
          {/* Score panel */}
          <div className={styles.scorePanel}>
            <div className={styles.scoreBlock}>
              <span className={styles.scoreLabel}>Your Score</span>
              <span className={styles.scoreValue}>
                {scoreResult ? scoreResult.playerScore : runningScore}
                /{battle.blanks.length}
              </span>
            </div>
            <div className={styles.scoreBlock}>
              <span className={styles.scoreLabel}>Poet&apos;s Score</span>
              <span className={styles.scoreValue}>
                {scoreResult ? `${scoreResult.npcScore}/${battle.blanks.length}` : '?'}
              </span>
            </div>
          </div>

          {/* Poem header */}
          <div className={styles.poemTitle}>{poem.title}</div>
          <div className={styles.poetName}>{poem.poet} — {poem.era}</div>

          {/* Poem lines with blanks */}
          {poem.lines.map((line, lineIdx) => (
            <PoemLine
              key={lineIdx}
              line={line}
              lineIdx={lineIdx}
              battle={battle}
              answeredBlanks={answeredBlanks}
              currentBlankIndex={currentBlankIndex}
              scoreResult={scoreResult}
            />
          ))}

          {/* Choices grid — shown only during in_progress */}
          {battle.status === 'in_progress' && battle.choices.length > 0 && (
            <div className={styles.choicesGrid}>
              {battle.choices.map((choice, idx) => {
                let choiceClass = styles.choiceButton;
                if (choiceFeedback !== null && choiceFeedback.index === idx) {
                  choiceClass = choiceFeedback.isCorrect ? styles.choiceCorrect : styles.choiceWrong;
                }
                return (
                  <button
                    key={choice.wordId}
                    className={choiceClass}
                    onClick={() => handleChoiceClick(choice, idx)}
                    disabled={choicesDisabled}
                    aria-label={choice.arabic}
                  >
                    {choice.arabic}
                  </button>
                );
              })}
            </div>
          )}

          {/* Results — shown after scoring */}
          {scoreResult && (
            <div>
              <div className={scoreResult.won ? styles.resultWin : styles.resultLoss}>
                {scoreResult.won ? 'Victory!' : 'Well Played'}
              </div>
              <div className={styles.scorePanel} style={{ marginTop: '0.75rem' }}>
                <div className={styles.scoreBlock}>
                  <span className={styles.scoreLabel}>You</span>
                  <span className={styles.scoreValue}>
                    {scoreResult.playerScore}/{battle.blanks.length}
                  </span>
                </div>
                <div className={styles.scoreBlock}>
                  <span className={styles.scoreLabel}>Poet</span>
                  <span className={styles.scoreValue}>
                    {scoreResult.npcScore}/{battle.blanks.length}
                  </span>
                </div>
              </div>
              {scoreResult.rewards.length > 0 && (
                <ul className={styles.rewardsList}>
                  {scoreResult.rewards.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
              <button className={styles.closeButton} onClick={handleClose}>
                Continue
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Render a single poem line, replacing blank positions with interactive spans.
 * @param {{ line, lineIdx, battle, answeredBlanks, currentBlankIndex, scoreResult }} props
 */
function PoemLine({ line, lineIdx, battle, answeredBlanks, currentBlankIndex, scoreResult }) {
  // Collect blanks on this line
  const lineBlanks = battle.blanks
    .map((b, globalIdx) => ({ ...b, globalIdx }))
    .filter((b) => b.lineIndex === lineIdx);

  if (lineBlanks.length === 0) {
    // No blanks on this line — render as-is using fullText for display lines
    return (
      <p className={styles.verseLine}>{line.fullText || line.text}</p>
    );
  }

  // Build segments by splitting line.text on blank markers (_____+)
  // The text uses _____ (5+ underscores) as blank markers
  const segments = [];
  let _remaining = line.text;
  let blankIdx = 0;

  const blankPattern = /_{3,}/g;
  let lastEnd = 0;
  let match;

  while ((match = blankPattern.exec(line.text)) !== null) {
    // Text before this blank
    if (match.index > lastEnd) {
      segments.push({ type: 'text', content: line.text.slice(lastEnd, match.index) });
    }

    // This blank slot
    const blankEntry = lineBlanks[blankIdx];
    if (blankEntry) {
      const globalIdx = blankEntry.globalIdx;
      const answered = answeredBlanks[globalIdx];
      const isCurrentBlank = globalIdx === currentBlankIndex && !scoreResult;

      segments.push({
        type: 'blank',
        globalIdx,
        answered,
        isCurrentBlank,
        correctWord: blankEntry.correctWord,
      });
      blankIdx++;
    }
    lastEnd = match.index + match[0].length;
  }

  // Trailing text after last blank
  if (lastEnd < line.text.length) {
    segments.push({ type: 'text', content: line.text.slice(lastEnd) });
  }

  const hasActiveBlank = lineBlanks.some((b) => b.globalIdx === currentBlankIndex && !scoreResult);

  return (
    <p className={hasActiveBlank ? styles.verseLineActive : styles.verseLine}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.content}</span>;
        }
        // Blank span
        if (!seg.answered) {
          return (
            <span
              key={i}
              className={seg.isCurrentBlank ? styles.blankActive : styles.blank}
            >
              {seg.isCurrentBlank ? '___' : '___'}
            </span>
          );
        }
        return (
          <span
            key={i}
            className={seg.answered.isCorrect ? styles.blankCorrect : styles.blankWrong}
          >
            {seg.correctWord}
          </span>
        );
      })}
    </p>
  );
}
