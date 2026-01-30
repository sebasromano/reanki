# React Puzzle Game - Development Plan

A detective story puzzle game for language learning, built with React and featuring 1930s Cuphead-style visuals.

## Project Overview

- **Config-driven**: Scenes, puzzles, and content defined in JSON
- **Visual style**: 1930s rubber hose animation (Cuphead-inspired)
- **Purpose**: Language learning through detective story puzzles
- **Tech stack**: React 18+, TypeScript, CSS Modules, React Router

## Development Phases

| Phase | Focus | Duration Estimate |
|-------|-------|-------------------|
| [Phase 1](./phase-1-setup.md) | Project Setup & Foundation | 1-2 hours |
| [Phase 2](./phase-2-types-state.md) | Types & State Management | 2-3 hours |
| [Phase 3](./phase-3-layout-navigation.md) | Layout & Navigation | 3-4 hours |
| [Phase 4](./phase-4-scene-story.md) | Scene & Story Components | 3-4 hours |
| [Phase 5](./phase-5-puzzles.md) | Puzzle Components | 4-6 hours |
| [Phase 6](./phase-6-feedback-evidence.md) | Feedback & Evidence System | 2-3 hours |
| [Phase 7](./phase-7-visual-polish.md) | Visual Polish & Assets | 2-3 hours |
| [Phase 8](./phase-8-testing.md) | Testing & Refinement | 2-3 hours |

## File Structure (Target)

```
src/
├── components/
│   ├── layout/
│   ├── map/
│   ├── scene/
│   ├── puzzles/
│   ├── feedback/
│   └── lexicon/
├── context/
├── hooks/
├── types/
├── utils/
└── styles/
public/
├── assets/
│   ├── backgrounds/
│   ├── characters/
│   ├── evidence/
│   └── ui/
└── stories/
docs/
└── plans/
```

## Quick Start

After completing each phase, run:

```bash
npm run dev
```

## Current Asset Status

Generated DALL-E assets (1930s Cuphead style):
- [x] s1-gala.png (Scene 1 background)
- [x] detective.png (Main character)
- [x] pista-1-signal.png (Evidence card 1)
- [x] film-grain-overlay.png (UI texture)
- [x] map-background.png (Map background)
- [ ] Remaining 35 assets (generate as needed)
