import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import { selectFsrsCards } from '../../store/slices/vocabularySlice.js';
import { filterDialogueForPlayer } from '../../services/npcVocabFilter.js';
import vocabulary from '../../data/vocabularyAll.js';
import VocabularyHighlight from './VocabularyHighlight.jsx';
import FilteredArabicLine from './FilteredArabicLine.jsx';
import RelationshipIndicator from './RelationshipIndicator.jsx';
import { EventBus } from '../../utils/eventBus.js';
import styles from './DialogueOverlay.module.css';

const moodToEmoji = (mood) => {
  const map = { cheerful: '😊', serious: '🤔', worried: '😟', excited: '🤩', angry: '😠', sad: '😢', neutral: '😐' };
  return map[mood] || '😐';
};

/**
 * Renders Arabic text with vocabulary highlights (only after typewriter completes).
 * Replaces matching arabicText segments with VocabularyHighlight components.
 */
function renderArabicWithHighlights(arabicText, inlineVocab) {
  if (!inlineVocab || inlineVocab.length === 0) return arabicText;

  const sorted = inlineVocab
    .map((v) => ({ ...v, idx: arabicText.indexOf(v.arabicText) }))
    .filter((v) => v.idx >= 0)
    .sort((a, b) => a.idx - b.idx);

  if (sorted.length === 0) return arabicText;

  const parts = [];
  let lastIndex = 0;

  sorted.forEach((v) => {
    if (v.idx > lastIndex) {
      parts.push(arabicText.slice(lastIndex, v.idx));
    }
    parts.push(
      <VocabularyHighlight key={v.wordId} wordId={v.wordId} arabicText={v.arabicText}>
        {v.arabicText}
      </VocabularyHighlight>
    );
    lastIndex = v.idx + v.arabicText.length;
  });

  if (lastIndex < arabicText.length) {
    parts.push(arabicText.slice(lastIndex));
  }

  return parts;
}

/**
 * DialogueBox
 * The dialogue bubble UI showing speaker name, Arabic text, English text, and continue prompt
 * Now features typewriter effect for dialogue text and inline vocabulary highlighting
 */
export default function DialogueBox({ npc, line, onAdvance, portrait, teachWordCard, isHubAndSpoke, relationshipLevel }) {
  const settings = useSelector((s) => s.settings);
  const fsrsCards = useSelector(selectFsrsCards);
  const formatArabic = useFormatArabic();

  // Compute known word IDs from FSRS cards
  const knownWordIds = useMemo(() => new Set(Object.keys(fsrsCards)), [fsrsCards]);

  // Apply vocab filter to annotate known/unknown words in the Arabic line
  const filteredLine = useMemo(
    () => filterDialogueForPlayer(line, knownWordIds, vocabulary),
    [line, knownWordIds]
  );

  const isPlayerSpeaking = line.speaker === 'player';
  const speakerName = isPlayerSpeaking ? 'You' : npc.name;

  // Typewriter effect for Arabic text (respects harakat toggle)
  const arabicTypewriter = useTypewriter(formatArabic(line.arabic), 30);
  // Typewriter effect for English text (starts after Arabic completes)
  const englishTypewriter = useTypewriter(
    arabicTypewriter.isComplete ? line.english : '',
    25
  );
  // Typewriter effect for transliteration (starts after English completes)
  const translitTypewriter = useTypewriter(
    englishTypewriter.isComplete ? line.transliteration : '',
    20
  );

  // Determine if all text is fully revealed
  const allComplete =
    arabicTypewriter.isComplete &&
    (!line.english || englishTypewriter.isComplete) &&
    (!line.transliteration || !settings?.showTransliteration || translitTypewriter.isComplete);

  // Guard ref to ensure we emit cultural note event only once per line reveal
  const culturalNoteEmittedRef = useRef(false);

  useEffect(() => {
    // Reset guard when line changes
    culturalNoteEmittedRef.current = false;
  }, [line]);

  useEffect(() => {
    if (allComplete && line?.culturalNote && !culturalNoteEmittedRef.current) {
      culturalNoteEmittedRef.current = true;
      EventBus.emit('dialogue:cultural_note_shown', {
        npcId: npc?.id || 'unknown',
        lineKey: line.culturalNote.slice(0, 30).replace(/\s+/g, '_'),
      });
    }
  }, [allComplete, line, npc]);

  // Handle advance - first skip typing, then advance to next line
  const handleAdvance = () => {
    if (!allComplete) {
      // Skip all typing animations
      arabicTypewriter.skip();
      englishTypewriter.skip();
      translitTypewriter.skip();
    } else {
      // All text revealed, advance to next line
      onAdvance();
    }
  };

  return (
    <div
      className={styles.dialogueBox}
      onClick={handleAdvance}
      role="button"
      tabIndex={0}
      aria-label={allComplete ? 'Continue dialogue' : 'Skip typing animation'}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleAdvance();
        }
      }}
    >
      {/* Portrait */}
      {portrait}
      <div className={styles.content}>
        {/* NPC Header with mood + relationship for hub-and-spoke NPCs */}
        {isHubAndSpoke && !isPlayerSpeaking && (
          <div className={styles.npcHeader}>
            <div className={styles.speakerName} role="heading" aria-level="2">
              {speakerName}
            </div>
            {npc.personality?.mood && (
              <span className={styles.npcMood} aria-label={`NPC mood: ${npc.personality.mood}`}>
                {moodToEmoji(npc.personality.mood)}
              </span>
            )}
          </div>
        )}
        {isHubAndSpoke && !isPlayerSpeaking && (
          <RelationshipIndicator npcId={npc.id} level={relationshipLevel} />
        )}
        {/* Standard speaker name for legacy NPCs or player */}
        {(!isHubAndSpoke || isPlayerSpeaking) && (
          <div className={styles.speakerName} role="heading" aria-level="2">
            {speakerName}
          </div>
        )}
        {line.arabic && (
          <div className={styles.arabicLine} lang="ar">
            {arabicTypewriter.isComplete && line.inlineVocab
              ? renderArabicWithHighlights(formatArabic(line.arabic), line.inlineVocab)
              : arabicTypewriter.isComplete && filteredLine?.hasUnknownWords
              ? <FilteredArabicLine annotations={filteredLine.annotations} vocabAll={vocabulary} knownWordIds={knownWordIds} />
              : arabicTypewriter.displayText}
          </div>
        )}
        {line.english && arabicTypewriter.isComplete && (
          <div className={styles.englishLine}>{englishTypewriter.displayText}</div>
        )}
        {settings?.showTransliteration && line.transliteration && englishTypewriter.isComplete && (
          <div
            className={styles.translitLine}
            aria-label={`Transliteration: ${line.transliteration}`}
          >
            {translitTypewriter.displayText}
          </div>
        )}
        {/* Cultural note - only show when all text is revealed */}
        {allComplete && line.culturalNote && (
          <div className={styles.culturalNote}>
            <div className={styles.culturalNoteLabel}>Cultural Note</div>
            <div className={styles.culturalNoteText}>{line.culturalNote}</div>
          </div>
        )}
        {/* Teach word card - only show when all text is revealed */}
        {allComplete && teachWordCard}
      </div>
      <div className={styles.continueHint} role="status" aria-live="polite">
        {allComplete ? (
          <>
            Space / Enter / Click to continue{' '}
            <span className={styles.continueIndicator}>▼</span>
          </>
        ) : (
          'Click or press Space to skip typing...'
        )}
      </div>
    </div>
  );
}
