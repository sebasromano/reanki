'use client';

import { useState } from 'react';
import { useMission } from '@/context/MissionContext';
import { Puzzle } from '@/types/mission';
import styles from './HintButton.module.css';

interface HintButtonProps {
  sceneId: string;
  puzzle: Puzzle;
}

export function HintButton({ sceneId, puzzle }: HintButtonProps) {
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const { useHint, progress, config } = useMission();
  
  const sceneProgress = progress?.scenes[sceneId];
  const canUseHint = config?.difficulty.hintPolicy !== 'none' && 
    (config?.difficulty.hintPolicy === 'unlimited' || 
     (sceneProgress?.hintsUsed ?? 0) < 1);
  
  const handleUseHint = () => {
    if (canUseHint && useHint(sceneId)) {
      setHintUsed(true);
      setShowHint(true);
    }
  };
  
  const getHintText = (): string => {
    if ('term' in puzzle) {
      return `Busca la traducción de "${puzzle.term}" en el léxico.`;
    }
    if ('pairs' in puzzle) {
      return `Recuerda: cada término tiene una única traducción correcta.`;
    }
    if ('items' in puzzle) {
      return `Lee cada frase con cuidado. El contexto te dará la respuesta.`;
    }
    return `Piensa en el significado de las palabras en contexto.`;
  };
  
  if (!canUseHint && !hintUsed) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      {!showHint ? (
        <button 
          className={styles.hintButton}
          onClick={handleUseHint}
          disabled={!canUseHint}
        >
          💡 Usar pista {!canUseHint && '(agotada)'}
        </button>
      ) : (
        <div className={styles.hintPanel}>
          <span className={styles.hintIcon}>💡</span>
          <p className={styles.hintText}>{getHintText()}</p>
          <button 
            className={styles.closeHint}
            onClick={() => setShowHint(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
