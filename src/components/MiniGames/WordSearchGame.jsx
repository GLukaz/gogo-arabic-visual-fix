import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import WORD_SEARCH_PUZZLES from '../../data/miniGames/wordSearchPuzzles.js';
import { recordWordSearchScore } from '../../store/slices/miniGameSlice.js';
import styles from './WordSearchGame.module.css';

/**
 * WordSearchGame — Phase 85 pre-built Arabic word search puzzles.
 *
 * 10x10 grids with 6-8 hidden words.
 * Supports horizontal, vertical, and diagonal selections.
 * Score = words found + time bonus.
 */
export default function WordSearchGame({ onBack }) {
  const dispatch = useDispatch();

  // Setup state
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  // Game state
  const [foundWords, setFoundWords] = useState(new Set());
  const [selecting, setSelecting] = useState(false);
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState(new Set());
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);

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
    if (selectedPuzzle && foundWords.size === selectedPuzzle.words.length && foundWords.size > 0) {
      setCompleted(true);
      const timeBonus = Math.max(0, 300 - elapsed);
      const score = foundWords.size * 100 + timeBonus;
      dispatch(recordWordSearchScore({ puzzleId: selectedPuzzle.id, score }));
    }
  }, [foundWords, selectedPuzzle, elapsed, dispatch]);

  const filteredPuzzles = difficultyFilter
    ? WORD_SEARCH_PUZZLES.filter((p) => p.difficulty === difficultyFilter)
    : WORD_SEARCH_PUZZLES;

  const startGame = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setFoundWords(new Set());
    setHighlightedCells(new Set());
    setStartTime(Date.now());
    setElapsed(0);
    setCompleted(false);
    setSelecting(false);
    setSelStart(null);
    setSelEnd(null);
  };

  const resetGame = () => {
    setSelectedPuzzle(null);
    setCompleted(false);
  };

  // ─── Selection logic ─────────────────────────────────────────
  const getCellsBetween = useCallback((start, end) => {
    if (!start || !end) return [];
    const cells = [];
    const dr = Math.sign(end.row - start.row);
    const dc = Math.sign(end.col - start.col);
    const rowDist = Math.abs(end.row - start.row);
    const colDist = Math.abs(end.col - start.col);

    // Only allow straight lines (horizontal, vertical, diagonal)
    if (rowDist !== colDist && dr !== 0 && dc !== 0) return [];

    const steps = Math.max(rowDist, colDist);
    for (let i = 0; i <= steps; i++) {
      cells.push({ row: start.row + i * dr, col: start.col + i * dc });
    }
    return cells;
  }, []);

  const handlePointerDown = (row, col) => {
    setSelecting(true);
    setSelStart({ row, col });
    setSelEnd({ row, col });
  };

  const handlePointerEnter = (row, col) => {
    if (!selecting) return;
    setSelEnd({ row, col });
  };

  const handlePointerUp = () => {
    if (!selecting || !selStart || !selEnd || !selectedPuzzle) {
      setSelecting(false);
      setSelStart(null);
      setSelEnd(null);
      return;
    }

    const cells = getCellsBetween(selStart, selEnd);
    if (cells.length === 0) {
      setSelecting(false);
      setSelStart(null);
      setSelEnd(null);
      return;
    }

    // Check against each unfound word
    for (const word of selectedPuzzle.words) {
      if (foundWords.has(word.arabic)) continue;

      const wordCells = getCellsForWord(word);
      if (cellsMatch(cells, wordCells)) {
        const next = new Set(foundWords);
        next.add(word.arabic);
        setFoundWords(next);

        const newHL = new Set(highlightedCells);
        wordCells.forEach((c) => newHL.add(`${c.row},${c.col}`));
        setHighlightedCells(newHL);
        break;
      }
    }

    setSelecting(false);
    setSelStart(null);
    setSelEnd(null);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  // ─── Setup screen ────────────────────────────────────────────
  if (!selectedPuzzle) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Word Search</h1>
          <h2 className={styles.titleArabic}>البحث عن الكلمات</h2>
        </div>

        <div className={styles.filterRow}>
          {['easy', 'medium', 'hard'].map((d) => (
            <button
              key={d}
              className={`${styles.filterBtn} ${difficultyFilter === d ? styles.filterActive : ''}`}
              onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.puzzleList}>
          {filteredPuzzles.map((p) => (
            <button key={p.id} className={styles.puzzleCard} onClick={() => startGame(p)}>
              <span className={styles.puzzleTitle}>{p.title}</span>
              <span className={styles.puzzleTitleAr}>{p.titleArabic}</span>
              <span className={styles.puzzleMeta}>
                {p.difficulty} | {p.cefrLevel} | {p.words.length} words
              </span>
            </button>
          ))}
        </div>

        <button onClick={onBack} className={styles.backBtn}>Back</button>
      </div>
    );
  }

  // ─── Game screen ─────────────────────────────────────────────
  const currentSel = selecting ? getCellsBetween(selStart, selEnd) : [];

  return (
    <div className={styles.container}>
      {/* Info bar */}
      <div className={styles.infoBar}>
        <span className={styles.infoPiece}>Time: {formatTime(elapsed)}</span>
        <span className={styles.infoPiece}>
          Found: {foundWords.size}/{selectedPuzzle.words.length}
        </span>
        <span className={styles.infoPiece}>{selectedPuzzle.title}</span>
      </div>

      <div className={styles.gameArea}>
        {/* Grid */}
        <div
          className={styles.grid}
          onPointerLeave={() => {
            setSelecting(false);
            setSelStart(null);
            setSelEnd(null);
          }}
        >
          {selectedPuzzle.grid.map((row, ri) =>
            row.map((letter, ci) => {
              const key = `${ri},${ci}`;
              const isHL = highlightedCells.has(key);
              const isSel = currentSel.some((c) => c.row === ri && c.col === ci);

              return (
                <div
                  key={key}
                  className={`${styles.cell} ${isHL ? styles.cellFound : ''} ${isSel ? styles.cellSelecting : ''}`}
                  onPointerDown={() => handlePointerDown(ri, ci)}
                  onPointerEnter={() => handlePointerEnter(ri, ci)}
                  onPointerUp={handlePointerUp}
                >
                  {letter}
                </div>
              );
            }),
          )}
        </div>

        {/* Word list */}
        <div className={styles.wordList}>
          <h3 className={styles.wordListTitle}>Words to Find</h3>
          {selectedPuzzle.words.map((w) => {
            const isFound = foundWords.has(w.arabic);
            return (
              <div
                key={w.arabic + w.english}
                className={`${styles.wordItem} ${isFound ? styles.wordFound : ''}`}
              >
                <span className={styles.wordArabic}>{isFound ? '✓ ' : ''}{w.arabic}</span>
                <span className={styles.wordEnglish}>{w.english}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion overlay */}
      {completed && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <h2 className={styles.overlayTitle}>All Words Found!</h2>
            <p className={styles.overlayText}>
              Time: {formatTime(elapsed)} | Score: {foundWords.size * 100 + Math.max(0, 300 - elapsed)}
            </p>
            <div className={styles.overlayActions}>
              <button onClick={() => startGame(selectedPuzzle)} className={styles.goldBtn}>Play Again</button>
              <button onClick={resetGame} className={styles.darkBtn}>New Puzzle</button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <button onClick={resetGame} className={styles.darkBtn}>New Puzzle</button>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function getCellsForWord(word) {
  const cells = [];
  const dirMap = {
    horizontal: { dr: 0, dc: 1 },
    vertical: { dr: 1, dc: 0 },
    diagonal: { dr: 1, dc: 1 },
  };
  const { dr, dc } = dirMap[word.direction] || { dr: 0, dc: 1 };
  for (let i = 0; i < word.length; i++) {
    cells.push({ row: word.startRow + i * dr, col: word.startCol + i * dc });
  }
  return cells;
}

function cellsMatch(selected, target) {
  if (selected.length !== target.length) return false;
  // Forward match
  const fwd = target.every((t, i) => selected[i].row === t.row && selected[i].col === t.col);
  if (fwd) return true;
  // Reverse match (selection in opposite direction)
  const rev = target.every((t, i) => selected[selected.length - 1 - i].row === t.row && selected[selected.length - 1 - i].col === t.col);
  return rev;
}
