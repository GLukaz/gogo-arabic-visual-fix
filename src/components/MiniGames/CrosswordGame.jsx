import { useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import CROSSWORD_PUZZLES from '../../data/miniGames/crosswordPuzzles.js';
import { recordCrosswordScore } from '../../store/slices/miniGameSlice.js';
import styles from './CrosswordGame.module.css';

/**
 * CrosswordGame — Phase 85 Arabic crossword puzzle.
 *
 * Grid with numbered clues (English) and Arabic-letter answers.
 * One letter per cell, RTL input. Check / Reveal hint buttons.
 */
export default function CrosswordGame({ onBack }) {
  const dispatch = useDispatch();

  const [puzzle, setPuzzle] = useState(null);
  const [userInput, setUserInput] = useState({}); // { "row,col": "letter" }
  const [checkedCells, setCheckedCells] = useState({}); // { "row,col": true|false }
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [completed, setCompleted] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  const inputRefs = useRef({});

  const filteredPuzzles = difficultyFilter
    ? CROSSWORD_PUZZLES.filter((p) => p.difficulty === difficultyFilter)
    : CROSSWORD_PUZZLES;

  const startGame = (p) => {
    setPuzzle(p);
    setUserInput({});
    setCheckedCells({});
    setRevealedCells(new Set());
    setCompleted(false);
  };

  const resetGame = () => {
    setPuzzle(null);
    setCompleted(false);
  };

  // ─── Cell input ──────────────────────────────────────────────
  const handleInput = useCallback(
    (row, col, value) => {
      // Accept only one Arabic character
      const letter = value.slice(-1);
      const key = `${row},${col}`;
      setUserInput((prev) => ({ ...prev, [key]: letter }));
      setCheckedCells((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  // ─── Check answers ───────────────────────────────────────────
  const handleCheck = () => {
    if (!puzzle) return;
    const results = {};
    let allCorrect = true;

    for (const cell of puzzle.cells) {
      const key = `${cell.row},${cell.col}`;
      const input = userInput[key] || '';
      const correct = input === cell.letter;
      results[key] = correct;
      if (!correct) allCorrect = false;
    }

    setCheckedCells(results);

    if (allCorrect) {
      setCompleted(true);
      const revealedCount = revealedCells.size;
      const totalCells = puzzle.cells.length;
      const score = Math.max(0, (totalCells - revealedCount) * 100);
      dispatch(recordCrosswordScore({ puzzleId: puzzle.id, score }));
    }
  };

  // ─── Reveal one cell ─────────────────────────────────────────
  const handleReveal = () => {
    if (!puzzle) return;
    // Find first empty or wrong cell
    for (const cell of puzzle.cells) {
      const key = `${cell.row},${cell.col}`;
      if (userInput[key] !== cell.letter) {
        setUserInput((prev) => ({ ...prev, [key]: cell.letter }));
        setRevealedCells((prev) => new Set(prev).add(key));
        setCheckedCells((prev) => ({ ...prev, [key]: true }));
        return;
      }
    }
  };

  // ─── Build grid map for rendering ────────────────────────────
  const buildGridMap = () => {
    if (!puzzle) return {};
    const map = {};
    for (const cell of puzzle.cells) {
      map[`${cell.row},${cell.col}`] = cell;
    }
    return map;
  };

  const getClueNumber = (cell) => {
    if (cell.clueAcross) return cell.clueAcross;
    if (cell.clueDown) return cell.clueDown;
    return null;
  };

  // ─── Setup screen ────────────────────────────────────────────
  if (!puzzle) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crossword</h1>
          <h2 className={styles.titleArabic}>كلمات متقاطعة</h2>
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
                {p.difficulty} | {p.cefrLevel} | {p.size.rows}x{p.size.cols}
              </span>
            </button>
          ))}
        </div>

        <button onClick={onBack} className={styles.backBtn}>Back</button>
      </div>
    );
  }

  // ─── Game screen ─────────────────────────────────────────────
  const gridMap = buildGridMap();
  const { rows, cols } = puzzle.size;

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <span className={styles.gameTitle}>{puzzle.title} — {puzzle.titleArabic}</span>
      </div>

      <div className={styles.gameArea}>
        {/* Grid */}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: cols }, (_, c) => {
              const key = `${r},${c}`;
              const cell = gridMap[key];

              if (!cell) {
                return <div key={key} className={styles.emptyCell} />;
              }

              const clueNum = getClueNumber(cell);
              const checked = checkedCells[key];
              const isRevealed = revealedCells.has(key);
              let cellClass = styles.inputCell;
              if (checked === true) cellClass += ` ${styles.cellCorrect}`;
              else if (checked === false) cellClass += ` ${styles.cellWrong}`;
              if (isRevealed) cellClass += ` ${styles.cellRevealed}`;

              return (
                <div key={key} className={cellClass}>
                  {clueNum != null && (
                    <span className={styles.clueNumber}>{clueNum}</span>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[key] = el; }}
                    className={styles.cellInput}
                    type="text"
                    dir="rtl"
                    maxLength={2}
                    value={userInput[key] || ''}
                    onChange={(e) => handleInput(r, c, e.target.value)}
                    disabled={completed}
                    aria-label={`Cell row ${r} column ${c}`}
                  />
                </div>
              );
            }),
          )}
        </div>

        {/* Clues panel */}
        <div className={styles.cluesPanel}>
          {puzzle.cluesAcross.length > 0 && (
            <div className={styles.clueSection}>
              <h3 className={styles.clueHeader}>Across</h3>
              {puzzle.cluesAcross.map((clue) => (
                <div key={`a-${clue.number}`} className={styles.clueItem}>
                  <span className={styles.clueNum}>{clue.number}.</span>
                  <span className={styles.clueText}>{clue.clue}</span>
                </div>
              ))}
            </div>
          )}
          {puzzle.cluesDown.length > 0 && (
            <div className={styles.clueSection}>
              <h3 className={styles.clueHeader}>Down</h3>
              {puzzle.cluesDown.map((clue) => (
                <div key={`d-${clue.number}`} className={styles.clueItem}>
                  <span className={styles.clueNum}>{clue.number}.</span>
                  <span className={styles.clueText}>{clue.clue}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleCheck} className={styles.goldBtn} disabled={completed}>
          Check Answers
        </button>
        <button onClick={handleReveal} className={styles.darkBtn} disabled={completed}>
          Reveal Hint
        </button>
        <button onClick={resetGame} className={styles.darkBtn}>New Puzzle</button>
      </div>

      {/* Completion overlay */}
      {completed && (
        <div className={styles.overlay}>
          <div className={styles.overlayPanel}>
            <h2 className={styles.overlayTitle}>Puzzle Complete!</h2>
            <p className={styles.overlayText}>
              Hints used: {revealedCells.size} / {puzzle.cells.length} cells
            </p>
            <div className={styles.overlayActions}>
              <button onClick={() => startGame(puzzle)} className={styles.goldBtn}>Play Again</button>
              <button onClick={resetGame} className={styles.darkBtn}>New Puzzle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
