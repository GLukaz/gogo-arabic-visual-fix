/**
 * TargetSelector.jsx — Enemy target selection for multi-enemy battles.
 *
 * Shows enemy list with HP bars, row indicators (front/back), and damage modifier preview.
 * Defeated enemies are greyed out and non-selectable.
 * Keyboard: arrow keys to navigate, Enter to confirm, ESC to cancel.
 *
 * Props: { visible, enemies, onSelectTarget, onCancel }
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TargetSelector.module.css';

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Row damage modifiers (from MultiTargetManager: Front->Front 1.0, Front->Back 0.8)
const ROW_DAMAGE_MODIFIERS = {
  front: { label: 'أمام', english: 'Front: 100%', modifier: 1.0 },
  back: { label: 'خلف', english: 'Back: 80%', modifier: 0.8 },
};

export default function TargetSelector({ visible, enemies, onSelectTarget, onCancel }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Find first alive enemy on mount / when enemies change
  useEffect(() => {
    if (!visible || !enemies?.length) return;
    const firstAliveIdx = enemies.findIndex((e) => !e.defeated);
    if (firstAliveIdx >= 0) {
      setSelectedIndex(firstAliveIdx);
    }
  }, [visible, enemies]);

  const handleConfirm = useCallback(() => {
    const enemy = enemies?.[selectedIndex];
    if (!enemy || enemy.defeated) return;
    onSelectTarget?.(selectedIndex);
  }, [selectedIndex, enemies, onSelectTarget]);

  // Keyboard navigation
  useEffect(() => {
    if (!visible || !enemies?.length) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move to previous alive enemy
          let next = prev - 1;
          while (next >= 0 && enemies[next]?.defeated) next--;
          return next >= 0 ? next : prev;
        });
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          // Move to next alive enemy
          let next = prev + 1;
          while (next < enemies.length && enemies[next]?.defeated) next++;
          return next < enemies.length ? next : prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, enemies, handleConfirm, onCancel]);

  const selectedEnemy = enemies?.[selectedIndex];
  const selectedRow = selectedEnemy?.row || 'front';
  const damageInfo = ROW_DAMAGE_MODIFIERS[selectedRow] || ROW_DAMAGE_MODIFIERS.front;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.targetList}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
        >
          <p className={styles.selectorTitle} lang="ar">اختر هدف</p>

          {(enemies || []).map((enemy, idx) => {
            const hpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
            const rowInfo = ROW_DAMAGE_MODIFIERS[enemy.row] || ROW_DAMAGE_MODIFIERS.front;
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={`${enemy.enemyId}-${idx}`}
                className={[
                  styles.targetRow,
                  enemy.defeated ? styles.defeated : '',
                  isSelected ? styles.selected : '',
                ].join(' ')}
                onClick={() => {
                  if (!enemy.defeated) {
                    setSelectedIndex(idx);
                  }
                }}
                onDoubleClick={() => {
                  if (!enemy.defeated) {
                    setSelectedIndex(idx);
                    onSelectTarget?.(idx);
                  }
                }}
                role="button"
                tabIndex={enemy.defeated ? -1 : 0}
                aria-label={`${enemy.enemyId} - HP: ${enemy.hp}/${enemy.maxHp}`}
                aria-disabled={enemy.defeated}
              >
                <div className={styles.targetInfo}>
                  <span className={styles.targetName} lang="ar">
                    {enemy.nameArabic || enemy.enemyId}
                  </span>
                  <div className={styles.hpBarWrap}>
                    <div
                      className={`${styles.hpBar} ${hpPercent < 25 ? styles.low : ''}`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>
                <span className={`${styles.rowBadge} ${styles[enemy.row] || styles.front}`} lang="ar">
                  {rowInfo.label}
                </span>
              </div>
            );
          })}

          {/* Damage modifier preview */}
          {selectedEnemy && !selectedEnemy.defeated && (
            <p className={styles.damagePreview}>
              {damageInfo.english}
            </p>
          )}

          {/* Action buttons */}
          <div className={styles.actionRow}>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={!selectedEnemy || selectedEnemy.defeated}
              lang="ar"
            >
              تأكيد
            </button>
            <button className={styles.cancelBtn} onClick={onCancel}>
              ESC
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
