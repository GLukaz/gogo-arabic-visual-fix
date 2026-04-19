import { memo } from 'react';
import { EQUIPMENT_DATA, RARITY_COLORS } from '../../data/equipment.js';
import { getAffixMultiplier } from '../../utils/affixMatcher.js';
import styles from './InventoryUI.module.css';

const SLOT_LABELS = {
  headCovering: { arabic: 'غطاء الرأس', english: 'Head' },
  robe: { arabic: 'رداء', english: 'Robe' },
  cloak: { arabic: 'عباءة', english: 'Cloak' },
  belt: { arabic: 'حزام', english: 'Belt' },
  boots: { arabic: 'حذاء', english: 'Boots' },
  gloves: { arabic: 'قفازات', english: 'Gloves' },
  accessory1: { arabic: 'إكسسوار ١', english: 'Accessory 1' },
  accessory2: { arabic: 'إكسسوار ٢', english: 'Accessory 2' },
};

/**
 * Check if all affixes on an item are learned
 * @param {Array} affixes - Item affixes
 * @param {Object} vocabularyState - Vocabulary slice state
 * @returns {'learned' | 'partial' | 'unlearned'}
 */
function getAffixLearnStatus(affixes, vocabularyState) {
  if (!affixes || affixes.length === 0) return 'learned';

  const multipliers = affixes.map(affix => getAffixMultiplier(affix.wordId, vocabularyState));

  const allLearned = multipliers.every(m => m === 1.0);
  const anyLearned = multipliers.some(m => m > 0.5);

  if (allLearned) return 'learned';
  if (anyLearned) return 'partial';
  return 'unlearned';
}

function EquipmentSlots({ equipped, onSlotClick, vocabularyState }) {
  return (
    <div className={styles.equipmentSlots}>
      {Object.keys(SLOT_LABELS).map(slot => {
        const itemId = equipped[slot];
        const itemData = itemId ? EQUIPMENT_DATA[itemId] : null;
        const labels = SLOT_LABELS[slot];

        const affixStatus = itemData ? getAffixLearnStatus(itemData.affixes, vocabularyState) : null;

        return (
          <button
            key={slot}
            className={`${styles.equipmentSlot} ${itemData ? styles.equipmentSlotFilled : styles.equipmentSlotEmpty}`}
            onClick={(e) => onSlotClick(slot, e)}
            aria-label={`${labels.english}: ${itemData ? itemData.name : 'Empty'}`}
            tabIndex={0}
          >
            {/* Slot label */}
            <div className={styles.slotLabel}>
              <div className={styles.slotLabelArabic} lang="ar">{labels.arabic}</div>
              <div className={styles.slotLabelEnglish}>{labels.english}</div>
            </div>

            {/* Item display */}
            {itemData ? (
              <div className={styles.slotItem}>
                <div
                  className={styles.slotItemIcon}
                  style={{ borderColor: RARITY_COLORS[itemData.rarity] }}
                >
                  <div className={styles.slotItemIconPlaceholder} />
                </div>
                <div className={styles.slotItemName}>
                  <div className={styles.slotItemNameArabic} lang="ar">{itemData.nameArabic}</div>
                  <div className={styles.slotItemNameEnglish}>{itemData.name}</div>
                </div>

                {/* Affix status indicator */}
                {affixStatus && (
                  <div className={styles.slotAffixStatus}>
                    {affixStatus === 'learned' && (
                      <span className={styles.affixLearned} title="All affixes learned">✓</span>
                    )}
                    {affixStatus === 'partial' && (
                      <span className={styles.affixPartial} title="Some affixes learned">◐</span>
                    )}
                    {affixStatus === 'unlearned' && (
                      <span className={styles.affixUnlearned} title="Affixes not learned">○</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.slotEmpty}>Empty</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default memo(EquipmentSlots);
