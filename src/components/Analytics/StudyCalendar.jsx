/**
 * StudyCalendar — Phase 93
 *
 * GitHub-style contribution calendar showing daily study intensity.
 * 12-week grid with color-coded cells and hover tooltips.
 */

import { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectDailyActivity } from '../../store/slices/analyticsSlice.js';
import styles from './StudyCalendar.module.css';
import PropTypes from 'prop-types';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const WEEKS_TO_SHOW = 12;

/**
 * Calculate intensity level (0-4) based on study minutes.
 */
function getIntensity(minutes) {
  if (!minutes || minutes <= 0) return 0;
  if (minutes < 10) return 1;
  if (minutes < 25) return 2;
  if (minutes < 45) return 3;
  return 4;
}

function StudyCalendar({ dailyActivityOverride }) {
  const reduxDailyActivity = useSelector(selectDailyActivity);
  const dailyActivity = dailyActivityOverride || reduxDailyActivity;
  const [tooltip, setTooltip] = useState(null);

  const { weeks, streak } = useMemo(() => {
    const today = new Date();
    const result = [];
    const months = [];
    let currentStreak = 0;
    let streakBroken = false;

    // Build grid: WEEKS_TO_SHOW weeks, each with 7 days (Sun-Sat)
    // End the grid at the end of this week (Saturday), so today is always visible.
    const totalDays = WEEKS_TO_SHOW * 7;
    const todayDow = today.getDay(); // 0=Sun
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - todayDow)); // Saturday
    const startDate = new Date(endOfWeek);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    let lastMonth = -1;

    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + w * 7 + d);
        const dateStr = cellDate.toISOString().slice(0, 10);
        const activity = dailyActivity[dateStr];
        const minutes = activity ? Math.round(activity.timeSpentMs / 60000) : 0;
        const wordsReviewed = activity?.wordsReviewed || 0;
        const sessions = activity?.sessionCount || 0;
        const isFuture = cellDate > today;

        week.push({
          date: dateStr,
          displayDate: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          intensity: isFuture ? -1 : getIntensity(minutes),
          minutes,
          wordsReviewed,
          sessions,
          isFuture,
        });

        // Track month labels
        const month = cellDate.getMonth();
        if (d === 0 && month !== lastMonth) {
          months.push({
            weekIndex: w,
            label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          });
          lastMonth = month;
        }
      }
      result.push(week);
    }

    // Calculate streak (consecutive days with study activity, counting backward from today)
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - (totalDays - 1 - i));
      if (d > today) continue;
      const dateStr = d.toISOString().slice(0, 10);
      const activity = dailyActivity[dateStr];
      const minutes = activity ? Math.round(activity.timeSpentMs / 60000) : 0;

      if (!streakBroken) {
        if (minutes > 0) {
          currentStreak += 1;
        } else {
          // Allow today to be 0 (hasn't studied yet today)
          const isToday = dateStr === today.toISOString().slice(0, 10);
          if (!isToday) {
            streakBroken = true;
          }
        }
      }
    }

    return { weeks: result, monthLabels: months, streak: currentStreak };
  }, [dailyActivity]);

  const handleMouseEnter = useCallback((e, cell) => {
    if (cell.isFuture) return;
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 4,
      cell,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className={styles.container} data-testid="study-calendar">
      <h3 className={styles.title}>Study Calendar / تقويم الدراسة</h3>

      <div className={styles.calendarWrapper}>
        {/* Day labels */}
        <div className={styles.dayLabels}>
          {DAY_LABELS.map((label, i) => (
            <div key={i} className={styles.dayLabel}>{label}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={styles.calendarGrid} data-testid="calendar-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className={styles.weekColumn}>
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={`${styles.dayCell} ${
                    cell.isFuture
                      ? styles.intensity0
                      : styles[`intensity${cell.intensity}`]
                  }`}
                  data-testid={`day-${cell.date}`}
                  data-intensity={cell.intensity}
                  onMouseEnter={(e) => handleMouseEnter(e, cell)}
                  onMouseLeave={handleMouseLeave}
                  aria-label={`${cell.displayDate}: ${cell.minutes} minutes studied`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Less</span>
        <div className={`${styles.legendCell} ${styles.intensity0}`} />
        <div className={`${styles.legendCell} ${styles.intensity1}`} />
        <div className={`${styles.legendCell} ${styles.intensity2}`} />
        <div className={`${styles.legendCell} ${styles.intensity3}`} />
        <div className={`${styles.legendCell} ${styles.intensity4}`} />
        <span className={styles.legendLabel}>More</span>
      </div>

      {/* Streak */}
      <div className={styles.streakRow}>
        <span className={styles.streakLabel}>Current Streak:</span>
        <span className={styles.streakValue}>{streak} day{streak !== 1 ? 's' : ''}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className={styles.tooltipDate}>{tooltip.cell.displayDate}</span>
          <span className={styles.tooltipStats}>
            {tooltip.cell.minutes} min | {tooltip.cell.wordsReviewed} words | {tooltip.cell.sessions} sessions
          </span>
        </div>
      )}
    </div>
  );
}

StudyCalendar.propTypes = {
  dailyActivityOverride: PropTypes.object,
};

export default StudyCalendar;
