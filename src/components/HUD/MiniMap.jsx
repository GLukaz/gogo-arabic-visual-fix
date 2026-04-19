import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { ZONES } from '../../data/zones.js';
import styles from './MiniMap.module.css';

/**
 * MiniMap - Small corner overlay showing current zone and adjacent zones
 * Click or press M to open full WorldMap
 */
export default function MiniMap() {
  const currentZone = useSelector((s) => s.player.currentZone);
  const unlockedZones = useSelector((s) => s.player.unlockedZones);
  const formatArabic = useFormatArabic();

  const zone = ZONES[currentZone];

  // Get adjacent zones from exits
  const adjacentZones = useMemo(() => {
    if (!zone || !zone.exits) return [];

    return zone.exits.map(exit => ({
      name: exit.label,
      nameArabic: exit.labelArabic,
      edge: exit.edge,
      isUnlocked: unlockedZones.includes(exit.targetZone)
    }));
  }, [zone, unlockedZones]);

  const handleClick = () => {
    EventBus.emit(EVENTS.WORLD_MAP_OPEN);
  };

  if (!zone) return null;

  return (
    <button
      className={styles.container}
      onClick={handleClick}
      aria-label={`Current zone: ${zone.name}. Press M or click to open world map.`}
    >
      <div className={styles.zoneName} aria-hidden="true">
        {zone.name}
      </div>
      <div className={styles.zoneNameArabic} lang="ar" aria-hidden="true">
        {formatArabic(zone.nameArabic)}
      </div>

      {adjacentZones.length > 0 && (
        <div className={styles.exits}>
          {adjacentZones.map((adj, idx) => (
            <div
              key={idx}
              className={`${styles.exit} ${styles[`exit${adj.edge}`]} ${!adj.isUnlocked ? styles.exitLocked : ''}`}
              aria-hidden="true"
            >
              <span className={styles.exitArrow}>
                {adj.edge === 'north' && '↑'}
                {adj.edge === 'south' && '↓'}
                {adj.edge === 'east' && '→'}
                {adj.edge === 'west' && '←'}
              </span>
              <span className={styles.exitLabel}>{adj.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.hint}>Press M</div>
    </button>
  );
}
