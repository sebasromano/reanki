'use client';

import { useState } from 'react';
import { BilingualText } from '@/types/mission';
import { TermHighlight } from './TermHighlight';
import styles from './StoryPanel.module.css';

interface StoryPanelProps {
  story: BilingualText;
  focusTerms: string[];
  onContinue: () => void;
}

export function StoryPanel({ story, focusTerms, onContinue }: StoryPanelProps) {
  const [showSpanish, setShowSpanish] = useState(false);
  
  const highlightedEnglish = highlightTerms(story.en, focusTerms);
  
  return (
    <div className={styles.panel}>
      <div className={styles.storyContent}>
        <div className={styles.languageTab}>
          <button 
            className={!showSpanish ? styles.activeTab : styles.tab}
            onClick={() => setShowSpanish(false)}
          >
            English
          </button>
          <button 
            className={showSpanish ? styles.activeTab : styles.tab}
            onClick={() => setShowSpanish(true)}
          >
            Español
          </button>
        </div>
        
        <div className={styles.textContainer}>
          {!showSpanish ? (
            <p className={styles.storyText}>
              {highlightedEnglish}
            </p>
          ) : (
            <p className={styles.storyText}>
              {story.es}
            </p>
          )}
        </div>
        
        <div className={styles.termsPreview}>
          <span className={styles.termsLabel}>Términos clave:</span>
          <div className={styles.termsList}>
            {focusTerms.slice(0, 5).map(term => (
              <TermHighlight key={term} term={term} inline />
            ))}
            {focusTerms.length > 5 && (
              <span className={styles.moreTerms}>+{focusTerms.length - 5} más</span>
            )}
          </div>
        </div>
      </div>
      
      <button className={styles.continueButton} onClick={onContinue}>
        Comenzar Puzzles →
      </button>
    </div>
  );
}

function highlightTerms(text: string, terms: string[]): React.ReactNode[] {
  if (terms.length === 0) return [text];
  
  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Create regex pattern
  const pattern = new RegExp(
    `(${sortedTerms.map(t => escapeRegex(t)).join('|')})`,
    'gi'
  );
  
  const parts = text.split(pattern);
  
  return parts.map((part, index) => {
    const matchingTerm = terms.find(
      t => t.toLowerCase() === part.toLowerCase()
    );
    
    if (matchingTerm) {
      return <TermHighlight key={index} term={part} />;
    }
    
    return part;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
