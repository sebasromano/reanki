'use client';

import { useEffect, useState } from 'react';
import styles from './ErrorShake.module.css';

interface ErrorShakeProps {
  trigger: number; // Increment to trigger animation
  children: React.ReactNode;
}

export function ErrorShake({ trigger, children }: ErrorShakeProps) {
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (trigger > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  return (
    <div className={shake ? styles.shake : ''}>
      {children}
    </div>
  );
}
