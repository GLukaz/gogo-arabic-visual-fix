/**
 * ProfileManager.jsx — Phase 91
 *
 * Simple profile management panel:
 * - Create new profiles (name + emoji avatar)
 * - Switch between profiles
 * - View per-profile info
 * - Max 5 profiles per device
 *
 * Profiles are stored in localStorage via the service layer.
 * Redux leaderboard slice tracks the currently active profile.
 */

import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  loadProfiles,
  createProfile as createProfileService,
  deleteProfile as deleteProfileService,
  getMaxProfiles,
} from '../../services/multiProfileLeaderboardService.js';
import {
  createProfile as createProfileAction,
  switchProfile as switchProfileAction,
  removeProfile as removeProfileAction,
} from '../../store/slices/leaderboardSlice.js';
import styles from './ProfileManager.module.css';

const AVATAR_OPTIONS = [
  '\ud83e\uddd1\u200d\ud83c\udfeb', // teacher
  '\ud83e\uddd9', // wizard
  '\ud83e\uddd1\u200d\ud83d\udcbb', // coder
  '\ud83e\uddde', // elf
  '\ud83e\uddcd', // person standing
  '\ud83e\uddce', // kneeling
  '\ud83e\uddd1\u200d\ud83c\udfa8', // artist
  '\ud83e\uddd1\u200d\ud83d\ude80', // astronaut
];

/**
 * Format a date string for display.
 */
function formatCreatedAt(isoDate) {
  if (!isoDate) return '';
  try {
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function ProfileManager({ onClose }) {
  const dispatch = useDispatch();

  const activeProfileId = useSelector((state) => state.leaderboard?.activeProfile ?? null);
  const reduxProfiles = useSelector((state) => state.leaderboard?.profiles ?? []);

  // Use localStorage profiles as source of truth, synced with Redux
  const [profiles, setProfiles] = useState(() => {
    const stored = loadProfiles();
    return stored.length > 0 ? stored : reduxProfiles;
  });

  const [newName, setNewName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState('');

  const maxProfiles = getMaxProfiles();
  const canCreate = profiles.length < maxProfiles;

  const handleCreate = useCallback(() => {
    if (!newName.trim()) {
      setError('Please enter a name');
      return;
    }

    const result = createProfileService(newName.trim(), selectedAvatar);
    if (!result.success) {
      setError(result.error);
      return;
    }

    // Sync to Redux
    dispatch(createProfileAction(result.profile));

    // Refresh local state
    setProfiles(loadProfiles());
    setNewName('');
    setError('');
  }, [newName, selectedAvatar, dispatch]);

  const handleSwitch = useCallback(
    (profileId) => {
      dispatch(switchProfileAction(profileId));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (profileId) => {
      deleteProfileService(profileId);
      dispatch(removeProfileAction(profileId));
      setProfiles(loadProfiles());
    },
    [dispatch]
  );

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleCreate();
      }
    },
    [handleCreate]
  );

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Profile Manager"
    >
      <div className={styles.panel} role="document">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Profiles</h2>
            <div className={styles.subtitle}>
              {profiles.length}/{maxProfiles} profiles
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Close profile manager"
          >
            &times;
          </button>
        </div>

        {/* Profile list */}
        <div className={styles.profileList}>
          {profiles.length === 0 ? (
            <div className={styles.emptyState}>
              No profiles yet. Create one below to start competing!
            </div>
          ) : (
            profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <div
                  key={profile.id}
                  className={`${styles.profileItem} ${isActive ? styles.profileItemActive : ''}`}
                  onClick={() => handleSwitch(profile.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Switch to ${profile.name}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleSwitch(profile.id)}
                >
                  <div className={styles.profileAvatar}>{profile.avatar}</div>
                  <div className={styles.profileInfo}>
                    <div
                      className={`${styles.profileName} ${isActive ? styles.profileNameActive : ''}`}
                    >
                      {profile.name}
                    </div>
                    <div className={styles.profileDate}>
                      Created {formatCreatedAt(profile.createdAt)}
                    </div>
                  </div>
                  {isActive && <span className={styles.activeLabel}>Active</span>}
                  {!isActive && (
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(profile.id);
                      }}
                      type="button"
                      aria-label={`Delete ${profile.name}`}
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Create profile section */}
        {canCreate ? (
          <div className={styles.createSection}>
            <div className={styles.createTitle}>New Profile</div>
            <div className={styles.createForm}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel} htmlFor="profileName">
                  Name
                </label>
                <input
                  id="profileName"
                  className={styles.nameInput}
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter name..."
                  maxLength={20}
                  autoComplete="off"
                />
              </div>
              <button
                className={styles.createBtn}
                onClick={handleCreate}
                disabled={!newName.trim()}
                type="button"
              >
                Create
              </button>
            </div>

            {/* Avatar picker */}
            <div className={styles.avatarSelect} style={{ marginTop: 10 }}>
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={`${styles.avatarOption} ${emoji === selectedAvatar ? styles.avatarOptionSelected : ''}`}
                  onClick={() => setSelectedAvatar(emoji)}
                  type="button"
                  aria-label={`Select avatar ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}
          </div>
        ) : (
          <div className={styles.maxReached}>
            Maximum {maxProfiles} profiles reached. Delete a profile to create a new one.
          </div>
        )}
      </div>
    </div>
  );
}

ProfileManager.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ProfileManager;
