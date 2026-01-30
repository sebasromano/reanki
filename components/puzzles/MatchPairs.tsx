'use client';

import { useState } from 'react';
import { MatchPairsPuzzle } from '@/types/mission';
import styles from './MatchPairs.module.css';
import baseStyles from './puzzle-base.module.css';
import classNames from 'classnames';

interface MatchPairsProps {
  puzzle: MatchPairsPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
}

interface PairState {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export function MatchPairs({ puzzle, onCorrect, onIncorrect }: MatchPairsProps) {
  const [pairStates, setPairStates] = useState<Record<string, PairState>>(
    Object.fromEntries(puzzle.pairs.map(p => [p.term, { selectedAnswer: null, isCorrect: null }]))
  );
  
  const allAnswered = Object.values(pairStates).every(s => s.isCorrect === true);
  
  const handleSelect = (term: string, choice: string, correctAnswer: string) => {
    const isCorrect = choice === correctAnswer;
    
    setPairStates(prev => ({
      ...prev,
      [term]: { selectedAnswer: choice, isCorrect }
    }));
    
    if (!isCorrect) {
      onIncorrect();
      // Reset after delay
      setTimeout(() => {
        setPairStates(prev => ({
          ...prev,
          [term]: { selectedAnswer: null, isCorrect: null }
        }));
      }, 1500);
    }
  };
  
  return (
    <div>
      <p className={baseStyles.prompt}>{puzzle.prompt}</p>
      
      <div className={styles.pairsContainer}>
        {puzzle.pairs.map((pair) => {
          const state = pairStates[pair.term];
          
          return (
            <div key={pair.term} className={styles.pairRow}>
              <div className={styles.termBox}>
                <span className={styles.term}>{pair.term}</span>
              </div>
              
              <div className={styles.arrow}>→</div>
              
              <div className={styles.choicesColumn}>
                {state.isCorrect ? (
                  <div className={classNames(styles.answerBox, styles.correct)}>
                    ✓ {pair.answer}
                  </div>
                ) : (
                  pair.choices.map((choice, i) => (
                    <button
                      key={i}
                      className={classNames(styles.choiceBtn, {
                        [styles.incorrect]: state.selectedAnswer === choice && !state.isCorrect,
                      })}
                      onClick={() => handleSelect(pair.term, choice, pair.answer)}
                      disabled={state.isCorrect === true}
                    >
                      {choice}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {allAnswered && (
        <>
          <div className={classNames(baseStyles.feedback, baseStyles.feedbackCorrect)}>
            ¡Todos los pares correctos! 🎉
          </div>
          <button className={baseStyles.continueButton} onClick={onCorrect}>
            Continuar →
          </button>
        </>
      )}
    </div>
  );
}
