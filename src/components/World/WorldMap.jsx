import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showNotification } from '../../store/slices/uiSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { ZONES, ZONE_ORDER } from '../../data/zones.js';
import { BOSSES } from '../../data/bosses.js';
import quests from '../../data/quests.json';
import vocabularyAll from '../../data/vocabularyAll.js';
import styles from './WorldMap.module.css';

const ZONE_POSITIONS = {
  // Original 8 Zones
  oasis_village: { x: 50, y: 75 },
  ancient_library: { x: 50, y: 58 },
  desert_marketplace: { x: 72, y: 52 },
  farmland: { x: 72, y: 35 },
  bedouin_camp: { x: 88, y: 28 },
  mountain_village: { x: 70, y: 15 },
  coastal_port: { x: 45, y: 18 },
  royal_palace: { x: 30, y: 5 },

  // Real World Zones
  baghdad: { x: 60, y: 45 },
  damascus: { x: 55, y: 30 },
  cairo: { x: 38, y: 45 },
  timbuktu: { x: 25, y: 75 },
  fez: { x: 15, y: 35 },
  cordoba: { x: 10, y: 25 },
  granada: { x: 15, y: 15 },
  samarkand: { x: 85, y: 45 },

  // Fantasy Zones
  star_oasis: { x: 50, y: 88 },
  sea_of_ink: { x: 5, y: 50 },
  forest_of_tales: { x: 40, y: 30 },
  mountain_of_words: { x: 80, y: 10 },
  desert_of_silence: { x: 90, y: 85 },
  merchants_island: { x: 5, y: 10 },
  fortress_of_secrets: { x: 50, y: 5 },
  garden_of_spirits: { x: 30, y: 85 },
};

const ZONE_CONNECTIONS = [
  // Original Connections
  ['oasis_village', 'ancient_library'],
  ['ancient_library', 'desert_marketplace'],
  ['desert_marketplace', 'farmland'],
  ['farmland', 'bedouin_camp'],
  ['bedouin_camp', 'mountain_village'],
  ['mountain_village', 'coastal_port'],
  ['coastal_port', 'royal_palace'],

  // New Connections - Real World
  ['baghdad', 'desert_marketplace'],
  ['baghdad', 'ancient_library'],
  ['baghdad', 'damascus'],
  ['damascus', 'royal_palace'],
  ['cairo', 'ancient_library'],
  ['cairo', 'royal_palace'],
  ['timbuktu', 'oasis_village'],
  ['fez', 'timbuktu'],
  ['cordoba', 'fez'],
  ['granada', 'cordoba'],
  ['granada', 'coastal_port'],
  ['samarkand', 'desert_marketplace'],
  ['samarkand', 'bedouin_camp'],

  // New Connections - Fantasy
  ['star_oasis', 'oasis_village'],
  ['sea_of_ink', 'fez'],
  ['forest_of_tales', 'mountain_village'],
  ['forest_of_tales', 'royal_palace'],
  ['mountain_of_words', 'mountain_village'],
  ['desert_of_silence', 'bedouin_camp'],
  ['merchants_island', 'coastal_port'],
  ['fortress_of_secrets', 'royal_palace'],
  ['garden_of_spirits', 'timbuktu'],
];

const BOSS_OFFSETS = {
  x: 6,
  y: -3,
};

