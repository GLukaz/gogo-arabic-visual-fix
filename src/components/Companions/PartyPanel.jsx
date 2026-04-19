/**
 * PartyPanel.jsx — Active party management panel
 *
 * Shows 2 slots (battle and exploration) with controls to assign/remove companions.
 */

import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectActiveParty,
  selectAllCompanions,
  selectRecruitedCompanions,
  setActiveCompanion,
  removeActiveCompanion,
} from '../../store/slices/companionSlice.js';
import { COMPANIONS } from '../../data/companions.js';
import RelationshipBar from './RelationshipBar.jsx';
import styles from './PartyPanel.module.css';

export default function PartyPanel() {
  const dispatch = useDispatch();
  const activeParty = useSelector(selectActiveParty);
  const allCompanions = useSelector(selectAllCompanions);
  const recruitedCompanions = useSelector(selectRecruitedCompanions);

  const [selectingSlot, setSelectingSlot] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleChangeSlot = useCallback((slot) => {
    setSelectingSlot(slot);
  }, []);

  const handleSelectCompanion = useCallback((companionId) => {
    if (!selectingSlot) return;

    // Check if companion is already in the other slot
    const otherSlot = selectingSlot === 'battle' ? 'exploration' : 'battle';
    if (activeParty[otherSlot] === companionId) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000);
      return;
    }

    dispatch(setActiveCompanion({ slot: selectingSlot, companionId }));
    setSelectingSlot(null);
  }, [selectingSlot, activeParty, dispatch]);

  const handleRemove = useCallback((slot) => {
    dispatch(removeActiveCompanion(slot));
  }, [dispatch]);

  const renderSlot = (slot, label, icon) => {
    const companionId = activeParty[slot];
    const companion = companionId ? allCompanions[companionId] : null;
    const companionDef = companionId ? COMPANIONS[companionId] : null;

    return (
      <div className={styles.slotCard}>
        {/* Slot header */}
        <div className={styles.slotHeader}>
          <span className={styles.slotHeaderIcon}>{icon}</span>
          {label}
        </div>

        {/* Companion details or empty state */}
        {companion && companionDef ? (
          <>
            <div className={styles.companionRow}>
              <div
                className={styles.companionAvatar}
                style={{
                  '--companion-primary': companionDef.colorPalette.primary,
                  '--companion-secondary': companionDef.colorPalette.secondary,
                }}
              >
                {slot === 'battle' ? '⚔️' : '🧭'}
              </div>
              <div className={styles.companionInfo}>
                <div className={styles.companionNameText}>
                  {companionDef.name}
                </div>
                <div className={styles.companionTitleText}>
                  {companionDef.title}
                </div>
              </div>
            </div>

            <RelationshipBar
              value={companion.relationship}
              maxValue={100}
              showLabel={false}
              size="small"
            />

            <div className={styles.slotActions}>
              <button className={styles.changeBtn} onClick={() => handleChangeSlot(slot)}>
                Change
              </button>
              <button className={styles.removeBtn} onClick={() => handleRemove(slot)}>
                Remove
              </button>
            </div>
          </>
        ) : (
          <button className={styles.emptySlotBtn} onClick={() => handleChangeSlot(slot)}>
            <span className={styles.emptySlotIcon}>➕</span>
            Assign Companion
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Active party slots */}
      <div className={styles.partySlots}>
        {renderSlot('battle', 'Battle Companion', '⚔️')}
        {renderSlot('exploration', 'Exploration Companion', '🧭')}
      </div>

      {/* Warning toast */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.warningToast}
          >
            Companion is already in the other slot!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Companion selection modal */}
      <AnimatePresence>
        {selectingSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectingSlot(null)}
            className={styles.selectionBackdrop}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={styles.selectionPanel}
            >
              <h2 className={styles.selectionTitle}>
                Select Companion for {selectingSlot === 'battle' ? 'Battle' : 'Exploration'}
              </h2>

              <div className={styles.selectionGrid}>
                {recruitedCompanions.map((companion) => {
                  const companionDef = COMPANIONS[companion.id];
                  return (
                    <motion.button
                      key={companion.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSelectCompanion(companion.id)}
                      className={styles.selectionBtn}
                      style={{ '--companion-color': companionDef.colorPalette.primary }}
                    >
                      <div className={styles.selectionBtnName}>
                        {companionDef.name}
                      </div>
                      <div className={styles.selectionBtnTitle}>
                        {companionDef.title}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <button
                className={styles.cancelBtn}
                onClick={() => setSelectingSlot(null)}
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
