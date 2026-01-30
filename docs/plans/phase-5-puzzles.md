# Phase 5: Puzzle Components

## Objective

Build all five puzzle types identified in the config: MCQ Translation, Match Pairs, Fill Blank, Logic Connectors, and Boss Mix.

## Tasks

### 5.1 Create Puzzle Container (Orchestrator)

**`components/puzzles/PuzzleContainer.tsx`**
```tsx
'use client';

import { Puzzle } from '@/types/mission';
import { useMission } from '@/context/MissionContext';
import { MCQTranslation } from './MCQTranslation';
import { MatchPairs } from './MatchPairs';
import { FillBlank } from './FillBlank';
import { LogicConnectors } from './LogicConnectors';
import { BossMix } from './BossMix';
import styles from './PuzzleContainer.module.css';

interface PuzzleContainerProps {
  puzzles: Puzzle[];
  currentIndex: number;
  sceneId: string;
  onPuzzleComplete: (puzzleIndex: number) => void;
}

export function PuzzleContainer({
  puzzles,
  currentIndex,
  sceneId,
  onPuzzleComplete,
}: PuzzleContainerProps) {
  const { completePuzzle, recordMistake } = useMission();
  
  const puzzle = puzzles[currentIndex];
  
  if (!puzzle) {
    return <div className={styles.error}>No puzzle found</div>;
  }
  
  const handleCorrect = () => {
    completePuzzle(sceneId, currentIndex);
    onPuzzleComplete(currentIndex);
  };
  
  const handleIncorrect = () => {
    recordMistake(sceneId);
  };
  
  const commonProps = {
    onCorrect: handleCorrect,
    onIncorrect: handleIncorrect,
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <span>Puzzle {currentIndex + 1} de {puzzles.length}</span>
        <div className={styles.dots}>
          {puzzles.map((_, i) => (
            <span 
              key={i} 
              className={i < currentIndex ? styles.dotComplete : 
                         i === currentIndex ? styles.dotCurrent : styles.dot}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.puzzleWrapper}>
        {puzzle.type === 'mcq_translation' && (
          <MCQTranslation puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'match_pairs' && (
          <MatchPairs puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'fill_blank' && (
          <FillBlank puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'logic_connectors' && (
          <LogicConnectors puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'boss_mix' && (
          <BossMix puzzle={puzzle} {...commonProps} />
        )}
      </div>
    </div>
  );
}
```

**`components/puzzles/PuzzleContainer.module.css`**
```css
.container {
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: 4px 4px 0 var(--color-ink);
}

.progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px dashed var(--color-ink);
  font-family: var(--font-display);
  font-size: 0.875rem;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot,
.dotCurrent,
.dotComplete {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-round);
  border: 2px solid var(--color-ink);
}

.dot {
  background: var(--color-cream);
}

.dotCurrent {
  background: var(--color-accent-gold);
  animation: pulse 1s infinite;
}

.dotComplete {
  background: var(--color-accent-blue);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.puzzleWrapper {
  min-height: 300px;
}

.error {
  text-align: center;
  color: var(--color-accent-rust);
  font-family: var(--font-display);
}
```

### 5.2 Create Base Puzzle Styles

**`components/puzzles/puzzle-base.module.css`**
```css
.prompt {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  color: var(--color-ink);
}

.termHighlight {
  background: var(--color-accent-gold);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.choicesGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 600px) {
  .choicesGrid {
    grid-template-columns: 1fr;
  }
}

.choiceButton {
  padding: var(--spacing-md);
  font-family: var(--font-body);
  font-size: 1rem;
  background: white;
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.choiceButton:hover:not(:disabled) {
  background: var(--color-sepia);
  transform: translateX(4px);
}

.choiceButton:disabled {
  cursor: not-allowed;
}

.choiceCorrect {
  background: #27ae60 !important;
  color: white !important;
  border-color: #1e8449 !important;
}

.choiceIncorrect {
  background: #c0392b !important;
  color: white !important;
  border-color: #922b21 !important;
}

.feedback {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-align: center;
  font-family: var(--font-display);
}

.feedbackCorrect {
  background: #d4edda;
  border: 2px solid #27ae60;
  color: #155724;
}

.feedbackIncorrect {
  background: #f8d7da;
  border: 2px solid #c0392b;
  color: #721c24;
}

.continueButton {
  display: block;
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  font-family: var(--font-display);
  font-size: 1rem;
  background: var(--color-accent-gold);
  color: var(--color-ink);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--color-ink);
  transition: all 0.2s ease;
}

.continueButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-ink);
}
```

