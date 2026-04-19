/**
 * PatternMatching.jsx — Weaver mini-game
 *
 * Memorize and reproduce geometric Islamic patterns using Arabic shape names.
 * Shows target pattern for study time, then player reproduces from memory.
 * Difficulty scales with profession level.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PatternMatching.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Arabic shape names
const SHAPES = {
  square: { nameArabic: 'مربع', nameEnglish: 'Square', icon: '■' },
  circle: { nameArabic: 'دائرة', nameEnglish: 'Circle', icon: '●' },
  triangle: { nameArabic: 'مثلث', nameEnglish: 'Triangle', icon: '▲' },
  star: { nameArabic: 'نجمة', nameEnglish: 'Star', icon: '★' },
  diamond: { nameArabic: 'معين', nameEnglish: 'Diamond', icon: '◆' },
};

const SHAPE_IDS = Object.keys(SHAPES);

/**
 * Generate random pattern based on difficulty
 */
function generatePattern(professionLevel) {
  let gridSize = 4;
  let numShapeTypes = 3;
  let studyTime = 8000;

  if (professionLevel >= 8) {
    gridSize = 6;
    numShapeTypes = 5;
    studyTime = 4000;
  } else if (professionLevel >= 4) {
    gridSize = 5;
    numShapeTypes = 4;
    studyTime = 6000;
  }

  const availableShapes = SHAPE_IDS.slice(0, numShapeTypes);
  const pattern = [];

  for (let row = 0; row < gridSize; row++) {
    const rowData = [];
    for (let col = 0; col < gridSize; col++) {
      const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
      rowData.push(randomShape);
    }
    pattern.push(rowData);
  }

  return { pattern, gridSize, studyTime };
}

/**
 * Calculate accuracy by comparing player pattern to target pattern
 */
function calculateAccuracy(playerPattern, targetPattern) {
  if (!playerPattern || !targetPattern) return 0;

  let matchingCells = 0;
  let totalCells = 0;

  for (let row = 0; row < targetPattern.length; row++) {
    for (let col = 0; col < targetPattern[row].length; col++) {
      totalCells++;
      if (playerPattern[row] && playerPattern[row][col] === targetPattern[row][col]) {
        matchingCells++;
      }
    }
  }

  return totalCells > 0 ? matchingCells / totalCells : 0;
}

