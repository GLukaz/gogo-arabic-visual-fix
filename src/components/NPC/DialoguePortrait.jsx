import styles from './DialogueOverlay.module.css';

/**
 * DialoguePortrait
 * NPC portrait with name labels (English and Arabic)
 */
export default function DialoguePortrait({ npc }) {
  const portraitSrc = `/assets/portraits/${npc.portrait}.png`;

  return (
    <div className={styles.portraitWrap}>
      <div className={styles.portrait}>
        <img
          src={portraitSrc}
          alt={npc.name}
          className={styles.portraitImg}
          draggable={false}
        />
      </div>
      <div className={styles.portraitName}>{npc.name}</div>
      <div className={styles.portraitNameArabic}>{npc.nameArabic}</div>
    </div>
  );
}
