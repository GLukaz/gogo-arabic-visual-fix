import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDialogue, showNotification } from '../../store/slices/uiSlice.js';
import { claimReward, setActiveQuest } from '../../store/slices/questSlice.js';
import { addXP, addDirhams } from '../../store/slices/playerSlice.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import questsData from '../../data/quests.json';
import { ZONES, ZONE_ORDER } from '../../data/zones.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './QuestLog.module.css';

// Group quests by zone
function groupQuestsByZone() {
  const groups = {};
  for (const zoneId of ZONE_ORDER) {
    groups[zoneId] = questsData.filter((q) => q.zone === zoneId);
  }
  // Add any quests without a zone at the end
  const unzoned = questsData.filter((q) => !q.zone);
  if (unzoned.length > 0) {
    groups._other = unzoned;
  }
  return groups;
}

export default function QuestLog() {
  const dispatch = useDispatch();
  const quests = useSelector((s) => s.quests.quests);
  const activeQuestId = useSelector((s) => s.quests.activeQuestId);

  const handleClose = useCallback(() => {
    dispatch(closeDialogue());
  }, [dispatch]);

  const handleOverlayClose = useOverlayClose(handleClose);

  const focusTrapRef = useFocusTrap(true, handleOverlayClose);

  const handleClaim = (questId) => {
    const qd = questsData.find((q) => q.id === questId);
    if (qd?.reward) {
      dispatch(addXP(qd.reward.xp));
      dispatch(addDirhams(qd.reward.dirhams));
      dispatch(showNotification({
        message: `+${qd.reward.xp} XP, +${qd.reward.dirhams} Dirhams`,
        type: 'xp',
      }));
    }
    dispatch(claimReward(questId));
  };

  const questGroups = groupQuestsByZone();

  // PROG-07: Find recommended next quest (lowest uncompleted in prerequisite chain)
  const recommendedQuestId = useMemo(() => {
    // Find all active quests, prefer the one with least unmet prerequisites depth
    const activeQuestDefs = questsData.filter((qd) => {
      const state = quests[qd.id];
      return state && state.status === 'active';
    });

    if (activeQuestDefs.length === 0) return null;

    // Score each active quest by how "foundational" it is:
    // quests whose IDs appear as prerequisites for others rank higher
    const preReqCount = {};
    for (const qd of questsData) {
      for (const preId of qd.prerequisites) {
        preReqCount[preId] = (preReqCount[preId] || 0) + 1;
      }
    }

    // Sort: highest "needed by others" count first, then by lowest target
    const sorted = [...activeQuestDefs].sort((a, b) => {
      const aScore = preReqCount[a.id] || 0;
      const bScore = preReqCount[b.id] || 0;
      if (bScore !== aScore) return bScore - aScore;
      return a.target - b.target;
    });

    return sorted[0]?.id || null;
  }, [quests]);

  const renderQuest = (qd) => {
    const state = quests[qd.id];
    const status = state?.status || 'locked';
    const progress = state?.progress || 0;
    const rewardClaimed = state?.rewardClaimed || false;
    const target = qd.target;
    const pct = Math.min(100, (progress / target) * 100);
    const isRecommended = qd.id === recommendedQuestId;

    let itemClassName = styles.questItem;
    let titleClassName = styles.questTitle;
    let badge = null;

    if (status === 'completed') {
      itemClassName = `${styles.questItem} ${styles.questCompleted}`;
      badge = <span className={styles.badgeComplete}>Complete</span>;
    } else if (status === 'active') {
      itemClassName = `${styles.questItem} ${styles.questActive}`;
      if (isRecommended) {
        itemClassName += ` ${styles.questRecommended}`;
      }
      titleClassName = `${styles.questTitle} ${styles.questTitleActive}`;
      badge = <span className={styles.badgeActive}>Active</span>;
    } else {
      itemClassName = `${styles.questItem} ${styles.questLocked}`;
      badge = <span className={styles.badgeLocked}>Locked</span>;
    }

    return (
      <div key={qd.id} className={itemClassName}>
        <div className={styles.questTitleRow}>
          <span className={titleClassName}>
            {isRecommended && status === 'active' && (
              <span className={styles.recommendedStar} title="Recommended next quest">&#9733; </span>
            )}
            {qd.title}
          </span>
          {badge}
        </div>
        <div className={styles.questDesc}>{qd.description}</div>

        {/* PROG-07: Objective steps with checkmarks */}
        {qd.objectives && qd.objectives.length > 0 && status !== 'locked' && (
          <div className={styles.objectiveList}>
            {qd.objectives.map((obj, idx) => {
              const objDone = progress > idx;
              return (
                <div
                  key={obj.id}
                  className={`${styles.objectiveStep} ${objDone ? styles.objectiveDone : ''}`}
                >
                  <span className={styles.objectiveCheck} aria-hidden="true">
                    {objDone ? '\u2713' : '\u25CB'}
                  </span>
                  <span className={styles.objectiveText}>{obj.description}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.progressBarOuter}>
          <div
            className={`${styles.progressFill} ${status === 'completed' ? styles.progressFillComplete : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className={styles.progressRow}>
          <span className={styles.progressText}>
            {progress}/{target} <span className={styles.progressPct}>({Math.round(pct)}%)</span>
          </span>
          <span className={styles.reward}>
            {qd.reward.xp} XP + {qd.reward.dirhams} Dirhams
          </span>
        </div>
        {status === 'active' && (
          <button
            className={`${styles.trackBtn} ${activeQuestId === qd.id ? styles.trackBtnActive : ''}`}
            onClick={() => dispatch(setActiveQuest(qd.id))}
            disabled={activeQuestId === qd.id}
          >
            {activeQuestId === qd.id ? 'Tracking' : 'Track Quest'}
          </button>
        )}
        {status === 'completed' && !rewardClaimed && (
          <button
            className={styles.claimBtn}
            onClick={() => handleClaim(qd.id)}
          >
            Claim Reward
          </button>
        )}
        {status === 'completed' && rewardClaimed && (
          <div className={styles.claimedText}>Reward Claimed</div>
        )}
      </div>
    );
  };

  return (
    <div ref={focusTrapRef} className={styles.overlay} onClick={handleOverlayClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Quest Log</div>
          <button className={styles.closeBtn} onClick={handleOverlayClose}>Close</button>
        </div>

        {/* PROG-07: What to do next section */}
        {recommendedQuestId && (() => {
          const recQd = questsData.find((q) => q.id === recommendedQuestId);
          const recState = quests[recommendedQuestId];
          if (!recQd || !recState) return null;
          const recPct = Math.min(100, ((recState.progress || 0) / recQd.target) * 100);
          return (
            <div className={styles.nextSection}>
              <div className={styles.nextHeader}>What to do next</div>
              <div className={styles.nextQuest}>
                <span className={styles.nextQuestTitle}>&#9733; {recQd.title}</span>
                <span className={styles.nextQuestPct}>{Math.round(recPct)}%</span>
              </div>
              <div className={styles.nextQuestDesc}>{recQd.description}</div>
              {activeQuestId !== recommendedQuestId && (
                <button
                  className={styles.trackBtn}
                  onClick={() => dispatch(setActiveQuest(recommendedQuestId))}
                >
                  Track This Quest
                </button>
              )}
            </div>
          );
        })()}

        {ZONE_ORDER.map((zoneId) => {
          const zoneQuests = questGroups[zoneId];
          if (!zoneQuests || zoneQuests.length === 0) return null;
          const zone = ZONES[zoneId];

          return (
            <div key={zoneId}>
              <div className={styles.zoneHeader}>
                <span className={styles.zoneName}>{zone?.name || zoneId}</span>
                {zone?.nameArabic && (
                  <span className={styles.zoneNameArabic}>{zone.nameArabic}</span>
                )}
              </div>
              {zoneQuests.map(renderQuest)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
