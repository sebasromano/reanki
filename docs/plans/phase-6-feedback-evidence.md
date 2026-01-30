# Phase 6: Feedback & Evidence System

## Objective

Build the conclusion panel, evidence collection system, and evidence gallery page.

## Tasks

### 6.1 Create Conclusion Panel

**`components/scene/ConclusionPanel.tsx`**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { ConclusionUnlock, Evidence } from '@/types/mission';
import { useMission } from '@/context/MissionContext';
import { EvidenceCard } from '../feedback/EvidenceCard';
import styles from './ConclusionPanel.module.css';

interface ConclusionPanelProps {
  conclusion: ConclusionUnlock;
  evidence: Evidence[];
  sceneId: string;
  onComplete: () => void;
}

export function ConclusionPanel({ 
  conclusion, 
  evidence, 
  sceneId,
  onComplete 
}: ConclusionPanelProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceCollected, setEvidenceCollected] = useState(false);
  const { completeScene, collectEvidence } = useMission();
  
  useEffect(() => {
    // Animate in the evidence after a delay
    const timer = setTimeout(() => {
      setShowEvidence(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCollectEvidence = () => {
    evidence.forEach(e => collectEvidence(sceneId, e));
    setEvidenceCollected(true);
  };
  
  const handleComplete = () => {
    completeScene(sceneId);
    onComplete();
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.conclusionBox}>
        <div className={styles.stamp}>CASO RESUELTO</div>
        
        <div className={styles.conclusionContent}>
          <h2 className={styles.title}>Conclusión</h2>
          <p className={styles.text}>{conclusion.textEs}</p>
        </div>
      </div>
      
      {showEvidence && (
        <div className={styles.evidenceSection}>
          <h3 className={styles.evidenceTitle}>Nueva Evidencia Descubierta</h3>
          
          <div className={styles.evidenceGrid}>
            {evidence.map((item, index) => (
              <EvidenceCard 
                key={index}
                evidence={item}
                isNew={!evidenceCollected}
              />
            ))}
          </div>
          
          {!evidenceCollected ? (
            <button 
              className={styles.collectButton}
              onClick={handleCollectEvidence}
            >
              📥 Recoger Evidencia
            </button>
          ) : (
            <button 
              className={styles.continueButton}
              onClick={handleComplete}
            >
              Volver al Mapa →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

**`components/scene/ConclusionPanel.module.css`**
```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.conclusionBox {
  position: relative;
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  box-shadow: 4px 4px 0 var(--color-ink);
  animation: fadeSlideIn 0.6s ease-out;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stamp {
  position: absolute;
  top: -15px;
  right: 20px;
  background: #27ae60;
  color: white;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: var(--spacing-xs) var(--spacing-md);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  transform: rotate(3deg);
  box-shadow: 2px 2px 0 var(--color-ink);
}

.conclusionContent {
  text-align: center;
}

.title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--color-ink);
  margin: 0 0 var(--spacing-md) 0;
}

.text {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-ink);
  font-style: italic;
}

.evidenceSection {
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: 4px 4px 0 var(--color-ink);
  animation: fadeSlideIn 0.6s ease-out 0.3s both;
}

.evidenceTitle {
  font-family: var(--font-display);
  font-size: 1rem;
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-accent-rust);
}

.evidenceGrid {
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.collectButton,
.continueButton {
  display: block;
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  font-family: var(--font-display);
  font-size: 1rem;
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 var(--color-ink);
}

.collectButton {
  background: var(--color-accent-blue);
  color: white;
}

.collectButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-ink);
}

.continueButton {
  background: var(--color-accent-gold);
  color: var(--color-ink);
}

.continueButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-ink);
}
```

### 6.2 Create Evidence Card Component

**`components/feedback/EvidenceCard.tsx`**
```tsx
import { Evidence } from '@/types/mission';
import styles from './EvidenceCard.module.css';
import classNames from 'classnames';

interface EvidenceCardProps {
  evidence: Evidence;
  isNew?: boolean;
  showImage?: boolean;
}

export function EvidenceCard({ evidence, isNew = false, showImage = true }: EvidenceCardProps) {
  // Generate image path from title (simplified)
  const imageSlug = evidence.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return (
    <article className={classNames(styles.card, { [styles.isNew]: isNew })}>
      {isNew && <span className={styles.newBadge}>NUEVO</span>}
      
      {showImage && (
        <div className={styles.imageWrapper}>
          <img 
            src={`/assets/evidence/${imageSlug}.png`}
            alt=""
            className={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/evidence/default.png';
            }}
          />
        </div>
      )}
      
      <div className={styles.content}>
        <h4 className={styles.title}>{evidence.title}</h4>
        <p className={styles.note}>{evidence.noteEs}</p>
        
        <div className={styles.tags}>
          {evidence.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
```

**`components/feedback/EvidenceCard.module.css`**
```css
.card {
  position: relative;
  display: flex;
  gap: var(--spacing-md);
  background: white;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 2px 4px 0 var(--color-ink);
}

.isNew {
  animation: glow 2s infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px var(--color-accent-gold); }
  50% { box-shadow: 0 0 20px var(--color-accent-gold); }
}

.newBadge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-accent-rust);
  color: white;
  font-family: var(--font-display);
  font-size: 0.625rem;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-ink);
}

.imageWrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-sepia);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-family: var(--font-display);
  font-size: 0.875rem;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-ink);
}

.note {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--color-ink);
  opacity: 0.8;
  margin: 0 0 var(--spacing-sm) 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  font-family: var(--font-display);
  font-size: 0.625rem;
  background: var(--color-sepia);
  padding: 2px 6px;
  border-radius: 2px;
  color: var(--color-ink);
}

@media (max-width: 500px) {
  .card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .tags {
    justify-content: center;
  }
}
```

### 6.3 Create Evidence Collection Page

**`app/evidence/page.tsx`**
```tsx
import { EvidenceCollection } from '@/components/feedback/EvidenceCollection';

export default function EvidencePage() {
  return <EvidenceCollection />;
}
```

**`components/feedback/EvidenceCollection.tsx`**
```tsx
'use client';

import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import { EvidenceCard } from './EvidenceCard';
import styles from './EvidenceCollection.module.css';

export function EvidenceCollection() {
  const { config, progress, getScene, isLoading } = useMission();
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando evidencia...</div>;
  }
  
  if (!config || !progress) {
    return <div className={styles.error}>No hay datos disponibles</div>;
  }
  
  const collectedEvidence = progress.collectedEvidence;
  const totalPossible = config.scenes.reduce(
    (sum, scene) => sum + scene.rewardEvidence.length, 
    0
  );
  
  // Group evidence by scene
  const evidenceByScene = config.scenes.map(scene => {
    const sceneEvidence = scene.rewardEvidence.map(evidence => ({
      ...evidence,
      isCollected: collectedEvidence.some(
        ce => ce.sceneId === scene.id && ce.evidenceTitle === evidence.title
      )
    }));
    
    return {
      sceneId: scene.id,
      sceneLabel: scene.node.label,
      sceneIcon: scene.node.icon,
      evidence: sceneEvidence
    };
  });
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Volver al mapa</Link>
        <h1 className={styles.title}>🗂️ Colección de Evidencia</h1>
        <p className={styles.subtitle}>
          {collectedEvidence.length} / {totalPossible} piezas recolectadas
        </p>
      </header>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${(collectedEvidence.length / totalPossible) * 100}%` }}
        />
      </div>
      
      <div className={styles.scenesList}>
        {evidenceByScene.map(sceneGroup => (
          <section key={sceneGroup.sceneId} className={styles.sceneSection}>
            <h2 className={styles.sceneTitle}>
              <span className={styles.sceneIcon}>{sceneGroup.sceneIcon}</span>
              {sceneGroup.sceneLabel}
            </h2>
            
            <div className={styles.evidenceGrid}>
              {sceneGroup.evidence.map((evidence, index) => (
                evidence.isCollected ? (
                  <EvidenceCard 
                    key={index}
                    evidence={evidence}
                  />
                ) : (
                  <div key={index} className={styles.lockedCard}>
                    <span className={styles.lockIcon}>🔒</span>
                    <span className={styles.lockedText}>Sin descubrir</span>
                  </div>
                )
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

**`components/feedback/EvidenceCollection.module.css`**
```css
.container {
  padding: var(--spacing-lg) 0;
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.backLink {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.875rem;
  color: var(--color-ink);
  text-decoration: none;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.backLink:hover {
  background: var(--color-ink);
  color: var(--color-cream);
}

.title {
  font-family: var(--font-display);
  font-size: 1.75rem;
  margin: 0;
  color: var(--color-ink);
}

.subtitle {
  font-size: 1rem;
  color: var(--color-accent-rust);
  margin-top: var(--spacing-xs);
}

.progressBar {
  max-width: 400px;
  height: 12px;
  margin: 0 auto var(--spacing-xl);
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: var(--color-accent-gold);
  transition: width 0.5s ease-out;
}

.scenesList {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.sceneSection {
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: 4px 4px 0 var(--color-ink);
}

.sceneTitle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-display);
  font-size: 1rem;
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px dashed var(--color-ink);
}

.sceneIcon {
  font-size: 1.5rem;
}

.evidenceGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.lockedCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background: var(--color-sepia);
  border: 2px dashed var(--color-ink);
  border-radius: var(--radius-md);
  opacity: 0.5;
}

.lockIcon {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

.lockedText {
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--color-ink);
}

.loading,
.error {
  text-align: center;
  padding: var(--spacing-xl);
  font-family: var(--font-display);
}
```

### 6.4 Create Success Animation Component

**`components/feedback/SuccessAnimation.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './SuccessAnimation.module.css';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export function SuccessAnimation({ show, onComplete }: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <span className={styles.checkmark}>✓</span>
        <span className={styles.text}>¡Correcto!</span>
      </div>
    </div>
  );
}
```

**`components/feedback/SuccessAnimation.module.css`**
```css
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(39, 174, 96, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  background: white;
  padding: var(--spacing-xl) var(--spacing-xxl);
  border: 4px solid var(--color-ink);
  border-radius: var(--radius-lg);
  box-shadow: 8px 8px 0 var(--color-ink);
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.checkmark {
  font-size: 4rem;
  color: #27ae60;
  animation: bounce 0.5s ease 0.2s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-ink);
}
```

### 6.5 Create Error Shake Animation

**`components/feedback/ErrorShake.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './ErrorShake.module.css';

interface ErrorShakeProps {
  trigger: number; // Increment to trigger animation
  children: React.ReactNode;
}

export function ErrorShake({ trigger, children }: ErrorShakeProps) {
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (trigger > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  return (
    <div className={shake ? styles.shake : ''}>
      {children}
    </div>
  );
}
```

**`components/feedback/ErrorShake.module.css`**
```css
.shake {
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

## Validation Checklist

- [ ] Conclusion panel displays after all puzzles complete
- [ ] "CASO RESUELTO" stamp shows on conclusion
- [ ] Evidence cards animate in after delay
- [ ] "Collect Evidence" button saves to progress
- [ ] Evidence page shows all scenes with evidence
- [ ] Collected evidence displays with details
- [ ] Uncollected evidence shows as locked
- [ ] Progress bar shows collection percentage
- [ ] Success animation triggers on correct answers
- [ ] Error shake triggers on incorrect answers

## Next Phase

[Phase 7: Visual Polish & Assets](./phase-7-visual-polish.md)
