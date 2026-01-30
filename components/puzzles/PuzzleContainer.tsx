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
          <MCQTranslation key={`${sceneId}-${currentIndex}`} puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'match_pairs' && (
          <MatchPairs key={`${sceneId}-${currentIndex}`} puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'fill_blank' && (
          <FillBlank key={`${sceneId}-${currentIndex}`} puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'logic_connectors' && (
          <LogicConnectors key={`${sceneId}-${currentIndex}`} puzzle={puzzle} {...commonProps} />
        )}
        
        {puzzle.type === 'boss_mix' && (
          <BossMix key={`${sceneId}-${currentIndex}`} puzzle={puzzle} {...commonProps} />
        )}
      </div>
    </div>
  );
}
