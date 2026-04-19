import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { giveNpcGift, selectFriendship, selectGiftsGivenToNpc } from '../../store/slices/npcSlice.js';
import { selectInventoryItems, removeItem } from '../../store/slices/inventorySlice.js';
import { GIFTS_BY_ID, computeGiftDelta } from '../../data/gifts.js';
import { getFriendshipTier, TIER_DISPLAY } from '../../data/relationshipRewards.js';
import styles from './GiftOverlay.module.css';

// ─── Category icons ───
const CATEGORY_ICONS = {
  food: '🍞',
  crafts: '🏺',
  books: '📖',
  clothing: '👘',
  tools: '🔧',
  luxury: '💎',
  cultural: '🕌',
};

// ─── Gift categories (for filtering) ───
const GIFT_CATEGORIES = new Set(['food', 'crafts', 'books', 'clothing', 'tools', 'luxury', 'cultural']);

// ─── Reaction data ───
const REACTIONS = {
  loved: {
    arabic: 'شكراً جزيلاً! أحبّ هذا!',
    english: 'Thank you so much! I love this!',
    className: 'reactionLoved',
  },
  liked: {
    arabic: 'شكراً! هذا جميل',
    english: 'Thank you! This is nice',
    className: 'reactionLiked',
  },
  normal: {
    arabic: 'شكراً',
    english: 'Thank you',
    className: 'reactionNormal',
  },
  disliked: {
    arabic: 'هذا... ليس ما أريد',
    english: 'This... is not what I want',
    className: 'reactionDisliked',
  },
};

/**
 * Determine the reaction type based on the gift delta.
 */
function getReactionType(delta) {
  if (delta >= 20) return 'loved';
  if (delta >= 10) return 'liked';
  if (delta < 0) return 'disliked';
  return 'normal';
}

/**
 * Determine the preference indicator for a gift/NPC combo.
 * Returns emoji string or null if preference is unknown.
 *
 * Rules:
 *  - If friendship >= 50, all preferences are revealed
 *  - Otherwise, only show preference if the player has given that gift category before
 */
function getPreferenceIndicator(gift, npcId, friendship, giftsGiven) {
  if (!gift) return null;

  const prefsRevealed = friendship >= 50;

  if (!prefsRevealed) {
    // Check if player has given a gift from this category before
    const hasGivenCategory = giftsGiven.some((gId) => {
      const g = GIFTS_BY_ID[gId];
      return g && g.category === gift.category;
    });
    if (!hasGivenCategory) return null;
  }

  const { npcPreferences } = gift;
  if (npcPreferences.loved.includes(npcId)) return '\u2764\uFE0F';  // ❤️
  if (npcPreferences.liked.includes(npcId)) return '\uD83D\uDC4D';  // 👍
  if (npcPreferences.disliked.includes(npcId)) return '\uD83D\uDC4E'; // 👎
  return '\u2753'; // ❓
}

/**
 * Get the expected reaction text for the detail panel.
 */
function getExpectedReaction(gift, npcId, friendship, giftsGiven) {
  const pref = getPreferenceIndicator(gift, npcId, friendship, giftsGiven);
  if (!pref) return 'Reaction unknown';
  if (pref === '\u2764\uFE0F') return 'They will love this!';
  if (pref === '\uD83D\uDC4D') return 'They will like this';
  if (pref === '\uD83D\uDC4E') return 'They won\'t like this...';
  return 'Uncertain reaction';
}

/**
 * GiftOverlay — Full-screen overlay for giving gifts to an NPC.
 *
 * Props:
 *   npcId         — NPC identifier
 *   npcName       — English display name
 *   npcNameArabic — Arabic display name
 *   npcPortrait   — portrait asset key or URL (optional)
 *   onClose       — callback to close the overlay
 *   onGift        — callback after a gift is successfully given ({ giftId, delta, reactionType })
 */
