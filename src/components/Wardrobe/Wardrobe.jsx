import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setOutfit, spendDirhams, addToInventory } from '../../store/slices/playerSlice.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { OUTFITS, getRarityColor } from '../../data/outfits.js';
import styles from './Wardrobe.module.css';

/**
 * Wardrobe component
 * Full-screen overlay for outfit selection and purchase
 *
 * Features:
 * - Grid display of all available outfits
 * - Purchase outfits with dirhams
 * - Equip owned outfits
 * - Visual indicators for owned/equipped/locked states
 * - Rarity color coding
 * - Keyboard accessible with focus trap
 * - Emits 'outfit-changed' event to update Phaser sprite
 *
 * @param {function} onClose - Callback when wardrobe is closed
 */
function Wardrobe({ onClose }) {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);
  const [toast, setToast] = useState(null);

  const focusTrapRef = useFocusTrap(true, onClose);

  // Freeze player while wardrobe is open
  useEffect(() => {
    EventBus.emit(EVENTS.PLAYER_FREEZE);
    return () => {
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };
  }, []);

  // Get owned outfit IDs from inventory
  const ownedOutfits = useMemo(() => {
    const outfitIds = player.inventory
      .map((item) => (typeof item === 'string' ? item : item.itemId))
      .filter((id) => OUTFITS.some((outfit) => outfit.id === id));

    // Always include the default outfit
    if (!outfitIds.includes('simple-thobe')) {
      outfitIds.push('simple-thobe');
    }

    return outfitIds;
  }, [player.inventory]);

  // Handle closing wardrobe
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handle Escape key (redundant with useFocusTrap, but explicit for clarity)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Handle outfit purchase
  const handlePurchase = useCallback(
    (outfit) => {
      // Validate purchase
      if (player.dirhams < outfit.price) {
        showToast('Not enough dirhams!');
        return;
      }

      if (ownedOutfits.includes(outfit.id)) {
        showToast('Already owned!');
        return;
      }

      // Execute purchase
      dispatch(spendDirhams(outfit.price));
      dispatch(addToInventory({ itemId: outfit.id, equipped: false }));

      showToast(`Purchased ${outfit.name}!`);
    },
    [player.dirhams, ownedOutfits, dispatch]
  );

  // Handle outfit equip
  const handleEquip = useCallback(
    (outfit) => {
      if (!ownedOutfits.includes(outfit.id)) {
        showToast('You must purchase this outfit first!');
        return;
      }

      if (player.outfit === outfit.id) {
        showToast('Already equipped!');
        return;
      }

      // Equip outfit
      dispatch(setOutfit(outfit.id));

      // Emit event to Phaser to update sprite
      EventBus.emit(EVENTS.OUTFIT_CHANGED, { outfitId: outfit.id });

      showToast(`Equipped ${outfit.name}!`);
    },
    [ownedOutfits, player.outfit, dispatch]
  );

  // Show toast notification
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Check if prefers reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const transition = reduceMotion ? { duration: 0.1 } : { duration: 0.25, ease: 'easeOut' };

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      onClick={handleBackdropClick}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wardrobe-title"
    >
      <motion.div
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={transition}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2 id="wardrobe-title" className={styles.title}>
              Wardrobe
            </h2>
            <span className={styles.subtitle}>خزانة الملابس</span>
          </div>
          <div className={styles.balance}>
            <span>💰</span>
            <span>{player.dirhams} Dirhams</span>
          </div>
        </div>

        {/* Outfit grid */}
        <div className={styles.content}>
          <div className={styles.grid}>
            {OUTFITS.map((outfit, index) => {
              const isOwned = ownedOutfits.includes(outfit.id);
              const isEquipped = player.outfit === outfit.id;
              const isLocked = outfit.unlockLevel && player.level < outfit.unlockLevel;
              const canAfford = player.dirhams >= outfit.price;

              return (
                <motion.div
                  key={outfit.id}
                  className={`${styles.card} ${isOwned ? styles.owned : ''} ${
                    isEquipped ? styles.equipped : ''
                  } ${isLocked ? styles.locked : ''}`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.05 }}
                  onClick={() => {
                    if (!isLocked && isOwned && !isEquipped) {
                      handleEquip(outfit);
                    }
                  }}
                  role="article"
                  aria-label={`${outfit.name} - ${outfit.description}`}
                >
                  {/* Rarity badge */}
                  <div
                    className={`${styles.rarityBadge} ${styles[`rarity${outfit.rarity.charAt(0).toUpperCase()}${outfit.rarity.slice(1)}`]}`}
                    style={{ backgroundColor: getRarityColor(outfit.rarity) }}
                  >
                    {outfit.rarity}
                  </div>

                  {/* Icon placeholder */}
                  <div className={styles.icon} aria-hidden="true">
                    {outfit.icon}
                  </div>

                  {/* Names */}
                  <div className={styles.nameArabic}>{outfit.nameArabic}</div>
                  <div className={styles.name}>{outfit.name}</div>

                  {/* Description */}
                  <div className={styles.description}>{outfit.description}</div>

                  {/* Status and actions */}
                  {isEquipped && <div className={styles.equippedBadge}>Equipped</div>}

                  {!isOwned && !isLocked && (
                    <>
                      <div className={styles.price}>{outfit.price} Dirhams</div>
                      <button
                        className={styles.purchaseButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(outfit);
                        }}
                        disabled={!canAfford}
                        aria-label={`Purchase ${outfit.name} for ${outfit.price} dirhams`}
                      >
                        Purchase
                      </button>
                    </>
                  )}

                  {!isOwned && isLocked && (
                    <div className={styles.lockedBadge}>
                      Requires Lv. {outfit.unlockLevel}
                    </div>
                  )}

                  {isOwned && !isEquipped && (
                    <button
                      className={styles.equipButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEquip(outfit);
                      }}
                      aria-label={`Equip ${outfit.name}`}
                    >
                      Equip
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close wardrobe"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Wardrobe;
