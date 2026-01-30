# ReAnki - The Case of the Misleading Mind

A detective-themed puzzle game for language learning, built with Next.js and React.

## About This Project

This is a **personal project** with two main goals:

### 1. Vocabulary Learning

I created this game to improve my Spanish vocabulary through an engaging, story-driven experience. Instead of traditional flashcards, this approach uses:

- **Contextual learning** - Terms appear within a detective narrative
- **Active recall** - Multiple puzzle types test comprehension
- **Spaced repetition** - Scene progression reinforces previously learned terms
- **Gamification** - Evidence collection and scene unlocking provide motivation

### 2. AI-Assisted Code Generation Experiment

This project is also an experiment in **AI-assisted development**. The entire codebase was generated through conversation with Claude (Anthropic's AI), using Cursor IDE as the development environment.

**What this means:**
- All React components, TypeScript types, CSS styles, and game logic were generated via natural language prompts
- The project structure follows a phased development plan, also AI-generated
- Visual assets (40+ images) were created using DALL-E 3 with carefully crafted prompts
- A custom asset generation script automates the image creation pipeline

**Why this matters:**
- Demonstrates the current capabilities of AI pair programming
- Tests how well AI understands complex, multi-file React applications
- Explores the workflow of iterating on AI-generated code
- Evaluates AI's ability to maintain consistency across a large codebase

The conversation history serves as documentation of this human-AI collaboration approach to software development.

## Features

- 12 detective scenes with unique backgrounds
- 5 puzzle types (MCQ, Match Pairs, Fill Blank, Logic Connectors, Boss Mix)
- Cuphead-inspired 1930s cartoon visual style
- Progress persistence via localStorage
- Bilingual story content (English/Spanish)
- Evidence collection and lexicon systems

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** CSS Modules with CSS variables
- **State:** React Context API
- **Fonts:** Crimson Text, Special Elite (Google Fonts)
- **Assets:** DALL-E 3 generated images

## Installation

### Prerequisites

- Node.js 20.9.0 or higher (LTS recommended)
- npm, yarn, pnpm, or bun

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reanki.git
   cd reanki
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Optional: Generate New Assets

If you want to regenerate or add new DALL-E images:

1. **Add your OpenAI API key**
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=sk-your-key-here" > .env
   ```

2. **Preview what will be generated**
   ```bash
   npm run generate-assets:dry
   ```

3. **Generate pending assets**
   ```bash
   npm run generate-assets
   ```

## Project Structure

```
reanki/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Map/home page
│   ├── scene/[id]/        # Dynamic scene pages
│   ├── lexicon/           # Vocabulary reference
│   └── evidence/          # Collected evidence
├── components/
│   ├── layout/            # AppShell, Header, Vignette
│   ├── map/               # SceneMap, SceneNode
│   ├── scene/             # SceneView, StoryPanel, etc.
│   └── puzzles/           # All 5 puzzle type components
├── context/               # MissionContext (state management)
├── types/                 # TypeScript interfaces
├── public/
│   ├── assets/            # Generated images
│   │   ├── backgrounds/   # Scene backgrounds
│   │   ├── characters/    # Character portraits
│   │   ├── evidence/      # Evidence icons
│   │   └── ui/            # UI elements
│   └── stories/           # Game configuration JSON
├── scripts/               # Asset generation script
└── docs/                  # Development plans
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run generate-assets` | Generate DALL-E images |
| `npm run generate-assets:dry` | Preview asset generation |

## License

Personal project - not intended for redistribution.

## Acknowledgments

- Visual style inspired by Cuphead and 1930s Fleischer animation
- Built with assistance from Claude (Anthropic) via Cursor IDE
- Psychological concepts adapted from behavioral science research
