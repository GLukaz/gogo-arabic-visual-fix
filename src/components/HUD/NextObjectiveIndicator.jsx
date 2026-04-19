import { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveQuest } from '../../store/slices/questSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import styles from './NextObjectiveIndicator.module.css';

/**
 * NextObjectiveIndicator — small banner below QuestTracker
 *
 * Shows contextual hints:
 * - When no active quest: "You're free to explore!"
 * - When active quest: quest title + next step summary
 * - When near a locked zone exit: "Zone gate ahead" warning
 */
function NextObjectiveIndicator() {
  const activeQuest = useSelector(selectActiveQuest);
  const [gateInfo, setGateInfo] = useState(null);

  // Listen for zone gate proximity events
  useEffect(() => {
    const handleZoneCheck = (data) => {
      if (data.unlock) {
        setGateInfo(data);
      }
    };

    // Clear gate info when zone transitions happen
    const handleZoneChange = () => {
      setGateInfo(null);
    };

    EventBus.on(EVENTS.ZONE_CHECK_UNLOCK, handleZoneCheck);
    EventBus.on(EVENTS.ZONE_CHANGE, handleZoneChange);

    return () => {
      EventBus.off(EVENTS.ZONE_CHECK_UNLOCK, handleZoneCheck);
      EventBus.off(EVENTS.ZONE_CHANGE, handleZoneChange);
    };
  }, []);

  // Gate warning takes priority
  if (gateInfo && gateInfo.unlock) {
    const reqs = [];
    if (gateInfo.unlock.quest) reqs.push('Quest required');
    if (gateInfo.unlock.minLevel) reqs.push(`Lv.${gateInfo.unlock.minLevel}`);
    if (gateInfo.unlock.minWords) reqs.push(`${gateInfo.unlock.minWords} words`);

    return (
      <div className={styles.indicator} role="status" aria-label="Zone gate ahead">
        <span className={styles.icon} aria-hidden="true">&#x1F512;</span>
        <span className={`${styles.text} ${styles.gateWarning}`}>
          Zone gate: {reqs.join(' + ')}
        </span>
      </div>
    );
  }

  // No active quest
  if (!activeQuest) {
    return (
      <div className={styles.indicator} role="status" aria-label="Free to explore">
        <span className={styles.icon} aria-hidden="true">&#x2728;</span>
        <span className={styles.text}>You&apos;re free to explore!</span>
      </div>
    );
  }

  // Active quest — show next step
  const remaining = activeQuest.target - activeQuest.progress;
  const stepText = remaining > 0
    ? `${remaining} more to go`
    : 'Ready to complete!';

  return (
    <div className={styles.indicator} role="status" aria-label={`Next: ${activeQuest.title}`}>
      <span className={styles.icon} aria-hidden="true">&#x27A1;</span>
      <span className={styles.text}>
        <span className={styles.highlight}>{activeQuest.title}</span>
        {' — '}
        {stepText}
      </span>
    </div>
  );
}

export default memo(NextObjectiveIndicator);
