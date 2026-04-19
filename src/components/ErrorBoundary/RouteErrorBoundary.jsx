import { Component } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import styles from './RouteErrorBoundary.module.css';

// Hook-based error boundary component
export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error:', error);

  const handleReturnToMenu = () => {
    navigate('/');
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.pixelHeart}>💔</div>

      <div className={styles.title}>Oops! Something broke</div>

      <div className={styles.message}>
        An error occurred while loading this page.
        <br />
        Don&apos;t worry, your progress is saved!
      </div>

      {error && (
        <div className={styles.errorDetails}>
          <strong>Error Details:</strong>
          <br />
          {error.message || error.statusText || String(error)}
          <br />
          {error.stack && (
            <>
              <br />
              <strong>Stack Trace:</strong>
              <br />
              {error.stack}
            </>
          )}
        </div>
      )}

      <div className={styles.buttonColumn}>
        <button onClick={handleReturnToMenu} className={styles.btn}>
          Return to Main Menu
        </button>

        <button onClick={handleReload} className={styles.btnOutline}>
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Class-based error boundary for non-route errors
export default class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.pixelHeart}>💔</div>

          <div className={styles.title}>Oops! Something broke</div>

          <div className={styles.message}>
            An error occurred in the application.
            <br />
            Don&apos;t worry, your progress is saved!
          </div>

          {this.state.error && (
            <div className={styles.errorDetails}>
              <strong>Error Details:</strong>
              <br />
              {this.state.error.message || String(this.state.error)}
              <br />
              {this.state.error.stack && (
                <>
                  <br />
                  <strong>Stack Trace:</strong>
                  <br />
                  {this.state.error.stack}
                </>
              )}
            </div>
          )}

          <div className={styles.buttonColumn}>
            <button
              onClick={() => window.location.href = '/'}
              className={styles.btn}
            >
              Return to Main Menu
            </button>

            <button
              onClick={() => window.location.reload()}
              className={styles.btnOutline}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
