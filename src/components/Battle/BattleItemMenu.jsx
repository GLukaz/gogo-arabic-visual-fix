/**
 * BattleItemMenu.jsx — Shows usable battle items from inventory during combat.
 *
 * Displays consumable items (potions, scrolls, food) from the player's inventory
 * that can be used during battle. Keyboard shortcuts 1-9 for quick select, ESC to cancel.
 *
 * Props: { visible, onUseItem, onCancel }
 */

import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectInventoryItems } from '../../store/slices/inventorySlice.js';
import { EQUIPMENT_DATA } from '../../data/equipment.js';
import styles from './BattleItemMenu.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Determine if an item is usable in battle.
 * Checks for usableInBattle flag on EQUIPMENT_DATA, or falls back to craftedBy
 * professions that produce consumables (cook, herbalist).
 */
function isBattleUsable(itemId) {
  const data = EQUIPMENT_DATA[itemId];
  if (!data) return false;
  if (data.usableInBattle) return true;
  // Consumable professions: cook and herbalist items that are accessories/belts
  // can be used as consumables in battle (future support)
  return false;
}

/**
 * Get display info for an inventory item.
 */
function getItemDisplay(itemId) {
  const data = EQUIPMENT_DATA[itemId];
  if (!data) return { nameArabic: itemId, nameEnglish: itemId, effect: '' };
  return {
    nameArabic: data.nameArabic || data.name || itemId,
    nameEnglish: data.name || itemId,
    effect: data.loreArabic || data.lore || '',
  };
}

export default function BattleItemMenu({ visible, onUseItem, onCancel }) {
  const inventoryItems = useSelector(selectInventoryItems);

  // Filter to battle-usable items
  const usableItems = inventoryItems.filter((item) => isBattleUsable(item.itemId));

  const handleUseItem = useCallback(
    (item) => {
      const data = EQUIPMENT_DATA[item.itemId];
      onUseItem?.({
        itemId: item.itemId,
        effect: data?.stats || null,
      });
    },
    [onUseItem]
  );

  // Keyboard shortcuts: 1-9 for quick select, ESC to cancel
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9 && num <= usableItems.length) {
        e.preventDefault();
        handleUseItem(usableItems[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, usableItems, handleUseItem, onCancel]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.itemMenu}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
        >
          <p className={styles.menuTitle} lang="ar">أدوات المعركة</p>

          {usableItems.length === 0 ? (
            <p className={styles.emptyState} lang="ar">لا أدوات</p>
          ) : (
            usableItems.map((item, idx) => {
              const display = getItemDisplay(item.itemId);
              return (
                <div
                  key={item.itemId}
                  className={styles.itemRow}
                  onClick={() => handleUseItem(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleUseItem(item); }}
                >
                  {idx < 9 && (
                    <span className={styles.shortcutKey}>{idx + 1}</span>
                  )}
                  <div className={styles.itemInfo}>
                    <span className={styles.itemArabic} lang="ar">
                      {display.nameArabic}
                    </span>
                    <span className={styles.itemEffect}>
                      {display.nameEnglish}
                    </span>
                  </div>
                  <span className={styles.quantityBadge}>{item.quantity}</span>
                </div>
              );
            })
          )}

          <div className={styles.cancelRow}>
            <button className={styles.cancelBtn} onClick={onCancel}>
              ESC
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
