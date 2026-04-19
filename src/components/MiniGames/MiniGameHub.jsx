import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMiniGameStats } from '../../store/slices/miniGameSlice.js';
import styles from './MiniGameHub.module.css';

/**
 * MiniGameHub — Phase 85 selection screen for 4 new mini-games.
 *
 * Displays game cards with icon, name (Arabic + English),
 * description, difficulty, and best score. Click to launch.
 */

const GAMES = [
  {
    id: 'wordSearchNew',
    title: 'Word Search',
    titleArabic: 'البحث عن الكلمات',
    icon: '🔍',
    description: 'Find hidden Arabic words in a 10x10 grid. Words can go horizontal, vertical, or diagonal.',
    difficulty: 'Easy - Hard',
    statKey: 'wordSearchCompleted',
    statLabel: 'puzzles solved',
  },
  {
    id: 'crossword',
    title: 'Crossword',
    titleArabic: 'كلمات متقاطعة',
    icon: '📝',
    description: 'Solve crossword puzzles with English clues and Arabic letter answers.',
    difficulty: 'Easy - Hard',
    statKey: 'crosswordCompleted',
    statLabel: 'puzzles solved',
  },
  {
    id: 'numberChallenge',
    title: 'Number Challenge',
    titleArabic: 'تحدي الارقام',
    icon: '🔢',
    description: 'Identify Arabic numerals, solve arithmetic, and match number words.',
    difficulty: 'Level 1-4',
    statKey: 'numberGamesPlayed',
    statLabel: 'games played',
  },
  {
    id: 'memoryMatch',
    title: 'Memory Match',
    titleArabic: 'لعبة الذاكرة',
    icon: '🃏',
    description: 'Flip cards to match Arabic words with their English meanings.',
    difficulty: 'Easy - Hard',
    statKey: 'memoryMatchCompleted',
    statLabel: 'sets completed',
  },
];

export default function MiniGameHub({ onSelectGame, onBack }) {
  const stats = useSelector(selectMiniGameStats);

  return (
    <div className={styles.container}>
      {/* Overall Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.totalGamesPlayed}</span>
          <span className={styles.statLabel}>Games Played</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{stats.favoriteGame ?? '—'}</span>
          <span className={styles.statLabel}>Favorite Game</span>
        </div>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mini-Games</h1>
        <h2 className={styles.titleArabic}>العاب صغيرة</h2>
        <p className={styles.subtitle}>Pick a game to practice Arabic skills</p>
      </div>

      {/* Game Cards */}
      <div className={styles.gamesGrid}>
        {GAMES.map((game) => (
          <button
            key={game.id}
            className={styles.gameCard}
            onClick={() => onSelectGame(game.id)}
          >
            <div className={styles.gameIcon}>{game.icon}</div>
            <h3 className={styles.gameTitle}>{game.title}</h3>
            <h4 className={styles.gameTitleArabic}>{game.titleArabic}</h4>
            <p className={styles.gameDescription}>{game.description}</p>
            <div className={styles.gameMeta}>
              <span className={styles.gameDifficulty}>{game.difficulty}</span>
              <span className={styles.gameStat}>
                {stats[game.statKey] ?? 0} {game.statLabel}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Back */}
      {onBack && (
        <button onClick={onBack} className={styles.backBtn}>
          Back
        </button>
      )}
    </div>
  );
}
