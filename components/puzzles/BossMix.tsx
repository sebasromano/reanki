'use client';

import { useState, useMemo } from 'react';
import { BossMixPuzzle } from '@/types/mission';
import styles from './BossMix.module.css';
import baseStyles from './puzzle-base.module.css';
import classNames from 'classnames';

interface BossMixProps {
  puzzle: BossMixPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
}

interface ItemState {
  selected: string | null;
  isCorrect: boolean | null;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function BossMix({ puzzle, onCorrect, onIncorrect }: BossMixProps) {
  const [itemStates, setItemStates] = useState<ItemState[]>(
    puzzle.items.map(() => ({ selected: null, isCorrect: null }))
  );
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Shuffle choices for each item once on mount
  const shuffledItems = useMemo(() => 
    puzzle.items.map(item => ({
      ...item,
      choices: shuffleArray(item.choices)
    })),
    [puzzle.items]
  );
  
  const correctCount = itemStates.filter(s => s.isCorrect === true).length;
  const allComplete = currentItemIndex >= puzzle.items.length;
  
  const handleSelect = (choice: string) => {
    const item = shuffledItems[currentItemIndex];
    const isCorrect = choice === item.answer;
    
    setItemStates(prev => {
      const updated = [...prev];
      updated[currentItemIndex] = { selected: choice, isCorrect };
      return updated;
    });
    
    if (!isCorrect) {
      onIncorrect();
    }
    
    // Move to next after brief delay
    setTimeout(() => {
      setCurrentItemIndex(prev => prev + 1);
    }, 1000);
  };
  
  const currentItem = shuffledItems[currentItemIndex];
  
  return (
    <div className={styles.bossContainer}>
      <div className={styles.bossHeader}>
        <span className={styles.bossIcon}>🧠</span>
        <h2 className={styles.bossTitle}>JEFE FINAL</h2>
        <p className={styles.bossSubtitle}>{puzzle.prompt}</p>
      </div>
      
      <div className={styles.progressTrack}>
        {shuffledItems.map((_, index) => (
          <div 
            key={index}
            className={classNames(styles.progressItem, {
              [styles.progressCorrect]: itemStates[index].isCorrect === true,
              [styles.progressIncorrect]: itemStates[index].isCorrect === false,
              [styles.progressCurrent]: index === currentItemIndex,
            })}
          >
            {itemStates[index].isCorrect === true ? '✓' : 
             itemStates[index].isCorrect === false ? '✗' : 
             index + 1}
          </div>
        ))}
      </div>
      
      {!allComplete && currentItem && (
        <div className={styles.questionCard}>
          <p className={styles.termPrompt}>
            Traduce: <span className={styles.term}>{currentItem.term}</span>
          </p>
          
          <div className={styles.choicesGrid}>
            {currentItem.choices.map((choice, i) => (
              <button
                key={i}
                className={styles.choiceBtn}
                onClick={() => handleSelect(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {allComplete && (
        <div className={styles.resultsCard}>
          <div className={styles.score}>
            {correctCount} / {puzzle.items.length}
          </div>
          <p className={styles.resultText}>
            {correctCount === puzzle.items.length 
              ? '¡Perfecto! Has derrotado al jefe final. 🎉'
              : correctCount >= puzzle.items.length / 2
                ? 'Bien hecho. El caso está cerrado.'
                : 'Necesitas más práctica con estos términos.'}
          </p>
          
          <div className={styles.reviewList}>
            {shuffledItems.map((item, i) => (
              <div 
                key={i} 
                className={classNames(styles.reviewItem, {
                  [styles.reviewCorrect]: itemStates[i].isCorrect,
                  [styles.reviewIncorrect]: !itemStates[i].isCorrect,
                })}
              >
                <span className={styles.reviewTerm}>{item.term}</span>
                <span className={styles.reviewArrow}>→</span>
                <span className={styles.reviewAnswer}>{item.answer}</span>
              </div>
            ))}
          </div>
          
          <button className={baseStyles.continueButton} onClick={onCorrect}>
            Completar Misión →
          </button>
        </div>
      )}
    </div>
  );
}
