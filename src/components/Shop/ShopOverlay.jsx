import { useState, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { closeDialogue } from '../../store/slices/uiSlice.js';
import { spendDirhams, addDirhams } from '../../store/slices/playerSlice.js';
import { recordShopPurchase } from '../../store/slices/achievementSlice.js';
import { addItem, removeItem, unlockAffix, selectInventoryItems, selectIsInventoryFull } from '../../store/slices/inventorySlice.js';
import { recordPurchase, recordHaggle, initSupply, decreaseSupply } from '../../store/slices/economySlice.js';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { getShopInventory } from '../../data/shopGenerator.js';
import { EQUIPMENT_DATA } from '../../data/equipment.js';
import { getZoneAdjustedBuyPrice, getShopZoneInfo } from '../../services/tradeRouteIntegration.js';
import { SUPPLY_DEFAULTS } from '../../game/systems/pricingAgent.js';
import { AFFIXES } from '../../data/affixes.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { EventBus } from '../../utils/eventBus.js';
import { store } from '../../store/store.js';
import ShopInventory from './ShopInventory.jsx';
import HagglingGame from './HagglingGame.jsx';
import styles from './ShopOverlay.module.css';

function ShopOverlay() {
  const dispatch = useDispatch();
  const player = useSelector((s) => s.player);
  const vocabularyState = useSelector((s) => s.vocabulary);
  const completedQuests = useSelector((s) => s.quests.completed);
  const inventoryItems = useSelector(selectInventoryItems);
  const inventoryFull = useSelector(selectIsInventoryFull);
  const dialogueConfig = useSelector((s) => s.ui.dialogueConfig);

  const [tab, setTab] = useState('buy');
  const [toast, setToast] = useState(null);
  const [hagglingItem, setHagglingItem] = useState(null);
  const [confirmSell, setConfirmSell] = useState(null);

  const focusTrapRef = useFocusTrap(true, null);

  const handleClose = useCallback(() => {
    dispatch(closeDialogue());
  }, [dispatch]);

  const handleOverlayClose = useOverlayClose(handleClose);

  // Zone info for price comparison display
  const zoneInfo = useMemo(() => getShopZoneInfo(shopId), [shopId]);

  // Dynamic shop inventory based on player level and world state
  const shopInventory = useMemo(() => {
    const state = store.getState();
    const shopId = dialogueConfig?.shopId || 'oasis_village_shop';
    const inv = getShopInventory(shopId, state);

    // ECON-02: Initialize supply levels on first shop open (idempotent — initSupply skips existing)
    const supplyItems = inv.map((item) => {
      const itemData = EQUIPMENT_DATA[item.itemId];
      const rarity = itemData?.rarity || 'common';
      return { itemId: item.itemId, max: SUPPLY_DEFAULTS[rarity]?.max || 10 };
    });
    store.dispatch(initSupply({ shopId, items: supplyItems }));

    // Apply zone-adjusted buy prices (trade route multipliers)
    return inv.map((item) => {
      const itemData = EQUIPMENT_DATA[item.itemId];
      const zonePrice = getZoneAdjustedBuyPrice(item.price, itemData, shopId);
      return { ...item, price: zonePrice };
    });
  }, [dialogueConfig, player.level, completedQuests, shopId]);

  // Shopkeeper info
  const shopId = dialogueConfig?.shopId || 'oasis_village_shop';
  const shopName = dialogueConfig?.shopName || "Merchant Fatima's Shop";
  const shopGreeting = dialogueConfig?.shopGreeting || 'مرحبا! Welcome to my shop!';

  const handleBuy = useCallback((itemId, price) => {
    if (player.dirhams < price) {
      setToast('Not enough dirhams!');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (inventoryFull) {
      setToast('Inventory full (200 items)!');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // Deduct dirhams
    dispatch(spendDirhams(price));

    // Add item to inventory
    dispatch(addItem({ itemId, quantity: 1 }));

    // Record purchase
    dispatch(recordPurchase({ shopId, itemId, price, haggled: false }));
    dispatch(recordShopPurchase(price));

    // ECON-02: Decrease supply for this item (raises price on next visit)
    dispatch(decreaseSupply({ shopId, itemId, amount: 1 }));

    // Emit shop purchase event
    EventBus.emit(EVENTS.SHOP_PURCHASE, { shopId, itemId, price });

    // Check for affix discovery
    const itemData = EQUIPMENT_DATA[itemId];
    const unlearnedAffixes = [];

    if (itemData && itemData.affixes) {
      for (const affix of itemData.affixes) {
        const wordId = affix.wordId;
        const fsrsCard = vocabularyState.fsrsCards[wordId];
        const isLearned = fsrsCard && fsrsCard.state === 'Review';

        if (!isLearned) {
          const affixData = AFFIXES[wordId];
          if (affixData) {
            // Add to FSRS queue
            dispatch(addFsrsCard({
              wordId,
              word: affixData.arabic,
              translation: affixData.english,
              transliteration: affixData.transliteration,
              category: 'adjectives',
              teacherNpc: shopId,
            }));

            // Unlock affix
            dispatch(unlockAffix(wordId));

            // Track for toast
            unlearnedAffixes.push(affixData);

            // Emit discovery event
            EventBus.emit(EVENTS.AFFIX_DISCOVERED, { wordId, affix: affixData, itemId });
          }
        }
      }
    }

    // Show toast
    if (unlearnedAffixes.length > 0) {
      const affixNames = unlearnedAffixes.map(a => `${a.arabic} (${a.english})`).join(', ');
      setToast(`New word discovered: ${affixNames} — practice to unlock full power!`);
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast(`Purchased ${itemData.name}!`);
      setTimeout(() => setToast(null), 2000);
    }
  }, [player.dirhams, inventoryFull, dispatch, shopId, vocabularyState]);

  const handleSell = useCallback((itemId, sellPrice, rarity, itemName) => {
    // Rare+ items require confirmation
    if ((rarity === 'rare' || rarity === 'epic' || rarity === 'legendary') && !confirmSell) {
      setConfirmSell({ itemId, sellPrice, itemName });
      return;
    }

    // Remove from inventory
    dispatch(removeItem({ itemId, quantity: 1 }));

    // Add dirhams
    dispatch(addDirhams(sellPrice));

    // Emit shop sell event
    EventBus.emit(EVENTS.SHOP_SELL, { shopId, itemId, sellPrice });

    // Clear confirmation
    setConfirmSell(null);

    // Show toast
    setToast(`Sold ${itemName} for ${sellPrice} dirhams!`);
    setTimeout(() => setToast(null), 2000);
  }, [dispatch, shopId, confirmSell]);

  const handleHaggle = useCallback((itemId, price, itemName, itemNameArabic) => {
    setHagglingItem({ itemId, price, itemName, itemNameArabic });
  }, []);

  const handleHaggleSuccess = useCallback((finalPrice) => {
    const { itemId } = hagglingItem;

    // Record haggle
    dispatch(recordHaggle({
      shopId,
      itemId,
      offered: finalPrice,
      accepted: true,
      success: true,
    }));

    // Emit haggle result
    EventBus.emit(EVENTS.SHOP_HAGGLE_RESULT, { shopId, itemId, originalPrice: hagglingItem.price, finalPrice, success: true });

    // Close haggling modal
    setHagglingItem(null);

    // Purchase at discounted price (reuse buy logic but with different price)
    if (player.dirhams < finalPrice) {
      setToast('Not enough dirhams!');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (inventoryFull) {
      setToast('Inventory full (200 items)!');
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // Deduct dirhams
    dispatch(spendDirhams(finalPrice));

    // Add item to inventory
    dispatch(addItem({ itemId, quantity: 1 }));

    // Record purchase with haggle flag
    dispatch(recordPurchase({ shopId, itemId, price: finalPrice, haggled: true }));
    dispatch(recordShopPurchase(finalPrice));

    // Emit shop purchase event
    EventBus.emit(EVENTS.SHOP_PURCHASE, { shopId, itemId, price: finalPrice, haggled: true });

    // Check for affix discovery
    const itemData = EQUIPMENT_DATA[itemId];
    const unlearnedAffixes = [];

    if (itemData && itemData.affixes) {
      for (const affix of itemData.affixes) {
        const wordId = affix.wordId;
        const fsrsCard = vocabularyState.fsrsCards[wordId];
        const isLearned = fsrsCard && fsrsCard.state === 'Review';

        if (!isLearned) {
          const affixData = AFFIXES[wordId];
          if (affixData) {
            // Add to FSRS queue
            dispatch(addFsrsCard({
              wordId,
              word: affixData.arabic,
              translation: affixData.english,
              transliteration: affixData.transliteration,
              category: 'adjectives',
              teacherNpc: shopId,
            }));

            // Unlock affix
            dispatch(unlockAffix(wordId));

            // Track for toast
            unlearnedAffixes.push(affixData);

            // Emit discovery event
            EventBus.emit(EVENTS.AFFIX_DISCOVERED, { wordId, affix: affixData, itemId });
          }
        }
      }
    }

    // Show toast
    const discount = hagglingItem.price - finalPrice;
    if (unlearnedAffixes.length > 0) {
      const affixNames = unlearnedAffixes.map(a => `${a.arabic} (${a.english})`).join(', ');
      setToast(`Haggled! Saved ${discount} dirhams! New word: ${affixNames}`);
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast(`Haggled successfully! Saved ${discount} dirhams!`);
      setTimeout(() => setToast(null), 2000);
    }
  }, [hagglingItem, player.dirhams, inventoryFull, dispatch, shopId, vocabularyState]);

  const handleHaggleCancel = useCallback(() => {
    setHagglingItem(null);
  }, []);

  const handleConfirmSellYes = useCallback(() => {
    if (confirmSell) {
      const { itemId, sellPrice, itemName } = confirmSell;
      const itemData = EQUIPMENT_DATA[itemId];
      handleSell(itemId, sellPrice, itemData.rarity, itemName);
    }
  }, [confirmSell, handleSell]);

  const handleConfirmSellNo = useCallback(() => {
    setConfirmSell(null);
  }, []);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const transition = reduceMotion
    ? { duration: 0.15 }
    : { duration: 0.25, ease: 'easeOut' };

  // Dynamic background image
  const overlayStyle = {
    backgroundColor: '#16213e',
    backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(212, 168, 67, 0.1) 0%, transparent 50%), repeating-conic-gradient(rgba(212, 168, 67, 0.04) 0% 25%, transparent 0% 50%) 0 0 / 48px 48px',
  };

  return (
    <motion.div
      ref={focusTrapRef}
      className={styles.overlay}
      style={overlayStyle}
      onClick={handleOverlayClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={transition}
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
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>{shopName}</div>
            <div className={styles.greeting}>{shopGreeting}</div>
          </div>
          <div className={styles.balance}>Dirhams: {player.dirhams}</div>
        </div>

        <div className={styles.tabRow}>
          <button
            className={tab === 'buy' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setTab('buy')}
          >
            Buy
          </button>
          <button
            className={tab === 'sell' ? styles.tabBtnActive : styles.tabBtn}
            onClick={() => setTab('sell')}
          >
            Sell
          </button>
          <button className={styles.closeBtn} onClick={handleOverlayClose}>Close</button>
        </div>

        {tab === 'buy' && (
          <>
            {zoneInfo && (
              <div className={styles.zoneInfo} title={`Prices vary by zone. ${zoneInfo.zoneName} specialises in ${zoneInfo.specialty}.`}>
                {zoneInfo.zoneName} · {zoneInfo.specialty} specialty (best prices here)
              </div>
            )}
            <ShopInventory
              items={shopInventory}
              mode="buy"
              onBuy={handleBuy}
              onHaggle={handleHaggle}
              playerDirhams={player.dirhams}
              vocabularyState={vocabularyState}
              inventoryFull={inventoryFull}
            />
          </>
        )}

        {tab === 'sell' && (
          <ShopInventory
            items={inventoryItems}
            mode="sell"
            onSell={handleSell}
            playerDirhams={player.dirhams}
            vocabularyState={vocabularyState}
            inventoryFull={false}
          />
        )}
      </motion.div>

      {toast && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {toast}
        </motion.div>
      )}

      {hagglingItem && (
        <HagglingGame
          itemPrice={hagglingItem.price}
          itemName={hagglingItem.itemName}
          itemNameArabic={hagglingItem.itemNameArabic}
          shopkeeperId={shopId}
          onSuccess={handleHaggleSuccess}
          onCancel={handleHaggleCancel}
        />
      )}

      {confirmSell && (
        <motion.div
          className={styles.confirmOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleConfirmSellNo}
        >
          <motion.div
            className={styles.confirmDialog}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmTitle}>Are you sure?</div>
            <div className={styles.confirmMessage}>
              This item is rare! Sell {confirmSell.itemName} for {confirmSell.sellPrice} dirhams?
            </div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYes} onClick={handleConfirmSellYes}>
                Yes, Sell
              </button>
              <button className={styles.confirmNo} onClick={handleConfirmSellNo}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Memoize component
export default memo(ShopOverlay);
