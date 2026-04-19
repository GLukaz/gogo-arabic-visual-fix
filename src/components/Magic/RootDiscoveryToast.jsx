/**
 * RootDiscoveryToast.jsx — Toast notification for magic events.
 *
 * Listens for MAGIC_ROOT_DISCOVERED, MAGIC_ROOT_LEVEL_UP, and MAGIC_FORM_UNLOCKED.
 * Queues notifications and displays one at a time with animations.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { ELEMENT_INFO } from '../../data/rootMagic.js';
import styles from './RootDiscoveryToast.module.css';

const TOAST_DURATION = 3000;

export default function RootDiscoveryToast() {
  const [queue, setQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    const onRootDiscovered = ({ rootId, element }) => {
      setQueue((prev) => [
        ...prev,
        {
          type: 'discovered',
          rootId,
          element,
          timestamp: Date.now(),
        },
      ]);
    };

    const onRootLevelUp = ({ rootId, element, level }) => {
      setQueue((prev) => [
        ...prev,
        {
          type: 'levelup',
          rootId,
          element,
          level,
          timestamp: Date.now(),
        },
      ]);
    };

    const onFormUnlocked = ({ rootId, element, form }) => {
      setQueue((prev) => [
        ...prev,
        {
          type: 'form',
          rootId,
          element,
          form,
          timestamp: Date.now(),
        },
      ]);
    };

    EventBus.on(EVENTS.MAGIC_ROOT_DISCOVERED, onRootDiscovered);
    EventBus.on(EVENTS.MAGIC_ROOT_LEVEL_UP, onRootLevelUp);
    EventBus.on(EVENTS.MAGIC_FORM_UNLOCKED, onFormUnlocked);

    return () => {
      EventBus.off(EVENTS.MAGIC_ROOT_DISCOVERED, onRootDiscovered);
      EventBus.off(EVENTS.MAGIC_ROOT_LEVEL_UP, onRootLevelUp);
      EventBus.off(EVENTS.MAGIC_FORM_UNLOCKED, onFormUnlocked);
    };
  }, []);

  // Process queue
  useEffect(() => {
    if (currentToast || queue.length === 0) return;

    const nextToast = queue[0];
    setCurrentToast(nextToast);
    setQueue((prev) => prev.slice(1));

    const timer = setTimeout(() => {
      setCurrentToast(null);
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [currentToast, queue]);

  if (!currentToast) return null;

  const elementInfo = ELEMENT_INFO[currentToast.element];
  const elementColor = `#${elementInfo.color.toString(16).padStart(6, '0')}`;

  let title = '';
  let subtitle = '';

  switch (currentToast.type) {
    case 'discovered':
      title = 'Root Discovered!';
      subtitle = `${currentToast.rootId} (${elementInfo.label})`;
      break;
    case 'levelup':
      title = 'Level Up!';
      subtitle = `${currentToast.rootId} → Lvl ${currentToast.level}`;
      break;
    case 'form':
      title = 'Form Unlocked!';
      subtitle = `${currentToast.rootId} → Form ${currentToast.form}`;
      break;
    default:
      break;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={styles.toastPositioner}
      >
        <div
          className={styles.toastCard}
          style={{ '--element-color': elementColor }}
        >
          <div className={styles.toastTitle}>
            {title}
          </div>
          <div className={styles.toastSubtitle}>
            {subtitle}
          </div>
          <div className={styles.toastElement}>
            {elementInfo.arabic}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