### 5.3 Create MCQ Translation Puzzle

**`components/puzzles/MCQTranslation.tsx`**
```tsx
'use client';

import { useState } from 'react';
import { MCQTranslationPuzzle } from '@/types/mission';
import styles from './puzzle-base.module.css';
import classNames from 'classnames';

interface MCQTranslationProps {
  puzzle: MCQTranslationPuzzle;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export function MCQTranslation({ puzzle, onCorrect, onIncorrect }: MCQTranslationProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
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
        {puzzle.choices.map((choice, index) => (
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
```

### 5.4 Create Match Pairs Puzzle

**`components/puzzles/MatchPairs.tsx`**
```tsx
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
```

**`components/puzzles/MatchPairs.module.css`**
```css
.pairsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.pairRow {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.termBox {
  background: var(--color-accent-gold);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  min-width: 150px;
  text-align: center;
}

.term {
  font-family: var(--font-display);
  font-weight: 600;
}

.arrow {
  font-size: 1.5rem;
  color: var(--color-ink);
}

.choicesColumn {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.choiceBtn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  background: white;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.choiceBtn:hover:not(:disabled) {
  background: var(--color-sepia);
}

.choiceBtn.incorrect {
  background: #c0392b;
  color: white;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.answerBox {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.answerBox.correct {
  background: #27ae60;
  color: white;
  border: 2px solid #1e8449;
}

@media (max-width: 600px) {
  .pairRow {
    flex-direction: column;
    align-items: stretch;
  }
  
  .arrow {
    transform: rotate(90deg);
    align-self: center;
  }
  
  .termBox {
    min-width: auto;
  }
}
```

### 5.5 Create Fill Blank Puzzle

**`components/puzzles/FillBlank.tsx`**
```tsx
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
```

**`components/puzzles/FillBlank.module.css`**
```css
.sentenceBox {
  background: white;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.sentence {
  font-size: 1.25rem;
  line-height: 1.8;
  text-align: center;
}

.blank {
  display: inline-block;
  min-width: 120px;
  padding: var(--spacing-xs) var(--spacing-md);
  margin: 0 var(--spacing-xs);
  border-bottom: 3px solid var(--color-ink);
  font-weight: 600;
  text-align: center;
}

.blankFilled {
  background: var(--color-sepia);
  border-radius: var(--radius-sm);
  border-bottom: none;
  border: 2px solid var(--color-ink);
}

.blankCorrect {
  background: #27ae60;
  color: white;
}

.blankIncorrect {
  background: #c0392b;
  color: white;
}

.optionsRow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  justify-content: center;
}

.optionChip {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-display);
  font-size: 0.875rem;
  background: var(--color-cream);
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.optionChip:hover:not(:disabled) {
  background: var(--color-accent-gold);
  transform: translateY(-2px);
}

.optionChip.selected {
  background: var(--color-ink);
  color: var(--color-cream);
}

.optionChip.correctOption {
  background: #27ae60;
  color: white;
  border-color: #1e8449;
}

.optionChip.incorrectOption {
  background: #c0392b;
  color: white;
  border-color: #922b21;
}

.optionChip:disabled {
  cursor: not-allowed;
}
```

### 5.6 Create Logic Connectors Puzzle

**`components/puzzles/LogicConnectors.tsx`**
```tsx
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
```

**`components/puzzles/LogicConnectors.module.css`**
```css
.itemsContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.itemCard {
  background: white;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.sentence {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.connectorSlot {
  display: inline-block;
  min-width: 100px;
  padding: 2px var(--spacing-sm);
  margin: 0 4px;
  background: var(--color-sepia);
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-align: center;
  font-style: italic;
}

.slotCorrect {
  background: #27ae60;
  color: white;
}

.slotIncorrect {
  background: #c0392b;
  color: white;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.choicesRow {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.connectorBtn {
  padding: var(--spacing-xs) var(--spacing-md);
  font-family: var(--font-display);
  font-size: 0.75rem;
  text-transform: lowercase;
  font-style: italic;
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.connectorBtn:hover {
  background: var(--color-accent-gold);
}
```

