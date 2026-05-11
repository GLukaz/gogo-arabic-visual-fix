import { useGameNavigation } from '../../hooks/useGameNavigation.js';
import styles from './MiniGamesHub.module.css';

/**
 * MiniGamesHub Component
 *
 * Central hub for all mini-games and learning activities.
 * Displays available games with descriptions and navigation.
 */
export default function MiniGamesHub() {
  const { goTo, goToMenu } = useGameNavigation();

  const games = [
    {
      id: 'word-search',
      title: 'Word Search',
      titleArabic: 'البحث عن الكلمات',
      description: 'Find hidden Arabic words in a grid puzzle. Words can be horizontal or vertical.',
      path: '/mini-games/word-search',
      difficulty: 'Easy - Hard',
      icon: '🔍',
    },
    {
      id: 'reading',
      title: 'Reading Comprehension',
      titleArabic: 'فهم القراءة',
      description: 'Read Arabic passages and answer comprehension questions. Practice reading skills with real texts.',
      path: '/mini-games/reading',
      difficulty: 'Level 1-4',
      icon: '📖',
    },
    {
      id: 'roots',
      title: 'Root Explorer',
      titleArabic: 'مستكشف الجذور',
      description: 'Explore the Arabic root system. See how 3-letter roots form related words.',
      path: '/roots',
      difficulty: 'Educational',
      icon: '🌳',
    },
    {
      id: 'calligraphy',
      title: 'Calligraphy Practice',
      titleArabic: 'تدريب الخط',
      description: 'Trace Arabic letters and improve your handwriting. Master all 28 isolated letter forms.',
      path: null, // Launches via Phaser scene, not React route
      difficulty: 'All Levels',
      icon: '✒️',
      launchCalligraphy: true,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mini-Games Hub</h1>
        <h2 className={styles.titleArabic}>مركز الألعاب الصغيرة</h2>
        <p className={styles.subtitle}>
          Fun and interactive ways to practice your Arabic skills
        </p>
      </div>

      {/* Games Grid */}
      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <div key={game.id} className={styles.gameCard}>
            <div className={styles.gameIcon}>{game.icon}</div>
            <h3 className={styles.gameTitle}>{game.title}</h3>
            <h4 className={styles.gameTitleArabic}>{game.titleArabic}</h4>
            <p className={styles.gameDescription}>{game.description}</p>
            <div className={styles.gameDifficulty}>
              Difficulty: {game.difficulty}
            </div>
            <button
              onClick={() => {
                if (game.launchCalligraphy) {
                  // Navigate to game world, then GameLayout will launch CalligraphyScene
                  window.__pendingCalligraphyLaunch = { letterId: 'alif' };
                  goTo('/game');
                  return;
                }
                goTo(game.path);
              }}
              className={styles.playBtn}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className={styles.comingSoon}>
        <h3 className={styles.comingSoonTitle}>Coming Soon</h3>
        <div className={styles.comingSoonGrid}>
          <div className={styles.comingSoonItem}>
            <span className={styles.comingSoonIcon}>⚔️</span>
            <span className={styles.comingSoonText}>Word Duel Battle</span>
          </div>
          <div className={styles.comingSoonItem}>
            <span className={styles.comingSoonIcon}>🎯</span>
            <span className={styles.comingSoonText}>Speed Quiz Challenge</span>
          </div>
          <div className={styles.comingSoonItem}>
            <span className={styles.comingSoonIcon}>🧩</span>
            <span className={styles.comingSoonText}>Sentence Scramble</span>
          </div>
          <div className={styles.comingSoonItem}>
            <span className={styles.comingSoonIcon}>🎲</span>
            <span className={styles.comingSoonText}>Grammar Quest</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <button onClick={goToMenu} className={styles.backBtn}>
        Back to Main Menu
      </button>
    </div>
  );
}
