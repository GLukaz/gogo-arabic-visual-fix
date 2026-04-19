import { useCallback, useEffect, useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import styles from './PixelPanel.module.css';

// ============================================================
// PIXEL PANEL
// Reusable pixel-art panel container with gold border,
// optional title / Arabic subtitle, and a close button.
// Matches the Kenmi UI aesthetic used across Gogo Arabic.
// ============================================================

/**
 * @param {object}      props
 * @param {string}      [props.title]        - Panel title (English / romanised)
 * @param {string}      [props.titleArabic]  - Arabic subtitle shown below title
 * @param {React.ReactNode} props.children   - Panel content
 * @param {Function}    [props.onClose]      - Close handler; renders X button when provided
 * @param {string|number} [props.width]      - Panel width (CSS value, e.g. '480px', '90vw')
 * @param {string}      [props.className]    - Extra class names on the panel root
 * @param {string}      [props['aria-label']] - Accessible label for the dialog
 */
function PixelPanel({
  title,
  titleArabic,
  children,
  onClose,
  width,
  className = '',
  'aria-label': ariaLabel,
}) {
  const hasHeader = Boolean(title || titleArabic || onClose);

  // Focus-trap when used as a modal/dialog overlay
  const focusTrapRef = useFocusTrap(true, null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!onClose) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, onClose]);

  const panelStyle = width ? { width } : undefined;

  const classNames = [styles.panel, className].filter(Boolean).join(' ');

  return (
    <div
      ref={focusTrapRef}
      className={classNames}
      style={panelStyle}
      role={onClose ? 'dialog' : 'region'}
      aria-label={ariaLabel ?? title ?? 'Panel'}
      aria-modal={onClose ? 'true' : undefined}
    >
      {/* Pixel frame corners */}
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

      {/* Title bar */}
      {hasHeader && (
        <div className={styles.titleBar}>
          <div className={styles.titleGroup}>
            {title && (
              <span className={styles.title}>{title}</span>
            )}
            {titleArabic && (
              <span className={styles.titleArabic} lang="ar" dir="rtl">
                {titleArabic}
              </span>
            )}
          </div>

          {onClose && (
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close panel"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Divider under title bar */}
      {hasHeader && <div className={styles.divider} aria-hidden="true" />}

      {/* Content area */}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default PixelPanel;
