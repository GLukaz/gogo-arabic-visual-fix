/**
 * MagicOverlay.jsx — Spell hotbar overlay shown during battle.
 *
 * Shows 6-slot hotbar with spell icons, MP bar, and affinity indicator.
 * Listens to EventBus for cast completion and MP depletion events.
 * Emits MAGIC_CAST_REQUESTED on spell click.
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { selectEquippedSpells, selectAffinity } from '../../store/slices/magicSlice.js';
import { ELEMENT_INFO } from '../../data/rootMagic.js';
import styles from './MagicOverlay.module.css';

function SpellSlot({ spell, slot, playerMP, onClick, onRightClick }) {
  const isEmpty = !spell;
  const disabled = spell && playerMP < spell.mpCost;

  const elementInfo = spell ? ELEMENT_INFO[spell.element] : null;
  const elementColor = elementInfo ? `#${elementInfo.color.toString(16).padStart(6, '0')}` : '#666';

  if (isEmpty) {
    return (
      <button
        className={`${styles.spellSlotBtn} ${styles.spellSlotEmpty}`}
        disabled
      >
        Empty
      </button>
    );
  }

  return (
    <button
      className={`${styles.spellSlotBtn} ${disabled ? styles.spellSlotDisabled : styles.spellSlotActive}`}
      onClick={() => !disabled && onClick(slot)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
      style={{
        '--element-color': elementColor,
      }}
      disabled={disabled}
    >
      <div className={styles.spellSlotRootText}>
        {spell.rootId}
      </div>
      <div className={styles.spellSlotElementLabel}>
        {elementInfo?.label}
      </div>
      <div className={styles.spellSlotMpCost}>
        {spell.mpCost}
      </div>
    </button>
  );
}

function MPBar({ current, max }) {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const color = percentage > 50 ? '#32CD32' : percentage > 20 ? '#FFD700' : '#FF4500';

  return (
    <div className={styles.mpBarContainer}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={styles.mpBarFill}
        style={{
          '--mp-color': color,
        }}
      />
      <div className={styles.mpBarText}>
        {current}/{max} MP
      </div>
    </div>
  );
}

function AffinityIndicator({ affinity }) {
  if (!affinity.primary) return null;

  const elementInfo = ELEMENT_INFO[affinity.primary];
  const color = `#${elementInfo.color.toString(16).padStart(6, '0')}`;

  return (
    <div
      className={styles.affinityIndicator}
      style={{ '--element-color': color }}
      title={`Primary: ${elementInfo.label} (2x power)`}
    >
      <span className={styles.affinityArabic}>{elementInfo.arabic}</span>
      {' '}
      <span>2x</span>
    </div>
  );
}

export default function MagicOverlay() {
  const [shakeMP, setShakeMP] = useState(false);
  const [flashSlot, setFlashSlot] = useState(null);

  const currentTurn = useSelector((state) => state.battle.currentTurn);
  const playerMP = useSelector((state) => state.battle.playerMP);
  const playerMaxMP = useSelector((state) => state.battle.playerMaxMP);
  const equippedSpells = useSelector(selectEquippedSpells);
  const affinity = useSelector(selectAffinity);

  const isPlayerTurn = currentTurn === 'player';

  useEffect(() => {
    const onCastComplete = ({ slot }) => {
      setFlashSlot(slot);
      setTimeout(() => setFlashSlot(null), 300);
    };

    const onMPDepleted = () => {
      setShakeMP(true);
      setTimeout(() => setShakeMP(false), 500);
    };

    EventBus.on(EVENTS.MAGIC_CAST_COMPLETE, onCastComplete);
    EventBus.on(EVENTS.MAGIC_MP_DEPLETED, onMPDepleted);

    return () => {
      EventBus.off(EVENTS.MAGIC_CAST_COMPLETE, onCastComplete);
      EventBus.off(EVENTS.MAGIC_MP_DEPLETED, onMPDepleted);
    };
  }, []);

  const handleSpellClick = (slot) => {
    EventBus.emit(EVENTS.MAGIC_CAST_REQUESTED, { slot });
  };

  const handleSpellMenuOpen = () => {
    EventBus.emit(EVENTS.MAGIC_SPELL_MENU_OPEN);
  };

  if (!isPlayerTurn) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={styles.overlayPositioner}
      >
        <div className={styles.hotbarPanel}>
          <AffinityIndicator affinity={affinity} />

          <div className={styles.spellSlotRow}>
            {equippedSpells.map((spell, index) => (
              <div
                key={index}
                className={`${styles.spellSlotWrapper} ${flashSlot === index ? styles.spellSlotFlash : ''}`}
              >
                <SpellSlot
                  spell={spell}
                  slot={index}
                  playerMP={playerMP}
                  onClick={handleSpellClick}
                  onRightClick={handleSpellMenuOpen}
                />
              </div>
            ))}
          </div>

          <motion.div
            animate={shakeMP ? { x: [-4, 4, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <MPBar current={playerMP} max={playerMaxMP} />
          </motion.div>

          <div className={styles.footerHint}>
            Right-click for spell menu
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
