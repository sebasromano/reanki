'use client';

import { useState } from 'react';
import { useMission } from '@/context/MissionContext';
import styles from './TermHighlight.module.css';

interface TermHighlightProps {
  term: string;
  inline?: boolean;
}

export function TermHighlight({ term, inline = false }: TermHighlightProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { getTerm } = useMission();
  
  const lexiconEntry = getTerm(term);
  
  const className = inline ? `${styles.term} ${styles.inline}` : styles.term;
  
  return (
    <span 
      className={className}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {term}
      
      {showTooltip && lexiconEntry && (
        <span className={styles.tooltip}>
          <span className={styles.translation}>{lexiconEntry.translation}</span>
          {lexiconEntry.note && (
            <span className={styles.note}>{lexiconEntry.note}</span>
          )}
        </span>
      )}
    </span>
  );
}
