'use client';

import { Evidence } from '@/types/mission';
import styles from './EvidenceCard.module.css';
import classNames from 'classnames';

interface EvidenceCardProps {
  evidence: Evidence;
  isNew?: boolean;
  showImage?: boolean;
}

// Map evidence titles to actual image filenames
const evidenceImageMap: Record<string, string> = {
  'Pista 1: Señal fugaz': 'pista-1-signal.png',
  'Pista 2: Regla que falla': 'pista-2-rule.png',
  'Pista 3: Voluntad agotada': 'pista-3-will.png',
  'Pista 4: Retirada súbita': 'pista-4-withdrawal.png',
  'Pista 5: Señales de dinero': 'pista-5-money.png',
  'Pista 6: Activación': 'pista-6-arousal.png',
  'Pista 7: Error impulsivo': 'pista-7-memory.png',
  'Pista 8: Mismo hecho, distinto marco': 'pista-8-framing.png',
  'Pista 9: Ilusión retrospectiva': 'pista-9-hindsight.png',
  'Pista 10: Autoridad persuasiva': 'pista-10-authority.png',
  'Pista 11: Doble significado': 'pista-11-double.png',
  'Informe final': 'pista-12-final.png',
};

export function EvidenceCard({ evidence, isNew = false, showImage = true }: EvidenceCardProps) {
  // Get image path from map or generate fallback
  const getImagePath = () => {
    const mappedImage = evidenceImageMap[evidence.title];
    if (mappedImage) {
      return `/assets/evidence/${mappedImage}`;
    }
    // Fallback: generate from title
    const imageSlug = evidence.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `/assets/evidence/${imageSlug}.png`;
  };
  
  return (
    <article className={classNames(styles.card, { [styles.isNew]: isNew })}>
      {isNew && <span className={styles.newBadge}>NUEVO</span>}
      
      {showImage && (
        <div className={styles.imageWrapper}>
          <img 
            src={getImagePath()}
            alt=""
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <h4 className={styles.title}>{evidence.title}</h4>
        <p className={styles.note}>{evidence.noteEs}</p>
        
        <div className={styles.tags}>
          {evidence.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
