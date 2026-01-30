# Phase 4: Scene & Story Components

## Objective

Build the scene view page that displays the story narrative with interactive term highlighting, scene backgrounds, and character portraits.

## Tasks

### 4.1 Create Scene Page Route

**`app/scene/[id]/page.tsx`**
```tsx
import { SceneView } from '@/components/scene/SceneView';

interface ScenePageProps {
  params: {
    id: string;
  };
}

export default function ScenePage({ params }: ScenePageProps) {
  return <SceneView sceneId={params.id} />;
}
```

### 4.2 Create Scene View Container

**`components/scene/SceneView.tsx`**
```tsx
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
    getSceneStatus, 
    isSceneUnlocked,
    startScene,
    progress 
  } = useMission();
  
  const [phase, setPhase] = useState<ScenePhase>('story');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  
  const scene = getScene(sceneId);
  const sceneProgress = progress?.scenes[sceneId];
  
  // Redirect if scene doesn't exist or is locked
  useEffect(() => {
    if (!scene) {
      router.push('/');
      return;
    }
    
    if (!isSceneUnlocked(sceneId)) {
      router.push('/');
      return;
    }
    
    // Mark scene as in progress
    startScene(sceneId);
  }, [scene, sceneId, isSceneUnlocked, startScene, router]);
  
  // Restore progress if returning to scene
  useEffect(() => {
    if (sceneProgress) {
      if (sceneProgress.status === 'completed') {
        setPhase('conclusion');
      } else if (sceneProgress.puzzlesSolved > 0) {
        setPhase('puzzles');
        setCurrentPuzzleIndex(sceneProgress.puzzlesSolved);
      }
    }
  }, [sceneProgress]);
  
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
  // Convert S1_first_impression to "gala" based on known mappings
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
```

**`components/scene/SceneView.module.css`**
```css
.container {
  min-height: 100vh;
  position: relative;
  padding: var(--spacing-lg);
}

.container::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  z-index: -2;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(212, 197, 169, 0.85) 0%,
    rgba(212, 197, 169, 0.7) 50%,
    rgba(212, 197, 169, 0.85) 100%
  );
  z-index: -1;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: var(--spacing-xl);
  font-family: var(--font-display);
}
```

### 4.3 Create Scene Header

**`components/scene/SceneHeader.tsx`**
```tsx
import Link from 'next/link';
import styles from './SceneHeader.module.css';

interface SceneHeaderProps {
  sceneNumber: number;
  label: string;
  icon: string;
  mistakes: number;
  maxMistakes: number;
}

export function SceneHeader({ 
  sceneNumber, 
  label, 
  icon, 
  mistakes, 
  maxMistakes 
}: SceneHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.backLink}>
        ← Volver al mapa
      </Link>
      
      <div className={styles.titleGroup}>
        <span className={styles.icon}>{icon}</span>
        <div>
          <span className={styles.sceneNumber}>Escena {sceneNumber}</span>
          <h1 className={styles.label}>{label}</h1>
        </div>
      </div>
      
      <div className={styles.mistakeTracker}>
        <span className={styles.mistakeLabel}>Errores:</span>
        <div className={styles.hearts}>
          {Array.from({ length: maxMistakes }).map((_, i) => (
            <span 
              key={i} 
              className={i < (maxMistakes - mistakes) ? styles.heartFull : styles.heartEmpty}
            >
              ♥
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
```

**`components/scene/SceneHeader.module.css`**
```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  box-shadow: 4px 4px 0 var(--color-ink);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.backLink {
  font-family: var(--font-display);
  font-size: 0.875rem;
  color: var(--color-ink);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.backLink:hover {
  background: var(--color-ink);
  color: var(--color-cream);
}

.titleGroup {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.icon {
  font-size: 2rem;
  filter: drop-shadow(2px 2px 0 var(--color-ink));
}

.sceneNumber {
  font-family: var(--font-display);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-accent-rust);
}

.label {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-ink);
  margin: 0;
}

.mistakeTracker {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mistakeLabel {
  font-family: var(--font-display);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.hearts {
  display: flex;
  gap: 4px;
}

.heartFull {
  color: #c0392b;
  font-size: 1.25rem;
}

.heartEmpty {
  color: var(--color-sepia);
  font-size: 1.25rem;
}
```

### 4.4 Create Story Panel with Term Highlighting

