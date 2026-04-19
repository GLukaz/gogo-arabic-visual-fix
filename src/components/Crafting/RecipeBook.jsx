import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import {
  selectProfessions,
  selectDiscoveredRecipes,
  selectResources,
} from '../../store/slices/craftingSlice.js';
import { PROFESSIONS } from '../../data/professions.js';
import { RECIPES } from '../../data/recipes.js';
import { hasRequiredResources } from '../../utils/craftingLogic.js';
import styles from './RecipeBook.module.css';

const RARITY_COLORS = {
  common: '#9e9e9e',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

/**
 * RecipeBook component
 * Full-screen overlay for browsing and selecting crafting recipes
 *
 * Features:
 * - 6 profession tabs with Arabic names
 * - Recipe grid with locked/unlocked/craftable states
 * - Filter by availability (all/unlocked/craftable)
 * - Search by Arabic/English name
 * - Vocabulary-gated recipe visibility
 * - Click recipe to select for crafting
 *
 * @param {function} onClose - Callback when recipe book is closed
 * @param {function} onSelectRecipe - Callback when recipe is selected (recipeId)
 */
function RecipeBook({ onClose, onSelectRecipe }) {
  const professions = useSelector(selectProfessions);
  const discoveredRecipes = useSelector(selectDiscoveredRecipes);
  const resources = useSelector(selectResources);
  const fsrsCards = useSelector((state) => state.vocabulary.fsrsCards);

  const [selectedProfession, setSelectedProfession] = useState('calligrapher');
  const [filter, setFilter] = useState('all'); // 'all' | 'unlocked' | 'craftable'
  const [searchQuery, setSearchQuery] = useState('');

  const focusTrapRef = useFocusTrap(true, onClose);

  // Emit freeze/unfreeze events
  useEffect(() => {
    EventBus.emit(EVENTS.PLAYER_FREEZE);
    EventBus.emit(EVENTS.CRAFTING_RECIPE_BOOK_OPEN);

    return () => {
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
      EventBus.emit(EVENTS.CRAFTING_RECIPE_BOOK_CLOSE);
    };
  }, []);

  // Get profession data
  const professionData = PROFESSIONS[selectedProfession];
  const professionState = professions[selectedProfession] || null;

  // Filter recipes for selected profession
  const allProfessionRecipes = useMemo(() => {
    return Object.values(RECIPES).filter(
      (recipe) => recipe.professionId === selectedProfession
    );
  }, [selectedProfession]);

  // Apply filters and search
  const filteredRecipes = useMemo(() => {
    let filtered = allProfessionRecipes;

    // Filter by availability
    if (filter === 'unlocked') {
      filtered = filtered.filter((recipe) =>
        discoveredRecipes.includes(recipe.id)
      );
    } else if (filter === 'craftable') {
      filtered = filtered.filter((recipe) => {
        if (!discoveredRecipes.includes(recipe.id)) return false;
        const { canCraft } = hasRequiredResources(recipe.id, resources, RECIPES);
        return canCraft;
      });
    }

    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.nameArabic.includes(searchQuery) ||
          recipe.nameEnglish.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allProfessionRecipes, filter, searchQuery, discoveredRecipes, resources]);

  // Handle recipe click
  const handleRecipeClick = useCallback(
    (recipeId) => {
      if (discoveredRecipes.includes(recipeId)) {
        onSelectRecipe?.(recipeId);
      }
    },
    [discoveredRecipes, onSelectRecipe]
  );

  // Handle close
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Check if prefers reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

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

  const transition = reduceMotion
    ? { duration: 0.1 }
    : { duration: 0.25, ease: 'easeOut' };

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
      aria-labelledby="recipe-book-title"
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
            <h2 id="recipe-book-title" className={styles.titleArabic}>
              كتاب الوصفات
            </h2>
            <span className={styles.titleEnglish}>Recipe Book</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close recipe book"
          >
            Close
          </button>
        </div>

        {/* Profession tabs */}
        <div className={styles.professionTabs}>
          {Object.values(PROFESSIONS).map((profession) => {
            const isSelected = selectedProfession === profession.id;
            const isLearned = !!professions[profession.id];

            return (
              <button
                key={profession.id}
                className={`${styles.professionTab} ${
                  isSelected ? styles.professionTabActive : ''
                } ${!isLearned ? styles.professionTabLocked : ''}`}
                onClick={() => setSelectedProfession(profession.id)}
                disabled={!isLearned}
                aria-label={`${profession.nameEnglish} profession`}
                aria-current={isSelected ? 'true' : undefined}
              >
                <span className={styles.tabArabic}>{profession.nameArabic}</span>
                <span className={styles.tabEnglish}>{profession.nameEnglish}</span>
              </button>
            );
          })}
        </div>

        {/* Filter and search controls */}
        <div className={styles.controls}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${
                filter === 'all' ? styles.filterButtonActive : ''
              }`}
              onClick={() => setFilter('all')}
              aria-label="Show all recipes"
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === 'unlocked' ? styles.filterButtonActive : ''
              }`}
              onClick={() => setFilter('unlocked')}
              aria-label="Show unlocked recipes"
            >
              Unlocked
            </button>
            <button
              className={`${styles.filterButton} ${
                filter === 'craftable' ? styles.filterButtonActive : ''
              }`}
              onClick={() => setFilter('craftable')}
              aria-label="Show craftable recipes"
            >
              Craftable
            </button>
          </div>

          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search recipes"
          />
        </div>

        {/* Recipe grid */}
        <div className={styles.content}>
          {!professionState && (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>
                This profession has not been learned yet.
              </p>
              <p className={styles.emptyStateHint}>
                Speak to {professionData?.nameEnglish} trainer to begin.
              </p>
            </div>
          )}

          {professionState && filteredRecipes.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateText}>No recipes found.</p>
            </div>
          )}

          {professionState && filteredRecipes.length > 0 && (
            <div className={styles.recipeGrid}>
              <AnimatePresence mode="popLayout">
                {filteredRecipes.map((recipe, index) => {
                  const isUnlocked = discoveredRecipes.includes(recipe.id);
                  const { canCraft } = hasRequiredResources(
                    recipe.id,
                    resources,
                    RECIPES
                  );
                  const isCraftable = isUnlocked && canCraft;
                  const isLocked = !isUnlocked;
                  const meetsLevel =
                    professionState.level >= recipe.minLevel;

                  const rarityColor =
                    RARITY_COLORS[recipe.result?.quality || 'common'];

                  return (
                    <motion.button
                      key={recipe.id}
                      className={`${styles.recipeCard} ${
                        isLocked ? styles.recipeCardLocked : ''
                      } ${isCraftable ? styles.recipeCardCraftable : ''}`}
                      onClick={() => handleRecipeClick(recipe.id)}
                      disabled={isLocked}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{
                        ...transition,
                        delay: reduceMotion ? 0 : index * 0.02,
                      }}
                      style={{ borderColor: isUnlocked ? rarityColor : '#555' }}
                      role="button"
                      aria-label={`${recipe.nameEnglish} - ${
                        isLocked ? 'locked' : 'unlocked'
                      }`}
                    >
                      {/* Rarity indicator */}
                      {isUnlocked && (
                        <div
                          className={styles.rarityDot}
                          style={{ backgroundColor: rarityColor }}
                          aria-hidden="true"
                        />
                      )}

                      {/* Lock icon for locked recipes */}
                      {isLocked && (
                        <div className={styles.lockIcon} aria-hidden="true">
                          🔒
                        </div>
                      )}

                      {/* Recipe name */}
                      <div className={styles.recipeNameArabic}>
                        {isUnlocked ? recipe.nameArabic : '???'}
                      </div>
                      <div className={styles.recipeNameEnglish}>
                        {isUnlocked ? recipe.nameEnglish : 'Locked'}
                      </div>

                      {/* Level requirement */}
                      <div className={styles.recipeLevel}>
                        Level {recipe.minLevel}
                        {isLocked && !meetsLevel && ' (Required)'}
                      </div>

                      {/* Craftable indicator */}
                      {isCraftable && (
                        <div className={styles.craftableGlow} aria-hidden="true" />
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer with profession info */}
        {professionState && (
          <div className={styles.footer}>
            <span className={styles.footerText}>
              {professionData?.nameEnglish} - Level {professionState.level} -{' '}
              {discoveredRecipes.filter(
                (id) => RECIPES[id]?.professionId === selectedProfession
              ).length}{' '}
              Recipes Unlocked
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default RecipeBook;