export default function PatternMatching({ recipeId, professionLevel, onComplete }) {
  const [targetPattern, setTargetPattern] = useState(null);
  const [playerPattern, setPlayerPattern] = useState(null);
  const [gridSize, setGridSize] = useState(4);
  const [studyTime, setStudyTime] = useState(8000);
  const [phase, setPhase] = useState('study'); // 'study' | 'reproduce' | 'result'
  const [timeRemaining, setTimeRemaining] = useState(8000);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [numShapeTypes, setNumShapeTypes] = useState(3);

  // Initialize pattern
  useEffect(() => {
    if (!recipeId) return;

    const { pattern, gridSize: size, studyTime: time } = generatePattern(professionLevel);
    setTargetPattern(pattern);
    setGridSize(size);
    setStudyTime(time);
    setTimeRemaining(time);
    setPhase('study');

    // Initialize empty player pattern
    const emptyPattern = Array.from({ length: size }, () => Array(size).fill(null));
    setPlayerPattern(emptyPattern);

    // Determine shape types
    let types = 3;
    if (professionLevel >= 8) types = 5;
    else if (professionLevel >= 4) types = 4;
    setNumShapeTypes(types);
  }, [recipeId, professionLevel]);

  // Study phase countdown
  useEffect(() => {
    if (phase !== 'study' || !targetPattern) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          setPhase('reproduce');
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [phase, targetPattern]);

  const handleCellClick = useCallback(
    (row, col) => {
      if (phase !== 'reproduce' || !playerPattern) return;

      setPlayerPattern((prev) => {
        const newPattern = prev.map((r) => [...r]);
        const currentShape = newPattern[row][col];
        const availableShapes = SHAPE_IDS.slice(0, numShapeTypes);

        if (currentShape === null) {
          // First click - set to first shape
          newPattern[row][col] = availableShapes[0];
        } else {
          // Cycle to next shape
          const currentIndex = availableShapes.indexOf(currentShape);
          const nextIndex = (currentIndex + 1) % availableShapes.length;
          newPattern[row][col] = availableShapes[nextIndex];
        }

        return newPattern;
      });
    },
    [phase, playerPattern, numShapeTypes]
  );

  const handleSubmit = useCallback(() => {
    if (phase !== 'reproduce' || !playerPattern || !targetPattern) return;

    const accuracy = calculateAccuracy(playerPattern, targetPattern);
    setPhase('result');
    onComplete?.(accuracy);
  }, [phase, playerPattern, targetPattern, onComplete]);

  if (!targetPattern) {
    return null;
  }

  const timerPercent = (timeRemaining / studyTime) * 100;
  const availableShapes = SHAPE_IDS.slice(0, numShapeTypes);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {phase === 'study' && 'احفظ النمط'}
          {phase === 'reproduce' && 'أعد إنتاج النمط'}
          {phase === 'result' && 'النتيجة'}
        </h3>

        {phase === 'study' && (
          <div className={styles.timer}>
            <div className={styles.timerBar} style={{ width: `${timerPercent}%` }} />
            <span className={styles.timerText}>
              {Math.ceil(timeRemaining / 1000)} ثانية
            </span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {phase === 'study' && (
            <motion.div
              key="study"
              className={styles.gridContainer}
              initial={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
            >
              <div className={styles.gridLabel}>النمط المطلوب</div>
              <div
                className={styles.grid}
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                }}
              >
                {targetPattern.map((row, rowIndex) =>
                  row.map((shapeId, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={styles.cell}
                      style={{ fontSize: gridSize === 6 ? '1.5rem' : '2rem' }}
                    >
                      <span className={styles.shapeIcon}>
                        {SHAPES[shapeId].icon}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {phase === 'reproduce' && (
            <motion.div
              key="reproduce"
              className={styles.gridContainer}
              initial={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.gridLabel}>انقر على الخلايا لتغيير الأشكال</div>
              <div
                className={styles.grid}
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                }}
              >
                {playerPattern.map((row, rowIndex) =>
                  row.map((shapeId, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`${styles.cell} ${styles.cellClickable}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ fontSize: gridSize === 6 ? '1.5rem' : '2rem' }}
                    >
                      {shapeId && (
                        <span className={styles.shapeIcon}>
                          {SHAPES[shapeId].icon}
                        </span>
                      )}
                      {!shapeId && <span className={styles.emptyCell}>؟</span>}
                    </button>
                  ))
                )}
              </div>

              {hoveredCell && playerPattern[hoveredCell.row][hoveredCell.col] && (
                <div className={styles.shapeHint}>
                  {SHAPES[playerPattern[hoveredCell.row][hoveredCell.col]].nameArabic}
                </div>
              )}

              <div className={styles.shapeLegend}>
                {availableShapes.map((shapeId) => (
                  <div key={shapeId} className={styles.legendItem}>
                    <span className={styles.legendIcon}>{SHAPES[shapeId].icon}</span>
                    <span className={styles.legendName}>{SHAPES[shapeId].nameArabic}</span>
                  </div>
                ))}
              </div>

              <button className={styles.submitButton} onClick={handleSubmit}>
                إرسال
              </button>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              className={styles.resultContainer}
              initial={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className={styles.comparison}>
                <div className={styles.comparisonGrid}>
                  <div className={styles.gridLabel}>النمط المطلوب</div>
                  <div
                    className={styles.grid}
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    }}
                  >
                    {targetPattern.map((row, rowIndex) =>
                      row.map((shapeId, colIndex) => (
                        <div
                          key={`target-${rowIndex}-${colIndex}`}
                          className={styles.cell}
                          style={{ fontSize: gridSize === 6 ? '1.25rem' : '1.5rem' }}
                        >
                          <span className={styles.shapeIcon}>
                            {SHAPES[shapeId].icon}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={styles.comparisonGrid}>
                  <div className={styles.gridLabel}>نمطك</div>
                  <div
                    className={styles.grid}
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    }}
                  >
                    {playerPattern.map((row, rowIndex) =>
                      row.map((shapeId, colIndex) => {
                        const isCorrect = shapeId === targetPattern[rowIndex][colIndex];
                        return (
                          <div
                            key={`player-${rowIndex}-${colIndex}`}
                            className={`${styles.cell} ${isCorrect ? styles.cellCorrect : styles.cellIncorrect}`}
                            style={{ fontSize: gridSize === 6 ? '1.25rem' : '1.5rem' }}
                          >
                            <span className={styles.shapeIcon}>
                              {shapeId ? SHAPES[shapeId].icon : '✗'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.accuracyDisplay}>
                دقة: {Math.round(calculateAccuracy(playerPattern, targetPattern) * 100)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
