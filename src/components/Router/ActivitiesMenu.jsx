import React from 'react';
import styles from './PauseMenu.module.css';

export default function ActivitiesMenu({ onBack, onNavigate, onOpenPathSwitch }) {
  const activities = [
    {
      id: 'learning-path',
      icon: '\u0645\u0633\u0627\u0631',
      label: 'Learning Path',
      description: 'Change your learning path',
      route: null,
    },
    {
      id: 'grammar',
      icon: 'قواعد',
      label: 'Grammar',
      description: 'Learn Arabic grammar rules',
      route: '/grammar',
    },
    {
      id: 'roots',
      icon: 'جذور',
      label: 'Word Roots',
      description: 'Explore Arabic root patterns',
      route: '/roots',
    },
    {
      id: 'reading',
      icon: 'قراءة',
      label: 'Reading',
      description: 'Practice reading Arabic passages',
      route: '/mini-games/reading',
    },
    {
      id: 'minigames',
      icon: 'ألعاب',
      label: 'Mini-Games',
      description: 'Fun vocabulary practice games',
      route: '/mini-games',
    },
  ];

  return (
    <div className={styles.pauseMenuOverlay}>
      <div className={styles.pauseMenuTitle}>Activities</div>
      <div className={styles.activitiesMenu}>
        <div className={styles.activitiesGrid}>
          {activities.map((activity) => (
            <button
              key={activity.id}
              className={styles.activityCard}
              onClick={() => {
                if (activity.id === 'learning-path' && onOpenPathSwitch) {
                  onOpenPathSwitch();
                } else if (activity.route) {
                  onNavigate(activity.route);
                }
              }}
              aria-label={`${activity.label} - ${activity.description}`}
            >
              <div className={styles.activityCardArabic} lang="ar" aria-hidden="true">
                {activity.icon}
              </div>
              <div className={styles.activityCardLabel}>{activity.label}</div>
              <div className={styles.activityCardDesc}>{activity.description}</div>
            </button>
          ))}
        </div>
        <button onClick={onBack} className={styles.activitiesBackBtn}>
          Back
        </button>
      </div>
    </div>
  );
}
