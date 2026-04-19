import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMasterVolume,
  setBgmVolume,
  setSfxVolume,
  setPronunciationVolume,
  toggleMute,
  toggleTransliteration,
  toggleDiacritics,
  setKeyboardMode,
  toggleSpacedListening,
} from '../../store/slices/settingsSlice.js';
import { selectPlacement, resetPlacement, recordPlacementResult } from '../../store/slices/placementSlice.js';
import { resetCefrProgress, setCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { bulkUnlockLessons } from '../../store/slices/grammarSlice.js';
import { bulkUnlockNodes } from '../../store/slices/skillTreeSlice.js';
import { deriveGrammarUnlocks, deriveSkillTreeUnlocks } from '../../services/placementEngine.js';
import PlacementTestOverlay from '../Placement/PlacementTestOverlay.jsx';
import AccessibilityPanel from '../Settings/AccessibilityPanel.jsx';
import ExportProgress from '../Settings/ExportProgress.jsx';
import styles from './SettingsMenu.module.css';

export default function SettingsMenu({ onBack }) {
  const settings = useSelector((s) => s.settings);
  const placement = useSelector(selectPlacement);
  const dispatch = useDispatch();
  const [showRetakeTest, setShowRetakeTest] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleRetake = () => {
    if (window.confirm('Retaking the placement test will reset your CEFR tracking history. Your grammar and skill tree progress will NOT be affected. Continue?')) {
      dispatch(resetPlacement());
      dispatch(resetCefrProgress());
      setShowRetakeTest(true);
    }
  };

  const handleRetakeComplete = (assignedLevel, rawScore, storedLevel) => {
    dispatch(recordPlacementResult({ assignedLevel, rawScore }));
    dispatch(setCefrLevel({ level: storedLevel, source: 'placement_retake' }));

    // Re-derive and apply unlocks for new level
    const grammarIds = deriveGrammarUnlocks(assignedLevel);
    if (grammarIds.length > 0) {
      dispatch(bulkUnlockLessons(grammarIds));
    }
    const treeUnlocks = deriveSkillTreeUnlocks(assignedLevel);
    for (const [treeId, nodeIds] of Object.entries(treeUnlocks)) {
      dispatch(bulkUnlockNodes({ treeId, nodeIds }));
    }

    setShowRetakeTest(false);
  };

  const handleRetakeSkip = () => {
    // If they cancel mid-retake, record A1 as fallback
    dispatch(recordPlacementResult({ assignedLevel: 'A1', rawScore: 0 }));
    dispatch(setCefrLevel({ level: 'A1', source: 'placement_retake_skip' }));
    setShowRetakeTest(false);
  };

  // Dynamic background image (fullScreenBg function pattern)
  const containerStyle = {
    backgroundColor: '#1a1a2e',
    backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(139, 105, 20, 0.08) 0%, transparent 50%), repeating-linear-gradient(60deg, rgba(212, 168, 67, 0.03) 0px, rgba(212, 168, 67, 0.03) 1px, transparent 1px, transparent 40px)',
  };

  return (
    <div className={styles.container} style={containerStyle}>
      <div className={styles.panel}>
        <div className={styles.title}>Settings</div>

        {/* Audio Section */}
        <div className={styles.volumeSection}>
          <div className={styles.sectionHeading}>Audio</div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Master Volume</span>
            <div className={styles.sliderGroup}>
              <input type="range" min="0" max="100" step="5" value={settings.masterVolume}
                onChange={(e) => dispatch(setMasterVolume(+e.target.value))} className={styles.slider} />
              <span className={styles.volumeValue}>{settings.masterVolume}%</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>
              {settings.isMuted ? 'Muted' : 'Mute'}
            </span>
            <button
              className={settings.isMuted ? styles.muteBtn + ' ' + styles.muteBtnActive : styles.muteBtn}
              onClick={() => dispatch(toggleMute())}
            >
              {settings.isMuted ? 'UNMUTE' : 'MUTE'}
            </button>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Music Volume</span>
            <div className={styles.sliderGroup}>
              <input type="range" min="0" max="100" step="5" value={settings.bgmVolume}
                onChange={(e) => dispatch(setBgmVolume(+e.target.value))} className={styles.slider} />
              <span className={styles.volumeValue}>{settings.bgmVolume}%</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>SFX Volume</span>
            <div className={styles.sliderGroup}>
              <input type="range" min="0" max="100" step="5" value={settings.sfxVolume}
                onChange={(e) => dispatch(setSfxVolume(+e.target.value))} className={styles.slider} />
              <span className={styles.volumeValue}>{settings.sfxVolume}%</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Word Audio Volume</span>
            <div className={styles.sliderGroup}>
              <input type="range" min="0" max="100" step="5" value={settings.pronunciationVolume}
                onChange={(e) => dispatch(setPronunciationVolume(+e.target.value))} className={styles.slider} />
              <span className={styles.volumeValue}>{settings.pronunciationVolume}%</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Spaced Listening</span>
            <button
              className={settings.spacedListeningEnabled ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(toggleSpacedListening())}
              aria-label={`Spaced listening ${settings.spacedListeningEnabled ? 'on' : 'off'}`}
            >
              {settings.spacedListeningEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Display Section */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeading}>Display</div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Show Transliteration</span>
            <button
              className={settings.showTransliteration ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(toggleTransliteration())}
            >
              {settings.showTransliteration ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Show Harakat</span>
            <button
              className={settings.showDiacritics ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(toggleDiacritics())}
            >
              {settings.showDiacritics ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={styles.settingRow}>
            <span className={styles.label}>Keyboard Mode</span>
            <button
              className={settings.keyboardMode === 'physical' ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(setKeyboardMode(settings.keyboardMode === 'onscreen' ? 'physical' : 'onscreen'))}
            >
              {settings.keyboardMode === 'onscreen' ? 'On-Screen' : 'Physical'}
            </button>
          </div>
        </div>

        {/* Accessibility Section */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeading}>Accessibility</div>
          <AccessibilityPanel />
        </div>

        {/* CEFR Placement Section */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeading}>CEFR Placement</div>

          {placement.hasCompleted ? (
            <>
              <div className={styles.settingRow}>
                <span className={styles.label}>Current Level</span>
                <span className={styles.levelBadge}>{placement.assignedLevel}</span>
              </div>
              {placement.completedAt && (
                <div className={styles.settingRow}>
                  <span className={styles.label}>Placed On</span>
                  <span className={styles.labelValue}>{placement.completedAt.slice(0, 10)}</span>
                </div>
              )}
              <div className={styles.settingRow}>
                <button
                  className={styles.retakeBtn}
                  onClick={handleRetake}
                >
                  Retake Placement Test
                </button>
              </div>
              <div className={styles.retakeWarning}>
                Retaking resets your CEFR tracking history.
              </div>
            </>
          ) : (
            <div className={styles.settingRow}>
              <span className={styles.label}>Not yet taken</span>
            </div>
          )}
        </div>

        {/* Data Export Section */}
        <div className={styles.settingsSection}>
          <div className={styles.sectionHeading}>Data</div>
          <div className={styles.settingRow}>
            <span className={styles.label}>Export My Progress</span>
            <button
              className={styles.retakeBtn}
              onClick={() => setShowExport(true)}
              aria-label="Export my learning progress as JSON or CSV"
            >
              Export
            </button>
          </div>
        </div>

        {showRetakeTest && (
          <PlacementTestOverlay
            onComplete={handleRetakeComplete}
            onSkip={handleRetakeSkip}
          />
        )}

        {showExport && (
          <div className={styles.overlayBackdrop}>
            <ExportProgress onBack={() => setShowExport(false)} />
          </div>
        )}

        <button className={styles.backBtn} onClick={onBack}>Back to Menu</button>
      </div>
    </div>
  );
}
