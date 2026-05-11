/**
 * LoreCodex — Full-screen overlay for browsing discovered lore entries.
 * Phase 79 (NAR-04): "Library of Knowledge" (مكتبة المعرفة)
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAllRead, selectDiscoveredIds, selectTotalDiscovered, selectNewEntryIds } from '../../store/slices/loreSlice.js';
import { LORE_ENTRIES, LORE_CATEGORIES, CATEGORY_META, getCategoryTotals } from '../../data/loreEntries.js';
import LoreEntryCard from './LoreEntryCard.jsx';
import styles from './LoreCodex.module.css';

const CATEGORY_TOTALS = getCategoryTotals();

export default function LoreCodex({ onClose }) {
  const dispatch = useDispatch();
  const discovered = useSelector(selectDiscoveredIds);
  const totalDiscovered = useSelector(selectTotalDiscovered);
  const newEntryIds = useSelector(selectNewEntryIds);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiscoveredOnly, setShowDiscoveredOnly] = useState(false);

  // ESC to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Mark all as read when opening codex
  useEffect(() => {
    if (newEntryIds.length > 0) {
      dispatch(markAllRead());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const newEntrySet = useMemo(() => new Set(newEntryIds), [newEntryIds]);

  const filteredEntries = useMemo(() => {
    let entries = LORE_ENTRIES;

    // Category filter
    if (activeCategory !== 'all') {
      entries = entries.filter((e) => e.category === activeCategory);
    }

    // Discovered-only filter
    if (showDiscoveredOnly) {
      entries = entries.filter((e) => e.id in discovered);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.titleArabic.includes(searchQuery) ||
          e.content.toLowerCase().includes(q) ||
          e.keyTerm.english.toLowerCase().includes(q) ||
          e.keyTerm.arabic.includes(searchQuery)
      );
    }

    return entries;
  }, [activeCategory, showDiscoveredOnly, searchQuery, discovered]);

  const handleCategoryClick = useCallback((cat) => {
    setActiveCategory(cat);
  }, []);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>
              <span className={styles.titleArabic} dir="rtl">مكتبة المعرفة</span>
              <span className={styles.titleEnglish}>Library of Knowledge</span>
            </h1>
            <div className={styles.progress}>
              {totalDiscovered} / {LORE_ENTRIES.length} discovered
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close codex">
            &times;
          </button>
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search lore entries"
          />
          <label className={styles.filterToggle}>
            <input
              type="checkbox"
              checked={showDiscoveredOnly}
              onChange={(e) => setShowDiscoveredOnly(e.target.checked)}
            />
            Discovered only
          </label>
        </div>

        {/* Category tabs */}
        <nav className={styles.categoryTabs} role="tablist">
          <button
            className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.activeTab : ''}`}
            onClick={() => handleCategoryClick('all')}
            role="tab"
            aria-selected={activeCategory === 'all'}
          >
            All ({totalDiscovered}/{LORE_ENTRIES.length})
          </button>
          {LORE_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const catDiscovered = LORE_ENTRIES.filter(
              (e) => e.category === cat && e.id in discovered
            ).length;
            return (
              <button
                key={cat}
                className={`${styles.categoryTab} ${activeCategory === cat ? styles.activeTab : ''}`}
                onClick={() => handleCategoryClick(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {meta.icon} {meta.label} ({catDiscovered}/{CATEGORY_TOTALS[cat]})
              </button>
            );
          })}
        </nav>

        {/* Entry list */}
        <div className={styles.entryList}>
          {filteredEntries.length === 0 ? (
            <div className={styles.emptyState}>
              {searchQuery ? 'No entries match your search.' : 'No entries discovered yet. Explore the world!'}
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isDiscovered = entry.id in discovered;
              if (!isDiscovered) {
                return (
                  <div key={entry.id} className={styles.lockedEntry}>
                    <span className={styles.lockedIcon}>🔒</span>
                    <span className={styles.lockedRarity}>{entry.rarity}</span>
                    <span className={styles.lockedCategory}>
                      {CATEGORY_META[entry.category]?.icon} {entry.category}
                    </span>
                  </div>
                );
              }
              return (
                <LoreEntryCard
                  key={entry.id}
                  entry={entry}
                  meta={discovered[entry.id]}
                  isNew={newEntrySet.has(entry.id)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
