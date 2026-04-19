import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { grammarCategories } from '../../data/grammar.js';
import { selectLessonsByCategory, selectGrammarProgress } from '../../store/slices/grammarSlice.js';
import GrammarLesson from './GrammarLesson.jsx';
import styles from './GrammarModule.module.css';

const GRAMMAR_COUNT_KEY = 'gogo_grammar_lesson_count';

export default function GrammarModule({ onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [newContentToast, setNewContentToast] = useState(null);
  const lessonsByCategory = useSelector(selectLessonsByCategory);
  const overallProgress = useSelector(selectGrammarProgress);

  useEffect(() => {
    const grammarLessons = Object.values(lessonsByCategory).flat();
    const currentCount = grammarLessons.length;
    const storedCount = parseInt(localStorage.getItem(GRAMMAR_COUNT_KEY) || '0', 10);
    if (storedCount > 0 && currentCount > storedCount) {
      const added = currentCount - storedCount;
      setNewContentToast(`${added} new grammar lesson${added > 1 ? 's' : ''} added!`);
      const timer = setTimeout(() => setNewContentToast(null), 4000);
      localStorage.setItem(GRAMMAR_COUNT_KEY, String(currentCount));
      return () => clearTimeout(timer);
    }
    localStorage.setItem(GRAMMAR_COUNT_KEY, String(currentCount));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (selectedLessonId) {
    return <GrammarLesson lessonId={selectedLessonId} onBack={() => setSelectedLessonId(null)} />;
  }

  const filteredLessons = selectedCategory === 'all'
    ? Object.values(lessonsByCategory).flat()
    : lessonsByCategory[selectedCategory] || [];

  return (
    <motion.div className={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.pixelBtnDark}>Back</button>
        <div className={styles.title}>Grammar Lessons</div>
        <div className={styles.spacer} />
      </div>
      <div className={styles.body}>
        {newContentToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={styles.newContentToast}>
            {newContentToast}
          </motion.div>
        )}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${overallProgress}%` }} />
          <div className={styles.progressText}>Overall Progress: {overallProgress}%</div>
        </div>
        <div className={styles.categoryTabs}>
          <button onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? styles.categoryTabActive : styles.categoryTab}>All Lessons</button>
          {grammarCategories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={selectedCategory === category.id ? styles.categoryTabActive : styles.categoryTab}>{category.name}</button>
          ))}
        </div>
        {filteredLessons.length === 0 ? (
          <div className={styles.emptyState}>No lessons in this category yet.</div>
        ) : (
          <div className={styles.lessonGrid}>
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onClick={lesson.isUnlocked ? () => setSelectedLessonId(lesson.id) : undefined} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function LessonCard({ lesson, onClick }) {
  const badgeText = lesson.isCompleted ? 'Completed' : lesson.isCefrLocked ? `Requires Grammar Tree Level ${lesson.cefrGateLevel}` : lesson.isUnlocked ? 'New' : 'Locked';

  const cardClass = lesson.isCompleted
    ? styles.lessonCardCompleted
    : lesson.isCefrLocked
    ? styles.lessonCardCefrLocked
    : lesson.isUnlocked
    ? styles.lessonCardUnlocked
    : styles.lessonCardLocked;

  const badgeClass = lesson.isCompleted
    ? styles.statusBadgeCompleted
    : lesson.isCefrLocked
    ? styles.statusBadgeCefrLocked
    : lesson.isUnlocked
    ? styles.statusBadgeNew
    : styles.statusBadgeLocked;

  return (
    <motion.div
      className={cardClass}
      onClick={lesson.isUnlocked ? onClick : undefined}
      whileTap={lesson.isUnlocked ? { scale: 0.98 } : undefined}
    >
      <div className={badgeClass}>{badgeText}</div>
      {lesson.isCefrLocked && <div className={styles.cefrNote}>Your level: {lesson.currentTreeLevel}</div>}
      <div className={styles.cardTitle}>{lesson.title}</div>
      <div className={styles.cardTitleArabic}>{lesson.titleArabic}</div>
      <div className={styles.cardDifficulty}>Difficulty: {'⭐'.repeat(lesson.difficulty)}</div>
      <div className={styles.cardCategory}>{grammarCategories.find((c) => c.id === lesson.category)?.name || lesson.category}</div>
      {lesson.score && (
        <div className={styles.cardScore}>
          Best Score: {Math.round((lesson.score.exerciseScore + lesson.score.quizScore) / 2)}%<br />Attempts: {lesson.score.attempts}
        </div>
      )}
    </motion.div>
  );
}
