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
