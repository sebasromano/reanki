'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { MissionConfig, Scene, LexiconTerm, Evidence } from '@/types/mission';
import { MissionProgress, SceneProgress, SceneStatus } from '@/types/progress';

// ============================================
// CONTEXT TYPES
// ============================================

interface MissionContextValue {
  // Config
  config: MissionConfig | null;
  isLoading: boolean;
  error: string | null;
  
  // Progress
  progress: MissionProgress | null;
  
  // Scene helpers
  getScene: (sceneId: string) => Scene | undefined;
  getSceneStatus: (sceneId: string) => SceneStatus;
  isSceneUnlocked: (sceneId: string) => boolean;
  
  // Lexicon helpers
  getTerm: (term: string) => LexiconTerm | undefined;
  
  // Progress actions
  startScene: (sceneId: string) => void;
  completePuzzle: (sceneId: string, puzzleIndex: number) => void;
  recordMistake: (sceneId: string) => void;
  useHint: (sceneId: string) => boolean;
  completeScene: (sceneId: string) => void;
  collectEvidence: (sceneId: string, evidence: Evidence) => void;
  
  // Reset
  resetProgress: () => void;
}

const MissionContext = createContext<MissionContextValue | null>(null);

// ============================================
// STORAGE HELPERS
// ============================================

const STORAGE_KEY_PREFIX = 'puzzle_game_progress_';

function loadProgress(missionId: string): MissionProgress | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + missionId);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveProgress(progress: MissionProgress): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(
    STORAGE_KEY_PREFIX + progress.missionId,
    JSON.stringify(progress)
  );
}

function createInitialProgress(config: MissionConfig): MissionProgress {
  const scenes: Record<string, SceneProgress> = {};
  
  config.scenes.forEach((scene, index) => {
    scenes[scene.id] = {
      sceneId: scene.id,
      status: index === 0 ? 'unlocked' : 'locked',
      puzzlesSolved: 0,
      totalPuzzles: scene.puzzles.length,
      mistakes: 0,
      hintsUsed: 0,
    };
  });
  
  return {
    missionId: config.missionId,
    startedAt: new Date(),
    lastPlayedAt: new Date(),
    currentSceneId: null,
    scenes,
    collectedEvidence: [],
    totalMistakes: 0,
  };
}

// ============================================
// PROVIDER COMPONENT
// ============================================

interface MissionProviderProps {
  children: ReactNode;
  configPath?: string;
}

