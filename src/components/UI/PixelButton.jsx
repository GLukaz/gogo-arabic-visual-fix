import { useCallback } from 'react';
import styles from './PixelButton.module.css';

// ============================================================
// PIXEL BUTTON
// Reusable pixel-art styled button component.
// Supports three variants (primary / secondary / danger),
// three sizes (sm / md / lg), optional icon, and disabled state.
// ============================================================

/**
 * @param {object}   props
 * @param {string}   props.label     - Button label text
 * @param {Function} props.onClick   - Click handler
 * @param {'primary'|'secondary'|'danger'} [props.variant='primary'] - Visual variant
 * @param {'sm'|'md'|'lg'}                 [props.size='md']         - Button size
 * @param {boolean}  [props.disabled=false]  - Disabled state
 * @param {string}   [props.icon]    - Optional emoji/icon prefix
 * @param {string}   [props.className] - Extra class names
 * @param {string}   [props.type='button'] - HTML button type
 * @param {string}   [props['aria-label']] - Accessible label override
 */
function PixelButton({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}) {
  const handleClick = useCallback(
    (e) => {
      if (disabled || !onClick) return;
      onClick(e);
    },
    [disabled, onClick]
  );

  const classNames = [
    styles.btn,
    styles[`variant--${variant}`],
    styles[`size--${size}`],
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-disabled={disabled}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </button>
  );
}

export default PixelButton;
