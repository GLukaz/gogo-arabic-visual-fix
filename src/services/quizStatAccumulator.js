/**
 * QuizStatAccumulator
 * localStorage-based quiz statistics service.
 * IMM-04: "X% of players got this right" display on quiz questions.
 */

const STORAGE_KEY = 'gogo_quiz_stats';
const MIN_SESSIONS_FOR_DISPLAY = 3;

function _getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Corrupted — reset
  }
  return { sessionCount: 0, currentSessionId: null, stats: {} };
}

function _setStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full — fail silently
  }
}

function _ensureSession(data) {
  if (!data.currentSessionId) {
    data.currentSessionId = `${new Date().toISOString().split('T')[0]}_${Math.random().toString(36).slice(2, 6)}`;
    data.sessionCount += 1;
  }
  return data;
}

function _key(wordId, quizType) {
  return `${wordId}::${quizType}`;
}

export function recordAnswer(wordId, quizType, correct) {
  if (!wordId || !quizType) return;
  const data = _getStore();
  _ensureSession(data);
  const k = _key(wordId, quizType);
  if (!data.stats[k]) {
    data.stats[k] = { correct: 0, total: 0, sessions: 0, _lastSession: null };
  }
  const stat = data.stats[k];
  stat.total += 1;
  if (correct) stat.correct += 1;
  if (stat._lastSession !== data.currentSessionId) {
    stat.sessions += 1;
    stat._lastSession = data.currentSessionId;
  }
  _setStore(data);
}

export function getStats(wordId, quizType) {
  if (!wordId || !quizType) return null;
  const data = _getStore();
  const k = _key(wordId, quizType);
  const stat = data.stats[k];
  if (!stat || stat.sessions < MIN_SESSIONS_FOR_DISPLAY || stat.total < 3) {
    return null;
  }
  return {
    percent: Math.round((stat.correct / stat.total) * 100),
    total: stat.total,
    sessions: stat.sessions,
  };
}

export function endSession() {
  const data = _getStore();
  data.currentSessionId = null;
  _setStore(data);
}

export function getStatsCount() {
  const data = _getStore();
  return Object.values(data.stats).filter(
    (s) => s.sessions >= MIN_SESSIONS_FOR_DISPLAY && s.total >= 3
  ).length;
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY);
}
