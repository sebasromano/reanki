'use client';

import { useState, useMemo } from 'react';
import { MCQTranslationPuzzle } from '@/types/mission';
import styles from './puzzle-base.module.css';
import classNames from 'classnames';

interface MCQTranslationProps {
  puzzle: MCQTranslationPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
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

export function MCQTranslation({ puzzle, onCorrect, onIncorrect }: MCQTranslationProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Shuffle choices once on mount
  const shuffledChoices = useMemo(() => shuffleArray(puzzle.choices), [puzzle.choices]);
  
  const handleSelect = (choice: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(choice);
    setIsAnswered(true);
    
    const correct = choice === puzzle.answer;
    setIsCorrect(correct);
    
    if (!correct) {
      onIncorrect();
    }
  };
  
  const handleContinue = () => {
    if (isCorrect) {
      onCorrect();
    } else {
      // Reset for retry
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };
  
  return (
    <div>
      <p className={styles.prompt}>
        {puzzle.prompt}
        <br />
        <span className={styles.termHighlight}>{puzzle.term}</span>
      </p>
      
      <div className={styles.choicesGrid}>
        {shuffledChoices.map((choice, index) => (
          <button
            key={index}
            className={classNames(styles.choiceButton, {
              [styles.choiceCorrect]: isAnswered && choice === puzzle.answer,
              [styles.choiceIncorrect]: isAnswered && selectedAnswer === choice && choice !== puzzle.answer,
            })}
            onClick={() => handleSelect(choice)}
            disabled={isAnswered}
          >
            {choice}
          </button>
        ))}
      </div>
      
      {isAnswered && (
        <>
          <div className={classNames(
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
          )}>
            {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto. Inténtalo de nuevo.'}
          </div>
          
          <button className={styles.continueButton} onClick={handleContinue}>
            {isCorrect ? 'Continuar →' : 'Reintentar'}
          </button>
        </>
      )}
    </div>
  );
}
