import { useState, memo } from 'react';
import { EQUIPMENT_DATA, RARITY_TIERS } from '../../data/equipment.js';
import { AFFIXES } from '../../data/affixes.js';
import { ITEM_SETS } from '../../data/itemSets.js';
import { compareItemStats, calculateItemStats } from '../../utils/itemStats.js';
import { getAffixMultiplier } from '../../utils/affixMatcher.js';
import styles from './InventoryUI.module.css';

const RARITY_LABELS = {
  common: { arabic: 'أبيض', english: 'Common' },
  uncommon: { arabic: 'أخضر', english: 'Uncommon' },
  rare: { arabic: 'أزرق', english: 'Rare' },
  epic: { arabic: 'بنفسجي', english: 'Epic' },
  legendary: { arabic: 'ذهبي', english: 'Legendary' },
};

/**
 * Format stat value for display
 * @param {number} value - Stat value
 * @param {string} statKey - hp | mp | damage | defense
 * @returns {string}
 */
function formatStat(value, statKey) {
  if (statKey === 'damage' || statKey === 'defense') {
    // Percentage stats
    const percentage = (value * 100).toFixed(0);
    return `${percentage > 0 ? '+' : ''}${percentage}%`;
  }
  // Flat stats (hp, mp)
  return `${value > 0 ? '+' : ''}${value}`;
}

/**
 * Format stat comparison for tooltip
 * @param {number} diff - Stat difference
 * @param {string} statKey - hp | mp | damage | defense
 * @returns {string}
 */
function formatStatComparison(diff, statKey) {
  if (Math.abs(diff) < 0.001) return '0';
  return formatStat(diff, statKey);
}

