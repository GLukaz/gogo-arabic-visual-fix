import { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  selectInventoryItems,
  selectEquippedItems,
  selectInventoryCount,
  equipItem,
  unequipItem,
  sortInventory,
} from '../../store/slices/inventorySlice.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { EQUIPMENT_DATA, RARITY_COLORS } from '../../data/equipment.js';
import { getSetBonus } from '../../data/itemSets.js';
import EquipmentSlots from './EquipmentSlots.jsx';
import ItemTooltip from './ItemTooltip.jsx';
import styles from './InventoryUI.module.css';

const RARITY_LABELS = {
  common: { arabic: 'أبيض', english: 'Common' },
  uncommon: { arabic: 'أخضر', english: 'Uncommon' },
  rare: { arabic: 'أزرق', english: 'Rare' },
  epic: { arabic: 'بنفسجي', english: 'Epic' },
  legendary: { arabic: 'ذهبي', english: 'Legendary' },
};

function InventoryUI({ onClose }) {
  const dispatch = useDispatch();

  // Redux selectors
  const inventoryItems = useSelector(selectInventoryItems);
  const equipped = useSelector(selectEquippedItems);
  const vocabularyState = useSelector((state) => state.vocabulary);
  const playerLevel = useSelector((state) => state.player.level);
  const itemCount = useSelector(selectInventoryCount);

  // Local state
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('type');
  const [filterRarity, setFilterRarity] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // Focus trap and overlay close handlers
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const focusTrapRef = useFocusTrap(true, handleClose);
  const handleOverlayClose = useOverlayClose(handleClose);

  // Freeze player while inventory is open
  useEffect(() => {
    EventBus.emit(EVENTS.PLAYER_FREEZE);
    return () => {
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };
  }, []);

  // Sort handler
  const handleSort = useCallback((sortType) => {
    setSortBy(sortType);
    dispatch(sortInventory({ sortBy: sortType }));
  }, [dispatch]);

  // Filter handler
  const handleFilterRarity = useCallback((rarity) => {
    setFilterRarity(rarity);
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!filterRarity) return inventoryItems;
    return inventoryItems.filter(item => {
      const itemData = EQUIPMENT_DATA[item.itemId];
      return itemData && itemData.rarity === filterRarity;
    });
  }, [inventoryItems, filterRarity]);

  // Item click handler - show tooltip
  const handleItemClick = useCallback((item, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const itemData = EQUIPMENT_DATA[item.itemId];

    if (!itemData) return;

    setSelectedItem(item.itemId);
    setTooltip({
      itemId: item.itemId,
      currentEquippedId: equipped[itemData.slot] || null,
      isEquipped: false,
      position: { x: rect.right + 10, y: rect.top },
    });
  }, [equipped]);

  // Equipped item click handler
  const handleEquippedClick = useCallback((slot, event) => {
    const itemId = equipped[slot];
    if (!itemId) return;

    const rect = event.currentTarget.getBoundingClientRect();

    setSelectedItem(itemId);
    setTooltip({
      itemId,
      currentEquippedId: null,
      isEquipped: true,
      slot,
      position: { x: rect.right + 10, y: rect.top },
    });
  }, [equipped]);

  // Equip handler
  const handleEquip = useCallback(() => {
    if (!tooltip || !tooltip.itemId) return;

    const itemData = EQUIPMENT_DATA[tooltip.itemId];
    if (!itemData) return;

    // Check level requirement
    if (itemData.minLevel > playerLevel) {
      console.warn(`[InventoryUI] Item requires level ${itemData.minLevel}`);
      return;
    }

    dispatch(equipItem({ slot: itemData.slot, itemId: tooltip.itemId }));
    EventBus.emit(EVENTS.EQUIPMENT_CHANGED, { slot: itemData.slot, itemId: tooltip.itemId });

    // Close tooltip
    setTooltip(null);
    setSelectedItem(null);
  }, [tooltip, dispatch, playerLevel]);

  // Unequip handler
  const handleUnequip = useCallback(() => {
    if (!tooltip || !tooltip.slot) return;

    dispatch(unequipItem({ slot: tooltip.slot }));
    EventBus.emit(EVENTS.EQUIPMENT_CHANGED, { slot: tooltip.slot, itemId: null });

    // Close tooltip
    setTooltip(null);
    setSelectedItem(null);
  }, [tooltip, dispatch]);

  // Close tooltip
  const handleTooltipClose = useCallback(() => {
    setTooltip(null);
    setSelectedItem(null);
  }, []);

  // Calculate active set bonuses
  const activeSets = useMemo(() => getSetBonus(equipped), [equipped]);

  // Animation settings
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };
  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.25, ease: 'easeOut' };

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      onClick={handleOverlayClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
      role="dialog"
      aria-label="Inventory"
      aria-modal="true"
    >
      <motion.div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>
            <span className={styles.titleArabic} lang="ar">حقيبة</span>
            <span className={styles.titleEnglish}>Inventory</span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close inventory">
            Close
          </button>
        </div>

        {/* Main layout */}
        <div className={styles.layout}>
          {/* Left panel: Equipment slots */}
          <div className={styles.equipmentPanel}>
            <EquipmentSlots
              equipped={equipped}
              onSlotClick={handleEquippedClick}
              vocabularyState={vocabularyState}
            />

            {/* Set bonuses */}
            {activeSets.length > 0 && (
              <div className={styles.setBonusSection}>
                <div className={styles.setBonusTitle}>Set Bonuses</div>
                {activeSets.map((setBonus, index) => (
                  <div key={index} className={styles.setBonus}>
                    <div className={styles.setBonusName}>{setBonus.setName}</div>
                    <div className={styles.setBonusProgress}>
                      {setBonus.equippedCount}/{setBonus.totalItems}
                    </div>
                    <div className={styles.setBonusDesc}>{setBonus.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Inventory grid */}
          <div className={styles.gridPanel}>
            {/* Sort and filter controls */}
            <div className={styles.sortBar}>
              <div className={styles.sortButtons}>
                <button
                  className={sortBy === 'type' ? styles.sortBtnActive : styles.sortBtn}
                  onClick={() => handleSort('type')}
                  aria-label="Sort by type"
                >
                  Type
                </button>
                <button
                  className={sortBy === 'rarity' ? styles.sortBtnActive : styles.sortBtn}
                  onClick={() => handleSort('rarity')}
                  aria-label="Sort by rarity"
                >
                  Rarity
                </button>
                <button
                  className={sortBy === 'arabic' ? styles.sortBtnActive : styles.sortBtn}
                  onClick={() => handleSort('arabic')}
                  aria-label="Sort by Arabic alphabetical order"
                >
                  <span lang="ar">أبجد</span>
                </button>
              </div>

              <div className={styles.filterButtons}>
                <button
                  className={filterRarity === null ? styles.filterBtnActive : styles.filterBtn}
                  onClick={() => handleFilterRarity(null)}
                  aria-label="Show all rarities"
                >
                  All
                </button>
                {Object.keys(RARITY_LABELS).map(rarity => (
                  <button
                    key={rarity}
                    className={filterRarity === rarity ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => handleFilterRarity(rarity)}
                    aria-label={`Filter by ${RARITY_LABELS[rarity].english}`}
                  >
                    <span lang="ar">{RARITY_LABELS[rarity].arabic}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item grid */}
            <div className={styles.itemGrid}>
              {filteredItems.map((item) => {
                const itemData = EQUIPMENT_DATA[item.itemId];
                if (!itemData) return null;

                const isSelected = selectedItem === item.itemId;
                const rarityClass = styles[`rarity${itemData.rarity.charAt(0).toUpperCase() + itemData.rarity.slice(1)}`];

                return (
                  <button
                    key={item.itemId}
                    className={`${styles.itemCell} ${rarityClass} ${isSelected ? styles.itemCellSelected : ''}`}
                    onClick={(e) => handleItemClick(item, e)}
                    role="button"
                    aria-label={`${itemData.name} - ${itemData.rarity}`}
                    tabIndex={0}
                  >
                    <div className={styles.itemIcon} style={{ borderColor: RARITY_COLORS[itemData.rarity] }}>
                      {/* Placeholder icon - could be replaced with actual icon */}
                      <div className={styles.itemIconPlaceholder} />
                    </div>
                    <div className={styles.itemName} lang="ar">{itemData.nameArabic}</div>
                    {item.quantity > 1 && (
                      <div className={styles.itemQuantity}>{item.quantity}</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Item count */}
            <div className={`${styles.itemCount} ${itemCount > 180 ? styles.itemCountWarning : ''}`}>
              Items: {itemCount}/200
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tooltip */}
      {tooltip && (
        <ItemTooltip
          itemId={tooltip.itemId}
          currentEquippedId={tooltip.currentEquippedId}
          vocabularyState={vocabularyState}
          onEquip={tooltip.isEquipped ? null : handleEquip}
          onUnequip={tooltip.isEquipped ? handleUnequip : null}
          onClose={handleTooltipClose}
          isEquipped={tooltip.isEquipped}
          position={tooltip.position}
        />
      )}
    </motion.div>
  );
}

export default memo(InventoryUI);
