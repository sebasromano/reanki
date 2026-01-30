# Phase 3: Layout & Navigation Components

## Objective

Build the main layout wrapper, scene map (home page), and navigation components with the 1930s Cuphead visual style.

## Tasks

### 3.1 Create Film Grain Overlay Component

**`components/layout/FilmGrain.tsx`**
```tsx
import styles from './FilmGrain.module.css';

export function FilmGrain() {
  return <div className={styles.grain} aria-hidden="true" />;
}
```

**`components/layout/FilmGrain.module.css`**
```css
.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: 0.12;
  background-image: url('/assets/ui/film-grain-overlay.png');
  background-repeat: repeat;
  animation: grain 0.8s steps(10) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1%, -1%); }
  20% { transform: translate(1%, 1%); }
  30% { transform: translate(-2%, 1%); }
  40% { transform: translate(1%, -1%); }
  50% { transform: translate(-1%, 2%); }
  60% { transform: translate(2%, -2%); }
  70% { transform: translate(-2%, -1%); }
  80% { transform: translate(1%, 2%); }
  90% { transform: translate(-1%, -2%); }
}
```

### 3.2 Create Vignette Overlay

**`components/layout/Vignette.tsx`**
```tsx
import styles from './Vignette.module.css';

export function Vignette() {
  return <div className={styles.vignette} aria-hidden="true" />;
}
```

**`components/layout/Vignette.module.css`**
```css
.vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  box-shadow: inset 0 0 200px 60px rgba(0, 0, 0, 0.5);
}
```

### 3.3 Create App Shell

**`components/layout/AppShell.tsx`**
```tsx
'use client';

import { ReactNode } from 'react';
import { MissionProvider } from '@/context/MissionContext';
import { FilmGrain } from './FilmGrain';
import { Vignette } from './Vignette';
import { Header } from './Header';
import styles from './AppShell.module.css';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <MissionProvider>
      <div className={styles.shell}>
        <FilmGrain />
        <Vignette />
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </MissionProvider>
  );
}
```

**`components/layout/AppShell.module.css`**
```css
.shell {
  min-height: 100vh;
  background-color: var(--color-sepia);
  background-image: url('/assets/ui/map-background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.main {
  position: relative;
  z-index: 1;
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}
```

### 3.4 Create Header Component

**`components/layout/Header.tsx`**
```tsx
'use client';

import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import { ProgressBar } from '../map/ProgressBar';
import styles from './Header.module.css';

export function Header() {
  const { config, progress } = useMission();
  
  if (!config) return null;
  
  const completedScenes = progress 
    ? Object.values(progress.scenes).filter(s => s.status === 'completed').length 
    : 0;
  const totalScenes = config.scenes.length;
  
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/" className={styles.title}>
          <h1>{config.title}</h1>
          <span className={styles.subtitle}>{config.subtitle}</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/lexicon" className={styles.navLink}>
            📖 Léxico
          </Link>
          <Link href="/evidence" className={styles.navLink}>
            🗂️ Evidencia ({progress?.collectedEvidence.length ?? 0})
          </Link>
        </nav>
      </div>
      
      {config.ui.map.showProgress && (
        <ProgressBar current={completedScenes} total={totalScenes} />
      )}
    </header>
  );
}
```

**`components/layout/Header.module.css`**
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(
    to bottom,
    var(--color-sepia) 0%,
    var(--color-sepia) 80%,
    transparent 100%
  );
  padding: var(--spacing-md) var(--spacing-lg);
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.title {
  text-decoration: none;
  color: var(--color-ink);
}

.title h1 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 0;
  text-shadow: 2px 2px 0 var(--color-cream);
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-accent-rust);
  font-style: italic;
}

.nav {
  display: flex;
  gap: var(--spacing-lg);
}

.navLink {
  font-family: var(--font-display);
  font-size: 0.875rem;
  color: var(--color-ink);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.navLink:hover {
  border-color: var(--color-ink);
  background: var(--color-cream);
}
```

### 3.5 Create Progress Bar

**`components/map/ProgressBar.tsx`**
```tsx
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div 
          className={styles.fill} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={styles.label}>
        {current} / {total} escenas completadas
      </span>
    </div>
  );
}
```

**`components/map/ProgressBar.module.css`**
```css
.container {
  max-width: 1200px;
  margin: var(--spacing-sm) auto 0;
  padding: 0 var(--spacing-lg);
}

.track {
  height: 8px;
  background: var(--color-cream);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-ink);
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--color-accent-gold);
  border-radius: var(--radius-lg);
  transition: width 0.5s ease-out;
}

.label {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-ink);
  margin-top: var(--spacing-xs);
  font-family: var(--font-display);
}
```

### 3.6 Create Scene Node Component

**`components/map/SceneNode.tsx`**
```tsx
'use client';

import Link from 'next/link';
import { SceneStatus } from '@/types/progress';
import styles from './SceneNode.module.css';
import classNames from 'classnames';

interface SceneNodeProps {
  id: string;
  icon: string;
  label: string;
  status: SceneStatus;
  sceneNumber: number;
}

