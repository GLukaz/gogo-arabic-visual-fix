import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.camel}>🐪</div>

      <div className={styles.notFoundCode}>404</div>

      <div className={styles.title}>Page Not Found</div>

      <div className={styles.arabicText}>الصفحة غير موجودة</div>

      <div className={styles.message}>
        This page doesn&apos;t exist in the desert.
        <br />
        Perhaps it was lost in a sandstorm...
      </div>

      <div className={styles.buttonRow}>
        <button onClick={handleGoHome} className={styles.btn}>
          Main Menu
        </button>

        <button onClick={handleGoBack} className={styles.btnOutline}>
          Go Back
        </button>
      </div>
    </div>
  );
}
