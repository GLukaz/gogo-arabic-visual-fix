/**
 * GrammarComboInput.jsx — Multi-step Arabic grammar input for combat combos.
 *
 * Three modes:
 * - noun_adj: 2 side-by-side RTL fields (noun + adjective)
 * - verb_chain: sequential verb form entry with chain progress display
 * - sentence: 3 labeled fields (subject/verb/object) for full sentence construction
 *
 * Each mode has its own timer, accuracy calculation, and damage multiplier.
 * Props: { comboType, template, onSubmit, onCancel }
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GrammarComboInput.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Timer durations per combo type (ms)
const TIMER_DURATIONS = {
  noun_adj: 20000,
  verb_chain: 30000,
  sentence: 45000,
};

/**
 * Strip Arabic diacritics for comparison.
 */
function normalize(s) {
  return (s || '').replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

/**
 * Simple Levenshtein distance for partial credit.
 */
function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Calculate accuracy of input vs target Arabic string.
 * Returns 0-1 float. Strips diacritics for comparison.
 */
function calculateFieldAccuracy(input, target) {
  if (!input || !target) return 0;
  const normInput = normalize(input);
  const normTarget = normalize(target);
  if (normInput === normTarget) return 1.0;
  const maxLen = Math.max(normInput.length, normTarget.length);
  if (maxLen === 0) return 0;
  const dist = levenshtein(normInput, normTarget);
  return Math.max(0, 1 - dist / maxLen);
}

// ── Noun + Adjective Mode ──────────────────────────────────

function NounAdjMode({ template, onFieldSubmit }) {
  const [noun, setNoun] = useState('');
  const [adj, setAdj] = useState('');
  const nounRef = useRef(null);
  const adjRef = useRef(null);

  useEffect(() => {
    nounRef.current?.focus();
  }, []);

  const handleNounKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      adjRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    const nounAcc = calculateFieldAccuracy(noun, template.noun?.arabic);
    const adjAcc = calculateFieldAccuracy(adj, template.adjective?.arabic);
    const accuracy = (nounAcc + adjAcc) / 2;
    const multiplier = accuracy >= 0.8 ? template.damageMultiplier : 1.0 + (template.damageMultiplier - 1.0) * accuracy;
    onFieldSubmit({
      arabicInput: `${noun} ${adj}`.trim(),
      accuracy,
      damageMultiplier: multiplier,
    });
  };

  return (
    <>
      <p className={styles.hintText}>
        {template.combined?.english || `${template.noun?.english} + ${template.adjective?.english}`}
      </p>
      <div className={styles.nounAdjFields}>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>اسم</span>
          <input
            ref={nounRef}
            type="text"
            className={styles.inputField}
            value={noun}
            onChange={(e) => setNoun(e.target.value)}
            onKeyDown={handleNounKeyDown}
            placeholder={template.noun?.english || 'noun'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
        </div>
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>صفة</span>
          <input
            ref={adjRef}
            type="text"
            className={styles.inputField}
            value={adj}
            onChange={(e) => setAdj(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder={template.adjective?.english || 'adjective'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
        </div>
      </div>
      <div className={styles.buttonRow}>
        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!noun && !adj}>
          تنفيذ
        </button>
      </div>
    </>
  );
}

// ── Verb Chain Mode ──────────────────────────────────

function VerbChainMode({ template, onFieldSubmit }) {
  const [chain, setChain] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chain.length]);

  const currentFormIndex = chain.length;
  const forms = template.forms || [];
  const currentForm = forms[currentFormIndex];
  const isComplete = currentFormIndex >= forms.length;

  const handleSubmitForm = useCallback(() => {
    if (!currentForm || isComplete) return;

    const acc = calculateFieldAccuracy(currentInput, currentForm.arabic);
    const newChain = [...chain, { input: currentInput, accuracy: acc, form: currentForm }];
    setChain(newChain);
    setCurrentInput('');

    // If chain is now complete, submit results
    if (newChain.length >= forms.length) {
      const totalAccuracy = newChain.reduce((sum, link) => sum + link.accuracy, 0) / newChain.length;
      const cumulativeMultiplier = newChain.reduce((mult, link) => {
        return mult * (link.accuracy >= 0.8 ? link.form.damageMultiplier : 1.0);
      }, 1.0);
      onFieldSubmit({
        arabicInput: newChain.map((l) => l.input).join(' '),
        accuracy: totalAccuracy,
        damageMultiplier: cumulativeMultiplier,
      });
    }
  }, [currentInput, currentForm, isComplete, chain, forms, onFieldSubmit]);

  return (
    <>
      <p className={styles.rootDisplay} lang="ar">
        {'جذر: '}{template.root?.arabic || ''}
      </p>

      {/* Chain progress display */}
      <div className={styles.chainProgress}>
        {forms.map((form, idx) => (
          <span key={form.formNumber}>
            {idx > 0 && <span className={styles.chainArrow}>{' \u2190 '}</span>}
            <span className={`${styles.chainLink} ${idx >= chain.length ? styles.pending : ''}`}>
              {idx < chain.length ? chain[idx].input : `Form ${form.formNumber}`}
            </span>
          </span>
        ))}
      </div>

      {!isComplete && currentForm && (
        <>
          <p className={styles.formHint}>
            Form {currentForm.formNumber}: {currentForm.english}
          </p>
          <input
            ref={inputRef}
            type="text"
            className={styles.inputField}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitForm(); }}
            placeholder={currentForm.english || '...'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
          <div className={styles.buttonRow}>
            <button
              className={styles.submitBtn}
              onClick={handleSubmitForm}
              disabled={!currentInput}
            >
              {currentFormIndex < forms.length - 1 ? 'التالي' : 'تنفيذ'}
            </button>
          </div>
        </>
      )}
    </>
  );
}

