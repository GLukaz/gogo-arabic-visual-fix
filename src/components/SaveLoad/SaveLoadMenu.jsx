/**
 * SaveLoadMenu.jsx — 3-slot save/load UI
 *
 * Props:
 *   onClose        — called when the menu should be dismissed
 *   mode           — 'save' | 'load' (controls which primary action is shown)
 *
 * The component reads slot metadata on mount and after every mutating action.
 * It does NOT dispatch Redux actions directly for load — it calls onLoad(state)
 * so the parent can decide how to rehydrate (e.g. dispatch individual slice setters
 * or trigger a full REHYDRATE).
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  saveToSlot,
  loadSlot,
  deleteSlot,
  getSlotMetadata,
  migrateState,
} from '../../services/saveManager.js';
import { store } from '../../store/store.js';
import styles from './SaveLoadMenu.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatZone(zone) {
  if (!zone) return '—';
  return zone
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SaveLoadMenu({ onClose, mode = 'save', onLoad }) {
  const _dispatch = useDispatch();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // slot number awaiting confirm
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }
  const [busy, setBusy] = useState(false);

  // Reload slot metadata from localStorage
  const refreshSlots = useCallback(() => {
    setSlots(getSlotMetadata());
  }, []);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  function showFeedback(type, msg) {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 2500);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave(slotNumber) {
    if (busy) return;
    setBusy(true);
    try {
      await saveToSlot(slotNumber, store);
      refreshSlots();
      showFeedback('success', `Saved to Slot ${slotNumber}`);
    } catch (err) {
      console.error('[SaveLoadMenu] save error', err);
      showFeedback('error', 'Save failed — storage may be full');
    } finally {
      setBusy(false);
    }
  }

  // ── Load ──────────────────────────────────────────────────────────────────
  function handleLoad(slotNumber) {
    if (busy) return;
    const raw = loadSlot(slotNumber);
    if (!raw) {
      showFeedback('error', 'Slot is empty');
      return;
    }
    const migrated = migrateState(raw);
    if (typeof onLoad === 'function') {
      onLoad(migrated.data);
      showFeedback('success', `Loaded Slot ${slotNumber}`);
    } else {
      showFeedback('error', 'onLoad handler not provided');
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function requestDelete(slotNumber) {
    setConfirmDelete(slotNumber);
  }

  function confirmDeleteSlot() {
    if (confirmDelete === null) return;
    deleteSlot(confirmDelete);
    refreshSlots();
    if (selectedSlot === confirmDelete) setSelectedSlot(null);
    setConfirmDelete(null);
    showFeedback('success', `Slot ${confirmDelete} deleted`);
  }

  function cancelDelete() {
    setConfirmDelete(null);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isSaveMode = mode === 'save';

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Save / Load">
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{isSaveMode ? 'Save Game' : 'Load Game'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`} role="status">
            {feedback.msg}
          </div>
        )}

        {/* Slot list */}
        <ul className={styles.slotList} role="list">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot.slot;
            return (
              <li
                key={slot.slot}
                className={`${styles.slotItem} ${isSelected ? styles.slotSelected : ''} ${slot.empty ? styles.slotEmpty : ''}`}
                onClick={() => setSelectedSlot(slot.slot)}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedSlot(slot.slot)}
              >
                {/* Slot label */}
                <div className={styles.slotLabel}>Slot {slot.slot}</div>

                {/* Slot info */}
                <div className={styles.slotInfo}>
                  {slot.empty ? (
                    <span className={styles.emptyText}>— Empty Slot —</span>
                  ) : (
                    <>
                      <span className={styles.playerName}>{slot.playerName || 'Unknown'}</span>
                      <div className={styles.slotMeta}>
                        <span>Lv {slot.playerLevel}</span>
                        <span className={styles.metaDivider}>·</span>
                        <span>{formatZone(slot.currentZone)}</span>
                      </div>
                      <span className={styles.timestamp}>{formatTimestamp(slot.timestamp)}</span>
                    </>
                  )}
                </div>

                {/* Slot actions (shown when selected) */}
                {isSelected && (
                  <div className={styles.slotActions}>
                    {isSaveMode ? (
                      <button
                        className={styles.btnSave}
                        onClick={(e) => { e.stopPropagation(); handleSave(slot.slot); }}
                        disabled={busy}
                      >
                        {slot.empty ? 'Save Here' : 'Overwrite'}
                      </button>
                    ) : (
                      <button
                        className={styles.btnLoad}
                        onClick={(e) => { e.stopPropagation(); handleLoad(slot.slot); }}
                        disabled={busy || slot.empty}
                      >
                        Load
                      </button>
                    )}
                    {!slot.empty && (
                      <button
                        className={styles.btnDelete}
                        onClick={(e) => { e.stopPropagation(); requestDelete(slot.slot); }}
                        disabled={busy}
                        aria-label={`Delete save in slot ${slot.slot}`}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Delete confirmation dialog */}
        {confirmDelete !== null && (
          <div className={styles.confirmOverlay} role="alertdialog" aria-modal="true">
            <div className={styles.confirmBox}>
              <p className={styles.confirmMsg}>
                Delete Slot {confirmDelete}?<br />
                <span className={styles.confirmSub}>This cannot be undone.</span>
              </p>
              <div className={styles.confirmActions}>
                <button className={styles.btnDeleteConfirm} onClick={confirmDeleteSlot}>
                  Yes, Delete
                </button>
                <button className={styles.btnCancel} onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
