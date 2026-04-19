import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { normalizeArabicNumber, formatAsEasternArabic } from '../../utils/arabicNumbers.js';
import styles from './ShopOverlay.module.css';

/**
 * HagglingGame — Arabic numeral negotiation mini-game
 *
 * Props:
 * - itemPrice: number — Original item price
 * - itemName: string — Item name (English)
 * - itemNameArabic: string — Item name (Arabic)
 * - shopkeeperId: string — Shop identifier
 * - onSuccess: (finalPrice: number) => void — Called when haggling succeeds
 * - onCancel: () => void — Called when haggling is cancelled
 */
function HagglingGame({ itemPrice, itemName, itemNameArabic, shopkeeperId: _shopkeeperId, onSuccess, onCancel }) {
  const [offerInput, setOfferInput] = useState('');
  const [offerValue, setOfferValue] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', messageArabic: '', type: 'neutral' });
  const [shopkeeperMood, setShopkeeperMood] = useState('neutral');

  const inputRef = useRef(null);

  const MAX_ATTEMPTS = 3;
  const MIN_DISCOUNT = 0.10; // 10% off minimum
  const MAX_DISCOUNT = 0.30; // 30% off maximum

  const MIN_PRICE = Math.floor(itemPrice * (1 - MAX_DISCOUNT)); // Best possible price
  const SWEET_SPOT = Math.floor(itemPrice * (1 - MIN_DISCOUNT)); // Easy acceptance
  const MERCHANT_TARGET = Math.floor(itemPrice * 0.85); // 15% discount target

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Escape key to cancel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const evaluateOffer = (offer) => {
    if (offer <= 0 || offer > itemPrice * 2) {
      return { type: 'insulting', message: "That's insulting!", messageArabic: 'أنت تمزح؟', mood: 'offended' };
    }
    if (offer < MIN_PRICE) {
      return { type: 'too_low', message: 'Way too low!', messageArabic: 'أقل بكثير!', mood: 'offended' };
    }
    if (offer < MERCHANT_TARGET) {
      return { type: 'too_low', message: 'Still too low...', messageArabic: 'لا يزال منخفض...', mood: 'thinking' };
    }
    if (offer <= SWEET_SPOT) {
      return { type: 'deal', message: 'Deal!', messageArabic: 'اتفقنا!', mood: 'pleased' };
    }
    if (offer <= itemPrice) {
      return { type: 'deal', message: 'Gladly!', messageArabic: 'بكل سرور!', mood: 'pleased' };
    }
    return { type: 'too_high', message: "That's more than I asked!", messageArabic: 'هذا أكثر مما طلبت!', mood: 'pleased' };
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setOfferInput(input);

    // Normalize to get integer value
    const normalized = normalizeArabicNumber(input);
    setOfferValue(normalized);
  };

  const handleSubmitOffer = () => {
    if (offerValue === 0) {
      setFeedback({ message: 'Enter a valid offer!', messageArabic: 'أدخل عرضًا صالحًا!', type: 'neutral' });
      return;
    }

    const result = evaluateOffer(offerValue);
    setFeedback({ message: result.message, messageArabic: result.messageArabic, type: result.type });
    setShopkeeperMood(result.mood);
    setAttempts(attempts + 1);

    if (result.type === 'deal') {
      // Success! Close modal and trigger purchase
      setTimeout(() => {
        onSuccess(offerValue);
      }, 500);
    }
  };

  const handlePayFullPrice = () => {
    onSuccess(itemPrice);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitOffer();
    }
  };

  const outOfAttempts = attempts >= MAX_ATTEMPTS && feedback.type !== 'deal';

  // Mood emoji
  const moodEmoji = {
    neutral: '🤝',
    thinking: '🤔',
    pleased: '😊',
    offended: '😠',
  }[shopkeeperMood];

  // Price display
  const priceEastern = formatAsEasternArabic(itemPrice);
  const offerEastern = offerValue > 0 ? formatAsEasternArabic(offerValue) : '';

  return (
    <motion.div
      className={styles.confirmOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Click overlay to cancel (but not the dialog itself)
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <motion.div
        className={styles.hagglingDialog}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.hagglingHeader}>
          <div className={styles.hagglingTitle}>Haggling (مساومة)</div>
          <div className={styles.moodEmoji}>{moodEmoji}</div>
        </div>

        <div className={styles.hagglingBody}>
          <div className={styles.itemInfo}>
            <div className={styles.itemNameArabic}>{itemNameArabic}</div>
            <div className={styles.itemName}>{itemName}</div>
          </div>

          <div className={styles.priceInfo}>
            <div className={styles.merchantWants}>Merchant wants:</div>
            <div className={styles.priceArabic}>{priceEastern}</div>
            <div className={styles.priceWestern}>({itemPrice} dirhams)</div>
          </div>

          {!outOfAttempts && feedback.type !== 'deal' && (
            <>
              <div className={styles.offerSection}>
                <label htmlFor="haggle-offer" className={styles.offerLabel}>
                  Your offer:
                </label>
                <div className={styles.offerInputRow}>
                  <input
                    ref={inputRef}
                    id="haggle-offer"
                    type="text"
                    className={styles.offerInput}
                    value={offerInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="٥٠٠ or 500"
                    aria-label="Enter your price offer"
                    maxLength={6}
                  />
                  <button
                    className={styles.goBtn}
                    onClick={handleSubmitOffer}
                    disabled={offerValue === 0}
                  >
                    Go
                  </button>
                </div>
                <div className={styles.hint}>Type in Arabic (٠-٩) or Western (0-9)</div>
                {offerEastern && (
                  <div className={styles.normalizedOffer}>
                    {offerEastern} = {offerValue} dirhams
                  </div>
                )}
              </div>

              {feedback.message && (
                <div className={styles.feedbackBox} role="status" aria-live="polite">
                  <div className={styles.feedbackArabic}>{feedback.messageArabic}</div>
                  <div className={styles.feedbackEnglish}>{feedback.message}</div>
                </div>
              )}

              <div className={styles.attemptsRow}>Attempts: {attempts}/{MAX_ATTEMPTS}</div>
            </>
          )}

          {feedback.type === 'deal' && (
            <div className={styles.dealSuccess}>
              <div className={styles.dealArabic}>{feedback.messageArabic}</div>
              <div className={styles.dealEnglish}>{feedback.message}</div>
              <div className={styles.dealPrice}>
                Final price: {formatAsEasternArabic(offerValue)} ({offerValue} dirhams)
              </div>
            </div>
          )}

          {outOfAttempts && (
            <div className={styles.outOfAttempts}>
              <div className={styles.outMessage}>Out of attempts!</div>
              <div className={styles.outHint}>You can still buy at full price or cancel.</div>
            </div>
          )}
        </div>

        <div className={styles.hagglingActions}>
          {outOfAttempts && (
            <button className={styles.payFullBtn} onClick={handlePayFullPrice}>
              Pay Full Price ({itemPrice})
            </button>
          )}
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(HagglingGame);
