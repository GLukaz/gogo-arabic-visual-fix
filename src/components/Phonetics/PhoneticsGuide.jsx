/**
 * PhoneticsGuide — Interactive Arabic Phonetics Reference Overlay
 * Phase 95 (PHON-03)
 *
 * Displays all 28 consonants + 6 vowels in an interactive grid organized
 * by articulation point. Clicking a letter plays TTS audio and shows
 * detailed phonetic information in a side panel.
 */

import { useState, useCallback } from 'react';
import { speakArabic, isArabicTtsAvailable } from '../../services/ttsService.js';
import {
  ARABIC_CONSONANTS,
  ARABIC_VOWELS,
  SOUND_CATEGORIES,
  getMinimalPairsForLetter,
} from '../../data/arabicPhonetics.js';
import styles from './PhoneticsGuide.module.css';

/** Map articulation point labels to display rows. */
const ARTICULATION_GROUPS = [
  { label: 'Bilabial', point: 'bilabial' },
  { label: 'Dental', point: 'dental' },
  { label: 'Alveolar', point: 'alveolar' },
  { label: 'Palatal', point: 'palatal' },
  { label: 'Velar', point: 'velar' },
  { label: 'Uvular', point: 'uvular' },
  { label: 'Pharyngeal', point: 'pharyngeal' },
  { label: 'Glottal', point: 'glottal' },
];

/** Get the CSS class for a consonant category. */
function getCategoryClass(category) {
  switch (category) {
    case 'emphatic':
      return styles.letterEmphatic;
    case 'pharyngeal':
      return styles.letterPharyngeal;
    case 'uvular':
      return styles.letterUvular;
    case 'glottal':
      return styles.letterGlottal;
    default:
      return styles.letterBasic;
  }
}

/** Get the category object for a consonant id from SOUND_CATEGORIES. */
function getCategoryForLetter(letterId) {
  return SOUND_CATEGORIES.find((cat) => cat.letters.includes(letterId));
}

