import Link from 'next/link';
import styles from './SceneHeader.module.css';

interface SceneHeaderProps {
  sceneNumber: number;
  label: string;
  icon: string;
  mistakes: number;
  maxMistakes: number;
}

export function SceneHeader({ 
  sceneNumber, 
  label, 
  icon, 
  mistakes, 
  maxMistakes 
}: SceneHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.backLink}>
        ← Volver al mapa
      </Link>
      
      <div className={styles.titleGroup}>
        <span className={styles.icon}>{icon}</span>
        <div>
          <span className={styles.sceneNumber}>Escena {sceneNumber}</span>
          <h1 className={styles.label}>{label}</h1>
        </div>
      </div>
      
      <div className={styles.mistakeTracker}>
        <span className={styles.mistakeLabel}>Errores:</span>
        <div className={styles.hearts}>
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <span 
              key={i} 
              className={i < (maxMistakes - mistakes) ? styles.heartFull : styles.heartEmpty}
            >
              ♥
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
