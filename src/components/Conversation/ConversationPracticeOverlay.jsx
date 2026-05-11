/**
 * ConversationPracticeOverlay — Full conversation practice interface.
 *
 * Three views:
 *   1. Browse: Scenarios grouped by zone, filtered by CEFR, showing completion
 *   2. Active: Chat-style exchange with word bank sentence building
 *   3. Complete: Score summary, XP earned, retry/next options
 *
 * Props:
 *   onClose: () => void  — close the overlay
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import WordBank from './WordBank.jsx';
import {
  conversationScenarios,
  ZONES,
  ZONE_LABELS,
  CEFR_LEVELS,
  getScenarioById,
  getScenariosForZone,
} from '../../data/conversationScenarios.js';
import {
  startScenario,
  submitResponse,
  completeScenario,
  resetCurrent,
  scoreResponse,
  selectCompletedScenarios,
  selectConversationStats,
  selectCurrentScenarioId,
  selectCurrentExchangeIndex,
  selectSessionScore,
  selectExchangeScores,
} from '../../store/slices/conversationSlice.js';
import styles from './ConversationPracticeOverlay.module.css';

// ── BROWSE VIEW ─────────────────────────────────────────────

function BrowseView({ onSelectScenario, onClose }) {
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const [cefrFilter, setCefrFilter] = useState(null);
  const completed = useSelector(selectCompletedScenarios);
  const stats = useSelector(selectConversationStats);

  const filteredScenarios = useMemo(() => {
    let scenarios = getScenariosForZone(selectedZone);
    if (cefrFilter) {
      scenarios = scenarios.filter((s) => s.cefrLevel === cefrFilter);
    }
    return scenarios;
  }, [selectedZone, cefrFilter]);

  const getCefrColor = (level) => {
    switch (level) {
      case 'A1': return '#2ecc71';
      case 'A2': return '#3498db';
      case 'B1': return '#f39c12';
      case 'B2': return '#e74c3c';
      default: return '#999';
    }
  };

  return (
    <div className={styles.browseView}>
      <div className={styles.browseHeader}>
        <button className={styles.closeBtn} onClick={onClose} type="button">
          ✕
        </button>
        <h2 className={styles.browseTitle}>مُحادَثات — Conversations</h2>
        <div className={styles.statsRow}>
          <span className={styles.statBadge}>
            {stats.totalCompleted} / {conversationScenarios.length} completed
          </span>
          <span className={styles.statBadge}>
            Avg: {stats.averageScore || 0}%
          </span>
        </div>
      </div>

      {/* Zone Tabs */}
      <div className={styles.zoneTabs}>
        {ZONES.map((zone) => (
          <button
            key={zone}
            className={`${styles.zoneTab} ${selectedZone === zone ? styles.zoneTabActive : ''}`}
            onClick={() => setSelectedZone(zone)}
            type="button"
          >
            {ZONE_LABELS[zone]?.english || zone}
          </button>
        ))}
      </div>

      {/* CEFR Filter */}
      <div className={styles.cefrFilter}>
        <button
          className={`${styles.cefrBtn} ${cefrFilter === null ? styles.cefrBtnActive : ''}`}
          onClick={() => setCefrFilter(null)}
          type="button"
        >
          All
        </button>
        {CEFR_LEVELS.map((level) => (
          <button
            key={level}
            className={`${styles.cefrBtn} ${cefrFilter === level ? styles.cefrBtnActive : ''}`}
            onClick={() => setCefrFilter(level)}
            style={{ borderColor: getCefrColor(level) }}
            type="button"
          >
            {level}
          </button>
        ))}
      </div>

      {/* Scenario List */}
      <div className={styles.scenarioList}>
        {filteredScenarios.map((scenario) => {
          const record = completed[scenario.id];
          return (
            <button
              key={scenario.id}
              className={`${styles.scenarioCard} ${record ? styles.scenarioCompleted : ''}`}
              onClick={() => onSelectScenario(scenario.id)}
              type="button"
            >
              <div className={styles.scenarioCardHeader}>
                <span
                  className={styles.cefrTag}
                  style={{ background: getCefrColor(scenario.cefrLevel) }}
                >
                  {scenario.cefrLevel}
                </span>
                <span className={styles.scenarioTitle}>{scenario.title}</span>
                {record && (
                  <span className={styles.scoreTag}>{record.score}%</span>
                )}
              </div>
              <div className={styles.scenarioCardBody}>
                <span className={styles.scenarioArabicTitle}>
                  {scenario.titleArabic}
                </span>
                <span className={styles.scenarioContext}>
                  {scenario.context}
                </span>
                <span className={styles.scenarioNpc}>
                  NPC: {scenario.npcName} — {scenario.exchanges.length} exchanges
                </span>
              </div>
              {record && (
                <div className={styles.scenarioCardFooter}>
                  <span>Attempts: {record.attempts}</span>
                  <span>XP: {scenario.xpReward}</span>
                </div>
              )}
            </button>
          );
        })}
        {filteredScenarios.length === 0 && (
          <div className={styles.emptyState}>
            No scenarios match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

// ── ACTIVE CONVERSATION VIEW ────────────────────────────────

function ActiveView({ scenarioId, onComplete, onBack }) {
  const dispatch = useDispatch();
  const currentIndex = useSelector(selectCurrentExchangeIndex);
  const sessionScore = useSelector(selectSessionScore);
  const _exchangeScores = useSelector(selectExchangeScores);
  const scenario = useMemo(() => getScenarioById(scenarioId), [scenarioId]);
  const chatEndRef = useRef(null);

  const [selectedWords, setSelectedWords] = useState([]);
  const [feedback, setFeedback] = useState(null); // { score, correct }
  const [showHint, setShowHint] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const currentExchange = scenario?.exchanges[currentIndex] || null;
  const isLastExchange = currentIndex >= (scenario?.exchanges.length || 0);

  // Scroll chat to bottom when chat history changes
  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === 'function') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, feedback]);

  // Add NPC line to chat when exchange changes
  useEffect(() => {
    if (currentExchange) {
      setChatHistory((prev) => {
        // Avoid duplicate NPC lines
        const lastMsg = prev[prev.length - 1];
        if (
          lastMsg?.type === 'npc' &&
          lastMsg?.arabic === currentExchange.npcLine.arabic
        ) {
          return prev;
        }
        return [
          ...prev,
          {
            type: 'npc',
            arabic: currentExchange.npcLine.arabic,
            english: currentExchange.npcLine.english,
            transliteration: currentExchange.npcLine.transliteration,
          },
        ];
      });
    }
  }, [currentIndex, currentExchange]);

  const handleSelectWord = useCallback(
    (word) => {
      if (feedback) return;
      setSelectedWords((prev) => [...prev, word]);
    },
    [feedback]
  );

  const handleRemoveWord = useCallback(
    (index) => {
      if (feedback) return;
      setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    },
    [feedback]
  );

  const handleSubmit = useCallback(() => {
    if (!currentExchange || selectedWords.length === 0) return;

    const score = scoreResponse(
      selectedWords,
      currentExchange.playerResponse.correctArabic
    );

    // Add player message to chat
    setChatHistory((prev) => [
      ...prev,
      {
        type: 'player',
        arabic: selectedWords.join(' '),
        english: currentExchange.playerResponse.correctEnglish,
        score,
      },
    ]);

    setFeedback({
      score,
      correct: currentExchange.playerResponse.correctArabic,
      english: currentExchange.playerResponse.correctEnglish,
    });

    dispatch(submitResponse({ score }));
  }, [currentExchange, selectedWords, dispatch]);

  const handleNext = useCallback(() => {
    setSelectedWords([]);
    setFeedback(null);
    setShowHint(false);

    if (currentIndex >= scenario.exchanges.length) {
      // All exchanges done
      onComplete(sessionScore);
    }
  }, [currentIndex, scenario, sessionScore, onComplete]);

  const handleBack = useCallback(() => {
    dispatch(resetCurrent());
    onBack();
  }, [dispatch, onBack]);

  if (!scenario) {
    return (
      <div className={styles.activeView}>
        <p>Scenario not found.</p>
        <button onClick={onBack} type="button">Back</button>
      </div>
    );
  }

  // Completed all exchanges — show final
  if (isLastExchange && !feedback) {
    onComplete(sessionScore);
    return null;
  }

  return (
    <div className={styles.activeView}>
      {/* Header */}
      <div className={styles.activeHeader}>
        <button className={styles.backBtn} onClick={handleBack} type="button">
          ← Back
        </button>
        <div className={styles.activeHeaderCenter}>
          <span className={styles.scenarioLabel}>{scenario.title}</span>
          <span className={styles.exchangeCounter}>
            {currentIndex + 1} / {scenario.exchanges.length}
          </span>
        </div>
        <div className={styles.sessionScoreDisplay}>
          {sessionScore}%
        </div>
      </div>

      {/* Context */}
      <div className={styles.contextBar}>
        <p className={styles.contextText}>{scenario.context}</p>
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.chatBubble} ${
              msg.type === 'npc' ? styles.npcBubble : styles.playerBubble
            } ${msg.score !== undefined ? (msg.score === 100 ? styles.correctBubble : msg.score >= 75 ? styles.partialBubble : styles.wrongBubble) : ''}`}
          >
            {msg.type === 'npc' && (
              <span className={styles.bubbleSender}>{scenario.npcName}</span>
            )}
            <span className={styles.bubbleArabic}>{msg.arabic}</span>
            <span className={styles.bubbleEnglish}>{msg.english}</span>
            {msg.type === 'npc' && msg.transliteration && (
              <span className={styles.bubbleTranslit}>
                {msg.transliteration}
              </span>
            )}
            {msg.score !== undefined && (
              <span className={styles.bubbleScore}>{msg.score}%</span>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Word Bank + Controls */}
      {currentExchange && !isLastExchange && (
        <div className={styles.interactionArea}>
          <WordBank
            words={currentExchange.playerResponse.wordBank}
            selectedWords={selectedWords}
            onSelectWord={handleSelectWord}
            onRemoveWord={handleRemoveWord}
            disabled={!!feedback}
            showCorrect={feedback?.score === 100}
          />

          <div className={styles.controlRow}>
            {!feedback ? (
              <>
                <button
                  className={styles.hintBtn}
                  onClick={() => setShowHint(!showHint)}
                  type="button"
                >
                  {showHint ? 'Hide Hint' : 'Grammar Hint'}
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={selectedWords.length === 0}
                  type="button"
                >
                  Submit
                </button>
              </>
            ) : (
              <div className={styles.feedbackArea}>
                <div className={styles.feedbackScore}>
                  {feedback.score === 100
                    ? 'Perfect!'
                    : feedback.score >= 75
                      ? 'Almost!'
                      : feedback.score >= 50
                        ? 'Keep trying!'
                        : 'Good effort!'}
                  <span className={styles.feedbackPercent}>
                    {feedback.score}%
                  </span>
                </div>
                {feedback.score < 100 && (
                  <div className={styles.correctAnswer}>
                    <span className={styles.correctLabel}>Correct:</span>
                    <span className={styles.correctArabic}>
                      {feedback.correct}
                    </span>
                    <span className={styles.correctEnglish}>
                      {feedback.english}
                    </span>
                  </div>
                )}
                <button
                  className={styles.nextBtn}
                  onClick={handleNext}
                  type="button"
                >
                  {currentIndex >= scenario.exchanges.length - 1
                    ? 'See Results'
                    : 'Next →'}
                </button>
              </div>
            )}
          </div>

          {showHint && !feedback && (
            <div className={styles.hintBox}>
              {currentExchange.playerResponse.grammarHint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── COMPLETE VIEW ───────────────────────────────────────────

function CompleteView({ scenarioId, finalScore, onRetry, onNext, onBrowse }) {
  const scenario = useMemo(() => getScenarioById(scenarioId), [scenarioId]);
  const completed = useSelector(selectCompletedScenarios);
  const record = completed[scenarioId];

  if (!scenario) return null;

  const getGrade = (score) => {
    if (score >= 90) return { label: 'Excellent', emoji: 'A+' };
    if (score >= 75) return { label: 'Good', emoji: 'B+' };
    if (score >= 50) return { label: 'Okay', emoji: 'C' };
    return { label: 'Keep Practicing', emoji: 'D' };
  };

  const grade = getGrade(finalScore);

  // Find next scenario in same zone
  const zoneScenarios = getScenariosForZone(scenario.zone);
  const currentIdx = zoneScenarios.findIndex((s) => s.id === scenarioId);
  const nextScenario =
    currentIdx >= 0 && currentIdx < zoneScenarios.length - 1
      ? zoneScenarios[currentIdx + 1]
      : null;

  return (
    <div className={styles.completeView}>
      <div className={styles.completeCard}>
        <h2 className={styles.completeTitle}>Conversation Complete!</h2>
        <p className={styles.completeScenarioName}>
          {scenario.title} — {scenario.titleArabic}
        </p>

        <div className={styles.scoreCircle}>
          <span className={styles.scoreGrade}>{grade.emoji}</span>
          <span className={styles.scorePercent}>{finalScore}%</span>
          <span className={styles.scoreLabel}>{grade.label}</span>
        </div>

        <div className={styles.completeDetails}>
          <div className={styles.detailRow}>
            <span>XP Earned</span>
            <span className={styles.xpValue}>
              +{Math.round((scenario.xpReward * finalScore) / 100)} XP
            </span>
          </div>
          <div className={styles.detailRow}>
            <span>Exchanges</span>
            <span>{scenario.exchanges.length}</span>
          </div>
          <div className={styles.detailRow}>
            <span>Attempts</span>
            <span>{record?.attempts || 1}</span>
          </div>
          <div className={styles.detailRow}>
            <span>Best Score</span>
            <span>{record?.score || finalScore}%</span>
          </div>
        </div>

        <div className={styles.vocabUsed}>
          <h3 className={styles.vocabTitle}>Vocabulary Practiced</h3>
          <div className={styles.vocabList}>
            {scenario.vocabularyUsed.map((v) => (
              <span key={v} className={styles.vocabChip}>
                {v}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.completeActions}>
          <button
            className={styles.retryBtn}
            onClick={() => onRetry(scenarioId)}
            type="button"
          >
            Retry
          </button>
          {nextScenario && (
            <button
              className={styles.nextScenarioBtn}
              onClick={() => onNext(nextScenario.id)}
              type="button"
            >
              Next: {nextScenario.title}
            </button>
          )}
          <button
            className={styles.browseBtn}
            onClick={onBrowse}
            type="button"
          >
            All Scenarios
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN OVERLAY ────────────────────────────────────────────

function ConversationPracticeOverlay({ onClose }) {
  const dispatch = useDispatch();
  const _currentScenarioId = useSelector(selectCurrentScenarioId);

  const [view, setView] = useState('browse'); // 'browse' | 'active' | 'complete'
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  const [finalScore, setFinalScore] = useState(0);

  const handleSelectScenario = useCallback(
    (scenarioId) => {
      dispatch(startScenario(scenarioId));
      setActiveScenarioId(scenarioId);
      setView('active');
    },
    [dispatch]
  );

  const handleComplete = useCallback(
    (score) => {
      if (activeScenarioId) {
        dispatch(
          completeScenario({ scenarioId: activeScenarioId, score })
        );
        setFinalScore(score);
        setView('complete');
      }
    },
    [activeScenarioId, dispatch]
  );

  const handleRetry = useCallback(
    (scenarioId) => {
      dispatch(startScenario(scenarioId));
      setActiveScenarioId(scenarioId);
      setView('active');
    },
    [dispatch]
  );

  const handleNext = useCallback(
    (scenarioId) => {
      dispatch(startScenario(scenarioId));
      setActiveScenarioId(scenarioId);
      setView('active');
    },
    [dispatch]
  );

  const handleBrowse = useCallback(() => {
    dispatch(resetCurrent());
    setView('browse');
  }, [dispatch]);

  return (
    <div className={styles.overlay} data-testid="conversation-overlay">
      <div className={styles.overlayContent}>
        {view === 'browse' && (
          <BrowseView
            onSelectScenario={handleSelectScenario}
            onClose={onClose}
          />
        )}
        {view === 'active' && activeScenarioId && (
          <ActiveView
            scenarioId={activeScenarioId}
            onComplete={handleComplete}
            onBack={handleBrowse}
          />
        )}
        {view === 'complete' && activeScenarioId && (
          <CompleteView
            scenarioId={activeScenarioId}
            finalScore={finalScore}
            onRetry={handleRetry}
            onNext={handleNext}
            onBrowse={handleBrowse}
          />
        )}
      </div>
    </div>
  );
}

export default ConversationPracticeOverlay;