// ── Sentence Mode ──────────────────────────────────

function SentenceMode({ template, onFieldSubmit }) {
  const [fields, setFields] = useState({ verb: '', subject: '', object: '' });
  const verbRef = useRef(null);
  const subjectRef = useRef(null);
  const objectRef = useRef(null);

  useEffect(() => {
    // Arabic sentence order: VSO — focus verb first
    verbRef.current?.focus();
  }, []);

  const slots = useMemo(() => template.slots || [], [template]);

  const getSlotData = (role) => slots.find((s) => s.role === role);

  const handleFieldChange = (role, value) => {
    setFields((prev) => ({ ...prev, [role]: value }));
  };

  const handleSubmit = () => {
    let totalAccuracy = 0;
    let correctSlots = 0;

    for (const slot of slots) {
      const input = fields[slot.role] || '';
      // Check primary answer and alternatives
      let bestAcc = calculateFieldAccuracy(input, slot.arabic);
      if (slot.alternatives) {
        for (const alt of slot.alternatives) {
          const altAcc = calculateFieldAccuracy(input, alt.arabic);
          if (altAcc > bestAcc) bestAcc = altAcc;
        }
      }
      totalAccuracy += bestAcc;
      if (bestAcc >= 0.8) correctSlots++;
    }

    const accuracy = slots.length > 0 ? totalAccuracy / slots.length : 0;
    // Full accuracy (3/3 correct) = ultimate multiplier, partial = scaled
    const multiplier = correctSlots === slots.length
      ? template.damageMultiplier
      : 1.0 + (template.damageMultiplier - 1.0) * (correctSlots / Math.max(1, slots.length));

    onFieldSubmit({
      arabicInput: `${fields.verb} ${fields.subject} ${fields.object}`.trim(),
      accuracy,
      damageMultiplier: multiplier,
    });
  };

  const verbSlot = getSlotData('verb');
  const subjectSlot = getSlotData('subject');
  const objectSlot = getSlotData('object');

  return (
    <>
      <p className={styles.sentenceTemplate} lang="ar">
        {template.template?.arabic || ''}
      </p>
      <p className={styles.hintText}>
        {template.template?.english || ''}
      </p>

      <div className={styles.sentenceSlots}>
        {/* VSO order: Verb, Subject, Object */}
        <div className={styles.slotGroup}>
          <span className={styles.slotLabel} lang="ar">فعل</span>
          <input
            ref={verbRef}
            type="text"
            className={styles.inputField}
            value={fields.verb}
            onChange={(e) => handleFieldChange('verb', e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); subjectRef.current?.focus(); } }}
            placeholder={verbSlot?.english || 'verb'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
          <span className={styles.slotHint}>{verbSlot?.english || ''}</span>
        </div>
        <div className={styles.slotGroup}>
          <span className={styles.slotLabel} lang="ar">فاعل</span>
          <input
            ref={subjectRef}
            type="text"
            className={styles.inputField}
            value={fields.subject}
            onChange={(e) => handleFieldChange('subject', e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Tab' || e.key === 'Enter') { e.preventDefault(); objectRef.current?.focus(); } }}
            placeholder={subjectSlot?.english || 'subject'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
          <span className={styles.slotHint}>{subjectSlot?.english || ''}</span>
        </div>
        <div className={styles.slotGroup}>
          <span className={styles.slotLabel} lang="ar">مفعول به</span>
          <input
            ref={objectRef}
            type="text"
            className={styles.inputField}
            value={fields.object}
            onChange={(e) => handleFieldChange('object', e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            placeholder={objectSlot?.english || 'object'}
            dir="rtl"
            autoComplete="off"
            lang="ar"
          />
          <span className={styles.slotHint}>{objectSlot?.english || ''}</span>
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          تنفيذ
        </button>
      </div>
    </>
  );
}

// ── Main GrammarComboInput Component ──────────────────────────────────

const COMBO_LABELS = {
  noun_adj: { arabic: 'إضافة', english: 'Noun + Adjective Combo' },
  verb_chain: { arabic: 'سلسلة أفعال', english: 'Verb Chain Combo' },
  sentence: { arabic: 'جملة كاملة', english: 'Full Sentence Attack' },
};

export default function GrammarComboInput({ comboType, template, onSubmit, onCancel }) {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATIONS[comboType] || 20000);
  const submittedRef = useRef(false);
  const timerDuration = TIMER_DURATIONS[comboType] || 20000;

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          clearInterval(interval);
          if (!submittedRef.current) {
            submittedRef.current = true;
            onSubmit?.({
              arabicInput: '',
              accuracy: 0,
              damageMultiplier: 1.0,
              comboType,
            });
          }
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [comboType, onSubmit]);

  // ESC to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleFieldSubmit = useCallback(
    (result) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      onSubmit?.({
        ...result,
        comboType,
      });
    },
    [comboType, onSubmit]
  );

  if (!template) return null;

  const timerPercent = (timeRemaining / timerDuration) * 100;
  const timerColor = timerPercent > 50 ? '#44CC44' : timerPercent > 25 ? '#CCCC44' : '#CC4444';
  const label = COMBO_LABELS[comboType] || COMBO_LABELS.noun_adj;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.comboContainer}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: reduceMotion ? 0.1 : 0.15 }}
      >
        {/* Timer bar */}
        <div className={styles.timerBar}>
          <div
            className={styles.timerFill}
            style={{
              width: `${timerPercent}%`,
              '--timer-color': timerColor,
            }}
          />
        </div>

        {/* Combo label */}
        <p className={styles.comboLabel} lang="ar">{label.arabic}</p>
        <p className={styles.comboSubLabel}>{label.english}</p>

        {/* Mode-specific input */}
        {comboType === 'noun_adj' && (
          <NounAdjMode template={template} onFieldSubmit={handleFieldSubmit} />
        )}
        {comboType === 'verb_chain' && (
          <VerbChainMode template={template} onFieldSubmit={handleFieldSubmit} />
        )}
        {comboType === 'sentence' && (
          <SentenceMode template={template} onFieldSubmit={handleFieldSubmit} />
        )}

        {/* Cancel button */}
        <div className={`${styles.buttonRow} ${styles.buttonRowCancel}`}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            ESC
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
