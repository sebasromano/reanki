'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.content}>
        <span className={styles.icon}>⚠️</span>
        <h2 className={styles.title}>Algo salió mal</h2>
        <p className={styles.message}>
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <button 
          className={styles.retryButton}
          onClick={() => reset()}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