**`components/scene/StoryPanel.tsx`**
```tsx
'use client';

import { useState } from 'react';
import { BilingualText } from '@/types/mission';
import { TermHighlight } from './TermHighlight';
import styles from './StoryPanel.module.css';

interface StoryPanelProps {
  story: BilingualText;
  focusTerms: string[];
  onContinue: () => void;
}

export function StoryPanel({ story, focusTerms, onContinue }: StoryPanelProps) {
  const [showSpanish, setShowSpanish] = useState(false);
  
  const highlightedEnglish = highlightTerms(story.en, focusTerms);
  
  return (
    <div className={styles.panel}>
      <div className={styles.storyContent}>
        <div className={styles.languageTab}>
          <button 
            className={!showSpanish ? styles.activeTab : styles.tab}
            onClick={() => setShowSpanish(false)}
          >
            English
          </button>
          <button 
            className={showSpanish ? styles.activeTab : styles.tab}
            onClick={() => setShowSpanish(true)}
          >
            Español
          </button>
        </div>
        
        <div className={styles.textContainer}>
          {!showSpanish ? (
            <p className={styles.storyText}>
              {highlightedEnglish}
            </p>
          ) : (
            <p className={styles.storyText}>
              {story.es}
            </p>
          )}
        </div>
        
        <div className={styles.termsPreview}>
          <span className={styles.termsLabel}>Términos clave:</span>
          <div className={styles.termsList}>
            {focusTerms.slice(0, 5).map(term => (
              <TermHighlight key={term} term={term} inline />
            ))}
            {focusTerms.length > 5 && (
              <span className={styles.moreTerms}>+{focusTerms.length - 5} más</span>
            )}
          </div>
        </div>
      </div>
      
      <button className={styles.continueButton} onClick={onContinue}>
        Comenzar Puzzles →
      </button>
    </div>
  );
}

function highlightTerms(text: string, terms: string[]): React.ReactNode[] {
  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  
  // Create regex pattern
  const pattern = new RegExp(
    `(${sortedTerms.map(t => escapeRegex(t)).join('|')})`,
    'gi'
  );
  
  const parts = text.split(pattern);
  
  return parts.map((part, index) => {
    const matchingTerm = terms.find(
      t => t.toLowerCase() === part.toLowerCase()
    );
    
    if (matchingTerm) {
      return <TermHighlight key={index} term={part} />;
    }
    
    return part;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

**`components/scene/StoryPanel.module.css`**
```css
.panel {
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: 4px 4px 0 var(--color-ink);
}

.storyContent {
  margin-bottom: var(--spacing-lg);
}

.languageTab {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.tab,
.activeTab {
  font-family: var(--font-display);
  font-size: 0.75rem;
  padding: var(--spacing-xs) var(--spacing-md);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-cream);
}

.activeTab {
  background: var(--color-ink);
  color: var(--color-cream);
}

.tab:hover {
  background: var(--color-sepia);
}

.textContainer {
  background: white;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  padding: var(--spacing-lg);
  min-height: 150px;
}

.storyText {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-ink);
}

.termsPreview {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 2px dashed var(--color-ink);
}

.termsLabel {
  font-family: var(--font-display);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-accent-rust);
  display: block;
  margin-bottom: var(--spacing-sm);
}

.termsList {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.moreTerms {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--color-ink);
  opacity: 0.7;
  align-self: center;
}

.continueButton {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-display);
  font-size: 1rem;
  background: var(--color-accent-gold);
  color: var(--color-ink);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 var(--color-ink);
}

.continueButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-ink);
}

.continueButton:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 var(--color-ink);
}
```

### 4.5 Create Term Highlight Component

**`components/scene/TermHighlight.tsx`**
```tsx
'use client';

import { useState } from 'react';
import { useMission } from '@/context/MissionContext';
import styles from './TermHighlight.module.css';
import classNames from 'classnames';

interface TermHighlightProps {
  term: string;
  inline?: boolean;
}

export function TermHighlight({ term, inline = false }: TermHighlightProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { getTerm } = useMission();
  
  const lexiconEntry = getTerm(term);
  
  return (
    <span 
      className={classNames(styles.term, { [styles.inline]: inline })}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      {term}
      
      {showTooltip && lexiconEntry && (
        <span className={styles.tooltip}>
          <span className={styles.translation}>{lexiconEntry.translation}</span>
          {lexiconEntry.note && (
            <span className={styles.note}>{lexiconEntry.note}</span>
          )}
        </span>
      )}
    </span>
  );
}
```

**`components/scene/TermHighlight.module.css`**
```css
.term {
  position: relative;
  background: linear-gradient(
    to bottom,
    transparent 60%,
    var(--color-accent-gold) 60%
  );
  padding: 0 2px;
  cursor: help;
  font-weight: 600;
  border-radius: 2px;
}

.term:hover {
  background: var(--color-accent-gold);
}

.inline {
  display: inline-block;
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.75rem;
  font-family: var(--font-display);
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-ink);
  color: var(--color-cream);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 400;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: var(--color-ink);
}

.translation {
  display: block;
  font-weight: 600;
}

.note {
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 4px;
  font-style: italic;
}
```

### 4.6 Create Hint Button

**`components/scene/HintButton.tsx`**
```tsx
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
```

**`components/scene/HintButton.module.css`**
```css
.container {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 50;
}

.hintButton {
  font-family: var(--font-display);
  font-size: 0.875rem;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-cream);
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0 var(--color-ink);
}

.hintButton:hover:not(:disabled) {
  background: var(--color-accent-gold);
}

.hintButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hintPanel {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  max-width: 300px;
  box-shadow: 4px 4px 0 var(--color-ink);
}

.hintIcon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.hintText {
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
}

.closeHint {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.6;
  flex-shrink: 0;
}

.closeHint:hover {
  opacity: 1;
}
```

## Validation Checklist

- [ ] Scene page loads with correct scene data
- [ ] Locked scenes redirect to home
- [ ] Scene background image displays (with fallback)
- [ ] Story text displays with term highlighting
- [ ] Term tooltips show translation and notes
- [ ] Language toggle switches between EN/ES
- [ ] "Continue to Puzzles" button advances phase
- [ ] Mistake counter shows hearts
- [ ] Hint button works (one per scene)
- [ ] Back to map link works

## Visual Outputs

After this phase, scene pages should display:
- Scene-specific background image (faded)
- Header with scene info and mistake hearts
- Story panel with highlighted vocabulary terms
- Hoverable terms showing translations
- Language toggle (EN/ES)
- Key terms preview chips
- Hint button (floating, bottom-right)

## Next Phase

[Phase 5: Puzzle Components](./phase-5-puzzles.md)
