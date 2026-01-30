# Phase 8: Testing & Refinement

## Objective

Test all functionality, fix bugs, optimize performance, and prepare for deployment.

## Tasks

### 8.1 Functional Testing Checklist

#### Map/Navigation
- [ ] Home page loads mission config correctly
- [ ] Scene nodes display with correct status (locked/unlocked/completed)
- [ ] First scene is unlocked by default
- [ ] Clicking locked scene does nothing
- [ ] Clicking unlocked scene navigates to scene page
- [ ] Progress bar reflects completion accurately
- [ ] Navigation links work (Lexicon, Evidence)
- [ ] Back to map link works from all pages

#### Scene Flow
- [ ] Scene page loads correct scene data
- [ ] Story panel displays English text with highlighted terms
- [ ] Language toggle switches to Spanish
- [ ] Term tooltips appear on hover/click
- [ ] "Continue to Puzzles" button advances phase
- [ ] Puzzle container shows correct puzzle type
- [ ] Puzzle progress dots update correctly
- [ ] Mistakes counter (hearts) updates on wrong answers
- [ ] Hint button works (one per scene)
- [ ] All puzzles complete advances to conclusion
- [ ] Conclusion panel displays with evidence

#### Puzzle Types
- [ ] **MCQ Translation**: All choices clickable, feedback shows, retry works
- [ ] **Match Pairs**: Pairs can be matched, incorrect shakes, all pairs required
- [ ] **Fill Blank**: Options selectable, blank fills, confirm validates
- [ ] **Logic Connectors**: Connectors selectable, sentence fills, all required
- [ ] **Boss Mix**: Sequential questions, score displayed, review shows

#### Evidence System
- [ ] Evidence collected on conclusion confirm
- [ ] Evidence page shows collected items
- [ ] Uncollected evidence shows as locked
- [ ] Progress bar shows collection percentage
- [ ] Evidence cards display image, title, note, tags

#### Progress Persistence
- [ ] Progress saves to localStorage
- [ ] Refreshing page maintains progress
- [ ] Completing scene unlocks next scene
- [ ] Reset progress works (if implemented)

### 8.2 Create Lexicon Page

**`app/lexicon/page.tsx`**
```tsx
import { LexiconPanel } from '@/components/lexicon/LexiconPanel';

export default function LexiconPage() {
  return <LexiconPanel />;
}
```

**`components/lexicon/LexiconPanel.tsx`**
```tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useMission } from '@/context/MissionContext';
import styles from './LexiconPanel.module.css';

export function LexiconPanel() {
  const { config, isLoading } = useMission();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'term' | 'translation'>('term');
  
  const filteredTerms = useMemo(() => {
    if (!config) return [];
    
    let terms = [...config.lexicon];
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(query) ||
        t.translation.toLowerCase().includes(query)
      );
    }
    
    // Sort
    terms.sort((a, b) => {
      if (sortBy === 'term') {
        return a.term.localeCompare(b.term);
      }
      return a.translation.localeCompare(b.translation);
    });
    
    return terms;
  }, [config, searchQuery, sortBy]);
  
  if (isLoading) {
    return <div className={styles.loading}>Cargando léxico...</div>;
  }
  
  if (!config) {
    return <div className={styles.error}>No hay datos disponibles</div>;
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Volver al mapa</Link>
        <h1 className={styles.title}>📖 Léxico</h1>
        <p className={styles.subtitle}>
          {config.lexicon.length} términos disponibles
        </p>
      </header>
      
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Buscar término o traducción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        
        <div className={styles.sortButtons}>
          <button
            className={sortBy === 'term' ? styles.sortActive : styles.sortButton}
            onClick={() => setSortBy('term')}
          >
            A-Z (EN)
          </button>
          <button
            className={sortBy === 'translation' ? styles.sortActive : styles.sortButton}
            onClick={() => setSortBy('translation')}
          >
            A-Z (ES)
          </button>
        </div>
      </div>
      
      <div className={styles.termsList}>
        {filteredTerms.length === 0 ? (
          <p className={styles.noResults}>No se encontraron resultados</p>
        ) : (
          filteredTerms.map((term, index) => (
            <article key={index} className={styles.termCard}>
              <div className={styles.termHeader}>
                <span className={styles.termText}>{term.term}</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.translation}>{term.translation}</span>
              </div>
              {term.note && (
                <p className={styles.note}>{term.note}</p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
```

**`components/lexicon/LexiconPanel.module.css`**
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

.controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.searchInput {
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  background: white;
  font-family: var(--font-body);
}

.searchInput:focus {
  outline: none;
  border-color: var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.2);
}

.sortButtons {
  display: flex;
  gap: var(--spacing-xs);
}

.sortButton,
.sortActive {
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-display);
  font-size: 0.75rem;
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sortButton {
  background: var(--color-cream);
  color: var(--color-ink);
}

.sortButton:hover {
  background: var(--color-sepia);
}

.sortActive {
  background: var(--color-ink);
  color: var(--color-cream);
}