export default function PhoneticsGuide({ isOpen, onClose, selectedLetter }) {
  const [selected, setSelected] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ttsAvailable = isArabicTtsAvailable();

  /** Play a letter's sound via TTS. */
  const playSound = useCallback(
    async (letter) => {
      if (isSpeaking) return;
      setIsSpeaking(true);
      try {
        await speakArabic(letter);
      } catch {
        // TTS failed — gracefully ignore
      } finally {
        setIsSpeaking(false);
      }
    },
    [isSpeaking]
  );

  /** Handle clicking a consonant. */
  const handleConsonantClick = useCallback(
    (consonant) => {
      setSelected({ type: 'consonant', data: consonant });
      playSound(consonant.letter);
    },
    [playSound]
  );

  /** Handle clicking a vowel. */
  const handleVowelClick = useCallback(
    (vowel) => {
      setSelected({ type: 'vowel', data: vowel });
      const textToSpeak = vowel.letter || vowel.symbol;
      playSound(textToSpeak);
    },
    [playSound]
  );

  /** Get selected item — use prop if provided and nothing manually selected. */
  const getActive = () => {
    if (selected) return selected;
    if (selectedLetter) {
      const consonant = ARABIC_CONSONANTS.find((c) => c.id === selectedLetter);
      if (consonant) return { type: 'consonant', data: consonant };
      const vowel = ARABIC_VOWELS.find((v) => v.id === selectedLetter);
      if (vowel) return { type: 'vowel', data: vowel };
    }
    return null;
  };

  const active = getActive();

  /** Render the detail panel content. */
  const renderDetail = () => {
    if (!active) {
      return <div className={styles.detailEmpty}>Click a letter to see details</div>;
    }

    const item = active.data;
    const isConsonant = active.type === 'consonant';
    const pairs = isConsonant ? getMinimalPairsForLetter(item.id) : [];
    const category = isConsonant ? getCategoryForLetter(item.id) : null;

    return (
      <>
        <div className={styles.detailLetter} dir="rtl">
          {isConsonant ? item.letter : item.letter || item.symbol}
        </div>

        <div className={styles.detailIpa}>{isConsonant ? item.ipaSymbol : item.ipaSymbol}</div>

        <div className={styles.detailName}>
          {item.name}
        </div>

        <div className={styles.detailNameArabic}>{item.nameArabic}</div>

        {/* Play button */}
        <button
          className={isSpeaking ? styles.playBtnSpeaking : styles.playBtn}
          onClick={() => playSound(isConsonant ? item.letter : item.letter || item.symbol)}
          disabled={isSpeaking || !ttsAvailable}
          aria-label={`Play ${item.name} sound`}
        >
          {'\uD83D\uDD0A'}
        </button>

        {!ttsAvailable && (
          <div className={styles.fallbackWarning} role="alert">
            Audio not available
          </div>
        )}

        {/* Articulation info */}
        {isConsonant && (
          <>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Articulation</div>
              <div className={styles.infoValue}>
                {item.articulationPoint} {item.articulationManner}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Voicing</div>
              <div className={styles.infoValue}>{item.voicing ? 'Voiced' : 'Voiceless'}</div>
            </div>
          </>
        )}

        {!isConsonant && (
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Type</div>
            <div className={styles.infoValue}>{item.type} vowel</div>
          </div>
        )}

        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>English Approximation</div>
          <div className={styles.infoValue}>{item.englishApproximation}</div>
        </div>

        <div className={styles.description}>{item.description}</div>

        {/* Category badge */}
        {category && (
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>Category</div>
            <div className={styles.infoValue}>{category.name}</div>
          </div>
        )}

        {/* Minimal pairs */}
        {pairs.length > 0 && (
          <div className={styles.pairsSection}>
            <div className={styles.pairsTitle}>Confusable Sounds</div>
            {pairs.map((pair) => {
              const other = pair.soundA.id === item.id ? pair.soundB : pair.soundA;
              return (
                <div key={pair.id} className={styles.pairRow}>
                  <span className={styles.pairLetter} dir="rtl">
                    {other.letter}
                  </span>
                  <span className={styles.pairName}>
                    {other.name} ({other.ipaSymbol})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Arabic Phonetics Guide"
    >
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close phonetics guide"
      >
        X
      </button>

      <div className={styles.content}>
        {/* Left: letter grid */}
        <div className={styles.gridPanel}>
          <div className={styles.gridTitle}>Arabic Phonetics Guide</div>

          {/* Consonant grid by articulation */}
          {ARTICULATION_GROUPS.map((group) => {
            const letters = ARABIC_CONSONANTS.filter(
              (c) => c.articulationPoint === group.point
            );
            if (letters.length === 0) return null;
            return (
              <div key={group.point}>
                <div className={styles.sectionLabel}>{group.label}</div>
                <div className={styles.gridRow}>
                  {letters.map((consonant) => {
                    const isSelected =
                      (active?.type === 'consonant' && active?.data?.id === consonant.id) ||
                      selectedLetter === consonant.id;
                    return (
                      <button
                        key={consonant.id}
                        className={`${getCategoryClass(consonant.category)}${isSelected ? ` ${styles.letterSelected}` : ''}`}
                        onClick={() => handleConsonantClick(consonant)}
                        aria-label={`${consonant.name} - ${consonant.ipaSymbol}`}
                        dir="rtl"
                      >
                        {consonant.letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Vowels */}
          <div>
            <div className={styles.sectionLabel}>Vowels</div>
            <div className={styles.gridRow}>
              {ARABIC_VOWELS.map((vowel) => {
                const isSelected =
                  active?.type === 'vowel' && active?.data?.id === vowel.id;
                return (
                  <button
                    key={vowel.id}
                    className={`${styles.vowelBtn}${isSelected ? ` ${styles.letterSelected}` : ''}`}
                    onClick={() => handleVowelClick(vowel)}
                    aria-label={`${vowel.name} - ${vowel.ipaSymbol}`}
                    dir="rtl"
                  >
                    {vowel.letter || vowel.symbol}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articulation diagram */}
          <div className={styles.diagram} aria-label="Articulation points diagram">
{`  LIPS ─── Bilabial (ب م و ف)
    |
  TEETH ── Dental (ث ذ ظ)
    |
  RIDGE ── Alveolar (ت د ن ر ل س ز ص ض ط)
    |
  PALATE ─ Palatal (ش ج ي)
    |
  VELUM ── Velar (ك)
    |
  UVULA ── Uvular (ق غ خ)
    |
  THROAT ─ Pharyngeal (ع ح)
    |
  GLOTTIS ─ Glottal (ء ه)`}
          </div>
        </div>

        {/* Right: detail panel */}
        <div className={styles.detailPanel}>{renderDetail()}</div>
      </div>
    </div>
  );
}
