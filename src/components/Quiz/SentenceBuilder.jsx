import { useState, useEffect } from 'react';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './SentenceBuilder.module.css';

export default function SentenceBuilder({ word, options, onAnswer, feedback }) {
  const formatArabic = useFormatArabic();

  // Build tile pool from options (array of Arabic word strings)
  const tiles = options || [];

  const [placed, setPlaced] = useState([]);
  const [usedIndices, setUsedIndices] = useState([]);

  // Reset on new word
  useEffect(() => {
    setPlaced([]);
    setUsedIndices([]);
  }, [word?.id]);

  const handleTileClick = (tile, idx) => {
    if (feedback) return;
    if (usedIndices.includes(idx)) return;
    // tile may be a string or an object with .value; normalize to string
    const tileStr = (tile && typeof tile === 'object') ? tile.value : tile;
    const newPlaced = [...placed, { tile: tileStr, idx }];
    setPlaced(newPlaced);
    setUsedIndices((prev) => [...prev, idx]);
  };

  const handlePlacedClick = (placedIdx) => {
    if (feedback) return;
    const removed = placed[placedIdx];
    setPlaced((prev) => prev.filter((_, i) => i !== placedIdx));
    setUsedIndices((prev) => prev.filter((i) => i !== removed.idx));
  };

  const handleSubmit = () => {
    if (feedback || placed.length === 0) return;
    const sentence = placed.map((p) => p.tile).join(' ');
    onAnswer(sentence);
  };

  let dropCls = styles.dropZone;
  if (feedback) {
    dropCls = feedback.correct ? styles.dropZoneCorrect : styles.dropZoneWrong;
  }

  return (
    <div role="group" aria-label={`Sentence builder: translate "${word.english}" into Arabic`}>
      <div className={styles.instruction} id="sb-instruction">Arrange the tiles to form the Arabic sentence:</div>
      <div className={styles.prompt} aria-label={`English sentence: ${word.english}`}>{word.english}</div>

      {/* Drop zone — click placed tile to remove it */}
      <div className={dropCls} role="list" aria-label={`Arranged tiles: ${placed.map((p) => p.tile).join(' ') || 'empty'}`}>
        {placed.map((p, i) => (
          <button
            key={i}
            className={styles.tile}
            onClick={() => handlePlacedClick(i)}
            disabled={!!feedback}
            role="listitem"
            aria-label={`Placed tile ${i + 1}: ${p.tile} — click to remove`}
          >
            {formatArabic(p.tile)}
          </button>
        ))}
      </div>

      {/* Tile bank */}
      <div className={styles.tileBank} role="group" aria-label="Available tiles">
        {tiles.map((tile, idx) => {
          const isUsed = usedIndices.includes(idx);
          // tile may be a string or object with .label
          const tileLabel = (tile && typeof tile === 'object') ? tile.label : tile;
          return (
            <button
              key={idx}
              className={isUsed ? styles.tileUsed : styles.tile}
              onClick={() => handleTileClick(tile, idx)}
              disabled={!!feedback || isUsed}
              aria-label={`Tile: ${tileLabel}${isUsed ? ' (used)' : ''}`}
            >
              {formatArabic(tileLabel)}
            </button>
          );
        })}
      </div>

      {!feedback && placed.length > 0 && (
        <div className={styles.actionRow}>
          <button className={styles.clearBtn} onClick={() => { setPlaced([]); setUsedIndices([]); }} aria-label="Clear all placed tiles">
            Clear
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit} aria-label="Submit your sentence">
            Submit
          </button>
        </div>
      )}

      {feedback && !feedback.correct && (
        <div role="alert">
          <div className={styles.correctLabel}>Correct answer:</div>
          <div className={styles.correctAnswer}>{formatArabic(feedback.correctAnswer)}</div>
        </div>
      )}
    </div>
  );
}
