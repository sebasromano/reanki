# Phase 1: Project Setup & Foundation

## Objective

Initialize the React project with TypeScript, set up routing, and configure the development environment.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Generated DALL-E assets (at least test images)

## Tasks

### 1.1 Initialize React Project

```bash
npx create-next-app@latest . --typescript --tailwind=no --eslint --app --src-dir=no --import-alias="@/*"
```

Or if preferring Vite:

```bash
npm create vite@latest . -- --template react-ts
```

**Recommended**: Next.js App Router for file-based routing and better image optimization.

### 1.2 Install Dependencies

```bash
npm install react-router-dom classnames
npm install -D @types/node
```

### 1.3 Project Structure

Create the following folder structure:

```
app/
├── layout.tsx
├── page.tsx              # Map view (home)
├── scene/
│   └── [id]/
│       └── page.tsx      # Scene view
├── lexicon/
│   └── page.tsx          # Vocabulary reference
└── evidence/
    └── page.tsx          # Evidence collection

components/
├── layout/
├── map/
├── scene/
├── puzzles/
├── feedback/
└── lexicon/

context/
hooks/
types/
utils/
styles/
```

### 1.4 Configure CSS Modules

Create base styles file:

**`styles/globals.css`**
```css
:root {
  /* Cuphead-inspired color palette */
  --color-sepia: #d4c5a9;
  --color-cream: #f5f0e1;
  --color-ink: #2a2a2a;
  --color-accent-gold: #c9a227;
  --color-accent-blue: #4a6fa5;
  --color-accent-rust: #8b4513;
  --color-shadow: rgba(42, 42, 42, 0.6);
  
  /* Typography */
  --font-display: 'Special Elite', 'Courier New', monospace;
  --font-body: 'Crimson Text', Georgia, serif;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-round: 50%;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-sepia);
  color: var(--color-ink);
  min-height: 100vh;
}
```

### 1.5 Add Google Fonts

Add to `app/layout.tsx` or `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap" rel="stylesheet">
```

### 1.6 Verify Asset Structure

Confirm assets are in place:

```
public/
└── assets/
    ├── backgrounds/
    │   └── s1-gala.png
    ├── characters/
    │   └── detective.png
    ├── evidence/
    │   └── pista-1-signal.png
    └── ui/
        ├── film-grain-overlay.png
        └── map-background.png
```

### 1.7 Create Base Layout

**`app/layout.tsx`**
```tsx
import './globals.css';
import type { Metadata } from 'next';

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
      <body>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
```

## Validation Checklist

- [ ] Project runs with `npm run dev`
- [ ] No TypeScript errors
- [ ] CSS variables load correctly
- [ ] Fonts display properly
- [ ] Assets accessible at `/assets/...` paths
- [ ] Basic routing works (navigate to `/scene/test`)

## Output

A running React application with:
- TypeScript configured
- CSS Modules ready
- Cuphead color palette defined
- Font stack in place
- Asset folder structure verified

## Next Phase

[Phase 2: Types & State Management](./phase-2-types-state.md)