export function SceneNode({ id, icon, label, status, sceneNumber }: SceneNodeProps) {
  const isClickable = status !== 'locked';
  
  const nodeContent = (
    <div 
      className={classNames(styles.node, styles[status])}
      aria-label={`${label} - ${getStatusLabel(status)}`}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
        {status === 'completed' && (
          <span className={styles.checkmark}>✓</span>
        )}
        {status === 'locked' && (
          <span className={styles.lock}>🔒</span>
        )}
      </div>
      <span className={styles.number}>Escena {sceneNumber}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
  
  if (!isClickable) {
    return nodeContent;
  }
  
  return (
    <Link href={`/scene/${id}`} className={styles.link}>
      {nodeContent}
    </Link>
  );
}

function getStatusLabel(status: SceneStatus): string {
  switch (status) {
    case 'locked': return 'Bloqueada';
    case 'unlocked': return 'Disponible';
    case 'in_progress': return 'En progreso';
    case 'completed': return 'Completada';
  }
}
```

**`components/map/SceneNode.module.css`**
```css
.link {
  text-decoration: none;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: center;
  min-width: 120px;
}

.node:hover:not(.locked) {
  transform: translateY(-4px);
  box-shadow: 4px 6px 0 var(--color-ink);
}

.node.locked {
  background: var(--color-sepia);
  opacity: 0.6;
  cursor: not-allowed;
}

.node.unlocked {
  background: var(--color-cream);
  border-color: var(--color-accent-gold);
}

.node.in_progress {
  background: linear-gradient(135deg, var(--color-cream) 0%, var(--color-accent-gold) 100%);
  border-color: var(--color-accent-gold);
  animation: pulse 2s infinite;
}

.node.completed {
  background: var(--color-cream);
  border-color: var(--color-accent-blue);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(201, 162, 39, 0); }
}

.iconWrapper {
  position: relative;
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  filter: drop-shadow(2px 2px 0 var(--color-ink));
}

.checkmark {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--color-accent-blue);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-round);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-ink);
}

.lock {
  position: absolute;
  bottom: -5px;
  right: -5px;
  font-size: 1rem;
}

.number {
  font-family: var(--font-display);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent-rust);
}

.label {
  font-family: var(--font-display);
  font-size: 0.875rem;
  color: var(--color-ink);
  max-width: 100px;
  line-height: 1.2;
}
```

### 3.7 Create Scene Map (Home Page)

**`components/map/SceneMap.tsx`**
```tsx
'use client';

import { useMission } from '@/context/MissionContext';
import { SceneNode } from './SceneNode';
import styles from './SceneMap.module.css';

export function SceneMap() {
  const { config, isLoading, error, getSceneStatus } = useMission();
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando misión...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  
  if (!config) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.premise}>
        <p>{config.storyPremise}</p>
      </div>
      
      <div 
        className={styles.grid}
        style={{ 
          '--columns-mobile': config.ui.map.columnsMobile 
        } as React.CSSProperties}
      >
        {config.scenes.map((scene, index) => (
          <SceneNode
            key={scene.id}
            id={scene.id}
            icon={scene.node.icon}
            label={scene.node.label}
            status={getSceneStatus(scene.id)}
            sceneNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
```

**`components/map/SceneMap.module.css`**
```css
.container {
  padding: var(--spacing-lg) 0;
}

.premise {
  background: var(--color-cream);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  font-style: italic;
  line-height: 1.6;
  box-shadow: 4px 4px 0 var(--color-ink);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  justify-items: center;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(var(--columns-mobile, 2), 1fr);
    gap: var(--spacing-md);
  }
}

.loading,
.error {
  text-align: center;
  padding: var(--spacing-xl);
  font-family: var(--font-display);
  font-size: 1.25rem;
}

.error {
  color: var(--color-accent-rust);
}
```

### 3.8 Update Root Layout

**`app/layout.tsx`**
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'The Case of the Misleading Mind',
  description: 'A detective puzzle game for language learning',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

### 3.9 Create Home Page

**`app/page.tsx`**
```tsx
import { SceneMap } from '@/components/map/SceneMap';

export default function HomePage() {
  return <SceneMap />;
}
```

## Validation Checklist

- [ ] Film grain overlay animates subtly
- [ ] Vignette creates vintage border effect
- [ ] Header displays mission title and navigation
- [ ] Progress bar reflects completed scenes
- [ ] Scene nodes show correct status (locked/unlocked/completed)
- [ ] Clicking unlocked scene navigates to `/scene/[id]`
- [ ] Grid is responsive on mobile
- [ ] 1930s visual style is consistent

## Visual Outputs

After this phase, the home page should display:
- Vintage paper/desk texture background
- Film grain animation overlay
- Dark vignette edges
- Title header with navigation links
- Progress bar showing 0/12 scenes
- Grid of 12 scene nodes (first one unlocked, rest locked)

## Next Phase

[Phase 4: Scene & Story Components](./phase-4-scene-story.md)
