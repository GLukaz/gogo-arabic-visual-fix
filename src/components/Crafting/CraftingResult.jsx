import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { RECIPES } from '../../data/recipes.js';
import { PROFESSIONS } from '../../data/professions.js';
import { hasRequiredResources, calculateProfessionXP } from '../../utils/craftingLogic.js';
import { selectResources, selectProfessions } from '../../store/slices/craftingSlice.js';
import styles from './CraftingResult.module.css';

const RARITY_COLORS = {
  common: '#FFFFFF',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FFD700',
};

const RARITY_NAMES_ARABIC = {
  common: 'أبيض',
  uncommon: 'أخضر',
  rare: 'أزرق',
  epic: 'بنفسجي',
  legendary: 'ذهبي',
};

const ARABIC_NUMERALS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert number to Arabic numerals
 * @param {number} num - Number to convert
 * @returns {string} Arabic numeral string
 */
function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((digit) => (digit === '.' ? '.' : ARABIC_NUMERALS[parseInt(digit, 10)]))
    .join('');
}

/**
 * CraftingResult component
 * Post-crafting result screen showing quality, stats, and XP gained
 *
 * @param {string} recipeId - Recipe ID that was crafted
 * @param {string} quality - Quality tier achieved (common|uncommon|rare|epic|legendary)
 * @param {number} accuracy - Accuracy score (0-1)
 * @param {number} xpGained - XP gained from crafting
 * @param {function} onClose - Close callback
 * @param {function} onCraftAgain - Craft again callback
 */
function CraftingResult({ recipeId, quality, accuracy, xpGained, onClose, onCraftAgain }) {
  const resources = useSelector(selectResources);
  const professions = useSelector(selectProfessions);

  const focusTrapRef = useFocusTrap(true, onClose);

  const recipe = RECIPES[recipeId];
  if (!recipe) {
    console.error(`[CraftingResult] Recipe '${recipeId}' not found`);
    return null;
  }

  const professionState = professions[recipe.professionId];
  const professionData = PROFESSIONS[recipe.professionId];

  // Calculate profession XP progress
  const xpProgress = useMemo(() => {
    if (!professionState) return { current: 0, required: 100, percent: 0 };
    return calculateProfessionXP(professionState.xp, professionState.level);
  }, [professionState]);

  // Check if can craft again
  const canCraftAgain = useMemo(() => {
    const check = hasRequiredResources(recipeId, resources, RECIPES);
    return check.canCraft;
  }, [recipeId, resources]);

  // Determine if this is a consumable (has buffEffect)
  const isConsumable = Boolean(recipe.buffEffect);
  const isEnchantment = recipe.category === 'enchantment';

  // Play sound based on quality
  useEffect(() => {
    if (quality === 'legendary' || quality === 'epic') {
      EventBus.emit(EVENTS.SFX_LEVELUP);
    } else {
      EventBus.emit(EVENTS.SFX_CORRECT);
    }

    // Emit VFX for legendary quality
    if (quality === 'legendary') {
      EventBus.emit(EVENTS.VFX_PARTICLES_BURST, { x: 400, y: 300, color: 0xffd700 });
    }
  }, [quality]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCraftAgain = useCallback(() => {
    if (canCraftAgain) {
      onCraftAgain();
    }
  }, [canCraftAgain, onCraftAgain]);

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <motion.div
        ref={focusTrapRef}
        className={`${styles.container} ${styles[`quality_${quality}`]}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Quality Badge */}
        <div
          className={styles.qualityBadge}
          style={{ borderColor: RARITY_COLORS[quality], backgroundColor: `${RARITY_COLORS[quality]}22` }}
        >
          <span className={styles.qualityText} style={{ color: RARITY_COLORS[quality] }}>
            {RARITY_NAMES_ARABIC[quality]}
          </span>
        </div>

        {/* Item Name */}
        <div className={styles.itemName}>
          <h2 className={styles.nameArabic}>{recipe.nameArabic}</h2>
          <p className={styles.nameEnglish}>{recipe.nameEnglish}</p>
        </div>

        {/* Item Stats or Buff Effect */}
        {isConsumable && recipe.buffEffect && (
          <div className={styles.buffDisplay}>
            <div className={styles.buffLabel}>تأثير</div>
            <div className={styles.buffContent}>
              <span className={styles.buffStat}>{recipe.buffEffect.stat}</span>
              <span className={styles.buffValue}>+{toArabicNumerals(recipe.buffEffect.value)}</span>
              <span className={styles.buffDuration}>
                ({toArabicNumerals(Math.floor(recipe.buffEffect.duration / 1000))}ث)
              </span>
            </div>
          </div>
        )}

        {isEnchantment && (
          <div className={styles.inscriptionDisplay}>
            <div className={styles.inscriptionLabel}>نقش</div>
            <p className={styles.inscriptionText}>بسم الله الرحمن الرحيم</p>
            <p className={styles.inscriptionBonus}>+٥ قوة</p>
          </div>
        )}

        {/* XP Gained */}
        <div className={styles.xpSection}>
          <div className={styles.xpGained}>
            <span className={styles.xpLabel}>خبرة مكتسبة:</span>
            <span className={styles.xpValue}>{toArabicNumerals(xpGained)} XP</span>
          </div>

          {/* Profession XP Progress Bar */}
          {professionState && (
            <div className={styles.professionProgress}>
              <div className={styles.professionName}>{professionData.nameArabic}</div>
              <div className={styles.xpBar}>
                <div className={styles.xpBarFill} style={{ width: `${xpProgress.percent}%` }} />
              </div>
              <div className={styles.xpText}>
                {toArabicNumerals(xpProgress.current)} / {toArabicNumerals(xpProgress.required)}
              </div>
            </div>
          )}
        </div>

        {/* Accuracy Score */}
        <div className={styles.accuracySection}>
          <span className={styles.accuracyLabel}>دقة:</span>
          <span className={styles.accuracyValue}>{toArabicNumerals(Math.floor(accuracy * 100))}%</span>
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <button className={styles.closeButton} onClick={handleClose}>
            إغلاق
          </button>
          <button
            className={styles.craftAgainButton}
            onClick={handleCraftAgain}
            disabled={!canCraftAgain}
            title={!canCraftAgain ? 'Not enough resources' : ''}
          >
            صنع مرة أخرى
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CraftingResult;
