import { useState, useMemo } from 'react';
import { pixelBtnGold, pixelBtnDark } from '../../styles/theme.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import {
  getRootWords,
  ROOT_CATEGORIES,
  getRootsByCategory,
  searchRoots,
  VERBS,
} from '../../data/rootsData.js';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './RootExplorer.module.css';

const CEFR_COLORS = { A1: '#4caf50', A2: '#2196f3', B1: '#ff9800', B2: '#e63946' };

/**
 * RootExplorer Component
 *
 * Interactive Arabic root system explorer showing 3-letter roots
 * and their derived words in a tree visualization.
 *
 * Features:
 * - Two browse modes: Root Families and Word Clusters
 * - Root Families: filter by semantic category, search, click to see derived words
 * - Word Clusters: browse all vocabulary by semantic category with CEFR badges
 * - Pixel-art tree branch visualization for root detail view
 * - Displays meanings and transliterations
 */
export default function RootExplorer({ onBack }) {
  const formatArabic = useFormatArabic();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [expandedWords, setExpandedWords] = useState(new Set());

  // View mode: 'roots' or 'clusters'
  const [viewMode, setViewMode] = useState('roots');
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Get filtered roots (quranic-roots)
  const roots = useMemo(() => {
    if (searchQuery.trim()) {
      return searchRoots(searchQuery);
    }
    return getRootsByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  // Get details for selected root — merges quranic-roots with vocabulary root families
  const rootDetails = useMemo(() => {
    if (!selectedRoot) return null;
    const quranicDetails = getRootWords(selectedRoot.root);

    // Also look up vocabulary words that share this root
    const rootKey = selectedRoot.root.replace(/\s/g, '');
    const vocabMatches = vocabulary.filter((w) => {
      if (!w.root) return false;
      return w.root.replace(/\s/g, '') === rootKey;
    });

    if (quranicDetails) {
      // Merge: quranic words first, then vocabulary words (as objects)
      return {
        ...quranicDetails,
        words: [...(quranicDetails.words || []), ...vocabMatches],
      };
    }

    // Fallback: only vocabulary words for this root
    if (vocabMatches.length > 0) {
      return {
        root: selectedRoot.root,
        rootSpaced: selectedRoot.rootSpaced,
        meaning: selectedRoot.meaning || '',
        words: vocabMatches,
      };
    }

    return quranicDetails;
  }, [selectedRoot]);

  // Build vocabulary root families for enriching the root list
  const vocabRootFamilies = useMemo(() => {
    const families = {};
    for (const word of vocabulary) {
      if (!word.root) continue;
      const root = word.root.replace(/\s/g, '');
      if (!families[root]) {
        families[root] = {
          root,
          rootSpaced: word.root.split('').join(' '),
          words: [],
          meaning: '',
        };
      }
      families[root].words.push(word);
    }
    return families;
  }, []);

  // Compute unique clusters (semantic categories) with word counts
  const clusters = useMemo(() => {
    const map = {};
    for (const w of vocabulary) {
      const cat = w.category || 'general';
      map[cat] = (map[cat] || 0) + 1;
    }
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Words in selected cluster, sorted by frequency descending
  const clusterWords = useMemo(() => {
    if (!selectedCluster) return [];
    return vocabulary
      .filter((w) => (w.category || 'general') === selectedCluster)
      .sort((a, b) => (b.frequency ?? 0) - (a.frequency ?? 0));
  }, [selectedCluster]);

  const handleRootClick = (root) => {
    setSelectedRoot(root);
    setExpandedWords(new Set());
  };

  const handleBackToList = () => {
    setSelectedRoot(null);
    setExpandedWords(new Set());
  };

  const toggleWordDetails = (word) => {
    setExpandedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  };

  // Find verb details for a word
  const getVerbDetails = (arabicWord) => {
    return VERBS.find((v) => v.arabic === arabicWord);
  };

  const activeTabStyle = {
    ...pixelBtnDark,
    background: '#e2b659',
    transform: 'translateY(2px)',
    fontSize: '10px',
    padding: '10px 16px',
    margin: '4px',
  };

  const inactiveTabStyle = {
    ...pixelBtnDark,
    fontSize: '10px',
    padding: '10px 16px',
    margin: '4px',
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Root Explorer</h1>
        <h2 className={styles.titleArabic}>{formatArabic('مستكشف الجذور')}</h2>
        <p className={styles.subtitle}>
          Explore the Arabic root system - 3-letter roots that form related words
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className={styles.viewToggle}>
        <button
          onClick={() => {
            setViewMode('roots');
            setSelectedCluster(null);
          }}
          style={viewMode === 'roots' ? activeTabStyle : inactiveTabStyle}
        >
          Root Families
        </button>
        <button
          onClick={() => {
            setViewMode('clusters');
            setSelectedRoot(null);
          }}
          style={viewMode === 'clusters' ? activeTabStyle : inactiveTabStyle}
        >
          Word Clusters
        </button>
      </div>

      {/* ========== ROOT FAMILIES MODE ========== */}
      {viewMode === 'roots' && !selectedRoot && (
        <>
          {/* Controls */}
          <div className={styles.controls}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search roots (Arabic or English)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
              {Object.entries(ROOT_CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSearchQuery('');
                  }}
                  style={{
                    ...pixelBtnDark,
                    ...(selectedCategory === key
                      ? { background: '#e2b659', transform: 'translateY(2px)' }
                      : {}),
                    fontSize: '10px',
                    padding: '10px 16px',
                    margin: '4px',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Roots Grid */}
          <div className={styles.rootsGrid}>
            {roots.length === 0 ? (
              <div className={styles.noResults}>
                <p>No roots found</p>
                <p className={styles.noResultsHint}>
                  Try a different search or category
                </p>
              </div>
            ) : (
              roots.slice(0, 50).map((root) => (
                <div key={root.root} onClick={() => handleRootClick(root)} className={styles.rootCard}>
                  <div className={styles.rootArabic}>{formatArabic(root.rootSpaced)}</div>
                  <div className={styles.rootMeaning}>{root.meaning}</div>
                  <div className={styles.rootWordCount}>
                    {root.wordCount} {root.wordCount === 1 ? 'word' : 'words'}
                    {vocabRootFamilies[root.root]
                      ? ` + ${vocabRootFamilies[root.root].words.length} vocab`
                      : ''}
                  </div>
                </div>
              ))
            )}
          </div>

          {roots.length > 50 && (
            <p className={styles.moreIndicator}>
              Showing 50 of {roots.length} roots. Refine your search to see more.
            </p>
          )}
        </>
      )}

      {/* ========== ROOT DETAIL VIEW ========== */}
      {viewMode === 'roots' && selectedRoot && (
        <div className={styles.detailView}>
          <button onClick={handleBackToList} style={{ ...pixelBtnDark, marginBottom: '20px' }}>
            ← Back to List
          </button>

          <div className={styles.detailHeader}>
            <div className={styles.detailRootArabic}>
              {formatArabic(rootDetails?.rootSpaced || selectedRoot.rootSpaced)}
            </div>
            <div className={styles.detailMeaning}>
              {rootDetails?.meaning || selectedRoot.meaning}
            </div>
          </div>

          {/* Tree visualization */}
          <div className={styles.tree}>
            <div className={styles.treeTrunk} />
            <div className={styles.wordsContainer}>
              {rootDetails?.words && rootDetails.words.length > 0 ? (
                rootDetails.words.map((wordItem, index) => {
                  const isVocabWord = typeof wordItem === 'object';
                  const arabicText = isVocabWord ? wordItem.arabic : wordItem;
                  const englishText = isVocabWord ? wordItem.english : null;
                  const translitText = isVocabWord ? wordItem.transliteration : null;
                  const cefrLevel = isVocabWord ? wordItem.cefrLevel : null;
                  const verbInfo = !isVocabWord ? getVerbDetails(wordItem) : null;
                  const isExpanded = expandedWords.has(arabicText);

                  return (
                    <div key={index} className={styles.wordBranch}>
                      <div className={styles.branchLine} />
                      <div onClick={() => toggleWordDetails(arabicText)} className={styles.wordCard}>
                        <div className={styles.wordArabic}>{formatArabic(arabicText)}</div>
                        {/* Vocabulary word: show english + transliteration directly */}
                        {isVocabWord && englishText && (
                          <div className={styles.wordEnglish}>{englishText}</div>
                        )}
                        {isVocabWord && translitText && isExpanded && (
                          <div className={styles.wordTranslit}>{translitText}</div>
                        )}
                        {/* CEFR badge for vocabulary words */}
                        {cefrLevel && (
                          <span
                            className={styles.cefrBadge}
                            style={{ background: CEFR_COLORS[cefrLevel] || '#888' }}
                          >
                            {cefrLevel}
                          </span>
                        )}
                        {/* Quranic-roots word: show verb info if available */}
                        {verbInfo && (
                          <>
                            <div className={styles.wordEnglish}>{verbInfo.english}</div>
                            {isExpanded && verbInfo.transliteration && (
                              <div className={styles.wordTranslit}>{verbInfo.transliteration}</div>
                            )}
                          </>
                        )}
                        <div className={styles.tapHint}>
                          {isVocabWord || verbInfo ? (isExpanded ? '▲' : '▼') : ''}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={styles.noWords}>No derived words available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== WORD CLUSTERS MODE — CATEGORY LIST ========== */}
      {viewMode === 'clusters' && !selectedCluster && (
        <div className={styles.rootsGrid}>
          {clusters.map((cl) => (
            <div
              key={cl.name}
              onClick={() => setSelectedCluster(cl.name)}
              className={styles.rootCard}
            >
              <div className={styles.rootMeaning}>{cl.name}</div>
              <div className={styles.rootWordCount}>{cl.count} words</div>
            </div>
          ))}
        </div>
      )}

      {/* ========== WORD CLUSTERS MODE — CLUSTER DETAIL ========== */}
      {viewMode === 'clusters' && selectedCluster && (
        <div className={styles.detailView}>
          <button
            onClick={() => setSelectedCluster(null)}
            style={{ ...pixelBtnDark, marginBottom: '20px' }}
          >
            ← Back to Clusters
          </button>

          <div className={styles.detailHeader}>
            <div className={styles.detailMeaning}>
              {selectedCluster} ({clusterWords.length} words)
            </div>
          </div>

          <div className={styles.wordsContainer}>
            {clusterWords.map((word) => (
              <div key={word.id} className={styles.clusterWordRow}>
                <div className={`${styles.wordArabic} ${styles.clusterWordArabic}`}>
                  {formatArabic(word.arabic)}
                </div>
                <div className={styles.wordEnglish}>{word.english}</div>
                {word.transliteration && (
                  <div className={styles.wordTranslit}>{word.transliteration}</div>
                )}
                {word.cefrLevel && (
                  <span
                    className={styles.cefrBadgeSmall}
                    style={{ background: CEFR_COLORS[word.cefrLevel] || '#888' }}
                  >
                    {word.cefrLevel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <button onClick={onBack} style={{ ...pixelBtnGold, marginTop: '20px' }}>
        Back to Menu
      </button>
    </div>
  );
}
