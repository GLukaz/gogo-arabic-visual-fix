/**
 * CompanionUI.jsx — Main companion roster overlay
 *
 * Shows all 12 companions with filter tabs, party management panel,
 * and detailed view with gift-giving interface.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  selectAllCompanions,
  selectActiveParty,
  selectRecruitedCompanions,
  giveGift,
} from '../../store/slices/companionSlice.js';
import { selectInventoryItems, removeItem } from '../../store/slices/inventorySlice.js';
import { COMPANIONS, COMPANION_ROLES, TEACHING_SPECIALTIES } from '../../data/companions.js';
import { getGiftBonus } from '../../utils/companionRelationship.js';
import { EQUIPMENT_DATA } from '../../data/equipment.js';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import CompanionCard from './CompanionCard.jsx';
import PartyPanel from './PartyPanel.jsx';
import RelationshipBar from './RelationshipBar.jsx';
import styles from './CompanionUI.module.css';

export default function CompanionUI({ onClose }) {
  const dispatch = useDispatch();
  const allCompanions = useSelector(selectAllCompanions);
  const activeParty = useSelector(selectActiveParty);
  const recruitedCompanions = useSelector(selectRecruitedCompanions);
  const inventoryItems = useSelector(selectInventoryItems);

  const [selectedCompanionId, setSelectedCompanionId] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [showGiftMenu, setShowGiftMenu] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showGiftMenu) {
          setShowGiftMenu(false);
        } else if (selectedCompanionId) {
          setSelectedCompanionId(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, selectedCompanionId, showGiftMenu]);

  // Filter companions
  const filteredCompanions = useMemo(() => {
    const companionArray = Object.values(allCompanions);

    if (filterTab === 'recruited') {
      return companionArray.filter(c => c.recruited);
    }
    if (filterTab === 'locked') {
      return companionArray.filter(c => !c.recruited);
    }
    if (Object.keys(COMPANION_ROLES).includes(filterTab)) {
      return companionArray.filter(c => {
        const def = COMPANIONS[c.id];
        return def && def.battleRole === filterTab;
      });
    }
    if (Object.keys(TEACHING_SPECIALTIES).includes(filterTab)) {
      return companionArray.filter(c => {
        const def = COMPANIONS[c.id];
        return def && def.teachingSpecialty === filterTab;
      });
    }

    return companionArray;
  }, [allCompanions, filterTab]);

  // Handle companion card click
  const handleCompanionClick = useCallback((companionId) => {
    setSelectedCompanionId(companionId);
  }, []);

  // Handle gift selection
  const handleGiveGift = useCallback((giftItemId) => {
    if (!selectedCompanionId) return;

    const companion = allCompanions[selectedCompanionId];
    const companionDef = COMPANIONS[selectedCompanionId];
    if (!companion || !companionDef) return;

    // Determine gift category from item data
    const itemData = EQUIPMENT_DATA[giftItemId];
    let giftCategory = 'food'; // default fallback

    // Map item categories to gift categories
    if (itemData) {
      if (itemData.slot === 'accessory1' || itemData.slot === 'accessory2') {
        giftCategory = 'gems';
      }
      else {
        giftCategory = 'crafts';
      }
    }

    const relationshipGain = getGiftBonus(giftCategory, companionDef.preferredGifts);

    // Dispatch gift action
    dispatch(giveGift({
      companionId: selectedCompanionId,
      giftId: giftItemId,
      relationshipGain,
      timestamp: Date.now(),
    }));

    // Remove item from inventory
    dispatch(removeItem({ itemId: giftItemId, quantity: 1 }));

    // Emit event
    EventBus.emit(EVENTS.COMPANION_GIFT_GIVEN, {
      companionId: selectedCompanionId,
      giftId: giftItemId,
      relationshipGain,
    });

    setShowGiftMenu(false);
  }, [selectedCompanionId, allCompanions, dispatch]);

  const selectedCompanion = selectedCompanionId ? allCompanions[selectedCompanionId] : null;
  const selectedCompanionDef = selectedCompanionId ? COMPANIONS[selectedCompanionId] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className={styles.backdrop}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={styles.mainPanel}
        >
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.headerTitle}>
                Companions / الرفاق
              </h1>
              <div className={styles.headerSubtitle}>
                Recruited: {recruitedCompanions.length}/12
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Party Panel */}
          <div className={styles.partySection}>
            <PartyPanel />
          </div>

          {/* Filter tabs */}
          <div className={styles.filterTabs}>
            {[
              { key: 'all', label: 'All' },
              { key: 'recruited', label: 'Recruited' },
              { key: 'locked', label: 'Locked' },
              { key: 'healer', label: 'Healers' },
              { key: 'attacker', label: 'Attackers' },
              { key: 'defender', label: 'Defenders' },
              { key: 'support', label: 'Support' },
              { key: 'grammar', label: 'Grammar' },
              { key: 'vocabulary', label: 'Vocabulary' },
              { key: 'pronunciation', label: 'Pronunciation' },
              { key: 'culture', label: 'Culture' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={`${styles.filterTab} ${filterTab === tab.key ? styles.filterTabActive : styles.filterTabInactive}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Companion grid */}
          <div className={styles.companionGrid}>
            {filteredCompanions.map((companion) => {
              const isActive = {
                battle: activeParty.battle === companion.id,
                exploration: activeParty.exploration === companion.id,
              };

              return (
                <CompanionCard
                  key={companion.id}
                  companion={companion}
                  companionDef={COMPANIONS[companion.id]}
                  isActive={isActive}
                  onClick={() => handleCompanionClick(companion.id)}
                />
              );
            })}
          </div>

          {/* Detail view modal */}
          <AnimatePresence>
            {selectedCompanionId && selectedCompanion && selectedCompanionDef && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCompanionId(null)}
                className={styles.detailBackdrop}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.detailPanel}
                  style={{ '--companion-color': selectedCompanionDef.colorPalette.primary }}
                >
                  {/* Companion name and title */}
                  <h2
                    className={styles.detailName}
                  >
                    {selectedCompanionDef.name} - {selectedCompanionDef.nameArabic}
                  </h2>
                  <div className={styles.detailTitleText}>
                    {selectedCompanionDef.title} / {selectedCompanionDef.titleArabic}
                  </div>

                  {/* Description */}
                  <p className={styles.detailDescription}>
                    {selectedCompanionDef.description}
                  </p>

                  {/* Stats */}
                  {selectedCompanion.recruited && (
                    <div className={styles.statsPanel}>
                      <div className={styles.statsLabel}>
                        Base Stats
                      </div>
                      <div className={styles.statsGrid}>
                        <div>HP: {selectedCompanionDef.baseStats.hp}</div>
                        <div>MP: {selectedCompanionDef.baseStats.mp}</div>
                        <div>Damage: {selectedCompanionDef.baseStats.damage}</div>
                        <div>Defense: {selectedCompanionDef.baseStats.defense}</div>
                      </div>
                    </div>
                  )}

                  {/* Relationship bar */}
                  {selectedCompanion.recruited && (
                    <div className={styles.relationshipSection}>
                      <RelationshipBar value={selectedCompanion.relationship} maxValue={100} />
                    </div>
                  )}

                  {/* Recruitment requirement (if not recruited) */}
                  {!selectedCompanion.recruited && (
                    <div className={styles.recruitRequirement}>
                      <strong>How to recruit:</strong> Find them in{' '}
                      {selectedCompanionDef.zone.replace(/_/g, ' ')}
                      {selectedCompanionDef.recruitCondition.type === 'quest' &&
                        ` (Complete quest: ${selectedCompanionDef.recruitCondition.value})`}
                      {selectedCompanionDef.recruitCondition.type === 'level' &&
                        ` (Reach level ${selectedCompanionDef.recruitCondition.value})`}
                      {selectedCompanionDef.recruitCondition.type === 'relationship' &&
                        ` (Build relationship to ${selectedCompanionDef.recruitCondition.value})`}
                      {selectedCompanionDef.recruitCondition.type === 'storyFlag' &&
                        ` (Story event: ${selectedCompanionDef.recruitCondition.value})`}
                    </div>
                  )}

                  {/* Actions (if recruited) */}
                  {selectedCompanion.recruited && (
                    <div className={styles.actionRow}>
                      <button
                        className={styles.giftBtn}
                        onClick={() => setShowGiftMenu(true)}
                        style={{ '--companion-accent': selectedCompanionDef.colorPalette.accent }}
                      >
                        🎁 Give Gift
                      </button>
                    </div>
                  )}

                  <button
                    className={styles.closeBtnFull}
                    onClick={() => setSelectedCompanionId(null)}
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gift menu */}
          <AnimatePresence>
            {showGiftMenu && selectedCompanionId && selectedCompanionDef && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGiftMenu(false)}
                className={styles.giftBackdrop}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.giftPanel}
                  style={{ '--companion-color': selectedCompanionDef.colorPalette.primary }}
                >
                  <h3
                    className={styles.giftTitle}
                  >
                    Select Gift for {selectedCompanionDef.name}
                  </h3>

                  <div className={styles.giftGrid}>
                    {inventoryItems
                      .filter((item) => item.quantity > 0)
                      .slice(0, 20)
                      .map((item) => {
                        const itemData = EQUIPMENT_DATA[item.itemId];
                        if (!itemData) return null;

                        return (
                          <motion.button
                            key={item.itemId}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleGiveGift(item.itemId)}
                            className={styles.giftItemBtn}
                          >
                            <div className={styles.giftItemName}>
                              {itemData.name}
                            </div>
                            <div className={styles.giftItemQty}>
                              x{item.quantity}
                            </div>
                          </motion.button>
                        );
                      })}
                  </div>

                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowGiftMenu(false)}
                  >
                    Cancel
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