### 5.7 Create Boss Mix Puzzle

**`components/puzzles/BossMix.tsx`**
```tsx
'use client';

import { useState } from 'react';
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

export function BossMix({ puzzle, onCorrect, onIncorrect }: BossMixProps) {
  const [itemStates, setItemStates] = useState<ItemState[]>(
    puzzle.items.map(() => ({ selected: null, isCorrect: null }))
  );
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  const correctCount = itemStates.filter(s => s.isCorrect === true).length;
  const allComplete = currentItemIndex >= puzzle.items.length;
  
  const handleSelect = (choice: string) => {
    const item = puzzle.items[currentItemIndex];
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
  
  const currentItem = puzzle.items[currentItemIndex];
  
  return (
    <div className={styles.bossContainer}>
      <div className={styles.bossHeader}>
        <span className={styles.bossIcon}>🧠</span>
        <h2 className={styles.bossTitle}>JEFE FINAL</h2>
        <p className={styles.bossSubtitle}>{puzzle.prompt}</p>
      </div>
      
      <div className={styles.progressTrack}>
        {puzzle.items.map((item, index) => (
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
            {puzzle.items.map((item, i) => (
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
```

**`components/puzzles/BossMix.module.css`**
```css
.bossContainer {
  text-align: center;
}

.bossHeader {
  margin-bottom: var(--spacing-xl);
}

.bossIcon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--spacing-sm);
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bossTitle {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.1em;
  color: var(--color-accent-rust);
  margin: 0;
}

.bossSubtitle {
  font-size: 0.875rem;
  color: var(--color-ink);
  opacity: 0.8;
}

.progressTrack {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.progressItem {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-round);
  font-family: var(--font-display);
  font-size: 0.875rem;
  background: var(--color-cream);
}

.progressCurrent {
  background: var(--color-accent-gold);
  animation: pulse 1s infinite;
}

.progressCorrect {
  background: #27ae60;
  color: white;
}

.progressIncorrect {
  background: #c0392b;
  color: white;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.questionCard {
  background: white;
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  box-shadow: 4px 4px 0 var(--color-ink);
}

.termPrompt {
  font-size: 1rem;
  margin-bottom: var(--spacing-lg);
}

.term {
  display: block;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-accent-rust);
  margin-top: var(--spacing-sm);
  font-family: var(--font-display);
}

.choicesGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 600px) {
  .choicesGrid {
    grid-template-columns: 1fr;
  }
}

.choiceBtn {
  padding: var(--spacing-md);
  font-size: 1rem;
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.choiceBtn:hover {
  background: var(--color-accent-gold);
  transform: translateY(-2px);
}

.resultsCard {
  background: white;
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
}

.score {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-accent-gold);
  text-shadow: 2px 2px 0 var(--color-ink);
}

.resultText {
  font-size: 1.125rem;
  margin: var(--spacing-md) 0 var(--spacing-xl);
}

.reviewList {
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.reviewItem {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.reviewCorrect {
  background: #d4edda;
}

.reviewIncorrect {
  background: #f8d7da;
}

.reviewTerm {
  font-weight: 600;
  min-width: 100px;
}

.reviewArrow {
  color: var(--color-ink);
  opacity: 0.5;
}

.reviewAnswer {
  flex: 1;
}
```

## Validation Checklist

- [ ] MCQ Translation: Selecting answer shows correct/incorrect feedback
- [ ] MCQ Translation: Incorrect allows retry, correct advances
- [ ] Match Pairs: All pairs must be matched to continue
- [ ] Match Pairs: Incorrect selection shakes and resets
- [ ] Fill Blank: Option selection fills the blank
- [ ] Fill Blank: Confirm button validates answer
- [ ] Logic Connectors: Each sentence slot accepts connector
- [ ] Logic Connectors: All must be correct to advance
- [ ] Boss Mix: Shows progress dots for each item
- [ ] Boss Mix: Final score and review displayed
- [ ] Mistake counter updates in scene header
- [ ] Puzzle progress dots show completion state

## Next Phase

[Phase 6: Feedback & Evidence System](./phase-6-feedback-evidence.md)
