import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import MEMORY_MATCH_SETS from '../../data/miniGames/memoryMatchSets.js';
import { recordMemoryScore } from '../../store/slices/miniGameSlice.js';
import styles from './MemoryMatchGame.module.css';

/**
 * MemoryMatchGame — Phase 85 card-flipping memory game.
 *
 * Grid of face-down cards. Each pair: Arabic word + English meaning.
 * Flip two cards to find a match. Timer tracks completion speed.
 * Optional TTS reads Arabic word when card is flipped.
 */

const GRID_SIZES = {
  easy: { pairs: 8, cols: 4 },   // 4x4 = 16 cards
  hard: { pairs: 12, cols: 4 },  // 4x6 = 24 cards
};

export default function MemoryMatchGame({ onBack }) {
  const dispatch = useDispatch();

  // Setup
  const [selectedSet, setSelectedSet] = useState(null);
  const [gridSize, setGridSize] = useState(null);

  // Game state
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const ttsAvailable = useRef(false);

  // Check TTS availability
  useEffect(() => {
    ttsAvailable.current = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, []);

  // Timer
  useEffect(() => {
    if (!startTime || completed) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, completed]);

  // Check completion
  useEffect(() => {
    if (cards.length > 0 && matchedPairs.size === cards.length / 2) {
      setCompleted(true);
      const time = Math.floor((Date.now() - startTime) / 1000);
      dispatch(recordMemoryScore({ setId: selectedSet.id, time }));
    }
  }, [matchedPairs, cards, startTime, selectedSet, dispatch]);

  const startGame = useCallback((set, size) => {
    setSelectedSet(set);
    setGridSize(size);

    const { pairs: pairCount } = GRID_SIZES[size];
    const selectedPairs = shuffle(set.pairs).slice(0, pairCount);

    // Create card array: each pair has an Arabic card and an English card
    const cardArray = [];
    selectedPairs.forEach((pair, idx) => {
      cardArray.push({
        id: `ar-${idx}`,
        pairId: idx,
        text: pair.arabic,
        type: 'arabic',
        isArabic: true,
      });
      cardArray.push({
        id: `en-${idx}`,
        pairId: idx,
        text: pair.english,
        type: 'english',
        isArabic: false,
      });
    });

    setCards(shuffle(cardArray));
    setFlippedIds([]);
    setMatchedPairs(new Set());
    setStartTime(Date.now());
    setElapsed(0);
    setMoves(0);
    setCompleted(false);
    setIsChecking(false);
  }, []);

  const resetGame = () => {
    setSelectedSet(null);
    setGridSize(null);
    setCompleted(false);
  };

  // ─── Card flip logic ─────────────────────────────────────────
  const handleCardClick = (card) => {
    if (isChecking) return;
    if (flippedIds.includes(card.id)) return;
    if (matchedPairs.has(card.pairId)) return;

    // TTS for Arabic cards
    if (card.isArabic && ttsAvailable.current) {
      try {
        const utterance = new SpeechSynthesisUtterance(card.text);
        utterance.lang = 'ar';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Graceful fallback: no TTS
      }
    }

    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);

      const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id));

      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match found
        setTimeout(() => {
          setMatchedPairs((prev) => new Set(prev).add(first.pairId));
          setFlippedIds([]);
          setIsChecking(false);
        }, 600);
      } else {
        // No match — flip back
        setTimeout(() => {
          setFlippedIds([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  // ─── Setup screen ────────────────────────────────────────────
  if (!selectedSet) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Memory Match</h1>
          <h2 className={styles.titleArabic}>لعبة الذاكرة</h2>
          <p className={styles.subtitle}>
            Match Arabic words with their English meanings
          </p>
        </div>

        <div className={styles.setList}>
          {MEMORY_MATCH_SETS.map((set) => (
            <div key={set.id} className={styles.setCard}>
              <span className={styles.setTitle}>{set.title}</span>
              <span className={styles.setTitleAr}>{set.titleArabic}</span>
              <span className={styles.setMeta}>
                {set.cefrLevel} | {set.pairs.length} pairs
              </span>
              <div className={styles.sizeButtons}>
                <button
                  className={styles.sizeBtn}
                  onClick={() => startGame(set, 'easy')}
                >
                  Easy (4x4)
                </button>
                <button
                  className={styles.sizeBtn}
                  onClick={() => startGame(set, 'hard')}
                  disabled={set.pairs.length < 12}
                >
                  Hard (4x6)
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onBack} className={styles.backBtn}>Back</button>
      </div>
    );
  }

  // ─── Game screen ─────────────────────────────────────────────
  const { cols } = GRID_SIZES[gridSize];

  return (
    <div className={styles.container}>
      <div className={styles.infoBar}>
        <span className={styles.infoPiece}>{selectedSet.title}</span>
        <span className={styles.infoPiece}>Moves: {moves}</span>
        <span className={styles.infoPiece}>
          Pairs: {matchedPairs.size}/{cards.length / 2}
        </span>
        <span className={styles.infoPiece}>{formatTime(elapsed)}</span>
      </div>

      {/* Card grid */}
      <div
        className={styles.cardGrid}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairs.has(card.pairId);

          let cardClass = styles.card;
          if (isFlipped) cardClass += ` ${styles.cardFlipped}`;
          if (isMatched) cardClass += ` ${styles.cardMatched}`;

          return (
            <button
              key={card.id}
              className={cardClass}
              onClick={() => handleCardClick(card)}
              disabled={isMatched}
              aria-label={isFlipped || isMatched ? card.text : 'Face-down card'}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={`${styles.cardBack} ${card.isArabic ? styles.cardArabic : styles.cardEnglish}`}>
                  {card.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={resetGame} className={styles.darkBtn}>New Game</button>
      </div>

      {/* Completion overlay */}
      {completed && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <h2 className={styles.overlayTitle}>All Pairs Matched!</h2>
            <div className={styles.resultStats}>
              <div className={styles.resultStat}>
                <span className={styles.resultNum}>{formatTime(elapsed)}</span>
                <span className={styles.resultLabel}>Time</span>
              </div>
              <div className={styles.resultStat}>
                <span className={styles.resultNum}>{moves}</span>
                <span className={styles.resultLabel}>Moves</span>
              </div>
            </div>
            <div className={styles.overlayActions}>
              <button onClick={() => startGame(selectedSet, gridSize)} className={styles.goldBtn}>
                Play Again
              </button>
              <button onClick={resetGame} className={styles.darkBtn}>New Set</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