export default function WorldMap({ onBack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unlockedZones = useSelector((s) => s.player.unlockedZones);
  const currentZone = useSelector((s) => s.player.currentZone);
  const completedQuests = useSelector((s) => s.quests.quests);
  const npcsVisited = useSelector((s) => s.quests.npcsVisited || []);
  const zonesVisited = useSelector((s) => s.quests.zonesVisited || []);
  const fsrsCards = useSelector((s) => s.vocabulary.fsrsCards || {});
  const playerLevel = useSelector((s) => s.player.level);
  const wordsLearned = useSelector((s) => s.player.wordsLearned);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState(null);

  // Track zone unlocks and flash animation
  const [prevUnlockedZones, setPrevUnlockedZones] = useState(unlockedZones);
  useEffect(() => {
    if (unlockedZones.length > prevUnlockedZones.length) {
      const newZone = unlockedZones.find((z) => !prevUnlockedZones.includes(z));
      if (newZone) {
        setRecentlyUnlocked(newZone);
        const timer = setTimeout(() => setRecentlyUnlocked(null), 2500);
        return () => clearTimeout(timer);
      }
    }
    setPrevUnlockedZones(unlockedZones);
  }, [unlockedZones, prevUnlockedZones]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Calculate zone statistics (WMAP-02: completion based on quests, NPCs, and words)
  const getZoneStats = (zoneId) => {
    const zone = ZONES[zoneId];

    // 1. Quests completed in zone
    const zoneQuests = quests.filter((q) => q.zone === zoneId);
    const questsCompleted = zoneQuests.filter((q) => completedQuests[q.id]?.status === 'completed').length;
    const questsTotal = zoneQuests.length;
    const questProgress = questsTotal > 0 ? questsCompleted / questsTotal : 0;

    // 2. NPCs talked to in zone
    const zoneNpcs = zone.npcs || [];
    const npcsMetCount = zoneNpcs.filter((npc) => npcsVisited.includes(npc.id)).length;
    const npcsTotal = zoneNpcs.length;
    const npcProgress = npcsTotal > 0 ? npcsMetCount / npcsTotal : 0;

    // 3. Words learned from zone categories
    const zoneCategories = zone.vocabCategories || [];
    const zoneCategoryWords = vocabularyAll.filter((w) => zoneCategories.includes(w.category));
    const wordsLearnedCount = zoneCategoryWords.filter((w) => fsrsCards[w.id]).length;
    const wordsTotal = zoneCategoryWords.length;
    const wordProgress = wordsTotal > 0 ? wordsLearnedCount / wordsTotal : 0;

    // Weighted average: 40% quests, 30% NPCs, 30% words
    const completionPercent = Math.round(
      (questProgress * 0.4 + npcProgress * 0.3 + wordProgress * 0.3) * 100
    );

    // Determine difficulty based on unlock requirements
    let difficulty = 'Beginner';
    if (zone.unlock) {
      if (zone.unlock.minLevel >= 15) difficulty = 'Advanced';
      else if (zone.unlock.minLevel >= 8) difficulty = 'Intermediate';
    }

    return {
      questsCompleted,
      questsTotal,
      npcsMetCount,
      npcsTotal,
      wordsLearnedCount,
      wordsTotal,
      completionPercent,
      difficulty,
    };
  };

  const handleZoneClick = (zoneId) => {
    // Locked zone - show notification with unlock requirements
    if (!unlockedZones.includes(zoneId)) {
      dispatch(showNotification({ message: 'Zone locked!', type: 'quest' }));
      return;
    }

    // Current zone - just close the map
    if (zoneId === currentZone) {
      onBack();
      return;
    }

    // WMAP-01: Fast travel to unlocked, previously-visited zone
    const hasVisited = zonesVisited.includes(zoneId);
    if (!hasVisited) {
      dispatch(showNotification({
        message: 'You must visit this zone on foot before fast traveling!',
        type: 'quest'
      }));
      return;
    }

    // Emit fast-travel event and close map
    EventBus.emit(EVENTS.FAST_TRAVEL, { zoneName: zoneId });
    navigate('/game');
  };

  const renderConnection = ([fromId, toId], idx) => {
    const from = ZONE_POSITIONS[fromId];
    const to = ZONE_POSITIONS[toId];
    if (!from || !to) return null;

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const bothUnlocked = unlockedZones.includes(fromId) && unlockedZones.includes(toId);

    return (
      <div
        key={`conn-${idx}`}
        className={`${styles.connectionLine} ${bothUnlocked ? styles.connectionLineUnlocked : ''}`}
        style={{
          left: `${from.x}%`,
          top: `${from.y}%`,
          width: `${length}%`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  };

  const renderZoneNode = (zoneId) => {
    const zone = ZONES[zoneId];
    const pos = ZONE_POSITIONS[zoneId];
    if (!zone || !pos) return null;

    const isUnlocked = unlockedZones.includes(zoneId);
    const isCurrent = currentZone === zoneId;
    const isHovered = hoveredZone === zoneId;
    const stats = getZoneStats(zoneId);

    const isRecentlyUnlocked = recentlyUnlocked === zoneId;

    let dotClassName = styles.zoneDot;
    let statusIndicator = null;

    if (isCurrent) {
      dotClassName = `${styles.zoneDot} ${styles.zoneDotCurrent}`;
      statusIndicator = <div className={styles.currentIndicator}>Current</div>;
    } else if (isUnlocked) {
      if (stats.completionPercent === 100) {
        dotClassName = `${styles.zoneDot} ${styles.zoneDotCompleted}`;
        statusIndicator = <div className={styles.completedIndicator}>&#10003;</div>;
      } else {
        dotClassName = `${styles.zoneDot} ${styles.zoneDotUnlocked}`;
      }
    }

    // Calculate unlock progress for locked zones
    let unlockProgress = null;
    if (!isUnlocked && zone.unlock) {
      const reqs = [];
      if (zone.unlock.quest) {
        const questState = completedQuests[zone.unlock.quest];
        const questDone = questState?.status === 'completed';
        reqs.push({ label: 'Quest', met: questDone });
      }
      if (zone.unlock.minLevel) {
        reqs.push({ label: `Lv.${zone.unlock.minLevel}`, met: playerLevel >= zone.unlock.minLevel });
      }
      if (zone.unlock.minWords) {
        reqs.push({ label: `${wordsLearned}/${zone.unlock.minWords} words`, met: wordsLearned >= zone.unlock.minWords });
      }
      unlockProgress = reqs;
    }

    const ariaLabel = isUnlocked
      ? `${zone.name}. ${isCurrent ? 'Current zone.' : ''} ${stats.questsCompleted} of ${stats.questsTotal} quests completed. ${stats.completionPercent}% complete. ${stats.difficulty} difficulty. ${isCurrent ? 'Press Enter to close map' : 'Press Enter to fast travel'}.`
      : `${zone.name}. Locked zone.`;

    return (
      <button
        key={zoneId}
        className={`${styles.zoneNode} ${!isUnlocked ? styles.zoneNodeLocked : ''} ${isHovered ? styles.zoneNodeHovered : ''}`}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        onClick={() => handleZoneClick(zoneId)}
        onMouseEnter={() => setHoveredZone(zoneId)}
        onMouseLeave={() => setHoveredZone(null)}
        aria-label={ariaLabel}
        aria-disabled={!isUnlocked}
      >
        <div className={dotClassName} aria-hidden="true">
          {statusIndicator}
        </div>
        <div className={styles.zoneLabelArabic} lang="ar" aria-hidden="true">{zone.nameArabic}</div>
        <div className={styles.zoneLabel} aria-hidden="true">{zone.name}</div>

        {/* PROG-06: Locked zone vocab progress below label */}
        {!isUnlocked && unlockProgress && (
          <div className={styles.vocabGateProgress} aria-hidden="true">
            {unlockProgress.map((req, i) => (
              <span key={i} className={req.met ? styles.reqMet : styles.reqUnmet}>
                {req.met ? '\u2713' : '\u2717'} {req.label}
              </span>
            ))}
          </div>
        )}

        {/* Completion % for unlocked zones */}
        {isUnlocked && !isCurrent && stats.completionPercent < 100 && (
          <div className={styles.zoneCompletionBadge} aria-hidden="true">
            {stats.completionPercent}%
          </div>
        )}

        {/* UNLOCKED flash animation */}
        {isRecentlyUnlocked && (
          <div className={styles.unlockedFlash} aria-label={`${zone.name} is now unlocked`}>
            UNLOCKED
          </div>
        )}

        {/* Zone Info Tooltip (WMAP-02: Enhanced with NPCs and Words) */}
        {isHovered && isUnlocked && (
          <div className={styles.zoneTooltip}>
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{zone.name}</span>
              <span className={styles.tooltipTitleArabic}>{zone.nameArabic}</span>
            </div>
            <div className={styles.tooltipBody}>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Quests:</span>
                <span className={styles.tooltipValue}>{stats.questsCompleted}/{stats.questsTotal}</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>NPCs Met:</span>
                <span className={styles.tooltipValue}>{stats.npcsMetCount}/{stats.npcsTotal}</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Words:</span>
                <span className={styles.tooltipValue}>{stats.wordsLearnedCount}/{stats.wordsTotal}</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Completion:</span>
                <span className={styles.tooltipValue}>{stats.completionPercent}%</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Difficulty:</span>
                <span className={`${styles.tooltipValue} ${styles[`difficulty${stats.difficulty}`]}`}>
                  {stats.difficulty}
                </span>
              </div>
            </div>
            <div className={styles.tooltipProgress}>
              <div
                className={styles.tooltipProgressFill}
                style={{ width: `${stats.completionPercent}%` }}
              />
            </div>
            {!isCurrent && zonesVisited.includes(zoneId) && (
              <button
                className={styles.tooltipTravelBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoneClick(zoneId);
                }}
              >
                Fast Travel
              </button>
            )}
          </div>
        )}

        {/* Locked Zone Teaser (WMAP-03: Show unlock requirements) */}
        {isHovered && !isUnlocked && (
          <div className={styles.zoneTooltipLocked}>
            <div className={styles.tooltipHeader}>
              <span className={styles.tooltipTitle}>{zone.name}</span>
              <span className={styles.tooltipTitleArabic}>{zone.nameArabic}</span>
            </div>
            <div className={styles.tooltipBody}>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Difficulty:</span>
                <span className={`${styles.tooltipValue} ${styles[`difficulty${stats.difficulty}`]}`}>
                  {stats.difficulty}
                </span>
              </div>
              {zone.unlock && (
                <div className={styles.tooltipUnlockSection}>
                  <div className={styles.tooltipUnlockTitle}>Unlock Requirements:</div>
                  {zone.unlock.quest && (
                    <div className={styles.tooltipUnlockItem}>
                      <span className={styles.tooltipUnlockIcon}>📜</span>
                      <span className={styles.tooltipUnlockText}>
                        {quests.find(q => q.id === zone.unlock.quest)?.title || zone.unlock.quest}
                      </span>
                    </div>
                  )}
                  {zone.unlock.minLevel && (
                    <div className={styles.tooltipUnlockItem}>
                      <span className={styles.tooltipUnlockIcon}>⭐</span>
                      <span className={styles.tooltipUnlockText}>
                        Reach Level {zone.unlock.minLevel}
                      </span>
                    </div>
                  )}
                  {zone.unlock.minWords && (
                    <div className={styles.tooltipUnlockItem}>
                      <span className={styles.tooltipUnlockIcon}>📚</span>
                      <span className={styles.tooltipUnlockText}>
                        Learn {zone.unlock.minWords} words
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </button>
    );
  };

  const renderBossNode = (boss) => {
    const zonePos = ZONE_POSITIONS[boss.zone];
    if (!zonePos) return null;

    const pos = {
      x: zonePos.x + BOSS_OFFSETS.x,
      y: zonePos.y + BOSS_OFFSETS.y,
    };

    const isUnlocked = unlockedZones.includes(boss.zone);
    if (!isUnlocked) return null;

    const difficultyStars = '★'.repeat(boss.difficulty);

    const handleBossClick = () => {
      navigate(`/battle?boss=${boss.id}`);
      onBack();
    };

    return (
      <button
        key={boss.id}
        className={styles.bossNode}
        style={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
        }}
        onClick={handleBossClick}
        aria-label={`Challenge ${boss.name} — Difficulty ${boss.difficulty}`}
      >
        <div className={styles.bossSprite} aria-hidden="true">
          {boss.sprite}
        </div>
        <div className={styles.bossLabel}>{boss.name}</div>
        <div className={styles.bossLabelArabic} lang="ar">{boss.nameArabic}</div>
        <div className={styles.bossDifficulty} aria-hidden="true">
          {difficultyStars}
        </div>
      </button>
    );
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.3, ease: 'easeOut' };

  return (
    <motion.div
      className={styles.overlay}
      onClick={onBack}
      role="dialog"
      aria-label="World Map"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
    >
      <motion.div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className={styles.title}>World Map</h1>
            <span className={styles.titleArabic} lang="ar" aria-hidden="true">خَريطَة العالَم</span>
          </div>
          <button className={styles.closeBtn} onClick={onBack} aria-label="Close world map">Close</button>
        </div>

        <div className={styles.mapContainer} role="region" aria-label="Interactive world map with zone locations">
          <div className={styles.mapInner}>
            {ZONE_CONNECTIONS.map(renderConnection)}
            {ZONE_ORDER.map(renderZoneNode)}
            {BOSSES.filter(b => unlockedZones.includes(b.zone)).map(renderBossNode)}
          </div>
        </div>

        <div className={styles.legend} role="group" aria-label="Map legend">
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: 'var(--color-cyan)' }} aria-hidden="true" />
            <span>Current Zone</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: 'var(--color-green)' }} aria-hidden="true" />
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: 'var(--color-xp-gold)' }} aria-hidden="true" />
            <span>Unlocked</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: 'var(--color-gray)' }} aria-hidden="true" />
            <span>Locked</span>
          </div>
          <div className={styles.legendItem}>
            <span aria-hidden="true" style={{ fontSize: '14px' }}>⚔️</span>
            <span>Boss Challenge</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
