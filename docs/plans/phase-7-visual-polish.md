# Phase 7: Visual Polish & Assets

## Objective

Integrate DALL-E generated assets, add visual effects, and polish the 1930s Cuphead aesthetic throughout the application.

## Tasks

### 7.1 Asset Integration Checklist

Verify and organize all DALL-E generated assets:

```
public/assets/
├── backgrounds/
│   ├── s1-gala.png              ✓ Generated
│   ├── s2-butler-pantry.png     □ Pending
│   ├── s3-detective-office.png  □ Pending
│   ├── s4-interrogation.png     □ Pending
│   ├── s5-catering.png          □ Pending
│   ├── s6-gallery.png           □ Pending
│   ├── s7-courtroom.png         □ Pending
│   ├── s8-split-scene.png       □ Pending
│   ├── s9-evidence-board.png    □ Pending
│   ├── s10-lecture-hall.png     □ Pending
│   ├── s11-bank-vault.png       □ Pending
│   └── s12-brain-finale.png     □ Pending
├── characters/
│   ├── detective.png            ✓ Generated
│   ├── butler.png               □ Pending
│   ├── witness-meek.png         □ Pending
│   ├── guest-elderly.png        □ Pending
│   ├── expert-charming.png      □ Pending
│   └── suspect-parole.png       □ Pending
├── evidence/
│   ├── pista-1-signal.png       ✓ Generated
│   ├── pista-2-rule.png         □ Pending
│   ├── pista-3-will.png         □ Pending
│   ├── pista-4-withdrawal.png   □ Pending
│   ├── pista-5-money.png        □ Pending
│   ├── pista-6-arousal.png      □ Pending
│   ├── pista-7-memory.png       □ Pending
│   ├── pista-8-framing.png      □ Pending
│   ├── pista-9-hindsight.png    □ Pending
│   ├── pista-10-authority.png   □ Pending
│   ├── pista-11-double.png      □ Pending
│   ├── pista-12-final.png       □ Pending
│   └── default.png              □ Create fallback
└── ui/
    ├── film-grain-overlay.png   ✓ Generated
    ├── map-background.png       ✓ Generated
    ├── paper-texture.png        □ Pending
    └── vignette-frame.png       □ Pending
```

### 7.2 Create Fallback/Placeholder Assets

**`public/assets/evidence/default.png`** - Create a simple placeholder

For missing assets, create CSS-based fallbacks:

**`components/shared/PlaceholderImage.tsx`**
```tsx
import styles from './PlaceholderImage.module.css';

interface PlaceholderImageProps {
  type: 'background' | 'character' | 'evidence';
  alt?: string;
}

export function PlaceholderImage({ type, alt }: PlaceholderImageProps) {
  const icons = {
    background: '🖼️',
    character: '👤',
    evidence: '🔍'
  };
  
  return (
    <div className={styles.placeholder} aria-label={alt}>
      <span className={styles.icon}>{icons[type]}</span>
    </div>
  );
}
```

**`components/shared/PlaceholderImage.module.css`**
```css
.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-sepia) 0%,
    var(--color-cream) 50%,
    var(--color-sepia) 100%
  );
  border: 2px dashed var(--color-ink);
  border-radius: var(--radius-sm);
}

.icon {
  font-size: 2rem;
  opacity: 0.5;
}
```

### 7.3 Add Character Portrait Component

**`components/scene/CharacterPortrait.tsx`**
```tsx
'use client';

import { useState } from 'react';
import styles from './CharacterPortrait.module.css';
import classNames from 'classnames';

interface CharacterPortraitProps {
  character: string;
  position?: 'left' | 'right';
  speaking?: boolean;
}

const characterMap: Record<string, string> = {
  'detective': '/assets/characters/detective.png',
  'butler': '/assets/characters/butler.png',
  'witness': '/assets/characters/witness-meek.png',
  'elderly': '/assets/characters/guest-elderly.png',
  'expert': '/assets/characters/expert-charming.png',
  'suspect': '/assets/characters/suspect-parole.png',
};

export function CharacterPortrait({ 
  character, 
  position = 'left',
  speaking = false 
}: CharacterPortraitProps) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = characterMap[character] || characterMap['detective'];
  
  return (
    <div className={classNames(
      styles.portrait,
      styles[position],
      { [styles.speaking]: speaking }
    )}>
      {!imageError ? (
        <img 
          src={imageSrc}
          alt={`${character} character`}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={styles.fallback}>
          <span>👤</span>
        </div>
      )}
    </div>
  );
}
```

