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
