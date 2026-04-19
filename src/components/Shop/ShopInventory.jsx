import { memo } from 'react';
import { EQUIPMENT_DATA } from '../../data/equipment.js';
import { AFFIXES } from '../../data/affixes.js';
import { RARITY_COLORS } from '../../data/equipment.js';
import { formatAsEasternArabic } from '../../utils/arabicNumbers.js';
import styles from './ShopInventory.module.css';

/**
 * ShopInventory — Reusable item grid component for buy/sell
 *
 * Props:
 * - items: Array of { itemId, price, available } (buy mode) or { itemId, quantity, locked } (sell mode)
 * - mode: 'buy' | 'sell'
 * - onBuy: (itemId, price) => void
 * - onSell: (itemId, sellPrice) => void
 * - onHaggle: (itemId, price) => void
 * - playerDirhams: number
 * - vocabularyState: vocabularySlice state for affix status
 * - inventoryFull: boolean
 */
function ShopInventory({ items, mode, onBuy, onSell, onHaggle, playerDirhams, vocabularyState, inventoryFull }) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        {mode === 'buy' ? 'No items available at your level.' : 'Your inventory is empty.'}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const itemId = item.itemId;
        const itemData = EQUIPMENT_DATA[itemId];

        if (!itemData) {
          console.warn(`[ShopInventory] Missing item data for '${itemId}'`);
          return null;
        }

        const rarity = itemData.rarity;
        const rarityColor = RARITY_COLORS[rarity] || '#FFFFFF';
        const borderStyle = { borderColor: rarityColor };

        // Affix status calculation
        const affixStatuses = itemData.affixes.map((affix) => {
          const affixData = AFFIXES[affix.wordId];
          const fsrsCard = vocabularyState.fsrsCards[affix.wordId];
          const isLearned = fsrsCard && fsrsCard.state === 'Review';
          return {
            wordId: affix.wordId,
            arabic: affixData?.arabic || '',
            english: affixData?.english || '',
            learned: isLearned,
          };
        });

        if (mode === 'buy') {
          const price = item.price;
          const canAfford = playerDirhams >= price;
          const canHaggle = price > 100;
          const priceEastern = formatAsEasternArabic(price);

          return (
            <div key={itemId} className={styles.itemCard} style={borderStyle}>
              <div className={styles.itemHeader}>
                <div className={styles.itemNameArabic}>{itemData.nameArabic}</div>
                <div className={styles.itemName}>{itemData.name}</div>
              </div>

              {affixStatuses.length > 0 && (
                <div className={styles.affixRow}>
                  {affixStatuses.map((affix) => (
                    <div
                      key={affix.wordId}
                      className={affix.learned ? styles.affixLearned : styles.affixUnlearned}
                      title={`${affix.arabic} (${affix.english}) - ${affix.learned ? 'Learned' : 'Unlearned: 50% bonus'}`}
                    >
                      <span className={styles.affixDot}></span>
                      {!affix.learned && <span className={styles.affixBadge}>50%</span>}
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.priceRow}>
                <div className={styles.priceArabic}>{priceEastern}</div>
                <div className={styles.priceWestern}>
                  {price} dirhams
                  {/* ECON-04: Price direction indicator */}
                  {item.basePrice && item.price !== item.basePrice && (
                    <span className={item.price > item.basePrice ? styles.priceUp : styles.priceDown}>
                      {item.price > item.basePrice ? ' \u25B2' : ' \u25BC'}
                    </span>
                  )}
                </div>
                {item.outOfStock && (
                  <div className={styles.outOfStock}>Out of Stock</div>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.buyBtn} ${!canAfford || inventoryFull ? styles.btnDisabled : ''}`}
                  onClick={() => onBuy(itemId, price)}
                  disabled={!canAfford || inventoryFull}
                  aria-label={`Buy ${itemData.name} for ${price} dirhams`}
                >
                  {inventoryFull ? 'Full' : 'Buy'}
                </button>
                {canHaggle && (
                  <button
                    className={styles.haggleBtn}
                    onClick={() => onHaggle(itemId, price, itemData.name, itemData.nameArabic)}
                    aria-label={`Haggle for ${itemData.name}`}
                  >
                    ✂️
                  </button>
                )}
              </div>
            </div>
          );
        } else {
          // Sell mode
          const sellPrice = itemData.sellPrice;
          const isLocked = item.locked;
          const quantity = item.quantity || 1;
          const priceEastern = formatAsEasternArabic(sellPrice);

          return (
            <div key={itemId} className={styles.itemCard} style={borderStyle}>
              <div className={styles.itemHeader}>
                <div className={styles.itemNameArabic}>{itemData.nameArabic}</div>
                <div className={styles.itemName}>{itemData.name}</div>
                {quantity > 1 && <div className={styles.quantity}>x{quantity}</div>}
              </div>

              {affixStatuses.length > 0 && (
                <div className={styles.affixRow}>
                  {affixStatuses.map((affix) => (
                    <div
                      key={affix.wordId}
                      className={affix.learned ? styles.affixLearned : styles.affixUnlearned}
                      title={`${affix.arabic} (${affix.english})`}
                    >
                      <span className={styles.affixDot}></span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.priceRow}>
                <div className={styles.priceArabic}>{priceEastern}</div>
                <div className={styles.priceWestern}>{sellPrice} dirhams</div>
              </div>

              <div className={styles.actions}>
                {isLocked ? (
                  <div className={styles.lockedBadge} title="Item is locked">🔒</div>
                ) : (
                  <button
                    className={styles.sellBtn}
                    onClick={() => onSell(itemId, sellPrice, rarity, itemData.name)}
                    aria-label={`Sell ${itemData.name} for ${sellPrice} dirhams`}
                  >
                    Sell
                  </button>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default memo(ShopInventory);
