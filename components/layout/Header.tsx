'use client';

import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import { ProgressBar } from '../map/ProgressBar';
import styles from './Header.module.css';

export function Header() {
  const { config, progress } = useMission();
  
  if (!config) return null;
  
  const completedScenes = progress 
    ? Object.values(progress.scenes).filter(s => s.status === 'completed').length 
    : 0;
  const totalScenes = config.scenes.length;
  
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/" className={styles.title}>
          <h1>{config.title}</h1>
          <span className={styles.subtitle}>{config.subtitle}</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/lexicon" className={styles.navLink}>
            📖 Léxico
          </Link>
          <Link href="/evidence" className={styles.navLink}>
            🗂️ Evidencia ({progress?.collectedEvidence.length ?? 0})
          </Link>
        </nav>
      </div>
      
      {config.ui.map.showProgress && (
        <ProgressBar current={completedScenes} total={totalScenes} />
      )}
    </header>
  );
}
