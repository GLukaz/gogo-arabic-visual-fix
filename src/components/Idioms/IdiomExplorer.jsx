/**
 * IdiomExplorer — Full-screen overlay for browsing, filtering, and learning Arabic idioms.
 * Phase 94 (IDIOM-02): Browse idioms by category/CEFR level, mark learned, toggle favourites.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  learnIdiom,
  unlearnIdiom,
  toggleFavorite,
  selectLearnedIds,
  selectFavoriteIds,
  selectLearnProgressByCategory,
} from '../../store/slices/idiomSlice.js';
import {
  ARABIC_IDIOMS,
  IDIOM_CATEGORIES,
  CATEGORY_META,
  getIdiomsByCategory,
  searchIdioms,
} from '../../data/arabicIdioms.js';
import styles from './IdiomExplorer.module.css';

/** CEFR badge colour mapping */
const CEFR_COLORS = { A1: '#4caf50', A2: '#2196f3', B1: '#ff9800', B2: '#e63946' };

export default function IdiomExplorer({ onClose, onIdiomLearned, showOnlyUnlearned = false }) {
  const dispatch = useDispatch();
  const learnedIds = useSelector(selectLearnedIds);
  const favoriteIds = useSelector(selectFavoriteIds);
  const progressByCategory = useSelector(selectLearnProgressByCategory);

  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [onlyUnlearned, setOnlyUnlearned] = useState(showOnlyUnlearned);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIdiomId, setExpandedIdiomId] = useState(null);
  const [sortBy, setSortBy] = useState('category');

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Filtered idioms
  const filteredIdioms = useMemo(() => {
    let results = ARABIC_IDIOMS;

    // Search filter
    if (searchQuery.trim()) {
      results = searchIdioms(searchQuery.trim());
    }

    // Category filter
    if (selectedCategory !== 'all') {
      results = results.filter((i) => i.category === selectedCategory);
    }

    // CEFR level filter
    if (selectedLevel !== 'all') {
      results = results.filter((i) => i.cefrLevel === selectedLevel);
    }

    // Learned/unlearned filter
    if (onlyUnlearned) {
      results = results.filter((i) => !learnedSet.has(i.id));
    }

    // Sort
    if (sortBy === 'cefrLevel') {
      const order = { A1: 0, A2: 1, B1: 2, B2: 3 };
      results = [...results].sort((a, b) => order[a.cefrLevel] - order[b.cefrLevel]);
    } else if (sortBy === 'learned') {
      results = [...results].sort((a, b) => {
        const aL = learnedSet.has(a.id) ? 1 : 0;
        const bL = learnedSet.has(b.id) ? 1 : 0;
        return aL - bL;
      });
    }

    return results;
  }, [searchQuery, selectedCategory, selectedLevel, onlyUnlearned, learnedSet, sortBy]);

  const handleLearn = useCallback(
    (idiomId) => {
      dispatch(learnIdiom(idiomId));
      if (onIdiomLearned) onIdiomLearned(idiomId);
    },
    [dispatch, onIdiomLearned]
  );

  const handleUnlearn = useCallback(
    (idiomId) => {
      dispatch(unlearnIdiom(idiomId));
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (idiomId) => {
      dispatch(toggleFavorite(idiomId));
    },
    [dispatch]
  );

  const handleCardClick = useCallback((idiomId) => {
    setExpandedIdiomId((prev) => (prev === idiomId ? null : idiomId));
  }, []);

  // Related idioms for expanded card (3 random from same category)
  const getRelatedIdioms = useCallback(
    (idiom) => {
      const sameCategory = getIdiomsByCategory(idiom.category).filter(
        (i) => i.id !== idiom.id
      );
      const shuffled = [...sameCategory].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    },
    []
  );

  const totalIdioms = ARABIC_IDIOMS.length;

  return (
    <div className={styles.backdrop} role="dialog" aria-label="Arabic Idioms Explorer">
      <div className={styles.overlay}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              <span className={styles.titleArabic}>{'أمثال وحكم عربية'}</span>
              <span className={styles.titleEnglish}>Arabic Idioms &amp; Proverbs</span>
            </h2>
            <div className={styles.progress}>
              Learned: {learnedIds.length}/{totalIdioms}
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(learnedIds.length / totalIdioms) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Filter Bar */}
        <div className={styles.controls}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search idioms (Arabic or English)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search idioms"
          />
          <select
            className={styles.selectFilter}
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            aria-label="Filter by CEFR level"
          >
            <option value="all">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
          <select
            className={styles.selectFilter}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="category">Sort: Category</option>
            <option value="cefrLevel">Sort: Level</option>
            <option value="learned">Sort: Learned</option>
          </select>
          <label className={styles.filterToggle}>
            <input
              type="checkbox"
              checked={onlyUnlearned}
              onChange={(e) => setOnlyUnlearned(e.target.checked)}
              role="checkbox"
              aria-label="Show only unlearned"
            />
            Unlearned only
          </label>
        </div>

        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          <button
            className={`${styles.categoryTab} ${selectedCategory === 'all' ? styles.activeTab : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({totalIdioms})
          </button>
          {IDIOM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
              {progressByCategory[cat] && (
                <span className={styles.catCount}>
                  {' '}
                  {progressByCategory[cat].learned}/{progressByCategory[cat].total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Idiom List */}
        <div className={styles.idiomList}>
          {filteredIdioms.length === 0 && (
            <div className={styles.emptyState}>No idioms match your filters.</div>
          )}
          {filteredIdioms.map((idiom) => {
            const isLearned = learnedSet.has(idiom.id);
            const isFavorite = favoriteSet.has(idiom.id);
            const isExpanded = expandedIdiomId === idiom.id;

            return (
              <div
                key={idiom.id}
                className={`${styles.idiomCard} ${isExpanded ? styles.expandedCard : ''}`}
                data-testid="idiom-card"
                data-category={idiom.category}
                data-learned={String(isLearned)}
                onClick={() => handleCardClick(idiom.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(idiom.id);
                }}
              >
                {/* Card Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardMain}>
                    <div className={styles.arabicText} dir="rtl">
                      {idiom.arabic}
                    </div>
                    <div className={styles.literalText}>{idiom.literal}</div>
                    <div className={styles.meaningText}>{idiom.meaning}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <span
                      className={styles.cefrBadge}
                      style={{ background: CEFR_COLORS[idiom.cefrLevel] }}
                    >
                      {idiom.cefrLevel}
                    </span>
                    <button
                      className={`${styles.favoriteBtn} ${isFavorite ? styles.favoriteActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(idiom.id);
                      }}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? '\u2665' : '\u2661'}
                    </button>
                    {isLearned ? (
                      <button
                        className={styles.learnedBadge}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlearn(idiom.id);
                        }}
                        data-testid={`learned-button-${idiom.id}`}
                        aria-label="Mark as unlearned"
                      >
                        Learned
                      </button>
                    ) : (
                      <button
                        className={styles.learnBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearn(idiom.id);
                        }}
                        data-testid={`learn-button-${idiom.id}`}
                        aria-label="Mark as learned"
                      >
                        Learn
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className={styles.cardDetail}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Transliteration:</span>
                      <span>{idiom.transliteration}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>English Equivalent:</span>
                      <span>{idiom.englishEquivalent}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Usage Example:</span>
                    </div>
                    <div className={styles.usageExample}>
                      <div className={styles.usageArabic} dir="rtl">
                        {idiom.usageExample.arabic}
                      </div>
                      <div className={styles.usageEnglish}>
                        {idiom.usageExample.english}
                      </div>
                    </div>
                    {idiom.origin && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Origin:</span>
                        <span>{idiom.origin}</span>
                      </div>
                    )}
                    {idiom.funFact && (
                      <div className={styles.funFact}>{idiom.funFact}</div>
                    )}

                    {/* Related idioms */}
                    <div className={styles.relatedSection}>
                      <div className={styles.detailLabel}>Related Idioms:</div>
                      <div className={styles.relatedList}>
                        {getRelatedIdioms(idiom).map((rel) => (
                          <div
                            key={rel.id}
                            className={styles.relatedItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(rel.id);
                            }}
                          >
                            <span className={styles.relatedArabic} dir="rtl">
                              {rel.arabic}
                            </span>
                            <span className={styles.relatedMeaning}>{rel.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className={styles.statsFooter}>
          {IDIOM_CATEGORIES.slice(0, 5).map((cat) => (
            <span key={cat} className={styles.statItem}>
              {CATEGORY_META[cat].icon}{' '}
              {progressByCategory[cat]?.learned ?? 0}/{progressByCategory[cat]?.total ?? 0}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