function ItemTooltip({
  itemId,
  currentEquippedId,
  vocabularyState,
  onEquip,
  onUnequip,
  onClose,
  _isEquipped,
  position,
}) {
  const [showLore, setShowLore] = useState(false);

  const itemData = EQUIPMENT_DATA[itemId];
  if (!itemData) return null;

  const rarityInfo = RARITY_TIERS[itemData.rarity];
  const itemStats = calculateItemStats(itemId, vocabularyState);

  // Stat comparison (only if there's a currently equipped item to compare against)
  const statComparison = currentEquippedId
    ? compareItemStats(itemId, currentEquippedId, vocabularyState)
    : null;

  // Set info
  let setInfo = null;
  if (itemData.setId) {
    const setData = ITEM_SETS[itemData.setId];
    if (setData) {
      // Count how many items from this set are currently equipped (would need equipped items passed in)
      // For now, just show set name
      setInfo = {
        name: setData.name,
        nameArabic: setData.nameArabic,
        totalItems: setData.items.length,
      };
    }
  }

  // Position tooltip
  const tooltipStyle = {
    left: position.x,
    top: position.y,
  };

  return (
    <div
      className={styles.tooltip}
      style={tooltipStyle}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={`Item details for ${itemData.name}`}
    >
      {/* Close button */}
      <button className={styles.tooltipClose} onClick={onClose} aria-label="Close tooltip">
        ×
      </button>

      {/* Header: Item name and rarity */}
      <div className={styles.tooltipHeader}>
        <div className={styles.tooltipNameArabic} lang="ar">{itemData.nameArabic}</div>
        <div className={styles.tooltipNameEnglish}>{itemData.name}</div>
        <div
          className={styles.tooltipRarity}
          style={{ color: rarityInfo.color }}
        >
          <span lang="ar">{RARITY_LABELS[itemData.rarity].arabic}</span> / {RARITY_LABELS[itemData.rarity].english}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.tooltipStats}>
        <div className={styles.tooltipSectionTitle}>Stats</div>
        <div className={styles.tooltipStatList}>
          {itemStats.hp > 0 && (
            <div className={styles.tooltipStat}>
              HP: {formatStat(itemStats.hp, 'hp')}
              {statComparison && (
                <span
                  className={
                    statComparison.hp > 0
                      ? styles.statPositive
                      : statComparison.hp < 0
                      ? styles.statNegative
                      : styles.statNeutral
                  }
                >
                  {' '}({formatStatComparison(statComparison.hp, 'hp')})
                </span>
              )}
            </div>
          )}
          {itemStats.mp > 0 && (
            <div className={styles.tooltipStat}>
              MP: {formatStat(itemStats.mp, 'mp')}
              {statComparison && (
                <span
                  className={
                    statComparison.mp > 0
                      ? styles.statPositive
                      : statComparison.mp < 0
                      ? styles.statNegative
                      : styles.statNeutral
                  }
                >
                  {' '}({formatStatComparison(statComparison.mp, 'mp')})
                </span>
              )}
            </div>
          )}
          {itemStats.damage > 0 && (
            <div className={styles.tooltipStat}>
              Damage: {formatStat(itemStats.damage, 'damage')}
              {statComparison && (
                <span
                  className={
                    statComparison.damage > 0
                      ? styles.statPositive
                      : statComparison.damage < 0
                      ? styles.statNegative
                      : styles.statNeutral
                  }
                >
                  {' '}({formatStatComparison(statComparison.damage, 'damage')})
                </span>
              )}
            </div>
          )}
          {itemStats.defense > 0 && (
            <div className={styles.tooltipStat}>
              Defense: {formatStat(itemStats.defense, 'defense')}
              {statComparison && (
                <span
                  className={
                    statComparison.defense > 0
                      ? styles.statPositive
                      : statComparison.defense < 0
                      ? styles.statNegative
                      : styles.statNeutral
                  }
                >
                  {' '}({formatStatComparison(statComparison.defense, 'defense')})
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Affixes */}
      {itemData.affixes && itemData.affixes.length > 0 && (
        <div className={styles.tooltipAffixes}>
          <div className={styles.tooltipSectionTitle}>Affixes</div>
          {itemData.affixes.map((affix, index) => {
            const affixData = AFFIXES[affix.wordId];
            if (!affixData) return null;

            const multiplier = getAffixMultiplier(affix.wordId, vocabularyState);
            const isLearned = multiplier === 1.0;
            const isPartial = multiplier > 0.5 && multiplier < 1.0;

            return (
              <div
                key={index}
                className={`${styles.tooltipAffix} ${
                  isLearned
                    ? styles.affixLearned
                    : isPartial
                    ? styles.affixPartial
                    : styles.affixUnlearned
                }`}
              >
                <div className={styles.affixName}>
                  <span lang="ar">{affixData.arabic}</span> ({affixData.english})
                </div>
                <div className={styles.affixBonus}>
                  {Object.entries(affix.bonus).map(([stat, value]) => (
                    <span key={stat}>
                      {formatStat(value, stat)} {stat.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div className={styles.affixStatus}>
                  {isLearned ? (
                    <span className={styles.affixLearnedBadge}>[✓ Learned]</span>
                  ) : (
                    <span className={styles.affixUnlearnedBadge}>
                      [{Math.round(multiplier * 100)}% — Learn to unlock!]
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Set info */}
      {setInfo && (
        <div className={styles.tooltipSet}>
          <div className={styles.tooltipSectionTitle}>Set</div>
          <div className={styles.tooltipSetName}>
            <span lang="ar">{setInfo.nameArabic}</span> / {setInfo.name}
          </div>
          <div className={styles.tooltipSetProgress}>
            Part of {setInfo.totalItems}-piece set
          </div>
        </div>
      )}

      {/* Lore */}
      <div className={styles.tooltipLore}>
        <button
          className={styles.tooltipLoreToggle}
          onClick={() => setShowLore(!showLore)}
          aria-expanded={showLore}
        >
          {showLore ? '▼' : '▶'} Lore
        </button>
        {showLore && (
          <div className={styles.tooltipLoreContent}>
            <div className={styles.tooltipLoreArabic} lang="ar">{itemData.loreArabic}</div>
            <div className={styles.tooltipLoreEnglish}>{itemData.lore}</div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.tooltipActions}>
        {onEquip && (
          <button className={styles.tooltipEquipBtn} onClick={onEquip}>
            Equip
          </button>
        )}
        {onUnequip && (
          <button className={styles.tooltipUnequipBtn} onClick={onUnequip}>
            Unequip
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ItemTooltip);