.termsList {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.termCard {
  background: var(--color-cream);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
}

.termCard:hover {
  transform: translateX(4px);
  box-shadow: 2px 2px 0 var(--color-ink);
}

.termHeader {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.termText {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-accent-rust);
}

.arrow {
  color: var(--color-ink);
  opacity: 0.5;
}

.translation {
  font-weight: 600;
  color: var(--color-ink);
}

.note {
  margin: var(--spacing-sm) 0 0 0;
  font-size: 0.875rem;
  font-style: italic;
  color: var(--color-ink);
  opacity: 0.8;
  padding-left: var(--spacing-md);
  border-left: 2px solid var(--color-accent-gold);
}

.noResults {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-ink);
  opacity: 0.6;
}

.loading,
.error {
  text-align: center;
  padding: var(--spacing-xl);
  font-family: var(--font-display);
}
```

### 8.3 Accessibility Testing

#### Keyboard Navigation
- [ ] All interactive elements focusable with Tab
- [ ] Focus order is logical
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/tooltips

#### Screen Reader
- [ ] Page titles announce correctly
- [ ] Headings hierarchy is logical (h1 > h2 > h3)
- [ ] Images have alt text
- [ ] Buttons have accessible names
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Progress updates announced

#### Color & Contrast
- [ ] Text meets 4.5:1 contrast ratio
- [ ] Interactive elements meet 3:1 ratio
- [ ] Information not conveyed by color alone
- [ ] Focus indicators visible

### 8.4 Performance Testing

#### Lighthouse Audit
```bash
# Run in Chrome DevTools > Lighthouse
# Target scores:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 90
# - SEO: > 90
```

#### Image Optimization
```bash
# Compress all DALL-E images
# Target: < 200KB per image
# Format: WebP with PNG fallback
```

#### Bundle Size Check
```bash
npm run build
# Check .next/static folder sizes
# Target: < 200KB initial JS
```

### 8.5 Mobile Testing

#### Responsive Breakpoints
- [ ] 320px (small phone)
- [ ] 375px (iPhone SE)
- [ ] 414px (iPhone Pro Max)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)

#### Touch Interactions
- [ ] Buttons have adequate touch targets (44x44px minimum)
- [ ] Swipe gestures don't interfere
- [ ] No hover-only interactions
- [ ] Tooltips work on tap

### 8.6 Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 8.7 Error Handling

**`components/shared/ErrorBoundary.tsx`**
```tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className={styles.errorContainer}>
          <h2 className={styles.title}>Algo salió mal</h2>
          <p className={styles.message}>
            Ha ocurrido un error inesperado. Por favor, recarga la página.
          </p>
          <button 
            className={styles.reloadButton}
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**`components/shared/ErrorBoundary.module.css`**
```css
.errorContainer {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-xl);
}

.title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-accent-rust);
  margin: 0 0 var(--spacing-md) 0;
}

.message {
  font-size: 1rem;
  color: var(--color-ink);
  margin: 0 0 var(--spacing-lg) 0;
}

.reloadButton {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-display);
  font-size: 1rem;
  background: var(--color-accent-gold);
  color: var(--color-ink);
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--color-ink);
  transition: all 0.2s ease;
}

.reloadButton:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--color-ink);
}
```

### 8.8 Final Polish Items

- [ ] Add favicon (detective-themed)
- [ ] Add Open Graph meta tags for sharing
- [ ] Add manifest.json for PWA (optional)
- [ ] Add 404 page
- [ ] Add loading state for initial config fetch
- [ ] Verify all console errors resolved
- [ ] Remove any console.log statements
- [ ] Test with slow network (3G throttling)

### 8.9 Deployment Checklist

```bash
# Build for production
npm run build

# Run production build locally
npm run start

# Deploy to Vercel (recommended for Next.js)
vercel --prod

# Or deploy to other platforms:
# - Netlify
# - AWS Amplify
# - GitHub Pages (static export)
```

#### Environment Variables (if any)
```
# .env.local
NEXT_PUBLIC_ANALYTICS_ID=xxx (optional)
```

### 8.10 Post-Launch Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (if desired)
- [ ] Monitor Core Web Vitals
- [ ] Gather user feedback
- [ ] Plan future improvements

## Known Issues / Future Improvements

Track any discovered issues or ideas for future phases:

1. **Audio**: Sound effects not implemented (optional feature)
2. **Animations**: Could add more micro-interactions
3. **Offline**: PWA support for offline play
4. **Multi-mission**: Support for loading different JSON configs
5. **Leaderboard**: Track completion times (optional)
6. **Achievements**: Badge system for perfect scores

## Completion Criteria

The project is considered complete when:

- [ ] All 12 scenes playable start to finish
- [ ] All 5 puzzle types working correctly
- [ ] Progress persists across sessions
- [ ] Evidence collection system functional
- [ ] Lexicon searchable and complete
- [ ] Visual style consistent (1930s Cuphead aesthetic)
- [ ] No critical bugs or console errors
- [ ] Responsive on mobile devices
- [ ] Accessible to keyboard/screen reader users
- [ ] Performance scores > 90 on Lighthouse