function GiftOverlay({ npcId, npcName, npcNameArabic, npcPortrait, onClose, onGift }) {
  const dispatch = useDispatch();
  const inventoryItems = useSelector(selectInventoryItems);
  const friendship = useSelector(selectFriendship(npcId));
  const giftsGiven = useSelector(selectGiftsGivenToNpc(npcId));

  const [selectedGiftId, setSelectedGiftId] = useState(null);
  const [reaction, setReaction] = useState(null); // { type, arabic, english }
  const reactionTimerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    };
  }, []);

  // Filter inventory to only giftable items (items that exist in GIFTS_BY_ID)
  const giftableItems = inventoryItems.filter((item) => {
    const gift = GIFTS_BY_ID[item.itemId];
    return gift && GIFT_CATEGORIES.has(gift.category) && !item.locked;
  });

  const selectedGift = selectedGiftId ? GIFTS_BY_ID[selectedGiftId] : null;
  const selectedInventoryItem = selectedGiftId
    ? giftableItems.find((item) => item.itemId === selectedGiftId)
    : null;

  // Friendship display
  const tier = getFriendshipTier(friendship);
  const tierDisplay = TIER_DISPLAY[tier];

  const handleSelectGift = useCallback((giftId) => {
    if (reaction) return; // Don't allow selection during reaction
    setSelectedGiftId((prev) => (prev === giftId ? null : giftId));
  }, [reaction]);

  const handleGiveGift = useCallback(() => {
    if (!selectedGift || !selectedInventoryItem || reaction) return;

    const delta = computeGiftDelta(selectedGift, npcId);
    const reactionType = getReactionType(delta);
    const reactionData = REACTIONS[reactionType];

    // Dispatch gift action
    dispatch(giveNpcGift({ npcId, giftId: selectedGiftId, relationshipDelta: delta }));

    // Remove item from inventory
    dispatch(removeItem({ itemId: selectedGiftId, quantity: 1 }));

    // Show reaction
    setReaction({
      type: reactionType,
      arabic: reactionData.arabic,
      english: reactionData.english,
      className: reactionData.className,
    });

    // Notify parent
    if (onGift) {
      onGift({ giftId: selectedGiftId, delta, reactionType });
    }

    // Clear selection
    setSelectedGiftId(null);

    // Auto-dismiss reaction after 2 seconds
    reactionTimerRef.current = setTimeout(() => {
      setReaction(null);
    }, 2000);
  }, [selectedGift, selectedInventoryItem, reaction, npcId, selectedGiftId, dispatch, onGift]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && !reaction) {
      onClose?.();
    }
  }, [onClose, reaction]);

  return (
    <div className={styles.overlay} data-testid="gift-overlay">
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        data-testid="gift-overlay-backdrop"
      />

      {/* Main panel */}
      <div className={styles.panel} role="dialog" aria-label="Gift giving">
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close gift overlay"
          data-testid="gift-close-btn"
        >
          x
        </button>

        {/* NPC Header */}
        <div className={styles.header}>
          {npcPortrait ? (
            <img
              src={npcPortrait}
              alt={npcName}
              className={styles.portrait}
            />
          ) : (
            <div className={styles.portraitPlaceholder}>
              {npcName?.charAt(0) || '?'}
            </div>
          )}

          <div className={styles.npcInfo}>
            <h3 className={styles.npcName}>{npcName}</h3>
            {npcNameArabic && (
              <p className={styles.npcNameArabic} dir="rtl">{npcNameArabic}</p>
            )}

            {/* Friendship bar */}
            <div className={styles.friendshipWrap}>
              <span className={styles.friendshipLabel}>Friendship</span>
              <div className={styles.friendshipBarOuter}>
                <div
                  className={styles.friendshipBarInner}
                  style={{
                    width: `${friendship}%`,
                    backgroundColor: tierDisplay.color,
                  }}
                  data-testid="friendship-bar"
                />
              </div>
              <span className={styles.friendshipValue}>{friendship}</span>
              <span
                className={styles.tierBadge}
                style={{ backgroundColor: tierDisplay.color }}
                data-testid="tier-badge"
              >
                {tierDisplay.label}
              </span>
            </div>
          </div>
        </div>

        {/* Gift Grid */}
        <div className={styles.giftSection}>
          <h4 className={styles.sectionTitle}>Select a Gift</h4>

          {giftableItems.length === 0 ? (
            <div className={styles.emptyState} data-testid="empty-state">
              No giftable items in inventory.<br />
              <span dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }}>
                لا توجد هدايا في الحقيبة
              </span>
            </div>
          ) : (
            <div className={styles.giftGrid} data-testid="gift-grid">
              {giftableItems.map((item) => {
                const gift = GIFTS_BY_ID[item.itemId];
                if (!gift) return null;

                const isSelected = selectedGiftId === item.itemId;
                const prefIndicator = getPreferenceIndicator(
                  gift, npcId, friendship, giftsGiven
                );

                return (
                  <button
                    key={item.itemId}
                    className={`${styles.giftCard} ${isSelected ? styles.giftCardSelected : ''}`}
                    onClick={() => handleSelectGift(item.itemId)}
                    data-testid={`gift-card-${item.itemId}`}
                    aria-pressed={isSelected}
                  >
                    <div className={styles.giftCardHeader}>
                      <span className={styles.giftCategory}>
                        {CATEGORY_ICONS[gift.category] || '🎁'}
                      </span>
                      {prefIndicator && (
                        <span
                          className={styles.giftPreference}
                          data-testid={`pref-${item.itemId}`}
                        >
                          {prefIndicator}
                        </span>
                      )}
                    </div>
                    <div className={styles.giftNameArabic} dir="rtl">
                      {gift.nameArabic}
                    </div>
                    <div className={styles.giftName}>{gift.name}</div>
                    <div className={styles.giftMeta}>
                      <span className={styles.giftValue}>{gift.value} dh</span>
                      <span className={styles.giftQuantity}>x{item.quantity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected gift detail panel */}
        {selectedGift && (
          <div className={styles.detailPanel} data-testid="detail-panel">
            <div className={styles.detailInfo}>
              <div className={styles.detailArabic} dir="rtl">
                {selectedGift.nameArabic}
              </div>
              <div className={styles.detailEnglish}>
                {selectedGift.name}
              </div>
              <div className={styles.detailReaction}>
                {getExpectedReaction(selectedGift, npcId, friendship, giftsGiven)}
              </div>
            </div>
            <button
              className={styles.giveBtn}
              onClick={handleGiveGift}
              disabled={!selectedGift}
              data-testid="give-btn"
            >
              Give Gift
            </button>
          </div>
        )}

        {/* Reaction animation */}
        {reaction && (
          <div className={styles.reactionOverlay} data-testid="reaction-overlay">
            <div className={`${styles.reactionContent} ${styles[reaction.className]}`}>
              <div className={styles.reactionArabic} dir="rtl">
                {reaction.arabic}
              </div>
              <div className={styles.reactionEnglish}>
                {reaction.english}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiftOverlay;
