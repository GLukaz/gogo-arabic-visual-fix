import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { selectFriendshipTier } from '../../store/slices/npcSlice.js';
import { selectGameTime } from '../../store/slices/timeSlice.js';
import questsData from '../../data/quests.json';
import npcsData from '../../data/npcsEnriched.js';
import { ZONES, ZONE_ORDER } from '../../data/zones.js';
import styles from './QuestJournal.module.css';

const ZONE_COLORS = {
  oasis_village: '#4ecdc4',
  ancient_library: '#a78bfa',
  desert_marketplace: '#f59e0b',
  farmland: '#22c55e',
  bedouin_camp: '#ef4444',
  mountain_village: '#60a5fa',
  coastal_port: '#06b6d4',
  royal_palace: '#eab308',
};

function QuestsTab() {
  const quests = useSelector((s) => s.quests?.quests || {});

  const grouped = useMemo(() => {
    const groups = {};
    for (const zoneId of ZONE_ORDER) {
      const zoneQuests = questsData.filter((q) => q.zone === zoneId);
      if (zoneQuests.length > 0) groups[zoneId] = zoneQuests;
    }
    return groups;
  }, []);

  return (
    <div>
      {Object.entries(grouped).map(([zoneId, zoneQuests]) => (
        <div key={zoneId} className={styles.zoneGroup}>
          <div className={styles.zoneName}>
            {ZONES[zoneId]?.name || zoneId}
          </div>
          {zoneQuests.map((qd) => {
            const qs = quests[qd.id];
            const status = qs?.status || 'locked';
            const progress = qs?.progress || 0;
            const total = qd.objectives?.length || 1;

            return (
              <div key={qd.id} className={styles.questItem}>
                <span className={styles.questName}>
                  {qd.title}
                  {qd.titleArabic && (
                    <span className={styles.questArabic}> {qd.titleArabic}</span>
                  )}
                </span>
                {status === 'active' && (
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${Math.min(100, (progress / total) * 100)}%` }}
                    />
                  </div>
                )}
                <span
                  className={`${styles.badge} ${
                    status === 'active' ? styles.badgeActive :
                    status === 'complete' || status === 'claimed' ? styles.badgeComplete :
                    styles.badgeLocked
                  }`}
                >
                  {status === 'claimed' ? 'complete' : status}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function NpcCard({ npc, isMet }) {
  const friendshipTier = useSelector(selectFriendshipTier(npc.id));

  const tierClass = {
    close: styles.friendClose,
    friendly: styles.friendFriendly,
    cautious: styles.friendCautious,
    cold: styles.friendCold,
  }[friendshipTier] || styles.friendCold;

  const zone = npc.zone || npc.schedule?.[0]?.zone;

  return (
    <div className={`${styles.npcCard} ${!isMet ? styles.npcUnmet : ''}`}>
      <div className={styles.npcName}>{isMet ? npc.name : '???'}</div>
      {isMet && npc.nameArabic && (
        <div className={styles.npcArabic} lang="ar">{npc.nameArabic}</div>
      )}
      {isMet && zone && (
        <div className={styles.npcZone}>{ZONES[zone]?.name || zone}</div>
      )}
      {isMet && (
        <span className={`${styles.friendshipBadge} ${tierClass}`}>
          {friendshipTier}
        </span>
      )}
    </div>
  );
}

function NPCsTab() {
  const npcsVisited = useSelector((s) => s.quests?.npcsVisited || []);
  const metSet = useMemo(() => new Set(npcsVisited), [npcsVisited]);

  // Show met NPCs first, then unmet
  const sortedNpcs = useMemo(() => {
    const met = npcsData.filter((n) => metSet.has(n.id));
    const unmet = npcsData.filter((n) => !metSet.has(n.id));
    return [...met, ...unmet];
  }, [metSet]);

  return (
    <div className={styles.npcGrid}>
      {sortedNpcs.map((npc) => (
        <NpcCard key={npc.id} npc={npc} isMet={metSet.has(npc.id)} />
      ))}
    </div>
  );
}

function ScheduleTab() {
  const { hour } = useSelector(selectGameTime);
  const npcsVisited = useSelector((s) => s.quests?.npcsVisited || []);
  const metSet = useMemo(() => new Set(npcsVisited), [npcsVisited]);

  const scheduledNpcs = useMemo(
    () => npcsData.filter((n) => n.schedule?.length > 0 && metSet.has(n.id)),
    [metSet]
  );

  if (scheduledNpcs.length === 0) {
    return <div className={styles.empty}>No NPC schedules discovered yet.</div>;
  }

  const nowPercent = (hour / 24) * 100;

  return (
    <div>
      {scheduledNpcs.map((npc) => (
        <div key={npc.id} className={styles.scheduleRow}>
          <div className={styles.scheduleLabel}>{npc.name}</div>
          <div className={styles.timeBar}>
            <div className={styles.timeNow} style={{ left: `${nowPercent}%` }} />
            {npc.schedule.map((entry, i) => {
              const start = (entry.startHour / 24) * 100;
              const color = ZONE_COLORS[entry.zone] || '#555';

              let widthPercent;
              if (entry.startHour <= entry.endHour) {
                widthPercent = ((entry.endHour - entry.startHour) / 24) * 100;
              } else {
                // Midnight wrap — render as two blocks
                widthPercent = ((24 - entry.startHour) / 24) * 100;
              }

              return (
                <div
                  key={i}
                  className={styles.timeBlock}
                  style={{
                    left: `${start}%`,
                    width: `${widthPercent}%`,
                    background: color,
                  }}
                  title={`${entry.zone} (${entry.startHour}:00-${entry.endHour}:00) — ${entry.behavior}`}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div className={styles.legend}>
        {Object.entries(ZONE_COLORS).map(([zone, color]) => (
          <div key={zone} className={styles.legendItem}>
            <div className={styles.legendSwatch} style={{ background: color }} />
            {ZONES[zone]?.name || zone}
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'quests', label: 'Quests', labelAr: 'مهام' },
  { id: 'npcs', label: 'NPCs', labelAr: 'شخصيات' },
  { id: 'schedule', label: 'Schedule', labelAr: 'جدول' },
];

export default function QuestJournal({ onClose }) {
  const [activeTab, setActiveTab] = useState('quests');

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleOverlayClose = useOverlayClose(handleClose);
  const focusTrapRef = useFocusTrap(true, handleOverlayClose);

  return (
    <div className={styles.overlay} onClick={handleOverlayClose}>
      <div
        className={styles.journal}
        ref={focusTrapRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Quest Journal"
      >
        <div className={styles.header}>
          <div>
            <span className={styles.title}>Journal</span>
            <span className={styles.titleArabic} lang="ar">دَفتَر</span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            ESC
          </button>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'npcs' && <NPCsTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
        </div>
      </div>
    </div>
  );
}
