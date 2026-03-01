# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start development server at localhost:3000
npm run build         # Production build (Next.js with Turbopack)
npm run lint          # Run ESLint
npm run start         # Start production server

# Testing
npm run test          # Run Vitest in watch mode
npm run test:run      # Single test run
npm run test:coverage # Run tests with coverage report
npm run test:e2e      # Run Playwright E2E tests
npm run test:e2e:ui   # Run Playwright with UI mode
```

## Architecture

Retro BIOS-themed portfolio website built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Zustand for state management.

### Application Flow

The app simulates a vintage computer boot experience:
1. **Boot Screen** (`PostScreen.tsx`) - BIOS POST sequence with memory test animation
2. **CMOS Setup** (`CmosSetup.tsx`) - Optional settings screen (press DEL during boot), includes FDISK stats
3. **Desktop** (`Desktop.tsx`) - Windows 3.1-style desktop with draggable, minimizable, maximizable windows
4. **Shutdown** (`ShutdownScreen.tsx`) - Windows 95-style "safe to turn off" screen

State transitions managed by `appState` in `desktop-store.ts`: `booting` → `setup` | `desktop` → `shutdown`

### State Management

`src/store/desktop-store.ts` - Zustand store managing:
- App state (booting/setup/desktop/shutdown)
- Theme selection with localStorage persistence
- Window states (open, minimized, maximized, position, z-index, focus)
- Easter egg unlock states (turboUnlocked, terminalOpen)

### Theme System

`src/lib/themes.ts` defines 4 color themes (blue, green, amber, turbo) that update CSS variables in `:root`. Themes persist to localStorage. Components should use:
- Utility classes: `.bg-bios`, `.text-bios`, `.bg-desktop`
- CSS variables: `var(--bios-success)`, `var(--bios-error)`, `var(--bios-text)`, `var(--bios-bg)`
- Avoid hardcoded hex colors so components respond to theme changes

### Shared Hooks

- `src/hooks/useIsMobile.ts` - Mobile detection with optional touch check. Use `useIsMobile({ checkTouch: true })` for touch-aware detection.

### Blog System

MDX files in `src/content/blog/` with YAML frontmatter. Server utilities in `src/lib/blog.ts` read posts using `gray-matter`. Client components fetch via API routes (`/api/blog`, `/api/blog/[slug]`). Rendered with `next-mdx-remote` using retro-styled components.

### Boot Sequence

`src/data/boot-sequence.ts` defines boot messages. `src/lib/useBootSequence.ts` orchestrates animation timing and injects time-based messages (morning coffee, night owl, holiday greetings).

### Games

`src/components/games/GameSelector.tsx` provides menu to select:
- Snake (`SnakeGame.tsx`)
- Minesweeper (`MinesweeperGame.tsx`) - 9x9 grid, flood-fill reveal
- Breakout (`BreakoutGame.tsx`) - Canvas-based with paddle physics

### Easter Eggs

- **Konami Code** (↑↑↓↓←→←→BA) - Unlocks TURBO theme (`src/lib/useKonamiCode.ts`)
- **Terminal** (backtick key) - DOS terminal with RUN, TYPE, CD, CALC, DIR, SHUTDOWN commands
- **FDISK** - Disk stats + visitor counter in CMOS Setup
- **Screensaver** - Starfield activates after 60s idle

### CSS Conventions

Tailwind v4 with CSS variables in `globals.css`. The `@theme inline` block exposes CSS variables to Tailwind. Window chrome uses `.chrome-raised` and `.chrome-sunken` for 3D beveled effects.

### API Routes

- `/api/blog` - List all blog posts
- `/api/blog/[slug]` - Get single post with serialized MDX
- `/api/stats` - GET/POST visitor statistics (stored in `data/stats.json`, gitignored)

### Testing

- **Unit tests**: Vitest with React Testing Library (`src/**/*.test.ts(x)`)
- **E2E tests**: Playwright (`e2e/*.spec.ts`)
- **Test setup**: `src/__tests__/setup.ts` provides global mocks (localStorage, matchMedia, ResizeObserver)
- **MSW handlers**: `src/__tests__/mocks/handlers.ts` for API mocking
