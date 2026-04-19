/**
 * learningAnalytics.js — Phase 93
 *
 * Pure functions for computing learning insights from Redux state.
 * No side-effects, no dispatches — just data in, insights out.
 */

/**
 * Compute vocabulary mastery distribution.
 * Classifies words into mastered (>=90%), learning (50-89%), struggling (<50%), and new (0 attempts).
 *
 * @param {object} vocabularyState - state.vocabulary (fsrsCards)
 * @param {object} wordAccuracy - state.analytics.wordAccuracy
 * @returns {{ mastered: number, learning: number, new: number, struggling: number }}
 */
export function getVocabMasteryDistribution(vocabularyState, wordAccuracy = {}) {
  const result = { mastered: 0, learning: 0, new: 0, struggling: 0 };

  if (!vocabularyState?.fsrsCards) return result;

  const cardIds = Object.keys(vocabularyState.fsrsCards);
  if (cardIds.length === 0) return result;

  for (const wordId of cardIds) {
    const accuracy = wordAccuracy[wordId];
    if (!accuracy || accuracy.total === 0) {
      result.new += 1;
    } else {
      const ratio = accuracy.correct / accuracy.total;
      if (ratio >= 0.9) {
        result.mastered += 1;
      } else if (ratio >= 0.5) {
        result.learning += 1;
      } else {
        result.struggling += 1;
      }
    }
  }

  return result;
}

/**
 * Identify struggling words (lowest accuracy over attempts).
 *
 * @param {object} wordAccuracy - state.analytics.wordAccuracy { wordId: { correct, total } }
 * @param {number} limit - Max words to return
 * @returns {Array<{ wordId: string, accuracy: number, attempts: number }>}
 */
