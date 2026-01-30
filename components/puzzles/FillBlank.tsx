'use client';

import { useState } from 'react';
import { FillBlankPuzzle } from '@/types/mission';
import styles from './FillBlank.module.css';
import baseStyles from './puzzle-base.module.css';
import classNames from 'classnames';

interface FillBlankProps {
  puzzle: FillBlankPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function FillBlank({ puzzle, onCorrect, onIncorrect }: FillBlankProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Parse prompt to find blank position
  const promptParts = puzzle.prompt.split('____');
  
  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === puzzle.answer;
    setIsAnswered(true);
    setIsCorrect(correct);
    
    if (!correct) {
      onIncorrect();
    }
  };
  
  const handleContinue = () => {
    if (isCorrect) {
      onCorrect();
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  };
  
  return (
    <div>
      <div className={styles.sentenceBox}>
        <p className={styles.sentence}>
          {promptParts[0]}
          <span className={classNames(styles.blank, {
            [styles.blankFilled]: selectedOption,
            [styles.blankCorrect]: isAnswered && isCorrect,
            [styles.blankIncorrect]: isAnswered && !isCorrect,
          })}>
            {selectedOption || '____'}
          </span>
          {promptParts[1]}
        </p>
      </div>
      
      <div className={styles.optionsRow}>
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            className={classNames(styles.optionChip, {
              [styles.selected]: selectedOption === option,
              [styles.correctOption]: isAnswered && option === puzzle.answer,
              [styles.incorrectOption]: isAnswered && selectedOption === option && option !== puzzle.answer,
            })}
            onClick={() => !isAnswered && handleSelect(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      
      {!isAnswered && selectedOption && (
        <button className={baseStyles.continueButton} onClick={handleSubmit}>
          Confirmar respuesta
        </button>
      )}
      
      {isAnswered && (
        <>
          <div className={classNames(
            baseStyles.feedback,
            isCorrect ? baseStyles.feedbackCorrect : baseStyles.feedbackIncorrect
          )}>
            {isCorrect ? '¡Correcto! 🎉' : `Incorrecto. La respuesta es "${puzzle.answer}".`}
          </div>
          
          <button className={baseStyles.continueButton} onClick={handleContinue}>
            {isCorrect ? 'Continuar →' : 'Reintentar'}
          </button>
        </>
      )}
    </div>
  );
}
