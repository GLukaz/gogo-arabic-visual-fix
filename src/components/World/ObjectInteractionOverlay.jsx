import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeObjectInspect } from '../../store/slices/uiSlice.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import TashkeelText from '../Arabic/TashkeelText.jsx';
import { getRootWords } from '../../data/rootsData.js';
import { INSCRIPTION_DATA } from '../../data/inscriptionData.js';
import { store } from '../../store/store.js';
import { createNewCard } from '../../services/fsrs.js';
import styles from './ObjectInteractionOverlay.module.css';

/**
 * ObjectInteractionOverlay — displays contextual info for world objects
 * (fountain, statue, painting, lantern, stall, barrel, crate, pot).
 *
 * Shows Arabic label, English label, description, optional cultural note,
 * optional vocab word card, and optional loot message.
 *
 * Follows the same pattern as SignOverlay:
 *   useSelector → useOverlayClose → useFocusTrap → conditional render
 */
export default function ObjectInteractionOverlay() {
  const dispatch = useDispatch();
  const data = useSelector((s) => s.ui.objectInspectData);

  const handleClose = useCallback(() => {
    dispatch(closeObjectInspect());
  }, [dispatch]);

  const handleOverlayClose = useOverlayClose(handleClose);

  const focusTrapRef = useFocusTrap(!!data, null);

  // ENVR-03: Dispatch unknown inscription words to FSRS queue on encounter
  // ENVR-04: Batch-dispatch root family words (up to 5) if inscription has rootFamily
  useEffect(() => {
    if (!data || data.type !== 'inscription') return;

    const state = store.getState();
    const fsrsCards = state.vocabulary?.fsrsCards ?? {};

    // ENVR-03: Dispatch unknown words from inscription wordIds
    const inscriptionContent = INSCRIPTION_DATA[data.id];
    const wordIds = inscriptionContent?.wordIds || data.rootWords || [];
    wordIds
      .filter(wordId => !fsrsCards[wordId])
      .forEach(wordId => {
        dispatch(addFsrsCard({
          wordId,
          card: createNewCard(),
          source: `inscription_${data.id}`,
        }));
      });

    // ENVR-04: Batch-dispatch root family words if inscription has rootFamily
    if (data.rootFamily) {
      const rootData = getRootWords(data.rootFamily);
      const rootWordIds = (rootData?.words || data.rootWords || []);
      rootWordIds
        .filter(wordId => !fsrsCards[wordId])
        .slice(0, 5) // cap at 5 to avoid overwhelming the queue
        .forEach(wordId => {
          dispatch(addFsrsCard({
            wordId,
            card: createNewCard(),
            source: `inscription_root_${data.rootFamily}`,
          }));
        });
    }
  }, [data, dispatch]);

  if (!data) return null;

  // Format type name for display badge
  const typeName = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : 'Object';

  return (
    <div ref={focusTrapRef} className={styles.overlay} onClick={handleOverlayClose} role="dialog" aria-label={`${typeName} inspection`}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Type badge */}
        <div className={styles.typeBadge}>{typeName}</div>

        {/* Arabic label */}
        {data.labelArabic && (
          <div className={styles.arabic} lang="ar" dir="rtl">
            {data.labelArabic}
          </div>
        )}

        {/* English label */}
        {data.labelEnglish && (
          <div className={styles.english}>{data.labelEnglish}</div>
        )}

        {/* Description */}
        {data.descriptionEnglish && (
          <div className={styles.description}>{data.descriptionEnglish}</div>
        )}

        {/* Inscription Arabic text with progressive tashkeel (ENVR-03, TASH-03) */}
        {data.type === 'inscription' && INSCRIPTION_DATA[data.id]?.arabicText && (
          <div className={styles.inscriptionArabic} lang="ar" dir="rtl">
            <TashkeelText arabic={INSCRIPTION_DATA[data.id].arabicText} />
          </div>
        )}

        {/* Root family display (ENVR-04) */}
        {data.rootFamily && (
          <div className={styles.rootFamily}>
            <div className={styles.rootFamilyLabel}>Root Family</div>
            <div className={styles.rootFamilyArabic} lang="ar" dir="rtl">
              {data.rootFamily}
            </div>
            {data.rootFamilyEnglish && (
              <div className={styles.rootFamilyEnglish}>({data.rootFamilyEnglish})</div>
            )}
          </div>
        )}

        {/* Cultural note */}
        {data.culturalNote && (
          <div className={styles.culturalNote}>
            <div className={styles.culturalNoteLabel}>Cultural Note</div>
            <div className={styles.culturalNoteText}>{data.culturalNote}</div>
          </div>
        )}

        {/* Vocab word card */}
        {data.taughtWord && (
          <div className={styles.vocabCard}>
            <div className={styles.vocabLabel}>Word Learned</div>
            <div className={styles.vocabArabic} lang="ar" dir="rtl">
              {data.taughtWord.arabic}
            </div>
            <div className={styles.vocabEnglish}>{data.taughtWord.english}</div>
          </div>
        )}

        {/* Loot message */}
        {data.lootMessage && (
          <div className={styles.lootMessage}>{data.lootMessage}</div>
        )}

        {/* Continue button */}
        <button className={styles.closeBtn} onClick={handleOverlayClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
