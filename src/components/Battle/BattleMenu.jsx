/**
 * BattleMenu.jsx — Action selection during player turn.
 *
 * Shows Attack, Magic, Item, Defend, Flee buttons with Arabic labels.
 * Positioned bottom-right, RTL layout. Keyboard shortcuts 1-5.
 * Only visible during ACTION_SELECT state.
 */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { audioManager } from '../../services/audio.js';
import styles from './BattleMenu.module.css';

const MENU_ACTIONS = [
  { id: 'attack', label: 'Attack', arabic: 'هجوم', key: '1' },
  { id: 'magic', label: 'Magic', arabic: 'سحر', key: '2' },
  { id: 'item', label: 'Item', arabic: 'أداة', key: '3' },
  { id: 'defend', label: 'Defend', arabic: 'دفاع', key: '4' },
  { id: 'flee', label: 'Flee', arabic: 'هروب', key: '5' },
  { id: 'combo', label: 'Combo', arabic: 'تركيبة', key: '6' },
];

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function BattleMenu({ visible, availableActions, onAction }) {
  const handleAction = useCallback(
    (actionId) => {
      audioManager.playSFX('click');
      EventBus.emit(EVENTS.BATTLE_ACTION_SELECTED, {
        action: actionId,
        target: 0,
      });
      onAction?.(actionId);
    },
    [onAction]
  );

  // Keyboard shortcuts (1-5)
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      const action = MENU_ACTIONS.find((a) => a.key === e.key);
      if (action && availableActions.includes(action.id)) {
        e.preventDefault();
        handleAction(action.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, availableActions, handleAction]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.menuContainer}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
        >
          {MENU_ACTIONS.filter((a) => availableActions.includes(a.id)).map((action) => (
            <button
              key={action.id}
              className={styles.actionButton}
              onClick={() => handleAction(action.id)}
              aria-label={`${action.label} (${action.key})`}
            >
              <span className={styles.arabicLabel} lang="ar">
                {action.arabic}
              </span>
              <span className={styles.englishLabel}>{action.label}</span>
              <kbd className={styles.shortcutKey}>
                {action.key}
              </kbd>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import PropTypes from 'prop-types';
BattleMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAction: PropTypes.func.isRequired,
};
