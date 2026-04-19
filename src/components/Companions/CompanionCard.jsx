/**
 * CompanionCard.jsx — Individual companion card for roster display
 *
 * Shows name, title, role, specialty, recruitment status, and relationship bar.
 */

import { motion } from 'framer-motion';
import { COMPANIONS, COMPANION_ROLES, TEACHING_SPECIALTIES } from '../../data/companions.js';
import RelationshipBar from './RelationshipBar.jsx';
import styles from './CompanionCard.module.css';

const ROLE_ICONS = {
  healer: '💚',
  attacker: '⚔️',
  defender: '🛡️',
  support: '✨',
};

const SPECIALTY_ICONS = {
  grammar: '📖',
  vocabulary: '💬',
  pronunciation: '🗣️',
  culture: '🏛️',
};

export default function CompanionCard({ companion, companionDef, isActive, onClick }) {
  const def = companionDef || COMPANIONS[companion.id];
  if (!def) return null;

  const isRecruited = companion.recruited;
  const activeSlot = isActive?.battle ? 'battle' : isActive?.exploration ? 'exploration' : null;

  return (
    <motion.div
      whileHover={isRecruited ? { scale: 1.02 } : {}}
      onClick={onClick}
      className={`${styles.card} ${isRecruited ? styles.cardRecruited : styles.cardLocked}`}
      style={{
        '--companion-color': def.colorPalette.primary,
        '--companion-secondary': def.colorPalette.secondary,
        '--companion-accent': def.colorPalette.accent,
      }}
    >
      {/* Recruitment badge */}
      <div
        className={`${styles.recruitBadge} ${isRecruited ? styles.recruitBadgeRecruited : styles.recruitBadgeLocked}`}
      >
        {isRecruited ? 'RECRUITED' : 'LOCKED'}
      </div>

      {/* Active slot indicator */}
      {activeSlot && (
        <div className={styles.activeSlotIcon}>
          {activeSlot === 'battle' ? '⚔️' : '🧭'}
        </div>
      )}

      {/* Portrait placeholder */}
      <div
        className={styles.portrait}
      >
        {ROLE_ICONS[def.battleRole]}
      </div>

      {/* Name and title */}
      <div className={styles.nameSection}>
        <div className={styles.cardName}>
          {def.name}
        </div>
        <div className={styles.cardNameArabic}>
          {def.nameArabic}
        </div>
        <div className={styles.cardTitle}>
          {def.title}
        </div>
      </div>

      {/* Role and specialty badges */}
      <div className={styles.badges}>
        <div className={styles.roleBadge}>
          {ROLE_ICONS[def.battleRole]} {COMPANION_ROLES[def.battleRole].label}
        </div>
        <div className={styles.specialtyBadge}>
          {SPECIALTY_ICONS[def.teachingSpecialty]} {TEACHING_SPECIALTIES[def.teachingSpecialty].label}
        </div>
      </div>

      {/* Relationship bar (only if recruited) */}
      {isRecruited && (
        <div className={styles.relationshipSection}>
          <RelationshipBar
            value={companion.relationship}
            maxValue={100}
            showLabel={false}
            size="small"
          />
        </div>
      )}
    </motion.div>
  );
}