**`components/scene/CharacterPortrait.module.css`**
```css
.portrait {
  position: fixed;
  bottom: 0;
  width: 200px;
  height: 300px;
  z-index: 10;
  pointer-events: none;
  transition: transform 0.3s ease;
}

.left {
  left: 20px;
}

.right {
  right: 20px;
  transform: scaleX(-1);
}

.speaking {
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.right.speaking {
  animation: bounceFlipped 0.5s ease infinite;
}

@keyframes bounceFlipped {
  0%, 100% { transform: scaleX(-1) translateY(0); }
  50% { transform: scaleX(-1) translateY(-5px); }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
  filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
}

.fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 4rem;
  opacity: 0.3;
}

@media (max-width: 900px) {
  .portrait {
    display: none;
  }
}
```

### 7.4 Add Page Transitions

**`components/layout/PageTransition.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  
  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pathname, children]);
  
  return (
    <div className={isTransitioning ? styles.exiting : styles.entering}>
      {displayChildren}
    </div>
  );
}
```

**`components/layout/PageTransition.module.css`**
```css
.entering {
  animation: fadeSlideIn 0.3s ease-out;
}

.exiting {
  animation: fadeSlideOut 0.3s ease-in;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

### 7.5 Add Sound Effects (Optional)

**`hooks/useSound.ts`**
```tsx
'use client';

import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'incorrect' | 'click' | 'complete' | 'unlock';

const soundPaths: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  click: '/sounds/click.mp3',
  complete: '/sounds/complete.mp3',
  unlock: '/sounds/unlock.mp3',
};

export function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const play = useCallback((type: SoundType) => {
    // Check if user prefers reduced motion (proxy for audio preference)
    if (typeof window === 'undefined') return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(soundPaths[type]);
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    } catch {
      // Audio not available
    }
  }, []);
  
  return { play };
}
```

### 7.6 Add Confetti Effect for Completion

**`components/feedback/Confetti.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './Confetti.module.css';

interface ConfettiProps {
  trigger: boolean;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

const colors = ['#c9a227', '#4a6fa5', '#8b4513', '#27ae60', '#c0392b'];

export function Confetti({ trigger }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  if (particles.length === 0) return null;
  
  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
```

**`components/feedback/Confetti.module.css`**
```css
.container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2000;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: -20px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: fall 3s ease-out forwards;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
```

### 7.7 Add Loading Skeleton

**`components/shared/Skeleton.tsx`**
```tsx
import styles from './Skeleton.module.css';
import classNames from 'classnames';

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ 
  variant = 'rectangle', 
  width, 
  height,
  className 
}: SkeletonProps) {
  return (
    <div 
      className={classNames(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
    />
  );
}
```

**`components/shared/Skeleton.module.css`**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-sepia) 25%,
    var(--color-cream) 50%,
    var(--color-sepia) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.text {
  height: 1em;
  border-radius: 4px;
}

.circle {
  border-radius: var(--radius-round);
}

.rectangle {
  border-radius: var(--radius-md);
}
```

### 7.8 Polish Button Hover States

**`styles/buttons.module.css`** (shared button styles)
```css
/* Vintage button press effect */
.vintageButton {
  position: relative;
  transition: all 0.1s ease;
  box-shadow: 4px 4px 0 var(--color-ink);
}

.vintageButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-ink);
}

.vintageButton:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--color-ink);
}

/* Ink splash on click (pseudo-element) */
.vintageButton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, var(--color-ink) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
}

.vintageButton:active::after {
  opacity: 0.1;
}
```

### 7.9 Add Typewriter Text Effect

**`components/shared/TypewriterText.tsx`**
```tsx
'use client';

import { useEffect, useState } from 'react';
import styles from './TypewriterText.module.css';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ 
  text, 
  speed = 30,
  onComplete 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);
  
  return (
    <span className={styles.typewriter}>
      {displayedText}
      {!isComplete && <span className={styles.cursor}>|</span>}
    </span>
  );
}
```

**`components/shared/TypewriterText.module.css`**
```css
.typewriter {
  font-family: var(--font-display);
}

.cursor {
  animation: blink 0.7s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

## Validation Checklist

- [ ] All generated DALL-E assets load correctly
- [ ] Fallback images display for missing assets
- [ ] Film grain animation runs smoothly (no performance issues)
- [ ] Vignette effect visible on all pages
- [ ] Character portraits appear on scene pages (desktop only)
- [ ] Page transitions are smooth
- [ ] Button hover/active states feel tactile
- [ ] Loading skeletons appear during data fetch
- [ ] Confetti triggers on mission complete
- [ ] Typewriter effect works on story text (if implemented)

## Performance Notes

- Use `loading="lazy"` on images below the fold
- Optimize DALL-E images (compress to ~100-200KB each)
- Consider using WebP format for better compression
- Film grain animation should use `will-change: transform`
- Confetti should be limited to 50 particles max

## Next Phase

[Phase 8: Testing & Refinement](./phase-8-testing.md)
