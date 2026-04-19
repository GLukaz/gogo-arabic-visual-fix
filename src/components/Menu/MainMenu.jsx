import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDueCards } from '../../services/fsrs.js';
import { audioManager } from '../../services/audio.js';
import { getTodayPhrase } from '../../services/dailyPhraseService.js';
import { isDigestReady, getDigestIfReady } from '../../services/weeklyDigestService.js';
import { selectCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { selectHasCompletedPlacement, recordPlacementResult } from '../../store/slices/placementSlice.js';
import { setCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { bulkUnlockLessons } from '../../store/slices/grammarSlice.js';
import { bulkUnlockNodes } from '../../store/slices/skillTreeSlice.js';
import { deriveGrammarUnlocks, deriveSkillTreeUnlocks } from '../../services/placementEngine.js';
import PlacementTestOverlay from '../Placement/PlacementTestOverlay.jsx';
import WeeklyDigestModal from './WeeklyDigestModal.jsx';
import styles from './MainMenu.module.css';

export default function MainMenu({ onStartGame, onAlphabet, onReview, onSettings, onCharacterCreation, onGrammar }) {
  const cards = useSelector((s) => s.vocabulary.fsrsCards);
  const player = useSelector((s) => s.player);
  const analytics = useSelector((s) => s.analytics);
  const hasCompletedPlacement = useSelector(selectHasCompletedPlacement);
  const cefrLevel = useSelector(selectCefrLevel);
  const dispatch = useDispatch();

  // Today's phrase — deterministic by date, filtered to player's CEFR level
  const todayPhrase = useMemo(() => getTodayPhrase(cefrLevel || 'A1'), [cefrLevel]);
  const [showPlacement, setShowPlacement] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(null);

  const hasCharacter = player.name !== '';

  // Start menu BGM when component mounts
  useEffect(() => {
    audioManager.playBGM('menu');
    // Don't stop BGM on unmount -- let the next screen's BGM crossfade naturally
  }, []);

  // Check weekly digest on first render
  useEffect(() => {
    if (isDigestReady()) {
      const playerState = {
        dailyActivity: analytics.dailyActivity || {},
        sessions: analytics.sessions || [],
        wordAccuracy: analytics.wordAccuracy || {},
        grammarState: {},
        readingState: {},
        conversationState: {},
        statsState: {},
      };
      const digest = getDigestIfReady(playerState);
      if (digest) {
        setWeeklyDigest(digest);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-show placement test for players who have a character but haven't been placed
  useEffect(() => {
    if (hasCharacter && !hasCompletedPlacement) {
      setShowPlacement(true);
    }
  }, [hasCharacter, hasCompletedPlacement]); // eslint-disable-line react-hooks/exhaustive-deps

  let dueCount = 0;
  try {
    dueCount = getDueCards(cards).length;
  } catch {
    dueCount = 0;
  }

  const handlePlacementComplete = (assignedLevel, rawScore, storedLevel) => {
    // 1. Record placement result
    dispatch(recordPlacementResult({ assignedLevel, rawScore }));

    // 2. Set CEFR level
    dispatch(setCefrLevel({ level: storedLevel, source: 'placement' }));

    // 3. Pre-unlock grammar lessons up to assigned CEFR level
    const grammarIds = deriveGrammarUnlocks(assignedLevel);
    if (grammarIds.length > 0) {
      dispatch(bulkUnlockLessons(grammarIds));
    }

    // 4. Pre-unlock skill tree nodes up to assigned CEFR level
    const treeUnlocks = deriveSkillTreeUnlocks(assignedLevel);
    for (const [treeId, nodeIds] of Object.entries(treeUnlocks)) {
      dispatch(bulkUnlockNodes({ treeId, nodeIds }));
    }

    setShowPlacement(false);
  };

  const handlePlacementSkip = () => {
    // Skip = start at beginner (A1 default)
    dispatch(recordPlacementResult({ assignedLevel: 'A1', rawScore: 0 }));
    dispatch(setCefrLevel({ level: 'A1', source: 'placement_skip' }));

    // Pre-unlock A1 grammar lessons for skippers too
    const grammarIds = deriveGrammarUnlocks('A1');
    if (grammarIds.length > 0) {
      dispatch(bulkUnlockLessons(grammarIds));
    }

    // Pre-unlock A1 skill tree nodes
    const treeUnlocks = deriveSkillTreeUnlocks('A1');
    for (const [treeId, nodeIds] of Object.entries(treeUnlocks)) {
      dispatch(bulkUnlockNodes({ treeId, nodeIds }));
    }

    setShowPlacement(false);
  };

  return (
    <div className={styles.container} role="main">
      <h1 className={styles.title}>Gogo Arabic</h1>
      <div className={styles.titleArabic} lang="ar" aria-hidden="true">يلا عربي</div>

      {todayPhrase && (
        <div className={styles.phraseCard} aria-label="Daily Arabic phrase" role="complementary">
          <div className={styles.phraseLabel}>Today&apos;s Phrase</div>
          <div className={styles.phraseArabic} lang="ar">{todayPhrase.arabic}</div>
          <div className={styles.phraseTranslit}>{todayPhrase.transliteration}</div>
          <div className={styles.phraseEnglish}>{todayPhrase.english}</div>
        </div>
      )}

      <nav className={styles.btnGroup} aria-label="Main menu">
        {hasCharacter ? (
          <button
            className={styles.btnGold}
            onClick={() => { audioManager.playSFX('click'); onStartGame(); }}
            aria-label="Continue your saved game"
          >
            Continue Game
          </button>
        ) : (
          <button
            className={styles.btnGold}
            onClick={() => { audioManager.playSFX('click'); onCharacterCreation(); }}
            aria-label="Start a new game"
          >
            New Game
          </button>
        )}

        <button
          className={styles.btnDark}
          onClick={() => { audioManager.playSFX('click'); onReview(); }}
          aria-label={`Daily vocabulary reviews${dueCount > 0 ? `, ${dueCount} due` : ''}`}
        >
          Daily Reviews
          {dueCount > 0 && <span className={styles.badge} aria-hidden="true">{dueCount}</span>}
        </button>

        <button
          className={styles.btnDark}
          onClick={() => { audioManager.playSFX('click'); onAlphabet(); }}
          aria-label="Learn the Arabic alphabet"
        >
          Alphabet
        </button>

        <button
          className={styles.btnDark}
          onClick={() => { audioManager.playSFX('click'); onGrammar(); }}
          aria-label="Learn Arabic grammar"
        >
          Grammar
        </button>

        <button
          className={styles.btnDark}
          onClick={() => { audioManager.playSFX('click'); onSettings(); }}
          aria-label="Open settings"
        >
          Settings
        </button>
      </nav>

      {showPlacement && (
        <PlacementTestOverlay
          onComplete={handlePlacementComplete}
          onSkip={handlePlacementSkip}
        />
      )}

      {weeklyDigest && !showPlacement && (
        <WeeklyDigestModal
          digest={weeklyDigest}
          onDismiss={() => setWeeklyDigest(null)}
        />
      )}
    </div>
  );
}
