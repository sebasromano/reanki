'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMission } from '@/context/MissionContext';
import { StoryPanel } from './StoryPanel';
import { PuzzleContainer } from '../puzzles/PuzzleContainer';
import { ConclusionPanel } from './ConclusionPanel';
import { SceneHeader } from './SceneHeader';
import { HintButton } from './HintButton';
import styles from './SceneView.module.css';

interface SceneViewProps {
  sceneId: string;
}

type ScenePhase = 'story' | 'puzzles' | 'conclusion';

export function SceneView({ sceneId }: SceneViewProps) {
  const router = useRouter();
  const { 
    config,
    getScene, 
    isSceneUnlocked,
    startScene,
    progress 
  } = useMission();
  
  const [phase, setPhase] = useState<ScenePhase>('story');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const scene = getScene(sceneId);
  const sceneProgress = progress?.scenes[sceneId];
  
  // Redirect if scene doesn't exist or is locked
  useEffect(() => {
    if (!config) return; // Wait for config to load
    
    if (!scene) {
      router.push('/');
      return;
    }
    
    if (!isSceneUnlocked(sceneId)) {
      router.push('/');
      return;
    }
    
    // Mark scene as in progress (only once)
    if (!hasStarted) {
      startScene(sceneId);
      setHasStarted(true);
    }
  }, [scene, sceneId, isSceneUnlocked, startScene, router, config, hasStarted]);
  
  // Restore progress if returning to scene
  useEffect(() => {
    if (sceneProgress && scene && hasStarted) {
      if (sceneProgress.status === 'completed') {
        setPhase('conclusion');
      } else if (sceneProgress.puzzlesSolved > 0) {
        // Check if we've completed all puzzles
        if (sceneProgress.puzzlesSolved >= scene.puzzles.length) {
          setPhase('conclusion');
        } else {
          setPhase('puzzles');
          setCurrentPuzzleIndex(sceneProgress.puzzlesSolved);
        }
      }
    }
  }, [sceneProgress, scene, hasStarted]);
  
  if (!scene || !config) {
    return <div className={styles.loading}>Cargando escena...</div>;
  }
  
  const sceneIndex = config.scenes.findIndex(s => s.id === sceneId);
  const backgroundImage = `/assets/backgrounds/s${sceneIndex + 1}-${getBackgroundSlug(scene.id)}.png`;
  
  const handleStoryComplete = () => {
    setPhase('puzzles');
  };
  
  const handlePuzzleComplete = (puzzleIndex: number) => {
    const nextIndex = puzzleIndex + 1;
    
    if (nextIndex >= scene.puzzles.length) {
      setPhase('conclusion');
    } else {
      setCurrentPuzzleIndex(nextIndex);
    }
  };
  
  const handleSceneComplete = () => {
    router.push('/');
  };
  
  return (
    <div 
      className={styles.container}
      style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties}
    >
      <div className={styles.backdrop} />
      
      <SceneHeader 
        sceneNumber={sceneIndex + 1}
        label={scene.node.label}
        icon={scene.node.icon}
        mistakes={sceneProgress?.mistakes ?? 0}
        maxMistakes={config.difficulty.mistakesAllowedPerScene}
      />
      
      <div className={styles.content}>
        {phase === 'story' && (
          <StoryPanel
            story={scene.story}
            focusTerms={scene.focusTerms}
            onContinue={handleStoryComplete}
          />
        )}
        
        {phase === 'puzzles' && (
          <PuzzleContainer
            puzzles={scene.puzzles}
            currentIndex={currentPuzzleIndex}
            sceneId={sceneId}
            onPuzzleComplete={handlePuzzleComplete}
          />
        )}
        
        {phase === 'conclusion' && (
          <ConclusionPanel
            conclusion={scene.conclusionUnlock}
            evidence={scene.rewardEvidence}
            sceneId={sceneId}
            onComplete={handleSceneComplete}
          />
        )}
      </div>
      
      {phase === 'puzzles' && (
        <HintButton 
          sceneId={sceneId} 
          puzzle={scene.puzzles[currentPuzzleIndex]} 
        />
      )}
    </div>
  );
}

function getBackgroundSlug(sceneId: string): string {
  const slugMap: Record<string, string> = {
    'S1_first_impression': 'gala',
    'S2_rules_fast': 'butler-pantry',
    'S3_effort_will': 'detective-office',
    'S4_obey_withdraw': 'interrogation',
    'S5_priming_money': 'catering',
    'S6_body_cues': 'gallery',
    'S7_memory_fail': 'courtroom',
    'S8_framing_likelihood': 'split-scene',
    'S9_hindsight_rewrite': 'evidence-board',
    'S10_social_charm': 'lecture-hall',
    'S11_legal_thread': 'bank-vault',
    'S12_final_foe': 'brain-finale',
  };
  
  return slugMap[sceneId] ?? 'default';
}
