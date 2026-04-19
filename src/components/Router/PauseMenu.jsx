import React from 'react';
import { audioManager } from '../../services/audio.js';
import ActivitiesMenu from './ActivitiesMenu.jsx';
import styles from './PauseMenu.module.css';

export default function PauseMenu({ onResume, onMainMenu, onNavigate, onOpenWardrobe, onOpenPathSwitch, onOpenFactionPanel }) {
  const [showActivities, setShowActivities] = React.useState(false);

  // ESC key handler for pause menu
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  if (showActivities) {
    return (
      <ActivitiesMenu
        onBack={() => setShowActivities(false)}
        onNavigate={onNavigate}
        onOpenPathSwitch={() => {
          setShowActivities(false);
          if (onOpenPathSwitch) onOpenPathSwitch();
        }}
      />
    );
  }

  return (
    <div className={styles.pauseMenuOverlay}>
      <div className={styles.pauseMenuTitle}>Paused</div>
      <div className={styles.pauseMenuButtons}>
        <button onClick={() => { audioManager.playSFX('click'); onResume(); }} className={styles.pauseMenuBtnResume}>
          Resume
        </button>
        <button onClick={() => { audioManager.playSFX('click'); setShowActivities(true); }} className={styles.pauseMenuBtnActivities}>
          Activities
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onNavigate('/stats'); }} className={styles.pauseMenuBtnActivities}>
          Profile
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onOpenWardrobe(); }} className={styles.pauseMenuBtnActivities}>
          Wardrobe
        </button>
        <button onClick={() => { audioManager.playSFX('click'); if (onOpenFactionPanel) onOpenFactionPanel(); }} className={styles.pauseMenuBtnActivities}>
          Factions
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onNavigate('/skill-tree'); }} className={styles.pauseMenuBtnActivities}>
          Skill Trees
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onNavigate('/codex'); }} className={styles.pauseMenuBtnActivities}>
          Codex
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onNavigate('/save-load'); }} className={styles.pauseMenuBtnActivities}>
          Save / Load
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onNavigate('/completion'); }} className={styles.pauseMenuBtnActivities}>
          Completion
        </button>
        <button onClick={() => { audioManager.playSFX('click'); onMainMenu(); }} className={styles.pauseMenuBtnMenu}>
          Main Menu
        </button>
      </div>
    </div>
  );
}
