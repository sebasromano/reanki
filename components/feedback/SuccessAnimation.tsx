'use client';

import { useEffect, useState } from 'react';
import styles from './SuccessAnimation.module.css';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <span className={styles.checkmark}>✓</span>
        <span className={styles.text}>¡Correcto!</span>
      </div>
    </div>
  );
}
