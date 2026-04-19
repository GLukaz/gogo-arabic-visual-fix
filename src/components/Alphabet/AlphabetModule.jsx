import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addXP } from '../../store/slices/playerSlice.js';
import { XP_REWARDS } from '../../utils/xpCalculator.js';
import { shuffle } from '../../utils/shuffle.js';
import ArabicKeyboard from '../Keyboard/ArabicKeyboard.jsx';
import HandwritingPractice from './HandwritingPractice.jsx';
import alphabetData from '../../data/alphabet.json';
import styles from './AlphabetModule.module.css';

const { letters, groups } = alphabetData;

// Steps: intro -> forms -> vowels -> recognition -> writing
const STEPS = ['intro', 'forms', 'vowels', 'recognition', 'writing'];

export default function AlphabetModule({ onBack }) {
  const dispatch = useDispatch();
  const [completedIds, setCompletedIds] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const [step, setStep] = useState(0); // index into STEPS
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [writingInput, setWritingInput] = useState('');
  const [writingResult, setWritingResult] = useState(null);
  const [showPractice, setShowPractice] = useState(false);

  const groupedLetters = useMemo(() => {
    const map = {};
    letters.forEach((l) => {
      if (!map[l.group]) map[l.group] = [];
      map[l.group].push(l);
    });
    return map;
  }, []);

  // Generate quiz choices (must be before early returns to satisfy hook rules)
  const quizChoices = useMemo(() => {
    if (selectedGroup === null) return [];
    const gl = groupedLetters[selectedGroup] || [];
    const cl = gl[currentLetterIdx];
    if (!cl) return [];
    const sameGroup = gl.filter((l) => l.id !== cl.id);
    const otherLetters = letters.filter(
      (l) => l.group !== selectedGroup && l.id !== cl.id
    );
    const pool = [...sameGroup, ...shuffle(otherLetters)];
    const distractors = pool.slice(0, 3);
    return shuffle([...distractors, cl]);
  }, [selectedGroup, currentLetterIdx, groupedLetters]);

  // Handwriting practice mode
  if (showPractice) {
    return <HandwritingPractice onBack={() => setShowPractice(false)} />;
  }

  // Group list view
  if (selectedGroup === null) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>Back</button>
          <div className={styles.title}>Arabic Alphabet</div>
          <div className={styles.headerProgress}>
            <button
              className={styles.practiceBtn}
              onClick={() => setShowPractice(true)}
              aria-label="Open handwriting practice mode"
            >
              Practice Writing
            </button>
            {completedIds.size}/28 letters
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.groupGrid}>
            {groups.map((g) => {
              const groupLetters = groupedLetters[g.number] || [];
              const done = groupLetters.filter((l) => completedIds.has(l.id)).length;
              const total = groupLetters.length;
              const isComplete = done === total && total > 0;
              return (
                <div
                  key={g.number}
                  className={`${styles.groupCard} ${isComplete ? styles.groupCardComplete : ''}`}
                  onClick={() => {
                    setSelectedGroup(g.number);
                    setCurrentLetterIdx(0);
                    setStep(0);
                    setQuizAnswer(null);
                    setWritingInput('');
                    setWritingResult(null);
                  }}
                >
                  <div className={styles.groupName}>Group {g.number}: {g.name}</div>
                  <div className={styles.groupLetters}>
                    {groupLetters.map((l) => l.letter).join(' ')}
                  </div>
                  <div className={styles.groupProgress}>
                    <div className={styles.groupProgressFill} style={{ width: `${(done / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Letter lesson view
  const groupLettersList = groupedLetters[selectedGroup] || [];
  const currentLetter = groupLettersList[currentLetterIdx];
  if (!currentLetter) {
    setSelectedGroup(null);
    return null;
  }

  const currentStep = STEPS[step];

  const goNextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setQuizAnswer(null);
      setWritingInput('');
      setWritingResult(null);
    } else {
      // Letter complete
      if (!completedIds.has(currentLetter.id)) {
        setCompletedIds(new Set([...completedIds, currentLetter.id]));
        dispatch(addXP(XP_REWARDS.LETTER_LEARNED));
      }
      // Next letter or back to group list
      if (currentLetterIdx < groupLettersList.length - 1) {
        setCurrentLetterIdx(currentLetterIdx + 1);
        setStep(0);
        setQuizAnswer(null);
        setWritingInput('');
        setWritingResult(null);
      } else {
        setSelectedGroup(null);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => setSelectedGroup(null)}>
          Back
        </button>
        <div className={styles.title}>
          {currentLetter.name} — Group {selectedGroup}
        </div>
        <div className={styles.headerProgress}>
          {currentLetterIdx + 1}/{groupLettersList.length}
        </div>
      </div>

      {/* Step dots */}
      <div className={styles.stepDots}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`}
          />
        ))}
      </div>

      <div className={styles.body}>
        {/* Step 1: Introduction */}
        {currentStep === 'intro' && (
          <>
            <div className={styles.bigLetter}>{currentLetter.letter}</div>
            <div className={styles.letterName}>
              {currentLetter.name} — &ldquo;{currentLetter.transliteration}&rdquo;
            </div>
            <button className={styles.nextBtn} onClick={goNextStep}>
              Next: Four Forms
            </button>
          </>
        )}

        {/* Step 2: Four Forms */}
        {currentStep === 'forms' && (
          <>
            <div className={styles.sectionTitle}>
              Four Forms of {currentLetter.name}
            </div>
            <div className={styles.formsRow}>
              {['isolated', 'initial', 'medial', 'final'].map((form) => (
                <div key={form} className={styles.formBox}>
                  <div className={styles.formLabel}>{form}</div>
                  <div className={styles.formLetter}>{currentLetter.forms[form]}</div>
                </div>
              ))}
            </div>
            <button className={styles.nextBtn} onClick={goNextStep}>
              Next: Vowel Sounds
            </button>
          </>
        )}

        {/* Step 3: Vowel Sounds */}
        {currentStep === 'vowels' && (
          <>
            <div className={styles.sectionTitle}>
              {currentLetter.name} with Vowels
            </div>
            <div className={styles.vowelRow}>
              {currentLetter.vowelCombinations.map((vc) => (
                <div key={vc.vowel} className={styles.vowelBox}>
                  <div className={styles.vowelArabic}>{vc.arabic}</div>
                  <div className={styles.vowelSound}>{vc.sound}</div>
                  <div className={styles.vowelLabel}>{vc.vowel}</div>
                </div>
              ))}
            </div>
            <button className={styles.nextBtn} onClick={goNextStep}>
              Next: Recognition Quiz
            </button>
          </>
        )}

        {/* Step 4: Recognition Quiz */}
        {currentStep === 'recognition' && (
          <>
            <div className={styles.quizPrompt}>
              Find the letter &ldquo;{currentLetter.name}&rdquo; ({currentLetter.transliteration})
            </div>
            <div className={styles.quizChoices}>
              {quizChoices.map((l) => {
                let extra = '';
                if (quizAnswer) {
                  if (l.id === currentLetter.id) extra = styles.quizCorrect;
                  else if (l.id === quizAnswer && l.id !== currentLetter.id) extra = styles.quizWrong;
                }
                return (
                  <button
                    key={l.id}
                    className={`${styles.quizChoice} ${extra}`}
                    onClick={() => {
                      if (!quizAnswer) setQuizAnswer(l.id);
                    }}
                    disabled={!!quizAnswer}
                  >
                    {l.letter}
                  </button>
                );
              })}
            </div>
            {quizAnswer && (
              <button className={styles.nextBtn} onClick={goNextStep}>
                Next: Writing Quiz
              </button>
            )}
          </>
        )}

        {/* Step 5: Writing Quiz */}
        {currentStep === 'writing' && (
          <>
            <div className={styles.quizPrompt}>
              Type the letter &ldquo;{currentLetter.name}&rdquo; ({currentLetter.transliteration})
            </div>
            <div className={`${styles.writingDisplay} ${
              writingResult === null
                ? ''
                : writingResult
                  ? styles.writingCorrectBorder
                  : styles.writingWrongBorder
            }`}>
              {writingInput || '\u200B'}
            </div>
            {writingResult !== null && !writingResult && (
              <div className={styles.writingError}>
                Correct answer: {currentLetter.letter}
              </div>
            )}
            {writingResult === null ? (
              <ArabicKeyboard
                onKeyPress={(k) => setWritingInput(writingInput + k)}
                onBackspace={() => setWritingInput(writingInput.slice(0, -1))}
                onSubmit={() => {
                  const correct = writingInput.trim() === currentLetter.letter;
                  setWritingResult(correct);
                }}
                highlightedKeys={[]}
              />
            ) : (
              <button className={styles.nextBtn} onClick={goNextStep}>
                {currentLetterIdx < groupLettersList.length - 1 ? 'Next Letter' : 'Complete Group'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
