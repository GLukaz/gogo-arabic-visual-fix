import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generateWordSearch, checkSelection, getSelectionCells } from '../../utils/wordSearchGenerator.js';
import styles from './WordSearch.module.css';

/**
 * WordSearch Component
 *
 * Interactive Arabic word search puzzle mini-game.
 *
 * Features:
 * - NxN grid with hidden Arabic words
 * - Click/drag to select words
 * - Words can be horizontal (RTL) or vertical
 * - Highlighted found words
 * - Difficulty levels (easy/medium/hard)
 * - Category selection from vocabulary
 * - Timer and score tracking
 * - Celebration on completion
 */
export default function WordSearch({ onBack }) {
  const vocabularyState = useSelector((state) => state.vocabulary);

  const allWords = useMemo(() => vocabularyState.words || [], [vocabularyState.words]);

  const [difficulty, setDifficulty] = useState(null);
  const [category, setCategory] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selection, setSelection] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Get available categories
  const categories = useMemo(() => {
    const cats = new Set();
    allWords.forEach(word => {
      if (word.category) cats.add(word.category);
    });
    return Array.from(cats).sort();
  }, [allWords]);

  // Timer
  useEffect(() => {
    if (!startTime || showCelebration) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, showCelebration]);

  // Check for completion
  useEffect(() => {
    if (puzzle && foundWords.size === puzzle.wordPositions.length && foundWords.size > 0) {
      setShowCelebration(true);
    }
  }, [foundWords, puzzle]);

  const getDifficultySettings = (diff) => {
    switch (diff) {
      case 'easy':
        return { gridSize: 8, wordCount: 4 };
      case 'medium':
        return { gridSize: 10, wordCount: 6 };
      case 'hard':
        return { gridSize: 12, wordCount: 8 };
      default:
        return { gridSize: 10, wordCount: 6 };
    }
  };

  const handleStartGame = () => {
    if (!difficulty || !category) return;

    const { gridSize, wordCount } = getDifficultySettings(difficulty);

    // Get words from selected category
    const categoryWords = allWords
      .filter(w => w.category === category)
      .slice(0, wordCount * 3); // Get more words than needed

    if (categoryWords.length < wordCount) {
      alert(`Not enough words in category ${category}. Need at least ${wordCount} words.`);
      return;
    }

    // Shuffle and select words
    const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, wordCount);

    // Generate puzzle
    const newPuzzle = generateWordSearch(
      selectedWords.map(w => w.arabic),
      gridSize
    );

    // Attach English meanings to word positions
    newPuzzle.wordPositions = newPuzzle.wordPositions.map(pos => {
      const word = selectedWords.find(w =>
        w.arabic.replace(/[\u064B-\u065F\u0670]/g, '').replace(/\s/g, '') === pos.word
      );
      return {
        ...pos,
        english: word?.english || '',
        originalArabic: word?.arabic || pos.word,
      };
    });

    setPuzzle(newPuzzle);
    setFoundWords(new Set());
    setHighlightedCells(new Set());
    setStartTime(Date.now());
    setElapsedTime(0);
    setShowCelebration(false);
  };

  const handleCellMouseDown = (row, col) => {
    setSelecting(true);
    setSelection({ startRow: row, startCol: col, endRow: row, endCol: col });
  };

  const handleCellMouseEnter = (row, col) => {
    if (!selecting || !selection) return;

    // Only allow horizontal or vertical selections
    const { startRow, startCol } = selection;

    if (row === startRow) {
      // Horizontal selection
      setSelection({ ...selection, endRow: row, endCol: col });
    } else if (col === startCol) {
      // Vertical selection
      setSelection({ ...selection, endRow: row, endCol: col });
    }
  };

  const handleCellMouseUp = () => {
    if (!selecting || !selection || !puzzle) {
      setSelecting(false);
      setSelection(null);
      return;
    }

    // Check if selection matches any word
    const match = checkSelection(selection, puzzle.wordPositions);

    if (match && !foundWords.has(match.word)) {
      // Found a new word!
      const newFound = new Set(foundWords);
      newFound.add(match.word);
      setFoundWords(newFound);

      // Highlight cells permanently
      const cells = getSelectionCells(selection);
      const newHighlighted = new Set(highlightedCells);
      cells.forEach(cell => {
        newHighlighted.add(`${cell.row},${cell.col}`);
      });
      setHighlightedCells(newHighlighted);
    }

    setSelecting(false);
    setSelection(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setDifficulty(null);
    setCategory(null);
    setPuzzle(null);
    setFoundWords(new Set());
    setHighlightedCells(new Set());
    setStartTime(null);
    setElapsedTime(0);
    setShowCelebration(false);
  };

  // Setup screen
  if (!puzzle) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Word Search</h1>
          <h2 className={styles.titleArabic}>البحث عن الكلمات</h2>
          <p className={styles.subtitle}>
            Find hidden Arabic words in the grid. Words can be horizontal (right-to-left) or vertical.
          </p>
        </div>

        <div className={styles.setupPanel}>
          {/* Difficulty selection */}
          <div className={styles.setupSection}>
            <h3 className={styles.setupLabel}>Select Difficulty:</h3>
            <div className={styles.buttonGroup}>
              {['easy', 'medium', 'hard'].map((diff) => {
                const settings = getDifficultySettings(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={styles.pixelBtnGold}
                  >
                    {diff.toUpperCase()}
                    <div className={styles.buttonSubtext}>
                      {settings.gridSize}x{settings.gridSize}, {settings.wordCount} words
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category selection */}
          {difficulty && (
            <div className={styles.setupSection}>
              <h3 className={styles.setupLabel}>Select Category:</h3>
              <div className={styles.buttonGroup}>
                {categories.slice(0, 10).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={styles.pixelBtnDark}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          {difficulty && category && (
            <button
              onClick={handleStartGame}
              className={styles.pixelBtnGold}
            >
              Start Game
            </button>
          )}
        </div>

        <button onClick={onBack} className={styles.pixelBtnDark}>
          Back to Mini-Games
        </button>
      </div>
    );
  }

  // Game screen
  const currentSelection = selecting && selection ? getSelectionCells(selection) : [];

  return (
    <div className={styles.container}>
      {/* Game header */}
      <div className={styles.gameHeader}>
        <div className={styles.gameInfo}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Time:</span> {formatTime(elapsedTime)}
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Found:</span> {foundWords.size} / {puzzle.wordPositions.length}
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Difficulty:</span> {difficulty}
          </div>
        </div>
      </div>

      <div className={styles.gameContainer}>
        {/* Grid */}
        <div
          className={styles.gridContainer}
          style={{ gridTemplateColumns: `repeat(${puzzle.grid.length}, 1fr)` }}
          onMouseLeave={() => {
            setSelecting(false);
            setSelection(null);
          }}
        >
          {puzzle.grid.map((row, rowIdx) =>
            row.map((letter, colIdx) => {
              const cellKey = `${rowIdx},${colIdx}`;
              const isHighlighted = highlightedCells.has(cellKey);
              const isCurrentSelection = currentSelection.some(
                cell => cell.row === rowIdx && cell.col === colIdx
              );

              return (
                <div
                  key={cellKey}
                  className={`${styles.gridCell} ${isHighlighted ? styles.foundCell : ''} ${isCurrentSelection ? styles.selectingCell : ''}`}
                  onMouseDown={() => handleCellMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                  onMouseUp={handleCellMouseUp}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        {/* Word list */}
        <div className={styles.wordList}>
          <h3 className={styles.wordListTitle}>Words to Find:</h3>
          {puzzle.wordPositions.map((pos, idx) => {
            const isFound = foundWords.has(pos.word);
            return (
              <div
                key={idx}
                className={`${styles.wordItem} ${isFound ? styles.foundWordItem : ''}`}
              >
                <div className={styles.wordArabic}>
                  {isFound && '✓ '}
                  {pos.originalArabic}
                </div>
                <div className={styles.wordEnglish}>{pos.english}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className={styles.celebrationOverlay}>
          <div className={styles.celebrationPanel}>
            <h2 className={styles.celebrationTitle}>🎉 Congratulations! 🎉</h2>
            <p className={styles.celebrationText}>
              You found all {puzzle.wordPositions.length} words!
            </p>
            <p className={styles.celebrationTime}>
              Time: {formatTime(elapsedTime)}
            </p>
            <div className={styles.celebrationActions}>
              <button onClick={handleStartGame} className={styles.pixelBtnGold}>
                Play Again
              </button>
              <button onClick={handleReset} className={styles.pixelBtnDark}>
                New Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={handleReset} className={styles.pixelBtnDark}>
          New Game
        </button>
      </div>
    </div>
  );
}

/* Inline styles object removed — now using WordSearch.module.css */