export function MissionProvider({ 
  children, 
  configPath = '/stories/psycho.json' 
}: MissionProviderProps) {
  const [config, setConfig] = useState<MissionConfig | null>(null);
  const [progress, setProgress] = useState<MissionProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref for config to avoid stale closures in callbacks
  const configRef = useRef<MissionConfig | null>(null);
  configRef.current = config;

  // Load config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(configPath);
        if (!response.ok) throw new Error('Failed to load mission config');
        
        const data: MissionConfig = await response.json();
        setConfig(data);
        
        // Load or create progress
        const existingProgress = loadProgress(data.missionId);
        if (existingProgress) {
          setProgress(existingProgress);
        } else {
          const initialProgress = createInitialProgress(data);
          setProgress(initialProgress);
          saveProgress(initialProgress);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadConfig();
  }, [configPath]);

  // Save progress whenever it changes
  useEffect(() => {
    if (progress) {
      saveProgress(progress);
    }
  }, [progress]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getScene = useCallback((sceneId: string): Scene | undefined => {
    return configRef.current?.scenes.find(s => s.id === sceneId);
  }, []);

  const getSceneStatus = useCallback((sceneId: string): SceneStatus => {
    return progress?.scenes[sceneId]?.status ?? 'locked';
  }, [progress]);

  const isSceneUnlocked = useCallback((sceneId: string): boolean => {
    const status = progress?.scenes[sceneId]?.status ?? 'locked';
    return status !== 'locked';
  }, [progress]);

  const getTerm = useCallback((term: string): LexiconTerm | undefined => {
    return configRef.current?.lexicon.find(
      l => l.term.toLowerCase() === term.toLowerCase()
    );
  }, []);

  // ============================================
  // PROGRESS ACTIONS
  // ============================================

  const startScene = useCallback((sceneId: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        currentSceneId: sceneId,
        lastPlayedAt: new Date(),
        scenes: {
          ...prev.scenes,
          [sceneId]: {
            ...prev.scenes[sceneId],
            status: 'in_progress',
          },
        },
      };
    });
  }, []);

  const completePuzzle = useCallback((sceneId: string, puzzleIndex: number) => {
    setProgress(prev => {
      if (!prev) return prev;
      
      const sceneProgress = prev.scenes[sceneId];
      const newSolved = Math.max(sceneProgress.puzzlesSolved, puzzleIndex + 1);
      
      return {
        ...prev,
        lastPlayedAt: new Date(),
        scenes: {
          ...prev.scenes,
          [sceneId]: {
            ...sceneProgress,
            puzzlesSolved: newSolved,
          },
        },
      };
    });
  }, []);

  const recordMistake = useCallback((sceneId: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        totalMistakes: prev.totalMistakes + 1,
        scenes: {
          ...prev.scenes,
          [sceneId]: {
            ...prev.scenes[sceneId],
            mistakes: prev.scenes[sceneId].mistakes + 1,
          },
        },
      };
    });
  }, []);

  const useHint = useCallback((sceneId: string): boolean => {
    const currentConfig = configRef.current;
    if (!currentConfig || !progress) return false;
    
    const sceneProgress = progress.scenes[sceneId];
    const policy = currentConfig.difficulty.hintPolicy;
    
    if (policy === 'none') return false;
    if (policy === 'oneFreeHintPerScene' && sceneProgress.hintsUsed >= 1) {
      return false;
    }
    
    setProgress(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        scenes: {
          ...prev.scenes,
          [sceneId]: {
            ...prev.scenes[sceneId],
            hintsUsed: prev.scenes[sceneId].hintsUsed + 1,
          },
        },
      };
    });
    
    return true;
  }, [progress]);

  const completeScene = useCallback((sceneId: string) => {
    setProgress(prev => {
      const currentConfig = configRef.current;
      if (!prev || !currentConfig) return prev;
      
      // Find next scene to unlock
      const sceneIndex = currentConfig.scenes.findIndex(s => s.id === sceneId);
      const nextScene = currentConfig.scenes[sceneIndex + 1];
      
      const updatedScenes = {
        ...prev.scenes,
        [sceneId]: {
          ...prev.scenes[sceneId],
          status: 'completed' as SceneStatus,
          completedAt: new Date(),
        },
      };
      
      // Unlock next scene if exists (linear unlock)
      if (nextScene && currentConfig.unlockRules.sceneUnlock === 'linear') {
        updatedScenes[nextScene.id] = {
          ...prev.scenes[nextScene.id],
          status: 'unlocked',
        };
      }
      
      return {
        ...prev,
        lastPlayedAt: new Date(),
        currentSceneId: null,
        scenes: updatedScenes,
      };
    });
  }, []);

  const collectEvidence = useCallback((sceneId: string, evidence: Evidence) => {
    setProgress(prev => {
      if (!prev) return prev;
      
      // Check if already collected
      const alreadyCollected = prev.collectedEvidence.some(
        e => e.sceneId === sceneId && e.evidenceTitle === evidence.title
      );
      
      if (alreadyCollected) return prev;
      
      return {
        ...prev,
        collectedEvidence: [
          ...prev.collectedEvidence,
          {
            sceneId,
            evidenceTitle: evidence.title,
            collectedAt: new Date(),
          },
        ],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    const currentConfig = configRef.current;
    if (!currentConfig) return;
    
    const freshProgress = createInitialProgress(currentConfig);
    setProgress(freshProgress);
    saveProgress(freshProgress);
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: MissionContextValue = {
    config,
    isLoading,
    error,
    progress,
    getScene,
    getSceneStatus,
    isSceneUnlocked,
    getTerm,
    startScene,
    completePuzzle,
    recordMistake,
    useHint,
    completeScene,
    collectEvidence,
    resetProgress,
  };

  return (
    <MissionContext.Provider value={value}>
      {children}
    </MissionContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useMission() {
  const context = useContext(MissionContext);
  
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  
  return context;
}
