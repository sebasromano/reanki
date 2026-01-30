'use client';

import { useState } from 'react';
import { LogicConnectorsPuzzle } from '@/types/mission';
import styles from './LogicConnectors.module.css';
import baseStyles from './puzzle-base.module.css';
import classNames from 'classnames';

interface LogicConnectorsProps {
  puzzle: LogicConnectorsPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
}

interface ItemState {
  selected: string | null;
  isCorrect: boolean | null;
}

export function LogicConnectors({ puzzle, onCorrect, onIncorrect }: LogicConnectorsProps) {
  const [itemStates, setItemStates] = useState<ItemState[]>(
    puzzle.items.map(() => ({ selected: null, isCorrect: null }))
  );
  
  const allCorrect = itemStates.every(s => s.isCorrect === true);
  
  const handleSelect = (itemIndex: number, choice: string) => {
    const item = puzzle.items[itemIndex];
    const isCorrect = choice === item.answer;
    
    setItemStates(prev => {
      const updated = [...prev];
      updated[itemIndex] = { selected: choice, isCorrect };
      return updated;
    });
    
    if (!isCorrect) {
      onIncorrect();
      // Reset after delay
      setTimeout(() => {
        setItemStates(prev => {
          const updated = [...prev];
          updated[itemIndex] = { selected: null, isCorrect: null };
          return updated;
        });
      }, 1500);
    }
  };
  
  return (
    <div>
      <p className={baseStyles.prompt}>{puzzle.prompt}</p>
      
      <div className={styles.itemsContainer}>
        {puzzle.items.map((item, index) => {
          const state = itemStates[index];
          const sentenceParts = item.sentence.split('_____');
          
          return (
            <div key={index} className={styles.itemCard}>
              <p className={styles.sentence}>
                {sentenceParts[0]}
                <span className={classNames(styles.connectorSlot, {
                  [styles.slotCorrect]: state.isCorrect === true,
                  [styles.slotIncorrect]: state.isCorrect === false,
                })}>
                  {state.selected || '_____'}
                </span>
                {sentenceParts[1]}
              </p>
              
              {state.isCorrect !== true && (
                <div className={styles.choicesRow}>
                  {item.choices.map((choice, i) => (
                    <button
                      key={i}
                      className={styles.connectorBtn}
                      onClick={() => handleSelect(index, choice)}
                      disabled={state.isCorrect === true}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {allCorrect && (
        <>
          <div className={classNames(baseStyles.feedback, baseStyles.feedbackCorrect)}>
            ¡Todos los conectores correctos! 🎉
          </div>
          <button className={baseStyles.continueButton} onClick={onCorrect}>
            Continuar →
          </button>
        </>
      )}
    </div>
  );
}
