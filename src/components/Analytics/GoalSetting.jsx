/**
 * GoalSetting — Phase 93
 *
 * Personal learning goal configuration with progress rings.
 * Encouraging, not punitive — celebrates progress.
 */

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLearningGoals,
  selectGoalCompletion,
  selectGoalStreak,
  setLearningGoal,
} from '../../store/slices/extendedAnalyticsSlice.js';
import styles from './GoalSetting.module.css';
import PropTypes from 'prop-types';

const RING_RADIUS = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Circular progress ring SVG.
 */
function ProgressRing({ percent, colorClass, label, current, target }) {
  const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;

  return (
    <div className={styles.ringCard}>
      <div className={styles.ringWrapper}>
        <svg className={styles.ringSvg} width="72" height="72" viewBox="0 0 72 72">
          <circle className={styles.ringBg} cx="36" cy="36" r={RING_RADIUS} />
          <circle
            className={`${styles.ringFill} ${styles[colorClass]}`}
            cx="36"
            cy="36"
            r={RING_RADIUS}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.ringCenter}>
          <span className={styles.ringPercent}>{percent}%</span>
        </div>
      </div>
      <span className={styles.ringLabel}>
        {current}/{target} {label}
      </span>
    </div>
  );
}

ProgressRing.propTypes = {
  percent: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  target: PropTypes.number.isRequired,
};

function GoalSetting({ readOnly }) {
  const dispatch = useDispatch();
  const goals = useSelector(selectLearningGoals);
  const completion = useSelector(selectGoalCompletion);
  const streak = useSelector(selectGoalStreak);

  const handleGoalChange = useCallback(
    (key, value) => {
      dispatch(setLearningGoal({ key, value: Number(value) }));
    },
    [dispatch]
  );

  const allComplete =
    completion.minutes.percent >= 100 &&
    completion.words.percent >= 100;

  return (
    <div className={styles.container} data-testid="goal-setting">
      <h3 className={styles.title}>Daily Goals / الأهداف اليومية</h3>

      {/* Progress rings */}
      <div className={styles.ringsRow} data-testid="progress-rings">
        <ProgressRing
          percent={completion.minutes.percent}
          colorClass="ringFillMinutes"
          label="min"
          current={completion.minutes.current}
          target={completion.minutes.target}
        />
        <ProgressRing
          percent={completion.words.percent}
          colorClass="ringFillWords"
          label="words"
          current={completion.words.current}
          target={completion.words.target}
        />
        <ProgressRing
          percent={completion.passages.percent}
          colorClass="ringFillPassages"
          label="passages"
          current={completion.passages.current}
          target={completion.passages.target}
        />
      </div>

      {/* Goal sliders (hidden in readOnly mode) */}
      {!readOnly && (
        <div className={styles.goalSliders} data-testid="goal-sliders">
          <div className={styles.goalRow}>
            <div className={styles.goalLabel}>
              Study Time
              <span className={styles.goalLabelArabic}>وقت الدراسة</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="5"
              max="60"
              step="5"
              value={goals.dailyMinutes}
              onChange={(e) => handleGoalChange('dailyMinutes', e.target.value)}
              aria-label="Daily study time goal in minutes"
            />
            <span className={styles.goalValue}>{goals.dailyMinutes}m</span>
          </div>

          <div className={styles.goalRow}>
            <div className={styles.goalLabel}>
              New Words
              <span className={styles.goalLabelArabic}>كلمات جديدة</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="1"
              max="20"
              step="1"
              value={goals.dailyWords}
              onChange={(e) => handleGoalChange('dailyWords', e.target.value)}
              aria-label="Daily new words goal"
            />
            <span className={styles.goalValue}>{goals.dailyWords}</span>
          </div>

          <div className={styles.goalRow}>
            <div className={styles.goalLabel}>
              Passages/wk
              <span className={styles.goalLabelArabic}>نصوص / أسبوع</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="1"
              max="10"
              step="1"
              value={goals.weeklyPassages}
              onChange={(e) => handleGoalChange('weeklyPassages', e.target.value)}
              aria-label="Weekly reading passages goal"
            />
            <span className={styles.goalValue}>{goals.weeklyPassages}</span>
          </div>
        </div>
      )}

      {/* Streak bar */}
      <div className={styles.streakBar} data-testid="goal-streak">
        <span className={styles.streakIcon}>{allComplete ? '\u2B50' : '\uD83D\uDD25'}</span>
        <span className={styles.streakText}>
          {streak > 0
            ? `${streak} day goal streak — keep it up!`
            : 'Complete today\'s goals to start a streak!'
          }
        </span>
        {streak > 0 && <span className={styles.streakCount}>{streak}</span>}
      </div>
    </div>
  );
}

GoalSetting.propTypes = {
  readOnly: PropTypes.bool,
};

export default GoalSetting;
