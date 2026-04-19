/**
 * SpellMenu.jsx — Full spell management overlay.
 *
 * Shows all discovered spells with element filtering, mastery indicators,
 * and hotbar assignment. Opens via MAGIC_SPELL_MENU_OPEN event.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import {
  selectDiscoveredRoots,
  selectAllRootMastery,
  selectEquippedSpells,
  equipSpell,
  unequipSpell,
} from '../../store/slices/magicSlice.js';
import { ELEMENT_INFO } from '../../data/rootMagic.js';
import { SPELLS } from '../../data/spellData.js';
import styles from './SpellMenu.module.css';

const ELEMENT_ORDER = [
  'fire',
  'water',
  'earth',
  'wind',
  'light',
  'shadow',
  'time',
  'knowledge',
  'creation',
  'protection',
];

function SpellCard({ spell, mastery, isEquipped, isLocked, onClick }) {
  const elementInfo = ELEMENT_INFO[spell.element];
  const elementColor = `#${elementInfo.color.toString(16).padStart(6, '0')}`;

  const level = mastery?.level || 1;
  const xp = mastery?.xp || 0;
  const xpInLevel = xp % 100;
  const xpProgress = xpInLevel / 100;

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      whileHover={!isLocked ? { scale: 1.05 } : {}}
      whileTap={!isLocked ? { scale: 0.95 } : {}}
      className={`${styles.spellCard} ${isLocked ? styles.spellCardLocked : styles.spellCardUnlocked} ${isEquipped ? styles.spellCardEquipped : ''}`}
      style={{
        '--element-color': elementColor,
        '--element-color-bg': isLocked ? '#1a1a1a' : `${elementColor}1a`,
      }}
    >
      {isEquipped && (
        <div className={styles.equippedBadge}>
          EQUIPPED
        </div>
      )}

      <div className={styles.spellRootId}>
        {spell.rootId}
      </div>

      <div className={styles.spellName}>
        {spell.name}
      </div>

      <div className={styles.spellNameArabic}>
        {spell.nameArabic}
      </div>

      {!isLocked && (
        <>
          <div className={styles.spellLevel}>
            Lvl {level}
          </div>

          <div className={styles.xpBarTrack}>
            <div
              className={styles.xpBarFill}
              style={{
                width: `${xpProgress * 100}%`,
              }}
            />
          </div>
        </>
      )}

      <div className={styles.spellFormInfo}>
        Form {spell.form} • {spell.mpCost} MP
      </div>

      {isLocked && (
        <div className={styles.spellLockInfo}>
          Requires Form {spell.form}
        </div>
      )}
    </motion.button>
  );
}

function HotbarSlot({ index, spell, onClick }) {
  const elementInfo = spell ? ELEMENT_INFO[spell.element] : null;
  const elementColor = elementInfo ? `#${elementInfo.color.toString(16).padStart(6, '0')}` : '#444';

  return (
    <button
      onClick={onClick}
      className={`${styles.hotbarSlotBtn} ${spell ? styles.hotbarSlotFilled : styles.hotbarSlotEmpty}`}
      style={{
        '--element-color': elementColor,
      }}
    >
      <div className={styles.hotbarSlotIndex}>
        {index + 1}
      </div>
      {spell ? (
        <div className={styles.hotbarSlotRoot}>
          {spell.rootId.split('-')[0]}
        </div>
      ) : (
        <div className={styles.hotbarSlotEmptyLabel}>
          Empty
        </div>
      )}
    </button>
  );
}

export default function SpellMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dispatch = useDispatch();
  const discoveredRoots = useSelector(selectDiscoveredRoots);
  const rootMastery = useSelector(selectAllRootMastery);
  const equippedSpells = useSelector(selectEquippedSpells);

  useEffect(() => {
    const onOpen = () => {
      setIsOpen(true);
      EventBus.emit(EVENTS.PLAYER_FREEZE);
    };

    const onClose = () => {
      setIsOpen(false);
      setSelectedSlot(null);
      EventBus.emit(EVENTS.PLAYER_UNFREEZE);
    };

    EventBus.on(EVENTS.MAGIC_SPELL_MENU_OPEN, onOpen);
    EventBus.on(EVENTS.MAGIC_SPELL_MENU_CLOSE, onClose);

    return () => {
      EventBus.off(EVENTS.MAGIC_SPELL_MENU_OPEN, onOpen);
      EventBus.off(EVENTS.MAGIC_SPELL_MENU_CLOSE, onClose);
    };
  }, []);

  const handleClose = () => {
    EventBus.emit(EVENTS.MAGIC_SPELL_MENU_CLOSE);
  };

  const handleSpellClick = (spell) => {
    if (selectedSlot !== null) {
      // Assign to selected slot
      dispatch(equipSpell({ slot: selectedSlot, rootId: spell.rootId, form: spell.form }));
      setSelectedSlot(null);
    } else {
      // Auto-assign to next empty slot
      const emptySlot = equippedSpells.findIndex((s) => !s);
      if (emptySlot !== -1) {
        dispatch(equipSpell({ slot: emptySlot, rootId: spell.rootId, form: spell.form }));
      } else {
        // Show slot picker
        setSelectedSlot(0);
      }
    }
  };

  const handleSlotClick = (index) => {
    if (equippedSpells[index]) {
      // Unequip
      dispatch(unequipSpell(index));
    } else {
      // Select slot for assignment
      setSelectedSlot(index);
    }
  };

  // Filter spells
  const discoveredSpells = SPELLS.filter((spell) => discoveredRoots.includes(spell.rootId));
  const filteredSpells =
    selectedFilter === 'all'
      ? discoveredSpells
      : discoveredSpells.filter((spell) => spell.element === selectedFilter);

  // Count spells per element
  const elementCounts = {};
  ELEMENT_ORDER.forEach((element) => {
    elementCounts[element] = discoveredSpells.filter((s) => s.element === element).length;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Spells
          </h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            X
          </button>
        </div>

        {/* Element filter tabs */}
        <div className={styles.filterTabs}>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`${styles.filterTabAll} ${selectedFilter === 'all' ? styles.filterTabAllActive : styles.filterTabAllInactive}`}
          >
            All ({discoveredSpells.length})
          </button>
          {ELEMENT_ORDER.map((element) => {
            const elementInfo = ELEMENT_INFO[element];
            const color = `#${elementInfo.color.toString(16).padStart(6, '0')}`;
            const count = elementCounts[element];

            return (
              <button
                key={element}
                onClick={() => setSelectedFilter(element)}
                className={`${styles.filterTabElement} ${selectedFilter === element ? styles.filterTabElementActive : styles.filterTabElementInactive}`}
                style={{
                  '--element-color': color,
                }}
              >
                {elementInfo.arabic} ({count})
              </button>
            );
          })}
        </div>

        {/* Spell grid */}
        <div className={styles.spellGrid}>
          {filteredSpells.map((spell) => {
            const mastery = rootMastery[spell.rootId];
            const isLocked = !mastery?.formsUnlocked?.includes(spell.form);
            const isEquipped = equippedSpells.some(
              (s) => s?.rootId === spell.rootId && s?.form === spell.form
            );

            return (
              <SpellCard
                key={spell.id}
                spell={spell}
                mastery={mastery}
                isEquipped={isEquipped}
                isLocked={isLocked}
                onClick={() => !isLocked && handleSpellClick(spell)}
              />
            );
          })}
        </div>

        {/* Hotbar assignment area */}
        <div className={styles.hotbarArea}>
          <div className={styles.hotbarLabel}>
            {selectedSlot !== null
              ? `Select a spell to assign to slot ${selectedSlot + 1}`
              : 'Hotbar (click to unequip, or select then click spell)'}
          </div>
          <div className={styles.hotbarSlots}>
            {equippedSpells.map((spell, index) => (
              <div
                key={index}
                className={`${styles.hotbarSlotWrapper} ${selectedSlot === index ? styles.hotbarSlotWrapperSelected : styles.hotbarSlotWrapperDefault}`}
              >
                <HotbarSlot index={index} spell={spell} onClick={() => handleSlotClick(index)} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
