# Phase 2: Types & State Management

## Objective

Define TypeScript interfaces for the mission config and create the state management context for game progress.

## Tasks

### 2.1 Create Mission Types

**`types/mission.ts`**
```tsx
// ============================================
// TOP-LEVEL MISSION CONFIG
// ============================================

export interface MissionConfig {
  missionId: string;
  version: string;
  language: string;
  title: string;
  subtitle: string;
  ui: UIConfig;
  storyPremise: string;
  difficulty: DifficultyConfig;
  unlockRules: UnlockRules;
  lexicon: LexiconTerm[];
  scenes: Scene[];
  bonusTermsCoverage?: BonusTermsCoverage;
}

export interface UIConfig {
  theme: ThemeConfig;
  map: MapConfig;
}

export interface ThemeConfig {
  accent: 'steel' | 'gold' | 'rust' | string;
  background: 'dark' | 'light' | 'sepia';
  nodeStyle: 'mind-map' | 'grid' | 'path';
  iconSet: 'emoji' | 'custom';
}

export interface MapConfig {
  layout: 'grid' | 'path' | 'freeform';
  columnsMobile: number;
  showProgress: boolean;
}

export interface DifficultyConfig {
  recommendedLevel: string;
  mistakesAllowedPerScene: number;
  hintPolicy: 'oneFreeHintPerScene' | 'unlimited' | 'none';
}

export interface UnlockRules {
  sceneUnlock: 'linear' | 'branching' | 'free';
  requires: {
    solvePuzzle: boolean;
    confirmConclusion: boolean;
  };
}

// ============================================
// LEXICON
// ============================================

export interface LexiconTerm {
  term: string;
  translation: string;
  note?: string;
}

// ============================================
// SCENES
// ============================================

export interface Scene {
  id: string;
  node: SceneNode;
  story: BilingualText;
  focusTerms: string[];
  puzzles: Puzzle[];
  conclusionUnlock: ConclusionUnlock;
  rewardEvidence: Evidence[];
}

export interface SceneNode {
  icon: string;
  label: string;
}

export interface BilingualText {
  en: string;
  es: string;
}

export interface ConclusionUnlock {
  textEs: string;
}

export interface Evidence {
  title: string;
  tags: string[];
  noteEs: string;
}

// ============================================
// PUZZLES
// ============================================

export type Puzzle =
  | MCQTranslationPuzzle
  | MatchPairsPuzzle
  | FillBlankPuzzle
  | LogicConnectorsPuzzle
  | BossMixPuzzle;

export type PuzzleType =
  | 'mcq_translation'
  | 'match_pairs'
  | 'fill_blank'
  | 'logic_connectors'
  | 'boss_mix';

export interface BasePuzzle {
  type: PuzzleType;
  prompt: string;
}

export interface MCQTranslationPuzzle extends BasePuzzle {
  type: 'mcq_translation';
  term: string;
  choices: string[];
  answer: string;
}

export interface MatchPairsPuzzle extends BasePuzzle {
  type: 'match_pairs';
  pairs: MatchPair[];
}

export interface MatchPair {
  term: string;
  choices: string[];
  answer: string;
}

export interface FillBlankPuzzle extends BasePuzzle {
  type: 'fill_blank';
  options: string[];
  answer: string;
}

export interface LogicConnectorsPuzzle extends BasePuzzle {
  type: 'logic_connectors';
  items: LogicConnectorItem[];
}

export interface LogicConnectorItem {
  sentence: string;
  choices: string[];
  answer: string;
}

export interface BossMixPuzzle extends BasePuzzle {
  type: 'boss_mix';
  items: BossMixItem[];
}

export interface BossMixItem {
  term: string;
  choices: string[];
  answer: string;
}

// ============================================
// BONUS COVERAGE (OPTIONAL)
// ============================================

export interface BonusTermsCoverage {
  termsNotInFocusButInLexicon: string[];
  note?: string;
}
```

### 2.2 Create Progress Types

**`types/progress.ts`**
```tsx
export type SceneStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

export interface SceneProgress {
  sceneId: string;
  status: SceneStatus;
  puzzlesSolved: number;
  totalPuzzles: number;
  mistakes: number;
  hintsUsed: number;
  completedAt?: Date;
}

export interface MissionProgress {
  missionId: string;
  startedAt: Date;
  lastPlayedAt: Date;
  currentSceneId: string | null;
  scenes: Record<string, SceneProgress>;
  collectedEvidence: CollectedEvidence[];
  totalMistakes: number;
}

export interface CollectedEvidence {
  sceneId: string;
  evidenceTitle: string;
  collectedAt: Date;
}
```

### 2.3 Create Mission Context

**`context/MissionContext.tsx`**
```tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

  const getScene = (sceneId: string): Scene | undefined => {
    return config?.scenes.find(s => s.id === sceneId);
  };

  const getSceneStatus = (sceneId: string): SceneStatus => {
    return progress?.scenes[sceneId]?.status ?? 'locked';
  };

  const isSceneUnlocked = (sceneId: string): boolean => {
    const status = getSceneStatus(sceneId);
    return status !== 'locked';
  };

  const getTerm = (term: string): LexiconTerm | undefined => {
    return config?.lexicon.find(
      l => l.term.toLowerCase() === term.toLowerCase()
    );
  };

  // ============================================
  // PROGRESS ACTIONS
  // ============================================

  const startScene = (sceneId: string) => {
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
  };

  const completePuzzle = (sceneId: string, puzzleIndex: number) => {
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
  };

  const recordMistake = (sceneId: string) => {
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
  };

  const useHint = (sceneId: string): boolean => {
    if (!config || !progress) return false;
    
    const sceneProgress = progress.scenes[sceneId];
    const policy = config.difficulty.hintPolicy;
    
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
  };

  const completeScene = (sceneId: string) => {
    setProgress(prev => {
      if (!prev || !config) return prev;
      
      // Find next scene to unlock
      const sceneIndex = config.scenes.findIndex(s => s.id === sceneId);
      const nextScene = config.scenes[sceneIndex + 1];
      
      const updatedScenes = {
        ...prev.scenes,
        [sceneId]: {
          ...prev.scenes[sceneId],
          status: 'completed' as SceneStatus,
          completedAt: new Date(),
        },
      };
      
      // Unlock next scene if exists (linear unlock)
      if (nextScene && config.unlockRules.sceneUnlock === 'linear') {
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
  };

  const collectEvidence = (sceneId: string, evidence: Evidence) => {
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
  };

  const resetProgress = () => {
    if (!config) return;
    
    const freshProgress = createInitialProgress(config);
    setProgress(freshProgress);
    saveProgress(freshProgress);
  };

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
```

### 2.4 Create Type Exports

**`types/index.ts`**
```tsx
export * from './mission';
export * from './progress';
```

### 2.5 Move Config File

Move `stories/psycho.json` to be accessible:

```bash
mv stories/psycho.json public/stories/psycho.json
```

Or update the fetch path in the provider.

## Validation Checklist

- [ ] All types compile without errors
- [ ] MissionProvider loads config successfully
- [ ] Progress persists to localStorage
- [ ] Progress reloads on page refresh
- [ ] Scene unlock logic works (first scene unlocked by default)
- [ ] `useMission` hook works in child components

## Key Decisions Made

1. **Linear unlock**: Scenes unlock sequentially per config
2. **localStorage persistence**: Progress survives browser refresh
3. **Hint policy**: One free hint per scene (configurable)
4. **Mistake tracking**: Per-scene and total counts

## Next Phase

[Phase 3: Layout & Navigation](./phase-3-layout-navigation.md)
