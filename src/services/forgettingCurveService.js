/**
 * Forgetting Curve Service
 *
 * Feature #6: Data service showing which words are about to decay
 * (FSRS stability dropping), urgency-sorted review lists, and
 * retention forecasts for the next N days.
 */

/**
 * Get words that are decaying — overdue for review, sorted by urgency.
 *
 * @param {Object} fsrsCards - From state.vocabulary.fsrsCards
 * @param {number} limit - Max words to return
 * @returns {Array<{ wordId: string, dueDate: string, overdueDays: number, stability: number }>}
 */
export function getUrgentReviewList(fsrsCards, limit = 20) {
  if (!fsrsCards || typeof fsrsCards !== 'object') return [];

  const now = new Date();
  const urgent = [];

  for (const [wordId, data] of Object.entries(fsrsCards)) {
    if (!data?.card?.due) continue;

    const dueDate = new Date(data.card.due);
    if (dueDate > now) continue; // Not yet due

    const overdueDays = (now - dueDate) / (1000 * 60 * 60 * 24);
    urgent.push({
      wordId,
      dueDate: data.card.due,
      overdueDays: Math.round(overdueDays * 10) / 10,
      stability: data.card.stability || 0,
    });
  }

  // Sort by most overdue first
  urgent.sort((a, b) => b.overdueDays - a.overdueDays);
  return urgent.slice(0, limit);
}

/**
 * Get words whose stability is below a threshold — "at risk" of being forgotten.
 *
 * @param {Object} fsrsCards - FSRS card state
 * @param {number} stabilityThreshold - Days (default: 3)
 * @returns {Array<{ wordId: string, stability: number, due: string }>}
 */
export function getDecayingWords(fsrsCards, stabilityThreshold = 3) {
  if (!fsrsCards || typeof fsrsCards !== 'object') return [];

  return Object.entries(fsrsCards)
    .filter(([, data]) => {
      const stability = data?.card?.stability ?? 0;
      return stability > 0 && stability < stabilityThreshold;
    })
    .map(([wordId, data]) => ({
      wordId,
      stability: data.card.stability,
      due: data.card.due || null,
    }))
    .sort((a, b) => a.stability - b.stability);
}

/**
 * Forecast how many words will become due each day for the next N days.
 *
 * @param {Object} fsrsCards - FSRS card state
 * @param {number} days - Forecast window (default: 14)
 * @returns {Array<{ date: string, dueCount: number, cumulativeDue: number }>}
 */
export function getRetentionForecast(fsrsCards, days = 14) {
  if (!fsrsCards || typeof fsrsCards !== 'object') return [];

  const now = new Date();
  const forecast = [];

  // Count already-overdue words
  let backlog = 0;
  for (const data of Object.values(fsrsCards)) {
    if (!data?.card?.due) continue;
    if (new Date(data.card.due) <= now) backlog++;
  }

  for (let i = 0; i < days; i++) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() + i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    let dueCount = 0;
    for (const data of Object.values(fsrsCards)) {
      if (!data?.card?.due) continue;
      const dueDate = new Date(data.card.due);
      if (dueDate > dayStart && dueDate <= dayEnd) dueCount++;
    }

    if (i === 0) dueCount += backlog; // Day 0 includes backlog

    forecast.push({
      date: dayStart.toISOString().slice(0, 10),
      dueCount,
      cumulativeDue: i === 0 ? dueCount : (forecast[i - 1]?.cumulativeDue || 0) + dueCount,
    });
  }

  return forecast;
}

/**
 * Get a summary of retention health.
 *
 * @param {Object} fsrsCards - FSRS card state
 * @returns {{ total: number, overdue: number, atRisk: number, healthy: number, healthPercentage: number }}
 */
export function getRetentionHealth(fsrsCards) {
  if (!fsrsCards || typeof fsrsCards !== 'object') {
    return { total: 0, overdue: 0, atRisk: 0, healthy: 0, healthPercentage: 100 };
  }

  const now = new Date();
  let total = 0;
  let overdue = 0;
  let atRisk = 0;
  let healthy = 0;

  for (const data of Object.values(fsrsCards)) {
    if (!data?.card) continue;
    total++;

    const due = data.card.due ? new Date(data.card.due) : null;
    const stability = data.card.stability || 0;

    if (due && due <= now) {
      overdue++;
    } else if (stability < 3) {
      atRisk++;
    } else {
      healthy++;
    }
  }

  return {
    total,
    overdue,
    atRisk,
    healthy,
    healthPercentage: total > 0 ? Math.round((healthy / total) * 100) : 100,
  };
}
