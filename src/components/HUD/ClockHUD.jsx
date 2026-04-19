import { useSelector } from 'react-redux';
import { selectFormattedTime, selectTimePhase, TIME_PHASES } from '../../store/slices/timeSlice';
import styles from './ClockHUD.module.css';

// Inline SVG icons to avoid react-icons dependency
const SunIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" />
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" />
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const CloudSunIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <circle cx="18" cy="8" r="4" opacity="0.7" />
        <path d="M4.5 16a4.5 4.5 0 0 1 0-9h.5a5 5 0 0 1 9.8 1.1A3.5 3.5 0 0 1 18 15.5H4.5z" />
    </svg>
);

const CloudMoonIcon = () => (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M20 10.79A7 7 0 0 1 13.21 4 5.5 5.5 0 0 0 20 10.79z" opacity="0.7" />
        <path d="M4.5 16a4.5 4.5 0 0 1 0-9h.5a5 5 0 0 1 9.8 1.1A3.5 3.5 0 0 1 18 15.5H4.5z" />
    </svg>
);

const PhaseIcons = {
    [TIME_PHASES.DAWN]: <CloudSunIcon />,
    [TIME_PHASES.MORNING]: <SunIcon />,
    [TIME_PHASES.NOON]: <SunIcon />,
    [TIME_PHASES.AFTERNOON]: <SunIcon />,
    [TIME_PHASES.SUNSET]: <CloudMoonIcon />,
    [TIME_PHASES.NIGHT]: <MoonIcon />,
};

const PhaseLabels = {
    [TIME_PHASES.DAWN]: 'الفجر',
    [TIME_PHASES.MORNING]: 'الصباح',
    [TIME_PHASES.NOON]: 'الظهر',
    [TIME_PHASES.AFTERNOON]: 'العصر',
    [TIME_PHASES.SUNSET]: 'المغرب',
    [TIME_PHASES.NIGHT]: 'العشاء', // Or 'الليل'
};

const ClockHUD = () => {
    const timeString = useSelector(selectFormattedTime);
    const phase = useSelector(selectTimePhase);

    return (
        <div className={styles.container}>
            <div className={styles.icon}>{PhaseIcons[phase]}</div>
            <div className={styles.time}>{timeString}</div>
            <div className={styles.phase}>{PhaseLabels[phase]}</div>
        </div>
    );
};

export default ClockHUD;