export function getStrugglingWords(wordAccuracy, limit = 10) {
  if (!wordAccuracy || typeof wordAccuracy !== 'object') return [];

  return Object.entries(wordAccuracy)
    .filter(([, stats]) => stats.total >= 2)
    .map(([wordId, stats]) => ({
      wordId,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
      attempts: stats.total,
      correct: stats.correct,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

/**
 * Compute study time distribution by activity type.
 *
 * @param {Array} sessions - state.analytics.sessions
 * @returns {{ quizzes: number, review: number, grammar: number, reading: number, writing: number, conversation: number, miniGames: number, other: number }}
 */
export function getStudyTimeDistribution(sessions) {
  const distribution = {
    quizzes: 0,
    review: 0,
    grammar: 0,
    reading: 0,
    writing: 0,
    conversation: 0,
    miniGames: 0,
    other: 0,
  };

  if (!Array.isArray(sessions)) return distribution;

  const typeMap = {
    quiz: 'quizzes',
    review: 'review',
    grammar: 'grammar',
    reading: 'reading',
    writing: 'writing',
    conversation: 'conversation',
    miniGame: 'miniGames',
    alphabet: 'other',
  };

  for (const session of sessions) {
    if (!session.startedAt || !session.endedAt) continue;
    const durationMs = new Date(session.endedAt) - new Date(session.startedAt);
    const minutes = Math.max(0, durationMs / 60000);
    const key = typeMap[session.type] || 'other';
    distribution[key] += Math.round(minutes * 10) / 10;
  }

  return distribution;
}

/**
 * Calculate learning velocity (words learned per day over time).
 *
 * @param {object} dailyActivity - state.analytics.dailyActivity
 * @param {number} days - Number of days to look back
 * @returns {Array<{ date: string, wordsLearned: number, minutesStudied: number }>}
 */
export function getLearningVelocity(dailyActivity, days = 30) {
  if (!dailyActivity || typeof dailyActivity !== 'object') return [];

  const today = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const activity = dailyActivity[dateStr];

    result.push({
      date: dateStr,
      wordsLearned: activity?.wordsReviewed || 0,
      minutesStudied: activity ? Math.round(activity.timeSpentMs / 60000) : 0,
    });
  }

  return result;
}

/**
 * Get quiz performance by session type.
 *
 * @param {Array} sessions - state.analytics.sessions
 * @returns {object} { [type]: { accuracy: number, attempts: number, averageTime: number } }
 */
export function getQuizPerformanceByType(sessions) {
  if (!Array.isArray(sessions)) return {};

  const byType = {};

  for (const session of sessions) {
    const type = session.type || 'unknown';
    if (!byType[type]) {
      byType[type] = { totalCorrect: 0, totalWords: 0, attempts: 0, totalTimeMs: 0 };
    }

    byType[type].attempts += 1;
    byType[type].totalCorrect += session.correctCount || 0;
    byType[type].totalWords += session.wordsReviewed || 0;

    if (session.startedAt && session.endedAt) {
      byType[type].totalTimeMs += Math.max(0, new Date(session.endedAt) - new Date(session.startedAt));
    }
  }

  const result = {};
  for (const [type, data] of Object.entries(byType)) {
    result[type] = {
      accuracy: data.totalWords > 0 ? data.totalCorrect / data.totalWords : 0,
      attempts: data.attempts,
      averageTime: data.attempts > 0 ? Math.round(data.totalTimeMs / data.attempts / 1000) : 0,
    };
  }

  return result;
}

/**
 * Get grammar mastery by category.
 *
 * @param {object} grammarState - state.grammar
 * @returns {object} { completed: number, total: number, averageScore: number }
 */
export function getGrammarMasteryByCategory(grammarState) {
  if (!grammarState) return { completed: 0, total: 0, averageScore: 0 };

  const completedLessons = grammarState.completedLessons || [];
  const lessonScores = grammarState.lessonScores || {};
  const unlockedLessons = grammarState.unlockedLessons || [];

  const totalLessons = Math.max(unlockedLessons.length, completedLessons.length);
  const completed = completedLessons.length;

  let totalScore = 0;
  let scoredCount = 0;

  for (const [, score] of Object.entries(lessonScores)) {
    if (score.quizScore > 0) {
      totalScore += score.quizScore;
      scoredCount += 1;
    }
  }

  return {
    completed,
    total: totalLessons,
    averageScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
  };
}

/**
 * Generate personalized learning recommendations.
 *
 * @param {object} playerState - Aggregated player state snapshot
 * @returns {Array<{ type: string, description: string, descriptionArabic: string, priority: number }>}
 */
export function getLearningRecommendations(playerState) {
  const recommendations = [];

  const {
    wordAccuracy = {},
    vocabularyCount = 0,
    grammarCompleted = 0,
    readingCompleted = 0,
    conversationCompleted = 0,
    currentStreak = 0,
    sessionsCount = 0,
  } = playerState || {};

  // Check for struggling words
  const struggling = getStrugglingWords(wordAccuracy, 5);
  if (struggling.length > 0) {
    recommendations.push({
      type: 'review',
      description: `Review ${struggling.length} struggling word${struggling.length > 1 ? 's' : ''} to strengthen retention`,
      descriptionArabic: `راجع ${struggling.length} كلمات تحتاج تقوية`,
      priority: 1,
    });
  }

  // Encourage vocabulary growth
  if (vocabularyCount < 50) {
    recommendations.push({
      type: 'explore',
      description: 'Learn 5 new words today to build your vocabulary base',
      descriptionArabic: 'تعلم ٥ كلمات جديدة اليوم لتوسيع مفرداتك',
      priority: 2,
    });
  }

  // Grammar practice
  if (grammarCompleted < 3) {
    recommendations.push({
      type: 'practice',
      description: 'Complete a grammar lesson to strengthen your foundation',
      descriptionArabic: 'أكمل درس قواعد لتعزيز أساسياتك',
      priority: 3,
    });
  }

  // Reading practice
  if (readingCompleted < 2) {
    recommendations.push({
      type: 'explore',
      description: 'Read an Arabic passage to improve comprehension',
      descriptionArabic: 'اقرأ نصاً عربياً لتحسين الفهم',
      priority: 4,
    });
  }

  // Conversation practice
  if (conversationCompleted < 1) {
    recommendations.push({
      type: 'practice',
      description: 'Try a conversation scenario to practice speaking',
      descriptionArabic: 'جرّب محادثة لممارسة التحدث',
      priority: 5,
    });
  }

  // Streak encouragement
  if (currentStreak === 0 && sessionsCount > 0) {
    recommendations.push({
      type: 'review',
      description: 'Start a new streak! A quick review session keeps the momentum going',
      descriptionArabic: 'ابدأ سلسلة جديدة! مراجعة سريعة تحافظ على الزخم',
      priority: 2,
    });
  }

  // General encouragement when everything looks good
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'explore',
      description: 'Great progress! Explore new content to keep advancing',
      descriptionArabic: 'تقدم رائع! استكشف محتوى جديد للاستمرار في التقدم',
      priority: 5,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Calculate estimated time to next CEFR level.
 *
 * @param {object} cefrState - state.cefrProgress
 * @param {Array} velocity - Output of getLearningVelocity
 * @returns {{ currentLevel: string|null, nextLevel: string|null, estimatedDays: number, confidence: string }}
 */
export function getTimeToNextCefr(cefrState, velocity = []) {
  const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'];
  const WORDS_PER_LEVEL = { A1: 200, A2: 500, B1: 1000, B2: 2000 };

  const currentLevel = cefrState?.currentLevel || null;
  if (!currentLevel) {
    return { currentLevel: null, nextLevel: 'A1', estimatedDays: 0, confidence: 'low' };
  }

  const currentIdx = CEFR_LEVELS.indexOf(currentLevel);
  if (currentIdx >= CEFR_LEVELS.length - 1) {
    return { currentLevel, nextLevel: null, estimatedDays: 0, confidence: 'high' };
  }

  const nextLevel = CEFR_LEVELS[currentIdx + 1];
  const wordsNeeded = (WORDS_PER_LEVEL[nextLevel] || 500) - (WORDS_PER_LEVEL[currentLevel] || 0);

  // Calculate average daily words from velocity
  const recentDays = velocity.slice(-14);
  const activeDays = recentDays.filter((d) => d.wordsLearned > 0);

  if (activeDays.length === 0) {
    return { currentLevel, nextLevel, estimatedDays: wordsNeeded, confidence: 'low' };
  }

  const avgWordsPerDay = activeDays.reduce((sum, d) => sum + d.wordsLearned, 0) / activeDays.length;
  const estimatedDays = avgWordsPerDay > 0 ? Math.ceil(wordsNeeded / avgWordsPerDay) : wordsNeeded;

  let confidence = 'low';
  if (activeDays.length >= 10) confidence = 'high';
  else if (activeDays.length >= 5) confidence = 'medium';

  return { currentLevel, nextLevel, estimatedDays, confidence };
}

/**
 * Generate weekly or monthly study report.
 *
 * @param {object} playerState - Aggregated player state snapshot
 * @param {'weekly'|'monthly'} period
 * @returns {object} Study report
 */
export function generateStudyReport(playerState, period = 'weekly') {
  const {
    dailyActivity = {},
    sessions = [],
    wordAccuracy = {},
    grammarState = {},
    readingState = {},
    conversationState = {},
    statsState = {},
  } = playerState || {};

  const now = new Date();
  const daysBack = period === 'weekly' ? 7 : 30;
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysBack);

  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = now.toISOString().slice(0, 10);

  // Filter daily activity to period
  let wordsReviewed = 0;
  let studyMinutes = 0;
  let sessionsCount = 0;
  let activeDays = 0;

  for (const [date, data] of Object.entries(dailyActivity)) {
    if (date >= startStr && date <= endStr) {
      wordsReviewed += data.wordsReviewed || 0;
      studyMinutes += Math.round((data.timeSpentMs || 0) / 60000);
      sessionsCount += data.sessionCount || 0;
      if (data.wordsReviewed > 0 || data.timeSpentMs > 0) {
        activeDays += 1;
      }
    }
  }

  // Filter sessions to period
  const periodSessions = sessions.filter((s) => {
    const sessionDate = s.startedAt?.slice(0, 10);
    return sessionDate >= startStr && sessionDate <= endStr;
  });

  let totalCorrect = 0;
  let totalAttempts = 0;
  for (const s of periodSessions) {
    totalCorrect += s.correctCount || 0;
    totalAttempts += s.wordsReviewed || 0;
  }
  const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Count words in different mastery stages
  const accuracyEntries = Object.values(wordAccuracy);
  const wordsMastered = accuracyEntries.filter((w) => w.total > 0 && w.correct / w.total >= 0.9).length;

  // Highlights
  const highlights = [];
  if (activeDays >= daysBack) {
    highlights.push(`Perfect ${period} streak — studied every day!`);
  } else if (activeDays >= Math.ceil(daysBack * 0.7)) {
    highlights.push(`Strong consistency — studied ${activeDays} out of ${daysBack} days`);
  }
  if (averageAccuracy >= 90) {
    highlights.push(`Excellent accuracy at ${averageAccuracy}%`);
  }
  if (wordsReviewed >= 100) {
    highlights.push(`Reviewed ${wordsReviewed} words — great effort!`);
  }

  const recommendations = getLearningRecommendations({
    wordAccuracy,
    vocabularyCount: Object.keys(wordAccuracy).length,
    grammarCompleted: grammarState.completedLessons?.length || 0,
    readingCompleted: readingState.readingStats?.totalRead || 0,
    conversationCompleted: conversationState.stats?.totalCompleted || 0,
    currentStreak: statsState.currentStreak || 0,
    sessionsCount,
  });

  return {
    period,
    startDate: startStr,
    endDate: endStr,
    wordsLearned: Object.keys(wordAccuracy).length,
    wordsMastered,
    wordsReviewed,
    quizzesTaken: periodSessions.length,
    averageAccuracy,
    studyMinutes,
    sessionsCount,
    streakDays: activeDays,
    grammarLessonsCompleted: grammarState.completedLessons?.length || 0,
    passagesRead: readingState.readingStats?.totalRead || 0,
    conversationsHad: conversationState.stats?.totalCompleted || 0,
    highlights,
    recommendations,
  };
}

/**
 * Calculate words reviewed per hour of study time.
 *
 * @param {Array} sessions - state.analytics.sessions
 * @returns {number} Words per hour (rounded to 1 decimal)
 */
export function getWordsPerHour(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0;

  let totalWords = 0;
  let totalMs = 0;

  for (const session of sessions) {
    totalWords += session.wordsReviewed || 0;
    if (session.startedAt && session.endedAt) {
      totalMs += Math.max(0, new Date(session.endedAt) - new Date(session.startedAt));
    }
  }

  const totalHours = totalMs / (1000 * 60 * 60);
  if (totalHours <= 0) return 0;

  return Math.round((totalWords / totalHours) * 10) / 10;
}

/**
 * Find the optimal session length — the duration with the highest accuracy.
 * Groups sessions into 5-minute buckets and finds the peak.
 *
 * @param {Array} sessions - state.analytics.sessions
 * @returns {{ optimalMinutes: number, peakAccuracy: number }|null}
 */
export function getOptimalSessionLength(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return null;

  const buckets = {}; // { bucket: { totalAccuracy, count } }

  for (const session of sessions) {
    if (!session.startedAt || !session.endedAt || !session.wordsReviewed) continue;

    const durationMs = new Date(session.endedAt) - new Date(session.startedAt);
    const minutes = Math.max(1, durationMs / 60000);
    const bucket = Math.round(minutes / 5) * 5 || 5; // 5-minute buckets

    const accuracy = session.wordsReviewed > 0
      ? (session.correctCount || 0) / session.wordsReviewed
      : 0;

    if (!buckets[bucket]) buckets[bucket] = { total: 0, count: 0 };
    buckets[bucket].total += accuracy;
    buckets[bucket].count += 1;
  }

  let peakBucket = null;
  let peakAvg = 0;

  for (const [bucket, data] of Object.entries(buckets)) {
    if (data.count < 2) continue; // Need at least 2 sessions for meaningful data
    const avg = data.total / data.count;
    if (avg > peakAvg) {
      peakAvg = avg;
      peakBucket = Number(bucket);
    }
  }

  if (!peakBucket) return null;

  return {
    optimalMinutes: peakBucket,
    peakAccuracy: Math.round(peakAvg * 100),
  };
}

/**
 * Calculate rolling accuracy trend over time.
 *
 * @param {Object} dailyActivity - state.analytics.dailyActivity
 * @param {number} days - Number of days to look back
 * @param {number} window - Rolling average window in days (default 7)
 * @returns {Array<{ date: string, accuracy: number, rollingAverage: number }>}
 */
export function getAccuracyTrend(dailyActivity, days = 30, window = 7) {
  if (!dailyActivity || typeof dailyActivity !== 'object') return [];

  const today = new Date();
  const dataPoints = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const activity = dailyActivity[dateStr];

    const accuracy = activity?.wordsReviewed > 0
      ? Math.round(((activity.correctCount || 0) / activity.wordsReviewed) * 100)
      : null;

    dataPoints.push({ date: dateStr, accuracy });
  }

  // Compute rolling average
  return dataPoints.map((point, idx) => {
    const windowStart = Math.max(0, idx - window + 1);
    const windowSlice = dataPoints.slice(windowStart, idx + 1);
    const validPoints = windowSlice.filter((p) => p.accuracy !== null);

    const rollingAverage = validPoints.length > 0
      ? Math.round(validPoints.reduce((sum, p) => sum + p.accuracy, 0) / validPoints.length)
      : null;

    return {
      date: point.date,
      accuracy: point.accuracy,
      rollingAverage,
    };
  });
}

