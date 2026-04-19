import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeSign } from '../../store/slices/uiSlice.js';
import { useOverlayClose } from '../../hooks/useOverlayClose.js';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './SignOverlay.module.css';

export default function SignOverlay() {
  const dispatch = useDispatch();
  const signData = useSelector((s) => s.ui.signData);

  const handleClose = useCallback(() => {
    dispatch(closeSign());
  }, [dispatch]);

  const handleOverlayClose = useOverlayClose(handleClose);

  const focusTrapRef = useFocusTrap(!!signData, null);

  if (!signData) return null;

  return (
    <div ref={focusTrapRef} className={styles.overlay} onClick={handleOverlayClose} role="dialog" aria-label="Sign">
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.arabic} lang="ar" dir="rtl">{signData.arabic}</div>
        <div className={styles.english}>{signData.english}</div>
        <button className={styles.closeBtn} onClick={handleOverlayClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
