import PropTypes from 'prop-types';
import styles from '../../App.module.css';

/**
 * PauseMenu
 * Minimal pause menu overlay with resume and main menu buttons
 */
export default function PauseMenu({ onResume, onMainMenu }) {
  return (
    <div className={styles.pauseMenuOverlay}>
      <div className={styles.pauseMenuTitle}>Paused</div>
      <div className={styles.pauseMenuButtons}>
        <button onClick={onResume} className={styles.pauseMenuBtnResume}>
          Resume
        </button>
        <button onClick={onMainMenu} className={styles.pauseMenuBtnMenu}>
          Main Menu
        </button>
      </div>
    </div>
  );
}

PauseMenu.propTypes = {
  onResume: PropTypes.func.isRequired,
  onMainMenu: PropTypes.func.isRequired,
};
