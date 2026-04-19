import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setName as setPlayerName,
  setSkinTone as setPlayerSkinTone,
  setOutfit as setPlayerOutfit,
  setHeadCovering as setPlayerHeadCovering,
} from '../../store/slices/playerSlice.js';
import styles from './CharacterCreation.module.css';

// ---- Data ----
const SKIN_TONES = [
  { id: 0, label: 'Light', color: '#F5D0A9' },
  { id: 1, label: 'Medium', color: '#D4A76A' },
  { id: 2, label: 'Tan', color: '#A67B4B' },
  { id: 3, label: 'Dark', color: '#6B4226' },
];

const HEAD_COVERINGS = [
  { id: 'kufi', label: 'Kufi' },
  { id: 'ghutra', label: 'Ghutra' },
  { id: 'turban', label: 'Turban' },
  { id: 'hijab', label: 'Hijab' },
  { id: 'hood', label: 'Hood' },
  { id: 'none', label: 'None' },
];

const STARTING_OUTFITS = [
  { id: 'simple-thobe', label: 'Thobe', labelAr: 'ثوب', desc: 'White' },
  { id: 'simple-abaya', label: 'Abaya', labelAr: 'عباءة', desc: 'Black' },
  { id: 'travellers-cloak', label: 'Cloak', labelAr: 'عباءة', desc: 'Brown' },
];

// ---- Styles removed - now using CSS Module ----

/**
 * Draws a character preview on a canvas using the body + head sprites.
 */
function CharacterPreview({ outfit, headCovering, skinTone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Clear
    ctx.clearRect(0, 0, 192, 192);

    // Load body sprite and draw the first frame (128x128 → scaled to 192x192)
    const bodyImg = new Image();
    bodyImg.crossOrigin = 'anonymous';
    bodyImg.src = `/assets/sprites/player/bodies/${outfit}.png`;
    bodyImg.onload = () => {
      // Draw first frame (top-left 128x128 cell) scaled to 192
      ctx.clearRect(0, 0, 192, 192);

      // Apply skin tone tint via globalCompositeOperation
      ctx.drawImage(bodyImg, 0, 0, 128, 128, 0, 0, 192, 192);

      // Apply tint overlay for skin tone
      if (skinTone !== 1) {
        ctx.globalCompositeOperation = 'multiply';
        const tintColors = ['#FFF5E8', '#FFFFFF', '#E8D0B0', '#C0A080'];
        ctx.fillStyle = tintColors[skinTone] || '#FFFFFF';
        ctx.fillRect(0, 0, 192, 192);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(bodyImg, 0, 0, 128, 128, 0, 0, 192, 192);
        ctx.globalCompositeOperation = 'source-over';
      }

      // Load and draw head covering on top
      const headImg = new Image();
      headImg.crossOrigin = 'anonymous';
      headImg.src = `/assets/sprites/player/heads/${headCovering}.png`;
      headImg.onload = () => {
        ctx.drawImage(headImg, 0, 0, 128, 128, 0, 0, 192, 192);

        // Tint head too
        if (skinTone !== 1) {
          ctx.globalCompositeOperation = 'multiply';
          const tintColors = ['#FFF5E8', '#FFFFFF', '#E8D0B0', '#C0A080'];
          ctx.fillStyle = tintColors[skinTone] || '#FFFFFF';
          ctx.fillRect(0, 0, 192, 192);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(headImg, 0, 0, 128, 128, 0, 0, 192, 192);
          ctx.globalCompositeOperation = 'source-over';
        }
      };
    };
  }, [outfit, headCovering, skinTone]);

  return (
    <canvas
      ref={canvasRef}
      width={192}
      height={192}
      style={{ imageRendering: 'pixelated', width: '192px', height: '192px' }}
    />
  );
}

export default function CharacterCreation({ onDone }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [skinTone, setSkinTone] = useState(1); // medium
  const [headCovering, setHeadCovering] = useState('kufi');
  const [outfit, setOutfit] = useState('simple-thobe');

  const handleStart = () => {
    if (!name.trim()) return;
    dispatch(setPlayerName(name.trim()));
    dispatch(setPlayerSkinTone(skinTone));
    dispatch(setPlayerOutfit(outfit));
    dispatch(setPlayerHeadCovering(headCovering));
    onDone();
  };

  return (
    <div className={styles.container} role="main">
      <div className={styles.panel}>
        <h1 className={styles.title}>Create Your Character</h1>
        <div className={styles.titleAr} lang="ar" aria-hidden="true">أنشئ شخصيتك</div>

        {/* Live character preview */}
        <div className={styles.preview} role="img" aria-label={`Character preview: ${name || 'Unnamed'}`}>
          <CharacterPreview
            outfit={outfit}
            headCovering={headCovering}
            skinTone={skinTone}
          />
        </div>

        {/* Name input */}
        <div className={styles.field}>
          <label htmlFor="character-name" className={styles.label}>Your Name / اسمك</label>
          <input
            id="character-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            maxLength={20}
            aria-label="Enter your character's name"
            aria-required="true"
          />
        </div>

        {/* Skin tone selector */}
        <div className={styles.field}>
          <span className={styles.label} id="skin-tone-label">Skin Tone / لون البشرة</span>
          <div className={styles.options} role="group" aria-labelledby="skin-tone-label">
            {SKIN_TONES.map((tone) => (
              <button
                key={tone.id}
                className={`${styles.swatch} ${skinTone === tone.id ? styles.swatchSelected : ''}`}
                style={{ backgroundColor: tone.color }}
                onClick={() => setSkinTone(tone.id)}
                aria-label={tone.label}
                aria-pressed={skinTone === tone.id}
              />
            ))}
          </div>
        </div>

        {/* Head covering selector */}
        <div className={styles.field}>
          <span className={styles.label} id="head-covering-label">Head Covering / غطاء الرأس</span>
          <div className={styles.options} role="group" aria-labelledby="head-covering-label">
            {HEAD_COVERINGS.map((hc) => (
              <button
                key={hc.id}
                className={`${styles.option} ${headCovering === hc.id ? styles.optionSelected : ''}`}
                onClick={() => setHeadCovering(hc.id)}
                aria-label={hc.label}
                aria-pressed={headCovering === hc.id}
              >
                {hc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Starting outfit selector */}
        <div className={styles.field}>
          <span className={styles.label} id="outfit-label">Starting Outfit / الزي</span>
          <div className={styles.options} role="group" aria-labelledby="outfit-label">
            {STARTING_OUTFITS.map((o) => (
              <button
                key={o.id}
                className={`${styles.option} ${outfit === o.id ? styles.optionSelected : ''}`}
                onClick={() => setOutfit(o.id)}
                aria-label={`${o.label} - ${o.desc}`}
                aria-pressed={outfit === o.id}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`${styles.btn} ${!name.trim() ? styles.btnDisabled : ''}`}
          onClick={handleStart}
          disabled={!name.trim()}
          aria-label="Begin your Arabic learning journey"
          aria-disabled={!name.trim()}
        >
          Begin Journey / ابدأ الرحلة
        </button>
      </div>
    </div>
  );
}
