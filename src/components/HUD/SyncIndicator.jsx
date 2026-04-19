import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { SyncStatus } from '../../store/slices/syncSlice.js';
import { syncGameState } from '../../services/sync.js';
import styles from './SyncIndicator.module.css';

/**
 * SyncIndicator component
 * Shows current sync status with visual indicator and retry button on error
 */
function SyncIndicator() {
  const dispatch = useDispatch();
  const { status, error, lastSyncTime } = useSelector((state) => state.sync);

  const handleRetry = useCallback(() => {
    syncGameState(dispatch, () => window.store.getState());
  }, [dispatch]);

  // Don't show anything in idle state
  if (status === SyncStatus.IDLE) {
    return null;
  }

  const getStatusInfo = () => {
    switch (status) {
      case SyncStatus.SYNCING:
        return {
          label: 'Syncing...',
          className: styles.syncing,
          showRetry: false,
        };
      case SyncStatus.SYNCED:
        return {
          label: 'Synced',
          className: styles.synced,
          showRetry: false,
        };
      case SyncStatus.CONFLICT:
        return {
          label: 'Resolving...',
          className: styles.conflict,
          showRetry: false,
        };
      case SyncStatus.ERROR:
        return {
          label: error || 'Sync failed',
          className: styles.error,
          showRetry: true,
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <div className={`${styles.container} ${statusInfo.className}`}>
      <div
        className={styles.indicator}
        role="status"
        aria-label={statusInfo.label}
        title={lastSyncTime ? `Last synced: ${new Date(lastSyncTime).toLocaleTimeString()}` : statusInfo.label}
      >
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.label}>{statusInfo.label}</span>
      </div>
      {statusInfo.showRetry && (
        <button
          className={styles.retryButton}
          onClick={handleRetry}
          aria-label="Retry sync"
          title="Retry sync"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default SyncIndicator;
