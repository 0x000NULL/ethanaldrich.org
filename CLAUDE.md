# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build (Next.js with Turbopack)
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

This is a retro BIOS-themed portfolio website built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Zustand for state management.

### Application Flow

The app simulates a vintage computer boot experience:
1. **Boot Screen** (`PostScreen.tsx`) - BIOS POST sequence with memory test animation
2. **CMOS Setup** (`CmosSetup.tsx`) - Optional settings screen (press DEL during boot)
3. **Desktop** (`Desktop.tsx`) - Windows 3.1-style desktop with draggable windows

State transitions are managed by `appState` in `desktop-store.ts`: `booting` → `setup` or `desktop`

### State Management

`src/store/desktop-store.ts` - Zustand store managing:
- App state (booting/setup/desktop)
- Theme selection with localStorage persistence
- Window states (open, position, z-index, focus)
- Easter egg unlock states (turboUnlocked, terminalOpen)

### Theme System

`src/lib/themes.ts` defines 4 color themes (blue, green, amber, turbo) that update CSS variables in `:root`. Themes are applied via `applyTheme()` and persist to localStorage. Components use utility classes (`.bg-bios`, `.text-bios`, `.bg-desktop`) or direct CSS variable references.

### Blog System

Blog posts are MDX files in `src/content/blog/` with YAML frontmatter. Server-side utilities in `src/lib/blog.ts` read posts using `gray-matter`. Client components fetch via API routes (`/api/blog`, `/api/blog/[slug]`).

### Boot Sequence

`src/data/boot-sequence.ts` defines the boot messages. `src/lib/useBootSequence.ts` orchestrates the animation timing and injects time-based messages (morning coffee, night owl, holiday greetings).

### Easter Eggs

- **Konami Code** (↑↑↓↓←→←→BA) - Unlocks TURBO theme (`src/lib/useKonamiCode.ts`)
- **Terminal** (backtick key) - DOS-style terminal with DIR command (`src/components/terminal/Terminal.tsx`)
- **FDISK** - Disk stats view in CMOS Setup (`src/components/fdisk/FdiskStats.tsx`)

### CSS Conventions

Uses Tailwind v4 with CSS variables defined in `globals.css`. The `@theme inline` block exposes CSS variables to Tailwind's color system. Window chrome uses `.chrome-raised` and `.chrome-sunken` classes for 3D beveled effects.
